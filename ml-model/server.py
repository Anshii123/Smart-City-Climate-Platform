import os
import sys
import json
from http.server import BaseHTTPRequestHandler, HTTPServer

_preprocessor = None
_model_risk = None
_model_vulnerability = None
_model_plantation = None
_models_loaded = False

STATS = {
    'temp_min': 10.080456590106968,
    'temp_max': 34.95868778482374,
    'pop_min': 506.0,
    'pop_max': 9996.0,
    'energy_min': 1021.6962904231864,
    'energy_max': 49977.652017235625,
    'aqi_min': 30.0,
    'aqi_max': 199.0
}

LAND_COVER_WEIGHTS = {
    'Industrial': 1.0,
    'Urban': 0.8,
    'Water': 0.1,
    'Green Space': 0.0
}

def load_resources():
    global _preprocessor, _model_risk, _model_vulnerability, _model_plantation, _models_loaded
    if _models_loaded:
        return True
    try:
        import joblib
        import pandas as pd

        models_dir = os.path.dirname(os.path.abspath(__file__))
        preprocessor_path = os.path.join(models_dir, 'models', 'preprocessor.joblib')
        model_risk_path = os.path.join(models_dir, 'models', 'model_risk.joblib')
        model_vuln_path = os.path.join(models_dir, 'models', 'model_vulnerability.joblib')
        model_plant_path = os.path.join(models_dir, 'models', 'model_plantation.joblib')

        if all(os.path.exists(p) for p in [preprocessor_path, model_risk_path, model_vuln_path, model_plant_path]):
            _preprocessor = joblib.load(preprocessor_path)
            _model_risk = joblib.load(model_risk_path)
            _model_vulnerability = joblib.load(model_vuln_path)
            _model_plantation = joblib.load(model_plant_path)
            _models_loaded = True
            return True
        else:
            return False
    except Exception:
        return False

def predict_scores_fallback(data):
    temp = float(data.get('temperature', 25.0))
    pop = float(data.get('populationDensity', 3000.0))
    energy = float(data.get('energyConsumption', 15000.0))
    aqi = float(data.get('aqi', 80.0))
    green = float(data.get('urbanGreennessRatio', 30.0))
    lc = str(data.get('landCover', 'Urban'))

    norm_temp = (temp - STATS['temp_min']) / (STATS['temp_max'] - STATS['temp_min'])
    norm_pop = (pop - STATS['pop_min']) / (STATS['pop_max'] - STATS['pop_min'])
    norm_energy = (energy - STATS['energy_min']) / (STATS['energy_max'] - STATS['energy_min'])
    norm_aqi = (aqi - STATS['aqi_min']) / (STATS['aqi_max'] - STATS['aqi_min'])
    inv_green = 1.0 - (green / 100.0)
    lc_w = LAND_COVER_WEIGHTS.get(lc, 0.5)

    risk = (0.5 * norm_temp + 0.3 * lc_w + 0.2 * norm_energy) * 100.0
    vuln = (0.4 * norm_pop + 0.3 * norm_aqi + 0.3 * inv_green) * 100.0
    plant = (0.4 * inv_green + 0.2 * norm_temp + 0.2 * norm_pop + 0.2 * norm_aqi) * 100.0

    return {
        'Heat Risk Score': round(max(0.0, min(100.0, risk)), 2),
        'Heat Vulnerability Score': round(max(0.0, min(100.0, vuln)), 2),
        'Plantation Priority Score': round(max(0.0, min(100.0, plant)), 2)
    }

def predict_scores(data):
    if load_resources() and _preprocessor is not None:
        try:
            import pandas as pd
            input_data = pd.DataFrame([{
                'Latitude': float(data.get('latitude', 0.0)),
                'Longitude': float(data.get('longitude', 0.0)),
                'Elevation': float(data.get('elevation', 500.0)),
                'Temperature': float(data.get('temperature', 25.0)),
                'Land Cover': str(data.get('landCover', 'Urban')),
                'Population Density': float(data.get('populationDensity', 3000.0)),
                'Energy Consumption': float(data.get('energyConsumption', 15000.0)),
                'AQI': float(data.get('aqi', 80.0)),
                'Urban Greenness Ratio': float(data.get('urbanGreennessRatio', 30.0))
            }])
            X_processed = _preprocessor.transform(input_data)
            risk = float(_model_risk.predict(X_processed)[0])
            vuln = float(_model_vulnerability.predict(X_processed)[0])
            plant = float(_model_plantation.predict(X_processed)[0])
            return {
                'Heat Risk Score': round(risk, 2),
                'Heat Vulnerability Score': round(vuln, 2),
                'Plantation Priority Score': round(plant, 2)
            }
        except Exception as e:
            print(f"[AI/ML Server] Inference warning: {e}. Using regression fallback.", flush=True)

    return predict_scores_fallback(data)

class PredictionHandler(BaseHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        path = self.path.split('?')[0]
        if path in ['/', '/health', '/api/health', '/predict', '/api/predict']:
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self._send_cors_headers()
            self.end_headers()
            response_data = {
                'status': 'UP',
                'service': 'Smart City Climate AI/ML Prediction Server',
                'version': '1.0.0',
                'models_loaded': _models_loaded,
                'endpoints': {
                    'health': '/health',
                    'predict': 'POST /predict'
                }
            }
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

    def do_POST(self):
        path = self.path.split('?')[0]
        if path in ['/predict', '/api/predict']:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            try:
                params = json.loads(post_data.decode('utf-8')) if post_data else {}
                city = params.get('cityName') or params.get('city') or 'Custom Location'
                print(f"[AI/ML Server] 📥 Incoming request from Backend for '{city}' (Temp: {params.get('temperature')}°C, AQI: {params.get('aqi')}, Land: {params.get('landCover')})", flush=True)
                results = predict_scores(params)
                print(f"[AI/ML Server] 📤 Prediction calculated: Heat Risk={results.get('Heat Risk Score')}, Vulnerability={results.get('Heat Vulnerability Score')}, Plantation={results.get('Plantation Priority Score')}", flush=True)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(results).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

    def log_message(self, format, *args):
        # Keep console output clean
        pass

# Handler alias for Vercel Python Serverless Function
handler = PredictionHandler

def run(port=8000, host='0.0.0.0'):
    load_resources()
    server_address = (host, port)
    httpd = HTTPServer(server_address, PredictionHandler)
    print(f"[AI/ML Server] Prediction server running on http://{host}:{port}", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n[AI/ML Server] Stopping prediction server...", flush=True)
        httpd.server_close()

if __name__ == '__main__':
    port = 8000
    host = '0.0.0.0'
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    if len(sys.argv) > 2:
        host = sys.argv[2]
    run(port, host)


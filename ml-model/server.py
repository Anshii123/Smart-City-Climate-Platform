import os
import sys
import json
import joblib
import pandas as pd
from http.server import BaseHTTPRequestHandler, HTTPServer

_preprocessor = None
_model_risk = None
_model_vulnerability = None
_model_plantation = None

def load_resources():
    global _preprocessor, _model_risk, _model_vulnerability, _model_plantation
    if _preprocessor is None:
        models_dir = os.path.dirname(os.path.abspath(__file__))
        preprocessor_path = os.path.join(models_dir, 'models', 'preprocessor.joblib')
        model_risk_path = os.path.join(models_dir, 'models', 'model_risk.joblib')
        model_vuln_path = os.path.join(models_dir, 'models', 'model_vulnerability.joblib')
        model_plant_path = os.path.join(models_dir, 'models', 'model_plantation.joblib')

        if not all(os.path.exists(p) for p in [preprocessor_path, model_risk_path, model_vuln_path, model_plant_path]):
            raise FileNotFoundError("Trained models not found. Please run train.py first to train models.")

        print("Loading models into memory...", flush=True)
        _preprocessor = joblib.load(preprocessor_path)
        _model_risk = joblib.load(model_risk_path)
        _model_vulnerability = joblib.load(model_vuln_path)
        _model_plantation = joblib.load(model_plant_path)
        print("Models loaded successfully.", flush=True)

def predict_scores(data):
    input_data = pd.DataFrame([{
        'Latitude': float(data['latitude']),
        'Longitude': float(data['longitude']),
        'Elevation': float(data['elevation']),
        'Temperature': float(data['temperature']),
        'Land Cover': str(data['landCover']),
        'Population Density': float(data['populationDensity']),
        'Energy Consumption': float(data['energyConsumption']),
        'AQI': float(data['aqi']),
        'Urban Greenness Ratio': float(data['urbanGreennessRatio'])
    }])

    X_processed = _preprocessor.transform(input_data)

    risk_score = float(_model_risk.predict(X_processed)[0])
    vulnerability_score = float(_model_vulnerability.predict(X_processed)[0])
    plantation_score = float(_model_plantation.predict(X_processed)[0])

    return {
        'Heat Risk Score': round(risk_score, 2),
        'Heat Vulnerability Score': round(vulnerability_score, 2),
        'Plantation Priority Score': round(plantation_score, 2)
    }

class PredictionHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/predict':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                params = json.loads(post_data.decode('utf-8'))
                results = predict_scores(params)
                
                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps(results).encode('utf-8'))
            except Exception as e:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def log_message(self, format, *args):
        # Suppress request log outputs to keep standard output clean
        pass

def run(port=5005):
    load_resources()
    server_address = ('127.0.0.1', port)
    httpd = HTTPServer(server_address, PredictionHandler)
    print(f"Prediction server running on http://127.0.0.1:{port}", flush=True)
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping prediction server...", flush=True)
        httpd.server_close()

if __name__ == '__main__':
    port = 5005
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    run(port)

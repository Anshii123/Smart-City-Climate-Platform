import os
import sys
import argparse
import json
import joblib
import pandas as pd

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

        _preprocessor = joblib.load(preprocessor_path)
        _model_risk = joblib.load(model_risk_path)
        _model_vulnerability = joblib.load(model_vuln_path)
        _model_plantation = joblib.load(model_plant_path)

def predict_scores(latitude, longitude, elevation, temperature, land_cover, population_density, energy_consumption, aqi, urban_greenness_ratio):
    load_resources()

    input_data = pd.DataFrame([{
        'Latitude': float(latitude),
        'Longitude': float(longitude),
        'Elevation': float(elevation),
        'Temperature': float(temperature),
        'Land Cover': str(land_cover),
        'Population Density': float(population_density),
        'Energy Consumption': float(energy_consumption),
        'AQI': float(aqi),
        'Urban Greenness Ratio': float(urban_greenness_ratio)
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

def main():
    parser = argparse.ArgumentParser(description="Predict Smart City Climate Scores using trained models.")
    parser.add_argument('--lat', type=float, required=True, help="Latitude")
    parser.add_argument('--lng', type=float, required=True, help="Longitude")
    parser.add_argument('--elevation', type=float, required=True, help="Elevation in meters")
    parser.add_argument('--temp', type=float, required=True, help="Temperature in °C")
    parser.add_argument('--landcover', type=str, required=True, choices=['Water', 'Green Space', 'Industrial', 'Urban'], help="Land Cover type")
    parser.add_argument('--popdensity', type=float, required=True, help="Population Density (people/km²)")
    parser.add_argument('--energy', type=float, required=True, help="Energy Consumption (kWh)")
    parser.add_argument('--aqi', type=float, required=True, help="Air Quality Index")
    parser.add_argument('--greenness', type=float, required=True, help="Urban Greenness Ratio (%)")

    args = parser.parse_args()

    try:
        results = predict_scores(
            latitude=args.lat,
            longitude=args.lng,
            elevation=args.elevation,
            temperature=args.temp,
            land_cover=args.landcover,
            population_density=args.popdensity,
            energy_consumption=args.energy,
            aqi=args.aqi,
            urban_greenness_ratio=args.greenness
        )
        print(json.dumps(results, indent=2))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)

if __name__ == '__main__':
    main()

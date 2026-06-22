import os
import json
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.ensemble import RandomForestRegressor

def main():
    # Ensure models directory exists
    os.makedirs('models', exist_ok=True)

    # Load dataset
    dataset_path = '../dataset/urban_heat_island_dataset.csv'
    if not os.path.exists(dataset_path):
        print(f"Error: Dataset not found at {dataset_path}")
        return

    df = pd.read_csv(dataset_path)

    # Clean column names
    df.columns = [c.strip() for c in df.columns]

    # Rename columns to standardized names
    column_mapping = {
        'Elevation (m)': 'Elevation',
        'Temperature (°C)': 'Temperature',
        'Population Density (people/km²)': 'Population Density',
        'Energy Consumption (kWh)': 'Energy Consumption',
        'Air Quality Index (AQI)': 'AQI',
        'Urban Greenness Ratio (%)': 'Urban Greenness Ratio'
    }
    df = df.rename(columns=column_mapping)

    # Extract min/max bounds for scaling formulas
    stats = {
        'temp_min': float(df['Temperature'].min()),
        'temp_max': float(df['Temperature'].max()),
        'pop_min': float(df['Population Density'].min()),
        'pop_max': float(df['Population Density'].max()),
        'energy_min': float(df['Energy Consumption'].min()),
        'energy_max': float(df['Energy Consumption'].max()),
        'aqi_min': float(df['AQI'].min()),
        'aqi_max': float(df['AQI'].max())
    }

    # Save stats as JSON for predict.py
    with open('models/dataset_stats.json', 'w') as f:
        json.dump(stats, f, indent=2)

    # Map land cover to risk weights
    land_cover_weights = {
        'Industrial': 1.0,
        'Urban': 0.8,
        'Water': 0.1,
        'Green Space': 0.0
    }
    df['land_cover_weight'] = df['Land Cover'].map(land_cover_weights).fillna(0.5)

    # Calculate normalized columns
    df['norm_temp'] = (df['Temperature'] - stats['temp_min']) / (stats['temp_max'] - stats['temp_min'])
    df['norm_pop'] = (df['Population Density'] - stats['pop_min']) / (stats['pop_max'] - stats['pop_min'])
    df['norm_energy'] = (df['Energy Consumption'] - stats['energy_min']) / (stats['energy_max'] - stats['energy_min'])
    df['norm_aqi'] = (df['AQI'] - stats['aqi_min']) / (stats['aqi_max'] - stats['aqi_min'])
    df['inv_green'] = 1.0 - (df['Urban Greenness Ratio'] / 100.0)

    # Compute targets
    df['Heat Risk Score'] = (0.5 * df['norm_temp'] + 0.3 * df['land_cover_weight'] + 0.2 * df['norm_energy']) * 100.0
    df['Heat Vulnerability Score'] = (0.4 * df['norm_pop'] + 0.3 * df['norm_aqi'] + 0.3 * df['inv_green']) * 100.0
    df['Plantation Priority Score'] = (0.4 * df['inv_green'] + 0.2 * df['norm_temp'] + 0.2 * df['norm_pop'] + 0.2 * df['norm_aqi']) * 100.0

    # Train-Test Split (80/20)
    features_list = ['Latitude', 'Longitude', 'Elevation', 'Temperature', 'Land Cover', 'Population Density', 'Energy Consumption', 'AQI', 'Urban Greenness Ratio']
    X = df[features_list]
    y = df[['Heat Risk Score', 'Heat Vulnerability Score', 'Plantation Priority Score']]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    # Save test split for evaluation
    test_data = pd.concat([X_test, y_test], axis=1)
    test_data.to_csv('models/test_split.csv', index=False)

    # Preprocessing pipeline setup
    categorical_cols = ['Land Cover']
    numeric_cols = ['Latitude', 'Longitude', 'Elevation', 'Temperature', 'Population Density', 'Energy Consumption', 'AQI', 'Urban Greenness Ratio']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numeric_cols),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_cols)
        ]
    )

    X_train_processed = preprocessor.fit_transform(X_train)
    joblib.dump(preprocessor, 'models/preprocessor.joblib')

    # Train RandomForest Regressors
    print("Training Heat Risk model...")
    model_risk = RandomForestRegressor(n_estimators=100, random_state=42)
    model_risk.fit(X_train_processed, y_train['Heat Risk Score'])
    joblib.dump(model_risk, 'models/model_risk.joblib')

    print("Training Heat Vulnerability model...")
    model_vulnerability = RandomForestRegressor(n_estimators=100, random_state=42)
    model_vulnerability.fit(X_train_processed, y_train['Heat Vulnerability Score'])
    joblib.dump(model_vulnerability, 'models/model_vulnerability.joblib')

    print("Training Plantation Priority model...")
    model_plantation = RandomForestRegressor(n_estimators=100, random_state=42)
    model_plantation.fit(X_train_processed, y_train['Plantation Priority Score'])
    joblib.dump(model_plantation, 'models/model_plantation.joblib')

    print("Model training complete. Preprocessors and models saved to 'models/' directory.")

if __name__ == '__main__':
    main()

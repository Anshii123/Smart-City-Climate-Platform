import os
import joblib
import pandas as pd
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

def main():
    test_split_path = 'models/test_split.csv'
    if not os.path.exists(test_split_path):
        print(f"Error: Test split dataset not found at {test_split_path}. Run train.py first.")
        return

    # Load test split
    df_test = pd.read_csv(test_split_path)

    # Load models & preprocessors
    try:
        preprocessor = joblib.load('models/preprocessor.joblib')
        model_risk = joblib.load('models/model_risk.joblib')
        model_vulnerability = joblib.load('models/model_vulnerability.joblib')
        model_plantation = joblib.load('models/model_plantation.joblib')
    except Exception as e:
        print(f"Error loading models or preprocessor: {e}")
        return

    # Split features and targets
    features_list = ['Latitude', 'Longitude', 'Elevation', 'Temperature', 'Land Cover', 'Population Density', 'Energy Consumption', 'AQI', 'Urban Greenness Ratio']
    X_test = df_test[features_list]
    
    y_test_risk = df_test['Heat Risk Score']
    y_test_vulnerability = df_test['Heat Vulnerability Score']
    y_test_plantation = df_test['Plantation Priority Score']

    # Transform features
    X_test_processed = preprocessor.transform(X_test)

    # Predictions
    pred_risk = model_risk.predict(X_test_processed)
    pred_vulnerability = model_vulnerability.predict(X_test_processed)
    pred_plantation = model_plantation.predict(X_test_processed)

    # Metric generator
    def get_metrics(y_true, y_pred, name):
        mae = mean_absolute_error(y_true, y_pred)
        mse = mean_squared_error(y_true, y_pred)
        rmse = np.sqrt(mse)
        r2 = r2_score(y_true, y_pred)
        return (
            f"=== {name} Metrics ===\n"
            f"Mean Absolute Error (MAE): {mae:.4f}\n"
            f"Mean Squared Error (MSE):  {mse:.4f}\n"
            f"Root Mean Squared Error (RMSE): {rmse:.4f}\n"
            f"R-squared (R2 Score):      {r2:.4f}\n\n"
        )

    risk_report = get_metrics(y_test_risk, pred_risk, "Heat Risk Score")
    vuln_report = get_metrics(y_test_vulnerability, pred_vulnerability, "Heat Vulnerability Score")
    plant_report = get_metrics(y_test_plantation, pred_plantation, "Plantation Priority Score")

    full_report = (
        "=========================================\n"
        "        MODEL EVALUATION REPORT         \n"
        "=========================================\n\n"
        f"{risk_report}"
        f"{vuln_report}"
        f"{plant_report}"
    )

    # Show report
    print(full_report)

    # Save to file
    with open('models/evaluation_report.txt', 'w') as f:
        f.write(full_report)
    print("Report written successfully to 'models/evaluation_report.txt'.")

if __name__ == '__main__':
    main()

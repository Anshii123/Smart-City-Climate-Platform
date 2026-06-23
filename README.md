# 🌍 Smart City Climate Platform

An AI-powered Smart City Climate Platform that predicts Urban Heat Island (UHI) risks, identifies climate-vulnerable regions, and recommends optimized urban greening strategies for sustainable city planning.

## 📌 Problem Statement

Rapid urbanization, increasing concrete surfaces, traffic congestion, and declining green cover have intensified Urban Heat Island (UHI) effects in cities.

Most cities lack a data-driven system capable of:

* Predicting future heat-risk zones
* Identifying vulnerable communities
* Prioritizing tree plantation efforts
* Recommending climate mitigation strategies
* Visualizing climate risk through interactive dashboards

This project addresses these challenges using Machine Learning, Geospatial Analytics, and Full Stack Web Development.

---

# 🎯 Objectives

The platform aims to:

* Predict Urban Heat Risk Scores
* Calculate Heat Vulnerability Scores
* Estimate Plantation Priority Scores
* Forecast Future Temperature Trends
* Generate Climate Recommendations
* Visualize Heat Risk using Interactive Maps
* Assist urban planners in decision-making

---

# 🚀 Features

## Climate Assessment

Users can enter:

* City Name
* Latitude
* Longitude
* Elevation
* Temperature
* Land Cover
* Population Density
* Energy Consumption
* Air Quality Index (AQI)
* Urban Greenness Ratio

The platform generates:

* Heat Risk Score
* Heat Vulnerability Score
* Plantation Priority Score
* Future Temperature Prediction
* Risk Category
* Green Cover Target
* Temperature Reduction Estimate
* Climate Recommendations

---

## Interactive Heat Map

Visualizes:

* Heat Risk Zones
* Vulnerability Levels
* Plantation Priorities

Color Coding:

* 🟢 Low Risk
* 🟡 Medium Risk
* 🔴 High Risk

---

## Analytics Dashboard

Provides:

* Temperature Distribution
* AQI Analysis
* Population Density Insights
* Heat Risk Distribution
* Plantation Priority Distribution
* Green Cover Analysis

---

## Prediction History

Stores all assessments in MongoDB.

Features:

* View Past Predictions
* Search Predictions
* Delete Predictions
* Track Climate Trends

---

## City Comparison

Compare multiple cities based on:

* Heat Risk Score
* Vulnerability Score
* Plantation Priority
* Future Temperature
* Sustainability Indicators

---

## Plantation Ranking System

Ranks cities requiring urgent plantation efforts.

Outputs:

* Plantation Priority Ranking
* Green Cover Targets
* Mitigation Recommendations

---

# 🧠 Machine Learning Models

The platform uses Random Forest Regression models for:

1. Heat Risk Prediction
2. Heat Vulnerability Prediction
3. Plantation Priority Prediction

Models are trained using:

* Temperature
* AQI
* Population Density
* Energy Consumption
* Elevation
* Urban Greenness Ratio
* Land Cover

---

# 🛠 Technology Stack

## Frontend

* React.js
* Vite
* Tailwind CSS
* Framer Motion
* Recharts
* Lucide React
* React Router

## Backend

* Node.js
* Express.js
* JWT Authentication
* Multer
* REST APIs

## Database

* MongoDB
* MongoDB Compass

## Machine Learning

* Python
* Scikit-Learn
* Pandas
* NumPy
* Joblib

---

# 📂 Project Structure

Smart-City-Climate-Platform/

├── frontend/

│ ├── src/

│ ├── public/

│ └── package.json

│

├── backend/

│ ├── controllers/

│ ├── routes/

│ ├── models/

│ ├── services/

│ └── server.js

│

├── ml-model/

│ ├── data/

│ ├── train.py

│ ├── predict.py

│ ├── server.py

│ └── models/

│

├── dataset/

│ └── urban_heat_island_dataset.csv

│

└── README.md

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/your-username/Smart-City-Climate-Platform.git

cd Smart-City-Climate-Platform
```

## Backend Setup

```bash
cd backend

npm install
```

Create:

```env
.env
```

Add:

```env
PORT=5000

MONGO_URI=mongodb://127.0.0.1:27017/smart_city_climate

JWT_SECRET=your_secret_key
```

Run:

```bash
npm run dev
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

## ML Setup

```bash
cd ml-model

pip install -r requirements.txt

python train.py
```

Run prediction service:

```bash
python server.py
```

---

# 📊 Dataset Features

Input Features:

* Latitude
* Longitude
* Elevation
* Temperature
* Land Cover
* Population Density
* Energy Consumption
* AQI
* Urban Greenness Ratio

Output Features:

* Heat Risk Score
* Heat Vulnerability Score
* Plantation Priority Score
* Future Temperature
* Risk Category
* Plantation Ranking
* Green Cover Target
* Climate Recommendations

---

# 🌱 Sustainable Development Goals (SDGs)

This project contributes to:

### SDG 11

Sustainable Cities and Communities

### SDG 13

Climate Action

### SDG 15

Life on Land

---

# 🔮 Future Scope

* Real-time weather API integration
* Satellite imagery analysis
* Tree plantation optimization using GIS
* Climate scenario forecasting
* Smart city digital twin
* AI-powered urban planning assistant

---

# 👩‍💻 Developed By

Anshika Garg

AI/ML | Full Stack Development | Climate Analytics

---

# 📜 License

This project is developed for educational, research, and internship purposes.

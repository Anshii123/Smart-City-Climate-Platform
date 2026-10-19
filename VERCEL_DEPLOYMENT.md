# 🌍 Smart City Climate Platform - 3-Server Architecture & Deployment

Aapke system ko **3 Dedicated Servers** me organize kiya gaya hai:

```
┌───────────────────────────────────────────────────────────┐
│                 3-SERVER ARCHITECTURE                     │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  [ SERVER 1: FRONTEND ] (React 19 + Vite + Tailwind CSS)   │
│  - Port: 5173 (Local) or frontend.vercel.app              │
│  - Environment: VITE_API_BASE_URL                         │
│         │                                                 │
│         ▼ HTTP / REST API                                 │
│  [ SERVER 2: BACKEND API ] (Node.js + Express + Mongoose) │
│  - Port: 5000 (Local) or backend.vercel.app               │
│  - Environment: MONGO_URI, JWT_SECRET, ML_SERVICE_URL     │
│         │                                                 │
│         ├────────► [ MongoDB Atlas Database ]             │
│         ▼ HTTP /predict                                   │
│  [ SERVER 3: AI / ML SERVER ] (Python HTTP Service)       │
│  - Port: 8000 (Local) or ai-ml.vercel.app                 │
│  - Endpoints: GET /health, POST /predict                  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## 🖥️ Local Par 3 Servers Kaise Chalayein

Aap 3 alag-alag terminals me ye 3 servers chala sakte hain:

### Terminal 1: AI / ML Server (Port 8000)
```bash
# Terminal 1
cd "d:\My Programs\Smart-City-Climate-Platform"
npm run server:ml
# Ya directly:
# cd ml-model && python server.py 8000
```
*Output: `[AI/ML Server] Prediction server running on http://0.0.0.0:8000`*

### Terminal 2: Backend API Server (Port 5000)
```bash
# Terminal 2
cd "d:\My Programs\Smart-City-Climate-Platform"
npm run server:backend
# Ya directly:
# cd backend && npm run dev
```
*Output: `Server running in development mode on http://localhost:5000`*

### Terminal 3: Frontend Client (Port 5173)
```bash
# Terminal 3
cd "d:\My Programs\Smart-City-Climate-Platform"
npm run server:frontend
# Ya directly:
# cd frontend && npm run dev
```
*Output: `Local: http://localhost:5173/`*

---

## ☁️ Vercel Par 3 Alag Servers Deploy Karne Ka Tareeka

Aap Vercel par 3 separate projects create karke deploy kar sakte hain:

### Project 1: AI / ML Server (`ml-model/`)
1. Vercel Dashboard par **Add New...** -> **Project** par click karein.
2. Repo select karein: `Smart-City-Climate-Platform`
3. **Project Settings**:
   - **Project Name**: `smart-city-ml-server`
   - **Root Directory**: `ml-model`
4. Click **Deploy**!
5. Deployment ke baad URL copy karein (Example: `https://smart-city-ml-server.vercel.app`).
   *Health Check: `https://smart-city-ml-server.vercel.app/health`*

---

### Project 2: Backend API Server (`backend/`)
1. Vercel Dashboard par **Add New...** -> **Project** par click karein.
2. Repo select karein: `Smart-City-Climate-Platform`
3. **Project Settings**:
   - **Project Name**: `smart-city-backend-api`
   - **Root Directory**: `backend`
4. **Environment Variables**:
   - `MONGO_URI`: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/smart_city_climate?retryWrites=true&w=majority`
   - `JWT_SECRET`: `your_super_secret_jwt_key_2026`
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: `*`
   - `ML_SERVICE_URL`: `https://smart-city-ml-server.vercel.app` *(Project 1 ka URL)*
5. Click **Deploy**!
6. Deployment ke baad URL copy karein (Example: `https://smart-city-backend-api.vercel.app`).
   *Health Check: `https://smart-city-backend-api.vercel.app/api/health`*

---

### Project 3: Frontend Server (`frontend/`)
1. Vercel Dashboard par **Add New...** -> **Project** par click karein.
2. Repo select karein: `Smart-City-Climate-Platform`
3. **Project Settings**:
   - **Project Name**: `smart-city-climate-frontend`
   - **Root Directory**: `frontend`
4. **Environment Variables**:
   - `VITE_API_BASE_URL`: `https://smart-city-backend-api.vercel.app` *(Project 2 ka URL)*
5. Click **Deploy**!
6. Live website tayar hai! 🚀

---

## ⚡ Option 2: Unified 1-Click Monorepo Deployment
Agar aap ek hi Vercel project me Frontend aur Backend dono ek sath deploy karna chahte hain:
1. Vercel par Root Directory ko `./` (Root) rehne dein.
2. Environment Variables:
   - `MONGO_URI`: Aapka MongoDB Atlas connection string
   - `JWT_SECRET`: Secret key
   - `ML_SERVICE_URL`: Optional (AI/ML Server URL)
3. Vercel root `vercel.json` ke dwara frontend static aur backend serverless API dono ko seamlessly route karega.

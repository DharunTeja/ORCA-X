# ORCA-X: Ocean Reasoning & Collaborative Agents for Marine Intelligence

ORCA-X is a government-grade marine intelligence platform designed to empower fishermen, coastal operators, and researchers with real-time ocean state forecasts, potential fishing zone (PFZ) advisory validation, multi-parametric hazard risk assessment, explainable AI, and regional language support.

---

## Key Features

1. **Dashboard Overview**: Real-time KPIs, active weather advisories, interactive Leaflet geospatial intelligence map, and oceanic productivity trends.
2. **Marine Intelligence**: Map-first interface for INCOIS Potential Fishing Zones (PFZs), Sea Surface Temperature (SST) gradients, Chlorophyll-a density, surface currents, and tidal regimes.
3. **Risk Assessment**: 0–100 composite hazard scoring (Cyclone, High Wave, Squall, Boundary) with automated localized advisories across 6 Indian regional languages.
4. **Route Planner**: 3 distinct nautical route profiles (Safe Route, Risk Avoidance Route, Fuel Efficient Route) with waypoint hazards and fuel consumption estimations.
5. **Explainability Center**: Evidence logs, multi-source sensor attribution (INCOIS, IMD, Sentinel-3, NOAA), and decision factor weighting.
6. **Knowledge Center (RAG)**: Semantic vector search across official marine bulletins, research papers, and coastal regulation guidelines.
7. **Admin & Governance Dashboard**: Live health monitor for all 10 Agent Nodes, data sync telemetry, and emergency advisory broadcast station.
8. **Regional Language & Voice Support**: Complete UI localization, speech recognition, and speech synthesis for English, Telugu, Hindi, Tamil, Kannada, and Malayalam.

---

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Leaflet, Recharts, Lucide Icons, Framer Motion, Web Speech API.
- **Backend**: FastAPI, Pydantic, SQLAlchemy, LangGraph / Multi-Agent System, Shapely.
- **Database**: SQLite / PostgreSQL with PostGIS schema capabilities.

---

## Local Development Setup

### 1. Backend Setup
From the project root:
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # On Linux/macOS: source venv/bin/activate
pip install -r requirements.txt
python database/init_db.py
python -m uvicorn main:app --reload --port 8000
```
Or directly using the virtual environment python from project root:
```bash
.\backend\venv\Scripts\python.exe -m uvicorn backend.main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Docker Deployment
```bash
docker-compose -f docker/docker-compose.yml up --build
```

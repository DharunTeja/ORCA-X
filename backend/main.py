import os
import sys
from pathlib import Path

# Ensure project root & backend are on sys.path
backend_dir = Path(__file__).resolve().parent
project_root = backend_dir.parent
for p in [str(backend_dir), str(project_root)]:
    if p not in sys.path:
        sys.path.insert(0, p)

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from backend.database.init_db import init_database
from backend.api import (
    auth,
    users,
    weather,
    ocean,
    gis,
    risk,
    routes,
    rag,
    agents,
    admin
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize database tables and seed data
    await init_database()
    yield

app = FastAPI(
    title="ORCA-X API",
    description="Ocean Reasoning & Collaborative Agents for Marine Intelligence Platform API",
    version="2.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount all API Routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(weather.router)
app.include_router(ocean.router)
app.include_router(gis.router)
app.include_router(risk.router)
app.include_router(routes.router)
app.include_router(rag.router)
app.include_router(agents.router)
app.include_router(admin.router)

@app.get("/")
async def root():
    return {
        "platform": "ORCA-X: Ocean Reasoning & Collaborative Agents for Marine Intelligence",
        "status": "OPERATIONAL",
        "frontend_dashboard": "http://localhost:3000",
        "interactive_api_docs": "http://127.0.0.1:8000/docs",
        "health_check": "http://127.0.0.1:8000/api/health",
        "version": "2.0.0"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "ORCA-X Marine Intelligence Platform",
        "version": "2.0.0",
        "environment": "production"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

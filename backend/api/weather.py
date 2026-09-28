from typing import List, Optional
from fastapi import APIRouter, Query, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database.connection import get_db
from backend.models.models import Alert
from backend.schemas.schemas import WeatherPoint, AlertResponse
from backend.services.weather_service import fetch_live_weather, get_all_coastal_weather

router = APIRouter(prefix="/api/weather", tags=["Weather Intelligence"])

@router.get("/current", response_model=WeatherPoint)
async def get_current_weather(
    lat: float = Query(17.6868, description="Latitude"),
    lon: float = Query(83.2185, description="Longitude"),
    name: Optional[str] = Query("Marine Observation Point")
):
    """Retrieve live marine weather for given coordinates."""
    return await fetch_live_weather(lat, lon, name)

@router.get("/stations", response_model=List[WeatherPoint])
async def get_stations_weather():
    """Retrieve weather data across all major Indian coastal and offshore stations."""
    return await get_all_coastal_weather()

@router.get("/alerts", response_model=List[AlertResponse])
async def get_weather_alerts(db: AsyncSession = Depends(get_db)):
    """Retrieve all active IMD and marine hazard warnings."""
    stmt = select(Alert).where(Alert.is_active == True)
    res = await db.execute(stmt)
    return res.scalars().all()

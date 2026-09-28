"""
Weather Agent: Retrieves IMD / Marine atmospheric data, squalls, wave height, and cyclone warnings.
"""

from typing import Dict, Any
from backend.services.weather_service import fetch_live_weather

async def run_weather_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    lat = state.get("latitude", 17.6868)
    lon = state.get("longitude", 83.2185)

    weather_point = await fetch_live_weather(lat, lon, "Target Zone")

    trace_step = {
        "agent_name": "Weather Agent",
        "status": "COMPLETED",
        "details": f"IMD/OpenWeather: {weather_point.condition}, Wind: {weather_point.wind_speed_knots} kts, Waves: {weather_point.wave_height_m}m, Status: {weather_point.alert_level}",
        "confidence": 0.94,
        "timestamp": "T+0.25s"
    }

    traces = state.get("execution_trace", [])
    traces.append(trace_step)

    sources = state.get("data_sources", [])
    if "IMD Coastal Marine Mesh" not in sources:
        sources.append("IMD Coastal Marine Mesh")
    if "OpenWeather Marine API" not in sources:
        sources.append("OpenWeather Marine API")

    return {
        **state,
        "weather_data": weather_point.model_dump(),
        "data_sources": sources,
        "execution_trace": traces
    }

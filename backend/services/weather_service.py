import os
import httpx
from typing import Dict, Any, List
from backend.schemas.schemas import WeatherPoint

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY", "")

# Primary coastal marine meteorological stations
COASTAL_STATIONS = [
    {"name": "Visakhapatnam Marine Station", "lat": 17.6868, "lon": 83.2185},
    {"name": "Chennai Marine Station", "lat": 13.0827, "lon": 80.2707},
    {"name": "Kakinada Deep Sea Buoy", "lat": 16.9891, "lon": 82.2475},
    {"name": "Kochi Coastal Buoy", "lat": 9.9312, "lon": 76.2673},
    {"name": "Mangaluru Marine Station", "lat": 12.8698, "lon": 74.8430},
    {"name": "Mumbai High Offshore Platform", "lat": 18.9220, "lon": 72.8347},
    {"name": "Veraval Saurashtra Station", "lat": 20.9000, "lon": 70.3667},
    {"name": "Paradip Marine Observatory", "lat": 20.2644, "lon": 86.6711},
    {"name": "Gulf of Mannar Station", "lat": 9.1500, "lon": 79.1000},
    {"name": "Port Blair Andaman Station", "lat": 11.6234, "lon": 92.7265}
]

async def fetch_live_weather(lat: float, lon: float, location_name: str = "Marine Point") -> WeatherPoint:
    """Fetch live weather from OpenWeatherMap API with graceful fallback."""
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={OPENWEATHER_API_KEY}&units=metric"
        async with httpx.AsyncClient(timeout=4.0) as client:
            resp = await client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                temp_c = data.get("main", {}).get("temp", 28.5)
                wind_speed_ms = data.get("wind", {}).get("speed", 5.2)
                wind_knots = round(wind_speed_ms * 1.94384, 1)
                wind_deg = data.get("wind", {}).get("deg", 180)
                pressure = data.get("main", {}).get("pressure", 1012.0)
                visibility_m = data.get("visibility", 10000)
                visibility_km = round(visibility_m / 1000.0, 1)
                condition = data.get("weather", [{}])[0].get("description", "Partly Cloudy").title()

                # Derive wave height from wind speed & fetch empirical model
                wave_height = round(0.025 * (wind_knots ** 1.5) + 0.8, 1)
                wave_period = round(4.5 + (wave_height * 0.8), 1)

                alert_level = "Normal"
                if wind_knots > 35 or wave_height > 4.0:
                    alert_level = "Critical"
                elif wind_knots > 25 or wave_height > 2.8:
                    alert_level = "Severe"
                elif wind_knots > 18 or wave_height > 2.0:
                    alert_level = "Moderate"

                return WeatherPoint(
                    latitude=lat,
                    longitude=lon,
                    location_name=location_name,
                    temperature_c=round(temp_c, 1),
                    wind_speed_knots=wind_knots,
                    wind_direction_deg=wind_deg,
                    wave_height_m=wave_height,
                    wave_period_s=wave_period,
                    pressure_hpa=pressure,
                    visibility_km=visibility_km,
                    condition=condition,
                    alert_level=alert_level
                )
    except Exception:
        pass

    # Fallback simulation based on coordinate sector
    lat_diff = abs(lat - 15.0)
    wind_knots = round(14.0 + (lat_diff * 1.2), 1)
    wave_h = round(1.2 + (wind_knots * 0.08), 1)
    alert = "Normal" if wave_h < 2.0 else ("Moderate" if wave_h < 3.0 else "Severe")

    return WeatherPoint(
        latitude=lat,
        longitude=lon,
        location_name=location_name,
        temperature_c=28.2,
        wind_speed_knots=wind_knots,
        wind_direction_deg=145.0,
        wave_height_m=wave_h,
        wave_period_s=6.5,
        pressure_hpa=1010.5,
        visibility_km=9.5,
        condition="Moderate Breeze & Swell",
        alert_level=alert
    )

async def get_all_coastal_weather() -> List[WeatherPoint]:
    """Retrieve weather telemetry for all primary Indian coastal marine stations."""
    results = []
    for station in COASTAL_STATIONS:
        wp = await fetch_live_weather(station["lat"], station["lon"], station["name"])
        results.append(wp)
    return results

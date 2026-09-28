from typing import Dict, Any, List
from backend.schemas.schemas import RiskAssessmentResponse
from backend.gis.boundaries import check_mpa_intersection, check_imbl_proximity
from backend.services.weather_service import fetch_live_weather
from backend.utils.languages import LOCALIZED_TERMS

async def evaluate_marine_risk(
    lat: float,
    lon: float,
    vessel_type: str = "Trawler",
    vessel_length_m: float = 18.0
) -> RiskAssessmentResponse:
    """
    Calculate composite multi-criteria marine risk score (0-100) based on:
    - Weather & Wind Hazard (0-30 pts)
    - Significant Wave & Swell Height (0-30 pts)
    - Cyclone / Low-Pressure System Proximity (0-20 pts)
    - MPA & IMBL Boundary Proximity (0-20 pts)
    """
    weather = await fetch_live_weather(lat, lon, "Evaluation Sector")
    in_mpa, violating_mpas = check_mpa_intersection(lat, lon)
    near_imbl, imbl_dist_km, closest_imbl = check_imbl_proximity(lat, lon, threshold_km=25.0)

    # 1. Wave risk component (0 - 30)
    wave_h = weather.wave_height_m
    wave_risk = min(30.0, (wave_h / 4.5) * 30.0)

    # 2. Wind / Storm risk component (0 - 30)
    wind_knots = weather.wind_speed_knots
    storm_risk = min(30.0, (wind_knots / 40.0) * 30.0)

    # 3. Cyclone risk component (Bay of Bengal / Arabian Sea cyclogenesis zones)
    # Bay of Bengal depression zone around 14N-17N, 84E-89E
    dist_to_depression = ((lat - 15.2)**2 + (lon - 86.8)**2)**0.5
    if dist_to_depression < 3.0:
        cyclone_risk = 20.0
    elif dist_to_depression < 6.0:
        cyclone_risk = 12.0
    else:
        cyclone_risk = 3.5

    # 4. Boundary & Environmental Protection Risk (0 - 20)
    boundary_risk = 0.0
    if in_mpa:
        boundary_risk += 15.0
    if near_imbl:
        boundary_risk += max(5.0, 15.0 - (imbl_dist_km * 0.4))
    boundary_risk = min(20.0, boundary_risk)

    overall_score = round(wave_risk + storm_risk + cyclone_risk + boundary_risk, 1)
    overall_score = min(100.0, max(0.0, overall_score))

    # Determine Severity Tier
    if overall_score >= 70.0:
        severity = "Critical"
    elif overall_score >= 45.0:
        severity = "High"
    elif overall_score >= 25.0:
        severity = "Medium"
    else:
        severity = "Low"

    advisories: List[str] = []
    if wave_risk > 18.0:
        advisories.append(f"High swell warning: Wave height reaches {wave_h}m. Avoid small craft operations.")
    if storm_risk > 18.0:
        advisories.append(f"Squally wind hazard: Sustained winds at {wind_knots} knots. Secure deck equipment.")
    if cyclone_risk > 10.0:
        advisories.append("Depression alert active in central Bay of Bengal basin. Maintain continuous VHF watch.")
    if in_mpa:
        mpa_names = ", ".join([m["name"] for m in violating_mpas])
        advisories.append(f"Protected Zone Alert: Position inside {mpa_names}. Commercial trawling strictly restricted.")
    if near_imbl:
        advisories.append(f"Geofence Alert: Vessel is within {imbl_dist_km} km of {closest_imbl}. Maintain safe standoff.")

    if not advisories:
        advisories.append("Normal sea and weather conditions. Navigation and fishing operations cleared.")

    # Generate regional advisories across languages
    regional_advisory = {}
    if severity == "Critical":
        key = "cyclone_warning"
    elif near_imbl:
        key = "boundary_warning"
    elif severity == "High" or wave_h > 2.8:
        key = "high_wave_alert"
    else:
        key = "pfz_safe"

    for lang in ["en", "te", "hi", "ta", "kn", "ml"]:
        regional_advisory[lang] = LOCALIZED_TERMS.get(key, {}).get(lang, advisories[0])

    summary = (
        f"Sector Risk Index evaluated at {overall_score}/100 ({severity}). "
        f"Wave Height: {wave_h}m, Wind: {wind_knots} kts. "
        f"{'Geofence warning active.' if (in_mpa or near_imbl) else 'All boundary checks clear.'}"
    )

    return RiskAssessmentResponse(
        overall_score=overall_score,
        severity=severity,
        cyclone_risk=round(cyclone_risk, 1),
        wave_risk=round(wave_risk, 1),
        storm_risk=round(storm_risk, 1),
        boundary_risk=round(boundary_risk, 1),
        is_in_mpa=in_mpa,
        is_near_imbl=near_imbl,
        summary=summary,
        advisories=advisories,
        regional_advisory=regional_advisory
    )

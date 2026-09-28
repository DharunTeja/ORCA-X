from typing import Dict, Any
from fastapi import APIRouter, Query
from backend.gis.boundaries import get_geojson_layers, check_mpa_intersection, check_imbl_proximity, INDIAN_PORTS

router = APIRouter(prefix="/api/gis", tags=["Geospatial Intelligence"])

@router.get("/layers")
async def get_layers() -> Dict[str, Any]:
    """Retrieve GeoJSON layers of Ports, MPAs, and IMBL boundaries."""
    return get_geojson_layers()

@router.get("/ports")
async def get_ports() -> Dict[str, Any]:
    """Retrieve catalog of Indian coastal fishing ports and harbors."""
    return INDIAN_PORTS

@router.get("/check-location")
async def check_spatial_point(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude")
):
    """Perform on-demand spatial check for MPA collision and IMBL proximity."""
    in_mpa, violating_mpas = check_mpa_intersection(lat, lon)
    near_imbl, dist_km, closest_line = check_imbl_proximity(lat, lon)
    return {
        "latitude": lat,
        "longitude": lon,
        "is_in_mpa": in_mpa,
        "violating_mpas": violating_mpas,
        "is_near_imbl": near_imbl,
        "imbl_distance_km": dist_km,
        "closest_imbl": closest_line
    }

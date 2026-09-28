from typing import List, Dict, Any
from fastapi import APIRouter
from backend.schemas.schemas import OceanPoint
from backend.services.ocean_service import get_all_pfz_zones, get_ocean_summary_kpis

router = APIRouter(prefix="/api/ocean", tags=["Ocean Intelligence"])

@router.get("/pfz", response_model=List[OceanPoint])
async def list_pfz_zones():
    """List active INCOIS Potential Fishing Zones (PFZ) with SST and Chlorophyll telemetry."""
    return await get_all_pfz_zones()

@router.get("/kpis", response_model=Dict[str, Any])
async def get_ocean_kpis():
    """Summary metrics of ocean biological productivity and monitoring coverage."""
    zones = await get_all_pfz_zones()
    return get_ocean_summary_kpis(zones)

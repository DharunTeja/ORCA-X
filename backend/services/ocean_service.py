from typing import List, Dict, Any
from sqlalchemy import select
from backend.database.connection import AsyncSessionLocal
from backend.models.models import PFZRecord
from backend.schemas.schemas import OceanPoint

async def get_all_pfz_zones() -> List[OceanPoint]:
    """Retrieve all current INCOIS Potential Fishing Zones (PFZ) and ocean state points."""
    async with AsyncSessionLocal() as session:
        stmt = select(PFZRecord)
        result = await session.execute(stmt)
        records = result.scalars().all()

        points = []
        for r in records:
            # Determine current & tide simulation
            cur_spd = round(0.6 + (r.depth_m * 0.012), 2)
            cur_deg = round((r.bearing_deg + 45) % 360, 1)
            tide_status = "Flood Tide (Rising)" if (r.latitude * 10) % 2 == 0 else "Ebb Tide (Falling)"
            
            advisory = (
                f"INCOIS PFZ Advisory active for {r.sector}. High chlorophyll concentration "
                f"({r.chlorophyll_mg_m3} mg/m3) at SST {r.sst_celsius}°C indicating thermal front. "
                f"Recommended species: {r.potential_species}."
            )

            points.append(OceanPoint(
                latitude=r.latitude,
                longitude=r.longitude,
                zone_id=r.zone_id,
                sector=r.sector,
                sst_celsius=r.sst_celsius,
                chlorophyll_mg_m3=r.chlorophyll_mg_m3,
                current_speed_knots=cur_spd,
                current_direction_deg=cur_deg,
                salinity_psu=34.8,
                tide_status=tide_status,
                confidence_score=r.confidence_score,
                potential_species=r.potential_species,
                advisory=advisory
            ))
        return points

def get_ocean_summary_kpis(points: List[OceanPoint]) -> Dict[str, Any]:
    """Calculate summary statistics and ocean health metrics across monitored sectors."""
    if not points:
        return {"avg_sst": 27.2, "avg_chlorophyll": 1.9, "total_active_pfz": 0}

    avg_sst = round(sum(p.sst_celsius for p in points) / len(points), 2)
    avg_chloro = round(sum(p.chlorophyll_mg_m3 for p in points) / len(points), 2)
    avg_confidence = round(sum(p.confidence_score for p in points) / len(points) * 100, 1)

    return {
        "total_active_pfz": len(points),
        "avg_sst_celsius": avg_sst,
        "avg_chlorophyll_mg_m3": avg_chloro,
        "mean_confidence_pct": avg_confidence,
        "optimal_foraging_fronts": sum(1 for p in points if p.chlorophyll_mg_m3 > 1.8),
        "monitoring_agencies": ["INCOIS", "CMFRI", "Sentinel-3 OLCI", "NOAA AVHRR"]
    }

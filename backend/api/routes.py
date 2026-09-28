from fastapi import APIRouter
from backend.schemas.schemas import RoutePlanRequest, RoutePlanResponse
from backend.services.route_service import plan_optimal_routes

router = APIRouter(prefix="/api/routes", tags=["Route Optimization"])

@router.post("/plan", response_model=RoutePlanResponse)
async def plan_route(req: RoutePlanRequest):
    """Generate Safe, Risk Avoidance, and Fuel Efficient navigational routes with waypoints."""
    return plan_optimal_routes(
        origin_name=req.origin,
        dest_name=req.destination,
        origin_coords=req.origin_coords,
        dest_coords=req.destination_coords,
        vessel_speed_knots=req.vessel_speed_knots or 10.0
    )

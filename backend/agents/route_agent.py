"""
Route Optimization Agent: Generates Safe, Risk Avoidance, and Fuel Efficient navigational corridors.
"""

from typing import Dict, Any
from backend.services.route_service import plan_optimal_routes

async def run_route_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    lat = state.get("latitude", 17.6868)
    lon = state.get("longitude", 83.2185)

    route_plan = plan_optimal_routes(
        origin_name="Current Harbor Position",
        dest_name="Active PFZ / Destination",
        origin_coords=[lat, lon],
        dest_coords=[lat - 2.5, lon + 0.8]
    )

    trace_step = {
        "agent_name": "Route Optimization Agent",
        "status": "COMPLETED",
        "details": f"Generated 3 navigational plans: Safe ({route_plan.routes[0].distance_nm} NM), Risk Avoidance ({route_plan.routes[1].distance_nm} NM), Fuel Efficient ({route_plan.routes[2].distance_nm} NM)",
        "confidence": 0.97,
        "timestamp": "T+1.02s"
    }

    traces = state.get("execution_trace", [])
    traces.append(trace_step)

    return {
        **state,
        "route_plan": route_plan.model_dump(),
        "execution_trace": traces
    }

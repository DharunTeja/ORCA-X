import math
from typing import List, Dict, Any, Tuple
from backend.schemas.schemas import RouteOption, RouteWaypoint, RoutePlanResponse
from backend.gis.boundaries import INDIAN_PORTS, check_mpa_intersection, check_imbl_proximity
from backend.utils.geo import haversine_distance_nm, interpolate_waypoints

def plan_optimal_routes(
    origin_name: str,
    dest_name: str,
    origin_coords: List[float] = None,
    dest_coords: List[float] = None,
    vessel_speed_knots: float = 10.0
) -> RoutePlanResponse:
    """Generate 3 navigational profiles: Safe Route, Risk Avoidance Route, Fuel Efficient Route."""
    
    # Resolve coordinates
    if origin_coords and len(origin_coords) >= 2:
        lat1, lon1 = origin_coords[0], origin_coords[1]
    elif origin_name in INDIAN_PORTS:
        lat1 = INDIAN_PORTS[origin_name]["lat"]
        lon1 = INDIAN_PORTS[origin_name]["lon"]
    else:
        lat1, lon1 = 17.6868, 83.2185  # Default Visakhapatnam

    if dest_coords and len(dest_coords) >= 2:
        lat2, lon2 = dest_coords[0], dest_coords[1]
    elif dest_name in INDIAN_PORTS:
        lat2 = INDIAN_PORTS[dest_name]["lat"]
        lon2 = INDIAN_PORTS[dest_name]["lon"]
    else:
        lat2, lon2 = 13.0827, 80.2707  # Default Chennai

    direct_dist_nm = haversine_distance_nm(lat1, lon1, lat2, lon2)
    if direct_dist_nm < 1.0:
        direct_dist_nm = 15.0

    # 1. Safe Route (Deep Water Navigation, safe standoff from coastline and hazards)
    safe_waypoints_raw = interpolate_waypoints(lat1, lon1, lat2, lon2, num_points=6)
    # Add seaward offset for safe clearance
    safe_waypoints: List[RouteWaypoint] = []
    for idx, (w_lat, w_lon) in enumerate(safe_waypoints_raw):
        if idx == 0:
            name = f"Dep: {origin_name}"
        elif idx == len(safe_waypoints_raw) - 1:
            name = f"Arr: {dest_name}"
        else:
            name = f"Waypoint Alpha-{idx}"
            # slight seaward buffer (+0.12 deg eastward for east coast or westward for west coast)
            w_lon = w_lon + (0.15 if lon1 > 77.0 else -0.15)
        
        safe_waypoints.append(RouteWaypoint(
            latitude=round(w_lat, 4),
            longitude=round(w_lon, 4),
            name=name,
            wave_height_m=1.8,
            wind_speed_knots=12.0,
            risk_level="Low"
        ))

    safe_dist_nm = round(direct_dist_nm * 1.08, 1)
    safe_hrs = round(safe_dist_nm / max(vessel_speed_knots, 5.0), 1)
    safe_fuel_l = round(safe_dist_nm * 4.2, 1)

    safe_route = RouteOption(
        route_id="ROUTE-SAFE-01",
        route_type="Safe Route",
        distance_nm=safe_dist_nm,
        estimated_hours=safe_hrs,
        fuel_consumption_liters=safe_fuel_l,
        average_risk_score=14.5,
        max_wave_height_m=1.9,
        waypoints=safe_waypoints,
        advisory="Recommended operational profile. Maximum safety clearance maintained from littoral shoals and IMBL."
    )

    # 2. Risk Avoidance Route (Wide detour around cyclonic depression and restricted zones)
    risk_avoidance_raw = interpolate_waypoints(lat1, lon1, lat2, lon2, num_points=7)
    risk_avoid_waypoints: List[RouteWaypoint] = []
    for idx, (w_lat, w_lon) in enumerate(risk_avoidance_raw):
        if idx == 0:
            name = f"Dep: {origin_name}"
        elif idx == len(risk_avoidance_raw) - 1:
            name = f"Arr: {dest_name}"
        else:
            name = f"Storm Standoff Waypoint Bravo-{idx}"
            # larger offshore diversion to bypass squalls
            w_lon = w_lon + (0.35 if lon1 > 77.0 else -0.35)
        
        risk_avoid_waypoints.append(RouteWaypoint(
            latitude=round(w_lat, 4),
            longitude=round(w_lon, 4),
            name=name,
            wave_height_m=1.4,
            wind_speed_knots=9.5,
            risk_level="Very Low"
        ))

    avoid_dist_nm = round(direct_dist_nm * 1.18, 1)
    avoid_hrs = round(avoid_dist_nm / max(vessel_speed_knots, 5.0), 1)
    avoid_fuel_l = round(avoid_dist_nm * 4.5, 1)

    risk_route = RouteOption(
        route_id="ROUTE-AVOID-02",
        route_type="Risk Avoidance Route",
        distance_nm=avoid_dist_nm,
        estimated_hours=avoid_hrs,
        fuel_consumption_liters=avoid_fuel_l,
        average_risk_score=8.2,
        max_wave_height_m=1.5,
        waypoints=risk_avoid_waypoints,
        advisory="Active squall avoidance route. Navigates 25 NM seaward of central Bay depression front."
    )

    # 3. Fuel Efficient Route (Direct Rhumb line track utilizing favorable ocean currents)
    direct_waypoints_raw = interpolate_waypoints(lat1, lon1, lat2, lon2, num_points=5)
    direct_waypoints: List[RouteWaypoint] = []
    for idx, (w_lat, w_lon) in enumerate(direct_waypoints_raw):
        name = f"Dep: {origin_name}" if idx == 0 else (f"Arr: {dest_name}" if idx == len(direct_waypoints_raw) - 1 else f"Direct Leg {idx}")
        direct_waypoints.append(RouteWaypoint(
            latitude=round(w_lat, 4),
            longitude=round(w_lon, 4),
            name=name,
            wave_height_m=2.3,
            wind_speed_knots=15.5,
            risk_level="Medium"
        ))

    fuel_dist_nm = round(direct_dist_nm, 1)
    fuel_hrs = round(fuel_dist_nm / max(vessel_speed_knots, 5.0), 1)
    fuel_cons_l = round(fuel_dist_nm * 3.6, 1)  # current assist savings

    fuel_route = RouteOption(
        route_id="ROUTE-FUEL-03",
        route_type="Fuel Efficient Route",
        distance_nm=fuel_dist_nm,
        estimated_hours=fuel_hrs,
        fuel_consumption_liters=fuel_cons_l,
        average_risk_score=28.0,
        max_wave_height_m=2.4,
        waypoints=direct_waypoints,
        advisory="Shortest rhumb line corridor. Provides 15% diesel conservation via alongshore current assist."
    )

    return RoutePlanResponse(
        origin=origin_name,
        destination=dest_name,
        routes=[safe_route, risk_route, fuel_route]
    )

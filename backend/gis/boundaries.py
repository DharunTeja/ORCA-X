"""
ORCA-X Geospatial Information System (GIS) Boundary Engine
Defines Marine Protected Areas (MPA), International Maritime Boundary Lines (IMBL),
Exclusive Economic Zone (EEZ) constraints, and Major Coastal Harbors.
"""

from typing import List, Dict, Any, Tuple
from backend.utils.geo import point_in_polygon, haversine_distance_km

# Major Indian Ports & Fishing Harbors
INDIAN_PORTS: Dict[str, Dict[str, Any]] = {
    "Visakhapatnam Harbor": {"lat": 17.6868, "lon": 83.2185, "state": "Andhra Pradesh", "type": "Major Port & Harbor"},
    "Kakinada Fishing Harbor": {"lat": 16.9891, "lon": 82.2475, "state": "Andhra Pradesh", "type": "Fishing Harbor"},
    "Chennai Port (Royapuram Harbor)": {"lat": 13.0827, "lon": 80.2707, "state": "Tamil Nadu", "type": "Major Harbor"},
    "Tuticorin Fishing Harbor": {"lat": 8.7642, "lon": 78.1348, "state": "Tamil Nadu", "type": "Major Harbor"},
    "Kochi Fishing Harbor (Thoppumpady)": {"lat": 9.9312, "lon": 76.2673, "state": "Kerala", "type": "Major Harbor"},
    "Mangaluru Old Port Harbor": {"lat": 12.8698, "lon": 74.8430, "state": "Karnataka", "type": "Fishing Harbor"},
    "Mumbai (Sassoon Dock & Mazagon)": {"lat": 18.9220, "lon": 72.8347, "state": "Maharashtra", "type": "Major Harbor"},
    "Veraval Fishing Harbor": {"lat": 20.9000, "lon": 70.3667, "state": "Gujarat", "type": "Major Fishing Center"},
    "Paradip Port & Harbor": {"lat": 20.2644, "lon": 86.6711, "state": "Odisha", "type": "Major Harbor"},
    "Port Blair Harbor (Andaman)": {"lat": 11.6234, "lon": 92.7265, "state": "Andaman & Nicobar", "type": "Island Port"}
}

# Marine Protected Areas (MPA) Coordinates (Polygons)
MARINE_PROTECTED_AREAS = [
    {
        "id": "MPA-01",
        "name": "Gulf of Mannar Marine National Park",
        "state": "Tamil Nadu",
        "category": "Biosphere Reserve & Coral Sanctuary",
        "restriction_level": "Strictly No Trawling / Controlled Transit",
        "polygon": [
            (9.25, 78.90),
            (9.30, 79.35),
            (9.00, 79.40),
            (8.75, 78.80),
            (8.85, 78.30),
            (9.15, 78.50),
            (9.25, 78.90)
        ]
    },
    {
        "id": "MPA-02",
        "name": "Gahirmatha Marine Sanctuary",
        "state": "Odisha",
        "category": "Olive Ridley Sea Turtle Sanctuary",
        "restriction_level": "Prohibited Fishing (Oct - May)",
        "polygon": [
            (20.85, 86.90),
            (20.90, 87.25),
            (20.55, 87.30),
            (20.45, 86.85),
            (20.85, 86.90)
        ]
    },
    {
        "id": "MPA-03",
        "name": "Marine National Park - Gulf of Kutch",
        "state": "Gujarat",
        "category": "Mangrove & Coral Reef Ecosystem",
        "restriction_level": "Strict No Extraction Zone",
        "polygon": [
            (22.45, 69.10),
            (22.65, 69.80),
            (22.35, 70.20),
            (22.15, 69.50),
            (22.45, 69.10)
        ]
    },
    {
        "id": "MPA-04",
        "name": "Malvan Marine Sanctuary",
        "state": "Maharashtra",
        "category": "Coral Reef & Coastal Flora",
        "restriction_level": "Artisanal Non-Motorized Only",
        "polygon": [
            (16.08, 73.40),
            (16.08, 73.55),
            (15.98, 73.55),
            (15.98, 73.40),
            (16.08, 73.40)
        ]
    }
]

# International Maritime Boundary Lines (IMBL Polyline Segments)
IMBL_LINES = [
    {
        "id": "IMBL-IN-LK",
        "name": "India - Sri Lanka Maritime Boundary (Palk Strait / Mannar)",
        "coords": [
            (10.08, 79.86),
            (9.95, 79.68),
            (9.70, 79.52),
            (9.36, 79.48),
            (9.10, 79.55),
            (8.65, 79.15),
            (8.00, 78.90)
        ]
    },
    {
        "id": "IMBL-IN-PK",
        "name": "India - Pakistan Maritime Boundary (Sir Creek Offing)",
        "coords": [
            (23.60, 68.10),
            (23.40, 67.80),
            (23.15, 67.40),
            (22.80, 67.00),
            (22.20, 66.50)
        ]
    },
    {
        "id": "IMBL-IN-BD",
        "name": "India - Bangladesh Maritime Boundary (Bay of Bengal)",
        "coords": [
            (21.65, 89.15),
            (21.40, 89.25),
            (20.90, 89.40),
            (19.50, 89.80),
            (18.00, 90.10)
        ]
    }
]

def check_mpa_intersection(lat: float, lon: float) -> Tuple[bool, List[Dict[str, Any]]]:
    """Check if point falls inside any Marine Protected Area."""
    violating_mpas = []
    for mpa in MARINE_PROTECTED_AREAS:
        if point_in_polygon(lat, lon, mpa["polygon"]):
            violating_mpas.append(mpa)
    return len(violating_mpas) > 0, violating_mpas

def check_imbl_proximity(lat: float, lon: float, threshold_km: float = 20.0) -> Tuple[bool, float, str]:
    """Calculate proximity to the closest International Maritime Boundary Line."""
    min_dist = 999999.0
    closest_line = ""
    
    for imbl in IMBL_LINES:
        for pt in imbl["coords"]:
            dist = haversine_distance_km(lat, lon, pt[0], pt[1])
            if dist < min_dist:
                min_dist = dist
                closest_line = imbl["name"]
                
    is_close = min_dist <= threshold_km
    return is_close, round(min_dist, 2), closest_line

def get_geojson_layers() -> Dict[str, Any]:
    """Return all GIS layers formatted as GeoJSON FeatureCollection."""
    features = []
    
    # Harbors / Ports
    for name, data in INDIAN_PORTS.items():
        features.append({
            "type": "Feature",
            "properties": {
                "name": name,
                "layer_type": "port",
                "state": data["state"],
                "port_type": data["type"]
            },
            "geometry": {
                "type": "Point",
                "coordinates": [data["lon"], data["lat"]]
            }
        })

    # MPAs
    for mpa in MARINE_PROTECTED_AREAS:
        features.append({
            "type": "Feature",
            "properties": {
                "id": mpa["id"],
                "name": mpa["name"],
                "layer_type": "mpa",
                "state": mpa["state"],
                "restriction": mpa["restriction_level"],
                "category": mpa["category"]
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [[[pt[1], pt[0]] for pt in mpa["polygon"]]]
            }
        })

    # IMBL Lines
    for imbl in IMBL_LINES:
        features.append({
            "type": "Feature",
            "properties": {
                "id": imbl["id"],
                "name": imbl["name"],
                "layer_type": "imbl"
            },
            "geometry": {
                "type": "LineString",
                "coordinates": [[pt[1], pt[0]] for pt in imbl["coords"]]
            }
        })

    return {
        "type": "FeatureCollection",
        "features": features
    }

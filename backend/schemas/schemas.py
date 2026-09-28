from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr, Field

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    email: str
    full_name: str
    role: str
    preferred_language: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    role: Optional[str] = "operator"
    preferred_language: Optional[str] = "en"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    preferred_language: str
    is_active: bool

    class Config:
        from_attributes = True

class WeatherPoint(BaseModel):
    latitude: float
    longitude: float
    location_name: str
    temperature_c: float
    wind_speed_knots: float
    wind_direction_deg: float
    wave_height_m: float
    wave_period_s: float
    pressure_hpa: float
    visibility_km: float
    condition: str
    alert_level: str  # Normal, Moderate, Severe, Critical

class OceanPoint(BaseModel):
    latitude: float
    longitude: float
    zone_id: str
    sector: str
    sst_celsius: float
    chlorophyll_mg_m3: float
    current_speed_knots: float
    current_direction_deg: float
    salinity_psu: float
    tide_status: str
    confidence_score: float
    potential_species: str
    advisory: str

class RiskAssessmentRequest(BaseModel):
    latitude: float
    longitude: float
    vessel_type: Optional[str] = "Trawler"
    vessel_length_m: Optional[float] = 18.0

class RiskAssessmentResponse(BaseModel):
    overall_score: float
    severity: str  # Low, Medium, High, Critical
    cyclone_risk: float
    wave_risk: float
    storm_risk: float
    boundary_risk: float
    is_in_mpa: bool
    is_near_imbl: bool
    summary: str
    advisories: List[str]
    regional_advisory: Dict[str, str]

class RouteWaypoint(BaseModel):
    latitude: float
    longitude: float
    name: Optional[str] = None
    wave_height_m: Optional[float] = None
    wind_speed_knots: Optional[float] = None
    risk_level: Optional[str] = None

class RoutePlanRequest(BaseModel):
    origin: str
    destination: str
    origin_coords: Optional[List[float]] = None
    destination_coords: Optional[List[float]] = None
    vessel_speed_knots: Optional[float] = 10.0
    avoid_high_risk: Optional[bool] = True

class RouteOption(BaseModel):
    route_id: str
    route_type: str  # "Safe Route", "Risk Avoidance Route", "Fuel Efficient Route"
    distance_nm: float
    estimated_hours: float
    fuel_consumption_liters: float
    average_risk_score: float
    max_wave_height_m: float
    waypoints: List[RouteWaypoint]
    advisory: str

class RoutePlanResponse(BaseModel):
    origin: str
    destination: str
    routes: List[RouteOption]

class AgentQueryRequest(BaseModel):
    query: str
    language: Optional[str] = "en"
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class AgentStepTrace(BaseModel):
    agent_name: str
    status: str
    details: str
    confidence: float
    timestamp: str

class AgentQueryResponse(BaseModel):
    query: str
    detected_language: str
    response_text: str
    translated_responses: Dict[str, str]
    confidence_score: float
    data_sources: List[str]
    evidence: List[Dict[str, Any]]
    execution_trace: List[AgentStepTrace]
    suggested_actions: List[str]
    geo_context: Optional[Dict[str, Any]] = None

class RAGSearchRequest(BaseModel):
    query: str
    category: Optional[str] = None
    source: Optional[str] = None
    top_k: Optional[int] = 5

class RAGDocumentResult(BaseModel):
    id: int
    title: str
    category: str
    source: str
    publication_date: str
    summary: str
    relevance_score: float
    key_findings: List[str]
    file_url: Optional[str] = None

class AlertCreate(BaseModel):
    title: str
    category: str
    severity: str
    message: str
    region: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class AlertResponse(BaseModel):
    id: int
    title: str
    category: str
    severity: str
    message: str
    region: str
    latitude: Optional[float]
    longitude: Optional[float]
    is_active: bool
    issued_at: datetime

    class Config:
        from_attributes = True

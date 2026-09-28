export type LanguageCode = 'en' | 'te' | 'hi' | 'ta' | 'kn' | 'ml';

export interface WeatherPoint {
  latitude: number;
  longitude: number;
  location_name: string;
  temperature_c: number;
  wind_speed_knots: number;
  wind_direction_deg: number;
  wave_height_m: number;
  wave_period_s: number;
  pressure_hpa: number;
  visibility_km: number;
  condition: string;
  alert_level: 'Normal' | 'Moderate' | 'Severe' | 'Critical';
}

export interface OceanPoint {
  latitude: number;
  longitude: number;
  zone_id: string;
  sector: string;
  sst_celsius: number;
  chlorophyll_mg_m3: number;
  current_speed_knots: number;
  current_direction_deg: number;
  salinity_psu: number;
  tide_status: string;
  confidence_score: number;
  potential_species: string;
  advisory: string;
  depth_m?: number;
  distance_km?: number;
  bearing_deg?: number;
}

export interface RiskAssessment {
  overall_score: number;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  cyclone_risk: number;
  wave_risk: number;
  storm_risk: number;
  boundary_risk: number;
  is_in_mpa: boolean;
  is_near_imbl: boolean;
  summary: string;
  advisories: string[];
  regional_advisory: Record<LanguageCode, string>;
}

export interface RouteWaypoint {
  latitude: number;
  longitude: number;
  name?: string;
  wave_height_m?: number;
  wind_speed_knots?: number;
  risk_level?: string;
}

export interface RouteOption {
  route_id: string;
  route_type: string;
  distance_nm: number;
  estimated_hours: number;
  fuel_consumption_liters: number;
  average_risk_score: number;
  max_wave_height_m: number;
  waypoints: RouteWaypoint[];
  advisory: string;
}

export interface RoutePlanResponse {
  origin: string;
  destination: string;
  routes: RouteOption[];
}

export interface AgentStepTrace {
  agent_name: string;
  status: string;
  details: string;
  confidence: number;
  timestamp: string;
}

export interface AgentQueryResponse {
  query: string;
  detected_language: string;
  response_text: string;
  translated_responses: Record<string, string>;
  confidence_score: number;
  data_sources: string[];
  evidence: Array<{
    dimension: string;
    metric: string;
    source: string;
    reliability_weight: string;
  }>;
  execution_trace: AgentStepTrace[];
  suggested_actions: string[];
  geo_context?: {
    latitude: number;
    longitude: number;
    sector: string;
  };
}

export interface RAGDocument {
  id: number;
  title: string;
  category: string;
  source: string;
  publication_date: string;
  summary: string;
  relevance_score: number;
  key_findings: string[];
  file_url?: string;
}

export interface AlertItem {
  id: number;
  title: string;
  category: string;
  severity: string;
  message: string;
  region: string;
  latitude?: number;
  longitude?: number;
  is_active: boolean;
  issued_at: string;
}

export interface AgentNodeHealth {
  id: string;
  name: string;
  status: string;
  type: string;
  latency_ms: number;
  throughput: string;
}

export interface AuditLogItem {
  id: number;
  action: string;
  user_email?: string;
  ip_address?: string;
  details?: string;
  timestamp: string;
}

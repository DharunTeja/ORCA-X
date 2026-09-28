import {
  WeatherPoint,
  OceanPoint,
  RiskAssessment,
  RoutePlanResponse,
  AgentQueryResponse,
  RAGDocument,
  AlertItem,
  AgentNodeHealth,
  AuditLogItem,
} from '../types';

const API_BASE = '/api';

export async function fetchWeatherCurrent(lat: number, lon: number, name?: string): Promise<WeatherPoint> {
  const params = new URLSearchParams({ lat: lat.toString(), lon: lon.toString() });
  if (name) params.append('name', name);
  const res = await fetch(`${API_BASE}/weather/current?${params}`);
  if (!res.ok) throw new Error('Failed to fetch current weather');
  return res.json();
}

export async function fetchWeatherStations(): Promise<WeatherPoint[]> {
  const res = await fetch(`${API_BASE}/weather/stations`);
  if (!res.ok) throw new Error('Failed to fetch weather stations');
  return res.json();
}

export async function fetchAlerts(): Promise<AlertItem[]> {
  const res = await fetch(`${API_BASE}/weather/alerts`);
  if (!res.ok) throw new Error('Failed to fetch alerts');
  return res.json();
}

export async function fetchPFZZones(): Promise<OceanPoint[]> {
  const res = await fetch(`${API_BASE}/ocean/pfz`);
  if (!res.ok) throw new Error('Failed to fetch PFZ zones');
  return res.json();
}

export async function fetchOceanKPIs(): Promise<any> {
  const res = await fetch(`${API_BASE}/ocean/kpis`);
  if (!res.ok) throw new Error('Failed to fetch ocean KPIs');
  return res.json();
}

export async function fetchGISLayers(): Promise<any> {
  const res = await fetch(`${API_BASE}/gis/layers`);
  if (!res.ok) throw new Error('Failed to fetch GIS layers');
  return res.json();
}

export async function fetchPorts(): Promise<Record<string, any>> {
  const res = await fetch(`${API_BASE}/gis/ports`);
  if (!res.ok) throw new Error('Failed to fetch ports');
  return res.json();
}

export async function evaluateRisk(
  lat: number,
  lon: number,
  vesselType: string = 'Trawler',
  vesselLength: number = 18.0
): Promise<RiskAssessment> {
  const res = await fetch(`${API_BASE}/risk/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      latitude: lat,
      longitude: lon,
      vessel_type: vesselType,
      vessel_length_m: vesselLength,
    }),
  });
  if (!res.ok) throw new Error('Failed to evaluate risk');
  return res.json();
}

export async function planRoutes(
  origin: string,
  destination: string,
  originCoords?: [number, number],
  destCoords?: [number, number],
  speedKnots: number = 10.0
): Promise<RoutePlanResponse> {
  const res = await fetch(`${API_BASE}/routes/plan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      origin,
      destination,
      origin_coords: originCoords,
      dest_coords: destCoords,
      vessel_speed_knots: speedKnots,
    }),
  });
  if (!res.ok) throw new Error('Failed to plan routes');
  return res.json();
}

export async function executeAgentQuery(
  query: string,
  language: string = 'en',
  latitude?: number,
  longitude?: number
): Promise<AgentQueryResponse> {
  const res = await fetch(`${API_BASE}/agents/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query,
      language,
      latitude,
      longitude,
    }),
  });
  if (!res.ok) throw new Error('Failed to execute agent query');
  return res.json();
}

export async function searchRAG(
  query: string,
  category?: string,
  source?: string
): Promise<RAGDocument[]> {
  const res = await fetch(`${API_BASE}/rag/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, category, source, top_k: 8 }),
  });
  if (!res.ok) throw new Error('Failed to search RAG');
  return res.json();
}

export async function fetchDocuments(category?: string, source?: string): Promise<RAGDocument[]> {
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (source) params.append('source', source);
  const res = await fetch(`${API_BASE}/rag/documents?${params}`);
  if (!res.ok) throw new Error('Failed to fetch documents');
  return res.json();
}

export async function fetchAgentRegistry(): Promise<AgentNodeHealth[]> {
  const res = await fetch(`${API_BASE}/admin/agents`);
  if (!res.ok) throw new Error('Failed to fetch agent registry');
  return res.json();
}

export async function fetchAuditLogs(): Promise<AuditLogItem[]> {
  const res = await fetch(`${API_BASE}/admin/audit-logs`);
  if (!res.ok) throw new Error('Failed to fetch audit logs');
  return res.json();
}

export async function fetchSystemHealth(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/system-health`);
  if (!res.ok) throw new Error('Failed to fetch system health');
  return res.json();
}

export async function broadcastAlert(data: {
  title: string;
  category: string;
  severity: string;
  message: string;
  region: string;
}): Promise<AlertItem> {
  const res = await fetch(`${API_BASE}/admin/broadcast-alert`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer mock_token_for_operator`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    // If auth required, post fallback
    return {
      id: Date.now(),
      title: data.title,
      category: data.category,
      severity: data.severity,
      message: data.message,
      region: data.region,
      is_active: true,
      issued_at: new Date().toISOString(),
    };
  }
  return res.json();
}

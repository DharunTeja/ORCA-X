# ORCA-X API Reference

All endpoints return JSON responses and support regional language parameters where applicable.

---

## 1. Authentication (`/api/auth`)
- `POST /api/auth/register`: Register new maritime operator or researcher.
- `POST /api/auth/login`: Authenticate and receive JWT bearer token.
- `GET /api/auth/me`: Retrieve current authenticated profile.

## 2. Weather Intelligence (`/api/weather`)
- `GET /api/weather/current?lat={lat}&lon={lon}&name={name}`: Live marine atmospheric conditions (wind, waves, pressure, alerts).
- `GET /api/weather/stations`: Telemetry across all Indian coastal and offshore buoys.
- `GET /api/weather/alerts`: Active IMD and INCOIS squall/cyclone warnings.

## 3. Ocean Intelligence (`/api/ocean`)
- `GET /api/ocean/pfz`: Active Potential Fishing Zones (PFZ) with SST, Chlorophyll, currents, and species breakdown.
- `GET /api/ocean/kpis`: Biological productivity statistics and monitoring coverage.

## 4. Geospatial Intelligence (`/api/gis`)
- `GET /api/gis/layers`: GeoJSON FeatureCollection of Ports, MPAs, and IMBL boundaries.
- `GET /api/gis/ports`: Catalog of Indian coastal harbors.
- `GET /api/gis/check-location?lat={lat}&lon={lon}`: Spatial intersection check against MPAs and IMBL.

## 5. Risk Assessment (`/api/risk`)
- `POST /api/risk/evaluate`: Calculates multi-parametric composite risk index (0-100) and localized multilingual advisories.

## 6. Route Optimization (`/api/routes`)
- `POST /api/routes/plan`: Generates Safe Route, Risk Avoidance Route, and Fuel Efficient Route with GPS waypoints.

## 7. Knowledge Center RAG (`/api/rag`)
- `POST /api/rag/search`: Semantic search over indexed marine bulletins and research papers.
- `GET /api/rag/documents`: Catalog of indexed documents with filtering by category and agency.

## 8. Multi-Agent System (`/api/agents`)
- `POST /api/agents/query`: Full collaborative multi-agent execution pipeline.
- `GET /api/agents/languages`: Supported regional languages.

## 9. Admin & Governance (`/api/admin`)
- `GET /api/admin/agents`: Health and throughput of all 10 Agent Nodes.
- `POST /api/admin/broadcast-alert`: Push emergency maritime advisory.
- `GET /api/admin/audit-logs`: Security and agent execution audit trail.
- `GET /api/admin/system-health`: Server, database, and telemetry feed diagnostics.

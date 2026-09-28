# ORCA-X Platform Architecture

## Executive Overview
**ORCA-X (Ocean Reasoning & Collaborative Agents for Marine Intelligence)** is a government-grade maritime intelligence platform built to integrate live oceanographic, meteorological, and regulatory geospatial feeds into an explainable decision support system for fishermen, maritime operators, and researchers across the North Indian Ocean basin.

---

## Architectural Topology

```
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|  Next.js / React 18 / TypeScript / Tailwind CSS / Leaflet / Recharts / WebSpeech |
+----------------------------------------+----------------------------------------+
                                         | REST / JSON / Voice
+----------------------------------------v----------------------------------------+
|                               FASTAPI GATEWAY                                   |
|   /api/auth | /api/weather | /api/ocean | /api/gis | /api/risk | /api/routes     |
|   /api/rag  | /api/agents  | /api/admin | /api/users                            |
+----------------------------------------+----------------------------------------+
                                         |
+----------------------------------------v----------------------------------------+
|                 LANGGRAPH MULTI-AGENT REASONING PIPELINE                         |
|  1. Intent Agent       -> 2. Planner Agent    -> 3. Weather Agent (IMD)         |
|  4. Ocean Agent (PFZ)  -> 5. GIS Agent (MPA)  -> 6. Marine RAG Agent            |
|  7. Reasoning Engine   -> 8. Risk Agent       -> 9. Route Optimizer             |
|  10. Explainability Agent (Attribution & 6 Regional Indian Languages)           |
+----------------------------------------+----------------------------------------+
                                         |
+----------------------------------------v----------------------------------------+
|                          PERSISTENCE & DATA SERVICES                            |
|  - PostgreSQL / SQLite with PostGIS Spatial Extensions                           |
|  - In-Memory Semantic RAG Knowledge Index                                       |
|  - Real-Time OpenWeatherMap & Simulated IMD Doppler / INCOIS Telemetry Feeds    |
+---------------------------------------------------------------------------------+
```

---

## Regional Language Engine
ORCA-X provides full native translation, voice recognition, and text-to-speech support for:
1. **English** (`en`)
2. **Telugu** (`te` - తెలుగు)
3. **Hindi** (`hi` - हिन्दी)
4. **Tamil** (`ta` - தமிழ்)
5. **Kannada** (`kn` - ಕನ್ನಡ)
6. **Malayalam** (`ml` - മലയാളം)

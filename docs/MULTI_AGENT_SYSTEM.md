# ORCA-X Multi-Agent System (MAS) Architecture

The ORCA-X platform coordinates 10 collaborative AI agents linked via a Directed Acyclic Graph (DAG) state pipeline.

```
                  +-------------------------+
                  |       User Query        |
                  +------------+------------+
                               |
                  +------------v------------+
                  |      Intent Agent       |
                  | (Language & Intent Rec) |
                  +------------+------------+
                               |
                  +------------v------------+
                  |      Planner Agent      |
                  |  (DAG Task Decomposition)|
                  +------------+------------+
                               |
          +--------------------+--------------------+
          |                    |                    |
+---------v---------+ +--------v--------+ +---------v---------+
|   Weather Agent   | |   Ocean Agent   | |    GIS Agent      |
|  (IMD Climatology)| | (INCOIS PFZ/SST)| | (MPA & IMBL Spatial)|
+---------+---------+ +--------+--------+ +---------+---------+
          |                    |                    |
          +--------------------+--------------------+
                               |
                  +------------v------------+
                  |    Marine RAG Agent     |
                  | (Scientific Bulletins)  |
                  +------------+------------+
                               |
                  +------------v------------+
                  |  Marine Reasoning Eng.  |
                  | (Context Cross-Fusion)  |
                  +------------+------------+
                               |
                  +------------v------------+
                  |  Risk Assessment Agent  |
                  |  (Composite 0-100 Score)|
                  +------------+------------+
                               |
                  +------------v------------+
                  | Route Optimization Agent|
                  | (Safe/Avoid/Fuel Routes)|
                  +------------+------------+
                               |
                  +------------v------------+
                  |  Explainability Agent   |
                  |  (Evidence & 6 Reg Lang)|
                  +------------+------------+
                               |
                  +------------v------------+
                  |  Synthesized Response   |
                  +-------------------------+
```

---

## Agent Responsibilities

1. **Intent Agent**: Detects incoming language script (Telugu, Hindi, Tamil, Kannada, Malayalam, English) and classifies intent.
2. **Planner Agent**: Decomposes the operational query into sub-tasks and schedules parallel node execution.
3. **Weather Agent**: Ingests live OpenWeatherMap API and IMD coastal buoy telemetry.
4. **Ocean Agent**: Ingests INCOIS Potential Fishing Zones (PFZ), SST thermal fronts, and Chlorophyll-a density.
5. **GIS Agent**: Conducts spatial containment and polygon collision checks against Marine Protected Areas (MPAs) and International Maritime Boundary Lines (IMBL).
6. **Marine RAG Agent**: Performs semantic retrieval across official oceanographic bulletins, research papers, and maritime regulations.
7. **Marine Reasoning Engine**: Performs cross-agent context fusion, balancing biological catch opportunities against physical safety risks.
8. **Risk Assessment Agent**: Computes a multi-criteria numerical hazard score (0–100) and classifies severity into Low, Medium, High, and Critical tiers.
9. **Route Optimization Agent**: Plans 3 navigational corridors (Safe Route, Risk Avoidance Route, and Fuel Efficient Route) with GPS waypoints.
10. **Explainability Agent**: Details evidentiary sources, sensor attributions, factor weights, and translates findings into regional languages.

"""
ORCA-X Multi-Agent System Orchestrator
Links Intent, Planner, Weather, Ocean, GIS, RAG, Reasoning, Risk, Route, and Explainability Agents.
"""

from typing import Dict, Any
from backend.agents.intent_agent import run_intent_agent
from backend.agents.planner_agent import run_planner_agent
from backend.agents.weather_agent import run_weather_agent
from backend.agents.ocean_agent import run_ocean_agent
from backend.agents.gis_agent import run_gis_agent
from backend.agents.rag_agent import run_rag_agent
from backend.agents.reasoning_agent import run_reasoning_agent
from backend.agents.risk_agent import run_risk_agent
from backend.agents.route_agent import run_route_agent
from backend.agents.explainability_agent import run_explainability_agent
from backend.schemas.schemas import AgentQueryResponse, AgentStepTrace

async def execute_orca_workflow(
    query: str,
    language: str = "en",
    latitude: float = 17.6868,
    longitude: float = 83.2185
) -> AgentQueryResponse:
    """
    Executes the full ORCA-X multi-agent pipeline:
    User Query -> Intent -> Planner -> (Weather + Ocean + GIS + RAG) -> Reasoning -> Risk -> Route -> Explainability -> Response
    """
    state: Dict[str, Any] = {
        "query": query,
        "language": language,
        "latitude": latitude if latitude else 17.6868,
        "longitude": longitude if longitude else 83.2185,
        "execution_trace": [],
        "data_sources": []
    }

    # Step 1: Intent Agent
    state = await run_intent_agent(state)

    # Step 2: Planner Agent
    state = await run_planner_agent(state)

    # Step 3, 4, 5: Parallel/Sequential Domain Ingestion Agents
    state = await run_weather_agent(state)
    state = await run_ocean_agent(state)
    state = await run_gis_agent(state)

    # Step 6: Marine Knowledge RAG Agent
    state = await run_rag_agent(state)

    # Step 7: Marine Reasoning Engine
    state = await run_reasoning_agent(state)

    # Step 8: Risk Assessment Agent
    state = await run_risk_agent(state)

    # Step 9: Route Optimization Agent
    state = await run_route_agent(state)

    # Step 10: Explainability Agent
    state = await run_explainability_agent(state)

    traces = [AgentStepTrace(**t) for t in state.get("execution_trace", [])]

    return AgentQueryResponse(
        query=query,
        detected_language=state.get("detected_language", "en"),
        response_text=state.get("response_text", ""),
        translated_responses=state.get("translated_responses", {}),
        confidence_score=state.get("confidence_score", 0.95),
        data_sources=state.get("data_sources", []),
        evidence=state.get("evidence", []),
        execution_trace=traces,
        suggested_actions=state.get("suggested_actions", []),
        geo_context={
            "latitude": state.get("latitude"),
            "longitude": state.get("longitude"),
            "sector": state.get("ocean_data", {}).get("sector", "Coastal Waters")
        }
    )

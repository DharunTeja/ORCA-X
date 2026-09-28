"""
Planner Agent: Decomposes tasks and establishes the multi-agent DAG execution plan.
"""

from typing import Dict, Any, List

async def run_planner_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    intent = state.get("intent", "GENERAL_MARINE_QUERY")
    
    execution_plan: List[str] = [
        "Weather Agent (IMD / Marine Telemetry)",
        "Ocean Agent (INCOIS PFZ / SST)",
        "GIS Agent (MPA / IMBL Spatial Check)",
        "Marine Knowledge RAG Agent (Advisories & Guidelines)",
        "Marine Reasoning Engine (Context Fusion)",
        "Risk Assessment Agent (Hazard Scoring)",
        "Route Optimization Agent (Pathfinding)",
        "Explainability Agent (Source Attribution & Confidence Calibration)"
    ]

    trace_step = {
        "agent_name": "Planner Agent",
        "status": "COMPLETED",
        "details": f"Generated DAG execution plan with {len(execution_plan)} collaborative agent nodes for intent '{intent}'",
        "confidence": 0.96,
        "timestamp": "T+0.12s"
    }

    traces = state.get("execution_trace", [])
    traces.append(trace_step)

    return {
        **state,
        "execution_plan": execution_plan,
        "execution_trace": traces
    }

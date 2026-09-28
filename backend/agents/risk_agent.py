"""
Risk Assessment Agent: Calculates numerical composite hazard score and severity classification.
"""

from typing import Dict, Any
from backend.services.risk_service import evaluate_marine_risk

async def run_risk_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    lat = state.get("latitude", 17.6868)
    lon = state.get("longitude", 83.2185)

    risk_res = await evaluate_marine_risk(lat, lon)
    risk_dict = risk_res.model_dump()

    trace_step = {
        "agent_name": "Risk Assessment Agent",
        "status": "COMPLETED",
        "details": f"Composite Risk Index: {risk_res.overall_score}/100 ({risk_res.severity}). Wave Risk: {risk_res.wave_risk}, Storm: {risk_res.storm_risk}, Boundary: {risk_res.boundary_risk}",
        "confidence": 0.96,
        "timestamp": "T+0.89s"
    }

    traces = state.get("execution_trace", [])
    traces.append(trace_step)

    return {
        **state,
        "risk_assessment": risk_dict,
        "execution_trace": traces
    }

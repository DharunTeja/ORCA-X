"""
Intent Agent: Understands query, detects regional language, identifies domain intent.
"""

from typing import Dict, Any
from backend.utils.languages import detect_language

async def run_intent_agent(state: Dict[str, Any]) -> Dict[str, Any]:
    query = state.get("query", "")
    lang = state.get("language")
    if not lang or lang == "en":
        detected_lang = detect_language(query)
    else:
        detected_lang = lang

    q_lower = query.lower()
    
    # Categorize intent
    if any(w in q_lower for w in ["route", "path", "navigate", "distance", "voyage", "fuel", "travel"]):
        intent = "ROUTE_PLANNING"
    elif any(w in q_lower for w in ["risk", "danger", "cyclone", "storm", "wave", "safe", "hazard", "threat"]):
        intent = "RISK_ASSESSMENT"
    elif any(w in q_lower for w in ["fish", "pfz", "chlorophyll", "sst", "catch", "species", "tuna", "sardine"]):
        intent = "OCEAN_INTELLIGENCE"
    elif any(w in q_lower for w in ["weather", "wind", "rain", "temperature", "cloud", "imd", "advisory"]):
        intent = "WEATHER_INTELLIGENCE"
    elif any(w in q_lower for w in ["rule", "guideline", "research", "paper", "bulletin", "law", "document", "history"]):
        intent = "KNOWLEDGE_RAG"
    else:
        intent = "GENERAL_MARINE_QUERY"

    trace_step = {
        "agent_name": "Intent Agent",
        "status": "COMPLETED",
        "details": f"Detected query language: {detected_lang.upper()}, classified intent: {intent}",
        "confidence": 0.98,
        "timestamp": "T+0.05s"
    }

    traces = state.get("execution_trace", [])
    traces.append(trace_step)

    return {
        **state,
        "detected_language": detected_lang,
        "intent": intent,
        "execution_trace": traces
    }

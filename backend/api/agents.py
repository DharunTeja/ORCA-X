from fastapi import APIRouter
from backend.schemas.schemas import AgentQueryRequest, AgentQueryResponse
from backend.agents.workflow import execute_orca_workflow
from backend.utils.languages import LANGUAGE_NAMES

router = APIRouter(prefix="/api/agents", tags=["Multi-Agent System"])

@router.post("/query", response_model=AgentQueryResponse)
async def query_agents(req: AgentQueryRequest):
    """
    Execute full multi-agent collaborative workflow for query analysis,
    PFZ recommendation, risk scoring, route optimization, explainability, and translation.
    """
    return await execute_orca_workflow(
        query=req.query,
        language=req.language or "en",
        latitude=req.latitude or 17.6868,
        longitude=req.longitude or 83.2185
    )

@router.get("/languages")
async def get_supported_languages():
    """Retrieve list of supported regional languages and native display labels."""
    return [
        {"code": code, "name": name}
        for code, name in LANGUAGE_NAMES.items()
    ]

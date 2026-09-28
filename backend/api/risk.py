from fastapi import APIRouter
from backend.schemas.schemas import RiskAssessmentRequest, RiskAssessmentResponse
from backend.services.risk_service import evaluate_marine_risk

router = APIRouter(prefix="/api/risk", tags=["Risk Assessment"])

@router.post("/evaluate", response_model=RiskAssessmentResponse)
async def evaluate_risk(req: RiskAssessmentRequest):
    """Calculate multi-parametric maritime risk score (0-100) and localized advisories."""
    return await evaluate_marine_risk(
        lat=req.latitude,
        lon=req.longitude,
        vessel_type=req.vessel_type or "Trawler",
        vessel_length_m=req.vessel_length_m or 18.0
    )

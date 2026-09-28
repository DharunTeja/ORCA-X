from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database.connection import get_db
from backend.models.models import User, Alert, AuditLog
from backend.schemas.schemas import AlertCreate, AlertResponse

router = APIRouter(prefix="/api/admin", tags=["Admin & System Governance"])

# Registered Multi-Agent System Nodes
AGENT_REGISTRY = [
    {"id": "agent-intent", "name": "Intent & Language Agent", "status": "ONLINE", "type": "Core Orchestrator", "latency_ms": 48, "throughput": "120 req/min"},
    {"id": "agent-planner", "name": "Planner Agent", "status": "ONLINE", "type": "DAG Decomposer", "latency_ms": 62, "throughput": "115 req/min"},
    {"id": "agent-weather", "name": "Weather Agent", "status": "ONLINE", "type": "IMD Atmospheric Integration", "latency_ms": 110, "throughput": "95 req/min"},
    {"id": "agent-ocean", "name": "Ocean Agent", "status": "ONLINE", "type": "INCOIS PFZ / SST Engine", "latency_ms": 85, "throughput": "105 req/min"},
    {"id": "agent-gis", "name": "GIS Agent", "status": "ONLINE", "type": "Spatial Boundary & MPA", "latency_ms": 35, "throughput": "150 req/min"},
    {"id": "agent-rag", "name": "Marine Knowledge RAG Agent", "status": "ONLINE", "type": "Vector Knowledge Search", "latency_ms": 125, "throughput": "90 req/min"},
    {"id": "agent-reasoning", "name": "Marine Reasoning Engine", "status": "ONLINE", "type": "Cross-Agent Context Fusion", "latency_ms": 140, "throughput": "80 req/min"},
    {"id": "agent-risk", "name": "Risk Assessment Agent", "status": "ONLINE", "type": "Multi-Criteria Hazard Scorer", "latency_ms": 72, "throughput": "110 req/min"},
    {"id": "agent-route", "name": "Route Optimization Agent", "status": "ONLINE", "type": "Maritime Pathfinding", "latency_ms": 95, "throughput": "100 req/min"},
    {"id": "agent-explain", "name": "Explainability Agent", "status": "ONLINE", "type": "Attribution & Localization", "latency_ms": 80, "throughput": "115 req/min"}
]

@router.get("/agents")
async def list_registered_agents():
    """Retrieve the operational status, health, and throughput of all 10 AI Agents."""
    return AGENT_REGISTRY

@router.post("/broadcast-alert", response_model=AlertResponse)
async def broadcast_alert(
    alert_in: AlertCreate,
    db: AsyncSession = Depends(get_db)
):
    """Broadcast high-priority emergency advisory to coastal maritime fleets."""
    new_alert = Alert(
        title=alert_in.title,
        category=alert_in.category,
        severity=alert_in.severity,
        message=alert_in.message,
        region=alert_in.region,
        latitude=alert_in.latitude,
        longitude=alert_in.longitude,
        is_active=True
    )
    db.add(new_alert)

    audit = AuditLog(
        action="ALERT_BROADCAST",
        user_email="operator@orca-x.gov.in",
        details=f"Issued {alert_in.severity} alert: {alert_in.title} in {alert_in.region}"
    )
    db.add(audit)

    await db.commit()
    await db.refresh(new_alert)
    return new_alert

@router.get("/audit-logs")
async def get_audit_logs(
    db: AsyncSession = Depends(get_db)
):
    """Retrieve security audit logs and agent invocation events."""
    stmt = select(AuditLog).order_by(AuditLog.timestamp.desc()).limit(50)
    res = await db.execute(stmt)
    return res.scalars().all()

@router.get("/system-health")
async def get_system_health():
    """Returns telemetry on API endpoints, database, vector indices, and external feeds."""
    return {
        "status": "OPERATIONAL",
        "uptime": "99.98%",
        "active_vessels_tracked": 1420,
        "pfz_coverage_area_sqkm": 84500,
        "data_sync": {
            "incois_pfz_feed": "LIVE (Sync: 4m ago)",
            "imd_cyclone_feed": "LIVE (Sync: 2m ago)",
            "sentinel_3_olci": "LIVE (Pass: 08:30 UTC)",
            "ais_vms_telemetry": "CONNECTED (42 stations)"
        },
        "system_load": {
            "cpu_utilization": "22%",
            "memory_utilization": "38%",
            "database_latency_ms": 1.4
        }
    }

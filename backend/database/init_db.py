import os
import sys
from pathlib import Path

# Ensure project root & backend are on sys.path
backend_dir = Path(__file__).resolve().parent.parent
project_root = backend_dir.parent
for p in [str(backend_dir), str(project_root)]:
    if p not in sys.path:
        sys.path.insert(0, p)

import asyncio
from datetime import datetime, timedelta, timezone
from sqlalchemy import select
from backend.database.connection import engine, Base, AsyncSessionLocal
from backend.models.models import User, Alert, PFZRecord, MarineDocument, AuditLog
from backend.utils.security import get_password_hash

async def init_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if users already exist
        stmt = select(User).limit(1)
        res = await session.execute(stmt)
        if res.scalar_one_or_none() is None:
            # Seed default users
            admin_user = User(
                email="admin@orca-x.gov.in",
                hashed_password=get_password_hash("Admin@ORCA2026"),
                full_name="Dr. S. K. Narayanan (Director General)",
                role="admin",
                preferred_language="en",
                is_active=True
            )
            operator_user = User(
                email="operator@orca-x.gov.in",
                hashed_password=get_password_hash("Operator@ORCA2026"),
                full_name="R. Venkatesh (Maritime Ops Commander)",
                role="operator",
                preferred_language="te",
                is_active=True
            )
            researcher_user = User(
                email="researcher@incois.gov.in",
                hashed_password=get_password_hash("Ocean@INCOIS2026"),
                full_name="Dr. Ananya Sharma (Chief Oceanographer)",
                role="researcher",
                preferred_language="hi",
                is_active=True
            )
            fisherman_user = User(
                email="fisherman@coastal.in",
                hashed_password=get_password_hash("Fish@Sea2026"),
                full_name="K. Murugan (Coastal Cooperative Lead)",
                role="fisherman",
                preferred_language="ta",
                is_active=True
            )
            session.add_all([admin_user, operator_user, researcher_user, fisherman_user])

            # Seed PFZ Records
            pfz_records = [
                PFZRecord(
                    zone_id="PFZ-AP-01",
                    sector="Andhra Pradesh - Visakhapatnam Offing",
                    latitude=17.5833,
                    longitude=83.4500,
                    depth_m=42.5,
                    distance_km=28.4,
                    bearing_deg=115.0,
                    sst_celsius=27.4,
                    chlorophyll_mg_m3=1.85,
                    potential_species="Yellowfin Tuna, Ribbon Fish, Indian Mackerel",
                    confidence_score=0.92,
                    valid_until=datetime.now(timezone.utc) + timedelta(days=2)
                ),
                PFZRecord(
                    zone_id="PFZ-AP-02",
                    sector="Andhra Pradesh - Kakinada Deep Front",
                    latitude=16.8500,
                    longitude=82.5500,
                    depth_m=38.0,
                    distance_km=34.2,
                    bearing_deg=130.0,
                    sst_celsius=27.1,
                    chlorophyll_mg_m3=2.10,
                    potential_species="Sardines, Seer Fish, Croakers",
                    confidence_score=0.88,
                    valid_until=datetime.now(timezone.utc) + timedelta(days=2)
                ),
                PFZRecord(
                    zone_id="PFZ-TN-01",
                    sector="Tamil Nadu - Chennai Coastline",
                    latitude=13.1200,
                    longitude=80.4500,
                    depth_m=55.0,
                    distance_km=22.0,
                    bearing_deg=85.0,
                    sst_celsius=28.2,
                    chlorophyll_mg_m3=1.45,
                    potential_species="Skipjack Tuna, Carangids, Barracuda",
                    confidence_score=0.84,
                    valid_until=datetime.now(timezone.utc) + timedelta(days=2)
                ),
                PFZRecord(
                    zone_id="PFZ-KL-01",
                    sector="Kerala - Kochi Shelf Edge",
                    latitude=9.9500,
                    longitude=75.9200,
                    depth_m=62.0,
                    distance_km=31.5,
                    bearing_deg=250.0,
                    sst_celsius=26.8,
                    chlorophyll_mg_m3=2.45,
                    potential_species="Oil Sardine, Indian Mackerel, Squid",
                    confidence_score=0.94,
                    valid_until=datetime.now(timezone.utc) + timedelta(days=2)
                ),
                PFZRecord(
                    zone_id="PFZ-MH-01",
                    sector="Maharashtra - Mumbai High South",
                    latitude=18.8200,
                    longitude=72.4800,
                    depth_m=70.0,
                    distance_km=45.0,
                    bearing_deg=260.0,
                    sst_celsius=27.6,
                    chlorophyll_mg_m3=1.70,
                    potential_species="Pomfret, Bombay Duck, Ribbon Fish",
                    confidence_score=0.89,
                    valid_until=datetime.now(timezone.utc) + timedelta(days=2)
                ),
                PFZRecord(
                    zone_id="PFZ-OD-01",
                    sector="Odisha - Paradip Continental Slope",
                    latitude=20.1500,
                    longitude=86.9500,
                    depth_m=48.0,
                    distance_km=36.0,
                    bearing_deg=140.0,
                    sst_celsius=26.5,
                    chlorophyll_mg_m3=2.30,
                    potential_species="Hilsa, Seer Fish, Threadfin Bream",
                    confidence_score=0.91,
                    valid_until=datetime.now(timezone.utc) + timedelta(days=2)
                ),
                PFZRecord(
                    zone_id="PFZ-KA-01",
                    sector="Karnataka - Mangaluru Offshore",
                    latitude=12.7800,
                    longitude=74.5500,
                    depth_m=50.0,
                    distance_km=26.0,
                    bearing_deg=240.0,
                    sst_celsius=27.9,
                    chlorophyll_mg_m3=1.95,
                    potential_species="Mackerel, Kingfish, Anchovies",
                    confidence_score=0.87,
                    valid_until=datetime.now(timezone.utc) + timedelta(days=2)
                ),
                PFZRecord(
                    zone_id="PFZ-GJ-01",
                    sector="Gujarat - Veraval Saurashtra Coast",
                    latitude=20.7500,
                    longitude=70.1500,
                    depth_m=65.0,
                    distance_km=38.0,
                    bearing_deg=210.0,
                    sst_celsius=25.9,
                    chlorophyll_mg_m3=2.60,
                    potential_species="Ribbon Fish, Cuttlefish, Croakers",
                    confidence_score=0.93,
                    valid_until=datetime.now(timezone.utc) + timedelta(days=2)
                )
            ]
            session.add_all(pfz_records)

            # Seed Alerts
            alerts = [
                Alert(
                    title="Deep Depression Advisory - Bay of Bengal Sector",
                    category="Cyclone",
                    severity="High",
                    message="IMD reports deep depression centered at 15.2N, 86.8E moving NW. Squally winds reaching 55-65 kmph gusting to 75 kmph. Sea conditions very rough.",
                    region="Bay of Bengal - Central & North",
                    latitude=15.2000,
                    longitude=86.8000,
                    is_active=True
                ),
                Alert(
                    title="High Swell Wave Alert (INCOIS)",
                    category="High Wave",
                    severity="Medium",
                    message="High waves in the range of 3.0 - 3.8 meters are forecasted along the coastline of Kerala and South Tamil Nadu from Vizhinjam to Kasaragod.",
                    region="Southwest Coastal Waters",
                    latitude=9.1000,
                    longitude=76.2000,
                    is_active=True
                ),
                Alert(
                    title="Maritime Boundary Geofence Warning",
                    category="Boundary",
                    severity="Critical",
                    message="Vessels operating near Palk Strait & Gulf of Mannar are advised to stay well west of International Maritime Boundary Line (IMBL). Automatic tracking active.",
                    region="Palk Bay & Gulf of Mannar",
                    latitude=9.3500,
                    longitude=79.4500,
                    is_active=True
                ),
                Alert(
                    title="Marine Protected Area Restriction - Gahirmatha",
                    category="Protected Zone",
                    severity="High",
                    message="Olive Ridley Turtle nesting sanctuary buffer zone active. Mechanized and motorized fishing strictly banned within 20km seaward limit.",
                    region="Odisha Coastal Sanctuary",
                    latitude=20.7200,
                    longitude=87.0500,
                    is_active=True
                )
            ]
            session.add_all(alerts)

            # Seed Marine Documents
            documents = [
                MarineDocument(
                    title="INCOIS Ocean State Forecast & PFZ Composite Bulletin #842",
                    category="Bulletin",
                    source="INCOIS",
                    publication_date="2026-09-27",
                    summary="Multi-satellite thermal infrared (NOAA-AVHRR, MODIS) and ocean color (Sentinel-3 OLCI) analysis showing productive thermal front persistence along East Coast.",
                    full_text="INCOIS Potential Fishing Zone (PFZ) advisory validation report indicates 70% higher Catch Per Unit Effort (CPUE) for pelagic gillnetters operating in thermal gradient boundaries with chlorophyll exceeding 1.8 mg/m3. Thermal gradients between 26.8C and 27.5C provide optimal foraging conditions for shoaling species.",
                    keywords="PFZ, Chlorophyll, SST, Remote Sensing, CPUE, East Coast",
                    file_url="/docs/bulletins/INCOIS_PFZ_842.pdf"
                ),
                MarineDocument(
                    title="IMD Marine Climatology & Cyclogenesis Warning Guidelines",
                    category="Advisory",
                    source="IMD",
                    publication_date="2026-09-25",
                    summary="Operational standard operating procedures for tropical cyclone track forecast and squally weather advisories across North Indian Ocean basin.",
                    full_text="Criteria for sea safety: When sustained surface wind speeds exceed 28 knots (Force 7 Beaufort Scale) or significant wave height exceeds 3.5 meters, maritime operations and artisanal fishing should be suspended immediately. Port warning signals 3 through 10 must be communicated via VHF Channel 16 and NAVTEX.",
                    keywords="Cyclone, Wind Hazard, Port Warning, Sea Safety, IMD",
                    file_url="/docs/guidelines/IMD_Marine_SOP.pdf"
                ),
                MarineDocument(
                    title="CMFRI Pelagic Fishery Stock & Sustainable Yield Assessment",
                    category="Research",
                    source="CMFRI",
                    publication_date="2026-08-15",
                    summary="Annual biomass trends for Indian Oil Sardine (Sardinella longiceps) and Indian Mackerel (Rastrelliger kanagurta) across Arabian Sea and Bay of Bengal.",
                    full_text="Ecosystem-based fisheries management data confirms that pelagic stocks are highly sensitive to El Nino Southern Oscillation (ENSO) and Indian Ocean Dipole (IOD). High chlorophyll upwelling zones along the Malabar coast correlate directly with post-monsoon spawning recruitment success.",
                    keywords="CMFRI, Fisheries, Sustainable Yield, Biomass, Upwelling",
                    file_url="/docs/research/CMFRI_Pelagic_Assessment_2026.pdf"
                ),
                MarineDocument(
                    title="Maritime Boundary Geofencing & Marine Sanctuary Protection Act",
                    category="Guideline",
                    source="MoES",
                    publication_date="2026-07-10",
                    summary="Comprehensive regulatory framework for navigational compliance, IMBL security boundaries, and Marine Protected Area (MPA) conservation protocols.",
                    full_text="All mechanized fishing crafts exceeding 12m OAL must transmit AIS Class B or VMS telemetry. Navigation within 5 nautical miles of designated Marine Protected Areas (e.g. Gulf of Mannar Biosphere Reserve, Marine National Park Jamnagar, Gahirmatha Sanctuary) requires strict transit permits with zero trawling gear deployment.",
                    keywords="IMBL, MPA, Regulations, VMS, Navigation Safety, Geofence",
                    file_url="/docs/guidelines/MoES_Maritime_Boundary_Act.pdf"
                )
            ]
            session.add_all(documents)

            # Seed Audit Logs
            audit = AuditLog(
                action="SYSTEM_INIT",
                user_email="system@orca-x.gov.in",
                ip_address="127.0.0.1",
                details="ORCA-X Production Database Initialized with geospatial datasets, INCOIS PFZ vectors, IMD alerts, and knowledge index."
            )
            session.add(audit)

            await session.commit()

if __name__ == "__main__":
    asyncio.run(init_database())

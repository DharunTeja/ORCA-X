from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey
from backend.database.connection import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="operator")  # admin, operator, researcher, fisherman
    preferred_language = Column(String(10), default="en")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)  # Cyclone, High Wave, Wind, Boundary, PFZ
    severity = Column(String(20), nullable=False)  # Low, Medium, High, Critical
    message = Column(Text, nullable=False)
    region = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    is_active = Column(Boolean, default=True)
    issued_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class PFZRecord(Base):
    __tablename__ = "pfz_records"

    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(String(50), unique=True, index=True)
    sector = Column(String(100), nullable=False)  # e.g., Andhra Pradesh Coastal Sector
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    depth_m = Column(Float, nullable=False)
    distance_km = Column(Float, nullable=False)
    bearing_deg = Column(Float, nullable=False)
    sst_celsius = Column(Float, nullable=False)
    chlorophyll_mg_m3 = Column(Float, nullable=False)
    potential_species = Column(String(255), nullable=False)
    confidence_score = Column(Float, default=0.85)
    valid_until = Column(DateTime, nullable=False)

class MarineDocument(Base):
    __tablename__ = "marine_documents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(50), nullable=False)  # Bulletin, Advisory, Research, Guideline
    source = Column(String(100), nullable=False)   # INCOIS, IMD, CMFRI, NIOT, MoES
    publication_date = Column(String(50), nullable=False)
    summary = Column(Text, nullable=False)
    full_text = Column(Text, nullable=False)
    keywords = Column(String(255), nullable=True)
    file_url = Column(String(255), nullable=True)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(100), nullable=False)
    user_email = Column(String(255), nullable=True)
    ip_address = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

class SavedRoute(Base):
    __tablename__ = "saved_routes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    route_name = Column(String(255), nullable=False)
    origin_port = Column(String(100), nullable=False)
    destination_port = Column(String(100), nullable=False)
    distance_nm = Column(Float, nullable=False)
    route_type = Column(String(50), default="Safe Route")
    waypoints_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

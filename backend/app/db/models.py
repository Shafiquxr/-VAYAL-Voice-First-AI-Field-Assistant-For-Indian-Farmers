import uuid
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    phone = Column(String(20), unique=True, nullable=False)
    language = Column(String(10), default="ta-IN")
    village = Column(String(100), default="Vaduvur")
    district = Column(String(100), default="Thanjavur")
    state = Column(String(100), default="Tamil Nadu")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    fields = relationship("Field", back_populates="user", cascade="all, delete-orphan")
    voice_sessions = relationship("VoiceSession", back_populates="user", cascade="all, delete-orphan")

class Field(Base):
    __tablename__ = "fields"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    name = Column(String(255), nullable=False) # e.g. "வடக்கு வயல் (North Field)"
    crop = Column(String(100), default="Paddy (நெல்)")
    variety = Column(String(100), default="BPT 5204 (Samba Mahsuri)")
    area_acres = Column(Float, default=2.4)
    planting_date = Column(String(20), default="2026-07-15")
    soil_type = Column(String(100), default="Clay Loam (களிமண் கலந்த வண்டல்)")
    irrigation_source = Column(String(100), default="Kallanai Canal & Borewell")
    latitude = Column(Float, default=10.7870)
    longitude = Column(Float, default=79.1378)
    geometry_geojson = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="fields")
    observations = relationship("FieldObservation", back_populates="field", cascade="all, delete-orphan")
    decisions = relationship("Decision", back_populates="field", cascade="all, delete-orphan")
    weather_records = relationship("WeatherObservation", back_populates="field", cascade="all, delete-orphan")
    satellite_records = relationship("SatelliteObservation", back_populates="field", cascade="all, delete-orphan")
    predictions = relationship("ModelPrediction", back_populates="field", cascade="all, delete-orphan")

class FieldObservation(Base):
    __tablename__ = "field_observations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    field_id = Column(String(36), ForeignKey("fields.id"), nullable=False)
    type = Column(String(50), nullable=False) # IRRIGATION, RAINFALL, CROP_SYMPTOM, FERTILIZER, FARMER_NOTE
    source = Column(String(50), nullable=False) # farmer_voice, vision_model, weather_station, satellite
    value = Column(JSON, nullable=False)
    confidence = Column(Float, default=1.0)
    voice_transcript = Column(Text, nullable=True)
    observed_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="observations")

class Decision(Base):
    __tablename__ = "decisions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    field_id = Column(String(36), ForeignKey("fields.id"), nullable=False)
    decision_type = Column(String(20), nullable=False) # ACT, WAIT, INSPECT
    domain = Column(String(50), nullable=False) # IRRIGATION, DISEASE_MANAGEMENT, FERTILIZER, HARVEST
    action_en = Column(String(255), nullable=False)
    action_ta = Column(String(255), nullable=False)
    reason_en = Column(Text, nullable=False)
    reason_ta = Column(Text, nullable=False)
    confidence = Column(Float, default=0.88)
    evidence_summary = Column(JSON, nullable=False)
    status = Column(String(50), default="active") # active, executed, dismissed
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="decisions")

class Action(Base):
    __tablename__ = "actions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    field_id = Column(String(36), ForeignKey("fields.id"), nullable=False)
    decision_id = Column(String(36), ForeignKey("decisions.id"), nullable=True)
    action_type = Column(String(100), nullable=False)
    status = Column(String(50), default="completed")
    farmer_note = Column(Text, nullable=True)
    performed_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

class WeatherObservation(Base):
    __tablename__ = "weather_observations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    field_id = Column(String(36), ForeignKey("fields.id"), nullable=False)
    location_name = Column(String(100), default="Thanjavur, Tamil Nadu")
    temperature_c = Column(Float, nullable=False)
    humidity_pct = Column(Integer, nullable=False)
    rainfall_mm = Column(Float, default=0.0)
    rain_probability_pct = Column(Integer, nullable=False)
    wind_speed_kmh = Column(Float, nullable=False)
    condition = Column(String(100), nullable=False)
    forecast_5day = Column(JSON, nullable=False)
    observed_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="weather_records")

class SatelliteObservation(Base):
    __tablename__ = "satellite_observations"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    field_id = Column(String(36), ForeignKey("fields.id"), nullable=False)
    source = Column(String(50), default="Sentinel-2 L2A")
    observation_date = Column(String(20), nullable=False)
    cloud_cover_pct = Column(Float, default=4.2)
    vegetation_index = Column(Float, default=0.685) # NDVI
    water_index = Column(Float, default=0.312) # NDWI
    crop_condition = Column(String(50), default="Good") # Good, Stable, Stressed
    trend = Column(String(50), default="Healthy Growth")
    raw_metrics = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="satellite_records")

class ModelPrediction(Base):
    __tablename__ = "model_predictions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    field_id = Column(String(36), ForeignKey("fields.id"), nullable=False)
    model_name = Column(String(100), default="paddy_doctor_v2")
    image_url = Column(Text, nullable=True)
    prediction = Column(String(255), nullable=False)
    tamil_prediction = Column(String(255), nullable=False)
    confidence = Column(Float, default=0.87)
    symptoms = Column(JSON, nullable=False)
    recommendations_en = Column(JSON, nullable=False)
    recommendations_ta = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    field = relationship("Field", back_populates="predictions")

class VoiceSession(Base):
    __tablename__ = "voice_sessions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    field_id = Column(String(36), ForeignKey("fields.id"), nullable=True)
    language = Column(String(10), default="ta-IN")
    transcript = Column(Text, nullable=False)
    intent = Column(String(100), nullable=False)
    intent_parameters = Column(JSON, nullable=True)
    response_text_en = Column(Text, nullable=False)
    response_text_ta = Column(Text, nullable=False)
    audio_response_url = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="voice_sessions")

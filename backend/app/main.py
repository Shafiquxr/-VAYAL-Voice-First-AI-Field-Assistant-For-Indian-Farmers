from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.db.database import engine, Base, SessionLocal
from app.services.seed_data import seed_database
from app.api.routes_fields import router as fields_router
from app.api.routes_voice import router as voice_router
from app.api.routes_crop_doctor import router as crop_doctor_router
from app.api.routes_weather import router as weather_router

# Initialize database schemas
Base.metadata.create_all(bind=engine)

# Seed realistic data
db = SessionLocal()
try:
    seed_database(db)
finally:
    db.close()

app = FastAPI(
    title=settings.APP_NAME,
    description="VAYAL Voice-First AI Agricultural Field Assistant Backend",
    version="1.0.0"
)

# CORS middleware for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fields_router)
app.include_router(voice_router)
app.include_router(crop_doctor_router)
app.include_router(weather_router)

@app.get("/")
def root():
    return {
        "status": "online",
        "app": "VAYAL Voice-First AI Field Assistant",
        "version": "1.0.0",
        "farmer": "Arun Kumar (Vaduvur, Thanjavur)"
    }

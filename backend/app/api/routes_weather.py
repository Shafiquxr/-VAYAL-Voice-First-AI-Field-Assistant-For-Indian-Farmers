from fastapi import APIRouter, Query
from app.services.weather_service import OpenMeteoWeatherService

router = APIRouter(prefix="/api/weather", tags=["Agro-Weather & Soil Moisture"])

@router.get("/live")
def get_live_weather(
    lat: float = Query(10.7870, description="Latitude (default Thanjavur: 10.7870)"),
    lon: float = Query(79.1378, description="Longitude (default Thanjavur: 79.1378)"),
    location: str = Query("Thanjavur, Tamil Nadu", description="Location name")
):
    """
    Fetch live real-time agro-meteorological data from Open-Meteo including:
    - Temperature, Rain, Relative Humidity, Wind Speed
    - Multi-depth Soil Moisture (1-3cm, 3-9cm, 9-27cm) & Soil Temp (6cm, 18cm)
    - 7-Day agricultural forecast with Tamil localization
    - Real-time Decision Twin recommendation
    """
    return OpenMeteoWeatherService.get_live_weather_and_soil(
        latitude=lat,
        longitude=lon,
        location_name=location
    )

@router.get("/decision")
def get_irrigation_decision(
    lat: float = Query(10.7870, description="Latitude"),
    lon: float = Query(79.1378, description="Longitude")
):
    """
    Returns live Decision Twin evaluated from real-time Open-Meteo soil moisture & rain signals.
    """
    weather_data = OpenMeteoWeatherService.get_live_weather_and_soil(
        latitude=lat,
        longitude=lon
    )
    return {
        "decision": weather_data.get("decision"),
        "soil": weather_data.get("soil"),
        "rain_forecast_24h_mm": weather_data.get("rainfallNext24hMm"),
        "rain_probability_pct": weather_data.get("rainProbabilityPct")
    }

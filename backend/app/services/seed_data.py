from sqlalchemy.orm import Session
from app.db.models import User, Field, Decision, WeatherObservation, SatelliteObservation, ModelPrediction, FieldObservation

def seed_database(db: Session):
    # Check if already seeded
    if db.query(User).filter_by(phone="+91 98421 55670").first():
        return

    # 1. Farmer Profile
    user = User(
        name="Arun Kumar",
        phone="+91 98421 55670",
        language="ta-IN",
        village="Vaduvur",
        district="Thanjavur",
        state="Tamil Nadu"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Paddy Field
    field = Field(
        user_id=user.id,
        name="வடக்கு வயல் (North Field)",
        crop="Paddy (நெல்)",
        variety="BPT 5204 (Samba Mahsuri)",
        area_acres=2.4,
        planting_date="2026-07-15",
        soil_type="Clay Loam (வண்டல் களிமண்)",
        irrigation_source="Canal & Borewell",
        latitude=10.7870,
        longitude=79.1378
    )
    db.add(field)
    db.commit()
    db.refresh(field)

    # 3. Decision
    decision = Decision(
        field_id=field.id,
        decision_type="WAIT",
        domain="IRRIGATION",
        action_en="Skip irrigation for 24-48 hours",
        action_ta="அடுத்த 24-48 மணி நேரத்திற்கு பாசனம் செய்வதை தவிர்க்கவும்",
        reason_en="Soil moisture is adequate (68%) and 12-18mm rain is expected. Hold irrigation to prevent waterlogging.",
        reason_ta="மண்ணில் ஈரப்பதம் போதுமானதாக உள்ளது (68%). மேலும் அடுத்த 36 மணி நேரத்தில் 12-18 மி.மீ மழை வர வாய்ப்புள்ளது. எனவே இன்று தண்ணீர் விடாமல் காத்திருக்கலாம்.",
        confidence=0.89,
        evidence_summary={
            "soil_moisture_pct": 68,
            "rain_probability_pct": 74,
            "rainfall_forecast_mm": 14,
            "satellite_ndvi": 0.685
        }
    )
    db.add(decision)

    # 4. Weather Observation
    weather = WeatherObservation(
        field_id=field.id,
        location_name="Thanjavur, Tamil Nadu",
        temperature_c=28.0,
        humidity_pct=60,
        rainfall_mm=0.0,
        rain_probability_pct=72,
        wind_speed_kmh=12.0,
        condition="Partly Cloudy (ஓரளவு மேகமூட்டம்)",
        forecast_5day=[
            {"day": "Today", "day_ta": "இன்று", "temp_max": 28, "temp_min": 22, "rain_prob": 30},
            {"day": "Tomorrow", "day_ta": "நாளை", "temp_max": 27, "temp_min": 21, "rain_prob": 75},
            {"day": "Sat", "day_ta": "சனி", "temp_max": 26, "temp_min": 21, "rain_prob": 85},
            {"day": "Sun", "day_ta": "ஞாயிறு", "temp_max": 28, "temp_min": 22, "rain_prob": 45},
            {"day": "Mon", "day_ta": "திங்கள்", "temp_max": 29, "temp_min": 23, "rain_prob": 15}
        ]
    )
    db.add(weather)

    # 5. Satellite Observation
    satellite = SatelliteObservation(
        field_id=field.id,
        source="Sentinel-2 L2A",
        observation_date="2026-09-14",
        cloud_cover_pct=4.2,
        vegetation_index=0.685,
        water_index=0.312,
        crop_condition="Good",
        trend="Healthy Growth"
    )
    db.add(satellite)

    # 6. Model Prediction
    prediction = ModelPrediction(
        field_id=field.id,
        model_name="paddy_doctor_v2",
        prediction="Leaf Blight (in Rice)",
        tamil_prediction="இலை கருகல் நோய் (நெல்)",
        confidence=0.87,
        symptoms=[
            "Water-soaked yellowish lesions on leaf margins",
            "Wavy lesion margins drying to greyish brown"
        ],
        recommendations_en=[
            "Remove heavily affected leaves",
            "Use recommended fungicide (Carbendazim 1g per litre)",
            "Ensure proper water drainage",
            "Monitor for next 7 days"
        ],
        recommendations_ta=[
            "அதிகமாக பாதிக்கப்பட்ட இலைகளை அகற்றி அப்புறப்படுத்தவும்",
            "கார்பெண்டாசிம் (Carbendazim 1g/L) தெளிக்கவும்",
            "வயலில் நீர் தேங்காமல் வடிகட்டவும்",
            "அடுத்த 7 நாட்களுக்கு தொடர்ந்து கண்காணிக்கவும்"
        ]
    )
    db.add(prediction)

    db.commit()

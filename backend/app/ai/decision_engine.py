from typing import Dict, Any

class DecisionTwinEngine:
    """
    VAYAL Decision Twin Engine:
    Evaluates multimodal field signals (Soil moisture, Weather forecast, Satellite NDVI, Farmer observations)
    to output deterministic, farmer-understandable decisions: ACT, WAIT, or INSPECT.
    """

    @staticmethod
    def evaluate_irrigation(
        soil_moisture_pct: float,
        rain_prob_next_48h: float,
        rainfall_forecast_mm: float,
        crop_age_days: int
    ) -> Dict[str, Any]:
        if rain_prob_next_48h >= 65 and rainfall_forecast_mm >= 10.0:
            return {
                "decision_type": "WAIT",
                "action_en": "Skip irrigation for 24-48 hours",
                "action_ta": "அடுத்த 24-48 மணி நேரத்திற்கு பாசனம் செய்வதை தவிர்க்கவும்",
                "reason_en": f"Soil moisture is adequate ({soil_moisture_pct}%) and {rainfall_forecast_mm}mm rain is expected. Hold irrigation to prevent waterlogging and root rot.",
                "reason_ta": f"மண்ணில் ஈரப்பதம் போதுமானதாக உள்ளது ({soil_moisture_pct}%). மேலும் {rainfall_forecast_mm} மி.மீ மழை வர வாய்ப்புள்ளது. எனவே இன்று தண்ணீர் விடாமல் காத்திருக்கலாம்.",
                "confidence": 0.89,
                "evidence": {
                    "soil_moisture": soil_moisture_pct,
                    "rain_prob": rain_prob_next_48h,
                    "rainfall_mm": rainfall_forecast_mm,
                }
            }
        elif soil_moisture_pct < 45.0 and rain_prob_next_48h < 30.0:
            return {
                "decision_type": "ACT",
                "action_en": "Irrigate field today (2-3 inches standing water)",
                "action_ta": "இன்று வயலுக்கு பாசனம் செய்யவும் (2-3 அங்குல நீர் நிறுத்துங்கள்)",
                "reason_en": f"Soil moisture is low ({soil_moisture_pct}%) and no rainfall forecast. Paddy at {crop_age_days} days requires steady moisture.",
                "reason_ta": f"மண்ணில் ஈரப்பதம் குறைவாக உள்ளது ({soil_moisture_pct}%). மழைக்கு வாய்ப்பு இல்லை. எனவே இன்று வயலுக்கு பாசனம் செய்யலாம்.",
                "confidence": 0.92,
                "evidence": {
                    "soil_moisture": soil_moisture_pct,
                    "rain_prob": rain_prob_next_48h,
                }
            }
        else:
            return {
                "decision_type": "INSPECT",
                "action_en": "Inspect field corners and check drainage channels",
                "action_ta": "வயலின் மூலைகளையும் வடிகால் வாய்க்காலையும் பார்வையிடவும்",
                "reason_en": "Borderline moisture signals detected. Check field standing water before deciding.",
                "reason_ta": "வயல் ஈரப்பதத்தை நேரில் பார்த்து வடிகால் சீராக இருப்பதை உறுதி செய்யவும்.",
                "confidence": 0.82,
                "evidence": {
                    "soil_moisture": soil_moisture_pct,
                }
            }

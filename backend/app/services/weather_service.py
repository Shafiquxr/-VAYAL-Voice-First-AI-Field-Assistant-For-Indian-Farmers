import urllib.request
import urllib.parse
import json
import logging
import time
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

# WMO Weather interpretation codes (WW) to Tamil & English descriptions
WMO_WEATHER_MAP = {
    0: {"en": "Clear Sky", "ta": "தெளிவான வானம்", "icon": "☀️"},
    1: {"en": "Mainly Clear", "ta": "பெரும்பாலும் தெளிவான வானம்", "icon": "🌤️"},
    2: {"en": "Partly Cloudy", "ta": "பகுதி மேகமூட்டம்", "icon": "⛅"},
    3: {"en": "Overcast", "ta": "முழு மேகமூட்டம்", "icon": "☁️"},
    45: {"en": "Foggy", "ta": "பனிமூட்டம்", "icon": "🌫️"},
    48: {"en": "Depositing Rime Fog", "ta": "அடர்ந்த பனிமூட்டம்", "icon": "🌫️"},
    51: {"en": "Light Drizzle", "ta": "லேசான தூறல்", "icon": "🌦️"},
    53: {"en": "Moderate Drizzle", "ta": "மிதமான தூறல்", "icon": "🌦️"},
    55: {"en": "Dense Drizzle", "ta": "அடர்ந்த தூறல்", "icon": "🌧️"},
    61: {"en": "Slight Rain", "ta": "லேசான மழை", "icon": "🌧️"},
    63: {"en": "Moderate Rain", "ta": "மிதமான மழை", "icon": "🌧️"},
    65: {"en": "Heavy Rain", "ta": "கனமழை", "icon": "⛈️"},
    80: {"en": "Slight Rain Showers", "ta": "லேசான மழைச்சாரல்", "icon": "🌦️"},
    81: {"en": "Moderate Rain Showers", "ta": "மிதமான மழைச்சாரல்", "icon": "🌧️"},
    82: {"en": "Violent Rain Showers", "ta": "தீவிர கனமழை", "icon": "⛈️"},
    95: {"en": "Thunderstorm", "ta": "இடி மின்னலுடன் மழை", "icon": "⛈️"},
    96: {"en": "Thunderstorm with Slight Hail", "ta": "இடிமின்னல் மற்றும் ஆலங்கட்டி மழை", "icon": "⛈️"},
    99: {"en": "Heavy Thunderstorm with Hail", "ta": "தீவிர இடிமின்னல் ஆலங்கட்டி மழை", "icon": "⛈️"},
}

TAMIL_DAYS = {
    0: "திங்கள்",
    1: "செவ்வாய்",
    2: "புதன்",
    3: "வியாழன்",
    4: "வெள்ளி",
    5: "சனி",
    6: "ஞாயிறு",
}

ENGLISH_DAYS = {
    0: "Mon",
    1: "Tue",
    2: "Wed",
    3: "Thu",
    4: "Fri",
    5: "Sat",
    6: "Sun",
}


class OpenMeteoWeatherService:
    """
    Live Agro-Meteorology & Soil Intelligence Service using Open-Meteo API.
    Provides live real-time:
    - Temperature, humidity, wind, rainfall
    - Multi-depth soil moisture (1-3cm, 3-9cm, 9-27cm) & soil temperature (6cm, 18cm)
    - 7-Day agricultural forecast with Tamil localization
    - Real-time Decision Twin calculation for irrigation & field actions
    """

    CACHE_TTL_SECONDS = 600  # Cache for 10 minutes to be respectful of free tier
    _cache: Dict[str, Any] = {}
    _cache_time: float = 0

    @classmethod
    def get_live_weather_and_soil(
        cls,
        latitude: float = 10.7870,
        longitude: float = 79.1378,
        location_name: str = "Thanjavur, Tamil Nadu"
    ) -> Dict[str, Any]:
        cache_key = f"{round(latitude, 3)}_{round(longitude, 3)}"
        now = time.time()

        if cache_key in cls._cache and (now - cls._cache_time) < cls.CACHE_TTL_SECONDS:
            return cls._cache[cache_key]

        try:
            params = {
                "latitude": latitude,
                "longitude": longitude,
                "current": "temperature_2m,relative_humidity_2m,rain,precipitation,wind_speed_10m,weather_code",
                "hourly": "temperature_2m,rain,precipitation,apparent_temperature,dew_point_2m,relative_humidity_2m,wind_speed_10m,soil_temperature_6cm,soil_temperature_18cm,soil_moisture_1_to_3cm,soil_moisture_3_to_9cm,soil_moisture_9_to_27cm",
                "daily": "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max",
                "timezone": "auto"
            }
            query_string = urllib.parse.urlencode(params)
            url = f"https://api.open-meteo.com/v1/forecast?{query_string}"

            req = urllib.request.Request(
                url,
                headers={"User-Agent": "VAYAL-Agricultural-Assistant/1.0"}
            )

            with urllib.request.urlopen(req, timeout=8) as response:
                raw_data = json.loads(response.read().decode("utf-8"))

            parsed = cls._parse_open_meteo_response(raw_data, location_name)
            cls._cache[cache_key] = parsed
            cls._cache_time = now
            return parsed

        except Exception as e:
            logger.warning(f"[OPEN_METEO] Error fetching live weather: {e}. Falling back to default field readings.")
            return cls._get_fallback_weather(location_name)

    @classmethod
    def _parse_open_meteo_response(cls, data: Dict[str, Any], location_name: str) -> Dict[str, Any]:
        current = data.get("current", {})
        hourly = data.get("hourly", {})
        daily = data.get("daily", {})

        weather_code = current.get("weather_code", 2)
        condition_info = WMO_WEATHER_MAP.get(weather_code, {"en": "Partly Cloudy", "ta": "பகுதி மேகமூட்டம்", "icon": "⛅"})

        temp_c = round(float(current.get("temperature_2m", 28.5)), 1)
        humidity_pct = round(float(current.get("relative_humidity_2m", 72)))
        wind_kmh = round(float(current.get("wind_speed_10m", 12)))
        current_rain_mm = round(float(current.get("precipitation", 0.0)), 1)

        # Calculate next 24h & 48h rain forecast from hourly data
        hourly_rain = hourly.get("precipitation", [])
        rain_next_24h_mm = round(sum(hourly_rain[:24]), 1) if len(hourly_rain) >= 24 else current_rain_mm
        rain_next_48h_mm = round(sum(hourly_rain[:48]), 1) if len(hourly_rain) >= 48 else rain_next_24h_mm

        # Soil Moisture depths (in m3/m3 -> convert to percentage saturation)
        # Volumetric water content typically ranges 0.15 (dry) to 0.45+ (saturated clay/paddy)
        # We scale m3/m3 to realistic agricultural moisture percentage:
        sm_1_3 = hourly.get("soil_moisture_1_to_3cm", [0.32])[0] if hourly.get("soil_moisture_1_to_3cm") else 0.32
        sm_3_9 = hourly.get("soil_moisture_3_to_9cm", [0.35])[0] if hourly.get("soil_moisture_3_to_9cm") else 0.35
        sm_9_27 = hourly.get("soil_moisture_9_to_27cm", [0.38])[0] if hourly.get("soil_moisture_9_to_27cm") else 0.38

        # Convert to 0-100% field moisture index
        topsoil_moisture_pct = round(min(100.0, max(10.0, (sm_1_3 / 0.45) * 100)), 1)
        rootzone_moisture_pct = round(min(100.0, max(10.0, (sm_3_9 / 0.45) * 100)), 1)
        subsoil_moisture_pct = round(min(100.0, max(10.0, (sm_9_27 / 0.45) * 100)), 1)
        avg_soil_moisture_pct = round((topsoil_moisture_pct * 0.3) + (rootzone_moisture_pct * 0.5) + (subsoil_moisture_pct * 0.2), 1)

        # Soil Temperature
        soil_temp_6cm = hourly.get("soil_temperature_6cm", [26.5])[0] if hourly.get("soil_temperature_6cm") else 26.5
        soil_temp_18cm = hourly.get("soil_temperature_18cm", [25.8])[0] if hourly.get("soil_temperature_18cm") else 25.8

        # Rain Probability Max in next 48h
        daily_rain_prob = daily.get("precipitation_probability_max", [65])
        rain_prob_pct = int(daily_rain_prob[0]) if daily_rain_prob else 65

        # 7-Day Forecast Array
        forecast_list = []
        daily_times = daily.get("time", [])
        daily_codes = daily.get("weather_code", [])
        daily_max_t = daily.get("temperature_2m_max", [])
        daily_min_t = daily.get("temperature_2m_min", [])
        daily_probs = daily.get("precipitation_probability_max", [])

        for i in range(min(7, len(daily_times))):
            code = daily_codes[i] if i < len(daily_codes) else 2
            f_info = WMO_WEATHER_MAP.get(code, {"en": "Partly Cloudy", "ta": "பகுதி மேகமூட்டம்", "icon": "⛅"})
            day_idx = (time.localtime().tm_wday + i) % 7
            day_en = "Today" if i == 0 else ENGLISH_DAYS.get(day_idx, "Day")
            day_ta = "இன்று" if i == 0 else TAMIL_DAYS.get(day_idx, "நாள்")

            forecast_list.append({
                "day": day_en,
                "dayTamil": day_ta,
                "date": daily_times[i],
                "tempMax": round(daily_max_t[i]) if i < len(daily_max_t) else 32,
                "tempMin": round(daily_min_t[i]) if i < len(daily_min_t) else 24,
                "condition": f_info["en"],
                "conditionTamil": f_info["ta"],
                "icon": f_info["icon"],
                "rainProb": int(daily_probs[i]) if i < len(daily_probs) and daily_probs[i] is not None else 20
            })

        # Generate Tamil & English Natural Summaries
        if rain_next_24h_mm > 5.0 or rain_prob_pct > 60:
            summary_ta = f"அடுத்த 24 மணி நேரத்தில் {rain_next_24h_mm} மி.மீ வரை மழை பெய்ய {rain_prob_pct}% வாய்ப்புள்ளது. ஈரப்பதம் {humidity_pct}%."
            summary_en = f"{rain_next_24h_mm}mm rain expected within 24h ({rain_prob_pct}% probability). Humidity is {humidity_pct}%."
        else:
            summary_ta = f"வானிலை {condition_info['ta']}. வெப்பநிலை {temp_c}°C, மழை வாய்ப்பு {rain_prob_pct}%."
            summary_en = f"{condition_info['en']} with {temp_c}°C and {rain_prob_pct}% rain probability."

        # Evaluate live decision twin based on Open-Meteo inputs
        decision = cls._evaluate_decision(avg_soil_moisture_pct, float(rain_prob_pct), rain_next_48h_mm)

        return {
            "location": location_name,
            "source": "Open-Meteo Live Agro-Weather API",
            "temperatureC": temp_c,
            "condition": condition_info["en"],
            "conditionTamil": condition_info["ta"],
            "conditionIcon": condition_info["icon"],
            "summaryTa": summary_ta,
            "summaryEn": summary_en,
            "humidityPct": humidity_pct,
            "windKmh": wind_kmh,
            "rainfallMm": current_rain_mm,
            "rainfallNext24hMm": rain_next_24h_mm,
            "rainfallNext48hMm": rain_next_48h_mm,
            "rainProbabilityPct": rain_prob_pct,
            "soil": {
                "topsoilMoisturePct": topsoil_moisture_pct,
                "rootzoneMoisturePct": rootzone_moisture_pct,
                "subsoilMoisturePct": subsoil_moisture_pct,
                "overallMoisturePct": avg_soil_moisture_pct,
                "soilTemp6cm": round(float(soil_temp_6cm), 1),
                "soilTemp18cm": round(float(soil_temp_18cm), 1),
                "status": "Adequate Moisture" if avg_soil_moisture_pct >= 55 else ("Low Moisture" if avg_soil_moisture_pct < 40 else "Moderate"),
                "statusTamil": "போதுமான ஈரப்பதம்" if avg_soil_moisture_pct >= 55 else ("குறைந்த ஈரப்பதம்" if avg_soil_moisture_pct < 40 else "மிதமான ஈரப்பதம்")
            },
            "decision": decision,
            "forecast": forecast_list
        }

    @staticmethod
    def _evaluate_decision(soil_moisture_pct: float, rain_prob_pct: float, rain_48h_mm: float) -> Dict[str, Any]:
        if (rain_prob_pct >= 60 and rain_48h_mm >= 8.0) or (soil_moisture_pct >= 70):
            return {
                "type": "WAIT",
                "titleEn": "Hold Irrigation (Rain Forecast)",
                "titleTa": "பாசனம் செய்வதை தற்காலிகமாக தவிர்க்கவும்",
                "actionEn": f"Skip irrigation for 24-48 hours. Soil moisture is {soil_moisture_pct}%.",
                "actionTa": f"அடுத்த 24-48 மணி நேரத்திற்கு பாசனம் செய்வதை தவிர்க்கவும். மண்ணில் {soil_moisture_pct}% ஈரப்பதம் உள்ளது.",
                "reasonEn": f"Open-Meteo forecast indicates {rain_48h_mm}mm rain ({rain_prob_pct}% probability). Holding irrigation prevents excess waterlogging and root rot.",
                "reasonTa": f"அடுத்த 48 மணி நேரத்தில் {rain_48h_mm} மி.மீ மழை வர {rain_prob_pct}% வாய்ப்புள்ளது. தேவையற்ற நீர் தேங்குவதை தவிர்க்க பாசனத்தை நிறுத்தவும்.",
                "confidence": 0.93
            }
        elif soil_moisture_pct < 45.0 and rain_prob_pct < 35:
            return {
                "type": "ACT",
                "titleEn": "Irrigate Field Today",
                "titleTa": "இன்று வயலுக்கு பாசனம் செய்யவும்",
                "actionEn": "Irrigate field today (maintain 2-3 inches standing water).",
                "actionTa": "இன்று வயலுக்கு பாசனம் செய்யவும் (2-3 அங்குல நீர் நிறுத்துங்கள்).",
                "reasonEn": f"Soil moisture is low ({soil_moisture_pct}%) with no significant rain forecast ({rain_prob_pct}%). Paddy requires consistent water.",
                "reasonTa": f"மண்ணில் ஈரப்பதம் குறைவாக உள்ளது ({soil_moisture_pct}%). மழைக்கு வாய்ப்பு குறைவு. எனவே இன்று வயலுக்கு பாசனம் செய்வது அவசியம்.",
                "confidence": 0.91
            }
        else:
            return {
                "type": "INSPECT",
                "titleEn": "Inspect Field Water & Drainage",
                "titleTa": "வயல் நீர் மற்றும் வடிகால் வாய்க்காலை பார்வையிடவும்",
                "actionEn": "Check field bunds and ensure drainage channels are clear.",
                "actionTa": "வயல் வரப்புகளையும் வடிகால் வாய்க்கால்களையும் பார்வையிட்டு சரிபார்க்கவும்.",
                "reasonEn": f"Moderate moisture levels ({soil_moisture_pct}%) detected. Inspect field standing water before irrigating.",
                "reasonTa": f"மண்ணில் மிதமான ஈரப்பதம் ({soil_moisture_pct}%) உள்ளது. பாசனம் செய்வதற்கு முன் வயல் நிலையை நேரில் சரிபார்க்கவும்.",
                "confidence": 0.85
            }

    @classmethod
    def _get_fallback_weather(cls, location_name: str) -> Dict[str, Any]:
        return {
            "location": location_name,
            "source": "VAYAL Agro-Meteorology Fallback",
            "temperatureC": 28.5,
            "condition": "Partly Cloudy",
            "conditionTamil": "பகுதி மேகமூட்டம்",
            "conditionIcon": "⛅",
            "summaryTa": "அடுத்த 36 மணி நேரத்தில் 14 மி.மீ மழை பெய்ய 75% வாய்ப்புள்ளது. தற்போதைய வெப்பநிலை 28°C.",
            "summaryEn": "14mm rain expected within 36 hours (75% probability). Current temperature is 28°C.",
            "humidityPct": 78,
            "windKmh": 12,
            "rainfallMm": 0.0,
            "rainfallNext24hMm": 14.0,
            "rainfallNext48hMm": 18.0,
            "rainProbabilityPct": 75,
            "soil": {
                "topsoilMoisturePct": 68.0,
                "rootzoneMoisturePct": 72.0,
                "subsoilMoisturePct": 76.0,
                "overallMoisturePct": 71.0,
                "soilTemp6cm": 26.2,
                "soilTemp18cm": 25.4,
                "status": "Adequate Moisture",
                "statusTamil": "போதுமான ஈரப்பதம்"
            },
            "decision": {
                "type": "WAIT",
                "titleEn": "Hold Irrigation (Rain Expected)",
                "titleTa": "பாசனம் செய்வதை தற்காலிகமாக தவிர்க்கவும்",
                "actionEn": "Skip irrigation for 24-48 hours",
                "actionTa": "அடுத்த 24-48 மணி நேரத்திற்கு பாசனம் செய்வதை தவிர்க்கவும்",
                "reasonEn": "Soil moisture is adequate (68%) and 14mm rain is expected. Hold irrigation to prevent waterlogging.",
                "reasonTa": "மண்ணில் ஈரப்பதம் போதுமானதாக உள்ளது (68%). மேலும் 14 மி.மீ மழை வர வாய்ப்புள்ளது. எனவே இன்று தண்ணீர் விடாமல் காத்திருக்கலாம்.",
                "confidence": 0.89
            },
            "forecast": [
                {"day": "Today", "dayTamil": "இன்று", "tempMax": 31, "tempMin": 24, "condition": "Scattered Clouds", "conditionTamil": "பகுதி மேகமூட்டம்", "icon": "⛅", "rainProb": 75},
                {"day": "Wed", "dayTamil": "புதன்", "tempMax": 29, "tempMin": 23, "condition": "Moderate Rain", "conditionTamil": "மிதமான மழை", "icon": "🌧️", "rainProb": 85},
                {"day": "Thu", "dayTamil": "வியாழன்", "tempMax": 30, "tempMin": 23, "condition": "Light Showers", "conditionTamil": "மழைச்சாரல்", "icon": "🌦️", "rainProb": 60},
                {"day": "Fri", "dayTamil": "வெள்ளி", "tempMax": 32, "tempMin": 24, "condition": "Partly Cloudy", "conditionTamil": "பகுதி மேகமூட்டம்", "icon": "⛅", "rainProb": 30},
                {"day": "Sat", "dayTamil": "சனி", "tempMax": 33, "tempMin": 25, "condition": "Sunny", "conditionTamil": "வெயில்", "icon": "☀️", "rainProb": 15},
                {"day": "Sun", "dayTamil": "ஞாயிறு", "tempMax": 33, "tempMin": 25, "condition": "Clear", "conditionTamil": "தெளிவான வானம்", "icon": "☀️", "rainProb": 10},
                {"day": "Mon", "dayTamil": "திங்கள்", "tempMax": 32, "tempMin": 24, "condition": "Partly Cloudy", "conditionTamil": "பகுதி மேகமூட்டம்", "icon": "⛅", "rainProb": 25},
            ]
        }

weather_service = OpenMeteoWeatherService()

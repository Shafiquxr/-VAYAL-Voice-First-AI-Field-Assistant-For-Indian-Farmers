from typing import Dict, Any, Optional
from app.speech.tamil_normalizer import TamilVoiceNormalizer
from app.speech.piper_service import piper_service
from app.speech.indic_conformer import indic_conformer
from app.ai.ollama_client import ollama_service
from app.ai.decision_engine import DecisionTwinEngine
from app.services.weather_service import OpenMeteoWeatherService

class VayalVoicePipeline:
    """
    Unified Tamil-First Voice Pipeline:
    Farmer Audio/Text -> IndicConformer -> Open-Meteo Signals -> Qwen3 Intent -> Decision Twin -> Qwen3 Tamil -> Piper TTS
    """

    SYSTEM_PROMPT = """You are VAYAL, a Tamil-first agricultural voice assistant.
Understand:
- formal Tamil
- conversational Tamil
- rural Tamil
- colloquial Tamil ("தண்ணி", "மஞ்சளா ஆகுது", "நேத்து தண்ணி விட்டேன்")
- Tamil-English code switching ("leaf-la spot இருக்கு", "நெல் yellow ஆகுது")
- agricultural terminology and farmer shorthand

Response Rules:
1. Maximum 2 to 3 short sentences.
2. Use simple, natural conversational Tamil script (தமிழ்).
3. If an action is needed: state the action first (ACT, WAIT, or INSPECT).
4. Avoid technical jargon or long explanations.
5. Sound like an empathetic, helpful agricultural expert speaking directly to a farmer.

Output JSON format:
{
  "response_ta": "தமிழ் பதில் (அதிகபட்சம் 3 வரிகள்)",
  "response_en": "English concise translation",
  "intent": "INTENT_NAME",
  "decision_type": "ACT" | "WAIT" | "INSPECT"
}"""

    @classmethod
    async def process_voice_query(
        cls,
        query_text: Optional[str] = None,
        audio_bytes: Optional[bytes] = None,
        crop: str = "Paddy BPT 5204",
        location: str = "Thanjavur"
    ) -> Dict[str, Any]:
        # 1. Speech-to-Text (if audio input)
        transcript = query_text or ""
        if audio_bytes and len(audio_bytes) > 0:
            asr_res = await indic_conformer.transcribe_audio(audio_bytes)
            transcript = asr_res.get("text", "")

        # 2. Transliterate colloquial Tanglish if needed
        clean_tamil_query = TamilVoiceNormalizer.transliterate_roman_tamil(transcript)

        # 3. Fetch Live Open-Meteo Agro Signals
        live_weather = OpenMeteoWeatherService.get_live_weather_and_soil(10.7870, 79.1378, location)
        soil_moisture = live_weather.get("soil", {}).get("overallMoisturePct", 68.0)
        rain_prob = live_weather.get("rainProbabilityPct", 75.0)
        rain_24h = live_weather.get("rainfallNext24hMm", 14.0)
        current_temp = live_weather.get("temperatureC", 28.5)
        condition_ta = live_weather.get("conditionTamil", "பகுதி மேகமூட்டம்")
        condition_en = live_weather.get("condition", "Partly Cloudy")

        field_context = {
            "crop": crop,
            "crop_age_days": 62,
            "soil_moisture_pct": soil_moisture,
            "rain_probability_pct": rain_prob,
            "rainfall_forecast_mm": rain_24h,
            "temperature_c": current_temp,
            "weather_condition": condition_en,
            "location": location,
        }

        # Query Ollama Qwen3
        prompt = f"Field Context: {field_context}\nFarmer Query: \"{clean_tamil_query}\"\nProvide JSON response:"
        ollama_res = await ollama_service.generate_response(prompt, system=cls.SYSTEM_PROMPT)

        reply_ta = ""
        reply_en = ""
        intent = "GENERAL"
        decision_type = "ACT"

        if ollama_res and "response_ta" in ollama_res:
            reply_ta = ollama_res["response_ta"]
            reply_en = ollama_res.get("response_en", "")
            intent = ollama_res.get("intent", "GENERAL")
            decision_type = ollama_res.get("decision_type", "ACT")
        else:
            # 4. Decision Twin Agronomic Engine Fallback using Live Open-Meteo Signals
            q = clean_tamil_query.lower()
            if any(w in q for w in ["தண்ணீர்", "தண்ணி", "பாசனம்", "water", "irrigation"]):
                eval_res = DecisionTwinEngine.evaluate_irrigation(soil_moisture, float(rain_prob), rain_24h, 62)
                decision_type = eval_res["decision_type"]
                intent = "IRRIGATION_DECISION"
                reply_ta = eval_res["reason_ta"]
                reply_en = eval_res["reason_en"]
            elif any(w in q for w in ["உரம்", "யூரியா", "பொட்டாஷ்", "fertilizer", "urea"]):
                decision_type = "ACT"
                intent = "FERTILIZER_ADVICE"
                reply_ta = "தூர்கட்டும் பருவத்தில் ஏக்கருக்கு 25 கிலோ வேப்பம்பூசப்பட்ட யூரியா மற்றும் 15 கிலோ பொட்டாஷ் இடவும். மண்ணில் மிதமான ஈரம் இருக்கும் போது உரம் இடுவது நல்லது."
                reply_en = "Apply 25kg neem-coated urea and 15kg potash per acre during tillering stage when soil is moist."
            elif any(w in q for w in ["மஞ்சள்", "நோய்", "கருகல்", "blight", "yellow"]):
                decision_type = "INSPECT"
                intent = "DISEASE_DIAGNOSIS"
                reply_ta = "இலைகள் மஞ்சளாவதற்கு இலை கருகல் நோய் காரணமாக இருக்கலாம். பயிர் மருத்துவரை பயன்படுத்தி இலையை தெளிவாக படம் எடுக்கவும்."
                reply_en = "Yellowing suggests possible leaf blight. Use Crop Doctor to take a clear photo of the leaf."
            elif any(w in q for w in ["மழை", "வானிலை", "weather", "rain"]):
                decision_type = "WAIT" if rain_prob > 50 else "ACT"
                intent = "WEATHER_FORECAST"
                reply_ta = f"{location}-ல் வானிலை {condition_ta}, வெப்பநிலை {current_temp}°C. அடுத்த 24 மணி நேரத்தில் மழை பெய்ய {rain_prob}% வாய்ப்புள்ளது."
                reply_en = f"In {location}, weather is {condition_en} ({current_temp}°C) with {rain_prob}% rain probability in next 24 hours."
            elif any(w in q for w in ["மண்", "ஈரம்", "soil", "moisture"]):
                decision_type = "ACT" if soil_moisture < 45 else "WAIT"
                intent = "SOIL_STATUS"
                reply_ta = f"வயலில் மேல்மண் ஈரப்பதம் {soil_moisture}% ஆக உள்ளது. வேர் பகுதிக்கு போதுமான ஈரப்பதம் கிடைக்கிறது."
                reply_en = f"Soil moisture is at {soil_moisture}%, providing adequate water to the root zone."
            elif any(w in q for w in ["விலை", "சந்தை", "price", "market"]):
                decision_type = "ACT"
                intent = "MARKET_PRICE"
                reply_ta = "தஞ்சாவூர் ஒழுங்குமுறை விற்பனைக்கூடத்தில் பிபிடி 5204 சன்ன ரக நெல் குவிண்டாலுக்கு ₹2,350 முதல் ₹2,420 வரை விற்பனையாகிறது."
                reply_en = "BPT 5204 paddy is trading between ₹2,350 to ₹2,420 per quintal at Thanjavur regulated market."
            else:
                decision_type = "ACT"
                intent = "GENERAL_ASSISTANCE"
                reply_ta = f"வணக்கம்! உங்கள் வயலில் மண் ஈரப்பதம் {soil_moisture}% ஆகவும், வானிலை {condition_ta} ஆகவும் உள்ளது. என்ன உதவி வேண்டும் என்று கேளுங்கள்."
                reply_en = f"Greetings! Field moisture is {soil_moisture}% and weather is {condition_en}. How can I assist you today?"

        # 5. Normalize Tamil text and generate Piper audio
        audio_data_url = piper_service.synthesize_speech_wav(reply_ta)

        return {
            "transcript": transcript,
            "clean_tamil_query": clean_tamil_query,
            "language": "ta",
            "intent": intent,
            "decision": {
                "type": decision_type,
                "confidence": 0.90
            },
            "response": {
                "text_ta": reply_ta,
                "text_en": reply_en,
                "audio_url": audio_data_url
            },
            "source": "VAYAL Tamil AI (IndicConformer + Qwen3 + Piper)"
        }

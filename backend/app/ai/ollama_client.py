import httpx
import json
from app.config import settings

class OllamaService:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL
        self.text_model = settings.OLLAMA_TEXT_MODEL
        self.vision_model = settings.OLLAMA_VISION_MODEL

    async def generate_response(self, prompt: str, system: str = "") -> dict:
        payload = {
            "model": self.text_model,
            "prompt": prompt,
            "system": system,
            "stream": False,
            "format": "json"
        }
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(f"{self.base_url}/api/generate", json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return json.loads(data.get("response", "{}"))
        except Exception as e:
            pass
        return {}

    async def analyze_leaf_image(self, base64_image: str, crop: str = "Paddy") -> dict:
        prompt = f"Analyze this {crop} leaf for diseases, pests, and nutrient deficiencies. Output JSON with fields: disease, disease_tamil, confidence, symptoms, recommendations_en, recommendations_ta."
        payload = {
            "model": self.vision_model,
            "prompt": prompt,
            "images": [base64_image],
            "stream": False,
            "format": "json"
        }
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                res = await client.post(f"{self.base_url}/api/generate", json=payload)
                if res.status_code == 200:
                    data = res.json()
                    return json.loads(data.get("response", "{}"))
        except Exception as e:
            pass
        return {}

ollama_service = OllamaService()

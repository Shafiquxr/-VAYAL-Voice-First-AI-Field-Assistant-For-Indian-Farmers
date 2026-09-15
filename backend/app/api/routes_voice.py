from fastapi import APIRouter, Depends, UploadFile, File, Form
from typing import Optional
from pydantic import BaseModel
from app.voice.pipeline import VayalVoicePipeline

router = APIRouter(prefix="/api/voice", tags=["voice"])

class VoiceQueryRequest(BaseModel):
    query: Optional[str] = None
    language: str = "ta"
    crop: str = "Paddy BPT 5204"
    location: str = "Thanjavur"

@router.post("/query")
async def process_voice_query(
    req: VoiceQueryRequest
):
    result = await VayalVoicePipeline.process_voice_query(
        query_text=req.query,
        crop=req.crop,
        location=req.location
    )
    return {
        "transcript": result["transcript"],
        "language": result["language"],
        "intent": result["intent"],
        "decision_type": result["decision"]["type"],
        "response_ta": result["response"]["text_ta"],
        "response_en": result["response"]["text_en"],
        "audio_url": result["response"]["audio_url"],
        "source": result["source"]
    }

@router.post("/audio-query")
async def process_audio_file_query(
    file: UploadFile = File(...),
    crop: str = Form("Paddy BPT 5204"),
    location: str = Form("Thanjavur")
):
    audio_bytes = await file.read()
    result = await VayalVoicePipeline.process_voice_query(
        audio_bytes=audio_bytes,
        crop=crop,
        location=location
    )
    return result

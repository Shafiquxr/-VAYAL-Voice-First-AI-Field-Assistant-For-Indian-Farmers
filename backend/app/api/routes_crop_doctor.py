from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from pydantic import BaseModel
import base64
from app.ai.paddy_doctor_model import paddy_doctor_service

router = APIRouter(prefix="/api/crop-doctor", tags=["crop-doctor"])

class DiagnoseBase64Request(BaseModel):
    image_base64: str
    crop: Optional[str] = "Paddy BPT 5204"
    location: Optional[str] = "Thanjavur"

@router.post("/diagnose")
async def diagnose_leaf_image(
    file: Optional[UploadFile] = File(None)
):
    """
    Accepts uploaded paddy leaf image file, runs ResNet18 model inference,
    and returns comprehensive diagnosis crop card with Tamil & English treatments.
    """
    if file is None:
        raise HTTPException(status_code=400, detail="No image file provided")

    image_bytes = await file.read()
    if len(image_bytes) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    result = paddy_doctor_service.predict_image(image_bytes)
    return result

@router.post("/diagnose-base64")
async def diagnose_leaf_base64(
    req: DiagnoseBase64Request
):
    """
    Accepts base64 encoded data URI string (from camera snapshot or file picker)
    and returns model diagnosis.
    """
    data_str = req.image_base64
    if "," in data_str:
        data_str = data_str.split(",")[1]

    try:
        image_bytes = base64.b64decode(data_str)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid base64 image data: {e}")

    result = paddy_doctor_service.predict_image(image_bytes)
    return result

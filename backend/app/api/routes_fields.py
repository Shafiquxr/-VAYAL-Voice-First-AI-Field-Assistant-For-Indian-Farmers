from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.db.models import User, Field, Decision

router = APIRouter(prefix="/api/fields", tags=["fields"])

@router.get("/")
def get_user_fields(db: Session = Depends(get_db)):
    fields = db.query(Field).all()
    return fields

@router.get("/{field_id}")
def get_field_details(field_id: str, db: Session = Depends(get_db)):
    field = db.query(Field).filter(Field.id == field_id).first()
    if not field:
        raise HTTPException(status_code=404, detail="Field not found")
    return field

@router.get("/{field_id}/decision")
def get_field_latest_decision(field_id: str, db: Session = Depends(get_db)):
    decision = db.query(Decision).filter(Decision.field_id == field_id).order_by(Decision.created_at.desc()).first()
    if not decision:
        raise HTTPException(status_code=404, detail="No active decision")
    return decision

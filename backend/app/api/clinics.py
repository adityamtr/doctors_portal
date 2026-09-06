from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.models.models import Clinic
from app.schemas.schemas import ClinicCreate, ClinicUpdate, ClinicResponse

router = APIRouter(prefix="/clinics", tags=["clinics"])

@router.get("", response_model=List[ClinicResponse])
def get_clinics(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    city: Optional[str] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    query = db.query(Clinic)
    if city:
        query = query.filter(Clinic.city.ilike(f"%{city}%"))
    if is_active is not None:
        query = query.filter(Clinic.is_active == is_active)
    clinics = query.offset(skip).limit(limit).all()
    return clinics

@router.get("/{clinic_id}", response_model=ClinicResponse)
def get_clinic(clinic_id: int, db: Session = Depends(get_db)):
    clinic = db.query(Clinic).filter(Clinic.id == clinic_id).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    return clinic

@router.post("/", response_model=ClinicResponse, status_code=201)
def create_clinic(clinic: ClinicCreate, db: Session = Depends(get_db)):
    db_clinic = Clinic(**clinic.model_dump())
    db.add(db_clinic)
    db.commit()
    db.refresh(db_clinic)
    return db_clinic

@router.put("/{clinic_id}", response_model=ClinicResponse)
def update_clinic(clinic_id: int, clinic: ClinicUpdate, db: Session = Depends(get_db)):
    db_clinic = db.query(Clinic).filter(Clinic.id == clinic_id).first()
    if not db_clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    
    update_data = clinic.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_clinic, field, value)
    
    db.commit()
    db.refresh(db_clinic)
    return db_clinic

@router.delete("/{clinic_id}", status_code=204)
def delete_clinic(clinic_id: int, db: Session = Depends(get_db)):
    db_clinic = db.query(Clinic).filter(Clinic.id == clinic_id).first()
    if not db_clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    
    db.delete(db_clinic)
    db.commit()
    return None
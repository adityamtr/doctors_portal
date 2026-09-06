from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.models.models import Doctor
from app.schemas.schemas import DoctorCreate, DoctorUpdate, DoctorResponse

router = APIRouter(prefix="/doctors", tags=["doctors"])

# Single doctor ID (assuming we keep the first doctor from seed data)
SINGLE_DOCTOR_ID = 1

@router.get("", response_model=List[DoctorResponse])
def get_doctors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    specialization: Optional[str] = None,
    is_active: Optional[bool] = True,
    db: Session = Depends(get_db)
):
    # Only return the single doctor
    doctor = db.query(Doctor).filter(Doctor.id == SINGLE_DOCTOR_ID).first()
    if not doctor:
        return []
    
    # Apply filters
    if specialization and not doctor.specialization.ilike(f"%{specialization}%"):
        return []
    if is_active is not None and doctor.is_active != is_active:
        return []
        
    return [doctor]

@router.get("/{doctor_id}", response_model=DoctorResponse)
def get_doctor(doctor_id: int, db: Session = Depends(get_db)):
    # Only allow access to the single doctor
    if doctor_id != SINGLE_DOCTOR_ID:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.post("/", response_model=DoctorResponse, status_code=201)
def create_doctor(doctor: DoctorCreate, db: Session = Depends(get_db)):
    # In single doctor mode, we don't allow creating new doctors
    raise HTTPException(status_code=400, detail="Single doctor mode does not allow creating new doctors")

@router.put("/{doctor_id}", response_model=DoctorResponse)
def update_doctor(doctor_id: int, doctor: DoctorUpdate, db: Session = Depends(get_db)):
    # Only allow updates to the single doctor
    if doctor_id != SINGLE_DOCTOR_ID:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    db_doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not db_doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    update_data = doctor.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_doctor, field, value)
    
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@router.delete("/{doctor_id}", status_code=204)
def delete_doctor(doctor_id: int, db: Session = Depends(get_db)):
    # In single doctor mode, we don't allow deleting the doctor
    raise HTTPException(status_code=400, detail="Single doctor mode does not allow deleting the doctor")
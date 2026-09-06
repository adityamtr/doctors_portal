from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.models.models import Schedule, Doctor, Clinic
from app.schemas.schemas import ScheduleCreate, ScheduleUpdate, ScheduleResponse

router = APIRouter(prefix="/schedules", tags=["schedules"])

@router.get("", response_model=List[ScheduleResponse])
def get_schedules(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    doctor_id: Optional[int] = None,
    clinic_id: Optional[int] = None,
    day_of_week: Optional[int] = Query(None, ge=0, le=6),
    is_available: Optional[bool] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Schedule)
    if doctor_id:
        query = query.filter(Schedule.doctor_id == doctor_id)
    if clinic_id:
        query = query.filter(Schedule.clinic_id == clinic_id)
    if day_of_week is not None:
        query = query.filter(Schedule.day_of_week == day_of_week)
    if is_available is not None:
        query = query.filter(Schedule.is_available == is_available)
    schedules = query.offset(skip).limit(limit).all()
    return schedules

@router.get("/{schedule_id}", response_model=ScheduleResponse)
def get_schedule(schedule_id: int, db: Session = Depends(get_db)):
    schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return schedule

@router.post("/", response_model=ScheduleResponse, status_code=201)
def create_schedule(schedule: ScheduleCreate, db: Session = Depends(get_db)):
    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == schedule.doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Verify clinic exists
    clinic = db.query(Clinic).filter(Clinic.id == schedule.clinic_id).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    
    # Check for overlapping schedules
    existing = db.query(Schedule).filter(
        Schedule.doctor_id == schedule.doctor_id,
        Schedule.clinic_id == schedule.clinic_id,
        Schedule.day_of_week == schedule.day_of_week,
        Schedule.is_available == True,
        Schedule.start_time < schedule.end_time,
        Schedule.end_time > schedule.start_time
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Overlapping schedule exists")
    
    db_schedule = Schedule(**schedule.model_dump())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@router.put("/{schedule_id}", response_model=ScheduleResponse)
def update_schedule(schedule_id: int, schedule: ScheduleUpdate, db: Session = Depends(get_db)):
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    update_data = schedule.model_dump(exclude_unset=True)
    
    # Check for overlapping schedules if time/day changed
    if any(k in update_data for k in ["day_of_week", "start_time", "end_time", "doctor_id", "clinic_id"]):
        doctor_id = update_data.get("doctor_id", db_schedule.doctor_id)
        clinic_id = update_data.get("clinic_id", db_schedule.clinic_id)
        day_of_week = update_data.get("day_of_week", db_schedule.day_of_week)
        start_time = update_data.get("start_time", db_schedule.start_time)
        end_time = update_data.get("end_time", db_schedule.end_time)
        
        existing = db.query(Schedule).filter(
            Schedule.id != schedule_id,
            Schedule.doctor_id == doctor_id,
            Schedule.clinic_id == clinic_id,
            Schedule.day_of_week == day_of_week,
            Schedule.is_available == True,
            Schedule.start_time < end_time,
            Schedule.end_time > start_time
        ).first()
        
        if existing:
            raise HTTPException(status_code=400, detail="Overlapping schedule exists")
    
    for field, value in update_data.items():
        setattr(db_schedule, field, value)
    
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@router.delete("/{schedule_id}", status_code=204)
def delete_schedule(schedule_id: int, db: Session = Depends(get_db)):
    db_schedule = db.query(Schedule).filter(Schedule.id == schedule_id).first()
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    db.delete(db_schedule)
    db.commit()
    return None
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from typing import List, Optional
from datetime import date, time, datetime, timedelta
from app.database.database import get_db
from app.models.models import Appointment, Doctor, Service, Clinic, Schedule
from app.schemas.schemas import (
    AppointmentCreate, AppointmentUpdate, AppointmentResponse,
    AppointmentStatus, AvailabilityCheck, AvailableSlot
)

router = APIRouter(prefix="/appointments", tags=["appointments"])

# Single doctor ID (assuming we keep the first doctor from seed data)
SINGLE_DOCTOR_ID = 1

@router.get("", response_model=List[AppointmentResponse])
def get_appointments(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    status: Optional[AppointmentStatus] = None,
    clinic_id: Optional[int] = None,
    patient_email: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Appointment).filter(Appointment.doctor_id == SINGLE_DOCTOR_ID)
    
    if status:
        query = query.filter(Appointment.status == status)
    if clinic_id:
        query = query.filter(Appointment.clinic_id == clinic_id)
    if patient_email:
        query = query.filter(Appointment.patient_email.ilike(f"%{patient_email}%"))
    if start_date:
        query = query.filter(Appointment.appointment_date >= start_date)
    if end_date:
        query = query.filter(Appointment.appointment_date <= end_date)
    
    appointments = query.order_by(Appointment.appointment_date, Appointment.appointment_time).offset(skip).limit(limit).all()
    return appointments

@router.get("/{appointment_id}", response_model=AppointmentResponse)
def get_appointment(appointment_id: int, db: Session = Depends(get_db)):
    appointment = db.query(Appointment).filter(
        and_(Appointment.id == appointment_id, Appointment.doctor_id == SINGLE_DOCTOR_ID)
    ).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    return appointment

@router.post("/", response_model=AppointmentResponse, status_code=201)
def create_appointment(appointment: AppointmentCreate, db: Session = Depends(get_db)):
    # Use single doctor ID (ignore doctor_id from request for single doctor mode)
    doctor_id = SINGLE_DOCTOR_ID
    
    # Verify doctor exists
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    
    # Verify service exists
    service = db.query(Service).filter(Service.id == appointment.service_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")
    
    # Verify clinic exists
    clinic = db.query(Clinic).filter(Clinic.id == appointment.clinic_id).first()
    if not clinic:
        raise HTTPException(status_code=404, detail="Clinic not found")
    
    # Check if the time slot is available
    existing_appointment = db.query(Appointment).filter(
        and_(
            Appointment.doctor_id == doctor_id,
            Appointment.clinic_id == appointment.clinic_id,
            Appointment.appointment_date == appointment.appointment_date,
            Appointment.appointment_time == appointment.appointment_time,
            Appointment.status.in_([AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED])
        )
    ).first()
    
    if existing_appointment:
        raise HTTPException(status_code=400, detail="Time slot is already booked")
    
    # Check if doctor has schedule for this day/time at this clinic
    day_of_week = appointment.appointment_date.weekday()  # 0=Monday
    schedule = db.query(Schedule).filter(
        and_(
            Schedule.doctor_id == doctor_id,
            Schedule.clinic_id == appointment.clinic_id,
            Schedule.day_of_week == day_of_week,
            Schedule.is_available == True,
            Schedule.start_time <= appointment.appointment_time,
            Schedule.end_time >= appointment.appointment_time
        )
    ).first()
    
    if not schedule:
        raise HTTPException(status_code=400, detail="Doctor is not available at this time")
    
    # Create appointment with single doctor ID
    appointment_data = appointment.model_dump()
    appointment_data['doctor_id'] = doctor_id
    db_appointment = Appointment(**appointment_data)
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.put("/{appointment_id}", response_model=AppointmentResponse)
def update_appointment(appointment_id: int, appointment: AppointmentUpdate, db: Session = Depends(get_db)):
    db_appointment = db.query(Appointment).filter(
        and_(Appointment.id == appointment_id, Appointment.doctor_id == SINGLE_DOCTOR_ID)
    ).first()
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    update_data = appointment.model_dump(exclude_unset=True)
    
    # Handle status changes
    if "status" in update_data:
        new_status = update_data["status"]
        if new_status == AppointmentStatus.CONFIRMED and db_appointment.status != AppointmentStatus.CONFIRMED:
            update_data["confirmed_at"] = datetime.utcnow()
        elif new_status == AppointmentStatus.CANCELLED and db_appointment.status != AppointmentStatus.CANCELLED:
            update_data["cancelled_at"] = datetime.utcnow()
    
    for field, value in update_data.items():
        setattr(db_appointment, field, value)
    
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

@router.delete("/{appointment_id}", status_code=204)
def delete_appointment(appointment_id: int, db: Session = Depends(get_db)):
    db_appointment = db.query(Appointment).filter(
        and_(Appointment.id == appointment_id, Appointment.doctor_id == SINGLE_DOCTOR_ID)
    ).first()
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    db.delete(db_appointment)
    db.commit()
    return None

@router.post("/check-availability", response_model=List[AvailableSlot])
def check_availability(check: AvailabilityCheck, db: Session = Depends(get_db)):
    # Use single doctor ID (ignore doctor_id from request for single doctor mode)
    doctor_id = SINGLE_DOCTOR_ID
    
    # Get doctor's schedule for the day
    day_of_week = check.appointment_date.weekday()
    schedules = db.query(Schedule).filter(
        and_(
            Schedule.doctor_id == doctor_id,
            Schedule.clinic_id == check.clinic_id,
            Schedule.day_of_week == day_of_week,
            Schedule.is_available == True
        )
    ).all()
    
    if not schedules:
        return []
    
    # Get existing appointments for that day
    existing_appointments = db.query(Appointment).filter(
        and_(
            Appointment.doctor_id == doctor_id,
            Appointment.clinic_id == check.clinic_id,
            Appointment.appointment_date == check.appointment_date,
            Appointment.status.in_([AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED])
        )
    ).all()
    
    # Generate available slots
    available_slots = []
    slot_duration = check.duration_minutes
    
    for schedule in schedules:
        current_time = schedule.start_time
        while current_time < schedule.end_time:
            slot_end = (datetime.combine(date.today(), current_time) + timedelta(minutes=slot_duration)).time()
            if slot_end > schedule.end_time:
                break
            
            # Check if this slot is booked
            is_booked = any(
                appt.appointment_time == current_time for appt in existing_appointments
            )
            
            available_slots.append(AvailableSlot(
                start_time=current_time,
                end_time=slot_end,
                is_available=not is_booked
            ))
            
            current_time = slot_end
    
    return available_slots

@router.get("/doctor/{doctor_id}/availability", response_model=List[AvailableSlot])
def get_doctor_availability(
    doctor_id: int,
    clinic_id: int,
    appointment_date: date,
    duration_minutes: int = 30,
    db: Session = Depends(get_db)
):
    # Validate that the requested doctor_id matches our single doctor
    if doctor_id != SINGLE_DOCTOR_ID:
        raise HTTPException(status_code=400, detail="Only single doctor mode is supported")
    
    check = AvailabilityCheck(
        doctor_id=SINGLE_DOCTOR_ID,
        clinic_id=clinic_id,
        appointment_date=appointment_date,
        duration_minutes=duration_minutes
    )
    return check_availability(check, db)
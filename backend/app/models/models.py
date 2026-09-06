from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean, Date, Time
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database.database import Base

class Doctor(Base):
    __tablename__ = "doctors"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    title = Column(String(100), nullable=False)  # e.g., "MD, Cardiologist"
    bio = Column(Text, nullable=True)
    specialization = Column(String(100), nullable=False)
    experience_years = Column(Integer, default=0)
    education = Column(Text, nullable=True)
    certifications = Column(Text, nullable=True)
    languages = Column(String(200), nullable=True)  # Comma-separated
    profile_image = Column(String(255), nullable=True)
    email = Column(String(100), unique=True, nullable=True)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    appointments = relationship("Appointment", back_populates="doctor")
    schedules = relationship("Schedule", back_populates="doctor")

class Service(Base):
    __tablename__ = "services"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False)  # e.g., "Consultation", "Diagnostic", "Treatment"
    duration_minutes = Column(Integer, default=30)
    price = Column(Integer, nullable=True)  # Price in cents
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    appointments = relationship("Appointment", back_populates="service")

class Clinic(Base):
    __tablename__ = "clinics"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    address = Column(Text, nullable=False)
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    zip_code = Column(String(20), nullable=False)
    country = Column(String(100), default="USA")
    phone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    latitude = Column(String(50), nullable=True)  # For map integration
    longitude = Column(String(50), nullable=True)
    hours_monday = Column(String(50), nullable=True)
    hours_tuesday = Column(String(50), nullable=True)
    hours_wednesday = Column(String(50), nullable=True)
    hours_thursday = Column(String(50), nullable=True)
    hours_friday = Column(String(50), nullable=True)
    hours_saturday = Column(String(50), nullable=True)
    hours_sunday = Column(String(50), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    schedules = relationship("Schedule", back_populates="clinic")

class Schedule(Base):
    __tablename__ = "schedules"
    
    id = Column(Integer, primary_key=True, index=True)
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=False)
    day_of_week = Column(Integer, nullable=False)  # 0=Monday, 6=Sunday
    start_time = Column(Time, nullable=False)
    end_time = Column(Time, nullable=False)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    doctor = relationship("Doctor", back_populates="schedules")
    clinic = relationship("Clinic", back_populates="schedules")

class Appointment(Base):
    __tablename__ = "appointments"
    
    id = Column(Integer, primary_key=True, index=True)
    patient_name = Column(String(100), nullable=False)
    patient_email = Column(String(100), nullable=True)
    patient_phone = Column(String(20), nullable=True)
    patient_dob = Column(Date, nullable=True)
    patient_gender = Column(String(20), nullable=True)
    reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    status = Column(String(20), default="pending")  # pending, confirmed, cancelled, completed
    appointment_date = Column(Date, nullable=False)
    appointment_time = Column(Time, nullable=False)
    duration_minutes = Column(Integer, default=30)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    confirmed_at = Column(DateTime(timezone=True), nullable=True)
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    
    # Foreign Keys
    doctor_id = Column(Integer, ForeignKey("doctors.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    clinic_id = Column(Integer, ForeignKey("clinics.id"), nullable=False)
    
    # Relationships
    doctor = relationship("Doctor", back_populates="appointments")
    service = relationship("Service", back_populates="appointments")
    clinic = relationship("Clinic")
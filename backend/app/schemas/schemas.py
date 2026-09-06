from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, time, datetime
from enum import Enum

class AppointmentStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

# Doctor Schemas
class DoctorBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    title: str = Field(..., min_length=1, max_length=100)
    bio: Optional[str] = None
    specialization: str = Field(..., min_length=1, max_length=100)
    experience_years: int = Field(default=0, ge=0)
    education: Optional[str] = None
    certifications: Optional[str] = None
    languages: Optional[str] = None
    profile_image: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None

class DoctorCreate(DoctorBase):
    pass

class DoctorUpdate(DoctorBase):
    name: Optional[str] = None
    title: Optional[str] = None
    specialization: Optional[str] = None

class DoctorResponse(DoctorBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Service Schemas
class ServiceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = None
    category: str = Field(..., min_length=1, max_length=50)
    duration_minutes: int = Field(default=30, ge=5)
    price: Optional[int] = Field(default=None, ge=0)

class ServiceCreate(ServiceBase):
    pass

class ServiceUpdate(ServiceBase):
    name: Optional[str] = None
    category: Optional[str] = None

class ServiceResponse(ServiceBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Clinic Schemas
class ClinicBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    address: str = Field(..., min_length=1)
    city: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=1, max_length=100)
    zip_code: str = Field(..., min_length=1, max_length=20)
    country: str = Field(default="USA", max_length=100)
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    latitude: Optional[str] = None
    longitude: Optional[str] = None
    hours_monday: Optional[str] = None
    hours_tuesday: Optional[str] = None
    hours_wednesday: Optional[str] = None
    hours_thursday: Optional[str] = None
    hours_friday: Optional[str] = None
    hours_saturday: Optional[str] = None
    hours_sunday: Optional[str] = None

class ClinicCreate(ClinicBase):
    pass

class ClinicUpdate(ClinicBase):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None

class ClinicResponse(ClinicBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Schedule Schemas
class ScheduleBase(BaseModel):
    doctor_id: int
    clinic_id: int
    day_of_week: int = Field(..., ge=0, le=6)
    start_time: time
    end_time: time
    is_available: bool = True

class ScheduleCreate(ScheduleBase):
    pass

class ScheduleUpdate(ScheduleBase):
    doctor_id: Optional[int] = None
    clinic_id: Optional[int] = None
    day_of_week: Optional[int] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None

class ScheduleResponse(ScheduleBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Appointment Schemas
class AppointmentBase(BaseModel):
    patient_name: str = Field(..., min_length=1, max_length=100)
    patient_email: Optional[EmailStr] = None
    patient_phone: Optional[str] = None
    patient_dob: Optional[date] = None
    patient_gender: Optional[str] = None
    reason: Optional[str] = None
    notes: Optional[str] = None
    appointment_date: date
    appointment_time: time
    duration_minutes: int = Field(default=30, ge=5)
    doctor_id: int
    service_id: int
    clinic_id: int

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    patient_name: Optional[str] = None
    patient_email: Optional[EmailStr] = None
    patient_phone: Optional[str] = None
    patient_dob: Optional[date] = None
    patient_gender: Optional[str] = None
    reason: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[AppointmentStatus] = None
    appointment_date: Optional[date] = None
    appointment_time: Optional[time] = None
    duration_minutes: Optional[int] = None
    doctor_id: Optional[int] = None
    service_id: Optional[int] = None
    clinic_id: Optional[int] = None

class AppointmentResponse(AppointmentBase):
    id: int
    status: AppointmentStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    confirmed_at: Optional[datetime] = None
    cancelled_at: Optional[datetime] = None
    
    # Nested relationships
    doctor: Optional[DoctorResponse] = None
    service: Optional[ServiceResponse] = None
    clinic: Optional[ClinicResponse] = None
    
    class Config:
        from_attributes = True

# Availability check schema
class AvailabilityCheck(BaseModel):
    doctor_id: int
    clinic_id: int
    appointment_date: date
    duration_minutes: int = 30

class AvailableSlot(BaseModel):
    start_time: time
    end_time: time
    is_available: bool

# Pagination
class PaginatedResponse(BaseModel):
    items: List[BaseModel]
    total: int
    page: int
    page_size: int
    total_pages: int
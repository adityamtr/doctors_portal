#!/usr/bin/env python3
"""
Seed script to populate the database with sample data for the Doctor's Portal.
Run this script after starting the backend to add sample doctors, services, clinics, and schedules.
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import date, time, timedelta
from app.database.database import SessionLocal, init_db
from app.models.models import Doctor, Service, Clinic, Schedule

def seed_data():
    db = SessionLocal()
    
    try:
        # Check if data already exists
        if db.query(Doctor).first():
            print("Database already seeded. Skipping...")
            return
        
        print("Seeding database with sample data...")
        
        # Create sample doctors
        doctors = [
            Doctor(
                name="Dr. Sarah Johnson",
                title="MD, FACC - Cardiologist",
                bio="Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. She specializes in preventive cardiology, heart failure management, and interventional procedures.",
                specialization="Cardiology",
                experience_years=15,
                education="MD from Harvard Medical School, Residency at Johns Hopkins Hospital, Fellowship in Cardiology at Mayo Clinic",
                certifications="American Board of Internal Medicine - Cardiovascular Disease, American Board of Internal Medicine - Internal Medicine",
                languages="English, Spanish, French",
                email="sarah.johnson@doctorsportal.com",
                phone="+1-555-0101",
                profile_image="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face"
            ),
            Doctor(
                name="Dr. Michael Chen",
                title="MD, FAAP - Pediatrician",
                bio="Dr. Michael Chen is a dedicated pediatrician with a passion for child health and development. He provides comprehensive care for children from birth through adolescence.",
                specialization="Pediatrics",
                experience_years=12,
                education="MD from Stanford University School of Medicine, Residency in Pediatrics at Children's Hospital Los Angeles",
                certifications="American Board of Pediatrics",
                languages="English, Mandarin, Cantonese",
                email="michael.chen@doctorsportal.com",
                phone="+1-555-0102",
                profile_image="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face"
            ),
            Doctor(
                name="Dr. Emily Rodriguez",
                title="MD, FAAD - Dermatologist",
                bio="Dr. Emily Rodriguez is a board-certified dermatologist specializing in medical, surgical, and cosmetic dermatology. She has expertise in skin cancer detection, acne treatment, and anti-aging procedures.",
                specialization="Dermatology",
                experience_years=10,
                education="MD from University of California, San Francisco, Residency in Dermatology at NYU Langone Health",
                certifications="American Board of Dermatology",
                languages="English, Spanish",
                email="emily.rodriguez@doctorsportal.com",
                phone="+1-555-0103",
                profile_image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face"
            ),
            Doctor(
                name="Dr. James Wilson",
                title="MD, FACS - Orthopedic Surgeon",
                bio="Dr. James Wilson is an orthopedic surgeon specializing in sports medicine, joint replacement, and minimally invasive surgery. He has treated numerous professional athletes and helps patients return to active lifestyles.",
                specialization="Orthopedic Surgery",
                experience_years=18,
                education="MD from Duke University School of Medicine, Residency in Orthopedic Surgery at Hospital for Special Surgery, Fellowship in Sports Medicine",
                certifications="American Board of Orthopedic Surgery, Subspecialty Certification in Sports Medicine",
                languages="English",
                email="james.wilson@doctorsportal.com",
                phone="+1-555-0104",
                profile_image="https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&h=400&fit=crop&crop=face"
            ),
            Doctor(
                name="Dr. Lisa Thompson",
                title="MD, FACOG - Obstetrician/Gynecologist",
                bio="Dr. Lisa Thompson provides comprehensive women's health care including prenatal care, high-risk pregnancy management, minimally invasive gynecologic surgery, and menopause management.",
                specialization="Obstetrics & Gynecology",
                experience_years=14,
                education="MD from University of Pennsylvania Perelman School of Medicine, Residency in OB/GYN at Brigham and Women's Hospital",
                certifications="American Board of Obstetrics and Gynecology",
                languages="English, French",
                email="lisa.thompson@doctorsportal.com",
                phone="+1-555-0105",
                profile_image="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face"
            )
        ]
        
        for doctor in doctors:
            db.add(doctor)
        db.commit()
        print(f"Added {len(doctors)} doctors")
        
        # Create sample services
        services = [
            # Cardiology services
            Service(name="Initial Cardiology Consultation", description="Comprehensive heart health evaluation including ECG and risk assessment", category="Consultation", duration_minutes=45, price=25000),
            Service(name="Follow-up Cardiology Visit", description="Follow-up appointment for ongoing heart condition management", category="Consultation", duration_minutes=30, price=15000),
            Service(name="Echocardiogram", description="Ultrasound imaging of the heart to assess structure and function", category="Diagnostic", duration_minutes=45, price=30000),
            Service(name="Stress Test", description="Exercise stress test to evaluate heart function under exertion", category="Diagnostic", duration_minutes=60, price=40000),
            Service(name="Holter Monitor", description="24-48 hour continuous heart rhythm monitoring", category="Diagnostic", duration_minutes=30, price=20000),
            
            # Pediatrics services
            Service(name="Well Child Visit", description="Routine check-up for growth, development, and vaccinations", category="Consultation", duration_minutes=30, price=12000),
            Service(name="Sick Child Visit", description="Evaluation and treatment for acute illness", category="Consultation", duration_minutes=20, price=10000),
            Service(name="Vaccination", description="Routine childhood immunizations", category="Treatment", duration_minutes=15, price=5000),
            Service(name="Developmental Screening", description="Assessment of developmental milestones", category="Diagnostic", duration_minutes=45, price=15000),
            
            # Dermatology services
            Service(name="Skin Cancer Screening", description="Full body skin examination for early detection of skin cancer", category="Diagnostic", duration_minutes=30, price=18000),
            Service(name="Acne Consultation", description="Evaluation and treatment plan for acne", category="Consultation", duration_minutes=30, price=15000),
            Service(name="Mole Removal", description="Surgical removal of suspicious or cosmetic moles", category="Treatment", duration_minutes=30, price=25000),
            Service(name="Botox Treatment", description="Cosmetic botox injections for wrinkle reduction", category="Treatment", duration_minutes=20, price=40000),
            Service(name="Chemical Peel", description="Chemical exfoliation for skin rejuvenation", category="Treatment", duration_minutes=45, price=30000),
            
            # Orthopedic services
            Service(name="Orthopedic Consultation", description="Evaluation of musculoskeletal conditions and injuries", category="Consultation", duration_minutes=45, price=20000),
            Service(name="Joint Injection", description="Corticosteroid or hyaluronic acid injection for joint pain", category="Treatment", duration_minutes=20, price=15000),
            Service(name="Physical Therapy Referral", description="Assessment and referral for physical therapy", category="Consultation", duration_minutes=30, price=12000),
            Service(name="MRI Review", description="Review and discussion of MRI results", category="Consultation", duration_minutes=30, price=15000),
            
            # OB/GYN services
            Service(name="Annual Well Woman Exam", description="Comprehensive annual gynecological examination", category="Consultation", duration_minutes=45, price=18000),
            Service(name="Prenatal Visit", description="Routine prenatal check-up during pregnancy", category="Consultation", duration_minutes=30, price=15000),
            Service(name="Ultrasound", description="Obstetric or gynecologic ultrasound imaging", category="Diagnostic", duration_minutes=30, price=25000),
            Service(name="IUD Insertion", description="Insertion of intrauterine device for contraception", category="Treatment", duration_minutes=30, price=30000),
        ]
        
        for service in services:
            db.add(service)
        db.commit()
        print(f"Added {len(services)} services")
        
        # Create sample clinics
        clinics = [
            Clinic(
                name="Downtown Medical Center",
                address="123 Main Street, Suite 400",
                city="New York",
                state="NY",
                zip_code="10001",
                phone="+1-212-555-0100",
                email="downtown@doctorsportal.com",
                latitude="40.7505",
                longitude="-73.9934",
                hours_monday="8:00 AM - 6:00 PM",
                hours_tuesday="8:00 AM - 6:00 PM",
                hours_wednesday="8:00 AM - 6:00 PM",
                hours_thursday="8:00 AM - 6:00 PM",
                hours_friday="8:00 AM - 5:00 PM",
                hours_saturday="9:00 AM - 1:00 PM",
                hours_sunday="Closed"
            ),
            Clinic(
                name="Westside Health Clinic",
                address="456 Broadway Avenue",
                city="Los Angeles",
                state="CA",
                zip_code="90028",
                phone="+1-323-555-0200",
                email="westside@doctorsportal.com",
                latitude="34.0928",
                longitude="-118.3287",
                hours_monday="8:00 AM - 7:00 PM",
                hours_tuesday="8:00 AM - 7:00 PM",
                hours_wednesday="8:00 AM - 7:00 PM",
                hours_thursday="8:00 AM - 7:00 PM",
                hours_friday="8:00 AM - 6:00 PM",
                hours_saturday="9:00 AM - 2:00 PM",
                hours_sunday="Closed"
            ),
            Clinic(
                name="Northside Family Practice",
                address="789 Oak Street",
                city="Chicago",
                state="IL",
                zip_code="60611",
                phone="+1-312-555-0300",
                email="northside@doctorsportal.com",
                latitude="41.8944",
                longitude="-87.6244",
                hours_monday="7:30 AM - 5:30 PM",
                hours_tuesday="7:30 AM - 5:30 PM",
                hours_wednesday="7:30 AM - 5:30 PM",
                hours_thursday="7:30 AM - 5:30 PM",
                hours_friday="7:30 AM - 4:30 PM",
                hours_saturday="Closed",
                hours_sunday="Closed"
            )
        ]
        
        for clinic in clinics:
            db.add(clinic)
        db.commit()
        print(f"Added {len(clinics)} clinics")
        
        # Create sample schedules
        # Dr. Sarah Johnson (Cardiologist) - Downtown Medical Center (id=1)
        # Monday, Wednesday, Friday: 9 AM - 1 PM
        schedules = [
            Schedule(doctor_id=1, clinic_id=1, day_of_week=0, start_time=time(9, 0), end_time=time(13, 0)),  # Monday
            Schedule(doctor_id=1, clinic_id=1, day_of_week=2, start_time=time(9, 0), end_time=time(13, 0)),  # Wednesday
            Schedule(doctor_id=1, clinic_id=1, day_of_week=4, start_time=time(9, 0), end_time=time(13, 0)),  # Friday
            
            # Dr. Michael Chen (Pediatrician) - Westside Health Clinic (id=2)
            # Tuesday, Thursday: 8 AM - 12 PM, Saturday: 9 AM - 1 PM
            Schedule(doctor_id=2, clinic_id=2, day_of_week=1, start_time=time(8, 0), end_time=time(12, 0)),  # Tuesday
            Schedule(doctor_id=2, clinic_id=2, day_of_week=3, start_time=time(8, 0), end_time=time(12, 0)),  # Thursday
            Schedule(doctor_id=2, clinic_id=2, day_of_week=5, start_time=time(9, 0), end_time=time(13, 0)),  # Saturday
            
            # Dr. Emily Rodriguez (Dermatologist) - Downtown Medical Center (id=1)
            # Monday, Tuesday, Thursday: 1 PM - 5 PM
            Schedule(doctor_id=3, clinic_id=1, day_of_week=0, start_time=time(13, 0), end_time=time(17, 0)),  # Monday
            Schedule(doctor_id=3, clinic_id=1, day_of_week=1, start_time=time(13, 0), end_time=time(17, 0)),  # Tuesday
            Schedule(doctor_id=3, clinic_id=1, day_of_week=3, start_time=time(13, 0), end_time=time(17, 0)),  # Thursday
            
            # Dr. James Wilson (Orthopedic) - Northside Family Practice (id=3)
            # Monday, Wednesday, Friday: 8 AM - 12 PM
            Schedule(doctor_id=4, clinic_id=3, day_of_week=0, start_time=time(8, 0), end_time=time(12, 0)),  # Monday
            Schedule(doctor_id=4, clinic_id=3, day_of_week=2, start_time=time(8, 0), end_time=time(12, 0)),  # Wednesday
            Schedule(doctor_id=4, clinic_id=3, day_of_week=4, start_time=time(8, 0), end_time=time(12, 0)),  # Friday
            
            # Dr. Lisa Thompson (OB/GYN) - Westside Health Clinic (id=2)
            # Tuesday, Wednesday, Friday: 9 AM - 1 PM
            Schedule(doctor_id=5, clinic_id=2, day_of_week=1, start_time=time(9, 0), end_time=time(13, 0)),  # Tuesday
            Schedule(doctor_id=5, clinic_id=2, day_of_week=2, start_time=time(9, 0), end_time=time(13, 0)),  # Wednesday
            Schedule(doctor_id=5, clinic_id=2, day_of_week=4, start_time=time(9, 0), end_time=time(13, 0)),  # Friday
        ]
        
        for schedule in schedules:
            db.add(schedule)
        db.commit()
        print(f"Added {len(schedules)} schedules")
        
        print("\nDatabase seeded successfully!")
        print("\nSample data includes:")
        print("- 5 Doctors (Cardiology, Pediatrics, Dermatology, Orthopedics, OB/GYN)")
        print("- 20 Services across all specialties")
        print("- 3 Clinics (NYC, LA, Chicago)")
        print("- 15 Schedules linking doctors to clinics")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
    seed_data()
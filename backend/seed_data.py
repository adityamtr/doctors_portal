#!/usr/bin/env python3
"""Load the single-doctor demo portal data from seed_data.yaml."""
import os
import sys
from datetime import time

import yaml

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database.database import Base, SessionLocal, engine, init_db
from app.models.models import Clinic, Doctor, Schedule, Service


DATA_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "seed_data.yaml")


def seed_data():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        data = yaml.safe_load(file)

    db = SessionLocal()
    try:
        has_existing_data = any([
            db.query(Doctor).first(),
            db.query(Service).first(),
            db.query(Clinic).first(),
            db.query(Schedule).first(),
        ])

        if has_existing_data:
            print("Existing seed data found. Resetting database...")
            db.close()
            Base.metadata.drop_all(bind=engine)
            init_db()
            db = SessionLocal()

        doctor = Doctor(**data["doctor"])
        db.add(doctor)
        db.flush()

        services = [Service(**service_data) for service_data in data["services"]]
        clinics = [Clinic(**clinic_data) for clinic_data in data["clinics"]]
        db.add_all(services + clinics)
        db.flush()

        schedules = [
            Schedule(
                doctor_id=doctor.id,
                clinic_id=clinics[schedule_data["clinic_index"]].id,
                day_of_week=schedule_data["day_of_week"],
                start_time=time.fromisoformat(schedule_data["start_time"]),
                end_time=time.fromisoformat(schedule_data["end_time"]),
            )
            for schedule_data in data["schedules"]
        ]
        db.add_all(schedules)
        db.commit()

        print("Database seeded successfully from seed_data.yaml!")
        print(f"- 1 doctor: {doctor.name}")
        print(f"- {len(services)} services")
        print(f"- {len(clinics)} clinics")
        print(f"- {len(schedules)} schedules")
    except Exception as error:
        db.rollback()
        print(f"Error seeding database: {error}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    seed_data()

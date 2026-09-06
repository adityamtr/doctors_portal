from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database.database import init_db
from app.api import doctors, services, clinics, appointments, schedules

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    yield
    # Shutdown (if needed)

app = FastAPI(
    title="Doctor's Portal API",
    description="A comprehensive API for managing doctor appointments, services, and clinic information",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with /api prefix
app.include_router(doctors.router, prefix="/api")
app.include_router(services.router, prefix="/api")
app.include_router(clinics.router, prefix="/api")
app.include_router(appointments.router, prefix="/api")
app.include_router(schedules.router, prefix="/api")

@app.get("/")
def root():
    return {
        "message": "Welcome to Doctor's Portal API",
        "version": "1.0.0",
        "docs": "/docs",
        "redoc": "/redoc"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
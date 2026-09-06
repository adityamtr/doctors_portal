# CarePoint

A comprehensive, full-stack healthcare appointment booking platform built with **FastAPI** (Python) backend, **React** (Vite) frontend, and **SQLite/PostgreSQL** database.

## 🌟 Features

### For Patients
- **Browse Doctors** - Search and filter by specialty, location, availability
- **View Services** - Explore medical services with pricing and duration
- **Clinic Locations** - Find nearby clinics with hours and contact info
- **Book Appointments** - Real-time availability checking, multi-step booking flow
- **Appointment Management** - Confirmation emails, calendar integration
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile

### For Healthcare Providers
- **Doctor Profiles** - Comprehensive profiles with credentials, specialties, schedules
- **Service Management** - Define services with categories, pricing, duration
- **Clinic Management** - Multiple locations with hours and contact details
- **Schedule Management** - Weekly schedules per doctor per clinic
- **Appointment Dashboard** - View, confirm, cancel, and manage appointments

### Technical Features
- **RESTful API** - Well-documented FastAPI endpoints with automatic OpenAPI docs
- **Database** - SQLAlchemy ORM with SQLite (dev) / PostgreSQL (prod) support
- **Validation** - Pydantic schemas for request/response validation
- **CORS** - Configured for frontend integration
- **Type Safety** - Full TypeScript-ready with Pydantic models
- **Modern UI** - Tailwind CSS + Framer Motion animations
- **Form Handling** - React Hook Form + Yup validation
- **State Management** - React Context for booking flow

## 🏗️ Architecture

```
doctors_portal/
├── backend/                 # FastAPI Backend
│   ├── app/
│   │   ├── api/            # API Routes (doctors, services, clinics, appointments, schedules)
│   │   ├── models/         # SQLAlchemy Models
│   │   ├── schemas/        # Pydantic Schemas
│   │   ├── database/       # Database Configuration
│   │   └── main.py         # FastAPI Application Entry
│   ├── requirements.txt    # Python Dependencies
│   ├── run.py             # Development Server
│   ├── seed_data.py       # Sample Data Seeding
│   └── .env               # Environment Variables
│
├── frontend/               # React Frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI Components
│   │   ├── pages/          # Page Components
│   │   ├── hooks/          # Custom React Hooks
│   │   ├── services/       # API Service Layer
│   │   ├── context/        # React Context Providers
│   │   ├── App.jsx         # Main App with Routing
│   │   └── main.jsx        # Entry Point
│   ├── package.json        # Node Dependencies
│   ├── vite.config.js      # Vite Configuration
│   ├── tailwind.config.js  # Tailwind CSS Configuration
│   └── index.html          # HTML Template
│
└── package.json            # Root Package (Concurrent Dev)
```

## 🚀 Quick Start

### Prerequisites
- **Python 3.9+** 
- **Node.js 18+**
- **npm** or **yarn**

### Installation

1. **Clone and navigate to project**
   ```bash
   cd doctors_portal
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```
   Or manually:
   ```bash
   # Backend
   cd backend
   pip install -r requirements.txt
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Seed the database with demo data**
   ```bash
   cd backend
   python seed_data.py
   ```
   The single-doctor demo data is maintained in `backend/seed_data.yaml`.
   Running the seeder resets existing seed records before loading the YAML,
   so no manual database deletion is required.

4. **Start development servers**
   ```bash
   # From root directory - runs both frontend and backend
   npm run dev
   
   # Or separately:
   # Terminal 1 - Backend
   cd backend && python run.py
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📚 API Endpoints

### Doctors
- `GET /api/doctors` - List all doctors (with filters)
- `GET /api/doctors/{id}` - Get doctor details
- `POST /api/doctors` - Create new doctor
- `PUT /api/doctors/{id}` - Update doctor
- `DELETE /api/doctors/{id}` - Delete doctor

### Services
- `GET /api/services` - List all services (with filters)
- `GET /api/services/{id}` - Get service details
- `POST /api/services` - Create new service
- `PUT /api/services/{id}` - Update service
- `DELETE /api/services/{id}` - Delete service

### Clinics
- `GET /api/clinics` - List all clinics (with filters)
- `GET /api/clinics/{id}` - Get clinic details
- `POST /api/clinics` - Create new clinic
- `PUT /api/clinics/{id}` - Update clinic
- `DELETE /api/clinics/{id}` - Delete clinic

### Appointments
- `GET /api/appointments` - List appointments (with filters)
- `GET /api/appointments/{id}` - Get appointment details
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/{id}` - Update appointment
- `DELETE /api/appointments/{id}` - Cancel appointment
- `POST /api/appointments/check-availability` - Check available time slots
- `GET /api/appointments/doctor/{id}/availability` - Get doctor's availability

### Schedules
- `GET /api/schedules` - List schedules (with filters)
- `GET /api/schedules/{id}` - Get schedule details
- `POST /api/schedules` - Create new schedule
- `PUT /api/schedules/{id}` - Update schedule
- `DELETE /api/schedules/{id}` - Delete schedule

## 🗄️ Database Schema

### Core Models
- **Doctor** - Profile, specialization, credentials, schedule
- **Service** - Medical services with category, price, duration
- **Clinic** - Locations with address, hours, contact info
- **Schedule** - Doctor availability per clinic per day
- **Appointment** - Patient bookings with status tracking

### Relationships
- Doctor ↔ Appointments (One-to-Many)
- Doctor ↔ Schedules (One-to-Many)
- Service ↔ Appointments (One-to-Many)
- Clinic ↔ Appointments (One-to-Many)
- Clinic ↔ Schedules (One-to-Many)

## 🎨 Frontend Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with hero, features, featured doctors/services/clinics |
| `/doctors` | Doctor directory with search, filters, and sorting |
| `/doctors/:id` | Doctor profile with tabs (overview, services, schedule, locations) |
| `/services` | Services catalog with category filters |
| `/clinics` | Clinic locations with map view and details |
| `/book-appointment` | Multi-step appointment booking wizard |
| `/appointment-confirmation/:id` | Appointment confirmation with details |
| `/about` | About page with mission, values, team, milestones |
| `/contact` | Contact form, FAQ, clinic contacts, office hours |

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
DATABASE_URL=sqlite:///./doctors_portal.db
# For PostgreSQL:
# DATABASE_URL=postgresql://user:password@localhost/doctors_portal

APP_NAME=CarePoint
APP_VERSION=1.0.0
DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend Configuration
- **Vite Proxy** - Configured to proxy `/api` to `http://localhost:8000`
- **Tailwind CSS** - Custom color palette (primary, secondary)
- **Framer Motion** - Page transitions and animations

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend linting
cd frontend
npm run lint
```

## 📦 Production Deployment

### Backend
1. Set `DEBUG=False` in `.env`
2. Use PostgreSQL: `DATABASE_URL=postgresql://...`
3. Run with Gunicorn: `gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker`
4. Set up reverse proxy (Nginx) with SSL

### Frontend
1. Build: `npm run build`
2. Serve `dist/` folder with Nginx or any static file server
3. Configure API proxy to production backend

### Docker (Optional)
```dockerfile
# Backend Dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install -r requirements.txt
COPY backend/ .
CMD ["gunicorn", "app.main:app", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "-b", "0.0.0.0:8000"]
```

## 🔐 Security Considerations

- **CORS** - Restricted to known origins
- **Input Validation** - Pydantic schemas on all endpoints
- **SQL Injection** - SQLAlchemy ORM prevents injection
- **Environment Variables** - Secrets in `.env` (not committed)
- **HTTPS** - Required for production
- **Authentication** - JWT-ready (implementation pending)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI** - Modern, fast web framework for building APIs
- **React** - JavaScript library for building user interfaces
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **SQLAlchemy** - Python SQL toolkit and ORM
- **Pydantic** - Data validation using Python type hints
- **Lucide React** - Beautiful & consistent icons
- **Unsplash** - Sample doctor images

## 📞 Support

For questions or support:
- Email: info@doctorsportal.com
- Phone: (555) 010-0000
- Issues: GitHub Issues

---

**Built with ❤️ for better healthcare access**

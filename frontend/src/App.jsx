import { Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { AppointmentProvider } from './context/AppointmentContext'
import { Home } from './pages/Home'
import { DoctorDetail } from './pages/DoctorDetail'
import { Services } from './pages/Services'
import { Clinics } from './pages/Clinics'
import { AppointmentBooking } from './pages/AppointmentBooking'
import { AppointmentConfirmation } from './pages/AppointmentConfirmation'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { Login } from './pages/Login'

function App() {
  return (
    <AppointmentProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 md:pt-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/doctors" element={<Navigate to="/doctor" replace />} />
            <Route path="/doctor" element={<DoctorDetail />} />
            <Route path="/doctor/:id" element={<DoctorDetail />} />
            <Route path="/doctors/:id" element={<DoctorDetail />} />
            <Route path="/services" element={<Services />} />
            <Route path="/clinics" element={<Clinics />} />
            <Route path="/book-appointment" element={<AppointmentBooking />} />
            <Route path="/appointment-confirmation/:id" element={<AppointmentConfirmation />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AppointmentProvider>
  )
}

export default App
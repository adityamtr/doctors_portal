import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import { Home } from './pages/Home'
import { Doctors } from './pages/Doctors'
import { DoctorDetail } from './pages/DoctorDetail'
import { Services } from './pages/Services'
import { Clinics } from './pages/Clinics'
import { AppointmentBooking } from './pages/AppointmentBooking'
import { AppointmentConfirmation } from './pages/AppointmentConfirmation'
import { About } from './pages/About'
import { Contact } from './pages/Contact'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/doctors/:id" element={<DoctorDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/clinics" element={<Clinics />} />
          <Route path="/book-appointment" element={<AppointmentBooking />} />
          <Route path="/appointment-confirmation/:id" element={<AppointmentConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
import { useState, useEffect, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, MapPin, Clock, Calendar, Phone, Mail, Star, Award, GraduationCap, Languages, CheckCircle, Heart, Stethoscope } from 'lucide-react'
import { Button, Card, Badge, Avatar, Modal } from '../components/UI'
import { useDoctor, useServices, useClinics, useSchedules, useDoctorAvailability } from '../hooks/useApi'
import { useAppointmentBooking } from '../context/AppointmentContext'
import { format, parseISO, addDays, startOfDay, getDay } from 'date-fns'
import { formatPrice } from '../utils/currency'

const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function DoctorDetail() {
  const navigate = useNavigate()
  const { id: routeId } = useParams()
  const doctorId = routeId ? Number(routeId) : 1

  const { data: doctor, loading, error } = useDoctor(doctorId)
  const { data: services } = useServices({ is_active: true })
  const { data: clinics } = useClinics({ is_active: true })
  const { data: schedules } = useSchedules({ doctor_id: doctorId, is_available: true })
  const { check: checkAvailability, loading: checkingAvailability, slots: availableSlots } = useDoctorAvailability()
  
  const { 
    selectedDoctor, setSelectedDoctor,
    selectedService, setSelectedService,
    selectedClinic, setSelectedClinic,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
  } = useAppointmentBooking()

  const [activeTab, setActiveTab] = useState('overview')
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedSchedule, setSelectedSchedule] = useState(null)

  // Initialize booking context when doctor loads
  useEffect(() => {
    if (doctor && !selectedDoctor) {
      setSelectedDoctor(doctor)
    }
  }, [doctor, selectedDoctor, setSelectedDoctor])

  // Get doctor's schedules grouped by clinic
  const schedulesByClinic = useMemo(() => {
    if (!schedules || !clinics) return {}
    
    const grouped = {}
    schedules.forEach(schedule => {
      const clinic = clinics.find(c => c.id === schedule.clinic_id)
      if (clinic) {
        if (!grouped[clinic.id]) {
          grouped[clinic.id] = { clinic, schedules: [] }
        }
        grouped[clinic.id].schedules.push(schedule)
      }
    })
    return grouped
  }, [schedules, clinics])

  // Get available services for this doctor's specialization
  const doctorServices = useMemo(() => {
    if (!services || !doctor) return []
    return services.filter(s => 
      s.category.toLowerCase().includes(doctor.specialization.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(s.category.toLowerCase())
    )
  }, [services, doctor])

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    if (selectedClinic && doctor) {
      const duration = selectedService?.duration_minutes || 30
      checkAvailability(doctorId, selectedClinic.id, date, duration)
    }
  }

  const handleTimeSelect = (time) => {
    const slot = availableSlots.find(s => s.start_time === time)
    if (slot?.is_available) {
      setSelectedTime(time)
    }
  }

  const handleBookAppointment = () => {
    setSelectedDoctor(doctor)
    navigate('/book-appointment')
  }

  const isSlotAvailable = (time) => {
    const slot = availableSlots.find(s => s.start_time === time)
    return slot?.is_available ?? true
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading doctor profile...</p>
        </div>
      </div>
    )
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Doctor Not Found</h2>
          <p className="text-gray-500 mb-6">The doctor you're looking for doesn't exist or has been removed.</p>
          <Link to="/doctors">
            <Button>Back to Doctors</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-8">
        {/* Doctor Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="card p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
              <Avatar 
                src={doctor.profile_image} 
                name={doctor.name} 
                size="2xl" 
                className="flex-shrink-0"
              />
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
                  <h1 className="heading-2 text-gray-900 break-words">{doctor.name}</h1>
                  {doctor.is_active && (
                    <Badge variant="success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Accepting Patients
                    </Badge>
                  )}
                </div>
                <p className="text-primary-600 text-lg font-medium mb-2">{doctor.title}</p>
                <p className="text-gray-600 mb-4">{doctor.specialization} Specialist</p>
                
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Award className="w-4 h-4" />
                    {doctor.experience_years}+ years experience
                  </span>
                  {doctor.languages && (
                    <span className="flex items-center gap-1">
                      <Languages className="w-4 h-4" />
                      {doctor.languages}
                    </span>
                  )}
                  {doctor.education && (
                    <span className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      {doctor.education.split(',')[0].trim()}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-3 w-full md:w-auto">
                <Button size="lg" onClick={handleBookAppointment} disabled={!doctor.is_active} className="w-full md:w-auto">
                  <Calendar className="w-5 h-5 mr-2" />
                  Book Appointment
                </Button>
                {doctor.phone && (
                  <a href={`tel:${doctor.phone}`} className="btn-outline w-full md:w-auto">
                    <Phone className="w-5 h-5 mr-2" />
                    Call Clinic
                  </a>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {activeTab === 'overview' && (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <Card className="p-6 md:p-8">
                  <h2 className="heading-3 text-gray-900 mb-4 flex items-center gap-2">
                    <Stethoscope className="w-6 h-6 text-primary-600" />
                    About Dr. {doctor.name.split(' ').pop()}
                  </h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {doctor.bio || `Dr. ${doctor.name.split(' ').pop()} is a board-certified ${doctor.specialization.toLowerCase()} specialist with over ${doctor.experience_years} years of clinical experience. They are dedicated to providing compassionate, evidence-based care to all patients.`}
                    </p>
                    {doctor.education && (
                      <div className="mb-6">
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <GraduationCap className="w-5 h-5 text-primary-600" />
                          Education
                        </h3>
                        <p className="text-gray-600">{doctor.education}</p>
                      </div>
                    )}
                    {doctor.certifications && (
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                          <Award className="w-5 h-5 text-primary-600" />
                          Certifications
                        </h3>
                        <p className="text-gray-600">{doctor.certifications}</p>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Specialties & Languages */}
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-primary-600" />
                      Specialties
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="primary">{doctor.specialization}</Badge>
                      {doctorServices.slice(0, 3).map(s => (
                        <Badge key={s.id} variant="outline">{s.category}</Badge>
                      ))}
                    </div>
                  </Card>

                  {doctor.languages && (
                    <Card className="p-6">
                      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Languages className="w-5 h-5 text-primary-600" />
                        Languages Spoken
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {doctor.languages.split(',').map((lang, i) => (
                          <Badge key={i} variant="secondary">{lang.trim()}</Badge>
                        ))}
                      </div>
                    </Card>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Contact Info */}
                <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    {doctor.email && (
                      <a href={`mailto:${doctor.email}`} className="flex items-center gap-3 text-gray-600 hover:text-primary-600 transition-colors">
                        <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <span>{doctor.email}</span>
                      </a>
                    )}
                    {doctor.phone && (
                      <a href={`tel:${doctor.phone}`} className="flex items-center gap-3 text-gray-600 hover:text-primary-600 transition-colors">
                        <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                        <span>{doctor.phone}</span>
                      </a>
                    )}
                  </div>
                </Card>

              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-3 text-gray-900">Available Services</h2>
                <Badge variant="primary">{doctorServices.length} services</Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {doctorServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 h-full" onClick={() => { setSelectedService(service); setActiveTab('overview'); }}>
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="font-semibold text-gray-900">{service.name}</h3>
                        <Badge variant="outline">{service.category}</Badge>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{service.description}</p>
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <span className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="w-4 h-4" />
                          {service.duration_minutes} min
                        </span>
                        {service.price && (
                          <span className="font-semibold text-gray-900">{formatPrice(service.price)}</span>
                        )}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div>
              <h2 className="heading-3 text-gray-900 mb-6">Weekly Schedule</h2>
              {Object.keys(schedulesByClinic).length > 0 ? (
                <div className="space-y-6">
                  {Object.values(schedulesByClinic).map(({ clinic, schedules: clinicSchedules }) => (
                    <Card key={clinic.id} className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                          <p className="text-gray-500 text-sm">{clinic.address}, {clinic.city}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => { setSelectedDoctor(doctor); setSelectedClinic(clinic); navigate('/book-appointment') }}>
                          Book Here
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {clinicSchedules
                          .sort((a, b) => a.day_of_week - b.day_of_week)
                          .map(schedule => (
                            <div key={schedule.id} className="p-4 bg-gray-50 rounded-lg">
                              <p className="font-medium text-gray-900">{dayLabels[schedule.day_of_week]}</p>
                              <p className="text-primary-600 font-medium">
                                {format(new Date(`2000-01-01T${schedule.start_time}`), 'h:mm a')} - {format(new Date(`2000-01-01T${schedule.end_time}`), 'h:mm a')}
                              </p>
                            </div>
                          ))}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedule Available</h3>
                  <p className="text-gray-500">This doctor's schedule is not currently available online.</p>
                </Card>
              )}
            </div>
          )}

          {activeTab === 'locations' && (
            <div>
              <h2 className="heading-3 text-gray-900 mb-6">Clinic Locations</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {clinics?.map((clinic, index) => (
                  <motion.div
                    key={clinic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-6 h-full" onClick={() => { setSelectedClinic(clinic); setActiveTab('overview'); }}>
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-semibold text-gray-900">{clinic.name}</h3>
                          <p className="text-gray-500 text-sm">{clinic.city}, {clinic.state}</p>
                        </div>
                        <MapPin className="w-8 h-8 text-primary-600" />
                      </div>
                      <p className="text-gray-600 mb-4">{clinic.address}</p>
                      {clinic.phone && (
                        <a href={`tel:${clinic.phone}`} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 mb-4">
                          <Phone className="w-4 h-4" />
                          {clinic.phone}
                        </a>
                      )}
                      <div className="space-y-1 text-sm">
                        {dayLabels.map((day, i) => {
                          const hours = clinic[`hours_${day.toLowerCase()}`]
                          return hours ? (
                            <div key={day} className="flex justify-between text-gray-600">
                              <span>{day.slice(0, 3)}</span>
                              <span className="font-medium">{hours}</span>
                            </div>
                          ) : null
                        })}
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Confirm Appointment"
        size="lg"
      >
        <div className="space-y-6">
          <Card className="p-6 bg-primary-50 border-primary-200">
            <h3 className="font-semibold text-gray-900 mb-4">Appointment Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Doctor</span>
                <span className="font-medium">{selectedDoctor?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Service</span>
                <span className="font-medium">{selectedService?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Clinic</span>
                <span className="font-medium">{selectedClinic?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date</span>
                <span className="font-medium">{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Not selected'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Time</span>
                <span className="font-medium">{selectedTime || 'Not selected'}</span>
              </div>
            </div>
          </Card>
          
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={() => { setShowBookingModal(false); window.location.href = '/book-appointment' }}>
              Continue to Booking
              <ArrowLeft className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
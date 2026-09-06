import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Calendar, Clock, MapPin, User, Mail, Phone, Stethoscope, Building2, Heart, ArrowLeft, Download, Share2, Printer } from 'lucide-react'
import { Button, Card, Badge } from '../components/UI'
import { useAppointment } from '../hooks/useApi'
import { format } from 'date-fns'
import { formatPrice } from '../utils/currency'

export function AppointmentConfirmation() {
  const { id } = useParams()
  const { data: appointment, loading, error } = useAppointment(id)

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading appointment details...</p>
        </div>
      </div>
    )
  }

  if (error || !appointment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Appointment Not Found</h2>
          <p className="text-gray-500 mb-6">The appointment confirmation you're looking for doesn't exist.</p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    completed: 'bg-blue-100 text-blue-700',
  }

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    confirmed: <CheckCircle className="w-4 h-4" />,
    cancelled: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
    completed: <CheckCircle className="w-4 h-4" />,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="container py-8 md:py-12">
          <div className="flex items-center justify-between">
            <Link to="/" className="btn-ghost">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Link>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container py-8 md:py-12">
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="p-6 md:p-8 bg-green-50 border-green-200">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Appointment Confirmed!</h1>
                <p className="text-green-700 mt-1">Your appointment has been successfully booked.</p>
              </div>
              <Badge variant="success" className={statusColors[appointment.status]}>
                {statusIcons[appointment.status]}
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </Badge>
            </div>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Appointment Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="p-6 md:p-8">
                <h2 className="heading-3 text-gray-900 mb-6 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-primary-600" />
                  Appointment Details
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Stethoscope className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Doctor</p>
                      <p className="font-semibold text-gray-900">{appointment.doctor?.name || 'TBD'}</p>
                      <p className="text-gray-500 text-sm">{appointment.doctor?.title || ''}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Heart className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Service</p>
                      <p className="font-semibold text-gray-900">{appointment.service?.name || 'TBD'}</p>
                      <p className="text-gray-500 text-sm">
                        {appointment.service?.category} • {appointment.duration_minutes} min
                        {appointment.service?.price && ` • ${formatPrice(appointment.service.price)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-semibold text-gray-900">{appointment.clinic?.name || 'TBD'}</p>
                      <p className="text-gray-500 text-sm">
                        {appointment.clinic?.address}, {appointment.clinic?.city}, {appointment.clinic?.state}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Date</p>
                        <p className="font-semibold text-gray-900">
                          {appointment.appointment_date ? format(new Date(appointment.appointment_date), 'EEEE, MMMM d, yyyy') : 'TBD'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <Clock className="w-6 h-6 text-primary-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Time</p>
                        <p className="font-semibold text-gray-900">
                          {appointment.appointment_time ? format(new Date(`2000-01-01T${appointment.appointment_time}`), 'h:mm a') : 'TBD'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Patient Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 md:p-8">
                <h2 className="heading-3 text-gray-900 mb-6 flex items-center gap-2">
                  <User className="w-6 h-6 text-primary-600" />
                  Patient Information
                </h2>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium text-gray-900">{appointment.patient_name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Email</p>
                    <a href={`mailto:${appointment.patient_email}`} className="font-medium text-gray-900 hover:text-primary-600">{appointment.patient_email}</a>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Phone</p>
                    <a href={`tel:${appointment.patient_phone}`} className="font-medium text-gray-900 hover:text-primary-600">{appointment.patient_phone}</a>
                  </div>
                  {appointment.patient_dob && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500">Date of Birth</p>
                      <p className="font-medium text-gray-900">{format(new Date(appointment.patient_dob), 'MMMM d, yyyy')}</p>
                    </div>
                  )}
                  {appointment.patient_gender && (
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-500">Gender</p>
                      <p className="font-medium text-gray-900 capitalize">{appointment.patient_gender.replace('_', ' ')}</p>
                    </div>
                  )}
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500">Confirmation #</p>
                    <p className="font-medium text-gray-900 font-mono">#{appointment.id}</p>
                  </div>
                </div>

                {appointment.reason && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">Reason for Visit</p>
                    <p className="text-gray-900">{appointment.reason}</p>
                  </div>
                )}

                {appointment.notes && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-500 mb-2">Additional Notes</p>
                    <p className="text-gray-900">{appointment.notes}</p>
                  </div>
                )}
              </Card>
            </motion.div>

            {/* Important Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="p-6 md:p-8 bg-blue-50 border-blue-200">
                <h2 className="heading-3 text-gray-900 mb-4 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Important Reminders
                </h2>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Please arrive 15 minutes before your scheduled appointment time.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Bring a valid photo ID and your insurance card (if applicable).</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>Bring any relevant medical records, test results, or medication lists.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>If you need to cancel or reschedule, please notify us at least 24 hours in advance.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span>A confirmation email has been sent to {appointment.patient_email}.</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Confirmation Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Confirmation Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Confirmation #</span>
                    <span className="font-medium font-mono">#{appointment.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Booked On</span>
                    <span className="font-medium">{format(new Date(appointment.created_at), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <Badge variant="success" className={statusColors[appointment.status]}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button className="w-full justify-start" onClick={() => window.location.href = `/doctors/${appointment.doctor?.id}`}>
                    <Stethoscope className="w-5 h-5 mr-2" />
                    View Doctor Profile
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = `/clinics`}>
                    <Building2 className="w-5 h-5 mr-2" />
                    View Clinic Details
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => window.location.href = '/book-appointment'}>
                    <Calendar className="w-5 h-5 mr-2" />
                    Book Another Appointment
                  </Button>
                </div>
              </Card>
            </motion.div>

            {/* Contact Clinic */}
            {appointment.clinic && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Contact Clinic</h3>
                  <div className="space-y-3">
                    {appointment.clinic.phone && (
                      <a href={`tel:${appointment.clinic.phone}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Phone className="w-5 h-5 text-primary-600" />
                        <div>
                          <p className="text-sm text-gray-500">Call Clinic</p>
                          <p className="font-medium text-gray-900">{appointment.clinic.phone}</p>
                        </div>
                      </a>
                    )}
                    {appointment.clinic.email && (
                      <a href={`mailto:${appointment.clinic.email}`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Mail className="w-5 h-5 text-primary-600" />
                        <div>
                          <p className="text-sm text-gray-500">Email Clinic</p>
                          <p className="font-medium text-gray-900">{appointment.clinic.email}</p>
                        </div>
                      </a>
                    )}
                    <Link to={`/clinics`} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <MapPin className="w-5 h-5 text-primary-600" />
                      <div>
                        <p className="text-sm text-gray-500">Get Directions</p>
                        <p className="font-medium text-gray-900">{appointment.clinic.name}</p>
                      </div>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <Card className="p-6 md:p-8 bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
            <h2 className="heading-3 text-gray-900 mb-4">What's Next?</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Calendar className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Add to Calendar</h3>
                <p className="text-gray-600 text-sm">Add this appointment to your Google, Apple, or Outlook calendar.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Mail className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Check Email</h3>
                <p className="text-gray-600 text-sm">Look for a confirmation email with all appointment details and reminders.</p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                  <Phone className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Questions?</h3>
                <p className="text-gray-600 text-sm">Call the clinic directly if you have any questions before your visit.</p>
              </div>
            </div>
          </Card>
        </motion.section>
      </div>
    </div>
  )
}
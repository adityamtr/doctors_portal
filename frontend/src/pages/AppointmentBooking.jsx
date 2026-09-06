import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Clock, User, Mail, Phone, MapPin, Stethoscope, Building2, Heart, CheckCircle, ChevronRight } from 'lucide-react'
import { Button, Card, Badge, Avatar, Input, Select, Textarea } from '../components/UI'
import { AppointmentForm } from '../components/AppointmentForm'
import { useDoctors, useServices, useClinics } from '../hooks/useApi'
import { useAppointmentBooking } from '../context/AppointmentContext'
import { format, parseISO, addDays, startOfDay, isBefore } from 'date-fns'
import { formatPrice } from '../utils/currency'

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

export function AppointmentBooking() {
  const { data: doctors, loading: doctorsLoading } = useDoctors({ is_active: true, limit: 50 })
  const { data: services, loading: servicesLoading } = useServices({ is_active: true, limit: 50 })
  const { data: clinics, loading: clinicsLoading } = useClinics({ is_active: true, limit: 50 })
  
  const {
    selectedDoctor, setSelectedDoctor,
    selectedService, setSelectedService,
    selectedClinic, setSelectedClinic,
    selectedDate, setSelectedDate,
    selectedTime, setSelectedTime,
    patientInfo, updatePatientInfo,
    resetBooking,
  } = useAppointmentBooking()

  const [currentStep, setCurrentStep] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [patientErrors, setPatientErrors] = useState({})

  const steps = [
    { number: 1, label: 'Select Doctor', icon: Stethoscope },
    { number: 2, label: 'Choose Service', icon: Heart },
    { number: 3, label: 'Pick Location', icon: Building2 },
    { number: 4, label: 'Date & Time', icon: Calendar },
    { number: 5, label: 'Your Details', icon: User },
    { number: 6, label: 'Confirm', icon: CheckCircle },
  ]

  const validatePatientInfo = () => {
    const errors = {}
    const name = patientInfo.name.trim()
    const email = patientInfo.email.trim()
    const phone = patientInfo.phone.trim()
    const reason = patientInfo.reason.trim()

    if (name.length < 2) errors.name = 'Enter your full name.'
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'
    if (!/^[\d\s\-+()]{10,}$/.test(phone)) errors.phone = 'Enter a valid phone number.'
    if (!patientInfo.dob) errors.dob = 'Select your date of birth.'
    if (!patientInfo.gender) errors.gender = 'Select an option.'
    if (reason.length < 10) errors.reason = 'Enter at least 10 characters.'

    setPatientErrors(errors)
    return Object.keys(errors).length === 0
  }

  const canProceed = () => {
    const isPatientInfoValid = Object.keys(patientErrors).length === 0 &&
      patientInfo.name.trim().length >= 2 &&
      (!patientInfo.email.trim() || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(patientInfo.email.trim())) &&
      /^[\d\s\-+()]{10,}$/.test(patientInfo.phone.trim()) &&
      Boolean(patientInfo.dob) &&
      Boolean(patientInfo.gender) &&
      patientInfo.reason.trim().length >= 10

    switch (currentStep) {
      case 1: return !!selectedDoctor
      case 2: return !!selectedService
      case 3: return !!selectedClinic
      case 4: return !!selectedDate && !!selectedTime
      case 5: return true
      case 6: return !!selectedDoctor && !!selectedService && !!selectedClinic && !!selectedDate && !!selectedTime && isPatientInfoValid
      default: return false
    }
  }

  const handleNext = () => {
    if (currentStep === 5 && !validatePatientInfo()) return
    setCurrentStep(prev => Math.min(6, prev + 1))
  }

  const renderStepIndicator = () => (
    <div className="hidden lg:flex items-center justify-between mb-8 relative">
      <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 z-0" />
      {steps.map((step, index) => (
        <div key={step.number} className="relative z-10 flex flex-col items-center">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
            currentStep > step.number
              ? 'bg-primary-600 text-white'
              : currentStep === step.number
              ? 'bg-primary-600 text-white ring-4 ring-primary-100'
              : 'bg-gray-100 text-gray-400'
          }`}>
            {currentStep > step.number ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <step.icon className="w-5 h-5" />
            )}
          </div>
          <span className={`text-xs font-medium mt-2 ${currentStep >= step.number ? 'text-primary-600' : 'text-gray-400'}`}>
            {step.label}
          </span>
        </div>
      ))}
    </div>
  )

  const renderMobileStepIndicator = () => (
    <div className="lg:hidden mb-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex flex-col items-center flex-1 relative">
            {index < steps.length - 1 && (
              <div className="absolute top-5 left-1/2 right-0 h-0.5 bg-gray-200 z-0" />
            )}
            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
              currentStep > step.number
                ? 'bg-primary-600 text-white'
                : currentStep === step.number
                ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                : 'bg-gray-100 text-gray-400'
            }`}>
              {currentStep > step.number ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <span className={`text-center text-[10px] leading-tight font-medium mt-1 ${currentStep >= step.number ? 'text-primary-600' : 'text-gray-400'}`}>
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-primary-600" />
          Select Your Doctor
        </h3>
        <p className="text-gray-500 mb-4">Choose from our network of board-certified specialists</p>
      </div>

      {doctorsLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-full mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors?.map(doctor => (
            <Card
              key={doctor.id}
              className={`p-4 cursor-pointer transition-all ${selectedDoctor?.id === doctor.id ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500' : 'hover:border-primary-300'}`}
              onClick={() => { setSelectedDoctor(doctor); setCurrentStep(2); }}
            >
              <div className="flex items-center gap-4">
                <Avatar 
                  src={doctor.profile_image} 
                  name={doctor.name} 
                  size="lg" 
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{doctor.name}</h4>
                  <p className="text-primary-600 text-sm">{doctor.title}</p>
                  <p className="text-gray-500 text-sm mt-1 truncate">
                    {doctor.specialization} • {doctor.experience_years}+ years
                  </p>
                </div>
                {selectedDoctor?.id === doctor.id && (
                  <CheckCircle className="w-6 h-6 text-primary-600 flex-shrink-0" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary-600" />
          Choose a Service
        </h3>
        <p className="text-gray-500 mb-4">Select the type of appointment you need</p>
      </div>

      {servicesLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-full mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services?.map(service => (
            <Card
              key={service.id}
              className={`p-4 cursor-pointer transition-all ${selectedService?.id === service.id ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500' : 'hover:border-primary-300'}`}
              onClick={() => { setSelectedService(service); setCurrentStep(3); }}
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-medium text-gray-900">{service.name}</h4>
                <Badge variant="outline">{service.category}</Badge>
              </div>
              <p className="text-gray-500 text-sm mb-3">{service.description}</p>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {service.duration_minutes} min
                </span>
                {service.price && (
                  <span className="font-semibold text-gray-900">{formatPrice(service.price)}</span>
                )}
              </div>
              {selectedService?.id === service.id && (
                <div className="mt-3 pt-3 border-t border-primary-200 flex justify-end">
                  <CheckCircle className="w-5 h-5 text-primary-600" />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-primary-600" />
          Select Clinic Location
        </h3>
        <p className="text-gray-500 mb-4">Choose a convenient location for your appointment</p>
      </div>

      {clinicsLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-4 animate-pulse">
              <div className="h-10 bg-gray-200 rounded w-full mb-3" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clinics?.map(clinic => {
            const today = new Date().getDay()
            const hoursMap = {
              0: clinic.hours_monday, 1: clinic.hours_tuesday, 2: clinic.hours_wednesday,
              3: clinic.hours_thursday, 4: clinic.hours_friday, 5: clinic.hours_saturday, 6: clinic.hours_sunday
            }
            const todayHours = hoursMap[today] || 'Closed'
            const isOpenToday = todayHours !== 'Closed'

            return (
              <Card
                key={clinic.id}
                className={`p-4 cursor-pointer transition-all ${selectedClinic?.id === clinic.id ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500' : 'hover:border-primary-300'}`}
                onClick={() => { setSelectedClinic(clinic); setCurrentStep(4); }}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-medium text-gray-900">{clinic.name}</h4>
                    <p className="text-gray-500 text-sm">{clinic.city}, {clinic.state}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isOpenToday ? 'bg-green-500' : 'bg-gray-300'}`} />
                    <span className="text-xs font-medium text-gray-600">{isOpenToday ? 'Open' : 'Closed'}</span>
                  </div>
                </div>
                <p className="text-gray-500 text-sm mb-3">{clinic.address}</p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  {clinic.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {clinic.phone}
                    </span>
                  )}
                </div>
                {selectedClinic?.id === clinic.id && (
                  <div className="mt-3 pt-3 border-t border-primary-200 flex justify-end">
                    <CheckCircle className="w-5 h-5 text-primary-600" />
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary-600" />
          Select Date & Time
        </h3>
        <p className="text-gray-500 mb-4">Choose a convenient time for your appointment</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Date Selection */}
        <Card className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Select Date</h4>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              min={format(startOfDay(new Date()), 'yyyy-MM-dd')}
              max={format(addDays(new Date(), 90), 'yyyy-MM-dd')}
              value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => {
                const date = e.target.value ? parseISO(e.target.value) : null
                setSelectedDate(date)
                setSelectedTime(null)
              }}
              className="input pl-10"
              required
            />
          </div>
        </Card>

        {/* Time Selection */}
        <Card className="p-6">
          <h4 className="font-medium text-gray-900 mb-4">Select Time</h4>
          {selectedDate ? (
            <div className="grid grid-cols-4 gap-2">
              {[
                '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
                '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
                '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
                '17:00', '17:30'
              ].map(time => (
                <button
                  key={time}
                  onClick={() => setSelectedTime(time)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Please select a date first</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-primary-600" />
          Your Information
        </h3>
        <p className="text-gray-500 mb-4">Please provide your details to complete the booking</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleNext() }} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={patientInfo.name}
            onChange={(e) => updatePatientInfo('name', e.target.value)}
            error={patientErrors.name}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email"
            type="email"
            value={patientInfo.email}
            onChange={(e) => updatePatientInfo('email', e.target.value)}
            error={patientErrors.email}
            placeholder="john@example.com"
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Phone Number"
            type="tel"
            value={patientInfo.phone}
            onChange={(e) => updatePatientInfo('phone', e.target.value)}
            error={patientErrors.phone}
            placeholder="(555) 123-4567"
            required
          />
          <Input
            label="Date of Birth"
            type="date"
            max={format(addDays(new Date(), -1), 'yyyy-MM-dd')}
            value={patientInfo.dob}
            onChange={(e) => updatePatientInfo('dob', e.target.value)}
            error={patientErrors.dob}
            required
          />
        </div>
        <Select
          label="Gender"
          options={genderOptions}
          value={patientInfo.gender}
          onChange={(e) => updatePatientInfo('gender', e.target.value)}
          error={patientErrors.gender}
          required
        />
        <Textarea
          label="Reason for Visit"
          value={patientInfo.reason}
          onChange={(e) => updatePatientInfo('reason', e.target.value)}
          error={patientErrors.reason}
          placeholder="Describe your symptoms or reason for visit..."
          rows={3}
          required
        />
        <Textarea
          label="Additional Notes (Optional)"
          value={patientInfo.notes}
          onChange={(e) => updatePatientInfo('notes', e.target.value)}
          placeholder="Any additional information for the doctor..."
          rows={2}
        />
      </form>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-primary-600" />
          Confirm Your Appointment
        </h3>
        <p className="text-gray-500 mb-4">Review your appointment details before confirming</p>
      </div>

      <Card className="p-6 bg-gray-50">
        <h4 className="font-semibold text-gray-900 mb-4">Appointment Summary</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4 p-4 bg-white rounded-lg">
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{selectedDoctor?.name}</p>
              <p className="text-gray-500 text-sm">{selectedDoctor?.title}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Service</p>
              <p className="font-medium text-gray-900">{selectedService?.name}</p>
              <p className="text-gray-500 text-sm">{selectedService?.duration_minutes} min • {formatPrice(selectedService?.price)}</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Location</p>
              <p className="font-medium text-gray-900">{selectedClinic?.name}</p>
              <p className="text-gray-500 text-sm">{selectedClinic?.address}, {selectedClinic?.city}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Date</p>
              <p className="font-medium text-gray-900">{selectedDate ? format(selectedDate, 'EEEE, MMMM d, yyyy') : 'Not selected'}</p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <p className="text-sm text-gray-500 mb-1">Time</p>
              <p className="font-medium text-gray-900">{selectedTime || 'Not selected'}</p>
            </div>
          </div>

          <div className="p-4 bg-white rounded-lg border-t-2 border-primary-200">
            <p className="text-sm text-gray-500 mb-1">Patient</p>
            <p className="font-medium text-gray-900">{patientInfo.name}</p>
            <p className="text-gray-500 text-sm">{patientInfo.email} • {patientInfo.phone}</p>
          </div>
        </div>
      </Card>

      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
          <div>
            <p className="font-medium text-green-800">Ready to Book</p>
            <p className="text-green-700 text-sm">All details look good. Click confirm to finalize your appointment.</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      case 5: return renderStep5()
      case 6: return renderStep6()
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="container py-8 md:py-12">
          <div className="flex items-center justify-between">
            <div>
              <Link to="/" className="btn-ghost mb-4">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Link>
              <h1 className="heading-2 text-gray-900">Book Appointment</h1>
              <p className="text-gray-600 mt-1">Complete your booking in a few simple steps</p>
            </div>
            {currentStep > 1 && (
              <Button variant="ghost" onClick={() => { resetBooking(); setCurrentStep(1); }}>
                Start Over
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Progress */}
      <section className="bg-white border-b border-gray-100 py-4 sticky top-16 md:top-20 z-40">
        <div className="container">
          {renderMobileStepIndicator()}
          {renderStepIndicator()}
        </div>
      </section>

      {/* Form Content */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <Card className="p-6 md:p-8">
              {renderCurrentStep()}

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                
                {currentStep < 6 ? (
                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                  >
                    Next
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    size="lg"
                    onClick={() => setShowConfirmation(true)}
                    disabled={!canProceed()}
                  >
                    Confirm Appointment
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Confirmation Modal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showConfirmation ? 1 : 0 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 ${showConfirmation ? '' : 'hidden'}`}
        onClick={() => setShowConfirmation(false)}
        role="dialog"
        aria-modal="true"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-xl max-w-md w-full"
          onClick={e => e.stopPropagation()}
        >
          <div className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h3>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully booked. A confirmation email will be sent shortly.
            </p>
            
            <Card className="p-6 bg-gray-50 text-left mb-6">
              <p className="font-medium text-gray-900 mb-3">Appointment Details:</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Doctor</span>
                  <span className="font-medium">{selectedDoctor?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Location</span>
                  <span className="font-medium">{selectedClinic?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{selectedDate ? format(selectedDate, 'MMM d, yyyy') : 'TBD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{selectedTime || 'TBD'}</span>
                </div>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowConfirmation(false)}>
                Make Another Booking
              </Button>
              <Button className="flex-1" onClick={() => { resetBooking(); setCurrentStep(1); setShowConfirmation(false); }}>
                Done
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
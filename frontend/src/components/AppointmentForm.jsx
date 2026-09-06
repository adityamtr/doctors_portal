import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Calendar, Clock, User, Mail, Phone, MapPin, Stethoscope, Building2, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button, Input, Select, Textarea, Card, Badge, Modal } from './UI'
import { useAppointmentBooking } from '../context/AppointmentContext'
import { useCreateAppointment, useDoctorAvailability } from '../hooks/useApi'
import { format, parseISO, addDays, isBefore, startOfDay } from 'date-fns'
import { formatPrice } from '../utils/currency'

const validationSchema = yup.object().shape({
  name: yup.string().required('Full name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  phone: yup.string().required('Phone number is required').matches(/^[\d\s\-\+\(\)]{10,}$/, 'Invalid phone number'),
  dob: yup.string().required('Date of birth is required'),
  gender: yup.string().required('Please select gender'),
  reason: yup.string().required('Reason for visit is required').min(10, 'Please provide more details (at least 10 characters)'),
  notes: yup.string().optional(),
})

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
]

const timeSlotOptions = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30'
]

export function AppointmentForm({ onSuccess, onBack }) {
  const {
    selectedDoctor,
    selectedService,
    selectedClinic,
    selectedDate,
    selectedTime,
    patientInfo,
    updatePatientInfo,
    resetBooking,
  } = useAppointmentBooking()

  const { create: createAppointment, loading: submitting, error: submitError } = useCreateAppointment()
  const { check: checkAvailability, loading: checkingAvailability, slots: availableSlots } = useDoctorAvailability()

  const [currentStep, setCurrentStep] = useState(1)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [createdAppointment, setCreatedAppointment] = useState(null)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: patientInfo,
    mode: 'onChange',
  })

  const watchedValues = watch()

  // Update context when form values change
  useEffect(() => {
    Object.keys(watchedValues).forEach(key => {
      if (patientInfo[key] !== watchedValues[key]) {
        updatePatientInfo(key, watchedValues[key])
      }
    })
  }, [watchedValues, patientInfo, updatePatientInfo])

  // Check availability when doctor, clinic, or date changes
  useEffect(() => {
    if (selectedDoctor && selectedClinic && selectedDate) {
      const duration = selectedService?.duration_minutes || 30
      checkAvailability(selectedDoctor.id, selectedClinic.id, selectedDate, duration)
    }
  }, [selectedDoctor, selectedClinic, selectedDate, selectedService, checkAvailability])

  const isSlotAvailable = (time) => {
    const slot = availableSlots.find(s => s.start_time === time)
    return slot?.is_available ?? true
  }

  const handleDateSelect = (date) => {
    setValue('dob', format(date, 'yyyy-MM-dd'))
    // Could also update selectedDate in context
  }

  const handleTimeSelect = (time) => {
    if (isSlotAvailable(time)) {
      // Update selectedTime in context
    }
  }

  const onSubmit = async (data) => {
    if (!selectedDoctor || !selectedService || !selectedClinic || !selectedDate || !selectedTime) {
      return
    }

    try {
      const appointmentData = {
        patient_name: data.name,
        patient_email: data.email,
        patient_phone: data.phone,
        patient_dob: data.dob,
        patient_gender: data.gender,
        reason: data.reason,
        notes: data.notes,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        duration_minutes: selectedService.duration_minutes || 30,
        doctor_id: selectedDoctor.id,
        service_id: selectedService.id,
        clinic_id: selectedClinic.id,
      }

      const appointment = await createAppointment(appointmentData)
      setCreatedAppointment(appointment)
      setShowConfirmation(true)
      resetBooking()
    } catch (error) {
      console.error('Failed to create appointment:', error)
    }
  }

  const steps = [
    { number: 1, label: 'Details', icon: User },
    { number: 2, label: 'Date & Time', icon: Calendar },
    { number: 3, label: 'Patient Info', icon: User },
    { number: 4, label: 'Confirm', icon: Check },
  ]

  const renderStepIndicator = () => (
    <div className="hidden md:flex items-center justify-between mb-8 relative">
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
              <Check className="w-5 h-5" />
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
    <div className="md:hidden mb-6">
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
                <Check className="w-5 h-5" />
              ) : (
                step.number
              )}
            </div>
            <span className={`text-xs font-medium mt-1 ${currentStep >= step.number ? 'text-primary-600' : 'text-gray-400'}`}>
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
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Doctor</h3>
        {selectedDoctor ? (
          <Card className="p-4 bg-primary-50 border-primary-200">
            <div className="flex items-center gap-4">
              <img 
                src={selectedDoctor.profile_image} 
                alt={selectedDoctor.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="font-medium text-gray-900">{selectedDoctor.name}</p>
                <p className="text-primary-600 text-sm">{selectedDoctor.title}</p>
                <p className="text-gray-500 text-sm">{selectedDoctor.specialization}</p>
              </div>
              <Button variant="ghost" onClick={() => setCurrentStep(1)} className="ml-auto">
                Change
              </Button>
            </div>
          </Card>
        ) : (
          <p className="text-gray-500">Please select a doctor first</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Service</h3>
        {selectedService ? (
          <Card className="p-4 bg-primary-50 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{selectedService.name}</p>
                <p className="text-gray-500 text-sm">{selectedService.category} • {selectedService.duration_minutes} min</p>
              </div>
              <Button variant="ghost" onClick={() => setCurrentStep(1)}>Change</Button>
            </div>
          </Card>
        ) : (
          <p className="text-gray-500">Please select a service first</p>
        )}
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Clinic</h3>
        {selectedClinic ? (
          <Card className="p-4 bg-primary-50 border-primary-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{selectedClinic.name}</p>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedClinic.address}, {selectedClinic.city}
                </p>
              </div>
              <Button variant="ghost" onClick={() => setCurrentStep(1)}>Change</Button>
            </div>
          </Card>
        ) : (
          <p className="text-gray-500">Please select a clinic first</p>
        )}
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6 animate-fade-in">
      <div>
        <label className="label">Select Date</label>
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="date"
            min={format(startOfDay(new Date()), 'yyyy-MM-dd')}
            max={format(addDays(new Date(), 90), 'yyyy-MM-dd')}
            value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => {
              const date = e.target.value ? parseISO(e.target.value) : null
              // Update selectedDate in context
            }}
            className="input pl-10"
            required
          />
        </div>
        {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>}
      </div>

      {selectedDate && (
        <div>
          <label className="label">Select Time</label>
          <div className="grid grid-cols-4 gap-2">
            {timeSlotOptions.map((time) => (
              <button
                key={time}
                onClick={() => isSlotAvailable(time) && handleTimeSelect(time)}
                disabled={!isSlotAvailable(time)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedTime === time
                    ? 'bg-primary-600 text-white'
                    : isSlotAvailable(time)
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
          {checkingAvailability && <p className="mt-2 text-sm text-primary-600">Checking availability...</p>}
          {!checkingAvailability && availableSlots.length === 0 && (
            <p className="mt-2 text-sm text-gray-500">No available slots for this date</p>
          )}
        </div>
      )}
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6 animate-fade-in">
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          {...register('name')}
          error={errors.name?.message}
          placeholder="John Doe"
        />
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message}
          placeholder="john@example.com"
        />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Input
          label="Phone Number"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message}
          placeholder="(555) 123-4567"
        />
        <Input
          label="Date of Birth"
          type="date"
          max={format(addDays(new Date(), -1), 'yyyy-MM-dd')}
          {...register('dob')}
          error={errors.dob?.message}
        />
      </div>
      <Select
        label="Gender"
        options={genderOptions}
        {...register('gender')}
        error={errors.gender?.message}
      />
      <Textarea
        label="Reason for Visit"
        {...register('reason')}
        error={errors.reason?.message}
        placeholder="Describe your symptoms or reason for visit..."
        rows={3}
      />
      <Textarea
        label="Additional Notes (Optional)"
        {...register('notes')}
        placeholder="Any additional information for the doctor..."
        rows={2}
      />
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-6 bg-gray-50">
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
          <div className="flex justify-between">
            <span className="text-gray-500">Duration</span>
            <span className="font-medium">{selectedService?.duration_minutes} minutes</span>
          </div>
          {selectedService?.price && (
            <div className="flex justify-between border-t pt-3">
              <span className="text-gray-500">Estimated Cost</span>
              <span className="font-semibold text-primary-600">{formatPrice(selectedService.price)}</span>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-6 bg-gray-50">
        <h3 className="font-semibold text-gray-900 mb-4">Patient Information</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Name</span>
            <span className="font-medium">{watchedValues.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Email</span>
            <span className="font-medium">{watchedValues.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Phone</span>
            <span className="font-medium">{watchedValues.phone}</span>
          </div>
        </div>
      </Card>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      default: return null
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedDoctor && !!selectedService && !!selectedClinic
      case 2: return !!selectedDate && !!selectedTime
      case 3: return isValid
      case 4: return true
      default: return false
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Indicator */}
      {renderMobileStepIndicator()}
      {renderStepIndicator()}

      {/* Form Content */}
      <Card className="p-6 md:p-8">
        {renderCurrentStep()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          {currentStep < 4 ? (
            <Button
              type="submit"
              form="appointment-form"
              disabled={!canProceed() || submitting}
              loading={submitting}
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              form="appointment-form"
              disabled={submitting}
              loading={submitting}
              size="lg"
            >
              Confirm Appointment
              <Check className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </Card>

      {/* Hidden form for validation */}
      <form id="appointment-form" onSubmit={handleSubmit(onSubmit)} className="hidden">
        {/* Form fields are registered via useForm */}
      </form>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => {
          setShowConfirmation(false)
          onSuccess?.()
        }}
        title="Appointment Confirmed!"
        size="md"
      >
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Appointment Booked Successfully!</h3>
          <p className="text-gray-600 mb-6">
            Your appointment has been confirmed. A confirmation email has been sent to {createdAppointment?.patient_email}.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="font-medium text-gray-900">Appointment Details:</p>
            <p className="text-sm text-gray-600 mt-1">
              {createdAppointment?.doctor?.name} • {format(new Date(createdAppointment?.appointment_date), 'MMM d, yyyy')} at {createdAppointment?.appointment_time}
            </p>
            <p className="text-sm text-gray-600">
              {createdAppointment?.clinic?.name}, {createdAppointment?.clinic?.city}
            </p>
            <p className="text-sm text-gray-600">
              Confirmation #: {createdAppointment?.id}
            </p>
          </div>
          <Button onClick={() => { setShowConfirmation(false); onSuccess?.() }} className="w-full">
            Done
          </Button>
        </div>
      </Modal>
    </div>
  )
}
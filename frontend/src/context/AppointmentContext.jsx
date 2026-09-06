import { createContext, useContext, useState, useCallback } from 'react'

const AppointmentContext = createContext(null)

export function AppointmentProvider({ children }) {
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [selectedClinic, setSelectedClinic] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    reason: '',
    notes: '',
  })

  const resetBooking = useCallback(() => {
    setSelectedDoctor(null)
    setSelectedService(null)
    setSelectedClinic(null)
    setSelectedDate(null)
    setSelectedTime(null)
    setPatientInfo({
      name: '',
      email: '',
      phone: '',
      dob: '',
      gender: '',
      reason: '',
      notes: '',
    })
  }, [])

  const updatePatientInfo = useCallback((field, value) => {
    setPatientInfo(prev => ({ ...prev, [field]: value }))
  }, [])

  const value = {
    selectedDoctor,
    setSelectedDoctor,
    selectedService,
    setSelectedService,
    selectedClinic,
    setSelectedClinic,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    patientInfo,
    updatePatientInfo,
    resetBooking,
  }

  return (
    <AppointmentContext.Provider value={value}>
      {children}
    </AppointmentContext.Provider>
  )
}

export function useAppointmentBooking() {
  const context = useContext(AppointmentContext)
  if (!context) {
    throw new Error('useAppointmentBooking must be used within an AppointmentProvider')
  }
  return context
}
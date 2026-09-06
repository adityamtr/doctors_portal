import { useState, useEffect, useCallback, useRef } from 'react'
import { doctorApi, serviceApi, clinicApi, appointmentApi, scheduleApi } from '../services/api'

// Generic hook for fetching data
export function useFetch(fetchFn, params = {}, immediate = true) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(immediate)
  const [error, setError] = useState(null)

  // Stabilize params to prevent unnecessary re-fetches
  const paramsRef = useRef(params)
  const paramsKey = JSON.stringify(params)
  
  // Only update ref if params actually changed
  useEffect(() => {
    paramsRef.current = params
  }, [paramsKey])

  const execute = useCallback(async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchFn(...args)
      setData(response.data)
      return response.data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }, [fetchFn])

  useEffect(() => {
    if (immediate) {
      execute(paramsRef.current)
    }
  }, [execute, immediate, paramsKey])

  return { data, loading, error, execute, refetch: () => execute(paramsRef.current) }
}

// Doctor hooks
export function useDoctors(params = {}) {
  return useFetch(doctorApi.getAll, params)
}

export function useDoctor(id) {
  return useFetch(doctorApi.getById, id, !!id)
}

// Service hooks
export function useServices(params = {}) {
  return useFetch(serviceApi.getAll, params)
}

export function useService(id) {
  return useFetch(serviceApi.getById, id, !!id)
}

// Clinic hooks
export function useClinics(params = {}) {
  return useFetch(clinicApi.getAll, params)
}

export function useClinic(id) {
  return useFetch(clinicApi.getById, id, !!id)
}

// Appointment hooks
export function useAppointments(params = {}) {
  return useFetch(appointmentApi.getAll, params)
}

export function useAppointment(id) {
  return useFetch(appointmentApi.getById, id, !!id)
}

export function useCreateAppointment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const create = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const response = await appointmentApi.create(data)
      return response.data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { create, loading, error }
}

export function useCheckAvailability() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [slots, setSlots] = useState([])

  const check = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const response = await appointmentApi.checkAvailability(data)
      setSlots(response.data)
      return response.data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { check, loading, error, slots }
}

export function useDoctorAvailability() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [slots, setSlots] = useState([])

  const check = async (doctorId, clinicId, date, duration = 30) => {
    setLoading(true)
    setError(null)
    try {
      const response = await appointmentApi.getDoctorAvailability(doctorId, clinicId, date, duration)
      setSlots(response.data)
      return response.data
    } catch (err) {
      setError(err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { check, loading, error, slots }
}

// Schedule hooks
export function useSchedules(params = {}) {
  return useFetch(scheduleApi.getAll, params)
}
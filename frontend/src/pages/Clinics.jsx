import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X, MapPin, Phone, Mail, Clock, CheckCircle } from 'lucide-react'
import { Button, Input, Select, Card, Badge } from '../components/UI'
import { ClinicCard } from '../components/ClinicCard'
import { useClinics, useDoctor } from '../hooks/useApi'

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'city', label: 'City' },
  { value: 'distance', label: 'Distance (Nearest First)' },
]

export function Clinics() {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedClinic, setSelectedClinic] = useState(null)

  // Single doctor - get doctor info for filtering clinics
  const { data: doctor } = useDoctor(1)

  const { data: clinics, loading, error, refetch } = useClinics({
    is_active: true,
  })

  // Filter clinics to only show those where the doctor has schedules
  const filteredClinics = useMemo(() => {
    if (!clinics) return []
    
    let result = [...clinics]
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(clinic => 
        clinic.name.toLowerCase().includes(query) ||
        clinic.city.toLowerCase().includes(query) ||
        clinic.state.toLowerCase().includes(query) ||
        clinic.address.toLowerCase().includes(query)
      )
    }
    
    // Filter to only clinics where doctor has schedules
    // In a real app, this would check doctor schedules at each clinic
    // For now, show all active clinics
    // result = result.filter(clinic => clinic.doctorIds?.includes(doctor.id) || clinic.schedules?.length > 0)
    
    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'city':
        result.sort((a, b) => a.city.localeCompare(b.city))
        break
      case 'distance':
        // Mock distance sort - in real app would use geolocation
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }
    
    return result
  }, [clinics, searchQuery, sortBy])

  // Compute available cities from filtered clinics
  const cities = useMemo(() => {
    if (!clinics) return ['All']
    const cityList = [...new Set(clinics.map(c => c.city))]
    return ['All', ...cityList.sort()]
  }, [clinics])

  // No city filter - show all clinics for this doctor
  const activeFilters = []

  const clearFilters = () => {
    setSearchQuery('')
    setSortBy('name')
  }

  const today = new Date().getDay()
  const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  const getTodayHours = (clinic) => {
    const hoursMap = {
      0: clinic.hours_monday,
      1: clinic.hours_tuesday,
      2: clinic.hours_wednesday,
      3: clinic.hours_thursday,
      4: clinic.hours_friday,
      5: clinic.hours_saturday,
      6: clinic.hours_sunday,
    }
    return hoursMap[today] || 'Closed'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="container py-12 md:py-16">
          <div className="max-w-3xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="heading-1 text-gray-900 mb-4"
            >
              Dr. Sarah Johnson's <span className="text-primary-600">Clinic Locations</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-body text-gray-600"
            >
              Clinics where Dr. Sarah Johnson practices, with flexible hours to fit your schedule.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search clinics by name, city, or address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="input pl-10 pr-32 appearance-none bg-no-repeat bg-right"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundSize: '1.5rem 1.5rem',
                    backgroundPosition: 'right 0.5rem center'
                  }}
                >
                  {cities.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="relative hidden sm:block">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="input pr-32 appearance-none bg-no-repeat bg-right"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundSize: '1.5rem 1.5rem',
                    backgroundPosition: 'right 0.5rem center'
                  }}
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn-outline flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filters
                {activeFilters.length > 0 && (
                  <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                    {activeFilters.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Filters */}
          {(activeFilters.length > 0 || searchQuery) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 flex flex-wrap items-center gap-2"
            >
              {searchQuery && (
                <Badge variant="outline" className="flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {activeFilters.map(filter => (
                <Badge key={filter} variant="primary" className="flex items-center gap-1">
                  {filter}
                  <button onClick={() => setSelectedCity('All')}>
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {(activeFilters.length > 0 || searchQuery) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
            </motion.div>
          )}

          {/* Mobile Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="lg:hidden mt-4 pt-4 border-t border-gray-100"
            >
              <div className="space-y-4">
                <div>
                  <label className="label">City</label>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="input"
                  >
                    {cities.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="input"
                  >
                    {sortOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <Button variant="outline" onClick={clearFilters} className="w-full">
                  Clear All Filters
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `Found ${filteredClinics.length} clinic${filteredClinics.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </motion.div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load clinics</h3>
              <p className="text-gray-500 mb-4">Please try again later.</p>
              <Button onClick={refetch}>Retry</Button>
            </div>
          ) : filteredClinics.length > 0 ? (
            <>
              {/* Map View Toggle */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">View:</span>
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button className="px-3 py-1.5 rounded text-sm font-medium text-primary-600 bg-white shadow-sm">
                      List
                    </button>
                    <button className="px-3 py-1.5 rounded text-sm font-medium text-gray-500 hover:text-gray-700">
                      Map
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredClinics.map((clinic, index) => (
                  <motion.div
                    key={clinic.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ClinicCard clinic={clinic} />
                  </motion.div>
                ))}
              </div>

              {/* Load More - placeholder for pagination */}
              {filteredClinics.length >= 12 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Locations
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <MapPinIcon className="w-10 h-10 text-gray-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No clinics found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your search or filters to find available locations.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Selected Clinic Details Modal */}
          {selectedClinic && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
              onClick={() => setSelectedClinic(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedClinic.name}</h2>
                      <p className="text-gray-500 mt-1">{selectedClinic.city}, {selectedClinic.state}</p>
                    </div>
                    <button
                      onClick={() => setSelectedClinic(null)}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Address */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                      <MapPinIcon className="w-6 h-6 text-primary-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-gray-900">Address</h3>
                        <p className="text-gray-600 mt-1">{selectedClinic.address}, {selectedClinic.city}, {selectedClinic.state} {selectedClinic.zip_code}</p>
                      </div>
                    </div>

                    {/* Contact */}
                    <div className="grid grid-cols-2 gap-4">
                      {selectedClinic.phone && (
                        <a href={`tel:${selectedClinic.phone}`} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <Phone className="w-6 h-6 text-primary-600" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium text-gray-900">{selectedClinic.phone}</p>
                          </div>
                        </a>
                      )}
                      {selectedClinic.email && (
                        <a href={`mailto:${selectedClinic.email}`} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                          <Mail className="w-6 h-6 text-primary-600" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium text-gray-900">{selectedClinic.email}</p>
                          </div>
                        </a>
                      )}
                    </div>

                    {/* Hours */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-4">Weekly Hours</h3>
                      <div className="space-y-2">
                        {dayLabels.map((day, index) => {
                          const hours = selectedClinic[`hours_${day.toLowerCase()}`]
                          const isToday = index === today
                          return hours ? (
                            <div key={day} className={`flex justify-between p-3 rounded-lg ${isToday ? 'bg-primary-50 border border-primary-200' : 'bg-gray-50'}`}>
                              <span className={`font-medium ${isToday ? 'text-primary-700' : 'text-gray-700'}`}>
                                {day} {isToday && <span className="ml-2 text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded">Today</span>}
                              </span>
                              <span className={`font-medium ${isToday ? 'text-primary-600' : 'text-gray-600'}`}>
                                {hours}
                              </span>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                      <Button variant="outline" className="flex-1" onClick={() => setSelectedClinic(null)}>
                        <Navigation className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                      <Button className="flex-1" onClick={() => { setSelectedClinic(null); window.location.href = '/book-appointment' }}>
                        <Building2 className="w-4 h-4 mr-2" />
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container text-center">
          <h2 className="heading-2 text-white mb-4">Can't Find a Location Near You?</h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            We're expanding our network. Contact us to learn about upcoming locations or virtual care options.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="tel:+1-555-0100" className="btn-secondary px-8 py-3">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call Us: (555) 010-0000
            </a>
            <a href="mailto:info@doctorsportal.com" className="btn-outline border-white text-white hover:bg-white/10 px-8 py-3">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
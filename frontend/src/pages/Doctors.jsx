import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X, Stethoscope, MapPin, Clock, Star, ChevronDown } from 'lucide-react'
import { Button, Input, Select, Card, Badge } from '../components/UI'
import { DoctorCard } from '../components/DoctorCard'
import { useDoctors } from '../hooks/useApi'

const specialties = [
  'All', 'Cardiology', 'Pediatrics', 'Dermatology', 
  'Orthopedics', 'OB/GYN', 'Neurology', 'Oncology', 
  'Psychiatry', 'Radiology'
]

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'experience', label: 'Experience (High-Low)' },
  { value: 'rating', label: 'Rating (High-Low)' },
  { value: 'availability', label: 'Availability' },
]

export function Doctors() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)

  const { data: doctors, loading, error, refetch } = useDoctors({
    specialization: selectedSpecialty !== 'All' ? selectedSpecialty : undefined,
    is_active: true,
  })

  const filteredDoctors = useMemo(() => {
    if (!doctors) return []
    
    let result = [...doctors]
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(doctor => 
        doctor.name.toLowerCase().includes(query) ||
        doctor.specialization.toLowerCase().includes(query) ||
        doctor.title.toLowerCase().includes(query) ||
        (doctor.bio && doctor.bio.toLowerCase().includes(query))
      )
    }
    
    // Sort
    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'experience':
        result.sort((a, b) => b.experience_years - a.experience_years)
        break
      case 'rating':
        // Mock rating sort - in real app, would use actual ratings
        result.sort((a, b) => b.experience_years - a.experience_years)
        break
      case 'availability':
        result.sort((a, b) => (b.is_active === a.is_active ? 0 : b.is_active ? -1 : 1))
        break
      default:
        break
    }
    
    return result
  }, [doctors, searchQuery, sortBy])

  const activeFilters = []
  if (selectedSpecialty !== 'All') activeFilters.push(selectedSpecialty)

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedSpecialty('All')
    setSortBy('name')
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
              Find Your <span className="text-primary-600">Perfect Doctor</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-body text-gray-600"
            >
              Browse our network of board-certified specialists. Filter by specialty, search by name, and book appointments instantly.
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
                placeholder="Search doctors by name, specialty, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="input pl-10 pr-32 appearance-none bg-no-repeat bg-right"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundSize: '1.5rem 1.5rem',
                    backgroundPosition: 'right 0.5rem center'
                  }}
                >
                  {specialties.map(s => (
                    <option key={s} value={s}>{s}</option>
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
                  <button onClick={() => setSelectedSpecialty('All')}>
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
                  <label className="label">Specialty</label>
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="input"
                  >
                    {specialties.map(s => (
                      <option key={s} value={s}>{s}</option>
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
              {loading ? 'Loading...' : `Found ${filteredDoctors.length} doctor${filteredDoctors.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load doctors</h3>
              <p className="text-gray-500 mb-4">Please try again later.</p>
              <Button onClick={refetch}>Retry</Button>
            </div>
          ) : filteredDoctors.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <DoctorCard doctor={doctor} />
                  </motion.div>
                ))}
              </div>

              {/* Load More - placeholder for pagination */}
              {filteredDoctors.length >= 12 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Doctors
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
                <Stethoscope className="w-10 h-10 text-gray-400" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your search or filters to find available doctors.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container text-center">
          <h2 className="heading-2 text-white mb-4">Can't Find What You're Looking For?</h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            Our team can help you find the right specialist. Contact us for personalized assistance.
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
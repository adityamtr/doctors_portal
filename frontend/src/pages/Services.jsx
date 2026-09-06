import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, X, Heart, Baby, Sparkles, Bone, User, Stethoscope, Tag, Clock } from 'lucide-react'
import { Button, Input, Select, Card, Badge } from '../components/UI'
import { ServiceCard } from '../components/ServiceCard'
import { useServices, useDoctor } from '../hooks/useApi'

const sortOptions = [
  { value: 'name', label: 'Name (A-Z)' },
  { value: 'category', label: 'Category' },
  { value: 'price_low', label: 'Price (Low-High)' },
  { value: 'price_high', label: 'Price (High-Low)' },
  { value: 'duration', label: 'Duration (Short-Long)' },
]

const categoryIcons = {
  Cardiology: Heart,
  Pediatrics: Baby,
  Dermatology: Sparkles,
  Orthopedics: Bone,
  'OB/GYN': User,
  Neurology: Stethoscope,
  Oncology: Heart,
  Psychiatry: Sparkles,
  Radiology: Stethoscope,
  Consultation: Stethoscope,
  Diagnostic: Stethoscope,
  Treatment: Heart,
}

const categoryColors = {
  Cardiology: 'bg-red-100 text-red-700',
  Pediatrics: 'bg-blue-100 text-blue-700',
  Dermatology: 'bg-pink-100 text-pink-700',
  Orthopedics: 'bg-green-100 text-green-700',
  'OB/GYN': 'bg-purple-100 text-purple-700',
  Neurology: 'bg-indigo-100 text-indigo-700',
  Oncology: 'bg-red-100 text-red-700',
  Psychiatry: 'bg-pink-100 text-pink-700',
  Radiology: 'bg-blue-100 text-blue-700',
  Consultation: 'bg-primary-100 text-primary-700',
  Diagnostic: 'bg-secondary-100 text-secondary-700',
  Treatment: 'bg-green-100 text-green-700',
}

export function Services() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [sortBy, setSortBy] = useState('name')
  const [showFilters, setShowFilters] = useState(false)

  // Single doctor - filter services by doctor's specialization
  const { data: doctor } = useDoctor(1)
  const { data: services, loading, error, refetch } = useServices({
    specialization: doctor?.specialization,
    is_active: true,
  })

  const filteredServices = useMemo(() => {
    if (!services) return []

    let result = [...services]

    if (selectedCategory !== 'All') {
      result = result.filter(service => service.category === selectedCategory)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(service => 
        service.name.toLowerCase().includes(query) ||
        service.category.toLowerCase().includes(query) ||
        (service.description && service.description.toLowerCase().includes(query))
      )
    }

    switch (sortBy) {
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'category':
        result.sort((a, b) => a.category.localeCompare(b.category))
        break
      case 'price_low':
        result.sort((a, b) => (a.price || 0) - (b.price || 0))
        break
      case 'price_high':
        result.sort((a, b) => (b.price || 0) - (a.price || 0))
        break
      case 'duration':
        result.sort((a, b) => a.duration_minutes - b.duration_minutes)
        break
      default:
        break
    }

    return result
  }, [services, searchQuery, selectedCategory, sortBy])

  const categoriesWithServices = useMemo(() => {
    if (!services) return ['All']
    const cats = [...new Set(services.map(s => s.category))]
    return ['All', ...cats.sort()]
  }, [services])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All')
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
              Our Medical <span className="text-primary-600">Services</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-body text-gray-600"
            >
              {doctor?.specialization || 'Medical'} services offered by {doctor?.name || 'your doctor'}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-white border-b border-gray-100 sticky top-16 md:top-20 z-40">
        <div className="container py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 pr-4"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input pr-10 appearance-none bg-no-repeat bg-right"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundSize: '1.5rem 1.5rem',
                  backgroundPosition: 'right 0.5rem center',
                }}
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

          {/* Active Filters */}
          {(searchQuery || selectedCategory !== 'All') && (
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
              {selectedCategory !== 'All' && (
                <Badge variant="primary" className="flex items-center gap-1">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('All')} className="ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
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
        
      </section>

      {/* Results */}
      <section className="py-8 md:py-12">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-600">
              {loading ? 'Loading...' : `Showing ${filteredServices.length} service${filteredServices.length !== 1 ? 's' : ''}`}
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
              <h3 className="text-lg font-medium text-gray-900 mb-2">Failed to load services</h3>
              <p className="text-gray-500 mb-4">Please try again later.</p>
              <Button onClick={refetch}>Retry</Button>
            </div>
          ) : filteredServices.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <ServiceCard service={service} />
                  </motion.div>
                ))}
              </div>

              {/* Load More - placeholder for pagination */}
              {filteredServices.length >= 12 && (
                <div className="text-center mt-12">
                  <Button variant="outline" size="lg">
                    Load More Services
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-500 mb-6 max-w-md mx-auto">
                Try adjusting your search or filters to find available services.
              </p>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* Category Summary */}
          {!loading && !error && services && services.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-16"
            >
              <h2 className="heading-3 text-gray-900 mb-8 text-center">Services by Category</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {categoriesWithServices.filter(c => c !== 'All').map(category => {
                  const catServices = services.filter(s => s.category === category)
                  const Icon = categoryIcons[category] || Stethoscope
                  const badgeClass = categoryColors[category] || 'bg-gray-100 text-gray-700'
                  
                  return (
                    <Card key={category} className="p-6 text-center hover:shadow-lg transition-shadow">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: badgeClass.replace('bg-', '').replace(' text-', '') + '20' }}>
                        <Icon className="w-8 h-8" style={{ color: badgeClass.replace('bg-', '').replace(' text-', '') }} />
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{category}</h3>
                      <p className="text-gray-500 text-sm mb-4">{catServices.length} service{catServices.length !== 1 ? 's' : ''}</p>
                      <Button variant="outline" size="sm" onClick={() => setSelectedCategory(category)}>
                        View Services
                      </Button>
                    </Card>
                  )
                })}
              </div>
            </motion.section>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="container text-center">
          <h2 className="heading-2 text-white mb-4">Need Help Choosing a Service?</h2>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
            Our care coordinators can help you find the right service for your needs. Contact us for personalized guidance.
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
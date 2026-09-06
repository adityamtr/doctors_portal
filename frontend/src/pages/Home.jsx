import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Stethoscope, Heart, Award, Clock, MapPin, Shield, ArrowRight, CheckCircle, GraduationCap, User, Calendar, Phone, Mail } from 'lucide-react'
import { Button, Card, Badge } from '../components/UI'
import { useDoctor, useServices, useClinics } from '../hooks/useApi'

const features = [
  { icon: Heart, title: 'Patient-Centered Care', description: 'Every decision puts you first. We listen, understand, and provide personalized care tailored to your needs.' },
  { icon: Clock, title: 'Easy Online Booking', description: 'Book appointments 24/7 with real-time availability. No phone calls or waiting on hold required.' },
  { icon: MapPin, title: 'Convenient Locations', description: 'Multiple clinic locations with flexible hours to fit your busy schedule.' },
  { icon: Shield, title: 'Secure & Private', description: 'Your health information is protected with enterprise-grade security and HIPAA compliance.' },
]

export function Home() {
  const { data: doctor, loading: doctorLoading } = useDoctor(1)
  const { data: services, loading: servicesLoading } = useServices({ is_active: true })
  const { data: clinics, loading: clinicsLoading } = useClinics({ is_active: true })

  // Filter services for this doctor's specialization
  const doctorServices = services?.filter(s => 
    s.category.toLowerCase().includes(doctor?.specialization?.toLowerCase()) ||
    doctor?.specialization?.toLowerCase().includes(s.category.toLowerCase())
  ) || []

  // Compute stats for this doctor
  const doctorClinicsCount = clinics?.length || 0
  const stats = [
    { value: '1', label: 'Doctor' },
    { value: doctorServices.length, label: 'Services' },
    { value: '500+', label: 'Happy Patients' },
    { value: doctorClinicsCount, label: 'Locations' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary-50 via-white to-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%230ea5e9%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 36v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        
        <div className="container relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-8"
            >
              <Badge variant="primary" className="text-lg px-4 py-2 mb-6">
                <span className="relative flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Now Accepting New Patients
                </span>
              </Badge>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="heading-1 text-gray-900 mb-6 text-balance"
            >
              Your Health, {doctor?.name ? `${doctor?.name}'s` : 'Dr. Sarah Johnson'}'s Priority
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-body text-gray-600 max-w-2xl mx-auto mb-10"
            >
              Expert cardiology care from Dr. Sarah Johnson, MD, FACC. Board-certified with 15+ years of experience in preventive cardiology and heart health management.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link to="/book-appointment">
                <Button size="lg" className="w-full sm:w-auto px-10 py-4 text-lg">
                  Book Appointment
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to="/doctor">
                <Button variant="outline" size="lg" className="w-full sm:w-auto px-10 py-4 text-lg">
                  Meet Dr. Johnson
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Doctor Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="heading-2 text-gray-900 mb-4">Why Choose Dr. Sarah Johnson?</h2>
            <p className="text-body text-gray-600">
              Board-certified cardiologist dedicated to providing exceptional, personalized heart care.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card p-8 text-center h-full"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="heading-3 text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About the Doctor Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center gap-12">
            <div className="md:w-1/3 flex-shrink-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="aspect-square max-w-xs mx-auto md:mx-0">
                  <div className="w-full h-full bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%230ea5e9%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 36v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
                    <div className="relative z-10 text-center p-8">
                      <Stethoscope className="w-24 h-24 text-primary-200 mx-auto mb-6" />
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Dr. Sarah Johnson</h3>
                      <p className="text-primary-600 font-medium">MD, FACC - Cardiologist</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            <div className="md:w-2/3">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="heading-2 text-gray-900 mb-6">Meet Dr. Sarah Johnson</h2>
                <div className="prose prose-gray max-w-none space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    Dr. Sarah Johnson is a board-certified cardiologist with over 15 years of experience in treating heart conditions. 
                    She specializes in preventive cardiology, heart failure management, and interventional procedures. 
                    Dr. Johnson is dedicated to providing compassionate, evidence-based care to all patients.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    She received her MD from Harvard Medical School, completed her residency at Johns Hopkins Hospital, 
                    and fellowship in Cardiology at Mayo Clinic. Dr. Johnson is certified by the American Board of Internal Medicine 
                    in both Cardiovascular Disease and Internal Medicine.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Dr. Johnson speaks English, Spanish, and French, and is committed to making quality cardiac care 
                    accessible to diverse communities.
                  </p>
                </div>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/doctor">
                    <Button variant="outline" className="px-6 py-3">
                      <User className="w-4 h-4 mr-2" />
                      View Full Profile
                    </Button>
                  </Link>
                  <Link to="/book-appointment">
                    <Button className="px-6 py-3">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="heading-2 text-gray-900 mb-4">Cardiology Services</h2>
              <p className="text-body text-gray-600">Comprehensive heart care services tailored to your cardiovascular health needs.</p>
            </div>
            <Link to="/services" className="btn-outline mt-4 md:mt-0">
              View All Services
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {servicesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : doctorServices.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {doctorServices.slice(0, 6).map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="card-hover p-6 h-full">
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
                        <span className="font-semibold text-gray-900">${(service.price / 100).toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services available</h3>
              <p className="text-gray-500">Check back soon for available services.</p>
            </div>
          )}
        </div>
      </section>

      {/* Clinic Locations Section */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <h2 className="heading-2 text-gray-900 mb-4">Clinic Locations</h2>
              <p className="text-body text-gray-600">Visit Dr. Johnson at one of these convenient locations.</p>
            </div>
            <Link to="/clinics" className="btn-outline mt-4 md:mt-0">
              View All Locations
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          {clinicsLoading ? (
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
              ))}
            </div>
          ) : clinics && clinics.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              {clinics.map((clinic, index) => (
                <motion.div
                  key={clinic.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <div className="card-hover p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-xl text-gray-900">{clinic.name}</h3>
                        <p className="text-gray-500 mt-1">{clinic.city}, {clinic.state}</p>
                      </div>
                      <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                        <MapPin className="w-6 h-6 text-primary-600" />
                      </div>
                    </div>
                    <p className="text-gray-600 mb-4">{clinic.address}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      {clinic.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          {clinic.phone}
                        </span>
                      )}
                    </div>
                    <Link to="/book-appointment" className="btn-primary w-full text-center">
                      Book at This Location
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No locations available</h3>
              <p className="text-gray-500">Check back soon for clinic locations.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section bg-primary-600">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 text-white mb-4">Ready to Book Your Appointment?</h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
              Take the first step towards better heart health. Book an appointment with Dr. Sarah Johnson today.
            </p>
            <Link to="/book-appointment">
              <Button variant="secondary" size="xl" className="px-12 py-4">
                Book Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="section bg-white border-t border-gray-100">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-4">
              <Award className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Board Certified</h3>
              <p className="text-sm text-gray-500 mt-1">American Board of Internal Medicine</p>
            </div>
            <div className="p-4">
              <GraduationCap className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Harvard & Mayo Clinic Trained</h3>
              <p className="text-sm text-gray-500 mt-1">Top-tier medical education</p>
            </div>
            <div className="p-4">
              <Shield className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">HIPAA Compliant</h3>
              <p className="text-sm text-gray-500 mt-1">Your data is secure & private</p>
            </div>
            <div className="p-4">
              <CheckCircle className="w-10 h-10 text-primary-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Insurance Accepted</h3>
              <p className="text-sm text-gray-500 mt-1">Most major insurance plans</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
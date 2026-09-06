import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Loader2, Building2, Stethoscope, User, MessageSquare } from 'lucide-react'
import { Button, Input, Textarea, Select, Card, Badge } from '../components/UI'

const contactSchema = yup.object().shape({
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').email('Invalid email address'),
  phone: yup.string().optional().matches(/^[\d\s\-\+\(\)]{10,}$/, 'Invalid phone number'),
  subject: yup.string().required('Please select a subject'),
  message: yup.string().required('Message is required').min(20, 'Message must be at least 20 characters'),
})

const subjectOptions = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'appointment', label: 'Appointment Questions' },
  { value: 'billing', label: 'Billing & Insurance' },
  { value: 'medical_records', label: 'Medical Records' },
  { value: 'feedback', label: 'Feedback & Complaints' },
  { value: 'partnership', label: 'Partnership Opportunities' },
  { value: 'careers', label: 'Career Opportunities' },
  { value: 'other', label: 'Other' },
]

const faqs = [
  {
    question: 'How do I book an appointment?',
    answer: 'You can book an appointment online through our website by clicking "Book Appointment" in the navigation. You\'ll be guided through selecting a doctor, service, location, date, and time. You can also call us at (555) 010-0000 to book by phone.'
  },
  {
    question: 'What insurance plans do you accept?',
    answer: 'We accept most major insurance plans including Medicare, Medicaid, Blue Cross Blue Shield, Aetna, Cigna, UnitedHealthcare, and many others. Please contact our billing department or your insurance provider to verify your specific coverage.'
  },
  {
    question: 'Can I reschedule or cancel my appointment?',
    answer: 'Yes, you can reschedule or cancel your appointment up to 24 hours before your scheduled time without any fee. Please log into your account or call the clinic directly. Late cancellations (less than 24 hours) may incur a fee.'
  },
  {
    question: 'Do you offer telehealth appointments?',
    answer: 'Yes, we offer telehealth appointments for many services. When booking, you can select "Virtual Visit" as the appointment type if available for your chosen service and doctor.'
  },
  {
    question: 'What should I bring to my first appointment?',
    answer: 'Please bring a valid photo ID, your insurance card, a list of current medications, any relevant medical records or test results, and your completed new patient forms (available on our website).'
  },
  {
    question: 'How do I access my medical records?',
    answer: 'You can access your medical records through our patient portal. If you need assistance, please contact our medical records department at records@doctorsportal.com or call (555) 010-0000.'
  },
]

const clinicContacts = [
  {
    name: 'Downtown Medical Center',
    address: '123 Main Street, Suite 400, New York, NY 10001',
    phone: '+1 (212) 555-0100',
    email: 'downtown@doctorsportal.com',
    hours: 'Mon-Fri: 8AM-6PM, Sat: 9AM-1PM',
  },
]

export function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null
  const [expandedFaq, setExpandedFaq] = useState(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(contactSchema),
    mode: 'onChange',
  })

  const onSubmit = async (data) => {
    setIsSubmitting(true)
    setSubmitStatus(null)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSubmitStatus('success')
      reset()
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary-50 via-white to-white py-20 md:py-32">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Badge variant="primary" className="text-lg px-4 py-2 mb-6">
                Contact Us
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="heading-1 text-gray-900 mb-6 text-balance"
            >
              We\'d Love to <span className="text-primary-600">Hear From You</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-body text-gray-600 max-w-2xl mx-auto"
            >
              Have questions? Need assistance? Our team is here to help. 
              Reach out through any of the channels below and we\'ll get back to you as soon as possible.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="section bg-white -mt-16 md:-mt-24">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: MapPin, title: 'Visit Us', color: 'bg-red-100 text-red-600', items: clinicContacts.map(c => `${c.name}: ${c.address}`) },
              { icon: Phone, title: 'Call Us', color: 'bg-green-100 text-green-600', items: ['Main: (555) 010-0000', 'Appointments: (555) 010-0001'] },
              { icon: Mail, title: 'Email Us', color: 'bg-blue-100 text-blue-600', items: ['General: info@doctorsportal.com', 'Appointments: appointments@doctorsportal.com'] },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 h-full"
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${card.color}`}>
                  <card.icon className="w-7 h-7" />
                </div>
                <h3 className="heading-3 text-gray-900 mb-4">{card.title}</h3>
                <div className="space-y-3 text-gray-600">
                  {card.items.map((item, i) => (
                    <p key={i} className="text-sm">{item}</p>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Clinic Locations */}
          <div className="grid md:grid-cols-3 gap-6">
            {clinicContacts.map((clinic, index) => (
              <motion.div
                key={clinic.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <Building2 className="w-10 h-10 text-primary-600 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-gray-900">{clinic.name}</h4>
                    <p className="text-gray-500 text-sm mt-1">{clinic.address}</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <a href={`tel:${clinic.phone}`} className="hover:text-primary-600">{clinic.phone}</a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <a href={`mailto:${clinic.email}`} className="hover:text-primary-600">{clinic.email}</a>
                  </div>
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="w-5 h-5 text-primary-600 flex-shrink-0" />
                    <span>{clinic.hours}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="section bg-gray-50 pb-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <Card className="p-6 md:p-8">
                <h2 className="heading-3 text-gray-900 mb-2">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">Fill out the form below and we\'ll get back to you within 24 hours.</p>

                {submitStatus === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3"
                  >
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-green-800">Message Sent Successfully!</p>
                      <p className="text-green-700 text-sm">Thank you for reaching out. We\'ll respond within 24 hours.</p>
                    </div>
                  </motion.div>
                )}

                {submitStatus === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3"
                  >
                    <svg className="w-6 h-6 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="font-medium text-red-800">Something Went Wrong</p>
                      <p className="text-red-700 text-sm">Please try again later or call us directly.</p>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      {...register('name')}
                      error={errors.name?.message}
                      placeholder="John Doe"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      {...register('email')}
                      error={errors.email?.message}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number (Optional)"
                      type="tel"
                      {...register('phone')}
                      error={errors.phone?.message}
                      placeholder="(555) 123-4567"
                    />
                    <Select
                      label="Subject"
                      options={subjectOptions}
                      {...register('subject')}
                      error={errors.subject?.message}
                    />
                  </div>
                  <Textarea
                    label="Message"
                    {...register('message')}
                    error={errors.message?.message}
                    placeholder="Please describe your inquiry in detail..."
                    rows={5}
                  />
                  <Button type="submit" disabled={isSubmitting} loading={isSubmitting} className="w-full md:w-auto" size="lg">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>

            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-6 md:p-8 h-full">
                <h2 className="heading-3 text-gray-900 mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                        <svg
                          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {expandedFaq === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6"
                        >
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Office Hours */}
      <section className="bg-white border-t border-gray-100 py-16">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="heading-2 text-gray-900 mb-4">Office Hours</h2>
            <p className="text-body text-gray-600">Our main office hours for general inquiries and support.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { day: 'Monday - Friday', hours: '8:00 AM - 6:00 PM', icon: Clock },
              { day: 'Saturday', hours: '9:00 AM - 2:00 PM', icon: Clock },
              { day: 'Sunday', hours: 'Closed', icon: Clock },
              { day: 'Holidays', hours: 'Varies by location', icon: Calendar },
            ].map((item, index) => (
              <motion.div
                key={item.day}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <item.icon className="w-10 h-10 text-primary-600 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4" />
                <h3 className="font-semibold text-gray-900 mb-2">{item.day}</h3>
                <p className="text-gray-600">{item.hours}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-primary-600">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="heading-2 text-white mb-4">Need Immediate Assistance?</h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto mb-8">
              For urgent medical concerns, please call 911 or visit your nearest emergency room. 
              For appointment-related questions, our team is available during business hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="tel:+1-555-0100" className="btn-secondary px-8 py-3">
                <Phone className="w-5 h-5 mr-2" />
                Call Now: (555) 010-0000
              </a>
              <a href="/book-appointment" className="btn-outline border-white text-white hover:bg-white/10 px-8 py-3">
                <Stethoscope className="w-5 h-5 mr-2" />
                Book Appointment
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

import { Calendar } from 'lucide-react'
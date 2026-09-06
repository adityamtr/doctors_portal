import { motion } from 'framer-motion'
import { Users, Heart, Shield, Award, Clock, MapPin, Stethoscope, GraduationCap, Building2, CheckCircle } from 'lucide-react'
import { Card, Badge, Button } from '../components/UI'

// Single doctor profile
const doctor = {
  name: 'Dr. Sarah Johnson',
  role: 'Chief Medical Officer',
  specialty: 'Cardiology',
  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
  bio: 'Board-certified cardiologist with 15+ years of experience in preventive cardiology and heart failure management.'
}

const values = [
  {
    icon: Heart,
    title: 'Patient-Centered Care',
    description: 'Every decision we make puts our patients first. We listen, understand, and provide personalized care.'
  },
  {
    icon: Shield,
    title: 'Trust & Transparency',
    description: 'We believe in honest communication, clear pricing, and building long-term relationships based on trust.'
  },
  {
    icon: Award,
    title: 'Clinical Excellence',
    description: 'Our doctors are board-certified leaders in their fields, committed to the highest standards of care.'
  },
  {
    icon: Clock,
    title: 'Accessibility',
    description: 'We make healthcare convenient with online booking, multiple locations, and flexible hours.'
  },
  {
    icon: GraduationCap,
    title: 'Continuous Learning',
    description: 'Our team stays at the forefront of medical advances through ongoing education and research.'
  },
  {
    icon: Users,
    title: 'Community Focus',
    description: 'We\'re committed to improving the health of our communities through outreach and education.'
  },
]

const milestones = [
  { year: '2020', title: 'Founded', description: 'Doctor\'s Portal was founded with a mission to make quality healthcare accessible.' },
  { year: '2021', title: 'First Patient', description: 'First patient appointment booked with Dr. Sarah Johnson.' },
  { year: '2022', title: 'Online Booking', description: 'Launched online appointment booking platform.' },
  { year: '2023', title: 'First Clinic', description: 'Opened first clinic location where Dr. Johnson practices.' },
  { year: '2024', title: '1000+ Patients', description: 'Served over 1,000 patients with 98% satisfaction rate.' },
]

export function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary-50 via-white to-white py-20 md:py-32">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Badge variant="primary" className="text-lg px-4 py-2 mb-6">
                About Doctor's Portal
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="heading-1 text-gray-900 mb-6 text-balance"
            >
              Redefining Healthcare <span className="text-primary-600">Access</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-body text-gray-600 max-w-2xl mx-auto"
            >
              We're on a mission to make quality healthcare accessible, convenient, and personalized for everyone. 
              Through technology and compassionate care, we're transforming the patient experience.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="section bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-2 text-gray-900 mb-6">Our Mission</h2>
                <div className="prose prose-gray max-w-none space-y-4">
                  <p className="text-gray-600 leading-relaxed">
                    At Doctor's Portal, we believe that everyone deserves access to exceptional healthcare without the hassle. 
                    Our mission is to bridge the gap between patients and top-tier medical professionals through innovative technology 
                    and a patient-first approach.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We've built a platform that puts you in control of your healthcare journey. From finding the right specialist 
                    to booking appointments that fit your schedule, we handle the details so you can focus on what matters most—your health.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Every doctor in our network is carefully vetted, board-certified, and committed to providing the highest standard 
                    of care. We're not just a booking platform; we're your partner in health.
                  </p>
                </div>
              </motion.div>
            </div>
            <div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 rounded-3xl flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%230ea5e9%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 36v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
                  <div className="relative z-10 text-center p-8">
                    <Stethoscope className="w-32 h-32 text-primary-200 mx-auto mb-6" />
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Your Health Journey Starts Here</h3>
                    <p className="text-gray-600 text-lg max-w-md mx-auto">
                      Join thousands of patients who trust Doctor's Portal for their healthcare needs.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="heading-2 text-gray-900 mb-4"
            >
              Our Core Values
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-body text-gray-600"
            >
              These principles guide everything we do, from the doctors we partner with to the technology we build.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-8 h-full"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="heading-3 text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="heading-2 text-gray-900 mb-4"
            >
              Dr. Sarah Johnson
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-body text-gray-600"
            >
              Chief Medical Officer - Cardiology
            </motion.p>
          </div>

          <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden mb-8">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="card p-8 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">{doctor.name}</h3>
            <p className="text-primary-600 text-sm font-medium mb-1">{doctor.role}</p>
            <Badge variant="outline" className="mb-4">{doctor.specialty}</Badge>
            <p className="text-gray-600">{doctor.bio}</p>
          </div>

          {/* Core Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-8 h-full"
              >
                <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-primary-600" />
                </div>
                <h3 className="heading-3 text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Milestones */}
          <section className="section bg-gray-50">
            <div className="container">
              <div className="text-center max-w-3xl mx-auto mb-16">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="heading-2 text-gray-900 mb-4"
                >
                  Our Journey
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-body text-gray-600"
                >
                  Key milestones in our mission to transform healthcare access.
                </motion.p>
              </div>

              <div className="relative max-w-3xl mx-auto">
                {/* Timeline line */}
                <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary-200" />
                
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    className="relative pl-20 pb-12 last:pb-0"
                  >
                    <div className="absolute left-0 top-0 w-16 h-16 bg-white rounded-full border-4 border-primary-500 flex items-center justify-center z-10">
                      <span className="font-bold text-primary-600">{milestone.year}</span>
                    </div>
                    <Card className="p-6 ml-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{milestone.title}</h3>
                      <p className="text-gray-600">{milestone.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="section bg-primary-600">
            <div className="container">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { value: '50+', label: 'Board-Certified Doctors' },
                  { value: '20+', label: 'Medical Specialties' },
                  { value: '5', label: 'Clinic Locations' },
                  { value: '15K+', label: 'Happy Patients' },
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                    <div className="text-primary-100 font-medium">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="section bg-white">
            <div className="container text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="heading-2 text-gray-900 mb-4">Ready to Experience Better Healthcare?</h2>
                <p className="text-body text-gray-600 max-w-2xl mx-auto mb-8">
                  Join thousands of patients who trust Doctor's Portal for their healthcare needs. 
                  Book your first appointment today.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <a href="/book-appointment">
                    <Button size="xl" className="px-12 py-4">
                      Book Appointment
                    </Button>
                  </a>
                  <a href="/doctors">
                    <Button variant="outline" size="xl" className="px-12 py-4">
                      Find a Doctor
                    </Button>
                  </a>
                </div>
              </motion.div>
            </div>
          </section>
        </div>
      </section>
    </div>
  )
}
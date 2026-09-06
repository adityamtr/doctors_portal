import { Link } from 'react-router-dom'
import { Stethoscope, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    quickLinks: [
      { label: 'Home', path: '/' },
      { label: 'Doctors', path: '/doctors' },
      { label: 'Services', path: '/services' },
      { label: 'Locations', path: '/clinics' },
      { label: 'About Us', path: '/about' },
      { label: 'Contact', path: '/contact' },
    ],
    services: [
      { label: 'Cardiology', path: '/services?category=Cardiology' },
      { label: 'Pediatrics', path: '/services?category=Pediatrics' },
      { label: 'Dermatology', path: '/services?category=Dermatology' },
      { label: 'Orthopedics', path: '/services?category=Orthopedics' },
      { label: 'OB/GYN', path: '/services?category=OB/GYN' },
    ],
    support: [
      { label: 'Book Appointment', path: '/book-appointment' },
      { label: 'FAQs', path: '/faq' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' },
      { label: 'Insurance', path: '/insurance' },
    ],
  }

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Linkedin, label: 'LinkedIn', href: '#' },
  ]

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 text-white mb-6">
              <Stethoscope className="w-10 h-10 text-primary-400" />
              <span className="font-bold text-2xl">Doctor's Portal</span>
            </Link>
            <p className="text-gray-400 max-w-md mb-8 leading-relaxed">
              Your trusted platform for finding top-rated doctors, booking appointments, 
              and managing your healthcare journey with ease.
            </p>
            <div className="flex gap-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="text-gray-400 hover:text-primary-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Specialties</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="hover:text-primary-400 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 mt-0.5 flex-shrink-0" />
                <span className="text-sm">123 Medical Center Dr, Suite 100<br />New York, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="tel:+1-555-0100" className="hover:text-primary-400 transition-colors">
                  +1 (555) 010-0000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a href="mailto:info@doctorsportal.com" className="hover:text-primary-400 transition-colors">
                  info@doctorsportal.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {currentYear} Doctor's Portal. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Service</Link>
            <Link to="/cookies" className="hover:text-primary-400 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
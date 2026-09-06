import { Link } from 'react-router-dom'
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react'
import { Card, Badge, Avatar } from './UI'
import { useAppointmentBooking } from '../context/AppointmentContext'

export function DoctorCard({ doctor, showActions = true }) {
  const { setSelectedDoctor } = useAppointmentBooking()
  const specialties = [
    'Cardiology', 'Pediatrics', 'Dermatology', 
    'Orthopedics', 'OB/GYN', 'Neurology', 
    'Oncology', 'Psychiatry', 'Radiology'
  ]
  
  const isSpecialty = specialties.some(s => 
    doctor.specialization?.toLowerCase().includes(s.toLowerCase())
  )

  return (
    <Card hover className="h-full flex flex-col">
      <div className="p-6">
        <div className="flex items-start gap-4">
          <Avatar 
            src={doctor.profile_image} 
            name={doctor.name} 
            size="xl" 
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-lg text-gray-900 truncate">
                  {doctor.name}
                </h3>
                <p className="text-primary-600 text-sm font-medium mt-0.5">
                  {doctor.title}
                </p>
              </div>
              {doctor.is_active && (
                <Badge variant="success" className="flex-shrink-0">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Available
                </Badge>
              )}
            </div>
            
            <p className="text-gray-600 text-sm mt-2 line-clamp-2">
              {doctor.bio || `Experienced ${doctor.specialization} specialist with ${doctor.experience_years} years of practice.`}
            </p>
            
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {doctor.specialization}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {doctor.experience_years}+ years exp
              </span>
              {doctor.languages && (
                <span className="flex items-center gap-1">
                  <span className="w-4 h-4">🌐</span>
                  {doctor.languages.split(',')[0].trim()}
                </span>
              )}
            </div>
            
            {doctor.education && (
              <p className="text-xs text-gray-400 mt-3 line-clamp-1">
                {doctor.education}
              </p>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
            <Link
              to={`/doctors/${doctor.id}`}
              className="btn-outline text-sm py-2 px-4"
            >
              View Profile
            </Link>
            <Link
              to="/book-appointment"
              className="btn-primary text-sm py-2 px-4"
              onClick={(e) => {
                setSelectedDoctor(doctor)
              }}
            >
              Book Now
            </Link>
          </div>
        )}
      </div>
    </Card>
  )
}

export function DoctorCardCompact({ doctor }) {
  return (
    <Link to={`/doctors/${doctor.id}`} className="card-hover p-4 block">
      <div className="flex items-center gap-4">
        <Avatar 
          src={doctor.profile_image} 
          name={doctor.name} 
          size="lg" 
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{doctor.name}</h4>
          <p className="text-primary-600 text-sm">{doctor.title}</p>
          <p className="text-gray-500 text-sm mt-1 truncate">
            {doctor.specialization} • {doctor.experience_years}+ years
          </p>
        </div>
        {doctor.is_active && (
          <Badge variant="success" className="flex-shrink-0">
            Available
          </Badge>
        )}
      </div>
    </Link>
  )
}
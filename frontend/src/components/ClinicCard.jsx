import { MapPin, Phone, Mail, Clock, CheckCircle, MapPin as MapPinIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card, Badge } from './UI'
import { useAppointmentBooking } from '../context/AppointmentContext'

const dayLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export function ClinicCard({ clinic, showDetails = true }) {
  const navigate = useNavigate()
  const { setSelectedClinic } = useAppointmentBooking()
  const getHoursForDay = (day) => {
    const hoursMap = {
      0: clinic.hours_monday,
      1: clinic.hours_tuesday,
      2: clinic.hours_wednesday,
      3: clinic.hours_thursday,
      4: clinic.hours_friday,
      5: clinic.hours_saturday,
      6: clinic.hours_sunday,
    }
    return hoursMap[day] || 'Closed'
  }

  const today = new Date().getDay()
  const todayHours = getHoursForDay(today)
  const isOpenToday = todayHours && todayHours !== 'Closed'

  return (
    <Card hover className="h-full flex flex-col">
      <div className="p-6 flex-1">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-xl text-gray-900">{clinic.name}</h3>
            <p className="text-gray-500 mt-1">{clinic.address}, {clinic.city}, {clinic.state} {clinic.zip_code}</p>
          </div>
          {clinic.is_active && (
            <Badge variant="success" className="flex-shrink-0">
              <CheckCircle className="w-3 h-3 mr-1" />
              Open
            </Badge>
          )}
        </div>

        <div className="space-y-3 text-gray-600 text-sm">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0" />
            <span>{clinic.address}, {clinic.city}, {clinic.state} {clinic.zip_code}</span>
          </div>
          
          {clinic.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <a href={`tel:${clinic.phone}`} className="hover:text-primary-600 transition-colors">
                {clinic.phone}
              </a>
            </div>
          )}
          
          {clinic.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary-600 flex-shrink-0" />
              <a href={`mailto:${clinic.email}`} className="hover:text-primary-600 transition-colors">
                {clinic.email}
              </a>
            </div>
          )}
        </div>

        {showDetails && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h4 className="font-medium text-gray-900 mb-3">Weekly Hours</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {dayLabels.map((day, index) => (
                <div key={day} className="flex justify-between">
                  <span className="text-gray-500">{day.slice(0, 3)}</span>
                  <span className={`font-medium ${isOpenToday && index === today ? 'text-primary-600' : 'text-gray-700'}`}>
                    {getHoursForDay(index)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {showDetails && todayHours && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            <div>
              <p className="text-sm font-medium text-primary-800">
                {isOpenToday ? 'Open Today' : 'Closed Today'}
              </p>
              <p className="text-xs text-primary-600">
                {todayHours}
              </p>
            </div>
          </div>
        )}
      </div>

      {showDetails && (
        <div className="p-6 pt-0 border-t border-gray-100 flex gap-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${clinic.latitude},${clinic.longitude}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex-1 text-sm py-2 text-center"
          >
            Get Directions
          </a>
          <button
            className="btn-primary flex-1 text-sm py-2"
            onClick={() => {
              setSelectedClinic(clinic)
              navigate('/book-appointment')
            }}
          >
            Book Here
          </button>
        </div>
      )}
    </Card>
  )
}

export function ClinicCardCompact({ clinic }) {
  const today = new Date().getDay()
  const hoursMap = {
    0: clinic.hours_monday,
    1: clinic.hours_tuesday,
    2: clinic.hours_wednesday,
    3: clinic.hours_thursday,
    4: clinic.hours_friday,
    5: clinic.hours_saturday,
    6: clinic.hours_sunday,
  }
  const todayHours = hoursMap[today] || 'Closed'
  const isOpenToday = todayHours !== 'Closed'

  return (
    <Card hover className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{clinic.name}</h4>
          <p className="text-gray-500 text-sm mt-1 truncate">
            {clinic.city}, {clinic.state}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`w-2 h-2 rounded-full ${isOpenToday ? 'bg-green-500' : 'bg-gray-300'}`} />
          <span className="text-xs font-medium text-gray-600">
            {isOpenToday ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
      {clinic.phone && (
        <p className="text-gray-500 text-sm mt-2 flex items-center gap-1">
          <Phone className="w-4 h-4" />
          {clinic.phone}
        </p>
      )}
    </Card>
  )
}

export function ClinicMap({ clinics, selectedClinic, onSelect }) {
  return (
    <div className="card p-6">
      <h3 className="font-semibold text-lg text-gray-900 mb-4">Our Locations</h3>
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center relative overflow-hidden">
        {/* Placeholder for map - in production, integrate with Google Maps or Mapbox */}
        <div className="text-center text-gray-500">
          <MapPinIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p className="text-lg">Interactive Map</p>
          <p className="text-sm">Map integration would go here</p>
        </div>
        
        {/* Clinic markers would be positioned absolutely based on lat/lng */}
        {clinics.filter(c => c.latitude && c.longitude).map((clinic) => (
          <button
            key={clinic.id}
            onClick={() => onSelect(clinic)}
            className={`absolute p-2 rounded-full transition-all ${
              selectedClinic?.id === clinic.id
                ? 'bg-primary-600 text-white shadow-lg scale-110'
                : 'bg-white text-primary-600 shadow-md hover:scale-110'
            }`}
            style={{
              left: `${Math.random() * 80 + 10}%`,
              top: `${Math.random() * 70 + 15}%`,
            }}
            aria-label={clinic.name}
          >
            <MapPinIcon className="w-5 h-5" />
          </button>
        ))}
      </div>
      
      <div className="mt-4 flex flex-wrap gap-2">
        {clinics.map((clinic) => (
          <button
            key={clinic.id}
            onClick={() => onSelect(clinic)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              selectedClinic?.id === clinic.id
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {clinic.name}
          </button>
        ))}
      </div>
    </div>
  )
}
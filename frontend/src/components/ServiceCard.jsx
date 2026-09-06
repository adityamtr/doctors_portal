import { Link } from 'react-router-dom'
import { Stethoscope, Heart, Baby, Sparkles, Bone, User, Clock } from 'lucide-react'
import { Card, Badge } from './UI'
import { formatPrice } from '../utils/currency'

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

export function ServiceCard({ service, showPrice = true }) {
  const Icon = categoryIcons[service.category] || Stethoscope
  const badgeClass = categoryColors[service.category] || 'bg-gray-100 text-gray-700'

  return (
    <Card hover className="h-full p-6 flex flex-col">
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
          <Icon className="w-6 h-6 text-primary-600" />
        </div>
        <Badge variant="default" className={badgeClass}>
          {service.category}
        </Badge>
      </div>
      
      <h3 className="font-semibold text-lg text-gray-900 mb-2">
        {service.name}
      </h3>
      
      <p className="text-gray-600 text-sm mb-4 flex-1">
        {service.description || 'Professional medical service provided by our experienced specialists.'}
      </p>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            {service.duration_minutes} min
          </span>
        </div>
        
        {showPrice && service.price && (
          <div className="flex items-baseline gap-1">
            <span className="font-semibold text-gray-900">
              {formatPrice(service.price)}
            </span>
          </div>
        )}
      </div>
    </Card>
  )
}

export function ServiceCardCompact({ service }) {
  const Icon = categoryIcons[service.category] || Stethoscope
  const badgeClass = categoryColors[service.category] || 'bg-gray-100 text-gray-700'

  return (
    <Card hover className="p-4">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-gray-900 truncate">{service.name}</h4>
            <Badge variant="default" className={badgeClass}>{service.category}</Badge>
          </div>
          <p className="text-gray-500 text-sm mt-1 truncate">
            {service.duration_minutes} min • {formatPrice(service.price)}
          </p>
        </div>
      </div>
    </Card>
  )
}

export function ServiceCategoryFilter({ categories, activeCategory, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8" role="group" aria-label="Service categories">
      <button
        onClick={() => onChange(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          !activeCategory
            ? 'bg-primary-600 text-white shadow-md'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        All Services
      </button>
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeCategory === category
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  )
}
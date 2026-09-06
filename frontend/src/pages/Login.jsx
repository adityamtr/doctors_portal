import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Lock, Mail } from 'lucide-react'
import { Button, Card, Input } from '../components/UI'

export function Login() {
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // This is a placeholder login screen for the existing app flow.
    // The app does not currently implement an auth backend, so we avoid a broken redirect.
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="container">
        <div className="max-w-md mx-auto">
          <Link to="/" className="btn-ghost mb-6 inline-flex">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back home
          </Link>

          <Card className="p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary-600" />
              </div>
              <h1 className="heading-3 text-gray-900">Welcome back</h1>
              <p className="text-gray-600 mt-2">Sign in to continue to your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                placeholder="you@example.com"
                icon={<Mail className="w-4 h-4 text-gray-400" />}
              />

              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
                placeholder="Enter your password"
              />

              <div className="flex items-center justify-between text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>
                <Link to="/contact" className="text-primary-600 hover:text-primary-700">
                  Need help?
                </Link>
              </div>

              <Button type="submit" className="w-full">
                Sign in
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Don’t have an account?{' '}
              <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
                Contact support
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

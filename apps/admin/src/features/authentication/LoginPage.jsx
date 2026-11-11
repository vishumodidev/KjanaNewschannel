import { useState } from 'react'
import { useNavigate } from 'react-router'
import { login } from './authStore.js'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-16 bg-white border border-gray-200 rounded-xl mb-3 shadow-md p-1">
            <img
              src="/logo.jpg"
              alt="JANA NEWS NETWORK Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">JANA NEWS</h1>
          <p className="text-xs text-gray-500 font-semibold tracking-wider">JANA NEWS NETWORK</p>
          <p className="text-xs text-gray-400 mt-1">Newsroom CMS — Staff Portal</p>
        </div>

        {/* Login card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Sign in to your account</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                placeholder="superadmin@jananewsnetwork.com"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors cursor-pointer"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-500 text-center">
            <p>Default Super Admin credentials:</p>
            <p className="font-mono text-gray-700 mt-0.5">superadmin@jananewsnetwork.com</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

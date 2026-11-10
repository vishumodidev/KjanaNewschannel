import { useState } from 'react'
import { useNavigate } from 'react-router'

/**
 * LoginPage — Phase 1 scaffold.
 *
 * Full implementation with React Hook Form, Zod validation,
 * Argon2id-backed auth, JWT tokens, and rate-limit feedback
 * is implemented in Phase 2.
 */
export function LoginPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Phase 2: Replace with authService.login(email, password)
    await new Promise((r) => setTimeout(r, 600))

    // Scaffold: navigate directly to dashboard
    navigate('/dashboard')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center h-20 w-16 bg-white border border-gray-200 rounded-xl mb-3 shadow-md p-1">
            <img
              src="/logo.jpg"
              alt="JANA TV Logo"
              className="h-full w-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">JANA TV</h1>
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
                autoComplete="email"
                required
                placeholder="you@diginewsnetwork.com"
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
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-700 hover:bg-red-800 disabled:bg-red-400 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Phase 1 scaffold — authentication implemented in Phase 2
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage


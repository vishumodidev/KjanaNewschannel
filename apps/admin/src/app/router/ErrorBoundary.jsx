import { useRouteError, isRouteErrorResponse, Link } from 'react-router'
import { AlertTriangle, Home, RefreshCw } from 'lucide-react'

export function AdminErrorBoundary() {
  const error = useRouteError()

  let title = 'Unexpected Application Error'
  let message = 'An unexpected error occurred while rendering this page.'
  let status = 500

  if (isRouteErrorResponse(error)) {
    status = error.status
    if (status === 404) {
      title = 'Page Not Found'
      message = "The newsroom page you are looking for doesn't exist or has moved."
    } else {
      title = `Error ${status}`
      message = error.statusText || message
    }
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
          <AlertTriangle size={32} />
        </div>
        <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 mb-2">
          HTTP {status}
        </span>
        <h1 className="text-xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-sm text-gray-600 mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <RefreshCw size={15} />
            Reload
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-medium hover:bg-red-800 transition"
          >
            <Home size={15} />
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router'
import { FileQuestion, LayoutDashboard } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 text-amber-600">
          <FileQuestion size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tab Not Found</h2>
        <p className="text-sm text-gray-600 mb-6">
          The requested section could not be found or is not yet configured in this deployment.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-4 py-2 bg-red-700 text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition"
          >
            <LayoutDashboard size={16} />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

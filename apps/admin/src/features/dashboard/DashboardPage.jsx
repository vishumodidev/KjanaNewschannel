/**
 * DashboardPage — Phase 1 scaffold.
 *
 * Real stats widgets, charts, and quick-action cards are implemented in Phase 5.
 * This confirms the admin layout, routing, and Tailwind CSS are working.
 */
export function DashboardPage() {
  const stats = [
    { label: 'Articles', value: '—', sub: 'Connected in Phase 5', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    { label: 'Pending Review', value: '—', sub: 'Editorial queue', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Published Today', value: '—', sub: 'Across all languages', color: 'bg-green-50 text-green-700 border-green-200' },
    { label: 'Active Users', value: '—', sub: 'Staff accounts', color: 'bg-purple-50 text-purple-700 border-purple-200' },
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome to JANA NEWS NETWORK Newsroom CMS
        </p>
      </div>

      {/* Phase indicator */}
      <div className="border border-amber-200 bg-amber-50 rounded-lg p-4 flex items-start gap-3">
        <span className="text-amber-600 text-lg">🚧</span>
        <div>
          <p className="font-medium text-amber-800 text-sm">Phase 1 Scaffold</p>
          <p className="text-amber-700 text-xs mt-0.5">
            Admin layout, routing, and Tailwind are wired up.  Live stats and
            editorial tools are implemented in Phase 5.
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-lg border p-5 ${stat.color}`}
          >
            <p className="text-3xl font-bold">{stat.value}</p>
            <p className="font-semibold text-sm mt-1">{stat.label}</p>
            <p className="text-xs mt-0.5 opacity-70">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions placeholder */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['New Article', 'Review Queue', 'Upload Media', 'Add User'].map((action) => (
            <button
              key={action}
              className="px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage


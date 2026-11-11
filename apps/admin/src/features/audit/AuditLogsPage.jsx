import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ClipboardList,
  Search,
  Loader2,
} from 'lucide-react'
import adminApiClient from '../../lib/adminApiClient.js'

export function AuditLogsPage() {
  const [search, setSearch] = useState('')
  const [filterAction, setFilterAction] = useState('ALL')

  const { data: logsData, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => adminApiClient.get('/audit-logs'),
  })

  const logs = logsData?.data || []

  const actions = ['ALL', 'LOGIN', 'SEED_INITIALIZE', 'STORY_CREATE', 'STATUS_CHANGE', 'MEDIA_UPLOAD']

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      !search ||
      log.action?.toLowerCase().includes(search.toLowerCase()) ||
      log.actor?.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      log.actor?.email?.toLowerCase().includes(search.toLowerCase())

    const matchesAction = filterAction === 'ALL' || log.action === filterAction

    return matchesSearch && matchesAction
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ClipboardList className="text-red-700" size={26} />
          Editorial & Security Audit Logs
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Immutable event log tracking authentication, article revisions, editorial reviews, and system activities.
        </p>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by actor, action or email..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {actions.map((act) => (
            <button
              key={act}
              onClick={() => setFilterAction(act)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                filterAction === act
                  ? 'bg-red-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {act.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={22} /> Loading audit trail...
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">No audit log entries found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200 font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Action & Event</th>
                  <th className="px-6 py-3.5">Actor</th>
                  <th className="px-6 py-3.5">Target Entity</th>
                  <th className="px-6 py-3.5">IP Address</th>
                  <th className="px-6 py-3.5">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {filteredLogs.map((log) => {
                  const isAuth = log.action.includes('LOGIN')
                  return (
                    <tr key={log.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold font-mono ${
                              isAuth
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {log.action}
                          </span>
                        </div>
                        {log.changes?.event && (
                          <p className="text-xs text-gray-500 mt-1">{log.changes.event}</p>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {log.actor?.displayName || 'System'}
                        </div>
                        <div className="text-xs text-gray-500">{log.actor?.email || 'automated'}</div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="text-xs font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                          {log.targetType || 'System'} {log.targetId ? `#${log.targetId}` : ''}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-xs font-mono text-gray-500">
                        {log.ipAddress || '127.0.0.1'}
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

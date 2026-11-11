import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Users,
  Search,
  Shield,
  Mail,
  CheckCircle,
  XCircle,
  Loader2,
  MapPin,
  Building,
} from 'lucide-react'
import adminApiClient from '../../lib/adminApiClient.js'

export function StaffDirectoryPage() {
  const [search, setSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState('ALL')

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['staff', 'users'],
    queryFn: () => adminApiClient.get('/users'),
  })

  const users = usersData?.data || []

  const rolesList = ['ALL', 'super_admin', 'editor', 'reporter', 'translator']

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      !search ||
      u.displayName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.department?.toLowerCase().includes(search.toLowerCase())

    const matchesRole =
      selectedRole === 'ALL' ||
      u.roles?.some((r) => r.toLowerCase().includes(selectedRole.toLowerCase()))

    return matchesSearch && matchesRole
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="text-red-700" size={26} />
            Staff Directory
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage journalists, bureau reporters, editors, translators, and newsroom administrators.
          </p>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, department..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto w-full sm:w-auto">
          {rolesList.map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRole(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition ${
                selectedRole === r
                  ? 'bg-red-700 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Staff Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="animate-spin mr-2" size={22} /> Loading staff directory...
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No staff members found matching your search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b border-gray-200 font-semibold">
                <tr>
                  <th className="px-6 py-3.5">Staff Member</th>
                  <th className="px-6 py-3.5">Role & Department</th>
                  <th className="px-6 py-3.5">Assigned Scope</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => {
                  const initials = user.displayName
                    ? user.displayName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'U'

                  const scope = user.scopeAssignments?.[0]
                  const scopeLabel = scope?.district?.nameEn
                    ? `${scope.district.nameEn} District`
                    : scope?.scopeType || 'GLOBAL'

                  return (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-red-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{user.displayName}</div>
                            <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Mail size={12} /> {user.email}
                              </span>
                              {user.staffId && (
                                <span className="bg-gray-100 text-gray-600 px-1.5 py-0.2 rounded text-[10px] font-mono">
                                  {user.staffId}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap gap-1">
                            {user.roles?.map((r) => (
                              <span
                                key={r}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-700 border border-red-200"
                              >
                                <Shield size={11} /> {r.replace('_', ' ')}
                              </span>
                            ))}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Building size={12} /> {user.department} • {user.designation}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                          <MapPin size={13} className="text-gray-400" />
                          <span>{scopeLabel}</span>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        {user.isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700">
                            <CheckCircle size={12} /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                            <XCircle size={12} /> Inactive
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-xs text-gray-500">
                        {user.lastLoginAt
                          ? new Date(user.lastLoginAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : 'Recent Session'}
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

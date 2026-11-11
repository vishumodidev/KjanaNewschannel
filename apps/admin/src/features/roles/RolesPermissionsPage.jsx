import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  ShieldCheck,
  Lock,
  Check,
  Search,
  Key,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import adminApiClient from '../../lib/adminApiClient.js'

export function RolesPermissionsPage() {
  const [selectedRoleId, setSelectedRoleId] = useState(null)
  const [search, setSearch] = useState('')

  const { data: rolesData, isLoading } = useQuery({
    queryKey: ['roles', 'permissions'],
    queryFn: () => adminApiClient.get('/roles'),
  })

  const roles = rolesData?.data?.roles || []
  const allPermissions = rolesData?.data?.permissions || []

  // Default to first role once loaded
  const activeRole =
    roles.find((r) => r.id === selectedRoleId) || roles[0] || null

  const filteredRoles = roles.filter(
    (r) =>
      !search ||
      r.displayName.toLowerCase().includes(search.toLowerCase()) ||
      r.name.toLowerCase().includes(search.toLowerCase()),
  )

  // Group permissions by module
  const permissionsByModule = allPermissions.reduce((acc, perm) => {
    if (!acc[perm.module]) acc[perm.module] = []
    acc[perm.module].push(perm)
    return acc
  }, {})

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShieldCheck className="text-red-700" size={26} />
          Roles & Permissions Matrix
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Granular role-based access control (RBAC) governing editorial capabilities, district reporting, translations, and publishing authority.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={22} /> Loading role matrices...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roles List */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-3">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search roles..."
                className="w-full pl-9 pr-3 py-1.5 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div className="space-y-1.5 max-h-[600px] overflow-y-auto">
              {filteredRoles.map((role) => {
                const isSelected = activeRole?.id === role.id
                return (
                  <button
                    key={role.id}
                    onClick={() => setSelectedRoleId(role.id)}
                    className={`w-full text-left p-3 rounded-lg border transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-red-50/80 border-red-300 text-red-900 font-semibold'
                        : 'border-transparent hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-semibold">{role.displayName}</div>
                      <div className="text-xs text-gray-500 flex items-center gap-2 mt-0.5 font-mono">
                        <span>{role.name}</span>
                        {role.isSystem && (
                          <span className="bg-gray-100 text-gray-600 px-1 rounded text-[10px] font-sans">
                            System
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-400">
                      <span className="text-[11px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600 font-sans">
                        {role.permissions.length} perms
                      </span>
                      <ChevronRight size={14} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Permissions Matrix Detail */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
            {activeRole ? (
              <>
                <div className="border-b border-gray-100 pb-4 flex items-start justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <Key size={18} className="text-red-700" />
                      {activeRole.displayName}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">{activeRole.description || 'System role with predefined permission boundaries.'}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                    {activeRole.userCount || 0} Assigned Staff
                  </span>
                </div>

                {/* Modules & permissions list */}
                <div className="space-y-5">
                  {Object.entries(permissionsByModule).map(([moduleName, perms]) => (
                    <div key={moduleName} className="border border-gray-100 rounded-lg p-4 bg-gray-50/50">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-3 flex items-center gap-1.5">
                        <Lock size={12} className="text-gray-400" />
                        {moduleName} Module
                      </h3>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {perms.map((perm) => {
                          const hasPerm =
                            activeRole.name === 'super_admin' ||
                            activeRole.permissions.includes(perm.code)

                          return (
                            <div
                              key={perm.id}
                              className={`flex items-start gap-2 p-2 rounded-md text-xs border transition ${
                                hasPerm
                                  ? 'bg-green-50/70 border-green-200 text-gray-800'
                                  : 'bg-white border-gray-200 text-gray-400 opacity-60'
                              }`}
                            >
                              <div
                                className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                                  hasPerm
                                    ? 'bg-green-600 text-white'
                                    : 'bg-gray-200 text-gray-400'
                                }`}
                              >
                                <Check size={10} strokeWidth={3} />
                              </div>
                              <div>
                                <div className="font-semibold">{perm.code}</div>
                                <div className="text-[11px] text-gray-500 mt-0.5">
                                  {perm.description || 'Permission granted'}
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-gray-400">
                Select a role from the left pane to view permissions.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

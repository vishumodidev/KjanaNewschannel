import { useState, useEffect } from 'react'
import { Outlet, Link, NavLink, useNavigate } from 'react-router'
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  Languages,
  Image,
  Users,
  ShieldCheck,
  BarChart2,
  ClipboardList,
  Settings,
  LogOut,
  PlusCircle,
} from 'lucide-react'
import { authStore, logout } from '../../features/authentication/authStore.js'

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/articles', label: 'All Articles', icon: FileText },
  { to: '/articles/new', label: 'Create Story', icon: PlusCircle },
  { to: '/editorial/queue', label: 'Review Queue', icon: CheckSquare },
  { to: '/translations', label: 'Translations', icon: Languages },
  { to: '/media', label: 'Media Library', icon: Image },
  { to: '/users', label: 'Staff Directory', icon: Users },
  { to: '/roles', label: 'Roles & Perms', icon: ShieldCheck },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
  { to: '/audit-logs', label: 'Audit Logs', icon: ClipboardList },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => authStore.getUser())

  useEffect(() => {
    setUser(authStore.getUser())
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const primaryRole = user?.roles?.[0] || 'Staff'
  const displayName = user?.displayName || 'Editorial Staff'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* ── Sidebar ───────────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 flex flex-col bg-gray-900 text-white">
        {/* Brand header */}
        <div className="bg-red-800 px-4 py-3.5 flex-shrink-0">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="h-10 w-8 rounded bg-white p-0.5 shadow overflow-hidden flex items-center justify-center flex-shrink-0">
              <img
                src="/logo.jpg"
                alt="JANA NEWS NETWORK"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">JANA NEWS</p>
              <p className="text-[11px] text-red-200 mt-0.5">Newsroom CMS</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white font-semibold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                }`
              }
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="flex-shrink-0 border-t border-gray-700 p-3">
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-red-700 flex items-center justify-center text-xs font-bold">
              {initials || 'J'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">{displayName}</p>
              <p className="text-xs text-gray-400 truncate">{primaryRole}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 flex items-center gap-2 px-2 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-gray-800 rounded transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* ── Main content area ──────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            <span>JANA News Network Production CMS</span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/articles/new"
              className="inline-flex items-center gap-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-medium px-3 py-1.5 rounded-md shadow-sm transition-colors"
            >
              <PlusCircle size={14} />
              <span>Create Story</span>
            </Link>
          </div>
        </header>

        {/* Page body */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout

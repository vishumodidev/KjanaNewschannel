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
  ChevronRight,
} from 'lucide-react'

// ── Sidebar navigation items ──────────────────────────────────────────────────
// permissions field will be used in Phase 5 to hide items based on user role
const NAV_ITEMS = [
  { to: '/dashboard',         label: 'Dashboard',          icon: LayoutDashboard, permission: null },
  { to: '/articles',          label: 'Articles',           icon: FileText,         permission: 'article:create' },
  { to: '/editorial/queue',   label: 'Review Queue',       icon: CheckSquare,      permission: 'editorial:assign' },
  { to: '/translations',      label: 'Translations',       icon: Languages,        permission: 'translation:assign' },
  { to: '/media',             label: 'Media Library',      icon: Image,            permission: 'media:upload' },
  { to: '/users',             label: 'Users',              icon: Users,            permission: 'user:manage' },
  { to: '/roles',             label: 'Roles & Perms',      icon: ShieldCheck,      permission: 'role:manage' },
  { to: '/analytics',         label: 'Analytics',          icon: BarChart2,        permission: 'analytics:view' },
  { to: '/audit-logs',        label: 'Audit Logs',         icon: ClipboardList,    permission: 'audit:view' },
  { to: '/settings',          label: 'Settings',           icon: Settings,         permission: 'system:configure' },
]

/**
 * AdminLayout — persistent sidebar + top bar shell for all admin pages.
 *
 * Phase 2: Wrap with AuthGuard and inject real user from auth context.
 * Phase 5: Hide nav items based on user.permissions.
 */
export function AdminLayout() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // Phase 2: call authService.logout(), clear tokens
    navigate('/login')
  }

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
                alt="JANA TV"
                className="h-full w-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">JANA TV</p>
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
          {/* Phase 2: replace with real user name / avatar */}
          <div className="flex items-center gap-3 px-2 py-1.5">
            <div className="w-7 h-7 rounded-full bg-red-700 flex items-center justify-center text-xs font-bold">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-200 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">Super Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-2 w-full flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-md transition-colors"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </aside>

      {/* ── Main area ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="flex-shrink-0 h-14 bg-white border-b border-gray-200 flex items-center px-6 gap-3">
          {/* Breadcrumb — Phase 5 will make this dynamic */}
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <span>Newsroom</span>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium">Dashboard</span>
          </div>

          <div className="ml-auto flex items-center gap-3">
            {/* Notifications, help, etc. — Phase 5 */}
            <span className="text-xs text-gray-400 bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1 rounded">
              Phase 1 Scaffold
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}


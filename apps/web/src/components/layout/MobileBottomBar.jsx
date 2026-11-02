import { Link, useLocation } from 'react-router'
import { Home, Film, Flame, Search, Grid } from 'lucide-react'

export function MobileBottomBar({ onOpenMenu, onToggleSearch }) {
  const location = useLocation()

  const navItems = [
    { label: 'ಮುಖಪುಟ', path: '/', icon: Home },
    { label: 'ವೀಡಿಯೋ', path: '/videos', icon: Film },
    { label: 'ಟ್ರೆಂಡಿಂಗ್', path: '/category/karnataka', icon: Flame },
    { label: 'ಹುಡುಕಿ', action: onToggleSearch, icon: Search },
    { label: 'ವಿಭಾಗ', action: onOpenMenu, icon: Grid },
  ]

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 px-2 py-1 shadow-lg"
    >
      <div className="flex items-center justify-around">
        {navItems.map((item, index) => {
          const Icon = item.icon
          const isActive = item.path && (item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path))

          if (item.action) {
            return (
              <button
                key={index}
                onClick={item.action}
                className="flex flex-col items-center justify-center py-1 px-2 text-gray-600 hover:text-red-700 transition-colors cursor-pointer"
              >
                <Icon size={19} />
                <span className="text-[10px] font-semibold mt-0.5 kannada">{item.label}</span>
              </button>
            )
          }

          return (
            <Link
              key={index}
              to={item.path}
              className={`flex flex-col items-center justify-center py-1 px-2 transition-colors ${
                isActive ? 'text-red-700 font-bold' : 'text-gray-600 hover:text-red-700'
              }`}
            >
              <Icon size={19} className={isActive ? 'stroke-[2.5]' : 'stroke-2'} />
              <span className="text-[10px] font-semibold mt-0.5 kannada">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default MobileBottomBar


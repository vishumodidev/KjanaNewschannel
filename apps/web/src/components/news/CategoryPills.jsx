import { Link } from 'react-router'
import {
  MapPin,
  Flag,
  Globe,
  Landmark,
  TrendingUp,
  Cpu,
  Trophy,
  Film,
  GraduationCap,
  Heart,
  Sprout,
  Navigation,
  ChevronRight,
} from 'lucide-react'
import { MOCK_CATEGORY_PILLS } from '../../data/mockNewsData'

const ICON_MAP = {
  MapPin,
  Flag,
  Globe,
  Landmark,
  TrendingUp,
  Cpu,
  Trophy,
  Film,
  GraduationCap,
  Heart,
  Sprout,
  Navigation,
}

export function CategoryPills() {
  return (
    <div className="relative flex items-center py-2">
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 w-full scroll-smooth">
        {MOCK_CATEGORY_PILLS.map((cat) => {
          const IconComponent = ICON_MAP[cat.icon] || MapPin
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.id}`}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 bg-white hover:border-red-600 hover:shadow-2xs text-xs font-semibold text-gray-800 whitespace-nowrap transition-all group flex-shrink-0 cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center ${cat.color} group-hover:scale-105 transition-transform`}
              >
                <IconComponent size={12} strokeWidth={2.4} />
              </div>
              <span className="kannada">{cat.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Right chevron indicator button */}
      <div className="hidden sm:flex pl-1">
        <button
          aria-label="Scroll right"
          className="w-7 h-7 rounded-full bg-white border border-gray-300 text-gray-600 hover:text-red-700 hover:border-red-600 flex items-center justify-center shadow-2xs flex-shrink-0 cursor-pointer"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}


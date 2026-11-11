import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../lib/apiClient'
import { queryKeys } from '../../lib/queryKeys'
import {
  Search,
  Globe,
  Bell,
  User,
  Menu,
  ChevronDown,
  Pause,
  Play,
  ChevronLeft,
  ChevronRight,
  Flame,
  Home,
  X,
  MapPin,
  Film,
  Trophy,
  Landmark,
  TrendingUp,
  GraduationCap,
  Heart,
  Sprout,
  Cpu,
} from 'lucide-react'
import { MOCK_BREAKING } from '../../data/mockNewsData'

export function Header({ mobileDrawerOpen, setMobileDrawerOpen, mobileSearchOpen, setMobileSearchOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchQuery, setSearchQuery] = useState('')
  const [tickerIndex, setTickerIndex] = useState(0)
  const [isTickerPlaying, setIsTickerPlaying] = useState(true)
  const [langMenuOpen, setLangMenuOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState('ಕನ್ನಡ')

  // Internal state fallback if not controlled from parent
  const [internalDrawer, setInternalDrawer] = useState(false)
  const [internalSearch, setInternalSearch] = useState(false)

  const isDrawerOpen = mobileDrawerOpen !== undefined ? mobileDrawerOpen : internalDrawer
  const setIsDrawerOpen = setMobileDrawerOpen || setInternalDrawer
  const isSearchOpen = mobileSearchOpen !== undefined ? mobileSearchOpen : internalSearch
  const setIsSearchOpen = setMobileSearchOpen || setInternalSearch

  // Live breaking news query
  const { data: breakingData } = useQuery({
    queryKey: queryKeys.news.breaking(),
    queryFn: () => apiClient.get('/news/breaking?lang=kn'),
    staleTime: 30_000,
  })

  const liveBreaking = breakingData?.data?.length
    ? breakingData.data.map((item) => ({
      id: item.id,
      title: item.headline,
      slug: item.slug,
    }))
    : null

  const breakingList = liveBreaking || MOCK_BREAKING
  const currentBreaking = breakingList[tickerIndex % breakingList.length] || MOCK_BREAKING[0]

  // Auto-scroll ticker
  useEffect(() => {
    if (!isTickerPlaying) return
    const timer = setInterval(() => {
      setTickerIndex((prev) => (prev + 1) % breakingList.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [isTickerPlaying, breakingList.length])

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      setIsSearchOpen(false)
      setIsDrawerOpen(false)
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const navLinks = [
    { label: 'ಕರ್ನಾಟಕ', path: '/category/karnataka', icon: MapPin },
    { label: 'ದೇಶ', path: '/category/national', icon: Landmark },
    { label: 'ವಿಶ್ವ', path: '/category/international', icon: Globe },
    { label: 'ರಾಜಕೀಯ', path: '/category/politics', icon: Landmark },
    { label: 'ವ್ಯಾಪಾರ', path: '/category/business', icon: TrendingUp },
    { label: 'ತಂತ್ರಜ್ಞಾನ', path: '/category/technology', icon: Cpu },
    { label: 'ಕ್ರೀಡೆ', path: '/category/sports', icon: Trophy },
    { label: 'ಮನರಂಜನೆ', path: '/category/entertainment', icon: Film },
    { label: 'ಜೀವನಶೈಲಿ', path: '/category/lifestyle', icon: Heart },
    { label: 'ಶಿಕ್ಷಣ', path: '/category/education', icon: GraduationCap },
    { label: 'ಆರೋಗ್ಯ', path: '/category/health', icon: Heart },
    { label: 'ಕೃಷಿ', path: '/category/agriculture', icon: Sprout },
    { label: 'ಜಿಲ್ಲಾ ಸುದ್ದಿ', path: '/category/districts', hasDropdown: true, icon: MapPin },
    { label: 'ವೀಡಿಯೋ', path: '/videos', icon: Film },
  ]

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
      {/* ── Top Brand Bar ────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Tagline */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 flex-shrink-0 group min-w-0">
            {/* Official JANA TV Emblem */}
            <div className="relative h-10 w-8 sm:h-12 sm:w-10 bg-white rounded-md border border-gray-200 shadow-2xs p-0.5 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform flex-shrink-0">
              <img
                src="/logo.jpg"
                alt="JANA TV - JANA NEWS NETWORK"
                className="h-full w-full object-contain"
              />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-red-700 tracking-tight leading-none kannada truncate">
                  ಜನಾ ನ್ಯೂಸ್ ನೆಟ್‌ವರ್ಕ್
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 mt-0.5 text-[10px] sm:text-[11px] font-semibold text-gray-700 truncate">
                <span className="kannada truncate">ಸತ್ಯ | ಸಮಗ್ರ | ಜನರ ಧ್ವನಿ</span>
                <span className="text-gray-300">|</span>
                <span className="font-bold text-blue-700 tracking-wider">JANA TV</span>
                <span className="text-gray-300 hidden sm:inline">•</span>
                <span className="font-bold text-gray-800 tracking-wider hidden md:inline">
                  JANA NEWS NETWORK
                </span>
              </div>
            </div>
          </Link>

          {/* Date & Time (Kannada - desktop only) */}
          <div className="hidden xl:flex items-center text-xs text-gray-500 font-medium whitespace-nowrap kannada pl-2">
            <span>ಶನಿವಾರ, 16 ಮೇ 2026</span>
            <span className="mx-2 text-gray-300">|</span>
            <span>ಬೆಳಿಗ್ಗೆ 10:24</span>
          </div>

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md mx-2"
          >
            <div className="relative w-full flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ಸುದ್ದಿಗಳನ್ನು ಹುಡುಕಿ..."
                className="w-full bg-gray-50 border border-gray-300 rounded-l-md py-1.5 pl-3 pr-2 text-xs sm:text-sm text-gray-900 focus:outline-none focus:bg-white focus:border-red-600 transition-colors kannada placeholder:text-gray-400"
              />
              <button
                type="submit"
                aria-label="Search"
                className="bg-red-700 hover:bg-red-800 text-white px-3.5 py-2 rounded-r-md transition-colors flex items-center justify-center cursor-pointer"
              >
                <Search size={16} />
              </button>
            </div>
          </form>

          {/* Right Action Icons: Mobile Search, Language, Notifications, Login & Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            {/* Mobile Search Toggle Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-1.5 text-gray-700 hover:text-red-700 transition-colors cursor-pointer"
              aria-label="Toggle Search"
            >
              <Search size={18} />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-gray-700 hover:text-red-700 py-1 px-1 sm:px-1.5 rounded transition-colors"
              >
                <Globe size={14} className="text-gray-600" />
                <span className="kannada">{selectedLang}</span>
                <ChevronDown size={11} className="text-gray-500" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1 w-28 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50 text-xs font-medium">
                  {['ಕನ್ನಡ', 'English', 'हिन्दी'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setSelectedLang(lang)
                        setLangMenuOpen(false)
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-red-50 hover:text-red-700 transition-colors ${selectedLang === lang ? 'text-red-700 font-bold bg-red-50/50' : 'text-gray-700'
                        }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <button
              aria-label="Notifications"
              className="p-1 text-gray-600 hover:text-red-700 relative transition-colors hidden sm:inline-flex"
            >
              <Bell size={17} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-600 rounded-full" />
            </button>

            {/* User Icon */}
            <button
              aria-label="User Profile"
              className="p-1 text-gray-600 hover:text-red-700 transition-colors hidden sm:inline-flex"
            >
              <User size={17} />
            </button>

            {/* Login Button (Red pill) */}
            <Link
              to="/login"
              className="bg-red-700 hover:bg-red-800 text-white text-[11px] sm:text-xs font-bold px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-md transition-colors shadow-2xs kannada flex-shrink-0"
            >
              ಲಾಗಿನ್
            </Link>

            {/* Social Icons row (Desktop only) */}
            <div className="hidden lg:flex items-center gap-1.5 pl-1 border-l border-gray-200">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-6 h-6 rounded-full bg-blue-600 hover:opacity-90 flex items-center justify-center text-white text-[11px] font-bold"
              >
                f
              </a>
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-6 h-6 rounded-full bg-red-600 hover:opacity-90 flex items-center justify-center text-white text-[10px]"
              >
                ▶
              </a>
              <a
                href="#x"
                aria-label="X"
                className="w-6 h-6 rounded-full bg-black hover:opacity-90 flex items-center justify-center text-white text-[10px] font-bold"
              >
                𝕏
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-6 h-6 rounded-full bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 hover:opacity-90 flex items-center justify-center text-white text-[10px]"
              >
                📷
              </a>
              <a
                href="#whatsapp"
                aria-label="WhatsApp"
                className="w-6 h-6 rounded-full bg-emerald-500 hover:opacity-90 flex items-center justify-center text-white text-[11px] font-bold"
              >
                ✆
              </a>
            </div>

            {/* Hamburger button (Toggles full drawer) */}
            <button
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              className="p-1 sm:p-1.5 text-gray-700 hover:text-red-700 rounded-md transition-colors cursor-pointer"
              aria-label="Toggle Navigation Drawer"
            >
              {isDrawerOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* ── Expandable Mobile Search Bar ───────────────────────── */}
        {isSearchOpen && (
          <form
            onSubmit={handleSearchSubmit}
            className="md:hidden mt-2 pt-2 border-t border-gray-100 flex animate-fadeIn"
          >
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ಸುದ್ದಿಗಳನ್ನು ಹುಡುಕಿ..."
              className="w-full bg-gray-50 border border-gray-300 rounded-l py-1.5 px-3 text-xs kannada focus:outline-none focus:border-red-600"
            />
            <button
              type="submit"
              className="bg-red-700 text-white px-3.5 py-1.5 rounded-r text-xs font-bold flex items-center justify-center"
            >
              <Search size={15} />
            </button>
          </form>
        )}
      </div>

      {/* ── Main Category Navigation Bar (Horizontally Scrollable on ALL screens) ── */}
      <nav className="bg-white border-t border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center overflow-x-auto no-scrollbar py-0 scroll-smooth">
            {/* Red Active 'ಮುಖಪುಟ' Home Block */}
            <Link
              to="/"
              className={`flex items-center gap-1 px-3 sm:px-4 py-2 sm:py-2.5 font-bold text-xs sm:text-sm tracking-wide flex-shrink-0 transition-colors kannada ${location.pathname === '/'
                ? 'bg-red-700 text-white shadow-2xs'
                : 'bg-red-700 hover:bg-red-800 text-white'
                }`}
            >
              <Home size={15} />
              <span>ಮುಖಪುಟ</span>
            </Link>

            {/* Category Links - Scrollable on Mobile & Desktop */}
            <div className="flex items-center gap-0.5 pl-1.5 flex-nowrap">
              {navLinks.map((link) => {
                const isActive = location.pathname.startsWith(link.path)
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-2 sm:px-2.5 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors flex items-center gap-0.5 kannada flex-shrink-0 ${isActive
                      ? 'text-red-700 border-b-2 border-red-700 font-bold'
                      : 'text-gray-800 hover:text-red-700'
                      }`}
                  >
                    <span>{link.label}</span>
                    {link.hasDropdown && <ChevronDown size={11} className="text-gray-400" />}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* ── Breaking News Ticker ─────────────────────────────────── */}
      <div className="bg-red-50/80 border-b border-red-200">
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-1.5 flex items-center justify-between gap-2 text-xs">
          {/* Left badge & scrolling headline */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Red 'ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್' badge */}
            <div className="bg-red-700 text-white font-bold px-2 py-0.5 rounded text-[10px] sm:text-xs flex items-center gap-1 flex-shrink-0 shadow-2xs kannada">
              <Flame size={12} className="text-amber-300 fill-amber-300" />
              <span>ಬ್ರೇಕಿಂಗ್ ನ್ಯೂಸ್</span>
            </div>

            {/* Fire icon + Title with link */}
            <div className="flex items-center gap-1.5 min-w-0 truncate">
              <Flame size={13} className="text-red-600 flex-shrink-0 hidden xs:inline" />
              <Link
                to={`/news/${currentBreaking.slug}`}
                className="font-medium text-gray-900 hover:text-red-700 truncate kannada transition-colors text-xs"
              >
                {currentBreaking.title}
              </Link>
              <span className="text-red-600 font-bold hidden sm:inline">→</span>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-0.5 text-gray-600 flex-shrink-0">
            <button
              onClick={() => setIsTickerPlaying(!isTickerPlaying)}
              aria-label={isTickerPlaying ? 'Pause ticker' : 'Play ticker'}
              className="p-1 hover:text-red-700 transition-colors cursor-pointer"
            >
              {isTickerPlaying ? <Pause size={13} /> : <Play size={13} />}
            </button>
            <button
              onClick={() =>
                setTickerIndex((prev) => (prev - 1 + MOCK_BREAKING.length) % MOCK_BREAKING.length)
              }
              aria-label="Previous headline"
              className="p-1 hover:text-red-700 transition-colors cursor-pointer"
            >
              <ChevronLeft size={15} />
            </button>
            <button
              onClick={() => setTickerIndex((prev) => (prev + 1) % MOCK_BREAKING.length)}
              aria-label="Next headline"
              className="p-1 hover:text-red-700 transition-colors cursor-pointer"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Slide-Over Drawer ─────────────────────────────── */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-2xs transition-opacity"
            onClick={() => setIsDrawerOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="p-4 bg-gradient-to-r from-red-800 to-red-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-8 bg-white rounded p-0.5 flex items-center justify-center">
                  <img src="/logo.jpg" alt="Logo" className="h-full w-full object-contain" />
                </div>
                <div>
                  <p className="font-extrabold text-base leading-none kannada">ಜನಾ ನ್ಯೂಸ್ ನೆಟ್‌ವರ್ಕ್</p>
                  <p className="text-[10px] text-red-200 mt-0.5">JANA TV • JANA NEWS NETWORK</p>
                </div>
              </div>

              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Drawer Search */}
            <div className="p-3 border-b border-gray-200">
              <form onSubmit={handleSearchSubmit} className="flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ಸುದ್ದಿ ಹುಡುಕಿ..."
                  className="w-full bg-gray-100 border border-gray-300 rounded-l py-2 px-3 text-xs kannada focus:outline-none focus:border-red-600"
                />
                <button
                  type="submit"
                  className="bg-red-700 text-white px-3.5 rounded-r flex items-center justify-center"
                >
                  <Search size={15} />
                </button>
              </form>
            </div>

            {/* Drawer Categories Navigation */}
            <div className="flex-1 p-3 space-y-1">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1 kannada">
                ವಿಭಾಗಗಳು
              </p>
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-gray-800 hover:bg-red-50 hover:text-red-700 transition-colors kannada"
                  >
                    <Icon size={16} className="text-red-700" />
                    <span>{link.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              <Link
                to="/login"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full bg-red-700 hover:bg-red-800 text-white text-center py-2 rounded-lg text-sm font-bold block kannada shadow-2xs"
              >
                ಲಾಗಿನ್ / ಖಾತೆ ತೆರೆಯಿರಿ
              </Link>

              {/* Social icons */}
              <div className="flex items-center justify-center gap-3 pt-1">
                <a href="#fb" className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">f</a>
                <a href="#yt" className="w-8 h-8 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">▶</a>
                <a href="#x" className="w-8 h-8 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center">𝕏</a>
                <a href="#wa" className="w-8 h-8 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">✆</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header

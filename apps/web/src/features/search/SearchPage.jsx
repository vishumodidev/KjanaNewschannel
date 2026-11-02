import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { Search, SlidersHorizontal } from 'lucide-react'
import { MOCK_SEARCH_RESULTS } from '../../data/mockNewsData'
import { TrendingWidget } from '../../components/news/TrendingWidget'
import { AdBanner } from '../../components/advertising/AdBanner'

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') || 'ಮೆಟ್ರೋ'
  const [query, setQuery] = useState(initialQuery)
  const [activeFilter, setActiveFilter] = useState('ಎಲ್ಲಾ')

  const filterTabs = ['ಎಲ್ಲಾ', 'ಸುದ್ದಿಗಳು', 'ವೀಡಿಯೋಗಳು', 'ಚಿತ್ರಗಳು', 'ಲೇಖನಗಳು']

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      setSearchParams({ q: query.trim() })
    }
  }

  return (
    <div className="space-y-6">
      {/* ── Search Input & Controls Bar matching Mockup 2 ──────────── */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-2xs space-y-4">
        {/* Search Bar with Red Button */}
        <form onSubmit={handleSearch} className="flex">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ಸುದ್ದಿಗಳನ್ನು ಹುಡುಕಿ..."
              className="w-full bg-gray-50 border border-gray-300 rounded-l-lg py-2.5 px-4 text-sm sm:text-base text-gray-900 focus:outline-none focus:bg-white focus:border-red-600 kannada"
            />
          </div>
          <button
            type="submit"
            className="bg-red-700 hover:bg-red-800 text-white px-5 sm:px-7 rounded-r-lg font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Filter Tabs: ಎಲ್ಲಾ, ಸುದ್ದಿಗಳು, ವೀಡಿಯೋಗಳು, ಚಿತ್ರಗಳು, ಲೇಖನಗಳು */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className={`px-3 py-1 rounded-md text-xs sm:text-sm font-semibold transition-colors kannada cursor-pointer ${
                  activeFilter === tab
                    ? 'bg-red-700 text-white shadow-2xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Results count & Filter button */}
          <div className="flex items-center gap-3 text-xs text-gray-500 kannada">
            <span>ಸುಮಾರು 1,250 ಫಲಿತಾಂಶಗಳು (0.32 ಸೆಕೆಂಡು)</span>
            <button className="flex items-center gap-1 px-2.5 py-1 rounded border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium cursor-pointer">
              <SlidersHorizontal size={12} />
              <span>ಫಿಲ್ಟರ್</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Search Results List (Left 8 cols) + Right Sidebar (4 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Results List */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-4 sm:p-5 divide-y divide-gray-100 shadow-2xs space-y-2">
          {MOCK_SEARCH_RESULTS.map((res) => (
            <Link
              key={res.id}
              to={`/news/${res.slug}`}
              className="flex items-start gap-4 py-3 group cursor-pointer"
            >
              <div className="w-24 h-18 sm:w-32 sm:h-22 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={res.image}
                  alt={res.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-red-50 text-red-700 font-bold text-[10px] px-2 py-0.5 rounded border border-red-200 kannada">
                    {res.category}
                  </span>
                  <span className="text-[11px] text-gray-400 kannada">{res.time}</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-red-700 line-clamp-2 leading-snug kannada transition-colors">
                  {res.headline}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-5">
          <TrendingWidget />
          <AdBanner type="business" />
        </aside>
      </div>
    </div>
  )
}

export default SearchPage


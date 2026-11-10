import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../lib/apiClient'
import { queryKeys } from '../../lib/queryKeys'
import { Eye, Clock } from 'lucide-react'
import { MOCK_KARNATAKA_PAGE } from '../../data/mockNewsData'
import { WeatherWidget } from '../../components/news/WeatherWidget'
import { TrendingWidget } from '../../components/news/TrendingWidget'
import { AdBanner } from '../../components/advertising/AdBanner'

export function CategoryPage() {
  const [activeTab, setActiveTab] = useState('ಇತ್ತೀಚಿನ')

  const categoryQuery = useQuery({
    queryKey: queryKeys.news.list({ category: 'karnataka' }),
    queryFn: () => apiClient.get('/news?category=karnataka&lang=kn'),
  })

  const apiArticles = categoryQuery.data?.data?.articles
  const page = apiArticles?.length
    ? {
        ...MOCK_KARNATAKA_PAGE,
        leadStory: {
          ...MOCK_KARNATAKA_PAGE.leadStory,
          headline: apiArticles[0].headline,
          summary: apiArticles[0].summary,
          slug: apiArticles[0].slug,
        },
      }
    : MOCK_KARNATAKA_PAGE

  return (
    <div className="space-y-6">
      {/* ── Category Header & Sub-Tabs ────────────────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b-2 border-red-700 pb-2">
          <h1 className="text-2xl font-extrabold text-gray-900 kannada">
            {page.title}
          </h1>
        </div>

        {/* Horizontal Sub-tabs (ಇತ್ತೀಚಿನ, ಬೆಂಗಳೂರು, ಮೈಸೂರು, ಮಂಡ್ಯ, etc.) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {page.tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors kannada cursor-pointer ${
                activeTab === tab
                  ? 'bg-red-700 text-white shadow-2xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2-Column Grid: Main Column (8 cols) + Right Sidebar (4 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Main Content */}
        <div className="lg:col-span-8 space-y-6">
          {/* Large Lead Story */}
          <Link
            to={`/news/${page.leadStory.slug}`}
            className="block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow group"
          >
            <div className="aspect-16/9 w-full overflow-hidden bg-gray-900">
              <img
                src={page.leadStory.image}
                alt={page.leadStory.headline}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
            </div>
            <div className="p-4 sm:p-5">
              <span className="bg-red-700 text-white font-bold text-[10px] px-2 py-0.5 rounded kannada">
                {page.leadStory.category}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 group-hover:text-red-700 line-clamp-2 mt-2 leading-tight kannada transition-colors">
                {page.leadStory.headline}
              </h2>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-3 pt-2 border-t border-gray-100 kannada">
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{page.leadStory.time}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{page.leadStory.views}</span>
                </span>
              </div>
            </div>
          </Link>

          {/* Sub Stories List */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 divide-y divide-gray-100 shadow-2xs space-y-2">
            {page.subStories.map((story) => (
              <Link
                key={story.id}
                to={`/news/${story.slug}`}
                className="flex items-start gap-4 py-3 group cursor-pointer"
              >
                <div className="w-24 h-18 sm:w-28 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={story.image}
                    alt={story.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-red-700 line-clamp-2 leading-snug kannada transition-colors">
                    {story.headline}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 kannada">
                    <span>{story.time}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye size={11} />
                      <span>{story.views}</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* District Wise News Grid ("ಜಿಲ್ಲಾವಾರು ಸುದ್ದಿ") matching Mockup 2 */}
          <div className="space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 kannada flex items-center gap-2">
              <span className="w-2.5 h-4 bg-red-700 inline-block rounded-xs" />
              <span>ಜಿಲ್ಲಾವಾರು ಸುದ್ದಿ</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {page.districts.map((d) => (
                <div
                  key={d.name}
                  className="group relative rounded-lg overflow-hidden border border-gray-200 aspect-4/3 cursor-pointer shadow-2xs hover:shadow-md transition-shadow"
                >
                  <img
                    src={d.image}
                    alt={d.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <p className="font-bold text-sm kannada leading-tight">{d.name}</p>
                    <p className="text-[11px] text-gray-300 kannada">{d.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-4 space-y-5">
          <AdBanner type="real-estate" />
          <WeatherWidget />
          <TrendingWidget />
        </aside>
      </div>
    </div>
  )
}

export default CategoryPage


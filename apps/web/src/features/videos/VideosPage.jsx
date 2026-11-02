import { useState } from 'react'
import { Play, Eye, Clock } from 'lucide-react'
import { MOCK_VIDEOS } from '../../data/mockNewsData'
import { TrendingWidget } from '../../components/news/TrendingWidget'
import { AdBanner } from '../../components/advertising/AdBanner'

export function VideosPage() {
  const [activeTab, setActiveTab] = useState('ಎಲ್ಲಾ')
  const tabs = ['ಎಲ್ಲಾ', 'ಕರ್ನಾಟಕ', 'ದೇಶ', 'ವಿಶ್ವ', 'ರಾಜಕೀಯ']
  const { featured, list } = MOCK_VIDEOS

  return (
    <div className="space-y-6">
      {/* ── Page Header & Tabs matching Mockup 2 ──────────────────── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 border-b-2 border-red-700 pb-2">
          <h1 className="text-2xl font-extrabold text-gray-900 kannada">ವೀಡಿಯೋಗಳು</h1>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {tabs.map((tab) => (
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

      {/* ── Main Layout: Videos (Left 8 cols) + Sidebar (Right 4 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Videos Column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Main Featured Video */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs group">
            <div className="relative aspect-16/9 w-full bg-black overflow-hidden cursor-pointer">
              <img
                src={featured.thumbnail}
                alt={featured.headline}
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-90"
              />

              {/* Centered Play Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-red-700/90 group-hover:bg-red-700 text-white flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform">
                  <Play size={28} className="fill-white" />
                </div>
              </div>

              {/* Duration badge */}
              <span className="absolute bottom-3 right-3 bg-black/80 text-white text-xs font-semibold px-2 py-0.5 rounded backdrop-blur-xs">
                {featured.duration}
              </span>
            </div>

            <div className="p-4 sm:p-5">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 kannada leading-snug">
                {featured.headline}
              </h2>
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-2 kannada">
                <span className="flex items-center gap-1">
                  <Eye size={12} />
                  <span>{featured.views}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{featured.time}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Video List (4 items matching mockup) */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 divide-y divide-gray-100 shadow-2xs space-y-2">
            {list.map((video) => (
              <div
                key={video.id}
                className="flex items-start gap-4 py-3 group cursor-pointer"
              >
                {/* Thumbnail with duration */}
                <div className="relative w-28 h-18 sm:w-36 sm:h-22 rounded-lg overflow-hidden bg-gray-900 flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.headline}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-black/60 group-hover:bg-red-700 text-white flex items-center justify-center pl-0.5 transition-colors">
                      <Play size={14} className="fill-white" />
                    </div>
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-medium">
                    {video.duration}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-red-700 line-clamp-2 leading-snug kannada transition-colors">
                    {video.headline}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-2 kannada">
                    <span>{video.views}</span>
                    <span>•</span>
                    <span>{video.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:col-span-4 space-y-5">
          <AdBanner type="business" />
          <TrendingWidget />
        </aside>
      </div>
    </div>
  )
}

export default VideosPage


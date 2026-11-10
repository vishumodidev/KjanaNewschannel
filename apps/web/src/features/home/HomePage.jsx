import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../lib/apiClient'
import { queryKeys } from '../../lib/queryKeys'
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  MessageSquare,
  ArrowRight,
} from 'lucide-react'
import {
  MOCK_FEATURED_STORY,
  MOCK_HERO_SECONDARY_STORIES,
  MOCK_RECENT_MAJOR_STORIES,
} from '../../data/mockNewsData'
import { WeatherWidget } from '../../components/news/WeatherWidget'
import { TrendingWidget } from '../../components/news/TrendingWidget'
import { CategoryPills } from '../../components/news/CategoryPills'
import { AdBanner } from '../../components/advertising/AdBanner'

export function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)

  // Query live published news
  const { data: newsFeed } = useQuery({
    queryKey: queryKeys.news.list({ limit: 4 }),
    queryFn: () => apiClient.get('/news?limit=4&lang=kn'),
    staleTime: 60_000,
  })

  const apiRecentStories = newsFeed?.data?.articles?.length
    ? newsFeed.data.articles.map((art, idx) => ({
        id: art.id,
        category: art.category?.nameKn || 'ಸುದ್ದಿ',
        headline: art.headline,
        image:
          art.featuredImage?.cdnUrl ||
          MOCK_RECENT_MAJOR_STORIES[idx % MOCK_RECENT_MAJOR_STORIES.length]?.image,
        time: art.publishedAt ? new Date(art.publishedAt).toLocaleDateString() : 'ಇತ್ತೀಚೆಗೆ',
        views: `${art.viewCount} ವೀಕ್ಷಣೆ`,
        slug: art.slug,
      }))
    : null

  const recentStories = apiRecentStories || MOCK_RECENT_MAJOR_STORIES

  // Carousel slide triggers (for interactive preview)
  const slides = [
    MOCK_FEATURED_STORY,
    {
      id: 'karnataka-budget-2026',
      category: 'ಕರ್ನಾಟಕ',
      headline: 'ಕರ್ನಾಟಕ ಬಜೆಟ್ 2026: ರೈತರಿಗೆ ಬಡ್ಡಿ ರಹಿತ ಸಾಲ ಮತ್ತು ಹೊಸ ಯೋಜನೆಗಳು ಘೋಷಣೆ',
      summary:
        'ವಿಧಾನಸೌಧದಲ್ಲಿ ಮಂಡಿಸಲಾದ ನೂತನ ಬಜೆಟ್‌ನಲ್ಲಿ ಗ್ರಾಮೀಣ ಮೂಲಸೌಕರ್ಯ ಮತ್ತು ಯುವಕರ ಉದ್ಯೋಗಾವಕಾಶಗಳಿಗೆ ವಿಶೇಷ ಆದ್ಯತೆ ನೀಡಲಾಗಿದೆ.',
      image:
        'https://images.unsplash.com/photo-1590483259837-97592ff9db9f?auto=format&fit=crop&w=1200&q=80',
      date: '16 ಮೇ 2026',
      views: '4.8K ವೀಕ್ಷಣೆ',
      comments: '18 ಕಾಮೆಂಟ್',
      slug: 'karnataka-budget-2026-highlights',
    },
    {
      id: 'isro-chandrayaan-mission',
      category: 'ತಂತ್ರಜ್ಞಾನ',
      headline: 'ಇಸ್ರೋದಿಂದ ಮತ್ತೊಂದು ಐತಿಹಾಸಿಕ ಹೆಜ್ಜೆ: ಗಗನಯಾನ ಸಿದ್ಧತೆ ಅಂತಿಮ ಹಂತಕ್ಕೆ',
      summary:
        'ಭಾರತದ ಮೊದಲ ಮಾನವಸಹಿತ ಬಾಹ್ಯಾಕಾಶ ಯೋಜನೆ ಗಗನಯಾನದ ಪ್ರಮುಖ ಪರೀಕ್ಷೆಗಳು ಯಶಸ್ವಿಯಾಗಿ ಪೂರ್ಣಗೊಂಡಿವೆ.',
      image:
        'https://images.unsplash.com/photo-1517976487507-5b3a4a15a0c8?auto=format&fit=crop&w=1200&q=80',
      date: '16 ಮೇ 2026',
      views: '6.1K ವೀಕ್ಷಣೆ',
      comments: '24 ಕಾಮೆಂಟ್',
      slug: 'isro-gaganyaan-preparations-final-stage',
    },
  ]

  const featured = slides[currentSlide]

  return (
    <div className="space-y-6">
      {/* ── Top Main Hero Section (3-Column Layout matching Mockup 1) ── */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Big Lead Featured Story (~5/12 or 46%) */}
        <div className="lg:col-span-5 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xs group flex flex-col">
          {/* Main Photo with Overlay */}
          <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-900">
            <img
              src={featured.image}
              alt={featured.headline}
              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
            />
            {/* Dark gradient for readable text */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

            {/* Category Badge on image top-left */}
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-red-700 text-white font-bold text-xs px-2.5 py-1 rounded shadow-xs kannada">
                {featured.category}
              </span>
            </div>

            {/* Slider arrows on image */}
            <button
              onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
              aria-label="Previous slide"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>

            <button
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              aria-label="Next slide"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <ChevronRight size={18} />
            </button>

            {/* Headline & Excerpt directly over image bottom */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 text-white">
              <Link to={`/news/${featured.slug}`}>
                <h2 className="text-base sm:text-xl md:text-2xl font-bold leading-tight hover:underline kannada line-clamp-3 sm:line-clamp-none">
                  {featured.headline}
                </h2>
              </Link>
              <p className="text-xs sm:text-sm text-gray-200 mt-2 line-clamp-2 leading-relaxed kannada">
                {featured.summary}
              </p>

              {/* Meta row & Slider dots */}
              <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/20 text-xs text-gray-300">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 kannada">
                    <Clock size={12} />
                    <span>{featured.date}</span>
                  </span>
                  <span className="flex items-center gap-1 kannada">
                    <Eye size={12} />
                    <span>{featured.views}</span>
                  </span>
                  <span className="flex items-center gap-1 kannada hidden sm:flex">
                    <MessageSquare size={12} />
                    <span>{featured.comments}</span>
                  </span>
                </div>

                {/* Dots */}
                <div className="flex items-center gap-1.5">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      aria-label={`Slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all cursor-pointer ${
                        currentSlide === idx ? 'w-5 bg-red-600' : 'w-2 bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column: 5 Stories Stack (~4/12 or 33%) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-lg p-3 divide-y divide-gray-100 shadow-2xs">
          {MOCK_HERO_SECONDARY_STORIES.map((story) => (
            <Link
              key={story.id}
              to={`/news/${story.slug}`}
              className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="w-20 h-16 sm:w-24 sm:h-18 rounded overflow-hidden flex-shrink-0 bg-gray-100">
                <img
                  src={story.image}
                  alt={story.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-red-700 line-clamp-2 leading-snug kannada transition-colors">
                  {story.headline}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-bold text-red-700 kannada">
                    {story.category}
                  </span>
                  <span className="text-[10px] text-gray-400">|</span>
                  <span className="text-[11px] text-gray-500 kannada">{story.time}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Right Column: Weather + Trending News (~3/12 or 25%) */}
        <div className="lg:col-span-3 space-y-4">
          <WeatherWidget />
          <TrendingWidget />
        </div>
      </section>

      {/* ── Category Quick Filter Chips / Pills Row ──────────────── */}
      <section className="bg-white border-y border-gray-200 px-2 py-1">
        <CategoryPills />
      </section>

      {/* ── Recent Major News Section ("ಇತ್ತೀಚಿನ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು") ── */}
      <section className="space-y-4">
        {/* Section Header */}
        <div className="flex items-center justify-between border-b-2 border-red-700 pb-2">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 kannada flex items-center gap-2">
            <span className="w-2.5 h-5 bg-red-700 inline-block rounded-xs" />
            <span>ಇತ್ತೀಚಿನ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು</span>
          </h2>

          <Link
            to="/category/karnataka"
            className="text-xs sm:text-sm font-semibold text-red-700 hover:text-red-800 flex items-center gap-1 kannada group"
          >
            <span>ಎಲ್ಲಾ ಸುದ್ದಿಗಳು</span>
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* 5-Column Grid: 4 News Cards + 1 Ad Banner */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-stretch">
          {/* 4 Major News Cards */}
          {recentStories.map((item) => (
            <Link
              key={item.id}
              to={`/news/${item.slug}`}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col group"
            >
              {/* Image */}
              <div className="relative aspect-16/10 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.headline}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute bottom-2 left-2 bg-red-700 text-white font-bold text-[10px] px-2 py-0.5 rounded kannada">
                  {item.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <h3 className="text-xs sm:text-sm font-bold text-gray-900 group-hover:text-red-700 line-clamp-2 leading-snug kannada transition-colors">
                  {item.headline}
                </h3>

                <div className="flex items-center justify-between text-[11px] text-gray-500 mt-3 pt-2 border-t border-gray-100 kannada">
                  <span>{item.time}</span>
                  <span className="flex items-center gap-1">
                    <Eye size={11} />
                    <span>{item.views}</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}

          {/* 5th Column: Ad Banner Matching Mockup */}
          <div className="sm:col-span-2 lg:col-span-1">
            <AdBanner type="real-estate" />
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage

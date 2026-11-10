import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import apiClient from '../../lib/apiClient'
import { queryKeys } from '../../lib/queryKeys'
import {
  Clock,
  MapPin,
  Bookmark,
  Share2,
  ChevronRight,
  Quote,
} from 'lucide-react'
import { MOCK_ARTICLE_DETAIL } from '../../data/mockNewsData'
import { WeatherWidget } from '../../components/news/WeatherWidget'
import { TrendingWidget } from '../../components/news/TrendingWidget'
import { AdBanner } from '../../components/advertising/AdBanner'

export function ArticleDetailPage() {
  const { slug } = useParams()

  const { data } = useQuery({
    queryKey: queryKeys.news.detail(slug),
    queryFn: () => apiClient.get(`/news/${slug}?lang=kn`),
    enabled: Boolean(slug),
  })

  const apiArticle = data?.data
  const article = apiArticle
    ? {
        ...MOCK_ARTICLE_DETAIL,
        headline: apiArticle.headline,
        summary: apiArticle.summary,
        body: apiArticle.body,
        author: apiArticle.author?.displayName || MOCK_ARTICLE_DETAIL.author,
        location: apiArticle.district?.nameKn || MOCK_ARTICLE_DETAIL.location,
        category: apiArticle.category?.nameKn || MOCK_ARTICLE_DETAIL.category,
        date: apiArticle.publishedAt
          ? new Date(apiArticle.publishedAt).toLocaleDateString()
          : MOCK_ARTICLE_DETAIL.date,
        views: `${apiArticle.viewCount || 0} ವೀಕ್ಷಣೆ`,
        readTime: `${apiArticle.readingTimeMinutes || 3} ನಿಮಿಷ ಓದು`,
        availableTranslations: apiArticle.availableTranslations || [],
      }
    : MOCK_ARTICLE_DETAIL

  return (
    <div className="space-y-6">
      {/* ── Breadcrumb Navigation ─────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 kannada">
        <Link to="/" className="hover:text-red-700 transition-colors">
          ಮುಖಪುಟ
        </Link>
        <ChevronRight size={13} className="text-gray-400" />
        <Link to="/category/karnataka" className="hover:text-red-700 transition-colors">
          ಕರ್ನಾಟಕ
        </Link>
        <ChevronRight size={13} className="text-gray-400" />
        <span className="text-gray-900 font-medium">ಬೆಂಗಳೂರು</span>
      </nav>

      {/* ── Main Layout: Article Body (Left 8 cols) + Sidebar (Right 4 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Article Content Area */}
        <article className="lg:col-span-8 bg-white border border-gray-200 rounded-xl p-3.5 sm:p-7 shadow-2xs space-y-4 sm:space-y-5">
          {/* Headline */}
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight kannada">
            {article.headline}
          </h1>

          {/* Lead Excerpt */}
          <p className="text-xs sm:text-sm md:text-base text-gray-700 font-medium leading-relaxed bg-red-50/50 border-l-4 border-red-700 p-3 sm:p-3.5 rounded-r-md kannada">
            {article.summary}
          </p>

          {/* Author, Location, Date & Social Share Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3 border-y border-gray-200 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                DN
              </div>
              <div>
                <p className="font-bold text-gray-900 kannada flex items-center gap-1.5">
                  <span>{article.author}</span>
                  <span className="text-gray-300">•</span>
                  <span className="text-gray-500 font-normal flex items-center gap-0.5">
                    <MapPin size={11} />
                    <span>{article.location}</span>
                  </span>
                </p>
                <p className="text-gray-500 text-[11px] mt-0.5 kannada flex items-center gap-2">
                  <span>{article.publishedAt}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    <span>{article.readTime}</span>
                  </span>
                </p>
              </div>
            </div>

            {/* Social Share Icons matching Mockup 2 */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-xs flex items-center gap-1 font-medium hidden sm:flex">
                <Share2 size={13} />
                <span>ಹಂಚಿಕೊಳ್ಳಿ</span>
              </span>
              <a
                href="#share-fb"
                aria-label="Share on Facebook"
                className="w-7 h-7 rounded-full bg-blue-600 hover:opacity-90 text-white text-xs font-bold flex items-center justify-center"
              >
                f
              </a>
              <a
                href="#share-x"
                aria-label="Share on X"
                className="w-7 h-7 rounded-full bg-black hover:opacity-90 text-white text-xs font-bold flex items-center justify-center"
              >
                𝕏
              </a>
              <a
                href="#share-wa"
                aria-label="Share on WhatsApp"
                className="w-7 h-7 rounded-full bg-emerald-500 hover:opacity-90 text-white text-xs font-bold flex items-center justify-center"
              >
                ✆
              </a>
              <a
                href="#share-in"
                aria-label="Share on LinkedIn"
                className="w-7 h-7 rounded-full bg-blue-700 hover:opacity-90 text-white text-xs font-bold flex items-center justify-center"
              >
                in
              </a>
              <button
                type="button"
                aria-label="Bookmark"
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Bookmark size={14} />
              </button>
            </div>
          </div>

          {/* Featured Image with Caption */}
          <div className="space-y-1.5">
            <div className="aspect-16/9 w-full rounded-lg overflow-hidden bg-gray-900 shadow-2xs">
              <img
                src={article.featuredImage}
                alt={article.headline}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[11px] text-gray-500 text-center italic kannada">
              {article.caption}
            </p>
          </div>

          {/* Article Body Paragraphs */}
          <div className="space-y-4 text-sm sm:text-base text-gray-800 leading-relaxed article-body kannada">
            {article.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}

            {/* Structured Specs Info Box matching Mockup 2 */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 my-5 space-y-2">
              <h3 className="font-bold text-gray-900 text-sm sm:text-base border-b border-gray-200 pb-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
                <span>{article.specs.title}</span>
              </h3>
              <ul className="space-y-1.5 text-xs sm:text-sm text-gray-700 pl-4 list-disc marker:text-red-600">
                {article.specs.items.map((item, idx) => (
                  <li key={idx} className="font-medium">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Blockquote Quote Box matching Mockup 2 */}
            <div className="relative bg-red-50/70 border-l-4 border-red-700 p-4 rounded-r-lg my-6">
              <Quote className="absolute top-3 right-3 text-red-200" size={32} />
              <blockquote className="text-sm sm:text-base italic font-semibold text-gray-800 relative z-10 leading-snug">
                &ldquo;{article.quote.text}&rdquo;
              </blockquote>
              <p className="text-xs text-red-800 font-bold mt-2 text-right">
                {article.quote.author}
              </p>
            </div>

            <p>
              ಈ ಯೋಜನೆಯ ಮೊದಲ ಹಂತದ ಕಾಮಗಾರಿ 2027ರ ಅಂತ್ಯಕ್ಕೆ ಪೂರ್ಣಗೊಳ್ಳುವ ನಿರೀಕ್ಷೆಯಿದೆ ಎಂದು ಬಿಎಂಆರ್‌ಸಿಎಲ್
              ಅಧಿಕಾರಿಗಳು ತಿಳಿಸಿದ್ದಾರೆ.
            </p>
          </div>

          {/* Related News Section ("ಸಂಬಂಧಿತ ಸುದ್ದಿ") matching Mockup 2 */}
          <div className="pt-6 border-t border-gray-200 space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 kannada flex items-center gap-2">
              <span className="w-2.5 h-4 bg-red-700 inline-block rounded-xs" />
              <span>ಸಂಬಂಧಿತ ಸುದ್ದಿ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {article.relatedNews.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/news/${rel.id}`}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
                >
                  <div className="aspect-16/10 w-full overflow-hidden bg-gray-100">
                    <img
                      src={rel.image}
                      alt={rel.headline}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-2.5">
                    <h4 className="text-xs font-semibold text-gray-900 group-hover:text-red-700 line-clamp-2 kannada leading-snug">
                      {rel.headline}
                    </h4>
                    <span className="text-[10px] text-gray-400 mt-1 block kannada">
                      {rel.time}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </article>

        {/* Right Sidebar: Ad, Weather, Trending */}
        <aside className="lg:col-span-4 space-y-5">
          <AdBanner type="real-estate" />
          <WeatherWidget />
          <TrendingWidget />
        </aside>
      </div>
    </div>
  )
}

export default ArticleDetailPage


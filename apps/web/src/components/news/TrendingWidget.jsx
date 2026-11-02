import { Link } from 'react-router'
import { Flame } from 'lucide-react'
import { MOCK_TRENDING } from '../../data/mockNewsData'

export function TrendingWidget() {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-2xs">
      <div className="flex items-center gap-2 border-b border-gray-100 pb-2.5 mb-3">
        <Flame size={18} className="text-red-600 fill-red-600" />
        <h3 className="text-base font-bold text-gray-900 kannada">ಟ್ರೆಂಡಿಂಗ್ ಸುದ್ದಿಗಳು</h3>
      </div>

      <div className="divide-y divide-gray-100">
        {MOCK_TRENDING.map((item) => (
          <Link
            key={item.rank}
            to={`/news/${item.slug}`}
            className="flex items-start gap-3 py-2.5 group cursor-pointer transition-colors"
          >
            {/* Red circle number */}
            <span className="w-5 h-5 rounded-full bg-red-700 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5 shadow-2xs">
              {item.rank}
            </span>

            <div className="flex-1 min-w-0">
              <h4 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-red-700 line-clamp-2 leading-snug kannada transition-colors">
                {item.title}
              </h4>
              <span className="text-[11px] text-gray-400 font-medium mt-0.5 block kannada">
                {item.views}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}


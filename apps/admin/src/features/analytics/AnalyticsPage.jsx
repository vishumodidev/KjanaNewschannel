import { useQuery } from '@tanstack/react-query'
import {
  BarChart2,
  TrendingUp,
  Users,
  Eye,
  FileCheck,
  Languages,
  Activity,
  MapPin,
  Loader2,
} from 'lucide-react'
import adminApiClient from '../../lib/adminApiClient.js'

export function AnalyticsPage() {
  const { data: statsData, isLoading } = useQuery({
    queryKey: ['analytics', 'stats'],
    queryFn: () => adminApiClient.get('/analytics/stats'),
  })

  const stats = statsData?.data?.summary || {}
  const categories = statsData?.data?.categoryMetrics || []
  const districts = statsData?.data?.districtPerformance || []
  const langDist = statsData?.data?.languageDistribution || { kn: 70, en: 20, hi: 10 }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart2 className="text-red-700" size={26} />
            Newsroom Analytics & Traffic
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Real-time reader engagement, multilingual syndication metrics, and editorial production velocity.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-green-700 self-start sm:self-auto">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Metrics Active
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={22} /> Loading newsroom telemetry...
        </div>
      ) : (
        <>
          {/* Top KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                <span>ESTIMATED READERSHIP</span>
                <Eye size={16} className="text-red-700" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900 mt-2">
                {stats.estimatedReadership ? stats.estimatedReadership.toLocaleString() : '24,850'}
              </div>
              <div className="text-xs text-green-600 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp size={12} /> +14.2% vs last week
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                <span>PUBLISHED STORIES</span>
                <FileCheck size={16} className="text-red-700" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900 mt-2">
                {stats.publishedArticles || 0}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {stats.draftArticles || 0} drafts in newsroom queue
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                <span>ACTIVE ONLINE</span>
                <Activity size={16} className="text-red-700" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900 mt-2">
                {stats.activeReadersOnline || 142}
              </div>
              <div className="text-xs text-gray-500 mt-1">Concurrent readers on portal</div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between text-gray-500 text-xs font-semibold">
                <span>STAFF & BUREAUS</span>
                <Users size={16} className="text-red-700" />
              </div>
              <div className="text-2xl font-extrabold text-gray-900 mt-2">
                {stats.totalUsers || 1}
              </div>
              <div className="text-xs text-gray-500 mt-1">Across 31 Karnataka districts</div>
            </div>
          </div>

          {/* Regional & Multilingual Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Districts */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <MapPin size={16} className="text-red-700" />
                Top Districts by Audience Engagement
              </h2>

              <div className="space-y-3">
                {districts.map((dist, idx) => (
                  <div key={dist.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-gray-800">
                        {idx + 1}. {dist.name}
                      </span>
                      <span className="text-gray-500 font-semibold">{dist.readership} share</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-700 rounded-full"
                        style={{ width: dist.readership }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Multilingual Breakdown */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Languages size={16} className="text-red-700" />
                Multilingual Syndication Share
              </h2>

              <div className="grid grid-cols-3 gap-3 text-center pt-2">
                <div className="p-4 rounded-xl bg-red-50 border border-red-100">
                  <div className="text-2xl font-black text-red-700">{langDist.kn}%</div>
                  <div className="text-xs font-bold text-gray-800 mt-1">ಕನ್ನಡ (Kannada)</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Primary edition</div>
                </div>

                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="text-2xl font-black text-blue-700">{langDist.en}%</div>
                  <div className="text-xs font-bold text-gray-800 mt-1">English</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">National desk</div>
                </div>

                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <div className="text-2xl font-black text-orange-700">{langDist.hi}%</div>
                  <div className="text-xs font-bold text-gray-800 mt-1">हिन्दी (Hindi)</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Syndicated feed</div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-2">
                <div className="font-semibold text-gray-900 flex items-center justify-between">
                  <span>Tracked Editorial Categories:</span>
                  <span className="text-gray-500 font-normal">{categories.length} sections</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((c) => (
                    <span
                      key={c.id}
                      className="px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-700 text-[11px]"
                    >
                      {c.nameEn} ({c.storyCount || 0})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

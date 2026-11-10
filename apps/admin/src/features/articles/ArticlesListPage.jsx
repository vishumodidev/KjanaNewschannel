import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { PlusCircle, Search, Filter, FileText } from 'lucide-react'
import adminApiClient from '../../lib/adminApiClient.js'

export function ArticlesListPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['adminArticles', selectedStatus],
    queryFn: () => {
      const url = selectedStatus
        ? `/editorial/queue?status=${selectedStatus}`
        : '/editorial/queue'
      return adminApiClient.get(url)
    },
  })

  const articles = data?.data?.articles || []

  const filtered = articles.filter((a) =>
    searchTerm
      ? a.headline.toLowerCase().includes(searchTerm.toLowerCase())
      : true,
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles Directory</h1>
          <p className="text-sm text-gray-500 mt-1">
            Browse, search, and edit news stories authored across all bureaus and districts.
          </p>
        </div>

        <Link
          to="/articles/new"
          className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle size={16} />
          <span>New Article</span>
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search headline..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={14} className="text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-500 text-gray-700"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="APPROVED">Approved</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading articles...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 text-sm">
            {error.message || 'Failed to fetch articles.'}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            <FileText size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="font-medium text-gray-700">No articles found.</p>
            <p className="text-xs text-gray-400 mt-1">
              Create a new story using the button above.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3">Headline</th>
                  <th className="px-6 py-3">Language</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">District</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((art) => (
                  <tr key={art.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900 max-w-md">
                      {art.headline}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold uppercase text-gray-600">
                      {art.language?.code || 'kn'}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {art.category?.nameKn || art.category?.nameEn || '—'}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-600">
                      {art.district?.nameKn || art.district?.nameEn || 'All Karnataka'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-800">
                        {art.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {art.author?.displayName || 'Reporter'}
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-400">
                      {new Date(art.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ArticlesListPage

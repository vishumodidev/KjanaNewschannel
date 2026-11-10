import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, AlertCircle, Clock, Send, ShieldAlert } from 'lucide-react'
import adminApiClient from '../../lib/adminApiClient.js'

export function ReviewQueuePage() {
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState('')
  const [actionError, setActionError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Query editorial queue
  const { data, isLoading, error } = useQuery({
    queryKey: ['editorialQueue', selectedStatus],
    queryFn: () => {
      const url = selectedStatus
        ? `/editorial/queue?status=${selectedStatus}`
        : '/editorial/queue'
      return adminApiClient.get(url)
    },
  })

  // Status transition mutation
  const transitionMutation = useMutation({
    mutationFn: ({ articleId, targetStatus, comment }) =>
      adminApiClient.patch(`/editorial/articles/${articleId}/status`, {
        targetStatus,
        comment,
      }),
    onSuccess: (res, vars) => {
      setActionError('')
      setSuccessMsg(`Article status transitioned to ${vars.targetStatus} successfully!`)
      queryClient.invalidateQueries({ queryKey: ['editorialQueue'] })
      setTimeout(() => setSuccessMsg(''), 4000)
    },
    onError: (err) => {
      setActionError(err.message || 'Failed to update article status.')
    },
  })

  const articles = data?.data?.articles || []
  const total = data?.data?.pagination?.total || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Desk Review Queue</h1>
          <p className="text-sm text-gray-500 mt-1">
            Review submitted articles, fact-check, request revisions, and approve for publishing.
          </p>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-lg border border-gray-200 text-xs shadow-sm">
          {[
            { label: 'All Active', val: '' },
            { label: 'Submitted', val: 'SUBMITTED' },
            { label: 'In Review', val: 'IN_REVIEW' },
            { label: 'Fact Check', val: 'FACT_CHECK' },
            { label: 'Approved', val: 'APPROVED' },
          ].map((tab) => (
            <button
              key={tab.label}
              onClick={() => setSelectedStatus(tab.val)}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                selectedStatus === tab.val
                  ? 'bg-red-700 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {actionError && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Queue Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">
            Pending Queue ({total} {total === 1 ? 'story' : 'stories'})
          </h2>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-gray-400 text-sm">Loading queue...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500 text-sm">
            {error.message || 'Unable to connect to backend API.'}
          </div>
        ) : articles.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-sm">
            <Clock size={32} className="mx-auto text-gray-300 mb-2" />
            <p className="font-medium text-gray-700">No articles pending in this queue.</p>
            <p className="text-xs text-gray-400 mt-1">Submitted stories from reporters will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {articles.map((art) => (
              <div key={art.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-red-100 text-red-800">
                        {art.category?.nameKn || art.category?.nameEn || 'General'}
                      </span>
                      {art.district && (
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-gray-100 text-gray-700">
                          {art.district.nameKn || art.district.nameEn}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700">
                        {art.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900 leading-snug">
                      {art.headline}
                    </h3>

                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-400">
                      <span>Author: {art.author?.displayName || 'Reporter'}</span>
                      <span>•</span>
                      <span>Created: {new Date(art.createdAt).toLocaleDateString()}</span>
                      {art.commentCount > 0 && (
                        <>
                          <span>•</span>
                          <span>{art.commentCount} editorial notes</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Editorial Actions */}
                  <div className="flex items-center gap-2 flex-wrap flex-shrink-0">
                    {art.status === 'SUBMITTED' && (
                      <button
                        onClick={() =>
                          transitionMutation.mutate({
                            articleId: art.id,
                            targetStatus: 'IN_REVIEW',
                            comment: 'Picked up for desk review',
                          })
                        }
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold cursor-pointer"
                      >
                        Start Review
                      </button>
                    )}

                    {['SUBMITTED', 'IN_REVIEW'].includes(art.status) && (
                      <button
                        onClick={() =>
                          transitionMutation.mutate({
                            articleId: art.id,
                            targetStatus: 'FACT_CHECK',
                            comment: 'Sent to fact-checking desk',
                          })
                        }
                        className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-semibold cursor-pointer"
                      >
                        Fact Check
                      </button>
                    )}

                    {['IN_REVIEW', 'FACT_CHECK'].includes(art.status) && (
                      <button
                        onClick={() =>
                          transitionMutation.mutate({
                            articleId: art.id,
                            targetStatus: 'APPROVED',
                            comment: 'Approved by desk editor',
                          })
                        }
                        className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <CheckCircle2 size={13} />
                        <span>Approve</span>
                      </button>
                    )}

                    {art.status === 'APPROVED' && (
                      <button
                        onClick={() =>
                          transitionMutation.mutate({
                            articleId: art.id,
                            targetStatus: 'PUBLISHED',
                            comment: 'Published to live reader portal',
                          })
                        }
                        className="px-3 py-1.5 bg-red-700 hover:bg-red-800 text-white rounded text-xs font-semibold cursor-pointer flex items-center gap-1"
                      >
                        <Send size={13} />
                        <span>Publish Live</span>
                      </button>
                    )}

                    {/* Direct emergency publish option */}
                    <button
                      onClick={() => {
                        if (confirm('Publish this story immediately as an emergency bulletin?')) {
                          transitionMutation.mutate({
                            articleId: art.id,
                            targetStatus: 'PUBLISHED',
                            comment: 'Emergency fast-track publication',
                          })
                        }
                      }}
                      title="Emergency Fast-Track Publish"
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                    >
                      <ShieldAlert size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewQueuePage

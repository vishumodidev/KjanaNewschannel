import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Save, AlertCircle, CheckCircle2, Globe, Tag, Sparkles } from 'lucide-react'
import adminApiClient from '../../lib/adminApiClient.js'

export function ArticleEditorPage() {
  const navigate = useNavigate()

  const [languageCode, setLanguageCode] = useState('kn')
  const [categoryId, setCategoryId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [headline, setHeadline] = useState('')
  const [subheadline, setSubheadline] = useState('')
  const [summary, setSummary] = useState('')
  const [body, setBody] = useState('')
  const [tagsInput, setTagsInput] = useState('')
  const [isBreaking, setIsBreaking] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)

  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // Load Categories
  const { data: catData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => adminApiClient.get('/taxonomy/categories'),
  })

  // Load Karnataka Districts
  const { data: districtData } = useQuery({
    queryKey: ['districts'],
    queryFn: () => adminApiClient.get('/taxonomy/districts?stateId=1'),
  })

  const categories = catData?.data || []
  const districts = districtData?.data || []

  // Create Story Mutation
  const createMutation = useMutation({
    mutationFn: (payload) => adminApiClient.post('/stories', payload),
    onSuccess: () => {
      setSuccessMsg('Story created successfully!')
      setTimeout(() => {
        navigate('/editorial/queue')
      }, 1500)
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to create story.')
    },
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!headline || headline.trim().length < 5) {
      setErrorMsg('Headline must be at least 5 characters.')
      return
    }

    if (!categoryId) {
      setErrorMsg('Please select a category.')
      return
    }

    if (!body || body.trim().length < 10) {
      setErrorMsg('Article content must be at least 10 characters.')
      return
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)

    createMutation.mutate({
      primaryLanguageCode: languageCode,
      categoryId: Number(categoryId),
      stateId: 1, // Karnataka
      districtId: districtId ? Number(districtId) : undefined,
      headline: headline.trim(),
      subheadline: subheadline.trim() || undefined,
      summary: summary.trim() || undefined,
      body: body.trim(),
      tags,
      isBreaking,
      isFeatured,
      priority: isBreaking ? 90 : 0,
    })
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Create News Story</h1>
          <p className="text-sm text-gray-500 mt-1">
            Author an editorial story in Kannada, English, or Hindi with district scope.
          </p>
        </div>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{successMsg}</span>
        </div>
      )}
      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Authoring Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5">
          {/* Taxonomy & Location Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Globe size={13} className="text-gray-400" />
                <span>Primary Language</span>
              </label>
              <select
                value={languageCode}
                onChange={(e) => setLanguageCode(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="kn">ಕನ್ನಡ (Kannada — Primary)</option>
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nameKn} ({c.nameEn})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Karnataka District
              </label>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 bg-white"
              >
                <option value="">All Karnataka / State-level</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.nameKn} ({d.nameEn})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Headline */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Headline *
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. ಕರ್ನಾಟಕ ಸರ್ಕಾರದಿಂದ ಹೊಸ ಶೈಕ್ಷಣಿಕ ನೀತಿ ಪ್ರಕಟಣೆ"
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-base font-semibold focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Subheadline */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Subheadline / Kicker
            </label>
            <input
              type="text"
              value={subheadline}
              onChange={(e) => setSubheadline(e.target.value)}
              placeholder="Short supporting context or kicker"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Summary */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Summary (1-2 sentences)
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Brief summary displayed on social shares and news cards"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Article Body */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Article Content *
            </label>
            <textarea
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write the full news story here..."
              required
              className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm font-normal leading-relaxed focus:ring-2 focus:ring-red-500 font-sans"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag size={13} className="text-gray-400" />
              <span>Tags (comma-separated)</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="ಬೆಂಗಳೂರು, ರಾಜಕೀಯ, ಶಿಕ್ಷಣ"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Options: Breaking & Featured */}
          <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={isBreaking}
                onChange={(e) => setIsBreaking(e.target.checked)}
                className="w-4 h-4 text-red-600 rounded border-gray-300 focus:ring-red-500"
              />
              <span className="flex items-center gap-1 text-red-700 font-semibold">
                <Sparkles size={14} />
                <span>Mark as Breaking News Ticker</span>
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
              />
              <span>Top Story Carousel</span>
            </label>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/articles')}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={createMutation.isPending}
            className="px-5 py-2.5 bg-red-700 hover:bg-red-800 disabled:bg-red-300 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Save size={16} />
            <span>{createMutation.isPending ? 'Saving…' : 'Save Story Draft'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default ArticleEditorPage

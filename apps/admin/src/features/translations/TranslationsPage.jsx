import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Languages, CheckCircle2, AlertCircle, UserPlus } from 'lucide-react'
import adminApiClient from '../../lib/adminApiClient.js'

export function TranslationsPage() {
  const [targetLang, setTargetLang] = useState('en')
  const [selectedStoryId, setSelectedStoryId] = useState('')
  const [assigneeId, setAssigneeId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [notes, setNotes] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Load published articles from editorial queue
  const { data: queueData } = useQuery({
    queryKey: ['editorialQueue', 'PUBLISHED'],
    queryFn: () => adminApiClient.get('/editorial/queue?status=PUBLISHED'),
  })

  const publishedStories = queueData?.data?.articles || []

  // Assign Translation Mutation
  const assignMutation = useMutation({
    mutationFn: ({ storyId, payload }) =>
      adminApiClient.post(`/editorial/stories/${storyId}/translations`, payload),
    onSuccess: () => {
      setSuccessMsg('Translation task assigned successfully!')
      setSelectedStoryId('')
      setNotes('')
      setTimeout(() => setSuccessMsg(''), 4000)
    },
    onError: (err) => {
      setErrorMsg(err.message || 'Failed to dispatch translation task.')
    },
  })

  const handleAssign = (e) => {
    e.preventDefault()
    setErrorMsg('')

    if (!selectedStoryId) {
      setErrorMsg('Please select a source story.')
      return
    }

    if (!assigneeId) {
      setErrorMsg('Please enter the translator staff ID.')
      return
    }

    assignMutation.mutate({
      storyId: selectedStoryId,
      payload: {
        targetLanguageCode: targetLang,
        assigneeId: Number(assigneeId),
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        notes: notes.trim() || undefined,
      },
    })
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Multilingual Translation Hub</h1>
        <p className="text-sm text-gray-500 mt-1">
          Coordinate bilingual expansion from primary Kannada reporting into English and Hindi editions.
        </p>
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

      {/* Assign Form */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Languages size={18} className="text-red-700" />
          <span>Dispatch New Translation Assignment</span>
        </h2>

        <form onSubmit={handleAssign} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Source News Story (Kannada Edition) *
            </label>
            <select
              value={selectedStoryId}
              onChange={(e) => setSelectedStoryId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select published story...</option>
              {publishedStories.map((s) => (
                <option key={s.id} value={s.storyId}>
                  {s.headline} ({s.category?.nameKn})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Target Language *
              </label>
              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-red-500"
              >
                <option value="en">English (en)</option>
                <option value="hi">हिन्दी / Hindi (hi)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Assignee Staff ID *
              </label>
              <input
                type="number"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                placeholder="e.g. 1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
                Deadline / Due Date
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1.5">
              Editorial Instructions / Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Provide tone guidelines, names transliteration instructions, or context..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              disabled={assignMutation.isPending}
              className="px-5 py-2.5 bg-red-700 hover:bg-red-800 disabled:bg-red-300 text-white rounded-lg text-sm font-semibold shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
            >
              <UserPlus size={16} />
              <span>{assignMutation.isPending ? 'Assigning…' : 'Assign Translation Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TranslationsPage

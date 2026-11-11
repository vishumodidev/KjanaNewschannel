import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Image,
  Upload,
  Search,
  Copy,
  Check,
  ExternalLink,
  Plus,
  X,
  FileImage,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import adminApiClient from '../../lib/adminApiClient.js'

export function MediaLibraryPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [uploadOpen, setUploadOpen] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  // Upload modal form state
  const [selectedFile, setSelectedFile] = useState(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [caption, setCaption] = useState('')
  const [credit, setCredit] = useState('')
  const [uploadError, setUploadError] = useState('')

  // Query media list
  const { data: mediaData, isLoading } = useQuery({
    queryKey: ['media', 'list'],
    queryFn: () => adminApiClient.get('/media?limit=50'),
  })

  const mediaList = mediaData?.data?.items || []

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (payload) => {
      return adminApiClient.post('/media/upload', payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] })
      resetModal()
    },
    onError: (err) => {
      setUploadError(err.message || 'Failed to upload media.')
    },
  })

  const resetModal = () => {
    setSelectedFile(null)
    setPreviewUrl('')
    setAltText('')
    setCaption('')
    setCredit('')
    setUploadError('')
    setUploadOpen(false)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).')
      return
    }
    setUploadError('')
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = () => setPreviewUrl(reader.result)
    reader.readAsDataURL(file)
  }

  const handleUploadSubmit = (e) => {
    e.preventDefault()
    if (!selectedFile || !previewUrl) {
      setUploadError('Please select a file to upload.')
      return
    }

    const base64Data = previewUrl.split(',')[1]
    uploadMutation.mutate({
      filename: selectedFile.name,
      mimeType: selectedFile.type,
      dataBase64: base64Data,
      altText,
      caption,
      credit,
    })
  }

  const copyToClipboard = (url, id) => {
    navigator.clipboard.writeText(url)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const filteredMedia = mediaList.filter((item) => {
    if (!search) return true
    const q = search.toLowerCase()
    return (
      item.originalName?.toLowerCase().includes(q) ||
      item.altText?.toLowerCase().includes(q) ||
      item.caption?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Image className="text-red-700" size={26} />
            Media Library
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Store, optimize, and distribute photographic and editorial assets across JANA NEWS NETWORK.
          </p>
        </div>

        <button
          onClick={() => setUploadOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white text-sm font-semibold rounded-lg hover:bg-red-800 transition shadow-sm"
        >
          <Plus size={16} />
          Upload Image
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search media by title, alt text..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
          />
        </div>
        <div className="text-xs text-gray-500 font-medium">
          Showing <span className="font-semibold text-gray-800">{filteredMedia.length}</span> assets
        </div>
      </div>

      {/* Media Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mr-2" size={22} /> Loading media assets...
        </div>
      ) : filteredMedia.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <FileImage size={48} className="mx-auto text-gray-300 mb-3" />
          <h3 className="text-base font-semibold text-gray-800">No media assets found</h3>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            Upload images to populate the newsroom digital asset library.
          </p>
          <button
            onClick={() => setUploadOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 text-white text-sm font-semibold rounded-lg hover:bg-red-800 transition"
          >
            <Upload size={15} /> Upload First Image
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden flex items-center justify-center">
                <img
                  src={item.publicUrl}
                  alt={item.altText || item.originalName}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
                  onError={(e) => {
                    e.target.style.display = 'none'
                  }}
                />
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs font-semibold text-gray-800 truncate" title={item.originalName}>
                    {item.originalName}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    {item.width && item.height ? `${item.width}×${item.height} px • ` : ''}
                    {item.fileSizeBytes ? `${Math.round(item.fileSizeBytes / 1024)} KB` : ''}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => copyToClipboard(item.publicUrl, item.id)}
                    className="flex items-center gap-1 text-gray-600 hover:text-red-700 font-medium transition"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check size={13} className="text-green-600" />
                        <span className="text-green-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  <a
                    href={item.publicUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {uploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Upload size={18} className="text-red-700" />
                Upload New Image Asset
              </h2>
              <button
                onClick={resetModal}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
              {uploadError && (
                <div className="flex items-start gap-2 bg-red-50 text-red-700 p-3 rounded-lg text-xs">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* File Dropzone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Image File (Max 20MB)
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
              </div>

              {previewUrl && (
                <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Alt Text (Screen readers & SEO)
                </label>
                <input
                  type="text"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. Chief Minister addresses press conference in Vidhana Soudha"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Short description"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Credit / Photographer
                  </label>
                  <input
                    type="text"
                    value={credit}
                    onChange={(e) => setCredit(e.target.value)}
                    placeholder="e.g. JANA News Desk"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={resetModal}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="flex items-center gap-2 px-5 py-2 bg-red-700 text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition disabled:opacity-50"
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Uploading...
                    </>
                  ) : (
                    'Upload Asset'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

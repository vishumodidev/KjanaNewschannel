import { useState } from 'react'
import {
  Settings,
  Save,
  CheckCircle,
  Globe,
  Shield,
  Layers,
} from 'lucide-react'

export function SettingsPage() {
  const [saved, setSaved] = useState(false)

  const [brandEn, setBrandEn] = useState('JANA NEWS NETWORK')
  const [brandKn, setBrandKn] = useState('ಜನಾ ನ್ಯೂಸ್ ನೆಟ್‌ವರ್ಕ್')
  const [slogan, setSlogan] = useState('ಸತ್ಯ | ಸಮಗ್ರ | ಜನರ ಧ್ವನಿ')
  const [primaryLang, setPrimaryLang] = useState('kn')
  const [requireFactCheck, setRequireFactCheck] = useState(true)
  const [autoDispatchTranslation, setAutoDispatchTranslation] = useState(true)
  const [retentionDays, setRetentionDays] = useState('90')

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="text-red-700" size={26} />
            Newsroom Settings
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure global newsroom publication branding, editorial workflow gates, and translation policies.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-xs font-semibold animate-in fade-in">
            <CheckCircle size={14} /> Settings Saved
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand & Masthead */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
            <Globe size={16} className="text-red-700" />
            Brand Identity & Masthead
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                English Brand Name
              </label>
              <input
                type="text"
                value={brandEn}
                onChange={(e) => setBrandEn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Kannada Masthead Title (ಕನ್ನಡ ಶೀರ್ಷಿಕೆ)
              </label>
              <input
                type="text"
                value={brandKn}
                onChange={(e) => setBrandKn(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Masthead Tagline / Slogan
            </label>
            <input
              type="text"
              value={slogan}
              onChange={(e) => setSlogan(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 font-medium"
            />
          </div>
        </div>

        {/* Editorial Workflow Policies */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
            <Shield size={16} className="text-red-700" />
            Editorial Workflow Gates
          </h2>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={requireFactCheck}
                onChange={(e) => setRequireFactCheck(e.target.checked)}
                className="rounded border-gray-300 text-red-700 focus:ring-red-600 h-4 w-4"
              />
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  Mandatory Fact-Check Gate for Breaking News
                </div>
                <div className="text-xs text-gray-500">
                  Requires Fact-Checker role approval before breaking news stories appear on the live portal ticker.
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50/50 cursor-pointer">
              <input
                type="checkbox"
                checked={autoDispatchTranslation}
                onChange={(e) => setAutoDispatchTranslation(e.target.checked)}
                className="rounded border-gray-300 text-red-700 focus:ring-red-600 h-4 w-4"
              />
              <div>
                <div className="text-sm font-semibold text-gray-800">
                  Auto-Dispatch Translation Tasks
                </div>
                <div className="text-xs text-gray-500">
                  Immediately generate English and Hindi translation assignments when a primary Kannada article reaches APPROVED state.
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Primary Language & Retention */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2">
            <Layers size={16} className="text-red-700" />
            Localization & Storage
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Default Editorial Language
              </label>
              <select
                value={primaryLang}
                onChange={(e) => setPrimaryLang(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="kn">Kannada (ಕನ್ನಡ) — Primary</option>
                <option value="en">English — National</option>
                <option value="hi">Hindi (हिन्दी) — Syndicated</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Media & Version Retention (Days)
              </label>
              <input
                type="number"
                value={retentionDays}
                onChange={(e) => setRetentionDays(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-red-700 text-white rounded-lg text-sm font-semibold hover:bg-red-800 transition shadow-sm"
          >
            <Save size={16} />
            Save Newsroom Settings
          </button>
        </div>
      </form>
    </div>
  )
}

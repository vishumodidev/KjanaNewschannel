// ── Supported languages ───────────────────────────────────────────────────────

/** @typedef {{ code: string, nameNative: string, nameEnglish: string, direction: 'ltr'|'rtl' }} Language */

/** @type {readonly Language[]} */
export const SUPPORTED_LANGUAGES = Object.freeze([
  { code: 'kn', nameNative: 'ಕನ್ನಡ',   nameEnglish: 'Kannada', direction: 'ltr' },
  { code: 'en', nameNative: 'English', nameEnglish: 'English', direction: 'ltr' },
  { code: 'hi', nameNative: 'हिन्दी',   nameEnglish: 'Hindi',   direction: 'ltr' },
])

/** Default language code for the platform */
export const DEFAULT_LANGUAGE_CODE = 'kn'

/** Map of language code → language object for quick lookup */
export const LANGUAGE_MAP = Object.freeze(
  Object.fromEntries(SUPPORTED_LANGUAGES.map((lang) => [lang.code, lang])),
)


import crypto from 'crypto'

/**
 * Kannada character to Roman phonetic mapping
 */
const KANNADA_CHAR_MAP = {
  // Vowels
  'ಅ': 'a', 'ಆ': 'aa', 'ಇ': 'i', 'ಈ': 'ee', 'ಉ': 'u', 'ಊ': 'oo',
  'ಋ': 'ru', 'ಎ': 'e', 'ಏ': 'ee', 'ಐ': 'ai', 'ಒ': 'o', 'ಓ': 'oo',
  'ಔ': 'au', 'ಅಂ': 'am', 'ಅಃ': 'aha',
  // Consonants (inherent 'a' attached, handled by virama '್')
  'ಕ': 'ka', 'ಖ': 'kha', 'ಗ': 'ga', 'ಘ': 'gha', 'ಙ': 'nga',
  'ಚ': 'cha', 'ಛ': 'chha', 'ಜ': 'ja', 'ಝ': 'jha', 'ಞ': 'nya',
  'ಟ': 'ta', 'ಠ': 'tha', 'ಡ': 'da', 'ಢ': 'dha', 'ಣ': 'na',
  'ತ': 'ta', 'ಥ': 'tha', 'ದ': 'da', 'ಧ': 'dha', 'ನ': 'na',
  'ಪ': 'pa', 'ಫ': 'pha', 'ಬ': 'ba', 'ಭ': 'bha', 'ಮ': 'ma',
  'ಯ': 'ya', 'ರ': 'ra', 'ಱ': 'ra', 'ಲ': 'la', 'ವ': 'va',
  'ಶ': 'sha', 'ಷ': 'sha', 'ಸ': 'sa', 'ಹ': 'ha', 'ಳ': 'la',
  // Matras (vowel signs) - replaces the inherent 'a' of preceding consonant
  'ಾ': 'aa', 'ಿ': 'i', 'ೀ': 'ee', 'ು': 'u', 'ೂ': 'oo',
  'ೃ': 'ru', 'ೆ': 'e', 'ೇ': 'ee', 'ೈ': 'ai', 'ೊ': 'o',
  'ೋ': 'oo', 'ೌ': 'au', 'ಂ': 'm', 'ಃ': 'h',
}

/**
 * Devanagari character to Roman phonetic mapping
 */
const DEVANAGARI_CHAR_MAP = {
  'अ': 'a', 'आ': 'aa', 'इ': 'i', 'ई': 'ee', 'उ': 'u', 'ऊ': 'oo',
  'ऋ': 'ri', 'ए': 'e', 'ऐ': 'ai', 'ओ': 'o', 'औ': 'au',
  'क': 'ka', 'ख': 'kha', 'ग': 'ga', 'घ': 'gha', 'ङ': 'nga',
  'च': 'cha', 'छ': 'chha', 'ज': 'ja', 'झ': 'jha', 'ञ': 'nya',
  'ट': 'ta', 'ठ': 'tha', 'ड': 'da', 'ढ': 'dha', 'ण': 'na',
  'त': 'ta', 'थ': 'tha', 'द': 'da', 'ध': 'dha', 'न': 'na',
  'प': 'pa', 'फ': 'pha', 'ब': 'ba', 'भ': 'bha', 'म': 'ma',
  'य': 'ya', 'र': 'ra', 'ल': 'la', 'व': 'va', 'श': 'sha',
  'ष': 'sha', 'स': 'sa', 'ह': 'ha',
  'ा': 'aa', 'ि': 'i', 'ी': 'ee', 'ु': 'u', 'ू': 'oo',
  'ृ': 'ri', 'े': 'e', 'ै': 'ai', 'ो': 'o', 'ौ': 'au',
  'ं': 'm', 'ः': 'h',
}

/**
 * Transliterate Indic characters into phonetic Latin representation.
 */
function transliterateIndic(str) {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const nextChar = str[i + 1]

    // Handle Kannada virama (halant '್' suppresses trailing 'a')
    if (nextChar === '್' && KANNADA_CHAR_MAP[char]) {
      const latin = KANNADA_CHAR_MAP[char]
      result += latin.endsWith('a') ? latin.slice(0, -1) : latin
      i++ // skip virama
      continue
    }

    // Handle Devanagari virama (halant '्')
    if (nextChar === '्' && DEVANAGARI_CHAR_MAP[char]) {
      const latin = DEVANAGARI_CHAR_MAP[char]
      result += latin.endsWith('a') ? latin.slice(0, -1) : latin
      i++ // skip virama
      continue
    }

    // Handle Matras which replace previous vowel
    if (KANNADA_CHAR_MAP[char] && 'ಾಿೀುೂೃೆೇೈೊೋೌ'.includes(char)) {
      if (result.endsWith('a')) {
        result = result.slice(0, -1)
      }
      result += KANNADA_CHAR_MAP[char]
      continue
    }

    if (DEVANAGARI_CHAR_MAP[char] && 'ािीुूृेैोौ'.includes(char)) {
      if (result.endsWith('a')) {
        result = result.slice(0, -1)
      }
      result += DEVANAGARI_CHAR_MAP[char]
      continue
    }

    if (KANNADA_CHAR_MAP[char]) {
      result += KANNADA_CHAR_MAP[char]
    } else if (DEVANAGARI_CHAR_MAP[char]) {
      result += DEVANAGARI_CHAR_MAP[char]
    } else {
      result += char
    }
  }

  return result
}

/**
 * Generate a clean, SEO-friendly, language-aware slug.
 *
 * @param {string} text - Title or headline in Kannada, Hindi, or English
 * @param {object} [options]
 * @param {boolean} [options.withSuffix=true] - Appends 4-char random hex suffix for collision prevention
 * @param {number} [options.maxLength=80] - Maximum slug length (excluding suffix)
 * @returns {string} Clean URL slug
 */
export function slugify(text, { withSuffix = true, maxLength = 80 } = {}) {
  if (!text || typeof text !== 'string') {
    return `story-${crypto.randomBytes(3).toString('hex')}`
  }

  // 1. Transliterate Indic characters if present
  let processed = transliterateIndic(text.trim())

  // 2. Normalize and strip non-ASCII marks
  processed = processed
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()

  // 3. Replace non-alphanumeric characters with hyphens
  processed = processed
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

  // 4. Truncate cleanly at hyphen boundary if possible
  if (processed.length > maxLength) {
    const cut = processed.slice(0, maxLength)
    const lastHyphen = cut.lastIndexOf('-')
    processed = lastHyphen > 20 ? cut.slice(0, lastHyphen) : cut
  }

  if (!processed) {
    processed = 'story'
  }

  // 5. Append short hash suffix for collision resistance
  if (withSuffix) {
    const suffix = crypto.randomBytes(2).toString('hex')
    return `${processed}-${suffix}`
  }

  return processed
}

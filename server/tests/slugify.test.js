import test from 'node:test'
import assert from 'node:assert/strict'
import { slugify } from '../src/utils/slugify.js'

test('slugify transliterates Kannada headline correctly', () => {
  const kannadaHeadline = 'ಕರ್ನಾಟಕ ಸರ್ಕಾರದಿಂದ ಹೊಸ ಶೈಕ್ಷಣಿಕ ನೀತಿ ಪ್ರಕಟಣೆ'
  const slug = slugify(kannadaHeadline, { withSuffix: false })

  assert.ok(slug.startsWith('karnaataka-sarkaaradimda-hosa'))
  assert.ok(/^[a-z0-9-]+$/.test(slug), 'Slug must only contain ASCII alphanumeric characters and hyphens')
  assert.ok(!slug.includes(' '), 'Slug must not contain spaces')
})

test('slugify handles English headlines and generates URL-safe slug', () => {
  const englishHeadline = 'Karnataka Metro Phase-3 Project Approved by Union Cabinet!'
  const slug = slugify(englishHeadline, { withSuffix: false })

  assert.equal(slug, 'karnataka-metro-phase-3-project-approved-by-union-cabinet')
})

test('slugify withSuffix appends random hex string for collision avoidance', () => {
  const slug1 = slugify('Breaking News', { withSuffix: true })
  const slug2 = slugify('Breaking News', { withSuffix: true })

  assert.ok(slug1.startsWith('breaking-news-'))
  assert.ok(slug2.startsWith('breaking-news-'))
  assert.notEqual(slug1, slug2, 'Two calls must produce unique suffixes')
})

test('slugify handles Hindi text', () => {
  const hindiHeadline = 'भारत का नया अंतरिक्ष अभियान सफल'
  const slug = slugify(hindiHeadline, { withSuffix: false })

  assert.ok(slug.includes('bhaarata'))
  assert.ok(/^[a-z0-9-]+$/.test(slug))
})

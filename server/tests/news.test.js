import test from 'node:test'
import assert from 'node:assert/strict'
import { NewsService } from '../src/modules/news/news.service.js'
import { TaxonomyService } from '../src/modules/taxonomy/taxonomy.service.js'

test('NewsService.getPublishedNews maps articles and pagination correctly', async () => {
  const mockArticles = [
    {
      id: 101n,
      storyId: 50n,
      headline: 'ಕರ್ನಾಟಕದಲ್ಲಿ ಭಾರಿ ಮಳೆ ಸಾಧ್ಯತೆ',
      slug: 'karnataka-rain-alert-a1b2',
      summary: '5 ಜಿಲ್ಲೆಗಳಿಗೆ ಆರೆಂಜ್ ಅಲರ್ಟ್ ಘೋಷಿಸಲಾಗಿದೆ',
      body: 'ಹವಾಮಾನ ಇಲಾಖೆ ವರದಿ ಪ್ರಕಾರ ಕರ್ನಾಟಕದ ಕರಾವಳಿ ಹಾಗೂ ಮಲೆನಾಡು ಜಿಲ್ಲೆಗಳಲ್ಲಿ...',
      isBreaking: true,
      isFeatured: false,
      publishedAt: new Date('2026-05-16T08:00:00Z'),
      viewCount: 15400n,
      story: {
        category: { id: 1, slug: 'karnataka', nameEn: 'Karnataka', nameKn: 'ಕರ್ನಾಟಕ' },
        district: { id: 5, code: 'KA_BLG', nameEn: 'Belagavi', nameKn: 'ಬೆಳಗಾವಿ' },
        state: { id: 1, code: 'KA', nameEn: 'Karnataka', nameKn: 'ಕರ್ನಾಟಕ' },
      },
      author: { id: 10n, displayName: 'Basavaraj Patil', avatarUrl: null },
      featuredImage: null,
    },
  ]

  const mockRepo = {
    findLanguageByCode: async (code) => (code === 'kn' ? { id: 1, code: 'kn' } : null),
    findPublishedArticles: async () => ({ total: 1, articles: mockArticles }),
  }

  const service = new NewsService(mockRepo)
  const result = await service.getPublishedNews({ lang: 'kn', page: 1, limit: 10 })

  assert.equal(result.articles.length, 1)
  assert.equal(result.articles[0].id, '101')
  assert.equal(result.articles[0].headline, 'ಕರ್ನಾಟಕದಲ್ಲಿ ಭಾರಿ ಮಳೆ ಸಾಧ್ಯತೆ')
  assert.equal(result.articles[0].category.slug, 'karnataka')
  assert.equal(result.articles[0].district.nameKn, 'ಬೆಳಗಾವಿ')
  assert.equal(result.pagination.total, 1)
  assert.equal(result.pagination.totalPages, 1)
})

test('NewsService.getArticleBySlug returns details and translations', async () => {
  const mockArticle = {
    id: 101n,
    storyId: 50n,
    headline: 'ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ಹಂತ-3 ಯೋಜನೆಗೆ ಕೇಂದ್ರ ಒಪ್ಪಿಗೆ',
    subheadline: 'ರೂ. 28,500 ಕೋಟಿ ಅಂದಾಜು ವೆಚ್ಚ',
    slug: 'bengaluru-metro-phase-3-x9z1',
    summary: 'ಸಂಪುಟ ಸಭೆಯಲ್ಲಿ ಮಹತ್ವದ ಅನುಮೋದನೆ ದೊರೆತಿದೆ',
    body: 'ಬೆಂಗಳೂರಿನ ಸಾರಿಗೆ ವ್ಯವಸ್ಥೆಗೆ ಮತ್ತಷ್ಟು ವೇಗ ನೀಡಲು ನಮ್ಮ ಮೆಟ್ರೋ ಹಂತ-3 ಯೋಜನೆಗೆ ಅನುಮೋದನೆ...',
    isBreaking: false,
    isFeatured: true,
    publishedAt: new Date('2026-05-16T10:00:00Z'),
    viewCount: 4200n,
    seoTitle: 'ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ಹಂತ-3 ವಿವರಗಳು',
    seoDescription: 'ನಮ್ಮ ಮೆಟ್ರೋ 3ನೇ ಹಂತದ ಪೂರ್ಣ ಮಾಹಿತಿ',
    story: {
      category: { id: 1, slug: 'karnataka', nameEn: 'Karnataka', nameKn: 'ಕರ್ನಾಟಕ' },
      district: { id: 1, code: 'KA_BLRU', nameEn: 'Bengaluru Urban', nameKn: 'ಬೆಂಗಳೂರು ನಗರ' },
      state: { id: 1, code: 'KA', nameEn: 'Karnataka', nameKn: 'ಕರ್ನಾಟಕ' },
      articles: [
        {
          id: 102n,
          slug: 'bengaluru-metro-phase-3-english-y4w2',
          headline: 'Union Cabinet Approves Bengaluru Metro Phase 3',
          language: { id: 2, code: 'en', nameNative: 'English', nameEnglish: 'English' },
        },
      ],
    },
    author: {
      id: 12n,
      displayName: 'Girish Kumar',
      avatarUrl: null,
      employeeProfile: { designation: 'Urban Transport Reporter', department: 'Editorial' },
    },
    editor: { id: 5n, displayName: 'Senior Editor' },
    featuredImage: null,
    articleTags: [
      { tag: { id: 3, slug: 'namma-metro', name: 'ನಮ್ಮ ಮೆಟ್ರೋ' } },
    ],
  }

  const mockRepo = {
    findLanguageByCode: async () => ({ id: 1, code: 'kn' }),
    findArticleBySlug: async () => mockArticle,
    incrementArticleViewCount: async () => ({ id: 101n, viewCount: 4201n }),
  }

  const service = new NewsService(mockRepo)
  const result = await service.getArticleBySlug({ slug: 'bengaluru-metro-phase-3-x9z1', langCode: 'kn' })

  assert.equal(result.id, '101')
  assert.equal(result.headline, 'ಬೆಂಗಳೂರು ಮೆಟ್ರೋ ಹಂತ-3 ಯೋಜನೆಗೆ ಕೇಂದ್ರ ಒಪ್ಪಿಗೆ')
  assert.equal(result.availableTranslations.length, 1)
  assert.equal(result.availableTranslations[0].languageCode, 'en')
  assert.equal(result.tags[0].name, 'ನಮ್ಮ ಮೆಟ್ರೋ')
})

test('NewsService.createStory generates slug and calls repository in transaction', async () => {
  let createdPayload = null

  const mockRepo = {
    findLanguageByCode: async () => ({ id: 1, code: 'kn' }),
    createStoryWithArticle: async (data) => {
      createdPayload = data
      return {
        story: { id: 99n },
        article: { id: 201n, slug: data.articleData.slug, status: 'DRAFT' },
      }
    },
  }

  const mockTax = {
    resolveOrCreateTags: async () => [{ id: 1 }, { id: 2 }],
  }

  const service = new NewsService(mockRepo, mockTax)
  const result = await service.createStory({
    authorId: 10,
    payload: {
      primaryLanguageCode: 'kn',
      categoryId: 1,
      districtId: 5,
      headline: 'ಕರ್ನಾಟಕ ನೂತನ ನೀರಾವರಿ ಯೋಜನೆಗೆ ಅಸ್ತು',
      summary: 'ಉತ್ತರ ಕರ್ನಾಟಕದ ರೈತರಿಗೆ ವರದಾನವಾಗಲಿರುವ ಹೊಸ ಯೋಜನೆ',
      body: 'ಸರ್ಕಾರವು ಬಜೆಟ್‌ನಲ್ಲಿ ಘೋಷಿಸಿದಂತೆ ನೂತನ ನೀರಾವರಿ ಯೋಜನೆಗೆ ಚಾಲನೆ ನೀಡಲಾಗಿದೆ...',
      tags: ['ನೀರಾವರಿ', 'ಕರ್ನಾಟಕ'],
    },
  })

  assert.equal(result.storyId, '99')
  assert.equal(result.articleId, '201')
  assert.equal(result.status, 'DRAFT')
  assert.ok(result.slug.startsWith('karnaataka-nootana-neeraavari'))
  assert.equal(createdPayload.tagIds.length, 2)
  assert.equal(createdPayload.storyData.districtId, 5)
})

test('TaxonomyService returns categories and languages', async () => {
  const mockRepo = {
    findAllLanguages: async () => [
      { id: 1, code: 'kn', nameNative: 'ಕನ್ನಡ' },
      { id: 2, code: 'en', nameNative: 'English' },
    ],
    findAllCategories: async () => [
      { id: 1, slug: 'karnataka', nameKn: 'ಕರ್ನಾಟಕ' },
      { id: 2, slug: 'india', nameKn: 'ದೇಶ' },
    ],
  }

  const taxService = new TaxonomyService(mockRepo)
  const languages = await taxService.getLanguages()
  const categories = await taxService.getCategories()

  assert.equal(languages.length, 2)
  assert.equal(categories.length, 2)
  assert.equal(categories[0].slug, 'karnataka')
})


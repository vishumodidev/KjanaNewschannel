import { newsRepository } from './news.repository.js'
import { taxonomyService } from '../taxonomy/taxonomy.service.js'
import { slugify } from '../../utils/slugify.js'
import { AppError } from '../../errors/AppError.js'
import { logger } from '../../config/logger.config.js'

function estimateReadingTime(text) {
  if (!text) return 1
  const wordCount = text.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / 180))
}

function formatMedia(img) {
  if (!img) return null
  return {
    ...img,
    id: img.id?.toString(),
    cdnUrl:
      img.cdnUrl ||
      (img.storageKey
        ? img.storageKey.startsWith('http')
          ? img.storageKey
          : `/uploads/${img.storageKey}`
        : null),
  }
}

export class NewsService {
  constructor(repository = newsRepository, taxService = taxonomyService) {
    this.repository = repository
    this.taxonomyService = taxService
  }

  async _resolveLanguage(code = 'kn') {
    const lang = await this.repository.findLanguageByCode(code.toLowerCase())
    if (!lang) {
      throw AppError.notFound(`Language with code '${code}' is not supported.`)
    }
    return lang
  }

  async getPublishedNews(query) {
    const lang = await this._resolveLanguage(query.lang)

    const { total, articles } = await this.repository.findPublishedArticles({
      languageId: lang.id,
      categorySlug: query.category,
      districtId: query.districtId,
      stateId: query.stateId,
      isBreaking: query.isBreaking,
      isFeatured: query.isFeatured,
      page: query.page,
      limit: query.limit,
    })

    const data = articles.map((art) => ({
      id: art.id.toString(),
      storyId: art.storyId.toString(),
      headline: art.headline,
      slug: art.slug,
      summary: art.summary,
      readingTimeMinutes: estimateReadingTime(art.body),
      isBreaking: art.isBreaking,
      isFeatured: art.isFeatured,
      publishedAt: art.publishedAt,
      viewCount: art.viewCount.toString(),
      category: art.story.category,
      district: art.story.district,
      state: art.story.state,
      author: art.author,
      featuredImage: formatMedia(art.featuredImage),
    }))

    return {
      articles: data,
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    }
  }

  async getArticleBySlug({ slug, langCode = 'kn' }) {
    const lang = await this._resolveLanguage(langCode)
    const article = await this.repository.findArticleBySlug({ slug, languageId: lang.id })

    if (!article) {
      throw AppError.notFound(`Article '${slug}' not found in language '${langCode}'.`)
    }

    // Increment view count in background
    this.repository.incrementArticleViewCount(article.id).catch((err) => {
      logger.warn({ err: err.message, articleId: article.id.toString() }, 'Failed to increment view count')
    })

    return {
      id: article.id.toString(),
      storyId: article.storyId.toString(),
      languageCode: lang.code,
      headline: article.headline,
      subheadline: article.subheadline,
      slug: article.slug,
      summary: article.summary,
      body: article.body,
      readingTimeMinutes: estimateReadingTime(article.body),
      isBreaking: article.isBreaking,
      isFeatured: article.isFeatured,
      publishedAt: article.publishedAt,
      viewCount: (article.viewCount + 1n).toString(),
      seoTitle: article.seoTitle || article.headline,
      seoDescription: article.seoDescription || article.summary,
      category: article.story.category,
      district: article.story.district,
      state: article.story.state,
      author: article.author,
      editor: article.editor,
      featuredImage: formatMedia(article.featuredImage),
      tags: article.articleTags.map((at) => at.tag),
      availableTranslations: article.story.articles
        .filter((trans) => trans.id !== article.id)
        .map((trans) => ({
          languageCode: trans.language.code,
          languageNative: trans.language.nameNative,
          slug: trans.slug,
          headline: trans.headline,
        })),
    }
  }

  async getBreakingTicker(langCode = 'kn') {
    const lang = await this._resolveLanguage(langCode)
    const items = await this.repository.findBreakingNews({ languageId: lang.id, limit: 10 })

    return items.map((item) => ({
      id: item.id.toString(),
      headline: item.headline,
      slug: item.slug,
      publishedAt: item.publishedAt,
      category: item.story.category,
    }))
  }

  async getTrendingNews(langCode = 'kn') {
    const lang = await this._resolveLanguage(langCode)
    const items = await this.repository.findTrendingNews({ languageId: lang.id, limit: 5 })

    return items.map((item, index) => ({
      rank: index + 1,
      id: item.id.toString(),
      headline: item.headline,
      slug: item.slug,
      viewCount: item.viewCount.toString(),
      publishedAt: item.publishedAt,
      category: item.story.category,
      thumbnailUrl: formatMedia(item.featuredImage)?.cdnUrl,
    }))
  }

  async createStory({ payload, authorId }) {
    const lang = await this._resolveLanguage(payload.primaryLanguageCode)

    // Generate unique transliterated slug
    const slug = slugify(payload.headline, { withSuffix: true })

    // Resolve tags if provided
    let tagIds = []
    if (payload.tags && payload.tags.length > 0) {
      const createdTags = await this.taxonomyService.resolveOrCreateTags(payload.tags)
      tagIds = createdTags.map((t) => t.id)
    }

    const storyData = {
      primaryLanguageId: lang.id,
      categoryId: payload.categoryId,
      stateId: payload.stateId || null,
      districtId: payload.districtId || null,
      priority: payload.priority || 0,
      createdById: BigInt(authorId),
    }

    const articleData = {
      languageId: lang.id,
      headline: payload.headline,
      subheadline: payload.subheadline,
      slug,
      summary: payload.summary,
      body: payload.body,
      status: 'DRAFT',
      authorId: BigInt(authorId),
      isBreaking: payload.isBreaking || false,
      isFeatured: payload.isFeatured || false,
      seoTitle: payload.seoTitle,
      seoDescription: payload.seoDescription,
    }

    const result = await this.repository.createStoryWithArticle({
      storyData,
      articleData,
      tagIds,
    })

    return {
      storyId: result.story.id.toString(),
      articleId: result.article.id.toString(),
      slug: result.article.slug,
      status: result.article.status,
    }
  }
}

export const newsService = new NewsService()


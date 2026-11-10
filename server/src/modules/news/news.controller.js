import { newsService } from './news.service.js'

export class NewsController {
  constructor(service = newsService) {
    this.service = service
  }

  getNewsFeed = async (req, res, next) => {
    try {
      const result = await this.service.getPublishedNews(req.query)
      res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
      res.status(200).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }

  getArticleBySlug = async (req, res, next) => {
    try {
      const { slug } = req.params
      const langCode = req.query.lang || 'kn'
      const article = await this.service.getArticleBySlug({ slug, langCode })
      res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=600')
      res.status(200).json({ success: true, data: article })
    } catch (err) {
      next(err)
    }
  }

  getBreakingTicker = async (req, res, next) => {
    try {
      const langCode = req.query.lang || 'kn'
      const ticker = await this.service.getBreakingTicker(langCode)
      res.setHeader('Cache-Control', 'public, max-age=30')
      res.status(200).json({ success: true, data: ticker })
    } catch (err) {
      next(err)
    }
  }

  getTrendingNews = async (req, res, next) => {
    try {
      const langCode = req.query.lang || 'kn'
      const trending = await this.service.getTrendingNews(langCode)
      res.setHeader('Cache-Control', 'public, max-age=300')
      res.status(200).json({ success: true, data: trending })
    } catch (err) {
      next(err)
    }
  }

  createStory = async (req, res, next) => {
    try {
      const authorId = req.user.userId
      const result = await this.service.createStory({
        payload: req.body,
        authorId,
      })

      res.status(201).json({
        success: true,
        data: result,
      })
    } catch (err) {
      next(err)
    }
  }
}

export const newsController = new NewsController()

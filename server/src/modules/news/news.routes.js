import { Router } from 'express'
import { newsController } from './news.controller.js'
import { createStorySchema, newsQuerySchema } from './news.schema.js'
import { validate } from '../../middleware/validate.js'
import { authenticate } from '../../middleware/authenticate.js'
import { requirePermission, requireScope } from '../../middleware/authorize.js'

export const newsRouter = Router()
export const storiesRouter = Router()

// ── Public News Feed & Reader Endpoints ─────────────────────────────────────
newsRouter.get('/breaking', newsController.getBreakingTicker)
newsRouter.get('/trending', newsController.getTrendingNews)
newsRouter.get('/', validate(newsQuerySchema, 'query'), newsController.getNewsFeed)
newsRouter.get('/:slug', newsController.getArticleBySlug)

// ── Authenticated Newsroom Story Authoring Endpoints ─────────────────────────
storiesRouter.post(
  '/',
  authenticate,
  requirePermission('story.create'),
  requireScope({
    resolveResource: (req) => ({
      stateId: req.body.stateId,
      districtId: req.body.districtId,
      categoryId: req.body.categoryId,
    }),
  }),
  validate(createStorySchema),
  newsController.createStory,
)


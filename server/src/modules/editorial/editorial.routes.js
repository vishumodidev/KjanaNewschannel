import { Router } from 'express'
import { editorialController } from './editorial.controller.js'
import {
  transitionStatusSchema,
  updateArticleSchema,
  addCommentSchema,
  assignTranslationSchema,
  editorialQueueQuerySchema,
} from './editorial.schema.js'
import { validate } from '../../middleware/validate.js'
import { authenticate } from '../../middleware/authenticate.js'
import { requirePermission } from '../../middleware/authorize.js'

export const editorialRouter = Router()

// All editorial routes require staff authentication
editorialRouter.use(authenticate)

// ── Editorial Queue ──────────────────────────────────────────────────────────
editorialRouter.get(
  '/queue',
  requirePermission('story.review', 'story.edit', 'story.publish'),
  validate(editorialQueueQuerySchema, 'query'),
  editorialController.getQueue,
)

// ── Article Workflow Transitions & Edits ─────────────────────────────────────
editorialRouter.patch(
  '/articles/:id/status',
  requirePermission('story.edit', 'story.publish', 'story.review'),
  validate(transitionStatusSchema),
  editorialController.transitionStatus,
)

editorialRouter.patch(
  '/articles/:id/content',
  requirePermission('story.edit'),
  validate(updateArticleSchema),
  editorialController.updateContent,
)

editorialRouter.post(
  '/articles/:id/comments',
  requirePermission('story.comment', 'story.review', 'story.edit'),
  validate(addCommentSchema),
  editorialController.addComment,
)

editorialRouter.get(
  '/articles/:id/versions',
  requirePermission('story.review', 'story.edit', 'story.publish'),
  editorialController.getVersions,
)

// ── Translation Workflow Assignments ─────────────────────────────────────────
editorialRouter.post(
  '/stories/:id/translations',
  requirePermission('story.assign', 'story.edit'),
  validate(assignTranslationSchema),
  editorialController.assignTranslation,
)

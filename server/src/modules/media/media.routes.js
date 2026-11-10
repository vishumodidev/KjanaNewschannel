import { Router } from 'express'
import { mediaController } from './media.controller.js'
import { authenticate } from '../../middleware/authenticate.js'
import { requirePermission } from '../../middleware/authorize.js'

export const mediaRouter = Router()

mediaRouter.use(authenticate)

mediaRouter.post(
  '/upload',
  requirePermission('media.upload', 'story.create', 'story.edit'),
  mediaController.upload,
)

mediaRouter.get(
  '/',
  requirePermission('media.upload', 'story.create', 'story.edit'),
  mediaController.list,
)

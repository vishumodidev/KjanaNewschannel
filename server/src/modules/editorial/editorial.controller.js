import { editorialService } from './editorial.service.js'

export class EditorialController {
  constructor(service = editorialService) {
    this.service = service
  }

  transitionStatus = async (req, res, next) => {
    try {
      const { id } = req.params
      const { targetStatus, comment, scheduledAt } = req.body

      const result = await this.service.transitionStatus({
        articleId: id,
        targetStatus,
        user: req.user,
        comment,
        scheduledAt,
      })

      res.status(200).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }

  updateContent = async (req, res, next) => {
    try {
      const { id } = req.params
      const result = await this.service.updateArticleContent({
        articleId: id,
        updateData: req.body,
        user: req.user,
      })

      res.status(200).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }

  addComment = async (req, res, next) => {
    try {
      const { id } = req.params
      const { commentText } = req.body

      const result = await this.service.addComment({
        articleId: id,
        user: req.user,
        commentText,
      })

      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }

  getVersions = async (req, res, next) => {
    try {
      const { id } = req.params
      const versions = await this.service.getVersions(id)

      res.status(200).json({ success: true, data: versions })
    } catch (err) {
      next(err)
    }
  }

  assignTranslation = async (req, res, next) => {
    try {
      const { id } = req.params // story id
      const result = await this.service.assignTranslation({
        storyId: id,
        user: req.user,
        payload: req.body,
      })

      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }

  getQueue = async (req, res, next) => {
    try {
      const result = await this.service.getQueue(req.query)
      res.status(200).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
}

export const editorialController = new EditorialController()

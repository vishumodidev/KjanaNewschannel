import { mediaService } from './media.service.js'

export class MediaController {
  constructor(service = mediaService) {
    this.service = service
  }

  upload = async (req, res, next) => {
    try {
      // In base64 or multipart upload body
      const { filename, mimeType, dataBase64, altText, caption, credit } = req.body
      const fileBuffer = Buffer.from(dataBase64, 'base64')

      const result = await this.service.uploadMedia({
        fileBuffer,
        originalName: filename || 'image.jpg',
        mimeType: mimeType || 'image/jpeg',
        altText,
        caption,
        credit,
        user: req.user,
      })

      res.status(201).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }

  list = async (req, res, next) => {
    try {
      const page = req.query.page ? Number(req.query.page) : 1
      const limit = req.query.limit ? Number(req.query.limit) : 20
      const result = await this.service.listMedia({ page, limit })

      res.status(200).json({ success: true, data: result })
    } catch (err) {
      next(err)
    }
  }
}

export const mediaController = new MediaController()

import fs from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { mediaRepository } from './media.repository.js'
import { appConfig } from '../../config/app.config.js'
import { AppError } from '../../errors/AppError.js'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

export class MediaService {
  constructor(repository = mediaRepository) {
    this.repository = repository
  }

  async uploadMedia({ fileBuffer, originalName, mimeType, altText, caption, credit, user }) {
    if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
      throw AppError.badRequest(
        `Unsupported media type: ${mimeType}. Allowed types: [${ALLOWED_MIME_TYPES.join(', ')}]`,
      )
    }

    const maxBytes = appConfig.storage.maxFileSizeMb * 1024 * 1024
    if (fileBuffer.length > maxBytes) {
      throw AppError.badRequest(`File size exceeds maximum limit of ${appConfig.storage.maxFileSizeMb}MB.`)
    }

    const ext = path.extname(originalName) || '.jpg'
    const uniqueName = `${crypto.randomUUID()}${ext}`
    const storageDir = path.resolve(appConfig.storage.localPath)

    await fs.mkdir(storageDir, { recursive: true })
    const filePath = path.join(storageDir, uniqueName)
    await fs.writeFile(filePath, fileBuffer)

    const cdnUrl = `/uploads/${uniqueName}`

    const record = await this.repository.createMediaAsset({
      filename: originalName,
      storageKey: uniqueName,
      storageDriver: 'local',
      mimeType,
      sizeBytes: fileBuffer.length,
      altText,
      caption,
      credit,
      uploadedById: user.userId,
    })

    return {
      id: record.id.toString(),
      filename: record.filename,
      cdnUrl,
      mimeType: record.mimeType,
      sizeBytes: record.sizeBytes.toString(),
      createdAt: record.createdAt,
    }
  }

  async listMedia({ page = 1, limit = 20 } = {}) {
    const { total, assets } = await this.repository.findMediaAssets({ page, limit })

    return {
      assets: assets.map((a) => ({
        id: a.id.toString(),
        filename: a.filename,
        cdnUrl: `/uploads/${a.storageKey}`,
        mimeType: a.mimeType,
        sizeBytes: a.sizeBytes.toString(),
        altText: a.altText,
        caption: a.caption,
        credit: a.credit,
        uploadedBy: a.uploadedBy,
        createdAt: a.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    }
  }
}

export const mediaService = new MediaService()


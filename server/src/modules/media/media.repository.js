import prisma from '../../lib/prisma.js'

export class MediaRepository {
  async createMediaAsset(data) {
    return prisma.mediaAsset.create({
      data: {
        filename: data.filename,
        storageKey: data.storageKey,
        storageDriver: data.storageDriver || 'local',
        mimeType: data.mimeType,
        sizeBytes: BigInt(data.sizeBytes),
        width: data.width || null,
        height: data.height || null,
        altText: data.altText || null,
        caption: data.caption || null,
        credit: data.credit || null,
        uploadedById: BigInt(data.uploadedById),
      },
      include: {
        uploadedBy: { select: { id: true, displayName: true } },
      },
    })
  }

  async findMediaAssets({ page = 1, limit = 20 } = {}) {
    const [total, assets] = await Promise.all([
      prisma.mediaAsset.count(),
      prisma.mediaAsset.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: { select: { id: true, displayName: true } },
        },
      }),
    ])

    return { total, assets }
  }
}

export const mediaRepository = new MediaRepository()

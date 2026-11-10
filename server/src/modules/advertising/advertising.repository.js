import prisma from '../../lib/prisma.js'

export class AdvertisingRepository {
  async findActivePlacementBySlot(slotCode) {
    const now = new Date()
    return prisma.adPlacement.findFirst({
      where: {
        slotCode,
        isActive: true,
        campaign: {
          isActive: true,
          startDate: { lte: now },
          endDate: { gte: now },
        },
      },
      include: {
        campaign: {
          select: { name: true, advertiser: { select: { name: true } } },
        },
      },
    })
  }
}

export const advertisingRepository = new AdvertisingRepository()


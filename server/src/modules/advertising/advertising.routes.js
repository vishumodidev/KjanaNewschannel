import { Router } from 'express'
import { advertisingRepository } from './advertising.repository.js'

export const adsRouter = Router()

adsRouter.get('/slot/:slotCode', async (req, res, next) => {
  try {
    const { slotCode } = req.params
    const ad = await advertisingRepository.findActivePlacementBySlot(slotCode)

    if (!ad) {
      return res.status(200).json({ success: true, data: null })
    }

    res.status(200).json({
      success: true,
      data: {
        id: ad.id,
        slotCode: ad.slotCode,
        imageUrl: ad.imageUrl,
        targetUrl: ad.targetUrl,
        headline: ad.headline,
        ctaText: ad.ctaText,
        advertiserName: ad.campaign.advertiser.name,
      },
    })
  } catch (err) {
    next(err)
  }
})


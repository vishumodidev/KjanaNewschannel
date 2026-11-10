import { taxonomyService } from './taxonomy.service.js'

export class TaxonomyController {
  constructor(service = taxonomyService) {
    this.service = service
  }

  getLanguages = async (_req, res, next) => {
    try {
      const languages = await this.service.getLanguages()
      res.setHeader('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400')
      res.status(200).json({ success: true, data: languages })
    } catch (err) {
      next(err)
    }
  }

  getCategories = async (req, res, next) => {
    try {
      const navOnly = req.query.nav === 'true'
      const categories = await this.service.getCategories({ navOnly })
      res.setHeader('Cache-Control', 'public, max-age=1800, stale-while-revalidate=43200')
      res.status(200).json({ success: true, data: categories })
    } catch (err) {
      next(err)
    }
  }

  getStates = async (_req, res, next) => {
    try {
      const states = await this.service.getStates()
      res.setHeader('Cache-Control', 'public, max-age=86400')
      res.status(200).json({ success: true, data: states })
    } catch (err) {
      next(err)
    }
  }

  getDistricts = async (req, res, next) => {
    try {
      const stateId = req.query.stateId ? Number(req.query.stateId) : undefined
      const districts = await this.service.getDistricts({ stateId })
      res.setHeader('Cache-Control', 'public, max-age=86400')
      res.status(200).json({ success: true, data: districts })
    } catch (err) {
      next(err)
    }
  }

  getTags = async (req, res, next) => {
    try {
      const { q, limit } = req.query
      const tags = await this.service.getTags({ query: q, limit })
      res.status(200).json({ success: true, data: tags })
    } catch (err) {
      next(err)
    }
  }
}

export const taxonomyController = new TaxonomyController()

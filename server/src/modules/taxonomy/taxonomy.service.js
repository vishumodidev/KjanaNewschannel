import { taxonomyRepository } from './taxonomy.repository.js'
import { AppError } from '../../errors/AppError.js'
import { slugify } from '../../utils/slugify.js'

export class TaxonomyService {
  constructor(repository = taxonomyRepository) {
    this.repository = repository
  }

  async getLanguages() {
    return this.repository.findAllLanguages()
  }

  async getCategories({ navOnly = false } = {}) {
    return this.repository.findAllCategories({ navOnly })
  }

  async getCategoryBySlug(slug) {
    const category = await this.repository.findCategoryBySlug(slug)
    if (!category) {
      throw AppError.notFound(`Category with slug '${slug}' not found.`)
    }
    return category
  }

  async getStates() {
    return this.repository.findAllStates()
  }

  async getDistricts({ stateId } = {}) {
    return this.repository.findDistricts({ stateId })
  }

  async getTags({ query = '', limit = 20 } = {}) {
    return this.repository.searchTags(query, { limit: Math.min(Number(limit) || 20, 50) })
  }

  async resolveOrCreateTags(tagNames = []) {
    const results = []
    for (const rawName of tagNames) {
      const name = rawName.trim()
      if (!name) continue
      const slug = slugify(name, { withSuffix: false })
      const tag = await this.repository.findOrCreateTag(name, slug)
      results.push(tag)
    }
    return results
  }
}

export const taxonomyService = new TaxonomyService()


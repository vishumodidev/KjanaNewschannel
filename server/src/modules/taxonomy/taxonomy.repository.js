import prisma from '../../lib/prisma.js'

export class TaxonomyRepository {
  async findAllLanguages({ activeOnly = true } = {}) {
    return prisma.language.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
    })
  }

  async findAllCategories({ activeOnly = true } = {}) {
    const where = {}
    if (activeOnly) where.isActive = true

    return prisma.category.findMany({
      where,
      orderBy: { sortOrder: 'asc' },
    })
  }

  async findCategoryBySlug(slug) {
    return prisma.category.findUnique({
      where: { slug },
    })
  }

  async findAllStates() {
    return prisma.state.findMany({
      orderBy: { nameEn: 'asc' },
    })
  }

  async findDistricts({ stateId } = {}) {
    const where = {}
    if (stateId) where.stateId = Number(stateId)

    return prisma.district.findMany({
      where,
      include: {
        state: {
          select: { id: true, code: true, nameEn: true, nameKn: true },
        },
      },
      orderBy: { nameEn: 'asc' },
    })
  }

  async searchTags(query = '', { limit = 20 } = {}) {
    const where = query ? { name: { contains: query } } : {}
    return prisma.tag.findMany({
      where,
      take: limit,
      orderBy: { id: 'desc' },
    })
  }

  async findOrCreateTag(name, slug) {
    return prisma.tag.upsert({
      where: { slug },
      update: {},
      create: {
        name,
        slug,
      },
    })
  }
}

export const taxonomyRepository = new TaxonomyRepository()


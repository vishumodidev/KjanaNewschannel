import prisma from '../../lib/prisma.js'

export class TaxonomyRepository {
  async findAllLanguages({ activeOnly = true } = {}) {
    return prisma.language.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: [{ isDefault: 'desc' }, { id: 'asc' }],
    })
  }

  async findAllCategories({ activeOnly = true, navOnly = false } = {}) {
    const where = {}
    if (activeOnly) where.isActive = true
    if (navOnly) where.isNav = true

    return prisma.category.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
    })
  }

  async findCategoryBySlug(slug) {
    return prisma.category.findUnique({
      where: { slug },
    })
  }

  async findAllStates({ activeOnly = true } = {}) {
    return prisma.state.findMany({
      where: activeOnly ? { isActive: true } : {},
      orderBy: { nameEn: 'asc' },
    })
  }

  async findDistricts({ stateId, activeOnly = true } = {}) {
    const where = {}
    if (stateId) where.stateId = Number(stateId)
    if (activeOnly) where.isActive = true

    return prisma.district.findMany({
      where,
      include: {
        state: {
          select: { id: true, code: true, nameEn: true, nameKn: true },
        },
      },
      orderBy: [{ displayOrder: 'asc' }, { nameEn: 'asc' }],
    })
  }

  async searchTags(query = '', { limit = 20 } = {}) {
    const where = query ? { name: { contains: query } } : {}
    return prisma.tag.findMany({
      where,
      take: limit,
      orderBy: { usageCount: 'desc' },
    })
  }

  async findOrCreateTag(name, slug) {
    return prisma.tag.upsert({
      where: { slug },
      update: {
        usageCount: { increment: 1 },
      },
      create: {
        name,
        slug,
        usageCount: 1,
      },
    })
  }
}

export const taxonomyRepository = new TaxonomyRepository()

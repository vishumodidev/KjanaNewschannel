import prisma from '../../lib/prisma.js'

export class NewsRepository {
  async findLanguageByCode(code) {
    return prisma.language.findUnique({ where: { code } })
  }

  async findPublishedArticles({
    languageId,
    categorySlug,
    districtId,
    stateId,
    isBreaking,
    isFeatured,
    page = 1,
    limit = 10,
  }) {
    const where = {
      status: 'PUBLISHED',
      languageId,
      ...(isBreaking !== undefined && { isBreaking }),
      ...(isFeatured !== undefined && { isFeatured }),
      story: {
        status: 'ACTIVE',
        ...(categorySlug && { category: { slug: categorySlug } }),
        ...(districtId && { districtId }),
        ...(stateId && { stateId }),
      },
    }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        include: {
          story: {
            include: {
              category: { select: { id: true, slug: true, nameEn: true, nameKn: true } },
              district: { select: { id: true, code: true, nameEn: true, nameKn: true } },
              state: { select: { id: true, code: true, nameEn: true, nameKn: true } },
            },
          },
          author: { select: { id: true, displayName: true, avatarUrl: true } },
          featuredImage: { select: { id: true, cdnUrl: true, altText: true, caption: true } },
        },
      }),
    ])

    return { total, articles }
  }

  async findArticleBySlug({ slug, languageId }) {
    return prisma.article.findFirst({
      where: {
        slug,
        languageId,
        status: 'PUBLISHED',
      },
      include: {
        story: {
          include: {
            category: { select: { id: true, slug: true, nameEn: true, nameKn: true } },
            district: { select: { id: true, code: true, nameEn: true, nameKn: true } },
            state: { select: { id: true, code: true, nameEn: true, nameKn: true } },
            articles: {
              where: { status: 'PUBLISHED' },
              select: {
                id: true,
                slug: true,
                headline: true,
                language: { select: { id: true, code: true, nameNative: true, nameEnglish: true } },
              },
            },
          },
        },
        author: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
            employeeProfile: { select: { designation: true, department: true } },
          },
        },
        editor: { select: { id: true, displayName: true } },
        featuredImage: { select: { id: true, cdnUrl: true, altText: true, caption: true } },
        articleTags: {
          include: {
            tag: { select: { id: true, slug: true, name: true } },
          },
        },
      },
    })
  }

  async incrementArticleViewCount(articleId) {
    return prisma.article.update({
      where: { id: BigInt(articleId) },
      data: { viewCount: { increment: 1 } },
      select: { id: true, viewCount: true },
    })
  }

  async findBreakingNews({ languageId, limit = 5 }) {
    return prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        isBreaking: true,
        languageId,
      },
      take: limit,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true,
        headline: true,
        slug: true,
        publishedAt: true,
        story: {
          select: {
            category: { select: { slug: true, nameKn: true, nameEn: true } },
          },
        },
      },
    })
  }

  async findTrendingNews({ languageId, limit = 5 }) {
    return prisma.article.findMany({
      where: {
        status: 'PUBLISHED',
        languageId,
      },
      take: limit,
      orderBy: { viewCount: 'desc' },
      select: {
        id: true,
        headline: true,
        slug: true,
        viewCount: true,
        publishedAt: true,
        featuredImage: { select: { cdnUrl: true } },
        story: {
          select: {
            category: { select: { slug: true, nameKn: true, nameEn: true } },
          },
        },
      },
    })
  }

  async createStoryWithArticle({ storyData, articleData, tagIds = [] }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create Story
      const story = await tx.story.create({
        data: storyData,
      })

      // 2. Create Article
      const article = await tx.article.create({
        data: {
          ...articleData,
          storyId: story.id,
        },
      })

      // 3. Associate Tags
      if (tagIds.length > 0) {
        await tx.articleTag.createMany({
          data: tagIds.map((tagId) => ({
            articleId: article.id,
            tagId,
          })),
        })
      }

      // 4. Create Initial Version
      await tx.articleVersion.create({
        data: {
          articleId: article.id,
          versionNumber: 1,
          headline: article.headline,
          summary: article.summary,
          body: article.body,
          editorId: article.authorId,
          changeSummary: 'Initial article creation',
        },
      })

      return { story, article }
    })
  }
}

export const newsRepository = new NewsRepository()


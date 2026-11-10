import prisma from '../../lib/prisma.js'

export class EditorialRepository {
  async findArticleById(id) {
    return prisma.article.findUnique({
      where: { id: BigInt(id) },
      include: {
        story: {
          include: {
            category: true,
            state: true,
            district: true,
          },
        },
        language: true,
        author: { select: { id: true, email: true, displayName: true } },
        editor: { select: { id: true, email: true, displayName: true } },
      },
    })
  }

  async findLatestVersionNumber(articleId) {
    const latest = await prisma.articleVersion.findFirst({
      where: { articleId: BigInt(articleId) },
      orderBy: { versionNumber: 'desc' },
      select: { versionNumber: true },
    })
    return latest?.versionNumber ?? 0
  }

  async updateArticleAndRecordVersion({ articleId, updateData, changedById, changeReason }) {
    return prisma.$transaction(async (tx) => {
      const updatedArticle = await tx.article.update({
        where: { id: BigInt(articleId) },
        data: {
          ...updateData,
          editorId: BigInt(changedById),
        },
      })

      const latest = await tx.articleVersion.findFirst({
        where: { articleId: BigInt(articleId) },
        orderBy: { versionNumber: 'desc' },
        select: { versionNumber: true },
      })
      const nextVersion = (latest?.versionNumber ?? 0) + 1

      await tx.articleVersion.create({
        data: {
          articleId: updatedArticle.id,
          versionNumber: nextVersion,
          headline: updatedArticle.headline,
          summary: updatedArticle.summary,
          body: updatedArticle.body,
          changedById: BigInt(changedById),
          changeReason,
        },
      })

      return updatedArticle
    })
  }

  async transitionArticleStatus({ articleId, targetStatus, editorId, comment, scheduledAt, publishedAt }) {
    return prisma.$transaction(async (tx) => {
      const data = {
        status: targetStatus,
        editorId: BigInt(editorId),
      }

      if (publishedAt) data.publishedAt = publishedAt
      if (scheduledAt) data.scheduledAt = scheduledAt

      const article = await tx.article.update({
        where: { id: BigInt(articleId) },
        data,
      })

      if (comment) {
        await tx.editorialComment.create({
          data: {
            articleId: article.id,
            authorId: BigInt(editorId),
            body: comment,
            commentType: 'REVIEW_NOTE',
          },
        })
      }

      return article
    })
  }

  async addEditorialComment({ articleId, authorId, body, commentType = 'REVIEW_NOTE' }) {
    return prisma.editorialComment.create({
      data: {
        articleId: BigInt(articleId),
        authorId: BigInt(authorId),
        body,
        commentType,
      },
      include: {
        author: { select: { id: true, displayName: true, avatarUrl: true } },
      },
    })
  }

  async findArticleVersions(articleId) {
    return prisma.articleVersion.findMany({
      where: { articleId: BigInt(articleId) },
      orderBy: { versionNumber: 'desc' },
      include: {
        changedBy: { select: { id: true, displayName: true } },
      },
    })
  }

  async createStoryAssignment({ storyId, assignedToId, assignedById, instructions, dueDate }) {
    return prisma.storyAssignment.create({
      data: {
        storyId: BigInt(storyId),
        assignedToId: BigInt(assignedToId),
        assignedById: BigInt(assignedById),
        instructions,
        dueDate: dueDate ? new Date(dueDate) : null,
        status: 'PENDING',
      },
      include: {
        story: { select: { id: true, category: true } },
        assignedTo: { select: { id: true, displayName: true, email: true } },
        assignedBy: { select: { id: true, displayName: true } },
      },
    })
  }

  async findEditorialQueue({ status, languageCode, categoryId, districtId, page = 1, limit = 20 }) {
    const where = {
      ...(status && { status }),
      ...(languageCode && { language: { code: languageCode } }),
      story: {
        ...(categoryId && { categoryId }),
        ...(districtId && { districtId }),
      },
    }

    const [total, articles] = await Promise.all([
      prisma.article.count({ where }),
      prisma.article.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: [{ createdAt: 'desc' }],
        include: {
          story: {
            include: {
              category: true,
              district: true,
              state: true,
            },
          },
          language: true,
          author: { select: { id: true, displayName: true, email: true } },
          editor: { select: { id: true, displayName: true } },
          _count: { select: { editorialComments: true, versions: true } },
        },
      }),
    ])

    return { total, articles }
  }
}

export const editorialRepository = new EditorialRepository()


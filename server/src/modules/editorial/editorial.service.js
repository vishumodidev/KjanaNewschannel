import { editorialRepository } from './editorial.repository.js'
import { AppError } from '../../errors/AppError.js'
import { logger } from '../../config/logger.config.js'

export const ALLOWED_TRANSITIONS = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['IN_REVIEW', 'DRAFT'],
  IN_REVIEW: ['FACT_CHECK', 'APPROVED', 'DRAFT'],
  FACT_CHECK: ['APPROVED', 'IN_REVIEW', 'DRAFT'],
  APPROVED: ['SCHEDULED', 'PUBLISHED', 'IN_REVIEW'],
  SCHEDULED: ['PUBLISHED', 'APPROVED'],
  PUBLISHED: ['CORRECTION', 'RETRACTED'],
  CORRECTION: ['PUBLISHED'],
  RETRACTED: [],
  TRANSLATION_ASSIGNED: ['TRANSLATION_IN_PROGRESS', 'DRAFT'],
  TRANSLATION_IN_PROGRESS: ['TRANSLATION_SUBMITTED', 'DRAFT'],
  TRANSLATION_SUBMITTED: ['TRANSLATION_APPROVED', 'TRANSLATION_IN_PROGRESS'],
  TRANSLATION_APPROVED: ['APPROVED', 'PUBLISHED'],
}

export class EditorialService {
  constructor(repository = editorialRepository) {
    this.repository = repository
  }

  async getArticleById(articleId) {
    const article = await this.repository.findArticleById(articleId)
    if (!article) {
      throw AppError.notFound(`Article with ID ${articleId} not found.`)
    }
    return article
  }

  async transitionStatus({ articleId, targetStatus, user, comment, scheduledAt }) {
    const article = await this.getArticleById(articleId)
    const currentStatus = article.status

    if (currentStatus === targetStatus) {
      return { article, message: `Article is already in ${targetStatus} status.` }
    }

    // Check emergency publish bypass: SUPER_ADMIN, EDITOR_IN_CHIEF, or story.publish_emergency
    const isEmergencyPublish =
      targetStatus === 'PUBLISHED' &&
      (user.roles?.includes('SUPER_ADMIN') ||
        user.roles?.includes('EDITOR_IN_CHIEF') ||
        user.permissions?.includes('story.publish_emergency'))

    const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || []
    if (!allowedNext.includes(targetStatus) && !isEmergencyPublish) {
      throw AppError.badRequest(
        `Invalid workflow transition from ${currentStatus} to ${targetStatus}. Allowed transitions: [${allowedNext.join(', ')}]`,
      )
    }

    let publishedAt = undefined
    if (targetStatus === 'PUBLISHED') {
      publishedAt = new Date()
    }

    const updated = await this.repository.transitionArticleStatus({
      articleId,
      targetStatus,
      editorId: user.userId,
      comment,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : undefined,
      publishedAt,
    })

    logger.info(
      {
        articleId: article.id.toString(),
        fromStatus: currentStatus,
        toStatus: targetStatus,
        editorId: user.userId,
      },
      'Article workflow status updated',
    )

    return {
      id: updated.id.toString(),
      status: updated.status,
      publishedAt: updated.publishedAt,
      scheduledAt: updated.scheduledAt,
    }
  }

  async updateArticleContent({ articleId, updateData, user }) {
    await this.getArticleById(articleId)

    const updated = await this.repository.updateArticleAndRecordVersion({
      articleId,
      updateData: {
        ...(updateData.headline && { headline: updateData.headline }),
        ...(updateData.subheadline && { subheadline: updateData.subheadline }),
        ...(updateData.summary && { summary: updateData.summary }),
        ...(updateData.body && { body: updateData.body }),
      },
      changedById: user.userId,
      changeReason: updateData.changeSummary || 'Editorial update',
    })

    return {
      id: updated.id.toString(),
      headline: updated.headline,
      status: updated.status,
      updatedAt: updated.updatedAt,
    }
  }

  async addComment({ articleId, user, commentText }) {
    await this.getArticleById(articleId)

    const comment = await this.repository.addEditorialComment({
      articleId,
      authorId: user.userId,
      body: commentText,
      commentType: 'REVIEW_NOTE',
    })

    return {
      id: comment.id.toString(),
      articleId: comment.articleId.toString(),
      body: comment.body,
      createdAt: comment.createdAt,
      author: comment.author,
    }
  }

  async getVersions(articleId) {
    await this.getArticleById(articleId)
    const versions = await this.repository.findArticleVersions(articleId)

    return versions.map((v) => ({
      id: v.id.toString(),
      versionNumber: v.versionNumber,
      headline: v.headline,
      summary: v.summary,
      body: v.body,
      changeReason: v.changeReason,
      createdAt: v.createdAt,
      changedBy: v.changedBy,
    }))
  }

  async assignTranslation({ storyId, user, payload }) {
    const assignment = await this.repository.createStoryAssignment({
      storyId: BigInt(storyId),
      assignedToId: BigInt(payload.assigneeId),
      assignedById: BigInt(user.userId),
      instructions: payload.notes || `Translate story to language: ${payload.targetLanguageCode}`,
      dueDate: payload.dueDate,
    })

    return {
      id: assignment.id.toString(),
      storyId: assignment.storyId.toString(),
      assignedTo: assignment.assignedTo,
      assignedBy: assignment.assignedBy,
      dueDate: assignment.dueDate,
      status: assignment.status,
    }
  }

  async getQueue(query) {
    const { total, articles } = await this.repository.findEditorialQueue(query)

    return {
      articles: articles.map((art) => ({
        id: art.id.toString(),
        storyId: art.storyId.toString(),
        headline: art.headline,
        status: art.status,
        language: art.language,
        category: art.story.category,
        district: art.story.district,
        author: art.author,
        editor: art.editor,
        commentCount: art._count.editorialComments,
        versionCount: art._count.versions,
        createdAt: art.createdAt,
        updatedAt: art.updatedAt,
      })),
      pagination: {
        page: query.page,
        limit: query.limit,
        total,
        totalPages: Math.ceil(total / query.limit) || 1,
      },
    }
  }
}

export const editorialService = new EditorialService()

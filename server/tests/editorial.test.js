import test from 'node:test'
import assert from 'node:assert/strict'
import { EditorialService } from '../src/modules/editorial/editorial.service.js'

test('EditorialService rejects invalid workflow transition (DRAFT -> PUBLISHED) without emergency privilege', async () => {
  const mockRepo = {
    findArticleById: async () => ({
      id: 10n,
      status: 'DRAFT',
    }),
  }

  const service = new EditorialService(mockRepo)
  const regularUser = {
    userId: '5',
    roles: ['REPORTER'],
    permissions: ['story.create'],
  }

  await assert.rejects(
    () =>
      service.transitionStatus({
        articleId: 10,
        targetStatus: 'PUBLISHED',
        user: regularUser,
      }),
    {
      statusCode: 400,
      message: /Invalid workflow transition/,
    },
  )
})

test('EditorialService permits DRAFT -> SUBMITTED for reporter', async () => {
  const mockRepo = {
    findArticleById: async () => ({
      id: 10n,
      status: 'DRAFT',
    }),
    transitionArticleStatus: async ({ targetStatus, editorId }) => ({
      id: 10n,
      status: targetStatus,
      editorId,
      publishedAt: null,
      scheduledAt: null,
    }),
  }

  const service = new EditorialService(mockRepo)
  const reporter = {
    userId: '5',
    roles: ['REPORTER'],
    permissions: ['story.edit'],
  }

  const result = await service.transitionStatus({
    articleId: 10,
    targetStatus: 'SUBMITTED',
    user: reporter,
    comment: 'Ready for desk review',
  })

  assert.equal(result.status, 'SUBMITTED')
  assert.equal(result.id, '10')
})

test('EditorialService permits emergency publish for SUPER_ADMIN directly from DRAFT', async () => {
  const mockRepo = {
    findArticleById: async () => ({
      id: 10n,
      status: 'DRAFT',
    }),
    transitionArticleStatus: async ({ targetStatus, editorId, publishedAt }) => ({
      id: 10n,
      status: targetStatus,
      editorId,
      publishedAt,
      scheduledAt: null,
    }),
  }

  const service = new EditorialService(mockRepo)
  const superAdmin = {
    userId: '1',
    roles: ['SUPER_ADMIN'],
    permissions: ['*'],
  }

  const result = await service.transitionStatus({
    articleId: 10,
    targetStatus: 'PUBLISHED',
    user: superAdmin,
    comment: 'Urgent breaking news bulletin',
  })

  assert.equal(result.status, 'PUBLISHED')
  assert.ok(result.publishedAt instanceof Date)
})

test('EditorialService records new version when content is updated', async () => {
  let recordedVersion = null

  const mockRepo = {
    findArticleById: async () => ({ id: 10n }),
    updateArticleAndRecordVersion: async ({ updateData, changeReason }) => {
      recordedVersion = { updateData, changeReason }
      return {
        id: 10n,
        headline: updateData.headline,
        status: 'IN_REVIEW',
        updatedAt: new Date(),
      }
    },
  }

  const service = new EditorialService(mockRepo)
  const editor = { userId: '2', roles: ['DESK_EDITOR'] }

  const result = await service.updateArticleContent({
    articleId: 10,
    user: editor,
    updateData: {
      headline: 'Updated and Fact-Checked Headline',
      changeSummary: 'Fixed factual date in headline',
    },
  })

  assert.equal(result.headline, 'Updated and Fact-Checked Headline')
  assert.equal(recordedVersion.changeReason, 'Fixed factual date in headline')
})

test('EditorialService creates translation assignment for bilingual expansion', async () => {
  let createdAssignment = null

  const mockRepo = {
    createStoryAssignment: async (data) => {
      createdAssignment = data
      return {
        id: 501n,
        storyId: data.storyId,
        assignedTo: { id: 7n, displayName: 'Sanjay Sharma', email: 'sanjay@jananewsnetwork.com' },
        assignedBy: { id: 2n, displayName: 'Senior Editor' },
        dueDate: data.dueDate,
        status: 'PENDING',
      }
    },
  }

  const service = new EditorialService(mockRepo)
  const editor = { userId: '2' }

  const result = await service.assignTranslation({
    storyId: 100,
    user: editor,
    payload: {
      targetLanguageCode: 'hi',
      assigneeId: 7,
      dueDate: '2026-05-17T12:00:00Z',
      notes: 'Please translate to Hindi maintaining editorial neutrality',
    },
  })

  assert.equal(result.id, '501')
  assert.equal(result.storyId, '100')
  assert.equal(result.assignedTo.displayName, 'Sanjay Sharma')
  assert.equal(result.status, 'PENDING')
  assert.equal(createdAssignment.assignedToId, 7n)
})

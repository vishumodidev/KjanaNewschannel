import { z } from 'zod'

export const VALID_ARTICLE_STATUSES = [
  'DRAFT',
  'SUBMITTED',
  'IN_REVIEW',
  'FACT_CHECK',
  'APPROVED',
  'SCHEDULED',
  'PUBLISHED',
  'CORRECTION',
  'RETRACTED',
  'TRANSLATION_ASSIGNED',
  'TRANSLATION_IN_PROGRESS',
  'TRANSLATION_SUBMITTED',
  'TRANSLATION_APPROVED',
]

export const transitionStatusSchema = z.object({
  targetStatus: z.enum(VALID_ARTICLE_STATUSES, {
    errorMap: () => ({ message: 'Invalid article status' }),
  }),
  comment: z.string().max(2000).optional(),
  scheduledAt: z.string().datetime().optional(),
})

export const updateArticleSchema = z.object({
  headline: z.string().min(5).max(500).optional(),
  subheadline: z.string().max(500).optional(),
  summary: z.string().max(2000).optional(),
  body: z.string().min(10).optional(),
  changeSummary: z.string().max(500).default('Editorial update'),
})

export const addCommentSchema = z.object({
  commentText: z.string().min(2, 'Comment must have content').max(2000),
})

export const assignTranslationSchema = z.object({
  targetLanguageCode: z.string().min(2).max(10),
  assigneeId: z.coerce.number().int().positive('Assignee staff ID is required'),
  dueDate: z.string().datetime().optional(),
  notes: z.string().max(1000).optional(),
})

export const editorialQueueQuerySchema = z.object({
  status: z.enum(VALID_ARTICLE_STATUSES).optional(),
  languageCode: z.string().optional(),
  categoryId: z.coerce.number().int().positive().optional(),
  districtId: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
})

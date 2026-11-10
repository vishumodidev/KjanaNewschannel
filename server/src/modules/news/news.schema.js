import { z } from 'zod'

export const createStorySchema = z.object({
  primaryLanguageCode: z.string().min(2).max(10).default('kn'),
  categoryId: z.coerce.number().int().positive('Category ID is required'),
  stateId: z.coerce.number().int().positive().optional(),
  districtId: z.coerce.number().int().positive().optional(),
  priority: z.coerce.number().int().default(0),

  // Initial article fields
  headline: z.string().min(5, 'Headline must be at least 5 characters').max(500),
  subheadline: z.string().max(500).optional(),
  summary: z.string().max(2000).optional(),
  body: z.string().min(10, 'Article content must be at least 10 characters'),
  featuredImageUrl: z.string().url().optional(),
  featuredImageCaption: z.string().max(255).optional(),
  tags: z.array(z.string()).default([]),
  isBreaking: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  seoTitle: z.string().max(255).optional(),
  seoDescription: z.string().max(500).optional(),
})

export const newsQuerySchema = z.object({
  lang: z.string().default('kn'),
  category: z.string().optional(),
  districtId: z.coerce.number().int().positive().optional(),
  stateId: z.coerce.number().int().positive().optional(),
  isBreaking: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  isFeatured: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(10),
})


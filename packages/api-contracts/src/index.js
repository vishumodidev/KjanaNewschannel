// ── API Contracts ─────────────────────────────────────────────────────────────
// Zod schemas shared between the Express backend and React frontends.
// Importing from both sides ensures request/response shapes stay in sync.
//
// Phase 2+ will populate this with auth, article, editorial, and other schemas.

// Example shape (Phase 2):
// export { LoginRequestSchema, LoginResponseSchema } from './schemas/auth.js'
// export { ArticleSchema, CreateArticleSchema }      from './schemas/articles.js'

export const API_CONTRACTS_VERSION = '1.0.0'


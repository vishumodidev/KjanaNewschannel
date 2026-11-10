import { Router } from 'express'
import { healthRouter } from '../../modules/health/health.routes.js'
import { authRouter } from '../../modules/auth/auth.routes.js'
import { taxonomyRouter } from '../../modules/taxonomy/taxonomy.routes.js'
import { newsRouter, storiesRouter } from '../../modules/news/news.routes.js'
import { editorialRouter } from '../../modules/editorial/editorial.routes.js'

// ── API v1 root router ──────────────────────────────────────────────────────
// Mount module-specific routers here as they are implemented in later phases.

export const apiV1Router = Router()

// ── Health ──────────────────────────────────────────────────────────────────
apiV1Router.use('/health', healthRouter)

// ── Authentication & Authorization (Phase 2) ────────────────────────────────
apiV1Router.use('/auth', authRouter)

// ── Taxonomy & Location APIs (Phase 3) ───────────────────────────────────────
apiV1Router.use('/taxonomy', taxonomyRouter)
apiV1Router.use('/news', newsRouter)
apiV1Router.use('/stories', storiesRouter)

// ── Editorial & Translation Workflows (Phase 4) ─────────────────────────────
apiV1Router.use('/editorial', editorialRouter)

// ── Phase 5+ routes (added progressively) ───────────────────────────────────
// apiV1Router.use('/search',         searchRouter)
// apiV1Router.use('/media',          mediaRouter)
// apiV1Router.use('/admin',          adminRouter)
// apiV1Router.use('/analytics',      analyticsRouter)


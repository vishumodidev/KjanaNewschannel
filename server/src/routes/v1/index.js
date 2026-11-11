import { Router } from 'express'
import { healthRouter } from '../../modules/health/health.routes.js'
import { authRouter } from '../../modules/auth/auth.routes.js'
import { taxonomyRouter } from '../../modules/taxonomy/taxonomy.routes.js'
import { newsRouter, storiesRouter } from '../../modules/news/news.routes.js'
import { editorialRouter } from '../../modules/editorial/editorial.routes.js'
import { mediaRouter } from '../../modules/media/media.routes.js'
import { adsRouter } from '../../modules/advertising/advertising.routes.js'
import { systemRouter } from '../../modules/system/system.routes.js'

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

// ── Media & Advertising Pipeline (Phase 7) ──────────────────────────────────
apiV1Router.use('/media', mediaRouter)
apiV1Router.use('/ads', adsRouter)

// ── System Management (Users, Roles, Analytics, Audit Logs) ─────────────────
apiV1Router.use('/system', systemRouter)
apiV1Router.use('/', systemRouter) // Also mount at root for /users, /roles, etc.


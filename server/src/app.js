import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import { corsConfig } from './config/cors.config.js'
import { appConfig } from './config/app.config.js'
import { requestLogger } from './middleware/requestLogger.js'
import { errorHandler } from './middleware/errorHandler.js'
import { apiV1Router } from './routes/v1/index.js'

const app = express()

// ── Trust proxy (required when running behind nginx / load balancer) ─────────
// Set to the number of trusted proxy hops in production.
app.set('trust proxy', appConfig.isProd ? 1 : false)

// ── Security headers (Helmet) ────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // Required for media embeds
    contentSecurityPolicy: appConfig.isProd, // Only enforce in production
  }),
)

// ── CORS ─────────────────────────────────────────────────────────────────────
app.use(cors(corsConfig))


// ── Global rate limiter ──────────────────────────────────────────────────────
// Stricter limits per route (e.g. auth) are applied at the module level.
const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,                  // per IP per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests. Please try again later.' },
  },
})
app.use(globalRateLimiter)

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// ── Request logging ───────────────────────────────────────────────────────────
app.use(requestLogger)

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/v1', apiV1Router)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found.`,
    },
  })
})

// ── Centralized error handler (must be last) ──────────────────────────────────
app.use(errorHandler)

export default app


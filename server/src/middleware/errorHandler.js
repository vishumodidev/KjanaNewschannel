import { AppError } from '../errors/AppError.js'
import { logger } from '../config/logger.config.js'
import { appConfig } from '../config/app.config.js'

// ── Centralized error handler ───────────────────────────────────────────────
// Must be registered as the LAST middleware (after all routes) in app.js.
// Express identifies error-handling middleware by the 4-parameter signature.

export const errorHandler = (err, req, res, _next) => {
  // ── Known application errors ──────────────────────────────────────────────
  if (err instanceof AppError) {
    logger.warn(
      { err: { code: err.code, message: err.message }, method: req.method, path: req.path },
      'Application error',
    )
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
        // Include structured field details only in dev or if explicitly set
        ...(err.details ? { details: err.details } : {}),
      },
    })
  }

  // ── Zod validation errors surface via Express 5 async catch ───────────────
  if (err.name === 'ZodError') {
    logger.warn({ zodErrors: err.errors, path: req.path }, 'Request validation failed')
    return res.status(422).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed.',
        details: err.flatten?.().fieldErrors ?? err.errors,
      },
    })
  }

  // ── CORS errors ───────────────────────────────────────────────────────────
  if (err.message?.startsWith('CORS:')) {
    return res.status(403).json({
      success: false,
      error: { code: 'CORS_ERROR', message: err.message },
    })
  }

  // ── Unexpected / unhandled errors ─────────────────────────────────────────
  logger.error({ err, method: req.method, path: req.path }, 'Unexpected server error')

  return res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      // Never expose internal error details in production
      message: appConfig.isDev
        ? err.message
        : 'An unexpected error occurred. Please try again later.',
    },
  })
}

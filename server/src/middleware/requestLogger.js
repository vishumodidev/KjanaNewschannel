import { logger } from '../config/logger.config.js'

// ── HTTP request logger middleware ──────────────────────────────────────────
// Logs method, URL, status, duration, and IP for every completed request.
// Uses the response 'finish' event so duration includes response write time.

export const requestLogger = (req, res, next) => {
  const startMs = Date.now()
  const requestId = req.headers['x-request-id'] ?? crypto.randomUUID()

  // Attach request ID to response headers for tracing
  res.setHeader('X-Request-ID', requestId)

  res.on('finish', () => {
    const durationMs = Date.now() - startMs
    const level = res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'

    logger[level]({
      requestId,
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${durationMs}ms`,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    })
  })

  next()
}


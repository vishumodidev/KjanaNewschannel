import { appConfig } from './app.config.js'

// ── CORS configuration ──────────────────────────────────────────────────────
export const corsConfig = {
  /**
   * Validate the request origin against the configured allow-list.
   * Requests with no Origin header (mobile apps, server-to-server, curl) are
   * allowed through.  Mismatched origins receive a CORS error.
   */
  origin(origin, callback) {
    // No origin = non-browser client → allow
    if (!origin) return callback(null, true)

    if (appConfig.cors.allowedOrigins.includes(origin)) {
      return callback(null, true)
    }

    callback(new Error(`CORS: Origin "${origin}" is not permitted.`))
  },

  credentials: true, // Required for sending cookies (refresh token)

  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],

  exposedHeaders: ['X-Request-ID'],

  // Cache pre-flight result for 24 hours
  maxAge: 86400,
}


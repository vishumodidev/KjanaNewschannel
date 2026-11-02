import pino from 'pino'
import { appConfig } from './app.config.js'

// ── Pino structured logger ──────────────────────────────────────────────────
// Development: pretty-printed with colours via pino-pretty
// Production:  JSON lines for log aggregator ingestion (e.g., Cloud Logging)
export const logger = pino(
  {
    level: appConfig.isDev ? 'debug' : 'info',
    // Redact sensitive fields from all log lines
    redact: {
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'body.password',
        'body.password_hash',
        'body.refreshToken',
      ],
      censor: '[REDACTED]',
    },
  },
  appConfig.isDev
    ? pino.transport({
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:HH:MM:ss',
          ignore: 'pid,hostname',
        },
      })
    : undefined,
)


// Load environment variables from server/.env (development only).
// In production, environment variables are injected by the runtime / orchestrator.
import 'dotenv/config'

import app from './app.js'
import { appConfig } from './config/app.config.js'
import { logger } from './config/logger.config.js'

// ── Start HTTP server ─────────────────────────────────────────────────────────
const server = app.listen(appConfig.port, () => {
  logger.info(
    {
      port: appConfig.port,
      env: appConfig.env,
      nodeVersion: process.version,
    },
    '🚀  K JANA NEWS NETWORK API server started',
  )

  if (appConfig.isDev) {
    logger.info(`   API:     http://localhost:${appConfig.port}/api/v1`)
    logger.info(`   Health:  http://localhost:${appConfig.port}/api/v1/health`)
    logger.info(`   Docs:    http://localhost:${appConfig.port}/api/v1/docs  (Phase 3+)`)
  }
})

// ── Graceful shutdown ─────────────────────────────────────────────────────────
const shutdown = (signal) => {
  logger.info(`${signal} received — shutting down gracefully...`)
  server.close(() => {
    logger.info('HTTP server closed.')
    process.exit(0)
  })

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Forced exit after timeout.')
    process.exit(1)
  }, 10_000).unref()
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT', () => shutdown('SIGINT'))

// ── Unhandled promise rejections / exceptions ─────────────────────────────────
process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled promise rejection')
  // Do not exit — log and continue; consider crashing in production
})

process.on('uncaughtException', (err) => {
  logger.fatal({ err }, 'Uncaught exception — process will exit')
  process.exit(1)
})

export default server


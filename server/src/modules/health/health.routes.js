import { Router } from 'express'
import { appConfig } from '../../config/app.config.js'

export const healthRouter = Router()

// GET /api/v1/health
// Public endpoint. Returns service status, version, and environment.
// Used by load-balancers, Docker health checks, and monitoring.
healthRouter.get('/', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok',
      service: 'DIGI NEWS NETWORK API',
      version: '1.0.0',
      environment: appConfig.env,
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
    },
  })
})


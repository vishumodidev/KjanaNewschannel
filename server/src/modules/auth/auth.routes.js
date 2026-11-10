import { Router } from 'express'
import rateLimit from 'express-rate-limit'
import { authController } from './auth.controller.js'
import { loginSchema, refreshSchema } from './auth.schema.js'
import { validate } from '../../middleware/validate.js'
import { authenticate, optionalAuthenticate } from '../../middleware/authenticate.js'

export const authRouter = Router()

// ── Strict rate limiter for authentication endpoints ──────────────────────────
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,                  // max 10 failed/successful logins per IP
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'TOO_MANY_LOGIN_ATTEMPTS',
      message: 'Too many login attempts from this IP. Please try again after 15 minutes.',
    },
  },
})

// ── Authentication routes ───────────────────────────────────────────────────
authRouter.post('/login', loginLimiter, validate(loginSchema), authController.login)
authRouter.post('/refresh', validate(refreshSchema), authController.refresh)
authRouter.post('/logout', optionalAuthenticate, authController.logout)
authRouter.get('/me', authenticate, authController.me)

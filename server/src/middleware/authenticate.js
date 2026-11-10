import { verifyAccessToken } from '../utils/token.js'
import { AppError } from '../errors/AppError.js'

/**
 * Authentication middleware.
 * Verifies the JWT Bearer token from the Authorization header
 * and attaches the decoded user payload to req.user.
 */
export function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Authentication token is required.'))
  }

  const token = authHeader.slice(7).trim()

  try {
    const decoded = verifyAccessToken(token)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(AppError.unauthorized('Authentication token has expired. Please refresh your session.'))
    }
    return next(AppError.unauthorized('Invalid authentication token.'))
  }
}

/**
 * Optional authentication middleware.
 * If Bearer token is provided and valid, sets req.user; otherwise continues as anonymous without error.
 */
export function optionalAuthenticate(req, _res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next()
  }

  const token = authHeader.slice(7).trim()

  try {
    const decoded = verifyAccessToken(token)
    req.user = decoded
  } catch {
    // Ignore invalid/expired token for optional endpoints
  }

  next()
}


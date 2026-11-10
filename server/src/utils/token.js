import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { appConfig } from '../config/app.config.js'

/**
 * Generate a cryptographically secure random token string or family ID.
 * @param {number} [bytes=32]
 * @returns {string}
 */
export function generateRandomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

/**
 * Hash a token (e.g. refresh token) before storing in the database.
 * @param {string} token
 * @returns {string}
 */
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

/**
 * Issue an access token (JWT) containing user ID, role names, and active scopes.
 *
 * @param {object} payload
 * @param {string|bigint} payload.userId
 * @param {string[]} payload.roles
 * @param {string[]} payload.permissions
 * @param {Array<{ scopeType: string, stateId?: number, districtId?: number }>} payload.scopes
 * @returns {string} Signed JWT
 */
export function signAccessToken(payload) {
  return jwt.sign(
    {
      userId: payload.userId.toString(),
      roles: payload.roles,
      permissions: payload.permissions,
      scopes: payload.scopes,
    },
    appConfig.jwt.accessSecret,
    {
      expiresIn: appConfig.jwt.accessExpiresIn,
      issuer: 'JANA_NEWS_NETWORK',
      audience: 'JANA_NEWS_CLIENTS',
    },
  )
}

/**
 * Verify an access token.
 *
 * @param {string} token
 * @returns {object} Decoded JWT payload
 */
export function verifyAccessToken(token) {
  return jwt.verify(token, appConfig.jwt.accessSecret, {
    issuer: 'JANA_NEWS_NETWORK',
    audience: 'JANA_NEWS_CLIENTS',
  })
}

/**
 * Issue a signed refresh token JWT (contains userId and token family).
 *
 * @param {string|bigint} userId
 * @param {string} family
 * @returns {string} Signed Refresh Token
 */
export function signRefreshToken(userId, family) {
  return jwt.sign(
    {
      userId: userId.toString(),
      family,
    },
    appConfig.jwt.refreshSecret,
    {
      expiresIn: appConfig.jwt.refreshExpiresIn,
      issuer: 'JANA_NEWS_NETWORK',
      audience: 'JANA_NEWS_REFRESH',
    },
  )
}

/**
 * Verify a refresh token.
 *
 * @param {string} token
 * @returns {object} Decoded payload with userId and family
 */
export function verifyRefreshToken(token) {
  return jwt.verify(token, appConfig.jwt.refreshSecret, {
    issuer: 'JANA_NEWS_NETWORK',
    audience: 'JANA_NEWS_REFRESH',
  })
}

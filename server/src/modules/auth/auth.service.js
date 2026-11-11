import { authRepository } from './auth.repository.js'
import { verifyPassword } from '../../utils/password.js'
import {
  generateRandomToken,
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/token.js'
import { AppError } from '../../errors/AppError.js'
import { logger } from '../../config/logger.config.js'

export class AuthService {
  constructor(repository = authRepository) {
    this.repository = repository
  }

  /**
   * Helper to flatten roles, permissions, and scope assignments into clean arrays.
   */
  _extractUserContext(user) {
    const roles = user.userRoles.map((ur) => ur.role.name)
    const permissionSet = new Set()

    for (const ur of user.userRoles) {
      for (const rp of ur.role.rolePermissions) {
        permissionSet.add(rp.permission.code)
      }
    }

    const scopes = user.scopeAssignments.map((sa) => ({
      roleName: sa.role?.name,
      scopeType: sa.scopeType,
      stateId: sa.stateId ?? undefined,
      districtId: sa.districtId ?? undefined,
      categoryId: sa.categoryId ?? undefined,
      languageId: sa.languageId ?? undefined,
      stateName: sa.state?.nameEn,
      districtName: sa.district?.nameEn,
    }))

    return {
      roles,
      permissions: Array.from(permissionSet),
      scopes,
    }
  }

  /**
   * Authenticate user credentials and issue token pair.
   */
  async login({ email, password, ipAddress, userAgent }) {
    const user = await this.repository.findByEmailWithDetails(email.toLowerCase().trim())

    if (!user) {
      logger.warn({ email, ipAddress }, 'Login failed: user not found')
      throw AppError.unauthorized('Invalid email or password.')
    }

    if (!user.isActive) {
      logger.warn({ email, userId: user.id.toString() }, 'Login failed: account deactivated')
      throw AppError.forbidden('Your account has been deactivated. Contact an administrator.')
    }

    const isMatch = await verifyPassword(user.passwordHash, password)
    if (!isMatch) {
      logger.warn({ email, ipAddress }, 'Login failed: invalid password')
      throw AppError.unauthorized('Invalid email or password.')
    }

    const { roles, permissions, scopes } = this._extractUserContext(user)

    // Issue tokens
    const accessToken = signAccessToken({
      userId: user.id,
      roles,
      permissions,
      scopes,
    })

    const family = generateRandomToken(16)
    const rawRefreshToken = signRefreshToken(user.id, family)
    const tokenHash = hashToken(rawRefreshToken)

    // Store refresh token with 7-day expiration
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    await this.repository.createRefreshToken({
      userId: user.id,
      tokenHash,
      family,
      expiresAt,
    })

    // Update last login & record audit log
    await this.repository.updateLastLogin(user.id)
    await this.repository.createAuditLog({
      actorId: user.id,
      action: 'user.login',
      targetType: 'User',
      targetId: user.id.toString(),
      ipAddress,
      userAgent,
    })

    return {
      user: {
        id: user.id.toString(),
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        roles,
        permissions,
        scopes,
        employeeProfile: user.employeeProfile
          ? {
              staffId: user.employeeProfile.staffId,
              department: user.employeeProfile.department,
              designation: user.employeeProfile.designation,
            }
          : null,
      },
      accessToken,
      refreshToken: rawRefreshToken,
    }
  }

  /**
   * Rotate refresh token and issue a fresh access token.
   * Detects and blocks refresh token reuse (theft detection).
   */
  async refresh({ refreshToken: rawToken, ipAddress, userAgent: _userAgent }) {
    if (!rawToken) {
      throw AppError.unauthorized('Refresh token is required.')
    }

    let decoded
    try {
      decoded = verifyRefreshToken(rawToken)
    } catch (err) {
      logger.warn({ err: err.message }, 'Invalid refresh token signature')
      throw AppError.unauthorized('Invalid or expired session. Please log in again.')
    }

    const tokenHash = hashToken(rawToken)
    const storedToken = await this.repository.findRefreshToken(tokenHash)

    if (!storedToken) {
      throw AppError.unauthorized('Session not found. Please log in again.')
    }

    // ── Theft detection ──────────────────────────────────────────────────────
    // If an already-revoked token is used, someone is attempting a replay attack.
    // Invalidate the entire token family immediately.
    if (storedToken.isRevoked) {
      logger.error(
        { userId: decoded.userId, family: storedToken.family, ipAddress },
        '🚨 Security alert: Revoked refresh token reuse detected! Invalidating token family.',
      )
      await this.repository.revokeTokenFamily(storedToken.family)
      throw AppError.unauthorized('Session terminated due to security violation. Please log in again.')
    }

    // Check expiration
    if (new Date() > storedToken.expiresAt) {
      await this.repository.revokeRefreshToken(tokenHash)
      throw AppError.unauthorized('Session expired. Please log in again.')
    }

    const userId = BigInt(decoded.userId)
    const user = await this.repository.findByIdWithDetails(userId)

    if (!user || !user.isActive) {
      throw AppError.unauthorized('User account is invalid or deactivated.')
    }

    // Invalidate the old token
    await this.repository.revokeRefreshToken(tokenHash)

    const { roles, permissions, scopes } = this._extractUserContext(user)

    // Issue rotated tokens in the same family
    const newAccessToken = signAccessToken({
      userId: user.id,
      roles,
      permissions,
      scopes,
    })

    const newRawRefreshToken = signRefreshToken(user.id, storedToken.family)
    const newTokenHash = hashToken(newRawRefreshToken)
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

    await this.repository.createRefreshToken({
      userId: user.id,
      tokenHash: newTokenHash,
      family: storedToken.family,
      expiresAt: newExpiresAt,
    })

    return {
      accessToken: newAccessToken,
      refreshToken: newRawRefreshToken,
    }
  }

  /**
   * Terminate active session and invalidate refresh token.
   */
  async logout({ refreshToken: rawToken, userId }) {
    if (rawToken) {
      const tokenHash = hashToken(rawToken)
      await this.repository.revokeRefreshToken(tokenHash)
    }

    if (userId) {
      await this.repository.createAuditLog({
        actorId: BigInt(userId),
        action: 'user.logout',
        targetType: 'User',
        targetId: userId.toString(),
      })
    }

    return { message: 'Logged out successfully.' }
  }

  /**
   * Return the profile and capability matrix for the authenticated user.
   */
  async getMe(userId) {
    const user = await this.repository.findByIdWithDetails(BigInt(userId))
    if (!user) {
      throw AppError.notFound('User not found.')
    }

    const { roles, permissions, scopes } = this._extractUserContext(user)

    return {
      id: user.id.toString(),
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      isActive: user.isActive,
      lastLoginAt: user.lastLoginAt,
      roles,
      permissions,
      scopes,
      employeeProfile: user.employeeProfile
        ? {
            staffId: user.employeeProfile.staffId,
            department: user.employeeProfile.department,
            designation: user.employeeProfile.designation,
          }
        : null,
    }
  }
}

export const authService = new AuthService()

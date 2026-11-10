import { prisma } from '../../lib/prisma.js'

export class AuthRepository {
  /**
   * Find user by email including roles, permissions, employee profile, and scope assignments.
   * @param {string} email
   */
  async findByEmailWithDetails(email) {
    return prisma.user.findUnique({
      where: { email },
      include: {
        employeeProfile: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        scopeAssignments: {
          include: {
            state: true,
            district: true,
            category: true,
            language: true,
          },
        },
      },
    })
  }

  /**
   * Find user by ID including all permission matrices and scopes.
   * @param {bigint} id
   */
  async findByIdWithDetails(id) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        employeeProfile: true,
        userRoles: {
          include: {
            role: {
              include: {
                rolePermissions: {
                  include: {
                    permission: true,
                  },
                },
              },
            },
          },
        },
        scopeAssignments: {
          include: {
            state: true,
            district: true,
            category: true,
            language: true,
          },
        },
      },
    })
  }

  /**
   * Store a newly issued refresh token in the database.
   */
  async createRefreshToken({ userId, tokenHash, family, expiresAt }) {
    return prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        family,
        expiresAt,
        isRevoked: false,
      },
    })
  }

  /**
   * Find a refresh token by its SHA256 hash.
   */
  async findRefreshToken(tokenHash) {
    return prisma.refreshToken.findUnique({
      where: { tokenHash },
    })
  }

  /**
   * Revoke an individual refresh token.
   */
  async revokeRefreshToken(tokenHash) {
    return prisma.refreshToken.update({
      where: { tokenHash },
      data: { isRevoked: true },
    })
  }

  /**
   * Revoke an entire token family (theft detection response).
   */
  async revokeTokenFamily(family) {
    return prisma.refreshToken.updateMany({
      where: { family },
      data: { isRevoked: true },
    })
  }

  /**
   * Update the user's last login timestamp.
   */
  async updateLastLogin(userId) {
    return prisma.user.update({
      where: { id: userId },
      data: { lastLoginAt: new Date() },
    })
  }

  /**
   * Write an entry to the immutable audit log.
   */
  async createAuditLog({ actorId, action, targetType, targetId, ipAddress, userAgent, diffJson }) {
    return prisma.auditLog.create({
      data: {
        actorId,
        action,
        targetType,
        targetId,
        ipAddress,
        userAgent,
        diffJson,
      },
    })
  }
}

export const authRepository = new AuthRepository()


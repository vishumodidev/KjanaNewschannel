import test from 'node:test'
import assert from 'node:assert/strict'
import { AuthService } from '../src/modules/auth/auth.service.js'
import { hashPassword } from '../src/utils/password.js'
import { hashToken, signRefreshToken } from '../src/utils/token.js'

test('AuthService login successfully returns tokens and user context', async () => {
  const password = 'ReporterPassword@123'
  const passwordHash = await hashPassword(password)

  const mockUser = {
    id: 42n,
    email: 'reporter@jananewsnetwork.com',
    displayName: 'Basavaraj Patil',
    passwordHash,
    isActive: true,
    avatarUrl: null,
    userRoles: [
      {
        role: {
          name: 'REPORTER',
          rolePermissions: [
            { permission: { code: 'story.create' } },
            { permission: { code: 'story.edit' } },
          ],
        },
      },
    ],
    scopeAssignments: [
      {
        role: { name: 'REPORTER' },
        scopeType: 'DISTRICT',
        districtId: 5,
        stateId: 1,
        district: { nameEn: 'Belagavi' },
        state: { nameEn: 'Karnataka' },
      },
    ],
    employeeProfile: {
      staffId: 'JNN-BEL-0042',
      department: 'Editorial',
      designation: 'District Staff Reporter',
    },
  }

  const createdRefreshTokens = []
  const auditLogs = []

  const mockRepo = {
    findByEmailWithDetails: async (email) => (email === mockUser.email ? mockUser : null),
    createRefreshToken: async (data) => createdRefreshTokens.push(data),
    updateLastLogin: async () => {},
    createAuditLog: async (log) => auditLogs.push(log),
  }

  const service = new AuthService(mockRepo)
  const result = await service.login({
    email: 'reporter@jananewsnetwork.com',
    password,
    ipAddress: '127.0.0.1',
    userAgent: 'NodeTestAgent',
  })

  assert.equal(result.user.id, '42')
  assert.equal(result.user.email, 'reporter@jananewsnetwork.com')
  assert.deepEqual(result.user.roles, ['REPORTER'])
  assert.ok(result.user.permissions.includes('story.create'))
  assert.equal(result.user.scopes[0].districtName, 'Belagavi')
  assert.ok(result.accessToken)
  assert.ok(result.refreshToken)
  assert.equal(createdRefreshTokens.length, 1)
  assert.equal(auditLogs[0].action, 'user.login')
})

test('AuthService login fails with invalid password', async () => {
  const passwordHash = await hashPassword('CorrectPassword@123')
  const mockUser = {
    id: 1n,
    email: 'test@jananewsnetwork.com',
    passwordHash,
    isActive: true,
    userRoles: [],
    scopeAssignments: [],
  }

  const mockRepo = {
    findByEmailWithDetails: async () => mockUser,
  }

  const service = new AuthService(mockRepo)
  await assert.rejects(
    () =>
      service.login({
        email: 'test@jananewsnetwork.com',
        password: 'WrongPassword@123',
      }),
    {
      statusCode: 401,
      message: 'Invalid email or password.',
    },
  )
})

test('AuthService refresh token reuse detection invalidates family', async () => {
  const family = 'test-family-123'
  const rawToken = signRefreshToken('42', family)
  const tokenHash = hashToken(rawToken)

  const revokedFamilies = []
  const mockRepo = {
    findRefreshToken: async () => ({
      id: 1n,
      tokenHash,
      family,
      isRevoked: true, // Already revoked! Simulated stolen token replay
      expiresAt: new Date(Date.now() + 100000),
    }),
    revokeTokenFamily: async (fam) => {
      revokedFamilies.push(fam)
    },
  }

  const service = new AuthService(mockRepo)

  await assert.rejects(
    () => service.refresh({ refreshToken: rawToken }),
    {
      statusCode: 401,
      message: 'Session terminated due to security violation. Please log in again.',
    },
  )

  assert.ok(revokedFamilies.includes(family), 'Compromised family must be revoked immediately')
})


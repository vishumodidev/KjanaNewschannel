import test from 'node:test'
import assert from 'node:assert/strict'
import {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
  generateRandomToken,
} from '../src/utils/token.js'

test('signAccessToken generates verifiable token with user context', () => {
  const payload = {
    userId: '1001',
    roles: ['REPORTER'],
    permissions: ['story.create', 'story.edit'],
    scopes: [{ scopeType: 'DISTRICT', districtId: 5, districtName: 'Belagavi' }],
  }

  const token = signAccessToken(payload)
  assert.ok(token)

  const decoded = verifyAccessToken(token)
  assert.equal(decoded.userId, '1001')
  assert.deepEqual(decoded.roles, ['REPORTER'])
  assert.deepEqual(decoded.permissions, ['story.create', 'story.edit'])
  assert.equal(decoded.scopes[0].scopeType, 'DISTRICT')
  assert.equal(decoded.scopes[0].districtId, 5)
})

test('signRefreshToken creates token verifiable with refresh secret and family', () => {
  const family = generateRandomToken(16)
  const token = signRefreshToken('1001', family)
  assert.ok(token)

  const decoded = verifyRefreshToken(token)
  assert.equal(decoded.userId, '1001')
  assert.equal(decoded.family, family)
})

test('hashToken is deterministic SHA-256', () => {
  const sample = 'sample-token-abc'
  const hash1 = hashToken(sample)
  const hash2 = hashToken(sample)
  assert.equal(hash1, hash2)
  assert.equal(hash1.length, 64)
})

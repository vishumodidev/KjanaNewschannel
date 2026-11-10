import test from 'node:test'
import assert from 'node:assert/strict'
import { hashPassword, verifyPassword } from '../src/utils/password.js'

test('hashPassword creates valid Argon2id hash and verifyPassword matches correctly', async () => {
  const password = 'SuperSecretPassword@123'
  const hash = await hashPassword(password)

  assert.ok(hash.startsWith('$argon2id$'), 'Hash should be an Argon2id format')

  const valid = await verifyPassword(hash, password)
  assert.equal(valid, true, 'Original password should match hash')

  const invalid = await verifyPassword(hash, 'WrongPassword@999')
  assert.equal(invalid, false, 'Incorrect password must not match hash')
})


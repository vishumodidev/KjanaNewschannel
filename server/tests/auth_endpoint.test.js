import test from 'node:test'
import assert from 'node:assert/strict'
import { IncomingMessage, ServerResponse } from 'node:http'
import { Socket } from 'node:net'
import app from '../src/app.js'
import { signAccessToken } from '../src/utils/token.js'
import { authService } from '../src/modules/auth/auth.service.js'

function request(app, { method = 'GET', url = '/', headers = {}, body = null } = {}) {
  return new Promise((resolve, reject) => {
    const socket = new Socket()
    Object.defineProperty(socket, 'remoteAddress', { value: '127.0.0.1' })
    const req = new IncomingMessage(socket)
    req.method = method
    req.url = url
    req.headers = { host: 'localhost', ...headers }

    const res = new ServerResponse(req)
    let resBody = ''

    res.write = (chunk, encoding, cb) => {
      resBody += chunk ? chunk.toString() : ''
      if (typeof cb === 'function') cb()
      return true
    }

    res.end = (chunk, encoding, cb) => {
      if (chunk) resBody += chunk.toString()
      if (typeof cb === 'function') cb()
      res.emit('finish')

      let parsed = resBody
      try {
        parsed = JSON.parse(resBody)
      } catch {
        // keep raw
      }
      resolve({ statusCode: res.statusCode, headers: res.getHeaders(), body: parsed })
    }

    // Deliver body if payload present
    if (body) {
      const payloadStr = typeof body === 'string' ? body : JSON.stringify(body)
      req.headers['content-type'] = 'application/json'
      req.headers['content-length'] = Buffer.byteLength(payloadStr)
      req.push(Buffer.from(payloadStr))
      req.push(null)
    } else {
      req.push(null)
    }

    app.handle(req, res, (err) => {
      if (err) reject(err)
    })
  })
}

test('POST /api/v1/auth/login rejects invalid input with 422', async () => {
  const res = await request(app, {
    method: 'POST',
    url: '/api/v1/auth/login',
    body: { email: 'not-an-email', password: 'short' },
  })

  assert.equal(res.statusCode, 422)
  assert.equal(res.body.success, false)
  assert.equal(res.body.error.code, 'VALIDATION_ERROR')
  assert.ok(res.body.error.details.email)
  assert.ok(res.body.error.details.password)
})

test('GET /api/v1/auth/me rejects missing token with 401', async () => {
  const res = await request(app, {
    method: 'GET',
    url: '/api/v1/auth/me',
  })

  assert.equal(res.statusCode, 401)
  assert.equal(res.body.success, false)
  assert.equal(res.body.error.message, 'Authentication token is required.')
})

test('GET /api/v1/auth/me succeeds with valid Bearer token and returns user profile', async () => {
  // Stub authService.getMe
  const originalGetMe = authService.getMe
  authService.getMe = async (userId) => ({
    id: userId.toString(),
    email: 'admin@jananewsnetwork.com',
    displayName: 'Admin User',
    roles: ['SUPER_ADMIN'],
    permissions: ['all'],
    scopes: [{ scopeType: 'GLOBAL' }],
    employeeProfile: null,
  })

  try {
    const token = signAccessToken({
      userId: '1',
      roles: ['SUPER_ADMIN'],
      permissions: ['all'],
      scopes: [{ scopeType: 'GLOBAL' }],
    })

    const res = await request(app, {
      method: 'GET',
      url: '/api/v1/auth/me',
      headers: {
        authorization: `Bearer ${token}`,
      },
    })

    assert.equal(res.statusCode, 200)
    assert.equal(res.body.success, true)
    assert.equal(res.body.data.email, 'admin@jananewsnetwork.com')
    assert.deepEqual(res.body.data.roles, ['SUPER_ADMIN'])
  } finally {
    authService.getMe = originalGetMe
  }
})

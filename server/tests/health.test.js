import test from 'node:test'
import assert from 'node:assert/strict'
import { IncomingMessage, ServerResponse } from 'node:http'
import { Socket } from 'node:net'
import app from '../src/app.js'

function request(app, { method = 'GET', url = '/' } = {}) {
  return new Promise((resolve, reject) => {
    const socket = new Socket()
    Object.defineProperty(socket, 'remoteAddress', { value: '127.0.0.1' })
    const req = new IncomingMessage(socket)
    req.method = method
    req.url = url
    req.headers = { host: 'localhost' }

    const res = new ServerResponse(req)
    let body = ''

    res.write = (chunk, encoding, cb) => {
      body += chunk ? chunk.toString() : ''
      if (typeof cb === 'function') cb()
      return true
    }

    res.end = (chunk, encoding, cb) => {
      if (chunk) body += chunk.toString()
      if (typeof cb === 'function') cb()
      res.emit('finish')

      let parsed = body
      try {
        parsed = JSON.parse(body)
      } catch {
        // keep as string
      }
      resolve({ statusCode: res.statusCode, body: parsed })
    }

    app.handle(req, res, (err) => {
      if (err) reject(err)
    })
  })
}

test('GET /api/v1/health returns 200 with service status', async () => {
  const res = await request(app, { method: 'GET', url: '/api/v1/health' })

  assert.equal(res.statusCode, 200)
  assert.equal(res.body.success, true)
  assert.equal(res.body.data.status, 'ok')
  assert.equal(res.body.data.service, 'DIGI NEWS NETWORK API')
  assert.equal(res.body.data.version, '1.0.0')
})

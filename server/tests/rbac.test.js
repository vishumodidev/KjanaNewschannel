import test from 'node:test'
import assert from 'node:assert/strict'
import {
  requirePermission,
  requireRole,
  requireScope,
} from '../src/middleware/authorize.js'
import { authenticate } from '../src/middleware/authenticate.js'
import { signAccessToken } from '../src/utils/token.js'

test('authenticate middleware allows request with valid Bearer token', (t, done) => {
  const token = signAccessToken({
    userId: '10',
    roles: ['REPORTER'],
    permissions: ['story.create'],
    scopes: [],
  })

  const req = {
    headers: {
      authorization: `Bearer ${token}`,
    },
  }

  authenticate(req, {}, (err) => {
    assert.ifError(err)
    assert.equal(req.user.userId, '10')
    assert.deepEqual(req.user.roles, ['REPORTER'])
    done()
  })
})

test('authenticate middleware blocks request missing authorization header', (t, done) => {
  const req = { headers: {} }

  authenticate(req, {}, (err) => {
    assert.ok(err)
    assert.equal(err.statusCode, 401)
    done()
  })
})

test('requirePermission allows SUPER_ADMIN unconditionally', (t, done) => {
  const req = {
    user: {
      roles: ['SUPER_ADMIN'],
      permissions: [],
    },
  }

  const middleware = requirePermission('story.publish', 'ad.manage')
  middleware(req, {}, (err) => {
    assert.ifError(err)
    done()
  })
})

test('requirePermission allows user possessing requested permission', (t, done) => {
  const req = {
    user: {
      roles: ['REPORTER'],
      permissions: ['story.create', 'story.edit'],
    },
  }

  const middleware = requirePermission('story.create')
  middleware(req, {}, (err) => {
    assert.ifError(err)
    done()
  })
})

test('requirePermission blocks user lacking requested permission with 403', (t, done) => {
  const req = {
    user: {
      roles: ['REPORTER'],
      permissions: ['story.create'],
    },
  }

  const middleware = requirePermission('story.publish')
  middleware(req, {}, (err) => {
    assert.ok(err)
    assert.equal(err.statusCode, 403)
    done()
  })
})

test('requireRole blocks user without matching role with 403', (t, done) => {
  const req = {
    user: {
      roles: ['STRINGER'],
      permissions: [],
    },
  }

  const middleware = requireRole('EDITOR_IN_CHIEF', 'MANAGING_EDITOR')
  middleware(req, {}, (err) => {
    assert.ok(err)
    assert.equal(err.statusCode, 403)
    done()
  })
})

test('requireScope permits reporter when district matches assigned scope', async () => {
  const req = {
    user: {
      roles: ['REPORTER'],
      scopes: [
        {
          scopeType: 'DISTRICT',
          districtId: 5, // Belagavi
        },
      ],
    },
    body: {
      districtId: 5,
    },
  }

  const middleware = requireScope({
    resolveResource: (r) => ({ districtId: r.body.districtId }),
  })

  await new Promise((resolve, reject) => {
    middleware(req, {}, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
})

test('requireScope denies reporter attempting to access outside their district with 403', async () => {
  const req = {
    user: {
      roles: ['REPORTER'],
      scopes: [
        {
          scopeType: 'DISTRICT',
          districtId: 5, // Belagavi only
        },
      ],
    },
    body: {
      districtId: 1, // Bengaluru Urban
    },
  }

  const middleware = requireScope({
    resolveResource: (r) => ({ districtId: r.body.districtId }),
  })

  await new Promise((resolve) => {
    middleware(req, {}, (err) => {
      assert.ok(err)
      assert.equal(err.statusCode, 403)
      assert.ok(err.message.includes('geographic or editorial scope'))
      resolve()
    })
  })
})

test('requireScope allows GLOBAL scope user to access any district', async () => {
  const req = {
    user: {
      roles: ['EDITOR_IN_CHIEF'],
      scopes: [{ scopeType: 'GLOBAL' }],
    },
    body: { districtId: 99 },
  }

  const middleware = requireScope({
    resolveResource: (r) => ({ districtId: r.body.districtId }),
  })

  await new Promise((resolve, reject) => {
    middleware(req, {}, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
})

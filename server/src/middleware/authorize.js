import { AppError } from '../errors/AppError.js'

function isSuperAdmin(roles = []) {
  return roles.some((r) => {
    const norm = String(r).toLowerCase().replace(/[^a-z]/g, '')
    return norm === 'superadmin'
  })
}

function normalizePermission(perm) {
  if (!perm) return ''
  return String(perm)
    .toLowerCase()
    .replace(/^story\./, 'article:')
    .replace(/^story:/, 'article:')
    .replace(/^media\./, 'media:')
    .replace(/^editorial\./, 'editorial:')
    .replace(/^user\./, 'user:')
    .replace(/^ad\./, 'ad:')
    .replace(/^audit\./, 'audit:')
    .replace(/^analytics\./, 'analytics:')
    .replace('.', ':')
}

/**
 * Check if the authenticated user has at least one of the specified permissions.
 * Super admins bypass all permission checks.
 *
 * @param {...string} requiredPermissions
 */
export function requirePermission(...requiredPermissions) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'))
    }

    const { roles = [], permissions = [] } = req.user

    // Super Admin has unconditional access
    if (isSuperAdmin(roles)) {
      return next()
    }

    const userPerms = permissions.map(normalizePermission)
    const hasMatchingPermission = requiredPermissions.some((perm) => {
      const norm = normalizePermission(perm)
      return userPerms.includes(norm) || permissions.includes(perm)
    })

    if (!hasMatchingPermission) {
      return next(
        AppError.forbidden(
          `Permission denied. Required one of: [${requiredPermissions.join(', ')}]`,
        ),
      )
    }

    next()
  }
}

/**
 * Check if the authenticated user has ALL of the specified permissions.
 *
 * @param {...string} requiredPermissions
 */
export function requireAllPermissions(...requiredPermissions) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'))
    }

    const { roles = [], permissions = [] } = req.user

    if (isSuperAdmin(roles)) {
      return next()
    }

    const userPerms = permissions.map(normalizePermission)
    const hasAll = requiredPermissions.every((perm) => {
      const norm = normalizePermission(perm)
      return userPerms.includes(norm) || permissions.includes(perm)
    })

    if (!hasAll) {
      return next(
        AppError.forbidden(
          `Permission denied. Missing required permissions: [${requiredPermissions.join(', ')}]`,
        ),
      )
    }

    next()
  }
}

/**
 * Check if the user has any of the specified roles.
 *
 * @param {...string} allowedRoles
 */
export function requireRole(...allowedRoles) {
  return (req, _res, next) => {
    if (!req.user) {
      return next(AppError.unauthorized('Authentication required.'))
    }

    const { roles = [] } = req.user

    if (isSuperAdmin(roles)) {
      return next()
    }

    const hasRole = allowedRoles.some((role) =>
      roles.some(
        (r) =>
          r.toLowerCase() === role.toLowerCase() ||
          r.toLowerCase().replace(/[^a-z]/g, '') === role.toLowerCase().replace(/[^a-z]/g, ''),
      ),
    )

    if (!hasRole) {
      return next(
        AppError.forbidden(
          `Role access restricted. Allowed roles: [${allowedRoles.join(', ')}]`,
        ),
      )
    }

    next()
  }
}

/**
 * Geographic and Editorial Scope authorization middleware.
 * Verifies that the user's assigned scope encompasses the requested entity.
 *
 * @param {object} options
 * @param {(req: import('express').Request) => Promise<object> | object} options.resolveResource - extracts target { stateId, districtId, categoryId, languageId }
 */
export function requireScope({ resolveResource }) {
  return async (req, _res, next) => {
    try {
      if (!req.user) {
        return next(AppError.unauthorized('Authentication required.'))
      }

      const { roles = [], scopes = [] } = req.user

      // Super Admin bypass
      if (isSuperAdmin(roles)) {
        return next()
      }

      // Check if user has any GLOBAL scope
      const hasGlobalScope = scopes.some((s) => s.scopeType === 'GLOBAL')
      if (hasGlobalScope) {
        return next()
      }

      const target = await resolveResource(req)

      if (!target) {
        return next()
      }

      // Check if any of the user's scope assignments covers this target
      const isAllowed = scopes.some((scope) => {
        switch (scope.scopeType) {
          case 'STATE':
            return (
              target.stateId !== undefined &&
              Number(scope.stateId) === Number(target.stateId)
            )
          case 'DISTRICT':
            return (
              target.districtId !== undefined &&
              Number(scope.districtId) === Number(target.districtId)
            )
          case 'CATEGORY':
            return (
              target.categoryId !== undefined &&
              Number(scope.categoryId) === Number(target.categoryId)
            )
          case 'LANGUAGE':
            return (
              target.languageId !== undefined &&
              Number(scope.languageId) === Number(target.languageId)
            )
          default:
            return false
        }
      })

      if (!isAllowed) {
        return next(
          AppError.forbidden(
            'Action rejected: Resource is outside your assigned geographic or editorial scope.',
          ),
        )
      }

      next()
    } catch (err) {
      next(err)
    }
  }
}

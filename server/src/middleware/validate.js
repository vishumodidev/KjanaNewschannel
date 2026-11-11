import { AppError } from '../errors/AppError.js'

// ── Validation middleware factory ───────────────────────────────────────────
// Usage: router.post('/path', validate(MyZodSchema), controller)
// Validates req.body by default; pass 'query' or 'params' for other sources.

/**
 * @param {import('zod').ZodTypeAny} schema  - Zod schema to validate against
 * @param {'body'|'query'|'params'} [source] - Request property to validate
 */
export const validate = (schema, source = 'body') => (req, _res, next) => {
  const result = schema.safeParse(req[source])

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    throw AppError.unprocessable('Request validation failed.', 'VALIDATION_ERROR', fieldErrors)
  }

  // In Express 5, req.query is a getter — mutate existing object properties
  if (source === 'query' || source === 'params') {
    if (req[source] && typeof req[source] === 'object') {
      Object.assign(req[source], result.data)
    }
  } else {
    req[source] = result.data
  }

  req.validated = result.data
  next()
}


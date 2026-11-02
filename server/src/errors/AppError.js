// ── Custom Application Error ────────────────────────────────────────────────
// All intentional errors thrown from service / repository layers should be
// instances of AppError.  The centralized errorHandler middleware will map
// these to well-formed JSON responses without leaking stack traces.
export class AppError extends Error {
  /**
   * @param {string} message       - Human-readable error message
   * @param {number} statusCode    - HTTP status code
   * @param {string} code          - Machine-readable error code (e.g. ARTICLE_NOT_FOUND)
   * @param {unknown} [details]    - Optional structured details (Zod field errors, etc.)
   */
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR', details = null) {
    super(message)
    this.name = 'AppError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
    // Maintain proper prototype chain for instanceof checks
    Error.captureStackTrace?.(this, this.constructor)
  }

  // ── Factory helpers ────────────────────────────────────────────────────────

  static badRequest(message, code = 'BAD_REQUEST', details = null) {
    return new AppError(message, 400, code, details)
  }

  static unauthorized(message = 'Authentication required.', code = 'UNAUTHORIZED') {
    return new AppError(message, 401, code)
  }

  static forbidden(message = 'You do not have permission to perform this action.', code = 'FORBIDDEN') {
    return new AppError(message, 403, code)
  }

  static notFound(resource = 'Resource', code = 'NOT_FOUND') {
    return new AppError(`${resource} not found.`, 404, code)
  }

  static conflict(message, code = 'CONFLICT') {
    return new AppError(message, 409, code)
  }

  static unprocessable(message, code = 'VALIDATION_ERROR', details = null) {
    return new AppError(message, 422, code, details)
  }

  static tooManyRequests(message = 'Too many requests. Please try again later.', code = 'RATE_LIMIT_EXCEEDED') {
    return new AppError(message, 429, code)
  }
}


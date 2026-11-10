import argon2 from 'argon2'

/**
 * Hash a plain text password using Argon2id.
 * Configuration follows OWASP recommended parameters for password hashing.
 *
 * @param {string} plainPassword
 * @returns {Promise<string>}
 */
export async function hashPassword(plainPassword) {
  return argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 65536, // 64 MB
    timeCost: 3,       // 3 iterations
    parallelism: 1,    // 1 thread
  })
}

/**
 * Verify a plain text password against an Argon2 hash.
 *
 * @param {string} hash
 * @param {string} plainPassword
 * @returns {Promise<boolean>}
 */
export async function verifyPassword(hash, plainPassword) {
  try {
    return await argon2.verify(hash, plainPassword)
  } catch {
    return false
  }
}

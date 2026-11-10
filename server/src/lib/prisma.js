import { PrismaClient } from '@prisma/client'
import { appConfig } from '../config/app.config.js'

// ── Prisma Client Singleton ──────────────────────────────────────────────────
// In development, preserve the client instance across HMR reloads to prevent
// exhausting the MySQL connection pool.

// Enable BigInt serialization in JSON responses
if (!BigInt.prototype.toJSON) {
  BigInt.prototype.toJSON = function () {
    return this.toString()
  }
}

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: appConfig.isDev ? ['warn', 'error'] : ['error'],
  })

if (appConfig.isDev) globalForPrisma.prisma = prisma

export default prisma

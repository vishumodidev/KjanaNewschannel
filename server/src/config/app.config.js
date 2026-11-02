import { z } from 'zod'

// ── Environment schema ──────────────────────────────────────────────────────
// All env vars are validated at startup. Missing required vars will crash fast
// with a clear error rather than failing silently at runtime.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(3000),

  // Database — optional in Phase 1 (no DB needed for health check)
  DATABASE_URL: z.string().optional(),

  // JWT secrets — defaults are intentionally weak dev-only values
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be at least 32 characters')
    .default('dev-access-secret-CHANGE-IN-PRODUCTION-needs-64-random-chars'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters')
    .default('dev-refresh-secret-CHANGE-IN-PRODUCTION-needs-64-random-chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // CORS — comma-separated origins
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default('http://localhost:5173,http://localhost:5174'),

  // Storage
  STORAGE_DRIVER: z.enum(['local', 's3']).default('local'),
  LOCAL_STORAGE_PATH: z.string().default('./uploads'),
  MAX_FILE_SIZE_MB: z.coerce.number().default(20),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌  Invalid server configuration — check environment variables:')
  console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
  process.exit(1)
}

const env = parsed.data

// ── Exported config object ──────────────────────────────────────────────────
export const appConfig = {
  env: env.NODE_ENV,
  port: env.PORT,
  isDev: env.NODE_ENV === 'development',
  isProd: env.NODE_ENV === 'production',
  isTest: env.NODE_ENV === 'test',

  db: {
    url: env.DATABASE_URL,
  },

  jwt: {
    accessSecret: env.JWT_ACCESS_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },

  cors: {
    allowedOrigins: env.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
  },

  storage: {
    driver: env.STORAGE_DRIVER,
    localPath: env.LOCAL_STORAGE_PATH,
    maxFileSizeMb: env.MAX_FILE_SIZE_MB,
  },
}


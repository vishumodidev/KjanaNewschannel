import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email address format')
    .max(255),
  password: z
    .string({ required_error: 'Password is required' })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password exceeds maximum length'),
})

export const refreshSchema = z.object({
  refreshToken: z.string().optional(),
})


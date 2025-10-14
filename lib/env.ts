import { z } from 'zod'

// Use optional validation with defaults for build time
// This allows the app to build without Supabase credentials
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url({
      message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL',
    })
    .default('https://placeholder.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, {
      message: 'NEXT_PUBLIC_SUPABASE_ANON_KEY is required',
    })
    .default('placeholder-anon-key'),
})

function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL:
      process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
  })

  if (!parsed.success) {
    console.warn(
      '⚠️  Invalid environment variables (using defaults):',
      parsed.error.flatten().fieldErrors
    )
    // Return defaults instead of throwing
    return {
      NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-anon-key',
    }
  }

  return parsed.data
}

export const env = validateEnv()

export type Env = z.infer<typeof envSchema>

// Helper to check if environment is properly configured
export function isSupabaseConfigured() {
  return (
    env.NEXT_PUBLIC_SUPABASE_URL !== 'https://placeholder.supabase.co' &&
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY !== 'placeholder-anon-key'
  )
}

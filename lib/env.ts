import { z } from 'zod'

// Use optional validation with defaults for build time
// This allows the app to build without credentials
const envSchema = z.object({
  // Supabase
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

  // Stripe - Public Keys
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, {
      message: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required',
    })
    .default('pk_test_placeholder'),

  // Stripe - Secret Keys (server-only)
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, {
      message: 'STRIPE_SECRET_KEY is required',
    })
    .default('sk_test_placeholder'),
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, {
      message: 'STRIPE_WEBHOOK_SECRET is required for webhook verification',
    })
    .default('whsec_placeholder'),

  // Stripe - Price IDs (JSON format for flexibility)
  // Example: {"starter":"price_xxx","pro":"price_xxx","enterprise":"price_xxx"}
  STRIPE_PRICE_IDS: z
    .string()
    .default('{}')
    .transform((val) => {
      try {
        return JSON.parse(val) as Record<string, string>
      } catch {
        console.warn(
          '⚠️  Invalid STRIPE_PRICE_IDS JSON format, using empty object'
        )
        return {}
      }
    }),

  // Site URL (for redirects, webhooks, etc.)
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url({
      message: 'NEXT_PUBLIC_SITE_URL must be a valid URL',
    })
    .default('http://localhost:3000'),
})

function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || undefined,
    NEXT_PUBLIC_SUPABASE_ANON_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || undefined,
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || undefined,
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || undefined,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || undefined,
    STRIPE_PRICE_IDS: process.env.STRIPE_PRICE_IDS || undefined,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  })

  if (!parsed.success) {
    console.warn(
      '⚠️  Invalid environment variables (using defaults):',
      parsed.error.flatten().fieldErrors
    )
    // Return defaults instead of throwing to allow build
    return {
      NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-anon-key',
      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: 'pk_test_placeholder',
      STRIPE_SECRET_KEY: 'sk_test_placeholder',
      STRIPE_WEBHOOK_SECRET: 'whsec_placeholder',
      STRIPE_PRICE_IDS: {},
      NEXT_PUBLIC_SITE_URL: 'http://localhost:3000',
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

// Helper to check if Stripe is properly configured
export function isStripeConfigured() {
  return (
    env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY !== 'pk_test_placeholder' &&
    env.STRIPE_SECRET_KEY !== 'sk_test_placeholder' &&
    env.STRIPE_WEBHOOK_SECRET !== 'whsec_placeholder'
  )
}

// Helper to get a Stripe Price ID by plan name (case-insensitive)
export function getStripePriceId(planName: string): string | undefined {
  const normalizedPlanName = planName.toLowerCase()
  return env.STRIPE_PRICE_IDS[normalizedPlanName]
}

// Helper to get all configured Stripe price IDs
export function getStripePriceIds(): Record<string, string> {
  return env.STRIPE_PRICE_IDS
}

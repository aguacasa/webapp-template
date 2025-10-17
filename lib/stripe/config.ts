import Stripe from 'stripe'
import { env, isStripeConfigured } from '@/lib/env'

/**
 * Server-side Stripe client
 * Use this for all server-side Stripe operations
 */
export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-09-30.clover',
  typescript: true,
  appInfo: {
    name: 'webapp-template',
    version: '1.0.0',
  },
})

/**
 * Stripe configuration status
 * Check if Stripe is properly configured before using
 */
export { isStripeConfigured }

/**
 * Get the Stripe publishable key for client-side usage
 */
export function getStripePublishableKey(): string {
  return env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
}

/**
 * Get the Stripe webhook secret
 */
export function getStripeWebhookSecret(): string {
  return env.STRIPE_WEBHOOK_SECRET
}

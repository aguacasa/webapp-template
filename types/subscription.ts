import type Stripe from 'stripe'

/**
 * Subscription status types
 * Mirrors Stripe subscription statuses with additional custom states
 */
export type SubscriptionStatus =
  | 'active' // Active paid subscription
  | 'trialing' // In trial period
  | 'past_due' // Payment failed, subscription still active with grace period
  | 'canceled' // Subscription canceled
  | 'unpaid' // Payment failed, subscription inactive
  | 'incomplete' // Initial payment failed
  | 'incomplete_expired' // Initial payment never completed
  | 'paused' // Subscription paused (Stripe feature)
  | 'free' // Custom: user on free plan (no Stripe subscription)

/**
 * Subscription tier types
 * Used for feature gating and plan identification
 */
export type SubscriptionTier = 'free' | 'paid'

/**
 * Database subscription record
 * Matches the subscriptions table schema in Supabase
 */
export interface Subscription {
  id: string
  user_id: string
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_price_id: string | null
  status: SubscriptionStatus
  plan_name: string | null // e.g., "Pro", "Basic", "Plus"
  trial_end: string | null // ISO timestamp
  trial_start: string | null // ISO timestamp
  current_period_start: string | null // ISO timestamp
  current_period_end: string | null // ISO timestamp
  cancel_at_period_end: boolean
  canceled_at: string | null // ISO timestamp
  created_at: string // ISO timestamp
  updated_at: string // ISO timestamp
}

/**
 * Subscription with computed properties
 * Used in application logic for easier status checks
 */
export interface SubscriptionWithStatus extends Subscription {
  isActive: boolean
  isTrialing: boolean
  isFreePlan: boolean
  isPaidPlan: boolean
  isCanceled: boolean
  daysUntilTrialEnd: number | null
  daysUntilPeriodEnd: number | null
}

/**
 * Stripe webhook event types we handle
 */
export type StripeWebhookEvent =
  | 'checkout.session.completed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'customer.subscription.trial_will_end'
  | 'invoice.payment_succeeded'
  | 'invoice.payment_failed'

/**
 * Checkout session metadata
 * Custom data passed to Stripe checkout
 */
export interface CheckoutMetadata {
  userId: string
  planName: string
  priceId: string
}

/**
 * Subscription creation/update input
 */
export interface SubscriptionInput {
  user_id: string
  stripe_customer_id: string
  stripe_subscription_id: string
  stripe_price_id: string
  status: SubscriptionStatus
  plan_name: string
  trial_end?: string | null
  trial_start?: string | null
  current_period_start: string
  current_period_end: string
  cancel_at_period_end?: boolean
  canceled_at?: string | null
}

/**
 * Helper type for Stripe subscription objects
 */
export type StripeSubscription = Stripe.Subscription

/**
 * Helper type for Stripe checkout session objects
 */
export type StripeCheckoutSession = Stripe.Checkout.Session

/**
 * Feature access configuration
 * Define which features are available per plan
 */
export interface FeatureAccess {
  [planName: string]: {
    features: string[]
    limits?: {
      [key: string]: number | 'unlimited'
    }
  }
}

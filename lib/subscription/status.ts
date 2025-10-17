import type { Subscription, SubscriptionWithStatus } from '@/types/subscription'

/**
 * Calculate days until a date
 */
function daysUntil(date: string | null): number | null {
  if (!date) return null
  const targetDate = new Date(date)
  const now = new Date()
  const diff = targetDate.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Enhance subscription with computed status properties
 */
export function enhanceSubscription(
  subscription: Subscription
): SubscriptionWithStatus {
  const now = new Date()
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end)
    : null

  const isTrialing =
    subscription.status === 'trialing' && trialEnd ? trialEnd > now : false
  const isActive = subscription.status === 'active'
  const isFreePlan = subscription.status === 'free'
  const isPaidPlan = (isActive || isTrialing) && !isFreePlan
  const isCanceled =
    subscription.status === 'canceled' || subscription.cancel_at_period_end

  return {
    ...subscription,
    isActive,
    isTrialing,
    isFreePlan,
    isPaidPlan,
    isCanceled,
    daysUntilTrialEnd: daysUntil(subscription.trial_end),
    daysUntilPeriodEnd: daysUntil(subscription.current_period_end),
  }
}

/**
 * Check if user is on a trial
 */
export function isOnTrial(subscription: Subscription | null): boolean {
  if (!subscription) return false
  const now = new Date()
  const trialEnd = subscription.trial_end
    ? new Date(subscription.trial_end)
    : null
  return subscription.status === 'trialing' && trialEnd ? trialEnd > now : false
}

/**
 * Check if user is on a free plan
 */
export function isOnFreePlan(subscription: Subscription | null): boolean {
  return subscription?.status === 'free' || !subscription
}

/**
 * Check if user is on a paid plan (active subscription)
 */
export function isOnPaidPlan(subscription: Subscription | null): boolean {
  if (!subscription) return false
  return subscription.status === 'active' || subscription.status === 'trialing'
}

/**
 * Check if subscription is canceled or will be canceled
 */
export function isCanceled(subscription: Subscription | null): boolean {
  if (!subscription) return false
  return subscription.status === 'canceled' || subscription.cancel_at_period_end
}

/**
 * Get user-friendly status message
 */
export function getStatusMessage(subscription: Subscription | null): string {
  if (!subscription || subscription.status === 'free') {
    return 'Free Plan'
  }

  switch (subscription.status) {
    case 'trialing':
      return 'Free Trial'
    case 'active':
      if (subscription.cancel_at_period_end) {
        return 'Canceling at period end'
      }
      return 'Active'
    case 'past_due':
      return 'Payment Past Due'
    case 'canceled':
      return 'Canceled'
    case 'unpaid':
      return 'Unpaid'
    case 'incomplete':
      return 'Payment Incomplete'
    case 'incomplete_expired':
      return 'Payment Expired'
    case 'paused':
      return 'Paused'
    default:
      return 'Unknown'
  }
}

/**
 * Get the display name for the current plan
 */
export function getPlanDisplayName(subscription: Subscription | null): string {
  if (!subscription || !subscription.plan_name) {
    return 'Starter'
  }
  return subscription.plan_name
}

/**
 * Feature access configuration
 * Customize this based on your app's features
 */
const FEATURE_ACCESS: Record<
  string,
  {
    features: string[]
    limits?: Record<string, number | 'unlimited'>
  }
> = {
  starter: {
    features: ['basic_analytics', 'community_support'],
    limits: {
      projects: 3,
      storage_gb: 1,
    },
  },
  pro: {
    features: [
      'basic_analytics',
      'advanced_analytics',
      'priority_support',
      'custom_integrations',
    ],
    limits: {
      projects: 'unlimited',
      storage_gb: 50,
    },
  },
  enterprise: {
    features: [
      'basic_analytics',
      'advanced_analytics',
      'priority_support',
      'custom_integrations',
      'dedicated_support',
      'advanced_security',
    ],
    limits: {
      projects: 'unlimited',
      storage_gb: 'unlimited',
    },
  },
}

/**
 * Check if user has access to a specific feature
 */
export function hasFeatureAccess(
  subscription: Subscription | null,
  feature: string
): boolean {
  if (!subscription || !subscription.plan_name) {
    // Free plan gets starter features
    return FEATURE_ACCESS.starter?.features.includes(feature) ?? false
  }

  const planName = subscription.plan_name.toLowerCase()
  const planAccess = FEATURE_ACCESS[planName]

  if (!planAccess) {
    // If plan not found, default to starter features
    return FEATURE_ACCESS.starter?.features.includes(feature) ?? false
  }

  return planAccess.features.includes(feature)
}

/**
 * Get usage limit for a specific resource
 */
export function getUsageLimit(
  subscription: Subscription | null,
  resource: string
): number | 'unlimited' {
  if (!subscription || !subscription.plan_name) {
    return FEATURE_ACCESS.starter?.limits?.[resource] ?? 0
  }

  const planName = subscription.plan_name.toLowerCase()
  const planAccess = FEATURE_ACCESS[planName]

  if (!planAccess || !planAccess.limits) {
    return FEATURE_ACCESS.starter?.limits?.[resource] ?? 0
  }

  return planAccess.limits[resource] ?? 0
}

/**
 * Check if user has reached a usage limit
 */
export function hasReachedLimit(
  subscription: Subscription | null,
  resource: string,
  currentUsage: number
): boolean {
  const limit = getUsageLimit(subscription, resource)

  if (limit === 'unlimited') return false
  if (typeof limit === 'number') {
    return currentUsage >= limit
  }

  return true
}

import type { Subscription } from '@/types/subscription'
import { hasFeatureAccess } from '@/lib/subscription/status'

interface FeatureGateProps {
  subscription: Subscription | null
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Conditionally render content based on feature access
 */
export function FeatureGate({
  subscription,
  feature,
  children,
  fallback = null,
}: FeatureGateProps) {
  const hasAccess = hasFeatureAccess(subscription, feature)

  if (hasAccess) {
    return <>{children}</>
  }

  return <>{fallback}</>
}

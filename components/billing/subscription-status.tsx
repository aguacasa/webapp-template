import type { Subscription } from '@/types/subscription'
import {
  enhanceSubscription,
  getStatusMessage,
  getPlanDisplayName,
} from '@/lib/subscription/status'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface SubscriptionStatusProps {
  subscription: Subscription | null
}

export function SubscriptionStatus({ subscription }: SubscriptionStatusProps) {
  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>No subscription found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const enhanced = enhanceSubscription(subscription)
  const statusMessage = getStatusMessage(subscription)
  const planName = getPlanDisplayName(subscription)

  const getStatusVariant = (): 'default' | 'secondary' | 'destructive' => {
    if (enhanced.isActive) return 'default'
    if (enhanced.isTrialing) return 'secondary'
    if (enhanced.isCanceled) return 'destructive'
    return 'secondary'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{planName} Plan</CardTitle>
            <CardDescription>
              <Badge variant={getStatusVariant()} className="mt-2">
                {statusMessage}
              </Badge>
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {enhanced.isTrialing && enhanced.daysUntilTrialEnd !== null && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Trial Period</p>
            <p className="text-sm text-muted-foreground">
              {enhanced.daysUntilTrialEnd > 0
                ? `${enhanced.daysUntilTrialEnd} days remaining in your free trial`
                : 'Your trial ends today'}
            </p>
          </div>
        )}

        {enhanced.isActive && enhanced.daysUntilPeriodEnd !== null && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Billing Period</p>
            <p className="text-sm text-muted-foreground">
              {enhanced.cancel_at_period_end
                ? `Your subscription will cancel in ${enhanced.daysUntilPeriodEnd} days`
                : `Renews in ${enhanced.daysUntilPeriodEnd} days`}
            </p>
          </div>
        )}

        {enhanced.isFreePlan && (
          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm font-medium">Free Plan</p>
            <p className="text-sm text-muted-foreground">
              Upgrade to unlock more features
            </p>
          </div>
        )}

        {subscription.current_period_end && (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Billing cycle</dt>
              <dd className="font-medium">
                {new Date(subscription.current_period_end).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        )}
      </CardContent>
    </Card>
  )
}

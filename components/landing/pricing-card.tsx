import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SubscribeButton } from '@/components/billing/subscribe-button'
import type { PricingPlan } from '@/lib/data/pricing'
import { cn } from '@/lib/utils'

interface PricingCardProps {
  plan: PricingPlan
}

export function PricingCard({ plan }: PricingCardProps) {
  const hasPriceId = plan.stripePriceId && plan.stripePriceId !== 'price_pro'

  return (
    <Card className={cn(plan.popular && 'border-primary')}>
      <CardHeader>
        {plan.popular && (
          <div className="mb-2 inline-block rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            Most Popular
          </div>
        )}
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">
            {typeof plan.price === 'number' ? `$${plan.price}` : plan.price}
          </span>
          {plan.period && (
            <span className="text-muted-foreground">{plan.period}</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 text-sm">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-6">
          {hasPriceId ? (
            <SubscribeButton
              planName={plan.name}
              priceId={plan.stripePriceId!}
              trialDays={plan.trialDays}
              variant={plan.buttonVariant || 'default'}
            >
              {plan.buttonText}
            </SubscribeButton>
          ) : (
            <Link href="/register" className="block">
              <Button
                className="w-full"
                variant={plan.buttonVariant || 'default'}
              >
                {plan.buttonText}
              </Button>
            </Link>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

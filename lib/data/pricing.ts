export interface PricingPlan {
  name: string
  description: string
  price: number | 'Custom'
  period?: string
  features: string[]
  buttonText: string
  buttonVariant?: 'default' | 'outline'
  popular?: boolean
  stripePriceId?: string // Stripe Price ID for this plan (optional for free/custom plans)
  trialDays?: number // Number of trial days for paid plans (e.g., 7 or 14)
}

export const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    description: 'Perfect for getting started',
    price: 0,
    period: '/month',
    features: [
      'Up to 3 projects',
      'Basic analytics',
      'Community support',
      '1GB storage',
    ],
    buttonText: 'Get Started',
    buttonVariant: 'outline',
    // No stripePriceId for free tier
  },
  {
    name: 'Pro',
    description: 'For growing businesses',
    price: 29,
    period: '/month',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      'Priority support',
      '50GB storage',
      'Custom integrations',
    ],
    buttonText: 'Start Free Trial',
    popular: true,
    stripePriceId: 'price_pro', // Replace with actual Stripe Price ID
    trialDays: 14, // 14-day free trial for Pro plan
  },
  {
    name: 'Enterprise',
    description: 'For large organizations',
    price: 'Custom',
    features: [
      'Everything in Pro',
      'Dedicated support',
      'Custom contracts',
      'Unlimited storage',
      'Advanced security',
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline',
    // No stripePriceId for custom/contact sales plans
  },
]

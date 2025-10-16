export interface PricingPlan {
  name: string
  description: string
  price: number | 'Custom'
  period?: string
  features: string[]
  buttonText: string
  buttonVariant?: 'default' | 'outline'
  popular?: boolean
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
    buttonText: 'Get Started',
    popular: true,
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
  },
]

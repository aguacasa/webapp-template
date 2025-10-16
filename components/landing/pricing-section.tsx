import { pricingPlans } from '@/lib/data/pricing'
import { PricingCard } from './pricing-card'

export function PricingSection() {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground">
            Choose the plan that&apos;s right for you
          </p>
        </div>
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} />
          ))}
        </div>
      </div>
    </section>
  )
}

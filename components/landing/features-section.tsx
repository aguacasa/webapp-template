import { features } from '@/lib/data/landing-features'
import { FeatureCard } from './feature-card'

export function FeaturesSection() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Everything You Need
          </h2>
          <p className="text-lg text-muted-foreground">
            Powerful features to help you succeed
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}

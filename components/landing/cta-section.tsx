import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CTASection() {
  return (
    <section className="border-t py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Get Started?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Join thousands of teams already building amazing products with our
            platform. Start your free trial today.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Trial
              </Button>
            </Link>
            <Link href="#pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required • 14-day free trial • Cancel anytime
          </p>
        </div>
      </div>
    </section>
  )
}

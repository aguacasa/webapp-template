import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="container mx-auto px-4 py-20 text-center md:py-32">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Build Something Amazing Today
        </h1>
        <p className="mb-8 text-lg text-muted-foreground md:text-xl">
          The modern platform that helps you ship faster, scale effortlessly,
          and delight your customers with every interaction.
        </p>
        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/register">
            <Button size="lg" className="w-full sm:w-auto">
              Start Free Trial
            </Button>
          </Link>
          <Link href="#features">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}

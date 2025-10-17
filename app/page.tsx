import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { LandingHeader } from '@/components/landing/header'
import { HeroSection } from '@/components/landing/hero-section'
import { AboutSection } from '@/components/landing/about-section'
import { FeaturesSection } from '@/components/landing/features-section'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { FAQSection } from '@/components/landing/faq-section'
import { CTASection } from '@/components/landing/cta-section'
import { LandingFooter } from '@/components/landing/footer'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata'
import {
  generateSoftwareApplicationSchema,
  StructuredData,
} from '@/lib/seo/schema'

export const metadata: Metadata = generateSEOMetadata({
  title: 'Home',
  description:
    'Build your next SaaS application with our modern Next.js starter template. Features TypeScript, Supabase authentication, and production-ready components.',
  keywords: [
    'SaaS template',
    'Next.js starter',
    'React app template',
    'TypeScript SaaS',
    'Supabase authentication',
    'web application builder',
    'production-ready template',
  ],
})

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const softwareSchema = generateSoftwareApplicationSchema({
    name: 'Next.js Starter Template',
    description:
      'A modern web application built with Next.js, TypeScript, and Supabase',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      price: '0',
      priceCurrency: 'USD',
    },
  })

  return (
    <>
      <StructuredData data={softwareSchema} />
      <div className="flex min-h-screen flex-col">
        <LandingHeader user={user} />
        <HeroSection />
        <AboutSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FAQSection />
        <CTASection />
        <LandingFooter />
      </div>
    </>
  )
}

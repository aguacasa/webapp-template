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

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
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
  )
}

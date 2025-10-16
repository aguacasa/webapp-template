import { faqItems } from '@/lib/data/faq'
import { FAQCard } from './faq-card'

export function FAQSection() {
  return (
    <section id="faq" className="border-t bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know
          </p>
        </div>
        <div className="mx-auto max-w-3xl space-y-4">
          {faqItems.map((item, index) => (
            <FAQCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  )
}

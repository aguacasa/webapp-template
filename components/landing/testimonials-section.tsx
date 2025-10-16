import { testimonials } from '@/lib/data/testimonials'
import { TestimonialCard } from './testimonial-card'

export function TestimonialsSection() {
  return (
    <section className="border-t bg-muted/50 py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Loved by Teams Everywhere
          </h2>
          <p className="text-lg text-muted-foreground">
            See what our customers have to say
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  )
}

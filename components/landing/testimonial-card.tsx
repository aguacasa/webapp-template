import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from '@/components/ui/card'
import type { Testimonial } from '@/lib/data/testimonials'

interface TestimonialCardProps {
  testimonial: Testimonial
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex items-center gap-1 text-yellow-500">
          {'★'.repeat(testimonial.rating)}
        </div>
        <CardDescription>{testimonial.name}</CardDescription>
        <CardDescription className="text-xs">
          {testimonial.role}, {testimonial.company}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          &quot;{testimonial.quote}&quot;
        </p>
      </CardContent>
    </Card>
  )
}

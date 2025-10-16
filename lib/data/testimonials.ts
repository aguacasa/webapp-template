export interface Testimonial {
  name: string
  role: string
  company: string
  rating: number
  quote: string
}

export const testimonials: Testimonial[] = [
  {
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart Inc.',
    rating: 5,
    quote:
      "This platform completely transformed how we work. The speed and reliability are unmatched. Couldn't be happier!",
  },
  {
    name: 'Michael Chen',
    role: 'CTO',
    company: 'InnovateLabs',
    rating: 5,
    quote:
      "The best investment we've made this year. Our team productivity has increased by 40% since we started using it.",
  },
  {
    name: 'Emily Rodriguez',
    role: 'Product Manager',
    company: 'DesignCo',
    rating: 5,
    quote:
      "Incredible support team and a product that just works. It's rare to find both in one package.",
  },
]

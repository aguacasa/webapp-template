import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { FAQItem } from '@/lib/data/faq'

interface FAQCardProps {
  item: FAQItem
}

export function FAQCard({ item }: FAQCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{item.question}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{item.answer}</p>
      </CardContent>
    </Card>
  )
}

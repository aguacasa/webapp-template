import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import type { Feature } from '@/lib/data/landing-features'

interface FeatureCardProps {
  feature: Feature
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {feature.icon} {feature.title}
        </CardTitle>
        <CardDescription>{feature.subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{feature.description}</p>
      </CardContent>
    </Card>
  )
}

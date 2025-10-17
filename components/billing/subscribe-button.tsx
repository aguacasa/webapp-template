'use client'

import { useState } from 'react'
import { redirectToCheckout } from '@/app/actions/stripe'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface SubscribeButtonProps {
  planName: string
  priceId: string
  trialDays?: number
  variant?: 'default' | 'outline'
  children?: React.ReactNode
}

export function SubscribeButton({
  planName,
  priceId,
  trialDays,
  variant = 'default',
  children,
}: SubscribeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleSubscribe() {
    setIsLoading(true)
    try {
      await redirectToCheckout(planName, priceId, trialDays)
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to start checkout',
        variant: 'destructive',
      })
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleSubscribe} disabled={isLoading} variant={variant}>
      {isLoading ? 'Loading...' : children}
    </Button>
  )
}

'use client'

import { useState } from 'react'
import { redirectToCustomerPortal } from '@/app/actions/stripe'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

export function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleManageBilling() {
    setIsLoading(true)
    try {
      await redirectToCustomerPortal()
    } catch (error) {
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to open billing portal',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleManageBilling} disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Manage Billing'}
    </Button>
  )
}

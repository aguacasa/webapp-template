'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe/config'
import { env } from '@/lib/env'
import { getUserSubscription } from '@/lib/subscription/queries'
import type { Subscription } from '@/types/subscription'

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession(
  planName: string,
  priceId: string,
  trialDays?: number
): Promise<{ url: string } | { error: string }> {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'You must be logged in to subscribe' }
    }

    // Get or create Stripe customer
    const subscription = await getUserSubscription(supabase, user.id)
    let customerId = subscription?.stripe_customer_id

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      })
      customerId = customer.id
    }

    // Build checkout session params
    const sessionParams: {
      customer: string
      line_items: Array<{ price: string; quantity: number }>
      mode: 'subscription'
      success_url: string
      cancel_url: string
      metadata: Record<string, string>
      allow_promotion_codes: boolean
      billing_address_collection: 'auto'
      subscription_data?: {
        trial_period_days: number
        metadata: Record<string, string>
      }
    } = {
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=success`,
      cancel_url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard?checkout=canceled`,
      metadata: {
        user_id: user.id,
        plan_name: planName,
        price_id: priceId,
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    }

    // Add trial period if specified
    if (trialDays && trialDays > 0) {
      sessionParams.subscription_data = {
        trial_period_days: trialDays,
        metadata: {
          user_id: user.id,
          plan_name: planName,
        },
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!session.url) {
      return { error: 'Failed to create checkout session' }
    }

    return { url: session.url }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return { error: 'Failed to create checkout session' }
  }
}

/**
 * Create a Stripe Customer Portal session
 */
export async function createCustomerPortalSession(): Promise<
  { url: string } | { error: string }
> {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'You must be logged in to manage billing' }
    }

    // Get subscription with Stripe customer ID
    const subscription = await getUserSubscription(supabase, user.id)

    if (!subscription?.stripe_customer_id) {
      return { error: 'No active subscription found' }
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripe_customer_id,
      return_url: `${env.NEXT_PUBLIC_SITE_URL}/dashboard`,
    })

    if (!session.url) {
      return { error: 'Failed to create portal session' }
    }

    return { url: session.url }
  } catch (error) {
    console.error('Error creating portal session:', error)
    return { error: 'Failed to create portal session' }
  }
}

/**
 * Get user subscription (server action)
 */
export async function getSubscription(): Promise<{
  subscription: Subscription | null
  error?: string
}> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { subscription: null, error: 'Not authenticated' }
    }

    const subscription = await getUserSubscription(supabase, user.id)

    return { subscription }
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return { subscription: null, error: 'Failed to fetch subscription' }
  }
}

/**
 * Handle checkout redirect (call this from client)
 */
export async function redirectToCheckout(
  planName: string,
  priceId: string,
  trialDays?: number
) {
  const result = await createCheckoutSession(planName, priceId, trialDays)

  if ('error' in result) {
    throw new Error(result.error)
  }

  redirect(result.url)
}

/**
 * Handle portal redirect (call this from client)
 */
export async function redirectToCustomerPortal() {
  const result = await createCustomerPortalSession()

  if ('error' in result) {
    throw new Error(result.error)
  }

  redirect(result.url)
}

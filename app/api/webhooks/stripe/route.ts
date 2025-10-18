import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { stripe, getStripeWebhookSecret } from '@/lib/stripe/config'
import { createClient } from '@supabase/supabase-js'
import { env } from '@/lib/env'
import type {
  SubscriptionStatus,
  SubscriptionInput,
} from '@/types/subscription'

/**
 * Get Supabase admin client for webhook operations
 * Uses lazy initialization to avoid build-time errors
 * Webhooks need service role to bypass RLS
 */
function getSupabaseAdmin() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY is required for webhook operations'
    )
  }

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

/**
 * Convert Stripe subscription status to our status type
 */
function mapStripeStatus(
  status: Stripe.Subscription.Status
): SubscriptionStatus {
  const statusMap: Record<Stripe.Subscription.Status, SubscriptionStatus> = {
    active: 'active',
    trialing: 'trialing',
    past_due: 'past_due',
    canceled: 'canceled',
    unpaid: 'unpaid',
    incomplete: 'incomplete',
    incomplete_expired: 'incomplete_expired',
    paused: 'paused',
  }
  return statusMap[status] || 'canceled'
}

/**
 * Update subscription in database from Stripe subscription object
 */
async function updateSubscriptionFromStripe(
  subscription: Stripe.Subscription
): Promise<void> {
  const customerId = subscription.customer as string
  const metadata = subscription.metadata

  // Get user_id from metadata or customer metadata
  let userId = metadata.user_id

  if (!userId) {
    const customer = await stripe.customers.retrieve(customerId)
    if (!customer.deleted) {
      userId = customer.metadata.supabase_user_id
    }
  }

  if (!userId) {
    console.error('No user_id found for subscription:', subscription.id)
    return
  }

  const planName = metadata.plan_name || 'Pro'
  const priceId = subscription.items.data[0]?.price.id

  // Type assertion for Stripe subscription properties
  const currentPeriodStart = (
    subscription as unknown as { current_period_start: number }
  ).current_period_start
  const currentPeriodEnd = (
    subscription as unknown as { current_period_end: number }
  ).current_period_end

  const subscriptionData: SubscriptionInput = {
    user_id: userId,
    stripe_customer_id: customerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    status: mapStripeStatus(subscription.status),
    plan_name: planName,
    trial_start: subscription.trial_start
      ? new Date(subscription.trial_start * 1000).toISOString()
      : null,
    trial_end: subscription.trial_end
      ? new Date(subscription.trial_end * 1000).toISOString()
      : null,
    current_period_start: currentPeriodStart
      ? new Date(currentPeriodStart * 1000).toISOString()
      : new Date().toISOString(),
    current_period_end: currentPeriodEnd
      ? new Date(currentPeriodEnd * 1000).toISOString()
      : new Date().toISOString(),
    cancel_at_period_end: subscription.cancel_at_period_end,
    canceled_at: subscription.canceled_at
      ? new Date(subscription.canceled_at * 1000).toISOString()
      : null,
  }

  const { error } = await getSupabaseAdmin()
    .from('subscriptions')
    .upsert(subscriptionData, {
      onConflict: 'user_id',
    })

  if (error) {
    console.error('Error updating subscription:', error)
    throw new Error('Failed to update subscription')
  }
}

/**
 * Handle checkout.session.completed event
 */
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session
): Promise<void> {
  const subscriptionId = session.subscription as string
  const metadata = session.metadata

  if (!subscriptionId) {
    console.log('No subscription in checkout session')
    return
  }

  // Retrieve full subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  // Update subscription with metadata from session
  await stripe.subscriptions.update(subscriptionId, {
    metadata: {
      user_id: metadata?.user_id || '',
      plan_name: metadata?.plan_name || 'Pro',
    },
  })

  // Update database
  await updateSubscriptionFromStripe(subscription)
}

/**
 * Handle subscription updates
 */
async function handleSubscriptionUpdate(
  subscription: Stripe.Subscription
): Promise<void> {
  await updateSubscriptionFromStripe(subscription)
}

/**
 * Handle subscription deletion
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
): Promise<void> {
  // Get user from customer
  const { data: existingSubscription } = await getSupabaseAdmin()
    .from('subscriptions')
    .select('user_id')
    .eq('stripe_customer_id', subscription.customer as string)
    .single()

  if (existingSubscription) {
    // Reset to free plan
    await getSupabaseAdmin()
      .from('subscriptions')
      .update({
        status: 'free',
        plan_name: 'Starter',
        stripe_subscription_id: null,
        stripe_price_id: null,
        trial_start: null,
        trial_end: null,
        current_period_start: null,
        current_period_end: null,
        cancel_at_period_end: false,
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', existingSubscription.user_id)
  }
}

/**
 * POST /api/webhooks/stripe
 * Handle Stripe webhook events
 */
export async function POST(request: Request) {
  const body = await request.text()
  const signature = (await headers()).get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      getStripeWebhookSecret()
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break

      case 'customer.subscription.trial_will_end':
        // Optional: Send notification to user about trial ending
        console.log('Trial will end:', event.data.object.id)
        break

      case 'invoice.payment_succeeded': {
        // Payment succeeded, subscription should be active
        const invoice = event.data.object as { subscription?: string }
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            invoice.subscription
          )
          await handleSubscriptionUpdate(subscription)
        }
        break
      }

      case 'invoice.payment_failed': {
        // Payment failed, subscription may be past_due
        const failedInvoice = event.data.object as { subscription?: string }
        if (failedInvoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(
            failedInvoice.subscription
          )
          await handleSubscriptionUpdate(subscription)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

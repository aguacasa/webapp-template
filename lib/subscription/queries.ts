import type { SupabaseClient } from '@supabase/supabase-js'
import type { Subscription, SubscriptionInput } from '@/types/subscription'

/**
 * Get subscription for a user
 */
export async function getUserSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) {
    console.error('Error fetching subscription:', error)
    return null
  }

  return data as Subscription
}

/**
 * Get subscription by Stripe customer ID
 */
export async function getSubscriptionByCustomerId(
  supabase: SupabaseClient,
  customerId: string
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  if (error) {
    console.error('Error fetching subscription by customer ID:', error)
    return null
  }

  return data as Subscription
}

/**
 * Get subscription by Stripe subscription ID
 */
export async function getSubscriptionByStripeId(
  supabase: SupabaseClient,
  subscriptionId: string
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscriptionId)
    .single()

  if (error) {
    console.error('Error fetching subscription by Stripe ID:', error)
    return null
  }

  return data as Subscription
}

/**
 * Create or update subscription
 */
export async function upsertSubscription(
  supabase: SupabaseClient,
  subscription: SubscriptionInput
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .upsert(
      {
        ...subscription,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'user_id',
      }
    )
    .select()
    .single()

  if (error) {
    console.error('Error upserting subscription:', error)
    return null
  }

  return data as Subscription
}

/**
 * Update subscription by user ID
 */
export async function updateSubscription(
  supabase: SupabaseClient,
  userId: string,
  updates: Partial<Subscription>
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating subscription:', error)
    return null
  }

  return data as Subscription
}

/**
 * Cancel subscription (set cancel_at_period_end flag)
 */
export async function cancelSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      cancel_at_period_end: true,
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error canceling subscription:', error)
    return null
  }

  return data as Subscription
}

/**
 * Reactivate a canceled subscription
 */
export async function reactivateSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<Subscription | null> {
  const { data, error } = await supabase
    .from('subscriptions')
    .update({
      cancel_at_period_end: false,
      canceled_at: null,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error reactivating subscription:', error)
    return null
  }

  return data as Subscription
}

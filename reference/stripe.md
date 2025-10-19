# Stripe Integration - Getting Started Guide

This template comes with a production-ready Stripe integration for handling subscriptions, trials, and payments. Follow this guide to configure Stripe for your application.

## Overview

The Stripe integration includes:

- **Stripe Checkout (Hosted)**: Secure, PCI-compliant payment pages
- **Customer Portal**: Self-service subscription management
- **Webhook Handler**: Automatic sync of subscription status
- **Trial Support**: Flexible trial periods for paid plans
- **Multiple Tiers**: Support for any number of pricing plans (Free, Pro, Enterprise, etc.)
- **Feature Gating**: Control access based on subscription status

## Quick Start

### 1. Create a Stripe Account

1. Go to [stripe.com](https://stripe.com) and create an account
2. Complete the account setup and verification
3. Switch to Test Mode (toggle in the Stripe Dashboard top-right)

### 2. Get Your API Keys

1. Navigate to **Developers** → **API keys** in the Stripe Dashboard
2. Copy your **Publishable key** (starts with `pk_test_`)
3. Click "Reveal test key" and copy your **Secret key** (starts with `sk_test_`)
4. Add these to your `.env.local`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

### 3. Create Your Products and Prices

1. Navigate to **Products** in the Stripe Dashboard
2. Click **+ Add product**
3. For each paid tier (e.g., Pro, Enterprise):
   - Enter product name (e.g., "Pro Plan")
   - Add a description
   - Set the price (e.g., $29/month)
   - Choose **Recurring** billing
   - Set the billing period (monthly, yearly, etc.)
   - Click **Save product**

4. After creating the product, find the **Price ID** (starts with `price_`)
5. Copy each Price ID and add to your pricing configuration

### 4. Configure Price IDs

**Option A: Update the pricing data file** (Recommended)

Edit `lib/data/pricing.ts`:

```typescript
export const pricingPlans: PricingPlan[] = [
  {
    name: 'Starter',
    description: 'Perfect for getting started',
    price: 0,
    features: [...],
    buttonText: 'Get Started',
    // No stripePriceId for free tier
  },
  {
    name: 'Pro',
    description: 'For growing businesses',
    price: 29,
    period: '/month',
    features: [...],
    buttonText: 'Start Free Trial',
    stripePriceId: 'price_1234567890', // ← Your actual Stripe Price ID
    trialDays: 14, // Optional: number of trial days
  },
]
```

**Option B: Use environment variables**

Add Price IDs to `.env.local` as JSON:

```bash
STRIPE_PRICE_IDS={"pro":"price_1234567890","enterprise":"price_0987654321"}
```

Then reference them in your pricing data:

```typescript
import { getStripePriceId } from '@/lib/env'

// In your component or action:
const priceId = getStripePriceId('pro')
```

### 5. Configure Trials (Optional)

To enable trial periods for paid plans:

1. In Stripe Dashboard, go to your Product
2. Scroll to **Pricing** → Click on the price
3. Under **Free trial**, set the default trial period (or leave blank to configure per-checkout)

In your pricing data:

```typescript
{
  name: 'Pro',
  stripePriceId: 'price_xxx',
  trialDays: 14, // 14-day free trial
}
```

### 6. Set Up Webhooks

Webhooks keep your database in sync with Stripe subscription changes.

#### For Local Development:

1. Install Stripe CLI:

   ```bash
   brew install stripe/stripe-cli/stripe
   # or download from https://stripe.com/docs/stripe-cli
   ```

2. Log in to Stripe CLI:

   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:

   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and add to `.env.local`:
   ```bash
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

#### For Production:

1. Navigate to **Developers** → **Webhooks** in Stripe Dashboard
2. Click **+ Add endpoint**
3. Enter your webhook URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `customer.subscription.trial_will_end`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

5. Click **Add endpoint**
6. Copy the **Signing secret** and add to your production environment variables

### 7. Configure Supabase

The webhook handler needs the Supabase service role key to bypass Row Level Security (RLS).

1. Go to your Supabase project dashboard
2. Navigate to **Settings** → **API**
3. Copy the `service_role` key (⚠️ Keep this secret!)
4. Add to `.env.local`:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

### 8. Run Database Migration

Apply the subscriptions table migration:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL in Supabase Dashboard
# SQL file: supabase/migrations/20250117000000_create_subscriptions_table.sql
```

### 9. Test the Integration

1. Start your development server:

   ```bash
   npm run dev
   ```

2. Register a new user account

3. Navigate to the pricing page

4. Click on a paid plan to start checkout

5. Use Stripe test card:
   - Card number: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

6. Complete checkout and verify:
   - You're redirected to the dashboard
   - Subscription status shows "Free Trial" or "Active"
   - Check your Supabase `subscriptions` table for the record

## Customization

### Adding More Pricing Tiers

1. Create a new Product in Stripe Dashboard
2. Get the Price ID
3. Add to `lib/data/pricing.ts`:

```typescript
{
  name: 'Basic',
  description: 'For individuals',
  price: 9,
  period: '/month',
  features: ['Feature 1', 'Feature 2'],
  buttonText: 'Subscribe',
  stripePriceId: 'price_basic_id',
  trialDays: 7,
}
```

### Customizing Features by Plan

Edit `lib/subscription/status.ts`:

```typescript
const FEATURE_ACCESS: Record<
  string,
  { features: string[]; limits?: Record<string, number | 'unlimited'> }
> = {
  starter: {
    features: ['basic_analytics'],
    limits: { projects: 3 },
  },
  pro: {
    features: ['basic_analytics', 'advanced_analytics', 'priority_support'],
    limits: { projects: 'unlimited' },
  },
  enterprise: {
    features: [
      'basic_analytics',
      'advanced_analytics',
      'priority_support',
      'dedicated_support',
    ],
    limits: { projects: 'unlimited', storage_gb: 'unlimited' },
  },
}
```

### Using Feature Gates

Conditionally render content based on subscription:

```typescript
import { FeatureGate } from '@/components/billing/feature-gate'

<FeatureGate
  subscription={subscription}
  feature="advanced_analytics"
  fallback={<UpgradePrompt />}
>
  <AdvancedAnalyticsDashboard />
</FeatureGate>
```

Or check programmatically:

```typescript
import { hasFeatureAccess } from '@/lib/subscription/status'

if (hasFeatureAccess(subscription, 'advanced_analytics')) {
  // Show advanced features
}
```

## Going to Production

### 1. Switch to Live Mode

1. In Stripe Dashboard, toggle from Test Mode to Live Mode
2. Create your products and prices again in Live Mode
3. Get new Live API keys (start with `pk_live_` and `sk_live_`)

### 2. Update Environment Variables

Update your production environment with live keys:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_live_your_webhook_secret
STRIPE_PRICE_IDS={"pro":"price_live_xxx","enterprise":"price_live_xxx"}
```

### 3. Configure Customer Portal

1. Navigate to **Settings** → **Billing** → **Customer portal** in Stripe Dashboard
2. Customize branding, features, and business information
3. Enable/disable features:
   - Update payment method
   - Cancel subscription
   - Update billing information
   - View invoice history

### 4. Set Up Email Notifications

Configure Stripe to send emails for:

- Payment receipts
- Failed payments
- Upcoming renewals
- Trial ending soon

Go to **Settings** → **Emails** in Stripe Dashboard

## Troubleshooting

### Webhooks Not Working

- Verify webhook secret is correct in `.env.local`
- Check webhook endpoint URL is accessible
- Review webhook logs in Stripe Dashboard → **Developers** → **Webhooks**
- Ensure Supabase service role key is set

### Subscription Not Updating in Database

- Check Supabase RLS policies allow service role access
- Verify the migration was applied correctly
- Check server logs for webhook errors
- Ensure metadata (user_id, plan_name) is set in Stripe checkout

### Trial Not Starting

- Verify `trialDays` is set in pricing configuration
- Check Stripe Product has trial settings configured
- Review checkout session creation in server logs

### Price ID Not Found

- Ensure Price ID matches exactly (case-sensitive)
- Verify Price ID is from the correct Stripe mode (test vs live)
- Check `STRIPE_PRICE_IDS` JSON is valid

## Architecture Overview

```
User clicks "Subscribe"
  ↓
SubscribeButton component
  ↓
redirectToCheckout() server action
  ↓
Stripe Checkout Session created
  ↓
User redirected to Stripe Checkout
  ↓
User enters payment info
  ↓
Stripe processes payment
  ↓
Stripe sends webhook to /api/webhooks/stripe
  ↓
Webhook handler updates Supabase subscriptions table
  ↓
User redirected back to dashboard
  ↓
Dashboard shows updated subscription status
```

## Files Reference

- **Types**: `types/subscription.ts`
- **Environment Config**: `lib/env.ts`
- **Stripe Client Config**: `lib/stripe/config.ts`, `lib/stripe/client.ts`
- **Database Queries**: `lib/subscription/queries.ts`
- **Subscription Logic**: `lib/subscription/status.ts`
- **Server Actions**: `app/actions/stripe.ts`
- **Webhook Handler**: `app/api/webhooks/stripe/route.ts`
- **UI Components**: `components/billing/*`
- **Database Migration**: `supabase/migrations/20250117000000_create_subscriptions_table.sql`

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Checkout Guide](https://stripe.com/docs/payments/checkout)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe Customer Portal](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal)

## Support

For issues specific to this template's Stripe integration, please check:

1. Server logs for detailed error messages
2. Stripe Dashboard → Developers → Logs
3. Stripe Dashboard → Developers → Webhooks (for webhook delivery status)
4. Supabase Dashboard → Database → Subscriptions table

For general Stripe questions, refer to [Stripe's documentation](https://stripe.com/docs) or [support](https://support.stripe.com/).

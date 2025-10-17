# Next.js Web Application Template

A modern, production-ready starter template for building web applications with Next.js 15, TypeScript, Supabase, Stripe, and shadcn/ui.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Database & Auth:** Supabase
- **Payments:** Stripe (built-in integration)
- **UI Components:** shadcn/ui
- **Styling:** Tailwind CSS
- **Form Handling:** React Hook Form + Zod
- **Code Quality:** ESLint & Prettier
- **Deployment:** Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Supabase account and project

### Installation

1. Clone or download this template:

```bash
git clone <your-repo-url> my-app
cd my-app
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Features

### Authentication

- Email/password authentication with Supabase
- Protected routes and middleware
- Login and registration forms with validation
- User session management

### UI Components

- Pre-configured shadcn/ui components
- Responsive design with Tailwind CSS
- Dark mode support
- Accessible and customizable components

### Form Handling

- Type-safe forms with React Hook Form
- Zod schema validation
- Error handling and user feedback
- Sample login and registration forms

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting
- Pre-configured rules and settings

### Payments & Subscriptions

- **Stripe integration built-in** with Hosted Checkout
- Customer Portal for self-service subscription management
- Webhook handler for real-time subscription sync
- Support for free tier, paid plans, and trial periods
- Flexible pricing structure (any number of tiers)
- Feature gating based on subscription status
- Subscription status tracking in Supabase

**💳 For Stripe setup instructions, see [Getting Started: Stripe Integration](reference/stripe-getting-started.md)**

### SEO Optimization

- Comprehensive metadata system with Open Graph and Twitter Cards
- Structured data (JSON-LD) for better search visibility
- Dynamic XML sitemap generation
- Robots.txt configuration
- PWA manifest for mobile optimization
- Performance optimizations (image optimization, compression, caching)
- Security headers configured

**📖 For detailed SEO configuration instructions, see [Getting Started: SEO Configuration](reference/GETTING-STARTED-SEO.md)**

## Project Structure

```
webapp-template/
├── app/                     # Next.js app directory
│   ├── (auth)/             # Authentication routes
│   │   ├── login/
│   │   └── register/
│   ├── (protected)/        # Protected routes
│   │   └── dashboard/
│   ├── actions/            # Server actions
│   │   └── stripe.ts      # Stripe checkout & portal
│   ├── api/                # API routes
│   │   └── webhooks/      # Webhook handlers
│   │       └── stripe/    # Stripe webhook endpoint
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   ├── sitemap.ts          # Dynamic XML sitemap
│   ├── robots.ts           # Robots.txt configuration
│   └── manifest.ts         # PWA manifest
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── auth/               # Authentication components
│   ├── billing/            # Stripe/subscription components
│   ├── forms/              # Form components
│   └── landing/            # Landing page sections
├── lib/                    # Utility functions
│   ├── supabase/          # Supabase client setup
│   ├── stripe/            # Stripe configuration
│   │   ├── config.ts     # Server-side Stripe client
│   │   └── client.ts     # Client-side Stripe.js
│   ├── subscription/      # Subscription utilities
│   │   ├── status.ts     # Feature gating & status helpers
│   │   └── queries.ts    # Database operations
│   ├── seo/               # SEO utilities
│   │   ├── metadata.ts   # Metadata generator
│   │   └── schema.tsx    # Structured data helpers
│   ├── data/              # Static data & configs
│   │   └── pricing.ts    # Pricing plans configuration
│   ├── validations/       # Zod schemas
│   └── utils.ts           # Helper functions
├── reference/              # Reference documentation
│   ├── stripe-getting-started.md  # Stripe setup guide
│   └── GETTING-STARTED-SEO.md     # SEO configuration guide
├── supabase/              # Supabase migrations
│   └── migrations/        # SQL migration files
├── types/                  # TypeScript types
│   └── subscription.ts    # Subscription type definitions
└── middleware.ts          # Next.js middleware
```

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript compiler check
```

## Supabase Setup

### Database Schema

The template includes migrations for the following tables:

1. **Profiles Table** - User profile information
2. **Subscriptions Table** - Stripe subscription tracking (included in `supabase/migrations/`)

To apply migrations, run the SQL files in your Supabase dashboard or use the Supabase CLI.

#### Profiles Table

Create a `profiles` table in your Supabase project:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  PRIMARY KEY (id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Create a trigger to create a profile on signup
CREATE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
```

#### Subscriptions Table

Run the migration file `supabase/migrations/20250117000000_create_subscriptions_table.sql` in your Supabase dashboard, or use the Supabase CLI:

```bash
supabase db push
```

This creates the `subscriptions` table with:

- Subscription status tracking
- Stripe customer and subscription IDs
- Trial period management
- RLS policies for security
- Automatic subscription creation for new users

### Authentication Setup

1. Enable Email Authentication in your Supabase dashboard
2. Configure email templates (optional)
3. Set up redirect URLs for your production domain

## Deployment

### Pre-Deployment Checklist

Before deploying, complete these configurations:

1. **Configure Stripe** (if using payments) - See [Getting Started: Stripe Integration](reference/stripe-getting-started.md)
   - Switch to Stripe Live mode
   - Get production API keys
   - Create products and prices
   - Set up webhook endpoint
2. **Configure SEO settings** - See [Getting Started: SEO Configuration](reference/GETTING-STARTED-SEO.md)
3. **Update environment variables** - Add production URLs, API keys, and verification codes
4. **Create required assets** - Favicon, app icons, and OG images
5. **Run database migrations** - Apply Supabase migrations to production database

### Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables (see below)
4. Deploy

### Environment Variables

For production, ensure you set:

**Required:**

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for webhooks)
- `NEXT_PUBLIC_SITE_URL`: Your production domain (e.g., https://yourdomain.com)

**Stripe (if using payments):**

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key (pk*live*...)
- `STRIPE_SECRET_KEY`: Stripe secret key (sk*live*...)
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret (whsec\_...)
- `STRIPE_PRICE_IDS`: JSON object with your price IDs (e.g., `{"pro":"price_xxx"}`)

**Optional:**

- `NEXT_PUBLIC_GOOGLE_VERIFICATION`: Google Search Console verification code
- `NEXT_PUBLIC_YANDEX_VERIFICATION`: Yandex verification code

## Customization

### Adding New Components

Install additional shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

### Styling

- Modify `tailwind.config.ts` for custom theme configuration
- Edit `app/globals.css` for global styles
- Update CSS variables for theming

### Forms

Create new form schemas in `lib/validations/`:

- Define Zod schemas for validation
- Export TypeScript types
- Use in components with React Hook Form

## Security Best Practices

- Never commit `.env.local` file
- Use Row Level Security (RLS) in Supabase
- Validate all user inputs
- Implement proper error handling
- Keep dependencies updated

## License

MIT

## Support

For issues and questions, please refer to the documentation of the individual technologies used in this template:

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

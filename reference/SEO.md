# Getting Started: SEO Configuration

This guide will walk you through configuring your new app's SEO settings. The template is designed with **centralized configuration** - you only need to update 3-4 key files, and everything else updates automatically.

---

## Quick Start: 3-Step Configuration

### Step 1: Update Main SEO Config

**File:** `lib/seo/metadata.ts` (lines 16-24)

This is your **primary configuration file**. Update the `siteConfig` object with your app details:

```typescript
const siteConfig = {
  name: 'Your App Name', // Your brand/product name
  description: 'Your app description', // 150-160 character description
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  ogImage: '/og-image.png', // Path to your OG image
  twitterHandle: '@yourhandle', // Your Twitter handle
  locale: 'en_US', // Your primary locale
}
```

**What this controls:**

- ✅ All page titles (uses name as suffix)
- ✅ All meta descriptions
- ✅ Open Graph tags
- ✅ Twitter cards
- ✅ Structured data schemas
- ✅ Sitemap URLs
- ✅ Canonical URLs

---

### Step 2: Create Environment Variables

**File:** `.env.local` (create from `.env.local.example`)

```bash
# Supabase (existing)
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# SEO Configuration (add these)
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_YANDEX_VERIFICATION=your-yandex-verification-code
```

**Important:**

- `NEXT_PUBLIC_SITE_URL` should be your **production domain**
- Verification codes are optional (get them from Search Console after deployment)
- During development, this can be `http://localhost:3000`

---

### Step 3: Update Organization Details

**File:** `app/layout.tsx` (lines 45-56)

Add your social media profiles and contact information:

```typescript
const organizationSchema = generateOrganizationSchema({
  sameAs: [
    'https://twitter.com/yourhandle',
    'https://linkedin.com/company/yourcompany',
    'https://github.com/yourorg',
    // Add more social profiles as needed
  ],
  contactPoint: {
    email: 'support@yourdomain.com',
    contactType: 'Customer Support',
  },
})
```

This creates structured data that helps search engines understand your organization.

---

### Step 4 (Optional): Update PWA Manifest

**File:** `app/manifest.ts` (lines 4-6)

Update your Progressive Web App settings for mobile:

```typescript
return {
  name: 'Your Full App Name',
  short_name: 'YourApp', // Max 12 characters
  description: 'Your app description',
  // ... rest stays the same
}
```

---

## What Updates Automatically

Once you've updated the configuration files above, the following are **automatically handled**:

| Feature           | Source                     | No Action Needed                  |
| ----------------- | -------------------------- | --------------------------------- |
| Page titles       | `siteConfig.name`          | ✅ Auto-appended to all pages     |
| Open Graph images | `siteConfig.ogImage`       | ✅ Used across all pages          |
| Twitter cards     | `siteConfig.twitterHandle` | ✅ All pages                      |
| Sitemap URLs      | `siteConfig.url`           | ✅ Generated automatically        |
| Robots.txt        | `siteConfig.url`           | ✅ References sitemap             |
| Canonical URLs    | `siteConfig.url`           | ✅ All pages                      |
| Structured data   | `siteConfig.*`             | ✅ Organization & WebSite schemas |

---

## Required Assets

Before deploying, create these image files in the `public/` directory:

### 1. Favicon & App Icons

- **`/public/favicon.ico`** - Standard favicon (32×32px or 16×16px)
- **`/public/icon-192.png`** - PWA icon (192×192px)
- **`/public/icon-512.png`** - PWA icon (512×512px)

### 2. SEO Images

- **`/public/og-image.png`** - Open Graph image (1200×630px)
- **`/public/logo.png`** - Company logo for schema markup

**Tools to create icons:**

- [Favicon Generator](https://realfavicongenerator.net/)
- [Figma](https://figma.com) - For custom designs
- [Canva](https://canva.com) - Quick templates

---

## Page-Specific Customization (Optional)

You can override SEO settings for individual pages using the `generateMetadata` helper:

**Example:** Custom metadata for a specific page

```typescript
// app/features/page.tsx
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Features',
  description: 'Explore our powerful features that help you build faster.',
  keywords: ['feature1', 'feature2', 'feature3'],
  image: '/features-og-image.png', // Custom OG image for this page
})

export default function FeaturesPage() {
  // Your page content
}
```

**Available options:**

- `title` - Page title (automatically appended with site name)
- `description` - Meta description
- `keywords` - Array of keywords
- `image` - Custom OG image path
- `noIndex` - Set to `true` to prevent indexing (for auth pages, etc.)
- `canonical` - Custom canonical URL
- `type` - 'website' or 'article'
- `publishedTime` - For blog posts (ISO 8601 format)
- `modifiedTime` - For blog posts
- `authors` - Array of author names

---

## Testing Your Configuration

### Local Testing

```bash
npm run dev
```

Visit these URLs to verify:

- **Sitemap:** http://localhost:3000/sitemap.xml
- **Robots:** http://localhost:3000/robots.txt
- **Manifest:** http://localhost:3000/manifest.json

### Production Testing Tools

After deployment, test with these tools:

1. **Meta Tags & Open Graph:**
   - [OpenGraph.xyz](https://www.opengraph.xyz/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

2. **Structured Data:**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [Schema Markup Validator](https://validator.schema.org/)

3. **Performance:**
   - [PageSpeed Insights](https://pagespeed.web.dev/)
   - Chrome DevTools Lighthouse

4. **Mobile:**
   - [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

---

## Deployment Checklist

Before going live, ensure:

- [ ] Updated `NEXT_PUBLIC_SITE_URL` with production domain
- [ ] Updated site name in `lib/seo/metadata.ts`
- [ ] Updated description in `lib/seo/metadata.ts`
- [ ] Created and uploaded all required images (favicon, icons, OG image)
- [ ] Updated social profiles in `app/layout.tsx`
- [ ] Updated contact email in `app/layout.tsx`
- [ ] Updated PWA manifest with app name
- [ ] Tested sitemap.xml loads correctly
- [ ] Tested robots.txt loads correctly
- [ ] Verified meta tags with OpenGraph.xyz
- [ ] Checked Core Web Vitals with PageSpeed Insights

---

## Post-Deployment: Search Console Setup

### Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property (enter your domain)
3. Verify ownership:
   - The template already includes meta tag verification support
   - Add `NEXT_PUBLIC_GOOGLE_VERIFICATION` to `.env.local`
4. Submit your sitemap: `https://yourdomain.com/sitemap.xml`

### Monitoring

Track these metrics weekly:

- **Index Coverage** - Are your pages being indexed?
- **Performance** - Which keywords drive traffic?
- **Core Web Vitals** - LCP, FID, CLS scores
- **Mobile Usability** - Any mobile issues?

---

## Common Customizations

### Adding Pages to Sitemap

Edit `app/sitemap.ts` to add new static routes:

```typescript
const staticRoutes = [
  {
    url: `${baseUrl}`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1,
  },
  {
    url: `${baseUrl}/features`, // Add new route
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
]
```

### Blocking Pages from Search Engines

Edit `app/robots.ts` to block specific paths:

```typescript
disallow: [
  '/dashboard',
  '/api',
  '/admin',       // Add paths to block
  '/private',
],
```

Or block individual pages with `noIndex`:

```typescript
export const metadata: Metadata = generateMetadata({
  title: 'Private Page',
  noIndex: true, // Won't be indexed by search engines
})
```

---

## Need More Help?

- **Full SEO Documentation:** See `docs/SEO-SETUP.md`
- **Next.js Metadata Docs:** [nextjs.org/docs/app/building-your-application/optimizing/metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- **Schema.org Reference:** [schema.org](https://schema.org/)

---

## Summary

**You only need to update 3-4 files:**

1. ✅ `lib/seo/metadata.ts` - Main config (name, description, URL, etc.)
2. ✅ `.env.local` - Environment variables (domain URL)
3. ✅ `app/layout.tsx` - Organization details (social profiles, contact)
4. ✅ `app/manifest.ts` - PWA app name (optional)

Everything else inherits automatically. Deploy with confidence! 🚀

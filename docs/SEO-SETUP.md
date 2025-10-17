# SEO Setup Guide

This guide covers the SEO features implemented in this template and how to configure them for your application.

## Overview

The template includes comprehensive SEO optimizations:

- ✅ **Metadata System** - Centralized metadata generation with Open Graph and Twitter Cards
- ✅ **Structured Data** - JSON-LD schema markup for better search visibility
- ✅ **XML Sitemap** - Automatically generated sitemap for search engines
- ✅ **Robots.txt** - Crawl directive configuration
- ✅ **PWA Manifest** - Mobile optimization with app manifest
- ✅ **Performance Optimization** - Image optimization, compression, and caching headers
- ✅ **Security Headers** - CSP, X-Frame-Options, and other security headers

## Configuration

### 1. Environment Variables

Update your `.env.local` file with the following SEO-related variables:

```bash
# SEO Configuration
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_GOOGLE_VERIFICATION=your-google-verification-code
NEXT_PUBLIC_YANDEX_VERIFICATION=your-yandex-verification-code
```

### 2. Site Configuration

Update the site configuration in `lib/seo/metadata.ts`:

```typescript
const siteConfig = {
  name: 'Your App Name',
  description: 'Your app description',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  ogImage: '/og-image.png',
  twitterHandle: '@yourhandle',
  locale: 'en_US',
}
```

### 3. Organization Schema

Update organization details in `app/layout.tsx`:

```typescript
const organizationSchema = generateOrganizationSchema({
  sameAs: [
    'https://twitter.com/yourhandle',
    'https://linkedin.com/company/yourcompany',
    'https://github.com/yourorg',
  ],
  contactPoint: {
    email: 'support@yourdomain.com',
    contactType: 'Customer Support',
  },
})
```

## Usage

### Adding Metadata to Pages

Use the `generateMetadata` helper to add SEO metadata to any page:

```typescript
import { Metadata } from 'next'
import { generateMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Page Title',
  description: 'Page description for SEO',
  keywords: ['keyword1', 'keyword2', 'keyword3'],
  image: '/custom-og-image.png', // Optional custom OG image
})
```

### Adding Structured Data

Use the structured data helpers to add JSON-LD schema markup:

```typescript
import { generateArticleSchema, StructuredData } from '@/lib/seo/schema'

export default function BlogPost() {
  const articleSchema = generateArticleSchema({
    headline: 'Article Title',
    description: 'Article description',
    image: 'https://yourdomain.com/article-image.jpg',
    datePublished: '2025-01-15',
    authorName: 'John Doe',
  })

  return (
    <>
      <StructuredData data={articleSchema} />
      {/* Your page content */}
    </>
  )
}
```

### Available Schema Types

- `generateOrganizationSchema()` - Company/Organization info
- `generateWebSiteSchema()` - Website info with search
- `generateSoftwareApplicationSchema()` - App/Product pages
- `generateBreadcrumbSchema()` - Navigation breadcrumbs
- `generateFAQSchema()` - FAQ pages
- `generateArticleSchema()` - Blog posts/articles

## Required Assets

### Icons and Images

Create the following files in the `public` directory:

1. **Favicon and Icons:**
   - `/icon-192.png` (192x192px)
   - `/icon-512.png` (512x512px)
   - `/favicon.ico`

2. **Open Graph Images:**
   - `/og-image.png` (1200x630px) - Default OG image
   - `/logo.png` - Company logo for schema markup

### Creating Icon Files

You can use tools like:

- [Favicon Generator](https://realfavicongenerator.net/)
- [Figma](https://figma.com) for custom designs
- [Canva](https://canva.com) for quick templates

## Sitemap Configuration

The sitemap is automatically generated at `/sitemap.xml`. Update `app/sitemap.ts` to add more routes:

```typescript
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/features`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Add more routes...
  ]
}
```

### Dynamic Routes

For dynamic content (blog posts, etc.), fetch data and generate routes:

```typescript
// Example for blog posts
const posts = await fetchBlogPosts()
const blogRoutes = posts.map((post) => ({
  url: `${baseUrl}/blog/${post.slug}`,
  lastModified: post.updatedAt,
  changeFrequency: 'weekly',
  priority: 0.7,
}))

return [...staticRoutes, ...blogRoutes]
```

## Robots.txt Configuration

The robots.txt is generated at `/robots.txt`. Update `app/robots.ts` to modify crawl rules:

```typescript
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard', // Private pages
          '/api', // API routes
          '/_next', // Next.js internals
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
```

## Performance Optimization

### Image Optimization

Always use Next.js `Image` component for optimal performance:

```typescript
import Image from 'next/image'

<Image
  src="/hero-image.jpg"
  alt="Descriptive alt text"
  width={1200}
  height={630}
  priority // Add to LCP images
  placeholder="blur" // Optional blur placeholder
/>
```

### Core Web Vitals

The template is configured with:

- ✅ Image optimization (WebP/AVIF)
- ✅ Font optimization (`next/font`)
- ✅ Code splitting
- ✅ Compression enabled
- ✅ Cache headers for static assets

Monitor Core Web Vitals at:

- [PageSpeed Insights](https://pagespeed.web.dev/)
- [Google Search Console](https://search.google.com/search-console)

## Search Console Setup

### Google Search Console

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add your property
3. Verify ownership using the meta tag (already configured in metadata)
4. Submit your sitemap: `https://yourdomain.com/sitemap.xml`

### Bing Webmaster Tools

1. Go to [Bing Webmaster Tools](https://www.bing.com/webmasters)
2. Add your site
3. Verify and submit sitemap

## Testing Your SEO

### Tools to Test SEO Implementation

1. **Meta Tags:**
   - [OpenGraph.xyz](https://www.opengraph.xyz/)
   - [Twitter Card Validator](https://cards-dev.twitter.com/validator)

2. **Structured Data:**
   - [Google Rich Results Test](https://search.google.com/test/rich-results)
   - [Schema Markup Validator](https://validator.schema.org/)

3. **Performance:**
   - [PageSpeed Insights](https://pagespeed.web.dev/)
   - [Lighthouse](https://developers.google.com/web/tools/lighthouse) (built into Chrome DevTools)

4. **Mobile Optimization:**
   - [Mobile-Friendly Test](https://search.google.com/test/mobile-friendly)

### Local Testing

Test your sitemap and robots.txt locally:

```bash
# Start dev server
npm run dev

# Visit:
# http://localhost:3000/sitemap.xml
# http://localhost:3000/robots.txt
```

## Next Steps for Production

### Before Launch Checklist

- [ ] Update `NEXT_PUBLIC_SITE_URL` in environment variables
- [ ] Update site name and description in `lib/seo/metadata.ts`
- [ ] Create and add OG image (`/og-image.png`)
- [ ] Create and add favicon and icons
- [ ] Update organization schema with real social profiles
- [ ] Add Google Search Console verification code
- [ ] Test all meta tags with validation tools
- [ ] Verify structured data with Rich Results Test
- [ ] Check Core Web Vitals with PageSpeed Insights
- [ ] Submit sitemap to Google Search Console
- [ ] Set up Google Analytics (if needed)

### Post-Launch

1. Monitor Google Search Console for:
   - Index coverage
   - Performance metrics
   - Mobile usability issues
   - Structured data errors

2. Track Core Web Vitals:
   - LCP (Largest Contentful Paint) < 2.5s
   - FID (First Input Delay) < 100ms
   - CLS (Cumulative Layout Shift) < 0.1

3. Regularly update sitemap with new content

## Future Enhancements

Consider adding:

- **Blog system** with article schema
- **Dynamic OG image generation** using `@vercel/og`
- **Breadcrumbs component** with structured data
- **International SEO** (hreflang tags)
- **Analytics integration** (GA4, Plausible, etc.)
- **Content Hub** (guides, case studies, help docs)

## Resources

- [Next.js Metadata Docs](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Web.dev SEO Guide](https://web.dev/learn/seo/)

import type { Metadata } from 'next'

export interface SEOConfig {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  noIndex?: boolean
  canonical?: string
  type?: 'website' | 'article'
  publishedTime?: string
  modifiedTime?: string
  authors?: string[]
}

const siteConfig = {
  name: 'Next.js Starter Template',
  description:
    'A modern web application built with Next.js, TypeScript, and Supabase',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
  ogImage: '/og-image.png',
  twitterHandle: '@yourhandle',
  locale: 'en_US',
}

export function generateMetadata(config: SEOConfig = {}): Metadata {
  const {
    title,
    description = siteConfig.description,
    keywords = [],
    image = siteConfig.ogImage,
    noIndex = false,
    canonical,
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
  } = config

  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name

  const imageUrl = image.startsWith('http')
    ? image
    : `${siteConfig.url}${image}`

  const canonicalUrl = canonical || siteConfig.url

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: authors?.map((name) => ({ name })),
    creator: siteConfig.name,
    publisher: siteConfig.name,
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale: siteConfig.locale,
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      ...(type === 'article' && publishedTime
        ? {
            publishedTime,
            modifiedTime,
            authors,
          }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
    },
  }

  return metadata
}

export { siteConfig }

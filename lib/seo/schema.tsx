import { siteConfig } from './metadata'

export interface OrganizationSchema {
  name?: string
  description?: string
  logo?: string
  url?: string
  sameAs?: string[]
  contactPoint?: {
    telephone?: string
    email?: string
    contactType?: string
  }
}

export interface WebSiteSchema {
  name?: string
  description?: string
  url?: string
}

export interface SoftwareApplicationSchema {
  name: string
  description: string
  applicationCategory: string
  operatingSystem?: string
  offers?: {
    price: string
    priceCurrency: string
  }
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
  }
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export interface FAQItem {
  question: string
  answer: string
}

export function generateOrganizationSchema(
  config: OrganizationSchema = {}
): object {
  const {
    name = siteConfig.name,
    description = siteConfig.description,
    logo = `${siteConfig.url}/logo.png`,
    url = siteConfig.url,
    sameAs = [],
    contactPoint,
  } = config

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    description,
    url,
    logo: {
      '@type': 'ImageObject',
      url: logo,
    },
    ...(sameAs.length > 0 ? { sameAs } : {}),
    ...(contactPoint
      ? {
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: contactPoint.telephone,
            email: contactPoint.email,
            contactType: contactPoint.contactType || 'Customer Service',
          },
        }
      : {}),
  }
}

export function generateWebSiteSchema(config: WebSiteSchema = {}): object {
  const {
    name = siteConfig.name,
    description = siteConfig.description,
    url = siteConfig.url,
  } = config

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    description,
    url,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function generateSoftwareApplicationSchema(
  config: SoftwareApplicationSchema
): object {
  const {
    name,
    description,
    applicationCategory,
    operatingSystem = 'Any',
    offers,
    aggregateRating,
  } = config

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name,
    description,
    applicationCategory,
    operatingSystem,
    ...(offers
      ? {
          offers: {
            '@type': 'Offer',
            price: offers.price,
            priceCurrency: offers.priceCurrency,
          },
        }
      : {}),
    ...(aggregateRating
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: aggregateRating.ratingValue,
            reviewCount: aggregateRating.reviewCount,
          },
        }
      : {}),
  }
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function generateFAQSchema(faqs: FAQItem[]): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

export function generateArticleSchema(config: {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  authorName: string
  publisherName?: string
  publisherLogo?: string
}): object {
  const {
    headline,
    description,
    image,
    datePublished,
    dateModified,
    authorName,
    publisherName = siteConfig.name,
    publisherLogo = `${siteConfig.url}/logo.png`,
  } = config

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: publisherName,
      logo: {
        '@type': 'ImageObject',
        url: publisherLogo,
      },
    },
  }
}

export function StructuredData({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

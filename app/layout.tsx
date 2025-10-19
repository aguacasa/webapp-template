import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { generateMetadata as generateSEOMetadata } from '@/lib/seo/metadata'
import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  StructuredData,
} from '@/lib/seo/schema'
import { ThemeProvider } from '@/components/theme-provider'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = generateSEOMetadata({
  title: undefined, // Will use default site name
  keywords: [
    'Next.js',
    'React',
    'TypeScript',
    'Supabase',
    'SaaS',
    'Web Application',
    'Starter Template',
  ],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = generateOrganizationSchema({
    sameAs: [
      // Add your social media profiles here
      // 'https://twitter.com/yourhandle',
      // 'https://linkedin.com/company/yourcompany',
      // 'https://github.com/yourorg',
    ],
    contactPoint: {
      email: 'support@yourdomain.com',
      contactType: 'Customer Support',
    },
  })

  const websiteSchema = generateWebSiteSchema()

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <StructuredData data={organizationSchema} />
        <StructuredData data={websiteSchema} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 'system';
                const root = document.documentElement;

                if (theme === 'system') {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  root.classList.add(systemTheme);
                } else {
                  root.classList.add(theme);
                }
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="system">
          <div className="min-h-screen bg-background">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  )
}

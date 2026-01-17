import type { Metadata } from 'next'
import Script from 'next/script'
import { Inter, Poppins, JetBrains_Mono, Caveat } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const caveat = Caveat({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-signature',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://openrank.io'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'OpenRank - Find Your First Contribution',
    template: '%s | OpenRank'
  },
  description: 'Discover high-impact open source projects tailored to your skills. Find open source projects, open source project finder, and contribute to the best open source repositories. No login, no friction, just pure coding.',
  keywords: [
    'open source project',
    'open source project finder',
    'open source',
    'open source projects',
    'open source finder',
    'find open source projects',
    'open source contribution',
    'github projects',
    'open source repositories',
    'best open source projects',
    'open source software',
    'contribute to open source',
    'open source community',
    'open source code',
    'open source developer',
    'open source platform',
    'discover open source',
    'open source search',
    'open source directory',
    'open source hub'
  ],
  authors: [{ name: 'OpenRank Team' }],
  creator: 'OpenRank',
  publisher: 'OpenRank',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteUrl,
    siteName: 'OpenRank',
    title: 'OpenRank - Find Your First Contribution',
    description: 'Discover high-impact open source projects tailored to your skills. Find open source projects, open source project finder, and contribute to the best open source repositories.',
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'OpenRank - Open Source Project Finder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenRank - Find Your First Contribution',
    description: 'Discover high-impact open source projects tailored to your skills. Find your next open source contribution.',
    images: [`${siteUrl}/og-image.png`],
    creator: '@openrank',
  },
  robots: {
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
    canonical: siteUrl,
  },
  category: 'Technology',
  classification: 'Open Source Project Finder',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.webp', type: 'image/webp' },
      { url: '/icon.webp', type: 'image/webp', sizes: '32x32' },
      { url: '/icon.webp', type: 'image/webp', sizes: '16x16' },
    ],
    apple: [
      { url: '/icon.webp', type: 'image/webp' },
    ],
    shortcut: '/icon.webp',
  },
  other: {
    'application-name': 'OpenRank',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'OpenRank',
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://openrank.io'
  
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'OpenRank',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    description: 'Discover high-impact open source projects tailored to your skills. Find open source projects, open source project finder, and contribute to the best open source repositories.',
    url: siteUrl,
    author: {
      '@type': 'Organization',
      name: 'OpenRank',
    },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '189',
    },
    featureList: [
      'Open Source Project Finder',
      'Advanced Search & Filters',
      'Project Discovery',
      'Real-time Stats',
      'No Login Required',
    ],
  }

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'OpenRank',
    url: siteUrl,
    logo: `${siteUrl}/logo.png`,
    description: 'Open Source Project Finder - Discover high-impact open source projects',
    sameAs: [
      'https://github.com/openrank',
      'https://twitter.com/openrank',
    ],
  }

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OpenRank',
    url: siteUrl,
    description: 'Open Source Project Finder - Discover high-impact open source projects',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${poppins.variable} ${jetbrainsMono.variable} ${caveat.variable} ${inter.className}`}>
        <Script
          id="structured-data-webapp"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <Script
          id="structured-data-organization"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
        />
        <Script
          id="structured-data-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
        />
        <ThemeProvider>
          {children}
          <Toaster 
            position="top-right"
            richColors
            closeButton
            duration={4000}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}


export function StructuredData() {
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  )
}


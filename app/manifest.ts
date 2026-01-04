import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://openrank.io'
  
  return {
    name: 'OpenRank - Open Source Project Finder',
    short_name: 'OpenRank',
    description: 'Discover high-impact open source projects tailored to your skills. Find open source projects and contribute to the best open source repositories.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
    categories: ['developer', 'productivity', 'utilities'],
    lang: 'en-US',
    dir: 'ltr',
  }
}


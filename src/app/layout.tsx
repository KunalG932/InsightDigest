import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './Navbar'
import InstallButton from '@/components/InstallButton'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' }
  ],
  colorScheme: 'dark'
}

export const metadata: Metadata = {
  title: {
    default: 'InsightDigest | AI-Powered News Platform',
    template: '%s | InsightDigest'
  },
  description: 'Stay informed with AI-powered news summaries and comprehensive coverage of global events. Get the insights that matter, when they matter.',
  keywords: ['news', 'AI summaries', 'global news', 'current events', 'breaking news', 'technology', 'politics', 'sports'],
  authors: [{ name: 'InsightDigest Team', url: 'https://github.com/KunalG932' }],
  creator: 'InsightDigest Team',
  publisher: 'InsightDigest',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://insightdigest.vercel.app'),
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'InsightDigest',
    startupImage: [
      {
        url: '/icon-192x192.png',
        media: '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://insightdigest.vercel.app',
    title: 'InsightDigest - AI-Powered News Platform',
    description: 'Stay informed with AI-powered news summaries and comprehensive coverage of global events.',
    siteName: 'InsightDigest',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'InsightDigest - AI-Powered News Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InsightDigest - AI-Powered News Platform',
    description: 'Stay informed with AI-powered news summaries and comprehensive coverage of global events.',
    images: ['/og-image.png'],
    creator: '@insightdigest',
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
  icons: {
    icon: [
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#0f172a',
      },
    ],
  },
  other: {
    'msapplication-TileColor': '#0f172a',
    'msapplication-config': '/browserconfig.xml',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.qewertyy.dev" />
        <link rel="dns-prefetch" href="https://lexica.qewertyy.dev" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="InsightDigest" />
        <meta name="application-name" content="InsightDigest" />
        <meta name="msapplication-TileColor" content="#0f172a" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-50 min-h-screen antialiased`}>
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
        <InstallButton />
      </body>
    </html>
  )
}
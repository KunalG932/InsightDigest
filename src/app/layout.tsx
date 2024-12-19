import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './Navbar'
import InstallButton from '@/components/InstallButton'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'InsightDigest | Your Daily News Companion',
  description: 'Stay informed with AI-powered news summaries and comprehensive coverage of global events.',
  keywords: 'news, AI summaries, global news, current events, breaking news',
  authors: [{ name: 'InsightDigest Team' }],
  manifest: '/manifest.json',
  themeColor: '#0f172a',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  openGraph: {
    title: 'InsightDigest - Smart News Summaries',
    description: 'Get AI-powered insights on the latest news',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0f172a" />
      </head>
      <body className={`${inter.className} bg-slate-950 text-slate-50 pt-16`}>
        <Navbar />
        {children}
        <InstallButton />
      </body>
    </html>
  )
}
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Karthik Kumar Reddy — AI/ML Developer & Full-Stack Engineer',
  description:
    'Portfolio of Malasani Karthik Kumar Reddy — AI/ML Developer & Full-Stack Engineer from G. Pulla Reddy Engineering College. Building NLP apps, AI chatbots, and scalable web solutions.',
  keywords: [
    'Karthik Kumar Reddy',
    'Malasani Karthik Kumar Reddy',
    'AI ML Developer',
    'NLP Engineer',
    'Full Stack Developer',
    'React FastAPI Developer',
    'G Pulla Reddy Engineering College',
    'Portfolio',
  ],
  authors: [{ name: 'Malasani Karthik Kumar Reddy' }],
  creator: 'Malasani Karthik Kumar Reddy',
  openGraph: {
    title: 'Karthik Kumar Reddy — AI/ML & Full-Stack Developer',
    description:
      'Cinematic portfolio of an AI/ML developer specialising in NLP, RAG, and scalable web solutions.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Karthik Kumar Reddy — AI/ML Developer Portfolio',
    description: 'NLP · RAG · React · FastAPI · Supabase · IBM SkillBuild · Infosys Springboard',
  },
  robots: {
    index: true,
    follow: true,
  },
  themeColor: '#080808',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="dark" />
      </head>
      <body>{children}</body>
    </html>
  )
}

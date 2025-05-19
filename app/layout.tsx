import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    template: "%s | Academic Paper Search Portal",
    default: "Academic Paper Search Portal",
  },
  description: "A privacy-conscious search engine for academic papers",
  keywords: "academic papers, research, search engine, privacy",
  authors: [{ name: "CSEG 4206 Team" }],
  metadataBase: new URL("https://academic-paper-search.vercel.app"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://academic-paper-search.vercel.app",
    siteName: "Academic Paper Search Portal",
    images: [
      {
        url: "https://academic-paper-search.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Academic Paper Search Portal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Academic Paper Search Portal",
    description: "A privacy-conscious search engine for academic papers",
    images: ["https://academic-paper-search.vercel.app/og-image.png"],
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* CSP Meta Tag */}
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.core.ac.uk https://api.cohere.ai;"
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          <div className="flex flex-col min-h-screen bg-cream">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}

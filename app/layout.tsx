import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const siteName = "Neural Network Playground"
const siteDescription =
  "Interactive neural network playground and ML training platform for fetal health classification. Visualize, train, and analyze models in your browser."

export const metadata: Metadata = {
  title: {
    default: `${siteName} | Fetal Health Classification`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "neural network playground",
    "fetal health",
    "machine learning",
    "deep learning",
    "interactive ML",
    "data visualization",
    "model training",
    "Neural Network",
  ],
  authors: [{ name: "NexgeneAI" }],
  creator: "NexgeneAI",
  publisher: "NexgeneAI",
  generator: "Next.js",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteName} | Fetal Health Classification`,
    description: siteDescription,
    url: "/",
    siteName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/nexgeneai-icon.png",
        width: 512,
        height: 512,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} | Fetal Health Classification`,
    description: siteDescription,
    images: ["/nexgeneai-icon.png"],
  },
  icons: {
    icon: "/nexgeneai-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}

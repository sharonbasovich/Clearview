import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import Navbar from "./components/Navbar"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "VibeScope - Influencer Aura Management Platform",
  description:
    "VibeScope tracks influencer auras and suggests the perfect vibe for your marketing campaigns through advanced brand discovery and social media analysis.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-800 to-gray-900 text-white`}
      >
        <Navbar />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <footer className="bg-gray-800 text-white p-6 mt-12">
          <div className="container mx-auto text-center">
            <p>© {new Date().getFullYear()} VibeScope. All rights reserved.</p>
            <p className="mt-2 text-gray-400 text-sm">
              Advanced influencer aura tracking and brand resonance optimization.
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}

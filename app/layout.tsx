import type React from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { GoogleOAuthProvider } from "@react-oauth/google"
import { Suspense } from "react"
import "./globals.css"

// Note: In production, use environment variable for client ID
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </GoogleOAuthProvider>
        <Analytics />
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };

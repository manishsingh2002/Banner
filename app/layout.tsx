import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { BannerProvider } from "@/contexts/banner-context"
import { Navigation } from "@/components/navigation"

export const metadata: Metadata = {
  title: "Social Banner Creator",
  description: "Create stunning social media banners with professional filters",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <BannerProvider>
          <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            <Navigation />
            <main className="container mx-auto px-4 py-8">{children}</main>
          </div>
        </BannerProvider>
      </body>
    </html>
  )
}

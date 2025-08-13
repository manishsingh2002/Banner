"use client"

import { Button } from "@/components/ui/button"
import { Instagram, Layers } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <div className="text-center space-y-6 py-12 px-4">
      <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
        Instagram Banner Creator
        <Instagram className="inline-block w-8 h-8 md:w-10 md:h-10 ml-3 text-pink-500" />
      </h1>
      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Create stunning Instagram-ready banners with perfect mobile optimization. Professional quality, instant
        download.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Button
          asChild
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
        >
          <Link href="/editor">
            <Instagram className="w-5 h-5 mr-2" />
            Start Creating
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href="/templates">
            <Layers className="w-5 h-5 mr-2" />
            Browse Templates
          </Link>
        </Button>
      </div>
    </div>
  )
}

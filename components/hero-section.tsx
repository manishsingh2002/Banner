"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, Layers, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <div className="text-center space-y-6 py-12 px-4">
      <div className="flex justify-center mb-4">
        <Badge className="bg-gradient-to-r from-pink-400 to-purple-500 text-white border-0 px-4 py-2">
          <Sparkles className="w-4 h-4 mr-2" />
          Instagram Optimized
        </Badge>
      </div>

      <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
        Create Stunning
        <span className="bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent block">
          Instagram Banners
        </span>
      </h1>

      <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
        Professional-quality social media banners in seconds. Perfect dimensions, mobile-optimized, and ready to share.
      </p>

      <div className="flex justify-center gap-4 flex-wrap mt-8">
        <Button
          size="lg"
          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-lg px-8 py-3"
        >
          <Instagram className="w-5 h-5 mr-2" />
          Start Creating Now
        </Button>
        <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
          <Layers className="w-5 h-5 mr-2" />
          View Examples
        </Button>
      </div>
    </div>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Instagram, Smartphone, MousePointer, Layout, Anchor, Filter, Sparkles } from "lucide-react"

const features = [
  {
    name: "Instagram Optimized",
    description: "Perfect dimensions and quality for Instagram posts and stories",
    icon: Instagram,
    color: "bg-pink-500",
    badge: "Mobile First",
  },
  {
    name: "Mobile Preview",
    description: "Real-time mobile-optimized preview with touch-friendly interface",
    icon: Smartphone,
    color: "bg-blue-500",
    badge: "New",
  },
  {
    name: "Drag & Drop Editor",
    description: "Intuitive drag and drop interface for easy image uploads",
    icon: MousePointer,
    color: "bg-green-500",
  },
  {
    name: "Template Gallery",
    description: "Choose from professionally designed templates",
    icon: Layout,
    color: "bg-purple-500",
  },
  {
    name: "Maritime Adventure",
    description: "Ocean-themed templates for travel content",
    icon: Anchor,
    color: "bg-teal-500",
    badge: "Featured",
  },
  {
    name: "Advanced Filters",
    description: "Professional image filters optimized for mobile viewing",
    icon: Filter,
    color: "bg-orange-500",
  },
]

export function FeaturesGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-12 max-w-7xl mx-auto">
      {features.map((feature) => {
        const Icon = feature.icon
        return (
          <Card key={feature.name} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3 rounded-xl ${feature.color} text-white group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                {feature.badge && (
                  <Badge className="bg-gradient-to-r from-pink-400 to-purple-500 text-white border-0">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {feature.badge}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl group-hover:text-pink-600 transition-colors">{feature.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
              <Button className="w-full group-hover:bg-pink-600 transition-colors">Explore Feature</Button>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useBanner } from "@/contexts/banner-context"
import Link from "next/link"
import { ExternalLink, Sparkles } from "lucide-react"

interface Template {
  id: string
  name: string
  preview: string
  category: string
  isPro?: boolean
  isNew?: boolean
  description: string
  theme: string
  href?: string
}

const templates: Template[] = [
  {
    id: "minimal-clean",
    name: "Minimal Clean",
    preview: "🎨",
    category: "Business",
    description: "Clean and professional design perfect for business content",
    theme: "minimalist",
  },
  {
    id: "vibrant-sale",
    name: "Vibrant Sale",
    preview: "🔥",
    category: "E-commerce",
    description: "Eye-catching design for sales and promotions",
    theme: "vibrant",
  },
  {
    id: "luxury-brand",
    name: "Luxury Brand",
    preview: "✨",
    category: "Fashion",
    isPro: true,
    description: "Elegant design for luxury and premium brands",
    theme: "elegant_cursive",
  },
  {
    id: "food-special",
    name: "Food Special",
    preview: "🍕",
    category: "Restaurant",
    description: "Appetizing design for food and restaurant content",
    theme: "social_gallery",
  },
  {
    id: "tech-launch",
    name: "Tech Launch",
    preview: "🚀",
    category: "Technology",
    isPro: true,
    description: "Modern design for tech products and launches",
    theme: "minimalist",
  },
  {
    id: "fitness-promo",
    name: "Fitness Promo",
    preview: "💪",
    category: "Health",
    description: "Energetic design for fitness and health content",
    theme: "vibrant",
  },
  {
    id: "inspirational-quote",
    name: "Inspirational Quote",
    preview: "💭",
    category: "Lifestyle",
    description: "Beautiful design for inspirational content",
    theme: "inspirational_vibes",
  },
  {
    id: "instagram-mood",
    name: "Instagram Mood",
    preview: "📸",
    category: "Social Media",
    description: "Perfect for Instagram mood boards and galleries",
    theme: "instagram_mood",
  },
  {
    id: "maritime-adventure",
    name: "Maritime Adventure",
    preview: "⚓",
    category: "Travel",
    isNew: true,
    description: "Stunning ocean-themed design for travel and adventure content",
    theme: "maritime_adventure",
    href: "/maritime",
  },
]

export default function TemplatesPage() {
  const { setBannerData } = useBanner()

  const handleSelectTemplate = (template: Template) => {
    setBannerData((prev) => ({
      ...prev,
      designTheme: template.theme as any,
      shopName: template.name,
      productName: `Sample ${template.category} Product`,
      description: template.description,
    }))
  }

  const categories = [...new Set(templates.map((t) => t.category))]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Template Gallery</h1>
        <p className="text-gray-600">Choose from professionally designed templates to get started quickly</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button variant="outline" size="sm">
          All
        </Button>
        {categories.map((category) => (
          <Button key={category} variant="outline" size="sm">
            {category}
          </Button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="text-center space-y-3">
                <div className="text-4xl mb-3">{template.preview}</div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <h3 className="font-semibold">{template.name}</h3>
                    {template.isPro && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs">PRO</Badge>
                    )}
                    {template.isNew && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs">
                        <Sparkles className="w-3 h-3 mr-1" />
                        NEW
                      </Badge>
                    )}
                  </div>

                  <Badge variant="secondary" className="text-xs">
                    {template.category}
                  </Badge>

                  <p className="text-sm text-gray-600 leading-relaxed">{template.description}</p>
                </div>

                <div className="space-y-2">
                  {template.href ? (
                    <Button size="sm" className="w-full" asChild>
                      <Link href={template.href}>
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Template
                      </Link>
                    </Button>
                  ) : (
                    <Button size="sm" className="w-full" onClick={() => handleSelectTemplate(template)}>
                      Use Template
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pro Templates CTA */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Unlock Premium Templates</h3>
          <p className="text-gray-600 mb-4">Get access to exclusive professional templates and advanced features</p>
          <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

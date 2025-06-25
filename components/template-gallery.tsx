"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Template {
  id: string
  name: string
  preview: string
  category: string
  isPro?: boolean
}

const templates: Template[] = [
  { id: "minimal-clean", name: "Minimal Clean", preview: "🎨", category: "Business" },
  { id: "vibrant-sale", name: "Vibrant Sale", preview: "🔥", category: "E-commerce" },
  { id: "luxury-brand", name: "Luxury Brand", preview: "✨", category: "Fashion", isPro: true },
  { id: "food-special", name: "Food Special", preview: "🍕", category: "Restaurant" },
  { id: "tech-launch", name: "Tech Launch", preview: "🚀", category: "Technology", isPro: true },
  { id: "fitness-promo", name: "Fitness Promo", preview: "💪", category: "Health" },
]

interface TemplateGalleryProps {
  onSelectTemplate: (template: Template) => void
}

export function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg">📋 Quick Start Templates</h3>
      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => (
          <Card key={template.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-3">
              <div className="text-center">
                <div className="text-2xl mb-2">{template.preview}</div>
                <div className="text-sm font-medium">{template.name}</div>
                <div className="text-xs text-gray-500">{template.category}</div>
                {template.isPro && (
                  <div className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full mt-1">
                    PRO
                  </div>
                )}
                <Button size="sm" className="w-full mt-2" onClick={() => onSelectTemplate(template)}>
                  Use Template
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

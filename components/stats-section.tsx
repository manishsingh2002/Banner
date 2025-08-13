"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Instagram, Smartphone, Filter, Type } from "lucide-react"

const stats = [
  { name: "Instagram Ready", value: "100%", icon: Instagram, color: "text-pink-600" },
  { name: "Mobile Optimized", value: "✓", icon: Smartphone, color: "text-blue-600" },
  { name: "Filter Presets", value: "25+", icon: Filter, color: "text-orange-600" },
  { name: "Font Options", value: "12+", icon: Type, color: "text-purple-600" },
]

export function StatsSection() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 mb-12 max-w-6xl mx-auto">
      {stats.map((stat) => (
        <Card key={stat.name} className="text-center hover:shadow-lg transition-shadow">
          <CardContent className="p-4 md:p-6">
            <div className="flex justify-center mb-3">
              <div className="p-2 md:p-3 bg-gray-100 rounded-full">
                <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
              </div>
            </div>
            <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs md:text-sm text-gray-600">{stat.name}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

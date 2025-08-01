"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Square,
  Smartphone,
  Monitor,
  Camera,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  Youtube,
  Sparkles,
} from "lucide-react"

interface CropPreset {
  id: string
  name: string
  description: string
  aspectRatio: number
  width: number
  height: number
  platform?: string
  icon: React.ReactNode
  category: "social" | "standard" | "print" | "web"
}

interface SmartCropPresetsProps {
  onPresetSelect: (preset: CropPreset) => void
  selectedPreset?: string
  designTheme?: string
}

const cropPresets: CropPreset[] = [
  // Social Media Presets
  {
    id: "instagram-square",
    name: "Instagram Post",
    description: "Perfect square for Instagram feed",
    aspectRatio: 1,
    width: 1080,
    height: 1080,
    platform: "Instagram",
    icon: <Instagram className="w-4 h-4" />,
    category: "social",
  },
  {
    id: "instagram-story",
    name: "Instagram Story",
    description: "Vertical format for stories",
    aspectRatio: 9 / 16,
    width: 1080,
    height: 1920,
    platform: "Instagram",
    icon: <Smartphone className="w-4 h-4" />,
    category: "social",
  },
  {
    id: "facebook-post",
    name: "Facebook Post",
    description: "Landscape format for Facebook",
    aspectRatio: 16 / 9,
    width: 1200,
    height: 675,
    platform: "Facebook",
    icon: <Facebook className="w-4 h-4" />,
    category: "social",
  },
  {
    id: "twitter-post",
    name: "Twitter Post",
    description: "Wide format for Twitter",
    aspectRatio: 16 / 9,
    width: 1200,
    height: 675,
    platform: "Twitter",
    icon: <Twitter className="w-4 h-4" />,
    category: "social",
  },
  {
    id: "linkedin-post",
    name: "LinkedIn Post",
    description: "Professional format",
    aspectRatio: 1.91,
    width: 1200,
    height: 628,
    platform: "LinkedIn",
    icon: <Linkedin className="w-4 h-4" />,
    category: "social",
  },
  {
    id: "youtube-thumbnail",
    name: "YouTube Thumbnail",
    description: "Widescreen thumbnail",
    aspectRatio: 16 / 9,
    width: 1280,
    height: 720,
    platform: "YouTube",
    icon: <Youtube className="w-4 h-4" />,
    category: "social",
  },

  // Standard Presets
  {
    id: "square",
    name: "Square",
    description: "1:1 aspect ratio",
    aspectRatio: 1,
    width: 1000,
    height: 1000,
    icon: <Square className="w-4 h-4" />,
    category: "standard",
  },
  {
    id: "portrait",
    name: "Portrait",
    description: "4:5 vertical format",
    aspectRatio: 4 / 5,
    width: 800,
    height: 1000,
    icon: <Smartphone className="w-4 h-4" />,
    category: "standard",
  },
  {
    id: "landscape",
    name: "Landscape",
    description: "16:9 horizontal format",
    aspectRatio: 16 / 9,
    width: 1600,
    height: 900,
    icon: <Monitor className="w-4 h-4" />,
    category: "standard",
  },
  {
    id: "photo",
    name: "Photo",
    description: "3:2 camera format",
    aspectRatio: 3 / 2,
    width: 1500,
    height: 1000,
    icon: <Camera className="w-4 h-4" />,
    category: "standard",
  },
]

export function SmartCropPresets({ onPresetSelect, selectedPreset, designTheme }: SmartCropPresetsProps) {
  const getRecommendedPresets = () => {
    switch (designTheme) {
      case "instagram_mood":
        return ["instagram-square", "instagram-story"]
      case "social_gallery":
        return ["instagram-square", "facebook-post", "twitter-post"]
      case "inspirational_vibes":
        return ["instagram-story", "portrait"]
      case "maritime_adventure":
        return ["landscape", "facebook-post"]
      default:
        return ["square", "portrait", "landscape"]
    }
  }

  const recommendedIds = getRecommendedPresets()
  const recommendedPresets = cropPresets.filter((preset) => recommendedIds.includes(preset.id))
  const otherPresets = cropPresets.filter((preset) => !recommendedIds.includes(preset.id))

  const getCategoryColor = (category: CropPreset["category"]) => {
    switch (category) {
      case "social":
        return "bg-blue-100 text-blue-800"
      case "standard":
        return "bg-green-100 text-green-800"
      case "print":
        return "bg-purple-100 text-purple-800"
      case "web":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const PresetButton = ({ preset }: { preset: CropPreset }) => (
    <Button
      variant={selectedPreset === preset.id ? "default" : "outline"}
      className={`h-auto p-3 flex flex-col items-start gap-2 ${
        selectedPreset === preset.id ? "ring-2 ring-blue-500" : ""
      }`}
      onClick={() => onPresetSelect(preset)}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          {preset.icon}
          <span className="font-medium text-sm">{preset.name}</span>
        </div>
        {recommendedIds.includes(preset.id) && <Sparkles className="w-3 h-3 text-yellow-500" />}
      </div>
      <div className="text-left w-full">
        <p className="text-xs text-gray-600 mb-1">{preset.description}</p>
        <div className="flex items-center justify-between w-full">
          <Badge variant="outline" className={`text-xs ${getCategoryColor(preset.category)}`}>
            {preset.category}
          </Badge>
          <span className="text-xs text-gray-500">
            {preset.width}×{preset.height}
          </span>
        </div>
      </div>
    </Button>
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          Smart Crop Presets
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {recommendedPresets.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <h4 className="text-sm font-medium text-green-700">Recommended for {designTheme?.replace("_", " ")}</h4>
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                <Sparkles className="w-3 h-3 mr-1" />
                Smart
              </Badge>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {recommendedPresets.map((preset) => (
                <PresetButton key={preset.id} preset={preset} />
              ))}
            </div>
          </div>
        )}

        {recommendedPresets.length > 0 && otherPresets.length > 0 && <Separator />}

        {otherPresets.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">All Presets</h4>
            <div className="grid grid-cols-1 gap-2">
              {otherPresets.map((preset) => (
                <PresetButton key={preset.id} preset={preset} />
              ))}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1 pt-2 border-t">
          <p>• Recommended presets are optimized for your design theme</p>
          <p>• Dimensions are automatically applied to crop area</p>
          <p>• Social media presets ensure perfect platform compatibility</p>
        </div>
      </CardContent>
    </Card>
  )
}

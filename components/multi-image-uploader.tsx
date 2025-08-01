"use client"

import { useState } from "react"
import { DragDropZone } from "./drag-drop-zone"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Images, Instagram, Smartphone } from "lucide-react"

interface MultiImageUploaderProps {
  onImagesChange: (images: { [key: string]: string | null }) => void
  currentImages: { [key: string]: string | null }
}

export function MultiImageUploader({ onImagesChange, currentImages }: MultiImageUploaderProps) {
  const [activePreset, setActivePreset] = useState<string>("instagram_post")

  const presets = {
    instagram_post: {
      name: "Instagram Post",
      icon: Instagram,
      description: "Perfect square format for Instagram feed",
      images: [{ key: "main", label: "Main Image", aspectRatio: "square" as const }],
    },
    instagram_story: {
      name: "Instagram Story",
      icon: Smartphone,
      description: "Vertical format optimized for Stories",
      images: [{ key: "story", label: "Story Image", aspectRatio: "portrait" as const }],
    },
    gallery_layout: {
      name: "Gallery Layout",
      icon: Images,
      description: "Multiple images for rich content",
      images: [
        { key: "horizontal", label: "Main Horizontal", aspectRatio: "landscape" as const },
        { key: "vertical1", label: "Vertical 1", aspectRatio: "portrait" as const },
        { key: "vertical2", label: "Vertical 2", aspectRatio: "portrait" as const },
        { key: "vertical3", label: "Vertical 3", aspectRatio: "portrait" as const },
      ],
    },
  }

  const handleFileUpload = (key: string, file: File | null) => {
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onImagesChange({
          ...currentImages,
          [key]: result,
        })
      }
      reader.readAsDataURL(file)
    } else {
      onImagesChange({
        ...currentImages,
        [key]: null,
      })
    }
  }

  const currentPreset = presets[activePreset as keyof typeof presets]

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Images className="w-5 h-5" />
          Image Upload
        </CardTitle>

        {/* Preset Selection */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(presets).map(([key, preset]) => {
            const Icon = preset.icon
            return (
              <Button
                key={key}
                variant={activePreset === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActivePreset(key)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {preset.name}
              </Button>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {currentPreset.description}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {activePreset === "gallery_layout" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentPreset.images.map((imageConfig) => (
              <DragDropZone
                key={imageConfig.key}
                label={imageConfig.label}
                currentImage={currentImages[imageConfig.key]}
                onFileUpload={(file) => handleFileUpload(imageConfig.key, file)}
                aspectRatio={imageConfig.aspectRatio}
              />
            ))}
          </div>
        ) : (
          <div className="max-w-md mx-auto">
            {currentPreset.images.map((imageConfig) => (
              <DragDropZone
                key={imageConfig.key}
                label={imageConfig.label}
                currentImage={currentImages[imageConfig.key]}
                onFileUpload={(file) => handleFileUpload(imageConfig.key, file)}
                aspectRatio={imageConfig.aspectRatio}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

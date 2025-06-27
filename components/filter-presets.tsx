"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBanner } from "@/contexts/banner-context"

const filterPresets = {
  none: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    hdr: 0,
    vignette: 0,
    filmGrain: 0,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
  vintage: {
    brightness: 110,
    contrast: 120,
    saturation: 80,
    blur: 0,
    sepia: 30,
    grayscale: 0,
    hueRotate: 10,
    hdr: 0,
    vignette: 20,
    filmGrain: 15,
    textureType: "paper",
    textureIntensity: 25,
    textureBlendMode: "multiply",
  },
  blackwhite: {
    brightness: 105,
    contrast: 110,
    saturation: 0,
    blur: 0,
    sepia: 0,
    grayscale: 100,
    hueRotate: 0,
    hdr: 0,
    vignette: 15,
    filmGrain: 0,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
  sepia: {
    brightness: 110,
    contrast: 90,
    saturation: 80,
    blur: 0,
    sepia: 80,
    grayscale: 0,
    hueRotate: 0,
    hdr: 0,
    vignette: 25,
    filmGrain: 10,
    textureType: "parchment",
    textureIntensity: 30,
    textureBlendMode: "multiply",
  },
  dramatic: {
    brightness: 90,
    contrast: 150,
    saturation: 120,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    hdr: 30,
    vignette: 35,
    filmGrain: 0,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
  cinematic: {
    brightness: 95,
    contrast: 125,
    saturation: 110,
    blur: 0,
    sepia: 5,
    grayscale: 0,
    hueRotate: 15,
    hdr: 20,
    vignette: 40,
    filmGrain: 20,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
}

interface FilterPresetsProps {
  selectedImage: string
  currentPreset: string
}

export function FilterPresets({ selectedImage, currentPreset }: FilterPresetsProps) {
  const { setBannerData } = useBanner()

  const applyFilterPreset = (preset: string) => {
    const presetFilters = filterPresets[preset as keyof typeof filterPresets]
    setBannerData((prev) => ({
      ...prev,
      imageFilters: {
        ...prev.imageFilters,
        [selectedImage]: {
          ...presetFilters,
          preset,
        },
      },
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filter Presets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4">
          {Object.keys(filterPresets)
            .slice(0, 6)
            .map((preset) => (
              <Button
                key={preset}
                variant={currentPreset === preset ? "default" : "outline"}
                size="sm"
                onClick={() => applyFilterPreset(preset)}
                className="capitalize text-xs"
              >
                {preset === "blackwhite" ? "B&W" : preset}
              </Button>
            ))}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">🎨 Artistic Presets</h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.keys(filterPresets)
              .slice(6)
              .map((preset) => (
                <Button
                  key={preset}
                  variant={currentPreset === preset ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyFilterPreset(preset)}
                  className="capitalize text-xs"
                >
                  {preset.replace("_", " ")}
                </Button>
              ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useBanner } from "@/contexts/banner-context"
import { Palette, Sparkles, RotateCcw } from "lucide-react"

const filterPresets = [
  { name: "None", id: "none" },
  { name: "Vintage", id: "vintage" },
  { name: "Cinematic", id: "cinematic" },
  { name: "Warm Sunset", id: "warm_sunset" },
  { name: "Cool Blue", id: "cool_blue" },
  { name: "High Contrast", id: "high_contrast" },
  { name: "Soft Dream", id: "soft_dream" },
  { name: "Film Noir", id: "film_noir" },
]

const textureOptions = [
  { name: "None", id: "none" },
  { name: "Paper", id: "paper" },
  { name: "Canvas", id: "canvas" },
  { name: "Grunge", id: "grunge" },
  { name: "Fabric", id: "fabric" },
  { name: "Metal", id: "metal" },
]

export default function FiltersPage() {
  const { bannerData, setBannerData } = useBanner()

  const updateFilter = (imageKey: string, filterKey: string, value: number | string) => {
    setBannerData((prev) => ({
      ...prev,
      imageFilters: {
        ...prev.imageFilters,
        [imageKey]: {
          ...prev.imageFilters[imageKey as keyof typeof prev.imageFilters],
          [filterKey]: value,
        },
      },
    }))
  }

  const resetFilters = (imageKey: string) => {
    setBannerData((prev) => ({
      ...prev,
      imageFilters: {
        ...prev.imageFilters,
        [imageKey]: {
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
          preset: "none",
        },
      },
    }))
  }

  const applyPreset = (imageKey: string, presetId: string) => {
    const presets: { [key: string]: any } = {
      vintage: { brightness: 110, contrast: 120, saturation: 80, sepia: 30, vignette: 20 },
      cinematic: { brightness: 95, contrast: 130, saturation: 110, hdr: 15, vignette: 10 },
      warm_sunset: { brightness: 105, contrast: 110, saturation: 120, hueRotate: 15 },
      cool_blue: { brightness: 100, contrast: 115, saturation: 90, hueRotate: 200 },
      high_contrast: { brightness: 100, contrast: 150, saturation: 120 },
      soft_dream: { brightness: 115, contrast: 85, saturation: 110, blur: 1 },
      film_noir: { brightness: 90, contrast: 140, saturation: 0, grayscale: 80 },
    }

    if (presets[presetId]) {
      setBannerData((prev) => ({
        ...prev,
        imageFilters: {
          ...prev.imageFilters,
          [imageKey]: {
            ...prev.imageFilters[imageKey as keyof typeof prev.imageFilters],
            ...presets[presetId],
            preset: presetId,
          },
        },
      }))
    }
  }

  const imageKeys = ["productImage", "horizontalImage", "verticalImage1", "verticalImage2", "verticalImage3"]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Filters</h1>
        <p className="text-gray-600">Apply Hollywood-grade filters and effects to your images</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Filter Controls */}
        <div className="space-y-6">
          {/* Image Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Select Image to Edit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {imageKeys.map((key) => (
                  <Button key={key} variant="outline" size="sm">
                    {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Filter Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Filter Presets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {filterPresets.map((preset) => (
                  <Button
                    key={preset.id}
                    variant="outline"
                    size="sm"
                    onClick={() => applyPreset("productImage", preset.id)}
                  >
                    {preset.name}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Basic Adjustments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Basic Adjustments</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => resetFilters("productImage")}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Brightness: {bannerData.imageFilters.productImage.brightness}%</Label>
                <Slider
                  value={[bannerData.imageFilters.productImage.brightness]}
                  onValueChange={([value]) => updateFilter("productImage", "brightness", value)}
                  min={0}
                  max={200}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Contrast: {bannerData.imageFilters.productImage.contrast}%</Label>
                <Slider
                  value={[bannerData.imageFilters.productImage.contrast]}
                  onValueChange={([value]) => updateFilter("productImage", "contrast", value)}
                  min={0}
                  max={200}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Saturation: {bannerData.imageFilters.productImage.saturation}%</Label>
                <Slider
                  value={[bannerData.imageFilters.productImage.saturation]}
                  onValueChange={([value]) => updateFilter("productImage", "saturation", value)}
                  min={0}
                  max={200}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Blur: {bannerData.imageFilters.productImage.blur}px</Label>
                <Slider
                  value={[bannerData.imageFilters.productImage.blur]}
                  onValueChange={([value]) => updateFilter("productImage", "blur", value)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Advanced Effects */}
          <Card>
            <CardHeader>
              <CardTitle>Advanced Effects</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Sepia: {bannerData.imageFilters.productImage.sepia}%</Label>
                <Slider
                  value={[bannerData.imageFilters.productImage.sepia]}
                  onValueChange={([value]) => updateFilter("productImage", "sepia", value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Grayscale: {bannerData.imageFilters.productImage.grayscale}%</Label>
                <Slider
                  value={[bannerData.imageFilters.productImage.grayscale]}
                  onValueChange={([value]) => updateFilter("productImage", "grayscale", value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Hue Rotate: {bannerData.imageFilters.productImage.hueRotate}°</Label>
                <Slider
                  value={[bannerData.imageFilters.productImage.hueRotate]}
                  onValueChange={([value]) => updateFilter("productImage", "hueRotate", value)}
                  min={0}
                  max={360}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Vignette: {bannerData.imageFilters.productImage.vignette}%</Label>
                <Slider
                  value={[bannerData.imageFilters.productImage.vignette]}
                  onValueChange={([value]) => updateFilter("productImage", "vignette", value)}
                  min={0}
                  max={50}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Film Grain: {bannerData.imageFilters.productImage.filmGrain}%</Label>
                <Slider
                  value={[bannerData.imageFilters.productImage.filmGrain]}
                  onValueChange={([value]) => updateFilter("productImage", "filmGrain", value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          {/* Texture Overlays */}
          <Card>
            <CardHeader>
              <CardTitle>Texture Overlays</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Texture Type</Label>
                <Select
                  value={bannerData.imageFilters.productImage.textureType}
                  onValueChange={(value) => updateFilter("productImage", "textureType", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {textureOptions.map((texture) => (
                      <SelectItem key={texture.id} value={texture.id}>
                        {texture.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Texture Intensity: {bannerData.imageFilters.productImage.textureIntensity}%</Label>
                <Slider
                  value={[bannerData.imageFilters.productImage.textureIntensity]}
                  onValueChange={([value]) => updateFilter("productImage", "textureIntensity", value)}
                  min={0}
                  max={100}
                  step={1}
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Blend Mode</Label>
                <Select
                  value={bannerData.imageFilters.productImage.textureBlendMode}
                  onValueChange={(value) => updateFilter("productImage", "textureBlendMode", value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="overlay">Overlay</SelectItem>
                    <SelectItem value="multiply">Multiply</SelectItem>
                    <SelectItem value="screen">Screen</SelectItem>
                    <SelectItem value="soft-light">Soft Light</SelectItem>
                    <SelectItem value="hard-light">Hard Light</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Filter Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Palette className="w-12 h-12 mx-auto mb-4" />
                  <p>Upload an image to see filter effects</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Filter Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Current Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Preset:</span>
                  <Badge variant="secondary">{bannerData.imageFilters.productImage.preset || "Custom"}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Brightness:</span>
                  <span className="text-sm">{bannerData.imageFilters.productImage.brightness}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Contrast:</span>
                  <span className="text-sm">{bannerData.imageFilters.productImage.contrast}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Saturation:</span>
                  <span className="text-sm">{bannerData.imageFilters.productImage.saturation}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Texture:</span>
                  <span className="text-sm capitalize">{bannerData.imageFilters.productImage.textureType}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full">Apply to All Images</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Save as Preset
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => resetFilters("productImage")}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset All Filters
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

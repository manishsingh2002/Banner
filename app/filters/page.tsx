"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Palette, Sliders, ImageIcon } from "lucide-react"
import { useBanner } from "@/contexts/banner-context"
import { BannerPreview } from "@/components/banner-preview"
import { FilterPresets } from "@/components/filter-presets"

export default function FiltersPage() {
  const { bannerData, setBannerData } = useBanner()
  const [selectedImageForFilter, setSelectedImageForFilter] = useState<string>("productImage")

  const currentFilters = bannerData.imageFilters[selectedImageForFilter as keyof typeof bannerData.imageFilters]

  const updateFilter = (filterName: string, value: number | string) => {
    setBannerData((prev) => ({
      ...prev,
      imageFilters: {
        ...prev.imageFilters,
        [selectedImageForFilter]: {
          ...prev.imageFilters[selectedImageForFilter as keyof typeof prev.imageFilters],
          [filterName]: value,
          preset: "custom",
        },
      },
    }))
  }

  const resetFilters = () => {
    const defaultFilters = {
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
    }

    setBannerData((prev) => ({
      ...prev,
      imageFilters: {
        ...prev.imageFilters,
        [selectedImageForFilter]: defaultFilters,
      },
    }))
  }

  const getFilterString = (filters: any): string => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%) hue-rotate(${filters.hueRotate}deg)`
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Filters</h1>
        <p className="text-gray-600">Apply Hollywood-grade filters and texture overlays to your images</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Filters Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Image Selection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label>Select Image to Edit</Label>
                <Select value={selectedImageForFilter} onValueChange={setSelectedImageForFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="productImage">Product Image</SelectItem>
                    <SelectItem value="horizontalImage">Horizontal Image</SelectItem>
                    <SelectItem value="verticalImage1">Vertical Image 1</SelectItem>
                    <SelectItem value="verticalImage2">Vertical Image 2</SelectItem>
                    <SelectItem value="verticalImage3">Vertical Image 3</SelectItem>
                    <SelectItem value="inspirationalImage1">Inspirational Image 1</SelectItem>
                    <SelectItem value="inspirationalImage2">Inspirational Image 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <FilterPresets selectedImage={selectedImageForFilter} currentPreset={currentFilters.preset} />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sliders className="w-5 h-5" />
                Custom Adjustments
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Brightness: {currentFilters.brightness}%</Label>
                <Slider
                  value={[currentFilters.brightness]}
                  onValueChange={([value]) => updateFilter("brightness", value)}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Contrast: {currentFilters.contrast}%</Label>
                <Slider
                  value={[currentFilters.contrast]}
                  onValueChange={([value]) => updateFilter("contrast", value)}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Saturation: {currentFilters.saturation}%</Label>
                <Slider
                  value={[currentFilters.saturation]}
                  onValueChange={([value]) => updateFilter("saturation", value)}
                  min={0}
                  max={200}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Blur: {currentFilters.blur}px</Label>
                <Slider
                  value={[currentFilters.blur]}
                  onValueChange={([value]) => updateFilter("blur", value)}
                  min={0}
                  max={10}
                  step={0.1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Sepia: {currentFilters.sepia}%</Label>
                <Slider
                  value={[currentFilters.sepia]}
                  onValueChange={([value]) => updateFilter("sepia", value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Grayscale: {currentFilters.grayscale}%</Label>
                <Slider
                  value={[currentFilters.grayscale]}
                  onValueChange={([value]) => updateFilter("grayscale", value)}
                  min={0}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label>Hue Rotate: {currentFilters.hueRotate}°</Label>
                <Slider
                  value={[currentFilters.hueRotate]}
                  onValueChange={([value]) => updateFilter("hueRotate", value)}
                  min={0}
                  max={360}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <Label className="text-base font-semibold">🎬 Advanced Effects</Label>

                <div className="space-y-2">
                  <Label>HDR Effect: {currentFilters.hdr}%</Label>
                  <Slider
                    value={[currentFilters.hdr]}
                    onValueChange={([value]) => updateFilter("hdr", value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Enhances dynamic range and color depth</p>
                </div>

                <div className="space-y-2">
                  <Label>Vignette: {currentFilters.vignette}%</Label>
                  <Slider
                    value={[currentFilters.vignette]}
                    onValueChange={([value]) => updateFilter("vignette", value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Darkens edges for dramatic focus</p>
                </div>

                <div className="space-y-2">
                  <Label>Film Grain: {currentFilters.filmGrain}%</Label>
                  <Slider
                    value={[currentFilters.filmGrain]}
                    onValueChange={([value]) => updateFilter("filmGrain", value)}
                    min={0}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">Adds authentic film texture</p>
                </div>
              </div>

              <Button variant="outline" onClick={resetFilters} className="w-full bg-transparent">
                Reset All Filters
              </Button>
            </CardContent>
          </Card>

          {/* Filter Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                {bannerData[selectedImageForFilter as keyof typeof bannerData] ? (
                  <img
                    src={
                      (bannerData[selectedImageForFilter as keyof typeof bannerData] as string) || "/placeholder.svg"
                    }
                    alt="Filter Preview"
                    className="max-w-full max-h-full object-contain rounded"
                    style={{ filter: getFilterString(currentFilters) }}
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">Upload an image to see filter preview</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <BannerPreview />
      </div>
    </div>
  )
}

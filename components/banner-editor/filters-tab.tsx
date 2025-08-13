"use client"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Palette, Sliders, ImageIcon } from "lucide-react"
import type { BannerData, ImageFilters } from "@/types/banner"

interface FiltersTabProps {
  bannerData: BannerData
  selectedImageForFilter: string
  setSelectedImageForFilter: (value: string) => void
  applyFilterPreset: (preset: string) => void
  updateFilter: (filterName: string, value: number | string) => void
  resetFilters: () => void
  getFilterString: (filters: ImageFilters) => string
}

const filterPresets = ["none", "instagram", "vintage", "blackwhite", "dramatic", "mobile_optimized"]

export function FiltersTab({
  bannerData,
  selectedImageForFilter,
  setSelectedImageForFilter,
  applyFilterPreset,
  updateFilter,
  resetFilters,
  getFilterString,
}: FiltersTabProps) {
  const currentFilters = bannerData.imageFilters[selectedImageForFilter as keyof typeof bannerData.imageFilters]

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Palette className="w-5 h-5" />
        <h3 className="font-semibold">Mobile-Optimized Filters</h3>
      </div>

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

      <div className="space-y-2">
        <Label>Filter Presets</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {filterPresets.map((preset) => (
            <Button
              key={preset}
              variant={currentFilters.preset === preset ? "default" : "outline"}
              size="sm"
              onClick={() => applyFilterPreset(preset)}
              className="capitalize text-xs"
            >
              {preset === "blackwhite" ? "B&W" : preset === "mobile_optimized" ? "Mobile" : preset}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4" />
          <Label>Custom Adjustments</Label>
        </div>

        <div className="space-y-4">
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
            <Label>HDR Effect: {currentFilters.hdr}%</Label>
            <Slider
              value={[currentFilters.hdr]}
              onValueChange={([value]) => updateFilter("hdr", value)}
              min={0}
              max={50}
              step={1}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>Vignette: {currentFilters.vignette}%</Label>
            <Slider
              value={[currentFilters.vignette]}
              onValueChange={([value]) => updateFilter("vignette", value)}
              min={0}
              max={50}
              step={1}
              className="w-full"
            />
          </div>
        </div>

        <Button variant="outline" onClick={resetFilters} className="w-full bg-transparent">
          Reset All Filters
        </Button>
      </div>

      <div className="space-y-2 border-t pt-4">
        <Label>Filter Preview</Label>
        <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
          {bannerData[selectedImageForFilter as keyof BannerData] ? (
            <img
              src={(bannerData[selectedImageForFilter as keyof BannerData] as string) || "/placeholder.svg"}
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
      </div>
    </div>
  )
}

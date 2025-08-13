"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import type { BannerData, TextStyles } from "@/types/banner"

interface TypographyTabProps {
  bannerData: BannerData
  setBannerData: React.Dispatch<React.SetStateAction<BannerData>>
  updateTextStyle: (property: keyof TextStyles, value: string | number) => void
}

const fontOptions = {
  Inter: "Inter, sans-serif",
  "Dancing Script": "Dancing Script, cursive",
  "Playfair Display": "Playfair Display, serif",
  Roboto: "Roboto, sans-serif",
  "Open Sans": "Open Sans, sans-serif",
  Lato: "Lato, sans-serif",
  Montserrat: "Montserrat, sans-serif",
  Poppins: "Poppins, sans-serif",
  Oswald: "Oswald, sans-serif",
  "Source Sans Pro": "Source Sans Pro, sans-serif",
  Raleway: "Raleway, sans-serif",
  Nunito: "Nunito, sans-serif",
}

const defaultTextStyles: TextStyles = {
  shopNameFont: "Inter",
  shopNameSize: 36,
  productNameFont: "Inter",
  productNameSize: 34,
  descriptionFont: "Inter",
  descriptionSize: 18,
  priceFont: "Inter",
  priceSize: 24,
  inspirationalTextFont: "Inter",
  inspirationalTextSize: 16,
  authorNameFont: "Inter",
  authorNameSize: 20,
  dateTextFont: "Inter",
  dateTextSize: 16,
}

export function TypographyTab({ bannerData, setBannerData, updateTextStyle }: TypographyTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-lg">🔤</span>
        <h3 className="font-semibold">Mobile-Optimized Typography</h3>
      </div>

      <div className="space-y-6">
        {/* Shop Name Styling */}
        <div className="space-y-3 p-4 border rounded-lg">
          <Label className="font-semibold text-base">Shop Name</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={bannerData.textStyles.shopNameFont}
                onValueChange={(value) => updateTextStyle("shopNameFont", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fontOptions).map(([key, value]) => (
                    <SelectItem key={key} value={key} style={{ fontFamily: value }}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Font Size: {bannerData.textStyles.shopNameSize}px</Label>
              <Slider
                value={[bannerData.textStyles.shopNameSize]}
                onValueChange={([value]) => updateTextStyle("shopNameSize", value)}
                min={12}
                max={72}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {/* Product Name Styling */}
        <div className="space-y-3 p-4 border rounded-lg">
          <Label className="font-semibold text-base">Product Name</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select
                value={bannerData.textStyles.productNameFont}
                onValueChange={(value) => updateTextStyle("productNameFont", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(fontOptions).map(([key, value]) => (
                    <SelectItem key={key} value={key} style={{ fontFamily: value }}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Font Size: {bannerData.textStyles.productNameSize}px</Label>
              <Slider
                value={[bannerData.textStyles.productNameSize]}
                onValueChange={([value]) => updateTextStyle("productNameSize", value)}
                min={12}
                max={72}
                step={1}
                className="w-full"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setBannerData((prev) => ({ ...prev, textStyles: { ...defaultTextStyles } }))}
            className="flex-1"
          >
            Reset Typography
          </Button>
        </div>
      </div>
    </div>
  )
}

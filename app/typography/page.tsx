"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Type } from "lucide-react"
import { useBanner } from "@/contexts/banner-context"
import { BannerPreview } from "@/components/banner-preview"

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

export default function TypographyPage() {
  const { bannerData, setBannerData } = useBanner()

  const updateTextStyle = (property: keyof typeof bannerData.textStyles, value: string | number) => {
    setBannerData((prev) => ({
      ...prev,
      textStyles: {
        ...prev.textStyles,
        [property]: value,
      },
    }))
  }

  const resetTypography = () => {
    const defaultTextStyles = {
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

    setBannerData((prev) => ({
      ...prev,
      textStyles: defaultTextStyles,
    }))
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Typography Settings</h1>
        <p className="text-gray-600">Customize fonts, sizes, and text styling for your banner</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Typography Controls */}
        <div className="space-y-6">
          {/* Shop Name Styling */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Shop Name
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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
              <div className="p-3 bg-gray-50 rounded-lg">
                <p
                  style={{
                    fontFamily: fontOptions[bannerData.textStyles.shopNameFont as keyof typeof fontOptions],
                    fontSize: `${Math.min(bannerData.textStyles.shopNameSize, 24)}px`,
                  }}
                  className="text-center"
                >
                  {bannerData.shopName || "Shop Name Preview"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Product Name Styling */}
          <Card>
            <CardHeader>
              <CardTitle>Product Name</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
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
              <div className="p-3 bg-gray-50 rounded-lg">
                <p
                  style={{
                    fontFamily: fontOptions[bannerData.textStyles.productNameFont as keyof typeof fontOptions],
                    fontSize: `${Math.min(bannerData.textStyles.productNameSize, 20)}px`,
                  }}
                  className="text-center"
                >
                  {bannerData.productName || "Product Name Preview"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Description Styling */}
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select
                    value={bannerData.textStyles.descriptionFont}
                    onValueChange={(value) => updateTextStyle("descriptionFont", value)}
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
                  <Label>Font Size: {bannerData.textStyles.descriptionSize}px</Label>
                  <Slider
                    value={[bannerData.textStyles.descriptionSize]}
                    onValueChange={([value]) => updateTextStyle("descriptionSize", value)}
                    min={10}
                    max={32}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p
                  style={{
                    fontFamily: fontOptions[bannerData.textStyles.descriptionFont as keyof typeof fontOptions],
                    fontSize: `${Math.min(bannerData.textStyles.descriptionSize, 16)}px`,
                  }}
                  className="text-center"
                >
                  {bannerData.description || "Description preview text goes here"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Price Styling */}
          <Card>
            <CardHeader>
              <CardTitle>Price</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select
                    value={bannerData.textStyles.priceFont}
                    onValueChange={(value) => updateTextStyle("priceFont", value)}
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
                  <Label>Font Size: {bannerData.textStyles.priceSize}px</Label>
                  <Slider
                    value={[bannerData.textStyles.priceSize]}
                    onValueChange={([value]) => updateTextStyle("priceSize", value)}
                    min={12}
                    max={48}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p
                  style={{
                    fontFamily: fontOptions[bannerData.textStyles.priceFont as keyof typeof fontOptions],
                    fontSize: `${Math.min(bannerData.textStyles.priceSize, 18)}px`,
                  }}
                  className="text-center font-bold text-green-600"
                >
                  ${bannerData.price || "99.99"}
                </p>
              </div>
            </CardContent>
          </Card>

          {bannerData.designTheme === "inspirational_vibes" && (
            <>
              {/* Author Name Styling */}
              <Card>
                <CardHeader>
                  <CardTitle>Author Name</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <Select
                        value={bannerData.textStyles.authorNameFont}
                        onValueChange={(value) => updateTextStyle("authorNameFont", value)}
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
                      <Label>Font Size: {bannerData.textStyles.authorNameSize}px</Label>
                      <Slider
                        value={[bannerData.textStyles.authorNameSize]}
                        onValueChange={([value]) => updateTextStyle("authorNameSize", value)}
                        min={10}
                        max={32}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Inspirational Text Styling */}
              <Card>
                <CardHeader>
                  <CardTitle>Inspirational Text</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>Font Family</Label>
                      <Select
                        value={bannerData.textStyles.inspirationalTextFont}
                        onValueChange={(value) => updateTextStyle("inspirationalTextFont", value)}
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
                      <Label>Font Size: {bannerData.textStyles.inspirationalTextSize}px</Label>
                      <Slider
                        value={[bannerData.textStyles.inspirationalTextSize]}
                        onValueChange={([value]) => updateTextStyle("inspirationalTextSize", value)}
                        min={10}
                        max={24}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          <Button variant="outline" onClick={resetTypography} className="w-full bg-transparent">
            Reset All Typography
          </Button>
        </div>

        {/* Live Preview */}
        <BannerPreview />
      </div>
    </div>
  )
}

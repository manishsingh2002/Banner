"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useBanner } from "@/contexts/banner-context"
import { Anchor, Upload, Download, Eye, Palette, Type } from "lucide-react"
import Image from "next/image"

export default function MaritimePage() {
  const { bannerData, setBannerData, generateBanner, downloadBanner, isGenerating } = useBanner()
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile")

  const handleInputChange = (field: string, value: string) => {
    setBannerData((prev) => ({
      ...prev,
      [field]: value,
      designTheme: "maritime_adventure",
    }))
  }

  const handleImageUpload = (field: string, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setBannerData((prev) => ({
        ...prev,
        [field]: result,
      }))
    }
    reader.readAsDataURL(file)
  }

  const maritimePresets = [
    { name: "Ocean Breeze", colors: ["#4A90A4", "#2C5F6F", "#87CEEB"] },
    { name: "Deep Sea", colors: ["#1B4B5A", "#2C5F6F", "#4A90A4"] },
    { name: "Sunset Voyage", colors: ["#FF6B35", "#F7931E", "#4A90A4"] },
    { name: "Arctic Waters", colors: ["#B8D4E3", "#4A90A4", "#2C5F6F"] },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="p-3 bg-teal-500 text-white rounded-lg">
            <Anchor className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Maritime Adventure Template</h1>
            <Badge className="bg-gradient-to-r from-teal-500 to-blue-500 text-white mt-2">New Template</Badge>
          </div>
        </div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Create stunning travel and adventure banners with our maritime-themed template. Perfect for travel blogs,
          adventure tours, and ocean-themed content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          {/* Content Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="w-5 h-5" />
                Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Main Title</Label>
                <Input
                  id="title"
                  placeholder="Berbisik Tentang"
                  value={bannerData.shopName}
                  onChange={(e) => handleInputChange("shopName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Subtitle</Label>
                <Input
                  id="subtitle"
                  placeholder="Sebuah Rahasia"
                  value={bannerData.productName}
                  onChange={(e) => handleInputChange("productName", e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Double Exposure | Instagram | Sunrise | Reindeer"
                  value={bannerData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="author">Author/Photographer</Label>
                <Input
                  id="author"
                  placeholder="Photographer name"
                  value={bannerData.photographer}
                  onChange={(e) => handleInputChange("photographer", e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Main Image (Top)</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload("horizontalImage", file)
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </div>
              </div>

              <div>
                <Label>Secondary Image (Bottom)</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload("verticalImage1", file)
                    }}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Color Presets */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Color Themes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {maritimePresets.map((preset) => (
                  <div
                    key={preset.name}
                    className="p-3 border rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-1 mb-2">
                      {preset.colors.map((color, index) => (
                        <div key={index} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                    <div className="text-sm font-medium">{preset.name}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button onClick={generateBanner} disabled={isGenerating} className="w-full bg-teal-500 hover:bg-teal-600">
                <Eye className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Generate Preview"}
              </Button>

              <Button onClick={() => downloadBanner("png")} variant="outline" className="w-full">
                <Download className="w-4 h-4 mr-2" />
                Download PNG
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Preview</CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant={previewMode === "mobile" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("mobile")}
                  >
                    Mobile
                  </Button>
                  <Button
                    variant={previewMode === "desktop" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPreviewMode("desktop")}
                  >
                    Desktop
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div
                  className={`relative bg-gradient-to-b from-teal-400 to-teal-600 rounded-2xl overflow-hidden shadow-2xl ${
                    previewMode === "mobile" ? "w-80 h-96" : "w-full max-w-2xl h-80"
                  }`}
                >
                  {/* Template Preview */}
                  <div className="absolute inset-0 p-6 text-white">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src="/maritime-template-bg.jpg"
                        alt="Maritime background"
                        fill
                        className="object-cover opacity-80"
                      />
                    </div>

                    {/* Content Overlay */}
                    <div className="relative z-10 h-full flex flex-col">
                      {/* Top Images Area */}
                      <div className="flex-1 grid grid-cols-1 gap-4 mb-6">
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center">
                          <span className="text-2xl">🚢</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 flex items-center justify-center">
                          <span className="text-2xl">🐦</span>
                        </div>
                      </div>

                      {/* Text Content */}
                      <div className="text-center space-y-2">
                        <h2 className="text-2xl font-bold">{bannerData.shopName || "Berbisik Tentang"}</h2>
                        <h3 className="text-xl">{bannerData.productName || "Sebuah Rahasia"}</h3>
                        <p className="text-sm opacity-90">
                          {bannerData.description || "Double Exposure | Instagram | Sunrise | Reindeer"}
                        </p>
                        {bannerData.photographer && <p className="text-xs opacity-75">by {bannerData.photographer}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Template Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Template Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">🌊</div>
                  <div className="text-sm font-medium">Ocean Theme</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📱</div>
                  <div className="text-sm font-medium">Mobile Optimized</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <div className="text-sm font-medium">Color Presets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">✨</div>
                  <div className="text-sm font-medium">Premium Quality</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { MultiImageUploader } from "@/components/multi-image-uploader"
import { useBanner } from "@/contexts/banner-context"
import { Download, Instagram, Smartphone, Palette, ImageIcon } from "lucide-react"

export default function EditorPage() {
  const { bannerData, setBannerData, generateBanner, downloadBanner, isGenerating } = useBanner()
  const [selectedImageForFilter, setSelectedImageForFilter] = useState<string>("productImage")

  const fontOptions = {
    Inter: "Inter, sans-serif",
    "Dancing Script": "Dancing Script, cursive",
    "Playfair Display": "Playfair Display, serif",
    Roboto: "Roboto, sans-serif",
    "Open Sans": "Open Sans, sans-serif",
    Lato: "Lato, sans-serif",
    Montserrat: "Montserrat, sans-serif",
    Poppins: "Poppins, sans-serif",
  }

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
    instagram: {
      brightness: 110,
      contrast: 115,
      saturation: 120,
      blur: 0,
      sepia: 0,
      grayscale: 0,
      hueRotate: 0,
      hdr: 15,
      vignette: 10,
      filmGrain: 5,
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
    mobile_optimized: {
      brightness: 115,
      contrast: 125,
      saturation: 110,
      blur: 0,
      sepia: 0,
      grayscale: 0,
      hueRotate: 0,
      hdr: 20,
      vignette: 5,
      filmGrain: 3,
      textureType: "none",
      textureIntensity: 0,
      textureBlendMode: "overlay",
    },
  }

  const handleMultiImageUpload = (images: { [key: string]: string | null }) => {
    setBannerData((prev) => ({
      ...prev,
      productImage: images.main || images.story || prev.productImage,
      horizontalImage: images.horizontal || prev.horizontalImage,
      verticalImage1: images.vertical1 || prev.verticalImage1,
      verticalImage2: images.vertical2 || prev.verticalImage2,
      verticalImage3: images.vertical3 || prev.verticalImage3,
    }))
  }

  const applyFilterPreset = (preset: string) => {
    const presetFilters = filterPresets[preset as keyof typeof filterPresets]
    setBannerData((prev) => ({
      ...prev,
      imageFilters: {
        ...prev.imageFilters,
        [selectedImageForFilter]: {
          ...presetFilters,
          preset,
        },
      },
    }))
  }

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

  const updateTextStyle = (property: string, value: string | number) => {
    setBannerData((prev) => ({
      ...prev,
      textStyles: {
        ...prev.textStyles,
        [property]: value,
      },
    }))
  }

  const getFilterString = (filters: any): string => {
    let filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%) hue-rotate(${filters.hueRotate}deg)`

    if (filters.hdr > 0) {
      const hdrBoost = 1 + filters.hdr / 100
      filterString += ` contrast(${Math.min(200, filters.contrast * hdrBoost)}%) saturate(${Math.min(200, filters.saturation * hdrBoost)}%)`
    }

    return filterString
  }

  const currentFilters = bannerData.imageFilters[selectedImageForFilter as keyof typeof bannerData.imageFilters]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3">
            <Instagram className="w-10 h-10 text-pink-500" />
            Instagram Banner Editor
          </h1>
          <p className="text-lg text-gray-600">Create professional Instagram banners optimized for mobile viewing</p>
          <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
            Mobile Optimized • High Quality Downloads • Full Screen Space
          </Badge>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Editor Panel */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-6 h-6 text-purple-500" />
                Banner Editor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="filters">Filters</TabsTrigger>
                  <TabsTrigger value="typography">Typography</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="shopName">Shop Name</Label>
                      <Input
                        id="shopName"
                        placeholder="Enter your shop name"
                        value={bannerData.shopName}
                        onChange={(e) => setBannerData((prev) => ({ ...prev, shopName: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="productName">Product Name</Label>
                      <Input
                        id="productName"
                        placeholder="Enter product name"
                        value={bannerData.productName}
                        onChange={(e) => setBannerData((prev) => ({ ...prev, productName: e.target.value }))}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price">Price</Label>
                      <Input
                        id="price"
                        placeholder="Enter price (without currency symbol)"
                        value={bannerData.price}
                        onChange={(e) => setBannerData((prev) => ({ ...prev, price: e.target.value }))}
                      />
                    </div>

                    <MultiImageUploader
                      currentImages={{
                        main: bannerData.productImage,
                        story: bannerData.productImage,
                        horizontal: bannerData.horizontalImage,
                        vertical1: bannerData.verticalImage1,
                        vertical2: bannerData.verticalImage2,
                        vertical3: bannerData.verticalImage3,
                      }}
                      onImagesChange={handleMultiImageUpload}
                    />

                    <div className="space-y-2">
                      <Label>Design Theme</Label>
                      <Select
                        value={bannerData.designTheme}
                        onValueChange={(value: any) => setBannerData((prev) => ({ ...prev, designTheme: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="social_gallery">Social Gallery Post</SelectItem>
                          <SelectItem value="instagram_mood">Instagram Mood Board</SelectItem>
                          <SelectItem value="inspirational_vibes">Inspirational Vibes</SelectItem>
                          <SelectItem value="minimalist">Minimalist Chic</SelectItem>
                          <SelectItem value="vibrant">Vibrant & Bold</SelectItem>
                          <SelectItem value="elegant_cursive">Elegant Cursive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Instagram Format</Label>
                      <Select
                        value={bannerData.resolution}
                        onValueChange={(value: any) => setBannerData((prev) => ({ ...prev, resolution: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram_post">
                            <div className="flex items-center gap-2">
                              <Instagram className="w-4 h-4" />
                              Instagram Post (1080×1080)
                            </div>
                          </SelectItem>
                          <SelectItem value="instagram_story">
                            <div className="flex items-center gap-2">
                              <Smartphone className="w-4 h-4" />
                              Instagram Story (1080×1920)
                            </div>
                          </SelectItem>
                          <SelectItem value="hd">Standard HD (1920×1080)</SelectItem>
                          <SelectItem value="4k">4K Ultra HD (3840×2160)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="filters" className="space-y-6">
                  <div className="space-y-4">
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
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Filter Presets</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.keys(filterPresets).map((preset) => (
                          <Button
                            key={preset}
                            variant={currentFilters.preset === preset ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyFilterPreset(preset)}
                            className="capitalize text-xs"
                          >
                            {preset === "mobile_optimized" ? "Mobile" : preset}
                          </Button>
                        ))}
                      </div>
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
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Filter Preview</Label>
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        {bannerData[selectedImageForFilter as keyof typeof bannerData] ? (
                          <img
                            src={
                              (bannerData[selectedImageForFilter as keyof typeof bannerData] as string) ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
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
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-3 p-4 border rounded-lg">
                      <Label className="font-semibold">Shop Name</Label>
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
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3 p-4 border rounded-lg">
                      <Label className="font-semibold">Product Name</Label>
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
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="space-y-4 pt-6 border-t">
                <Button
                  onClick={() => downloadBanner("png")}
                  disabled={!bannerData.shopName || !bannerData.productName || isGenerating}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  size="lg"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {isGenerating ? "Generating..." : "Download Instagram Banner"}
                </Button>

                <div className="grid grid-cols-3 gap-2">
                  {["png", "jpg", "webp"].map((format) => (
                    <Button
                      key={format}
                      variant="outline"
                      size="sm"
                      onClick={() => downloadBanner(format)}
                      disabled={isGenerating}
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Panel - Full Screen Optimized */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="w-6 h-6 text-blue-500" />
                Full Screen Preview
              </CardTitle>
            </CardHeader>
            <CardContent className="p-2">
              <div
                className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative ${
                  bannerData.resolution === "instagram_story" ? "aspect-[9/16]" : "aspect-square"
                }`}
              >
                {bannerData.shopName || bannerData.productName ? (
                  <div className="w-full h-full bg-white flex flex-col">
                    {/* Maximized image space */}
                    {bannerData.productImage ? (
                      <div className="flex-1 overflow-hidden">
                        <img
                          src={bannerData.productImage || "/placeholder.svg"}
                          alt="Product"
                          className="w-full h-full object-cover"
                          style={{ filter: getFilterString(bannerData.imageFilters.productImage) }}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 bg-gray-200 flex items-center justify-center">
                        <span className="text-6xl">📷</span>
                      </div>
                    )}

                    {/* Compact text section at bottom */}
                    <div className="bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 p-4 text-white">
                      <div className="text-center space-y-1">
                        {bannerData.shopName && (
                          <h2 className="text-xl font-bold text-white drop-shadow-lg">{bannerData.shopName}</h2>
                        )}

                        <div className="flex justify-between items-center">
                          {bannerData.productName && <p className="text-lg text-gray-200">{bannerData.productName}</p>}
                          {bannerData.price && <p className="text-lg font-bold text-yellow-400">${bannerData.price}</p>}
                        </div>

                        {/* Decorative line */}
                        <div className="w-16 h-0.5 bg-yellow-400 mx-auto mt-2"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Enter details to see full screen preview</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

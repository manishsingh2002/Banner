"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useBanner } from "@/contexts/banner-context"
import { DragDropZone } from "@/components/drag-drop-zone"
import { MultiImageUploader } from "@/components/multi-image-uploader"
import { Edit, Upload, Download, Eye, Palette, ImageIcon, Type, Sparkles, Crop } from "lucide-react"
import { useState } from "react"

export default function EditorPage() {
  const { bannerData, setBannerData, generateBanner, downloadBanner, isGenerating } = useBanner()
  const [activeTab, setActiveTab] = useState("content")

  const handleInputChange = (field: string, value: string) => {
    setBannerData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleImageUpload = (field: string, file: File | null) => {
    if (!file) {
      setBannerData((prev) => ({
        ...prev,
        [field]: null,
      }))
      return
    }

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

  const handleMultipleImageUpload = (files: File[]) => {
    files.forEach((file, index) => {
      if (index < 3) {
        const field = `verticalImage${index + 1}`
        handleImageUpload(field, file)
      }
    })
  }

  const getThemeDescription = (theme: string) => {
    const descriptions = {
      social_gallery: "Perfect for product showcases and social media posts",
      instagram_mood: "Aesthetic mood board style with color palettes",
      minimalist: "Clean and simple design with focus on content",
      vibrant: "Bold colors and energetic design",
      elegant_cursive: "Sophisticated typography with elegant styling",
      inspirational_vibes: "Motivational quotes and inspiring imagery",
      maritime_adventure: "Ocean-themed design for travel and adventure content",
    }
    return descriptions[theme as keyof typeof descriptions] || "Custom theme"
  }

  const getCropAspectRatio = (theme: string) => {
    const ratios = {
      social_gallery: 1, // Square for social media
      instagram_mood: 4 / 5, // Instagram portrait
      minimalist: 16 / 9, // Widescreen
      vibrant: 1, // Square
      elegant_cursive: 3 / 2, // Photo ratio
      inspirational_vibes: 16 / 9, // Widescreen
      maritime_adventure: 16 / 9, // Widescreen
    }
    return ratios[theme as keyof typeof ratios]
  }

  const currentImages = [bannerData.verticalImage1, bannerData.verticalImage2, bannerData.verticalImage3]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Banner Editor
            <Sparkles className="inline-block w-8 h-8 ml-2 text-yellow-500" />
          </h1>
          <p className="text-lg text-gray-600">
            Create stunning social media banners with drag & drop and cropping tools
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant="secondary">
              <Crop className="w-3 h-3 mr-1" />
              Smart Cropping
            </Badge>
            <Badge variant="secondary">Drag & Drop</Badge>
            <Badge variant="secondary">Real-time Preview</Badge>
            <Badge variant="secondary">Multiple Formats</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Editor Controls */}
          <div className="xl:col-span-1 space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content" className="text-xs">
                  <Edit className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="images" className="text-xs">
                  <ImageIcon className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="design" className="text-xs">
                  <Palette className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="export" className="text-xs">
                  <Download className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Type className="w-5 h-5" />
                      Text Content
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="shopName" className="text-sm font-medium">
                        Shop/Brand Name
                      </Label>
                      <Input
                        id="shopName"
                        value={bannerData.shopName}
                        onChange={(e) => handleInputChange("shopName", e.target.value)}
                        placeholder="Enter your brand name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="productName" className="text-sm font-medium">
                        Product Name
                      </Label>
                      <Input
                        id="productName"
                        value={bannerData.productName}
                        onChange={(e) => handleInputChange("productName", e.target.value)}
                        placeholder="Enter product name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        value={bannerData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        placeholder="Enter a compelling description"
                        rows={3}
                        className="mt-1 resize-none"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price" className="text-sm font-medium">
                        Price
                      </Label>
                      <Input
                        id="price"
                        value={bannerData.price}
                        onChange={(e) => handleInputChange("price", e.target.value)}
                        placeholder="$99.99"
                        className="mt-1"
                      />
                    </div>

                    {bannerData.designTheme === "inspirational_vibes" && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm text-gray-700">Inspirational Content</h4>

                          <div>
                            <Label htmlFor="inspirationalText">Inspirational Text</Label>
                            <Textarea
                              id="inspirationalText"
                              value={bannerData.inspirationalText}
                              onChange={(e) => handleInputChange("inspirationalText", e.target.value)}
                              placeholder="Enter motivational message"
                              rows={2}
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="authorName">Author Name</Label>
                            <Input
                              id="authorName"
                              value={bannerData.authorName}
                              onChange={(e) => handleInputChange("authorName", e.target.value)}
                              placeholder="Enter author name"
                              className="mt-1"
                            />
                          </div>

                          <div>
                            <Label htmlFor="dateText">Date/Month</Label>
                            <Input
                              id="dateText"
                              value={bannerData.dateText}
                              onChange={(e) => handleInputChange("dateText", e.target.value)}
                              placeholder="January 2024"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="images" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Upload className="w-5 h-5" />
                      Images
                      <Badge variant="outline" className="text-xs">
                        <Crop className="w-3 h-3 mr-1" />
                        Smart Crop
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <DragDropZone
                      onFileUpload={(file) => handleImageUpload("productImage", file)}
                      currentImage={bannerData.productImage}
                      label="Main Product Image"
                      enableCropping={true}
                      cropAspectRatio={getCropAspectRatio(bannerData.designTheme)}
                    />

                    <DragDropZone
                      onFileUpload={(file) => handleImageUpload("horizontalImage", file)}
                      currentImage={bannerData.horizontalImage}
                      label="Background Image"
                      enableCropping={true}
                      cropAspectRatio={16 / 9} // Always widescreen for backgrounds
                    />

                    <Separator />

                    <MultiImageUploader
                      onFilesUpload={handleMultipleImageUpload}
                      currentImages={currentImages}
                      labels={["Vertical 1", "Vertical 2", "Vertical 3"]}
                      maxImages={3}
                      enableCropping={true}
                      cropAspectRatio={getCropAspectRatio(bannerData.designTheme)}
                    />

                    {bannerData.designTheme === "inspirational_vibes" && (
                      <>
                        <Separator />
                        <div className="space-y-4">
                          <h4 className="font-medium text-sm text-gray-700 flex items-center gap-2">
                            Inspirational Images
                            <Badge variant="outline" className="text-xs">
                              <Crop className="w-3 h-3 mr-1" />
                              Auto-crop
                            </Badge>
                          </h4>

                          <DragDropZone
                            onFileUpload={(file) => handleImageUpload("inspirationalImage1", file)}
                            currentImage={bannerData.inspirationalImage1}
                            label="Main Inspirational Image"
                            compact
                            enableCropping={true}
                            cropAspectRatio={16 / 9}
                          />

                          <DragDropZone
                            onFileUpload={(file) => handleImageUpload("inspirationalImage2", file)}
                            currentImage={bannerData.inspirationalImage2}
                            label="Secondary Image (Optional)"
                            compact
                            enableCropping={true}
                            cropAspectRatio={1} // Square for secondary
                          />
                        </div>
                      </>
                    )}

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 mb-2 flex items-center gap-2">
                        <Crop className="w-4 h-4" />
                        Smart Cropping Features
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Automatic aspect ratio based on theme</li>
                        <li>• Drag to reposition crop area</li>
                        <li>• Zoom, rotate, and flip controls</li>
                        <li>• Grid lines for perfect composition</li>
                        <li>• Multiple preset ratios available</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Palette className="w-5 h-5" />
                      Design Theme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Theme Style</Label>
                      <Select
                        value={bannerData.designTheme}
                        onValueChange={(value) => handleInputChange("designTheme", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="social_gallery">🖼️ Social Gallery</SelectItem>
                          <SelectItem value="instagram_mood">🎨 Instagram Mood</SelectItem>
                          <SelectItem value="minimalist">✨ Minimalist</SelectItem>
                          <SelectItem value="vibrant">🌈 Vibrant</SelectItem>
                          <SelectItem value="elegant_cursive">✍️ Elegant Cursive</SelectItem>
                          <SelectItem value="inspirational_vibes">💫 Inspirational Vibes</SelectItem>
                          <SelectItem value="maritime_adventure">🌊 Maritime Adventure</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-gray-500 mt-2">{getThemeDescription(bannerData.designTheme)}</p>
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs">
                          <Crop className="w-3 h-3 mr-1" />
                          Auto-crop ratio: {getCropAspectRatio(bannerData.designTheme)?.toFixed(2) || "Free"}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium">Output Resolution</Label>
                      <Select
                        value={bannerData.resolution}
                        onValueChange={(value) => handleInputChange("resolution", value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1080">📱 HD (1920×1080)</SelectItem>
                          <SelectItem value="4k">🖥️ 4K (3840×2160)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="export" className="space-y-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Download className="w-5 h-5" />
                      Export Options
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      onClick={generateBanner}
                      disabled={isGenerating}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      {isGenerating ? "Generating..." : "Generate Preview"}
                    </Button>

                    <Separator />

                    <div>
                      <Label className="text-sm font-medium mb-3 block">Download Formats</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => downloadBanner("png")}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded"></div>
                          PNG
                        </Button>
                        <Button
                          onClick={() => downloadBanner("jpg")}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-green-500 rounded"></div>
                          JPG
                        </Button>
                        <Button
                          onClick={() => downloadBanner("webp")}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-purple-500 rounded"></div>
                          WebP
                        </Button>
                        <Button
                          onClick={() => downloadBanner("pdf")}
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-red-500 rounded"></div>
                          PDF
                        </Button>
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>• PNG: Best for transparency</p>
                      <p>• JPG: Smaller file size</p>
                      <p>• WebP: Modern format</p>
                      <p>• PDF: Print ready</p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Area */}
          <div className="xl:col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Live Preview
                  </span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Crop className="w-3 h-3 mr-1" />
                      Smart Cropped
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {bannerData.resolution === "4k" ? "4K Quality" : "HD Quality"}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center shadow-inner">
                  <div className="text-center text-gray-500">
                    <div className="w-24 h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <Eye className="w-12 h-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Preview Your Banner</h3>
                    <p className="text-sm max-w-md">
                      Upload and crop images using the smart cropping tools, then click "Generate Preview" to see your
                      banner
                    </p>
                    <div className="flex justify-center gap-2 mt-4">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-100"></div>
                      <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-200"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

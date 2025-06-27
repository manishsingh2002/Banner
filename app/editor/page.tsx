"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useBanner } from "@/contexts/banner-context"
import { Edit, Upload, Download, Eye, Settings, Palette } from "lucide-react"

export default function EditorPage() {
  const { bannerData, setBannerData, generateBanner, downloadBanner, isGenerating } = useBanner()

  const handleInputChange = (field: string, value: string) => {
    setBannerData((prev) => ({
      ...prev,
      [field]: value,
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

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Banner Editor</h1>
        <p className="text-gray-600">Create and customize your social media banners</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Controls */}
        <div className="lg:col-span-1">
          <Tabs defaultValue="content" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="w-5 h-5" />
                    Text Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="shopName">Shop/Brand Name</Label>
                    <Input
                      id="shopName"
                      value={bannerData.shopName}
                      onChange={(e) => handleInputChange("shopName", e.target.value)}
                      placeholder="Enter your brand name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={bannerData.productName}
                      onChange={(e) => handleInputChange("productName", e.target.value)}
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={bannerData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Enter description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      value={bannerData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="$99.99"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Images
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Product Image</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload("productImage", file)
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>

                  <div>
                    <Label>Background Image</Label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload("horizontalImage", file)
                      }}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    Theme
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={bannerData.designTheme}
                    onValueChange={(value) => handleInputChange("designTheme", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="social_gallery">Social Gallery</SelectItem>
                      <SelectItem value="instagram_mood">Instagram Mood</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                      <SelectItem value="vibrant">Vibrant</SelectItem>
                      <SelectItem value="elegant_cursive">Elegant Cursive</SelectItem>
                      <SelectItem value="inspirational_vibes">Inspirational Vibes</SelectItem>
                      <SelectItem value="maritime_adventure">Maritime Adventure</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Resolution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={bannerData.resolution}
                    onValueChange={(value) => handleInputChange("resolution", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1080">1080p (1920x1080)</SelectItem>
                      <SelectItem value="4k">4K (3840x2160)</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Export Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={generateBanner} disabled={isGenerating} className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    {isGenerating ? "Generating..." : "Generate Preview"}
                  </Button>

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => downloadBanner("png")} variant="outline" size="sm">
                      PNG
                    </Button>
                    <Button onClick={() => downloadBanner("jpg")} variant="outline" size="sm">
                      JPG
                    </Button>
                    <Button onClick={() => downloadBanner("webp")} variant="outline" size="sm">
                      WebP
                    </Button>
                    <Button onClick={() => downloadBanner("pdf")} variant="outline" size="sm">
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Area */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Eye className="w-12 h-12 mx-auto mb-4" />
                  <p>Click "Generate Preview" to see your banner</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

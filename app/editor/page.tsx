"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon } from "lucide-react"
import { useBanner } from "@/contexts/banner-context"
import { BannerPreview } from "@/components/banner-preview"
import { ImageUploader } from "@/components/image-uploader"

export default function EditorPage() {
  const { bannerData, setBannerData } = useBanner()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Banner Editor</h1>
        <p className="text-gray-600">Create and customize your social media banner</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Editor Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Banner Content
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
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
              <Label htmlFor="description">Product Description</Label>
              <Input
                id="description"
                placeholder="Brief description of your product"
                value={bannerData.description}
                onChange={(e) => setBannerData((prev) => ({ ...prev, description: e.target.value }))}
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

            <ImageUploader label="Product Image" imageKey="productImage" currentImage={bannerData.productImage} />

            <ImageUploader
              label="Main Horizontal Image"
              imageKey="horizontalImage"
              currentImage={bannerData.horizontalImage}
            />

            <div className="space-y-2">
              <Label>Vertical Images (3 images)</Label>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3].map((num) => (
                  <ImageUploader
                    key={num}
                    label={`Image ${num}`}
                    imageKey={`verticalImage${num}` as keyof typeof bannerData}
                    currentImage={bannerData[`verticalImage${num}` as keyof typeof bannerData] as string}
                    compact
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Design Theme</Label>
              <Select
                value={bannerData.designTheme}
                onValueChange={(value: typeof bannerData.designTheme) =>
                  setBannerData((prev) => ({ ...prev, designTheme: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social_gallery">Social Gallery Post</SelectItem>
                  <SelectItem value="instagram_mood">Instagram Mood Board</SelectItem>
                  <SelectItem value="inspirational_vibes">Inspirational Vibes</SelectItem>
                  <SelectItem value="elegant_cursive">Elegant Cursive Accent</SelectItem>
                  <SelectItem value="minimalist">Minimalist Chic</SelectItem>
                  <SelectItem value="vibrant">Vibrant & Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bannerData.designTheme === "inspirational_vibes" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="authorName">Author Name</Label>
                  <Input
                    id="authorName"
                    placeholder="Enter author name"
                    value={bannerData.authorName}
                    onChange={(e) => setBannerData((prev) => ({ ...prev, authorName: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspirationalText">Inspirational Text</Label>
                  <Input
                    id="inspirationalText"
                    placeholder="Enter inspirational message"
                    value={bannerData.inspirationalText}
                    onChange={(e) => setBannerData((prev) => ({ ...prev, inspirationalText: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateText">Date Text</Label>
                  <Input
                    id="dateText"
                    placeholder="Enter month (e.g., January)"
                    value={bannerData.dateText}
                    onChange={(e) => setBannerData((prev) => ({ ...prev, dateText: e.target.value }))}
                  />
                </div>

                <ImageUploader
                  label="Main Inspirational Image"
                  imageKey="inspirationalImage1"
                  currentImage={bannerData.inspirationalImage1}
                />

                <ImageUploader
                  label="Secondary Image (Optional)"
                  imageKey="inspirationalImage2"
                  currentImage={bannerData.inspirationalImage2}
                />
              </>
            )}

            <div className="space-y-2">
              <Label>Download Resolution</Label>
              <Select
                value={bannerData.resolution}
                onValueChange={(value: "1080" | "4k") => setBannerData((prev) => ({ ...prev, resolution: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1080">Standard (1080x1920)</SelectItem>
                  <SelectItem value="4k">4K (2160x3840)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <BannerPreview />
      </div>
    </div>
  )
}

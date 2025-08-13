"use client"

import type React from "react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MultiImageUploader } from "@/components/multi-image-uploader"
import { DragDropZone } from "@/components/drag-drop-zone"
import type { BannerData } from "@/types/banner"
import { Smartphone, Instagram } from "lucide-react"

interface ContentTabProps {
  bannerData: BannerData
  setBannerData: React.Dispatch<React.SetStateAction<BannerData>>
  handleMultiImageUpload: (images: { [key: string]: string | null }) => void
}

export function ContentTab({ bannerData, setBannerData, handleMultiImageUpload }: ContentTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="shopName">Shop Name *</Label>
        <Input
          id="shopName"
          placeholder="Enter your shop name"
          value={bannerData.shopName}
          onChange={(e) => setBannerData((prev) => ({ ...prev, shopName: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="productName">Product Name *</Label>
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
          onValueChange={(
            value:
              | "social_gallery"
              | "instagram_mood"
              | "minimalist"
              | "vibrant"
              | "elegant_cursive"
              | "inspirational_vibes"
              | "maritime_adventure",
          ) => setBannerData((prev) => ({ ...prev, designTheme: value }))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="social_gallery">📱 Social Gallery Post</SelectItem>
            <SelectItem value="instagram_mood">🎨 Instagram Mood Board</SelectItem>
            <SelectItem value="inspirational_vibes">✨ Inspirational Vibes</SelectItem>
            <SelectItem value="elegant_cursive">💫 Elegant Cursive</SelectItem>
            <SelectItem value="minimalist">🤍 Minimalist Chic</SelectItem>
            <SelectItem value="vibrant">🌈 Vibrant & Bold</SelectItem>
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

          <DragDropZone
            label="Main Inspirational Image"
            currentImage={bannerData.inspirationalImage1}
            onFileUpload={(file) => {
              if (file) {
                const reader = new FileReader()
                reader.onload = (e) => {
                  setBannerData((prev) => ({
                    ...prev,
                    inspirationalImage1: e.target?.result as string,
                  }))
                }
                reader.readAsDataURL(file)
              } else {
                setBannerData((prev) => ({ ...prev, inspirationalImage1: null }))
              }
            }}
          />
        </>
      )}

      <div className="space-y-2">
        <Label>Instagram Format</Label>
        <Select
          value={bannerData.resolution}
          onValueChange={(value: "instagram_post" | "instagram_story" | "hd" | "4k") =>
            setBannerData((prev) => ({ ...prev, resolution: value }))
          }
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
  )
}

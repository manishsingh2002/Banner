"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, ImageIcon } from "lucide-react"
import { SocialGalleryPreview } from "./social-gallery-preview"
import { InstagramMoodPreview } from "./instagram-mood-preview"
import { InspirationalVibesPreview } from "./inspirational-vibes-preview"
import { DefaultThemePreview } from "./default-theme-preview"
import type { BannerData, ImageFilters } from "@/types/banner"

interface BannerPreviewProps {
  bannerData: BannerData
  getFilterString: (filters: ImageFilters) => string
}

export function BannerPreview({ bannerData, getFilterString }: BannerPreviewProps) {
  const renderPreviewContent = () => {
    if (!bannerData.shopName && !bannerData.productName) {
      return (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Enter details to see preview</p>
          </div>
        </div>
      )
    }

    switch (bannerData.designTheme) {
      case "instagram_mood":
        return <InstagramMoodPreview bannerData={bannerData} getFilterString={getFilterString} />
      case "social_gallery":
        return <SocialGalleryPreview bannerData={bannerData} getFilterString={getFilterString} />
      case "inspirational_vibes":
        return <InspirationalVibesPreview bannerData={bannerData} getFilterString={getFilterString} />
      default:
        return <DefaultThemePreview bannerData={bannerData} getFilterString={getFilterString} />
    }
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-6 h-6 text-blue-500" />
          Mobile Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative ${
            bannerData.resolution === "instagram_story" ? "aspect-[9/16]" : "aspect-square"
          }`}
        >
          {renderPreviewContent()}
        </div>
      </CardContent>
    </Card>
  )
}

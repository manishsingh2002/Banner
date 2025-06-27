"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useBanner } from "@/contexts/banner-context"
import { ImageIcon } from "lucide-react"

export function BannerPreview() {
  const { bannerData } = useBanner()

  const getFilterString = (filters: any): string => {
    return `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%) hue-rotate(${filters.hueRotate}deg)`
  }

  const themes = {
    social_gallery: {
      background: "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
      shopNameColor: "#1e293b",
      productNameColor: "#64748b",
    },
    instagram_mood: {
      background: "url('/reference-bg.jpg')",
      frameColor: "#ffffff",
      headerTextColor: "#2d5a3d",
    },
    inspirational_vibes: {
      background: "linear-gradient(135deg, #4a90a4, #5ba3b8, #6bb6cc)",
      primaryColor: "#ffffff",
    },
    minimalist: {
      background: "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
      shopNameColor: "#1e293b",
      productNameColor: "#64748b",
    },
    vibrant: {
      background: "linear-gradient(to bottom, #fbbf24, #f59e0b, #d97706)",
      shopNameColor: "#ffffff",
      productNameColor: "#fef3c7",
    },
    elegant_cursive: {
      background: "linear-gradient(to bottom, #fdfbfb, #ebedee)",
      shopNameColor: "#1f2937",
      productNameColor: "#374151",
    },
  }

  const theme = themes[bannerData.designTheme]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="aspect-[9/16] bg-gray-100 rounded-lg overflow-hidden relative">
          {bannerData.shopName || bannerData.productName ? (
            bannerData.designTheme === "instagram_mood" ? (
              <div
                className="w-full h-full relative"
                style={{
                  backgroundImage: "url('/reference-bg.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "blur(2px)",
                }}
              >
                <div className="absolute inset-0 bg-white/10" />
                <div className="absolute inset-4 bg-white rounded-lg p-4 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    {bannerData.shopName && (
                      <h2
                        className="text-lg font-bold text-green-800"
                        style={{ fontFamily: "Dancing Script, cursive" }}
                      >
                        {bannerData.shopName}
                      </h2>
                    )}
                    <div className="text-green-800 text-sm">
                      ++++
                      <br />
                      ++++
                      <br />
                      ++
                    </div>
                  </div>

                  {bannerData.productImage ? (
                    <div className="flex-1 rounded overflow-hidden mb-4">
                      <img
                        src={bannerData.productImage || "/placeholder.svg"}
                        alt="Product"
                        className="w-full h-full object-cover"
                        style={{ filter: getFilterString(bannerData.imageFilters.productImage) }}
                      />
                    </div>
                  ) : (
                    <div className="flex-1 bg-gray-200 rounded flex items-center justify-center mb-4">
                      <span className="text-4xl">📷</span>
                    </div>
                  )}

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="font-bold text-sm text-gray-900">COLOR</p>
                      <p className="font-bold text-sm text-gray-900">PALLET</p>
                      {bannerData.photographer && (
                        <p className="text-xs text-gray-500 mt-1">pict by: {bannerData.photographer}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {["#7a9b8e", "#5a7c6f", "#8fa69a", "#6b8578", "#4a6b5c"].map((color, i) => (
                        <div key={i} className="w-3 h-3" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                </div>

                {(bannerData.productName || bannerData.description) && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-800/90 text-white p-3 rounded-lg text-xs max-w-xs">
                    {bannerData.productName && <p className="font-semibold">product: {bannerData.productName}</p>}
                    {bannerData.description && <p className="mt-1">{bannerData.description}</p>}
                  </div>
                )}
              </div>
            ) : (
              <div
                className="w-full h-full flex flex-col items-center justify-center p-6"
                style={{ background: theme.background }}
              >
                {bannerData.productImage ? (
                  <div className="w-4/5 aspect-square rounded-2xl overflow-hidden shadow-xl mb-6">
                    <img
                      src={bannerData.productImage || "/placeholder.svg"}
                      alt="Product"
                      className="w-full h-full object-cover"
                      style={{ filter: getFilterString(bannerData.imageFilters.productImage) }}
                    />
                  </div>
                ) : (
                  <div className="w-4/5 aspect-square rounded-2xl bg-white/30 flex items-center justify-center mb-6 shadow-xl">
                    <span className="text-6xl">📷</span>
                  </div>
                )}

                {bannerData.shopName && (
                  <h2 className="text-2xl font-bold text-center mb-2" style={{ color: theme.shopNameColor }}>
                    {bannerData.shopName}
                  </h2>
                )}

                {bannerData.productName && (
                  <p className="text-xl text-center leading-tight" style={{ color: theme.productNameColor }}>
                    {bannerData.productName}
                  </p>
                )}
              </div>
            )
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Enter details to see preview</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

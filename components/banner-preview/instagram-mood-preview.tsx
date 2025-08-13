"use client"

import type { BannerData, ImageFilters } from "@/types/banner"

interface InstagramMoodPreviewProps {
  bannerData: BannerData
  getFilterString: (filters: ImageFilters) => string
}

export function InstagramMoodPreview({ bannerData, getFilterString }: InstagramMoodPreviewProps) {
  return (
    <div className="w-full h-full relative bg-white p-4">
      <div className="flex justify-between items-start mb-4">
        {bannerData.shopName && (
          <h2 className="text-lg font-bold text-green-800" style={{ fontFamily: "Dancing Script, cursive" }}>
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
        <div className="flex-1 rounded overflow-hidden mb-4 h-3/5">
          <img
            src={bannerData.productImage || "/placeholder.svg"}
            alt="Product"
            className="w-full h-full object-cover"
            style={{ filter: getFilterString(bannerData.imageFilters.productImage) }}
          />
        </div>
      ) : (
        <div className="flex-1 bg-gray-200 rounded flex items-center justify-center mb-4 h-3/5">
          <span className="text-4xl">📷</span>
        </div>
      )}

      <div className="flex justify-between items-end">
        <div>
          <p className="font-bold text-sm text-gray-900">COLOR</p>
          <p className="font-bold text-sm text-gray-900">PALLET</p>
          {bannerData.photographer && <p className="text-xs text-gray-500 mt-1">pict by: {bannerData.photographer}</p>}
        </div>
        <div className="flex gap-1">
          {["#7a9b8e", "#5a7c6f", "#8fa69a", "#6b8578", "#4a6b5c"].map((color, i) => (
            <div key={i} className="w-3 h-3" style={{ backgroundColor: color }} />
          ))}
        </div>
      </div>

      {(bannerData.productName || bannerData.price) && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-800/90 text-white p-3 rounded-lg text-xs max-w-xs">
          {bannerData.productName && <p className="font-semibold">product: {bannerData.productName}</p>}
          {bannerData.price && <p className="mt-1">${bannerData.price}</p>}
        </div>
      )}
    </div>
  )
}

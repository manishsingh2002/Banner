"use client"

import type { BannerData, ImageFilters } from "@/types/banner"

interface InspirationalVibesPreviewProps {
  bannerData: BannerData
  getFilterString: (filters: ImageFilters) => string
}

export function InspirationalVibesPreview({ bannerData, getFilterString }: InspirationalVibesPreviewProps) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 p-2">
      <div className="h-2/5 p-4 text-white">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <div className="w-16 h-6 bg-white rounded"></div>
            <div className="flex gap-2">
              {["#8bb3c7", "#d4a574", "#c7b299"].map((color, i) => (
                <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
          {bannerData.authorName && <p className="text-sm">{bannerData.authorName}</p>}
        </div>
        <h1 className="text-3xl font-bold mb-2">{bannerData.productName || "Sunday Vibes"}</h1>
        <div className="space-y-1 text-sm">
          <p>Color</p>
          <p>Font</p>
          <p>Poppins</p>
        </div>
        {bannerData.shopName && <p className="text-xs opacity-80 mt-4">Archived By @{bannerData.shopName}</p>}
      </div>
      <div className="bg-white rounded-lg p-3 h-3/5 flex flex-col">
        <div className="bg-blue-300 text-white px-3 py-1 rounded-full text-xs w-fit mb-3">Self Reminder</div>
        {bannerData.inspirationalImage1 ? (
          <div className="flex-1 rounded overflow-hidden mb-3">
            <img
              src={bannerData.inspirationalImage1 || "/placeholder.svg"}
              alt="Inspirational"
              className="w-full h-full object-cover"
              style={{ filter: getFilterString(bannerData.imageFilters.inspirationalImage1) }}
            />
          </div>
        ) : (
          <div className="flex-1 bg-gray-200 rounded flex items-center justify-center mb-3">
            <span className="text-4xl">📷</span>
          </div>
        )}
        <div className="flex justify-between items-start text-sm">
          <div className="flex-1">
            <div className="flex justify-between font-bold mb-2">
              <span>Page</span>
              <span>Today</span>
            </div>
            <div className="w-1/3 h-px bg-gray-400 mx-auto mb-2"></div>
            {bannerData.inspirationalText && (
              <p className="text-xs text-gray-600 leading-relaxed">{bannerData.inspirationalText}</p>
            )}
          </div>
          <div className="ml-4 text-center">
            <div className="bg-gray-500 text-white px-3 py-2 rounded text-lg font-bold">08</div>
            <div className="bg-gray-400 text-white px-2 py-1 rounded text-xs mt-1">
              {bannerData.dateText || "January"}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import type { BannerData, ImageFilters } from "@/types/banner"

interface SocialGalleryPreviewProps {
  bannerData: BannerData
  getFilterString: (filters: ImageFilters) => string
}

export function SocialGalleryPreview({ bannerData, getFilterString }: SocialGalleryPreviewProps) {
  return (
    <div className="w-full h-full bg-gradient-to-b from-slate-50 to-slate-200 p-2">
      <div className="bg-white rounded-lg shadow-lg p-3 h-full flex flex-col">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-slate-800 via-slate-600 to-slate-800 rounded-lg p-3 mb-3 relative">
          <div className="absolute top-2 left-4 w-12 h-0.5 bg-yellow-400"></div>
          <div className="absolute bottom-2 right-4 w-12 h-0.5 bg-yellow-400"></div>
          <div className="absolute top-2 left-6 w-1 h-1 bg-yellow-400 rounded-full"></div>
          <div className="absolute bottom-2 right-6 w-1 h-1 bg-yellow-400 rounded-full"></div>
          <h1
            className="text-white text-center font-bold text-lg"
            style={{ fontFamily: "Dancing Script, cursive", textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            {bannerData.shopName || "Premium Shop"}
          </h1>
        </div>

        {/* Main horizontal image */}
        {bannerData.horizontalImage ? (
          <div className="flex-1 rounded-lg overflow-hidden mb-2 border border-slate-200">
            <img
              src={bannerData.horizontalImage || "/placeholder.svg"}
              alt="Horizontal"
              className="w-full h-full object-cover"
              style={{ filter: getFilterString(bannerData.imageFilters.horizontalImage) }}
            />
          </div>
        ) : (
          <div className="flex-1 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center mb-2">
            <span className="text-2xl">📷</span>
          </div>
        )}

        {/* Three vertical images */}
        <div className="grid grid-cols-3 gap-1 mb-3" style={{ height: "30%" }}>
          {[bannerData.verticalImage1, bannerData.verticalImage2, bannerData.verticalImage3].map((image, index) => (
            <div key={index} className="rounded-md overflow-hidden">
              {image ? (
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Vertical ${index + 1}`}
                  className="w-full h-full object-cover border border-slate-200"
                  style={{
                    filter: getFilterString(
                      bannerData.imageFilters[`verticalImage${index + 1}` as keyof typeof bannerData.imageFilters],
                    ),
                  }}
                />
              ) : (
                <div className="w-full h-full border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center">
                  <span className="text-lg">📷</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Compact text content */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            {bannerData.productName && <h3 className="text-slate-800 font-bold text-base">{bannerData.productName}</h3>}
            {bannerData.price && <span className="text-green-600 font-bold text-base">${bannerData.price}</span>}
          </div>

          <div className="border-t border-yellow-400 pt-1 flex justify-center text-xs text-gray-500 italic">
            <span style={{ fontFamily: "Dancing Script, cursive" }}>✨ {bannerData.shopName || "Premium Shop"} ✨</span>
          </div>
        </div>
      </div>
    </div>
  )
}

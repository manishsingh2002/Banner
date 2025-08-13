"use client"

import type { BannerData, ImageFilters } from "@/types/banner"

interface DefaultThemePreviewProps {
  bannerData: BannerData
  getFilterString: (filters: ImageFilters) => string
}

export function DefaultThemePreview({ bannerData, getFilterString }: DefaultThemePreviewProps) {
  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center p-4"
      style={{
        background:
          bannerData.designTheme === "vibrant"
            ? "linear-gradient(to bottom, #fbbf24, #f59e0b, #d97706)"
            : bannerData.designTheme === "minimalist"
              ? "linear-gradient(to bottom, #f8fafc, #e2e8f0)"
              : "linear-gradient(to bottom, #fdfbfb, #ebedee)",
      }}
    >
      {bannerData.productImage ? (
        <div className="w-5/6 aspect-square rounded-2xl overflow-hidden shadow-xl mb-4">
          <img
            src={bannerData.productImage || "/placeholder.svg"}
            alt="Product"
            className="w-full h-full object-cover"
            style={{ filter: getFilterString(bannerData.imageFilters.productImage) }}
          />
        </div>
      ) : (
        <div className="w-5/6 aspect-square rounded-2xl bg-white/30 flex items-center justify-center mb-4 shadow-xl">
          <span className="text-6xl">📷</span>
        </div>
      )}

      <div className="text-center space-y-1">
        {bannerData.shopName && (
          <h2
            className="text-xl font-bold"
            style={{
              color:
                bannerData.designTheme === "vibrant"
                  ? "#ffffff"
                  : bannerData.designTheme === "minimalist"
                    ? "#1e293b"
                    : "#1f2937",
            }}
          >
            {bannerData.shopName}
          </h2>
        )}

        {bannerData.productName && (
          <p
            className="text-lg leading-tight"
            style={{
              color:
                bannerData.designTheme === "vibrant"
                  ? "#fef3c7"
                  : bannerData.designTheme === "minimalist"
                    ? "#64748b"
                    : "#374151",
            }}
          >
            {bannerData.productName}
          </p>
        )}

        {bannerData.price && (
          <p
            className="text-lg font-bold"
            style={{
              color:
                bannerData.designTheme === "vibrant"
                  ? "#ffffff"
                  : bannerData.designTheme === "minimalist"
                    ? "#059669"
                    : "#8b5cf6",
            }}
          >
            ${bannerData.price}
          </p>
        )}

        {bannerData.designTheme === "elegant_cursive" && <div className="w-2/5 h-0.5 mt-2 bg-purple-500 mx-auto" />}
      </div>
    </div>
  )
}

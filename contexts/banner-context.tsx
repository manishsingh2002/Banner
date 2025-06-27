"use client"

import type React from "react"
import { createContext, useContext, useState, useRef } from "react"

export interface ImageFilters {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  sepia: number
  grayscale: number
  hueRotate: number
  hdr: number
  vignette: number
  filmGrain: number
  textureType: string
  textureIntensity: number
  textureBlendMode: string
  preset: string
}

export interface TextStyles {
  shopNameFont: string
  shopNameSize: number
  productNameFont: string
  productNameSize: number
  descriptionFont: string
  descriptionSize: number
  priceFont: string
  priceSize: number
  inspirationalTextFont: string
  inspirationalTextSize: number
  authorNameFont: string
  authorNameSize: number
  dateTextFont: string
  dateTextSize: number
}

export interface BannerData {
  shopName: string
  productName: string
  productImage: string | null
  horizontalImage: string | null
  verticalImage1: string | null
  verticalImage2: string | null
  verticalImage3: string | null
  inspirationalImage1: string | null
  inspirationalImage2: string | null
  resolution: "1080" | "4k"
  designTheme:
    | "social_gallery"
    | "instagram_mood"
    | "minimalist"
    | "vibrant"
    | "elegant_cursive"
    | "inspirational_vibes"
  description: string
  photographer: string
  price: string
  inspirationalText: string
  authorName: string
  dateText: string
  textStyles: TextStyles
  imageFilters: {
    productImage: ImageFilters
    horizontalImage: ImageFilters
    verticalImage1: ImageFilters
    verticalImage2: ImageFilters
    verticalImage3: ImageFilters
    inspirationalImage1: ImageFilters
    inspirationalImage2: ImageFilters
  }
}

interface BannerContextType {
  bannerData: BannerData
  setBannerData: React.Dispatch<React.SetStateAction<BannerData>>
  canvasRef: React.RefObject<HTMLCanvasElement>
  generateBanner: () => Promise<void>
  downloadBanner: (format?: string) => void
  isGenerating: boolean
  loadedImages: { [key: string]: HTMLImageElement }
  setLoadedImages: React.Dispatch<React.SetStateAction<{ [key: string]: HTMLImageElement }>>
}

const defaultFilters: ImageFilters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  sepia: 0,
  grayscale: 0,
  hueRotate: 0,
  hdr: 0,
  vignette: 0,
  filmGrain: 0,
  textureType: "none",
  textureIntensity: 0,
  textureBlendMode: "overlay",
  preset: "none",
}

const defaultTextStyles: TextStyles = {
  shopNameFont: "Inter",
  shopNameSize: 36,
  productNameFont: "Inter",
  productNameSize: 34,
  descriptionFont: "Inter",
  descriptionSize: 18,
  priceFont: "Inter",
  priceSize: 24,
  inspirationalTextFont: "Inter",
  inspirationalTextSize: 16,
  authorNameFont: "Inter",
  authorNameSize: 20,
  dateTextFont: "Inter",
  dateTextSize: 16,
}

const BannerContext = createContext<BannerContextType | undefined>(undefined)

export function BannerProvider({ children }: { children: React.ReactNode }) {
  const [bannerData, setBannerData] = useState<BannerData>({
    shopName: "",
    productName: "",
    productImage: null,
    horizontalImage: null,
    verticalImage1: null,
    verticalImage2: null,
    verticalImage3: null,
    inspirationalImage1: null,
    inspirationalImage2: null,
    resolution: "1080",
    designTheme: "social_gallery",
    description: "",
    photographer: "",
    price: "",
    inspirationalText: "",
    authorName: "",
    dateText: "",
    textStyles: { ...defaultTextStyles },
    imageFilters: {
      productImage: { ...defaultFilters },
      horizontalImage: { ...defaultFilters },
      verticalImage1: { ...defaultFilters },
      verticalImage2: { ...defaultFilters },
      verticalImage3: { ...defaultFilters },
      inspirationalImage1: { ...defaultFilters },
      inspirationalImage2: { ...defaultFilters },
    },
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: HTMLImageElement }>({})
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateBanner = async () => {
    // Implementation will be moved to a separate utility
    console.log("Generate banner called")
  }

  const downloadBanner = (format = "png") => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    let mimeType: string
    let quality = 1.0

    switch (format.toLowerCase()) {
      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg"
        quality = 0.95
        break
      case "webp":
        mimeType = "image/webp"
        quality = 0.95
        break
      case "png":
      default:
        mimeType = "image/png"
        quality = 1.0
        break
    }

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const a = document.createElement("a")
          a.href = url
          a.download = `${bannerData.shopName || "social-banner"}-${bannerData.resolution}.${format}`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }
      },
      mimeType,
      quality,
    )
  }

  return (
    <BannerContext.Provider
      value={{
        bannerData,
        setBannerData,
        canvasRef,
        generateBanner,
        downloadBanner,
        isGenerating,
        loadedImages,
        setLoadedImages,
      }}
    >
      {children}
      <canvas ref={canvasRef} className="hidden" />
    </BannerContext.Provider>
  )
}

export function useBanner() {
  const context = useContext(BannerContext)
  if (context === undefined) {
    throw new Error("useBanner must be used within a BannerProvider")
  }
  return context
}

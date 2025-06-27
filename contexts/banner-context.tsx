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
    | "maritime_adventure"
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
    if (!canvasRef.current) return

    setIsGenerating(true)
    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions based on resolution
      const width = bannerData.resolution === "4k" ? 3840 : 1920
      const height = bannerData.resolution === "4k" ? 2160 : 1080

      canvas.width = width
      canvas.height = height

      // Clear canvas
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      // Generate banner based on theme
      await renderBannerTheme(ctx, width, height)
    } catch (error) {
      console.error("Error generating banner:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderBannerTheme = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    switch (bannerData.designTheme) {
      case "maritime_adventure":
        await renderMaritimeAdventure(ctx, width, height)
        break
      default:
        await renderDefaultTheme(ctx, width, height)
        break
    }
  }

  const renderMaritimeAdventure = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#4A90A4")
    gradient.addColorStop(1, "#2C5F6F")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw images if available
    if (bannerData.horizontalImage && loadedImages[bannerData.horizontalImage]) {
      const img = loadedImages[bannerData.horizontalImage]
      ctx.drawImage(img, width * 0.1, height * 0.1, width * 0.8, height * 0.4)
    }

    if (bannerData.verticalImage1 && loadedImages[bannerData.verticalImage1]) {
      const img = loadedImages[bannerData.verticalImage1]
      ctx.drawImage(img, width * 0.1, height * 0.55, width * 0.8, height * 0.3)
    }

    // Text styling
    ctx.fillStyle = "#FFFFFF"
    ctx.font = `bold ${bannerData.textStyles.shopNameSize}px ${bannerData.textStyles.shopNameFont}`
    ctx.textAlign = "center"

    // Main title
    if (bannerData.shopName) {
      ctx.fillText(bannerData.shopName, width * 0.7, height * 0.75)
    }

    // Subtitle
    ctx.font = `${bannerData.textStyles.productNameSize}px ${bannerData.textStyles.productNameFont}`
    if (bannerData.productName) {
      ctx.fillText(bannerData.productName, width * 0.7, height * 0.82)
    }

    // Description
    ctx.font = `${bannerData.textStyles.descriptionSize}px ${bannerData.textStyles.descriptionFont}`
    if (bannerData.description) {
      const words = bannerData.description.split(" ")
      let line = ""
      let y = height * 0.9

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " "
        const metrics = ctx.measureText(testLine)
        const testWidth = metrics.width

        if (testWidth > width * 0.4 && n > 0) {
          ctx.fillText(line, width * 0.7, y)
          line = words[n] + " "
          y += bannerData.textStyles.descriptionSize + 5
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, width * 0.7, y)
    }
  }

  const renderDefaultTheme = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Simple default rendering
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "#333333"
    ctx.font = "48px Inter"
    ctx.textAlign = "center"
    ctx.fillText("Social Banner", width / 2, height / 2)
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

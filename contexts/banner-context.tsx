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
  resolution: "instagram_post" | "instagram_story" | "hd" | "4k"
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
    resolution: "instagram_post",
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

  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => resolve(img)
      img.onerror = reject
      img.src = src
    })
  }

  // Get optimal dimensions for different platforms
  const getCanvasDimensions = (resolution: string) => {
    switch (resolution) {
      case "instagram_post":
        return { width: 1080, height: 1080 } // Perfect Instagram square
      case "instagram_story":
        return { width: 1080, height: 1920 } // Instagram Story 9:16
      case "hd":
        return { width: 1920, height: 1080 } // Standard HD
      case "4k":
        return { width: 3840, height: 2160 } // 4K resolution
      default:
        return { width: 1080, height: 1080 }
    }
  }

  const generateBanner = async () => {
    if (!canvasRef.current) return

    setIsGenerating(true)
    try {
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions based on resolution
      const dimensions = getCanvasDimensions(bannerData.resolution)
      canvas.width = dimensions.width
      canvas.height = dimensions.height

      // Enable high-quality rendering
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      // Clear canvas with white background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Load all images first
      const imagePromises: Promise<void>[] = []
      const imagesToLoad = [
        bannerData.productImage,
        bannerData.horizontalImage,
        bannerData.verticalImage1,
        bannerData.verticalImage2,
        bannerData.verticalImage3,
        bannerData.inspirationalImage1,
        bannerData.inspirationalImage2,
      ].filter(Boolean) as string[]

      for (const imageSrc of imagesToLoad) {
        if (!loadedImages[imageSrc]) {
          imagePromises.push(
            loadImage(imageSrc).then((img) => {
              setLoadedImages((prev) => ({ ...prev, [imageSrc]: img }))
            }),
          )
        }
      }

      await Promise.all(imagePromises)

      // Generate banner based on theme
      await renderBannerTheme(ctx, dimensions.width, dimensions.height)
    } catch (error) {
      console.error("Error generating banner:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderBannerTheme = async (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Calculate scale factor for responsive text and elements
    const baseWidth = 1080
    const scale = width / baseWidth

    switch (bannerData.designTheme) {
      case "maritime_adventure":
        await renderMaritimeAdventure(ctx, width, height, scale)
        break
      case "social_gallery":
        await renderSocialGallery(ctx, width, height, scale)
        break
      case "instagram_mood":
        await renderInstagramMood(ctx, width, height, scale)
        break
      case "minimalist":
        await renderMinimalist(ctx, width, height, scale)
        break
      case "vibrant":
        await renderVibrant(ctx, width, height, scale)
        break
      case "elegant_cursive":
        await renderElegantCursive(ctx, width, height, scale)
        break
      case "inspirational_vibes":
        await renderInspirationalVibes(ctx, width, height, scale)
        break
      default:
        await renderDefaultTheme(ctx, width, height, scale)
        break
    }
  }

  const applyImageFilters = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    x: number,
    y: number,
    width: number,
    height: number,
    filters: ImageFilters,
  ) => {
    // Create filter string
    let filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%)`

    if (filters.blur > 0) filterString += ` blur(${filters.blur}px)`
    if (filters.sepia > 0) filterString += ` sepia(${filters.sepia}%)`
    if (filters.grayscale > 0) filterString += ` grayscale(${filters.grayscale}%)`
    if (filters.hueRotate !== 0) filterString += ` hue-rotate(${filters.hueRotate}deg)`

    // Apply filters and draw image
    ctx.save()
    ctx.filter = filterString
    ctx.drawImage(img, x, y, width, height)
    ctx.restore()

    // Apply advanced effects
    if (filters.hdr > 0) {
      ctx.save()
      ctx.globalCompositeOperation = "overlay"
      ctx.globalAlpha = filters.hdr / 100
      ctx.drawImage(img, x, y, width, height)
      ctx.restore()
    }

    if (filters.vignette > 0) {
      const gradient = ctx.createRadialGradient(
        x + width / 2,
        y + height / 2,
        0,
        x + width / 2,
        y + height / 2,
        Math.max(width, height) / 2,
      )
      gradient.addColorStop(0, "transparent")
      gradient.addColorStop(1, `rgba(0, 0, 0, ${filters.vignette / 100})`)
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, width, height)
    }

    if (filters.filmGrain > 0) {
      // Add film grain effect
      const grainCanvas = document.createElement("canvas")
      const grainCtx = grainCanvas.getContext("2d")!
      grainCanvas.width = width
      grainCanvas.height = height

      const imageData = grainCtx.createImageData(width, height)
      for (let i = 0; i < imageData.data.length; i += 4) {
        const grain = (Math.random() - 0.5) * filters.filmGrain * 2
        imageData.data[i] = 128 + grain
        imageData.data[i + 1] = 128 + grain
        imageData.data[i + 2] = 128 + grain
        imageData.data[i + 3] = Math.abs(grain) * 2
      }
      grainCtx.putImageData(imageData, 0, 0)

      ctx.save()
      ctx.globalCompositeOperation = "overlay"
      ctx.globalAlpha = 0.3
      ctx.drawImage(grainCanvas, x, y)
      ctx.restore()
    }
  }

  const renderSocialGallery = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#f8fafc")
    gradient.addColorStop(1, "#e2e8f0")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Main container with proper mobile optimization
    const margin = 40 * scale
    const containerWidth = width - margin * 2
    const containerHeight = height - margin * 2
    const containerX = margin
    const containerY = margin

    // White background container
    ctx.fillStyle = "#ffffff"
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
    ctx.shadowBlur = 20 * scale
    ctx.shadowOffsetY = 5 * scale
    ctx.beginPath()
    ctx.roundRect(containerX, containerY, containerWidth, containerHeight, 20 * scale)
    ctx.fill()
    ctx.shadowColor = "transparent"

    // Header section
    const headerHeight = 80 * scale
    const headerY = containerY + 20 * scale

    ctx.fillStyle = "#1e293b"
    ctx.beginPath()
    ctx.roundRect(containerX + 20 * scale, headerY, containerWidth - 40 * scale, headerHeight, 15 * scale)
    ctx.fill()

    // Shop name in header
    if (bannerData.shopName) {
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${bannerData.textStyles.shopNameSize * scale}px ${bannerData.textStyles.shopNameFont}`
      ctx.textAlign = "center"
      ctx.fillText(bannerData.shopName, containerX + containerWidth / 2, headerY + headerHeight / 2 + 12 * scale)
    }

    // Main image section
    const mainImageY = headerY + headerHeight + 25 * scale
    const mainImageHeight = containerHeight * 0.45
    const mainImageWidth = containerWidth - 50 * scale
    const mainImageX = containerX + 25 * scale

    if (bannerData.horizontalImage && loadedImages[bannerData.horizontalImage]) {
      const img = loadedImages[bannerData.horizontalImage]
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(mainImageX, mainImageY, mainImageWidth, mainImageHeight, 15 * scale)
      ctx.clip()
      applyImageFilters(
        ctx,
        img,
        mainImageX,
        mainImageY,
        mainImageWidth,
        mainImageHeight,
        bannerData.imageFilters.horizontalImage,
      )
      ctx.restore()
    }

    // Three vertical images
    const verticalImagesY = mainImageY + mainImageHeight + 20 * scale
    const verticalImageHeight = containerHeight * 0.22
    const verticalImageWidth = (mainImageWidth - 20 * scale) / 3

    const verticalImages = [bannerData.verticalImage1, bannerData.verticalImage2, bannerData.verticalImage3]
    const verticalFilters = [
      bannerData.imageFilters.verticalImage1,
      bannerData.imageFilters.verticalImage2,
      bannerData.imageFilters.verticalImage3,
    ]

    for (let i = 0; i < verticalImages.length; i++) {
      const imageSrc = verticalImages[i]
      const imageX = mainImageX + i * (verticalImageWidth + 10 * scale)

      if (imageSrc && loadedImages[imageSrc]) {
        const img = loadedImages[imageSrc]
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(imageX, verticalImagesY, verticalImageWidth, verticalImageHeight, 12 * scale)
        ctx.clip()
        applyImageFilters(
          ctx,
          img,
          imageX,
          verticalImagesY,
          verticalImageWidth,
          verticalImageHeight,
          verticalFilters[i],
        )
        ctx.restore()
      }
    }

    // Text content
    const textStartY = verticalImagesY + verticalImageHeight + 30 * scale

    if (bannerData.productName) {
      ctx.fillStyle = "#1e293b"
      ctx.font = `bold ${bannerData.textStyles.productNameSize * scale}px ${bannerData.textStyles.productNameFont}`
      ctx.textAlign = "left"
      ctx.fillText(bannerData.productName, containerX + 25 * scale, textStartY)
    }

    if (bannerData.description) {
      ctx.fillStyle = "#374151"
      ctx.font = `${bannerData.textStyles.descriptionSize * scale}px ${bannerData.textStyles.descriptionFont}`
      ctx.textAlign = "left"

      // Word wrap for description
      const maxWidth = containerWidth - 50 * scale
      const words = bannerData.description.split(" ")
      let line = ""
      let y = textStartY + 35 * scale
      const lineHeight = 25 * scale

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " "
        const metrics = ctx.measureText(testLine)

        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, containerX + 25 * scale, y)
          line = words[n] + " "
          y += lineHeight
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, containerX + 25 * scale, y)
    }

    // Price at bottom
    if (bannerData.price) {
      const footerY = containerY + containerHeight - 35 * scale
      ctx.fillStyle = "#fbbf24"
      ctx.font = `bold ${bannerData.textStyles.priceSize * scale}px ${bannerData.textStyles.priceFont}`
      ctx.textAlign = "center"
      ctx.fillText(`$${bannerData.price}`, containerX + containerWidth / 2, footerY)
    }
  }

  const renderInstagramMood = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    // Optimized for Instagram square format
    const frameMargin = 60 * scale
    const frameWidth = width - frameMargin * 2
    const frameHeight = height * 0.85
    const frameX = frameMargin
    const frameY = (height - frameHeight) / 2

    // White frame background
    ctx.fillStyle = "#ffffff"
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)"
    ctx.shadowBlur = 25 * scale
    ctx.shadowOffsetY = 8 * scale
    ctx.beginPath()
    ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 20 * scale)
    ctx.fill()
    ctx.shadowColor = "transparent"

    // Header with shop name
    if (bannerData.shopName) {
      ctx.fillStyle = "#2d5a3d"
      ctx.font = `${Math.min(48 * scale, frameWidth / 8)}px Dancing Script, cursive`
      ctx.textAlign = "left"
      ctx.fillText(bannerData.shopName, frameX + 30 * scale, frameY + 60 * scale)
    }

    // Plus decoration
    ctx.fillStyle = "#2d5a3d"
    ctx.font = `${20 * scale}px Inter, sans-serif`
    ctx.textAlign = "right"
    const plusX = frameX + frameWidth - 30 * scale
    const plusY = frameY + 40 * scale
    for (let i = 0; i < 4; i++) {
      ctx.fillText("+", plusX - (i % 2) * 15 * scale, plusY + Math.floor(i / 2) * 20 * scale)
    }

    // Main product image
    if (bannerData.productImage && loadedImages[bannerData.productImage]) {
      const img = loadedImages[bannerData.productImage]
      const imageMargin = 30 * scale
      const imageWidth = frameWidth - imageMargin * 2
      const imageHeight = frameHeight * 0.6
      const imageX = frameX + imageMargin
      const imageY = frameY + 90 * scale

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 15 * scale)
      ctx.clip()
      applyImageFilters(ctx, img, imageX, imageY, imageWidth, imageHeight, bannerData.imageFilters.productImage)
      ctx.restore()
    }

    // Color palette
    const paletteY = frameY + frameHeight - 80 * scale
    const colors = ["#7a9b8e", "#5a7c6f", "#8fa69a", "#6b8578", "#4a6b5c"]
    const swatchSize = 15 * scale
    const paletteX = frameX + 30 * scale

    ctx.fillStyle = "#2d5a3d"
    ctx.font = `bold ${12 * scale}px Inter, sans-serif`
    ctx.textAlign = "left"
    ctx.fillText("COLOR PALLET", paletteX, paletteY - 10 * scale)

    colors.forEach((color, index) => {
      ctx.fillStyle = color
      ctx.fillRect(paletteX + index * (swatchSize + 5 * scale), paletteY, swatchSize, swatchSize)
    })

    // Product info
    if (bannerData.productName || bannerData.description) {
      const infoY = frameY + frameHeight - 40 * scale
      ctx.fillStyle = "rgba(45, 90, 61, 0.9)"
      ctx.beginPath()
      ctx.roundRect(frameX + frameWidth - 200 * scale, infoY - 25 * scale, 180 * scale, 50 * scale, 10 * scale)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = `${10 * scale}px Inter, sans-serif`
      ctx.textAlign = "left"
      if (bannerData.productName) {
        ctx.fillText(`product: ${bannerData.productName}`, frameX + frameWidth - 190 * scale, infoY - 10 * scale)
      }
      if (bannerData.description) {
        ctx.fillText(
          bannerData.description.substring(0, 30) + "...",
          frameX + frameWidth - 190 * scale,
          infoY + 5 * scale,
        )
      }
    }
  }

  const renderInspirationalVibes = async (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scale: number,
  ) => {
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#4a90a4")
    gradient.addColorStop(0.5, "#5ba3b8")
    gradient.addColorStop(1, "#6bb6cc")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Top section
    const topHeight = height * 0.4

    // Author name
    if (bannerData.authorName) {
      ctx.fillStyle = "#ffffff"
      ctx.font = `${bannerData.textStyles.authorNameSize * scale}px ${bannerData.textStyles.authorNameFont}`
      ctx.textAlign = "right"
      ctx.fillText(bannerData.authorName, width - 40 * scale, 60 * scale)
    }

    // Main title
    if (bannerData.productName) {
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${Math.min(bannerData.textStyles.productNameSize * scale, width / 10)}px ${bannerData.textStyles.productNameFont}`
      ctx.textAlign = "left"
      ctx.fillText(bannerData.productName, 40 * scale, topHeight - 60 * scale)
    }

    // Bottom card
    const cardY = topHeight
    const cardHeight = height - topHeight - 40 * scale
    const cardMargin = 30 * scale

    ctx.fillStyle = "#ffffff"
    ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
    ctx.shadowBlur = 30 * scale
    ctx.shadowOffsetY = 10 * scale
    ctx.beginPath()
    ctx.roundRect(cardMargin, cardY, width - cardMargin * 2, cardHeight, 25 * scale)
    ctx.fill()
    ctx.shadowColor = "transparent"

    // Main inspirational image
    if (bannerData.inspirationalImage1 && loadedImages[bannerData.inspirationalImage1]) {
      const img = loadedImages[bannerData.inspirationalImage1]
      const imageMargin = 50 * scale
      const imageWidth = width - cardMargin * 2 - imageMargin * 2
      const imageHeight = cardHeight * 0.5
      const imageX = cardMargin + imageMargin
      const imageY = cardY + 60 * scale

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 20 * scale)
      ctx.clip()
      applyImageFilters(ctx, img, imageX, imageY, imageWidth, imageHeight, bannerData.imageFilters.inspirationalImage1)
      ctx.restore()
    }

    // Inspirational text
    if (bannerData.inspirationalText) {
      const textY = cardY + cardHeight * 0.65
      ctx.fillStyle = "#374151"
      ctx.font = `${bannerData.textStyles.inspirationalTextSize * scale}px ${bannerData.textStyles.inspirationalTextFont}`
      ctx.textAlign = "left"

      const maxWidth = width * 0.7
      const words = bannerData.inspirationalText.split(" ")
      let line = ""
      let y = textY
      const lineHeight = 25 * scale

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " "
        const metrics = ctx.measureText(testLine)

        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, 60 * scale, y)
          line = words[n] + " "
          y += lineHeight
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, 60 * scale, y)
    }
  }

  const renderMinimalist = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    // Clean white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    // Single centered image
    if (bannerData.productImage && loadedImages[bannerData.productImage]) {
      const img = loadedImages[bannerData.productImage]
      const imageSize = Math.min(width, height) * 0.6
      const imageX = (width - imageSize) / 2
      const imageY = (height - imageSize) / 2 - height * 0.1

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imageX, imageY, imageSize, imageSize, 20 * scale)
      ctx.clip()
      applyImageFilters(ctx, img, imageX, imageY, imageSize, imageSize, bannerData.imageFilters.productImage)
      ctx.restore()
    }

    // Minimal text
    ctx.fillStyle = "#1e293b"
    ctx.font = `300 ${bannerData.textStyles.shopNameSize * scale}px ${bannerData.textStyles.shopNameFont}`
    ctx.textAlign = "center"

    if (bannerData.shopName) {
      ctx.fillText(bannerData.shopName, width / 2, height * 0.8)
    }

    if (bannerData.productName) {
      ctx.font = `400 ${bannerData.textStyles.productNameSize * scale}px ${bannerData.textStyles.productNameFont}`
      ctx.fillStyle = "#64748b"
      ctx.fillText(bannerData.productName, width / 2, height * 0.85)
    }
  }

  const renderVibrant = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    // Vibrant gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#fbbf24")
    gradient.addColorStop(0.5, "#f59e0b")
    gradient.addColorStop(1, "#d97706")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Product image with vibrant border
    if (bannerData.productImage && loadedImages[bannerData.productImage]) {
      const img = loadedImages[bannerData.productImage]
      const imageSize = Math.min(width, height) * 0.6
      const imageX = (width - imageSize) / 2
      const imageY = height * 0.15
      const borderWidth = 10 * scale

      // Colorful border
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.roundRect(
        imageX - borderWidth,
        imageY - borderWidth,
        imageSize + borderWidth * 2,
        imageSize + borderWidth * 2,
        25 * scale,
      )
      ctx.fill()

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imageX, imageY, imageSize, imageSize, 20 * scale)
      ctx.clip()
      applyImageFilters(ctx, img, imageX, imageY, imageSize, imageSize, bannerData.imageFilters.productImage)
      ctx.restore()
    }

    // Bold text
    ctx.fillStyle = "#ffffff"
    ctx.font = `bold ${bannerData.textStyles.shopNameSize * scale}px ${bannerData.textStyles.shopNameFont}`
    ctx.textAlign = "center"

    if (bannerData.shopName) {
      // Add text shadow for better readability
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 5 * scale
      ctx.shadowOffsetY = 2 * scale
      ctx.fillText(bannerData.shopName, width / 2, height * 0.8)
      ctx.shadowColor = "transparent"
    }

    if (bannerData.productName) {
      ctx.fillStyle = "#fef3c7"
      ctx.font = `${bannerData.textStyles.productNameSize * scale}px ${bannerData.textStyles.productNameFont}`
      ctx.fillText(bannerData.productName, width / 2, height * 0.85)
    }
  }

  const renderElegantCursive = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    // Elegant gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#fdfbfb")
    gradient.addColorStop(1, "#ebedee")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Product image with elegant frame
    if (bannerData.productImage && loadedImages[bannerData.productImage]) {
      const img = loadedImages[bannerData.productImage]
      const imageSize = Math.min(width, height) * 0.5
      const imageX = (width - imageSize) / 2
      const imageY = height * 0.2
      const frameWidth = 15 * scale

      // Elegant frame
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 3 * scale
      ctx.beginPath()
      ctx.roundRect(
        imageX - frameWidth,
        imageY - frameWidth,
        imageSize + frameWidth * 2,
        imageSize + frameWidth * 2,
        10 * scale,
      )
      ctx.stroke()

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imageX, imageY, imageSize, imageSize, 5 * scale)
      ctx.clip()
      applyImageFilters(ctx, img, imageX, imageY, imageSize, imageSize, bannerData.imageFilters.productImage)
      ctx.restore()
    }

    // Elegant typography
    ctx.fillStyle = "#1f2937"
    ctx.font = `${bannerData.textStyles.shopNameSize * scale}px ${bannerData.textStyles.shopNameFont}`
    ctx.textAlign = "center"

    if (bannerData.shopName) {
      ctx.fillText(bannerData.shopName, width / 2, height * 0.8)
    }

    if (bannerData.productName) {
      ctx.font = `italic ${bannerData.textStyles.productNameSize * scale}px Dancing Script, cursive`
      ctx.fillStyle = "#374151"
      ctx.fillText(bannerData.productName, width / 2, height * 0.85)
    }
  }

  const renderMaritimeAdventure = async (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scale: number,
  ) => {
    // Ocean gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#4A90A4")
    gradient.addColorStop(1, "#2C5F6F")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Maritime elements and images
    if (bannerData.horizontalImage && loadedImages[bannerData.horizontalImage]) {
      const img = loadedImages[bannerData.horizontalImage]
      const imageWidth = width * 0.8
      const imageHeight = height * 0.4
      const imageX = (width - imageWidth) / 2
      const imageY = height * 0.1

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 20 * scale)
      ctx.clip()
      applyImageFilters(ctx, img, imageX, imageY, imageWidth, imageHeight, bannerData.imageFilters.horizontalImage)
      ctx.restore()
    }

    // Maritime text styling
    ctx.fillStyle = "#ffffff"
    ctx.font = `bold ${bannerData.textStyles.shopNameSize * scale}px ${bannerData.textStyles.shopNameFont}`
    ctx.textAlign = "center"

    if (bannerData.shopName) {
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 8 * scale
      ctx.shadowOffsetY = 3 * scale
      ctx.fillText(bannerData.shopName, width / 2, height * 0.7)
      ctx.shadowColor = "transparent"
    }

    if (bannerData.productName) {
      ctx.font = `${bannerData.textStyles.productNameSize * scale}px ${bannerData.textStyles.productNameFont}`
      ctx.fillText(bannerData.productName, width / 2, height * 0.8)
    }
  }

  const renderDefaultTheme = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    // Simple default rendering
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "#333333"
    ctx.font = `${48 * scale}px Inter`
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
        quality = 0.98 // Very high quality for mobile
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

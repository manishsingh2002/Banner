"use client"

import { Badge } from "@/components/ui/badge"
import { DragDropZone } from "@/components/drag-drop-zone"
import { MultiImageUploader } from "@/components/multi-image-uploader"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ImageIcon, Palette, Sliders, Smartphone, Instagram } from "lucide-react"
import { Layers, Type, Anchor, Sparkles } from "lucide-react"
import Link from "next/link"
import { useBanner } from "@/contexts/banner-context"
import { Layout, Filter, MousePointer } from "lucide-react"

interface ImageFilters {
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

interface TextStyles {
  shopNameFont: string
  shopNameSize: number
  productNameFont: string
  productNameSize: number
  priceFont: string
  priceSize: number
  inspirationalTextFont: string
  inspirationalTextSize: number
  authorNameFont: string
  authorNameSize: number
  dateTextFont: string
  dateTextSize: number
}

interface BannerData {
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
  priceFont: "Inter",
  priceSize: 24,
  inspirationalTextFont: "Inter",
  inspirationalTextSize: 16,
  authorNameFont: "Inter",
  authorNameSize: 20,
  dateTextFont: "Inter",
  dateTextSize: 16,
}

const fontOptions = {
  Inter: "Inter, sans-serif",
  "Dancing Script": "Dancing Script, cursive",
  "Playfair Display": "Playfair Display, serif",
  Roboto: "Roboto, sans-serif",
  "Open Sans": "Open Sans, sans-serif",
  Lato: "Lato, sans-serif",
  Montserrat: "Montserrat, sans-serif",
  Poppins: "Poppins, sans-serif",
  Oswald: "Oswald, sans-serif",
  "Source Sans Pro": "Source Sans Pro, sans-serif",
  Raleway: "Raleway, sans-serif",
  Nunito: "Nunito, sans-serif",
}

const filterPresets = {
  none: {
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
  },
  instagram: {
    brightness: 110,
    contrast: 115,
    saturation: 120,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    hdr: 15,
    vignette: 10,
    filmGrain: 5,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
  vintage: {
    brightness: 110,
    contrast: 120,
    saturation: 80,
    blur: 0,
    sepia: 30,
    grayscale: 0,
    hueRotate: 10,
    hdr: 0,
    vignette: 20,
    filmGrain: 15,
    textureType: "paper",
    textureIntensity: 25,
    textureBlendMode: "multiply",
  },
  blackwhite: {
    brightness: 105,
    contrast: 110,
    saturation: 0,
    blur: 0,
    sepia: 0,
    grayscale: 100,
    hueRotate: 0,
    hdr: 0,
    vignette: 15,
    filmGrain: 0,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
  dramatic: {
    brightness: 90,
    contrast: 150,
    saturation: 120,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    hdr: 30,
    vignette: 35,
    filmGrain: 0,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
  mobile_optimized: {
    brightness: 115,
    contrast: 125,
    saturation: 110,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    hdr: 20,
    vignette: 5,
    filmGrain: 3,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
}

const features = [
  {
    name: "Instagram Optimized",
    description: "Perfect dimensions and quality for Instagram posts and stories",
    icon: Instagram,
    href: "/editor",
    color: "bg-pink-500",
    badge: "Mobile First",
  },
  {
    name: "Mobile Preview",
    description: "Real-time mobile-optimized preview with touch-friendly interface",
    icon: Smartphone,
    href: "/editor",
    color: "bg-blue-500",
    badge: "New",
  },
  {
    name: "Drag & Drop Editor",
    description: "Intuitive drag and drop interface for easy image uploads",
    icon: MousePointer,
    href: "/editor",
    color: "bg-green-500",
  },
  {
    name: "Template Gallery",
    description: "Choose from professionally designed templates",
    icon: Layout,
    href: "/templates",
    color: "bg-purple-500",
  },
  {
    name: "Maritime Adventure",
    description: "Ocean-themed templates for travel content",
    icon: Anchor,
    href: "/maritime",
    color: "bg-teal-500",
    badge: "Featured",
  },
  {
    name: "Advanced Filters",
    description: "Professional image filters optimized for mobile viewing",
    icon: Filter,
    href: "/filters",
    color: "bg-orange-500",
  },
]

const stats = [
  { name: "Instagram Ready", value: "100%", icon: Instagram },
  { name: "Mobile Optimized", value: "✓", icon: Smartphone },
  { name: "Filter Presets", value: "25+", icon: Filter },
  { name: "Font Options", value: "100+", icon: Type },
]

export default function SocialBannerCreator() {
  const { bannerData } = useBanner()

  const [bannerDataLocal, setBannerDataLocal] = useState<BannerData>({
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

  const [selectedImageForFilter, setSelectedImageForFilter] = useState<string>("productImage")
  const [isExporting, setIsExporting] = useState(false)
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: HTMLImageElement }>({})
  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Image loading utility with proper error handling
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      if (loadedImages[src]) {
        resolve(loadedImages[src])
        return
      }

      const img = new Image()
      img.crossOrigin = "anonymous"

      img.onload = () => {
        setLoadedImages((prev) => ({ ...prev, [src]: img }))
        resolve(img)
      }

      img.onerror = (error) => {
        console.error(`Failed to load image: ${src}`, error)
        reject(new Error(`Failed to load image: ${src}`))
      }

      img.src = src
    })
  }

  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
      if (!validTypes.includes(file.type)) {
        reject(new Error(`Invalid file type: ${file.type}. Please use JPG, PNG, WebP, or GIF.`))
        return
      }

      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        reject(new Error("File size too large. Please use images smaller than 10MB."))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          resolve(result)
        } else {
          reject(new Error("Failed to read file"))
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  const handleMultiImageUpload = (images: { [key: string]: string | null }) => {
    setBannerDataLocal((prev) => ({
      ...prev,
      productImage: images.main || images.story || prev.productImage,
      horizontalImage: images.horizontal || prev.horizontalImage,
      verticalImage1: images.vertical1 || prev.verticalImage1,
      verticalImage2: images.vertical2 || prev.verticalImage2,
      verticalImage3: images.vertical3 || prev.verticalImage3,
    }))
  }

  const applyFilterPreset = (preset: string) => {
    const presetFilters = filterPresets[preset as keyof typeof filterPresets]
    setBannerDataLocal((prev) => ({
      ...prev,
      imageFilters: {
        ...prev.imageFilters,
        [selectedImageForFilter]: {
          ...presetFilters,
          preset,
        },
      },
    }))
  }

  const updateFilter = (filterName: string, value: number | string) => {
    setBannerDataLocal((prev) => ({
      ...prev,
      imageFilters: {
        ...prev.imageFilters,
        [selectedImageForFilter]: {
          ...prev.imageFilters[selectedImageForFilter as keyof typeof prev.imageFilters],
          [filterName]: value,
          preset: "custom",
        },
      },
    }))
  }

  const resetFilters = () => {
    setBannerDataLocal((prev) => ({
      ...prev,
      imageFilters: {
        ...prev.imageFilters,
        [selectedImageForFilter]: { ...defaultFilters },
      },
    }))
  }

  const updateTextStyle = (property: keyof TextStyles, value: string | number) => {
    setBannerDataLocal((prev) => ({
      ...prev,
      textStyles: {
        ...prev.textStyles,
        [property]: value,
      },
    }))
  }

  const getFilterString = (filters: ImageFilters): string => {
    let filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%) hue-rotate(${filters.hueRotate}deg)`

    // HDR simulation through enhanced contrast and saturation
    if (filters.hdr > 0) {
      const hdrBoost = 1 + filters.hdr / 100
      filterString += ` contrast(${Math.min(200, filters.contrast * hdrBoost)}%) saturate(${Math.min(200, filters.saturation * hdrBoost)}%)`
    }

    return filterString
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
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    try {
      // Set canvas dimensions based on resolution with mobile optimization
      const dimensions = getCanvasDimensions(bannerDataLocal.resolution)
      canvas.width = dimensions.width
      canvas.height = dimensions.height

      // Enable high-quality rendering for mobile
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = "high"

      // Clear canvas with white background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      // Calculate scale factor for responsive design
      const baseWidth = 1080
      const scale = dimensions.width / baseWidth

      // Load all images first
      const imagePromises: Promise<void>[] = []
      const imagesToLoad = [
        bannerDataLocal.productImage,
        bannerDataLocal.horizontalImage,
        bannerDataLocal.verticalImage1,
        bannerDataLocal.verticalImage2,
        bannerDataLocal.verticalImage3,
        bannerDataLocal.inspirationalImage1,
        bannerDataLocal.inspirationalImage2,
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

      // Render based on theme with mobile optimization
      await renderBannerTheme(ctx, dimensions.width, dimensions.height, scale)
    } catch (error) {
      console.error("Error generating banner:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const renderBannerTheme = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    switch (bannerDataLocal.designTheme) {
      case "social_gallery":
        await renderSocialGallery(ctx, width, height, scale)
        break
      case "instagram_mood":
        await renderInstagramMood(ctx, width, height, scale)
        break
      case "inspirational_vibes":
        await renderInspirationalVibes(ctx, width, height, scale)
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
    ctx.save()
    ctx.filter = getFilterString(filters)
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
    // Background gradient optimized for mobile viewing
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#f8fafc")
    gradient.addColorStop(1, "#e2e8f0")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Main container with mobile-optimized margins - reduced margins for more space
    const margin = Math.max(15 * scale, 15)
    const containerWidth = width - margin * 2
    const containerHeight = height - margin * 2
    const containerX = margin
    const containerY = margin

    // White background container
    ctx.fillStyle = "#ffffff"
    ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
    ctx.shadowBlur = 15 * scale
    ctx.shadowOffsetY = 5 * scale
    ctx.beginPath()
    ctx.roundRect(containerX, containerY, containerWidth, containerHeight, 15 * scale)
    ctx.fill()
    ctx.shadowColor = "transparent"

    // Enhanced header section with premium gradient background
    const headerHeight = Math.max(80 * scale, 80)
    const headerY = containerY + 10 * scale

    // Premium gradient header background
    const headerGradient = ctx.createLinearGradient(0, headerY, 0, headerY + headerHeight)
    headerGradient.addColorStop(0, "#1e293b")
    headerGradient.addColorStop(0.3, "#334155")
    headerGradient.addColorStop(0.7, "#475569")
    headerGradient.addColorStop(1, "#1e293b")
    ctx.fillStyle = headerGradient
    ctx.beginPath()
    ctx.roundRect(containerX + 10 * scale, headerY, containerWidth - 20 * scale, headerHeight, 12 * scale)
    ctx.fill()

    // Add decorative elements to header
    ctx.fillStyle = "#fbbf24"
    const decorSize = 3 * scale
    // Top left decoration
    ctx.fillRect(containerX + 25 * scale, headerY + 15 * scale, 40 * scale, decorSize)
    ctx.fillRect(containerX + 25 * scale, headerY + 15 * scale, decorSize, decorSize)
    // Bottom right decoration
    ctx.fillRect(containerX + containerWidth - 65 * scale, headerY + headerHeight - 18 * scale, 40 * scale, decorSize)
    ctx.fillRect(containerX + containerWidth - 28 * scale, headerY + headerHeight - 18 * scale, decorSize, decorSize)

    // Shop name with enhanced styling
    if (bannerDataLocal.shopName) {
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${Math.min(bannerDataLocal.textStyles.shopNameSize * scale, containerWidth / 8)}px ${bannerDataLocal.textStyles.shopNameFont}`
      ctx.textAlign = "center"
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 4 * scale
      ctx.shadowOffsetY = 2 * scale
      ctx.fillText(bannerDataLocal.shopName, containerX + containerWidth / 2, headerY + headerHeight / 2 + 8 * scale)
      ctx.shadowColor = "transparent"
    }

    // Main image section - maximized space
    const mainImageY = headerY + headerHeight + 15 * scale
    const mainImageHeight = containerHeight * 0.55 // Increased from 0.48
    const mainImageWidth = containerWidth - 20 * scale
    const mainImageX = containerX + 10 * scale

    if (bannerDataLocal.horizontalImage && loadedImages[bannerDataLocal.horizontalImage]) {
      const img = loadedImages[bannerDataLocal.horizontalImage]
      ctx.save()
      ctx.beginPath()
      ctx.roundRect(mainImageX, mainImageY, mainImageWidth, mainImageHeight, 10 * scale)
      ctx.clip()
      applyImageFilters(
        ctx,
        img,
        mainImageX,
        mainImageY,
        mainImageWidth,
        mainImageHeight,
        bannerDataLocal.imageFilters.horizontalImage,
      )
      ctx.restore()
    }

    // Three vertical images - optimized spacing
    const verticalImagesY = mainImageY + mainImageHeight + 10 * scale
    const verticalImageHeight = containerHeight * 0.25 // Increased from 0.22
    const verticalImageWidth = (mainImageWidth - 16 * scale) / 3

    const verticalImages = [
      bannerDataLocal.verticalImage1,
      bannerDataLocal.verticalImage2,
      bannerDataLocal.verticalImage3,
    ]
    const verticalFilters = [
      bannerDataLocal.imageFilters.verticalImage1,
      bannerDataLocal.imageFilters.verticalImage2,
      bannerDataLocal.imageFilters.verticalImage3,
    ]

    for (let i = 0; i < verticalImages.length; i++) {
      const imageSrc = verticalImages[i]
      const imageX = mainImageX + i * (verticalImageWidth + 8 * scale)

      if (imageSrc && loadedImages[imageSrc]) {
        const img = loadedImages[imageSrc]
        ctx.save()
        ctx.beginPath()
        ctx.roundRect(imageX, verticalImagesY, verticalImageWidth, verticalImageHeight, 8 * scale)
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

    // Compact text content section - minimized space
    const textStartY = verticalImagesY + verticalImageHeight + 15 * scale
    const remainingHeight = containerY + containerHeight - textStartY - 15 * scale

    // Product name and price in same line to save space
    if (bannerDataLocal.productName || bannerDataLocal.price) {
      const textY = textStartY + 20 * scale

      if (bannerDataLocal.productName) {
        ctx.fillStyle = "#1e293b"
        ctx.font = `bold ${Math.min(bannerDataLocal.textStyles.productNameSize * scale, containerWidth / 15)}px ${bannerDataLocal.textStyles.productNameFont}`
        ctx.textAlign = "left"
        ctx.fillText(bannerDataLocal.productName, containerX + 15 * scale, textY)
      }

      if (bannerDataLocal.price) {
        ctx.fillStyle = "#059669"
        ctx.font = `bold ${Math.min(bannerDataLocal.textStyles.priceSize * scale, containerWidth / 18)}px ${bannerDataLocal.textStyles.priceFont}`
        ctx.textAlign = "right"
        ctx.fillText(`$${bannerDataLocal.price}`, containerX + containerWidth - 15 * scale, textY)
      }
    }

    // Elegant footer decoration
    const footerY = containerY + containerHeight - 25 * scale
    ctx.fillStyle = "#fbbf24"
    ctx.fillRect(containerX + containerWidth / 2 - 30 * scale, footerY, 60 * scale, 2 * scale)

    // Brand signature
    ctx.fillStyle = "#64748b"
    ctx.font = `italic ${10 * scale}px Dancing Script, cursive`
    ctx.textAlign = "center"
    ctx.fillText(
      `✨ ${bannerDataLocal.shopName || "Premium Collection"} ✨`,
      containerX + containerWidth / 2,
      footerY + 15 * scale,
    )
  }

  const renderInstagramMood = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    // Optimized for Instagram square format with full space utilization
    const frameMargin = Math.max(25 * scale, 25) // Reduced margin
    const frameWidth = width - frameMargin * 2
    const frameHeight = height - frameMargin * 2 // Use full height
    const frameX = frameMargin
    const frameY = frameMargin

    // White frame background
    ctx.fillStyle = "#ffffff"
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)"
    ctx.shadowBlur = 20 * scale
    ctx.shadowOffsetY = 8 * scale
    ctx.beginPath()
    ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 15 * scale)
    ctx.fill()
    ctx.shadowColor = "transparent"

    // Enhanced header with gradient background
    const headerHeight = 60 * scale
    const headerY = frameY + 15 * scale

    // Premium header background
    const headerGradient = ctx.createLinearGradient(0, headerY, 0, headerY + headerHeight)
    headerGradient.addColorStop(0, "#2d5a3d")
    headerGradient.addColorStop(0.5, "#3d6b4d")
    headerGradient.addColorStop(1, "#2d5a3d")
    ctx.fillStyle = headerGradient
    ctx.beginPath()
    ctx.roundRect(frameX + 15 * scale, headerY, frameWidth - 30 * scale, headerHeight, 10 * scale)
    ctx.fill()

    // Header with shop name
    if (bannerDataLocal.shopName) {
      ctx.fillStyle = "#ffffff"
      ctx.font = `${Math.min(32 * scale, frameWidth / 10)}px Dancing Script, cursive`
      ctx.textAlign = "center"
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 3 * scale
      ctx.shadowOffsetY = 1 * scale
      ctx.fillText(bannerDataLocal.shopName, frameX + frameWidth / 2, headerY + headerHeight / 2 + 8 * scale)
      ctx.shadowColor = "transparent"
    }

    // Decorative plus elements
    ctx.fillStyle = "#fbbf24"
    ctx.font = `${14 * scale}px Inter, sans-serif`
    ctx.textAlign = "right"
    const plusX = frameX + frameWidth - 20 * scale
    const plusY = headerY + 20 * scale
    for (let i = 0; i < 4; i++) {
      ctx.fillText("+", plusX - (i % 2) * 10 * scale, plusY + Math.floor(i / 2) * 12 * scale)
    }

    // Main product image - maximized space
    if (bannerDataLocal.productImage && loadedImages[bannerDataLocal.productImage]) {
      const img = loadedImages[bannerDataLocal.productImage]
      const imageMargin = 15 * scale
      const imageWidth = frameWidth - imageMargin * 2
      const imageHeight = frameHeight * 0.75 // Increased from 0.65
      const imageX = frameX + imageMargin
      const imageY = headerY + headerHeight + 15 * scale

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 12 * scale)
      ctx.clip()
      applyImageFilters(ctx, img, imageX, imageY, imageWidth, imageHeight, bannerDataLocal.imageFilters.productImage)
      ctx.restore()
    }

    // Compact footer with color palette and info
    const footerY = frameY + frameHeight - 50 * scale
    const colors = ["#7a9b8e", "#5a7c6f", "#8fa69a", "#6b8578", "#4a6b5c"]
    const swatchSize = 10 * scale
    const paletteX = frameX + 20 * scale

    // Color palette label
    ctx.fillStyle = "#2d5a3d"
    ctx.font = `bold ${8 * scale}px Inter, sans-serif`
    ctx.textAlign = "left"
    ctx.fillText("COLOR PALETTE", paletteX, footerY - 5 * scale)

    // Color swatches
    colors.forEach((color, index) => {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.roundRect(paletteX + index * (swatchSize + 3 * scale), footerY + 5 * scale, swatchSize, swatchSize, 2 * scale)
      ctx.fill()
    })

    // Product info - compact layout
    if (bannerDataLocal.productName || bannerDataLocal.price) {
      const infoX = frameX + frameWidth - 140 * scale
      const infoY = footerY - 10 * scale

      ctx.fillStyle = "rgba(45, 90, 61, 0.95)"
      ctx.beginPath()
      ctx.roundRect(infoX, infoY, 120 * scale, 35 * scale, 8 * scale)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = `${7 * scale}px Inter, sans-serif`
      ctx.textAlign = "left"

      if (bannerDataLocal.productName) {
        ctx.fillText(`${bannerDataLocal.productName}`, infoX + 8 * scale, infoY + 12 * scale)
      }
      if (bannerDataLocal.price) {
        ctx.fillText(`$${bannerDataLocal.price}`, infoX + 8 * scale, infoY + 25 * scale)
      }
    }
  }

  const renderInspirationalVibes = async (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scale: number,
  ) => {
    // Enhanced gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#4a90a4")
    gradient.addColorStop(0.3, "#5ba3b8")
    gradient.addColorStop(0.7, "#6bb6cc")
    gradient.addColorStop(1, "#4a90a4")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Top section - reduced height for more image space
    const topHeight = height * 0.35 // Reduced from 0.4

    // Author name with enhanced styling
    if (bannerDataLocal.authorName) {
      ctx.fillStyle = "#ffffff"
      ctx.font = `${Math.min(bannerDataLocal.textStyles.authorNameSize * scale, width / 25)}px ${bannerDataLocal.textStyles.authorNameFont}`
      ctx.textAlign = "right"
      ctx.shadowColor = "rgba(0, 0, 0, 0.2)"
      ctx.shadowBlur = 3 * scale
      ctx.shadowOffsetY = 1 * scale
      ctx.fillText(bannerDataLocal.authorName, width - 25 * scale, 40 * scale)
      ctx.shadowColor = "transparent"
    }

    // Main title with enhanced styling
    if (bannerDataLocal.productName) {
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${Math.min(bannerDataLocal.textStyles.productNameSize * scale, width / 10)}px ${bannerDataLocal.textStyles.productNameFont}`
      ctx.textAlign = "left"
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 4 * scale
      ctx.shadowOffsetY = 2 * scale
      ctx.fillText(bannerDataLocal.productName, 25 * scale, topHeight - 40 * scale)
      ctx.shadowColor = "transparent"
    }

    // Bottom card - maximized space
    const cardY = topHeight
    const cardHeight = height - topHeight - 20 * scale // Reduced bottom margin
    const cardMargin = 20 * scale // Reduced margin

    ctx.fillStyle = "#ffffff"
    ctx.shadowColor = "rgba(0, 0, 0, 0.25)"
    ctx.shadowBlur = 30 * scale
    ctx.shadowOffsetY = 10 * scale
    ctx.beginPath()
    ctx.roundRect(cardMargin, cardY, width - cardMargin * 2, cardHeight, 20 * scale)
    ctx.fill()
    ctx.shadowColor = "transparent"

    // Main inspirational image - maximized
    if (bannerDataLocal.inspirationalImage1 && loadedImages[bannerDataLocal.inspirationalImage1]) {
      const img = loadedImages[bannerDataLocal.inspirationalImage1]
      const imageMargin = 25 * scale
      const imageWidth = width - cardMargin * 2 - imageMargin * 2
      const imageHeight = cardHeight * 0.65 // Increased from 0.5
      const imageX = cardMargin + imageMargin
      const imageY = cardY + 30 * scale

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 15 * scale)
      ctx.clip()
      applyImageFilters(
        ctx,
        img,
        imageX,
        imageY,
        imageWidth,
        imageHeight,
        bannerDataLocal.imageFilters.inspirationalImage1,
      )
      ctx.restore()
    }

    // Compact inspirational text section
    if (bannerDataLocal.inspirationalText) {
      const textY = cardY + cardHeight * 0.7
      ctx.fillStyle = "#374151"
      ctx.font = `${Math.min(bannerDataLocal.textStyles.inspirationalTextSize * scale, width / 30)}px ${bannerDataLocal.textStyles.inspirationalTextFont}`
      ctx.textAlign = "left"

      const maxWidth = width * 0.6
      const words = bannerDataLocal.inspirationalText.split(" ")
      let line = ""
      let y = textY
      const lineHeight = 18 * scale // Reduced line height

      for (let n = 0; n < words.length && y < cardY + cardHeight - 30 * scale; n++) {
        const testLine = line + words[n] + " "
        const metrics = ctx.measureText(testLine)

        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, 40 * scale, y)
          line = words[n] + " "
          y += lineHeight
        } else {
          line = testLine
        }
      }
      if (y < cardY + cardHeight - 30 * scale) {
        ctx.fillText(line, 40 * scale, y)
      }
    }
  }

  const renderMinimalist = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    // Clean white background
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, width, height)

    // Maximized centered image
    if (bannerDataLocal.productImage && loadedImages[bannerDataLocal.productImage]) {
      const img = loadedImages[bannerDataLocal.productImage]
      const imageSize = Math.min(width, height) * 0.75 // Increased from 0.6
      const imageX = (width - imageSize) / 2
      const imageY = (height - imageSize) / 2 - height * 0.05 // Reduced offset

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imageX, imageY, imageSize, imageSize, 15 * scale)
      ctx.clip()
      applyImageFilters(ctx, img, imageX, imageY, imageSize, imageSize, bannerDataLocal.imageFilters.productImage)
      ctx.restore()
    }

    // Compact text at bottom
    const textY = height * 0.85
    ctx.fillStyle = "#1e293b"
    ctx.font = `300 ${Math.min(bannerDataLocal.textStyles.shopNameSize * scale, width / 15)}px ${bannerDataLocal.textStyles.shopNameFont}`
    ctx.textAlign = "center"

    if (bannerDataLocal.shopName) {
      ctx.fillText(bannerDataLocal.shopName, width / 2, textY)
    }

    if (bannerDataLocal.productName) {
      ctx.font = `400 ${Math.min(bannerDataLocal.textStyles.productNameSize * scale, width / 18)}px ${bannerDataLocal.textStyles.productNameFont}`
      ctx.fillStyle = "#64748b"
      ctx.fillText(bannerDataLocal.productName, width / 2, textY + 25 * scale)
    }

    // Price if available
    if (bannerDataLocal.price) {
      ctx.font = `600 ${Math.min(bannerDataLocal.textStyles.priceSize * scale, width / 20)}px ${bannerDataLocal.textStyles.priceFont}`
      ctx.fillStyle = "#059669"
      ctx.fillText(`$${bannerDataLocal.price}`, width / 2, textY + 50 * scale)
    }
  }

  const renderVibrant = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    // Enhanced vibrant gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "#fbbf24")
    gradient.addColorStop(0.3, "#f59e0b")
    gradient.addColorStop(0.7, "#d97706")
    gradient.addColorStop(1, "#b45309")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Maximized product image with enhanced border
    if (bannerDataLocal.productImage && loadedImages[bannerDataLocal.productImage]) {
      const img = loadedImages[bannerDataLocal.productImage]
      const imageSize = Math.min(width, height) * 0.7 // Increased from 0.6
      const imageX = (width - imageSize) / 2
      const imageY = height * 0.1 // Reduced top margin
      const borderWidth = 6 * scale

      // Enhanced colorful border with gradient
      const borderGradient = ctx.createLinearGradient(imageX, imageY, imageX + imageSize, imageY + imageSize)
      borderGradient.addColorStop(0, "#ffffff")
      borderGradient.addColorStop(0.5, "#fef3c7")
      borderGradient.addColorStop(1, "#ffffff")
      ctx.fillStyle = borderGradient
      ctx.beginPath()
      ctx.roundRect(
        imageX - borderWidth,
        imageY - borderWidth,
        imageSize + borderWidth * 2,
        imageSize + borderWidth * 2,
        20 * scale,
      )
      ctx.fill()

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imageX, imageY, imageSize, imageSize, 15 * scale)
      ctx.clip()
      applyImageFilters(ctx, img, imageX, imageY, imageSize, imageSize, bannerDataLocal.imageFilters.productImage)
      ctx.restore()
    }

    // Compact bold text section
    const textY = height * 0.85
    ctx.fillStyle = "#ffffff"
    ctx.font = `bold ${Math.min(bannerDataLocal.textStyles.shopNameSize * scale, width / 12)}px ${bannerDataLocal.textStyles.shopNameFont}`
    ctx.textAlign = "center"

    if (bannerDataLocal.shopName) {
      // Enhanced text shadow for better readability
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)"
      ctx.shadowBlur = 6 * scale
      ctx.shadowOffsetY = 3 * scale
      ctx.fillText(bannerDataLocal.shopName, width / 2, textY)
      ctx.shadowColor = "transparent"
    }

    if (bannerDataLocal.productName) {
      ctx.fillStyle = "#fef3c7"
      ctx.font = `${Math.min(bannerDataLocal.textStyles.productNameSize * scale, width / 15)}px ${bannerDataLocal.textStyles.productNameFont}`
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 4 * scale
      ctx.shadowOffsetY = 2 * scale
      ctx.fillText(bannerDataLocal.productName, width / 2, textY + 30 * scale)
      ctx.shadowColor = "transparent"
    }

    if (bannerDataLocal.price) {
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${Math.min(bannerDataLocal.textStyles.priceSize * scale, width / 18)}px ${bannerDataLocal.textStyles.priceFont}`
      ctx.fillText(`$${bannerDataLocal.price}`, width / 2, textY + 55 * scale)
    }
  }

  const renderElegantCursive = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    // Elegant gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#fdfbfb")
    gradient.addColorStop(0.5, "#f7f3f4")
    gradient.addColorStop(1, "#ebedee")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Maximized product image with elegant frame
    if (bannerDataLocal.productImage && loadedImages[bannerDataLocal.productImage]) {
      const img = loadedImages[bannerDataLocal.productImage]
      const imageSize = Math.min(width, height) * 0.65 // Increased from 0.5
      const imageX = (width - imageSize) / 2
      const imageY = height * 0.15 // Reduced top margin
      const frameWidth = 8 * scale

      // Enhanced elegant frame with double border
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1 * scale
      ctx.beginPath()
      ctx.roundRect(
        imageX - frameWidth - 5 * scale,
        imageY - frameWidth - 5 * scale,
        imageSize + (frameWidth + 5) * 2 * scale,
        imageSize + (frameWidth + 5) * 2 * scale,
        12 * scale,
      )
      ctx.stroke()

      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 2 * scale
      ctx.beginPath()
      ctx.roundRect(
        imageX - frameWidth,
        imageY - frameWidth,
        imageSize + frameWidth * 2,
        imageSize + frameWidth * 2,
        8 * scale,
      )
      ctx.stroke()

      ctx.save()
      ctx.beginPath()
      ctx.roundRect(imageX, imageY, imageSize, imageSize, 5 * scale)
      ctx.clip()
      applyImageFilters(ctx, img, imageX, imageY, imageSize, imageSize, bannerDataLocal.imageFilters.productImage)
      ctx.restore()
    }

    // Elegant typography section
    const textY = height * 0.85
    ctx.fillStyle = "#1f2937"
    ctx.font = `${Math.min(bannerDataLocal.textStyles.shopNameSize * scale, width / 15)}px ${bannerDataLocal.textStyles.shopNameFont}`
    ctx.textAlign = "center"

    if (bannerDataLocal.shopName) {
      ctx.fillText(bannerDataLocal.shopName, width / 2, textY)
    }

    if (bannerDataLocal.productName) {
      ctx.font = `italic ${Math.min(bannerDataLocal.textStyles.productNameSize * scale, width / 18)}px Dancing Script, cursive`
      ctx.fillStyle = "#374151"
      ctx.fillText(bannerDataLocal.productName, width / 2, textY + 30 * scale)
    }

    if (bannerDataLocal.price) {
      ctx.font = `600 ${Math.min(bannerDataLocal.textStyles.priceSize * scale, width / 20)}px ${bannerDataLocal.textStyles.priceFont}`
      ctx.fillStyle = "#8b5cf6"
      ctx.fillText(`$${bannerDataLocal.price}`, width / 2, textY + 55 * scale)
    }

    // Elegant decorative line
    ctx.strokeStyle = "#8b5cf6"
    ctx.lineWidth = 2 * scale
    ctx.beginPath()
    ctx.moveTo(width / 2 - 40 * scale, textY + 70 * scale)
    ctx.lineTo(width / 2 + 40 * scale, textY + 70 * scale)
    ctx.stroke()
  }

  const renderDefaultTheme = async (ctx: CanvasRenderingContext2D, width: number, height: number, scale: number) => {
    // Simple default rendering
    ctx.fillStyle = "#f0f0f0"
    ctx.fillRect(0, 0, width, height)

    ctx.fillStyle = "#333333"
    ctx.font = `${Math.min(48 * scale, width / 15)}px Inter`
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
          a.download = `${bannerDataLocal.shopName || "social-banner"}-${bannerDataLocal.resolution}.${format}`
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

  useEffect(() => {
    if (
      bannerDataLocal.shopName ||
      bannerDataLocal.productName ||
      bannerDataLocal.productImage ||
      bannerDataLocal.photographer ||
      bannerDataLocal.horizontalImage ||
      bannerDataLocal.verticalImage1 ||
      bannerDataLocal.verticalImage2 ||
      bannerDataLocal.verticalImage3 ||
      bannerDataLocal.inspirationalImage1 ||
      bannerDataLocal.inspirationalImage2 ||
      bannerDataLocal.inspirationalText ||
      bannerDataLocal.authorName ||
      bannerDataLocal.dateText ||
      bannerDataLocal.price
    ) {
      generateBanner()
    }
  }, [bannerDataLocal])

  const currentFilters =
    bannerDataLocal.imageFilters[selectedImageForFilter as keyof typeof bannerDataLocal.imageFilters]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Mobile-First Hero Section */}
      <div className="text-center space-y-6 py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Instagram Banner Creator
          <Instagram className="inline-block w-8 h-8 md:w-10 md:h-10 ml-3 text-pink-500" />
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Create stunning Instagram-ready banners with perfect mobile optimization. Professional quality, instant
          download.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            <Link href="/editor">
              <Instagram className="w-5 h-5 mr-2" />
              Start Creating
            </Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="/templates">
              <Layers className="w-5 h-5 mr-2" />
              Browse Templates
            </Link>
          </Button>
        </div>
      </div>

      {/* Mobile-Optimized Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 mb-12 max-w-6xl mx-auto">
        {stats.map((stat) => (
          <Card key={stat.name} className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="p-4 md:p-6">
              <div className="flex justify-center mb-3">
                <div className="p-2 md:p-3 bg-pink-100 rounded-full">
                  <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-pink-600" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-600">{stat.name}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4 mb-12 max-w-7xl mx-auto">
        {features.map((feature) => {
          const Icon = feature.icon
          return (
            <Card key={feature.name} className="hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl ${feature.color} text-white group-hover:scale-110 transition-transform`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  {feature.badge && (
                    <Badge className="bg-gradient-to-r from-pink-400 to-purple-500 text-white border-0">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {feature.badge}
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl group-hover:text-pink-600 transition-colors">{feature.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                <Button asChild className="w-full group-hover:bg-pink-600 transition-colors">
                  <Link href={feature.href}>Explore Feature</Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Editor Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Instagram className="w-6 h-6 text-pink-500" />
                Instagram Banner Creator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="filters">🎨 Filters</TabsTrigger>
                  <TabsTrigger value="typography">🔤 Typography</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input
                      id="shopName"
                      placeholder="Enter your shop name"
                      value={bannerDataLocal.shopName}
                      onChange={(e) => setBannerDataLocal((prev) => ({ ...prev, shopName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      placeholder="Enter product name"
                      value={bannerDataLocal.productName}
                      onChange={(e) => setBannerDataLocal((prev) => ({ ...prev, productName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      placeholder="Enter price (without currency symbol)"
                      value={bannerDataLocal.price}
                      onChange={(e) => setBannerDataLocal((prev) => ({ ...prev, price: e.target.value }))}
                    />
                  </div>

                  <MultiImageUploader
                    currentImages={{
                      main: bannerDataLocal.productImage,
                      story: bannerDataLocal.productImage,
                      horizontal: bannerDataLocal.horizontalImage,
                      vertical1: bannerDataLocal.verticalImage1,
                      vertical2: bannerDataLocal.verticalImage2,
                      vertical3: bannerDataLocal.verticalImage3,
                    }}
                    onImagesChange={handleMultiImageUpload}
                  />

                  <div className="space-y-2">
                    <Label>Design Theme</Label>
                    <Select
                      value={bannerDataLocal.designTheme}
                      onValueChange={(
                        value:
                          | "social_gallery"
                          | "instagram_mood"
                          | "minimalist"
                          | "vibrant"
                          | "elegant_cursive"
                          | "inspirational_vibes",
                      ) => setBannerDataLocal((prev) => ({ ...prev, designTheme: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="social_gallery">Social Gallery Post</SelectItem>
                        <SelectItem value="instagram_mood">Instagram Mood Board</SelectItem>
                        <SelectItem value="inspirational_vibes">Inspirational Vibes</SelectItem>
                        <SelectItem value="elegant_cursive">Elegant Cursive Accent</SelectItem>
                        <SelectItem value="minimalist">Minimalist Chic</SelectItem>
                        <SelectItem value="vibrant">Vibrant & Bold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {bannerDataLocal.designTheme === "inspirational_vibes" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="authorName">Author Name</Label>
                        <Input
                          id="authorName"
                          placeholder="Enter author name"
                          value={bannerDataLocal.authorName}
                          onChange={(e) => setBannerDataLocal((prev) => ({ ...prev, authorName: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="inspirationalText">Inspirational Text</Label>
                        <Input
                          id="inspirationalText"
                          placeholder="Enter inspirational message"
                          value={bannerDataLocal.inspirationalText}
                          onChange={(e) =>
                            setBannerDataLocal((prev) => ({ ...prev, inspirationalText: e.target.value }))
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateText">Date Text</Label>
                        <Input
                          id="dateText"
                          placeholder="Enter month (e.g., January)"
                          value={bannerDataLocal.dateText}
                          onChange={(e) => setBannerDataLocal((prev) => ({ ...prev, dateText: e.target.value }))}
                        />
                      </div>

                      <DragDropZone
                        label="Main Inspirational Image"
                        currentImage={bannerDataLocal.inspirationalImage1}
                        onFileUpload={(file) => {
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              setBannerDataLocal((prev) => ({
                                ...prev,
                                inspirationalImage1: e.target?.result as string,
                              }))
                            }
                            reader.readAsDataURL(file)
                          } else {
                            setBannerDataLocal((prev) => ({ ...prev, inspirationalImage1: null }))
                          }
                        }}
                      />

                      <DragDropZone
                        label="Secondary Image (Optional)"
                        currentImage={bannerDataLocal.inspirationalImage2}
                        onFileUpload={(file) => {
                          if (file) {
                            const reader = new FileReader()
                            reader.onload = (e) => {
                              setBannerDataLocal((prev) => ({
                                ...prev,
                                inspirationalImage2: e.target?.result as string,
                              }))
                            }
                            reader.readAsDataURL(file)
                          } else {
                            setBannerDataLocal((prev) => ({ ...prev, inspirationalImage2: null }))
                          }
                        }}
                      />
                    </>
                  )}

                  <div className="space-y-2">
                    <Label>Instagram Format</Label>
                    <Select
                      value={bannerDataLocal.resolution}
                      onValueChange={(value: "instagram_post" | "instagram_story" | "hd" | "4k") =>
                        setBannerDataLocal((prev) => ({ ...prev, resolution: value }))
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
                </TabsContent>

                <TabsContent value="filters" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5" />
                      <h3 className="font-semibold">Mobile-Optimized Filters</h3>
                    </div>

                    <div className="space-y-2">
                      <Label>Select Image to Edit</Label>
                      <Select value={selectedImageForFilter} onValueChange={setSelectedImageForFilter}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="productImage">Product Image</SelectItem>
                          <SelectItem value="horizontalImage">Horizontal Image</SelectItem>
                          <SelectItem value="verticalImage1">Vertical Image 1</SelectItem>
                          <SelectItem value="verticalImage2">Vertical Image 2</SelectItem>
                          <SelectItem value="verticalImage3">Vertical Image 3</SelectItem>
                          <SelectItem value="inspirationalImage1">Inspirational Image 1</SelectItem>
                          <SelectItem value="inspirationalImage2">Inspirational Image 2</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Filter Presets</Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {Object.keys(filterPresets).map((preset) => (
                          <Button
                            key={preset}
                            variant={currentFilters.preset === preset ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyFilterPreset(preset)}
                            className="capitalize text-xs"
                          >
                            {preset === "blackwhite" ? "B&W" : preset === "mobile_optimized" ? "Mobile" : preset}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4 border-t pt-4">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-4 h-4" />
                        <Label>Custom Adjustments</Label>
                      </div>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Brightness: {currentFilters.brightness}%</Label>
                          <Slider
                            value={[currentFilters.brightness]}
                            onValueChange={([value]) => updateFilter("brightness", value)}
                            min={0}
                            max={200}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Contrast: {currentFilters.contrast}%</Label>
                          <Slider
                            value={[currentFilters.contrast]}
                            onValueChange={([value]) => updateFilter("contrast", value)}
                            min={0}
                            max={200}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Saturation: {currentFilters.saturation}%</Label>
                          <Slider
                            value={[currentFilters.saturation]}
                            onValueChange={([value]) => updateFilter("saturation", value)}
                            min={0}
                            max={200}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>HDR Effect: {currentFilters.hdr}%</Label>
                          <Slider
                            value={[currentFilters.hdr]}
                            onValueChange={([value]) => updateFilter("hdr", value)}
                            min={0}
                            max={50}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Vignette: {currentFilters.vignette}%</Label>
                          <Slider
                            value={[currentFilters.vignette]}
                            onValueChange={([value]) => updateFilter("vignette", value)}
                            min={0}
                            max={50}
                            step={1}
                            className="w-full"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={resetFilters} className="flex-1 bg-transparent">
                          Reset All
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <Label>Filter Preview</Label>
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        {bannerDataLocal[selectedImageForFilter as keyof BannerData] ? (
                          <img
                            src={
                              (bannerDataLocal[selectedImageForFilter as keyof BannerData] as string) ||
                              "/placeholder.svg" ||
                              "/placeholder.svg" ||
                              "/placeholder.svg"
                            }
                            alt="Filter Preview"
                            className="max-w-full max-h-full object-contain rounded"
                            style={{ filter: getFilterString(currentFilters) }}
                          />
                        ) : (
                          <div className="text-gray-400 text-center">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">Upload an image to see filter preview</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="typography" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-lg">🔤</span>
                      <h3 className="font-semibold">Mobile-Optimized Typography</h3>
                    </div>

                    <div className="space-y-6">
                      {/* Shop Name Styling */}
                      <div className="space-y-3 p-4 border rounded-lg">
                        <Label className="font-semibold text-base">Shop Name</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Font Family</Label>
                            <Select
                              value={bannerDataLocal.textStyles.shopNameFont}
                              onValueChange={(value) => updateTextStyle("shopNameFont", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(fontOptions).map(([key, value]) => (
                                  <SelectItem key={key} value={key} style={{ fontFamily: value }}>
                                    {key}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Font Size: {bannerDataLocal.textStyles.shopNameSize}px</Label>
                            <Slider
                              value={[bannerDataLocal.textStyles.shopNameSize]}
                              onValueChange={([value]) => updateTextStyle("shopNameSize", value)}
                              min={12}
                              max={72}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Product Name Styling */}
                      <div className="space-y-3 p-4 border rounded-lg">
                        <Label className="font-semibold text-base">Product Name</Label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Font Family</Label>
                            <Select
                              value={bannerDataLocal.textStyles.productNameFont}
                              onValueChange={(value) => updateTextStyle("productNameFont", value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Object.entries(fontOptions).map(([key, value]) => (
                                  <SelectItem key={key} value={key} style={{ fontFamily: value }}>
                                    {key}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Font Size: {bannerDataLocal.textStyles.productNameSize}px</Label>
                            <Slider
                              value={[bannerDataLocal.textStyles.productNameSize]}
                              onValueChange={([value]) => updateTextStyle("productNameSize", value)}
                              min={12}
                              max={72}
                              step={1}
                              className="w-full"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setBannerDataLocal((prev) => ({ ...prev, textStyles: { ...defaultTextStyles } }))
                          }
                          className="flex-1"
                        >
                          Reset Typography
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <Button
                onClick={() => downloadBanner("png")}
                disabled={!bannerDataLocal.shopName || !bannerDataLocal.productName || isGenerating}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Download Instagram Banner"}
              </Button>

              <div className="grid grid-cols-3 gap-2">
                {["png", "jpg", "webp"].map((format) => (
                  <Button
                    key={format}
                    variant="outline"
                    size="sm"
                    onClick={() => downloadBanner(format)}
                    disabled={isGenerating}
                  >
                    {format.toUpperCase()}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mobile-Optimized Preview Section */}
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
                  bannerDataLocal.resolution === "instagram_story" ? "aspect-[9/16]" : "aspect-square"
                }`}
              >
                {bannerDataLocal.shopName || bannerDataLocal.productName ? (
                  bannerDataLocal.designTheme === "instagram_mood" ? (
                    <div className="w-full h-full relative bg-white p-4">
                      <div className="flex justify-between items-start mb-4">
                        {bannerDataLocal.shopName && (
                          <h2
                            className="text-lg font-bold text-green-800"
                            style={{ fontFamily: "Dancing Script, cursive" }}
                          >
                            {bannerDataLocal.shopName}
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

                      {bannerDataLocal.productImage ? (
                        <div className="flex-1 rounded overflow-hidden mb-4 h-3/5">
                          <img
                            src={bannerDataLocal.productImage || "/placeholder.svg"}
                            alt="Product"
                            className="w-full h-full object-cover"
                            style={{ filter: getFilterString(bannerDataLocal.imageFilters.productImage) }}
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
                          {bannerDataLocal.photographer && (
                            <p className="text-xs text-gray-500 mt-1">pict by: {bannerDataLocal.photographer}</p>
                          )}
                        </div>
                        <div className="flex gap-1">
                          {["#7a9b8e", "#5a7c6f", "#8fa69a", "#6b8578", "#4a6b5c"].map((color, i) => (
                            <div key={i} className="w-3 h-3" style={{ backgroundColor: color }} />
                          ))}
                        </div>
                      </div>

                      {(bannerDataLocal.productName || bannerDataLocal.price) && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-800/90 text-white p-3 rounded-lg text-xs max-w-xs">
                          {bannerDataLocal.productName && (
                            <p className="font-semibold">product: {bannerDataLocal.productName}</p>
                          )}
                          {bannerDataLocal.price && <p className="mt-1">${bannerDataLocal.price}</p>}
                        </div>
                      )}
                    </div>
                  ) : bannerDataLocal.designTheme === "social_gallery" ? (
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
                            {bannerDataLocal.shopName || "Premium Shop"}
                          </h1>
                        </div>

                        {/* Main horizontal image */}
                        {bannerDataLocal.horizontalImage ? (
                          <div className="flex-1 rounded-lg overflow-hidden mb-2 border border-slate-200">
                            <img
                              src={bannerDataLocal.horizontalImage || "/placeholder.svg"}
                              alt="Horizontal"
                              className="w-full h-full object-cover"
                              style={{ filter: getFilterString(bannerDataLocal.imageFilters.horizontalImage) }}
                            />
                          </div>
                        ) : (
                          <div className="flex-1 rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center mb-2">
                            <span className="text-2xl">📷</span>
                          </div>
                        )}

                        {/* Three vertical images */}
                        <div className="grid grid-cols-3 gap-1 mb-3" style={{ height: "30%" }}>
                          {[
                            bannerDataLocal.verticalImage1,
                            bannerDataLocal.verticalImage2,
                            bannerDataLocal.verticalImage3,
                          ].map((image, index) => (
                            <div key={index} className="rounded-md overflow-hidden">
                              {image ? (
                                <img
                                  src={image || "/placeholder.svg"}
                                  alt={`Vertical ${index + 1}`}
                                  className="w-full h-full object-cover border border-slate-200"
                                  style={{
                                    filter: getFilterString(
                                      bannerDataLocal.imageFilters[
                                        `verticalImage${index + 1}` as keyof typeof bannerDataLocal.imageFilters
                                      ],
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
                            {bannerDataLocal.productName && (
                              <h3 className="text-slate-800 font-bold text-base">{bannerDataLocal.productName}</h3>
                            )}
                            {bannerDataLocal.price && (
                              <span className="text-green-600 font-bold text-base">${bannerDataLocal.price}</span>
                            )}
                          </div>

                          <div className="border-t border-yellow-400 pt-1 flex justify-center text-xs text-gray-500 italic">
                            <span style={{ fontFamily: "Dancing Script, cursive" }}>
                              ✨ {bannerDataLocal.shopName || "Premium Shop"} ✨
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : bannerDataLocal.designTheme === "inspirational_vibes" ? (
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
                          {bannerDataLocal.authorName && <p className="text-sm">{bannerDataLocal.authorName}</p>}
                        </div>
                        <h1 className="text-3xl font-bold mb-2">{bannerDataLocal.productName || "Sunday Vibes"}</h1>
                        <div className="space-y-1 text-sm">
                          <p>Color</p>
                          <p>Font</p>
                          <p>Poppins</p>
                        </div>
                        {bannerDataLocal.shopName && (
                          <p className="text-xs opacity-80 mt-4">Archived By @{bannerDataLocal.shopName}</p>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-3 h-3/5 flex flex-col">
                        <div className="bg-blue-300 text-white px-3 py-1 rounded-full text-xs w-fit mb-3">
                          Self Reminder
                        </div>
                        {bannerDataLocal.inspirationalImage1 ? (
                          <div className="flex-1 rounded overflow-hidden mb-3">
                            <img
                              src={bannerDataLocal.inspirationalImage1 || "/placeholder.svg"}
                              alt="Inspirational"
                              className="w-full h-full object-cover"
                              style={{ filter: getFilterString(bannerDataLocal.imageFilters.inspirationalImage1) }}
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
                            {bannerDataLocal.inspirationalText && (
                              <p className="text-xs text-gray-600 leading-relaxed">
                                {bannerDataLocal.inspirationalText}
                              </p>
                            )}
                          </div>
                          <div className="ml-4 text-center">
                            <div className="bg-gray-500 text-white px-3 py-2 rounded text-lg font-bold">08</div>
                            <div className="bg-gray-400 text-white px-2 py-1 rounded text-xs mt-1">
                              {bannerDataLocal.dateText || "January"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Original preview for other themes - maximized image space
                    <div
                      className="w-full h-full flex flex-col items-center justify-center p-4"
                      style={{
                        background:
                          bannerDataLocal.designTheme === "vibrant"
                            ? "linear-gradient(to bottom, #fbbf24, #f59e0b, #d97706)"
                            : bannerDataLocal.designTheme === "minimalist"
                              ? "linear-gradient(to bottom, #f8fafc, #e2e8f0)"
                              : "linear-gradient(to bottom, #fdfbfb, #ebedee)",
                      }}
                    >
                      {bannerDataLocal.productImage ? (
                        <div className="w-5/6 aspect-square rounded-2xl overflow-hidden shadow-xl mb-4">
                          <img
                            src={bannerDataLocal.productImage || "/placeholder.svg"}
                            alt="Product"
                            className="w-full h-full object-cover"
                            style={{ filter: getFilterString(bannerDataLocal.imageFilters.productImage) }}
                          />
                        </div>
                      ) : (
                        <div className="w-5/6 aspect-square rounded-2xl bg-white/30 flex items-center justify-center mb-4 shadow-xl">
                          <span className="text-6xl">📷</span>
                        </div>
                      )}

                      <div className="text-center space-y-1">
                        {bannerDataLocal.shopName && (
                          <h2
                            className="text-xl font-bold"
                            style={{
                              color:
                                bannerDataLocal.designTheme === "vibrant"
                                  ? "#ffffff"
                                  : bannerDataLocal.designTheme === "minimalist"
                                    ? "#1e293b"
                                    : "#1f2937",
                            }}
                          >
                            {bannerDataLocal.shopName}
                          </h2>
                        )}

                        {bannerDataLocal.productName && (
                          <p
                            className="text-lg leading-tight"
                            style={{
                              color:
                                bannerDataLocal.designTheme === "vibrant"
                                  ? "#fef3c7"
                                  : bannerDataLocal.designTheme === "minimalist"
                                    ? "#64748b"
                                    : "#374151",
                            }}
                          >
                            {bannerDataLocal.productName}
                          </p>
                        )}

                        {bannerDataLocal.price && (
                          <p
                            className="text-lg font-bold"
                            style={{
                              color:
                                bannerDataLocal.designTheme === "vibrant"
                                  ? "#ffffff"
                                  : bannerDataLocal.designTheme === "minimalist"
                                    ? "#059669"
                                    : "#8b5cf6",
                            }}
                          >
                            ${bannerDataLocal.price}
                          </p>
                        )}

                        {bannerDataLocal.designTheme === "elegant_cursive" && (
                          <div className="w-2/5 h-0.5 mt-2 bg-purple-500 mx-auto" />
                        )}
                      </div>
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
        </div>

        {/* Hidden canvas for generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

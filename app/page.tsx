"use client"

import { Badge } from "@/components/ui/badge"
import { DragDropZone } from "@/components/drag-drop-zone"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, ImageIcon, Palette, Sliders } from "lucide-react"
import { Edit, Layers, Type, TrendingUp, Anchor, Sparkles } from "lucide-react"
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
  sepia: {
    brightness: 110,
    contrast: 90,
    saturation: 80,
    blur: 0,
    sepia: 80,
    grayscale: 0,
    hueRotate: 0,
    hdr: 0,
    vignette: 25,
    filmGrain: 10,
    textureType: "parchment",
    textureIntensity: 30,
    textureBlendMode: "multiply",
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
}

const themes = {
  social_gallery: {
    background: "url('/nature-bg.jpg')",
    overlayColor: "rgba(0, 0, 0, 0.4)",
    headerTextColor: "#1f2937",
    titleColor: "#84cc16",
    bodyTextColor: "#ffffff",
    searchBarColor: "#ffffff",
    creditTextColor: "#d1d5db",
  },
  instagram_mood: {
    background: "url('/reference-bg.jpg')",
    frameColor: "#ffffff",
    headerTextColor: "#2d5a3d",
    bodyTextColor: "#1f2937",
    accentColor: "#2d5a3d",
    headerFont: "Dancing Script, cursive",
    bodyFont: "Inter, sans-serif",
  },
  inspirational_vibes: {
    background: "linear-gradient(135deg, #4a90a4, #5ba3b8, #6bb6cc)",
    primaryColor: "#ffffff",
    secondaryColor: "#f8fafc",
    accentColor: "#4a90a4",
    textColor: "#374151",
    headerFont: "Inter, sans-serif",
    bodyFont: "Inter, sans-serif",
  },
  minimalist: {
    background: "linear-gradient(to bottom, #f8fafc, #e2e8f0)",
    shopNameColor: "#1e293b",
    productNameColor: "#64748b",
    shopNameFont: "Inter, sans-serif",
    productNameFont: "Inter, sans-serif",
    accent: "#3b82f6",
  },
  vibrant: {
    background: "linear-gradient(to bottom, #fbbf24, #f59e0b, #d97706)",
    shopNameColor: "#ffffff",
    productNameColor: "#fef3c7",
    shopNameFont: "Inter, sans-serif",
    productNameFont: "Inter, sans-serif",
    accent: "#dc2626",
  },
  elegant_cursive: {
    background: "linear-gradient(to bottom, #fdfbfb, #ebedee)",
    shopNameColor: "#1f2937",
    productNameColor: "#374151",
    shopNameFont: "Inter, sans-serif",
    productNameFont: "Dancing Script, cursive",
    accent: "#8b5cf6",
  },
}

const features = [
  {
    name: "Drag & Drop Editor",
    description: "Intuitive drag and drop interface for easy image uploads",
    icon: MousePointer,
    href: "/editor",
    color: "bg-blue-500",
    badge: "New",
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
    description: "Professional image filters and effects",
    icon: Filter,
    href: "/filters",
    color: "bg-green-500",
  },
  {
    name: "Typography Studio",
    description: "Customize fonts, sizes, and text styling",
    icon: Type,
    href: "/typography",
    color: "bg-orange-500",
  },
  {
    name: "Brand Kit Manager",
    description: "Manage your brand colors, logos, and assets",
    icon: Palette,
    href: "/brand-kit",
    color: "bg-pink-500",
  },
  {
    name: "Export Options",
    description: "Download in multiple formats and resolutions",
    icon: Download,
    href: "/export",
    color: "bg-indigo-500",
  },
]

const stats = [
  { name: "Templates Available", value: "50+", icon: Layout },
  { name: "Export Formats", value: "4", icon: Download },
  { name: "Filter Presets", value: "25+", icon: Filter },
  { name: "Font Options", value: "100+", icon: Type },
]

export default function SocialBannerCreator() {
  const { bannerData } = useBanner()

  const quickActions = [
    {
      title: "Start Creating",
      description: "Begin with the banner editor",
      href: "/editor",
      icon: Edit,
      color: "bg-blue-500",
    },
    {
      title: "Browse Templates",
      description: "Choose from pre-made designs",
      href: "/templates",
      icon: Layers,
      color: "bg-green-500",
    },
    {
      title: "Apply Filters",
      description: "Add professional effects",
      href: "/filters",
      icon: Palette,
      color: "bg-purple-500",
    },
    {
      title: "Customize Typography",
      description: "Perfect your text styling",
      href: "/typography",
      icon: Type,
      color: "bg-orange-500",
    },
  ]

  const stats2 = [
    { label: "Projects Created", value: "12", icon: TrendingUp },
    { label: "Templates Used", value: "8", icon: Layers },
    { label: "Exports Made", value: "24", icon: Download },
  ]

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

  const [selectedImageForFilter, setSelectedImageForFilter] = useState<string>("productImage")
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormats, setExportFormats] = useState(["png"])
  const [brandColors, setBrandColors] = useState(["#059669", "#84cc16", "#3b82f6"])
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: HTMLImageElement }>({})

  const [isGenerating, setIsGenerating] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Image loading utility with proper error handling
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      // Check if image is already loaded
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

  // Validate image file and convert to data URL
  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      // Validate file type
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
      if (!validTypes.includes(file.type)) {
        reject(new Error(`Invalid file type: ${file.type}. Please use JPG, PNG, WebP, or GIF.`))
        return
      }

      // Validate file size (max 10MB)
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const dataUrl = await processImageFile(file)
        setBannerDataLocal((prev) => ({
          ...prev,
          productImage: dataUrl,
        }))
      } catch (error) {
        console.error("Error uploading image:", error)
        alert(error instanceof Error ? error.message : "Failed to upload image")
      }
    }
  }

  const handleHorizontalImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const dataUrl = await processImageFile(file)
        setBannerDataLocal((prev) => ({
          ...prev,
          horizontalImage: dataUrl,
        }))
      } catch (error) {
        console.error("Error uploading horizontal image:", error)
        alert(error instanceof Error ? error.message : "Failed to upload image")
      }
    }
  }

  const handleVerticalImageUpload = async (event: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2 | 3) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const dataUrl = await processImageFile(file)
        setBannerDataLocal((prev) => ({
          ...prev,
          [`verticalImage${imageNumber}`]: dataUrl,
        }))
      } catch (error) {
        console.error(`Error uploading vertical image ${imageNumber}:`, error)
        alert(error instanceof Error ? error.message : "Failed to upload image")
      }
    }
  }

  const handleInspirationalImage1Upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const dataUrl = await processImageFile(file)
        setBannerDataLocal((prev) => ({
          ...prev,
          inspirationalImage1: dataUrl,
        }))
      } catch (error) {
        console.error("Error uploading inspirational image 1:", error)
        alert(error instanceof Error ? error.message : "Failed to upload image")
      }
    }
  }

  const handleInspirationalImage2Upload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const dataUrl = await processImageFile(file)
        setBannerDataLocal((prev) => ({
          ...prev,
          inspirationalImage2: dataUrl,
        }))
      } catch (error) {
        console.error("Error uploading inspirational image 2:", error)
        alert(error instanceof Error ? error.message : "Failed to upload image")
      }
    }
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

  // Enhanced image drawing function with proper error handling
  const drawImageWithFilters = async (
    ctx: CanvasRenderingContext2D,
    imageSrc: string,
    filters: ImageFilters,
    x: number,
    y: number,
    width: number,
    height: number,
  ) => {
    try {
      const img = await loadImage(imageSrc)

      ctx.save()

      // Apply basic filters
      ctx.filter = getFilterString(filters)

      // Draw the image
      ctx.drawImage(img, x, y, width, height)

      ctx.restore()
    } catch (error) {
      console.error("Error drawing image:", error)
      // Draw placeholder
      ctx.save()
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(x, y, width, height)
      ctx.fillStyle = "#9ca3af"
      ctx.font = "16px Inter, sans-serif"
      ctx.textAlign = "center"
      ctx.fillText("Image Error", x + width / 2, y + height / 2)
      ctx.restore()
    }
  }

  const generateBanner = async () => {
    if (!canvasRef.current) return

    setIsGenerating(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    try {
      // Set canvas dimensions based on resolution with proper aspect ratio
      const dimensions =
        bannerDataLocal.resolution === "4k" ? { width: 3840, height: 2160 } : { width: 1920, height: 1080 }
      canvas.width = dimensions.width
      canvas.height = dimensions.height

      const scale = bannerDataLocal.resolution === "4k" ? 2 : 1

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      if (bannerDataLocal.designTheme === "social_gallery") {
        await drawSocialGallery()
      } else if (bannerDataLocal.designTheme === "instagram_mood") {
        await drawInstagramMoodBoard()
      } else if (bannerDataLocal.designTheme === "inspirational_vibes") {
        await drawInspirationalVibes()
      } else {
        await drawOriginalDesign()
      }

      async function drawInspirationalVibes() {
        // Create beautiful gradient background
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
        gradient.addColorStop(0, "#4a90a4")
        gradient.addColorStop(0.5, "#5ba3b8")
        gradient.addColorStop(1, "#6bb6cc")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // Top section with title and author
        const topSectionHeight = canvas.height * 0.45

        // Author name in top right
        if (bannerDataLocal.authorName) {
          ctx.fillStyle = "#ffffff"
          ctx.font = `${bannerDataLocal.textStyles.authorNameSize * scale}px ${fontOptions[bannerDataLocal.textStyles.authorNameFont]}`
          ctx.textAlign = "right"
          ctx.fillText(bannerDataLocal.authorName, canvas.width - 40 * scale, 60 * scale)
        }

        // Main title
        if (bannerDataLocal.productName) {
          ctx.fillStyle = "#ffffff"
          ctx.font = `bold ${bannerDataLocal.textStyles.productNameSize * scale}px ${fontOptions[bannerDataLocal.textStyles.productNameFont]}`
          ctx.textAlign = "left"
          ctx.fillText(bannerDataLocal.productName, 40 * scale, 280 * scale)
        }

        // Bottom white card section
        const cardY = topSectionHeight
        const cardHeight = canvas.height - topSectionHeight - 40 * scale
        const cardMargin = 30 * scale

        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.roundRect(cardMargin, cardY, canvas.width - cardMargin * 2, cardHeight, 20 * scale)
        ctx.fill()

        // Main image with filters
        if (bannerDataLocal.inspirationalImage1) {
          const imageY = cardY + 90 * scale
          const imageHeight = cardHeight * 0.5
          const imageWidth = canvas.width - cardMargin * 2 - 40 * scale
          const imageX = cardMargin + 20 * scale

          ctx.save()
          ctx.beginPath()
          ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 15 * scale)
          ctx.clip()

          await drawImageWithFilters(
            ctx,
            bannerDataLocal.inspirationalImage1,
            bannerDataLocal.imageFilters.inspirationalImage1,
            imageX,
            imageY,
            imageWidth,
            imageHeight,
          )

          ctx.restore()
        }

        // Inspirational text
        if (bannerDataLocal.inspirationalText) {
          const textY = cardY + cardHeight * 0.65
          ctx.fillStyle = "#6b7280"
          ctx.font = `${bannerDataLocal.textStyles.inspirationalTextSize * scale}px ${fontOptions[bannerDataLocal.textStyles.inspirationalTextFont]}`
          ctx.textAlign = "left"

          const maxWidth = canvas.width * 0.5
          const words = bannerDataLocal.inspirationalText.split(" ")
          let line = ""
          let y = textY + 40 * scale
          const lineHeight = 22 * scale

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

      async function drawSocialGallery() {
        // Use simple gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "#f8fafc")
        gradient.addColorStop(1, "#e2e8f0")
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        const frameMargin = 40 * scale
        const frameWidth = canvas.width - frameMargin * 2
        const frameHeight = canvas.height * 0.9
        const frameX = frameMargin
        const frameY = (canvas.height - frameHeight) / 2

        // Draw main container
        ctx.fillStyle = "#ffffff"
        ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
        ctx.shadowBlur = 20 * scale
        ctx.shadowOffsetY = 5 * scale
        ctx.beginPath()
        ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 20 * scale)
        ctx.fill()
        ctx.shadowColor = "transparent"

        // Header
        const headerHeight = 80 * scale
        const headerY = frameY + 20 * scale

        ctx.fillStyle = "#1e293b"
        ctx.beginPath()
        ctx.roundRect(frameX + 20 * scale, headerY, frameWidth - 40 * scale, headerHeight, 15 * scale)
        ctx.fill()

        // Shop name
        if (bannerDataLocal.shopName) {
          ctx.fillStyle = "#ffffff"
          ctx.font = `bold ${bannerDataLocal.textStyles.shopNameSize * scale}px ${fontOptions[bannerDataLocal.textStyles.shopNameFont]}`
          ctx.textAlign = "center"
          ctx.fillText(bannerDataLocal.shopName, frameX + frameWidth / 2, headerY + headerHeight / 2 + 12 * scale)
        }

        // Main horizontal image
        const mainImageY = headerY + headerHeight + 25 * scale
        const mainImageHeight = frameHeight * 0.48
        const mainImageWidth = frameWidth - 50 * scale
        const mainImageX = frameX + 25 * scale

        if (bannerDataLocal.horizontalImage) {
          ctx.save()
          ctx.beginPath()
          ctx.roundRect(mainImageX, mainImageY, mainImageWidth, mainImageHeight, 15 * scale)
          ctx.clip()

          await drawImageWithFilters(
            ctx,
            bannerDataLocal.horizontalImage,
            bannerDataLocal.imageFilters.horizontalImage,
            mainImageX,
            mainImageY,
            mainImageWidth,
            mainImageHeight,
          )

          ctx.restore()
        }

        // Vertical images
        const verticalImagesY = mainImageY + mainImageHeight + 20 * scale
        const verticalImageHeight = frameHeight * 0.22
        const verticalImageWidth = (mainImageWidth - 20 * scale) / 3

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

        for (let index = 0; index < verticalImages.length; index++) {
          const imageSrc = verticalImages[index]
          const imageX = mainImageX + index * (verticalImageWidth + 10 * scale)

          if (imageSrc) {
            ctx.save()
            ctx.beginPath()
            ctx.roundRect(imageX, verticalImagesY, verticalImageWidth, verticalImageHeight, 12 * scale)
            ctx.clip()

            await drawImageWithFilters(
              ctx,
              imageSrc,
              verticalFilters[index],
              imageX,
              verticalImagesY,
              verticalImageWidth,
              verticalImageHeight,
            )

            ctx.restore()
          }
        }

        // Text content
        const textStartY = verticalImagesY + verticalImageHeight + 40 * scale

        if (bannerDataLocal.productName) {
          ctx.fillStyle = "#1e293b"
          ctx.font = `bold ${bannerDataLocal.textStyles.productNameSize * scale}px ${fontOptions[bannerDataLocal.textStyles.productNameFont]}`
          ctx.textAlign = "left"
          ctx.fillText(bannerDataLocal.productName, frameX + 25 * scale, textStartY)
        }

        if (bannerDataLocal.description) {
          ctx.fillStyle = "#374151"
          ctx.font = `${bannerDataLocal.textStyles.descriptionSize * scale}px ${fontOptions[bannerDataLocal.textStyles.descriptionFont]}`
          ctx.textAlign = "left"

          const maxWidth = frameWidth - 50 * scale
          const words = bannerDataLocal.description.split(" ")
          let line = ""
          let y = textStartY + 40 * scale
          const lineHeight = 25 * scale

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " "
            const metrics = ctx.measureText(testLine)

            if (metrics.width > maxWidth && n > 0) {
              ctx.fillText(line, frameX + 25 * scale, y)
              line = words[n] + " "
              y += lineHeight
              if (y > frameY + frameHeight - 50 * scale) break
            } else {
              line = testLine
            }
          }
          ctx.fillText(line, frameX + 25 * scale, y)
        }

        // Price
        if (bannerDataLocal.price) {
          const footerY = frameY + frameHeight - 45 * scale
          ctx.fillStyle = "#fbbf24"
          ctx.font = `bold ${bannerDataLocal.textStyles.priceSize * scale}px ${fontOptions[bannerDataLocal.textStyles.priceFont]}`
          ctx.textAlign = "center"
          ctx.fillText(`$${bannerDataLocal.price}`, frameX + frameWidth / 2, footerY - 5 * scale)
        }
      }

      async function drawInstagramMoodBoard() {
        const frameMargin = 80 * scale
        const frameWidth = canvas.width - frameMargin * 2
        const frameHeight = canvas.height * 0.7
        const frameX = frameMargin
        const frameY = (canvas.height - frameHeight) / 2 - 100 * scale

        // Draw main white frame
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 20 * scale)
        ctx.fill()

        // Header text
        if (bannerDataLocal.shopName) {
          ctx.fillStyle = "#2d5a3d"
          ctx.font = `${45 * scale}px Dancing Script, cursive`
          ctx.textAlign = "left"
          ctx.fillText(bannerDataLocal.shopName, frameX + 30 * scale, frameY + 60 * scale)
        }

        // Product image
        if (bannerDataLocal.productImage) {
          const imageMargin = 30 * scale
          const imageWidth = frameWidth - imageMargin * 2
          const imageHeight = frameHeight * 0.6
          const imageX = frameX + imageMargin
          const imageY = frameY + 80 * scale

          ctx.save()
          ctx.beginPath()
          ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 10 * scale)
          ctx.clip()

          await drawImageWithFilters(
            ctx,
            bannerDataLocal.productImage,
            bannerDataLocal.imageFilters.productImage,
            imageX,
            imageY,
            imageWidth,
            imageHeight,
          )

          ctx.restore()
        }
      }

      async function drawOriginalDesign() {
        const theme = themes[bannerDataLocal.designTheme]

        // Draw product image if available
        if (bannerDataLocal.productImage) {
          const imageSize = Math.min(canvas.width * 0.8, canvas.height * 0.5)
          const imageX = (canvas.width - imageSize) / 2
          const imageY = canvas.height * 0.15

          ctx.save()
          ctx.beginPath()
          const radius = 40 * scale
          ctx.roundRect(imageX, imageY, imageSize, imageSize, radius)
          ctx.clip()

          await drawImageWithFilters(
            ctx,
            bannerDataLocal.productImage,
            bannerDataLocal.imageFilters.productImage,
            imageX,
            imageY,
            imageSize,
            imageSize,
          )

          ctx.restore()
        }

        // Draw text
        ctx.fillStyle = theme.shopNameColor
        ctx.font = `bold ${bannerDataLocal.textStyles.shopNameSize * scale}px ${fontOptions[bannerDataLocal.textStyles.shopNameFont]}`
        ctx.textAlign = "center"
        ctx.fillText(bannerDataLocal.shopName, canvas.width / 2, canvas.height * 0.75)

        ctx.fillStyle = theme.productNameColor
        const productFontSize =
          bannerDataLocal.designTheme === "elegant_cursive"
            ? bannerDataLocal.textStyles.productNameSize * scale
            : 40 * scale
        ctx.font = `${productFontSize}px ${theme.productNameFont}`
        ctx.fillText(bannerDataLocal.productName, canvas.width / 2, canvas.height * 0.82)
      }
    } catch (error) {
      console.error("Error generating banner:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadBanner = (format = "png") => {
    if (!canvasRef.current) return

    // Ensure canvas is ready and has content
    if (canvasRef.current.width === 0 || canvasRef.current.height === 0) {
      console.error("Canvas not ready for download")
      return
    }

    const canvas = canvasRef.current
    let mimeType: string
    let quality = 1.0

    // Set proper MIME type and quality based on format
    switch (format.toLowerCase()) {
      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg"
        quality = 0.95 // High quality for JPEG
        break
      case "webp":
        mimeType = "image/webp"
        quality = 0.95
        break
      case "png":
      default:
        mimeType = "image/png"
        quality = 1.0 // PNG doesn't use quality parameter
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
        } else {
          console.error("Failed to create blob from canvas")
          alert("Failed to download image. Please try again.")
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
      bannerDataLocal.description ||
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Social Banner Creator
            <Sparkles className="inline-block w-10 h-10 ml-3 text-yellow-500" />
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create stunning social media banners with professional templates, advanced filters, and customizable
            designs. Perfect for businesses, creators, and marketers.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/editor">
                <Edit className="w-5 h-5 mr-2" />
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => (
            <Card key={stat.name} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <stat.icon className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.name}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
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
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                        <Sparkles className="w-3 h-3 mr-1" />
                        {feature.badge}
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{feature.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                  <Button asChild className="w-full group-hover:bg-blue-600 transition-colors">
                    <Link href={feature.href}>Explore Feature</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Start Section */}
        <Card className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-blue-200 mb-12">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-white rounded-full shadow-lg">
                  <Sparkles className="w-12 h-12 text-blue-600" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900">Ready to Get Started?</h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Jump right into creating your first social media banner or explore our new Maritime Adventure template.
                No design experience required!
              </p>
              <div className="flex justify-center gap-4 flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link href="/editor">
                    <Edit className="w-5 h-5 mr-2" />
                    Create Banner
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild className="border-blue-300 hover:bg-blue-50 bg-transparent">
                  <Link href="/maritime">
                    <Anchor className="w-5 h-5 mr-2" />
                    Try Maritime Template
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <ImageIcon className="w-6 h-6" />
                Banner Creator
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
                    <Label htmlFor="description">Product Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of your product"
                      value={bannerDataLocal.description}
                      onChange={(e) => setBannerDataLocal((prev) => ({ ...prev, description: e.target.value }))}
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

                  <DragDropZone
                    label="Product Image"
                    currentImage={bannerDataLocal.productImage}
                    onFileUpload={(file) => {
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          setBannerDataLocal((prev) => ({ ...prev, productImage: e.target?.result as string }))
                        }
                        reader.readAsDataURL(file)
                      } else {
                        setBannerDataLocal((prev) => ({ ...prev, productImage: null }))
                      }
                    }}
                  />

                  <DragDropZone
                    label="Main Horizontal Image"
                    currentImage={bannerDataLocal.horizontalImage}
                    onFileUpload={(file) => {
                      if (file) {
                        const reader = new FileReader()
                        reader.onload = (e) => {
                          setBannerDataLocal((prev) => ({ ...prev, horizontalImage: e.target?.result as string }))
                        }
                        reader.readAsDataURL(file)
                      } else {
                        setBannerDataLocal((prev) => ({ ...prev, horizontalImage: null }))
                      }
                    }}
                  />

                  <div className="space-y-2">
                    <Label>Vertical Images (3 images)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((num) => (
                        <DragDropZone
                          key={num}
                          label={`Image ${num}`}
                          currentImage={bannerDataLocal[`verticalImage${num}` as keyof BannerData] as string}
                          onFileUpload={(file) => {
                            if (file) {
                              const reader = new FileReader()
                              reader.onload = (e) => {
                                setBannerDataLocal((prev) => ({
                                  ...prev,
                                  [`verticalImage${num}`]: e.target?.result as string,
                                }))
                              }
                              reader.readAsDataURL(file)
                            } else {
                              setBannerDataLocal((prev) => ({
                                ...prev,
                                [`verticalImage${num}`]: null,
                              }))
                            }
                          }}
                          compact={true}
                        />
                      ))}
                    </div>
                  </div>

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
                    <Label>Download Resolution</Label>
                    <Select
                      value={bannerDataLocal.resolution}
                      onValueChange={(value: "1080" | "4k") =>
                        setBannerDataLocal((prev) => ({ ...prev, resolution: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1080">Standard (1920x1080)</SelectItem>
                        <SelectItem value="4k">4K (3840x2160)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="filters" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5" />
                      <h3 className="font-semibold">Professional Image Filters</h3>
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
                      <div className="grid grid-cols-3 gap-2">
                        {Object.keys(filterPresets).map((preset) => (
                          <Button
                            key={preset}
                            variant={currentFilters.preset === preset ? "default" : "outline"}
                            size="sm"
                            onClick={() => applyFilterPreset(preset)}
                            className="capitalize text-xs"
                          >
                            {preset === "blackwhite" ? "B&W" : preset}
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
                          <Label>Blur: {currentFilters.blur}px</Label>
                          <Slider
                            value={[currentFilters.blur]}
                            onValueChange={([value]) => updateFilter("blur", value)}
                            min={0}
                            max={10}
                            step={0.1}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Sepia: {currentFilters.sepia}%</Label>
                          <Slider
                            value={[currentFilters.sepia]}
                            onValueChange={([value]) => updateFilter("sepia", value)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Grayscale: {currentFilters.grayscale}%</Label>
                          <Slider
                            value={[currentFilters.grayscale]}
                            onValueChange={([value]) => updateFilter("grayscale", value)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Hue Rotate: {currentFilters.hueRotate}°</Label>
                          <Slider
                            value={[currentFilters.hueRotate]}
                            onValueChange={([value]) => updateFilter("hueRotate", value)}
                            min={0}
                            max={360}
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
                      <h3 className="font-semibold">Text Styling</h3>
                    </div>

                    <div className="space-y-6">
                      {/* Shop Name Styling */}
                      <div className="space-y-3 p-4 border rounded-lg">
                        <Label className="font-semibold text-base">Shop Name</Label>
                        <div className="grid grid-cols-2 gap-3">
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
                        <div className="grid grid-cols-2 gap-3">
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
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Download Banner"}
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

          {/* Preview Section */}
          <Card className="shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-6 h-6" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden relative">
                {bannerDataLocal.shopName || bannerDataLocal.productName ? (
                  bannerDataLocal.designTheme === "instagram_mood" ? (
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
                          <div className="flex-1 rounded overflow-hidden mb-4">
                            <img
                              src={bannerDataLocal.productImage || "/placeholder.svg"}
                              alt="Product"
                              className="w-full h-full object-cover"
                              style={{ filter: getFilterString(bannerDataLocal.imageFilters.productImage) }}
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
                      </div>

                      {(bannerDataLocal.productName || bannerDataLocal.description) && (
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-green-800/90 text-white p-3 rounded-lg text-xs max-w-xs">
                          {bannerDataLocal.productName && (
                            <p className="font-semibold">product: {bannerDataLocal.productName}</p>
                          )}
                          {bannerDataLocal.description && <p className="mt-1">{bannerDataLocal.description}</p>}
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

                        {/* Text content */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            {bannerDataLocal.productName && (
                              <h3 className="text-slate-800 font-bold text-lg">{bannerDataLocal.productName}</h3>
                            )}
                            {bannerDataLocal.price && (
                              <span className="text-green-600 font-bold text-lg">${bannerDataLocal.price}</span>
                            )}
                          </div>

                          {bannerDataLocal.description && (
                            <p className="text-gray-700 text-sm leading-relaxed">{bannerDataLocal.description}</p>
                          )}

                          <div className="border-t border-yellow-400 pt-2 flex justify-center text-xs text-gray-500 italic">
                            <span style={{ fontFamily: "Dancing Script, cursive" }}>
                              ✨ Crafted by {bannerDataLocal.shopName || "Premium Shop"} ✨
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
                    // Original preview for other themes
                    <div
                      className="w-full h-full flex flex-col items-center justify-center p-6"
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
                        <div className="w-4/5 aspect-square rounded-2xl overflow-hidden shadow-xl mb-6">
                          <img
                            src={bannerDataLocal.productImage || "/placeholder.svg"}
                            alt="Product"
                            className="w-full h-full object-cover"
                            style={{ filter: getFilterString(bannerDataLocal.imageFilters.productImage) }}
                          />
                        </div>
                      ) : (
                        <div className="w-4/5 aspect-square rounded-2xl bg-white/30 flex items-center justify-center mb-6 shadow-xl">
                          <span className="text-6xl">📷</span>
                        </div>
                      )}

                      {bannerDataLocal.shopName && (
                        <h2
                          className="text-2xl font-bold text-center mb-2"
                          style={{
                            color: themes[bannerDataLocal.designTheme].shopNameColor,
                            fontFamily: themes[bannerDataLocal.designTheme].shopNameFont,
                          }}
                        >
                          {bannerDataLocal.shopName}
                        </h2>
                      )}

                      {bannerDataLocal.productName && (
                        <p
                          className="text-xl text-center leading-tight"
                          style={{
                            color: themes[bannerDataLocal.designTheme].productNameColor,
                            fontFamily: themes[bannerDataLocal.designTheme].productNameFont,
                          }}
                        >
                          {bannerDataLocal.productName}
                        </p>
                      )}

                      {bannerDataLocal.designTheme === "elegant_cursive" && (
                        <div
                          className="w-2/5 h-0.5 mt-4"
                          style={{ backgroundColor: themes[bannerDataLocal.designTheme].accent }}
                        />
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
        </div>

        {/* Hidden canvas for generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

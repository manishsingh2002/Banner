"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Upload, ImageIcon, Palette, Sliders } from "lucide-react"

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

const textureTypes = {
  none: "No Texture",
  paper: "Paper",
  canvas: "Canvas",
  fabric: "Fabric",
  linen: "Linen",
  watercolor: "Watercolor Paper",
  parchment: "Parchment",
  cardboard: "Cardboard",
  leather: "Leather",
  wood: "Wood Grain",
}

const blendModes = {
  overlay: "Overlay",
  multiply: "Multiply",
  screen: "Screen",
  softLight: "Soft Light",
  hardLight: "Hard Light",
  colorBurn: "Color Burn",
  colorDodge: "Color Dodge",
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
  soft: {
    brightness: 115,
    contrast: 85,
    saturation: 90,
    blur: 1,
    sepia: 10,
    grayscale: 0,
    hueRotate: 0,
    hdr: 0,
    vignette: 10,
    filmGrain: 5,
    textureType: "fabric",
    textureIntensity: 15,
    textureBlendMode: "softLight",
  },
  cool: {
    brightness: 105,
    contrast: 110,
    saturation: 110,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 200,
    hdr: 15,
    vignette: 0,
    filmGrain: 0,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
  warm: {
    brightness: 110,
    contrast: 105,
    saturation: 115,
    blur: 0,
    sepia: 20,
    grayscale: 0,
    hueRotate: 30,
    hdr: 10,
    vignette: 15,
    filmGrain: 8,
    textureType: "canvas",
    textureIntensity: 20,
    textureBlendMode: "overlay",
  },
  neon: {
    brightness: 120,
    contrast: 140,
    saturation: 150,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 280,
    hdr: 25,
    vignette: 0,
    filmGrain: 0,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
  dreamy: {
    brightness: 120,
    contrast: 80,
    saturation: 110,
    blur: 2,
    sepia: 15,
    grayscale: 0,
    hueRotate: 320,
    hdr: 0,
    vignette: 20,
    filmGrain: 12,
    textureType: "watercolor",
    textureIntensity: 25,
    textureBlendMode: "softLight",
  },
  hdr: {
    brightness: 110,
    contrast: 130,
    saturation: 125,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    hdr: 50,
    vignette: 10,
    filmGrain: 0,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
  cinematic: {
    brightness: 95,
    contrast: 125,
    saturation: 110,
    blur: 0,
    sepia: 5,
    grayscale: 0,
    hueRotate: 15,
    hdr: 20,
    vignette: 40,
    filmGrain: 20,
    textureType: "none",
    textureIntensity: 0,
    textureBlendMode: "overlay",
  },
  film: {
    brightness: 105,
    contrast: 115,
    saturation: 95,
    blur: 0,
    sepia: 25,
    grayscale: 0,
    hueRotate: 0,
    hdr: 0,
    vignette: 30,
    filmGrain: 35,
    textureType: "paper",
    textureIntensity: 20,
    textureBlendMode: "multiply",
  },
  portrait: {
    brightness: 108,
    contrast: 110,
    saturation: 105,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    hdr: 15,
    vignette: 25,
    filmGrain: 5,
    textureType: "fabric",
    textureIntensity: 10,
    textureBlendMode: "softLight",
  },
  landscape: {
    brightness: 105,
    contrast: 120,
    saturation: 115,
    blur: 0,
    sepia: 0,
    grayscale: 0,
    hueRotate: 0,
    hdr: 35,
    vignette: 15,
    filmGrain: 0,
    textureType: "canvas",
    textureIntensity: 15,
    textureBlendMode: "overlay",
  },
  artistic: {
    brightness: 110,
    contrast: 115,
    saturation: 105,
    blur: 0,
    sepia: 10,
    grayscale: 0,
    hueRotate: 0,
    hdr: 10,
    vignette: 20,
    filmGrain: 15,
    textureType: "canvas",
    textureIntensity: 40,
    textureBlendMode: "overlay",
  },
  vintage_paper: {
    brightness: 115,
    contrast: 110,
    saturation: 85,
    blur: 0,
    sepia: 40,
    grayscale: 0,
    hueRotate: 15,
    hdr: 0,
    vignette: 30,
    filmGrain: 25,
    textureType: "parchment",
    textureIntensity: 50,
    textureBlendMode: "multiply",
  },
  fabric_art: {
    brightness: 105,
    contrast: 105,
    saturation: 95,
    blur: 0,
    sepia: 5,
    grayscale: 0,
    hueRotate: 0,
    hdr: 0,
    vignette: 15,
    filmGrain: 10,
    textureType: "linen",
    textureIntensity: 35,
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

export default function SocialBannerCreator() {
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
  const [templates, setTemplates] = useState([])
  const [isExporting, setIsExporting] = useState(false)
  const [exportFormats, setExportFormats] = useState(["png"])
  const [brandColors, setBrandColors] = useState(["#059669", "#84cc16", "#3b82f6"])
  const [autoColorExtraction, setAutoColorExtraction] = useState(true)

  const [isGenerating, setIsGenerating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const horizontalImageRef = useRef<HTMLInputElement>(null)
  const verticalImageRefs = useRef<(HTMLInputElement | null)[]>([])
  const inspirationalImage1Ref = useRef<HTMLInputElement>(null)
  const inspirationalImage2Ref = useRef<HTMLInputElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBannerData((prev) => ({
          ...prev,
          productImage: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleHorizontalImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBannerData((prev) => ({
          ...prev,
          horizontalImage: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVerticalImageUpload = (event: React.ChangeEvent<HTMLInputElement>, imageNumber: 1 | 2 | 3) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBannerData((prev) => ({
          ...prev,
          [`verticalImage${imageNumber}`]: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInspirationalImage1Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBannerData((prev) => ({
          ...prev,
          inspirationalImage1: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleInspirationalImage2Upload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setBannerData((prev) => ({
          ...prev,
          inspirationalImage2: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const applyFilterPreset = (preset: string) => {
    const presetFilters = filterPresets[preset as keyof typeof filterPresets]
    setBannerData((prev) => ({
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
    setBannerData((prev) => ({
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
    setBannerData((prev) => ({
      ...prev,
      imageFilters: {
        ...prev.imageFilters,
        [selectedImageForFilter]: { ...defaultFilters },
      },
    }))
  }

  const createTexture = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    textureType: string,
  ): HTMLCanvasElement => {
    const textureCanvas = document.createElement("canvas")
    const textureCtx = textureCanvas.getContext("2d")!
    textureCanvas.width = width
    textureCanvas.height = height

    switch (textureType) {
      case "paper":
        // Create paper texture with subtle noise
        const paperImageData = textureCtx.createImageData(width, height)
        for (let i = 0; i < paperImageData.data.length; i += 4) {
          const noise = Math.random() * 40 - 20
          const baseColor = 240 + noise
          paperImageData.data[i] = baseColor // Red
          paperImageData.data[i + 1] = baseColor - 5 // Green
          paperImageData.data[i + 2] = baseColor - 10 // Blue
          paperImageData.data[i + 3] = 255 // Alpha
        }
        textureCtx.putImageData(paperImageData, 0, 0)
        break

      case "canvas":
        // Create canvas texture with crosshatch pattern
        textureCtx.fillStyle = "#f5f5f0"
        textureCtx.fillRect(0, 0, width, height)
        textureCtx.strokeStyle = "rgba(200, 200, 190, 0.3)"
        textureCtx.lineWidth = 0.5

        for (let x = 0; x < width; x += 3) {
          textureCtx.beginPath()
          textureCtx.moveTo(x, 0)
          textureCtx.lineTo(x, height)
          textureCtx.stroke()
        }
        for (let y = 0; y < height; y += 3) {
          textureCtx.beginPath()
          textureCtx.moveTo(0, y)
          textureCtx.lineTo(width, y)
          textureCtx.stroke()
        }
        break

      case "fabric":
        // Create fabric texture with woven pattern
        textureCtx.fillStyle = "#f8f8f6"
        textureCtx.fillRect(0, 0, width, height)
        textureCtx.fillStyle = "rgba(220, 220, 210, 0.4)"

        for (let x = 0; x < width; x += 4) {
          for (let y = 0; y < height; y += 4) {
            if ((x + y) % 8 === 0) {
              textureCtx.fillRect(x, y, 2, 2)
            }
          }
        }
        break

      case "linen":
        // Create linen texture with irregular weave
        textureCtx.fillStyle = "#faf9f7"
        textureCtx.fillRect(0, 0, width, height)
        textureCtx.fillStyle = "rgba(210, 205, 195, 0.3)"

        for (let x = 0; x < width; x += 2) {
          for (let y = 0; y < height; y += 2) {
            if (Math.random() > 0.7) {
              textureCtx.fillRect(x, y, 1, 1)
            }
          }
        }
        break

      case "watercolor":
        // Create watercolor paper texture
        const watercolorImageData = textureCtx.createImageData(width, height)
        for (let i = 0; i < watercolorImageData.data.length; i += 4) {
          const noise = Math.random() * 30 - 15
          const baseColor = 250 + noise
          watercolorImageData.data[i] = baseColor // Red
          watercolorImageData.data[i + 1] = baseColor // Green
          watercolorImageData.data[i + 2] = baseColor + 5 // Blue
          watercolorImageData.data[i + 3] = 255 // Alpha
        }
        textureCtx.putImageData(watercolorImageData, 0, 0)
        break

      case "parchment":
        // Create aged parchment texture
        textureCtx.fillStyle = "#f4f1e8"
        textureCtx.fillRect(0, 0, width, height)
        const parchmentImageData = textureCtx.createImageData(width, height)
        for (let i = 0; i < parchmentImageData.data.length; i += 4) {
          const noise = Math.random() * 25 - 12
          parchmentImageData.data[i] = 244 + noise // Red
          parchmentImageData.data[i + 1] = 241 + noise - 5 // Green
          parchmentImageData.data[i + 2] = 232 + noise - 10 // Blue
          parchmentImageData.data[i + 3] = 255 // Alpha
        }
        textureCtx.putImageData(parchmentImageData, 0, 0)
        break

      case "cardboard":
        // Create cardboard texture
        textureCtx.fillStyle = "#d4c4a8"
        textureCtx.fillRect(0, 0, width, height)
        textureCtx.strokeStyle = "rgba(180, 160, 130, 0.4)"
        textureCtx.lineWidth = 1

        for (let y = 0; y < height; y += 8) {
          textureCtx.beginPath()
          textureCtx.moveTo(0, y)
          textureCtx.lineTo(width, y)
          textureCtx.stroke()
        }
        break

      case "leather":
        // Create leather texture
        textureCtx.fillStyle = "#8b4513"
        textureCtx.fillRect(0, 0, width, height)
        for (let i = 0; i < 200; i++) {
          const x = Math.random() * width
          const y = Math.random() * height
          const size = Math.random() * 3 + 1
          textureCtx.fillStyle = `rgba(${139 + Math.random() * 40}, ${69 + Math.random() * 30}, ${19 + Math.random() * 20}, 0.3)`
          textureCtx.beginPath()
          textureCtx.arc(x, y, size, 0, Math.PI * 2)
          textureCtx.fill()
        }
        break

      case "wood":
        // Create wood grain texture
        textureCtx.fillStyle = "#deb887"
        textureCtx.fillRect(0, 0, width, height)
        textureCtx.strokeStyle = "rgba(160, 120, 80, 0.3)"
        textureCtx.lineWidth = 2

        for (let y = 0; y < height; y += 12) {
          textureCtx.beginPath()
          textureCtx.moveTo(0, y + Math.sin(y * 0.1) * 3)
          for (let x = 0; x < width; x += 10) {
            textureCtx.lineTo(x, y + Math.sin((x + y) * 0.05) * 3)
          }
          textureCtx.stroke()
        }
        break

      default:
        // No texture
        textureCtx.fillStyle = "transparent"
        textureCtx.fillRect(0, 0, width, height)
        break
    }

    return textureCanvas
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

  const applyImageFilter = (
    ctx: CanvasRenderingContext2D,
    filters: ImageFilters,
    canvas?: HTMLCanvasElement,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
  ) => {
    // Apply basic CSS filters
    ctx.filter = getFilterString(filters)

    // For advanced effects, we'll apply them after drawing the image
    return {
      needsAdvancedFilters: filters.vignette > 0 || filters.filmGrain > 0 || filters.textureType !== "none",
      filters,
    }
  }

  const applyAdvancedFilters = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    filters: ImageFilters,
    x = 0,
    y = 0,
    width: number = canvas.width,
    height: number = canvas.height,
  ) => {
    // Apply texture overlay
    if (filters.textureType !== "none" && filters.textureIntensity > 0) {
      const textureCanvas = createTexture(ctx, width, height, filters.textureType)
      ctx.save()
      ctx.globalAlpha = filters.textureIntensity / 100
      ctx.globalCompositeOperation = filters.textureBlendMode as GlobalCompositeOperation
      ctx.drawImage(textureCanvas, x, y, width, height)
      ctx.restore()
    }

    // Apply vignette effect
    if (filters.vignette > 0) {
      const centerX = x + width / 2
      const centerY = y + height / 2
      const maxDistance = Math.sqrt((width / 2) * (width / 2) + (height / 2) * (height / 2))

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, maxDistance)
      gradient.addColorStop(0, `rgba(0, 0, 0, 0)`)
      gradient.addColorStop(0.6, `rgba(0, 0, 0, 0)`)
      gradient.addColorStop(1, `rgba(0, 0, 0, ${filters.vignette / 100})`)

      ctx.save()
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, width, height)
      ctx.restore()
    }

    // Apply film grain effect
    if (filters.filmGrain > 0) {
      const imageData = ctx.getImageData(x, y, width, height)
      const data = imageData.data
      const intensity = filters.filmGrain / 100

      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * intensity * 255
        data[i] = Math.max(0, Math.min(255, data[i] + noise)) // Red
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise)) // Green
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise)) // Blue
      }

      ctx.putImageData(imageData, x, y)
    }
  }

  // AI-powered color extraction from uploaded images
  const extractColorsFromImage = async (imageUrl: string) => {
    // This would integrate with a color extraction API
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    return new Promise((resolve) => {
      img.onload = () => {
        canvas.width = img.width
        canvas.height = img.height
        ctx?.drawImage(img, 0, 0)

        // Extract dominant colors (simplified version)
        const colors = ["#059669", "#84cc16", "#3b82f6", "#f59e0b", "#ef4444"]
        resolve(colors)
      }
      img.src = imageUrl
    })
  }

  // Batch export functionality
  const exportMultipleFormats = async () => {
    setIsExporting(true)
    const formats = ["png", "jpg", "webp"]

    for (const format of formats) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      downloadBanner(format)
    }

    setIsExporting(false)
  }

  // Smart text suggestions based on product category
  const generateSmartSuggestions = (productName: string) => {
    const suggestions = {
      fashion: ["Trendy", "Stylish", "Premium Quality", "Limited Edition"],
      food: ["Fresh", "Delicious", "Organic", "Handcrafted"],
      tech: ["Innovative", "Smart", "Advanced", "Next-Gen"],
      default: ["Quality", "Premium", "Exclusive", "Special Offer"],
    }

    // Simple keyword matching (in real app, use AI/ML)
    if (productName.toLowerCase().includes("shirt") || productName.toLowerCase().includes("dress")) {
      return suggestions.fashion
    }
    return suggestions.default
  }

  const generateBanner = async () => {
    if (!canvasRef.current) return

    setIsGenerating(true)
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions based on resolution
    const dimensions = bannerData.resolution === "4k" ? { width: 2160, height: 3840 } : { width: 1080, height: 1920 }
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    const scale = bannerData.resolution === "4k" ? 2 : 1

    if (bannerData.designTheme === "social_gallery") {
      // Load and draw background image
      const bgImg = new Image()
      bgImg.crossOrigin = "anonymous"
      bgImg.onload = () => {
        ctx.filter = "blur(6px)"
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        ctx.filter = "none"
        drawSocialGallery()
      }
      bgImg.src = "/nature-bg.jpg"
    } else if (bannerData.designTheme === "instagram_mood") {
      // Load and draw background image
      const bgImg = new Image()
      bgImg.crossOrigin = "anonymous"
      bgImg.onload = () => {
        // Draw blurred background
        ctx.filter = "blur(8px)"
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height)
        ctx.filter = "none"

        // Add overlay for better contrast
        ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        drawInstagramMoodBoard()
      }
      bgImg.src = "/reference-bg.jpg"
    } else if (bannerData.designTheme === "inspirational_vibes") {
      drawInspirationalVibes()
    } else {
      // Original theme logic for other themes
      const theme = themes[bannerData.designTheme]
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)

      if (bannerData.designTheme === "vibrant") {
        gradient.addColorStop(0, "#fbbf24")
        gradient.addColorStop(0.5, "#f59e0b")
        gradient.addColorStop(1, "#d97706")
      } else if (bannerData.designTheme === "minimalist") {
        gradient.addColorStop(0, "#f8fafc")
        gradient.addColorStop(1, "#e2e8f0")
      } else {
        gradient.addColorStop(0, "#fdfbfb")
        gradient.addColorStop(1, "#ebedee")
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      drawOriginalDesign()
    }

    function drawInspirationalVibes() {
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
      if (bannerData.authorName) {
        ctx.fillStyle = "#ffffff"
        ctx.font = `${20 * scale}px Inter, sans-serif`
        ctx.textAlign = "right"
        ctx.fillText(bannerData.authorName, canvas.width - 40 * scale, 60 * scale)
      }

      // Decorative elements (color palette simulation)
      const paletteY = 120 * scale
      const paletteX = 40 * scale

      // White rectangle
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(paletteX, paletteY, 80 * scale, 30 * scale)

      // Color circles
      const colors = ["#8bb3c7", "#d4a574", "#c7b299"]
      colors.forEach((color, index) => {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(paletteX + 20 * scale + index * 25 * scale, paletteY + 60 * scale, 12 * scale, 0, 2 * Math.PI)
        ctx.fill()
      })

      // Main title
      if (bannerData.productName) {
        ctx.fillStyle = "#ffffff"
        ctx.font = `bold ${72 * scale}px Inter, sans-serif`
        ctx.textAlign = "left"
        ctx.fillText(bannerData.productName, 40 * scale, 280 * scale)
      }

      // Color and Font labels
      ctx.fillStyle = "#ffffff"
      ctx.font = `${24 * scale}px Inter, sans-serif`
      ctx.textAlign = "left"
      ctx.fillText("Color", 40 * scale, 200 * scale)
      ctx.fillText("Font", 40 * scale, 350 * scale)
      ctx.fillText("Poppins", 40 * scale, 380 * scale)

      // Archive credit
      if (bannerData.shopName) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.8)"
        ctx.font = `${16 * scale}px Inter, sans-serif`
        ctx.textAlign = "right"
        ctx.fillText(`Archived By @${bannerData.shopName}`, canvas.width - 40 * scale, topSectionHeight - 40 * scale)
      }

      // Bottom white card section
      const cardY = topSectionHeight
      const cardHeight = canvas.height - topSectionHeight - 40 * scale
      const cardMargin = 30 * scale

      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.roundRect(cardMargin, cardY, canvas.width - cardMargin * 2, cardHeight, 20 * scale)
      ctx.fill()

      // Self Reminder tag
      ctx.fillStyle = "#8bb3c7"
      ctx.beginPath()
      ctx.roundRect(60 * scale, cardY + 30 * scale, 160 * scale, 40 * scale, 20 * scale)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = `${18 * scale}px Inter, sans-serif`
      ctx.textAlign = "center"
      ctx.fillText("Self Reminder", 140 * scale, cardY + 55 * scale)

      // Main image with filters
      if (bannerData.inspirationalImage1) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const imageY = cardY + 90 * scale
          const imageHeight = cardHeight * 0.5
          const imageWidth = canvas.width - cardMargin * 2 - 40 * scale
          const imageX = cardMargin + 20 * scale

          ctx.save()
          ctx.beginPath()
          ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 15 * scale)
          ctx.clip()

          // Apply basic filters
          const filterResult = applyImageFilter(ctx, bannerData.imageFilters.inspirationalImage1)
          ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight)

          // Apply advanced filters if needed
          if (filterResult.needsAdvancedFilters) {
            applyAdvancedFilters(ctx, canvas, filterResult.filters, imageX, imageY, imageWidth, imageHeight)
          }

          ctx.restore()

          drawInspirationalText()
        }
        img.src = bannerData.inspirationalImage1
      } else {
        drawInspirationalText()
      }

      function drawInspirationalText() {
        const textY = cardY + cardHeight * 0.65

        // Page and Today headers
        ctx.fillStyle = "#374151"
        ctx.font = `bold ${24 * scale}px Inter, sans-serif`
        ctx.textAlign = "left"
        ctx.fillText("Page", 60 * scale, textY)

        ctx.textAlign = "right"
        ctx.fillText("Today", canvas.width - 60 * scale, textY)

        // Decorative line
        ctx.strokeStyle = "#374151"
        ctx.lineWidth = 3 * scale
        ctx.beginPath()
        ctx.moveTo(canvas.width * 0.4, textY + 10 * scale)
        ctx.lineTo(canvas.width * 0.6, textY + 10 * scale)
        ctx.stroke()

        // Inspirational text
        if (bannerData.inspirationalText) {
          ctx.fillStyle = "#6b7280"
          ctx.font = `${16 * scale}px Inter, sans-serif`
          ctx.textAlign = "left"

          const maxWidth = canvas.width * 0.5
          const words = bannerData.inspirationalText.split(" ")
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

        // Date section
        const dateBoxX = canvas.width - 180 * scale
        const dateBoxY = textY + 30 * scale

        ctx.fillStyle = "#6b7280"
        ctx.beginPath()
        ctx.roundRect(dateBoxX, dateBoxY, 120 * scale, 80 * scale, 10 * scale)
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.font = `bold ${36 * scale}px Inter, sans-serif`
        ctx.textAlign = "center"
        ctx.fillText("08", dateBoxX + 60 * scale, dateBoxY + 50 * scale)

        ctx.fillStyle = "#6b7280"
        ctx.beginPath()
        ctx.roundRect(dateBoxX, dateBoxY + 85 * scale, 120 * scale, 35 * scale, 10 * scale)
        ctx.fill()

        ctx.fillStyle = "#ffffff"
        ctx.font = `${16 * scale}px Inter, sans-serif`
        ctx.fillText(bannerData.dateText || "January", dateBoxX + 60 * scale, dateBoxY + 105 * scale)

        // Author signature
        ctx.fillStyle = "#374151"
        ctx.font = `${14 * scale}px Inter, sans-serif`
        ctx.textAlign = "left"
        ctx.fillText("Askar Akmil Design", 60 * scale, cardY + cardHeight - 40 * scale)
        ctx.fillText("Typography Editor", 60 * scale, cardY + cardHeight - 20 * scale)

        setIsGenerating(false)
      }
    }

    function drawSocialGallery() {
      // Use simple gradient background instead of image
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

      // Draw main container with subtle shadow
      ctx.fillStyle = "#ffffff"
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      ctx.shadowBlur = 20 * scale
      ctx.shadowOffsetY = 5 * scale
      ctx.beginPath()
      ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 20 * scale)
      ctx.fill()
      ctx.shadowColor = "transparent"

      // PREMIUM HEADER DESIGN
      const headerHeight = 80 * scale
      const headerY = frameY + 20 * scale

      // Header background with gradient
      const headerGradient = ctx.createLinearGradient(frameX, headerY, frameX + frameWidth, headerY)
      headerGradient.addColorStop(0, "#1e293b")
      headerGradient.addColorStop(0.5, "#334155")
      headerGradient.addColorStop(1, "#1e293b")
      ctx.fillStyle = headerGradient
      ctx.beginPath()
      ctx.roundRect(frameX + 20 * scale, headerY, frameWidth - 40 * scale, headerHeight, 15 * scale)
      ctx.fill()

      // Premium decorative lines
      ctx.strokeStyle = "#fbbf24"
      ctx.lineWidth = 3 * scale
      ctx.beginPath()
      ctx.moveTo(frameX + 40 * scale, headerY + 20 * scale)
      ctx.lineTo(frameX + 120 * scale, headerY + 20 * scale)
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(frameX + frameWidth - 120 * scale, headerY + headerHeight - 20 * scale)
      ctx.lineTo(frameX + frameWidth - 40 * scale, headerY + headerHeight - 20 * scale)
      ctx.stroke()

      // Shop name in premium style
      if (bannerData.shopName) {
        ctx.fillStyle = "#ffffff"
        ctx.font = `bold ${36 * scale}px "Dancing Script", cursive`
        ctx.textAlign = "center"
        ctx.fillText(bannerData.shopName, frameX + frameWidth / 2, headerY + headerHeight / 2 + 12 * scale)

        // Add subtle text shadow
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
        ctx.shadowBlur = 5 * scale
        ctx.shadowOffsetX = 2 * scale
        ctx.shadowOffsetY = 2 * scale
        ctx.fillText(bannerData.shopName, frameX + frameWidth / 2, headerY + headerHeight / 2 + 12 * scale)
        ctx.shadowColor = "transparent"
      }

      // Premium corner decorations
      ctx.fillStyle = "#fbbf24"
      ctx.beginPath()
      ctx.arc(frameX + 35 * scale, headerY + headerHeight - 15 * scale, 4 * scale, 0, 2 * Math.PI)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(frameX + frameWidth - 35 * scale, headerY + 15 * scale, 4 * scale, 0, 2 * Math.PI)
      ctx.fill()

      // Main horizontal image - positioned after header
      const mainImageY = headerY + headerHeight + 25 * scale
      const mainImageHeight = frameHeight * 0.48 // Increased from 0.35 to 0.48
      const mainImageWidth = frameWidth - 50 * scale
      const mainImageX = frameX + 25 * scale

      if (bannerData.horizontalImage) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          ctx.save()
          ctx.beginPath()
          ctx.roundRect(mainImageX, mainImageY, mainImageWidth, mainImageHeight, 15 * scale)
          ctx.clip()

          // Apply basic filters
          const filterResult = applyImageFilter(ctx, bannerData.imageFilters.horizontalImage)
          ctx.drawImage(img, mainImageX, mainImageY, mainImageWidth, mainImageHeight)

          // Apply advanced filters if needed
          if (filterResult.needsAdvancedFilters) {
            applyAdvancedFilters(
              ctx,
              canvas,
              filterResult.filters,
              mainImageX,
              mainImageY,
              mainImageWidth,
              mainImageHeight,
            )
          }

          ctx.restore()

          // Add premium border
          ctx.strokeStyle = "#e2e8f0"
          ctx.lineWidth = 2 * scale
          ctx.beginPath()
          ctx.roundRect(mainImageX, mainImageY, mainImageWidth, mainImageHeight, 15 * scale)
          ctx.stroke()

          drawVerticalImages()
        }
        img.src = bannerData.horizontalImage
      } else {
        // Better placeholder
        ctx.fillStyle = "#f8fafc"
        ctx.beginPath()
        ctx.roundRect(mainImageX, mainImageY, mainImageWidth, mainImageHeight, 15 * scale)
        ctx.fill()

        ctx.strokeStyle = "#e2e8f0"
        ctx.lineWidth = 2 * scale
        ctx.setLineDash([10 * scale, 10 * scale])
        ctx.beginPath()
        ctx.roundRect(mainImageX, mainImageY, mainImageWidth, mainImageHeight, 15 * scale)
        ctx.stroke()
        ctx.setLineDash([])

        ctx.fillStyle = "#94a3b8"
        ctx.font = `${32 * scale}px Inter, sans-serif`
        ctx.textAlign = "center"
        ctx.fillText("📷", mainImageX + mainImageWidth / 2, mainImageY + mainImageHeight / 2 + 12 * scale)

        drawVerticalImages()
      }

      function drawVerticalImages() {
        const verticalImagesY = mainImageY + mainImageHeight + 20 * scale
        const verticalImageHeight = frameHeight * 0.22 // Slightly reduced to make room for larger main image
        const verticalImageWidth = (mainImageWidth - 20 * scale) / 3

        const verticalImages = [bannerData.verticalImage1, bannerData.verticalImage2, bannerData.verticalImage3]
        const verticalFilters = [
          bannerData.imageFilters.verticalImage1,
          bannerData.imageFilters.verticalImage2,
          bannerData.imageFilters.verticalImage3,
        ]

        verticalImages.forEach((imageSrc, index) => {
          const imageX = mainImageX + index * (verticalImageWidth + 10 * scale)

          if (imageSrc) {
            const img = new Image()
            img.crossOrigin = "anonymous"
            img.onload = () => {
              ctx.save()
              ctx.beginPath()
              ctx.roundRect(imageX, verticalImagesY, verticalImageWidth, verticalImageHeight, 12 * scale)
              ctx.clip()

              // Apply basic filters
              const filterResult = applyImageFilter(ctx, verticalFilters[index])
              ctx.drawImage(img, imageX, verticalImagesY, verticalImageWidth, verticalImageHeight)

              // Apply advanced filters if needed
              if (filterResult.needsAdvancedFilters) {
                applyAdvancedFilters(
                  ctx,
                  canvas,
                  filterResult.filters,
                  imageX,
                  verticalImagesY,
                  verticalImageWidth,
                  verticalImageHeight,
                )
              }

              ctx.restore()

              // Add premium border
              ctx.strokeStyle = "#e2e8f0"
              ctx.lineWidth = 1 * scale
              ctx.beginPath()
              ctx.roundRect(imageX, verticalImagesY, verticalImageWidth, verticalImageHeight, 12 * scale)
              ctx.stroke()
            }
            img.src = imageSrc
          } else {
            // Better placeholder
            ctx.fillStyle = "#f8fafc"
            ctx.beginPath()
            ctx.roundRect(imageX, verticalImagesY, verticalImageWidth, verticalImageHeight, 12 * scale)
            ctx.fill()

            ctx.strokeStyle = "#e2e8f0"
            ctx.lineWidth = 1 * scale
            ctx.setLineDash([5 * scale, 5 * scale])
            ctx.beginPath()
            ctx.roundRect(imageX, verticalImagesY, verticalImageWidth, verticalImageHeight, 12 * scale)
            ctx.stroke()
            ctx.setLineDash([])

            ctx.fillStyle = "#94a3b8"
            ctx.font = `${20 * scale}px Inter, sans-serif`
            ctx.textAlign = "center"
            ctx.fillText("📷", imageX + verticalImageWidth / 2, verticalImagesY + verticalImageHeight / 2 + 8 * scale)
          }
        })

        drawSocialGalleryText()
      }

      function drawSocialGalleryText() {
        // Position text BELOW the vertical images
        const textStartY = mainImageY + mainImageHeight + frameHeight * 0.25 + 40 * scale

        // Product name and price header - now properly positioned below images
        const headerY = textStartY

        if (bannerData.productName) {
          ctx.fillStyle = "#1e293b"
          ctx.font = `bold ${34 * scale}px Inter, sans-serif`
          ctx.textAlign = "left"
          ctx.fillText(bannerData.productName, frameX + 25 * scale, headerY)
        }

        // Description with better formatting
        if (bannerData.description) {
          ctx.fillStyle = "#374151"
          ctx.font = `${18 * scale}px Inter, sans-serif`
          ctx.textAlign = "left"

          const maxWidth = frameWidth - 50 * scale
          const words = bannerData.description.split(" ")
          let line = ""
          let y = headerY + 40 * scale
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

        // Premium footer with brand signature and price
        const footerY = frameY + frameHeight - 45 * scale // Increased space for price

        // Premium divider
        const dividerGradient = ctx.createLinearGradient(frameX + 25 * scale, 0, frameX + frameWidth - 25 * scale, 0)
        dividerGradient.addColorStop(0, "transparent")
        dividerGradient.addColorStop(0.5, "#fbbf24")
        dividerGradient.addColorStop(1, "transparent")
        ctx.strokeStyle = dividerGradient
        ctx.lineWidth = 2 * scale
        ctx.beginPath()
        ctx.moveTo(frameX + 25 * scale, footerY - 25 * scale)
        ctx.lineTo(frameX + frameWidth - 25 * scale, footerY - 25 * scale)
        ctx.stroke()

        // Price in premium gold color
        if (bannerData.price) {
          ctx.fillStyle = "#fbbf24" // Beautiful gold color
          ctx.font = `bold ${24 * scale}px Inter, sans-serif`
          ctx.textAlign = "center"
          ctx.fillText(`💰 $${bannerData.price}`, frameX + frameWidth / 2, footerY - 5 * scale)
        }

        // Premium brand signature
        ctx.fillStyle = "#6b7280"
        ctx.font = `italic ${14 * scale}px "Dancing Script", cursive`
        ctx.textAlign = "center"
        ctx.fillText(
          `✨ Crafted by ${bannerData.shopName || "Premium Shop"} ✨`,
          frameX + frameWidth / 2,
          footerY + 15 * scale,
        )

        setIsGenerating(false)
      }
    }

    function drawInstagramMoodBoard() {
      const frameMargin = 80 * scale
      const frameWidth = canvas.width - frameMargin * 2
      const frameHeight = canvas.height * 0.7
      const frameX = frameMargin
      const frameY = (canvas.height - frameHeight) / 2 - 100 * scale

      // Draw main white frame with rounded corners
      ctx.fillStyle = "#ffffff"
      ctx.beginPath()
      ctx.roundRect(frameX, frameY, frameWidth, frameHeight, 20 * scale)
      ctx.fill()

      // Add subtle shadow
      ctx.shadowColor = "rgba(0, 0, 0, 0.1)"
      ctx.shadowBlur = 20 * scale
      ctx.shadowOffsetY = 10 * scale

      // Draw header text (shop name in cursive)
      if (bannerData.shopName) {
        ctx.fillStyle = "#2d5a3d"
        ctx.font = `${45 * scale}px Dancing Script, cursive`
        ctx.textAlign = "left"
        ctx.fillText(bannerData.shopName, frameX + 30 * scale, frameY + 60 * scale)
      }

      // Draw plus symbols in top right
      ctx.fillStyle = "#2d5a3d"
      ctx.font = `${25 * scale}px Inter, sans-serif`
      ctx.textAlign = "right"
      const plusText = "++++"
      for (let i = 0; i < 3; i++) {
        ctx.fillText(plusText, frameX + frameWidth - 30 * scale, frameY + 40 * scale + i * 25 * scale)
      }

      // Draw product image with filters
      if (bannerData.productImage) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const imageMargin = 30 * scale
          const imageWidth = frameWidth - imageMargin * 2
          const imageHeight = frameHeight * 0.6
          const imageX = frameX + imageMargin
          const imageY = frameY + 80 * scale

          ctx.save()
          ctx.beginPath()
          ctx.roundRect(imageX, imageY, imageWidth, imageHeight, 10 * scale)
          ctx.clip()

          // Apply basic filters
          const filterResult = applyImageFilter(ctx, bannerData.imageFilters.productImage)
          ctx.drawImage(img, imageX, imageY, imageWidth, imageHeight)

          // Apply advanced filters if needed
          if (filterResult.needsAdvancedFilters) {
            applyAdvancedFilters(ctx, canvas, filterResult.filters, imageX, imageY, imageWidth, imageHeight)
          }

          ctx.restore()

          drawColorPalette()
        }
        img.src = bannerData.productImage
      } else {
        drawColorPalette()
      }

      function drawColorPalette() {
        const paletteY = frameY + frameHeight - 120 * scale

        // "COLOR PALLET" text
        ctx.fillStyle = "#1f2937"
        ctx.font = `bold ${28 * scale}px Inter, sans-serif`
        ctx.textAlign = "left"
        ctx.fillText("COLOR", frameX + 30 * scale, paletteY)
        ctx.fillText("PALLET", frameX + 30 * scale, paletteY + 35 * scale)

        // Color swatches
        const colors = ["#7a9b8e", "#5a7c6f", "#8fa69a", "#6b8578", "#4a6b5c"]
        const swatchSize = 25 * scale
        const swatchSpacing = 8 * scale
        const swatchStartX = frameX + 200 * scale

        colors.forEach((color, index) => {
          ctx.fillStyle = color
          ctx.fillRect(
            swatchStartX + index * (swatchSize + swatchSpacing),
            paletteY - 10 * scale,
            swatchSize,
            swatchSize,
          )
        })

        // Attribution text
        if (bannerData.photographer) {
          ctx.fillStyle = "#6b7280"
          ctx.font = `${16 * scale}px Inter, sans-serif`
          ctx.textAlign = "left"
          ctx.fillText(`pict by: ${bannerData.photographer}`, frameX + 200 * scale, paletteY + 50 * scale)
        }

        drawInfoCard()
      }

      function drawInfoCard() {
        const cardY = frameY + frameHeight + 40 * scale
        const cardWidth = frameWidth * 0.8
        const cardHeight = 120 * scale
        const cardX = frameX + (frameWidth - cardWidth) / 2

        // Draw rounded rectangle for info card
        ctx.fillStyle = "rgba(45, 90, 61, 0.9)"
        ctx.beginPath()
        ctx.roundRect(cardX, cardY, cardWidth, cardHeight, 15 * scale)
        ctx.fill()

        // Card content
        ctx.fillStyle = "#ffffff"
        ctx.font = `${16 * scale}px Inter, sans-serif`
        ctx.textAlign = "left"

        if (bannerData.productName) {
          ctx.fillText(`product: ${bannerData.productName}`, cardX + 20 * scale, cardY + 30 * scale)
        }

        if (bannerData.description) {
          // Wrap description text
          const maxWidth = cardWidth - 40 * scale
          const words = bannerData.description.split(" ")
          let line = ""
          let y = cardY + 55 * scale

          for (let n = 0; n < words.length; n++) {
            const testLine = line + words[n] + " "
            const metrics = ctx.measureText(testLine)

            if (metrics.width > maxWidth && n > 0) {
              ctx.fillText(line, cardX + 20 * scale, y)
              line = words[n] + " "
              y += 20 * scale
              if (y > cardY + cardHeight - 20 * scale) break // Prevent overflow
            } else {
              line = testLine
            }
          }
          ctx.fillText(line, cardX + 20 * scale, y)
        }

        // Bookmark icon
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 2 * scale
        ctx.beginPath()
        ctx.roundRect(cardX + cardWidth - 40 * scale, cardY + 15 * scale, 20 * scale, 25 * scale, 2 * scale)
        ctx.stroke()

        // Bookmark triangle
        ctx.fillStyle = "#ffffff"
        ctx.beginPath()
        ctx.moveTo(cardX + cardWidth - 35 * scale, cardY + 35 * scale)
        ctx.lineTo(cardX + cardWidth - 30 * scale, cardY + 30 * scale)
        ctx.lineTo(cardX + cardWidth - 25 * scale, cardY + 35 * scale)
        ctx.fill()

        setIsGenerating(false)
      }
    }

    function drawOriginalDesign() {
      // Keep original design logic for other themes
      const theme = themes[bannerData.designTheme]

      // Draw product image if available
      if (bannerData.productImage) {
        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
          const imageSize = Math.min(canvas.width * 0.8, canvas.height * 0.5)
          const imageX = (canvas.width - imageSize) / 2
          const imageY = canvas.height * 0.15

          ctx.save()
          ctx.beginPath()
          const radius = 40 * scale
          ctx.roundRect(imageX, imageY, imageSize, imageSize, radius)
          ctx.clip()

          // Apply basic filters
          const filterResult = applyImageFilter(ctx, bannerData.imageFilters.productImage)
          ctx.drawImage(img, imageX, imageY, imageSize, imageSize)

          // Apply advanced filters if needed
          if (filterResult.needsAdvancedFilters) {
            applyAdvancedFilters(ctx, canvas, filterResult.filters, imageX, imageY, imageSize, imageSize)
          }

          ctx.restore()

          drawOriginalText()
        }
        img.src = bannerData.productImage
      } else {
        drawOriginalText()
      }

      function drawOriginalText() {
        // Draw shop name
        ctx.fillStyle = theme.shopNameColor
        ctx.font = `bold ${60 * scale}px ${theme.shopNameFont}`
        ctx.textAlign = "center"
        ctx.fillText(bannerData.shopName, canvas.width / 2, canvas.height * 0.75)

        // Draw product name
        ctx.fillStyle = theme.productNameColor
        const productFontSize = bannerData.designTheme === "elegant_cursive" ? 48 * scale : 40 * scale
        ctx.font = `${productFontSize}px ${theme.productNameFont}`
        ctx.fillText(bannerData.productName, canvas.width / 2, canvas.height * 0.82)

        setIsGenerating(false)
      }
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
    const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`

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
        } else {
          console.error("Failed to create blob from canvas")
        }
      },
      mimeType,
      format === "jpg" ? 0.9 : 1.0,
    )
  }

  useEffect(() => {
    if (
      bannerData.shopName ||
      bannerData.productName ||
      bannerData.productImage ||
      bannerData.description ||
      bannerData.photographer ||
      bannerData.horizontalImage ||
      bannerData.verticalImage1 ||
      bannerData.verticalImage2 ||
      bannerData.verticalImage3 ||
      bannerData.inspirationalImage1 ||
      bannerData.inspirationalImage2 ||
      bannerData.inspirationalText ||
      bannerData.authorName ||
      bannerData.dateText ||
      bannerData.price
    ) {
      generateBanner()
    }
  }, [bannerData])

  const currentFilters = bannerData.imageFilters[selectedImageForFilter as keyof typeof bannerData.imageFilters]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Social Share Banner Creator</h1>
          <p className="text-gray-600">Create stunning social media banners with professional texture overlays</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Banner Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="filters">🎨 Filters</TabsTrigger>
                </TabsList>

                <TabsContent value="content" className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Shop Name</Label>
                    <Input
                      id="shopName"
                      placeholder="Enter your shop name"
                      value={bannerData.shopName}
                      onChange={(e) => setBannerData((prev) => ({ ...prev, shopName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      placeholder="Enter product name"
                      value={bannerData.productName}
                      onChange={(e) => setBannerData((prev) => ({ ...prev, productName: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Product Description</Label>
                    <Input
                      id="description"
                      placeholder="Brief description of your product"
                      value={bannerData.description}
                      onChange={(e) => setBannerData((prev) => ({ ...prev, description: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      placeholder="Enter price (without currency symbol)"
                      value={bannerData.price}
                      onChange={(e) => setBannerData((prev) => ({ ...prev, price: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Product Image</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Image
                      </Button>
                      {bannerData.productImage && <span className="text-sm text-green-600">✓ Image uploaded</span>}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Main Horizontal Image</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={() => horizontalImageRef.current?.click()}
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Upload Horizontal
                      </Button>
                      {bannerData.horizontalImage && <span className="text-sm text-green-600">✓ Uploaded</span>}
                    </div>
                    <input
                      ref={horizontalImageRef}
                      type="file"
                      accept="image/*"
                      onChange={handleHorizontalImageUpload}
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Vertical Images (3 images)</Label>
                    <div className="grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((num) => (
                        <div key={num} className="space-y-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => verticalImageRefs.current[num - 1]?.click()}
                            className="w-full"
                          >
                            <Upload className="w-3 h-3 mr-1" />
                            {num}
                          </Button>
                          {bannerData[`verticalImage${num}`] && (
                            <span className="text-xs text-green-600 block text-center">✓</span>
                          )}
                          <input
                            ref={(el) => (verticalImageRefs.current[num - 1] = el)}
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleVerticalImageUpload(e, num as 1 | 2 | 3)}
                            className="hidden"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Design Theme</Label>
                    <Select
                      value={bannerData.designTheme}
                      onValueChange={(
                        value:
                          | "social_gallery"
                          | "instagram_mood"
                          | "minimalist"
                          | "vibrant"
                          | "elegant_cursive"
                          | "inspirational_vibes",
                      ) => setBannerData((prev) => ({ ...prev, designTheme: value }))}
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

                  {bannerData.designTheme === "inspirational_vibes" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="authorName">Author Name</Label>
                        <Input
                          id="authorName"
                          placeholder="Enter author name"
                          value={bannerData.authorName}
                          onChange={(e) => setBannerData((prev) => ({ ...prev, authorName: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="inspirationalText">Inspirational Text</Label>
                        <Input
                          id="inspirationalText"
                          placeholder="Enter inspirational message"
                          value={bannerData.inspirationalText}
                          onChange={(e) => setBannerData((prev) => ({ ...prev, inspirationalText: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="dateText">Date Text</Label>
                        <Input
                          id="dateText"
                          placeholder="Enter month (e.g., January)"
                          value={bannerData.dateText}
                          onChange={(e) => setBannerData((prev) => ({ ...prev, dateText: e.target.value }))}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Main Inspirational Image</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            onClick={() => inspirationalImage1Ref.current?.click()}
                            className="flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Image 1
                          </Button>
                          {bannerData.inspirationalImage1 && <span className="text-sm text-green-600">✓ Uploaded</span>}
                        </div>
                        <input
                          ref={inspirationalImage1Ref}
                          type="file"
                          accept="image/*"
                          onChange={handleInspirationalImage1Upload}
                          className="hidden"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Secondary Image (Optional)</Label>
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            onClick={() => inspirationalImage2Ref.current?.click()}
                            className="flex items-center gap-2"
                          >
                            <Upload className="w-4 h-4" />
                            Upload Image 2
                          </Button>
                          {bannerData.inspirationalImage2 && <span className="text-sm text-green-600">✓ Uploaded</span>}
                        </div>
                        <input
                          ref={inspirationalImage2Ref}
                          type="file"
                          accept="image/*"
                          onChange={handleInspirationalImage2Upload}
                          className="hidden"
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label>Download Resolution</Label>
                    <Select
                      value={bannerData.resolution}
                      onValueChange={(value: "1080" | "4k") =>
                        setBannerData((prev) => ({ ...prev, resolution: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1080">Standard (1080x1920)</SelectItem>
                        <SelectItem value="4k">4K (2160x3840)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </TabsContent>

                <TabsContent value="filters" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Palette className="w-5 h-5" />
                      <h3 className="font-semibold">Professional Image Filters & Textures</h3>
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
                        {Object.keys(filterPresets)
                          .slice(0, 12)
                          .map((preset) => (
                            <Button
                              key={preset}
                              variant={currentFilters.preset === preset ? "default" : "outline"}
                              size="sm"
                              onClick={() => applyFilterPreset(preset)}
                              className="capitalize text-xs"
                            >
                              {preset === "blackwhite" ? "B&W" : preset.replace("_", " ")}
                            </Button>
                          ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>🎨 Artistic Texture Presets</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.keys(filterPresets)
                          .slice(12)
                          .map((preset) => (
                            <Button
                              key={preset}
                              variant={currentFilters.preset === preset ? "default" : "outline"}
                              size="sm"
                              onClick={() => applyFilterPreset(preset)}
                              className="capitalize text-xs"
                            >
                              {preset.replace("_", " ")}
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

                      <div className="space-y-2 border-t pt-4">
                        <Label>🎬 Advanced Effects</Label>

                        <div className="space-y-2">
                          <Label>HDR Effect: {currentFilters.hdr}%</Label>
                          <Slider
                            value={[currentFilters.hdr]}
                            onValueChange={([value]) => updateFilter("hdr", value)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500">Enhances dynamic range and color depth</p>
                        </div>

                        <div className="space-y-2">
                          <Label>Vignette: {currentFilters.vignette}%</Label>
                          <Slider
                            value={[currentFilters.vignette]}
                            onValueChange={([value]) => updateFilter("vignette", value)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500">Darkens edges for dramatic focus</p>
                        </div>

                        <div className="space-y-2">
                          <Label>Film Grain: {currentFilters.filmGrain}%</Label>
                          <Slider
                            value={[currentFilters.filmGrain]}
                            onValueChange={([value]) => updateFilter("filmGrain", value)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500">Adds authentic film texture</p>
                        </div>
                      </div>

                      <div className="space-y-2 border-t pt-4">
                        <Label>🎨 Texture Overlays</Label>

                        <div className="space-y-2">
                          <Label>Texture Type</Label>
                          <Select
                            value={currentFilters.textureType}
                            onValueChange={(value) => updateFilter("textureType", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(textureTypes).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Texture Intensity: {currentFilters.textureIntensity}%</Label>
                          <Slider
                            value={[currentFilters.textureIntensity]}
                            onValueChange={([value]) => updateFilter("textureIntensity", value)}
                            min={0}
                            max={100}
                            step={1}
                            className="w-full"
                          />
                          <p className="text-xs text-gray-500">Controls texture visibility and strength</p>
                        </div>

                        <div className="space-y-2">
                          <Label>Blend Mode</Label>
                          <Select
                            value={currentFilters.textureBlendMode}
                            onValueChange={(value) => updateFilter("textureBlendMode", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(blendModes).map(([key, label]) => (
                                <SelectItem key={key} value={key}>
                                  {label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-gray-500">How texture blends with the image</p>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button variant="outline" onClick={resetFilters} className="flex-1">
                          Reset All
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <Label>Filter Preview</Label>
                      <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                        {bannerData[selectedImageForFilter as keyof BannerData] ? (
                          <img
                            src={
                              (bannerData[selectedImageForFilter as keyof BannerData] as string) || "/placeholder.svg"
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
              </Tabs>

              <div className="space-y-4 border-t pt-6">
                <h3 className="font-semibold text-lg">🚀 AI-Powered Features</h3>

                <div className="space-y-2">
                  <Label>Smart Color Palette</Label>
                  <div className="flex gap-2">
                    {brandColors.map((color, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full border-2 border-gray-300"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setBrandColors([
                          "#" + Math.floor(Math.random() * 16777215).toString(16),
                          ...brandColors.slice(0, 2),
                        ])
                      }
                    >
                      Generate New
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Export Formats</Label>
                  <div className="flex gap-2">
                    {["PNG", "JPG", "WebP", "SVG"].map((format) => (
                      <Button
                        key={format}
                        variant={exportFormats.includes(format.toLowerCase()) ? "default" : "outline"}
                        size="sm"
                        onClick={() => {
                          const fmt = format.toLowerCase()
                          setExportFormats((prev) =>
                            prev.includes(fmt) ? prev.filter((f) => f !== fmt) : [...prev, fmt],
                          )
                        }}
                      >
                        {format}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              <Button
                onClick={downloadBanner}
                disabled={!bannerData.shopName || !bannerData.productName || isGenerating}
                className="w-full"
                size="lg"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Download Banner"}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
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
                  ) : bannerData.designTheme === "social_gallery" ? (
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
                          {[bannerData.verticalImage1, bannerData.verticalImage2, bannerData.verticalImage3].map(
                            (image, index) => (
                              <div key={index} className="rounded-md overflow-hidden">
                                {image ? (
                                  <img
                                    src={image || "/placeholder.svg"}
                                    alt={`Vertical ${index + 1}`}
                                    className="w-full h-full object-cover border border-slate-200"
                                    style={{
                                      filter: getFilterString(
                                        bannerData.imageFilters[
                                          `verticalImage${index + 1}` as keyof typeof bannerData.imageFilters
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
                            ),
                          )}
                        </div>

                        {/* Text content - positioned below images */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            {bannerData.productName && (
                              <h3 className="text-slate-800 font-bold text-lg">{bannerData.productName}</h3>
                            )}
                            {bannerData.price && (
                              <span className="text-green-600 font-bold text-lg">${bannerData.price}</span>
                            )}
                          </div>

                          {bannerData.description && (
                            <p className="text-gray-700 text-sm leading-relaxed">{bannerData.description}</p>
                          )}

                          <div className="border-t border-yellow-400 pt-2 flex justify-center text-xs text-gray-500 italic">
                            <span style={{ fontFamily: "Dancing Script, cursive" }}>
                              ✨ Crafted by {bannerData.shopName || "Premium Shop"} ✨
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : bannerData.designTheme === "inspirational_vibes" ? (
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
                        {bannerData.shopName && (
                          <p className="text-xs opacity-80 mt-4">Archived By @{bannerData.shopName}</p>
                        )}
                      </div>
                      <div className="bg-white rounded-lg p-3 h-3/5 flex flex-col">
                        <div className="bg-blue-300 text-white px-3 py-1 rounded-full text-xs w-fit mb-3">
                          Self Reminder
                        </div>
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
                  ) : (
                    // Original preview for other themes
                    <div
                      className="w-full h-full flex flex-col items-center justify-center p-6"
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
                        <h2
                          className="text-2xl font-bold text-center mb-2"
                          style={{
                            color: themes[bannerData.designTheme].shopNameColor,
                            fontFamily: themes[bannerData.designTheme].shopNameFont,
                          }}
                        >
                          {bannerData.shopName}
                        </h2>
                      )}

                      {bannerData.productName && (
                        <p
                          className="text-xl text-center leading-tight"
                          style={{
                            color: themes[bannerData.designTheme].productNameColor,
                            fontFamily: themes[bannerData.designTheme].productNameFont,
                          }}
                        >
                          {bannerData.productName}
                        </p>
                      )}

                      {bannerData.designTheme === "elegant_cursive" && (
                        <div
                          className="w-2/5 h-0.5 mt-4"
                          style={{ backgroundColor: themes[bannerData.designTheme].accent }}
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

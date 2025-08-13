"use client"

import { useRef, useState, useCallback } from "react"
import type { BannerData, ImageFilters } from "@/types/banner"

export function useBannerRenderer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadedImages, setLoadedImages] = useState<{ [key: string]: HTMLImageElement }>({})

  const loadImage = useCallback(
    (src: string): Promise<HTMLImageElement> => {
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
    },
    [loadedImages],
  )

  const getCanvasDimensions = (resolution: string) => {
    switch (resolution) {
      case "instagram_post":
        return { width: 1080, height: 1080 }
      case "instagram_story":
        return { width: 1080, height: 1920 }
      case "hd":
        return { width: 1920, height: 1080 }
      case "4k":
        return { width: 3840, height: 2160 }
      default:
        return { width: 1080, height: 1080 }
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
    const filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%) hue-rotate(${filters.hueRotate}deg)`

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
  }

  const renderSocialGallery = async (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    scale: number,
    bannerData: BannerData,
  ) => {
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#f8fafc")
    gradient.addColorStop(1, "#e2e8f0")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Main container
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

    // Header section
    const headerHeight = Math.max(80 * scale, 80)
    const headerY = containerY + 10 * scale

    const headerGradient = ctx.createLinearGradient(0, headerY, 0, headerY + headerHeight)
    headerGradient.addColorStop(0, "#1e293b")
    headerGradient.addColorStop(0.3, "#334155")
    headerGradient.addColorStop(0.7, "#475569")
    headerGradient.addColorStop(1, "#1e293b")
    ctx.fillStyle = headerGradient
    ctx.beginPath()
    ctx.roundRect(containerX + 10 * scale, headerY, containerWidth - 20 * scale, headerHeight, 12 * scale)
    ctx.fill()

    // Shop name
    if (bannerData.shopName) {
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${Math.min(bannerData.textStyles.shopNameSize * scale, containerWidth / 8)}px ${bannerData.textStyles.shopNameFont}`
      ctx.textAlign = "center"
      ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
      ctx.shadowBlur = 4 * scale
      ctx.shadowOffsetY = 2 * scale
      ctx.fillText(bannerData.shopName, containerX + containerWidth / 2, headerY + headerHeight / 2 + 8 * scale)
      ctx.shadowColor = "transparent"
    }

    // Main image section
    const mainImageY = headerY + headerHeight + 15 * scale
    const mainImageHeight = containerHeight * 0.55
    const mainImageWidth = containerWidth - 20 * scale
    const mainImageX = containerX + 10 * scale

    if (bannerData.horizontalImage && loadedImages[bannerData.horizontalImage]) {
      const img = loadedImages[bannerData.horizontalImage]
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
        bannerData.imageFilters.horizontalImage,
      )
      ctx.restore()
    }

    // Three vertical images
    const verticalImagesY = mainImageY + mainImageHeight + 10 * scale
    const verticalImageHeight = containerHeight * 0.25
    const verticalImageWidth = (mainImageWidth - 16 * scale) / 3

    const verticalImages = [bannerData.verticalImage1, bannerData.verticalImage2, bannerData.verticalImage3]
    const verticalFilters = [
      bannerData.imageFilters.verticalImage1,
      bannerData.imageFilters.verticalImage2,
      bannerData.imageFilters.verticalImage3,
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

    // Text content
    const textStartY = verticalImagesY + verticalImageHeight + 15 * scale

    if (bannerData.productName || bannerData.price) {
      const textY = textStartY + 20 * scale

      if (bannerData.productName) {
        ctx.fillStyle = "#1e293b"
        ctx.font = `bold ${Math.min(bannerData.textStyles.productNameSize * scale, containerWidth / 15)}px ${bannerData.textStyles.productNameFont}`
        ctx.textAlign = "left"
        ctx.fillText(bannerData.productName, containerX + 15 * scale, textY)
      }

      if (bannerData.price) {
        ctx.fillStyle = "#059669"
        ctx.font = `bold ${Math.min(bannerData.textStyles.priceSize * scale, containerWidth / 18)}px ${bannerData.textStyles.priceFont}`
        ctx.textAlign = "right"
        ctx.fillText(`$${bannerData.price}`, containerX + containerWidth - 15 * scale, textY)
      }
    }
  }

  const generateBanner = useCallback(
    async (bannerData: BannerData) => {
      if (!canvasRef.current) return

      setIsGenerating(true)
      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      try {
        const dimensions = getCanvasDimensions(bannerData.resolution)
        canvas.width = dimensions.width
        canvas.height = dimensions.height

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = "high"

        ctx.fillStyle = "#ffffff"
        ctx.fillRect(0, 0, dimensions.width, dimensions.height)

        const baseWidth = 1080
        const scale = dimensions.width / baseWidth

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

        // Render based on theme
        switch (bannerData.designTheme) {
          case "social_gallery":
            await renderSocialGallery(ctx, dimensions.width, dimensions.height, scale, bannerData)
            break
          default:
            // Simple default rendering
            ctx.fillStyle = "#f0f0f0"
            ctx.fillRect(0, 0, dimensions.width, dimensions.height)
            ctx.fillStyle = "#333333"
            ctx.font = `${Math.min(48 * scale, dimensions.width / 15)}px Inter`
            ctx.textAlign = "center"
            ctx.fillText("Social Banner", dimensions.width / 2, dimensions.height / 2)
            break
        }
      } catch (error) {
        console.error("Error generating banner:", error)
      } finally {
        setIsGenerating(false)
      }
    },
    [loadImage, loadedImages],
  )

  const downloadBanner = useCallback((bannerData: BannerData, format = "png") => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    let mimeType: string
    let quality = 1.0

    switch (format.toLowerCase()) {
      case "jpg":
      case "jpeg":
        mimeType = "image/jpeg"
        quality = 0.98
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
  }, [])

  return {
    canvasRef,
    isGenerating,
    generateBanner,
    downloadBanner,
  }
}

"use client"

import { useState, useEffect } from "react"
import { HeroSection } from "@/components/hero-section"
import { StatsSection } from "@/components/stats-section"
import { FeaturesGrid } from "@/components/features-grid"
import { BannerEditor } from "@/components/banner-editor/banner-editor"
import { BannerPreview } from "@/components/banner-preview/banner-preview"
import { useBannerRenderer } from "@/hooks/use-banner-renderer"
import type { BannerData, ImageFilters, TextStyles } from "@/types/banner"

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
  const { canvasRef, isGenerating, generateBanner, downloadBanner } = useBannerRenderer()

  const handleMultiImageUpload = (images: { [key: string]: string | null }) => {
    setBannerData((prev) => ({
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

  const updateTextStyle = (property: keyof TextStyles, value: string | number) => {
    setBannerData((prev) => ({
      ...prev,
      textStyles: {
        ...prev.textStyles,
        [property]: value,
      },
    }))
  }

  const getFilterString = (filters: ImageFilters): string => {
    let filterString = `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px) sepia(${filters.sepia}%) grayscale(${filters.grayscale}%) hue-rotate(${filters.hueRotate}deg)`

    if (filters.hdr > 0) {
      const hdrBoost = 1 + filters.hdr / 100
      filterString += ` contrast(${Math.min(200, filters.contrast * hdrBoost)}%) saturate(${Math.min(200, filters.saturation * hdrBoost)}%)`
    }

    return filterString
  }

  const handleDownloadBanner = (format?: string) => {
    downloadBanner(bannerData, format)
  }

  useEffect(() => {
    if (
      bannerData.shopName ||
      bannerData.productName ||
      bannerData.productImage ||
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
      generateBanner(bannerData)
    }
  }, [bannerData, generateBanner])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <HeroSection />
      <StatsSection />
      <FeaturesGrid />

      {/* Main Editor Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <BannerEditor
            bannerData={bannerData}
            setBannerData={setBannerData}
            selectedImageForFilter={selectedImageForFilter}
            setSelectedImageForFilter={setSelectedImageForFilter}
            handleMultiImageUpload={handleMultiImageUpload}
            applyFilterPreset={applyFilterPreset}
            updateFilter={updateFilter}
            resetFilters={resetFilters}
            updateTextStyle={updateTextStyle}
            downloadBanner={handleDownloadBanner}
            isGenerating={isGenerating}
            getFilterString={getFilterString}
          />

          <BannerPreview bannerData={bannerData} getFilterString={getFilterString} />
        </div>

        {/* Hidden canvas for generation */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  )
}

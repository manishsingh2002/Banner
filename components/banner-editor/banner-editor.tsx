"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Instagram } from "lucide-react"
import { ContentTab } from "./content-tab"
import { FiltersTab } from "./filters-tab"
import { TypographyTab } from "./typography-tab"
import type { BannerData, ImageFilters, TextStyles } from "@/types/banner"

interface BannerEditorProps {
  bannerData: BannerData
  setBannerData: React.Dispatch<React.SetStateAction<BannerData>>
  selectedImageForFilter: string
  setSelectedImageForFilter: (value: string) => void
  handleMultiImageUpload: (images: { [key: string]: string | null }) => void
  applyFilterPreset: (preset: string) => void
  updateFilter: (filterName: string, value: number | string) => void
  resetFilters: () => void
  updateTextStyle: (property: keyof TextStyles, value: string | number) => void
  downloadBanner: (format?: string) => void
  isGenerating: boolean
  getFilterString: (filters: ImageFilters) => string
}

export function BannerEditor({
  bannerData,
  setBannerData,
  selectedImageForFilter,
  setSelectedImageForFilter,
  handleMultiImageUpload,
  applyFilterPreset,
  updateFilter,
  resetFilters,
  updateTextStyle,
  downloadBanner,
  isGenerating,
  getFilterString,
}: BannerEditorProps) {
  return (
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
            <ContentTab
              bannerData={bannerData}
              setBannerData={setBannerData}
              handleMultiImageUpload={handleMultiImageUpload}
            />
          </TabsContent>

          <TabsContent value="filters" className="space-y-6">
            <FiltersTab
              bannerData={bannerData}
              selectedImageForFilter={selectedImageForFilter}
              setSelectedImageForFilter={setSelectedImageForFilter}
              applyFilterPreset={applyFilterPreset}
              updateFilter={updateFilter}
              resetFilters={resetFilters}
              getFilterString={getFilterString}
            />
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <TypographyTab bannerData={bannerData} setBannerData={setBannerData} updateTextStyle={updateTextStyle} />
          </TabsContent>
        </Tabs>

        <Button
          onClick={() => downloadBanner("png")}
          disabled={!bannerData.shopName || !bannerData.productName || isGenerating}
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
  )
}

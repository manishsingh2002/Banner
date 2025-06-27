"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useBanner } from "@/contexts/banner-context"
import { Download, FileImage, Settings, Zap } from "lucide-react"

export default function ExportPage() {
  const { bannerData, downloadBanner } = useBanner()
  const [exportFormat, setExportFormat] = useState("png")
  const [exportQuality, setExportQuality] = useState("high")
  const [exportSize, setExportSize] = useState("original")
  const [batchExport, setBatchExport] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const formatOptions = [
    { value: "png", label: "PNG", description: "Best for graphics with transparency" },
    { value: "jpg", label: "JPEG", description: "Best for photos, smaller file size" },
    { value: "webp", label: "WebP", description: "Modern format, great compression" },
    { value: "pdf", label: "PDF", description: "Vector format, scalable" },
  ]

  const qualityOptions = [
    { value: "low", label: "Low (60%)", size: "~200KB" },
    { value: "medium", label: "Medium (80%)", size: "~500KB" },
    { value: "high", label: "High (95%)", size: "~1MB" },
    { value: "maximum", label: "Maximum (100%)", size: "~2MB" },
  ]

  const sizeOptions = [
    {
      value: "original",
      label: "Original Size",
      dimensions: bannerData.resolution === "4k" ? "3840×2160" : "1920×1080",
    },
    { value: "large", label: "Large", dimensions: "1920×1080" },
    { value: "medium", label: "Medium", dimensions: "1280×720" },
    { value: "small", label: "Small", dimensions: "640×360" },
    { value: "square", label: "Square (Instagram)", dimensions: "1080×1080" },
    { value: "story", label: "Story (Instagram)", dimensions: "1080×1920" },
  ]

  const handleExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsExporting(false)
          downloadBanner(exportFormat)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleBatchExport = async () => {
    setIsExporting(true)
    setExportProgress(0)

    const formats = ["png", "jpg", "webp"]
    for (let i = 0; i < formats.length; i++) {
      setExportProgress(((i + 1) / formats.length) * 100)
      await new Promise((resolve) => setTimeout(resolve, 1000))
      downloadBanner(formats[i])
    }

    setIsExporting(false)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Options</h1>
        <p className="text-gray-600">Download your banners in multiple formats and sizes</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Export Settings */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Export Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Format</Label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((format) => (
                      <SelectItem key={format.value} value={format.value}>
                        <div>
                          <div className="font-medium">{format.label}</div>
                          <div className="text-xs text-gray-500">{format.description}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Quality</Label>
                <Select value={exportQuality} onValueChange={setExportQuality}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {qualityOptions.map((quality) => (
                      <SelectItem key={quality.value} value={quality.value}>
                        <div className="flex justify-between w-full">
                          <span>{quality.label}</span>
                          <span className="text-xs text-gray-500">{quality.size}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Size</Label>
                <Select value={exportSize} onValueChange={setExportSize}>
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sizeOptions.map((size) => (
                      <SelectItem key={size.value} value={size.value}>
                        <div>
                          <div className="font-medium">{size.label}</div>
                          <div className="text-xs text-gray-500">{size.dimensions}</div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="batchExport" checked={batchExport} onCheckedChange={setBatchExport} />
                <Label htmlFor="batchExport">Batch export (all formats)</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-3">
              {isExporting ? (
                <div className="space-y-3">
                  <Progress value={exportProgress} className="w-full" />
                  <p className="text-sm text-center text-gray-600">Exporting... {exportProgress}%</p>
                </div>
              ) : (
                <>
                  <Button onClick={handleExport} className="w-full" size="lg">
                    <Download className="w-4 h-4 mr-2" />
                    Export Banner
                  </Button>
                  {batchExport && (
                    <Button onClick={handleBatchExport} variant="outline" className="w-full bg-transparent">
                      <Zap className="w-4 h-4 mr-2" />
                      Batch Export
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview and Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                Export Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileImage className="w-12 h-12 mx-auto mb-4" />
                  <p>Banner preview will appear here</p>
                  <p className="text-sm">
                    Format: {exportFormat.toUpperCase()} | Quality: {exportQuality}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Format:</span>
                  <span className="text-sm font-medium">{exportFormat.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Quality:</span>
                  <span className="text-sm font-medium">{exportQuality}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Dimensions:</span>
                  <span className="text-sm font-medium">
                    {sizeOptions.find((s) => s.value === exportSize)?.dimensions}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Theme:</span>
                  <span className="text-sm font-medium capitalize">{bannerData.designTheme.replace("_", " ")}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Export</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Instagram Post (1080×1080)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Instagram Story (1080×1920)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Facebook Cover (1200×630)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  Twitter Header (1500×500)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                  LinkedIn Banner (1584×396)
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Download, FileImage, Zap } from "lucide-react"
import { useBanner } from "@/contexts/banner-context"

export default function ExportPage() {
  const { bannerData, downloadBanner } = useBanner()
  const [exportSettings, setExportSettings] = useState({
    formats: ["png"],
    sizes: ["1080x1920"],
    quality: "high",
    socialOptimized: true,
    includeWatermark: false,
  })
  const [isExporting, setIsExporting] = useState(false)
  const [exportProgress, setExportProgress] = useState(0)

  const socialSizes = [
    { label: "Instagram Story (1080x1920)", value: "1080x1920" },
    { label: "Instagram Post (1080x1080)", value: "1080x1080" },
    { label: "Facebook Post (1200x630)", value: "1200x630" },
    { label: "Twitter Header (1500x500)", value: "1500x500" },
    { label: "LinkedIn Post (1200x627)", value: "1200x627" },
    { label: "YouTube Thumbnail (1280x720)", value: "1280x720" },
  ]

  const exportMultipleFormats = async () => {
    setIsExporting(true)
    setExportProgress(0)

    const totalFormats = exportSettings.formats.length

    for (let i = 0; i < totalFormats; i++) {
      const format = exportSettings.formats[i]
      await new Promise((resolve) => setTimeout(resolve, 500))
      downloadBanner(format)
      setExportProgress(((i + 1) / totalFormats) * 100)
    }

    setIsExporting(false)
    setExportProgress(0)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Export & Download</h1>
        <p className="text-gray-600">Export your banner in multiple formats and sizes</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Export Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="w-5 h-5" />
                Export Formats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {["PNG", "JPG", "WebP", "PDF"].map((format) => (
                  <div key={format} className="flex items-center space-x-2">
                    <Checkbox
                      id={format}
                      checked={exportSettings.formats.includes(format.toLowerCase())}
                      onCheckedChange={(checked) => {
                        const fmt = format.toLowerCase()
                        setExportSettings((prev) => ({
                          ...prev,
                          formats: checked ? [...prev.formats, fmt] : prev.formats.filter((f) => f !== fmt),
                        }))
                      }}
                    />
                    <label htmlFor={format} className="text-sm font-medium">
                      {format}
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Social Media Sizes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={exportSettings.sizes[0]}
                onValueChange={(value) => setExportSettings((prev) => ({ ...prev, sizes: [value] }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {socialSizes.map((size) => (
                    <SelectItem key={size.value} value={size.value}>
                      {size.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quality Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                value={exportSettings.quality}
                onValueChange={(value) => setExportSettings((prev) => ({ ...prev, quality: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="high">High Quality (95%)</SelectItem>
                  <SelectItem value="medium">Medium Quality (80%)</SelectItem>
                  <SelectItem value="low">Low Quality (60%)</SelectItem>
                </SelectContent>
              </Select>

              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="social-optimized"
                    checked={exportSettings.socialOptimized}
                    onCheckedChange={(checked) =>
                      setExportSettings((prev) => ({ ...prev, socialOptimized: checked as boolean }))
                    }
                  />
                  <label htmlFor="social-optimized" className="text-sm">
                    Optimize for social media
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="watermark"
                    checked={exportSettings.includeWatermark}
                    onCheckedChange={(checked) =>
                      setExportSettings((prev) => ({ ...prev, includeWatermark: checked as boolean }))
                    }
                  />
                  <label htmlFor="watermark" className="text-sm">
                    Include watermark
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Export Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5" />
                Download Options
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isExporting && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Exporting...</span>
                    <span>{Math.round(exportProgress)}%</span>
                  </div>
                  <Progress value={exportProgress} className="w-full" />
                </div>
              )}

              <div className="grid gap-2">
                <Button
                  onClick={() => downloadBanner("png")}
                  disabled={!bannerData.shopName || !bannerData.productName || isExporting}
                  className="w-full"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Quick Download (PNG)
                </Button>

                <Button
                  onClick={exportMultipleFormats}
                  disabled={
                    !bannerData.shopName ||
                    !bannerData.productName ||
                    isExporting ||
                    exportSettings.formats.length === 0
                  }
                  variant="outline"
                  className="w-full bg-transparent"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Batch Export ({exportSettings.formats.length} formats)
                </Button>
              </div>

              {exportSettings.formats.length > 0 && (
                <div className="text-xs text-gray-500">
                  Will export: {exportSettings.formats.map((f) => f.toUpperCase()).join(", ")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Export Preview & History */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Export Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-[9/16] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileImage className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Preview will appear here</p>
                  <p className="text-xs">Size: {exportSettings.sizes[0]}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Export History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "social-banner-1080.png", time: "2 minutes ago", size: "1.2 MB" },
                  { name: "social-banner-1080.jpg", time: "5 minutes ago", size: "890 KB" },
                  { name: "social-banner-4k.png", time: "10 minutes ago", size: "4.8 MB" },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">{item.size}</p>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-xs">
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pro Export Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Batch export to cloud</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">PRO</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Custom watermarks</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">PRO</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">API integration</span>
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">PRO</span>
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">Upgrade to Pro</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

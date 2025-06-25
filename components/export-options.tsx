"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExportOptionsProps {
  onExport: (options: any) => void
}

export function ExportOptions({ onExport }: ExportOptionsProps) {
  const [exportSettings, setExportSettings] = useState({
    formats: ["png"],
    sizes: ["1080x1920"],
    quality: "high",
    socialOptimized: true,
    includeWatermark: false,
  })

  const socialSizes = [
    { label: "Instagram Story (1080x1920)", value: "1080x1920" },
    { label: "Instagram Post (1080x1080)", value: "1080x1080" },
    { label: "Facebook Post (1200x630)", value: "1200x630" },
    { label: "Twitter Header (1500x500)", value: "1500x500" },
    { label: "LinkedIn Post (1200x627)", value: "1200x627" },
    { label: "YouTube Thumbnail (1280x720)", value: "1280x720" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">📤 Export Options</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Export Formats</label>
          <div className="grid grid-cols-2 gap-2">
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
                <label htmlFor={format} className="text-sm">
                  {format}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Social Media Sizes</label>
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
        </div>

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

        <Button onClick={() => onExport(exportSettings)} className="w-full">
          🚀 Export All Formats
        </Button>
      </CardContent>
    </Card>
  )
}

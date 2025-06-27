"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Upload, Trash2, Plus, Palette } from "lucide-react"

interface BrandColor {
  id: string
  name: string
  hex: string
  usage: string
}

interface BrandAsset {
  id: string
  name: string
  type: "logo" | "icon" | "image"
  url: string
  size: string
}

export default function BrandKitPage() {
  const [brandColors, setBrandColors] = useState<BrandColor[]>([
    { id: "1", name: "Primary Blue", hex: "#3B82F6", usage: "Main brand color" },
    { id: "2", name: "Secondary Green", hex: "#10B981", usage: "Accent color" },
    { id: "3", name: "Neutral Gray", hex: "#6B7280", usage: "Text and backgrounds" },
  ])

  const [brandAssets, setBrandAssets] = useState<BrandAsset[]>([
    { id: "1", name: "Main Logo", type: "logo", url: "/placeholder-logo.png", size: "512x512" },
    { id: "2", name: "Icon", type: "icon", url: "/placeholder-logo.svg", size: "64x64" },
  ])

  const [newColor, setNewColor] = useState({ name: "", hex: "#000000", usage: "" })

  const addColor = () => {
    if (newColor.name && newColor.hex) {
      setBrandColors([
        ...brandColors,
        {
          id: Date.now().toString(),
          ...newColor,
        },
      ])
      setNewColor({ name: "", hex: "#000000", usage: "" })
    }
  }

  const removeColor = (id: string) => {
    setBrandColors(brandColors.filter((color) => color.id !== id))
  }

  const removeAsset = (id: string) => {
    setBrandAssets(brandAssets.filter((asset) => asset.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Kit Manager</h1>
        <p className="text-gray-600">Manage your brand colors, logos, and assets for consistent branding</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand Colors */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Brand Colors
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {brandColors.map((color) => (
                <div key={color.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div
                    className="w-12 h-12 rounded-lg border-2 border-gray-200"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{color.name}</div>
                    <div className="text-sm text-gray-600">{color.hex}</div>
                    <div className="text-xs text-gray-500">{color.usage}</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeColor(color.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="border-t pt-4 space-y-3">
                <h4 className="font-medium">Add New Color</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="colorName">Name</Label>
                    <Input
                      id="colorName"
                      placeholder="Color name"
                      value={newColor.name}
                      onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="colorHex">Color</Label>
                    <div className="flex gap-2">
                      <Input
                        id="colorHex"
                        type="color"
                        value={newColor.hex}
                        onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                        className="w-16 h-10 p-1"
                      />
                      <Input
                        placeholder="#000000"
                        value={newColor.hex}
                        onChange={(e) => setNewColor({ ...newColor, hex: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <Label htmlFor="colorUsage">Usage</Label>
                  <Input
                    id="colorUsage"
                    placeholder="How this color is used"
                    value={newColor.usage}
                    onChange={(e) => setNewColor({ ...newColor, usage: e.target.value })}
                  />
                </div>
                <Button onClick={addColor} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Color
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Brand Assets */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5" />
                Brand Assets
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {brandAssets.map((asset) => (
                <div key={asset.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{asset.name}</div>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {asset.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {asset.size}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeAsset(asset.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              <div className="border-t pt-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload new brand assets</p>
                  <Button variant="outline" size="sm">
                    Choose Files
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brand Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="brandName">Brand Name</Label>
                <Input id="brandName" placeholder="Your brand name" />
              </div>
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input id="tagline" placeholder="Your brand tagline" />
              </div>
              <div>
                <Label htmlFor="brandVoice">Brand Voice</Label>
                <Input id="brandVoice" placeholder="Professional, Friendly, Bold..." />
              </div>
              <Button className="w-full">Save Guidelines</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Color Palette Export */}
      <Card>
        <CardHeader>
          <CardTitle>Export Brand Kit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button>Export as CSS</Button>
            <Button variant="outline">Export as JSON</Button>
            <Button variant="outline">Export as Adobe Swatch</Button>
            <Button variant="outline">Generate Style Guide</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

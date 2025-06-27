"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BrandKit } from "@/components/brand-kit"
import { Palette, Save, Upload } from "lucide-react"

export default function BrandKitPage() {
  const [brandData, setBrandData] = useState({
    logo: null,
    primaryColor: "#059669",
    secondaryColor: "#84cc16",
    fontFamily: "Inter",
    brandName: "",
  })

  const [savedKits, setSavedKits] = useState([
    {
      id: 1,
      name: "Tech Startup",
      primaryColor: "#3b82f6",
      secondaryColor: "#1e40af",
      fontFamily: "Inter",
    },
    {
      id: 2,
      name: "Organic Food",
      primaryColor: "#059669",
      secondaryColor: "#84cc16",
      fontFamily: "Poppins",
    },
    {
      id: 3,
      name: "Fashion Brand",
      primaryColor: "#8b5cf6",
      secondaryColor: "#a855f7",
      fontFamily: "Playfair Display",
    },
  ])

  const handleBrandChange = (newBrandData: any) => {
    setBrandData(newBrandData)
  }

  const saveBrandKit = () => {
    if (brandData.brandName) {
      const newKit = {
        id: Date.now(),
        name: brandData.brandName,
        primaryColor: brandData.primaryColor,
        secondaryColor: brandData.secondaryColor,
        fontFamily: brandData.fontFamily,
      }
      setSavedKits((prev) => [...prev, newKit])
      localStorage.setItem("brandKits", JSON.stringify([...savedKits, newKit]))
    }
  }

  const loadBrandKit = (kit: any) => {
    setBrandData((prev) => ({
      ...prev,
      brandName: kit.name,
      primaryColor: kit.primaryColor,
      secondaryColor: kit.secondaryColor,
      fontFamily: kit.fontFamily,
    }))
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Brand Kit Manager</h1>
        <p className="text-gray-600">Manage your brand colors, fonts, and assets for consistent designs</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Brand Kit Editor */}
        <div className="space-y-6">
          <BrandKit onBrandChange={handleBrandChange} />

          {/* AI Color Extraction */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                AI Color Extraction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Upload an image to automatically extract brand colors using AI</p>
              <Button variant="outline" className="w-full bg-transparent">
                <Upload className="w-4 h-4 mr-2" />
                Extract Colors from Image
              </Button>

              <div className="grid grid-cols-5 gap-2">
                {["#e74c3c", "#3498db", "#2ecc71", "#f39c12", "#9b59b6"].map((color, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg border-2 border-gray-200 cursor-pointer hover:border-gray-400 transition-colors"
                    style={{ backgroundColor: color }}
                    onClick={() => setBrandData((prev) => ({ ...prev, primaryColor: color }))}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Palette Generator */}
          <Card>
            <CardHeader>
              <CardTitle>Smart Color Palette</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">Generate complementary colors based on your primary color</p>
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  // Generate complementary colors
                  const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57"]
                  setBrandData((prev) => ({
                    ...prev,
                    secondaryColor: colors[Math.floor(Math.random() * colors.length)],
                  }))
                }}
              >
                Generate Palette
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Saved Brand Kits */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Save className="w-5 h-5" />
                Saved Brand Kits
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {savedKits.map((kit) => (
                <div
                  key={kit.id}
                  className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => loadBrandKit(kit)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold">{kit.name}</h4>
                      <p className="text-sm text-gray-600">{kit.fontFamily}</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: kit.primaryColor }} />
                      <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: kit.secondaryColor }} />
                    </div>
                  </div>
                </div>
              ))}

              <Button onClick={saveBrandKit} disabled={!brandData.brandName} className="w-full">
                Save Current Kit
              </Button>
            </CardContent>
          </Card>

          {/* Brand Guidelines */}
          <Card>
            <CardHeader>
              <CardTitle>Brand Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Primary Color</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: brandData.primaryColor }} />
                    <span className="text-sm font-mono">{brandData.primaryColor}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Secondary Color</Label>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-8 h-8 rounded border" style={{ backgroundColor: brandData.secondaryColor }} />
                    <span className="text-sm font-mono">{brandData.secondaryColor}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Typography</Label>
                  <p className="text-sm mt-1" style={{ fontFamily: brandData.fontFamily }}>
                    {brandData.fontFamily} - The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                Export Brand Guidelines
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface BrandKitProps {
  onBrandChange: (brandData: any) => void
}

export function BrandKit({ onBrandChange }: BrandKitProps) {
  const [brandData, setBrandData] = useState({
    logo: null,
    primaryColor: "#059669",
    secondaryColor: "#84cc16",
    fontFamily: "Inter",
    brandName: "",
  })

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const newBrandData = { ...brandData, logo: e.target?.result as string }
        setBrandData(newBrandData)
        onBrandChange(newBrandData)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">🎨 Brand Kit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Brand Logo</Label>
          <Button variant="outline" onClick={() => document.getElementById("logo-upload")?.click()} className="w-full">
            {brandData.logo ? "✓ Logo Uploaded" : "Upload Logo"}
          </Button>
          <input id="logo-upload" type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={brandData.primaryColor}
                onChange={(e) => {
                  const newBrandData = { ...brandData, primaryColor: e.target.value }
                  setBrandData(newBrandData)
                  onBrandChange(newBrandData)
                }}
                className="w-12 h-8 rounded border"
              />
              <Input
                value={brandData.primaryColor}
                onChange={(e) => {
                  const newBrandData = { ...brandData, primaryColor: e.target.value }
                  setBrandData(newBrandData)
                  onBrandChange(newBrandData)
                }}
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Secondary Color</Label>
            <div className="flex gap-2">
              <input
                type="color"
                value={brandData.secondaryColor}
                onChange={(e) => {
                  const newBrandData = { ...brandData, secondaryColor: e.target.value }
                  setBrandData(newBrandData)
                  onBrandChange(newBrandData)
                }}
                className="w-12 h-8 rounded border"
              />
              <Input
                value={brandData.secondaryColor}
                onChange={(e) => {
                  const newBrandData = { ...brandData, secondaryColor: e.target.value }
                  setBrandData(newBrandData)
                  onBrandChange(newBrandData)
                }}
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <Button
          onClick={() => {
            // Save brand kit to localStorage
            localStorage.setItem("brandKit", JSON.stringify(brandData))
          }}
          className="w-full"
        >
          Save Brand Kit
        </Button>
      </CardContent>
    </Card>
  )
}

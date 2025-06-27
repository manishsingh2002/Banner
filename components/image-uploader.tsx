"use client"

import type React from "react"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Upload } from "lucide-react"
import { useBanner } from "@/contexts/banner-context"

interface ImageUploaderProps {
  label: string
  imageKey: keyof typeof useBanner extends () => { bannerData: infer T } ? keyof T : never
  currentImage: string | null
  compact?: boolean
}

export function ImageUploader({ label, imageKey, currentImage, compact = false }: ImageUploaderProps) {
  const { setBannerData } = useBanner()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
      if (!validTypes.includes(file.type)) {
        reject(new Error(`Invalid file type: ${file.type}. Please use JPG, PNG, WebP, or GIF.`))
        return
      }

      const maxSize = 10 * 1024 * 1024
      if (file.size > maxSize) {
        reject(new Error("File size too large. Please use images smaller than 10MB."))
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          resolve(result)
        } else {
          reject(new Error("Failed to read file"))
        }
      }
      reader.onerror = () => reject(new Error("Failed to read file"))
      reader.readAsDataURL(file)
    })
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      try {
        const dataUrl = await processImageFile(file)
        setBannerData((prev) => ({
          ...prev,
          [imageKey]: dataUrl,
        }))
      } catch (error) {
        console.error("Error uploading image:", error)
        alert(error instanceof Error ? error.message : "Failed to upload image")
      }
    }
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="w-full">
          <Upload className="w-3 h-3 mr-1" />
          {label}
        </Button>
        {currentImage && <span className="text-xs text-green-600 block text-center">✓</span>}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload Image
        </Button>
        {currentImage && <span className="text-sm text-green-600">✓ Image uploaded</span>}
      </div>
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
    </div>
  )
}

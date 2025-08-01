"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"

interface DragDropZoneProps {
  label: string
  currentImage: string | null
  onFileUpload: (file: File | null) => void
  compact?: boolean
  aspectRatio?: "square" | "portrait" | "landscape"
}

export function DragDropZone({
  label,
  currentImage,
  onFileUpload,
  compact = false,
  aspectRatio = "square",
}: DragDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      const file = files[0]
      if (file.type.startsWith("image/")) {
        onFileUpload(file)
      }
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      onFileUpload(file)
    }
  }

  const handleRemoveImage = () => {
    onFileUpload(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "portrait":
        return "aspect-[9/16]" // Instagram Story ratio
      case "landscape":
        return "aspect-[16/9]"
      case "square":
      default:
        return "aspect-square"
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Card
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragging
            ? "border-blue-400 bg-blue-50"
            : currentImage
              ? "border-green-300 bg-green-50"
              : "border-gray-300 hover:border-gray-400"
        } ${compact ? "p-2" : "p-4"}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="p-0">
          {currentImage ? (
            <div className="relative group">
              <div className={`${getAspectRatioClass()} w-full overflow-hidden rounded-lg bg-gray-100`}>
                <img
                  src={currentImage || "/placeholder.svg"}
                  alt={label}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={handleRemoveImage}
              >
                <X className="w-4 h-4" />
              </Button>
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg" />
            </div>
          ) : (
            <div
              className={`${getAspectRatioClass()} w-full flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors rounded-lg`}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  {isDragging ? (
                    <Upload className="w-6 h-6 text-blue-500" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className={`font-medium text-gray-700 ${compact ? "text-xs" : "text-sm"}`}>
                    {isDragging ? "Drop image here" : "Upload Image"}
                  </p>
                  {!compact && <p className="text-xs text-gray-500">Drag & drop or click to browse</p>}
                </div>
              </div>
            </div>
          )}

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </CardContent>
      </Card>
    </div>
  )
}

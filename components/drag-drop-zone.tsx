"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, ImageIcon, X, Crop, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageCropper } from "@/components/image-cropper"
import { cn } from "@/lib/utils"

interface DragDropZoneProps {
  onFileUpload: (file: File) => void
  currentImage?: string | null
  label: string
  accept?: string
  className?: string
  compact?: boolean
  enableCropping?: boolean
  cropAspectRatio?: number
}

export function DragDropZone({
  onFileUpload,
  currentImage,
  label,
  accept = "image/*",
  className,
  compact = false,
  enableCropping = true,
  cropAspectRatio,
}: DragDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [tempImageSrc, setTempImageSrc] = useState<string>("")

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const processFile = useCallback(
    (file: File) => {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
      if (!validTypes.includes(file.type)) {
        alert(`Invalid file type: ${file.type}. Please use JPG, PNG, WebP, or GIF.`)
        return
      }

      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert("File size too large. Please use images smaller than 10MB.")
        return
      }

      setIsUploading(true)
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (result) {
          if (enableCropping) {
            setTempImageSrc(result)
            setShowCropper(true)
          } else {
            onFileUpload(file)
          }
        }
        setIsUploading(false)
      }
      reader.onerror = () => {
        alert("Failed to read file")
        setIsUploading(false)
      }
      reader.readAsDataURL(file)
    },
    [enableCropping, onFileUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files)
      const imageFile = files.find((file) => file.type.startsWith("image/"))

      if (imageFile) {
        processFile(imageFile)
      }
    },
    [processFile],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile],
  )

  const handleCropComplete = useCallback(
    (croppedImageSrc: string) => {
      // Convert data URL back to File object
      fetch(croppedImageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `cropped-${Date.now()}.png`, { type: "image/png" })
          onFileUpload(file)
        })
      setShowCropper(false)
      setTempImageSrc("")
    },
    [onFileUpload],
  )

  const removeImage = useCallback(() => {
    onFileUpload(null as any)
  }, [onFileUpload])

  const openCropper = useCallback(() => {
    if (currentImage) {
      setTempImageSrc(currentImage)
      setShowCropper(true)
    }
  }, [currentImage])

  return (
    <>
      <div className={cn("space-y-2", className)}>
        <label className="text-sm font-medium text-gray-700">{label}</label>

        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer group",
            compact ? "h-24" : "h-32",
            isDragOver
              ? "border-blue-500 bg-blue-50"
              : currentImage
                ? "border-green-300 bg-green-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100",
            isUploading && "border-blue-500 bg-blue-50",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => document.getElementById(`file-input-${label}`)?.click()}
        >
          <input
            id={`file-input-${label}`}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />

          {currentImage ? (
            <div className="relative w-full h-full">
              <img
                src={currentImage || "/placeholder.svg"}
                alt={label}
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      document.getElementById(`file-input-${label}`)?.click()
                    }}
                    size="sm"
                    className="bg-white/90 hover:bg-white text-gray-700 p-2 h-8 w-8"
                  >
                    <Upload className="w-4 h-4" />
                  </Button>
                  {enableCropping && (
                    <Button
                      onClick={(e) => {
                        e.stopPropagation()
                        openCropper()
                      }}
                      size="sm"
                      className="bg-blue-500/90 hover:bg-blue-500 text-white p-2 h-8 w-8"
                    >
                      <Crop className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeImage()
                    }}
                    size="sm"
                    className="bg-red-500/90 hover:bg-red-500 text-white p-2 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              {isUploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              ) : (
                <>
                  <div
                    className={cn(
                      "flex items-center justify-center rounded-full bg-gray-200 group-hover:bg-gray-300 transition-colors",
                      compact ? "w-8 h-8 mb-1" : "w-12 h-12 mb-2",
                    )}
                  >
                    {isDragOver ? (
                      <Upload className={cn("text-blue-500", compact ? "w-4 h-4" : "w-6 h-6")} />
                    ) : (
                      <ImageIcon className={cn("text-gray-400", compact ? "w-4 h-4" : "w-6 h-6")} />
                    )}
                  </div>
                  <p className={cn("text-center font-medium", compact ? "text-xs" : "text-sm")}>
                    {isDragOver ? "Drop image here" : "Drag & drop or click"}
                  </p>
                  {!compact && (
                    <div className="text-xs text-gray-400 mt-1 text-center">
                      <p>PNG, JPG, WebP up to 10MB</p>
                      {enableCropping && <p className="text-blue-500">✂️ Auto-cropping enabled</p>}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {isDragOver && (
            <div className="absolute inset-0 border-2 border-blue-500 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2">
                <Upload className="w-4 h-4" />
                Drop to upload
                {enableCropping && <Crop className="w-4 h-4" />}
              </div>
            </div>
          )}
        </div>

        {enableCropping && currentImage && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={openCropper}
              className="text-xs flex items-center gap-1 bg-transparent"
            >
              <Edit className="w-3 h-3" />
              Edit & Crop
            </Button>
          </div>
        )}
      </div>

      <ImageCropper
        isOpen={showCropper}
        onClose={() => {
          setShowCropper(false)
          setTempImageSrc("")
        }}
        imageSrc={tempImageSrc}
        onCropComplete={handleCropComplete}
        aspectRatio={cropAspectRatio}
        title={`Crop ${label}`}
      />
    </>
  )
}

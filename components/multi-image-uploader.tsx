"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, ImageIcon, X, Crop, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ImageCropper } from "@/components/image-cropper"
import { cn } from "@/lib/utils"

interface MultiImageUploaderProps {
  onFilesUpload: (files: File[]) => void
  currentImages: (string | null)[]
  labels: string[]
  maxImages?: number
  enableCropping?: boolean
  cropAspectRatio?: number
  className?: string
}

export function MultiImageUploader({
  onFilesUpload,
  currentImages,
  labels,
  maxImages = 3,
  enableCropping = true,
  cropAspectRatio,
  className,
}: MultiImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [tempImageSrc, setTempImageSrc] = useState<string>("")
  const [cropIndex, setCropIndex] = useState<number>(-1)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const processFiles = useCallback(
    (files: File[]) => {
      const validFiles = files.filter((file) => {
        const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]
        const maxSize = 10 * 1024 * 1024 // 10MB

        if (!validTypes.includes(file.type)) {
          alert(`Invalid file type: ${file.type}. Please use JPG, PNG, WebP, or GIF.`)
          return false
        }

        if (file.size > maxSize) {
          alert(`File ${file.name} is too large. Please use images smaller than 10MB.`)
          return false
        }

        return true
      })

      if (validFiles.length === 0) return

      setIsUploading(true)

      if (enableCropping && validFiles.length === 1) {
        // Single file - open cropper
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (result) {
            setTempImageSrc(result)
            setCropIndex(currentImages.findIndex((img) => !img))
            setShowCropper(true)
          }
          setIsUploading(false)
        }
        reader.readAsDataURL(validFiles[0])
      } else {
        // Multiple files or cropping disabled - upload directly
        onFilesUpload(validFiles.slice(0, maxImages))
        setIsUploading(false)
      }
    },
    [enableCropping, onFilesUpload, maxImages, currentImages],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      if (files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) {
        processFiles(files)
      }
    },
    [processFiles],
  )

  const handleSingleImageUpload = useCallback(
    (index: number, file: File) => {
      if (enableCropping) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          if (result) {
            setTempImageSrc(result)
            setCropIndex(index)
            setShowCropper(true)
          }
        }
        reader.readAsDataURL(file)
      } else {
        const newFiles = [...currentImages]
        newFiles[index] = URL.createObjectURL(file)
        onFilesUpload([file])
      }
    },
    [enableCropping, currentImages, onFilesUpload],
  )

  const handleCropComplete = useCallback(
    (croppedImageSrc: string) => {
      fetch(croppedImageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `cropped-${Date.now()}.png`, { type: "image/png" })
          const newFiles = Array(maxImages).fill(null)
          newFiles[cropIndex] = file
          onFilesUpload(newFiles.filter(Boolean))
        })
      setShowCropper(false)
      setTempImageSrc("")
      setCropIndex(-1)
    },
    [cropIndex, maxImages, onFilesUpload],
  )

  const removeImage = useCallback(
    (index: number) => {
      const newFiles = [...currentImages]
      newFiles[index] = null
      onFilesUpload(newFiles.filter(Boolean) as any)
    },
    [currentImages, onFilesUpload],
  )

  const openCropper = useCallback(
    (index: number) => {
      const image = currentImages[index]
      if (image) {
        setTempImageSrc(image)
        setCropIndex(index)
        setShowCropper(true)
      }
    },
    [currentImages],
  )

  const emptySlots = maxImages - currentImages.filter(Boolean).length

  return (
    <>
      <div className={cn("space-y-4", className)}>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Multiple Images</label>
          <span className="text-xs text-gray-500">
            {currentImages.filter(Boolean).length}/{maxImages} uploaded
          </span>
        </div>

        {/* Bulk Upload Area */}
        {emptySlots > 0 && (
          <div
            className={cn(
              "relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer group h-24",
              isDragOver
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100",
              isUploading && "border-blue-500 bg-blue-50",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("multi-file-input")?.click()}
          >
            <input
              id="multi-file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              {isUploading ? (
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              ) : (
                <>
                  <div className="flex items-center justify-center w-8 h-8 mb-1 bg-gray-200 group-hover:bg-gray-300 transition-colors rounded-full">
                    {isDragOver ? (
                      <Upload className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                  <p className="text-xs text-center font-medium">
                    {isDragOver ? "Drop images here" : `Add ${emptySlots} more image${emptySlots > 1 ? "s" : ""}`}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {enableCropping ? "Drag multiple or click • Auto-crop enabled" : "Drag multiple or click"}
                  </p>
                </>
              )}
            </div>

            {isDragOver && (
              <div className="absolute inset-0 border-2 border-blue-500 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <div className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Drop to upload
                  {enableCropping && <Crop className="w-4 h-4" />}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Individual Image Slots */}
        <div className="grid grid-cols-3 gap-3">
          {Array.from({ length: maxImages }, (_, index) => {
            const image = currentImages[index]
            const label = labels[index] || `Image ${index + 1}`

            return (
              <div key={index} className="space-y-2">
                <label className="text-xs font-medium text-gray-600">{label}</label>
                <div
                  className={cn(
                    "relative border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer group h-20",
                    image
                      ? "border-green-300 bg-green-50"
                      : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100",
                  )}
                  onClick={() => document.getElementById(`file-input-${index}`)?.click()}
                >
                  <input
                    id={`file-input-${index}`}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleSingleImageUpload(index, file)
                    }}
                    className="hidden"
                  />

                  {image ? (
                    <div className="relative w-full h-full">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={label}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              document.getElementById(`file-input-${index}`)?.click()
                            }}
                            size="sm"
                            className="bg-white/90 hover:bg-white text-gray-700 p-1 h-6 w-6"
                          >
                            <Upload className="w-3 h-3" />
                          </Button>
                          {enableCropping && (
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                openCropper(index)
                              }}
                              size="sm"
                              className="bg-blue-500/90 hover:bg-blue-500 text-white p-1 h-6 w-6"
                            >
                              <Crop className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation()
                              removeImage(index)
                            }}
                            size="sm"
                            className="bg-red-500/90 hover:bg-red-500 text-white p-1 h-6 w-6"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon className="w-6 h-6 mb-1" />
                      <span className="text-xs">Add</span>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {enableCropping && currentImages.some(Boolean) && (
          <div className="text-xs text-gray-500 text-center">
            <p>💡 Click the crop icon on any image to edit and crop it</p>
          </div>
        )}
      </div>

      <ImageCropper
        isOpen={showCropper}
        onClose={() => {
          setShowCropper(false)
          setTempImageSrc("")
          setCropIndex(-1)
        }}
        imageSrc={tempImageSrc}
        onCropComplete={handleCropComplete}
        aspectRatio={cropAspectRatio}
        title={cropIndex >= 0 ? `Crop ${labels[cropIndex] || `Image ${cropIndex + 1}`}` : "Crop Image"}
      />
    </>
  )
}

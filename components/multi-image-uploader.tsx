"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, X, Plus, Crop, Brain, Sparkles } from "lucide-react"
import { ImageCropper } from "./image-cropper"

interface MultiImageUploaderProps {
  onFilesUpload: (files: File[]) => void
  currentImages: (string | null)[]
  labels: string[]
  maxImages?: number
  enableCropping?: boolean
  cropAspectRatio?: number
}

export function MultiImageUploader({
  onFilesUpload,
  currentImages,
  labels,
  maxImages = 3,
  enableCropping = false,
  cropAspectRatio,
}: MultiImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showCropper, setShowCropper] = useState(false)
  const [imageToEdit, setImageToEdit] = useState<string | null>(null)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)

      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))

      if (files.length > 0) {
        if (enableCropping && files.length === 1) {
          // Show cropper for single dropped image
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            setImageToEdit(result)
            setEditingIndex(currentImages.findIndex((img) => !img))
            setShowCropper(true)
          }
          reader.readAsDataURL(files[0])
        } else {
          // Direct upload for multiple files
          handleFilesUpload(files)
        }
      }
    },
    [enableCropping, currentImages],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((file) => file.type.startsWith("image/"))

      if (files.length > 0) {
        if (enableCropping && files.length === 1) {
          // Show cropper for single selected image
          const reader = new FileReader()
          reader.onload = (e) => {
            const result = e.target?.result as string
            setImageToEdit(result)
            setEditingIndex(currentImages.findIndex((img) => !img))
            setShowCropper(true)
          }
          reader.readAsDataURL(files[0])
        } else {
          // Direct upload for multiple files
          handleFilesUpload(files)
        }
      }
    },
    [enableCropping, currentImages],
  )

  const handleFilesUpload = useCallback(
    (files: File[]) => {
      setIsLoading(true)
      // Simulate processing time
      setTimeout(() => {
        onFilesUpload(files.slice(0, maxImages))
        setIsLoading(false)
      }, 500)
    },
    [onFilesUpload, maxImages],
  )

  const handleCropComplete = useCallback(
    (croppedImageSrc: string) => {
      // Convert data URL back to File object
      fetch(croppedImageSrc)
        .then((res) => res.blob())
        .then((blob) => {
          const file = new File([blob], `cropped-image-${editingIndex}.png`, { type: "image/png" })
          handleFilesUpload([file])
        })
      setShowCropper(false)
      setImageToEdit(null)
      setEditingIndex(null)
    },
    [handleFilesUpload, editingIndex],
  )

  const handleRemoveImage = useCallback(
    (index: number) => {
      const newImages = [...currentImages]
      newImages[index] = null
      // Convert to files array for consistency
      const files: File[] = []
      onFilesUpload(files)
    },
    [currentImages, onFilesUpload],
  )

  const handleEditImage = useCallback(
    (index: number) => {
      if (currentImages[index]) {
        setImageToEdit(currentImages[index])
        setEditingIndex(index)
        setShowCropper(true)
      }
    },
    [currentImages],
  )

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const hasEmptySlots = currentImages.some((img) => !img)
  const filledSlots = currentImages.filter((img) => img).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Multiple Images</span>
          <Badge variant="outline" className="text-xs">
            {filledSlots}/{maxImages}
          </Badge>
          {enableCropping && (
            <Badge variant="outline" className="text-xs">
              <Brain className="w-3 h-3 mr-1" />
              AI Crop
            </Badge>
          )}
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-3 gap-3">
        {currentImages.map((image, index) => (
          <div key={index} className="space-y-2">
            <span className="text-xs text-gray-600">{labels[index]}</span>
            {image ? (
              <div className="relative group">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg border border-gray-200"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                    {enableCropping && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleEditImage(index)}
                        className="h-6 px-2 text-xs"
                      >
                        <Crop className="w-3 h-3" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveImage(index)}
                      className="h-6 px-2 text-xs"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className="h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors"
                onClick={openFileDialog}
              >
                <Plus className="w-4 h-4 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bulk Upload Area */}
      {hasEmptySlots && (
        <div
          className={`
            h-24 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
            ${
              isDragOver
                ? "border-blue-400 bg-blue-50"
                : isLoading
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              openFileDialog()
            }
          }}
          aria-label="Upload multiple images"
        >
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            {isLoading ? (
              <>
                <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
                <span className="text-xs">Processing images...</span>
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mb-2" />
                <span className="text-sm text-center px-2">
                  {isDragOver ? "Drop images here" : "Click or drag multiple images"}
                </span>
                {enableCropping && (
                  <div className="flex items-center gap-1 mt-1">
                    <Sparkles className="w-3 h-3 text-blue-500" />
                    <span className="text-xs text-blue-600">AI-powered cropping</span>
                  </div>
                )}
                <span className="text-xs text-gray-400 mt-1">{maxImages - filledSlots} slots remaining</span>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload multiple images"
      />

      {showCropper && imageToEdit && (
        <ImageCropper
          isOpen={showCropper}
          onClose={() => {
            setShowCropper(false)
            setImageToEdit(null)
            setEditingIndex(null)
          }}
          imageSrc={imageToEdit}
          onCropComplete={handleCropComplete}
          aspectRatio={cropAspectRatio}
          title={`Crop ${labels[editingIndex || 0]}`}
        />
      )}
    </div>
  )
}

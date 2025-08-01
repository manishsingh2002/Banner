"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { X, Plus } from "lucide-react"

interface MultiImageUploaderProps {
  onFilesUpload: (files: File[]) => void
  currentImages: (string | null)[]
  labels: string[]
  maxImages?: number
}

export function MultiImageUploader({ onFilesUpload, currentImages, labels, maxImages = 3 }: MultiImageUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
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
        handleFilesUpload(files.slice(0, maxImages))
      }
    },
    [maxImages],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []).filter((file) => file.type.startsWith("image/"))
      if (files.length > 0) {
        handleFilesUpload(files.slice(0, maxImages))
      }
    },
    [maxImages],
  )

  const handleFilesUpload = useCallback(
    (files: File[]) => {
      setIsLoading(true)
      setTimeout(() => {
        onFilesUpload(files)
        setIsLoading(false)
      }, 500)
    },
    [onFilesUpload],
  )

  const handleSingleImageRemove = useCallback(
    (index: number) => {
      // Create a new array with the image at index removed
      const newFiles: File[] = []
      onFilesUpload(newFiles)
    },
    [onFilesUpload],
  )

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const hasImages = currentImages.some((img) => img !== null)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Vertical Images</span>
        <span className="text-xs text-gray-500">
          {currentImages.filter(Boolean).length}/{maxImages}
        </span>
      </div>

      {hasImages ? (
        <div className="grid grid-cols-3 gap-2">
          {currentImages.map((image, index) => (
            <div key={index} className="relative group">
              {image ? (
                <>
                  <img
                    src={image || "/placeholder.svg"}
                    alt={labels[index]}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleSingleImageRemove(index)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <span className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 rounded">
                    {labels[index]}
                  </span>
                </>
              ) : (
                <div className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-xs text-gray-400">{labels[index]}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`
            h-32 border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
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
                <span className="text-xs">Processing...</span>
              </>
            ) : (
              <>
                <Plus className="w-6 h-6 mb-2" />
                <span className="text-sm text-center px-2">
                  {isDragOver ? "Drop images here" : `Upload up to ${maxImages} images`}
                </span>
                <span className="text-xs text-gray-400 mt-1">Click or drag multiple images</span>
              </>
            )}
          </div>
        </div>
      )}

      {hasImages && (
        <Button variant="outline" size="sm" onClick={openFileDialog} className="w-full bg-transparent">
          <Plus className="w-4 h-4 mr-2" />
          Add More Images
        </Button>
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
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"

interface DragDropZoneProps {
  onFileUpload: (file: File | null) => void
  currentImage?: string | null
  label?: string
  compact?: boolean
}

export function DragDropZone({
  onFileUpload,
  currentImage,
  label = "Upload Image",
  compact = false,
}: DragDropZoneProps) {
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find((file) => file.type.startsWith("image/"))

    if (imageFile) {
      handleFileUpload(imageFile)
    }
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }, [])

  const handleFileUpload = useCallback(
    (file: File) => {
      setIsLoading(true)
      // Simulate processing time
      setTimeout(() => {
        onFileUpload(file)
        setIsLoading(false)
      }, 300)
    },
    [onFileUpload],
  )

  const handleRemoveImage = useCallback(() => {
    onFileUpload(null)
  }, [onFileUpload])

  const openFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const height = compact ? "h-24" : "h-32"

  if (currentImage) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <div className="relative group">
          <img
            src={currentImage || "/placeholder.svg"}
            alt="Uploaded"
            className={`w-full ${height} object-cover rounded-lg border border-gray-200`}
          />
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-2">
              <Button size="sm" variant="secondary" onClick={openFileDialog} className="h-8 px-3">
                <Upload className="w-3 h-3 mr-1" />
                Replace
              </Button>
              <Button size="sm" variant="destructive" onClick={handleRemoveImage} className="h-8 px-3">
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          aria-label={`Replace ${label}`}
        />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{label}</span>
      </div>
      <div
        className={`
          ${height} border-2 border-dashed rounded-lg transition-all duration-200 cursor-pointer
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
        aria-label={`Upload ${label}`}
      >
        <div className="flex flex-col items-center justify-center h-full text-gray-500">
          {isLoading ? (
            <>
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2" />
              <span className="text-xs">Processing...</span>
            </>
          ) : (
            <>
              <Upload className={`${compact ? "w-5 h-5" : "w-6 h-6"} mb-2`} />
              <span className={`${compact ? "text-xs" : "text-sm"} text-center px-2`}>
                {isDragOver ? "Drop image here" : "Click or drag image"}
              </span>
            </>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label={`Upload ${label}`}
      />
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Crop, RotateCw, FlipHorizontal, FlipVertical, ZoomIn } from "lucide-react"

interface CropArea {
  x: number
  y: number
  width: number
  height: number
}

interface ImageCropperProps {
  isOpen: boolean
  onClose: () => void
  imageSrc: string
  onCropComplete: (croppedImageSrc: string) => void
  aspectRatio?: number
  title?: string
}

export function ImageCropper({
  isOpen,
  onClose,
  imageSrc,
  onCropComplete,
  aspectRatio,
  title = "Crop Image",
}: ImageCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [image, setImage] = useState<HTMLImageElement | null>(null)
  const [cropArea, setCropArea] = useState<CropArea>({ x: 0, y: 0, width: 200, height: 200 })
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [flipHorizontal, setFlipHorizontal] = useState(false)
  const [flipVertical, setFlipVertical] = useState(false)
  const [presetRatio, setPresetRatio] = useState<string>("free")

  // Load image when dialog opens
  useEffect(() => {
    if (isOpen && imageSrc) {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        setImage(img)
        // Initialize crop area to center of image
        const initialSize = Math.min(img.width, img.height) * 0.8
        setCropArea({
          x: (img.width - initialSize) / 2,
          y: (img.height - initialSize) / 2,
          width: initialSize,
          height: aspectRatio ? initialSize / aspectRatio : initialSize,
        })
      }
      img.src = imageSrc
    }
  }, [isOpen, imageSrc, aspectRatio])

  // Draw image and crop overlay
  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !image) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to fit container
    const container = containerRef.current
    if (!container) return

    const containerRect = container.getBoundingClientRect()
    const maxWidth = containerRect.width - 40
    const maxHeight = containerRect.height - 40

    // Calculate display size maintaining aspect ratio
    const imageAspect = image.width / image.height
    let displayWidth = maxWidth
    let displayHeight = maxWidth / imageAspect

    if (displayHeight > maxHeight) {
      displayHeight = maxHeight
      displayWidth = maxHeight * imageAspect
    }

    canvas.width = displayWidth
    canvas.height = displayHeight

    // Clear canvas
    ctx.clearRect(0, 0, displayWidth, displayHeight)

    // Apply transformations
    ctx.save()
    ctx.translate(displayWidth / 2, displayHeight / 2)
    ctx.scale(zoom, zoom)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1)
    ctx.translate(-displayWidth / 2, -displayHeight / 2)

    // Draw image
    ctx.drawImage(image, 0, 0, displayWidth, displayHeight)
    ctx.restore()

    // Draw crop overlay
    const scaleX = displayWidth / image.width
    const scaleY = displayHeight / image.height
    const cropX = cropArea.x * scaleX
    const cropY = cropArea.y * scaleY
    const cropWidth = cropArea.width * scaleX
    const cropHeight = cropArea.height * scaleY

    // Dark overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"
    ctx.fillRect(0, 0, displayWidth, displayHeight)

    // Clear crop area
    ctx.clearRect(cropX, cropY, cropWidth, cropHeight)

    // Crop border
    ctx.strokeStyle = "#3b82f6"
    ctx.lineWidth = 2
    ctx.strokeRect(cropX, cropY, cropWidth, cropHeight)

    // Corner handles
    const handleSize = 8
    ctx.fillStyle = "#3b82f6"
    const corners = [
      [cropX - handleSize / 2, cropY - handleSize / 2],
      [cropX + cropWidth - handleSize / 2, cropY - handleSize / 2],
      [cropX - handleSize / 2, cropY + cropHeight - handleSize / 2],
      [cropX + cropWidth - handleSize / 2, cropY + cropHeight - handleSize / 2],
    ]

    corners.forEach(([x, y]) => {
      ctx.fillRect(x, y, handleSize, handleSize)
    })

    // Grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"
    ctx.lineWidth = 1
    for (let i = 1; i < 3; i++) {
      const x = cropX + (cropWidth / 3) * i
      const y = cropY + (cropHeight / 3) * i
      ctx.beginPath()
      ctx.moveTo(x, cropY)
      ctx.lineTo(x, cropY + cropHeight)
      ctx.moveTo(cropX, y)
      ctx.lineTo(cropX + cropWidth, y)
      ctx.stroke()
    }
  }, [image, cropArea, zoom, rotation, flipHorizontal, flipVertical])

  // Redraw canvas when dependencies change
  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  // Handle mouse events for cropping
  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current || !image) return

      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const scaleX = canvas.width / image.width
      const scaleY = canvas.height / image.height
      const cropX = cropArea.x * scaleX
      const cropY = cropArea.y * scaleY
      const cropWidth = cropArea.width * scaleX
      const cropHeight = cropArea.height * scaleY

      // Check if clicking on crop area
      if (x >= cropX && x <= cropX + cropWidth && y >= cropY && y <= cropY + cropHeight) {
        setIsDragging(true)
        setDragStart({ x: x - cropX, y: y - cropY })
      }
    },
    [image, cropArea],
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging || !canvasRef.current || !image) return

      const canvas = canvasRef.current
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const scaleX = image.width / canvas.width
      const scaleY = image.height / canvas.height

      const newX = Math.max(0, Math.min((x - dragStart.x) * scaleX, image.width - cropArea.width))
      const newY = Math.max(0, Math.min((y - dragStart.y) * scaleY, image.height - cropArea.height))

      setCropArea((prev) => ({ ...prev, x: newX, y: newY }))
    },
    [isDragging, dragStart, image, cropArea.width, cropArea.height],
  )

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
    setIsResizing(false)
  }, [])

  // Handle aspect ratio presets
  const handlePresetChange = useCallback(
    (value: string) => {
      setPresetRatio(value)
      if (!image) return

      let newWidth = cropArea.width
      let newHeight = cropArea.height

      switch (value) {
        case "1:1":
          newHeight = newWidth
          break
        case "16:9":
          newHeight = newWidth * (9 / 16)
          break
        case "4:3":
          newHeight = newWidth * (3 / 4)
          break
        case "3:2":
          newHeight = newWidth * (2 / 3)
          break
        case "free":
          // Keep current dimensions
          break
      }

      // Ensure crop area fits within image
      if (cropArea.x + newWidth > image.width) {
        newWidth = image.width - cropArea.x
        if (value !== "free") {
          newHeight = newWidth * (newHeight / cropArea.width)
        }
      }
      if (cropArea.y + newHeight > image.height) {
        newHeight = image.height - cropArea.y
        if (value !== "free") {
          newWidth = newHeight * (cropArea.width / newHeight)
        }
      }

      setCropArea((prev) => ({ ...prev, width: newWidth, height: newHeight }))
    },
    [image, cropArea],
  )

  // Crop the image
  const handleCrop = useCallback(() => {
    if (!image) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = cropArea.width
    canvas.height = cropArea.height

    // Apply transformations
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.scale(zoom, zoom)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1)
    ctx.translate(-canvas.width / 2, -canvas.height / 2)

    // Draw cropped image
    ctx.drawImage(image, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 0, 0, canvas.width, canvas.height)
    ctx.restore()

    // Convert to data URL
    const croppedImageSrc = canvas.toDataURL("image/png", 1.0)
    onCropComplete(croppedImageSrc)
    onClose()
  }, [image, cropArea, zoom, rotation, flipHorizontal, flipVertical, onCropComplete, onClose])

  const resetTransforms = useCallback(() => {
    setZoom(1)
    setRotation(0)
    setFlipHorizontal(false)
    setFlipVertical(false)
  }, [])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="w-5 h-5" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[70vh]">
          {/* Canvas Area */}
          <div className="lg:col-span-3 relative" ref={containerRef}>
            <canvas
              ref={canvasRef}
              className="border border-gray-300 rounded-lg cursor-move max-w-full max-h-full"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>

          {/* Controls */}
          <div className="space-y-4 overflow-y-auto">
            <div>
              <Label className="text-sm font-medium">Aspect Ratio</Label>
              <Select value={presetRatio} onValueChange={handlePresetChange}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="1:1">Square (1:1)</SelectItem>
                  <SelectItem value="16:9">Widescreen (16:9)</SelectItem>
                  <SelectItem value="4:3">Standard (4:3)</SelectItem>
                  <SelectItem value="3:2">Photo (3:2)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <ZoomIn className="w-4 h-4" />
                Zoom: {Math.round(zoom * 100)}%
              </Label>
              <Slider
                value={[zoom]}
                onValueChange={([value]) => setZoom(value)}
                min={0.1}
                max={3}
                step={0.1}
                className="mt-2"
              />
            </div>

            <div>
              <Label className="text-sm font-medium flex items-center gap-2">
                <RotateCw className="w-4 h-4" />
                Rotation: {rotation}°
              </Label>
              <Slider
                value={[rotation]}
                onValueChange={([value]) => setRotation(value)}
                min={-180}
                max={180}
                step={15}
                className="mt-2"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Transform</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={flipHorizontal ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFlipHorizontal(!flipHorizontal)}
                  className="flex items-center gap-1"
                >
                  <FlipHorizontal className="w-4 h-4" />
                  Flip H
                </Button>
                <Button
                  variant={flipVertical ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFlipVertical(!flipVertical)}
                  className="flex items-center gap-1"
                >
                  <FlipVertical className="w-4 h-4" />
                  Flip V
                </Button>
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={resetTransforms} className="w-full bg-transparent">
              Reset Transforms
            </Button>

            <div className="text-xs text-gray-500 space-y-1">
              <p>• Drag to move crop area</p>
              <p>• Use controls to adjust image</p>
              <p>• Grid lines help with composition</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleCrop} className="bg-blue-600 hover:bg-blue-700">
            Apply Crop
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

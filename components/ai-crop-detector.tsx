"use client"

import { useState, useEffect, useCallback } from "react"

export interface CropSuggestion {
  id: string
  name: string
  description: string
  x: number
  y: number
  width: number
  height: number
  confidence: number
  type: "face" | "object" | "composition" | "edge" | "color"
  features?: {
    faces?: Array<{ x: number; y: number; width: number; height: number }>
    objects?: Array<{ x: number; y: number; width: number; height: number; type: string }>
    edges?: Array<{ x: number; y: number; strength: number }>
    colorRegions?: Array<{ x: number; y: number; width: number; height: number; dominantColor: string }>
  }
}

export interface AICropDetectorProps {
  image: HTMLImageElement
  aspectRatio?: number
  onSuggestionsReady: (suggestions: CropSuggestion[]) => void
}

export function AICropDetector({ image, aspectRatio, onSuggestionsReady }: AICropDetectorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeImage = useCallback(async () => {
    if (!image) return

    setIsAnalyzing(true)
    try {
      const suggestions: CropSuggestion[] = []

      // Create canvas for analysis
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.width = image.width
      canvas.height = image.height
      ctx.drawImage(image, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      // 1. Face Detection using basic skin tone detection
      const faceSuggestions = await detectFaces(imageData, canvas.width, canvas.height, aspectRatio)
      suggestions.push(...faceSuggestions)

      // 2. Edge Detection for focal points
      const edgeSuggestions = await detectEdges(imageData, canvas.width, canvas.height, aspectRatio)
      suggestions.push(...edgeSuggestions)

      // 3. Color-based object detection
      const colorSuggestions = await detectColorRegions(imageData, canvas.width, canvas.height, aspectRatio)
      suggestions.push(...colorSuggestions)

      // 4. Composition-based suggestions (rule of thirds)
      const compositionSuggestions = generateCompositionSuggestions(canvas.width, canvas.height, aspectRatio)
      suggestions.push(...compositionSuggestions)

      // 5. Center-weighted suggestions
      const centerSuggestions = generateCenterSuggestions(canvas.width, canvas.height, aspectRatio)
      suggestions.push(...centerSuggestions)

      // Sort by confidence and remove duplicates
      const uniqueSuggestions = removeDuplicateSuggestions(suggestions)
      const sortedSuggestions = uniqueSuggestions.sort((a, b) => b.confidence - a.confidence).slice(0, 6)

      onSuggestionsReady(sortedSuggestions)
    } catch (error) {
      console.error("Error analyzing image:", error)
      // Fallback to basic suggestions
      const fallbackSuggestions = generateCompositionSuggestions(image.width, image.height, aspectRatio)
      onSuggestionsReady(fallbackSuggestions)
    } finally {
      setIsAnalyzing(false)
    }
  }, [image, aspectRatio, onSuggestionsReady])

  useEffect(() => {
    if (image) {
      analyzeImage()
    }
  }, [analyzeImage])

  return null // This is a utility component with no UI
}

// Face detection using skin tone analysis
async function detectFaces(
  imageData: ImageData,
  width: number,
  height: number,
  aspectRatio?: number,
): Promise<CropSuggestion[]> {
  const suggestions: CropSuggestion[] = []
  const data = imageData.data
  const skinRegions: Array<{ x: number; y: number; width: number; height: number }> = []

  // Simple skin tone detection
  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]

      // Basic skin tone detection algorithm
      if (isSkinTone(r, g, b)) {
        // Find connected skin regions
        const region = findConnectedSkinRegion(data, width, height, x, y)
        if (region.width > 50 && region.height > 50) {
          skinRegions.push(region)
        }
      }
    }
  }

  // Create crop suggestions around detected faces
  skinRegions.forEach((region, index) => {
    const cropWidth = aspectRatio ? region.height * aspectRatio : Math.max(region.width * 1.5, 200)
    const cropHeight = aspectRatio ? cropWidth / aspectRatio : Math.max(region.height * 1.5, 200)

    const x = Math.max(0, region.x + region.width / 2 - cropWidth / 2)
    const y = Math.max(0, region.y + region.height / 2 - cropHeight / 2)

    suggestions.push({
      id: `face-${index}`,
      name: `Face Focus ${index + 1}`,
      description: "Centered on detected face",
      x: Math.min(x, width - cropWidth),
      y: Math.min(y, height - cropHeight),
      width: Math.min(cropWidth, width),
      height: Math.min(cropHeight, height),
      confidence: 0.8,
      type: "face",
      features: { faces: [region] },
    })
  })

  return suggestions
}

// Edge detection for finding focal points
async function detectEdges(
  imageData: ImageData,
  width: number,
  height: number,
  aspectRatio?: number,
): Promise<CropSuggestion[]> {
  const suggestions: CropSuggestion[] = []
  const data = imageData.data
  const edges: Array<{ x: number; y: number; strength: number }> = []

  // Sobel edge detection
  for (let y = 1; y < height - 1; y += 5) {
    for (let x = 1; x < width - 1; x += 5) {
      const gx = sobelX(data, width, x, y)
      const gy = sobelY(data, width, x, y)
      const magnitude = Math.sqrt(gx * gx + gy * gy)

      if (magnitude > 50) {
        edges.push({ x, y, strength: magnitude })
      }
    }
  }

  // Find clusters of strong edges
  const edgeClusters = clusterEdges(edges, 100)

  edgeClusters.forEach((cluster, index) => {
    if (cluster.length > 10) {
      const centerX = cluster.reduce((sum, edge) => sum + edge.x, 0) / cluster.length
      const centerY = cluster.reduce((sum, edge) => sum + edge.y, 0) / cluster.length
      const avgStrength = cluster.reduce((sum, edge) => sum + edge.strength, 0) / cluster.length

      const cropWidth = aspectRatio ? 300 * aspectRatio : 300
      const cropHeight = aspectRatio ? cropWidth / aspectRatio : 300

      const x = Math.max(0, centerX - cropWidth / 2)
      const y = Math.max(0, centerY - cropHeight / 2)

      suggestions.push({
        id: `edge-${index}`,
        name: `Edge Focus ${index + 1}`,
        description: "Centered on high-contrast area",
        x: Math.min(x, width - cropWidth),
        y: Math.min(y, height - cropHeight),
        width: Math.min(cropWidth, width),
        height: Math.min(cropHeight, height),
        confidence: Math.min(avgStrength / 100, 0.9),
        type: "edge",
        features: { edges: cluster },
      })
    }
  })

  return suggestions
}

// Color-based region detection
async function detectColorRegions(
  imageData: ImageData,
  width: number,
  height: number,
  aspectRatio?: number,
): Promise<CropSuggestion[]> {
  const suggestions: CropSuggestion[] = []
  const data = imageData.data
  const colorRegions: Array<{ x: number; y: number; width: number; height: number; dominantColor: string }> = []

  // Analyze color distribution
  const colorMap = new Map<string, Array<{ x: number; y: number }>>()

  for (let y = 0; y < height; y += 20) {
    for (let x = 0; x < width; x += 20) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]

      // Quantize colors to reduce noise
      const quantizedR = Math.floor(r / 32) * 32
      const quantizedG = Math.floor(g / 32) * 32
      const quantizedB = Math.floor(b / 32) * 32
      const colorKey = `${quantizedR},${quantizedG},${quantizedB}`

      if (!colorMap.has(colorKey)) {
        colorMap.set(colorKey, [])
      }
      colorMap.get(colorKey)!.push({ x, y })
    }
  }

  // Find significant color regions
  colorMap.forEach((pixels, colorKey) => {
    if (pixels.length > 50) {
      const minX = Math.min(...pixels.map((p) => p.x))
      const maxX = Math.max(...pixels.map((p) => p.x))
      const minY = Math.min(...pixels.map((p) => p.y))
      const maxY = Math.max(...pixels.map((p) => p.y))

      const regionWidth = maxX - minX
      const regionHeight = maxY - minY

      if (regionWidth > 100 && regionHeight > 100) {
        colorRegions.push({
          x: minX,
          y: minY,
          width: regionWidth,
          height: regionHeight,
          dominantColor: colorKey,
        })
      }
    }
  })

  // Create crop suggestions for color regions
  colorRegions.slice(0, 3).forEach((region, index) => {
    const cropWidth = aspectRatio ? region.height * aspectRatio : Math.max(region.width * 1.2, 250)
    const cropHeight = aspectRatio ? cropWidth / aspectRatio : Math.max(region.height * 1.2, 250)

    const x = Math.max(0, region.x + region.width / 2 - cropWidth / 2)
    const y = Math.max(0, region.y + region.height / 2 - cropHeight / 2)

    suggestions.push({
      id: `color-${index}`,
      name: `Color Focus ${index + 1}`,
      description: `Focused on ${region.dominantColor} region`,
      x: Math.min(x, width - cropWidth),
      y: Math.min(y, height - cropHeight),
      width: Math.min(cropWidth, width),
      height: Math.min(cropHeight, height),
      confidence: 0.6,
      type: "color",
      features: { colorRegions: [region] },
    })
  })

  return suggestions
}

// Rule of thirds composition suggestions
function generateCompositionSuggestions(width: number, height: number, aspectRatio?: number): CropSuggestion[] {
  const suggestions: CropSuggestion[] = []

  const cropWidth = aspectRatio ? Math.min(width, height * aspectRatio) : Math.min(width * 0.8, 400)
  const cropHeight = aspectRatio ? cropWidth / aspectRatio : Math.min(height * 0.8, 400)

  // Rule of thirds positions
  const positions = [
    { x: width / 3 - cropWidth / 2, y: height / 3 - cropHeight / 2, name: "Top Left Third" },
    { x: (2 * width) / 3 - cropWidth / 2, y: height / 3 - cropHeight / 2, name: "Top Right Third" },
    { x: width / 3 - cropWidth / 2, y: (2 * height) / 3 - cropHeight / 2, name: "Bottom Left Third" },
    { x: (2 * width) / 3 - cropWidth / 2, y: (2 * height) / 3 - cropHeight / 2, name: "Bottom Right Third" },
  ]

  positions.forEach((pos, index) => {
    const x = Math.max(0, Math.min(pos.x, width - cropWidth))
    const y = Math.max(0, Math.min(pos.y, height - cropHeight))

    suggestions.push({
      id: `composition-${index}`,
      name: pos.name,
      description: "Rule of thirds composition",
      x,
      y,
      width: cropWidth,
      height: cropHeight,
      confidence: 0.7,
      type: "composition",
    })
  })

  return suggestions
}

// Center-weighted suggestions
function generateCenterSuggestions(width: number, height: number, aspectRatio?: number): CropSuggestion[] {
  const suggestions: CropSuggestion[] = []

  const sizes = [0.6, 0.8, 1.0]

  sizes.forEach((scale, index) => {
    const cropWidth = aspectRatio ? Math.min(width * scale, height * scale * aspectRatio) : Math.min(width * scale, 500)
    const cropHeight = aspectRatio ? cropWidth / aspectRatio : Math.min(height * scale, 500)

    const x = (width - cropWidth) / 2
    const y = (height - cropHeight) / 2

    suggestions.push({
      id: `center-${index}`,
      name: `Center ${Math.round(scale * 100)}%`,
      description: `Center crop at ${Math.round(scale * 100)}% scale`,
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: Math.min(cropWidth, width),
      height: Math.min(cropHeight, height),
      confidence: 0.5 + scale * 0.2,
      type: "composition",
    })
  })

  return suggestions
}

// Helper functions
function isSkinTone(r: number, g: number, b: number): boolean {
  // Simple skin tone detection
  return r > 95 && g > 40 && b > 20 && r > g && r > b && r - g > 15 && Math.abs(r - g) > 15
}

function findConnectedSkinRegion(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
): { x: number; y: number; width: number; height: number } {
  // Simplified region growing algorithm
  let minX = startX,
    maxX = startX,
    minY = startY,
    maxY = startY

  // Simple bounding box expansion
  for (let dy = -20; dy <= 20; dy += 5) {
    for (let dx = -20; dx <= 20; dx += 5) {
      const x = startX + dx
      const y = startY + dy

      if (x >= 0 && x < width && y >= 0 && y < height) {
        const index = (y * width + x) * 4
        const r = data[index]
        const g = data[index + 1]
        const b = data[index + 2]

        if (isSkinTone(r, g, b)) {
          minX = Math.min(minX, x)
          maxX = Math.max(maxX, x)
          minY = Math.min(minY, y)
          maxY = Math.max(maxY, y)
        }
      }
    }
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

function sobelX(data: Uint8ClampedArray, width: number, x: number, y: number): number {
  const getPixel = (px: number, py: number) => {
    const index = (py * width + px) * 4
    return (data[index] + data[index + 1] + data[index + 2]) / 3
  }

  return (
    -1 * getPixel(x - 1, y - 1) +
    1 * getPixel(x + 1, y - 1) +
    -2 * getPixel(x - 1, y) +
    2 * getPixel(x + 1, y) +
    -1 * getPixel(x - 1, y + 1) +
    1 * getPixel(x + 1, y + 1)
  )
}

function sobelY(data: Uint8ClampedArray, width: number, x: number, y: number): number {
  const getPixel = (px: number, py: number) => {
    const index = (py * width + px) * 4
    return (data[index] + data[index + 1] + data[index + 2]) / 3
  }

  return (
    -1 * getPixel(x - 1, y - 1) +
    -2 * getPixel(x, y - 1) +
    -1 * getPixel(x + 1, y - 1) +
    1 * getPixel(x - 1, y + 1) +
    2 * getPixel(x, y + 1) +
    1 * getPixel(x + 1, y + 1)
  )
}

function clusterEdges(
  edges: Array<{ x: number; y: number; strength: number }>,
  threshold: number,
): Array<Array<{ x: number; y: number; strength: number }>> {
  const clusters: Array<Array<{ x: number; y: number; strength: number }>> = []
  const visited = new Set<number>()

  edges.forEach((edge, index) => {
    if (visited.has(index)) return

    const cluster = [edge]
    visited.add(index)

    // Find nearby edges
    edges.forEach((otherEdge, otherIndex) => {
      if (visited.has(otherIndex)) return

      const distance = Math.sqrt(Math.pow(edge.x - otherEdge.x, 2) + Math.pow(edge.y - otherEdge.y, 2))
      if (distance < threshold) {
        cluster.push(otherEdge)
        visited.add(otherIndex)
      }
    })

    clusters.push(cluster)
  })

  return clusters
}

function removeDuplicateSuggestions(suggestions: CropSuggestion[]): CropSuggestion[] {
  const unique: CropSuggestion[] = []

  suggestions.forEach((suggestion) => {
    const isDuplicate = unique.some((existing) => {
      const xDiff = Math.abs(existing.x - suggestion.x)
      const yDiff = Math.abs(existing.y - suggestion.y)
      const wDiff = Math.abs(existing.width - suggestion.width)
      const hDiff = Math.abs(existing.height - suggestion.height)

      return xDiff < 50 && yDiff < 50 && wDiff < 50 && hDiff < 50
    })

    if (!isDuplicate) {
      unique.push(suggestion)
    }
  })

  return unique
}

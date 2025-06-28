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
  type: "face" | "object" | "composition" | "edge" | "color" | "smart"
  features?: {
    faces?: Array<{ x: number; y: number; width: number; height: number; confidence: number }>
    objects?: Array<{ x: number; y: number; width: number; height: number; type: string; confidence: number }>
    edges?: Array<{ x: number; y: number; strength: number }>
    colorRegions?: Array<{
      x: number
      y: number
      width: number
      height: number
      dominantColor: string
      saturation: number
    }>
    focusPoints?: Array<{ x: number; y: number; importance: number }>
  }
  metadata?: {
    processingTime: number
    algorithm: string
    qualityScore: number
  }
}

export interface EnhancedAICropDetectorProps {
  image: HTMLImageElement
  aspectRatio?: number
  onSuggestionsReady: (suggestions: CropSuggestion[]) => void
  onAnalysisProgress?: (progress: number) => void
  maxSuggestions?: number
  enableAdvancedAnalysis?: boolean
}

export function EnhancedAICropDetector({
  image,
  aspectRatio,
  onSuggestionsReady,
  onAnalysisProgress,
  maxSuggestions = 8,
  enableAdvancedAnalysis = true,
}: EnhancedAICropDetectorProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const analyzeImage = useCallback(async () => {
    if (!image) return

    setIsAnalyzing(true)
    const startTime = performance.now()

    try {
      onAnalysisProgress?.(0)
      const suggestions: CropSuggestion[] = []

      // Create canvas for analysis
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Optimize canvas size for analysis (max 800px for performance)
      const maxSize = 800
      const scale = Math.min(maxSize / image.width, maxSize / image.height, 1)
      canvas.width = image.width * scale
      canvas.height = image.height * scale

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      onAnalysisProgress?.(10)

      // 1. Enhanced Face Detection
      if (enableAdvancedAnalysis) {
        const faceSuggestions = await detectFacesEnhanced(imageData, image.width, image.height, aspectRatio, scale)
        suggestions.push(...faceSuggestions)
        onAnalysisProgress?.(25)
      }

      // 2. Smart Object Detection
      const objectSuggestions = await detectObjectsEnhanced(imageData, image.width, image.height, aspectRatio, scale)
      suggestions.push(...objectSuggestions)
      onAnalysisProgress?.(40)

      // 3. Advanced Edge Detection with Clustering
      const edgeSuggestions = await detectEdgesEnhanced(imageData, image.width, image.height, aspectRatio, scale)
      suggestions.push(...edgeSuggestions)
      onAnalysisProgress?.(55)

      // 4. Color-based Region Analysis
      const colorSuggestions = await detectColorRegionsEnhanced(
        imageData,
        image.width,
        image.height,
        aspectRatio,
        scale,
      )
      suggestions.push(...colorSuggestions)
      onAnalysisProgress?.(70)

      // 5. Composition-based Suggestions (Golden Ratio, Rule of Thirds)
      const compositionSuggestions = generateCompositionSuggestionsEnhanced(image.width, image.height, aspectRatio)
      suggestions.push(...compositionSuggestions)
      onAnalysisProgress?.(85)

      // 6. Smart Focus Point Detection
      const focusSuggestions = await detectFocusPointsEnhanced(imageData, image.width, image.height, aspectRatio, scale)
      suggestions.push(...focusSuggestions)
      onAnalysisProgress?.(95)

      // Process and rank suggestions
      const processedSuggestions = await processSuggestions(suggestions, image.width, image.height)
      const finalSuggestions = rankAndFilterSuggestions(processedSuggestions, maxSuggestions)

      // Add metadata
      const processingTime = performance.now() - startTime
      finalSuggestions.forEach((suggestion) => {
        suggestion.metadata = {
          processingTime,
          algorithm: "enhanced-ai-v2",
          qualityScore: calculateQualityScore(suggestion, image.width, image.height),
        }
      })

      onAnalysisProgress?.(100)
      onSuggestionsReady(finalSuggestions)
    } catch (error) {
      console.error("Error in enhanced image analysis:", error)
      // Fallback to basic suggestions
      const fallbackSuggestions = generateCompositionSuggestionsEnhanced(image.width, image.height, aspectRatio)
      onSuggestionsReady(fallbackSuggestions)
    } finally {
      setIsAnalyzing(false)
    }
  }, [image, aspectRatio, onSuggestionsReady, onAnalysisProgress, maxSuggestions, enableAdvancedAnalysis])

  useEffect(() => {
    if (image) {
      analyzeImage()
    }
  }, [analyzeImage])

  return null
}

// Enhanced face detection with better skin tone analysis and facial feature detection
async function detectFacesEnhanced(
  imageData: ImageData,
  originalWidth: number,
  originalHeight: number,
  aspectRatio?: number,
  scale = 1,
): Promise<CropSuggestion[]> {
  const suggestions: CropSuggestion[] = []
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  const faceRegions: Array<{ x: number; y: number; width: number; height: number; confidence: number }> = []

  // Multi-scale skin tone detection
  const skinToneRanges = [
    { r: [95, 255], g: [40, 255], b: [20, 255] }, // Light skin
    { r: [45, 255], g: [34, 255], b: [30, 255] }, // Medium skin
    { r: [20, 255], g: [15, 255], b: [10, 255] }, // Dark skin
  ]

  for (let y = 0; y < height; y += 8) {
    for (let x = 0; x < width; x += 8) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]

      let isSkin = false
      for (const range of skinToneRanges) {
        if (
          r >= range.r[0] &&
          r <= range.r[1] &&
          g >= range.g[0] &&
          g <= range.g[1] &&
          b >= range.b[0] &&
          b <= range.b[1] &&
          r > g &&
          r > b
        ) {
          isSkin = true
          break
        }
      }

      if (isSkin) {
        const region = findConnectedSkinRegionEnhanced(data, width, height, x, y)
        if (region.width > 30 && region.height > 30) {
          const confidence = calculateFaceConfidence(region, data, width, height)
          if (confidence > 0.3) {
            faceRegions.push({ ...region, confidence })
          }
        }
      }
    }
  }

  // Create crop suggestions around detected faces
  faceRegions.forEach((region, index) => {
    const scaledRegion = {
      x: region.x / scale,
      y: region.y / scale,
      width: region.width / scale,
      height: region.height / scale,
    }

    const cropWidth = aspectRatio ? scaledRegion.height * aspectRatio : Math.max(scaledRegion.width * 1.8, 300)
    const cropHeight = aspectRatio ? cropWidth / aspectRatio : Math.max(scaledRegion.height * 1.8, 300)

    const x = Math.max(0, scaledRegion.x + scaledRegion.width / 2 - cropWidth / 2)
    const y = Math.max(0, scaledRegion.y + scaledRegion.height / 2 - cropHeight / 2)

    suggestions.push({
      id: `face-enhanced-${index}`,
      name: `Portrait ${index + 1}`,
      description: `AI-detected face with ${Math.round(region.confidence * 100)}% confidence`,
      x: Math.min(x, originalWidth - cropWidth),
      y: Math.min(y, originalHeight - cropHeight),
      width: Math.min(cropWidth, originalWidth),
      height: Math.min(cropHeight, originalHeight),
      confidence: Math.min(region.confidence + 0.2, 0.95),
      type: "face",
      features: { faces: [{ ...scaledRegion, confidence: region.confidence }] },
    })
  })

  return suggestions
}

// Enhanced object detection using color clustering and shape analysis
async function detectObjectsEnhanced(
  imageData: ImageData,
  originalWidth: number,
  originalHeight: number,
  aspectRatio?: number,
  scale = 1,
): Promise<CropSuggestion[]> {
  const suggestions: CropSuggestion[] = []
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  // Color clustering for object detection
  const colorClusters = performColorClustering(data, width, height, 8)
  const objects: Array<{ x: number; y: number; width: number; height: number; type: string; confidence: number }> = []

  colorClusters.forEach((cluster, index) => {
    if (cluster.pixels.length > 500) {
      // Significant object size
      const bounds = calculateClusterBounds(cluster.pixels)
      const aspectRatioObj = bounds.width / bounds.height

      let objectType = "object"
      let confidence = 0.6

      // Classify object based on aspect ratio and size
      if (aspectRatioObj > 1.5 && aspectRatioObj < 3) {
        objectType = "horizontal-object"
        confidence = 0.7
      } else if (aspectRatioObj > 0.3 && aspectRatioObj < 0.7) {
        objectType = "vertical-object"
        confidence = 0.7
      } else if (aspectRatioObj > 0.8 && aspectRatioObj < 1.2) {
        objectType = "square-object"
        confidence = 0.8
      }

      objects.push({ ...bounds, type: objectType, confidence })
    }
  })

  // Create crop suggestions for detected objects
  objects.slice(0, 3).forEach((obj, index) => {
    const scaledObj = {
      x: obj.x / scale,
      y: obj.y / scale,
      width: obj.width / scale,
      height: obj.height / scale,
    }

    const padding = Math.min(scaledObj.width, scaledObj.height) * 0.3
    const cropWidth = aspectRatio ? (scaledObj.height + padding * 2) * aspectRatio : scaledObj.width + padding * 2
    const cropHeight = aspectRatio ? cropWidth / aspectRatio : scaledObj.height + padding * 2

    const x = Math.max(0, scaledObj.x + scaledObj.width / 2 - cropWidth / 2)
    const y = Math.max(0, scaledObj.y + scaledObj.height / 2 - cropHeight / 2)

    suggestions.push({
      id: `object-enhanced-${index}`,
      name: `${obj.type.replace("-", " ")} Focus`,
      description: `AI-detected ${obj.type} with smart framing`,
      x: Math.min(x, originalWidth - cropWidth),
      y: Math.min(y, originalHeight - cropHeight),
      width: Math.min(cropWidth, originalWidth),
      height: Math.min(cropHeight, originalHeight),
      confidence: obj.confidence,
      type: "object",
      features: { objects: [{ ...scaledObj, type: obj.type, confidence: obj.confidence }] },
    })
  })

  return suggestions
}

// Enhanced edge detection with gradient analysis and clustering
async function detectEdgesEnhanced(
  imageData: ImageData,
  originalWidth: number,
  originalHeight: number,
  aspectRatio?: number,
  scale = 1,
): Promise<CropSuggestion[]> {
  const suggestions: CropSuggestion[] = []
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  const edges: Array<{ x: number; y: number; strength: number; direction: number }> = []

  // Enhanced Sobel edge detection with direction
  for (let y = 1; y < height - 1; y += 3) {
    for (let x = 1; x < width - 1; x += 3) {
      const gx = sobelXEnhanced(data, width, x, y)
      const gy = sobelYEnhanced(data, width, x, y)
      const magnitude = Math.sqrt(gx * gx + gy * gy)
      const direction = Math.atan2(gy, gx)

      if (magnitude > 30) {
        edges.push({ x, y, strength: magnitude, direction })
      }
    }
  }

  // Cluster edges by proximity and direction
  const edgeClusters = clusterEdgesEnhanced(edges, 80, Math.PI / 4)

  edgeClusters.forEach((cluster, index) => {
    if (cluster.length > 15) {
      const centerX = cluster.reduce((sum, edge) => sum + edge.x, 0) / cluster.length / scale
      const centerY = cluster.reduce((sum, edge) => sum + edge.y, 0) / cluster.length / scale
      const avgStrength = cluster.reduce((sum, edge) => sum + edge.strength, 0) / cluster.length
      const dominantDirection = calculateDominantDirection(cluster)

      const cropWidth = aspectRatio ? 400 * aspectRatio : 400
      const cropHeight = aspectRatio ? cropWidth / aspectRatio : 400

      const x = Math.max(0, centerX - cropWidth / 2)
      const y = Math.max(0, centerY - cropHeight / 2)

      suggestions.push({
        id: `edge-enhanced-${index}`,
        name: `Edge Focus ${index + 1}`,
        description: `High-contrast area with ${Math.round(avgStrength)} edge strength`,
        x: Math.min(x, originalWidth - cropWidth),
        y: Math.min(y, originalHeight - cropHeight),
        width: Math.min(cropWidth, originalWidth),
        height: Math.min(cropHeight, originalHeight),
        confidence: Math.min(avgStrength / 150, 0.9),
        type: "edge",
        features: { edges: cluster.map((e) => ({ x: e.x / scale, y: e.y / scale, strength: e.strength })) },
      })
    }
  })

  return suggestions
}

// Enhanced color region detection with saturation and brightness analysis
async function detectColorRegionsEnhanced(
  imageData: ImageData,
  originalWidth: number,
  originalHeight: number,
  aspectRatio?: number,
  scale = 1,
): Promise<CropSuggestion[]> {
  const suggestions: CropSuggestion[] = []
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  const colorRegions: Array<{
    x: number
    y: number
    width: number
    height: number
    dominantColor: string
    saturation: number
    brightness: number
  }> = []

  // Analyze color distribution with HSV
  const colorMap = new Map<string, Array<{ x: number; y: number; h: number; s: number; v: number }>>()

  for (let y = 0; y < height; y += 15) {
    for (let x = 0; x < width; x += 15) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]

      const hsv = rgbToHsv(r, g, b)

      // Quantize hue for clustering
      const quantizedH = Math.floor(hsv.h / 30) * 30
      const colorKey = `${quantizedH}`

      if (!colorMap.has(colorKey)) {
        colorMap.set(colorKey, [])
      }
      colorMap.get(colorKey)!.push({ x, y, h: hsv.h, s: hsv.s, v: hsv.v })
    }
  }

  // Find significant color regions
  colorMap.forEach((pixels, colorKey) => {
    if (pixels.length > 30) {
      const avgSaturation = pixels.reduce((sum, p) => sum + p.s, 0) / pixels.length
      const avgBrightness = pixels.reduce((sum, p) => sum + p.v, 0) / pixels.length

      // Only consider regions with good saturation or brightness contrast
      if (avgSaturation > 0.3 || avgBrightness > 0.7 || avgBrightness < 0.3) {
        const minX = Math.min(...pixels.map((p) => p.x))
        const maxX = Math.max(...pixels.map((p) => p.x))
        const minY = Math.min(...pixels.map((p) => p.y))
        const maxY = Math.max(...pixels.map((p) => p.y))

        const regionWidth = maxX - minX
        const regionHeight = maxY - minY

        if (regionWidth > 50 && regionHeight > 50) {
          colorRegions.push({
            x: minX,
            y: minY,
            width: regionWidth,
            height: regionHeight,
            dominantColor: colorKey,
            saturation: avgSaturation,
            brightness: avgBrightness,
          })
        }
      }
    }
  })

  // Create crop suggestions for interesting color regions
  colorRegions.slice(0, 3).forEach((region, index) => {
    const scaledRegion = {
      x: region.x / scale,
      y: region.y / scale,
      width: region.width / scale,
      height: region.height / scale,
    }

    const cropWidth = aspectRatio ? scaledRegion.height * aspectRatio : Math.max(scaledRegion.width * 1.3, 300)
    const cropHeight = aspectRatio ? cropWidth / aspectRatio : Math.max(scaledRegion.height * 1.3, 300)

    const x = Math.max(0, scaledRegion.x + scaledRegion.width / 2 - cropWidth / 2)
    const y = Math.max(0, scaledRegion.y + scaledRegion.height / 2 - cropHeight / 2)

    const confidence = (region.saturation + Math.abs(region.brightness - 0.5)) / 2

    suggestions.push({
      id: `color-enhanced-${index}`,
      name: `Color Region ${index + 1}`,
      description: `Vibrant ${region.dominantColor}° hue region`,
      x: Math.min(x, originalWidth - cropWidth),
      y: Math.min(y, originalHeight - cropHeight),
      width: Math.min(cropWidth, originalWidth),
      height: Math.min(cropHeight, originalHeight),
      confidence: Math.min(confidence + 0.3, 0.8),
      type: "color",
      features: {
        colorRegions: [{ ...scaledRegion, dominantColor: region.dominantColor, saturation: region.saturation }],
      },
    })
  })

  return suggestions
}

// Enhanced composition suggestions with golden ratio and dynamic symmetry
function generateCompositionSuggestionsEnhanced(width: number, height: number, aspectRatio?: number): CropSuggestion[] {
  const suggestions: CropSuggestion[] = []

  const cropWidth = aspectRatio ? Math.min(width, height * aspectRatio) : Math.min(width * 0.85, 500)
  const cropHeight = aspectRatio ? cropWidth / aspectRatio : Math.min(height * 0.85, 500)

  // Golden ratio positions (φ ≈ 1.618)
  const phi = 1.618
  const goldenPositions = [
    { x: width / phi - cropWidth / 2, y: height / phi - cropHeight / 2, name: "Golden Ratio Point" },
    { x: width - width / phi - cropWidth / 2, y: height / phi - cropHeight / 2, name: "Golden Ratio Alt" },
    { x: width / phi - cropWidth / 2, y: height - height / phi - cropHeight / 2, name: "Golden Lower" },
    { x: width - width / phi - cropWidth / 2, y: height - height / phi - cropHeight / 2, name: "Golden Lower Alt" },
  ]

  // Rule of thirds positions
  const thirdPositions = [
    { x: width / 3 - cropWidth / 2, y: height / 3 - cropHeight / 2, name: "Top Left Third" },
    { x: (2 * width) / 3 - cropWidth / 2, y: height / 3 - cropHeight / 2, name: "Top Right Third" },
    { x: width / 3 - cropWidth / 2, y: (2 * height) / 3 - cropHeight / 2, name: "Bottom Left Third" },
    { x: (2 * width) / 3 - cropWidth / 2, y: (2 * height) / 3 - cropHeight / 2, name: "Bottom Right Third" },
  ]

  // Center positions with different scales
  const centerPositions = [
    { x: (width - cropWidth) / 2, y: (height - cropHeight) / 2, name: "Perfect Center", scale: 1.0 },
    { x: (width - cropWidth * 0.8) / 2, y: (height - cropHeight * 0.8) / 2, name: "Center Tight", scale: 0.8 },
  ]

  // Add golden ratio suggestions
  goldenPositions.forEach((pos, index) => {
    const x = Math.max(0, Math.min(pos.x, width - cropWidth))
    const y = Math.max(0, Math.min(pos.y, height - cropHeight))

    suggestions.push({
      id: `golden-${index}`,
      name: pos.name,
      description: "Golden ratio composition for visual harmony",
      x,
      y,
      width: cropWidth,
      height: cropHeight,
      confidence: 0.85,
      type: "composition",
    })
  })

  // Add rule of thirds suggestions
  thirdPositions.forEach((pos, index) => {
    const x = Math.max(0, Math.min(pos.x, width - cropWidth))
    const y = Math.max(0, Math.min(pos.y, height - cropHeight))

    suggestions.push({
      id: `thirds-${index}`,
      name: pos.name,
      description: "Rule of thirds composition",
      x,
      y,
      width: cropWidth,
      height: cropHeight,
      confidence: 0.75,
      type: "composition",
    })
  })

  // Add center suggestions
  centerPositions.forEach((pos, index) => {
    const scaledWidth = cropWidth * pos.scale
    const scaledHeight = cropHeight * pos.scale
    const x = Math.max(0, Math.min(pos.x, width - scaledWidth))
    const y = Math.max(0, Math.min(pos.y, height - scaledHeight))

    suggestions.push({
      id: `center-${index}`,
      name: pos.name,
      description: `Centered composition at ${Math.round(pos.scale * 100)}% scale`,
      x,
      y,
      width: scaledWidth,
      height: scaledHeight,
      confidence: 0.6 + pos.scale * 0.2,
      type: "composition",
    })
  })

  return suggestions
}

// Smart focus point detection using gradient magnitude and local maxima
async function detectFocusPointsEnhanced(
  imageData: ImageData,
  originalWidth: number,
  originalHeight: number,
  aspectRatio?: number,
  scale = 1,
): Promise<CropSuggestion[]> {
  const suggestions: CropSuggestion[] = []
  const data = imageData.data
  const width = imageData.width
  const height = imageData.height

  const focusPoints: Array<{ x: number; y: number; importance: number }> = []

  // Calculate gradient magnitude for each pixel
  const gradientMap = new Float32Array(width * height)

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const gx = sobelXEnhanced(data, width, x, y)
      const gy = sobelYEnhanced(data, width, x, y)
      const magnitude = Math.sqrt(gx * gx + gy * gy)
      gradientMap[y * width + x] = magnitude
    }
  }

  // Find local maxima in gradient magnitude
  const windowSize = 20
  for (let y = windowSize; y < height - windowSize; y += windowSize) {
    for (let x = windowSize; x < width - windowSize; x += windowSize) {
      let maxGradient = 0
      let maxX = x
      let maxY = y

      // Find maximum in local window
      for (let dy = -windowSize / 2; dy < windowSize / 2; dy++) {
        for (let dx = -windowSize / 2; dx < windowSize / 2; dx++) {
          const gradient = gradientMap[(y + dy) * width + (x + dx)]
          if (gradient > maxGradient) {
            maxGradient = gradient
            maxX = x + dx
            maxY = y + dy
          }
        }
      }

      if (maxGradient > 50) {
        focusPoints.push({
          x: maxX / scale,
          y: maxY / scale,
          importance: maxGradient / 255,
        })
      }
    }
  }

  // Create crop suggestions around focus points
  focusPoints.slice(0, 4).forEach((point, index) => {
    const cropWidth = aspectRatio ? 350 * aspectRatio : 350
    const cropHeight = aspectRatio ? cropWidth / aspectRatio : 350

    const x = Math.max(0, point.x - cropWidth / 2)
    const y = Math.max(0, point.y - cropHeight / 2)

    suggestions.push({
      id: `focus-${index}`,
      name: `Smart Focus ${index + 1}`,
      description: `AI-detected focus point with ${Math.round(point.importance * 100)}% importance`,
      x: Math.min(x, originalWidth - cropWidth),
      y: Math.min(y, originalHeight - cropHeight),
      width: Math.min(cropWidth, originalWidth),
      height: Math.min(cropHeight, originalHeight),
      confidence: Math.min(point.importance + 0.4, 0.9),
      type: "smart",
      features: { focusPoints: [point] },
    })
  })

  return suggestions
}

// Helper functions
function findConnectedSkinRegionEnhanced(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  startX: number,
  startY: number,
): { x: number; y: number; width: number; height: number } {
  let minX = startX,
    maxX = startX,
    minY = startY,
    maxY = startY
  const visited = new Set<string>()
  const queue = [{ x: startX, y: startY }]

  while (queue.length > 0 && visited.size < 1000) {
    // Limit for performance
    const { x, y } = queue.shift()!
    const key = `${x},${y}`

    if (visited.has(key) || x < 0 || x >= width || y < 0 || y >= height) continue
    visited.add(key)

    const index = (y * width + x) * 4
    const r = data[index]
    const g = data[index + 1]
    const b = data[index + 2]

    if (isSkinToneEnhanced(r, g, b)) {
      minX = Math.min(minX, x)
      maxX = Math.max(maxX, x)
      minY = Math.min(minY, y)
      maxY = Math.max(maxY, y)

      // Add neighbors
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        queue.push({ x: x + dx, y: y + dy })
      }
    }
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY }
}

function isSkinToneEnhanced(r: number, g: number, b: number): boolean {
  // Enhanced skin tone detection with multiple criteria
  const criteria = [
    r > 95 && g > 40 && b > 20 && r > g && r > b && r - g > 15,
    r > 220 && g > 210 && b > 170 && Math.abs(r - g) <= 15 && r >= b && g >= b,
    r > 50 && g > 30 && b > 15 && r > g && g > b && r - g > 10 && g - b > 5,
  ]

  return criteria.some((criterion) => criterion)
}

function calculateFaceConfidence(
  region: { x: number; y: number; width: number; height: number },
  data: Uint8ClampedArray,
  width: number,
  height: number,
): number {
  const aspectRatio = region.width / region.height
  let confidence = 0

  // Aspect ratio check (faces are typically 0.7-1.3 ratio)
  if (aspectRatio >= 0.7 && aspectRatio <= 1.3) confidence += 0.3

  // Size check (reasonable face size)
  const area = region.width * region.height
  if (area >= 900 && area <= 10000) confidence += 0.2

  // Skin tone consistency check
  let skinPixels = 0
  let totalPixels = 0

  for (let y = region.y; y < region.y + region.height && y < height; y += 3) {
    for (let x = region.x; x < region.x + region.width && x < width; x += 3) {
      const index = (y * width + x) * 4
      const r = data[index]
      const g = data[index + 1]
      const b = data[index + 2]

      if (isSkinToneEnhanced(r, g, b)) skinPixels++
      totalPixels++
    }
  }

  const skinRatio = skinPixels / totalPixels
  if (skinRatio > 0.3) confidence += skinRatio * 0.5

  return Math.min(confidence, 1.0)
}

function performColorClustering(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  numClusters: number,
): Array<{ centroid: [number, number, number]; pixels: Array<{ x: number; y: number }> }> {
  const pixels: Array<{ x: number; y: number; r: number; g: number; b: number }> = []

  // Sample pixels for clustering
  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {
      const index = (y * width + x) * 4
      pixels.push({
        x,
        y,
        r: data[index],
        g: data[index + 1],
        b: data[index + 2],
      })
    }
  }

  // Simple k-means clustering
  const clusters: Array<{ centroid: [number, number, number]; pixels: Array<{ x: number; y: number }> }> = []

  // Initialize centroids randomly
  for (let i = 0; i < numClusters; i++) {
    const randomPixel = pixels[Math.floor(Math.random() * pixels.length)]
    clusters.push({
      centroid: [randomPixel.r, randomPixel.g, randomPixel.b],
      pixels: [],
    })
  }

  // Perform clustering iterations
  for (let iter = 0; iter < 5; iter++) {
    // Clear clusters
    clusters.forEach((cluster) => (cluster.pixels = []))

    // Assign pixels to nearest centroid
    pixels.forEach((pixel) => {
      let minDistance = Number.POSITIVE_INFINITY
      let nearestCluster = 0

      clusters.forEach((cluster, index) => {
        const distance = Math.sqrt(
          Math.pow(pixel.r - cluster.centroid[0], 2) +
            Math.pow(pixel.g - cluster.centroid[1], 2) +
            Math.pow(pixel.b - cluster.centroid[2], 2),
        )
        if (distance < minDistance) {
          minDistance = distance
          nearestCluster = index
        }
      })

      clusters[nearestCluster].pixels.push({ x: pixel.x, y: pixel.y })
    })

    // Update centroids
    clusters.forEach((cluster) => {
      if (cluster.pixels.length > 0) {
        const avgR =
          cluster.pixels.reduce((sum, p) => {
            const index = (p.y * width + p.x) * 4
            return sum + data[index]
          }, 0) / cluster.pixels.length

        const avgG =
          cluster.pixels.reduce((sum, p) => {
            const index = (p.y * width + p.x) * 4
            return sum + data[index + 1]
          }, 0) / cluster.pixels.length

        const avgB =
          cluster.pixels.reduce((sum, p) => {
            const index = (p.y * width + p.x) * 4
            return sum + data[index + 2]
          }, 0) / cluster.pixels.length

        cluster.centroid = [avgR, avgG, avgB]
      }
    })
  }

  return clusters
}

function calculateClusterBounds(pixels: Array<{ x: number; y: number }>): {
  x: number
  y: number
  width: number
  height: number
} {
  const minX = Math.min(...pixels.map((p) => p.x))
  const maxX = Math.max(...pixels.map((p) => p.x))
  const minY = Math.min(...pixels.map((p) => p.y))
  const maxY = Math.max(...pixels.map((p) => p.y))

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  }
}

function sobelXEnhanced(data: Uint8ClampedArray, width: number, x: number, y: number): number {
  const getPixel = (px: number, py: number) => {
    const index = (py * width + px) * 4
    return data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114 // Luminance
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

function sobelYEnhanced(data: Uint8ClampedArray, width: number, x: number, y: number): number {
  const getPixel = (px: number, py: number) => {
    const index = (py * width + px) * 4
    return data[index] * 0.299 + data[index + 1] * 0.587 + data[index + 2] * 0.114 // Luminance
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

function clusterEdgesEnhanced(
  edges: Array<{ x: number; y: number; strength: number; direction: number }>,
  distanceThreshold: number,
  directionThreshold: number,
): Array<Array<{ x: number; y: number; strength: number; direction: number }>> {
  const clusters: Array<Array<{ x: number; y: number; strength: number; direction: number }>> = []
  const visited = new Set<number>()

  edges.forEach((edge, index) => {
    if (visited.has(index)) return

    const cluster = [edge]
    visited.add(index)

    edges.forEach((otherEdge, otherIndex) => {
      if (visited.has(otherIndex)) return

      const distance = Math.sqrt(Math.pow(edge.x - otherEdge.x, 2) + Math.pow(edge.y - otherEdge.y, 2))
      const directionDiff = Math.abs(edge.direction - otherEdge.direction)
      const normalizedDirectionDiff = Math.min(directionDiff, 2 * Math.PI - directionDiff)

      if (distance < distanceThreshold && normalizedDirectionDiff < directionThreshold) {
        cluster.push(otherEdge)
        visited.add(otherIndex)
      }
    })

    clusters.push(cluster)
  })

  return clusters
}

function calculateDominantDirection(edges: Array<{ direction: number }>): number {
  const directions = edges.map((e) => e.direction)
  // Simple average - could be improved with circular statistics
  return directions.reduce((sum, dir) => sum + dir, 0) / directions.length
}

function rgbToHsv(r: number, g: number, b: number): { h: number; s: number; v: number } {
  r /= 255
  g /= 255
  b /= 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min

  let h = 0
  if (diff !== 0) {
    if (max === r) h = ((g - b) / diff) % 6
    else if (max === g) h = (b - r) / diff + 2
    else h = (r - g) / diff + 4
  }
  h = Math.round(h * 60)
  if (h < 0) h += 360

  const s = max === 0 ? 0 : diff / max
  const v = max

  return { h, s, v }
}

async function processSuggestions(
  suggestions: CropSuggestion[],
  imageWidth: number,
  imageHeight: number,
): Promise<CropSuggestion[]> {
  // Remove suggestions that are too small or too large
  return suggestions.filter((suggestion) => {
    const area = suggestion.width * suggestion.height
    const imageArea = imageWidth * imageHeight
    const areaRatio = area / imageArea

    return areaRatio >= 0.1 && areaRatio <= 0.9 && suggestion.width >= 100 && suggestion.height >= 100
  })
}

function rankAndFilterSuggestions(suggestions: CropSuggestion[], maxSuggestions: number): CropSuggestion[] {
  // Remove duplicates based on position and size similarity
  const unique = suggestions.filter((suggestion, index) => {
    return !suggestions.slice(0, index).some((existing) => {
      const xDiff = Math.abs(existing.x - suggestion.x)
      const yDiff = Math.abs(existing.y - suggestion.y)
      const wDiff = Math.abs(existing.width - suggestion.width)
      const hDiff = Math.abs(existing.height - suggestion.height)

      return xDiff < 50 && yDiff < 50 && wDiff < 50 && hDiff < 50
    })
  })

  // Sort by confidence and type priority
  const typePriority = { face: 5, smart: 4, object: 3, edge: 2, color: 1, composition: 0 }

  return unique
    .sort((a, b) => {
      const priorityDiff = (typePriority[b.type] || 0) - (typePriority[a.type] || 0)
      if (priorityDiff !== 0) return priorityDiff
      return b.confidence - a.confidence
    })
    .slice(0, maxSuggestions)
}

function calculateQualityScore(suggestion: CropSuggestion, imageWidth: number, imageHeight: number): number {
  let score = suggestion.confidence

  // Bonus for good aspect ratios
  const aspectRatio = suggestion.width / suggestion.height
  if (aspectRatio >= 0.5 && aspectRatio <= 2.0) score += 0.1

  // Bonus for reasonable size
  const area = suggestion.width * suggestion.height
  const imageArea = imageWidth * imageHeight
  const areaRatio = area / imageArea
  if (areaRatio >= 0.2 && areaRatio <= 0.8) score += 0.1

  // Bonus for center proximity (but not too centered)
  const centerX = imageWidth / 2
  const centerY = imageHeight / 2
  const suggestionCenterX = suggestion.x + suggestion.width / 2
  const suggestionCenterY = suggestion.y + suggestion.height / 2

  const distanceFromCenter = Math.sqrt(
    Math.pow(suggestionCenterX - centerX, 2) + Math.pow(suggestionCenterY - centerY, 2),
  )
  const normalizedDistance = distanceFromCenter / Math.sqrt(centerX * centerX + centerY * centerY)

  if (normalizedDistance >= 0.1 && normalizedDistance <= 0.4) score += 0.05

  return Math.min(score, 1.0)
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Brain, Sparkles, Eye, EyeOff, Zap, Target, Palette, Grid3X3 } from "lucide-react"
import type { CropSuggestion } from "./enhanced-ai-crop-detector"

interface CropSuggestionsPanelProps {
  suggestions: CropSuggestion[]
  selectedSuggestion: string | null
  onSelectSuggestion: (suggestion: CropSuggestion) => void
  onToggleVisibility: () => void
  isVisible: boolean
  isAnalyzing: boolean
}

export function CropSuggestionsPanel({
  suggestions,
  selectedSuggestion,
  onSelectSuggestion,
  onToggleVisibility,
  isVisible,
  isAnalyzing,
}: CropSuggestionsPanelProps) {
  const [filterType, setFilterType] = useState<string>("all")

  const getTypeIcon = (type: CropSuggestion["type"]) => {
    switch (type) {
      case "face":
        return "👤"
      case "object":
        return <Target className="w-3 h-3" />
      case "composition":
        return <Grid3X3 className="w-3 h-3" />
      case "edge":
        return <Zap className="w-3 h-3" />
      case "color":
        return <Palette className="w-3 h-3" />
      case "smart":
        return <Brain className="w-3 h-3" />
      default:
        return <Sparkles className="w-3 h-3" />
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "bg-green-500"
    if (confidence >= 0.6) return "bg-yellow-500"
    return "bg-orange-500"
  }

  const getTypeColor = (type: CropSuggestion["type"]) => {
    switch (type) {
      case "face":
        return "bg-blue-100 text-blue-800"
      case "object":
        return "bg-purple-100 text-purple-800"
      case "composition":
        return "bg-green-100 text-green-800"
      case "edge":
        return "bg-orange-100 text-orange-800"
      case "color":
        return "bg-pink-100 text-pink-800"
      case "smart":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredSuggestions = suggestions.filter((suggestion) => filterType === "all" || suggestion.type === filterType)

  const suggestionTypes = [...new Set(suggestions.map((s) => s.type))]

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Brain className="w-4 h-4 text-blue-600" />
            AI Crop Suggestions
            {suggestions.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {suggestions.length}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onToggleVisibility} className="h-6 px-2">
            {isVisible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          </Button>
        </div>

        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
              className="h-6 px-2 text-xs"
            >
              All
            </Button>
            {suggestionTypes.map((type) => (
              <Button
                key={type}
                variant={filterType === type ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType(type)}
                className="h-6 px-2 text-xs capitalize"
              >
                {getTypeIcon(type)}
                <span className="ml-1">{type}</span>
              </Button>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="p-0">
        {isAnalyzing ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center space-y-3">
              <Brain className="w-8 h-8 mx-auto animate-pulse text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium">AI Analyzing Image</p>
                <p className="text-xs text-gray-500">Detecting optimal crop areas...</p>
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }} />
              </div>
            </div>
          </div>
        ) : filteredSuggestions.length === 0 ? (
          <div className="text-center py-8 px-4 text-gray-500">
            <Brain className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm font-medium mb-1">No suggestions available</p>
            <p className="text-xs">Upload an image to get AI crop suggestions</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-2 p-3">
              {filteredSuggestions.map((suggestion, index) => (
                <div key={suggestion.id}>
                  <div
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      selectedSuggestion === suggestion.id
                        ? "border-green-500 bg-green-50 shadow-md"
                        : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                    onClick={() => onSelectSuggestion(suggestion)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-5 h-5">{getTypeIcon(suggestion.type)}</div>
                        <span className="text-xs font-medium truncate">{suggestion.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${getConfidenceColor(suggestion.confidence)}`} />
                        {selectedSuggestion === suggestion.id && (
                          <Badge
                            variant="outline"
                            className="text-xs px-1 py-0 h-4 bg-green-100 text-green-700 border-green-300"
                          >
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{suggestion.description}</p>

                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`text-xs ${getTypeColor(suggestion.type)}`}>
                        {suggestion.type}
                      </Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{Math.round(suggestion.confidence * 100)}%</span>
                        {suggestion.metadata && (
                          <span className="text-xs text-gray-400">
                            {Math.round(suggestion.metadata.qualityScore * 100)}Q
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Feature indicators */}
                    {suggestion.features && (
                      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-100">
                        {suggestion.features.faces && suggestion.features.faces.length > 0 && (
                          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                            👤 {suggestion.features.faces.length}
                          </Badge>
                        )}
                        {suggestion.features.objects && suggestion.features.objects.length > 0 && (
                          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                            🎯 {suggestion.features.objects.length}
                          </Badge>
                        )}
                        {suggestion.features.focusPoints && suggestion.features.focusPoints.length > 0 && (
                          <Badge variant="outline" className="text-xs px-1 py-0 h-4">
                            ⚡ {suggestion.features.focusPoints.length}
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {index < filteredSuggestions.length - 1 && <Separator className="my-2" />}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}

        {suggestions.length > 0 && !isAnalyzing && (
          <div className="p-3 border-t bg-gray-50">
            <div className="text-xs text-gray-500 space-y-1">
              <div className="flex items-center justify-between">
                <span>Analysis Quality:</span>
                <div className="flex items-center gap-1">
                  {suggestions.slice(0, 3).map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-full bg-green-500" />
                  ))}
                  <span className="ml-1">High</span>
                </div>
              </div>
              <p>• Green border = AI suggestion applied</p>
              <p>• Higher % = better confidence</p>
              <p>• Q score = overall quality rating</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

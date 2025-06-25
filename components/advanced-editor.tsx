"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AdvancedEditorProps {
  onStyleChange: (styles: any) => void
}

export function AdvancedEditor({ onStyleChange }: AdvancedEditorProps) {
  const [textShadow, setTextShadow] = useState([0])
  const [borderRadius, setBorderRadius] = useState([15])
  const [opacity, setOpacity] = useState([100])

  return (
    <Tabs defaultValue="effects" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="effects">Effects</TabsTrigger>
        <TabsTrigger value="filters">Filters</TabsTrigger>
        <TabsTrigger value="animation">Animation</TabsTrigger>
      </TabsList>

      <TabsContent value="effects" className="space-y-4">
        <div className="space-y-2">
          <Label>Text Shadow</Label>
          <Slider value={textShadow} onValueChange={setTextShadow} max={10} step={1} className="w-full" />
        </div>

        <div className="space-y-2">
          <Label>Border Radius</Label>
          <Slider value={borderRadius} onValueChange={setBorderRadius} max={50} step={1} className="w-full" />
        </div>

        <div className="space-y-2">
          <Label>Opacity</Label>
          <Slider value={opacity} onValueChange={setOpacity} max={100} step={1} className="w-full" />
        </div>
      </TabsContent>

      <TabsContent value="filters" className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          {["Vintage", "B&W", "Sepia", "Bright", "Contrast", "Warm"].map((filter) => (
            <Button key={filter} variant="outline" size="sm" onClick={() => onStyleChange({ filter })}>
              {filter}
            </Button>
          ))}
        </div>
      </TabsContent>

      <TabsContent value="animation" className="space-y-4">
        <div className="grid grid-cols-1 gap-2">
          {["Fade In", "Slide Up", "Zoom In", "Bounce"].map((animation) => (
            <Button key={animation} variant="outline" size="sm" onClick={() => onStyleChange({ animation })}>
              {animation}
            </Button>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  )
}

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useBanner } from "@/contexts/banner-context"
import { Type, AlignLeft, AlignCenter, AlignRight, Bold, Italic } from "lucide-react"

const fontOptions = [
  "Inter",
  "Roboto",
  "Open Sans",
  "Lato",
  "Montserrat",
  "Poppins",
  "Source Sans Pro",
  "Oswald",
  "Raleway",
  "PT Sans",
  "Playfair Display",
  "Merriweather",
  "Lora",
  "Crimson Text",
  "EB Garamond",
]

export default function TypographyPage() {
  const { bannerData, setBannerData } = useBanner()

  const updateTextStyle = (field: string, value: string | number) => {
    setBannerData((prev) => ({
      ...prev,
      textStyles: {
        ...prev.textStyles,
        [field]: value,
      },
    }))
  }

  const textElements = [
    { key: "shopName", label: "Shop/Brand Name", sizeKey: "shopNameSize", fontKey: "shopNameFont" },
    { key: "productName", label: "Product Name", sizeKey: "productNameSize", fontKey: "productNameFont" },
    { key: "description", label: "Description", sizeKey: "descriptionSize", fontKey: "descriptionFont" },
    { key: "price", label: "Price", sizeKey: "priceSize", fontKey: "priceFont" },
    {
      key: "inspirationalText",
      label: "Inspirational Text",
      sizeKey: "inspirationalTextSize",
      fontKey: "inspirationalTextFont",
    },
    { key: "authorName", label: "Author Name", sizeKey: "authorNameSize", fontKey: "authorNameFont" },
    { key: "dateText", label: "Date Text", sizeKey: "dateTextSize", fontKey: "dateTextFont" },
  ]

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Typography Settings</h1>
        <p className="text-gray-600">Customize fonts, sizes, and text styling for your banners</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Typography Controls */}
        <div className="space-y-6">
          {textElements.map((element) => (
            <Card key={element.key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Type className="w-5 h-5" />
                  {element.label}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Font Family</Label>
                  <Select
                    value={bannerData.textStyles[element.fontKey as keyof typeof bannerData.textStyles] as string}
                    onValueChange={(value) => updateTextStyle(element.fontKey, value)}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>
                    Font Size: {bannerData.textStyles[element.sizeKey as keyof typeof bannerData.textStyles]}px
                  </Label>
                  <Slider
                    value={[bannerData.textStyles[element.sizeKey as keyof typeof bannerData.textStyles] as number]}
                    onValueChange={([value]) => updateTextStyle(element.sizeKey, value)}
                    min={8}
                    max={72}
                    step={1}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label>Text Alignment</Label>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      <AlignLeft className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlignCenter className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <AlignRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Text Style</Label>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm">
                      <Bold className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Italic className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Typography Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
                <div
                  style={{
                    fontFamily: bannerData.textStyles.shopNameFont,
                    fontSize: `${bannerData.textStyles.shopNameSize}px`,
                    fontWeight: "bold",
                  }}
                >
                  {bannerData.shopName || "Your Brand Name"}
                </div>

                <div
                  style={{
                    fontFamily: bannerData.textStyles.productNameFont,
                    fontSize: `${bannerData.textStyles.productNameSize}px`,
                    fontWeight: "600",
                  }}
                >
                  {bannerData.productName || "Product Name"}
                </div>

                <div
                  style={{
                    fontFamily: bannerData.textStyles.descriptionFont,
                    fontSize: `${bannerData.textStyles.descriptionSize}px`,
                  }}
                >
                  {bannerData.description ||
                    "This is a sample description text that shows how your content will look with the selected typography settings."}
                </div>

                <div
                  style={{
                    fontFamily: bannerData.textStyles.priceFont,
                    fontSize: `${bannerData.textStyles.priceSize}px`,
                    fontWeight: "bold",
                    color: "#059669",
                  }}
                >
                  {bannerData.price || "$99.99"}
                </div>

                <div
                  style={{
                    fontFamily: bannerData.textStyles.inspirationalTextFont,
                    fontSize: `${bannerData.textStyles.inspirationalTextSize}px`,
                    fontStyle: "italic",
                  }}
                >
                  {bannerData.inspirationalText || "Inspirational quote or message"}
                </div>

                <div
                  style={{
                    fontFamily: bannerData.textStyles.authorNameFont,
                    fontSize: `${bannerData.textStyles.authorNameSize}px`,
                  }}
                >
                  {bannerData.authorName || "Author Name"}
                </div>

                <div
                  style={{
                    fontFamily: bannerData.textStyles.dateTextFont,
                    fontSize: `${bannerData.textStyles.dateTextSize}px`,
                    color: "#6B7280",
                  }}
                >
                  {bannerData.dateText || "January 2024"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Font Pairing Suggestions */}
          <Card>
            <CardHeader>
              <CardTitle>Font Pairing Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <div className="text-left">
                    <div className="font-semibold">Modern & Clean</div>
                    <div className="text-sm text-gray-600">Inter + Roboto</div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <div className="text-left">
                    <div className="font-semibold">Elegant & Classic</div>
                    <div className="text-sm text-gray-600">Playfair Display + Lato</div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <div className="text-left">
                    <div className="font-semibold">Bold & Impactful</div>
                    <div className="text-sm text-gray-600">Oswald + Open Sans</div>
                  </div>
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <div className="text-left">
                    <div className="font-semibold">Friendly & Approachable</div>
                    <div className="text-sm text-gray-600">Poppins + Source Sans Pro</div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <Button className="w-full">Apply to All Text</Button>
              <Button variant="outline" className="w-full bg-transparent">
                Save Typography Preset
              </Button>
              <Button variant="outline" className="w-full bg-transparent">
                Reset to Defaults
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export interface ImageFilters {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  sepia: number
  grayscale: number
  hueRotate: number
  hdr: number
  vignette: number
  filmGrain: number
  textureType: string
  textureIntensity: number
  textureBlendMode: string
  preset: string
}

export interface TextStyles {
  shopNameFont: string
  shopNameSize: number
  productNameFont: string
  productNameSize: number
  priceFont: string
  priceSize: number
  inspirationalTextFont: string
  inspirationalTextSize: number
  authorNameFont: string
  authorNameSize: number
  dateTextFont: string
  dateTextSize: number
}

export interface BannerData {
  shopName: string
  productName: string
  productImage: string | null
  horizontalImage: string | null
  verticalImage1: string | null
  verticalImage2: string | null
  verticalImage3: string | null
  inspirationalImage1: string | null
  inspirationalImage2: string | null
  resolution: "instagram_post" | "instagram_story" | "hd" | "4k"
  designTheme:
    | "social_gallery"
    | "instagram_mood"
    | "minimalist"
    | "vibrant"
    | "elegant_cursive"
    | "inspirational_vibes"
    | "maritime_adventure"
  photographer: string
  price: string
  inspirationalText: string
  authorName: string
  dateText: string
  textStyles: TextStyles
  imageFilters: {
    productImage: ImageFilters
    horizontalImage: ImageFilters
    verticalImage1: ImageFilters
    verticalImage2: ImageFilters
    verticalImage3: ImageFilters
    inspirationalImage1: ImageFilters
    inspirationalImage2: ImageFilters
  }
}

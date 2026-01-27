import { ComponentType } from "react"

export interface VariationConfig {
  id: string
  name: string
  description?: string
  component: ComponentType
}

export interface RouteVariations {
  variations: VariationConfig[]
  defaultVariation: string
}

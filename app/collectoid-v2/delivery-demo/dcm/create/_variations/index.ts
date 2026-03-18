import type { VariationConfig } from "../../../_components/variation-types"
import Variation1 from "./variation-1"
import Variation2 from "./variation-2"

export const variations: VariationConfig[] = [
  {
    id: "2",
    name: "Simple Start",
    description: "Title & description first, then workspace",
    component: Variation2,
  },
  {
    id: "1",
    name: "AI-Guided Wizard",
    description: "7-step creation with AI suggestions",
    component: Variation1,
  },
]

export const defaultVariation = "2"

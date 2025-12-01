import type { VariationConfig } from "@/app/collectoid/_components/variation-types"
import Variation1 from "./variation-1"

export const variations: VariationConfig[] = [
  {
    id: "1",
    name: "Default Layout",
    description: "Standard 7-step creation wizard",
    component: Variation1,
  },
]

export const defaultVariation = "1"

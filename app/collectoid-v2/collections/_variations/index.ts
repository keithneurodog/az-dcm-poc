import type { VariationConfig } from "@/app/collectoid-v2/_components/variation-types"
import Variation1 from "./variation-1"
import VariationV2 from "./variation-v2"

export const variations: VariationConfig[] = [
  {
    id: "1",
    name: "Default Layout",
    description: "Checkbox/radio filters in sidebar",
    component: Variation1,
  },
  {
    id: "v2",
    name: "Flexible Filtering",
    description: "Floating header with filter chips and 3 view modes (Cards, Table, Kanban)",
    component: VariationV2,
  },
]

export const defaultVariation = "1"

import type { VariationConfig } from "@/app/collectoid/_components/variation-types"
import Variation1 from "./variation-1"
import VariationDatasets from "./variation-datasets"

export const variations: VariationConfig[] = [
  {
    id: "1",
    name: "Collections Focus",
    description: "AI discovery focused on finding curated collections",
    component: Variation1,
  },
  {
    id: "datasets",
    name: "Dataset Explorer",
    description: "Dataset-first view with filters, grouping by access status",
    component: VariationDatasets,
  },
]

export const defaultVariation = "datasets"

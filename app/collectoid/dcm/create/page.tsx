"use client"

import { usePathname } from "next/navigation"
import { useVariation } from "@/app/collectoid/_components"
import { variations, defaultVariation } from "./_variations"

export default function DCMCreateCollectionPage() {
  const pathname = usePathname()
  const { getVariation } = useVariation()

  // Get stored variation or use default
  const storedVariation = getVariation(pathname)
  const currentVariationId =
    storedVariation && variations.some((v) => v.id === storedVariation)
      ? storedVariation
      : defaultVariation

  // Find the current variation config
  const currentVariation = variations.find((v) => v.id === currentVariationId)

  if (!currentVariation) {
    return null
  }

  // Render the selected variation component
  const VariationComponent = currentVariation.component
  return <VariationComponent />
}

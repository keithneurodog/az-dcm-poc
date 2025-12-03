"use client"

import { usePathname } from "next/navigation"
import { useVariation } from "@/app/collectoid/_components"
import { variations, defaultVariation } from "./_variations"

export default function AIDiscoveryPage() {
  const pathname = usePathname()
  const { getVariation } = useVariation()

  // Get stored variation or use default
  const storedVariation = getVariation(pathname)
  const currentVariationId = storedVariation && variations.some(v => v.id === storedVariation)
    ? storedVariation
    : defaultVariation

  // Find and render the component
  const currentVariation = variations.find(v => v.id === currentVariationId)
  const VariationComponent = currentVariation?.component

  if (!VariationComponent) {
    return <div>Variation not found</div>
  }

  return <VariationComponent />
}

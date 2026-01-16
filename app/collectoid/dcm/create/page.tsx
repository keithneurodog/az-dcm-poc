"use client"

import { Suspense } from "react"
import { usePathname } from "next/navigation"
import { useVariation } from "@/app/collectoid/_components"
import { variations, defaultVariation } from "./_variations"

function DCMCreateContent() {
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

export default function DCMCreateCollectionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <DCMCreateContent />
    </Suspense>
  )
}

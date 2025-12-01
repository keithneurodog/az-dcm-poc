"use client"

import { useState, useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"
import type { RouteVariations } from "./variation-types"

// Registry of routes with variations
// Add new routes here as you create _variations folders
const variationLoaders: Record<string, () => Promise<RouteVariations>> = {
  "/collectoid/dcm/create": async () => {
    const mod = await import("@/app/collectoid/dcm/create/_variations")
    return {
      variations: mod.variations,
      defaultVariation: mod.defaultVariation,
    }
  },
  "/collectoid/collections": async () => {
    const mod = await import("@/app/collectoid/collections/_variations")
    return {
      variations: mod.variations,
      defaultVariation: mod.defaultVariation,
    }
  },
  // Add more routes as needed
}

// Cache for loaded variations
const variationsCache = new Map<string, RouteVariations | null>()

export function useRouteVariations() {
  const pathname = usePathname()
  const [variations, setVariations] = useState<RouteVariations | null>(
    variationsCache.get(pathname) ?? null
  )
  const [loading, setLoading] = useState(!variationsCache.has(pathname))

  // Check if this route has a loader registered
  const hasLoader = useMemo(() => pathname in variationLoaders, [pathname])

  useEffect(() => {
    // If no loader for this route, nothing to do
    if (!hasLoader) {
      setVariations(null)
      setLoading(false)
      return
    }

    // If already cached, use cached value
    if (variationsCache.has(pathname)) {
      setVariations(variationsCache.get(pathname) ?? null)
      setLoading(false)
      return
    }

    // Load variations
    let cancelled = false
    setLoading(true)

    variationLoaders[pathname]()
      .then((result) => {
        if (!cancelled) {
          variationsCache.set(pathname, result)
          setVariations(result)
        }
      })
      .catch(() => {
        if (!cancelled) {
          variationsCache.set(pathname, null)
          setVariations(null)
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [pathname, hasLoader])

  return {
    variations,
    loading,
    hasVariations: !!variations && variations.variations.length > 0,
    pathname,
  }
}

// Helper to check if a route has variations registered
export function hasVariationsRegistered(pathname: string): boolean {
  return pathname in variationLoaders
}

// Get list of all registered routes (for debugging)
export function getRegisteredRoutes(): string[] {
  return Object.keys(variationLoaders)
}

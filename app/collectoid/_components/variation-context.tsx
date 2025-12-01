"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"

const STORAGE_KEY_PREFIX = "collectoid_variation_"

interface VariationState {
  [route: string]: string
}

interface VariationContextType {
  getVariation: (route: string) => string | null
  setVariation: (route: string, variationId: string) => void
  clearVariation: (route: string) => void
  clearAllVariations: () => void
}

const VariationContext = createContext<VariationContextType | undefined>(undefined)

export function VariationProvider({ children }: { children: ReactNode }) {
  const [variations, setVariations] = useState<VariationState>({})
  const [isHydrated, setIsHydrated] = useState(false)

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored: VariationState = {}
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key?.startsWith(STORAGE_KEY_PREFIX)) {
          const route = key.replace(STORAGE_KEY_PREFIX, "")
          stored[route] = sessionStorage.getItem(key) || ""
        }
      }
      setVariations(stored)
      setIsHydrated(true)
    }
  }, [])

  const getVariation = useCallback(
    (route: string): string | null => {
      return variations[route] || null
    },
    [variations]
  )

  const setVariation = useCallback((route: string, variationId: string) => {
    setVariations((prev) => ({ ...prev, [route]: variationId }))
    if (typeof window !== "undefined") {
      sessionStorage.setItem(`${STORAGE_KEY_PREFIX}${route}`, variationId)
    }
  }, [])

  const clearVariation = useCallback((route: string) => {
    setVariations((prev) => {
      const next = { ...prev }
      delete next[route]
      return next
    })
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(`${STORAGE_KEY_PREFIX}${route}`)
    }
  }, [])

  const clearAllVariations = useCallback(() => {
    setVariations({})
    if (typeof window !== "undefined") {
      const keysToRemove: string[] = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key?.startsWith(STORAGE_KEY_PREFIX)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach((key) => sessionStorage.removeItem(key))
    }
  }, [])

  return (
    <VariationContext.Provider
      value={{
        getVariation,
        setVariation,
        clearVariation,
        clearAllVariations,
      }}
    >
      {children}
    </VariationContext.Provider>
  )
}

export function useVariation() {
  const context = useContext(VariationContext)
  if (!context) {
    throw new Error("useVariation must be used within VariationProvider")
  }
  return context
}

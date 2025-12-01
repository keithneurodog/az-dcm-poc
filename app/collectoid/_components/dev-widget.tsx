"use client"

import { useState } from "react"
import { Palette, X, Layers, Check, RotateCcw } from "lucide-react"
import { useColorScheme, colorSchemes } from "./color-context"
import { useVariation } from "./variation-context"
import { useRouteVariations } from "./use-route-variations"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function DevWidget() {
  const [isColorOpen, setIsColorOpen] = useState(false)
  const [isVariationOpen, setIsVariationOpen] = useState(false)
  const { scheme, schemeName, setScheme } = useColorScheme()
  const { getVariation, setVariation } = useVariation()
  const { variations: routeVariations, hasVariations, pathname } = useRouteVariations()

  const currentVariationId = hasVariations
    ? getVariation(pathname) || routeVariations?.defaultVariation
    : null

  const currentVariation = hasVariations && routeVariations
    ? routeVariations.variations.find(v => v.id === currentVariationId)
    : null

  const defaultVariation = hasVariations && routeVariations
    ? routeVariations.variations.find(v => v.id === routeVariations.defaultVariation)
    : null

  const isViewingNonDefault = hasVariations && routeVariations && currentVariationId !== routeVariations.defaultVariation

  const handleRevertToDefault = () => {
    if (routeVariations?.defaultVariation) {
      setVariation(pathname, routeVariations.defaultVariation)
    }
  }

  return (
    <div className="fixed bottom-20 right-6 z-40 flex flex-col gap-3">
      {/* Color Scheme Panel */}
      {isColorOpen && (
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-200 p-5 w-72">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Palette className={cn("size-4", scheme.from.replace("from-", "text-"))} />
              <span className="font-light text-sm text-neutral-900">Color Schemes</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsColorOpen(false)}
              className="h-6 w-6 p-0 hover:bg-neutral-100 rounded-full"
            >
              <X className="size-3" />
            </Button>
          </div>

          <div className="space-y-2">
            {Object.entries(colorSchemes).map(([key, schemeOption]) => {
              const isActive = schemeName === key
              return (
                <button
                  key={key}
                  onClick={() => setScheme(key)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group border",
                    isActive
                      ? `bg-gradient-to-r ${schemeOption.from} ${schemeOption.to} text-white border-transparent shadow-md`
                      : "bg-neutral-50 hover:bg-neutral-100 text-neutral-900 border-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 rounded-lg bg-gradient-to-br shadow-sm",
                      `${schemeOption.from} ${schemeOption.to}`
                    )}
                  />
                  <span className={cn("text-xs font-light", isActive ? "text-white" : "text-neutral-700")}>
                    {schemeOption.name}
                  </span>
                  {isActive && <Check className="size-4 ml-auto" />}
                </button>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100">
            <p className="text-xs font-light text-neutral-500 text-center">Developer Mode</p>
          </div>
        </div>
      )}

      {/* Variation Panel - Only shown when route has variations */}
      {isVariationOpen && hasVariations && routeVariations && (
        <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-200 p-5 w-72">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Layers className={cn("size-4", scheme.from.replace("from-", "text-"))} />
              <span className="font-light text-sm text-neutral-900">Page Variations</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsVariationOpen(false)}
              className="h-6 w-6 p-0 hover:bg-neutral-100 rounded-full"
            >
              <X className="size-3" />
            </Button>
          </div>

          <div className="space-y-2">
            {routeVariations.variations.map((variation) => {
              const isActive = currentVariationId === variation.id
              return (
                <button
                  key={variation.id}
                  onClick={() => setVariation(pathname, variation.id)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left border",
                    isActive
                      ? `bg-gradient-to-r ${scheme.from} ${scheme.to} text-white border-transparent shadow-md`
                      : "bg-neutral-50 hover:bg-neutral-100 text-neutral-900 border-transparent"
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <span className={cn("text-sm font-light block", isActive ? "text-white" : "text-neutral-900")}>
                      {variation.name}
                    </span>
                    {variation.description && (
                      <span className={cn("text-xs font-light block mt-0.5", isActive ? "text-white/80" : "text-neutral-500")}>
                        {variation.description}
                      </span>
                    )}
                  </div>
                  {isActive && <Check className="size-4 shrink-0 mt-0.5" />}
                </button>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100">
            <p className="text-xs font-light text-neutral-500 text-center">
              Session-persisted selection
            </p>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        {/* Variations Button - Only shown when route has variations */}
        {hasVariations && (
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => {
                setIsVariationOpen(!isVariationOpen)
                setIsColorOpen(false)
              }}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg border transition-all",
                isVariationOpen
                  ? `bg-gradient-to-r ${scheme.from} ${scheme.to} text-white border-transparent`
                  : isViewingNonDefault
                    ? `bg-gradient-to-r ${scheme.from} ${scheme.to} text-white border-transparent`
                    : "bg-white/95 backdrop-blur-xl border-neutral-200 hover:bg-neutral-50"
              )}
            >
              <Layers className={cn("size-4", isVariationOpen || isViewingNonDefault ? "text-white" : scheme.from.replace("from-", "text-"))} />
              <span className={cn("text-xs font-light", isVariationOpen || isViewingNonDefault ? "text-white" : "text-neutral-700")}>
                {isViewingNonDefault && currentVariation ? currentVariation.name : "Variations"}
              </span>
            </button>
            {/* Revert to default button - shown when viewing non-default variant */}
            {isViewingNonDefault && (
              <button
                onClick={handleRevertToDefault}
                className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 backdrop-blur-xl border border-neutral-200 hover:bg-neutral-50 transition-all shadow-sm"
              >
                <RotateCcw className="size-3 text-neutral-500" />
                <span className="text-[11px] font-light text-neutral-600">
                  Revert to default
                </span>
              </button>
            )}
          </div>
        )}

        {/* Colors Button */}
        <button
          onClick={() => {
            setIsColorOpen(!isColorOpen)
            setIsVariationOpen(false)
          }}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-xl shadow-lg border transition-all",
            isColorOpen
              ? `bg-gradient-to-r ${scheme.from} ${scheme.to} text-white border-transparent`
              : "bg-white/95 backdrop-blur-xl border-neutral-200 hover:bg-neutral-50"
          )}
        >
          <Palette className={cn("size-4", isColorOpen ? "text-white" : scheme.from.replace("from-", "text-"))} />
          <span className={cn("text-xs font-light", isColorOpen ? "text-white" : "text-neutral-700")}>
            Colors
          </span>
        </button>
      </div>
    </div>
  )
}

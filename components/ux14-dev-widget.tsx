"use client"

import { useState } from "react"
import { Palette, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { colorSchemes, useColorScheme } from "@/components/ux14-color-context"
import { cn } from "@/lib/utils"

export function UX14DevWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const { schemeName, setScheme } = useColorScheme()

  return (
    <div className="fixed bottom-20 right-6 z-40">
      {isOpen ? (
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-emerald-100/50 p-6 w-80">
          <div className="flex items-center justify-between mb-5 pb-4 border-b border-emerald-100/50">
            <div className="flex items-center gap-2">
              <Palette className="size-5 text-emerald-600/70" />
              <span className="font-light text-neutral-900">Nature Themes</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-emerald-100/50 rounded-full"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {Object.entries(colorSchemes).map(([key, scheme]) => {
              const isActive = schemeName === key
              return (
                <button
                  key={key}
                  onClick={() => setScheme(key)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-2xl transition-all text-left",
                    isActive
                      ? cn("bg-gradient-to-r text-white shadow-lg", scheme.from, scheme.to)
                      : "bg-emerald-50/30 hover:bg-emerald-50/50 text-neutral-900 border border-emerald-100/40"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl shadow-sm",
                      isActive
                        ? "bg-white/20"
                        : cn("bg-gradient-to-br", scheme.from, scheme.to)
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-light text-sm", isActive ? "text-white" : "text-neutral-900")}>
                      {scheme.name}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-5 pt-4 border-t border-emerald-100/50">
            <p className="text-xs font-extralight text-neutral-500 text-center">
              Developer Theme Picker
            </p>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg bg-white/90 backdrop-blur-xl border border-emerald-100/50 hover:shadow-xl transition-all hover:scale-105 group"
        >
          <Palette className="size-4 text-emerald-600/70 group-hover:text-emerald-600" />
          <span className="text-xs font-light text-neutral-700">Themes</span>
        </button>
      )}
    </div>
  )
}

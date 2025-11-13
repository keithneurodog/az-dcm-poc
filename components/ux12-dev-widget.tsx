"use client"

import { useState } from "react"
import { Palette, X, Layout } from "lucide-react"
import { useColorScheme, colorSchemes } from "./ux12-color-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

export function UX12DevWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const { schemeName, setScheme } = useColorScheme()

  return (
    <div className="fixed bottom-20 right-6 z-40 flex flex-col gap-3">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-5 w-72">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <Palette className="size-4 text-neutral-600" />
              <span className="font-light text-sm text-neutral-900">Color Schemes</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0 hover:bg-neutral-100 rounded-full"
            >
              <X className="size-3" />
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
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group border",
                    isActive
                      ? `bg-gradient-to-r ${scheme.from} ${scheme.to} text-white border-transparent shadow-md`
                      : "bg-neutral-50 hover:bg-neutral-100 text-neutral-900 border-transparent"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-8 shrink-0 rounded-lg bg-gradient-to-br shadow-sm",
                      `${scheme.from} ${scheme.to}`
                    )}
                  />
                  <span className={cn("text-xs font-light", isActive ? "text-white" : "text-neutral-700")}>
                    {scheme.name}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-100">
            <p className="text-xs font-light text-neutral-500 text-center">Developer Mode</p>
          </div>
        </div>
      ) : null}

      {/* Buttons */}
      <div className="flex flex-col gap-2">
        <Link
          href="/ux/13/design-system"
          className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-all"
        >
          <Layout className="size-4 text-neutral-600" />
          <span className="text-xs font-light text-neutral-700">Design System</span>
        </Link>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border border-neutral-200 bg-white hover:bg-neutral-50 transition-all"
        >
          <Palette className="size-4 text-neutral-600" />
          <span className="text-xs font-light text-neutral-700">Colors</span>
        </button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { ChevronUp, ChevronDown, Palette, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const iterations = [
  { id: 1, name: "Professional Portal", color: "from-blue-500 to-purple-500" },
  { id: 2, name: "Bold & Geometric", color: "from-red-900 to-amber-600" },
  { id: 3, name: "Data-Focused", color: "from-red-900 to-amber-600" },
  { id: 4, name: "AI-Enhanced", color: "from-blue-500 to-purple-500" },
  { id: 5, name: "Friendly Teal", color: "from-teal-500 to-orange-500" },
  { id: 6, name: "Glassmorphism", color: "from-purple-500 to-violet-500" },
  { id: 7, name: "Dark Cyber", color: "from-emerald-500 to-cyan-500" },
  { id: 8, name: "Minimal Zen", color: "from-rose-500 to-orange-400" },
  { id: 9, name: "Vibrant Energy", color: "from-purple-500 via-pink-500 to-yellow-500" },
  { id: 10, name: "Executive Suite", color: "from-amber-500 to-orange-600" },
  { id: 11, name: "Premium Vibrant", color: "from-blue-500 via-purple-500 to-pink-500" },
  { id: 12, name: "Zen Explorer", color: "from-rose-500 to-orange-400" },
  { id: 13, name: "Zen Dual Nav", color: "from-rose-500 to-orange-400" },
]

export function IterationSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  // Extract current iteration from pathname
  const currentIteration = pathname.match(/\/ux\/(\d+)/)?.[1]
  const currentPage = pathname.split("/").pop() || "home"

  const handleIterationChange = (id: number) => {
    router.push(`/ux/${id}/${currentPage}`)
  }

  const getCurrentIterationData = () => {
    if (!currentIteration) return null
    return iterations.find(it => it.id === parseInt(currentIteration))
  }

  const current = getCurrentIterationData()

  // Don't show on homepage
  if (!currentIteration) return null

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 p-4 w-80 max-h-[500px] flex flex-col">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <Palette className="size-5 text-purple-600" />
              <span className="font-bold text-neutral-900">UX Iterations</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 hover:bg-neutral-100"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="overflow-y-auto space-y-2 pr-2">
            {iterations.map((iteration) => {
              const isActive = currentIteration === iteration.id.toString()
              return (
                <button
                  key={iteration.id}
                  onClick={() => handleIterationChange(iteration.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left group",
                    isActive
                      ? "bg-gradient-to-r " + iteration.color + " text-white shadow-lg scale-105"
                      : "bg-neutral-50 hover:bg-neutral-100 text-neutral-900"
                  )}
                >
                  <div
                    className={cn(
                      "flex size-10 shrink-0 items-center justify-center rounded-lg font-bold text-lg shadow-md",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-gradient-to-br " + iteration.color + " text-white"
                    )}
                  >
                    {iteration.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("font-semibold text-sm", isActive ? "text-white" : "text-neutral-900")}>
                      {iteration.name}
                    </p>
                  </div>
                </button>
              )
            })}
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-200">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full border-2 border-neutral-200 hover:bg-neutral-50 font-semibold"
            >
              Back to Overview
            </Button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg border border-white/20 transition-all hover:scale-105 group bg-gradient-to-r",
            current?.color || "from-purple-500 to-pink-500"
          )}
        >
          <div className="flex size-7 items-center justify-center rounded bg-white/20 text-white font-bold text-sm">
            {currentIteration}
          </div>
          <ChevronUp className="size-3.5 text-white" />
        </button>
      )}
    </div>
  )
}

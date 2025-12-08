"use client"

import { useMemo } from "react"
import { motion } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Lightbulb, Plus, CheckCircle2, Clock, Zap } from "lucide-react"

export function SimilarDatasets() {
  const { activeMatchingResult, addDataset, selectedDatasets } = useRequestFlow()

  // Collect all unique similar dataset suggestions
  const suggestions = useMemo(() => {
    if (!activeMatchingResult) return []

    const allResults = [
      ...activeMatchingResult.immediate,
      ...activeMatchingResult.soon,
      ...activeMatchingResult.extended,
      ...activeMatchingResult.conflicts,
    ]

    const selectedIds = new Set(selectedDatasets.map(d => d.id))
    const suggestionMap = new Map<string, {
      dataset: typeof allResults[0]["similarDatasets"][0]["dataset"]
      similarTo: string[]
      accessCategory: typeof allResults[0]["similarDatasets"][0]["accessCategory"]
      estimatedWeeks: number
      similarityScore: number
      reason: string
    }>()

    for (const result of allResults) {
      for (const similar of result.similarDatasets) {
        // Skip if already selected
        if (selectedIds.has(similar.dataset.id)) continue

        const existing = suggestionMap.get(similar.dataset.id)
        if (existing) {
          existing.similarTo.push(result.dataset.code)
          existing.similarityScore = Math.max(existing.similarityScore, similar.similarityScore)
        } else {
          suggestionMap.set(similar.dataset.id, {
            dataset: similar.dataset,
            similarTo: [result.dataset.code],
            accessCategory: similar.accessCategory,
            estimatedWeeks: similar.estimatedWeeks,
            similarityScore: similar.similarityScore,
            reason: similar.reason,
          })
        }
      }
    }

    return Array.from(suggestionMap.values())
      .sort((a, b) => {
        // Prioritize immediate access, then similarity score
        const accessScore = (cat: string) =>
          cat === "immediate" ? 100 : cat === "soon" ? 50 : 0
        return (
          accessScore(b.accessCategory) + b.similarityScore -
          (accessScore(a.accessCategory) + a.similarityScore)
        )
      })
      .slice(0, 3) // Show top 3
  }, [activeMatchingResult, selectedDatasets])

  if (suggestions.length === 0) return null

  const categoryConfig = {
    immediate: {
      icon: CheckCircle2,
      label: "Ready NOW",
      badgeClass: "bg-emerald-100 text-emerald-700",
    },
    soon: {
      icon: Clock,
      label: "~2 weeks",
      badgeClass: "bg-blue-100 text-blue-700",
    },
    extended: {
      icon: Clock,
      label: "~6+ weeks",
      badgeClass: "bg-amber-100 text-amber-700",
    },
    conflict: {
      icon: Clock,
      label: "Complex",
      badgeClass: "bg-red-100 text-red-700",
    },
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-blue-50 to-violet-50 rounded-2xl border border-blue-200 p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100">
          <Lightbulb className="size-4 text-blue-600" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-neutral-900">Similar datasets you might like</h3>
          <p className="text-xs text-neutral-500 font-light">Based on your current selection</p>
        </div>
      </div>

      <div className="space-y-2">
        {suggestions.map((suggestion, index) => {
          const config = categoryConfig[suggestion.accessCategory]
          const Icon = config.icon

          return (
            <motion.div
              key={suggestion.dataset.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3 p-3 rounded-xl bg-white border border-neutral-200"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-neutral-500">{suggestion.dataset.code}</span>
                  <Badge className={cn("text-[10px] font-light", config.badgeClass)}>
                    <Icon className="size-2.5 mr-0.5" />
                    {config.label}
                  </Badge>
                  <span className="text-[10px] text-neutral-400">{suggestion.similarityScore}% match</span>
                </div>
                <p className="text-sm font-light text-neutral-700 truncate">{suggestion.dataset.name}</p>
                <p className="text-xs text-neutral-500 font-light mt-0.5">
                  Similar to {suggestion.similarTo.join(", ")}
                </p>
              </div>

              <Button
                size="sm"
                onClick={() => addDataset(suggestion.dataset)}
                className="h-8 px-3 text-xs font-light bg-blue-500 hover:bg-blue-600 text-white shrink-0"
              >
                <Plus className="size-3 mr-1" />
                Add
              </Button>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

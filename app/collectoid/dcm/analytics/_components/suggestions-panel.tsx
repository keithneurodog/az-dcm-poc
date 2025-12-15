"use client"

import { useRouter } from "next/navigation"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import { Lightbulb, ArrowRight, Users, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CollectionSuggestion } from "@/lib/analytics-helpers"

interface SuggestionsPanelProps {
  suggestions: CollectionSuggestion[]
}

export function SuggestionsPanel({ suggestions }: SuggestionsPanelProps) {
  const router = useRouter()
  const { scheme } = useColorScheme()

  const handleCreateClick = (suggestion: CollectionSuggestion) => {
    const params = new URLSearchParams()

    if (suggestion.filters.therapeuticAreas?.length) {
      params.set("ta", suggestion.filters.therapeuticAreas.join(","))
    }
    if (suggestion.filters.dataTypes?.length) {
      params.set("type", suggestion.filters.dataTypes.join(","))
    }
    if (suggestion.filters.intents?.length) {
      params.set("intent", suggestion.filters.intents.join(","))
    }

    // Add source param so create page knows this came from analytics
    params.set("source", "analytics")

    router.push(`/collectoid/dcm/create?${params.toString()}`)
  }

  if (suggestions.length === 0) {
    return (
      <div className="rounded-2xl border border-neutral-100 bg-white p-6 h-full">
        <div className="flex items-center gap-2 mb-4">
          <div className={cn("p-2 rounded-xl bg-gradient-to-br", scheme.from, scheme.to)}>
            <Lightbulb className="size-4 text-white" />
          </div>
          <h3 className="text-sm font-light text-neutral-900">Recommended Collections</h3>
        </div>
        <p className="text-sm font-light text-neutral-400">
          No collection suggestions available. All demand appears to be well covered.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white p-6 h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className={cn("p-2 rounded-xl bg-gradient-to-br", scheme.from, scheme.to)}>
          <Lightbulb className="size-4 text-white" />
        </div>
        <h3 className="text-sm font-light text-neutral-900">Recommended Collections</h3>
      </div>

      <div className="space-y-3">
        {suggestions.map((suggestion) => (
          <div
            key={suggestion.id}
            className="group rounded-xl border border-neutral-100 p-4 hover:border-neutral-200 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h4 className="text-sm font-normal text-neutral-900 leading-tight">
                {suggestion.title}
              </h4>
              <div
                className={cn(
                  "shrink-0 px-2 py-0.5 rounded-full text-[10px] font-light",
                  suggestion.gapScore >= 40
                    ? "bg-red-100 text-red-700"
                    : suggestion.gapScore >= 25
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                )}
              >
                Gap {suggestion.gapScore}%
              </div>
            </div>

            <p className="text-xs font-light text-neutral-500 mb-3 line-clamp-2">
              {suggestion.description}
            </p>

            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1 text-xs font-light text-neutral-400">
                <Users className="size-3" />
                <span>{suggestion.projectedUsers} users</span>
              </div>
              <div className="flex items-center gap-1 text-xs font-light text-neutral-400">
                <TrendingUp className="size-3" />
                <span>{suggestion.topDatasets.length} datasets</span>
              </div>
            </div>

            {/* Top datasets preview */}
            <div className="flex flex-wrap gap-1 mb-3">
              {suggestion.topDatasets.slice(0, 3).map((code) => (
                <span
                  key={code}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500 font-light"
                >
                  {code}
                </span>
              ))}
              {suggestion.topDatasets.length > 3 && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-400 font-light">
                  +{suggestion.topDatasets.length - 3} more
                </span>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCreateClick(suggestion)}
              className={cn(
                "w-full h-8 text-xs font-light rounded-lg",
                "bg-neutral-50 hover:bg-neutral-100 text-neutral-600",
                "group-hover:bg-gradient-to-r group-hover:text-white",
                scheme.from,
                scheme.to
              )}
            >
              Create Collection
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

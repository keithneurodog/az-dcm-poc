"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import {
  BarChart3,
  Calendar,
  Grid3X3,
  Circle,
  LayoutGrid,
  PieChart,
  ChevronDown,
  ChevronUp,
  Lightbulb,
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"

import { MetricsSummary } from "./_components/metrics-summary"
import { DemandHeatmap, HeatmapStyle } from "./_components/demand-heatmap"
import { SuggestionsPanel } from "./_components/suggestions-panel"
import { TopDatasetsTable } from "./_components/top-datasets-table"
import { AccessFulfillment } from "./_components/access-fulfillment"

import {
  calculateDemandMetrics,
  calculateAggregateStats,
  generateCollectionSuggestions,
  getTopRequestedDatasets,
  HeatmapDimension,
} from "@/lib/analytics-helpers"

type TimePeriod = "30d" | "60d" | "90d"

const HEATMAP_STYLES: { id: HeatmapStyle; label: string; icon: typeof Grid3X3 }[] = [
  { id: "grid", label: "Grid", icon: Grid3X3 },
  { id: "bubble", label: "Bubble", icon: Circle },
  { id: "treemap", label: "Treemap", icon: LayoutGrid },
  { id: "radial", label: "Radial", icon: PieChart },
]

export default function AnalyticsPage() {
  const { scheme } = useColorScheme()
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("30d")
  const [heatmapStyle, setHeatmapStyle] = useState<HeatmapStyle>("grid")
  const [rowDimension, setRowDimension] = useState<HeatmapDimension>("dataType")
  const [colDimension, setColDimension] = useState<HeatmapDimension>("therapeuticArea")
  const [showRecommendations, setShowRecommendations] = useState(false)

  // Calculate all metrics
  const metrics = useMemo(() => calculateDemandMetrics(), [])
  const stats = useMemo(() => calculateAggregateStats(metrics), [metrics])
  const suggestions = useMemo(() => generateCollectionSuggestions(metrics, 4), [metrics])
  const topDatasets = useMemo(() => getTopRequestedDatasets(metrics, 10), [metrics])

  return (
    <div className="space-y-4 -mx-6 xl:-mx-12 -my-6 xl:-my-8">
      {/* Header - Compact */}
      <div className="bg-white border-b border-neutral-100 sticky top-0 z-10">
        <div className="max-w-[1800px] mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-xl bg-gradient-to-br",
                scheme.from,
                scheme.to
              )}>
                <BarChart3 className="size-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-light text-neutral-900">
                  Data Demand Analytics
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Period */}
              <Select
                value={timePeriod}
                onValueChange={(v) => setTimePeriod(v as TimePeriod)}
              >
                <SelectTrigger className="w-[140px] h-8 text-xs font-light rounded-lg border-neutral-200">
                  <Calendar className="size-3 mr-1.5 text-neutral-400" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="60d">Last 60 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[1800px] mx-auto px-6 pb-6 space-y-4">
          {/* Summary Metrics - Compact */}
          <MetricsSummary
            totalRequests={stats.totalRequests}
            totalPending={stats.totalPending}
            hotDatasets={stats.hotDatasets}
            trendingUp={stats.trendingUp}
            trendingDown={stats.trendingDown}
          />

          {/* Heatmap Controls */}
          <div className="flex items-center justify-between gap-4 p-3 bg-white rounded-xl border border-neutral-100">
            {/* Style Selector */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-lg">
              {HEATMAP_STYLES.map((style) => {
                const Icon = style.icon
                const isActive = heatmapStyle === style.id
                return (
                  <button
                    key={style.id}
                    onClick={() => setHeatmapStyle(style.id)}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-light transition-all",
                      isActive
                        ? cn("bg-white shadow-sm text-neutral-900")
                        : "text-neutral-500 hover:text-neutral-700"
                    )}
                  >
                    <Icon className="size-3.5" />
                    {style.label}
                  </button>
                )
              })}
            </div>

            {/* Dimension Selectors */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-light text-neutral-400">Rows:</span>
                <Select
                  value={rowDimension}
                  onValueChange={(v) => setRowDimension(v as HeatmapDimension)}
                >
                  <SelectTrigger className="w-[140px] h-8 text-xs font-light rounded-lg border-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dataType">Data Type</SelectItem>
                    <SelectItem value="therapeuticArea">Therapeutic Area</SelectItem>
                    <SelectItem value="intent">Use Intent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <span className="text-neutral-300">×</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-light text-neutral-400">Columns:</span>
                <Select
                  value={colDimension}
                  onValueChange={(v) => setColDimension(v as HeatmapDimension)}
                >
                  <SelectTrigger className="w-[140px] h-8 text-xs font-light rounded-lg border-neutral-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="therapeuticArea">Therapeutic Area</SelectItem>
                    <SelectItem value="dataType">Data Type</SelectItem>
                    <SelectItem value="intent">Use Intent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Full-Width Heatmap */}
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 min-h-[400px]">
            <DemandHeatmap
              metrics={metrics}
              rowDimension={rowDimension}
              colDimension={colDimension}
              style={heatmapStyle}
            />
          </div>

          {/* Collapsible Recommendations Section */}
          <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
            <button
              onClick={() => setShowRecommendations(!showRecommendations)}
              className="w-full px-5 py-3 flex items-center justify-between hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className={cn("p-1.5 rounded-lg bg-gradient-to-br", scheme.from, scheme.to)}>
                  <Lightbulb className="size-3.5 text-white" />
                </div>
                <span className="text-sm font-light text-neutral-900">
                  Recommended Collections
                </span>
                {suggestions.length > 0 && (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-light",
                    "bg-amber-100 text-amber-700"
                  )}>
                    {suggestions.length} suggestions
                  </span>
                )}
              </div>
              <motion.div
                animate={{ rotate: showRecommendations ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="size-4 text-neutral-400" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showRecommendations && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-neutral-100 pt-4">
                    <div className="grid grid-cols-4 gap-4">
                      {suggestions.map((suggestion) => (
                        <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Access Fulfillment */}
          <AccessFulfillment />

          {/* Top Datasets Table */}
          <TopDatasetsTable datasets={topDatasets} />
        </div>
    </div>
  )
}

// Inline suggestion card for the collapsible section
function SuggestionCard({ suggestion }: { suggestion: ReturnType<typeof generateCollectionSuggestions>[0] }) {
  const { scheme } = useColorScheme()
  const router = useRouter()

  const handleClick = () => {
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
    params.set("source", "analytics")
    router.push(`/collectoid/dcm/create?${params.toString()}`)
  }

  return (
    <motion.button
      onClick={handleClick}
      className="text-left p-4 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:shadow-sm transition-all group"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm font-normal text-neutral-900 leading-tight">
          {suggestion.title}
        </h4>
        <span
          className={cn(
            "shrink-0 px-2 py-0.5 rounded-full text-[10px] font-light",
            suggestion.gapScore >= 40
              ? "bg-red-100 text-red-700"
              : suggestion.gapScore >= 25
              ? "bg-amber-100 text-amber-700"
              : "bg-emerald-100 text-emerald-700"
          )}
        >
          {suggestion.gapScore}%
        </span>
      </div>
      <p className="text-xs font-light text-neutral-500 mb-3 line-clamp-2">
        {suggestion.description}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-light text-neutral-400">
          {suggestion.projectedUsers} users · {suggestion.topDatasets.length} datasets
        </span>
        <span className={cn(
          "text-xs font-light opacity-0 group-hover:opacity-100 transition-opacity",
          scheme.from.replace("from-", "text-")
        )}>
          Create →
        </span>
      </div>
    </motion.button>
  )
}

"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { DatasetRow } from "./dataset-row"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Zap,
} from "lucide-react"

interface DatasetGroupProps {
  title: string
  count: number
  category: "immediate" | "soon" | "extended" | "conflict" | "removed"
  children: React.ReactNode
  defaultExpanded?: boolean
  badge?: string
}

function DatasetGroup({ title, count, category, children, defaultExpanded = true, badge }: DatasetGroupProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const categoryConfig = {
    immediate: {
      icon: CheckCircle2,
      bgClass: "bg-emerald-50",
      borderClass: "border-emerald-200",
      textClass: "text-emerald-700",
      iconClass: "text-emerald-600",
    },
    soon: {
      icon: Clock,
      bgClass: "bg-blue-50",
      borderClass: "border-blue-200",
      textClass: "text-blue-700",
      iconClass: "text-blue-600",
    },
    extended: {
      icon: Clock,
      bgClass: "bg-amber-50",
      borderClass: "border-amber-200",
      textClass: "text-amber-700",
      iconClass: "text-amber-600",
    },
    conflict: {
      icon: AlertTriangle,
      bgClass: "bg-red-50",
      borderClass: "border-red-200",
      textClass: "text-red-700",
      iconClass: "text-red-600",
    },
    removed: {
      icon: null,
      bgClass: "bg-neutral-50",
      borderClass: "border-neutral-200",
      textClass: "text-neutral-500",
      iconClass: "text-neutral-400",
    },
  }

  const config = categoryConfig[category]
  const Icon = config.icon

  if (count === 0) return null

  return (
    <div className="space-y-2">
      {/* Group Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "w-full flex items-center gap-2 px-3 py-2 rounded-xl transition-colors",
          config.bgClass,
          "hover:opacity-90"
        )}
      >
        {Icon && <Icon className={cn("size-4", config.iconClass)} />}
        <span className={cn("text-sm font-medium", config.textClass)}>{title}</span>
        <span className={cn("text-sm font-light", config.textClass)}>({count})</span>
        {badge && (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/60 text-amber-700 ml-1">
            {badge}
          </span>
        )}
        <ChevronDown
          className={cn(
            "size-4 ml-auto transition-transform",
            config.iconClass,
            !isExpanded && "-rotate-90"
          )}
        />
      </button>

      {/* Group Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 pl-2">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function DatasetList() {
  const { activeMatchingResult, removedDatasetIds, selectedDatasets, matchingResult } = useRequestFlow()

  if (!activeMatchingResult) {
    return (
      <div className="bg-white rounded-2xl border border-neutral-200 p-8 text-center">
        <div className="text-neutral-400 text-sm font-light">No datasets to display</div>
      </div>
    )
  }

  const { immediate, soon, extended, conflicts } = activeMatchingResult

  // Get removed datasets from original matching result
  const removedResults = matchingResult
    ? [
        ...matchingResult.immediate,
        ...matchingResult.soon,
        ...matchingResult.extended,
        ...matchingResult.conflicts,
      ].filter(r => removedDatasetIds.has(r.datasetId))
    : []

  const totalActive = immediate.length + soon.length + extended.length + conflicts.length

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-900">
          Datasets ({totalActive})
        </h3>
        {removedResults.length > 0 && (
          <span className="text-xs text-neutral-400">
            {removedResults.length} removed
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Immediate - Ready NOW */}
        <DatasetGroup
          title="Ready NOW"
          count={immediate.length}
          category="immediate"
          defaultExpanded={true}
        >
          {immediate.map(result => (
            <DatasetRow key={result.datasetId} result={result} />
          ))}
        </DatasetGroup>

        {/* Soon - ~2 weeks */}
        <DatasetGroup
          title="~2 weeks"
          count={soon.length}
          category="soon"
          defaultExpanded={true}
        >
          {soon.map(result => (
            <DatasetRow key={result.datasetId} result={result} />
          ))}
        </DatasetGroup>

        {/* Extended - ~6+ weeks */}
        <DatasetGroup
          title="~6+ weeks"
          count={extended.length}
          category="extended"
          defaultExpanded={true}
          badge="Adding complexity"
        >
          {extended.map(result => (
            <DatasetRow key={result.datasetId} result={result} />
          ))}
        </DatasetGroup>

        {/* Conflicts */}
        <DatasetGroup
          title="Conflicts"
          count={conflicts.length}
          category="conflict"
          defaultExpanded={true}
        >
          {conflicts.map(result => (
            <DatasetRow key={result.datasetId} result={result} />
          ))}
        </DatasetGroup>

        {/* Removed */}
        {removedResults.length > 0 && (
          <DatasetGroup
            title="Removed"
            count={removedResults.length}
            category="removed"
            defaultExpanded={false}
          >
            {removedResults.map(result => (
              <DatasetRow key={result.datasetId} result={result} isRemoved />
            ))}
          </DatasetGroup>
        )}
      </div>
    </div>
  )
}

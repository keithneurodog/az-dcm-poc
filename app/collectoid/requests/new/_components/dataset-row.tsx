"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { DatasetMatchResult, SimilarDataset } from "@/lib/dcm-mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  X,
  RefreshCw,
  Clock,
  AlertTriangle,
  Lightbulb,
  Zap,
  CheckCircle2,
  ArrowRight,
  Undo2,
} from "lucide-react"

interface DatasetRowProps {
  result: DatasetMatchResult
  isRemoved?: boolean
}

export function DatasetRow({ result, isRemoved = false }: DatasetRowProps) {
  const { removeDataset, restoreDataset, swapDataset } = useRequestFlow()
  const [isExpanded, setIsExpanded] = useState(false)

  const { dataset, accessCategory, estimatedWeeks, categoryReason, intentConflicts, similarDatasets } = result

  const categoryConfig = {
    immediate: {
      color: "emerald",
      icon: CheckCircle2,
      label: "Ready",
      bgClass: "bg-emerald-50",
      borderClass: "border-emerald-200",
      textClass: "text-emerald-700",
      badgeClass: "bg-emerald-100 text-emerald-700",
    },
    soon: {
      color: "blue",
      icon: Clock,
      label: `~${estimatedWeeks}wk`,
      bgClass: "bg-blue-50",
      borderClass: "border-blue-200",
      textClass: "text-blue-700",
      badgeClass: "bg-blue-100 text-blue-700",
    },
    extended: {
      color: "amber",
      icon: Clock,
      label: `~${estimatedWeeks}wk`,
      bgClass: "bg-amber-50",
      borderClass: "border-amber-200",
      textClass: "text-amber-700",
      badgeClass: "bg-amber-100 text-amber-700",
    },
    conflict: {
      color: "red",
      icon: AlertTriangle,
      label: "Conflict",
      bgClass: "bg-red-50",
      borderClass: "border-red-200",
      textClass: "text-red-700",
      badgeClass: "bg-red-100 text-red-700",
    },
  }

  const config = categoryConfig[accessCategory]
  const Icon = config.icon

  const handleSwap = (similar: SimilarDataset) => {
    swapDataset(dataset.id, similar.dataset)
  }

  if (isRemoved) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 0.6, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-neutral-50 border border-dashed border-neutral-200"
      >
        <Checkbox checked={false} disabled className="opacity-50" />
        <span className="text-sm font-mono text-neutral-400">{dataset.code}</span>
        <span className="text-sm font-light text-neutral-400 line-through">{dataset.name}</span>
        <Badge className="ml-auto text-xs font-light bg-neutral-100 text-neutral-500">Removed</Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => restoreDataset(dataset.id)}
          className="h-7 px-2 text-xs font-light text-neutral-500 hover:text-neutral-700"
        >
          <Undo2 className="size-3 mr-1" />
          Restore
        </Button>
      </motion.div>
    )
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className={cn(
        "rounded-xl border transition-all",
        isExpanded ? config.bgClass : "bg-white",
        isExpanded ? config.borderClass : "border-neutral-200"
      )}
    >
      {/* Main Row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Checkbox checked={true} className="pointer-events-none" />

        <span className="text-sm font-mono text-neutral-500 shrink-0 w-24">{dataset.code}</span>

        <span className="text-sm font-light text-neutral-700 truncate flex-1">{dataset.name}</span>

        <Badge className={cn("text-xs font-light shrink-0", config.badgeClass)}>
          <Icon className="size-3 mr-1" />
          {config.label}
        </Badge>

        <div className="flex items-center gap-1">
          {similarDatasets.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2 text-xs font-light text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(true)
              }}
            >
              <RefreshCw className="size-3 mr-1" />
              Swap
            </Button>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs font-light text-neutral-500 hover:text-red-600 hover:bg-red-50"
            onClick={(e) => {
              e.stopPropagation()
              removeDataset(dataset.id)
            }}
          >
            <X className="size-3" />
          </Button>

          <ChevronDown
            className={cn(
              "size-4 text-neutral-400 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-3">
              {/* Category Reason */}
              <div className="flex items-start gap-2 text-sm">
                <Icon className={cn("size-4 mt-0.5 shrink-0", config.textClass)} />
                <span className={cn("font-light", config.textClass)}>{categoryReason}</span>
              </div>

              {/* Intent Conflicts */}
              {intentConflicts.length > 0 && (
                <div className="space-y-2">
                  {intentConflicts.map((conflict, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs bg-amber-50 rounded-lg p-2"
                    >
                      <AlertTriangle className="size-3.5 text-amber-600 mt-0.5 shrink-0" />
                      <div>
                        <span className="font-medium text-amber-800">{conflict.intentLabel}:</span>{" "}
                        <span className="text-amber-700 font-light">{conflict.datasetRestriction}</span>
                        <span className="text-amber-600 ml-2">(+{conflict.addedWeeks} weeks)</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Similar Datasets */}
              {similarDatasets.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Lightbulb className="size-3.5" />
                    <span className="font-medium">Similar datasets with better access:</span>
                  </div>

                  {similarDatasets.map((similar) => {
                    const similarConfig = categoryConfig[similar.accessCategory]
                    const SimilarIcon = similarConfig.icon

                    return (
                      <div
                        key={similar.dataset.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-white border border-neutral-200"
                      >
                        <span className="text-xs font-mono text-neutral-500">{similar.dataset.code}</span>
                        <span className="text-xs font-light text-neutral-600 truncate flex-1">
                          {similar.dataset.name}
                        </span>
                        <Badge className={cn("text-[10px] font-light shrink-0", similarConfig.badgeClass)}>
                          <SimilarIcon className="size-2.5 mr-0.5" />
                          {similar.estimatedWeeks === 0 ? "Ready" : `~${similar.estimatedWeeks}wk`}
                        </Badge>
                        <span className="text-[10px] text-neutral-400">{similar.similarityScore}% similar</span>
                        <Button
                          size="sm"
                          className="h-6 px-2 text-[10px] font-light bg-blue-500 hover:bg-blue-600 text-white"
                          onClick={() => handleSwap(similar)}
                        >
                          Use instead
                          <ArrowRight className="size-2.5 ml-1" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

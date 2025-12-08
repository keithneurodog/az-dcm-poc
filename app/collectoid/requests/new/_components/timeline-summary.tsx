"use client"

import { motion } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { cn } from "@/lib/utils"
import { Clock, Zap, CheckCircle2 } from "lucide-react"

export function TimelineSummary() {
  const { activeMatchingResult, activeDatasets } = useRequestFlow()

  if (!activeMatchingResult || activeDatasets.length === 0) {
    return null
  }

  const { summary } = activeMatchingResult
  const totalActive = summary.immediateCount + summary.soonCount + summary.extendedCount + summary.conflictCount

  // Calculate percentages for the timeline bar
  const immediatePercent = totalActive > 0 ? (summary.immediateCount / totalActive) * 100 : 0
  const soonPercent = totalActive > 0 ? (summary.soonCount / totalActive) * 100 : 0
  const extendedPercent = totalActive > 0 ? ((summary.extendedCount + summary.conflictCount) / totalActive) * 100 : 0

  // Determine max time
  const maxWeeks = summary.estimatedFullAccessWeeks

  // Calculate what you'd get if you removed extended/conflict datasets
  const quickAccessCount = summary.immediateCount + summary.soonCount
  const quickAccessWeeks = summary.soonCount > 0 ? 2 : 0

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-neutral-900">Access Timeline</h3>
        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
          <Clock className="size-3.5" />
          <span className="font-light">
            100% access in <span className="font-medium text-neutral-700">~{maxWeeks} weeks</span>
          </span>
        </div>
      </div>

      {/* Visual Timeline */}
      <div className="mb-6">
        {/* Timeline Bar */}
        <div className="relative h-3 bg-neutral-100 rounded-full overflow-hidden mb-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${immediatePercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="absolute left-0 top-0 h-full bg-emerald-500"
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${soonPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
            className="absolute top-0 h-full bg-blue-500"
            style={{ left: `${immediatePercent}%` }}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${extendedPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="absolute top-0 h-full bg-amber-500"
            style={{ left: `${immediatePercent + soonPercent}%` }}
          />
        </div>

        {/* Timeline Labels */}
        <div className="flex justify-between text-[10px] text-neutral-400 font-light">
          <span>Now</span>
          <span>2 weeks</span>
          <span>{maxWeeks > 6 ? "6+ weeks" : `${maxWeeks} weeks`}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-3">
        {/* Immediate */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl bg-emerald-100 mb-2">
            <motion.span
              key={summary.immediateCount}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-lg font-semibold text-emerald-700"
            >
              {summary.immediateCount}
            </motion.span>
          </div>
          <p className="text-[10px] text-neutral-500 font-light">Ready now</p>
        </motion.div>

        {/* Soon */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl bg-blue-100 mb-2">
            <motion.span
              key={summary.soonCount}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-lg font-semibold text-blue-700"
            >
              {summary.soonCount}
            </motion.span>
          </div>
          <p className="text-[10px] text-neutral-500 font-light">~2 weeks</p>
        </motion.div>

        {/* Extended */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl bg-amber-100 mb-2">
            <motion.span
              key={summary.extendedCount}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-lg font-semibold text-amber-700"
            >
              {summary.extendedCount}
            </motion.span>
          </div>
          <p className="text-[10px] text-neutral-500 font-light">~6+ weeks</p>
        </motion.div>

        {/* Conflicts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <div className={cn(
            "flex items-center justify-center w-10 h-10 mx-auto rounded-xl mb-2",
            summary.conflictCount > 0 ? "bg-red-100" : "bg-neutral-100"
          )}>
            <motion.span
              key={summary.conflictCount}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={cn(
                "text-lg font-semibold",
                summary.conflictCount > 0 ? "text-red-700" : "text-neutral-400"
              )}
            >
              {summary.conflictCount}
            </motion.span>
          </div>
          <p className="text-[10px] text-neutral-500 font-light">Conflicts</p>
        </motion.div>
      </div>

      {/* Quick Win Hint */}
      {summary.extendedCount > 0 && quickAccessCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-4 pt-4 border-t border-neutral-100"
        >
          <div className="flex items-center gap-2 text-xs">
            <Zap className="size-3.5 text-emerald-600" />
            <span className="text-neutral-600 font-light">
              Remove {summary.extendedCount + summary.conflictCount} complex dataset{summary.extendedCount + summary.conflictCount > 1 ? "s" : ""} →{" "}
              <span className="font-medium text-emerald-700">
                {quickAccessCount} datasets in {quickAccessWeeks === 0 ? "immediately" : `~${quickAccessWeeks} weeks`}
              </span>
            </span>
          </div>
        </motion.div>
      )}

      {/* All Immediate Message */}
      {summary.immediateCount === totalActive && totalActive > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 pt-4 border-t border-neutral-100"
        >
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="size-3.5 text-emerald-600" />
            <span className="text-emerald-700 font-medium">
              All {totalActive} datasets are ready for immediate access!
            </span>
          </div>
        </motion.div>
      )}
    </div>
  )
}

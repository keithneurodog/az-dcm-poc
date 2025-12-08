"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { AlertTriangle, X, Clock, Cpu, Code, Globe } from "lucide-react"

const iconMap = {
  aiResearch: Cpu,
  softwareDevelopment: Code,
  externalPublication: Globe,
}

export function IntentWarnings() {
  const { activeMatchingResult, intent, updateIntent, removeDataset } = useRequestFlow()

  if (!activeMatchingResult || activeMatchingResult.intentWarnings.length === 0) {
    return null
  }

  const handleRemoveIntent = (intentField: "aiResearch" | "softwareDevelopment" | "externalPublication") => {
    if (intentField === "aiResearch" || intentField === "softwareDevelopment") {
      updateIntent({
        ...intent,
        beyondPrimaryUse: {
          ...intent.beyondPrimaryUse,
          [intentField]: false,
        },
      })
    } else if (intentField === "externalPublication") {
      updateIntent({
        ...intent,
        publication: {
          ...intent.publication,
          externalPublication: false,
        },
      })
    }
  }

  const handleRemoveAffectedDatasets = (datasetIds: string[]) => {
    datasetIds.forEach(id => removeDataset(id))
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: "auto" }}
        exit={{ opacity: 0, height: 0 }}
        className="space-y-2"
      >
        {activeMatchingResult.intentWarnings.map((warning, index) => {
          const Icon = iconMap[warning.intentField]

          return (
            <motion.div
              key={warning.intentField}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-amber-50 border border-amber-200 rounded-xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-100 shrink-0">
                  <AlertTriangle className="size-4 text-amber-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="size-3.5 text-amber-700" />
                    <span className="text-sm font-medium text-amber-900">
                      {warning.intentLabel} adds complexity
                    </span>
                  </div>

                  <p className="text-sm text-amber-700 font-light mb-3">
                    {warning.message}
                  </p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveIntent(warning.intentField)}
                      className="h-7 text-xs font-light border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                      <X className="size-3 mr-1" />
                      Remove {warning.intentLabel}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveAffectedDatasets(warning.affectedDatasetIds)}
                      className="h-7 text-xs font-light border-amber-300 text-amber-700 hover:bg-amber-100"
                    >
                      Remove {warning.affectedDatasetCodes.length} dataset{warning.affectedDatasetCodes.length > 1 ? "s" : ""}
                    </Button>

                    <span className="text-xs text-amber-600 flex items-center gap-1 ml-auto">
                      <Clock className="size-3" />
                      +{warning.addedWeeks} weeks
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </AnimatePresence>
  )
}

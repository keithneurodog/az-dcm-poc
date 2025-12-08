"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { IntentPanel } from "./intent-panel"
import { IntentWarnings } from "./intent-warnings"
import { TimelineSummary } from "./timeline-summary"
import { DatasetList } from "./dataset-list"
import { SimilarDatasets } from "./similar-datasets"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Send,
  Loader2,
  Database,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { useState } from "react"

export function StepBuilder() {
  const {
    goBack,
    submitRequest,
    isSubmitting,
    activeMatchingResult,
    activeDatasets,
    isMatching,
  } = useRequestFlow()

  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const totalDatasets = activeDatasets.length
  const maxWeeks = activeMatchingResult?.summary.estimatedFullAccessWeeks || 0

  // Show loading state while matching
  if (isMatching) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto flex flex-col items-center justify-center py-20"
      >
        <div className="relative mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Database className="size-8 text-white" />
          </div>
          <motion.div
            className="absolute inset-0 rounded-2xl border-2 border-violet-400"
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </div>
        <h2 className="text-lg font-light text-neutral-700 mb-2">Analyzing your request...</h2>
        <p className="text-sm text-neutral-500 font-light">Matching datasets against your intent</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-4xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-light text-neutral-900 mb-1">
            Build Your Request
          </h1>
          <p className="text-sm text-neutral-500 font-light">
            Review and refine your data access request
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={goBack}
          className="text-neutral-500 hover:text-neutral-700"
        >
          <ArrowLeft className="size-4 mr-1" />
          Back
        </Button>
      </div>

      <div className="space-y-4">
        {/* Intent Panel */}
        <IntentPanel />

        {/* Intent Warnings */}
        <IntentWarnings />

        {/* Timeline Summary */}
        <TimelineSummary />

        {/* Dataset List */}
        <DatasetList />

        {/* Similar Datasets */}
        <SimilarDatasets />

        {/* Submit Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-neutral-200 p-5"
        >
          <div className="flex items-start gap-4">
            {/* Summary */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600">
                  <CheckCircle2 className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-900">Ready to submit</h3>
                  <p className="text-xs text-neutral-500 font-light">
                    {totalDatasets} dataset{totalDatasets !== 1 ? "s" : ""} •{" "}
                    {maxWeeks === 0 ? "Immediate access" : `~${maxWeeks} weeks to full access`}
                  </p>
                </div>
              </div>

              {/* Terms Agreement */}
              <label className="flex items-start gap-2 cursor-pointer p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors">
                <Checkbox
                  checked={agreedToTerms}
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                  className="mt-0.5"
                />
                <span className="text-xs text-neutral-600 font-light leading-relaxed">
                  I agree to use this data only for the declared purposes and in accordance with the
                  applicable Agreement of Terms. I understand that the DCM team will review my request
                  and provision access according to the estimated timeline.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              onClick={submitRequest}
              disabled={!agreedToTerms || totalDatasets === 0 || isSubmitting}
              className={cn(
                "h-12 px-6 rounded-xl font-light transition-all shrink-0",
                agreedToTerms && totalDatasets > 0
                  ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                  : "bg-neutral-100 text-neutral-400"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

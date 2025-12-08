"use client"

import { motion } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  Calendar,
  ExternalLink,
  Sparkles,
} from "lucide-react"

export function StepConfirmation() {
  const { submittedRequestId, activeMatchingResult, activeDatasets } = useRequestFlow()

  const summary = activeMatchingResult?.summary
  const maxWeeks = summary?.estimatedFullAccessWeeks || 0

  // Calculate expected date
  const expectedDate = new Date()
  expectedDate.setDate(expectedDate.getDate() + maxWeeks * 7)
  const formattedDate = expectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto text-center"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
        className="relative inline-flex mb-6"
      >
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg shadow-emerald-200">
          <CheckCircle2 className="size-10 text-white" />
        </div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center"
        >
          <Sparkles className="size-4 text-amber-500" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-light text-neutral-900 mb-2"
      >
        Request Submitted!
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-neutral-500 font-light mb-8"
      >
        Your data access request has been sent to the DCM team for processing
      </motion.p>

      {/* Request Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-2xl border border-neutral-200 p-6 mb-6 text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Database className="size-4 text-neutral-400" />
            <span className="text-sm font-medium text-neutral-700">Request Summary</span>
          </div>
          {submittedRequestId && (
            <Badge variant="outline" className="font-mono text-xs">
              {submittedRequestId}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-3 rounded-xl bg-neutral-50">
            <div className="text-2xl font-semibold text-neutral-900 mb-1">
              {activeDatasets.length}
            </div>
            <div className="text-xs text-neutral-500 font-light">Datasets requested</div>
          </div>
          <div className="p-3 rounded-xl bg-neutral-50">
            <div className="text-2xl font-semibold text-neutral-900 mb-1">
              {maxWeeks === 0 ? "Now" : `~${maxWeeks}wk`}
            </div>
            <div className="text-xs text-neutral-500 font-light">Estimated access</div>
          </div>
        </div>

        {/* Timeline Breakdown */}
        {summary && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-neutral-600 mb-2">Access Timeline</div>

            {summary.immediateCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-neutral-600 font-light">
                  <span className="font-medium text-emerald-700">{summary.immediateCount}</span> dataset{summary.immediateCount > 1 ? "s" : ""} ready immediately
                </span>
              </div>
            )}

            {summary.soonCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="text-neutral-600 font-light">
                  <span className="font-medium text-blue-700">{summary.soonCount}</span> dataset{summary.soonCount > 1 ? "s" : ""} in ~2 weeks
                </span>
              </div>
            )}

            {summary.extendedCount > 0 && (
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-neutral-600 font-light">
                  <span className="font-medium text-amber-700">{summary.extendedCount}</span> dataset{summary.extendedCount > 1 ? "s" : ""} in ~6+ weeks
                </span>
              </div>
            )}
          </div>
        )}

        {/* Expected Completion */}
        <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center gap-2">
          <Calendar className="size-4 text-neutral-400" />
          <span className="text-sm text-neutral-500 font-light">
            Expected full access by{" "}
            <span className="font-medium text-neutral-700">{formattedDate}</span>
          </span>
        </div>
      </motion.div>

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-200 p-6 mb-6 text-left"
      >
        <h3 className="text-sm font-medium text-neutral-900 mb-3">What happens next?</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-medium text-violet-700">1</span>
            </div>
            <p className="text-sm text-neutral-600 font-light">
              The DCM team will review your request and begin provisioning access
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-medium text-violet-700">2</span>
            </div>
            <p className="text-sm text-neutral-600 font-light">
              You'll receive email notifications as datasets become available
            </p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-xs font-medium text-violet-700">3</span>
            </div>
            <p className="text-sm text-neutral-600 font-light">
              Track your request progress in the "My Requests" dashboard
            </p>
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center justify-center gap-3"
      >
        <Button
          variant="outline"
          asChild
          className="rounded-xl font-light"
        >
          <Link href="/collectoid/discover/ai">
            <Database className="size-4 mr-2" />
            Browse More Datasets
          </Link>
        </Button>

        <Button
          asChild
          className="rounded-xl font-light bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white"
        >
          <Link href="/collectoid/dcm/progress">
            Track My Requests
            <ArrowRight className="size-4 ml-2" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}

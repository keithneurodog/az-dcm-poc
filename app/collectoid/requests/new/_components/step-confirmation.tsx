"use client"

import { motion } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { useColorScheme } from "@/app/collectoid/_components"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  ArrowRight,
  Database,
  Calendar,
  Sparkles,
  Circle,
} from "lucide-react"

export function StepConfirmation() {
  const { scheme } = useColorScheme()
  const { submittedRequestId, stats } = useRequestFlow()

  // Calculate expected date
  const expectedDate = new Date()
  expectedDate.setDate(expectedDate.getDate() + stats.maxWeeks * 7)
  const formattedDate = expectedDate.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col items-center justify-center"
    >
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
        className="relative mb-8"
      >
        <div className={cn(
          "w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center shadow-xl",
          scheme.from, scheme.to
        )}>
          <CheckCircle2 className="size-12 text-white" />
        </div>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          <Sparkles className="size-5 text-amber-500" />
        </motion.div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-3xl font-extralight text-neutral-900 tracking-tight mb-2"
      >
        Request Submitted
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-neutral-500 font-light mb-8 text-center max-w-md"
      >
        Your data access request has been sent to the DCM team for processing
      </motion.p>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={cn(
          "rounded-2xl border p-6 mb-8 max-w-md w-full bg-gradient-to-br",
          scheme.bg, scheme.bgHover,
          `border-${scheme.from.replace("from-", "").replace("-500", "-100")}/50`
        )}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Circle className={cn("size-2 fill-current animate-pulse", scheme.from.replace("from-", "text-"))} />
            <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Request Summary</span>
          </div>
          {submittedRequestId && (
            <Badge variant="outline" className="font-mono text-xs font-light">
              {submittedRequestId}
            </Badge>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="p-4 rounded-xl bg-white/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Database className="size-4 text-neutral-400" />
              <span className="text-2xl font-light text-neutral-900">
                {stats.total.toLocaleString()}
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-light">Datasets requested</p>
          </div>
          <div className="p-4 rounded-xl bg-white/70 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="size-4 text-neutral-400" />
              <span className="text-2xl font-light text-neutral-900">
                {stats.maxWeeks === 0 ? "Now" : `~${stats.maxWeeks}wk`}
              </span>
            </div>
            <p className="text-xs text-neutral-500 font-light">Full access</p>
          </div>
        </div>

        {/* Timeline Breakdown */}
        <div className="space-y-2">
          {stats.immediate > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-neutral-600 font-light">
                <span className="font-medium text-emerald-700">{stats.immediate}</span> ready immediately
              </span>
            </div>
          )}
          {stats.soon > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <div className={cn("w-2 h-2 rounded-full bg-gradient-to-r", scheme.from, scheme.to)} />
              <span className="text-neutral-600 font-light">
                <span className={cn("font-medium", scheme.from.replace("from-", "text-"))}>{stats.soon}</span> in ~2 weeks
              </span>
            </div>
          )}
          {stats.extended > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-neutral-400" />
              <span className="text-neutral-600 font-light">
                <span className="font-medium text-neutral-700">{stats.extended}</span> in ~6+ weeks
              </span>
            </div>
          )}
        </div>

        {/* Expected Completion */}
        <div className="mt-4 pt-4 border-t border-white/50">
          <p className="text-sm text-neutral-500 font-light">
            Expected full access by{" "}
            <span className="font-medium text-neutral-700">{formattedDate}</span>
          </p>
        </div>
      </motion.div>

      {/* What's Next */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center mb-8 max-w-md"
      >
        <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-3">What happens next</p>
        <div className="space-y-2 text-sm font-light text-neutral-600">
          <p>1. The DCM team will review and begin provisioning access</p>
          <p>2. You&apos;ll receive email notifications as datasets become available</p>
          <p>3. Track progress anytime in &quot;My Requests&quot;</p>
        </div>
      </motion.div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex items-center gap-3"
      >
        <Button
          variant="outline"
          asChild
          className="rounded-full font-light"
        >
          <Link href="/collectoid/discover/ai">
            <Database className="size-4 mr-2" />
            Browse More
          </Link>
        </Button>

        <Button
          asChild
          className={cn(
            "rounded-full font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl",
            scheme.from, scheme.to
          )}
        >
          <Link href="/collectoid/dcm/progress">
            Track Requests
            <ArrowRight className="size-4 ml-2" />
          </Link>
        </Button>
      </motion.div>
    </motion.div>
  )
}

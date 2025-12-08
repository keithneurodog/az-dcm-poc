"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  ChevronDown,
  Edit3,
  Cpu,
  Code,
  Globe,
  BookOpen,
  Check,
} from "lucide-react"

export function IntentPanel() {
  const { intent, updateIntent } = useRequestFlow()
  const [isExpanded, setIsExpanded] = useState(false)

  const hasAiMl = intent.beyondPrimaryUse.aiResearch
  const hasSoftware = intent.beyondPrimaryUse.softwareDevelopment
  const hasInternalPub = intent.publication.internalOnly
  const hasExternalPub = intent.publication.externalPublication

  const primaryCount = Object.values(intent.primaryUse).filter(Boolean).length

  const toggleBeyondPrimary = (key: keyof typeof intent.beyondPrimaryUse) => {
    updateIntent({
      ...intent,
      beyondPrimaryUse: {
        ...intent.beyondPrimaryUse,
        [key]: !intent.beyondPrimaryUse[key],
      },
    })
  }

  const togglePublication = (key: keyof typeof intent.publication) => {
    updateIntent({
      ...intent,
      publication: {
        ...intent.publication,
        [key]: !intent.publication[key],
      },
    })
  }

  return (
    <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
      {/* Summary Row */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex-1 flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium text-neutral-700">Your intent:</span>

          {primaryCount > 0 && (
            <Badge variant="outline" className="text-xs font-light bg-violet-50 text-violet-700 border-violet-200">
              {primaryCount} primary use{primaryCount > 1 ? "s" : ""}
            </Badge>
          )}

          {hasAiMl && (
            <Badge className="text-xs font-light bg-amber-100 text-amber-700 border-0">
              <Cpu className="size-3 mr-1" />
              AI/ML
            </Badge>
          )}

          {hasSoftware && (
            <Badge className="text-xs font-light bg-amber-100 text-amber-700 border-0">
              <Code className="size-3 mr-1" />
              Software Dev
            </Badge>
          )}

          {hasInternalPub && (
            <Badge className="text-xs font-light bg-blue-100 text-blue-700 border-0">
              <BookOpen className="size-3 mr-1" />
              Internal
            </Badge>
          )}

          {hasExternalPub && (
            <Badge className="text-xs font-light bg-amber-100 text-amber-700 border-0">
              <Globe className="size-3 mr-1" />
              External Pub
            </Badge>
          )}
        </div>

        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-light text-neutral-500">
          <Edit3 className="size-3 mr-1" />
          Edit
          <ChevronDown
            className={cn(
              "size-3 ml-1 transition-transform",
              isExpanded && "rotate-180"
            )}
          />
        </Button>
      </div>

      {/* Expanded Editor */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-2 border-t border-neutral-100">
              <p className="text-xs text-neutral-500 mb-3">
                Changes update the timeline in real-time
              </p>

              <div className="grid grid-cols-2 gap-4">
                {/* Beyond Primary Use */}
                <div>
                  <p className="text-xs font-medium text-neutral-600 mb-2">Beyond Primary Use</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={hasAiMl}
                        onCheckedChange={() => toggleBeyondPrimary("aiResearch")}
                        className={cn(hasAiMl && "border-amber-500 bg-amber-500")}
                      />
                      <span className="text-sm font-light text-neutral-700">AI/ML Research</span>
                      {hasAiMl && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-600">
                          +6 weeks if restricted
                        </span>
                      )}
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={hasSoftware}
                        onCheckedChange={() => toggleBeyondPrimary("softwareDevelopment")}
                        className={cn(hasSoftware && "border-amber-500 bg-amber-500")}
                      />
                      <span className="text-sm font-light text-neutral-700">Software Development</span>
                      {hasSoftware && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-600">
                          +4 weeks if restricted
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                {/* Publication */}
                <div>
                  <p className="text-xs font-medium text-neutral-600 mb-2">Publication</p>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={hasInternalPub}
                        onCheckedChange={() => togglePublication("internalOnly")}
                        className={cn(hasInternalPub && "border-blue-500 bg-blue-500")}
                      />
                      <span className="text-sm font-light text-neutral-700">Internal only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={hasExternalPub}
                        onCheckedChange={() => togglePublication("externalPublication")}
                        className={cn(hasExternalPub && "border-amber-500 bg-amber-500")}
                      />
                      <span className="text-sm font-light text-neutral-700">External publication</span>
                      {hasExternalPub && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-600">
                          +4 weeks if restricted
                        </span>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-neutral-100 flex justify-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsExpanded(false)}
                  className="h-7 text-xs font-light"
                >
                  <Check className="size-3 mr-1" />
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

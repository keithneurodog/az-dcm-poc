"use client"

import { AnimatePresence, motion } from "framer-motion"
import { RequestFlowProvider, useRequestFlow } from "./_components/request-context"
import { StepIntent } from "./_components/step-intent"
import { StepReview } from "./_components/step-review"
import { StepConfirmation } from "./_components/step-confirmation"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import { Circle, Database } from "lucide-react"

function StepIndicator() {
  const { scheme } = useColorScheme()
  const { currentStep } = useRequestFlow()

  const steps = [
    { id: "intent", label: "Intent" },
    { id: "review", label: "Review" },
    { id: "confirmation", label: "Done" },
  ]

  const currentIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <div className="flex items-center justify-center gap-3">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = index < currentIndex

        return (
          <div key={step.id} className="flex items-center gap-3">
            {index > 0 && (
              <div
                className={cn(
                  "w-12 h-px transition-colors",
                  isCompleted ? cn("bg-gradient-to-r", scheme.from, scheme.to) : "bg-neutral-200"
                )}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-light transition-all",
                  isActive
                    ? cn("bg-gradient-to-br text-white shadow-lg", scheme.from, scheme.to)
                    : isCompleted
                    ? cn("bg-gradient-to-br text-white", scheme.from, scheme.to)
                    : "bg-neutral-100 text-neutral-400"
                )}
              >
                {isCompleted ? "✓" : index + 1}
              </div>
              <span
                className={cn(
                  "text-sm font-light hidden sm:inline",
                  isActive ? "text-neutral-900" : "text-neutral-400"
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

function RequestFlowContent() {
  const { scheme } = useColorScheme()
  const { currentStep, selectedDatasets } = useRequestFlow()

  // Show empty state if no datasets selected
  if (selectedDatasets.length === 0 && currentStep !== "confirmation") {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className={cn(
          "w-20 h-20 rounded-3xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg",
          scheme.from, scheme.to
        )}>
          <Database className="size-10 text-white" />
        </div>
        <h2 className="text-2xl font-extralight text-neutral-900 tracking-tight mb-2">No datasets selected</h2>
        <p className="text-sm text-neutral-500 font-light mb-6">
          Please select datasets from the explorer first
        </p>
        <a
          href="/collectoid/discover/ai"
          className={cn(
            "text-sm font-light px-6 py-2.5 rounded-full bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
            scheme.from, scheme.to
          )}
        >
          Go to Dataset Explorer
        </a>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Step Indicator - compact at top */}
      <div className="pb-3 mb-3 border-b border-neutral-100 shrink-0">
        <StepIndicator />
      </div>

      {/* Step Content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <AnimatePresence mode="wait">
          {currentStep === "intent" && (
            <motion.div
              key="intent"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-hidden"
            >
              <StepIntent />
            </motion.div>
          )}

          {currentStep === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-hidden"
            >
              <StepReview />
            </motion.div>
          )}

          {currentStep === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full overflow-hidden"
            >
              <StepConfirmation />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function NewRequestPage() {
  const { scheme } = useColorScheme()

  // Use CSS custom property approach for dynamic height based on viewport
  // This accounts for TopBar (~56px) + layout padding (~48px) + some buffer
  return (
    <RequestFlowProvider>
      <div
        className={cn(
          "bg-gradient-to-br rounded-2xl overflow-hidden",
          scheme.bg, scheme.bgHover
        )}
        style={{ height: 'calc(100vh - 130px)', maxHeight: '900px', minHeight: '500px' }}
      >
        <div className="h-full px-4 py-3 overflow-hidden">
          <RequestFlowContent />
        </div>
      </div>
    </RequestFlowProvider>
  )
}

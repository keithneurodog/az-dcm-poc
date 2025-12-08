"use client"

import { AnimatePresence, motion } from "framer-motion"
import { RequestFlowProvider, useRequestFlow } from "./_components/request-context"
import { StepIntent } from "./_components/step-intent"
import { StepBuilder } from "./_components/step-builder"
import { StepConfirmation } from "./_components/step-confirmation"
import { cn } from "@/lib/utils"

function StepIndicator() {
  const { currentStep } = useRequestFlow()

  const steps = [
    { id: "intent", label: "Intent" },
    { id: "builder", label: "Build Request" },
    { id: "confirmation", label: "Done" },
  ]

  const currentIndex = steps.findIndex(s => s.id === currentStep)

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep
        const isCompleted = index < currentIndex

        return (
          <div key={step.id} className="flex items-center gap-2">
            {index > 0 && (
              <div
                className={cn(
                  "w-8 h-0.5 rounded-full transition-colors",
                  isCompleted ? "bg-violet-500" : "bg-neutral-200"
                )}
              />
            )}
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all",
                  isActive
                    ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-md"
                    : isCompleted
                    ? "bg-violet-500 text-white"
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
  const { currentStep, selectedDatasets } = useRequestFlow()

  // Show empty state if no datasets selected
  if (selectedDatasets.length === 0 && currentStep !== "confirmation") {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-6xl mb-4">📊</div>
        <h2 className="text-xl font-light text-neutral-700 mb-2">No datasets selected</h2>
        <p className="text-sm text-neutral-500 font-light mb-4">
          Please select datasets from the explorer first
        </p>
        <a
          href="/collectoid/discover/ai"
          className="text-sm font-light text-violet-600 hover:text-violet-700 underline underline-offset-2"
        >
          Go to Dataset Explorer →
        </a>
      </div>
    )
  }

  return (
    <>
      <StepIndicator />

      <AnimatePresence mode="wait">
        {currentStep === "intent" && (
          <motion.div
            key="intent"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepIntent />
          </motion.div>
        )}

        {currentStep === "builder" && (
          <motion.div
            key="builder"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepBuilder />
          </motion.div>
        )}

        {currentStep === "confirmation" && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <StepConfirmation />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function NewRequestPage() {
  return (
    <RequestFlowProvider>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100/50">
        <div className="container mx-auto px-4 py-8">
          <RequestFlowContent />
        </div>
      </div>
    </RequestFlowProvider>
  )
}

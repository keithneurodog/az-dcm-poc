"use client"

import { motion } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Brain,
  Microscope,
  FileText,
  Lightbulb,
  BarChart3,
  Cpu,
  Code,
  BookOpen,
  Globe,
  Database,
} from "lucide-react"

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export function StepIntent() {
  const { intent, updateIntent, goNext, selectedDatasets } = useRequestFlow()

  const togglePrimaryUse = (key: keyof typeof intent.primaryUse) => {
    updateIntent({
      ...intent,
      primaryUse: {
        ...intent.primaryUse,
        [key]: !intent.primaryUse[key],
      },
    })
  }

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

  const hasAnySelection =
    Object.values(intent.primaryUse).some(Boolean) ||
    Object.values(intent.beyondPrimaryUse).some(Boolean) ||
    Object.values(intent.publication).some(Boolean)

  const primaryUseOptions = [
    {
      key: "understandDrugMechanism" as const,
      label: "Understand how drugs work",
      description: "Study drug mechanisms and pharmacology",
      icon: Microscope,
    },
    {
      key: "understandDisease" as const,
      label: "Understand disease",
      description: "Research disease progression and biology",
      icon: Brain,
    },
    {
      key: "developDiagnosticTests" as const,
      label: "Develop diagnostics",
      description: "Create diagnostic tests and biomarkers",
      icon: BarChart3,
    },
    {
      key: "learnFromPastStudies" as const,
      label: "Learn from past studies",
      description: "Inform future trial design",
      icon: Lightbulb,
    },
    {
      key: "improveAnalysisMethods" as const,
      label: "Improve analysis methods",
      description: "Enhance statistical approaches",
      icon: FileText,
    },
  ]

  const beyondPrimaryOptions = [
    {
      key: "aiResearch" as const,
      label: "AI/ML Research",
      description: "Train models, develop algorithms",
      icon: Cpu,
      warning: "May add time for restricted datasets",
    },
    {
      key: "softwareDevelopment" as const,
      label: "Software Development",
      description: "Build tools and applications",
      icon: Code,
      warning: "May add time for restricted datasets",
    },
  ]

  const publicationOptions = [
    {
      key: "internalOnly" as const,
      label: "Internal use only",
      description: "Company-restricted findings",
      icon: BookOpen,
    },
    {
      key: "externalPublication" as const,
      label: "External publication",
      description: "Publish in journals/conferences",
      icon: Globe,
      warning: "May add time for restricted datasets",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-3xl mx-auto"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 mb-4">
          <Database className="size-6 text-white" />
        </div>
        <h1 className="text-2xl font-light text-neutral-900 mb-2">
          What do you want to do with this data?
        </h1>
        <p className="text-neutral-500 font-light">
          Selecting your intended use helps us find the fastest path to access for your{" "}
          <span className="font-medium text-neutral-700">{selectedDatasets.length} datasets</span>
        </p>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Primary Use */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h2 className="text-sm font-medium text-neutral-900 mb-1">Primary Research Use</h2>
          <p className="text-xs text-neutral-500 mb-4">Standard research activities</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {primaryUseOptions.map((option) => {
              const Icon = option.icon
              const isChecked = intent.primaryUse[option.key]

              return (
                <button
                  key={option.key}
                  onClick={() => togglePrimaryUse(option.key)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl text-left transition-all",
                    isChecked
                      ? "bg-violet-50 border-2 border-violet-300"
                      : "bg-neutral-50 border-2 border-transparent hover:border-neutral-200"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                      isChecked ? "bg-violet-100" : "bg-neutral-100"
                    )}
                  >
                    <Icon className={cn("size-4", isChecked ? "text-violet-600" : "text-neutral-500")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-medium",
                        isChecked ? "text-violet-900" : "text-neutral-700"
                      )}>
                        {option.label}
                      </span>
                      <Checkbox
                        checked={isChecked}
                        className={cn(
                          "ml-auto shrink-0",
                          isChecked && "border-violet-500 bg-violet-500"
                        )}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{option.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Beyond Primary Use */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-neutral-200 p-5">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-sm font-medium text-neutral-900">Beyond Primary Use</h2>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
              May affect timeline
            </span>
          </div>
          <p className="text-xs text-neutral-500 mb-4">Advanced research activities with additional governance</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {beyondPrimaryOptions.map((option) => {
              const Icon = option.icon
              const isChecked = intent.beyondPrimaryUse[option.key]

              return (
                <button
                  key={option.key}
                  onClick={() => toggleBeyondPrimary(option.key)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl text-left transition-all",
                    isChecked
                      ? "bg-amber-50 border-2 border-amber-300"
                      : "bg-neutral-50 border-2 border-transparent hover:border-neutral-200"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                      isChecked ? "bg-amber-100" : "bg-neutral-100"
                    )}
                  >
                    <Icon className={cn("size-4", isChecked ? "text-amber-600" : "text-neutral-500")} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-sm font-medium",
                        isChecked ? "text-amber-900" : "text-neutral-700"
                      )}>
                        {option.label}
                      </span>
                      <Checkbox
                        checked={isChecked}
                        className={cn(
                          "ml-auto shrink-0",
                          isChecked && "border-amber-500 bg-amber-500"
                        )}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{option.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Publication */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-neutral-200 p-5">
          <h2 className="text-sm font-medium text-neutral-900 mb-1">Publication Rights</h2>
          <p className="text-xs text-neutral-500 mb-4">How you plan to share findings</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {publicationOptions.map((option) => {
              const Icon = option.icon
              const isChecked = intent.publication[option.key]

              return (
                <button
                  key={option.key}
                  onClick={() => togglePublication(option.key)}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl text-left transition-all",
                    isChecked
                      ? option.key === "externalPublication"
                        ? "bg-amber-50 border-2 border-amber-300"
                        : "bg-blue-50 border-2 border-blue-300"
                      : "bg-neutral-50 border-2 border-transparent hover:border-neutral-200"
                  )}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                      isChecked
                        ? option.key === "externalPublication"
                          ? "bg-amber-100"
                          : "bg-blue-100"
                        : "bg-neutral-100"
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4",
                        isChecked
                          ? option.key === "externalPublication"
                            ? "text-amber-600"
                            : "text-blue-600"
                          : "text-neutral-500"
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          isChecked
                            ? option.key === "externalPublication"
                              ? "text-amber-900"
                              : "text-blue-900"
                            : "text-neutral-700"
                        )}
                      >
                        {option.label}
                      </span>
                      {option.warning && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700">
                          May affect timeline
                        </span>
                      )}
                      <Checkbox
                        checked={isChecked}
                        className={cn(
                          "ml-auto shrink-0",
                          isChecked &&
                            (option.key === "externalPublication"
                              ? "border-amber-500 bg-amber-500"
                              : "border-blue-500 bg-blue-500")
                        )}
                      />
                    </div>
                    <p className="text-xs text-neutral-500 mt-0.5">{option.description}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </motion.div>

        {/* Continue Button */}
        <motion.div variants={itemVariants} className="flex justify-end pt-4">
          <Button
            onClick={goNext}
            disabled={!hasAnySelection}
            className={cn(
              "rounded-xl px-6 h-11 font-light transition-all",
              hasAnySelection
                ? "bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl"
                : "bg-neutral-100 text-neutral-400"
            )}
          >
            Continue
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

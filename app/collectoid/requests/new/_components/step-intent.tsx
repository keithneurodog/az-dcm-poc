"use client"

import { motion } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { useColorScheme } from "@/app/collectoid/_components"
import { Button } from "@/components/ui/button"
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
  Check,
  FlaskConical,
  LineChart,
} from "lucide-react"

export function StepIntent() {
  const { scheme } = useColorScheme()
  const { intent, updateIntent, goNext, selectedDatasets } = useRequestFlow()

  const togglePrimaryUse = (key: keyof typeof intent.primaryUse) => {
    updateIntent({
      ...intent,
      primaryUse: { ...intent.primaryUse, [key]: !intent.primaryUse[key] },
    })
  }

  const toggleBeyondPrimary = (key: keyof typeof intent.beyondPrimaryUse) => {
    updateIntent({
      ...intent,
      beyondPrimaryUse: { ...intent.beyondPrimaryUse, [key]: !intent.beyondPrimaryUse[key] },
    })
  }

  const togglePublication = (key: keyof typeof intent.publication) => {
    updateIntent({
      ...intent,
      publication: { ...intent.publication, [key]: !intent.publication[key] },
    })
  }

  const hasAnySelection =
    Object.values(intent.primaryUse).some(Boolean) ||
    Object.values(intent.beyondPrimaryUse).some(Boolean) ||
    Object.values(intent.publication).some(Boolean)

  // Research Purpose - What you'll study
  const researchPurposeOptions = [
    { key: "understandDrugMechanism" as const, label: "Drug mechanism", icon: Microscope, description: "Study how drugs work" },
    { key: "understandDisease" as const, label: "Disease understanding", icon: Brain, description: "Research disease pathways" },
    { key: "developDiagnosticTests" as const, label: "Diagnostics", icon: BarChart3, description: "Develop diagnostic tools" },
    { key: "learnFromPastStudies" as const, label: "Historical analysis", icon: Lightbulb, description: "Learn from prior studies" },
    { key: "improveAnalysisMethods" as const, label: "Methodology", icon: FileText, description: "Improve analysis methods" },
  ]

  // Technical Application - How you'll use the data
  const technicalApplicationOptions = [
    { key: "aiResearch" as const, label: "AI/ML training", icon: Cpu, description: "Train machine learning models", warning: true },
    { key: "softwareDevelopment" as const, label: "Software dev", icon: Code, description: "Build software tools", warning: true },
  ]

  // Dissemination - How results will be shared
  const disseminationOptions = [
    { key: "internalOnly" as const, label: "Internal only", icon: BookOpen, description: "Results stay within org" },
    { key: "externalPublication" as const, label: "External publication", icon: Globe, description: "Publish externally", warning: true },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col items-center justify-center"
    >
      {/* Header */}
      <div className="text-center mb-6">
        <div className={cn(
          "inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br mb-4 shadow-lg",
          scheme.from, scheme.to
        )}>
          <FlaskConical className="size-7 text-white" />
        </div>
        <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight mb-2">
          Describe your research intent
        </h1>
        <p className="text-neutral-500 font-light">
          <span className={cn("font-normal", scheme.from.replace("from-", "text-"))}>
            {selectedDatasets.length.toLocaleString()}
          </span>
          {" "}datasets selected for secondary use
        </p>
      </div>

      {/* Intent Categories */}
      <div className="max-w-2xl mx-auto w-full space-y-5">
        {/* Research Purpose */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">Research Purpose</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-light">
              What you'll study
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {researchPurposeOptions.map((option) => {
              const Icon = option.icon
              const isChecked = intent.primaryUse[option.key]
              return (
                <button
                  key={option.key}
                  onClick={() => togglePrimaryUse(option.key)}
                  title={option.description}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-light transition-all border-2",
                    isChecked
                      ? cn("bg-gradient-to-r text-white border-transparent shadow-md", scheme.from, scheme.to)
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:shadow-sm"
                  )}
                >
                  {isChecked ? (
                    <Check className="size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Technical Application */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">Technical Application</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 font-light">
              May affect timeline
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {technicalApplicationOptions.map((option) => {
              const Icon = option.icon
              const isChecked = intent.beyondPrimaryUse[option.key]
              return (
                <button
                  key={option.key}
                  onClick={() => toggleBeyondPrimary(option.key)}
                  title={option.description}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-light transition-all border-2",
                    isChecked
                      ? cn("bg-gradient-to-r text-white border-transparent shadow-md", scheme.from, scheme.to)
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:shadow-sm"
                  )}
                >
                  {isChecked ? (
                    <Check className="size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dissemination */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">Dissemination</p>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 font-light">
              How results are shared
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {disseminationOptions.map((option) => {
              const Icon = option.icon
              const isChecked = intent.publication[option.key]
              return (
                <button
                  key={option.key}
                  onClick={() => togglePublication(option.key)}
                  title={option.description}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-light transition-all border-2",
                    isChecked
                      ? cn("bg-gradient-to-r text-white border-transparent shadow-md", scheme.from, scheme.to)
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:shadow-sm"
                  )}
                >
                  {isChecked ? (
                    <Check className="size-4" />
                  ) : (
                    <Icon className="size-4" />
                  )}
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-6 flex justify-center">
        <Button
          onClick={goNext}
          disabled={!hasAnySelection}
          className={cn(
            "h-12 px-8 rounded-full font-light text-base transition-all",
            hasAnySelection
              ? cn("bg-gradient-to-r text-white shadow-lg hover:shadow-xl", scheme.from, scheme.to)
              : "bg-neutral-100 text-neutral-400"
          )}
        >
          Continue
          <ArrowRight className="size-5 ml-2" />
        </Button>
      </div>
    </motion.div>
  )
}

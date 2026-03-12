"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Lock,
  EyeOff,
  Link2,
  FileEdit,
  Database,
  Sparkles,
  Target,
  Users,
  Shield,
  Wand2,
} from "lucide-react"

// Demo scenarios for prefill
const DEMO_SCENARIOS = [
  {
    title: "Oncology ctDNA Biomarker Studies for ML Analysis",
    description: "We're building a machine learning model to predict treatment response based on circulating tumor DNA dynamics. We need access to Phase II and III oncology studies with longitudinal ctDNA measurements, including VAF data at baseline and on-treatment timepoints. Ideally studies with matched clinical outcomes (RECIST assessments, PFS, OS) to correlate molecular changes with response patterns.",
  },
  {
    title: "CVRM Closed Studies - Cross-Study Cardiovascular Safety Analysis",
    description: "Our team is conducting a comprehensive safety analysis across the CVRM portfolio to identify early signals of cardiovascular events. We need closed studies from the past 5 years with complete adverse event data, ECG measurements, and cardiac biomarkers.\n\nThis will support regulatory submissions and help establish safety benchmarks for future trials in the cardiovascular space.",
  },
  {
    title: "Immunotherapy Response Prediction Data Collection",
    description: "Developing a biomarker signature to predict durable response to checkpoint inhibitors. Requires access to IO studies with pre-treatment tumor biopsies, TMB/MSI status, PD-L1 expression, and treatment outcomes. Looking for both responders and non-responders to build a balanced training dataset for our predictive algorithm.",
  },
  {
    title: "BioPharma Portfolio Safety Signal Detection Initiative",
    description: "Cross-therapeutic area initiative to establish an AI-powered safety surveillance system. We need standardized SDTM adverse event data from closed studies across CVRM, R&I, and V&I therapeutic areas. The goal is to identify previously unrecognized safety patterns and build proactive monitoring capabilities for ongoing trials.",
  },
]

export default function CreateCollectionSimple() {
  const { scheme } = useColorScheme()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const canProceed = title.trim().length > 0

  // Dev helper to prefill with demo data
  const handlePrefill = () => {
    const randomScenario = DEMO_SCENARIOS[Math.floor(Math.random() * DEMO_SCENARIOS.length)]
    setTitle(randomScenario.title)
    setDescription(randomScenario.description)
  }

  const handleCreateConcept = () => {
    if (typeof window !== "undefined") {
      // Clear any previous workspace data first
      sessionStorage.removeItem("dcm_selected_datasets")
      sessionStorage.removeItem("dcm_selected_activities")
      sessionStorage.removeItem("dcm_agreement_of_terms")
      sessionStorage.removeItem("dcm_collection_status")
      sessionStorage.removeItem("dcm_ai_analysis")
      sessionStorage.removeItem("dcm_target_community")
      sessionStorage.removeItem("dcm_total_users")
      sessionStorage.removeItem("dcm_selected_categories")
      sessionStorage.removeItem("dcm_collection_intent")

      // Save new concept data
      sessionStorage.setItem("dcm_collection_name", title.trim())
      sessionStorage.setItem("dcm_collection_description", description.trim())
      sessionStorage.setItem("dcm_concept_created", new Date().toISOString())
    }
    // Navigate to workspace
    router.push("/collectoid-v2/dcm/create/workspace")
  }

  return (
    <div className="max-w-2xl lg:max-w-3xl mx-auto py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className={cn(
            "inline-flex items-center justify-center size-16 rounded-2xl mb-6 bg-gradient-to-br",
            scheme.from,
            scheme.to
          )}
        >
          <Database className="size-8 text-white" />
        </div>
        <h1 className="text-3xl font-extralight text-neutral-900 mb-3 tracking-tight">
          Start a New Collection
        </h1>
        <p className="text-base font-light text-neutral-600">
          Give your collection a name and describe what you&apos;re looking for
        </p>
      </div>

      {/* Concept Privacy Banner */}
      <div className={cn("rounded-2xl border p-5 mb-8", scheme.bg, scheme.from.replace("from-", "border-").replace("500", "100"))}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("flex size-11 items-center justify-center rounded-xl bg-gradient-to-br", scheme.from, scheme.to)}>
              <Lock className="size-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-normal text-neutral-900">This is a private concept</span>
              <span className="text-sm font-light text-neutral-500 ml-2">— only you can see it</span>
            </div>
          </div>
          <div className="flex items-center gap-5 text-xs font-light text-neutral-600">
            <div className="flex items-center gap-1.5">
              <EyeOff className="size-3.5" />
              <span>Hidden from browse</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Link2 className="size-3.5" />
              <span>Share by link when ready</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileEdit className="size-3.5" />
              <span>Save &amp; return anytime</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden mb-8 relative">
        {/* Dev Prefill Button */}
        <button
          onClick={handlePrefill}
          className={cn(
            "absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-light transition-all z-10",
            "bg-neutral-100 hover:bg-neutral-200 text-neutral-600 hover:text-neutral-900",
            "border border-neutral-200 hover:border-neutral-300"
          )}
          title="Prefill with demo data"
        >
          <Wand2 className="size-3.5" />
          <span>Demo</span>
        </button>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-normal text-neutral-900 mb-2">
                Collection Title <span className="text-red-500">*</span>
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Oncology Biomarker Studies for ML Research"
                className="h-12 border-neutral-200 rounded-xl font-light text-base"
                autoFocus
              />
              <p className="text-xs font-light text-neutral-500 mt-2">
                A clear, descriptive name helps others understand your collection&apos;s purpose
              </p>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-normal text-neutral-900 mb-2">
                Description <span className="text-neutral-400 font-light">(optional)</span>
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What are you trying to accomplish? What kind of data do you need?"
                rows={6}
                className="border-neutral-200 rounded-xl font-light text-base resize-none"
              />
              <p className="text-xs font-light text-neutral-500 mt-2">
                Describe your research goals - this helps with AI-assisted dataset discovery
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* What Happens Next */}
      <Card className="border-neutral-100 bg-neutral-50 rounded-2xl overflow-hidden mb-8">
        <CardContent className="p-6">
          <h3 className="text-sm font-normal text-neutral-900 mb-4">What happens next?</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200">
                <Database className="size-4 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm font-normal text-neutral-800">Add Datasets</p>
                <p className="text-xs font-light text-neutral-500">Browse or use AI search to find data</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200">
                <Target className="size-4 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm font-normal text-neutral-800">Define Activities</p>
                <p className="text-xs font-light text-neutral-500">Specify how data will be used</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200">
                <Shield className="size-4 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm font-normal text-neutral-800">Set Terms</p>
                <p className="text-xs font-light text-neutral-500">Configure data use terms</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200">
                <Users className="size-4 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm font-normal text-neutral-800">Assign Roles</p>
                <p className="text-xs font-light text-neutral-500">Add approvers and consumers</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => router.push("/collectoid-v2/dashboard")}
          className="rounded-xl font-light text-neutral-600"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreateConcept}
          disabled={!canProceed}
          className={cn(
            "h-12 px-8 rounded-2xl font-light shadow-lg hover:shadow-xl transition-all bg-gradient-to-r text-white",
            scheme.from,
            scheme.to,
            !canProceed && "opacity-50 cursor-not-allowed"
          )}
        >
          Create Concept
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>

      {/* AI Search Hint */}
      <div className="mt-8 text-center">
        <p className="text-sm font-light text-neutral-500 mb-3">
          Not sure where to start?
        </p>
        <Button
          variant="outline"
          onClick={() => router.push("/collectoid-v2/discover/ai")}
          className="rounded-xl font-light border-neutral-200"
        >
          <Sparkles className="size-4 mr-2" />
          Try AI-Assisted Discovery
        </Button>
      </div>
    </div>
  )
}

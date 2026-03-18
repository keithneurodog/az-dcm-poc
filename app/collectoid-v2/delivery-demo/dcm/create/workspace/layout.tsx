"use client"

import { useEffect, useState, createContext, useContext, useMemo } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useColorScheme } from "../../../_components"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowRight,
  Database,
  Target,
  Shield,
  Users,
  CheckCircle2,
  Layers,
  ChevronRight,
  Sparkles,
  X,
  Bot,
  Search,
  Filter,
  Lightbulb,
  AlertTriangle,
  Zap,
  Clock,
  HelpCircle,
  ChevronDown,
} from "lucide-react"
import { Dataset, DatasetWithROAMFields, CURRENT_USER_ID } from "@/lib/dcm-mock-data"
import { useCollectionsStore } from "@/lib/collections-store"

// AI Analysis status
export type AIAnalysisStatus = "idle" | "analyzing" | "complete"

export interface AIAnalysisResult {
  suggestedFilters: {
    therapeuticAreas: string[]
    phases: string[]
    studyStatus: string[]
    modalities: string[]
  }
  suggestedKeywords: string[]
  confidence: number
}

// Workspace context for shared state
interface WorkspaceContextValue {
  collectionName: string
  setCollectionName: (name: string) => void
  description: string
  setDescription: (desc: string) => void
  selectedDatasets: DatasetWithROAMFields[]
  setSelectedDatasets: (datasets: DatasetWithROAMFields[]) => void
  selectedActivities: string[]
  setSelectedActivities: (activities: string[]) => void
  hasAgreementOfTerms: boolean
  setHasAgreementOfTerms: (has: boolean) => void
  assignedRoles: string[]
  setAssignedRoles: (roles: string[]) => void
  status: "concept" | "draft"
  // AI Analysis
  aiAnalysisStatus: AIAnalysisStatus
  aiAnalysisResult: AIAnalysisResult | null
  showAiHelp: () => void
  // Promote
  canPromote: boolean
  handlePromote: () => void
}

const WorkspaceContext = createContext<WorkspaceContextValue | null>(null)

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceLayout")
  }
  return context
}

interface Section {
  id: string
  title: string
  icon: React.ElementType
  href: string
  isComplete: boolean
  required: boolean
}

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const pathname = usePathname()

  // Workspace state
  const [collectionName, setCollectionName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedDatasets, setSelectedDatasets] = useState<DatasetWithROAMFields[]>([])
  const [selectedActivities, setSelectedActivities] = useState<string[]>([])
  const [hasAgreementOfTerms, setHasAgreementOfTerms] = useState(false)
  const [assignedRoles, setAssignedRoles] = useState<string[]>([])
  const [status, setStatus] = useState<"concept" | "draft">("concept")
  const [isLoading, setIsLoading] = useState(true)

  // AI Analysis state
  const [aiAnalysisStatus, setAiAnalysisStatus] = useState<AIAnalysisStatus>("idle")
  const [aiAnalysisResult, setAiAnalysisResult] = useState<AIAnalysisResult | null>(null)
  const [showAiHelpModal, setShowAiHelpModal] = useState(false)
  const [showPromoteModal, setShowPromoteModal] = useState(false)
  const [activitiesExpanded, setActivitiesExpanded] = useState(false)

  const { addCollection } = useCollectionsStore()

  // Load from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = sessionStorage.getItem("dcm_collection_name")
      const storedDescription = sessionStorage.getItem("dcm_collection_description")
      const storedDatasets = sessionStorage.getItem("dcm_selected_datasets")
      const storedActivities = sessionStorage.getItem("dcm_selected_activities")
      const storedAoT = sessionStorage.getItem("dcm_agreement_of_terms")
      const storedStatus = sessionStorage.getItem("dcm_collection_status")
      const storedAiAnalysis = sessionStorage.getItem("dcm_ai_analysis")

      if (storedName) setCollectionName(storedName)
      if (storedDescription) setDescription(storedDescription)
      if (storedDatasets) setSelectedDatasets(JSON.parse(storedDatasets))
      if (storedActivities) setSelectedActivities(JSON.parse(storedActivities))
      if (storedAoT) setHasAgreementOfTerms(true)
      if (storedStatus === "draft") setStatus("draft")

      // Restore AI analysis if it was already completed
      if (storedAiAnalysis) {
        setAiAnalysisResult(JSON.parse(storedAiAnalysis))
        setAiAnalysisStatus("complete")
      }

      // If no name, redirect to create
      if (!storedName) {
        router.push("/collectoid-v2/delivery-demo/dcm/create")
        return
      }

      setIsLoading(false)
    }
  }, [router])

  // Simulate AI analysis when workspace loads with content
  useEffect(() => {
    if (!isLoading && collectionName && aiAnalysisStatus === "idle") {
      // Start analysis
      setAiAnalysisStatus("analyzing")
    }
  }, [isLoading, collectionName, aiAnalysisStatus])

  // Run the actual analysis timer separately to avoid cleanup issues
  useEffect(() => {
    if (aiAnalysisStatus !== "analyzing") return

    // Simulate AI processing (6-8 seconds)
    const analysisTime = 6000 + Math.random() * 2000
    const timer = setTimeout(() => {
        // Generate mock results based on content keywords
        const lowerDesc = (description || "").toLowerCase()
        const lowerName = collectionName.toLowerCase()
        const combined = `${lowerName} ${lowerDesc}`

        const result: AIAnalysisResult = {
          suggestedFilters: {
            therapeuticAreas: [],
            phases: [],
            studyStatus: [],
            modalities: [],
          },
          suggestedKeywords: [],
          confidence: 0.85 + Math.random() * 0.1,
        }

        // Detect therapeutic areas (must match data codes)
        if (combined.includes("oncology") || combined.includes("cancer") || combined.includes("tumor")) {
          result.suggestedFilters.therapeuticAreas.push("ONC")
        }
        if (combined.includes("immuno-onc") || combined.includes("immunotherapy") || combined.includes("checkpoint") || combined.includes("io ")) {
          result.suggestedFilters.therapeuticAreas.push("IMMUNONC")
        }
        if (combined.includes("cardio") || combined.includes("cvrm") || combined.includes("heart")) {
          result.suggestedFilters.therapeuticAreas.push("CARDIO")
        }
        if (combined.includes("neuro") || combined.includes("brain") || combined.includes("cns")) {
          result.suggestedFilters.therapeuticAreas.push("NEURO")
        }
        if (combined.includes("immuno") && !combined.includes("immuno-onc")) {
          result.suggestedFilters.therapeuticAreas.push("IMMUNO")
        }

        // Detect phases (must match data values)
        if (combined.includes("phase ii") || combined.includes("phase 2")) {
          result.suggestedFilters.phases.push("II")
        }
        if (combined.includes("phase iii") || combined.includes("phase 3")) {
          result.suggestedFilters.phases.push("III")
        }

        // Detect study status (must match dropdown values exactly)
        if (combined.includes("closed")) {
          result.suggestedFilters.studyStatus.push("Closed")
        }
        if (combined.includes("ongoing") || combined.includes("active")) {
          result.suggestedFilters.studyStatus.push("Active")
        }

        // Detect modalities (must match data values exactly)
        if (combined.includes("ctdna") || combined.includes("biomarker")) {
          result.suggestedFilters.modalities.push("Biomarkers")
        }
        if (combined.includes("genomic") || combined.includes("dna") || combined.includes("sequencing")) {
          result.suggestedFilters.modalities.push("Genomic")
        }
        if (combined.includes("sdtm") || combined.includes("clinical data") || combined.includes("clinical")) {
          result.suggestedFilters.modalities.push("Clinical")
        }
        if (combined.includes("imaging") || combined.includes("scan") || combined.includes("recist")) {
          result.suggestedFilters.modalities.push("Imaging")
        }

        // If no specific matches found, add some default demo suggestions
        if (result.suggestedFilters.therapeuticAreas.length === 0) {
          result.suggestedFilters.therapeuticAreas.push("ONC")
        }
        if (result.suggestedFilters.phases.length === 0) {
          result.suggestedFilters.phases.push("II", "III")
        }
        if (result.suggestedFilters.studyStatus.length === 0) {
          result.suggestedFilters.studyStatus.push("Closed")
        }
        if (result.suggestedFilters.modalities.length === 0) {
          result.suggestedFilters.modalities.push("Clinical", "Biomarkers")
        }

        // Extract keywords
        const keywords: string[] = []
        if (combined.includes("ml") || combined.includes("machine learning")) keywords.push("machine learning")
        if (combined.includes("prediction") || combined.includes("predict")) keywords.push("prediction")
        if (combined.includes("biomarker")) keywords.push("biomarkers")
        if (combined.includes("safety")) keywords.push("safety analysis")
        if (combined.includes("response")) keywords.push("treatment response")
        if (combined.includes("ctdna")) keywords.push("ctDNA")
        if (combined.includes("cross-study") || combined.includes("portfolio")) keywords.push("cross-study")
        if (keywords.length === 0) keywords.push("clinical research", "data analysis")
        result.suggestedKeywords = keywords.slice(0, 5)

        setAiAnalysisResult(result)
        setAiAnalysisStatus("complete")

      // Store in session for other pages
      sessionStorage.setItem("dcm_ai_analysis", JSON.stringify(result))
    }, analysisTime)

    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiAnalysisStatus])

  // Save name/description when changed
  useEffect(() => {
    if (typeof window !== "undefined" && collectionName) {
      sessionStorage.setItem("dcm_collection_name", collectionName)
    }
  }, [collectionName])

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_collection_description", description)
    }
  }, [description])

  // Sections config
  const sections: Section[] = useMemo(() => [
    {
      id: "overview",
      title: "Overview",
      icon: Layers,
      href: "/collectoid-v2/delivery-demo/dcm/create/workspace",
      isComplete: true, // Always complete (it's the hub)
      required: false,
    },
    {
      id: "datasets",
      title: "Datasets",
      icon: Database,
      href: "/collectoid-v2/delivery-demo/dcm/create/workspace/datasets",
      isComplete: selectedDatasets.length > 0,
      required: true,
    },
    {
      id: "activities",
      title: "Activities & Purpose",
      icon: Target,
      href: "/collectoid-v2/delivery-demo/dcm/create/workspace/activities",
      isComplete: selectedActivities.length > 0,
      required: true,
    },
    {
      id: "terms",
      title: "Data Use Terms",
      icon: Shield,
      href: "/collectoid-v2/delivery-demo/dcm/create/workspace/terms",
      isComplete: hasAgreementOfTerms,
      required: true,
    },
    {
      id: "roles",
      title: "Access & Users",
      icon: Users,
      href: "/collectoid-v2/delivery-demo/dcm/create/workspace/roles",
      isComplete: assignedRoles.length > 0,
      required: true,
    },
  ], [selectedDatasets.length, selectedActivities.length, hasAgreementOfTerms, assignedRoles.length])

  const completedRequired = sections.filter(s => s.required && s.isComplete).length
  const totalRequired = sections.filter(s => s.required).length
  const canPromote = completedRequired === totalRequired

  // Get current section from pathname
  const currentSection = useMemo(() => {
    if (pathname.endsWith("/datasets")) return "datasets"
    if (pathname.endsWith("/activities")) return "activities"
    if (pathname.endsWith("/terms")) return "terms"
    if (pathname.endsWith("/roles")) return "roles"
    return "overview"
  }, [pathname])

  const handlePromote = () => {
    setActivitiesExpanded(false)
    setShowPromoteModal(true)
  }

  // Calculate aggregate access breakdown from selected datasets
  const accessBreakdown = useMemo(() => {
    const total = selectedDatasets.length
    if (total === 0) return { alreadyOpen: 20, readyToGrant: 30, needsApproval: 40, missingLocation: 10 }
    const sums = selectedDatasets.reduce(
      (acc, d) => ({
        alreadyOpen: acc.alreadyOpen + d.accessBreakdown.alreadyOpen,
        readyToGrant: acc.readyToGrant + d.accessBreakdown.readyToGrant,
        needsApproval: acc.needsApproval + d.accessBreakdown.needsApproval,
        missingLocation: acc.missingLocation + d.accessBreakdown.missingLocation,
      }),
      { alreadyOpen: 0, readyToGrant: 0, needsApproval: 0, missingLocation: 0 }
    )
    return {
      alreadyOpen: Math.round(sums.alreadyOpen / total),
      readyToGrant: Math.round(sums.readyToGrant / total),
      needsApproval: Math.round(sums.needsApproval / total),
      missingLocation: Math.round(sums.missingLocation / total),
    }
  }, [selectedDatasets])

  // Detect potential conflicts
  const conflicts = useMemo(() => {
    const issues: string[] = []
    if (accessBreakdown.missingLocation > 15) issues.push("Some datasets have unknown data locations — provisioning may be delayed")
    if (accessBreakdown.needsApproval > 50) issues.push("Over half of access requires manual approval from GPT/TALT")
    if (selectedDatasets.some(d => d.complianceStatus !== "Fully Compliant")) issues.push("One or more datasets have pending compliance reviews")
    return issues
  }, [accessBreakdown, selectedDatasets])

  const confirmPromote = () => {
    const newId = `col-draft-${Date.now()}`
    const storedAoT = typeof window !== "undefined" ? sessionStorage.getItem("dcm_agreement_of_terms") : null
    const storedUsers = typeof window !== "undefined" ? sessionStorage.getItem("dcm_total_users") : null
    const totalUsers = storedUsers ? parseInt(storedUsers) : 0

    const draftCollection = {
      id: newId,
      name: collectionName,
      description,
      status: "draft" as const,
      progress: 0,
      totalUsers,
      usersWithAccess: 0,
      totalDatasets: selectedDatasets.length,
      createdAt: new Date(),
      createdBy: "You",
      creatorId: CURRENT_USER_ID,
      isDraft: false,
      therapeuticAreas: [...new Set(selectedDatasets.flatMap(d => d.therapeuticArea || []))],
      tags: [],
      accessLevel: "member" as const,
      isFavorite: false,
      commentCount: 0,
      selectedDatasets,
      accessBreakdown: {
        immediate: accessBreakdown.alreadyOpen,
        instantGrant: accessBreakdown.readyToGrant,
        pendingApproval: accessBreakdown.needsApproval,
        dataDiscovery: accessBreakdown.missingLocation,
      },
      instantGrantProgress: 0,
      approvalRequests: [],
      milestones: [
        { name: "Concept created", status: "completed" as const, timestamp: new Date(Date.now() - 60000) },
        { name: "Promoted to draft", status: "completed" as const, timestamp: new Date() },
      ],
      agreementOfTerms: storedAoT ? JSON.parse(storedAoT) : undefined,
    }

    addCollection(draftCollection)

    // Clear workspace sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("dcm_collection_name")
      sessionStorage.removeItem("dcm_collection_description")
      sessionStorage.removeItem("dcm_selected_datasets")
      sessionStorage.removeItem("dcm_selected_activities")
      sessionStorage.removeItem("dcm_agreement_of_terms")
      sessionStorage.removeItem("dcm_collection_status")
      sessionStorage.removeItem("dcm_ai_analysis")
      sessionStorage.removeItem("dcm_target_community")
      sessionStorage.removeItem("dcm_total_users")
    }

    setShowPromoteModal(false)
    router.push(`/collectoid-v2/collections/${newId}`)
  }

  const contextValue: WorkspaceContextValue = {
    collectionName,
    setCollectionName,
    description,
    setDescription,
    selectedDatasets,
    setSelectedDatasets,
    selectedActivities,
    setSelectedActivities,
    hasAgreementOfTerms,
    setHasAgreementOfTerms,
    assignedRoles,
    setAssignedRoles,
    status,
    aiAnalysisStatus,
    aiAnalysisResult,
    showAiHelp: () => setShowAiHelpModal(true),
    canPromote,
    handlePromote,
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-neutral-500 font-light">Loading workspace...</p>
      </div>
    )
  }

  return (
    <WorkspaceContext.Provider value={contextValue}>
      <div className="flex gap-6 py-8">
        {/* Mini Sidebar Stepper */}
        <div className="w-64 shrink-0 mt-[192px]">
          <Card className="border-neutral-200 rounded-2xl overflow-hidden sticky top-24">
            <CardContent className="p-0">
              {/* Header */}
              <div className={cn("p-5 border-b border-neutral-100", scheme.bg)}>
                {/* Back to Overview - only shown in sub-pages */}
                {currentSection !== "overview" && (
                  <button
                    onClick={() => router.push("/collectoid-v2/delivery-demo/dcm/create/workspace")}
                    className="flex items-center gap-2 text-xs font-light text-neutral-600 hover:text-neutral-900 mb-3 transition-colors"
                  >
                    <ArrowLeft className="size-3" />
                    Back to Overview
                  </button>
                )}
                <h2 className="text-base font-normal text-neutral-900 truncate">
                  {collectionName}
                </h2>
              </div>

              {/* Sections */}
              <div className="p-3">
                <p className="text-xs font-light text-neutral-500 uppercase tracking-wider px-3 mb-2">
                  Sections
                </p>
                <div className="space-y-1">
                  {sections.map((section) => {
                    const isActive = currentSection === section.id
                    const Icon = section.icon

                    return (
                      <button
                        key={section.id}
                        onClick={() => router.push(section.href)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                          isActive
                            ? cn(scheme.bg, "shadow-sm")
                            : "hover:bg-neutral-50"
                        )}
                      >
                        <div className={cn(
                          "flex size-8 items-center justify-center rounded-lg shrink-0",
                          section.isComplete
                            ? cn("bg-gradient-to-br", scheme.from, scheme.to)
                            : isActive
                              ? "bg-white border border-neutral-200"
                              : "bg-neutral-100"
                        )}>
                          {section.isComplete ? (
                            <CheckCircle2 className="size-4 text-white" />
                          ) : (
                            <Icon className={cn(
                              "size-4",
                              isActive
                                ? scheme.from.replace("from-", "text-")
                                : "text-neutral-400"
                            )} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={cn(
                            "text-sm truncate",
                            isActive ? "font-normal text-neutral-900" : "font-light text-neutral-700"
                          )}>
                            {section.title}
                          </p>
                          {section.required && !section.isComplete && section.id !== "overview" && (
                            <p className="text-xs font-light text-red-500">Required</p>
                          )}
                        </div>
                        {isActive && (
                          <ChevronRight className={cn("size-4 shrink-0", scheme.from.replace("from-", "text-"))} />
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Progress & Promote */}
              <div className="p-4 border-t border-neutral-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-light text-neutral-500">
                    {completedRequired}/{totalRequired} required
                  </span>
                  <div className="flex items-center gap-1">
                    {sections.filter(s => s.required).map((section) => (
                      <div
                        key={section.id}
                        className={cn(
                          "size-2 rounded-full transition-all",
                          section.isComplete
                            ? cn("bg-gradient-to-r", scheme.from, scheme.to)
                            : "bg-neutral-200"
                        )}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handlePromote}
                  disabled={!canPromote}
                  className={cn(
                    "w-full rounded-xl font-light transition-all",
                    canPromote
                      ? cn("bg-gradient-to-r text-white shadow-md hover:shadow-lg", scheme.from, scheme.to)
                      : "bg-neutral-100 text-neutral-400"
                  )}
                >
                  Promote to Draft
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>

      {/* AI Help Modal */}
      {showAiHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowAiHelpModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-neutral-200 max-w-lg w-full max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className={cn("p-5 border-b border-neutral-100", scheme.bg)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                    scheme.from, scheme.to
                  )}>
                    <Bot className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-normal text-neutral-900">AI Collection Assistant</h3>
                    <p className="text-xs font-light text-neutral-500">
                      {aiAnalysisStatus === "analyzing" ? "Currently analyzing..." : "Analysis complete"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAiHelpModal(false)}
                  className="flex size-8 items-center justify-center rounded-lg hover:bg-white/50 transition-colors"
                >
                  <X className="size-4 text-neutral-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5 overflow-y-auto max-h-[60vh]">
              {/* What it does */}
              <div>
                <h4 className="text-sm font-normal text-neutral-900 mb-2">What&apos;s happening?</h4>
                <p className="text-sm font-light text-neutral-600 leading-relaxed">
                  Our AI assistant is analyzing your collection title and description to understand your data needs.
                  This happens automatically in the background — you don&apos;t need to wait for it to finish.
                </p>
              </div>

              {/* How it helps */}
              <div>
                <h4 className="text-sm font-normal text-neutral-900 mb-3">How it helps</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200">
                      <Filter className="size-4 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-sm font-normal text-neutral-800">Smart Filters</p>
                      <p className="text-xs font-light text-neutral-500">
                        Pre-selects relevant therapeutic areas, study phases, and data modalities based on your intent
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200">
                      <Search className="size-4 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-sm font-normal text-neutral-800">Dataset Discovery</p>
                      <p className="text-xs font-light text-neutral-500">
                        Powers the AI search on the datasets page with semantic understanding of your goals
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white border border-neutral-200">
                      <Lightbulb className="size-4 text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-sm font-normal text-neutral-800">Activity Suggestions</p>
                      <p className="text-xs font-light text-neutral-500">
                        Recommends permitted activities and usage terms that align with your research objectives
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Current results (if complete) */}
              {aiAnalysisStatus === "complete" && aiAnalysisResult && (
                <div>
                  <h4 className="text-sm font-normal text-neutral-900 mb-3">Analysis Results</h4>
                  <div className={cn("p-4 rounded-xl border", scheme.bg, scheme.from.replace("from-", "border-").replace("500", "200"))}>
                    {aiAnalysisResult.suggestedFilters.therapeuticAreas.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-1.5">Therapeutic Areas</p>
                        <div className="flex flex-wrap gap-1.5">
                          {aiAnalysisResult.suggestedFilters.therapeuticAreas.map((ta) => (
                            <span
                              key={ta}
                              className={cn(
                                "px-2 py-0.5 rounded-md text-xs font-light",
                                scheme.from.replace("from-", "bg-").replace("500", "100"),
                                scheme.from.replace("from-", "text-").replace("500", "700")
                              )}
                            >
                              {ta}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {aiAnalysisResult.suggestedFilters.modalities.length > 0 && (
                      <div className="mb-3">
                        <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-1.5">Data Modalities</p>
                        <div className="flex flex-wrap gap-1.5">
                          {aiAnalysisResult.suggestedFilters.modalities.map((mod) => (
                            <span
                              key={mod}
                              className="px-2 py-0.5 rounded-md text-xs font-light bg-neutral-100 text-neutral-700"
                            >
                              {mod}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {aiAnalysisResult.suggestedKeywords.length > 0 && (
                      <div>
                        <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-1.5">Key Concepts</p>
                        <div className="flex flex-wrap gap-1.5">
                          {aiAnalysisResult.suggestedKeywords.map((kw) => (
                            <span
                              key={kw}
                              className="px-2 py-0.5 rounded-md text-xs font-light bg-white border border-neutral-200 text-neutral-600"
                            >
                              {kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-3 pt-3 border-t border-neutral-200/50 flex items-center justify-between">
                      <span className="text-xs font-light text-neutral-500">Confidence</span>
                      <span className={cn("text-xs font-normal", scheme.from.replace("from-", "text-"))}>
                        {Math.round((aiAnalysisResult.confidence || 0.9) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Analyzing state */}
              {aiAnalysisStatus === "analyzing" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="relative">
                    <Sparkles className="size-5 text-amber-600" />
                    <span className="absolute -top-0.5 -right-0.5 size-2 bg-amber-500 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-normal text-amber-900">Analysis in progress</p>
                    <p className="text-xs font-light text-amber-700">
                      Feel free to continue working — suggestions will appear when ready
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50">
              <p className="text-xs font-light text-neutral-500 text-center">
                AI suggestions are optional — you always have full control over your collection
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Promote to Draft Confirmation Modal */}
      {showPromoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowPromoteModal(false)}
          />

          <div className="relative bg-white rounded-2xl shadow-2xl border border-neutral-200 max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className={cn("p-5 border-b border-neutral-100", scheme.bg)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("flex size-10 items-center justify-center rounded-xl bg-gradient-to-br", scheme.from, scheme.to)}>
                    <ArrowRight className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-base font-normal text-neutral-900">Promote to Draft</h3>
                    <p className="text-xs font-light text-neutral-500">This will make the collection visible to your team</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPromoteModal(false)}
                  className="flex size-8 items-center justify-center rounded-lg hover:bg-white/50 transition-colors"
                >
                  <X className="size-4 text-neutral-500" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Flavour text */}
              <p className="text-sm font-light text-neutral-600 leading-relaxed">
                Promoting to draft makes this collection visible to your team for review and feedback. You&apos;ll still be able to edit everything — this simply moves it out of your private workspace.
              </p>

              {/* Summary */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm py-1.5">
                  <Database className="size-4 text-neutral-400" />
                  <span className="font-light text-neutral-700">Datasets</span>
                  <span className="font-normal text-neutral-900">{selectedDatasets.length} selected</span>
                </div>
                <div>
                  <button
                    onClick={() => setActivitiesExpanded(!activitiesExpanded)}
                    className="flex items-center gap-2 text-sm py-1.5 w-full text-left hover:bg-neutral-50 rounded-lg transition-colors -mx-1 px-1"
                  >
                    <Target className="size-4 text-neutral-400" />
                    <span className="font-light text-neutral-700">Activities</span>
                    <span className="font-normal text-neutral-900">{selectedActivities.length} selected</span>
                    <ChevronDown className={cn("size-3.5 text-neutral-400 ml-auto transition-transform", activitiesExpanded && "rotate-180")} />
                  </button>
                  {activitiesExpanded && selectedActivities.length > 0 && (
                    <div className="ml-6 mt-1 mb-1 space-y-1">
                      {(selectedActivities as unknown as Array<{ id: string; name: string; category: string }>).map((activity) => (
                        <div key={typeof activity === "string" ? activity : activity.id} className="flex items-center gap-2 py-1">
                          <div className={cn("size-1.5 rounded-full bg-gradient-to-r", scheme.from, scheme.to)} />
                          <span className="text-xs font-light text-neutral-600">
                            {typeof activity === "string" ? activity : activity.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Access Breakdown */}
              <div className="pt-3 border-t border-neutral-100">
                <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-3">Access Provisioning Breakdown</p>

                {/* Stacked bar */}
                <div className="h-3 rounded-full overflow-hidden flex mb-3">
                  <div className="bg-emerald-500" style={{ width: `${accessBreakdown.alreadyOpen}%` }} />
                  <div className={cn("bg-gradient-to-r", scheme.from, scheme.to)} style={{ width: `${accessBreakdown.readyToGrant}%` }} />
                  <div className="bg-amber-400" style={{ width: `${accessBreakdown.needsApproval}%` }} />
                  <div className="bg-neutral-300" style={{ width: `${accessBreakdown.missingLocation}%` }} />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-xs font-light text-neutral-600">Already Open</span>
                    <span className="text-xs font-normal text-neutral-900 ml-auto">{accessBreakdown.alreadyOpen}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={cn("size-2.5 rounded-full bg-gradient-to-r shrink-0", scheme.from, scheme.to)} />
                    <span className="text-xs font-light text-neutral-600">Ready to Grant</span>
                    <span className="text-xs font-normal text-neutral-900 ml-auto">{accessBreakdown.readyToGrant}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-amber-400 shrink-0" />
                    <span className="text-xs font-light text-neutral-600">Needs Approval</span>
                    <span className="text-xs font-normal text-neutral-900 ml-auto">{accessBreakdown.needsApproval}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-2.5 rounded-full bg-neutral-300 shrink-0" />
                    <span className="text-xs font-light text-neutral-600">Missing Location</span>
                    <span className="text-xs font-normal text-neutral-900 ml-auto">{accessBreakdown.missingLocation}%</span>
                  </div>
                </div>
              </div>

              {/* Conflicts */}
              {conflicts.length > 0 && (
                <div className="pt-3 border-t border-neutral-100">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="size-3.5 text-amber-500" />
                    <p className="text-xs font-normal text-amber-700">Potential Issues</p>
                  </div>
                  <div className="space-y-1.5">
                    {conflicts.map((conflict, i) => (
                      <p key={i} className="text-xs font-light text-neutral-600 pl-5">
                        {conflict}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-neutral-100 flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPromoteModal(false)}
                className="flex-1 rounded-xl font-light border-neutral-200 h-10"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmPromote}
                className={cn("flex-1 rounded-xl font-light bg-gradient-to-r text-white h-10 shadow-md hover:shadow-lg", scheme.from, scheme.to)}
              >
                Confirm &amp; Promote
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </WorkspaceContext.Provider>
  )
}

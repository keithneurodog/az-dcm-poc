"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { AgreementOfTerms } from "@/lib/dcm-mock-data"

// Activity name lookup
const ACTIVITY_NAMES: Record<string, string> = {
  "cross-study": "Cross-Study Learning",
  "publications": "Scientific Publications",
  "biomarker": "Biomarker Identification",
  "drug-dev": "Drug Development Support",
  "regulatory": "Regulatory Submissions",
  "diagnostic": "Diagnostic Development",
  "safety-monitoring": "Safety Monitoring",
  "signal-detection": "Signal Detection",
  "ai-analytics": "AI Analytics",
  "ai-training": "AI Model Development & Training",
  "cohort-builder": "Cohort Identification",
}

// Role group name lookup
const ROLE_GROUP_NAMES: Record<string, { name: string; members: number }> = {
  "rg-onc-bio": { name: "Oncology Biometrics", members: 45 },
  "rg-onc-ds": { name: "Oncology Data Science", members: 62 },
  "rg-cvrm": { name: "CVRM Analytics", members: 28 },
  "rg-neuro": { name: "Neuroscience Research", members: 19 },
  "rg-ri-bio": { name: "R&I Biometrics", members: 34 },
  "rg-vi-stats": { name: "V&I Statistics", members: 22 },
  "rg-data-eng": { name: "Data Engineering", members: 41 },
  "rg-bioinformatics": { name: "Bioinformatics", members: 27 },
  "rg-stat-prog": { name: "Statistical Programming", members: 53 },
  "rg-cpqp": { name: "Clinical Pharmacology", members: 18 },
  "rg-pdp-team": { name: "PDP Platform Team", members: 12 },
  "rg-immuta-admins": { name: "Immuta Administrators", members: 8 },
  "rg-starburst-users": { name: "Starburst Platform Users", members: 156 },
}

const PRIMARY_USE_LABELS: Record<string, string> = {
  understandDrugMechanism: "Understand how drugs work",
  understandDisease: "Better understand disease",
  developDiagnosticTests: "Develop diagnostic tests",
  learnFromPastStudies: "Learn from past studies",
  improveAnalysisMethods: "Improve analysis methods",
}
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { useWorkspace } from "./layout"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  Database,
  Target,
  Shield,
  Users,
  Sparkles,
  FileEdit,
  ChevronRight,
  AlertCircle,
  Edit3,
  Layers,
  Copy,
  Check,
  Share2,
  ArrowRight,
  Calendar,
  Beaker,
  MapPin,
  ChevronDown as ChevronDownIcon,
} from "lucide-react"

interface SectionCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  status: "empty" | "complete"
  required: boolean
  count?: number
  href: string
}

// Variation C helper component
function SummaryStrip({
  scheme,
  datasets,
  patients,
  activities,
  activityNames,
  accessGroups,
  roleDetails,
  totalMembers,
  therapeuticAreas,
  phases,
  modalities,
  hasTerms,
  terms,
  termsSummary,
  createdAt,
}: {
  scheme: ReturnType<typeof useColorScheme>["scheme"]
  datasets: number
  patients: number
  activities: number
  activityNames: string[]
  accessGroups: number
  roleDetails: { name: string; members: number }[]
  totalMembers: number
  therapeuticAreas: string[]
  phases: string[]
  modalities: string[]
  hasTerms: boolean
  terms: AgreementOfTerms | null
  termsSummary: string[]
  createdAt: string | null
}) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Card className="border-neutral-200 rounded-2xl overflow-hidden">
      <CardContent className="p-0">
        {/* Collapsed strip */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-neutral-50 transition-colors"
        >
          <div className="flex items-center gap-6 text-sm font-light text-neutral-700">
            <span className="flex items-center gap-1.5">
              <Database className="size-3.5 text-neutral-400" />
              <span className="font-normal">{datasets}</span> datasets
            </span>
            <span className="flex items-center gap-1.5">
              <Target className="size-3.5 text-neutral-400" />
              <span className="font-normal">{activities}</span> activities
            </span>
            {therapeuticAreas.length > 0 && (
              <span className="flex items-center gap-1.5">
                <Beaker className="size-3.5 text-neutral-400" />
                <span className="font-normal">{therapeuticAreas.length}</span> TA{therapeuticAreas.length !== 1 ? "s" : ""}
              </span>
            )}
            {accessGroups > 0 && (
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5 text-neutral-400" />
                <span className="font-normal">{accessGroups}</span> groups
              </span>
            )}
            {hasTerms && (
              <span className="flex items-center gap-1.5 text-neutral-400">
                <Shield className="size-3.5" />
                Terms set
              </span>
            )}
          </div>
          <ChevronDownIcon className={cn("size-4 text-neutral-400 transition-transform", expanded && "rotate-180")} />
        </button>

        {/* Expanded detail */}
        {expanded && (
          <div className="px-6 pb-5 pt-1 border-t border-neutral-100">
            <div className="flex flex-wrap gap-x-8 gap-y-4 mt-3">
              {patients > 0 && (
                <div>
                  <p className="text-xs font-light text-neutral-400 uppercase tracking-wider mb-1">Patients</p>
                  <p className="text-sm font-light text-neutral-700">{patients.toLocaleString()}</p>
                </div>
              )}
              {therapeuticAreas.length > 0 && (
                <div>
                  <p className="text-xs font-light text-neutral-400 uppercase tracking-wider mb-1">Therapeutic Areas</p>
                  <div className="flex flex-wrap gap-1">
                    {therapeuticAreas.map(ta => (
                      <span key={ta} className={cn("text-xs font-light px-2 py-0.5 rounded-md", scheme.bg, scheme.from.replace("from-", "text-").replace("500", "700"))}>{ta}</span>
                    ))}
                  </div>
                </div>
              )}
              {phases.length > 0 && (
                <div>
                  <p className="text-xs font-light text-neutral-400 uppercase tracking-wider mb-1">Phases</p>
                  <div className="flex flex-wrap gap-1">
                    {phases.map(p => (
                      <span key={p} className="text-xs font-light text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">{p}</span>
                    ))}
                  </div>
                </div>
              )}
              {modalities.length > 0 && (
                <div>
                  <p className="text-xs font-light text-neutral-400 uppercase tracking-wider mb-1">Modalities</p>
                  <div className="flex flex-wrap gap-1">
                    {modalities.map(m => (
                      <span key={m} className="text-xs font-light text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">{m}</span>
                    ))}
                  </div>
                </div>
              )}
              {/* Activities list */}
              {activityNames.length > 0 && (
                <div>
                  <p className="text-xs font-light text-neutral-400 uppercase tracking-wider mb-1">Activities</p>
                  <div className="space-y-0.5">
                    {activityNames.map(name => (
                      <div key={name} className="flex items-center gap-2 text-xs font-light text-neutral-600">
                        <div className={cn("size-1.5 rounded-full", scheme.from.replace("from-", "bg-"))} />
                        {name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Terms summary */}
              {terms && termsSummary.length > 0 && (
                <div>
                  <p className="text-xs font-light text-neutral-400 uppercase tracking-wider mb-1">Data Use Terms</p>
                  <div className="space-y-0.5">
                    {termsSummary.map(line => (
                      <div key={line} className="flex items-start gap-2 text-xs font-light text-neutral-600">
                        <CheckCircle2 className="size-3 text-green-500 shrink-0 mt-0.5" />
                        {line}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {/* Access groups */}
              {roleDetails.length > 0 && (
                <div>
                  <p className="text-xs font-light text-neutral-400 uppercase tracking-wider mb-1">Access Groups</p>
                  <div className="space-y-0.5">
                    {roleDetails.map(role => (
                      <div key={role.name} className="flex items-center justify-between gap-4 text-xs font-light">
                        <span className="text-neutral-600">{role.name}</span>
                        <span className="text-neutral-400">{role.members}</span>
                      </div>
                    ))}
                    <div className="border-t border-neutral-100 pt-1 mt-1 flex items-center justify-between text-xs font-normal">
                      <span className="text-neutral-700">Total</span>
                      <span className="text-neutral-700">{totalMembers}</span>
                    </div>
                  </div>
                </div>
              )}
              {createdAt && (
                <div>
                  <p className="text-xs font-light text-neutral-400 uppercase tracking-wider mb-1">Created</p>
                  <p className="text-sm font-light text-neutral-700">{new Date(createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function WorkspaceOverviewPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const workspace = useWorkspace()

  // Local editing state
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [localName, setLocalName] = useState(workspace.collectionName)
  const [localDescription, setLocalDescription] = useState(workspace.description)

  // Share state
  const [showShareLink, setShowShareLink] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [collectionId] = useState(() => `concept-${Date.now().toString(36)}`)

  const shareLink = typeof window !== "undefined"
    ? `${window.location.origin}/collectoid-v2/share/${collectionId}`
    : ""

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = shareLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  const saveDetails = () => {
    workspace.setCollectionName(localName)
    workspace.setDescription(localDescription)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_collection_name", localName)
      sessionStorage.setItem("dcm_collection_description", localDescription)
    }
    setIsEditingDetails(false)
  }

  // Section cards (not including Overview since that's the current page)
  const sections: SectionCard[] = [
    {
      id: "datasets",
      title: "Datasets",
      description: workspace.selectedDatasets.length > 0
        ? `${workspace.selectedDatasets.length} dataset${workspace.selectedDatasets.length !== 1 ? 's' : ''} selected`
        : "Add datasets from browse or AI search",
      icon: Database,
      status: workspace.selectedDatasets.length > 0 ? "complete" : "empty",
      required: true,
      count: workspace.selectedDatasets.length,
      href: "/collectoid-v2/dcm/create/workspace/datasets",
    },
    {
      id: "activities",
      title: "Activities & Purpose",
      description: workspace.selectedActivities.length > 0
        ? `${workspace.selectedActivities.length} activit${workspace.selectedActivities.length !== 1 ? 'ies' : 'y'} defined`
        : "Define how data will be used",
      icon: Target,
      status: workspace.selectedActivities.length > 0 ? "complete" : "empty",
      required: true,
      count: workspace.selectedActivities.length,
      href: "/collectoid-v2/dcm/create/workspace/activities",
    },
    {
      id: "terms",
      title: "Data Use Terms",
      description: workspace.hasAgreementOfTerms
        ? "Terms configured"
        : "Set usage permissions and restrictions",
      icon: Shield,
      status: workspace.hasAgreementOfTerms ? "complete" : "empty",
      required: true,
      href: "/collectoid-v2/dcm/create/workspace/terms",
    },
    {
      id: "roles",
      title: "Access & Users",
      description: workspace.assignedRoles.length > 0
        ? `${workspace.assignedRoles.length} group${workspace.assignedRoles.length !== 1 ? 's' : ''}/users selected`
        : "Define who can access this data",
      icon: Users,
      status: workspace.assignedRoles.length > 0 ? "complete" : "empty",
      required: true,
      count: workspace.assignedRoles.length > 0 ? workspace.assignedRoles.length : undefined,
      href: "/collectoid-v2/dcm/create/workspace/roles",
    },
  ]

  const completedRequired = sections.filter(s => s.required && s.status === "complete").length
  const totalRequired = sections.filter(s => s.required).length
  const canSubmit = completedRequired === totalRequired

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className={cn(
            "inline-flex items-center justify-center size-16 rounded-2xl mb-6 bg-gradient-to-br",
            scheme.from,
            scheme.to
          )}
        >
          <Layers className="size-8 text-white" />
        </div>
        <h1 className="text-3xl font-extralight text-neutral-900 mb-3 tracking-tight">
          Collection Overview
        </h1>
        <p className="text-base font-light text-neutral-600">
          Build your collection by completing each section
        </p>
      </div>

      {/* Concept Stage Banner */}
      <div className={cn("rounded-2xl border p-5 mb-8", scheme.bg, scheme.from.replace("from-", "border-").replace("500", "100"))}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("flex size-11 items-center justify-center rounded-xl bg-gradient-to-br", scheme.from, scheme.to)}>
              <FileEdit className="size-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-normal text-neutral-900">
                {workspace.status === "concept" ? "Concept Stage" : "Draft Stage"}
              </span>
              <span className="text-sm font-light text-neutral-500 ml-2">
                — {workspace.status === "concept" ? "private workspace, only visible to you" : "visible to team members"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareLink(!showShareLink)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-light transition-all",
                showShareLink
                  ? cn("text-white", "bg-gradient-to-r", scheme.from, scheme.to)
                  : cn("text-neutral-600 hover:text-neutral-900 hover:bg-white/50")
              )}
            >
              <Share2 className="size-3.5" />
              <span>Share Link</span>
            </button>
          </div>
        </div>

        {/* Share Link Expanded */}
        {showShareLink && (
          <div className="mt-4 pt-4 border-t border-neutral-200/50">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  value={shareLink}
                  readOnly
                  className="h-10 pr-24 bg-white/80 border-neutral-200 rounded-xl font-mono text-xs text-neutral-600"
                />
                <button
                  onClick={handleCopyLink}
                  className={cn(
                    "absolute right-1 top-1 h-8 px-3 rounded-lg text-xs font-light flex items-center gap-1.5 transition-all",
                    linkCopied
                      ? "bg-green-500 text-white"
                      : cn("text-white bg-gradient-to-r", scheme.from, scheme.to, "hover:shadow-md")
                  )}
                >
                  {linkCopied ? (
                    <>
                      <Check className="size-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs font-light text-neutral-500 mt-2">
              Anyone with this link can view your concept (read-only). They won&apos;t be able to edit.
            </p>
          </div>
        )}
      </div>

      {/* Collection Title & Description */}
      {isEditingDetails ? (
        <div className="pb-8 border-b border-neutral-200 mb-8">
          <div className="space-y-5 max-w-xl mx-auto">
            <div>
              <label className="block text-xs font-light text-neutral-500 uppercase tracking-wider mb-2 text-center">
                Collection Title
              </label>
              <Input
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="h-12 border-neutral-200 rounded-xl font-light text-xl text-center"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-light text-neutral-500 uppercase tracking-wider mb-2 text-center">
                Description
              </label>
              <Textarea
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
                rows={2}
                placeholder="Add a brief description of this collection's purpose..."
                className="border-neutral-200 rounded-xl font-light text-base resize-none text-center"
              />
            </div>
            <div className="flex gap-3 pt-1 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLocalName(workspace.collectionName)
                  setLocalDescription(workspace.description)
                  setIsEditingDetails(false)
                }}
                className="rounded-lg font-light border-neutral-200 h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={saveDetails}
                className={cn("rounded-lg font-light bg-gradient-to-r text-white h-9", scheme.from, scheme.to)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="group pb-8 border-b border-neutral-200 mb-8 cursor-pointer relative text-center"
          onClick={() => setIsEditingDetails(true)}
        >
          <h2 className="text-2xl font-normal text-neutral-900 tracking-tight mb-2">
            {workspace.collectionName}
          </h2>
          {workspace.description ? (
            <p className="text-base font-light text-neutral-500 leading-relaxed max-w-xl mx-auto">{workspace.description}</p>
          ) : (
            <p className="text-base font-light text-neutral-400 italic">Click to add a description...</p>
          )}
          {/* Edit icon - only visible on hover */}
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-light transition-all",
              "bg-neutral-100 text-neutral-600"
            )}>
              <Edit3 className="size-3.5" />
              Edit
            </div>
          </div>
        </div>
      )}

      {/* Concept Summary */}
      {(() => {
        const therapeuticAreas = [...new Set(workspace.selectedDatasets.flatMap(d => d.therapeuticArea))]
        const phases = [...new Set(workspace.selectedDatasets.map(d => d.phase))]
        const modalities = [...new Set(workspace.selectedDatasets.flatMap(d => d.modalities || []))]
        const totalPatients = workspace.selectedDatasets.reduce((sum, d) => sum + (d.patientCount || 0), 0)
        const createdAt = typeof window !== "undefined" ? sessionStorage.getItem("dcm_concept_created") : null
        const hasContent = workspace.selectedDatasets.length > 0 || workspace.selectedActivities.length > 0

        // Parse terms from sessionStorage
        const termsRaw = typeof window !== "undefined" ? sessionStorage.getItem("dcm_agreement_of_terms") : null
        const terms: AgreementOfTerms | null = termsRaw ? JSON.parse(termsRaw) : null

        // Resolve activity names — handle both string IDs and full activity objects from sessionStorage
        const activityNames = workspace.selectedActivities.map(item => {
          if (typeof item === "string") return ACTIVITY_NAMES[item] || item
          const obj = item as unknown as { id?: string; name?: string }
          return obj.name || ACTIVITY_NAMES[obj.id || ""] || obj.id || "Unknown"
        })

        // Resolve role group names — handle both string IDs and full objects from sessionStorage
        const roleDetails = workspace.assignedRoles.map(item => {
          if (typeof item === "string") return ROLE_GROUP_NAMES[item] || { name: item, members: 0 }
          const obj = item as unknown as { id?: string; name?: string; memberCount?: number }
          return { name: obj.name || obj.id || "Unknown", members: obj.memberCount || 0 }
        })
        const totalMembers = roleDetails.reduce((sum, r) => sum + r.members, 0)

        // Build terms summary lines
        const termsSummary: string[] = []
        if (terms) {
          const enabledPrimary = Object.entries(terms.primaryUse).filter(([, v]) => v).map(([k]) => PRIMARY_USE_LABELS[k] || k)
          if (enabledPrimary.length > 0) termsSummary.push(`Primary use: ${enabledPrimary.join(", ")}`)
          if (terms.beyondPrimaryUse.aiResearch) termsSummary.push("Train AI/ML models")
          if (terms.beyondPrimaryUse.storeInAiMlModel) termsSummary.push("Store data in AI/ML model")
          if (terms.beyondPrimaryUse.softwareDevelopment) termsSummary.push("Software development")
          if (terms.publication.externalPublication === true) termsSummary.push("External publication allowed")
          else if (terms.publication.externalPublication === "by_exception") termsSummary.push("External publication by exception")
          if (terms.externalSharing.allowed) termsSummary.push("External sharing allowed")
        }

        if (!hasContent) return null

        return (
          <div className="mb-8">
            <SummaryStrip
              scheme={scheme}
              datasets={workspace.selectedDatasets.length}
              patients={totalPatients}
              activities={workspace.selectedActivities.length}
              activityNames={activityNames}
              accessGroups={workspace.assignedRoles.length}
              roleDetails={roleDetails}
              totalMembers={totalMembers}
              therapeuticAreas={therapeuticAreas}
              phases={phases}
              modalities={modalities}
              hasTerms={workspace.hasAgreementOfTerms}
              terms={terms}
              termsSummary={termsSummary}
              createdAt={createdAt}
            />
          </div>
        )
      })()}

      {/* AI Analysis Banner */}
      {workspace.description && (
        <button
          onClick={workspace.showAiHelp}
          className={cn(
            "w-full mb-8 flex items-center gap-4 p-4 rounded-2xl text-left transition-all relative overflow-hidden",
            workspace.aiAnalysisStatus === "analyzing"
              ? "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 shadow-sm"
              : workspace.aiAnalysisStatus === "complete"
                ? cn("border shadow-sm", scheme.bg, scheme.from.replace("from-", "border-").replace("500", "200"))
                : "bg-neutral-50 border border-neutral-200"
          )}
        >
          {/* Animated shimmer while analyzing */}
          {workspace.aiAnalysisStatus === "analyzing" && (
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          )}

          <div className="relative">
            {workspace.aiAnalysisStatus === "analyzing" ? (
              <div className="relative">
                <div className="size-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                  <Sparkles className="size-6 text-white animate-pulse" />
                </div>
                <span className="absolute -top-1 -right-1 size-3 bg-amber-500 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 size-3 bg-amber-400 rounded-full" />
              </div>
            ) : workspace.aiAnalysisStatus === "complete" ? (
              <div className={cn("size-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md", scheme.from, scheme.to)}>
                <CheckCircle2 className="size-6 text-white" />
              </div>
            ) : (
              <div className="size-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                <Sparkles className="size-6 text-neutral-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 relative">
            <p className={cn(
              "text-base font-normal",
              workspace.aiAnalysisStatus === "analyzing"
                ? "text-amber-900"
                : workspace.aiAnalysisStatus === "complete"
                  ? "text-neutral-900"
                  : "text-neutral-700"
            )}>
              {workspace.aiAnalysisStatus === "analyzing"
                ? "AI is analyzing your collection intent..."
                : workspace.aiAnalysisStatus === "complete"
                  ? "AI suggestions are ready"
                  : "AI assistance available"
              }
            </p>
            <p className={cn(
              "text-sm font-light mt-0.5",
              workspace.aiAnalysisStatus === "analyzing"
                ? "text-amber-700"
                : workspace.aiAnalysisStatus === "complete"
                  ? scheme.from.replace("from-", "text-").replace("500", "600")
                  : "text-neutral-500"
            )}>
              {workspace.aiAnalysisStatus === "analyzing"
                ? "Preparing smart filters and dataset recommendations"
                : workspace.aiAnalysisStatus === "complete"
                  ? "Click to view suggested filters, keywords, and insights"
                  : "Add a description to enable AI assistance"
              }
            </p>
          </div>

          {workspace.aiAnalysisStatus === "complete" && (
            <ChevronRight className={cn("size-5 shrink-0", scheme.from.replace("from-", "text-"))} />
          )}
        </button>
      )}

      {/* Section Cards */}
      <div className="space-y-4 mb-8">
        {sections.map((section) => {
          const isComplete = section.status === "complete"

          // All section cards use consistent layout
          return (
            <Card
              key={section.id}
              className={cn(
                "group border rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-md min-h-[88px]",
                isComplete
                  ? cn("border-2", scheme.from.replace("from-", "border-").replace("500", "200"))
                  : "border-neutral-200 hover:border-neutral-300"
              )}
              onClick={() => router.push(section.href)}
            >
              <CardContent className="p-5 h-full">
                <div className="flex items-start justify-between h-full">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex size-12 items-center justify-center rounded-xl shrink-0",
                      isComplete
                        ? cn("bg-gradient-to-br", scheme.from, scheme.to)
                        : "bg-neutral-100 border border-neutral-200"
                    )}>
                      <section.icon className={cn("size-5", isComplete ? "text-white" : "text-neutral-500")} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-normal text-neutral-900">
                          {section.title}
                        </h3>
                        {section.required && section.status === "empty" && (
                          <Badge variant="outline" className="text-xs font-light border-red-200 text-red-600 bg-red-50">
                            Required
                          </Badge>
                        )}
                        {isComplete && (
                          <CheckCircle2 className={cn("size-4", scheme.from.replace("from-", "text-"))} />
                        )}
                        {section.count !== undefined && section.count > 0 && (
                          <Badge variant="secondary" className={cn("text-xs font-light border-0", scheme.bg, scheme.from.replace("from-", "text-").replace("500", "700"))}>
                            {section.count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-light text-neutral-500">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {isComplete ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-light bg-neutral-100 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="size-3.5" />
                        Edit
                      </div>
                    ) : (
                      <ChevronRight className="size-5 text-neutral-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI Suggestion Card */}
      {workspace.selectedDatasets.length === 0 && (
        <Card className={cn("border rounded-2xl overflow-hidden mb-8", scheme.from.replace("from-", "border-").replace("500", "200"), scheme.bg)}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn("flex size-12 items-center justify-center rounded-xl bg-gradient-to-br", scheme.from, scheme.to)}>
                <Sparkles className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-normal text-neutral-900 mb-1">
                  Need help finding datasets?
                </h3>
                <p className="text-sm font-light text-neutral-600 mb-4">
                  Our AI can analyze your description and suggest relevant datasets from our catalog.
                </p>
                <Button
                  onClick={() => router.push("/collectoid-v2/discover/ai")}
                  className={cn("rounded-xl font-light bg-gradient-to-r text-white", scheme.from, scheme.to)}
                >
                  <Sparkles className="size-4 mr-2" />
                  Try AI-Assisted Discovery
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Card */}
      {!canSubmit ? (
        <Card className="border-neutral-200 bg-neutral-50 rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-200">
                <AlertCircle className="size-5 text-neutral-600" />
              </div>
              <div>
                <h3 className="text-sm font-normal text-neutral-900 mb-1">
                  Complete required sections to continue
                </h3>
                <p className="text-sm font-light text-neutral-600">
                  Add datasets, define activities, and set data use terms to promote this concept to a full draft.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className={cn("border rounded-2xl overflow-hidden", scheme.from.replace("from-", "border-").replace("500", "200"), scheme.bg)}>
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className={cn("flex size-10 items-center justify-center rounded-xl bg-gradient-to-br shrink-0", scheme.from, scheme.to)}>
                <CheckCircle2 className="size-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-normal text-neutral-900 mb-1">
                  Ready to promote to draft
                </h3>
                <p className="text-sm font-light text-neutral-600">
                  Your concept is complete! Promote it to enable discussions, timeline tracking, and collaboration.
                </p>
              </div>
              <Button
                onClick={workspace.handlePromote}
                className={cn("shrink-0 rounded-xl font-light bg-gradient-to-r text-white", scheme.from, scheme.to)}
              >
                Promote to Draft
                <ArrowRight className="size-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

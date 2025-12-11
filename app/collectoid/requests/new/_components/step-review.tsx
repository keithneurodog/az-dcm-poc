"use client"

import { useState, useMemo, useEffect, memo, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRequestFlow } from "./request-context"
import { useColorScheme } from "@/app/collectoid/_components"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import {
  ArrowLeft,
  Send,
  Loader2,
  Database,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Info,
  RotateCcw,
  Shield,
  Check,
  Lightbulb,
  Settings2,
  Eye,
  Calendar,
  Plus,
  Search,
  ArrowUpDown,
  Users,
  MapPin,
  FlaskConical,
  Filter,
  Sparkles,
  ArrowRightLeft,
  Ban,
  FileWarning,
  Lock,
  Building2,
  Target,
  User,
  Layers,
} from "lucide-react"
import type { Dataset } from "@/lib/dcm-mock-data"
import { MOCK_DATASETS } from "@/lib/dcm-mock-data"

// Status configuration
const STATUS_CONFIG = {
  open: { label: "Open", color: "bg-emerald-500", textColor: "text-emerald-700", bgColor: "bg-emerald-50" },
  ready: { label: "Ready", color: "bg-blue-500", textColor: "text-blue-700", bgColor: "bg-blue-50" },
  approval: { label: "Approval", color: "bg-amber-500", textColor: "text-amber-700", bgColor: "bg-amber-50" },
}

type SortField = "name" | "patients" | "status" | "phase" | "access" | "eta"
type SortDirection = "asc" | "desc"
type StatusFilter = "all" | "open" | "ready" | "approval"

// Get status from dataset
function getDatasetStatus(dataset: Dataset): keyof typeof STATUS_CONFIG {
  const { alreadyOpen, readyToGrant, needsApproval } = dataset.accessBreakdown
  if (alreadyOpen >= 50) return "open"
  if (readyToGrant >= 30) return "ready"
  return "approval" // Default to approval for anything else
}

// Get estimated weeks for a dataset
function getEstimatedWeeks(dataset: Dataset): number {
  const status = getDatasetStatus(dataset)
  if (status === "open") return 0
  if (status === "ready") return 0
  return 2 // approval
}

// Memoized RAG Bar component
const RAGBar = memo(function RAGBar({
  open,
  ready,
  approval,
  schemeFrom,
  schemeTo,
}: {
  open: number
  ready: number
  approval: number
  schemeFrom: string
  schemeTo: string
}) {
  return (
    <div className="flex h-2 rounded-full overflow-hidden bg-neutral-100">
      <div className="bg-emerald-500 transition-all duration-300 ease-out" style={{ width: `${open}%` }} />
      <div className={cn("bg-gradient-to-r transition-all duration-300 ease-out", schemeFrom, schemeTo)} style={{ width: `${ready}%` }} />
      <div className="bg-amber-500 transition-all duration-300 ease-out" style={{ width: `${approval}%` }} />
    </div>
  )
})

// Intent editor panel component
function IntentEditorPanel({ onClose }: { onClose: () => void }) {
  const { scheme } = useColorScheme()
  const { intent, updateIntent, previewIntent, setPreviewIntent, previewMatchingResult, activeMatchingResult } = useRequestFlow()

  useEffect(() => {
    setPreviewIntent({ ...intent })
    return () => setPreviewIntent(null)
  }, [])

  const currentIntent = previewIntent || intent

  const togglePrimaryUse = (key: keyof typeof currentIntent.primaryUse) => {
    setPreviewIntent({ ...currentIntent, primaryUse: { ...currentIntent.primaryUse, [key]: !currentIntent.primaryUse[key] } })
  }

  const toggleBeyondPrimary = (key: keyof typeof currentIntent.beyondPrimaryUse) => {
    setPreviewIntent({ ...currentIntent, beyondPrimaryUse: { ...currentIntent.beyondPrimaryUse, [key]: !currentIntent.beyondPrimaryUse[key] } })
  }

  const togglePublication = (key: keyof typeof currentIntent.publication) => {
    setPreviewIntent({ ...currentIntent, publication: { ...currentIntent.publication, [key]: !currentIntent.publication[key] } })
  }

  const currentStats = useMemo(() => {
    if (!activeMatchingResult) return { maxWeeks: 0 }
    return { maxWeeks: activeMatchingResult.summary.estimatedFullAccessWeeks }
  }, [activeMatchingResult])

  const previewStats = useMemo(() => {
    if (!previewMatchingResult) return currentStats
    return { maxWeeks: previewMatchingResult.summary.estimatedFullAccessWeeks }
  }, [previewMatchingResult, currentStats])

  const hasChanges = previewIntent && JSON.stringify(previewIntent) !== JSON.stringify(intent)
  const timelineDelta = previewStats.maxWeeks - currentStats.maxWeeks

  const applyChanges = () => {
    if (previewIntent) updateIntent(previewIntent)
    onClose()
  }

  const primaryUseOptions = [
    { key: "understandDrugMechanism" as const, label: "Drug mechanism" },
    { key: "understandDisease" as const, label: "Disease research" },
    { key: "developDiagnosticTests" as const, label: "Diagnostics" },
    { key: "learnFromPastStudies" as const, label: "Past studies" },
    { key: "improveAnalysisMethods" as const, label: "Methods" },
  ]

  const beyondPrimaryOptions = [
    { key: "aiResearch" as const, label: "AI/ML Research" },
    { key: "softwareDevelopment" as const, label: "Software Dev" },
  ]

  const publicationOptions = [
    { key: "internalOnly" as const, label: "Internal Only" },
    { key: "externalPublication" as const, label: "External Publish" },
  ]

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-lg overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-neutral-100 bg-neutral-50">
        <div className="flex items-center gap-2">
          <Settings2 className="size-4 text-neutral-500" />
          <span className="text-sm font-medium text-neutral-900">Edit Intent</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} className="h-7 w-7 p-0 rounded-full">
          <X className="size-4" />
        </Button>
      </div>

      {hasChanges && (
        <div className={cn(
          "px-4 py-2 border-b flex items-center justify-between text-xs",
          timelineDelta < 0 ? "bg-emerald-50 border-emerald-100" : timelineDelta > 0 ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"
        )}>
          <div className="flex items-center gap-2">
            <Eye className="size-3 text-neutral-500" />
            <span className="font-light text-neutral-600">Preview:</span>
            {timelineDelta < 0 && <span className="text-emerald-700 font-medium">{Math.abs(timelineDelta)} weeks faster</span>}
            {timelineDelta > 0 && <span className="text-amber-700 font-medium">+{timelineDelta} weeks</span>}
            {timelineDelta === 0 && <span className="text-blue-700">No change</span>}
          </div>
        </div>
      )}

      <div className="p-4 space-y-4 max-h-64 overflow-auto">
        <div>
          <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-2">Primary Use</p>
          <div className="flex flex-wrap gap-1.5">
            {primaryUseOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => togglePrimaryUse(option.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light transition-all border",
                  currentIntent.primaryUse[option.key]
                    ? cn("bg-gradient-to-r text-white border-transparent", scheme.from, scheme.to)
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                )}
              >
                {currentIntent.primaryUse[option.key] && <Check className="size-3" />}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-2">Beyond Primary <span className="text-amber-600">(adds time)</span></p>
          <div className="flex flex-wrap gap-1.5">
            {beyondPrimaryOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => toggleBeyondPrimary(option.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light transition-all border",
                  currentIntent.beyondPrimaryUse[option.key]
                    ? cn("bg-gradient-to-r text-white border-transparent", scheme.from, scheme.to)
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                )}
              >
                {currentIntent.beyondPrimaryUse[option.key] && <Check className="size-3" />}
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-2">Publication</p>
          <div className="flex flex-wrap gap-1.5">
            {publicationOptions.map((option) => (
              <button
                key={option.key}
                onClick={() => togglePublication(option.key)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light transition-all border",
                  currentIntent.publication[option.key]
                    ? cn("bg-gradient-to-r text-white border-transparent", scheme.from, scheme.to)
                    : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300"
                )}
              >
                {currentIntent.publication[option.key] && <Check className="size-3" />}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 p-3 border-t border-neutral-100 bg-neutral-50">
        <Button variant="ghost" size="sm" onClick={onClose} className="text-xs font-light rounded-full h-8">Cancel</Button>
        <Button
          size="sm"
          onClick={applyChanges}
          disabled={!hasChanges}
          className={cn("text-xs font-light rounded-full h-8", hasChanges ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to) : "bg-neutral-100 text-neutral-400")}
        >
          Apply Changes
        </Button>
      </div>
    </div>
  )
}

// AI Insights Panel - Collapsible panel with intent-matched suggestions
function AIInsightsPanel({
  onAddDataset,
  onDismiss,
}: {
  onAddDataset: (dataset: Dataset) => void
  onDismiss: () => void
}) {
  const { scheme } = useColorScheme()
  const { intent, selectedDatasets } = useRequestFlow()
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Find alternative open/ready datasets based on intent matching (vector-style simulation)
  const suggestions = useMemo(() => {
    const selectedTAs = new Set<string>()
    const selectedPhases = new Set<string>()
    selectedDatasets.forEach(d => {
      d.therapeuticArea.forEach(ta => selectedTAs.add(ta))
      selectedPhases.add(d.phase)
    })

    // Get intent keywords for matching
    const intentKeywords: string[] = []
    if (intent.primaryUse.understandDrugMechanism) intentKeywords.push("mechanism", "pharmacology")
    if (intent.primaryUse.understandDisease) intentKeywords.push("disease", "pathology")
    if (intent.primaryUse.developDiagnosticTests) intentKeywords.push("diagnostic", "biomarker")
    if (intent.primaryUse.learnFromPastStudies) intentKeywords.push("retrospective", "historical")
    if (intent.primaryUse.improveAnalysisMethods) intentKeywords.push("methodology", "analysis")

    return MOCK_DATASETS
      .filter(d => {
        // Not already selected
        if (selectedDatasets.some(sd => sd.id === d.id)) return false
        // Must be open or ready
        const status = getDatasetStatus(d)
        if (status !== "open" && status !== "ready") return false
        // Should match therapeutic area or phase
        const matchesTA = d.therapeuticArea.some(ta => selectedTAs.has(ta))
        const matchesPhase = selectedPhases.has(d.phase)
        return matchesTA || matchesPhase
      })
      .map(d => {
        // Calculate similarity score (mock vector similarity)
        let score = 0
        if (d.therapeuticArea.some(ta => selectedTAs.has(ta))) score += 40
        if (selectedPhases.has(d.phase)) score += 20
        // Boost for matching intent keywords in name/description
        const nameLower = d.name.toLowerCase()
        intentKeywords.forEach(kw => {
          if (nameLower.includes(kw)) score += 15
        })
        // Boost for higher patient count
        score += Math.min(20, d.patientCount / 500)
        // Boost for more open access
        score += d.accessBreakdown.alreadyOpen / 5

        return { dataset: d, score, status: getDatasetStatus(d) }
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 4)
  }, [selectedDatasets, intent])

  if (suggestions.length === 0) return null

  return (
    <div className="rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50 overflow-hidden">
      {/* Header - always visible */}
      <div
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-purple-100/30 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
            <Sparkles className="size-3 text-white" />
          </div>
          <span className="text-sm font-medium text-neutral-800">AI Suggestions</span>
          <Badge className="text-[10px] bg-purple-100 text-purple-700 border-0">{suggestions.length} found</Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="h-6 w-6 p-0 rounded-full text-neutral-400 hover:text-neutral-600"
          >
            <X className="size-3" />
          </Button>
          <ChevronDown className={cn("size-4 text-neutral-400 transition-transform", isCollapsed && "-rotate-180")} />
        </div>
      </div>

      {/* Content - collapsible */}
      {!isCollapsed && (
        <div className="px-3 pb-3 border-t border-purple-100">
          <p className="text-xs text-neutral-500 font-light mt-2 mb-2">
            Based on your intent, we found additional open datasets you might want to include:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {suggestions.map(({ dataset, status }) => (
              <button
                key={dataset.id}
                onClick={() => onAddDataset(dataset)}
                className="flex items-center gap-2 p-2 rounded-lg bg-white border border-neutral-200 hover:border-purple-300 hover:shadow-sm transition-all text-left group"
              >
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full shrink-0",
                  status === "open" ? "bg-emerald-500" : "bg-blue-500"
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-mono text-neutral-400">{dataset.code}</p>
                  <p className="text-xs font-light text-neutral-700 truncate">{dataset.name}</p>
                  <p className="text-[10px] text-neutral-400">{dataset.patientCount.toLocaleString()} patients • {status === "open" ? "Open" : "Ready"}</p>
                </div>
                <Plus className="size-3 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Extended dataset with computed properties
type ProcessedDataset = Dataset & {
  excluded: boolean
  accessStatus: keyof typeof STATUS_CONFIG
  weeks: number
}

// Dataset Preview HoverCard Component
function DatasetPreviewHoverCard({
  dataset,
  children,
}: {
  dataset: Dataset
  children: React.ReactNode
}) {
  const meta = dataset.clinicalMetadata

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        side="right"
        align="start"
        className="w-96 p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono text-xs">
              {dataset.code}
            </Badge>
            {meta?.nctNumber && (
              <Badge variant="outline" className="text-xs font-light text-neutral-600">
                {meta.nctNumber}
              </Badge>
            )}
          </div>
          <h3 className="text-sm font-medium text-neutral-900 leading-snug">
            {dataset.name}
          </h3>
        </div>

        {/* Description */}
        {dataset.description && (
          <div className="px-4 py-2 border-b border-neutral-100">
            <p className="text-xs font-light text-neutral-600 leading-relaxed">
              {dataset.description}
            </p>
          </div>
        )}

        {/* Study Details */}
        {meta && (
          <div className="px-4 py-2 space-y-2.5 border-b border-neutral-100">
            {meta.studyDesign && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <FlaskConical className="size-3.5 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-700">Study Design</span>
                </div>
                <p className="text-xs font-light text-neutral-600 pl-5">{meta.studyDesign}</p>
              </div>
            )}

            {meta.primaryEndpoint && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Target className="size-3.5 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-700">Primary Endpoint</span>
                </div>
                <p className="text-xs font-light text-neutral-600 pl-5">{meta.primaryEndpoint}</p>
              </div>
            )}

            {meta.principalInvestigator && (
              <div className="flex items-center gap-1.5">
                <User className="size-3.5 text-neutral-400" />
                <span className="text-xs text-neutral-600">
                  <span className="font-medium">PI:</span>{" "}
                  <span className="font-light">{meta.principalInvestigator}</span>
                </span>
              </div>
            )}

            {meta.sponsor && (
              <div className="flex items-center gap-1.5">
                <Building2 className="size-3.5 text-neutral-400" />
                <span className="text-xs text-neutral-600">
                  <span className="font-medium">Sponsor:</span>{" "}
                  <span className="font-light">{meta.sponsor}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        {meta && (meta.enrollmentStartDate || meta.studyLockDate) && (
          <div className="px-4 py-2 border-b border-neutral-100">
            <div className="grid grid-cols-2 gap-4">
              {meta.enrollmentStartDate && (
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Calendar className="size-3 text-neutral-400" />
                    <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">Enrollment Start</span>
                  </div>
                  <span className="text-xs font-light text-neutral-700 pl-4">{meta.enrollmentStartDate}</span>
                </div>
              )}
              {meta.studyLockDate && (
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Lock className="size-3 text-neutral-400" />
                    <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">Data Lock</span>
                  </div>
                  <span className="text-xs font-light text-neutral-700 pl-4">{meta.studyLockDate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Badges */}
        {meta && (
          <div className="px-4 py-2 border-b border-neutral-100">
            <div className="flex flex-wrap gap-1.5">
              {meta.enrollmentStatus && (
                <Badge className={cn(
                  "text-xs font-light",
                  meta.enrollmentStatus === "Completed" ? "bg-emerald-100 text-emerald-700" :
                  meta.enrollmentStatus === "Ongoing" ? "bg-blue-100 text-blue-700" :
                  meta.enrollmentStatus === "Recruiting" ? "bg-purple-100 text-purple-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {meta.enrollmentStatus}
                </Badge>
              )}
              {meta.dataLockStatus && (
                <Badge className={cn(
                  "text-xs font-light",
                  meta.dataLockStatus === "Locked" ? "bg-neutral-100 text-neutral-700" :
                  meta.dataLockStatus === "Interim" ? "bg-amber-100 text-amber-700" :
                  "bg-blue-100 text-blue-700"
                )}>
                  {meta.dataLockStatus === "Locked" ? "Data Locked" : meta.dataLockStatus}
                </Badge>
              )}
              {meta.protocolVersion && (
                <Badge variant="outline" className="text-xs font-light">
                  Protocol {meta.protocolVersion}
                </Badge>
              )}
              {meta.blindingType && (
                <Badge variant="outline" className="text-xs font-light">
                  {meta.blindingType}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Enrollment Stats */}
        {meta && (meta.numberOfSites || meta.actualEnrollment || meta.treatmentArms) && (
          <div className="px-4 py-2 border-b border-neutral-100">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              {meta.numberOfSites && (
                <span className="font-light">
                  <span className="font-medium">{meta.numberOfSites}</span> sites
                </span>
              )}
              {meta.actualEnrollment && (
                <span className="font-light">
                  <span className="font-medium">{meta.actualEnrollment.toLocaleString()}</span> enrolled
                </span>
              )}
              {meta.treatmentArms && (
                <span className="font-light">
                  <span className="font-medium">{meta.treatmentArms.length}</span> arms
                </span>
              )}
            </div>
          </div>
        )}

        {/* Child Datasets */}
        {dataset.childDatasets && dataset.childDatasets.length > 0 && (
          <div className="px-4 py-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Layers className="size-3.5 text-neutral-400" />
              <span className="text-xs font-medium text-neutral-700">
                Child Datasets ({dataset.childDatasets.length})
              </span>
            </div>
            <div className="space-y-1.5 pl-5">
              {dataset.childDatasets.map((child) => (
                <div key={child.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-mono text-[10px] text-neutral-500 shrink-0">{child.code}</span>
                    <span className="text-xs font-light text-neutral-600 truncate">{child.name}</span>
                  </div>
                  <Badge className={cn(
                    "text-[10px] font-light shrink-0",
                    child.accessStatus === "open" ? "bg-emerald-100 text-emerald-700" :
                    child.accessStatus === "ready" ? "bg-blue-100 text-blue-700" :
                    child.accessStatus === "approval" ? "bg-amber-100 text-amber-700" :
                    "bg-neutral-100 text-neutral-600"
                  )}>
                    {child.accessStatus === "open" ? "Open" :
                     child.accessStatus === "ready" ? "Ready" :
                     child.accessStatus === "approval" ? "Approval" :
                     "Missing"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </HoverCardContent>
    </HoverCard>
  )
}

// Dataset row component
const DatasetRow = memo(function DatasetRow({
  dataset,
  excluded,
  onToggle,
  schemeFrom,
  schemeTo,
}: {
  dataset: ProcessedDataset
  excluded: boolean
  onToggle: () => void
  schemeFrom: string
  schemeTo: string
}) {
  const status = getDatasetStatus(dataset)
  const config = STATUS_CONFIG[status]
  const weeks = getEstimatedWeeks(dataset)

  // Subtle left border color based on status
  const statusBorderColor = {
    open: "border-l-emerald-400",
    ready: "border-l-blue-400",
    approval: "border-l-amber-400",
  }[status]

  return (
    <div
      onClick={onToggle}
      className={cn(
        "grid grid-cols-[auto_1fr_80px_80px_100px_80px_80px] gap-4 items-center px-4 py-3 border-b border-neutral-100 transition-all duration-200 cursor-pointer select-none",
        "border-l-2",
        statusBorderColor,
        excluded ? "bg-neutral-50 opacity-60" : "hover:bg-neutral-50"
      )}
    >
      {/* Checkbox */}
      <Checkbox
        checked={!excluded}
        onCheckedChange={onToggle}
        onClick={(e) => e.stopPropagation()}
        className="data-[state=checked]:bg-neutral-900 data-[state=checked]:border-neutral-900"
      />

      {/* Name & Code - wrapped in HoverCard for details preview */}
      <DatasetPreviewHoverCard dataset={dataset}>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn("text-sm font-light truncate", excluded && "line-through text-neutral-400")}>
              {dataset.name}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-[10px] font-mono text-neutral-400">{dataset.code}</span>
            <span className="text-[10px] text-neutral-300">•</span>
            <span className="text-[10px] text-neutral-400">{dataset.therapeuticArea.slice(0, 2).join(", ")}</span>
          </div>
        </div>
      </DatasetPreviewHoverCard>

      {/* Patients */}
      <div className="text-right">
        <span className="text-sm font-light text-neutral-700 tabular-nums">{dataset.patientCount.toLocaleString()}</span>
        <p className="text-[10px] text-neutral-400">patients</p>
      </div>

      {/* Phase */}
      <div className="text-center">
        <Badge variant="outline" className="text-[10px] font-light">
          {dataset.phase}
        </Badge>
      </div>

      {/* Status */}
      <div className="flex items-center justify-center">
        <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-light", config.bgColor, config.textColor)}>
          <div className={cn("w-1.5 h-1.5 rounded-full", config.color)} />
          {config.label}
        </div>
      </div>

      {/* Access % */}
      <div className="text-center">
        <span className="text-sm font-light text-neutral-700 tabular-nums">
          {dataset.accessBreakdown.alreadyOpen + dataset.accessBreakdown.readyToGrant}%
        </span>
        <p className="text-[10px] text-neutral-400">accessible</p>
      </div>

      {/* ETA */}
      <div className="text-right">
        <span className={cn("text-sm font-light tabular-nums", weeks === 0 ? "text-emerald-600" : weeks <= 2 ? "text-amber-600" : "text-neutral-500")}>
          {weeks === 0 ? "Now" : `~${weeks}wk`}
        </span>
      </div>
    </div>
  )
})

// Main component
export function StepReview() {
  const { scheme } = useColorScheme()
  const {
    goBack,
    submitRequest,
    isSubmitting,
    isMatching,
    intent,
    selectedDatasets,
    removedDatasetIds,
    removeDataset,
    restoreDataset,
    addDataset,
    swapDataset,
  } = useRequestFlow()

  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [showIntentEditor, setShowIntentEditor] = useState(false)
  const [showAIInsights, setShowAIInsights] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [sortField, setSortField] = useState<SortField>("status")
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 15

  // Process datasets with access status
  const processedDatasets = useMemo(() => {
    return selectedDatasets.map(d => ({
      ...d,
      excluded: removedDatasetIds.has(d.id),
      accessStatus: getDatasetStatus(d),
      weeks: getEstimatedWeeks(d),
    }))
  }, [selectedDatasets, removedDatasetIds])

  // Filter and sort
  const filteredDatasets = useMemo(() => {
    let result = processedDatasets

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query) ||
        d.therapeuticArea.some(ta => ta.toLowerCase().includes(query))
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      result = result.filter(d => d.accessStatus === statusFilter)
    }

    // Sort
    result = [...result].sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "patients":
          comparison = a.patientCount - b.patientCount
          break
        case "status":
          const statusOrder = { open: 0, ready: 1, approval: 2, blocked: 3 }
          comparison = statusOrder[a.accessStatus] - statusOrder[b.accessStatus]
          break
        case "phase":
          comparison = a.phase.localeCompare(b.phase)
          break
        case "access":
          const aAccess = a.accessBreakdown.alreadyOpen + a.accessBreakdown.readyToGrant
          const bAccess = b.accessBreakdown.alreadyOpen + b.accessBreakdown.readyToGrant
          comparison = aAccess - bAccess
          break
        case "eta":
          comparison = a.weeks - b.weeks
          break
      }
      return sortDirection === "asc" ? comparison : -comparison
    })

    return result
  }, [processedDatasets, searchQuery, statusFilter, sortField, sortDirection])

  // Pagination
  const totalPages = Math.ceil(filteredDatasets.length / itemsPerPage)
  const paginatedDatasets = filteredDatasets.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, sortField, sortDirection])

  // Stats
  const stats = useMemo(() => {
    const active = processedDatasets.filter(d => !d.excluded)
    const counts = { open: 0, ready: 0, approval: 0 }
    active.forEach(d => counts[d.accessStatus]++)

    const total = active.length
    const percentages = {
      open: total > 0 ? Math.round((counts.open / total) * 100) : 0,
      ready: total > 0 ? Math.round((counts.ready / total) * 100) : 0,
      approval: total > 0 ? Math.round((counts.approval / total) * 100) : 0,
    }

    let maxWeeks = 0
    if (counts.approval > 0) maxWeeks = Math.max(maxWeeks, 2)
    if (intent.beyondPrimaryUse.aiResearch) maxWeeks += 4
    if (intent.beyondPrimaryUse.softwareDevelopment) maxWeeks += 2
    if (intent.publication.externalPublication) maxWeeks += 2

    return { counts, percentages, total, excluded: removedDatasetIds.size, maxWeeks, immediate: counts.open + counts.ready }
  }, [processedDatasets, removedDatasetIds.size, intent])

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(d => d === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleToggleDataset = useCallback((datasetId: string, excluded: boolean) => {
    if (excluded) {
      restoreDataset(datasetId)
    } else {
      removeDataset(datasetId)
    }
  }, [removeDataset, restoreDataset])

  // Loading state
  if (isMatching) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <div className={cn("w-16 h-16 rounded-2xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg", scheme.from, scheme.to)}>
          <Database className="size-8 text-white animate-pulse" />
        </div>
        <h2 className="text-xl font-light text-neutral-700 mb-2">Analyzing your request...</h2>
        <p className="text-sm text-neutral-500 font-light">Matching {selectedDatasets.length.toLocaleString()} datasets</p>
      </div>
    )
  }

  if (selectedDatasets.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-neutral-500 font-light">No datasets to review</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-2 shrink-0">
        <div>
          <h1 className="text-xl font-extralight text-neutral-900 tracking-tight">Review & Optimize</h1>
          <p className="text-xs text-neutral-500 font-light mt-0.5">Select which datasets to include in your request</p>
        </div>
        <Button variant="ghost" size="sm" onClick={goBack} className="text-neutral-500 hover:text-neutral-700 rounded-full">
          <ArrowLeft className="size-4 mr-1" />
          Back
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-4 gap-3 min-h-0 overflow-hidden">
        {/* Left Column - Dataset List (3 cols) */}
        <div className="col-span-3 flex flex-col min-h-0 rounded-2xl border border-neutral-200 bg-white overflow-hidden">
          {/* Summary Bar */}
          <div className="p-3 border-b border-neutral-100 shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium text-neutral-900 tabular-nums">{stats.total.toLocaleString()}</span>
                <span className="text-sm font-light text-neutral-500">
                  datasets selected
                  {stats.excluded > 0 && <span className="text-neutral-400"> ({stats.excluded} excluded)</span>}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowIntentEditor(!showIntentEditor)}
                className={cn("h-8 text-xs font-light rounded-full", showIntentEditor && "bg-neutral-100")}
              >
                <Settings2 className="size-3 mr-1" />
                Edit Intent
              </Button>
            </div>

            <RAGBar
              open={stats.percentages.open}
              ready={stats.percentages.ready}
              approval={stats.percentages.approval}
              schemeFrom={scheme.from}
              schemeTo={scheme.to}
            />

            <div className="flex items-center gap-4 mt-2 text-xs font-light">
              <span className="text-emerald-700">{stats.counts.open} open</span>
              <span className={scheme.from.replace("from-", "text-")}>{stats.counts.ready} ready</span>
              <span className="text-amber-700">{stats.counts.approval} approval</span>
            </div>
          </div>

          {/* Intent Editor */}
          {showIntentEditor && (
            <div className="p-3 border-b border-neutral-100 shrink-0">
              <IntentEditorPanel onClose={() => setShowIntentEditor(false)} />
            </div>
          )}

          {/* AI Insights Panel */}
          {showAIInsights && (
            <div className="px-3 pt-3 shrink-0">
              <AIInsightsPanel onAddDataset={addDataset} onDismiss={() => setShowAIInsights(false)} />
            </div>
          )}

          {/* Filters & Search */}
          <div className="p-3 flex items-center gap-3 shrink-0">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <Input
                placeholder="Search datasets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-sm font-light rounded-full border-neutral-200"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-full bg-neutral-100">
              {(["all", "open", "ready", "approval"] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setStatusFilter(filter)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-light transition-all",
                    statusFilter === filter ? "bg-white shadow-sm text-neutral-900" : "text-neutral-500 hover:text-neutral-700"
                  )}
                >
                  {filter === "all" ? "All" : STATUS_CONFIG[filter].label}
                </button>
              ))}
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-[auto_1fr_80px_80px_100px_80px_80px] gap-4 items-center px-4 py-2 border-y border-neutral-100 bg-neutral-50 text-xs font-light text-neutral-500 shrink-0">
            <div className="w-4" />
            <button onClick={() => toggleSort("name")} className="flex items-center gap-1 hover:text-neutral-700">
              Dataset {sortField === "name" && <ArrowUpDown className="size-3" />}
            </button>
            <button onClick={() => toggleSort("patients")} className="flex items-center gap-1 justify-end hover:text-neutral-700">
              Patients {sortField === "patients" && <ArrowUpDown className="size-3" />}
            </button>
            <button onClick={() => toggleSort("phase")} className="flex items-center gap-1 justify-center hover:text-neutral-700">
              Phase {sortField === "phase" && <ArrowUpDown className="size-3" />}
            </button>
            <button onClick={() => toggleSort("status")} className="flex items-center gap-1 justify-center hover:text-neutral-700">
              Status {sortField === "status" && <ArrowUpDown className="size-3" />}
            </button>
            <button onClick={() => toggleSort("access")} className="flex items-center gap-1 justify-center hover:text-neutral-700">
              Access {sortField === "access" && <ArrowUpDown className="size-3" />}
            </button>
            <button onClick={() => toggleSort("eta")} className="flex items-center gap-1 justify-end hover:text-neutral-700">
              ETA {sortField === "eta" && <ArrowUpDown className="size-3" />}
            </button>
          </div>

          {/* Table Body - constrained height so pagination stays visible */}
          <div className="flex-1 min-h-0 overflow-auto">
            {paginatedDatasets.map((dataset) => (
              <DatasetRow
                key={dataset.id}
                dataset={dataset}
                excluded={dataset.excluded}
                onToggle={() => handleToggleDataset(dataset.id, dataset.excluded)}
                schemeFrom={scheme.from}
                schemeTo={scheme.to}
              />
            ))}
            {paginatedDatasets.length === 0 && (
              <div className="flex items-center justify-center h-32 text-neutral-400 text-sm font-light">
                No datasets match your filters
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-2 border-t border-neutral-100 bg-neutral-50 shrink-0">
              <span className="text-xs font-light text-neutral-500">
                Showing {((currentPage - 1) * itemsPerPage) + 1}-{Math.min(currentPage * itemsPerPage, filteredDatasets.length)} of {filteredDatasets.length}
              </span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="h-7 w-7 p-0 rounded-full"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let page: number
                  if (totalPages <= 5) {
                    page = i + 1
                  } else if (currentPage <= 3) {
                    page = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    page = totalPages - 4 + i
                  } else {
                    page = currentPage - 2 + i
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={cn(
                        "w-7 h-7 rounded-full text-xs font-light transition-all",
                        currentPage === page ? "bg-neutral-900 text-white" : "text-neutral-500 hover:bg-neutral-100"
                      )}
                    >
                      {page}
                    </button>
                  )
                })}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 w-7 p-0 rounded-full"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Submit Card */}
        <div className="col-span-1">
          <div className="sticky top-0 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
            <div className="text-center mb-4">
              <div className={cn("inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br mb-3", scheme.from, scheme.to)}>
                <Shield className="size-6 text-white" />
              </div>
              <h3 className="text-lg font-light text-neutral-900 mb-1">Submit Request</h3>
              <p className="text-sm font-light text-neutral-500">{stats.total.toLocaleString()} dataset{stats.total !== 1 ? "s" : ""}</p>
            </div>

            {/* Timeline */}
            <div className="mb-4 p-3 rounded-xl bg-neutral-50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-light text-neutral-500">Estimated timeline</span>
                <span className="text-lg font-light text-neutral-900 tabular-nums">
                  {stats.maxWeeks === 0 ? "Now" : `~${stats.maxWeeks}wk`}
                </span>
              </div>
              <div className="text-xs font-light text-neutral-500 space-y-0.5">
                {stats.immediate > 0 && <p className="text-emerald-600">{stats.immediate} available immediately</p>}
                {stats.counts.approval > 0 && <p>{stats.counts.approval} need approval (~2wk)</p>}
              </div>
            </div>

            {/* Complexity factors */}
            {(intent.beyondPrimaryUse.aiResearch || intent.beyondPrimaryUse.softwareDevelopment || intent.publication.externalPublication) && (
              <div className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-100">
                <p className="text-xs font-light text-amber-800 mb-2">Intent adds time:</p>
                <div className="space-y-1 text-xs font-light text-amber-700">
                  {intent.beyondPrimaryUse.aiResearch && <p>• AI/ML research +4wk</p>}
                  {intent.beyondPrimaryUse.softwareDevelopment && <p>• Software dev +2wk</p>}
                  {intent.publication.externalPublication && <p>• External publish +2wk</p>}
                </div>
              </div>
            )}

            {/* Intent Summary */}
            <div className="mb-4 p-3 rounded-xl bg-neutral-50">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-light text-neutral-500">Your intent</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowIntentEditor(true)}
                  className="h-5 text-[10px] font-light text-neutral-400 hover:text-neutral-600 rounded-full px-2"
                >
                  Edit
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                {Object.entries(intent.primaryUse).filter(([_, v]) => v).slice(0, 2).map(([k]) => (
                  <Badge key={k} variant="outline" className="text-[10px] font-light">
                    {k.replace(/([A-Z])/g, " $1").trim().split(" ").slice(0, 2).join(" ")}
                  </Badge>
                ))}
                {Object.values(intent.primaryUse).filter(Boolean).length > 2 && (
                  <Badge variant="outline" className="text-[10px] font-light">+{Object.values(intent.primaryUse).filter(Boolean).length - 2}</Badge>
                )}
                {intent.beyondPrimaryUse.aiResearch && <Badge className="text-[10px] font-light bg-neutral-900 text-white">AI/ML</Badge>}
                {intent.beyondPrimaryUse.softwareDevelopment && <Badge className="text-[10px] font-light bg-neutral-900 text-white">Software</Badge>}
                {intent.publication.externalPublication && <Badge className="text-[10px] font-light bg-neutral-900 text-white">Publish</Badge>}
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors cursor-pointer mb-4">
              <Checkbox checked={agreedToTerms} onCheckedChange={(checked) => setAgreedToTerms(checked === true)} className="mt-0.5" />
              <span className="text-xs text-neutral-600 font-light leading-relaxed">
                I agree to use this data only for the declared purposes.
              </span>
            </label>

            {/* Submit Button */}
            <Button
              onClick={submitRequest}
              disabled={!agreedToTerms || stats.total === 0 || isSubmitting}
              className={cn(
                "w-full h-11 rounded-xl font-light transition-all",
                agreedToTerms && stats.total > 0
                  ? cn("bg-gradient-to-r text-white shadow-lg hover:shadow-xl", scheme.from, scheme.to)
                  : "bg-neutral-100 text-neutral-400"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

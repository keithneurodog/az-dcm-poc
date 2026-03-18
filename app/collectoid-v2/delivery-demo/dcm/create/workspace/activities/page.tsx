"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useColorScheme } from "../../../../_components"
import { useWorkspace } from "../layout"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Target,
  Wrench,
  FlaskConical,
  Info,
  CheckCircle2,
  HelpCircle,
  Lock,
  Unlock,
  Shield,
  Users,
  AlertCircle,
  Sparkles,
  Database,
  Clock,
  TrendingUp,
  Zap,
  FileText,
  Microscope,
  Brain,
  ShieldAlert,
  XCircle,
  Pill,
} from "lucide-react"

interface Activity {
  id: string
  category: "research" | "development" | "safety" | "analytics"
  name: string
  description: string
  accessLevel: string
  permitted: boolean
  note?: string
}

const ACTIVITIES: Activity[] = [
  // Scientific Research & Publications
  {
    id: "cross-study",
    category: "research",
    name: "Cross-Study Learning",
    description:
      "Meta-analysis across studies, hypothesis generation, comparative effectiveness research, and pattern identification across therapeutic areas",
    accessLevel: "Patient-level study data",
    permitted: true,
  },
  {
    id: "publications",
    category: "research",
    name: "Scientific Publications",
    description:
      "Prepare manuscripts for internal or external publication. External publications require Publication Sign-off (PSO) process",
    accessLevel: "Aggregated analysis results",
    permitted: true,
    note: "External: PSO required",
  },
  {
    id: "biomarker",
    category: "research",
    name: "Biomarker Identification",
    description:
      "Discovery and validation of predictive or prognostic biomarkers using clinical and molecular data",
    accessLevel: "Patient-level clinical + genomic data",
    permitted: true,
  },
  // Drug Development Support
  {
    id: "drug-dev",
    category: "development",
    name: "Drug Development Support",
    description:
      "Support clinical development programs including dose optimization, patient selection strategies, and compound characterization",
    accessLevel: "Patient-level study data",
    permitted: true,
  },
  {
    id: "regulatory",
    category: "development",
    name: "Regulatory Submissions",
    description:
      "Prepare data and analyses for regulatory submissions, health authority responses, and label extensions",
    accessLevel: "Study-level and patient-level data",
    permitted: true,
    note: "GxP environment required",
  },
  {
    id: "diagnostic",
    category: "development",
    name: "Diagnostic Development",
    description:
      "Support companion diagnostic development, assay validation, and clinical utility assessment",
    accessLevel: "Patient-level clinical + diagnostic data",
    permitted: true,
  },
  // Safety & Pharmacovigilance
  {
    id: "safety-monitoring",
    category: "safety",
    name: "Safety Monitoring",
    description:
      "Continuous safety surveillance, adverse event analysis, and benefit-risk assessment across studies",
    accessLevel: "Patient-level safety data",
    permitted: true,
    note: "24hr notification required for findings",
  },
  {
    id: "signal-detection",
    category: "safety",
    name: "Signal Detection",
    description:
      "Statistical signal detection, safety signal evaluation, and pharmacovigilance analytics",
    accessLevel: "Patient-level safety data",
    permitted: true,
  },
  // AI & Advanced Analytics
  {
    id: "ai-analytics",
    category: "analytics",
    name: "AI Analytics",
    description:
      "Apply AI/ML models for predictive analytics, pattern recognition, and decision support",
    accessLevel: "Patient-level multi-modal data",
    permitted: true,
  },
  {
    id: "ai-training",
    category: "analytics",
    name: "AI Model Development & Training",
    description:
      "Train or develop new AI/ML models using patient data",
    accessLevel: "Patient-level data",
    permitted: false,
    note: "Not permitted under Primary Use",
  },
  {
    id: "cohort-builder",
    category: "analytics",
    name: "Cohort Identification",
    description:
      "Build and characterize patient cohorts using clinical, genomic, and outcome data for analysis",
    accessLevel: "Patient-level data",
    permitted: true,
  },
]

export default function WorkspaceActivitiesPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const workspace = useWorkspace()

  // Local state for activity selection
  const [localSelectedActivities, setLocalSelectedActivities] = useState<Set<string>>(() => {
    return new Set(workspace.selectedActivities)
  })
  const [highlightedActivity, setHighlightedActivity] = useState<string | null>(null)

  const toggleActivity = (activityId: string) => {
    const newSelected = new Set(localSelectedActivities)
    if (newSelected.has(activityId)) {
      newSelected.delete(activityId)
    } else {
      newSelected.add(activityId)
    }
    setLocalSelectedActivities(newSelected)
  }

  const scrollToActivity = (activityId: string) => {
    const element = document.getElementById(`activity-${activityId}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      setHighlightedActivity(activityId)
      setTimeout(() => setHighlightedActivity(null), 2000)
    }
  }

  // Analyze datasets to generate recommendations
  const getRecommendations = () => {
    const recommendations: { id: string; reason: string }[] = []

    if (workspace.selectedDatasets.length === 0) {
      return [
        { id: 'cross-study', reason: 'Most common activity for data collections' },
        { id: 'drug-dev', reason: 'Support clinical development programs' }
      ]
    }

    // Check for genomic data by looking at data location
    const hasGenomicData = workspace.selectedDatasets.some(d => d.dataLocation.genomics)
    if (hasGenomicData) {
      recommendations.push({
        id: 'biomarker',
        reason: 'Genomic data available for biomarker discovery'
      })
    }

    // Check for multiple therapeutic areas - good for cross-study learning
    const therapeuticAreas = new Set(
      workspace.selectedDatasets.flatMap(d => d.therapeuticArea)
    )
    if (therapeuticAreas.size > 1) {
      recommendations.push({
        id: 'cross-study',
        reason: `Data spans ${therapeuticAreas.size} therapeutic areas`
      })
    }

    // Check for multiple studies - good for meta-analysis
    if (workspace.selectedDatasets.length > 3) {
      recommendations.push({
        id: 'ai-analytics',
        reason: `${workspace.selectedDatasets.length} datasets ideal for AI analytics`
      })
    }

    // Default recommendations if none match
    if (recommendations.length === 0) {
      recommendations.push({
        id: 'cross-study',
        reason: 'Most common activity for data collections'
      })
      recommendations.push({
        id: 'drug-dev',
        reason: 'Support clinical development programs'
      })
    }

    return recommendations.slice(0, 3) // Max 3 recommendations
  }

  const recommendations = getRecommendations()
  const recommendedActivityIds = new Set(recommendations.map(r => r.id))

  // Calculate data complexity metrics
  const complexity = useMemo(() => {
    if (workspace.selectedDatasets.length === 0) {
      return {
        modalities: [] as [string, number][],
        therapeuticAreas: [] as string[],
        phases: [] as [string, number][],
        geographies: [] as string[],
        accessBreakdown: { alreadyOpen: 25, readyToGrant: 30, needsApproval: 35, missingLocation: 10 },
        complexityLevel: 'Medium' as const
      }
    }

    const modalities = new Map<string, number>()
    const therapeuticAreas = new Set<string>()
    const phases = new Map<string, number>()
    const geographies = new Set<string>()

    workspace.selectedDatasets.forEach(dataset => {
      if (dataset.dataLocation.clinical) {
        modalities.set('Clinical', (modalities.get('Clinical') || 0) + 1)
      }
      if (dataset.dataLocation.genomics) {
        modalities.set('Genomics', (modalities.get('Genomics') || 0) + 1)
      }
      if (dataset.dataLocation.imaging) {
        modalities.set('Imaging', (modalities.get('Imaging') || 0) + 1)
      }
      dataset.therapeuticArea.forEach(ta => therapeuticAreas.add(ta))
      phases.set(dataset.phase, (phases.get(dataset.phase) || 0) + 1)
      dataset.geography.forEach(geo => geographies.add(geo))
    })

    const avgAccessBreakdown = {
      alreadyOpen: 0,
      readyToGrant: 0,
      needsApproval: 0,
      missingLocation: 0
    }
    workspace.selectedDatasets.forEach(d => {
      avgAccessBreakdown.alreadyOpen += d.accessBreakdown.alreadyOpen
      avgAccessBreakdown.readyToGrant += d.accessBreakdown.readyToGrant
      avgAccessBreakdown.needsApproval += d.accessBreakdown.needsApproval
      avgAccessBreakdown.missingLocation += d.accessBreakdown.missingLocation
    })
    const count = workspace.selectedDatasets.length
    avgAccessBreakdown.alreadyOpen = Math.round(avgAccessBreakdown.alreadyOpen / count)
    avgAccessBreakdown.readyToGrant = Math.round(avgAccessBreakdown.readyToGrant / count)
    avgAccessBreakdown.needsApproval = Math.round(avgAccessBreakdown.needsApproval / count)
    avgAccessBreakdown.missingLocation = Math.round(avgAccessBreakdown.missingLocation / count)

    const complexityScore = avgAccessBreakdown.needsApproval + avgAccessBreakdown.missingLocation
    const complexityLevel = complexityScore > 50 ? 'High' : complexityScore > 30 ? 'Medium' : 'Low'

    return {
      modalities: Array.from(modalities.entries()).sort((a, b) => b[1] - a[1]) as [string, number][],
      therapeuticAreas: Array.from(therapeuticAreas),
      phases: Array.from(phases.entries()).sort((a, b) => b[1] - a[1]) as [string, number][],
      geographies: Array.from(geographies),
      accessBreakdown: avgAccessBreakdown,
      complexityLevel
    }
  }, [workspace.selectedDatasets])

  // Calculate ETA based on selected activities
  const timeline = useMemo(() => {
    if (localSelectedActivities.size === 0) {
      return {
        min: 1,
        max: 14,
        description: 'Select activities to see estimated timeline'
      }
    }

    const hasSafetyActivity = Array.from(localSelectedActivities).some(id => {
      const activity = ACTIVITIES.find(a => a.id === id)
      return activity?.category === 'safety'
    })

    const hasRegulatoryActivity = Array.from(localSelectedActivities).some(id => {
      const activity = ACTIVITIES.find(a => a.id === id)
      return activity?.id === 'regulatory'
    })

    if (hasRegulatoryActivity) {
      return {
        min: 5,
        max: 14,
        description: 'Regulatory submissions require GxP environment setup'
      }
    } else if (hasSafetyActivity) {
      return {
        min: 3,
        max: 7,
        description: 'Safety activities require expedited provisioning'
      }
    } else {
      return {
        min: 1,
        max: 5,
        description: 'Standard Primary Use provisioning'
      }
    }
  }, [localSelectedActivities])

  const handleContinue = () => {
    // Save to workspace context
    const selected = Array.from(localSelectedActivities)
    workspace.setSelectedActivities(selected)

    // Save to sessionStorage
    if (typeof window !== "undefined") {
      const activityData = selected
        .map((id) => ACTIVITIES.find((a) => a.id === id))
        .filter(Boolean)
      sessionStorage.setItem("dcm_selected_activities", JSON.stringify(activityData))
    }

    router.push("/collectoid-v2/delivery-demo/dcm/create/workspace")
  }

  const researchActivities = ACTIVITIES.filter((a) => a.category === "research")
  const developmentActivities = ACTIVITIES.filter((a) => a.category === "development")
  const safetyActivities = ACTIVITIES.filter((a) => a.category === "safety")
  const analyticsActivities = ACTIVITIES.filter((a) => a.category === "analytics")

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={cn(
              "inline-flex items-center justify-center size-16 rounded-2xl mb-4 bg-gradient-to-br",
              scheme.bg,
              scheme.bgHover
            )}
          >
            <Target className={cn("size-8", scheme.from.replace("from-", "text-"))} />
          </div>
          <h1 className="text-2xl font-extralight text-neutral-900 mb-2 tracking-tight">
            Define Collection Purpose & Activities
          </h1>
          <p className="text-sm font-light text-neutral-600 max-w-xl mx-auto mb-3">
            What will this data be used for? This affects the access level users will receive.
          </p>

          {/* Help Link */}
          <Sheet>
            <SheetTrigger asChild>
              <button className={cn(
                "inline-flex items-center gap-2 text-sm font-light transition-colors cursor-pointer",
                scheme.from.replace("from-", "text-"),
                "hover:underline"
              )}>
                <HelpCircle className="size-4" />
                Why do activities affect access levels?
              </button>
            </SheetTrigger>
            <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
              <div className="px-6 pb-6">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-light text-neutral-900 flex items-center gap-2">
                    <Target className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                    Activities & Access Levels
                  </SheetTitle>
                  <SheetDescription className="font-light">
                    Understanding how your intended use affects data access permissions
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-normal text-neutral-900 mb-3">What is Primary Use?</h3>
                    <p className="text-sm font-light text-neutral-700 leading-relaxed">
                      Primary Use covers R&D activities supporting AstraZeneca drug development. This includes
                      drug development, regulatory compliance, safety monitoring, cross-study learning, and
                      scientific publications. AI analytics is permitted, but AI model development/training
                      and external data sharing are not permitted under Primary Use agreements.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                      <Shield className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                      Permitted vs Not Permitted
                    </h3>
                    <div className="space-y-3">
                      <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                            <Unlock className="size-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-normal text-neutral-900 mb-2">Permitted (Primary Use)</h4>
                            <p className="text-xs font-light text-neutral-600 leading-relaxed mb-2">
                              Cross-study learning, drug development support, regulatory submissions,
                              safety monitoring, scientific publications, AI analytics, biomarker discovery.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-light text-neutral-600">
                          <CheckCircle2 className="size-3.5 text-green-600" />
                          <span className="font-normal">Access:</span> Granted under Data Use Terms
                        </div>
                      </div>

                      <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <Lock className="size-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-normal text-neutral-900 mb-2">Not Permitted</h4>
                            <p className="text-xs font-light text-neutral-600 leading-relaxed mb-2">
                              AI model development/training, external data sharing, commercial use,
                              combining with external datasets without approval.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-light text-neutral-600">
                          <XCircle className="size-3.5 text-red-600" />
                          <span className="font-normal">Access:</span> Requires separate approval process (iDAP)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Activity Recommendations Widget */}
        <div className={cn(
          "rounded-2xl border p-5 mb-6 bg-gradient-to-br",
          scheme.bg.replace("500", "50"),
          "border-neutral-200"
        )}>
          <div className="flex items-start gap-4 mb-4">
            <div className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg",
              scheme.from,
              scheme.to
            )}>
              <Sparkles className="size-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-normal text-neutral-900 mb-1">
                Recommended Activities
              </h3>
              <p className="text-xs font-light text-neutral-600">
                {workspace.selectedDatasets.length > 0
                  ? `Based on your ${workspace.selectedDatasets.length} selected datasets`
                  : "Select datasets first for personalized recommendations"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {recommendations.map((rec) => {
              const activity = ACTIVITIES.find(a => a.id === rec.id)
              if (!activity) return null
              return (
                <button
                  key={rec.id}
                  onClick={() => scrollToActivity(rec.id)}
                  className={cn(
                    "group flex items-center gap-2 px-3 py-2 rounded-xl border transition-all hover:shadow-md",
                    localSelectedActivities.has(rec.id)
                      ? cn("bg-gradient-to-r text-white border-transparent", scheme.from, scheme.to)
                      : "bg-white border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  <div className="flex-1 text-left">
                    <p className={cn(
                      "text-sm font-normal",
                      localSelectedActivities.has(rec.id) ? "text-white" : "text-neutral-900"
                    )}>
                      {activity.name}
                    </p>
                    <p className={cn(
                      "text-xs font-light",
                      localSelectedActivities.has(rec.id) ? "text-white/80" : "text-neutral-500"
                    )}>
                      {rec.reason}
                    </p>
                  </div>
                  {localSelectedActivities.has(rec.id) ? (
                    <CheckCircle2 className="size-4 text-white shrink-0" />
                  ) : (
                    <ArrowRight className="size-4 text-neutral-400 group-hover:text-neutral-600 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Data Collection Overview */}
        {workspace.selectedDatasets.length > 0 && (
          <div className="rounded-2xl border border-neutral-200 bg-white p-5 mb-6">
            <h3 className="text-base font-normal text-neutral-900 mb-4 flex items-center gap-2">
              <Database className={cn("size-4", scheme.from.replace("from-", "text-"))} />
              Your Data Collection Overview
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              {/* Data Modalities */}
              <div>
                <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Data Modalities</p>
                <div className="space-y-1">
                  {complexity.modalities.slice(0, 3).map(([modality, count]) => (
                    <div key={modality} className="flex items-center justify-between">
                      <span className="text-sm font-light text-neutral-700">{modality}</span>
                      <Badge variant="outline" className="text-xs font-light">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phases */}
              <div>
                <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Phase Distribution</p>
                <div className="space-y-1">
                  {complexity.phases.slice(0, 3).map(([phase, count]) => (
                    <div key={phase} className="flex items-center justify-between">
                      <span className="text-sm font-light text-neutral-700">Phase {phase}</span>
                      <Badge variant="outline" className="text-xs font-light">
                        {count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Access Complexity RAG Bar */}
            <div className="pt-3 border-t border-neutral-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-light text-neutral-600 uppercase tracking-wider">Access Complexity</p>
                <Badge className={cn(
                  "font-light text-xs",
                  complexity.complexityLevel === 'High' ? "bg-amber-100 text-amber-800" :
                  complexity.complexityLevel === 'Medium' ? "bg-blue-100 text-blue-800" :
                  "bg-green-100 text-green-800"
                )}>
                  {complexity.complexityLevel}
                </Badge>
              </div>
              <div className="flex gap-0.5 h-2 rounded-full overflow-hidden bg-neutral-100">
                <div className="bg-green-500" style={{ width: `${complexity.accessBreakdown.alreadyOpen}%` }} />
                <div className={cn("bg-gradient-to-r", scheme.from, scheme.to)} style={{ width: `${complexity.accessBreakdown.readyToGrant}%` }} />
                <div className="bg-amber-500" style={{ width: `${complexity.accessBreakdown.needsApproval}%` }} />
                <div className="bg-neutral-400" style={{ width: `${complexity.accessBreakdown.missingLocation}%` }} />
              </div>
              <div className="flex items-center justify-between text-xs font-light text-neutral-500 mt-1">
                <span>{complexity.accessBreakdown.alreadyOpen}% open</span>
                <span>{complexity.accessBreakdown.readyToGrant}% ready</span>
                <span>{complexity.accessBreakdown.needsApproval}% approval</span>
              </div>
            </div>
          </div>
        )}

        {/* Selection Status */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-4 text-neutral-600" />
            <span className="text-sm font-light text-neutral-600">
              {localSelectedActivities.size} activit{localSelectedActivities.size !== 1 ? "ies" : "y"} selected
            </span>
          </div>
        </div>

        {/* Activity Sections */}
        {[
          { title: "Scientific Research & Publications", icon: Microscope, activities: researchActivities, description: "Research activities aligned with Primary Use" },
          { title: "Drug Development Support", icon: Pill, activities: developmentActivities, description: "Support clinical development and regulatory activities" },
          { title: "Safety & Pharmacovigilance", icon: ShieldAlert, activities: safetyActivities, description: "Safety monitoring and signal detection" },
          { title: "AI & Advanced Analytics", icon: Brain, activities: analyticsActivities, description: "AI analytics and cohort identification" },
        ].map((section) => (
          <div key={section.title} className="mb-6">
            <div className="flex items-center gap-3 mb-3">
              <section.icon className={cn("size-4", scheme.from.replace("from-", "text-"))} />
              <h2 className="text-lg font-light text-neutral-900">{section.title}</h2>
            </div>
            <p className="text-sm font-light text-neutral-600 mb-3">
              {section.description}
            </p>

            <div className="space-y-2">
              {section.activities.map((activity) => (
                <div
                  key={activity.id}
                  id={`activity-${activity.id}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => activity.permitted && toggleActivity(activity.id)}
                  onKeyDown={(e) => e.key === "Enter" && activity.permitted && toggleActivity(activity.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    !activity.permitted
                      ? "border-neutral-200 bg-neutral-50 cursor-not-allowed opacity-70"
                      : localSelectedActivities.has(activity.id)
                        ? cn(
                            scheme.from.replace("from-", "border-").replace("500", "200"),
                            "bg-gradient-to-r",
                            scheme.bg,
                            scheme.bgHover,
                            "cursor-pointer"
                          )
                        : recommendedActivityIds.has(activity.id)
                          ? cn(
                              "bg-white hover:shadow-sm cursor-pointer",
                              scheme.from.replace("from-", "border-").replace("500", "100")
                            )
                          : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm cursor-pointer",
                    highlightedActivity === activity.id && "ring-2 ring-offset-2",
                    highlightedActivity === activity.id && scheme.from.replace("from-", "ring-")
                  )}
                >
                  <div className="flex items-start gap-3">
                    {activity.permitted ? (
                      <Checkbox
                        checked={localSelectedActivities.has(activity.id)}
                        className="mt-0.5"
                      />
                    ) : (
                      <XCircle className="size-4 mt-0.5 text-red-400" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                          "text-sm font-normal",
                          activity.permitted ? "text-neutral-900" : "text-neutral-500"
                        )}>
                          {activity.name}
                        </h3>
                        {!activity.permitted && (
                          <Badge variant="outline" className="text-xs font-light border-red-200 text-red-600 bg-red-50">
                            Not Permitted
                          </Badge>
                        )}
                        {recommendedActivityIds.has(activity.id) && activity.permitted && (
                          <Sparkles className={cn("size-3.5", scheme.from.replace("from-", "text-"))} />
                        )}
                      </div>
                      <p className={cn(
                        "text-xs font-light leading-relaxed mb-2",
                        activity.permitted ? "text-neutral-600" : "text-neutral-400"
                      )}>
                        {activity.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Info className="size-3 text-neutral-400" />
                          <p className="text-xs font-light text-neutral-500">
                            {activity.accessLevel}
                          </p>
                        </div>
                        {activity.note && (
                          <Badge variant="outline" className="text-xs font-light">
                            {activity.note}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Info Notice */}
        <div className="rounded-xl p-3 bg-blue-50 border border-blue-100 mb-6">
          <div className="flex gap-3">
            <Info className="size-4 shrink-0 text-blue-600 mt-0.5" />
            <div className="text-xs font-light text-blue-900">
              <span className="font-normal">Primary Use:</span> All activities must align with AstraZeneca drug development purposes.
              AI development/training and external data sharing are not permitted under Primary Use agreements.
            </div>
          </div>
        </div>

        {/* Timeline & Continue */}
        <div className="flex items-center gap-3">
          {/* Estimated Timeline Badge */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl border",
            localSelectedActivities.size > 0
              ? cn(scheme.bg, scheme.from.replace("from-", "border-").replace("500", "200"))
              : "bg-neutral-50 border-neutral-200"
          )}>
            <Clock className={cn(
              "size-4",
              localSelectedActivities.size > 0
                ? scheme.from.replace("from-", "text-")
                : "text-neutral-400"
            )} />
            <div>
              <p className="text-xs font-light text-neutral-500">Est. Timeline</p>
              <p className={cn(
                "text-sm font-normal",
                localSelectedActivities.size > 0
                  ? scheme.from.replace("from-", "text-").replace("500", "700")
                  : "text-neutral-400"
              )}>
                {timeline.min === timeline.max ? `${timeline.min}` : `${timeline.min}-${timeline.max}`} days
              </p>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            disabled={localSelectedActivities.size === 0}
            className={cn(
              "flex-1 h-11 rounded-xl font-light shadow-md hover:shadow-lg transition-all",
              localSelectedActivities.size > 0
                ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            {localSelectedActivities.size > 0 ? (
              <>
                Save & Continue
                <ArrowRight className="size-4 ml-2" />
              </>
            ) : (
              "Select at least one activity"
            )}
          </Button>
        </div>
      </div>

      {/* Sticky ETA Panel */}
      <div className="w-72 shrink-0 mt-[192px]">
        <Card className="border-neutral-200 rounded-2xl overflow-hidden shadow-sm sticky top-24">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn(
                "flex size-9 items-center justify-center rounded-full bg-gradient-to-r text-white",
                scheme.from,
                scheme.to
              )}>
                <Clock className="size-4" />
              </div>
              <div>
                <h3 className="text-sm font-normal text-neutral-900">
                  Estimated Timeline
                </h3>
                <p className="text-xl font-light text-neutral-900">
                  {timeline.min === timeline.max ? `${timeline.min}` : `${timeline.min}-${timeline.max}`} days
                </p>
              </div>
            </div>

            <p className="text-xs font-light text-neutral-600 mb-4">
              {timeline.description}
            </p>

            <Separator className="mb-4" />

            {/* Timeline Breakdown */}
            <div className="space-y-3">
              <h4 className="text-xs font-normal text-neutral-900 uppercase tracking-wider">Access Provisioning</h4>

              {/* Already Open */}
              <div className="flex items-start gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="size-3 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-normal text-neutral-900">Already Open</p>
                    <Badge className="bg-green-100 text-green-800 font-light text-xs px-1.5 py-0">
                      {complexity.accessBreakdown.alreadyOpen}%
                    </Badge>
                  </div>
                  <p className="text-xs font-light text-neutral-500">Instant</p>
                </div>
              </div>

              {/* Awaiting Policy */}
              <div className="flex items-start gap-2">
                <div className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full",
                  scheme.bg.replace("500", "100")
                )}>
                  <Zap className={cn("size-3", scheme.from.replace("from-", "text-"))} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-normal text-neutral-900">Awaiting Policy</p>
                    <Badge className={cn(
                      "font-light text-xs px-1.5 py-0",
                      scheme.bg.replace("500", "100"),
                      scheme.from.replace("from-", "text-")
                    )}>
                      {complexity.accessBreakdown.readyToGrant}%
                    </Badge>
                  </div>
                  <p className="text-xs font-light text-neutral-500">1-2 days</p>
                </div>
              </div>

              {/* Needs Approval */}
              <div className="flex items-start gap-2">
                <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <Users className="size-3 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-normal text-neutral-900">Needs Approval</p>
                    <Badge className="bg-amber-100 text-amber-800 font-light text-xs px-1.5 py-0">
                      {complexity.accessBreakdown.needsApproval}%
                    </Badge>
                  </div>
                  <p className="text-xs font-light text-neutral-500">
                    {localSelectedActivities.size > 0 && Array.from(localSelectedActivities).some(id => {
                      const activity = ACTIVITIES.find(a => a.id === id)
                      return activity?.category === 'safety' || activity?.id === 'regulatory'
                    }) ? '5-14 days' : '3-7 days'}
                  </p>
                </div>
              </div>

              {/* Missing Items */}
              {complexity.accessBreakdown.missingLocation > 0 && (
                <div className="flex items-start gap-2">
                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                    <AlertCircle className="size-3 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-normal text-neutral-900">Missing Items</p>
                      <Badge className="bg-neutral-100 text-neutral-800 font-light text-xs px-1.5 py-0">
                        {complexity.accessBreakdown.missingLocation}%
                      </Badge>
                    </div>
                    <p className="text-xs font-light text-neutral-500">Variable</p>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-4" />

            {/* Factors */}
            <div>
              <h4 className="text-xs font-normal text-neutral-900 mb-2 flex items-center gap-1">
                <TrendingUp className="size-3 text-neutral-600" />
                Timeline Factors
              </h4>
              <div className="space-y-1 text-xs font-light text-neutral-600">
                <div className="flex items-start gap-2">
                  <div className="size-1 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                  <p>{workspace.selectedDatasets.length} datasets</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-1 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                  <p>
                    {localSelectedActivities.size === 0 ? 'No activities yet' :
                     Array.from(localSelectedActivities).some(id => {
                       const activity = ACTIVITIES.find(a => a.id === id)
                       return activity?.category === 'safety' || activity?.id === 'regulatory'
                     }) ? 'Safety/regulatory activities selected' :
                     'Primary Use activities'}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Save & Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={localSelectedActivities.size === 0}
              className={cn(
                "w-full h-10 rounded-xl font-light shadow-md hover:shadow-lg transition-all",
                localSelectedActivities.size > 0
                  ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              )}
            >
              {localSelectedActivities.size > 0 ? (
                <>
                  Save & Continue
                  <ArrowRight className="size-4 ml-2" />
                </>
              ) : (
                "Select activities"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

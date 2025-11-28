"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  ArrowLeft,
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
} from "lucide-react"
import { Dataset } from "@/lib/dcm-mock-data"

interface Activity {
  id: string
  category: "engineering" | "analysis"
  name: string
  description: string
  accessLevel: string
}

const ACTIVITIES: Activity[] = [
  {
    id: "etl",
    category: "engineering",
    name: "ETL/Standardization",
    description:
      "Date unification, unit harmonization (VAF %), HGVS normalization, panel coverage mapping, LoD/LoQ capture, QC flag propagation",
    accessLevel: "Processed/aggregated data",
  },
  {
    id: "variant-harm",
    category: "engineering",
    name: "Variant Harmonization",
    description:
      "Left-align/normalize, canonical transcript selection, COSMIC/ClinVar annotation, deduplication",
    accessLevel: "Genomic data preprocessing",
  },
  {
    id: "early-response",
    category: "analysis",
    name: "Early Response Classifier",
    description:
      "Baseline ctDNA, % drop by Week 4, max VAF using AI/ML models",
    accessLevel: "Patient-level clinical + ctDNA data",
  },
  {
    id: "multimodal",
    category: "analysis",
    name: "Multimodal Fusion",
    description:
      "ctDNA + PET MTV/TLG + clinical covariates for integrated response prediction",
    accessLevel: "Patient-level multi-modal data",
  },
  {
    id: "cohort-builder",
    category: "analysis",
    name: "Cohort Builder",
    description:
      "Filters for cancer type/subtype, stage, line, regimen class, panel version",
    accessLevel: "Patient-level data for cohort creation",
  },
]

export default function DCMActivitiesPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([])
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set())
  const [highlightedActivity, setHighlightedActivity] = useState<string | null>(null)

  useEffect(() => {
    // Get selected datasets from sessionStorage
    if (typeof window !== "undefined") {
      const storedDatasets = sessionStorage.getItem("dcm_selected_datasets")
      if (!storedDatasets) {
        router.push("/collectoid/dcm/create")
        return
      }

      const datasets = JSON.parse(storedDatasets) as Dataset[]
      setSelectedDatasets(datasets)
    }
  }, [router])

  const toggleActivity = (activityId: string) => {
    const newSelected = new Set(selectedActivities)
    if (newSelected.has(activityId)) {
      newSelected.delete(activityId)
    } else {
      newSelected.add(activityId)
    }
    setSelectedActivities(newSelected)
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

    // Check for genomic data by looking at data location
    const hasGenomicData = selectedDatasets.some(d => d.dataLocation.genomics)
    if (hasGenomicData) {
      recommendations.push({
        id: 'variant-harm',
        reason: 'Genomic data detected across multiple studies'
      })
    }

    // Check for imaging data
    const hasImagingData = selectedDatasets.some(d => d.dataLocation.imaging)
    if (hasImagingData) {
      recommendations.push({
        id: 'multimodal',
        reason: 'Imaging data available for integrated analysis'
      })
    }

    // Check for multiple therapeutic areas
    const therapeuticAreas = new Set(
      selectedDatasets.flatMap(d => d.therapeuticArea)
    )
    if (therapeuticAreas.size > 2) {
      recommendations.push({
        id: 'cohort-builder',
        reason: `Data spans ${therapeuticAreas.size} therapeutic areas`
      })
    }

    // Default recommendations if none match
    if (recommendations.length === 0) {
      recommendations.push({
        id: 'etl',
        reason: 'Data standardization recommended for all collections'
      })
      recommendations.push({
        id: 'early-response',
        reason: 'Popular for clinical outcome analysis'
      })
    }

    return recommendations.slice(0, 3) // Max 3 recommendations
  }

  const recommendations = getRecommendations()
  const recommendedActivityIds = new Set(recommendations.map(r => r.id))

  // Calculate data complexity metrics
  const getDataComplexity = () => {
    const modalities = new Map<string, number>()
    const therapeuticAreas = new Set<string>()
    const phases = new Map<string, number>()
    const geographies = new Set<string>()

    selectedDatasets.forEach(dataset => {
      // Count modalities based on data locations
      if (dataset.dataLocation.clinical) {
        modalities.set('Clinical', (modalities.get('Clinical') || 0) + 1)
      }
      if (dataset.dataLocation.genomics) {
        modalities.set('Genomics', (modalities.get('Genomics') || 0) + 1)
      }
      if (dataset.dataLocation.imaging) {
        modalities.set('Imaging', (modalities.get('Imaging') || 0) + 1)
      }

      // Therapeutic areas (flatten array)
      dataset.therapeuticArea.forEach(ta => therapeuticAreas.add(ta))

      phases.set(dataset.phase, (phases.get(dataset.phase) || 0) + 1)
      dataset.geography.forEach(geo => geographies.add(geo))
    })

    // Calculate access complexity
    const avgAccessBreakdown = {
      alreadyOpen: 0,
      readyToGrant: 0,
      needsApproval: 0,
      missingLocation: 0
    }
    selectedDatasets.forEach(d => {
      avgAccessBreakdown.alreadyOpen += d.accessBreakdown.alreadyOpen
      avgAccessBreakdown.readyToGrant += d.accessBreakdown.readyToGrant
      avgAccessBreakdown.needsApproval += d.accessBreakdown.needsApproval
      avgAccessBreakdown.missingLocation += d.accessBreakdown.missingLocation
    })
    const count = selectedDatasets.length
    avgAccessBreakdown.alreadyOpen = Math.round(avgAccessBreakdown.alreadyOpen / count)
    avgAccessBreakdown.readyToGrant = Math.round(avgAccessBreakdown.readyToGrant / count)
    avgAccessBreakdown.needsApproval = Math.round(avgAccessBreakdown.needsApproval / count)
    avgAccessBreakdown.missingLocation = Math.round(avgAccessBreakdown.missingLocation / count)

    const complexityScore = avgAccessBreakdown.needsApproval + avgAccessBreakdown.missingLocation
    const complexityLevel = complexityScore > 50 ? 'High' : complexityScore > 30 ? 'Medium' : 'Low'

    return {
      modalities: Array.from(modalities.entries()).sort((a, b) => b[1] - a[1]),
      therapeuticAreas: Array.from(therapeuticAreas),
      phases: Array.from(phases.entries()).sort((a, b) => b[1] - a[1]),
      geographies: Array.from(geographies),
      accessBreakdown: avgAccessBreakdown,
      complexityLevel
    }
  }

  const complexity = getDataComplexity()

  // Calculate ETA based on selected activities
  const getEstimatedTimeline = () => {
    if (selectedActivities.size === 0) {
      return {
        min: 1,
        max: 14,
        description: 'Select activities to see estimated timeline'
      }
    }

    const hasAnalysis = Array.from(selectedActivities).some(id => {
      const activity = ACTIVITIES.find(a => a.id === id)
      return activity?.category === 'analysis'
    })

    if (hasAnalysis) {
      // Analysis activities require more approvals
      return {
        min: 5,
        max: 14,
        description: 'Scientific analysis requires governance approval'
      }
    } else {
      // Engineering only
      return {
        min: 1,
        max: 5,
        description: 'Data engineering activities provision faster'
      }
    }
  }

  const timeline = getEstimatedTimeline()

  const handleContinue = () => {
    // Store selected activities
    if (typeof window !== "undefined") {
      const selected = Array.from(selectedActivities)
        .map((id) => ACTIVITIES.find((a) => a.id === id))
        .filter(Boolean)
      sessionStorage.setItem("dcm_selected_activities", JSON.stringify(selected))
    }
    router.push("/collectoid/dcm/create/agreements")
  }

  const engineeringActivities = ACTIVITIES.filter((a) => a.category === "engineering")
  const analysisActivities = ACTIVITIES.filter((a) => a.category === "analysis")

  if (selectedDatasets.length === 0) {
    return <div>Loading...</div>
  }

  return (
    <div className="flex gap-6 py-8">
      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/collectoid/dcm/create/filters")}
          className="rounded-full font-light mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Filters
        </Button>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 4 of 7</span>
          <span className="text-xs text-neutral-300">|</span>
          <span className="text-xs font-light text-neutral-600">Define Activities</span>
        </div>

        <div className="text-center mb-6">
          <div
            className={cn(
              "inline-flex items-center justify-center size-16 rounded-2xl mb-4 bg-gradient-to-br",
              scheme.bg,
              scheme.bgHover
            )}
          >
            <Target className={cn("size-8", scheme.from.replace("from-", "text-"))} />
          </div>
          <h1 className="text-3xl font-extralight text-neutral-900 mb-3 tracking-tight">
            Define Collection Purpose & Activities
          </h1>
          <p className="text-base font-light text-neutral-600 max-w-2xl mx-auto mb-3">
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
                  {/* Overview */}
                  <div>
                    <h3 className="text-lg font-normal text-neutral-900 mb-3">Why does this matter?</h3>
                    <p className="text-sm font-light text-neutral-700 leading-relaxed">
                      Different activities require different levels of data access. Data engineering activities
                      typically work with aggregated or processed data, while scientific analysis often requires
                      patient-level data access. Your selections help the system determine appropriate access
                      controls and approval workflows.
                    </p>
                  </div>

                  <Separator />

                  {/* Two Categories */}
                  <div>
                    <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                      <Wrench className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                      Data Engineering vs Scientific Analysis
                    </h3>
                    <div className="space-y-3">
                      <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                            <Wrench className="size-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-normal text-neutral-900 mb-2">Data Engineering</h4>
                            <p className="text-xs font-light text-neutral-600 leading-relaxed mb-2">
                              Activities focused on data transformation, standardization, and preparation.
                              These typically involve creating reusable data products and pipelines.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-light text-neutral-600">
                          <Unlock className="size-3.5 text-green-600" />
                          <span className="font-normal">Access Level:</span> Processed/aggregated data, lower restrictions
                        </div>
                      </div>

                      <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                            <FlaskConical className="size-5" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-normal text-neutral-900 mb-2">Scientific Analysis</h4>
                            <p className="text-xs font-light text-neutral-600 leading-relaxed mb-2">
                              Research activities requiring patient-level data for hypothesis testing, modeling,
                              and discovery. These are considered "secondary use" of clinical trial data.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-light text-neutral-600">
                          <Lock className="size-3.5 text-amber-600" />
                          <span className="font-normal">Access Level:</span> Patient-level data, requires additional approvals
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Access Level Examples */}
                  <div>
                    <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                      <Shield className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                      How Access Levels Work
                    </h3>
                    <div className="space-y-3 text-sm font-light text-neutral-700">
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-green-500 shrink-0 mt-2" />
                        <div>
                          <span className="font-normal">ETL/Standardization</span> - Users receive access to
                          processed, standardized datasets. Minimal approval required.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                        <div>
                          <span className="font-normal">Variant Harmonization</span> - Users receive genomic data
                          that's been normalized and annotated. Pre-processed for quality.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                        <div>
                          <span className="font-normal">Multimodal Fusion</span> - Users need patient-level access
                          to clinical, imaging, and genomic data. Requires governance approval.
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-purple-500 shrink-0 mt-2" />
                        <div>
                          <span className="font-normal">Cohort Builder</span> - Users can create patient cohorts,
                          requiring full patient-level data access and training completion.
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Approval Impact */}
                  <div>
                    <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                      <Users className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                      Impact on Access Provisioning
                    </h3>
                    <p className="text-sm font-light text-neutral-700 leading-relaxed mb-3">
                      Your activity selections directly affect the 20/30/40/10 breakdown you saw earlier:
                    </p>
                    <div className="space-y-2">
                      <div className="rounded-xl bg-green-50 border border-green-200 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="size-2 rounded-full bg-green-500" />
                          <p className="text-xs font-normal text-green-900">Data Engineering Activities</p>
                        </div>
                        <p className="text-xs font-light text-green-700">
                          More datasets fall into "ready to grant" category (30%). Faster provisioning with
                          fewer approval requirements.
                        </p>
                      </div>
                      <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="size-2 rounded-full bg-amber-500" />
                          <p className="text-xs font-normal text-amber-900">Scientific Analysis Activities</p>
                        </div>
                        <p className="text-xs font-light text-amber-700">
                          More datasets fall into "needs approval" category (40%). Requires governance team
                          review (GPT, TALT) before access is granted.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Multiple Selections */}
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                    <div className="flex gap-3">
                      <Info className="size-5 shrink-0 text-blue-600 mt-0.5" />
                      <div className="text-sm font-light text-blue-900">
                        <p className="mb-2 font-normal">Can I select multiple activities?</p>
                        <p className="text-blue-700 leading-relaxed text-xs">
                          Yes! You can select multiple activities from both categories. The system will grant
                          the highest access level needed across all your selections. For example, if you
                          select both ETL (engineering) and Cohort Builder (analysis), users will receive
                          patient-level data access with the appropriate approvals.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* What's Next */}
                  <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                    <div className="flex gap-3">
                      <AlertCircle className="size-5 shrink-0 text-green-600 mt-0.5" />
                      <div className="text-sm font-light text-green-900">
                        <p className="mb-2 font-normal">What happens next?</p>
                        <p className="text-green-700 leading-relaxed text-xs">
                          After selecting your activities, you'll add collection details (name, description) and
                          assign users. The system will then show you the final access provisioning breakdown and
                          initiate the automated Collectoid workflow to grant appropriate permissions.
                        </p>
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
          "rounded-2xl border p-6 mb-6 bg-gradient-to-br",
          scheme.bg.replace("500", "50"),
          "border-neutral-200"
        )}>
          <div className="flex items-start gap-4 mb-4">
            <div className={cn(
              "flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg",
              scheme.from,
              scheme.to
            )}>
              <Sparkles className="size-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-normal text-neutral-900 mb-1">
                Recommended Activities
              </h3>
              <p className="text-sm font-light text-neutral-600 mb-2">
                Based on your {selectedDatasets.length} selected datasets
              </p>
              <p className="text-xs font-light text-neutral-500 leading-relaxed">
                We've analyzed your data collection's characteristics—including available data modalities
                (clinical, genomic, imaging), therapeutic area distribution, and common usage patterns—to
                suggest activities that align with your datasets. Click any recommendation to jump to that activity.
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
                    "group flex items-center gap-2 px-4 py-2 rounded-xl border transition-all hover:shadow-md",
                    selectedActivities.has(rec.id)
                      ? cn("bg-gradient-to-r text-white border-transparent", scheme.from, scheme.to)
                      : "bg-white border-neutral-200 hover:border-neutral-300"
                  )}
                >
                  <div className="flex-1 text-left">
                    <p className={cn(
                      "text-sm font-normal",
                      selectedActivities.has(rec.id) ? "text-white" : "text-neutral-900"
                    )}>
                      {activity.name}
                    </p>
                    <p className={cn(
                      "text-xs font-light",
                      selectedActivities.has(rec.id) ? "text-white/80" : "text-neutral-500"
                    )}>
                      {rec.reason}
                    </p>
                  </div>
                  {selectedActivities.has(rec.id) ? (
                    <CheckCircle2 className="size-4 text-white shrink-0" />
                  ) : (
                    <ArrowRight className="size-4 text-neutral-400 group-hover:text-neutral-600 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Data Complexity Overview */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 mb-6">
          <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
            <Database className={cn("size-5", scheme.from.replace("from-", "text-"))} />
            Your Data Collection Overview
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Data Modalities */}
            <div>
              <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Data Modalities</p>
              <div className="space-y-1.5">
                {complexity.modalities.slice(0, 4).map(([modality, count]) => (
                  <div key={modality} className="flex items-center justify-between">
                    <span className="text-sm font-light text-neutral-700">{modality}</span>
                    <Badge variant="outline" className="text-xs font-light">
                      {count} {count === 1 ? 'dataset' : 'datasets'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Phases */}
            <div>
              <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Phase Distribution</p>
              <div className="space-y-1.5">
                {complexity.phases.map(([phase, count]) => (
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            {/* Therapeutic Areas */}
            <div>
              <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Therapeutic Areas</p>
              <div className="flex flex-wrap gap-1.5">
                {complexity.therapeuticAreas.map(ta => (
                  <Badge key={ta} variant="outline" className="text-xs font-light">
                    {ta}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Geography */}
            <div>
              <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Geography Coverage</p>
              <div className="flex flex-wrap gap-1.5">
                {complexity.geographies.map(geo => (
                  <Badge key={geo} variant="outline" className="text-xs font-light">
                    {geo}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Access Complexity */}
          <div className="pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-light text-neutral-600 uppercase tracking-wider">Access Complexity</p>
              <Badge className={cn(
                "font-light",
                complexity.complexityLevel === 'High' ? "bg-amber-100 text-amber-800" :
                complexity.complexityLevel === 'Medium' ? "bg-blue-100 text-blue-800" :
                "bg-green-100 text-green-800"
              )}>
                {complexity.complexityLevel}
              </Badge>
            </div>
            <div className="space-y-2">
              <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-neutral-100">
                <div
                  className="bg-green-500"
                  style={{ width: `${complexity.accessBreakdown.alreadyOpen}%` }}
                />
                <div
                  className={cn("bg-gradient-to-r", scheme.from, scheme.to)}
                  style={{ width: `${complexity.accessBreakdown.readyToGrant}%` }}
                />
                <div
                  className="bg-amber-500"
                  style={{ width: `${complexity.accessBreakdown.needsApproval}%` }}
                />
                <div
                  className="bg-neutral-400"
                  style={{ width: `${complexity.accessBreakdown.missingLocation}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs font-light text-neutral-600">
                <span>{complexity.accessBreakdown.alreadyOpen}% open</span>
                <span>{complexity.accessBreakdown.readyToGrant}% ready</span>
                <span>{complexity.accessBreakdown.needsApproval}% approval</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Status */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-neutral-600" />
          <span className="text-sm font-light text-neutral-600">
            {selectedActivities.size} activit{selectedActivities.size !== 1 ? "ies" : "y"} selected
          </span>
        </div>
      </div>

      {/* Data Engineering Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Wrench className={cn("size-5", scheme.from.replace("from-", "text-"))} />
          <h2 className="text-xl font-light text-neutral-900">Data Engineering</h2>
        </div>
        <p className="text-sm font-light text-neutral-600 mb-4">
          Select all that apply for data transformation and preparation:
        </p>

        <div className="space-y-3">
          {engineeringActivities.map((activity) => (
            <div
              key={activity.id}
              id={`activity-${activity.id}`}
              role="button"
              tabIndex={0}
              onClick={() => toggleActivity(activity.id)}
              onKeyDown={(e) => e.key === "Enter" && toggleActivity(activity.id)}
              className={cn(
                "w-full text-left p-5 rounded-2xl border transition-all cursor-pointer",
                selectedActivities.has(activity.id)
                  ? cn(
                      scheme.from.replace("from-", "border-").replace("500", "200"),
                      "bg-gradient-to-r",
                      scheme.bg,
                      scheme.bgHover
                    )
                  : recommendedActivityIds.has(activity.id)
                    ? cn(
                        "bg-white hover:shadow-sm",
                        scheme.from.replace("from-", "border-").replace("500", "100")
                      )
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm",
                highlightedActivity === activity.id && "ring-2 ring-offset-2",
                highlightedActivity === activity.id && scheme.from.replace("from-", "ring-")
              )}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedActivities.has(activity.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-normal text-neutral-900">
                      {activity.name}
                    </h3>
                    {recommendedActivityIds.has(activity.id) && (
                      <Sparkles className={cn("size-4", scheme.from.replace("from-", "text-"))} />
                    )}
                  </div>
                  <p className="text-sm font-light text-neutral-600 leading-relaxed mb-3">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Info className="size-3 text-neutral-400" />
                    <p className="text-xs font-light text-neutral-500">
                      Access Level: {activity.accessLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scientific Analysis Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <FlaskConical className={cn("size-5", scheme.from.replace("from-", "text-"))} />
          <h2 className="text-xl font-light text-neutral-900">
            Scientific Analysis - Secondary use of patient level data
          </h2>
        </div>
        <p className="text-sm font-light text-neutral-600 mb-4">
          Select all that apply for research and analysis:
        </p>

        <div className="space-y-3">
          {analysisActivities.map((activity) => (
            <div
              key={activity.id}
              id={`activity-${activity.id}`}
              role="button"
              tabIndex={0}
              onClick={() => toggleActivity(activity.id)}
              onKeyDown={(e) => e.key === "Enter" && toggleActivity(activity.id)}
              className={cn(
                "w-full text-left p-5 rounded-2xl border transition-all cursor-pointer",
                selectedActivities.has(activity.id)
                  ? cn(
                      scheme.from.replace("from-", "border-").replace("500", "200"),
                      "bg-gradient-to-r",
                      scheme.bg,
                      scheme.bgHover
                    )
                  : recommendedActivityIds.has(activity.id)
                    ? cn(
                        "bg-white hover:shadow-sm",
                        scheme.from.replace("from-", "border-").replace("500", "100")
                      )
                    : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm",
                highlightedActivity === activity.id && "ring-2 ring-offset-2",
                highlightedActivity === activity.id && scheme.from.replace("from-", "ring-")
              )}
            >
              <div className="flex items-start gap-4">
                <Checkbox
                  checked={selectedActivities.has(activity.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-normal text-neutral-900">
                      {activity.name}
                    </h3>
                    {recommendedActivityIds.has(activity.id) && (
                      <Sparkles className={cn("size-4", scheme.from.replace("from-", "text-"))} />
                    )}
                  </div>
                  <p className="text-sm font-light text-neutral-600 leading-relaxed mb-3">
                    {activity.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Info className="size-3 text-neutral-400" />
                    <p className="text-xs font-light text-neutral-500">
                      Access Level: {activity.accessLevel}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Notice */}
      <div className="rounded-2xl p-4 bg-blue-50 border border-blue-100 mb-6">
        <div className="flex gap-3">
          <Info className="size-5 shrink-0 text-blue-600 mt-0.5" />
          <div className="text-sm font-light text-blue-900">
            <p className="mb-1">
              <span className="font-normal">Note:</span> Scientific Analysis selections require
              patient-level data access
            </p>
            <p className="text-blue-700">
              These activities may require additional approvals from governance teams (GPT, TALT)
              and will be reflected in your access provisioning breakdown.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 4 of 7</span>
          <span className="text-xs text-neutral-300">|</span>
          <span className="text-xs font-light text-neutral-600">Define Activities</span>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/collectoid/dcm/create/filters")}
            className="flex-1 h-12 rounded-2xl font-light border-neutral-200"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Dataset Selection
          </Button>
          <Button
            onClick={handleContinue}
            disabled={selectedActivities.size === 0}
            className={cn(
              "flex-1 h-12 rounded-2xl font-light shadow-lg hover:shadow-xl transition-all",
              selectedActivities.size > 0
                ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            Continue to Agreements
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
      </div>

      {/* Sticky ETA Panel */}
      <div className="w-80 sticky top-8 h-fit">
        <Card className="border-neutral-200 rounded-2xl overflow-hidden shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-full bg-gradient-to-r text-white",
                scheme.from,
                scheme.to
              )}>
                <Clock className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-normal text-neutral-900">
                  Estimated Timeline
                </h3>
                <p className="text-2xl font-light text-neutral-900">
                  {timeline.min === timeline.max ? `${timeline.min}` : `${timeline.min}-${timeline.max}`} days
                </p>
              </div>
            </div>

            <p className="text-sm font-light text-neutral-600 mb-6">
              {timeline.description}
            </p>

            <Separator className="mb-6" />

            {/* Timeline Breakdown */}
            <div className="space-y-4">
              <h4 className="text-sm font-normal text-neutral-900 mb-3">Access Provisioning Timeline</h4>

              {/* Already Open */}
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="size-4 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-normal text-neutral-900">Already Open</p>
                    <Badge className="bg-green-100 text-green-800 font-light text-xs">
                      {complexity.accessBreakdown.alreadyOpen}%
                    </Badge>
                  </div>
                  <p className="text-xs font-light text-neutral-600">Instant access</p>
                </div>
              </div>

              {/* Ready to Grant */}
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full",
                  scheme.bg.replace("500", "100")
                )}>
                  <Zap className={cn("size-4", scheme.from.replace("from-", "text-"))} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-normal text-neutral-900">Ready to Grant</p>
                    <Badge className={cn(
                      "font-light text-xs",
                      scheme.bg.replace("500", "100"),
                      scheme.from.replace("from-", "text-")
                    )}>
                      {complexity.accessBreakdown.readyToGrant}%
                    </Badge>
                  </div>
                  <p className="text-xs font-light text-neutral-600">1-2 days (automated)</p>
                </div>
              </div>

              {/* Needs Approval */}
              <div className="flex items-start gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                  <Users className="size-4 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-normal text-neutral-900">Needs Approval</p>
                    <Badge className="bg-amber-100 text-amber-800 font-light text-xs">
                      {complexity.accessBreakdown.needsApproval}%
                    </Badge>
                  </div>
                  <p className="text-xs font-light text-neutral-600">
                    {selectedActivities.size > 0 && Array.from(selectedActivities).some(id => {
                      const activity = ACTIVITIES.find(a => a.id === id)
                      return activity?.category === 'analysis'
                    }) ? '5-14 days (GPT/TALT review)' : '3-7 days (standard review)'}
                  </p>
                </div>
              </div>

              {/* Missing Items */}
              {complexity.accessBreakdown.missingLocation > 0 && (
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100">
                    <AlertCircle className="size-4 text-neutral-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-normal text-neutral-900">Missing Items</p>
                      <Badge className="bg-neutral-100 text-neutral-800 font-light text-xs">
                        {complexity.accessBreakdown.missingLocation}%
                      </Badge>
                    </div>
                    <p className="text-xs font-light text-neutral-600">Variable (location/training)</p>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Factors Affecting Timeline */}
            <div>
              <h4 className="text-sm font-normal text-neutral-900 mb-3 flex items-center gap-2">
                <TrendingUp className="size-4 text-neutral-600" />
                Factors Affecting Timeline
              </h4>
              <div className="space-y-2 text-xs font-light text-neutral-600">
                <div className="flex items-start gap-2">
                  <div className="size-1 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                  <p>{selectedDatasets.length} datasets selected</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-1 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                  <p>
                    {selectedActivities.size === 0 ? 'No activities selected yet' :
                     Array.from(selectedActivities).some(id => {
                       const activity = ACTIVITIES.find(a => a.id === id)
                       return activity?.category === 'analysis'
                     }) ? 'Scientific analysis requires additional approvals' :
                     'Data engineering provisions faster'}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-1 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                  <p>Governance teams typically respond in 3-5 business days</p>
                </div>
              </div>
            </div>

            {selectedActivities.size > 0 && (
              <>
                <Separator className="my-6" />
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                  <div className="flex gap-2">
                    <Info className="size-4 shrink-0 text-blue-600 mt-0.5" />
                    <p className="text-xs font-light text-blue-700 leading-relaxed">
                      Timeline starts after you complete collection setup and submit for provisioning.
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

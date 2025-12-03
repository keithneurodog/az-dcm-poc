"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { MOCK_DATASETS, filterDatasets } from "@/lib/dcm-mock-data"
import {
  Sparkles,
  ArrowLeft,
  Check,
  AlertTriangle,
  X,
  Database,
  Loader2,
  ChevronRight,
  ChevronDown,
  Shield,
  Filter,
  Clock,
  CheckCircle2,
  Zap,
  LayoutGrid,
  List,
  HelpCircle,
  SlidersHorizontal,
  Users,
  MapPin,
  ArrowUpDown,
  MessageSquare,
  Target,
  Lightbulb,
  XCircle,
  Info,
} from "lucide-react"

// Access status grouping configuration
const ACCESS_GROUPS = [
  {
    id: "open",
    label: "Open Access",
    icon: CheckCircle2,
    color: "emerald",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    iconColor: "text-emerald-600",
    description: "Instant access - no action needed",
    filterFn: (d: typeof MOCK_DATASETS[0]) => d.accessBreakdown.alreadyOpen >= 50,
  },
  {
    id: "ready",
    label: "Ready to Grant",
    icon: Zap,
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    iconColor: "text-blue-600",
    description: "Auto-provisioned when you request",
    filterFn: (d: typeof MOCK_DATASETS[0]) =>
      d.accessBreakdown.alreadyOpen < 50 && d.accessBreakdown.readyToGrant >= 30,
  },
  {
    id: "approval",
    label: "Needs Approval",
    icon: Clock,
    color: "amber",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    iconColor: "text-amber-600",
    description: "Requires review from data governance",
    filterFn: (d: typeof MOCK_DATASETS[0]) =>
      d.accessBreakdown.alreadyOpen < 50 &&
      d.accessBreakdown.readyToGrant < 30 &&
      d.accessBreakdown.needsApproval >= 30,
  },
  {
    id: "missing",
    label: "Missing / Blocked",
    icon: AlertTriangle,
    color: "neutral",
    bgColor: "bg-neutral-50",
    borderColor: "border-neutral-200",
    textColor: "text-neutral-600",
    iconColor: "text-neutral-500",
    description: "Data location unknown or training required",
    filterFn: (d: typeof MOCK_DATASETS[0]) =>
      d.accessBreakdown.alreadyOpen < 50 &&
      d.accessBreakdown.readyToGrant < 30 &&
      d.accessBreakdown.needsApproval < 30,
  },
]

// Filter options
const PHASE_OPTIONS = ["I", "II", "III", "IV"]
const STATUS_OPTIONS = ["Active", "Closed"]
const THERAPEUTIC_AREAS = ["Oncology", "Cardiology", "Neurology", "Immunology", "Endocrinology"]
const GEOGRAPHY_OPTIONS = ["US", "EU", "Asia", "Global"]

export default function VariationDatasets() {
  const { scheme } = useColorScheme()
  const router = useRouter()

  // Core states
  const [prompt, setPrompt] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Smart filter state
  const [smartFilterQuery, setSmartFilterQuery] = useState("")
  const [smartFilterActive, setSmartFilterActive] = useState(false)

  // Manual filters
  const [phaseFilters, setPhaseFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [therapeuticAreaFilters, setTherapeuticAreaFilters] = useState<string[]>([])
  const [geographyFilters, setGeographyFilters] = useState<string[]>([])

  // Selection
  const [selectedDatasets, setSelectedDatasets] = useState<Set<string>>(new Set())

  // View
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [sortBy, setSortBy] = useState<"relevance" | "name" | "phase" | "access">("relevance")
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  // Filter datasets based on all active filters
  // When smartFilterActive is false, ignore AI-set filters and show all datasets
  const filteredDatasets = useMemo(() => {
    // If smart filter is paused, only apply manual filters (not AI-extracted ones)
    const activePhaseFilters = smartFilterActive ? phaseFilters : []
    const activeTherapeuticAreaFilters = smartFilterActive ? therapeuticAreaFilters : []

    let result = filterDatasets(MOCK_DATASETS, {
      phase: activePhaseFilters,
      status: statusFilters,
      geography: geographyFilters,
    })

    // Apply therapeutic area filter (only when smart filter is active)
    if (activeTherapeuticAreaFilters.length > 0) {
      result = result.filter(d =>
        d.therapeuticArea.some(ta =>
          activeTherapeuticAreaFilters.some(filter => ta.toLowerCase().includes(filter.toLowerCase()))
        )
      )
    }

    // Sort results
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "phase") {
      result = [...result].sort((a, b) => a.phase.localeCompare(b.phase))
    } else if (sortBy === "access") {
      result = [...result].sort((a, b) => b.accessBreakdown.alreadyOpen - a.accessBreakdown.alreadyOpen)
    }

    return result
  }, [phaseFilters, statusFilters, therapeuticAreaFilters, geographyFilters, sortBy, smartFilterActive])

  // Group datasets by access status
  const groupedDatasets = useMemo(() => {
    const groups: Record<string, typeof MOCK_DATASETS> = {}

    ACCESS_GROUPS.forEach(group => {
      groups[group.id] = filteredDatasets.filter(group.filterFn)
    })

    return groups
  }, [filteredDatasets])

  // Calculate selection statistics
  const selectionStats = useMemo(() => {
    const selected = filteredDatasets.filter(d => selectedDatasets.has(d.id))
    if (selected.length === 0) return null

    const totalOpen = selected.reduce((sum, d) => sum + d.accessBreakdown.alreadyOpen, 0) / selected.length
    const totalReady = selected.reduce((sum, d) => sum + d.accessBreakdown.readyToGrant, 0) / selected.length
    const totalApproval = selected.reduce((sum, d) => sum + d.accessBreakdown.needsApproval, 0) / selected.length
    const totalMissing = selected.reduce((sum, d) => sum + d.accessBreakdown.missingLocation, 0) / selected.length

    return {
      count: selected.length,
      alreadyOpen: Math.round(totalOpen),
      readyToGrant: Math.round(totalReady),
      needsApproval: Math.round(totalApproval),
      missingLocation: Math.round(totalMissing),
    }
  }, [selectedDatasets, filteredDatasets])

  // Check if any filters are active
  const hasActiveFilters = phaseFilters.length > 0 || statusFilters.length > 0 ||
    therapeuticAreaFilters.length > 0 || geographyFilters.length > 0

  // Handle AI discovery
  const handleDiscover = async () => {
    if (!prompt.trim()) return

    setIsAnalyzing(true)
    setShowResults(false)

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1800))

    // Simulate AI extracting filters from prompt
    const lowerPrompt = prompt.toLowerCase()

    // Auto-detect therapeutic area
    if (lowerPrompt.includes("oncology") || lowerPrompt.includes("cancer")) {
      setTherapeuticAreaFilters(["Oncology"])
    }
    if (lowerPrompt.includes("cardio") || lowerPrompt.includes("heart")) {
      setTherapeuticAreaFilters(["Cardiology"])
    }

    // Auto-detect phase
    if (lowerPrompt.includes("phase iii") || lowerPrompt.includes("phase 3")) {
      setPhaseFilters(["III"])
    }
    if (lowerPrompt.includes("phase ii") || lowerPrompt.includes("phase 2")) {
      setPhaseFilters(["II"])
    }

    setSmartFilterQuery(prompt)
    setSmartFilterActive(true)
    setIsAnalyzing(false)
    setHasSearched(true)

    // Trigger animated reveal
    setTimeout(() => setShowResults(true), 100)
  }

  // Selection helpers
  const toggleDataset = (id: string) => {
    setSelectedDatasets(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelectedDatasets(new Set(filteredDatasets.map(d => d.id)))
  }

  const selectGroup = (groupId: string) => {
    const group = ACCESS_GROUPS.find(g => g.id === groupId)
    if (!group) return

    const groupDatasets = filteredDatasets.filter(group.filterFn)
    setSelectedDatasets(prev => {
      const next = new Set(prev)
      groupDatasets.forEach(d => next.add(d.id))
      return next
    })
  }

  const selectAllOpen = () => {
    const openGroup = ACCESS_GROUPS.find(g => g.id === "open")
    if (openGroup) {
      const openDatasets = filteredDatasets.filter(openGroup.filterFn)
      setSelectedDatasets(new Set(openDatasets.map(d => d.id)))
    }
  }

  const selectAllReady = () => {
    const readyGroup = ACCESS_GROUPS.find(g => g.id === "ready")
    if (readyGroup) {
      const readyDatasets = filteredDatasets.filter(readyGroup.filterFn)
      setSelectedDatasets(prev => {
        const next = new Set(prev)
        readyDatasets.forEach(d => next.add(d.id))
        return next
      })
    }
  }

  const clearSelection = () => setSelectedDatasets(new Set())

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  const clearAllFilters = () => {
    setPhaseFilters([])
    setStatusFilters([])
    setTherapeuticAreaFilters([])
    setGeographyFilters([])
    setSmartFilterActive(false)
    setSmartFilterQuery("")
  }

  const handleRequestAccess = () => {
    if (selectedDatasets.size === 0) return

    // Store selected datasets in sessionStorage
    sessionStorage.setItem("selected_datasets_for_request", JSON.stringify(Array.from(selectedDatasets)))
    router.push("/collectoid/requests/new")
  }

  // Filter toggle helper
  const toggleFilter = (
    value: string,
    currentFilters: string[],
    setFilters: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentFilters.includes(value)) {
      setFilters(currentFilters.filter(f => f !== value))
    } else {
      setFilters([...currentFilters, value])
    }
  }

  return (
    <div className="py-8 pb-32">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/collectoid/discover")}
          className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Discovery
        </button>

        <div className="text-center">
          <div className={cn(
            "inline-flex items-center justify-center size-16 rounded-2xl mb-6 bg-gradient-to-br",
            scheme.from,
            scheme.to
          )}>
            <Database className="size-8 text-white" />
          </div>
          <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight mb-3">
            Dataset Explorer
          </h1>
          <p className="text-base font-light text-neutral-600 max-w-2xl mx-auto mb-3">
            Find and select individual datasets, filter by access status, and request access
          </p>
        </div>
      </div>

      {/* Hero AI Smart Filter */}
      <div className="mb-8">
        <div className="relative max-w-4xl mx-auto">
          {/* Animated gradient border */}
          <div className={cn(
            "absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-75 blur-sm transition-opacity duration-500",
            scheme.from,
            scheme.to,
            isAnalyzing ? "animate-pulse" : ""
          )} />

          <Card className={cn(
            "relative border-2 rounded-2xl overflow-hidden bg-white",
            smartFilterActive
              ? scheme.from.replace("from-", "border-")
              : "border-neutral-200"
          )}>
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className={cn(
                  "flex size-14 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg shrink-0",
                  scheme.from,
                  scheme.to
                )}>
                  <Sparkles className="size-7" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-light text-neutral-900">AI Smart Discovery</h2>
                    <Badge className={cn(
                      "font-light text-xs",
                      scheme.from.replace("from-", "bg-"),
                      "text-white"
                    )}>
                      AI
                    </Badge>
                    {smartFilterActive && (
                      <Badge className="font-light text-xs bg-emerald-100 text-emerald-700">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm font-light text-neutral-600 mb-3">
                    Describe your research needs in natural language and let AI find the right data
                  </p>

                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder='Describe what data you need... e.g., "Phase III oncology studies with biomarker data for ML research"'
                    className={cn(
                      "min-h-[100px] text-base font-light border-2 rounded-xl resize-none transition-all",
                      "hover:border-neutral-300 focus-visible:border-current",
                      smartFilterActive
                        ? scheme.from.replace("from-", "border-").replace("-500", "-200")
                        : "border-neutral-200"
                    )}
                    disabled={isAnalyzing}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleDiscover()
                      }
                    }}
                  />

                  {/* Smart filter indicator - shows when a search has been done */}
                  {smartFilterQuery && (
                    <div className={cn(
                      "mt-3 flex items-center justify-between p-3 rounded-xl border transition-all",
                      smartFilterActive
                        ? cn("bg-emerald-50 border-emerald-200")
                        : "bg-neutral-50 border-neutral-200"
                    )}>
                      <div className="flex items-center gap-2 text-sm font-light">
                        {smartFilterActive ? (
                          <>
                            <Check className="size-4 text-emerald-600" />
                            <span className="text-emerald-700">
                              AI filter active — showing <span className="font-normal">{filteredDatasets.length}</span> matching datasets
                            </span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="size-4 text-neutral-400" />
                            <span className="text-neutral-500">
                              AI filter paused — showing all <span className="font-normal">{MOCK_DATASETS.length}</span> datasets
                            </span>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-light text-neutral-500">
                          {smartFilterActive ? "Active" : "Paused"}
                        </span>
                        <Switch
                          checked={smartFilterActive}
                          onCheckedChange={setSmartFilterActive}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSmartFilterActive(false)
                            setSmartFilterQuery("")
                            setPrompt("")
                            clearAllFilters()
                          }}
                          className="h-8 px-2 text-neutral-500 hover:text-red-600"
                          title="Clear AI filter"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 mt-4 justify-end">
                    {hasSearched && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPrompt("")
                          setSmartFilterQuery("")
                          setSmartFilterActive(false)
                          setHasSearched(false)
                          setShowResults(false)
                          clearAllFilters()
                        }}
                        className="rounded-xl font-light border-neutral-200"
                      >
                        New Search
                      </Button>
                    )}
                    <Button
                      onClick={handleDiscover}
                      disabled={isAnalyzing || !prompt.trim()}
                      className={cn(
                        "rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all px-6",
                        scheme.from,
                        scheme.to
                      )}
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="size-4 mr-2" />
                          Discover Datasets
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Example prompts and help guide (before first search) */}
        {!hasSearched && (
          <div className="mt-6 text-center">
            <p className="text-sm font-light text-neutral-600 mb-3">
              Try these examples:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {[
                "Phase III oncology studies with biomarker data",
                "Cardiovascular trials with imaging data in Europe",
                "Closed studies with patient outcomes for ML research",
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  className="px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-light text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-all"
                >
                  "{example}"
                </button>
              ))}
            </div>

            {/* Help Link */}
            <Sheet>
              <SheetTrigger asChild>
                <button className={cn(
                  "inline-flex items-center gap-2 text-sm font-light transition-colors",
                  scheme.from.replace("from-", "text-"),
                  "hover:underline"
                )}>
                  <HelpCircle className="size-4" />
                  New to AI-powered search? Learn how to write effective prompts
                </button>
              </SheetTrigger>
              <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
                <div className="px-6 pb-6">
                  <SheetHeader>
                    <SheetTitle className="text-2xl font-light text-neutral-900 flex items-center gap-2">
                      <MessageSquare className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                      Writing Effective Discovery Prompts
                    </SheetTitle>
                    <SheetDescription className="font-light">
                      Get better results by describing your data needs clearly
                    </SheetDescription>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    {/* Overview */}
                    <div>
                      <h3 className="text-lg font-normal text-neutral-900 mb-3">How does this work?</h3>
                      <p className="text-sm font-light text-neutral-700 leading-relaxed">
                        Our AI analyzes your natural language description to understand what data you need.
                        It extracts key concepts like disease areas, data types, and intended use, then matches
                        them against our dataset catalog. The more specific you are, the better the results!
                      </p>
                    </div>

                    <Separator />

                    {/* What to Include */}
                    <div>
                      <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                        <Target className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                        What to Include in Your Prompt
                      </h3>
                      <div className="space-y-3">
                        <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white bg-gradient-to-br mt-0.5",
                              scheme.from,
                              scheme.to
                            )}>
                              1
                            </div>
                            <div>
                              <h4 className="text-sm font-normal text-neutral-900 mb-1">Disease or therapeutic area</h4>
                              <p className="text-xs font-light text-neutral-600 leading-relaxed">
                                e.g., "lung cancer", "cardiovascular", "immunotherapy", "NSCLC", "melanoma"
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white bg-gradient-to-br mt-0.5",
                              scheme.from,
                              scheme.to
                            )}>
                              2
                            </div>
                            <div>
                              <h4 className="text-sm font-normal text-neutral-900 mb-1">Data types you need</h4>
                              <p className="text-xs font-light text-neutral-600 leading-relaxed">
                                e.g., "ctDNA biomarkers", "genomic profiling", "imaging data", "patient outcomes", "clinical trial data"
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white bg-gradient-to-br mt-0.5",
                              scheme.from,
                              scheme.to
                            )}>
                              3
                            </div>
                            <div>
                              <h4 className="text-sm font-normal text-neutral-900 mb-1">Your intended use</h4>
                              <p className="text-xs font-light text-neutral-600 leading-relaxed">
                                e.g., "ML model training", "publication", "biomarker discovery", "outcome prediction"
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white bg-gradient-to-br mt-0.5",
                              scheme.from,
                              scheme.to
                            )}>
                              4
                            </div>
                            <div>
                              <h4 className="text-sm font-normal text-neutral-900 mb-1">Study characteristics (optional)</h4>
                              <p className="text-xs font-light text-neutral-600 leading-relaxed">
                                e.g., "Phase III trials", "closed studies", "multi-site studies", "specific regions"
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Good vs Bad Examples */}
                    <div>
                      <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                        <Lightbulb className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                        Good vs. Bad Prompts
                      </h3>

                      {/* Good Examples */}
                      <div className="space-y-3 mb-4">
                        <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
                            <Badge className="bg-green-100 text-green-800 font-light text-xs">
                              Excellent
                            </Badge>
                          </div>
                          <p className="text-sm font-light text-green-900 italic">
                            "I need lung cancer data with ctDNA biomarker monitoring from immunotherapy trials for ML-based outcome prediction. Planning to publish results."
                          </p>
                          <p className="text-xs font-light text-green-700 mt-2">
                            Why it works: Specifies disease, data type, trial context, intended use (ML + publication)
                          </p>
                        </div>

                        <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <CheckCircle2 className="size-4 text-green-600 shrink-0 mt-0.5" />
                            <Badge className="bg-green-100 text-green-800 font-light text-xs">
                              Good
                            </Badge>
                          </div>
                          <p className="text-sm font-light text-green-900 italic">
                            "Show me Phase III oncology studies with genomic profiling data for biomarker discovery"
                          </p>
                          <p className="text-xs font-light text-green-700 mt-2">
                            Why it works: Clear therapeutic area, data type, phase, and research goal
                          </p>
                        </div>
                      </div>

                      {/* Bad Examples */}
                      <div className="space-y-3">
                        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <XCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                            <Badge className="bg-red-100 text-red-800 font-light text-xs">
                              Too vague
                            </Badge>
                          </div>
                          <p className="text-sm font-light text-red-900 italic">
                            "I need some data"
                          </p>
                          <p className="text-xs font-light text-red-700 mt-2">
                            Problem: No disease area, data type, or intended use specified
                          </p>
                        </div>

                        <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                          <div className="flex items-start gap-2 mb-2">
                            <XCircle className="size-4 text-red-600 shrink-0 mt-0.5" />
                            <Badge className="bg-red-100 text-red-800 font-light text-xs">
                              Missing context
                            </Badge>
                          </div>
                          <p className="text-sm font-light text-red-900 italic">
                            "cancer data"
                          </p>
                          <p className="text-xs font-light text-red-700 mt-2">
                            Problem: Which cancer type? What kind of data? For what purpose?
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Understanding Results */}
                    <div>
                      <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                        <Zap className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                        Understanding Your Results
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className={cn("size-5 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                          <div>
                            <p className="text-sm font-light text-neutral-700 leading-relaxed">
                              <span className="font-normal">Access Status Groups</span> - Datasets are grouped by how quickly you can access them (Open, Ready to Grant, Needs Approval, Missing)
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className={cn("size-5 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                          <div>
                            <p className="text-sm font-light text-neutral-700 leading-relaxed">
                              <span className="font-normal">Access Breakdown Bar</span> - Visual indicator showing the percentage of data in each access status
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className={cn("size-5 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                          <div>
                            <p className="text-sm font-light text-neutral-700 leading-relaxed">
                              <span className="font-normal">Filters</span> - Refine results by Phase, Status, Therapeutic Area, or Region after AI discovery
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CheckCircle2 className={cn("size-5 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                          <div>
                            <p className="text-sm font-light text-neutral-700 leading-relaxed">
                              <span className="font-normal">Bulk Selection</span> - Quickly select all datasets, or just those with Open or Ready access
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Pro Tips */}
                    <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                      <div className="flex gap-3">
                        <Info className="size-5 shrink-0 text-blue-600 mt-0.5" />
                        <div className="text-sm font-light text-blue-900">
                          <p className="mb-2 font-normal">Pro Tips</p>
                          <ul className="text-blue-700 leading-relaxed space-y-1">
                            <li>- Use "Select All Open" to quickly grab datasets you can access immediately</li>
                            <li>- Toggle between Card and Table view for different browsing experiences</li>
                            <li>- Collapse access groups you're not interested in to focus on relevant datasets</li>
                            <li>- Check the selection footer for a breakdown of access status before requesting</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        )}
      </div>

      {/* Analyzing State */}
      {isAnalyzing && (
        <div className="flex flex-col items-center justify-center py-16 animate-in fade-in duration-300">
          <div className={cn(
            "size-20 rounded-full bg-gradient-to-r flex items-center justify-center mb-6 shadow-lg",
            scheme.from, scheme.to
          )}>
            <Loader2 className="size-10 text-white animate-spin" />
          </div>
          <p className="text-xl font-light text-neutral-700 mb-2">Analyzing your request...</p>
          <p className="text-sm font-light text-neutral-500">Finding relevant datasets and setting filters</p>
        </div>
      )}

      {/* Results Section */}
      {hasSearched && !isAnalyzing && (
        <div className={cn(
          "transition-all duration-500",
          showResults
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        )}>
          {/* Sticky Filter Bar */}
          <div className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-white/95 backdrop-blur-xl border-b border-neutral-100 mb-6">
            <div className="flex items-center justify-between gap-4">
              {/* Filter Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-sm font-light text-neutral-600 mr-2">
                  <Filter className="size-4" />
                  <span>Filters</span>
                </div>

                {/* Phase Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-xl font-light h-9",
                        phaseFilters.length > 0 && cn(
                          scheme.from.replace("from-", "border-").replace("-500", "-300"),
                          scheme.from.replace("from-", "bg-").replace("-500", "-50")
                        )
                      )}
                    >
                      Phase
                      {phaseFilters.length > 0 && (
                        <Badge className="ml-2 h-5 px-1.5 text-xs font-light">{phaseFilters.length}</Badge>
                      )}
                      <ChevronDown className="size-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    {PHASE_OPTIONS.map(phase => (
                      <label
                        key={phase}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={phaseFilters.includes(phase)}
                          onCheckedChange={() => toggleFilter(phase, phaseFilters, setPhaseFilters)}
                        />
                        <span className="text-sm font-light">Phase {phase}</span>
                      </label>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Status Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-xl font-light h-9",
                        statusFilters.length > 0 && cn(
                          scheme.from.replace("from-", "border-").replace("-500", "-300"),
                          scheme.from.replace("from-", "bg-").replace("-500", "-50")
                        )
                      )}
                    >
                      Status
                      {statusFilters.length > 0 && (
                        <Badge className="ml-2 h-5 px-1.5 text-xs font-light">{statusFilters.length}</Badge>
                      )}
                      <ChevronDown className="size-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    {STATUS_OPTIONS.map(status => (
                      <label
                        key={status}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={statusFilters.includes(status)}
                          onCheckedChange={() => toggleFilter(status, statusFilters, setStatusFilters)}
                        />
                        <span className="text-sm font-light">{status}</span>
                      </label>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Therapeutic Area Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-xl font-light h-9",
                        therapeuticAreaFilters.length > 0 && cn(
                          scheme.from.replace("from-", "border-").replace("-500", "-300"),
                          scheme.from.replace("from-", "bg-").replace("-500", "-50")
                        )
                      )}
                    >
                      Area
                      {therapeuticAreaFilters.length > 0 && (
                        <Badge className="ml-2 h-5 px-1.5 text-xs font-light">{therapeuticAreaFilters.length}</Badge>
                      )}
                      <ChevronDown className="size-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56 p-2" align="start">
                    {THERAPEUTIC_AREAS.map(area => (
                      <label
                        key={area}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={therapeuticAreaFilters.includes(area)}
                          onCheckedChange={() => toggleFilter(area, therapeuticAreaFilters, setTherapeuticAreaFilters)}
                        />
                        <span className="text-sm font-light">{area}</span>
                      </label>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Geography Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-xl font-light h-9",
                        geographyFilters.length > 0 && cn(
                          scheme.from.replace("from-", "border-").replace("-500", "-300"),
                          scheme.from.replace("from-", "bg-").replace("-500", "-50")
                        )
                      )}
                    >
                      <MapPin className="size-3 mr-1" />
                      Region
                      {geographyFilters.length > 0 && (
                        <Badge className="ml-2 h-5 px-1.5 text-xs font-light">{geographyFilters.length}</Badge>
                      )}
                      <ChevronDown className="size-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    {GEOGRAPHY_OPTIONS.map(geo => (
                      <label
                        key={geo}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={geographyFilters.includes(geo)}
                          onCheckedChange={() => toggleFilter(geo, geographyFilters, setGeographyFilters)}
                        />
                        <span className="text-sm font-light">{geo}</span>
                      </label>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="rounded-xl font-light h-9 text-neutral-500 hover:text-red-600"
                  >
                    <X className="size-3 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-3">
                {/* Results Count */}
                <div className="text-sm font-light text-neutral-600">
                  <span className="font-normal text-neutral-900">{filteredDatasets.length}</span> datasets
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Sort */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl font-light h-9">
                      <ArrowUpDown className="size-3 mr-1" />
                      Sort
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="end">
                    {[
                      { value: "relevance", label: "Relevance" },
                      { value: "name", label: "Name" },
                      { value: "phase", label: "Phase" },
                      { value: "access", label: "Access Status" },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as typeof sortBy)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm font-light transition-colors",
                          sortBy === option.value
                            ? cn("bg-neutral-100", scheme.from.replace("from-", "text-"))
                            : "hover:bg-neutral-50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* View Toggle */}
                <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "cards"
                        ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                        : "text-neutral-500 hover:bg-neutral-50"
                    )}
                  >
                    <LayoutGrid className="size-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "table"
                        ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                        : "text-neutral-500 hover:bg-neutral-50"
                    )}
                  >
                    <List className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs font-light text-neutral-500">Active:</span>
                {phaseFilters.map(phase => (
                  <Badge
                    key={`phase-${phase}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(phase, phaseFilters, setPhaseFilters)}
                  >
                    Phase {phase}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}
                {statusFilters.map(status => (
                  <Badge
                    key={`status-${status}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(status, statusFilters, setStatusFilters)}
                  >
                    {status}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}
                {therapeuticAreaFilters.map(area => (
                  <Badge
                    key={`area-${area}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(area, therapeuticAreaFilters, setTherapeuticAreaFilters)}
                  >
                    {area}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}
                {geographyFilters.map(geo => (
                  <Badge
                    key={`geo-${geo}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(geo, geographyFilters, setGeographyFilters)}
                  >
                    {geo}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Selection Controls */}
            <div className="flex items-center gap-3 mt-3">
              <span className="text-xs font-light text-neutral-500">Select:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAll}
                className="h-7 px-2 text-xs font-light rounded-lg"
              >
                All ({filteredDatasets.length})
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllOpen}
                className="h-7 px-2 text-xs font-light rounded-lg text-emerald-700"
              >
                All Open
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={selectAllReady}
                className="h-7 px-2 text-xs font-light rounded-lg text-blue-700"
              >
                All Ready
              </Button>
              {selectedDatasets.size > 0 && (
                <>
                  <Separator orientation="vertical" className="h-4" />
                  <span className="text-xs font-normal text-neutral-900">
                    {selectedDatasets.size} selected
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSelection}
                    className="h-7 px-2 text-xs font-light rounded-lg text-red-600"
                  >
                    Clear
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Grouped Results */}
          <div className="space-y-6">
            {ACCESS_GROUPS.map(group => {
              const GroupIcon = group.icon
              const datasets = groupedDatasets[group.id] || []
              const isCollapsed = collapsedGroups.has(group.id)

              if (datasets.length === 0) return null

              return (
                <div key={group.id} className="space-y-3">
                  {/* Group Header */}
                  <div
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl cursor-pointer transition-all",
                      group.bgColor,
                      "border",
                      group.borderColor,
                      "hover:shadow-md"
                    )}
                    onClick={() => toggleGroup(group.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-full",
                        group.bgColor
                      )}>
                        <GroupIcon className={cn("size-5", group.iconColor)} />
                      </div>
                      <div>
                        <h3 className={cn("text-base font-normal", group.textColor)}>
                          {group.label}
                        </h3>
                        <p className="text-xs font-light text-neutral-500">
                          {group.description}
                        </p>
                      </div>
                      <Badge variant="outline" className={cn("ml-2 font-light", group.textColor, group.borderColor)}>
                        {datasets.length} datasets
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          selectGroup(group.id)
                        }}
                        className={cn(
                          "rounded-lg font-light h-8 text-xs",
                          group.borderColor,
                          group.textColor
                        )}
                      >
                        Select All
                      </Button>
                      <ChevronDown className={cn(
                        "size-5 transition-transform",
                        group.iconColor,
                        isCollapsed && "-rotate-90"
                      )} />
                    </div>
                  </div>

                  {/* Group Content */}
                  <div className={cn(
                    "grid transition-all duration-300",
                    isCollapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"
                  )}>
                    <div className="overflow-hidden">
                      {viewMode === "cards" ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pt-2">
                          {datasets.map(dataset => (
                            <DatasetCard
                              key={dataset.id}
                              dataset={dataset}
                              selected={selectedDatasets.has(dataset.id)}
                              onToggle={() => toggleDataset(dataset.id)}
                              scheme={scheme}
                              group={group}
                            />
                          ))}
                        </div>
                      ) : (
                        <DatasetTable
                          datasets={datasets}
                          selectedDatasets={selectedDatasets}
                          onToggle={toggleDataset}
                          scheme={scheme}
                          group={group}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {filteredDatasets.length === 0 && (
            <div className="text-center py-16">
              <Database className="size-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-light text-neutral-700 mb-2">No datasets match your filters</h3>
              <p className="text-sm font-light text-neutral-500 mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="rounded-xl font-light"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Sticky Selection Footer */}
      {selectedDatasets.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-lg font-normal text-neutral-900">
                    {selectedDatasets.size} dataset{selectedDatasets.size !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs font-light text-neutral-500">
                    Ready to request access
                  </p>
                </div>

                {/* Access Breakdown */}
                {selectionStats && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-48 h-2.5 rounded-full overflow-hidden bg-neutral-100 flex">
                        <div
                          className="bg-emerald-500"
                          style={{ width: `${selectionStats.alreadyOpen}%` }}
                        />
                        <div
                          className={cn("bg-gradient-to-r", scheme.from, scheme.to)}
                          style={{ width: `${selectionStats.readyToGrant}%` }}
                        />
                        <div
                          className="bg-amber-500"
                          style={{ width: `${selectionStats.needsApproval}%` }}
                        />
                        <div
                          className="bg-neutral-400"
                          style={{ width: `${selectionStats.missingLocation}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-light">
                      <span className="text-emerald-700">{selectionStats.alreadyOpen}% open</span>
                      <span className={scheme.from.replace("from-", "text-")}>{selectionStats.readyToGrant}% ready</span>
                      <span className="text-amber-700">{selectionStats.needsApproval}% approval</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={clearSelection}
                  className="rounded-xl font-light"
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={handleRequestAccess}
                  className={cn(
                    "rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all px-6",
                    scheme.from,
                    scheme.to
                  )}
                >
                  <Shield className="size-4 mr-2" />
                  Request Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Dataset Card Component
function DatasetCard({
  dataset,
  selected,
  onToggle,
  scheme,
  group
}: {
  dataset: typeof MOCK_DATASETS[0]
  selected: boolean
  onToggle: () => void
  scheme: ReturnType<typeof useColorScheme>["scheme"]
  group: typeof ACCESS_GROUPS[0]
}) {
  return (
    <Card className={cn(
      "border-2 rounded-xl overflow-hidden transition-all cursor-pointer group hover:shadow-lg",
      selected
        ? cn(scheme.from.replace("from-", "border-").replace("-500", "-300"), "ring-2 ring-offset-1", scheme.from.replace("from-", "ring-").replace("-500", "-200"))
        : "border-neutral-200 hover:border-neutral-300"
    )}
    onClick={onToggle}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono text-xs shrink-0">
                {dataset.code}
              </Badge>
              <Badge className={cn(
                "text-xs font-light shrink-0",
                dataset.status === "Closed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              )}>
                {dataset.status}
              </Badge>
            </div>
            <h4 className="text-sm font-normal text-neutral-900 line-clamp-2 mb-1">
              {dataset.name}
            </h4>
            <p className="text-xs font-light text-neutral-500">
              Phase {dataset.phase} · {dataset.patientCount.toLocaleString()} patients
            </p>
          </div>
          <Checkbox
            checked={selected}
            onCheckedChange={onToggle}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 ml-2"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {dataset.therapeuticArea.slice(0, 2).map(ta => (
            <Badge key={ta} variant="outline" className="text-xs font-light border-neutral-200">
              {ta}
            </Badge>
          ))}
          {dataset.geography.slice(0, 2).map(geo => (
            <Badge key={geo} variant="outline" className="text-xs font-light border-neutral-200">
              {geo}
            </Badge>
          ))}
        </div>

        {/* Access Breakdown Bar */}
        <div className="space-y-1">
          <div className="flex h-1.5 rounded-full overflow-hidden bg-neutral-100">
            <div
              className="bg-emerald-500"
              style={{ width: `${dataset.accessBreakdown.alreadyOpen}%` }}
            />
            <div
              className={cn("bg-gradient-to-r", scheme.from, scheme.to)}
              style={{ width: `${dataset.accessBreakdown.readyToGrant}%` }}
            />
            <div
              className="bg-amber-500"
              style={{ width: `${dataset.accessBreakdown.needsApproval}%` }}
            />
            <div
              className="bg-neutral-400"
              style={{ width: `${dataset.accessBreakdown.missingLocation}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-light text-neutral-500">
            <span>{dataset.accessBreakdown.alreadyOpen + dataset.accessBreakdown.readyToGrant}% instant</span>
            <span>{dataset.accessBreakdown.needsApproval}% approval</span>
          </div>
        </div>

        {/* Bundling Hint */}
        {dataset.frequentlyBundledWith && dataset.frequentlyBundledWith.length > 0 && (
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-1 text-xs font-light text-neutral-500">
              <Sparkles className="size-3" />
              <span>Often bundled with:</span>
              {dataset.frequentlyBundledWith.slice(0, 2).map(code => (
                <Badge key={code} variant="outline" className="text-xs font-light font-mono">
                  {code}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Dataset Table Component
function DatasetTable({
  datasets,
  selectedDatasets,
  onToggle,
  scheme,
  group
}: {
  datasets: typeof MOCK_DATASETS
  selectedDatasets: Set<string>
  onToggle: (id: string) => void
  scheme: ReturnType<typeof useColorScheme>["scheme"]
  group: typeof ACCESS_GROUPS[0]
}) {
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden mt-2">
      <table className="w-full">
        <thead className="bg-neutral-50">
          <tr className="border-b border-neutral-200">
            <th className="text-left p-3 w-12"></th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Code</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Name</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Phase</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Status</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Area</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Patients</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Access</th>
          </tr>
        </thead>
        <tbody>
          {datasets.map(dataset => (
            <tr
              key={dataset.id}
              className={cn(
                "border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer",
                selectedDatasets.has(dataset.id) && "bg-blue-50/50"
              )}
              onClick={() => onToggle(dataset.id)}
            >
              <td className="p-3">
                <Checkbox
                  checked={selectedDatasets.has(dataset.id)}
                  onCheckedChange={() => onToggle(dataset.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="p-3">
                <Badge variant="outline" className="font-mono text-xs">
                  {dataset.code}
                </Badge>
              </td>
              <td className="p-3">
                <span className="text-sm font-light text-neutral-900 line-clamp-1">{dataset.name}</span>
              </td>
              <td className="p-3">
                <Badge className="text-xs font-light bg-blue-100 text-blue-700">
                  {dataset.phase}
                </Badge>
              </td>
              <td className="p-3">
                <Badge className={cn(
                  "text-xs font-light",
                  dataset.status === "Closed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>
                  {dataset.status}
                </Badge>
              </td>
              <td className="p-3">
                <span className="text-xs font-light text-neutral-600">
                  {dataset.therapeuticArea.slice(0, 2).join(", ")}
                </span>
              </td>
              <td className="p-3">
                <span className="text-xs font-light text-neutral-600">
                  {dataset.patientCount.toLocaleString()}
                </span>
              </td>
              <td className="p-3">
                <div className="flex h-1.5 w-20 rounded-full overflow-hidden bg-neutral-100">
                  <div
                    className="bg-emerald-500"
                    style={{ width: `${dataset.accessBreakdown.alreadyOpen}%` }}
                  />
                  <div
                    className={cn("bg-gradient-to-r", scheme.from, scheme.to)}
                    style={{ width: `${dataset.accessBreakdown.readyToGrant}%` }}
                  />
                  <div
                    className="bg-amber-500"
                    style={{ width: `${dataset.accessBreakdown.needsApproval}%` }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

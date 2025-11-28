"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  ArrowLeft,
  Check,
  AlertTriangle,
  X,
  Users,
  Database,
  Loader2,
  FolderSearch,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  TrendingUp,
  Shield,
  Lightbulb,
  Plus, // Still used for keyword add button
  Layers,
  Filter,
  Clock,
} from "lucide-react"

// Mock AI response data
const MOCK_AI_RESPONSE = {
  keywords: ["lung cancer", "ctDNA", "biomarker", "immunotherapy", "ML", "publication"],
  collections: [
    {
      id: "col-1",
      name: "Oncology ctDNA Outcomes Collection",
      description: "Curated Phase III lung cancer studies with ctDNA biomarker monitoring and immunotherapy treatment arms.",
      datasetCount: 16,
      userCount: 120,
      matchScore: 95,
      intents: { ml: true, publish: true, primaryUse: false },
      intentMatch: "full",
      userHasAccess: false,
      accessBreakdown: {
        alreadyOpen: 25,
        readyToGrant: 35,
        needsApproval: 30,
        missingLocation: 10,
      },
      previewDatasets: ["DCODE-101", "DCODE-102", "DCODE-103", "DCODE-104", "DCODE-105"],
    },
    {
      id: "col-2",
      name: "Immunotherapy Response Collection",
      description: "Comprehensive immunotherapy trial data across multiple therapeutic areas including lung, melanoma, and bladder cancer.",
      datasetCount: 22,
      userCount: 95,
      matchScore: 78,
      intents: { ml: true, publish: false, primaryUse: true },
      intentMatch: "partial",
      intentWarning: "Publishing not allowed - request modification?",
      userHasAccess: true,
      accessBreakdown: {
        alreadyOpen: 15,
        readyToGrant: 25,
        needsApproval: 50,
        missingLocation: 10,
      },
      previewDatasets: ["DCODE-201", "DCODE-202", "DCODE-203", "DCODE-204", "DCODE-205"],
    },
    {
      id: "col-3",
      name: "Lung Cancer Biomarker Studies",
      description: "Collection focused on biomarker discovery and validation in NSCLC with comprehensive genomic profiling.",
      datasetCount: 12,
      userCount: 67,
      matchScore: 72,
      intents: { ml: false, publish: true, primaryUse: true },
      intentMatch: "partial",
      intentWarning: "ML/AI research not allowed - request modification?",
      userHasAccess: false,
      accessBreakdown: {
        alreadyOpen: 20,
        readyToGrant: 30,
        needsApproval: 40,
        missingLocation: 10,
      },
      previewDatasets: ["DCODE-301", "DCODE-302", "DCODE-303", "DCODE-304"],
    },
  ],
  additionalDatasets: [
    {
      code: "DCODE-299",
      name: "ctDNA Longitudinal Substudy",
      phase: "Phase III",
      accessStatus: "open", // open, ready_to_grant, needs_approval, missing_location
      userHasAccess: false,
      collections: ["Oncology ctDNA Outcomes Collection"],
      accessBreakdown: {
        alreadyOpen: 100,
        readyToGrant: 0,
        needsApproval: 0,
        missingLocation: 0,
      },
      frequentlyBundledWith: ["DCODE-334", "DCODE-401"],
    },
    {
      code: "DCODE-334",
      name: "NSCLC Biomarker Analysis",
      phase: "Phase II",
      accessStatus: "ready_to_grant",
      userHasAccess: false,
      collections: ["Lung Cancer Biomarker Studies"],
      accessBreakdown: {
        alreadyOpen: 0,
        readyToGrant: 100,
        needsApproval: 0,
        missingLocation: 0,
      },
      frequentlyBundledWith: ["DCODE-299"],
    },
    {
      code: "DCODE-401",
      name: "Immunotherapy Response Predictors",
      phase: "Phase III",
      accessStatus: "needs_approval",
      userHasAccess: true,
      collections: ["Immunotherapy Response Collection", "Oncology ctDNA Outcomes Collection"],
      accessBreakdown: {
        alreadyOpen: 0,
        readyToGrant: 0,
        needsApproval: 100,
        missingLocation: 0,
      },
      frequentlyBundledWith: ["DCODE-299", "DCODE-334"],
    },
  ],
  // Summary statistics for quick overview
  statistics: {
    totalDatasets: 53, // Total across all collections and additional datasets
    alreadyOpen: 11, // 20%
    readyToGrant: 16, // 30%
    needsApproval: 21, // 40%
    missingLocation: 5, // 10%
    datasetsInCollections: 50, // 16 + 22 + 12
    uncollectedDatasets: 3, // additionalDatasets length
    userHasAccessCount: 23, // Datasets user already has access to
  },
}

const EXAMPLE_PROMPTS = [
  "Show me oncology studies with genomic profiling data",
  "I need Phase III cardiovascular trials for ML training",
  "Find imaging data for lung cancer research with publication rights",
]

export default function AIDiscoveryPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [aiResponse, setAiResponse] = useState<typeof MOCK_AI_RESPONSE | null>(null)

  // Filter states for breakdown panel
  const [showOpenOnly, setShowOpenOnly] = useState(false)
  const [showNeedsApproval, setShowNeedsApproval] = useState(false)
  const [showUncollected, setShowUncollected] = useState(false)
  const [showMyAccess, setShowMyAccess] = useState(false)
  const [minMatchScore, setMinMatchScore] = useState(0)
  const [showHighMatch, setShowHighMatch] = useState(false)
  const [showFullIntentMatch, setShowFullIntentMatch] = useState(false)
  const [showMLIntent, setShowMLIntent] = useState(false)
  const [showPublishIntent, setShowPublishIntent] = useState(false)
  const [showLargeCollections, setShowLargeCollections] = useState(false)

  // Smart discovery state
  const [lastSearchQuery, setLastSearchQuery] = useState("")

  // Keyword management
  const [keywords, setKeywords] = useState<string[]>([])
  const [showAddKeyword, setShowAddKeyword] = useState(false)
  const [newKeyword, setNewKeyword] = useState("")

  // Selection state management (datasets only)
  const [selectedDatasets, setSelectedDatasets] = useState<Set<string>>(new Set())

  // Dataset table state
  const [datasetPage, setDatasetPage] = useState(1)
  const [datasetsPerPage] = useState(10)
  const [datasetPhaseFilter, setDatasetPhaseFilter] = useState<string[]>([])
  const [datasetAccessFilter, setDatasetAccessFilter] = useState<string[]>([])

  const handleSearch = async () => {
    if (!prompt.trim()) return

    setIsSearching(true)
    setLastSearchQuery(prompt)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setAiResponse(MOCK_AI_RESPONSE)
    setKeywords([...MOCK_AI_RESPONSE.keywords]) // Set mutable copy
    setIsSearching(false)
    setHasSearched(true)
  }

  const handleExamplePrompt = (example: string) => {
    setPrompt(example)
  }

  const clearSearch = () => {
    setPrompt("")
    setLastSearchQuery("")
    setAiResponse(null)
    setHasSearched(false)
    setKeywords([])
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      setNewKeyword("")
      setShowAddKeyword(false)
    }
  }

  const toggleDataset = (datasetId: string) => {
    const newSelected = new Set(selectedDatasets)
    if (newSelected.has(datasetId)) {
      newSelected.delete(datasetId)
    } else {
      newSelected.add(datasetId)
    }
    setSelectedDatasets(newSelected)
  }

  const toggleAllDatasetsOnPage = () => {
    const newSelected = new Set(selectedDatasets)
    const allSelected = paginatedDatasets.every(ds => newSelected.has(ds.code))

    if (allSelected) {
      // Deselect all on current page
      paginatedDatasets.forEach(ds => newSelected.delete(ds.code))
    } else {
      // Select all on current page
      paginatedDatasets.forEach(ds => newSelected.add(ds.code))
    }
    setSelectedDatasets(newSelected)
  }

  const getIntentMatchBadge = (match: string) => {
    switch (match) {
      case "full":
        return { label: "✅ Matches your intent", color: "bg-green-100 text-green-700 border-green-200" }
      case "partial":
        return { label: "⚠️ Partial match", color: "bg-amber-100 text-amber-700 border-amber-200" }
      case "none":
        return { label: "❌ Intent mismatch", color: "bg-red-100 text-red-700 border-red-200" }
      default:
        return { label: match, color: "bg-neutral-100 text-neutral-700 border-neutral-200" }
    }
  }

  // Generate smart recommendation based on statistics
  const getSmartRecommendation = (stats: typeof MOCK_AI_RESPONSE.statistics) => {
    const instantAccessCount = stats.alreadyOpen + stats.readyToGrant
    const instantAccessPercent = Math.round((instantAccessCount / stats.totalDatasets) * 100)
    const collectionCoverage = Math.round((stats.datasetsInCollections / stats.totalDatasets) * 100)

    if (stats.userHasAccessCount > 0) {
      return {
        icon: Check,
        text: `You already have access to ${stats.userHasAccessCount} datasets - view them now`,
        type: "success",
      }
    } else if (collectionCoverage >= 90) {
      return {
        icon: TrendingUp,
        text: `${stats.datasetsInCollections} datasets are in collections - requesting a collection gives you bundled access`,
        type: "info",
      }
    } else if (stats.uncollectedDatasets >= 5) {
      return {
        icon: FolderSearch,
        text: `${stats.uncollectedDatasets} standalone datasets found - consider individual requests or creating a custom collection`,
        type: "info",
      }
    } else if (instantAccessPercent >= 50) {
      return {
        icon: TrendingUp,
        text: `${instantAccessPercent}% of datasets available for instant access - great opportunity for quick wins`,
        type: "success",
      }
    } else {
      return {
        icon: Shield,
        text: `${stats.needsApproval} datasets need approval - plan for longer access timeline`,
        type: "warning",
      }
    }
  }

  // Filter collections and datasets based on active filters
  const filteredCollections = useMemo(() => {
    if (!aiResponse) return []

    let filtered = [...aiResponse.collections]

    // Apply My Access filter
    if (showMyAccess) {
      filtered = filtered.filter(col => col.userHasAccess)
    }

    // Apply match score filters
    if (showHighMatch) {
      filtered = filtered.filter(col => col.matchScore >= 80)
    }

    // Apply intent match filter
    if (showFullIntentMatch) {
      filtered = filtered.filter(col => col.intentMatch === "full")
    }

    // Apply ML intent filter
    if (showMLIntent) {
      filtered = filtered.filter(col => col.intents.ml)
    }

    // Apply publish intent filter
    if (showPublishIntent) {
      filtered = filtered.filter(col => col.intents.publish)
    }

    // Apply large collections filter
    if (showLargeCollections) {
      filtered = filtered.filter(col => col.datasetCount >= 15)
    }

    return filtered
  }, [aiResponse, showMyAccess, showHighMatch, showFullIntentMatch, showMLIntent, showPublishIntent, showLargeCollections])

  const filteredDatasets = useMemo(() => {
    if (!aiResponse) return []

    let filtered = [...aiResponse.additionalDatasets]

    // Apply access status filters
    if (showOpenOnly) {
      filtered = filtered.filter(ds => ds.accessStatus === "open" || ds.accessStatus === "ready_to_grant")
    }

    if (showNeedsApproval) {
      filtered = filtered.filter(ds => ds.accessStatus === "needs_approval")
    }

    // Apply My Access filter
    if (showMyAccess) {
      filtered = filtered.filter(ds => ds.userHasAccess)
    }

    // Apply dataset table filters
    if (datasetPhaseFilter.length > 0) {
      filtered = filtered.filter(ds => datasetPhaseFilter.includes(ds.phase))
    }

    if (datasetAccessFilter.length > 0) {
      filtered = filtered.filter(ds => datasetAccessFilter.includes(ds.accessStatus))
    }

    // Note: All additionalDatasets are already uncollected by definition
    // so showUncollected doesn't need special handling here

    return filtered
  }, [aiResponse, showOpenOnly, showNeedsApproval, showMyAccess, datasetPhaseFilter, datasetAccessFilter])

  // Paginated datasets
  const paginatedDatasets = useMemo(() => {
    const startIndex = (datasetPage - 1) * datasetsPerPage
    const endIndex = startIndex + datasetsPerPage
    return filteredDatasets.slice(startIndex, endIndex)
  }, [filteredDatasets, datasetPage, datasetsPerPage])

  const totalDatasetPages = Math.ceil(filteredDatasets.length / datasetsPerPage)

  return (
    <div className="py-8">
        {/* Header */}
        <div className="mb-8">
        <button
          onClick={() => router.push("/collectoid/discover")}
          className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Discovery
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className={cn(
            "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br",
            scheme.from,
            scheme.to
          )}>
            <Sparkles className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight">
              AI-Assisted Data Discovery
            </h1>
            <p className="text-base font-light text-neutral-600">
              Describe your research needs and let AI find the right data
            </p>
          </div>
        </div>
      </div>

      {/* Smart Discovery Panel - Always Visible */}
      <div className="mb-8">
        <Card className={cn(
          "border-2 rounded-2xl overflow-hidden shadow-sm",
          hasSearched && aiResponse
            ? cn(scheme.from.replace("from-", "border-").replace("-500", "-200"))
            : "border-neutral-200"
        )}>
          <CardContent className="p-6">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-normal text-neutral-900">AI Smart Discovery</h3>
                <Badge className={cn(
                  "font-light text-xs",
                  scheme.from.replace("from-", "bg-"),
                  "text-white"
                )}>
                  AI
                </Badge>
              </div>
              <p className="text-sm font-light text-neutral-600 mb-3">
                Describe your research needs in natural language and let AI find the right data
              </p>
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder='e.g., "I need lung cancer data with ctDNA biomarker monitoring from immunotherapy trials for ML-based outcome prediction. Planning to publish results."'
                className="min-h-[80px] text-sm font-light border-neutral-200 rounded-xl resize-none"
                disabled={isSearching}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSearch()
                  }
                }}
              />
            </div>

            {/* Last searched query display */}
            {lastSearchQuery && lastSearchQuery !== prompt && (
              <div className="mb-4 p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-light text-neutral-500 mb-1">Current search:</p>
                    <p className="text-sm font-light text-neutral-700 italic">"{lastSearchQuery}"</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="rounded-lg font-light text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="size-4 mr-1" />
                    Clear
                  </Button>
                </div>
              </div>
            )}

            {/* Extracted Keywords - Show when results exist */}
            {hasSearched && aiResponse && keywords.length > 0 && (
              <div className="mb-4 pt-4 border-t border-neutral-200">
                <p className="text-sm font-light text-neutral-600 mb-3">
                  Keywords extracted (click to remove):
                </p>
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword) => (
                    <Badge
                      key={keyword}
                      variant="outline"
                      className="font-light text-xs border-neutral-300 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors pl-3 pr-2"
                      onClick={() => removeKeyword(keyword)}
                    >
                      🏷️ {keyword}
                      <X className="size-3 ml-1.5 inline" />
                    </Badge>
                  ))}
                  {!showAddKeyword ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAddKeyword(true)}
                      className="h-7 px-2 text-xs font-light rounded-lg"
                    >
                      <Plus className="size-3 mr-1" />
                      Add Keyword
                    </Button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') addKeyword()
                          if (e.key === 'Escape') {
                            setShowAddKeyword(false)
                            setNewKeyword("")
                          }
                        }}
                        placeholder="Type keyword..."
                        className="h-7 w-32 text-xs"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={addKeyword}
                        className={cn(
                          "h-7 px-2 rounded-lg",
                          scheme.from.replace("from-", "bg-")
                        )}
                      >
                        <Check className="size-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowAddKeyword(false)
                          setNewKeyword("")
                        }}
                        className="h-7 px-2 rounded-lg"
                      >
                        <X className="size-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-2 justify-end">
              {hasSearched && (
                <Button
                  variant="outline"
                  onClick={clearSearch}
                  className="rounded-xl font-light border-neutral-200"
                >
                  New Search
                </Button>
              )}
              <Button
                onClick={handleSearch}
                disabled={isSearching || !prompt.trim()}
                className={cn(
                  "rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
                  scheme.from,
                  scheme.to
                )}
              >
                {isSearching ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 mr-2" />
                    Discover Data
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Example Prompts (shown before first search) */}
        {!hasSearched && (
          <div className="mt-4">
            <p className="text-sm font-light text-neutral-600 mb-3">
              💡 Example prompts:
            </p>
            <div className="flex flex-wrap gap-2">
              {EXAMPLE_PROMPTS.map((example, i) => (
                <button
                  key={i}
                  onClick={() => handleExamplePrompt(example)}
                  className="px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-light text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-all"
                >
                  "{example}"
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* AI Response */}
      {hasSearched && aiResponse && (
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className="w-72 shrink-0 space-y-4">
            {/* Match Quality Filter */}
            <Card className={cn(
              "border-2 rounded-2xl overflow-hidden",
              (showHighMatch || showFullIntentMatch || showLargeCollections)
                ? scheme.from.replace("from-", "border-").replace("-500", "-200")
                : "border-neutral-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className={cn(
                    "size-4",
                    (showHighMatch || showFullIntentMatch || showLargeCollections)
                      ? scheme.from.replace("from-", "text-")
                      : "text-neutral-600"
                  )} />
                  <h3 className="text-sm font-normal text-neutral-900">Match Quality</h3>
                </div>
                <div className="space-y-2">
                  <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer">
                    <Checkbox
                      checked={showHighMatch}
                      onCheckedChange={(checked) => setShowHighMatch(checked as boolean)}
                    />
                    <span className="text-sm font-light text-neutral-700">High Match (80%+)</span>
                  </label>
                  <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer">
                    <Checkbox
                      checked={showFullIntentMatch}
                      onCheckedChange={(checked) => setShowFullIntentMatch(checked as boolean)}
                    />
                    <span className="text-sm font-light text-neutral-700">Full Intent Match</span>
                  </label>
                  <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer">
                    <Checkbox
                      checked={showLargeCollections}
                      onCheckedChange={(checked) => setShowLargeCollections(checked as boolean)}
                    />
                    <span className="text-sm font-light text-neutral-700">Large Collections (15+)</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Usage Intent Filter */}
            <Card className={cn(
              "border-2 rounded-2xl overflow-hidden",
              (showMLIntent || showPublishIntent)
                ? scheme.from.replace("from-", "border-").replace("-500", "-200")
                : "border-neutral-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className={cn(
                    "size-4",
                    (showMLIntent || showPublishIntent)
                      ? scheme.from.replace("from-", "text-")
                      : "text-neutral-600"
                  )} />
                  <h3 className="text-sm font-normal text-neutral-900">Usage Intent</h3>
                </div>
                <div className="space-y-2">
                  <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer">
                    <Checkbox
                      checked={showMLIntent}
                      onCheckedChange={(checked) => setShowMLIntent(checked as boolean)}
                    />
                    <span className="text-sm font-light text-neutral-700">ML/AI Research</span>
                  </label>
                  <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer">
                    <Checkbox
                      checked={showPublishIntent}
                      onCheckedChange={(checked) => setShowPublishIntent(checked as boolean)}
                    />
                    <span className="text-sm font-light text-neutral-700">Publishing Allowed</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Access & Availability Filter */}
            <Card className={cn(
              "border-2 rounded-2xl overflow-hidden",
              (showOpenOnly || showNeedsApproval || showMyAccess || showUncollected)
                ? scheme.from.replace("from-", "border-").replace("-500", "-200")
                : "border-neutral-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className={cn(
                    "size-4",
                    (showOpenOnly || showNeedsApproval || showMyAccess || showUncollected)
                      ? scheme.from.replace("from-", "text-")
                      : "text-neutral-600"
                  )} />
                  <h3 className="text-sm font-normal text-neutral-900">Access & Availability</h3>
                </div>
                <div className="space-y-2">
                  <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer">
                    <Checkbox
                      checked={showOpenOnly}
                      onCheckedChange={(checked) => setShowOpenOnly(checked as boolean)}
                    />
                    <span className="text-sm font-light text-neutral-700">Open Data Only</span>
                  </label>
                  <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer">
                    <Checkbox
                      checked={showNeedsApproval}
                      onCheckedChange={(checked) => setShowNeedsApproval(checked as boolean)}
                    />
                    <span className="text-sm font-light text-neutral-700">Needs Approval</span>
                  </label>
                  <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer">
                    <Checkbox
                      checked={showMyAccess}
                      onCheckedChange={(checked) => setShowMyAccess(checked as boolean)}
                    />
                    <span className="text-sm font-light text-neutral-700">My Access</span>
                  </label>
                  <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer">
                    <Checkbox
                      checked={showUncollected}
                      onCheckedChange={(checked) => setShowUncollected(checked as boolean)}
                    />
                    <span className="text-sm font-light text-neutral-700">Uncollected Only</span>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Clear All Filters */}
            {(showOpenOnly || showNeedsApproval || showUncollected || showMyAccess || showHighMatch || showFullIntentMatch || showMLIntent || showPublishIntent || showLargeCollections) && (
              <Button
                variant="outline"
                onClick={() => {
                  setShowOpenOnly(false)
                  setShowNeedsApproval(false)
                  setShowUncollected(false)
                  setShowMyAccess(false)
                  setShowHighMatch(false)
                  setShowFullIntentMatch(false)
                  setShowMLIntent(false)
                  setShowPublishIntent(false)
                  setShowLargeCollections(false)
                }}
                className="w-full rounded-xl font-light border-neutral-200"
              >
                <X className="size-4 mr-2" />
                Clear All Filters
              </Button>
            )}
          </div>

          {/* Results Section */}
          <div className="flex-1 space-y-6">

          {/* Dataset Statistics Breakdown Panel */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                <div>
                  <h4 className="text-sm font-normal text-neutral-900">Access Overview</h4>
                  <p className="text-xs font-light text-neutral-500">
                    {aiResponse.statistics.totalDatasets} datasets found
                  </p>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                {/* Total Datasets */}
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-neutral-400" />
                  <div>
                    <p className="text-xs font-light text-neutral-500">Total Found</p>
                    <p className="text-lg font-normal text-neutral-900">
                      {aiResponse.statistics.totalDatasets}
                    </p>
                  </div>
                </div>

                {/* Instant Access */}
                <div className="flex items-center gap-2">
                  <Check className="size-4 text-green-600" />
                  <div>
                    <p className="text-xs font-light text-neutral-500">Instant Access</p>
                    <p className="text-lg font-normal text-neutral-900">
                      {aiResponse.statistics.alreadyOpen + aiResponse.statistics.readyToGrant}
                      <span className="text-xs font-light text-neutral-500 ml-1">
                        ({Math.round(((aiResponse.statistics.alreadyOpen + aiResponse.statistics.readyToGrant) / aiResponse.statistics.totalDatasets) * 100)}%)
                      </span>
                    </p>
                  </div>
                </div>

                {/* In Collections */}
                <div className="flex items-center gap-2">
                  <FolderSearch className="size-4 text-neutral-400" />
                  <div>
                    <p className="text-xs font-light text-neutral-500">In Collections</p>
                    <p className="text-lg font-normal text-neutral-900">
                      {aiResponse.statistics.datasetsInCollections}
                      <span className="text-xs font-light text-neutral-500 ml-1">
                        ({Math.round((aiResponse.statistics.datasetsInCollections / aiResponse.statistics.totalDatasets) * 100)}%)
                      </span>
                    </p>
                  </div>
                </div>

                {/* Need Approval */}
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-amber-600" />
                  <div>
                    <p className="text-xs font-light text-neutral-500">Need Approval</p>
                    <p className="text-lg font-normal text-neutral-900">
                      {aiResponse.statistics.needsApproval}
                      <span className="text-xs font-light text-neutral-500 ml-1">
                        ({Math.round((aiResponse.statistics.needsApproval / aiResponse.statistics.totalDatasets) * 100)}%)
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Access Breakdown - 20/30/40/10 Model */}
              <div className="mb-4">
                <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Access Breakdown</p>
                <div className="flex h-2 rounded-full overflow-hidden bg-neutral-100">
                  {/* Already Open */}
                  <div
                    className="bg-green-500"
                    style={{ width: `${(aiResponse.statistics.alreadyOpen / aiResponse.statistics.totalDatasets) * 100}%` }}
                    title={`Already Open: ${aiResponse.statistics.alreadyOpen} datasets`}
                  />
                  {/* Ready to Grant */}
                  <div
                    className={cn("bg-gradient-to-r", scheme.from, scheme.to)}
                    style={{ width: `${(aiResponse.statistics.readyToGrant / aiResponse.statistics.totalDatasets) * 100}%` }}
                    title={`Ready to Grant: ${aiResponse.statistics.readyToGrant} datasets`}
                  />
                  {/* Needs Approval */}
                  <div
                    className="bg-amber-500"
                    style={{ width: `${(aiResponse.statistics.needsApproval / aiResponse.statistics.totalDatasets) * 100}%` }}
                    title={`Needs Approval: ${aiResponse.statistics.needsApproval} datasets`}
                  />
                  {/* Missing Location */}
                  <div
                    className="bg-neutral-400"
                    style={{ width: `${(aiResponse.statistics.missingLocation / aiResponse.statistics.totalDatasets) * 100}%` }}
                    title={`Missing Location: ${aiResponse.statistics.missingLocation} datasets`}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-light text-neutral-600 mt-1">
                  <span>{aiResponse.statistics.alreadyOpen}% open</span>
                  <span>{aiResponse.statistics.readyToGrant}% ready</span>
                  <span>{aiResponse.statistics.needsApproval}% needs approval</span>
                </div>
              </div>

              {/* Smart Recommendation */}
              {(() => {
                const recommendation = getSmartRecommendation(aiResponse.statistics)
                const RecommendationIcon = recommendation.icon
                return (
                  <div className={cn(
                    "flex items-start gap-2 p-3 rounded-xl border",
                    recommendation.type === "success" && "bg-green-50 border-green-200",
                    recommendation.type === "info" && "bg-blue-50 border-blue-200",
                    recommendation.type === "warning" && "bg-amber-50 border-amber-200"
                  )}>
                    <Lightbulb className={cn(
                      "size-4 shrink-0 mt-0.5",
                      recommendation.type === "success" && "text-green-600",
                      recommendation.type === "info" && "text-blue-600",
                      recommendation.type === "warning" && "text-amber-600"
                    )} />
                    <p className={cn(
                      "text-sm font-light",
                      recommendation.type === "success" && "text-green-700",
                      recommendation.type === "info" && "text-blue-700",
                      recommendation.type === "warning" && "text-amber-700"
                    )}>
                      {recommendation.text}
                    </p>
                  </div>
                )
              })()}
            </CardContent>
          </Card>

          {/* Relevant Collections */}
          <div>
            <h3 className="text-lg font-light text-neutral-900 mb-4 flex items-center gap-2">
              Relevant Collections ({filteredCollections.length})
              {(showMyAccess || showUncollected) && filteredCollections.length !== aiResponse.collections.length && (
                <Badge variant="outline" className="text-xs font-light">
                  filtered from {aiResponse.collections.length}
                </Badge>
              )}
            </h3>
            <div className="space-y-4">
              {filteredCollections.map((collection, i) => {
                const matchBadge = getIntentMatchBadge(collection.intentMatch)
                return (
                  <Card
                    key={collection.id}
                    className={cn(
                      "border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group",
                      i === 0 && "ring-2 ring-green-200"
                    )}
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        sessionStorage.setItem("dcm_current_collection_id", collection.id)
                      }
                      router.push("/collectoid/dcm/progress")
                    }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {i === 0 && (
                              <Badge className={cn(
                                "font-light text-xs bg-gradient-to-r text-white border-0",
                                scheme.from,
                                scheme.to
                              )}>
                                ⭐ Best Match
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={cn("font-light text-xs", matchBadge.color)}
                            >
                              {matchBadge.label}
                            </Badge>
                          </div>
                          <h4 className="text-base font-normal text-neutral-900 mb-1">
                            {collection.name}
                          </h4>
                          <p className="text-sm font-light text-neutral-600 mb-3">
                            {collection.description}
                          </p>

                          {/* Intent warning */}
                          {collection.intentWarning && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 mb-3">
                              <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                              <span className="text-xs font-light text-amber-800">
                                {collection.intentWarning}
                              </span>
                            </div>
                          )}

                          {/* Intent badges */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-light text-neutral-500">Allowed:</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-light",
                                collection.intents.ml
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              )}
                            >
                              ML/AI {collection.intents.ml ? "✓" : "✗"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-light",
                                collection.intents.publish
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              )}
                            >
                              Publish {collection.intents.publish ? "✓" : "✗"}
                            </Badge>
                          </div>

                          {/* Dataset Preview */}
                          {collection.previewDatasets && collection.previewDatasets.length > 0 && (
                            <div className="mb-3 p-2.5 rounded-lg bg-neutral-50">
                              <p className="text-xs font-light text-neutral-600 mb-2">
                                Includes {collection.datasetCount} datasets:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {collection.previewDatasets.slice(0, 5).map((code) => (
                                  <Badge key={code} variant="outline" className="text-xs font-light">
                                    {code}
                                  </Badge>
                                ))}
                                {collection.datasetCount > 5 && (
                                  <Badge variant="outline" className="text-xs font-light">
                                    +{collection.datasetCount - 5} more
                                  </Badge>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Access Breakdown */}
                          {collection.accessBreakdown && (
                            <div className="mb-3">
                              <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">
                                Access Eligibility
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
                                  <div className="flex h-full">
                                    <div
                                      className="bg-green-500"
                                      style={{ width: `${collection.accessBreakdown.alreadyOpen}%` }}
                                      title={`Already Open: ${collection.accessBreakdown.alreadyOpen}%`}
                                    />
                                    <div
                                      className={cn("bg-gradient-to-r", scheme.from, scheme.to)}
                                      style={{ width: `${collection.accessBreakdown.readyToGrant}%` }}
                                      title={`Ready to Grant: ${collection.accessBreakdown.readyToGrant}%`}
                                    />
                                    <div
                                      className="bg-amber-500"
                                      style={{ width: `${collection.accessBreakdown.needsApproval}%` }}
                                      title={`Needs Approval: ${collection.accessBreakdown.needsApproval}%`}
                                    />
                                    <div
                                      className="bg-neutral-400"
                                      style={{ width: `${collection.accessBreakdown.missingLocation}%` }}
                                      title={`Missing Location: ${collection.accessBreakdown.missingLocation}%`}
                                    />
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center justify-between text-xs font-light text-neutral-600 mt-1">
                                <span>{collection.accessBreakdown.alreadyOpen + collection.accessBreakdown.readyToGrant}% instant access</span>
                                <span>{collection.accessBreakdown.needsApproval}% needs approval</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Stats */}
                        <div className="text-right shrink-0 ml-4">
                          <div className="flex items-center gap-4 text-sm font-light text-neutral-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Database className="size-4" />
                              <span>{collection.datasetCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="size-4" />
                              <span>{collection.userCount}</span>
                            </div>
                          </div>
                          <div className={cn(
                            "text-2xl font-light",
                            collection.matchScore >= 90 ? "text-green-600" :
                            collection.matchScore >= 70 ? "text-amber-600" : "text-neutral-600"
                          )}>
                            {collection.matchScore}%
                          </div>
                          <p className="text-xs font-light text-neutral-500">match</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl font-light border-neutral-200"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (typeof window !== "undefined") {
                              sessionStorage.setItem("dcm_current_collection_id", collection.id)
                            }
                            router.push("/collectoid/dcm/progress")
                          }}
                        >
                          View Collection
                        </Button>
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            if (typeof window !== "undefined") {
                              sessionStorage.setItem("dcm_current_collection_id", collection.id)
                            }
                            router.push(`/collectoid/collections/${collection.id}/request`)
                          }}
                          className={cn(
                            "rounded-xl font-light bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
                            scheme.from, scheme.to
                          )}
                        >
                          Request Access
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Individual Datasets Table */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-normal text-neutral-900 flex items-center gap-2">
                    Individual Datasets ({filteredDatasets.length} not in above collections)
                    {(showOpenOnly || showNeedsApproval || showMyAccess || datasetPhaseFilter.length > 0 || datasetAccessFilter.length > 0) && filteredDatasets.length !== aiResponse.additionalDatasets.length && (
                      <Badge variant="outline" className="text-xs font-light">
                        filtered from {aiResponse.additionalDatasets.length}
                      </Badge>
                    )}
                  </h3>
                  {selectedDatasets.size > 0 && (
                    <p className="text-sm font-light text-neutral-600 mt-1">
                      {selectedDatasets.size} dataset{selectedDatasets.size !== 1 ? 's' : ''} selected
                    </p>
                  )}
                </div>

                {/* Table Filters */}
                <div className="flex items-center gap-2">
                  {/* Phase Filter */}
                  <div className="flex items-center gap-2">
                    <Filter className="size-4 text-neutral-400" />
                    <select
                      value={datasetPhaseFilter[0] || ""}
                      onChange={(e) => setDatasetPhaseFilter(e.target.value ? [e.target.value] : [])}
                      className="h-9 px-3 rounded-lg border border-neutral-200 text-sm font-light bg-white"
                    >
                      <option value="">All Phases</option>
                      <option value="Phase II">Phase II</option>
                      <option value="Phase III">Phase III</option>
                    </select>
                  </div>

                  {/* Access Status Filter */}
                  <select
                    value={datasetAccessFilter[0] || ""}
                    onChange={(e) => setDatasetAccessFilter(e.target.value ? [e.target.value] : [])}
                    className="h-9 px-3 rounded-lg border border-neutral-200 text-sm font-light bg-white"
                  >
                    <option value="">All Access Statuses</option>
                    <option value="open">Open</option>
                    <option value="ready_to_grant">Ready to Grant</option>
                    <option value="needs_approval">Needs Approval</option>
                    <option value="missing_location">Missing Location</option>
                  </select>

                  {/* Clear Filters */}
                  {(datasetPhaseFilter.length > 0 || datasetAccessFilter.length > 0) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDatasetPhaseFilter([])
                        setDatasetAccessFilter([])
                      }}
                      className="h-9 px-3 rounded-lg font-light"
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="border border-neutral-200 rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead className="bg-neutral-50">
                    <tr className="border-b border-neutral-200">
                      <th className="text-left p-3 w-12">
                        <Checkbox
                          checked={paginatedDatasets.length > 0 && paginatedDatasets.every(ds => selectedDatasets.has(ds.code))}
                          onCheckedChange={toggleAllDatasetsOnPage}
                        />
                      </th>
                      <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Code</th>
                      <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Name</th>
                      <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Phase</th>
                      <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Access Status</th>
                      <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Collections</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedDatasets.map((dataset) => {
                      const accessBadge = (() => {
                        switch (dataset.accessStatus) {
                          case "open":
                            return { label: "Open", color: "bg-green-100 text-green-700 border-green-200" }
                          case "ready_to_grant":
                            return { label: "Ready to Grant", color: "bg-blue-100 text-blue-700 border-blue-200" }
                          case "needs_approval":
                            return { label: "Needs Approval", color: "bg-amber-100 text-amber-700 border-amber-200" }
                          case "missing_location":
                            return { label: "Missing Location", color: "bg-neutral-100 text-neutral-700 border-neutral-200" }
                          default:
                            return { label: "Unknown", color: "bg-neutral-100 text-neutral-700 border-neutral-200" }
                        }
                      })()

                      return (
                        <tr
                          key={dataset.code}
                          className={cn(
                            "border-b border-neutral-100 hover:bg-neutral-50 transition-colors",
                            selectedDatasets.has(dataset.code) && "bg-blue-50/50"
                          )}
                        >
                          <td className="p-3">
                            <Checkbox
                              checked={selectedDatasets.has(dataset.code)}
                              onCheckedChange={() => toggleDataset(dataset.code)}
                            />
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className="font-mono text-xs">
                              {dataset.code}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col gap-1">
                              <span className="text-sm font-light text-neutral-900">{dataset.name}</span>
                              {dataset.userHasAccess && (
                                <Badge className="text-xs font-light bg-green-100 text-green-700 w-fit">
                                  <Check className="size-3 mr-1" />
                                  You have access
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="p-3">
                            <Badge className="text-xs font-light bg-blue-100 text-blue-700">
                              {dataset.phase}
                            </Badge>
                          </td>
                          <td className="p-3">
                            <Badge variant="outline" className={cn("text-xs font-light", accessBadge.color)}>
                              {accessBadge.label}
                            </Badge>
                          </td>
                          <td className="p-3">
                            {dataset.collections && dataset.collections.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {dataset.collections.slice(0, 2).map((collection, i) => (
                                  <Badge key={i} variant="outline" className="text-xs font-light border-neutral-200">
                                    {collection}
                                  </Badge>
                                ))}
                                {dataset.collections.length > 2 && (
                                  <Badge variant="outline" className="text-xs font-light">
                                    +{dataset.collections.length - 2}
                                  </Badge>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs font-light text-neutral-400">None</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredDatasets.length > datasetsPerPage && (
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm font-light text-neutral-600">
                    Showing {((datasetPage - 1) * datasetsPerPage) + 1} to {Math.min(datasetPage * datasetsPerPage, filteredDatasets.length)} of {filteredDatasets.length} datasets
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDatasetPage(p => Math.max(1, p - 1))}
                      disabled={datasetPage === 1}
                      className="rounded-lg font-light"
                    >
                      <ChevronLeft className="size-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalDatasetPages }, (_, i) => i + 1).map(page => (
                        <Button
                          key={page}
                          variant={page === datasetPage ? "default" : "ghost"}
                          size="sm"
                          onClick={() => setDatasetPage(page)}
                          className={cn(
                            "rounded-lg font-light w-9",
                            page === datasetPage && cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                          )}
                        >
                          {page}
                        </Button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDatasetPage(p => Math.min(totalDatasetPages, p + 1))}
                      disabled={datasetPage === totalDatasetPages}
                      className="rounded-lg font-light"
                    >
                      <ChevronRight className="size-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-neutral-100">
                <Button
                  variant="outline"
                  disabled={selectedDatasets.size === 0}
                  className={cn(
                    "rounded-xl font-light",
                    selectedDatasets.size > 0 && cn(
                      scheme.from.replace("from-", "border-").replace("-500", "-300"),
                      scheme.from.replace("from-", "text-").replace("-500", "-700")
                    )
                  )}
                >
                  <Sparkles className="size-4 mr-2" />
                  Request custom collection from selected ({selectedDatasets.size})
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* New Search */}
          <div className="text-center pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setHasSearched(false)
                setAiResponse(null)
                setPrompt("")
              }}
              className="rounded-xl font-light text-neutral-600"
            >
              <ArrowLeft className="size-4 mr-2" />
              Start New Search
            </Button>
          </div>
          </div>
        </div>
      )}
    </div>
  )
}

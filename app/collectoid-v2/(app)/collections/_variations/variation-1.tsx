"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { cn } from "@/lib/utils"
import {
  Search,
  PlusCircle,
  Grid3x3,
  List,
  Star,
  Users,
  Database,
  MoreVertical,
  MessageSquare,
  ChevronDown,
  Filter,
  X,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Lock,
  Unlock,
  UserCheck,
  FileEdit,
  EyeOff,
  Layers,
  Plus,
  Check,
  Minus,
  Sliders,
  Globe,
  Target,
  Microscope,
  Building,
  HelpCircle,
  FileText,
  Zap,
  Clock,
} from "lucide-react"
import {
  MOCK_COLLECTIONS,
  filterCollections,
  getAllTherapeuticAreas,
  getAllOwners,
  Collection,
  Dataset,
  MOCK_DATASETS,
  CURRENT_USER_ID,
  getMyDraftCollections,
  getMyConceptCollections,
} from "@/lib/dcm-mock-data"

// Available user groups for filtering
const USER_GROUPS = [
  "Oncology Data Science",
  "Oncology Biometrics",
  "Cardiovascular Research",
  "Neuroscience Analytics",
  "Translational Medicine",
  "Biostatistics",
  "Data Science Platform",
  "Clinical Operations",
]

// Mock current user info
const CURRENT_USER = {
  prid: "PRID12345",
  name: "Current User",
  groups: ["Oncology Data Science", "Data Science Platform"],
}

// Extended collection data with AoT info for end-user discovery
const COLLECTIONS_WITH_AOT = MOCK_COLLECTIONS.map((col, i) => ({
  ...col,
  agreementOfTerms: {
    aiResearch: i % 3 !== 2, // 2/3 allow AI research
    softwareDevelopment: i % 4 === 0, // 1/4 allow software dev
    externalPublication: i % 2 === 0, // 1/2 allow external publication
    internalPublication: true, // all allow internal
  },
  // Mock user access info
  userAccess: {
    currentUserHasAccess: i % 3 !== 0, // 2/3 of collections user has access to
    accessGroups: [
      ...USER_GROUPS.filter((_, idx) => (i + idx) % 3 === 0).slice(0, 3),
    ],
    accessPrids: [
      "PRID12345", // current user
      ...(i % 2 === 0 ? ["PRID67890", "PRID11111"] : []),
    ],
  },
}))

export default function CollectionsBrowserVariation1() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [sortBy, setSortBy] = useState<"recent" | "name" | "users" | "progress" | "match">("match")
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  // Filter state
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [accessLevel, setAccessLevel] = useState<"all" | "mine" | "public" | "restricted">("all")
  const [showFilters, setShowFilters] = useState(true)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // My Access filter
  const [myAccessFilter, setMyAccessFilter] = useState<"all" | "have_access" | "need_request">("all")

  // User/Group Access filter
  const [userGroupFilter, setUserGroupFilter] = useState<string[]>([])
  const [pridFilter, setPridFilter] = useState("")
  const [showAdvancedAccess, setShowAdvancedAccess] = useState(false)

  // Intent filter state (for End User Discovery)
  const [selectedIntents, setSelectedIntents] = useState<{
    aiResearch: boolean
    softwareDevelopment: boolean
    externalPublication: boolean
    internalPublication: boolean
  }>({
    aiResearch: false,
    softwareDevelopment: false,
    externalPublication: false,
    internalPublication: false,
  })

  // Draft collections filter
  const [showMyDrafts, setShowMyDrafts] = useState(false)
  const myDraftsCount = getMyConceptCollections().length

  // Workspace mode is now handled by /dcm/create/workspace/datasets
  // This page is purely for browsing collections, not dataset selection
  const isWorkspaceMode = false // Deprecated: workspace mode moved to dedicated sub-page
  const [workspaceCollectionName, setWorkspaceCollectionName] = useState("")
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([])

  // Workspace mode filters
  const [wsPhaseFilters, setWsPhaseFilters] = useState<string[]>(["Phase III"])
  const [wsStatusFilters, setWsStatusFilters] = useState<string[]>(["Closed"])
  const [wsGeographyFilters, setWsGeographyFilters] = useState<string[]>([])
  const [wsTherapeuticFilters, setWsTherapeuticFilters] = useState<string[]>([])
  const [wsModalityFilters, setWsModalityFilters] = useState<string[]>([])
  const [wsSponsorFilters, setWsSponsorFilters] = useState<string[]>([])
  const [wsSharingFilters, setWsSharingFilters] = useState<string[]>([])
  const [wsCrossoverFilters, setWsCrossoverFilters] = useState<string[]>(["moderate"])
  const [wsUsageFilters, setWsUsageFilters] = useState<string[]>(["high", "medium"])
  const [wsSearchQuery, setWsSearchQuery] = useState("")
  const [wsNctIdentifier, setWsNctIdentifier] = useState("")
  const [wsEudraCTIdentifier, setWsEudraCTIdentifier] = useState("")

  // Load workspace context and selected datasets from sessionStorage
  useEffect(() => {
    if (isWorkspaceMode && typeof window !== "undefined") {
      const storedName = sessionStorage.getItem("dcm_collection_name")
      const storedDatasets = sessionStorage.getItem("dcm_selected_datasets")
      if (storedName) setWorkspaceCollectionName(storedName)
      if (storedDatasets) setSelectedDatasets(JSON.parse(storedDatasets))
    }
  }, [isWorkspaceMode])

  // Workspace mode filter logic
  const toggleWsFilter = (
    filterArray: string[],
    setFilter: (arr: string[]) => void,
    value: string
  ) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter((v) => v !== value))
    } else {
      setFilter([...filterArray, value])
    }
  }

  const clearAllWsFilters = () => {
    setWsPhaseFilters([])
    setWsStatusFilters([])
    setWsGeographyFilters([])
    setWsTherapeuticFilters([])
    setWsModalityFilters([])
    setWsSponsorFilters([])
    setWsSharingFilters([])
    setWsCrossoverFilters([])
    setWsUsageFilters([])
    setWsSearchQuery("")
    setWsNctIdentifier("")
    setWsEudraCTIdentifier("")
  }

  const hasActiveWsFilters = wsPhaseFilters.length > 0 || wsStatusFilters.length > 0 ||
    wsGeographyFilters.length > 0 || wsTherapeuticFilters.length > 0 ||
    wsModalityFilters.length > 0 || wsSponsorFilters.length > 0 ||
    wsSharingFilters.length > 0 || wsCrossoverFilters.length > 0 ||
    wsUsageFilters.length > 0 || wsSearchQuery.trim() !== "" ||
    wsNctIdentifier.trim() !== "" || wsEudraCTIdentifier.trim() !== ""

  // Filtered datasets for workspace mode
  const filteredWsDatasets = useMemo(() => {
    let datasets = [...MOCK_DATASETS]

    // Search filter
    if (wsSearchQuery.trim()) {
      const query = wsSearchQuery.toLowerCase()
      datasets = datasets.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query)
      )
    }

    // Phase filter
    if (wsPhaseFilters.length > 0) {
      datasets = datasets.filter(d => wsPhaseFilters.includes(d.phase))
    }

    // Status filter
    if (wsStatusFilters.length > 0) {
      datasets = datasets.filter(d => wsStatusFilters.includes(d.status))
    }

    // Geography filter
    if (wsGeographyFilters.length > 0) {
      datasets = datasets.filter(d =>
        d.geography.some(g => wsGeographyFilters.includes(g))
      )
    }

    // Therapeutic area filter
    if (wsTherapeuticFilters.length > 0) {
      datasets = datasets.filter(d =>
        d.therapeuticArea.some(t => wsTherapeuticFilters.includes(t))
      )
    }

    return datasets
  }, [wsSearchQuery, wsPhaseFilters, wsStatusFilters, wsGeographyFilters, wsTherapeuticFilters])

  const addAllWsDatasets = () => {
    const allIds = new Set(selectedDatasets.map(d => d.id))
    const newDatasets = filteredWsDatasets.filter(d => !allIds.has(d.id))
    setSelectedDatasets([...selectedDatasets, ...newDatasets])
  }

  // Calculate aggregate access breakdown for workspace mode
  const wsAccessBreakdown = useMemo(() => {
    if (selectedDatasets.length === 0) return null

    const total = selectedDatasets.length
    const breakdown = {
      alreadyOpen: 0,
      readyToGrant: 0,
      needsApproval: 0,
      missingLocation: 0,
    }

    selectedDatasets.forEach((dataset) => {
      breakdown.alreadyOpen += dataset.accessBreakdown.alreadyOpen
      breakdown.readyToGrant += dataset.accessBreakdown.readyToGrant
      breakdown.needsApproval += dataset.accessBreakdown.needsApproval
      breakdown.missingLocation += dataset.accessBreakdown.missingLocation
    })

    return {
      alreadyOpen: Math.round(breakdown.alreadyOpen / total),
      readyToGrant: Math.round(breakdown.readyToGrant / total),
      needsApproval: Math.round(breakdown.needsApproval / total),
      missingLocation: Math.round(breakdown.missingLocation / total),
    }
  }, [selectedDatasets])

  // Save selected datasets to sessionStorage
  const saveAndReturn = () => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_selected_datasets", JSON.stringify(selectedDatasets))
    }
    router.push("/collectoid-v2/dcm/create/workspace")
  }

  // Toggle dataset selection
  const toggleDatasetSelection = (dataset: Dataset) => {
    setSelectedDatasets(prev => {
      const exists = prev.some(d => d.id === dataset.id)
      if (exists) {
        return prev.filter(d => d.id !== dataset.id)
      } else {
        return [...prev, dataset]
      }
    })
  }

  const isDatasetSelected = (datasetId: string) => {
    return selectedDatasets.some(d => d.id === datasetId)
  }

  // Get filter options
  const allAreas = useMemo(() => getAllTherapeuticAreas(), [])
  const allOwners = useMemo(() => getAllOwners(), [])

  // Calculate intent match for a collection
  const getIntentMatch = (col: typeof COLLECTIONS_WITH_AOT[0]) => {
    const activeIntents = Object.entries(selectedIntents).filter(([_, v]) => v)
    if (activeIntents.length === 0) return { match: "none_selected", score: 100, mismatches: [] }

    const mismatches: string[] = []
    let matchCount = 0

    for (const [intent, selected] of activeIntents) {
      if (selected) {
        const collectionAllows = col.agreementOfTerms[intent as keyof typeof col.agreementOfTerms]
        if (collectionAllows) {
          matchCount++
        } else {
          mismatches.push(intent)
        }
      }
    }

    const score = Math.round((matchCount / activeIntents.length) * 100)

    if (score === 100) return { match: "full", score, mismatches }
    if (score > 0) return { match: "partial", score, mismatches }
    return { match: "none", score, mismatches }
  }

  // Apply filters
  const filteredCollections = useMemo(() => {
    // "My Private" shows concept-stage collections only (concepts are private, drafts are public)
    const baseCollections = showMyDrafts
      ? COLLECTIONS_WITH_AOT.filter(c => c.status === "concept" && c.creatorId === CURRENT_USER_ID)
      : COLLECTIONS_WITH_AOT.filter(c => c.status !== "concept")

    let filtered = filterCollections(baseCollections as unknown as typeof MOCK_COLLECTIONS, {
      search: searchQuery,
      status: selectedStatus,
      therapeuticAreas: selectedAreas,
      accessLevel,
    })

    // Apply My Access filter
    if (myAccessFilter !== "all") {
      filtered = filtered.filter(col => {
        const userAccess = (col as unknown as typeof COLLECTIONS_WITH_AOT[0]).userAccess
        if (myAccessFilter === "have_access") {
          return userAccess?.currentUserHasAccess === true
        } else if (myAccessFilter === "need_request") {
          return userAccess?.currentUserHasAccess === false
        }
        return true
      })
    }

    // Apply User/Group Access filter
    if (userGroupFilter.length > 0) {
      filtered = filtered.filter(col => {
        const userAccess = (col as unknown as typeof COLLECTIONS_WITH_AOT[0]).userAccess
        return userGroupFilter.some(group =>
          userAccess?.accessGroups?.includes(group)
        )
      })
    }

    // Apply PRID filter
    if (pridFilter.trim()) {
      const prids = pridFilter.split(',').map(p => p.trim().toUpperCase())
      filtered = filtered.filter(col => {
        const userAccess = (col as unknown as typeof COLLECTIONS_WITH_AOT[0]).userAccess
        return prids.some(prid =>
          userAccess?.accessPrids?.includes(prid)
        )
      })
    }

    // Add intent match info
    filtered = filtered.map(col => ({
      ...col,
      intentMatch: getIntentMatch(col as unknown as (typeof COLLECTIONS_WITH_AOT)[0]),
    }))

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "users":
          return b.totalUsers - a.totalUsers
        case "progress":
          return b.progress - a.progress
        case "match":
          return (b as unknown as (typeof COLLECTIONS_WITH_AOT)[0] & { intentMatch: ReturnType<typeof getIntentMatch> }).intentMatch.score - (a as unknown as (typeof COLLECTIONS_WITH_AOT)[0] & { intentMatch: ReturnType<typeof getIntentMatch> }).intentMatch.score
        case "recent":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

    // Favorites first
    return filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return 0
    })
  }, [searchQuery, selectedStatus, selectedAreas, accessLevel, sortBy, selectedIntents, myAccessFilter, userGroupFilter, pridFilter, showMyDrafts])

  // Toggle filters
  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    )
  }

  const toggleArea = (area: string) => {
    setSelectedAreas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    )
  }

  const toggleIntent = (intent: keyof typeof selectedIntents) => {
    setSelectedIntents(prev => ({ ...prev, [intent]: !prev[intent] }))
  }

  const toggleUserGroup = (group: string) => {
    setUserGroupFilter(prev =>
      prev.includes(group) ? prev.filter(g => g !== group) : [...prev, group]
    )
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedStatus([])
    setSelectedAreas([])
    setAccessLevel("all")
    setMyAccessFilter("all")
    setUserGroupFilter([])
    setPridFilter("")
    setSelectedIntents({
      aiResearch: false,
      softwareDevelopment: false,
      externalPublication: false,
      internalPublication: false,
    })
  }

  const hasActiveIntents = Object.values(selectedIntents).some(Boolean)
  const hasActiveAccessFilters = myAccessFilter !== "all" || userGroupFilter.length > 0 || pridFilter.trim() !== ""
  const hasActiveFilters =
    searchQuery || selectedStatus.length > 0 || selectedAreas.length > 0 || accessLevel !== "all" || hasActiveIntents || hasActiveAccessFilters

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.sort-dropdown')) {
        setSortDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Navigate to collection
  const handleViewCollection = (collectionId: string) => {
    router.push(`/collectoid-v2/collections/${collectionId}`)
  }

  // Get intent match badge display
  const getIntentMatchBadge = (match: string, score: number) => {
    switch (match) {
      case "full":
        return { label: "Matches your intent", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 }
      case "partial":
        return { label: `${score}% match`, color: "bg-amber-100 text-amber-700 border-amber-200", icon: AlertTriangle }
      case "none":
        return { label: "Intent mismatch", color: "bg-red-100 text-red-700 border-red-200", icon: AlertTriangle }
      default:
        return null
    }
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "provisioning":
        return { label: "⚡ Provisioning", color: "bg-blue-100 text-blue-700" }
      case "active":
        return { label: "✅ Active", color: "bg-green-100 text-green-700" }
      case "pending_approval":
        return { label: "🟡 Pending", color: "bg-amber-100 text-amber-700" }
      default:
        return { label: status, color: "bg-neutral-100 text-neutral-700" }
    }
  }

  // Get access badge
  const getAccessBadge = (level: string) => {
    switch (level) {
      case "member":
        return { label: "Member", color: "bg-green-100 text-green-700 border-green-200" }
      case "public":
        return { label: "Public", color: "bg-blue-100 text-blue-700 border-blue-200" }
      case "restricted":
        return { label: "Restricted", color: "bg-red-100 text-red-700 border-red-200" }
      case "request":
        return { label: "Request Access", color: "bg-amber-100 text-amber-700 border-amber-200" }
      default:
        return { label: level, color: "bg-neutral-100 text-neutral-700 border-neutral-200" }
    }
  }

  return (
    <div className="py-8">
      {/* Workspace Context Bar - Fixed at top when in workspace mode */}
      {isWorkspaceMode && (
        <div className={cn(
          "fixed top-0 left-0 right-0 z-50 border-b shadow-sm",
          "bg-white/95 backdrop-blur-sm"
        )}>
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={saveAndReturn}
                  className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 transition-colors"
                >
                  <ArrowLeft className="size-4" />
                  Back to Workspace
                </button>
                <div className="h-5 w-px bg-neutral-200" />
                <div className="flex items-center gap-2">
                  <div className={cn("flex size-8 items-center justify-center rounded-lg bg-gradient-to-br", scheme.from, scheme.to)}>
                    <Layers className="size-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-normal text-neutral-900">{workspaceCollectionName || "Untitled Concept"}</p>
                    <p className="text-xs font-light text-neutral-500">Select datasets to add</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl",
                  selectedDatasets.length > 0 ? scheme.bg : "bg-neutral-100"
                )}>
                  <Database className={cn("size-4", selectedDatasets.length > 0 ? scheme.from.replace("from-", "text-") : "text-neutral-500")} />
                  <span className={cn(
                    "text-sm font-normal",
                    selectedDatasets.length > 0 ? scheme.from.replace("from-", "text-").replace("500", "700") : "text-neutral-600"
                  )}>
                    {selectedDatasets.length} dataset{selectedDatasets.length !== 1 ? "s" : ""} selected
                  </span>
                </div>
                <Button
                  onClick={saveAndReturn}
                  className={cn(
                    "rounded-xl font-light bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
                    scheme.from,
                    scheme.to
                  )}
                >
                  <Check className="size-4 mr-2" />
                  Done
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add top padding when workspace bar is shown */}
      {isWorkspaceMode && <div className="h-16" />}

      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => isWorkspaceMode ? saveAndReturn() : router.push("/collectoid-v2/discover")}
          className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          {isWorkspaceMode ? "Back to Workspace" : "Back to Discovery"}
        </button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extralight text-neutral-900 tracking-tight mb-2">
              {isWorkspaceMode
                ? "Select Datasets"
                : showMyDrafts
                ? "My Concepts"
                : "Browse Collections"}
            </h1>
            <p className="text-base font-light text-neutral-600">
              {isWorkspaceMode
                ? "Choose datasets to include in your collection concept"
                : showMyDrafts
                ? `${filteredCollections.length} private concept${filteredCollections.length !== 1 ? 's' : ''} — only visible to you until promoted to draft`
                : "Explore curated data collections and find what matches your research needs"
              }
            </p>
          </div>
          {!isWorkspaceMode && (
            <Button
              onClick={() => router.push("/collectoid-v2/discover/ai")}
              className={cn(
                "h-12 rounded-2xl font-light shadow-lg hover:shadow-xl transition-all bg-gradient-to-r text-white",
                scheme.from,
                scheme.to
              )}
            >
              <Sparkles className="size-4 mr-2" />
              AI-Assisted Search
            </Button>
          )}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search collections by name, description, datasets, tags..."
              className="pl-12 h-14 rounded-2xl border-neutral-200 font-light text-base"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 hover:bg-neutral-100 rounded-full p-1"
              >
                <X className="size-4 text-neutral-500" />
              </button>
            )}
          </div>
          {/* Desktop Filter Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="hidden xl:flex h-14 px-6 rounded-2xl font-light border-neutral-200 min-w-[140px]"
          >
            <Filter className="size-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge className={cn("ml-2 font-light", scheme.from.replace("from-", "bg-"), "text-white")}>
                {[
                  selectedStatus.length,
                  selectedAreas.length,
                  accessLevel !== "all" ? 1 : 0,
                  myAccessFilter !== "all" ? 1 : 0,
                  userGroupFilter.length,
                  pridFilter.trim() ? 1 : 0,
                  hasActiveIntents ? Object.values(selectedIntents).filter(Boolean).length : 0,
                ].reduce((a, b) => a + b, 0)}
              </Badge>
            )}
          </Button>

          {/* Mobile Filter Sheet */}
          <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                className="xl:hidden h-14 px-6 rounded-2xl font-light border-neutral-200 min-w-[140px]"
              >
                <Filter className="size-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <Badge className={cn("ml-2 font-light", scheme.from.replace("from-", "bg-"), "text-white")}>
                    {[
                      selectedStatus.length,
                      selectedAreas.length,
                      accessLevel !== "all" ? 1 : 0,
                      myAccessFilter !== "all" ? 1 : 0,
                      userGroupFilter.length,
                      pridFilter.trim() ? 1 : 0,
                      hasActiveIntents ? Object.values(selectedIntents).filter(Boolean).length : 0,
                    ].reduce((a, b) => a + b, 0)}
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 overflow-y-auto">
              <SheetHeader>
                <SheetTitle className="font-light">Filters</SheetTitle>
              </SheetHeader>
              <div className="space-y-6 mt-6">
                {/* My Drafts Panel - Mobile */}
                <Card className={cn(
                  "border-2 rounded-2xl overflow-hidden",
                  showMyDrafts
                    ? "border-amber-300 bg-amber-50"
                    : "border-neutral-200"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <FileEdit className={cn("size-4", showMyDrafts ? "text-amber-600" : "text-neutral-600")} />
                      <h3 className="text-sm font-normal text-neutral-900">My Concepts</h3>
                      {myDraftsCount > 0 && (
                        <Badge className="ml-auto bg-amber-100 text-amber-800 border border-amber-200 font-light text-xs">
                          {myDraftsCount}
                        </Badge>
                      )}
                    </div>
                    <button
                      onClick={() => setShowMyDrafts(!showMyDrafts)}
                      className={cn(
                        "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-light transition-all",
                        showMyDrafts
                          ? "bg-amber-200 text-amber-900 border border-amber-300"
                          : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                      )}
                    >
                      {showMyDrafts ? (
                        <>
                          <EyeOff className="size-4" />
                          Viewing Private
                        </>
                      ) : (
                        <>
                          <FileEdit className="size-4" />
                          View My Concepts
                        </>
                      )}
                    </button>
                  </CardContent>
                </Card>

                {/* Intent Filter */}
                <Card className={cn(
                  "border-2 rounded-2xl overflow-hidden",
                  hasActiveIntents
                    ? scheme.from.replace("from-", "border-").replace("-500", "-200")
                    : "border-neutral-200"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Shield className={cn("size-4", hasActiveIntents ? scheme.from.replace("from-", "text-") : "text-neutral-600")} />
                      <h3 className="text-sm font-normal text-neutral-900">My Intended Use</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        { key: "aiResearch", label: "AI research / ML training" },
                        { key: "softwareDevelopment", label: "Software development" },
                        { key: "externalPublication", label: "External publication" },
                        { key: "internalPublication", label: "Internal publication" },
                      ].map((intent) => (
                        <label
                          key={intent.key}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedIntents[intent.key as keyof typeof selectedIntents]}
                            onCheckedChange={() => toggleIntent(intent.key as keyof typeof selectedIntents)}
                          />
                          <span className="text-sm font-light text-neutral-700">{intent.label}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* My Access Filter */}
                <Card className={cn(
                  "border-2 rounded-2xl overflow-hidden",
                  hasActiveAccessFilters ? "border-green-200 bg-green-50" : "border-neutral-200"
                )}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <UserCheck className={cn("size-4", hasActiveAccessFilters ? "text-green-600" : "text-neutral-600")} />
                      <h3 className="text-sm font-normal text-neutral-900">My Access Status</h3>
                    </div>
                    <div className="space-y-2">
                      {[
                        { value: "all", label: "All Collections", icon: Database },
                        { value: "have_access", label: "I Have Access", icon: Unlock },
                        { value: "need_request", label: "Need to Request", icon: Lock },
                      ].map((option) => {
                        const Icon = option.icon
                        return (
                          <button
                            key={option.value}
                            onClick={() => setMyAccessFilter(option.value as "all" | "have_access" | "need_request")}
                            className={cn(
                              "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-light transition-all",
                              myAccessFilter === option.value
                                ? "bg-green-100 text-green-900 border border-green-200"
                                : "hover:bg-neutral-50 text-neutral-700"
                            )}
                          >
                            <Icon className="size-4" />
                            {option.label}
                          </button>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Status Filter */}
                <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-normal text-neutral-900 mb-3">Status</h3>
                    <div className="space-y-2">
                      {[
                        { value: "provisioning", label: "Provisioning" },
                        { value: "active", label: "Active" },
                        { value: "pending_approval", label: "Pending Approval" },
                      ].map((status) => (
                        <label
                          key={status.value}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedStatus.includes(status.value)}
                            onCheckedChange={() => toggleStatus(status.value)}
                          />
                          <span className="text-sm font-light text-neutral-700">{status.label}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Therapeutic Areas */}
                <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                  <CardContent className="p-4">
                    <h3 className="text-sm font-normal text-neutral-900 mb-3">Therapeutic Area</h3>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {allAreas.map((area) => (
                        <label
                          key={area}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer"
                        >
                          <Checkbox
                            checked={selectedAreas.includes(area)}
                            onCheckedChange={() => toggleArea(area)}
                          />
                          <span className="text-sm font-light text-neutral-700">{area}</span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearAllFilters}
                    className="w-full rounded-xl font-light border-neutral-200"
                  >
                    <X className="size-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="flex gap-4 xl:gap-6">
        {/* Filters Sidebar - Hidden on smaller screens and in workspace mode */}
        {showFilters && !isWorkspaceMode && (
          <div className="hidden xl:block w-72 shrink-0 space-y-6">
            {/* My Drafts Panel */}
            <Card className={cn(
              "border-2 rounded-2xl overflow-hidden",
              showMyDrafts
                ? "border-amber-300 bg-amber-50"
                : "border-neutral-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <FileEdit className={cn("size-4", showMyDrafts ? "text-amber-600" : "text-neutral-600")} />
                  <h3 className="text-sm font-normal text-neutral-900">My Concepts</h3>
                  {myDraftsCount > 0 && (
                    <Badge className="ml-auto bg-amber-100 text-amber-800 border border-amber-200 font-light text-xs">
                      {myDraftsCount}
                    </Badge>
                  )}
                </div>
                <button
                  onClick={() => setShowMyDrafts(!showMyDrafts)}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-light transition-all",
                    showMyDrafts
                      ? "bg-amber-200 text-amber-900 border border-amber-300"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  )}
                >
                  {showMyDrafts ? (
                    <>
                      <EyeOff className="size-4" />
                      Viewing Private
                    </>
                  ) : (
                    <>
                      <FileEdit className="size-4" />
                      View My Concepts
                    </>
                  )}
                </button>
              </CardContent>
            </Card>

            {/* Intent Filter - Most Important for End Users */}
            <Card className={cn(
              "border-2 rounded-2xl overflow-hidden",
              hasActiveIntents
                ? scheme.from.replace("from-", "border-").replace("-500", "-200")
                : "border-neutral-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className={cn("size-4", hasActiveIntents ? scheme.from.replace("from-", "text-") : "text-neutral-600")} />
                  <h3 className="text-sm font-normal text-neutral-900">My Intended Use</h3>
                </div>
                <p className="text-xs font-light text-neutral-500 mb-3">
                  Select your intended uses to see which collections match
                </p>
                <div className="space-y-2">
                  {[
                    { key: "aiResearch", label: "AI research / ML training" },
                    { key: "softwareDevelopment", label: "Software development" },
                    { key: "externalPublication", label: "External publication" },
                    { key: "internalPublication", label: "Internal publication" },
                  ].map((intent) => (
                    <label
                      key={intent.key}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedIntents[intent.key as keyof typeof selectedIntents]}
                        onCheckedChange={() => toggleIntent(intent.key as keyof typeof selectedIntents)}
                      />
                      <span className="text-sm font-light text-neutral-700">{intent.label}</span>
                    </label>
                  ))}
                </div>
                {hasActiveIntents && (
                  <div className="mt-3 pt-3 border-t border-neutral-100">
                    <p className="text-xs font-light text-neutral-500">
                      Collections are sorted by how well they match your intent
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* My Access Filter - MOST IMPORTANT */}
            <Card className={cn(
              "border-2 rounded-2xl overflow-hidden",
              hasActiveAccessFilters
                ? "border-green-200 bg-green-50"
                : "border-neutral-200"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <UserCheck className={cn("size-4", hasActiveAccessFilters ? "text-green-600" : "text-neutral-600")} />
                  <h3 className="text-sm font-normal text-neutral-900">My Access Status</h3>
                </div>
                <p className="text-xs font-light text-neutral-500 mb-3">
                  Filter by your current access to collections
                </p>
                <div className="space-y-2 mb-4">
                  {[
                    { value: "all", label: "All Collections", icon: Database },
                    { value: "have_access", label: "I Have Access", icon: Unlock },
                    { value: "need_request", label: "Need to Request", icon: Lock },
                  ].map((option) => {
                    const Icon = option.icon
                    return (
                      <button
                        key={option.value}
                        onClick={() => setMyAccessFilter(option.value as "all" | "have_access" | "need_request")}
                        className={cn(
                          "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-light transition-all",
                          myAccessFilter === option.value
                            ? "bg-green-100 text-green-900 border border-green-200"
                            : "hover:bg-neutral-50 text-neutral-700"
                        )}
                      >
                        <Icon className="size-4" />
                        {option.label}
                      </button>
                    )
                  })}
                </div>

                {/* Advanced Access Filters */}
                <div className="pt-3 border-t border-neutral-200">
                  <button
                    onClick={() => setShowAdvancedAccess(!showAdvancedAccess)}
                    className="flex items-center justify-between w-full text-xs font-light text-neutral-600 hover:text-neutral-900 mb-2"
                  >
                    <span>Advanced Access Filters</span>
                    <ChevronDown className={cn(
                      "size-3 transition-transform",
                      showAdvancedAccess && "rotate-180"
                    )} />
                  </button>

                  {showAdvancedAccess && (
                    <div className="space-y-3 mt-3">
                      {/* User Group Filter */}
                      <div>
                        <Label className="text-xs font-light text-neutral-600 mb-2 block">
                          Filter by User Group
                        </Label>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {USER_GROUPS.map((group) => (
                            <label
                              key={group}
                              className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer"
                            >
                              <Checkbox
                                checked={userGroupFilter.includes(group)}
                                onCheckedChange={() => toggleUserGroup(group)}
                              />
                              <span className="text-xs font-light text-neutral-700">{group}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* PRID Filter */}
                      <div>
                        <Label className="text-xs font-light text-neutral-600 mb-2 block">
                          Filter by PRID(s)
                        </Label>
                        <Input
                          value={pridFilter}
                          onChange={(e) => setPridFilter(e.target.value)}
                          placeholder="PRID12345, PRID67890..."
                          className="h-9 rounded-lg border-neutral-200 font-light text-xs"
                        />
                        <p className="text-xs font-light text-neutral-400 mt-1">
                          Comma-separated list
                        </p>
                      </div>

                      {(userGroupFilter.length > 0 || pridFilter.trim()) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setUserGroupFilter([])
                            setPridFilter("")
                          }}
                          className="w-full h-8 rounded-lg font-light text-xs text-neutral-500"
                        >
                          Clear Advanced Filters
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Access Level */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-normal text-neutral-900 mb-3">Access Level</h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Collections" },
                    { value: "mine", label: "My Collections" },
                    { value: "public", label: "Public" },
                    { value: "restricted", label: "Restricted" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setAccessLevel(option.value as "all" | "mine" | "public" | "restricted")}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-light transition-all",
                        accessLevel === option.value
                          ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                          : "hover:bg-neutral-50 text-neutral-700"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Status Filter */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-normal text-neutral-900 mb-3">Status</h3>
                <div className="space-y-2">
                  {[
                    { value: "provisioning", label: "Provisioning" },
                    { value: "active", label: "Active" },
                    { value: "pending_approval", label: "Pending Approval" },
                  ].map((status) => (
                    <label
                      key={status.value}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedStatus.includes(status.value)}
                        onCheckedChange={() => toggleStatus(status.value)}
                      />
                      <span className="text-sm font-light text-neutral-700">{status.label}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Therapeutic Areas */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-normal text-neutral-900 mb-3">Therapeutic Area</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {allAreas.map((area) => (
                    <label
                      key={area}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedAreas.includes(area)}
                        onCheckedChange={() => toggleArea(area)}
                      />
                      <span className="text-sm font-light text-neutral-700">{area}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1">
          {/* Access Filter Banner */}
          {myAccessFilter !== "all" && (
            <Card className={cn(
              "border-2 rounded-2xl overflow-hidden mb-6",
              myAccessFilter === "have_access"
                ? "border-green-200 bg-green-50"
                : "border-amber-200 bg-amber-50"
            )}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {myAccessFilter === "have_access" ? (
                      <>
                        <div className="flex size-10 items-center justify-center rounded-xl bg-green-100">
                          <Unlock className="size-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-normal text-green-900">
                            Showing Collections You Have Access To
                          </p>
                          <p className="text-xs font-light text-green-700">
                            {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''} available
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100">
                          <Lock className="size-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="text-sm font-normal text-amber-900">
                            Showing Collections Requiring Request
                          </p>
                          <p className="text-xs font-light text-amber-700">
                            {filteredCollections.length} collection{filteredCollections.length !== 1 ? 's' : ''} need access request
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMyAccessFilter("all")}
                    className="rounded-lg font-light"
                  >
                    <X className="size-4 mr-2" />
                    Clear Filter
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <p className="text-sm font-light text-neutral-600">
                {filteredCollections.length} collection{filteredCollections.length !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-light text-neutral-600">Sort:</span>
                <div className="relative sort-dropdown">
                  <button
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className={cn(
                      "h-9 pl-4 pr-10 rounded-xl border-2 font-light text-sm bg-white transition-all min-w-[140px] text-left",
                      sortDropdownOpen
                        ? cn("border-current", scheme.from.replace("from-", "border-").replace("-500", "-400"))
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                  >
                    {sortBy === "match" ? "Best Match" : sortBy === "recent" ? "Most Recent" : sortBy === "name" ? "Name (A-Z)" : sortBy === "users" ? "Most Users" : "Progress"}
                  </button>
                  <ChevronDown className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none transition-transform",
                    sortDropdownOpen && "rotate-180"
                  )} />
                  {sortDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl border-2 border-neutral-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {[
                        { value: "match", label: "Best Match" },
                        { value: "recent", label: "Most Recent" },
                        { value: "name", label: "Name (A-Z)" },
                        { value: "users", label: "Most Users" },
                        { value: "progress", label: "Progress" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as "recent" | "name" | "users" | "progress" | "match")
                            setSortDropdownOpen(false)
                          }}
                          className={cn(
                            "w-full px-4 py-2.5 text-left text-sm font-light transition-colors",
                            sortBy === option.value
                              ? cn("bg-neutral-100 text-neutral-900", scheme.from.replace("from-", "text-").replace("-500", "-700"))
                              : "hover:bg-neutral-50"
                          )}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side Controls */}
            <div className="flex items-center gap-3">
              {/* Clear Filters */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={clearAllFilters}
                  className="h-9 rounded-xl font-light border-neutral-200"
                >
                  <X className="size-4 mr-2" />
                  Clear Filters
                </Button>
              )}

              {/* View Toggle */}
              <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === "grid" ? "bg-white shadow-sm" : "hover:bg-neutral-50"
                  )}
                >
                  <Grid3x3 className="size-4 text-neutral-600" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-2 rounded-md transition-all",
                    viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-neutral-50"
                  )}
                >
                  <List className="size-4 text-neutral-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredCollections.length === 0 && (
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-12 text-center">
                {showMyDrafts ? (
                  <>
                    <FileEdit className="size-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-light text-neutral-900 mb-2">No draft collections</h3>
                    <p className="text-sm font-light text-neutral-600 mb-6">
                      Start creating a collection to see your drafts here
                    </p>
                    <Button
                      onClick={() => router.push("/collectoid-v2/dcm/create")}
                      className={cn("rounded-xl font-light bg-gradient-to-r text-white", scheme.from, scheme.to)}
                    >
                      <PlusCircle className="size-4 mr-2" />
                      Create Collection
                    </Button>
                  </>
                ) : (
                  <>
                    <Database className="size-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-xl font-light text-neutral-900 mb-2">No collections found</h3>
                    <p className="text-sm font-light text-neutral-600 mb-6">
                      {hasActiveFilters
                        ? "Try adjusting your filters or search query"
                        : "No collections available"}
                    </p>
                    {hasActiveFilters && (
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="rounded-xl font-light border-neutral-200"
                      >
                        Clear Filters
                      </Button>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Dataset Selection - Workspace Mode (Full Page Layout) */}
          {isWorkspaceMode && (
            <div className="flex gap-6">
              {/* Main Content */}
              <div className="flex-1 max-w-4xl">
                {/* Centered Header */}
                <div className="text-center mb-8">
                  <div
                    className={cn(
                      "inline-flex items-center justify-center size-16 rounded-2xl mb-4 bg-gradient-to-br",
                      scheme.bg
                    )}
                  >
                    <Database className={cn("size-8", scheme.from.replace("from-", "text-"))} />
                  </div>
                  <h1 className="text-3xl font-extralight text-neutral-900 mb-3 tracking-tight">
                    Refine Your Dataset Selection
                  </h1>
                  <p className="text-base font-light text-neutral-600 max-w-2xl mx-auto mb-3">
                    Filter and select the datasets you need for your collection
                  </p>
                  <button className={cn(
                    "inline-flex items-center gap-2 text-sm font-light transition-colors",
                    scheme.from.replace("from-", "text-"),
                    "hover:underline"
                  )}>
                    <HelpCircle className="size-4" />
                    Learn about smart filtering
                  </button>
                </div>

                {/* Compact Filter Panel */}
                <Card className="border-neutral-200 rounded-2xl overflow-hidden shadow-sm mb-6">
                  <CardContent className="p-4">
                    {/* Header Row */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Sliders className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                          <span className="text-sm font-normal text-neutral-900">Filters</span>
                        </div>
                        <Separator orientation="vertical" className="h-5" />
                        <div className="flex items-center gap-2">
                          <Database className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                          <span className="text-2xl font-light text-neutral-900">{filteredWsDatasets.length}</span>
                          <span className="text-sm font-light text-neutral-600">datasets match</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasActiveWsFilters && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearAllWsFilters}
                            className="h-8 rounded-lg font-light text-xs text-neutral-500 hover:text-neutral-700"
                          >
                            <X className="size-3 mr-1" />
                            Clear All
                          </Button>
                        )}
                        {filteredWsDatasets.length > 0 && (
                          <Button
                            size="sm"
                            onClick={addAllWsDatasets}
                            className={cn(
                              "h-8 rounded-lg font-light text-xs bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
                              scheme.from,
                              scheme.to
                            )}
                          >
                            <Check className="size-3.5 mr-1.5" />
                            Add All {filteredWsDatasets.length}
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Filter Dropdowns Row */}
                    <div className="flex flex-wrap gap-2">
                      {/* Phase Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 rounded-lg font-light text-xs border-neutral-200",
                              wsPhaseFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                            )}
                          >
                            Phase
                            {wsPhaseFilters.length > 0 && (
                              <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                                {wsPhaseFilters.length}
                              </Badge>
                            )}
                            <ChevronDown className="size-3 ml-1 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-2" align="start">
                          <div className="space-y-1">
                            {["Phase I", "Phase II", "Phase III", "Phase IV"].map((phase) => (
                              <label key={phase} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                                <Checkbox
                                  checked={wsPhaseFilters.includes(phase)}
                                  onCheckedChange={() => toggleWsFilter(wsPhaseFilters, setWsPhaseFilters, phase)}
                                  className="size-3.5"
                                />
                                <span className="text-sm font-light text-neutral-700">{phase}</span>
                              </label>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Status Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 rounded-lg font-light text-xs border-neutral-200",
                              wsStatusFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                            )}
                          >
                            Status
                            {wsStatusFilters.length > 0 && (
                              <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                                {wsStatusFilters.length}
                              </Badge>
                            )}
                            <ChevronDown className="size-3 ml-1 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-36 p-2" align="start">
                          <div className="space-y-1">
                            {["Active", "Closed"].map((status) => (
                              <label key={status} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                                <Checkbox
                                  checked={wsStatusFilters.includes(status)}
                                  onCheckedChange={() => toggleWsFilter(wsStatusFilters, setWsStatusFilters, status)}
                                  className="size-3.5"
                                />
                                <span className="text-sm font-light text-neutral-700">{status}</span>
                              </label>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Geography Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 rounded-lg font-light text-xs border-neutral-200",
                              wsGeographyFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                            )}
                          >
                            <Globe className="size-3 mr-1" />
                            Geography
                            {wsGeographyFilters.length > 0 && (
                              <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                                {wsGeographyFilters.length}
                              </Badge>
                            )}
                            <ChevronDown className="size-3 ml-1 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-44 p-2" align="start">
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {["North America", "Europe", "Asia Pacific", "Latin America", "Global"].map((geo) => (
                              <label key={geo} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                                <Checkbox
                                  checked={wsGeographyFilters.includes(geo)}
                                  onCheckedChange={() => toggleWsFilter(wsGeographyFilters, setWsGeographyFilters, geo)}
                                  className="size-3.5"
                                />
                                <span className="text-sm font-light text-neutral-700">{geo}</span>
                              </label>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Therapeutic Area Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 rounded-lg font-light text-xs border-neutral-200",
                              wsTherapeuticFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                            )}
                          >
                            <Target className="size-3 mr-1" />
                            Therapeutic
                            {wsTherapeuticFilters.length > 0 && (
                              <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                                {wsTherapeuticFilters.length}
                              </Badge>
                            )}
                            <ChevronDown className="size-3 ml-1 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2" align="start">
                          <div className="space-y-1 max-h-48 overflow-y-auto">
                            {["Oncology", "Cardiovascular", "Neurology", "Immunology", "Respiratory", "Rare Disease"].map((area) => (
                              <label key={area} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                                <Checkbox
                                  checked={wsTherapeuticFilters.includes(area)}
                                  onCheckedChange={() => toggleWsFilter(wsTherapeuticFilters, setWsTherapeuticFilters, area)}
                                  className="size-3.5"
                                />
                                <span className="text-sm font-light text-neutral-700">{area}</span>
                              </label>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Data Modality Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 rounded-lg font-light text-xs border-neutral-200",
                              wsModalityFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                            )}
                          >
                            <Microscope className="size-3 mr-1" />
                            Modality
                            {wsModalityFilters.length > 0 && (
                              <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                                {wsModalityFilters.length}
                              </Badge>
                            )}
                            <ChevronDown className="size-3 ml-1 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-52 p-2" align="start">
                          <div className="space-y-1">
                            {["Clinical", "Genomic", "Imaging", "Biomarker", "PRO"].map((modality) => (
                              <label key={modality} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                                <Checkbox
                                  checked={wsModalityFilters.includes(modality)}
                                  onCheckedChange={() => toggleWsFilter(wsModalityFilters, setWsModalityFilters, modality)}
                                  className="size-3.5"
                                />
                                <span className="text-sm font-light text-neutral-700">{modality}</span>
                              </label>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Sponsor Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 rounded-lg font-light text-xs border-neutral-200",
                              wsSponsorFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                            )}
                          >
                            <Building className="size-3 mr-1" />
                            Sponsor
                            {wsSponsorFilters.length > 0 && (
                              <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                                {wsSponsorFilters.length}
                              </Badge>
                            )}
                            <ChevronDown className="size-3 ml-1 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-48 p-2" align="start">
                          <div className="space-y-1">
                            {["Sponsor", "Investigator-Initiated", "Academic", "Government"].map((sponsor) => (
                              <label key={sponsor} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                                <Checkbox
                                  checked={wsSponsorFilters.includes(sponsor)}
                                  onCheckedChange={() => toggleWsFilter(wsSponsorFilters, setWsSponsorFilters, sponsor)}
                                  className="size-3.5"
                                />
                                <span className="text-sm font-light text-neutral-700">{sponsor}</span>
                              </label>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* Sharing Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 rounded-lg font-light text-xs border-neutral-200",
                              wsSharingFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                            )}
                          >
                            <Shield className="size-3 mr-1" />
                            Sharing
                            {wsSharingFilters.length > 0 && (
                              <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                                {wsSharingFilters.length}
                              </Badge>
                            )}
                            <ChevronDown className="size-3 ml-1 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-2" align="start">
                          <div className="space-y-1">
                            {["Research allowed", "Research not allowed", "Research with restriction"].map((sharing) => (
                              <label key={sharing} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                                <Checkbox
                                  checked={wsSharingFilters.includes(sharing)}
                                  onCheckedChange={() => toggleWsFilter(wsSharingFilters, setWsSharingFilters, sharing)}
                                  className="size-3.5"
                                />
                                <span className="text-sm font-light text-neutral-700">{sharing}</span>
                              </label>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>

                      {/* IDs Filter */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className={cn(
                              "h-8 rounded-lg font-light text-xs border-neutral-200",
                              (wsNctIdentifier || wsEudraCTIdentifier) && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                            )}
                          >
                            <FileText className="size-3 mr-1" />
                            IDs
                            {(wsNctIdentifier || wsEudraCTIdentifier) && (
                              <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                                {(wsNctIdentifier ? 1 : 0) + (wsEudraCTIdentifier ? 1 : 0)}
                              </Badge>
                            )}
                            <ChevronDown className="size-3 ml-1 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3" align="start">
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">NCT Identifier</label>
                              <Input
                                value={wsNctIdentifier}
                                onChange={(e) => setWsNctIdentifier(e.target.value)}
                                placeholder="e.g., NCT03456789"
                                className="h-8 text-xs font-light"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-neutral-500 mb-1.5 block">EudraCT Identifier</label>
                              <Input
                                value={wsEudraCTIdentifier}
                                onChange={(e) => setWsEudraCTIdentifier(e.target.value)}
                                placeholder="e.g., 2019-001234-56"
                                className="h-8 text-xs font-light"
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </CardContent>
                </Card>

                {/* Active Filters Summary */}
                {hasActiveWsFilters && (
                  <div className="space-y-2 mb-6">
                    <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">Active Filters</p>
                    <div className="flex flex-wrap gap-2">
                      {/* Phase Filters */}
                      {wsPhaseFilters.map((phase) => (
                        <Badge
                          key={phase}
                          variant="outline"
                          className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                          onClick={() => toggleWsFilter(wsPhaseFilters, setWsPhaseFilters, phase)}
                        >
                          {phase}
                          <X className="size-3 ml-1.5 inline" />
                        </Badge>
                      ))}

                      {/* Status Filters */}
                      {wsStatusFilters.map((status) => (
                        <Badge
                          key={status}
                          variant="outline"
                          className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                          onClick={() => toggleWsFilter(wsStatusFilters, setWsStatusFilters, status)}
                        >
                          {status}
                          <X className="size-3 ml-1.5 inline" />
                        </Badge>
                      ))}

                      {/* Crossover Filters */}
                      {wsCrossoverFilters.map((crossover) => (
                        <Badge
                          key={crossover}
                          variant="outline"
                          className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                          onClick={() => toggleWsFilter(wsCrossoverFilters, setWsCrossoverFilters, crossover)}
                        >
                          Crossover: {crossover}
                          <X className="size-3 ml-1.5 inline" />
                        </Badge>
                      ))}

                      {/* Usage Filters */}
                      {wsUsageFilters.map((usage) => (
                        <Badge
                          key={usage}
                          variant="outline"
                          className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                          onClick={() => toggleWsFilter(wsUsageFilters, setWsUsageFilters, usage)}
                        >
                          Usage: {usage}
                          <X className="size-3 ml-1.5 inline" />
                        </Badge>
                      ))}

                      {/* Geography Filters */}
                      {wsGeographyFilters.map((geo) => (
                        <Badge
                          key={geo}
                          variant="outline"
                          className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                          onClick={() => toggleWsFilter(wsGeographyFilters, setWsGeographyFilters, geo)}
                        >
                          {geo}
                          <X className="size-3 ml-1.5 inline" />
                        </Badge>
                      ))}

                      {/* Therapeutic Area Filters */}
                      {wsTherapeuticFilters.map((ta) => (
                        <Badge
                          key={ta}
                          variant="outline"
                          className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                          onClick={() => toggleWsFilter(wsTherapeuticFilters, setWsTherapeuticFilters, ta)}
                        >
                          {ta}
                          <X className="size-3 ml-1.5 inline" />
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Smart Filter */}
                <button
                  className={cn(
                    "w-full rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-all p-6 text-left group mb-6"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "flex size-12 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg",
                      scheme.from,
                      scheme.to
                    )}>
                      <Sparkles className="size-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-normal text-neutral-900 mb-1 flex items-center gap-2">
                        AI Smart Filter
                        <Badge className={cn(
                          "font-light text-xs",
                          scheme.from.replace("from-", "bg-").replace("500", "100"),
                          scheme.from.replace("from-", "text-")
                        )}>
                          Beta
                        </Badge>
                      </h3>
                      <p className="text-sm font-light text-neutral-600">
                        Describe what you&apos;re looking for in natural language and let AI refine your search
                      </p>
                    </div>
                    <ArrowRight className="size-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                  </div>
                </button>

                {/* Dataset List */}
                <div className="space-y-4">
                  {filteredWsDatasets.length === 0 ? (
                    <div className="text-center py-12">
                      <Database className="size-12 text-neutral-300 mx-auto mb-3" />
                      <p className="text-sm font-light text-neutral-600">No datasets match your filters</p>
                      {hasActiveWsFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllWsFilters}
                          className="mt-4 rounded-xl font-light border-neutral-200"
                        >
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  ) : (
                    filteredWsDatasets.map((dataset) => {
                      const isSelected = isDatasetSelected(dataset.id)
                      return (
                        <Card
                          key={dataset.id}
                          className="border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                        >
                          <CardContent className="px-4 py-3">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-1">
                                  <h3 className="text-lg font-normal text-neutral-900">{dataset.name}</h3>
                                  <Badge variant="outline" className="font-light">
                                    {dataset.code}
                                  </Badge>
                                  <Badge
                                    className={cn(
                                      "font-light",
                                      dataset.status === "Closed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-amber-100 text-amber-800"
                                    )}
                                  >
                                    {dataset.status}
                                  </Badge>
                                </div>
                                <p className="text-sm font-light text-neutral-600 mb-1.5">
                                  {dataset.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs font-light text-neutral-500">
                                  <span>{dataset.patientCount.toLocaleString()} patients</span>
                                  <span>•</span>
                                  <span>{dataset.phase}</span>
                                  {dataset.closedDate && (
                                    <>
                                      <span>•</span>
                                      <span>Closed {dataset.closedDate}</span>
                                    </>
                                  )}
                                  <span>•</span>
                                  <span>{dataset.geography.join(", ")}</span>
                                </div>
                              </div>
                            </div>

                            {/* Collection Crossover */}
                            {dataset.collections.length > 0 && (
                              <div
                                className={cn("rounded-xl p-2.5 mb-2.5", scheme.bg.replace("500", "50"))}
                              >
                                <div className="flex items-start gap-2">
                                  <Layers
                                    className={cn(
                                      "size-4 shrink-0 mt-0.5",
                                      scheme.from.replace("from-", "text-")
                                    )}
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-normal text-neutral-900 mb-1">
                                      In {dataset.collections.length} collection
                                      {dataset.collections.length !== 1 ? "s" : ""}
                                    </p>
                                    <div className="flex flex-wrap gap-1">
                                      {dataset.collections.slice(0, 3).map((collection, i) => (
                                        <Badge
                                          key={i}
                                          variant="outline"
                                          className="text-xs font-light border-neutral-200"
                                        >
                                          {collection}
                                        </Badge>
                                      ))}
                                      {dataset.collections.length > 3 && (
                                        <Badge variant="outline" className="text-xs font-light">
                                          +{dataset.collections.length - 3} more
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Usage Analytics */}
                            <div className="grid grid-cols-3 gap-3 mb-2.5">
                              <div className="flex items-center gap-2">
                                <Users className="size-4 text-neutral-400" />
                                <div>
                                  <p className="text-xs font-light text-neutral-500">Active Users</p>
                                  <p className="text-sm font-normal text-neutral-900">
                                    {dataset.activeUsers}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Building className="size-4 text-neutral-400" />
                                <div>
                                  <p className="text-xs font-light text-neutral-500">Organizations</p>
                                  <p className="text-sm font-normal text-neutral-900">
                                    {dataset.organizations}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="size-4 text-neutral-400" />
                                <div>
                                  <p className="text-xs font-light text-neutral-500">Data Location</p>
                                  <p className="text-sm font-normal text-neutral-900">
                                    {Object.values(dataset.dataLocation).join(", ")}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Access Eligibility RAG Bar */}
                            <div className="mb-2.5">
                              <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">
                                Access Eligibility
                              </p>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
                                    <div className="flex h-full">
                                      <div
                                        className="bg-green-500"
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
                                  </div>
                                </div>
                                <div className="flex items-center justify-between text-xs font-light text-neutral-600">
                                  <span>{dataset.accessBreakdown.alreadyOpen}% open</span>
                                  <span>{dataset.accessBreakdown.readyToGrant}% ready</span>
                                  <span>{dataset.accessBreakdown.needsApproval}% needs approval</span>
                                </div>
                              </div>
                            </div>

                            {/* Frequently Bundled With + Actions */}
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                {dataset.frequentlyBundledWith.length > 0 && (
                                  <>
                                    <div className="flex items-center gap-2 mb-1.5">
                                      <Sparkles className="size-3 text-neutral-400" />
                                      <p className="text-xs font-light text-neutral-600">
                                        Frequently bundled with:
                                      </p>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {dataset.frequentlyBundledWith.map((code) => (
                                        <Badge key={code} variant="outline" className="text-xs font-light">
                                          {code}
                                        </Badge>
                                      ))}
                                    </div>
                                  </>
                                )}
                              </div>
                              <Button
                                size="sm"
                                onClick={() => toggleDatasetSelection(dataset)}
                                className={cn(
                                  "rounded-xl font-light transition-all shrink-0",
                                  isSelected
                                    ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                                    : cn("bg-gradient-to-r text-white shadow-md hover:shadow-lg", scheme.from, scheme.to)
                                )}
                              >
                                {isSelected ? (
                                  <>
                                    <X className="size-4 mr-1" />
                                    Remove
                                  </>
                                ) : (
                                  <>
                                    <Zap className="size-4 mr-1" />
                                    Add to Collection
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Right Sidebar - Selected Datasets */}
              <div className="w-80 shrink-0">
                <Card className="border-neutral-200 rounded-2xl overflow-hidden shadow-lg sticky top-24">
                  <CardContent className="p-6">
                    {/* Header with icon */}
                    <div className="flex items-center gap-3 mb-4">
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-full bg-gradient-to-r text-white",
                          scheme.from,
                          scheme.to
                        )}
                      >
                        <Database className="size-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-normal text-neutral-900">Selected Datasets</h3>
                        <p className="text-2xl font-light text-neutral-900">{selectedDatasets.length}</p>
                      </div>
                    </div>

                    {/* Access Eligibility RAG Bar */}
                    {wsAccessBreakdown && selectedDatasets.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">Access Eligibility</p>
                          <p className="text-xs font-medium text-green-600">{wsAccessBreakdown.alreadyOpen + wsAccessBreakdown.readyToGrant}% ready</p>
                        </div>
                        <div className="flex gap-0.5 h-3 rounded-full overflow-hidden bg-neutral-100">
                          <div
                            className="bg-green-500 transition-all duration-500"
                            style={{ width: `${wsAccessBreakdown.alreadyOpen}%` }}
                            title={`Already Open: ${wsAccessBreakdown.alreadyOpen}%`}
                          />
                          <div
                            className={cn("bg-gradient-to-r transition-all duration-500", scheme.from, scheme.to)}
                            style={{ width: `${wsAccessBreakdown.readyToGrant}%` }}
                            title={`Awaiting Policy: ${wsAccessBreakdown.readyToGrant}%`}
                          />
                          <div
                            className="bg-amber-500 transition-all duration-500"
                            style={{ width: `${wsAccessBreakdown.needsApproval}%` }}
                            title={`Needs Approval: ${wsAccessBreakdown.needsApproval}%`}
                          />
                          <div
                            className="bg-neutral-400 transition-all duration-500"
                            style={{ width: `${wsAccessBreakdown.missingLocation}%` }}
                            title={`Missing Location: ${wsAccessBreakdown.missingLocation}%`}
                          />
                        </div>
                        <div className="flex items-center justify-between mt-1.5">
                          <div className="flex items-center gap-3 text-xs font-light text-neutral-500">
                            <span className="flex items-center gap-1">
                              <span className="size-2 rounded-full bg-green-500" /> Open
                            </span>
                            <span className="flex items-center gap-1">
                              <span className={cn("size-2 rounded-full bg-gradient-to-r", scheme.from, scheme.to)} /> Policy
                            </span>
                            <span className="flex items-center gap-1">
                              <span className="size-2 rounded-full bg-amber-500" /> Review
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <Separator className="mb-6" />

                    {/* Access Breakdown Details */}
                    {wsAccessBreakdown && selectedDatasets.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle2 className="size-4 text-green-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-normal text-neutral-900">Already Open</p>
                              <Badge className="bg-green-100 text-green-800 font-light text-xs">{wsAccessBreakdown.alreadyOpen}%</Badge>
                            </div>
                            <p className="text-xs font-light text-neutral-600">Instant access</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", scheme.from.replace("from-", "bg-").replace("500", "100"))}>
                            <Zap className={cn("size-4", scheme.from.replace("from-", "text-"))} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-normal text-neutral-900">Awaiting Policy</p>
                              <Badge className={cn("font-light text-xs", scheme.from.replace("from-", "bg-").replace("500", "100"), scheme.from.replace("from-", "text-"))}>{wsAccessBreakdown.readyToGrant}%</Badge>
                            </div>
                            <p className="text-xs font-light text-neutral-600">Auto-provisioned</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                            <Clock className="size-4 text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-normal text-neutral-900">Needs Approval</p>
                              <Badge className="bg-amber-100 text-amber-800 font-light text-xs">{wsAccessBreakdown.needsApproval}%</Badge>
                            </div>
                            <p className="text-xs font-light text-neutral-600">Requires review</p>
                          </div>
                        </div>

                        <Separator className="my-4" />

                        {/* Selected datasets list */}
                        <div className="max-h-[200px] overflow-y-auto space-y-2">
                          {selectedDatasets.slice(0, 5).map((dataset) => (
                            <div
                              key={dataset.id}
                              className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 group"
                            >
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-normal text-neutral-900 truncate">{dataset.code}</p>
                                <p className="text-xs font-light text-neutral-500 truncate">{dataset.name}</p>
                              </div>
                              <button
                                onClick={() => toggleDatasetSelection(dataset)}
                                className="h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="size-3 text-neutral-500 hover:text-red-600" />
                              </button>
                            </div>
                          ))}
                          {selectedDatasets.length > 5 && (
                            <p className="text-xs font-light text-neutral-500 text-center py-2">
                              +{selectedDatasets.length - 5} more datasets
                            </p>
                          )}
                        </div>

                        <Separator className="my-4" />

                        <Button
                          variant="outline"
                          onClick={() => setSelectedDatasets([])}
                          className="w-full rounded-xl font-light border-neutral-200"
                        >
                          Clear All
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Database className="size-12 text-neutral-200 mx-auto mb-3" />
                        <p className="text-sm font-light text-neutral-500">No datasets selected yet</p>
                        <p className="text-xs font-light text-neutral-400 mt-1">Click on datasets to add them</p>
                      </div>
                    )}
                  </CardContent>

                  {/* Fixed footer with Continue Button */}
                  <div className="p-4 border-t border-neutral-100 bg-white">
                    <p className="text-xs font-light text-neutral-500 mb-3 text-center">
                      Access provisioning times vary based on approval requirements.
                    </p>
                    <Button
                      onClick={saveAndReturn}
                      disabled={selectedDatasets.length === 0}
                      className={cn(
                        "w-full rounded-xl font-light transition-all",
                        selectedDatasets.length > 0
                          ? cn("bg-gradient-to-r text-white shadow-md hover:shadow-lg", scheme.from, scheme.to)
                          : "bg-neutral-100 text-neutral-400"
                      )}
                    >
                      Continue with {selectedDatasets.length} datasets
                      <ArrowRight className="size-4 ml-2" />
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Grid View - Collections (when not in workspace mode) */}
          {!isWorkspaceMode && viewMode === "grid" && filteredCollections.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCollections.map((collection) => {
                const statusBadge = getStatusBadge(collection.status)
                const accessBadge = getAccessBadge(collection.accessLevel)

                return (
                  <Card
                    key={collection.id}
                    className="border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => handleViewCollection(collection.id)}
                  >
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {collection.isFavorite && (
                              <Star className="size-4 fill-amber-400 text-amber-400" />
                            )}
                            <h3 className="text-base font-normal text-neutral-900 line-clamp-1">
                              {collection.name}
                            </h3>
                            {collection.status === "draft" && (
                              <Badge className="text-xs font-light py-0.5 px-2 bg-amber-50 text-amber-700 border border-amber-200">
                                Draft
                              </Badge>
                            )}
                            {collection.status === "concept" && (
                              <Badge className="text-xs font-light py-0.5 px-2 bg-neutral-100 text-neutral-600 border border-neutral-200">
                                Concept
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs font-light text-neutral-600 line-clamp-2 mb-3">
                            {collection.description}
                          </p>
                        </div>
                      </div>

                      {/* User Access Status Badge */}
                      {(collection as unknown as (typeof COLLECTIONS_WITH_AOT)[0]).userAccess && (
                        <div className="mb-3">
                          <Badge className={cn(
                            "font-light text-xs border",
                            (collection as unknown as (typeof COLLECTIONS_WITH_AOT)[0]).userAccess.currentUserHasAccess
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          )}>
                            {(collection as unknown as (typeof COLLECTIONS_WITH_AOT)[0]).userAccess.currentUserHasAccess ? (
                              <>
                                <Unlock className="size-3 mr-1" />
                                You Have Access
                              </>
                            ) : (
                              <>
                                <Lock className="size-3 mr-1" />
                                Request Needed
                              </>
                            )}
                          </Badge>
                        </div>
                      )}

                      {/* Intent Match Badge */}
                      {hasActiveIntents && (collection as unknown as (typeof COLLECTIONS_WITH_AOT)[0] & { intentMatch: ReturnType<typeof getIntentMatch> }).intentMatch && (
                        <div className="mb-3">
                          {(() => {
                            const intentMatch = (collection as unknown as (typeof COLLECTIONS_WITH_AOT)[0] & { intentMatch: ReturnType<typeof getIntentMatch> }).intentMatch
                            const badge = getIntentMatchBadge(intentMatch.match, intentMatch.score)
                            if (!badge) return null
                            const Icon = badge.icon
                            return (
                              <Badge className={cn("font-light text-xs border", badge.color)}>
                                <Icon className="size-3 mr-1" />
                                {badge.label}
                              </Badge>
                            )
                          })()}
                        </div>
                      )}

                      {/* AoT Quick Summary */}
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-light text-xs",
                            (collection as unknown as (typeof COLLECTIONS_WITH_AOT)[0]).agreementOfTerms?.aiResearch
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          )}
                        >
                          ML/AI {(collection as unknown as (typeof COLLECTIONS_WITH_AOT)[0]).agreementOfTerms?.aiResearch ? "✓" : "✗"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-light text-xs",
                            (collection as unknown as (typeof COLLECTIONS_WITH_AOT)[0]).agreementOfTerms?.externalPublication
                              ? "bg-green-50 text-green-700 border-green-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          )}
                        >
                          Publish {(collection as unknown as (typeof COLLECTIONS_WITH_AOT)[0]).agreementOfTerms?.externalPublication ? "✓" : "✗"}
                        </Badge>
                      </div>

                      {/* Status Badges */}
                      <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <Badge className={cn("font-light text-xs", statusBadge.color)}>
                          {statusBadge.label}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={cn("font-light text-xs border", accessBadge.color)}
                        >
                          {accessBadge.label}
                        </Badge>
                        {collection.commentCount > 0 && (
                          <Badge variant="outline" className="font-light text-xs">
                            <MessageSquare className="size-3 mr-1" />
                            {collection.commentCount}
                          </Badge>
                        )}
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-light text-neutral-600">Progress</span>
                          <span className="text-xs font-normal text-neutral-900">
                            {collection.progress}%
                          </span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2">
                          <div
                            className={cn(
                              "h-2 rounded-full bg-gradient-to-r transition-all",
                              scheme.from,
                              scheme.to
                            )}
                            style={{ width: `${collection.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Meta Info */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-xs font-light text-neutral-600">
                          <div className="flex items-center gap-1">
                            <Users className="size-3" />
                            <span>{collection.totalUsers} users</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Database className="size-3" />
                            <span>{collection.totalDatasets} datasets</span>
                          </div>
                        </div>
                        <p className="text-xs font-light text-neutral-500">
                          Created by {collection.createdBy} •{" "}
                          {collection.createdAt.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>

                      {/* Therapeutic Areas Tags */}
                      <div className="flex flex-wrap gap-1">
                        {collection.therapeuticAreas.slice(0, 2).map((area) => (
                          <Badge
                            key={area}
                            variant="outline"
                            className="font-light text-xs border-neutral-200"
                          >
                            {area}
                          </Badge>
                        ))}
                        {collection.therapeuticAreas.length > 2 && (
                          <Badge variant="outline" className="font-light text-xs border-neutral-200">
                            +{collection.therapeuticAreas.length - 2}
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {/* List View - Collections (when not in workspace mode) */}
          {!isWorkspaceMode && viewMode === "list" && filteredCollections.length > 0 && (
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-0">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-normal text-neutral-700">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-normal text-neutral-700">
                        Owner
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-normal text-neutral-700">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-normal text-neutral-700">
                        Progress
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-normal text-neutral-700">
                        Users
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-normal text-neutral-700">
                        Datasets
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCollections.map((collection) => {
                      const statusBadge = getStatusBadge(collection.status)
                      return (
                        <tr
                          key={collection.id}
                          onClick={() => handleViewCollection(collection.id)}
                          className="border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {collection.isFavorite && (
                                <Star className="size-4 fill-amber-400 text-amber-400" />
                              )}
                              <span className="text-sm font-normal text-neutral-900">
                                {collection.name}
                              </span>
                              {collection.status === "draft" && (
                                <Badge className="text-xs font-light py-0.5 px-1.5 bg-amber-50 text-amber-700 border border-amber-200">
                                  Draft
                                </Badge>
                              )}
                              {collection.status === "concept" && (
                                <Badge className="text-xs font-light py-0.5 px-1.5 bg-neutral-100 text-neutral-600 border border-neutral-200">
                                  Concept
                                </Badge>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-light text-neutral-600">
                              {collection.createdBy}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={cn("font-light text-xs", statusBadge.color)}>
                              {statusBadge.label}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-neutral-100 rounded-full h-2">
                                <div
                                  className={cn(
                                    "h-2 rounded-full bg-gradient-to-r",
                                    scheme.from,
                                    scheme.to
                                  )}
                                  style={{ width: `${collection.progress}%` }}
                                />
                              </div>
                              <span className="text-xs font-light text-neutral-600">
                                {collection.progress}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-light text-neutral-600">
                              {collection.totalUsers}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm font-light text-neutral-600">
                              {collection.totalDatasets}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

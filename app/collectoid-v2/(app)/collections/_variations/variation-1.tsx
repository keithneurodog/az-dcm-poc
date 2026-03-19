"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { cn } from "@/lib/utils"
import {
  Search,
  Grid3x3,
  List,
  Star,
  Users,
  Database,
  MessageSquare,
  ChevronDown,
  Filter,
  X,
  Sparkles,
  ArrowLeft,
  Lock,
  Unlock,
  Layers,
  Clock,
  Microscope,
  FlaskConical,
  UserCheck,
} from "lucide-react"
import {
  MOCK_COLLECTIONS,
  filterCollections,
  getAllTherapeuticAreas,
  Collection,
  CURRENT_USER_ID,
} from "@/lib/dcm-mock-data"

const STUDY_PHASES = ["I", "II", "III", "IV"]
const DATA_MODALITIES = ["Clinical", "Genomic", "Imaging", "Biomarkers", "Digital Devices", "Real-World Data"]
const STATUS_OPTIONS = [
  { value: "concept", label: "Concept" },
  { value: "draft", label: "Draft" },
  { value: "pending_approval", label: "Pending Approval" },
  { value: "provisioning", label: "Provisioning" },
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
  { value: "decommissioned", label: "Decommissioned" },
]

type Scope = "all" | "mine" | "recent"
type MyAccess = "all" | "have_access"
type SortOption = "recent" | "name" | "datasets" | "users" | "progress"

function CollapsiblePanel({
  title,
  icon: Icon,
  defaultOpen = false,
  children,
}: {
  title: string
  icon: React.ElementType
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <Icon className="size-4 text-neutral-500" />
          <span className="text-sm font-normal text-neutral-900">{title}</span>
        </div>
        <ChevronDown
          className={cn(
            "size-4 text-neutral-400 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  )
}

export default function CollectionsBrowserVariation1() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearch = searchParams.get("search") || ""

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(true)

  const [scope, setScope] = useState<Scope>("all")
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [selectedPhases, setSelectedPhases] = useState<string[]>([])
  const [selectedModalities, setSelectedModalities] = useState<string[]>([])
  const [myAccessFilter, setMyAccessFilter] = useState<MyAccess>("all")

  const allAreas = useMemo(() => getAllTherapeuticAreas(), [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".sort-dropdown")) {
        setSortDropdownOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

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

  const togglePhase = (phase: string) => {
    setSelectedPhases((prev) =>
      prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase]
    )
  }

  const toggleModality = (modality: string) => {
    setSelectedModalities((prev) =>
      prev.includes(modality) ? prev.filter((m) => m !== modality) : [...prev, modality]
    )
  }

  const clearAllFilters = () => {
    setSearchQuery("")
    setScope("all")
    setSelectedStatus([])
    setSelectedAreas([])
    setSelectedPhases([])
    setSelectedModalities([])
    setMyAccessFilter("all")
  }

  const activeFilterCount = [
    scope !== "all" ? 1 : 0,
    selectedStatus.length,
    selectedAreas.length,
    selectedPhases.length,
    selectedModalities.length,
    myAccessFilter !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  const hasActiveFilters =
    searchQuery !== "" || activeFilterCount > 0

  const filteredCollections = useMemo(() => {
    let base: Collection[]

    if (scope === "mine") {
      // Show all of the current user's collections, including concepts if "Concept" status is checked
      base = MOCK_COLLECTIONS.filter((c) => {
        if (c.creatorId !== CURRENT_USER_ID) return false
        if (c.status === "concept") return selectedStatus.includes("concept")
        return true
      })
    } else {
      // Never show concepts outside "My Collections"
      base = MOCK_COLLECTIONS.filter((c) => c.status !== "concept")
    }

    let filtered = filterCollections(base, {
      search: searchQuery,
      status: selectedStatus.length > 0 ? selectedStatus : undefined,
      therapeuticAreas: selectedAreas.length > 0 ? selectedAreas : undefined,
    })

    if (selectedPhases.length > 0) {
      filtered = filtered.filter((col) =>
        col.selectedDatasets.some((ds) => selectedPhases.includes(ds.phase))
      )
    }

    if (selectedModalities.length > 0) {
      filtered = filtered.filter((col) =>
        col.selectedDatasets.some(
          (ds) =>
            ds.modalities &&
            ds.modalities.some((m) => selectedModalities.includes(m))
        )
      )
    }

    if (myAccessFilter !== "all") {
      filtered = filtered.filter((_, i) => {
        const hasAccess = i % 3 !== 0
        return hasAccess
      })
    }

    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "datasets":
          return b.totalDatasets - a.totalDatasets
        case "users":
          return b.totalUsers - a.totalUsers
        case "progress":
          return b.progress - a.progress
        case "recent":
        default:
          return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

    return filtered.sort((a, b) => {
      if (a.isFavorite && !b.isFavorite) return -1
      if (!a.isFavorite && b.isFavorite) return 1
      return 0
    })
  }, [searchQuery, scope, selectedStatus, selectedAreas, selectedPhases, selectedModalities, myAccessFilter, sortBy])

  const handleViewCollection = (collectionId: string) => {
    router.push(`/collectoid-v2/collections/${collectionId}`)
  }

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

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: "recent", label: "Most Recent" },
    { value: "name", label: "Name (A-Z)" },
    { value: "datasets", label: "Most Datasets" },
    { value: "users", label: "Most Users" },
    { value: "progress", label: "Progress" },
  ]

  return (
    <div className="py-8">
      <div className="mb-8">
        <button
          onClick={() => router.push("/collectoid-v2/discover")}
          className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Discovery
        </button>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extralight text-neutral-900 tracking-tight mb-2">
              Browse Collections
            </h1>
            <p className="text-base font-light text-neutral-600">
              Browse and manage clinical data collections
            </p>
          </div>
        </div>

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
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="hidden xl:flex h-14 px-6 rounded-2xl font-light border-neutral-200 min-w-[140px]"
          >
            <Filter className="size-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge className={cn("ml-2 font-light", scheme.from.replace("from-", "bg-"), "text-white")}>
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-4 xl:gap-6">
        {showFilters && (
          <div className="hidden xl:block w-72 shrink-0 space-y-2">
            <div className={cn(
              "rounded-xl border p-4 transition-all",
              myAccessFilter !== "all"
                ? cn("border-2 bg-gradient-to-br", scheme.bg, scheme.from.replace("from-", "border-").replace("500", "300"))
                : "border-neutral-200 bg-white"
            )}>
              <div className="flex items-center gap-2 mb-4">
                <div className={cn(
                  "flex size-7 items-center justify-center rounded-lg transition-all",
                  myAccessFilter !== "all"
                    ? cn("bg-gradient-to-br shadow-sm", scheme.from, scheme.to)
                    : "bg-neutral-100"
                )}>
                  <UserCheck className={cn("size-3.5", myAccessFilter !== "all" ? "text-white" : "text-neutral-500")} />
                </div>
                <span className="text-sm font-normal text-neutral-900">My Access</span>
              </div>
              <label className="flex items-center justify-between cursor-pointer">
                <span className={cn("text-sm font-light", myAccessFilter === "have_access" ? "text-neutral-900" : "text-neutral-600")}>
                  Only show collections I have access to
                </span>
                <Switch
                  checked={myAccessFilter === "have_access"}
                  onCheckedChange={(checked) => setMyAccessFilter(checked ? "have_access" : "all")}
                  className={cn(
                    myAccessFilter === "have_access" && scheme.from.replace("from-", "!bg-")
                  )}
                />
              </label>
            </div>

<div className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-3">
                <Layers className="size-4 text-neutral-500" />
                <span className="text-sm font-normal text-neutral-900">Scope</span>
              </div>
              <div className="space-y-1">
                {([
                  { value: "all", label: "All Collections" },
                  { value: "mine", label: "My Collections" },
                  { value: "recent", label: "Recent" },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setScope(option.value)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg text-sm font-light transition-all",
                      scope === option.value
                        ? cn(scheme.bg, scheme.from.replace("from-", "text-").replace("500", "700"), "border", scheme.from.replace("from-", "border-").replace("500", "200"))
                        : "hover:bg-neutral-50 text-neutral-700"
                    )}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-neutral-500" />
                <span className="text-sm font-normal text-neutral-900">Status</span>
              </div>
              <div className="space-y-0.5">
                {STATUS_OPTIONS.map((status) => (
                  <label
                    key={status.value}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 transition-all cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedStatus.includes(status.value)}
                      onCheckedChange={() => toggleStatus(status.value)}
                      className="size-3.5"
                    />
                    <span className="text-xs font-light text-neutral-700">{status.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="size-4 text-neutral-500" />
                <span className="text-sm font-normal text-neutral-900">Study Phase</span>
              </div>
              <div className="space-y-0.5">
                {STUDY_PHASES.map((phase) => (
                  <label
                    key={phase}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 transition-all cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedPhases.includes(phase)}
                      onCheckedChange={() => togglePhase(phase)}
                      className="size-3.5"
                    />
                    <span className="text-xs font-light text-neutral-700">Phase {phase}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <Microscope className="size-4 text-neutral-500" />
                <span className="text-sm font-normal text-neutral-900">Data Modality</span>
              </div>
              <div className="space-y-0.5">
                {DATA_MODALITIES.map((modality) => (
                  <label
                    key={modality}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 transition-all cursor-pointer"
                  >
                    <Checkbox
                      checked={selectedModalities.includes(modality)}
                      onCheckedChange={() => toggleModality(modality)}
                      className="size-3.5"
                    />
                    <span className="text-xs font-light text-neutral-700">{modality}</span>
                  </label>
                ))}
              </div>
            </div>

            <CollapsiblePanel title="Therapeutic Area" icon={FlaskConical}>
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
            </CollapsiblePanel>

            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="w-full rounded-xl font-light border-neutral-200 mt-2"
              >
                <X className="size-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        )}

        <div className="flex-1">
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
                    {sortOptions.find((o) => o.value === sortBy)?.label}
                  </button>
                  <ChevronDown
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none transition-transform",
                      sortDropdownOpen && "rotate-180"
                    )}
                  />
                  {sortDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl border-2 border-neutral-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {sortOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value)
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

            <div className="flex items-center gap-3">
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

          {filteredCollections.length === 0 && (
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-12 text-center">
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
              </CardContent>
            </Card>
          )}

          {viewMode === "grid" && filteredCollections.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCollections.map((collection, i) => {
                const statusBadge = getStatusBadge(collection.status)
                const accessBadge = getAccessBadge(collection.accessLevel)
                const currentUserHasAccess = i % 3 !== 0

                return (
                  <Card
                    key={collection.id}
                    className="border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => handleViewCollection(collection.id)}
                  >
                    <CardContent className="p-6">
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

                      <div className="mb-3">
                        <Badge
                          className={cn(
                            "font-light text-xs border",
                            currentUserHasAccess
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          )}
                        >
                          {currentUserHasAccess ? (
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

                      {collection.agreementOfTerms && (
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-light text-xs",
                              collection.agreementOfTerms.beyondPrimaryUse.aiResearch
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            )}
                          >
                            ML/AI {collection.agreementOfTerms.beyondPrimaryUse.aiResearch ? "\u2713" : "\u2717"}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-light text-xs",
                              collection.agreementOfTerms.publication.externalPublication
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            )}
                          >
                            Publish {collection.agreementOfTerms.publication.externalPublication ? "\u2713" : "\u2717"}
                          </Badge>
                        </div>
                      )}

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

          {viewMode === "list" && filteredCollections.length > 0 && (
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

"use client"

import { useState, useMemo, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { cn } from "@/lib/utils"
import {
  Search,
  Star,
  Users,
  Database,
  X,
  Lock,
  Unlock,
  ChevronDown,
  LayoutGrid,
  Table2,
  Kanban,
  Check,
  FileEdit,
  SlidersHorizontal,
} from "lucide-react"
import {
  getAllTherapeuticAreas,
  getAllOwners,
  CURRENT_USER_ID,
} from "@/lib/dcm-mock-data"
import { useCollectionsStore } from "@/lib/collections-store"

// Constants
const USER_GROUPS = ["Oncology Data Science", "Oncology Biometrics", "Cardiovascular Research", "Neuroscience Analytics", "Translational Medicine", "Biostatistics", "Data Science Platform", "Clinical Operations"]
const STUDY_PHASES = ["Phase I", "Phase II", "Phase III", "Phase IV", "Pre-clinical", "Post-market"]
const DATA_TYPES = ["Clinical", "Genomics", "Imaging", "Real World", "Biomarker", "Patient Reported"]
const REGIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "Global", "Multi-regional"]
const TIME_PERIODS = ["Last 7 days", "Last 30 days", "Last 90 days", "Last year"]

// --- Extracted filter components (must be outside parent to preserve state across re-renders) ---

function MultiSelectFilter({ label, options, selected, onToggle, onClear, searchable = false, scheme }: {
  label: string
  options: string[]
  selected: string[]
  onToggle: (value: string) => void
  onClear: () => void
  searchable?: boolean
  scheme: { from: string; to: string }
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const containerRef = useRef<HTMLDivElement>(null)
  const isActive = selected.length > 0

  const filtered = searchable && search
    ? options.filter(o => o.toLowerCase().includes(search.toLowerCase()))
    : options

  useEffect(() => {
    if (!open) return
    const onClickOutside = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setSearch("")
      }
    }
    document.addEventListener("pointerdown", onClickOutside)
    return () => document.removeEventListener("pointerdown", onClickOutside)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); setSearch("") } }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onPointerDown={(e) => { e.stopPropagation(); setOpen(prev => !prev); if (open) setSearch("") }}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-normal transition-all",
          isActive
            ? `bg-gradient-to-r ${scheme.from} ${scheme.to} text-white shadow-sm`
            : "bg-neutral-100/80 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/60"
        )}
      >
        {label}
        {isActive && (
          <span className="bg-white/25 text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
            {selected.length}
          </span>
        )}
        <ChevronDown className={cn("size-3 transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-56 bg-white rounded-lg border border-neutral-200 shadow-lg z-50">
          {searchable && (
            <div className="p-2 border-b border-neutral-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-neutral-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="w-full pl-7 pr-3 py-1.5 text-xs bg-neutral-50 rounded-md border-0 outline-none focus:ring-1 focus:ring-neutral-300 placeholder:text-neutral-400"
                  autoFocus
                />
              </div>
            </div>
          )}
          <div className="max-h-60 overflow-y-auto p-1.5">
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-xs text-neutral-400 text-center">No matches</div>
            ) : filtered.map(opt => {
              const isSelected = selected.includes(opt)
              return (
                <div
                  key={opt}
                  role="option"
                  aria-selected={isSelected}
                  onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onToggle(opt) }}
                  className={cn(
                    "flex items-center gap-2.5 px-2.5 py-2 text-sm rounded-md cursor-pointer select-none transition-colors",
                    isSelected ? "bg-neutral-50 text-neutral-900" : "hover:bg-neutral-50 text-neutral-600"
                  )}
                >
                  <div className={cn(
                    "size-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                    isSelected
                      ? `bg-gradient-to-r ${scheme.from} ${scheme.to} border-transparent`
                      : "border-neutral-300"
                  )}>
                    {isSelected && <Check className="size-2.5 text-white" />}
                  </div>
                  <span className="truncate">{opt}</span>
                </div>
              )
            })}
          </div>
          {isActive && (
            <div className="p-1.5 border-t border-neutral-100">
              <div
                role="button"
                onPointerDown={(e) => { e.preventDefault(); e.stopPropagation(); onClear() }}
                className="w-full px-3 py-1.5 text-xs text-neutral-500 hover:text-neutral-700 rounded-md hover:bg-neutral-50 text-center cursor-pointer select-none"
              >
                Clear {selected.length} selected
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// --- Main component ---

export default function CollectionsBrowserV2() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { collections: storeCollections } = useCollectionsStore()

  // Enrich collections with mock AoT/access data for display
  const COLLECTIONS_WITH_AOT = useMemo(() => storeCollections.map((col, i) => ({
    ...col,
    agreementOfTerms: col.agreementOfTerms
      ? { aiResearch: !!col.agreementOfTerms.beyondPrimaryUse?.aiResearch, softwareDevelopment: !!col.agreementOfTerms.beyondPrimaryUse?.softwareDevelopment, externalPublication: !!col.agreementOfTerms.publication?.externalPublication, internalPublication: true }
      : { aiResearch: i % 3 !== 2, softwareDevelopment: i % 4 === 0, externalPublication: i % 2 === 0, internalPublication: true },
    userAccess: { currentUserHasAccess: i % 3 !== 0, accessGroups: USER_GROUPS.filter((_, idx) => (i + idx) % 3 === 0).slice(0, 3) },
    studyPhase: STUDY_PHASES[i % STUDY_PHASES.length],
    dataTypes: DATA_TYPES.filter((_, idx) => (i + idx) % 2 === 0),
    region: REGIONS[i % REGIONS.length],
    patientCount: Math.floor(Math.random() * 50000) + 100,
    lastUpdated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    quality: ["High", "Medium", "Standard"][i % 3],
    compliance: ["HIPAA", "GDPR", "Both", "None"][i % 4],
  })), [storeCollections])

  // View & UI state
  const [viewMode, setViewMode] = useState<"cards" | "table" | "kanban">("cards")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)

  // Combined scope/status filter
  const [scope, setScope] = useState<"all" | "concepts" | "draft" | "active">("all")

  // My concepts count
  const myConceptsCount = storeCollections.filter(c => c.creatorId === CURRENT_USER_ID && c.status === "concept").length

  // Single-value filter state
  const [filters, setFilters] = useState({
    myAccess: "all",
    intent: "all",
    accessLevel: "all",
    userGroup: "all",
    compliance: "all",
    quality: "all",
    owner: "all",
    datasets: "all",
    patients: "all",
    users: "all",
    created: "all",
    updated: "all",
    favorites: "all",
    progress: "all",
  })

  // Multi-select filter state for high-cardinality dropdowns
  const [multiFilters, setMultiFilters] = useState<{
    area: string[]
    studyPhase: string[]
    dataType: string[]
    region: string[]
  }>({
    area: [],
    studyPhase: [],
    dataType: [],
    region: [],
  })

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleMultiFilter = (key: keyof typeof multiFilters, value: string) => {
    setMultiFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(v => v !== value)
        : [...prev[key], value],
    }))
  }

  const clearMultiFilter = (key: keyof typeof multiFilters) => {
    setMultiFilters(prev => ({ ...prev, [key]: [] }))
  }

  const clearAllFilters = () => {
    setFilters({
      myAccess: "all", intent: "all", accessLevel: "all",
      userGroup: "all", compliance: "all",
      quality: "all", owner: "all", datasets: "all", patients: "all", users: "all",
      created: "all", updated: "all", favorites: "all", progress: "all",
    })
    setMultiFilters({ area: [], studyPhase: [], dataType: [], region: [] })
    setSearchQuery("")
  }

  const allAreas = useMemo(() => getAllTherapeuticAreas(), [])
  const allOwners = useMemo(() => getAllOwners(), [])

  const activeFilterCount =
    Object.values(filters).filter(v => v !== "all").length +
    Object.values(multiFilters).filter(v => v.length > 0).length

  // Apply filters
  const filteredCollections = useMemo(() => {
    let filtered = COLLECTIONS_WITH_AOT
    // Kanban shows all columns, so skip scope filtering
    if (viewMode !== "kanban") {
      switch (scope) {
        case "concepts":
          filtered = filtered.filter(c => c.status === "concept" && c.creatorId === CURRENT_USER_ID)
          break
        case "draft":
          filtered = filtered.filter(c => c.status === "draft")
          break
        case "active":
          filtered = filtered.filter(c => c.status === "active" || c.status === "pending_approval" || c.status === "provisioning")
          break
        default: // "all" shows everything except private concepts
          filtered = filtered.filter(c => c.status !== "concept")
      }
    } else {
      // In kanban, only show concepts owned by current user (not others' private concepts)
      filtered = filtered.filter(c => c.status !== "concept" || c.creatorId === CURRENT_USER_ID)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    }
    if (multiFilters.area.length > 0) filtered = filtered.filter(c => c.therapeuticAreas.some(ta => multiFilters.area.includes(ta)))
    if (filters.myAccess !== "all") {
      filtered = filtered.filter(c => filters.myAccess === "have_access" ? c.userAccess?.currentUserHasAccess : !c.userAccess?.currentUserHasAccess)
    }
    if (filters.intent !== "all") filtered = filtered.filter(c => c.agreementOfTerms[filters.intent as keyof typeof c.agreementOfTerms])
    if (filters.accessLevel !== "all") filtered = filtered.filter(c => c.accessLevel === filters.accessLevel)
    if (filters.userGroup !== "all") filtered = filtered.filter(c => c.userAccess?.accessGroups?.includes(filters.userGroup))
    if (filters.compliance !== "all") filtered = filtered.filter(c => c.compliance === filters.compliance)
    if (multiFilters.studyPhase.length > 0) filtered = filtered.filter(c => multiFilters.studyPhase.includes(c.studyPhase))
    if (multiFilters.dataType.length > 0) filtered = filtered.filter(c => c.dataTypes.some(dt => multiFilters.dataType.includes(dt)))
    if (multiFilters.region.length > 0) filtered = filtered.filter(c => multiFilters.region.includes(c.region))
    if (filters.quality !== "all") filtered = filtered.filter(c => c.quality === filters.quality)
    if (filters.owner !== "all") filtered = filtered.filter(c => c.createdBy === filters.owner)
    if (filters.datasets !== "all") {
      filtered = filtered.filter(c => {
        const n = c.totalDatasets
        return filters.datasets === "1-10" ? n <= 10 : filters.datasets === "11-50" ? n <= 50 : filters.datasets === "51-100" ? n <= 100 : n > 100
      })
    }
    if (filters.patients !== "all") {
      filtered = filtered.filter(c => {
        const n = c.patientCount
        return filters.patients === "<1000" ? n < 1000 : filters.patients === "1000-10000" ? n <= 10000 : filters.patients === "10000-50000" ? n <= 50000 : n > 50000
      })
    }
    if (filters.users !== "all") {
      filtered = filtered.filter(c => {
        const n = c.totalUsers
        return filters.users === "<10" ? n < 10 : filters.users === "10-50" ? n <= 50 : filters.users === "50-100" ? n <= 100 : n > 100
      })
    }
    if (filters.created !== "all") {
      const days = filters.created === "Last 7 days" ? 7 : filters.created === "Last 30 days" ? 30 : filters.created === "Last 90 days" ? 90 : 365
      filtered = filtered.filter(c => (Date.now() - c.createdAt.getTime()) < days * 86400000)
    }
    if (filters.updated !== "all") {
      const days = filters.updated === "Last 7 days" ? 7 : filters.updated === "Last 30 days" ? 30 : filters.updated === "Last 90 days" ? 90 : 365
      filtered = filtered.filter(c => (Date.now() - c.lastUpdated.getTime()) < days * 86400000)
    }
    if (filters.favorites === "favorites") filtered = filtered.filter(c => c.isFavorite)
    if (filters.progress !== "all") {
      filtered = filtered.filter(c => {
        return filters.progress === "<25" ? c.progress < 25 : filters.progress === "25-50" ? c.progress < 50 : filters.progress === "50-75" ? c.progress < 75 : c.progress >= 75
      })
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name": return a.name.localeCompare(b.name)
        case "users": return b.totalUsers - a.totalUsers
        case "progress": return b.progress - a.progress
        case "patients": return b.patientCount - a.patientCount
        default: return b.createdAt.getTime() - a.createdAt.getTime()
      }
    })

    return filtered.sort((a, b) => (a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1))
  }, [searchQuery, filters, multiFilters, sortBy, scope, viewMode])

  const handleViewCollection = (id: string) => {
    router.push(`/collectoid-v2/collections/${id}`)
  }

  // Segmented control for low-cardinality filters (single-click toggle)
  const SegmentedFilter = ({ filterKey, options }: { filterKey: string; options: { value: string; label: string }[] }) => {
    const value = filters[filterKey as keyof typeof filters]
    return (
      <div className="flex bg-neutral-100/80 rounded-lg p-0.5">
        {options.map(opt => (
          <button
            key={opt.value}
            onClick={() => updateFilter(filterKey, opt.value)}
            className={cn(
              "px-3 py-1.5 text-xs font-normal rounded-md transition-all whitespace-nowrap",
              value === opt.value
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    )
  }

  // Status indicator
  const StatusDot = ({ status }: { status: string }) => {
    const color = status === "active" ? "bg-green-500" : status === "provisioning" ? "bg-blue-500" : status === "draft" ? "bg-amber-400" : "bg-amber-500"
    return <div className={cn("size-2.5 rounded-full", color)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="px-8 pt-5 pb-4">
          {/* Row 1: Title + Search + Sort + View */}
          <div className="flex items-center gap-6 mb-4">
            <h1 className="text-2xl font-light text-neutral-900 shrink-0">Collections</h1>

            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-9 h-9 rounded-lg border-neutral-200 font-normal text-sm bg-white/50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="size-3.5 text-neutral-400 hover:text-neutral-600" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 h-9 rounded-lg border-neutral-200 font-normal text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="name">Name (A-Z)</SelectItem>
                  <SelectItem value="users">Most Users</SelectItem>
                  <SelectItem value="patients">Most Patients</SelectItem>
                  <SelectItem value="progress">Progress</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex bg-neutral-100 rounded-lg p-0.5">
                {[
                  { id: "cards", icon: LayoutGrid },
                  { id: "table", icon: Table2 },
                  { id: "kanban", icon: Kanban },
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id as "cards" | "table" | "kanban")}
                    className={cn(
                      "p-2 rounded-md transition-all",
                      viewMode === id ? "bg-white shadow-sm" : "hover:bg-neutral-50"
                    )}
                  >
                    <Icon className="size-4 text-neutral-600" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 2: Scope tabs + Filters */}
          <div className="flex items-center gap-4">
            {/* Scope / Status filter */}
            <div className="relative group/scope shrink-0">
              <div className={cn(
                "flex bg-neutral-100/80 rounded-lg p-0.5",
                viewMode === "kanban" && "opacity-40 pointer-events-none"
              )}>
                {([
                  { value: "all", label: "All" },
                  { value: "active", label: "Active" },
                  { value: "draft", label: "Draft" },
                  { value: "concepts", label: "My Concepts", icon: true },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setScope(opt.value)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-normal rounded-md transition-all whitespace-nowrap flex items-center gap-1.5",
                      scope === opt.value
                        ? "bg-white text-neutral-900 shadow-sm"
                        : "text-neutral-500 hover:text-neutral-700"
                    )}
                  >
                    {"icon" in opt && opt.icon && <FileEdit className="size-3" />}
                    {opt.label}
                    {opt.value === "concepts" && myConceptsCount > 0 && (
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded-full",
                        scope === "concepts" ? "bg-neutral-200 text-neutral-700" : "bg-neutral-200/60 text-neutral-500"
                      )}>
                        {myConceptsCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              {viewMode === "kanban" && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-neutral-900 text-white text-[11px] rounded-md whitespace-nowrap opacity-0 group-hover/scope:opacity-100 transition-opacity pointer-events-none z-50">
                  Board columns show all stages
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1 size-2 bg-neutral-900 rotate-45" />
                </div>
              )}
            </div>

            {/* Favourites toggle */}
            <button
              onClick={() => updateFilter("favorites", filters.favorites === "favorites" ? "all" : "favorites")}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-normal transition-all",
                filters.favorites === "favorites"
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-neutral-100/80 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/60"
              )}
            >
              <Star className={cn("size-3", filters.favorites === "favorites" && "fill-amber-400 text-amber-400")} />
              Favourites
            </button>

            <SegmentedFilter
              filterKey="myAccess"
              options={[
                { value: "all", label: "All" },
                { value: "have_access", label: "My Access" },
                { value: "need_request", label: "Request" },
              ]}
            />

            {/* Secondary filters: multi-select dropdowns for high-cardinality */}
            <MultiSelectFilter label="Therapeutic Area" options={allAreas} selected={multiFilters.area} onToggle={(v) => toggleMultiFilter("area", v)} onClear={() => clearMultiFilter("area")} scheme={scheme} searchable />
            <MultiSelectFilter label="Phase" options={STUDY_PHASES} selected={multiFilters.studyPhase} onToggle={(v) => toggleMultiFilter("studyPhase", v)} onClear={() => clearMultiFilter("studyPhase")} scheme={scheme} />
            <MultiSelectFilter label="Data Type" options={DATA_TYPES} selected={multiFilters.dataType} onToggle={(v) => toggleMultiFilter("dataType", v)} onClear={() => clearMultiFilter("dataType")} scheme={scheme} />
            <MultiSelectFilter label="Region" options={REGIONS} selected={multiFilters.region} onToggle={(v) => toggleMultiFilter("region", v)} onClear={() => clearMultiFilter("region")} scheme={scheme} />

            {/* More filters */}
            <Popover open={moreFiltersOpen} onOpenChange={setMoreFiltersOpen}>
              <PopoverTrigger asChild>
                <button className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-normal transition-all",
                  activeFilterCount > Object.values(filters).filter((_, i) => ["status", "myAccess", "area", "studyPhase", "dataType", "region"].includes(Object.keys(filters)[i])).length
                    ? `bg-gradient-to-r ${scheme.from} ${scheme.to} text-white`
                    : "bg-neutral-100/80 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-200/60"
                )}>
                  <SlidersHorizontal className="size-3" />
                  More
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-neutral-900">Additional Filters</span>
                    {activeFilterCount > 0 && (
                      <button onClick={clearAllFilters} className="text-xs text-neutral-500 hover:text-neutral-700">
                        Clear all
                      </button>
                    )}
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <label className="text-xs text-neutral-500">Intent / Use</label>
                      <SegmentedFilter filterKey="intent" options={[{ value: "all", label: "All" }, { value: "aiResearch", label: "AI/ML" }, { value: "softwareDevelopment", label: "Software" }, { value: "externalPublication", label: "Ext Pub" }]} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-500">Access Level</label>
                        <Select value={filters.accessLevel} onValueChange={v => updateFilter("accessLevel", v)}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="public">Public</SelectItem>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="restricted">Restricted</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-500">User Group</label>
                        <Select value={filters.userGroup} onValueChange={v => updateFilter("userGroup", v)}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Groups</SelectItem>
                            {USER_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-500">Compliance</label>
                        <Select value={filters.compliance} onValueChange={v => updateFilter("compliance", v)}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="HIPAA">HIPAA</SelectItem>
                            <SelectItem value="GDPR">GDPR</SelectItem>
                            <SelectItem value="Both">Both</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-500">Owner</label>
                        <Select value={filters.owner} onValueChange={v => updateFilter("owner", v)}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Owners</SelectItem>
                            {allOwners.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-500">Quality</label>
                        <Select value={filters.quality} onValueChange={v => updateFilter("quality", v)}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="High">High</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Standard">Standard</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-500">Progress</label>
                        <Select value={filters.progress} onValueChange={v => updateFilter("progress", v)}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="<25">&lt;25%</SelectItem>
                            <SelectItem value="25-50">25-50%</SelectItem>
                            <SelectItem value="50-75">50-75%</SelectItem>
                            <SelectItem value="75-100">75%+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-500">Created</label>
                        <Select value={filters.created} onValueChange={v => updateFilter("created", v)}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            {TIME_PERIODS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-neutral-500">Datasets</label>
                        <Select value={filters.datasets} onValueChange={v => updateFilter("datasets", v)}>
                          <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Any</SelectItem>
                            <SelectItem value="1-10">1-10</SelectItem>
                            <SelectItem value="11-50">11-50</SelectItem>
                            <SelectItem value="51-100">51-100</SelectItem>
                            <SelectItem value="100+">100+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Active filter count + clear */}
            {activeFilterCount > 0 && (
              <button onClick={clearAllFilters} className="text-xs text-neutral-500 hover:text-neutral-900 flex items-center gap-1 shrink-0">
                <X className="size-3" />
                Clear {activeFilterCount}
              </button>
            )}

            {/* Result count pushed right */}
            <span className="text-xs text-neutral-400 ml-auto shrink-0">
              {filteredCollections.length} result{filteredCollections.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {filteredCollections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            {scope === "concepts" ? (
              <>
                <FileEdit className="size-20 text-neutral-300 mb-6" />
                <h3 className="text-xl font-light text-neutral-900 mb-3">No concept collections</h3>
                <p className="text-base font-light text-neutral-500 mb-6">
                  Start creating a collection to see your concepts here
                </p>
                <Button
                  onClick={() => router.push("/collectoid-v2/dcm/create")}
                  size="lg"
                  className={cn("rounded-full text-base bg-gradient-to-r text-white", scheme.from, scheme.to)}
                >
                  Create Collection
                </Button>
              </>
            ) : (
              <>
                <Database className="size-20 text-neutral-300 mb-6" />
                <h3 className="text-xl font-light text-neutral-900 mb-3">No collections found</h3>
                <p className="text-base font-light text-neutral-500 mb-6">Try adjusting your filters</p>
                <Button variant="outline" size="lg" onClick={clearAllFilters} className="rounded-full text-base">Clear Filters</Button>
              </>
            )}
          </div>
        ) : viewMode === "cards" ? (
          /* Card Grid View */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCollections.map((col) => (
              <Card
                key={col.id}
                onClick={() => handleViewCollection(col.id)}
                className="group cursor-pointer border-0 bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden"
              >
                <CardContent className="px-5 pt-4 pb-3.5 flex flex-col h-full">
                  {/* Title & Favourite */}
                  <div className="flex items-start justify-between mb-1.5">
                    <h3 className="text-base font-medium text-neutral-900 line-clamp-1 group-hover:text-neutral-700">
                      {col.name}
                    </h3>
                    {col.isFavorite && <Star className="size-4 fill-amber-400 text-amber-400 shrink-0 ml-2" />}
                  </div>

                  {/* Description */}
                  <p className="text-sm font-light text-neutral-500 line-clamp-2 mb-3">
                    {col.description}
                  </p>

                  {/* Progress */}
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
                      <span>Progress</span>
                      <span className="font-medium text-neutral-700">{col.progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full bg-gradient-to-r", scheme.from, scheme.to)} style={{ width: `${col.progress}%` }} />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-neutral-400 mb-3">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><Users className="size-4" />{col.totalUsers}</span>
                      <span className="flex items-center gap-1.5"><Database className="size-4" />{col.totalDatasets}</span>
                    </div>
                    <span>{col.region}</span>
                  </div>

                  {/* Tags - pushed to bottom */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-auto">
                    {col.status === "concept" ? (
                      <Badge className="text-[11px] font-normal py-0.5 px-2 bg-neutral-100 text-neutral-600 border border-neutral-200">
                        Concept
                      </Badge>
                    ) : col.status === "draft" ? (
                      <Badge className="text-[11px] font-normal py-0.5 px-2 bg-amber-50 text-amber-700 border border-amber-200">
                        Draft
                      </Badge>
                    ) : (
                      <>
                        <StatusDot status={col.status} />
                        <Badge variant="outline" className="text-[11px] font-normal py-0.5 px-2">{col.studyPhase}</Badge>
                      </>
                    )}
                    <Badge className={cn(
                      "text-[11px] font-normal border py-0.5 px-2",
                      col.userAccess?.currentUserHasAccess
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      {col.userAccess?.currentUserHasAccess ? "Access" : "Request"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          <Card className="border-0 bg-white/70 backdrop-blur-sm rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50/50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Collection</th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Access</th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Phase</th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Region</th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Progress</th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Users</th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Patients</th>
                    <th className="px-5 py-4 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">ML/Pub</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredCollections.map((col) => (
                    <tr key={col.id} onClick={() => handleViewCollection(col.id)} className="hover:bg-neutral-50/50 cursor-pointer transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          {col.isFavorite && <Star className="size-4 fill-amber-400 text-amber-400" />}
                          <span className="text-sm font-medium text-neutral-900">{col.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4"><StatusDot status={col.status} /></td>
                      <td className="px-5 py-4">
                        <Badge className={cn("text-xs py-1 px-2", col.userAccess?.currentUserHasAccess ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                          {col.userAccess?.currentUserHasAccess ? "\u2713" : "Request"}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-sm text-neutral-600">{col.studyPhase}</td>
                      <td className="px-5 py-4 text-sm text-neutral-600">{col.region}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className={cn("h-full bg-gradient-to-r", scheme.from, scheme.to)} style={{ width: `${col.progress}%` }} />
                          </div>
                          <span className="text-sm text-neutral-600">{col.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-neutral-600">{col.totalUsers}</td>
                      <td className="px-5 py-4 text-sm text-neutral-600">{col.patientCount.toLocaleString()}</td>
                      <td className="px-5 py-4">
                        <span className={cn("text-sm", col.agreementOfTerms.aiResearch ? "text-green-600" : "text-red-400")}>{col.agreementOfTerms.aiResearch ? "\u2713" : "\u2717"}</span>
                        <span className="text-neutral-300 mx-1.5">/</span>
                        <span className={cn("text-sm", col.agreementOfTerms.externalPublication ? "text-green-600" : "text-red-400")}>{col.agreementOfTerms.externalPublication ? "\u2713" : "\u2717"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* Kanban View - Grouped by Status */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { id: "concept", label: "Concepts", color: "bg-neutral-400", match: (s: string) => s === "concept" },
              { id: "draft", label: "Draft", color: "bg-amber-400", match: (s: string) => s === "draft" },
              { id: "active", label: "Active", color: "bg-green-500", match: (s: string) => s === "active" || s === "pending_approval" || s === "provisioning" },
            ].map(({ id, label: statusLabel, color: statusColor, match }) => {
              const statusCollections = filteredCollections.filter(c => match(c.status))

              return (
                <div key={id} className="space-y-4">
                  <div className="flex items-center gap-3 px-3">
                    <div className={cn("size-3 rounded-full", statusColor)} />
                    <span className="text-base font-medium text-neutral-700">{statusLabel}</span>
                    <Badge variant="outline" className="text-xs py-0.5 px-2 ml-auto">{statusCollections.length}</Badge>
                  </div>
                  <div className="space-y-3 min-h-[250px] bg-neutral-100/50 rounded-xl p-3">
                    {statusCollections.map((col) => (
                      <Card
                        key={col.id}
                        onClick={() => handleViewCollection(col.id)}
                        className="cursor-pointer border-0 bg-white hover:shadow-md transition-all rounded-xl"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="text-sm font-medium text-neutral-900 line-clamp-1">{col.name}</h4>
                            {col.isFavorite && <Star className="size-4 fill-amber-400 text-amber-400 shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge className={cn("text-xs py-0.5 px-2", col.userAccess?.currentUserHasAccess ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                              {col.userAccess?.currentUserHasAccess ? "Access" : "Request"}
                            </Badge>
                            <Badge variant="outline" className="text-xs py-0.5 px-2">{col.studyPhase}</Badge>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className={cn("h-full bg-gradient-to-r", scheme.from, scheme.to)} style={{ width: `${col.progress}%` }} />
                          </div>
                          <div className="flex items-center justify-between mt-3 text-xs text-neutral-400">
                            <span><Users className="size-3.5 inline mr-1.5" />{col.totalUsers}</span>
                            <span>{col.progress}%</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

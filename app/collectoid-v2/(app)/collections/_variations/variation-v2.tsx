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
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LayoutGrid,
  Table2,
  Kanban,
  Check,
  FileEdit,
  SlidersHorizontal,
  MessageSquare,
  Microscope,
  Dna,
  ScanEye,
  Globe,
  FlaskConical,
  HeartPulse,
} from "lucide-react"
import {
  getAllTherapeuticAreas,
  getAllOwners,
  getAllCollectionMembers,
  CURRENT_USER_ID,
} from "@/lib/dcm-mock-data"
import { useCollectionsStore } from "@/lib/collections-store"
import { computeCollectionHealth } from "@/lib/collection-health"

// Constants
const USER_GROUPS = ["Oncology Data Science", "Oncology Biometrics", "Cardiovascular Research", "Neuroscience Analytics", "Translational Medicine", "Biostatistics", "Data Science Platform", "Clinical Operations"]
const STUDY_PHASES = ["Phase I", "Phase II", "Phase III", "Phase IV", "Pre-clinical", "Post-market"]
const DATA_TYPES = ["Clinical", "Genomics", "Imaging", "Real World", "Biomarker", "Patient Reported"]
const REGIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "Global", "Multi-regional"]
const TIME_PERIODS = ["Last 7 days", "Last 30 days", "Last 90 days", "Last year"]

// --- Search match types and components ---

type MatchItem = { category: "Collection" | "Dataset" | "User"; label: string; detail: string; refineTo: string }

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span className="text-sm text-neutral-700 font-light truncate">{text}</span>
  return (
    <span className="text-sm text-neutral-700 font-light truncate">
      {text.slice(0, idx)}
      <mark className="bg-amber-100 text-amber-900 rounded-sm px-0.5 font-normal">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  )
}

function SearchMatchPanel({
  matches,
  query,
  onSelect,
}: {
  matches: { Collection: MatchItem[]; Dataset: MatchItem[]; User: MatchItem[] }
  query: string
  onSelect: (refineTo: string) => void
}) {
  const hasAny = matches.Collection.length > 0 || matches.Dataset.length > 0 || matches.User.length > 0
  const MAX_PER_CATEGORY = 3

  if (!hasAny) {
    return (
      <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-xl border border-neutral-200 shadow-lg z-50 px-4 py-3">
        <p className="text-xs text-neutral-400">No matches for &ldquo;{query}&rdquo;</p>
      </div>
    )
  }

  const CATEGORY_CONFIG = {
    Collection: { label: "Collections", icon: Database },
    Dataset: { label: "Datasets", icon: FlaskConical },
    User: { label: "Users", icon: Users },
  } as const

  return (
    <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-xl border border-neutral-200 shadow-lg z-50 overflow-hidden max-h-80 overflow-y-auto">
      {(["Collection", "Dataset", "User"] as const).map(cat => {
        const items = matches[cat]
        if (items.length === 0) return null
        const visible = items.slice(0, MAX_PER_CATEGORY)
        const overflow = items.length - MAX_PER_CATEGORY
        const Icon = CATEGORY_CONFIG[cat].icon

        return (
          <div key={cat}>
            <div className="px-3 pt-2.5 pb-1 flex items-center gap-1.5">
              <Icon className="size-3 text-neutral-400" />
              <span className="text-[10px] font-medium uppercase tracking-wider text-neutral-400">{CATEGORY_CONFIG[cat].label}</span>
            </div>
            {visible.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onSelect(item.refineTo) }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-left hover:bg-neutral-50 transition-colors"
              >
                <HighlightMatch text={item.label} query={query} />
                <span className="text-[11px] text-neutral-400 ml-auto shrink-0">{item.detail}</span>
              </button>
            ))}
            {overflow > 0 && (
              <div className="px-3 pb-1.5 text-[11px] text-neutral-400">+{overflow} more</div>
            )}
          </div>
        )
      })}
      <div className="border-t border-neutral-100 px-3 py-1.5">
        <span className="text-[10px] text-neutral-400">Click a result to refine search</span>
      </div>
    </div>
  )
}

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
    studyPhases: STUDY_PHASES.filter((_, idx) => (i + idx) % 3 === 0).slice(0, 1 + (i % 3)),
    dataTypes: DATA_TYPES.filter((_, idx) => (i + idx) % 2 === 0),
    excludedCountries: i % 3 === 0 ? [] : i % 3 === 1 ? ["China", "Russia"] : ["Brazil", "India", "South Africa"],
    region: REGIONS[i % REGIONS.length],
    patientCount: Math.floor(Math.random() * 50000) + 100,
    lastUpdated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    quality: ["High", "Medium", "Standard"][i % 3],
    compliance: ["HIPAA", "GDPR", "Both", "None"][i % 4],
  })), [storeCollections])

  // View & UI state
  const [viewMode, setViewMode] = useState<"cards" | "table" | "kanban">("cards")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [searchFocused, setSearchFocused] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const [sortBy, setSortBy] = useState<string>("status")
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false)

  // Table sorting & pagination
  const [tableSort, setTableSort] = useState<{ column: string; direction: "asc" | "desc" } | null>(null)
  const [tablePage, setTablePage] = useState(0)
  const [tablePageSize, setTablePageSize] = useState(20)

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
        default: // "all" shows everything, including current user's own concepts
          filtered = filtered.filter(c => c.status !== "concept" || c.creatorId === CURRENT_USER_ID)
      }
    } else {
      // In kanban, only show concepts owned by current user (not others' private concepts)
      filtered = filtered.filter(c => c.status !== "concept" || c.creatorId === CURRENT_USER_ID)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.createdBy.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q)) ||
        c.therapeuticAreas.some(ta => ta.toLowerCase().includes(q)) ||
        c.selectedDatasets.some(d =>
          d.code.toLowerCase().includes(q) ||
          d.name.toLowerCase().includes(q)
        ) ||
        (c.members ?? []).some(m =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.prid.toLowerCase().includes(q) ||
          m.role.toLowerCase().includes(q)
        )
      )
    }
    if (multiFilters.area.length > 0) filtered = filtered.filter(c => c.therapeuticAreas.some(ta => multiFilters.area.includes(ta)))
    if (filters.myAccess !== "all") {
      filtered = filtered.filter(c => filters.myAccess === "have_access" ? c.userAccess?.currentUserHasAccess : !c.userAccess?.currentUserHasAccess)
    }
    if (filters.intent !== "all") filtered = filtered.filter(c => c.agreementOfTerms[filters.intent as keyof typeof c.agreementOfTerms])
    if (filters.accessLevel !== "all") filtered = filtered.filter(c => c.accessLevel === filters.accessLevel)
    if (filters.userGroup !== "all") filtered = filtered.filter(c => c.userAccess?.accessGroups?.includes(filters.userGroup))
    if (filters.compliance !== "all") filtered = filtered.filter(c => c.compliance === filters.compliance)
    if (multiFilters.studyPhase.length > 0) filtered = filtered.filter(c => c.studyPhases.some(p => multiFilters.studyPhase.includes(p)))
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
    const statusOrder: Record<string, number> = { concept: 0, draft: 1, active: 2, pending_approval: 3, provisioning: 4 }
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name": return a.name.localeCompare(b.name)
        case "users": return b.totalUsers - a.totalUsers
        case "progress": return b.progress - a.progress
        case "patients": return b.patientCount - a.patientCount
        case "recent": return b.createdAt.getTime() - a.createdAt.getTime()
        case "status":
        default:
          return (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)
      }
    })

    return filtered.sort((a, b) => (a.isFavorite === b.isFavorite ? 0 : a.isFavorite ? -1 : 1))
  }, [searchQuery, filters, multiFilters, sortBy, scope, viewMode])

  // Search match engine for the results panel
  const allMembers = useMemo(() => getAllCollectionMembers(), [])
  const searchMatches = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return null
    const q = searchQuery.toLowerCase()
    const results: MatchItem[] = []

    // Collections: name, description, tags, TAs
    for (const col of COLLECTIONS_WITH_AOT) {
      if (col.name.toLowerCase().includes(q))
        results.push({ category: "Collection", label: col.name, detail: "name", refineTo: col.name })
      else if (col.description.toLowerCase().includes(q))
        results.push({ category: "Collection", label: col.name, detail: "description", refineTo: col.name })
      for (const ta of col.therapeuticAreas) {
        if (ta.toLowerCase().includes(q) && !results.some(r => r.category === "Collection" && r.label === col.name))
          results.push({ category: "Collection", label: col.name, detail: `area: ${ta}`, refineTo: ta })
      }
    }

    // Datasets: code, name (deduplicated)
    const seenDatasets = new Set<string>()
    for (const col of COLLECTIONS_WITH_AOT) {
      for (const d of col.selectedDatasets) {
        if (seenDatasets.has(d.code)) continue
        if (d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)) {
          seenDatasets.add(d.code)
          results.push({ category: "Dataset", label: `${d.code} — ${d.name}`, detail: d.code, refineTo: d.code })
        }
      }
    }

    // Users: name, email, prid, role (deduplicated by prid)
    const seenPrids = new Set<string>()
    for (const m of allMembers) {
      if (seenPrids.has(m.prid)) continue
      if (m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.prid.toLowerCase().includes(q) || m.role.toLowerCase().includes(q)) {
        seenPrids.add(m.prid)
        results.push({ category: "User", label: m.name, detail: `${m.prid} · ${m.role}`, refineTo: m.name })
      }
    }

    return {
      Collection: results.filter(r => r.category === "Collection"),
      Dataset: results.filter(r => r.category === "Dataset"),
      User: results.filter(r => r.category === "User"),
    }
  }, [searchQuery, COLLECTIONS_WITH_AOT, allMembers])

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
    <div className="bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="px-8 pt-5 pb-4">
          {/* Row 1: Title + Search + Sort + View */}
          <div className="flex items-center gap-6 mb-4">
            <h1 className="text-2xl font-light text-neutral-900 shrink-0">Collections</h1>

            <div className="relative flex-1 max-w-sm" ref={searchContainerRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 z-10" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => { setTimeout(() => setSearchFocused(false), 150) }}
                placeholder="Search collections, datasets, users, roles..."
                className="pl-9 h-9 rounded-lg border-neutral-200 font-normal text-sm bg-white/50"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 z-10">
                  <X className="size-3.5 text-neutral-400 hover:text-neutral-600" />
                </button>
              )}
              {searchFocused && searchQuery.length >= 2 && searchMatches && (
                <SearchMatchPanel matches={searchMatches} query={searchQuery} onSelect={(refineTo) => { setSearchQuery(refineTo); setSearchFocused(false) }} />
              )}
            </div>

            <div className="flex items-center gap-3 ml-auto">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 h-9 rounded-lg border-neutral-200 font-normal text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
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
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-3 py-1.5 bg-white border border-neutral-200 text-neutral-600 text-[11px] rounded-md whitespace-nowrap opacity-0 group-hover/scope:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                  Board columns show all stages
                  <div className="absolute left-1/2 -translate-x-1/2 -top-1.5 size-2.5 bg-white border-l border-t border-neutral-200 rotate-45" />
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
            {filteredCollections.map((col) => {
              const isConcept = col.status === "concept"
              const isDraft = col.status === "draft"

              return (
                <div
                  key={col.id}
                  onClick={() => handleViewCollection(col.id)}
                  className={cn(
                    "group cursor-pointer rounded-2xl transition-all duration-300 flex flex-col relative hover:z-10 overflow-visible",
                    isConcept
                      ? "border-2 border-neutral-300 bg-white/70 hover:bg-white hover:shadow-xl"
                      : isDraft
                        ? "border-2 border-amber-300 bg-white/70 hover:bg-white hover:shadow-xl"
                        : "border border-transparent bg-white/70 backdrop-blur-sm hover:bg-white hover:shadow-xl"
                  )}
                >
                  {/* Status badge - overlapping top right */}
                  {(isConcept || isDraft) && (
                    <div className={cn(
                      "absolute -top-2.5 right-4 px-2.5 py-0.5 rounded-full text-[11px] font-medium shadow-sm",
                      isConcept
                        ? "bg-neutral-100 text-neutral-600 border border-neutral-300"
                        : "bg-amber-50 text-amber-700 border border-amber-300"
                    )}>
                      {isConcept ? "Concept" : "Draft"}
                    </div>
                  )}

                  <div className="px-5 pt-4 pb-4 flex flex-col h-full">
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

                    {/* Data Type Icon Bar + Geographic Scope */}
                    <div className="flex items-center gap-2 mb-3">
                      {/* Data types with own hover group */}
                      <div className="relative group/datatypes flex items-center gap-2">
                        {[
                          { type: "Clinical", icon: HeartPulse },
                          { type: "Genomics", icon: Dna },
                          { type: "Imaging", icon: ScanEye },
                          { type: "Real World", icon: Globe },
                          { type: "Biomarker", icon: FlaskConical },
                          { type: "Patient Reported", icon: Microscope },
                        ].map(({ type, icon: Icon }) => {
                          const hasType = col.dataTypes.includes(type)
                          return (
                            <div
                              key={type}
                              className={cn(
                                "size-6 rounded flex items-center justify-center transition-colors",
                                hasType
                                  ? "text-neutral-700 bg-neutral-100"
                                  : "text-neutral-200"
                              )}
                            >
                              <Icon className="size-3.5" strokeWidth={1.5} />
                            </div>
                          )
                        })}
                        {/* Data types hover popover */}
                        <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-neutral-200 rounded-lg p-3 opacity-0 group-hover/datatypes:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                          <div className="absolute left-4 -top-1.5 size-2.5 bg-white border-l border-t border-neutral-200 rotate-45" />
                          <p className="text-[11px] font-medium text-neutral-400 mb-2">Data Types</p>
                          <div className="space-y-1.5">
                            {[
                              { type: "Clinical", icon: HeartPulse },
                              { type: "Genomics", icon: Dna },
                              { type: "Imaging", icon: ScanEye },
                              { type: "Real World", icon: Globe },
                              { type: "Biomarker", icon: FlaskConical },
                              { type: "Patient Reported", icon: Microscope },
                            ].map(({ type, icon: Icon }) => {
                              const hasType = col.dataTypes.includes(type)
                              return (
                                <div key={type} className="flex items-center gap-2">
                                  <Icon className={cn("size-3.5", hasType ? "text-neutral-700" : "text-neutral-300")} strokeWidth={1.5} />
                                  <span className={cn("text-xs", hasType ? "text-neutral-700" : "text-neutral-300 line-through")}>{type}</span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                      {/* Geographic scope icon - right aligned, own hover group */}
                      <div className="relative group/geo ml-auto">
                        <Globe className={cn("size-4 cursor-default", !col.excludedCountries?.length ? "text-neutral-400" : "text-amber-500")} strokeWidth={1.5} />
                        <div className="absolute right-0 bottom-full mb-2 bg-white border border-neutral-200 rounded-lg px-3 py-2 opacity-0 group-hover/geo:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg whitespace-nowrap">
                          <div className="absolute right-2 -bottom-1.5 size-2.5 bg-white border-r border-b border-neutral-200 rotate-45" />
                          {!col.excludedCountries?.length ? (
                            <span className="text-xs text-neutral-500 font-medium">Global</span>
                          ) : (
                            <div>
                              <span className="text-[11px] font-medium text-neutral-400 block mb-1">Excluded Countries</span>
                              <ul className="space-y-0.5">
                                {col.excludedCountries.map((c: string) => (
                                  <li key={c} className="text-xs text-neutral-700">{c}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Health */}
                    {(() => {
                      const health = computeCollectionHealth(col)
                      return (
                        <div className="relative group/health mb-3">
                          <div className="flex items-center justify-between text-xs mb-1.5">
                            <span className="text-neutral-500">Health</span>
                            <span className={cn("font-medium", health.color)}>{health.label}</span>
                          </div>
                          <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full transition-all", health.bgColor)} style={{ width: `${health.overall}%` }} />
                          </div>
                          {/* Health breakdown popover */}
                          <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-neutral-200 rounded-lg p-3 opacity-0 group-hover/health:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                            <div className="absolute left-1/4 -top-1.5 size-2.5 bg-white border-l border-t border-neutral-200 rotate-45" />
                            <div className="flex items-center justify-between mb-2.5">
                              <span className="text-[11px] font-medium text-neutral-400">Health Breakdown</span>
                              <span className={cn("text-xs font-medium", health.color)}>{health.overall}%</span>
                            </div>
                            <div className="space-y-2.5">
                              {health.dimensions.map(dim => (
                                <div key={dim.label}>
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-[11px] text-neutral-600">{dim.label}</span>
                                    <span className={cn(
                                      "text-[11px] font-medium",
                                      dim.score >= 75 ? "text-green-600" : dim.score >= 50 ? "text-amber-600" : "text-red-600"
                                    )}>{dim.score}%</span>
                                  </div>
                                  <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                                    <div className={cn(
                                      "h-full rounded-full",
                                      dim.score >= 75 ? "bg-green-500" : dim.score >= 50 ? "bg-amber-500" : "bg-red-500"
                                    )} style={{ width: `${dim.score}%` }} />
                                  </div>
                                  <p className="text-[10px] text-neutral-400 mt-0.5">{dim.detail}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )
                    })()}

                    {/* Stats Row */}
                    <div className="flex items-center gap-4 text-xs text-neutral-400 mb-3">
                      <span className="flex items-center gap-1.5" title="Users"><Users className="size-3.5" />{col.totalUsers}</span>
                      <span className="flex items-center gap-1.5" title="Datasets"><Database className="size-3.5" />{col.totalDatasets}</span>
                      {col.commentCount > 0 && (
                        <span className="flex items-center gap-1.5" title="Comments"><MessageSquare className="size-3.5" />{col.commentCount}</span>
                      )}
                    </div>

                    {/* Tags - Phase left, TA right */}
                    <div className="flex items-center justify-between mt-auto gap-2">
                      {/* Phase tags */}
                      <div className="relative group/phase flex items-center gap-1 min-w-0">
                        <Badge variant="outline" className="text-[11px] font-normal py-0.5 px-2 shrink-0">{col.studyPhases[0]}</Badge>
                        {col.studyPhases.length > 1 && (
                          <Badge variant="outline" className="text-[11px] font-normal py-0.5 px-2 text-neutral-400 shrink-0">+{col.studyPhases.length - 1}</Badge>
                        )}
                        {col.studyPhases.length > 1 && (
                          <div className="absolute left-0 bottom-full mb-2 bg-white border border-neutral-200 rounded-lg p-2.5 opacity-0 group-hover/phase:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg w-36">
                            <div className="absolute left-4 -bottom-1.5 size-2.5 bg-white border-r border-b border-neutral-200 rotate-45" />
                            <p className="text-[11px] font-medium text-neutral-400 mb-1.5">Study Phases</p>
                            <div className="space-y-1">
                              {col.studyPhases.map(p => (
                                <div key={p} className="text-xs text-neutral-700">{p}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* TA tags */}
                      <div className="relative group/ta flex items-center gap-1 min-w-0 justify-end">
                        <Badge variant="outline" className="text-[11px] font-normal py-0.5 px-2 text-neutral-500 truncate max-w-[100px]">{col.therapeuticAreas[0]}</Badge>
                        {col.therapeuticAreas.length > 1 && (
                          <Badge variant="outline" className="text-[11px] font-normal py-0.5 px-2 text-neutral-400 shrink-0">+{col.therapeuticAreas.length - 1}</Badge>
                        )}
                        {col.therapeuticAreas.length > 1 && (
                          <div className="absolute right-0 bottom-full mb-2 bg-white border border-neutral-200 rounded-lg p-2.5 opacity-0 group-hover/ta:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg w-44">
                            <div className="absolute right-4 -bottom-1.5 size-2.5 bg-white border-r border-b border-neutral-200 rotate-45" />
                            <p className="text-[11px] font-medium text-neutral-400 mb-1.5">Therapeutic Areas</p>
                            <div className="space-y-1">
                              {col.therapeuticAreas.map(ta => (
                                <div key={ta} className="text-xs text-neutral-700">{ta}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : viewMode === "table" ? (
          /* Table View */
          (() => {
            const DATA_TYPE_ICONS = [
              { type: "Clinical", icon: HeartPulse },
              { type: "Genomics", icon: Dna },
              { type: "Imaging", icon: ScanEye },
              { type: "Real World", icon: Globe },
              { type: "Biomarker", icon: FlaskConical },
              { type: "Patient Reported", icon: Microscope },
            ] as const

            // Sorting
            const handleTableSort = (column: string) => {
              setTableSort(prev => {
                if (!prev || prev.column !== column) return { column, direction: "asc" }
                if (prev.direction === "asc") return { column, direction: "desc" }
                return null
              })
              setTablePage(0)
            }

            const SortIcon = ({ column }: { column: string }) => {
              if (!tableSort || tableSort.column !== column) return <ArrowUpDown className="size-3 text-neutral-300" />
              return tableSort.direction === "asc" ? <ChevronUp className="size-3 text-neutral-700" /> : <ChevronDown className="size-3 text-neutral-700" />
            }

            const sortedRows = [...filteredCollections].sort((a, b) => {
              if (!tableSort) return 0
              const dir = tableSort.direction === "asc" ? 1 : -1
              switch (tableSort.column) {
                case "name": return dir * a.name.localeCompare(b.name)
                case "health": return dir * (computeCollectionHealth(a).overall - computeCollectionHealth(b).overall)
                case "users": return dir * (a.totalUsers - b.totalUsers)
                case "datasets": return dir * (a.totalDatasets - b.totalDatasets)
                case "comments": return dir * (a.commentCount - b.commentCount)
                case "phase": return dir * ((a.studyPhases[0] || "").localeCompare(b.studyPhases[0] || ""))
                case "ta": return dir * ((a.therapeuticAreas[0] || "").localeCompare(b.therapeuticAreas[0] || ""))
                default: return 0
              }
            })

            const totalPages = Math.ceil(sortedRows.length / tablePageSize)
            const pagedRows = sortedRows.slice(tablePage * tablePageSize, (tablePage + 1) * tablePageSize)

            const ThCell = ({ column, children, sortable = true, className: thClassName }: { column: string; children: React.ReactNode; sortable?: boolean; className?: string }) => (
              <th
                className={cn(
                  "px-4 py-3 text-left text-[11px] font-medium text-neutral-400 uppercase tracking-wider",
                  sortable && "cursor-pointer select-none hover:text-neutral-600 transition-colors",
                  thClassName
                )}
                onClick={() => sortable && handleTableSort(column)}
              >
                <div className="flex items-center gap-1.5">
                  {children}
                  {sortable && <SortIcon column={column} />}
                </div>
              </th>
            )

            return (
              <div>
                <Card className="border-0 bg-white/70 backdrop-blur-sm rounded-2xl">
                  <div>
                    <table className="w-full">
                      <thead className="bg-neutral-50/80 border-b border-neutral-200/50">
                        <tr>
                          <ThCell column="name" className="min-w-[260px]">Collection</ThCell>
                          <ThCell column="datatypes" sortable={false}>Data Types</ThCell>
                          <ThCell column="scope" sortable={false}>Scope</ThCell>
                          <ThCell column="health">Health</ThCell>
                          <ThCell column="users">Users</ThCell>
                          <ThCell column="datasets">Datasets</ThCell>
                          <ThCell column="comments">Comments</ThCell>
                          <ThCell column="phase">Phase</ThCell>
                          <ThCell column="ta">TA</ThCell>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100/80">
                        {pagedRows.map((col) => {
                          const health = computeCollectionHealth(col)
                          const isConcept = col.status === "concept"
                          const isDraft = col.status === "draft"

                          return (
                            <tr key={col.id} onClick={() => handleViewCollection(col.id)} className="hover:bg-neutral-50/50 cursor-pointer transition-colors group/row">
                              {/* Collection name + status badge + favourite */}
                              <td className="px-4 py-3.5">
                                <div className="relative group/name">
                                  <div className="flex items-center gap-2">
                                    {col.isFavorite && <Star className="size-3.5 fill-amber-400 text-amber-400 shrink-0" />}
                                    <span className="text-sm font-medium text-neutral-900 line-clamp-1">{col.name}</span>
                                    {(isConcept || isDraft) && (
                                      <span className={cn(
                                        "text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0",
                                        isConcept ? "bg-neutral-100 text-neutral-500" : "bg-amber-50 text-amber-600 border border-amber-200"
                                      )}>
                                        {isConcept ? "Concept" : "Draft"}
                                      </span>
                                    )}
                                  </div>
                                  {/* Description popover */}
                                  <div className="absolute left-0 top-full mt-1.5 w-72 bg-white border border-neutral-200 rounded-lg p-3 opacity-0 group-hover/name:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                                    <div className="absolute left-6 -top-1.5 size-2.5 bg-white border-l border-t border-neutral-200 rotate-45" />
                                    <p className="text-xs text-neutral-600 leading-relaxed">{col.description}</p>
                                  </div>
                                </div>
                              </td>

                              {/* Data Types icon bar */}
                              <td className="px-4 py-3.5">
                                <div className="relative group/datatypes">
                                  <div className="flex items-center gap-1">
                                    {DATA_TYPE_ICONS.map(({ type, icon: Icon }) => {
                                      const hasType = col.dataTypes.includes(type)
                                      return (
                                        <div key={type} className={cn("size-5 rounded flex items-center justify-center", hasType ? "text-neutral-700 bg-neutral-100" : "text-neutral-200")}>
                                          <Icon className="size-3" strokeWidth={1.5} />
                                        </div>
                                      )
                                    })}
                                  </div>
                                  <div className="absolute left-0 top-full mt-1.5 w-48 bg-white border border-neutral-200 rounded-lg p-3 opacity-0 group-hover/datatypes:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                                    <div className="absolute left-4 -top-1.5 size-2.5 bg-white border-l border-t border-neutral-200 rotate-45" />
                                    <p className="text-[11px] font-medium text-neutral-400 mb-2">Data Types</p>
                                    <div className="space-y-1.5">
                                      {DATA_TYPE_ICONS.map(({ type, icon: Icon }) => {
                                        const hasType = col.dataTypes.includes(type)
                                        return (
                                          <div key={type} className="flex items-center gap-2">
                                            <Icon className={cn("size-3.5", hasType ? "text-neutral-700" : "text-neutral-300")} strokeWidth={1.5} />
                                            <span className={cn("text-xs", hasType ? "text-neutral-700" : "text-neutral-300 line-through")}>{type}</span>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Geographic scope */}
                              <td className="px-4 py-3.5">
                                <div className="relative group/geo">
                                  <Globe className={cn("size-4", !col.excludedCountries?.length ? "text-neutral-400" : "text-amber-500")} strokeWidth={1.5} />
                                  <div className="absolute left-0 bottom-full mb-1.5 bg-white border border-neutral-200 rounded-lg px-3 py-2 opacity-0 group-hover/geo:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg whitespace-nowrap">
                                    <div className="absolute left-3 -bottom-1.5 size-2.5 bg-white border-r border-b border-neutral-200 rotate-45" />
                                    {!col.excludedCountries?.length ? (
                                      <span className="text-xs text-neutral-500 font-medium">Global</span>
                                    ) : (
                                      <div>
                                        <span className="text-[11px] font-medium text-neutral-400 block mb-1">Excluded Countries</span>
                                        <ul className="space-y-0.5">
                                          {col.excludedCountries.map((c: string) => (
                                            <li key={c} className="text-xs text-neutral-700">{c}</li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </td>

                              {/* Health */}
                              <td className="px-4 py-3.5">
                                <div className="relative group/health">
                                  <div className="flex items-center gap-2.5">
                                    <div className="w-16 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                      <div className={cn("h-full rounded-full", health.bgColor)} style={{ width: `${health.overall}%` }} />
                                    </div>
                                    <span className={cn("text-xs font-medium tabular-nums", health.color)}>{health.overall}%</span>
                                  </div>
                                  <div className="absolute left-0 top-full mt-1.5 w-56 bg-white border border-neutral-200 rounded-lg p-3 opacity-0 group-hover/health:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg">
                                    <div className="absolute left-6 -top-1.5 size-2.5 bg-white border-l border-t border-neutral-200 rotate-45" />
                                    <div className="flex items-center justify-between mb-2.5">
                                      <span className="text-[11px] font-medium text-neutral-400">Health Breakdown</span>
                                      <span className={cn("text-xs font-medium", health.color)}>{health.overall}%</span>
                                    </div>
                                    <div className="space-y-2.5">
                                      {health.dimensions.map(dim => (
                                        <div key={dim.label}>
                                          <div className="flex items-center justify-between mb-1">
                                            <span className="text-[11px] text-neutral-600">{dim.label}</span>
                                            <span className={cn("text-[11px] font-medium", dim.score >= 75 ? "text-green-600" : dim.score >= 50 ? "text-amber-600" : "text-red-600")}>{dim.score}%</span>
                                          </div>
                                          <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                                            <div className={cn("h-full rounded-full", dim.score >= 75 ? "bg-green-500" : dim.score >= 50 ? "bg-amber-500" : "bg-red-500")} style={{ width: `${dim.score}%` }} />
                                          </div>
                                          <p className="text-[10px] text-neutral-400 mt-0.5">{dim.detail}</p>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Users */}
                              <td className="px-4 py-3.5">
                                <span className="flex items-center gap-1.5 text-sm text-neutral-600">
                                  <Users className="size-3.5 text-neutral-400" />{col.totalUsers}
                                </span>
                              </td>

                              {/* Datasets */}
                              <td className="px-4 py-3.5">
                                <span className="flex items-center gap-1.5 text-sm text-neutral-600">
                                  <Database className="size-3.5 text-neutral-400" />{col.totalDatasets}
                                </span>
                              </td>

                              {/* Comments */}
                              <td className="px-4 py-3.5">
                                {col.commentCount > 0 ? (
                                  <span className="flex items-center gap-1.5 text-sm text-neutral-600">
                                    <MessageSquare className="size-3.5 text-neutral-400" />{col.commentCount}
                                  </span>
                                ) : (
                                  <span className="text-sm text-neutral-300">-</span>
                                )}
                              </td>

                              {/* Phase */}
                              <td className="px-4 py-3.5">
                                <div className="relative group/phase flex items-center gap-1">
                                  <Badge variant="outline" className="text-[10px] font-normal py-0.5 px-1.5 shrink-0">{col.studyPhases[0]}</Badge>
                                  {col.studyPhases.length > 1 && (
                                    <Badge variant="outline" className="text-[10px] font-normal py-0.5 px-1.5 text-neutral-400 shrink-0">+{col.studyPhases.length - 1}</Badge>
                                  )}
                                  {col.studyPhases.length > 1 && (
                                    <div className="absolute right-0 bottom-full mb-1.5 bg-white border border-neutral-200 rounded-lg p-2.5 opacity-0 group-hover/phase:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg w-32">
                                      <div className="absolute right-4 -bottom-1.5 size-2.5 bg-white border-r border-b border-neutral-200 rotate-45" />
                                      <p className="text-[11px] font-medium text-neutral-400 mb-1.5">Study Phases</p>
                                      <div className="space-y-1">
                                        {col.studyPhases.map(p => (
                                          <div key={p} className="text-xs text-neutral-700">{p}</div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Therapeutic Areas */}
                              <td className="px-4 py-3.5">
                                <div className="relative group/ta flex items-center gap-1">
                                  <Badge variant="outline" className="text-[10px] font-normal py-0.5 px-1.5 truncate max-w-[90px]">{col.therapeuticAreas[0]}</Badge>
                                  {col.therapeuticAreas.length > 1 && (
                                    <Badge variant="outline" className="text-[10px] font-normal py-0.5 px-1.5 text-neutral-400 shrink-0">+{col.therapeuticAreas.length - 1}</Badge>
                                  )}
                                  {col.therapeuticAreas.length > 1 && (
                                    <div className="absolute right-0 bottom-full mb-1.5 bg-white border border-neutral-200 rounded-lg p-2.5 opacity-0 group-hover/ta:opacity-100 transition-opacity pointer-events-none z-50 shadow-lg w-40">
                                      <div className="absolute right-4 -bottom-1.5 size-2.5 bg-white border-r border-b border-neutral-200 rotate-45" />
                                      <p className="text-[11px] font-medium text-neutral-400 mb-1.5">Therapeutic Areas</p>
                                      <div className="space-y-1">
                                        {col.therapeuticAreas.map(ta => (
                                          <div key={ta} className="text-xs text-neutral-700">{ta}</div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 bg-neutral-50/50">
                    <div className="flex items-center gap-2 text-xs text-neutral-500">
                      <span>{sortedRows.length} results</span>
                      <span className="text-neutral-300">|</span>
                      <span>Rows per page</span>
                      <select
                        value={tablePageSize}
                        onChange={(e) => { setTablePageSize(Number(e.target.value)); setTablePage(0) }}
                        className="bg-white border border-neutral-200 rounded-md px-2 py-1 text-xs text-neutral-700 outline-none focus:ring-1 focus:ring-neutral-300"
                      >
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-neutral-500 mr-2">
                        {tablePage * tablePageSize + 1}-{Math.min((tablePage + 1) * tablePageSize, sortedRows.length)} of {sortedRows.length}
                      </span>
                      <button
                        onClick={() => setTablePage(0)}
                        disabled={tablePage === 0}
                        className="p-1.5 rounded-md hover:bg-neutral-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronsLeft className="size-3.5 text-neutral-600" />
                      </button>
                      <button
                        onClick={() => setTablePage(p => Math.max(0, p - 1))}
                        disabled={tablePage === 0}
                        className="p-1.5 rounded-md hover:bg-neutral-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronLeft className="size-3.5 text-neutral-600" />
                      </button>
                      <button
                        onClick={() => setTablePage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={tablePage >= totalPages - 1}
                        className="p-1.5 rounded-md hover:bg-neutral-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronRight className="size-3.5 text-neutral-600" />
                      </button>
                      <button
                        onClick={() => setTablePage(totalPages - 1)}
                        disabled={tablePage >= totalPages - 1}
                        className="p-1.5 rounded-md hover:bg-neutral-200/60 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                      >
                        <ChevronsRight className="size-3.5 text-neutral-600" />
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            )
          })()
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
                            <Badge variant="outline" className="text-xs py-0.5 px-2">{col.studyPhases.join(", ")}</Badge>
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

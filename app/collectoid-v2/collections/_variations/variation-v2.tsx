"use client"

import { useState, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { useColorScheme } from "@/app/collectoid-v2/_components"
import { cn } from "@/lib/utils"
import {
  Search,
  Star,
  Users,
  Database,
  X,
  Sparkles,
  ArrowLeft,
  Lock,
  Unlock,
  Filter,
  ChevronDown,
  LayoutGrid,
  Table2,
  Kanban,
  Check,
} from "lucide-react"
import {
  MOCK_COLLECTIONS,
  getAllTherapeuticAreas,
  getAllOwners,
} from "@/lib/dcm-mock-data"

// Constants
const USER_GROUPS = ["Oncology Data Science", "Oncology Biometrics", "Cardiovascular Research", "Neuroscience Analytics", "Translational Medicine", "Biostatistics", "Data Science Platform", "Clinical Operations"]
const STUDY_PHASES = ["Phase I", "Phase II", "Phase III", "Phase IV", "Pre-clinical", "Post-market"]
const DATA_TYPES = ["Clinical", "Genomics", "Imaging", "Real World", "Biomarker", "Patient Reported"]
const REGIONS = ["North America", "Europe", "Asia Pacific", "Latin America", "Global", "Multi-regional"]
const TIME_PERIODS = ["Last 7 days", "Last 30 days", "Last 90 days", "Last year"]

// Extended collection data
const COLLECTIONS_WITH_AOT = MOCK_COLLECTIONS.map((col, i) => ({
  ...col,
  agreementOfTerms: { aiResearch: i % 3 !== 2, softwareDevelopment: i % 4 === 0, externalPublication: i % 2 === 0, internalPublication: true },
  userAccess: { currentUserHasAccess: i % 3 !== 0, accessGroups: USER_GROUPS.filter((_, idx) => (i + idx) % 3 === 0).slice(0, 3) },
  studyPhase: STUDY_PHASES[i % STUDY_PHASES.length],
  dataTypes: DATA_TYPES.filter((_, idx) => (i + idx) % 2 === 0),
  region: REGIONS[i % REGIONS.length],
  patientCount: Math.floor(Math.random() * 50000) + 100,
  lastUpdated: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
  quality: ["High", "Medium", "Standard"][i % 3],
  compliance: ["HIPAA", "GDPR", "Both", "None"][i % 4],
}))

export default function CollectionsBrowserV2() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const searchParams = useSearchParams()

  // View & UI state
  const [viewMode, setViewMode] = useState<"cards" | "table" | "kanban">("cards")
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [filterPopoverOpen, setFilterPopoverOpen] = useState(false)

  // All filter state
  const [filters, setFilters] = useState({
    myAccess: "all",
    intent: "all",
    area: "all",
    status: "all",
    accessLevel: "all",
    userGroup: "all",
    compliance: "all",
    studyPhase: "all",
    dataType: "all",
    region: "all",
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

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearAllFilters = () => {
    setFilters({
      myAccess: "all", intent: "all", area: "all", status: "all", accessLevel: "all",
      userGroup: "all", compliance: "all", studyPhase: "all", dataType: "all", region: "all",
      quality: "all", owner: "all", datasets: "all", patients: "all", users: "all",
      created: "all", updated: "all", favorites: "all", progress: "all",
    })
  }

  const allAreas = useMemo(() => getAllTherapeuticAreas(), [])
  const allOwners = useMemo(() => getAllOwners(), [])

  const activeFilterCount = Object.values(filters).filter(v => v !== "all").length

  // Apply filters
  const filteredCollections = useMemo(() => {
    let filtered = [...COLLECTIONS_WITH_AOT]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q))
    }
    if (filters.status !== "all") filtered = filtered.filter(c => c.status === filters.status)
    if (filters.area !== "all") filtered = filtered.filter(c => c.therapeuticAreas.includes(filters.area))
    if (filters.myAccess !== "all") {
      filtered = filtered.filter(c => filters.myAccess === "have_access" ? c.userAccess?.currentUserHasAccess : !c.userAccess?.currentUserHasAccess)
    }
    if (filters.intent !== "all") filtered = filtered.filter(c => c.agreementOfTerms[filters.intent as keyof typeof c.agreementOfTerms])
    if (filters.accessLevel !== "all") filtered = filtered.filter(c => c.accessLevel === filters.accessLevel)
    if (filters.userGroup !== "all") filtered = filtered.filter(c => c.userAccess?.accessGroups?.includes(filters.userGroup))
    if (filters.compliance !== "all") filtered = filtered.filter(c => c.compliance === filters.compliance)
    if (filters.studyPhase !== "all") filtered = filtered.filter(c => c.studyPhase === filters.studyPhase)
    if (filters.dataType !== "all") filtered = filtered.filter(c => c.dataTypes.includes(filters.dataType))
    if (filters.region !== "all") filtered = filtered.filter(c => c.region === filters.region)
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
  }, [searchQuery, filters, sortBy])

  const handleViewCollection = (id: string) => {
    sessionStorage.setItem("dcm_current_collection_id", id)
    router.push("/collectoid-v2/dcm/progress")
  }

  // Filter chip component
  const FilterChip = ({ label, filterKey, options }: { label: string; filterKey: string; options: { value: string; label: string }[] }) => {
    const value = filters[filterKey as keyof typeof filters]
    const isActive = value !== "all"
    const displayLabel = isActive ? options.find(o => o.value === value)?.label : label

    return (
      <Popover>
        <PopoverTrigger asChild>
          <button className={cn(
            "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-normal transition-all",
            isActive
              ? `bg-gradient-to-r ${scheme.from} ${scheme.to} text-white shadow-md`
              : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50"
          )}>
            {displayLabel}
            <ChevronDown className="size-4" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2" align="start">
          {options.map(opt => (
            <button
              key={opt.value}
              onClick={() => updateFilter(filterKey, opt.value)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 text-sm rounded-lg transition-colors",
                value === opt.value ? "bg-neutral-100 text-neutral-900" : "hover:bg-neutral-50 text-neutral-600"
              )}
            >
              {opt.label}
              {value === opt.value && <Check className="size-4" />}
            </button>
          ))}
        </PopoverContent>
      </Popover>
    )
  }

  // Status indicator
  const StatusDot = ({ status }: { status: string }) => {
    const color = status === "completed" ? "bg-green-500" : status === "provisioning" ? "bg-blue-500" : "bg-amber-500"
    return <div className={cn("size-3 rounded-full", color)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Floating Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-neutral-200/50">
        <div className="px-8 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-5">
              <button
                onClick={() => router.push("/collectoid-v2/discover")}
                className="flex items-center gap-2 text-base font-light text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                <ArrowLeft className="size-5" />
              </button>
              <div>
                <h1 className="text-3xl font-light text-neutral-900">Collections</h1>
                <p className="text-sm font-light text-neutral-500 mt-1">{filteredCollections.length} results</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex bg-neutral-100 rounded-lg p-1">
                {[
                  { id: "cards", icon: LayoutGrid },
                  { id: "table", icon: Table2 },
                  { id: "kanban", icon: Kanban },
                ].map(({ id, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setViewMode(id as "cards" | "table" | "kanban")}
                    className={cn(
                      "p-2.5 rounded-md transition-all",
                      viewMode === id ? "bg-white shadow-sm" : "hover:bg-neutral-50"
                    )}
                  >
                    <Icon className="size-5 text-neutral-600" />
                  </button>
                ))}
              </div>
              <Button
                onClick={() => router.push("/collectoid-v2/discover/ai")}
                size="lg"
                className={cn("rounded-full font-normal bg-gradient-to-r text-white shadow-lg text-base px-6", scheme.from, scheme.to)}
              >
                <Sparkles className="size-5 mr-2" />
                AI Search
              </Button>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search collections..."
                className="pl-12 h-12 rounded-full border-neutral-200 font-normal text-base bg-white/50"
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-44 h-12 rounded-full border-neutral-200 font-normal text-sm">
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
          </div>

          {/* Filter Chips */}
          <div className="flex items-center gap-3 mt-4 flex-wrap">
            <FilterChip label="Access" filterKey="myAccess" options={[{ value: "all", label: "All" }, { value: "have_access", label: "Have Access" }, { value: "need_request", label: "Need Request" }]} />
            <FilterChip label="Intent" filterKey="intent" options={[{ value: "all", label: "All Uses" }, { value: "aiResearch", label: "AI/ML" }, { value: "softwareDevelopment", label: "Software" }, { value: "externalPublication", label: "Ext Pub" }]} />
            <FilterChip label="Area" filterKey="area" options={[{ value: "all", label: "All Areas" }, ...allAreas.map(a => ({ value: a, label: a }))]} />
            <FilterChip label="Status" filterKey="status" options={[{ value: "all", label: "All" }, { value: "provisioning", label: "Provisioning" }, { value: "completed", label: "Completed" }, { value: "pending_approval", label: "Pending" }]} />
            <FilterChip label="Phase" filterKey="studyPhase" options={[{ value: "all", label: "All Phases" }, ...STUDY_PHASES.map(p => ({ value: p, label: p }))]} />
            <FilterChip label="Region" filterKey="region" options={[{ value: "all", label: "All Regions" }, ...REGIONS.map(r => ({ value: r, label: r }))]} />
            <FilterChip label="Data Type" filterKey="dataType" options={[{ value: "all", label: "All Types" }, ...DATA_TYPES.map(t => ({ value: t, label: t }))]} />
            <FilterChip label="Quality" filterKey="quality" options={[{ value: "all", label: "Any" }, { value: "High", label: "High" }, { value: "Medium", label: "Medium" }, { value: "Standard", label: "Standard" }]} />

            {/* More Filters Popover */}
            <Popover open={filterPopoverOpen} onOpenChange={setFilterPopoverOpen}>
              <PopoverTrigger asChild>
                <button className={cn(
                  "inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-normal transition-all",
                  activeFilterCount > 8
                    ? `bg-gradient-to-r ${scheme.from} ${scheme.to} text-white`
                    : "bg-white border border-dashed border-neutral-300 text-neutral-500 hover:border-neutral-400"
                )}>
                  <Filter className="size-4" />
                  More
                  {activeFilterCount > 8 && <Badge className="ml-1 h-5 px-1.5 text-xs bg-white/20">{activeFilterCount - 8}</Badge>}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-5" align="end">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase">Access Level</label>
                    <Select value={filters.accessLevel} onValueChange={v => updateFilter("accessLevel", v)}>
                      <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="restricted">Restricted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase">User Group</label>
                    <Select value={filters.userGroup} onValueChange={v => updateFilter("userGroup", v)}>
                      <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Groups</SelectItem>
                        {USER_GROUPS.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase">Compliance</label>
                    <Select value={filters.compliance} onValueChange={v => updateFilter("compliance", v)}>
                      <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="HIPAA">HIPAA</SelectItem>
                        <SelectItem value="GDPR">GDPR</SelectItem>
                        <SelectItem value="Both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase">Owner</label>
                    <Select value={filters.owner} onValueChange={v => updateFilter("owner", v)}>
                      <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Owners</SelectItem>
                        {allOwners.map(o => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase">Datasets</label>
                    <Select value={filters.datasets} onValueChange={v => updateFilter("datasets", v)}>
                      <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-100">51-100</SelectItem>
                        <SelectItem value="100+">100+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase">Patients</label>
                    <Select value={filters.patients} onValueChange={v => updateFilter("patients", v)}>
                      <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="<1000">&lt;1K</SelectItem>
                        <SelectItem value="1000-10000">1-10K</SelectItem>
                        <SelectItem value="10000-50000">10-50K</SelectItem>
                        <SelectItem value="50000+">50K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase">Created</label>
                    <Select value={filters.created} onValueChange={v => updateFilter("created", v)}>
                      <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Time</SelectItem>
                        {TIME_PERIODS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-neutral-500 uppercase">Progress</label>
                    <Select value={filters.progress} onValueChange={v => updateFilter("progress", v)}>
                      <SelectTrigger className="h-10 text-sm"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Any</SelectItem>
                        <SelectItem value="<25">&lt;25%</SelectItem>
                        <SelectItem value="25-50">25-50%</SelectItem>
                        <SelectItem value="50-75">50-75%</SelectItem>
                        <SelectItem value="75-100">75%+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="default" onClick={clearAllFilters} className="w-full mt-4 text-sm">
                    Clear all filters
                  </Button>
                )}
              </PopoverContent>
            </Popover>

            {activeFilterCount > 0 && (
              <button onClick={clearAllFilters} className="text-sm text-neutral-500 hover:text-neutral-900 flex items-center gap-1.5">
                <X className="size-4" />
                Clear ({activeFilterCount})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {filteredCollections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Database className="size-20 text-neutral-300 mb-6" />
            <h3 className="text-xl font-light text-neutral-900 mb-3">No collections found</h3>
            <p className="text-base font-light text-neutral-500 mb-6">Try adjusting your filters</p>
            <Button variant="outline" size="lg" onClick={clearAllFilters} className="rounded-full text-base">Clear Filters</Button>
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
                <CardContent className="p-5">
                  {/* Top Row */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2.5">
                      <StatusDot status={col.status} />
                      <Badge variant="outline" className="text-xs font-normal py-1 px-2">{col.studyPhase}</Badge>
                    </div>
                    {col.isFavorite && <Star className="size-5 fill-amber-400 text-amber-400" />}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-base font-medium text-neutral-900 mb-2 line-clamp-1 group-hover:text-neutral-700">
                    {col.name}
                  </h3>
                  <p className="text-sm font-light text-neutral-500 line-clamp-2 mb-4">
                    {col.description}
                  </p>

                  {/* Access & AoT */}
                  <div className="flex items-center gap-2 mb-4">
                    <Badge className={cn(
                      "text-xs font-normal border py-1 px-2",
                      col.userAccess?.currentUserHasAccess
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}>
                      {col.userAccess?.currentUserHasAccess ? <Unlock className="size-3.5 mr-1.5" /> : <Lock className="size-3.5 mr-1.5" />}
                      {col.userAccess?.currentUserHasAccess ? "Access" : "Request"}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs font-normal py-1 px-2", col.agreementOfTerms.aiResearch ? "text-green-600" : "text-red-400")}>
                      ML {col.agreementOfTerms.aiResearch ? "✓" : "✗"}
                    </Badge>
                    <Badge variant="outline" className={cn("text-xs font-normal py-1 px-2", col.agreementOfTerms.externalPublication ? "text-green-600" : "text-red-400")}>
                      Pub {col.agreementOfTerms.externalPublication ? "✓" : "✗"}
                    </Badge>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
                      <span>Progress</span>
                      <span className="font-medium text-neutral-700">{col.progress}%</span>
                    </div>
                    <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full bg-gradient-to-r", scheme.from, scheme.to)} style={{ width: `${col.progress}%` }} />
                    </div>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-neutral-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5"><Users className="size-4" />{col.totalUsers}</span>
                      <span className="flex items-center gap-1.5"><Database className="size-4" />{col.totalDatasets}</span>
                    </div>
                    <span>{col.region}</span>
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
                          {col.userAccess?.currentUserHasAccess ? "✓" : "Request"}
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
                        <span className={cn("text-sm", col.agreementOfTerms.aiResearch ? "text-green-600" : "text-red-400")}>{col.agreementOfTerms.aiResearch ? "✓" : "✗"}</span>
                        <span className="text-neutral-300 mx-1.5">/</span>
                        <span className={cn("text-sm", col.agreementOfTerms.externalPublication ? "text-green-600" : "text-red-400")}>{col.agreementOfTerms.externalPublication ? "✓" : "✗"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          /* Kanban View - Grouped by Status */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["provisioning", "pending_approval", "completed"].map((status) => {
              const statusCollections = filteredCollections.filter(c => c.status === status)
              const statusLabel = status === "provisioning" ? "Provisioning" : status === "pending_approval" ? "Pending" : "Completed"
              const statusColor = status === "provisioning" ? "bg-blue-500" : status === "pending_approval" ? "bg-amber-500" : "bg-green-500"

              return (
                <div key={status} className="space-y-4">
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

"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useColorScheme } from "@/components/ux12-color-context"
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
} from "lucide-react"
import {
  MOCK_COLLECTIONS,
  filterCollections,
  getAllTherapeuticAreas,
  getAllOwners,
  Collection,
} from "@/lib/dcm-mock-data"

export default function CollectionsBrowserPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()

  // View state
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"recent" | "name" | "users" | "progress">("recent")
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)

  // Filter state
  const [selectedStatus, setSelectedStatus] = useState<string[]>([])
  const [selectedAreas, setSelectedAreas] = useState<string[]>([])
  const [accessLevel, setAccessLevel] = useState<"all" | "mine" | "public" | "restricted">("all")
  const [showFilters, setShowFilters] = useState(true)

  // Get filter options
  const allAreas = useMemo(() => getAllTherapeuticAreas(), [])
  const allOwners = useMemo(() => getAllOwners(), [])

  // Apply filters
  const filteredCollections = useMemo(() => {
    let filtered = filterCollections(MOCK_COLLECTIONS, {
      search: searchQuery,
      status: selectedStatus,
      therapeuticAreas: selectedAreas,
      accessLevel,
    })

    // Sort
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "users":
          return b.totalUsers - a.totalUsers
        case "progress":
          return b.progress - a.progress
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
  }, [searchQuery, selectedStatus, selectedAreas, accessLevel, sortBy])

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

  const clearAllFilters = () => {
    setSearchQuery("")
    setSelectedStatus([])
    setSelectedAreas([])
    setAccessLevel("all")
  }

  const hasActiveFilters =
    searchQuery || selectedStatus.length > 0 || selectedAreas.length > 0 || accessLevel !== "all"

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
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_current_collection_id", collectionId)
    }
    router.push("/poc/2/dcm/progress")
  }

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "provisioning":
        return { label: "⚡ Provisioning", color: "bg-blue-100 text-blue-700" }
      case "completed":
        return { label: "✅ Complete", color: "bg-green-100 text-green-700" }
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
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extralight text-neutral-900 tracking-tight mb-2">
              Collections Browser
            </h1>
            <p className="text-base font-light text-neutral-600">
              Discover and access data collections across all therapeutic areas
            </p>
          </div>
          <Button
            onClick={() => router.push("/poc/2/dcm/create")}
            className={cn(
              "h-12 rounded-2xl font-light shadow-lg hover:shadow-xl transition-all bg-gradient-to-r text-white",
              scheme.from,
              scheme.to
            )}
          >
            <PlusCircle className="size-4 mr-2" />
            Create Collection
          </Button>
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
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="h-14 px-6 rounded-2xl font-light border-neutral-200 min-w-[140px]"
          >
            <Filter className="size-4 mr-2" />
            Filters
            {hasActiveFilters && (
              <Badge className={cn("ml-2 font-light", scheme.from.replace("from-", "bg-"), "text-white")}>
                {[selectedStatus.length, selectedAreas.length, accessLevel !== "all" ? 1 : 0].reduce(
                  (a, b) => a + b,
                  0
                )}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-72 shrink-0 space-y-6">
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
                      onClick={() => setAccessLevel(option.value as any)}
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
                    { value: "completed", label: "Completed" },
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
                    {sortBy === "recent" ? "Most Recent" : sortBy === "name" ? "Name (A-Z)" : sortBy === "users" ? "Most Users" : "Progress"}
                  </button>
                  <ChevronDown className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none transition-transform",
                    sortDropdownOpen && "rotate-180"
                  )} />
                  {sortDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl border-2 border-neutral-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {[
                        { value: "recent", label: "Most Recent" },
                        { value: "name", label: "Name (A-Z)" },
                        { value: "users", label: "Most Users" },
                        { value: "progress", label: "Progress" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as any)
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

          {/* Grid View */}
          {viewMode === "grid" && filteredCollections.length > 0 && (
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
                          </div>
                          <p className="text-xs font-light text-neutral-600 line-clamp-2 mb-3">
                            {collection.description}
                          </p>
                        </div>
                      </div>

                      {/* Badges */}
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

          {/* List View */}
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

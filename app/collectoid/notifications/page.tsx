"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useNotifications } from "@/app/collectoid/_components"
import { useColorScheme } from "@/app/collectoid/_components"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import {
  Search,
  Filter,
  X,
  Grid3x3,
  List,
  CheckCheck,
  Archive,
  AlertCircle,
  MessageSquare,
  Clock,
  Info,
  CheckCircle2,
  Bell,
  TrendingUp,
  Users,
  Loader2,
  ChevronDown,
} from "lucide-react"
import { Notification, MOCK_COLLECTIONS } from "@/lib/dcm-mock-data"
import {
  filterNotifications,
  searchNotifications,
  sortNotifications,
  groupNotifications,
  formatRelativeTime,
  getNotificationStats,
  getUniqueCollections,
} from "@/lib/notification-helpers"

type ViewMode = "detailed" | "compact" | "list"
type SortOption = "recent" | "oldest" | "priority" | "collection"
type GroupOption = "priority" | "collection" | "date" | "type"

export default function NotificationsPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const {
    notifications: allNotifications,
    markAsRead,
    markAllAsRead,
    archiveNotification,
    archiveMultiple,
    getActiveNotifications,
  } = useNotifications()

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([])
  const [selectedCollection, setSelectedCollection] = useState<string>("all")
  const [readStatus, setReadStatus] = useState<"all" | boolean>("all")
  const [includeArchived, setIncludeArchived] = useState(false)
  const [dateRange, setDateRange] = useState<"today" | "week" | "month" | "all">("all")
  const [showFilters, setShowFilters] = useState(true)

  // View/Sort state
  const [viewMode, setViewMode] = useState<ViewMode>("detailed")
  const [sortBy, setSortBy] = useState<SortOption>("recent")
  const [groupBy, setGroupBy] = useState<GroupOption>("priority")
  const [collectionDropdownOpen, setCollectionDropdownOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [groupDropdownOpen, setGroupDropdownOpen] = useState(false)

  // Selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Apply filters and search
  const activeNotifications = useMemo(() => {
    return getActiveNotifications()
  }, [allNotifications])

  const filtered = useMemo(() => {
    let result = activeNotifications

    // Apply search
    if (searchQuery) {
      result = searchNotifications(result, searchQuery)
    }

    // Apply filters
    result = filterNotifications(result, {
      type: selectedTypes.length > 0 ? selectedTypes : undefined,
      priority: selectedPriorities.length > 0 ? selectedPriorities : undefined,
      collectionId: selectedCollection !== "all" ? selectedCollection : undefined,
      isRead: readStatus,
      includeArchived,
      dateRange,
    })

    // Apply sort
    result = sortNotifications(result, sortBy)

    return result
  }, [
    activeNotifications,
    searchQuery,
    selectedTypes,
    selectedPriorities,
    selectedCollection,
    readStatus,
    includeArchived,
    dateRange,
    sortBy,
  ])

  // Group notifications
  const grouped = useMemo(() => {
    return groupNotifications(filtered, groupBy)
  }, [filtered, groupBy])

  // Get stats
  const stats = useMemo(() => {
    return getNotificationStats(activeNotifications)
  }, [activeNotifications])

  // Get unique collections
  const uniqueCollections = useMemo(() => {
    return getUniqueCollections(activeNotifications)
  }, [activeNotifications])

  // Check if filters are active
  const hasActiveFilters =
    searchQuery ||
    selectedTypes.length > 0 ||
    selectedPriorities.length > 0 ||
    selectedCollection !== "all" ||
    readStatus !== "all" ||
    includeArchived ||
    dateRange !== "all"

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("")
    setSelectedTypes([])
    setSelectedPriorities([])
    setSelectedCollection("all")
    setReadStatus("all")
    setIncludeArchived(false)
    setDateRange("all")
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.custom-dropdown')) {
        setCollectionDropdownOpen(false)
        setSortDropdownOpen(false)
        setGroupDropdownOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("dcm_current_collection_id", notification.collectionId)
      }
      router.push(notification.actionUrl)
    }
  }

  // Handle selection
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedIds)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedIds(newSelection)
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map((n) => n.id)))
    }
  }

  // Bulk actions
  const handleMarkSelectedAsRead = () => {
    selectedIds.forEach((id) => markAsRead(id))
    setSelectedIds(new Set())
  }

  const handleArchiveSelected = () => {
    archiveMultiple(Array.from(selectedIds))
    setSelectedIds(new Set())
  }

  // Get icon and style for notification
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "blocker":
        return AlertCircle
      case "mention":
        return MessageSquare
      case "approval":
        return Clock
      case "update":
        return Info
      case "completion":
        return CheckCircle2
      default:
        return Info
    }
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return {
          border: "border-l-4 border-red-500",
          bg: "bg-red-50 hover:bg-red-100",
          icon: "text-red-600",
          badge: "bg-red-100 text-red-700 border-red-200",
        }
      case "high":
        return {
          border: "border-l-4 border-amber-500",
          bg: "bg-amber-50 hover:bg-amber-100",
          icon: "text-amber-600",
          badge: "bg-amber-100 text-amber-700 border-amber-200",
        }
      case "medium":
        return {
          border: "border-l-4 border-blue-500",
          bg: "bg-blue-50 hover:bg-blue-100",
          icon: "text-blue-600",
          badge: "bg-blue-100 text-blue-700 border-blue-200",
        }
      case "low":
        return {
          border: "border-l-4 border-green-500",
          bg: "bg-green-50 hover:bg-green-100",
          icon: "text-green-600",
          badge: "bg-green-100 text-green-700 border-green-200",
        }
      default:
        return {
          border: "border-l-4 border-neutral-300",
          bg: "bg-neutral-50 hover:bg-neutral-100",
          icon: "text-neutral-600",
          badge: "bg-neutral-100 text-neutral-700 border-neutral-200",
        }
    }
  }

  // Notification Item Component
  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const Icon = getNotificationIcon(notification.type)
    const style = getPriorityStyle(notification.priority)
    const isSelected = selectedIds.has(notification.id)

    if (viewMode === "compact") {
      return (
        <div
          onClick={() => handleNotificationClick(notification)}
          className={cn(
            "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left border cursor-pointer",
            notification.isRead ? "border-neutral-200 bg-white" : `${style.border} ${style.bg}`,
            isSelected && "ring-2 ring-offset-2 ring-blue-500"
          )}
        >
          <Checkbox
            checked={isSelected}
            onClick={(e) => {
              e.stopPropagation()
              toggleSelection(notification.id)
            }}
          />
          <Icon className={cn("size-4 shrink-0", style.icon)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <div className={cn("size-2 rounded-full bg-gradient-to-r shrink-0", scheme.from, scheme.to)} />
              )}
              <span className="text-sm font-normal text-neutral-900 truncate">
                {notification.title}
              </span>
            </div>
          </div>
          <span className="text-xs font-light text-neutral-500 shrink-0">
            {formatRelativeTime(notification.timestamp)}
          </span>
          <Badge variant="outline" className="text-xs font-light border-neutral-200 shrink-0">
            {notification.collectionName}
          </Badge>
        </div>
      )
    }

    if (viewMode === "list") {
      return (
        <tr
          onClick={() => handleNotificationClick(notification)}
          className={cn(
            "border-b border-neutral-100 cursor-pointer transition-colors",
            notification.isRead ? "hover:bg-neutral-50" : `${style.bg}`,
            isSelected && "ring-2 ring-inset ring-blue-500"
          )}
        >
          <td className="px-4 py-3">
            <Checkbox
              checked={isSelected}
              onClick={(e) => {
                e.stopPropagation()
                toggleSelection(notification.id)
              }}
            />
          </td>
          <td className="px-4 py-3">
            <Icon className={cn("size-4", style.icon)} />
          </td>
          <td className="px-4 py-3">
            <Badge variant="outline" className={cn("text-xs font-light border", style.badge)}>
              {notification.priority}
            </Badge>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              {!notification.isRead && (
                <div className={cn("size-2 rounded-full bg-gradient-to-r", scheme.from, scheme.to)} />
              )}
              <span className="text-sm font-normal text-neutral-900">{notification.title}</span>
            </div>
          </td>
          <td className="px-4 py-3">
            <span className="text-sm font-light text-neutral-600">
              {notification.collectionName}
            </span>
          </td>
          <td className="px-4 py-3">
            <span className="text-xs font-light text-neutral-500">
              {formatRelativeTime(notification.timestamp)}
            </span>
          </td>
          <td className="px-4 py-3">
            <button
              onClick={(e) => {
                e.stopPropagation()
                archiveNotification(notification.id)
              }}
              className="p-1 rounded hover:bg-neutral-200"
            >
              <Archive className="size-4 text-neutral-600" />
            </button>
          </td>
        </tr>
      )
    }

    // Detailed view (default)
    return (
      <Card
        key={notification.id}
        className={cn(
          "border-neutral-200 rounded-2xl overflow-hidden transition-all cursor-pointer",
          notification.isRead ? "opacity-75" : `${style.border} ${style.bg} shadow-sm`,
          isSelected && "ring-2 ring-offset-2 ring-blue-500"
        )}
        onClick={() => handleNotificationClick(notification)}
      >
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Checkbox
              checked={isSelected}
              onClick={(e) => {
                e.stopPropagation()
                toggleSelection(notification.id)
              }}
            />
            <Icon className={cn("size-5 shrink-0 mt-0.5", style.icon)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!notification.isRead && (
                      <div className={cn("size-2 rounded-full bg-gradient-to-r animate-pulse", scheme.from, scheme.to)} />
                    )}
                    <h3 className="text-sm font-normal text-neutral-900">{notification.title}</h3>
                  </div>
                  <p className="text-sm font-light text-neutral-700 mb-2">
                    {notification.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-light text-neutral-500">
                  {formatRelativeTime(notification.timestamp)}
                </span>
                <Badge variant="outline" className={cn("text-xs font-light border", style.badge)}>
                  {notification.priority}
                </Badge>
                <Badge variant="outline" className="text-xs font-light border-neutral-200">
                  {notification.type}
                </Badge>
                <Badge variant="outline" className="text-xs font-light border-neutral-200">
                  {notification.collectionName}
                </Badge>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                archiveNotification(notification.id)
              }}
              className="p-2 rounded-lg hover:bg-neutral-200 transition-colors shrink-0"
            >
              <Archive className="size-4 text-neutral-600" />
            </button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-extralight text-neutral-900 tracking-tight mb-2">
              Notifications
            </h1>
            <p className="text-base font-light text-neutral-600">
              Manage and track all your collection notifications in one place
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total", value: stats.total, icon: Bell, color: "neutral" },
            { label: "Unread", value: stats.unread, icon: MessageSquare, color: "blue" },
            { label: "Critical", value: stats.critical, icon: AlertCircle, color: "red" },
            { label: "Mentions", value: stats.mentions, icon: MessageSquare, color: "amber" },
            { label: "Approvals", value: stats.approvals, icon: Clock, color: "purple" },
          ].map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} className="border-neutral-200 rounded-xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon
                      className={cn(
                        "size-5",
                        stat.color === "red" && "text-red-600",
                        stat.color === "blue" && "text-blue-600",
                        stat.color === "amber" && "text-amber-600",
                        stat.color === "purple" && "text-purple-600",
                        stat.color === "neutral" && "text-neutral-600"
                      )}
                    />
                  </div>
                  <p className="text-2xl font-light text-neutral-900 mb-1">{stat.value}</p>
                  <p className="text-xs font-light text-neutral-600 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Search and Filter Bar */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notifications..."
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
              <Badge className={cn("ml-2 font-light bg-gradient-to-r text-white border-0", scheme.from, scheme.to)}>
                {[
                  selectedTypes.length,
                  selectedPriorities.length,
                  selectedCollection !== "all" ? 1 : 0,
                  readStatus !== "all" ? 1 : 0,
                  includeArchived ? 1 : 0,
                  dateRange !== "all" ? 1 : 0,
                ].reduce((a, b) => a + b, 0)}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-72 shrink-0 space-y-4">
            {/* Type Filter */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-normal text-neutral-900 mb-3">Type</h3>
                <div className="space-y-2">
                  {["blocker", "mention", "approval", "update", "completion"].map((type) => (
                    <label
                      key={type}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedTypes.includes(type)}
                        onCheckedChange={() => {
                          setSelectedTypes((prev) =>
                            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
                          )
                        }}
                      />
                      <span className="text-sm font-light text-neutral-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Priority Filter */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-normal text-neutral-900 mb-3">Priority</h3>
                <div className="space-y-2">
                  {["critical", "high", "medium", "low"].map((priority) => (
                    <label
                      key={priority}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer"
                    >
                      <Checkbox
                        checked={selectedPriorities.includes(priority)}
                        onCheckedChange={() => {
                          setSelectedPriorities((prev) =>
                            prev.includes(priority)
                              ? prev.filter((p) => p !== priority)
                              : [...prev, priority]
                          )
                        }}
                      />
                      <span className="text-sm font-light text-neutral-700 capitalize">
                        {priority}
                      </span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Collection Filter */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-normal text-neutral-900 mb-3">Collection</h3>
                <div className="relative custom-dropdown">
                  <button
                    onClick={() => {
                      setSortDropdownOpen(false)
                      setGroupDropdownOpen(false)
                      setCollectionDropdownOpen(!collectionDropdownOpen)
                    }}
                    className={cn(
                      "w-full h-10 pl-4 pr-10 rounded-xl border-2 font-light text-sm bg-white transition-all text-left",
                      collectionDropdownOpen
                        ? cn("border-current", scheme.from.replace("from-", "border-").replace("-500", "-400"))
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                  >
                    {selectedCollection === "all"
                      ? "All Collections"
                      : uniqueCollections.find((c) => c.id === selectedCollection)?.name || "All Collections"}
                  </button>
                  <ChevronDown className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none transition-transform",
                    collectionDropdownOpen && "rotate-180"
                  )} />
                  {collectionDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl border-2 border-neutral-200 bg-white shadow-xl overflow-hidden max-h-64 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                      <button
                        onClick={() => {
                          setSelectedCollection("all")
                          setCollectionDropdownOpen(false)
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-left text-sm font-light transition-colors",
                          selectedCollection === "all"
                            ? cn("bg-neutral-100 text-neutral-900", scheme.from.replace("from-", "text-").replace("-500", "-700"))
                            : "hover:bg-neutral-50"
                        )}
                      >
                        All Collections
                      </button>
                      {uniqueCollections.map((collection) => (
                        <button
                          key={collection.id}
                          onClick={() => {
                            setSelectedCollection(collection.id)
                            setCollectionDropdownOpen(false)
                          }}
                          className={cn(
                            "w-full px-4 py-2.5 text-left text-sm font-light transition-colors",
                            selectedCollection === collection.id
                              ? cn("bg-neutral-100 text-neutral-900", scheme.from.replace("from-", "text-").replace("-500", "-700"))
                              : "hover:bg-neutral-50"
                          )}
                        >
                          {collection.name} ({collection.count})
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Read Status Filter */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-normal text-neutral-900 mb-3">Read Status</h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All" },
                    { value: false, label: "Unread Only" },
                    { value: true, label: "Read Only" },
                  ].map((option) => (
                    <button
                      key={String(option.value)}
                      onClick={() => setReadStatus(option.value as any)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-light transition-all",
                        readStatus === option.value
                          ? cn("bg-gradient-to-r text-white", scheme.bg, scheme.bgHover)
                          : "hover:bg-neutral-50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Date Range Filter */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-normal text-neutral-900 mb-3">Date Range</h3>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All Time" },
                    { value: "today", label: "Today" },
                    { value: "week", label: "Last 7 Days" },
                    { value: "month", label: "Last 30 Days" },
                  ].map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setDateRange(option.value as any)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm font-light transition-all",
                        dateRange === option.value
                          ? cn("bg-gradient-to-r text-white", scheme.bg, scheme.bgHover)
                          : "hover:bg-neutral-50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Include Archived Toggle */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <label className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer">
                  <Checkbox
                    checked={includeArchived}
                    onCheckedChange={() => setIncludeArchived(!includeArchived)}
                  />
                  <span className="text-sm font-light text-neutral-700">Show Archived</span>
                </label>
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
                {filtered.length} notification{filtered.length !== 1 ? "s" : ""}
              </p>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-light text-neutral-600">Sort:</span>
                <div className="relative custom-dropdown">
                  <button
                    onClick={() => {
                      setCollectionDropdownOpen(false)
                      setGroupDropdownOpen(false)
                      setSortDropdownOpen(!sortDropdownOpen)
                    }}
                    className={cn(
                      "h-9 pl-4 pr-10 rounded-xl border-2 font-light text-sm bg-white transition-all min-w-[140px] text-left",
                      sortDropdownOpen
                        ? cn("border-current", scheme.from.replace("from-", "border-").replace("-500", "-400"))
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                  >
                    {sortBy === "recent" ? "Most Recent" : sortBy === "oldest" ? "Oldest First" : sortBy === "priority" ? "By Priority" : "By Collection"}
                  </button>
                  <ChevronDown className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none transition-transform",
                    sortDropdownOpen && "rotate-180"
                  )} />
                  {sortDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl border-2 border-neutral-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {[
                        { value: "recent", label: "Most Recent" },
                        { value: "oldest", label: "Oldest First" },
                        { value: "priority", label: "By Priority" },
                        { value: "collection", label: "By Collection" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as SortOption)
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

              {/* Group */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-light text-neutral-600">Group:</span>
                <div className="relative custom-dropdown">
                  <button
                    onClick={() => {
                      setCollectionDropdownOpen(false)
                      setSortDropdownOpen(false)
                      setGroupDropdownOpen(!groupDropdownOpen)
                    }}
                    className={cn(
                      "h-9 pl-4 pr-10 rounded-xl border-2 font-light text-sm bg-white transition-all min-w-[140px] text-left",
                      groupDropdownOpen
                        ? cn("border-current", scheme.from.replace("from-", "border-").replace("-500", "-400"))
                        : "border-neutral-200 hover:border-neutral-300"
                    )}
                  >
                    {groupBy === "priority" ? "By Priority" : groupBy === "collection" ? "By Collection" : groupBy === "date" ? "By Date" : "By Type"}
                  </button>
                  <ChevronDown className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none transition-transform",
                    groupDropdownOpen && "rotate-180"
                  )} />
                  {groupDropdownOpen && (
                    <div className="absolute z-50 w-full mt-2 rounded-xl border-2 border-neutral-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                      {[
                        { value: "priority", label: "By Priority" },
                        { value: "collection", label: "By Collection" },
                        { value: "date", label: "By Date" },
                        { value: "type", label: "By Type" },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setGroupBy(option.value as GroupOption)
                            setGroupDropdownOpen(false)
                          }}
                          className={cn(
                            "w-full px-4 py-2.5 text-left text-sm font-light transition-colors",
                            groupBy === option.value
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
              {/* Bulk Actions */}
              {selectedIds.size > 0 && (
                <>
                  <span className="text-sm font-light text-neutral-600">
                    {selectedIds.size} selected
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkSelectedAsRead}
                    className="h-9 rounded-xl font-light border-neutral-200"
                  >
                    <CheckCheck className="size-4 mr-2" />
                    Mark Read
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleArchiveSelected}
                    className="h-9 rounded-xl font-light border-neutral-200"
                  >
                    <Archive className="size-4 mr-2" />
                    Archive
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSelectAll}
                    className="h-9 rounded-xl font-light border-neutral-200"
                  >
                    Deselect All
                  </Button>
                </>
              )}

              {selectedIds.size === 0 && (
                <>
                  {/* Clear Filters */}
                  {hasActiveFilters && (
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="h-9 rounded-xl font-light border-neutral-200"
                    >
                      <X className="size-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}

                  {/* Mark All Read */}
                  {stats.unread > 0 && (
                    <Button
                      variant="outline"
                      onClick={markAllAsRead}
                      className="h-9 rounded-xl font-light border-neutral-200"
                    >
                      <CheckCheck className="size-4 mr-2" />
                      Mark All Read
                    </Button>
                  )}

                  {/* View Toggle */}
                  <div className="flex gap-1 bg-neutral-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("detailed")}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-light transition-all",
                        viewMode === "detailed" ? "bg-white shadow-sm" : "hover:bg-neutral-50"
                      )}
                    >
                      Detailed
                    </button>
                    <button
                      onClick={() => setViewMode("compact")}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-light transition-all",
                        viewMode === "compact" ? "bg-white shadow-sm" : "hover:bg-neutral-50"
                      )}
                    >
                      Compact
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={cn(
                        "px-3 py-1.5 rounded-md text-xs font-light transition-all",
                        viewMode === "list" ? "bg-white shadow-sm" : "hover:bg-neutral-50"
                      )}
                    >
                      List
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Empty State */}
          {filtered.length === 0 && (
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-12 text-center">
                <Bell className="size-16 text-neutral-300 mx-auto mb-4" />
                <h3 className="text-xl font-light text-neutral-900 mb-2">
                  {hasActiveFilters ? "No matching notifications" : "All caught up!"}
                </h3>
                <p className="text-sm font-light text-neutral-600 mb-6">
                  {hasActiveFilters
                    ? "Try adjusting your filters or search query"
                    : "No notifications at the moment"}
                </p>
                {hasActiveFilters && (
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="rounded-xl font-light border-neutral-200"
                  >
                    Clear Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notification Groups */}
          {filtered.length > 0 && (
            <div className="space-y-6">
              {viewMode === "list" ? (
                <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                  <CardContent className="p-0">
                    <table className="w-full">
                      <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                          <th className="px-4 py-3 text-left">
                            <Checkbox
                              checked={selectedIds.size === filtered.length}
                              onClick={toggleSelectAll}
                            />
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700">
                            Priority
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700">
                            Title
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700">
                            Collection
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700">
                            Time
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((notification) => (
                          <NotificationItem key={notification.id} notification={notification} />
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              ) : (
                Object.entries(grouped).map(([groupName, notifications]) => (
                  <div key={groupName} className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h2 className="text-sm font-normal text-neutral-600 uppercase tracking-wider">
                        {groupName}
                      </h2>
                      <div className="flex-1 h-px bg-neutral-200" />
                      <span className="text-xs font-light text-neutral-500">
                        {notifications.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {notifications.map((notification) => (
                        <NotificationItem key={notification.id} notification={notification} />
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

"use client"

import { useRouter } from "next/navigation"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useColorScheme } from "@/components/ux12-color-context"
import { useNotifications } from "@/components/notification-context"
import { cn } from "@/lib/utils"
import {
  Database,
  Clock,
  CheckCircle2,
  Users,
  PlusCircle,
  ArrowRight,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Bell,
  MessageSquare,
  FileCheck,
} from "lucide-react"
import { MOCK_COLLECTIONS } from "@/lib/dcm-mock-data"
import { useMemo } from "react"

export default function UX15DCMDashboard() {
  const { scheme } = useColorScheme()
  const { notifications, getNotificationsByCollection, getActiveNotifications, criticalCount, unreadCount } = useNotifications()
  const router = useRouter()

  // Calculate needs attention data
  const needsAttentionData = useMemo(() => {
    // Critical Blockers: Collections with blocker notifications
    const blockerNotifications = notifications.filter(
      (n) => n.type === "blocker" && !n.isRead && !n.isArchived
    )
    const collectionsWithBlockers = Array.from(
      new Set(blockerNotifications.map((n) => n.collectionId))
    ).map((id) => {
      const collection = MOCK_COLLECTIONS.find((c) => c.id === id)
      const blockers = blockerNotifications.filter((n) => n.collectionId === id)
      return { collection, blockers }
    })

    // Pending Mentions: Unread mention notifications
    const pendingMentions = notifications.filter(
      (n) => n.type === "mention" && !n.isRead && !n.isArchived
    )

    // Nearing SLA: Collections with approvals > 3 days old
    const nearingSLA = MOCK_COLLECTIONS.filter((col) => {
      if (col.status === "pending_approval") {
        const daysOld = Math.floor((Date.now() - col.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        return daysOld >= 3
      }
      if (col.approvalRequests.length > 0 && col.status === "provisioning") {
        const daysOld = Math.floor((Date.now() - col.createdAt.getTime()) / (1000 * 60 * 60 * 24))
        return daysOld >= 3
      }
      return false
    })

    // Ready for Review: Recently completed collections (last 7 days)
    const readyForReview = MOCK_COLLECTIONS.filter((col) => {
      if (col.status === "completed") {
        const lastMilestone = col.milestones
          .filter((m) => m.status === "completed" && m.timestamp)
          .sort((a, b) => (b.timestamp?.getTime() || 0) - (a.timestamp?.getTime() || 0))[0]
        if (lastMilestone?.timestamp) {
          const daysAgo = Math.floor((Date.now() - lastMilestone.timestamp.getTime()) / (1000 * 60 * 60 * 24))
          return daysAgo <= 7
        }
      }
      return false
    })

    return {
      collectionsWithBlockers,
      pendingMentions,
      nearingSLA,
      readyForReview,
    }
  }, [notifications])

  // Recent Activity Stream (last 10 non-archived, sorted by timestamp)
  const recentActivity = useMemo(() => {
    return getActiveNotifications()
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10)
  }, [getActiveNotifications])

  const handleViewCollection = (collectionId: string) => {
    // Store collection ID in sessionStorage for the progress page
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_current_collection_id", collectionId)
    }
    router.push("/poc/1/dcm/progress")
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "provisioning":
        return { text: "Provisioning", color: "bg-blue-50 text-blue-700 border-blue-200" }
      case "completed":
        return { text: "Fully Provisioned", color: "bg-green-50 text-green-700 border-green-200" }
      case "pending_approval":
        return { text: "Pending Approval", color: "bg-amber-50 text-amber-700 border-amber-200" }
      default:
        return { text: status, color: "bg-neutral-50 text-neutral-700 border-neutral-200" }
    }
  }

  return (
    <>
      {/* Hero Section - DCM Portal */}
      <div
        className={cn(
          "rounded-3xl p-12 mb-8 border bg-gradient-to-br",
          scheme.bg,
          scheme.bgHover,
          scheme.from.replace("from-", "border-").replace("500", "100")
        )}
      >
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extralight text-neutral-900 mb-4 tracking-tight">
            Data Collection Manager
          </h1>
          <p className="text-lg font-light text-neutral-600 max-w-2xl mx-auto">
            Create and manage curated data collections with AI-assisted discovery
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center">
          <Button
            onClick={() => router.push("/poc/1/dcm/create")}
            className={cn(
              "bg-gradient-to-r text-white rounded-full px-10 font-light h-14 text-base shadow-lg hover:shadow-xl transition-all",
              scheme.from,
              scheme.to
            )}
          >
            <PlusCircle className="mr-2 size-5" strokeWidth={1.5} />
            Create New Collection
          </Button>
        </div>
      </div>

      {/* Needs Attention Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* Critical Blockers */}
        <Card
          className="border-neutral-200 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg bg-white"
          onClick={() => router.push("/poc/1/notifications?filter=blocker")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-full",
                needsAttentionData.collectionsWithBlockers.length > 0 ? "bg-red-50" : "bg-neutral-50"
              )}>
                <AlertCircle className={cn(
                  "size-5",
                  needsAttentionData.collectionsWithBlockers.length > 0 ? "text-red-400" : "text-neutral-400"
                )} strokeWidth={1.5} />
              </div>
              {needsAttentionData.collectionsWithBlockers.length > 0 && (
                <Badge variant="outline" className="border-red-200 text-red-600 font-light">
                  {needsAttentionData.collectionsWithBlockers.length}
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm font-normal text-neutral-900">Critical Blockers</CardTitle>
            <CardDescription className="text-xs font-light">Collections with unresolved issues</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {needsAttentionData.collectionsWithBlockers.length > 0 ? (
              <div className="space-y-2">
                {needsAttentionData.collectionsWithBlockers.slice(0, 2).map(({ collection, blockers }) => (
                  <div
                    key={collection?.id}
                    className="text-xs font-light text-neutral-700 flex items-start gap-2 hover:text-neutral-900 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      if (collection) handleViewCollection(collection.id)
                    }}
                  >
                    <div className="size-1.5 rounded-full bg-red-300 shrink-0 mt-1.5" />
                    <span className="line-clamp-1">{collection?.name}</span>
                  </div>
                ))}
                {needsAttentionData.collectionsWithBlockers.length > 2 && (
                  <p className="text-xs font-light text-red-500">
                    +{needsAttentionData.collectionsWithBlockers.length - 2} more
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs font-light text-neutral-500">No critical blockers</p>
            )}
          </CardContent>
        </Card>

        {/* Pending Mentions */}
        <Card
          className="border-neutral-200 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg bg-white"
          onClick={() => router.push("/poc/1/notifications?filter=mention")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-full",
                needsAttentionData.pendingMentions.length > 0 ? "bg-amber-50" : "bg-neutral-50"
              )}>
                <MessageSquare className={cn(
                  "size-5",
                  needsAttentionData.pendingMentions.length > 0 ? "text-amber-400" : "text-neutral-400"
                )} strokeWidth={1.5} />
              </div>
              {needsAttentionData.pendingMentions.length > 0 && (
                <Badge variant="outline" className="border-amber-200 text-amber-600 font-light">
                  {needsAttentionData.pendingMentions.length}
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm font-normal text-neutral-900">Pending Mentions</CardTitle>
            <CardDescription className="text-xs font-light">You've been mentioned in discussions</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {needsAttentionData.pendingMentions.length > 0 ? (
              <div className="space-y-2">
                {needsAttentionData.pendingMentions.slice(0, 2).map((mention) => (
                  <div
                    key={mention.id}
                    className="text-xs font-light text-neutral-700 flex items-start gap-2 hover:text-neutral-900 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewCollection(mention.collectionId)
                    }}
                  >
                    <div className="size-1.5 rounded-full bg-amber-300 shrink-0 mt-1.5" />
                    <span className="line-clamp-1">{mention.actors[0]?.name} in {mention.collectionName}</span>
                  </div>
                ))}
                {needsAttentionData.pendingMentions.length > 2 && (
                  <p className="text-xs font-light text-amber-500">
                    +{needsAttentionData.pendingMentions.length - 2} more
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs font-light text-neutral-500">No pending mentions</p>
            )}
          </CardContent>
        </Card>

        {/* Nearing SLA */}
        <Card
          className="border-neutral-200 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg bg-white"
          onClick={() => router.push("/poc/1/collections?status=pending_approval")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-full",
                needsAttentionData.nearingSLA.length > 0 ? "bg-blue-50" : "bg-neutral-50"
              )}>
                <Clock className={cn(
                  "size-5",
                  needsAttentionData.nearingSLA.length > 0 ? "text-blue-400" : "text-neutral-400"
                )} strokeWidth={1.5} />
              </div>
              {needsAttentionData.nearingSLA.length > 0 && (
                <Badge variant="outline" className="border-blue-200 text-blue-600 font-light">
                  {needsAttentionData.nearingSLA.length}
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm font-normal text-neutral-900">Nearing SLA</CardTitle>
            <CardDescription className="text-xs font-light">Approvals pending &gt; 3 days</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {needsAttentionData.nearingSLA.length > 0 ? (
              <div className="space-y-2">
                {needsAttentionData.nearingSLA.slice(0, 2).map((collection) => {
                  const daysOld = Math.floor((Date.now() - collection.createdAt.getTime()) / (1000 * 60 * 60 * 24))
                  return (
                    <div
                      key={collection.id}
                      className="text-xs font-light text-neutral-700 flex items-start gap-2 hover:text-neutral-900 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleViewCollection(collection.id)
                      }}
                    >
                      <div className="size-1.5 rounded-full bg-blue-300 shrink-0 mt-1.5" />
                      <span className="line-clamp-1">{collection.name} ({daysOld}d)</span>
                    </div>
                  )
                })}
                {needsAttentionData.nearingSLA.length > 2 && (
                  <p className="text-xs font-light text-blue-500">
                    +{needsAttentionData.nearingSLA.length - 2} more
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs font-light text-neutral-500">All on track</p>
            )}
          </CardContent>
        </Card>

        {/* Ready for Review */}
        <Card
          className="border-neutral-200 rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-lg bg-white"
          onClick={() => router.push("/poc/1/collections?status=completed")}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between mb-2">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-full",
                needsAttentionData.readyForReview.length > 0 ? "bg-emerald-50" : "bg-neutral-50"
              )}>
                <FileCheck className={cn(
                  "size-5",
                  needsAttentionData.readyForReview.length > 0 ? "text-emerald-400" : "text-neutral-400"
                )} strokeWidth={1.5} />
              </div>
              {needsAttentionData.readyForReview.length > 0 && (
                <Badge variant="outline" className="border-emerald-200 text-emerald-600 font-light">
                  {needsAttentionData.readyForReview.length}
                </Badge>
              )}
            </div>
            <CardTitle className="text-sm font-normal text-neutral-900">Ready for Review</CardTitle>
            <CardDescription className="text-xs font-light">Recently completed collections</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            {needsAttentionData.readyForReview.length > 0 ? (
              <div className="space-y-2">
                {needsAttentionData.readyForReview.slice(0, 2).map((collection) => (
                  <div
                    key={collection.id}
                    className="text-xs font-light text-neutral-700 flex items-start gap-2 hover:text-neutral-900 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewCollection(collection.id)
                    }}
                  >
                    <div className="size-1.5 rounded-full bg-emerald-300 shrink-0 mt-1.5" />
                    <span className="line-clamp-1">{collection.name}</span>
                  </div>
                ))}
                {needsAttentionData.readyForReview.length > 2 && (
                  <p className="text-xs font-light text-emerald-500">
                    +{needsAttentionData.readyForReview.length - 2} more
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs font-light text-neutral-500">Nothing to review</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Recent Collections */}
        <Card className="col-span-2 border-neutral-200 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 bg-white">
            <CardTitle className="text-lg font-light text-neutral-900">
              My Collections
            </CardTitle>
            <CardDescription className="font-light">
              Collections you're currently managing
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {MOCK_COLLECTIONS.map((collection) => {
              const collectionNotifications = getNotificationsByCollection(collection.id).filter(n => !n.isRead)
              const hasCritical = collectionNotifications.some(n => n.priority === "critical")

              return (
                <div
                  key={collection.id}
                  className={cn(
                    "group p-4 rounded-xl transition-all border cursor-pointer",
                    hasCritical ? "border-red-200 bg-red-50/30 hover:bg-red-50/50" : "border-neutral-100 hover:bg-neutral-50"
                  )}
                  onClick={() => handleViewCollection(collection.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-normal text-neutral-900">
                          {collection.name}
                        </h3>
                        {collectionNotifications.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Bell className={cn("size-3", hasCritical ? "text-red-600" : "text-amber-600")} strokeWidth={1.5} />
                            <span className={cn("text-xs font-light", hasCritical ? "text-red-600" : "text-amber-600")}>
                              {collectionNotifications.length}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs font-light text-neutral-500">
                        <span>{collection.totalUsers} users</span>
                        <span>•</span>
                        <span suppressHydrationWarning>Created {collection.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          "font-light border",
                          getStatusInfo(collection.status).color
                        )}
                      >
                        {getStatusInfo(collection.status).text}
                      </Badge>
                    </div>
                  </div>
                {/* Progress Bar */}
                <div className="w-full bg-neutral-100 rounded-full h-2 mb-2">
                  <div
                    className={cn(
                      "h-2 rounded-full bg-gradient-to-r transition-all",
                      scheme.from,
                      scheme.to
                    )}
                    style={{ width: `${collection.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs font-light text-neutral-500">
                  <span>{collection.progress}% Complete</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs font-light rounded-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleViewCollection(collection.id)
                    }}
                  >
                    View Details
                    <ArrowRight className="ml-1 size-3" strokeWidth={1.5} />
                  </Button>
                </div>
              </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card className="border-neutral-200 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-light text-neutral-900">
                  Recent Notifications
                </CardTitle>
                <CardDescription className="font-light">{unreadCount} unread</CardDescription>
              </div>
              {criticalCount > 0 && (
                <Badge className="bg-gradient-to-r from-red-500 to-orange-400 text-white border-0 font-light">
                  {criticalCount} Critical
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {getActiveNotifications()
              .slice(0, 4)
              .map((notification) => {
                const priorityColors = {
                  critical: "bg-red-50 border-red-100 text-red-900",
                  high: "bg-amber-50 border-amber-100 text-amber-900",
                  medium: "bg-blue-50 border-blue-100 text-blue-900",
                  low: "bg-green-50 border-green-100 text-green-900",
                }
                return (
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        sessionStorage.setItem("dcm_current_collection_id", notification.collectionId)
                      }
                      router.push("/poc/1/notifications")
                    }}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer hover:shadow-md transition-all",
                      notification.isRead ? "bg-white border-neutral-100" : priorityColors[notification.priority]
                    )}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      {!notification.isRead && (
                        <div className="size-2 rounded-full bg-gradient-to-r from-red-500 to-orange-400 mt-1.5 shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-normal block truncate">
                          {notification.title}
                        </span>
                        <p className="text-xs font-light text-neutral-600 mt-1 line-clamp-1">
                          {notification.message}
                        </p>
                        <p className="text-xs font-light text-neutral-500 mt-1" suppressHydrationWarning>
                          {notification.timestamp.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}

            <Button
              variant="outline"
              onClick={() => router.push("/poc/1/notifications")}
              className="w-full rounded-xl font-light border-neutral-200"
            >
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Stream */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden mb-8">
        <CardHeader className="border-b border-neutral-100 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-light text-neutral-900">Recent Activity</CardTitle>
              <CardDescription className="font-light">Latest events across all collections</CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/poc/1/notifications")}
              className="rounded-xl font-light border-neutral-200"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const getActivityIcon = () => {
                switch (activity.type) {
                  case "blocker":
                    return <AlertCircle className="size-4 text-red-400" strokeWidth={1.5} />
                  case "mention":
                    return <MessageSquare className="size-4 text-amber-400" strokeWidth={1.5} />
                  case "approval":
                    return <Clock className="size-4 text-blue-400" strokeWidth={1.5} />
                  case "completion":
                    return <CheckCircle2 className="size-4 text-emerald-400" strokeWidth={1.5} />
                  case "update":
                    return <TrendingUp className="size-4 text-purple-400" strokeWidth={1.5} />
                  default:
                    return <Bell className="size-4 text-neutral-400" strokeWidth={1.5} />
                }
              }

              const getActivityBorderColor = () => {
                switch (activity.priority) {
                  case "critical":
                    return "border-l-red-200"
                  case "high":
                    return "border-l-amber-200"
                  case "medium":
                    return "border-l-blue-200"
                  case "low":
                    return "border-l-emerald-200"
                  default:
                    return "border-l-neutral-200"
                }
              }

              const formatTimeAgo = (date: Date) => {
                const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
                if (seconds < 60) return "Just now"
                if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
                if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
                if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
                return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
              }

              return (
                <div
                  key={activity.id}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-l-4 bg-neutral-50/50 hover:bg-neutral-100/50 transition-all cursor-pointer",
                    getActivityBorderColor()
                  )}
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("dcm_current_collection_id", activity.collectionId)
                    }
                    if (activity.actionUrl) {
                      router.push(activity.actionUrl)
                    }
                  }}
                >
                  <div className="shrink-0 mt-0.5">{getActivityIcon()}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm font-normal text-neutral-900 line-clamp-1">{activity.title}</p>
                      <span className="text-xs font-light text-neutral-500 shrink-0" suppressHydrationWarning>
                        {formatTimeAgo(activity.timestamp)}
                      </span>
                    </div>
                    <p className="text-xs font-light text-neutral-600 mb-2 line-clamp-2">{activity.message}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-light border-neutral-200">
                        {activity.collectionName}
                      </Badge>
                      <span className="text-xs font-light text-neutral-500">
                        by {activity.actors[0]?.name}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Feature Highlight */}
      <div
        className={cn(
          "rounded-3xl p-12 text-center border bg-gradient-to-br",
          scheme.bg,
          scheme.bgHover,
          scheme.from.replace("from-", "border-").replace("500", "100")
        )}
      >
        <div className="flex size-16 items-center justify-center rounded-full bg-white mx-auto mb-6 shadow-sm">
          <Sparkles className={cn("size-8", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
        </div>
        <h3 className="text-2xl font-light text-neutral-900 mb-3">
          AI-Powered Collection Curation
        </h3>
        <p className="text-neutral-600 font-light mb-6 max-w-md mx-auto">
          Create sophisticated data collections in minutes with our AI-assisted category
          suggestions and smart bundling recommendations
        </p>
        <Button
          onClick={() => router.push("/poc/1/dcm/create")}
          className={cn(
            "bg-gradient-to-r text-white rounded-full px-8 font-light shadow-lg hover:shadow-xl transition-all",
            scheme.from,
            scheme.to
          )}
        >
          <PlusCircle className="mr-2 size-4" strokeWidth={1.5} />
          Create Your First Collection
        </Button>
      </div>
    </>
  )
}

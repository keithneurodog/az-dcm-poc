"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import {
  FileText,
  CheckCircle2,
  Clock,
  Zap,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  Database,
  Sparkles,
  AlertCircle,
  Bell,
  Filter,
  Search,
} from "lucide-react"

// Mock requests data
const MOCK_REQUESTS = [
  {
    id: "req-123456",
    type: "simple",
    status: "partial_access",
    collectionName: "Oncology ctDNA Outcomes Collection",
    submittedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    totalDatasets: 16,
    instantAccess: 8,
    pendingApproval: 8,
    estimatedDays: "2-3",
    progress: 50,
    latestActivity: "8 datasets granted instant access",
  },
  {
    id: "prop-789012",
    type: "proposition",
    status: "under_review",
    propositionName: "Immunotherapy + ML Research Collection",
    parentCollection: "Immunotherapy Response Collection",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    estimatedDays: "3-5",
    progress: 30,
    latestActivity: "DCM review in progress",
    hasUnreadMessage: true,
  },
  {
    id: "req-234567",
    type: "simple",
    status: "completed",
    collectionName: "Cardiovascular Outcomes Studies",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7), // 7 days ago
    totalDatasets: 12,
    instantAccess: 12,
    pendingApproval: 0,
    progress: 100,
    latestActivity: "Full access granted",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
  },
  {
    id: "prop-345678",
    type: "proposition",
    status: "approved",
    propositionName: "Biomarker Discovery Extended Collection",
    parentCollection: "Lung Cancer Biomarker Studies",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), // 10 days ago
    progress: 100,
    latestActivity: "Proposition approved by DCM",
    completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
  },
  {
    id: "req-456789",
    type: "simple",
    status: "action_required",
    collectionName: "Neurology Clinical Trials",
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
    totalDatasets: 8,
    instantAccess: 4,
    pendingApproval: 4,
    estimatedDays: "1-2",
    progress: 50,
    latestActivity: "Additional information requested",
    hasActionRequired: true,
  },
]

const MOCK_ACTIVITY = [
  {
    id: 1,
    type: "access_granted",
    message: "8 datasets granted instant access",
    requestId: "req-123456",
    requestName: "Oncology ctDNA Outcomes Collection",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    isUnread: true,
  },
  {
    id: 2,
    type: "message",
    message: "DCM left a comment on your proposition",
    requestId: "prop-789012",
    requestName: "Immunotherapy + ML Research Collection",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isUnread: true,
  },
  {
    id: 3,
    type: "action_required",
    message: "Additional information requested",
    requestId: "req-456789",
    requestName: "Neurology Clinical Trials",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    isUnread: false,
  },
  {
    id: 4,
    type: "approved",
    message: "Proposition approved by DCM",
    requestId: "prop-345678",
    requestName: "Biomarker Discovery Extended Collection",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
    isUnread: false,
  },
]

export default function MyRequestsPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")
  const [filter, setFilter] = useState("all")

  const activeRequests = MOCK_REQUESTS.filter(r => r.status !== "completed" && r.status !== "approved")
  const completedRequests = MOCK_REQUESTS.filter(r => r.status === "completed" || r.status === "approved")
  const actionRequiredCount = MOCK_REQUESTS.filter(r => r.status === "action_required" || (r as any).hasUnreadMessage).length

  const filteredRequests = activeTab === "active" ? activeRequests :
    activeTab === "completed" ? completedRequests : MOCK_REQUESTS

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "partial_access":
        return { label: "Partial Access", color: "bg-amber-100 text-amber-700", icon: Clock }
      case "under_review":
        return { label: "Under Review", color: "bg-blue-100 text-blue-700", icon: Clock }
      case "completed":
        return { label: "Completed", color: "bg-green-100 text-green-700", icon: CheckCircle2 }
      case "approved":
        return { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle2 }
      case "action_required":
        return { label: "Action Required", color: "bg-red-100 text-red-700", icon: AlertCircle }
      default:
        return { label: status, color: "bg-neutral-100 text-neutral-700", icon: FileText }
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight mb-2">
            My Requests
          </h1>
          <p className="text-base font-light text-neutral-600">
            Track your data access requests and propositions
          </p>
        </div>
        <Button
          onClick={() => router.push("/collectoid/discover")}
          className={cn(
            "h-11 rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
            scheme.from,
            scheme.to
          )}
        >
          <Sparkles className="size-4 mr-2" />
          New Request
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active Requests", value: activeRequests.length, icon: Clock, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Action Required", value: actionRequiredCount, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Completed", value: completedRequests.length, icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
          { label: "Total Datasets", value: "36", icon: Database, color: "text-neutral-600", bg: "bg-neutral-50" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="border-neutral-200 rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={cn("flex size-10 items-center justify-center rounded-xl", stat.bg)}>
                    <Icon className={cn("size-5", stat.color)} />
                  </div>
                  <div>
                    <p className="text-2xl font-light text-neutral-900">{stat.value}</p>
                    <p className="text-xs font-light text-neutral-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Requests List - 2 columns */}
        <div className="col-span-2">
          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <div className="flex items-center justify-between">
              <TabsList className="bg-white border border-neutral-200 rounded-full p-1">
                <TabsTrigger
                  value="all"
                  className="rounded-full font-light data-[state=active]:bg-neutral-900 data-[state=active]:text-white"
                >
                  All ({MOCK_REQUESTS.length})
                </TabsTrigger>
                <TabsTrigger
                  value="active"
                  className="rounded-full font-light data-[state=active]:bg-neutral-900 data-[state=active]:text-white"
                >
                  Active ({activeRequests.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="rounded-full font-light data-[state=active]:bg-neutral-900 data-[state=active]:text-white"
                >
                  Completed ({completedRequests.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="space-y-4 mt-6">
              {filteredRequests.map((request) => {
                const statusBadge = getStatusBadge(request.status)
                const StatusIcon = statusBadge.icon
                const isProposition = request.type === "proposition"

                return (
                  <Card
                    key={request.id}
                    className={cn(
                      "border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer",
                      request.status === "action_required" && "border-red-200"
                    )}
                    onClick={() => router.push(`/collectoid/requests/${request.id}${isProposition ? "?type=proposition" : ""}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "flex size-10 items-center justify-center rounded-xl shrink-0",
                            isProposition
                              ? cn("bg-gradient-to-br", scheme.from, scheme.to)
                              : "bg-neutral-100"
                          )}>
                            {isProposition ? (
                              <Sparkles className="size-5 text-white" />
                            ) : (
                              <Database className="size-5 text-neutral-600" />
                            )}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="font-mono text-xs">
                                {request.id.toUpperCase()}
                              </Badge>
                              <Badge className={cn("font-light text-xs", statusBadge.color)}>
                                <StatusIcon className="size-3 mr-1" />
                                {statusBadge.label}
                              </Badge>
                              {(request as any).hasUnreadMessage && (
                                <Badge className="bg-red-500 text-white font-light text-xs">
                                  New Message
                                </Badge>
                              )}
                            </div>
                            <h3 className="text-base font-normal text-neutral-900">
                              {isProposition ? (request as any).propositionName : (request as any).collectionName}
                            </h3>
                            {isProposition && (
                              <p className="text-xs font-light text-neutral-500">
                                Based on {(request as any).parentCollection}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-light text-neutral-500">
                            {formatTimeAgo(request.submittedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-light text-neutral-500">
                            {request.progress === 100 ? "Completed" : "Progress"}
                          </span>
                          <span className="text-xs font-normal text-neutral-700">{request.progress}%</span>
                        </div>
                        <Progress
                          value={request.progress}
                          className={cn(
                            "h-2",
                            request.progress === 100 ? "bg-green-100" : "bg-neutral-100"
                          )}
                        />
                      </div>

                      {/* Details */}
                      {!isProposition && (request as any).totalDatasets && (
                        <div className="flex items-center gap-4 text-sm font-light text-neutral-600 mb-4">
                          {(request as any).instantAccess > 0 && (
                            <div className="flex items-center gap-1">
                              <Zap className="size-4 text-green-600" />
                              <span>{(request as any).instantAccess} instant</span>
                            </div>
                          )}
                          {(request as any).pendingApproval > 0 && (
                            <div className="flex items-center gap-1">
                              <Clock className="size-4 text-amber-600" />
                              <span>{(request as any).pendingApproval} pending</span>
                            </div>
                          )}
                          {(request as any).estimatedDays && (
                            <span className="text-neutral-400">
                              Est. {(request as any).estimatedDays} days
                            </span>
                          )}
                        </div>
                      )}

                      {/* Latest Activity */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <div className="flex items-center gap-2">
                          <Bell className="size-4 text-neutral-400" />
                          <span className="text-sm font-light text-neutral-600">
                            {request.latestActivity}
                          </span>
                        </div>
                        <ChevronRight className="size-4 text-neutral-400" />
                      </div>
                    </CardContent>
                  </Card>
                )
              })}

              {filteredRequests.length === 0 && (
                <div className="text-center py-12">
                  <div className="flex size-16 items-center justify-center rounded-full bg-neutral-100 mx-auto mb-4">
                    <FileText className="size-8 text-neutral-400" />
                  </div>
                  <h3 className="text-lg font-light text-neutral-900 mb-2">No requests found</h3>
                  <p className="text-sm font-light text-neutral-500 mb-6">
                    {activeTab === "active"
                      ? "You don't have any active requests"
                      : activeTab === "completed"
                      ? "You haven't completed any requests yet"
                      : "Start exploring to make your first request"}
                  </p>
                  <Button
                    onClick={() => router.push("/collectoid/discover")}
                    className={cn(
                      "rounded-xl font-light bg-gradient-to-r text-white",
                      scheme.from,
                      scheme.to
                    )}
                  >
                    <Sparkles className="size-4 mr-2" />
                    Discover Data
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Activity Feed - 1 column */}
        <div>
          <Card className="border-neutral-200 rounded-2xl sticky top-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-normal text-neutral-900">Recent Activity</h3>
                <Badge className="bg-red-100 text-red-700 font-light text-xs">
                  2 new
                </Badge>
              </div>

              <div className="space-y-4">
                {MOCK_ACTIVITY.map((activity) => {
                  const getActivityIcon = () => {
                    switch (activity.type) {
                      case "access_granted":
                        return { icon: Zap, color: "text-green-600", bg: "bg-green-100" }
                      case "message":
                        return { icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-100" }
                      case "action_required":
                        return { icon: AlertCircle, color: "text-red-600", bg: "bg-red-100" }
                      case "approved":
                        return { icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100" }
                      default:
                        return { icon: Bell, color: "text-neutral-600", bg: "bg-neutral-100" }
                    }
                  }

                  const activityStyle = getActivityIcon()
                  const Icon = activityStyle.icon

                  return (
                    <div
                      key={activity.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-xl transition-colors cursor-pointer",
                        activity.isUnread ? "bg-blue-50/50" : "hover:bg-neutral-50"
                      )}
                      onClick={() => router.push(`/collectoid/requests/${activity.requestId}`)}
                    >
                      <div className={cn(
                        "flex size-8 items-center justify-center rounded-lg shrink-0",
                        activityStyle.bg
                      )}>
                        <Icon className={cn("size-4", activityStyle.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-light text-neutral-900 mb-0.5">
                          {activity.message}
                        </p>
                        <p className="text-xs font-light text-neutral-500 truncate">
                          {activity.requestName}
                        </p>
                        <p className="text-xs font-light text-neutral-400 mt-1">
                          {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                      {activity.isUnread && (
                        <div className="size-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                      )}
                    </div>
                  )
                })}
              </div>

              <Button
                variant="ghost"
                className="w-full mt-4 font-light text-neutral-500"
              >
                View All Activity
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

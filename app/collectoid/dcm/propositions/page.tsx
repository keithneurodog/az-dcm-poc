"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import {
  FileText,
  CheckCircle2,
  Clock,
  Zap,
  MessageSquare,
  ChevronRight,
  Database,
  Sparkles,
  AlertCircle,
  Search,
  Users,
  GitMerge,
  ThumbsUp,
  Eye,
  ArrowUpRight,
  Filter,
  Calendar,
} from "lucide-react"

// Mock propositions data
const MOCK_PROPOSITIONS = [
  {
    id: "prop-001",
    type: "custom_collection",
    name: "Immunotherapy + ML Research Collection",
    parentCollection: "Immunotherapy Response Collection",
    requester: {
      name: "Dr. Sarah Chen",
      department: "Oncology Data Science",
      email: "sarah.chen@company.com",
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    status: "pending",
    priority: "high",
    changes: {
      datasetsAdded: 2,
      datasetsRemoved: 0,
      intentChanges: ["AI research / AI model training (added)"],
    },
    recommendation: "auto_approve",
    recommendationReason: "Minor changes, requester has good standing",
    estimatedReviewTime: "< 30 min",
    hasMessages: false,
  },
  {
    id: "prop-002",
    type: "modification",
    name: "Request to add publication rights",
    parentCollection: "Oncology ctDNA Outcomes Collection",
    requester: {
      name: "Dr. James Wilson",
      department: "Translational Medicine",
      email: "james.wilson@company.com",
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    status: "pending",
    priority: "medium",
    changes: {
      datasetsAdded: 0,
      datasetsRemoved: 0,
      intentChanges: ["External publication (added)"],
    },
    recommendation: "review",
    recommendationReason: "Publication rights require legal review",
    estimatedReviewTime: "1-2 hours",
    hasMessages: true,
    messageCount: 2,
  },
  {
    id: "prop-003",
    type: "custom_collection",
    name: "Cardiovascular + Imaging Fusion Collection",
    parentCollection: "Cardiovascular Outcomes Studies",
    requester: {
      name: "Dr. Emily Park",
      department: "Biostatistics",
      email: "emily.park@company.com",
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    status: "pending",
    priority: "low",
    changes: {
      datasetsAdded: 5,
      datasetsRemoved: 3,
      intentChanges: [],
    },
    recommendation: "merge",
    recommendationReason: "Similar to existing 'CV Imaging Studies' collection",
    mergeTarget: "CV Imaging Studies Collection",
    estimatedReviewTime: "30 min - 1 hour",
    hasMessages: false,
  },
  {
    id: "prop-004",
    type: "simple_access",
    name: "Access request for Neurology Clinical Trials",
    parentCollection: "Neurology Clinical Trials",
    requester: {
      name: "Dr. Michael Brown",
      department: "Neuroscience",
      email: "michael.brown@company.com",
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    status: "pending",
    priority: "high",
    changes: {
      datasetsAdded: 0,
      datasetsRemoved: 0,
      intentChanges: [],
    },
    recommendation: "auto_approve",
    recommendationReason: "Standard access, all intents match, user in allowed department",
    estimatedReviewTime: "< 15 min",
    hasMessages: false,
  },
  {
    id: "prop-005",
    type: "custom_collection",
    name: "Multi-Therapeutic Area Research Bundle",
    parentCollection: null,
    requester: {
      name: "Dr. Lisa Anderson",
      department: "Data Science Platform",
      email: "lisa.anderson@company.com",
    },
    submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    status: "in_review",
    priority: "medium",
    changes: {
      datasetsAdded: 12,
      datasetsRemoved: 0,
      intentChanges: ["AI research / AI model training", "Software development"],
    },
    recommendation: "review",
    recommendationReason: "Large collection with multiple use cases",
    estimatedReviewTime: "2-3 hours",
    hasMessages: true,
    messageCount: 5,
    assignedTo: "You",
  },
]

export default function DCMPropositionsPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  const pendingCount = MOCK_PROPOSITIONS.filter(p => p.status === "pending").length
  const inReviewCount = MOCK_PROPOSITIONS.filter(p => p.status === "in_review").length
  const autoApproveCount = MOCK_PROPOSITIONS.filter(p => p.recommendation === "auto_approve").length

  const filteredPropositions = MOCK_PROPOSITIONS.filter(p => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false
    if (priorityFilter !== "all" && p.priority !== priorityFilter) return false
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      return (
        p.name.toLowerCase().includes(query) ||
        p.requester.name.toLowerCase().includes(query) ||
        p.requester.department.toLowerCase().includes(query)
      )
    }
    return true
  })

  const getRecommendationBadge = (recommendation: string) => {
    switch (recommendation) {
      case "auto_approve":
        return { label: "Auto-Approve", color: "bg-green-100 text-green-700", icon: ThumbsUp }
      case "merge":
        return { label: "Suggest Merge", color: "bg-purple-100 text-purple-700", icon: GitMerge }
      case "review":
        return { label: "Needs Review", color: "bg-amber-100 text-amber-700", icon: Eye }
      default:
        return { label: recommendation, color: "bg-neutral-100 text-neutral-700", icon: FileText }
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return { label: "High", color: "bg-red-100 text-red-700" }
      case "medium":
        return { label: "Medium", color: "bg-amber-100 text-amber-700" }
      case "low":
        return { label: "Low", color: "bg-neutral-100 text-neutral-600" }
      default:
        return { label: priority, color: "bg-neutral-100 text-neutral-600" }
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
            User Propositions
          </h1>
          <p className="text-base font-light text-neutral-600">
            Review and process user requests and custom collection propositions
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pending Review", value: pendingCount, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "In Review", value: inReviewCount, icon: Eye, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Auto-Approve Ready", value: autoApproveCount, icon: ThumbsUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Avg Review Time", value: "45 min", icon: Calendar, color: "text-neutral-600", bg: "bg-neutral-50" },
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

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, requester, or department..."
            className="pl-12 h-11 rounded-xl border-neutral-200 font-light"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-11 rounded-xl border-neutral-200 font-light">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-light">All Status</SelectItem>
            <SelectItem value="pending" className="font-light">Pending</SelectItem>
            <SelectItem value="in_review" className="font-light">In Review</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40 h-11 rounded-xl border-neutral-200 font-light">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="font-light">All Priority</SelectItem>
            <SelectItem value="high" className="font-light">High</SelectItem>
            <SelectItem value="medium" className="font-light">Medium</SelectItem>
            <SelectItem value="low" className="font-light">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Auto-Approve Section */}
      {autoApproveCount > 0 && statusFilter === "all" && (
        <Card className="border-green-200 bg-green-50 rounded-2xl mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-green-100">
                  <Zap className="size-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-normal text-green-900">
                    {autoApproveCount} propositions ready for auto-approval
                  </p>
                  <p className="text-xs font-light text-green-700">
                    These meet all criteria for automatic approval
                  </p>
                </div>
              </div>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-light"
              >
                <ThumbsUp className="size-4 mr-2" />
                Auto-Approve All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Propositions List */}
      <div className="space-y-4">
        {filteredPropositions.map((proposition) => {
          const recBadge = getRecommendationBadge(proposition.recommendation)
          const RecIcon = recBadge.icon
          const priorityBadge = getPriorityBadge(proposition.priority)

          return (
            <Card
              key={proposition.id}
              className={cn(
                "border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer",
                proposition.status === "in_review" && "border-blue-200"
              )}
              onClick={() => router.push(`/collectoid/dcm/propositions/${proposition.id}/review`)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={cn(
                    "flex size-12 items-center justify-center rounded-xl shrink-0",
                    proposition.type === "custom_collection"
                      ? cn("bg-gradient-to-br", scheme.from, scheme.to)
                      : proposition.type === "modification"
                      ? "bg-amber-100"
                      : "bg-neutral-100"
                  )}>
                    {proposition.type === "custom_collection" ? (
                      <Sparkles className="size-6 text-white" />
                    ) : proposition.type === "modification" ? (
                      <FileText className="size-6 text-amber-600" />
                    ) : (
                      <Database className="size-6 text-neutral-600" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="font-mono text-xs">
                            {proposition.id.toUpperCase()}
                          </Badge>
                          <Badge className={cn("font-light text-xs", priorityBadge.color)}>
                            {priorityBadge.label}
                          </Badge>
                          {proposition.status === "in_review" && (
                            <Badge className="bg-blue-100 text-blue-700 font-light text-xs">
                              In Review
                            </Badge>
                          )}
                          {proposition.hasMessages && (
                            <Badge className="bg-red-100 text-red-700 font-light text-xs">
                              <MessageSquare className="size-3 mr-1" />
                              {(proposition as any).messageCount || 1}
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-base font-normal text-neutral-900 mb-1">
                          {proposition.name}
                        </h3>
                        {proposition.parentCollection && (
                          <p className="text-xs font-light text-neutral-500">
                            Based on {proposition.parentCollection}
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-light text-neutral-500">
                          {formatTimeAgo(proposition.submittedAt)}
                        </p>
                        {(proposition as any).assignedTo && (
                          <Badge variant="outline" className="mt-1 font-light text-xs">
                            Assigned: {(proposition as any).assignedTo}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Requester */}
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="size-4 text-neutral-400" />
                      <span className="text-sm font-light text-neutral-600">
                        {proposition.requester.name} • {proposition.requester.department}
                      </span>
                    </div>

                    {/* Changes Summary */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {proposition.changes.datasetsAdded > 0 && (
                        <Badge variant="outline" className="font-light text-xs border-green-200 text-green-700">
                          +{proposition.changes.datasetsAdded} datasets
                        </Badge>
                      )}
                      {proposition.changes.datasetsRemoved > 0 && (
                        <Badge variant="outline" className="font-light text-xs border-red-200 text-red-700">
                          -{proposition.changes.datasetsRemoved} datasets
                        </Badge>
                      )}
                      {proposition.changes.intentChanges.map((change, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="font-light text-xs border-amber-200 text-amber-700"
                        >
                          {change}
                        </Badge>
                      ))}
                    </div>

                    {/* Recommendation */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-3">
                        <Badge className={cn("font-light text-xs", recBadge.color)}>
                          <RecIcon className="size-3 mr-1" />
                          {recBadge.label}
                        </Badge>
                        <span className="text-xs font-light text-neutral-500">
                          {proposition.recommendationReason}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-light text-neutral-400">
                          Est. {proposition.estimatedReviewTime}
                        </span>
                        <ChevronRight className="size-4 text-neutral-400" />
                      </div>
                    </div>

                    {/* Merge suggestion */}
                    {proposition.recommendation === "merge" && (proposition as any).mergeTarget && (
                      <div className="mt-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
                        <div className="flex items-center gap-2">
                          <GitMerge className="size-4 text-purple-600" />
                          <span className="text-xs font-light text-purple-800">
                            Consider merging with <span className="font-normal">{(proposition as any).mergeTarget}</span>
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}

        {filteredPropositions.length === 0 && (
          <div className="text-center py-12">
            <div className="flex size-16 items-center justify-center rounded-full bg-neutral-100 mx-auto mb-4">
              <CheckCircle2 className="size-8 text-green-500" />
            </div>
            <h3 className="text-lg font-light text-neutral-900 mb-2">All caught up!</h3>
            <p className="text-sm font-light text-neutral-500">
              No propositions match your current filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

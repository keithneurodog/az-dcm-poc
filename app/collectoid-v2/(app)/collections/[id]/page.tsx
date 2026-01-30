"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Clock,
  Database,
  Target,
  Users,
  Shield,
  Lock,
  EyeOff,
  FileEdit,
  MessageSquare,
  Calendar,
  Send,
  ChevronRight,
  AlertCircle,
  Sparkles,
  Play,
} from "lucide-react"
import { Collection, getCollectionById, CURRENT_USER_ID } from "@/lib/dcm-mock-data"

// Mock discussion messages for draft collections
const MOCK_DISCUSSIONS = [
  {
    id: "1",
    author: "Sarah Chen",
    authorRole: "Data Scientist",
    content: "Should we include the Phase II data from the early trials? It might give us better baseline comparisons.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isOwner: false,
  },
  {
    id: "2",
    author: "You",
    authorRole: "Data Consumer Lead",
    content: "Good point - I'll look into adding those datasets. The early Phase II data has similar biomarker profiles.",
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    isOwner: true,
  },
]

// Mock timeline events
const MOCK_TIMELINE = [
  {
    id: "1",
    type: "created",
    description: "Collection created as concept",
    timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    icon: FileEdit,
  },
  {
    id: "2",
    type: "promoted",
    description: "Promoted to draft",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    icon: Play,
  },
  {
    id: "3",
    type: "updated",
    description: "3 datasets added",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    icon: Database,
  },
  {
    id: "4",
    type: "discussion",
    description: "New discussion started",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    icon: MessageSquare,
  },
]

export default function CollectionDetailPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const params = useParams()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    const id = params.id as string
    if (id) {
      const found = getCollectionById(id)
      if (found) {
        // If concept status and user is creator, redirect to workspace
        if (found.status === "concept" && found.creatorId === CURRENT_USER_ID) {
          // Load collection data into sessionStorage and redirect to workspace
          if (typeof window !== "undefined") {
            sessionStorage.setItem("dcm_collection_name", found.name)
            sessionStorage.setItem("dcm_collection_description", found.description)
            sessionStorage.setItem("dcm_collection_status", "concept")
            sessionStorage.setItem("dcm_collection_id", found.id)
            if (found.selectedDatasets) {
              sessionStorage.setItem("dcm_selected_datasets", JSON.stringify(found.selectedDatasets))
            }
          }
          router.replace("/collectoid-v2/dcm/create/workspace")
          return
        }
        setCollection(found)
      }
      setLoading(false)
    }
  }, [params.id, router])

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffHours < 1) return "Just now"
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getStatusBadge = (status: Collection["status"]) => {
    switch (status) {
      case "concept":
        return <Badge className="bg-purple-100 text-purple-700 border-0 font-light">Concept</Badge>
      case "draft":
        return <Badge className="bg-amber-100 text-amber-700 border-0 font-light">Draft</Badge>
      case "pending_approval":
        return <Badge className="bg-blue-100 text-blue-700 border-0 font-light">Pending Approval</Badge>
      case "provisioning":
        return <Badge className="bg-sky-100 text-sky-700 border-0 font-light">Provisioning</Badge>
      case "completed":
        return <Badge className="bg-green-100 text-green-700 border-0 font-light">Active</Badge>
      default:
        return <Badge className="bg-neutral-100 text-neutral-700 border-0 font-light">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <p className="text-neutral-500">Loading collection...</p>
      </div>
    )
  }

  if (!collection) {
    return (
      <div className="max-w-5xl mx-auto py-12 text-center">
        <p className="text-neutral-500 mb-4">Collection not found</p>
        <Button
          variant="outline"
          onClick={() => router.push("/collectoid-v2/collections")}
          className="rounded-xl font-light"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Collections
        </Button>
      </div>
    )
  }

  const isOwner = collection.creatorId === CURRENT_USER_ID
  const isDraft = collection.status === "draft"
  const showPrivateBanner = isDraft && isOwner

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/collectoid-v2/collections")}
          className="rounded-full font-light mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Collections
        </Button>
      </div>

      {/* Private Draft Banner */}
      {showPrivateBanner && (
        <div className={cn("rounded-xl border px-4 py-3 mb-6 flex items-center justify-between", scheme.bg, scheme.from.replace("from-", "border-").replace("500", "100"))}>
          <div className="flex items-center gap-3">
            <Lock className={cn("size-4", scheme.from.replace("from-", "text-"))} />
            <span className="text-sm font-light text-neutral-700">
              <span className="font-normal">Draft</span> — only visible to you and collaborators
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-light text-neutral-500">
            <span className="flex items-center gap-1">
              <EyeOff className="size-3" />
              Hidden from browse
            </span>
          </div>
        </div>
      )}

      {/* Collection Header Card */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden mb-6">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-light text-neutral-900">
                  {collection.name}
                </h1>
                {getStatusBadge(collection.status)}
              </div>
              <p className="text-sm font-light text-neutral-600 mb-4">
                {collection.description}
              </p>
              <div className="flex items-center gap-4 text-sm font-light text-neutral-500">
                <div className="flex items-center gap-1.5">
                  <Database className="size-4" />
                  <span>{collection.totalDatasets} datasets</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="size-4" />
                  <span>{collection.totalUsers} users</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="size-4" />
                  <span>Created {formatTimestamp(collection.createdAt)}</span>
                </div>
              </div>
            </div>
            {isOwner && isDraft && (
              <Button
                onClick={() => router.push("/collectoid-v2/dcm/create/review")}
                className={cn("rounded-xl font-light bg-gradient-to-r text-white", scheme.from, scheme.to)}
              >
                <Send className="size-4 mr-2" />
                Submit for Approval
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Quick Actions for Draft */}
          {isDraft && isOwner && (
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-5">
                <h3 className="text-base font-normal text-neutral-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => router.push("/collectoid-v2/collections?from=collection-detail")}
                    className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left"
                  >
                    <Database className="size-5 text-neutral-600" />
                    <div>
                      <p className="text-sm font-normal text-neutral-900">Add Datasets</p>
                      <p className="text-xs font-light text-neutral-500">Browse or search catalog</p>
                    </div>
                    <ChevronRight className="size-4 text-neutral-400 ml-auto" />
                  </button>
                  <button
                    onClick={() => router.push("/collectoid-v2/dcm/create/activities")}
                    className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left"
                  >
                    <Target className="size-5 text-neutral-600" />
                    <div>
                      <p className="text-sm font-normal text-neutral-900">Edit Activities</p>
                      <p className="text-xs font-light text-neutral-500">Define data usage</p>
                    </div>
                    <ChevronRight className="size-4 text-neutral-400 ml-auto" />
                  </button>
                  <button
                    onClick={() => router.push("/collectoid-v2/dcm/create/agreements")}
                    className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left"
                  >
                    <Shield className="size-5 text-neutral-600" />
                    <div>
                      <p className="text-sm font-normal text-neutral-900">Edit Terms</p>
                      <p className="text-xs font-light text-neutral-500">Usage permissions</p>
                    </div>
                    <ChevronRight className="size-4 text-neutral-400 ml-auto" />
                  </button>
                  <button
                    className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left"
                  >
                    <Users className="size-5 text-neutral-600" />
                    <div>
                      <p className="text-sm font-normal text-neutral-900">Manage Roles</p>
                      <p className="text-xs font-light text-neutral-500">Approvers & leads</p>
                    </div>
                    <ChevronRight className="size-4 text-neutral-400 ml-auto" />
                  </button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Discussions */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                  <h3 className="text-base font-normal text-neutral-900">Discussions</h3>
                  <Badge className="bg-neutral-100 text-neutral-600 border-0 font-light text-xs">
                    {MOCK_DISCUSSIONS.length}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 mb-4">
                {MOCK_DISCUSSIONS.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "p-4 rounded-xl",
                      message.isOwner ? "bg-neutral-50" : "bg-white border border-neutral-200"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "size-8 rounded-full flex items-center justify-center text-xs font-normal text-white",
                          message.isOwner ? "bg-gradient-to-br" : "bg-neutral-400",
                          message.isOwner && scheme.from,
                          message.isOwner && scheme.to
                        )}>
                          {message.author.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-normal text-neutral-900">{message.author}</p>
                          <p className="text-xs font-light text-neutral-500">{message.authorRole}</p>
                        </div>
                      </div>
                      <span className="text-xs font-light text-neutral-400">
                        {formatTimestamp(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm font-light text-neutral-700 ml-10">
                      {message.content}
                    </p>
                  </div>
                ))}
              </div>

              {/* New Comment */}
              <div className="pt-4 border-t border-neutral-100">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  rows={2}
                  className="border-neutral-200 rounded-xl font-light resize-none mb-3"
                />
                <div className="flex justify-end">
                  <Button
                    disabled={!newComment.trim()}
                    className={cn(
                      "rounded-xl font-light bg-gradient-to-r text-white",
                      scheme.from,
                      scheme.to,
                      !newComment.trim() && "opacity-50"
                    )}
                  >
                    <Send className="size-4 mr-2" />
                    Post Comment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datasets Preview */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Database className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                  <h3 className="text-base font-normal text-neutral-900">Datasets</h3>
                  <Badge className="bg-neutral-100 text-neutral-600 border-0 font-light text-xs">
                    {collection.totalDatasets}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="rounded-lg font-light text-neutral-500">
                  View All
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>

              {collection.selectedDatasets && collection.selectedDatasets.length > 0 ? (
                <div className="space-y-2">
                  {collection.selectedDatasets.slice(0, 3).map((dataset) => (
                    <div
                      key={dataset.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 transition-all"
                    >
                      <div>
                        <p className="text-sm font-normal text-neutral-900">{dataset.name}</p>
                        <p className="text-xs font-light text-neutral-500">{dataset.code}</p>
                      </div>
                      <Badge variant="outline" className="font-light text-xs">
                        {dataset.phase}
                      </Badge>
                    </div>
                  ))}
                  {collection.selectedDatasets.length > 3 && (
                    <p className="text-xs font-light text-neutral-500 text-center pt-2">
                      +{collection.selectedDatasets.length - 3} more datasets
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Database className="size-8 text-neutral-300 mx-auto mb-3" />
                  <p className="text-sm font-light text-neutral-500">No datasets added yet</p>
                  {isOwner && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push("/collectoid-v2/collections?from=collection-detail")}
                      className="mt-3 rounded-xl font-light"
                    >
                      <Sparkles className="size-4 mr-2" />
                      Find Datasets
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Timeline */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <Clock className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                <h3 className="text-base font-normal text-neutral-900">Activity</h3>
              </div>

              <div className="space-y-4">
                {MOCK_TIMELINE.map((event, index) => (
                  <div key={event.id} className="flex items-start gap-3">
                    <div className="relative">
                      <div className={cn(
                        "size-8 rounded-full flex items-center justify-center",
                        index === 0 ? "bg-gradient-to-br" : "bg-neutral-100",
                        index === 0 && scheme.from,
                        index === 0 && scheme.to
                      )}>
                        <event.icon className={cn("size-4", index === 0 ? "text-white" : "text-neutral-500")} />
                      </div>
                      {index < MOCK_TIMELINE.length - 1 && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-6 bg-neutral-200" />
                      )}
                    </div>
                    <div className="flex-1 pt-1">
                      <p className="text-sm font-light text-neutral-700">{event.description}</p>
                      <p className="text-xs font-light text-neutral-400">{formatTimestamp(event.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Readiness Check */}
          {isDraft && isOwner && (
            <Card className="border-amber-200 bg-amber-50 rounded-2xl overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <AlertCircle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-normal text-amber-900 mb-1">
                      Ready to submit?
                    </h3>
                    <p className="text-xs font-light text-amber-700 mb-3">
                      Review your collection and submit for approval when ready.
                    </p>
                    <Button
                      size="sm"
                      onClick={() => router.push("/collectoid-v2/dcm/create/review")}
                      className={cn("rounded-lg font-light bg-gradient-to-r text-white w-full", scheme.from, scheme.to)}
                    >
                      Review & Submit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Collection Info */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-5">
              <h3 className="text-base font-normal text-neutral-900 mb-4">Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-light text-neutral-500">Created by</span>
                  <span className="font-normal text-neutral-900">{collection.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-light text-neutral-500">Created</span>
                  <span className="font-normal text-neutral-900">{collection.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-light text-neutral-500">Therapeutic Areas</span>
                  <span className="font-normal text-neutral-900">{collection.therapeuticAreas.join(", ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-light text-neutral-500">Access Level</span>
                  <span className="font-normal text-neutral-900 capitalize">{collection.accessLevel}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

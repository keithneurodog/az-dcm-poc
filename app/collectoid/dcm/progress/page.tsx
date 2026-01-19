"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Collection, getCollectionById, User, getUsersByCollection, TEAM_CONTACTS, TeamContact } from "@/lib/dcm-mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  HelpCircle,
  Loader2,
  FileText,
  Download,
  Send,
  Users,
  Activity,
  TrendingUp,
  Mail,
  X,
  XCircle,
  Bell,
  MessageSquare,
  AlertCircle,
  Lightbulb,
  Info,
  Pin,
  Smile,
  BookOpen,
  Headphones,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Search,
  User as UserIcon,
  UserCheck,
  UserPlus,
  CheckSquare,
  Shield,
  Brain,
  Code,
  Globe,
  Lock,
  Zap,
} from "lucide-react"

// Mock AD email suggestions
const MOCK_AD_USERS = [
  { name: "Dr. Sarah Martinez", email: "sarah.martinez@astrazeneca.com", role: "GPT-Oncology Lead" },
  { name: "Jane Smith", email: "jane.smith@astrazeneca.com", role: "TALT-Legal" },
  { name: "Dr. Michael Chen", email: "michael.chen@astrazeneca.com", role: "Data Scientist" },
  { name: "Emily Rodriguez", email: "emily.rodriguez@astrazeneca.com", role: "Biostatistician" },
  { name: "Dr. David Kumar", email: "david.kumar@astrazeneca.com", role: "Oncology Research Lead" },
  { name: "Lisa Thompson", email: "lisa.thompson@astrazeneca.com", role: "Data Steward" },
]

// Mock discussion comments
interface Comment {
  id: string
  author: { name: string; role: string; isBot?: boolean }
  type: "update" | "question" | "blocker" | "suggestion"
  content: string
  timestamp: Date
  isPinned?: boolean
  reactions: { emoji: string; count: number; users: string[] }[]
  mentions: string[]
  isResolved?: boolean
  resolvedBy?: { name: string; role: string }
  resolvedAt?: Date
  resolutionComment?: string
}

const MOCK_COMMENTS: Comment[] = [
  {
    id: "c1",
    author: { name: "Dr. Sarah Martinez", role: "GPT-Oncology Lead" },
    type: "blocker",
    content: "We're seeing a delay on the approval for DCODE-156. The study protocol wasn't clear on secondary data use. @Jane Smith - can TALT expedite review?",
    timestamp: new Date("2025-11-11T11:45:00"),
    isPinned: true,
    reactions: [
      { emoji: "👍", count: 3, users: ["Jane Smith", "Lisa Thompson", "Jennifer Martinez"] },
    ],
    mentions: ["Jane Smith"],
  },
  {
    id: "c2",
    author: { name: "Jane Smith", role: "TALT-Legal" },
    type: "update",
    content: "Looping in our GDPR specialist. We should have clarity by EOD tomorrow. This affects 2 datasets in the collection.",
    timestamp: new Date("2025-11-11T12:10:00"),
    reactions: [
      { emoji: "🙏", count: 2, users: ["Dr. Sarah Martinez", "Jennifer Martinez"] },
    ],
    mentions: [],
  },
  {
    id: "c3",
    author: { name: "Lisa Thompson", role: "Data Steward" },
    type: "question",
    content: "Quick question on DCODE-299 - is this the ctDNA panel data or the liquid biopsy raw files? The location differs depending on which one we need.",
    timestamp: new Date("2025-11-11T13:20:00"),
    reactions: [],
    mentions: [],
  },
  {
    id: "c4",
    author: { name: "Jennifer Martinez", role: "Data Collection Manager" },
    type: "update",
    content: "It's the processed panel data (VAF calls + annotations). Raw files aren't needed for this collection. @Lisa Thompson",
    timestamp: new Date("2025-11-11T13:30:00"),
    reactions: [
      { emoji: "✅", count: 1, users: ["Lisa Thompson"] },
    ],
    mentions: ["Lisa Thompson"],
  },
  {
    id: "c5",
    author: { name: "Dr. Michael Chen", role: "Data Scientist" },
    type: "suggestion",
    content: "Should we add the PET imaging data (DCODE-203)? It's frequently bundled with these ctDNA studies and would enable multimodal analysis.",
    timestamp: new Date("2025-11-11T14:05:00"),
    reactions: [
      { emoji: "💡", count: 4, users: ["Jennifer Martinez", "Emily Rodriguez", "Dr. David Kumar", "Dr. Sarah Martinez"] },
    ],
    mentions: [],
  },
  {
    id: "c6",
    author: { name: "Jennifer Martinez", role: "Data Collection Manager" },
    type: "update",
    content: "Great suggestion @Dr. Michael Chen! I'll add DCODE-203 as an optional dataset. Users can request it separately if needed. This keeps the core collection focused while allowing expansion.",
    timestamp: new Date("2025-11-11T14:15:00"),
    reactions: [
      { emoji: "👍", count: 2, users: ["Dr. Michael Chen", "Emily Rodriguez"] },
    ],
    mentions: ["Dr. Michael Chen"],
  },
  {
    id: "c7",
    author: { name: "Collectoid", role: "Automated Assistant", isBot: true },
    type: "update",
    content: "I noticed DCODE-042 and DCODE-001 share 3 common data stewards who have previously approved similar ctDNA collections. Based on historical patterns, these approvals typically complete within 2-3 business days. I've flagged this collection as high-priority in the GPT-Oncology queue.",
    timestamp: new Date("2025-11-11T14:22:00"),
    reactions: [
      { emoji: "🤖", count: 3, users: ["Jennifer Martinez", "Dr. Sarah Martinez", "Jane Smith"] },
      { emoji: "👍", count: 2, users: ["Lisa Thompson", "Dr. Michael Chen"] },
    ],
    mentions: [],
  },
]

export default function DCMProgressDashboard() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<
    "overview" | "agreement" | "datasets" | "users" | "timeline" | "discussion"
  >("overview")

  // Discussion state
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS)
  const [newComment, setNewComment] = useState("")
  const [commentType, setCommentType] = useState<"update" | "question" | "blocker" | "suggestion">("update")
  const [showMentions, setShowMentions] = useState(false)
  const [commentFilter, setCommentFilter] = useState<"all" | "update" | "question" | "blocker" | "suggestion">("all")
  const [showResolved, setShowResolved] = useState(true)

  // Resolve blocker state
  const [resolvingCommentId, setResolvingCommentId] = useState<string | null>(null)
  const [resolutionComment, setResolutionComment] = useState("")

  // Collection data
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)

  // Dataset Status filters
  const [datasetSearchFilter, setDatasetSearchFilter] = useState("")
  const [datasetStatusFilter, setDatasetStatusFilter] = useState<"all" | "accessible" | "provisioning" | "pending">("all")

  // User Status filters
  const [userSearchFilter, setUserSearchFilter] = useState("")
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | "immediate" | "instant_grant" | "pending_approval" | "blocked_training">("all")
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set())
  const [userCurrentPage, setUserCurrentPage] = useState(1)
  const usersPerPage = 10

  // Send Update Modal State
  const [sendUpdateOpen, setSendUpdateOpen] = useState(false)
  const [emailInput, setEmailInput] = useState("")
  const [selectedEmails, setSelectedEmails] = useState<string[]>([])
  const [ccInput, setCcInput] = useState("")
  const [selectedCcEmails, setSelectedCcEmails] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showCcSuggestions, setShowCcSuggestions] = useState(false)
  const [fromEmail, setFromEmail] = useState("")
  const [emailSummary, setEmailSummary] = useState("")
  const [sending, setSending] = useState(false)
  const [sendSuccess, setSendSuccess] = useState(false)

  // Approval Modal State
  const [approvalModalOpen, setApprovalModalOpen] = useState(false)
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([])
  const [approvalComment, setApprovalComment] = useState("")
  const [processing, setProcessing] = useState(false)
  const [attemptedSubmit, setAttemptedSubmit] = useState(false)
  const [filterTeam, setFilterTeam] = useState<string>("all")
  const [filterTA, setFilterTA] = useState<string>("all")
  const [filterApprovalStatus, setFilterApprovalStatus] = useState<string>("pending")
  const [currentPage, setCurrentPage] = useState(1)
  const [expandedDatasetId, setExpandedDatasetId] = useState<string | null>(null)
  const itemsPerPage = 10

  // Provisioning Status - static values representing current state
  const provisioningProgress = {
    immutaPolicy: 78,
    gptOncologyAuth: 45,
    taltLegalAuth: 25,
  }
  const [completedTasks, setCompletedTasks] = useState<Array<{
    id: string
    label: string
    completedAt: Date
  }>>([])

  // Mock logged-in user
  const currentUser = {
    name: "Jennifer Martinez",
    email: "jennifer.martinez@astrazeneca.com",
    role: "Data Collection Manager",
    approvalTeam: "TALT-Legal" // Team this user can approve for
  }

  // Handle blocker resolution
  const handleResolveBlocker = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) =>
        c.id === commentId
          ? {
              ...c,
              isResolved: true,
              resolvedBy: { name: currentUser.name, role: currentUser.role },
              resolvedAt: new Date(),
              resolutionComment: resolutionComment || undefined,
            }
          : c
      )
    )
    setResolvingCommentId(null)
    setResolutionComment("")
  }

  // Load collection data
  useEffect(() => {
    if (typeof window !== "undefined") {
      const collectionId = sessionStorage.getItem("dcm_current_collection_id")
      if (collectionId) {
        const loadedCollection = getCollectionById(collectionId)
        if (loadedCollection) {
          setCollection(loadedCollection)
        } else {
          // Collection not found, redirect to dashboard
          router.push("/collectoid")
        }
      } else {
        // No collection ID, redirect to dashboard
        router.push("/collectoid")
      }
      setLoading(false)
    }
  }, [router])

  // Initialize completed tasks
  useEffect(() => {
    setCompletedTasks([
      { id: "published", label: "Collection published successfully", completedAt: new Date(Date.now() - 86400000 * 3) }, // 3 days ago
      { id: "users", label: "60 users granted immediate access", completedAt: new Date(Date.now() - 86400000 * 3) }, // 3 days ago
      { id: "training", label: "Training reminders sent to 12 users", completedAt: new Date(Date.now() - 86400000 * 2) }, // 2 days ago
    ])
  }, [])

  // Generate email summary
  const generateEmailSummary = () => {
    if (!collection) return ""

    const usersAfterInstantGrant = collection.accessBreakdown.immediate + collection.accessBreakdown.instantGrant
    const totalApprovalRequests = collection.approvalRequests.reduce((sum, req) => sum + req.count, 0)

    const summary = `Hi,

I wanted to share a progress update on the "${collection.name}" data collection:

COLLECTION OVERVIEW
• Created: ${collection.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at ${collection.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
• Datasets: ${collection.totalDatasets} datasets selected
• Target Users: ${collection.totalUsers} users

CURRENT STATUS (${collection.progress}% Complete)
• Immediate Access: ${collection.usersWithAccess} users (${Math.round((collection.usersWithAccess / collection.totalUsers) * 100)}%) can already access some datasets
${collection.status === "provisioning" ? `• In Progress: Immuta policy generation at ${collection.instantGrantProgress}% - ${usersAfterInstantGrant} users (${Math.round((usersAfterInstantGrant / collection.totalUsers) * 100)}%) will gain access within ~1 hour` : ""}
${totalApprovalRequests > 0 ? `• Pending Approvals: ${totalApprovalRequests} authorization requests sent to ${collection.approvalRequests.map(r => r.team).join(" and ")} (est. 2-5 business days)` : ""}
${collection.accessBreakdown.dataDiscovery > 0 ? `• Data Discovery: ${collection.accessBreakdown.dataDiscovery} dataset${collection.accessBreakdown.dataDiscovery > 1 ? 's' : ''} require${collection.accessBreakdown.dataDiscovery === 1 ? 's' : ''} location verification` : ""}

NEXT MILESTONES
${collection.milestones.filter(m => m.status !== "completed").map(m => `• ${m.estimatedTime ? m.estimatedTime.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "TBD"}: ${m.name}`).join("\n")}

Collectoid is handling the automation and will notify users as access is granted. You can view the full live status dashboard here: [Link to dashboard]

Best regards,
${currentUser.name}
${currentUser.role}
${currentUser.email}`
    return summary
  }

  // Handle opening send update modal
  const handleOpenSendUpdate = () => {
    setFromEmail(currentUser.email)
    setEmailSummary(generateEmailSummary())
    setSelectedEmails([
      "sarah.martinez@astrazeneca.com",
      "jane.smith@astrazeneca.com"
    ])
    setSelectedCcEmails([])
    setSendUpdateOpen(true)
    setSendSuccess(false)
  }

  // Filter email suggestions
  const filteredSuggestions = MOCK_AD_USERS.filter(
    (user) =>
      emailInput.length > 0 &&
      !selectedEmails.includes(user.email) &&
      (user.name.toLowerCase().includes(emailInput.toLowerCase()) ||
        user.email.toLowerCase().includes(emailInput.toLowerCase()) ||
        user.role.toLowerCase().includes(emailInput.toLowerCase()))
  )

  // Filter CC email suggestions
  const filteredCcSuggestions = MOCK_AD_USERS.filter(
    (user) =>
      ccInput.length > 0 &&
      !selectedCcEmails.includes(user.email) &&
      (user.name.toLowerCase().includes(ccInput.toLowerCase()) ||
        user.email.toLowerCase().includes(ccInput.toLowerCase()) ||
        user.role.toLowerCase().includes(ccInput.toLowerCase()))
  )

  // Add email to recipients
  const addEmail = (email: string) => {
    if (!selectedEmails.includes(email)) {
      setSelectedEmails([...selectedEmails, email])
    }
    setEmailInput("")
    setShowSuggestions(false)
  }

  // Remove email from recipients
  const removeEmail = (email: string) => {
    setSelectedEmails(selectedEmails.filter((e) => e !== email))
  }

  // Add CC email
  const addCcEmail = (email: string) => {
    if (!selectedCcEmails.includes(email)) {
      setSelectedCcEmails([...selectedCcEmails, email])
    }
    setCcInput("")
    setShowCcSuggestions(false)
  }

  // Remove CC email
  const removeCcEmail = (email: string) => {
    setSelectedCcEmails(selectedCcEmails.filter((e) => e !== email))
  }

  // Handle send
  const handleSend = async () => {
    setSending(true)
    // Simulate sending
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSending(false)
    setSendSuccess(true)
    // Close modal after success
    setTimeout(() => {
      setSendUpdateOpen(false)
      setSendSuccess(false)
    }, 2000)
  }

  // Loading state
  if (loading || !collection) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="size-8 animate-spin text-neutral-400" strokeWidth={1.5} />
      </div>
    )
  }

  const usersAfterInstantGrant = collection.accessBreakdown.immediate + collection.accessBreakdown.instantGrant

  // Calculate collection health
  const getCollectionHealth = () => {
    const unresolvedBlockers = comments.filter(c => c.type === "blocker" && !c.isResolved).length
    const progress = collection.progress
    const isDelayed = collection.status === "pending_approval"

    // Critical blockers = blocked
    if (unresolvedBlockers > 0) {
      return {
        status: "blocked" as const,
        score: 40,
        description: `${unresolvedBlockers} active ${unresolvedBlockers === 1 ? 'blocker' : 'blockers'} requiring attention`,
        color: "red"
      }
    }

    // Significant delays = at risk
    if (isDelayed || progress < 30) {
      return {
        status: "at_risk" as const,
        score: 65,
        description: "Approval delays detected, timeline may be extended",
        color: "amber"
      }
    }

    // Otherwise on track
    return {
      status: "on_track" as const,
      score: 85,
      description: "Provisioning progressing as expected",
      color: "green"
    }
  }

  const health = getCollectionHealth()

  // Generate smart recommendations
  const getSmartRecommendations = () => {
    const recommendations: Array<{
      type: "action_required" | "suggested" | "optimization" | "info"
      title: string
      description: string
      action?: { label: string; onClick: () => void }
    }> = []

    // Check for active blockers
    const unresolvedBlockers = comments.filter(c => c.type === "blocker" && !c.isResolved)
    if (unresolvedBlockers.length > 0) {
      recommendations.push({
        type: "action_required",
        title: "Critical blockers detected",
        description: `${unresolvedBlockers.length} ${unresolvedBlockers.length === 1 ? 'blocker requires' : 'blockers require'} immediate attention in Discussion tab`,
        action: {
          label: "View Blockers",
          onClick: () => {
            setActiveTab("discussion")
            setCommentFilter("blocker")
          }
        }
      })
    }

    // Check for approval delays
    const approvalCount = collection.approvalRequests.reduce((sum, req) => sum + req.count, 0)
    if (approvalCount > 0 && collection.status === "pending_approval") {
      recommendations.push({
        type: "suggested",
        title: "Approval delays detected",
        description: `${approvalCount} requests pending for 3+ days - consider follow-up`,
        action: {
          label: "Send Follow-Up",
          onClick: handleOpenSendUpdate
        }
      })
    }

    // Check for training gaps
    const trainingGap = collection.accessBreakdown.dataDiscovery
    if (trainingGap > 0) {
      recommendations.push({
        type: "suggested",
        title: "Training reminders needed",
        description: `${Math.round((collection.totalUsers * trainingGap) / 100)} users still need certification`,
        action: {
          label: "Send Reminder",
          onClick: handleOpenSendUpdate
        }
      })
    }

    // Optimization suggestions
    if (recommendations.length === 0) {
      recommendations.push({
        type: "optimization",
        title: "Collection progressing well",
        description: "No immediate actions required. Consider reviewing user feedback for improvements.",
      })
    }

    return recommendations.slice(0, 3) // Max 3 recommendations
  }

  const recommendations = getSmartRecommendations()

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/collectoid/collections")}
          className="rounded-full font-light mb-4"
        >
          <ArrowLeft className="size-4 mr-2" strokeWidth={1.5} />
          Back to Collections
        </Button>

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight">
                {collection.name}
              </h1>
              <Badge
                className={cn(
                  "font-light",
                  scheme.from.replace("from-", "bg-").replace("500", "100"),
                  scheme.from.replace("from-", "text-")
                )}
              >
                {collection.status === "provisioning" && "Provisioning"}
                {collection.status === "completed" && "Complete"}
                {collection.status === "pending_approval" && "Pending"}
              </Badge>

              {/* Health Score Badge */}
              <Badge
                className={cn(
                  "font-light text-base px-4 py-1.5",
                  health.status === "on_track" && "bg-green-100 text-green-800 border border-green-200",
                  health.status === "at_risk" && "bg-amber-100 text-amber-800 border border-amber-200",
                  health.status === "blocked" && "bg-red-100 text-red-800 border border-red-200"
                )}
              >
                {health.status === "on_track" && "On Track"}
                {health.status === "at_risk" && "At Risk"}
                {health.status === "blocked" && "Blocked"}
              </Badge>
            </div>
            <p className="text-sm font-light text-neutral-600 mb-2">
              {health.description}
            </p>
            <div className="flex items-center gap-4 text-sm font-light text-neutral-600">
              <span>Created: {collection.createdAt.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })} at {collection.createdAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              <span>•</span>
              <span>{collection.totalDatasets} datasets</span>
              <span>•</span>
              <span>{collection.totalUsers} target users</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full font-light">
              <Download className="size-4 mr-2" strokeWidth={1.5} />
              Export Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenSendUpdate}
              className="rounded-full font-light"
            >
              <Send className="size-4 mr-2" strokeWidth={1.5} />
              Send Update
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/collectoid/collections/${collection.id}/customize`)}
              className="rounded-full font-light"
            >
              <Sparkles className="size-4 mr-2" strokeWidth={1.5} />
              Create Derivation
            </Button>
            <Button
              size="sm"
              onClick={() => router.push(`/collectoid/collections/${collection.id}/request`)}
              className={cn(
                "rounded-full font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
                scheme.from,
                scheme.to
              )}
            >
              <Zap className="size-4 mr-2" strokeWidth={1.5} />
              Request Access
            </Button>
          </div>
        </div>

        {/* Health Score & Progress Bar */}
        <Card className="border-neutral-200 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6 mb-6">
              {/* Health Score */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <svg className="size-24" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke={
                          health.status === "on_track" ? "#22c55e" :
                          health.status === "at_risk" ? "#f59e0b" :
                          "#ef4444"
                        }
                        strokeWidth="8"
                        strokeDasharray={`${(health.score / 100) * 283} 283`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                        className="transition-all duration-500"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-light text-neutral-900">{health.score}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-1">
                      Collection Health
                    </p>
                    <p className={cn(
                      "text-lg font-normal",
                      health.status === "on_track" && "text-green-700",
                      health.status === "at_risk" && "text-amber-700",
                      health.status === "blocked" && "text-red-700"
                    )}>
                      {health.status === "on_track" && "On Track"}
                      {health.status === "at_risk" && "At Risk"}
                      {health.status === "blocked" && "Blocked"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-light text-neutral-700">Overall Progress</p>
                  <p className="text-sm font-normal text-neutral-900">{collection.progress}% Complete</p>
                </div>
            <div className="w-full bg-neutral-100 rounded-full h-4 mb-4">
              <div
                className={cn("h-4 rounded-full bg-gradient-to-r transition-all", scheme.from, scheme.to)}
                style={{ width: `${collection.progress}%` }}
              />
            </div>

                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-light text-neutral-900 mb-1">{collection.usersWithAccess}</p>
                    <p className="text-xs font-light text-neutral-600">Users with access</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-neutral-900 mb-1">{usersAfterInstantGrant}</p>
                    <p className="text-xs font-light text-neutral-600">Expected in ~1 hour</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-neutral-900 mb-1">{usersAfterInstantGrant}</p>
                    <p className="text-xs font-light text-neutral-600">After approvals (3-5 days)</p>
                  </div>
                  <div>
                    <p className="text-2xl font-light text-neutral-900 mb-1">{collection.totalUsers}</p>
                    <p className="text-xs font-light text-neutral-600">Final target (100%)</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Your Access Status - Personalized for End Users */}
        <Card className="border-neutral-200 rounded-2xl overflow-hidden mt-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCheck className={cn("size-5", scheme.from.replace("from-", "text-"))} />
              <h3 className="text-base font-normal text-neutral-900">Your Access Status</h3>
            </div>
            <p className="text-sm font-light text-neutral-600 mb-4">
              How you can access datasets in this collection
            </p>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-light text-neutral-700">Your access breakdown</span>
                <span className="text-sm font-normal text-neutral-900">
                  {collection.totalDatasets} datasets
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-neutral-100 rounded-full h-3 overflow-hidden">
                  <div className="flex h-full">
                    <div
                      className="bg-green-500 transition-all"
                      style={{ width: `${collection.accessBreakdown.immediate + collection.accessBreakdown.instantGrant}%` }}
                    />
                    <div
                      className="bg-amber-500 transition-all"
                      style={{ width: `${collection.accessBreakdown.pendingApproval}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm font-light mb-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-green-500" />
                <span className="text-neutral-700">⚡ {Math.round(collection.totalDatasets * (collection.accessBreakdown.immediate + collection.accessBreakdown.instantGrant) / 100)} datasets: Instant Access</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-amber-500" />
                <span className="text-neutral-700">⏳ {Math.round(collection.totalDatasets * collection.accessBreakdown.pendingApproval / 100)} datasets: Approval Required</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <Clock className="size-4 text-blue-600 shrink-0" />
              <span className="text-sm font-light text-blue-800">
                Estimated time to full access: <span className="font-normal">2-5 business days</span>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content with Sidebar */}
      <div className="flex gap-4 xl:gap-6">
        {/* Main Content Area */}
        <div className="flex-1 min-w-0">
      {/* Tabs */}
      <div className="flex gap-1 xl:gap-2 mb-6 flex-wrap">
        {(() => {
          const blockerCount = comments.filter((c) => c.type === "blocker" && !c.isResolved).length

          // Calculate pending approval count
          const pendingApprovalCount = collection.selectedDatasets.reduce(
            (sum, d) => sum + (d.approvalRequirements?.filter(r => r.status === 'pending').length || 0),
            0
          )

          const tabs = [
            { id: "overview", label: "Overview", icon: Activity },
            { id: "agreement", label: "Agreement of Terms", shortLabel: "AoT", icon: Shield },
            { id: "datasets", label: "Dataset Status", shortLabel: "Datasets", icon: FileText, badge: pendingApprovalCount > 0 ? pendingApprovalCount : undefined, badgeColor: "amber" },
            { id: "users", label: "User Status", shortLabel: "Users", icon: Users },
            { id: "timeline", label: "Timeline", icon: TrendingUp },
            { id: "discussion", label: "Discussion", icon: MessageSquare, badge: comments.length, blockerCount },
          ]

          return tabs.map((tab) => {
            const Icon = tab.icon
            const hasCritical = tab.id === "discussion" && tab.blockerCount && tab.blockerCount > 0
            const isApprovalBadge = tab.id === "datasets" && tab.badgeColor === "amber"

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "agreement" | "datasets" | "users" | "timeline" | "discussion")}
                title={tab.label}
                className={cn(
                  "flex items-center gap-1.5 xl:gap-2 px-3 xl:px-6 py-2.5 xl:py-3 rounded-xl border-2 font-light transition-all relative",
                  activeTab === tab.id
                    ? cn("border-current bg-gradient-to-r", scheme.bg, scheme.bgHover)
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                )}
              >
                <Icon className="size-4" />
                <span className="hidden xl:inline">{tab.label}</span>
                <span className="xl:hidden text-xs">{"shortLabel" in tab ? tab.shortLabel : tab.label}</span>
                {tab.badge && (
                  <Badge
                    className={cn(
                      "ml-0.5 xl:ml-1 rounded-full font-light text-xs",
                      hasCritical
                        ? cn("bg-gradient-to-r text-white border-0", scheme.from, scheme.to)
                        : isApprovalBadge
                        ? cn("bg-gradient-to-r text-white border-0", scheme.from, scheme.to)
                        : activeTab === tab.id
                        ? "bg-white/80 text-neutral-900"
                        : scheme.from.replace("from-", "bg-") + " text-white"
                    )}
                  >
                    <span className="hidden xl:inline">{hasCritical ? `${tab.blockerCount} Critical` : tab.badge}</span>
                    <span className="xl:hidden">{hasCritical ? tab.blockerCount : tab.badge}</span>
                  </Badge>
                )}
              </button>
            )
          })
        })()}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-in fade-in duration-300">
        {/* Smart Recommendations Panel */}
        {recommendations.length > 0 && (
          <Card className={cn(
            "border-2 rounded-2xl overflow-hidden",
            recommendations[0].type === "action_required" && "border-red-200 bg-red-50/30",
            recommendations[0].type === "suggested" && "border-amber-200 bg-amber-50/30",
            recommendations[0].type === "optimization" && cn("border-current", scheme.from.replace("from-", "border-").replace("500", "200"), scheme.bg.replace("500", "50"))
          )}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  "flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg",
                  scheme.from,
                  scheme.to
                )}>
                  <Sparkles className="size-6" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-normal text-neutral-900 mb-1">
                    Smart Recommendations
                  </h3>
                  <p className="text-sm font-light text-neutral-600">
                    AI-powered suggestions based on collection status
                  </p>
                </div>
              </div>

              {/* AI Summary */}
              <div className="mb-4 p-4 rounded-xl bg-white border border-neutral-200">
                <p className="text-sm font-light text-neutral-700 leading-relaxed">
                  {(() => {
                    const blockerCount = comments.filter((c) => c.type === "blocker" && !c.isResolved).length
                    const trainingBlockedUsers = getUsersByCollection(collection.id).filter(u => u.accessStatus === "blocked_training").length
                    const totalApprovals = collection.approvalRequests.reduce((sum, req) => sum + req.count, 0)
                    const usersWithAccess = collection.usersWithAccess
                    const totalUsers = collection.totalUsers
                    const progress = collection.progress

                    // Generate contextual summary
                    let summary = ""

                    if (collection.status === "completed") {
                      summary = `This collection has been fully provisioned with all ${totalUsers} users granted access. `
                      summary += `All approval workflows completed successfully. The collection is now in active use.`
                    } else if (collection.status === "provisioning") {
                      summary = `Your collection is ${progress}% complete with ${usersWithAccess} of ${totalUsers} users currently having access. `

                      if (blockerCount > 0) {
                        summary += `There ${blockerCount === 1 ? 'is' : 'are'} ${blockerCount} active blocker${blockerCount > 1 ? 's' : ''} requiring immediate attention. `
                      }

                      if (totalApprovals > 0) {
                        summary += `${totalApprovals} approval${totalApprovals > 1 ? 's are' : ' is'} pending from governance teams. `
                      }

                      if (trainingBlockedUsers > 0) {
                        summary += `${trainingBlockedUsers} user${trainingBlockedUsers > 1 ? 's are' : ' is'} blocked due to incomplete training. `
                      }

                      if (blockerCount === 0 && collection.instantGrantProgress > 0) {
                        summary += `Instant grant provisioning is progressing smoothly at ${collection.instantGrantProgress}% completion. `
                      }

                      if (blockerCount === 0 && totalApprovals === 0 && trainingBlockedUsers === 0) {
                        summary += `All critical path items are on track with no blockers identified.`
                      }
                    } else if (collection.status === "pending_approval") {
                      summary = `This collection is awaiting approval from governance teams before provisioning can begin. `
                      summary += `${totalApprovals} approval${totalApprovals > 1 ? 's are' : ' is'} currently pending. `
                      summary += `Expected review time is ${collection.approvalRequests[0]?.estimatedDays || '2-5 days'}.`
                    }

                    return summary
                  })()}
                </p>
              </div>

              <div className="space-y-3">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border",
                      rec.type === "action_required" && "bg-red-50 border-red-200",
                      rec.type === "suggested" && "bg-amber-50 border-amber-200",
                      rec.type === "optimization" && "bg-blue-50 border-blue-200",
                      rec.type === "info" && "bg-neutral-50 border-neutral-200"
                    )}
                  >
                    <div className="flex size-6 shrink-0 items-center justify-center rounded-full mt-0.5">
                      {rec.type === "action_required" && <AlertCircle className="size-5 text-red-600" strokeWidth={1.5} />}
                      {rec.type === "suggested" && <AlertCircle className="size-5 text-amber-600" strokeWidth={1.5} />}
                      {rec.type === "optimization" && <Lightbulb className="size-5 text-blue-600" strokeWidth={1.5} />}
                      {rec.type === "info" && <Info className="size-5 text-neutral-600" strokeWidth={1.5} />}
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm font-normal mb-1",
                        rec.type === "action_required" && "text-red-900",
                        rec.type === "suggested" && "text-amber-900",
                        rec.type === "optimization" && "text-blue-900",
                        rec.type === "info" && "text-neutral-900"
                      )}>
                        {rec.title}
                      </p>
                      <p className={cn(
                        "text-xs font-light",
                        rec.type === "action_required" && "text-red-700",
                        rec.type === "suggested" && "text-amber-700",
                        rec.type === "optimization" && "text-blue-700",
                        rec.type === "info" && "text-neutral-700"
                      )}>
                        {rec.description}
                      </p>
                    </div>
                    {rec.action && (
                      <Button
                        size="sm"
                        onClick={rec.action.onClick}
                        className={cn(
                          "h-8 rounded-lg font-light text-xs",
                          rec.type === "action_required" && "bg-red-600 hover:bg-red-700 text-white",
                          rec.type === "suggested" && "bg-amber-600 hover:bg-amber-700 text-white",
                          rec.type === "optimization" && cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                        )}
                      >
                        {rec.action.label}
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Provisioning Status */}
        <Card className={cn(
          "rounded-2xl overflow-hidden animate-in fade-in duration-500 border-2",
          scheme.from.replace("from-", "border-").replace("500", "200")
        )}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "flex size-10 items-center justify-center rounded-full",
                  scheme.bg
                )}>
                  <Zap className={cn("size-5", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-normal text-neutral-900">Provisioning Status</h3>
                  <p className="text-xs font-light text-neutral-500">Current progress across all workstreams</p>
                </div>
              </div>
              <button
                onClick={() => setActiveTab("timeline")}
                className={cn(
                  "flex items-center gap-1.5 text-sm font-light transition-colors",
                  scheme.from.replace("from-", "text-"),
                  "hover:opacity-70"
                )}
              >
                View Timeline
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* In Progress Tasks */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Loader2 className={cn("size-4 animate-spin", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
                <span className="text-sm font-normal text-neutral-700">In Progress</span>
              </div>
              <div className="space-y-4">
                {/* Immuta Policy Generation */}
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className={cn("size-4", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
                      <span className="text-sm font-normal text-neutral-900">Immuta Policy Generation</span>
                    </div>
                    <Badge className={cn("font-light text-xs bg-gradient-to-r text-white border-0", scheme.from, scheme.to)}>
                      {Math.round(provisioningProgress.immutaPolicy)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                    <div
                      className={cn("h-2 rounded-full transition-all duration-500 bg-gradient-to-r", scheme.from, scheme.to)}
                      style={{ width: `${provisioningProgress.immutaPolicy}%` }}
                    />
                  </div>
                  <p className="text-xs font-light text-neutral-500">Generating access policies for selected datasets...</p>
                </div>

                {/* GPT-Oncology Authorization */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Clock className="size-4 text-amber-600" strokeWidth={1.5} />
                      <span className="text-sm font-normal text-neutral-900">GPT-Oncology Authorization</span>
                    </div>
                    <Badge className="font-light text-xs bg-amber-100 text-amber-700 border-amber-200">
                      {Math.round(provisioningProgress.gptOncologyAuth)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-amber-100 rounded-full h-2 mb-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500 bg-amber-500"
                      style={{ width: `${provisioningProgress.gptOncologyAuth}%` }}
                    />
                  </div>
                  <p className="text-xs font-light text-amber-700">Awaiting approval from GPT-Oncology team (Est. 24-48 hrs)</p>
                </div>

                {/* TALT-Legal Review */}
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-blue-600" strokeWidth={1.5} />
                      <span className="text-sm font-normal text-neutral-900">TALT-Legal Review</span>
                    </div>
                    <Badge className="font-light text-xs bg-blue-100 text-blue-700 border-blue-200">
                      {Math.round(provisioningProgress.taltLegalAuth)}%
                    </Badge>
                  </div>
                  <div className="w-full bg-blue-100 rounded-full h-2 mb-2">
                    <div
                      className="h-2 rounded-full transition-all duration-500 bg-blue-500"
                      style={{ width: `${provisioningProgress.taltLegalAuth}%` }}
                    />
                  </div>
                  <p className="text-xs font-light text-blue-700">Legal compliance review in progress (Est. 2-3 days)</p>
                </div>
              </div>
            </div>

            {/* Completed Tasks */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="size-4 text-green-600" strokeWidth={1.5} />
                <span className="text-sm font-normal text-neutral-700">Completed</span>
              </div>
              <div className="space-y-2">
                {completedTasks.map((task, index) => {
                  const minutesAgo = Math.round((Date.now() - task.completedAt.getTime()) / 60000)
                  const timeLabel = minutesAgo < 1 ? "Just now" : `${minutesAgo}m ago`
                  return (
                    <div
                      key={task.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-100 animate-in slide-in-from-left duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CheckCircle2 className="size-4 text-green-600 shrink-0" strokeWidth={1.5} />
                      <span className="text-sm font-light text-green-900 flex-1">{task.label}</span>
                      <span className="text-xs font-light text-green-600">{timeLabel}</span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Pending Tasks */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="size-4 text-neutral-400" strokeWidth={1.5} />
                <span className="text-sm font-normal text-neutral-700">Pending</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                  <div className="size-4 rounded-full border-2 border-neutral-300 shrink-0" />
                  <span className="text-sm font-light text-neutral-600 flex-1">Final compliance sign-off</span>
                  <span className="text-xs font-light text-neutral-400">After legal review</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
                  <div className="size-4 rounded-full border-2 border-neutral-300 shrink-0" />
                  <span className="text-sm font-light text-neutral-600 flex-1">User access notification emails</span>
                  <span className="text-xs font-light text-neutral-400">After all approvals</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help & Guidance Panel */}
        <Card className="border-neutral-200 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-full",
                scheme.bg.replace("500", "100")
              )}>
                <Info className={cn("size-5", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-normal text-neutral-900">Need Help or Have Questions?</h3>
                <p className="text-sm font-light text-neutral-600">Resources and support for your collection</p>
              </div>
            </div>

            <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Status Meanings */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="size-4 text-green-600" strokeWidth={1.5} />
                      <h4 className="text-sm font-normal text-neutral-900">What Each Status Means</h4>
                    </div>
                    <div className="space-y-2 text-sm font-light text-neutral-700">
                      <div className="flex items-start gap-2">
                        <div className="size-2 rounded-full bg-green-500 shrink-0 mt-1.5" />
                        <div>
                          <span className="font-normal">Immediate Access:</span> Datasets already open, no restrictions
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        <div>
                          <span className="font-normal">Instant Grant:</span> Automated provisioning in progress (~1 hour)
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                        <div>
                          <span className="font-normal">Pending Approvals:</span> Requires GPT/TALT review (2-5 days)
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-2 rounded-full bg-neutral-400 shrink-0 mt-1.5" />
                        <div>
                          <span className="font-normal">Data Discovery:</span> Locating dataset in catalog
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                        <div>
                          <span className="font-normal">Missing Training:</span> Users need certification completion
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* When to Take Action */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="size-4 text-amber-600" strokeWidth={1.5} />
                      <h4 className="text-sm font-normal text-neutral-900">When to Take Action</h4>
                    </div>
                    <div className="space-y-2 text-sm font-light text-neutral-700">
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-neutral-400 shrink-0 mt-2" />
                        <p><span className="font-normal">Blockers in Discussion:</span> Address immediately to unblock progress</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-neutral-400 shrink-0 mt-2" />
                        <p><span className="font-normal">Approval Delays:</span> Follow up after 3 business days</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-neutral-400 shrink-0 mt-2" />
                        <p><span className="font-normal">Training Gaps:</span> Send reminders if users haven&apos;t enrolled in 1 week</p>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-neutral-400 shrink-0 mt-2" />
                        <p><span className="font-normal">Data Discovery Issues:</span> Contact data steward if unresolved after 48 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  {/* Contact Support */}
                  <div className="flex items-center gap-2 mb-3">
                    <Headphones className="size-4 text-blue-600" strokeWidth={1.5} />
                    <h4 className="text-sm font-normal text-neutral-900">Contact & Support</h4>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <a
                      href="mailto:collectoid-support@example.com"
                      className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all group"
                    >
                      <HelpCircle className="size-4 text-neutral-600 group-hover:text-neutral-900" strokeWidth={1.5} />
                      <div className="flex-1">
                        <p className="text-sm font-normal text-neutral-900">Collectoid Support</p>
                        <p className="text-xs font-light text-neutral-600">Technical issues</p>
                      </div>
                      <ExternalLink className="size-3 text-neutral-400" strokeWidth={1.5} />
                    </a>

                    <a
                      href="mailto:data-science-team@example.com"
                      className="flex items-center gap-3 p-3 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-300 hover:shadow-sm transition-all group"
                    >
                      <MessageSquare className="size-4 text-neutral-600 group-hover:text-neutral-900" strokeWidth={1.5} />
                      <div className="flex-1">
                        <p className="text-sm font-normal text-neutral-900">Data Science Team</p>
                        <p className="text-xs font-light text-neutral-600">Collection questions</p>
                      </div>
                      <ExternalLink className="size-3 text-neutral-400" strokeWidth={1.5} />
                    </a>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  {/* Common Questions */}
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                    <div className="flex gap-3">
                      <Info className="size-5 shrink-0 text-blue-600 mt-0.5" strokeWidth={1.5} />
                      <div className="flex-1">
                        <p className="text-sm font-normal text-blue-900 mb-2">Common Questions</p>
                        <div className="space-y-2 text-xs font-light text-blue-700">
                          <div>
                            <p className="font-normal">Q: How long do approvals typically take?</p>
                            <p>A: GPT reviews typically 2-3 days, TALT 3-5 days. You can follow up via discussion if urgent.</p>
                          </div>
                          <div>
                            <p className="font-normal">Q: Can I modify the collection after publishing?</p>
                            <p>A: Yes, from your DCM dashboard you can add/remove datasets and users at any time.</p>
                          </div>
                          <div>
                            <p className="font-normal">Q: What if a blocker isn&apos;t resolved in time?</p>
                            <p>A: Use the discussion tab to escalate. Tag relevant team members and mark as blocker.</p>
                          </div>
                          <div>
                            <p className="font-normal">Q: How do I check user training status?</p>
                            <p>A: View the Users tab for training completion breakdown and send reminders as needed.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          </CardContent>
        </Card>
        </div>
      )}

      {/* Agreement of Terms Tab */}
      {activeTab === "agreement" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {collection.agreementOfTerms ? (
            <>
              {/* AoT Header Card */}
              <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br",
                        scheme.from,
                        scheme.to
                      )}>
                        <Shield className="size-7 text-white" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-light text-neutral-900 mb-1">Agreement of Terms</h2>
                        <p className="text-sm font-light text-neutral-500">
                          Version {collection.agreementOfTerms.version} • Created {collection.agreementOfTerms.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-xl font-light"
                      >
                        <FileText className="size-4 mr-2" />
                        Export PDF
                      </Button>
                      <Button
                        size="sm"
                        className={cn(
                          "rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
                          scheme.from,
                          scheme.to
                        )}
                      >
                        <AlertCircle className="size-4 mr-2" />
                        Request Modification
                      </Button>
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 p-4 bg-neutral-50 rounded-xl">
                    <div>
                      <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-1">Created By</p>
                      <p className="text-sm font-normal text-neutral-900">{collection.agreementOfTerms.createdBy}</p>
                    </div>
                    <div>
                      <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-1">Effective Date</p>
                      <p className="text-sm font-normal text-neutral-900">
                        {collection.agreementOfTerms.effectiveDate?.toLocaleDateString() || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-1">Review Date</p>
                      <p className="text-sm font-normal text-neutral-900">
                        {collection.agreementOfTerms.reviewDate?.toLocaleDateString() || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-1">Target Users</p>
                      <p className="text-sm font-normal text-neutral-900">{collection.agreementOfTerms.userScope.totalUserCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Primary Use & Beyond Primary Use */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6">
                {/* Primary Use */}
                <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                        scheme.bg
                      )}>
                        <Shield className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                      </div>
                      <div>
                        <h3 className="text-lg font-normal text-neutral-900">Primary Use</h3>
                        <p className="text-xs text-neutral-500 font-light">IMI-Guided Protocol</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {[
                        { key: "understandDrugMechanism", label: "Understand how drugs work in the body", icon: Zap },
                        { key: "understandDisease", label: "Better understand disease and health problems", icon: BookOpen },
                        { key: "developDiagnosticTests", label: "Develop diagnostic tests for disease", icon: FileText },
                        { key: "learnFromPastStudies", label: "Learn from past studies to plan new studies", icon: Brain },
                        { key: "improveAnalysisMethods", label: "Improve scientific analysis methods", icon: Code },
                      ].map(({ key, label, icon: Icon }) => {
                        const isEnabled = collection.agreementOfTerms?.primaryUse[key as keyof typeof collection.agreementOfTerms.primaryUse]
                        return (
                          <div
                            key={key}
                            className={cn(
                              "flex items-center gap-3 p-3 rounded-xl border",
                              isEnabled
                                ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                                : "border-neutral-200 bg-neutral-50 opacity-60"
                            )}
                          >
                            {isEnabled ? (
                              <CheckCircle2 className={cn("size-4", scheme.from.replace("from-", "text-"))} />
                            ) : (
                              <X className="size-4 text-neutral-400" />
                            )}
                            <Icon className={cn(
                              "size-4",
                              isEnabled ? scheme.from.replace("from-", "text-") : "text-neutral-400"
                            )} />
                            <span className={cn(
                              "text-sm font-light",
                              isEnabled ? "text-neutral-700" : "text-neutral-500"
                            )}>
                              {label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Beyond Primary Use */}
                <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                        scheme.bg
                      )}>
                        <Zap className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                      </div>
                      <div>
                        <h3 className="text-lg font-normal text-neutral-900">Beyond Primary Use</h3>
                        <p className="text-xs text-neutral-500 font-light">Advanced capabilities</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {/* AI Research */}
                      <div
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border",
                          collection.agreementOfTerms.beyondPrimaryUse.aiResearch
                            ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                            : "border-neutral-200 bg-neutral-50 opacity-60"
                        )}
                      >
                        {collection.agreementOfTerms.beyondPrimaryUse.aiResearch ? (
                          <CheckCircle2 className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                        ) : (
                          <X className="size-5 text-neutral-400" />
                        )}
                        <Brain className={cn(
                          "size-5",
                          collection.agreementOfTerms.beyondPrimaryUse.aiResearch ? scheme.from.replace("from-", "text-") : "text-neutral-400"
                        )} />
                        <span className="font-light text-neutral-700">AI research / AI model training</span>
                      </div>

                      {/* Software Development */}
                      <div
                        className={cn(
                          "flex items-center gap-3 p-4 rounded-xl border",
                          collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment
                            ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                            : "border-neutral-200 bg-neutral-50 opacity-60"
                        )}
                      >
                        {collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment ? (
                          <CheckCircle2 className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                        ) : (
                          <X className="size-5 text-neutral-400" />
                        )}
                        <Code className={cn(
                          "size-5",
                          collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment ? scheme.from.replace("from-", "text-") : "text-neutral-400"
                        )} />
                        <span className="font-light text-neutral-700">Software development and testing</span>
                      </div>
                    </div>

                    {/* Publication Rights */}
                    <div className="mt-6 pt-6 border-t border-neutral-100">
                      <h4 className="text-sm font-normal text-neutral-900 mb-3 flex items-center gap-2">
                        <FileText className="size-4 text-neutral-500" />
                        Publication Rights
                      </h4>
                      <div className="space-y-2">
                        <div className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border",
                          collection.agreementOfTerms.publication.internalCompanyRestricted
                            ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                            : "border-neutral-200 bg-neutral-50 opacity-60"
                        )}>
                          {collection.agreementOfTerms.publication.internalCompanyRestricted ? (
                            <CheckCircle2 className={cn("size-4", scheme.from.replace("from-", "text-"))} />
                          ) : (
                            <X className="size-4 text-neutral-400" />
                          )}
                          <Lock className="size-4 text-neutral-500" />
                          <span className="text-sm font-light text-neutral-700">Internal company-restricted findings</span>
                        </div>
                        <div className={cn(
                          "flex items-center gap-3 p-3 rounded-xl border",
                          collection.agreementOfTerms.publication.externalPublication
                            ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                            : "border-neutral-200 bg-neutral-50 opacity-60"
                        )}>
                          {collection.agreementOfTerms.publication.externalPublication ? (
                            <CheckCircle2 className={cn("size-4", scheme.from.replace("from-", "text-"))} />
                          ) : (
                            <X className="size-4 text-neutral-400" />
                          )}
                          <Globe className="size-4 text-neutral-500" />
                          <span className="text-sm font-light text-neutral-700">
                            External publication
                            {collection.agreementOfTerms.publication.externalPublication === "by_exception" && (
                              <Badge variant="outline" className="ml-2 text-xs font-light">by exception</Badge>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* External Sharing */}
                    <div className="mt-6 pt-6 border-t border-neutral-100">
                      <h4 className="text-sm font-normal text-neutral-900 mb-3 flex items-center gap-2">
                        <Globe className="size-4 text-neutral-500" />
                        External Sharing
                      </h4>
                      <div className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border",
                        collection.agreementOfTerms.externalSharing.allowed
                          ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                          : "border-neutral-200 bg-neutral-50"
                      )}>
                        {collection.agreementOfTerms.externalSharing.allowed ? (
                          <CheckCircle2 className={cn("size-4", scheme.from.replace("from-", "text-"))} />
                        ) : (
                          <X className="size-4 text-neutral-400" />
                        )}
                        <span className="text-sm font-light text-neutral-700">
                          {collection.agreementOfTerms.externalSharing.allowed ? "External sharing allowed" : "External sharing not allowed"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Scope */}
              <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                        scheme.bg
                      )}>
                        <Users className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                      </div>
                      <div>
                        <h3 className="text-lg font-normal text-neutral-900">User Scope</h3>
                        <p className="text-xs text-neutral-500 font-light">{collection.agreementOfTerms.userScope.totalUserCount} target users</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("users")}
                      className={cn(
                        "rounded-xl font-light border-2 transition-all hover:shadow-md",
                        scheme.from.replace("from-", "border-"),
                        scheme.from.replace("from-", "text-"),
                        "hover:bg-gradient-to-r",
                        scheme.bg
                      )}
                    >
                      <Users className="size-4 mr-2" />
                      View All Users
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {collection.agreementOfTerms.userScope.byDepartment && collection.agreementOfTerms.userScope.byDepartment.length > 0 && (
                      <div className="p-4 bg-neutral-50 rounded-xl">
                        <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-2">Departments</p>
                        <div className="flex flex-wrap gap-1.5">
                          {collection.agreementOfTerms.userScope.byDepartment.map((dept) => (
                            <Badge key={dept} variant="outline" className="font-light text-xs">
                              {dept}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {collection.agreementOfTerms.userScope.byRole && collection.agreementOfTerms.userScope.byRole.length > 0 && (
                      <div className="p-4 bg-neutral-50 rounded-xl">
                        <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-2">Roles</p>
                        <div className="flex flex-wrap gap-1.5">
                          {collection.agreementOfTerms.userScope.byRole.map((role) => (
                            <Badge key={role} variant="outline" className="font-light text-xs">
                              {role}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="p-4 bg-neutral-50 rounded-xl">
                      <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-2">Total Users</p>
                      <p className="text-2xl font-light text-neutral-900">{collection.agreementOfTerms.userScope.totalUserCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Acknowledged Conflicts */}
              {collection.agreementOfTerms.acknowledgedConflicts && collection.agreementOfTerms.acknowledgedConflicts.length > 0 && (
                <Card className="border-2 border-amber-200 rounded-2xl overflow-hidden bg-amber-50/30">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-amber-100">
                        <AlertCircle className="size-5 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-normal text-amber-900">Acknowledged Conflicts</h3>
                        <p className="text-xs text-amber-700 font-light">
                          {collection.agreementOfTerms.acknowledgedConflicts.length} dataset conflict(s) acknowledged
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {collection.agreementOfTerms.acknowledgedConflicts.map((conflict, idx) => (
                        <div key={idx} className="p-4 bg-white rounded-xl border border-amber-200">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-sm font-normal text-neutral-900">{conflict.datasetName}</p>
                              <p className="text-xs font-light text-neutral-600 mt-1">{conflict.conflictDescription}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs font-light text-neutral-500">Acknowledged by</p>
                              <p className="text-xs font-normal text-neutral-700">{conflict.acknowledgedBy}</p>
                              <p className="text-xs font-light text-neutral-500">{conflict.acknowledgedAt.toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-12 text-center">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 mx-auto mb-4">
                  <Shield className="size-8 text-neutral-400" />
                </div>
                <h3 className="text-xl font-light text-neutral-900 mb-2">No Agreement of Terms</h3>
                <p className="text-sm font-light text-neutral-600 max-w-md mx-auto">
                  This collection does not have an Agreement of Terms defined. This may be because it was created before the AoT feature was available.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Dataset Status Tab */}
      {activeTab === "datasets" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {(() => {
            const datasetStatuses = collection.selectedDatasets.map((dataset) => {
              const alreadyOpen = dataset.accessBreakdown.alreadyOpen > 50
              const needsApproval = dataset.accessBreakdown.needsApproval > 30

              return {
                dataset,
                status: alreadyOpen
                  ? { status: "accessible", text: "Accessible", color: "green" }
                  : needsApproval
                  ? { status: "pending", text: "Pending Approval", color: "amber" }
                  : { status: "provisioning", text: "Provisioning", color: "blue" }
              }
            })

            // Calculate datasets requiring approval
            const datasetsRequiringApproval = collection.selectedDatasets.filter(d =>
              d.approvalRequirements?.some(r => r.status === 'pending')
            )

            const pendingApprovalCount = datasetsRequiringApproval.reduce(
              (sum, d) => sum + (d.approvalRequirements?.filter(r => r.status === 'pending').length || 0),
              0
            )

            // Calculate team breakdown for pending approvals
            const teamBreakdown = datasetsRequiringApproval.reduce((acc, dataset) => {
              dataset.approvalRequirements?.forEach(req => {
                if (req.status === 'pending') {
                  const existingTeam = acc.find(t => t.name === req.team)
                  if (existingTeam) {
                    existingTeam.count++
                  } else {
                    acc.push({ name: req.team, count: 1 })
                  }
                }
              })
              return acc
            }, [] as { name: string; count: number }[])

            const statusCounts = {
              accessible: datasetStatuses.filter(d => d.status.status === "accessible").length,
              provisioning: datasetStatuses.filter(d => d.status.status === "provisioning").length,
              pending: datasetStatuses.filter(d => d.status.status === "pending").length
            }

            const filteredDatasets = datasetStatuses.filter(({ dataset, status }) => {
              const matchesSearch = dataset.code.toLowerCase().includes(datasetSearchFilter.toLowerCase()) ||
                dataset.name.toLowerCase().includes(datasetSearchFilter.toLowerCase())
              const matchesStatus = datasetStatusFilter === "all" || status.status === datasetStatusFilter
              return matchesSearch && matchesStatus
            })

            return (
              <>
                {/* Approval Alert Panel */}
                {datasetsRequiringApproval.length > 0 && (
                  <Card className={cn("rounded-2xl shadow-md bg-gradient-to-r", scheme.from.replace("from-", "border-"), scheme.bg, scheme.bgHover)}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          <div className={cn("p-3 rounded-xl", scheme.from.replace("from-", "bg-").replace("500", "100"))}>
                            <AlertCircle className={cn("size-8", scheme.from.replace("from-", "text-").replace("500", "700"))} strokeWidth={1.5} />
                          </div>
                          <div>
                            <h3 className={cn("text-xl font-normal mb-1", scheme.from.replace("from-", "text-").replace("500", "900"))}>
                              {pendingApprovalCount} Approval{pendingApprovalCount !== 1 ? 's' : ''} Awaiting Decision
                            </h3>
                            <p className={cn("text-sm font-light mb-3", scheme.from.replace("from-", "text-").replace("500", "700"))}>
                              {datasetsRequiringApproval.length} dataset{datasetsRequiringApproval.length !== 1 ? 's' : ''} requiring approval from governance teams
                            </p>
                            {teamBreakdown.length > 0 && (
                              <div className={cn("flex gap-4 text-xs font-light", scheme.from.replace("from-", "text-").replace("500", "800"))}>
                                {teamBreakdown.map(team => (
                                  <span key={team.name}>
                                    {team.name}: {team.count}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          onClick={() => setApprovalModalOpen(true)}
                          className={cn("bg-gradient-to-r text-white rounded-full px-6", scheme.from, scheme.to)}
                        >
                          <CheckCircle2 className="size-4 mr-2" strokeWidth={1.5} />
                          Review Approvals
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                  <Card className="border-neutral-200 rounded-xl">
                    <CardContent className="p-4">
                      <p className="text-3xl font-light text-neutral-900 mb-1">{collection.totalDatasets}</p>
                      <p className="text-xs font-light text-neutral-600">Total Datasets</p>
                    </CardContent>
                  </Card>
                  <Card className="border-green-200 rounded-xl bg-green-50">
                    <CardContent className="p-4">
                      <p className="text-3xl font-light text-green-900 mb-1">{statusCounts.accessible}</p>
                      <p className="text-xs font-light text-green-700">Accessible Now</p>
                    </CardContent>
                  </Card>
                  <Card className="border-blue-200 rounded-xl bg-blue-50">
                    <CardContent className="p-4">
                      <p className="text-3xl font-light text-blue-900 mb-1">{statusCounts.provisioning}</p>
                      <p className="text-xs font-light text-blue-700">Provisioning</p>
                    </CardContent>
                  </Card>
                  <Card className="border-amber-200 rounded-xl bg-amber-50">
                    <CardContent className="p-4">
                      <p className="text-3xl font-light text-amber-900 mb-1">{statusCounts.pending}</p>
                      <p className="text-xs font-light text-amber-700">Pending Approval</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Filters */}
                <Card className="border-neutral-200 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex gap-3 items-center">
                      <Input
                        placeholder="Search by dataset code or name..."
                        value={datasetSearchFilter}
                        onChange={(e) => setDatasetSearchFilter(e.target.value)}
                        className="max-w-md border-neutral-200 rounded-xl font-light text-sm"
                      />
                      <div className="flex gap-2">
                        <Button
                          variant={datasetStatusFilter === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDatasetStatusFilter("all")}
                          className="rounded-full font-light text-xs"
                        >
                          All ({collection.totalDatasets})
                        </Button>
                        <Button
                          variant={datasetStatusFilter === "accessible" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDatasetStatusFilter("accessible")}
                          className="rounded-full font-light text-xs"
                        >
                          Accessible ({statusCounts.accessible})
                        </Button>
                        <Button
                          variant={datasetStatusFilter === "provisioning" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDatasetStatusFilter("provisioning")}
                          className="rounded-full font-light text-xs"
                        >
                          Provisioning ({statusCounts.provisioning})
                        </Button>
                        <Button
                          variant={datasetStatusFilter === "pending" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setDatasetStatusFilter("pending")}
                          className="rounded-full font-light text-xs"
                        >
                          Pending ({statusCounts.pending})
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Compact Dataset Table */}
                <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700 uppercase tracking-wider">
                            Dataset Code
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-normal text-neutral-700 uppercase tracking-wider">
                            Access %
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {filteredDatasets.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="px-4 py-8 text-center text-sm font-light text-neutral-500">
                              No datasets match your filters
                            </td>
                          </tr>
                        ) : (
                          filteredDatasets.map(({ dataset, status }) => {
                            const accessPercent = Math.round(
                              (dataset.accessBreakdown.alreadyOpen + dataset.accessBreakdown.readyToGrant) /
                              (dataset.accessBreakdown.alreadyOpen + dataset.accessBreakdown.readyToGrant + dataset.accessBreakdown.needsApproval) * 100
                            )
                            return (
                              <tr key={dataset.code} className="hover:bg-neutral-50 transition-colors">
                                <td className="px-4 py-3">
                                  <Badge variant="outline" className="font-light text-xs">
                                    {dataset.code}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-sm font-light text-neutral-900">
                                  {dataset.name}
                                </td>
                                <td className="px-4 py-3">
                                  <Badge
                                    className={cn(
                                      "font-light text-xs",
                                      status.color === "green" && "bg-green-100 text-green-800 border-green-200",
                                      status.color === "blue" && "bg-blue-100 text-blue-800 border-blue-200",
                                      status.color === "amber" && "bg-amber-100 text-amber-800 border-amber-200"
                                    )}
                                  >
                                    {status.text}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <div className="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                      <div
                                        className={cn(
                                          "h-full rounded-full",
                                          status.color === "green" && "bg-green-500",
                                          status.color === "blue" && "bg-blue-500",
                                          status.color === "amber" && "bg-amber-500"
                                        )}
                                        style={{ width: `${accessPercent}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-light text-neutral-600 w-10 text-right">
                                      {accessPercent}%
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            )
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </>
            )
          })()}
        </div>
      )}

      {/* User Status Tab */}
      {activeTab === "users" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {(() => {
            // Get all users for this collection
            const allUsers = getUsersByCollection(collection.id)

            // Calculate status counts
            const statusCounts = {
              total: allUsers.length,
              immediate: allUsers.filter(u => u.accessStatus === "immediate").length,
              instant_grant: allUsers.filter(u => u.accessStatus === "instant_grant").length,
              pending_approval: allUsers.filter(u => u.accessStatus === "pending_approval").length,
              blocked_training: allUsers.filter(u => u.accessStatus === "blocked_training").length,
            }

            // Calculate average days waiting
            const avgDaysWaiting = allUsers.length > 0
              ? Math.round(allUsers.reduce((sum, u) => sum + u.daysWaiting, 0) / allUsers.length)
              : 0

            // Filter users based on search and status
            const filteredUsers = allUsers.filter(user => {
              const matchesSearch =
                user.name.toLowerCase().includes(userSearchFilter.toLowerCase()) ||
                user.email.toLowerCase().includes(userSearchFilter.toLowerCase())
              const matchesStatus = userStatusFilter === "all" || user.accessStatus === userStatusFilter
              return matchesSearch && matchesStatus
            })

            // Pagination
            const totalUserPages = Math.ceil(filteredUsers.length / usersPerPage)
            const paginatedUsers = filteredUsers.slice(
              (userCurrentPage - 1) * usersPerPage,
              userCurrentPage * usersPerPage
            )

            // Helper function to get status info
            const getStatusInfo = (status: User["accessStatus"]) => {
              switch (status) {
                case "immediate":
                  return { text: "Immediate Access", color: "bg-green-50 text-green-700 border-green-200" }
                case "instant_grant":
                  return { text: "Instant Grant", color: "bg-blue-50 text-blue-700 border-blue-200" }
                case "pending_approval":
                  return { text: "Pending Approval", color: "bg-amber-50 text-amber-700 border-amber-200" }
                case "blocked_training":
                  return { text: "Training Blocked", color: "bg-red-50 text-red-700 border-red-200" }
              }
            }

            // Mock user groups for this collection
            const userGroups = [
              {
                id: "grp-1",
                name: "GPT-Oncology Research Team",
                userCount: 24,
                status: "active" as const,
                lead: "Dr. Sarah Martinez",
                email: "gpt-oncology@astrazeneca.com",
                teamsChannel: "GPT-Oncology-DataAccess",
                addedDate: new Date(Date.now() - 86400000 * 5),
              },
              {
                id: "grp-2",
                name: "Biostatistics Unit",
                userCount: 18,
                status: "active" as const,
                lead: "Emily Rodriguez",
                email: "biostat-team@astrazeneca.com",
                teamsChannel: "Biostat-Central",
                addedDate: new Date(Date.now() - 86400000 * 3),
              },
              {
                id: "grp-3",
                name: "TALT-Legal Reviewers",
                userCount: 6,
                status: "pending" as const,
                lead: "Jane Smith",
                email: "talt-legal@astrazeneca.com",
                teamsChannel: "TALT-Legal-Reviews",
                addedDate: new Date(Date.now() - 86400000 * 1),
              },
            ]

            return (
              <>
                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <Button
                    className={cn("rounded-xl font-light bg-gradient-to-r text-white border-0", scheme.from, scheme.to)}
                    onClick={() => {
                      // TODO: Open request users modification modal
                    }}
                  >
                    <UserPlus className="size-4 mr-2" strokeWidth={1.5} />
                    Request Users Modification
                  </Button>
                  <p className="text-xs font-light text-neutral-500">
                    Last updated: {new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Compact Stat Bar */}
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200">
                    <span className="text-sm font-normal text-neutral-900">{statusCounts.total}</span>
                    <span className="text-xs font-light text-neutral-500">Total</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 border border-green-200">
                    <span className="text-sm font-normal text-green-700">{statusCounts.immediate}</span>
                    <span className="text-xs font-light text-green-600">Immediate</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200">
                    <span className="text-sm font-normal text-blue-700">{statusCounts.instant_grant}</span>
                    <span className="text-xs font-light text-blue-600">In Progress</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200">
                    <span className="text-sm font-normal text-amber-700">{statusCounts.pending_approval}</span>
                    <span className="text-xs font-light text-amber-600">Pending</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-200">
                    <span className="text-sm font-normal text-red-700">{statusCounts.blocked_training}</span>
                    <span className="text-xs font-light text-red-600">Blocked</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-50 border border-neutral-200">
                    <Clock className="size-3.5 text-neutral-400" strokeWidth={1.5} />
                    <span className="text-sm font-normal text-neutral-700">{avgDaysWaiting}</span>
                    <span className="text-xs font-light text-neutral-500">Avg Wait</span>
                  </div>
                </div>

                {/* User Groups Panel */}
                <Card className="border-neutral-200 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Users className={cn("size-4", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
                        <h4 className="text-sm font-normal text-neutral-900">User Groups</h4>
                        <Badge className="bg-neutral-100 text-neutral-600 border-neutral-200 text-xs font-light">
                          {userGroups.length}
                        </Badge>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {userGroups.map((group) => (
                        <div
                          key={group.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 transition-colors"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={cn(
                              "flex size-8 items-center justify-center rounded-full shrink-0",
                              group.status === "active" ? "bg-green-100" : "bg-amber-100"
                            )}>
                              <Users className={cn(
                                "size-4",
                                group.status === "active" ? "text-green-600" : "text-amber-600"
                              )} strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-normal text-neutral-900 truncate">{group.name}</p>
                                <Badge className={cn(
                                  "text-xs font-light shrink-0",
                                  group.status === "active"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-amber-50 text-amber-700 border-amber-200"
                                )}>
                                  {group.status === "active" ? "Active" : "Pending"}
                                </Badge>
                              </div>
                              <p className="text-xs font-light text-neutral-500">{group.userCount} users</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 shrink-0">
                            <div className="text-right hidden sm:block">
                              <p className="text-xs font-normal text-neutral-700">{group.lead}</p>
                              <a
                                href={`mailto:${group.email}`}
                                className="text-xs font-light text-neutral-500 hover:text-neutral-700 transition-colors"
                              >
                                {group.email}
                              </a>
                            </div>
                            <div className="flex items-center gap-1">
                              <a
                                href={`mailto:${group.email}`}
                                className="p-1.5 rounded-lg hover:bg-neutral-200 transition-colors"
                                title="Email group"
                              >
                                <Mail className="size-4 text-neutral-400" strokeWidth={1.5} />
                              </a>
                              {group.teamsChannel && (
                                <a
                                  href={`https://teams.microsoft.com/l/team/${encodeURIComponent(group.teamsChannel)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 rounded-lg hover:bg-neutral-200 transition-colors"
                                  title="Open Teams channel"
                                >
                                  <MessageSquare className="size-4 text-neutral-400" strokeWidth={1.5} />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Filters */}
                <Card className="border-neutral-200 rounded-2xl">
                  <CardContent className="p-4">
                    <div className="flex gap-3 items-center flex-wrap">
                      <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" strokeWidth={1.5} />
                        <Input
                          placeholder="Search by name or email..."
                          value={userSearchFilter}
                          onChange={(e) => setUserSearchFilter(e.target.value)}
                          className="pl-9 border-neutral-200 rounded-xl font-light text-sm"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={userStatusFilter === "all" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUserStatusFilter("all")}
                          className="rounded-full font-light text-xs"
                        >
                          All ({statusCounts.total})
                        </Button>
                        <Button
                          variant={userStatusFilter === "immediate" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUserStatusFilter("immediate")}
                          className="rounded-full font-light text-xs"
                        >
                          Immediate ({statusCounts.immediate})
                        </Button>
                        <Button
                          variant={userStatusFilter === "instant_grant" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUserStatusFilter("instant_grant")}
                          className="rounded-full font-light text-xs"
                        >
                          In Progress ({statusCounts.instant_grant})
                        </Button>
                        <Button
                          variant={userStatusFilter === "pending_approval" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUserStatusFilter("pending_approval")}
                          className="rounded-full font-light text-xs"
                        >
                          Pending ({statusCounts.pending_approval})
                        </Button>
                        <Button
                          variant={userStatusFilter === "blocked_training" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setUserStatusFilter("blocked_training")}
                          className="rounded-full font-light text-xs"
                        >
                          Blocked ({statusCounts.blocked_training})
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* User Table */}
                <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-neutral-50 border-b border-neutral-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700 uppercase tracking-wider">
                            Manager
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-normal text-neutral-700 uppercase tracking-wider">
                            Training
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-normal text-neutral-700 uppercase tracking-wider">
                            Days Waiting
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {paginatedUsers.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-4 py-8 text-center text-sm font-light text-neutral-500">
                              No users match your filters
                            </td>
                          </tr>
                        ) : (
                          paginatedUsers.map((user) => (
                            <React.Fragment key={user.id}>
                              <tr
                                className="hover:bg-neutral-50 transition-colors cursor-pointer"
                                onClick={() => setExpandedUserId(expandedUserId === user.id ? null : user.id)}
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    {expandedUserId === user.id ? (
                                      <ChevronUp className="size-4 text-neutral-400" strokeWidth={1.5} />
                                    ) : (
                                      <ChevronDown className="size-4 text-neutral-400" strokeWidth={1.5} />
                                    )}
                                    <UserIcon className="size-4 text-neutral-400" strokeWidth={1.5} />
                                    <span className="text-sm font-light text-neutral-900">{user.name}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm font-light text-neutral-600">
                                  {user.email}
                                </td>
                                <td className="px-4 py-3 text-sm font-light text-neutral-600">
                                  {user.role}
                                </td>
                                <td className="px-4 py-3 text-sm font-light text-neutral-600">
                                  {user.manager?.name || "-"}
                                </td>
                                <td className="px-4 py-3">
                                  <Badge
                                    className={cn(
                                      "font-light text-xs",
                                      getStatusInfo(user.accessStatus).color
                                    )}
                                  >
                                    {getStatusInfo(user.accessStatus).text}
                                  </Badge>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <div className="w-20 h-2 bg-neutral-100 rounded-full overflow-hidden">
                                      <div
                                        className={cn(
                                          "h-full rounded-full",
                                          user.trainingStatus.completionPercent === 100 && "bg-green-500",
                                          user.trainingStatus.completionPercent > 0 && user.trainingStatus.completionPercent < 100 && "bg-blue-500",
                                          user.trainingStatus.completionPercent === 0 && "bg-red-500"
                                        )}
                                        style={{ width: `${user.trainingStatus.completionPercent}%` }}
                                      />
                                    </div>
                                    <span className="text-xs font-light text-neutral-600">
                                      {user.trainingStatus.completionPercent}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-right text-sm font-light text-neutral-600">
                                  {user.daysWaiting}
                                </td>
                              </tr>

                              {/* Expanded User Details */}
                              {expandedUserId === user.id && (
                                <tr key={`${user.id}-expanded`}>
                                  <td colSpan={7} className="px-4 py-4 bg-neutral-50">
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                        {/* Access Details */}
                                        <div className="space-y-2">
                                          <h4 className="text-sm font-normal text-neutral-900 flex items-center gap-2">
                                            <FileText className="size-4 text-neutral-600" strokeWidth={1.5} />
                                            Access Details
                                          </h4>
                                          <div className="text-xs font-light text-neutral-700 space-y-1">
                                            <p className="font-normal">
                                              Accessible Datasets:
                                              <button
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  // TODO: Open datasets modal
                                                }}
                                                className={cn("ml-2 font-light hover:underline", scheme.from.replace("from-", "text-"))}
                                              >
                                                see all
                                              </button>
                                            </p>
                                            {user.datasetsAccessible.length > 0 ? (
                                              user.datasetsAccessible.map(code => (
                                                <Badge key={code} variant="outline" className="mr-1 font-light text-xs">
                                                  {code}
                                                </Badge>
                                              ))
                                            ) : (
                                              <p className="text-neutral-500">None yet</p>
                                            )}

                                            <p className="font-normal mt-2">Pending Datasets:</p>
                                            {user.datasetsPending.length > 0 ? (
                                              user.datasetsPending.map(code => (
                                                <Badge key={code} variant="outline" className="mr-1 font-light text-xs bg-amber-50 border-amber-200">
                                                  {code}
                                                </Badge>
                                              ))
                                            ) : (
                                              <p className="text-neutral-500">None</p>
                                            )}

                                            {user.approvalRequests.length > 0 && (
                                              <>
                                                <p className="font-normal mt-2">Approval Status:</p>
                                                {user.approvalRequests.map((req, idx) => (
                                                  <p key={idx} className="text-neutral-600">
                                                    Sent to {req.team} {Math.floor((Date.now() - req.requestedDate.getTime()) / (1000 * 60 * 60 * 24))} days ago
                                                  </p>
                                                ))}
                                              </>
                                            )}
                                          </div>
                                        </div>

                                        {/* Training Details */}
                                        <div className="space-y-2">
                                          <h4 className="text-sm font-normal text-neutral-900 flex items-center gap-2">
                                            <BookOpen className="size-4 text-neutral-600" strokeWidth={1.5} />
                                            Training Details
                                          </h4>
                                          <div className="text-xs font-light text-neutral-700 space-y-2">
                                            {user.trainingStatus.completed.map(cert => (
                                              <div key={cert} className="flex items-center gap-2 text-green-700">
                                                <CheckCircle2 className="size-3" strokeWidth={1.5} />
                                                <span>{cert}</span>
                                              </div>
                                            ))}
                                            {user.trainingStatus.inProgress.map(item => (
                                              <div key={item.cert} className="flex items-center gap-2 text-blue-700">
                                                <Loader2 className="size-3 animate-spin" strokeWidth={1.5} />
                                                <span>{item.cert} ({item.progress}%)</span>
                                              </div>
                                            ))}
                                            {user.trainingStatus.missing.map(cert => (
                                              <div key={cert} className="flex items-center gap-2 text-red-700">
                                                <X className="size-3" strokeWidth={1.5} />
                                                <span>{cert} - Not Started</span>
                                              </div>
                                            ))}
                                            {user.trainingStatus.deadline && (
                                              <p className="text-neutral-600 mt-2">
                                                Deadline: {user.trainingStatus.deadline.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                              </p>
                                            )}
                                          </div>
                                        </div>

                                        {/* Timeline */}
                                        <div className="space-y-2">
                                          <h4 className="text-sm font-normal text-neutral-900 flex items-center gap-2">
                                            <Clock className="size-4 text-neutral-600" strokeWidth={1.5} />
                                            Timeline
                                          </h4>
                                          <div className="text-xs font-light text-neutral-700 space-y-1">
                                            <p>
                                              Enrolled: {user.enrollmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                            {user.lastActive && (
                                              <p>
                                                Last Active: {user.lastActive.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                              </p>
                                            )}
                                            {user.lastReminderSent && (
                                              <p>
                                                Reminder Sent: {user.lastReminderSent.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} ({user.reminderCount} total)
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Quick Actions */}
                                      <div className="flex gap-2 pt-2 border-t border-neutral-200">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="rounded-full font-light text-xs"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            // TODO: Implement email user
                                          }}
                                        >
                                          <Mail className="size-3 mr-1" strokeWidth={1.5} />
                                          Email User
                                        </Button>
                                        {user.trainingStatus.completionPercent < 100 && (
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="rounded-full font-light text-xs"
                                            onClick={(e) => {
                                              e.stopPropagation()
                                              // TODO: Implement send training reminder
                                            }}
                                          >
                                            <Send className="size-3 mr-1" strokeWidth={1.5} />
                                            Send Training Reminder
                                          </Button>
                                        )}
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          className="rounded-full font-light text-xs"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setActiveTab("discussion")
                                          }}
                                        >
                                          <MessageSquare className="size-3 mr-1" strokeWidth={1.5} />
                                          Escalate Issue
                                        </Button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Footer */}
                  {filteredUsers.length > 0 && (
                    <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                      <p className="text-xs font-light text-neutral-600">
                        Showing {((userCurrentPage - 1) * usersPerPage) + 1}-{Math.min(userCurrentPage * usersPerPage, filteredUsers.length)} of {filteredUsers.length} users
                      </p>
                      {totalUserPages > 1 && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserCurrentPage(1)}
                            disabled={userCurrentPage === 1}
                            className="rounded-lg font-light text-xs h-7 px-2"
                          >
                            <ChevronLeft className="size-3" strokeWidth={1.5} />
                            <ChevronLeft className="size-3 -ml-2" strokeWidth={1.5} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserCurrentPage(p => Math.max(1, p - 1))}
                            disabled={userCurrentPage === 1}
                            className="rounded-lg font-light text-xs h-7 px-2"
                          >
                            <ChevronLeft className="size-3" strokeWidth={1.5} />
                          </Button>
                          <div className="flex items-center gap-1 px-2">
                            {Array.from({ length: Math.min(5, totalUserPages) }, (_, i) => {
                              let pageNum: number
                              if (totalUserPages <= 5) {
                                pageNum = i + 1
                              } else if (userCurrentPage <= 3) {
                                pageNum = i + 1
                              } else if (userCurrentPage >= totalUserPages - 2) {
                                pageNum = totalUserPages - 4 + i
                              } else {
                                pageNum = userCurrentPage - 2 + i
                              }
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setUserCurrentPage(pageNum)}
                                  className={cn(
                                    "size-7 rounded-lg text-xs font-light transition-colors",
                                    userCurrentPage === pageNum
                                      ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                                      : "text-neutral-600 hover:bg-neutral-100"
                                  )}
                                >
                                  {pageNum}
                                </button>
                              )
                            })}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserCurrentPage(p => Math.min(totalUserPages, p + 1))}
                            disabled={userCurrentPage === totalUserPages}
                            className="rounded-lg font-light text-xs h-7 px-2"
                          >
                            <ChevronRight className="size-3" strokeWidth={1.5} />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUserCurrentPage(totalUserPages)}
                            disabled={userCurrentPage === totalUserPages}
                            className="rounded-lg font-light text-xs h-7 px-2"
                          >
                            <ChevronRight className="size-3" strokeWidth={1.5} />
                            <ChevronRight className="size-3 -ml-2" strokeWidth={1.5} />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              </>
            )
          })()}
        </div>
      )}

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* ETA Summary Panel */}
          {(() => {
            const completedMilestones = collection.milestones.filter(m => m.status === "completed").length
            const totalMilestones = collection.milestones.length
            const progressPercent = Math.round((completedMilestones / totalMilestones) * 100)

            // Calculate final ETA from last milestone
            const lastMilestone = collection.milestones[collection.milestones.length - 1]
            const finalEta = lastMilestone?.estimatedTime || lastMilestone?.timestamp || new Date(Date.now() + 86400000 * 7)
            const now = new Date()
            const daysRemaining = Math.max(0, Math.ceil((finalEta.getTime() - now.getTime()) / 86400000))

            // Calculate elapsed time from first milestone
            const firstMilestone = collection.milestones[0]
            const startDate = firstMilestone?.timestamp || new Date(Date.now() - 86400000 * 3)
            const daysElapsed = Math.ceil((now.getTime() - startDate.getTime()) / 86400000)

            // Check for blockers affecting ETA
            const unresolvedBlockers = comments.filter(c => c.type === "blocker" && !c.isResolved)
            const blockerDelayDays = unresolvedBlockers.length * 2 // Estimate 2 days per blocker
            const isDelayed = unresolvedBlockers.length > 0

            return (
              <Card className={cn(
                "rounded-2xl overflow-hidden border-2",
                isDelayed
                  ? "border-amber-200 bg-gradient-to-br from-amber-50 to-white"
                  : scheme.from.replace("from-", "border-").replace("500", "200")
              )}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-normal text-neutral-900">Estimated Completion</h3>
                        {isDelayed && (
                          <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs font-light">
                            Delayed
                          </Badge>
                        )}
                      </div>
                      <p className="text-3xl font-light text-neutral-900 mb-1">
                        {finalEta.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                      <p className={cn(
                        "text-sm font-light",
                        isDelayed ? "text-amber-600" : "text-neutral-500"
                      )}>
                        {daysRemaining} days remaining {isDelayed && `(+${blockerDelayDays} days due to blockers)`}
                      </p>

                      {/* Quick Stats */}
                      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-neutral-100">
                        <div>
                          <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">Elapsed</p>
                          <p className="text-sm font-normal text-neutral-900">{daysElapsed} days</p>
                        </div>
                        <div>
                          <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">Remaining</p>
                          <p className="text-sm font-normal text-neutral-900">{daysRemaining} days</p>
                        </div>
                        <div>
                          <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">Status</p>
                          <p className={cn(
                            "text-sm font-normal",
                            isDelayed ? "text-amber-600" : "text-green-600"
                          )}>
                            {isDelayed ? "At Risk" : "On Track"}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Ring */}
                    <div className="relative size-24">
                      <svg className="size-24 -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18" cy="18" r="15.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          className="text-neutral-100"
                        />
                        <circle
                          cx="18" cy="18" r="15.5"
                          fill="none"
                          stroke="url(#progressGradient)"
                          strokeWidth="2"
                          strokeDasharray={`${progressPercent} 100`}
                          strokeLinecap="round"
                        />
                        <defs>
                          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" className={scheme.from.replace("from-", "stop-color: ").replace("-500", "-500;")} style={{ stopColor: isDelayed ? '#f59e0b' : undefined }} />
                            <stop offset="100%" className={scheme.to.replace("to-", "stop-color: ").replace("-500", "-500;")} style={{ stopColor: isDelayed ? '#d97706' : undefined }} />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-normal text-neutral-900">{progressPercent}%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })()}

          {/* ETA Complexity Breakdown */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={cn("flex size-10 items-center justify-center rounded-full", scheme.bg)}>
                  <Brain className={cn("size-5", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="text-lg font-normal text-neutral-900">ETA Complexity Breakdown</h3>
                  <p className="text-xs font-light text-neutral-500">Factors affecting your timeline</p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Approval Teams Factor */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-3">
                    <Users className="size-5 text-neutral-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-normal text-neutral-900">Approval Teams Required</p>
                      <p className="text-xs font-light text-neutral-500">{collection.approvalRequests.length} teams need to review</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-normal", scheme.from.replace("from-", "text-"))}>+{collection.approvalRequests.length * 2} days</p>
                    <p className="text-xs font-light text-neutral-500">~2 days per team</p>
                  </div>
                </div>

                {/* Data Sensitivity Factor */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-3">
                    <Shield className="size-5 text-neutral-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-normal text-neutral-900">Data Sensitivity Level</p>
                      <p className="text-xs font-light text-neutral-500">High sensitivity requires extended review</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-normal", scheme.from.replace("from-", "text-"))}>+2 days</p>
                    <p className="text-xs font-light text-neutral-500">Legal buffer</p>
                  </div>
                </div>

                {/* User Volume Factor */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-3">
                    <UserCheck className="size-5 text-neutral-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-normal text-neutral-900">User Volume</p>
                      <p className="text-xs font-light text-neutral-500">{collection.totalUsers} users to provision</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-normal text-green-600">Standard</p>
                    <p className="text-xs font-light text-neutral-500">No additional time</p>
                  </div>
                </div>

                {/* Agreement Complexity */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                  <div className="flex items-center gap-3">
                    <FileText className="size-5 text-neutral-400" strokeWidth={1.5} />
                    <div>
                      <p className="text-sm font-normal text-neutral-900">Agreement Complexity</p>
                      <p className="text-xs font-light text-neutral-500">2 terms pending acceptance</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn("text-sm font-normal", scheme.from.replace("from-", "text-"))}>+1 day</p>
                    <p className="text-xs font-light text-neutral-500">Legal review</p>
                  </div>
                </div>

                {/* Historical Benchmark */}
                <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-neutral-50 to-neutral-100 border border-neutral-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <TrendingUp className="size-5 text-neutral-400" strokeWidth={1.5} />
                      <div>
                        <p className="text-sm font-normal text-neutral-900">Historical Benchmark</p>
                        <p className="text-xs font-light text-neutral-500">Based on similar collections</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-normal text-neutral-900">Avg: 8.2 days</p>
                      <p className="text-xs font-light text-green-600">You: On pace</p>
                    </div>
                  </div>

                  {/* Confidence Level */}
                  <div className="mt-3 pt-3 border-t border-neutral-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-light text-neutral-500">Estimate Confidence</span>
                      <span className="text-xs font-normal text-neutral-700">78%</span>
                    </div>
                    <div className="w-full bg-neutral-200 rounded-full h-1.5">
                      <div className={cn("h-1.5 rounded-full bg-gradient-to-r", scheme.from, scheme.to)} style={{ width: '78%' }} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Blocker Impact Panel */}
          {(() => {
            const unresolvedBlockers = comments.filter(c => c.type === "blocker" && !c.isResolved)
            const totalDelayDays = unresolvedBlockers.length * 2

            if (unresolvedBlockers.length === 0) return null

            return (
              <Card className="border-2 border-red-200 rounded-2xl overflow-hidden bg-gradient-to-br from-red-50 to-white">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
                        <AlertCircle className="size-5 text-red-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h3 className="text-lg font-normal text-neutral-900">Blocker Impact</h3>
                        <p className="text-xs font-light text-red-600">{unresolvedBlockers.length} active {unresolvedBlockers.length === 1 ? 'blocker' : 'blockers'} affecting timeline</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-light text-red-600">+{totalDelayDays} days</p>
                      <p className="text-xs font-light text-neutral-500">Total delay impact</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {unresolvedBlockers.map((blocker) => (
                      <div key={blocker.id} className="p-3 rounded-xl bg-white border border-red-100">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-normal text-neutral-900 truncate">{blocker.content.slice(0, 80)}...</p>
                            <p className="text-xs font-light text-neutral-500 mt-1">
                              Raised by {blocker.author.name} ({blocker.author.role})
                            </p>
                          </div>
                          <Badge className="bg-red-100 text-red-700 border-red-200 text-xs font-light shrink-0">
                            +2 days
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab("discussion")}
                    className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-100 text-red-700 text-sm font-light hover:bg-red-200 transition-colors"
                  >
                    <MessageSquare className="size-4" strokeWidth={1.5} />
                    View & Resolve Blockers
                  </button>
                </CardContent>
              </Card>
            )
          })()}

          {/* Provisioning Timeline */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-normal text-neutral-900 mb-4">Provisioning Timeline</h3>

              <div className="space-y-4 relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200" />

              {(() => {
                const unresolvedBlockers = comments.filter(c => c.type === "blocker" && !c.isResolved)
                const hasBlockers = unresolvedBlockers.length > 0

                return collection.milestones.map((milestone, index) => {
                  // Check if this milestone is affected by blockers (pending or in_progress milestones)
                  const isAffectedByBlocker = hasBlockers && (milestone.status === "pending" || milestone.status === "in_progress")

                  return (
                    <div key={index} className="flex gap-4 relative">
                      <div className="relative">
                        <div
                          className={cn(
                            "flex size-8 items-center justify-center rounded-full shrink-0 z-10",
                            milestone.status === "completed" && "bg-green-500 text-white",
                            milestone.status === "in_progress" &&
                              cn("bg-gradient-to-r text-white", scheme.from, scheme.to),
                            milestone.status === "pending" && "bg-neutral-200 text-neutral-600"
                          )}
                        >
                          {milestone.status === "completed" && <CheckCircle2 className="size-4" strokeWidth={1.5} />}
                          {milestone.status === "in_progress" && <Loader2 className="size-4 animate-spin" strokeWidth={1.5} />}
                          {milestone.status === "pending" && <Clock className="size-4" strokeWidth={1.5} />}
                        </div>
                        {/* Blocker Warning Indicator */}
                        {isAffectedByBlocker && (
                          <div className="absolute -top-1 -right-1 size-4 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center z-20">
                            <AlertCircle className="size-2.5 text-white" strokeWidth={2} />
                          </div>
                        )}
                      </div>
                      <div className={cn("flex-1", index < collection.milestones.length - 1 && "pb-4")}>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-normal text-neutral-900">
                            {milestone.timestamp
                              ? `${milestone.timestamp.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - ${milestone.name}`
                              : milestone.estimatedTime
                              ? `Est. ${milestone.estimatedTime.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - ${milestone.name}`
                              : milestone.name}
                          </p>
                          {isAffectedByBlocker && (
                            <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-xs font-light">
                              Blocked
                            </Badge>
                          )}
                        </div>
                        {/* Blocker Impact Notice */}
                        {isAffectedByBlocker && (
                          <div className="mb-2 p-2 rounded-lg bg-amber-50 border border-amber-100">
                            <p className="text-xs font-light text-amber-700">
                              +{unresolvedBlockers.length * 2} days delay due to {unresolvedBlockers.length} active {unresolvedBlockers.length === 1 ? 'blocker' : 'blockers'}
                            </p>
                          </div>
                        )}
                    {milestone.status === "completed" && (() => {
                      // Calculate duration if we have a timestamp
                      let durationText = "Completed successfully"
                      if (milestone.timestamp && index > 0 && collection.milestones[index - 1].timestamp) {
                        const prevTimestamp = collection.milestones[index - 1].timestamp!
                        const duration = milestone.timestamp.getTime() - prevTimestamp.getTime()
                        const minutes = Math.floor(duration / 60000)
                        const hours = Math.floor(duration / 3600000)
                        const days = Math.floor(duration / 86400000)

                        if (days > 0) {
                          durationText = `Completed in ${days} day${days > 1 ? 's' : ''}`
                        } else if (hours > 0) {
                          durationText = `Completed in ${hours} hour${hours > 1 ? 's' : ''}`
                        } else if (minutes > 0) {
                          durationText = `Completed in ${minutes} minute${minutes > 1 ? 's' : ''}`
                        } else {
                          durationText = "Completed instantly"
                        }
                      }

                      return <p className="text-xs font-light text-green-600">{durationText}</p>
                    })()}
                    {milestone.status === "in_progress" && (() => {
                      // Calculate progress details
                      let progressText = ""
                      let estimatedRemaining = ""

                      if (collection.status === "provisioning" && milestone.name.includes("Instant grant")) {
                        const usersExpected = milestone.name.match(/\((\d+) users/)?.[1] || milestone.name.match(/(\d+) users/)?.[1]
                        if (usersExpected) {
                          const usersProcessed = Math.floor((parseInt(usersExpected) * collection.instantGrantProgress) / 100)
                          progressText = `Processing policies: ${usersProcessed} of ${usersExpected} users (${collection.instantGrantProgress}% complete)`
                        } else {
                          progressText = `Immuta policy generation in progress (${collection.instantGrantProgress}% complete)`
                        }

                        // Estimate remaining time based on progress
                        if (milestone.estimatedTime) {
                          const now = new Date()
                          const remaining = milestone.estimatedTime.getTime() - now.getTime()
                          const minutes = Math.floor(remaining / 60000)
                          const hours = Math.floor(remaining / 3600000)

                          if (hours > 0) {
                            estimatedRemaining = `Est. ${hours} hour${hours > 1 ? 's' : ''} remaining`
                          } else if (minutes > 0) {
                            estimatedRemaining = `Est. ${minutes} minute${minutes > 1 ? 's' : ''} remaining`
                          } else {
                            estimatedRemaining = "Completing soon"
                          }
                        }
                      }

                      // Determine responsible team
                      let responsibleTeam: TeamContact | undefined
                      if (milestone.name.includes("Instant grant")) {
                        responsibleTeam = TEAM_CONTACTS.find(tc => tc.team === "Immuta Platform")
                      } else {
                        const teamMatch = milestone.name.match(/(GPT-[\w-]+|TALT-[\w-]+)/)
                        if (teamMatch) {
                          responsibleTeam = TEAM_CONTACTS.find(tc => tc.team === teamMatch[1])
                        }
                      }

                      return (
                        <>
                          {progressText && (
                            <p className="text-xs font-light text-blue-600 mb-0.5">{progressText}</p>
                          )}
                          {estimatedRemaining && (
                            <p className="text-xs font-light text-neutral-600">{estimatedRemaining}</p>
                          )}
                          {collection.status !== "completed" && responsibleTeam && (
                            <div className="mt-2 p-3 rounded-xl bg-blue-50 border border-blue-100">
                              <p className="text-xs font-normal text-blue-900 mb-1">Point of Contact</p>
                              <div className="text-xs font-light text-blue-700 space-y-0.5">
                                <p className="font-normal">{responsibleTeam.lead}</p>
                                <a
                                  href={`mailto:${responsibleTeam.email}`}
                                  className="flex items-center gap-1 hover:text-blue-900 transition-colors cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Mail className="size-3" strokeWidth={1.5} />
                                  {responsibleTeam.email}
                                </a>
                                {responsibleTeam.teamsChannel && (
                                  <a
                                    href={`https://teams.microsoft.com/l/team/${encodeURIComponent(responsibleTeam.teamsChannel)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-blue-900 transition-colors cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                    title={`Open in Microsoft Teams: ${responsibleTeam.teamsChannel}`}
                                  >
                                    <MessageSquare className="size-3" strokeWidth={1.5} />
                                    Teams: {responsibleTeam.teamsChannel}
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )
                    })()}
                    {milestone.status === "pending" && (() => {
                      // Calculate wait time and show estimated start
                      const waitTimeText = "Awaiting completion of previous steps"
                      let estimatedStart = ""

                      if (milestone.estimatedTime) {
                        const now = new Date()
                        const waiting = milestone.estimatedTime.getTime() - now.getTime()
                        const days = Math.floor(waiting / 86400000)
                        const hours = Math.floor(waiting / 3600000)
                        const minutes = Math.floor(waiting / 60000)

                        if (days > 0) {
                          estimatedStart = `Expected to start in ${days} day${days > 1 ? 's' : ''}`
                        } else if (hours > 0) {
                          estimatedStart = `Expected to start in ${hours} hour${hours > 1 ? 's' : ''}`
                        } else if (minutes > 0) {
                          estimatedStart = `Expected to start in ${minutes} minute${minutes > 1 ? 's' : ''}`
                        } else {
                          estimatedStart = "Expected to start soon"
                        }
                      }

                      // Determine responsible team for pending milestones
                      let responsibleTeam: TeamContact | undefined
                      if (milestone.name.includes("Instant grant")) {
                        responsibleTeam = TEAM_CONTACTS.find(tc => tc.team === "Immuta Platform")
                      } else {
                        const teamMatch = milestone.name.match(/(GPT-[\w-]+|TALT-[\w-]+)/)
                        if (teamMatch) {
                          responsibleTeam = TEAM_CONTACTS.find(tc => tc.team === teamMatch[1])
                        } else if (collection.approvalRequests.length > 0) {
                          responsibleTeam = TEAM_CONTACTS.find(tc => tc.team === collection.approvalRequests[0].team)
                        }
                      }

                      return (
                        <>
                          <p className="text-xs font-light text-neutral-600">{waitTimeText}</p>
                          {estimatedStart && (
                            <p className="text-xs font-light text-amber-600">{estimatedStart}</p>
                          )}
                          {collection.status !== "completed" && responsibleTeam && (
                            <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-100">
                              <p className="text-xs font-normal text-amber-900 mb-1">Point of Contact (when ready)</p>
                              <div className="text-xs font-light text-amber-700 space-y-0.5">
                                <p className="font-normal">{responsibleTeam.lead}</p>
                                <a
                                  href={`mailto:${responsibleTeam.email}`}
                                  className="flex items-center gap-1 hover:text-amber-900 transition-colors cursor-pointer"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Mail className="size-3" strokeWidth={1.5} />
                                  {responsibleTeam.email}
                                </a>
                                {responsibleTeam.teamsChannel && (
                                  <a
                                    href={`https://teams.microsoft.com/l/team/${encodeURIComponent(responsibleTeam.teamsChannel)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 hover:text-amber-900 transition-colors cursor-pointer"
                                    onClick={(e) => e.stopPropagation()}
                                    title={`Open in Microsoft Teams: ${responsibleTeam.teamsChannel}`}
                                  >
                                    <MessageSquare className="size-3" strokeWidth={1.5} />
                                    Teams: {responsibleTeam.teamsChannel}
                                  </a>
                                )}
                              </div>
                            </div>
                          )}
                        </>
                      )
                    })()}
                      </div>
                    </div>
                  )
                })
              })()}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Discussion Tab */}
      {activeTab === "discussion" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* New Comment Composer */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-normal text-neutral-900 mb-4">Add to Discussion</h3>

              {/* Comment Type Selector */}
              <div className="flex gap-2 mb-4">
                {[
                  { id: "update", label: "Update", icon: Info, color: "blue" },
                  { id: "question", label: "Question", icon: HelpCircle, color: "purple" },
                  { id: "blocker", label: "Blocker", icon: AlertCircle, color: "red" },
                  { id: "suggestion", label: "Suggestion", icon: Lightbulb, color: "amber" },
                ].map((type) => {
                  const TypeIcon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setCommentType(type.id as "update" | "question" | "blocker" | "suggestion")}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-light transition-all",
                        commentType === type.id
                          ? cn(
                              "border-current",
                              type.color === "blue" && "bg-blue-50 border-blue-200 text-blue-900",
                              type.color === "purple" && "bg-purple-50 border-purple-200 text-purple-900",
                              type.color === "red" && "bg-red-50 border-red-200 text-red-900",
                              type.color === "amber" && "bg-amber-50 border-amber-200 text-amber-900"
                            )
                          : "border-neutral-200 bg-white hover:border-neutral-300"
                      )}
                    >
                      <TypeIcon className="size-4" />
                      {type.label}
                    </button>
                  )
                })}
              </div>

              {/* Comment Input */}
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share an update, ask a question, flag a blocker, or suggest improvements... Use @ to mention team members."
                className="border-neutral-200 rounded-xl font-light min-h-[100px] mb-3"
              />

              <div className="flex items-center justify-between">
                <p className="text-xs font-light text-neutral-500">
                  Tip: Use @name to mention team members, reference datasets with DCODE-XXX
                </p>
                <Button
                  disabled={!newComment.trim()}
                  className={cn(
                    "rounded-xl font-light",
                    newComment.trim()
                      ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                      : "bg-neutral-200 text-neutral-400"
                  )}
                >
                  Post Comment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filter Controls */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-normal text-neutral-900">Filters</h3>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-sm font-light text-neutral-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showResolved}
                      onChange={(e) => setShowResolved(e.target.checked)}
                      className="rounded border-neutral-300"
                    />
                    Show resolved
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: "all", label: "All", count: comments.length },
                  { id: "blocker", label: "Blockers", count: comments.filter(c => c.type === "blocker" && !c.isResolved).length },
                  { id: "question", label: "Questions", count: comments.filter(c => c.type === "question").length },
                  { id: "update", label: "Updates", count: comments.filter(c => c.type === "update").length },
                  { id: "suggestion", label: "Suggestions", count: comments.filter(c => c.type === "suggestion").length },
                ].map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => setCommentFilter(filter.id as "all" | "update" | "question" | "blocker" | "suggestion")}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-sm font-light",
                      commentFilter === filter.id
                        ? cn("border-current bg-gradient-to-r text-white", scheme.from, scheme.to)
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    )}
                  >
                    {filter.label}
                    <Badge
                      variant="outline"
                      className={cn(
                        "font-light text-xs border-0",
                        commentFilter === filter.id
                          ? "bg-white/20 text-white"
                          : "bg-neutral-100 text-neutral-700"
                      )}
                    >
                      {filter.count}
                    </Badge>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Comments List */}
          <div className="space-y-4">
            {comments
              .filter(comment => {
                // Filter by type
                if (commentFilter !== "all" && comment.type !== commentFilter) return false
                // Filter resolved
                if (!showResolved && comment.isResolved) return false
                return true
              })
              .sort((a, b) => {
              // Pinned first
              if (a.isPinned && !b.isPinned) return -1
              if (!a.isPinned && b.isPinned) return 1
              // Then by timestamp
              return b.timestamp.getTime() - a.timestamp.getTime()
            }).map((comment) => {
              const commentTypeConfig = {
                update: { icon: Info, color: "bg-blue-100 text-blue-700 border-blue-200" },
                question: { icon: HelpCircle, color: "bg-purple-100 text-purple-700 border-purple-200" },
                blocker: { icon: AlertCircle, color: "bg-red-100 text-red-700 border-red-200" },
                suggestion: { icon: Lightbulb, color: "bg-amber-100 text-amber-700 border-amber-200" },
              }[comment.type]

              const CommentIcon = commentTypeConfig.icon

              return (
                <Card
                  key={comment.id}
                  className={cn(
                    "border-neutral-200 rounded-2xl overflow-hidden transition-all",
                    comment.isPinned && "border-2 border-amber-300 bg-amber-50/30",
                    comment.type === "blocker" && !comment.isResolved && "border-l-4 border-red-500 bg-red-50/50 shadow-lg",
                    comment.type === "blocker" && comment.isResolved && "border-l-4 border-green-500 bg-green-50/30",
                    comment.author.isBot && "border-l-4 border-violet-400 bg-gradient-to-r from-violet-50/50 to-transparent"
                  )}
                >
                  <CardContent className="p-6">
                    {/* Blocker Badge */}
                    {comment.type === "blocker" && !comment.isResolved && (
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-red-700">
                          <div className="size-2 rounded-full bg-red-500" />
                          <AlertCircle className="size-4" strokeWidth={1.5} />
                          <span className="text-xs font-normal">Requires Attention</span>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => setResolvingCommentId(comment.id)}
                          className={cn(
                            "h-7 rounded-lg font-light bg-gradient-to-r text-white",
                            scheme.from,
                            scheme.to
                          )}
                        >
                          <CheckCircle2 className="size-3 mr-1" strokeWidth={1.5} />
                          Resolve
                        </Button>
                      </div>
                    )}

                    {/* Resolved Badge */}
                    {comment.type === "blocker" && comment.isResolved && (
                      <div className="flex items-center gap-2 mb-3 text-green-700">
                        <CheckCircle2 className="size-4" strokeWidth={1.5} />
                        <span className="text-xs font-normal">
                          Resolved by {comment.resolvedBy?.name}
                        </span>
                        {comment.resolvedAt && (
                          <span className="text-xs font-light text-neutral-500">
                            • {comment.resolvedAt.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Pinned Badge */}
                    {comment.isPinned && (
                      <div className="flex items-center gap-2 mb-3 text-amber-700">
                        <Pin className="size-4 fill-amber-700" strokeWidth={1.5} />
                        <span className="text-xs font-normal">Pinned by collection owner</span>
                      </div>
                    )}

                    {/* Comment Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Avatar */}
                        {comment.author.isBot ? (
                          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shrink-0 ring-2 ring-violet-200">
                            <Sparkles className="size-5" />
                          </div>
                        ) : (
                          <div
                            className={cn(
                              "flex size-10 items-center justify-center rounded-full font-normal text-white shrink-0",
                              "bg-gradient-to-br",
                              scheme.from,
                              scheme.to
                            )}
                          >
                            {comment.author.name.split(" ").map(n => n[0]).join("")}
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-normal text-neutral-900">
                              {comment.author.name}
                            </h4>
                            {comment.author.isBot && (
                              <Badge className="bg-violet-100 text-violet-700 border-violet-200 font-light text-xs gap-1">
                                <Sparkles className="size-3" />
                                AI
                              </Badge>
                            )}
                            <Badge variant="outline" className="font-light text-xs">
                              {comment.author.role}
                            </Badge>
                            <Badge
                              className={cn("font-light text-xs border", commentTypeConfig.color)}
                            >
                              <CommentIcon className="size-3 mr-1" />
                              {comment.type}
                            </Badge>
                          </div>
                          <p className="text-xs font-light text-neutral-500">
                            {comment.timestamp.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Comment Content */}
                    <p className="text-sm font-light text-neutral-700 leading-relaxed mb-4 whitespace-pre-wrap">
                      {comment.content.split(/(@[\w\s.]+)/g).map((part, i) =>
                        part.startsWith("@") ? (
                          <span key={i} className={cn("font-normal", scheme.from.replace("from-", "text-"))}>
                            {part}
                          </span>
                        ) : (
                          part
                        )
                      )}
                    </p>

                    {/* Resolution Comment */}
                    {comment.isResolved && comment.resolutionComment && (
                      <div className="mb-4 p-3 rounded-xl bg-green-50 border border-green-100">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle2 className="size-4 text-green-600" strokeWidth={1.5} />
                          <span className="text-xs font-normal text-green-900">Resolution</span>
                        </div>
                        <p className="text-sm font-light text-green-800">
                          {comment.resolutionComment}
                        </p>
                      </div>
                    )}

                    {/* Reactions */}
                    {comment.reactions.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        {comment.reactions.map((reaction, i) => (
                          <button
                            key={i}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 transition-colors"
                          >
                            <span className="text-sm">{reaction.emoji}</span>
                            <span className="text-xs font-light text-neutral-700">
                              {reaction.count}
                            </span>
                          </button>
                        ))}
                        <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-neutral-200 hover:bg-neutral-50 transition-colors">
                          <Smile className="size-3 text-neutral-500" strokeWidth={1.5} />
                          <span className="text-xs font-light text-neutral-600">Add reaction</span>
                        </button>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-3 border-t border-neutral-100">
                      <button className="text-xs font-light text-neutral-600 hover:text-neutral-900 transition-colors">
                        Reply
                      </button>
                      {!comment.isPinned && (
                        <button className="text-xs font-light text-neutral-600 hover:text-neutral-900 transition-colors">
                          Pin
                        </button>
                      )}
                      <button className="text-xs font-light text-neutral-600 hover:text-neutral-900 transition-colors">
                        Share
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
        </div>
        {/* End Main Content Area */}

        {/* Quick Actions Sidebar - Hidden on smaller screens */}
        <div className="hidden xl:block w-72 shrink-0">
          <div className="sticky top-8 space-y-4">
            {/* Status Summary */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-normal text-neutral-900 mb-3">Quick Summary</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-light text-neutral-600">Progress</span>
                    <span className="font-normal text-neutral-900">{collection.progress}%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-light text-neutral-600">Users with Access</span>
                    <span className="font-normal text-neutral-900">{collection.usersWithAccess}/{collection.totalUsers}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-light text-neutral-600">Datasets</span>
                    <span className="font-normal text-neutral-900">{collection.totalDatasets}</span>
                  </div>
                  {collection.approvalRequests.length > 0 && (
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-light text-neutral-600">Pending Approvals</span>
                      <span className="font-normal text-amber-700">
                        {collection.approvalRequests.reduce((sum, req) => sum + req.count, 0)}
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Next Actions */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-normal text-neutral-900 mb-3">Next Actions</h3>
                <div className="space-y-2">
                  {(() => {
                    const actions = []
                    const blockerCount = comments.filter((c) => c.type === "blocker" && !c.isResolved).length
                    const trainingBlockedUsers = getUsersByCollection(collection.id).filter(u => u.accessStatus === "blocked_training").length

                    if (blockerCount > 0) {
                      actions.push({
                        label: `Resolve ${blockerCount} blocker${blockerCount > 1 ? 's' : ''}`,
                        action: () => setActiveTab("discussion"),
                        priority: "high"
                      })
                    }

                    if (collection.approvalRequests.length > 0) {
                      const totalApprovals = collection.approvalRequests.reduce((sum, req) => sum + req.count, 0)
                      actions.push({
                        label: `Follow up on ${totalApprovals} approval${totalApprovals > 1 ? 's' : ''}`,
                        action: () => setActiveTab("timeline"),
                        priority: "medium"
                      })
                    }

                    if (trainingBlockedUsers > 0) {
                      actions.push({
                        label: `Email ${trainingBlockedUsers} user${trainingBlockedUsers > 1 ? 's' : ''} pending training`,
                        action: () => setActiveTab("users"),
                        priority: "medium"
                      })
                    }

                    if (actions.length === 0) {
                      return (
                        <p className="text-xs font-light text-neutral-600 italic">
                          No urgent actions required
                        </p>
                      )
                    }

                    return actions.map((action, idx) => (
                      <button
                        key={idx}
                        onClick={action.action}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-xl text-xs font-light transition-all hover:scale-[1.02]",
                          action.priority === "high" && "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200",
                          action.priority === "medium" && "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                        )}
                      >
                        {action.label}
                      </button>
                    ))
                  })()}
                </div>
              </CardContent>
            </Card>

            {/* Contact Stakeholders */}
            {collection.approvalRequests.length > 0 && (
              <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <h3 className="text-sm font-normal text-neutral-900 mb-3">Contact Teams</h3>
                  <div className="space-y-2">
                    {collection.approvalRequests.map((request, idx) => {
                      const teamContact = TEAM_CONTACTS.find(tc => tc.team === request.team)
                      if (!teamContact) return null

                      return (
                        <div key={idx} className="space-y-1">
                          <p className="text-xs font-normal text-neutral-900">{request.team}</p>
                          <div className="space-y-1">
                            <a
                              href={`mailto:${teamContact.email}`}
                              className="flex items-center gap-1.5 text-xs font-light text-neutral-600 hover:text-neutral-900 transition-colors"
                            >
                              <Mail className="size-3" strokeWidth={1.5} />
                              Email {teamContact.lead.split(' ')[0]}
                            </a>
                            {teamContact.teamsChannel && (
                              <a
                                href={`https://teams.microsoft.com/l/team/${encodeURIComponent(teamContact.teamsChannel)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs font-light text-neutral-600 hover:text-neutral-900 transition-colors"
                              >
                                <MessageSquare className="size-3" strokeWidth={1.5} />
                                Open Teams
                              </a>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Links */}
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-4">
                <h3 className="text-sm font-normal text-neutral-900 mb-3">Quick Links</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab("datasets")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-light text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
                  >
                    <FileText className="size-3" strokeWidth={1.5} />
                    View Dataset Status
                  </button>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-light text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
                  >
                    <Users className="size-3" strokeWidth={1.5} />
                    View User Status
                  </button>
                  <button
                    onClick={() => setActiveTab("timeline")}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-light text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
                  >
                    <TrendingUp className="size-3" strokeWidth={1.5} />
                    View Timeline
                  </button>
                  <button
                    onClick={() => setSendUpdateOpen(true)}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-light text-neutral-700 hover:bg-neutral-50 transition-colors flex items-center gap-2"
                  >
                    <Send className="size-3" strokeWidth={1.5} />
                    Send Update
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {/* End Quick Actions Sidebar */}
      </div>
      {/* End Main Content with Sidebar */}

      {/* Resolve Blocker Dialog */}
      <Dialog open={resolvingCommentId !== null} onOpenChange={(open) => !open && setResolvingCommentId(null)}>
        <DialogContent className="max-w-2xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extralight tracking-tight">
              Resolve Blocker
            </DialogTitle>
            <DialogDescription className="text-sm font-light text-neutral-600">
              Mark this blocker as resolved. Optionally add a resolution comment.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-light text-neutral-700 mb-2">
                Resolution Comment (Optional)
              </label>
              <Textarea
                value={resolutionComment}
                onChange={(e) => setResolutionComment(e.target.value)}
                placeholder="Explain how this blocker was resolved..."
                className="border-neutral-200 rounded-xl font-light min-h-[120px]"
              />
              <p className="text-xs font-light text-neutral-500 mt-2">
                Leave empty to resolve without a comment
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setResolvingCommentId(null)
                setResolutionComment("")
              }}
              className="rounded-xl font-light border-neutral-200"
            >
              Cancel
            </Button>
            <Button
              onClick={() => resolvingCommentId && handleResolveBlocker(resolvingCommentId)}
              className={cn(
                "rounded-xl font-light bg-gradient-to-r text-white",
                scheme.from,
                scheme.to
              )}
            >
              <CheckCircle2 className="size-4 mr-2" strokeWidth={1.5} />
              Resolve Blocker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Update Modal */}
      <Dialog open={sendUpdateOpen} onOpenChange={setSendUpdateOpen}>
        <DialogContent className="!max-w-5xl rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extralight tracking-tight">
              Send Progress Update
            </DialogTitle>
            <DialogDescription className="text-sm font-light text-neutral-600">
              Share collection provisioning status with stakeholders
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Email Recipients */}
            <div>
              <label className="block text-sm font-light text-neutral-700 mb-2">
                To: Recipients
              </label>

              {/* Selected Email Chips */}
              {selectedEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200"
                    >
                      <span className="text-sm font-light text-neutral-900">{email}</span>
                      <button
                        onClick={() => removeEmail(email)}
                        className="hover:bg-neutral-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="size-3 text-neutral-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Email Input with AD Suggestions */}
              <div className="relative">
                <Input
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Search by name, email, or role..."
                  className="border-neutral-200 rounded-xl font-light"
                />

                {/* AD Suggestions Dropdown */}
                {showSuggestions && filteredSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredSuggestions.map((user) => (
                      <button
                        key={user.email}
                        onClick={() => addEmail(user.email)}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-normal text-neutral-900">{user.name}</p>
                            <p className="text-xs font-light text-neutral-600">{user.email}</p>
                          </div>
                          <Badge variant="outline" className="font-light text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs font-light text-neutral-500 mt-2">
                Start typing to search Active Directory users
              </p>
            </div>

            {/* CC Recipients */}
            <div>
              <label className="block text-sm font-light text-neutral-700 mb-2">
                CC: (Optional)
              </label>

              {/* Selected CC Email Chips */}
              {selectedCcEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {selectedCcEmails.map((email) => (
                    <div
                      key={email}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-100 border border-neutral-200"
                    >
                      <span className="text-sm font-light text-neutral-900">{email}</span>
                      <button
                        onClick={() => removeCcEmail(email)}
                        className="hover:bg-neutral-200 rounded-full p-0.5 transition-colors"
                      >
                        <X className="size-3 text-neutral-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* CC Email Input with AD Suggestions */}
              <div className="relative">
                <Input
                  value={ccInput}
                  onChange={(e) => {
                    setCcInput(e.target.value)
                    setShowCcSuggestions(true)
                  }}
                  onFocus={() => setShowCcSuggestions(true)}
                  placeholder="Search by name, email, or role..."
                  className="border-neutral-200 rounded-xl font-light"
                />

                {/* CC AD Suggestions Dropdown */}
                {showCcSuggestions && filteredCcSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                    {filteredCcSuggestions.map((user) => (
                      <button
                        key={user.email}
                        onClick={() => addCcEmail(user.email)}
                        className="w-full text-left px-4 py-3 hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-normal text-neutral-900">{user.name}</p>
                            <p className="text-xs font-light text-neutral-600">{user.email}</p>
                          </div>
                          <Badge variant="outline" className="font-light text-xs">
                            {user.role}
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <p className="text-xs font-light text-neutral-500 mt-2">
                Start typing to search Active Directory users
              </p>
            </div>

            {/* From Field */}
            <div>
              <label className="block text-sm font-light text-neutral-700 mb-2">
                From:
              </label>
              <Input
                value={fromEmail}
                onChange={(e) => setFromEmail(e.target.value)}
                placeholder="your.email@astrazeneca.com"
                className="border-neutral-200 rounded-xl font-light"
              />
              <p className="text-xs font-light text-neutral-500 mt-2">
                Defaults to {currentUser.email} but can be overridden
              </p>
            </div>

            {/* Email Summary */}
            <div>
              <label className="block text-sm font-light text-neutral-700 mb-2">
                Message
              </label>
              <Textarea
                value={emailSummary}
                onChange={(e) => setEmailSummary(e.target.value)}
                className="border-neutral-200 rounded-xl font-light min-h-[320px] font-mono text-xs"
              />
              <p className="text-xs font-light text-neutral-500 mt-2">
                You can edit the auto-generated summary before sending
              </p>
            </div>
          </div>

          <DialogFooter>
            <div className="flex gap-3 w-full">
              <Button
                variant="outline"
                onClick={() => setSendUpdateOpen(false)}
                disabled={sending}
                className="flex-1 rounded-xl font-light"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSend}
                disabled={selectedEmails.length === 0 || sending || sendSuccess}
                className={cn(
                  "flex-1 rounded-xl font-light transition-all",
                  sendSuccess
                    ? "bg-green-500 hover:bg-green-600"
                    : cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                )}
              >
                {sending && <Loader2 className="size-4 mr-2 animate-spin" strokeWidth={1.5} />}
                {sendSuccess && <CheckCircle2 className="size-4 mr-2" strokeWidth={1.5} />}
                {sendSuccess ? "Sent!" : sending ? "Sending..." : "Send Update"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approval Modal */}
      <Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
        <DialogContent className="!max-w-7xl rounded-2xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-2xl font-extralight tracking-tight text-neutral-900">
              Review Dataset Approvals
            </DialogTitle>
            <DialogDescription className="text-sm font-light text-neutral-600">
              Select datasets to approve, reject, or mark as aware. Comments are required for all actions.
            </DialogDescription>
          </DialogHeader>

          {(() => {
            // Filter datasets requiring approval
            const datasetsForApproval = collection.selectedDatasets.filter(d =>
              d.approvalRequirements?.some(r => r.status === 'pending' || (filterApprovalStatus !== 'pending' && r.status === filterApprovalStatus))
            )

            // Apply filters
            const filtered = datasetsForApproval.filter(dataset => {
              const matchesTeam = filterTeam === "all" || dataset.approvalRequirements?.some(r => r.team === filterTeam)
              const matchesTA = filterTA === "all" || dataset.therapeuticArea.includes(filterTA)
              return matchesTeam && matchesTA
            })

            // Pagination
            const totalPages = Math.ceil(filtered.length / itemsPerPage)
            const startIndex = (currentPage - 1) * itemsPerPage
            const paginatedDatasets = filtered.slice(startIndex, startIndex + itemsPerPage)

            const toggleDatasetSelection = (datasetId: string) => {
              setSelectedDatasets(prev =>
                prev.includes(datasetId)
                  ? prev.filter(id => id !== datasetId)
                  : [...prev, datasetId]
              )
            }

            const selectAllOnPage = () => {
              setSelectedDatasets(prev => {
                const newSet = new Set(prev)
                paginatedDatasets.forEach(d => newSet.add(d.id))
                return Array.from(newSet)
              })
            }

            const selectAllFiltered = () => {
              setSelectedDatasets(filtered.map(d => d.id))
            }

            const clearSelection = () => setSelectedDatasets([])

            const selectMyApprovals = () => {
              // Filter to datasets where current user's team has pending approvals
              const myDatasets = filtered.filter(d =>
                d.approvalRequirements?.some(req =>
                  req.team === currentUser.approvalTeam && req.status === 'pending'
                )
              )
              setSelectedDatasets(myDatasets.map(d => d.id))
            }

            // Count how many datasets the current user can approve
            const myApprovalsCount = filtered.filter(d =>
              d.approvalRequirements?.some(req =>
                req.team === currentUser.approvalTeam && req.status === 'pending'
              )
            ).length

            const handleApprovalAction = async (action: 'approved' | 'rejected' | 'aware') => {
              setAttemptedSubmit(true)

              if (!approvalComment.trim()) {
                return
              }

              if (selectedDatasets.length === 0) {
                return
              }

              setProcessing(true)

              // Simulate API call
              await new Promise(resolve => setTimeout(resolve, 1500))

              // In a real implementation, this would update the backend
              // For now, we'll just close the modal and reset state
              setProcessing(false)
              setApprovalComment("")
              setSelectedDatasets([])
              setAttemptedSubmit(false)
              setApprovalModalOpen(false)

              // Show success feedback (could add a toast here)
            }

            return (
              <>
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Filters & Selection Controls */}
                  <div className="border-b border-neutral-200 pb-4 mb-4 space-y-3">
                    <div className="flex gap-2 flex-wrap">
                      <Select value={filterTeam} onValueChange={setFilterTeam}>
                        <SelectTrigger className="w-48 rounded-xl font-light border-2 border-neutral-200 hover:border-neutral-300">
                          <SelectValue placeholder="Filter by team" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Teams</SelectItem>
                          <SelectItem value="GPT-Oncology">GPT-Oncology</SelectItem>
                          <SelectItem value="GPT-Cardiovascular">GPT-Cardiovascular</SelectItem>
                          <SelectItem value="TALT-Legal">TALT-Legal</SelectItem>
                          <SelectItem value="Publication Lead">Publication Lead</SelectItem>
                          <SelectItem value="GSP">GSP</SelectItem>
                          <SelectItem value="Alliance Manager">Alliance Manager</SelectItem>
                          <SelectItem value="GCL">GCL</SelectItem>
                          <SelectItem value="IA">IA</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterTA} onValueChange={setFilterTA}>
                        <SelectTrigger className="w-48 rounded-xl font-light border-2 border-neutral-200 hover:border-neutral-300">
                          <SelectValue placeholder="Therapeutic area" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Areas</SelectItem>
                          <SelectItem value="ONC">Oncology</SelectItem>
                          <SelectItem value="CARDIO">Cardiovascular</SelectItem>
                          <SelectItem value="NEURO">Neurology</SelectItem>
                          <SelectItem value="IMMUNONC">Immuno-Oncology</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select value={filterApprovalStatus} onValueChange={setFilterApprovalStatus}>
                        <SelectTrigger className="w-40 rounded-xl font-light border-2 border-neutral-200 hover:border-neutral-300">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="pending">Pending Only</SelectItem>
                          <SelectItem value="approved">Approved</SelectItem>
                          <SelectItem value="rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Smart Selection - My Approvals */}
                    {myApprovalsCount > 0 && (
                      <div className={cn("bg-gradient-to-r border rounded-xl p-3 flex items-center justify-between", scheme.bg, scheme.bgHover, scheme.from.replace("from-", "border-").replace("500", "200"))}>
                        <div className="flex items-center gap-3">
                          <div className={cn("p-2 rounded-lg", scheme.from.replace("from-", "bg-").replace("500", "100"))}>
                            <UserCheck className={cn("size-5", scheme.from.replace("from-", "text-").replace("500", "700"))} strokeWidth={1.5} />
                          </div>
                          <div>
                            <p className={cn("text-sm font-normal", scheme.from.replace("from-", "text-").replace("500", "900"))}>
                              {myApprovalsCount} dataset{myApprovalsCount !== 1 ? 's' : ''} awaiting your approval
                            </p>
                            <p className={cn("text-xs font-light", scheme.from.replace("from-", "text-").replace("500", "700"))}>
                              {currentUser.approvalTeam} team
                            </p>
                          </div>
                        </div>
                        <Button
                          onClick={selectMyApprovals}
                          className={cn(
                            "rounded-full font-light",
                            "bg-gradient-to-r",
                            scheme.from, scheme.to,
                            "text-white shadow-md"
                          )}
                        >
                          <CheckSquare className="size-4 mr-2" strokeWidth={1.5} />
                          Select My Approvals
                        </Button>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={selectAllOnPage}
                          className="rounded-full font-light"
                        >
                          Select All on Page ({paginatedDatasets.length})
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={selectAllFiltered}
                          className="rounded-full font-light"
                        >
                          Select All Filtered ({filtered.length})
                        </Button>
                        {selectedDatasets.length > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearSelection}
                            className="rounded-full font-light"
                          >
                            Clear Selection
                          </Button>
                        )}
                      </div>

                      <span className="text-sm font-light text-neutral-600">
                        {selectedDatasets.length} selected
                      </span>
                    </div>
                  </div>

                  {/* Scrollable Dataset List */}
                  <div className="flex-1 overflow-y-auto pr-2">
                    <div className="space-y-2">
                      {paginatedDatasets.map(dataset => (
                        <div
                          key={dataset.id}
                          className={cn(
                            "border rounded-xl p-4 cursor-pointer transition-all",
                            selectedDatasets.includes(dataset.id)
                              ? "border-amber-400 bg-amber-50"
                              : "border-neutral-200 hover:border-neutral-300"
                          )}
                          onClick={() => toggleDatasetSelection(dataset.id)}
                        >
                          <div className="flex items-start gap-3">
                            <Checkbox
                              checked={selectedDatasets.includes(dataset.id)}
                              onCheckedChange={() => toggleDatasetSelection(dataset.id)}
                              className="mt-1"
                              onClick={(e) => e.stopPropagation()}
                            />

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <Badge variant="outline" className="rounded-full font-mono font-light text-xs mb-1">
                                    {dataset.code}
                                  </Badge>
                                  <h4 className="font-normal text-neutral-900">
                                    {dataset.name}
                                  </h4>
                                </div>
                                <div className="text-right text-xs text-neutral-500">
                                  {dataset.therapeuticArea.join(", ")}
                                </div>
                              </div>

                              {/* Approval requirements for this dataset */}
                              <div className="flex flex-wrap gap-2 mt-2">
                                {dataset.approvalRequirements
                                  ?.filter(r => r.status === 'pending')
                                  .map(req => (
                                    <Badge
                                      key={req.id}
                                      className="rounded-full bg-amber-100 text-amber-800 border-amber-200 font-light text-xs"
                                    >
                                      {req.team} approval needed
                                    </Badge>
                                  ))}
                              </div>

                              <p className="text-xs font-light text-neutral-600 mt-2">
                                {dataset.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pagination */}
                  <div className="border-t border-neutral-200 pt-4 mt-4 flex items-center justify-between">
                    <span className="text-sm font-light text-neutral-600">
                      Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length}
                    </span>
                    <div className="flex gap-2 items-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="rounded-full font-light"
                      >
                        <ChevronLeft className="size-4" strokeWidth={1.5} />
                      </Button>
                      <span className="px-3 py-1 text-sm font-light">
                        Page {currentPage} of {totalPages || 1}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages || totalPages === 0}
                        className="rounded-full font-light"
                      >
                        <ChevronRight className="size-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action Footer */}
                <div className="border-t border-neutral-200 pt-6 space-y-4">
                  {/* Comment Input - MANDATORY */}
                  <div>
                    <Label htmlFor="approval-comment" className="text-sm font-normal mb-2 block">
                      Comment <span className="text-red-600">*</span>
                    </Label>
                    <Textarea
                      id="approval-comment"
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      placeholder="Enter your comment (required for all actions)..."
                      className={cn(
                        "min-h-24 rounded-xl font-light resize-y border-2 border-neutral-200",
                        "hover:border-neutral-300 focus-visible:border-current transition-colors",
                        `focus-visible:${scheme.from.replace("from-", "border-").replace("-500", "-400")}`
                      )}
                    />
                    {!approvalComment && attemptedSubmit && (
                      <p className="text-xs text-red-600 mt-1">Comment is required</p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <DialogFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setApprovalModalOpen(false)}
                      disabled={processing}
                      className="rounded-full font-light"
                    >
                      Cancel
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleApprovalAction('aware')}
                      disabled={selectedDatasets.length === 0 || processing}
                      className="rounded-full border-blue-300 text-blue-700 hover:bg-blue-50 font-light"
                    >
                      <Bell className="size-4 mr-2" strokeWidth={1.5} />
                      Mark as Aware
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => handleApprovalAction('rejected')}
                      disabled={selectedDatasets.length === 0 || processing}
                      className="rounded-full border-red-300 text-red-700 hover:bg-red-50 font-light"
                    >
                      <XCircle className="size-4 mr-2" strokeWidth={1.5} />
                      Reject
                    </Button>

                    <Button
                      onClick={() => handleApprovalAction('approved')}
                      disabled={selectedDatasets.length === 0 || processing}
                      className={cn(
                        "rounded-full font-light text-white",
                        processing ? "bg-neutral-400" : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      )}
                    >
                      {processing ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" strokeWidth={1.5} />
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="size-4 mr-2" strokeWidth={1.5} />
                          Approve
                        </>
                      )}
                    </Button>
                  </DialogFooter>
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}

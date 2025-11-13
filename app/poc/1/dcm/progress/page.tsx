"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Collection, getCollectionById } from "@/lib/dcm-mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { useColorScheme } from "@/components/ux12-color-context"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
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
  MessageSquare,
  AlertCircle,
  Lightbulb,
  Info,
  Pin,
  Smile,
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
  author: { name: string; role: string }
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
      { emoji: "👍", count: 3, users: ["Jane Smith", "Lisa Thompson", "Divya Dayanidhi"] },
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
      { emoji: "🙏", count: 2, users: ["Dr. Sarah Martinez", "Divya Dayanidhi"] },
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
    author: { name: "Divya Dayanidhi", role: "Data Collection Manager" },
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
      { emoji: "💡", count: 4, users: ["Divya Dayanidhi", "Emily Rodriguez", "Dr. David Kumar", "Dr. Sarah Martinez"] },
    ],
    mentions: [],
  },
  {
    id: "c6",
    author: { name: "Divya Dayanidhi", role: "Data Collection Manager" },
    type: "update",
    content: "Great suggestion @Dr. Michael Chen! I'll add DCODE-203 as an optional dataset. Users can request it separately if needed. This keeps the core collection focused while allowing expansion.",
    timestamp: new Date("2025-11-11T14:15:00"),
    reactions: [
      { emoji: "👍", count: 2, users: ["Dr. Michael Chen", "Emily Rodriguez"] },
    ],
    mentions: ["Dr. Michael Chen"],
  },
]

export default function DCMProgressDashboard() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<
    "overview" | "datasets" | "users" | "timeline" | "discussion"
  >("overview")

  // Discussion state
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS)
  const [newComment, setNewComment] = useState("")
  const [commentType, setCommentType] = useState<"update" | "question" | "blocker" | "suggestion">("update")
  const [showMentions, setShowMentions] = useState(false)

  // Resolve blocker state
  const [resolvingCommentId, setResolvingCommentId] = useState<string | null>(null)
  const [resolutionComment, setResolutionComment] = useState("")

  // Collection data
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)

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

  // Mock logged-in user
  const currentUser = {
    name: "Divya Dayanidhi",
    email: "divya.dayanidhi@astrazeneca.com",
    role: "Data Collection Manager"
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
          router.push("/poc/1")
        }
      } else {
        // No collection ID, redirect to dashboard
        router.push("/poc/1")
      }
      setLoading(false)
    }
  }, [router])

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
• ✅ Immediate Access: ${collection.usersWithAccess} users (${Math.round((collection.usersWithAccess / collection.totalUsers) * 100)}%) can already access some datasets
${collection.status === "provisioning" ? `• ⏳ In Progress: Immuta policy generation at ${collection.instantGrantProgress}% - ${usersAfterInstantGrant} users (${Math.round((usersAfterInstantGrant / collection.totalUsers) * 100)}%) will gain access within ~1 hour` : ""}
${totalApprovalRequests > 0 ? `• 🟡 Pending Approvals: ${totalApprovalRequests} authorization requests sent to ${collection.approvalRequests.map(r => r.team).join(" and ")} (est. 2-5 business days)` : ""}
${collection.accessBreakdown.dataDiscovery > 0 ? `• ❓ Data Discovery: ${collection.accessBreakdown.dataDiscovery} dataset${collection.accessBreakdown.dataDiscovery > 1 ? 's' : ''} require${collection.accessBreakdown.dataDiscovery === 1 ? 's' : ''} location verification` : ""}

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
        <Loader2 className="size-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  const usersAfterInstantGrant = collection.accessBreakdown.immediate + collection.accessBreakdown.instantGrant

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/poc/1")}
          className="rounded-full font-light mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Dashboard
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
                {collection.status === "provisioning" && "⚡ Provisioning"}
                {collection.status === "completed" && "✅ Complete"}
                {collection.status === "pending_approval" && "🟡 Pending"}
              </Badge>
            </div>
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
              <Download className="size-4 mr-2" />
              Export Report
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOpenSendUpdate}
              className="rounded-full font-light"
            >
              <Send className="size-4 mr-2" />
              Send Update
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <Card className="border-neutral-200 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
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

            <div className="grid grid-cols-4 gap-4 text-center">
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
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {(() => {
          const blockerCount = comments.filter((c) => c.type === "blocker" && !c.isResolved).length
          const tabs = [
            { id: "overview", label: "Overview", icon: Activity },
            { id: "datasets", label: "Dataset Status", icon: FileText },
            { id: "users", label: "User Status", icon: Users },
            { id: "timeline", label: "Timeline", icon: TrendingUp },
            { id: "discussion", label: "Discussion", icon: MessageSquare, badge: comments.length, blockerCount },
          ]

          return tabs.map((tab) => {
            const Icon = tab.icon
            const hasCritical = tab.id === "discussion" && tab.blockerCount && tab.blockerCount > 0

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 rounded-xl border-2 font-light transition-all relative",
                  activeTab === tab.id
                    ? cn("border-current bg-gradient-to-r", scheme.bg, scheme.bgHover)
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                )}
              >
                <Icon className="size-4" />
                {tab.label}
                {tab.badge && (
                  <Badge
                    className={cn(
                      "ml-1 font-light text-xs",
                      hasCritical
                        ? "bg-gradient-to-r from-red-500 to-orange-400 text-white border-0"
                        : activeTab === tab.id
                        ? "bg-white/80 text-neutral-900"
                        : scheme.from.replace("from-", "bg-") + " text-white"
                    )}
                  >
                    {hasCritical ? `${tab.blockerCount} Critical` : tab.badge}
                  </Badge>
                )}
              </button>
            )
          })
        })()}
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-2 gap-6">
          {/* Current Status */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-normal text-neutral-900 mb-4">Current Status</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-green-600" />
                    <span className="text-sm font-normal text-green-900">Immediate Access</span>
                  </div>
                  <Badge variant="outline" className="font-light border-green-200 text-green-800">
                    {collection.accessBreakdown.immediate} users
                  </Badge>
                </div>

                {collection.status === "provisioning" && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50 border border-blue-100">
                    <div className="flex items-center gap-3">
                      <Loader2 className="size-5 text-blue-600 animate-spin" />
                      <span className="text-sm font-normal text-blue-900">Instant Grant (In Progress)</span>
                    </div>
                    <Badge variant="outline" className="font-light border-blue-200 text-blue-800">
                      {collection.instantGrantProgress}% done
                    </Badge>
                  </div>
                )}

                {collection.approvalRequests.length > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-3">
                      <Clock className="size-5 text-amber-600" />
                      <span className="text-sm font-normal text-amber-900">Pending Approvals</span>
                    </div>
                    <Badge variant="outline" className="font-light border-amber-200 text-amber-800">
                      {collection.approvalRequests.reduce((sum, req) => sum + req.count, 0)} requests
                    </Badge>
                  </div>
                )}

                <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-200">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="size-5 text-neutral-600" />
                    <span className="text-sm font-normal text-neutral-900">Data Discovery</span>
                  </div>
                  <Badge variant="outline" className="font-light border-neutral-300">
                    In progress
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-lg font-normal text-neutral-900 mb-4">Recent Activity</h3>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-100 shrink-0">
                    <CheckCircle2 className="size-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-normal text-neutral-900">
                      Immuta policy generation: 70% complete
                    </p>
                    <p className="text-xs font-light text-neutral-500">2 minutes ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-amber-100 shrink-0">
                    <Send className="size-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-normal text-neutral-900">
                      Authorization requests sent to GPT-Oncology
                    </p>
                    <p className="text-xs font-light text-neutral-500">5 minutes ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-amber-100 shrink-0">
                    <Send className="size-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-normal text-neutral-900">
                      Authorization requests sent to TALT-Legal
                    </p>
                    <p className="text-xs font-light text-neutral-500">5 minutes ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-blue-100 shrink-0">
                    <Users className="size-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-normal text-neutral-900">
                      Training reminders sent to 12 users
                    </p>
                    <p className="text-xs font-light text-neutral-500">8 minutes ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-100 shrink-0">
                    <CheckCircle2 className="size-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-normal text-neutral-900">
                      60 users granted immediate access
                    </p>
                    <p className="text-xs font-light text-neutral-500">10 minutes ago</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex size-8 items-center justify-center rounded-full bg-green-100 shrink-0">
                    <CheckCircle2 className="size-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-normal text-neutral-900">Collection published</p>
                    <p className="text-xs font-light text-neutral-500">10 minutes ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Dataset Status Tab */}
      {activeTab === "datasets" && (
        <div className="space-y-4">
          {collection.selectedDatasets.map((dataset) => {
            const alreadyOpen = dataset.accessBreakdown.alreadyOpen > 50
            const needsApproval = dataset.accessBreakdown.needsApproval > 30

            const datasetStatus = alreadyOpen
              ? { status: "accessible", text: "Accessible", color: "green", icon: "✅" }
              : needsApproval
              ? { status: "pending", text: "Pending Approval", color: "amber", icon: "🟡" }
              : { status: "provisioning", text: `Provisioning (${dataset.accessBreakdown.readyToGrant}% instant grant)`, color: "blue", icon: "⏳" }

            return (
              <Card key={dataset.code} className="border-neutral-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-base font-normal text-neutral-900">{dataset.name}</h4>
                        <Badge variant="outline" className="font-light text-xs">
                          {dataset.code}
                        </Badge>
                      </div>
                      <p className="text-sm font-light text-neutral-600">{datasetStatus.text}</p>
                    </div>
                    <Badge
                      className={cn(
                        "font-light",
                        datasetStatus.color === "green" && "bg-green-100 text-green-800",
                        datasetStatus.color === "blue" && "bg-blue-100 text-blue-800",
                        datasetStatus.color === "amber" && "bg-amber-100 text-amber-800"
                      )}
                    >
                      {datasetStatus.icon}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* User Status Tab */}
      {activeTab === "users" && (
        <Card className="border-neutral-200 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-normal text-neutral-900 mb-4">User Access Summary</h3>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-green-50 border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-normal text-green-900">
                    60 users (50%): Have immediate access to some/all datasets
                  </p>
                </div>
                <p className="text-xs font-light text-green-700">
                  These users can access datasets that are already open (20% category)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-normal text-blue-900">
                    48 users (40%): Will gain access to 5 more datasets in ~1hr
                  </p>
                </div>
                <p className="text-xs font-light text-blue-700">
                  Instant grant in progress (30% category - Immuta policy generation at 70%)
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-normal text-amber-900">
                    108 users (90%): Pending GPT/TALT approval for 6 datasets
                  </p>
                </div>
                <p className="text-xs font-light text-amber-700">
                  Approval requests sent. Estimated 2-5 business days for completion.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-normal text-neutral-900">
                    12 users (10%): Blocked by missing training
                  </p>
                </div>
                <p className="text-xs font-light text-neutral-600">
                  Training reminders sent. Auto-grant will trigger upon completion.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Timeline Tab */}
      {activeTab === "timeline" && (
        <Card className="border-neutral-200 rounded-2xl overflow-hidden">
          <CardContent className="p-6">
            <h3 className="text-lg font-normal text-neutral-900 mb-4">Provisioning Timeline</h3>

            <div className="space-y-4 relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-neutral-200" />

              {collection.milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4 relative">
                  <div
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full shrink-0 z-10 text-white",
                      milestone.status === "completed" && "bg-green-500",
                      milestone.status === "in_progress" &&
                        cn("bg-gradient-to-r animate-pulse", scheme.from, scheme.to),
                      milestone.status === "pending" && "bg-neutral-200 text-neutral-600"
                    )}
                  >
                    {milestone.status === "completed" && "✓"}
                    {milestone.status === "in_progress" && "⏳"}
                    {milestone.status === "pending" && "⏳"}
                  </div>
                  <div className={cn("flex-1", index < collection.milestones.length - 1 && "pb-4")}>
                    <p className="text-sm font-normal text-neutral-900 mb-1">
                      {milestone.timestamp
                        ? `${milestone.timestamp.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - ${milestone.name}`
                        : milestone.estimatedTime
                        ? `Est. ${milestone.estimatedTime.toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} - ${milestone.name}`
                        : milestone.name}
                    </p>
                    {milestone.status === "completed" && (
                      <p className="text-xs font-light text-neutral-600">Completed successfully</p>
                    )}
                    {milestone.status === "in_progress" && (
                      <p className="text-xs font-light text-neutral-600">
                        {collection.status === "provisioning" &&
                          milestone.name.includes("Instant grant") &&
                          `Immuta policy generation in progress (${collection.instantGrantProgress}% complete)`}
                      </p>
                    )}
                    {milestone.status === "pending" && (
                      <p className="text-xs font-light text-neutral-600">
                        Awaiting completion of previous steps
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Discussion Tab */}
      {activeTab === "discussion" && (
        <div className="space-y-6">
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
                      onClick={() => setCommentType(type.id as any)}
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

          {/* Comments List */}
          <div className="space-y-4">
            {comments.sort((a, b) => {
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
                    comment.type === "blocker" && comment.isResolved && "border-l-4 border-green-500 bg-green-50/30"
                  )}
                >
                  <CardContent className="p-6">
                    {/* Blocker Badge */}
                    {comment.type === "blocker" && !comment.isResolved && (
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 text-red-700">
                          <div className="size-2 rounded-full bg-red-500" />
                          <AlertCircle className="size-4" />
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
                          <CheckCircle2 className="size-3 mr-1" />
                          Resolve
                        </Button>
                      </div>
                    )}

                    {/* Resolved Badge */}
                    {comment.type === "blocker" && comment.isResolved && (
                      <div className="flex items-center gap-2 mb-3 text-green-700">
                        <CheckCircle2 className="size-4" />
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
                        <Pin className="size-4 fill-amber-700" />
                        <span className="text-xs font-normal">Pinned by collection owner</span>
                      </div>
                    )}

                    {/* Comment Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3 flex-1">
                        {/* Avatar */}
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

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-normal text-neutral-900">
                              {comment.author.name}
                            </h4>
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
                          <CheckCircle2 className="size-4 text-green-600" />
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
                          <Smile className="size-3 text-neutral-500" />
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
              <CheckCircle2 className="size-4 mr-2" />
              Resolve Blocker
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Send Update Modal */}
      <Dialog open={sendUpdateOpen} onOpenChange={setSendUpdateOpen}>
        <DialogContent className="max-w-4xl rounded-2xl">
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
                {sending && <Loader2 className="size-4 mr-2 animate-spin" />}
                {sendSuccess && <CheckCircle2 className="size-4 mr-2" />}
                {sendSuccess ? "Sent!" : sending ? "Sending..." : "Send Update"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

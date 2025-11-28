"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  Zap,
  ExternalLink,
  MessageSquare,
  FileText,
  Database,
  Copy,
  Check,
  X,
  Users,
  Mail,
  Video,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Send,
  Layers,
  AlertCircle,
  BookOpen,
  Headphones,
  Edit,
  XCircle,
} from "lucide-react"

// ============================================================================
// MOCK DATA
// ============================================================================

interface RequestedCollection {
  id: string
  name: string
  description: string
  datasetCount: number
  status: "pending_review" | "approved" | "partial" | "rejected" | "provisioning" | "complete"
  accessibleDatasets: number
  pendingDatasets: number
  approvedDatasets: number
  rejectedDatasets: number
  intents: string[]
  approvalStatus: {
    team: string
    status: "pending" | "approved" | "rejected"
    decidedAt?: Date
    decidedBy?: string
  }[]
}

interface RequestedDataset {
  code: string
  name: string
  collectionId: string | null
  collectionName: string | null
  status: "accessible" | "pending" | "approved" | "rejected"
  accessPlatform?: string
  approvalTeam?: string
}

interface DiscussionMessage {
  id: string
  author: { name: string; role: string; isUser: boolean }
  content: string
  timestamp: Date
  type: "message" | "status_update" | "question" | "resolution"
}

interface TimelineEvent {
  id: string
  event: string
  timestamp: Date
  status: "completed" | "in_progress" | "pending"
  details?: string
}

const MOCK_USER_REQUEST = {
  id: "req-123456",
  name: "Oncology Research Data Request",
  status: "partial_access" as const,
  submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago

  collections: [
    {
      id: "col-1",
      name: "Oncology ctDNA Outcomes Collection",
      description: "Curated Phase III lung cancer studies with ctDNA biomarker monitoring and immunotherapy treatment arms.",
      datasetCount: 12,
      status: "partial" as const,
      accessibleDatasets: 6,
      pendingDatasets: 4,
      approvedDatasets: 0,
      rejectedDatasets: 2,
      intents: ["ML/AI Research", "Publication"],
      approvalStatus: [
        { team: "GPT-Oncology", status: "approved" as const, decidedAt: new Date(Date.now() - 1000 * 60 * 60), decidedBy: "Dr. Sarah Martinez" },
        { team: "TALT-Legal", status: "pending" as const },
      ],
    },
    {
      id: "col-2",
      name: "Immunotherapy Response Studies",
      description: "Comprehensive immunotherapy trial data across multiple therapeutic areas.",
      datasetCount: 4,
      status: "pending_review" as const,
      accessibleDatasets: 2,
      pendingDatasets: 2,
      approvedDatasets: 0,
      rejectedDatasets: 0,
      intents: ["ML/AI Research"],
      approvalStatus: [
        { team: "GPT-Oncology", status: "pending" as const },
      ],
    },
  ] as RequestedCollection[],

  standaloneDatasets: [
    { code: "DCODE-299", name: "ctDNA Longitudinal Substudy", collectionId: null, collectionName: null, status: "accessible" as const, accessPlatform: "Domino Data Lab" },
    { code: "DCODE-334", name: "NSCLC Biomarker Analysis", collectionId: null, collectionName: null, status: "pending" as const, approvalTeam: "GPT-Oncology" },
  ] as RequestedDataset[],

  // All datasets flattened for the Datasets tab
  allDatasets: [
    { code: "DCODE-001", name: "NSCLC Genomic Profiling", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "accessible" as const, accessPlatform: "Domino Data Lab" },
    { code: "DCODE-023", name: "Lung Cancer Survival Outcomes", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "accessible" as const, accessPlatform: "Domino Data Lab" },
    { code: "DCODE-045", name: "Immunotherapy Response Study", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "accessible" as const, accessPlatform: "SCP Platform" },
    { code: "DCODE-088", name: "Lung Cancer Clinical Outcomes", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "accessible" as const, accessPlatform: "Domino Data Lab" },
    { code: "DCODE-102", name: "PET Imaging Substudy", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "accessible" as const, accessPlatform: "SCP Platform" },
    { code: "DCODE-134", name: "Biomarker Validation Study", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "accessible" as const, accessPlatform: "Domino Data Lab" },
    { code: "DCODE-042", name: "NSCLC ctDNA Monitoring", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "pending" as const, approvalTeam: "TALT-Legal" },
    { code: "DCODE-067", name: "Immunotherapy Response Phase III", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "pending" as const, approvalTeam: "TALT-Legal" },
    { code: "DCODE-156", name: "Active NSCLC Trial", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "pending" as const, approvalTeam: "TALT-Legal" },
    { code: "DCODE-178", name: "Ongoing Immunotherapy Study", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "pending" as const, approvalTeam: "TALT-Legal" },
    { code: "DCODE-189", name: "Multi-Site Biomarker Trial", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "rejected" as const },
    { code: "DCODE-201", name: "Phase III Active Study", collectionId: "col-1", collectionName: "Oncology ctDNA Outcomes Collection", status: "rejected" as const },
    { code: "DCODE-301", name: "Immunotherapy Outcomes A", collectionId: "col-2", collectionName: "Immunotherapy Response Studies", status: "accessible" as const, accessPlatform: "Domino Data Lab" },
    { code: "DCODE-302", name: "Immunotherapy Outcomes B", collectionId: "col-2", collectionName: "Immunotherapy Response Studies", status: "accessible" as const, accessPlatform: "Domino Data Lab" },
    { code: "DCODE-303", name: "Immunotherapy Biomarkers", collectionId: "col-2", collectionName: "Immunotherapy Response Studies", status: "pending" as const, approvalTeam: "GPT-Oncology" },
    { code: "DCODE-304", name: "Immunotherapy Long-term Follow-up", collectionId: "col-2", collectionName: "Immunotherapy Response Studies", status: "pending" as const, approvalTeam: "GPT-Oncology" },
    { code: "DCODE-299", name: "ctDNA Longitudinal Substudy", collectionId: null, collectionName: null, status: "accessible" as const, accessPlatform: "Domino Data Lab" },
    { code: "DCODE-334", name: "NSCLC Biomarker Analysis", collectionId: null, collectionName: null, status: "pending" as const, approvalTeam: "GPT-Oncology" },
  ] as RequestedDataset[],

  accessSummary: {
    totalDatasets: 18,
    instantAccess: 9,
    pendingApproval: 7,
    approved: 0,
    rejected: 2,
  },

  dcmContact: {
    name: "Jennifer Martinez",
    email: "jennifer.martinez@astrazeneca.com",
    role: "Data Collection Manager",
    team: "GPT-Oncology",
    responseTime: "within 24 hours",
  },

  discussion: [
    {
      id: "msg-1",
      author: { name: "System", role: "Collectoid", isUser: false },
      content: "Request submitted successfully. Jennifer Martinez has been assigned as your DCM contact.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: "status_update" as const,
    },
    {
      id: "msg-2",
      author: { name: "System", role: "Collectoid", isUser: false },
      content: "9 datasets granted instant access. You can access them now via the platform links.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
      type: "status_update" as const,
    },
    {
      id: "msg-3",
      author: { name: "Jennifer Martinez", role: "Data Collection Manager", isUser: false },
      content: "Hi! I've reviewed your request. 9 datasets are now accessible. I'm working on the remaining approvals - GPT-Oncology has approved their portion, we're waiting on TALT-Legal for 4 datasets.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      type: "message" as const,
    },
    {
      id: "msg-4",
      author: { name: "You", role: "Researcher", isUser: true },
      content: "Thanks Jennifer! Is there anything I can do to speed up the TALT-Legal approval?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "question" as const,
    },
    {
      id: "msg-5",
      author: { name: "Jennifer Martinez", role: "Data Collection Manager", isUser: false },
      content: "TALT-Legal reviews typically take 2-3 business days. They're reviewing the consent language for secondary use. I'll ping them if we don't hear back by tomorrow EOD.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      type: "message" as const,
    },
  ] as DiscussionMessage[],

  timeline: [
    { id: "t1", event: "Request submitted", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: "completed" as const },
    { id: "t2", event: "DCM assigned (Jennifer Martinez)", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: "completed" as const },
    { id: "t3", event: "9 datasets: Instant access granted", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), status: "completed" as const },
    { id: "t4", event: "GPT-Oncology approval received", timestamp: new Date(Date.now() - 1000 * 60 * 60), status: "completed" as const },
    { id: "t5", event: "TALT-Legal review in progress", timestamp: new Date(), status: "in_progress" as const, details: "4 datasets • Est. 1-2 business days" },
    { id: "t6", event: "Full access granted", timestamp: new Date(), status: "pending" as const },
  ] as TimelineEvent[],

  platforms: [
    { name: "Domino Data Lab", url: "#", datasetCount: 7, icon: "domino" },
    { name: "SCP Platform", url: "#", datasetCount: 2, icon: "scp" },
  ],
}

// FAQ data
const FAQ_ITEMS = [
  {
    question: "How long do approvals typically take?",
    answer: "Most approvals are completed within 2-5 business days. Instant access datasets are available immediately. Datasets requiring governance approval (TALT-Legal, GPT teams) typically take 2-3 business days each.",
  },
  {
    question: "How do I access my data once approved?",
    answer: "Once datasets are accessible, you'll see platform links (Domino Data Lab, SCP Platform) in the Access Summary section. Click on any platform to open it directly with your data pre-loaded.",
  },
  {
    question: "Can I modify my request after submission?",
    answer: "Yes, you can request modifications by contacting your DCM through the Discussion tab. Note that adding new datasets may require additional approvals and extend the timeline.",
  },
  {
    question: "What if part of my request is rejected?",
    answer: "If specific datasets are rejected, you'll see the reason in the Datasets tab. Your DCM can help you understand the decision and suggest alternatives. The rest of your request continues processing normally.",
  },
  {
    question: "Who can I contact for help?",
    answer: "Your assigned DCM (shown in the sidebar) is your primary contact. For technical issues with platforms, use the Support link. For urgent matters, you can request a video call with your DCM.",
  },
]

// ============================================================================
// COMPONENT
// ============================================================================

export default function UserRequestDashboard() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const params = useParams()

  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<"collections" | "datasets" | "timeline" | "discussion" | "help">("collections")

  // Discussion state
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState(MOCK_USER_REQUEST.discussion)

  // Datasets tab state
  const [datasetSearch, setDatasetSearch] = useState("")
  const [datasetStatusFilter, setDatasetStatusFilter] = useState<string>("all")

  // FAQ state
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  // Collection expansion state
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set())

  // Custom dropdown state
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest(".custom-dropdown")) {
        setStatusDropdownOpen(false)
      }
    }
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  const request = MOCK_USER_REQUEST

  const handleCopyId = () => {
    navigator.clipboard.writeText(request.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    const msg: DiscussionMessage = {
      id: `msg-${Date.now()}`,
      author: { name: "You", role: "Researcher", isUser: true },
      content: newMessage,
      timestamp: new Date(),
      type: "message",
    }
    setMessages([...messages, msg])
    setNewMessage("")
  }

  const toggleCollection = (colId: string) => {
    const newExpanded = new Set(expandedCollections)
    if (newExpanded.has(colId)) {
      newExpanded.delete(colId)
    } else {
      newExpanded.add(colId)
    }
    setExpandedCollections(newExpanded)
  }

  // Filter datasets
  const filteredDatasets = request.allDatasets.filter((ds) => {
    const matchesSearch =
      datasetSearch === "" ||
      ds.code.toLowerCase().includes(datasetSearch.toLowerCase()) ||
      ds.name.toLowerCase().includes(datasetSearch.toLowerCase())
    const matchesStatus = datasetStatusFilter === "all" || ds.status === datasetStatusFilter
    return matchesSearch && matchesStatus
  })

  // Calculate access percentage
  const accessPercentage = Math.round((request.accessSummary.instantAccess / request.accessSummary.totalDatasets) * 100)

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "partial_access":
        return { label: "Partial Access", color: "bg-amber-100 text-amber-700 border-amber-200" }
      case "in_progress":
        return { label: "In Progress", color: "bg-blue-100 text-blue-700 border-blue-200" }
      case "completed":
        return { label: "Complete", color: "bg-green-100 text-green-700 border-green-200" }
      case "submitted":
        return { label: "Submitted", color: "bg-neutral-100 text-neutral-700 border-neutral-200" }
      case "rejected":
        return { label: "Rejected", color: "bg-red-100 text-red-700 border-red-200" }
      default:
        return { label: status, color: "bg-neutral-100 text-neutral-700 border-neutral-200" }
    }
  }

  const getCollectionStatusBadge = (status: string) => {
    switch (status) {
      case "complete":
        return { label: "Complete", color: "bg-green-100 text-green-700" }
      case "partial":
        return { label: "Partial Access", color: "bg-amber-100 text-amber-700" }
      case "approved":
        return { label: "Approved", color: "bg-blue-100 text-blue-700" }
      case "pending_review":
        return { label: "Pending Review", color: "bg-neutral-100 text-neutral-700" }
      case "provisioning":
        return { label: "Provisioning", color: "bg-purple-100 text-purple-700" }
      case "rejected":
        return { label: "Rejected", color: "bg-red-100 text-red-700" }
      default:
        return { label: status, color: "bg-neutral-100 text-neutral-700" }
    }
  }

  const getDatasetStatusBadge = (status: string) => {
    switch (status) {
      case "accessible":
        return { label: "Accessible", color: "bg-green-100 text-green-700" }
      case "approved":
        return { label: "Approved", color: "bg-blue-100 text-blue-700" }
      case "pending":
        return { label: "Pending", color: "bg-amber-100 text-amber-700" }
      case "rejected":
        return { label: "Rejected", color: "bg-red-100 text-red-700" }
      default:
        return { label: status, color: "bg-neutral-100 text-neutral-700" }
    }
  }

  const statusBadge = getStatusBadge(request.status)

  // Status filter options
  const statusFilterOptions = [
    { value: "all", label: "All Statuses" },
    { value: "accessible", label: "Accessible" },
    { value: "approved", label: "Approved" },
    { value: "pending", label: "Pending" },
    { value: "rejected", label: "Rejected" },
  ]

  const getStatusFilterLabel = (value: string) => {
    return statusFilterOptions.find((opt) => opt.value === value)?.label || "All Statuses"
  }

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffMins < 1) return "just now"
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/collectoid/my-requests")}
          className="rounded-full font-light mb-4"
        >
          <ArrowLeft className="size-4 mr-2" strokeWidth={1.5} />
          Back to My Requests
        </Button>

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight">
                {request.name}
              </h1>
              <Badge className={cn("font-light", statusBadge.color)}>
                {statusBadge.label}
              </Badge>
            </div>
            <div className="flex items-center gap-4 text-sm font-light text-neutral-600 mb-2">
              <div className="flex items-center gap-2">
                <span>Request ID:</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {request.id.toUpperCase()}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCopyId}
                  className="h-6 w-6 p-0"
                >
                  {copied ? (
                    <Check className="size-3 text-green-600" />
                  ) : (
                    <Copy className="size-3 text-neutral-400" />
                  )}
                </Button>
              </div>
              <span>•</span>
              <span>Submitted 2 hours ago</span>
            </div>
            <div className="flex items-center gap-2 text-sm font-light text-neutral-600">
              <Users className="size-4" strokeWidth={1.5} />
              <span>Your DCM:</span>
              <span className="font-normal text-neutral-900">{request.dcmContact.name}</span>
              <Badge variant="outline" className="font-light text-xs">
                {request.dcmContact.team}
              </Badge>
            </div>
          </div>
        </div>

        {/* Access Summary Card */}
        <Card className={cn(
          "border-2 rounded-2xl overflow-hidden",
          scheme.from.replace("from-", "border-").replace("-500", "-200")
        )}>
          <CardContent className="p-6">
            <div className="flex items-start gap-8">
              {/* Progress Ring */}
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
                      stroke="#22c55e"
                      strokeWidth="8"
                      strokeDasharray={`${(accessPercentage / 100) * 283} 283`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-light text-neutral-900">{accessPercentage}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-1">
                    Accessible
                  </p>
                  <p className="text-lg font-normal text-green-700">
                    {request.accessSummary.instantAccess} of {request.accessSummary.totalDatasets}
                  </p>
                  <p className="text-sm font-light text-neutral-600">datasets</p>
                </div>
              </div>

              {/* Breakdown */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Database className="size-4 text-neutral-500" strokeWidth={1.5} />
                  <span className="text-sm font-normal text-neutral-900">
                    {request.accessSummary.totalDatasets} datasets
                  </span>
                  <span className="text-sm font-light text-neutral-500">•</span>
                  <Layers className="size-4 text-neutral-500" strokeWidth={1.5} />
                  <span className="text-sm font-normal text-neutral-900">
                    {request.collections.length} collections
                  </span>
                </div>

                {/* Visual Breakdown Bar */}
                <div className="mb-3">
                  <div className="flex h-3 rounded-full overflow-hidden bg-neutral-100">
                    <div
                      className="bg-green-500 transition-all"
                      style={{ width: `${(request.accessSummary.instantAccess / request.accessSummary.totalDatasets) * 100}%` }}
                      title={`Accessible: ${request.accessSummary.instantAccess}`}
                    />
                    <div
                      className="bg-blue-500 transition-all"
                      style={{ width: `${(request.accessSummary.approved / request.accessSummary.totalDatasets) * 100}%` }}
                      title={`Approved: ${request.accessSummary.approved}`}
                    />
                    <div
                      className="bg-amber-500 transition-all"
                      style={{ width: `${(request.accessSummary.pendingApproval / request.accessSummary.totalDatasets) * 100}%` }}
                      title={`Pending: ${request.accessSummary.pendingApproval}`}
                    />
                    <div
                      className="bg-neutral-400 transition-all"
                      style={{ width: `${(request.accessSummary.rejected / request.accessSummary.totalDatasets) * 100}%` }}
                      title={`Rejected: ${request.accessSummary.rejected}`}
                    />
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs font-light mb-4">
                  <div className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-full bg-green-500" />
                    <span className="text-neutral-700">{request.accessSummary.instantAccess} accessible</span>
                  </div>
                  {request.accessSummary.approved > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full bg-blue-500" />
                      <span className="text-neutral-700">{request.accessSummary.approved} approved</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <div className="size-2.5 rounded-full bg-amber-500" />
                    <span className="text-neutral-700">{request.accessSummary.pendingApproval} pending</span>
                  </div>
                  {request.accessSummary.rejected > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="size-2.5 rounded-full bg-neutral-400" />
                      <span className="text-neutral-700">{request.accessSummary.rejected} rejected</span>
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-green-50 border border-green-200">
                    <Zap className="size-4 text-green-600" strokeWidth={1.5} />
                    <span className="text-sm font-light text-green-800">
                      <span className="font-normal">{request.accessSummary.instantAccess} datasets</span> available now
                    </span>
                  </div>
                  <Button
                    size="sm"
                    className={cn(
                      "rounded-full font-light bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
                      scheme.from,
                      scheme.to
                    )}
                  >
                    <ExternalLink className="size-4 mr-2" strokeWidth={1.5} />
                    Access Data
                  </Button>
                </div>
              </div>

              {/* Estimated Time */}
              <div className="shrink-0">
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="size-4 text-blue-600" strokeWidth={1.5} />
                    <span className="text-sm font-normal text-blue-900">Est. Full Access</span>
                  </div>
                  <p className="text-lg font-light text-blue-700">1-2 business days</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="flex gap-6">
        {/* Left Column - Main Content */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {[
              { id: "collections", label: "Collections", icon: Layers, badge: request.collections.length },
              { id: "datasets", label: "All Datasets", icon: Database, badge: request.allDatasets.length },
              { id: "timeline", label: "Timeline", icon: Clock, badge: request.timeline.length },
              { id: "discussion", label: "Discussion", icon: MessageSquare, badge: messages.length },
              { id: "help", label: "Help", icon: HelpCircle },
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 rounded-xl border font-light transition-all",
                    activeTab === tab.id
                      ? cn("border-current bg-gradient-to-r text-white", scheme.from, scheme.to)
                      : "border-neutral-200 bg-white hover:border-neutral-300 text-neutral-700"
                  )}
                >
                  <Icon className="size-4" strokeWidth={1.5} />
                  {tab.label}
                  {tab.badge && (
                    <Badge
                      className={cn(
                        "ml-1 rounded-full font-light text-xs",
                        activeTab === tab.id
                          ? "bg-white/20 text-white"
                          : "bg-neutral-100 text-neutral-600"
                      )}
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </button>
              )
            })}
          </div>

          {/* Collections Tab */}
          {activeTab === "collections" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {request.collections.map((collection) => {
                const colStatus = getCollectionStatusBadge(collection.status)
                const isExpanded = expandedCollections.has(collection.id)
                const totalAccessible = collection.accessibleDatasets
                const totalDatasets = collection.datasetCount

                return (
                  <Card key={collection.id} className="border-neutral-200 rounded-2xl overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base font-normal text-neutral-900">{collection.name}</h3>
                            <Badge className={cn("font-light text-xs", colStatus.color)}>
                              {colStatus.label}
                            </Badge>
                          </div>
                          <p className="text-sm font-light text-neutral-600 mb-3">
                            {collection.description}
                          </p>

                          {/* Intent Badges */}
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-xs font-light text-neutral-500">Intents:</span>
                            {collection.intents.map((intent) => (
                              <Badge
                                key={intent}
                                variant="outline"
                                className="font-light text-xs border-neutral-200"
                              >
                                {intent}
                              </Badge>
                            ))}
                          </div>

                          {/* Access Progress */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="font-light text-neutral-600">Dataset Access</span>
                              <span className="font-normal text-neutral-900">
                                {totalAccessible} of {totalDatasets} accessible
                              </span>
                            </div>
                            <div className="flex h-2 rounded-full overflow-hidden bg-neutral-100">
                              <div
                                className="bg-green-500"
                                style={{ width: `${(collection.accessibleDatasets / totalDatasets) * 100}%` }}
                              />
                              <div
                                className="bg-amber-500"
                                style={{ width: `${(collection.pendingDatasets / totalDatasets) * 100}%` }}
                              />
                              <div
                                className="bg-neutral-400"
                                style={{ width: `${(collection.rejectedDatasets / totalDatasets) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Approval Status */}
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-light text-neutral-500">Approvals:</span>
                            {collection.approvalStatus.map((approval) => (
                              <div key={approval.team} className="flex items-center gap-1.5">
                                {approval.status === "approved" ? (
                                  <CheckCircle2 className="size-3.5 text-green-600" strokeWidth={1.5} />
                                ) : approval.status === "rejected" ? (
                                  <XCircle className="size-3.5 text-red-600" strokeWidth={1.5} />
                                ) : (
                                  <Clock className="size-3.5 text-amber-600" strokeWidth={1.5} />
                                )}
                                <span className={cn(
                                  "text-xs font-light",
                                  approval.status === "approved" && "text-green-700",
                                  approval.status === "rejected" && "text-red-700",
                                  approval.status === "pending" && "text-amber-700"
                                )}>
                                  {approval.team}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right shrink-0 ml-6">
                          <p className="text-2xl font-light text-neutral-900">{totalDatasets}</p>
                          <p className="text-xs font-light text-neutral-500">datasets</p>
                        </div>
                      </div>

                      {/* Expand/Collapse & Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                        <button
                          onClick={() => toggleCollection(collection.id)}
                          className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 transition-colors"
                        >
                          {isExpanded ? (
                            <ChevronDown className="size-4" strokeWidth={1.5} />
                          ) : (
                            <ChevronRight className="size-4" strokeWidth={1.5} />
                          )}
                          {isExpanded ? "Hide" : "Show"} dataset details
                        </button>

                        {collection.accessibleDatasets > 0 && (
                          <Button
                            size="sm"
                            className={cn(
                              "rounded-full font-light bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
                              scheme.from,
                              scheme.to
                            )}
                          >
                            <ExternalLink className="size-4 mr-2" strokeWidth={1.5} />
                            Access {collection.accessibleDatasets} datasets
                          </Button>
                        )}
                      </div>

                      {/* Expanded Dataset List */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-neutral-100 animate-in fade-in duration-200">
                          <div className="space-y-2">
                            {request.allDatasets
                              .filter((ds) => ds.collectionId === collection.id)
                              .map((ds) => {
                                const dsStatus = getDatasetStatusBadge(ds.status)
                                return (
                                  <div
                                    key={ds.code}
                                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-50"
                                  >
                                    <div className="flex items-center gap-3">
                                      <Badge variant="outline" className="font-mono text-xs">
                                        {ds.code}
                                      </Badge>
                                      <span className="text-sm font-light text-neutral-700">{ds.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className={cn("font-light text-xs", dsStatus.color)}>
                                        {dsStatus.label}
                                      </Badge>
                                      {ds.status === "accessible" && ds.accessPlatform && (
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-7 px-3 rounded-full font-light text-xs border-neutral-200 text-neutral-600 hover:border-neutral-300"
                                        >
                                          {ds.accessPlatform}
                                          <ExternalLink className="size-3 ml-1.5" strokeWidth={1.5} />
                                        </Button>
                                      )}
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}

              {/* Standalone Datasets */}
              {request.standaloneDatasets.length > 0 && (
                <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Database className="size-4 text-neutral-500" strokeWidth={1.5} />
                      <h3 className="text-base font-normal text-neutral-900">Standalone Datasets</h3>
                      <Badge variant="outline" className="font-light text-xs">
                        {request.standaloneDatasets.length}
                      </Badge>
                    </div>
                    <p className="text-sm font-light text-neutral-600 mb-4">
                      These datasets were requested individually, not as part of a collection.
                    </p>
                    <div className="space-y-2">
                      {request.standaloneDatasets.map((ds) => {
                        const dsStatus = getDatasetStatusBadge(ds.status)
                        return (
                          <div
                            key={ds.code}
                            className="flex items-center justify-between p-3 rounded-xl bg-neutral-50"
                          >
                            <div className="flex items-center gap-3">
                              <Badge variant="outline" className="font-mono text-xs">
                                {ds.code}
                              </Badge>
                              <span className="text-sm font-light text-neutral-700">{ds.name}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={cn("font-light text-xs", dsStatus.color)}>
                                {dsStatus.label}
                              </Badge>
                              {ds.status === "accessible" && ds.accessPlatform && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-3 rounded-full font-light text-xs border-neutral-200 text-neutral-600 hover:border-neutral-300"
                                >
                                  {ds.accessPlatform}
                                  <ExternalLink className="size-3 ml-1.5" strokeWidth={1.5} />
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

            </div>
          )}

          {/* Datasets Tab */}
          {activeTab === "datasets" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  {/* Filters */}
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-sm">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" strokeWidth={1.5} />
                      <Input
                        placeholder="Search datasets..."
                        value={datasetSearch}
                        onChange={(e) => setDatasetSearch(e.target.value)}
                        className="pl-10 h-10 rounded-xl font-light border-2 border-neutral-200 hover:border-neutral-300 transition-colors"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="size-4 text-neutral-400" strokeWidth={1.5} />
                      <div className="relative custom-dropdown">
                        <button
                          onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                          className={cn(
                            "h-10 min-w-[160px] px-4 pr-10 rounded-xl border-2 font-light text-sm bg-white cursor-pointer text-left transition-all",
                            statusDropdownOpen
                              ? cn("border-current", scheme.from.replace("from-", "border-").replace("-500", "-400"))
                              : "border-neutral-200 hover:border-neutral-300"
                          )}
                        >
                          {getStatusFilterLabel(datasetStatusFilter)}
                        </button>
                        <ChevronDown
                          className={cn(
                            "absolute right-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400 pointer-events-none transition-transform",
                            statusDropdownOpen && "rotate-180"
                          )}
                          strokeWidth={1.5}
                        />
                        {statusDropdownOpen && (
                          <div className="absolute z-50 w-full mt-2 rounded-xl border-2 border-neutral-200 bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                            {statusFilterOptions.map((option) => (
                              <button
                                key={option.value}
                                onClick={() => {
                                  setDatasetStatusFilter(option.value)
                                  setStatusDropdownOpen(false)
                                }}
                                className={cn(
                                  "w-full px-4 py-2.5 text-left text-sm font-light transition-colors",
                                  datasetStatusFilter === option.value
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

                  {/* Table */}
                  <div className="border border-neutral-200 rounded-xl overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-neutral-50">
                        <tr className="border-b border-neutral-200">
                          <th className="text-left p-3 text-xs font-light text-neutral-500 uppercase tracking-wider">
                            Code
                          </th>
                          <th className="text-left p-3 text-xs font-light text-neutral-500 uppercase tracking-wider">
                            Name
                          </th>
                          <th className="text-left p-3 text-xs font-light text-neutral-500 uppercase tracking-wider">
                            Collection
                          </th>
                          <th className="text-left p-3 text-xs font-light text-neutral-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="text-left p-3 text-xs font-light text-neutral-500 uppercase tracking-wider">
                            Platform
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredDatasets.map((ds) => {
                          const dsStatus = getDatasetStatusBadge(ds.status)
                          return (
                            <tr key={ds.code} className="border-b border-neutral-100 hover:bg-neutral-50">
                              <td className="p-3">
                                <Badge variant="outline" className="font-mono text-xs">
                                  {ds.code}
                                </Badge>
                              </td>
                              <td className="p-3">
                                <span className="text-sm font-light text-neutral-900">{ds.name}</span>
                              </td>
                              <td className="p-3">
                                {ds.collectionName ? (
                                  <span className="text-sm font-light text-neutral-600">{ds.collectionName}</span>
                                ) : (
                                  <span className="text-sm font-light text-neutral-400 italic">Standalone</span>
                                )}
                              </td>
                              <td className="p-3">
                                <Badge className={cn("font-light text-xs", dsStatus.color)}>
                                  {dsStatus.label}
                                </Badge>
                              </td>
                              <td className="p-3">
                                {ds.status === "accessible" && ds.accessPlatform ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 px-3 rounded-full font-light text-xs border-neutral-200 text-neutral-700 hover:border-neutral-300"
                                  >
                                    {ds.accessPlatform}
                                    <ExternalLink className="size-3 ml-1.5" strokeWidth={1.5} />
                                  </Button>
                                ) : ds.approvalTeam ? (
                                  <span className="text-xs font-light text-neutral-500">
                                    Awaiting {ds.approvalTeam}
                                  </span>
                                ) : (
                                  <span className="text-xs font-light text-neutral-400">—</span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm font-light text-neutral-600">
                      Showing {filteredDatasets.length} of {request.allDatasets.length} datasets
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === "timeline" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Clock className="size-4 text-neutral-500" strokeWidth={1.5} />
                    <h3 className="text-base font-normal text-neutral-900">Request Timeline</h3>
                  </div>
                  <div className="space-y-4">
                    {request.timeline.map((event, i) => {
                      const isCompleted = event.status === "completed"
                      const isInProgress = event.status === "in_progress"
                      return (
                        <div key={event.id} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={cn(
                                "flex size-8 items-center justify-center rounded-full shrink-0",
                                isCompleted
                                  ? "bg-green-100"
                                  : isInProgress
                                  ? cn("bg-gradient-to-br", scheme.from, scheme.to)
                                  : "bg-neutral-100"
                              )}
                            >
                              {isCompleted ? (
                                <CheckCircle2 className="size-4 text-green-600" strokeWidth={1.5} />
                              ) : isInProgress ? (
                                <div className="size-3 rounded-full bg-white animate-pulse" />
                              ) : (
                                <div className="size-2 rounded-full bg-neutral-300" />
                              )}
                            </div>
                            {i < request.timeline.length - 1 && (
                              <div
                                className={cn(
                                  "w-0.5 h-8 mt-1",
                                  isCompleted ? "bg-green-200" : "bg-neutral-200"
                                )}
                              />
                            )}
                          </div>
                          <div className="flex-1 pb-2">
                            <p
                              className={cn(
                                "text-sm",
                                isCompleted || isInProgress
                                  ? "font-normal text-neutral-900"
                                  : "font-light text-neutral-500"
                              )}
                            >
                              {event.event}
                            </p>
                            {event.details && (
                              <p className="text-xs font-light text-neutral-500 mt-0.5">
                                {event.details}
                              </p>
                            )}
                            {isCompleted && (
                              <p className="text-xs font-light text-neutral-500 mt-0.5">
                                {formatRelativeTime(event.timestamp)}
                              </p>
                            )}
                            {isInProgress && (
                              <Badge
                                className={cn(
                                  "mt-1.5 font-light text-xs bg-gradient-to-r text-white",
                                  scheme.from,
                                  scheme.to
                                )}
                              >
                                In Progress
                              </Badge>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Discussion Tab */}
          {activeTab === "discussion" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MessageSquare className="size-4 text-neutral-500" strokeWidth={1.5} />
                    <h3 className="text-base font-normal text-neutral-900">Discussion with DCM</h3>
                  </div>

                  {/* Messages */}
                  <div className="space-y-4 mb-6 max-h-[500px] overflow-y-auto">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "flex",
                          msg.author.isUser ? "justify-end" : "justify-start"
                        )}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-2xl p-4",
                            msg.author.isUser
                              ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                              : msg.type === "status_update"
                              ? "bg-blue-50 border border-blue-200"
                              : "bg-neutral-100"
                          )}
                        >
                          {!msg.author.isUser && (
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={cn(
                                  "text-xs font-normal",
                                  msg.type === "status_update" ? "text-blue-700" : "text-neutral-900"
                                )}
                              >
                                {msg.author.name}
                              </span>
                              <span
                                className={cn(
                                  "text-xs font-light",
                                  msg.type === "status_update" ? "text-blue-600" : "text-neutral-500"
                                )}
                              >
                                {msg.author.role}
                              </span>
                            </div>
                          )}
                          <p
                            className={cn(
                              "text-sm font-light",
                              msg.author.isUser
                                ? "text-white"
                                : msg.type === "status_update"
                                ? "text-blue-800"
                                : "text-neutral-700"
                            )}
                          >
                            {msg.content}
                          </p>
                          <p
                            className={cn(
                              "text-xs font-light mt-2",
                              msg.author.isUser
                                ? "text-white/70"
                                : msg.type === "status_update"
                                ? "text-blue-600"
                                : "text-neutral-500"
                            )}
                          >
                            {formatRelativeTime(msg.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Compose */}
                  <div className="flex gap-3">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message to your DCM..."
                      className="min-h-[80px] rounded-xl font-light border-2 border-neutral-200 hover:border-neutral-300 focus-visible:border-neutral-400 resize-none transition-colors"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                          handleSendMessage()
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={cn(
                        "h-auto px-4 rounded-xl font-light bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
                        scheme.from,
                        scheme.to
                      )}
                    >
                      <Send className="size-4" strokeWidth={1.5} />
                    </Button>
                  </div>
                  <p className="text-xs font-light text-neutral-500 mt-2">
                    Press Cmd+Enter to send
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Help Tab */}
          {activeTab === "help" && (
            <div className="space-y-4 animate-in fade-in duration-300">
              {/* FAQ */}
              <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <HelpCircle className="size-4 text-neutral-500" strokeWidth={1.5} />
                    <h3 className="text-base font-normal text-neutral-900">Frequently Asked Questions</h3>
                  </div>

                  <div className="space-y-2">
                    {FAQ_ITEMS.map((faq, i) => (
                      <div key={i} className="border border-neutral-200 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-neutral-50 transition-colors"
                        >
                          <span className="text-sm font-normal text-neutral-900">{faq.question}</span>
                          {expandedFaq === i ? (
                            <ChevronDown className="size-4 text-neutral-400" strokeWidth={1.5} />
                          ) : (
                            <ChevronRight className="size-4 text-neutral-400" strokeWidth={1.5} />
                          )}
                        </button>
                        {expandedFaq === i && (
                          <div className="px-4 pb-4 animate-in fade-in duration-200">
                            <p className="text-sm font-light text-neutral-600 leading-relaxed">
                              {faq.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Help Resources */}
              <Card className="border-neutral-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="size-4 text-neutral-500" strokeWidth={1.5} />
                    <h3 className="text-base font-normal text-neutral-900">Help Resources</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-blue-100">
                        <BookOpen className="size-5 text-blue-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-normal text-neutral-900">Documentation</p>
                        <p className="text-xs font-light text-neutral-500">Learn how to use Collectoid</p>
                      </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-purple-100">
                        <Headphones className="size-5 text-purple-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-normal text-neutral-900">Contact Support</p>
                        <p className="text-xs font-light text-neutral-500">Get help from our team</p>
                      </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-green-100">
                        <Video className="size-5 text-green-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-normal text-neutral-900">Video Tutorials</p>
                        <p className="text-xs font-light text-neutral-500">Watch step-by-step guides</p>
                      </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all text-left">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-amber-100">
                        <AlertCircle className="size-5 text-amber-600" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm font-normal text-neutral-900">Report an Issue</p>
                        <p className="text-xs font-light text-neutral-500">Something not working?</p>
                      </div>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 shrink-0 space-y-4">
          {/* DCM Contact Card */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-sm font-normal text-neutral-900 mb-4">Your DCM Contact</h3>

              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  "flex size-14 items-center justify-center rounded-full bg-gradient-to-br text-white text-lg font-light shrink-0",
                  scheme.from,
                  scheme.to
                )}>
                  {request.dcmContact.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-base font-normal text-neutral-900">{request.dcmContact.name}</p>
                  <p className="text-sm font-light text-neutral-600">{request.dcmContact.role}</p>
                  <Badge variant="outline" className="font-light text-xs mt-1">
                    {request.dcmContact.team}
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-50 mb-4">
                <Clock className="size-4 text-neutral-400" strokeWidth={1.5} />
                <span className="text-xs font-light text-neutral-600">
                  Typical response: <span className="font-normal">{request.dcmContact.responseTime}</span>
                </span>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full rounded-full font-light border-neutral-200"
                  onClick={() => setActiveTab("discussion")}
                >
                  <MessageSquare className="size-4 mr-2" strokeWidth={1.5} />
                  Send Message
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full font-light border-neutral-200"
                >
                  <Mail className="size-4 mr-2" strokeWidth={1.5} />
                  Email
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-full font-light border-neutral-200"
                >
                  <Video className="size-4 mr-2" strokeWidth={1.5} />
                  Request Call
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-sm font-normal text-neutral-900 mb-4">Quick Actions</h3>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-full font-light border-neutral-200"
                >
                  <Edit className="size-4 mr-2" strokeWidth={1.5} />
                  Modify Request
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-full font-light border-neutral-200"
                >
                  <FileText className="size-4 mr-2" strokeWidth={1.5} />
                  Export Summary
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start rounded-full font-light border-red-200 text-red-600 hover:bg-red-50"
                >
                  <X className="size-4 mr-2" strokeWidth={1.5} />
                  Cancel Request
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Platform Access */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-sm font-normal text-neutral-900 mb-4">Access Your Data</h3>
              <p className="text-xs font-light text-neutral-600 mb-4">
                Your accessible datasets are available on these platforms:
              </p>

              <div className="space-y-2">
                {request.platforms.map((platform) => (
                  <button
                    key={platform.name}
                    className="w-full flex items-center justify-between p-3 rounded-xl border border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-neutral-100">
                        <Database className="size-4 text-neutral-600" strokeWidth={1.5} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-normal text-neutral-900">{platform.name}</p>
                        <p className="text-xs font-light text-neutral-500">{platform.datasetCount} datasets</p>
                      </div>
                    </div>
                    <ExternalLink className="size-4 text-neutral-400" strokeWidth={1.5} />
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

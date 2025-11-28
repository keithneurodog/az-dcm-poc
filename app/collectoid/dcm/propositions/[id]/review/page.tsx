"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  ArrowLeft,
  CheckCircle2,
  Clock,
  Users,
  Database,
  FileText,
  MessageSquare,
  Send,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  GitMerge,
  FileEdit,
  AlertTriangle,
  Shield,
  Check,
  X,
  ExternalLink,
  Mail,
  Building,
  Layers,
} from "lucide-react"

// Mock proposition data
const MOCK_PROPOSITION = {
  id: "prop-001",
  type: "custom_collection",
  name: "Immunotherapy + ML Research Collection",
  parentCollection: {
    id: "col-2",
    name: "Immunotherapy Response Collection",
  },
  requester: {
    name: "Dr. Sarah Chen",
    department: "Oncology Data Science",
    email: "sarah.chen@company.com",
    role: "Senior Data Scientist",
    joinedDate: "2021-03-15",
    previousRequests: 12,
    approvalRate: 95,
  },
  submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  status: "pending",
  priority: "high",
  rationale: "I need to train ML models for immunotherapy response prediction. The existing collection doesn't allow AI research, but my project requires this capability for developing predictive algorithms that could help identify patients most likely to respond to immunotherapy treatments.",
  expectedDuration: "1 year",
  changes: {
    datasetsAdded: [
      { code: "DCODE-401", name: "Immunotherapy Response Predictors", phase: "Phase III", patients: 580 },
      { code: "DCODE-422", name: "Lung Cancer Genomics Panel", phase: "Phase II", patients: 210 },
    ],
    datasetsRemoved: [],
    intentChanges: {
      added: ["AI research / AI model training"],
      removed: [],
    },
  },
  currentAoT: {
    primaryUse: {
      understandDrugMechanism: true,
      understandDisease: true,
      developDiagnosticTests: true,
      learnFromPastStudies: true,
      improveAnalysisMethods: true,
    },
    beyondPrimaryUse: {
      aiResearch: false,
      softwareDevelopment: false,
    },
    publication: {
      internalCompanyRestricted: true,
      externalPublication: false,
    },
  },
  requestedAoT: {
    primaryUse: {
      understandDrugMechanism: true,
      understandDisease: true,
      developDiagnosticTests: true,
      learnFromPastStudies: true,
      improveAnalysisMethods: true,
    },
    beyondPrimaryUse: {
      aiResearch: true,
      softwareDevelopment: false,
    },
    publication: {
      internalCompanyRestricted: true,
      externalPublication: false,
    },
  },
  recommendation: "auto_approve",
  recommendationReason: "Minor changes, requester has good standing, AI research is commonly approved for this data type",
  similarCollections: [
    { name: "Oncology ML Training Bundle", similarity: 75, users: 45 },
  ],
  discussion: [
    {
      id: 1,
      author: "System",
      message: "Proposition submitted by Dr. Sarah Chen",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isSystem: true,
    },
  ],
}

export default function DCMPropositionReviewPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const params = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [decision, setDecision] = useState<string | null>(null)
  const [feedback, setFeedback] = useState("")
  const [mergeTarget, setMergeTarget] = useState("")
  const [newMessage, setNewMessage] = useState("")

  const proposition = MOCK_PROPOSITION

  const handleApprove = async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push("/collectoid/dcm/propositions?approved=true")
  }

  const handleReject = async () => {
    if (!feedback.trim()) {
      alert("Please provide feedback for the rejection")
      return
    }
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push("/collectoid/dcm/propositions?rejected=true")
  }

  const handleRequestChanges = async () => {
    if (!feedback.trim()) {
      alert("Please specify the changes needed")
      return
    }
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push("/collectoid/dcm/propositions?changes_requested=true")
  }

  const handleMerge = async () => {
    if (!mergeTarget) {
      alert("Please select a collection to merge with")
      return
    }
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    router.push("/collectoid/dcm/propositions?merged=true")
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return
    // In real app, would send message
    setNewMessage("")
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/collectoid/dcm/propositions")}
          className="rounded-full font-light mb-4"
        >
          <ArrowLeft className="size-4 mr-2" strokeWidth={1.5} />
          Back to Propositions
        </Button>

        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight">
                {proposition.name}
              </h1>
              <Badge variant="outline" className="font-mono text-xs">
                {proposition.id.toUpperCase()}
              </Badge>
              <Badge className="bg-amber-100 text-amber-700 font-light text-xs">
                <Clock className="size-3 mr-1" strokeWidth={1.5} />
                Pending Review
              </Badge>
              <Badge className="bg-red-100 text-red-700 font-light text-xs">
                High Priority
              </Badge>
            </div>
            <p className="text-sm font-light text-neutral-600 mb-2">
              Custom collection request based on {proposition.parentCollection.name}
            </p>
            <div className="flex items-center gap-4 text-sm font-light text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Users className="size-4" strokeWidth={1.5} />
                {proposition.requester.name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="size-4" strokeWidth={1.5} />
                Submitted 2 hours ago
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Layers className="size-4" strokeWidth={1.5} />
                {proposition.changes.datasetsAdded.length} datasets added
              </span>
            </div>
          </div>

          {/* Recommendation Badge */}
          <Card className="border-green-200 bg-green-50 rounded-2xl shrink-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <ThumbsUp className="size-4 text-green-600" strokeWidth={1.5} />
                <span className="text-sm font-normal text-green-900">Recommended: Auto-Approve</span>
              </div>
              <p className="text-xs font-light text-green-700 max-w-xs">
                {proposition.recommendationReason}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Requester Info */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-base font-normal text-neutral-900 mb-4">Requester Information</h3>

              <div className="flex items-start gap-6">
                <div className="flex size-14 items-center justify-center rounded-full bg-neutral-50 border border-neutral-200 shrink-0">
                  <Users className="size-6 text-neutral-400" strokeWidth={1.5} />
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-lg font-normal text-neutral-900">{proposition.requester.name}</p>
                    <p className="text-sm font-light text-neutral-600">{proposition.requester.role}</p>
                  </div>
                  <div className="text-right">
                    <Button variant="outline" size="sm" className="rounded-full font-light border-neutral-200">
                      <Mail className="size-4 mr-2" strokeWidth={1.5} />
                      Contact
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building className="size-4 text-neutral-400" strokeWidth={1.5} />
                    <span className="text-sm font-light text-neutral-600">{proposition.requester.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="size-4 text-neutral-400" strokeWidth={1.5} />
                    <span className="text-sm font-light text-neutral-600">{proposition.requester.email}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-neutral-100">
                <div className="text-center">
                  <p className="text-2xl font-light text-neutral-900">{proposition.requester.previousRequests}</p>
                  <p className="text-xs font-light text-neutral-500">Previous Requests</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-light text-green-600">{proposition.requester.approvalRate}%</p>
                  <p className="text-xs font-light text-neutral-500">Approval Rate</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-light text-neutral-900">3+</p>
                  <p className="text-xs font-light text-neutral-500">Years at Company</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rationale */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-base font-normal text-neutral-900 mb-4">Request Rationale</h3>
              <p className="text-sm font-light text-neutral-700 leading-relaxed mb-4">
                "{proposition.rationale}"
              </p>
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-neutral-400" strokeWidth={1.5} />
                <span className="text-sm font-light text-neutral-600">
                  Expected duration: <span className="font-normal">{proposition.expectedDuration}</span>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Changes Summary */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-base font-normal text-neutral-900 mb-4">Requested Changes</h3>

              {/* Datasets Added */}
              {proposition.changes.datasetsAdded.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-normal text-green-700 mb-3">
                    + Datasets to Add ({proposition.changes.datasetsAdded.length})
                  </h4>
                  <div className="space-y-2">
                    {proposition.changes.datasetsAdded.map((dataset) => (
                      <div
                        key={dataset.code}
                        className="flex items-center justify-between p-3 rounded-xl bg-green-50 border border-green-100"
                      >
                        <div className="flex items-center gap-3">
                          <Badge className="bg-green-100 text-green-700 font-mono text-xs">
                            {dataset.code}
                          </Badge>
                          <div>
                            <p className="text-sm font-light text-neutral-700">{dataset.name}</p>
                            <p className="text-xs font-light text-neutral-500">
                              {dataset.phase} • {dataset.patients} patients
                            </p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm" className="rounded-full text-neutral-400 hover:text-neutral-600">
                          <ExternalLink className="size-4" strokeWidth={1.5} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Intent Changes */}
              {proposition.changes.intentChanges.added.length > 0 && (
                <div>
                  <h4 className="text-sm font-normal text-amber-700 mb-3">
                    Intent Modifications
                  </h4>
                  <div className="space-y-2">
                    {proposition.changes.intentChanges.added.map((intent, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200"
                      >
                        <Shield className="size-4 text-amber-600" strokeWidth={1.5} />
                        <span className="text-sm font-light text-amber-800">
                          <span className="font-normal">{intent}</span> - requesting access
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AoT Comparison */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="size-4 text-neutral-500" strokeWidth={1.5} />
                <h3 className="text-base font-normal text-neutral-900">Agreement of Terms Comparison</h3>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {/* Current */}
                <div>
                  <h4 className="text-sm font-normal text-neutral-700 mb-3">Current (Parent Collection)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {proposition.currentAoT.beyondPrimaryUse.aiResearch ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <X className="size-4 text-red-600" />
                      )}
                      <span className="text-sm font-light text-neutral-700">AI research / AI model training</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {proposition.currentAoT.beyondPrimaryUse.softwareDevelopment ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <X className="size-4 text-red-600" />
                      )}
                      <span className="text-sm font-light text-neutral-700">Software development</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {proposition.currentAoT.publication.externalPublication ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <X className="size-4 text-red-600" />
                      )}
                      <span className="text-sm font-light text-neutral-700">External publication</span>
                    </div>
                  </div>
                </div>

                {/* Requested */}
                <div>
                  <h4 className="text-sm font-normal text-neutral-700 mb-3">Requested</h4>
                  <div className="space-y-2">
                    <div className={cn(
                      "flex items-center gap-2 p-2 rounded-lg",
                      proposition.requestedAoT.beyondPrimaryUse.aiResearch !== proposition.currentAoT.beyondPrimaryUse.aiResearch
                        ? "bg-amber-50"
                        : ""
                    )}>
                      {proposition.requestedAoT.beyondPrimaryUse.aiResearch ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <X className="size-4 text-red-600" />
                      )}
                      <span className="text-sm font-light text-neutral-700">AI research / AI model training</span>
                      {proposition.requestedAoT.beyondPrimaryUse.aiResearch !== proposition.currentAoT.beyondPrimaryUse.aiResearch && (
                        <Badge className="bg-amber-100 text-amber-700 text-xs font-light ml-auto">Changed</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {proposition.requestedAoT.beyondPrimaryUse.softwareDevelopment ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <X className="size-4 text-red-600" />
                      )}
                      <span className="text-sm font-light text-neutral-700">Software development</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {proposition.requestedAoT.publication.externalPublication ? (
                        <Check className="size-4 text-green-600" />
                      ) : (
                        <X className="size-4 text-red-600" />
                      )}
                      <span className="text-sm font-light text-neutral-700">External publication</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Discussion */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="size-4 text-neutral-500" strokeWidth={1.5} />
                <h3 className="text-base font-normal text-neutral-900">Discussion</h3>
              </div>

              <div className="space-y-4 mb-4">
                {proposition.discussion.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "p-3 rounded-lg",
                      msg.isSystem ? "bg-neutral-50" : "bg-blue-50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={cn(
                        "text-sm",
                        msg.isSystem ? "font-light text-neutral-500" : "font-normal text-neutral-900"
                      )}>
                        {msg.author}
                      </span>
                      <span className="text-xs font-light text-neutral-400">
                        {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-sm font-light text-neutral-700">{msg.message}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Send a message to the requester..."
                  className="min-h-[80px] rounded-xl border-neutral-200 font-light resize-none"
                />
                <Button
                  onClick={handleSendMessage}
                  className={cn(
                    "h-auto px-4 rounded-xl font-light bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
                    scheme.from,
                    scheme.to
                  )}
                >
                  <Send className="size-4" strokeWidth={1.5} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Decision Panel - 1 column */}
        <div className="space-y-6">
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-base font-normal text-neutral-900 mb-4">Decision</h3>

              <div className="space-y-2 mb-6">
                {/* Approve */}
                <button
                  onClick={() => setDecision("approve")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all",
                    decision === "approve"
                      ? "border-green-300 bg-green-50"
                      : "border-neutral-200 hover:border-green-200 hover:bg-green-50/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      decision === "approve" ? "bg-green-100" : "bg-neutral-100"
                    )}>
                      <ThumbsUp className={cn(
                        "size-4",
                        decision === "approve" ? "text-green-600" : "text-neutral-500"
                      )} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-normal text-neutral-900">Approve</p>
                      <p className="text-xs font-light text-neutral-500">Create new collection as requested</p>
                    </div>
                  </div>
                </button>

                {/* Request Changes */}
                <button
                  onClick={() => setDecision("request_changes")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all",
                    decision === "request_changes"
                      ? "border-amber-300 bg-amber-50"
                      : "border-neutral-200 hover:border-amber-200 hover:bg-amber-50/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      decision === "request_changes" ? "bg-amber-100" : "bg-neutral-100"
                    )}>
                      <FileEdit className={cn(
                        "size-4",
                        decision === "request_changes" ? "text-amber-600" : "text-neutral-500"
                      )} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-normal text-neutral-900">Request Changes</p>
                      <p className="text-xs font-light text-neutral-500">Ask for modifications before approval</p>
                    </div>
                  </div>
                </button>

                {/* Merge */}
                <button
                  onClick={() => setDecision("merge")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all",
                    decision === "merge"
                      ? "border-purple-300 bg-purple-50"
                      : "border-neutral-200 hover:border-purple-200 hover:bg-purple-50/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      decision === "merge" ? "bg-purple-100" : "bg-neutral-100"
                    )}>
                      <GitMerge className={cn(
                        "size-4",
                        decision === "merge" ? "text-purple-600" : "text-neutral-500"
                      )} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-normal text-neutral-900">Merge</p>
                      <p className="text-xs font-light text-neutral-500">Add to existing similar collection</p>
                    </div>
                  </div>
                </button>

                {/* Reject */}
                <button
                  onClick={() => setDecision("reject")}
                  className={cn(
                    "w-full p-3 rounded-xl border text-left transition-all",
                    decision === "reject"
                      ? "border-red-300 bg-red-50"
                      : "border-neutral-200 hover:border-red-200 hover:bg-red-50/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      decision === "reject" ? "bg-red-100" : "bg-neutral-100"
                    )}>
                      <ThumbsDown className={cn(
                        "size-4",
                        decision === "reject" ? "text-red-600" : "text-neutral-500"
                      )} strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="text-sm font-normal text-neutral-900">Reject</p>
                      <p className="text-xs font-light text-neutral-500">Decline with feedback</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Conditional Fields */}
              {decision === "merge" && (
                <div className="mb-4">
                  <Label className="text-sm font-normal text-neutral-700 mb-2 block">
                    Merge with collection
                  </Label>
                  <Select value={mergeTarget} onValueChange={setMergeTarget}>
                    <SelectTrigger className="w-full h-11 rounded-xl border-neutral-200 font-light">
                      <SelectValue placeholder="Select collection" />
                    </SelectTrigger>
                    <SelectContent>
                      {proposition.similarCollections.map((col) => (
                        <SelectItem key={col.name} value={col.name} className="font-light">
                          {col.name} ({col.similarity}% similar)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {(decision === "request_changes" || decision === "reject") && (
                <div className="mb-4">
                  <Label className="text-sm font-normal text-neutral-700 mb-2 block">
                    {decision === "reject" ? "Rejection reason" : "Changes needed"}
                  </Label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder={decision === "reject"
                      ? "Explain why this request cannot be approved..."
                      : "Specify what changes are needed..."}
                    className="min-h-[100px] rounded-xl border-neutral-200 font-light resize-none"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                {decision === "approve" && (
                  <Button
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="w-full h-11 rounded-full font-light bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" strokeWidth={1.5} />
                        Approving...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="size-4 mr-2" strokeWidth={1.5} />
                        Approve Proposition
                      </>
                    )}
                  </Button>
                )}

                {decision === "request_changes" && (
                  <Button
                    onClick={handleRequestChanges}
                    disabled={isSubmitting || !feedback.trim()}
                    className="w-full h-11 rounded-full font-light bg-amber-600 hover:bg-amber-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" strokeWidth={1.5} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FileEdit className="size-4 mr-2" strokeWidth={1.5} />
                        Request Changes
                      </>
                    )}
                  </Button>
                )}

                {decision === "merge" && (
                  <Button
                    onClick={handleMerge}
                    disabled={isSubmitting || !mergeTarget}
                    className="w-full h-11 rounded-full font-light bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" strokeWidth={1.5} />
                        Merging...
                      </>
                    ) : (
                      <>
                        <GitMerge className="size-4 mr-2" strokeWidth={1.5} />
                        Merge Collections
                      </>
                    )}
                  </Button>
                )}

                {decision === "reject" && (
                  <Button
                    onClick={handleReject}
                    disabled={isSubmitting || !feedback.trim()}
                    className="w-full h-11 rounded-full font-light bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg transition-all"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="size-4 mr-2 animate-spin" strokeWidth={1.5} />
                        Rejecting...
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="size-4 mr-2" strokeWidth={1.5} />
                        Reject Proposition
                      </>
                    )}
                  </Button>
                )}

                {!decision && (
                  <p className="text-xs font-light text-neutral-500 text-center py-2">
                    Select a decision above to continue
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Similar Collections */}
          {proposition.similarCollections.length > 0 && (
            <Card className="border-neutral-200 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Layers className="size-4 text-neutral-500" strokeWidth={1.5} />
                  <h3 className="text-base font-normal text-neutral-900">Similar Collections</h3>
                </div>
                <div className="space-y-3">
                  {proposition.similarCollections.map((col) => (
                    <div
                      key={col.name}
                      className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 hover:border-neutral-200 transition-colors"
                    >
                      <p className="text-sm font-normal text-neutral-900 mb-1">{col.name}</p>
                      <div className="flex items-center gap-3 text-xs font-light text-neutral-500">
                        <span>{col.similarity}% similar</span>
                        <span>•</span>
                        <span>{col.users} users</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

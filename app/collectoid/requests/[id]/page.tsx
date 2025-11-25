"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useColorScheme } from "@/components/ux12-color-context"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  Clock,
  Zap,
  ExternalLink,
  MessageSquare,
  ArrowRight,
  FileText,
  Database,
  Sparkles,
  Bell,
  Copy,
  Check,
} from "lucide-react"

// Mock request data for simple request
const MOCK_SIMPLE_REQUEST = {
  id: "req-123456",
  type: "simple",
  status: "partial_access",
  collectionId: "col-1",
  collectionName: "Oncology ctDNA Outcomes Collection",
  submittedAt: new Date(),
  instantAccess: {
    count: 8,
    datasets: [
      { code: "DCODE-001", name: "NSCLC Genomic Profiling" },
      { code: "DCODE-023", name: "Lung Cancer Survival Outcomes" },
      { code: "DCODE-045", name: "Immunotherapy Response Study" },
      { code: "DCODE-088", name: "Lung Cancer Clinical Outcomes" },
      { code: "DCODE-102", name: "PET Imaging Substudy" },
      { code: "DCODE-134", name: "Biomarker Validation Study" },
      { code: "DCODE-288", name: "ctDNA Dynamics Study" },
      { code: "DCODE-312", name: "Response Prediction Analysis" },
    ],
  },
  pendingApproval: {
    count: 8,
    estimatedDays: "2-3",
    datasets: [
      { code: "DCODE-042", name: "NSCLC ctDNA Monitoring", approvalTeam: "GPT-Oncology" },
      { code: "DCODE-067", name: "Immunotherapy Response Phase III", approvalTeam: "GPT-Oncology" },
      { code: "DCODE-156", name: "Active NSCLC Trial", approvalTeam: "GPT-Oncology" },
      { code: "DCODE-178", name: "Ongoing Immunotherapy Study", approvalTeam: "GPT-Oncology" },
      { code: "DCODE-189", name: "Multi-Site Biomarker Trial", approvalTeam: "GPT-Oncology" },
      { code: "DCODE-201", name: "Phase III Active Study", approvalTeam: "GPT-Oncology" },
      { code: "DCODE-223", name: "Multi-Regional Study", approvalTeam: "TALT-Legal" },
      { code: "DCODE-267", name: "European Consortium Study", approvalTeam: "TALT-Legal" },
    ],
  },
  platforms: [
    { name: "Domino Data Lab", url: "#", icon: "domino" },
    { name: "SCP Platform", url: "#", icon: "scp" },
    { name: "AiBench", url: "#", icon: "aibench" },
  ],
}

// Mock request data for proposition
const MOCK_PROPOSITION = {
  id: "prop-789012",
  type: "proposition",
  status: "under_review",
  collectionId: "col-1",
  parentCollectionName: "Oncology ctDNA Outcomes Collection",
  propositionName: "Oncology ctDNA + Software Development Rights",
  submittedAt: new Date(),
  estimatedReviewDays: "3-5",
  changes: {
    datasetsRemoved: 2,
    datasetsAdded: 1,
    intentChanges: ["Software development and testing (added)"],
  },
  timeline: [
    { date: new Date(), event: "Proposition submitted", status: "completed" },
    { date: null, event: "DCM review", status: "in_progress" },
    { date: null, event: "Approval decision", status: "pending" },
    { date: null, event: "Access granted", status: "pending" },
  ],
}

export default function RequestConfirmationPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const [copied, setCopied] = useState(false)

  const isProposition = searchParams.get("type") === "proposition"
  const request = isProposition ? MOCK_PROPOSITION : MOCK_SIMPLE_REQUEST

  const handleCopyId = () => {
    navigator.clipboard.writeText(request.id)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Simple Request View
  if (!isProposition) {
    const simpleRequest = request as typeof MOCK_SIMPLE_REQUEST
    return (
      <div className="py-8 max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className={cn(
            "flex size-20 items-center justify-center rounded-full mx-auto mb-6 bg-gradient-to-br",
            scheme.from,
            scheme.to
          )}>
            <CheckCircle2 className="size-10 text-white" />
          </div>
          <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight mb-2">
            Request Submitted
          </h1>
          <p className="text-base font-light text-neutral-600">
            Your access request has been processed
          </p>
        </div>

        {/* Request ID */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-sm font-light text-neutral-500">Request ID:</span>
          <Badge variant="outline" className="font-mono text-sm">
            {simpleRequest.id}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyId}
            className="h-8 w-8 p-0"
          >
            {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4 text-neutral-400" />}
          </Button>
        </div>

        {/* Access Status Cards */}
        <div className="space-y-4 mb-8">
          {/* Instant Access */}
          <Card className="border-green-200 bg-green-50 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-green-100 shrink-0">
                  <Zap className="size-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-normal text-green-900">
                      {simpleRequest.instantAccess.count} datasets: Instant Access Granted
                    </h3>
                    <CheckCircle2 className="size-5 text-green-600" />
                  </div>
                  <p className="text-sm font-light text-green-700 mb-4">
                    You can access these datasets right now
                  </p>

                  {/* Dataset List */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {simpleRequest.instantAccess.datasets.slice(0, 6).map((dataset) => (
                      <div key={dataset.code} className="flex items-center gap-2">
                        <Badge className="bg-green-200 text-green-800 font-mono text-xs">
                          {dataset.code}
                        </Badge>
                        <span className="text-xs font-light text-green-700 truncate">
                          {dataset.name}
                        </span>
                      </div>
                    ))}
                    {simpleRequest.instantAccess.datasets.length > 6 && (
                      <span className="text-xs font-light text-green-600">
                        +{simpleRequest.instantAccess.datasets.length - 6} more
                      </span>
                    )}
                  </div>

                  {/* Platform Links */}
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-light text-green-700">Access via:</span>
                    {simpleRequest.platforms.map((platform) => (
                      <Button
                        key={platform.name}
                        variant="outline"
                        size="sm"
                        className="rounded-lg font-light border-green-300 text-green-700 hover:bg-green-100"
                      >
                        {platform.name}
                        <ExternalLink className="size-3 ml-1" />
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approval */}
          <Card className="border-amber-200 bg-amber-50 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-100 shrink-0">
                  <Clock className="size-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-normal text-amber-900">
                      {simpleRequest.pendingApproval.count} datasets: Under Review
                    </h3>
                  </div>
                  <p className="text-sm font-light text-amber-700 mb-4">
                    Estimated time: <span className="font-normal">{simpleRequest.pendingApproval.estimatedDays} business days</span>
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <Progress value={25} className="h-2 bg-amber-200" />
                  </div>

                  {/* Approval Teams */}
                  <div className="space-y-2">
                    <p className="text-xs font-light text-amber-700">Pending approval from:</p>
                    <div className="flex flex-wrap gap-2">
                      {[...new Set(simpleRequest.pendingApproval.datasets.map(d => d.approvalTeam))].map((team) => (
                        <Badge
                          key={team}
                          variant="outline"
                          className="font-light text-xs border-amber-300 text-amber-700"
                        >
                          {team}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collection Added */}
        <Card className="border-neutral-200 rounded-2xl mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-100">
                  <Database className="size-5 text-neutral-600" />
                </div>
                <div>
                  <p className="text-sm font-light text-neutral-600">You've been added to</p>
                  <p className="text-base font-normal text-neutral-900">{simpleRequest.collectionName}</p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("dcm_current_collection_id", simpleRequest.collectionId)
                  }
                  router.push("/collectoid/dcm/progress")
                }}
                className="rounded-lg font-light border-neutral-200"
              >
                View Collection
                <ExternalLink className="size-3 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/collectoid/my-requests")}
            className="h-12 rounded-xl font-light border-neutral-200"
          >
            <FileText className="size-4 mr-2" />
            View All Requests
          </Button>
          <Button
            onClick={() => router.push("/collectoid/discover")}
            className={cn(
              "h-12 rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
              scheme.from,
              scheme.to
            )}
          >
            Continue Exploring
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>

        {/* Notification Opt-in */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
            <Bell className="size-4 text-neutral-500" />
            <span className="text-sm font-light text-neutral-600">
              We'll notify you when your remaining datasets are approved
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Proposition View
  const proposition = request as typeof MOCK_PROPOSITION
  return (
    <div className="py-8 max-w-3xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight mb-2">
          Proposition Submitted
        </h1>
        <p className="text-base font-light text-neutral-600">
          Your custom collection request is now under review
        </p>
      </div>

      {/* Proposition ID */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <span className="text-sm font-light text-neutral-500">Proposition ID:</span>
        <Badge variant="outline" className="font-mono text-sm">
          {proposition.id.toUpperCase()}
        </Badge>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyId}
          className="h-8 w-8 p-0"
        >
          {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4 text-neutral-400" />}
        </Button>
      </div>

      {/* Proposition Details */}
      <Card className={cn(
        "border-2 rounded-2xl overflow-hidden mb-6",
        scheme.from.replace("from-", "border-").replace("-500", "-200")
      )}>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br shrink-0",
              scheme.from,
              scheme.to
            )}>
              <Sparkles className="size-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-normal text-neutral-900 mb-1">
                {proposition.propositionName}
              </h3>
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-light text-neutral-500">
                  Based on
                </p>
                <button
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("dcm_current_collection_id", proposition.collectionId)
                    }
                    router.push("/collectoid/dcm/progress")
                  }}
                  className={cn(
                    "text-sm font-normal hover:underline transition-colors",
                    scheme.from.replace("from-", "text-")
                  )}
                >
                  {proposition.parentCollectionName}
                </button>
                <ExternalLink className="size-3 text-neutral-400" />
              </div>

              {/* Changes Summary */}
              <div className="space-y-2 mb-4">
                <p className="text-sm font-normal text-neutral-700">Requested changes:</p>
                <div className="flex flex-wrap gap-2">
                  {proposition.changes.datasetsRemoved > 0 && (
                    <Badge variant="outline" className="font-light text-xs border-red-200 text-red-700">
                      -{proposition.changes.datasetsRemoved} datasets
                    </Badge>
                  )}
                  {proposition.changes.datasetsAdded > 0 && (
                    <Badge variant="outline" className="font-light text-xs border-green-200 text-green-700">
                      +{proposition.changes.datasetsAdded} datasets
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
              </div>

              {/* Estimated Time */}
              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Clock className="size-4 text-blue-600" />
                <span className="text-sm font-light text-blue-800">
                  Estimated review time: <span className="font-normal">{proposition.estimatedReviewDays} business days</span>
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="border-neutral-200 rounded-2xl mb-8">
        <CardContent className="p-6">
          <h3 className="text-base font-normal text-neutral-900 mb-4">Review Progress</h3>

          <div className="space-y-4">
            {proposition.timeline.map((step, i) => {
              const isCompleted = step.status === "completed"
              const isInProgress = step.status === "in_progress"
              return (
                <div key={i} className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <div className={cn(
                      "flex size-8 items-center justify-center rounded-full shrink-0",
                      isCompleted ? "bg-green-100" :
                      isInProgress ? cn("bg-gradient-to-br", scheme.from, scheme.to) :
                      "bg-neutral-100"
                    )}>
                      {isCompleted ? (
                        <CheckCircle2 className="size-4 text-green-600" />
                      ) : isInProgress ? (
                        <div className="size-3 rounded-full bg-white animate-pulse" />
                      ) : (
                        <div className="size-2 rounded-full bg-neutral-300" />
                      )}
                    </div>
                    {i < proposition.timeline.length - 1 && (
                      <div className={cn(
                        "w-0.5 h-8 mt-1",
                        isCompleted ? "bg-green-200" : "bg-neutral-200"
                      )} />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className={cn(
                      "text-sm",
                      isCompleted || isInProgress ? "font-normal text-neutral-900" : "font-light text-neutral-500"
                    )}>
                      {step.event}
                    </p>
                    {step.date && (
                      <p className="text-xs font-light text-neutral-500">
                        {step.date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    )}
                    {isInProgress && (
                      <Badge className={cn(
                        "mt-2 font-light text-xs bg-gradient-to-r text-white",
                        scheme.from,
                        scheme.to
                      )}>
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

      {/* Discussion Link */}
      <Card className="border-neutral-200 rounded-2xl mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-100">
                <MessageSquare className="size-5 text-neutral-600" />
              </div>
              <div>
                <p className="text-sm font-normal text-neutral-900">Collaborate with DCM</p>
                <p className="text-xs font-light text-neutral-500">
                  Ask questions or provide additional context
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="rounded-lg font-light border-neutral-200"
            >
              Open Discussion
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/collectoid/my-requests")}
          className="h-12 rounded-xl font-light border-neutral-200"
        >
          <FileText className="size-4 mr-2" />
          View All Requests
        </Button>
        <Button
          onClick={() => router.push("/collectoid/discover")}
          className={cn(
            "h-12 rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
            scheme.from,
            scheme.to
          )}
        >
          Continue Exploring
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>

      {/* Notification Opt-in */}
      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 p-3 rounded-xl bg-neutral-50 border border-neutral-200">
          <Bell className="size-4 text-neutral-500" />
          <span className="text-sm font-light text-neutral-600">
            We'll notify you when the DCM responds to your proposition
          </span>
        </div>
      </div>
    </div>
  )
}

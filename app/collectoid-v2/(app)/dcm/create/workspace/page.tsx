"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { useWorkspace } from "./layout"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  Database,
  Target,
  Shield,
  Users,
  Sparkles,
  FileEdit,
  ChevronRight,
  AlertCircle,
  Edit3,
  Layers,
  Copy,
  Check,
  Share2,
} from "lucide-react"

interface SectionCard {
  id: string
  title: string
  description: string
  icon: React.ElementType
  status: "empty" | "complete"
  required: boolean
  count?: number
  href: string
}

export default function WorkspaceOverviewPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const workspace = useWorkspace()

  // Local editing state
  const [isEditingDetails, setIsEditingDetails] = useState(false)
  const [localName, setLocalName] = useState(workspace.collectionName)
  const [localDescription, setLocalDescription] = useState(workspace.description)

  // Share state
  const [showShareLink, setShowShareLink] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)
  const [collectionId] = useState(() => `concept-${Date.now().toString(36)}`)

  const shareLink = typeof window !== "undefined"
    ? `${window.location.origin}/collectoid-v2/share/${collectionId}`
    : ""

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    } catch {
      const textArea = document.createElement("textarea")
      textArea.value = shareLink
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  const saveDetails = () => {
    workspace.setCollectionName(localName)
    workspace.setDescription(localDescription)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_collection_name", localName)
      sessionStorage.setItem("dcm_collection_description", localDescription)
    }
    setIsEditingDetails(false)
  }

  // Section cards (not including Overview since that's the current page)
  const sections: SectionCard[] = [
    {
      id: "datasets",
      title: "Datasets",
      description: workspace.selectedDatasets.length > 0
        ? `${workspace.selectedDatasets.length} dataset${workspace.selectedDatasets.length !== 1 ? 's' : ''} selected`
        : "Add datasets from browse or AI search",
      icon: Database,
      status: workspace.selectedDatasets.length > 0 ? "complete" : "empty",
      required: true,
      count: workspace.selectedDatasets.length,
      href: "/collectoid-v2/dcm/create/workspace/datasets",
    },
    {
      id: "activities",
      title: "Activities & Purpose",
      description: workspace.selectedActivities.length > 0
        ? `${workspace.selectedActivities.length} activit${workspace.selectedActivities.length !== 1 ? 'ies' : 'y'} defined`
        : "Define how data will be used",
      icon: Target,
      status: workspace.selectedActivities.length > 0 ? "complete" : "empty",
      required: true,
      count: workspace.selectedActivities.length,
      href: "/collectoid-v2/dcm/create/workspace/activities",
    },
    {
      id: "terms",
      title: "Agreement of Terms",
      description: workspace.hasAgreementOfTerms
        ? "Terms configured"
        : "Set usage permissions and restrictions",
      icon: Shield,
      status: workspace.hasAgreementOfTerms ? "complete" : "empty",
      required: true,
      href: "/collectoid-v2/dcm/create/workspace/terms",
    },
    {
      id: "roles",
      title: "Access & Users",
      description: workspace.assignedRoles.length > 0
        ? `${workspace.assignedRoles.length} group${workspace.assignedRoles.length !== 1 ? 's' : ''}/users selected`
        : "Define who can access this data",
      icon: Users,
      status: workspace.assignedRoles.length > 0 ? "complete" : "empty",
      required: false,
      count: workspace.assignedRoles.length > 0 ? workspace.assignedRoles.length : undefined,
      href: "/collectoid-v2/dcm/create/workspace/roles",
    },
  ]

  const completedRequired = sections.filter(s => s.required && s.status === "complete").length
  const totalRequired = sections.filter(s => s.required).length
  const canSubmit = completedRequired === totalRequired

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="text-center mb-8">
        <div
          className={cn(
            "inline-flex items-center justify-center size-16 rounded-2xl mb-6 bg-gradient-to-br",
            scheme.from,
            scheme.to
          )}
        >
          <Layers className="size-8 text-white" />
        </div>
        <h1 className="text-3xl font-extralight text-neutral-900 mb-3 tracking-tight">
          Collection Overview
        </h1>
        <p className="text-base font-light text-neutral-600">
          Build your collection by completing each section
        </p>
      </div>

      {/* Concept Stage Banner */}
      <div className={cn("rounded-2xl border p-5 mb-8", scheme.bg, scheme.from.replace("from-", "border-").replace("500", "100"))}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={cn("flex size-11 items-center justify-center rounded-xl bg-gradient-to-br", scheme.from, scheme.to)}>
              <FileEdit className="size-5 text-white" />
            </div>
            <div>
              <span className="text-sm font-normal text-neutral-900">
                {workspace.status === "concept" ? "Concept Stage" : "Draft Stage"}
              </span>
              <span className="text-sm font-light text-neutral-500 ml-2">
                — {workspace.status === "concept" ? "private workspace, only visible to you" : "visible to team members"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowShareLink(!showShareLink)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-light transition-all",
                showShareLink
                  ? cn("text-white", "bg-gradient-to-r", scheme.from, scheme.to)
                  : cn("text-neutral-600 hover:text-neutral-900 hover:bg-white/50")
              )}
            >
              <Share2 className="size-3.5" />
              <span>Share Link</span>
            </button>
          </div>
        </div>

        {/* Share Link Expanded */}
        {showShareLink && (
          <div className="mt-4 pt-4 border-t border-neutral-200/50">
            <div className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Input
                  value={shareLink}
                  readOnly
                  className="h-10 pr-24 bg-white/80 border-neutral-200 rounded-xl font-mono text-xs text-neutral-600"
                />
                <button
                  onClick={handleCopyLink}
                  className={cn(
                    "absolute right-1 top-1 h-8 px-3 rounded-lg text-xs font-light flex items-center gap-1.5 transition-all",
                    linkCopied
                      ? "bg-green-500 text-white"
                      : cn("text-white bg-gradient-to-r", scheme.from, scheme.to, "hover:shadow-md")
                  )}
                >
                  {linkCopied ? (
                    <>
                      <Check className="size-3.5" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            <p className="text-xs font-light text-neutral-500 mt-2">
              Anyone with this link can view your concept (read-only). They won&apos;t be able to edit.
            </p>
          </div>
        )}
      </div>

      {/* Collection Title & Description */}
      {isEditingDetails ? (
        <div className="pb-8 border-b border-neutral-200 mb-8">
          <div className="space-y-5 max-w-xl mx-auto">
            <div>
              <label className="block text-xs font-light text-neutral-500 uppercase tracking-wider mb-2 text-center">
                Collection Title
              </label>
              <Input
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                className="h-12 border-neutral-200 rounded-xl font-light text-xl text-center"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-light text-neutral-500 uppercase tracking-wider mb-2 text-center">
                Description
              </label>
              <Textarea
                value={localDescription}
                onChange={(e) => setLocalDescription(e.target.value)}
                rows={2}
                placeholder="Add a brief description of this collection's purpose..."
                className="border-neutral-200 rounded-xl font-light text-base resize-none text-center"
              />
            </div>
            <div className="flex gap-3 pt-1 justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setLocalName(workspace.collectionName)
                  setLocalDescription(workspace.description)
                  setIsEditingDetails(false)
                }}
                className="rounded-lg font-light border-neutral-200 h-9"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={saveDetails}
                className={cn("rounded-lg font-light bg-gradient-to-r text-white h-9", scheme.from, scheme.to)}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div
          className="group pb-8 border-b border-neutral-200 mb-8 cursor-pointer relative text-center"
          onClick={() => setIsEditingDetails(true)}
        >
          <h2 className="text-2xl font-normal text-neutral-900 tracking-tight mb-2">
            {workspace.collectionName}
          </h2>
          {workspace.description ? (
            <p className="text-base font-light text-neutral-500 leading-relaxed max-w-xl mx-auto">{workspace.description}</p>
          ) : (
            <p className="text-base font-light text-neutral-400 italic">Click to add a description...</p>
          )}
          {/* Edit icon - only visible on hover */}
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-light transition-all",
              "bg-neutral-100 text-neutral-600"
            )}>
              <Edit3 className="size-3.5" />
              Edit
            </div>
          </div>
        </div>
      )}

      {/* AI Analysis Banner */}
      {workspace.description && (
        <button
          onClick={workspace.showAiHelp}
          className={cn(
            "w-full mb-8 flex items-center gap-4 p-4 rounded-2xl text-left transition-all relative overflow-hidden",
            workspace.aiAnalysisStatus === "analyzing"
              ? "bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border border-amber-200 shadow-sm"
              : workspace.aiAnalysisStatus === "complete"
                ? cn("border shadow-sm", scheme.bg, scheme.from.replace("from-", "border-").replace("500", "200"))
                : "bg-neutral-50 border border-neutral-200"
          )}
        >
          {/* Animated shimmer while analyzing */}
          {workspace.aiAnalysisStatus === "analyzing" && (
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
          )}

          <div className="relative">
            {workspace.aiAnalysisStatus === "analyzing" ? (
              <div className="relative">
                <div className="size-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
                  <Sparkles className="size-6 text-white animate-pulse" />
                </div>
                <span className="absolute -top-1 -right-1 size-3 bg-amber-500 rounded-full animate-ping" />
                <span className="absolute -top-1 -right-1 size-3 bg-amber-400 rounded-full" />
              </div>
            ) : workspace.aiAnalysisStatus === "complete" ? (
              <div className={cn("size-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md", scheme.from, scheme.to)}>
                <CheckCircle2 className="size-6 text-white" />
              </div>
            ) : (
              <div className="size-12 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                <Sparkles className="size-6 text-neutral-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0 relative">
            <p className={cn(
              "text-base font-normal",
              workspace.aiAnalysisStatus === "analyzing"
                ? "text-amber-900"
                : workspace.aiAnalysisStatus === "complete"
                  ? "text-neutral-900"
                  : "text-neutral-700"
            )}>
              {workspace.aiAnalysisStatus === "analyzing"
                ? "AI is analyzing your collection intent..."
                : workspace.aiAnalysisStatus === "complete"
                  ? "AI suggestions are ready"
                  : "AI assistance available"
              }
            </p>
            <p className={cn(
              "text-sm font-light mt-0.5",
              workspace.aiAnalysisStatus === "analyzing"
                ? "text-amber-700"
                : workspace.aiAnalysisStatus === "complete"
                  ? scheme.from.replace("from-", "text-").replace("500", "600")
                  : "text-neutral-500"
            )}>
              {workspace.aiAnalysisStatus === "analyzing"
                ? "Preparing smart filters and dataset recommendations"
                : workspace.aiAnalysisStatus === "complete"
                  ? "Click to view suggested filters, keywords, and insights"
                  : "Add a description to enable AI assistance"
              }
            </p>
          </div>

          {workspace.aiAnalysisStatus === "complete" && (
            <ChevronRight className={cn("size-5 shrink-0", scheme.from.replace("from-", "text-"))} />
          )}
        </button>
      )}

      {/* Section Cards */}
      <div className="space-y-4 mb-8">
        {sections.map((section) => {
          const isComplete = section.status === "complete"

          // All section cards use consistent layout
          return (
            <Card
              key={section.id}
              className={cn(
                "group border rounded-2xl overflow-hidden cursor-pointer transition-all hover:shadow-md min-h-[88px]",
                isComplete
                  ? cn("border-2", scheme.from.replace("from-", "border-").replace("500", "200"))
                  : "border-neutral-200 hover:border-neutral-300"
              )}
              onClick={() => router.push(section.href)}
            >
              <CardContent className="p-5 h-full">
                <div className="flex items-start justify-between h-full">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex size-12 items-center justify-center rounded-xl shrink-0",
                      isComplete
                        ? cn("bg-gradient-to-br", scheme.from, scheme.to)
                        : "bg-neutral-100 border border-neutral-200"
                    )}>
                      <section.icon className={cn("size-5", isComplete ? "text-white" : "text-neutral-500")} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-base font-normal text-neutral-900">
                          {section.title}
                        </h3>
                        {section.required && section.status === "empty" && (
                          <Badge variant="outline" className="text-xs font-light border-red-200 text-red-600 bg-red-50">
                            Required
                          </Badge>
                        )}
                        {isComplete && (
                          <CheckCircle2 className={cn("size-4", scheme.from.replace("from-", "text-"))} />
                        )}
                        {section.count !== undefined && section.count > 0 && (
                          <Badge variant="secondary" className={cn("text-xs font-light border-0", scheme.bg, scheme.from.replace("from-", "text-").replace("500", "700"))}>
                            {section.count}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm font-light text-neutral-500">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    {isComplete ? (
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-light bg-neutral-100 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Edit3 className="size-3.5" />
                        Edit
                      </div>
                    ) : (
                      <ChevronRight className="size-5 text-neutral-400" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* AI Suggestion Card */}
      {workspace.selectedDatasets.length === 0 && (
        <Card className={cn("border rounded-2xl overflow-hidden mb-8", scheme.from.replace("from-", "border-").replace("500", "200"), scheme.bg)}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={cn("flex size-12 items-center justify-center rounded-xl bg-gradient-to-br", scheme.from, scheme.to)}>
                <Sparkles className="size-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-normal text-neutral-900 mb-1">
                  Need help finding datasets?
                </h3>
                <p className="text-sm font-light text-neutral-600 mb-4">
                  Our AI can analyze your description and suggest relevant datasets from our catalog.
                </p>
                <Button
                  onClick={() => router.push("/collectoid-v2/discover/ai")}
                  className={cn("rounded-xl font-light bg-gradient-to-r text-white", scheme.from, scheme.to)}
                >
                  <Sparkles className="size-4 mr-2" />
                  Try AI-Assisted Discovery
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status Card */}
      {!canSubmit ? (
        <Card className="border-neutral-200 bg-neutral-50 rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex size-10 items-center justify-center rounded-xl bg-neutral-200">
                <AlertCircle className="size-5 text-neutral-600" />
              </div>
              <div>
                <h3 className="text-sm font-normal text-neutral-900 mb-1">
                  Complete required sections to continue
                </h3>
                <p className="text-sm font-light text-neutral-600">
                  Add datasets, define activities, and set agreement of terms to promote this concept to a full draft.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className={cn("border rounded-2xl overflow-hidden", scheme.from.replace("from-", "border-").replace("500", "200"), scheme.bg)}>
          <CardContent className="p-5">
            <div className="flex items-start gap-4">
              <div className={cn("flex size-10 items-center justify-center rounded-xl bg-gradient-to-br", scheme.from, scheme.to)}>
                <CheckCircle2 className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-normal text-neutral-900 mb-1">
                  Ready to promote to draft
                </h3>
                <p className="text-sm font-light text-neutral-600">
                  Your concept is complete! Promote it to enable discussions, timeline tracking, and collaboration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

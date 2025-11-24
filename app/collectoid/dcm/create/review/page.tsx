"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useColorScheme } from "@/components/ux12-color-context"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  HelpCircle,
  Zap,
  FileCheck,
  Users,
  Database,
  Target,
  Send,
  FileSearch,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Shield,
  X,
  FileText,
} from "lucide-react"
import { Dataset, AgreementOfTerms } from "@/lib/dcm-mock-data"

export default function DCMReviewPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([])
  const [selectedActivities, setSelectedActivities] = useState<any[]>([])
  const [collectionName, setCollectionName] = useState("Oncology ctDNA Outcomes Collection")
  const [description, setDescription] = useState("Curated collection of Phase III lung cancer studies with ctDNA biomarker monitoring and immunotherapy treatment arms. Suitable for outcomes research, biomarker analysis, and multimodal data fusion.")
  const [targetCommunity, setTargetCommunity] = useState("Oncology Data Scientists and Biostatisticians studying immunotherapy response and ctDNA dynamics")
  const [totalUsers, setTotalUsers] = useState(0)
  const [aot, setAot] = useState<AgreementOfTerms | null>(null)
  const [trainingBreakdownExpanded, setTrainingBreakdownExpanded] = useState(false)

  const handleTrainingToggle = () => {
    setTrainingBreakdownExpanded(!trainingBreakdownExpanded)
    if (!trainingBreakdownExpanded) {
      // Smooth scroll to the button after expansion
      setTimeout(() => {
        document.getElementById('training-breakdown-button')?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest'
        })
      }, 100)
    }
  }

  useEffect(() => {
    // Get all data from sessionStorage
    if (typeof window !== "undefined") {
      const storedDatasets = sessionStorage.getItem("dcm_selected_datasets")
      const storedActivities = sessionStorage.getItem("dcm_selected_activities")
      const storedName = sessionStorage.getItem("dcm_collection_name")
      const storedDescription = sessionStorage.getItem("dcm_collection_description")
      const storedCommunity = sessionStorage.getItem("dcm_target_community")
      const storedUsers = sessionStorage.getItem("dcm_total_users")
      const storedAoT = sessionStorage.getItem("dcm_agreement_of_terms")

      if (!storedDatasets) {
        router.push("/collectoid/dcm/create")
        return
      }

      setSelectedDatasets(JSON.parse(storedDatasets))
      if (storedActivities) setSelectedActivities(JSON.parse(storedActivities))
      if (storedName) setCollectionName(storedName)
      if (storedDescription) setDescription(storedDescription)
      if (storedCommunity) setTargetCommunity(storedCommunity)
      if (storedUsers) setTotalUsers(parseInt(storedUsers))
      if (storedAoT) setAot(JSON.parse(storedAoT))
    }
  }, [router])

  // Calculate aggregate access breakdown
  const calculateAccessBreakdown = () => {
    const total = selectedDatasets.length
    const breakdown = {
      alreadyOpen: 0,
      readyToGrant: 0,
      needsApproval: 0,
      missingLocation: 0,
    }

    selectedDatasets.forEach((dataset) => {
      breakdown.alreadyOpen += dataset.accessBreakdown.alreadyOpen
      breakdown.readyToGrant += dataset.accessBreakdown.readyToGrant
      breakdown.needsApproval += dataset.accessBreakdown.needsApproval
      breakdown.missingLocation += dataset.accessBreakdown.missingLocation
    })

    return {
      alreadyOpen: Math.round(breakdown.alreadyOpen / total),
      readyToGrant: Math.round(breakdown.readyToGrant / total),
      needsApproval: Math.round(breakdown.needsApproval / total),
      missingLocation: Math.round(breakdown.missingLocation / total),
    }
  }

  const handlePublish = () => {
    router.push("/collectoid/dcm/create/publishing")
  }

  if (selectedDatasets.length === 0) {
    return <div>Loading...</div>
  }

  const accessBreakdown = calculateAccessBreakdown()
  const usersWithImmediateAccess = Math.round((totalUsers * 50) / 100) // 50% have immediate access
  const usersAfterInstantGrant = Math.round((totalUsers * 90) / 100) // 90% after instant grant
  const usersAfterApprovals = Math.round((totalUsers * 90) / 100) // 90% after approvals
  const usersMissingTraining = Math.round((totalUsers * 10) / 100) // 10% missing training

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/collectoid/dcm/create/agreements")}
          className="rounded-full font-light mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Agreements
        </Button>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 6 of 7</span>
          <span className="text-xs text-neutral-300">|</span>
          <span className="text-xs font-light text-neutral-600">Review & Publish</span>
        </div>

        <div className="text-center mb-6">
          <div
            className={cn(
              "inline-flex items-center justify-center size-16 rounded-2xl mb-4 bg-gradient-to-br",
              scheme.bg,
              scheme.bgHover
            )}
          >
            <FileCheck className={cn("size-8", scheme.from.replace("from-", "text-"))} />
          </div>
          <h1 className="text-3xl font-extralight text-neutral-900 mb-3 tracking-tight">
            Access Provisioning Breakdown
          </h1>
          <p className="text-base font-light text-neutral-600">
            Review collection details and access provisioning before publishing
          </p>
        </div>
      </div>

      {/* Collection Details - Editable */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden mb-6">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <FileText className={cn("size-5", scheme.from.replace("from-", "text-"))} />
            <h2 className="text-lg font-normal text-neutral-900">Collection Details</h2>
          </div>

          <div className="space-y-5">
            {/* Collection Name */}
            <div>
              <label htmlFor="collectionName" className="block text-sm font-light text-neutral-700 mb-2">
                Collection Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="collectionName"
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="Enter collection name..."
                className="border-neutral-200 rounded-xl font-light"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-light text-neutral-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and scope of this collection..."
                rows={3}
                className="border-neutral-200 rounded-xl font-light resize-none"
              />
            </div>

            {/* Target User Community */}
            <div>
              <label htmlFor="targetCommunity" className="block text-sm font-light text-neutral-700 mb-2">
                Target User Community <span className="text-neutral-400">(optional)</span>
              </label>
              <Textarea
                id="targetCommunity"
                value={targetCommunity}
                onChange={(e) => setTargetCommunity(e.target.value)}
                placeholder="Describe the target audience for this collection..."
                rows={2}
                className="border-neutral-200 rounded-xl font-light resize-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 pt-5 mt-5 border-t border-neutral-100">
            <div className="flex items-center gap-2">
              <Database className="size-4 text-neutral-500" />
              <span className="text-sm font-light text-neutral-600">
                {selectedDatasets.length} datasets
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="size-4 text-neutral-500" />
              <span className="text-sm font-light text-neutral-600">
                {selectedActivities.length} activities
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="size-4 text-neutral-500" />
              <span className="text-sm font-light text-neutral-600">{totalUsers} target users</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agreement of Terms Summary */}
      {aot && (
        <Card className="border-neutral-200 rounded-2xl overflow-hidden mb-6">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-neutral-600" strokeWidth={1.5} />
                <h2 className="text-xl font-normal text-neutral-900">Agreement of Terms</h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/collectoid/dcm/create/agreements")}
                className="rounded-full font-light"
              >
                Edit
              </Button>
            </div>

            <div className="space-y-4">
              {/* Allowed Uses */}
              <div>
                <p className="text-sm font-normal text-neutral-700 mb-3">Allowed Uses:</p>
                <div className="flex flex-wrap gap-2">
                  {aot.beyondPrimaryUse.aiResearch && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 font-light">
                      <CheckCircle2 className="h-3 w-3 mr-1" strokeWidth={1.5} />
                      ML/AI Research
                    </Badge>
                  )}
                  {aot.beyondPrimaryUse.aiResearch === false && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 font-light">
                      <X className="h-3 w-3 mr-1" strokeWidth={1.5} />
                      ML/AI Research
                    </Badge>
                  )}

                  {aot.beyondPrimaryUse.softwareDevelopment && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 font-light">
                      <CheckCircle2 className="h-3 w-3 mr-1" strokeWidth={1.5} />
                      Software Dev
                    </Badge>
                  )}
                  {aot.beyondPrimaryUse.softwareDevelopment === false && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 font-light">
                      <X className="h-3 w-3 mr-1" strokeWidth={1.5} />
                      Software Dev
                    </Badge>
                  )}

                  {aot.publication.internalCompanyRestricted && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 font-light">
                      <CheckCircle2 className="h-3 w-3 mr-1" strokeWidth={1.5} />
                      Internal Pub
                    </Badge>
                  )}

                  {aot.publication.externalPublication === true && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300 font-light">
                      <CheckCircle2 className="h-3 w-3 mr-1" strokeWidth={1.5} />
                      External Pub
                    </Badge>
                  )}
                  {aot.publication.externalPublication === "by_exception" && (
                    <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-300 font-light">
                      External Pub (by exception)
                    </Badge>
                  )}
                  {aot.publication.externalPublication === false && (
                    <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300 font-light">
                      <X className="h-3 w-3 mr-1" strokeWidth={1.5} />
                      External Pub
                    </Badge>
                  )}
                </div>
              </div>

              {/* User Scope */}
              <div className="pt-3 border-t border-neutral-100">
                <p className="text-sm font-normal text-neutral-700 mb-2">User Scope:</p>
                <div className="flex items-center gap-2 text-sm text-neutral-600 font-light">
                  <Users className="h-4 w-4 text-neutral-500" strokeWidth={1.5} />
                  <span>
                    {aot.userScope.totalUserCount || 0} users
                    {aot.userScope.byDepartment && aot.userScope.byDepartment.length > 0 && (
                      <span> across {aot.userScope.byDepartment.length} organizations</span>
                    )}
                  </span>
                </div>
              </div>

              {/* Acknowledged Conflicts */}
              {aot.acknowledgedConflicts && aot.acknowledgedConflicts.length > 0 && (
                <div className="pt-3 border-t border-neutral-100">
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                    <p className="text-sm font-normal text-amber-900 mb-1">
                      ⚠️ {aot.acknowledgedConflicts.length} dataset conflict(s) acknowledged
                    </p>
                    <p className="text-xs font-light text-amber-700">
                      Collection includes datasets with usage restrictions that conflict with the defined Agreement of Terms
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Access Provisioning Breakdown */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Sparkles className={cn("size-6", scheme.from.replace("from-", "text-"))} />
          <h2 className="text-2xl font-light text-neutral-900">Access Provisioning Plan</h2>
        </div>

        <div className="space-y-4">
          {/* 20% Already Open */}
          <Card className="border-2 border-green-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="size-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-neutral-900">
                        {accessBreakdown.alreadyOpen}% Already Open
                      </h3>
                      <p className="text-sm font-light text-neutral-600">
                        for 50% of users
                      </p>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-100 rounded-full h-3 mb-4">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all"
                      style={{ width: `${accessBreakdown.alreadyOpen}%` }}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-light border-green-200 text-green-800">
                        Status: ✅ No action needed
                      </Badge>
                      <Badge variant="outline" className="font-light border-green-200 text-green-800">
                        Impact: {usersWithImmediateAccess} users
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm font-light text-neutral-600 mb-3">
                    <span className="font-normal">Details:</span> {Math.round((selectedDatasets.length * accessBreakdown.alreadyOpen) / 100)} datasets - Study closed, DB lock &gt;6 months, no restrictions
                  </p>

                  <div className="rounded-xl bg-green-50 border border-green-100 p-3">
                    <p className="text-xs font-light text-green-900">
                      These datasets are already accessible. Users with appropriate training can access immediately.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 30% Ready to Grant */}
          <Card
            className={cn(
              "border-2 rounded-2xl overflow-hidden",
              scheme.from.replace("from-", "border-")
            )}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-full",
                        scheme.bg
                      )}
                    >
                      <Zap className={cn("size-6", scheme.from.replace("from-", "text-"))} />
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-neutral-900">
                        {accessBreakdown.readyToGrant}% Ready to Grant
                      </h3>
                      <p className="text-sm font-light text-neutral-600">instant approval</p>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-100 rounded-full h-3 mb-4">
                    <div
                      className={cn("h-3 rounded-full transition-all bg-gradient-to-r", scheme.from, scheme.to)}
                      style={{ width: `${accessBreakdown.readyToGrant}%` }}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-light",
                          scheme.from.replace("from-", "border-").replace("500", "200"),
                          scheme.from.replace("from-", "text-")
                        )}
                      >
                        Status: ⚡ One-click confirmation
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-light",
                          scheme.from.replace("from-", "border-").replace("500", "200"),
                          scheme.from.replace("from-", "text-")
                        )}
                      >
                        Impact: {usersAfterInstantGrant} users (90%)
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm font-light text-neutral-600 mb-3">
                    <span className="font-normal">Timeline:</span> ~1 hour after your confirmation
                  </p>

                  <p className="text-sm font-light text-neutral-600 mb-3">
                    <span className="font-normal">Details:</span> {Math.round((selectedDatasets.length * accessBreakdown.readyToGrant) / 100)} datasets - Study closed, DB lock &gt;6 months, no legal blocks
                  </p>

                  <div className={cn("rounded-xl border p-3 mb-4", scheme.bg, scheme.from.replace("from-", "border-").replace("500", "100"))}>
                    <p className="text-xs font-light text-neutral-700 mb-2">
                      <span className="font-normal">Mechanism:</span>
                    </p>
                    <ol className="text-xs font-light text-neutral-600 space-y-1 ml-4 list-decimal">
                      <li>You click [Confirm Instant Grant] when publishing</li>
                      <li>Collectoid updates Immuta policies (metadata only)</li>
                      <li>Users automatically gain access within 1 hour</li>
                      <li>Email notifications sent to users</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 40% Needs Approval */}
          <Card className="border-2 border-amber-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-amber-100">
                      <Clock className="size-6 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-neutral-900">
                        {accessBreakdown.needsApproval}% Blocked - Needs Approval
                      </h3>
                      <p className="text-sm font-light text-neutral-600">GPT/TALT routing</p>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-100 rounded-full h-3 mb-4">
                    <div
                      className="bg-amber-500 h-3 rounded-full transition-all"
                      style={{ width: `${accessBreakdown.needsApproval}%` }}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-light border-amber-200 text-amber-800">
                        Status: 🟡 Requires external approval
                      </Badge>
                      <Badge variant="outline" className="font-light border-amber-200 text-amber-800">
                        Impact: {usersAfterApprovals} users (90%)
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm font-light text-neutral-600 mb-3">
                    <span className="font-normal">Timeline:</span> 2-5 business days depending on approval authority
                  </p>

                  <div className="space-y-3 mb-4">
                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <Send className="size-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-normal text-amber-900 mb-1">
                            → GPT-Oncology ({Math.round((selectedDatasets.length * accessBreakdown.needsApproval * 0.6) / 100)} datasets)
                          </p>
                          <p className="text-xs font-light text-amber-700">
                            Est. 2-3 days • Reason: Active study data requires therapeutic area review
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-amber-50 border border-amber-100 p-3">
                      <div className="flex items-start gap-2 mb-2">
                        <Send className="size-4 text-amber-600 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-normal text-amber-900 mb-1">
                            → TALT-Legal ({Math.round((selectedDatasets.length * accessBreakdown.needsApproval * 0.4) / 100)} datasets)
                          </p>
                          <p className="text-xs font-light text-amber-700">
                            Est. 3-5 days • Reason: Cross-geography data (EU sites), GDPR review
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                    <p className="text-xs font-light text-neutral-700 mb-2">
                      <span className="font-normal">What happens next:</span>
                    </p>
                    <ol className="text-xs font-light text-neutral-600 space-y-1 ml-4 list-decimal">
                      <li>Collectoid creates formal approval requests</li>
                      <li>Requests routed to GPT-Oncology and TALT-Legal</li>
                      <li>Collectoid monitors approval status</li>
                      <li>Upon approval, Collectoid writes Immuta policies</li>
                      <li>Users gain access automatically, notifications sent</li>
                    </ol>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 10% Missing Location */}
          {accessBreakdown.missingLocation > 0 && (
            <Card className="border-2 border-neutral-300 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex size-12 items-center justify-center rounded-full bg-neutral-100">
                        <HelpCircle className="size-6 text-neutral-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-normal text-neutral-900">
                          {accessBreakdown.missingLocation}% Missing Data Location
                        </h3>
                        <p className="text-sm font-light text-neutral-600">
                          requires data discovery
                        </p>
                      </div>
                    </div>

                    <div className="w-full bg-neutral-100 rounded-full h-3 mb-4">
                      <div
                        className="bg-neutral-400 h-3 rounded-full transition-all"
                        style={{ width: `${accessBreakdown.missingLocation}%` }}
                      />
                    </div>

                    <div className="space-y-2 mb-4">
                      <Badge variant="outline" className="font-light border-neutral-300 text-neutral-700">
                        Status: ❓ Data not catalogued
                      </Badge>
                    </div>

                    <p className="text-sm font-light text-neutral-600 mb-3">
                      <span className="font-normal">Details:</span> {Math.round((selectedDatasets.length * accessBreakdown.missingLocation) / 100)} dataset(s) have incomplete location metadata in catalog
                    </p>

                    <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                      <p className="text-xs font-light text-neutral-700 mb-2">
                        <span className="font-normal">What happens next:</span>
                      </p>
                      <ol className="text-xs font-light text-neutral-600 space-y-1 ml-4 list-decimal">
                        <li>Collectoid notifies data steward</li>
                        <li>Manual search or data location verification begins</li>
                        <li>Once located, standard provisioning workflow resumes</li>
                        <li>You'll be notified when data is catalogued</li>
                      </ol>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 10% Users Missing Training */}
          <Card className="border-2 border-blue-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex size-12 items-center justify-center rounded-full bg-blue-100">
                      <GraduationCap className="size-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-neutral-900">
                        10% Users Haven't Completed Training
                      </h3>
                      <p className="text-sm font-light text-neutral-600">pending certification</p>
                    </div>
                  </div>

                  <div className="w-full bg-neutral-100 rounded-full h-3 mb-4">
                    <div
                      className="bg-blue-500 h-3 rounded-full transition-all"
                      style={{ width: "10%" }}
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-light border-blue-200 text-blue-800">
                        Status: ⏳ Pending training completion
                      </Badge>
                      <Badge variant="outline" className="font-light border-blue-200 text-blue-800">
                        Impact: {usersMissingTraining} users
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm font-light text-neutral-600 mb-3">
                    <span className="font-normal">Training Requirements Summary:</span>
                  </p>
                  <ul className="text-sm font-light text-neutral-600 space-y-1 ml-4 mb-4 list-disc">
                    <li>{Math.round(usersMissingTraining * 0.67)} users missing: GCP (Good Clinical Practice)</li>
                    <li>{Math.round(usersMissingTraining * 0.33)} users missing: Data Privacy Level 2 certification</li>
                  </ul>

                  {/* View Detailed Breakdown Button */}
                  <Button
                    id="training-breakdown-button"
                    variant="outline"
                    onClick={handleTrainingToggle}
                    className={cn(
                      "w-full mb-4 rounded-xl font-light border-blue-200 hover:bg-blue-50 transition-all",
                      trainingBreakdownExpanded && "bg-blue-50"
                    )}
                  >
                    <FileSearch className="size-4 mr-2" />
                    View Detailed Training Breakdown
                    {trainingBreakdownExpanded ? (
                      <ChevronUp className="size-4 ml-auto" />
                    ) : (
                      <ChevronDown className="size-4 ml-auto" />
                    )}
                  </Button>

                  {/* Expanded Training Breakdown */}
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-500 ease-in-out",
                      trainingBreakdownExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="rounded-xl border border-blue-200 bg-white p-4 mb-4 space-y-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-normal text-neutral-900">
                          User-Specific Training Gaps
                        </h4>
                        <Badge className="bg-blue-100 text-blue-800 font-light text-xs">
                          {usersMissingTraining} users affected
                        </Badge>
                      </div>

                      {/* User 1 */}
                      <div className="rounded-xl border border-neutral-200 p-3 bg-neutral-50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-normal text-neutral-900">Sarah Chen</p>
                            <p className="text-xs font-light text-neutral-500">sarah.chen@example.com</p>
                          </div>
                          <Badge variant="outline" className="font-light text-xs border-amber-200 text-amber-800">
                            2 courses missing
                          </Badge>
                        </div>
                        <div className="space-y-1.5 mt-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-normal text-neutral-900">GCP - Good Clinical Practice</p>
                              <p className="text-xs font-light text-neutral-600">Required for patient-level data access</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertCircle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-normal text-neutral-900">Genomic Data Ethics & Compliance</p>
                              <p className="text-xs font-light text-neutral-600">Required for genomic/NGS datasets</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User 2 */}
                      <div className="rounded-xl border border-neutral-200 p-3 bg-neutral-50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-normal text-neutral-900">Marcus Johnson</p>
                            <p className="text-xs font-light text-neutral-500">marcus.j@example.com</p>
                          </div>
                          <Badge variant="outline" className="font-light text-xs border-amber-200 text-amber-800">
                            1 course missing
                          </Badge>
                        </div>
                        <div className="space-y-1.5 mt-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-normal text-neutral-900">Data Privacy Level 2</p>
                              <p className="text-xs font-light text-neutral-600">Required for cross-geography datasets (GDPR)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User 3 */}
                      <div className="rounded-xl border border-neutral-200 p-3 bg-neutral-50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-normal text-neutral-900">Priya Sharma</p>
                            <p className="text-xs font-light text-neutral-500">p.sharma@example.com</p>
                          </div>
                          <Badge variant="outline" className="font-light text-xs border-amber-200 text-amber-800">
                            3 courses missing
                          </Badge>
                        </div>
                        <div className="space-y-1.5 mt-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-normal text-neutral-900">GCP - Good Clinical Practice</p>
                              <p className="text-xs font-light text-neutral-600">Required for patient-level data access</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertCircle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-normal text-neutral-900">Clinical Trial Data Standards (CDISC/SDTM)</p>
                              <p className="text-xs font-light text-neutral-600">Required for standardized clinical datasets</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <AlertCircle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-normal text-neutral-900">Immuta Data Access Platform Basics</p>
                              <p className="text-xs font-light text-neutral-600">Required for platform access</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User 4 */}
                      <div className="rounded-xl border border-neutral-200 p-3 bg-neutral-50">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-sm font-normal text-neutral-900">David Kim</p>
                            <p className="text-xs font-light text-neutral-500">d.kim@example.com</p>
                          </div>
                          <Badge variant="outline" className="font-light text-xs border-amber-200 text-amber-800">
                            1 course missing
                          </Badge>
                        </div>
                        <div className="space-y-1.5 mt-3">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="text-xs font-normal text-neutral-900">Data Privacy Level 2</p>
                              <p className="text-xs font-light text-neutral-600">Required for cross-geography datasets (GDPR)</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="pt-3 border-t border-neutral-200 flex items-center justify-between">
                        <p className="text-xs font-light text-neutral-600">
                          Users will auto-qualify once training is complete
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 rounded-lg font-light text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          View Training Portal
                          <ExternalLink className="size-3 ml-1.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-3">
                    <p className="text-xs font-light text-blue-900 mb-2">
                      <span className="font-normal">Auto-grant mechanism:</span>
                    </p>
                    <p className="text-xs font-light text-blue-700">
                      Collectoid monitors training database (Workday). As soon as users complete required courses, they automatically qualify for all unlocked data above. No additional DCM action needed.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 6 of 7</span>
          <span className="text-xs text-neutral-300">|</span>
          <span className="text-xs font-light text-neutral-600">Review & Publish</span>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/collectoid/dcm/create/agreements")}
            className="flex-1 h-12 rounded-2xl font-light border-neutral-200"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Agreements
          </Button>
          <Button
            onClick={handlePublish}
            className={cn(
              "flex-1 h-12 rounded-2xl font-light shadow-lg hover:shadow-xl transition-all bg-gradient-to-r text-white",
              scheme.from,
              scheme.to
            )}
          >
            <Sparkles className="size-4 mr-2" />
            Publish Collection & Execute
          </Button>
        </div>
      </div>
    </div>
  )
}

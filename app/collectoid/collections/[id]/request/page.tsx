"use client"

import { useState, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
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
  Check,
  X,
  AlertTriangle,
  Shield,
  Clock,
  Zap,
  Send,
  Loader2,
  Sparkles,
  FileEdit,
  RefreshCw,
} from "lucide-react"

// Mock collection data (same as detail page)
const MOCK_COLLECTION = {
  id: "col-1",
  name: "Oncology ctDNA Outcomes Collection",
  description: "Curated collection of Phase III lung cancer studies with ctDNA biomarker monitoring and immunotherapy treatment arms.",
  totalDatasets: 16,
  totalUsers: 120,
  agreementOfTerms: {
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
      externalPublication: true,
    },
  },
  accessBreakdown: {
    instant: 8,
    approvalRequired: 8,
    estimatedDays: "2-3",
  },
}

const PRIMARY_USE_OPTIONS = [
  { key: "understandDrugMechanism", label: "Understand how drugs work in the body" },
  { key: "understandDisease", label: "Better understand disease and health problems" },
  { key: "developDiagnosticTests", label: "Develop diagnostic tests for disease" },
  { key: "learnFromPastStudies", label: "Learn from past studies to plan new studies" },
  { key: "improveAnalysisMethods", label: "Improve scientific analysis methods" },
]

const DURATION_OPTIONS = [
  { value: "3-months", label: "3 months" },
  { value: "6-months", label: "6 months" },
  { value: "1-year", label: "1 year" },
  { value: "2-years", label: "2 years" },
  { value: "indefinite", label: "Indefinite (ongoing research)" },
]

type IntentMismatch = {
  field: string
  label: string
  userIntent: boolean
  collectionAllows: boolean
}

export default function RequestAccessPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const params = useParams()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showMismatchWarning, setShowMismatchWarning] = useState(false)

  // Intent state
  const [primaryUse, setPrimaryUse] = useState({
    understandDrugMechanism: false,
    understandDisease: false,
    developDiagnosticTests: false,
    learnFromPastStudies: false,
    improveAnalysisMethods: false,
  })
  const [beyondPrimaryUse, setBeyondPrimaryUse] = useState({
    aiResearch: false,
    softwareDevelopment: false,
  })
  const [publication, setPublication] = useState({
    internalCompanyRestricted: false,
    externalPublication: false,
  })
  const [researchPurpose, setResearchPurpose] = useState("")
  const [duration, setDuration] = useState("")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const collection = MOCK_COLLECTION

  // Check for intent mismatches
  const intentMismatches = useMemo(() => {
    const mismatches: IntentMismatch[] = []

    // Check beyond primary use
    if (beyondPrimaryUse.aiResearch && !collection.agreementOfTerms.beyondPrimaryUse.aiResearch) {
      mismatches.push({
        field: "aiResearch",
        label: "AI research / AI model training",
        userIntent: true,
        collectionAllows: false,
      })
    }
    if (beyondPrimaryUse.softwareDevelopment && !collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment) {
      mismatches.push({
        field: "softwareDevelopment",
        label: "Software development and testing",
        userIntent: true,
        collectionAllows: false,
      })
    }

    // Check publication
    if (publication.internalCompanyRestricted && !collection.agreementOfTerms.publication.internalCompanyRestricted) {
      mismatches.push({
        field: "internalCompanyRestricted",
        label: "Internal 'company restricted' findings",
        userIntent: true,
        collectionAllows: false,
      })
    }
    if (publication.externalPublication && !collection.agreementOfTerms.publication.externalPublication) {
      mismatches.push({
        field: "externalPublication",
        label: "External publication",
        userIntent: true,
        collectionAllows: false,
      })
    }

    return mismatches
  }, [beyondPrimaryUse, publication, collection.agreementOfTerms])

  const hasMismatches = intentMismatches.length > 0

  // Check if form is valid
  const isFormValid = useMemo(() => {
    const hasAtLeastOneIntent =
      Object.values(primaryUse).some(Boolean) ||
      Object.values(beyondPrimaryUse).some(Boolean)
    const hasResearchPurpose = researchPurpose.trim().length > 0
    const hasDuration = duration.length > 0
    const hasAgreed = agreedToTerms

    return hasAtLeastOneIntent && hasResearchPurpose && hasDuration && hasAgreed
  }, [primaryUse, beyondPrimaryUse, researchPurpose, duration, agreedToTerms])

  const handleSubmit = async () => {
    if (hasMismatches) {
      setShowMismatchWarning(true)
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    // Redirect to request confirmation
    router.push(`/collectoid/requests/req-${Date.now()}`)
  }

  const handleAdjustIntents = () => {
    // Clear the mismatched intents
    if (beyondPrimaryUse.softwareDevelopment && !collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment) {
      setBeyondPrimaryUse(prev => ({ ...prev, softwareDevelopment: false }))
    }
    setShowMismatchWarning(false)
  }

  const handleRequestModification = () => {
    // Navigate to customize with modification request
    router.push(`/collectoid/collections/${params.id}/customize?modify=true`)
  }

  const handleCreateCustom = () => {
    // Navigate to customize to create new collection
    router.push(`/collectoid/collections/${params.id}/customize`)
  }

  return (
    <div className="py-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("dcm_current_collection_id", params.id as string)
            }
            router.push("/collectoid/dcm/progress")
          }}
          className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Collection
        </button>

        <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight mb-2">
          Request Access
        </h1>
        <p className="text-base font-light text-neutral-600 mb-4">
          Request access to <span className="font-normal">{collection.name}</span>
        </p>

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-sm font-light text-neutral-600">
          <div className="flex items-center gap-2">
            <Zap className="size-4 text-green-600" />
            <span>{collection.accessBreakdown.instant} instant access</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="size-4 text-amber-600" />
            <span>{collection.accessBreakdown.approvalRequired} require approval ({collection.accessBreakdown.estimatedDays} days)</span>
          </div>
        </div>
      </div>

      {/* Intent Mismatch Warning Modal */}
      {showMismatchWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="max-w-lg w-full mx-4 border-amber-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-100 shrink-0">
                  <AlertTriangle className="size-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-lg font-normal text-neutral-900 mb-1">
                    Intent Mismatch Detected
                  </h3>
                  <p className="text-sm font-light text-neutral-600">
                    Your selected intents don&apos;t match the collection&apos;s Agreement of Terms.
                  </p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {intentMismatches.map((mismatch) => (
                  <div
                    key={mismatch.field}
                    className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200"
                  >
                    <X className="size-4 text-red-600 shrink-0" />
                    <span className="text-sm font-light text-red-800">
                      <span className="font-normal">{mismatch.label}</span> is not allowed for this collection
                    </span>
                  </div>
                ))}
              </div>

              <p className="text-sm font-light text-neutral-600 mb-4">
                How would you like to proceed?
              </p>

              <div className="space-y-3">
                <Button
                  onClick={handleAdjustIntents}
                  variant="outline"
                  className="w-full h-12 rounded-xl font-light border-neutral-200 justify-start"
                >
                  <RefreshCw className="size-4 mr-3" />
                  <div className="text-left">
                    <div className="font-normal">Adjust my intents</div>
                    <div className="text-xs text-neutral-500">Remove conflicting intents to match collection</div>
                  </div>
                </Button>

                <Button
                  onClick={handleRequestModification}
                  variant="outline"
                  className="w-full h-12 rounded-xl font-light border-amber-300 text-amber-700 hover:bg-amber-50 justify-start"
                >
                  <FileEdit className="size-4 mr-3" />
                  <div className="text-left">
                    <div className="font-normal">Request collection modification</div>
                    <div className="text-xs text-amber-600">Ask DCM to update the Agreement of Terms</div>
                  </div>
                </Button>

                <Button
                  onClick={handleCreateCustom}
                  className={cn(
                    "w-full h-12 rounded-xl font-light bg-gradient-to-r text-white justify-start",
                    scheme.from,
                    scheme.to
                  )}
                >
                  <Sparkles className="size-4 mr-3" />
                  <div className="text-left">
                    <div className="font-normal">Create custom collection</div>
                    <div className="text-xs text-white/80">Start a new proposition based on this collection</div>
                  </div>
                </Button>
              </div>

              <Button
                variant="ghost"
                onClick={() => setShowMismatchWarning(false)}
                className="w-full mt-4 font-light text-neutral-500"
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Intent Declaration Form */}
      <div className="space-y-6">
        {/* Primary Use */}
        <Card className="border-neutral-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="size-5 text-neutral-700" />
              <h3 className="text-lg font-normal text-neutral-900">Intended Use</h3>
            </div>

            <div className="space-y-6">
              {/* Primary Use Section */}
              <div>
                <h4 className="text-sm font-normal text-neutral-700 mb-3">
                  Primary Use (IMI-Guided Protocol)
                </h4>
                <p className="text-xs font-light text-neutral-500 mb-4">
                  Select all that apply to your research
                </p>
                <div className="space-y-3">
                  {PRIMARY_USE_OPTIONS.map((option) => {
                    const isAllowed = collection.agreementOfTerms.primaryUse[option.key as keyof typeof collection.agreementOfTerms.primaryUse]
                    return (
                      <div key={option.key} className="flex items-start gap-3">
                        <Checkbox
                          id={option.key}
                          checked={primaryUse[option.key as keyof typeof primaryUse]}
                          onCheckedChange={(checked) =>
                            setPrimaryUse(prev => ({ ...prev, [option.key]: checked }))
                          }
                          className="mt-0.5"
                        />
                        <div className="flex-1">
                          <Label
                            htmlFor={option.key}
                            className="text-sm font-light text-neutral-700 cursor-pointer"
                          >
                            {option.label}
                          </Label>
                        </div>
                        {isAllowed ? (
                          <Badge className="bg-green-100 text-green-700 text-xs font-light shrink-0">
                            Allowed
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700 text-xs font-light shrink-0">
                            Not Allowed
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Beyond Primary Use Section */}
              <div className="pt-4 border-t border-neutral-100">
                <h4 className="text-sm font-normal text-neutral-700 mb-3">Beyond Primary Use</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="aiResearch"
                      checked={beyondPrimaryUse.aiResearch}
                      onCheckedChange={(checked) =>
                        setBeyondPrimaryUse(prev => ({ ...prev, aiResearch: !!checked }))
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="aiResearch" className="text-sm font-light text-neutral-700 cursor-pointer">
                        AI research / AI model training
                      </Label>
                    </div>
                    {collection.agreementOfTerms.beyondPrimaryUse.aiResearch ? (
                      <Badge className="bg-green-100 text-green-700 text-xs font-light shrink-0">Allowed</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 text-xs font-light shrink-0">Not Allowed</Badge>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="softwareDevelopment"
                      checked={beyondPrimaryUse.softwareDevelopment}
                      onCheckedChange={(checked) =>
                        setBeyondPrimaryUse(prev => ({ ...prev, softwareDevelopment: !!checked }))
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="softwareDevelopment" className="text-sm font-light text-neutral-700 cursor-pointer">
                        Software development and testing
                      </Label>
                    </div>
                    {collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment ? (
                      <Badge className="bg-green-100 text-green-700 text-xs font-light shrink-0">Allowed</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 text-xs font-light shrink-0">Not Allowed</Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Publication Section */}
              <div className="pt-4 border-t border-neutral-100">
                <h4 className="text-sm font-normal text-neutral-700 mb-3">Publication</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="internalCompanyRestricted"
                      checked={publication.internalCompanyRestricted}
                      onCheckedChange={(checked) =>
                        setPublication(prev => ({ ...prev, internalCompanyRestricted: !!checked }))
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="internalCompanyRestricted" className="text-sm font-light text-neutral-700 cursor-pointer">
                        Internal &apos;company restricted&apos; findings
                      </Label>
                    </div>
                    {collection.agreementOfTerms.publication.internalCompanyRestricted ? (
                      <Badge className="bg-green-100 text-green-700 text-xs font-light shrink-0">Allowed</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 text-xs font-light shrink-0">Not Allowed</Badge>
                    )}
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="externalPublication"
                      checked={publication.externalPublication}
                      onCheckedChange={(checked) =>
                        setPublication(prev => ({ ...prev, externalPublication: !!checked }))
                      }
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <Label htmlFor="externalPublication" className="text-sm font-light text-neutral-700 cursor-pointer">
                        External publication
                      </Label>
                    </div>
                    {collection.agreementOfTerms.publication.externalPublication ? (
                      <Badge className="bg-green-100 text-green-700 text-xs font-light shrink-0">Allowed</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-700 text-xs font-light shrink-0">Not Allowed</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Research Purpose */}
        <Card className="border-neutral-200 rounded-2xl">
          <CardContent className="p-6">
            <h3 className="text-lg font-normal text-neutral-900 mb-4">Research Details</h3>

            <div className="space-y-4">
              <div>
                <Label htmlFor="researchPurpose" className="text-sm font-normal text-neutral-700 mb-2 block">
                  Research Purpose <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="researchPurpose"
                  value={researchPurpose}
                  onChange={(e) => setResearchPurpose(e.target.value)}
                  placeholder="Describe your research goals and how you plan to use this data..."
                  className="min-h-[120px] rounded-xl border-neutral-200 font-light resize-none"
                />
                <p className="text-xs font-light text-neutral-500 mt-2">
                  This helps DCMs understand your needs and prioritize your request.
                </p>
              </div>

              <div>
                <Label htmlFor="duration" className="text-sm font-normal text-neutral-700 mb-2 block">
                  Expected Duration <span className="text-red-500">*</span>
                </Label>
                <Select value={duration} onValueChange={setDuration}>
                  <SelectTrigger className="w-full h-11 rounded-xl border-neutral-200 font-light">
                    <SelectValue placeholder="Select expected duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {DURATION_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="font-light">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms Agreement */}
        <Card className="border-neutral-200 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <Checkbox
                id="agreedToTerms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(!!checked)}
                className="mt-0.5"
              />
              <div className="flex-1">
                <Label htmlFor="agreedToTerms" className="text-sm font-light text-neutral-700 cursor-pointer">
                  I agree to use this data only for the intended purposes declared above and in accordance with
                  the collection&apos;s{" "}
                  <button
                    type="button"
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        sessionStorage.setItem("dcm_current_collection_id", params.id as string)
                      }
                      router.push("/collectoid/dcm/progress?tab=terms")
                    }}
                    className={cn(
                      "underline hover:no-underline",
                      scheme.from.replace("from-", "text-")
                    )}
                  >
                    Agreement of Terms
                  </button>
                  .
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intent Mismatch Warning (inline) */}
        {hasMismatches && !showMismatchWarning && (
          <Card className="border-amber-200 bg-amber-50 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-normal text-amber-900 mb-1">
                    Intent Mismatch Warning
                  </h4>
                  <p className="text-sm font-light text-amber-700 mb-3">
                    {intentMismatches.length} of your selected intents {intentMismatches.length === 1 ? &quot;doesn&apos;t&quot; : &quot;don&apos;t&quot;} match
                    the collection&apos;s Agreement of Terms. You can still submit, but you&apos;ll be prompted to resolve the mismatch.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {intentMismatches.map((mismatch) => (
                      <Badge
                        key={mismatch.field}
                        className="bg-amber-100 text-amber-700 font-light text-xs"
                      >
                        {mismatch.label}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="ghost"
            onClick={() => {
              if (typeof window !== "undefined") {
                sessionStorage.setItem("dcm_current_collection_id", params.id as string)
              }
              router.push("/collectoid/dcm/progress")
            }}
            className="rounded-xl font-light"
          >
            Cancel
          </Button>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => router.push(`/collectoid/collections/${params.id}/customize`)}
              className="h-12 rounded-xl font-light border-neutral-200"
            >
              <Sparkles className="size-4 mr-2" />
              Customize Instead
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={cn(
                "h-12 rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
                scheme.from,
                scheme.to
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

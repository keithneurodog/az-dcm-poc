"use client"

import { useState, useMemo, Suspense } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useColorScheme } from "@/app/collectoid-v2/_components"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  Check,
  X,
  Plus,
  Minus,
  Shield,
  Clock,
  Database,
  Send,
  Loader2,
  Sparkles,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// Mock collection data
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
  datasets: [
    { code: "DCODE-001", name: "NSCLC Genomic Profiling", phase: "Phase III", patients: 890, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-023", name: "Lung Cancer Survival Outcomes", phase: "Phase III", patients: 1200, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-042", name: "NSCLC ctDNA Monitoring", phase: "Phase III", patients: 890, status: "Closed", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-045", name: "Immunotherapy Response Study", phase: "Phase III", patients: 650, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-067", name: "Immunotherapy Response Phase III", phase: "Phase III", patients: 780, status: "Closed", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-088", name: "Lung Cancer Clinical Outcomes", phase: "Phase III", patients: 920, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-102", name: "PET Imaging Substudy", phase: "Phase III", patients: 340, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-134", name: "Biomarker Validation Study", phase: "Phase III", patients: 560, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-156", name: "Active NSCLC Trial", phase: "Phase III", patients: 1100, status: "Active", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-178", name: "Ongoing Immunotherapy Study", phase: "Phase III", patients: 890, status: "Active", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-189", name: "Multi-Site Biomarker Trial", phase: "Phase III", patients: 1450, status: "Active", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-201", name: "Phase III Active Study", phase: "Phase III", patients: 780, status: "Active", accessStatus: "approval", approvalTeam: "GPT-Oncology" },
    { code: "DCODE-223", name: "Multi-Regional Study", phase: "Phase III", patients: 2100, status: "Closed", accessStatus: "approval", approvalTeam: "TALT-Legal" },
    { code: "DCODE-267", name: "European Consortium Study", phase: "Phase III", patients: 1800, status: "Closed", accessStatus: "approval", approvalTeam: "TALT-Legal" },
    { code: "DCODE-288", name: "ctDNA Dynamics Study", phase: "Phase III", patients: 670, status: "Closed", accessStatus: "instant" },
    { code: "DCODE-312", name: "Response Prediction Analysis", phase: "Phase III", patients: 890, status: "Closed", accessStatus: "instant" },
  ],
}

// Additional datasets that could be added
const ADDITIONAL_DATASETS = [
  { code: "DCODE-299", name: "ctDNA Longitudinal Substudy", phase: "Phase III", patients: 450, status: "Closed" },
  { code: "DCODE-334", name: "NSCLC Biomarker Analysis", phase: "Phase II", patients: 320, status: "Closed" },
  { code: "DCODE-401", name: "Immunotherapy Response Predictors", phase: "Phase III", patients: 580, status: "Active" },
  { code: "DCODE-422", name: "Lung Cancer Genomics Panel", phase: "Phase II", patients: 210, status: "Closed" },
]

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

function CustomizeCollectionContent() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const isModificationRequest = searchParams.get("modify") === "true"

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showAddDatasets, setShowAddDatasets] = useState(false)

  // Collection customization state
  const [customName, setCustomName] = useState("")
  const [customDescription, setCustomDescription] = useState("")
  const [rationale, setRationale] = useState("")
  const [duration, setDuration] = useState("")

  // Dataset selection state
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>(
    MOCK_COLLECTION.datasets.map(d => d.code)
  )
  const [addedDatasets, setAddedDatasets] = useState<string[]>([])

  // Intent state (start with collection defaults)
  const [primaryUse, setPrimaryUse] = useState({
    understandDrugMechanism: MOCK_COLLECTION.agreementOfTerms.primaryUse.understandDrugMechanism,
    understandDisease: MOCK_COLLECTION.agreementOfTerms.primaryUse.understandDisease,
    developDiagnosticTests: MOCK_COLLECTION.agreementOfTerms.primaryUse.developDiagnosticTests,
    learnFromPastStudies: MOCK_COLLECTION.agreementOfTerms.primaryUse.learnFromPastStudies,
    improveAnalysisMethods: MOCK_COLLECTION.agreementOfTerms.primaryUse.improveAnalysisMethods,
  })
  const [beyondPrimaryUse, setBeyondPrimaryUse] = useState({
    aiResearch: MOCK_COLLECTION.agreementOfTerms.beyondPrimaryUse.aiResearch,
    softwareDevelopment: MOCK_COLLECTION.agreementOfTerms.beyondPrimaryUse.softwareDevelopment,
  })
  const [publication, setPublication] = useState({
    internalCompanyRestricted: MOCK_COLLECTION.agreementOfTerms.publication.internalCompanyRestricted,
    externalPublication: MOCK_COLLECTION.agreementOfTerms.publication.externalPublication,
  })

  const collection = MOCK_COLLECTION

  // Calculate changes from original
  const removedDatasets = collection.datasets.filter(d => !selectedDatasets.includes(d.code))
  const hasDatasetChanges = removedDatasets.length > 0 || addedDatasets.length > 0
  const hasIntentChanges = useMemo(() => {
    return (
      beyondPrimaryUse.softwareDevelopment !== collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment ||
      beyondPrimaryUse.aiResearch !== collection.agreementOfTerms.beyondPrimaryUse.aiResearch ||
      publication.internalCompanyRestricted !== collection.agreementOfTerms.publication.internalCompanyRestricted ||
      publication.externalPublication !== collection.agreementOfTerms.publication.externalPublication
    )
  }, [beyondPrimaryUse, publication, collection.agreementOfTerms])

  const totalChanges = removedDatasets.length + addedDatasets.length + (hasIntentChanges ? 1 : 0)

  // Form validation
  const isFormValid = useMemo(() => {
    const hasName = customName.trim().length > 0
    const hasRationale = rationale.trim().length > 0
    const hasDuration = duration.length > 0
    const hasChanges = hasDatasetChanges || hasIntentChanges

    return hasName && hasRationale && hasDuration && hasChanges
  }, [customName, rationale, duration, hasDatasetChanges, hasIntentChanges])

  const handleToggleDataset = (code: string) => {
    setSelectedDatasets(prev =>
      prev.includes(code)
        ? prev.filter(c => c !== code)
        : [...prev, code]
    )
  }

  const handleAddDataset = (code: string) => {
    if (!addedDatasets.includes(code)) {
      setAddedDatasets(prev => [...prev, code])
    }
  }

  const handleRemoveAddedDataset = (code: string) => {
    setAddedDatasets(prev => prev.filter(c => c !== code))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    // Redirect to request confirmation with proposition ID
    router.push(`/collectoid-v2/requests/prop-${Date.now()}?type=proposition`)
  }

  return (
    <div className="py-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => {
            if (typeof window !== "undefined") {
              sessionStorage.setItem("dcm_current_collection_id", params.id as string)
            }
            router.push("/collectoid-v2/dcm/progress")
          }}
          className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Collection
        </button>

        <div className="flex items-start gap-4">
          <div className={cn(
            "flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br shrink-0",
            scheme.from,
            scheme.to
          )}>
            <Sparkles className="size-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight mb-2">
              {isModificationRequest ? "Request Collection Modification" : "Create Custom Collection"}
            </h1>
            <p className="text-base font-light text-neutral-600">
              Based on <span className="font-normal">{collection.name}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <Card className={cn(
        "border-2 rounded-2xl overflow-hidden mb-8",
        scheme.from.replace("from-", "border-").replace("-500", "-200")
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className={cn("size-5 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
            <div>
              <p className="text-sm font-light text-neutral-600">
                {isModificationRequest ? (
                  <>
                    Your modification request will be sent to the DCM for review.
                    If approved, the changes will apply to <span className="font-normal">all users</span> of this collection.
                  </>
                ) : (
                  <>
                    This will create a new <span className="font-normal">Collection Proposition</span> for DCM review.
                    Once approved, it will be linked to the parent collection as &quot;derived from&quot;.
                  </>
                )}
              </p>
              <p className="text-xs font-light text-neutral-500 mt-1">
                Estimated review time: 3-5 business days
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Form - 2 columns */}
        <div className="col-span-2 space-y-6">
          {/* Custom Name & Description */}
          <Card className="border-neutral-200 rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-normal text-neutral-900 mb-4">Collection Details</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="customName" className="text-sm font-normal text-neutral-700 mb-2 block">
                    Collection Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="customName"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g., Oncology ctDNA Outcomes + ML Training Rights"
                    className="h-11 rounded-xl border-neutral-200 font-light"
                  />
                </div>

                <div>
                  <Label htmlFor="customDescription" className="text-sm font-normal text-neutral-700 mb-2 block">
                    Description (optional)
                  </Label>
                  <Textarea
                    id="customDescription"
                    value={customDescription}
                    onChange={(e) => setCustomDescription(e.target.value)}
                    placeholder="Describe the purpose of this custom collection..."
                    className="min-h-[80px] rounded-xl border-neutral-200 font-light resize-none"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Datasets Selection */}
          <Card className="border-neutral-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-normal text-neutral-900">Datasets</h3>
                  <p className="text-sm font-light text-neutral-500">
                    {selectedDatasets.length + addedDatasets.length} of {collection.datasets.length + ADDITIONAL_DATASETS.length} datasets selected
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddDatasets(!showAddDatasets)}
                  className="rounded-lg font-light border-neutral-200"
                >
                  <Plus className="size-4 mr-1" />
                  Add Datasets
                  {showAddDatasets ? <ChevronUp className="size-4 ml-1" /> : <ChevronDown className="size-4 ml-1" />}
                </Button>
              </div>

              {/* Add Datasets Panel */}
              {showAddDatasets && (
                <div className="mb-4 p-4 rounded-xl bg-neutral-50 border border-neutral-200">
                  <p className="text-sm font-light text-neutral-600 mb-3">
                    Additional datasets you can add to this collection:
                  </p>
                  <div className="space-y-2">
                    {ADDITIONAL_DATASETS.filter(d => !addedDatasets.includes(d.code)).map((dataset) => (
                      <div
                        key={dataset.code}
                        className="flex items-center justify-between p-3 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="font-mono text-xs">
                            {dataset.code}
                          </Badge>
                          <div>
                            <p className="text-sm font-light text-neutral-700">{dataset.name}</p>
                            <p className="text-xs font-light text-neutral-500">
                              {dataset.phase} • {dataset.patients} patients
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAddDataset(dataset.code)}
                          className="rounded-lg text-green-600 hover:text-green-700 hover:bg-green-50"
                        >
                          <Plus className="size-4" />
                        </Button>
                      </div>
                    ))}
                    {ADDITIONAL_DATASETS.filter(d => !addedDatasets.includes(d.code)).length === 0 && (
                      <p className="text-sm font-light text-neutral-500 text-center py-2">
                        All available datasets have been added
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Added Datasets */}
              {addedDatasets.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-normal text-green-700 mb-2">
                    + Added datasets ({addedDatasets.length})
                  </p>
                  <div className="space-y-2">
                    {ADDITIONAL_DATASETS.filter(d => addedDatasets.includes(d.code)).map((dataset) => (
                      <div
                        key={dataset.code}
                        className="flex items-center justify-between p-3 rounded-lg bg-green-50 border border-green-200"
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveAddedDataset(dataset.code)}
                          className="rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Current Datasets */}
              <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {collection.datasets.map((dataset) => {
                  const isSelected = selectedDatasets.includes(dataset.code)
                  return (
                    <div
                      key={dataset.code}
                      className={cn(
                        "flex items-center justify-between p-3 rounded-lg border transition-colors",
                        isSelected
                          ? "bg-white border-neutral-200"
                          : "bg-red-50 border-red-200"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => handleToggleDataset(dataset.code)}
                        />
                        <Badge variant="outline" className="font-mono text-xs">
                          {dataset.code}
                        </Badge>
                        <div>
                          <p className="text-sm font-light text-neutral-700">{dataset.name}</p>
                          <p className="text-xs font-light text-neutral-500">
                            {dataset.phase} • {dataset.patients.toLocaleString()} patients
                          </p>
                        </div>
                      </div>
                      {!isSelected && (
                        <Badge className="bg-red-100 text-red-700 font-light text-xs">
                          Removed
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Intent Modifications */}
          <Card className="border-neutral-200 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="size-5 text-neutral-700" />
                <h3 className="text-lg font-normal text-neutral-900">Requested Uses</h3>
              </div>
              <p className="text-sm font-light text-neutral-500 mb-4">
                Select the uses you need. Uses marked as &quot;Not in original&quot; will require DCM approval.
              </p>

              <div className="space-y-6">
                {/* Primary Use */}
                <div>
                  <h4 className="text-sm font-normal text-neutral-700 mb-3">Primary Use (IMI-Guided)</h4>
                  <div className="space-y-2">
                    {PRIMARY_USE_OPTIONS.map((option) => {
                      const originalValue = collection.agreementOfTerms.primaryUse[option.key as keyof typeof collection.agreementOfTerms.primaryUse]
                      const currentValue = primaryUse[option.key as keyof typeof primaryUse]
                      return (
                        <div key={option.key} className="flex items-center gap-3">
                          <Checkbox
                            id={`primary-${option.key}`}
                            checked={currentValue}
                            onCheckedChange={(checked) =>
                              setPrimaryUse(prev => ({ ...prev, [option.key]: checked }))
                            }
                          />
                          <Label
                            htmlFor={`primary-${option.key}`}
                            className="text-sm font-light text-neutral-700 cursor-pointer flex-1"
                          >
                            {option.label}
                          </Label>
                          {originalValue && (
                            <Badge className="bg-neutral-100 text-neutral-600 text-xs font-light">
                              In original
                            </Badge>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Beyond Primary Use */}
                <div className="pt-4 border-t border-neutral-100">
                  <h4 className="text-sm font-normal text-neutral-700 mb-3">Beyond Primary Use</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="customize-aiResearch"
                        checked={beyondPrimaryUse.aiResearch}
                        onCheckedChange={(checked) =>
                          setBeyondPrimaryUse(prev => ({ ...prev, aiResearch: !!checked }))
                        }
                      />
                      <Label htmlFor="customize-aiResearch" className="text-sm font-light text-neutral-700 cursor-pointer flex-1">
                        AI research / AI model training
                      </Label>
                      {collection.agreementOfTerms.beyondPrimaryUse.aiResearch ? (
                        <Badge className="bg-neutral-100 text-neutral-600 text-xs font-light">In original</Badge>
                      ) : beyondPrimaryUse.aiResearch ? (
                        <Badge className="bg-amber-100 text-amber-700 text-xs font-light">Requires approval</Badge>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="customize-softwareDevelopment"
                        checked={beyondPrimaryUse.softwareDevelopment}
                        onCheckedChange={(checked) =>
                          setBeyondPrimaryUse(prev => ({ ...prev, softwareDevelopment: !!checked }))
                        }
                      />
                      <Label htmlFor="customize-softwareDevelopment" className="text-sm font-light text-neutral-700 cursor-pointer flex-1">
                        Software development and testing
                      </Label>
                      {collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment ? (
                        <Badge className="bg-neutral-100 text-neutral-600 text-xs font-light">In original</Badge>
                      ) : beyondPrimaryUse.softwareDevelopment ? (
                        <Badge className="bg-amber-100 text-amber-700 text-xs font-light">Requires approval</Badge>
                      ) : null}
                    </div>
                  </div>
                </div>

                {/* Publication */}
                <div className="pt-4 border-t border-neutral-100">
                  <h4 className="text-sm font-normal text-neutral-700 mb-3">Publication</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="customize-internalCompanyRestricted"
                        checked={publication.internalCompanyRestricted}
                        onCheckedChange={(checked) =>
                          setPublication(prev => ({ ...prev, internalCompanyRestricted: !!checked }))
                        }
                      />
                      <Label htmlFor="customize-internalCompanyRestricted" className="text-sm font-light text-neutral-700 cursor-pointer flex-1">
                        Internal &apos;company restricted&apos; findings
                      </Label>
                      {collection.agreementOfTerms.publication.internalCompanyRestricted ? (
                        <Badge className="bg-neutral-100 text-neutral-600 text-xs font-light">In original</Badge>
                      ) : publication.internalCompanyRestricted ? (
                        <Badge className="bg-amber-100 text-amber-700 text-xs font-light">Requires approval</Badge>
                      ) : null}
                    </div>

                    <div className="flex items-center gap-3">
                      <Checkbox
                        id="customize-externalPublication"
                        checked={publication.externalPublication}
                        onCheckedChange={(checked) =>
                          setPublication(prev => ({ ...prev, externalPublication: !!checked }))
                        }
                      />
                      <Label htmlFor="customize-externalPublication" className="text-sm font-light text-neutral-700 cursor-pointer flex-1">
                        External publication
                      </Label>
                      {collection.agreementOfTerms.publication.externalPublication ? (
                        <Badge className="bg-neutral-100 text-neutral-600 text-xs font-light">In original</Badge>
                      ) : publication.externalPublication ? (
                        <Badge className="bg-amber-100 text-amber-700 text-xs font-light">Requires approval</Badge>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rationale */}
          <Card className="border-neutral-200 rounded-2xl">
            <CardContent className="p-6">
              <h3 className="text-lg font-normal text-neutral-900 mb-4">Request Details</h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="rationale" className="text-sm font-normal text-neutral-700 mb-2 block">
                    Why do you need these changes? <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="rationale"
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    placeholder="Explain why you need these modifications and how they support your research goals..."
                    className="min-h-[120px] rounded-xl border-neutral-200 font-light resize-none"
                  />
                  <p className="text-xs font-light text-neutral-500 mt-2">
                    A clear rationale helps DCMs process your request faster.
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
        </div>

        {/* Summary Sidebar - 1 column */}
        <div className="space-y-6">
          {/* Changes Summary */}
          <Card className="border-neutral-200 rounded-2xl sticky top-8">
            <CardContent className="p-6">
              <h3 className="text-lg font-normal text-neutral-900 mb-4">Summary of Changes</h3>

              {totalChanges === 0 ? (
                <div className="text-center py-8">
                  <div className="flex size-12 items-center justify-center rounded-full bg-neutral-100 mx-auto mb-3">
                    <Info className="size-6 text-neutral-400" />
                  </div>
                  <p className="text-sm font-light text-neutral-500">
                    No changes made yet
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Dataset changes */}
                  {removedDatasets.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Minus className="size-4 text-red-600" />
                        <span className="text-sm font-light text-neutral-700">
                          {removedDatasets.length} dataset{removedDatasets.length > 1 ? "s" : ""} removed
                        </span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {removedDatasets.slice(0, 3).map((d) => (
                          <p key={d.code} className="text-xs font-light text-neutral-500">
                            {d.code}: {d.name}
                          </p>
                        ))}
                        {removedDatasets.length > 3 && (
                          <p className="text-xs font-light text-neutral-400">
                            +{removedDatasets.length - 3} more
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {addedDatasets.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Plus className="size-4 text-green-600" />
                        <span className="text-sm font-light text-neutral-700">
                          {addedDatasets.length} dataset{addedDatasets.length > 1 ? "s" : ""} added
                        </span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {addedDatasets.map((code) => {
                          const dataset = ADDITIONAL_DATASETS.find(d => d.code === code)
                          return (
                            <p key={code} className="text-xs font-light text-neutral-500">
                              {code}: {dataset?.name}
                            </p>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {hasIntentChanges && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Shield className="size-4 text-amber-600" />
                        <span className="text-sm font-light text-neutral-700">
                          Intent modifications
                        </span>
                      </div>
                      <div className="pl-6 space-y-1">
                        {beyondPrimaryUse.softwareDevelopment !== collection.agreementOfTerms.beyondPrimaryUse.softwareDevelopment && (
                          <p className="text-xs font-light text-neutral-500">
                            Software development: {beyondPrimaryUse.softwareDevelopment ? "Added" : "Removed"}
                          </p>
                        )}
                        {beyondPrimaryUse.aiResearch !== collection.agreementOfTerms.beyondPrimaryUse.aiResearch && (
                          <p className="text-xs font-light text-neutral-500">
                            AI research: {beyondPrimaryUse.aiResearch ? "Added" : "Removed"}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Estimated Review Time */}
              <div className="mt-6 pt-4 border-t border-neutral-100">
                <div className="flex items-center gap-2 text-sm font-light text-neutral-600">
                  <Clock className="size-4" />
                  <span>Est. review: <span className="font-normal">3-5 days</span></span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-6 space-y-3">
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid || isSubmitting}
                  className={cn(
                    "w-full h-12 rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
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
                      Submit Proposition
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      sessionStorage.setItem("dcm_current_collection_id", params.id as string)
                    }
                    router.push("/collectoid-v2/dcm/progress")
                  }}
                  className="w-full font-light text-neutral-500"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function CustomizeCollectionPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <CustomizeCollectionContent />
    </Suspense>
  )
}

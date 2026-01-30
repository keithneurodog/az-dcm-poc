"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { useWorkspace } from "../layout"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Shield,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileText,
  Zap,
  Globe,
  Lock,
  BookOpen,
  Brain,
  Code,
  Share2,
  Database,
  Trash2,
} from "lucide-react"
import {
  AgreementOfTerms,
  AoTConflict,
  suggestAoT,
  detectAoTConflicts,
} from "@/lib/dcm-mock-data"

export default function WorkspaceTermsPage() {
  const router = useRouter()
  const { scheme } = useColorScheme()
  const workspace = useWorkspace()

  const [aot, setAot] = useState<AgreementOfTerms | null>(null)
  const [conflicts, setConflicts] = useState<AoTConflict[]>([])
  const [conflictsExpanded, setConflictsExpanded] = useState(false)
  const [acknowledgedConflicts, setAcknowledgedConflicts] = useState(false)

  // Initialize AoT from sessionStorage or create suggested one
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAoT = sessionStorage.getItem("dcm_agreement_of_terms")
      if (savedAoT) {
        setAot(JSON.parse(savedAoT))
      } else if (workspace.selectedDatasets.length > 0 && workspace.selectedActivities.length > 0) {
        // Convert activity IDs to activity objects for suggestion
        const activityObjects = workspace.selectedActivities.map(id => ({
          id,
          category: id.includes("etl") || id.includes("variant") ? "engineering" as const : "analysis" as const,
          name: id,
          description: "",
          accessLevel: ""
        }))
        const suggested = suggestAoT(activityObjects, workspace.selectedDatasets)
        setAot(suggested)
      } else {
        // Default AoT
        setAot({
          id: `aot-${Date.now()}`,
          version: "1.0",
          aiSuggested: false,
          userModified: [],
          createdAt: new Date(),
          createdBy: "current-user",
          primaryUse: {
            understandDrugMechanism: true,
            understandDisease: true,
            developDiagnosticTests: false,
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
          externalSharing: {
            allowed: false,
          },
          userScope: {
            totalUserCount: 0,
          },
        })
      }
    }
  }, [workspace.selectedDatasets, workspace.selectedActivities])

  // Detect conflicts when AoT or datasets change
  useEffect(() => {
    if (aot && workspace.selectedDatasets.length > 0) {
      const detectedConflicts = detectAoTConflicts(aot, workspace.selectedDatasets)
      setConflicts(detectedConflicts)
    }
  }, [aot, workspace.selectedDatasets])

  const updateAoT = (updates: Partial<AgreementOfTerms>) => {
    if (!aot) return
    setAot({ ...aot, ...updates })
  }

  const togglePrimaryUse = (key: keyof AgreementOfTerms['primaryUse']) => {
    if (!aot) return
    updateAoT({
      primaryUse: {
        ...aot.primaryUse,
        [key]: !aot.primaryUse[key]
      }
    })
  }

  const toggleBeyondPrimaryUse = (key: keyof AgreementOfTerms['beyondPrimaryUse']) => {
    if (!aot) return
    updateAoT({
      beyondPrimaryUse: {
        ...aot.beyondPrimaryUse,
        [key]: !aot.beyondPrimaryUse[key]
      }
    })
  }

  const removeDataset = (datasetId: string) => {
    const updatedDatasets = workspace.selectedDatasets.filter(d => d.id !== datasetId)
    workspace.setSelectedDatasets(updatedDatasets)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_selected_datasets", JSON.stringify(updatedDatasets))
    }
  }

  const handleContinue = () => {
    if (aot) {
      sessionStorage.setItem("dcm_agreement_of_terms", JSON.stringify(aot))
      workspace.setHasAgreementOfTerms(true)
    }
    router.push("/collectoid-v2/dcm/create/workspace")
  }

  // Calculate dataset restriction counts
  const datasetsRestrictML = workspace.selectedDatasets.filter(d => d.aotMetadata?.restrictML).length
  const datasetsRestrictPub = workspace.selectedDatasets.filter(d => d.aotMetadata?.restrictPublication).length
  const datasetsRestrictSoftDev = workspace.selectedDatasets.filter(d => d.aotMetadata?.restrictSoftwareDev).length

  const canContinue = !conflicts.length || acknowledgedConflicts

  const primaryUseOptions = [
    { key: 'understandDrugMechanism', label: 'Understand how drugs work', icon: Zap },
    { key: 'understandDisease', label: 'Better understand disease', icon: BookOpen },
    { key: 'developDiagnosticTests', label: 'Develop diagnostic tests', icon: FileText },
    { key: 'learnFromPastStudies', label: 'Learn from past studies', icon: Brain },
    { key: 'improveAnalysisMethods', label: 'Improve analysis methods', icon: Code },
  ]

  if (!aot) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-neutral-500 font-light">Loading terms...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div
          className={cn(
            "inline-flex items-center justify-center size-16 rounded-2xl mb-4 bg-gradient-to-br",
            scheme.bg,
            scheme.bgHover
          )}
        >
          <Shield className={cn("size-8", scheme.from.replace("from-", "text-"))} />
        </div>
        <h1 className="text-2xl font-extralight text-neutral-900 mb-2 tracking-tight">
          Agreement of Terms
        </h1>
        <p className="text-sm font-light text-neutral-600 max-w-xl mx-auto">
          Define data use restrictions and publication rights for this collection
        </p>
      </div>

      {/* AI Suggestion Panel */}
      {aot.aiSuggested && (
        <Card className={cn(
          "border rounded-2xl overflow-hidden",
          scheme.from.replace("from-", "border-").replace("500", "200")
        )}>
          <CardContent className={cn("p-5 bg-gradient-to-br", scheme.bg, scheme.bgHover)}>
            <div className="flex items-start gap-4">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg shrink-0",
                scheme.from, scheme.to
              )}>
                <Sparkles className="size-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-base font-normal text-neutral-900">AI-Suggested Terms</h3>
                  <Badge variant="outline" className={cn(
                    "font-light text-xs px-2 py-0.5 rounded-full",
                    scheme.from.replace("from-", "border-"),
                    scheme.from.replace("from-", "text-")
                  )}>
                    <Sparkles className="size-2.5 mr-1" />
                    AI
                  </Badge>
                </div>
                <p className="text-xs text-neutral-600 font-light mb-3">
                  Based on your selected activities and datasets:
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white/70 rounded-lg">
                    <CheckCircle2 className="size-3.5 text-green-600" />
                    <span className="font-light text-neutral-700 text-xs">Primary use allowed</span>
                  </div>
                  {datasetsRestrictML > 0 && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-100/70 rounded-lg border border-amber-300">
                      <AlertCircle className="size-3.5 text-amber-600" />
                      <span className="font-light text-amber-800 text-xs">AI/ML restricted ({datasetsRestrictML})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Primary Use */}
        <Card className="border-neutral-200 rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("flex size-9 items-center justify-center rounded-xl bg-gradient-to-br", scheme.bg)}>
                <Shield className={cn("size-4", scheme.from.replace("from-", "text-"))} />
              </div>
              <div>
                <h2 className="text-base font-normal text-neutral-900">Primary Use</h2>
                <p className="text-xs text-neutral-500 font-light">IMI-Guided Protocol</p>
              </div>
            </div>

            <div className="space-y-2">
              {primaryUseOptions.map(({ key, label, icon: Icon }) => {
                const isChecked = aot.primaryUse[key as keyof typeof aot.primaryUse]
                return (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer",
                      isChecked
                        ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    )}
                    onClick={() => togglePrimaryUse(key as keyof typeof aot.primaryUse)}
                  >
                    <Checkbox
                      id={key}
                      checked={isChecked}
                      onCheckedChange={() => togglePrimaryUse(key as keyof typeof aot.primaryUse)}
                    />
                    <Icon className={cn(
                      "size-3.5 shrink-0",
                      isChecked ? scheme.from.replace("from-", "text-") : "text-neutral-400"
                    )} />
                    <span className="font-light text-neutral-700 cursor-pointer text-sm flex-1">
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
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("flex size-9 items-center justify-center rounded-xl bg-gradient-to-br", scheme.bg)}>
                <Zap className={cn("size-4", scheme.from.replace("from-", "text-"))} />
              </div>
              <div>
                <h2 className="text-base font-normal text-neutral-900">Beyond Primary Use</h2>
                <p className="text-xs text-neutral-500 font-light">Advanced capabilities</p>
              </div>
            </div>

            <div className="space-y-2">
              {/* AI Research */}
              <div
                className={cn(
                  "flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer",
                  aot.beyondPrimaryUse.aiResearch
                    ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                    : "border-neutral-200 hover:border-neutral-300 bg-white"
                )}
                onClick={() => toggleBeyondPrimaryUse('aiResearch')}
              >
                <Checkbox
                  id="aiResearch"
                  checked={aot.beyondPrimaryUse.aiResearch}
                  onCheckedChange={() => toggleBeyondPrimaryUse('aiResearch')}
                  className="mt-0.5"
                />
                <Brain className={cn(
                  "size-4 shrink-0 mt-0.5",
                  aot.beyondPrimaryUse.aiResearch ? scheme.from.replace("from-", "text-") : "text-neutral-400"
                )} />
                <div className="flex-1">
                  <span className="font-light text-neutral-700 cursor-pointer text-sm">
                    AI research / AI model training
                  </span>
                  {datasetsRestrictML > 0 && aot.beyondPrimaryUse.aiResearch && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1 font-light">
                      <AlertCircle className="size-3" />
                      {datasetsRestrictML} dataset{datasetsRestrictML !== 1 ? 's' : ''} restricted
                    </p>
                  )}
                </div>
              </div>

              {/* Software Development */}
              <div
                className={cn(
                  "flex items-start gap-2.5 p-3 rounded-xl border transition-all cursor-pointer",
                  aot.beyondPrimaryUse.softwareDevelopment
                    ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                    : "border-neutral-200 hover:border-neutral-300 bg-white"
                )}
                onClick={() => toggleBeyondPrimaryUse('softwareDevelopment')}
              >
                <Checkbox
                  id="softwareDevelopment"
                  checked={aot.beyondPrimaryUse.softwareDevelopment}
                  onCheckedChange={() => toggleBeyondPrimaryUse('softwareDevelopment')}
                  className="mt-0.5"
                />
                <Code className={cn(
                  "size-4 shrink-0 mt-0.5",
                  aot.beyondPrimaryUse.softwareDevelopment ? scheme.from.replace("from-", "text-") : "text-neutral-400"
                )} />
                <div className="flex-1">
                  <span className="font-light text-neutral-700 cursor-pointer text-sm">
                    Software development and testing
                  </span>
                  {datasetsRestrictSoftDev > 0 && aot.beyondPrimaryUse.softwareDevelopment && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1 font-light">
                      <AlertCircle className="size-3" />
                      {datasetsRestrictSoftDev} dataset{datasetsRestrictSoftDev !== 1 ? 's' : ''} restricted
                    </p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Publication Rights */}
        <Card className="border-neutral-200 rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("flex size-9 items-center justify-center rounded-xl bg-gradient-to-br", scheme.bg)}>
                <FileText className={cn("size-4", scheme.from.replace("from-", "text-"))} />
              </div>
              <div>
                <h2 className="text-base font-normal text-neutral-900">Publication Rights</h2>
                <p className="text-xs text-neutral-500 font-light">Internal & external</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Internal Publication */}
              <div
                className={cn(
                  "flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer",
                  aot.publication.internalCompanyRestricted
                    ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                    : "border-neutral-200 hover:border-neutral-300 bg-white"
                )}
                onClick={() => updateAoT({
                  publication: { ...aot.publication, internalCompanyRestricted: !aot.publication.internalCompanyRestricted }
                })}
              >
                <Checkbox
                  id="internalPub"
                  checked={aot.publication.internalCompanyRestricted}
                />
                <Lock className={cn(
                  "size-3.5",
                  aot.publication.internalCompanyRestricted ? scheme.from.replace("from-", "text-") : "text-neutral-400"
                )} />
                <span className="font-light text-neutral-700 cursor-pointer text-sm">
                  Internal company-restricted findings
                </span>
              </div>

              <Separator />

              {/* External Publication */}
              <div className="space-y-2">
                <Label className="font-light text-neutral-600 text-xs">External publication:</Label>
                <RadioGroup
                  value={aot.publication.externalPublication === true ? "allowed" : aot.publication.externalPublication === false ? "not_allowed" : "by_exception"}
                  onValueChange={(value) => {
                    let extPub: boolean | "by_exception" = false
                    if (value === "allowed") extPub = true
                    else if (value === "by_exception") extPub = "by_exception"
                    updateAoT({ publication: { ...aot.publication, externalPublication: extPub } })
                  }}
                  className="space-y-1.5"
                >
                  {[
                    { value: "not_allowed", label: "Not allowed" },
                    { value: "by_exception", label: "By exception (requires approval)" },
                    { value: "allowed", label: "Allowed with standard process" },
                  ].map(option => (
                    <label
                      key={option.value}
                      htmlFor={`pub-${option.value}`}
                      className={cn(
                        "flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer",
                        (aot.publication.externalPublication === true && option.value === "allowed") ||
                        (aot.publication.externalPublication === false && option.value === "not_allowed") ||
                        (aot.publication.externalPublication === "by_exception" && option.value === "by_exception")
                          ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                          : "border-neutral-200 hover:border-neutral-300 bg-white"
                      )}
                    >
                      <RadioGroupItem value={option.value} id={`pub-${option.value}`} />
                      <span className="font-light text-neutral-700 text-sm">{option.label}</span>
                    </label>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* External Sharing */}
        <Card className="border-neutral-200 rounded-2xl overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn("flex size-9 items-center justify-center rounded-xl bg-gradient-to-br", scheme.bg)}>
                <Share2 className={cn("size-4", scheme.from.replace("from-", "text-"))} />
              </div>
              <div>
                <h2 className="text-base font-normal text-neutral-900">External Sharing</h2>
                <p className="text-xs text-neutral-500 font-light">Data outside organization</p>
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 rounded-xl border transition-all cursor-pointer mb-3",
                aot.externalSharing.allowed
                  ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                  : "border-neutral-200 hover:border-neutral-300 bg-white"
              )}
              onClick={() => updateAoT({
                externalSharing: { ...aot.externalSharing, allowed: !aot.externalSharing.allowed }
              })}
            >
              <Checkbox
                id="externalSharing"
                checked={aot.externalSharing.allowed}
              />
              <Globe className={cn(
                "size-3.5",
                aot.externalSharing.allowed ? scheme.from.replace("from-", "text-") : "text-neutral-400"
              )} />
              <span className="font-light text-neutral-700 cursor-pointer text-sm">
                External sharing allowed
              </span>
            </div>

            {aot.externalSharing.allowed && (
              <Textarea
                value={aot.externalSharing.process || ''}
                onChange={(e) => updateAoT({
                  externalSharing: { ...aot.externalSharing, process: e.target.value }
                })}
                className="font-light rounded-xl border-neutral-200 min-h-[80px] resize-none text-sm"
                placeholder="Describe the process for external sharing..."
              />
            )}

            {!aot.externalSharing.allowed && (
              <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="text-xs font-light text-neutral-500 text-center">
                  External sharing is disabled
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conflicts Panel */}
      {conflicts.length > 0 && (
        <Card className={cn(
          "border-2 rounded-2xl overflow-hidden bg-gradient-to-br",
          scheme.from.replace("from-", "border-").replace("500", "300"),
          scheme.bg, scheme.bgHover
        )}>
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className={cn(
                  "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg shrink-0",
                  scheme.from, scheme.to
                )}>
                  <AlertCircle className="size-5 text-white" />
                </div>
                <div>
                  <h3 className={cn("font-normal text-base mb-1", scheme.from.replace("from-", "text-").replace("500", "900"))}>
                    Dataset Conflicts Detected
                  </h3>
                  <p className={cn("text-sm font-light", scheme.from.replace("from-", "text-").replace("500", "700"))}>
                    {conflicts.length} dataset{conflicts.length !== 1 ? 's have' : ' has'} restrictions that conflict with your terms
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConflictsExpanded(!conflictsExpanded)}
                className="rounded-full font-light text-xs"
              >
                {conflictsExpanded ? (
                  <><ChevronUp className="size-3.5 mr-1" />Hide</>
                ) : (
                  <><ChevronDown className="size-3.5 mr-1" />Details</>
                )}
              </Button>
            </div>

            {conflictsExpanded && (
              <div className="space-y-2 mb-4">
                {conflicts.map((conflict, idx) => (
                  <div key={idx} className="p-3 bg-white/80 rounded-xl border border-amber-200">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-normal text-sm text-neutral-900 mb-0.5">
                          {conflict.datasetCode}: {conflict.datasetName}
                        </p>
                        <p className="text-xs text-neutral-600 font-light">
                          {conflict.conflictDescription}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDataset(conflict.datasetId)}
                        className="h-7 w-7 p-0 rounded-full hover:bg-red-100 hover:text-red-600"
                        title="Remove dataset"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-start gap-2.5 p-3 bg-white/80 rounded-xl border-2 border-amber-300">
              <Checkbox
                id="acknowledgeConflicts"
                checked={acknowledgedConflicts}
                onCheckedChange={(checked) => setAcknowledgedConflicts(checked as boolean)}
                className="mt-0.5"
              />
              <Label htmlFor="acknowledgeConflicts" className="font-light text-neutral-700 cursor-pointer text-sm">
                I acknowledge these conflicts and take responsibility for proceeding
              </Label>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        disabled={!canContinue}
        className={cn(
          "w-full h-11 rounded-xl font-light shadow-md hover:shadow-lg transition-all",
          canContinue
            ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
            : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
        )}
      >
        Save & Continue
        <ArrowRight className="size-4 ml-2" />
      </Button>
    </div>
  )
}

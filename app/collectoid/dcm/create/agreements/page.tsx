"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useColorScheme } from "@/components/ux12-color-context"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  ArrowLeft,
  Shield,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Users,
  FileText,
  Zap,
  Globe,
  Lock,
  BookOpen,
  Brain,
  Code,
  Share2,
  Building2,
  UserCheck,
  IdCard,
  Plus,
  Trash2,
  Database,
} from "lucide-react"
import {
  Dataset,
  AgreementOfTerms,
  Activity,
  AoTConflict,
  suggestAoT,
  detectAoTConflicts,
} from "@/lib/dcm-mock-data"

// User management constants
const ORGANIZATIONS = [
  { id: "onc-biometrics", name: "Oncology Biometrics", users: 45, roles: ["Data Scientists (28)", "Biostatisticians (17)"] },
  { id: "onc-data-sci", name: "Oncology Data Science", users: 60, roles: ["Data Scientists (42)", "Engineers (18)"] },
  { id: "trans-med-onc", name: "Translational Medicine - Oncology", users: 15, roles: ["Scientists (12)", "Data Analysts (3)"] },
  { id: "clin-ops", name: "Clinical Operations", users: 32, roles: ["Clinical Data Managers (20)", "Study Coordinators (12)"] },
]

const ROLES = [
  { id: "data-scientist", name: "Data Scientist", count: 82 },
  { id: "biostatistician", name: "Biostatistician", count: 20 },
  { id: "engineer", name: "Data Engineer", count: 18 },
  { id: "analyst", name: "Data Analyst", count: 15 },
  { id: "clinical-dm", name: "Clinical Data Manager", count: 20 },
]

export default function AgreementOfTermsPage() {
  const router = useRouter()
  const { scheme } = useColorScheme()

  const [datasets, setDatasets] = useState<Dataset[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [aot, setAot] = useState<AgreementOfTerms | null>(null)
  const [conflicts, setConflicts] = useState<AoTConflict[]>([])
  const [conflictsExpanded, setConflictsExpanded] = useState(false)
  const [acknowledgedConflicts, setAcknowledgedConflicts] = useState(false)
  const [removeAllDialogOpen, setRemoveAllDialogOpen] = useState(false)

  // User management state
  const [userDialogOpen, setUserDialogOpen] = useState(false)
  const [assignmentMode, setAssignmentMode] = useState<"org" | "role" | "individual">("org")
  const [selectedOrgs, setSelectedOrgs] = useState<Set<string>>(new Set())
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set())
  const [individualPrids, setIndividualPrids] = useState("")

  useEffect(() => {
    const savedDatasets = sessionStorage.getItem("dcm_selected_datasets")
    if (savedDatasets) {
      const parsedDatasets = JSON.parse(savedDatasets)
      setDatasets(parsedDatasets)
    }

    const savedActivities = sessionStorage.getItem("dcm_selected_activities")
    if (savedActivities) {
      const parsedActivities = JSON.parse(savedActivities)
      setActivities(parsedActivities)
    }

    const savedAoT = sessionStorage.getItem("dcm_agreement_of_terms")
    if (savedAoT) {
      const parsedAoT = JSON.parse(savedAoT)
      setAot(parsedAoT)
    } else if (savedDatasets && savedActivities) {
      const parsedDatasets = JSON.parse(savedDatasets)
      const parsedActivities = JSON.parse(savedActivities)
      const suggested = suggestAoT(parsedActivities, parsedDatasets)
      setAot(suggested)
    }
  }, [])

  useEffect(() => {
    if (aot && datasets.length > 0) {
      const detectedConflicts = detectAoTConflicts(aot, datasets)
      setConflicts(detectedConflicts)
    }
  }, [aot, datasets])

  const handleContinue = () => {
    if (aot) {
      sessionStorage.setItem("dcm_agreement_of_terms", JSON.stringify(aot))
      router.push("/collectoid/dcm/create/review")
    }
  }

  const handleBack = () => {
    router.push("/collectoid/dcm/create/activities")
  }

  const removeDataset = (datasetId: string) => {
    const updatedDatasets = datasets.filter(d => d.id !== datasetId)
    setDatasets(updatedDatasets)
    // Also update sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_selected_datasets", JSON.stringify(updatedDatasets))
    }
  }

  const removeAllConflictingDatasets = () => {
    const conflictingIds = new Set(conflicts.map(c => c.datasetId))
    const updatedDatasets = datasets.filter(d => !conflictingIds.has(d.id))
    setDatasets(updatedDatasets)
    // Also update sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_selected_datasets", JSON.stringify(updatedDatasets))
    }
    setRemoveAllDialogOpen(false)
  }

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

  // User management functions
  const toggleOrg = (orgId: string) => {
    const newSelected = new Set(selectedOrgs)
    if (newSelected.has(orgId)) {
      newSelected.delete(orgId)
    } else {
      newSelected.add(orgId)
    }
    setSelectedOrgs(newSelected)
  }

  const toggleRole = (roleId: string) => {
    const newSelected = new Set(selectedRoles)
    if (newSelected.has(roleId)) {
      newSelected.delete(roleId)
    } else {
      newSelected.add(roleId)
    }
    setSelectedRoles(newSelected)
  }

  const calculateTotalUsers = () => {
    if (assignmentMode === "org") {
      return Array.from(selectedOrgs)
        .map((id) => ORGANIZATIONS.find((o) => o.id === id)?.users || 0)
        .reduce((a, b) => a + b, 0)
    } else if (assignmentMode === "role") {
      return Array.from(selectedRoles)
        .map((id) => ROLES.find((r) => r.id === id)?.count || 0)
        .reduce((a, b) => a + b, 0)
    } else {
      return individualPrids.split(",").filter(p => p.trim()).length
    }
  }

  const handleSaveUsers = () => {
    const totalUsers = calculateTotalUsers()
    updateAoT({
      userScope: {
        ...aot?.userScope,
        totalUserCount: totalUsers
      }
    })
    setUserDialogOpen(false)
  }

  const datasetsRestrictML = datasets.filter(d => d.aotMetadata?.restrictML).length
  const datasetsRestrictPub = datasets.filter(d => d.aotMetadata?.restrictPublication).length
  const datasetsRestrictSoftDev = datasets.filter(d => d.aotMetadata?.restrictSoftwareDev).length

  const canContinue = !conflicts.length || acknowledgedConflicts

  if (!aot) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-neutral-600 font-light">Loading...</p>
      </div>
    )
  }

  const primaryUseOptions = [
    { key: 'understandDrugMechanism', label: 'Understand how drugs work in the body', icon: Zap },
    { key: 'understandDisease', label: 'Better understand disease and health problems', icon: BookOpen },
    { key: 'developDiagnosticTests', label: 'Develop diagnostic tests for disease', icon: FileText },
    { key: 'learnFromPastStudies', label: 'Learn from past studies to plan new studies', icon: Brain },
    { key: 'improveAnalysisMethods', label: 'Improve scientific analysis methods', icon: Code },
  ]

  return (
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="mb-12">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="rounded-full font-light mb-6 hover:bg-neutral-100"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Activities
        </Button>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 5 of 7</span>
          <span className="text-xs text-neutral-300">|</span>
          <span className="text-xs font-light text-neutral-600">Agreement of Terms</span>
        </div>

        <div className="text-center mb-8">

          {/* Large Hero Icon with Gradient Border */}
          <div className="relative inline-block mb-6">
            <div className={cn(
              "absolute -inset-1 rounded-3xl bg-gradient-to-r opacity-50 blur-lg",
              scheme.from,
              scheme.to
            )} />
            <div
              className={cn(
                "relative flex items-center justify-center size-20 rounded-3xl bg-gradient-to-br shadow-xl",
                scheme.from,
                scheme.to
              )}
            >
              <Shield className="size-10 text-white" />
            </div>
          </div>

          <h1 className="text-4xl font-extralight text-neutral-900 mb-4 tracking-tight">
            Agreement of Terms
          </h1>
          <p className="text-lg font-light text-neutral-600 max-w-2xl mx-auto">
            Define data use restrictions and publication rights for this collection
          </p>
        </div>
      </div>

      {/* AI Suggestion Panel - Enhanced */}
      {aot.aiSuggested && (
        <div className="relative mb-8">
          {/* Gradient border background */}
          <div className={cn(
            "absolute -inset-0.5 rounded-3xl bg-gradient-to-r opacity-20 blur-sm",
            scheme.from,
            scheme.to
          )} />

          <Card className={cn(
            "relative border-2 rounded-3xl overflow-hidden shadow-xl",
            scheme.from.replace("from-", "border-").replace("500", "200")
          )}>
            <CardContent className={cn(
              "p-8 bg-gradient-to-br",
              scheme.bg,
              scheme.bgHover
            )}>
              <div className="flex items-start gap-6">
                <div className={cn(
                  "flex size-16 items-center justify-center rounded-2xl bg-gradient-to-r text-white shadow-2xl shrink-0",
                  scheme.from,
                  scheme.to
                )}>
                  <Sparkles className="size-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-light text-neutral-900">AI-Suggested Terms</h3>
                    <Badge variant="outline" className={cn(
                      "font-light px-3 py-1 rounded-full border-2",
                      scheme.from.replace("from-", "border-"),
                      scheme.from.replace("from-", "text-")
                    )}>
                      <Sparkles className="size-3 mr-1" />
                      AI Powered
                    </Badge>
                  </div>
                  <p className="text-base text-neutral-600 font-light mb-6">
                    Based on your selected activities and datasets, we recommend the following terms:
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 p-3 bg-white/70 backdrop-blur-sm rounded-xl">
                      <CheckCircle2 className="size-5 text-green-600 shrink-0" strokeWidth={1.5} />
                      <span className="font-light text-neutral-700 text-sm">Primary use allowed (all)</span>
                    </div>

                    {aot.beyondPrimaryUse.aiResearch ? (
                      <div className="flex items-center gap-2 p-3 bg-white/70 backdrop-blur-sm rounded-xl">
                        <CheckCircle2 className="size-5 text-green-600 shrink-0" strokeWidth={1.5} />
                        <span className="font-light text-neutral-700 text-sm">AI/ML research ✓</span>
                      </div>
                    ) : datasetsRestrictML > 0 ? (
                      <div className="flex items-center gap-2 p-3 bg-amber-100/70 backdrop-blur-sm rounded-xl border border-amber-300">
                        <AlertCircle className="size-5 text-amber-600 shrink-0" strokeWidth={1.5} />
                        <span className="font-light text-amber-800 text-sm">AI/ML restricted ({datasetsRestrictML})</span>
                      </div>
                    ) : null}

                    {!aot.beyondPrimaryUse.softwareDevelopment && datasetsRestrictSoftDev > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-amber-100/70 backdrop-blur-sm rounded-xl border border-amber-300">
                        <AlertCircle className="size-5 text-amber-600 shrink-0" strokeWidth={1.5} />
                        <span className="font-light text-amber-800 text-sm">Software dev restricted ({datasetsRestrictSoftDev})</span>
                      </div>
                    )}

                    {aot.publication.externalPublication !== true && datasetsRestrictPub > 0 && (
                      <div className="flex items-center gap-2 p-3 bg-amber-100/70 backdrop-blur-sm rounded-xl border border-amber-300">
                        <AlertCircle className="size-5 text-amber-600 shrink-0" strokeWidth={1.5} />
                        <span className="font-light text-amber-800 text-sm">External pub restricted ({datasetsRestrictPub})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Primary Use - Left Column */}
        <Card className="border-neutral-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                scheme.bg
              )}>
                <Shield className={cn("size-5", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-light text-neutral-900">Primary Use</h2>
                <p className="text-xs text-neutral-500 font-light">IMI-Guided Protocol</p>
              </div>
            </div>

            <div className="space-y-3">
              {primaryUseOptions.map(({ key, label, icon: Icon }) => {
                const isChecked = aot.primaryUse[key as keyof typeof aot.primaryUse]
                return (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer group",
                      isChecked
                        ? cn("bg-gradient-to-r border-transparent shadow-md", scheme.bg, scheme.bgHover)
                        : "border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-md"
                    )}
                    onClick={() => togglePrimaryUse(key as keyof typeof aot.primaryUse)}
                  >
                    <Checkbox
                      id={key}
                      checked={isChecked}
                      onCheckedChange={() => togglePrimaryUse(key as keyof typeof aot.primaryUse)}
                    />
                    <Icon className={cn(
                      "size-4 shrink-0",
                      isChecked ? scheme.from.replace("from-", "text-") : "text-neutral-400"
                    )} strokeWidth={1.5} />
                    <span className="font-light text-neutral-700 cursor-pointer text-sm flex-1">
                      {label}
                    </span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Beyond Primary Use - Right Column */}
        <div className="space-y-6">
          {/* Beyond Primary Use Card */}
          <Card className="border-neutral-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                  scheme.bg
                )}>
                  <Zap className={cn("size-5", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="text-xl font-light text-neutral-900">Beyond Primary Use</h2>
                  <p className="text-xs text-neutral-500 font-light">Advanced capabilities</p>
                </div>
              </div>

              <div className="space-y-3">
                {/* AI Research */}
                <div
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer group",
                    aot.beyondPrimaryUse.aiResearch
                      ? cn("bg-gradient-to-r border-transparent shadow-md", scheme.bg, scheme.bgHover)
                      : "border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-md"
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
                    "size-5 shrink-0 mt-0.5",
                    aot.beyondPrimaryUse.aiResearch ? scheme.from.replace("from-", "text-") : "text-neutral-400"
                  )} strokeWidth={1.5} />
                  <div className="flex-1">
                    <span className="font-light text-neutral-700 cursor-pointer">
                      AI research / AI model training
                    </span>
                    {datasetsRestrictML > 0 && aot.beyondPrimaryUse.aiResearch && (
                      <p className="text-xs text-amber-600 mt-2 flex items-center gap-1 font-light">
                        <AlertCircle className="size-3" />
                        {datasetsRestrictML} {datasetsRestrictML === 1 ? 'dataset requires' : 'datasets require'} restriction
                      </p>
                    )}
                  </div>
                </div>

                {/* Software Development */}
                <div
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer group",
                    aot.beyondPrimaryUse.softwareDevelopment
                      ? cn("bg-gradient-to-r border-transparent shadow-md", scheme.bg, scheme.bgHover)
                      : "border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-md"
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
                    "size-5 shrink-0 mt-0.5",
                    aot.beyondPrimaryUse.softwareDevelopment ? scheme.from.replace("from-", "text-") : "text-neutral-400"
                  )} strokeWidth={1.5} />
                  <div className="flex-1">
                    <span className="font-light text-neutral-700 cursor-pointer">
                      Software development and testing
                    </span>
                    {datasetsRestrictSoftDev > 0 && aot.beyondPrimaryUse.softwareDevelopment && (
                      <p className="text-xs text-amber-600 mt-2 flex items-center gap-1 font-light">
                        <AlertCircle className="size-3" />
                        {datasetsRestrictSoftDev} {datasetsRestrictSoftDev === 1 ? 'dataset requires' : 'datasets require'} restriction
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Scope - With Dialog */}
          <Dialog open={userDialogOpen} onOpenChange={setUserDialogOpen}>
            <Card className="border-neutral-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                      scheme.bg
                    )}>
                      <Users className={cn("size-5", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h2 className="text-lg font-light text-neutral-900">User Scope</h2>
                      <p className="text-xs text-neutral-500 font-light">Assign target users</p>
                    </div>
                  </div>
                  <Badge className={cn("font-light", scheme.from.replace("from-", "bg-"), "text-white")}>
                    {calculateTotalUsers()} users
                  </Badge>
                </div>
                <DialogTrigger asChild>
                  <button className="w-full flex items-center justify-between p-3 bg-neutral-50 hover:bg-neutral-100 rounded-xl transition-colors group cursor-pointer">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-neutral-400" strokeWidth={1.5} />
                      <p className="text-sm font-light text-neutral-600">
                        {calculateTotalUsers() > 0 ? `${calculateTotalUsers()} users assigned` : "No users assigned yet"}
                      </p>
                    </div>
                    <div className={cn(
                      "flex items-center gap-1 text-xs font-light transition-colors",
                      scheme.from.replace("from-", "text-")
                    )}>
                      <Plus className="size-3" />
                      Manage Users
                    </div>
                  </button>
                </DialogTrigger>
              </CardContent>
            </Card>

            <DialogContent className="sm:max-w-[800px] p-0 gap-0">
              <DialogHeader className="p-6 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                    scheme.bg
                  )}>
                    <Users className={cn("size-5", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-light text-neutral-900">User Assignment</DialogTitle>
                    <DialogDescription className="text-sm font-light">
                      Select users who will have access to this collection
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="p-6">
                {/* Assignment Mode Tabs */}
                <div className="flex gap-2 mb-6">
                  <button
                    onClick={() => setAssignmentMode("org")}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl border-2 text-sm font-light transition-all",
                      assignmentMode === "org"
                        ? cn("border-current bg-gradient-to-r", scheme.bg, scheme.bgHover)
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    )}
                  >
                    <Building2 className="size-4 mx-auto mb-1" />
                    Organization
                  </button>
                  <button
                    onClick={() => setAssignmentMode("role")}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl border-2 text-sm font-light transition-all",
                      assignmentMode === "role"
                        ? cn("border-current bg-gradient-to-r", scheme.bg, scheme.bgHover)
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    )}
                  >
                    <UserCheck className="size-4 mx-auto mb-1" />
                    Role-based
                  </button>
                  <button
                    onClick={() => setAssignmentMode("individual")}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl border-2 text-sm font-light transition-all",
                      assignmentMode === "individual"
                        ? cn("border-current bg-gradient-to-r", scheme.bg, scheme.bgHover)
                        : "border-neutral-200 bg-white hover:border-neutral-300"
                    )}
                  >
                    <IdCard className="size-4 mx-auto mb-1" />
                    Individual
                  </button>
                </div>

                {/* Organization-based */}
                {assignmentMode === "org" && (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    <p className="text-sm font-light text-neutral-600 mb-3">
                      Select organizations from Workday:
                    </p>
                    {ORGANIZATIONS.map((org) => (
                      <button
                        key={org.id}
                        onClick={() => toggleOrg(org.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border-2 transition-all",
                          selectedOrgs.has(org.id)
                            ? cn("border-current bg-gradient-to-r", scheme.bg, scheme.bgHover)
                            : "border-neutral-200 bg-white hover:border-neutral-300"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Checkbox checked={selectedOrgs.has(org.id)} className="mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <h3 className="text-sm font-normal text-neutral-900 truncate">{org.name}</h3>
                              <Badge variant="outline" className="font-light text-xs shrink-0">
                                {org.users} users
                              </Badge>
                            </div>
                            <p className="text-xs font-light text-neutral-500 truncate">
                              {org.roles.join(", ")}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Role-based */}
                {assignmentMode === "role" && (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    <p className="text-sm font-light text-neutral-600 mb-3">
                      Select roles:
                    </p>
                    {ROLES.map((role) => (
                      <button
                        key={role.id}
                        onClick={() => toggleRole(role.id)}
                        className={cn(
                          "w-full text-left p-3 rounded-xl border-2 transition-all",
                          selectedRoles.has(role.id)
                            ? cn("border-current bg-gradient-to-r", scheme.bg, scheme.bgHover)
                            : "border-neutral-200 bg-white hover:border-neutral-300"
                        )}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <Checkbox checked={selectedRoles.has(role.id)} />
                            <span className="text-sm font-normal text-neutral-900">{role.name}</span>
                          </div>
                          <Badge variant="outline" className="font-light text-xs">
                            {role.count} users
                          </Badge>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Individual PRIDs */}
                {assignmentMode === "individual" && (
                  <div>
                    <p className="text-sm font-light text-neutral-600 mb-3">
                      Enter PRIDs (comma-separated):
                    </p>
                    <Textarea
                      value={individualPrids}
                      onChange={(e) => setIndividualPrids(e.target.value)}
                      placeholder="P123456, P789012, P345678"
                      className="border-neutral-200 rounded-xl font-light min-h-[150px]"
                    />
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className={cn("size-5", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
                  <span className="text-lg font-light text-neutral-900">{calculateTotalUsers()}</span>
                  <span className="text-sm font-light text-neutral-600">target users</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setUserDialogOpen(false)}
                    className="rounded-xl font-light"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveUsers}
                    className={cn(
                      "rounded-xl font-light bg-gradient-to-r text-white",
                      scheme.from,
                      scheme.to
                    )}
                  >
                    Save Users
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Publication & External Sharing - Full Width */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Publication */}
        <Card className="border-neutral-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                scheme.bg
              )}>
                <FileText className={cn("size-5", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-light text-neutral-900">Publication Rights</h2>
                <p className="text-xs text-neutral-500 font-light">Internal & external</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Internal Publication */}
              <div
                className={cn(
                  "flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                  aot.publication.internalCompanyRestricted
                    ? cn("bg-gradient-to-r border-transparent shadow-md", scheme.bg, scheme.bgHover)
                    : "border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-md"
                )}
                onClick={() => updateAoT({
                  publication: {
                    ...aot.publication,
                    internalCompanyRestricted: !aot.publication.internalCompanyRestricted
                  }
                })}
              >
                <Checkbox
                  id="internalPub"
                  checked={aot.publication.internalCompanyRestricted}
                  onCheckedChange={(checked) => updateAoT({
                    publication: {
                      ...aot.publication,
                      internalCompanyRestricted: checked as boolean
                    }
                  })}
                />
                <Lock className={cn(
                  "size-4",
                  aot.publication.internalCompanyRestricted ? scheme.from.replace("from-", "text-") : "text-neutral-400"
                )} strokeWidth={1.5} />
                <span className="font-light text-neutral-700 cursor-pointer">
                  Internal company-restricted findings
                </span>
              </div>

              <Separator />

              {/* External Publication */}
              <div className="space-y-3">
                <Label className="font-light text-neutral-700 text-sm">External publication process:</Label>
                <RadioGroup
                  value={aot.publication.externalPublication === true ? "allowed" : aot.publication.externalPublication === false ? "not_allowed" : "by_exception"}
                  onValueChange={(value) => {
                    let extPub: boolean | "by_exception" = false
                    if (value === "allowed") extPub = true
                    else if (value === "by_exception") extPub = "by_exception"
                    updateAoT({
                      publication: {
                        ...aot.publication,
                        externalPublication: extPub
                      }
                    })
                  }}
                  className="space-y-2"
                >
                  <label
                    htmlFor="pub-not-allowed"
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
                      aot.publication.externalPublication === false
                        ? cn("bg-gradient-to-r border-transparent shadow-md", scheme.bg, scheme.bgHover)
                        : "border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-md"
                    )}
                  >
                    <RadioGroupItem value="not_allowed" id="pub-not-allowed" />
                    <span className="font-light text-neutral-700 text-sm">
                      Not allowed
                    </span>
                  </label>
                  <label
                    htmlFor="pub-exception"
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
                      aot.publication.externalPublication === "by_exception"
                        ? cn("bg-gradient-to-r border-transparent shadow-md", scheme.bg, scheme.bgHover)
                        : "border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-md"
                    )}
                  >
                    <RadioGroupItem value="by_exception" id="pub-exception" />
                    <span className="font-light text-neutral-700 text-sm">
                      By exception (requires approval)
                    </span>
                  </label>
                  <label
                    htmlFor="pub-allowed"
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer",
                      aot.publication.externalPublication === true
                        ? cn("bg-gradient-to-r border-transparent shadow-md", scheme.bg, scheme.bgHover)
                        : "border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-md"
                    )}
                  >
                    <RadioGroupItem value="allowed" id="pub-allowed" className="mt-0.5" />
                    <div className="flex-1">
                      <span className="font-light text-neutral-700 text-sm">
                        Allowed with standard process
                      </span>
                      {datasetsRestrictPub > 0 && aot.publication.externalPublication === true && (
                        <p className="text-xs text-amber-600 mt-2 flex items-center gap-1 font-light">
                          <AlertCircle className="size-3" />
                          {datasetsRestrictPub} {datasetsRestrictPub === 1 ? 'dataset requires' : 'datasets require'} restriction
                        </p>
                      )}
                    </div>
                  </label>
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* External Sharing */}
        <Card className="border-neutral-200 rounded-3xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          <CardContent className="p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                scheme.bg
              )}>
                <Share2 className={cn("size-5", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-xl font-light text-neutral-900">External Sharing</h2>
                <p className="text-xs text-neutral-500 font-light">Data outside organization</p>
              </div>
            </div>

            <div
              className={cn(
                "flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer mb-4",
                aot.externalSharing.allowed
                  ? cn("bg-gradient-to-r border-transparent shadow-md", scheme.bg, scheme.bgHover)
                  : "border-neutral-200 hover:border-neutral-300 bg-white hover:shadow-md"
              )}
              onClick={() => updateAoT({
                externalSharing: {
                  ...aot.externalSharing,
                  allowed: !aot.externalSharing.allowed
                }
              })}
            >
              <Checkbox
                id="externalSharing"
                checked={aot.externalSharing.allowed}
                onCheckedChange={(checked) => updateAoT({
                  externalSharing: {
                    ...aot.externalSharing,
                    allowed: checked as boolean
                  }
                })}
              />
              <Globe className={cn(
                "size-4",
                aot.externalSharing.allowed ? scheme.from.replace("from-", "text-") : "text-neutral-400"
              )} strokeWidth={1.5} />
              <span className="font-light text-neutral-700 cursor-pointer">
                External sharing allowed
              </span>
            </div>

            {aot.externalSharing.allowed && (
              <div className="relative group">
                <div className={cn(
                  "absolute -inset-0.5 rounded-xl bg-gradient-to-r opacity-0 group-focus-within:opacity-10 blur-sm transition-opacity",
                  scheme.from,
                  scheme.to
                )} />
                <Textarea
                  id="sharingProcess"
                  value={aot.externalSharing.process || ''}
                  onChange={(e) => updateAoT({
                    externalSharing: {
                      ...aot.externalSharing,
                      process: e.target.value
                    }
                  })}
                  className="relative font-light rounded-xl border-2 border-neutral-200 min-h-[120px] resize-none hover:border-neutral-300 focus-visible:border-transparent transition-colors"
                  placeholder="Describe the process for external sharing..."
                />
              </div>
            )}

            {!aot.externalSharing.allowed && (
              <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-200">
                <p className="text-sm font-light text-neutral-500 text-center">
                  External sharing is disabled for this collection
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Conflicts Panel */}
      {conflicts.length > 0 && (
        <div className="relative mb-8">
          {/* Warning glow */}
          <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-amber-400 to-orange-400 opacity-20 blur-md" />

          <Card className="relative border-2 border-amber-300 rounded-3xl overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 shadow-xl">
            <CardContent className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 shadow-lg shrink-0">
                    <AlertCircle className="size-6 text-white" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-normal text-xl text-amber-900 mb-2">Dataset Conflicts Detected</h3>
                    <p className="text-sm text-amber-700 font-light">
                      {conflicts.length} {conflicts.length === 1 ? 'dataset has' : 'datasets have'} restrictions that conflict with your defined terms
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConflictsExpanded(!conflictsExpanded)}
                    className="rounded-full font-light hover:bg-amber-100"
                  >
                    {conflictsExpanded ? (
                      <>
                        <ChevronUp className="size-4 mr-1" strokeWidth={1.5} />
                        Hide
                      </>
                    ) : (
                      <>
                        <ChevronDown className="size-4 mr-1" strokeWidth={1.5} />
                        View Details
                      </>
                    )}
                  </Button>
                  {conflictsExpanded && (
                    <div className="flex flex-col items-end gap-1.5">
                      <button
                        onClick={() => router.push("/collectoid/dcm/create/filters")}
                        className="inline-flex items-center gap-1.5 text-xs font-light text-amber-700 hover:text-amber-900 hover:underline transition-colors cursor-pointer"
                      >
                        <Database className="size-3" />
                        Modify selection
                      </button>
                      <button
                        onClick={() => setRemoveAllDialogOpen(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-light text-red-600 hover:text-red-800 hover:underline transition-colors cursor-pointer"
                      >
                        <Trash2 className="size-3" />
                        Remove all conflicting
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {conflictsExpanded && (
                <div className="space-y-3 mb-6">
                  {conflicts.map((conflict, idx) => (
                    <div key={idx} className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl border border-amber-200 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-normal text-sm text-neutral-900 mb-1">
                            {conflict.datasetCode}: {conflict.datasetName}
                          </p>
                          <p className="text-sm text-neutral-600 font-light mb-2">
                            {conflict.conflictDescription}
                          </p>
                          <p className="text-xs text-amber-700 font-light">
                            Required: {conflict.requiredAction}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge variant="outline" className="font-light border-amber-400 text-amber-900 bg-amber-100">
                            {conflict.severity}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeDataset(conflict.datasetId)}
                            className="h-7 w-7 p-0 rounded-full hover:bg-red-100 hover:text-red-600 transition-colors"
                            title="Remove dataset from collection"
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-start gap-3 p-5 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-amber-300">
                <Checkbox
                  id="acknowledgeConflicts"
                  checked={acknowledgedConflicts}
                  onCheckedChange={(checked) => setAcknowledgedConflicts(checked as boolean)}
                  className="mt-0.5"
                />
                <Label htmlFor="acknowledgeConflicts" className="font-light text-neutral-700 cursor-pointer">
                  I acknowledge these conflicts and take responsibility for proceeding with this Agreement of Terms
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Remove All Conflicting Datasets Confirmation Dialog */}
      <Dialog open={removeAllDialogOpen} onOpenChange={setRemoveAllDialogOpen}>
        <DialogContent className="sm:max-w-[480px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-normal flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-red-100">
                <Trash2 className="size-5 text-red-600" />
              </div>
              Remove Conflicting Datasets
            </DialogTitle>
            <DialogDescription className="text-sm font-light text-neutral-600 pt-2">
              Are you sure you want to remove all {conflicts.length} conflicting dataset{conflicts.length !== 1 ? 's' : ''} from your collection?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm font-light text-neutral-700 mb-3">The following datasets will be removed:</p>
            <div className="max-h-[200px] overflow-y-auto space-y-2">
              {conflicts.map((conflict, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 bg-neutral-50 rounded-lg">
                  <Database className="size-4 text-neutral-400" />
                  <span className="text-sm font-light text-neutral-700">{conflict.datasetCode}</span>
                  <span className="text-xs text-neutral-500">- {conflict.datasetName}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setRemoveAllDialogOpen(false)}
              className="rounded-xl font-light"
            >
              Cancel
            </Button>
            <Button
              onClick={removeAllConflictingDatasets}
              className="rounded-xl font-light bg-red-600 hover:bg-red-700 text-white"
            >
              <Trash2 className="size-4 mr-2" />
              Remove {conflicts.length} Dataset{conflicts.length !== 1 ? 's' : ''}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 5 of 7</span>
          <span className="text-xs text-neutral-300">|</span>
          <span className="text-xs font-light text-neutral-600">Agreement of Terms</span>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handleBack}
            className="flex-1 h-12 rounded-2xl font-light border-neutral-200"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Activities
          </Button>

          <Button
            onClick={handleContinue}
            disabled={!canContinue}
            className={cn(
              "flex-1 h-12 rounded-2xl font-light shadow-lg hover:shadow-xl transition-all",
              canContinue
                ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            Save & Continue
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

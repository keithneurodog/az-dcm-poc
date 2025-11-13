"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useColorScheme } from "@/components/ux12-color-context"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  ArrowLeft,
  FileText,
  Users,
  Building2,
  UserCheck,
  IdCard,
  Info,
} from "lucide-react"
import { Dataset } from "@/lib/dcm-mock-data"

const ORGANIZATIONS = [
  { id: "onc-biometrics", name: "Oncology Biometrics", users: 45, roles: ["Data Scientists (28)", "Biostatisticians (17)"] },
  { id: "onc-data-sci", name: "Oncology Data Science", users: 60, roles: ["Data Scientists (42)", "Engineers (18)"] },
  { id: "trans-med-onc", name: "Translational Medicine - Oncology", users: 15, roles: ["Scientists (12)", "Data Analysts (3)"] },
]

const ROLES = [
  { id: "data-scientist", name: "Data Scientist", count: 82 },
  { id: "biostatistician", name: "Biostatistician", count: 20 },
  { id: "engineer", name: "Data Engineer", count: 18 },
  { id: "analyst", name: "Data Analyst", count: 3 },
]

export default function DCMCollectionDetailsPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([])
  const [selectedActivities, setSelectedActivities] = useState<any[]>([])

  // Form state
  const [collectionName, setCollectionName] = useState("")
  const [description, setDescription] = useState("")
  const [targetCommunity, setTargetCommunity] = useState("")

  // User assignment
  const [assignmentMode, setAssignmentMode] = useState<"org" | "role" | "individual">("org")
  const [selectedOrgs, setSelectedOrgs] = useState<Set<string>>(new Set())
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set())
  const [individualPrids, setIndividualPrids] = useState("")

  useEffect(() => {
    // Get data from sessionStorage
    if (typeof window !== "undefined") {
      const storedDatasets = sessionStorage.getItem("dcm_selected_datasets")
      const storedActivities = sessionStorage.getItem("dcm_selected_activities")

      if (!storedDatasets) {
        router.push("/poc/1/dcm/create")
        return
      }

      setSelectedDatasets(JSON.parse(storedDatasets))
      if (storedActivities) {
        setSelectedActivities(JSON.parse(storedActivities))
      }

      // Pre-fill example data
      setCollectionName("Oncology ctDNA Outcomes Collection")
      setDescription(
        "Curated collection of Phase III lung cancer studies with ctDNA biomarker monitoring and immunotherapy treatment arms. Suitable for outcomes research, biomarker analysis, and multimodal data fusion."
      )
      setTargetCommunity(
        "Oncology Data Scientists and Biostatisticians studying immunotherapy response and ctDNA dynamics"
      )

      // Pre-select organizations
      setSelectedOrgs(new Set(["onc-biometrics", "onc-data-sci", "trans-med-onc"]))
      setSelectedRoles(new Set(["data-scientist", "biostatistician"]))
    }
  }, [router])

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

  const handleContinue = () => {
    // Store collection details
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_collection_name", collectionName)
      sessionStorage.setItem("dcm_collection_description", description)
      sessionStorage.setItem("dcm_target_community", targetCommunity)
      sessionStorage.setItem("dcm_total_users", calculateTotalUsers().toString())
    }
    router.push("/poc/1/dcm/create/review")
  }

  if (selectedDatasets.length === 0) {
    return <div>Loading...</div>
  }

  const totalUsers = calculateTotalUsers()

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/poc/1/dcm/create/activities")}
          className="rounded-full font-light mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Activities
        </Button>

        <div className="text-center mb-6">
          <div
            className={cn(
              "inline-flex items-center justify-center size-16 rounded-2xl mb-4 bg-gradient-to-br",
              scheme.bg,
              scheme.bgHover
            )}
          >
            <FileText className={cn("size-8", scheme.from.replace("from-", "text-"))} />
          </div>
          <h1 className="text-3xl font-extralight text-neutral-900 mb-3 tracking-tight">
            Collection Details & User Assignment
          </h1>
          <p className="text-base font-light text-neutral-600">
            Define your collection metadata and assign target users
          </p>
        </div>
      </div>

      {/* Collection Information */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden mb-6">
        <CardContent className="p-6">
          <h2 className="text-lg font-normal text-neutral-900 mb-4">Collection Information</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-light text-neutral-700 mb-2">
                Collection Name *
              </label>
              <Input
                value={collectionName}
                onChange={(e) => setCollectionName(e.target.value)}
                placeholder="E.g., Oncology ctDNA Outcomes Collection"
                className="border-neutral-200 rounded-xl font-light"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-neutral-700 mb-2">
                Description *
              </label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the purpose and scope of this collection..."
                className="border-neutral-200 rounded-xl font-light min-h-[100px]"
              />
            </div>

            <div>
              <label className="block text-sm font-light text-neutral-700 mb-2">
                Target User Community
              </label>
              <Input
                value={targetCommunity}
                onChange={(e) => setTargetCommunity(e.target.value)}
                placeholder="E.g., Oncology researchers studying biomarker outcomes"
                className="border-neutral-200 rounded-xl font-light"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* User Assignment */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-normal text-neutral-900">User Assignment</h2>
            <Badge
              className={cn("font-light", scheme.from.replace("from-", "bg-"), "text-white")}
            >
              {totalUsers} target users
            </Badge>
          </div>

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
              Organization-based
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
              Individual PRIDs
            </button>
          </div>

          {/* Organization-based */}
          {assignmentMode === "org" && (
            <div className="space-y-3">
              <p className="text-sm font-light text-neutral-600 mb-3">
                Select organizations from Workday:
              </p>
              {ORGANIZATIONS.map((org) => (
                <button
                  key={org.id}
                  onClick={() => toggleOrg(org.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all",
                    selectedOrgs.has(org.id)
                      ? cn("border-current bg-gradient-to-r", scheme.bg, scheme.bgHover)
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox checked={selectedOrgs.has(org.id)} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-sm font-normal text-neutral-900">{org.name}</h3>
                        <Badge variant="outline" className="font-light text-xs">
                          {org.users} users
                        </Badge>
                      </div>
                      <p className="text-xs font-light text-neutral-600">
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
            <div className="space-y-3">
              <p className="text-sm font-light text-neutral-600 mb-3">
                Select roles:
              </p>
              {ROLES.map((role) => (
                <button
                  key={role.id}
                  onClick={() => toggleRole(role.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all",
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
                className="border-neutral-200 rounded-xl font-light min-h-[100px]"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Notice */}
      <div className="rounded-2xl p-4 bg-blue-50 border border-blue-100 mb-6">
        <div className="flex gap-3">
          <Info className="size-5 shrink-0 text-blue-600 mt-0.5" />
          <div className="text-sm font-light text-blue-900">
            <p className="mb-1">
              <span className="font-normal">Next step:</span> Access provisioning review
            </p>
            <p className="text-blue-700">
              You'll see a detailed breakdown of access provisioning (20/30/40/10) and can execute the collection creation with Collectoid automation.
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          variant="outline"
          onClick={() => router.push("/poc/1/dcm/create/activities")}
          className="flex-1 h-12 rounded-2xl font-light border-neutral-200"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Activities
        </Button>
        <Button
          onClick={handleContinue}
          disabled={!collectionName || !description || totalUsers === 0}
          className={cn(
            "flex-1 h-12 rounded-2xl font-light shadow-lg hover:shadow-xl transition-all",
            collectionName && description && totalUsers > 0
              ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
              : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
          )}
        >
          Review Access Provisioning
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}

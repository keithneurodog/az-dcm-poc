"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { useWorkspace } from "../layout"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Users,
  UserPlus,
  Building2,
  Shield,
  Search,
  CheckCircle2,
  Info,
} from "lucide-react"

// Mock data for roles and approvers
const AVAILABLE_ROLES = [
  {
    id: "dcl",
    name: "Data Consumer Lead",
    description: "Primary point of contact for data consumption activities",
    required: true,
    icon: Users,
  },
  {
    id: "ddo",
    name: "Data Domain Owner",
    description: "Approves access to specific data domains",
    required: false,
    icon: Shield,
  },
  {
    id: "vt-lead",
    name: "Virtual Team Lead",
    description: "Leads the virtual team using this collection",
    required: false,
    icon: Building2,
  },
]

const MOCK_USERS = [
  { id: "P123456", name: "Sarah Chen", role: "Principal Data Scientist", org: "Oncology Biometrics" },
  { id: "P234567", name: "James Wilson", role: "Senior Biostatistician", org: "Oncology Data Science" },
  { id: "P345678", name: "Maria Garcia", role: "Data Engineering Lead", org: "Translational Medicine" },
  { id: "P456789", name: "David Kim", role: "Clinical Data Manager", org: "Clinical Operations" },
  { id: "P567890", name: "Emily Brown", role: "Data Scientist", org: "Oncology Biometrics" },
]

export default function WorkspaceRolesPage() {
  const router = useRouter()
  const { scheme } = useColorScheme()
  const workspace = useWorkspace()

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<Record<string, string | null>>({
    dcl: null,
    ddo: null,
    "vt-lead": null,
  })
  const [expandedRole, setExpandedRole] = useState<string | null>("dcl")

  const filteredUsers = MOCK_USERS.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.org.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const assignUser = (roleId: string, userId: string) => {
    setSelectedRoles(prev => ({
      ...prev,
      [roleId]: prev[roleId] === userId ? null : userId
    }))
  }

  const getAssignedUser = (userId: string | null) => {
    if (!userId) return null
    return MOCK_USERS.find(u => u.id === userId)
  }

  const handleContinue = () => {
    // Save assigned roles
    const assignedRoleIds = Object.entries(selectedRoles)
      .filter(([, userId]) => userId !== null)
      .map(([roleId]) => roleId)

    workspace.setAssignedRoles(assignedRoleIds)
    router.push("/collectoid-v2/dcm/create/workspace")
  }

  const requiredRolesAssigned = AVAILABLE_ROLES
    .filter(r => r.required)
    .every(r => selectedRoles[r.id] !== null)

  const totalAssigned = Object.values(selectedRoles).filter(v => v !== null).length

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
          <Users className={cn("size-8", scheme.from.replace("from-", "text-"))} />
        </div>
        <h1 className="text-2xl font-extralight text-neutral-900 mb-2 tracking-tight">
          Roles & Approvers
        </h1>
        <p className="text-sm font-light text-neutral-600 max-w-xl mx-auto">
          Assign key roles for this collection. These users will be responsible for governance and approvals.
        </p>
      </div>

      {/* Status Banner */}
      <div className={cn(
        "rounded-xl p-4 border",
        totalAssigned > 0
          ? cn(scheme.bg, scheme.from.replace("from-", "border-").replace("500", "200"))
          : "bg-neutral-50 border-neutral-200"
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex size-9 items-center justify-center rounded-lg",
              totalAssigned > 0
                ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                : "bg-neutral-200"
            )}>
              <UserPlus className="size-4" />
            </div>
            <div>
              <p className="text-sm font-normal text-neutral-900">
                {totalAssigned === 0 ? "No roles assigned yet" : `${totalAssigned} role${totalAssigned !== 1 ? 's' : ''} assigned`}
              </p>
              <p className="text-xs font-light text-neutral-600">
                {requiredRolesAssigned ? "All required roles filled" : "Required: Data Consumer Lead"}
              </p>
            </div>
          </div>
          {requiredRolesAssigned && (
            <Badge className="bg-green-100 text-green-800 font-light">
              <CheckCircle2 className="size-3 mr-1" />
              Ready
            </Badge>
          )}
        </div>
      </div>

      {/* Roles List */}
      <div className="space-y-3">
        {AVAILABLE_ROLES.map(role => {
          const Icon = role.icon
          const assignedUser = getAssignedUser(selectedRoles[role.id])
          const isExpanded = expandedRole === role.id

          return (
            <Card
              key={role.id}
              className={cn(
                "border rounded-2xl overflow-hidden transition-all",
                assignedUser
                  ? scheme.from.replace("from-", "border-").replace("500", "200")
                  : "border-neutral-200"
              )}
            >
              <CardContent className="p-0">
                {/* Role Header */}
                <button
                  onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                  className={cn(
                    "w-full p-4 flex items-center justify-between text-left transition-colors",
                    assignedUser ? cn("bg-gradient-to-r", scheme.bg, scheme.bgHover) : "bg-white hover:bg-neutral-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "flex size-10 items-center justify-center rounded-xl",
                      assignedUser
                        ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                        : "bg-neutral-100"
                    )}>
                      <Icon className={cn("size-5", !assignedUser && "text-neutral-500")} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-normal text-neutral-900">{role.name}</h3>
                        {role.required && (
                          <Badge variant="outline" className="text-xs font-light px-1.5 py-0 text-red-600 border-red-200">
                            Required
                          </Badge>
                        )}
                      </div>
                      {assignedUser ? (
                        <p className="text-xs font-light text-neutral-600">
                          {assignedUser.name} ({assignedUser.id})
                        </p>
                      ) : (
                        <p className="text-xs font-light text-neutral-500">
                          {role.description}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {assignedUser && (
                      <CheckCircle2 className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                    )}
                    <div className={cn(
                      "size-6 rounded-full flex items-center justify-center transition-transform",
                      isExpanded ? "rotate-180" : ""
                    )}>
                      <svg className="size-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Expanded User Selection */}
                {isExpanded && (
                  <div className="p-4 border-t border-neutral-100 bg-neutral-50/50">
                    {/* Search */}
                    <div className="relative mb-3">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                      <Input
                        placeholder="Search by name, PRID, or org..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 h-9 rounded-xl border-neutral-200 font-light text-sm"
                      />
                    </div>

                    {/* User List */}
                    <div className="space-y-1.5 max-h-[200px] overflow-y-auto">
                      {filteredUsers.map(user => (
                        <div
                          key={user.id}
                          onClick={() => assignUser(role.id, user.id)}
                          className={cn(
                            "flex items-center gap-3 p-2.5 rounded-xl border cursor-pointer transition-all",
                            selectedRoles[role.id] === user.id
                              ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                              : "border-neutral-200 bg-white hover:border-neutral-300"
                          )}
                        >
                          <Checkbox
                            checked={selectedRoles[role.id] === user.id}
                            className="pointer-events-none"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-normal text-neutral-900 truncate">{user.name}</p>
                              <Badge variant="outline" className="text-xs font-light px-1.5 py-0 shrink-0">
                                {user.id}
                              </Badge>
                            </div>
                            <p className="text-xs font-light text-neutral-500 truncate">
                              {user.role} • {user.org}
                            </p>
                          </div>
                        </div>
                      ))}
                      {filteredUsers.length === 0 && (
                        <p className="text-sm font-light text-neutral-500 text-center py-4">
                          No users found matching &ldquo;{searchQuery}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Info Note */}
      <div className="rounded-xl p-3 bg-blue-50 border border-blue-100">
        <div className="flex gap-3">
          <Info className="size-4 shrink-0 text-blue-600 mt-0.5" />
          <div className="text-xs font-light text-blue-900">
            <span className="font-normal">Note:</span> Role assignments are optional for the Concept stage.
            You can complete this section later before promoting to Draft.
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <Button
        onClick={handleContinue}
        className={cn(
          "w-full h-11 rounded-xl font-light shadow-md hover:shadow-lg transition-all bg-gradient-to-r text-white",
          scheme.from,
          scheme.to
        )}
      >
        {totalAssigned > 0 ? "Save & Continue" : "Skip for Now"}
        <ArrowRight className="size-4 ml-2" />
      </Button>
    </div>
  )
}

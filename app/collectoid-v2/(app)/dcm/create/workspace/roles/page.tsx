"use client"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { useWorkspace } from "../layout"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  Info,
  Shield,
  Building2,
  FlaskConical,
  Server,
  UsersRound,
  X,
  UserCheck,
  IdCard,
  Trash2,
} from "lucide-react"

// ── Mock data: Immuta role groups ──────────────────────────────────────────────

interface ImmutaRoleGroup {
  id: string
  name: string
  description: string
  memberCount: number
  source: "Immuta" | "ROAM" | "Workday"
  category: "Therapeutic Area" | "Function" | "Study Team" | "Platform"
  tags: string[]
}

const IMMUTA_ROLE_GROUPS: ImmutaRoleGroup[] = [
  // Therapeutic Area
  { id: "rg-onc-bio", name: "Oncology Biometrics", description: "Biometrics scientists supporting oncology clinical programs", memberCount: 45, source: "ROAM", category: "Therapeutic Area", tags: ["oncology", "biometrics"] },
  { id: "rg-onc-ds", name: "Oncology Data Science", description: "Data scientists and ML engineers in oncology", memberCount: 62, source: "ROAM", category: "Therapeutic Area", tags: ["oncology", "data-science"] },
  { id: "rg-cvrm", name: "CVRM Analytics", description: "Cardiovascular, renal and metabolic analytics team", memberCount: 28, source: "ROAM", category: "Therapeutic Area", tags: ["cvrm", "cardiovascular"] },
  { id: "rg-neuro", name: "Neuroscience Research", description: "Neuroscience clinical and translational research data users", memberCount: 19, source: "ROAM", category: "Therapeutic Area", tags: ["neuroscience", "cns"] },
  { id: "rg-immuno", name: "Immunology Data Team", description: "Immunology and inflammation data access group", memberCount: 23, source: "ROAM", category: "Therapeutic Area", tags: ["immunology", "inflammation"] },
  { id: "rg-transmed", name: "Translational Medicine", description: "Cross-TA translational medicine scientists", memberCount: 34, source: "ROAM", category: "Therapeutic Area", tags: ["translational", "cross-ta"] },
  { id: "rg-rare", name: "Rare Disease Analytics", description: "Rare disease and orphan drug data analytics", memberCount: 12, source: "ROAM", category: "Therapeutic Area", tags: ["rare-disease"] },
  { id: "rg-resp", name: "Respiratory Data Science", description: "Respiratory and pulmonary research data users", memberCount: 17, source: "ROAM", category: "Therapeutic Area", tags: ["respiratory", "pulmonary"] },

  // Function
  { id: "rg-biostat", name: "Biostatisticians", description: "Global biostatistics function - all therapeutic areas", memberCount: 82, source: "Workday", category: "Function", tags: ["biostatistics", "statistics"] },
  { id: "rg-data-eng", name: "Data Engineers", description: "Data engineering and pipeline development team", memberCount: 41, source: "Workday", category: "Function", tags: ["engineering", "pipelines"] },
  { id: "rg-cdm", name: "Clinical Data Managers", description: "Clinical data management across all studies", memberCount: 56, source: "Workday", category: "Function", tags: ["clinical", "data-management"] },
  { id: "rg-ds-global", name: "Data Scientists - Global", description: "Enterprise data science community of practice", memberCount: 120, source: "Workday", category: "Function", tags: ["data-science", "global"] },
  { id: "rg-med-writers", name: "Medical Writers", description: "Medical writing and regulatory documentation", memberCount: 29, source: "Workday", category: "Function", tags: ["medical-writing", "regulatory"] },
  { id: "rg-study-coord", name: "Study Coordinators", description: "Clinical study coordinators and site liaisons", memberCount: 38, source: "Workday", category: "Function", tags: ["study-coordination", "clinical"] },

  // Study Team
  { id: "rg-aurora", name: "AURORA Study Team", description: "Phase III AURORA breast cancer trial team", memberCount: 18, source: "Immuta", category: "Study Team", tags: ["aurora", "breast-cancer", "phase-iii"] },
  { id: "rg-neptune", name: "NEPTUNE Trial Team", description: "Phase II NEPTUNE renal study team", memberCount: 14, source: "Immuta", category: "Study Team", tags: ["neptune", "renal", "phase-ii"] },
  { id: "rg-galaxy", name: "GALAXY-301 Team", description: "Phase III GALAXY lung cancer combination therapy", memberCount: 22, source: "Immuta", category: "Study Team", tags: ["galaxy", "lung-cancer", "phase-iii"] },
  { id: "rg-zenith", name: "ZENITH Study Team", description: "Phase II ZENITH immunotherapy biomarker study", memberCount: 11, source: "Immuta", category: "Study Team", tags: ["zenith", "immunotherapy", "biomarkers"] },
  { id: "rg-meridian", name: "MERIDIAN Study Team", description: "Phase III MERIDIAN cardiovascular outcomes trial", memberCount: 16, source: "Immuta", category: "Study Team", tags: ["meridian", "cardiovascular", "phase-iii"] },

  // Platform
  { id: "rg-starburst", name: "Starburst Power Users", description: "Advanced Starburst query and analytics users", memberCount: 95, source: "Immuta", category: "Platform", tags: ["starburst", "analytics"] },
  { id: "rg-immuta-admin", name: "Immuta Admins", description: "Immuta platform administrators and policy managers", memberCount: 8, source: "Immuta", category: "Platform", tags: ["immuta", "admin"] },
  { id: "rg-datalake", name: "Data Lake Viewers", description: "Read-only access to enterprise data lake catalog", memberCount: 210, source: "Immuta", category: "Platform", tags: ["data-lake", "read-only"] },
]

const INDIVIDUAL_USERS = [
  { id: "P123456", name: "Sarah Chen", role: "Principal Data Scientist", org: "Oncology Biometrics" },
  { id: "P234567", name: "James Wilson", role: "Senior Biostatistician", org: "Oncology Data Science" },
  { id: "P345678", name: "Maria Garcia", role: "Data Engineering Lead", org: "Translational Medicine" },
  { id: "P456789", name: "David Kim", role: "Clinical Data Manager", org: "Clinical Operations" },
  { id: "P567890", name: "Emily Brown", role: "Data Scientist", org: "Oncology Biometrics" },
  { id: "P678901", name: "Alex Thompson", role: "Biostatistician", org: "CVRM Analytics" },
  { id: "P789012", name: "Priya Patel", role: "ML Engineer", org: "Data Science - Global" },
  { id: "P890123", name: "Robert Zhang", role: "Study Coordinator", org: "Neuroscience Research" },
]

// ── Categories ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "all", label: "All", icon: Users },
  { id: "Therapeutic Area", label: "Therapeutic Area", icon: FlaskConical },
  { id: "Function", label: "Function", icon: Building2 },
  { id: "Study Team", label: "Study Team", icon: UsersRound },
  { id: "Platform", label: "Platform", icon: Server },
] as const

type Tab = "groups" | "individuals" | "summary"

// ── Component ─────────────────────────────────────────────────────────────────

export default function WorkspaceAccessPage() {
  const router = useRouter()
  const { scheme } = useColorScheme()
  const workspace = useWorkspace()

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>("groups")

  // Role groups state
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set())
  const [groupSearch, setGroupSearch] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  // Individual users state
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set())
  const [userSearch, setUserSearch] = useState("")
  const [manualPrids, setManualPrids] = useState("")

  // Filtered role groups
  const filteredGroups = useMemo(() => {
    let groups = IMMUTA_ROLE_GROUPS
    if (activeCategory !== "all") {
      groups = groups.filter(g => g.category === activeCategory)
    }
    if (groupSearch.trim()) {
      const q = groupSearch.toLowerCase()
      groups = groups.filter(
        g =>
          g.name.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.tags.some(t => t.includes(q))
      )
    }
    return groups
  }, [activeCategory, groupSearch])

  // Filtered individual users
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return INDIVIDUAL_USERS
    const q = userSearch.toLowerCase()
    return INDIVIDUAL_USERS.filter(
      u =>
        u.name.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q) ||
        u.org.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
    )
  }, [userSearch])

  // Computed totals
  const totalGroupMembers = useMemo(
    () =>
      Array.from(selectedGroups)
        .map(id => IMMUTA_ROLE_GROUPS.find(g => g.id === id)?.memberCount ?? 0)
        .reduce((a, b) => a + b, 0),
    [selectedGroups]
  )

  const manualPridCount = manualPrids
    .split(",")
    .filter(p => p.trim()).length

  const totalIndividuals = selectedUsers.size + manualPridCount
  const totalEstimated = totalGroupMembers + totalIndividuals
  const totalSelections = selectedGroups.size + totalIndividuals

  // Toggle helpers
  const toggleGroup = (id: string) => {
    setSelectedGroups(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleUser = (id: string) => {
    setSelectedUsers(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const removeUser = (id: string) => {
    setSelectedUsers(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const clearAll = () => {
    setSelectedGroups(new Set())
    setSelectedUsers(new Set())
    setManualPrids("")
  }

  // Save & continue
  const handleContinue = () => {
    const allIds = [
      ...Array.from(selectedGroups),
      ...Array.from(selectedUsers),
      ...manualPrids.split(",").filter(p => p.trim()).map(p => p.trim()),
    ]
    workspace.setAssignedRoles(allIds)
    router.push("/collectoid-v2/dcm/create/workspace")
  }

  // Source badge color
  const getSourceColor = (source: string) => {
    switch (source) {
      case "ROAM": return "bg-violet-100 text-violet-800"
      case "Immuta": return "bg-sky-100 text-sky-800"
      case "Workday": return "bg-amber-100 text-amber-800"
      default: return "bg-neutral-100 text-neutral-700"
    }
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
          Access & Users
        </h1>
        <p className="text-sm font-light text-neutral-600 max-w-xl mx-auto">
          Define who can access this collection&apos;s data. Select from existing Immuta role groups or add individual users.
        </p>
      </div>

      {/* Status Banner */}
      <div
        className={cn(
          "rounded-xl p-4 border",
          totalSelections > 0
            ? cn(scheme.bg, scheme.from.replace("from-", "border-").replace("500", "200"))
            : "bg-neutral-50 border-neutral-200"
        )}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-9 items-center justify-center rounded-lg",
                totalSelections > 0
                  ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                  : "bg-neutral-200"
              )}
            >
              <UserPlus className="size-4" />
            </div>
            <div>
              <p className="text-sm font-normal text-neutral-900">
                {totalSelections === 0
                  ? "No access groups selected"
                  : `${selectedGroups.size} group${selectedGroups.size !== 1 ? "s" : ""}${totalIndividuals > 0 ? `, ${totalIndividuals} individual${totalIndividuals !== 1 ? "s" : ""}` : ""}`}
              </p>
              <p className="text-xs font-light text-neutral-600">
                {totalEstimated > 0
                  ? `~${totalEstimated.toLocaleString()} estimated users`
                  : "Select role groups or add individual users"}
              </p>
            </div>
          </div>
          {totalSelections > 0 && (
            <Badge className="bg-green-100 text-green-800 font-light">
              <CheckCircle2 className="size-3 mr-1" />
              {totalEstimated.toLocaleString()} users
            </Badge>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {([
          { id: "groups" as Tab, label: "Role Groups", icon: UsersRound, count: selectedGroups.size },
          { id: "individuals" as Tab, label: "Individual Users", icon: UserCheck, count: totalIndividuals },
          { id: "summary" as Tab, label: "Summary", icon: CheckCircle2, count: null },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex-1 py-3 px-4 rounded-xl border-2 text-sm font-light transition-all text-center",
              activeTab === tab.id
                ? cn(
                    scheme.from.replace("from-", "border-").replace("500", "300"),
                    "bg-gradient-to-r",
                    scheme.bg,
                    scheme.bgHover
                  )
                : "border-neutral-200 bg-white hover:border-neutral-300"
            )}
          >
            <tab.icon className="size-4 mx-auto mb-1" />
            <span className="block">{tab.label}</span>
            {tab.count !== null && tab.count > 0 && (
              <Badge
                variant="outline"
                className={cn(
                  "mt-1 text-xs font-light",
                  activeTab === tab.id
                    ? scheme.from.replace("from-", "border-")
                    : "border-neutral-300"
                )}
              >
                {tab.count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* ── Role Groups Tab ─────────────────────────────────────────────── */}
      {activeTab === "groups" && (
        <div className="space-y-4">
          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon
              const isActive = activeCategory === cat.id
              const count =
                cat.id === "all"
                  ? IMMUTA_ROLE_GROUPS.length
                  : IMMUTA_ROLE_GROUPS.filter(g => g.category === cat.id).length
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-light border transition-all",
                    isActive
                      ? cn(
                          "bg-gradient-to-r text-white border-transparent shadow-sm",
                          scheme.from,
                          scheme.to
                        )
                      : "border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300"
                  )}
                >
                  <Icon className="size-3" />
                  {cat.label}
                  <span className={cn("text-xs", isActive ? "text-white/80" : "text-neutral-400")}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              placeholder="Search role groups by name, description, or tag..."
              value={groupSearch}
              onChange={e => setGroupSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-neutral-200 font-light text-sm"
            />
          </div>

          {/* Groups list */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {filteredGroups.map(group => {
              const isSelected = selectedGroups.has(group.id)
              return (
                <div
                  key={group.id}
                  onClick={() => toggleGroup(group.id)}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer",
                    isSelected
                      ? cn("bg-gradient-to-r border-transparent shadow-md", scheme.bg, scheme.bgHover)
                      : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
                  )}
                >
                  <Checkbox
                    checked={isSelected}
                    className="mt-0.5 pointer-events-none"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="text-sm font-normal text-neutral-900 truncate">
                        {group.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className={cn("text-xs font-light px-1.5 py-0 shrink-0", getSourceColor(group.source))}
                      >
                        {group.source}
                      </Badge>
                    </div>
                    <p className="text-xs font-light text-neutral-500 truncate mb-1.5">
                      {group.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-light text-xs border-neutral-200">
                        <Users className="size-3 mr-1" />
                        {group.memberCount} members
                      </Badge>
                      <Badge variant="outline" className="font-light text-xs border-neutral-200">
                        {group.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredGroups.length === 0 && (
              <p className="text-sm font-light text-neutral-500 text-center py-8">
                No role groups found matching your search.
              </p>
            )}
          </div>
        </div>
      )}

      {/* ── Individual Users Tab ────────────────────────────────────────── */}
      {activeTab === "individuals" && (
        <div className="space-y-4">
          {/* Selected users chips */}
          {selectedUsers.size > 0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(selectedUsers).map(uid => {
                const user = INDIVIDUAL_USERS.find(u => u.id === uid)
                if (!user) return null
                return (
                  <span
                    key={uid}
                    className={cn(
                      "inline-flex items-center gap-1.5 pl-3 pr-1.5 py-1 rounded-full text-xs font-light border",
                      scheme.bg,
                      scheme.from.replace("from-", "border-").replace("500", "200")
                    )}
                  >
                    {user.name}
                    <button
                      onClick={() => removeUser(uid)}
                      className="flex size-5 items-center justify-center rounded-full hover:bg-white/60 transition-colors"
                    >
                      <X className="size-3" />
                    </button>
                  </span>
                )
              })}
            </div>
          )}

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              placeholder="Search by name, PRID, or org..."
              value={userSearch}
              onChange={e => setUserSearch(e.target.value)}
              className="pl-9 h-10 rounded-xl border-neutral-200 font-light text-sm"
            />
          </div>

          {/* User results */}
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto">
            {filteredUsers.map(user => {
              const isSelected = selectedUsers.has(user.id)
              return (
                <div
                  key={user.id}
                  onClick={() => toggleUser(user.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all",
                    isSelected
                      ? cn("bg-gradient-to-r border-transparent", scheme.bg, scheme.bgHover)
                      : "border-neutral-200 bg-white hover:border-neutral-300"
                  )}
                >
                  <Checkbox checked={isSelected} className="pointer-events-none" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-normal text-neutral-900 truncate">
                        {user.name}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-xs font-light px-1.5 py-0 shrink-0"
                      >
                        {user.id}
                      </Badge>
                    </div>
                    <p className="text-xs font-light text-neutral-500 truncate">
                      {user.role} &middot; {user.org}
                    </p>
                  </div>
                </div>
              )
            })}
            {filteredUsers.length === 0 && (
              <p className="text-sm font-light text-neutral-500 text-center py-4">
                No users found matching &ldquo;{userSearch}&rdquo;
              </p>
            )}
          </div>

          {/* Manual PRIDs */}
          <Card className="border-neutral-200 rounded-xl">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <IdCard className="size-4 text-neutral-500" />
                <p className="text-sm font-normal text-neutral-900">Manual PRID Entry</p>
              </div>
              <p className="text-xs font-light text-neutral-500 mb-3">
                Enter PRIDs directly (comma-separated) for users not in the directory.
              </p>
              <Input
                placeholder="P123456, P789012, P345678"
                value={manualPrids}
                onChange={e => setManualPrids(e.target.value)}
                className="rounded-xl border-neutral-200 font-light text-sm"
              />
              {manualPridCount > 0 && (
                <p className="text-xs font-light text-neutral-500 mt-2">
                  {manualPridCount} PRID{manualPridCount !== 1 ? "s" : ""} entered
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ── Summary Tab ─────────────────────────────────────────────────── */}
      {activeTab === "summary" && (
        <div className="space-y-4">
          {totalSelections === 0 ? (
            <div className="text-center py-12">
              <Users className="size-10 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm font-light text-neutral-500">
                No groups or users selected yet.
              </p>
              <p className="text-xs font-light text-neutral-400 mt-1">
                Use the Role Groups or Individual Users tabs to add access.
              </p>
            </div>
          ) : (
            <>
              {/* Selected groups */}
              {selectedGroups.size > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-normal text-neutral-900">
                      Role Groups ({selectedGroups.size})
                    </h3>
                    <span className="text-xs font-light text-neutral-500">
                      ~{totalGroupMembers.toLocaleString()} members
                    </span>
                  </div>
                  <div className="space-y-2">
                    {Array.from(selectedGroups).map(gid => {
                      const group = IMMUTA_ROLE_GROUPS.find(g => g.id === gid)
                      if (!group) return null
                      return (
                        <div
                          key={gid}
                          className={cn(
                            "flex items-center justify-between p-3 rounded-xl border",
                            scheme.bg,
                            scheme.from.replace("from-", "border-").replace("500", "200")
                          )}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <CheckCircle2
                              className={cn("size-4 shrink-0", scheme.from.replace("from-", "text-"))}
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-normal text-neutral-900 truncate">
                                {group.name}
                              </p>
                              <p className="text-xs font-light text-neutral-500">
                                {group.memberCount} members &middot; {group.source}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => toggleGroup(gid)}
                            className="flex size-7 items-center justify-center rounded-lg hover:bg-white/60 transition-colors shrink-0"
                          >
                            <X className="size-3.5 text-neutral-400" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Selected individual users */}
              {totalIndividuals > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-normal text-neutral-900">
                      Individual Users ({totalIndividuals})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {Array.from(selectedUsers).map(uid => {
                      const user = INDIVIDUAL_USERS.find(u => u.id === uid)
                      if (!user) return null
                      return (
                        <div
                          key={uid}
                          className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 bg-white"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <UserCheck className="size-4 shrink-0 text-green-600" />
                            <div className="min-w-0">
                              <p className="text-sm font-normal text-neutral-900 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs font-light text-neutral-500">
                                {user.id} &middot; {user.org}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeUser(uid)}
                            className="flex size-7 items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors shrink-0"
                          >
                            <X className="size-3.5 text-neutral-400" />
                          </button>
                        </div>
                      )
                    })}
                    {manualPridCount > 0 && (
                      <div className="flex items-center justify-between p-3 rounded-xl border border-neutral-200 bg-white">
                        <div className="flex items-center gap-3">
                          <IdCard className="size-4 shrink-0 text-neutral-500" />
                          <div>
                            <p className="text-sm font-normal text-neutral-900">
                              Manual PRIDs
                            </p>
                            <p className="text-xs font-light text-neutral-500">
                              {manualPrids
                                .split(",")
                                .filter(p => p.trim())
                                .map(p => p.trim())
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="font-light text-xs">
                          {manualPridCount}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Total summary */}
              <Card
                className={cn(
                  "border-2 rounded-xl",
                  scheme.from.replace("from-", "border-").replace("500", "200")
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex size-10 items-center justify-center rounded-xl bg-gradient-to-r text-white",
                          scheme.from,
                          scheme.to
                        )}
                      >
                        <Users className="size-5" />
                      </div>
                      <div>
                        <p className="text-lg font-light text-neutral-900">
                          ~{totalEstimated.toLocaleString()}
                        </p>
                        <p className="text-xs font-light text-neutral-500">
                          estimated total users (may include overlap between groups)
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAll}
                      className="rounded-xl font-light text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="size-3.5 mr-1.5" />
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      )}

      {/* Info Note */}
      <div className="rounded-xl p-3 bg-blue-50 border border-blue-100">
        <div className="flex gap-3">
          <Info className="size-4 shrink-0 text-blue-600 mt-0.5" />
          <div className="text-xs font-light text-blue-900">
            <span className="font-normal">Note:</span> Access configuration is optional for the Concept stage.
            Role groups are sourced from Immuta and ROAM. Individual overrides are added directly.
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
        {totalSelections > 0 ? "Save & Continue" : "Skip for Now"}
        <ArrowRight className="size-4 ml-2" />
      </Button>
    </div>
  )
}

"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MOCK_DATASETS, filterDatasets, type ChildDataset } from "@/lib/dcm-mock-data"
import {
  Sparkles,
  ArrowLeft,
  Check,
  AlertTriangle,
  X,
  Database,
  Loader2,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Shield,
  Filter,
  Clock,
  CheckCircle2,
  Zap,
  LayoutGrid,
  List,
  HelpCircle,
  SlidersHorizontal,
  Users,
  MapPin,
  ArrowUpDown,
  MessageSquare,
  Target,
  Lightbulb,
  XCircle,
  Info,
  Pencil,
  Microscope,
  Building,
  FileText,
  Mail,
  UserCheck,
  Globe,
  Layers,
  Search,
  Building2,
  IdCard,
  Eye,
  Calendar,
  Lock,
  User,
  FlaskConical,
  Beaker,
} from "lucide-react"

// Access status grouping configuration
const ACCESS_GROUPS = [
  {
    id: "open",
    label: "Open Access",
    icon: CheckCircle2,
    color: "emerald",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
    textColor: "text-emerald-700",
    iconColor: "text-emerald-600",
    description: "Instant access - no action needed",
    filterFn: (d: typeof MOCK_DATASETS[0]) => d.accessBreakdown.alreadyOpen >= 50,
  },
  {
    id: "ready",
    label: "Awaiting Policy",
    icon: Zap,
    color: "blue",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    textColor: "text-blue-700",
    iconColor: "text-blue-600",
    description: "Granted once policy is configured",
    filterFn: (d: typeof MOCK_DATASETS[0]) =>
      d.accessBreakdown.alreadyOpen < 50 && d.accessBreakdown.readyToGrant >= 30,
  },
  {
    id: "approval",
    label: "Needs Approval",
    icon: Clock,
    color: "amber",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
    textColor: "text-amber-700",
    iconColor: "text-amber-600",
    description: "Requires review from data governance",
    filterFn: (d: typeof MOCK_DATASETS[0]) =>
      d.accessBreakdown.alreadyOpen < 50 &&
      d.accessBreakdown.readyToGrant < 30 &&
      d.accessBreakdown.needsApproval >= 30,
  },
  {
    id: "missing",
    label: "Missing / Blocked",
    icon: AlertTriangle,
    color: "neutral",
    bgColor: "bg-neutral-50",
    borderColor: "border-neutral-200",
    textColor: "text-neutral-600",
    iconColor: "text-neutral-500",
    description: "Data location unknown or training required",
    filterFn: (d: typeof MOCK_DATASETS[0]) =>
      d.accessBreakdown.alreadyOpen < 50 &&
      d.accessBreakdown.readyToGrant < 30 &&
      d.accessBreakdown.needsApproval < 30,
  },
]

// Filter options
const PHASE_OPTIONS = ["I", "II", "III", "IV"]
const STATUS_OPTIONS = ["Active", "Closed"]
const THERAPEUTIC_AREAS = ["Oncology", "Cardiology", "Neurology", "Immunology", "Endocrinology", "Respiratory", "Infectious Disease"]
const GEOGRAPHY_OPTIONS = ["US", "EU", "Asia", "Global", "Latin America", "Middle East"]
const DATA_MODALITY_OPTIONS = ["Clinical", "Genomic", "Imaging (DICOM)", "Biomarker", "Patient Reported Outcomes", "Real World Data"]
const ACCESS_PLATFORM_OPTIONS = ["Domino", "SCP", "AIBench"] as const
const DATA_LAYER_OPTIONS = ["Starburst", "S3", "Snowflake"] as const
const COMPLIANCE_OPTIONS = ["Research Allowed", "Research with Restrictions", "External Publication OK", "AI/ML Training OK", "Commercial Use OK"]
const STUDY_SPONSOR_OPTIONS = ["Sponsor", "Investigator-Initiated", "Academic", "Government", "Consortium"]
const PATIENT_POPULATION_OPTIONS = [
  { value: "small", label: "Small (<200 patients)" },
  { value: "medium", label: "Medium (200-500)" },
  { value: "large", label: "Large (500-1000)" },
  { value: "very-large", label: "Very Large (1000+)" },
]

// Organizations for user filtering
const ORGANIZATIONS = [
  { id: "onc-biometrics", name: "Oncology Biometrics", users: 45, roles: ["Data Scientists (28)", "Biostatisticians (17)"] },
  { id: "onc-data-sci", name: "Oncology Data Science", users: 60, roles: ["Data Scientists (42)", "Engineers (18)"] },
  { id: "trans-med-onc", name: "Translational Medicine - Oncology", users: 15, roles: ["Scientists (12)", "Data Analysts (3)"] },
  { id: "clin-ops", name: "Clinical Operations", users: 32, roles: ["Clinical Data Managers (20)", "Study Coordinators (12)"] },
  { id: "rwd-analytics", name: "Real World Data Analytics", users: 28, roles: ["Data Scientists (18)", "Epidemiologists (10)"] },
  { id: "bioinformatics", name: "Bioinformatics", users: 22, roles: ["Bioinformaticians (15)", "Computational Biologists (7)"] },
]

// User roles for access filtering
const USER_ROLES = [
  { id: "data-scientist", name: "Data Scientist", count: 88 },
  { id: "biostatistician", name: "Biostatistician", count: 20 },
  { id: "clinical-researcher", name: "Clinical Researcher", count: 35 },
  { id: "data-engineer", name: "Data Engineer", count: 18 },
  { id: "medical-writer", name: "Medical Writer", count: 12 },
  { id: "regulatory-affairs", name: "Regulatory Affairs", count: 8 },
  { id: "external-collaborator", name: "External Collaborator", count: 25 },
  { id: "contractor", name: "Contractor", count: 15 },
]

// Mock team members for quick email lookup
const TEAM_MEMBERS = [
  { email: "john.smith@astrazeneca.com", name: "John Smith", role: "Data Scientist" },
  { email: "sarah.jones@astrazeneca.com", name: "Sarah Jones", role: "Biostatistician" },
  { email: "mike.chen@astrazeneca.com", name: "Mike Chen", role: "Clinical Researcher" },
  { email: "emma.wilson@astrazeneca.com", name: "Emma Wilson", role: "Data Engineer" },
  { email: "lisa.wong@external.com", name: "Lisa Wong", role: "External Collaborator" },
  { email: "david.kumar@contractor.com", name: "David Kumar", role: "Contractor" },
]

export default function VariationDatasets() {
  const { scheme } = useColorScheme()
  const router = useRouter()

  // Core states
  const [prompt, setPrompt] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showResults, setShowResults] = useState(false)

  // Smart filter state
  const [smartFilterQuery, setSmartFilterQuery] = useState("")
  const [smartFilterActive, setSmartFilterActive] = useState(false)

  // Smart filter editing state
  const [showSmartFilterInput, setShowSmartFilterInput] = useState(false)
  const [smartFilterInput, setSmartFilterInput] = useState("")
  const [isSmartFiltering, setIsSmartFiltering] = useState(false)

  // Manual filters - Basic
  const [phaseFilters, setPhaseFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [therapeuticAreaFilters, setTherapeuticAreaFilters] = useState<string[]>([])
  const [geographyFilters, setGeographyFilters] = useState<string[]>([])

  // Manual filters - Advanced
  const [dataModalityFilters, setDataModalityFilters] = useState<string[]>([])
  const [complianceFilters, setComplianceFilters] = useState<string[]>([])
  const [sponsorFilters, setSponsorFilters] = useState<string[]>([])
  const [patientPopulationFilters, setPatientPopulationFilters] = useState<string[]>([])

  // Platform filters
  const [accessPlatformFilters, setAccessPlatformFilters] = useState<string[]>([])

  // User Access Filters
  const [myAccessOnly, setMyAccessOnly] = useState(false)

  // User Criteria Dialog State
  const [userCriteriaDialogOpen, setUserCriteriaDialogOpen] = useState(false)
  const [userCriteriaMode, setUserCriteriaMode] = useState<"org" | "role" | "individual">("org")
  const [selectedOrgs, setSelectedOrgs] = useState<Set<string>>(new Set())
  const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set())
  const [individualEmails, setIndividualEmails] = useState("")

  // Filter expandable state
  const [filtersExpanded, setFiltersExpanded] = useState(false)

  // Selection
  const [selectedDatasets, setSelectedDatasets] = useState<Set<string>>(new Set())

  // View
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")
  const [sortBy, setSortBy] = useState<"relevance" | "name" | "phase" | "access">("relevance")
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())

  // Filter datasets based on all active filters
  // When smartFilterActive is false, ignore AI-set filters and show all datasets
  const filteredDatasets = useMemo(() => {
    // If smart filter is paused, only apply manual filters (not AI-extracted ones)
    const activePhaseFilters = smartFilterActive ? phaseFilters : []
    const activeTherapeuticAreaFilters = smartFilterActive ? therapeuticAreaFilters : []

    let result = filterDatasets(MOCK_DATASETS, {
      phase: activePhaseFilters,
      status: statusFilters,
      geography: geographyFilters,
    })

    // Apply therapeutic area filter (only when smart filter is active)
    if (activeTherapeuticAreaFilters.length > 0) {
      result = result.filter(d =>
        d.therapeuticArea.some(ta =>
          activeTherapeuticAreaFilters.some(filter => ta.toLowerCase().includes(filter.toLowerCase()))
        )
      )
    }

    // Apply access platform filter
    if (accessPlatformFilters.length > 0) {
      result = result.filter(d => accessPlatformFilters.includes(d.accessPlatform))
    }

    // Simulate semantic/vector search filtering when smart filter is active
    // This removes ~40% of results to demonstrate what AI filtering would feel like
    if (smartFilterActive && smartFilterQuery) {
      // Use a deterministic "hash" to score and sort results, then keep top ~60%
      const queryHash = smartFilterQuery.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
      const scored = result.map(d => {
        const idHash = d.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
        // Create a pseudo-random score between 0-99 for each dataset
        const score = (idHash * 31 + queryHash * 17) % 100
        return { dataset: d, score }
      })
      // Sort by score descending and keep top 60%
      scored.sort((a, b) => b.score - a.score)
      const keepCount = Math.max(1, Math.ceil(scored.length * 0.6))
      result = scored.slice(0, keepCount).map(s => s.dataset)
    }

    // Sort results
    if (sortBy === "name") {
      result = [...result].sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortBy === "phase") {
      result = [...result].sort((a, b) => a.phase.localeCompare(b.phase))
    } else if (sortBy === "access") {
      result = [...result].sort((a, b) => b.accessBreakdown.alreadyOpen - a.accessBreakdown.alreadyOpen)
    }

    return result
  }, [phaseFilters, statusFilters, therapeuticAreaFilters, geographyFilters, accessPlatformFilters, sortBy, smartFilterActive, smartFilterQuery])

  // Group datasets by access status
  const groupedDatasets = useMemo(() => {
    const groups: Record<string, typeof MOCK_DATASETS> = {}

    ACCESS_GROUPS.forEach(group => {
      groups[group.id] = filteredDatasets.filter(group.filterFn)
    })

    return groups
  }, [filteredDatasets])

  // Calculate selection statistics
  const selectionStats = useMemo(() => {
    const selected = filteredDatasets.filter(d => selectedDatasets.has(d.id))
    if (selected.length === 0) return null

    const totalOpen = selected.reduce((sum, d) => sum + d.accessBreakdown.alreadyOpen, 0) / selected.length
    const totalReady = selected.reduce((sum, d) => sum + d.accessBreakdown.readyToGrant, 0) / selected.length
    const totalApproval = selected.reduce((sum, d) => sum + d.accessBreakdown.needsApproval, 0) / selected.length
    const totalMissing = selected.reduce((sum, d) => sum + d.accessBreakdown.missingLocation, 0) / selected.length

    return {
      count: selected.length,
      alreadyOpen: Math.round(totalOpen),
      readyToGrant: Math.round(totalReady),
      needsApproval: Math.round(totalApproval),
      missingLocation: Math.round(totalMissing),
    }
  }, [selectedDatasets, filteredDatasets])

  // Calculate user criteria count
  const userCriteriaCount = useMemo(() => {
    if (userCriteriaMode === "org") {
      return Array.from(selectedOrgs)
        .map((id) => ORGANIZATIONS.find((o) => o.id === id)?.users || 0)
        .reduce((a, b) => a + b, 0)
    } else if (userCriteriaMode === "role") {
      return Array.from(selectedRoles)
        .map((id) => USER_ROLES.find((r) => r.id === id)?.count || 0)
        .reduce((a, b) => a + b, 0)
    } else {
      return individualEmails.split(",").filter(e => e.trim()).length
    }
  }, [userCriteriaMode, selectedOrgs, selectedRoles, individualEmails])

  // Check if user criteria is active
  const hasUserCriteria = selectedOrgs.size > 0 || selectedRoles.size > 0 || individualEmails.trim().length > 0

  // Check if any filters are active
  const hasActiveFilters = phaseFilters.length > 0 || statusFilters.length > 0 ||
    therapeuticAreaFilters.length > 0 || geographyFilters.length > 0 ||
    dataModalityFilters.length > 0 || complianceFilters.length > 0 ||
    sponsorFilters.length > 0 || patientPopulationFilters.length > 0 ||
    accessPlatformFilters.length > 0 ||
    hasUserCriteria || myAccessOnly

  // Count total active filters
  const activeFilterCount = phaseFilters.length + statusFilters.length +
    therapeuticAreaFilters.length + geographyFilters.length +
    dataModalityFilters.length + complianceFilters.length +
    sponsorFilters.length + patientPopulationFilters.length +
    accessPlatformFilters.length +
    (hasUserCriteria ? 1 : 0) + (myAccessOnly ? 1 : 0)

  // Handle AI discovery
  const handleDiscover = async () => {
    if (!prompt.trim()) return

    setIsAnalyzing(true)
    setShowResults(false)

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1800))

    // Simulate AI extracting filters from prompt
    const lowerPrompt = prompt.toLowerCase()

    // Reset filters first
    setPhaseFilters([])
    setTherapeuticAreaFilters([])
    setStatusFilters([])
    setGeographyFilters([])

    // AI determines if this query needs semantic/vector search (smart filter)
    // or if it can just be handled by preset filters
    const needsSemanticSearch = lowerPrompt.includes("ml") ||
      lowerPrompt.includes("machine learning") ||
      lowerPrompt.includes("biomarker") ||
      lowerPrompt.includes("imaging") ||
      lowerPrompt.includes("complex") ||
      lowerPrompt.length > 60 // Longer queries likely need semantic search

    // Auto-detect therapeutic area (using abbreviations that match mock data)
    if (lowerPrompt.includes("oncology") || lowerPrompt.includes("cancer")) {
      setTherapeuticAreaFilters(["ONC"])
    }
    if (lowerPrompt.includes("cardio") || lowerPrompt.includes("heart")) {
      setTherapeuticAreaFilters(["CARDIO"])
    }
    if (lowerPrompt.includes("neuro")) {
      setTherapeuticAreaFilters(["NEURO"])
    }

    // Auto-detect phase
    if (lowerPrompt.includes("phase iii") || lowerPrompt.includes("phase 3")) {
      setPhaseFilters(["III"])
    }
    if (lowerPrompt.includes("phase ii") || lowerPrompt.includes("phase 2")) {
      setPhaseFilters(["II"])
    }
    if (lowerPrompt.includes("phase i") || lowerPrompt.includes("phase 1")) {
      setPhaseFilters(["I"])
    }

    // Auto-detect status
    if (lowerPrompt.includes("closed") || lowerPrompt.includes("completed")) {
      setStatusFilters(["Closed"])
    }
    if (lowerPrompt.includes("active") || lowerPrompt.includes("ongoing")) {
      setStatusFilters(["Active"])
    }

    // Auto-detect geography
    if (lowerPrompt.includes("europe") || lowerPrompt.includes("eu")) {
      setGeographyFilters(["EU"])
    }
    if (lowerPrompt.includes("us") || lowerPrompt.includes("united states") || lowerPrompt.includes("america")) {
      setGeographyFilters(["US"])
    }
    if (lowerPrompt.includes("asia")) {
      setGeographyFilters(["Asia"])
    }
    if (lowerPrompt.includes("global")) {
      setGeographyFilters(["Global"])
    }

    // Only activate smart filter if semantic search is needed
    if (needsSemanticSearch) {
      setSmartFilterQuery(prompt)
      setSmartFilterActive(true)
    } else {
      // Just use preset filters, no smart filter needed
      setSmartFilterQuery("")
      setSmartFilterActive(false)
    }

    setIsAnalyzing(false)
    setHasSearched(true)

    // Trigger animated reveal
    setTimeout(() => setShowResults(true), 100)
  }

  // Selection helpers
  const toggleDataset = (id: string) => {
    setSelectedDatasets(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    setSelectedDatasets(new Set(filteredDatasets.map(d => d.id)))
  }

  const selectGroup = (groupId: string) => {
    const group = ACCESS_GROUPS.find(g => g.id === groupId)
    if (!group) return

    const groupDatasets = filteredDatasets.filter(group.filterFn)
    setSelectedDatasets(prev => {
      const next = new Set(prev)
      groupDatasets.forEach(d => next.add(d.id))
      return next
    })
  }

  const selectAllOpen = () => {
    const openGroup = ACCESS_GROUPS.find(g => g.id === "open")
    if (openGroup) {
      const openDatasets = filteredDatasets.filter(openGroup.filterFn)
      setSelectedDatasets(new Set(openDatasets.map(d => d.id)))
    }
  }

  const selectAllReady = () => {
    const readyGroup = ACCESS_GROUPS.find(g => g.id === "ready")
    if (readyGroup) {
      const readyDatasets = filteredDatasets.filter(readyGroup.filterFn)
      setSelectedDatasets(prev => {
        const next = new Set(prev)
        readyDatasets.forEach(d => next.add(d.id))
        return next
      })
    }
  }

  const clearSelection = () => setSelectedDatasets(new Set())

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      if (next.has(groupId)) next.delete(groupId)
      else next.add(groupId)
      return next
    })
  }

  const clearAllFilters = () => {
    setPhaseFilters([])
    setStatusFilters([])
    setTherapeuticAreaFilters([])
    setGeographyFilters([])
    setDataModalityFilters([])
    setComplianceFilters([])
    setSponsorFilters([])
    setPatientPopulationFilters([])
    setAccessPlatformFilters([])
    setSelectedOrgs(new Set())
    setSelectedRoles(new Set())
    setIndividualEmails("")
    setMyAccessOnly(false)
    // Disable smart filter instead of clearing it completely
    setSmartFilterActive(false)
  }

  // Clear user criteria
  const clearUserCriteria = () => {
    setSelectedOrgs(new Set())
    setSelectedRoles(new Set())
    setIndividualEmails("")
  }

  // Toggle org selection
  const toggleOrg = (orgId: string) => {
    const newSelected = new Set(selectedOrgs)
    if (newSelected.has(orgId)) {
      newSelected.delete(orgId)
    } else {
      newSelected.add(orgId)
    }
    setSelectedOrgs(newSelected)
  }

  // Toggle role selection
  const toggleRole = (roleId: string) => {
    const newSelected = new Set(selectedRoles)
    if (newSelected.has(roleId)) {
      newSelected.delete(roleId)
    } else {
      newSelected.add(roleId)
    }
    setSelectedRoles(newSelected)
  }

  // Edit smart filter
  const editSmartFilter = () => {
    setSmartFilterInput(smartFilterQuery)
    setShowSmartFilterInput(true)
  }

  // Clear smart filter
  const clearSmartFilter = () => {
    setSmartFilterQuery("")
    setSmartFilterActive(false)
    setShowSmartFilterInput(false)
    setSmartFilterInput("")
  }

  // Toggle smart filter on/off
  const toggleSmartFilter = () => {
    setSmartFilterActive(!smartFilterActive)
  }

  // Apply smart filter edit
  const handleApplySmartFilter = async () => {
    if (!smartFilterInput.trim()) return

    setIsSmartFiltering(true)

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1200))

    setSmartFilterQuery(smartFilterInput)
    setSmartFilterActive(true)
    setShowSmartFilterInput(false)
    setIsSmartFiltering(false)
  }

  const handleRequestAccess = () => {
    if (selectedDatasets.size === 0) return

    // Store selected datasets in sessionStorage
    sessionStorage.setItem("selected_datasets_for_request", JSON.stringify(Array.from(selectedDatasets)))
    router.push("/collectoid/requests/new")
  }

  // Filter toggle helper
  const toggleFilter = (
    value: string,
    currentFilters: string[],
    setFilters: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (currentFilters.includes(value)) {
      setFilters(currentFilters.filter(f => f !== value))
    } else {
      setFilters([...currentFilters, value])
    }
  }

  return (
    <div className="py-8 pb-32">
      {/* Header - Animated between centered (discovery) and left-aligned (results) */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/collectoid/discover")}
          className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Discovery
        </button>

        <div className={cn(
          "transition-all duration-500 ease-out",
          hasSearched
            ? "flex items-center justify-between gap-6"
            : "flex flex-col items-center text-center"
        )}>
          {/* Left side: Icon + Title */}
          <div className={cn(
            "transition-all duration-500 ease-out",
            hasSearched
              ? "flex items-center gap-4"
              : "flex flex-col items-center"
          )}>
            <div className={cn(
              "inline-flex items-center justify-center bg-gradient-to-br text-white transition-all duration-500 ease-out",
              scheme.from,
              scheme.to,
              hasSearched
                ? "size-12 rounded-xl"
                : "size-16 rounded-2xl mb-6"
            )}>
              <Database className={cn(
                "text-white transition-all duration-500",
                hasSearched ? "size-6" : "size-8"
              )} />
            </div>
            <div>
              <h1 className={cn(
                "font-extralight text-neutral-900 tracking-tight transition-all duration-500 ease-out",
                hasSearched ? "text-2xl mb-1" : "text-3xl mb-3"
              )}>
                Dataset Explorer
              </h1>
              {hasSearched ? (
                <p className="text-sm font-light text-neutral-500 animate-in fade-in duration-300">
                  {filteredDatasets.length} datasets found
                  {hasActiveFilters && " • Filters applied"}
                  {smartFilterActive && " • AI Smart Filter active"}
                </p>
              ) : (
                <>
                  <p className="text-base font-light text-neutral-600 max-w-2xl mx-auto mb-3">
                    Find and select individual datasets, filter by access status, and request access
                  </p>
                  {/* Help Link */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <button className={cn(
                        "inline-flex items-center gap-2 text-sm font-light transition-colors",
                        scheme.from.replace("from-", "text-"),
                        "hover:underline"
                      )}>
                        <HelpCircle className="size-4" />
                        New to AI-powered search? Learn how to write effective prompts
                      </button>
                    </SheetTrigger>
                    <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
                      <div className="px-6 pb-6">
                        <SheetHeader>
                          <SheetTitle className="text-2xl font-light text-neutral-900 flex items-center gap-2">
                            <MessageSquare className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                            Writing Effective Discovery Prompts
                          </SheetTitle>
                          <SheetDescription className="font-light">
                            Get better results by describing your data needs clearly
                          </SheetDescription>
                        </SheetHeader>

                        <div className="mt-6 space-y-6">
                          {/* Overview */}
                          <div>
                            <h3 className="text-lg font-normal text-neutral-900 mb-3">How does this work?</h3>
                            <p className="text-sm font-light text-neutral-700 leading-relaxed">
                              Our AI analyzes your natural language description to understand what data you need.
                              It extracts key concepts like disease areas, data types, and intended use, then matches
                              them against our dataset catalog. The more specific you are, the better the results!
                            </p>
                          </div>

                          <Separator />

                          {/* What to Include */}
                          <div>
                            <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                              <Target className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                              What to Include in Your Prompt
                            </h3>
                            <div className="space-y-3">
                              <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                                <div className="flex items-start gap-3">
                                  <div className={cn(
                                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white bg-gradient-to-br mt-0.5",
                                    scheme.from,
                                    scheme.to
                                  )}>
                                    1
                                  </div>
                                  <div>
                                    <h4 className="font-normal text-neutral-900 mb-1">Disease Area or Indication</h4>
                                    <p className="text-sm font-light text-neutral-600">
                                      Specify the therapeutic area: oncology, cardiology, neurology, etc.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                                <div className="flex items-start gap-3">
                                  <div className={cn(
                                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white bg-gradient-to-br mt-0.5",
                                    scheme.from,
                                    scheme.to
                                  )}>
                                    2
                                  </div>
                                  <div>
                                    <h4 className="font-normal text-neutral-900 mb-1">Data Type Requirements</h4>
                                    <p className="text-sm font-light text-neutral-600">
                                      What kind of data? Biomarkers, imaging, genomics, patient outcomes, etc.
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                                <div className="flex items-start gap-3">
                                  <div className={cn(
                                    "flex size-6 shrink-0 items-center justify-center rounded-full text-xs text-white bg-gradient-to-br mt-0.5",
                                    scheme.from,
                                    scheme.to
                                  )}>
                                    3
                                  </div>
                                  <div>
                                    <h4 className="font-normal text-neutral-900 mb-1">Intended Use</h4>
                                    <p className="text-sm font-light text-neutral-600">
                                      What will you use the data for? ML research, publication, regulatory submission?
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Examples */}
                          <div>
                            <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                              <Lightbulb className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                              Example Prompts
                            </h3>
                            <div className="space-y-3">
                              <div className={cn("p-4 rounded-xl border-2", scheme.from.replace("from-", "border-").replace("-500", "-200"), scheme.bg)}>
                                <p className="text-sm font-normal text-neutral-900 mb-2">&quot;Phase III oncology studies with biomarker data suitable for ML model training&quot;</p>
                                <p className="text-xs font-light text-neutral-600">
                                  ✓ Disease area ✓ Study phase ✓ Data type ✓ Intended use
                                </p>
                              </div>
                              <div className="p-4 rounded-xl border border-neutral-200 bg-white">
                                <p className="text-sm font-normal text-neutral-900 mb-2">&quot;Cardiovascular trials with imaging endpoints in European sites&quot;</p>
                                <p className="text-xs font-light text-neutral-600">
                                  ✓ Disease area ✓ Data type ✓ Geography
                                </p>
                              </div>
                            </div>
                          </div>

                          <Separator />

                          {/* Tips */}
                          <div>
                            <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                              <Info className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                              Pro Tips
                            </h3>
                            <ul className="space-y-2 text-sm font-light text-neutral-700">
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                                Be specific about your use case - it helps filter results
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                                Mention any compliance requirements (HIPAA, GDPR, etc.)
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                                Include timeframe if relevant (recent studies, historical data)
                              </li>
                              <li className="flex items-start gap-2">
                                <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                                You can always refine with manual filters after AI search
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Hero AI Discovery Input - Only shown before first search */}
      {!hasSearched && (
        <div className="mb-8 animate-in fade-in duration-300">
          <div className="max-w-4xl mx-auto">
            <Card className={cn(
              "relative border-2 rounded-2xl overflow-hidden bg-white shadow-lg transition-all duration-500",
              isAnalyzing
                ? cn(scheme.from.replace("from-", "border-"), "shadow-xl scale-[1.02]")
                : "border-neutral-200"
            )}>
              {/* Analyzing Overlay */}
              <div className={cn(
                "absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/95 backdrop-blur-sm transition-all duration-500",
                isAnalyzing
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              )}>
                <div className={cn(
                  "relative mb-6"
                )}>
                  {/* Pulsing ring effect */}
                  <div className={cn(
                    "absolute inset-0 rounded-full bg-gradient-to-r animate-ping opacity-30",
                    scheme.from, scheme.to
                  )} />
                  <div className={cn(
                    "relative size-16 rounded-full bg-gradient-to-r flex items-center justify-center shadow-lg",
                    scheme.from, scheme.to
                  )}>
                    <Loader2 className="size-8 text-white animate-spin" />
                  </div>
                </div>
                <p className="text-lg font-light text-neutral-800 mb-1">Predefining filters...</p>
                <p className="text-sm font-light text-neutral-500">AI is analyzing your request</p>

                {/* Progress dots */}
                <div className="flex gap-1.5 mt-4">
                  <div className={cn(
                    "size-2 rounded-full animate-bounce",
                    scheme.from.replace("from-", "bg-")
                  )} style={{ animationDelay: "0ms" }} />
                  <div className={cn(
                    "size-2 rounded-full animate-bounce",
                    scheme.from.replace("from-", "bg-")
                  )} style={{ animationDelay: "150ms" }} />
                  <div className={cn(
                    "size-2 rounded-full animate-bounce",
                    scheme.from.replace("from-", "bg-")
                  )} style={{ animationDelay: "300ms" }} />
                </div>

                {/* Cancel button */}
                <button
                  onClick={() => setIsAnalyzing(false)}
                  className="mt-6 px-4 py-2 text-sm font-light text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                  <X className="size-3.5 inline mr-1.5" />
                  Cancel
                </button>
              </div>

              <CardContent className={cn(
                "p-8 transition-all duration-300",
                isAnalyzing && "opacity-30"
              )}>
                <div className="flex items-start gap-6">
                  <div className={cn(
                    "flex size-14 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg shrink-0 transition-transform duration-500",
                    scheme.from,
                    scheme.to,
                    isAnalyzing && "scale-90"
                  )}>
                    <Sparkles className={cn(
                      "size-7 transition-all duration-300",
                      isAnalyzing && "animate-pulse"
                    )} />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-xl font-light text-neutral-900">AI Smart Discovery</h2>
                      <Badge className={cn(
                        "font-light text-xs",
                        scheme.from.replace("from-", "bg-"),
                        "text-white"
                      )}>
                        AI
                      </Badge>
                    </div>
                    <p className="text-sm font-light text-neutral-600 mb-3">
                      Describe your research needs in natural language and let AI find the right data
                    </p>

                    <Textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder='Describe what data you need... e.g., "Phase III oncology studies with biomarker data for ML research"'
                      className="min-h-[100px] text-base font-light border-2 rounded-xl resize-none transition-all hover:border-neutral-300 focus-visible:border-current border-neutral-200"
                      disabled={isAnalyzing}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                          handleDiscover()
                        }
                      }}
                    />

                    <div className="flex gap-3 mt-4 justify-end">
                      <Button
                        onClick={handleDiscover}
                        disabled={isAnalyzing || !prompt.trim()}
                        className={cn(
                          "rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all px-6",
                          scheme.from,
                          scheme.to
                        )}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="size-4 mr-2 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <Sparkles className="size-4 mr-2" />
                            Discover Datasets
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Example prompts - fade out when analyzing */}
          <div className={cn(
            "mt-6 text-center transition-all duration-500",
            isAnalyzing ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
          )}>
            <p className="text-sm font-light text-neutral-600 mb-3">
              Try these examples:
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {[
                "Phase III oncology studies with biomarker data",
                "Cardiovascular trials with imaging data in Europe",
                "Closed studies with patient outcomes for ML research",
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  disabled={isAnalyzing}
                  className="px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-light text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  &quot;{example}&quot;
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Smart Filter Component - Shown in results view, matching filters page pattern */}
      {hasSearched && !isAnalyzing && (
        <div className="mb-6">
          {/* State 1: No smart filter - show dashed button to add */}
          {!smartFilterQuery && !showSmartFilterInput && (
            <button
              onClick={() => setShowSmartFilterInput(true)}
              className="w-full max-w-5xl rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-all p-5 text-left group"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex size-11 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg",
                  scheme.from,
                  scheme.to
                )}>
                  <Sparkles className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-normal text-neutral-900 mb-0.5 flex items-center gap-2">
                    AI Smart Filter
                    <Badge className={cn(
                      "font-light text-xs",
                      scheme.from.replace("from-", "bg-").replace("500", "100"),
                      scheme.from.replace("from-", "text-")
                    )}>
                      Optional
                    </Badge>
                  </h3>
                  <p className="text-xs font-light text-neutral-500">
                    Add semantic search to further refine results based on your specific needs
                  </p>
                </div>
                <ChevronRight className="size-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
              </div>
            </button>
          )}

          {/* State 2: Smart filter active - show the card with toggle/edit/clear */}
          {smartFilterQuery && !showSmartFilterInput && (
            <div className={cn(
              "relative max-w-5xl transition-all",
              smartFilterActive && "mb-2"
            )}>
              {/* Animated gradient border background - only show when active */}
              {smartFilterActive && (
                <div className={cn(
                  "absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-75 blur-sm animate-pulse",
                  scheme.from,
                  scheme.to
                )} />
              )}

              <div className={cn(
                "relative rounded-2xl border-2 bg-white shadow-lg transition-all",
                smartFilterActive
                  ? cn(scheme.from.replace("from-", "border-"), "shadow-xl")
                  : "border-neutral-200 opacity-75"
              )}>
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex size-11 items-center justify-center rounded-xl shadow-lg shrink-0 transition-all",
                      smartFilterActive
                        ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                        : "bg-neutral-200 text-neutral-500"
                    )}>
                      <Sparkles className="size-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5">
                        <h3 className={cn(
                          "text-sm font-normal transition-colors",
                          smartFilterActive ? "text-neutral-900" : "text-neutral-600"
                        )}>
                          AI Smart Filter {smartFilterActive ? "Active" : "Paused"}
                        </h3>
                        {smartFilterActive && (
                          <Badge className={cn(
                            "font-light text-xs",
                            scheme.from.replace("from-", "bg-"),
                            "text-white"
                          )}>
                            AI
                          </Badge>
                        )}
                      </div>
                      <p className={cn(
                        "text-sm font-light mb-2 italic transition-colors",
                        smartFilterActive ? "text-neutral-700" : "text-neutral-500"
                      )}>
                        &quot;{smartFilterQuery}&quot;
                      </p>
                      {smartFilterActive ? (
                        <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
                          <Check className="size-3 text-green-600" />
                          <span>
                            Actively filtering <span className="font-normal text-neutral-900">{filteredDatasets.length} datasets</span> based on AI analysis
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
                          <X className="size-3 text-neutral-400" />
                          <span>Filter is paused - toggle to re-enable</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className={cn(
                        "flex items-center gap-2 backdrop-blur-sm rounded-xl px-3 py-2 transition-colors",
                        smartFilterActive ? "bg-white/50" : "bg-neutral-100"
                      )}>
                        <span className="text-xs font-light text-neutral-600">
                          {smartFilterActive ? "Active" : "Paused"}
                        </span>
                        <Switch
                          checked={smartFilterActive}
                          onCheckedChange={toggleSmartFilter}
                        />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={editSmartFilter}
                        className="rounded-lg font-light"
                      >
                        <Pencil className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearSmartFilter}
                        className="rounded-lg font-light text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* State 3: Editing smart filter - show input form */}
          {showSmartFilterInput && (
            <div className="max-w-5xl rounded-2xl border-2 border-neutral-200 bg-white shadow-lg p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  "flex size-11 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg shrink-0",
                  scheme.from,
                  scheme.to
                )}>
                  <Sparkles className="size-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-normal text-neutral-900 mb-1">AI Smart Filter</h3>
                  <p className="text-xs font-light text-neutral-600 mb-3">
                    Describe what you&apos;re looking for and AI will intelligently filter your datasets
                  </p>
                  <Textarea
                    value={smartFilterInput}
                    onChange={(e) => setSmartFilterInput(e.target.value)}
                    placeholder='e.g., "Studies with biomarker data suitable for ML" or "Recent trials with imaging endpoints"'
                    className="min-h-[70px] text-sm font-light border-neutral-200 rounded-xl resize-none"
                    disabled={isSmartFiltering}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleApplySmartFilter()
                      }
                      if (e.key === 'Escape') {
                        setShowSmartFilterInput(false)
                      }
                    }}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSmartFilterInput(false)}
                  disabled={isSmartFiltering}
                  className="rounded-xl font-light border-neutral-200"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleApplySmartFilter}
                  disabled={isSmartFiltering || !smartFilterInput.trim()}
                  className={cn(
                    "rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
                    scheme.from,
                    scheme.to
                  )}
                >
                  {isSmartFiltering ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Applying...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 mr-2" />
                      Apply Filter
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Section */}
      {hasSearched && !isAnalyzing && (
        <div className={cn(
          "transition-all duration-500",
          showResults
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        )}>
          {/* Sticky Filter Bar */}
          <div className="sticky top-0 z-20 -mx-4 px-4 py-3 bg-white/95 backdrop-blur-xl border-b border-neutral-100 mb-6">
            <div className="flex items-center justify-between gap-4">
              {/* Filter Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* All Filters Button - Toggles expandable section */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setFiltersExpanded(!filtersExpanded)}
                  className={cn(
                    "rounded-xl font-light h-9",
                    filtersExpanded && "bg-neutral-100",
                    activeFilterCount > 0 && cn(
                      scheme.from.replace("from-", "border-"),
                      scheme.from.replace("from-", "bg-").replace("-500", "-50")
                    )
                  )}
                >
                  <SlidersHorizontal className="size-4 mr-2" />
                  All Filters
                  {activeFilterCount > 0 && (
                    <Badge className={cn(
                      "ml-2 h-5 px-1.5 text-xs font-light",
                      scheme.from.replace("from-", "bg-"),
                      "text-white"
                    )}>
                      {activeFilterCount}
                    </Badge>
                  )}
                  <ChevronDown className={cn(
                    "size-4 ml-2 transition-transform",
                    filtersExpanded && "rotate-180"
                  )} />
                </Button>


                <Separator orientation="vertical" className="h-6 mx-1" />

                {/* Quick Filters */}
                <div className="flex items-center gap-1.5 text-xs font-light text-neutral-500 mr-1">
                  Quick:
                </div>

                {/* My Access Quick Filter */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMyAccessOnly(!myAccessOnly)}
                  className={cn(
                    "rounded-xl font-light h-8 text-xs",
                    myAccessOnly && cn(
                      "border-blue-300 bg-blue-50 text-blue-700"
                    )
                  )}
                >
                  <Shield className="size-3 mr-1" />
                  My Access
                  {myAccessOnly && <Check className="size-3 ml-1" />}
                </Button>

                {/* Phase Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-xl font-light h-8 text-xs",
                        phaseFilters.length > 0 && cn(
                          scheme.from.replace("from-", "border-").replace("-500", "-300"),
                          scheme.from.replace("from-", "bg-").replace("-500", "-50")
                        )
                      )}
                    >
                      Phase
                      {phaseFilters.length > 0 && (
                        <Badge className="ml-1.5 h-4 px-1 text-[10px] font-light">{phaseFilters.length}</Badge>
                      )}
                      <ChevronDown className="size-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2" align="start">
                    {PHASE_OPTIONS.map(phase => (
                      <label
                        key={phase}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={phaseFilters.includes(phase)}
                          onCheckedChange={() => toggleFilter(phase, phaseFilters, setPhaseFilters)}
                        />
                        <span className="text-xs font-light">Phase {phase}</span>
                      </label>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Status Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-xl font-light h-8 text-xs",
                        statusFilters.length > 0 && cn(
                          scheme.from.replace("from-", "border-").replace("-500", "-300"),
                          scheme.from.replace("from-", "bg-").replace("-500", "-50")
                        )
                      )}
                    >
                      Status
                      {statusFilters.length > 0 && (
                        <Badge className="ml-1.5 h-4 px-1 text-[10px] font-light">{statusFilters.length}</Badge>
                      )}
                      <ChevronDown className="size-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-36 p-2" align="start">
                    {STATUS_OPTIONS.map(status => (
                      <label
                        key={status}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={statusFilters.includes(status)}
                          onCheckedChange={() => toggleFilter(status, statusFilters, setStatusFilters)}
                        />
                        <span className="text-xs font-light">{status}</span>
                      </label>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Data Type Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-xl font-light h-8 text-xs",
                        dataModalityFilters.length > 0 && cn(
                          scheme.from.replace("from-", "border-").replace("-500", "-300"),
                          scheme.from.replace("from-", "bg-").replace("-500", "-50")
                        )
                      )}
                    >
                      <Microscope className="size-3 mr-1" />
                      Data Type
                      {dataModalityFilters.length > 0 && (
                        <Badge className="ml-1.5 h-4 px-1 text-[10px] font-light">{dataModalityFilters.length}</Badge>
                      )}
                      <ChevronDown className="size-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-52 p-2" align="start">
                    {DATA_MODALITY_OPTIONS.map(modality => (
                      <label
                        key={modality}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={dataModalityFilters.includes(modality)}
                          onCheckedChange={() => toggleFilter(modality, dataModalityFilters, setDataModalityFilters)}
                        />
                        <span className="text-xs font-light">{modality}</span>
                      </label>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Access Platform Filter */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        "rounded-xl font-light h-8 text-xs",
                        accessPlatformFilters.length > 0 && cn(
                          scheme.from.replace("from-", "border-").replace("-500", "-300"),
                          scheme.from.replace("from-", "bg-").replace("-500", "-50")
                        )
                      )}
                    >
                      <Layers className="size-3 mr-1" />
                      Platform
                      {accessPlatformFilters.length > 0 && (
                        <Badge className="ml-1.5 h-4 px-1 text-[10px] font-light">{accessPlatformFilters.length}</Badge>
                      )}
                      <ChevronDown className="size-3 ml-1" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-40 p-2" align="start">
                    {ACCESS_PLATFORM_OPTIONS.map(platform => (
                      <label
                        key={platform}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        <Checkbox
                          checked={accessPlatformFilters.includes(platform)}
                          onCheckedChange={() => toggleFilter(platform, accessPlatformFilters, setAccessPlatformFilters)}
                        />
                        <span className="text-xs font-light">{platform}</span>
                      </label>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* Clear Filters */}
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="rounded-xl font-light h-8 text-xs text-neutral-500 hover:text-red-600"
                  >
                    <X className="size-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-3">
                {/* Results Count */}
                <div className="text-sm font-light text-neutral-600">
                  <span className="font-normal text-neutral-900">{filteredDatasets.length}</span> datasets
                </div>

                <Separator orientation="vertical" className="h-6" />

                {/* Sort */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="rounded-xl font-light h-9">
                      <ArrowUpDown className="size-3 mr-1" />
                      Sort
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="end">
                    {[
                      { value: "relevance", label: "Relevance" },
                      { value: "name", label: "Name" },
                      { value: "phase", label: "Phase" },
                      { value: "access", label: "Access Status" },
                    ].map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value as typeof sortBy)}
                        className={cn(
                          "w-full text-left px-3 py-2 rounded-lg text-sm font-light transition-colors",
                          sortBy === option.value
                            ? cn("bg-neutral-100", scheme.from.replace("from-", "text-"))
                            : "hover:bg-neutral-50"
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </PopoverContent>
                </Popover>

                {/* View Toggle */}
                <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setViewMode("cards")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "cards"
                        ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                        : "text-neutral-500 hover:bg-neutral-50"
                    )}
                  >
                    <LayoutGrid className="size-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("table")}
                    className={cn(
                      "p-2 transition-colors",
                      viewMode === "table"
                        ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                        : "text-neutral-500 hover:bg-neutral-50"
                    )}
                  >
                    <List className="size-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(hasActiveFilters || (smartFilterActive && smartFilterQuery)) && (
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="text-xs font-light text-neutral-500">Active:</span>

                {/* Smart Filter Badge - Prominent */}
                {smartFilterActive && smartFilterQuery && (
                  <Badge
                    className={cn(
                      "font-light text-xs cursor-pointer transition-colors",
                      scheme.from.replace("from-", "bg-").replace("500", "100"),
                      scheme.from.replace("from-", "text-").replace("500", "700"),
                      "hover:bg-red-50 hover:text-red-700"
                    )}
                    onClick={() => setSmartFilterActive(false)}
                  >
                    <Sparkles className="size-3 mr-1" />
                    AI: &quot;{smartFilterQuery.length > 25 ? smartFilterQuery.substring(0, 25) + '...' : smartFilterQuery}&quot;
                    <X className="size-3 ml-1.5" />
                  </Badge>
                )}

                {/* My Access Badge */}
                {myAccessOnly && (
                  <Badge
                    className="font-light text-xs cursor-pointer bg-blue-100 text-blue-700 hover:bg-red-50 hover:text-red-700"
                    onClick={() => setMyAccessOnly(false)}
                  >
                    <Shield className="size-3 mr-1" />
                    My Access Only
                    <X className="size-3 ml-1.5" />
                  </Badge>
                )}

                {/* User Criteria Badge */}
                {hasUserCriteria && (
                  <Badge
                    className="font-light text-xs cursor-pointer bg-blue-100 text-blue-700 hover:bg-red-50 hover:text-red-700"
                    onClick={clearUserCriteria}
                  >
                    <Users className="size-3 mr-1" />
                    {userCriteriaCount} users
                    <X className="size-3 ml-1.5" />
                  </Badge>
                )}

                {/* Phase Filters */}
                {phaseFilters.map(phase => (
                  <Badge
                    key={`phase-${phase}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(phase, phaseFilters, setPhaseFilters)}
                  >
                    Phase {phase}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}

                {/* Status Filters */}
                {statusFilters.map(status => (
                  <Badge
                    key={`status-${status}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(status, statusFilters, setStatusFilters)}
                  >
                    {status}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}

                {/* Therapeutic Area Filters */}
                {therapeuticAreaFilters.map(area => (
                  <Badge
                    key={`area-${area}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(area, therapeuticAreaFilters, setTherapeuticAreaFilters)}
                  >
                    {area}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}

                {/* Geography Filters */}
                {geographyFilters.map(geo => (
                  <Badge
                    key={`geo-${geo}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(geo, geographyFilters, setGeographyFilters)}
                  >
                    {geo}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}

                {/* Data Modality Filters */}
                {dataModalityFilters.map(modality => (
                  <Badge
                    key={`modality-${modality}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(modality, dataModalityFilters, setDataModalityFilters)}
                  >
                    <Microscope className="size-3 mr-1" />
                    {modality}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}

                {/* Compliance Filters */}
                {complianceFilters.map(compliance => (
                  <Badge
                    key={`compliance-${compliance}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(compliance, complianceFilters, setComplianceFilters)}
                  >
                    {compliance}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}

                {/* Sponsor Filters */}
                {sponsorFilters.map(sponsor => (
                  <Badge
                    key={`sponsor-${sponsor}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(sponsor, sponsorFilters, setSponsorFilters)}
                  >
                    {sponsor}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}

                {/* Patient Population Filters */}
                {patientPopulationFilters.map(pop => (
                  <Badge
                    key={`pop-${pop}`}
                    variant="outline"
                    className="font-light text-xs cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                    onClick={() => toggleFilter(pop, patientPopulationFilters, setPatientPopulationFilters)}
                  >
                    {PATIENT_POPULATION_OPTIONS.find(o => o.value === pop)?.label || pop}
                    <X className="size-3 ml-1" />
                  </Badge>
                ))}
              </div>
            )}

            {/* Expandable All Filters Panel */}
            <div className={cn(
              "grid transition-all duration-300 ease-out",
              filtersExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
            )}>
              <div className="overflow-hidden">
                <div className="pt-4 pb-2 border-t border-neutral-100 mt-3">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Column 1: User Access */}
                    <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <UserCheck className="size-4 text-blue-600" />
                        <h3 className="text-sm font-normal text-neutral-900">User Access</h3>
                        <Badge className="bg-blue-100 text-blue-700 text-[10px] font-light">New</Badge>
                      </div>

                      {/* My Access Only Toggle */}
                      <div className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-blue-200 mb-3">
                        <div className="flex items-center gap-2">
                          <Shield className="size-3.5 text-blue-600" />
                          <span className="text-xs font-light text-neutral-700">My access only</span>
                        </div>
                        <Switch
                          checked={myAccessOnly}
                          onCheckedChange={setMyAccessOnly}
                        />
                      </div>

                      {/* User Criteria Summary & Button */}
                      <div className="space-y-2">
                        <p className="text-[11px] font-light text-neutral-600">
                          Filter by who can access this data
                        </p>

                        {hasUserCriteria ? (
                          <div className="p-2.5 rounded-lg bg-white border border-blue-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-normal text-neutral-900">
                                {userCriteriaCount} users selected
                              </span>
                              <button
                                onClick={clearUserCriteria}
                                className="text-[10px] font-light text-red-600 hover:underline"
                              >
                                Clear
                              </button>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {userCriteriaMode === "org" && Array.from(selectedOrgs).slice(0, 2).map(orgId => {
                                const org = ORGANIZATIONS.find(o => o.id === orgId)
                                return org ? (
                                  <Badge key={orgId} variant="outline" className="text-[10px] font-light">
                                    {org.name.length > 15 ? org.name.slice(0, 15) + '...' : org.name}
                                  </Badge>
                                ) : null
                              })}
                              {userCriteriaMode === "role" && Array.from(selectedRoles).slice(0, 2).map(roleId => {
                                const role = USER_ROLES.find(r => r.id === roleId)
                                return role ? (
                                  <Badge key={roleId} variant="outline" className="text-[10px] font-light">
                                    {role.name}
                                  </Badge>
                                ) : null
                              })}
                              {userCriteriaMode === "individual" && (
                                <Badge variant="outline" className="text-[10px] font-light">
                                  {individualEmails.split(",").filter(e => e.trim()).length} emails
                                </Badge>
                              )}
                              {((userCriteriaMode === "org" && selectedOrgs.size > 2) ||
                                (userCriteriaMode === "role" && selectedRoles.size > 2)) && (
                                <Badge variant="outline" className="text-[10px] font-light">
                                  +{userCriteriaMode === "org" ? selectedOrgs.size - 2 : selectedRoles.size - 2} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        ) : null}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setUserCriteriaDialogOpen(true)}
                          className="w-full h-8 text-xs font-light rounded-lg border-blue-300 text-blue-700 hover:bg-blue-100"
                        >
                          <Users className="size-3.5 mr-1.5" />
                          {hasUserCriteria ? "Edit User Criteria" : "Define User Criteria"}
                        </Button>
                      </div>
                    </div>

                    {/* Column 2: Study Characteristics */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="size-4 text-neutral-600" />
                        <h3 className="text-sm font-normal text-neutral-900">Study Info</h3>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        {/* Phase */}
                        <div>
                          <p className="text-[11px] font-light text-neutral-500 mb-1.5">Phase</p>
                          {PHASE_OPTIONS.map(phase => (
                            <label key={phase} className="flex items-center gap-2 py-0.5 cursor-pointer">
                              <Checkbox
                                checked={phaseFilters.includes(phase)}
                                onCheckedChange={() => toggleFilter(phase, phaseFilters, setPhaseFilters)}
                              />
                              <span className="text-xs font-light">Phase {phase}</span>
                            </label>
                          ))}
                        </div>

                        {/* Status */}
                        <div>
                          <p className="text-[11px] font-light text-neutral-500 mb-1.5">Status</p>
                          {STATUS_OPTIONS.map(status => (
                            <label key={status} className="flex items-center gap-2 py-0.5 cursor-pointer">
                              <Checkbox
                                checked={statusFilters.includes(status)}
                                onCheckedChange={() => toggleFilter(status, statusFilters, setStatusFilters)}
                              />
                              <span className="text-xs font-light">{status}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Therapeutic Area */}
                      <div>
                        <p className="text-[11px] font-light text-neutral-500 mb-1.5">Therapeutic Area</p>
                        <div className="flex flex-wrap gap-1.5">
                          {THERAPEUTIC_AREAS.map(area => (
                            <label
                              key={area}
                              className={cn(
                                "px-2 py-1 rounded-md border cursor-pointer text-[11px] font-light transition-colors",
                                therapeuticAreaFilters.includes(area)
                                  ? cn(scheme.from.replace("from-", "bg-").replace("-500", "-100"), scheme.from.replace("from-", "border-").replace("-500", "-300"))
                                  : "border-neutral-200 hover:bg-neutral-50"
                              )}
                              onClick={() => toggleFilter(area, therapeuticAreaFilters, setTherapeuticAreaFilters)}
                            >
                              {area}
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Geography */}
                      <div>
                        <p className="text-[11px] font-light text-neutral-500 mb-1.5">Geography</p>
                        <div className="flex flex-wrap gap-1.5">
                          {GEOGRAPHY_OPTIONS.map(geo => (
                            <label
                              key={geo}
                              className={cn(
                                "px-2 py-1 rounded-md border cursor-pointer text-[11px] font-light transition-colors",
                                geographyFilters.includes(geo)
                                  ? cn(scheme.from.replace("from-", "bg-").replace("-500", "-100"), scheme.from.replace("from-", "border-").replace("-500", "-300"))
                                  : "border-neutral-200 hover:bg-neutral-50"
                              )}
                              onClick={() => toggleFilter(geo, geographyFilters, setGeographyFilters)}
                            >
                              {geo}
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Data & Compliance */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Microscope className="size-4 text-neutral-600" />
                        <h3 className="text-sm font-normal text-neutral-900">Data & Compliance</h3>
                      </div>

                      {/* Data Modality */}
                      <div>
                        <p className="text-[11px] font-light text-neutral-500 mb-1.5">Data Modality</p>
                        <div className="space-y-0.5">
                          {DATA_MODALITY_OPTIONS.map(modality => (
                            <label key={modality} className="flex items-center gap-2 py-0.5 cursor-pointer">
                              <Checkbox
                                checked={dataModalityFilters.includes(modality)}
                                onCheckedChange={() => toggleFilter(modality, dataModalityFilters, setDataModalityFilters)}
                              />
                              <span className="text-xs font-light">{modality}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Study Sponsor */}
                      <div>
                        <p className="text-[11px] font-light text-neutral-500 mb-1.5">Study Run By</p>
                        <div className="space-y-0.5">
                          {STUDY_SPONSOR_OPTIONS.map(sponsor => (
                            <label key={sponsor} className="flex items-center gap-2 py-0.5 cursor-pointer">
                              <Checkbox
                                checked={sponsorFilters.includes(sponsor)}
                                onCheckedChange={() => toggleFilter(sponsor, sponsorFilters, setSponsorFilters)}
                              />
                              <span className="text-xs font-light">{sponsor}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Column 4: Usage & Population */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="size-4 text-neutral-600" />
                        <h3 className="text-sm font-normal text-neutral-900">Usage & Population</h3>
                      </div>

                      {/* Compliance */}
                      <div>
                        <p className="text-[11px] font-light text-neutral-500 mb-1.5">Usage Rights</p>
                        <div className="space-y-0.5">
                          {COMPLIANCE_OPTIONS.map(option => (
                            <label key={option} className="flex items-center gap-2 py-0.5 cursor-pointer">
                              <Checkbox
                                checked={complianceFilters.includes(option)}
                                onCheckedChange={() => toggleFilter(option, complianceFilters, setComplianceFilters)}
                              />
                              <span className="text-xs font-light">{option}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Patient Population */}
                      <div>
                        <p className="text-[11px] font-light text-neutral-500 mb-1.5">Patient Population</p>
                        <div className="space-y-0.5">
                          {PATIENT_POPULATION_OPTIONS.map(option => (
                            <label key={option.value} className="flex items-center gap-2 py-0.5 cursor-pointer">
                              <Checkbox
                                checked={patientPopulationFilters.includes(option.value)}
                                onCheckedChange={() => toggleFilter(option.value, patientPopulationFilters, setPatientPopulationFilters)}
                              />
                              <span className="text-xs font-light">{option.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Clear All Button */}
                      {hasActiveFilters && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearAllFilters}
                          className="w-full rounded-lg font-light text-xs h-8 text-red-600 border-red-200 hover:bg-red-50"
                        >
                          <X className="size-3 mr-1.5" />
                          Clear All Filters
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results List */}
          <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <p className="text-sm font-light text-neutral-600">
                  Showing <span className="font-normal text-neutral-900">{filteredDatasets.length}</span> datasets
                </p>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-0.5 text-xs text-neutral-400">
                  <span className="mr-1">Select</span>
                  <button
                    onClick={selectAll}
                    className="px-1.5 py-0.5 rounded hover:bg-neutral-100 text-neutral-600 hover:text-neutral-900 transition-colors"
                  >
                    All
                  </button>
                  <span>·</span>
                  <button
                    onClick={selectAllOpen}
                    className="px-1.5 py-0.5 rounded hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    Open
                  </button>
                  <span>·</span>
                  <button
                    onClick={selectAllReady}
                    className="px-1.5 py-0.5 rounded hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Policy
                  </button>
                </div>
                {selectedDatasets.size > 0 && (
                  <>
                    <Separator orientation="vertical" className="h-4" />
                    <span className="text-xs font-medium text-neutral-700">
                      {selectedDatasets.size} selected
                    </span>
                    <button
                      onClick={clearSelection}
                      className="text-xs text-neutral-400 hover:text-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Results Grid/Table */}
            {viewMode === "cards" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredDatasets.map(dataset => (
                  <DatasetCardFlat
                    key={dataset.id}
                    dataset={dataset}
                    selected={selectedDatasets.has(dataset.id)}
                    onToggle={() => toggleDataset(dataset.id)}
                    scheme={scheme}
                  />
                ))}
              </div>
            ) : (
              <DatasetTableFlat
                datasets={filteredDatasets}
                selectedDatasets={selectedDatasets}
                onToggle={toggleDataset}
                scheme={scheme}
              />
            )}
          </div>

          {/* Empty State */}
          {filteredDatasets.length === 0 && (
            <div className="text-center py-16">
              <Database className="size-16 text-neutral-300 mx-auto mb-4" />
              <h3 className="text-lg font-light text-neutral-700 mb-2">No datasets match your filters</h3>
              <p className="text-sm font-light text-neutral-500 mb-4">
                Try adjusting your filters or search criteria
              </p>
              <Button
                variant="outline"
                onClick={clearAllFilters}
                className="rounded-xl font-light"
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Sticky Selection Footer */}
      {selectedDatasets.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-lg font-normal text-neutral-900">
                    {selectedDatasets.size} dataset{selectedDatasets.size !== 1 ? 's' : ''} selected
                  </p>
                  <p className="text-xs font-light text-neutral-500">
                    Ready to request access
                  </p>
                </div>

                {/* Access Breakdown */}
                {selectionStats && (
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-48 h-2.5 rounded-full overflow-hidden bg-neutral-100 flex">
                        <div
                          className="bg-emerald-500"
                          style={{ width: `${selectionStats.alreadyOpen}%` }}
                        />
                        <div
                          className={cn("bg-gradient-to-r", scheme.from, scheme.to)}
                          style={{ width: `${selectionStats.readyToGrant}%` }}
                        />
                        <div
                          className="bg-amber-500"
                          style={{ width: `${selectionStats.needsApproval}%` }}
                        />
                        <div
                          className="bg-neutral-400"
                          style={{ width: `${selectionStats.missingLocation}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-xs font-light">
                      <span className="text-emerald-700">{selectionStats.alreadyOpen}% open</span>
                      <span className={scheme.from.replace("from-", "text-")}>{selectionStats.readyToGrant}% ready</span>
                      <span className="text-amber-700">{selectionStats.needsApproval}% approval</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={clearSelection}
                  className="rounded-xl font-light"
                >
                  Clear Selection
                </Button>
                <Button
                  onClick={handleRequestAccess}
                  className={cn(
                    "rounded-xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all px-6",
                    scheme.from,
                    scheme.to
                  )}
                >
                  <Shield className="size-4 mr-2" />
                  Request Access
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Criteria Dialog */}
      <Dialog open={userCriteriaDialogOpen} onOpenChange={setUserCriteriaDialogOpen}>
        <DialogContent className="sm:max-w-[700px] p-0 gap-0">
          <DialogHeader className="p-6 pb-4 border-b border-neutral-100">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-xl bg-gradient-to-br",
                scheme.bg
              )}>
                <Users className={cn("size-5", scheme.from.replace("from-", "text-"))} />
              </div>
              <div>
                <DialogTitle className="text-xl font-light text-neutral-900">User Access Criteria</DialogTitle>
                <DialogDescription className="text-sm font-light">
                  Filter datasets by who can access them
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-6">
            {/* Assignment Mode Tabs */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setUserCriteriaMode("org")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl border-2 text-sm font-light transition-all",
                  userCriteriaMode === "org"
                    ? cn("border-current bg-gradient-to-r", scheme.bg, scheme.bgHover)
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                )}
              >
                <Building2 className="size-4 mx-auto mb-1" />
                Organization
              </button>
              <button
                onClick={() => setUserCriteriaMode("role")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl border-2 text-sm font-light transition-all",
                  userCriteriaMode === "role"
                    ? cn("border-current bg-gradient-to-r", scheme.bg, scheme.bgHover)
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                )}
              >
                <UserCheck className="size-4 mx-auto mb-1" />
                Role-based
              </button>
              <button
                onClick={() => setUserCriteriaMode("individual")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-xl border-2 text-sm font-light transition-all",
                  userCriteriaMode === "individual"
                    ? cn("border-current bg-gradient-to-r", scheme.bg, scheme.bgHover)
                    : "border-neutral-200 bg-white hover:border-neutral-300"
                )}
              >
                <IdCard className="size-4 mx-auto mb-1" />
                Individual
              </button>
            </div>

            {/* Organization-based */}
            {userCriteriaMode === "org" && (
              <div className="space-y-2 max-h-[320px] overflow-y-auto">
                <p className="text-sm font-light text-neutral-600 mb-3">
                  Show datasets accessible to selected organizations:
                </p>
                {ORGANIZATIONS.map((org) => (
                  <div
                    key={org.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleOrg(org.id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleOrg(org.id); } }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer",
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
                  </div>
                ))}
              </div>
            )}

            {/* Role-based */}
            {userCriteriaMode === "role" && (
              <div className="space-y-2 max-h-[320px] overflow-y-auto">
                <p className="text-sm font-light text-neutral-600 mb-3">
                  Show datasets accessible to selected roles:
                </p>
                {USER_ROLES.map((role) => (
                  <div
                    key={role.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleRole(role.id)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleRole(role.id); } }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border-2 transition-all cursor-pointer",
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
                  </div>
                ))}
              </div>
            )}

            {/* Individual emails */}
            {userCriteriaMode === "individual" && (
              <div>
                <p className="text-sm font-light text-neutral-600 mb-3">
                  Enter email addresses (comma-separated) to check their access:
                </p>
                <Textarea
                  value={individualEmails}
                  onChange={(e) => setIndividualEmails(e.target.value)}
                  placeholder="john.smith@company.com, sarah.jones@company.com"
                  className="border-neutral-200 rounded-xl font-light min-h-[150px] text-sm"
                />
                <div className="mt-3 flex flex-wrap gap-1">
                  <span className="text-xs font-light text-neutral-500">Quick add:</span>
                  {TEAM_MEMBERS.slice(0, 4).map(member => (
                    <button
                      key={member.email}
                      onClick={() => {
                        const emails = individualEmails.split(",").map(e => e.trim()).filter(Boolean)
                        if (!emails.includes(member.email)) {
                          setIndividualEmails(emails.length > 0 ? `${individualEmails}, ${member.email}` : member.email)
                        }
                      }}
                      className="text-xs font-light px-2 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition-colors"
                    >
                      {member.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 pt-4 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className={cn("size-5", scheme.from.replace("from-", "text-"))} />
              <span className="text-lg font-light text-neutral-900">{userCriteriaCount}</span>
              <span className="text-sm font-light text-neutral-600">users targeted</span>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  clearUserCriteria()
                  setUserCriteriaDialogOpen(false)
                }}
                className="rounded-xl font-light"
              >
                Clear
              </Button>
              <Button
                onClick={() => setUserCriteriaDialogOpen(false)}
                className={cn(
                  "rounded-xl font-light bg-gradient-to-r text-white",
                  scheme.from,
                  scheme.to
                )}
              >
                Apply Filter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Dataset Card Component
function DatasetCard({
  dataset,
  selected,
  onToggle,
  scheme,
  group
}: {
  dataset: typeof MOCK_DATASETS[0]
  selected: boolean
  onToggle: () => void
  scheme: ReturnType<typeof useColorScheme>["scheme"]
  group: typeof ACCESS_GROUPS[0]
}) {
  return (
    <Card className={cn(
      "border-2 rounded-xl overflow-hidden transition-all cursor-pointer group hover:shadow-lg",
      selected
        ? cn(scheme.from.replace("from-", "border-").replace("-500", "-300"), "ring-2 ring-offset-1", scheme.from.replace("from-", "ring-").replace("-500", "-200"))
        : "border-neutral-200 hover:border-neutral-300"
    )}
    onClick={onToggle}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="font-mono text-xs shrink-0">
                {dataset.code}
              </Badge>
              <Badge className={cn(
                "text-xs font-light shrink-0",
                dataset.status === "Closed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
              )}>
                {dataset.status}
              </Badge>
            </div>
            <h4 className="text-sm font-normal text-neutral-900 line-clamp-2 mb-1">
              {dataset.name}
            </h4>
            <p className="text-xs font-light text-neutral-500">
              Phase {dataset.phase} · {dataset.patientCount.toLocaleString()} patients
            </p>
          </div>
          <Checkbox
            checked={selected}
            onCheckedChange={onToggle}
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 ml-2"
          />
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-3">
          {dataset.therapeuticArea.slice(0, 2).map(ta => (
            <Badge key={ta} variant="outline" className="text-xs font-light border-neutral-200">
              {ta}
            </Badge>
          ))}
          {dataset.geography.slice(0, 2).map(geo => (
            <Badge key={geo} variant="outline" className="text-xs font-light border-neutral-200">
              {geo}
            </Badge>
          ))}
        </div>

        {/* Access Breakdown Bar */}
        <div className="space-y-1">
          <div className="flex h-1.5 rounded-full overflow-hidden bg-neutral-100">
            <div
              className="bg-emerald-500"
              style={{ width: `${dataset.accessBreakdown.alreadyOpen}%` }}
            />
            <div
              className={cn("bg-gradient-to-r", scheme.from, scheme.to)}
              style={{ width: `${dataset.accessBreakdown.readyToGrant}%` }}
            />
            <div
              className="bg-amber-500"
              style={{ width: `${dataset.accessBreakdown.needsApproval}%` }}
            />
            <div
              className="bg-neutral-400"
              style={{ width: `${dataset.accessBreakdown.missingLocation}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs font-light text-neutral-500">
            <span>{dataset.accessBreakdown.alreadyOpen + dataset.accessBreakdown.readyToGrant}% instant</span>
            <span>{dataset.accessBreakdown.needsApproval}% approval</span>
          </div>
        </div>

        {/* Bundling Hint */}
        {dataset.frequentlyBundledWith && dataset.frequentlyBundledWith.length > 0 && (
          <div className="mt-3 pt-3 border-t border-neutral-100">
            <div className="flex items-center gap-1 text-xs font-light text-neutral-500">
              <Sparkles className="size-3" />
              <span>Often bundled with:</span>
              {dataset.frequentlyBundledWith.slice(0, 2).map(code => (
                <Badge key={code} variant="outline" className="text-xs font-light font-mono">
                  {code}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Dataset Table Component
function DatasetTable({
  datasets,
  selectedDatasets,
  onToggle,
  scheme,
  group
}: {
  datasets: typeof MOCK_DATASETS
  selectedDatasets: Set<string>
  onToggle: (id: string) => void
  scheme: ReturnType<typeof useColorScheme>["scheme"]
  group: typeof ACCESS_GROUPS[0]
}) {
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden mt-2">
      <table className="w-full">
        <thead className="bg-neutral-50">
          <tr className="border-b border-neutral-200">
            <th className="text-left p-3 w-12"></th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Code</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Name</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Phase</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Status</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Area</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Patients</th>
            <th className="text-left p-3 text-xs font-normal text-neutral-600 uppercase tracking-wider">Access</th>
          </tr>
        </thead>
        <tbody>
          {datasets.map(dataset => (
            <tr
              key={dataset.id}
              className={cn(
                "border-b border-neutral-100 hover:bg-neutral-50 transition-colors cursor-pointer",
                selectedDatasets.has(dataset.id) && "bg-blue-50/50"
              )}
              onClick={() => onToggle(dataset.id)}
            >
              <td className="p-3">
                <Checkbox
                  checked={selectedDatasets.has(dataset.id)}
                  onCheckedChange={() => onToggle(dataset.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
              <td className="p-3">
                <Badge variant="outline" className="font-mono text-xs">
                  {dataset.code}
                </Badge>
              </td>
              <td className="p-3">
                <span className="text-sm font-light text-neutral-900 line-clamp-1">{dataset.name}</span>
              </td>
              <td className="p-3">
                <Badge className="text-xs font-light bg-blue-100 text-blue-700">
                  {dataset.phase}
                </Badge>
              </td>
              <td className="p-3">
                <Badge className={cn(
                  "text-xs font-light",
                  dataset.status === "Closed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                )}>
                  {dataset.status}
                </Badge>
              </td>
              <td className="p-3">
                <span className="text-xs font-light text-neutral-600">
                  {dataset.therapeuticArea.slice(0, 2).join(", ")}
                </span>
              </td>
              <td className="p-3">
                <span className="text-xs font-light text-neutral-600">
                  {dataset.patientCount.toLocaleString()}
                </span>
              </td>
              <td className="p-3">
                <div className="flex h-1.5 w-20 rounded-full overflow-hidden bg-neutral-100">
                  <div
                    className="bg-emerald-500"
                    style={{ width: `${dataset.accessBreakdown.alreadyOpen}%` }}
                  />
                  <div
                    className={cn("bg-gradient-to-r", scheme.from, scheme.to)}
                    style={{ width: `${dataset.accessBreakdown.readyToGrant}%` }}
                  />
                  <div
                    className="bg-amber-500"
                    style={{ width: `${dataset.accessBreakdown.needsApproval}%` }}
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Flat Dataset Card Component (no grouping)
// Platform icon helper
const getPlatformIcon = (platform: string) => {
  switch (platform) {
    case "Domino": return "🎯"
    case "SCP": return "☁️"
    case "AIBench": return "🤖"
    default: return "📊"
  }
}

// Dataset Preview Popover Component
function DatasetPreviewPopover({
  dataset,
  children,
}: {
  dataset: typeof MOCK_DATASETS[0]
  children: React.ReactNode
}) {
  const meta = dataset.clinicalMetadata

  return (
    <Popover>
      <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
        {children}
      </PopoverTrigger>
      <PopoverContent
        side="right"
        align="start"
        className="w-96 p-0"
        collisionPadding={16}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-4 py-2.5 border-b border-neutral-100 bg-neutral-50/50">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline" className="font-mono text-xs">
              {dataset.code}
            </Badge>
            {meta?.nctNumber && (
              <Badge variant="outline" className="text-xs font-light text-neutral-600">
                {meta.nctNumber}
              </Badge>
            )}
          </div>
          <h3 className="text-sm font-medium text-neutral-900 leading-snug">
            {dataset.name}
          </h3>
        </div>

        {/* Description */}
        {dataset.description && (
          <div className="px-4 py-2 border-b border-neutral-100">
            <p className="text-xs font-light text-neutral-600 leading-relaxed">
              {dataset.description}
            </p>
          </div>
        )}

        {/* Study Details */}
        {meta && (
          <div className="px-4 py-2 space-y-2.5 border-b border-neutral-100">
            {meta.studyDesign && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <FlaskConical className="size-3.5 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-700">Study Design</span>
                </div>
                <p className="text-xs font-light text-neutral-600 pl-5">{meta.studyDesign}</p>
              </div>
            )}

            {meta.primaryEndpoint && (
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <Target className="size-3.5 text-neutral-400" />
                  <span className="text-xs font-medium text-neutral-700">Primary Endpoint</span>
                </div>
                <p className="text-xs font-light text-neutral-600 pl-5">{meta.primaryEndpoint}</p>
              </div>
            )}

            {meta.principalInvestigator && (
              <div className="flex items-center gap-1.5">
                <User className="size-3.5 text-neutral-400" />
                <span className="text-xs text-neutral-600">
                  <span className="font-medium">PI:</span>{" "}
                  <span className="font-light">{meta.principalInvestigator}</span>
                </span>
              </div>
            )}

            {meta.sponsor && (
              <div className="flex items-center gap-1.5">
                <Building2 className="size-3.5 text-neutral-400" />
                <span className="text-xs text-neutral-600">
                  <span className="font-medium">Sponsor:</span>{" "}
                  <span className="font-light">{meta.sponsor}</span>
                </span>
              </div>
            )}
          </div>
        )}

        {/* Timeline */}
        {meta && (meta.enrollmentStartDate || meta.studyLockDate) && (
          <div className="px-4 py-2 border-b border-neutral-100">
            <div className="grid grid-cols-2 gap-4">
              {meta.enrollmentStartDate && (
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Calendar className="size-3 text-neutral-400" />
                    <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">Enrollment Start</span>
                  </div>
                  <span className="text-xs font-light text-neutral-700 pl-4">{meta.enrollmentStartDate}</span>
                </div>
              )}
              {meta.studyLockDate && (
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <Lock className="size-3 text-neutral-400" />
                    <span className="text-[10px] font-medium text-neutral-500 uppercase tracking-wide">Data Lock</span>
                  </div>
                  <span className="text-xs font-light text-neutral-700 pl-4">{meta.studyLockDate}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Status Badges */}
        {meta && (
          <div className="px-4 py-2 border-b border-neutral-100">
            <div className="flex flex-wrap gap-1.5">
              {meta.enrollmentStatus && (
                <Badge className={cn(
                  "text-xs font-light",
                  meta.enrollmentStatus === "Completed" ? "bg-emerald-100 text-emerald-700" :
                  meta.enrollmentStatus === "Ongoing" ? "bg-blue-100 text-blue-700" :
                  meta.enrollmentStatus === "Recruiting" ? "bg-purple-100 text-purple-700" :
                  "bg-red-100 text-red-700"
                )}>
                  {meta.enrollmentStatus}
                </Badge>
              )}
              {meta.dataLockStatus && (
                <Badge className={cn(
                  "text-xs font-light",
                  meta.dataLockStatus === "Locked" ? "bg-neutral-100 text-neutral-700" :
                  meta.dataLockStatus === "Interim" ? "bg-amber-100 text-amber-700" :
                  "bg-blue-100 text-blue-700"
                )}>
                  {meta.dataLockStatus === "Locked" ? "Data Locked" : meta.dataLockStatus}
                </Badge>
              )}
              {meta.protocolVersion && (
                <Badge variant="outline" className="text-xs font-light">
                  Protocol {meta.protocolVersion}
                </Badge>
              )}
              {meta.blindingType && (
                <Badge variant="outline" className="text-xs font-light">
                  {meta.blindingType}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Enrollment Stats */}
        {meta && (meta.numberOfSites || meta.actualEnrollment || meta.treatmentArms) && (
          <div className="px-4 py-2 border-b border-neutral-100">
            <div className="flex items-center justify-between text-xs text-neutral-600">
              {meta.numberOfSites && (
                <span className="font-light">
                  <span className="font-medium">{meta.numberOfSites}</span> sites
                </span>
              )}
              {meta.actualEnrollment && (
                <span className="font-light">
                  <span className="font-medium">{meta.actualEnrollment.toLocaleString()}</span> enrolled
                </span>
              )}
              {meta.treatmentArms && (
                <span className="font-light">
                  <span className="font-medium">{meta.treatmentArms.length}</span> arms
                </span>
              )}
            </div>
          </div>
        )}

        {/* Child Datasets */}
        {dataset.childDatasets && dataset.childDatasets.length > 0 && (
          <div className="px-4 py-2">
            <div className="flex items-center gap-1.5 mb-2">
              <Layers className="size-3.5 text-neutral-400" />
              <span className="text-xs font-medium text-neutral-700">
                Child Datasets ({dataset.childDatasets.length})
              </span>
            </div>
            <div className="space-y-1.5 pl-5">
              {dataset.childDatasets.map((child) => (
                <div key={child.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span className="font-mono text-[10px] text-neutral-500 shrink-0">{child.code}</span>
                    <span className="text-xs font-light text-neutral-600 truncate">{child.name}</span>
                  </div>
                  <Badge className={cn(
                    "text-[10px] font-light shrink-0",
                    child.accessStatus === "open" ? "bg-emerald-100 text-emerald-700" :
                    child.accessStatus === "ready" ? "bg-blue-100 text-blue-700" :
                    child.accessStatus === "approval" ? "bg-amber-100 text-amber-700" :
                    "bg-neutral-100 text-neutral-600"
                  )}>
                    {child.accessStatus === "open" ? "Open" :
                     child.accessStatus === "ready" ? "Policy" :
                     child.accessStatus === "approval" ? "Approval" :
                     "Missing"}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}

function DatasetCardFlat({
  dataset,
  selected,
  onToggle,
  scheme,
}: {
  dataset: typeof MOCK_DATASETS[0]
  selected: boolean
  onToggle: () => void
  scheme: ReturnType<typeof useColorScheme>["scheme"]
}) {
  const { alreadyOpen, readyToGrant, needsApproval, missingLocation } = dataset.accessBreakdown

  // Pre-flight access hint based on breakdown
  const getAccessHint = () => {
    if (alreadyOpen >= 80) return { label: "Ready for you", color: "emerald", icon: "⚡" }
    if (readyToGrant >= 50) return { label: "~1 week", color: "blue", icon: "🕐" }
    if (needsApproval >= 50) return { label: "~2 weeks", color: "amber", icon: "🕐" }
    if (dataset.aotMetadata?.restrictML || dataset.aotMetadata?.restrictPublication) {
      return { label: "May have restrictions", color: "red", icon: "⚠️" }
    }
    return null
  }
  const accessHint = getAccessHint()

  return (
    <Card className={cn(
      "border rounded-xl overflow-hidden transition-all cursor-pointer group hover:shadow-md relative",
      selected
        ? cn(
            scheme.from.replace("from-", "bg-").replace("-500", "-50"),
            scheme.from.replace("from-", "border-").replace("-500", "-200")
          )
        : "border-neutral-200 hover:border-neutral-300 bg-white"
    )}
    onClick={onToggle}
    >
      {/* Pre-flight Access Hint Badge */}
      {accessHint && (
        <div className={cn(
          "absolute top-2 right-12 px-1.5 py-0.5 rounded text-[10px] font-light flex items-center gap-1",
          accessHint.color === "emerald" && "bg-emerald-100 text-emerald-700",
          accessHint.color === "blue" && "bg-blue-100 text-blue-700",
          accessHint.color === "amber" && "bg-amber-100 text-amber-700",
          accessHint.color === "red" && "bg-red-100 text-red-600"
        )}>
          <span>{accessHint.icon}</span>
          {accessHint.label}
        </div>
      )}

      <CardContent className="p-4">
        {/* Top Row: Code, Platform, Status, Eye + Checkbox */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono text-xs">
              {dataset.code}
            </Badge>
            <Badge variant="outline" className="text-xs font-light gap-1">
              <span>{getPlatformIcon(dataset.accessPlatform)}</span>
              {dataset.accessPlatform}
            </Badge>
            <Badge className={cn(
              "text-xs font-light",
              dataset.status === "Closed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
            )}>
              {dataset.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <DatasetPreviewPopover dataset={dataset}>
              <button
                className="p-1 rounded hover:bg-neutral-100 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="size-4 text-neutral-400 hover:text-neutral-600" strokeWidth={1.5} />
              </button>
            </DatasetPreviewPopover>
            <Checkbox
              checked={selected}
              onCheckedChange={onToggle}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>

        {/* Title */}
        <h4 className="text-sm font-normal text-neutral-900 line-clamp-2 mb-2">
          {dataset.name}
        </h4>

        {/* Meta info with icons */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <Microscope className="size-3.5 text-neutral-400" />
            <span className="font-light">Phase {dataset.phase}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <Users className="size-3.5 text-neutral-400" />
            <span className="font-light">{dataset.patientCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-neutral-600">
            <Globe className="size-3.5 text-neutral-400" />
            <span className="font-light">{dataset.geography.slice(0, 2).join(", ")}</span>
          </div>
        </div>

        {/* Data layers */}
        <div className="flex items-center gap-1.5 mb-3">
          <Database className="size-3.5 text-neutral-400" />
          <div className="flex gap-1">
            {dataset.dataLayer.map(layer => (
              <Badge key={layer} variant="outline" className="text-[10px] font-light h-5 px-1.5 border-neutral-200">
                {layer}
              </Badge>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {dataset.therapeuticArea.slice(0, 2).map(ta => (
            <Badge key={ta} variant="outline" className="text-xs font-light border-neutral-200 bg-neutral-50">
              {ta}
            </Badge>
          ))}
        </div>

        {/* Access RAG Bar */}
        <div className="space-y-1">
          <div className="flex h-1.5 rounded-full overflow-hidden bg-neutral-100">
            <div
              className="bg-green-500"
              style={{ width: `${alreadyOpen}%` }}
            />
            <div
              className={cn("bg-gradient-to-r", scheme.from, scheme.to)}
              style={{ width: `${readyToGrant}%` }}
            />
            <div
              className="bg-amber-500"
              style={{ width: `${needsApproval}%` }}
            />
            <div
              className="bg-neutral-400"
              style={{ width: `${missingLocation}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[10px] font-light text-neutral-500">
            <span>{alreadyOpen}% open</span>
            <span>{readyToGrant}% ready</span>
            <span>{needsApproval}% approval</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Flat Dataset Table Component (no grouping)
function DatasetTableFlat({
  datasets,
  selectedDatasets,
  onToggle,
  scheme,
}: {
  datasets: typeof MOCK_DATASETS
  selectedDatasets: Set<string>
  onToggle: (id: string) => void
  scheme: ReturnType<typeof useColorScheme>["scheme"]
}) {
  return (
    <div className="border border-neutral-200 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            <th className="p-3 text-left text-xs font-normal text-neutral-600 w-10"></th>
            <th className="p-3 text-left text-xs font-normal text-neutral-600">Study</th>
            <th className="p-3 text-left text-xs font-normal text-neutral-600">Name</th>
            <th className="p-3 text-left text-xs font-normal text-neutral-600">Platform</th>
            <th className="p-3 text-left text-xs font-normal text-neutral-600">Phase</th>
            <th className="p-3 text-left text-xs font-normal text-neutral-600">Patients</th>
            <th className="p-3 text-left text-xs font-normal text-neutral-600 w-44">Access Breakdown</th>
          </tr>
        </thead>
        <tbody>
          {datasets.map((dataset, index) => {
            const { alreadyOpen, readyToGrant, needsApproval, missingLocation } = dataset.accessBreakdown
            return (
              <tr
                key={dataset.id}
                className={cn(
                  "border-b border-neutral-100 cursor-pointer transition-colors",
                  selectedDatasets.has(dataset.id)
                    ? scheme.from.replace("from-", "bg-").replace("-500", "-50")
                    : "hover:bg-neutral-50",
                  index === datasets.length - 1 && "border-b-0"
                )}
                onClick={() => onToggle(dataset.id)}
              >
                <td className="p-3">
                  <Checkbox
                    checked={selectedDatasets.has(dataset.id)}
                    onCheckedChange={() => onToggle(dataset.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>
                <td className="p-3">
                  <Badge variant="outline" className="font-mono text-xs">
                    {dataset.code}
                  </Badge>
                </td>
                <td className="p-3 max-w-[280px]">
                  <span className="text-sm font-light text-neutral-900 line-clamp-1">{dataset.name}</span>
                </td>
                <td className="p-3">
                  <Badge variant="outline" className="text-xs font-light gap-1">
                    <span>{getPlatformIcon(dataset.accessPlatform)}</span>
                    {dataset.accessPlatform}
                  </Badge>
                </td>
                <td className="p-3">
                  <span className="text-xs font-light text-neutral-700">
                    {dataset.phase}
                  </span>
                </td>
                <td className="p-3">
                  <span className="text-xs font-light text-neutral-600">
                    {dataset.patientCount.toLocaleString()}
                  </span>
                </td>
                <td className="p-3">
                  <div className="space-y-1 min-w-[140px]">
                    <div className="flex h-1.5 rounded-full overflow-hidden bg-neutral-100">
                      <div className="bg-green-500" style={{ width: `${alreadyOpen}%` }} />
                      <div className={cn("bg-gradient-to-r", scheme.from, scheme.to)} style={{ width: `${readyToGrant}%` }} />
                      <div className="bg-amber-500" style={{ width: `${needsApproval}%` }} />
                      <div className="bg-neutral-400" style={{ width: `${missingLocation}%` }} />
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-light text-neutral-500">
                      <span>{alreadyOpen}% open</span>
                      <span>{readyToGrant}% ready</span>
                      <span>{needsApproval}% approval</span>
                    </div>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

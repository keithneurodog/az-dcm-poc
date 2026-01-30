"use client"

import { useEffect, useState, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { useWorkspace } from "../layout"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  ArrowLeft,
  Sliders,
  Database,
  ChevronDown,
  Layers,
  Globe,
  Building,
  Users,
  Zap,
  Sparkles,
  X,
  Check,
  FileText,
  Shield,
  Target,
  Microscope,
  CheckCircle2,
  Clock,
  HelpCircle,
  Plus,
  Lock,
  MapPin,
  ShieldCheck,
  FileSearch,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Settings2,
  Trash2,
  Loader2,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { getEnrichedDatasets, DatasetWithROAMFields } from "@/lib/dcm-mock-data"

export default function WorkspaceDatasetsPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const workspace = useWorkspace()

  // All datasets with ROAM fields enriched
  const allDatasets = useMemo(() => getEnrichedDatasets(), [])

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [phaseFilters, setPhaseFilters] = useState<string[]>([])
  const [statusFilters, setStatusFilters] = useState<string[]>([])
  const [geographyFilters, setGeographyFilters] = useState<string[]>([])
  const [therapeuticFilters, setTherapeuticFilters] = useState<string[]>([])
  const [modalityFilters, setModalityFilters] = useState<string[]>([])
  const [sponsorFilters, setSponsorFilters] = useState<string[]>([])
  const [sharingFilters, setSharingFilters] = useState<string[]>([])
  const [nctIdentifier, setNctIdentifier] = useState("")
  const [eudraCTIdentifier, setEudraCTIdentifier] = useState("")

  // New ROAM-specific filters
  const [isLockedFilter, setIsLockedFilter] = useState<boolean | null>(null) // null = all, true = locked only, false = unlocked only
  const [dataProductRightsFilters, setDataProductRightsFilters] = useState<string[]>([])
  const [dataAvailabilityFilters, setDataAvailabilityFilters] = useState<string[]>([])
  const [complianceStatusFilters, setComplianceStatusFilters] = useState<string[]>([])

  // Local selected datasets (synced with workspace context)
  const [localSelectedDatasets, setLocalSelectedDatasets] = useState<DatasetWithROAMFields[]>([])

  // Refine selection modal state
  const [refineModalOpen, setRefineModalOpen] = useState(false)
  const [refineSelection, setRefineSelection] = useState<DatasetWithROAMFields[]>([])
  const [refineFilter, setRefineFilter] = useState("")
  const [refineSortField, setRefineSortField] = useState<"code" | "name" | "phase" | "status" | "patientCount" | "therapeuticArea" | "geography" | "modalities" | "dataAvailability" | "isLocked" | "dataProductRights">("code")
  const [refineSortDirection, setRefineSortDirection] = useState<"asc" | "desc">("asc")

  // Smart filter state
  const [smartFilterInput, setSmartFilterInput] = useState("")
  const [smartFilterActive, setSmartFilterActive] = useState(false)
  const [smartFilterQuery, setSmartFilterQuery] = useState("")
  const [isSmartFiltering, setIsSmartFiltering] = useState(false)
  const [showSmartInput, setShowSmartInput] = useState(false)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)

  // Open refine modal and copy current selection
  const openRefineModal = () => {
    setRefineSelection([...localSelectedDatasets])
    setRefineFilter("")
    setRefineModalOpen(true)
  }

  // Sort refine selection
  // Filter and sort refine selection
  const filteredAndSortedRefineSelection = useMemo(() => {
    // First filter by search text
    let filtered = refineSelection
    if (refineFilter.trim()) {
      const query = refineFilter.toLowerCase()
      filtered = refineSelection.filter(d =>
        d.code.toLowerCase().includes(query) ||
        d.name.toLowerCase().includes(query)
      )
    }

    // Then sort
    return filtered.sort((a, b) => {
      let comparison = 0
      switch (refineSortField) {
        case "code":
          comparison = a.code.localeCompare(b.code)
          break
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "phase":
          comparison = a.phase.localeCompare(b.phase)
          break
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        case "patientCount":
          comparison = a.patientCount - b.patientCount
          break
        case "therapeuticArea":
          comparison = a.therapeuticArea[0]?.localeCompare(b.therapeuticArea[0] || "") || 0
          break
        case "geography":
          comparison = a.geography[0]?.localeCompare(b.geography[0] || "") || 0
          break
        case "modalities":
          comparison = a.modalities[0]?.localeCompare(b.modalities[0] || "") || 0
          break
        case "dataAvailability":
          comparison = a.dataAvailability.localeCompare(b.dataAvailability)
          break
        case "isLocked":
          comparison = (a.isLocked ? 1 : 0) - (b.isLocked ? 1 : 0)
          break
        case "dataProductRights":
          comparison = a.dataProductRights.localeCompare(b.dataProductRights)
          break
      }
      return refineSortDirection === "asc" ? comparison : -comparison
    })
  }, [refineSelection, refineFilter, refineSortField, refineSortDirection])

  // Toggle sort
  const toggleSort = (field: typeof refineSortField) => {
    if (refineSortField === field) {
      setRefineSortDirection(refineSortDirection === "asc" ? "desc" : "asc")
    } else {
      setRefineSortField(field)
      setRefineSortDirection("asc")
    }
  }

  // Remove from refine selection
  const removeFromRefineSelection = (datasetId: string) => {
    setRefineSelection(refineSelection.filter(d => d.id !== datasetId))
  }

  // Apply refine selection changes
  const applyRefineSelection = () => {
    setLocalSelectedDatasets(refineSelection)
    setRefineModalOpen(false)
  }

  // Smart filter functions
  const handleSmartFilter = async () => {
    if (!smartFilterInput.trim()) return

    setIsSmartFiltering(true)

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500))

    setSmartFilterQuery(smartFilterInput)
    setSmartFilterActive(true)
    setShowSmartInput(false)
    setIsSmartFiltering(false)

    // In a real implementation, this would apply vector-based semantic filtering
  }

  const toggleSmartFilter = () => {
    setSmartFilterActive(!smartFilterActive)
  }

  const editSmartFilter = () => {
    setSmartFilterInput(smartFilterQuery)
    setShowSmartInput(true)
  }

  const clearSmartFilter = () => {
    setSmartFilterInput("")
    setSmartFilterQuery("")
    setSmartFilterActive(false)
    setShowSmartInput(false)
  }

  // Load from workspace context on mount
  useEffect(() => {
    setLocalSelectedDatasets(workspace.selectedDatasets)
  }, [workspace.selectedDatasets])

  // Filter toggle helper
  const toggleFilter = (
    filterArray: string[],
    setFilter: (arr: string[]) => void,
    value: string
  ) => {
    if (filterArray.includes(value)) {
      setFilter(filterArray.filter((v) => v !== value))
    } else {
      setFilter([...filterArray, value])
    }
  }

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("")
    setPhaseFilters([])
    setStatusFilters([])
    setGeographyFilters([])
    setTherapeuticFilters([])
    setModalityFilters([])
    setSponsorFilters([])
    setSharingFilters([])
    setNctIdentifier("")
    setEudraCTIdentifier("")
    setIsLockedFilter(null)
    setDataProductRightsFilters([])
    setDataAvailabilityFilters([])
    setComplianceStatusFilters([])
    // Clear smart filter
    setSmartFilterInput("")
    setSmartFilterQuery("")
    setSmartFilterActive(false)
    setShowSmartInput(false)
  }

  const hasActiveFilters = searchQuery.trim() !== "" || phaseFilters.length > 0 ||
    statusFilters.length > 0 || geographyFilters.length > 0 ||
    therapeuticFilters.length > 0 || modalityFilters.length > 0 ||
    sponsorFilters.length > 0 || sharingFilters.length > 0 ||
    nctIdentifier.trim() !== "" || eudraCTIdentifier.trim() !== "" ||
    isLockedFilter === true || dataProductRightsFilters.length > 0 ||
    dataAvailabilityFilters.length > 0 || complianceStatusFilters.length > 0 ||
    smartFilterActive

  // Filtered datasets
  const filteredDatasets = useMemo(() => {
    let datasets = [...allDatasets]

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      datasets = datasets.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.code.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query)
      )
    }

    // Phase filter
    if (phaseFilters.length > 0) {
      datasets = datasets.filter(d => phaseFilters.includes(d.phase))
    }

    // Status filter
    if (statusFilters.length > 0) {
      datasets = datasets.filter(d => statusFilters.includes(d.status))
    }

    // Geography filter
    if (geographyFilters.length > 0) {
      datasets = datasets.filter(d =>
        d.geography.some(g => geographyFilters.includes(g))
      )
    }

    // Therapeutic area filter
    if (therapeuticFilters.length > 0) {
      datasets = datasets.filter(d =>
        d.therapeuticArea.some(t => therapeuticFilters.includes(t))
      )
    }

    // Modality filter
    if (modalityFilters.length > 0) {
      datasets = datasets.filter(d =>
        d.modalities.some(m => modalityFilters.includes(m))
      )
    }

    // Is Locked filter (DBL > 6 months)
    if (isLockedFilter !== null) {
      datasets = datasets.filter(d => d.isLocked === isLockedFilter)
    }

    // Data Product Rights filter
    if (dataProductRightsFilters.length > 0) {
      datasets = datasets.filter(d => dataProductRightsFilters.includes(d.dataProductRights))
    }

    // Data Availability filter
    if (dataAvailabilityFilters.length > 0) {
      datasets = datasets.filter(d => dataAvailabilityFilters.includes(d.dataAvailability))
    }

    // Compliance Status filter
    if (complianceStatusFilters.length > 0) {
      datasets = datasets.filter(d => complianceStatusFilters.includes(d.complianceStatus))
    }

    return datasets
  }, [allDatasets, searchQuery, phaseFilters, statusFilters, geographyFilters, therapeuticFilters, modalityFilters, isLockedFilter, dataProductRightsFilters, dataAvailabilityFilters, complianceStatusFilters])

  // Pagination calculations
  const totalPages = Math.ceil(filteredDatasets.length / pageSize)

  const paginatedDatasets = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredDatasets.slice(startIndex, startIndex + pageSize)
  }, [filteredDatasets, currentPage, pageSize])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, phaseFilters, statusFilters, geographyFilters, therapeuticFilters, modalityFilters, isLockedFilter, dataProductRightsFilters, dataAvailabilityFilters, complianceStatusFilters, smartFilterActive])

  // Toggle dataset selection
  const toggleDataset = (dataset: DatasetWithROAMFields) => {
    const isSelected = localSelectedDatasets.some(d => d.id === dataset.id)
    if (isSelected) {
      setLocalSelectedDatasets(localSelectedDatasets.filter(d => d.id !== dataset.id))
    } else {
      setLocalSelectedDatasets([...localSelectedDatasets, dataset])
    }
  }

  const isDatasetSelected = (datasetId: string) =>
    localSelectedDatasets.some(d => d.id === datasetId)

  // Calculate how many filtered datasets are not yet selected
  const newFilteredDatasetsCount = useMemo(() => {
    const existingIds = new Set(localSelectedDatasets.map(d => d.id))
    return filteredDatasets.filter(d => !existingIds.has(d.id)).length
  }, [filteredDatasets, localSelectedDatasets])

  // Add all filtered datasets
  const addAllFilteredDatasets = () => {
    const existingIds = new Set(localSelectedDatasets.map(d => d.id))
    const newDatasets = filteredDatasets.filter(d => !existingIds.has(d.id))
    setLocalSelectedDatasets([...localSelectedDatasets, ...newDatasets])
  }

  // Calculate access breakdown for selected datasets
  const accessBreakdown = useMemo(() => {
    if (localSelectedDatasets.length === 0) return null

    const total = localSelectedDatasets.length
    const breakdown = {
      alreadyOpen: 0,
      readyToGrant: 0,
      needsApproval: 0,
      missingLocation: 0,
    }

    localSelectedDatasets.forEach((dataset) => {
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
  }, [localSelectedDatasets])

  // Save and return to workspace
  const handleContinue = () => {
    // Save to workspace context
    workspace.setSelectedDatasets(localSelectedDatasets)

    // Save to sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_selected_datasets", JSON.stringify(localSelectedDatasets))
    }

    router.push("/collectoid-v2/dcm/create/workspace")
  }

  return (
    <div className="flex gap-6">
      {/* Main Content */}
      <div className="flex-1 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className={cn(
              "inline-flex items-center justify-center size-16 rounded-2xl mb-4 bg-gradient-to-br",
              scheme.bg
            )}
          >
            <Database className={cn("size-8", scheme.from.replace("from-", "text-"))} />
          </div>
          <h1 className="text-3xl font-extralight text-neutral-900 mb-3 tracking-tight">
            Refine Your Dataset Selection
          </h1>
          <p className="text-base font-light text-neutral-600 max-w-2xl mx-auto mb-3">
            Filter and select the datasets you need for your collection
          </p>
          <button className={cn(
            "inline-flex items-center gap-2 text-sm font-light transition-colors",
            scheme.from.replace("from-", "text-"),
            "hover:underline"
          )}>
            <HelpCircle className="size-4" />
            Learn about smart filtering
          </button>
        </div>

        {/* Compact Filter Panel */}
        <Card className="border-neutral-200 rounded-2xl overflow-hidden shadow-sm mb-6">
          <CardContent className="p-4">
            {/* Header Row */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Sliders className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                  <span className="text-sm font-normal text-neutral-900">Filters</span>
                </div>
                <Separator orientation="vertical" className="h-5" />
                <div className="flex items-center gap-2">
                  <Database className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                  <span className="text-2xl font-light text-neutral-900">{filteredDatasets.length}</span>
                  <span className="text-sm font-light text-neutral-600">datasets match</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-8 rounded-lg font-light text-xs text-neutral-500 hover:text-neutral-700"
                  >
                    <X className="size-3 mr-1" />
                    Clear All
                  </Button>
                )}
                {filteredDatasets.length > 0 && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>
                        <Button
                          size="sm"
                          onClick={addAllFilteredDatasets}
                          disabled={newFilteredDatasetsCount === 0}
                          className={cn(
                            "h-8 rounded-lg font-light text-xs bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
                            scheme.from,
                            scheme.to,
                            newFilteredDatasetsCount === 0 && "opacity-50 cursor-not-allowed"
                          )}
                        >
                          <Check className="size-3.5 mr-1.5" />
                          Add All {newFilteredDatasetsCount}
                        </Button>
                      </span>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      {newFilteredDatasetsCount === 0
                        ? "All filtered datasets are already in your selection"
                        : `Add ${newFilteredDatasetsCount} dataset${newFilteredDatasetsCount !== 1 ? "s" : ""} to your selection`
                      }
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>

            {/* Search Bar + Is Locked Toggle Row */}
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-1">
                <Database className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search datasets by name, code, or description..."
                  className="pl-9 h-9 rounded-xl border-neutral-200 font-light text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-neutral-100 rounded-full p-0.5"
                  >
                    <X className="size-3.5 text-neutral-500" />
                  </button>
                )}
              </div>

              {/* Is Locked Toggle - DBL > 6 months */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsLockedFilter(isLockedFilter === true ? null : true)}
                    className={cn(
                      "flex items-center gap-2 h-9 px-3 rounded-xl text-xs font-light transition-all border",
                      isLockedFilter === true
                        ? cn("bg-green-50 border-green-200 text-green-700")
                        : "bg-white border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-900"
                    )}
                  >
                    <div className={cn(
                      "relative w-8 h-4 rounded-full transition-colors",
                      isLockedFilter === true ? "bg-green-500" : "bg-neutral-300"
                    )}>
                      <div className={cn(
                        "absolute top-0.5 size-3 rounded-full bg-white shadow-sm transition-transform",
                        isLockedFilter === true ? "translate-x-4" : "translate-x-0.5"
                      )} />
                    </div>
                    <Lock className="size-3" />
                    <span>Locked only</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p className="font-medium mb-1">Database Lock Status</p>
                  <p>When enabled, shows only studies where the database was locked more than 6 months ago. These studies have stable data ready for research use.</p>
                </TooltipContent>
              </Tooltip>
            </div>

            {/* Filter Dropdowns Row */}
            <div className="flex flex-wrap gap-2">
              {/* Phase Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg font-light text-xs border-neutral-200",
                      phaseFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    Phase
                    {phaseFilters.length > 0 && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {phaseFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2" align="start">
                  <div className="space-y-1">
                    {["Phase I", "Phase II", "Phase III", "Phase IV"].map((phase) => (
                      <label key={phase} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={phaseFilters.includes(phase)}
                          onCheckedChange={() => toggleFilter(phaseFilters, setPhaseFilters, phase)}
                          className="size-3.5"
                        />
                        <span className="text-sm font-light text-neutral-700">{phase}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Status Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg font-light text-xs border-neutral-200",
                      statusFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    Status
                    {statusFilters.length > 0 && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {statusFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-40 p-2" align="start">
                  <div className="space-y-1">
                    {(["Active", "Closed", "Grey Zone", "Archived"] as const).map((status) => (
                      <label key={status} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={statusFilters.includes(status)}
                          onCheckedChange={() => toggleFilter(statusFilters, setStatusFilters, status)}
                          className="size-3.5"
                        />
                        <span className={cn(
                          "text-sm font-light",
                          status === "Active" ? "text-amber-700" :
                          status === "Closed" ? "text-green-700" :
                          status === "Grey Zone" ? "text-orange-600" :
                          "text-neutral-500"
                        )}>{status}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Geography Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg font-light text-xs border-neutral-200",
                      geographyFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    <Globe className="size-3 mr-1" />
                    Geography
                    {geographyFilters.length > 0 && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {geographyFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-44 p-2" align="start">
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {["North America", "Europe", "Asia Pacific", "Latin America", "Global"].map((geo) => (
                      <label key={geo} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={geographyFilters.includes(geo)}
                          onCheckedChange={() => toggleFilter(geographyFilters, setGeographyFilters, geo)}
                          className="size-3.5"
                        />
                        <span className="text-sm font-light text-neutral-700">{geo}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Therapeutic Area Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg font-light text-xs border-neutral-200",
                      therapeuticFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    <Target className="size-3 mr-1" />
                    Therapeutic
                    {therapeuticFilters.length > 0 && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {therapeuticFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {["Oncology", "Cardiovascular", "Neurology", "Immunology", "Respiratory", "Rare Disease"].map((area) => (
                      <label key={area} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={therapeuticFilters.includes(area)}
                          onCheckedChange={() => toggleFilter(therapeuticFilters, setTherapeuticFilters, area)}
                          className="size-3.5"
                        />
                        <span className="text-sm font-light text-neutral-700">{area}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Modality Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg font-light text-xs border-neutral-200",
                      modalityFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    <Microscope className="size-3 mr-1" />
                    Modality
                    {modalityFilters.length > 0 && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {modalityFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-2" align="start">
                  <div className="space-y-1">
                    {["Clinical", "Genomic", "Imaging", "Biomarker", "PRO"].map((modality) => (
                      <label key={modality} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={modalityFilters.includes(modality)}
                          onCheckedChange={() => toggleFilter(modalityFilters, setModalityFilters, modality)}
                          className="size-3.5"
                        />
                        <span className="text-sm font-light text-neutral-700">{modality}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Sponsor Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg font-light text-xs border-neutral-200",
                      sponsorFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    <Building className="size-3 mr-1" />
                    Sponsor
                    {sponsorFilters.length > 0 && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {sponsorFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <div className="space-y-1">
                    {["Sponsor", "Investigator-Initiated", "Academic", "Government"].map((sponsor) => (
                      <label key={sponsor} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={sponsorFilters.includes(sponsor)}
                          onCheckedChange={() => toggleFilter(sponsorFilters, setSponsorFilters, sponsor)}
                          className="size-3.5"
                        />
                        <span className="text-sm font-light text-neutral-700">{sponsor}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Sharing Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg font-light text-xs border-neutral-200",
                      sharingFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    <Shield className="size-3 mr-1" />
                    Sharing
                    {sharingFilters.length > 0 && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {sharingFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  <div className="space-y-1">
                    {["Research allowed", "Research not allowed", "Research with restriction"].map((sharing) => (
                      <label key={sharing} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={sharingFilters.includes(sharing)}
                          onCheckedChange={() => toggleFilter(sharingFilters, setSharingFilters, sharing)}
                          className="size-3.5"
                        />
                        <span className="text-sm font-light text-neutral-700">{sharing}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* IDs Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg font-light text-xs border-neutral-200",
                      (nctIdentifier || eudraCTIdentifier) && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    <FileText className="size-3 mr-1" />
                    IDs
                    {(nctIdentifier || eudraCTIdentifier) && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {(nctIdentifier ? 1 : 0) + (eudraCTIdentifier ? 1 : 0)}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3" align="start">
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-500 mb-1.5 block">NCT Identifier</label>
                      <Input
                        value={nctIdentifier}
                        onChange={(e) => setNctIdentifier(e.target.value)}
                        placeholder="e.g., NCT03456789"
                        className="h-8 text-xs font-light"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-500 mb-1.5 block">EudraCT Identifier</label>
                      <Input
                        value={eudraCTIdentifier}
                        onChange={(e) => setEudraCTIdentifier(e.target.value)}
                        placeholder="e.g., 2019-001234-56"
                        className="h-8 text-xs font-light"
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Separator for ROAM filters */}
              <Separator orientation="vertical" className="h-6 mx-1" />

              {/* Data Product Rights Filter */}
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-8 rounded-lg font-light text-xs border-neutral-200",
                          dataProductRightsFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                        )}
                      >
                        <ShieldCheck className="size-3 mr-1" />
                        Rights
                        {dataProductRightsFilters.length > 0 && (
                          <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                            {dataProductRightsFilters.length}
                          </Badge>
                        )}
                        <ChevronDown className="size-3 ml-1 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="font-medium mb-1">Data Product Rights</p>
                    <p>Filter by whether the study&apos;s data product rights allow research use. This is determined by contractual agreements and study protocols.</p>
                  </TooltipContent>
                </Tooltip>
                <PopoverContent className="w-64 p-3" align="start">
                  <p className="text-xs font-medium text-neutral-500 mb-2">Data Product Rights</p>
                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <Checkbox
                            checked={dataProductRightsFilters.includes("Research Allowed")}
                            onCheckedChange={() => toggleFilter(dataProductRightsFilters, setDataProductRightsFilters, "Research Allowed")}
                            className="size-3.5"
                          />
                          <span className="text-sm font-light text-green-700">Research Allowed</span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Data can be used for internal research purposes under ROAM 90:10 model
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <Checkbox
                            checked={dataProductRightsFilters.includes("Research Not Allowed")}
                            onCheckedChange={() => toggleFilter(dataProductRightsFilters, setDataProductRightsFilters, "Research Not Allowed")}
                            className="size-3.5"
                          />
                          <span className="text-sm font-light text-red-700">Research Not Allowed</span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Contractual or protocol restrictions prevent research use of this data
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <Checkbox
                            checked={dataProductRightsFilters.includes("Under Review")}
                            onCheckedChange={() => toggleFilter(dataProductRightsFilters, setDataProductRightsFilters, "Under Review")}
                            className="size-3.5"
                          />
                          <span className="text-sm font-light text-amber-700">Under Review</span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Rights are being evaluated - may require additional time for approval
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Data Availability Filter */}
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-8 rounded-lg font-light text-xs border-neutral-200",
                          dataAvailabilityFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                        )}
                      >
                        <MapPin className="size-3 mr-1" />
                        Location
                        {dataAvailabilityFilters.length > 0 && (
                          <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                            {dataAvailabilityFilters.length}
                          </Badge>
                        )}
                        <ChevronDown className="size-3 ml-1 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="font-medium mb-1">Data Platform Location</p>
                    <p>Filter by where the data is currently stored and accessible from.</p>
                  </TooltipContent>
                </Tooltip>
                <PopoverContent className="w-56 p-3" align="start">
                  <p className="text-xs font-medium text-neutral-500 mb-2">Data Platform</p>
                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <Checkbox
                            checked={dataAvailabilityFilters.includes("In PDP")}
                            onCheckedChange={() => toggleFilter(dataAvailabilityFilters, setDataAvailabilityFilters, "In PDP")}
                            className="size-3.5"
                          />
                          <span className="text-sm font-light text-neutral-700">In PDP</span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Data is available in the Precision Data Platform - primary analytics environment
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <Checkbox
                            checked={dataAvailabilityFilters.includes("In entimICE")}
                            onCheckedChange={() => toggleFilter(dataAvailabilityFilters, setDataAvailabilityFilters, "In entimICE")}
                            className="size-3.5"
                          />
                          <span className="text-sm font-light text-neutral-700">In entimICE</span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Data is in entimICE genomics platform - specialized for omics data
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <Checkbox
                            checked={dataAvailabilityFilters.includes("In CTDS")}
                            onCheckedChange={() => toggleFilter(dataAvailabilityFilters, setDataAvailabilityFilters, "In CTDS")}
                            className="size-3.5"
                          />
                          <span className="text-sm font-light text-neutral-700">In CTDS</span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Data is in Clinical Trial Data Store - legacy clinical data repository
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <Checkbox
                            checked={dataAvailabilityFilters.includes("Location Unknown")}
                            onCheckedChange={() => toggleFilter(dataAvailabilityFilters, setDataAvailabilityFilters, "Location Unknown")}
                            className="size-3.5"
                          />
                          <span className="text-sm font-light text-amber-600">Location Unknown</span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Data location has not been mapped yet - may require additional provisioning time
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Compliance Status Filter */}
              <Popover>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                          "h-8 rounded-lg font-light text-xs border-neutral-200",
                          complianceStatusFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                        )}
                      >
                        <FileSearch className="size-3 mr-1" />
                        Compliance
                        {complianceStatusFilters.length > 0 && (
                          <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                            {complianceStatusFilters.length}
                          </Badge>
                        )}
                        <ChevronDown className="size-3 ml-1 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <p className="font-medium mb-1">Compliance Status</p>
                    <p>Filter by the current compliance review status. Studies may require ethical, legal, or data product rights reviews before access can be granted.</p>
                  </TooltipContent>
                </Tooltip>
                <PopoverContent className="w-64 p-3" align="start">
                  <p className="text-xs font-medium text-neutral-500 mb-2">Compliance Status</p>
                  <div className="space-y-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <Checkbox
                            checked={complianceStatusFilters.includes("Fully Compliant")}
                            onCheckedChange={() => toggleFilter(complianceStatusFilters, setComplianceStatusFilters, "Fully Compliant")}
                            className="size-3.5"
                          />
                          <span className="text-sm font-light text-green-700">Fully Compliant</span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        All reviews complete - data is ready for access under ROAM
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <Checkbox
                            checked={complianceStatusFilters.includes("Ethical Review Pending")}
                            onCheckedChange={() => toggleFilter(complianceStatusFilters, setComplianceStatusFilters, "Ethical Review Pending")}
                            className="size-3.5"
                          />
                          <span className="text-sm font-light text-amber-700">Ethical Review Pending</span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Awaiting ethics committee approval for secondary use
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <Checkbox
                            checked={complianceStatusFilters.includes("Legal Review Pending")}
                            onCheckedChange={() => toggleFilter(complianceStatusFilters, setComplianceStatusFilters, "Legal Review Pending")}
                            className="size-3.5"
                          />
                          <span className="text-sm font-light text-amber-700">Legal Review Pending</span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        TALT legal review required for data sharing agreements
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <label className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                          <Checkbox
                            checked={complianceStatusFilters.includes("DPR Under Review")}
                            onCheckedChange={() => toggleFilter(complianceStatusFilters, setComplianceStatusFilters, "DPR Under Review")}
                            className="size-3.5"
                          />
                          <span className="text-sm font-light text-amber-700">DPR Under Review</span>
                        </label>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        Data Product Rights being evaluated - determining research allowability
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </CardContent>
        </Card>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="space-y-2 mb-6">
            <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">Active Filters</p>
            <div className="flex flex-wrap gap-2">
              {/* Smart Filter */}
              {smartFilterActive && smartFilterQuery && (
                <Badge
                  className={cn(
                    "font-light pl-3 pr-2 py-1 group cursor-pointer transition-colors",
                    scheme.from.replace("from-", "bg-").replace("500", "100"),
                    scheme.from.replace("from-", "text-").replace("500", "700"),
                    "hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                  )}
                  onClick={() => {
                    setSmartFilterActive(false)
                    setSmartFilterQuery("")
                  }}
                >
                  <Sparkles className="size-3 mr-1.5 inline" />
                  AI: &quot;{smartFilterQuery.substring(0, 30)}{smartFilterQuery.length > 30 ? '...' : ''}&quot;
                  <X className="size-3 ml-1.5 inline" />
                </Badge>
              )}
              {searchQuery.trim() && (
                <Badge
                  variant="outline"
                  className="font-light pl-3 pr-2 py-1 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                  onClick={() => setSearchQuery("")}
                >
                  Search: &quot;{searchQuery.substring(0, 20)}{searchQuery.length > 20 ? '...' : ''}&quot;
                  <X className="size-3 ml-1.5 inline" />
                </Badge>
              )}
              {phaseFilters.map((phase) => (
                <Badge
                  key={phase}
                  variant="outline"
                  className="font-light pl-3 pr-2 py-1 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                  onClick={() => toggleFilter(phaseFilters, setPhaseFilters, phase)}
                >
                  {phase}
                  <X className="size-3 ml-1.5 inline" />
                </Badge>
              ))}
              {statusFilters.map((status) => (
                <Badge
                  key={status}
                  variant="outline"
                  className="font-light pl-3 pr-2 py-1 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                  onClick={() => toggleFilter(statusFilters, setStatusFilters, status)}
                >
                  {status}
                  <X className="size-3 ml-1.5 inline" />
                </Badge>
              ))}
              {geographyFilters.map((geo) => (
                <Badge
                  key={geo}
                  variant="outline"
                  className="font-light pl-3 pr-2 py-1 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                  onClick={() => toggleFilter(geographyFilters, setGeographyFilters, geo)}
                >
                  {geo}
                  <X className="size-3 ml-1.5 inline" />
                </Badge>
              ))}
              {therapeuticFilters.map((ta) => (
                <Badge
                  key={ta}
                  variant="outline"
                  className="font-light pl-3 pr-2 py-1 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                  onClick={() => toggleFilter(therapeuticFilters, setTherapeuticFilters, ta)}
                >
                  {ta}
                  <X className="size-3 ml-1.5 inline" />
                </Badge>
              ))}
              {isLockedFilter === true && (
                <Badge
                  variant="outline"
                  className="font-light pl-3 pr-2 py-1 cursor-pointer transition-colors bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
                  onClick={() => setIsLockedFilter(null)}
                >
                  <Lock className="size-3 mr-1 inline" />
                  Locked only
                  <X className="size-3 ml-1.5 inline" />
                </Badge>
              )}
              {dataProductRightsFilters.map((right) => (
                <Badge
                  key={right}
                  variant="outline"
                  className={cn(
                    "font-light pl-3 pr-2 py-1 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-700 hover:border-red-200",
                    right === "Research Allowed" ? "bg-green-50 text-green-700 border-green-200" :
                    right === "Research Not Allowed" ? "bg-red-50 text-red-700 border-red-200" :
                    "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                  onClick={() => toggleFilter(dataProductRightsFilters, setDataProductRightsFilters, right)}
                >
                  {right}
                  <X className="size-3 ml-1.5 inline" />
                </Badge>
              ))}
              {dataAvailabilityFilters.map((loc) => (
                <Badge
                  key={loc}
                  variant="outline"
                  className="font-light pl-3 pr-2 py-1 cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                  onClick={() => toggleFilter(dataAvailabilityFilters, setDataAvailabilityFilters, loc)}
                >
                  {loc}
                  <X className="size-3 ml-1.5 inline" />
                </Badge>
              ))}
              {complianceStatusFilters.map((status) => (
                <Badge
                  key={status}
                  variant="outline"
                  className={cn(
                    "font-light pl-3 pr-2 py-1 cursor-pointer transition-colors hover:bg-red-50 hover:text-red-700 hover:border-red-200",
                    status === "Fully Compliant" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"
                  )}
                  onClick={() => toggleFilter(complianceStatusFilters, setComplianceStatusFilters, status)}
                >
                  {status}
                  <X className="size-3 ml-1.5 inline" />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* AI Smart Filter Card */}
        <div className="mb-6">
          {!smartFilterQuery && !showSmartInput ? (
            <button
              onClick={() => setShowSmartInput(true)}
              className={cn(
                "w-full rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-all p-6 text-left group"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex size-12 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg",
                  scheme.from,
                  scheme.to
                )}>
                  <Sparkles className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-normal text-neutral-900 mb-1 flex items-center gap-2">
                    AI Smart Filter
                    <Badge className={cn(
                      "font-light text-xs",
                      scheme.from.replace("from-", "bg-").replace("500", "100"),
                      scheme.from.replace("from-", "text-")
                    )}>
                      Beta
                    </Badge>
                  </h3>
                  <p className="text-sm font-light text-neutral-600">
                    Describe what you&apos;re looking for in natural language and let AI refine your search
                  </p>
                </div>
                <ArrowRight className="size-5 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
              </div>
            </button>
          ) : smartFilterQuery && !showSmartInput ? (
            <div className={cn(
              "relative transition-all",
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
                  : "border-neutral-200 opacity-60"
              )}>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={cn(
                      "flex size-12 items-center justify-center rounded-xl shadow-lg shrink-0 transition-all",
                      smartFilterActive
                        ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                        : "bg-neutral-200 text-neutral-500"
                    )}>
                      <Sparkles className="size-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={cn(
                          "text-base font-normal transition-colors",
                          smartFilterActive ? "text-neutral-900" : "text-neutral-600"
                        )}>
                          AI Smart Filter {smartFilterActive ? "Active" : "Inactive"}
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
                        "text-sm font-light mb-3 italic transition-colors",
                        smartFilterActive ? "text-neutral-700" : "text-neutral-500"
                      )}>
                        &quot;{smartFilterQuery}&quot;
                      </p>
                      {smartFilterActive ? (
                        <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
                          <Check className="size-3 text-green-600" />
                          <span>
                            Actively filtering <span className="font-normal text-neutral-900">{filteredDatasets.length} studies</span> based on AI analysis
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
          ) : (
            <div className="rounded-2xl border-2 border-neutral-200 bg-white shadow-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className={cn(
                  "flex size-12 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg shrink-0",
                  scheme.from,
                  scheme.to
                )}>
                  <Sparkles className="size-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-normal text-neutral-900 mb-1">AI Smart Filter</h3>
                  <p className="text-sm font-light text-neutral-600 mb-3">
                    Describe what you&apos;re looking for and AI will intelligently filter your datasets
                  </p>
                  <Textarea
                    value={smartFilterInput}
                    onChange={(e) => setSmartFilterInput(e.target.value)}
                    placeholder='e.g., "Show me recent oncology studies with imaging data in Europe" or "Find small patient population studies that need data sharing approvals"'
                    className="min-h-[80px] text-sm font-light border-neutral-200 rounded-xl resize-none"
                    disabled={isSmartFiltering}
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowSmartInput(false)}
                  disabled={isSmartFiltering}
                  className="rounded-xl font-light border-neutral-200"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSmartFilter}
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
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 mr-2" />
                      Apply AI Filter
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Dataset List */}
        <div className="space-y-4">
          {filteredDatasets.length === 0 ? (
            <div className="text-center py-12">
              <Database className="size-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-sm font-light text-neutral-600">No datasets match your filters</p>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAllFilters}
                  className="mt-4 rounded-xl font-light border-neutral-200"
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          ) : (
            paginatedDatasets.map((dataset) => {
              const isSelected = isDatasetSelected(dataset.id)
              return (
                <Card
                  key={dataset.id}
                  className="border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
                >
                  <CardContent className="px-4 py-3">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="text-lg font-normal text-neutral-900">{dataset.name}</h3>
                          <Badge variant="outline" className="font-light">
                            {dataset.code}
                          </Badge>
                          <Badge
                            className={cn(
                              "font-light",
                              dataset.status === "Closed" ? "bg-green-100 text-green-800" :
                              dataset.status === "Active" ? "bg-amber-100 text-amber-800" :
                              dataset.status === "Grey Zone" ? "bg-orange-100 text-orange-800" :
                              "bg-neutral-100 text-neutral-600"
                            )}
                          >
                            {dataset.status}
                          </Badge>
                          {dataset.isLocked && (
                            <Badge className="font-light bg-green-100 text-green-700">
                              <Lock className="size-3 mr-1" />
                              Locked
                            </Badge>
                          )}
                          {dataset.dataProductRights === "Research Not Allowed" && (
                            <Badge className="font-light bg-red-100 text-red-700">
                              No Research
                            </Badge>
                          )}
                          {dataset.dataProductRights === "Under Review" && (
                            <Badge className="font-light bg-amber-100 text-amber-700">
                              Rights Under Review
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-light text-neutral-600 mb-1.5">
                          {dataset.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-light text-neutral-500">
                          <span>{dataset.patientCount.toLocaleString()} patients</span>
                          <span>•</span>
                          <span>{dataset.phase}</span>
                          {dataset.closedDate && (
                            <>
                              <span>•</span>
                              <span>Closed {dataset.closedDate}</span>
                            </>
                          )}
                          <span>•</span>
                          <span>{dataset.geography.join(", ")}</span>
                        </div>
                      </div>
                    </div>

                    {/* Collection Crossover */}
                    {dataset.collections.length > 0 && (
                      <div className={cn("rounded-xl p-2.5 mb-2.5", scheme.bg.replace("500", "50"))}>
                        <div className="flex items-start gap-2">
                          <Layers className={cn("size-4 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-normal text-neutral-900 mb-1">
                              In {dataset.collections.length} collection{dataset.collections.length !== 1 ? "s" : ""}
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {dataset.collections.slice(0, 3).map((collection, i) => (
                                <Badge key={i} variant="outline" className="text-xs font-light border-neutral-200">
                                  {collection}
                                </Badge>
                              ))}
                              {dataset.collections.length > 3 && (
                                <Badge variant="outline" className="text-xs font-light">
                                  +{dataset.collections.length - 3} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Usage Analytics + ROAM Info */}
                    <div className="grid grid-cols-4 gap-3 mb-2.5">
                      <div className="flex items-center gap-2">
                        <Users className="size-4 text-neutral-400" />
                        <div>
                          <p className="text-xs font-light text-neutral-500">Active Users</p>
                          <p className="text-sm font-normal text-neutral-900">{dataset.activeUsers}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Building className="size-4 text-neutral-400" />
                        <div>
                          <p className="text-xs font-light text-neutral-500">Organizations</p>
                          <p className="text-sm font-normal text-neutral-900">{dataset.organizations}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="size-4 text-neutral-400" />
                        <div>
                          <p className="text-xs font-light text-neutral-500">Platform</p>
                          <p className={cn(
                            "text-sm font-normal",
                            dataset.dataAvailability === "Location Unknown" ? "text-amber-600" : "text-neutral-900"
                          )}>
                            {dataset.dataAvailability.replace("In ", "")}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Microscope className="size-4 text-neutral-400" />
                        <div>
                          <p className="text-xs font-light text-neutral-500">Modalities</p>
                          <p className="text-sm font-normal text-neutral-900 truncate" title={dataset.modalities.join(", ")}>
                            {dataset.modalities.slice(0, 2).join(", ")}{dataset.modalities.length > 2 ? ` +${dataset.modalities.length - 2}` : ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Access Eligibility RAG Bar */}
                    <div className="mb-2.5">
                      <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">
                        Access Eligibility
                      </p>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
                            <div className="flex h-full">
                              <div
                                className="bg-green-500"
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
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs font-light text-neutral-600">
                          <span>{dataset.accessBreakdown.alreadyOpen}% open</span>
                          <span>{dataset.accessBreakdown.readyToGrant}% ready</span>
                          <span>{dataset.accessBreakdown.needsApproval}% needs approval</span>
                        </div>
                      </div>
                    </div>

                    {/* Frequently Bundled With + Actions */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {dataset.frequentlyBundledWith.length > 0 && (
                          <>
                            <div className="flex items-center gap-2 mb-1.5">
                              <Sparkles className="size-3 text-neutral-400" />
                              <p className="text-xs font-light text-neutral-600">
                                Frequently bundled with:
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {dataset.frequentlyBundledWith.map((code) => (
                                <Badge key={code} variant="outline" className="text-xs font-light">
                                  {code}
                                </Badge>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => toggleDataset(dataset)}
                        className={cn(
                          "rounded-xl font-light transition-all shrink-0",
                          isSelected
                            ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                            : cn("bg-gradient-to-r text-white shadow-md hover:shadow-lg", scheme.from, scheme.to)
                        )}
                      >
                        {isSelected ? (
                          <>
                            <X className="size-4 mr-1" />
                            Remove
                          </>
                        ) : (
                          <>
                            <Zap className="size-4 mr-1" />
                            Add to Collection
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}

          {/* Pagination Controls */}
          {filteredDatasets.length > 0 && (
            <div className="flex items-center justify-between pt-6 border-t border-neutral-100 mt-6">
              <div className="flex items-center gap-2 text-sm font-light text-neutral-600">
                <span>
                  Showing {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredDatasets.length)} of {filteredDatasets.length}
                </span>
                <span className="text-neutral-300">|</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                  className="h-8 px-2 rounded-lg border border-neutral-200 text-sm font-light bg-white"
                >
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={100}>100 per page</option>
                </select>
              </div>
              {totalPages > 1 && (
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 rounded-lg border-neutral-200"
                  >
                    <ChevronLeft className="size-4" />
                    <ChevronLeft className="size-4 -ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0 rounded-lg border-neutral-200"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <div className="flex items-center gap-1 px-2">
                    {/* Show page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number
                      if (totalPages <= 5) {
                        pageNum = i + 1
                      } else if (currentPage <= 3) {
                        pageNum = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i
                      } else {
                        pageNum = currentPage - 2 + i
                      }
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className={cn(
                            "h-8 w-8 p-0 rounded-lg text-sm font-light",
                            currentPage === pageNum
                              ? cn("bg-gradient-to-r text-white border-0", scheme.from, scheme.to)
                              : "border-neutral-200"
                          )}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0 rounded-lg border-neutral-200"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0 rounded-lg border-neutral-200"
                  >
                    <ChevronRight className="size-4" />
                    <ChevronRight className="size-4 -ml-2" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar - Selected Datasets */}
      <div className="w-80 shrink-0 mt-[192px]">
        <Card className="border-neutral-200 rounded-2xl overflow-hidden shadow-lg sticky top-24">
          <CardContent className="p-6">
            {/* Header with icon */}
            <div className="flex items-center gap-3 mb-4">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full bg-gradient-to-r text-white",
                  scheme.from,
                  scheme.to
                )}
              >
                <Database className="size-5" />
              </div>
              <div>
                <h3 className="text-lg font-normal text-neutral-900">Selected Datasets</h3>
                <p className="text-2xl font-light text-neutral-900">{localSelectedDatasets.length}</p>
              </div>
            </div>

            {/* Access Eligibility RAG Bar */}
            {accessBreakdown && localSelectedDatasets.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">Access Eligibility</p>
                  <p className="text-xs font-medium text-green-600">{accessBreakdown.alreadyOpen + accessBreakdown.readyToGrant}% ready</p>
                </div>
                <div className="flex gap-0.5 h-3 rounded-full overflow-hidden bg-neutral-100">
                  <div
                    className="bg-green-500 transition-all duration-500"
                    style={{ width: `${accessBreakdown.alreadyOpen}%` }}
                    title={`Already Open: ${accessBreakdown.alreadyOpen}%`}
                  />
                  <div
                    className={cn("bg-gradient-to-r transition-all duration-500", scheme.from, scheme.to)}
                    style={{ width: `${accessBreakdown.readyToGrant}%` }}
                    title={`Awaiting Policy: ${accessBreakdown.readyToGrant}%`}
                  />
                  <div
                    className="bg-amber-500 transition-all duration-500"
                    style={{ width: `${accessBreakdown.needsApproval}%` }}
                    title={`Needs Approval: ${accessBreakdown.needsApproval}%`}
                  />
                  <div
                    className="bg-neutral-400 transition-all duration-500"
                    style={{ width: `${accessBreakdown.missingLocation}%` }}
                    title={`Missing Location: ${accessBreakdown.missingLocation}%`}
                  />
                </div>
                <div className="flex items-center justify-between mt-1.5">
                  <div className="flex items-center gap-3 text-xs font-light text-neutral-500">
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-green-500" /> Open
                    </span>
                    <span className="flex items-center gap-1">
                      <span className={cn("size-2 rounded-full bg-gradient-to-r", scheme.from, scheme.to)} /> Policy
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-amber-500" /> Review
                    </span>
                  </div>
                </div>
              </div>
            )}

            <Separator className="mb-6" />

            {/* Access Breakdown Details */}
            {accessBreakdown && localSelectedDatasets.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="size-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-normal text-neutral-900">Already Open</p>
                      <Badge className="bg-green-100 text-green-800 font-light text-xs">{accessBreakdown.alreadyOpen}%</Badge>
                    </div>
                    <p className="text-xs font-light text-neutral-600">Instant access</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", scheme.from.replace("from-", "bg-").replace("500", "100"))}>
                    <Zap className={cn("size-4", scheme.from.replace("from-", "text-"))} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-normal text-neutral-900">Awaiting Policy</p>
                      <Badge className={cn("font-light text-xs", scheme.from.replace("from-", "bg-").replace("500", "100"), scheme.from.replace("from-", "text-"))}>{accessBreakdown.readyToGrant}%</Badge>
                    </div>
                    <p className="text-xs font-light text-neutral-600">Auto-provisioned</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
                    <Clock className="size-4 text-amber-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-normal text-neutral-900">Needs Approval</p>
                      <Badge className="bg-amber-100 text-amber-800 font-light text-xs">{accessBreakdown.needsApproval}%</Badge>
                    </div>
                    <p className="text-xs font-light text-neutral-600">Requires review</p>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Selected datasets list */}
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {localSelectedDatasets.slice(0, 5).map((dataset) => (
                    <div
                      key={dataset.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-normal text-neutral-900 truncate">{dataset.code}</p>
                        <p className="text-xs font-light text-neutral-500 truncate">{dataset.name}</p>
                      </div>
                      <button
                        onClick={() => toggleDataset(dataset)}
                        className="h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-3 text-neutral-500 hover:text-red-600" />
                      </button>
                    </div>
                  ))}
                  {localSelectedDatasets.length > 5 && (
                    <p className="text-xs font-light text-neutral-500 text-center py-2">
                      +{localSelectedDatasets.length - 5} more datasets
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Button
                    variant="outline"
                    onClick={openRefineModal}
                    className={cn(
                      "w-full rounded-xl font-light border-neutral-200",
                      scheme.from.replace("from-", "hover:border-"),
                      scheme.from.replace("from-", "hover:text-")
                    )}
                  >
                    <Settings2 className="size-4 mr-2" />
                    Refine Selection
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setLocalSelectedDatasets([])}
                    className="w-full rounded-xl font-light text-neutral-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="size-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="size-12 text-neutral-200 mx-auto mb-3" />
                <p className="text-sm font-light text-neutral-500">No datasets selected yet</p>
                <p className="text-xs font-light text-neutral-400 mt-1">Click on datasets to add them</p>
              </div>
            )}
          </CardContent>

          {/* Fixed footer with Continue Button */}
          <div className="p-4 border-t border-neutral-100 bg-white">
            <p className="text-xs font-light text-neutral-500 mb-3 text-center">
              Access provisioning times vary based on approval requirements.
            </p>
            <Button
              onClick={handleContinue}
              className={cn(
                "w-full rounded-xl font-light transition-all bg-gradient-to-r text-white shadow-md hover:shadow-lg",
                scheme.from,
                scheme.to
              )}
            >
              Continue with {localSelectedDatasets.length} datasets
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>

      {/* Refine Selection Modal */}
      <Dialog open={refineModalOpen} onOpenChange={setRefineModalOpen}>
        <DialogContent className="!w-[90vw] !max-w-[90vw] !h-[85vh] !max-h-[85vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-xl bg-gradient-to-r text-white",
                scheme.from,
                scheme.to
              )}>
                <Settings2 className="size-5" />
              </div>
              <div>
                <span className="text-xl font-normal">Refine Selection</span>
                <p className="text-sm font-light text-neutral-500 mt-0.5">
                  {refineSelection.length} dataset{refineSelection.length !== 1 ? "s" : ""} selected
                </p>
              </div>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Review and refine your dataset selection. Sort by different fields and remove datasets as needed.
            </DialogDescription>
          </DialogHeader>

          {/* Filter Input */}
          <div className="relative mt-4">
            <Database className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              value={refineFilter}
              onChange={(e) => setRefineFilter(e.target.value)}
              placeholder="Filter by code or name..."
              className="pl-9 h-10 rounded-xl border-neutral-200 font-light text-sm"
            />
            {refineFilter && (
              <button
                onClick={() => setRefineFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 hover:bg-neutral-100 rounded-full p-0.5"
              >
                <X className="size-3.5 text-neutral-500" />
              </button>
            )}
          </div>

          {/* Results count */}
          {refineFilter.trim() && (
            <p className="text-xs font-light text-neutral-500 mt-2">
              Showing {filteredAndSortedRefineSelection.length} of {refineSelection.length} datasets
            </p>
          )}

          {/* Table Header */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 bg-neutral-50 rounded-xl border border-neutral-200 overflow-x-auto",
            refineFilter.trim() ? "mt-2" : "mt-4"
          )}>
            <button
              onClick={() => toggleSort("code")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 w-24",
                refineSortField === "code" ? cn(scheme.from.replace("from-", "text-"), "bg-white shadow-sm") : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Code
              {refineSortField === "code" ? (
                refineSortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
              ) : (
                <ArrowUpDown className="size-3 opacity-50" />
              )}
            </button>
            <button
              onClick={() => toggleSort("name")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors flex-1 min-w-[150px]",
                refineSortField === "name" ? cn(scheme.from.replace("from-", "text-"), "bg-white shadow-sm") : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Name
              {refineSortField === "name" ? (
                refineSortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
              ) : (
                <ArrowUpDown className="size-3 opacity-50" />
              )}
            </button>
            <button
              onClick={() => toggleSort("therapeuticArea")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 w-24",
                refineSortField === "therapeuticArea" ? cn(scheme.from.replace("from-", "text-"), "bg-white shadow-sm") : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Area
              {refineSortField === "therapeuticArea" ? (
                refineSortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
              ) : (
                <ArrowUpDown className="size-3 opacity-50" />
              )}
            </button>
            <button
              onClick={() => toggleSort("phase")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 w-20",
                refineSortField === "phase" ? cn(scheme.from.replace("from-", "text-"), "bg-white shadow-sm") : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Phase
              {refineSortField === "phase" ? (
                refineSortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
              ) : (
                <ArrowUpDown className="size-3 opacity-50" />
              )}
            </button>
            <button
              onClick={() => toggleSort("status")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 w-20",
                refineSortField === "status" ? cn(scheme.from.replace("from-", "text-"), "bg-white shadow-sm") : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Status
              {refineSortField === "status" ? (
                refineSortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
              ) : (
                <ArrowUpDown className="size-3 opacity-50" />
              )}
            </button>
            <button
              onClick={() => toggleSort("isLocked")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 w-20",
                refineSortField === "isLocked" ? cn(scheme.from.replace("from-", "text-"), "bg-white shadow-sm") : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Locked
              {refineSortField === "isLocked" ? (
                refineSortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
              ) : (
                <ArrowUpDown className="size-3 opacity-50" />
              )}
            </button>
            <button
              onClick={() => toggleSort("dataProductRights")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 w-24",
                refineSortField === "dataProductRights" ? cn(scheme.from.replace("from-", "text-"), "bg-white shadow-sm") : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Rights
              {refineSortField === "dataProductRights" ? (
                refineSortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
              ) : (
                <ArrowUpDown className="size-3 opacity-50" />
              )}
            </button>
            <button
              onClick={() => toggleSort("dataAvailability")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 w-24",
                refineSortField === "dataAvailability" ? cn(scheme.from.replace("from-", "text-"), "bg-white shadow-sm") : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Platform
              {refineSortField === "dataAvailability" ? (
                refineSortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
              ) : (
                <ArrowUpDown className="size-3 opacity-50" />
              )}
            </button>
            <button
              onClick={() => toggleSort("modalities")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 w-28",
                refineSortField === "modalities" ? cn(scheme.from.replace("from-", "text-"), "bg-white shadow-sm") : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Modalities
              {refineSortField === "modalities" ? (
                refineSortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
              ) : (
                <ArrowUpDown className="size-3 opacity-50" />
              )}
            </button>
            <button
              onClick={() => toggleSort("patientCount")}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 w-20 justify-end",
                refineSortField === "patientCount" ? cn(scheme.from.replace("from-", "text-"), "bg-white shadow-sm") : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              Patients
              {refineSortField === "patientCount" ? (
                refineSortDirection === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
              ) : (
                <ArrowUpDown className="size-3 opacity-50" />
              )}
            </button>
            <div className="w-10 shrink-0" /> {/* Space for remove button */}
          </div>

          {/* Table Body */}
          <div className="flex-1 overflow-y-auto mt-2 space-y-1">
            {filteredAndSortedRefineSelection.length === 0 ? (
              <div className="text-center py-12">
                <Database className="size-12 text-neutral-200 mx-auto mb-3" />
                {refineFilter.trim() ? (
                  <>
                    <p className="text-sm font-light text-neutral-500">No datasets match &ldquo;{refineFilter}&rdquo;</p>
                    <button
                      onClick={() => setRefineFilter("")}
                      className="text-sm font-light text-neutral-400 hover:text-neutral-600 mt-2 underline"
                    >
                      Clear filter
                    </button>
                  </>
                ) : (
                  <p className="text-sm font-light text-neutral-500">No datasets in selection</p>
                )}
              </div>
            ) : (
              filteredAndSortedRefineSelection.map((dataset) => (
                <div
                  key={dataset.id}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-neutral-100 hover:border-neutral-200 hover:bg-neutral-50 transition-all group"
                >
                  <div className="shrink-0 w-24">
                    <p className="text-sm font-medium text-neutral-900">{dataset.code}</p>
                  </div>
                  <div className="flex-1 min-w-[150px]">
                    <p className="text-sm font-light text-neutral-700 truncate">{dataset.name}</p>
                  </div>
                  <div className="shrink-0 w-24">
                    <Badge variant="outline" className="font-light text-xs">
                      {dataset.therapeuticArea[0] || "N/A"}
                    </Badge>
                  </div>
                  <div className="shrink-0 w-20">
                    <span className="text-sm font-light text-neutral-600">{dataset.phase}</span>
                  </div>
                  <div className="shrink-0 w-20">
                    <Badge
                      className={cn(
                        "font-light text-xs",
                        dataset.status === "Closed" ? "bg-green-100 text-green-800" :
                        dataset.status === "Active" ? "bg-amber-100 text-amber-800" :
                        dataset.status === "Grey Zone" ? "bg-orange-100 text-orange-800" :
                        "bg-neutral-100 text-neutral-600"
                      )}
                    >
                      {dataset.status}
                    </Badge>
                  </div>
                  <div className="shrink-0 w-20">
                    {dataset.isLocked ? (
                      <Badge className="font-light text-xs bg-green-100 text-green-700">
                        <Lock className="size-3 mr-1" />
                        Yes
                      </Badge>
                    ) : (
                      <span className="text-xs font-light text-neutral-400">No</span>
                    )}
                  </div>
                  <div className="shrink-0 w-24">
                    <Badge
                      className={cn(
                        "font-light text-xs",
                        dataset.dataProductRights === "Research Allowed" ? "bg-green-100 text-green-700" :
                        dataset.dataProductRights === "Research Not Allowed" ? "bg-red-100 text-red-700" :
                        "bg-amber-100 text-amber-700"
                      )}
                    >
                      {dataset.dataProductRights === "Research Allowed" ? "Allowed" :
                       dataset.dataProductRights === "Research Not Allowed" ? "Not Allowed" : "Review"}
                    </Badge>
                  </div>
                  <div className="shrink-0 w-24">
                    <span className={cn(
                      "text-xs font-light",
                      dataset.dataAvailability === "Location Unknown" ? "text-amber-600" : "text-neutral-600"
                    )}>
                      {dataset.dataAvailability.replace("In ", "")}
                    </span>
                  </div>
                  <div className="shrink-0 w-28">
                    <span className="text-xs font-light text-neutral-600 truncate block" title={dataset.modalities.join(", ")}>
                      {dataset.modalities.slice(0, 2).join(", ")}{dataset.modalities.length > 2 ? ` +${dataset.modalities.length - 2}` : ""}
                    </span>
                  </div>
                  <div className="shrink-0 w-20 text-right">
                    <span className="text-sm font-light text-neutral-600">
                      {dataset.patientCount.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-10 flex justify-end">
                    <button
                      onClick={() => removeFromRefineSelection(dataset.id)}
                      className="size-8 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 text-neutral-400 hover:text-red-600 transition-all"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <DialogFooter className="mt-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between w-full">
              <div className="text-sm font-light text-neutral-500">
                {refineSelection.length !== localSelectedDatasets.length && (
                  <span className="text-amber-600">
                    {localSelectedDatasets.length - refineSelection.length} dataset{localSelectedDatasets.length - refineSelection.length !== 1 ? "s" : ""} will be removed
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  onClick={() => setRefineModalOpen(false)}
                  className="rounded-xl font-light"
                >
                  Cancel
                </Button>
                <Button
                  onClick={applyRefineSelection}
                  className={cn(
                    "rounded-xl font-light bg-gradient-to-r text-white shadow-md hover:shadow-lg",
                    scheme.from,
                    scheme.to
                  )}
                >
                  <Check className="size-4 mr-2" />
                  Apply Changes
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

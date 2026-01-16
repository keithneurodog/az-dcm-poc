"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  ArrowLeft,
  Sliders,
  Database,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Layers,
  Globe,
  Building,
  Users,
  Zap,
  Sparkles,
  X,
  Loader2,
  Check,
  FileText,
  Shield,
  Target,
  Microscope,
  Calendar,
  Pencil,
  HelpCircle,
  Filter,
  CheckCircle2,
  Info,
  Lightbulb,
  Clock,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  DataCategory,
  MOCK_DATASETS,
  Dataset,
  filterDatasets,
} from "@/lib/dcm-mock-data"

export default function DCMFiltersPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [selectedCategories, setSelectedCategories] = useState<DataCategory[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([])

  // Smart Filter state
  const [smartFilterInput, setSmartFilterInput] = useState("")
  const [smartFilterActive, setSmartFilterActive] = useState(false)
  const [smartFilterQuery, setSmartFilterQuery] = useState("")
  const [isSmartFiltering, setIsSmartFiltering] = useState(false)
  const [showSmartInput, setShowSmartInput] = useState(false)

  // Basic Filters state
  const [phaseFilters, setPhaseFilters] = useState<string[]>(["III"])
  const [statusFilters, setStatusFilters] = useState<string[]>(["Closed"])
  const [geographyFilters, setGeographyFilters] = useState<string[]>([])
  const [therapeuticAreaFilters, setTherapeuticAreaFilters] = useState<string[]>([])
  const [dataModalityFilters, setDataModalityFilters] = useState<string[]>([])

  // Data Reuse Filters
  const [internalReuseFilters, setInternalReuseFilters] = useState<string[]>([])
  const [externalReuseFilters, setExternalReuseFilters] = useState<string[]>([])

  // Additional Filters
  const [indicationsFilters, setIndicationsFilters] = useState<string[]>([])
  const [studyRunByFilters, setStudyRunByFilters] = useState<string[]>([])
  const [studyObjectivesFilters, setStudyObjectivesFilters] = useState<string[]>([])
  const [patientPopulationFilters, setPatientPopulationFilters] = useState<string[]>([])

  // Collection Context Filters
  const [crossoverFilter, setCrossoverFilter] = useState<string[]>(["moderate"])
  const [usageFilter, setUsageFilter] = useState<string[]>(["high", "medium"])

  // Advanced Filters
  const [nctIdentifier, setNctIdentifier] = useState("")
  const [eudraCTIdentifier, setEudraCTIdentifier] = useState("")

  // Filtered datasets
  const [filteredDatasets, setFilteredDatasets] = useState<Dataset[]>([])

  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const datasetsPerPage = 15

  // Selected datasets
  const [selectedDatasets, setSelectedDatasets] = useState<Set<string>>(new Set())

  // Filter panel expansion state
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  // Selection cart expanded state
  const [cartExpanded, setCartExpanded] = useState(true)

  // Calculate pagination
  const totalPages = Math.ceil(filteredDatasets.length / datasetsPerPage)
  const startIndex = (currentPage - 1) * datasetsPerPage
  const endIndex = startIndex + datasetsPerPage
  const paginatedDatasets = filteredDatasets.slice(startIndex, endIndex)

  useEffect(() => {
    // Get selected categories from sessionStorage
    if (typeof window !== "undefined") {
      const storedCategories = sessionStorage.getItem("dcm_selected_categories")
      if (!storedCategories) {
        router.push("/collectoid/dcm/create")
        return
      }

      const categories = JSON.parse(storedCategories) as DataCategory[]
      setSelectedCategories(categories)
      setSelectedCategoryIds(categories.map((c) => c.id))
    }
  }, [router])

  useEffect(() => {
    // Filter datasets
    const filtered = filterDatasets(MOCK_DATASETS, {
      categories: selectedCategoryIds,
      phase: phaseFilters.length > 0 ? phaseFilters : undefined,
      status: statusFilters.length > 0 ? statusFilters : undefined,
      geography: geographyFilters.length > 0 ? geographyFilters : undefined,
      crossover: crossoverFilter.length > 0 ? crossoverFilter[0] : undefined,
      usage: usageFilter.length > 0 ? usageFilter[0] : undefined,
    })
    setFilteredDatasets(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [
    selectedCategoryIds,
    phaseFilters,
    statusFilters,
    geographyFilters,
    crossoverFilter,
    usageFilter,
  ])

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

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section)
  }

  const toggleDataset = (datasetId: string) => {
    const newSelected = new Set(selectedDatasets)
    if (newSelected.has(datasetId)) {
      newSelected.delete(datasetId)
    } else {
      newSelected.add(datasetId)
    }
    setSelectedDatasets(newSelected)
  }

  const handleContinue = () => {
    // Store selected datasets in sessionStorage
    if (typeof window !== "undefined") {
      const selected = Array.from(selectedDatasets)
        .map((id) => MOCK_DATASETS.find((d) => d.id === id))
        .filter(Boolean)
      sessionStorage.setItem("dcm_selected_datasets", JSON.stringify(selected))
    }
    router.push("/collectoid/dcm/create/activities")
  }

  const addAllFilteredDatasets = () => {
    const allFilteredIds = new Set(filteredDatasets.map(d => d.id))
    setSelectedDatasets(new Set([...selectedDatasets, ...allFilteredIds]))
  }

  const addAllOnPage = () => {
    const pageIds = new Set(paginatedDatasets.map(d => d.id))
    setSelectedDatasets(new Set([...selectedDatasets, ...pageIds]))
  }

  const removeAllFilteredDatasets = () => {
    const filteredIds = new Set(filteredDatasets.map(d => d.id))
    const newSelected = new Set(
      Array.from(selectedDatasets).filter(id => !filteredIds.has(id))
    )
    setSelectedDatasets(newSelected)
  }

  // Calculate aggregate access breakdown
  const calculateAccessBreakdown = () => {
    if (selectedDatasets.size === 0) return null

    const selected = Array.from(selectedDatasets)
      .map((id) => MOCK_DATASETS.find((d) => d.id === id))
      .filter(Boolean) as Dataset[]

    const total = selected.length
    const breakdown = {
      alreadyOpen: 0,
      readyToGrant: 0,
      needsApproval: 0,
      missingLocation: 0,
    }

    selected.forEach((dataset) => {
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

  const accessBreakdown = calculateAccessBreakdown()

  // Sheet state for filters
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)

  if (selectedCategories.length === 0) {
    return <div>Loading...</div>
  }

  // Filter panel content (reusable in Sheet)
  const FilterPanelContent = () => (
    <div className="space-y-3">
            {/* Study Characteristics */}
            <div className="rounded-xl border border-neutral-200 overflow-hidden">
              <button
                onClick={() => toggleSection("study")}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Database className="size-4 text-neutral-600" />
                  <span className="text-sm font-normal text-neutral-900">Study Characteristics</span>
                </div>
                {expandedSection === "study" ? (
                  <ChevronUp className="size-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="size-4 text-neutral-400" />
                )}
              </button>

              {expandedSection === "study" && (
                <div className="p-4 pt-0 space-y-4 border-t border-neutral-100">
                  {/* Phase */}
                  <div>
                    <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Phase</p>
                    <div className="space-y-2">
                      {["I", "II", "III", "IV"].map((phase) => (
                        <label key={phase} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={phaseFilters.includes(phase)}
                            onCheckedChange={() => toggleFilter(phaseFilters, setPhaseFilters, phase)}
                          />
                          <span className="text-sm font-light text-neutral-700">Phase {phase}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Status</p>
                    <div className="space-y-2">
                      {["Active", "Closed"].map((status) => (
                        <label key={status} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={statusFilters.includes(status)}
                            onCheckedChange={() => toggleFilter(statusFilters, setStatusFilters, status)}
                          />
                          <span className="text-sm font-light text-neutral-700">{status}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Therapeutic Area */}
                  <div>
                    <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Therapeutic Area</p>
                    <div className="space-y-2">
                      {["Oncology", "Cardiology", "Neurology", "Immunology", "Endocrinology"].map((ta) => (
                        <label key={ta} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={therapeuticAreaFilters.includes(ta)}
                            onCheckedChange={() => toggleFilter(therapeuticAreaFilters, setTherapeuticAreaFilters, ta)}
                          />
                          <span className="text-sm font-light text-neutral-700">{ta}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Geography */}
                  <div>
                    <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Geography</p>
                    <div className="space-y-2">
                      {["US", "EU", "Asia", "Global"].map((geo) => (
                        <label key={geo} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={geographyFilters.includes(geo)}
                            onCheckedChange={() => toggleFilter(geographyFilters, setGeographyFilters, geo)}
                          />
                          <span className="text-sm font-light text-neutral-700">{geo}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Patient Population */}
                  <div>
                    <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Patient Population</p>
                    <div className="space-y-2">
                      {[
                        { value: "small", label: "Small (<200)" },
                        { value: "medium", label: "Medium (200-500)" },
                        { value: "large", label: "Large (500-1000)" },
                        { value: "very-large", label: "Very Large (1000+)" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={patientPopulationFilters.includes(option.value)}
                            onCheckedChange={() => toggleFilter(patientPopulationFilters, setPatientPopulationFilters, option.value)}
                          />
                          <span className="text-sm font-light text-neutral-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Study Objectives */}
                  <div>
                    <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Study Objectives</p>
                    <div className="space-y-2">
                      {["Efficacy", "Safety", "Pharmacokinetics", "Biomarker Discovery", "Quality of Life"].map((obj) => (
                        <label key={obj} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={studyObjectivesFilters.includes(obj)}
                            onCheckedChange={() => toggleFilter(studyObjectivesFilters, setStudyObjectivesFilters, obj)}
                          />
                          <span className="text-sm font-light text-neutral-700">{obj}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Data Reuse & Compliance */}
            <div className="rounded-xl border border-neutral-200 overflow-hidden">
              <button
                onClick={() => toggleSection("reuse")}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Shield className="size-4 text-neutral-600" />
                  <span className="text-sm font-normal text-neutral-900">Data Reuse & Compliance</span>
                </div>
                {expandedSection === "reuse" ? (
                  <ChevronUp className="size-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="size-4 text-neutral-400" />
                )}
              </button>

              {expandedSection === "reuse" && (
                <div className="p-4 pt-0 space-y-4 border-t border-neutral-100">
                  {/* Internal Data Reuse */}
                  <div>
                    <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Internal Data Reuse</p>
                    <div className="space-y-2">
                      {["Research allowed", "Research not allowed", "Research with restriction"].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={internalReuseFilters.includes(option)}
                            onCheckedChange={() => toggleFilter(internalReuseFilters, setInternalReuseFilters, option)}
                          />
                          <span className="text-sm font-light text-neutral-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* External Data Reuse */}
                  <div>
                    <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">External Data Reuse</p>
                    <div className="space-y-2">
                      {["Research allowed", "Research not allowed", "Research with restriction"].map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={externalReuseFilters.includes(option)}
                            onCheckedChange={() => toggleFilter(externalReuseFilters, setExternalReuseFilters, option)}
                          />
                          <span className="text-sm font-light text-neutral-700">{option}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Data Modalities */}
            <div className="rounded-xl border border-neutral-200 overflow-hidden">
              <button
                onClick={() => toggleSection("modality")}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Microscope className="size-4 text-neutral-600" />
                  <span className="text-sm font-normal text-neutral-900">Data Modalities</span>
                </div>
                {expandedSection === "modality" ? (
                  <ChevronUp className="size-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="size-4 text-neutral-400" />
                )}
              </button>

              {expandedSection === "modality" && (
                <div className="p-4 pt-0 space-y-2 border-t border-neutral-100">
                  {["Clinical", "Genomic", "Imaging (DICOM)", "Biomarker", "Patient Reported Outcomes"].map((modality) => (
                    <label key={modality} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={dataModalityFilters.includes(modality)}
                        onCheckedChange={() => toggleFilter(dataModalityFilters, setDataModalityFilters, modality)}
                      />
                      <span className="text-sm font-light text-neutral-700">{modality}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Study Sponsor */}
            <div className="rounded-xl border border-neutral-200 overflow-hidden">
              <button
                onClick={() => toggleSection("sponsor")}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Building className="size-4 text-neutral-600" />
                  <span className="text-sm font-normal text-neutral-900">Study Run By</span>
                </div>
                {expandedSection === "sponsor" ? (
                  <ChevronUp className="size-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="size-4 text-neutral-400" />
                )}
              </button>

              {expandedSection === "sponsor" && (
                <div className="p-4 pt-0 space-y-2 border-t border-neutral-100">
                  {["Sponsor", "Investigator-Initiated", "Academic", "Government", "Consortium"].map((sponsor) => (
                    <label key={sponsor} className="flex items-center gap-2 cursor-pointer">
                      <Checkbox
                        checked={studyRunByFilters.includes(sponsor)}
                        onCheckedChange={() => toggleFilter(studyRunByFilters, setStudyRunByFilters, sponsor)}
                      />
                      <span className="text-sm font-light text-neutral-700">{sponsor}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Collection Context */}
            <div className="rounded-xl border border-neutral-200 overflow-hidden">
              <button
                onClick={() => toggleSection("collection")}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Layers className="size-4 text-neutral-600" />
                  <span className="text-sm font-normal text-neutral-900">Collection Context</span>
                </div>
                {expandedSection === "collection" ? (
                  <ChevronUp className="size-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="size-4 text-neutral-400" />
                )}
              </button>

              {expandedSection === "collection" && (
                <div className="p-4 pt-0 space-y-4 border-t border-neutral-100">
                  {/* Crossover */}
                  <div>
                    <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Collection Crossover</p>
                    <div className="space-y-2">
                      {[
                        { value: "none", label: "New (0 collections)" },
                        { value: "moderate", label: "Moderate (1-3)" },
                        { value: "high", label: "High (4+)" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={crossoverFilter.includes(option.value)}
                            onCheckedChange={() => toggleFilter(crossoverFilter, setCrossoverFilter, option.value)}
                          />
                          <span className="text-sm font-light text-neutral-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Usage */}
                  <div>
                    <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">Usage Patterns</p>
                    <div className="space-y-2">
                      {[
                        { value: "high", label: "High (50+ users)" },
                        { value: "medium", label: "Medium (10-50)" },
                        { value: "low", label: "Low (<10)" },
                      ].map((option) => (
                        <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={usageFilter.includes(option.value)}
                            onCheckedChange={() => toggleFilter(usageFilter, setUsageFilter, option.value)}
                          />
                          <span className="text-sm font-light text-neutral-700">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Advanced Filters */}
            <div className="rounded-xl border border-neutral-200 overflow-hidden">
              <button
                onClick={() => toggleSection("advanced")}
                className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-neutral-600" />
                  <span className="text-sm font-normal text-neutral-900">Advanced Filters</span>
                </div>
                {expandedSection === "advanced" ? (
                  <ChevronUp className="size-4 text-neutral-400" />
                ) : (
                  <ChevronDown className="size-4 text-neutral-400" />
                )}
              </button>

              {expandedSection === "advanced" && (
                <div className="p-4 pt-0 space-y-3 border-t border-neutral-100">
                  <div>
                    <label className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider block">
                      NCT Identifier
                    </label>
                    <Input
                      value={nctIdentifier}
                      onChange={(e) => setNctIdentifier(e.target.value)}
                      placeholder="e.g., NCT01234567"
                      className="h-9 text-sm font-light border-neutral-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider block">
                      EudraCT Identifier
                    </label>
                    <Input
                      value={eudraCTIdentifier}
                      onChange={(e) => setEudraCTIdentifier(e.target.value)}
                      placeholder="e.g., 2020-123456-12"
                      className="h-9 text-sm font-light border-neutral-200 rounded-lg"
                    />
                  </div>
                </div>
              )}
            </div>
    </div>
  )

  // Reset all filters function
  const resetAllFilters = () => {
    clearSmartFilter()
    setPhaseFilters([])
    setStatusFilters([])
    setGeographyFilters([])
    setTherapeuticAreaFilters([])
    setDataModalityFilters([])
    setInternalReuseFilters([])
    setExternalReuseFilters([])
    setIndicationsFilters([])
    setStudyRunByFilters([])
    setStudyObjectivesFilters([])
    setPatientPopulationFilters([])
    setCrossoverFilter([])
    setUsageFilter([])
    setNctIdentifier("")
    setEudraCTIdentifier("")
  }

  return (
    <div className="flex gap-6 py-8">
      {/* Main Content */}
      <div className="flex-1 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/collectoid/dcm/create/categories")}
            className="rounded-full font-light mb-4"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Categories
          </Button>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 3 of 7</span>
            <span className="text-xs text-neutral-300">|</span>
            <span className="text-xs font-light text-neutral-600">Select Datasets</span>
          </div>

          <div className="text-center mb-6">
            <div
              className={cn(
                "inline-flex items-center justify-center size-16 rounded-2xl mb-4 bg-gradient-to-br",
                scheme.bg,
                scheme.bgHover
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

            {/* Help Link */}
            <Sheet>
              <SheetTrigger asChild>
                <button className={cn(
                  "inline-flex items-center gap-2 text-sm font-light transition-colors",
                  scheme.from.replace("from-", "text-"),
                  "hover:underline"
                )}>
                  <HelpCircle className="size-4" />
                  Learn about smart filtering
                </button>
              </SheetTrigger>
                <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
                  <div className="px-6 pb-6">
                    <SheetHeader>
                      <SheetTitle className="text-2xl font-light text-neutral-900 flex items-center gap-2">
                        <Filter className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                        Smart Filtering Explained
                      </SheetTitle>
                      <SheetDescription className="font-light">
                        Understanding multi-dimensional dataset refinement
                      </SheetDescription>
                    </SheetHeader>

                    <div className="mt-6 space-y-6">
                      {/* Overview */}
                      <div>
                        <h3 className="text-lg font-normal text-neutral-900 mb-3">What is this screen for?</h3>
                        <p className="text-sm font-light text-neutral-700 leading-relaxed">
                          After selecting your data categories, this screen helps you narrow down the exact studies
                          you need. Think of it as a sophisticated search tool that lets you combine different
                          filtering approaches to find the perfect datasets for your collection.
                        </p>
                      </div>

                      <Separator />

                      {/* Two Filtering Approaches */}
                      <div>
                        <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                          <Zap className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                          Two Ways to Filter
                        </h3>
                        <div className="space-y-3">
                          <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "flex size-8 shrink-0 items-center justify-center rounded-full text-white bg-gradient-to-br",
                                scheme.from,
                                scheme.to
                              )}>
                                <Sparkles className="size-4" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-normal text-neutral-900 mb-2">AI Smart Filter (Recommended)</h4>
                                <p className="text-xs font-light text-neutral-600 leading-relaxed mb-2">
                                  Describe what you&apos;re looking for in plain language. The AI understands complex
                                  requirements and applies intelligent semantic filtering.
                                </p>
                                <p className="text-xs font-light text-neutral-500 italic">
                                  Example: &quot;Show me recent oncology studies with imaging data in Europe&quot;
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                            <div className="flex items-start gap-3">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
                                <Sliders className="size-4" />
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-normal text-neutral-900 mb-2">Traditional Filters (Left Sidebar)</h4>
                                <p className="text-xs font-light text-neutral-600 leading-relaxed mb-2">
                                  Use checkboxes and dropdowns to filter by specific criteria like phase, status,
                                  geography, and more. Perfect for precise, structured filtering.
                                </p>
                                <p className="text-xs font-light text-neutral-500 italic">
                                  Tip: You can combine both approaches for maximum precision!
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Filter Dimensions */}
                      <div>
                        <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                          <Layers className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                          Filter Dimensions Available
                        </h3>
                        <div className="space-y-2 text-sm font-light text-neutral-700">
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className={cn("size-4 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                            <div>
                              <span className="font-normal">Study Characteristics</span> - Phase, status, therapeutic area,
                              geography, patient population, objectives
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className={cn("size-4 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                            <div>
                              <span className="font-normal">Data Reuse & Compliance</span> - Internal/external research
                              permissions and restrictions
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className={cn("size-4 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                            <div>
                              <span className="font-normal">Data Modalities</span> - Clinical, genomic, imaging, biomarker,
                              patient-reported outcomes
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className={cn("size-4 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                            <div>
                              <span className="font-normal">Collection Context</span> - Crossover (how many other collections
                              include this data) and usage patterns
                            </div>
                          </div>
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className={cn("size-4 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
                            <div>
                              <span className="font-normal">Study Sponsor</span> - Who ran the study (sponsor, investigator,
                              academic, etc.)
                            </div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Live Results */}
                      <div>
                        <h3 className="text-lg font-normal text-neutral-900 mb-3 flex items-center gap-2">
                          <TrendingUp className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                          Real-Time Result Updates
                        </h3>
                        <p className="text-sm font-light text-neutral-700 leading-relaxed mb-3">
                          As you adjust filters, the dataset count updates instantly. You&apos;ll see:
                        </p>
                        <div className="space-y-2 text-sm font-light text-neutral-700">
                          <div className="flex items-start gap-2">
                            <div className="size-1.5 rounded-full bg-green-500 shrink-0 mt-2" />
                            <div>How many datasets match your criteria</div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="size-1.5 rounded-full bg-blue-500 shrink-0 mt-2" />
                            <div>Which specific studies meet your requirements</div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="size-1.5 rounded-full bg-amber-500 shrink-0 mt-2" />
                            <div>Access eligibility breakdown for each dataset</div>
                          </div>
                          <div className="flex items-start gap-2">
                            <div className="size-1.5 rounded-full bg-purple-500 shrink-0 mt-2" />
                            <div>Smart suggestions (frequently bundled datasets)</div>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Selection Cart */}
                      <div>
                        <h3 className="text-lg font-normal text-neutral-900 mb-3 flex items-center gap-2">
                          <Database className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                          Building Your Collection
                        </h3>
                        <p className="text-sm font-light text-neutral-700 leading-relaxed mb-3">
                          Click &quot;Add to Collection&quot; on any dataset to include it. Your selections appear in:
                        </p>
                        <div className="space-y-2">
                          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                            <p className="text-xs font-normal text-neutral-900 mb-1">Right Sidebar (if visible)</p>
                            <p className="text-xs font-light text-neutral-600">
                              Quick access panel showing all your selected datasets with mini access breakdowns
                            </p>
                          </div>
                          <div className="rounded-xl bg-neutral-50 border border-neutral-200 p-3">
                            <p className="text-xs font-normal text-neutral-900 mb-1">Bottom Floating Cart</p>
                            <p className="text-xs font-light text-neutral-600">
                              Aggregate view with combined access provisioning breakdown and continue button
                            </p>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Tips */}
                      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                        <div className="flex gap-3">
                          <Lightbulb className="size-5 shrink-0 text-blue-600 mt-0.5" />
                          <div className="text-sm font-light text-blue-900">
                            <p className="mb-2 font-normal">Pro Tips</p>
                            <ul className="text-blue-700 leading-relaxed space-y-1 text-xs">
                              <li>• Start broad with AI Smart Filter, then refine with traditional filters</li>
                              <li>• Watch the &quot;Collection Crossover&quot; info to avoid duplicate data</li>
                              <li>• Check &quot;Frequently bundled with&quot; suggestions for related datasets</li>
                              <li>• Use the access breakdown to understand provisioning complexity</li>
                              <li>• You can always go back and adjust your category selections</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* What's Next */}
                      <div className="rounded-xl bg-green-50 border border-green-100 p-4">
                        <div className="flex gap-3">
                          <Info className="size-5 shrink-0 text-green-600 mt-0.5" />
                          <div className="text-sm font-light text-green-900">
                            <p className="mb-2 font-normal">What happens next?</p>
                            <p className="text-green-700 leading-relaxed text-xs">
                              After selecting your datasets, you&apos;ll define the activities and intents for your collection
                              (data engineering vs. scientific analysis), which affects access provisioning levels.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
          </div>
        </div>

        {/* Compact Filter Panel - Always Visible */}
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
                {(phaseFilters.length > 0 || statusFilters.length > 0 || geographyFilters.length > 0 ||
                  therapeuticAreaFilters.length > 0 || dataModalityFilters.length > 0 || studyRunByFilters.length > 0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetAllFilters}
                    className="h-8 rounded-lg font-light text-xs text-neutral-500 hover:text-neutral-700"
                  >
                    <X className="size-3 mr-1" />
                    Clear All
                  </Button>
                )}
                {filteredDatasets.length > 0 && (
                  <Button
                    size="sm"
                    onClick={addAllFilteredDatasets}
                    className={cn(
                      "h-8 rounded-lg font-light text-xs bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
                      scheme.from,
                      scheme.to
                    )}
                  >
                    <Check className="size-3.5 mr-1.5" />
                    Add All {filteredDatasets.length}
                  </Button>
                )}
              </div>
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
                    {["I", "II", "III", "IV"].map((phase) => (
                      <label key={phase} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={phaseFilters.includes(phase)}
                          onCheckedChange={() => toggleFilter(phaseFilters, setPhaseFilters, phase)}
                          className="size-3.5"
                        />
                        <span className="text-sm font-light text-neutral-700">Phase {phase}</span>
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
                <PopoverContent className="w-36 p-2" align="start">
                  <div className="space-y-1">
                    {["Active", "Closed"].map((status) => (
                      <label key={status} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={statusFilters.includes(status)}
                          onCheckedChange={() => toggleFilter(statusFilters, setStatusFilters, status)}
                          className="size-3.5"
                        />
                        <span className="text-sm font-light text-neutral-700">{status}</span>
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
                    {["North America", "Europe", "Asia Pacific", "Latin America", "Middle East", "Africa", "Global"].map((geo) => (
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
                      therapeuticAreaFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    <Target className="size-3 mr-1" />
                    Therapeutic
                    {therapeuticAreaFilters.length > 0 && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {therapeuticAreaFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <div className="space-y-1 max-h-48 overflow-y-auto">
                    {["Oncology", "Cardiovascular", "Neurology", "Immunology", "Respiratory", "Rare Disease", "Infectious Disease"].map((area) => (
                      <label key={area} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={therapeuticAreaFilters.includes(area)}
                          onCheckedChange={() => toggleFilter(therapeuticAreaFilters, setTherapeuticAreaFilters, area)}
                          className="size-3.5"
                        />
                        <span className="text-sm font-light text-neutral-700">{area}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Data Modality Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg font-light text-xs border-neutral-200",
                      dataModalityFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    <Microscope className="size-3 mr-1" />
                    Modality
                    {dataModalityFilters.length > 0 && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {dataModalityFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-2" align="start">
                  <div className="space-y-1">
                    {["Clinical", "Genomic", "Imaging (DICOM)", "Biomarker", "Patient Reported Outcomes"].map((modality) => (
                      <label key={modality} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={dataModalityFilters.includes(modality)}
                          onCheckedChange={() => toggleFilter(dataModalityFilters, setDataModalityFilters, modality)}
                          className="size-3.5"
                        />
                        <span className="text-sm font-light text-neutral-700">{modality}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Study Run By Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg font-light text-xs border-neutral-200",
                      studyRunByFilters.length > 0 && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    <Building className="size-3 mr-1" />
                    Sponsor
                    {studyRunByFilters.length > 0 && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {studyRunByFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2" align="start">
                  <div className="space-y-1">
                    {["Sponsor", "Investigator-Initiated", "Academic", "Government", "Consortium"].map((sponsor) => (
                      <label key={sponsor} className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-neutral-50 cursor-pointer">
                        <Checkbox
                          checked={studyRunByFilters.includes(sponsor)}
                          onCheckedChange={() => toggleFilter(studyRunByFilters, setStudyRunByFilters, sponsor)}
                          className="size-3.5"
                        />
                        <span className="text-sm font-light text-neutral-700">{sponsor}</span>
                      </label>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>

              {/* Data Sharing Filter */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-8 rounded-lg font-light text-xs border-neutral-200",
                      (internalReuseFilters.length > 0 || externalReuseFilters.length > 0) && cn(scheme.from.replace("from-", "border-"), scheme.from.replace("from-", "bg-").replace("500", "50"))
                    )}
                  >
                    <Shield className="size-3 mr-1" />
                    Sharing
                    {(internalReuseFilters.length + externalReuseFilters.length) > 0 && (
                      <Badge className={cn("ml-1.5 h-4 px-1.5 text-[10px]", scheme.from.replace("from-", "bg-"), "text-white")}>
                        {internalReuseFilters.length + externalReuseFilters.length}
                      </Badge>
                    )}
                    <ChevronDown className="size-3 ml-1 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-neutral-500 px-2 mb-1">Internal Reuse</p>
                      <div className="space-y-1">
                        {["Research allowed", "Research not allowed", "Research with restriction"].map((option) => (
                          <label key={`int-${option}`} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-neutral-50 cursor-pointer">
                            <Checkbox
                              checked={internalReuseFilters.includes(option)}
                              onCheckedChange={() => toggleFilter(internalReuseFilters, setInternalReuseFilters, option)}
                              className="size-3.5"
                            />
                            <span className="text-xs font-light text-neutral-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-neutral-500 px-2 mb-1">External Reuse</p>
                      <div className="space-y-1">
                        {["Research allowed", "Research not allowed", "Research with restriction"].map((option) => (
                          <label key={`ext-${option}`} className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-neutral-50 cursor-pointer">
                            <Checkbox
                              checked={externalReuseFilters.includes(option)}
                              onCheckedChange={() => toggleFilter(externalReuseFilters, setExternalReuseFilters, option)}
                              className="size-3.5"
                            />
                            <span className="text-xs font-light text-neutral-700">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* More Filters (Identifiers) */}
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
            </div>
          </CardContent>
        </Card>

        {/* Active Filters Summary */}
          {(phaseFilters.length > 0 ||
            statusFilters.length > 0 ||
            geographyFilters.length > 0 ||
            therapeuticAreaFilters.length > 0 ||
            patientPopulationFilters.length > 0 ||
            studyObjectivesFilters.length > 0 ||
            internalReuseFilters.length > 0 ||
            externalReuseFilters.length > 0 ||
            dataModalityFilters.length > 0 ||
            studyRunByFilters.length > 0 ||
            crossoverFilter.length > 0 ||
            usageFilter.length > 0 ||
            nctIdentifier ||
            eudraCTIdentifier ||
            smartFilterActive) && (
            <div className="space-y-2">
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
                      setShowSmartInput(false)
                    }}
                  >
                    <Sparkles className="size-3 inline mr-1" />
                    AI: &quot;{smartFilterQuery.substring(0, 30)}{smartFilterQuery.length > 30 ? '...' : ''}&quot;
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                )}

                {/* Phase Filters */}
                {phaseFilters.map((phase) => (
                  <Badge
                    key={phase}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(phaseFilters, setPhaseFilters, phase)}
                  >
                    Phase {phase}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* Status Filters */}
                {statusFilters.map((status) => (
                  <Badge
                    key={status}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(statusFilters, setStatusFilters, status)}
                  >
                    {status}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* Geography Filters */}
                {geographyFilters.map((geo) => (
                  <Badge
                    key={geo}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(geographyFilters, setGeographyFilters, geo)}
                  >
                    {geo}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* Therapeutic Area Filters */}
                {therapeuticAreaFilters.map((ta) => (
                  <Badge
                    key={ta}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(therapeuticAreaFilters, setTherapeuticAreaFilters, ta)}
                  >
                    {ta}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* Patient Population Filters */}
                {patientPopulationFilters.map((pop) => (
                  <Badge
                    key={pop}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(patientPopulationFilters, setPatientPopulationFilters, pop)}
                  >
                    {pop}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* Study Objectives Filters */}
                {studyObjectivesFilters.map((obj) => (
                  <Badge
                    key={obj}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(studyObjectivesFilters, setStudyObjectivesFilters, obj)}
                  >
                    {obj}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* Internal Reuse Filters */}
                {internalReuseFilters.map((reuse) => (
                  <Badge
                    key={reuse}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(internalReuseFilters, setInternalReuseFilters, reuse)}
                  >
                    Internal: {reuse}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* External Reuse Filters */}
                {externalReuseFilters.map((reuse) => (
                  <Badge
                    key={reuse}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(externalReuseFilters, setExternalReuseFilters, reuse)}
                  >
                    External: {reuse}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* Modality Filters */}
                {dataModalityFilters.map((modality) => (
                  <Badge
                    key={modality}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(dataModalityFilters, setDataModalityFilters, modality)}
                  >
                    {modality}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* Sponsor Filters */}
                {studyRunByFilters.map((sponsor) => (
                  <Badge
                    key={sponsor}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(studyRunByFilters, setStudyRunByFilters, sponsor)}
                  >
                    {sponsor}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* Collection Context Filters - Crossover */}
                {crossoverFilter.map((crossover) => (
                  <Badge
                    key={crossover}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(crossoverFilter, setCrossoverFilter, crossover)}
                  >
                    Crossover: {crossover}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* Collection Context Filters - Usage */}
                {usageFilter.map((usage) => (
                  <Badge
                    key={usage}
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => toggleFilter(usageFilter, setUsageFilter, usage)}
                  >
                    Usage: {usage}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                ))}

                {/* NCT Identifier */}
                {nctIdentifier && (
                  <Badge
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => setNctIdentifier("")}
                  >
                    NCT: {nctIdentifier}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                )}

                {/* EudraCT Identifier */}
                {eudraCTIdentifier && (
                  <Badge
                    variant="outline"
                    className="font-light pl-3 pr-2 py-1 group cursor-pointer hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
                    onClick={() => setEudraCTIdentifier("")}
                  >
                    EudraCT: {eudraCTIdentifier}
                    <X className="size-3 ml-1.5 inline" />
                  </Badge>
                )}
              </div>
            </div>
          )}

        {/* Smart Filter - Central Component */}
        <div className="px-6 pt-4 pb-4">
          {!smartFilterQuery && !showSmartInput ? (
            <button
              onClick={() => setShowSmartInput(true)}
              className={cn(
                "w-full max-w-5xl rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 hover:bg-neutral-100 transition-all p-6 text-left group"
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
            <div className="max-w-5xl rounded-2xl border-2 border-neutral-200 bg-white shadow-lg p-6">
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
                    placeholder='e.g., &quot;Show me recent oncology studies with imaging data in Europe&quot; or &quot;Find small patient population studies that need data sharing approvals&quot;'
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
        <div className="flex-1 overflow-y-auto px-6">
          <div className="space-y-4 max-w-5xl pb-6">
            {paginatedDatasets.length === 0 ? (
              <div className="text-center py-12">
                <Database className="size-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-sm font-light text-neutral-600">No datasets match your filters</p>
              </div>
            ) : (
              paginatedDatasets.map((dataset) => (
              <Card
                key={dataset.id}
                className="border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all"
              >
                <CardContent className="px-4 py-3">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-normal text-neutral-900">{dataset.name}</h3>
                        <Badge variant="outline" className="font-light">
                          {dataset.code}
                        </Badge>
                        <Badge
                          className={cn(
                            "font-light",
                            dataset.status === "Closed"
                              ? "bg-green-100 text-green-800"
                              : "bg-amber-100 text-amber-800"
                          )}
                        >
                          {dataset.status}
                        </Badge>
                      </div>
                      <p className="text-sm font-light text-neutral-600 mb-1.5">
                        {dataset.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs font-light text-neutral-500">
                        <span>{dataset.patientCount} patients</span>
                        <span>•</span>
                        <span>Phase {dataset.phase}</span>
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
                    <div
                      className={cn("rounded-xl p-2.5 mb-2.5", scheme.bg.replace("500", "50"))}
                    >
                      <div className="flex items-start gap-2">
                        <Layers
                          className={cn(
                            "size-4 shrink-0 mt-0.5",
                            scheme.from.replace("from-", "text-")
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-normal text-neutral-900 mb-1">
                            In {dataset.collections.length} collection
                            {dataset.collections.length !== 1 ? "s" : ""}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {dataset.collections.slice(0, 3).map((collection, i) => (
                              <Badge
                                key={i}
                                variant="outline"
                                className="text-xs font-light border-neutral-200"
                              >
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

                  {/* Usage Analytics */}
                  <div className="grid grid-cols-3 gap-3 mb-2.5">
                    <div className="flex items-center gap-2">
                      <Users className="size-4 text-neutral-400" />
                      <div>
                        <p className="text-xs font-light text-neutral-500">Active Users</p>
                        <p className="text-sm font-normal text-neutral-900">
                          {dataset.activeUsers}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Building className="size-4 text-neutral-400" />
                      <div>
                        <p className="text-xs font-light text-neutral-500">Organizations</p>
                        <p className="text-sm font-normal text-neutral-900">
                          {dataset.organizations}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="size-4 text-neutral-400" />
                      <div>
                        <p className="text-xs font-light text-neutral-500">Data Location</p>
                        <p className="text-sm font-normal text-neutral-900">
                          {Object.values(dataset.dataLocation).join(", ")}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Access Eligibility */}
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
                      onClick={() => toggleDataset(dataset.id)}
                      className={cn(
                        "rounded-xl font-light transition-all shrink-0",
                        selectedDatasets.has(dataset.id)
                          ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
                          : cn("bg-gradient-to-r text-white shadow-md hover:shadow-lg", scheme.from, scheme.to)
                      )}
                    >
                      {selectedDatasets.has(dataset.id) ? (
                        <>
                          <X className="size-4 mr-1" />
                          Remove from Collection
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
            )))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="max-w-5xl pb-6">
              <div className="flex items-center justify-between px-4 py-6 border-t border-neutral-100">
                <div className="text-sm font-light text-neutral-600">
                  Showing {startIndex + 1}-{Math.min(endIndex, filteredDatasets.length)} of {filteredDatasets.length} datasets
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="rounded-lg font-light border-neutral-200"
                  >
                    <ArrowLeft className="size-4 mr-1" />
                    Previous
                  </Button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      // Show first page, last page, current page, and pages around current
                      const showPage =
                        page === 1 ||
                        page === totalPages ||
                        Math.abs(page - currentPage) <= 1

                      if (!showPage) {
                        // Show ellipsis
                        if (page === 2 && currentPage > 3) {
                          return <span key={page} className="px-2 text-neutral-400">...</span>
                        }
                        if (page === totalPages - 1 && currentPage < totalPages - 2) {
                          return <span key={page} className="px-2 text-neutral-400">...</span>
                        }
                        return null
                      }

                      return (
                        <Button
                          key={page}
                          variant={page === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                          className={cn(
                            "rounded-lg font-light w-9 h-9",
                            page === currentPage
                              ? cn("bg-gradient-to-r text-white border-0", scheme.from, scheme.to)
                              : "border-neutral-200"
                          )}
                        >
                          {page}
                        </Button>
                      )
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="rounded-lg font-light border-neutral-200"
                  >
                    Next
                    <ArrowRight className="size-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="space-y-4 mt-8">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 3 of 7</span>
            <span className="text-xs text-neutral-300">|</span>
            <span className="text-xs font-light text-neutral-600">Select Datasets</span>
          </div>

          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/collectoid/dcm/create/categories")}
              className="flex-1 h-12 rounded-2xl font-light border-neutral-200"
            >
              <ArrowLeft className="size-4 mr-2" />
              Back to Categories
            </Button>
            <Button
              onClick={handleContinue}
              disabled={selectedDatasets.size === 0}
              className={cn(
                "flex-1 h-12 rounded-2xl font-light shadow-lg hover:shadow-xl transition-all",
                selectedDatasets.size > 0
                  ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                  : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              )}
            >
              Continue with {selectedDatasets.size} Datasets
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Sticky Panel - Selected Datasets */}
      <div className="w-80 sticky top-8 max-h-[calc(100vh-6rem)] flex flex-col">
        <Card className="border-neutral-200 rounded-2xl overflow-hidden shadow-lg flex flex-col max-h-full">
          {/* Scrollable content area */}
          <CardContent className="p-6 overflow-y-auto flex-1 min-h-0">
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
                <p className="text-2xl font-light text-neutral-900">{selectedDatasets.size}</p>
              </div>
            </div>

            {/* Average Access Eligibility RAG Bar */}
            {accessBreakdown && selectedDatasets.size > 0 && (
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

            {/* Access Breakdown */}
            {accessBreakdown && selectedDatasets.size > 0 ? (
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

                {/* Selected datasets list (scrollable) */}
                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {Array.from(selectedDatasets).slice(0, 5).map((datasetId) => {
                    const dataset = MOCK_DATASETS.find(d => d.id === datasetId)
                    if (!dataset) return null
                    return (
                      <div
                        key={dataset.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-neutral-50 group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-normal text-neutral-900 truncate">{dataset.code}</p>
                          <p className="text-xs font-light text-neutral-500 truncate">{dataset.name}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleDataset(dataset.id)}
                          className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="size-3 text-neutral-500 hover:text-red-600" />
                        </Button>
                      </div>
                    )
                  })}
                  {selectedDatasets.size > 5 && (
                    <p className="text-xs font-light text-neutral-500 text-center py-2">
                      +{selectedDatasets.size - 5} more datasets
                    </p>
                  )}
                </div>

                <Separator className="my-4" />

                <Button
                  variant="outline"
                  onClick={() => setSelectedDatasets(new Set())}
                  className="w-full rounded-xl font-light border-neutral-200"
                >
                  Clear All
                </Button>
              </div>
            ) : (
              <div className="text-center py-8">
                <Database className="size-12 text-neutral-200 mx-auto mb-3" />
                <p className="text-sm font-light text-neutral-500">No datasets selected yet</p>
                <p className="text-xs font-light text-neutral-400 mt-1">Click on datasets to add them</p>
              </div>
            )}
          </CardContent>

          {/* Fixed footer with Continue Button - always visible */}
          <div className="p-4 border-t border-neutral-100 bg-white shrink-0">
            {/* Info box - compact version */}
            <p className="text-xs font-light text-neutral-500 mb-3 text-center">
              Access provisioning times vary based on approval requirements.
            </p>

            {/* Continue Button */}
            <Button
              onClick={handleContinue}
              disabled={selectedDatasets.size === 0}
              className={cn(
                "w-full h-12 rounded-xl font-light shadow-lg hover:shadow-xl transition-all",
                selectedDatasets.size > 0
                  ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                  : "bg-neutral-200 text-neutral-500"
              )}
            >
              Continue with {selectedDatasets.size} dataset{selectedDatasets.size !== 1 ? 's' : ''}
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

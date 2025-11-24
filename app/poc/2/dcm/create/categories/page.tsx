"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { useColorScheme } from "@/components/ux12-color-context"
import { cn } from "@/lib/utils"
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Tag,
  Layers,
  CheckCircle2,
  Info,
  X,
  Plus,
  Loader2,
  Pencil,
  HelpCircle,
  BookOpen,
  Database,
  FileText,
} from "lucide-react"
import {
  extractKeywordsAndSuggestCategories,
  DataCategory,
} from "@/lib/dcm-mock-data"

export default function DCMCategoriesPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [intent, setIntent] = useState("")
  const [editedIntent, setEditedIntent] = useState("")
  const [keywords, setKeywords] = useState<string[]>([])
  const [newKeyword, setNewKeyword] = useState("")
  const [suggestedCategories, setSuggestedCategories] = useState<DataCategory[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<Set<string>>(new Set())
  const [isEditing, setIsEditing] = useState(false)
  const [isReanalyzing, setIsReanalyzing] = useState(false)

  useEffect(() => {
    // Get intent from sessionStorage
    if (typeof window !== "undefined") {
      const storedIntent = sessionStorage.getItem("dcm_collection_intent")
      if (!storedIntent) {
        router.push("/poc/2/dcm/create")
        return
      }

      setIntent(storedIntent)
      setEditedIntent(storedIntent)
      const result = extractKeywordsAndSuggestCategories(storedIntent)
      setKeywords(result.keywords)
      setSuggestedCategories(result.suggestedCategories)

      // Auto-select all suggested categories
      const categoryIds = new Set(result.suggestedCategories.map(cat => cat.id))
      setSelectedCategoryIds(categoryIds)
    }
  }, [router])

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim().toLowerCase())) {
      setKeywords([...keywords, newKeyword.trim().toLowerCase()])
      setNewKeyword("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword))
  }

  const handleReanalyze = async () => {
    setIsReanalyzing(true)

    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Combine edited intent with custom keywords for analysis
    const combinedText = `${editedIntent} ${keywords.join(" ")}`
    const result = extractKeywordsAndSuggestCategories(combinedText)

    // Merge extracted keywords with custom ones (deduplicate)
    const allKeywords = Array.from(new Set([...keywords, ...result.keywords]))

    setIntent(editedIntent)
    setKeywords(allKeywords)
    setSuggestedCategories(result.suggestedCategories)

    // Auto-select all newly suggested categories
    const categoryIds = new Set(result.suggestedCategories.map(cat => cat.id))
    setSelectedCategoryIds(categoryIds)

    // Update sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.setItem("dcm_collection_intent", editedIntent)
    }

    setIsEditing(false)
    setIsReanalyzing(false)
  }

  const toggleCategory = (categoryId: string) => {
    const newSelected = new Set(selectedCategoryIds)
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId)
    } else {
      newSelected.add(categoryId)
    }
    setSelectedCategoryIds(newSelected)
  }

  const handleContinue = () => {
    // Store selected categories in sessionStorage
    if (typeof window !== "undefined") {
      const selectedCategories = suggestedCategories.filter(cat =>
        selectedCategoryIds.has(cat.id)
      )
      sessionStorage.setItem("dcm_selected_categories", JSON.stringify(selectedCategories))
    }
    router.push("/poc/2/dcm/create/filters")
  }

  const handleSelectAll = () => {
    const allIds = new Set(suggestedCategories.map(cat => cat.id))
    setSelectedCategoryIds(allIds)
  }

  const handleDeselectAll = () => {
    setSelectedCategoryIds(new Set())
  }

  // Group categories by domain
  const categoryByDomain = suggestedCategories.reduce((acc, cat) => {
    if (!acc[cat.domain]) {
      acc[cat.domain] = []
    }
    acc[cat.domain].push(cat)
    return acc
  }, {} as Record<string, DataCategory[]>)

  if (!intent) {
    return <div>Loading...</div>
  }

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/poc/2/dcm/create")}
            className="rounded-full font-light"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 2 of 7</span>
          <span className="text-xs text-neutral-300">|</span>
          <span className="text-xs font-light text-neutral-600">Select Categories</span>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-extralight text-neutral-900 mb-3 tracking-tight">
            AI-Suggested Data Categories
          </h1>
          <p className="text-base font-light text-neutral-600 mb-3">
            Based on your intent, we've identified relevant data categories
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
                I need help understanding data sources
              </button>
            </SheetTrigger>
            <SheetContent className="w-[600px] sm:max-w-[600px] overflow-y-auto">
              <div className="px-6 pb-6">
                <SheetHeader>
                  <SheetTitle className="text-2xl font-light text-neutral-900 flex items-center gap-2">
                    <BookOpen className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                    Understanding Data Sources
                  </SheetTitle>
                  <SheetDescription className="font-light">
                    A guide to clinical trial data categories and domains
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-6 space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="text-lg font-normal text-neutral-900 mb-3">Overview</h3>
                  <p className="text-sm font-light text-neutral-700 leading-relaxed">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                    exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                  </p>
                </div>

                <Separator />

                {/* Data Domains */}
                <div>
                  <h3 className="text-lg font-normal text-neutral-900 mb-4 flex items-center gap-2">
                    <Database className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                    Key Data Domains
                  </h3>
                  <div className="space-y-4">
                    <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                      <h4 className="text-sm font-normal text-neutral-900 mb-2">SDTM (Clinical Trial Standard Data)</h4>
                      <p className="text-xs font-light text-neutral-600 leading-relaxed">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis aute irure dolor
                        in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                      </p>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                      <h4 className="text-sm font-normal text-neutral-900 mb-2">ADaM (Analysis-Ready Data)</h4>
                      <p className="text-xs font-light text-neutral-600 leading-relaxed">
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore.
                      </p>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                      <h4 className="text-sm font-normal text-neutral-900 mb-2">RAW Data (Pre-Standardization)</h4>
                      <p className="text-xs font-light text-neutral-600 leading-relaxed">
                        At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
                        praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias.
                      </p>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                      <h4 className="text-sm font-normal text-neutral-900 mb-2">Omics/NGS (Genomics)</h4>
                      <p className="text-xs font-light text-neutral-600 leading-relaxed">
                        Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                        deserunt mollit anim id est laborum. Nemo enim ipsam voluptatem quia voluptas.
                      </p>
                    </div>

                    <div className="rounded-xl border border-neutral-200 p-4 bg-white">
                      <h4 className="text-sm font-normal text-neutral-900 mb-2">DICOM (Medical Imaging)</h4>
                      <p className="text-xs font-light text-neutral-600 leading-relaxed">
                        Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur,
                        adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore.
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Additional Resources */}
                <div>
                  <h3 className="text-lg font-normal text-neutral-900 mb-3 flex items-center gap-2">
                    <FileText className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                    Additional Resources
                  </h3>
                  <div className="space-y-2">
                    <a href="#" className={cn(
                      "block text-sm font-light transition-colors hover:underline",
                      scheme.from.replace("from-", "text-")
                    )}>
                      → Clinical Trial Data Standards Guide
                    </a>
                    <a href="#" className={cn(
                      "block text-sm font-light transition-colors hover:underline",
                      scheme.from.replace("from-", "text-")
                    )}>
                      → SDTM Implementation Guide
                    </a>
                    <a href="#" className={cn(
                      "block text-sm font-light transition-colors hover:underline",
                      scheme.from.replace("from-", "text-")
                    )}>
                      → Genomics Data Dictionary
                    </a>
                    <a href="#" className={cn(
                      "block text-sm font-light transition-colors hover:underline",
                      scheme.from.replace("from-", "text-")
                    )}>
                      → Contact Data Stewards
                    </a>
                  </div>
                </div>

                <Separator />

                {/* Footer */}
                <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                  <div className="flex gap-3">
                    <Info className="size-5 shrink-0 text-blue-600 mt-0.5" />
                    <div className="text-xs font-light text-blue-900">
                      <p className="mb-1 font-normal">Need more help?</p>
                      <p className="text-blue-700">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Contact the Data
                        Science team for additional guidance on data source selection.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Keywords Extracted */}
        <div className={cn("rounded-2xl p-6 mb-6", scheme.bg, scheme.bgHover)}>
          <div className="flex items-start gap-3 mb-4">
            <Tag className={cn("size-5 shrink-0 mt-0.5", scheme.from.replace("from-", "text-"))} />
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-normal text-neutral-900">
                  Keywords identified from your intent:
                </p>
                {!isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="h-7 rounded-lg font-light"
                  >
                    <Pencil className="size-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {keywords.map((keyword, i) => (
                  <Badge
                    key={i}
                    className={cn(
                      "font-light capitalize bg-white text-neutral-900 border group",
                      scheme.from.replace("from-", "border-").replace("500", "200"),
                      isEditing && "pr-1"
                    )}
                  >
                    🏷️ {keyword}
                    {isEditing && (
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1.5 hover:bg-red-100 rounded-full p-0.5 transition-colors"
                      >
                        <X className="size-3 text-red-500" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addKeyword()}
                    placeholder="Add keyword..."
                    className="flex-1 h-8 px-3 text-sm font-light border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-violet-400"
                  />
                  <Button
                    size="sm"
                    onClick={addKeyword}
                    className={cn(
                      "h-8 px-3 rounded-lg font-light",
                      scheme.from.replace("from-", "bg-"),
                      "text-white"
                    )}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {isEditing ? (
            <textarea
              value={editedIntent}
              onChange={(e) => setEditedIntent(e.target.value)}
              className="w-full rounded-xl bg-white p-4 text-sm font-light text-neutral-700 border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-violet-400 min-h-[100px] resize-y"
            />
          ) : (
            <div className="rounded-xl bg-white/50 p-4 text-sm font-light text-neutral-700 italic border border-white">
              "{intent}"
            </div>
          )}

          {isEditing && (
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setEditedIntent(intent)
                }}
                className="rounded-lg font-light border-neutral-200"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleReanalyze}
                disabled={isReanalyzing || !editedIntent.trim()}
                className={cn(
                  "rounded-lg font-light bg-gradient-to-r text-white",
                  scheme.from,
                  scheme.to
                )}
              >
                {isReanalyzing ? (
                  <>
                    <Loader2 className="size-4 mr-2 animate-spin" />
                    Re-analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="size-4 mr-2" />
                    Re-analyze with AI
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Re-analyzing overlay */}
        {isReanalyzing && (
          <div className="rounded-2xl p-6 mb-6 bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-3">
              <Loader2 className="size-5 text-blue-600 animate-spin shrink-0" />
              <div>
                <p className="text-sm font-normal text-blue-900 mb-1">
                  AI is analyzing your updated intent...
                </p>
                <p className="text-xs font-light text-blue-700">
                  Identifying relevant data categories based on your keywords and description
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Selection Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-sm font-light text-neutral-600">
          <CheckCircle2 className="size-4" />
          <span>{selectedCategoryIds.size} of {suggestedCategories.length} categories selected</span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
            className="rounded-full font-light border-neutral-200"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeselectAll}
            className="rounded-full font-light border-neutral-200"
          >
            Deselect All
          </Button>
        </div>
      </div>

      {/* Categories by Domain */}
      <div className="space-y-6 mb-8">
        {Object.entries(categoryByDomain).map(([domain, categories]) => (
          <Card key={domain} className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Layers className={cn("size-5", scheme.from.replace("from-", "text-"))} />
                <h3 className="text-lg font-light text-neutral-900">{domain}</h3>
                <Badge variant="outline" className="font-light">
                  {categories.length} categories
                </Badge>
              </div>

              <div className="space-y-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    onClick={() => toggleCategory(category.id)}
                    className={cn(
                      "w-full flex items-start gap-4 p-4 rounded-xl border transition-all text-left cursor-pointer",
                      selectedCategoryIds.has(category.id)
                        ? cn(
                            scheme.from.replace("from-", "border-").replace("500", "200"),
                            "bg-gradient-to-r",
                            scheme.bg,
                            scheme.bgHover
                          )
                        : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
                    )}
                  >
                    <Checkbox
                      checked={selectedCategoryIds.has(category.id)}
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-sm font-normal text-neutral-900">
                          {category.name}
                        </h4>
                        <Badge variant="outline" className="font-light text-xs">
                          {category.studyCount} studies
                        </Badge>
                        {category.isHighlighted && (
                          <Badge
                            className={cn(
                              "font-light text-xs",
                              scheme.from.replace("from-", "bg-").replace("500", "100"),
                              scheme.from.replace("from-", "text-")
                            )}
                          >
                            <Sparkles className="size-3 mr-1" />
                            Key Match
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs font-light text-neutral-600 mb-2">
                        {category.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {category.keyVariables.slice(0, 4).map((variable, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="text-xs font-light border-neutral-200"
                          >
                            {variable}
                          </Badge>
                        ))}
                        {category.keyVariables.length > 4 && (
                          <Badge
                            variant="outline"
                            className="text-xs font-light border-neutral-200"
                          >
                            +{category.keyVariables.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info Notice */}
      <div className="rounded-2xl p-4 bg-blue-50 border border-blue-100 mb-6">
        <div className="flex gap-3">
          <Info className="size-5 shrink-0 text-blue-600 mt-0.5" />
          <div className="text-sm font-light text-blue-900">
            <p className="mb-1">
              <span className="font-normal">Next step:</span> Multi-dimensional filtering
            </p>
            <p className="text-blue-700">
              You'll be able to refine your dataset selection using study characteristics,
              collection context, and access criteria.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="space-y-4">
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Step 2 of 7</span>
          <span className="text-xs text-neutral-300">|</span>
          <span className="text-xs font-light text-neutral-600">Select Categories</span>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push("/poc/2/dcm/create")}
            className="flex-1 h-12 rounded-2xl font-light border-neutral-200"
          >
            <ArrowLeft className="size-4 mr-2" />
            Back to Intent
          </Button>
          <Button
            onClick={handleContinue}
            disabled={selectedCategoryIds.size === 0}
            className={cn(
              "flex-1 h-12 rounded-2xl font-light shadow-lg hover:shadow-xl transition-all",
              selectedCategoryIds.size > 0
                ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            )}
          >
            Continue with {selectedCategoryIds.size} Categories
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}

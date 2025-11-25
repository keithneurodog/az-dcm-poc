"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useColorScheme } from "@/components/ux12-color-context"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  ArrowLeft,
  ArrowRight,
  Send,
  Check,
  AlertTriangle,
  X,
  Users,
  Database,
  Loader2,
  FolderSearch,
  ChevronRight,
} from "lucide-react"

// Mock AI response data
const MOCK_AI_RESPONSE = {
  keywords: ["lung cancer", "ctDNA", "biomarker", "immunotherapy", "ML", "publication"],
  collections: [
    {
      id: "col-1",
      name: "Oncology ctDNA Outcomes Collection",
      description: "Curated Phase III lung cancer studies with ctDNA biomarker monitoring and immunotherapy treatment arms.",
      datasetCount: 16,
      userCount: 120,
      matchScore: 95,
      intents: { ml: true, publish: true, primaryUse: false },
      intentMatch: "full",
    },
    {
      id: "col-2",
      name: "Immunotherapy Response Collection",
      description: "Comprehensive immunotherapy trial data across multiple therapeutic areas including lung, melanoma, and bladder cancer.",
      datasetCount: 22,
      userCount: 95,
      matchScore: 78,
      intents: { ml: true, publish: false, primaryUse: true },
      intentMatch: "partial",
      intentWarning: "Publishing not allowed - request modification?",
    },
    {
      id: "col-3",
      name: "Lung Cancer Biomarker Studies",
      description: "Collection focused on biomarker discovery and validation in NSCLC with comprehensive genomic profiling.",
      datasetCount: 12,
      userCount: 67,
      matchScore: 72,
      intents: { ml: false, publish: true, primaryUse: true },
      intentMatch: "partial",
      intentWarning: "ML/AI research not allowed - request modification?",
    },
  ],
  additionalDatasets: [
    { code: "DCODE-299", name: "ctDNA Longitudinal Substudy", phase: "Phase III" },
    { code: "DCODE-334", name: "NSCLC Biomarker Analysis", phase: "Phase II" },
    { code: "DCODE-401", name: "Immunotherapy Response Predictors", phase: "Phase III" },
  ],
}

const EXAMPLE_PROMPTS = [
  "Show me oncology studies with genomic profiling data",
  "I need Phase III cardiovascular trials for ML training",
  "Find imaging data for lung cancer research with publication rights",
]

export default function AIDiscoveryPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [prompt, setPrompt] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [aiResponse, setAiResponse] = useState<typeof MOCK_AI_RESPONSE | null>(null)

  const handleSearch = async () => {
    if (!prompt.trim()) return

    setIsSearching(true)
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setAiResponse(MOCK_AI_RESPONSE)
    setIsSearching(false)
    setHasSearched(true)
  }

  const handleExamplePrompt = (example: string) => {
    setPrompt(example)
  }

  const getIntentMatchBadge = (match: string) => {
    switch (match) {
      case "full":
        return { label: "✅ Matches your intent", color: "bg-green-100 text-green-700 border-green-200" }
      case "partial":
        return { label: "⚠️ Partial match", color: "bg-amber-100 text-amber-700 border-amber-200" }
      case "none":
        return { label: "❌ Intent mismatch", color: "bg-red-100 text-red-700 border-red-200" }
      default:
        return { label: match, color: "bg-neutral-100 text-neutral-700 border-neutral-200" }
    }
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push("/collectoid/discover")}
          className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-900 mb-4 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Discovery
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div className={cn(
            "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br",
            scheme.from,
            scheme.to
          )}>
            <Sparkles className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight">
              AI-Assisted Data Discovery
            </h1>
            <p className="text-base font-light text-neutral-600">
              Describe your research needs and let AI find the right data
            </p>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden mb-8">
        <CardContent className="p-6">
          <div className="relative">
            {/* Gradient border effect */}
            <div className={cn(
              "absolute -inset-0.5 rounded-2xl bg-gradient-to-r opacity-75 blur-sm",
              scheme.from,
              scheme.to
            )} />
            <div className="relative bg-white rounded-2xl p-1">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you're looking for...

Example: I need lung cancer data with ctDNA biomarker monitoring from immunotherapy trials for ML-based outcome prediction. Planning to publish results."
                className={cn(
                  "min-h-[120px] rounded-xl font-light resize-none border-2 border-neutral-200",
                  "hover:border-neutral-300 focus-visible:border-transparent transition-colors"
                )}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2 text-xs font-light text-neutral-500">
              <Sparkles className={cn("size-3", scheme.from.replace("from-", "text-"))} />
              <span>AI will extract keywords and match to collections</span>
            </div>
            <Button
              onClick={handleSearch}
              disabled={!prompt.trim() || isSearching}
              className={cn(
                "h-10 rounded-xl font-light bg-gradient-to-r text-white shadow-md hover:shadow-lg transition-all",
                scheme.from,
                scheme.to
              )}
            >
              {isSearching ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Send className="size-4 mr-2" />
                  Search
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Example Prompts (shown before search) */}
      {!hasSearched && !isSearching && (
        <div className="mb-8">
          <p className="text-sm font-light text-neutral-600 mb-3">
            💡 Example prompts:
          </p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_PROMPTS.map((example, i) => (
              <button
                key={i}
                onClick={() => handleExamplePrompt(example)}
                className="px-4 py-2 rounded-xl bg-neutral-50 border border-neutral-200 text-sm font-light text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 transition-all"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AI Response */}
      {hasSearched && aiResponse && (
        <div className="space-y-6">
          {/* Extracted Keywords */}
          <Card className={cn(
            "border-2 rounded-2xl overflow-hidden",
            scheme.from.replace("from-", "border-").replace("-500", "-200")
          )}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "flex size-12 items-center justify-center rounded-xl bg-gradient-to-r text-white shadow-lg shrink-0",
                  scheme.from,
                  scheme.to
                )}>
                  <Sparkles className="size-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-base font-normal text-neutral-900">Based on your description, I found:</h4>
                    <Badge className={cn(
                      "font-light text-xs",
                      scheme.from.replace("from-", "bg-"),
                      "text-white"
                    )}>
                      AI
                    </Badge>
                  </div>
                  <p className="text-sm font-light text-neutral-600 mb-3">
                    Keywords extracted:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {aiResponse.keywords.map((keyword) => (
                      <Badge
                        key={keyword}
                        variant="outline"
                        className="font-light text-xs border-neutral-300"
                      >
                        🏷️ {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relevant Collections */}
          <div>
            <h3 className="text-lg font-light text-neutral-900 mb-4">
              Relevant Collections ({aiResponse.collections.length})
            </h3>
            <div className="space-y-4">
              {aiResponse.collections.map((collection, i) => {
                const matchBadge = getIntentMatchBadge(collection.intentMatch)
                return (
                  <Card
                    key={collection.id}
                    className={cn(
                      "border-neutral-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all cursor-pointer group",
                      i === 0 && "ring-2 ring-green-200"
                    )}
                    onClick={() => router.push(`/collectoid/collections/${collection.id}`)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {i === 0 && (
                              <Badge className={cn(
                                "font-light text-xs bg-gradient-to-r text-white border-0",
                                scheme.from,
                                scheme.to
                              )}>
                                ⭐ Best Match
                              </Badge>
                            )}
                            <Badge
                              variant="outline"
                              className={cn("font-light text-xs", matchBadge.color)}
                            >
                              {matchBadge.label}
                            </Badge>
                          </div>
                          <h4 className="text-base font-normal text-neutral-900 mb-1">
                            {collection.name}
                          </h4>
                          <p className="text-sm font-light text-neutral-600 mb-3">
                            {collection.description}
                          </p>

                          {/* Intent warning */}
                          {collection.intentWarning && (
                            <div className="flex items-center gap-2 p-3 rounded-lg bg-amber-50 border border-amber-200 mb-3">
                              <AlertTriangle className="size-4 text-amber-600 shrink-0" />
                              <span className="text-xs font-light text-amber-800">
                                {collection.intentWarning}
                              </span>
                            </div>
                          )}

                          {/* Intent badges */}
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-light text-neutral-500">Allowed:</span>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-light",
                                collection.intents.ml
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              )}
                            >
                              ML/AI {collection.intents.ml ? "✓" : "✗"}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-light",
                                collection.intents.publish
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                              )}
                            >
                              Publish {collection.intents.publish ? "✓" : "✗"}
                            </Badge>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="text-right shrink-0 ml-4">
                          <div className="flex items-center gap-4 text-sm font-light text-neutral-600 mb-2">
                            <div className="flex items-center gap-1">
                              <Database className="size-4" />
                              <span>{collection.datasetCount}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="size-4" />
                              <span>{collection.userCount}</span>
                            </div>
                          </div>
                          <div className={cn(
                            "text-2xl font-light",
                            collection.matchScore >= 90 ? "text-green-600" :
                            collection.matchScore >= 70 ? "text-amber-600" : "text-neutral-600"
                          )}>
                            {collection.matchScore}%
                          </div>
                          <p className="text-xs font-light text-neutral-500">match</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-xl font-light border-neutral-200"
                        >
                          View Collection
                        </Button>
                        {collection.intentMatch === "full" ? (
                          <Button
                            size="sm"
                            className={cn(
                              "rounded-xl font-light bg-gradient-to-r text-white",
                              scheme.from,
                              scheme.to
                            )}
                          >
                            Request Access
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-xl font-light border-amber-300 text-amber-700 hover:bg-amber-50"
                          >
                            Request with Modification
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Additional Datasets */}
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardContent className="p-6">
              <h3 className="text-base font-normal text-neutral-900 mb-4">
                Individual Datasets ({aiResponse.additionalDatasets.length} not in above collections)
              </h3>
              <div className="space-y-2">
                {aiResponse.additionalDatasets.map((dataset) => (
                  <div
                    key={dataset.code}
                    className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-mono text-xs">
                        {dataset.code}
                      </Badge>
                      <span className="text-sm font-light text-neutral-700">{dataset.name}</span>
                      <Badge className="text-xs font-light bg-blue-100 text-blue-700">
                        {dataset.phase}
                      </Badge>
                    </div>
                    <ChevronRight className="size-4 text-neutral-400" />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-4 pt-4 border-t border-neutral-100">
                <Button
                  variant="outline"
                  className="rounded-xl font-light border-neutral-200"
                >
                  <FolderSearch className="size-4 mr-2" />
                  View All Datasets
                </Button>
                <Button
                  variant="outline"
                  className={cn(
                    "rounded-xl font-light",
                    scheme.from.replace("from-", "border-").replace("-500", "-300"),
                    scheme.from.replace("from-", "text-").replace("-500", "-700")
                  )}
                >
                  <Sparkles className="size-4 mr-2" />
                  Create Custom Collection from These
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* New Search */}
          <div className="text-center pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setHasSearched(false)
                setAiResponse(null)
                setPrompt("")
              }}
              className="rounded-xl font-light text-neutral-600"
            >
              <ArrowLeft className="size-4 mr-2" />
              Start New Search
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

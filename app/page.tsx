"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FeaturePreviewDialog } from "@/components/feature-preview-dialog"
import { FlowEmbeddedBadge } from "@/components/flow-embedded-badge"
import {
  ArrowRight,
  Tags,
  Activity,
  FileCheck,
  AlertTriangle,
  Clock,
  Inbox,
  Search,
  Filter,
  ListFilter,
  Compass,
  BarChart3,
  Lightbulb,
  Eye,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

// Feature type definition
interface Feature {
  id: number
  icon: LucideIcon
  title: string
  short: string
  route: string
  category: "workflow" | "discovery" | "analytics"
  isFlowEmbedded: boolean
  flowStartRoute?: string
  stepNumber?: number
  stepLabel?: string
  previewDescription: string
  previewImagePath?: string
}

// Feature data with flow-embedded metadata
const FEATURES: Feature[] = [
  // FLOW-EMBEDDED FEATURES (5)
  {
    id: 1,
    icon: Tags,
    title: "Category Suggestion",
    short: "AI reads your intent, picks the right data categories",
    route: "/collectoid/dcm/create/categories",
    category: "workflow",
    isFlowEmbedded: true,
    flowStartRoute: "/collectoid/dcm/create",
    stepNumber: 2,
    stepLabel: "Step 2 of 7",
    previewDescription:
      "When you describe your collection purpose, the AI extracts keywords and automatically pre-selects relevant categories from 30+ options. You'll see 'Key Match' badges on auto-selected items and can easily add or remove categories with a click.",
    previewImagePath: "/previews/category-suggestion.png",
  },
  {
    id: 2,
    icon: Activity,
    title: "Activity Recommendations",
    short: "Looks at your data, suggests what to do with it",
    route: "/collectoid/dcm/create/activities",
    category: "workflow",
    isFlowEmbedded: true,
    flowStartRoute: "/collectoid/dcm/create",
    stepNumber: 4,
    stepLabel: "Step 4 of 7",
    previewDescription:
      "After selecting datasets, a 'Recommended Activities' panel appears showing specific activities suited to your data—like Variant Harmonization for genomic data. One click applies the recommendation, and you see timeline impact instantly.",
    previewImagePath: "/previews/activity-recommendations.png",
  },
  {
    id: 3,
    icon: FileCheck,
    title: "Terms Suggestion",
    short: "Pre-fills permissions based on what you're trying to do",
    route: "/collectoid/dcm/create/agreements",
    category: "workflow",
    isFlowEmbedded: true,
    flowStartRoute: "/collectoid/dcm/create",
    stepNumber: 5,
    stepLabel: "Step 5 of 7",
    previewDescription:
      "The AI analyzes your selected activities and datasets to pre-fill permissions appropriately. If you selected ML activities, it checks whether your datasets allow ML use and configures permissions accordingly—like a legal reviewer who's already read all the fine print.",
    previewImagePath: "/previews/terms-suggestion.png",
  },
  {
    id: 4,
    icon: AlertTriangle,
    title: "Conflict Detection",
    short: "Catches policy violations before you submit",
    route: "/collectoid/dcm/create/agreements",
    category: "workflow",
    isFlowEmbedded: true,
    flowStartRoute: "/collectoid/dcm/create",
    stepNumber: 5,
    stepLabel: "Step 5 of 7",
    previewDescription:
      "The system constantly checks your choices against dataset restrictions. When you enable a permission that conflicts with a dataset's rules, a warning appears instantly with severity level, affected datasets, and resolution options—like spell-check for data governance.",
    previewImagePath: "/previews/conflict-detection.png",
  },
  {
    id: 5,
    icon: Clock,
    title: "Timeline Prediction",
    short: "Shows how long access will actually take",
    route: "/collectoid/dcm/create/activities",
    category: "workflow",
    isFlowEmbedded: true,
    flowStartRoute: "/collectoid/dcm/create",
    stepNumber: 4,
    stepLabel: "Step 4 of 7",
    previewDescription:
      "A sticky sidebar shows estimated time to full access with a visual breakdown: instant (green), needs policy (blue), needs approval (amber), missing (gray). You can see exactly which datasets are blocking and make informed trade-offs.",
    previewImagePath: "/previews/timeline-prediction.png",
  },

  // STANDALONE FEATURES (7)
  {
    id: 6,
    icon: Inbox,
    title: "Request Triage",
    short: "Auto-sorts requests by complexity",
    route: "/collectoid/dcm/propositions",
    category: "workflow",
    isFlowEmbedded: false,
    previewDescription:
      "The system categorizes incoming requests automatically: Auto-Approve for routine requests, Suggest Merge for similar ones, and Needs Review for complex cases. Shows reasoning and estimated review time.",
    previewImagePath: "/previews/request-triage.png",
  },
  {
    id: 7,
    icon: Search,
    title: "Natural Language Search",
    short: "Just describe what you need",
    route: "/collectoid/discover/ai",
    category: "discovery",
    isFlowEmbedded: false,
    previewDescription:
      "Type naturally: 'I need lung cancer ctDNA data for ML research' and get ranked collections with match scores, extracted keywords as editable badges, and access breakdowns showing what's instant vs. needs approval.",
    previewImagePath: "/previews/natural-language-search.png",
  },
  {
    id: 8,
    icon: Filter,
    title: "Smart Filtering",
    short: "AI sets up filters from your description",
    route: "/collectoid/discover/ai",
    category: "discovery",
    isFlowEmbedded: false,
    previewDescription:
      "Smart Search understands meaning, not just keywords. Say 'tumor response data' and find datasets about treatment outcomes even without exact matches. Toggle between AI-filtered and manual results to verify.",
    previewImagePath: "/previews/smart-filtering.png",
  },
  {
    id: 9,
    icon: ListFilter,
    title: "Intent Filtering",
    short: "Filter by what you want to do, not just what exists",
    route: "/collectoid/collections",
    category: "discovery",
    isFlowEmbedded: false,
    previewDescription:
      "Filter collections by intended use: AI/ML, Publication, Software Dev. See access badges at a glance. Green checkmark means allowed, red X means restricted. No need to open each collection to check permissions.",
    previewImagePath: "/previews/intent-filtering.png",
  },
  {
    id: 10,
    icon: Compass,
    title: "Discovery Paths",
    short: "Choose AI-assisted or manual browsing",
    route: "/collectoid/discover",
    category: "discovery",
    isFlowEmbedded: false,
    previewDescription:
      "A landing page offering two paths: AI-Assisted Discovery with natural language and smart recommendations, or traditional Browse Collections with filters. Choose based on your preference and task.",
    previewImagePath: "/previews/discovery-paths.png",
  },
  {
    id: 11,
    icon: BarChart3,
    title: "Demand Analysis",
    short: "See where the gaps are",
    route: "/collectoid/dcm/analytics",
    category: "analytics",
    isFlowEmbedded: false,
    previewDescription:
      "An analytics dashboard showing demand heatmaps by therapeutic area and data type. Gap scores highlight opportunities: high demand + low coverage = priority. Multiple visualizations: grid, bubble, treemap, radial.",
    previewImagePath: "/previews/demand-analysis.png",
  },
  {
    id: 12,
    icon: Lightbulb,
    title: "Collection Suggestions",
    short: "AI spots opportunities you might miss",
    route: "/collectoid/dcm/analytics",
    category: "analytics",
    isFlowEmbedded: false,
    previewDescription:
      "The AI identifies opportunities you might not have noticed: high demand for Oncology genomics with only 40% coverage. Shows gap score, projected users, and top datasets. One click starts a new collection with data pre-selected.",
    previewImagePath: "/previews/collection-suggestions.png",
  },
]

export default function IntroductionPage() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [previewFeature, setPreviewFeature] = useState<Feature | null>(null)

  const handleFeatureClick = (feature: Feature) => {
    setPreviewFeature(feature)
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Subtle grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Minimal top nav */}
      <nav className="fixed top-0 left-0 right-0 z-40 px-6 py-4 bg-[#FAFAF9]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-400">
            <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs tracking-wide uppercase">POC</span>
          </div>
          <div className="flex items-center gap-6">
            <Link
              href="/context"
              className="text-xs text-neutral-500 hover:text-neutral-900 transition-colors tracking-wide"
            >
              UX Gallery
            </Link>
            <Link href="/collectoid">
              <Button
                size="sm"
                variant="outline"
                className="rounded-full text-xs h-8 px-4 border-neutral-300 hover:border-neutral-900 hover:bg-transparent"
              >
                Enter POC
                <ArrowRight className="ml-1.5 size-3" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="pt-28 pb-12 px-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-light tracking-tight text-neutral-900 mb-3">
            DCM UI Prototype
          </h1>
          <p className="text-neutral-500 max-w-xl">
            Exploring how AI assistance could be embedded into the data collection workflow.
            This prototype demonstrates 12 features across collection creation, discovery, and analytics.
          </p>

          <div className="flex items-center gap-4 mt-8">
            <Link href="/collectoid">
              <Button className="rounded-full h-10 px-5 bg-neutral-900 hover:bg-neutral-800 text-sm">
                Open Prototype
                <ArrowRight className="ml-2 size-3.5" />
              </Button>
            </Link>
            <Link href="/context">
              <Button
                variant="outline"
                className="rounded-full h-10 px-5 text-sm border-neutral-300 hover:border-neutral-400"
              >
                UX Variations
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Features - browsable grid */}
      <section id="features" className="py-20 px-6 scroll-mt-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs text-neutral-400 uppercase tracking-wider">
                Features
              </span>
              <h2 className="text-2xl font-light text-neutral-900 mt-2">
                Prototype Features
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-neutral-400">
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-blue-400" />
                Workflow
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-violet-400" />
                Discovery
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-amber-400" />
                Analytics
              </span>
            </div>
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((feature) => {
              const Icon = feature.icon
              const isHovered = hoveredFeature === feature.id
              const categoryColor = {
                workflow: "blue",
                discovery: "violet",
                analytics: "amber",
              }[feature.category]

              return (
                <button
                  key={feature.id}
                  onClick={() => handleFeatureClick(feature)}
                  onMouseEnter={() => setHoveredFeature(feature.id)}
                  onMouseLeave={() => setHoveredFeature(null)}
                  className="group relative w-full text-left"
                >
                  <div
                    className={`
                      relative bg-white rounded-xl p-5 border transition-all duration-300 h-full
                      ${
                        isHovered
                          ? "border-neutral-300 shadow-lg shadow-neutral-200/50 -translate-y-1"
                          : "border-neutral-200"
                      }
                    `}
                  >
                    {/* Category indicator */}
                    <div
                      className={`
                        absolute top-4 right-4 size-2 rounded-full transition-transform duration-300
                        ${isHovered ? "scale-150" : ""}
                        ${categoryColor === "blue" ? "bg-blue-400" : ""}
                        ${categoryColor === "violet" ? "bg-violet-400" : ""}
                        ${categoryColor === "amber" ? "bg-amber-400" : ""}
                      `}
                    />

                    {/* Step indicator for flow-embedded */}
                    {feature.stepNumber && (
                      <div className="absolute top-4 right-8">
                        <FlowEmbeddedBadge
                          stepNumber={feature.stepNumber}
                          variant="subtle"
                        />
                      </div>
                    )}

                    <Icon
                      className={`
                        size-5 mb-3 transition-colors duration-300
                        ${isHovered ? "text-neutral-900" : "text-neutral-400"}
                      `}
                      strokeWidth={1.5}
                    />

                    <h3 className="text-sm font-medium text-neutral-900 mb-1">
                      {feature.title}
                    </h3>

                    <p className="text-xs text-neutral-500 leading-relaxed">
                      {feature.short}
                    </p>

                    {/* Hover icon */}
                    <div
                      className={`
                        absolute bottom-4 right-4 transition-all duration-300
                        ${
                          isHovered
                            ? "opacity-100 translate-x-0"
                            : "opacity-0 -translate-x-2"
                        }
                      `}
                    >
                      <Eye className="size-3.5 text-neutral-400" />
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>


      {/* Footer - minimal */}
      <footer className="py-8 px-6 border-t border-neutral-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-neutral-400">
          <span>Internal Prototype</span>
          <span>DCM POC · 2026</span>
        </div>
      </footer>

      {/* Feature Preview Dialog */}
      <FeaturePreviewDialog
        open={!!previewFeature}
        onOpenChange={(open) => !open && setPreviewFeature(null)}
        feature={previewFeature}
        features={FEATURES}
        onNavigate={setPreviewFeature}
      />
    </div>
  )
}

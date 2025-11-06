import { UX10Layout } from "@/components/ux10-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Download,
  Eye,
  Star,
  Filter,
} from "lucide-react"

export default function UX10SearchPage() {
  return (
    <UX10Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
            Dataset Search
          </Badge>
        </div>
        <h1 className="text-4xl font-serif text-neutral-900 mb-3 tracking-wide">
          Search Repository
        </h1>
        <p className="text-lg text-neutral-600">
          Access 1,284 enterprise datasets
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6 bg-white border-neutral-200 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-amber-600" />
              <Input
                placeholder="Search datasets, keywords, or metadata..."
                className="pl-12 h-12 bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-500"
              />
            </div>
            <Button className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold h-12 px-6">
              Search
            </Button>
            <Button variant="outline" className="border-neutral-200 text-neutral-700 hover:bg-neutral-50 h-12">
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {["Clinical Trials", "2024", "Approved", "High Priority"].map((filter) => (
              <Badge
                key={filter}
                variant="outline"
                className="border-amber-200 text-amber-600 bg-amber-400/5 hover:bg-amber-400/10"
              >
                {filter}
                <button className="ml-2 hover:text-red-600">×</button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          <span className="text-neutral-900 font-semibold">247</span> results found
        </p>
        <div className="flex gap-2">
          {["Relevance", "Date", "Name"].map((sort) => (
            <Button key={sort} variant="outline" size="sm" className="text-xs border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50">
              {sort}
            </Button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="space-y-4">
        {[
          {
            name: "Clinical Trial Data Q4 2024",
            description: "Comprehensive clinical trial data including patient demographics, treatment outcomes, and adverse event reporting",
            category: "Clinical Trials",
            size: "2.4 GB",
            modified: "Oct 15, 2024",
            access: "Restricted",
            starred: true,
          },
          {
            name: "Pharmacology Research Dataset",
            description: "Drug interaction studies, molecular compound analysis, and comprehensive efficacy research",
            category: "Pharmacology",
            size: "1.8 GB",
            modified: "Sep 28, 2024",
            access: "Restricted",
            starred: false,
          },
          {
            name: "Patient Demographics Study 2024",
            description: "Anonymized demographic information for statistical analysis and population health research",
            category: "Demographics",
            size: "890 MB",
            modified: "Aug 12, 2024",
            access: "Public",
            starred: true,
          },
          {
            name: "Lab Results Dataset Q3",
            description: "Laboratory test results, biomarker data, and comprehensive diagnostic information",
            category: "Lab Results",
            size: "1.2 GB",
            modified: "Sep 30, 2024",
            access: "Restricted",
            starred: false,
          },
          {
            name: "Genomic Research Data 2024",
            description: "Advanced genomic sequencing data, genetic markers, and DNA analysis results",
            category: "Genomics",
            size: "5.7 GB",
            modified: "Oct 20, 2024",
            access: "Confidential",
            starred: true,
          },
        ].map((dataset, i) => (
          <Card key={i} className="bg-white border-neutral-200 backdrop-blur-sm hover:bg-neutral-50/70 hover:border-amber-200 transition-all group">
            <CardContent className="p-6">
              <div className="flex items-start gap-6">
                <div className="flex size-16 shrink-0 items-center justify-center rounded-lg bg-slate-700/50 border border-amber-900/20 text-amber-600 font-semibold text-lg">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl font-serif text-neutral-900">
                          {dataset.name}
                        </CardTitle>
                        <button>
                          <Star
                            className={`size-5 ${dataset.starred ? "fill-amber-400 text-amber-600" : "text-neutral-600"}`}
                          />
                        </button>
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">
                        {dataset.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-neutral-500 mb-4">
                    <span>{dataset.size}</span>
                    <span>•</span>
                    <span>{dataset.modified}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-neutral-200 text-neutral-600">
                        {dataset.category}
                      </Badge>
                      <Badge className={
                        dataset.access === "Public"
                          ? "bg-emerald-400/10 text-emerald-600 border-emerald-400/30"
                          : dataset.access === "Restricted"
                          ? "bg-amber-400/10 text-amber-600 border-amber-400/30"
                          : "bg-red-400/10 text-red-600 border-red-400/30"
                      }>
                        {dataset.access}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold"
                      >
                        <Eye className="mr-2 size-4" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                      >
                        <Download className="size-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center">
        <div className="flex items-center gap-2">
          {[1, 2, 3, "...", 21].map((page, i) => (
            <Button
              key={i}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
              className={
                page === 1
                  ? "bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold"
                  : "border-neutral-200 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50"
              }
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </UX10Layout>
  )
}

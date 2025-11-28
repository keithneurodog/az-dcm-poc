import { UX8Layout } from "@/app/ux/_components/ux8-layout"
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
  Circle,
} from "lucide-react"

export default function UX8SearchPage() {
  return (
    <UX8Layout>
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-extralight text-neutral-900 mb-3 tracking-tight">
          Search Datasets
        </h1>
        <p className="text-lg font-light text-neutral-500">
          Explore 1,284 datasets with precision
        </p>
      </div>

      {/* Search */}
      <div className="mb-12">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 size-5 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search datasets, keywords, or categories..."
            className="h-14 pl-14 rounded-full border-neutral-200 focus:border-rose-300 bg-white text-base font-light"
          />
        </div>
        <div className="flex items-center justify-center gap-2 mt-6">
          {["Clinical Trials", "2024", "Public Access"].map((filter) => (
            <Badge
              key={filter}
              variant="outline"
              className="rounded-full font-light border-neutral-200 bg-white px-4 py-1.5"
            >
              {filter}
              <button className="ml-2 hover:text-rose-500">×</button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-8 text-center">
        <p className="text-sm font-light text-neutral-500">
          Showing 247 results
        </p>
      </div>

      {/* Results Grid */}
      <div className="space-y-6">
        {[
          {
            name: "Clinical Trial Data Q4 2024",
            description: "Comprehensive trial data including patient demographics, treatment outcomes, and adverse event reporting",
            category: "Clinical Trials",
            size: "2.4 GB",
            modified: "Oct 15, 2024",
            access: "Public",
            starred: true,
          },
          {
            name: "Pharmacology Research Dataset",
            description: "Drug interaction studies, molecular compound analysis, and efficacy research data",
            category: "Pharmacology",
            size: "1.8 GB",
            modified: "Sep 28, 2024",
            access: "Restricted",
            starred: false,
          },
          {
            name: "Patient Demographics Study 2024",
            description: "Anonymized demographic information for statistical analysis and population research",
            category: "Demographics",
            size: "890 MB",
            modified: "Aug 12, 2024",
            access: "Public",
            starred: true,
          },
          {
            name: "Lab Results Dataset Q3",
            description: "Laboratory test results, biomarker data, and diagnostic information",
            category: "Lab Results",
            size: "1.2 GB",
            modified: "Sep 30, 2024",
            access: "Restricted",
            starred: false,
          },
          {
            name: "Genomic Research Data 2024",
            description: "DNA sequencing results, genetic markers, and genomic analysis datasets",
            category: "Genomics",
            size: "5.7 GB",
            modified: "Oct 20, 2024",
            access: "Restricted",
            starred: true,
          },
        ].map((dataset, i) => (
          <Card key={i} className="border-neutral-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-start gap-6">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-rose-50 to-orange-50 border border-rose-100">
                  <span className="text-lg font-light text-rose-500">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl font-light text-neutral-900">
                          {dataset.name}
                        </CardTitle>
                        <button>
                          <Star
                            className={`size-5 ${dataset.starred ? "fill-rose-500 text-rose-500" : "text-neutral-300"}`}
                          />
                        </button>
                      </div>
                      <p className="text-sm font-light text-neutral-600 leading-relaxed">
                        {dataset.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm font-light text-neutral-500 mb-4">
                    <span>{dataset.size}</span>
                    <Circle className="size-1 fill-neutral-300" />
                    <span>{dataset.modified}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-light border-neutral-200 rounded-full">
                        {dataset.category}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={`font-light rounded-full ${
                          dataset.access === "Public"
                            ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                            : "border-amber-200 text-amber-700 bg-amber-50"
                        }`}
                      >
                        {dataset.access}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500 text-white rounded-full font-light"
                      >
                        <Eye className="mr-2 size-4" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-full border-neutral-200 font-light hover:bg-neutral-50"
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
      <div className="mt-12 flex justify-center">
        <div className="flex items-center gap-2">
          {[1, 2, 3, "...", 21].map((page, i) => (
            <Button
              key={i}
              variant={page === 1 ? "default" : "outline"}
              size="sm"
              className={
                page === 1
                  ? "bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500 text-white rounded-full font-light min-w-[2.5rem]"
                  : "rounded-full border-neutral-200 font-light hover:bg-neutral-50 min-w-[2.5rem]"
              }
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </UX8Layout>
  )
}

import { UX7Layout } from "@/components/ux7-layout"
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
  Terminal,
  Database,
  Filter,
} from "lucide-react"

export default function UX7SearchPage() {
  return (
    <UX7Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Terminal className="size-8 text-emerald-400" />
          Dataset Search
        </h1>
        <p className="text-neutral-400">
          Query and explore <span className="text-emerald-400 font-mono">1,284</span> available datasets
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-6 bg-[#0A0E1A] border-emerald-500/20">
        <CardContent className="pt-6">
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-emerald-400" />
              <Input
                placeholder="Search datasets, keywords, or query syntax..."
                className="pl-12 h-12 bg-black/30 border-emerald-500/30 text-white placeholder:text-neutral-600 focus:border-emerald-500/50"
              />
            </div>
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30 h-12">
              <Search className="mr-2 size-4" />
              Execute
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
              <Filter className="mr-2 size-4" />
              Advanced
            </Button>
            {["Clinical Trials", "2024", "Public", "Active"].map((filter) => (
              <Badge
                key={filter}
                className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
              >
                {filter}
                <button className="ml-2 hover:text-red-400">×</button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-400 font-mono">
          <span className="text-emerald-400">247</span> results found • <span className="text-emerald-400">0.42s</span>
        </p>
        <div className="flex gap-2">
          {["Relevance", "Date", "Size"].map((sort) => (
            <Button key={sort} variant="outline" size="sm" className="text-xs h-8 border-emerald-500/30 text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10">
              {sort}
            </Button>
          ))}
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {[
          {
            name: "Clinical Trial Data Q4 2024",
            description: "Comprehensive trial data including demographics, outcomes, and adverse events",
            category: "Clinical Trials",
            size: "2.4 GB",
            records: "847K",
            modified: "2024-10-15",
            access: "Public",
            starred: true,
          },
          {
            name: "Pharmacology Research Dataset",
            description: "Drug interactions, efficacy studies, and molecular compound analysis",
            category: "Pharmacology",
            size: "1.8 GB",
            records: "692K",
            modified: "2024-09-28",
            access: "Restricted",
            starred: false,
          },
          {
            name: "Patient Demographics Study 2024",
            description: "Anonymized demographic data for statistical analysis and research",
            category: "Demographics",
            size: "890 MB",
            records: "534K",
            modified: "2024-08-12",
            access: "Public",
            starred: true,
          },
          {
            name: "Lab Results Dataset Q3",
            description: "Laboratory test results, biomarkers, and diagnostic data",
            category: "Lab Results",
            size: "1.2 GB",
            records: "421K",
            modified: "2024-09-30",
            access: "Restricted",
            starred: false,
          },
          {
            name: "Genomic Research Data 2024",
            description: "Genomic sequencing data, genetic markers, and DNA analysis results",
            category: "Genomics",
            size: "5.7 GB",
            records: "1.2M",
            modified: "2024-10-20",
            access: "Restricted",
            starred: true,
          },
        ].map((dataset, i) => (
          <Card key={i} className="bg-[#0A0E1A] border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                  <div className="relative flex size-14 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                    <Database className="size-7 text-emerald-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-lg font-bold text-white">
                      {dataset.name}
                    </CardTitle>
                    <button>
                      <Star
                        className={`size-5 ${dataset.starred ? "fill-emerald-400 text-emerald-400" : "text-neutral-600"}`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-neutral-400 mb-4">{dataset.description}</p>

                  <div className="flex items-center gap-4 text-xs font-mono mb-4">
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-600">Size:</span>
                      <span className="text-emerald-400">{dataset.size}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-600">Records:</span>
                      <span className="text-emerald-400">{dataset.records}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-neutral-600">Modified:</span>
                      <span className="text-emerald-400">{dataset.modified}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                      {dataset.category}
                    </Badge>
                    <Badge className={dataset.access === "Public" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" : "bg-amber-500/10 text-amber-400 border-amber-500/30"}>
                      {dataset.access}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-md">
                    <Eye className="mr-2 size-4" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                    <Download className="mr-2 size-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
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
              className={page === 1
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/30"
                : "border-emerald-500/30 text-neutral-400 hover:text-emerald-400 hover:bg-emerald-500/10"
              }
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </UX7Layout>
  )
}

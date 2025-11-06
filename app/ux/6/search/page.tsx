import { UX6Layout } from "@/components/ux6-layout"
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
  SlidersHorizontal,
  Download,
  Eye,
  Star,
  Sparkles,
  Filter,
} from "lucide-react"

export default function UX6SearchPage() {
  return (
    <UX6Layout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent mb-2">
          Search Datasets
        </h1>
        <p className="text-neutral-600">
          Explore and filter through 1,284 available datasets
        </p>
      </div>

      {/* Search Section */}
      <Card className="mb-6 border-white/60 bg-white/40 backdrop-blur-xl shadow-xl">
        <CardContent className="pt-6">
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search datasets, topics, or keywords..."
                className="pl-12 h-12 bg-white/60 backdrop-blur-sm border-white/80"
              />
            </div>
            <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] shadow-lg shadow-purple-500/30 h-12">
              <Search className="mr-2 size-4" />
              Search
            </Button>
            <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/80 h-12">
              <Sparkles className="mr-2 size-4" />
              AI Search
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-white/80">
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
            {["Clinical Trials", "2024", "Approved", "Public Access"].map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="bg-gradient-to-r from-[#8B5CF6]/10 to-[#6366F1]/10 text-[#6366F1] border border-[#8B5CF6]/30 backdrop-blur-sm"
              >
                {filter}
                <button className="ml-2 hover:text-red-600">×</button>
              </Badge>
            ))}
            <Button variant="link" size="sm" className="text-xs text-neutral-600 h-auto p-0">
              Clear all
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-neutral-600">
          Showing <span className="font-semibold text-neutral-900">1-12</span> of{" "}
          <span className="font-semibold text-neutral-900">247</span> results
        </p>
        <div className="flex gap-2">
          <span className="text-xs text-neutral-600 mr-2 flex items-center">Sort by:</span>
          {["Relevance", "Date", "Name"].map((sort) => (
            <Button key={sort} variant="outline" size="sm" className="text-xs h-8 bg-white/60 backdrop-blur-sm border-white/80">
              {sort}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 gap-6">
        {[
          {
            name: "Clinical Trial Data Q4 2024",
            description: "Comprehensive trial data including demographics and outcomes",
            category: "Clinical Trials",
            size: "2.4 GB",
            modified: "2024-10-15",
            access: "Public",
            starred: true,
            color: "from-violet-500 to-purple-600"
          },
          {
            name: "Pharmacology Research Dataset",
            description: "Drug interactions and efficacy studies",
            category: "Pharmacology",
            size: "1.8 GB",
            modified: "2024-09-28",
            access: "Restricted",
            starred: false,
            color: "from-blue-500 to-cyan-600"
          },
          {
            name: "Patient Demographics Study 2024",
            description: "Anonymized demographic data for analysis",
            category: "Demographics",
            size: "890 MB",
            modified: "2024-08-12",
            access: "Public",
            starred: true,
            color: "from-emerald-500 to-teal-600"
          },
          {
            name: "Lab Results Dataset Q3",
            description: "Laboratory test results and analysis",
            category: "Lab Results",
            size: "1.2 GB",
            modified: "2024-09-30",
            access: "Restricted",
            starred: false,
            color: "from-amber-500 to-orange-600"
          },
          {
            name: "Treatment Outcomes Analysis",
            description: "Patient treatment outcomes and follow-up data",
            category: "Clinical Trials",
            size: "3.1 GB",
            modified: "2024-10-08",
            access: "Public",
            starred: false,
            color: "from-pink-500 to-rose-600"
          },
          {
            name: "Genomic Research Data 2024",
            description: "Genomic sequencing data for research",
            category: "Genomics",
            size: "5.7 GB",
            modified: "2024-10-20",
            access: "Restricted",
            starred: true,
            color: "from-indigo-500 to-purple-600"
          },
        ].map((dataset, i) => (
          <Card key={i} className="border-white/60 bg-white/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 group">
            <CardHeader>
              <div className="flex items-start gap-3 mb-3">
                <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dataset.color} shadow-lg`}>
                  <span className="text-2xl">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-base font-bold text-neutral-900 line-clamp-2">
                      {dataset.name}
                    </CardTitle>
                    <button className="shrink-0">
                      <Star
                        className={`size-5 ${dataset.starred ? "fill-[#F59E0B] text-[#F59E0B]" : "text-neutral-300"}`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-neutral-600 line-clamp-2 mb-3">{dataset.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs bg-white/50">{dataset.category}</Badge>
                    <Badge variant={dataset.access === "Public" ? "secondary" : "outline"} className="text-xs bg-white/50">
                      {dataset.access}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-xs text-neutral-600 mb-4">
                <span>{dataset.size}</span>
                <span>Modified {dataset.modified}</span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" className="flex-1 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] shadow-md">
                  <Eye className="mr-2 size-4" />
                  View
                </Button>
                <Button size="sm" variant="outline" className="bg-white/60 backdrop-blur-sm border-white/80">
                  <Download className="size-4" />
                </Button>
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
              className={page === 1 ? "bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] shadow-lg shadow-purple-500/30" : "bg-white/60 backdrop-blur-sm border-white/80"}
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </UX6Layout>
  )
}

import { UX11Layout } from "@/components/ux11-layout"
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
  Sparkles,
} from "lucide-react"

export default function UX11SearchPage() {
  return (
    <UX11Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 font-semibold">
            Search Repository
          </Badge>
        </div>
        <h1 className="text-5xl font-serif text-neutral-900 mb-3 tracking-wide">
          Find Your Data
        </h1>
        <p className="text-xl text-neutral-600">
          Explore 1,284 premium datasets
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6 border-0 shadow-xl bg-white">
        <CardContent className="pt-6">
          <div className="flex gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-5 top-1/2 size-5 -translate-y-1/2 text-purple-500" />
              <Input
                placeholder="Search datasets, keywords, or metadata..."
                className="pl-14 h-14 border-2 border-neutral-200 focus:border-purple-500 rounded-xl text-base font-medium shadow-sm"
              />
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold h-14 px-8 shadow-lg">
              <Sparkles className="mr-2 size-5" />
              Search
            </Button>
            <Button variant="outline" className="border-2 border-neutral-200 hover:bg-neutral-50 font-semibold h-14 px-6">
              <Filter className="mr-2 size-4" />
              Filters
            </Button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[
              { label: "Clinical Trials", gradient: "from-blue-500 to-cyan-500" },
              { label: "2024", gradient: "from-purple-500 to-pink-500" },
              { label: "Public", gradient: "from-emerald-500 to-teal-500" },
              { label: "High Priority", gradient: "from-amber-500 to-orange-500" },
            ].map((filter) => (
              <Badge
                key={filter.label}
                className={`bg-gradient-to-r ${filter.gradient} text-white border-0 font-semibold px-4 py-1.5`}
              >
                {filter.label}
                <button className="ml-2 hover:text-white/70">×</button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Header */}
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold text-neutral-600">
          Found <span className="text-purple-600 font-bold text-base">247</span> premium datasets
        </p>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-2 gap-6">
        {[
          {
            name: "Clinical Trial Data Q4 2024",
            description: "Comprehensive trial data with patient outcomes and demographics",
            category: "Clinical Trials",
            size: "2.4 GB",
            access: "Restricted",
            starred: true,
            gradient: "from-blue-500 to-cyan-500"
          },
          {
            name: "Pharmacology Research Dataset",
            description: "Drug interaction studies and molecular compound analysis",
            category: "Pharmacology",
            size: "1.8 GB",
            access: "Restricted",
            starred: false,
            gradient: "from-purple-500 to-pink-500"
          },
          {
            name: "Patient Demographics Study 2024",
            description: "Anonymized demographic data for statistical research",
            category: "Demographics",
            size: "890 MB",
            access: "Public",
            starred: true,
            gradient: "from-emerald-500 to-teal-500"
          },
          {
            name: "Lab Results Dataset Q3",
            description: "Laboratory test results and biomarker information",
            category: "Lab Results",
            size: "1.2 GB",
            access: "Restricted",
            starred: false,
            gradient: "from-amber-500 to-orange-500"
          },
          {
            name: "Genomic Research Data 2024",
            description: "DNA sequencing and genetic marker analysis data",
            category: "Genomics",
            size: "5.7 GB",
            access: "Confidential",
            starred: true,
            gradient: "from-red-500 to-pink-500"
          },
          {
            name: "Treatment Outcomes Analysis",
            description: "Patient treatment outcomes and recovery statistics",
            category: "Clinical Trials",
            size: "3.1 GB",
            access: "Public",
            starred: false,
            gradient: "from-cyan-500 to-blue-500"
          },
        ].map((dataset, i) => (
          <Card key={i} className="border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 bg-white group">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className={`flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${dataset.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                  <span className="text-3xl font-bold text-white">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <CardTitle className="text-lg font-bold text-neutral-900 leading-tight">
                      {dataset.name}
                    </CardTitle>
                    <button>
                      <Star
                        className={`size-5 ${dataset.starred ? "fill-amber-400 text-amber-400" : "text-neutral-300"}`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-neutral-600 font-medium mb-4">{dataset.description}</p>
                  <div className="flex items-center gap-2 flex-wrap mb-4">
                    <Badge className="bg-neutral-100 text-neutral-700 font-semibold">{dataset.category}</Badge>
                    <Badge className={
                      dataset.access === "Public" ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold" :
                      dataset.access === "Restricted" ? "bg-amber-50 text-amber-700 border-amber-200 font-semibold" :
                      "bg-red-50 text-red-700 border-red-200 font-semibold"
                    }>
                      {dataset.access}
                    </Badge>
                    <span className="text-xs text-neutral-500 font-medium">{dataset.size}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button className={`flex-1 bg-gradient-to-r ${dataset.gradient} hover:opacity-90 text-white font-bold shadow-md`}>
                  <Eye className="mr-2 size-4" />
                  View
                </Button>
                <Button variant="outline" className="border-2 border-neutral-200 hover:bg-neutral-50 font-semibold">
                  <Download className="size-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, "...", 21].map((page, i) => (
            <Button
              key={i}
              variant={page === 1 ? "default" : "outline"}
              className={
                page === 1
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-lg min-w-[2.5rem]"
                  : "border-2 border-neutral-200 hover:bg-neutral-50 font-semibold min-w-[2.5rem]"
              }
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </UX11Layout>
  )
}

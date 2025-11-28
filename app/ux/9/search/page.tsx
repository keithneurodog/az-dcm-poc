import { UX9Layout } from "@/app/ux/_components/ux9-layout"
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
  Sparkles,
  Filter,
} from "lucide-react"

export default function UX9SearchPage() {
  return (
    <UX9Layout>
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-5">
          <span className="text-5xl">🔍</span>
          <h1 className="text-5xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Find Your Data
          </h1>
        </div>
        <p className="text-xl text-neutral-600 font-bold">
          Search through 1,284 datasets • Lightning fast results ⚡
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="relative">
          <Search className="absolute left-6 top-1/2 size-6 -translate-y-1/2 text-purple-500" />
          <Input
            placeholder="Search datasets, keywords, or anything..."
            className="h-16 pl-16 pr-4 text-lg font-bold border-4 border-purple-200 focus:border-purple-500 rounded-3xl bg-white shadow-xl"
          />
        </div>
        <div className="flex items-center justify-center gap-3 mt-6">
          <Button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-black shadow-lg">
            <Sparkles className="mr-2 size-4" />
            AI Search
          </Button>
          <Button variant="outline" className="font-bold border-2">
            <Filter className="mr-2 size-4" />
            Filters
          </Button>
          {["Clinical Trials", "2024", "Public"].map((filter) => (
            <Badge
              key={filter}
              className="bg-purple-100 text-purple-700 hover:bg-purple-200 font-bold px-4 py-2 text-sm"
            >
              {filter}
              <button className="ml-2 hover:text-red-500 font-black">×</button>
            </Badge>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="mb-6 text-center">
        <p className="text-sm font-bold text-neutral-600">
          Found <span className="text-purple-600 font-black">247</span> amazing datasets in <span className="text-purple-600 font-black">0.3s</span>
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
            access: "Public",
            starred: true,
            emoji: "💊",
            gradient: "from-blue-500 to-cyan-500"
          },
          {
            name: "Pharmacology Research Dataset",
            description: "Drug interaction studies and molecular compound analysis",
            category: "Pharmacology",
            size: "1.8 GB",
            access: "Restricted",
            starred: false,
            emoji: "🧪",
            gradient: "from-purple-500 to-pink-500"
          },
          {
            name: "Patient Demographics Study 2024",
            description: "Anonymized demographic data for statistical research",
            category: "Demographics",
            size: "890 MB",
            access: "Public",
            starred: true,
            emoji: "👥",
            gradient: "from-green-500 to-emerald-500"
          },
          {
            name: "Lab Results Dataset Q3",
            description: "Laboratory test results and biomarker information",
            category: "Lab Results",
            size: "1.2 GB",
            access: "Restricted",
            starred: false,
            emoji: "📊",
            gradient: "from-amber-500 to-orange-500"
          },
          {
            name: "Genomic Research Data 2024",
            description: "DNA sequencing and genetic marker analysis data",
            category: "Genomics",
            size: "5.7 GB",
            access: "Restricted",
            starred: true,
            emoji: "🧬",
            gradient: "from-red-500 to-pink-500"
          },
          {
            name: "Treatment Outcomes Analysis",
            description: "Patient treatment outcomes and recovery statistics",
            category: "Clinical Trials",
            size: "3.1 GB",
            access: "Public",
            starred: false,
            emoji: "💉",
            gradient: "from-cyan-500 to-blue-500"
          },
        ].map((dataset, i) => (
          <Card key={i} className="border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-white overflow-hidden group">
            <CardHeader>
              <div className="flex items-start gap-4">
                <div className={`flex size-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${dataset.gradient} shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-transform`}>
                  <span className="text-4xl">{dataset.emoji}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <CardTitle className="text-lg font-black text-neutral-900 leading-tight">
                      {dataset.name}
                    </CardTitle>
                    <button>
                      <Star
                        className={`size-6 ${dataset.starred ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}`}
                      />
                    </button>
                  </div>
                  <p className="text-sm text-neutral-600 font-medium mb-4 line-clamp-2">{dataset.description}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-purple-100 text-purple-700 font-bold">{dataset.category}</Badge>
                    <Badge className={dataset.access === "Public" ? "bg-green-100 text-green-700 font-bold" : "bg-amber-100 text-amber-700 font-bold"}>
                      {dataset.access}
                    </Badge>
                    <span className="text-xs text-neutral-500 font-bold">{dataset.size}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex gap-2">
                <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black shadow-lg">
                  <Eye className="mr-2 size-4" />
                  View
                </Button>
                <Button variant="outline" className="font-bold border-2 hover:bg-slate-50">
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
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black shadow-lg min-w-[2.5rem] h-12"
                  : "font-bold border-2 hover:bg-purple-50 min-w-[2.5rem] h-12"
              }
            >
              {page}
            </Button>
          ))}
        </div>
      </div>
    </UX9Layout>
  )
}

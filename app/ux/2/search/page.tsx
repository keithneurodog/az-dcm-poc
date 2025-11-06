import { UX2Layout } from "@/components/ux2-layout"
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
  Database,
  Calendar,
  Download,
  Eye,
  Filter,
} from "lucide-react"

export default function UX2SearchPage() {
  return (
    <UX2Layout>
      {/* Hero Section */}
      <div className="-m-6 mb-8 bg-gradient-to-br from-neutral-700 to-neutral-600 px-6 py-12 shadow-lg rounded-b-lg">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 inline-block rounded-lg border border-[#F0AB00]/30 bg-[#F0AB00]/10 px-3 py-1.5">
            <span className="text-xs font-medium text-[#F0AB00]">
              Search
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-white">
            Find Your Data
          </h1>
          <p className="text-base text-white/80">
            Search through 1,284 datasets with advanced filters and AI assistance
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mb-6 border border-neutral-200 shadow-brutal rounded-lg">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search for datasets, keywords, or topics..."
                className="pl-12 h-12 border border-neutral-300 text-base font-medium rounded-lg"
              />
            </div>
            <Button className="h-12 px-6 bg-[#830051] hover:bg-[#830051]/90 text-white font-semibold rounded-lg">
              Search
            </Button>
            <Button variant="outline" className="h-12 px-5 border border-neutral-300 font-medium rounded-lg">
              <SlidersHorizontal className="mr-2 size-4" />
              Filters
            </Button>
          </div>

          {/* Active Filters */}
          <div className="mt-4 flex flex-wrap gap-2">
            {["Clinical Trials", "2024", "Approved"].map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="bg-[#F0AB00]/10 text-[#830051] border border-[#F0AB00] font-medium px-3 py-1 rounded-lg"
              >
                {filter}
                <button className="ml-2 hover:text-red-600 font-bold">×</button>
              </Badge>
            ))}
            <Button variant="ghost" size="sm" className="font-medium text-neutral-600">
              Clear all
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-4">
        {/* Filters Sidebar */}
        <div className="space-y-4">
          <Card className="border border-neutral-200 shadow-brutal rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-bold text-sm">
                <Filter className="size-4" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="mb-3 text-xs font-bold text-neutral-700">
                  Category
                </h4>
                <div className="space-y-2">
                  {[
                    "Clinical Trials",
                    "Research Data",
                    "Patient Records",
                    "Lab Results",
                  ].map((category) => (
                    <label key={category} className="flex items-center gap-2">
                      <input type="checkbox" className="size-4 border border-neutral-300 rounded" />
                      <span className="text-sm font-medium">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-200">
                <h4 className="mb-3 text-xs font-bold text-neutral-700">
                  Date Range
                </h4>
                <div className="space-y-2">
                  {["Last 7 days", "Last 30 days", "Last 90 days"].map((range) => (
                    <label key={range} className="flex items-center gap-2">
                      <input type="radio" name="date" className="size-4 border border-neutral-300" />
                      <span className="text-sm font-medium">{range}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full border border-neutral-300 font-medium hover:bg-neutral-50 rounded-lg">
                Reset Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="md:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-neutral-900">
              <span className="text-xl font-bold">247</span> <span className="text-neutral-600">results found</span>
            </p>
            <div className="flex gap-2">
              {["Relevance", "Date", "Name"].map((sort) => (
                <Button
                  key={sort}
                  variant="outline"
                  size="sm"
                  className="border border-neutral-300 font-medium rounded-lg"
                >
                  {sort}
                </Button>
              ))}
            </div>
          </div>

          {/* Result Cards */}
          {[
            {
              title: "Clinical Trial Data Q4 2024",
              description:
                "Comprehensive clinical trial data for Q4 2024 including patient demographics and treatment outcomes.",
              tags: ["Clinical Trials", "2024", "Oncology"],
              date: "2024-10-15",
              size: "2.4 GB",
              views: 245,
            },
            {
              title: "Pharmacology Research Dataset",
              description:
                "In-depth pharmacology research data covering drug interactions and efficacy studies.",
              tags: ["Pharmacology", "Research"],
              date: "2024-09-28",
              size: "1.8 GB",
              views: 189,
            },
            {
              title: "Patient Demographics Study 2024",
              description:
                "Anonymized patient demographic data for statistical analysis and research purposes.",
              tags: ["Demographics", "Statistics"],
              date: "2024-08-12",
              size: "890 MB",
              views: 156,
            },
          ].map((result, index) => (
            <Card
              key={index}
              className="border border-neutral-200 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all rounded-lg"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-bold mb-2">{result.title}</CardTitle>
                    <p className="text-sm text-neutral-600 leading-relaxed">{result.description}</p>
                  </div>
                  <Database className="size-7 text-[#830051] flex-shrink-0 ml-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {result.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border border-neutral-300 font-medium rounded-lg"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-xs font-medium text-neutral-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="size-3" />
                    {result.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Database className="size-3" />
                    {result.size}
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="size-3" />
                    {result.views}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" className="bg-[#830051] hover:bg-[#830051]/90 font-semibold rounded-lg">
                    <Eye className="mr-2 size-4" />
                    View
                  </Button>
                  <Button size="sm" variant="outline" className="border border-neutral-300 font-medium rounded-lg">
                    <Download className="mr-2 size-4" />
                    Request
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button variant="outline" size="sm" className="border border-neutral-300 font-medium rounded-lg">
              Previous
            </Button>
            {[1, 2, 3, "...", 25].map((page, index) => (
              <Button
                key={index}
                variant={page === 1 ? "default" : "outline"}
                size="sm"
                className={`min-w-[40px] font-medium rounded-lg ${
                  page === 1
                    ? "bg-[#830051] hover:bg-[#830051]/90"
                    : "border border-neutral-300"
                }`}
              >
                {page}
              </Button>
            ))}
            <Button variant="outline" size="sm" className="border border-neutral-300 font-medium rounded-lg">
              Next
            </Button>
          </div>
        </div>
      </div>
    </UX2Layout>
  )
}

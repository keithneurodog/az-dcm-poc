import { AppLayout } from "@/app/ux/_components/app-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Filter,
  SlidersHorizontal,
  Database,
  Calendar,
  Tag,
  Download,
  Eye,
} from "lucide-react"

export default function SearchPage() {
  return (
    <AppLayout breadcrumbs={[{ label: "Search" }]}>
      <div className="space-y-8 -m-6">
        {/* Hero Section */}
        <div className="bg-primary px-6 py-12">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-primary-foreground mb-2">
              Search Datasets
            </h1>
            <p className="text-primary-foreground/90 text-lg">
              Find and explore datasets using keywords, filters, or our AI-powered search assistant
            </p>
          </div>
        </div>

        <div className="px-6 space-y-6">
          {/* Search Bar */}
          <Card className="border-none shadow-lg">
            <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search for datasets, keywords, or topics..."
                  className="pl-9"
                />
              </div>
              <Button>
                <Search className="mr-2 size-4" />
                Search
              </Button>
              <Button variant="outline">
                <SlidersHorizontal className="mr-2 size-4" />
                Advanced
              </Button>
            </div>

            {/* Active Filters */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="secondary" className="gap-1 rounded-full">
                Clinical Trials
                <button className="ml-1 hover:text-destructive">×</button>
              </Badge>
              <Badge variant="secondary" className="gap-1 rounded-full">
                2024
                <button className="ml-1 hover:text-destructive">×</button>
              </Badge>
              <Badge variant="secondary" className="gap-1 rounded-full">
                Approved
                <button className="ml-1 hover:text-destructive">×</button>
              </Badge>
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                Clear all
              </Button>
            </div>
          </CardContent>
        </Card>

          <div className="grid gap-6 lg:grid-cols-4">
            {/* Filters Sidebar */}
            <div className="space-y-4">
              <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-base">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="mb-2 text-sm font-medium flex items-center gap-2">
                    <Tag className="size-4" />
                    Category
                  </h4>
                  <div className="space-y-2">
                    {[
                      "Clinical Trials",
                      "Research Data",
                      "Patient Records",
                      "Lab Results",
                      "Pharmacology",
                    ].map((category) => (
                      <label
                        key={category}
                        className="flex items-center gap-2 text-sm"
                      >
                        <input type="checkbox" className="rounded" />
                        <span>{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="mb-2 text-sm font-medium flex items-center gap-2">
                    <Calendar className="size-4" />
                    Date Range
                  </h4>
                  <div className="space-y-2">
                    {["Last 7 days", "Last 30 days", "Last 90 days", "Custom"].map(
                      (range) => (
                        <label key={range} className="flex items-center gap-2 text-sm">
                          <input type="radio" name="date" />
                          <span>{range}</span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="mb-2 text-sm font-medium flex items-center gap-2">
                    <Filter className="size-4" />
                    Status
                  </h4>
                  <div className="space-y-2">
                    {["Available", "Pending", "Archived"].map((status) => (
                      <label key={status} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" className="rounded" />
                        <span>{status}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <Button variant="outline" className="w-full">
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium">1-10</span> of{" "}
                <span className="font-medium">247</span> results
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Relevance
                </Button>
                <Button variant="outline" size="sm">
                  Date
                </Button>
                <Button variant="outline" size="sm">
                  Name
                </Button>
              </div>
            </div>

            {/* Result Cards */}
            {[
              {
                title: "Clinical Trial Data Q4 2024",
                description:
                  "Comprehensive clinical trial data for Q4 2024 including patient demographics, treatment outcomes, and adverse events.",
                tags: ["Clinical Trials", "2024", "Oncology"],
                date: "2024-10-15",
                size: "2.4 GB",
                views: 245,
              },
              {
                title: "Pharmacology Research Dataset",
                description:
                  "In-depth pharmacology research data covering drug interactions, efficacy studies, and safety profiles.",
                tags: ["Pharmacology", "Research", "Drug Development"],
                date: "2024-09-28",
                size: "1.8 GB",
                views: 189,
              },
              {
                title: "Patient Demographics Study 2024",
                description:
                  "Anonymized patient demographic data for statistical analysis and research purposes.",
                tags: ["Demographics", "Statistics", "Research"],
                date: "2024-08-12",
                size: "890 MB",
                views: 156,
              },
            ].map((result, index) => (
              <Card key={index} className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{result.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {result.description}
                      </CardDescription>
                    </div>
                    <Database className="size-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {result.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="size-4" />
                        {result.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Database className="size-4" />
                        {result.size}
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="size-4" />
                        {result.views} views
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm">
                        <Eye className="mr-2 size-4" />
                        View Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 size-4" />
                        Request Access
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 pt-4">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              {[1, 2, 3, "...", 25].map((page, index) => (
                <Button
                  key={index}
                  variant={page === 1 ? "default" : "outline"}
                  size="sm"
                  className="min-w-[40px]"
                >
                  {page}
                </Button>
              ))}
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </div>
        </div>
      </div>
    </AppLayout>
  )
}

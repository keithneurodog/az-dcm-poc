import { UX5Layout } from "@/app/ux/_components/ux5-layout"
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
  MoreVertical,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export default function UX5SearchPage() {
  return (
    <UX5Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Search Datasets</h1>
        <p className="text-sm text-neutral-600">
          Search and filter through 1,284 available datasets
        </p>
      </div>

      {/* Search Bar */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search datasets, topics, or keywords..."
                className="pl-10"
              />
            </div>
            <Button className="bg-[#0D9488] hover:bg-[#0D9488]/90">
              Search
            </Button>
            <Button variant="outline">
              <SlidersHorizontal className="mr-2 size-4" />
              Filters
            </Button>
          </div>

          {/* Active Filters */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs font-medium text-neutral-600">Active filters:</span>
            {["Clinical Trials", "2024", "Approved"].map((filter) => (
              <Badge
                key={filter}
                variant="secondary"
                className="bg-[#F59E0B]/10 text-[#0D9488] border border-[#F59E0B]"
              >
                {filter}
                <button className="ml-1.5 hover:text-red-600">×</button>
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
        <div>
          <p className="text-sm text-neutral-600">
            Showing <span className="font-semibold text-neutral-900">1-20</span> of{" "}
            <span className="font-semibold text-neutral-900">247</span> results
          </p>
        </div>
        <div className="flex gap-2">
          <span className="text-xs text-neutral-600 mr-2 flex items-center">Sort by:</span>
          {["Relevance", "Date", "Name", "Size"].map((sort) => (
            <Button key={sort} variant="outline" size="sm" className="text-xs h-8">
              {sort}
            </Button>
          ))}
        </div>
      </div>

      {/* Results Table */}
      <Card>
        <CardContent className="p-0">
          <div className="border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input type="checkbox" className="size-4" />
                  </th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Dataset Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Size</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Modified</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Access</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  {
                    name: "Clinical Trial Data Q4 2024",
                    description: "Comprehensive trial data including demographics and outcomes",
                    category: "Clinical Trials",
                    size: "2.4 GB",
                    modified: "2024-10-15",
                    access: "Public",
                    status: "Active",
                    starred: true,
                  },
                  {
                    name: "Pharmacology Research Dataset",
                    description: "Drug interactions and efficacy studies",
                    category: "Pharmacology",
                    size: "1.8 GB",
                    modified: "2024-09-28",
                    access: "Restricted",
                    status: "Active",
                    starred: false,
                  },
                  {
                    name: "Patient Demographics Study 2024",
                    description: "Anonymized demographic data for analysis",
                    category: "Demographics",
                    size: "890 MB",
                    modified: "2024-08-12",
                    access: "Public",
                    status: "Active",
                    starred: true,
                  },
                  {
                    name: "Lab Results Dataset Q3",
                    description: "Laboratory test results and analysis",
                    category: "Lab Results",
                    size: "1.2 GB",
                    modified: "2024-09-30",
                    access: "Restricted",
                    status: "Active",
                    starred: false,
                  },
                  {
                    name: "Treatment Outcomes Analysis",
                    description: "Patient treatment outcomes and follow-up data",
                    category: "Clinical Trials",
                    size: "3.1 GB",
                    modified: "2024-10-08",
                    access: "Public",
                    status: "Processing",
                    starred: false,
                  },
                  {
                    name: "Genomic Research Data 2024",
                    description: "Genomic sequencing data for research",
                    category: "Genomics",
                    size: "5.7 GB",
                    modified: "2024-10-20",
                    access: "Restricted",
                    status: "Active",
                    starred: true,
                  },
                  {
                    name: "Drug Safety Monitoring",
                    description: "Adverse events and safety monitoring data",
                    category: "Pharmacology",
                    size: "750 MB",
                    modified: "2024-10-18",
                    access: "Public",
                    status: "Active",
                    starred: false,
                  },
                  {
                    name: "Clinical Trial Protocols Archive",
                    description: "Historical trial protocols and documentation",
                    category: "Clinical Trials",
                    size: "420 MB",
                    modified: "2024-09-15",
                    access: "Public",
                    status: "Archived",
                    starred: false,
                  },
                ].map((dataset, i) => (
                  <tr key={i} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <input type="checkbox" className="size-4" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-2">
                        <button className="mt-0.5">
                          <Star
                            className={`size-4 ${dataset.starred ? "fill-[#F59E0B] text-[#F59E0B]" : "text-neutral-300"}`}
                          />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-neutral-900 truncate">{dataset.name}</p>
                          <p className="text-xs text-neutral-500 truncate">{dataset.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">
                        {dataset.category}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{dataset.size}</td>
                    <td className="px-4 py-3 text-neutral-600">{dataset.modified}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={dataset.access === "Public" ? "secondary" : "outline"}
                        className="text-xs"
                      >
                        {dataset.access}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          dataset.status === "Active"
                            ? "default"
                            : dataset.status === "Processing"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          dataset.status === "Active"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : dataset.status === "Processing"
                            ? "bg-amber-100 text-amber-700 border-amber-200"
                            : ""
                        }
                      >
                        {dataset.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button className="p-1.5 hover:bg-neutral-100 rounded">
                          <Eye className="size-4 text-neutral-500" />
                        </button>
                        <button className="p-1.5 hover:bg-neutral-100 rounded">
                          <Download className="size-4 text-neutral-500" />
                        </button>
                        <button className="p-1.5 hover:bg-neutral-100 rounded">
                          <MoreVertical className="size-4 text-neutral-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-600">Rows per page:</span>
              <select className="text-sm border rounded px-2 py-1">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8">
                <ChevronLeft className="size-4" />
              </Button>
              <span className="text-sm text-neutral-600">Page 1 of 13</span>
              <Button variant="outline" size="sm" className="h-8">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-neutral-600">With selected:</span>
        <Button variant="outline" size="sm" className="text-xs h-8">
          <Download className="mr-1.5 size-3" />
          Download
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-8">
          <Star className="mr-1.5 size-3" />
          Add to Favorites
        </Button>
        <Button variant="outline" size="sm" className="text-xs h-8 text-red-600 hover:text-red-700">
          Delete
        </Button>
      </div>
    </UX5Layout>
  )
}

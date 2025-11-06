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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Search,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
} from "lucide-react"

export default function UX10ManagementPage() {
  return (
    <UX10Layout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
              Management Console
            </Badge>
          </div>
          <h1 className="text-4xl font-serif text-neutral-900 mb-3 tracking-wide">
            System Administration
          </h1>
          <p className="text-lg text-neutral-600">
            Enterprise resource management
          </p>
        </div>
        <Button className="bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-white font-semibold">
          <Plus className="mr-2 size-4" />
          New Dataset
        </Button>
      </div>

      <Tabs defaultValue="datasets" className="space-y-6">
        <TabsList className="bg-white border border-neutral-200">
          <TabsTrigger
            value="datasets"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-amber-600 data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Datasets
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-amber-600 data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Requests
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-400 data-[state=active]:to-amber-600 data-[state=active]:text-slate-900 data-[state=active]:font-semibold"
          >
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-4">
          <Card className="bg-white border-neutral-200 backdrop-blur-sm">
            <CardHeader className="border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif text-neutral-900">Dataset Registry</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-500" />
                    <Input placeholder="Search..." className="pl-9 w-[200px] bg-neutral-50 border-neutral-200 text-neutral-900 placeholder:text-neutral-500" />
                  </div>
                  <Button variant="outline" size="sm" className="border-neutral-200 text-neutral-700 hover:bg-neutral-50">
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {[
                  { name: "Clinical Trial Data Q4 2024", status: "Active", size: "2.4 GB", modified: "2h ago", access: "Restricted" },
                  { name: "Pharmacology Research Archive", status: "Processing", size: "1.8 GB", modified: "1d ago", access: "Restricted" },
                  { name: "Patient Demographics Dataset", status: "Active", size: "890 MB", modified: "3d ago", access: "Public" },
                  { name: "Lab Results Dataset Q3", status: "Active", size: "1.2 GB", modified: "5d ago", access: "Confidential" },
                  { name: "Genomic Research Data 2024", status: "Archived", size: "5.7 GB", modified: "2w ago", access: "Confidential" },
                ].map((dataset, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200/30 hover:border-amber-200 transition-all">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white font-semibold">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900 mb-1">{dataset.name}</p>
                      <div className="flex items-center gap-3 text-sm text-neutral-500">
                        <span>{dataset.size}</span>
                        <span>•</span>
                        <span>{dataset.modified}</span>
                      </div>
                    </div>
                    <Badge className={
                      dataset.status === "Active"
                        ? "bg-emerald-400/10 text-emerald-600 border-emerald-400/30"
                        : dataset.status === "Processing"
                        ? "bg-cyan-400/10 text-cyan-600 border-cyan-400/30"
                        : "bg-neutral-100 text-neutral-600 border-neutral-300"
                    }>
                      {dataset.status}
                    </Badge>
                    <Badge variant="outline" className="border-neutral-200 text-neutral-600">
                      {dataset.access}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="size-9 p-0 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100">
                        <Edit className="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="size-9 p-0 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100">
                        <Download className="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="size-9 p-0 text-red-600 hover:text-red-300 hover:bg-red-50">
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card className="bg-white border-neutral-200 backdrop-blur-sm">
            <CardHeader className="border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif text-neutral-900">Access Requests</CardTitle>
                <Badge className="bg-amber-400/10 text-amber-600 border-amber-400/30">
                  8 Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {[
                  { requester: "Dr. Sarah Johnson", email: "sarah.johnson@az.com", dataset: "Clinical Trial Data Q4 2024", type: "Download", priority: "High", status: "Pending", icon: Clock },
                  { requester: "Michael Chen", email: "michael.chen@az.com", dataset: "Pharmacology Research Archive", type: "Modify", priority: "Normal", status: "Approved", icon: CheckCircle },
                  { requester: "Dr. Emily Rodriguez", email: "emily.rodriguez@az.com", dataset: "Patient Demographics Dataset", type: "View", priority: "Normal", status: "Pending", icon: Clock },
                  { requester: "James Wilson", email: "james.wilson@az.com", dataset: "Lab Results Dataset Q3", type: "Download", priority: "Low", status: "Rejected", icon: XCircle },
                ].map((request, i) => {
                  const Icon = request.icon
                  return (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200/30 hover:border-amber-200 transition-all">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 text-sm font-semibold">
                        {request.requester.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-900">{request.requester}</p>
                        <p className="text-sm text-neutral-500 truncate mb-2">{request.dataset}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="border-neutral-200 text-neutral-600 text-xs">
                            {request.type}
                          </Badge>
                          <Badge className={
                            request.priority === "High"
                              ? "bg-red-400/10 text-red-600 border-red-400/30 text-xs"
                              : request.priority === "Normal"
                              ? "bg-cyan-400/10 text-cyan-600 border-cyan-400/30 text-xs"
                              : "bg-neutral-100 text-neutral-600 border-neutral-300 text-xs"
                          }>
                            {request.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 ${
                          request.status === "Approved" ? "text-emerald-600" :
                          request.status === "Rejected" ? "text-red-600" :
                          "text-amber-600"
                        }`}>
                          <Icon className="size-4" />
                          <span className="text-sm font-medium">{request.status}</span>
                        </div>
                        {request.status === "Pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-neutral-900">
                              <CheckCircle className="mr-1 size-3" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-200 hover:bg-red-50">
                              <XCircle className="mr-1 size-3" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card className="bg-white border-neutral-200 backdrop-blur-sm">
            <CardHeader className="border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-serif text-neutral-900">User Access Control</CardTitle>
                <Button variant="outline" size="sm" className="border-neutral-200 text-neutral-700 hover:bg-neutral-50">
                  <Plus className="mr-2 size-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {[
                  { name: "Dr. Sarah Johnson", email: "sarah.johnson@astrazeneca.com", department: "Clinical Research", role: "Admin", access: "Full Access", lastActive: "2h ago", status: "Active" },
                  { name: "Michael Chen", email: "michael.chen@astrazeneca.com", department: "Data Science", role: "Editor", access: "Read & Write", lastActive: "1d ago", status: "Active" },
                  { name: "Dr. Emily Rodriguez", email: "emily.rodriguez@astrazeneca.com", department: "Pharmacology", role: "Viewer", access: "Read Only", lastActive: "3d ago", status: "Active" },
                  { name: "James Wilson", email: "james.wilson@astrazeneca.com", department: "Laboratory", role: "Editor", access: "Read & Write", lastActive: "1w ago", status: "Inactive" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200/30 hover:border-amber-200 transition-all">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-slate-900 text-sm font-semibold">
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-neutral-900">{user.name}</p>
                      <p className="text-sm text-neutral-500 mb-2">{user.department}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          user.role === "Admin"
                            ? "bg-amber-400/10 text-amber-600 border-amber-400/30"
                            : "bg-neutral-100 text-neutral-600 border-neutral-300"
                        }>
                          {user.role}
                        </Badge>
                        <span className="text-xs text-neutral-500 flex items-center gap-1">
                          <Shield className="size-3" />
                          {user.access}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={
                          user.status === "Active"
                            ? "bg-emerald-400/10 text-emerald-600 border-emerald-400/30"
                            : "bg-neutral-100 text-neutral-600 border-neutral-300"
                        }>
                          {user.status}
                        </Badge>
                        <p className="text-xs text-neutral-500 mt-1">{user.lastActive}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="size-9 p-0 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100">
                        <Edit className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UX10Layout>
  )
}

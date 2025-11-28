import { UX6Layout } from "@/app/ux/_components/ux6-layout"
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
  Users,
} from "lucide-react"

export default function UX6ManagementPage() {
  return (
    <UX6Layout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent mb-2">
            Data Management
          </h1>
          <p className="text-neutral-600">
            Manage datasets, access requests, and user permissions
          </p>
        </div>
        <Button className="bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] hover:from-[#7C3AED] hover:to-[#4F46E5] shadow-lg shadow-purple-500/30">
          <Plus className="mr-2 size-4" />
          New Dataset
        </Button>
      </div>

      <Tabs defaultValue="datasets" className="space-y-6">
        <TabsList className="bg-white/60 backdrop-blur-xl border border-white/80 shadow-lg">
          <TabsTrigger value="datasets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#6366F1] data-[state=active]:text-white">
            My Datasets
          </TabsTrigger>
          <TabsTrigger value="requests" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#6366F1] data-[state=active]:text-white">
            Access Requests
          </TabsTrigger>
          <TabsTrigger value="permissions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#8B5CF6] data-[state=active]:to-[#6366F1] data-[state=active]:text-white">
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-4">
          <Card className="border-white/60 bg-white/40 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">My Datasets</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input placeholder="Search..." className="pl-9 w-[200px] bg-white/60 backdrop-blur-sm border-white/80" />
                  </div>
                  <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-white/80">
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Clinical Trial Data Q4 2024", status: "Active", size: "2.4 GB", modified: "2 hours ago", access: "Public", color: "from-violet-500 to-purple-600" },
                  { name: "Pharmacology Research Archive", status: "Processing", size: "1.8 GB", modified: "1 day ago", access: "Restricted", color: "from-blue-500 to-cyan-600" },
                  { name: "Patient Demographics Dataset", status: "Active", size: "890 MB", modified: "3 days ago", access: "Public", color: "from-emerald-500 to-teal-600" },
                  { name: "Lab Results Dataset Q3", status: "Active", size: "1.2 GB", modified: "5 days ago", access: "Private", color: "from-amber-500 to-orange-600" },
                  { name: "Genomic Research Data 2024", status: "Archived", size: "5.7 GB", modified: "2 weeks ago", access: "Restricted", color: "from-pink-500 to-rose-600" },
                ].map((dataset, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/80 hover:shadow-lg transition-all">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dataset.color} text-white font-bold text-sm shadow-lg`}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900 mb-1">{dataset.name}</p>
                      <div className="flex items-center gap-3 text-sm text-neutral-600">
                        <span>{dataset.size}</span>
                        <span>•</span>
                        <span>{dataset.modified}</span>
                        <Badge variant="outline" className="text-xs bg-white/50">{dataset.access}</Badge>
                      </div>
                    </div>
                    <Badge
                      className={
                        dataset.status === "Active"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : dataset.status === "Processing"
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-neutral-100 text-neutral-700 border-neutral-200"
                      }
                    >
                      {dataset.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="size-9 p-0">
                        <Edit className="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="size-9 p-0">
                        <Download className="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="size-9 p-0 text-red-600 hover:text-red-700">
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
          <Card className="border-white/60 bg-white/40 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Access Requests</CardTitle>
                <Badge className="bg-gradient-to-r from-[#EC4899] to-[#F43F5E] text-white border-0">
                  8 Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { requester: "Dr. Sarah Johnson", email: "sarah.johnson@az.com", dataset: "Clinical Trial Data Q4 2024", type: "Download", date: "2024-11-04", priority: "High", status: "Pending", icon: Clock },
                  { requester: "Michael Chen", email: "michael.chen@az.com", dataset: "Pharmacology Research Archive", type: "Modify", date: "2024-11-03", priority: "Normal", status: "Approved", icon: CheckCircle },
                  { requester: "Dr. Emily Rodriguez", email: "emily.rodriguez@az.com", dataset: "Patient Demographics Dataset", type: "View", date: "2024-11-02", priority: "Normal", status: "Pending", icon: Clock },
                  { requester: "James Wilson", email: "james.wilson@az.com", dataset: "Lab Results Dataset Q3", type: "Download", date: "2024-11-01", priority: "Low", status: "Rejected", icon: XCircle },
                ].map((request, i) => {
                  const Icon = request.icon
                  return (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/80 hover:shadow-lg transition-all">
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 text-white text-xs font-semibold shadow-lg">
                        {request.requester.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900">{request.requester}</p>
                        <p className="text-sm text-neutral-600 truncate">{request.dataset}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs bg-white/50">{request.type}</Badge>
                          <Badge
                            className={
                              request.priority === "High"
                                ? "bg-red-100 text-red-700 border-red-200 text-xs"
                                : request.priority === "Normal"
                                ? "bg-blue-100 text-blue-700 border-blue-200 text-xs"
                                : "bg-neutral-100 text-neutral-700 border-neutral-200 text-xs"
                            }
                          >
                            {request.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1.5 ${
                          request.status === "Approved" ? "text-green-600" :
                          request.status === "Rejected" ? "text-red-600" :
                          "text-amber-600"
                        }`}>
                          <Icon className="size-4" />
                          <span className="text-xs font-medium">{request.status}</span>
                        </div>
                        {request.status === "Pending" && (
                          <div className="flex gap-1">
                            <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                              <CheckCircle className="mr-1 size-3" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-red-600 hover:text-red-700 bg-white/60 backdrop-blur-sm border-white/80">
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
          <Card className="border-white/60 bg-white/40 backdrop-blur-xl shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">User Permissions</CardTitle>
                <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-white/80">
                  <Plus className="mr-2 size-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Dr. Sarah Johnson", email: "sarah.johnson@astrazeneca.com", department: "Clinical Research", role: "Admin", access: "Full Access", lastActive: "2 hours ago", status: "Active", color: "from-violet-500 to-purple-600" },
                  { name: "Michael Chen", email: "michael.chen@astrazeneca.com", department: "Data Science", role: "Editor", access: "Read & Write", lastActive: "1 day ago", status: "Active", color: "from-blue-500 to-cyan-600" },
                  { name: "Dr. Emily Rodriguez", email: "emily.rodriguez@astrazeneca.com", department: "Pharmacology", role: "Viewer", access: "Read Only", lastActive: "3 days ago", status: "Active", color: "from-emerald-500 to-teal-600" },
                  { name: "James Wilson", email: "james.wilson@astrazeneca.com", department: "Laboratory", role: "Editor", access: "Read & Write", lastActive: "1 week ago", status: "Inactive", color: "from-amber-500 to-orange-600" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/80 hover:shadow-lg transition-all">
                    <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${user.color} text-white text-xs font-semibold shadow-lg`}>
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-neutral-900">{user.name}</p>
                      <p className="text-sm text-neutral-600">{user.department}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge
                          variant="outline"
                          className={user.role === "Admin" ? "border-[#8B5CF6] text-[#8B5CF6] bg-[#8B5CF6]/5" : "bg-white/50"}
                        >
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
                        <Badge className={user.status === "Active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-neutral-100 text-neutral-700 border-neutral-200"}>
                          {user.status}
                        </Badge>
                        <p className="text-xs text-neutral-500 mt-1">{user.lastActive}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="size-9 p-0">
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
    </UX6Layout>
  )
}

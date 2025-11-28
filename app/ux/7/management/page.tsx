import { UX7Layout } from "@/app/ux/_components/ux7-layout"
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
  Activity,
  Terminal,
} from "lucide-react"

export default function UX7ManagementPage() {
  return (
    <UX7Layout>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="size-8 text-emerald-400" />
            System Management
          </h1>
          <p className="text-neutral-400">
            Control datasets, requests, and access permissions
          </p>
        </div>
        <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 shadow-lg shadow-emerald-500/30">
          <Plus className="mr-2 size-4" />
          New Dataset
        </Button>
      </div>

      <Tabs defaultValue="datasets" className="space-y-6">
        <TabsList className="bg-[#0A0E1A] border border-emerald-500/20">
          <TabsTrigger
            value="datasets"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/30"
          >
            Datasets
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/30"
          >
            Requests
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-emerald-500/30"
          >
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-4">
          <Card className="bg-[#0A0E1A] border-emerald-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-white">Dataset Registry</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-emerald-400" />
                    <Input placeholder="Search..." className="pl-9 w-[200px] bg-black/30 border-emerald-500/30 text-white placeholder:text-neutral-600" />
                  </div>
                  <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                    <Terminal className="mr-2 size-4" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Clinical Trial Data Q4 2024", status: "Active", size: "2.4 GB", modified: "2h ago", access: "Public" },
                  { name: "Pharmacology Research Archive", status: "Processing", size: "1.8 GB", modified: "1d ago", access: "Restricted" },
                  { name: "Patient Demographics Dataset", status: "Active", size: "890 MB", modified: "3d ago", access: "Public" },
                  { name: "Lab Results Dataset Q3", status: "Active", size: "1.2 GB", modified: "5d ago", access: "Private" },
                  { name: "Genomic Research Data 2024", status: "Archived", size: "5.7 GB", modified: "2w ago", access: "Restricted" },
                ].map((dataset, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-emerald-500 blur-md opacity-30 group-hover:opacity-50 transition-opacity" />
                      <div className="relative flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 font-bold text-sm border border-emerald-500/30">
                        {i + 1}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white mb-1">{dataset.name}</p>
                      <div className="flex items-center gap-3 text-xs font-mono">
                        <span className="text-neutral-500">{dataset.size}</span>
                        <span className="text-neutral-600">•</span>
                        <span className="text-neutral-500">{dataset.modified}</span>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          {dataset.access}
                        </Badge>
                      </div>
                    </div>
                    <Badge
                      className={
                        dataset.status === "Active"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                          : dataset.status === "Processing"
                          ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40"
                          : "bg-neutral-600/20 text-neutral-400 border-neutral-600/40"
                      }
                    >
                      <Activity className={`size-3 mr-1 ${dataset.status === "Active" ? "animate-pulse" : ""}`} />
                      {dataset.status}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="size-9 p-0 text-emerald-400 hover:bg-emerald-500/10">
                        <Edit className="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="size-9 p-0 text-emerald-400 hover:bg-emerald-500/10">
                        <Download className="size-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="size-9 p-0 text-red-400 hover:bg-red-500/10">
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
          <Card className="bg-[#0A0E1A] border-emerald-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-white">Access Requests Queue</CardTitle>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/40 font-mono">
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
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                      <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-emerald-500 blur-md opacity-30" />
                        <div className="relative flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                          {request.requester.split(" ").map(n => n[0]).join("")}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white">{request.requester}</p>
                        <p className="text-sm text-neutral-400 truncate mb-1">{request.dataset}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
                            {request.type}
                          </Badge>
                          <Badge
                            className={
                              request.priority === "High"
                                ? "bg-red-500/20 text-red-400 border-red-500/40 text-xs"
                                : request.priority === "Normal"
                                ? "bg-cyan-500/20 text-cyan-400 border-cyan-500/40 text-xs"
                                : "bg-neutral-600/20 text-neutral-400 border-neutral-600/40 text-xs"
                            }
                          >
                            {request.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 font-mono text-sm ${
                          request.status === "Approved" ? "text-emerald-400" :
                          request.status === "Rejected" ? "text-red-400" :
                          "text-cyan-400"
                        }`}>
                          <Icon className="size-4" />
                          <span className="text-xs">{request.status}</span>
                        </div>
                        {request.status === "Pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white">
                              <CheckCircle className="mr-1 size-3" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-red-400 border-red-500/30 hover:bg-red-500/10">
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
          <Card className="bg-[#0A0E1A] border-emerald-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-white">User Access Control</CardTitle>
                <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
                  <Plus className="mr-2 size-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Dr. Sarah Johnson", email: "sarah.johnson@astrazeneca.com", department: "Clinical Research", role: "Admin", access: "Full Access", lastActive: "2h ago", status: "Online" },
                  { name: "Michael Chen", email: "michael.chen@astrazeneca.com", department: "Data Science", role: "Editor", access: "Read & Write", lastActive: "1d ago", status: "Offline" },
                  { name: "Dr. Emily Rodriguez", email: "emily.rodriguez@astrazeneca.com", department: "Pharmacology", role: "Viewer", access: "Read Only", lastActive: "3d ago", status: "Offline" },
                  { name: "James Wilson", email: "james.wilson@astrazeneca.com", department: "Laboratory", role: "Editor", access: "Read & Write", lastActive: "1w ago", status: "Offline" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 transition-all">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-emerald-500 blur-md opacity-30" />
                      <div className="relative flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-white">{user.name}</p>
                        {user.status === "Online" && (
                          <div className="size-2 bg-emerald-400 rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-400 mb-1">{user.department}</p>
                      <div className="flex items-center gap-2">
                        <Badge className={user.role === "Admin" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"}>
                          {user.role}
                        </Badge>
                        <span className="text-xs text-neutral-500 font-mono flex items-center gap-1">
                          <Shield className="size-3" />
                          {user.access}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge className={user.status === "Online" ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40" : "bg-neutral-600/20 text-neutral-400 border-neutral-600/40"}>
                          {user.status}
                        </Badge>
                        <p className="text-xs text-neutral-500 mt-1 font-mono">{user.lastActive}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="size-9 p-0 text-emerald-400 hover:bg-emerald-500/10">
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
    </UX7Layout>
  )
}

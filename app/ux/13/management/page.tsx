"use client"

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
  Circle,
} from "lucide-react"
import { useColorScheme } from "@/components/ux12-color-context"
import { cn } from "@/lib/utils"

export default function UX13ManagementPage() {
  const { scheme } = useColorScheme()

  return (
    <>
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extralight text-neutral-900 mb-2 tracking-tight">
            Management
          </h1>
          <p className="text-lg font-light text-neutral-500">
            Oversee your data operations
          </p>
        </div>
        <Button className={cn("text-white rounded-full font-light px-6 bg-gradient-to-r", scheme.from, scheme.to)}>
          <Plus className="mr-2 size-4" />
          New Dataset
        </Button>
      </div>

      <Tabs defaultValue="datasets" className="space-y-8">
        <TabsList className="bg-white border border-neutral-200 rounded-full p-1">
          <TabsTrigger
            value="datasets"
            className={cn("rounded-full font-light data-[state=active]:bg-gradient-to-r data-[state=active]:text-white", `data-[state=active]:${scheme.from} data-[state=active]:${scheme.to}`)}
          >
            Datasets
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className={cn("rounded-full font-light data-[state=active]:bg-gradient-to-r data-[state=active]:text-white", `data-[state=active]:${scheme.from} data-[state=active]:${scheme.to}`)}
          >
            Requests
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className={cn("rounded-full font-light data-[state=active]:bg-gradient-to-r data-[state=active]:text-white", `data-[state=active]:${scheme.from} data-[state=active]:${scheme.to}`)}
          >
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-4">
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-light text-neutral-900">Dataset Registry</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                  <Input placeholder="Search..." className="pl-9 w-[200px] rounded-full border-neutral-200 bg-neutral-50 font-light" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { name: "Clinical Trial Data Q4 2024", status: "Active", size: "2.4 GB", modified: "2 hours ago", access: "Public" },
                  { name: "Pharmacology Research Archive", status: "Processing", size: "1.8 GB", modified: "1 day ago", access: "Restricted" },
                  { name: "Patient Demographics Dataset", status: "Active", size: "890 MB", modified: "3 days ago", access: "Public" },
                  { name: "Lab Results Dataset Q3", status: "Active", size: "1.2 GB", modified: "5 days ago", access: "Private" },
                  { name: "Genomic Research Data 2024", status: "Archived", size: "5.7 GB", modified: "2 weeks ago", access: "Restricted" },
                ].map((dataset, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-xl bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-200 transition-all">
                    <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-light bg-gradient-to-br", scheme.from, scheme.to)}>
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-normal text-neutral-900 mb-1">{dataset.name}</p>
                      <div className="flex items-center gap-3 text-sm font-light text-neutral-500">
                        <span>{dataset.size}</span>
                        <Circle className="size-1 fill-neutral-300" />
                        <span>{dataset.modified}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`font-light rounded-full ${
                        dataset.status === "Active"
                          ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                          : dataset.status === "Processing"
                          ? "border-cyan-200 text-cyan-700 bg-cyan-50"
                          : "border-neutral-200 text-neutral-600"
                      }`}
                    >
                      {dataset.status}
                    </Badge>
                    <Badge variant="outline" className="font-light border-neutral-200 rounded-full">
                      {dataset.access}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="ghost" className="size-9 p-0 rounded-full hover:bg-neutral-100">
                        <Edit className="size-4 text-neutral-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="size-9 p-0 rounded-full hover:bg-neutral-100">
                        <Download className="size-4 text-neutral-600" />
                      </Button>
                      <Button size="sm" variant="ghost" className="size-9 p-0 rounded-full hover:bg-red-50">
                        <Trash2 className="size-4 text-red-500" />
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
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-light text-neutral-900">Access Requests</CardTitle>
                <Badge className={cn("text-white border-0 rounded-full font-light bg-gradient-to-r", scheme.from, scheme.to)}>
                  8 Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { requester: "Dr. Sarah Johnson", email: "sarah.johnson@az.com", dataset: "Clinical Trial Data Q4 2024", type: "Download", priority: "High", status: "Pending", icon: Clock },
                  { requester: "Michael Chen", email: "michael.chen@az.com", dataset: "Pharmacology Research Archive", type: "Modify", priority: "Normal", status: "Approved", icon: CheckCircle },
                  { requester: "Dr. Emily Rodriguez", email: "emily.rodriguez@az.com", dataset: "Patient Demographics Dataset", type: "View", priority: "Normal", status: "Pending", icon: Clock },
                  { requester: "James Wilson", email: "james.wilson@az.com", dataset: "Lab Results Dataset Q3", type: "Download", priority: "Low", status: "Rejected", icon: XCircle },
                ].map((request, i) => {
                  const Icon = request.icon
                  return (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-xl bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-200 transition-all">
                      <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-full text-white text-xs font-light bg-gradient-to-br", scheme.from, scheme.to)}>
                        {request.requester.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-normal text-neutral-900">{request.requester}</p>
                        <p className="text-sm font-light text-neutral-600 truncate mb-2">{request.dataset}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-light border-neutral-200 rounded-full text-xs">
                            {request.type}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`font-light rounded-full text-xs ${
                              request.priority === "High"
                                ? "border-red-200 text-red-700 bg-red-50"
                                : request.priority === "Normal"
                                ? "border-cyan-200 text-cyan-700 bg-cyan-50"
                                : "border-neutral-200 text-neutral-600"
                            }`}
                          >
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
                          <span className="text-sm font-light">{request.status}</span>
                        </div>
                        {request.status === "Pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" className="h-8 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full font-light">
                              <CheckCircle className="mr-1 size-3" />
                              Approve
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 text-red-600 border-red-200 hover:bg-red-50 rounded-full font-light">
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
          <Card className="border-neutral-200 rounded-2xl overflow-hidden">
            <CardHeader className="border-b border-neutral-100 bg-white">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-light text-neutral-900">User Permissions</CardTitle>
                <Button variant="outline" size="sm" className="rounded-full border-neutral-200 font-light hover:bg-neutral-50">
                  <Plus className="mr-2 size-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { name: "Dr. Sarah Johnson", email: "sarah.johnson@astrazeneca.com", department: "Clinical Research", role: "Admin", access: "Full Access", lastActive: "2 hours ago", status: "Active" },
                  { name: "Michael Chen", email: "michael.chen@astrazeneca.com", department: "Data Science", role: "Editor", access: "Read & Write", lastActive: "1 day ago", status: "Active" },
                  { name: "Dr. Emily Rodriguez", email: "emily.rodriguez@astrazeneca.com", department: "Pharmacology", role: "Viewer", access: "Read Only", lastActive: "3 days ago", status: "Active" },
                  { name: "James Wilson", email: "james.wilson@astrazeneca.com", department: "Laboratory", role: "Editor", access: "Read & Write", lastActive: "1 week ago", status: "Inactive" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-xl bg-neutral-50 hover:bg-white border border-transparent hover:border-neutral-200 transition-all">
                    <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-full text-white text-xs font-light bg-gradient-to-br", scheme.from, scheme.to)}>
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-normal text-neutral-900">{user.name}</p>
                        {user.status === "Active" && (
                          <Circle className="size-2 fill-emerald-500 text-emerald-500" />
                        )}
                      </div>
                      <p className="text-sm font-light text-neutral-600 mb-2">{user.department}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "font-light rounded-full text-xs",
                            user.role === "Admin" && cn("border-current bg-current/10", scheme.from.replace("from-", "text-").replace("500", "700"))
                          )}
                        >
                          {user.role}
                        </Badge>
                        <span className="text-xs font-light text-neutral-500 flex items-center gap-1">
                          <Shield className="size-3" />
                          {user.access}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <Badge
                          variant="outline"
                          className={`font-light rounded-full ${
                            user.status === "Active"
                              ? "border-emerald-200 text-emerald-700 bg-emerald-50"
                              : "border-neutral-200 text-neutral-600"
                          }`}
                        >
                          {user.status}
                        </Badge>
                        <p className="text-xs font-light text-neutral-500 mt-1">{user.lastActive}</p>
                      </div>
                      <Button size="sm" variant="ghost" className="size-9 p-0 rounded-full hover:bg-neutral-100">
                        <Edit className="size-4 text-neutral-600" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

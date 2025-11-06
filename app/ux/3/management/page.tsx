import { UX3Layout } from "@/components/ux3-layout"
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
  MoreVertical,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
} from "lucide-react"

export default function UX3ManagementPage() {
  return (
    <UX3Layout>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-1">Data Management</h1>
          <p className="text-sm text-neutral-600">
            Manage datasets, access requests, and user permissions
          </p>
        </div>
        <Button className="bg-[#830051] hover:bg-[#830051]/90">
          <Plus className="mr-2 size-4" />
          New Dataset
        </Button>
      </div>

      <Tabs defaultValue="datasets" className="space-y-4">
        <TabsList>
          <TabsTrigger value="datasets">My Datasets</TabsTrigger>
          <TabsTrigger value="requests">Access Requests</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Datasets</CardTitle>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input placeholder="Search..." className="pl-9 w-[200px]" />
                  </div>
                  <Button variant="outline" size="sm">
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">
                        <input type="checkbox" className="size-4" />
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Name</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Status</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Size</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Modified</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Access Level</th>
                      <th className="px-4 py-3 text-right font-semibold text-neutral-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      {
                        name: "Clinical Trial Data Q4 2024",
                        status: "Active",
                        size: "2.4 GB",
                        modified: "2 hours ago",
                        access: "Public",
                      },
                      {
                        name: "Pharmacology Research Archive",
                        status: "Processing",
                        size: "1.8 GB",
                        modified: "1 day ago",
                        access: "Restricted",
                      },
                      {
                        name: "Patient Demographics Dataset",
                        status: "Active",
                        size: "890 MB",
                        modified: "3 days ago",
                        access: "Public",
                      },
                      {
                        name: "Lab Results Dataset Q3",
                        status: "Active",
                        size: "1.2 GB",
                        modified: "5 days ago",
                        access: "Private",
                      },
                      {
                        name: "Genomic Research Data 2024",
                        status: "Archived",
                        size: "5.7 GB",
                        modified: "2 weeks ago",
                        access: "Restricted",
                      },
                    ].map((dataset, i) => (
                      <tr key={i} className="hover:bg-neutral-50">
                        <td className="px-4 py-3">
                          <input type="checkbox" className="size-4" />
                        </td>
                        <td className="px-4 py-3 font-medium text-neutral-900">{dataset.name}</td>
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
                        <td className="px-4 py-3 text-neutral-600">{dataset.size}</td>
                        <td className="px-4 py-3 text-neutral-600">{dataset.modified}</td>
                        <td className="px-4 py-3">
                          <Badge variant="outline" className="text-xs">
                            {dataset.access}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 hover:bg-neutral-100">
                              <Edit className="size-4 text-neutral-500" />
                            </button>
                            <button className="p-1.5 hover:bg-neutral-100">
                              <Download className="size-4 text-neutral-500" />
                            </button>
                            <button className="p-1.5 hover:bg-neutral-100">
                              <Trash2 className="size-4 text-red-500" />
                            </button>
                            <button className="p-1.5 hover:bg-neutral-100">
                              <MoreVertical className="size-4 text-neutral-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">Access Requests</CardTitle>
                <div className="flex gap-2">
                  <Badge variant="secondary" className="bg-[#F0AB00]/10 text-[#830051] border border-[#F0AB00]">
                    8 Pending
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Requester</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Dataset</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Type</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Date</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Priority</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Status</th>
                      <th className="px-4 py-3 text-right font-semibold text-neutral-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      {
                        requester: "Dr. Sarah Johnson",
                        email: "sarah.johnson@az.com",
                        dataset: "Clinical Trial Data Q4 2024",
                        type: "Download",
                        date: "2024-11-04",
                        priority: "High",
                        status: "Pending",
                        icon: Clock,
                      },
                      {
                        requester: "Michael Chen",
                        email: "michael.chen@az.com",
                        dataset: "Pharmacology Research Archive",
                        type: "Modify",
                        date: "2024-11-03",
                        priority: "Normal",
                        status: "Approved",
                        icon: CheckCircle,
                      },
                      {
                        requester: "Dr. Emily Rodriguez",
                        email: "emily.rodriguez@az.com",
                        dataset: "Patient Demographics Dataset",
                        type: "View",
                        date: "2024-11-02",
                        priority: "Normal",
                        status: "Pending",
                        icon: Clock,
                      },
                      {
                        requester: "James Wilson",
                        email: "james.wilson@az.com",
                        dataset: "Lab Results Dataset Q3",
                        type: "Download",
                        date: "2024-11-01",
                        priority: "Low",
                        status: "Rejected",
                        icon: XCircle,
                      },
                      {
                        requester: "Lisa Anderson",
                        email: "lisa.anderson@az.com",
                        dataset: "Genomic Research Data 2024",
                        type: "Download",
                        date: "2024-10-30",
                        priority: "High",
                        status: "Approved",
                        icon: CheckCircle,
                      },
                    ].map((request, i) => {
                      const Icon = request.icon
                      return (
                        <tr key={i} className="hover:bg-neutral-50">
                          <td className="px-4 py-3">
                            <div>
                              <p className="font-medium text-neutral-900">{request.requester}</p>
                              <p className="text-xs text-neutral-500">{request.email}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-neutral-900">{request.dataset}</td>
                          <td className="px-4 py-3">
                            <Badge variant="outline" className="text-xs">
                              {request.type}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-neutral-600">{request.date}</td>
                          <td className="px-4 py-3">
                            <Badge
                              variant={
                                request.priority === "High"
                                  ? "destructive"
                                  : request.priority === "Normal"
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {request.priority}
                            </Badge>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5">
                              <Icon
                                className={`size-4 ${
                                  request.status === "Approved"
                                    ? "text-green-600"
                                    : request.status === "Rejected"
                                    ? "text-red-600"
                                    : "text-amber-600"
                                }`}
                              />
                              <span className="text-xs font-medium">{request.status}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {request.status === "Pending" && (
                                <>
                                  <Button size="sm" className="h-7 text-xs bg-green-600 hover:bg-green-700">
                                    <CheckCircle className="mr-1 size-3" />
                                    Approve
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs text-red-600 hover:text-red-700"
                                  >
                                    <XCircle className="mr-1 size-3" />
                                    Reject
                                  </Button>
                                </>
                              )}
                              <button className="p-1.5 hover:bg-neutral-100">
                                <MoreVertical className="size-4 text-neutral-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">User Permissions</CardTitle>
                <Button variant="outline" size="sm">
                  <Plus className="mr-2 size-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">User</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Department</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Role</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Access Level</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Last Active</th>
                      <th className="px-4 py-3 text-left font-semibold text-neutral-700">Status</th>
                      <th className="px-4 py-3 text-right font-semibold text-neutral-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {[
                      {
                        name: "Dr. Sarah Johnson",
                        email: "sarah.johnson@astrazeneca.com",
                        department: "Clinical Research",
                        role: "Admin",
                        access: "Full Access",
                        lastActive: "2 hours ago",
                        status: "Active",
                      },
                      {
                        name: "Michael Chen",
                        email: "michael.chen@astrazeneca.com",
                        department: "Data Science",
                        role: "Editor",
                        access: "Read & Write",
                        lastActive: "1 day ago",
                        status: "Active",
                      },
                      {
                        name: "Dr. Emily Rodriguez",
                        email: "emily.rodriguez@astrazeneca.com",
                        department: "Pharmacology",
                        role: "Viewer",
                        access: "Read Only",
                        lastActive: "3 days ago",
                        status: "Active",
                      },
                      {
                        name: "James Wilson",
                        email: "james.wilson@astrazeneca.com",
                        department: "Laboratory",
                        role: "Editor",
                        access: "Read & Write",
                        lastActive: "1 week ago",
                        status: "Inactive",
                      },
                      {
                        name: "Lisa Anderson",
                        email: "lisa.anderson@astrazeneca.com",
                        department: "Genomics",
                        role: "Viewer",
                        access: "Read Only",
                        lastActive: "5 hours ago",
                        status: "Active",
                      },
                    ].map((user, i) => (
                      <tr key={i} className="hover:bg-neutral-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center bg-[#F0AB00]/10 text-[#830051] font-semibold text-sm">
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900">{user.name}</p>
                              <p className="text-xs text-neutral-500">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-neutral-600">{user.department}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant="outline"
                            className={
                              user.role === "Admin"
                                ? "border-[#830051] text-[#830051]"
                                : ""
                            }
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <Shield className="size-4 text-neutral-400" />
                            <span className="text-xs text-neutral-600">{user.access}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-neutral-600">{user.lastActive}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={user.status === "Active" ? "default" : "outline"}
                            className={
                              user.status === "Active"
                                ? "bg-green-100 text-green-700 border-green-200"
                                : ""
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-1">
                            <button className="p-1.5 hover:bg-neutral-100">
                              <Edit className="size-4 text-neutral-500" />
                            </button>
                            <button className="p-1.5 hover:bg-neutral-100">
                              <MoreVertical className="size-4 text-neutral-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UX3Layout>
  )
}

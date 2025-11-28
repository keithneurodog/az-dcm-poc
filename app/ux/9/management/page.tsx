import { UX9Layout } from "@/app/ux/_components/ux9-layout"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  Download,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Zap,
} from "lucide-react"

export default function UX9ManagementPage() {
  return (
    <UX9Layout>
      {/* Header */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-5xl">⚙️</span>
            <h1 className="text-5xl font-black bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Management Hub
            </h1>
          </div>
          <p className="text-xl text-neutral-600 font-bold">
            Control everything from one place 🎯
          </p>
        </div>
        <Button className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-yellow-900 font-black shadow-xl h-14 px-8 text-lg">
          <Plus className="mr-2 size-5" />
          New Dataset
        </Button>
      </div>

      <Tabs defaultValue="datasets" className="space-y-8">
        <TabsList className="bg-white border-4 border-purple-200 rounded-2xl p-2 shadow-lg">
          <TabsTrigger
            value="datasets"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-cyan-500 data-[state=active]:text-white font-black data-[state=active]:shadow-lg"
          >
            📦 Datasets
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-pink-500 data-[state=active]:text-white font-black data-[state=active]:shadow-lg"
          >
            📋 Requests
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className="rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white font-black data-[state=active]:shadow-lg"
          >
            👥 Permissions
          </TabsTrigger>
        </TabsList>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-4">
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="border-b-4 border-blue-100">
              <CardTitle className="text-2xl font-black text-neutral-900">📊 Dataset Registry</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { name: "Clinical Trial Data Q4 2024", status: "Active", size: "2.4 GB", emoji: "💊", gradient: "from-blue-500 to-cyan-500" },
                  { name: "Pharmacology Research Archive", status: "Processing", size: "1.8 GB", emoji: "🧪", gradient: "from-purple-500 to-pink-500" },
                  { name: "Patient Demographics Dataset", status: "Active", size: "890 MB", emoji: "👥", gradient: "from-green-500 to-emerald-500" },
                  { name: "Lab Results Dataset Q3", status: "Active", size: "1.2 GB", emoji: "📊", gradient: "from-amber-500 to-orange-500" },
                  { name: "Genomic Research Data 2024", status: "Archived", size: "5.7 GB", emoji: "🧬", gradient: "from-red-500 to-pink-500" },
                ].map((dataset, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50 hover:shadow-xl transition-all hover:scale-102 group">
                    <div className={`flex size-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dataset.gradient} shadow-lg group-hover:rotate-12 transition-transform`}>
                      <span className="text-3xl">{dataset.emoji}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg font-black text-neutral-900 mb-1">{dataset.name}</p>
                      <div className="flex items-center gap-3">
                        <Badge className="font-bold bg-neutral-100 text-neutral-700">{dataset.size}</Badge>
                      </div>
                    </div>
                    <Badge
                      className={`font-black px-4 py-2 ${
                        dataset.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : dataset.status === "Processing"
                          ? "bg-cyan-100 text-cyan-700"
                          : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {dataset.status === "Active" && <Zap className="size-3 mr-1 animate-pulse" />}
                      {dataset.status}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button size="sm" className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold shadow-md">
                        <Edit className="size-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="font-bold border-2">
                        <Download className="size-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="font-bold border-2 text-red-600 hover:bg-red-50 border-red-200">
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
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="border-b-4 border-purple-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black text-neutral-900">📬 Access Requests</CardTitle>
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 font-black px-4 py-2 text-base">
                  ⚡ 8 Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { requester: "Dr. Sarah Johnson", dataset: "Clinical Trial Data Q4 2024", type: "Download", priority: "High", status: "Pending", icon: Clock },
                  { requester: "Michael Chen", dataset: "Pharmacology Research Archive", type: "Modify", priority: "Normal", status: "Approved", icon: CheckCircle },
                  { requester: "Dr. Emily Rodriguez", dataset: "Patient Demographics Dataset", type: "View", priority: "Normal", status: "Pending", icon: Clock },
                  { requester: "James Wilson", dataset: "Lab Results Dataset Q3", type: "Download", priority: "Low", status: "Rejected", icon: XCircle },
                ].map((request, i) => {
                  const Icon = request.icon
                  return (
                    <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50 hover:shadow-xl transition-all group">
                      <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white font-black shadow-lg">
                        {request.requester.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-black text-neutral-900">{request.requester}</p>
                        <p className="text-sm text-neutral-600 font-medium truncate mb-2">{request.dataset}</p>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-100 text-blue-700 font-bold">{request.type}</Badge>
                          <Badge
                            className={`font-bold ${
                              request.priority === "High"
                                ? "bg-red-100 text-red-700"
                                : request.priority === "Normal"
                                ? "bg-cyan-100 text-cyan-700"
                                : "bg-neutral-100 text-neutral-600"
                            }`}
                          >
                            {request.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 font-bold ${
                          request.status === "Approved" ? "text-green-600" :
                          request.status === "Rejected" ? "text-red-600" :
                          "text-amber-600"
                        }`}>
                          <Icon className="size-5" />
                          <span>{request.status}</span>
                        </div>
                        {request.status === "Pending" && (
                          <div className="flex gap-2">
                            <Button className="bg-green-500 hover:bg-green-600 text-white font-black shadow-md">
                              <CheckCircle className="mr-1 size-4" />
                              Approve
                            </Button>
                            <Button variant="outline" className="font-bold border-2 text-red-600 border-red-200 hover:bg-red-50">
                              <XCircle className="mr-1 size-4" />
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
          <Card className="border-0 shadow-xl bg-white">
            <CardHeader className="border-b-4 border-green-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black text-neutral-900">🔐 User Access Control</CardTitle>
                <Button variant="outline" className="font-black border-2 hover:bg-green-50">
                  <Plus className="mr-2 size-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {[
                  { name: "Dr. Sarah Johnson", department: "Clinical Research", role: "Admin", status: "Online", gradient: "from-blue-500 to-cyan-500" },
                  { name: "Michael Chen", department: "Data Science", role: "Editor", status: "Offline", gradient: "from-purple-500 to-pink-500" },
                  { name: "Dr. Emily Rodriguez", department: "Pharmacology", role: "Viewer", status: "Offline", gradient: "from-green-500 to-emerald-500" },
                  { name: "James Wilson", department: "Laboratory", role: "Editor", status: "Offline", gradient: "from-amber-500 to-orange-500" },
                ].map((user, i) => (
                  <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50 hover:shadow-xl transition-all">
                    <div className={`flex size-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${user.gradient} text-white font-black shadow-lg`}>
                      {user.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-lg font-black text-neutral-900">{user.name}</p>
                        {user.status === "Online" && (
                          <div className="size-3 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
                        )}
                      </div>
                      <p className="text-sm text-neutral-600 font-medium mb-2">{user.department}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`font-bold ${
                            user.role === "Admin"
                              ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                              : "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          <Shield className="size-3 mr-1" />
                          {user.role}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={`font-black px-4 py-2 ${
                          user.status === "Online"
                            ? "bg-green-100 text-green-700"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {user.status}
                      </Badge>
                      <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold shadow-md">
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
    </UX9Layout>
  )
}

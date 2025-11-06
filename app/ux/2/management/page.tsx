import { UX2Layout } from "@/components/ux2-layout"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileStack,
  Search,
  Plus,
  Download,
  Edit,
  MoreHorizontal,
  Users,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react"

export default function UX2ManagementPage() {
  return (
    <UX2Layout>
      {/* Hero Section */}
      <div className="-m-6 mb-8 bg-gradient-to-br from-[#a8006b] to-[#830051] px-6 py-12 shadow-lg rounded-b-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <div className="mb-3 inline-block rounded-lg border border-[#F0AB00]/30 bg-[#F0AB00]/10 px-3 py-1.5">
              <span className="text-xs font-medium text-[#F0AB00]">
                Management
              </span>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-white">
              Data Management
            </h1>
            <p className="text-base text-white/80">
              Control datasets, requests, and permissions
            </p>
          </div>
          <Button size="lg" className="bg-[#F0AB00] hover:bg-[#F0AB00]/90 text-[#830051] font-semibold h-12 px-6 rounded-lg">
            <Plus className="mr-2 size-5" />
            New Dataset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="datasets" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-3 border border-neutral-200 bg-white p-1 rounded-lg">
          <TabsTrigger value="datasets" className="font-medium data-[state=active]:bg-[#830051] data-[state=active]:text-white rounded-lg">
            Datasets
          </TabsTrigger>
          <TabsTrigger value="requests" className="font-medium data-[state=active]:bg-[#830051] data-[state=active]:text-white rounded-lg">
            Requests
          </TabsTrigger>
          <TabsTrigger value="permissions" className="font-medium data-[state=active]:bg-[#830051] data-[state=active]:text-white rounded-lg">
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-4">
          <Card className="border border-neutral-200 shadow-brutal rounded-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold">My Datasets</CardTitle>
                  <CardDescription className="font-medium">
                    Manage and organize your uploaded datasets
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                    <Input placeholder="Search..." className="pl-9 w-[200px] border border-neutral-300 rounded-lg" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "Clinical Trial Data Q4 2024",
                    status: "Active",
                    statusColor: "bg-green-600",
                    size: "2.4 GB",
                    modified: "2 hours ago",
                  },
                  {
                    name: "Pharmacology Research Archive",
                    status: "Processing",
                    statusColor: "bg-yellow-600",
                    size: "1.8 GB",
                    modified: "1 day ago",
                  },
                  {
                    name: "Patient Demographics Dataset",
                    status: "Active",
                    statusColor: "bg-green-600",
                    size: "890 MB",
                    modified: "3 days ago",
                  },
                ].map((dataset, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-neutral-200 rounded-lg p-4 hover:border-[#830051] transition-colors"
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <FileStack className="size-5 text-[#830051]" />
                      <div className="flex-1">
                        <p className="font-semibold">{dataset.name}</p>
                        <div className="flex items-center gap-4 mt-1 text-xs font-medium text-neutral-600">
                          <span>{dataset.size}</span>
                          <span>•</span>
                          <span>{dataset.modified}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`${dataset.statusColor} rounded-lg px-3 py-1 text-white text-xs font-semibold`}>
                        {dataset.status}
                      </div>
                      <Button size="sm" variant="outline" className="border border-neutral-300 font-medium rounded-lg">
                        <Edit className="size-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border border-neutral-300 font-medium rounded-lg">
                        <Download className="size-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border border-neutral-300 font-medium rounded-lg">
                        <MoreHorizontal className="size-4" />
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
          <Card className="border border-neutral-200 shadow-brutal rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Access Requests</CardTitle>
              <CardDescription className="font-medium">
                Review and manage data access requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    requester: "Dr. Sarah Johnson",
                    dataset: "Clinical Trial Data Q4 2024",
                    status: "Pending",
                    date: "2024-11-04",
                    icon: Clock,
                    color: "amber",
                  },
                  {
                    requester: "Michael Chen",
                    dataset: "Pharmacology Research Archive",
                    status: "Approved",
                    date: "2024-11-03",
                    icon: CheckCircle2,
                    color: "green",
                  },
                  {
                    requester: "Dr. Emily Rodriguez",
                    dataset: "Patient Demographics Dataset",
                    status: "Under Review",
                    date: "2024-11-02",
                    icon: AlertCircle,
                    color: "blue",
                  },
                ].map((request, index) => {
                  const Icon = request.icon
                  return (
                    <Card key={index} className="border border-neutral-200 rounded-lg">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div className={`p-3 rounded-lg bg-${request.color}-100`}>
                              <Icon className={`size-6 text-${request.color}-600`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Users className="size-4 text-neutral-600" />
                                <span className="font-semibold">{request.requester}</span>
                              </div>
                              <p className="text-sm text-neutral-600 font-medium">
                                Requesting: <span className="text-neutral-900">{request.dataset}</span>
                              </p>
                              <p className="text-xs text-neutral-500 font-medium mt-2">
                                {request.date}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border border-neutral-300 font-medium rounded-lg"
                            >
                              {request.status}
                            </Badge>
                            {request.status === "Pending" && (
                              <>
                                <Button size="sm" className="bg-[#830051] hover:bg-[#830051]/90 font-semibold rounded-lg">
                                  Approve
                                </Button>
                                <Button size="sm" variant="outline" className="border border-neutral-300 font-medium rounded-lg">
                                  Deny
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions" className="space-y-4">
          <Card className="border border-neutral-200 shadow-brutal rounded-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Team Permissions</CardTitle>
              <CardDescription className="font-medium">
                Manage user access and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  {
                    name: "Dr. Sarah Johnson",
                    email: "sarah.johnson@astrazeneca.com",
                    role: "Admin",
                    access: "Full Access",
                  },
                  {
                    name: "Michael Chen",
                    email: "michael.chen@astrazeneca.com",
                    role: "Editor",
                    access: "Read & Write",
                  },
                  {
                    name: "Dr. Emily Rodriguez",
                    email: "emily.rodriguez@astrazeneca.com",
                    role: "Viewer",
                    access: "Read Only",
                  },
                ].map((user, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between border border-neutral-200 rounded-lg p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-lg bg-[#F0AB00]/10 text-[#830051] font-bold text-lg">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div>
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-neutral-600 font-medium">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge variant="outline" className="mb-1 border border-[#830051] text-[#830051] font-medium rounded-lg">
                          {user.role}
                        </Badge>
                        <p className="text-xs font-medium text-neutral-600">{user.access}</p>
                      </div>
                      <Button variant="outline" size="sm" className="border border-neutral-300 font-medium rounded-lg">
                        <MoreHorizontal className="size-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button className="w-full bg-[#830051] hover:bg-[#830051]/90 font-semibold h-11 rounded-lg">
                  <Plus className="mr-2 size-4" />
                  Invite Team Member
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </UX2Layout>
  )
}

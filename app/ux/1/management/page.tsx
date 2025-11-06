import { AppLayout } from "@/components/app-layout"
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
  Trash2,
  Edit,
  MoreHorizontal,
  Filter,
  Calendar,
  Users,
  Shield,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ManagementPage() {
  return (
    <AppLayout breadcrumbs={[{ label: "Management" }]}>
      <div className="space-y-8 -m-6">
        {/* Hero Section */}
        <div className="bg-primary px-6 py-12">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-primary-foreground mb-2">
                Data Management
              </h1>
              <p className="text-primary-foreground/90 text-lg">
                Manage your datasets, requests, and team permissions
              </p>
            </div>
            <Button size="lg" variant="secondary" className="shadow-lg">
              <Plus className="mr-2 size-4" />
              New Dataset
            </Button>
          </div>
        </div>

        <div className="px-6 space-y-6">

        <Tabs defaultValue="datasets" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="datasets">Datasets</TabsTrigger>
            <TabsTrigger value="requests">Requests</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
          </TabsList>

          {/* Datasets Tab */}
          <TabsContent value="datasets" className="space-y-4">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>My Datasets</CardTitle>
                    <CardDescription>
                      Manage and organize your uploaded datasets
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input placeholder="Search datasets..." className="pl-9 w-[250px]" />
                    </div>
                    <Button variant="outline" size="icon">
                      <Filter className="size-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Size</div>
                    <div className="col-span-2">Modified</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>

                  {/* Table Rows */}
                  {[
                    {
                      name: "Clinical Trial Data Q4 2024",
                      status: "Active",
                      statusColor: "bg-green-500",
                      size: "2.4 GB",
                      modified: "2 hours ago",
                      tags: ["Clinical", "2024"],
                    },
                    {
                      name: "Pharmacology Research Archive",
                      status: "Processing",
                      statusColor: "bg-yellow-500",
                      size: "1.8 GB",
                      modified: "1 day ago",
                      tags: ["Research", "Archive"],
                    },
                    {
                      name: "Patient Demographics Dataset",
                      status: "Active",
                      statusColor: "bg-green-500",
                      size: "890 MB",
                      modified: "3 days ago",
                      tags: ["Demographics"],
                    },
                    {
                      name: "Lab Results Collection 2023",
                      status: "Archived",
                      statusColor: "bg-gray-500",
                      size: "3.2 GB",
                      modified: "1 week ago",
                      tags: ["Lab", "Archive"],
                    },
                    {
                      name: "Drug Interaction Study Data",
                      status: "Active",
                      statusColor: "bg-green-500",
                      size: "1.2 GB",
                      modified: "2 weeks ago",
                      tags: ["Pharmacology"],
                    },
                  ].map((dataset, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-muted/50 rounded-lg transition-colors"
                    >
                      <div className="col-span-4 flex flex-col gap-1">
                        <span className="font-medium">{dataset.name}</span>
                        <div className="flex gap-1">
                          {dataset.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="col-span-2 flex items-center gap-2">
                        <div className={`size-2 rounded-full ${dataset.statusColor}`} />
                        <span className="text-sm">{dataset.status}</span>
                      </div>
                      <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                        {dataset.size}
                      </div>
                      <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                        {dataset.modified}
                      </div>
                      <div className="col-span-2 flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost">
                          <Edit className="size-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Download className="size-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Share</DropdownMenuItem>
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Requests Tab */}
          <TabsContent value="requests" className="space-y-4">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Data Access Requests</CardTitle>
                <CardDescription>
                  Review and manage incoming data access requests
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
                      reason: "Research for oncology study",
                    },
                    {
                      requester: "Michael Chen",
                      dataset: "Pharmacology Research Archive",
                      status: "Approved",
                      date: "2024-11-03",
                      reason: "Drug interaction analysis",
                    },
                    {
                      requester: "Dr. Emily Rodriguez",
                      dataset: "Patient Demographics Dataset",
                      status: "Under Review",
                      date: "2024-11-02",
                      reason: "Statistical analysis for publication",
                    },
                  ].map((request, index) => (
                    <Card key={index} className="border-none shadow-md">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Users className="size-4 text-muted-foreground" />
                              <span className="font-medium">{request.requester}</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Requesting access to:{" "}
                              <span className="font-medium text-foreground">
                                {request.dataset}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Reason: {request.reason}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                              <Calendar className="size-3" />
                              {request.date}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <Badge
                              variant={
                                request.status === "Approved"
                                  ? "default"
                                  : request.status === "Pending"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {request.status}
                            </Badge>
                            {request.status === "Pending" && (
                              <div className="flex gap-2">
                                <Button size="sm">Approve</Button>
                                <Button size="sm" variant="outline">
                                  Deny
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle>Team Permissions</CardTitle>
                <CardDescription>
                  Manage user access and permissions for datasets
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Dr. Sarah Johnson",
                      email: "sarah.johnson@astrazeneca.com",
                      role: "Admin",
                      access: "Full Access",
                      lastActive: "2 hours ago",
                    },
                    {
                      name: "Michael Chen",
                      email: "michael.chen@astrazeneca.com",
                      role: "Editor",
                      access: "Read & Write",
                      lastActive: "1 day ago",
                    },
                    {
                      name: "Dr. Emily Rodriguez",
                      email: "emily.rodriguez@astrazeneca.com",
                      role: "Viewer",
                      access: "Read Only",
                      lastActive: "3 days ago",
                    },
                    {
                      name: "David Park",
                      email: "david.park@astrazeneca.com",
                      role: "Editor",
                      access: "Read & Write",
                      lastActive: "1 week ago",
                    },
                  ].map((user, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-full bg-brand/10 font-semibold text-brand">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Last active: {user.lastActive}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <Badge variant="outline" className="mb-1">
                            {user.role}
                          </Badge>
                          <p className="text-sm text-muted-foreground">{user.access}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Change Role</DropdownMenuItem>
                            <DropdownMenuItem>Modify Permissions</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              Remove Access
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <Button variant="outline" className="w-full">
                    <Plus className="mr-2 size-4" />
                    Invite Team Member
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}

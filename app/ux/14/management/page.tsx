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
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  Shield,
  Circle,
  Leaf,
  Settings,
} from "lucide-react"
import { useColorScheme } from "@/components/ux14-color-context"
import { cn } from "@/lib/utils"

export default function UX14ManagementPage() {
  const { scheme } = useColorScheme()

  return (
    <>
      {/* Header */}
      <div className="mb-16 text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Settings className={cn("size-6", scheme.from.replace("from-", "text-").replace("-500", "-500/60"))} />
        </div>
        <h1 className="text-5xl font-extralight text-neutral-800 mb-4 tracking-tight">
          Cultivate
        </h1>
        <p className="text-lg font-extralight text-neutral-500">
          Nurture your data garden
        </p>
      </div>

      <Tabs defaultValue="datasets" className="space-y-10">
        <TabsList className="bg-white/70 backdrop-blur-sm border rounded-full p-1.5 shadow-sm">
          <TabsTrigger
            value="datasets"
            className={cn("rounded-full font-extralight transition-all duration-300",
              "data-[state=active]:bg-gradient-to-r data-[state=active]:text-white data-[state=active]:shadow-md",
              `data-[state=active]:${scheme.from} data-[state=active]:${scheme.to}`,
              `data-[state=active]:shadow-${scheme.from.replace("from-", "").replace("-500", "-200/20")}`
            )}
          >
            Datasets
          </TabsTrigger>
          <TabsTrigger
            value="requests"
            className={cn("rounded-full font-extralight transition-all duration-300",
              "data-[state=active]:bg-gradient-to-r data-[state=active]:text-white data-[state=active]:shadow-md",
              `data-[state=active]:${scheme.from} data-[state=active]:${scheme.to}`,
              `data-[state=active]:shadow-${scheme.from.replace("from-", "").replace("-500", "-200/20")}`
            )}
          >
            Requests
          </TabsTrigger>
          <TabsTrigger
            value="permissions"
            className={cn("rounded-full font-extralight transition-all duration-300",
              "data-[state=active]:bg-gradient-to-r data-[state=active]:text-white data-[state=active]:shadow-md",
              `data-[state=active]:${scheme.from} data-[state=active]:${scheme.to}`,
              `data-[state=active]:shadow-${scheme.from.replace("from-", "").replace("-500", "-200/20")}`
            )}
          >
            Permissions
          </TabsTrigger>
        </TabsList>

        {/* Datasets Tab */}
        <TabsContent value="datasets" className="space-y-4">
          <Card className={cn("rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm shadow-sm",
            `border-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`,
            `shadow-${scheme.from.replace("from-", "").replace("-500", "-100/10")}`
          )}>
            <CardHeader className={cn("border-b bg-gradient-to-br to-transparent",
              `border-${scheme.from.replace("from-", "").replace("-500", "-50/50")}`,
              scheme.bg.replace("from-", "from-").replace("-50", "-50/30")
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("flex size-10 items-center justify-center rounded-2xl border",
                    scheme.from.replace("from-", "bg-").replace("-500", "-400/10"),
                    `border-${scheme.from.replace("from-", "").replace("-500", "-200/30")}`
                  )}>
                    <Leaf className={cn("size-5", scheme.from.replace("from-", "text-").replace("-500", "-600/70"))} />
                  </div>
                  <CardTitle className="text-xl font-light text-neutral-800">Dataset Garden</CardTitle>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className={cn("absolute left-3 top-1/2 size-4 -translate-y-1/2",
                      scheme.from.replace("from-", "text-").replace("-500", "-400/60")
                    )} />
                    <Input placeholder="Search..." className={cn("pl-9 w-[200px] rounded-full font-extralight",
                      `border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`,
                      scheme.from.replace("from-", "bg-").replace("-500", "-50/30")
                    )} />
                  </div>
                  <Button className={cn("bg-gradient-to-r text-white rounded-full font-extralight shadow-md",
                    scheme.from.replace("from-", "from-").replace("-500", "-500/90"),
                    scheme.to.replace("to-", "to-").replace("-500", "-500/90"),
                    `hover:from-${scheme.from.replace("from-", "").replace("-500", "-500")}`,
                    `hover:to-${scheme.to.replace("to-", "").replace("-500", "-500")}`,
                    `shadow-${scheme.from.replace("from-", "").replace("-500", "-200/20")}`
                  )}>
                    <Plus className="mr-2 size-4" />
                    Plant New
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {[
                  { name: "Clinical Trial Data Q4 2024", status: "Thriving", size: "2.4 GB", modified: "2 hours ago", access: "Public" },
                  { name: "Pharmacology Research Archive", status: "Growing", size: "1.8 GB", modified: "1 day ago", access: "Restricted" },
                  { name: "Patient Demographics Dataset", status: "Thriving", size: "890 MB", modified: "3 days ago", access: "Public" },
                  { name: "Lab Results Dataset Q3", status: "Stable", size: "1.2 GB", modified: "5 days ago", access: "Private" },
                ].map((dataset, i) => (
                  <div key={i} className={cn("flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r border transition-all duration-300",
                    scheme.from.replace("from-", "from-").replace("-500", "-50/40"),
                    scheme.to.replace("to-", "to-").replace("-500", "-50/30"),
                    `border-${scheme.from.replace("from-", "").replace("-500", "-100/40")}`,
                    `hover:from-${scheme.from.replace("from-", "").replace("-500", "-50/60")}`,
                    `hover:to-${scheme.to.replace("to-", "").replace("-500", "-50/50")}`,
                    `hover:border-${scheme.from.replace("from-", "").replace("-500", "-200/60")}`
                  )}>
                    <div className={cn("flex size-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br border",
                      scheme.from.replace("from-", "from-").replace("-500", "-400/20"),
                      scheme.to.replace("to-", "to-").replace("-500", "-400/20"),
                      `border-${scheme.from.replace("from-", "").replace("-500", "-200/40")}`
                    )}>
                      <span className={cn("text-sm font-extralight", scheme.from.replace("from-", "text-").replace("-500", "-700"))}>{i + 1}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-light text-neutral-800 mb-2">{dataset.name}</p>
                      <div className="flex items-center gap-3 text-sm font-extralight text-neutral-500">
                        <span>{dataset.size}</span>
                        <Circle className="size-1 fill-neutral-300" />
                        <span>{dataset.modified}</span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("font-extralight rounded-full",
                        dataset.status === "Thriving"
                          ? cn(`border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`,
                              scheme.from.replace("from-", "text-").replace("-500", "-700/70"),
                              scheme.from.replace("from-", "bg-").replace("-500", "-50/50"))
                          : dataset.status === "Growing"
                          ? cn(`border-${scheme.to.replace("to-", "").replace("-500", "-200/50")}`,
                              scheme.to.replace("to-", "text-").replace("-500", "-700/70"),
                              scheme.to.replace("to-", "bg-").replace("-500", "-50/50"))
                          : "border-neutral-200 text-neutral-600"
                      )}
                    >
                      {dataset.status}
                    </Badge>
                    <Badge variant="outline" className={cn("font-extralight rounded-full bg-white/50",
                      `border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`
                    )}>
                      {dataset.access}
                    </Badge>
                    <Button size="sm" variant="ghost" className={cn("size-10 p-0 rounded-full",
                      `hover:bg-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`
                    )}>
                      <Edit className={cn("size-4", scheme.from.replace("from-", "text-").replace("-500", "-600/70"))} />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card className={cn("rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm shadow-sm",
            `border-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`,
            `shadow-${scheme.from.replace("from-", "").replace("-500", "-100/10")}`
          )}>
            <CardHeader className={cn("border-b bg-gradient-to-br to-transparent",
              `border-${scheme.from.replace("from-", "").replace("-500", "-50/50")}`,
              scheme.bg.replace("from-", "from-").replace("-50", "-50/30")
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("flex size-10 items-center justify-center rounded-2xl border",
                    scheme.to.replace("to-", "bg-").replace("-500", "-400/10"),
                    `border-${scheme.to.replace("to-", "").replace("-500", "-200/30")}`
                  )}>
                    <Clock className={cn("size-5", scheme.to.replace("to-", "text-").replace("-500", "-600/70"))} />
                  </div>
                  <CardTitle className="text-xl font-light text-neutral-800">Pending Requests</CardTitle>
                </div>
                <Badge className={cn("bg-gradient-to-r text-white border-0 rounded-full font-extralight shadow-md",
                  scheme.from.replace("from-", "from-").replace("-500", "-500/90"),
                  scheme.to.replace("to-", "to-").replace("-500", "-500/90"),
                  `shadow-${scheme.from.replace("from-", "").replace("-500", "-200/20")}`
                )}>
                  8 Awaiting
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {[
                  { requester: "Dr. Sarah Johnson", dataset: "Clinical Trial Data Q4 2024", type: "Download", priority: "High", status: "Pending", icon: Clock },
                  { requester: "Michael Chen", dataset: "Pharmacology Research Archive", type: "Modify", priority: "Normal", status: "Approved", icon: CheckCircle },
                  { requester: "Dr. Emily Rodriguez", dataset: "Patient Demographics Dataset", type: "View", priority: "Normal", status: "Pending", icon: Clock },
                  { requester: "James Wilson", dataset: "Lab Results Dataset Q3", type: "Download", priority: "Low", status: "Declined", icon: XCircle },
                ].map((request, i) => {
                  const Icon = request.icon
                  return (
                    <div key={i} className={cn("flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r border transition-all duration-300",
                      scheme.from.replace("from-", "from-").replace("-500", "-50/40"),
                      scheme.to.replace("to-", "to-").replace("-500", "-50/30"),
                      `border-${scheme.from.replace("from-", "").replace("-500", "-100/40")}`,
                      `hover:from-${scheme.from.replace("from-", "").replace("-500", "-50/60")}`,
                      `hover:to-${scheme.to.replace("to-", "").replace("-500", "-50/50")}`,
                      `hover:border-${scheme.from.replace("from-", "").replace("-500", "-200/60")}`
                    )}>
                      <div className={cn("flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br border",
                        scheme.from.replace("from-", "from-").replace("-500", "-400/20"),
                        scheme.to.replace("to-", "to-").replace("-500", "-400/20"),
                        `border-${scheme.from.replace("from-", "").replace("-500", "-200/40")}`
                      )}>
                        <span className={cn("text-xs font-extralight", scheme.from.replace("from-", "text-").replace("-500", "-700"))}>
                          {request.requester.split(" ").map(n => n[0]).join("")}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-light text-neutral-800 mb-1">{request.requester}</p>
                        <p className="text-sm font-extralight text-neutral-600 truncate mb-2">{request.dataset}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={cn("font-extralight rounded-full text-xs bg-white/50",
                            `border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`
                          )}>
                            {request.type}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={`font-extralight rounded-full text-xs ${
                              request.priority === "High"
                                ? "border-red-200/50 text-red-700/70 bg-red-50/50"
                                : request.priority === "Normal"
                                ? cn(`border-${scheme.to.replace("to-", "").replace("-500", "-200/50")}`,
                                    scheme.to.replace("to-", "text-").replace("-500", "-700/70"),
                                    scheme.to.replace("to-", "bg-").replace("-500", "-50/50"))
                                : "border-neutral-200 text-neutral-600"
                            }`}
                          >
                            {request.priority}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center gap-2 ${
                          request.status === "Approved" ? cn(scheme.from.replace("from-", "text-").replace("-500", "-600")) :
                          request.status === "Declined" ? "text-red-600" :
                          "text-amber-600"
                        }`}>
                          <Icon className="size-4" />
                          <span className="text-sm font-extralight">{request.status}</span>
                        </div>
                        {request.status === "Pending" && (
                          <div className="flex gap-2">
                            <Button size="sm" className={cn("h-9 text-white rounded-full font-extralight shadow-sm",
                              scheme.from.replace("from-", "bg-").replace("-500", "-500/90"),
                              `hover:bg-${scheme.from.replace("from-", "").replace("-500", "-500")}`,
                              `shadow-${scheme.from.replace("from-", "").replace("-500", "-200/20")}`
                            )}>
                              <CheckCircle className="mr-1 size-3" />
                              Accept
                            </Button>
                            <Button size="sm" variant="outline" className="h-9 text-red-600/80 border-red-200/50 hover:bg-red-50/50 rounded-full font-extralight">
                              <XCircle className="mr-1 size-3" />
                              Decline
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
          <Card className={cn("rounded-3xl overflow-hidden bg-white/70 backdrop-blur-sm shadow-sm",
            `border-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`,
            `shadow-${scheme.from.replace("from-", "").replace("-500", "-100/10")}`
          )}>
            <CardHeader className={cn("border-b bg-gradient-to-br to-transparent",
              `border-${scheme.from.replace("from-", "").replace("-500", "-50/50")}`,
              scheme.bg.replace("from-", "from-").replace("-50", "-50/30")
            )}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("flex size-10 items-center justify-center rounded-2xl border",
                    scheme.from.replace("from-", "bg-").replace("-500", "-400/10"),
                    `border-${scheme.from.replace("from-", "").replace("-500", "-200/30")}`
                  )}>
                    <Shield className={cn("size-5", scheme.from.replace("from-", "text-").replace("-500", "-600/70"))} />
                  </div>
                  <CardTitle className="text-xl font-light text-neutral-800">User Permissions</CardTitle>
                </div>
                <Button variant="outline" size="sm" className={cn("rounded-full font-extralight bg-white/70",
                  `border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`,
                  `hover:bg-${scheme.from.replace("from-", "").replace("-500", "-50/50")}`
                )}>
                  <Plus className="mr-2 size-4" />
                  Invite User
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                {[
                  { name: "Dr. Sarah Johnson", email: "sarah.johnson@astrazeneca.com", department: "Clinical Research", role: "Admin", access: "Full Access", status: "Active" },
                  { name: "Michael Chen", email: "michael.chen@astrazeneca.com", department: "Data Science", role: "Editor", access: "Read & Write", status: "Active" },
                  { name: "Dr. Emily Rodriguez", email: "emily.rodriguez@astrazeneca.com", department: "Pharmacology", role: "Viewer", access: "Read Only", status: "Active" },
                  { name: "James Wilson", email: "james.wilson@astrazeneca.com", department: "Laboratory", role: "Editor", access: "Read & Write", status: "Inactive" },
                ].map((user, i) => (
                  <div key={i} className={cn("flex items-center gap-4 p-6 rounded-2xl bg-gradient-to-r border transition-all duration-300",
                    scheme.from.replace("from-", "from-").replace("-500", "-50/40"),
                    scheme.to.replace("to-", "to-").replace("-500", "-50/30"),
                    `border-${scheme.from.replace("from-", "").replace("-500", "-100/40")}`,
                    `hover:from-${scheme.from.replace("from-", "").replace("-500", "-50/60")}`,
                    `hover:to-${scheme.to.replace("to-", "").replace("-500", "-50/50")}`,
                    `hover:border-${scheme.from.replace("from-", "").replace("-500", "-200/60")}`
                  )}>
                    <div className={cn("flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br border",
                      scheme.from.replace("from-", "from-").replace("-500", "-400/20"),
                      scheme.to.replace("to-", "to-").replace("-500", "-400/20"),
                      `border-${scheme.from.replace("from-", "").replace("-500", "-200/40")}`
                    )}>
                      <span className={cn("text-xs font-extralight", scheme.from.replace("from-", "text-").replace("-500", "-700"))}>
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-light text-neutral-800">{user.name}</p>
                        {user.status === "Active" && (
                          <Circle className={cn("size-2 fill-current", scheme.from.replace("from-", "text-").replace("-500", "-500"))} />
                        )}
                      </div>
                      <p className="text-sm font-extralight text-neutral-600 mb-2">{user.department}</p>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn("font-extralight rounded-full text-xs",
                            user.role === "Admin"
                              ? cn(`border-${scheme.from.replace("from-", "").replace("-500", "-300/50")}`,
                                  scheme.from.replace("from-", "text-").replace("-500", "-700/80"),
                                  scheme.from.replace("from-", "bg-").replace("-500", "-100/50"))
                              : cn(`border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`, "bg-white/50")
                          )}
                        >
                          {user.role}
                        </Badge>
                        <span className="text-xs font-extralight text-neutral-500 flex items-center gap-1">
                          <Shield className="size-3" />
                          {user.access}
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("font-extralight rounded-full",
                        user.status === "Active"
                          ? cn(`border-${scheme.from.replace("from-", "").replace("-500", "-200/50")}`,
                              scheme.from.replace("from-", "text-").replace("-500", "-700/70"),
                              scheme.from.replace("from-", "bg-").replace("-500", "-50/50"))
                          : "border-neutral-200 text-neutral-600"
                      )}
                    >
                      {user.status}
                    </Badge>
                    <Button size="sm" variant="ghost" className={cn("size-10 p-0 rounded-full",
                      `hover:bg-${scheme.from.replace("from-", "").replace("-500", "-100/50")}`
                    )}>
                      <Edit className={cn("size-4", scheme.from.replace("from-", "text-").replace("-500", "-600/70"))} />
                    </Button>
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

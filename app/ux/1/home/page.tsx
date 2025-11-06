import { AppLayout } from "@/components/app-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  MessageCircle,
  BookOpen,
  Search,
  FileStack,
  Settings,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Database,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <AppLayout breadcrumbs={[{ label: "Dashboard" }]}>
      <div className="space-y-8 -m-6">
        {/* Hero Section */}
        <div className="bg-primary px-6 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-primary-foreground mb-3">
              Welcome back, John
            </h1>
            <p className="text-primary-foreground/90 text-lg">
              Your trusted portal for reliable research data and insights
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-6 space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Datasets
                </CardTitle>
                <div className="flex size-10 items-center justify-center rounded-full bg-blue-100">
                  <Database className="size-5 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">1,284</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-primary font-medium">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Active Requests
                </CardTitle>
                <div className="flex size-10 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="size-5 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">8</div>
                <p className="text-xs text-muted-foreground mt-1">
                  3 pending approval
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Approved This Month
                </CardTitle>
                <div className="flex size-10 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="size-5 text-green-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">23</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-primary font-medium">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Team Members
                </CardTitle>
                <div className="flex size-10 items-center justify-center rounded-full bg-purple-100">
                  <Users className="size-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">142</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across 6 departments
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Help Center Widget */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10">
                      <MessageCircle className="size-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Help Center</CardTitle>
                      <CardDescription className="text-sm">Get assistance</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="default" className="w-full justify-start h-11 rounded-xl">
                    <Sparkles className="mr-2 size-4" />
                    Chat with AI Assistant
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-11 rounded-xl">
                    <BookOpen className="mr-2 size-4" />
                    Browse Documentation
                  </Button>
                </CardContent>
              </Card>

              {/* Explore Data Widget */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-pink-100">
                      <Search className="size-6 text-pink-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Explore Data</CardTitle>
                      <CardDescription className="text-sm">Find datasets</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="Search datasets..." className="rounded-xl" />
                    <Button size="icon" className="rounded-xl shrink-0">
                      <Search className="size-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Popular Datasets</p>
                    {[
                      { name: "Clinical Trial Data Q4", views: 245 },
                      { name: "Pharmacology Research", views: 189 },
                      { name: "Patient Demographics", views: 156 },
                    ].map((dataset, i) => (
                      <div key={i} className="flex items-center justify-between text-sm py-1">
                        <span className="text-foreground/80">{dataset.name}</span>
                        <Badge variant="secondary" className="rounded-full">{dataset.views}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* My Requests Widget */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-100">
                      <FileStack className="size-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">My Requests</CardTitle>
                      <CardDescription className="text-sm">Track requests</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { title: "Clinical Trial Data 2024", status: "Pending", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
                    { title: "Research Archive Q3", status: "Approved", icon: CheckCircle2, color: "text-green-600", bg: "bg-green-50" },
                    { title: "Lab Results Dataset", status: "Action Required", icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50" },
                  ].map((request, i) => {
                    const Icon = request.icon
                    return (
                      <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${request.bg}`}>
                        <Icon className={`size-4 mt-0.5 shrink-0 ${request.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{request.title}</p>
                          <p className="text-xs text-muted-foreground">{request.status}</p>
                        </div>
                      </div>
                    )
                  })}
                  <Button variant="outline" className="w-full rounded-xl">
                    View All Requests
                  </Button>
                </CardContent>
              </Card>

              {/* Settings Widget */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-slate-100">
                      <Settings className="size-6 text-slate-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Preferences</CardTitle>
                      <CardDescription className="text-sm">Manage settings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: "Email Notifications", value: "On", active: true },
                    { label: "Auto-archive", value: "Off", active: false },
                    { label: "Export Format", value: "CSV", active: false },
                  ].map((setting, i) => (
                    <div key={i} className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-sm font-medium">{setting.label}</p>
                      </div>
                      <Badge variant={setting.active ? "default" : "secondary"} className="rounded-full">
                        {setting.value}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-xl">
                    <Settings className="mr-2 size-4" />
                    All Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Activity Feed Widget */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-100">
                      <TrendingUp className="size-6 text-emerald-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Recent Activity</CardTitle>
                      <CardDescription className="text-sm">Latest updates</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { text: "New dataset added", time: "2 hours ago", color: "bg-emerald-500" },
                    { text: "Request approved", time: "5 hours ago", color: "bg-blue-500" },
                    { text: "System maintenance", time: "1 day ago", color: "bg-amber-500" },
                    { text: "3 new team members", time: "2 days ago", color: "bg-purple-500" },
                  ].map((activity, i) => (
                    <div key={i} className="flex gap-3 py-1">
                      <div className={`size-2 rounded-full ${activity.color} mt-2 shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm">{activity.text}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-xl">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>

              {/* Quick Actions Card */}
              <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-indigo-100">
                      <BarChart3 className="size-6 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Actions</CardTitle>
                      <CardDescription className="text-sm">Common tasks</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { icon: Plus, label: "New Request" },
                    { icon: Search, label: "Search Data" },
                    { icon: BarChart3, label: "View Analytics" },
                    { icon: Users, label: "Team Management" },
                  ].map((action, i) => {
                    const Icon = action.icon
                    return (
                      <Button key={i} variant="ghost" className="w-full justify-start rounded-xl h-10">
                        <Icon className="mr-2 size-4" />
                        {action.label}
                      </Button>
                    )
                  })}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

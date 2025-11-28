import { UX6Layout } from "@/app/ux/_components/ux6-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Database,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  TrendingDown,
  Search,
  Sparkles,
  ArrowRight,
  Play,
  BarChart3,
  FileText,
} from "lucide-react"

export default function UX6DashboardPage() {
  return (
    <UX6Layout>
      {/* Hero Section with Glassmorphism */}
      <div className="mb-8 relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8B5CF6] via-[#6366F1] to-[#4F46E5] p-12 text-white shadow-2xl shadow-purple-500/30">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />
        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-white/30">
              Welcome back, John
            </Badge>
            <Badge className="bg-gradient-to-r from-[#EC4899] to-[#F43F5E] text-white border-0">
              3 New Updates
            </Badge>
          </div>
          <h1 className="text-4xl font-bold mb-4">
            Discover Insights with AI-Powered Analytics
          </h1>
          <p className="text-white/90 mb-8 text-lg">
            Access 1,284 datasets with intelligent search and automated analysis tools
          </p>
          <div className="flex gap-3">
            <Button size="lg" className="bg-white text-[#8B5CF6] hover:bg-white/90 font-semibold h-12 shadow-lg">
              <Sparkles className="mr-2 size-5" />
              Ask AI Assistant
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm h-12">
              Browse Datasets
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid with Glassmorphic Cards */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Datasets", value: "1,284", change: "+12%", icon: Database, trend: "up", color: "from-violet-500 to-purple-600" },
          { label: "Pending Requests", value: "8", change: "+2", icon: Clock, trend: "up", color: "from-blue-500 to-cyan-600" },
          { label: "Approved This Month", value: "23", change: "+8%", icon: CheckCircle2, trend: "up", color: "from-emerald-500 to-teal-600" },
          { label: "Active Users", value: "142", change: "-3%", icon: Users, trend: "down", color: "from-pink-500 to-rose-600" },
        ].map((stat, i) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={i} className="border-white/60 bg-white/40 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.color} shadow-lg`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <span className={`flex items-center text-xs font-medium ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    <TrendIcon className="size-3 mr-1" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-600 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Quick Actions */}
        <Card className="border-white/60 bg-white/40 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="size-5 text-[#8B5CF6]" />
              Quick Actions
            </CardTitle>
            <CardDescription>Start working with your data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: Search, label: "Search Datasets", color: "from-violet-500 to-purple-600" },
              { icon: Play, label: "Run Analysis", color: "from-blue-500 to-cyan-600" },
              { icon: FileText, label: "View Reports", color: "from-emerald-500 to-teal-600" },
            ].map((action, i) => {
              const Icon = action.icon
              return (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-4 rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  <div className={`flex size-10 items-center justify-center rounded-lg bg-gradient-to-br ${action.color} shadow-md`}>
                    <Icon className="size-5 text-white" />
                  </div>
                  <span className="font-medium text-neutral-900">{action.label}</span>
                  <ArrowRight className="ml-auto size-4 text-neutral-400" />
                </button>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-2 border-white/60 bg-white/40 backdrop-blur-xl shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                <CardDescription>Latest updates across your datasets</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="text-xs backdrop-blur-sm bg-white/50">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { user: "Dr. Sarah Johnson", action: "downloaded", dataset: "Clinical Trial Data Q4 2024", time: "2 min ago", color: "from-blue-500 to-cyan-600" },
                { user: "Michael Chen", action: "modified", dataset: "Pharmacology Research Archive", time: "15 min ago", color: "from-amber-500 to-orange-600" },
                { user: "Dr. Emily Rodriguez", action: "viewed", dataset: "Patient Demographics Dataset", time: "1 hour ago", color: "from-emerald-500 to-teal-600" },
                { user: "James Wilson", action: "uploaded", dataset: "Lab Results Q3 2024", time: "2 hours ago", color: "from-violet-500 to-purple-600" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-white/80 hover:shadow-md transition-all">
                  <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${activity.color} text-white text-xs font-semibold shadow-md`}>
                    {activity.user.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-neutral-900 truncate">
                      <span className="font-semibold">{activity.user}</span> {activity.action} <span className="text-neutral-600">{activity.dataset}</span>
                    </p>
                    <p className="text-xs text-neutral-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Datasets */}
      <Card className="mt-6 border-white/60 bg-white/40 backdrop-blur-xl shadow-xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Top Performing Datasets</CardTitle>
              <CardDescription>Most accessed datasets this month</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs backdrop-blur-sm bg-white/50">
              <BarChart3 className="mr-2 size-4" />
              View Analytics
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rank: 1, name: "Clinical Trial Data Q4 2024", category: "Clinical Trials", access: 847, trend: "+23%", color: "from-violet-500 to-purple-600" },
              { rank: 2, name: "Pharmacology Research Archive", category: "Pharmacology", access: 692, trend: "+18%", color: "from-blue-500 to-cyan-600" },
              { rank: 3, name: "Patient Demographics Study 2024", category: "Demographics", access: 534, trend: "+12%", color: "from-emerald-500 to-teal-600" },
              { rank: 4, name: "Lab Results Dataset Q3", category: "Lab Results", access: 421, trend: "+8%", color: "from-amber-500 to-orange-600" },
            ].map((dataset) => (
              <div key={dataset.rank} className="flex items-center gap-4 p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-white/80 hover:shadow-lg transition-all">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dataset.color} text-white font-bold text-lg shadow-lg`}>
                  {dataset.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-neutral-900 mb-1">{dataset.name}</p>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-xs bg-white/50">{dataset.category}</Badge>
                    <span className="text-sm text-neutral-600">{dataset.access.toLocaleString()} accesses</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <TrendingUp className="size-4" />
                  <span className="text-sm">{dataset.trend}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </UX6Layout>
  )
}

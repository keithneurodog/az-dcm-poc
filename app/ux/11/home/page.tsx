import { UX11Layout } from "@/app/ux/_components/ux11-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Database,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Sparkles,
  Award,
  Zap,
} from "lucide-react"

export default function UX11DashboardPage() {
  return (
    <UX11Layout>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full" />
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 font-semibold">
            Executive Dashboard
          </Badge>
        </div>
        <h1 className="text-5xl font-serif text-neutral-900 mb-3 tracking-wide bg-gradient-to-r from-neutral-900 to-neutral-700 bg-clip-text">
          Welcome Back, John
        </h1>
        <p className="text-xl text-neutral-600">
          Your premium enterprise data platform
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Datasets", value: "1,284", change: "+12%", icon: Database, trend: "up", gradient: "from-blue-500 to-cyan-500" },
          { label: "Active Requests", value: "8", change: "+2", icon: Clock, trend: "up", gradient: "from-purple-500 to-pink-500" },
          { label: "Completed", value: "23", change: "+8%", icon: CheckCircle2, trend: "up", gradient: "from-emerald-500 to-teal-500" },
          { label: "Team Members", value: "142", change: "+5%", icon: Users, trend: "up", gradient: "from-amber-500 to-orange-500" },
        ].map((stat, i) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={i} className="border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 bg-white overflow-hidden group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex size-14 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="size-6 text-white" />
                  </div>
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold">
                    <TrendIcon className="size-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <Card className="col-span-2 border-0 shadow-xl bg-white">
          <CardHeader className="border-b border-neutral-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-serif text-neutral-900">Performance Metrics</CardTitle>
                <CardDescription className="text-neutral-600 font-medium">Real-time analytics</CardDescription>
              </div>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold shadow-lg">
                <Sparkles className="mr-2 size-4" />
                Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {[
                { label: "Data Processing", value: 87, gradient: "from-amber-400 to-orange-500" },
                { label: "System Uptime", value: 99, gradient: "from-emerald-400 to-teal-500" },
                { label: "User Engagement", value: 76, gradient: "from-blue-400 to-cyan-500" },
              ].map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-neutral-700">{metric.label}</span>
                    <span className="text-sm font-bold text-neutral-900">{metric.value}%</span>
                  </div>
                  <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden shadow-inner">
                    <div
                      className={`h-full bg-gradient-to-r ${metric.gradient} rounded-full transition-all shadow-sm`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Featured Access */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-amber-400 via-orange-400 to-orange-500 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <CardHeader className="relative z-10">
            <CardTitle className="text-lg font-serif flex items-center gap-2">
              <Award className="size-5" />
              Featured
            </CardTitle>
            <CardDescription className="text-white/90 font-medium">Premium resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 relative z-10">
            {["Executive Reports", "Analytics Suite", "Data Insights"].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-white hover:bg-white/95 transition-all shadow-md hover:shadow-lg group"
              >
                <span className="text-sm font-bold text-neutral-900">{action}</span>
                <ArrowRight className="size-4 text-neutral-600 group-hover:text-amber-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6 border-0 shadow-xl bg-white">
        <CardHeader className="border-b border-neutral-100">
          <CardTitle className="text-xl font-serif text-neutral-900">Recent Activity</CardTitle>
          <CardDescription className="text-neutral-600 font-medium">Latest operations</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[
              { user: "Dr. Sarah Johnson", action: "accessed", dataset: "Clinical Trial Data Q4 2024", time: "2 min ago", gradient: "from-blue-500 to-cyan-500" },
              { user: "Michael Chen", action: "modified", dataset: "Pharmacology Research Archive", time: "15 min ago", gradient: "from-purple-500 to-pink-500" },
              { user: "Dr. Emily Rodriguez", action: "requested", dataset: "Patient Demographics Dataset", time: "1 hour ago", gradient: "from-emerald-500 to-teal-500" },
              { user: "James Wilson", action: "exported", dataset: "Lab Results Q3 2024", time: "2 hours ago", gradient: "from-amber-500 to-orange-500" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 hover:bg-white border border-neutral-200 hover:border-purple-200 hover:shadow-md transition-all">
                <div className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${activity.gradient} text-white font-bold shadow-md`}>
                  {activity.user.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-900">
                    {activity.user} <span className="font-medium text-neutral-600">{activity.action}</span>
                  </p>
                  <p className="text-sm text-neutral-500 truncate">{activity.dataset}</p>
                </div>
                <span className="text-xs text-neutral-400 font-medium">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Datasets */}
      <Card className="mt-6 border-0 shadow-xl bg-white">
        <CardHeader className="border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-serif text-neutral-900">Top Performing Datasets</CardTitle>
              <CardDescription className="text-neutral-600 font-medium">Most accessed this quarter</CardDescription>
            </div>
            <Button variant="outline" className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 font-semibold">
              <Zap className="mr-2 size-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[
              { rank: 1, name: "Clinical Trial Data Q4 2024", category: "Clinical Trials", access: 847, trend: "+23%", gradient: "from-blue-500 to-cyan-500" },
              { rank: 2, name: "Pharmacology Research Archive", category: "Pharmacology", access: 692, trend: "+18%", gradient: "from-purple-500 to-pink-500" },
              { rank: 3, name: "Patient Demographics Study 2024", category: "Demographics", access: 534, trend: "+12%", gradient: "from-emerald-500 to-teal-500" },
              { rank: 4, name: "Lab Results Dataset Q3", category: "Lab Results", access: 421, trend: "+8%", gradient: "from-amber-500 to-orange-500" },
            ].map((dataset) => (
              <div key={dataset.rank} className="flex items-center gap-4 p-4 rounded-xl bg-neutral-50 hover:bg-white border border-neutral-200 hover:shadow-lg transition-all group">
                <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dataset.gradient} text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                  {dataset.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-neutral-900 mb-1">{dataset.name}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="outline" className="font-semibold border-neutral-300">{dataset.category}</Badge>
                    <span className="text-neutral-600 font-medium">{dataset.access.toLocaleString()} accesses</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 font-bold">
                    <TrendingUp className="size-3 mr-1" />
                    {dataset.trend}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </UX11Layout>
  )
}

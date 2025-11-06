import { UX10Layout } from "@/components/ux10-layout"
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
  ArrowUpRight,
  Award,
} from "lucide-react"

export default function UX10DashboardPage() {
  return (
    <UX10Layout>
      {/* Hero Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-400" />
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
            Executive Dashboard
          </Badge>
        </div>
        <h1 className="text-4xl font-serif text-neutral-900 mb-3 tracking-wide">
          Welcome Back, John
        </h1>
        <p className="text-lg text-neutral-600">
          Your enterprise data platform overview
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Datasets", value: "1,284", change: "+12%", icon: Database, trend: "up" },
          { label: "Active Requests", value: "8", change: "+2", icon: Clock, trend: "up" },
          { label: "Completed", value: "23", change: "+8%", icon: CheckCircle2, trend: "up" },
          { label: "Team Members", value: "142", change: "-3%", icon: Users, trend: "down" },
        ].map((stat, i) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={i} className="bg-white border-neutral-200 shadow-sm hover:shadow-md transition-all">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex size-11 items-center justify-center rounded-lg bg-amber-50 border border-amber-200">
                    <Icon className="size-5 text-amber-600" />
                  </div>
                  <span className={`flex items-center text-xs font-medium ${stat.trend === "up" ? "text-emerald-600" : "text-red-600"}`}>
                    <TrendIcon className="size-3 mr-1" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-semibold text-neutral-900">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Performance Metrics */}
        <Card className="col-span-2 bg-white border-neutral-200 shadow-sm">
          <CardHeader className="border-b border-neutral-200">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-serif text-neutral-900">Performance Metrics</CardTitle>
                <CardDescription className="text-neutral-600">Real-time analytics and insights</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="border-amber-200 text-amber-600 hover:bg-amber-50">
                <ArrowUpRight className="mr-2 size-4" />
                Details
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {[
                { label: "Data Processing", value: 87, color: "amber" },
                { label: "System Uptime", value: 99, color: "emerald" },
                { label: "User Engagement", value: 76, color: "cyan" },
              ].map((metric, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 tracking-wide">{metric.label}</span>
                    <span className="text-sm font-semibold text-neutral-900">{metric.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${
                        metric.color === "amber" ? "from-amber-400 to-amber-600" :
                        metric.color === "emerald" ? "from-emerald-400 to-emerald-600" :
                        "from-cyan-400 to-cyan-600"
                      } rounded-full transition-all`}
                      style={{ width: `${metric.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-gradient-to-br from-amber-400 to-amber-600 border-0 text-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-serif">Featured Access</CardTitle>
            <CardDescription className="text-white/80">Premium resources</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {["Executive Reports", "Analytics Suite", "Data Insights"].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-4 rounded-lg bg-white hover:bg-white/90 transition-all group"
              >
                <span className="text-sm font-medium text-neutral-900">{action}</span>
                <ArrowUpRight className="size-4 text-neutral-600 group-hover:text-amber-600 transition-colors" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6 bg-white border-neutral-200 shadow-sm">
        <CardHeader className="border-b border-neutral-200">
          <CardTitle className="text-lg font-serif text-neutral-900">Recent Activity</CardTitle>
          <CardDescription className="text-neutral-600">Latest operations and updates</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[
              { user: "Dr. Sarah Johnson", action: "accessed", dataset: "Clinical Trial Data Q4 2024", time: "2 minutes ago", status: "completed" },
              { user: "Michael Chen", action: "modified", dataset: "Pharmacology Research Archive", time: "15 minutes ago", status: "completed" },
              { user: "Dr. Emily Rodriguez", action: "requested", dataset: "Patient Demographics Dataset", time: "1 hour ago", status: "pending" },
              { user: "James Wilson", action: "exported", dataset: "Lab Results Q3 2024", time: "2 hours ago", status: "completed" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-amber-200 transition-all">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white text-sm font-semibold shadow-md">
                  {activity.user.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900">
                    <span className="text-neutral-600">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-sm text-neutral-500 truncate">{activity.dataset}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-neutral-500">{activity.time}</span>
                  <Badge className={
                    activity.status === "completed"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }>
                    {activity.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Datasets */}
      <Card className="mt-6 bg-white border-neutral-200 shadow-sm">
        <CardHeader className="border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-serif text-neutral-900">Premium Datasets</CardTitle>
              <CardDescription className="text-neutral-600">Most accessed this quarter</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-amber-200 text-amber-600 hover:bg-amber-50">
              <Award className="mr-2 size-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[
              { rank: 1, name: "Clinical Trial Data Q4 2024", category: "Clinical Trials", access: 847, trend: "+23%" },
              { rank: 2, name: "Pharmacology Research Archive", category: "Pharmacology", access: 692, trend: "+18%" },
              { rank: 3, name: "Patient Demographics Study 2024", category: "Demographics", access: 534, trend: "+12%" },
              { rank: 4, name: "Lab Results Dataset Q3", category: "Lab Results", access: 421, trend: "+8%" },
            ].map((dataset) => (
              <div key={dataset.rank} className="flex items-center gap-4 p-4 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-amber-200 transition-all group">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-white font-semibold shadow-md">
                  {dataset.rank}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-neutral-900 mb-1">{dataset.name}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge variant="outline" className="text-xs border-neutral-300 text-neutral-600">
                      {dataset.category}
                    </Badge>
                    <span className="text-neutral-500">{dataset.access} accesses</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-emerald-600">{dataset.trend}</span>
                  <TrendingUp className="size-4 text-emerald-600" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </UX10Layout>
  )
}

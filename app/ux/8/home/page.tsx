import { UX8Layout } from "@/app/ux/_components/ux8-layout"
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
  ArrowRight,
  Circle,
} from "lucide-react"

export default function UX8DashboardPage() {
  return (
    <UX8Layout>
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-white rounded-full border border-neutral-200">
          <Circle className="size-2 fill-rose-500 text-rose-500 animate-pulse" />
          <span className="text-xs font-light text-neutral-600">System Online</span>
        </div>
        <h1 className="text-5xl font-extralight text-neutral-900 mb-4 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-lg font-light text-neutral-500 max-w-xl mx-auto">
          Access your data with clarity and focus
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-16">
        {[
          { label: "Total Datasets", value: "1,284", change: "+12%", icon: Database },
          { label: "Pending", value: "8", change: "+2", icon: Clock },
          { label: "Completed", value: "23", change: "+8%", icon: CheckCircle2 },
          { label: "Active Users", value: "142", change: "+5%", icon: Users },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <div key={i} className="group">
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-rose-50 to-orange-50">
                    <Icon className="size-5 text-rose-500" />
                  </div>
                  <span className="text-xs font-light text-emerald-600">{stat.change}</span>
                </div>
                <p className="text-xs font-light text-neutral-500 mb-1 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-light text-neutral-900">{stat.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-8 mb-16">
        {/* Quick Actions */}
        <Card className="border-neutral-200 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 bg-white">
            <CardTitle className="text-lg font-light text-neutral-900">Quick Actions</CardTitle>
            <CardDescription className="font-light">Start your workflow</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            {["New Dataset", "Run Analysis", "View Reports"].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 hover:bg-gradient-to-r hover:from-rose-50 hover:to-orange-50 border border-transparent hover:border-rose-200 transition-all group"
              >
                <span className="text-sm font-light text-neutral-700 group-hover:text-neutral-900">{action}</span>
                <ArrowRight className="size-4 text-neutral-400 group-hover:text-rose-500 transition-colors" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="col-span-2 border-neutral-200 rounded-2xl overflow-hidden">
          <CardHeader className="border-b border-neutral-100 bg-white">
            <CardTitle className="text-lg font-light text-neutral-900">Recent Activity</CardTitle>
            <CardDescription className="font-light">Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {[
              { user: "Sarah Johnson", action: "downloaded", dataset: "Clinical Trial Data", time: "2 min ago" },
              { user: "Michael Chen", action: "updated", dataset: "Pharmacology Research", time: "15 min ago" },
              { user: "Emily Rodriguez", action: "viewed", dataset: "Patient Demographics", time: "1 hour ago" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-neutral-50 transition-colors">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-white text-xs font-light">
                  {activity.user.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-light text-neutral-900">
                    <span className="font-normal">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-xs font-light text-neutral-500 truncate">{activity.dataset}</p>
                </div>
                <span className="text-xs font-light text-neutral-400">{activity.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Featured Datasets */}
      <div className="mb-8">
        <h2 className="text-2xl font-light text-neutral-900 mb-6">Featured Datasets</h2>
        <div className="space-y-4">
          {[
            { name: "Clinical Trial Data Q4 2024", category: "Clinical Trials", access: 847, trend: "+23%" },
            { name: "Pharmacology Research Archive", category: "Pharmacology", access: 692, trend: "+18%" },
            { name: "Patient Demographics Study 2024", category: "Demographics", access: 534, trend: "+12%" },
          ].map((dataset, i) => (
            <div key={i} className="group">
              <div className="bg-white rounded-2xl p-6 border border-neutral-200 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-orange-400 text-white text-xs font-light">
                        {i + 1}
                      </div>
                      <h3 className="text-base font-light text-neutral-900">{dataset.name}</h3>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline" className="font-light border-neutral-200">
                        {dataset.category}
                      </Badge>
                      <span className="font-light text-neutral-500">{dataset.access} accesses</span>
                      <span className="font-light text-emerald-600">{dataset.trend}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-full border-neutral-200 hover:bg-gradient-to-r hover:from-rose-500 hover:to-orange-400 hover:text-white hover:border-transparent transition-all"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl p-12 text-center border border-rose-100">
        <div className="flex size-16 items-center justify-center rounded-full bg-white mx-auto mb-6 shadow-sm">
          <TrendingUp className="size-7 text-rose-500" />
        </div>
        <h3 className="text-2xl font-light text-neutral-900 mb-3">System Performance</h3>
        <p className="text-neutral-600 font-light mb-6 max-w-md mx-auto">
          Your data operations are running smoothly with 99.9% uptime this month
        </p>
        <Button className="bg-gradient-to-r from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500 text-white rounded-full px-8 font-light">
          View Analytics
        </Button>
      </div>
    </UX8Layout>
  )
}

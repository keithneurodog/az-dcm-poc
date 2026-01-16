"use client"

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
  ArrowRight,
  Circle,
  Search,
  MessageSquare,
  Sparkles,
} from "lucide-react"
import { useColorScheme } from "@/app/ux/_components/ux12-color-context"
import { cn } from "@/lib/utils"

export default function UX12DashboardPage() {
  const { scheme } = useColorScheme()

  return (
    <>
      {/* Hero Section - Data Exploration */}
      <div className={cn("rounded-3xl p-12 mb-16 border bg-gradient-to-br", scheme.bg, scheme.bgHover, scheme.from.replace("from-", "border-").replace("500", "100"))}>
        <div className="flex items-center justify-center gap-2 mb-6">
          <Circle className={cn("size-2 animate-pulse fill-current", scheme.from.replace("from-", "text-"))} />
          <span className="text-xs font-light text-neutral-600 uppercase tracking-wider">System Online</span>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-5xl font-extralight text-neutral-900 mb-4 tracking-tight">
            Explore Your Data
          </h1>
          <p className="text-lg font-light text-neutral-600 max-w-2xl mx-auto">
            Search through 1,284 datasets or ask questions naturally with AI assistance
          </p>
        </div>

        {/* Quick Search Bar */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="relative">
            <Sparkles className={cn("absolute left-6 top-1/2 size-5 -translate-y-1/2", scheme.from.replace("from-", "text-"))} />
            <Input
              placeholder="Ask a question or search datasets..."
              className="pl-16 h-16 border-2 border-white focus:border-white rounded-2xl text-base font-light shadow-lg bg-white/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* CTA Options */}
        <div className="flex items-center justify-center gap-4">
          <Button
            className={cn(
              "bg-gradient-to-r text-white rounded-full px-8 font-light h-12 shadow-lg hover:shadow-xl transition-all",
              scheme.from,
              scheme.to
            )}
          >
            <MessageSquare className="mr-2 size-4" />
            Ask AI Assistant
          </Button>
          <Button
            className="rounded-full px-8 font-light h-12 bg-white hover:bg-white/90 shadow-md border-0 text-neutral-900"
          >
            <Search className="mr-2 size-4" />
            Browse All Datasets
          </Button>
        </div>
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
                  <div className={cn("flex size-12 items-center justify-center rounded-full bg-gradient-to-br", scheme.bg, scheme.bgHover)}>
                    <Icon className={cn("size-5", scheme.from.replace("from-", "text-"))} />
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
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-xl bg-neutral-50 hover:bg-gradient-to-r border border-transparent transition-all group",
                  `hover:${scheme.bg} hover:${scheme.bgHover} hover:border-current`
                )}
                style={{
                  // @ts-expect-error - CSS custom properties for gradients
                  "--tw-gradient-from": scheme.bg,
                  "--tw-gradient-to": scheme.bgHover,
                }}
              >
                <span className="text-sm font-light text-neutral-700 group-hover:text-neutral-900">{action}</span>
                <ArrowRight className={cn("size-4 text-neutral-400 transition-colors group-hover:", scheme.from.replace("from-", "text-"))} />
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
                <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full text-white text-xs font-light bg-gradient-to-br", scheme.from, scheme.to)}>
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
                      <div className={cn("flex size-8 items-center justify-center rounded-full text-white text-xs font-light bg-gradient-to-br", scheme.from, scheme.to)}>
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
                    className={cn(
                      "rounded-full border-neutral-200 hover:bg-gradient-to-r hover:text-white hover:border-transparent transition-all",
                      `hover:${scheme.from} hover:${scheme.to}`
                    )}
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
      <div className={cn("rounded-3xl p-12 text-center border bg-gradient-to-br", scheme.bg, scheme.bgHover, scheme.from.replace("from-", "border-").replace("500", "100"))}>
        <div className="flex size-16 items-center justify-center rounded-full bg-white mx-auto mb-6 shadow-sm">
          <TrendingUp className={cn("size-7", scheme.from.replace("from-", "text-"))} />
        </div>
        <h3 className="text-2xl font-light text-neutral-900 mb-3">System Performance</h3>
        <p className="text-neutral-600 font-light mb-6 max-w-md mx-auto">
          Your data operations are running smoothly with 99.9% uptime this month
        </p>
        <Button className={cn("bg-gradient-to-r text-white rounded-full px-8 font-light shadow-lg hover:shadow-xl transition-all", scheme.from, scheme.to)}>
          View Analytics
        </Button>
      </div>
    </>
  )
}

import { UX7Layout } from "@/components/ux7-layout"
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
  Zap,
  Terminal,
  Activity,
  Shield,
  Server,
} from "lucide-react"

export default function UX7DashboardPage() {
  return (
    <UX7Layout>
      {/* Hero Section */}
      <div className="mb-8 relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0A0E1A] to-[#050810] p-8 border border-emerald-500/20">
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'linear-gradient(rgba(16, 185, 129, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16, 185, 129, 0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />

        {/* Glow Effect */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 blur-[120px] rounded-full" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-4">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30">
              <Zap className="size-3 mr-1" />
              System Active
            </Badge>
            <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
              v2.5.1
            </Badge>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            High-Performance Data Analytics
          </h1>
          <p className="text-neutral-400 mb-6 text-lg max-w-2xl">
            Real-time access to <span className="text-emerald-400 font-mono">1,284</span> datasets with advanced monitoring and AI-powered insights
          </p>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold shadow-lg shadow-emerald-500/30">
              <Terminal className="mr-2 size-4" />
              Open Terminal
            </Button>
            <Button variant="outline" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
              <Activity className="mr-2 size-4" />
              View Metrics
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Datasets", value: "1,284", change: "+12%", icon: Database, trend: "up" },
          { label: "Active Queries", value: "23", change: "+8", icon: Activity, trend: "up" },
          { label: "Requests/min", value: "847", change: "+15%", icon: Zap, trend: "up" },
          { label: "System Load", value: "42%", change: "-3%", icon: Server, trend: "down" },
        ].map((stat, i) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown
          return (
            <Card key={i} className="bg-[#0A0E1A] border-emerald-500/20 hover:border-emerald-500/40 transition-all group">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-30 group-hover:opacity-50 transition-opacity" />
                    <div className="relative flex size-12 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30">
                      <Icon className="size-6 text-emerald-400" />
                    </div>
                  </div>
                  <span className={`flex items-center text-xs font-mono ${stat.trend === "up" ? "text-emerald-400" : "text-red-400"}`}>
                    <TrendIcon className="size-3 mr-1" />
                    {stat.change}
                  </span>
                </div>
                <p className="text-sm font-medium text-neutral-500 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-white font-mono">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* System Monitor */}
        <Card className="bg-[#0A0E1A] border-emerald-500/20">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="size-5 text-emerald-400" />
              System Monitor
            </CardTitle>
            <CardDescription className="text-neutral-500">Real-time performance metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "CPU Usage", value: 42, color: "emerald" },
              { label: "Memory", value: 68, color: "cyan" },
              { label: "Network I/O", value: 34, color: "emerald" },
            ].map((metric, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400">{metric.label}</span>
                  <span className="text-white font-mono">{metric.value}%</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
                  <div
                    className={`h-full bg-gradient-to-r ${metric.color === "emerald" ? "from-emerald-500 to-emerald-400" : "from-cyan-500 to-cyan-400"} rounded-full relative`}
                    style={{ width: `${metric.value}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Active Sessions */}
        <Card className="col-span-2 bg-[#0A0E1A] border-emerald-500/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold text-white">Active Sessions</CardTitle>
                <CardDescription className="text-neutral-500">Current user activity</CardDescription>
              </div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 font-mono">
                <div className="size-2 bg-emerald-400 rounded-full mr-2 animate-pulse" />
                Live
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { user: "Dr. Sarah Johnson", action: "Analyzing dataset", dataset: "Clinical Trial Data Q4 2024", time: "2m 34s", status: "active" },
                { user: "Michael Chen", action: "Downloading", dataset: "Pharmacology Research Archive", time: "15m 12s", status: "active" },
                { user: "Dr. Emily Rodriguez", action: "Query running", dataset: "Patient Demographics Dataset", time: "1m 05s", status: "processing" },
                { user: "James Wilson", action: "Completed", dataset: "Lab Results Q3 2024", time: "23m 45s", status: "completed" },
              ].map((session, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/10 hover:border-emerald-500/20 transition-all">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
                    {session.user.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      <span className="text-emerald-400">{session.user}</span> • {session.action}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">{session.dataset}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-neutral-400 font-mono">{session.time}</span>
                    <div className={`size-2 rounded-full ${
                      session.status === "active" ? "bg-emerald-400 animate-pulse" :
                      session.status === "processing" ? "bg-cyan-400 animate-pulse" :
                      "bg-neutral-600"
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Access Log */}
      <Card className="mt-6 bg-[#0A0E1A] border-emerald-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                <Terminal className="size-5 text-emerald-400" />
                Data Access Log
              </CardTitle>
              <CardDescription className="text-neutral-500">Recent dataset operations</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10">
              View All Logs
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg bg-black/30 border border-emerald-500/10 p-4 font-mono text-sm">
            <div className="space-y-2">
              {[
                { time: "14:23:45", level: "INFO", message: "Dataset 'Clinical_Trial_Q4' accessed by user_847", status: "success" },
                { time: "14:22:18", level: "INFO", message: "Query executed: SELECT * FROM pharmacology WHERE date > '2024-01'", status: "success" },
                { time: "14:21:03", level: "WARN", message: "Rate limit approached for user_234 (89/100 requests)", status: "warning" },
                { time: "14:19:47", level: "INFO", message: "Export completed: Patient_Demographics.csv (2.4 MB)", status: "success" },
                { time: "14:18:22", level: "INFO", message: "New dataset uploaded: Lab_Results_Q3_2024.parquet", status: "success" },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-4 text-xs">
                  <span className="text-neutral-600">[{log.time}]</span>
                  <span className={
                    log.level === "INFO" ? "text-emerald-400" :
                    log.level === "WARN" ? "text-amber-400" :
                    "text-red-400"
                  }>{log.level}</span>
                  <span className="text-neutral-400 flex-1">{log.message}</span>
                  {log.status === "success" && <CheckCircle2 className="size-4 text-emerald-500" />}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </UX7Layout>
  )
}

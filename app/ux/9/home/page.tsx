import { UX9Layout } from "@/components/ux9-layout"
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
  Sparkles,
  Zap,
  Rocket,
  Star,
  Award,
} from "lucide-react"

export default function UX9DashboardPage() {
  return (
    <UX9Layout>
      {/* Hero Section */}
      <div className="mb-10 relative">
        <div className="relative rounded-3xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-10 text-white overflow-hidden shadow-2xl">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <Badge className="bg-yellow-400 text-yellow-900 hover:bg-yellow-300 font-black px-4 py-1.5 text-sm">
                <Sparkles className="size-4 mr-1.5" />
                Welcome Back!
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 font-bold">
                🔥 3 New Updates
              </Badge>
            </div>
            <h1 className="text-5xl font-black mb-4">
              Hey John! Ready to Explore? 🚀
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl font-medium">
              You've got <span className="font-black text-yellow-300">1,284</span> datasets at your fingertips. Let's make something awesome today!
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-yellow-400 hover:text-purple-900 font-black text-base h-14 px-8 shadow-2xl">
                <Rocket className="mr-2 size-5" />
                Start Exploring
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm font-bold h-14 px-8">
                <Zap className="mr-2 size-5" />
                AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-6 mb-10">
        {[
          { label: "Total Datasets", value: "1,284", change: "+12%", icon: Database, gradient: "from-blue-500 to-cyan-500", emoji: "📊" },
          { label: "Pending Tasks", value: "8", change: "+2", icon: Clock, gradient: "from-purple-500 to-pink-500", emoji: "⏰" },
          { label: "Completed", value: "23", change: "+8%", icon: CheckCircle2, gradient: "from-green-500 to-emerald-500", emoji: "✅" },
          { label: "Team Members", value: "142", change: "+5%", icon: Users, gradient: "from-amber-500 to-orange-500", emoji: "👥" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-2 bg-white overflow-hidden group">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                    <span className="text-3xl">{stat.emoji}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-0 font-bold">
                    <TrendingUp className="size-3 mr-1" />
                    {stat.change}
                  </Badge>
                </div>
                <p className="text-sm font-bold text-neutral-600 mb-2 uppercase tracking-wide">{stat.label}</p>
                <p className="text-4xl font-black text-neutral-900">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-3 gap-8">
        {/* Quick Actions */}
        <Card className="border-0 shadow-xl bg-gradient-to-br from-yellow-400 to-orange-400 text-yellow-900 overflow-hidden">
          <CardHeader className="relative">
            <div className="absolute top-0 right-0 text-8xl opacity-10">⚡</div>
            <CardTitle className="text-2xl font-black relative z-10">Quick Actions</CardTitle>
            <CardDescription className="font-bold text-yellow-900/70 relative z-10">Get things done fast!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 relative z-10">
            {[
              { icon: "🔍", label: "Search Datasets", color: "from-blue-500 to-cyan-500" },
              { icon: "⚡", label: "Run Analysis", color: "from-purple-500 to-pink-500" },
              { icon: "📄", label: "View Reports", color: "from-green-500 to-emerald-500" },
            ].map((action, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-4 p-4 rounded-2xl bg-white hover:bg-yellow-50 shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
              >
                <div className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.color} shadow-md group-hover:rotate-12 transition-transform`}>
                  <span className="text-2xl">{action.icon}</span>
                </div>
                <span className="font-black text-neutral-900">{action.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="col-span-2 border-0 shadow-xl bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-black text-neutral-900">Live Activity 🎯</CardTitle>
                <CardDescription className="font-semibold">What's happening right now</CardDescription>
              </div>
              <div className="flex size-3 items-center justify-center bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { user: "Sarah Johnson", action: "just downloaded", dataset: "Clinical Trial Data", time: "2m", color: "from-blue-500 to-cyan-500", emoji: "⬇️" },
              { user: "Michael Chen", action: "updated", dataset: "Pharmacology Research", time: "15m", color: "from-purple-500 to-pink-500", emoji: "✏️" },
              { user: "Emily Rodriguez", action: "starred", dataset: "Patient Demographics", time: "1h", color: "from-amber-500 to-orange-500", emoji: "⭐" },
              { user: "James Wilson", action: "completed", dataset: "Lab Results Analysis", time: "2h", color: "from-green-500 to-emerald-500", emoji: "✅" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50 hover:shadow-lg transition-all">
                <div className={`flex size-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${activity.color} text-white font-black shadow-md`}>
                  {activity.user.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-900">
                    <span className="text-neutral-700">{activity.user}</span> {activity.action}
                  </p>
                  <p className="text-sm text-neutral-600 font-medium truncate">{activity.dataset}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{activity.emoji}</span>
                  <span className="text-xs text-neutral-500 font-bold">{activity.time}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Datasets */}
      <Card className="mt-8 border-0 shadow-xl bg-white">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-black text-neutral-900">🔥 Trending Datasets</CardTitle>
              <CardDescription className="font-semibold">Most popular this week</CardDescription>
            </div>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black shadow-lg">
              <Award className="mr-2 size-4" />
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { rank: 1, name: "Clinical Trial Data Q4 2024", category: "Clinical Trials", access: 847, trend: "+23%", emoji: "💊", color: "from-blue-500 to-cyan-500" },
              { rank: 2, name: "Pharmacology Research Archive", category: "Pharmacology", access: 692, trend: "+18%", emoji: "🧪", color: "from-purple-500 to-pink-500" },
              { rank: 3, name: "Patient Demographics Study 2024", category: "Demographics", access: 534, trend: "+12%", emoji: "👥", color: "from-green-500 to-emerald-500" },
              { rank: 4, name: "Lab Results Dataset Q3", category: "Lab Results", access: 421, trend: "+8%", emoji: "📊", color: "from-amber-500 to-orange-500" },
            ].map((dataset) => (
              <div key={dataset.rank} className="flex items-center gap-6 p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50 hover:shadow-xl transition-all hover:scale-102 group">
                <div className={`flex size-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${dataset.color} text-white font-black text-2xl shadow-lg group-hover:rotate-6 transition-transform`}>
                  {dataset.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-yellow-900 border-0 font-black">
                      #{dataset.rank}
                    </Badge>
                    <h3 className="text-lg font-black text-neutral-900">{dataset.name}</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline" className="font-bold">{dataset.category}</Badge>
                    <span className="text-sm font-bold text-neutral-600">{dataset.access.toLocaleString()} accesses</span>
                    <Badge className="bg-green-100 text-green-700 border-0 font-bold">
                      <TrendingUp className="size-3 mr-1" />
                      {dataset.trend}
                    </Badge>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-black shadow-lg">
                  <Star className="mr-2 size-4" />
                  View
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </UX9Layout>
  )
}

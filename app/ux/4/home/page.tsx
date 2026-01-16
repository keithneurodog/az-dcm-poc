import { UX4Layout } from "@/app/ux/_components/ux4-layout"
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
  MoreVertical,
  Search,
  Sparkles,
  ArrowRight,
} from "lucide-react"

export default function UX4DashboardPage() {
  return (
    <UX4Layout>
      {/* Hero Section */}
      <div className="mb-8 -mx-8 -mt-8 bg-gradient-to-br from-[#830051] via-[#9a0060] to-[#830051] px-8 py-12 text-white">
        <div className="max-w-4xl">
          <Badge className="mb-4 bg-[#F0AB00] text-[#830051] hover:bg-[#F0AB00]/90">
            Welcome back, John
          </Badge>
          <h1 className="text-3xl font-bold mb-3">
            Explore Your Data with AI-Powered Insights
          </h1>
          <p className="text-white/80 mb-6 text-lg">
            Search through 1,284 datasets or ask our AI assistant to help you find exactly what you need
          </p>
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-xl">
              <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Search datasets or ask a question..."
                className="pl-12 h-12 bg-white/10 border-white/20 text-white placeholder:text-white/60"
              />
            </div>
            <Button size="lg" className="bg-[#F0AB00] hover:bg-[#F0AB00]/90 text-[#830051] font-semibold h-12">
              <Sparkles className="mr-2 size-5" />
              Ask AI Assistant
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 h-12">
              Browse Datasets
              <ArrowRight className="ml-2 size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid with Colorful Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white/90">Total Datasets</p>
              <Database className="size-5 text-white/80" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">1,284</p>
              <span className="flex items-center text-xs font-medium bg-white/20 px-2 py-0.5 rounded">
                <TrendingUp className="size-3 mr-1" />
                +12%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white/90">Pending Requests</p>
              <Clock className="size-5 text-white/80" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">8</p>
              <span className="flex items-center text-xs font-medium bg-white/20 px-2 py-0.5 rounded">
                <TrendingUp className="size-3 mr-1" />
                +2
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white/90">Approved This Month</p>
              <CheckCircle2 className="size-5 text-white/80" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">23</p>
              <span className="flex items-center text-xs font-medium bg-white/20 px-2 py-0.5 rounded">
                <TrendingUp className="size-3 mr-1" />
                +8%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-white/90">Active Users</p>
              <Users className="size-5 text-white/80" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold">142</p>
              <span className="flex items-center text-xs font-medium bg-white/20 px-2 py-0.5 rounded">
                <TrendingDown className="size-3 mr-1" />
                -3%
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Activity Table */}
        <Card className="col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Recent Activity</CardTitle>
                <CardDescription>Latest dataset access and modifications</CardDescription>
              </div>
              <Button variant="outline" size="sm" className="text-xs">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Dataset</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">User</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Action</th>
                    <th className="px-4 py-3 text-left font-semibold text-neutral-700">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[
                    { dataset: "Clinical Trial Data Q4 2024", user: "Dr. Sarah Johnson", action: "Downloaded", time: "2 min ago", actionColor: "text-blue-600" },
                    { dataset: "Pharmacology Research Archive", user: "Michael Chen", action: "Modified", time: "15 min ago", actionColor: "text-amber-600" },
                    { dataset: "Patient Demographics Dataset", user: "Dr. Emily Rodriguez", action: "Viewed", time: "1 hour ago", actionColor: "text-neutral-600" },
                    { dataset: "Lab Results Q3 2024", user: "James Wilson", action: "Downloaded", time: "2 hours ago", actionColor: "text-blue-600" },
                    { dataset: "Clinical Trial Protocols", user: "Lisa Anderson", action: "Uploaded", time: "3 hours ago", actionColor: "text-green-600" },
                  ].map((activity, i) => (
                    <tr key={i} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 font-medium text-neutral-900">{activity.dataset}</td>
                      <td className="px-4 py-3 text-neutral-600">{activity.user}</td>
                      <td className="px-4 py-3">
                        <span className={`font-medium ${activity.actionColor}`}>{activity.action}</span>
                      </td>
                      <td className="px-4 py-3 text-neutral-500">{activity.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats & AI Assistant */}
        <div className="space-y-6">
          <Card className="border-2 border-[#F0AB00] bg-gradient-to-br from-[#F0AB00]/5 to-[#F0AB00]/10">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Sparkles className="size-5 text-[#F0AB00]" />
                AI Assistant
              </CardTitle>
              <CardDescription>Get intelligent help with your queries</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full bg-[#830051] hover:bg-[#830051]/90 h-11">
                <Sparkles className="mr-2 size-4" />
                Start Conversation
              </Button>
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-600">Quick actions:</p>
                {["Find clinical trial data", "Request dataset access", "View usage analytics"].map((action) => (
                  <button
                    key={action}
                    className="w-full text-left text-sm px-3 py-2 rounded border border-neutral-200 hover:border-[#830051] hover:bg-[#830051]/5 transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "Access Request - Clinical Data", user: "Dr. Johnson", badge: "Urgent", color: "destructive" },
                  { title: "Dataset Modification Request", user: "M. Chen", badge: "Normal", color: "secondary" },
                  { title: "New User Registration", user: "E. Rodriguez", badge: "Normal", color: "secondary" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between border-l-4 border-[#830051] pl-3 py-2 bg-neutral-50 rounded-r">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{item.title}</p>
                      <p className="text-xs text-neutral-600">{item.user}</p>
                    </div>
                    <Badge variant={item.color as "destructive" | "secondary"} className="text-xs ml-2">
                      {item.badge}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="link" className="w-full mt-3 text-[#830051] p-0 h-auto">
                View all pending items
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Top Datasets Table */}
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold">Top Datasets by Access</CardTitle>
              <CardDescription>Most accessed datasets this month</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="text-xs">
              Export Report
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Rank</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Dataset Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Category</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Access Count</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Unique Users</th>
                  <th className="px-4 py-3 text-left font-semibold text-neutral-700">Trend</th>
                  <th className="px-4 py-3 text-right font-semibold text-neutral-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {[
                  { rank: 1, name: "Clinical Trial Data Q4 2024", category: "Clinical Trials", access: 847, users: 67, trend: "+23%", trendColor: "text-green-600" },
                  { rank: 2, name: "Pharmacology Research Archive", category: "Pharmacology", access: 692, users: 54, trend: "+18%", trendColor: "text-green-600" },
                  { rank: 3, name: "Patient Demographics Study 2024", category: "Demographics", access: 534, users: 42, trend: "+12%", trendColor: "text-green-600" },
                  { rank: 4, name: "Lab Results Dataset Q3", category: "Lab Results", access: 421, users: 38, trend: "+8%", trendColor: "text-green-600" },
                  { rank: 5, name: "Treatment Outcomes Analysis", category: "Clinical Trials", access: 389, users: 31, trend: "-5%", trendColor: "text-red-600" },
                ].map((dataset) => (
                  <tr key={dataset.rank} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex size-8 items-center justify-center bg-[#F0AB00]/10 text-[#830051] font-bold text-sm rounded">
                        {dataset.rank}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-neutral-900">{dataset.name}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-xs">{dataset.category}</Badge>
                    </td>
                    <td className="px-4 py-3 font-semibold text-neutral-900">{dataset.access.toLocaleString()}</td>
                    <td className="px-4 py-3 text-neutral-600">{dataset.users}</td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center text-xs font-medium ${dataset.trendColor}`}>
                        {dataset.trend.startsWith('+') ? <TrendingUp className="size-3 mr-1" /> : <TrendingDown className="size-3 mr-1" />}
                        {dataset.trend}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 hover:bg-neutral-100 rounded">
                        <MoreVertical className="size-4 text-neutral-500" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </UX4Layout>
  )
}

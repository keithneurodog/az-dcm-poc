import { UX3Layout } from "@/components/ux3-layout"
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
  MoreVertical,
} from "lucide-react"

export default function UX3DashboardPage() {
  return (
    <UX3Layout>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">Dashboard</h1>
        <p className="text-sm text-neutral-600">
          Overview of your data portal activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <Card className="border-l-4 border-l-[#830051]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-neutral-600">Total Datasets</p>
              <Database className="size-4 text-[#830051]" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-neutral-900">1,284</p>
              <span className="flex items-center text-xs font-medium text-green-600">
                <TrendingUp className="size-3 mr-1" />
                +12%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#F0AB00]">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-neutral-600">Pending Requests</p>
              <Clock className="size-4 text-[#F0AB00]" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-neutral-900">8</p>
              <span className="flex items-center text-xs font-medium text-amber-600">
                <TrendingUp className="size-3 mr-1" />
                +2
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-neutral-600">Approved This Month</p>
              <CheckCircle2 className="size-4 text-green-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-neutral-900">23</p>
              <span className="flex items-center text-xs font-medium text-green-600">
                <TrendingUp className="size-3 mr-1" />
                +8%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-neutral-600">Active Users</p>
              <Users className="size-4 text-blue-600" />
            </div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-neutral-900">142</p>
              <span className="flex items-center text-xs font-medium text-red-600">
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
            <div className="border">
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

        {/* Quick Actions & Pending */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full bg-[#830051] hover:bg-[#830051]/90 justify-start">
                <Database className="mr-2 size-4" />
                Upload Dataset
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle2 className="mr-2 size-4" />
                Review Requests
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="mr-2 size-4" />
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: "Access Request - Clinical Data", user: "Dr. Johnson", badge: "Urgent" },
                  { title: "Dataset Modification Request", user: "M. Chen", badge: "Normal" },
                  { title: "New User Registration", user: "E. Rodriguez", badge: "Normal" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start justify-between border-l-2 border-[#F0AB00] pl-3 py-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 truncate">{item.title}</p>
                      <p className="text-xs text-neutral-600">{item.user}</p>
                    </div>
                    <Badge variant={item.badge === "Urgent" ? "destructive" : "secondary"} className="text-xs ml-2">
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
          <div className="border">
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
                  { rank: 1, name: "Clinical Trial Data Q4 2024", category: "Clinical Trials", access: 847, users: 67, trend: "+23%" },
                  { rank: 2, name: "Pharmacology Research Archive", category: "Pharmacology", access: 692, users: 54, trend: "+18%" },
                  { rank: 3, name: "Patient Demographics Study 2024", category: "Demographics", access: 534, users: 42, trend: "+12%" },
                  { rank: 4, name: "Lab Results Dataset Q3", category: "Lab Results", access: 421, users: 38, trend: "+8%" },
                  { rank: 5, name: "Treatment Outcomes Analysis", category: "Clinical Trials", access: 389, users: 31, trend: "-5%" },
                ].map((dataset) => (
                  <tr key={dataset.rank} className="hover:bg-neutral-50">
                    <td className="px-4 py-3">
                      <div className="flex size-6 items-center justify-center bg-[#F0AB00]/10 text-[#830051] font-bold text-xs">
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
                      <span className={`flex items-center text-xs font-medium ${dataset.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {dataset.trend.startsWith('+') ? <TrendingUp className="size-3 mr-1" /> : <TrendingDown className="size-3 mr-1" />}
                        {dataset.trend}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 hover:bg-neutral-100">
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
    </UX3Layout>
  )
}

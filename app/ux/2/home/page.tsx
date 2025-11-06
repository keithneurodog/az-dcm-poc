import { UX2Layout } from "@/components/ux2-layout"
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
  Database,
  Clock,
  CheckCircle2,
  Users,
  TrendingUp,
  Search,
  FileStack,
  Sparkles,
  ArrowUpRight,
  AlertCircle,
  BarChart3,
  Activity,
} from "lucide-react"

export default function UX2DashboardPage() {
  return (
    <UX2Layout>
      {/* Hero Section */}
      <div className="-m-6 mb-8 bg-gradient-to-br from-[#a8006b] to-[#830051] px-6 py-12 shadow-lg rounded-b-lg">
        <div className="mx-auto max-w-7xl">
          <div className="mb-3 inline-block rounded-lg border border-[#F0AB00]/30 bg-[#F0AB00]/10 px-3 py-1.5">
            <span className="text-xs font-medium text-[#F0AB00]">
              Dashboard
            </span>
          </div>
          <h1 className="mb-3 text-3xl font-bold text-white">
            Welcome back, John
          </h1>
          <p className="text-base text-white/80">
            Manage your data, track requests, and explore insights
          </p>
        </div>
      </div>

      {/* Bento Box Grid */}
      <div className="grid gap-4 md:grid-cols-12">
        {/* Stats Row - 4 equal columns */}
        <Card className="md:col-span-3 rounded-lg border border-neutral-200 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Database className="size-6 text-[#830051]" />
              <div className="rounded-lg bg-emerald-50 px-2.5 py-1">
                <span className="text-xs font-medium text-emerald-700">+12%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">1,284</div>
            <p className="mt-1 text-sm text-neutral-600">
              Total Datasets
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 rounded-lg border border-neutral-200 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Clock className="size-6 text-[#F0AB00]" />
              <div className="rounded-lg bg-amber-50 px-2.5 py-1">
                <span className="text-xs font-medium text-amber-700">Active</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">8</div>
            <p className="mt-1 text-sm text-neutral-600">
              Pending Requests
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 rounded-lg border border-neutral-200 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CheckCircle2 className="size-6 text-green-600" />
              <div className="rounded-lg bg-green-50 px-2.5 py-1">
                <span className="text-xs font-medium text-green-700">+8%</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">23</div>
            <p className="mt-1 text-sm text-neutral-600">
              Approved This Month
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 rounded-lg border border-neutral-200 shadow-brutal hover:shadow-brutal-lg hover:-translate-y-0.5 transition-all">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Users className="size-6 text-blue-600" />
              <div className="rounded-lg bg-blue-50 px-2.5 py-1">
                <span className="text-xs font-medium text-blue-700">6 Dept</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-neutral-900">142</div>
            <p className="mt-1 text-sm text-neutral-600">
              Team Members
            </p>
          </CardContent>
        </Card>

        {/* Large Featured Card - Search */}
        <Card className="md:col-span-8 rounded-lg border border-neutral-200 shadow-brutal bg-gradient-to-br from-neutral-700 to-neutral-600 text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Explore Datasets</CardTitle>
                <CardDescription className="text-neutral-300 mt-1">
                  Search through 1,284 available datasets
                </CardDescription>
              </div>
              <Search className="size-8 text-[#F0AB00]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Search for datasets, topics, or keywords..."
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-lg"
              />
              <Button className="bg-[#F0AB00] hover:bg-[#F0AB00]/90 text-[#830051] font-semibold px-6 rounded-lg">
                Search
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-neutral-400 font-medium">
                Popular:
              </span>
              {["Clinical Trials", "Pharmacology", "Patient Data", "Research"].map((tag) => (
                <Badge key={tag} variant="outline" className="border-white/30 text-white hover:bg-white/10 rounded-lg">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Card */}
        <Card className="md:col-span-4 rounded-lg border border-neutral-200 shadow-brutal bg-gradient-to-br from-[#F0AB00] to-[#e8a700]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-neutral-900 font-bold">
              <TrendingUp className="size-5" />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { label: "New datasets", value: "+15", color: "bg-green-600" },
              { label: "Requests approved", value: "+23", color: "bg-blue-600" },
              { label: "Team growth", value: "+8", color: "bg-purple-600" },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-white/50 p-3">
                <span className="font-medium text-sm">{item.label}</span>
                <div className={`${item.color} rounded-lg px-3 py-1 text-white text-sm font-semibold`}>
                  {item.value}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* My Requests */}
        <Card className="md:col-span-6 rounded-lg border border-neutral-200 shadow-brutal">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-bold">My Requests</CardTitle>
              <FileStack className="size-5 text-[#830051]" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              { title: "Clinical Trial Data 2024", status: "Pending", color: "amber" },
              { title: "Research Archive Q3", status: "Approved", color: "green" },
              { title: "Lab Results Dataset", status: "Action Required", color: "red" },
            ].map((request, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3 hover:border-[#830051] transition-colors">
                <div>
                  <p className="font-medium text-sm">{request.title}</p>
                  <p className="text-xs text-neutral-500 mt-0.5">{request.status}</p>
                </div>
                <ArrowUpRight className="size-4 text-neutral-400" />
              </div>
            ))}
            <Button variant="outline" className="w-full border border-neutral-300 font-medium hover:bg-neutral-50 rounded-lg">
              View All Requests
            </Button>
          </CardContent>
        </Card>

        {/* AI Assistant */}
        <Card className="md:col-span-6 border border-[#830051] shadow-brutal bg-gradient-to-br from-[#930060] to-[#a8006b] rounded-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white font-bold">
              <Sparkles className="size-5 text-[#F0AB00]" />
              AI Assistant
            </CardTitle>
            <CardDescription className="text-white/80">
              Get intelligent help with your data queries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full bg-[#F0AB00] hover:bg-[#F0AB00]/90 text-[#830051] font-semibold h-11 rounded-lg">
              <Sparkles className="mr-2 size-4" />
              Start Conversation
            </Button>
            <div className="mt-4 space-y-2">
              <p className="text-xs text-white/70 font-medium">Suggested:</p>
              {["Find clinical data", "Request access", "View analytics"].map((suggestion) => (
                <button
                  key={suggestion}
                  className="block w-full text-left text-sm text-white/90 hover:text-white border border-white/20 hover:border-white/40 px-3 py-2 rounded-lg transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Analytics Preview */}
        <Card className="md:col-span-12 border border-neutral-200 shadow-brutal rounded-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-bold">Analytics Overview</CardTitle>
                <CardDescription>Dataset usage and trends</CardDescription>
              </div>
              <BarChart3 className="size-7 text-[#830051]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {[
                { label: "Total Downloads", value: "2,847", trend: "+15%" },
                { label: "Active Users", value: "892", trend: "+8%" },
                { label: "Avg. Response Time", value: "2.3h", trend: "-12%" },
                { label: "Satisfaction Rate", value: "94%", trend: "+3%" },
              ].map((stat, i) => (
                <div key={i} className="border-l-4 border-[#F0AB00] pl-4 py-2 rounded-sm">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">{stat.value}</span>
                    <span className="text-sm font-semibold text-green-600">{stat.trend}</span>
                  </div>
                  <p className="text-xs font-medium text-neutral-600 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </UX2Layout>
  )
}

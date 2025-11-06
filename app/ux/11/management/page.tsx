import { UX11Layout } from "@/components/ux11-layout"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MoreVertical,
  Download,
  Upload,
  Trash2,
  Lock,
  Unlock,
  Users,
  Calendar,
  HardDrive,
  TrendingUp,
  Plus,
  Sparkles,
} from "lucide-react"

export default function UX11ManagementPage() {
  return (
    <UX11Layout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-1 w-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 font-semibold">
            Data Management
          </Badge>
        </div>
        <h1 className="text-5xl font-serif text-neutral-900 mb-3 tracking-wide">
          Manage Your Data
        </h1>
        <p className="text-xl text-neutral-600">
          Organize and control your datasets
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-3">
          <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold shadow-lg">
            <Plus className="mr-2 size-4" />
            New Dataset
          </Button>
          <Button variant="outline" className="border-2 border-neutral-200 hover:bg-neutral-50 font-semibold">
            <Upload className="mr-2 size-4" />
            Upload
          </Button>
          <Button variant="outline" className="border-2 border-neutral-200 hover:bg-neutral-50 font-semibold">
            <Download className="mr-2 size-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total Size", value: "42.8 TB", icon: HardDrive, gradient: "from-blue-500 to-cyan-500" },
          { label: "Active Users", value: "142", icon: Users, gradient: "from-purple-500 to-pink-500" },
          { label: "This Month", value: "+284", icon: TrendingUp, gradient: "from-emerald-500 to-teal-500" },
          { label: "Last Updated", value: "2m ago", icon: Calendar, gradient: "from-amber-500 to-orange-500" },
        ].map((stat, i) => {
          const Icon = stat.icon
          return (
            <Card key={i} className="border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 bg-white group">
              <CardContent className="pt-6">
                <div className={`flex size-14 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="size-6 text-white" />
                </div>
                <p className="text-xs font-bold text-neutral-500 mb-1 uppercase tracking-wider">{stat.label}</p>
                <p className="text-3xl font-bold text-neutral-900">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Dataset Management Table */}
      <Card className="border-0 shadow-xl bg-white">
        <CardHeader className="border-b border-neutral-100">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-serif text-neutral-900">Your Datasets</CardTitle>
              <CardDescription className="text-neutral-600 font-medium">Manage access and permissions</CardDescription>
            </div>
            <Button variant="outline" className="border-2 border-purple-200 text-purple-600 hover:bg-purple-50 font-semibold">
              <Sparkles className="mr-2 size-4" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {[
              {
                name: "Clinical Trial Data Q4 2024",
                category: "Clinical Trials",
                size: "2.4 GB",
                modified: "2 hours ago",
                access: "Restricted",
                users: 24,
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                name: "Pharmacology Research Dataset",
                category: "Pharmacology",
                size: "1.8 GB",
                modified: "1 day ago",
                access: "Public",
                users: 87,
                gradient: "from-purple-500 to-pink-500",
              },
              {
                name: "Patient Demographics Study 2024",
                category: "Demographics",
                size: "890 MB",
                modified: "3 days ago",
                access: "Restricted",
                users: 15,
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                name: "Lab Results Dataset Q3",
                category: "Lab Results",
                size: "1.2 GB",
                modified: "5 days ago",
                access: "Confidential",
                users: 8,
                gradient: "from-amber-500 to-orange-500",
              },
              {
                name: "Genomic Research Data 2024",
                category: "Genomics",
                size: "5.7 GB",
                modified: "1 week ago",
                access: "Confidential",
                users: 12,
                gradient: "from-red-500 to-pink-500",
              },
              {
                name: "Treatment Outcomes Analysis",
                category: "Clinical Trials",
                size: "3.1 GB",
                modified: "2 weeks ago",
                access: "Public",
                users: 156,
                gradient: "from-cyan-500 to-blue-500",
              },
            ].map((dataset, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 rounded-xl bg-white border border-neutral-200 hover:border-purple-200 hover:shadow-lg transition-all group"
              >
                <div className={`flex size-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${dataset.gradient} text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-neutral-900">{dataset.name}</h3>
                    {dataset.access === "Confidential" ? (
                      <Lock className="size-4 text-red-500" />
                    ) : dataset.access === "Restricted" ? (
                      <Lock className="size-4 text-amber-500" />
                    ) : (
                      <Unlock className="size-4 text-emerald-500" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge className="bg-neutral-100 text-neutral-700 font-semibold">{dataset.category}</Badge>
                    <Badge
                      className={
                        dataset.access === "Public"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold"
                          : dataset.access === "Restricted"
                          ? "bg-amber-50 text-amber-700 border-amber-200 font-semibold"
                          : "bg-red-50 text-red-700 border-red-200 font-semibold"
                      }
                    >
                      {dataset.access}
                    </Badge>
                    <span className="text-neutral-600 font-medium">{dataset.size}</span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-600 font-medium flex items-center gap-1">
                      <Users className="size-3" />
                      {dataset.users}
                    </span>
                    <span className="text-neutral-500">•</span>
                    <span className="text-neutral-500">{dataset.modified}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className={`bg-gradient-to-r ${dataset.gradient} hover:opacity-90 text-white font-bold shadow-md`}
                  >
                    Manage
                  </Button>
                  <Button size="sm" variant="outline" className="border-2 border-neutral-200 hover:bg-neutral-50">
                    <MoreVertical className="size-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Cards */}
      <div className="grid grid-cols-3 gap-6 mt-6">
        {[
          {
            title: "Archive Old Data",
            description: "Free up space by archiving datasets",
            icon: HardDrive,
            gradient: "from-slate-500 to-neutral-600",
          },
          {
            title: "Bulk Operations",
            description: "Manage multiple datasets at once",
            icon: Upload,
            gradient: "from-blue-500 to-purple-500",
          },
          {
            title: "Access Control",
            description: "Configure permissions and security",
            icon: Lock,
            gradient: "from-amber-500 to-orange-500",
          },
        ].map((action, i) => {
          const Icon = action.icon
          return (
            <Card key={i} className="border-0 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 bg-white group">
              <CardContent className="pt-6">
                <div className={`flex size-14 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="size-6 text-white" />
                </div>
                <h3 className="font-bold text-neutral-900 mb-2">{action.title}</h3>
                <p className="text-sm text-neutral-600 font-medium mb-4">{action.description}</p>
                <Button className={`w-full bg-gradient-to-r ${action.gradient} hover:opacity-90 text-white font-bold shadow-md`}>
                  Configure
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </UX11Layout>
  )
}

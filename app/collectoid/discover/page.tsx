"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import {
  Sparkles,
  FolderSearch,
  Search,
  ArrowRight,
  Zap,
  Users,
  Database,
  Shield,
  Clock,
  CheckCircle2,
  TrendingUp,
} from "lucide-react"

export default function DiscoverPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()
  const [quickSearch, setQuickSearch] = useState("")

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (quickSearch.trim()) {
      router.push(`/collectoid/collections?search=${encodeURIComponent(quickSearch)}`)
    }
  }

  return (
    <div className="py-8">
      {/* Hero Section */}
      <div className={cn(
        "rounded-3xl p-12 border bg-gradient-to-br mb-12",
        scheme.bg,
        scheme.bgHover,
        `border-${scheme.from.replace("from-", "").replace("-500", "-100")}/50`
      )}>
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className={cn("size-2 rounded-full animate-pulse", scheme.from.replace("from-", "bg-"))} />
          <span className="text-xs font-light text-neutral-600 uppercase tracking-wider">
            End User Discovery
          </span>
        </div>
        <h1 className="text-5xl font-extralight text-neutral-900 mb-4 text-center tracking-tight">
          Discover Clinical Data
        </h1>
        <p className="text-lg font-light text-neutral-600 text-center max-w-2xl mx-auto mb-8">
          Find the data you need to power your research. Browse curated collections or let AI help you discover relevant datasets.
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 max-w-3xl mx-auto">
          {[
            { label: "Collections", value: "24", icon: FolderSearch },
            { label: "Datasets", value: "1,200+", icon: Database },
            { label: "Active Users", value: "850", icon: Users },
            { label: "Avg Access Time", value: "2.1 days", icon: Clock },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 text-center border border-white/50">
                <Icon className={cn("size-5 mx-auto mb-2", scheme.from.replace("from-", "text-"))} />
                <p className="text-2xl font-light text-neutral-900 mb-1">{stat.value}</p>
                <p className="text-xs font-light text-neutral-500">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* How Would You Like to Start */}
      <div className="mb-12">
        <h2 className="text-2xl font-light text-neutral-900 mb-2 text-center">
          How would you like to start?
        </h2>
        <p className="text-base font-light text-neutral-600 text-center mb-8">
          Choose your preferred discovery method
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 xl:gap-6 max-w-5xl mx-auto">
          {/* AI-Assisted Discovery Card */}
          <Card
            className="border-neutral-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            onClick={() => router.push("/collectoid/discover/ai")}
          >
            <CardContent className="p-8">
              <div className={cn(
                "flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br mb-6",
                scheme.from,
                scheme.to
              )}>
                <Sparkles className="size-8 text-white" />
              </div>
              <h3 className="text-xl font-normal text-neutral-900 mb-2">
                AI-Assisted Discovery
              </h3>
              <p className="text-sm font-light text-neutral-600 mb-6">
                Describe what you&apos;re looking for in natural language and let AI help you find relevant collections and datasets.
              </p>
              <div className="flex items-center gap-3 mb-6">
                {["Natural Language", "Smart Recommendations", "Intent Matching"].map((tag) => (
                  <Badge key={tag} variant="outline" className="font-light text-xs border-neutral-200">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                className={cn(
                  "w-full h-12 rounded-2xl font-light bg-gradient-to-r text-white shadow-lg group-hover:shadow-xl transition-all",
                  scheme.from,
                  scheme.to
                )}
              >
                Start AI-Assisted Search
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          {/* Browse Collections Card */}
          <Card
            className="border-neutral-200 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group"
            onClick={() => router.push("/collectoid/collections")}
          >
            <CardContent className="p-8">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-neutral-100 mb-6">
                <FolderSearch className="size-8 text-neutral-700" />
              </div>
              <h3 className="text-xl font-normal text-neutral-900 mb-2">
                Browse Collections
              </h3>
              <p className="text-sm font-light text-neutral-600 mb-6">
                Explore curated data collections organized by therapeutic area, study type, and intended use.
              </p>
              <div className="flex items-center gap-3 mb-6">
                {["Filters", "Intent-Based", "DCM Curated"].map((tag) => (
                  <Badge key={tag} variant="outline" className="font-light text-xs border-neutral-200">
                    {tag}
                  </Badge>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full h-12 rounded-2xl font-light border-neutral-200 hover:bg-neutral-50 transition-all"
              >
                Browse Collections
                <ArrowRight className="size-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Search (Power Users) */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden mb-12">
        <CardContent className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex size-12 items-center justify-center rounded-xl bg-neutral-100">
              <Zap className="size-6 text-neutral-700" />
            </div>
            <div>
              <h3 className="text-lg font-normal text-neutral-900">Quick Search (Power Users)</h3>
              <p className="text-sm font-light text-neutral-600">
                Know exactly what you&apos;re looking for? Search by dataset code or keyword.
              </p>
            </div>
          </div>
          <form onSubmit={handleQuickSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-neutral-400" />
              <Input
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                placeholder="DCODE-042, ctDNA, NSCLC, Phase III..."
                className="pl-12 h-12 rounded-xl border-neutral-200 font-light"
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              className="h-12 px-6 rounded-xl font-light border-neutral-200"
            >
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Why Collections-Aware Discovery */}
      <div className="mb-12">
        <h2 className="text-2xl font-light text-neutral-900 mb-2 text-center">
          Why Collections-Aware Discovery?
        </h2>
        <p className="text-base font-light text-neutral-600 text-center mb-8">
          Benefit from expert curation and transparent access controls
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 xl:gap-6">
          {[
            {
              icon: CheckCircle2,
              title: "90/10 Instant Access",
              description: "90% of users get instant access to 90% of data. Know your access status before you request.",
              color: "text-green-600",
              bg: "bg-green-50",
            },
            {
              icon: Shield,
              title: "Transparent Restrictions",
              description: "See exactly what uses are allowed for each collection. ML/AI, publication, and more clearly displayed.",
              color: "text-blue-600",
              bg: "bg-blue-50",
            },
            {
              icon: TrendingUp,
              title: "Leverage Curation",
              description: "DCMs have already bundled related datasets. Benefit from their expertise in data organization.",
              color: "text-purple-600",
              bg: "bg-purple-50",
            },
          ].map((item, i) => {
            const Icon = item.icon
            return (
              <Card key={i} className="border-neutral-200 rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <div className={cn("flex size-12 items-center justify-center rounded-xl mb-4", item.bg)}>
                    <Icon className={cn("size-6", item.color)} />
                  </div>
                  <h3 className="text-base font-normal text-neutral-900 mb-2">{item.title}</h3>
                  <p className="text-sm font-light text-neutral-600">{item.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Help Section */}
      <div className={cn(
        "rounded-2xl p-8 text-center border bg-gradient-to-br",
        scheme.bg,
        scheme.bgHover,
        `border-${scheme.from.replace("from-", "").replace("-500", "-100")}/50`
      )}>
        <Sparkles className={cn("size-8 mx-auto mb-4", scheme.from.replace("from-", "text-"))} />
        <h3 className="text-xl font-light text-neutral-900 mb-2">
          Not sure where to start?
        </h3>
        <p className="text-sm font-light text-neutral-600 max-w-md mx-auto mb-6">
          Try the AI-Assisted Discovery. Just describe your research needs and let our system guide you to the right data.
        </p>
        <Button
          onClick={() => router.push("/collectoid/discover/ai")}
          className={cn(
            "h-12 rounded-2xl font-light bg-gradient-to-r text-white shadow-lg hover:shadow-xl transition-all",
            scheme.from,
            scheme.to
          )}
        >
          <Sparkles className="size-4 mr-2" />
          Try AI-Assisted Discovery
        </Button>
      </div>
    </div>
  )
}

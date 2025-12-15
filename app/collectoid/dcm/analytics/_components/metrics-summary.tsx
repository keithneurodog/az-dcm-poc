"use client"

import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import { TrendingUp, Flame, BarChart3 } from "lucide-react"

interface MetricsSummaryProps {
  totalRequests: number
  totalPending: number
  hotDatasets: number
  trendingUp: number
  trendingDown: number
}

export function MetricsSummary({
  totalRequests,
  totalPending,
  hotDatasets,
  trendingUp,
  trendingDown,
}: MetricsSummaryProps) {
  useColorScheme() // For future theming

  const metrics = [
    {
      label: "Total Requests",
      value: totalRequests.toLocaleString(),
      subValue: `${totalPending} pending`,
      icon: BarChart3,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      label: "Hot Datasets",
      value: hotDatasets.toString(),
      subValue: "High demand, low coverage",
      icon: Flame,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      label: "Trending",
      value: `↑${trendingUp}`,
      subValue: `↓${trendingDown} declining`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bgColor: "bg-emerald-50",
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {metrics.map((metric) => {
        const Icon = metric.icon
        return (
          <div
            key={metric.label}
            className="rounded-2xl border border-neutral-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-1">
                  {metric.label}
                </p>
                <p className="text-2xl font-light text-neutral-900">
                  {metric.value}
                </p>
                <p className="text-xs font-light text-neutral-400 mt-1">
                  {metric.subValue}
                </p>
              </div>
              <div className={cn("p-2 rounded-xl", metric.bgColor)}>
                <Icon className={cn("size-5", metric.color)} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

"use client"

import { useState } from "react"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  ChevronUp,
  ChevronDown,
  Database,
} from "lucide-react"
import { DatasetDemandMetrics, getGapColor } from "@/lib/analytics-helpers"

interface TopDatasetsTableProps {
  datasets: DatasetDemandMetrics[]
  title?: string
}

type SortField = "requests" | "gap" | "collections" | "trending"
type SortDirection = "asc" | "desc"

export function TopDatasetsTable({
  datasets,
  title = "Top Requested Datasets",
}: TopDatasetsTableProps) {
  const { scheme } = useColorScheme()
  const [sortField, setSortField] = useState<SortField>("requests")
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc")

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "desc" ? "asc" : "desc")
    } else {
      setSortField(field)
      setSortDirection("desc")
    }
  }

  const sortedDatasets = [...datasets].sort((a, b) => {
    const multiplier = sortDirection === "desc" ? -1 : 1
    switch (sortField) {
      case "requests":
        return (a.totalRequests - b.totalRequests) * multiplier
      case "gap":
        return (a.gapScore - b.gapScore) * multiplier
      case "collections":
        return (a.collectionsContaining - b.collectionsContaining) * multiplier
      case "trending":
        return (a.trendPercent - b.trendPercent) * multiplier
      default:
        return 0
    }
  })

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null
    return sortDirection === "desc" ? (
      <ChevronDown className="size-3" />
    ) : (
      <ChevronUp className="size-3" />
    )
  }

  const TrendIcon = ({ direction }: { direction: "up" | "down" | "stable" }) => {
    switch (direction) {
      case "up":
        return <TrendingUp className="size-3.5 text-emerald-500" />
      case "down":
        return <TrendingDown className="size-3.5 text-red-500" />
      default:
        return <Minus className="size-3.5 text-neutral-400" />
    }
  }

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center gap-2">
        <Database className={cn("size-4", scheme.from.replace("from-", "text-"))} />
        <h3 className="text-sm font-light text-neutral-900">{title}</h3>
        <span className="text-xs font-light text-neutral-400 ml-auto">
          {datasets.length} datasets
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50">
              <th className="px-4 py-3 text-left text-xs font-light text-neutral-500 uppercase tracking-wider">
                #
              </th>
              <th className="px-4 py-3 text-left text-xs font-light text-neutral-500 uppercase tracking-wider">
                Dataset
              </th>
              <th className="px-4 py-3 text-left text-xs font-light text-neutral-500 uppercase tracking-wider">
                TA
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-light text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700"
                onClick={() => handleSort("requests")}
              >
                <span className="flex items-center gap-1">
                  Requests
                  <SortIcon field="requests" />
                </span>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-light text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700"
                onClick={() => handleSort("collections")}
              >
                <span className="flex items-center gap-1">
                  Collections
                  <SortIcon field="collections" />
                </span>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-light text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700"
                onClick={() => handleSort("gap")}
              >
                <span className="flex items-center gap-1">
                  Gap
                  <SortIcon field="gap" />
                </span>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-light text-neutral-500 uppercase tracking-wider cursor-pointer hover:text-neutral-700"
                onClick={() => handleSort("trending")}
              >
                <span className="flex items-center gap-1">
                  Trend
                  <SortIcon field="trending" />
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {sortedDatasets.map((dataset, index) => {
              const gapColor = getGapColor(dataset.gapScore)
              return (
                <tr
                  key={dataset.datasetId}
                  className="hover:bg-neutral-50 transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-light text-neutral-400">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-normal text-neutral-900">
                        {dataset.datasetCode}
                      </p>
                      <p className="text-xs font-light text-neutral-400 truncate max-w-[200px]">
                        {dataset.datasetName}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {dataset.therapeuticArea.slice(0, 2).map((ta) => (
                        <span
                          key={ta}
                          className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 font-light"
                        >
                          {ta}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-sm font-normal text-neutral-900">
                        {dataset.totalRequests}
                      </p>
                      <p className="text-xs font-light text-neutral-400">
                        {dataset.pendingRequests} pending
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm font-light text-neutral-600">
                    {dataset.collectionsContaining}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex px-2 py-1 rounded-full text-xs font-light"
                      style={{
                        backgroundColor: gapColor.bg,
                        color: gapColor.text,
                      }}
                    >
                      {dataset.gapScore}%
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <TrendIcon direction={dataset.trendDirection} />
                      <span
                        className={cn(
                          "text-xs font-light",
                          dataset.trendDirection === "up"
                            ? "text-emerald-600"
                            : dataset.trendDirection === "down"
                            ? "text-red-600"
                            : "text-neutral-400"
                        )}
                      >
                        {dataset.trendDirection === "stable"
                          ? "—"
                          : `${dataset.trendPercent > 0 ? "+" : ""}${dataset.trendPercent}%`}
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// app/collectoid/manage/_components/tabs/datasets-tab.tsx
"use client"

import { useCollection } from "../collection-context"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid/_components"
import {
  Database,
  Plus,
  Search,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react"

const STATUS_CONFIG = {
  available: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50", label: "Available" },
  pending_review: { icon: Clock, color: "text-amber-500", bg: "bg-amber-50", label: "Pending Review" },
  restricted: { icon: AlertCircle, color: "text-orange-500", bg: "bg-orange-50", label: "Restricted" },
  unavailable: { icon: XCircle, color: "text-neutral-400", bg: "bg-neutral-100", label: "Unavailable" },
}

export function DatasetsTab() {
  const { scheme } = useColorScheme()
  const { collection } = useCollection()

  if (!collection) return null

  const datasets = collection.datasets || []

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-light text-neutral-900">Datasets</h2>
          <p className="text-sm font-light text-neutral-500">
            {datasets.length} datasets in this collection
          </p>
        </div>
        <Button
          className={cn("rounded-full font-light bg-gradient-to-r text-white", scheme.from, scheme.to)}
        >
          <Plus className="size-4 mr-2" strokeWidth={1.5} />
          Add Datasets
        </Button>
      </div>

      {/* Empty state or dataset list */}
      {datasets.length === 0 ? (
        <Card className="border-neutral-200 rounded-xl border-dashed">
          <CardContent className="py-12 text-center">
            <Database className="size-12 text-neutral-300 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-lg font-light text-neutral-600 mb-2">No datasets yet</h3>
            <p className="text-sm font-light text-neutral-500 mb-4">
              Add datasets to define what data this collection includes.
            </p>
            <Button
              className={cn("rounded-full font-light bg-gradient-to-r text-white", scheme.from, scheme.to)}
            >
              <Search className="size-4 mr-2" strokeWidth={1.5} />
              Browse & Add Datasets
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {datasets.map((dataset) => {
            const statusConfig = STATUS_CONFIG[dataset.status]
            const StatusIcon = statusConfig.icon

            return (
              <Card key={dataset.id} className="border-neutral-200 rounded-xl">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-normal text-neutral-900 truncate">
                          {dataset.name}
                        </h3>
                        <Badge variant="outline" className={cn("font-light text-xs", statusConfig.bg, statusConfig.color)}>
                          <StatusIcon className="size-3 mr-1" strokeWidth={1.5} />
                          {statusConfig.label}
                        </Badge>
                      </div>
                      <p className="text-sm font-light text-neutral-500 truncate">
                        {dataset.description}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs font-light text-neutral-400">
                        <span>{dataset.category}</span>
                        <span>·</span>
                        <span>{dataset.recordCount.toLocaleString()} records</span>
                        <span>·</span>
                        <span>Updated {dataset.lastUpdated}</span>
                      </div>
                      {dataset.issues && dataset.issues.length > 0 && (
                        <div className="flex items-center gap-1.5 mt-2 text-xs font-light text-amber-600">
                          <AlertCircle className="size-3" strokeWidth={1.5} />
                          {dataset.issues[0]}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

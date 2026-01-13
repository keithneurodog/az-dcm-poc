// app/collectoid/manage/_components/tabs/timeline-tab.tsx
"use client"

import { useCollection } from "../collection-context"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid/_components"
import {
  Clock,
  Plus,
  Edit,
  GitBranch,
  UserPlus,
  Database,
  MessageSquare,
} from "lucide-react"

const EVENT_ICONS = {
  created: Plus,
  updated: Edit,
  state_change: GitBranch,
  user_added: UserPlus,
  dataset_added: Database,
  comment: MessageSquare,
}

export function TimelineTab() {
  const { scheme } = useColorScheme()
  const { collection } = useCollection()

  if (!collection) return null

  const timeline = collection.timeline || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-light text-neutral-900">Timeline</h2>
        <p className="text-sm font-light text-neutral-500">
          Full history of this collection
        </p>
      </div>

      {timeline.length === 0 ? (
        <Card className="border-neutral-200 rounded-xl border-dashed">
          <CardContent className="py-12 text-center">
            <Clock className="size-12 text-neutral-300 mx-auto mb-4" strokeWidth={1} />
            <h3 className="text-lg font-light text-neutral-600 mb-2">No history yet</h3>
            <p className="text-sm font-light text-neutral-500">
              Timeline events will appear here as you work on this collection.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-neutral-200" />

          {/* Events */}
          <div className="space-y-4">
            {timeline.map((event, index) => {
              const Icon = EVENT_ICONS[event.type] || Clock

              return (
                <div key={event.id} className="relative flex items-start gap-4 pl-10">
                  {/* Icon */}
                  <div className={cn(
                    "absolute left-0 size-8 rounded-full flex items-center justify-center border-2 border-white bg-neutral-100",
                    index === 0 && cn("bg-gradient-to-br text-white", scheme.from, scheme.to)
                  )}>
                    <Icon className={cn("size-4", index === 0 ? "text-white" : "text-neutral-500")} strokeWidth={1.5} />
                  </div>

                  {/* Content */}
                  <Card className="flex-1 border-neutral-200 rounded-xl">
                    <CardContent className="py-3">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-light text-neutral-900">{event.description}</p>
                        <span className="text-xs font-light text-neutral-400 whitespace-nowrap">
                          {new Date(event.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {event.actorName && (
                        <p className="text-xs font-light text-neutral-500 mt-1">
                          by {event.actorName}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

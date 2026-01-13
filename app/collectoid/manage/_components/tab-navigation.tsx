"use client"

import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid/_components"
import { useCollection } from "./collection-context"
import {
  LayoutDashboard,
  Database,
  Users,
  FileText,
  MessageSquare,
  Clock,
} from "lucide-react"

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "datasets", label: "Datasets", icon: Database },
  { id: "users", label: "Users", icon: Users },
  { id: "terms", label: "Terms", icon: FileText },
  { id: "discussion", label: "Discussion", icon: MessageSquare },
  { id: "timeline", label: "Timeline", icon: Clock },
]

export function TabNavigation() {
  const { scheme } = useColorScheme()
  const { activeTab, setActiveTab, collection } = useCollection()

  return (
    <div className="border-b border-neutral-200 bg-white">
      <nav className="flex gap-1 px-1" aria-label="Collection tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id

          // Show indicator for incomplete items
          let showIndicator = false
          if (collection) {
            if (tab.id === "datasets" && !collection.hasDatasets) showIndicator = true
            if (tab.id === "users" && !collection.hasUsers) showIndicator = true
            if (tab.id === "terms" && !collection.hasTerms) showIndicator = true
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-3 text-sm font-light transition-colors border-b-2 -mb-px",
                isActive
                  ? cn("border-current", scheme.from.replace("from-", "text-"))
                  : "border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300"
              )}
            >
              <Icon className="size-4" strokeWidth={1.5} />
              <span>{tab.label}</span>
              {showIndicator && (
                <span className="size-2 rounded-full bg-amber-400" />
              )}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

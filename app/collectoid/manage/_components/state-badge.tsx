"use client"

import { cn } from "@/lib/utils"
import { CollectionState, getStateDisplayInfo } from "@/lib/collection-v2-mock-data"
import { Lock, Globe, Clock, FileText, CheckCircle, Loader2, Sparkles } from "lucide-react"

const STATE_ICONS: Record<CollectionState, React.ElementType> = {
  draft: Lock,
  public: Globe,
  aip_submitted: Clock,
  aot_drafting: FileText,
  aot_review: Clock,
  aot_approved: CheckCircle,
  implementing: Loader2,
  access_granted: Sparkles,
  maintaining: Sparkles,
}

const STATE_COLORS: Record<string, string> = {
  neutral: "bg-neutral-100 text-neutral-700 border-neutral-200",
  blue: "bg-blue-50 text-blue-700 border-blue-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  purple: "bg-purple-50 text-purple-700 border-purple-200",
  orange: "bg-orange-50 text-orange-700 border-orange-200",
  green: "bg-green-50 text-green-700 border-green-200",
  cyan: "bg-cyan-50 text-cyan-700 border-cyan-200",
  emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
}

interface StateBadgeProps {
  state: CollectionState
  size?: "sm" | "md" | "lg"
  showDescription?: boolean
}

export function StateBadge({ state, size = "md", showDescription = false }: StateBadgeProps) {
  const info = getStateDisplayInfo(state)
  const Icon = STATE_ICONS[state]
  const colorClass = STATE_COLORS[info.color] || STATE_COLORS.neutral

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-sm gap-2",
  }

  const iconSizes = {
    sm: "size-3",
    md: "size-4",
    lg: "size-5",
  }

  return (
    <div className="flex items-center gap-2">
      <span
        className={cn(
          "inline-flex items-center rounded-full border font-light",
          colorClass,
          sizeClasses[size]
        )}
      >
        <Icon className={cn(iconSizes[size], state === "implementing" && "animate-spin")} strokeWidth={1.5} />
        <span>{info.label}</span>
      </span>
      {showDescription && (
        <span className="text-xs text-neutral-500">{info.description}</span>
      )}
    </div>
  )
}

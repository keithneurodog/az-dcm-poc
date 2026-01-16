"use client"

import { Badge } from "@/components/ui/badge"
import { Workflow } from "lucide-react"
import { cn } from "@/lib/utils"

interface FlowEmbeddedBadgeProps {
  stepNumber: number
  className?: string
  variant?: "default" | "subtle"
}

export function FlowEmbeddedBadge({
  stepNumber,
  className,
  variant = "default",
}: FlowEmbeddedBadgeProps) {
  if (variant === "subtle") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[10px] text-neutral-400 uppercase tracking-wider",
          className
        )}
      >
        <Workflow className="size-3" />
        Step {stepNumber}
      </span>
    )
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        "bg-neutral-100 text-neutral-600 border border-neutral-200 text-[10px] font-normal py-0",
        className
      )}
    >
      <Workflow className="size-2.5 mr-1" />
      Wizard Step {stepNumber}
    </Badge>
  )
}

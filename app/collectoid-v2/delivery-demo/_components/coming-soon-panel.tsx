"use client"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"

interface ComingSoonPanelProps {
  icon: LucideIcon
  title: string
  description: string
}

export function ComingSoonPanel({ icon: Icon, title, description }: ComingSoonPanelProps) {
  const { scheme } = useColorScheme()

  return (
    <div className="flex flex-col items-center justify-center py-20 px-8">
      {/* Icon */}
      <div
        className={cn(
          "flex size-14 items-center justify-center rounded-xl bg-gradient-to-br opacity-10",
          scheme.from,
          scheme.to
        )}
      >
        <Icon className="size-7 text-neutral-400" strokeWidth={1.5} />
      </div>

      {/* Title + Badge */}
      <div className="mt-5 flex items-center gap-2.5">
        <h2 className="text-lg font-light text-neutral-700">{title}</h2>
        <span
          className={cn(
            "bg-gradient-to-r text-white text-[10px] px-2 py-0.5 rounded-full",
            scheme.from,
            scheme.to
          )}
        >
          Soon
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm font-light text-neutral-400 max-w-md text-center">
        {description}
      </p>
    </div>
  )
}

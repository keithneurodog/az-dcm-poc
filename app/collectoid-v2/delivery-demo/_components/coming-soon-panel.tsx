"use client"

import { LucideIcon } from "lucide-react"
import { useColorScheme } from "./color-context"
import { cn } from "@/lib/utils"

interface ComingSoonPanelProps {
  icon: LucideIcon
  title: string
  description: string
  benefits?: { icon: LucideIcon; text: string }[]
}

export function ComingSoonPanel({
  icon: Icon,
  title,
  description,
  benefits,
}: ComingSoonPanelProps) {
  const { scheme } = useColorScheme()

  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center rounded-xl border border-dashed p-10",
      scheme.from.replace("from-", "border-").replace("500", "200"),
      scheme.from.replace("from-", "bg-").replace("500", "50/30"),
    )}>
      <div className="flex items-center gap-2 mb-3">
        <Icon className={cn("size-4", scheme.from.replace("from-", "text-").replace("500", "300"))} strokeWidth={1.5} />
        <span className="text-sm font-normal text-neutral-600">{title}</span>
        <span className="text-[10px] font-normal px-2 py-0.5 rounded-full border border-neutral-300 text-neutral-400">
          Soon
        </span>
      </div>

      <p className="text-xs font-light text-neutral-500 leading-relaxed max-w-sm mb-5">
        {description}
      </p>

      {benefits && benefits.length > 0 && (
        <div className="space-y-2 w-full max-w-xs">
          {benefits.map((benefit) => (
            <div key={benefit.text} className="flex items-start gap-2 text-left">
              <benefit.icon className="size-3.5 text-neutral-400 shrink-0 mt-0.5" strokeWidth={1.5} />
              <span className="text-xs font-light text-neutral-500 leading-relaxed">{benefit.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

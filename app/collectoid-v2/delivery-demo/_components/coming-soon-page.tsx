"use client"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"

interface Capability {
  icon: LucideIcon
  title: string
  description: string
}

interface ComingSoonPageProps {
  icon: LucideIcon
  title: string
  description: string
  capabilities?: Capability[]
}

export function ComingSoonPage({
  icon: Icon,
  title,
  description,
  capabilities,
}: ComingSoonPageProps) {
  const { scheme } = useColorScheme()

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center py-16">
      {/* Icon */}
      <div
        className={cn(
          "flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br opacity-10",
          scheme.from,
          scheme.to
        )}
      >
        <Icon className="size-8 text-neutral-400" strokeWidth={1.5} />
      </div>

      {/* Coming Soon Badge */}
      <span
        className={cn(
          "mt-6 bg-gradient-to-r text-white text-xs px-3 py-1 rounded-full",
          scheme.from,
          scheme.to
        )}
      >
        Coming Soon
      </span>

      {/* Title */}
      <h1 className="mt-4 text-2xl font-light text-neutral-800">{title}</h1>

      {/* Description */}
      <p className="mt-3 text-sm font-light text-neutral-500 max-w-lg text-center">
        {description}
      </p>

      {/* Capabilities Grid */}
      {capabilities && capabilities.length > 0 && (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
          {capabilities.map((cap) => {
            const CapIcon = cap.icon
            return (
              <div
                key={cap.title}
                className="flex gap-4 p-5 rounded-xl border border-neutral-100 bg-white"
              >
                <CapIcon className="size-5 shrink-0 text-neutral-300" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-normal text-neutral-700">{cap.title}</p>
                  <p className="mt-1 text-xs font-light text-neutral-400">
                    {cap.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

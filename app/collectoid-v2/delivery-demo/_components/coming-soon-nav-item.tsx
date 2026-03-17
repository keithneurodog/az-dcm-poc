"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"

interface ComingSoonNavItemProps {
  name: string
  href: string
  icon: LucideIcon
}

export function ComingSoonNavItem({ name, href, icon: Icon }: ComingSoonNavItemProps) {
  const pathname = usePathname()
  const { scheme } = useColorScheme()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
        isActive
          ? "bg-neutral-100 text-neutral-700"
          : "text-neutral-400 hover:text-neutral-500"
      )}
    >
      <Icon className="size-5 shrink-0" strokeWidth={1.5} />
      <span className="flex-1">{name}</span>
      <span
        className={cn(
          "bg-gradient-to-r opacity-60 text-white text-[10px] px-2 py-0.5 rounded-full",
          scheme.from,
          scheme.to
        )}
      >
        Soon
      </span>
    </Link>
  )
}

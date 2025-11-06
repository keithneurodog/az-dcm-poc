"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Search,
  FileStack,
  Settings,
  Circle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useColorScheme } from "./ux12-color-context"

const navigation = [
  { name: "Dashboard", href: "/ux/13/home", icon: LayoutDashboard },
  { name: "Search", href: "/ux/13/search", icon: Search },
  { name: "Management", href: "/ux/13/management", icon: FileStack },
  { name: "Settings", href: "#", icon: Settings },
]

export function UX13Sidebar() {
  const pathname = usePathname()
  const { scheme } = useColorScheme()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-neutral-200 bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center px-6 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className={cn("flex size-10 items-center justify-center rounded-full bg-gradient-to-br shadow-md", scheme.from, scheme.to)}>
            <span className="text-white font-bold text-sm">AZ</span>
          </div>
          <div>
            <span className="font-light text-lg text-neutral-900 tracking-tight">Data Portal</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 text-sm font-light transition-all rounded-xl",
                isActive
                  ? cn("bg-gradient-to-r text-white shadow-md", scheme.from, scheme.to)
                  : "text-neutral-600 hover:bg-neutral-50"
              )}
            >
              <Icon className="size-5" />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Status Card */}
      <div className="px-3 pb-3">
        <div className={cn("rounded-2xl p-4 bg-gradient-to-br", scheme.bg, scheme.bgHover, "border", scheme.from.replace("from-", "border-").replace("500", "100"))}>
          <div className="flex items-center gap-2 mb-3">
            <Circle className={cn("size-2 animate-pulse fill-current", scheme.from.replace("from-", "text-"))} />
            <span className="text-xs font-light text-neutral-600 uppercase tracking-wider">System Status</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-light text-neutral-600">Uptime</span>
              <span className="text-sm font-normal text-neutral-900">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-light text-neutral-600">Datasets</span>
              <span className="text-sm font-normal text-neutral-900">1,284</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-neutral-100 p-4">
        <div className="flex items-center gap-3">
          <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-medium bg-gradient-to-br", scheme.from, scheme.to)}>
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-light text-neutral-900">John Doe</p>
            <p className="text-xs text-neutral-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}

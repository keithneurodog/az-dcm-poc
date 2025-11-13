"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  Circle,
  Sparkles,
  Database,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useColorScheme } from "./ux12-color-context"
import { useNotifications } from "./notification-context"
import { Badge } from "@/components/ui/badge"

const navigation = [
  { name: "Dashboard", href: "/poc/1", icon: LayoutDashboard },
  { name: "Browse Collections", href: "/poc/1/collections", icon: Database },
  { name: "Notifications", href: "/poc/1/notifications", icon: Bell },
  { name: "Create Collection", href: "/poc/1/dcm/create", icon: PlusCircle },
  { name: "Settings", href: "#", icon: Settings },
]

export function UX13Sidebar() {
  const pathname = usePathname()
  const { scheme } = useColorScheme()
  const { criticalCount, unreadCount } = useNotifications()

  return (
    <div className="flex h-screen w-64 flex-col border-r border-neutral-200 bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center px-6 border-b border-neutral-100">
        <div className="flex items-center gap-3">
          <div className={cn("flex size-10 items-center justify-center rounded-full bg-gradient-to-br shadow-md", scheme.from, scheme.to)}>
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <span className="font-light text-lg text-neutral-900 tracking-tight">Collectoid</span>
            <p className="text-xs text-neutral-500">DCM Platform</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        {navigation.map((item) => {
          const Icon = item.icon
          // Match exact path or any sub-routes for DCM paths
          let isActive = false

          if (item.name === "Dashboard") {
            // Highlight dashboard on exact match or progress pages (not during create flow)
            isActive =
              pathname === "/poc/1" ||
              (pathname.startsWith("/poc/1/dcm/progress") && !pathname.startsWith("/poc/1/dcm/create"))
          } else if (item.name === "Create Collection") {
            // Highlight during the creation flow
            isActive = pathname.startsWith("/poc/1/dcm/create")
          } else {
            // For other items, use exact match
            isActive = pathname === item.href
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 text-sm font-light transition-all rounded-xl relative",
                isActive
                  ? cn("bg-gradient-to-r text-white shadow-md", scheme.from, scheme.to)
                  : "text-neutral-600 hover:bg-neutral-50"
              )}
            >
              <Icon className="size-5" />
              <span className="flex-1">{item.name}</span>
              {item.name === "Dashboard" && criticalCount > 0 && (
                <div className="size-2 rounded-full bg-red-500 animate-pulse shadow-lg" />
              )}
              {item.name === "Notifications" && unreadCount > 0 && (
                <Badge
                  className={cn(
                    "text-xs font-light border-0",
                    isActive
                      ? "bg-white/20 text-white"
                      : cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                  )}
                >
                  {unreadCount}
                </Badge>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Status Card */}
      <div className="px-3 pb-3">
        <div className={cn("rounded-2xl p-4 bg-gradient-to-br", scheme.bg, scheme.bgHover, "border", scheme.from.replace("from-", "border-").replace("500", "100"))}>
          <div className="flex items-center gap-2 mb-3">
            <Circle className={cn("size-2 animate-pulse fill-current", scheme.from.replace("from-", "text-"))} />
            <span className="text-xs font-light text-neutral-600 uppercase tracking-wider">Collection Stats</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-light text-neutral-600">Active</span>
              <span className="text-sm font-normal text-neutral-900">8</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-light text-neutral-600">Users Served</span>
              <span className="text-sm font-normal text-neutral-900">847</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-light text-neutral-600">Auto-Approval</span>
              <span className="text-sm font-normal text-neutral-900">68%</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-neutral-100 p-4">
        <div className="flex items-center gap-3">
          <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-medium bg-gradient-to-br", scheme.from, scheme.to)}>
            DD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-light text-neutral-900">Divya Dayanidhi</p>
            <p className="text-xs text-neutral-500">DCM</p>
          </div>
        </div>
      </div>
    </div>
  )
}

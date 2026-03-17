"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Database,
  Bell,
  BarChart3,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid-v2/(app)/_components"
import { ComingSoonNavItem } from "./coming-soon-nav-item"

export function DemoSidebar() {
  const pathname = usePathname()
  const { scheme } = useColorScheme()

  const basePath = "/collectoid-v2/delivery-demo"
  const isCollectionsActive = pathname.startsWith(basePath + "/collections")

  return (
    <div className="flex h-screen w-64 flex-col border-r border-neutral-200 bg-white">
      {/* Logo */}
      <div className="flex h-20 items-center border-b border-neutral-100 px-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-full bg-gradient-to-br shadow-md shrink-0",
              scheme.from,
              scheme.to
            )}
          >
            <Sparkles className="size-5 text-white" strokeWidth={1.5} />
          </div>
          <div>
            <span className="font-light text-lg text-neutral-900 tracking-tight">
              Collectoid
            </span>
            <p className="text-xs text-neutral-500">Early Access</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        <ComingSoonNavItem
          name="Dashboard"
          href={`${basePath}/dashboard`}
          icon={LayoutDashboard}
        />

        <Link
          href={`${basePath}/collections/demo-1`}
          className={cn(
            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-light transition-all",
            isCollectionsActive
              ? cn("bg-gradient-to-r text-white shadow-md", scheme.from, scheme.to)
              : "text-neutral-600 hover:bg-neutral-50"
          )}
        >
          <Database className="size-5 shrink-0" strokeWidth={1.5} />
          <span className="flex-1">Collections</span>
        </Link>

        <ComingSoonNavItem
          name="Notifications"
          href={`${basePath}/notifications`}
          icon={Bell}
        />

        <ComingSoonNavItem
          name="Analytics"
          href={`${basePath}/analytics`}
          icon={BarChart3}
        />
      </nav>

      {/* User Profile */}
      <div className="border-t border-neutral-100 p-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex size-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-medium bg-gradient-to-br",
              scheme.from,
              scheme.to
            )}
          >
            SC
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-light text-neutral-900">Sarah Chen</p>
            <p className="text-xs text-neutral-500">Data Collection Manager</p>
          </div>
        </div>
      </div>
    </div>
  )
}

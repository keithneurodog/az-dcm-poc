"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Search,
  FileStack,
  Settings,
  Activity,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/ux/7/home", icon: LayoutDashboard },
  { name: "Search", href: "/ux/7/search", icon: Search },
  { name: "Management", href: "/ux/7/management", icon: FileStack },
  { name: "Settings", href: "#", icon: Settings },
]

export function UX7Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-72 flex-col bg-[#0A0E1A] border-r border-emerald-500/20">
      {/* Logo */}
      <div className="flex h-20 items-center px-6 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500 blur-lg opacity-50 animate-pulse" />
            <div className="relative flex size-10 items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 font-bold text-sm rounded-lg border border-emerald-400/50">
              AZ
            </div>
          </div>
          <div>
            <span className="font-bold text-lg text-white">Data Portal</span>
            <div className="flex items-center gap-1 text-xs text-emerald-400">
              <Activity className="size-3" />
              <span>Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-6">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all rounded-lg relative",
                isActive
                  ? "bg-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/20"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-transparent rounded-lg" />
              )}
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-emerald-500 rounded-r" />
              )}
              <Icon className={cn("size-5 relative z-10", isActive && "animate-pulse")} />
              <span className="relative z-10">{item.name}</span>
              {isActive && <Zap className="ml-auto size-4 text-emerald-400 animate-pulse relative z-10" />}
            </Link>
          )
        })}
      </nav>

      {/* Stats */}
      <div className="px-4 py-4 border-t border-emerald-500/20">
        <div className="rounded-lg bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-4 border border-emerald-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="size-4 text-emerald-400" />
            <span className="text-xs font-medium text-emerald-400">System Status</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-neutral-400">CPU Usage</span>
              <span className="text-white font-mono">42%</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-[42%] bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-emerald-500/20 p-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="relative flex size-10 items-center justify-center">
            <div className="absolute inset-0 bg-emerald-500 blur-md opacity-30" />
            <div className="relative flex size-10 items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg text-sm font-semibold border border-emerald-400/50">
              JD
            </div>
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">John Doe</p>
            <p className="text-xs text-emerald-400">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}

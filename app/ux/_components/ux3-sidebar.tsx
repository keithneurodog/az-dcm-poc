"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Search,
  FileStack,
  Settings,
  Bell,
  User,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/ux/3/home", icon: LayoutDashboard },
  { name: "Search", href: "/ux/3/search", icon: Search },
  { name: "Management", href: "/ux/3/management", icon: FileStack },
  { name: "Settings", href: "#", icon: Settings },
]

export function UX3Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-64 flex-col bg-[#830051] text-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center bg-[#F0AB00] text-[#830051] font-bold text-sm">
            AZ
          </div>
          <span className="font-semibold text-lg">Data Portal</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              )}
            >
              <Icon className="size-5" />
              <span>{item.name}</span>
              {isActive && <ChevronRight className="ml-auto size-4" />}
            </Link>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center bg-white/10 text-sm font-semibold">
            JD
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-white/60">Administrator</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button className="flex size-8 items-center justify-center hover:bg-white/10 transition-colors">
            <Bell className="size-4" />
          </button>
          <button className="flex size-8 items-center justify-center hover:bg-white/10 transition-colors">
            <User className="size-4" />
          </button>
          <button className="flex size-8 items-center justify-center hover:bg-white/10 transition-colors">
            <Settings className="size-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

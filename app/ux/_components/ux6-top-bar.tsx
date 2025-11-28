"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, User, LayoutDashboard, Search, FileStack, Settings } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/ux/6/home", icon: LayoutDashboard },
  { name: "Search", href: "/ux/6/search", icon: Search },
  { name: "Management", href: "/ux/6/management", icon: FileStack },
  { name: "Settings", href: "#", icon: Settings },
]

export function UX6TopBar() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 border-b border-white/20 bg-white/40 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] text-white font-bold text-sm rounded-lg shadow-lg shadow-purple-500/20">
                AZ
              </div>
              <span className="font-semibold text-lg bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] bg-clip-text text-transparent">
                Data Portal
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all rounded-lg",
                      isActive
                        ? "bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white shadow-lg shadow-purple-500/20"
                        : "text-neutral-600 hover:bg-white/60 hover:text-neutral-900"
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            <button className="relative p-2 hover:bg-white/60 rounded-lg transition-colors">
              <Bell className="size-5 text-neutral-600" />
              <Badge className="absolute -right-1 -top-1 size-5 p-0 flex items-center justify-center bg-gradient-to-r from-[#EC4899] to-[#F43F5E] text-white text-xs border-2 border-white">
                3
              </Badge>
            </button>
            <button className="flex items-center gap-3 rounded-lg hover:bg-white/60 px-3 py-2 transition-colors">
              <div className="flex size-8 items-center justify-center bg-gradient-to-br from-[#8B5CF6] to-[#6366F1] text-white text-xs font-semibold rounded-lg">
                JD
              </div>
              <span className="text-sm font-medium text-neutral-700">John Doe</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

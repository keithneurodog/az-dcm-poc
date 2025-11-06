"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Search,
  FileStack,
  Settings,
  ChevronRight,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/ux/10/home", icon: LayoutDashboard },
  { name: "Search", href: "/ux/10/search", icon: Search },
  { name: "Management", href: "/ux/10/management", icon: FileStack },
  { name: "Settings", href: "#", icon: Settings },
]

export function UX10Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-72 flex-col bg-white border-r border-neutral-200">
      {/* Logo */}
      <div className="flex h-24 items-center px-8 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 font-semibold text-white text-base rounded shadow-lg shadow-amber-600/30">
            AZ
          </div>
          <div>
            <span className="font-serif text-xl text-neutral-900 tracking-wide">Data Portal</span>
            <p className="text-xs text-amber-600 tracking-widest uppercase font-medium">Executive</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-8">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3.5 text-sm transition-all relative group",
                isActive
                  ? "text-amber-600"
                  : "text-neutral-600 hover:text-neutral-900"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600" />
              )}
              <Icon className="size-5" />
              <span className="font-medium tracking-wide">{item.name}</span>
              {isActive && <ChevronRight className="ml-auto size-4" />}
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div className="px-4">
        <div className="h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
      </div>

      {/* User Profile */}
      <div className="p-6">
        <div className="flex items-center gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 hover:border-amber-300 transition-colors cursor-pointer">
          <div className="flex size-11 items-center justify-center bg-gradient-to-br from-amber-400 to-amber-600 rounded text-white text-sm font-semibold shadow-md">
            JD
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-900">John Doe</p>
            <p className="text-xs text-amber-600 tracking-wide">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}

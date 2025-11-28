"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Search,
  FileStack,
  Settings,
  Sparkles,
} from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/ux/11/home", icon: LayoutDashboard, gradient: "from-blue-500 to-cyan-500" },
  { name: "Search", href: "/ux/11/search", icon: Search, gradient: "from-purple-500 to-pink-500" },
  { name: "Management", href: "/ux/11/management", icon: FileStack, gradient: "from-amber-500 to-orange-500" },
  { name: "Settings", href: "#", icon: Settings, gradient: "from-emerald-500 to-teal-500" },
]

export function UX11Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-72 flex-col bg-white border-r border-neutral-200">
      {/* Logo */}
      <div className="flex h-24 items-center px-8 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-500 blur-md opacity-50" />
            <div className="relative flex size-12 items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 font-bold text-white text-base rounded-xl shadow-lg">
              AZ
            </div>
          </div>
          <div>
            <span className="font-serif text-xl text-neutral-900 tracking-wide">Data Portal</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Sparkles className="size-3 text-amber-500" />
              <p className="text-xs text-transparent bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text font-bold uppercase tracking-wider">Premium</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4 py-8">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-4 py-3.5 text-sm transition-all relative rounded-xl",
                isActive
                  ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg`
                  : "text-neutral-600 hover:bg-neutral-50"
              )}
            >
              <div className={cn(
                "flex size-9 items-center justify-center rounded-lg transition-all",
                isActive
                  ? "bg-white/20"
                  : "bg-neutral-100 group-hover:bg-neutral-200"
              )}>
                <Icon className="size-4.5" />
              </div>
              <span className="font-semibold tracking-wide">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="px-4 pb-4">
        <div className="rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 p-5 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="size-5" />
            <span className="font-bold text-sm">This Week</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/90">Datasets</span>
              <span className="text-lg font-bold">1,284</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/90">Users</span>
              <span className="text-lg font-bold">142</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-t border-neutral-200 p-6">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-purple-100 hover:border-purple-200 transition-colors cursor-pointer">
          <div className="flex size-11 items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg text-white text-sm font-bold shadow-md">
            JD
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-neutral-900">John Doe</p>
            <p className="text-xs text-purple-600 font-medium">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  )
}

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
  { name: "Dashboard", href: "/ux/9/home", icon: LayoutDashboard, color: "from-blue-500 to-cyan-500" },
  { name: "Search", href: "/ux/9/search", icon: Search, color: "from-purple-500 to-pink-500" },
  { name: "Management", href: "/ux/9/management", icon: FileStack, color: "from-amber-500 to-orange-500" },
  { name: "Settings", href: "#", icon: Settings, color: "from-green-500 to-emerald-500" },
]

export function UX9Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-screen w-80 flex-col bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {/* Logo */}
      <div className="relative z-10 flex h-24 items-center px-8">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 animate-pulse" />
            <div className="relative flex size-14 items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-400 font-black text-lg rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform">
              AZ
            </div>
          </div>
          <div>
            <span className="font-black text-2xl">Data Portal</span>
            <div className="flex items-center gap-1.5 mt-1">
              <Sparkles className="size-3 text-yellow-300" />
              <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Pro</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 space-y-2 px-5 py-6">
        {navigation.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-4 px-5 py-4 text-base font-bold transition-all rounded-2xl relative",
                isActive
                  ? "bg-white text-indigo-600 shadow-2xl scale-105"
                  : "text-white/70 hover:bg-white/10 hover:text-white hover:scale-102"
              )}
            >
              <div className={cn(
                "flex size-10 items-center justify-center rounded-xl transition-all",
                isActive
                  ? `bg-gradient-to-br ${item.color} text-white shadow-lg`
                  : "bg-white/10 text-white group-hover:bg-white/20"
              )}>
                <Icon className="size-5" />
              </div>
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Quick Stats */}
      <div className="relative z-10 px-5 py-4">
        <div className="rounded-2xl bg-white/10 backdrop-blur-xl p-5 border border-white/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-10 items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl">
              <Sparkles className="size-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Quick Stats</p>
              <p className="text-xs text-white/70">This week</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Datasets</span>
              <span className="text-sm font-bold text-white">1,284</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white/80">Active</span>
              <span className="text-sm font-bold text-white">142</span>
            </div>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="relative z-10 border-t border-white/20 p-5">
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-xl hover:bg-white/20 transition-all cursor-pointer">
          <div className="flex size-12 items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl text-indigo-900 font-bold shadow-lg">
            JD
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-white">John Doe</p>
            <p className="text-xs text-white/70">Admin Access</p>
          </div>
        </div>
      </div>
    </div>
  )
}

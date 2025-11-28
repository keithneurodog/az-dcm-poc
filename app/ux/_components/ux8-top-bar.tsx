"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Search, FileStack, Settings, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/ux/8/home", icon: LayoutDashboard },
  { name: "Search", href: "/ux/8/search", icon: Search },
  { name: "Management", href: "/ux/8/management", icon: FileStack },
  { name: "Settings", href: "#", icon: Settings },
]

export function UX8TopBar() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-4">
            <div className="flex size-11 items-center justify-center bg-gradient-to-br from-rose-500 to-orange-400 rounded-full">
              <span className="text-white font-bold text-sm">AZ</span>
            </div>
            <div>
              <span className="font-light text-xl text-neutral-900 tracking-tight">Data Portal</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-5 py-2.5 text-sm font-light transition-all rounded-full",
                    isActive
                      ? "bg-gradient-to-r from-rose-500 to-orange-400 text-white"
                      : "text-neutral-600 hover:bg-neutral-100"
                  )}
                >
                  {isActive && <Circle className="size-1.5 fill-white" />}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-light text-neutral-900">John Doe</p>
              <p className="text-xs text-neutral-500">Admin</p>
            </div>
            <div className="flex size-11 items-center justify-center bg-gradient-to-br from-rose-500 to-orange-400 rounded-full text-white text-sm font-medium">
              JD
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

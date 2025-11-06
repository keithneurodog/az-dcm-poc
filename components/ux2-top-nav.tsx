"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Search,
  FileStack,
  Bell,
  User,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const navigationItems = [
  {
    title: "Dashboard",
    href: "/ux/2/home",
    icon: LayoutDashboard,
  },
  {
    title: "Search",
    href: "/ux/2/search",
    icon: Search,
  },
  {
    title: "Management",
    href: "/ux/2/management",
    icon: FileStack,
  },
]

export function UX2TopNav() {
  const pathname = usePathname()

  return (
    <nav className="sticky top-0 z-50 border-b bg-[#830051] border-[#a8006b]/20 shadow-lg">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/ux/2/home" className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center bg-[#F0AB00]">
            <svg
              width="20"
              height="20"
              viewBox="0 0 128 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-[#830051]"
            >
              <path
                d="M4.00915 25.1634L6.1081 19.4435L8.09019 25.1634H4.00915Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-white">AstraZeneca</span>
            <span className="text-xs text-white/70">Data Portal</span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`gap-2 text-white/90 hover:text-white hover:bg-white/10 ${
                    isActive ? "bg-white/15 text-white font-semibold" : ""
                  }`}
                >
                  <Icon className="size-4" />
                  {item.title}
                </Button>
              </Link>
            )
          })}
        </div>

        {/* User Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-white/90 hover:text-white hover:bg-white/10"
          >
            <Bell className="size-5" />
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 size-5 p-0 text-[10px] flex items-center justify-center bg-[#F0AB00] text-[#830051] border-none"
            >
              3
            </Badge>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white/90 hover:text-white hover:bg-white/10"
              >
                <div className="flex size-8 items-center justify-center bg-[#F0AB00]/20 text-[#F0AB00] font-bold">
                  JD
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <div className="flex size-10 items-center justify-center bg-[#F0AB00]/10 text-[#830051] font-bold">
                  JD
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold">John Doe</span>
                  <span className="text-xs text-muted-foreground">
                    john.doe@astrazeneca.com
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 size-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 size-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

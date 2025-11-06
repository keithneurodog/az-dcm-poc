"use client"

import { Bell, User } from "lucide-react"
import { Badge } from "./ui/badge"

export function UX4TopBar() {
  return (
    <div className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-white px-6">
      {/* Breadcrumb / Page Title */}
      <div className="flex items-center gap-2">
        <div className="text-sm text-neutral-500">
          <span className="font-medium text-neutral-900">AstraZeneca</span>
          <span className="mx-2">/</span>
          <span>Data Portal</span>
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-neutral-100 rounded-full transition-colors">
          <Bell className="size-5 text-neutral-600" />
          <Badge className="absolute -right-1 -top-1 size-5 p-0 flex items-center justify-center bg-[#F0AB00] text-[#830051] text-xs border-white">
            3
          </Badge>
        </button>
        <button className="flex items-center gap-3 rounded-full hover:bg-neutral-100 p-1 pr-3 transition-colors">
          <div className="flex size-8 items-center justify-center bg-[#830051] text-white text-xs font-semibold rounded-full">
            JD
          </div>
          <span className="text-sm font-medium text-neutral-700">John Doe</span>
        </button>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useColorScheme } from "./color-context"
import { useNotifications } from "./notification-context"
import { NotificationPanel } from "./notification-panel"

export function TopBar() {
  const { scheme } = useColorScheme()
  const { unreadCount } = useNotifications()
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [hoverOpen, setHoverOpen] = useState(false)

  return (
    <>
      <div className="sticky top-0 z-40 h-16 border-b border-neutral-100 bg-white/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-6">
          {/* Search */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <Input
                placeholder="Quick search..."
                className="pl-10 h-9 rounded-full border-neutral-200 bg-neutral-50 font-light text-sm focus:bg-white"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Popover open={hoverOpen} onOpenChange={setHoverOpen}>
              <PopoverTrigger asChild>
                <div
                  className="relative size-9 flex items-center justify-center rounded-full opacity-40 cursor-default"
                  onMouseEnter={() => setHoverOpen(true)}
                  onMouseLeave={() => setHoverOpen(false)}
                >
                  <Bell className="size-5 text-neutral-400" />
                </div>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="end"
                className="w-64 p-4 rounded-xl"
                onMouseEnter={() => setHoverOpen(true)}
                onMouseLeave={() => setHoverOpen(false)}
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <div className="flex flex-col items-center text-center gap-2">
                  <Bell className="size-5 text-neutral-300" strokeWidth={1.5} />
                  <p className="text-sm font-normal text-neutral-700">Notifications</p>
                  <p className="text-xs font-light text-neutral-400 leading-relaxed">
                    Real-time alerts for approvals, access changes, and collection updates are coming soon.
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </div>

      <NotificationPanel open={notificationPanelOpen} onOpenChange={setNotificationPanelOpen} />
    </>
  )
}

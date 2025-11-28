"use client"

import { useState } from "react"
import { Bell, Search, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useColorScheme } from "./color-context"
import { useNotifications } from "./notification-context"
import { NotificationPanel } from "./notification-panel"
import { cn } from "@/lib/utils"

export function TopBar() {
  const { scheme } = useColorScheme()
  const { unreadCount, criticalCount } = useNotifications()
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)

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
            <Button
              variant="ghost"
              size="sm"
              className="relative size-9 p-0 rounded-full hover:bg-neutral-100"
            >
              <HelpCircle className="size-5 text-neutral-600" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNotificationPanelOpen(true)}
              className="relative size-9 p-0 rounded-full hover:bg-neutral-100"
            >
              <Bell className="size-5 text-neutral-600" />
              {unreadCount > 0 && (
                <Badge
                  className={cn(
                    "absolute -top-1 -right-1 size-5 p-0 flex items-center justify-center text-xs font-light bg-gradient-to-r border-0 text-white",
                    criticalCount > 0
                      ? "from-red-500 to-orange-400"
                      : `${scheme.from} ${scheme.to}`
                  )}
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <NotificationPanel open={notificationPanelOpen} onOpenChange={setNotificationPanelOpen} />
    </>
  )
}

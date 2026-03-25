"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useColorScheme } from "./color-context"
import { useNotifications } from "./notification-context"
import { NotificationPanel } from "./notification-panel"
import { GlobalSearchPanel, useGlobalSearch } from "./global-search"
import { cn } from "@/lib/utils"

export function TopBar() {
  const { scheme } = useColorScheme()
  const { unreadCount } = useNotifications()
  const router = useRouter()
  const [notificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const blurTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const searchMatches = useGlobalSearch(searchQuery)

  // Close on Escape
  useEffect(() => {
    if (!searchFocused) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setSearchFocused(false) }
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [searchFocused])

  const handleSelect = (href: string) => {
    setSearchQuery("")
    setSearchFocused(false)
    searchInputRef.current?.blur()
    router.push(href)
  }

  return (
    <>
      <div className="sticky top-0 z-40 h-16 border-b border-neutral-100 bg-white/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-6">
          {/* Search */}
          <div className="flex-1 max-w-xl relative" ref={searchContainerRef}>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400 z-10" />
            <Input
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => { if (blurTimeoutRef.current) clearTimeout(blurTimeoutRef.current); setSearchFocused(true) }}
              onBlur={() => { blurTimeoutRef.current = setTimeout(() => setSearchFocused(false), 150) }}
              placeholder="Search collections, datasets, users, requests..."
              className="pl-10 h-9 rounded-full border-neutral-200 bg-neutral-50 font-light text-sm focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); setSearchFocused(false) }}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10"
              >
                <X className="size-3.5 text-neutral-400 hover:text-neutral-600" />
              </button>
            )}
            {searchFocused && searchQuery.length >= 2 && searchMatches && (
              <GlobalSearchPanel
                matches={searchMatches}
                query={searchQuery}
                onSelect={handleSelect}
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
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
                    scheme.from, scheme.to
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

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  PlusCircle,
  Settings,
  Circle,
  Sparkles,
  Database,
  Bell,
  Search,
  FileText,
  Inbox,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useColorScheme } from "./color-context"
import { useNotifications } from "./notification-context"
import { useSidebar } from "./sidebar-context"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Sidebar() {
  const pathname = usePathname()
  const { scheme } = useColorScheme()
  const { criticalCount, unreadCount } = useNotifications()
  const { isCollapsed, toggleSidebar } = useSidebar()

  const basePath = "/collectoid"

  const navigation = [
    { name: "Dashboard", href: basePath, icon: LayoutDashboard },
    { name: "Discover Data", href: `${basePath}/discover`, icon: Search, section: "end-user" },
    { name: "Browse Collections", href: `${basePath}/collections`, icon: Database },
    { name: "My Requests", href: `${basePath}/my-requests`, icon: FileText, section: "end-user" },
    { name: "Notifications", href: `${basePath}/notifications`, icon: Bell },
    { name: "DCM Propositions", href: `${basePath}/dcm/propositions`, icon: Inbox, section: "dcm" },
    { name: "Analytics", href: `${basePath}/dcm/analytics`, icon: BarChart3, section: "dcm" },
    { name: "Create Collection", href: `${basePath}/dcm/create`, icon: PlusCircle, section: "dcm" },
    { name: "Settings", href: "#", icon: Settings },
  ]

  return (
    <TooltipProvider delayDuration={0}>
      <div
        className={cn(
          "flex h-screen flex-col border-r border-neutral-200 bg-white transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        {/* Logo */}
        <div className={cn(
          "flex h-20 items-center border-b border-neutral-100",
          isCollapsed ? "justify-center px-2" : "px-6"
        )}>
          <div className="flex items-center gap-3">
            <div className={cn("flex size-10 items-center justify-center rounded-full bg-gradient-to-br shadow-md shrink-0", scheme.from, scheme.to)}>
              <Sparkles className="size-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="font-light text-lg text-neutral-900 tracking-tight">Collectoid</span>
                <p className="text-xs text-neutral-500">DCM Platform</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-1 py-6", isCollapsed ? "px-2" : "px-3")}>
          {navigation.map((item) => {
            const Icon = item.icon
            let isActive = false

            if (item.name === "Dashboard") {
              isActive =
                pathname === basePath ||
                (pathname.startsWith(`${basePath}/dcm/progress`) && !pathname.startsWith(`${basePath}/dcm/create`))
            } else if (item.name === "Create Collection") {
              isActive = pathname.startsWith(`${basePath}/dcm/create`)
            } else if (item.name === "Discover Data") {
              isActive = pathname.startsWith(`${basePath}/discover`)
            } else if (item.name === "My Requests") {
              isActive = pathname.startsWith(`${basePath}/my-requests`) || pathname.startsWith(`${basePath}/requests`)
            } else if (item.name === "DCM Propositions") {
              isActive = pathname.startsWith(`${basePath}/dcm/propositions`)
            } else if (item.name === "Analytics") {
              isActive = pathname.startsWith(`${basePath}/dcm/analytics`)
            } else if (item.name === "Browse Collections") {
              isActive = pathname === `${basePath}/collections` || pathname.startsWith(`${basePath}/collections/`)
            } else {
              isActive = pathname === item.href
            }

            const linkContent = (
              <Link
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 py-3 text-sm font-light transition-all rounded-xl relative",
                  isCollapsed ? "justify-center px-2" : "px-4",
                  isActive
                    ? cn("bg-gradient-to-r text-white shadow-md", scheme.from, scheme.to)
                    : "text-neutral-600 hover:bg-neutral-50"
                )}
              >
                <Icon className="size-5 shrink-0" />
                {!isCollapsed && <span className="flex-1">{item.name}</span>}
                {item.name === "Dashboard" && criticalCount > 0 && (
                  <div className={cn(
                    "size-2 rounded-full bg-red-500 animate-pulse shadow-lg",
                    isCollapsed && "absolute top-1 right-1"
                  )} />
                )}
                {item.name === "Notifications" && unreadCount > 0 && (
                  isCollapsed ? (
                    <div className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </div>
                  ) : (
                    <Badge
                      className={cn(
                        "text-xs font-light border-0",
                        isActive
                          ? "bg-white/20 text-white"
                          : cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                      )}
                    >
                      {unreadCount}
                    </Badge>
                  )
                )}
              </Link>
            )

            if (isCollapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="font-light">
                    {item.name}
                  </TooltipContent>
                </Tooltip>
              )
            }

            return <div key={item.name}>{linkContent}</div>
          })}
        </nav>

        {/* Status Card - Hidden when collapsed */}
        {!isCollapsed && (
          <div className="px-3 pb-3">
            <div className={cn("rounded-2xl p-4 bg-gradient-to-br", scheme.bg, scheme.bgHover, "border", scheme.from.replace("from-", "border-").replace("500", "100"))}>
              <div className="flex items-center gap-2 mb-3">
                <Circle className={cn("size-2 animate-pulse fill-current", scheme.from.replace("from-", "text-"))} />
                <span className="text-xs font-light text-neutral-600 uppercase tracking-wider">Collection Stats</span>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-light text-neutral-600">Active</span>
                  <span className="text-sm font-normal text-neutral-900">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-light text-neutral-600">Users Served</span>
                  <span className="text-sm font-normal text-neutral-900">847</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-light text-neutral-600">Auto-Approval</span>
                  <span className="text-sm font-normal text-neutral-900">68%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* User Profile */}
        <div className={cn("border-t border-neutral-100", isCollapsed ? "p-2" : "p-4")}>
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className={cn("flex size-10 mx-auto shrink-0 items-center justify-center rounded-full text-white text-sm font-medium bg-gradient-to-br cursor-default", scheme.from, scheme.to)}>
                  JM
                </div>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-light">
                <p>Jennifer Martinez</p>
                <p className="text-xs text-neutral-500">DCM</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-3">
              <div className={cn("flex size-10 shrink-0 items-center justify-center rounded-full text-white text-sm font-medium bg-gradient-to-br", scheme.from, scheme.to)}>
                JM
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light text-neutral-900">Jennifer Martinez</p>
                <p className="text-xs text-neutral-500">DCM</p>
              </div>
            </div>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleSidebar}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 flex items-center justify-center size-6 rounded-full border border-neutral-200 bg-white shadow-sm hover:bg-neutral-50 transition-colors",
            isCollapsed ? "left-[52px]" : "left-[252px]"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="size-3 text-neutral-600" />
          ) : (
            <ChevronLeft className="size-3 text-neutral-600" />
          )}
        </button>
      </div>
    </TooltipProvider>
  )
}

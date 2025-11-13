"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { useNotifications } from "./notification-context"
import { useColorScheme } from "./ux12-color-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import {
  AlertCircle,
  MessageSquare,
  CheckCircle2,
  Info,
  Clock,
  CheckCheck,
} from "lucide-react"
import { Notification } from "@/lib/dcm-mock-data"

interface NotificationPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NotificationPanel({ open, onOpenChange }: NotificationPanelProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const { scheme } = useColorScheme()
  const router = useRouter()

  // Group notifications by priority
  const criticalNotifications = notifications.filter(
    (n) => n.priority === "critical" && !n.isRead
  )
  const highNotifications = notifications.filter((n) => n.priority === "high" && !n.isRead)
  const mediumNotifications = notifications.filter((n) => n.priority === "medium" && !n.isRead)
  const lowNotifications = notifications.filter((n) => n.priority === "low" && !n.isRead)
  const readNotifications = notifications.filter((n) => n.isRead)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "blocker":
        return AlertCircle
      case "mention":
        return MessageSquare
      case "approval":
        return Clock
      case "update":
        return Info
      case "completion":
        return CheckCircle2
      default:
        return Info
    }
  }

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case "critical":
        return {
          border: "border-l-4 border-red-500",
          bg: "bg-red-50 hover:bg-red-100",
          icon: "text-red-600",
          badge: "bg-red-100 text-red-700 border-red-200",
        }
      case "high":
        return {
          border: "border-l-4 border-amber-500",
          bg: "bg-amber-50 hover:bg-amber-100",
          icon: "text-amber-600",
          badge: "bg-amber-100 text-amber-700 border-amber-200",
        }
      case "medium":
        return {
          border: "border-l-4 border-blue-500",
          bg: "bg-blue-50 hover:bg-blue-100",
          icon: "text-blue-600",
          badge: "bg-blue-100 text-blue-700 border-blue-200",
        }
      case "low":
        return {
          border: "border-l-4 border-green-500",
          bg: "bg-green-50 hover:bg-green-100",
          icon: "text-green-600",
          badge: "bg-green-100 text-green-700 border-green-200",
        }
      default:
        return {
          border: "border-l-4 border-neutral-300",
          bg: "bg-neutral-50 hover:bg-neutral-100",
          icon: "text-neutral-600",
          badge: "bg-neutral-100 text-neutral-700 border-neutral-200",
        }
    }
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    if (seconds < 60) return "Just now"
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id)
    if (notification.actionUrl) {
      // Store collection ID in session storage if it's a collection-specific notification
      if (typeof window !== "undefined") {
        sessionStorage.setItem("dcm_current_collection_id", notification.collectionId)
      }
      onOpenChange(false)
      router.push(notification.actionUrl)
    }
  }

  const NotificationItem = ({ notification }: { notification: Notification }) => {
    const Icon = getNotificationIcon(notification.type)
    const style = getPriorityStyle(notification.priority)

    return (
      <button
        onClick={() => handleNotificationClick(notification)}
        className={cn(
          "w-full p-4 rounded-xl transition-all text-left",
          style.border,
          style.bg,
          !notification.isRead && "shadow-sm"
        )}
      >
        <div className="flex items-start gap-3">
          <Icon className={cn("size-5 shrink-0 mt-0.5", style.icon)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className={cn("text-sm font-normal", !notification.isRead ? "text-neutral-900" : "text-neutral-600")}>
                {notification.title}
              </p>
              {!notification.isRead && (
                <div className="size-2 rounded-full bg-gradient-to-r from-red-500 to-orange-400 shrink-0 mt-1.5" />
              )}
            </div>
            <p className={cn("text-xs font-light mb-2", !notification.isRead ? "text-neutral-700" : "text-neutral-500")}>
              {notification.message}
            </p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-light text-neutral-500">
                {formatTimeAgo(notification.timestamp)}
              </p>
              <Badge
                variant="outline"
                className={cn("text-xs font-light border", style.badge)}
              >
                {notification.collectionName}
              </Badge>
            </div>
          </div>
        </div>
      </button>
    )
  }

  const NotificationSection = ({
    title,
    notifications,
  }: {
    title: string
    notifications: Notification[]
  }) => {
    if (notifications.length === 0) return null

    return (
      <div className="space-y-3">
        <h3 className="text-xs font-normal text-neutral-600 uppercase tracking-wider px-1">
          {title}
        </h3>
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationItem key={notification.id} notification={notification} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[500px] sm:w-[540px] p-0">
        <SheetHeader className="p-6 pb-4 border-b border-neutral-200">
          <div className="flex items-center justify-between">
            <div>
              <SheetTitle className="text-2xl font-extralight text-neutral-900">
                Notifications
              </SheetTitle>
              {unreadCount > 0 && (
                <p className="text-sm font-light text-neutral-600 mt-1">
                  {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={markAllAsRead}
                className="rounded-xl font-light border-neutral-200"
              >
                <CheckCheck className="size-4 mr-2" />
                Mark all read
              </Button>
            )}
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="p-6 space-y-6">
            {unreadCount === 0 && readNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="size-16 text-neutral-300 mb-4" />
                <h3 className="text-lg font-light text-neutral-900 mb-2">All caught up!</h3>
                <p className="text-sm font-light text-neutral-600">
                  No notifications at the moment
                </p>
              </div>
            ) : (
              <>
                <NotificationSection title="Critical" notifications={criticalNotifications} />
                <NotificationSection title="High Priority" notifications={highNotifications} />
                <NotificationSection title="Medium Priority" notifications={mediumNotifications} />
                <NotificationSection title="Low Priority" notifications={lowNotifications} />

                {readNotifications.length > 0 && unreadCount > 0 && (
                  <div className="border-t border-neutral-200 pt-6 mt-6">
                    <NotificationSection title="Earlier" notifications={readNotifications} />
                  </div>
                )}

                {unreadCount === 0 && readNotifications.length > 0 && (
                  <NotificationSection title="All Notifications" notifications={readNotifications} />
                )}
              </>
            )}

            {/* View All Footer */}
            {(unreadCount > 0 || readNotifications.length > 0) && (
              <div className="border-t border-neutral-200 pt-4 mt-6">
                <Link
                  href="/poc/1/notifications"
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    "block w-full text-center py-3 rounded-xl font-light transition-all bg-gradient-to-r text-white",
                    scheme.from,
                    scheme.to
                  )}
                >
                  View All Notifications
                </Link>
              </div>
            )}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}

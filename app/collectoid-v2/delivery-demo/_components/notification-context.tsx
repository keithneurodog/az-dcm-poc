"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import {
  MOCK_NOTIFICATIONS,
  Notification,
} from "@/lib/dcm-mock-data"

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  criticalCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  archiveNotification: (id: string) => void
  archiveMultiple: (ids: string[]) => void
  unarchiveNotification: (id: string) => void
  getUnreadNotifications: () => Notification[]
  getCriticalNotifications: () => Notification[]
  getNotificationsByCollection: (collectionId: string) => Notification[]
  getArchivedNotifications: () => Notification[]
  getActiveNotifications: () => Notification[]
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS)

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif))
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notif) => (!notif.isArchived ? { ...notif, isRead: true } : notif))
    )
  }, [])

  const archiveNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isArchived: true, isRead: true } : notif))
    )
  }, [])

  const archiveMultiple = useCallback((ids: string[]) => {
    setNotifications((prev) =>
      prev.map((notif) =>
        ids.includes(notif.id) ? { ...notif, isArchived: true, isRead: true } : notif
      )
    )
  }, [])

  const unarchiveNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, isArchived: false } : notif))
    )
  }, [])

  const getUnread = useCallback(() => {
    return notifications.filter((n) => !n.isRead && !n.isArchived)
  }, [notifications])

  const getCritical = useCallback(() => {
    return notifications.filter((n) => n.priority === "critical" && !n.isRead && !n.isArchived)
  }, [notifications])

  const getByCollection = useCallback(
    (collectionId: string) => {
      return notifications.filter((n) => n.collectionId === collectionId && !n.isArchived)
    },
    [notifications]
  )

  const getArchived = useCallback(() => {
    return notifications.filter((n) => n.isArchived)
  }, [notifications])

  const getActive = useCallback(() => {
    return notifications.filter((n) => !n.isArchived)
  }, [notifications])

  const unreadCount = notifications.filter((n) => !n.isRead && !n.isArchived).length
  const criticalCount = notifications.filter(
    (n) => n.priority === "critical" && !n.isRead && !n.isArchived
  ).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        criticalCount,
        markAsRead,
        markAllAsRead,
        archiveNotification,
        archiveMultiple,
        unarchiveNotification,
        getUnreadNotifications: getUnread,
        getCriticalNotifications: getCritical,
        getNotificationsByCollection: getByCollection,
        getArchivedNotifications: getArchived,
        getActiveNotifications: getActive,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}

import { Notification } from "./dcm-mock-data"

// Filter notifications by various criteria
export function filterNotifications(
  notifications: Notification[],
  filters: {
    type?: string[] // ["blocker", "mention", etc.]
    priority?: string[] // ["critical", "high", etc.]
    collectionId?: string
    isRead?: boolean | "all"
    includeArchived?: boolean
    dateRange?: "today" | "week" | "month" | "all"
  }
): Notification[] {
  return notifications.filter((notification) => {
    // Archive filter
    if (!filters.includeArchived && notification.isArchived) {
      return false
    }

    // Type filter
    if (filters.type && filters.type.length > 0) {
      if (!filters.type.includes(notification.type)) return false
    }

    // Priority filter
    if (filters.priority && filters.priority.length > 0) {
      if (!filters.priority.includes(notification.priority)) return false
    }

    // Collection filter
    if (filters.collectionId && notification.collectionId !== filters.collectionId) {
      return false
    }

    // Read status filter
    if (filters.isRead !== "all" && filters.isRead !== undefined) {
      if (notification.isRead !== filters.isRead) return false
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== "all") {
      const now = Date.now()
      const timestamp = notification.timestamp.getTime()
      const diff = now - timestamp

      switch (filters.dateRange) {
        case "today":
          if (diff > 86400000) return false // 24 hours
          break
        case "week":
          if (diff > 604800000) return false // 7 days
          break
        case "month":
          if (diff > 2592000000) return false // 30 days
          break
      }
    }

    return true
  })
}

// Search notifications by text
export function searchNotifications(
  notifications: Notification[],
  searchQuery: string
): Notification[] {
  if (!searchQuery.trim()) return notifications

  const query = searchQuery.toLowerCase()

  return notifications.filter(
    (notification) =>
      notification.title.toLowerCase().includes(query) ||
      notification.message.toLowerCase().includes(query) ||
      notification.collectionName.toLowerCase().includes(query) ||
      notification.actors.some(
        (actor) =>
          actor.name.toLowerCase().includes(query) || actor.role.toLowerCase().includes(query)
      )
  )
}

// Sort notifications
export function sortNotifications(
  notifications: Notification[],
  sortBy: "recent" | "oldest" | "priority" | "collection"
): Notification[] {
  const sorted = [...notifications]

  switch (sortBy) {
    case "recent":
      return sorted.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    case "oldest":
      return sorted.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
    case "priority":
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 }
      return sorted.sort((a, b) => {
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (priorityDiff !== 0) return priorityDiff
        // If same priority, sort by timestamp (newest first)
        return b.timestamp.getTime() - a.timestamp.getTime()
      })
    case "collection":
      return sorted.sort((a, b) => {
        const nameCompare = a.collectionName.localeCompare(b.collectionName)
        if (nameCompare !== 0) return nameCompare
        // If same collection, sort by timestamp (newest first)
        return b.timestamp.getTime() - a.timestamp.getTime()
      })
    default:
      return sorted
  }
}

// Group notifications
export function groupNotifications(
  notifications: Notification[],
  groupBy: "priority" | "collection" | "date" | "type"
): { [key: string]: Notification[] } {
  const groups: { [key: string]: Notification[] } = {}

  notifications.forEach((notification) => {
    let key: string

    switch (groupBy) {
      case "priority":
        key = notification.priority.charAt(0).toUpperCase() + notification.priority.slice(1)
        break
      case "collection":
        key = notification.collectionName
        break
      case "type":
        key = notification.type.charAt(0).toUpperCase() + notification.type.slice(1)
        break
      case "date":
        key = getDateGroup(notification.timestamp)
        break
      default:
        key = "Other"
    }

    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(notification)
  })

  // Sort groups by priority order
  if (groupBy === "priority") {
    const orderedGroups: { [key: string]: Notification[] } = {}
    const order = ["Critical", "High", "Medium", "Low"]
    order.forEach((key) => {
      if (groups[key]) {
        orderedGroups[key] = groups[key]
      }
    })
    return orderedGroups
  }

  return groups
}

// Get date group label
function getDateGroup(timestamp: Date): string {
  const now = new Date()
  const diff = now.getTime() - timestamp.getTime()

  if (diff < 86400000) {
    // Less than 24 hours
    return "Today"
  } else if (diff < 172800000) {
    // Less than 48 hours
    return "Yesterday"
  } else if (diff < 604800000) {
    // Less than 7 days
    return "This Week"
  } else {
    return "Earlier"
  }
}

// Format relative time
export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return "Just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 172800) return "Yesterday"
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// Get notification stats
export function getNotificationStats(notifications: Notification[]) {
  const active = notifications.filter((n) => !n.isArchived)

  return {
    total: active.length,
    unread: active.filter((n) => !n.isRead).length,
    critical: active.filter((n) => n.priority === "critical" && !n.isRead).length,
    mentions: active.filter((n) => n.type === "mention" && !n.isRead).length,
    approvals: active.filter((n) => n.type === "approval" && !n.isRead).length,
    blockers: active.filter((n) => n.type === "blocker" && !n.isRead).length,
  }
}

// Get unique collections from notifications
export function getUniqueCollections(notifications: Notification[]): Array<{
  id: string
  name: string
  count: number
}> {
  const collectionMap = new Map<string, { id: string; name: string; count: number }>()

  notifications.forEach((notification) => {
    if (!notification.isArchived) {
      const existing = collectionMap.get(notification.collectionId)
      if (existing) {
        existing.count++
      } else {
        collectionMap.set(notification.collectionId, {
          id: notification.collectionId,
          name: notification.collectionName,
          count: 1,
        })
      }
    }
  })

  return Array.from(collectionMap.values()).sort((a, b) => b.count - a.count)
}

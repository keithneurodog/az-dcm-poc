"use client"

import { useMemo, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useColorScheme } from "@/app/collectoid/_components"
import { cn } from "@/lib/utils"
import {
  CheckCircle2,
  Zap,
  Clock,
  GraduationCap,
  Users,
  ChevronRight,
  ChevronLeft,
  X,
  Search,
  Building2,
  Mail,
} from "lucide-react"
import { MOCK_COLLECTIONS, Collection } from "@/lib/dcm-mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AccessCategory {
  key: "immediate" | "instantGrant" | "pendingApproval" | "needsTraining" | "locationRestricted"
  label: string
  description: string
  icon: typeof CheckCircle2
  color: string
  bgColor: string
  textColor: string
}

const ACCESS_CATEGORIES: AccessCategory[] = [
  {
    key: "immediate",
    label: "Has Access",
    description: "Users with current access",
    icon: CheckCircle2,
    color: "bg-emerald-400",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-600",
  },
  {
    key: "instantGrant",
    label: "Policy",
    description: "Awaiting policy configuration",
    icon: Zap,
    color: "bg-blue-400",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
  },
  {
    key: "pendingApproval",
    label: "Pending Approval",
    description: "Awaiting approval",
    icon: Clock,
    color: "bg-amber-400",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
  },
  {
    key: "needsTraining",
    label: "Training",
    description: "Requires training completion",
    icon: GraduationCap,
    color: "bg-purple-400",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
  },
  {
    key: "locationRestricted",
    label: "Geo-Restricted",
    description: "Data residency requirements",
    icon: Building2,
    color: "bg-neutral-400",
    bgColor: "bg-neutral-50",
    textColor: "text-neutral-600",
  },
]

interface CollectionAccessData {
  id: string
  name: string
  totalUsers: number
  usersWithAccess: number
  accessBreakdown: {
    immediate: number
    instantGrant: number
    pendingApproval: number
    needsTraining: number
    locationRestricted: number
  }
  fulfillmentRate: number
}

// Mock user data generator for the modal
interface MockUser {
  id: string
  name: string
  email: string
  department: string
  status: "immediate" | "instantGrant" | "pendingApproval" | "needsTraining" | "locationRestricted"
  requestDate?: string
  accessGrantedDate?: string
}

const DEPARTMENTS = ["Research", "Clinical Ops", "Data Science", "Biostatistics", "Medical Affairs", "Regulatory", "Pharmacovigilance"]
const FIRST_NAMES = ["Sarah", "James", "Emily", "Michael", "Jessica", "David", "Amanda", "Chris", "Rachel", "Daniel", "Laura", "Kevin", "Nicole", "Brian", "Melissa"]
const LAST_NAMES = ["Chen", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Anderson", "Taylor", "Thomas", "Moore", "Jackson"]

function generateMockUsers(collection: CollectionAccessData): MockUser[] {
  const users: MockUser[] = []
  const totalToGenerate = collection.totalUsers

  const statusCounts = {
    immediate: Math.round(totalToGenerate * collection.accessBreakdown.immediate / 100),
    instantGrant: Math.round(totalToGenerate * collection.accessBreakdown.instantGrant / 100),
    pendingApproval: Math.round(totalToGenerate * collection.accessBreakdown.pendingApproval / 100),
    needsTraining: Math.round(totalToGenerate * collection.accessBreakdown.needsTraining / 100),
    locationRestricted: Math.round(totalToGenerate * collection.accessBreakdown.locationRestricted / 100),
  }

  let userId = 1
  for (const [status, count] of Object.entries(statusCounts)) {
    for (let i = 0; i < count && users.length < totalToGenerate; i++) {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)]
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)]
      const dept = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)]

      users.push({
        id: `user-${userId++}`,
        name: `${firstName} ${lastName}`,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@company.com`,
        department: dept,
        status: status as MockUser["status"],
        requestDate: status !== "immediate" ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}` : undefined,
        accessGrantedDate: status === "immediate" ? `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}` : undefined,
      })
    }
  }

  return users.sort((a, b) => {
    const statusOrder = { immediate: 0, instantGrant: 1, pendingApproval: 2, needsTraining: 3, locationRestricted: 4 }
    return statusOrder[a.status] - statusOrder[b.status]
  })
}

const USERS_PER_PAGE = 15

export function AccessFulfillment() {
  const { scheme } = useColorScheme()
  const [selectedCollection, setSelectedCollection] = useState<CollectionAccessData | null>(null)
  const [modalPage, setModalPage] = useState(1)
  const [modalFilter, setModalFilter] = useState<"all" | MockUser["status"]>("all")
  const [modalSearch, setModalSearch] = useState("")

  // Generate users for selected collection (memoized)
  const modalUsers = useMemo(() => {
    if (!selectedCollection) return []
    return generateMockUsers(selectedCollection)
  }, [selectedCollection])

  // Filter and paginate users
  const filteredUsers = useMemo(() => {
    let users = modalUsers
    if (modalFilter !== "all") {
      users = users.filter(u => u.status === modalFilter)
    }
    if (modalSearch) {
      const search = modalSearch.toLowerCase()
      users = users.filter(u =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.department.toLowerCase().includes(search)
      )
    }
    return users
  }, [modalUsers, modalFilter, modalSearch])

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)
  const paginatedUsers = filteredUsers.slice((modalPage - 1) * USERS_PER_PAGE, modalPage * USERS_PER_PAGE)

  // Reset page when filter/search changes
  const handleFilterChange = (filter: typeof modalFilter) => {
    setModalFilter(filter)
    setModalPage(1)
  }

  const handleSearchChange = (search: string) => {
    setModalSearch(search)
    setModalPage(1)
  }

  const openModal = (collection: CollectionAccessData) => {
    setSelectedCollection(collection)
    setModalPage(1)
    setModalFilter("all")
    setModalSearch("")
  }

  // Calculate access fulfillment data from collections
  const collectionData = useMemo((): CollectionAccessData[] => {
    return MOCK_COLLECTIONS.map((collection: Collection): CollectionAccessData => {
      // Convert old 4-category breakdown to new 5-category, splitting dataDiscovery
      const oldBreakdown = collection.accessBreakdown ?? {
        immediate: 25,
        instantGrant: 25,
        pendingApproval: 25,
        dataDiscovery: 25,
      }

      // Split the old dataDiscovery into needsTraining (60%) and locationRestricted (40%)
      const accessBreakdown = {
        immediate: oldBreakdown.immediate,
        instantGrant: oldBreakdown.instantGrant,
        pendingApproval: oldBreakdown.pendingApproval,
        needsTraining: Math.round(oldBreakdown.dataDiscovery * 0.6),
        locationRestricted: Math.round(oldBreakdown.dataDiscovery * 0.4),
      }

      // Fulfillment = immediate + instantGrant (users who have or can quickly get access)
      const fulfillmentRate = accessBreakdown.immediate + accessBreakdown.instantGrant

      return {
        id: collection.id,
        name: collection.name,
        totalUsers: collection.totalUsers,
        usersWithAccess: collection.usersWithAccess,
        accessBreakdown,
        fulfillmentRate,
      }
    }).sort((a: CollectionAccessData, b: CollectionAccessData) => a.fulfillmentRate - b.fulfillmentRate) // Sort by lowest fulfillment first
  }, [])

  // Calculate aggregate stats
  const aggregateStats = useMemo(() => {
    const totalUsers = collectionData.reduce((sum: number, c: CollectionAccessData) => sum + c.totalUsers, 0)
    const totalWithAccess = collectionData.reduce((sum: number, c: CollectionAccessData) => sum + c.usersWithAccess, 0)
    const avgFulfillment = collectionData.reduce((sum: number, c: CollectionAccessData) => sum + c.fulfillmentRate, 0) / collectionData.length

    // Weighted average by users
    const weightedAvg = totalUsers > 0
      ? collectionData.reduce((sum: number, c: CollectionAccessData) => sum + (c.fulfillmentRate * c.totalUsers), 0) / totalUsers
      : 0

    const avgBreakdown = {
      immediate: Math.round(collectionData.reduce((sum: number, c: CollectionAccessData) => sum + c.accessBreakdown.immediate, 0) / collectionData.length),
      instantGrant: Math.round(collectionData.reduce((sum: number, c: CollectionAccessData) => sum + c.accessBreakdown.instantGrant, 0) / collectionData.length),
      pendingApproval: Math.round(collectionData.reduce((sum: number, c: CollectionAccessData) => sum + c.accessBreakdown.pendingApproval, 0) / collectionData.length),
      needsTraining: Math.round(collectionData.reduce((sum: number, c: CollectionAccessData) => sum + c.accessBreakdown.needsTraining, 0) / collectionData.length),
      locationRestricted: Math.round(collectionData.reduce((sum: number, c: CollectionAccessData) => sum + c.accessBreakdown.locationRestricted, 0) / collectionData.length),
    }

    return {
      totalUsers,
      totalWithAccess,
      avgFulfillment: Math.round(avgFulfillment),
      weightedAvg: Math.round(weightedAvg),
      avgBreakdown,
      collectionsAtRisk: collectionData.filter((c: CollectionAccessData) => c.fulfillmentRate < 50).length,
    }
  }, [collectionData])

  return (
    <div className="rounded-2xl border border-neutral-100 bg-white overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-neutral-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl bg-gradient-to-br shadow-sm", scheme.from, scheme.to)}>
              <Users className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-light text-neutral-900">Access Fulfillment</h3>
              <p className="text-xs font-light text-neutral-500">Users with access vs. those waiting across collections</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-4xl font-extralight text-neutral-900">{aggregateStats.weightedAvg}%</p>
            <p className="text-xs font-light text-neutral-400 uppercase tracking-wider">fulfillment</p>
          </div>
        </div>
      </div>

      {/* Aggregate Breakdown Bar */}
      <div className="px-6 py-5 bg-gradient-to-br from-neutral-50/80 to-white">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-light text-neutral-500 uppercase tracking-wider">Access Breakdown</span>
          {aggregateStats.collectionsAtRisk > 0 && (
            <span className="text-xs font-light text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
              {aggregateStats.collectionsAtRisk} collection{aggregateStats.collectionsAtRisk > 1 ? 's' : ''} below 50%
            </span>
          )}
        </div>
        <div className="h-8 rounded-full overflow-hidden flex shadow-inner bg-neutral-100">
          {ACCESS_CATEGORIES.map((category, index) => {
            const value = aggregateStats.avgBreakdown[category.key]
            return (
              <motion.div
                key={category.key}
                className={cn("h-full flex items-center justify-center", category.color)}
                style={{ width: `${value}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                {value >= 15 && (
                  <span className="text-xs font-light text-white">{value}%</span>
                )}
              </motion.div>
            )
          })}
        </div>
        <div className="flex items-center justify-between mt-4">
          {ACCESS_CATEGORIES.map((category) => {
            const Icon = category.icon
            return (
              <div key={category.key} className="flex items-center gap-1.5">
                <div className={cn("w-2.5 h-2.5 rounded-full", category.color)} />
                <Icon className={cn("size-3", category.textColor)} />
                <span className="text-xs font-light text-neutral-500">{category.label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Collections List - Top 5 needing attention */}
      <div className="px-6 py-5">
        <p className="text-xs font-light text-neutral-500 uppercase tracking-wider mb-4">Collections Needing Attention</p>
        <div className="space-y-2">
          {collectionData.slice(0, 5).map((collection, index) => (
            <motion.div
              key={collection.id}
              onClick={() => openModal(collection)}
              className="flex items-center gap-4 p-3.5 rounded-xl bg-neutral-50/70 hover:bg-neutral-100/80 hover:shadow-sm transition-all cursor-pointer group"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Fulfillment indicator */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center text-sm font-light",
                collection.fulfillmentRate >= 70 ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                collection.fulfillmentRate >= 50 ? "bg-amber-50 text-amber-600 border border-amber-100" :
                "bg-red-50 text-red-500 border border-red-100"
              )}>
                {collection.fulfillmentRate}%
              </div>

              {/* Collection info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light text-neutral-900 truncate">
                  {collection.name}
                </p>
                <p className="text-xs font-light text-neutral-400">
                  {collection.usersWithAccess} of {collection.totalUsers} users have access
                </p>
              </div>

              {/* Mini breakdown bar */}
              <div className="w-32 h-2 rounded-full overflow-hidden flex bg-neutral-200/60">
                {ACCESS_CATEGORIES.map((category) => {
                  const value = collection.accessBreakdown[category.key]
                  return (
                    <div
                      key={category.key}
                      className={category.color}
                      style={{ width: `${value}%` }}
                    />
                  )
                })}
              </div>

              <ChevronRight className="size-4 text-neutral-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {selectedCollection && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCollection(null)}
            />

            {/* Modal */}
            <motion.div
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] max-h-[80vh] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              {/* Compact Header */}
              <div className="px-5 py-3 border-b border-neutral-100 shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center text-sm font-light",
                      selectedCollection.fulfillmentRate >= 70 ? "bg-emerald-50 text-emerald-600" :
                      selectedCollection.fulfillmentRate >= 50 ? "bg-amber-50 text-amber-600" :
                      "bg-red-50 text-red-500"
                    )}>
                      {selectedCollection.fulfillmentRate}%
                    </div>
                    <div>
                      <h2 className="text-base font-light text-neutral-900">{selectedCollection.name}</h2>
                      <p className="text-xs font-light text-neutral-400">
                        {selectedCollection.totalUsers.toLocaleString()} users · {selectedCollection.usersWithAccess.toLocaleString()} with access
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCollection(null)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <X className="size-4 text-neutral-400" />
                  </button>
                </div>

                {/* Inline breakdown + filters */}
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-2 rounded-full overflow-hidden flex bg-neutral-100">
                    {ACCESS_CATEGORIES.map((category) => (
                      <div
                        key={category.key}
                        className={category.color}
                        style={{ width: `${selectedCollection.accessBreakdown[category.key]}%` }}
                      />
                    ))}
                  </div>
                  <div className="relative w-44">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-neutral-400" />
                    <Input
                      placeholder="Search..."
                      value={modalSearch}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      className="pl-8 h-7 text-xs font-light rounded-lg border-neutral-200"
                    />
                  </div>
                </div>

                {/* Filter tabs */}
                <div className="flex items-center gap-1 mt-3">
                  <button
                    onClick={() => handleFilterChange("all")}
                    className={cn(
                      "px-2.5 py-1 rounded-md text-xs font-light transition-all",
                      modalFilter === "all"
                        ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                        : "text-neutral-500 hover:bg-neutral-100"
                    )}
                  >
                    All
                  </button>
                  {ACCESS_CATEGORIES.map((category) => {
                    const count = modalUsers.filter(u => u.status === category.key).length
                    const Icon = category.icon
                    return (
                      <button
                        key={category.key}
                        onClick={() => handleFilterChange(category.key)}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-light transition-all flex items-center gap-1",
                          modalFilter === category.key
                            ? cn(category.bgColor, category.textColor)
                            : "text-neutral-500 hover:bg-neutral-100"
                        )}
                      >
                        <Icon className="size-3" />
                        {count}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Compact User List */}
              <div className="flex-1 overflow-auto">
                <table className="w-full text-xs">
                  <thead className="bg-neutral-50 sticky top-0">
                    <tr className="text-left text-neutral-500 font-light">
                      <th className="px-4 py-2">User</th>
                      <th className="px-4 py-2">Department</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {paginatedUsers.map((user) => {
                      const category = ACCESS_CATEGORIES.find(c => c.key === user.status)!
                      return (
                        <tr key={user.id} className="hover:bg-neutral-50/50">
                          <td className="px-4 py-2">
                            <p className="font-light text-neutral-900">{user.name}</p>
                            <p className="text-neutral-400">{user.email}</p>
                          </td>
                          <td className="px-4 py-2 text-neutral-600 font-light">{user.department}</td>
                          <td className="px-4 py-2">
                            <span className={cn(
                              "inline-flex px-2 py-0.5 rounded-full font-light",
                              category.bgColor, category.textColor
                            )}>
                              {category.label}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right text-neutral-400 font-light">
                            {user.requestDate || user.accessGrantedDate || "—"}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>

                {paginatedUsers.length === 0 && (
                  <div className="text-center py-8 text-neutral-400 font-light text-sm">
                    No users found
                  </div>
                )}
              </div>

              {/* Compact Pagination */}
              {totalPages > 1 && (
                <div className="px-4 py-2 border-t border-neutral-100 shrink-0 flex items-center justify-between text-xs">
                  <span className="font-light text-neutral-500">
                    {((modalPage - 1) * USERS_PER_PAGE) + 1}-{Math.min(modalPage * USERS_PER_PAGE, filteredUsers.length)} of {filteredUsers.length}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setModalPage(p => Math.max(1, p - 1))}
                      disabled={modalPage === 1}
                      className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-30"
                    >
                      <ChevronLeft className="size-4" />
                    </button>
                    <span className="px-2 font-light text-neutral-600">{modalPage} / {totalPages}</span>
                    <button
                      onClick={() => setModalPage(p => Math.min(totalPages, p + 1))}
                      disabled={modalPage === totalPages}
                      className="p-1.5 rounded-md hover:bg-neutral-100 disabled:opacity-30"
                    >
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

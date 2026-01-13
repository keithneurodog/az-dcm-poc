"use client"

import { createContext, useContext, useState, ReactNode } from "react"
import { CollectionV2, CollectionState, getCollectionV2ById } from "@/lib/collection-v2-mock-data"

interface CollectionContextValue {
  collection: CollectionV2 | null
  isLoading: boolean
  activeTab: string
  setActiveTab: (tab: string) => void
  updateState: (newState: CollectionState) => void
  refreshCollection: () => void
}

const CollectionContext = createContext<CollectionContextValue | null>(null)

export function CollectionProvider({
  children,
  collectionId
}: {
  children: ReactNode
  collectionId: string
}) {
  const [collection, setCollection] = useState<CollectionV2 | null>(() =>
    getCollectionV2ById(collectionId)
  )
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")

  const updateState = (newState: CollectionState) => {
    if (collection) {
      setCollection({ ...collection, state: newState, updatedAt: new Date().toISOString() })
    }
  }

  const refreshCollection = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setCollection(getCollectionV2ById(collectionId))
      setIsLoading(false)
    }, 300)
  }

  return (
    <CollectionContext.Provider value={{
      collection,
      isLoading,
      activeTab,
      setActiveTab,
      updateState,
      refreshCollection
    }}>
      {children}
    </CollectionContext.Provider>
  )
}

export function useCollection() {
  const context = useContext(CollectionContext)
  if (!context) {
    throw new Error("useCollection must be used within a CollectionProvider")
  }
  return context
}

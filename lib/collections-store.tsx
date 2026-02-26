"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import { Collection, MOCK_COLLECTIONS, CURRENT_USER_ID } from "./dcm-mock-data"

interface CollectionsStoreContextValue {
  collections: Collection[]
  addCollection: (collection: Collection) => void
  updateCollection: (id: string, updates: Partial<Collection>) => void
  getCollection: (id: string) => Collection | undefined
}

const CollectionsStoreContext = createContext<CollectionsStoreContextValue | null>(null)

export function useCollectionsStore() {
  const context = useContext(CollectionsStoreContext)
  if (!context) {
    throw new Error("useCollectionsStore must be used within CollectionsStoreProvider")
  }
  return context
}

export function CollectionsStoreProvider({ children }: { children: ReactNode }) {
  const [collections, setCollections] = useState<Collection[]>(() => [...MOCK_COLLECTIONS])

  const addCollection = useCallback((collection: Collection) => {
    setCollections(prev => [...prev, collection])
  }, [])

  const updateCollection = useCallback((id: string, updates: Partial<Collection>) => {
    setCollections(prev =>
      prev.map(col => (col.id === id ? { ...col, ...updates } : col))
    )
  }, [])

  const getCollection = useCallback(
    (id: string) => collections.find(col => col.id === id),
    [collections]
  )

  return (
    <CollectionsStoreContext.Provider
      value={{ collections, addCollection, updateCollection, getCollection }}
    >
      {children}
    </CollectionsStoreContext.Provider>
  )
}

// Helper hooks for common queries

export function useBrowserCollections() {
  const { collections } = useCollectionsStore()
  // Browser shows: all non-concept collections (draft + active + provisioning + pending_approval)
  // Concept collections are private to the workspace
  return collections.filter(col => col.status !== "concept")
}

export function useMyDraftCollections() {
  const { collections } = useCollectionsStore()
  return collections.filter(
    col => col.creatorId === CURRENT_USER_ID && (col.status === "concept" || col.status === "draft")
  )
}

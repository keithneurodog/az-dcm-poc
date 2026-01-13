"use client"

import { use } from "react"
import {
  CollectionProvider,
  CollectionHeader,
  TabNavigation,
  TabContent,
} from "../_components"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function CollectionManagePage({ params }: PageProps) {
  const { id } = use(params)

  return (
    <CollectionProvider collectionId={id}>
      <div className="min-h-screen -mx-6 xl:-mx-12 -my-6 xl:-my-8">
        <CollectionHeader />
        <TabNavigation />
        <div className="px-6 xl:px-12 py-6">
          <div className="max-w-4xl">
            <TabContent />
          </div>
        </div>
      </div>
    </CollectionProvider>
  )
}

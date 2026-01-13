"use client"

import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid/_components"
import { useCollection } from "./collection-context"
import { StateBadge } from "./state-badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2, MoreHorizontal } from "lucide-react"
import Link from "next/link"

export function CollectionHeader() {
  const { scheme } = useColorScheme()
  const { collection } = useCollection()

  if (!collection) return null

  return (
    <div className="bg-white border-b border-neutral-200 px-6 py-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {/* Back button */}
          <Link
            href="/collectoid"
            className="mt-1 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <ArrowLeft className="size-5 text-neutral-500" strokeWidth={1.5} />
          </Link>

          {/* Title and description */}
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-light text-neutral-900">
                {collection.name}
              </h1>
              <StateBadge state={collection.state} size="md" />
            </div>
            <p className="text-sm font-light text-neutral-500 max-w-2xl">
              {collection.description}
            </p>
            <p className="text-xs text-neutral-400">
              Created by {collection.createdBy} · Last updated{" "}
              {new Date(collection.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {collection.state === "draft" && (
            <Button
              variant="outline"
              size="sm"
              className="rounded-full font-light"
            >
              <Share2 className="size-4 mr-2" strokeWidth={1.5} />
              Make Public
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
          >
            <MoreHorizontal className="size-5" strokeWidth={1.5} />
          </Button>
        </div>
      </div>
    </div>
  )
}

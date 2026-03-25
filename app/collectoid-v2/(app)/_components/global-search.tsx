"use client"

import { useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  Database,
  FlaskConical,
  FileText,
  GitBranch,
  ChevronRight,
} from "lucide-react"
import {
  MOCK_COLLECTIONS,
  MOCK_PROPOSITIONS,
  MOCK_REQUESTS,
  getAllCollectionMembers,
} from "@/lib/dcm-mock-data"

// --- Types ---

type GlobalMatchCategory = "Collection" | "Dataset" | "Request" | "Proposition"

interface GlobalMatchItem {
  category: GlobalMatchCategory
  label: string
  sublabel: string
  href: string
  status?: string
}

// --- Highlight component ---

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase())
  if (idx === -1) return <span className="truncate">{text}</span>
  return (
    <span className="truncate">
      {text.slice(0, idx)}
      <mark className="bg-amber-100 text-amber-900 rounded-sm px-0.5 font-normal">{text.slice(idx, idx + query.length)}</mark>
      {text.slice(idx + query.length)}
    </span>
  )
}

// --- Search hook ---

export function useGlobalSearch(query: string) {
  const allMembers = useMemo(() => getAllCollectionMembers(), [])

  return useMemo(() => {
    if (!query || query.length < 2) return null
    const q = query.toLowerCase()
    const results: GlobalMatchItem[] = []

    // Track which collections have already been added to avoid duplicates
    const seenCollectionIds = new Set<string>()

    // Collections: match on name, description, createdBy, tags, TAs
    for (const col of MOCK_COLLECTIONS) {
      let matchReason = ""
      if (col.name.toLowerCase().includes(q)) matchReason = ""
      else if (col.description.toLowerCase().includes(q)) matchReason = "Matched in description"
      else if (col.createdBy.toLowerCase().includes(q)) matchReason = `Owner: ${col.createdBy}`
      else if (col.tags.some(t => t.toLowerCase().includes(q))) matchReason = `Tag: ${col.tags.find(t => t.toLowerCase().includes(q))}`
      else if (col.therapeuticAreas.some(ta => ta.toLowerCase().includes(q))) matchReason = `Area: ${col.therapeuticAreas.find(ta => ta.toLowerCase().includes(q))}`
      else continue

      seenCollectionIds.add(col.id)
      const detail = [
        `${col.totalDatasets} datasets`,
        `${col.totalUsers} users`,
        col.therapeuticAreas[0],
      ].filter(Boolean).join(" \u00b7 ")
      results.push({
        category: "Collection",
        label: col.name,
        sublabel: matchReason || detail,
        href: `/collectoid-v2/collections/${col.id}`,
      })
    }

    // Collections: match via member (user name, email, prid, role)
    for (const m of allMembers) {
      if (seenCollectionIds.has(m.collectionId)) continue
      let matchedField = ""
      if (m.name.toLowerCase().includes(q)) matchedField = `Member: ${m.name}`
      else if (m.email.toLowerCase().includes(q)) matchedField = `Member: ${m.email}`
      else if (m.prid.toLowerCase().includes(q)) matchedField = `Member: ${m.name} (${m.prid})`
      else if (m.role.toLowerCase().includes(q)) matchedField = `Member role: ${m.role} (${m.name})`
      else continue

      seenCollectionIds.add(m.collectionId)
      results.push({
        category: "Collection",
        label: m.collectionName,
        sublabel: matchedField,
        href: `/collectoid-v2/collections/${m.collectionId}?tab=users&q=${encodeURIComponent(query)}`,
      })
    }

    // Datasets (deduplicated, with parent collection context) → navigate to datasets tab
    const seenDatasets = new Set<string>()
    for (const col of MOCK_COLLECTIONS) {
      for (const d of col.selectedDatasets) {
        if (seenDatasets.has(d.code)) continue
        if (d.code.toLowerCase().includes(q) || d.name.toLowerCase().includes(q)) {
          seenDatasets.add(d.code)
          results.push({
            category: "Dataset",
            label: `${d.code} \u2014 ${d.name}`,
            sublabel: `in ${col.name}`,
            href: `/collectoid-v2/collections/${col.id}?tab=datasets&q=${encodeURIComponent(query)}`,
          })
        }
      }
    }

    // Requests: match on collection/proposition name
    for (const req of MOCK_REQUESTS) {
      const name = req.type === "simple" ? req.collectionName : req.propositionName
      if (name && name.toLowerCase().includes(q)) {
        results.push({
          category: "Request",
          label: name,
          sublabel: `${req.id} \u00b7 ${req.progress}% complete`,
          href: "/collectoid-v2/my-requests",
          status: req.status.replace(/_/g, " "),
        })
      }
    }

    // Propositions: match on name, parentCollection, requester name, dataset codes → navigate to review page
    for (const prop of MOCK_PROPOSITIONS) {
      let matchReason = ""
      if (prop.name.toLowerCase().includes(q)) matchReason = ""
      else if (prop.parentCollection && prop.parentCollection.toLowerCase().includes(q)) matchReason = `Parent: ${prop.parentCollection}`
      else if (prop.requester.name.toLowerCase().includes(q)) matchReason = `Requester: ${prop.requester.name}`
      else if (prop.changes.datasetCodes?.some(code => code.toLowerCase().includes(q))) matchReason = `Dataset: ${prop.changes.datasetCodes.find(code => code.toLowerCase().includes(q))}`
      else continue

      results.push({
        category: "Proposition",
        label: prop.name,
        sublabel: matchReason || (prop.parentCollection ? `for ${prop.parentCollection}` : "New collection"),
        href: `/collectoid-v2/dcm/propositions/${prop.id}/review`,
        status: prop.status.replace(/_/g, " "),
      })
    }

    return {
      Collection: results.filter(r => r.category === "Collection"),
      Dataset: results.filter(r => r.category === "Dataset"),
      Request: results.filter(r => r.category === "Request"),
      Proposition: results.filter(r => r.category === "Proposition"),
    }
  }, [query, allMembers])
}

// --- Panel component ---

const CATEGORY_CONFIG: Record<GlobalMatchCategory, { label: string; icon: typeof Database }> = {
  Collection: { label: "Collections", icon: Database },
  Dataset: { label: "Datasets", icon: FlaskConical },
  Request: { label: "Requests", icon: FileText },
  Proposition: { label: "Propositions", icon: GitBranch },
}

const CATEGORIES: GlobalMatchCategory[] = ["Collection", "Dataset", "Request", "Proposition"]
const MAX_PER_CATEGORY = 5

const STATUS_COLORS: Record<string, string> = {
  "pending": "bg-amber-100 text-amber-700",
  "in review": "bg-blue-100 text-blue-700",
  "under review": "bg-blue-100 text-blue-700",
  "partial access": "bg-amber-100 text-amber-700",
  "action required": "bg-red-100 text-red-700",
  "approved": "bg-green-100 text-green-700",
  "completed": "bg-green-100 text-green-700",
}

export function GlobalSearchPanel({
  matches,
  query,
  onSelect,
}: {
  matches: Record<GlobalMatchCategory, GlobalMatchItem[]>
  query: string
  onSelect: (href: string) => void
}) {
  const hasAny = CATEGORIES.some(cat => matches[cat].length > 0)

  if (!hasAny) {
    return (
      <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-xl border border-neutral-200 shadow-xl z-50 px-4 py-4">
        <p className="text-sm text-neutral-400">No results for &ldquo;{query}&rdquo;</p>
      </div>
    )
  }

  return (
    <div className="absolute top-full left-0 mt-1.5 w-full bg-white rounded-xl border border-neutral-200 shadow-xl z-50 overflow-hidden max-h-[28rem] overflow-y-auto">
      {CATEGORIES.map(cat => {
        const items = matches[cat]
        if (items.length === 0) return null
        const visible = items.slice(0, MAX_PER_CATEGORY)
        const overflow = items.length - MAX_PER_CATEGORY
        const Icon = CATEGORY_CONFIG[cat].icon

        return (
          <div key={cat} className="border-b border-neutral-100 last:border-b-0">
            <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
              <Icon className="size-3.5 text-neutral-400" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">{CATEGORY_CONFIG[cat].label}</span>
              <span className="text-[10px] text-neutral-300 ml-auto">{items.length} found</span>
            </div>
            {visible.map((item, idx) => (
              <button
                key={idx}
                type="button"
                onMouseDown={(e) => { e.preventDefault(); onSelect(item.href) }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-neutral-50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-neutral-800 truncate">
                      <HighlightMatch text={item.label} query={query} />
                    </span>
                    {item.status && (
                      <Badge className={cn("text-[10px] py-0 px-1.5 font-normal capitalize shrink-0", STATUS_COLORS[item.status] || "bg-neutral-100 text-neutral-600")}>
                        {item.status}
                      </Badge>
                    )}
                  </div>
                  <p className="text-[12px] text-neutral-400 truncate mt-0.5">
                    <HighlightMatch text={item.sublabel} query={query} />
                  </p>
                </div>
                <ChevronRight className="size-3.5 text-neutral-300 group-hover:text-neutral-500 shrink-0 transition-colors" />
              </button>
            ))}
            {overflow > 0 && (
              <div className="px-4 pb-2 text-[11px] text-neutral-400">+{overflow} more</div>
            )}
          </div>
        )
      })}
    </div>
  )
}

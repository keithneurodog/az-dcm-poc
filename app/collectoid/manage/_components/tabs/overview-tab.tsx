// app/collectoid/manage/_components/tabs/overview-tab.tsx
"use client"

import { cn } from "@/lib/utils"
import { useColorScheme } from "@/app/collectoid/_components"
import { useCollection } from "../collection-context"
import { getReadinessItems, isReadyForAip } from "@/lib/collection-v2-mock-data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  CheckCircle2,
  Circle,
  Sparkles,
  HelpCircle,
  ArrowRight,
  Bot,
  MessageSquare,
} from "lucide-react"

export function OverviewTab() {
  const { scheme } = useColorScheme()
  const { collection, setActiveTab } = useCollection()

  if (!collection) return null

  const readinessItems = getReadinessItems(collection)
  const completedCount = readinessItems.filter((item) => item.complete).length
  const isReady = isReadyForAip(collection)

  return (
    <div className="space-y-6">
      {/* AI Summary Card */}
      <Card className="border-neutral-200 rounded-xl overflow-hidden">
        <CardHeader className={cn("pb-3 bg-gradient-to-r", scheme.bg)}>
          <CardTitle className="flex items-center gap-2 text-base font-light">
            <Bot className={cn("size-5", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
            AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="text-sm font-light text-neutral-600 leading-relaxed">
            This collection focuses on <span className="font-normal text-neutral-900">biomarker analysis</span> with{" "}
            <span className="font-normal text-neutral-900">{collection.datasetCount} datasets</span> currently included.
            {!collection.hasUsers && (
              <> You still need to <span className="font-normal text-neutral-900">define who can access the data</span>.</>
            )}
            {!collection.hasTerms && (
              <> You also need to <span className="font-normal text-neutral-900">select data use terms</span>.</>
            )}
            {isReady && (
              <> The collection is <span className="font-normal text-emerald-600">ready for AiP submission</span>.</>
            )}
          </p>
          <button className="mt-3 flex items-center gap-1.5 text-sm font-light text-neutral-500 hover:text-neutral-700 transition-colors">
            <MessageSquare className="size-4" strokeWidth={1.5} />
            Ask AI a question
            <ArrowRight className="size-3" strokeWidth={1.5} />
          </button>
        </CardContent>
      </Card>

      {/* Readiness Checklist */}
      <Card className="border-neutral-200 rounded-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-light">Ready for AiP?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {readinessItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between py-2"
            >
              <div className="flex items-center gap-3">
                {item.complete ? (
                  <CheckCircle2 className="size-5 text-emerald-500" strokeWidth={1.5} />
                ) : (
                  <Circle className="size-5 text-neutral-300" strokeWidth={1.5} />
                )}
                <span
                  className={cn(
                    "text-sm font-light",
                    item.complete ? "text-neutral-600" : "text-neutral-900"
                  )}
                >
                  {item.label}
                  {item.label === "At least one dataset" && collection.datasetCount > 0 && (
                    <span className="text-neutral-500"> ({collection.datasetCount} added)</span>
                  )}
                  {item.label === "User scope defined" && collection.userCount > 0 && (
                    <span className="text-neutral-500"> ({collection.userCount} users)</span>
                  )}
                </span>
              </div>
              {!item.complete && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-light rounded-full"
                  onClick={() => setActiveTab(item.link)}
                >
                  Go to {item.link}
                  <ArrowRight className="size-3 ml-1" strokeWidth={1.5} />
                </Button>
              )}
            </div>
          ))}

          {/* Submit Button */}
          <div className="pt-4 border-t border-neutral-100">
            <Button
              disabled={!isReady}
              className={cn(
                "w-full rounded-full font-light",
                isReady
                  ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                  : "bg-neutral-100 text-neutral-400"
              )}
            >
              <Sparkles className="size-4 mr-2" strokeWidth={1.5} />
              {isReady
                ? "Create AiP"
                : `Create AiP (${completedCount}/${readinessItems.length} complete)`}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="border-neutral-200 rounded-xl bg-neutral-50">
        <CardContent className="py-4">
          <button className="flex items-center gap-2 text-sm font-light text-neutral-600 hover:text-neutral-800 transition-colors">
            <HelpCircle className="size-4" strokeWidth={1.5} />
            How does this process work?
            <ArrowRight className="size-3" strokeWidth={1.5} />
          </button>
        </CardContent>
      </Card>
    </div>
  )
}

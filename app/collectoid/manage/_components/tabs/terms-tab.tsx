// app/collectoid/manage/_components/tabs/terms-tab.tsx
"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, Construction } from "lucide-react"

export function TermsTab() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-light text-neutral-900">Data Use Terms</h2>
        <p className="text-sm font-light text-neutral-500">
          Define how data in this collection can be used
        </p>
      </div>

      <Card className="border-neutral-200 rounded-xl border-dashed">
        <CardContent className="py-12 text-center">
          <div className="size-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Construction className="size-8 text-amber-500" strokeWidth={1} />
          </div>
          <h3 className="text-lg font-light text-neutral-600 mb-2">Coming Soon</h3>
          <p className="text-sm font-light text-neutral-500 max-w-md mx-auto">
            This section is being developed. It will allow you to define data use restrictions
            such as ML/AI usage, publication rights, and external sharing permissions.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

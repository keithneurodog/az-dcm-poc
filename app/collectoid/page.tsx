"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LegacyCollectoidPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/collectoid/dcm/create")
  }, [router])

  return (
    <div className="flex items-center justify-center h-64">
      <p className="text-sm text-neutral-400 font-light">Redirecting to create flow...</p>
    </div>
  )
}

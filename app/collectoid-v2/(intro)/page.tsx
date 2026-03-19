"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function IntroRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/collectoid-v2/dashboard")
  }, [router])

  return (
    <div className="flex items-center justify-center h-screen bg-neutral-50">
      <p className="text-sm text-neutral-400 font-light">Loading...</p>
    </div>
  )
}

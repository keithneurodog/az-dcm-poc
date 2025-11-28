import * as React from "react"
import { UX2TopNav } from "@/app/ux/_components/ux2-top-nav"

interface UX2LayoutProps {
  children: React.ReactNode
}

export function UX2Layout({ children }: UX2LayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <UX2TopNav />
      <main className="mx-auto max-w-7xl p-6">{children}</main>
    </div>
  )
}

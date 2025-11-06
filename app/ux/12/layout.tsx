"use client"

import { ReactNode } from "react"
import { ColorSchemeProvider } from "@/components/ux12-color-context"
import { UX12TopBar } from "@/components/ux12-top-bar"
import { UX12DevWidget } from "@/components/ux12-dev-widget"

export default function UX12RootLayout({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeProvider>
      <div className="min-h-screen bg-neutral-50">
        <UX12TopBar />
        <main className="mx-auto max-w-6xl px-8 py-12">{children}</main>
        <UX12DevWidget />
      </div>
    </ColorSchemeProvider>
  )
}

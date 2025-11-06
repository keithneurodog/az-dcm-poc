"use client"

import { ReactNode } from "react"
import { ColorSchemeProvider } from "@/components/ux12-color-context"
import { UX13Sidebar } from "@/components/ux13-sidebar"
import { UX13TopBar } from "@/components/ux13-top-bar"
import { UX12DevWidget } from "@/components/ux12-dev-widget"

export default function UX13RootLayout({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeProvider>
      <div className="flex h-screen bg-neutral-50">
        <UX13Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <UX13TopBar />
          <main className="flex-1 overflow-auto">
            <div className="p-8">{children}</div>
          </main>
        </div>
        <UX12DevWidget />
      </div>
    </ColorSchemeProvider>
  )
}

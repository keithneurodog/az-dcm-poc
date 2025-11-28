"use client"

import { ReactNode } from "react"
import { ColorSchemeProvider } from "@/app/ux/_components/ux12-color-context"
import { NotificationProvider } from "@/app/ux/_components/notification-context"
import { UX13Sidebar } from "@/app/ux/_components/ux13-sidebar"
import { UX13TopBar } from "@/app/ux/_components/ux13-top-bar"
import { UX12DevWidget } from "@/app/ux/_components/ux12-dev-widget"

export default function UX13RootLayout({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeProvider>
      <NotificationProvider>
        <div className="flex h-screen bg-neutral-50">
          <UX13Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <UX13TopBar />
            <main className="flex-1 overflow-auto">
              <div className="mx-auto px-12 py-8 max-w-[1600px]">{children}</div>
            </main>
          </div>
          <UX12DevWidget />
        </div>
      </NotificationProvider>
    </ColorSchemeProvider>
  )
}

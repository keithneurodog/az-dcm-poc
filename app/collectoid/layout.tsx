"use client"

import { ReactNode } from "react"
import {
  ColorSchemeProvider,
  NotificationProvider,
  Sidebar,
  TopBar,
  DevWidget,
} from "./_components"

export default function CollectoidLayout({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeProvider>
      <NotificationProvider>
        <div className="flex h-screen bg-neutral-50">
          <Sidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <TopBar />
            <main className="flex-1 overflow-auto">
              <div className="mx-auto px-12 py-8 max-w-[1600px]">{children}</div>
            </main>
          </div>
          <DevWidget />
        </div>
      </NotificationProvider>
    </ColorSchemeProvider>
  )
}

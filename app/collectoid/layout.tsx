"use client"

import { ReactNode } from "react"
import {
  ColorSchemeProvider,
  NotificationProvider,
  SidebarProvider,
  VariationProvider,
  Sidebar,
  TopBar,
  DevWidget,
} from "./_components"

export default function CollectoidLayout({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeProvider>
      <NotificationProvider>
        <VariationProvider>
          <SidebarProvider>
            <div className="flex h-screen bg-neutral-50 relative">
              <Sidebar />
              <div className="flex flex-1 flex-col overflow-hidden">
                <TopBar />
                <main className="flex-1 overflow-auto">
                  <div className="mx-auto px-6 xl:px-12 py-6 xl:py-8 max-w-[1600px]">{children}</div>
                </main>
              </div>
              <DevWidget />
            </div>
          </SidebarProvider>
        </VariationProvider>
      </NotificationProvider>
    </ColorSchemeProvider>
  )
}

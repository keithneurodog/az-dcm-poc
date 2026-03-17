"use client"

import { ReactNode } from "react"
import {
  ColorSchemeProvider,
  SidebarProvider,
} from "@/app/collectoid-v2/(app)/_components"
import { DemoSidebar } from "./_components"

export default function DeliveryDemoLayout({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeProvider>
      <SidebarProvider>
        <div className="flex h-screen bg-neutral-50">
          <DemoSidebar />
          <div className="flex flex-1 flex-col overflow-hidden">
            <main className="flex-1 overflow-auto">
              <div className="mx-auto px-6 xl:px-12 py-6 xl:py-8 max-w-[1600px]">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </ColorSchemeProvider>
  )
}

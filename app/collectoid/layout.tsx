"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { ArrowLeft, Archive } from "lucide-react"
import {
  ColorSchemeProvider,
  NotificationProvider,
  SidebarProvider,
  VariationProvider,
  Sidebar,
  TopBar,
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
                {/* Legacy banner */}
                <div className="bg-amber-50 border-b border-amber-200 px-6 py-2 flex items-center gap-3">
                  <Archive className="size-4 text-amber-600" />
                  <span className="text-xs text-amber-700 font-light">Legacy Archive — This is the original V1 create flow, kept for reference.</span>
                  <Link
                    href="/collectoid-v2"
                    className="ml-auto flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-light transition-colors"
                  >
                    <ArrowLeft className="size-3" />
                    Back to main app
                  </Link>
                </div>
                <main className="flex-1 overflow-auto">
                  <div className="mx-auto px-6 xl:px-12 py-6 xl:py-8 max-w-[1600px]">{children}</div>
                </main>
              </div>
            </div>
          </SidebarProvider>
        </VariationProvider>
      </NotificationProvider>
    </ColorSchemeProvider>
  )
}

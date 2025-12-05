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
  NotesProvider,
  NotesWrapper,
  NotesFloatingPanel,
} from "./_components"
import { FEATURE_FLAGS } from "@/lib/feature-flags"

export default function CollectoidLayout({ children }: { children: ReactNode }) {
  const notesEnabled = FEATURE_FLAGS.NOTES_ENABLED

  const content = (
    <div className="mx-auto px-6 xl:px-12 py-6 xl:py-8 max-w-[1600px]">{children}</div>
  )

  return (
    <ColorSchemeProvider>
      <NotificationProvider>
        {notesEnabled ? (
          <NotesProvider>
            <VariationProvider>
              <SidebarProvider>
                <div className="flex h-screen bg-neutral-50 relative">
                  <Sidebar />
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <TopBar />
                    <main className="flex-1 overflow-auto">
                      <NotesWrapper>{content}</NotesWrapper>
                    </main>
                  </div>
                  <DevWidget />
                  <NotesFloatingPanel />
                </div>
              </SidebarProvider>
            </VariationProvider>
          </NotesProvider>
        ) : (
          <VariationProvider>
            <SidebarProvider>
              <div className="flex h-screen bg-neutral-50 relative">
                <Sidebar />
                <div className="flex flex-1 flex-col overflow-hidden">
                  <TopBar />
                  <main className="flex-1 overflow-auto">{content}</main>
                </div>
                <DevWidget />
              </div>
            </SidebarProvider>
          </VariationProvider>
        )}
      </NotificationProvider>
    </ColorSchemeProvider>
  )
}

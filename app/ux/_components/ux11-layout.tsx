import { ReactNode } from "react"
import { UX11Sidebar } from "./ux11-sidebar"

export function UX11Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-neutral-50 via-purple-50/30 to-blue-50/30">
      <UX11Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

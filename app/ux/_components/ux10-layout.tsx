import { ReactNode } from "react"
import { UX10Sidebar } from "./ux10-sidebar"

export function UX10Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-neutral-50">
      <UX10Sidebar />
      <main className="flex-1 overflow-auto bg-gradient-to-br from-neutral-50 via-white to-amber-50/30">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

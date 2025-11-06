import { ReactNode } from "react"
import { UX3Sidebar } from "./ux3-sidebar"

export function UX3Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-neutral-50">
      <UX3Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

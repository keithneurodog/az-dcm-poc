import { ReactNode } from "react"
import { UX9Sidebar } from "./ux9-sidebar"

export function UX9Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <UX9Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-10">{children}</div>
      </main>
    </div>
  )
}

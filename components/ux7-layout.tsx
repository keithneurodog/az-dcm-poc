import { ReactNode } from "react"
import { UX7Sidebar } from "./ux7-sidebar"

export function UX7Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#050810]">
      <UX7Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}

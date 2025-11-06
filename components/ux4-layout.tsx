import { ReactNode } from "react"
import { UX4Sidebar } from "./ux4-sidebar"
import { UX4TopBar } from "./ux4-top-bar"

export function UX4Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-neutral-50">
      <UX4Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UX4TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

import { ReactNode } from "react"
import { UX5Sidebar } from "./ux5-sidebar"
import { UX5TopBar } from "./ux5-top-bar"

export function UX5Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-neutral-50">
      <UX5Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <UX5TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}

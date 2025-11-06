import { ReactNode } from "react"
import { UX6TopBar } from "./ux6-top-bar"

export function UX6Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <UX6TopBar />
      <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
    </div>
  )
}

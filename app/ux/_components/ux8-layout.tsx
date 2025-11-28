import { ReactNode } from "react"
import { UX8TopBar } from "./ux8-top-bar"

export function UX8Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <UX8TopBar />
      <main className="mx-auto max-w-6xl px-8 py-12">{children}</main>
    </div>
  )
}

import { ReactNode } from "react"
import { UX12TopBar } from "./ux12-top-bar"
import { UX12DevWidget } from "./ux12-dev-widget"
import { ColorSchemeProvider } from "./ux12-color-context"

export function UX12Layout({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeProvider>
      <div className="min-h-screen bg-neutral-50">
        <UX12TopBar />
        <main className="mx-auto max-w-6xl px-8 py-12">{children}</main>
        <UX12DevWidget />
      </div>
    </ColorSchemeProvider>
  )
}

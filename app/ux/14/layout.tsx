"use client"

import { ReactNode } from "react"
import { IterationSwitcher } from "@/components/iteration-switcher"
import { ColorSchemeProvider, useColorScheme } from "@/components/ux14-color-context"
import { UX14DevWidget } from "@/components/ux14-dev-widget"
import { cn } from "@/lib/utils"

function UX14Header() {
  const { scheme } = useColorScheme()

  return (
    <header className={cn("border-b bg-white/60 backdrop-blur-xl", `border-${scheme.from.replace("from-", "").replace("-500", "-100")}/50`)}>
      <div className="mx-auto max-w-7xl px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br border", scheme.from.replace("from-", "from-").replace("-500", "-400/20"), scheme.to.replace("to-", "to-").replace("-500", "-400/20"), `border-${scheme.from.replace("from-", "").replace("-500", "-200")}/50`)}>
              <span className={cn("text-lg font-extralight", scheme.from.replace("from-", "text-").replace("-500", "-700"))}>AZ</span>
            </div>
            <div>
              <h1 className="text-sm font-extralight text-neutral-900 tracking-wide">Data Portal</h1>
              <p className={cn("text-xs font-extralight", scheme.from.replace("from-", "text-").replace("-500", "-600/70"))}>Garden Zen</p>
            </div>
          </div>
          <nav className="flex items-center gap-1">
            {[
              { name: "Home", href: "/ux/14/home" },
              { name: "Search", href: "/ux/14/search" },
              { name: "Management", href: "/ux/14/management" },
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={cn("px-5 py-2 text-sm font-extralight text-neutral-600 transition-colors rounded-full", `hover:text-${scheme.from.replace("from-", "").replace("-500", "-700")} hover:bg-${scheme.from.replace("from-", "").replace("-500", "-50/50")}`)}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

function UX14Content({ children }: { children: ReactNode }) {
  const { scheme } = useColorScheme()

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-neutral-50", `via-${scheme.from.replace("from-", "").replace("-500", "-50/20")} to-${scheme.to.replace("to-", "").replace("-500", "-50/30")}`)}>
      <UX14Header />
      <main className="mx-auto max-w-7xl px-8 py-16">{children}</main>
      <IterationSwitcher />
      <UX14DevWidget />
    </div>
  )
}

export default function UX14RootLayout({ children }: { children: ReactNode }) {
  return (
    <ColorSchemeProvider>
      <UX14Content>{children}</UX14Content>
    </ColorSchemeProvider>
  )
}

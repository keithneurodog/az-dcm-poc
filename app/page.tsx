import Link from "next/link"
import {
  ArrowRight,
  Sparkles,
  Monitor,
  Archive,
  Palette,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Subtle grain texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015] z-50"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Header */}
      <header className="pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-neutral-400 mb-6">
            <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs tracking-wide uppercase">Collectoid Prototype</span>
          </div>
          <h1 className="text-3xl font-extralight tracking-tight text-neutral-900 mb-3">
            DCM Platform
          </h1>
          <p className="text-neutral-500 font-light max-w-lg mx-auto">
            Data collection management prototype exploring AI-assisted workflows, discovery, and analytics for clinical trial data access.
          </p>
        </div>
      </header>

      {/* Cards */}
      <section className="px-6 pb-20">
        <div className="max-w-3xl mx-auto space-y-4">

          {/* Primary: UX Prototype */}
          <Link
            href="/collectoid-v2/dashboard"
            className="group block bg-white rounded-2xl border border-neutral-200 p-8 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start gap-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-md">
                <Sparkles className="size-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-light text-neutral-900">UX Prototype</h2>
                  <span className="text-[10px] tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Current</span>
                </div>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  The unified DCM platform combining all features — collection creation workspace, AI discovery, analytics dashboard, approval workflows, and request management.
                </p>
              </div>
              <ArrowRight className="size-5 text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
            </div>
          </Link>

          {/* Delivery Demo */}
          <Link
            href="/collectoid-v2/delivery-demo/dashboard"
            className="group block bg-white rounded-2xl border border-neutral-200 p-8 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="flex items-start gap-5">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-md">
                <Monitor className="size-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-lg font-light text-neutral-900">Delivery Demo</h2>
                  <span className="text-[10px] tracking-wider uppercase text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">Demo</span>
                </div>
                <p className="text-sm text-neutral-500 font-light leading-relaxed">
                  Isolated demonstration environment with coming-soon patterns for stakeholder presentations. Shows role-based access for Approver, Team Lead, and Data Consumer roles.
                </p>
              </div>
              <ArrowRight className="size-5 text-neutral-300 group-hover:text-neutral-600 group-hover:translate-x-1 transition-all shrink-0 mt-1" />
            </div>
          </Link>

          {/* Legacy / Archive section */}
          <div className="pt-6">
            <span className="text-xs text-neutral-400 uppercase tracking-wider px-1">Archive</span>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href="/collectoid/dcm/create"
                className="group block bg-white rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                    <Archive className="size-5 text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-light text-neutral-900 mb-1">V1 Create Flow</h3>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      Original 7-step AI-guided collection creation wizard.
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0 mt-0.5" />
                </div>
              </Link>

              <Link
                href="/context"
                className="group block bg-white rounded-xl border border-neutral-200 p-5 hover:border-neutral-300 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-neutral-100">
                    <Palette className="size-5 text-neutral-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-light text-neutral-900 mb-1">UX Gallery</h3>
                    <p className="text-xs text-neutral-400 font-light leading-relaxed">
                      14 theme explorations from early design phase.
                    </p>
                  </div>
                  <ArrowRight className="size-4 text-neutral-300 group-hover:text-neutral-500 transition-colors shrink-0 mt-0.5" />
                </div>
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-neutral-200">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-xs text-neutral-400">
          <span>Internal Prototype</span>
          <span>DCM POC · 2026</span>
        </div>
      </footer>
    </div>
  )
}

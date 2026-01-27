"use client"

import Link from "next/link"
import { ArrowRight, Settings2, CheckSquare, Users, Eye, ArrowUpRight, BookOpen } from "lucide-react"

const roles = [
  {
    id: "dcm",
    title: "Collection Manager",
    shortCode: "DCM",
    summary: "Create and manage data collections",
    icon: Settings2,
    color: "bg-violet-500",
    lightColor: "bg-violet-50",
    textColor: "text-violet-600",
    borderColor: "border-violet-200",
    route: "/collectoid-v2/dashboard",
    available: true,
  },
  {
    id: "approver",
    title: "Approver",
    shortCode: "DDO",
    summary: "Review and approve access requests",
    icon: CheckSquare,
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50",
    textColor: "text-emerald-600",
    borderColor: "border-emerald-200",
    route: "/collectoid-v2/approver",
    available: false,
  },
  {
    id: "team-lead",
    title: "Team Lead",
    shortCode: "Lead",
    summary: "Oversee your team's data access",
    icon: Users,
    color: "bg-amber-500",
    lightColor: "bg-amber-50",
    textColor: "text-amber-600",
    borderColor: "border-amber-200",
    route: "/collectoid-v2/team-lead",
    available: false,
  },
  {
    id: "consumer",
    title: "Data Consumer",
    shortCode: "User",
    summary: "View your own access status",
    icon: Eye,
    color: "bg-sky-500",
    lightColor: "bg-sky-50",
    textColor: "text-sky-600",
    borderColor: "border-sky-200",
    route: "/collectoid-v2/consumer",
    available: false,
  },
]

export default function CollectoidV2IntroPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-neutral-500">Collectoid V2 Prototype</span>
          </div>
          <Link
            href="/"
            className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            Back to Overview
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-sm text-neutral-500 mb-3">
            <BookOpen className="size-4" />
            <span>User Guide</span>
          </div>
          <h1 className="text-3xl font-semibold text-neutral-900 mb-3">
            Collectoid User Roles
          </h1>
          <p className="text-neutral-600 max-w-2xl">
            Collectoid uses role-based access to provide each user with a tailored experience.
            Select your role below to enter the prototype, or scroll down to learn more about each role.
          </p>
        </div>

        {/* Quick Links - Role Cards */}
        <section className="mb-16">
          <h2 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-4">
            Select Your Role
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <Link
                  key={role.id}
                  href={role.available ? role.route : "#"}
                  className={`
                    group relative bg-white rounded-xl border p-5 transition-all
                    ${role.available
                      ? `${role.borderColor} hover:shadow-lg hover:border-neutral-300 cursor-pointer`
                      : "border-neutral-200 opacity-60 cursor-not-allowed"
                    }
                  `}
                  onClick={(e) => !role.available && e.preventDefault()}
                >
                  <div className={`inline-flex items-center justify-center size-10 rounded-lg ${role.lightColor} mb-3`}>
                    <Icon className={`size-5 ${role.textColor}`} strokeWidth={1.5} />
                  </div>
                  <h3 className="font-medium text-neutral-900 mb-1">{role.title}</h3>
                  <p className="text-sm text-neutral-500 mb-3">{role.summary}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-0.5 rounded ${role.lightColor} ${role.textColor}`}>
                      {role.shortCode}
                    </span>
                    {role.available ? (
                      <ArrowUpRight className="size-4 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                    ) : (
                      <span className="text-xs text-neutral-400">Coming soon</span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Detailed Breakdown */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900">Role Details</h2>
            <span className="text-sm text-neutral-400">Scroll for more</span>
          </div>

          <div className="space-y-8">
            {/* DCM Section */}
            <div id="dcm" className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100 bg-violet-50/50">
                <div className="flex items-center justify-center size-8 rounded-lg bg-violet-500">
                  <Settings2 className="size-4 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Collection Manager (DCM)</h3>
                  <p className="text-sm text-neutral-500">R&D Data Office staff, Collection administrators</p>
                </div>
                <Link
                  href="/collectoid-v2/dashboard"
                  className="ml-auto flex items-center gap-1 text-sm text-violet-600 hover:text-violet-700"
                >
                  Enter as DCM <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 mb-3">Responsibilities</h4>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                        Create new data collections with defined scope and terms
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                        Add or remove studies from existing collections
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                        Manage user access lists and permissions
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                        Prepare and coordinate quarterly reviews
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                        Track approval status and compliance metrics
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 mb-3">Key Workflows</h4>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Collection creation wizard with AI-assisted categorization
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Study management with opt-in/opt-out tracking
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        User provisioning and access configuration
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Quarterly review preparation and execution
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Approver Section */}
            <div id="approver" className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100 bg-emerald-50/50">
                <div className="flex items-center justify-center size-8 rounded-lg bg-emerald-500">
                  <CheckSquare className="size-4 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Approver (DDO)</h3>
                  <p className="text-sm text-neutral-500">Data Owners, TA Leads, GPT/TALT members</p>
                </div>
                <span className="ml-auto text-sm text-neutral-400">Coming soon</span>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 mb-3">Responsibilities</h4>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        Review and approve new collection proposals
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        Make opt-in/opt-out decisions for studies
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        Sign off on Agreements of Terms (AOT)
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        Flag sensitive studies for exclusion
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                        Participate in quarterly review meetings
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 mb-3">Key Workflows</h4>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Approval queue with priority sorting
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Multi-TA approval coordination
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Study-level decision tracking
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Audit trail and decision history
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Lead Section */}
            <div id="team-lead" className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100 bg-amber-50/50">
                <div className="flex items-center justify-center size-8 rounded-lg bg-amber-500">
                  <Users className="size-4 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Team Lead</h3>
                  <p className="text-sm text-neutral-500">Department heads, Team managers, Data Consumer Leads</p>
                </div>
                <span className="ml-auto text-sm text-neutral-400">Coming soon</span>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 mb-3">Responsibilities</h4>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        View what data your team can access
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        Request access on behalf of team members
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        Monitor team compliance status
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        Track training completion across team
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                        Ensure data use within approved terms
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 mb-3">Key Workflows</h4>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Team access dashboard
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Bulk access requests for team members
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Compliance monitoring and alerts
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Training status tracking
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Consumer Section */}
            <div id="consumer" className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-neutral-100 bg-sky-50/50">
                <div className="flex items-center justify-center size-8 rounded-lg bg-sky-500">
                  <Eye className="size-4 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h3 className="font-medium text-neutral-900">Data Consumer</h3>
                  <p className="text-sm text-neutral-500">Data Scientists, Statisticians, Researchers, Programmers</p>
                </div>
                <span className="ml-auto text-sm text-neutral-400">Coming soon</span>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 mb-3">Responsibilities</h4>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                        See which collections you have access to
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                        Track your pending access requests
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                        Understand what you can and cannot do with data
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-sky-400 mt-1.5 shrink-0" />
                        Check your training and compliance status
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-neutral-700 mb-3">Key Workflows</h4>
                    <ul className="space-y-2 text-sm text-neutral-600">
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Personal access dashboard
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Request status tracking
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Terms and conditions viewer
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="size-1.5 rounded-full bg-neutral-300 mt-1.5 shrink-0" />
                        Training completion tracking
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-neutral-200">
          <p className="text-sm text-neutral-400 text-center">
            Collectoid V2 Prototype · Internal Use Only
          </p>
        </footer>
      </main>
    </div>
  )
}

"use client"

import { useColorScheme } from "../_components"
import { cn } from "@/lib/utils"
import {
  Bell,
  ShieldCheck,
  Users,
  FileText,
  Zap,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Settings,
  Mail,
  Smartphone,
  BarChart3,
} from "lucide-react"

export default function DemoNotificationsPage() {
  const { scheme } = useColorScheme()

  return (
    <>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Bell className="size-6 text-neutral-300" strokeWidth={1.5} />
          <h1 className="text-2xl font-extralight text-neutral-800">Notifications</h1>
          <span className="text-[10px] font-normal px-2 py-0.5 rounded-full border border-neutral-300 text-neutral-400">
            Coming Soon
          </span>
        </div>
        <p className="text-sm font-light text-neutral-500 max-w-2xl">
          A centralised hub for everything that needs your attention. Notifications will keep you informed across all your collections so you can act quickly and never miss a critical update.
        </p>
      </div>

      {/* Feedback panel */}
      <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-5 mb-8">
        <div className="flex items-center gap-4">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-100/60">
            <MessageSquare className="size-4 text-blue-400" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-sm font-normal text-neutral-700 mb-1">Help shape this feature</h3>
            <p className="text-xs font-light text-neutral-500 leading-relaxed mb-3">
              Notifications is in the planning stage and your input matters. If you have thoughts on what alerts would be most valuable, how you'd prefer to receive them, or features you'd like to see, we'd love to hear from you.
            </p>
            <div className="flex items-center gap-3 text-xs font-light">
              <a href="mailto:collectoid-feedback@astrazeneca.com" className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors">
                <Mail className="size-3" strokeWidth={1.5} />
                Send feedback
              </a>
              <span className="text-neutral-300">·</span>
              <a href="mailto:collectoid-feedback@astrazeneca.com?subject=Notifications feature request" className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors">
                <Zap className="size-3" strokeWidth={1.5} />
                Request a feature
              </a>
              <span className="text-neutral-300">·</span>
              <a href="mailto:collectoid-feedback@astrazeneca.com?subject=Notifications - volunteering to help" className="inline-flex items-center gap-1.5 text-blue-500 hover:text-blue-600 transition-colors">
                <Users className="size-3" strokeWidth={1.5} />
                Volunteer as a tester
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className={cn(
        "rounded-2xl p-8 mb-8 border bg-gradient-to-br",
        scheme.bg,
        scheme.bgHover,
        scheme.from.replace("from-", "border-").replace("500", "100")
      )}>
        <div className="flex items-center gap-6">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm">
            <Zap className={cn("size-7", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-lg font-light text-neutral-800 mb-2">
              Stay ahead, not behind
            </h2>
            <p className="text-sm font-light text-neutral-600 leading-relaxed max-w-xl">
              Notifications are designed to surface what matters most: approval requests that need your signature, provisioning updates that unblock your team, and compliance changes that affect your collections. No noise, just the signals you need.
            </p>
          </div>
        </div>
      </div>

      {/* Feature sections grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

        {/* Real-Time Alerts */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100">
              <AlertCircle className="size-4 text-neutral-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-normal text-neutral-700">Real-Time Alerts</h3>
          </div>
          <p className="text-xs font-light text-neutral-500 leading-relaxed mb-4">
            Get notified the moment something important happens, no more checking dashboards or chasing email threads.
          </p>
          <div className="space-y-2.5">
            {[
              "Approval requests arrive in your queue",
              "A collection you manage is blocked by a compliance issue",
              "A TA Lead has approved or rejected your submission",
              "Provisioning completes and users gain access",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-neutral-300 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-xs font-light text-neutral-500">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Prioritisation */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100">
              <BarChart3 className="size-4 text-neutral-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-normal text-neutral-700">Smart Prioritisation</h3>
          </div>
          <p className="text-xs font-light text-neutral-500 leading-relaxed mb-4">
            Not all notifications are equal. Critical blockers surface first, routine updates stay out of your way until you're ready.
          </p>
          <div className="space-y-2.5">
            {[
              "Critical, high, medium, and low priority levels",
              "Blockers and SLA warnings always appear first",
              "Batch routine updates into daily digests",
              "Intelligent grouping by collection and type",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-neutral-300 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-xs font-light text-neutral-500">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Workflow */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100">
              <ShieldCheck className="size-4 text-neutral-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-normal text-neutral-700">Approval Workflow</h3>
          </div>
          <p className="text-xs font-light text-neutral-500 leading-relaxed mb-4">
            The multi-TA approval process involves multiple stakeholders. Notifications keep everyone synchronised so nothing stalls.
          </p>
          <div className="space-y-2.5">
            {[
              "TA Leads notified when their review is needed",
              "DCMs see real-time approval chain progress",
              "Automatic reminders when approvals approach SLA deadlines",
              "Rejection reasons surfaced immediately with next steps",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-neutral-300 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-xs font-light text-neutral-500">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Collection Updates */}
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex size-9 items-center justify-center rounded-lg bg-neutral-100">
              <FileText className="size-4 text-neutral-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-normal text-neutral-700">Collection Lifecycle</h3>
          </div>
          <p className="text-xs font-light text-neutral-500 leading-relaxed mb-4">
            Collections evolve: datasets are added, terms are updated, users gain access. Stay informed as your collections move through each stage.
          </p>
          <div className="space-y-2.5">
            {[
              "Datasets added or removed from your collections",
              "Data Use Terms modified or conflicts detected",
              "Collections promoted from draft to active",
              "Quarterly review reminders for opt-in/opt-out decisions",
            ].map((item) => (
              <div key={item} className="flex items-start gap-2">
                <CheckCircle2 className="size-3.5 text-neutral-300 shrink-0 mt-0.5" strokeWidth={1.5} />
                <span className="text-xs font-light text-neutral-500">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Delivery channels section */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6 mb-8">
        <h3 className="text-sm font-normal text-neutral-700 mb-1">Delivery Channels</h3>
        <p className="text-xs font-light text-neutral-500 mb-5">
          Choose how you want to be reached. Configure per-channel preferences so you get the right alerts in the right place.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Bell,
              title: "In-App",
              description: "Live notifications within Collectoid with badge counts, filtering, and bulk actions",
            },
            {
              icon: Mail,
              title: "Email Digests",
              description: "Daily or weekly summaries delivered to your inbox, configurable frequency and scope",
            },
            {
              icon: Smartphone,
              title: "Microsoft Teams",
              description: "Direct alerts to your Teams channel for time-sensitive approvals and critical blockers",
            },
          ].map((channel) => (
            <div key={channel.title} className="flex items-start gap-3 p-4 rounded-lg bg-neutral-50/80">
              <channel.icon className="size-4 text-neutral-400 shrink-0 mt-0.5" strokeWidth={1.5} />
              <div>
                <p className="text-xs font-normal text-neutral-600 mb-1">{channel.title}</p>
                <p className="text-xs font-light text-neutral-400 leading-relaxed">{channel.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Management tools section */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h3 className="text-sm font-normal text-neutral-700 mb-1">Management Tools</h3>
        <p className="text-xs font-light text-neutral-500 mb-5">
          Keep your notification centre clean and actionable with built-in tools for organising, filtering, and archiving.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Filter, title: "Filter & Search", description: "By type, priority, collection, or date range" },
            { icon: CheckCircle2, title: "Bulk Actions", description: "Mark as read, archive, or snooze in batches" },
            { icon: Clock, title: "Snooze", description: "Temporarily dismiss and resurface at a chosen time" },
            { icon: Settings, title: "Preferences", description: "Control which notifications you receive and how" },
          ].map((tool) => (
            <div key={tool.title} className="text-center p-3">
              <tool.icon className="size-4 text-neutral-300 mx-auto mb-2" strokeWidth={1.5} />
              <p className="text-xs font-normal text-neutral-600 mb-1">{tool.title}</p>
              <p className="text-[11px] font-light text-neutral-400 leading-relaxed">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

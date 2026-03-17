"use client"

import {
  LayoutDashboard,
  FolderOpen,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react"
import { ComingSoonPage } from "../_components"

export default function DashboardPage() {
  return (
    <ComingSoonPage
      icon={LayoutDashboard}
      title="Your Dashboard"
      description="A personalised overview of your collections, pending actions, and recent activity. Your dashboard brings together everything that needs your attention in one place."
      capabilities={[
        {
          icon: FolderOpen,
          title: "My Collections",
          description:
            "Quick access to all collections you own or contribute to, with live status indicators",
        },
        {
          icon: Clock,
          title: "Pending Actions",
          description:
            "Approvals waiting for your review, requests that need attention, and upcoming deadlines",
        },
        {
          icon: AlertCircle,
          title: "Blockers & Alerts",
          description:
            "Issues that need resolution — blocked provisioning, expired training, or compliance flags",
        },
        {
          icon: CheckCircle2,
          title: "Recent Activity",
          description:
            "A timeline of recent actions across your collections — approvals, edits, new access grants",
        },
      ]}
    />
  )
}

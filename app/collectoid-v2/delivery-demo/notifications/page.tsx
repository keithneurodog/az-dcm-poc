"use client"

import { Bell, ShieldCheck, Users, FileText } from "lucide-react"
import { ComingSoonPage } from "../_components"

export default function NotificationsPage() {
  return (
    <ComingSoonPage
      icon={Bell}
      title="Notifications"
      description="Stay informed about everything happening across your collections. Real-time alerts for approvals, access changes, compliance updates, and team activity — all in one place."
      capabilities={[
        {
          icon: ShieldCheck,
          title: "Approval Requests",
          description:
            "Get notified when collections need your review or when your submissions are approved",
        },
        {
          icon: Users,
          title: "Access Changes",
          description:
            "Alerts when users are granted access, provisioning completes, or training requirements change",
        },
        {
          icon: FileText,
          title: "Collection Updates",
          description:
            "Know when datasets are added, terms are modified, or collections move through governance stages",
        },
      ]}
    />
  )
}

"use client"

import { useCollection } from "./collection-context"
import {
  OverviewTab,
  DatasetsTab,
  UsersTab,
  TermsTab,
  DiscussionTab,
  TimelineTab,
} from "./tabs"

export function TabContent() {
  const { activeTab } = useCollection()

  switch (activeTab) {
    case "overview":
      return <OverviewTab />
    case "datasets":
      return <DatasetsTab />
    case "users":
      return <UsersTab />
    case "terms":
      return <TermsTab />
    case "discussion":
      return <DiscussionTab />
    case "timeline":
      return <TimelineTab />
    default:
      return <OverviewTab />
  }
}

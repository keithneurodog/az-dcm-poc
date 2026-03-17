"use client"

import {
  BarChart3,
  Flame,
  TrendingUp,
  Lightbulb,
  PieChart,
} from "lucide-react"
import { ComingSoonPage } from "../_components"

export default function AnalyticsPage() {
  return (
    <ComingSoonPage
      icon={BarChart3}
      title="Analytics & Insights"
      description="Understand how data is being used across AstraZeneca. Analytics brings together demand patterns, collection health metrics, and usage trends to help you make informed decisions about data governance."
      capabilities={[
        {
          icon: Flame,
          title: "Demand Heatmap",
          description:
            "See which data categories are most requested across therapeutic areas",
        },
        {
          icon: TrendingUp,
          title: "Usage Trends",
          description:
            "Track how collection access patterns change over time",
        },
        {
          icon: Lightbulb,
          title: "Collection Suggestions",
          description:
            "AI-powered recommendations for new collections based on demand signals",
        },
        {
          icon: PieChart,
          title: "Governance Metrics",
          description:
            "Monitor approval times, compliance rates, and provisioning throughput",
        },
      ]}
    />
  )
}

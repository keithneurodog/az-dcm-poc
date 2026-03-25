export interface HealthDimension {
  label: string
  score: number // 0-100
  detail: string
}

export interface CollectionHealth {
  overall: number // 0-100
  label: "Healthy" | "Fair" | "At Risk" | "Critical"
  color: string // tailwind text color class
  bgColor: string // tailwind bg color class
  dimensions: HealthDimension[]
}

interface HealthInput {
  totalUsers: number
  usersWithAccess: number
  accessBreakdown: {
    immediate: number
    instantGrant: number
    pendingApproval: number
    dataDiscovery: number
  }
  selectedDatasets: { complianceStatus?: string }[]
  milestones: { status: string }[]
}

/**
 * Compute a health score for a collection based on key operational metrics.
 *
 * Dimensions:
 * 1. Access Coverage   - what % of users actually have access
 * 2. Provisioning      - what % of data is readily accessible vs blocked/missing
 * 3. Dataset Compliance - what % of datasets are fully compliant
 * 4. Milestone Progress - what % of milestones are completed
 */
export function computeCollectionHealth(collection: HealthInput): CollectionHealth {
  const dimensions: HealthDimension[] = []

  // 1. Access Coverage: usersWithAccess / totalUsers
  const accessScore = collection.totalUsers > 0
    ? Math.round((collection.usersWithAccess / collection.totalUsers) * 100)
    : 0
  const accessDetail = `${collection.usersWithAccess} of ${collection.totalUsers} users have access`
  dimensions.push({ label: "Access Coverage", score: accessScore, detail: accessDetail })

  // 2. Provisioning: (immediate + instantGrant) / total
  const ab = collection.accessBreakdown
  const provisioningTotal = ab.immediate + ab.instantGrant + ab.pendingApproval + ab.dataDiscovery
  const provisioningScore = provisioningTotal > 0
    ? Math.round(((ab.immediate + ab.instantGrant) / provisioningTotal) * 100)
    : 0
  const provisioningDetail = `${ab.immediate + ab.instantGrant}% accessible, ${ab.pendingApproval}% pending, ${ab.dataDiscovery}% missing`
  dimensions.push({ label: "Provisioning", score: provisioningScore, detail: provisioningDetail })

  // 3. Dataset Compliance: % of datasets with "Fully Compliant" status
  const datasets = collection.selectedDatasets
  const compliantCount = datasets.filter(d => d.complianceStatus === "Fully Compliant").length
  const complianceScore = datasets.length > 0
    ? Math.round((compliantCount / datasets.length) * 100)
    : 100 // no datasets = nothing to flag
  const flaggedCount = datasets.length - compliantCount
  const complianceDetail = flaggedCount === 0
    ? `All ${datasets.length} datasets compliant`
    : `${flaggedCount} of ${datasets.length} datasets need attention`
  dimensions.push({ label: "Compliance", score: complianceScore, detail: complianceDetail })

  // 4. Milestone Progress: % of milestones completed
  const milestones = collection.milestones
  const completedMilestones = milestones.filter(m => m.status === "completed").length
  const milestoneScore = milestones.length > 0
    ? Math.round((completedMilestones / milestones.length) * 100)
    : 100 // no milestones = nothing outstanding
  const milestoneDetail = milestones.length > 0
    ? `${completedMilestones} of ${milestones.length} milestones complete`
    : "No milestones defined"
  dimensions.push({ label: "Milestones", score: milestoneScore, detail: milestoneDetail })

  // Overall: weighted average
  const overall = Math.round(
    accessScore * 0.3 +
    provisioningScore * 0.3 +
    complianceScore * 0.25 +
    milestoneScore * 0.15
  )

  const { label, color, bgColor } = overall >= 75
    ? { label: "Healthy" as const, color: "text-green-600", bgColor: "bg-green-500" }
    : overall >= 50
      ? { label: "Fair" as const, color: "text-amber-600", bgColor: "bg-amber-500" }
      : overall >= 25
        ? { label: "At Risk" as const, color: "text-orange-600", bgColor: "bg-orange-500" }
        : { label: "Critical" as const, color: "text-red-600", bgColor: "bg-red-500" }

  return { overall, label, color, bgColor, dimensions }
}

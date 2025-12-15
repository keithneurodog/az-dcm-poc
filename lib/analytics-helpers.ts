// Analytics helpers for DCM Data Demand Dashboard

import { Dataset, MOCK_DATASETS } from "./dcm-mock-data"

// =============================================================================
// TYPES
// =============================================================================

export interface DatasetDemandMetrics {
  datasetId: string
  datasetCode: string
  datasetName: string
  therapeuticArea: string[]
  dataTypes: string[] // SDTM, ADaM, Omics, etc.

  // Demand signals
  totalRequests: number
  activeUsers: number
  pendingRequests: number
  requestsLast30Days: number
  requestsLast90Days: number
  trendDirection: "up" | "down" | "stable"
  trendPercent: number

  // Supply signals
  collectionsContaining: number
  collectionNames: string[]

  // Intent breakdown
  intentBreakdown: {
    aiResearch: number
    softwareDev: number
    publication: number
    internal: number
  }

  // Gap analysis
  coverageScore: number // 0-100, higher = well covered
  demandScore: number // 0-100, higher = more demand
  gapScore: number // demandScore - coverageScore (opportunity)
}

export interface DemandHeatmapCell {
  rowKey: string
  colKey: string
  datasetCount: number
  totalRequests: number
  avgGapScore: number
  datasets: DatasetDemandMetrics[]
}

export interface CollectionSuggestion {
  id: string
  title: string
  description: string
  filters: {
    therapeuticAreas?: string[]
    dataTypes?: string[]
    intents?: string[]
  }
  projectedUsers: number
  gapScore: number
  topDatasets: string[]
}

export type HeatmapDimension = "therapeuticArea" | "dataType" | "intent"

// =============================================================================
// MOCK DEMAND DATA
// =============================================================================

// Simulated request data per dataset (would come from API in production)
const MOCK_DEMAND_DATA: Record<string, {
  totalRequests: number
  pendingRequests: number
  requestsLast30Days: number
  requestsLast90Days: number
  intentBreakdown: { aiResearch: number; softwareDev: number; publication: number; internal: number }
}> = {
  "dcode-042": { totalRequests: 156, pendingRequests: 23, requestsLast30Days: 45, requestsLast90Days: 112, intentBreakdown: { aiResearch: 67, softwareDev: 34, publication: 28, internal: 27 } },
  "dcode-001": { totalRequests: 234, pendingRequests: 12, requestsLast30Days: 52, requestsLast90Days: 145, intentBreakdown: { aiResearch: 89, softwareDev: 56, publication: 45, internal: 44 } },
  "dcode-067": { totalRequests: 98, pendingRequests: 8, requestsLast30Days: 28, requestsLast90Days: 67, intentBreakdown: { aiResearch: 45, softwareDev: 23, publication: 15, internal: 15 } },
  "dcode-088": { totalRequests: 187, pendingRequests: 31, requestsLast30Days: 61, requestsLast90Days: 134, intentBreakdown: { aiResearch: 78, softwareDev: 45, publication: 34, internal: 30 } },
  "dcode-101": { totalRequests: 45, pendingRequests: 5, requestsLast30Days: 12, requestsLast90Days: 32, intentBreakdown: { aiResearch: 18, softwareDev: 12, publication: 8, internal: 7 } },
  "dcode-102": { totalRequests: 67, pendingRequests: 9, requestsLast30Days: 18, requestsLast90Days: 45, intentBreakdown: { aiResearch: 28, softwareDev: 15, publication: 12, internal: 12 } },
  "dcode-103": { totalRequests: 89, pendingRequests: 14, requestsLast30Days: 25, requestsLast90Days: 62, intentBreakdown: { aiResearch: 34, softwareDev: 21, publication: 18, internal: 16 } },
  "dcode-104": { totalRequests: 34, pendingRequests: 3, requestsLast30Days: 8, requestsLast90Days: 22, intentBreakdown: { aiResearch: 12, softwareDev: 9, publication: 7, internal: 6 } },
  "dcode-105": { totalRequests: 123, pendingRequests: 18, requestsLast30Days: 38, requestsLast90Days: 89, intentBreakdown: { aiResearch: 52, softwareDev: 31, publication: 22, internal: 18 } },
  "dcode-201": { totalRequests: 78, pendingRequests: 11, requestsLast30Days: 22, requestsLast90Days: 56, intentBreakdown: { aiResearch: 32, softwareDev: 19, publication: 14, internal: 13 } },
  "dcode-202": { totalRequests: 56, pendingRequests: 7, requestsLast30Days: 15, requestsLast90Days: 38, intentBreakdown: { aiResearch: 23, softwareDev: 14, publication: 10, internal: 9 } },
  "dcode-203": { totalRequests: 145, pendingRequests: 22, requestsLast30Days: 42, requestsLast90Days: 98, intentBreakdown: { aiResearch: 61, softwareDev: 36, publication: 26, internal: 22 } },
  "dcode-301": { totalRequests: 92, pendingRequests: 13, requestsLast30Days: 28, requestsLast90Days: 65, intentBreakdown: { aiResearch: 38, softwareDev: 22, publication: 17, internal: 15 } },
  "dcode-302": { totalRequests: 67, pendingRequests: 8, requestsLast30Days: 19, requestsLast90Days: 47, intentBreakdown: { aiResearch: 27, softwareDev: 16, publication: 13, internal: 11 } },
  "dcode-401": { totalRequests: 112, pendingRequests: 16, requestsLast30Days: 34, requestsLast90Days: 78, intentBreakdown: { aiResearch: 46, softwareDev: 28, publication: 21, internal: 17 } },
  "dcode-402": { totalRequests: 43, pendingRequests: 4, requestsLast30Days: 11, requestsLast90Days: 29, intentBreakdown: { aiResearch: 17, softwareDev: 11, publication: 8, internal: 7 } },
  "dcode-501": { totalRequests: 178, pendingRequests: 28, requestsLast30Days: 56, requestsLast90Days: 123, intentBreakdown: { aiResearch: 74, softwareDev: 43, publication: 33, internal: 28 } },
  "dcode-502": { totalRequests: 89, pendingRequests: 12, requestsLast30Days: 26, requestsLast90Days: 61, intentBreakdown: { aiResearch: 36, softwareDev: 22, publication: 17, internal: 14 } },
  "dcode-503": { totalRequests: 134, pendingRequests: 19, requestsLast30Days: 41, requestsLast90Days: 92, intentBreakdown: { aiResearch: 55, softwareDev: 33, publication: 25, internal: 21 } },
  "dcode-504": { totalRequests: 56, pendingRequests: 6, requestsLast30Days: 14, requestsLast90Days: 38, intentBreakdown: { aiResearch: 22, softwareDev: 14, publication: 11, internal: 9 } },
  "dcode-505": { totalRequests: 201, pendingRequests: 34, requestsLast30Days: 67, requestsLast90Days: 145, intentBreakdown: { aiResearch: 85, softwareDev: 49, publication: 37, internal: 30 } },
}

// =============================================================================
// DATA TYPE MAPPING
// =============================================================================

// Map category IDs to high-level data types
const CATEGORY_TO_DATA_TYPE: Record<string, string> = {
  // SDTM
  "sdtm-demographics": "SDTM",
  "sdtm-exposure": "SDTM",
  "sdtm-tumor-response": "SDTM",
  "sdtm-biomarker-labs": "SDTM",
  "sdtm-adverse-events": "SDTM",
  "sdtm-conmeds": "SDTM",
  "sdtm-specimens": "SDTM",
  // ADaM
  "adam-adsl": "ADaM",
  "adam-adrs": "ADaM",
  "adam-adtte": "ADaM",
  "adam-adbm": "ADaM",
  "adam-adexp": "ADaM",
  // RAW
  "raw-ctdna": "RAW",
  "raw-specimen-meta": "RAW",
  "raw-assay-meta": "RAW",
  "raw-processing-qc": "RAW",
  // DICOM
  "dicom-ids-timing": "DICOM",
  "dicom-acquisition": "DICOM",
  "dicom-quantitative": "DICOM",
  // Omics
  "omics-variants": "Omics",
  "omics-global-scores": "Omics",
  "omics-cn-sv": "Omics",
  "omics-sample-provenance": "Omics",
  "omics-pipeline-meta": "Omics",
  "omics-qc": "Omics",
  "omics-clonal": "Omics",
  // Therapeutic Areas
  "ta-onc": "Oncology",
  "ta-immunonc": "Immuno-Oncology",
  "ta-cardio": "Cardiovascular",
}

// Get unique data types for a dataset based on its categories
function getDataTypes(categories: string[]): string[] {
  const types = new Set<string>()
  categories.forEach(cat => {
    const type = CATEGORY_TO_DATA_TYPE[cat]
    if (type && !["Oncology", "Immuno-Oncology", "Cardiovascular"].includes(type)) {
      types.add(type)
    }
  })
  return Array.from(types)
}

// =============================================================================
// CORE FUNCTIONS
// =============================================================================

/**
 * Calculate demand metrics for all datasets
 */
export function calculateDemandMetrics(datasets: Dataset[] = MOCK_DATASETS): DatasetDemandMetrics[] {
  return datasets.map(dataset => {
    const demandData = MOCK_DEMAND_DATA[dataset.id.toLowerCase()] || {
      totalRequests: Math.floor(Math.random() * 100) + 20,
      pendingRequests: Math.floor(Math.random() * 15) + 2,
      requestsLast30Days: Math.floor(Math.random() * 30) + 5,
      requestsLast90Days: Math.floor(Math.random() * 60) + 15,
      intentBreakdown: {
        aiResearch: Math.floor(Math.random() * 40) + 10,
        softwareDev: Math.floor(Math.random() * 25) + 5,
        publication: Math.floor(Math.random() * 20) + 3,
        internal: Math.floor(Math.random() * 20) + 5,
      },
    }

    // Calculate trend
    const previousPeriodRequests = demandData.requestsLast90Days - demandData.requestsLast30Days
    const avgPreviousMonthly = previousPeriodRequests / 2
    const trendPercent = avgPreviousMonthly > 0
      ? Math.round(((demandData.requestsLast30Days - avgPreviousMonthly) / avgPreviousMonthly) * 100)
      : 0
    const trendDirection: "up" | "down" | "stable" =
      trendPercent > 10 ? "up" : trendPercent < -10 ? "down" : "stable"

    // Calculate coverage score (based on collections containing this dataset)
    const coverageScore = Math.min(100, dataset.collections.length * 15 + dataset.activeUsers * 0.3)

    // Calculate demand score (based on requests and users)
    const demandScore = Math.min(100, (demandData.totalRequests * 0.3) + (dataset.activeUsers * 0.5) + (demandData.pendingRequests * 2))

    // Gap score: high demand + low coverage = opportunity
    const gapScore = Math.max(0, demandScore - coverageScore)

    return {
      datasetId: dataset.id,
      datasetCode: dataset.code,
      datasetName: dataset.name,
      therapeuticArea: dataset.therapeuticArea,
      dataTypes: getDataTypes(dataset.categories),
      totalRequests: demandData.totalRequests,
      activeUsers: dataset.activeUsers,
      pendingRequests: demandData.pendingRequests,
      requestsLast30Days: demandData.requestsLast30Days,
      requestsLast90Days: demandData.requestsLast90Days,
      trendDirection,
      trendPercent,
      collectionsContaining: dataset.collections.length,
      collectionNames: dataset.collections,
      intentBreakdown: demandData.intentBreakdown,
      coverageScore: Math.round(coverageScore),
      demandScore: Math.round(demandScore),
      gapScore: Math.round(gapScore),
    }
  })
}

/**
 * Build heatmap data for given dimensions
 */
export function buildHeatmapData(
  metrics: DatasetDemandMetrics[],
  rowDimension: HeatmapDimension,
  colDimension: HeatmapDimension
): DemandHeatmapCell[][] {
  // Get unique values for each dimension
  const getValues = (dim: HeatmapDimension, m: DatasetDemandMetrics): string[] => {
    switch (dim) {
      case "therapeuticArea":
        return m.therapeuticArea
      case "dataType":
        return m.dataTypes.length > 0 ? m.dataTypes : ["Other"]
      case "intent":
        // Return intents with significant requests
        const intents: string[] = []
        if (m.intentBreakdown.aiResearch > 10) intents.push("AI/ML")
        if (m.intentBreakdown.softwareDev > 10) intents.push("Software Dev")
        if (m.intentBreakdown.publication > 10) intents.push("Publication")
        if (m.intentBreakdown.internal > 10) intents.push("Internal")
        return intents.length > 0 ? intents : ["General"]
    }
  }

  // Collect all unique row and column keys
  const rowKeys = new Set<string>()
  const colKeys = new Set<string>()

  metrics.forEach(m => {
    getValues(rowDimension, m).forEach(v => rowKeys.add(v))
    getValues(colDimension, m).forEach(v => colKeys.add(v))
  })

  const rows = Array.from(rowKeys).sort()
  const cols = Array.from(colKeys).sort()

  // Build the grid
  const grid: DemandHeatmapCell[][] = rows.map(rowKey => {
    return cols.map(colKey => {
      // Find datasets that match both dimensions
      const matchingDatasets = metrics.filter(m => {
        const rowValues = getValues(rowDimension, m)
        const colValues = getValues(colDimension, m)
        return rowValues.includes(rowKey) && colValues.includes(colKey)
      })

      const totalRequests = matchingDatasets.reduce((sum, d) => sum + d.totalRequests, 0)
      const avgGapScore = matchingDatasets.length > 0
        ? matchingDatasets.reduce((sum, d) => sum + d.gapScore, 0) / matchingDatasets.length
        : 0

      return {
        rowKey,
        colKey,
        datasetCount: matchingDatasets.length,
        totalRequests,
        avgGapScore: Math.round(avgGapScore),
        datasets: matchingDatasets,
      }
    })
  })

  return grid
}

/**
 * Get heatmap row and column labels
 */
export function getHeatmapLabels(
  metrics: DatasetDemandMetrics[],
  rowDimension: HeatmapDimension,
  colDimension: HeatmapDimension
): { rows: string[]; cols: string[] } {
  const grid = buildHeatmapData(metrics, rowDimension, colDimension)
  if (grid.length === 0) return { rows: [], cols: [] }

  const rows = grid.map(row => row[0]?.rowKey || "")
  const cols = grid[0]?.map(cell => cell.colKey) || []

  return { rows, cols }
}

/**
 * Generate collection suggestions based on gap analysis
 */
export function generateCollectionSuggestions(
  metrics: DatasetDemandMetrics[],
  limit: number = 5
): CollectionSuggestion[] {
  // Group datasets by therapeutic area and find high-gap combinations
  const suggestions: CollectionSuggestion[] = []

  // Strategy 1: High-demand therapeutic areas with low coverage
  const taGroups = new Map<string, DatasetDemandMetrics[]>()
  metrics.forEach(m => {
    m.therapeuticArea.forEach(ta => {
      if (!taGroups.has(ta)) taGroups.set(ta, [])
      taGroups.get(ta)!.push(m)
    })
  })

  taGroups.forEach((datasets, ta) => {
    const avgGap = datasets.reduce((sum, d) => sum + d.gapScore, 0) / datasets.length
    const totalPending = datasets.reduce((sum, d) => sum + d.pendingRequests, 0)

    if (avgGap > 20 && totalPending > 10) {
      // Find dominant data types in this TA
      const typeCount = new Map<string, number>()
      datasets.forEach(d => d.dataTypes.forEach(t => typeCount.set(t, (typeCount.get(t) || 0) + 1)))
      const topTypes = Array.from(typeCount.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 2)
        .map(([type]) => type)

      suggestions.push({
        id: `suggestion-${ta.toLowerCase()}-${topTypes.join("-").toLowerCase()}`,
        title: `${ta} ${topTypes.join(" + ")} Collection`,
        description: `High demand for ${ta} datasets with ${topTypes.join(" and ")} data. ${totalPending} pending requests.`,
        filters: {
          therapeuticAreas: [ta],
          dataTypes: topTypes,
        },
        projectedUsers: totalPending + Math.floor(datasets.reduce((sum, d) => sum + d.activeUsers, 0) * 0.2),
        gapScore: Math.round(avgGap),
        topDatasets: datasets
          .sort((a, b) => b.gapScore - a.gapScore)
          .slice(0, 5)
          .map(d => d.datasetCode),
      })
    }
  })

  // Strategy 2: Intent-based gaps (e.g., AI/ML research with high demand)
  const aiResearchDatasets = metrics.filter(m => m.intentBreakdown.aiResearch > 30)
  if (aiResearchDatasets.length >= 3) {
    const avgGap = aiResearchDatasets.reduce((sum, d) => sum + d.gapScore, 0) / aiResearchDatasets.length
    const totalPending = aiResearchDatasets.reduce((sum, d) => sum + d.pendingRequests, 0)

    if (avgGap > 15) {
      suggestions.push({
        id: "suggestion-ai-ml-research",
        title: "AI/ML Research Ready Collection",
        description: `Datasets frequently requested for AI/ML research. ${totalPending} pending requests for ML-compatible data.`,
        filters: {
          intents: ["AI/ML"],
        },
        projectedUsers: totalPending + 25,
        gapScore: Math.round(avgGap),
        topDatasets: aiResearchDatasets
          .sort((a, b) => b.intentBreakdown.aiResearch - a.intentBreakdown.aiResearch)
          .slice(0, 5)
          .map(d => d.datasetCode),
      })
    }
  }

  // Sort by gap score and return top suggestions
  return suggestions
    .sort((a, b) => b.gapScore - a.gapScore)
    .slice(0, limit)
}

/**
 * Get trending datasets
 */
export function getTrendingDatasets(
  metrics: DatasetDemandMetrics[],
  direction: "up" | "down" = "up",
  limit: number = 10
): DatasetDemandMetrics[] {
  return metrics
    .filter(m => m.trendDirection === direction)
    .sort((a, b) => Math.abs(b.trendPercent) - Math.abs(a.trendPercent))
    .slice(0, limit)
}

/**
 * Get top requested datasets
 */
export function getTopRequestedDatasets(
  metrics: DatasetDemandMetrics[],
  limit: number = 10
): DatasetDemandMetrics[] {
  return [...metrics]
    .sort((a, b) => b.totalRequests - a.totalRequests)
    .slice(0, limit)
}

/**
 * Get high-gap datasets (opportunities)
 */
export function getHighGapDatasets(
  metrics: DatasetDemandMetrics[],
  limit: number = 10
): DatasetDemandMetrics[] {
  return [...metrics]
    .sort((a, b) => b.gapScore - a.gapScore)
    .slice(0, limit)
}

/**
 * Calculate aggregate stats
 */
export function calculateAggregateStats(metrics: DatasetDemandMetrics[]): {
  totalRequests: number
  totalPending: number
  hotDatasets: number
  trendingUp: number
  trendingDown: number
} {
  const totalRequests = metrics.reduce((sum, m) => sum + m.totalRequests, 0)
  const totalPending = metrics.reduce((sum, m) => sum + m.pendingRequests, 0)
  const hotDatasets = metrics.filter(m => m.gapScore > 30).length
  const trendingUp = metrics.filter(m => m.trendDirection === "up").length
  const trendingDown = metrics.filter(m => m.trendDirection === "down").length

  return {
    totalRequests,
    totalPending,
    hotDatasets,
    trendingUp,
    trendingDown,
  }
}

/**
 * Get color for gap score (for heatmap)
 */
export function getGapColor(gapScore: number): {
  bg: string
  text: string
  label: string
} {
  if (gapScore >= 50) {
    return { bg: "#ef4444", text: "#ffffff", label: "Hot" } // red-500
  } else if (gapScore >= 35) {
    return { bg: "#f97316", text: "#ffffff", label: "Warm" } // orange-500
  } else if (gapScore >= 20) {
    return { bg: "#eab308", text: "#000000", label: "Moderate" } // yellow-500
  } else if (gapScore >= 10) {
    return { bg: "#22c55e", text: "#ffffff", label: "Covered" } // green-500
  } else {
    return { bg: "#e5e7eb", text: "#6b7280", label: "Cold" } // gray-200
  }
}

/**
 * Get all unique therapeutic areas
 */
export function getAllTherapeuticAreas(metrics: DatasetDemandMetrics[]): string[] {
  const tas = new Set<string>()
  metrics.forEach(m => m.therapeuticArea.forEach(ta => tas.add(ta)))
  return Array.from(tas).sort()
}

/**
 * Get all unique data types
 */
export function getAllDataTypes(metrics: DatasetDemandMetrics[]): string[] {
  const types = new Set<string>()
  metrics.forEach(m => m.dataTypes.forEach(t => types.add(t)))
  return Array.from(types).sort()
}

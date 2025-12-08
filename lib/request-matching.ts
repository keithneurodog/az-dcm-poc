// Smart matching logic for data access requests

import {
  Dataset,
  DataAccessIntent,
  DatasetMatchResult,
  RequestMatchingResult,
  IntentConflict,
  IntentWarning,
  SimilarDataset,
  AccessCategory,
  MOCK_DATASETS,
  MOCK_COLLECTIONS,
} from "./dcm-mock-data"

// Calculate estimated weeks based on access breakdown and intent conflicts
function calculateEstimatedWeeks(
  dataset: Dataset,
  intentConflicts: IntentConflict[]
): number {
  const { accessBreakdown } = dataset

  // Base time based on access breakdown
  let baseWeeks = 0

  if (accessBreakdown.alreadyOpen >= 80) {
    baseWeeks = 0 // Immediate
  } else if (accessBreakdown.readyToGrant >= 50) {
    baseWeeks = 1 // ~1 week for auto-provisioning
  } else if (accessBreakdown.needsApproval >= 30) {
    baseWeeks = 2 // ~2 weeks for approval process
  } else {
    baseWeeks = 4 // ~4 weeks for new collection provisioning
  }

  // Add time for intent conflicts (these require additional governance)
  const conflictWeeks = intentConflicts.reduce((sum, c) => sum + c.addedWeeks, 0)

  // If dataset is missing/needs new collection
  if (accessBreakdown.missingLocation >= 30) {
    baseWeeks = Math.max(baseWeeks, 6) // New collection takes ~6-8 weeks
  }

  return baseWeeks + conflictWeeks
}

// Check for conflicts between user intent and dataset restrictions
function detectIntentConflicts(
  dataset: Dataset,
  intent: DataAccessIntent
): IntentConflict[] {
  const conflicts: IntentConflict[] = []
  const metadata = dataset.aotMetadata

  if (!metadata) return conflicts

  // AI/ML conflict
  if (metadata.restrictML && intent.beyondPrimaryUse.aiResearch) {
    conflicts.push({
      intentField: "aiResearch",
      intentLabel: "AI/ML Research",
      datasetRestriction: metadata.restrictionReason || "Dataset restricts AI/ML use",
      addedWeeks: 6, // Requires governance exception process
    })
  }

  // Software development conflict
  if (metadata.restrictSoftwareDev && intent.beyondPrimaryUse.softwareDevelopment) {
    conflicts.push({
      intentField: "softwareDevelopment",
      intentLabel: "Software Development",
      datasetRestriction: metadata.restrictionReason || "Dataset restricts software development",
      addedWeeks: 4,
    })
  }

  // Publication conflict
  if (metadata.restrictPublication && intent.publication.externalPublication) {
    conflicts.push({
      intentField: "externalPublication",
      intentLabel: "External Publication",
      datasetRestriction: metadata.restrictionReason || "Dataset restricts external publication",
      addedWeeks: 4,
    })
  }

  return conflicts
}

// Determine access category based on estimated weeks
function determineCategory(estimatedWeeks: number, hasConflicts: boolean): AccessCategory {
  if (hasConflicts && estimatedWeeks > 6) return "conflict"
  if (estimatedWeeks === 0) return "immediate"
  if (estimatedWeeks <= 2) return "soon"
  return "extended"
}

// Generate category reason text
function generateCategoryReason(
  dataset: Dataset,
  category: AccessCategory,
  intentConflicts: IntentConflict[]
): string {
  switch (category) {
    case "immediate":
      return "Already accessible through existing collection"
    case "soon":
      if (dataset.accessBreakdown.readyToGrant >= 50) {
        return "Ready to grant - automatic provisioning"
      }
      return "Pending collection access approval"
    case "extended":
      if (intentConflicts.length > 0) {
        return `Requires governance review for ${intentConflicts.map(c => c.intentLabel).join(", ")}`
      }
      if (dataset.accessBreakdown.missingLocation >= 30) {
        return "Requires new collection provisioning"
      }
      return "Requires extended approval process"
    case "conflict":
      return `Conflicts with your intent: ${intentConflicts.map(c => c.intentLabel).join(", ")}`
    default:
      return "Processing"
  }
}

// Find similar datasets that might be easier to access
function findSimilarDatasets(
  dataset: Dataset,
  intent: DataAccessIntent,
  allDatasets: Dataset[],
  excludeIds: string[]
): SimilarDataset[] {
  const similar: SimilarDataset[] = []

  for (const candidate of allDatasets) {
    // Skip self and already selected datasets
    if (candidate.id === dataset.id || excludeIds.includes(candidate.id)) continue

    // Calculate similarity score
    let score = 0

    // Same therapeutic area (+40)
    const sharedAreas = dataset.therapeuticArea.filter(ta =>
      candidate.therapeuticArea.includes(ta)
    )
    score += sharedAreas.length > 0 ? 40 : 0

    // Same phase (+20)
    if (candidate.phase === dataset.phase) score += 20

    // Similar patient population (+20)
    const patientRatio = Math.min(candidate.patientCount, dataset.patientCount) /
                         Math.max(candidate.patientCount, dataset.patientCount)
    score += patientRatio * 20

    // Similar data types (+20)
    const sharedCategories = dataset.categories.filter(c =>
      candidate.categories.includes(c)
    )
    score += (sharedCategories.length / Math.max(dataset.categories.length, 1)) * 20

    if (score < 50) continue // Only suggest highly similar datasets

    // Check if this dataset has better access
    const conflicts = detectIntentConflicts(candidate, intent)
    const weeks = calculateEstimatedWeeks(candidate, conflicts)
    const category = determineCategory(weeks, conflicts.length > 0)

    // Only suggest if it's in a better category
    const originalConflicts = detectIntentConflicts(dataset, intent)
    const originalWeeks = calculateEstimatedWeeks(dataset, originalConflicts)

    if (weeks < originalWeeks) {
      similar.push({
        dataset: candidate,
        similarityScore: Math.round(score),
        reason: sharedAreas.length > 0
          ? `Same therapeutic area (${sharedAreas[0]}), similar study design`
          : "Similar patient population and data types",
        accessCategory: category,
        estimatedWeeks: weeks,
      })
    }
  }

  // Return top 2 similar datasets, sorted by combination of similarity and access
  return similar
    .sort((a, b) => {
      // Prioritize immediate access, then similarity
      const accessScore = (d: SimilarDataset) =>
        d.accessCategory === "immediate" ? 100 :
        d.accessCategory === "soon" ? 50 : 0
      return (accessScore(b) + b.similarityScore) - (accessScore(a) + a.similarityScore)
    })
    .slice(0, 2)
}

// Generate intent warnings that affect multiple datasets
function generateIntentWarnings(
  results: DatasetMatchResult[],
  intent: DataAccessIntent
): IntentWarning[] {
  const warnings: IntentWarning[] = []

  // Group datasets by intent conflict type
  const aiConflicts = results.filter(r =>
    r.intentConflicts.some(c => c.intentField === "aiResearch")
  )
  const softwareConflicts = results.filter(r =>
    r.intentConflicts.some(c => c.intentField === "softwareDevelopment")
  )
  const pubConflicts = results.filter(r =>
    r.intentConflicts.some(c => c.intentField === "externalPublication")
  )

  if (aiConflicts.length > 0 && intent.beyondPrimaryUse.aiResearch) {
    warnings.push({
      intentField: "aiResearch",
      intentLabel: "AI/ML Research",
      affectedDatasetIds: aiConflicts.map(r => r.datasetId),
      affectedDatasetCodes: aiConflicts.map(r => r.dataset.code),
      addedWeeks: 6,
      message: `Your AI/ML intent adds ~6 weeks for ${aiConflicts.map(r => r.dataset.code).join(", ")} (not yet approved for ML use)`,
    })
  }

  if (softwareConflicts.length > 0 && intent.beyondPrimaryUse.softwareDevelopment) {
    warnings.push({
      intentField: "softwareDevelopment",
      intentLabel: "Software Development",
      affectedDatasetIds: softwareConflicts.map(r => r.datasetId),
      affectedDatasetCodes: softwareConflicts.map(r => r.dataset.code),
      addedWeeks: 4,
      message: `Your Software Development intent adds ~4 weeks for ${softwareConflicts.map(r => r.dataset.code).join(", ")}`,
    })
  }

  if (pubConflicts.length > 0 && intent.publication.externalPublication) {
    warnings.push({
      intentField: "externalPublication",
      intentLabel: "External Publication",
      affectedDatasetIds: pubConflicts.map(r => r.datasetId),
      affectedDatasetCodes: pubConflicts.map(r => r.dataset.code),
      addedWeeks: 4,
      message: `Your External Publication intent adds ~4 weeks for ${pubConflicts.map(r => r.dataset.code).join(", ")} (publication restricted)`,
    })
  }

  return warnings
}

// Main smart matching function
export function performSmartMatching(
  selectedDatasets: Dataset[],
  intent: DataAccessIntent
): RequestMatchingResult {
  const allDatasets = MOCK_DATASETS
  const selectedIds = selectedDatasets.map(d => d.id)

  // Process each selected dataset
  const results: DatasetMatchResult[] = selectedDatasets.map(dataset => {
    // Find matching collection
    const matchingCollection = MOCK_COLLECTIONS.find(col =>
      col.selectedDatasets.some(d => d.id === dataset.id)
    )

    // Detect conflicts
    const intentConflicts = detectIntentConflicts(dataset, intent)

    // Calculate timeline
    const estimatedWeeks = calculateEstimatedWeeks(dataset, intentConflicts)
    const estimatedDays = estimatedWeeks * 7

    // Determine category
    const hasBlockingConflicts = intentConflicts.length > 0 && estimatedWeeks > 8
    const accessCategory = determineCategory(estimatedWeeks, hasBlockingConflicts)

    // Find similar alternatives
    const similarDatasets = accessCategory === "extended" || accessCategory === "conflict"
      ? findSimilarDatasets(dataset, intent, allDatasets, selectedIds)
      : []

    return {
      datasetId: dataset.id,
      dataset,
      accessCategory,
      estimatedDays,
      estimatedWeeks,
      categoryReason: generateCategoryReason(dataset, accessCategory, intentConflicts),
      intentConflicts,
      matchingCollectionId: matchingCollection?.id,
      matchingCollectionName: matchingCollection?.name,
      similarDatasets,
    }
  })

  // Categorize results
  const immediate = results.filter(r => r.accessCategory === "immediate")
  const soon = results.filter(r => r.accessCategory === "soon")
  const extended = results.filter(r => r.accessCategory === "extended")
  const conflicts = results.filter(r => r.accessCategory === "conflict")

  // Generate warnings
  const intentWarnings = generateIntentWarnings(results, intent)

  // Calculate summary
  const maxWeeks = Math.max(...results.map(r => r.estimatedWeeks), 0)

  return {
    immediate,
    soon,
    extended,
    conflicts,
    summary: {
      totalDatasets: results.length,
      immediateCount: immediate.length,
      soonCount: soon.length,
      extendedCount: extended.length,
      conflictCount: conflicts.length,
      maxEstimatedWeeks: maxWeeks,
      estimatedFullAccessWeeks: maxWeeks,
    },
    intentWarnings,
  }
}

// Helper to recalculate after removing datasets
export function recalculateMatching(
  currentResult: RequestMatchingResult,
  removedDatasetIds: Set<string>,
  intent: DataAccessIntent
): RequestMatchingResult {
  const remainingDatasets = [
    ...currentResult.immediate,
    ...currentResult.soon,
    ...currentResult.extended,
    ...currentResult.conflicts,
  ]
    .filter(r => !removedDatasetIds.has(r.datasetId))
    .map(r => r.dataset)

  return performSmartMatching(remainingDatasets, intent)
}

// Get default intent (all false)
export function getDefaultIntent(): DataAccessIntent {
  return {
    primaryUse: {
      understandDrugMechanism: false,
      understandDisease: false,
      developDiagnosticTests: false,
      learnFromPastStudies: false,
      improveAnalysisMethods: false,
    },
    beyondPrimaryUse: {
      aiResearch: false,
      softwareDevelopment: false,
    },
    publication: {
      internalOnly: false,
      externalPublication: false,
    },
  }
}

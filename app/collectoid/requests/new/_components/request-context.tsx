"use client"

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"
import {
  Dataset,
  DataAccessIntent,
  RequestMatchingResult,
  DatasetMatchResult,
  MOCK_DATASETS,
} from "@/lib/dcm-mock-data"
import { performSmartMatching, getDefaultIntent } from "@/lib/request-matching"

type Step = "intent" | "review" | "confirmation"

interface RequestFlowState {
  currentStep: Step
  selectedDatasets: Dataset[]
  intent: DataAccessIntent
  matchingResult: RequestMatchingResult | null
  isMatching: boolean
  removedDatasetIds: Set<string>
  isSubmitting: boolean
  submittedRequestId: string | null
}

interface RequestFlowContextValue extends RequestFlowState {
  goToStep: (step: Step) => void
  goNext: () => void
  goBack: () => void
  updateIntent: (intent: DataAccessIntent) => void
  removeDataset: (datasetId: string) => void
  restoreDataset: (datasetId: string) => void
  removeDatasetsByCategory: (category: "extended" | "conflict") => void
  addDataset: (dataset: Dataset) => void
  swapDataset: (removeId: string, addDataset: Dataset) => void
  submitRequest: () => Promise<void>
  activeDatasets: Dataset[]
  activeMatchingResult: RequestMatchingResult | null
  // Preview intent changes without committing
  previewIntent: DataAccessIntent | null
  setPreviewIntent: (intent: DataAccessIntent | null) => void
  previewMatchingResult: RequestMatchingResult | null
  // Aggregated stats for large dataset handling
  stats: {
    total: number
    immediate: number
    soon: number
    extended: number
    conflict: number
    removed: number
    maxWeeks: number
  }
}

const RequestFlowContext = createContext<RequestFlowContextValue | null>(null)

export function useRequestFlow() {
  const context = useContext(RequestFlowContext)
  if (!context) {
    throw new Error("useRequestFlow must be used within RequestFlowProvider")
  }
  return context
}

interface RequestFlowProviderProps {
  children: React.ReactNode
}

export function RequestFlowProvider({ children }: RequestFlowProviderProps) {
  const [currentStep, setCurrentStep] = useState<Step>("intent")
  const [selectedDatasets, setSelectedDatasets] = useState<Dataset[]>([])
  const [intent, setIntent] = useState<DataAccessIntent>(getDefaultIntent())
  const [matchingResult, setMatchingResult] = useState<RequestMatchingResult | null>(null)
  const [isMatching, setIsMatching] = useState(false)
  const [removedDatasetIds, setRemovedDatasetIds] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedRequestId, setSubmittedRequestId] = useState<string | null>(null)
  const [previewIntent, setPreviewIntent] = useState<DataAccessIntent | null>(null)
  const [previewMatchingResult, setPreviewMatchingResult] = useState<RequestMatchingResult | null>(null)

  // Load selected datasets from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("selected_datasets_for_request")
      if (stored) {
        try {
          const ids: string[] = JSON.parse(stored)
          const datasets = MOCK_DATASETS.filter(d => ids.includes(d.id))
          setSelectedDatasets(datasets)
        } catch (e) {
          console.error("Failed to parse selected datasets", e)
        }
      } else {
        // Default datasets for testing - includes a mix of open, ready, approval, and complex
        const defaultIds = [
          "dcode-101", "dcode-102", "dcode-103", "dcode-104", "dcode-105",
          "dcode-501", "dcode-502", "dcode-503", "dcode-504", "dcode-505" // Complex datasets
        ]
        const datasets = MOCK_DATASETS.filter(d => defaultIds.includes(d.id))
        setSelectedDatasets(datasets)
      }
    }
  }, [])

  // Compute active datasets
  const activeDatasets = useMemo(() =>
    selectedDatasets.filter(d => !removedDatasetIds.has(d.id)),
    [selectedDatasets, removedDatasetIds]
  )

  // Recompute matching
  const recomputeMatching = useCallback((datasets: Dataset[], newIntent: DataAccessIntent) => {
    if (datasets.length === 0) {
      setMatchingResult(null)
      return
    }
    setIsMatching(true)
    setTimeout(() => {
      const result = performSmartMatching(datasets, newIntent)
      setMatchingResult(result)
      setIsMatching(false)
    }, 50)
  }, [])

  // Navigation
  const goToStep = useCallback((step: Step) => setCurrentStep(step), [])

  const goNext = useCallback(() => {
    if (currentStep === "intent") {
      recomputeMatching(activeDatasets, intent)
      setCurrentStep("review")
    } else if (currentStep === "review") {
      setCurrentStep("confirmation")
    }
  }, [currentStep, activeDatasets, intent, recomputeMatching])

  const goBack = useCallback(() => {
    if (currentStep === "review") setCurrentStep("intent")
    else if (currentStep === "confirmation") setCurrentStep("review")
  }, [currentStep])

  // Intent management
  const updateIntent = useCallback((newIntent: DataAccessIntent) => {
    setIntent(newIntent)
    if (currentStep === "review") {
      recomputeMatching(activeDatasets, newIntent)
    }
  }, [currentStep, activeDatasets, recomputeMatching])

  // Dataset management - no recompute needed, UI calculates from removedDatasetIds
  const removeDataset = useCallback((datasetId: string) => {
    setRemovedDatasetIds(prev => new Set([...prev, datasetId]))
  }, [])

  const restoreDataset = useCallback((datasetId: string) => {
    setRemovedDatasetIds(prev => {
      const next = new Set(prev)
      next.delete(datasetId)
      return next
    })
  }, [])

  // Add a new dataset (e.g., alternative recommendation) - no recompute needed
  const addDataset = useCallback((dataset: Dataset) => {
    setSelectedDatasets(prev => {
      if (prev.some(d => d.id === dataset.id)) return prev // Already selected
      return [...prev, dataset]
    })
  }, [])

  // Swap one dataset for another (remove old, add new) - no recompute needed
  const swapDataset = useCallback((removeId: string, newDataset: Dataset) => {
    setRemovedDatasetIds(prev => new Set([...prev, removeId]))
    setSelectedDatasets(prev => {
      if (prev.some(d => d.id === newDataset.id)) return prev
      return [...prev, newDataset]
    })
  }, [])

  // Preview intent - recompute matching when preview intent changes
  useEffect(() => {
    if (previewIntent && activeDatasets.length > 0) {
      const result = performSmartMatching(activeDatasets, previewIntent)
      setPreviewMatchingResult(result)
    } else {
      setPreviewMatchingResult(null)
    }
  }, [previewIntent, activeDatasets])

  const removeDatasetsByCategory = useCallback((category: "extended" | "conflict") => {
    if (!matchingResult) return
    const toRemove = category === "extended"
      ? matchingResult.extended.map(r => r.datasetId)
      : matchingResult.conflicts.map(r => r.datasetId)

    setRemovedDatasetIds(prev => new Set([...prev, ...toRemove]))
  }, [matchingResult])

  // Submission
  const submitRequest = useCallback(async () => {
    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    const requestId = `REQ-${Date.now()}`
    setSubmittedRequestId(requestId)
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("selected_datasets_for_request")
    }
    setIsSubmitting(false)
    setCurrentStep("confirmation")
  }, [])

  // Compute active matching result
  const activeMatchingResult = useMemo(() => {
    if (!matchingResult) return null
    return {
      ...matchingResult,
      immediate: matchingResult.immediate.filter(r => !removedDatasetIds.has(r.datasetId)),
      soon: matchingResult.soon.filter(r => !removedDatasetIds.has(r.datasetId)),
      extended: matchingResult.extended.filter(r => !removedDatasetIds.has(r.datasetId)),
      conflicts: matchingResult.conflicts.filter(r => !removedDatasetIds.has(r.datasetId)),
      summary: {
        ...matchingResult.summary,
        totalDatasets: activeDatasets.length,
        immediateCount: matchingResult.immediate.filter(r => !removedDatasetIds.has(r.datasetId)).length,
        soonCount: matchingResult.soon.filter(r => !removedDatasetIds.has(r.datasetId)).length,
        extendedCount: matchingResult.extended.filter(r => !removedDatasetIds.has(r.datasetId)).length,
        conflictCount: matchingResult.conflicts.filter(r => !removedDatasetIds.has(r.datasetId)).length,
      },
    }
  }, [matchingResult, removedDatasetIds, activeDatasets.length])

  // Aggregated stats for efficient rendering
  const stats = useMemo(() => ({
    total: activeDatasets.length,
    immediate: activeMatchingResult?.summary.immediateCount || 0,
    soon: activeMatchingResult?.summary.soonCount || 0,
    extended: activeMatchingResult?.summary.extendedCount || 0,
    conflict: activeMatchingResult?.summary.conflictCount || 0,
    removed: removedDatasetIds.size,
    maxWeeks: activeMatchingResult?.summary.estimatedFullAccessWeeks || 0,
  }), [activeDatasets.length, activeMatchingResult, removedDatasetIds.size])

  const value: RequestFlowContextValue = {
    currentStep,
    selectedDatasets,
    intent,
    matchingResult,
    isMatching,
    removedDatasetIds,
    isSubmitting,
    submittedRequestId,
    goToStep,
    goNext,
    goBack,
    updateIntent,
    removeDataset,
    restoreDataset,
    removeDatasetsByCategory,
    addDataset,
    swapDataset,
    submitRequest,
    activeDatasets,
    activeMatchingResult,
    previewIntent,
    setPreviewIntent,
    previewMatchingResult,
    stats,
  }

  return (
    <RequestFlowContext.Provider value={value}>
      {children}
    </RequestFlowContext.Provider>
  )
}

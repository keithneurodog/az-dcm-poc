"use client"

import React, { createContext, useContext, useState, useCallback, useEffect } from "react"
import {
  Dataset,
  DataAccessIntent,
  RequestMatchingResult,
  MOCK_DATASETS,
} from "@/lib/dcm-mock-data"
import { performSmartMatching, getDefaultIntent } from "@/lib/request-matching"

type Step = "intent" | "builder" | "confirmation"

interface RequestFlowState {
  // Current step
  currentStep: Step

  // Selected datasets (loaded from sessionStorage)
  selectedDatasets: Dataset[]

  // User intent
  intent: DataAccessIntent

  // Matching results (computed after intent is set)
  matchingResult: RequestMatchingResult | null
  isMatching: boolean

  // Removed datasets (user can remove during refinement)
  removedDatasetIds: Set<string>

  // Submission state
  isSubmitting: boolean
  submittedRequestId: string | null
}

interface RequestFlowContextValue extends RequestFlowState {
  // Navigation
  goToStep: (step: Step) => void
  goNext: () => void
  goBack: () => void

  // Intent
  updateIntent: (intent: DataAccessIntent) => void

  // Dataset management
  removeDataset: (datasetId: string) => void
  restoreDataset: (datasetId: string) => void
  swapDataset: (oldDatasetId: string, newDataset: Dataset) => void
  addDataset: (dataset: Dataset) => void

  // Submission
  submitRequest: () => Promise<void>

  // Computed values
  activeDatasets: Dataset[]
  activeMatchingResult: RequestMatchingResult | null
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
      }
    }
  }, [])

  // Compute active datasets (selected minus removed)
  const activeDatasets = selectedDatasets.filter(d => !removedDatasetIds.has(d.id))

  // Recompute matching when intent or datasets change
  const recomputeMatching = useCallback((datasets: Dataset[], newIntent: DataAccessIntent) => {
    if (datasets.length === 0) {
      setMatchingResult(null)
      return
    }

    setIsMatching(true)

    // Simulate async matching with small delay for animation
    setTimeout(() => {
      const result = performSmartMatching(datasets, newIntent)
      setMatchingResult(result)
      setIsMatching(false)
    }, 100)
  }, [])

  // Navigation
  const goToStep = useCallback((step: Step) => {
    setCurrentStep(step)
  }, [])

  const goNext = useCallback(() => {
    if (currentStep === "intent") {
      // Compute matching when moving from intent to builder
      recomputeMatching(activeDatasets, intent)
      setCurrentStep("builder")
    } else if (currentStep === "builder") {
      setCurrentStep("confirmation")
    }
  }, [currentStep, activeDatasets, intent, recomputeMatching])

  const goBack = useCallback(() => {
    if (currentStep === "builder") {
      setCurrentStep("intent")
    } else if (currentStep === "confirmation") {
      setCurrentStep("builder")
    }
  }, [currentStep])

  // Intent management
  const updateIntent = useCallback((newIntent: DataAccessIntent) => {
    setIntent(newIntent)
    // Recompute matching if we're on the builder step
    if (currentStep === "builder") {
      recomputeMatching(activeDatasets, newIntent)
    }
  }, [currentStep, activeDatasets, recomputeMatching])

  // Dataset management
  const removeDataset = useCallback((datasetId: string) => {
    setRemovedDatasetIds(prev => new Set([...prev, datasetId]))
    // Recompute matching
    const remaining = activeDatasets.filter(d => d.id !== datasetId)
    recomputeMatching(remaining, intent)
  }, [activeDatasets, intent, recomputeMatching])

  const restoreDataset = useCallback((datasetId: string) => {
    setRemovedDatasetIds(prev => {
      const next = new Set(prev)
      next.delete(datasetId)
      return next
    })
    // Recompute matching
    const restored = selectedDatasets.filter(d =>
      !removedDatasetIds.has(d.id) || d.id === datasetId
    )
    recomputeMatching(restored, intent)
  }, [selectedDatasets, removedDatasetIds, intent, recomputeMatching])

  const swapDataset = useCallback((oldDatasetId: string, newDataset: Dataset) => {
    // Remove old, add new
    setSelectedDatasets(prev => [
      ...prev.filter(d => d.id !== oldDatasetId),
      newDataset,
    ])
    // Update removed set
    setRemovedDatasetIds(prev => {
      const next = new Set(prev)
      next.delete(oldDatasetId) // In case it was removed
      return next
    })
    // Recompute
    const updated = [
      ...activeDatasets.filter(d => d.id !== oldDatasetId),
      newDataset,
    ]
    recomputeMatching(updated, intent)
  }, [activeDatasets, intent, recomputeMatching])

  const addDataset = useCallback((dataset: Dataset) => {
    if (selectedDatasets.some(d => d.id === dataset.id)) return
    setSelectedDatasets(prev => [...prev, dataset])
    // Recompute
    const updated = [...activeDatasets, dataset]
    recomputeMatching(updated, intent)
  }, [selectedDatasets, activeDatasets, intent, recomputeMatching])

  // Submission
  const submitRequest = useCallback(async () => {
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate a request ID
    const requestId = `REQ-${Date.now()}`
    setSubmittedRequestId(requestId)

    // Clear sessionStorage
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("selected_datasets_for_request")
    }

    setIsSubmitting(false)
    setCurrentStep("confirmation")
  }, [])

  // Compute active matching result (filtering out removed datasets)
  const activeMatchingResult = matchingResult
    ? {
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
    : null

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
    swapDataset,
    addDataset,
    submitRequest,
    activeDatasets,
    activeMatchingResult,
  }

  return (
    <RequestFlowContext.Provider value={value}>
      {children}
    </RequestFlowContext.Provider>
  )
}

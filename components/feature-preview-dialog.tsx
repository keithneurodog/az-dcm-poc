"use client"

import { useEffect, useCallback } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Workflow, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

export interface FeatureForPreview {
  id: number
  icon: LucideIcon
  title: string
  short: string
  previewDescription: string
  previewImagePath?: string
  route: string
  isFlowEmbedded: boolean
  flowStartRoute?: string
  stepNumber?: number
  stepLabel?: string
  category: "workflow" | "discovery" | "analytics"
}

interface FeaturePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: FeatureForPreview | null
  features?: FeatureForPreview[]
  onNavigate?: (feature: FeatureForPreview) => void
}

export function FeaturePreviewDialog({
  open,
  onOpenChange,
  feature,
  features = [],
  onNavigate,
}: FeaturePreviewDialogProps) {
  const currentIndex = feature ? features.findIndex(f => f.id === feature.id) : -1
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex >= 0 && currentIndex < features.length - 1

  const goToNext = useCallback(() => {
    if (hasNext && onNavigate && currentIndex >= 0) {
      onNavigate(features[currentIndex + 1])
    }
  }, [hasNext, onNavigate, features, currentIndex])

  const goToPrev = useCallback(() => {
    if (hasPrev && onNavigate) {
      onNavigate(features[currentIndex - 1])
    }
  }, [hasPrev, onNavigate, features, currentIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, goToPrev, goToNext])

  if (!feature) return null

  const Icon = feature.icon

  const categoryStyles = {
    workflow: {
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      border: "border-blue-100",
    },
    discovery: {
      bg: "bg-violet-50",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      border: "border-violet-100",
    },
    analytics: {
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      border: "border-amber-100",
    },
  }[feature.category]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[90vw] lg:max-w-6xl max-h-[95vh] overflow-y-auto">
        {/* Navigation buttons */}
        {features.length > 1 && onNavigate && (
          <>
            <button
              onClick={goToPrev}
              disabled={!hasPrev}
              className={cn(
                "absolute left-2 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm transition-all",
                hasPrev ? "hover:bg-neutral-50 hover:border-neutral-300 cursor-pointer" : "opacity-30 cursor-not-allowed"
              )}
              aria-label="Previous feature"
            >
              <ChevronLeft className="size-5 text-neutral-600" strokeWidth={1.5} />
            </button>
            <button
              onClick={goToNext}
              disabled={!hasNext}
              className={cn(
                "absolute right-2 top-1/2 -translate-y-1/2 z-10 size-10 rounded-full bg-white border border-neutral-200 flex items-center justify-center shadow-sm transition-all",
                hasNext ? "hover:bg-neutral-50 hover:border-neutral-300 cursor-pointer" : "opacity-30 cursor-not-allowed"
              )}
              aria-label="Next feature"
            >
              <ChevronRight className="size-5 text-neutral-600" strokeWidth={1.5} />
            </button>
          </>
        )}

        <DialogHeader>
          <div className="flex items-start gap-3 mb-2">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-xl shrink-0",
                categoryStyles.iconBg
              )}
            >
              <Icon
                className={cn("size-5", categoryStyles.iconColor)}
                strokeWidth={1.5}
              />
            </div>
            <div className="min-w-0">
              <DialogTitle className="text-lg font-medium text-neutral-900">
                {feature.title}
              </DialogTitle>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-neutral-500">
                {feature.stepLabel && (
                  <>
                    <Workflow className="size-3" />
                    <span>{feature.stepLabel}</span>
                    <span className="text-neutral-300 mx-1">·</span>
                    <span>DCM Wizard</span>
                  </>
                )}
                {features.length > 1 && (
                  <>
                    {feature.stepLabel && <span className="text-neutral-300 mx-1">·</span>}
                    <span className="text-neutral-400">{currentIndex + 1} of {features.length}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <DialogDescription className="text-sm text-neutral-600 leading-relaxed pt-2">
            {feature.previewDescription}
          </DialogDescription>
        </DialogHeader>

        {/* Preview Image or Placeholder */}
        <div
          className={cn(
            "relative w-full rounded-lg overflow-hidden border",
            !feature.previewImagePath && "aspect-video",
            !feature.previewImagePath && categoryStyles.bg,
            !feature.previewImagePath && categoryStyles.border,
            feature.previewImagePath && "border-neutral-200"
          )}
        >
          {feature.previewImagePath ? (
            <Image
              src={feature.previewImagePath}
              alt={`${feature.title} preview`}
              width={1920}
              height={1080}
              className="w-full h-auto"
              sizes="(max-width: 1024px) 90vw, 1152px"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Icon
                className={cn("size-12 mb-3 opacity-40", categoryStyles.iconColor)}
                strokeWidth={1}
              />
              <span className="text-xs text-neutral-400 uppercase tracking-wider">
                Preview coming soon
              </span>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          <Link
            href={feature.isFlowEmbedded ? (feature.flowStartRoute || feature.route) : feature.route}
            className="w-full sm:w-auto"
            onClick={() => onOpenChange(false)}
          >
            <Button className="w-full bg-neutral-900 hover:bg-neutral-800">
              <Play className="size-4 mr-2" />
              {feature.isFlowEmbedded ? "Start the wizard" : "Go to feature"}
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

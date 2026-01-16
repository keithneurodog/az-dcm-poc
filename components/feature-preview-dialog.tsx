"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Workflow } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface FeaturePreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  feature: {
    icon: LucideIcon
    title: string
    previewDescription: string
    previewImagePath?: string
    route: string
    isFlowEmbedded: boolean
    flowStartRoute?: string
    stepNumber?: number
    stepLabel?: string
    category: "workflow" | "discovery" | "analytics"
  } | null
}

export function FeaturePreviewDialog({
  open,
  onOpenChange,
  feature,
}: FeaturePreviewDialogProps) {
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
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
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
              {feature.stepLabel && (
                <div className="flex items-center gap-1 mt-1.5 text-xs text-neutral-500">
                  <Workflow className="size-3" />
                  <span>{feature.stepLabel}</span>
                  <span className="text-neutral-300 mx-1">·</span>
                  <span>DCM Wizard</span>
                </div>
              )}
            </div>
          </div>
          <DialogDescription className="text-sm text-neutral-600 leading-relaxed pt-2">
            {feature.previewDescription}
          </DialogDescription>
        </DialogHeader>

        {/* Preview Image or Placeholder */}
        <div
          className={cn(
            "relative aspect-video w-full rounded-lg overflow-hidden border",
            !feature.previewImagePath && categoryStyles.bg,
            !feature.previewImagePath && categoryStyles.border,
            feature.previewImagePath && "border-neutral-200"
          )}
        >
          {feature.previewImagePath ? (
            <Image
              src={feature.previewImagePath}
              alt={`${feature.title} preview`}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 768px"
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

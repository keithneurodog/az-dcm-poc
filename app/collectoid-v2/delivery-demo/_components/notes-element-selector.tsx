"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { MousePointer2 } from "lucide-react"

interface NotesElementSelectorProps {
  onConfirm: (element: Element) => void
  onCancel: () => void
}

const SKIP_TAGS = ["html", "body", "head", "script", "style", "noscript", "svg", "path"]

function getElementLabel(el: Element): string {
  const tag = el.tagName.toLowerCase()
  if (el.id) return `#${el.id}`

  if (el.className && typeof el.className === "string") {
    const classes = el.className.split(" ").filter(Boolean)
    const meaningfulClass = classes.find(c =>
      !c.startsWith("css-") &&
      !c.match(/^[a-z]{6,}$/) &&
      c.length > 2
    )
    if (meaningfulClass) return `.${meaningfulClass}`
  }

  if (["button", "a", "h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "label"].includes(tag)) {
    const text = el.textContent?.trim().slice(0, 20)
    if (text) return `${tag} "${text}${(el.textContent?.trim().length || 0) > 20 ? "..." : ""}"`
  }

  return tag
}

function isMeaningfulElement(el: Element): boolean {
  const tag = el.tagName.toLowerCase()
  if (SKIP_TAGS.includes(tag)) return false

  const rect = el.getBoundingClientRect()
  if (rect.width < 10 || rect.height < 10) return false

  return true
}

export function NotesElementSelector({
  onConfirm,
  onCancel,
}: NotesElementSelectorProps) {
  const [hoveredElement, setHoveredElement] = useState<Element | null>(null)
  const [hoverRect, setHoverRect] = useState<DOMRect | null>(null)
  const [mounted, setMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)

    // Add crosshair cursor to body during selection
    document.body.style.cursor = "crosshair"
    return () => {
      document.body.style.cursor = ""
    }
  }, [])

  // Update hover rect and track position during scroll
  useEffect(() => {
    if (hoveredElement) {
      const updateRect = () => {
        const rect = hoveredElement.getBoundingClientRect()
        setHoverRect(rect)
      }

      updateRect()

      window.addEventListener("scroll", updateRect, true)
      window.addEventListener("resize", updateRect)

      return () => {
        window.removeEventListener("scroll", updateRect, true)
        window.removeEventListener("resize", updateRect)
      }
    } else {
      setHoverRect(null)
    }
  }, [hoveredElement])

  // Mouse tracking for element picking
  useEffect(() => {
    function handleMouseMove(e: MouseEvent) {
      setMousePos({ x: e.clientX, y: e.clientY })

      const target = document.elementFromPoint(e.clientX, e.clientY)
      if (target && isMeaningfulElement(target)) {
        if (target.closest("[data-notes-selector]")) {
          setHoveredElement(null)
          return
        }
        setHoveredElement(target)
      } else {
        setHoveredElement(null)
      }
    }

    function handleClick(e: MouseEvent) {
      const target = document.elementFromPoint(e.clientX, e.clientY)
      if (target && isMeaningfulElement(target) && !target.closest("[data-notes-selector]")) {
        e.preventDefault()
        e.stopPropagation()
        // Click confirms immediately
        onConfirm(target)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("click", handleClick, true)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("click", handleClick, true)
    }
  }, [onConfirm])

  // Keyboard shortcut for escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault()
        onCancel()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [onCancel])

  if (!mounted) return null

  const showHighlight = hoverRect && hoveredElement

  return createPortal(
    <>
      {/* Hover preview highlight - always rendered for smooth transitions */}
      <div
        className="pointer-events-none fixed z-[9998] border-2 border-dashed border-blue-500 bg-blue-500/10 rounded transition-all duration-150 ease-out"
        style={{
          left: (hoverRect?.left ?? 0) - 2,
          top: (hoverRect?.top ?? 0) - 2,
          width: (hoverRect?.width ?? 0) + 4,
          height: (hoverRect?.height ?? 0) + 4,
          opacity: showHighlight ? 1 : 0,
        }}
      />

      {/* Floating tooltip showing element info */}
      {showHighlight && (
        <div
          className="pointer-events-none fixed z-[10000] max-w-[280px] rounded-lg border border-neutral-200 bg-white px-2.5 py-1.5 shadow-lg"
          style={{
            left: Math.min(mousePos.x + 16, window.innerWidth - 300),
            top: mousePos.y + 16,
          }}
        >
          <p className="truncate text-xs font-medium text-neutral-700">
            {getElementLabel(hoveredElement)}
          </p>
          <p className="truncate text-[10px] text-neutral-400">
            Click to select
          </p>
        </div>
      )}

      {/* Minimal instruction bar */}
      <div
        data-notes-selector
        className="fixed z-[9999] left-1/2 bottom-6 -translate-x-1/2 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 shadow-xl animate-in slide-in-from-bottom-4 fade-in-0"
      >
        <MousePointer2 className="size-5 text-blue-500" strokeWidth={1.5} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-light text-neutral-900">
            Click on any element to pin your note
          </p>
        </div>
        <span className="text-xs font-light text-neutral-400">
          <kbd className="px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-500">Esc</kbd> to cancel
        </span>
      </div>

      {/* Backdrop - pointer-events-none so mouse can reach elements underneath */}
      <div
        data-notes-selector
        className="fixed inset-0 z-[9997] pointer-events-none bg-black/5"
      />
    </>,
    document.body
  )
}

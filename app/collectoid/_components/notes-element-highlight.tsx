"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { createPortal } from "react-dom"
import { getElementFromXPath } from "@/lib/dcm-mock-data"

interface NotesElementHighlightProps {
  xpath: string | null
}

export function NotesElementHighlight({ xpath }: NotesElementHighlightProps) {
  const [rect, setRect] = useState<{ left: number; top: number; width: number; height: number } | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const lastRectRef = useRef<{ left: number; top: number; width: number; height: number } | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateRect = useCallback((element: Element) => {
    // Cancel any pending animation frame
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
    }

    // Use requestAnimationFrame to batch updates and catch layout changes
    rafRef.current = requestAnimationFrame(() => {
      const r = element.getBoundingClientRect()
      const newRect = {
        left: r.left,
        top: r.top,
        width: r.width,
        height: r.height,
      }
      setRect(newRect)
      lastRectRef.current = newRect
      setIsVisible(true)
    })
  }, [])

  useEffect(() => {
    if (!xpath) {
      setIsVisible(false)
      return
    }

    const element = getElementFromXPath(xpath)
    if (!element) {
      setIsVisible(false)
      return
    }

    const handleUpdate = () => updateRect(element)
    handleUpdate()

    window.addEventListener("scroll", handleUpdate, true)
    window.addEventListener("resize", handleUpdate)

    // Use ResizeObserver for element size changes
    const resizeObserver = new ResizeObserver(handleUpdate)
    resizeObserver.observe(element)

    // Use MutationObserver to detect DOM/layout changes (like sidebar collapse)
    const mutationObserver = new MutationObserver(() => {
      // Debounce with requestAnimationFrame
      handleUpdate()
    })

    // Observe the document body for attribute and subtree changes
    mutationObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["class", "style"],
      subtree: true,
    })

    // Also poll periodically as a fallback for CSS transitions
    const intervalId = setInterval(handleUpdate, 100)

    return () => {
      window.removeEventListener("scroll", handleUpdate, true)
      window.removeEventListener("resize", handleUpdate)
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      clearInterval(intervalId)
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [xpath, updateRect])

  if (!mounted) return null

  // Use last known rect for smooth fade-out transitions
  const displayRect = rect || lastRectRef.current

  if (!displayRect) return null

  return createPortal(
    <div
      className="pointer-events-none fixed z-[9990] rounded border-2 border-blue-400/60 bg-blue-400/10 transition-all duration-150 ease-out"
      style={{
        left: displayRect.left - 2,
        top: displayRect.top - 2,
        width: displayRect.width + 4,
        height: displayRect.height + 4,
        opacity: isVisible ? 1 : 0,
      }}
    />,
    document.body
  )
}

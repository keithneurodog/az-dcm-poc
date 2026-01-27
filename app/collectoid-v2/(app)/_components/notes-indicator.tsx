"use client"

import { useState, useEffect, useCallback } from "react"
import { createPortal } from "react-dom"
import { StickyNote, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useColorScheme } from "./color-context"
import { Note, getElementFromXPath } from "@/lib/dcm-mock-data"
import { useNotes } from "./notes-context"

interface NoteIndicatorProps {
  note: Note
  onClick: () => void
}

function NoteIndicator({ note, onClick }: NoteIndicatorProps) {
  const { scheme } = useColorScheme()
  const { highlightedNoteId } = useNotes()
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  const updatePosition = useCallback(() => {
    const element = getElementFromXPath(note.xpath)
    if (element) {
      const rect = element.getBoundingClientRect()
      // Position indicator at top-right of the element
      setPosition({
        x: rect.right - 8,
        y: rect.top - 8,
      })
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [note.xpath])

  useEffect(() => {
    updatePosition()

    const handleScroll = () => updatePosition()
    const handleResize = () => updatePosition()

    window.addEventListener("scroll", handleScroll, true)
    window.addEventListener("resize", handleResize)

    // Also use ResizeObserver for container changes
    const resizeObserver = new ResizeObserver(updatePosition)
    const element = getElementFromXPath(note.xpath)
    if (element) {
      resizeObserver.observe(element)
    }

    return () => {
      window.removeEventListener("scroll", handleScroll, true)
      window.removeEventListener("resize", handleResize)
      resizeObserver.disconnect()
    }
  }, [note.xpath, updatePosition])

  if (!isVisible || !position) return null

  const isHighlighted = highlightedNoteId === note.id
  const totalReplies = note.replies.length

  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed z-[100] flex items-center gap-1 rounded-full px-2 py-1 shadow-lg transition-all duration-200 hover:scale-110",
        isHighlighted
          ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
          : "bg-white border border-neutral-200 text-neutral-600 hover:border-neutral-300"
      )}
      style={{
        left: position.x,
        top: position.y,
      }}
      title={`${note.content.slice(0, 50)}${note.content.length > 50 ? "..." : ""}`}
    >
      <StickyNote className="size-3.5" strokeWidth={1.5} />
      {totalReplies > 0 && (
        <span className="flex items-center gap-0.5 text-[10px] font-light">
          <MessageSquare className="size-2.5" strokeWidth={1.5} />
          {totalReplies}
        </span>
      )}
    </button>
  )
}

interface NotesIndicatorsProps {
  notes: Note[]
  onNoteClick: (noteId: string) => void
}

export function NotesIndicators({ notes, onNoteClick }: NotesIndicatorsProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || notes.length === 0) return null

  // Group notes by xpath to show count badges
  // Filter out page-level notes (empty xpath) - they don't need indicators
  const notesByXpath = notes.reduce((acc, note) => {
    if (!note.xpath) return acc // Skip page-level notes
    if (!acc[note.xpath]) {
      acc[note.xpath] = []
    }
    acc[note.xpath].push(note)
    return acc
  }, {} as Record<string, Note[]>)

  return createPortal(
    <>
      {Object.entries(notesByXpath).map(([xpath, xpathNotes]) => (
        <NoteIndicator
          key={xpath}
          note={xpathNotes[0]} // Show indicator for first note, click shows all
          onClick={() => onNoteClick(xpathNotes[0].id)}
        />
      ))}
    </>,
    document.body
  )
}

"use client"

import { useState, useCallback, ReactNode, useMemo } from "react"
import { useNotes } from "./notes-context"
import { NotesElementSelector } from "./notes-element-selector"
import { NotesInputDialog, UserNamePrompt } from "./notes-input-dialog"
import { NotesIndicators } from "./notes-indicator"
import { NotesElementHighlight } from "./notes-element-highlight"
import { getXPath } from "@/lib/dcm-mock-data"

interface NotesWrapperProps {
  children: ReactNode
}

export function NotesWrapper({ children }: NotesWrapperProps) {
  const {
    currentRouteNotes,
    isUserPromptOpen,
    isAddingNote,
    highlightedNoteId,
    setCurrentUserName,
    addNote,
    cancelAddingNote,
    setHighlightedNoteId,
    setExpandedNoteId,
    setIsPanelOpen,
  } = useNotes()

  const [isSelectingElement, setIsSelectingElement] = useState(false)
  const [selectedXPath, setSelectedXPath] = useState<string | null>(null)

  // Get the xpath of the highlighted note (if any)
  const highlightedNoteXPath = useMemo(() => {
    if (!highlightedNoteId) return null
    const note = currentRouteNotes.find((n) => n.id === highlightedNoteId)
    return note?.xpath || null
  }, [highlightedNoteId, currentRouteNotes])

  const handleStartElementSelection = useCallback(() => {
    setIsSelectingElement(true)
  }, [])

  const handleElementConfirm = useCallback((element: Element) => {
    const xpath = getXPath(element)
    setSelectedXPath(xpath)
    setIsSelectingElement(false)
  }, [])

  const handleElementCancel = useCallback(() => {
    setIsSelectingElement(false)
  }, [])

  const handleClearElement = useCallback(() => {
    setSelectedXPath(null)
  }, [])

  const handleNoteSubmit = useCallback(
    (content: string) => {
      addNote(selectedXPath, content)
      setSelectedXPath(null)
    },
    [addNote, selectedXPath]
  )

  const handleInputCancel = useCallback(() => {
    setSelectedXPath(null)
    cancelAddingNote()
  }, [cancelAddingNote])

  const handleNoteIndicatorClick = useCallback(
    (noteId: string) => {
      setHighlightedNoteId(noteId)
      setExpandedNoteId(noteId)
      setIsPanelOpen(true)
    },
    [setHighlightedNoteId, setExpandedNoteId, setIsPanelOpen]
  )

  return (
    <>
      {children}

      {/* Note input dialog - shown first when adding a note */}
      {isAddingNote && !isSelectingElement && (
        <NotesInputDialog
          title="Add Note"
          placeholder={selectedXPath ? "Write your note about this element..." : "Write your note about this page..."}
          selectedXPath={selectedXPath}
          onSubmit={handleNoteSubmit}
          onCancel={handleInputCancel}
          onSelectElement={handleStartElementSelection}
          onClearElement={handleClearElement}
        />
      )}

      {/* Element selector - optional, triggered from input dialog */}
      {isSelectingElement && (
        <NotesElementSelector
          onConfirm={handleElementConfirm}
          onCancel={handleElementCancel}
        />
      )}

      {/* User name prompt */}
      {isUserPromptOpen && (
        <UserNamePrompt
          onSubmit={setCurrentUserName}
          onCancel={cancelAddingNote}
        />
      )}

      {/* Note indicators */}
      <NotesIndicators
        notes={currentRouteNotes}
        onNoteClick={handleNoteIndicatorClick}
      />

      {/* Element highlight - always rendered for smooth transitions */}
      <NotesElementHighlight
        xpath={
          isSelectingElement
            ? null
            : isAddingNote
              ? selectedXPath
              : highlightedNoteXPath
        }
      />
    </>
  )
}

"use client"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  StickyNote,
  MessageSquare,
  Edit2,
  Trash2,
  Plus,
  SmilePlus,
  Send,
  X,
  AlertTriangle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useColorScheme } from "./color-context"
import { useNotes } from "./notes-context"
import { useSidebar } from "./sidebar-context"
import { Note, NoteReply, REACTION_EMOJIS, getElementFromXPath } from "@/lib/dcm-mock-data"
import { formatRelativeTime } from "./notes-storage"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Note detail view with full content
function NoteDetailView({ note, onBack, elementMissing }: { note: Note; onBack: () => void; elementMissing: boolean }) {
  const { scheme } = useColorScheme()
  const {
    currentUser,
    updateNote,
    deleteNote,
    addReply,
    updateReply,
    deleteReply,
    toggleReaction,
    setHighlightedNoteId,
    setExpandedNoteId,
  } = useNotes()

  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(note.content)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null)
  const [editReplyContent, setEditReplyContent] = useState("")

  const handleSaveEdit = () => {
    if (editContent.trim()) {
      updateNote(note.id, editContent.trim())
      setIsEditing(false)
    }
  }

  const handleAddReply = () => {
    if (replyContent.trim()) {
      addReply(note.id, replyContent.trim())
      setReplyContent("")
      setShowReplyInput(false)
    }
  }

  const handleSaveReplyEdit = (replyId: string) => {
    if (editReplyContent.trim()) {
      updateReply(note.id, replyId, editReplyContent.trim())
      setEditingReplyId(null)
      setEditReplyContent("")
    }
  }

  const scrollToElement = () => {
    const element = getElementFromXPath(note.xpath)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" })
      setHighlightedNoteId(note.id)
    }
  }

  const handleDelete = () => {
    deleteNote(note.id)
    setExpandedNoteId(null)
    onBack()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b border-neutral-100">
        <button
          onClick={onBack}
          className="flex items-center justify-center size-8 rounded-full hover:bg-neutral-100 transition-colors"
        >
          <ChevronLeft className="size-5 text-neutral-500" strokeWidth={1.5} />
        </button>
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-medium bg-gradient-to-br",
            scheme.from,
            scheme.to
          )}
        >
          {note.author.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-neutral-900">{note.author.name}</p>
          <p className="text-xs font-light text-neutral-400">
            {formatRelativeTime(note.createdAt)}
            {note.updatedAt && " (edited)"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsEditing(true)}
            className="p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <Edit2 className="size-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={handleDelete}
            className="p-2 rounded-full hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="size-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Element reference */}
        {note.xpath ? (
          elementMissing ? (
            <div className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-amber-200 bg-amber-50">
              <AlertTriangle className="size-4 text-amber-500" strokeWidth={1.5} />
              <div className="flex-1">
                <span className="text-xs font-medium text-amber-700">Element no longer exists</span>
                <p className="text-[11px] font-light text-amber-600">The page has changed and the pinned element can no longer be found.</p>
              </div>
            </div>
          ) : (
            <button
              onClick={scrollToElement}
              className={cn(
                "flex items-center gap-2 w-full px-3 py-2 rounded-lg border text-left transition-colors",
                scheme.from.replace("from-", "border-").replace("500", "200"),
                scheme.from.replace("from-", "bg-").replace("500", "50"),
                "hover:opacity-80"
              )}
            >
              <StickyNote className={cn("size-4", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
              <span className="text-xs font-light text-neutral-600">Show pinned element</span>
            </button>
          )
        ) : (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-50 border border-neutral-100">
            <StickyNote className="size-4 text-neutral-400" strokeWidth={1.5} />
            <span className="text-xs font-light text-neutral-400 italic">Page-level note</span>
          </div>
        )}

        {/* Note content */}
        {isEditing ? (
          <div className="space-y-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-light resize-none focus:border-neutral-300 focus:outline-none min-h-[120px]"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditing(false)
                  setEditContent(note.content)
                }}
                className="rounded-full font-light"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSaveEdit}
                className={cn(
                  "rounded-full font-light bg-gradient-to-r text-white",
                  scheme.from,
                  scheme.to
                )}
              >
                Save
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-light text-neutral-700 whitespace-pre-wrap leading-relaxed">
            {note.content}
          </p>
        )}

        {/* Reactions */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {note.reactions.map((reaction) => (
            <Tooltip key={reaction.emoji}>
              <TooltipTrigger asChild>
                <button
                  onClick={() => toggleReaction(note.id, reaction.emoji)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors",
                    reaction.users.includes(currentUser?.name || "")
                      ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                      : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                  )}
                >
                  <span>{reaction.emoji}</span>
                  <span className="text-xs">{reaction.users.length}</span>
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{reaction.users.join(", ")}</p>
              </TooltipContent>
            </Tooltip>
          ))}

          {/* Add reaction button */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex size-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 transition-colors"
            >
              <SmilePlus className="size-4" strokeWidth={1.5} />
            </button>
            {showEmojiPicker && (
              <div className="absolute bottom-10 left-0 z-[10000] flex gap-1 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg">
                {REACTION_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      toggleReaction(note.id, emoji)
                      setShowEmojiPicker(false)
                    }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-lg hover:bg-neutral-100"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Replies section */}
        {note.replies.length > 0 && (
          <div className="pt-4 border-t border-neutral-100">
            <p className="text-xs font-medium text-neutral-500 mb-3">
              {note.replies.length} {note.replies.length === 1 ? "Reply" : "Replies"}
            </p>
            <div className="space-y-3">
              {note.replies.map((reply) => (
                <ReplyItem
                  key={reply.id}
                  reply={reply}
                  noteId={note.id}
                  isEditing={editingReplyId === reply.id}
                  editContent={editReplyContent}
                  onStartEdit={() => {
                    setEditingReplyId(reply.id)
                    setEditReplyContent(reply.content)
                  }}
                  onCancelEdit={() => {
                    setEditingReplyId(null)
                    setEditReplyContent("")
                  }}
                  onEditChange={setEditReplyContent}
                  onSaveEdit={() => handleSaveReplyEdit(reply.id)}
                  onDelete={() => deleteReply(note.id, reply.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reply input */}
      <div className="p-4 border-t border-neutral-100">
        {showReplyInput ? (
          <div className="flex items-start gap-2">
            <input
              type="text"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-light focus:border-neutral-300 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddReply()
                if (e.key === "Escape") {
                  setShowReplyInput(false)
                  setReplyContent("")
                }
              }}
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleAddReply}
              disabled={!replyContent.trim()}
              className={cn(
                "h-10 w-10 p-0 rounded-full bg-gradient-to-r text-white",
                scheme.from,
                scheme.to
              )}
            >
              <Send className="size-4" strokeWidth={1.5} />
            </Button>
          </div>
        ) : (
          <button
            onClick={() => setShowReplyInput(true)}
            className="flex items-center gap-2 w-full px-4 py-2.5 rounded-xl border border-dashed border-neutral-200 text-sm font-light text-neutral-400 hover:border-neutral-300 hover:text-neutral-600 transition-colors"
          >
            <Plus className="size-4" strokeWidth={1.5} />
            Add reply
          </button>
        )}
      </div>
    </div>
  )
}

// Reply item component
interface ReplyItemProps {
  reply: NoteReply
  noteId: string
  isEditing: boolean
  editContent: string
  onStartEdit: () => void
  onCancelEdit: () => void
  onEditChange: (content: string) => void
  onSaveEdit: () => void
  onDelete: () => void
}

function ReplyItem({
  reply,
  isEditing,
  editContent,
  onStartEdit,
  onCancelEdit,
  onEditChange,
  onSaveEdit,
  onDelete,
}: ReplyItemProps) {
  const { scheme } = useColorScheme()

  if (isEditing) {
    return (
      <div className="space-y-2 pl-10">
        <input
          type="text"
          value={editContent}
          onChange={(e) => onEditChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-light focus:border-neutral-300 focus:outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") onSaveEdit()
            if (e.key === "Escape") onCancelEdit()
          }}
          autoFocus
        />
        <div className="flex justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancelEdit}
            className="h-7 text-xs font-light"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onSaveEdit}
            className={cn(
              "h-7 text-xs font-light rounded-full bg-gradient-to-r text-white",
              scheme.from,
              scheme.to
            )}
          >
            Save
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="group flex items-start gap-3">
      <div
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-medium bg-gradient-to-br",
          scheme.from,
          scheme.to
        )}
      >
        {reply.author.avatarInitials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-xs font-medium text-neutral-700">{reply.author.name}</p>
            <p className="text-[11px] font-light text-neutral-400">
              {formatRelativeTime(reply.createdAt)}
              {reply.updatedAt && " (edited)"}
            </p>
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onStartEdit}
              className="p-1 rounded text-neutral-400 hover:text-neutral-600"
            >
              <Edit2 className="size-3" strokeWidth={1.5} />
            </button>
            <button
              onClick={onDelete}
              className="p-1 rounded text-neutral-400 hover:text-red-500"
            >
              <Trash2 className="size-3" strokeWidth={1.5} />
            </button>
          </div>
        </div>
        <p className="text-sm font-light text-neutral-700 mt-1">{reply.content}</p>
      </div>
    </div>
  )
}

// Note list item for the main list view
function NoteListItem({ note, onClick, onHover, elementMissing }: { note: Note; onClick: () => void; onHover: (isHovering: boolean) => void; elementMissing: boolean }) {
  const { scheme } = useColorScheme()

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => note.xpath && !elementMissing && onHover(true)}
      onMouseLeave={() => note.xpath && !elementMissing && onHover(false)}
      className="w-full text-left p-4 rounded-xl border border-neutral-100 bg-white hover:border-neutral-200 hover:shadow-sm transition-all group"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-medium bg-gradient-to-br",
            scheme.from,
            scheme.to
          )}
        >
          {note.author.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-sm font-medium text-neutral-900">{note.author.name}</p>
            <p className="text-xs font-light text-neutral-400">
              {formatRelativeTime(note.createdAt)}
            </p>
          </div>
          <p className="text-sm font-light text-neutral-600 line-clamp-2">
            {note.content}
          </p>
          <div className="flex items-center gap-3 mt-2">
            {note.xpath ? (
              elementMissing ? (
                <span className="flex items-center gap-1 text-xs font-light text-amber-600">
                  <AlertTriangle className="size-3" strokeWidth={1.5} />
                  Element missing
                </span>
              ) : (
                <span className={cn("text-xs font-light", scheme.from.replace("from-", "text-"))}>
                  Pinned to element
                </span>
              )
            ) : (
              <span className="text-xs font-light text-neutral-400 italic">Page note</span>
            )}
            {note.replies.length > 0 && (
              <span className="flex items-center gap-1 text-xs font-light text-neutral-400">
                <MessageSquare className="size-3" strokeWidth={1.5} />
                {note.replies.length}
              </span>
            )}
            {note.reactions.length > 0 && (
              <span className="text-xs">
                {note.reactions.slice(0, 3).map(r => r.emoji).join("")}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}

export function NotesFloatingPanel() {
  const { scheme } = useColorScheme()
  const {
    currentRouteNotes,
    startAddingNote,
    expandedNoteId,
    setExpandedNoteId,
    setHighlightedNoteId,
    isPanelOpen,
    setIsPanelOpen,
  } = useNotes()
  const { isCollapsed } = useSidebar()

  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null)
  const [missingElements, setMissingElements] = useState<Set<string>>(new Set())

  // Sidebar is w-64 (256px) expanded, w-16 (64px) collapsed, plus 24px gap
  const leftPosition = isCollapsed ? "left-[88px]" : "left-[280px]"

  const selectedNote = expandedNoteId
    ? currentRouteNotes.find((n) => n.id === expandedNoteId)
    : null

  // Check which notes have missing elements on mount and when notes change
  useEffect(() => {
    const checkMissingElements = () => {
      const missing = new Set<string>()
      currentRouteNotes.forEach((note) => {
        if (note.xpath) {
          const element = getElementFromXPath(note.xpath)
          if (!element) {
            missing.add(note.id)
          }
        }
      })
      setMissingElements(missing)
    }
    checkMissingElements()
  }, [currentRouteNotes])

  const handleNoteClick = (noteId: string) => {
    setExpandedNoteId(noteId)
    const note = currentRouteNotes.find(n => n.id === noteId)
    if (note?.xpath) {
      setHighlightedNoteId(noteId)
    }
  }

  const handleNoteHover = (noteId: string, isHovering: boolean) => {
    if (isHovering) {
      setHoveredNoteId(noteId)
      setHighlightedNoteId(noteId)
    } else {
      setHoveredNoteId(null)
      if (expandedNoteId !== noteId) {
        setHighlightedNoteId(null)
      }
    }
  }

  const handleBack = () => {
    setExpandedNoteId(null)
    if (!hoveredNoteId) {
      setHighlightedNoteId(null)
    }
  }

  const handleClose = () => {
    setIsPanelOpen(false)
    setExpandedNoteId(null)
    setHighlightedNoteId(null)
  }

  return (
    <>
      {/* Floating button - positioned after sidebar */}
      <div className={cn("fixed bottom-6 z-[9999] transition-all duration-300", leftPosition)}>
        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className={cn(
            "flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-lg border transition-all",
            isPanelOpen
              ? cn("bg-gradient-to-r text-white border-transparent", scheme.from, scheme.to)
              : "bg-white/95 backdrop-blur-xl border-neutral-200 hover:bg-neutral-50"
          )}
        >
          <StickyNote
            className={cn("size-5", isPanelOpen ? "text-white" : scheme.from.replace("from-", "text-"))}
            strokeWidth={1.5}
          />
          <span className={cn("text-sm font-light", isPanelOpen ? "text-white" : "text-neutral-700")}>
            Notes
          </span>
          {currentRouteNotes.length > 0 && (
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full text-[10px] font-medium",
                isPanelOpen
                  ? "bg-white/20 text-white"
                  : cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
              )}
            >
              {currentRouteNotes.length}
            </span>
          )}
        </button>
      </div>

      {/* Panel - high z-index to render above highlighting */}
      {isPanelOpen && (
        <div className={cn("fixed bottom-20 z-[9999] w-[400px] h-[calc(100vh-160px)] max-h-[600px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-neutral-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in-0 transition-all duration-300", leftPosition)}>
          {selectedNote ? (
            <NoteDetailView note={selectedNote} onBack={handleBack} elementMissing={missingElements.has(selectedNote.id)} />
          ) : (
            <>
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <StickyNote
                    className={cn("size-5", scheme.from.replace("from-", "text-"))}
                    strokeWidth={1.5}
                  />
                  <span className="text-sm font-medium text-neutral-900">Notes</span>
                  {currentRouteNotes.length > 0 && (
                    <span className="text-xs font-light text-neutral-400">
                      ({currentRouteNotes.length})
                    </span>
                  )}
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <X className="size-4 text-neutral-500" strokeWidth={1.5} />
                </button>
              </div>

              {/* Notes list */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {currentRouteNotes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center py-8">
                    <StickyNote className="size-12 text-neutral-200 mb-4" strokeWidth={1} />
                    <p className="text-sm font-light text-neutral-500 mb-1">
                      No notes on this page yet
                    </p>
                    <p className="text-xs font-light text-neutral-400">
                      Add a note to start collaborating
                    </p>
                  </div>
                ) : (
                  currentRouteNotes.map((note) => (
                    <NoteListItem
                      key={note.id}
                      note={note}
                      onClick={() => handleNoteClick(note.id)}
                      onHover={(isHovering) => handleNoteHover(note.id, isHovering)}
                      elementMissing={missingElements.has(note.id)}
                    />
                  ))
                )}
              </div>

              {/* Add note button */}
              <div className="p-4 border-t border-neutral-100">
                <button
                  onClick={startAddingNote}
                  className={cn(
                    "flex items-center justify-center gap-2 w-full py-3 rounded-xl font-light text-white transition-all bg-gradient-to-r hover:opacity-90",
                    scheme.from,
                    scheme.to
                  )}
                >
                  <Plus className="size-4" strokeWidth={1.5} />
                  Add note
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  )
}

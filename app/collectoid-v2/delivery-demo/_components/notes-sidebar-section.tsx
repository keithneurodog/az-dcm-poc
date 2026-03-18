"use client"

import { useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  StickyNote,
  MessageSquare,
  Edit2,
  Trash2,
  Plus,
  SmilePlus,
  Send,
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

interface NoteCardProps {
  note: Note
  isExpanded: boolean
  onToggle: () => void
  onHover: (isHovering: boolean) => void
}

function NoteCard({ note, isExpanded, onToggle, onHover }: NoteCardProps) {
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
      setTimeout(() => setHighlightedNoteId(null), 2000)
    }
  }

  return (
    <div
      className="rounded-xl border border-neutral-100 bg-white overflow-hidden"
      onMouseEnter={() => note.xpath && onHover(true)}
      onMouseLeave={() => note.xpath && onHover(false)}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 p-3 text-left hover:bg-neutral-50 transition-colors"
      >
        {isExpanded ? (
          <ChevronDown className="size-4 text-neutral-400 shrink-0" strokeWidth={1.5} />
        ) : (
          <ChevronRight className="size-4 text-neutral-400 shrink-0" strokeWidth={1.5} />
        )}
        <div
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-medium bg-gradient-to-br",
            scheme.from,
            scheme.to
          )}
        >
          {note.author.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="truncate text-sm font-light text-neutral-900">
            {note.content}
          </p>
          <p className="text-xs font-light text-neutral-400">
            {note.author.name} · {formatRelativeTime(note.createdAt)}
            {note.updatedAt && " (edited)"}
          </p>
        </div>
        {note.replies.length > 0 && (
          <span className="flex items-center gap-1 text-xs font-light text-neutral-400">
            <MessageSquare className="size-3" strokeWidth={1.5} />
            {note.replies.length}
          </span>
        )}
      </button>

      {/* Expanded content */}
      {isExpanded && (
        <div className="border-t border-neutral-100 p-3 space-y-3">
          {/* Note content */}
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm font-light resize-none focus:border-neutral-300 focus:outline-none"
                rows={3}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(note.content)
                  }}
                  className="h-7 text-xs font-light"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
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
          ) : (
            <div>
              <p className="text-sm font-light text-neutral-700 whitespace-pre-wrap">
                {note.content}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {note.xpath ? (
                  <button
                    onClick={scrollToElement}
                    className="text-xs font-light text-neutral-400 hover:text-neutral-600 underline"
                  >
                    Show element
                  </button>
                ) : (
                  <span className="text-xs font-light text-neutral-400 italic">
                    Page note
                  </span>
                )}
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-xs font-light text-neutral-400 hover:text-neutral-600"
                >
                  <Edit2 className="size-3" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-xs font-light text-neutral-400 hover:text-red-500"
                >
                  <Trash2 className="size-3" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          )}

          {/* Reactions */}
          <div className="flex flex-wrap items-center gap-1">
            {note.reactions.map((reaction) => (
              <Tooltip key={reaction.emoji}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => toggleReaction(note.id, reaction.emoji)}
                    className={cn(
                      "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs transition-colors",
                      reaction.users.includes(currentUser?.name || "")
                        ? cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
                        : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                    )}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{reaction.users.length}</span>
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
                className="flex size-6 items-center justify-center rounded-full bg-neutral-100 text-neutral-400 hover:bg-neutral-200 hover:text-neutral-600 transition-colors"
              >
                <SmilePlus className="size-3" strokeWidth={1.5} />
              </button>
              {showEmojiPicker && (
                <div className="absolute bottom-8 left-0 z-10 grid w-[200px] grid-cols-6 gap-1 rounded-lg border border-neutral-200 bg-white p-2 shadow-lg">
                  {REACTION_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        toggleReaction(note.id, emoji)
                        setShowEmojiPicker(false)
                      }}
                      className="flex h-7 w-7 items-center justify-center rounded text-base hover:bg-neutral-100"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Replies */}
          {note.replies.length > 0 && (
            <div className="space-y-2 pl-3 border-l-2 border-neutral-100">
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
          )}

          {/* Add reply */}
          {showReplyInput ? (
            <div className="flex items-start gap-2">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-light focus:border-neutral-300 focus:outline-none"
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
                  "h-8 w-8 p-0 rounded-full bg-gradient-to-r text-white",
                  scheme.from,
                  scheme.to
                )}
              >
                <Send className="size-3" strokeWidth={1.5} />
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setShowReplyInput(true)}
              className="flex items-center gap-1 text-xs font-light text-neutral-400 hover:text-neutral-600"
            >
              <Plus className="size-3" strokeWidth={1.5} />
              Add reply
            </button>
          )}
        </div>
      )}
    </div>
  )
}

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
      <div className="space-y-2">
        <input
          type="text"
          value={editContent}
          onChange={(e) => onEditChange(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 px-3 py-1.5 text-sm font-light focus:border-neutral-300 focus:outline-none"
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
            className="h-6 text-xs font-light"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={onSaveEdit}
            className={cn(
              "h-6 text-xs font-light rounded-full bg-gradient-to-r text-white",
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
    <div className="group">
      <div className="flex items-start gap-2">
        <div
          className={cn(
            "flex size-5 shrink-0 items-center justify-center rounded-full text-white text-[8px] font-medium bg-gradient-to-br",
            scheme.from,
            scheme.to
          )}
        >
          {reply.author.avatarInitials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-light text-neutral-700">{reply.content}</p>
          <p className="text-[10px] font-light text-neutral-400">
            {reply.author.name} · {formatRelativeTime(reply.createdAt)}
            {reply.updatedAt && " (edited)"}
          </p>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onStartEdit}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <Edit2 className="size-3" strokeWidth={1.5} />
          </button>
          <button
            onClick={onDelete}
            className="text-neutral-400 hover:text-red-500"
          >
            <Trash2 className="size-3" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  )
}

export function NotesSidebarSection() {
  const { scheme } = useColorScheme()
  const { currentRouteNotes, startAddingNote, setHighlightedNoteId, expandedNoteId, setExpandedNoteId } = useNotes()
  const { isCollapsed } = useSidebar()
  const [isSectionExpanded, setIsSectionExpanded] = useState(true)
  const [hoveredNoteId, setHoveredNoteId] = useState<string | null>(null)

  // Update highlighted note when hover or expanded state changes
  const handleNoteHover = (noteId: string, isHovering: boolean) => {
    if (isHovering) {
      setHoveredNoteId(noteId)
      setHighlightedNoteId(noteId)
    } else {
      setHoveredNoteId(null)
      // Only clear highlight if this note is not expanded
      if (expandedNoteId !== noteId) {
        setHighlightedNoteId(null)
      }
    }
  }

  const handleNoteToggle = (noteId: string) => {
    const newExpandedId = expandedNoteId === noteId ? null : noteId
    setExpandedNoteId(newExpandedId)

    // Update highlight based on new expanded state
    if (newExpandedId) {
      const note = currentRouteNotes.find(n => n.id === newExpandedId)
      if (note?.xpath) {
        setHighlightedNoteId(newExpandedId)
      }
    } else if (!hoveredNoteId) {
      setHighlightedNoteId(null)
    }
  }

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={startAddingNote}
            className="flex w-full items-center justify-center py-3"
          >
            <StickyNote
              className={cn("size-5", scheme.from.replace("from-", "text-"))}
              strokeWidth={1.5}
            />
            {currentRouteNotes.length > 0 && (
              <span
                className={cn(
                  "absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] text-white bg-gradient-to-r",
                  scheme.from,
                  scheme.to
                )}
              >
                {currentRouteNotes.length}
              </span>
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="font-light">
          Notes ({currentRouteNotes.length})
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <div className="px-3 pb-3">
      {/* Section header */}
      <button
        onClick={() => setIsSectionExpanded(!isSectionExpanded)}
        className="flex w-full items-center gap-2 py-2 text-left"
      >
        {isSectionExpanded ? (
          <ChevronDown className="size-4 text-neutral-400" strokeWidth={1.5} />
        ) : (
          <ChevronRight className="size-4 text-neutral-400" strokeWidth={1.5} />
        )}
        <StickyNote
          className={cn("size-4", scheme.from.replace("from-", "text-"))}
          strokeWidth={1.5}
        />
        <span className="flex-1 text-sm font-light text-neutral-600">Notes</span>
        {currentRouteNotes.length > 0 && (
          <span
            className={cn(
              "flex size-5 items-center justify-center rounded-full text-[10px] text-white bg-gradient-to-r",
              scheme.from,
              scheme.to
            )}
          >
            {currentRouteNotes.length}
          </span>
        )}
      </button>

      {/* Notes list */}
      {isSectionExpanded && (
        <div className="mt-2 space-y-2">
          {currentRouteNotes.length === 0 ? (
            <p className="text-xs font-light text-neutral-400 text-center py-4">
              No notes on this page yet.
              <br />
              Click the button below to add one.
            </p>
          ) : (
            currentRouteNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isExpanded={expandedNoteId === note.id}
                onToggle={() => handleNoteToggle(note.id)}
                onHover={(isHovering) => handleNoteHover(note.id, isHovering)}
              />
            ))
          )}

          {/* Add note button */}
          <button
            onClick={startAddingNote}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-200 py-2 text-xs font-light text-neutral-400 transition-colors hover:border-neutral-300 hover:text-neutral-600"
            )}
          >
            <Plus className="size-3" strokeWidth={1.5} />
            Add note
          </button>
        </div>
      )}
    </div>
  )
}

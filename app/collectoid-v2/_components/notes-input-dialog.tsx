"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { X, Send, Smile, MousePointer2, MapPin } from "lucide-react"
import { cn } from "@/lib/utils"
import { useColorScheme } from "./color-context"
import { Button } from "@/components/ui/button"
import { REACTION_EMOJIS, getElementFromXPath } from "@/lib/dcm-mock-data"

interface NotesInputDialogProps {
  initialContent?: string
  title: string
  placeholder?: string
  selectedXPath?: string | null
  onSubmit: (content: string) => void
  onCancel: () => void
  onSelectElement?: () => void
  onClearElement?: () => void
}

export function NotesInputDialog({
  initialContent = "",
  title,
  placeholder = "Write your note...",
  selectedXPath,
  onSubmit,
  onCancel,
  onSelectElement,
  onClearElement,
}: NotesInputDialogProps) {
  const { scheme } = useColorScheme()
  const [content, setContent] = useState(initialContent)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [mounted, setMounted] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const emojiPickerRef = useRef<HTMLDivElement>(null)

  // Get element description for display
  const elementDescription = selectedXPath ? (() => {
    const el = getElementFromXPath(selectedXPath)
    if (!el) return "Selected element"
    const tag = el.tagName.toLowerCase()
    const text = el.textContent?.trim().slice(0, 30) || ""
    return text ? `<${tag}> "${text}${text.length >= 30 ? "..." : ""}"` : `<${tag}>`
  })() : null

  useEffect(() => {
    setMounted(true)
    // Focus textarea on mount
    setTimeout(() => textareaRef.current?.focus(), 100)
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false)
      }
    }

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showEmojiPicker])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCancel()
      } else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        if (content.trim()) {
          onSubmit(content.trim())
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [content, onSubmit, onCancel])

  const insertEmoji = (emoji: string) => {
    const textarea = textareaRef.current
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const newContent = content.slice(0, start) + emoji + content.slice(end)
      setContent(newContent)
      // Set cursor position after emoji
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + emoji.length
        textarea.focus()
      }, 0)
    } else {
      setContent(content + emoji)
    }
    setShowEmojiPicker(false)
  }

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim())
    }
  }

  if (!mounted) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/20"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-light text-neutral-900">{title}</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onCancel}
            className="h-8 w-8 p-0 text-neutral-500 hover:text-neutral-700"
          >
            <X className="size-4" strokeWidth={1.5} />
          </Button>
        </div>

        {/* Element selection section */}
        {onSelectElement && (
          <div className="mb-4">
            {selectedXPath && elementDescription ? (
              <div className={cn(
                "flex items-center gap-2 rounded-xl border px-3 py-2",
                scheme.from.replace("from-", "border-").replace("500", "200"),
                scheme.from.replace("from-", "bg-").replace("500", "50")
              )}>
                <MapPin className={cn("size-4 shrink-0", scheme.from.replace("from-", "text-"))} strokeWidth={1.5} />
                <span className="flex-1 truncate text-sm font-light text-neutral-700">
                  {elementDescription}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onSelectElement}
                    className="h-7 px-2 text-xs font-light"
                  >
                    Change
                  </Button>
                  {onClearElement && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClearElement}
                      className="h-7 w-7 p-0 text-neutral-400 hover:text-neutral-600"
                    >
                      <X className="size-3" strokeWidth={1.5} />
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <button
                onClick={onSelectElement}
                className="flex w-full items-center gap-2 rounded-xl border border-dashed border-neutral-300 px-3 py-2.5 text-sm font-light text-neutral-500 transition-colors hover:border-neutral-400 hover:text-neutral-600"
              >
                <MousePointer2 className="size-4" strokeWidth={1.5} />
                <span>Pin to a specific element (optional)</span>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={placeholder}
            className="min-h-[120px] w-full resize-none rounded-xl border border-neutral-200 px-4 py-3 text-sm font-light text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-0"
          />

          {/* Emoji picker toggle */}
          <div className="absolute bottom-3 left-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="h-8 w-8 p-0 text-neutral-400 hover:text-neutral-600"
            >
              <Smile className="size-4" strokeWidth={1.5} />
            </Button>

            {/* Emoji picker dropdown */}
            {showEmojiPicker && (
              <div
                ref={emojiPickerRef}
                className="absolute bottom-10 left-0 grid w-[220px] grid-cols-6 gap-1 rounded-xl border border-neutral-200 bg-white p-2 shadow-lg"
              >
                {REACTION_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => insertEmoji(emoji)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-neutral-100"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-xs font-light text-neutral-400">
            Press ⌘+Enter to submit
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="rounded-full font-light"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleSubmit}
              disabled={!content.trim()}
              className={cn(
                "rounded-full font-light bg-gradient-to-r text-white",
                scheme.from,
                scheme.to
              )}
            >
              <Send className="mr-2 size-4" strokeWidth={1.5} />
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}

// User name prompt dialog
interface UserNamePromptProps {
  onSubmit: (name: string) => void
  onCancel: () => void
}

export function UserNamePrompt({ onSubmit, onCancel }: UserNamePromptProps) {
  const { scheme } = useColorScheme()
  const [name, setName] = useState("")
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setMounted(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }, [])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onCancel()
      } else if (e.key === "Enter" && name.trim()) {
        onSubmit(name.trim())
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [name, onSubmit, onCancel])

  if (!mounted) return null

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[9998] bg-black/20"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-1/2 z-[9999] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xl animate-in fade-in-0 zoom-in-95">
        <h3 className="mb-2 text-lg font-light text-neutral-900">
          What&apos;s your name?
        </h3>
        <p className="mb-4 text-sm font-light text-neutral-500">
          This will be shown on your notes and replies.
        </p>

        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., John Smith"
          className="mb-4 w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm font-light text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-300 focus:outline-none focus:ring-0"
        />

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            className="rounded-full font-light"
          >
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={() => name.trim() && onSubmit(name.trim())}
            disabled={!name.trim()}
            className={cn(
              "rounded-full font-light bg-gradient-to-r text-white",
              scheme.from,
              scheme.to
            )}
          >
            Continue
          </Button>
        </div>
      </div>
    </>,
    document.body
  )
}

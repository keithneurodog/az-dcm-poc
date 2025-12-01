"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react"
import { usePathname } from "next/navigation"
import { Note, NoteReply, NoteAuthor } from "@/lib/dcm-mock-data"
import {
  notesStorage,
  getUserName,
  setUserName,
  getAvatarInitials,
} from "./notes-storage"

interface NotesContextType {
  notes: Note[]
  currentRouteNotes: Note[]
  currentUser: NoteAuthor | null
  isUserPromptOpen: boolean
  isAddingNote: boolean
  highlightedNoteId: string | null
  expandedNoteId: string | null

  // User management
  promptForUserName: () => void
  setCurrentUserName: (name: string) => void

  // Note CRUD
  addNote: (xpath: string | null, content: string) => void
  updateNote: (id: string, content: string) => void
  deleteNote: (id: string) => void

  // Replies
  addReply: (noteId: string, content: string) => void
  updateReply: (noteId: string, replyId: string, content: string) => void
  deleteReply: (noteId: string, replyId: string) => void

  // Reactions
  toggleReaction: (noteId: string, emoji: string) => void

  // Element selection
  startAddingNote: () => void
  cancelAddingNote: () => void

  // Highlight and expand
  setHighlightedNoteId: (id: string | null) => void
  setExpandedNoteId: (id: string | null) => void

  // Refresh notes from storage
  refreshNotes: () => void
}

const NotesContext = createContext<NotesContextType | undefined>(undefined)

export function NotesProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const [notes, setNotes] = useState<Note[]>([])
  const [currentUser, setCurrentUser] = useState<NoteAuthor | null>(null)
  const [isUserPromptOpen, setIsUserPromptOpen] = useState(false)
  const [isAddingNote, setIsAddingNote] = useState(false)
  const [highlightedNoteId, setHighlightedNoteId] = useState<string | null>(null)
  const [expandedNoteId, setExpandedNoteId] = useState<string | null>(null)

  // Load notes and user on mount
  useEffect(() => {
    const allNotes = notesStorage.getAllNotes()
    setNotes(allNotes)

    const storedName = getUserName()
    if (storedName) {
      setCurrentUser({
        name: storedName,
        avatarInitials: getAvatarInitials(storedName),
      })
    }
  }, [])

  const currentRouteNotes = notes.filter((n) => n.route === pathname)

  const refreshNotes = useCallback(() => {
    const allNotes = notesStorage.getAllNotes()
    setNotes(allNotes)
  }, [])

  const promptForUserName = useCallback(() => {
    setIsUserPromptOpen(true)
  }, [])

  const setCurrentUserName = useCallback((name: string) => {
    setUserName(name)
    setCurrentUser({
      name,
      avatarInitials: getAvatarInitials(name),
    })
    setIsUserPromptOpen(false)
  }, [])

  const ensureUser = useCallback((): NoteAuthor | null => {
    if (!currentUser) {
      promptForUserName()
      return null
    }
    return currentUser
  }, [currentUser, promptForUserName])

  const addNote = useCallback(
    (xpath: string | null, content: string) => {
      const author = ensureUser()
      if (!author) return

      const newNote: Note = {
        id: `note-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        xpath: xpath || "", // Empty string for page-level notes
        route: pathname,
        content,
        author,
        createdAt: new Date().toISOString(),
        reactions: [],
        replies: [],
      }

      notesStorage.addNote(newNote)
      refreshNotes()
      setIsAddingNote(false)
    },
    [pathname, ensureUser, refreshNotes]
  )

  const updateNote = useCallback(
    (id: string, content: string) => {
      notesStorage.updateNote(id, { content })
      refreshNotes()
    },
    [refreshNotes]
  )

  const deleteNote = useCallback(
    (id: string) => {
      notesStorage.deleteNote(id)
      refreshNotes()
    },
    [refreshNotes]
  )

  const addReply = useCallback(
    (noteId: string, content: string) => {
      const author = ensureUser()
      if (!author) return

      const reply: NoteReply = {
        id: `reply-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        noteId,
        content,
        author,
        createdAt: new Date().toISOString(),
      }

      notesStorage.addReply(noteId, reply)
      refreshNotes()
    },
    [ensureUser, refreshNotes]
  )

  const updateReply = useCallback(
    (noteId: string, replyId: string, content: string) => {
      notesStorage.updateReply(noteId, replyId, content)
      refreshNotes()
    },
    [refreshNotes]
  )

  const deleteReply = useCallback(
    (noteId: string, replyId: string) => {
      notesStorage.deleteReply(noteId, replyId)
      refreshNotes()
    },
    [refreshNotes]
  )

  const toggleReaction = useCallback(
    (noteId: string, emoji: string) => {
      const author = ensureUser()
      if (!author) return

      const note = notes.find((n) => n.id === noteId)
      if (!note) return

      const reaction = note.reactions.find((r) => r.emoji === emoji)
      if (reaction?.users.includes(author.name)) {
        notesStorage.removeReaction(noteId, emoji, author.name)
      } else {
        notesStorage.addReaction(noteId, emoji, author.name)
      }
      refreshNotes()
    },
    [notes, ensureUser, refreshNotes]
  )

  const startAddingNote = useCallback(() => {
    const author = ensureUser()
    if (!author) return
    setIsAddingNote(true)
  }, [ensureUser])

  const cancelAddingNote = useCallback(() => {
    setIsAddingNote(false)
  }, [])

  return (
    <NotesContext.Provider
      value={{
        notes,
        currentRouteNotes,
        currentUser,
        isUserPromptOpen,
        isAddingNote,
        highlightedNoteId,
        expandedNoteId,

        promptForUserName,
        setCurrentUserName,

        addNote,
        updateNote,
        deleteNote,

        addReply,
        updateReply,
        deleteReply,

        toggleReaction,

        startAddingNote,
        cancelAddingNote,

        setHighlightedNoteId,
        setExpandedNoteId,
        refreshNotes,
      }}
    >
      {children}
    </NotesContext.Provider>
  )
}

export function useNotes() {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error("useNotes must be used within NotesProvider")
  }
  return context
}

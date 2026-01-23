import { Note, NoteReply, MOCK_NOTES } from "@/lib/dcm-mock-data"

const STORAGE_KEY = "collectoid-notes"

// Storage abstraction layer - can be replaced with API calls for Phase 2
export interface NotesStorage {
  getNotes(route: string): Note[]
  getAllNotes(): Note[]
  addNote(note: Note): void
  updateNote(id: string, updates: Partial<Note>): void
  deleteNote(id: string): void
  addReply(noteId: string, reply: NoteReply): void
  updateReply(noteId: string, replyId: string, content: string): void
  deleteReply(noteId: string, replyId: string): void
  addReaction(noteId: string, emoji: string, username: string): void
  removeReaction(noteId: string, emoji: string, username: string): void
}

function loadNotesFromStorage(): Note[] {
  if (typeof window === "undefined") return MOCK_NOTES

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    // Initialize with mock data on first load
    localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_NOTES))
    return MOCK_NOTES
  } catch {
    return MOCK_NOTES
  }
}

function saveNotesToStorage(notes: Note[]): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes))
  } catch (error) {
    console.error("Failed to save notes to localStorage:", error)
  }
}

export const notesStorage: NotesStorage = {
  getNotes(route: string): Note[] {
    const notes = loadNotesFromStorage()
    return notes.filter((n) => n.route === route)
  },

  getAllNotes(): Note[] {
    return loadNotesFromStorage()
  },

  addNote(note: Note): void {
    const notes = loadNotesFromStorage()
    notes.push(note)
    saveNotesToStorage(notes)
  },

  updateNote(id: string, updates: Partial<Note>): void {
    const notes = loadNotesFromStorage()
    const index = notes.findIndex((n) => n.id === id)
    if (index !== -1) {
      notes[index] = { ...notes[index], ...updates, updatedAt: new Date().toISOString() }
      saveNotesToStorage(notes)
    }
  },

  deleteNote(id: string): void {
    const notes = loadNotesFromStorage()
    const filtered = notes.filter((n) => n.id !== id)
    saveNotesToStorage(filtered)
  },

  addReply(noteId: string, reply: NoteReply): void {
    const notes = loadNotesFromStorage()
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      note.replies.push(reply)
      saveNotesToStorage(notes)
    }
  },

  updateReply(noteId: string, replyId: string, content: string): void {
    const notes = loadNotesFromStorage()
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      const reply = note.replies.find((r) => r.id === replyId)
      if (reply) {
        reply.content = content
        reply.updatedAt = new Date().toISOString()
        saveNotesToStorage(notes)
      }
    }
  },

  deleteReply(noteId: string, replyId: string): void {
    const notes = loadNotesFromStorage()
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      note.replies = note.replies.filter((r) => r.id !== replyId)
      saveNotesToStorage(notes)
    }
  },

  addReaction(noteId: string, emoji: string, username: string): void {
    const notes = loadNotesFromStorage()
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      const existingReaction = note.reactions.find((r) => r.emoji === emoji)
      if (existingReaction) {
        if (!existingReaction.users.includes(username)) {
          existingReaction.users.push(username)
        }
      } else {
        note.reactions.push({ emoji, users: [username] })
      }
      saveNotesToStorage(notes)
    }
  },

  removeReaction(noteId: string, emoji: string, username: string): void {
    const notes = loadNotesFromStorage()
    const note = notes.find((n) => n.id === noteId)
    if (note) {
      const reaction = note.reactions.find((r) => r.emoji === emoji)
      if (reaction) {
        reaction.users = reaction.users.filter((u) => u !== username)
        if (reaction.users.length === 0) {
          note.reactions = note.reactions.filter((r) => r.emoji !== emoji)
        }
        saveNotesToStorage(notes)
      }
    }
  },
}

// User identity helpers
const USER_NAME_KEY = "collectoid-user-name"

export function getUserName(): string | null {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem(USER_NAME_KEY)
}

export function setUserName(name: string): void {
  if (typeof window === "undefined") return
  sessionStorage.setItem(USER_NAME_KEY, name)
}

export function getAvatarInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

// Relative time formatting
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 1) return "just now"
  if (diffMins < 60) return `${diffMins} min${diffMins === 1 ? "" : "s"} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`

  return date.toLocaleDateString()
}

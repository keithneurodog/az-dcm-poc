# Add Notes Functionality - Implementation Plan

## Overview
Add a collaborative annotation system to the Collectoid POC that allows users to right-click any DOM element, navigate up/down the DOM tree to refine selection, and add notes that persist across sessions and are visible to other users.

## User Requirements Summary
- **Scope**: Collectoid routes only (`/collectoid/*`)
- **User Identity**: Name stored in sessionStorage, prompted on first use
- **Element Targeting**: Any DOM element, with ability to traverse up DOM tree
- **Element Identification**: XPath for persistence
- **Note Indicators**: Floating sticky-note icons near annotated elements
- **Notes Panel**: Collapsible section in sidebar
- **Storage**: localStorage (mocking DB), structured for easy DB migration
- **Features**: Plain text with emoji support, threaded replies, emoji reactions
- **Permissions**: Anyone can edit/delete, show "edited X ago" timestamps

---

## Architecture

### Data Models (add to `/lib/dcm-mock-data.ts`)

```typescript
interface NoteAuthor {
  name: string
  avatarInitials: string
}

interface EmojiReaction {
  emoji: string
  users: string[] // usernames who reacted
}

interface NoteReply {
  id: string
  noteId: string
  content: string
  author: NoteAuthor
  createdAt: string // ISO timestamp
  updatedAt?: string
}

interface Note {
  id: string
  xpath: string // Element identifier
  route: string // Page route where note was created
  content: string
  author: NoteAuthor
  createdAt: string
  updatedAt?: string
  reactions: EmojiReaction[]
  replies: NoteReply[]
}
```

### Storage Layer (`/app/collectoid/_components/notes-storage.ts`)

Abstract storage operations to enable easy DB migration:

```typescript
interface NotesStorage {
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

// Phase 1: localStorage implementation
// Phase 2: Replace with API calls
```

---

## Files to Create

### 1. `/app/collectoid/_components/notes-storage.ts`
Storage abstraction layer with localStorage implementation.

### 2. `/app/collectoid/_components/notes-context.tsx`
Context provider following `notification-context.tsx` pattern:
- Manages notes state
- Exposes CRUD operations
- Handles user identity (name prompt + sessionStorage)
- Provides notes filtered by current route

### 3. `/app/collectoid/_components/notes-context-menu.tsx`
Right-click context menu component:
- Captures right-click with `onContextMenu`
- Shows "Add Note" option
- DOM element highlighting on hover
- Up/down arrow navigation for DOM tree traversal
- Visual breadcrumb showing current element path

### 4. `/app/collectoid/_components/notes-element-selector.tsx`
Element selection UI:
- Highlights selected element with colored overlay
- Shows element tag/class info
- Arrow buttons or keyboard nav to go up/down DOM tree
- Confirm/Cancel buttons

### 5. `/app/collectoid/_components/notes-input-dialog.tsx`
Note creation/editing dialog:
- Text input with emoji picker
- Shows selected element info
- Submit/Cancel buttons

### 6. `/app/collectoid/_components/notes-indicator.tsx`
Floating icon component:
- Small sticky-note icon positioned near annotated elements
- Shows note count if multiple notes on element
- Click to expand notes for that element
- Uses portal to ensure visibility

### 7. `/app/collectoid/_components/notes-sidebar-section.tsx`
Collapsible sidebar section:
- List of all notes on current page
- Grouped by element (with element preview)
- Threaded replies UI
- Emoji reactions display + add
- Edit/Delete actions
- "edited X ago" timestamps

### 8. `/app/collectoid/_components/notes-wrapper.tsx`
Wrapper component for main content:
- Intercepts right-click events
- Renders note indicators for current page
- Manages context menu visibility

---

## Files to Modify

### 1. `/lib/dcm-mock-data.ts`
- Add `Note`, `NoteReply`, `NoteAuthor`, `EmojiReaction` interfaces
- Add `MOCK_NOTES` initial data (a few example notes)
- Export helper functions for XPath generation

### 2. `/app/collectoid/_components/index.ts`
- Export new notes components and context

### 3. `/app/collectoid/layout.tsx`
- Add `NotesProvider` to provider stack
- Wrap main content with `NotesWrapper`

### 4. `/app/collectoid/_components/sidebar.tsx`
- Add collapsible "Notes" section below navigation
- Import and render `NotesSidebarSection`

---

## Implementation Steps

### Step 1: Data Layer
1. Add interfaces to `dcm-mock-data.ts`
2. Create `notes-storage.ts` with localStorage implementation
3. Create `notes-context.tsx` with state management + user identity

### Step 2: Core UI Components
4. Create `notes-context-menu.tsx` - right-click menu
5. Create `notes-element-selector.tsx` - DOM tree navigation
6. Create `notes-input-dialog.tsx` - note input form

### Step 3: Display Components
7. Create `notes-indicator.tsx` - floating icons
8. Create `notes-sidebar-section.tsx` - sidebar notes list

### Step 4: Integration
9. Create `notes-wrapper.tsx` - orchestrates context menu + indicators
10. Update `layout.tsx` - add provider and wrapper
11. Update `sidebar.tsx` - add notes section
12. Update `index.ts` - export new components

### Step 5: Polish
13. Add simple emoji picker component (grid of ~20-30 common emojis: thumbs up, heart, smile, etc.)
14. Add threaded reply UI
15. Add relative time formatting ("edited 5 mins ago")
16. Test across different Collectoid pages

---

## Emoji Picker Implementation
Simple grid of common emojis for reactions:
```typescript
const REACTION_EMOJIS = [
  '👍', '👎', '❤️', '😊', '😂', '🎉',
  '🔥', '👀', '💯', '✅', '❌', '⚠️',
  '💡', '🤔', '👏', '🙌', '💪', '🚀',
  '📝', '🔍', '💬', '⭐', '🎯', '✨'
]
```
Rendered as a simple popover grid, clicking adds/toggles the reaction.

---

## Technical Considerations

### XPath Generation
Generate unique XPaths for element identification:
```typescript
function getXPath(element: Element): string {
  if (element.id) return `//*[@id="${element.id}"]`

  const parts: string[] = []
  let current: Element | null = element

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let index = 1
    let sibling = current.previousElementSibling
    while (sibling) {
      if (sibling.nodeName === current.nodeName) index++
      sibling = sibling.previousElementSibling
    }
    parts.unshift(`${current.nodeName.toLowerCase()}[${index}]`)
    current = current.parentElement
  }

  return '/' + parts.join('/')
}
```

### Note Indicator Positioning
Use `getBoundingClientRect()` + scroll position to position floating icons. Re-calculate on scroll/resize using `ResizeObserver` and scroll listeners.

### DOM Tree Navigation
For parent traversal, filter out non-meaningful elements:
```typescript
const SKIP_TAGS = ['html', 'body', 'main', 'head']
const getMeaningfulParent = (el: Element) => {
  let parent = el.parentElement
  while (parent && SKIP_TAGS.includes(parent.tagName.toLowerCase())) {
    parent = parent.parentElement
  }
  return parent
}
```

---

## Phase 2 Migration Notes (Database)
When moving to a real database:
1. Replace `notes-storage.ts` localStorage functions with API calls
2. Add authentication for user identity instead of sessionStorage
3. Add WebSocket/polling for real-time updates from other users
4. Add optimistic updates for better UX

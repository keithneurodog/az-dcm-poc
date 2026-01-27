export { ColorSchemeProvider, useColorScheme, colorSchemes } from "./color-context"
export type { ColorScheme } from "./color-context"

export { NotificationProvider, useNotifications } from "./notification-context"

export { SidebarProvider, useSidebar } from "./sidebar-context"

export { VariationProvider, useVariation } from "./variation-context"
export { useRouteVariations, hasVariationsRegistered, getRegisteredRoutes } from "./use-route-variations"
export type { VariationConfig, RouteVariations } from "./variation-types"

export { NotesProvider, useNotes } from "./notes-context"
export { NotesWrapper } from "./notes-wrapper"
export { NotesSidebarSection } from "./notes-sidebar-section"
export { NotesElementSelector } from "./notes-element-selector"
export { NotesInputDialog, UserNamePrompt } from "./notes-input-dialog"
export { NotesIndicators } from "./notes-indicator"
export { NotesElementHighlight } from "./notes-element-highlight"
export { NotesFloatingPanel } from "./notes-floating-panel"

export { Sidebar } from "./sidebar"
export { TopBar } from "./top-bar"
export { NotificationPanel } from "./notification-panel"
export { DevWidget } from "./dev-widget"

# Page Variations System - Specification

## Overview

A clean, extensible system for managing page variations in the Collectoid POC. Each variation is completely isolated in its own file, with session-persisted selection and a conditional widget that only appears when variations exist.

---

## Design System Compliance

All variations must follow the design system defined in `/app/ux/13/design-system/page.tsx`:

### Typography
- Headings: Use `font-extralight` for h1/h2, `font-light` for h3/h4, `font-normal` for h5/h6
- Body text: `font-light` for comfortable reading
- Labels: `text-xs font-light uppercase tracking-wider` for small caps

### Colors & Theming
- Use the dynamic color scheme from `useColorScheme()` hook
- Primary actions: `bg-gradient-to-r ${scheme.from} ${scheme.to} text-white`
- Backgrounds: `${scheme.bg} ${scheme.bgHover}` for subtle gradient backgrounds
- Icons: `${scheme.from.replace("from-", "text-")}` to match the current theme

### Components
- Buttons: `rounded-xl` or `rounded-full` with `font-light`
- Cards: `rounded-2xl border-neutral-200` with `CardContent className="p-4"` or `p-6`
- Inputs: `rounded-xl border-2 border-neutral-200` with focus states using theme colors
- Badges: `rounded-full font-light` with appropriate color variants

### Spacing & Layout
- Use consistent spacing: `gap-4`, `gap-6` for flex/grid layouts
- Cards use `space-y-6` for vertical stacking
- Panels use `p-5` or `p-6` for internal padding

### Animations
- Transitions: `transition-all` with appropriate durations
- Hover effects: `hover:shadow-lg`, `hover:-translate-y-1`
- Active states: Use gradient backgrounds with shadows

---

## File Structure

Each page with variations gets a `_variations/` folder alongside its `page.tsx`:

```
app/collectoid/
  _components/
    index.ts                      # Updated barrel exports
    variation-context.tsx         # NEW: Variation state management
    use-route-variations.ts       # NEW: Auto-discovery hook
    dev-widget.tsx                # Modified to include variation selector
  dcm/
    create/
      page.tsx                    # Modified to consume variations
      _variations/                # NEW: Variations folder
        index.ts                  # Registry for this route
        variation-1.tsx           # Default variation
        variation-2.tsx           # Alternative variation
```

**Naming conventions:**
- Variation folder: `_variations/` (underscore prevents Next.js routing)
- Variation files: `variation-{id}.tsx` where `{id}` can be numeric (`1`, `2`) or descriptive (`dcm-only`)
- Registry: `index.ts` exports variation configs for that route

---

## Core Components

### 1. Type Definitions

**File:** `/app/collectoid/_components/variation-types.ts`

```typescript
import { ComponentType } from "react"

export interface VariationConfig {
  id: string
  name: string
  description?: string
  component: ComponentType
}

export interface RouteVariations {
  variations: VariationConfig[]
  defaultVariation: string
}
```

### 2. Variation Context

**File:** `/app/collectoid/_components/variation-context.tsx`

- Provider wrapping the app to manage variation state
- `useVariation()` hook returning `getVariation(route)` and `setVariation(route, id)`
- SessionStorage persistence with `collectoid_variation_` prefix
- Hydration handling for SSR compatibility

### 3. Route Variations Hook

**File:** `/app/collectoid/_components/use-route-variations.ts`

A hook that loads variations for the current route using a lightweight registry:

```typescript
"use client"
import { useState, useEffect, useMemo } from "react"
import { usePathname } from "next/navigation"

// Registry of routes with variations - add new routes here
const variationLoaders: Record<string, () => Promise<RouteVariations>> = {
  "/collectoid/dcm/create": async () => {
    const mod = await import("@/app/collectoid/dcm/create/_variations")
    return { variations: mod.variations, defaultVariation: mod.defaultVariation }
  },
  // Add more routes as needed
}

export function useRouteVariations() {
  const pathname = usePathname()
  // ... loads variations dynamically with caching
  return { variations, loading, hasVariations, pathname }
}
```

**To add a new page with variations:** Add an entry to `variationLoaders` in this file.

### 4. Per-Route Variation Registry

**File:** `/app/collectoid/dcm/create/_variations/index.ts`

```typescript
import Variation1 from "./variation-1"
import Variation2 from "./variation-2"

export const variations: VariationConfig[] = [
  { id: "1", name: "Default Layout", component: Variation1 },
  { id: "2", name: "Simplified", description: "Reduced steps", component: Variation2 },
]

export const defaultVariation = "1"
```

### 5. Modified DevWidget

**File:** `/app/collectoid/_components/dev-widget.tsx`

- Adds a "Variations" button next to existing "Colors" button
- Button only renders when `useRouteVariations()` returns variations
- Opens a panel styled to match the design system (backdrop blur, gradient accents, checkmarks)
- **When viewing default variation**: Button shows "Variations" label with white background
- **When viewing a non-default variation**:
  - Button shows the current variant's name (e.g., "Flexible Filtering") with gradient background
  - A "Revert to default" action button appears below, allowing quick return to default
- Active selections use the current color scheme gradient
- Panels use `bg-white/95 backdrop-blur-xl` for a frosted glass effect

---

## Page Integration Pattern

**File:** `/app/collectoid/dcm/create/page.tsx`

```typescript
"use client"

import { usePathname } from "next/navigation"
import { useVariation } from "@/app/collectoid/_components"
import { variations, defaultVariation } from "./_variations"

export default function DCMCreatePage() {
  const pathname = usePathname()
  const { getVariation } = useVariation()

  const stored = getVariation(pathname)
  const currentId = stored && variations.some(v => v.id === stored)
    ? stored
    : defaultVariation

  const current = variations.find(v => v.id === currentId)!
  const Component = current.component

  return <Component />
}
```

---

## Layout Integration

**File:** `/app/collectoid/layout.tsx`

Add `VariationProvider` to the provider stack:

```typescript
<ColorSchemeProvider>
  <NotificationProvider>
    <VariationProvider>  {/* NEW */}
      <SidebarProvider>
        {/* ... existing content ... */}
      </SidebarProvider>
    </VariationProvider>
  </NotificationProvider>
</ColorSchemeProvider>
```

---

## Implementation Steps

### Phase 1: Core Infrastructure
1. Create `/app/collectoid/_components/variation-types.ts` - Type definitions
2. Create `/app/collectoid/_components/variation-context.tsx` - Context provider with sessionStorage
3. Create `/app/collectoid/_components/use-route-variations.ts` - Auto-discovery hook
4. Update `/app/collectoid/_components/index.ts` - Add new exports
5. Update `/app/collectoid/layout.tsx` - Add VariationProvider

### Phase 2: Widget Integration
6. Modify `/app/collectoid/_components/dev-widget.tsx` - Add variation selector using auto-discovery

### Phase 3: First Page Migration (Example)
7. Create `/app/collectoid/dcm/create/_variations/` directory
8. Create `/app/collectoid/dcm/create/_variations/index.ts` - Route variations config
9. Create `/app/collectoid/dcm/create/_variations/variation-1.tsx` - Copy existing page content
10. Update `/app/collectoid/dcm/create/page.tsx` - Implement variation switching

---

## Critical Files

| File | Action |
|------|--------|
| `/app/collectoid/_components/variation-types.ts` | Create |
| `/app/collectoid/_components/variation-context.tsx` | Create |
| `/app/collectoid/_components/use-route-variations.ts` | Create |
| `/app/collectoid/_components/index.ts` | Modify |
| `/app/collectoid/_components/dev-widget.tsx` | Modify |
| `/app/collectoid/layout.tsx` | Modify |

---

## Design Rationale

**Per-route `_variations/` folders:**
- Complete isolation - changes to one variation cannot affect another
- Discoverable - easy to see which pages have variations
- Code splitting - variations only loaded when needed

**SessionStorage persistence:**
- Resets on browser close (appropriate for prototyping)
- Tab isolation for testing different variations simultaneously

**Lightweight registry with lazy loading:**
- One-line registration in `use-route-variations.ts` per page
- Each page owns its variation definitions in `_variations/` folder
- Dynamic imports ensure variations only load when needed
- Widget shows/hides based on route registration

---

## Usage: Adding Variations to a New Page

1. Create `_variations/` folder next to the page's `page.tsx`
2. Create `index.ts` exporting `variations` array and `defaultVariation`
3. Create `variation-{id}.tsx` files for each variation (copy existing page content as starting point)
4. Update `page.tsx` to consume variations using the pattern above
5. Register the route in `/app/collectoid/_components/use-route-variations.ts`:
   ```typescript
   "/collectoid/your-route": async () => {
     const mod = await import("@/app/collectoid/your-route/_variations")
     return { variations: mod.variations, defaultVariation: mod.defaultVariation }
   },
   ```

The widget will display variations for any registered page.

---

## Current Variations in Codebase

### `/collectoid/dcm/create` - DCM Creation Page

| ID | Name | Description |
|----|------|-------------|
| `1` | Default Layout | Full wizard with all steps |
| `dcm-only` | DCM Details Only | Simplified form without patient/dataset steps |

**Files:**
- `/app/collectoid/dcm/create/_variations/index.ts`
- `/app/collectoid/dcm/create/_variations/variation-1.tsx`
- `/app/collectoid/dcm/create/_variations/variation-dcm-only.tsx`

### `/collectoid/collections` - Collections Browser Page

| ID | Name | Description |
|----|------|-------------|
| `1` | Default Layout | Checkbox/radio filters in sidebar |
| `v2` | Flexible Filtering | Floating header with filter chips and 3 view modes (Cards, Table, Kanban) |

**Files:**
- `/app/collectoid/collections/_variations/index.ts`
- `/app/collectoid/collections/_variations/variation-1.tsx`
- `/app/collectoid/collections/_variations/variation-v2.tsx`

---

## Quick Reference

**To check which pages have variations:**
Look in `/app/collectoid/_components/use-route-variations.ts` at the `variationLoaders` object.

**To see available variations for a page:**
Check the `_variations/index.ts` file in that page's directory.

**To create a new variation:**
1. Copy an existing variation file in the `_variations/` folder
2. Rename it (e.g., `variation-new.tsx`)
3. Register it in the `_variations/index.ts` file
4. Modify the component as needed

# Responsive Layout Improvements for Smaller Screens

## Overview
Fix layout issues on smaller browser windows (minimum 1024px) across all Collectoid pages. Users are on PC/Mac only, so no mobile considerations needed.

## Breakpoint Strategy
- **lg (1024px)**: Primary breakpoint - layouts must work well here
- **xl (1280px)**: Full experience with expanded layouts
- Sidebar collapses below 1280px (xl breakpoint)

---

## Part 1: Collapsible Sidebar

### Changes to `app/collectoid/_components/sidebar.tsx`
Create a collapsible sidebar that:
- **Expanded (xl+)**: Full `w-64` with labels, stats card, user info
- **Collapsed (<xl)**: Narrow `w-16` showing only icons with tooltips

Implementation:
1. Add `isCollapsed` state managed via context (so layout can adjust)
2. Use `xl:w-64 w-16` for responsive width
3. Hide text labels with `hidden xl:block`
4. Add tooltips on icons when collapsed (using Tooltip component)
5. Hide stats card and simplify user section when collapsed
6. Optional: Add toggle button to manually expand/collapse

### Changes to `app/collectoid/_components/index.ts`
Export new `SidebarContext` and `useSidebar` hook

### Changes to `app/collectoid/layout.tsx`
- Wrap with `SidebarProvider`
- Main content area adjusts: `xl:ml-64 ml-16`

---

## Part 2: Grid Layouts - Add Responsive Variants

### Pattern to Apply
```tsx
// Before
<div className="grid grid-cols-4 gap-6">

// After
<div className="grid grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-6">
```

### Files to Update

#### `app/collectoid/page.tsx`
- Line ~157: `grid-cols-4` → `grid-cols-2 xl:grid-cols-4`
- Line ~375: `grid-cols-3` → `grid-cols-2 xl:grid-cols-3`

#### `app/collectoid/dcm/progress/page.tsx` (Most Complex)
- Line ~621: `grid-cols-3` → `grid-cols-1 lg:grid-cols-3`
- Line ~687: `grid-cols-4` → `grid-cols-2 xl:grid-cols-4`
- Line ~1317: `grid-cols-4` → `grid-cols-2 xl:grid-cols-4`
- Line ~1343: `grid-cols-2` → keep but reduce gap
- Line ~1560: `grid-cols-3` → `grid-cols-1 lg:grid-cols-3`
- Line ~1743: `grid-cols-4` → `grid-cols-2 xl:grid-cols-4`
- Line ~2277: `grid-cols-3` → `grid-cols-1 lg:grid-cols-3`

#### `app/collectoid/my-requests/page.tsx`
- Line ~202: `grid-cols-4` → `grid-cols-2 xl:grid-cols-4`
- Line ~228: `grid-cols-3` → `grid-cols-2 xl:grid-cols-3`

#### `app/collectoid/discover/page.tsx`
- Line ~60: `grid-cols-4` → `grid-cols-2 xl:grid-cols-4`

#### `app/collectoid/collections/page.tsx`
- Grid layouts → add responsive variants

#### `app/collectoid/dcm/create/categories/page.tsx`
- Grid layouts → add responsive variants

#### `app/collectoid/dcm/create/filters/page.tsx`
- Grid layouts → add responsive variants

#### `app/collectoid/dcm/create/activities/page.tsx`
- Grid layouts → add responsive variants

#### `app/collectoid/dcm/create/agreements/page.tsx`
- Grid layouts → add responsive variants

#### `app/collectoid/dcm/create/publishing/page.tsx`
- Grid layouts → add responsive variants

#### `app/collectoid/dcm/propositions/page.tsx`
- Grid layouts → add responsive variants

#### `app/collectoid/dcm/propositions/[id]/review/page.tsx`
- Grid layouts → add responsive variants

#### `app/collectoid/requests/[id]/page.tsx`
- Grid layouts → add responsive variants

#### `app/collectoid/notifications/page.tsx`
- Grid layouts → add responsive variants

#### `app/collectoid/discover/ai/page.tsx`
- Grid layouts → add responsive variants

#### `app/collectoid/collections/[id]/page.tsx` (if exists)
- Grid layouts → add responsive variants

---

## Part 3: In-Page Sidebars/Panels

Several pages have fixed-width sidebars that need responsive handling:

### Pattern
```tsx
// Before
<div className="w-80 shrink-0">

// After - Hide on smaller screens, show as sheet/modal OR reduce width
<div className="hidden xl:block w-80 shrink-0">
// Plus add a toggle button that shows a Sheet on smaller screens
```

### Files with Fixed Sidebars
- `dcm/create/filters/page.tsx` - `w-80` cart sidebar
- `dcm/create/activities/page.tsx` - `w-80` sidebar
- `discover/ai/page.tsx` - `w-72` sidebar
- `collections/page.tsx` - `w-72` filter sidebar
- `dcm/progress/page.tsx` - `w-72` sidebar
- `requests/[id]/page.tsx` - `w-80` sidebar
- `notifications/page.tsx` - `w-80` sidebar

### Approach
1. Hide sidebar below xl breakpoint: `hidden xl:block`
2. Add floating action button that opens Sheet component
3. Use existing shadcn Sheet for slide-out panel

---

## Part 4: Spacing Adjustments

### Reduce gaps on smaller screens
```tsx
// Before
gap-6

// After
gap-4 xl:gap-6
```

### Reduce padding where needed
```tsx
// Before
px-6

// After
px-4 xl:px-6
```

Apply to:
- Main content area in layout.tsx: `px-8 xl:px-12`
- Card padding in various pages
- Button padding where space is tight

---

## Implementation Order

1. **Sidebar (Part 1)** - Creates foundation, biggest space savings
2. **Grid layouts (Part 2)** - Fixes the most visible issues
3. **In-page sidebars (Part 3)** - Secondary panels
4. **Spacing (Part 4)** - Polish and fine-tuning

---

## Files Summary

### Core Layout Changes
- `app/collectoid/_components/sidebar.tsx` - Collapsible sidebar
- `app/collectoid/_components/index.ts` - Export context
- `app/collectoid/layout.tsx` - Provider + layout adjustments

### Page Updates (15 pages)
1. `app/collectoid/page.tsx`
2. `app/collectoid/dcm/progress/page.tsx`
3. `app/collectoid/my-requests/page.tsx`
4. `app/collectoid/discover/page.tsx`
5. `app/collectoid/discover/ai/page.tsx`
6. `app/collectoid/collections/page.tsx`
7. `app/collectoid/notifications/page.tsx`
8. `app/collectoid/requests/[id]/page.tsx`
9. `app/collectoid/dcm/create/categories/page.tsx`
10. `app/collectoid/dcm/create/filters/page.tsx`
11. `app/collectoid/dcm/create/activities/page.tsx`
12. `app/collectoid/dcm/create/agreements/page.tsx`
13. `app/collectoid/dcm/create/publishing/page.tsx`
14. `app/collectoid/dcm/propositions/page.tsx`
15. `app/collectoid/dcm/propositions/[id]/review/page.tsx`

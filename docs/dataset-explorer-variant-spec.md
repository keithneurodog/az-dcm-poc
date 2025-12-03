# Dataset Explorer Variant Specification

> **Feature**: New variant for `/collectoid/discover/ai` page
> **Variant Name**: Dataset Explorer
> **Purpose**: Dataset-first discovery with powerful filtering, access status grouping, and smooth AI-to-filter transitions

---

## Overview

Create a new variant that shifts focus from collections to individual datasets. Users can:
1. Enter a natural language prompt (Hero AI Smart Filter)
2. See an "Analyzing..." animation then smooth reveal of pre-populated filters
3. Browse datasets grouped by access status (Open / Ready / Approval / Missing)
4. Select individual datasets or use bulk selection by access group
5. Request access for selected datasets

---

## Key Requirements

| Requirement | Description |
|-------------|-------------|
| **Hero AI Smart Filter** | Large, prominent natural language input at top with animated gradient border |
| **Dataset-first view** | Focus on individual datasets rather than collections |
| **Access status grouping** | Organize results by Open / Ready to Grant / Needs Approval / Missing |
| **Selection options** | Individual checkboxes + bulk selection (all, all on page, smart groups by access status) |
| **Dual view modes** | Card and Table views with toggle |
| **Request access action** | Selected datasets flow to access request |
| **Animated transitions** | Brief "Analyzing..." state then smooth reveal of populated filters |

---

## Files to Create/Modify

### New Files
1. `app/collectoid/discover/ai/_variations/index.ts` - Variant registry
2. `app/collectoid/discover/ai/_variations/variation-1.tsx` - Current page (moved/renamed)
3. `app/collectoid/discover/ai/_variations/variation-datasets.tsx` - New dataset explorer variant

### Modified Files
1. `app/collectoid/discover/ai/page.tsx` - Convert to variant loader pattern
2. `app/collectoid/_components/use-route-variations.ts` - Register new route

---

## Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Discovery                              [Help] [Theme] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ╔═══════════════════════════════════════════════════════════╗  │
│  ║  AI Smart Filter (Hero - animated gradient border)        ║  │
│  ║  ┌─────────────────────────────────────────────────────┐  ║  │
│  ║  │ "Find lung cancer studies with ctDNA biomarkers..." │  ║  │
│  ║  └─────────────────────────────────────────────────────┘  ║  │
│  ║  [Discover Datasets]                                      ║  │
│  ╚═══════════════════════════════════════════════════════════╝  │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ FILTER BAR (sticky on scroll)                                   │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Phase ▾ │ Status ▾ │ Area ▾ │ Region ▾ │ More ▾ │ Clear All │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ Active filters: [Phase III ×] [Oncology ×] [Europe ×]          │
├─────────────────────────────────────────────────────────────────┤
│ RESULTS HEADER                                                  │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 42 datasets found │ Sort: Relevance ▾ │ [Cards] [Table]     │ │
│ │ Select: [All] [All Open] [All Ready] [Page] │ 3 selected    │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ GROUPED RESULTS (access status sections)                        │
│                                                                 │
│ ▼ OPEN ACCESS (12 datasets) ─────────────────── [Select All]   │
│   ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                          │
│   │Card 1│ │Card 2│ │Card 3│ │Card 4│  ...                     │
│   └──────┘ └──────┘ └──────┘ └──────┘                          │
│                                                                 │
│ ▼ READY TO GRANT (18 datasets) ───────────────── [Select All]  │
│   ...                                                          │
│                                                                 │
│ ▼ NEEDS APPROVAL (10 datasets) ─────────────── [Select All]    │
│   ...                                                          │
│                                                                 │
│ ▼ MISSING/BLOCKED (2 datasets) ─────────────── [Select All]    │
│   ...                                                          │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│ STICKY FOOTER (when datasets selected)                          │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ 3 datasets selected │ Access breakdown: ████░░ │ [Request]  │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Phases

### Phase 1: Setup Variant Infrastructure

1. Create `_variations` folder at `app/collectoid/discover/ai/_variations/`

2. Create `index.ts` registry with two variants:
   - `id: "1"` - "Collections Focus" (current page)
   - `id: "datasets"` - "Dataset Explorer" (new variant)

3. Move current page content to `variation-1.tsx`

4. Update main `page.tsx` to use variant loader pattern

5. Register route in `use-route-variations.ts`

### Phase 2: Build Dataset Explorer Variant

#### State Management
- Core: prompt, isAnalyzing, hasSearched, showResults
- AI filters: aiFilters, smartFilterQuery, smartFilterActive
- Manual filters: phase, status, therapeuticArea, geography
- Selection: selectedDatasets (Set)
- View: viewMode (cards/table), sortBy, collapsedGroups

#### Access Status Groups
| Group | Color | Icon | Description |
|-------|-------|------|-------------|
| Open Access | emerald | CheckCircle2 | Instant access - no action needed |
| Ready to Grant | blue | Zap | Auto-provisioned when you request |
| Needs Approval | amber | Clock | Requires review from data governance |
| Missing/Blocked | neutral | AlertTriangle | Data location unknown or training required |

#### Selection System
- Individual checkboxes on each dataset
- Bulk buttons: All / All Open / All Ready / Page
- Per-group "Select All" buttons
- Clear selection button

#### Card View (Rich)
- Dataset code badge + name
- Phase and status badges
- Access status indicator (color-coded)
- Mini access breakdown bar (4-segment)
- Therapeutic area tags
- Patient count
- "Frequently bundled with" hints
- Checkbox for selection
- Hover effect with shadow lift

#### Table View (Dense)
Columns: Checkbox, Code, Name, Phase, Status, Therapeutic Area, Access Status, Patient Count, Actions

### Phase 3: Animations & Polish

#### Analyzing State
- Gradient spinner with theme colors
- "Analyzing your request..." text
- "Finding relevant datasets" subtitle

#### Results Reveal Animation
- Fade in + translate up (duration-500)
- Triggered after isAnalyzing completes

#### Group Expand/Collapse
- Smooth height animation using grid-rows trick
- Chevron rotation indicator

### Phase 4: Design System Compliance

Following UX 13 patterns:
- `font-extralight` for h1/h2, `font-light` for body
- `rounded-xl` cards, `rounded-2xl` containers, `rounded-full` buttons
- Dynamic gradient via `useColorScheme()`
- Status colors: emerald/blue/amber/neutral
- Hover shadows: `shadow-md hover:shadow-xl`
- Animated transitions with `transition-all duration-300`
- Lucide icons with `strokeWidth={1.5}`
- Backdrop blur for sticky elements

---

## Request Access Flow

When user clicks "Request Access":
1. Store selected dataset IDs in sessionStorage
2. Navigate to `/collectoid/requests/new`
3. Show confirmation with selected datasets and access breakdown
4. Submit request routes to appropriate approval workflows

---

## Reference Files

| File | Purpose |
|------|---------|
| `app/ux/13/design-system/page.tsx` | Design system reference |
| `app/collectoid/discover/ai/page.tsx` | Current page to refactor |
| `app/collectoid/dcm/create/filters/page.tsx` | Filter patterns reference |
| `app/collectoid/collections/_variations/variation-v2.tsx` | Flexible filtering reference |
| `lib/dcm-mock-data.ts` | Dataset interfaces & mock data |
| `app/collectoid/_components/use-route-variations.ts` | Variant registration |

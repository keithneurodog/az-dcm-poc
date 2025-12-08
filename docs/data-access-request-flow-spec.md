# Data Access Request Flow Spec

## Summary

Design a simple, transparent request flow that activates when users click "Request Access" after selecting datasets. The user submits ONE request with full transparency on timelines - no complexity management required from them. The DCM team handles all collection/provisioning complexity behind the scenes.

**Core Principles:**
- User submits ONE simple request (no splitting, no collection management)
- Full transparency on what's happening and expected timelines
- **Single interactive screen** for intent + dataset refinement (no back-and-forth)
- Real-time feedback showing how intent choices affect complexity/ETA
- Show access hints during dataset selection (pre-flight)

---

## Flow Overview (3 Steps)

```
[Dataset Explorer] → [Request Access Click]
        ↓
┌─────────────────────────────┐
│ STEP 1: Intent Capture      │  What do you want to do?
│ - Primary Use (5 options)   │  (publication, AI/ML, etc.)
│ - Beyond Primary Use        │  Quick selection
│ - Publication intentions    │
└─────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Interactive Request Builder (MAIN SCREEN)          │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ INTENT PANEL (collapsible, editable)                    │ │
│ │ Your selections: AI/ML ✓  Publication ✓  Internal ✓    │ │
│ │ [Edit Intent]                                           │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ ⚠️ INTENT WARNINGS                                      │ │
│ │ "Your AI/ML intent adds ~6 weeks for datasets           │ │
│ │  DCODE-042, DCODE-156, DCODE-203 (not yet approved)"   │ │
│ │ [Remove AI/ML intent] [Keep and wait]                   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ TIMELINE SUMMARY                                        │ │
│ │ ○━━━━━○━━━━━━━━━━━━━━━━━━━━━━○                          │ │
│ │ Now   2wk                   8wk                         │ │
│ │  4     5                     3                          │ │
│ │                                                         │ │
│ │ 100% access: ~8 weeks | Remove 3 datasets: ~2 weeks    │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ DATASETS (12 selected)                    [Add more]    │ │
│ │                                                         │ │
│ │ ┌─ Ready NOW (4) ─────────────────────────────────────┐ │ │
│ │ │ ☑ DCODE-001  Genomic Profiling      Ready    [Swap] │ │ │
│ │ │ ☑ DCODE-089  Breast Cancer Ph3      Ready    [Swap] │ │ │
│ │ │ ...                                                 │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ ┌─ ~2 weeks (5) ──────────────────────────────────────┐ │ │
│ │ │ ☑ DCODE-067  Immunotherapy         2wk       [Swap] │ │ │
│ │ │   └─ Waiting: Collection access request             │ │ │
│ │ │ ☑ DCODE-088  Cardio Outcomes       2wk       [Swap] │ │ │
│ │ │   └─ Waiting: GPT-Oncology approval                 │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │                                                         │ │
│ │ ┌─ ~8 weeks (3) ⚠️ Adding complexity ─────────────────┐ │ │
│ │ │ ☑ DCODE-042  NSCLC ctDNA           8wk       [Swap] │ │ │
│ │ │   └─ ⚠️ AI/ML intent: Not approved (+6 weeks)       │ │ │
│ │ │   └─ Similar: DCODE-098 (Ready NOW) [Use instead]   │ │ │
│ │ │ ☐ DCODE-156  Active Trial Data     8wk      Removed │ │ │
│ │ │   └─ ⚠️ AI/ML + Publication conflict                │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ 💡 SIMILAR DATASETS YOU MIGHT LIKE                      │ │
│ │ DCODE-098  Similar to DCODE-042  Ready NOW  [Add]      │ │
│ │ DCODE-112  Oncology Biomarkers   ~2 weeks   [Add]      │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                             │
│                              [Submit Request →]             │
└─────────────────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────┐
│ STEP 3: Confirmation        │  Success!
│ - Request submitted         │  - Track in "My Requests"
│ - Expected timeline         │  - DCM team notified
└─────────────────────────────┘
```

---

## Files to Create/Modify

### New Files
```
app/collectoid/requests/new/
├── page.tsx                      # Main orchestrator (3-step flow)
├── _components/
│   ├── request-context.tsx       # Flow state management
│   ├── step-intent.tsx           # Step 1: Quick intent capture
│   ├── step-builder.tsx          # Step 2: Interactive request builder (MAIN)
│   ├── step-confirmation.tsx     # Step 3: Success confirmation
│   ├── intent-panel.tsx          # Collapsible intent summary/editor
│   ├── intent-warnings.tsx       # Warnings about intent-dataset conflicts
│   ├── timeline-summary.tsx      # Visual timeline with counts
│   ├── dataset-list.tsx          # Grouped dataset list with actions
│   ├── dataset-row.tsx           # Individual dataset with complexity info
│   ├── similar-datasets.tsx      # Recommendations panel
│   └── swap-modal.tsx            # Modal for swapping datasets

lib/
├── request-matching.ts           # Smart matching + similarity logic
```

### Modified Files
- `lib/dcm-mock-data.ts` - Add new interfaces
- `app/collectoid/discover/ai/_variations/variation-datasets.tsx` - Update handleRequestAccess + pre-flight hints

---

## New Data Structures

### DataAccessIntent
```typescript
export interface DataAccessIntent {
  primaryUse: {
    understandDrugMechanism: boolean
    understandDisease: boolean
    developDiagnosticTests: boolean
    learnFromPastStudies: boolean
    improveAnalysisMethods: boolean
  }
  beyondPrimaryUse: {
    aiResearch: boolean
    softwareDevelopment: boolean
  }
  publication: {
    internalCompanyRestricted: boolean
    externalPublication: boolean | "by_exception"
  }
  externalSharing: {
    allowed: boolean
    processDescription?: string
  }
  researchPurpose: string
  expectedDuration: "3-months" | "6-months" | "1-year" | "2-years" | "indefinite"
}
```

### DatasetMatchResult
```typescript
export interface DatasetMatchResult {
  datasetId: string
  dataset: Dataset
  accessCategory: "immediate" | "collection" | "new_collection" | "conflict"
  matchingCollectionId?: string
  matchingCollectionName?: string
  categoryReason: string
  estimatedDays: number | null
  aotConflicts: AoTConflict[]
  alternatives: AlternativeDataset[]
}
```

### RequestMatchingResult
```typescript
export interface RequestMatchingResult {
  immediate: DatasetMatchResult[]      // Green - ready now
  collectionAccess: DatasetMatchResult[] // Blue - 1-2 weeks
  newCollection: DatasetMatchResult[]    // Amber - ~8 weeks
  conflicts: DatasetMatchResult[]        // Red - blocked

  summary: {
    totalDatasets: number
    immediateCount: number
    collectionAccessCount: number
    newCollectionCount: number
    conflictCount: number
    estimatedFullAccessDays: number
  }

  recommendations: {
    immediateOnlyEta: string
    fullRequestEta: string
    datasetsToRemoveForFaster: string[]
  }
}
```

---

## Step Details

### Step 1: Intent Capture (Quick)
Fast intent selection screen:
- Primary Use (5 checkboxes) - pre-expanded
- Beyond Primary Use (AI/ML, Software Dev toggles)
- Publication (internal/external)
- Brief animated transition to Step 2 (~1 second "Analyzing...")

### Step 2: Interactive Request Builder (MAIN SCREEN)

This is the core experience - a single, fully interactive screen where users can:

#### A. Intent Panel (Top, Collapsible)
- Shows current intent as badges: `AI/ML ✓` `Publication ✓` `Internal ✓`
- "Edit Intent" button expands inline editor
- **Real-time**: Changing intent immediately recalculates all ETAs below

#### B. Intent Warnings Panel
Contextual warnings that explain complexity:
- "Your **AI/ML intent** adds ~6 weeks for DCODE-042, DCODE-156, DCODE-203 (not yet approved for ML use)"
- "Your **External Publication** intent conflicts with DCODE-156 (restricted dataset)"
- Action buttons: `[Remove AI/ML intent]` `[Remove affected datasets]` `[Keep and wait]`

#### C. Timeline Summary
Visual timeline showing dataset distribution:
```
○━━━━━○━━━━━━━━━━━━━━━━━━━━━━○
Now   2wk                   8wk
 4     5                     3

100% access: ~8 weeks
Remove 3 complex datasets → 100% in ~2 weeks
```
- Updates in real-time as user adds/removes datasets
- Shows "quick win" option if removing certain datasets significantly reduces ETA

#### D. Dataset List (Grouped by ETA)
Datasets grouped into collapsible sections:

**Ready NOW (4)** - Green header
- Each row shows: `☑ DCODE-001  Genomic Profiling Study  [Ready] [Swap]`
- Minimal complexity - already accessible

**~2 weeks (5)** - Blue header
- Each row shows complexity reason:
  ```
  ☑ DCODE-067  Immunotherapy Response     ~2wk    [Swap] [Remove]
    └─ Waiting: Collection access request
  ```

**~8 weeks (3)** - Amber header with ⚠️ "Adding complexity"
- Each row shows WHY it's complex:
  ```
  ☑ DCODE-042  NSCLC ctDNA Monitoring     ~8wk    [Swap] [Remove]
    └─ ⚠️ AI/ML intent: Not yet approved for ML (+6 weeks)
    └─ 💡 Similar: DCODE-098 (Ready NOW) [Use instead]
  ```
- Inline similar dataset recommendations with one-click swap

**Removed (1)** - Gray, collapsed by default
- Shows datasets user has removed with `[Restore]` option

#### E. Similar Datasets Panel
Bottom section with recommendations:
```
💡 SIMILAR DATASETS YOU MIGHT LIKE

DCODE-098  92% similar to DCODE-042   Ready NOW    [Add]
  └─ Same therapeutic area, comparable patient population

DCODE-112  Oncology Biomarkers        ~2 weeks     [Add]
  └─ Complements your genomic profiling selection
```

#### F. Submit Button (Sticky Footer)
- Shows final summary: "12 datasets • 100% access in ~8 weeks"
- Terms agreement checkbox (inline)
- `[Submit Request →]` button

### Step 3: Confirmation
Success screen:
- "Your request has been submitted!"
- Summary of what was requested
- Expected timeline visualization
- "Track in My Requests" link
- DCM team handles all provisioning from here

---

## Smart Matching Logic

```typescript
// lib/request-matching.ts
export function performSmartMatching(
  datasets: Dataset[],
  intent: DataAccessIntent,
  allCollections: Collection[]
): RequestMatchingResult {
  // For each dataset:
  // 1. Check if dataset.collections includes a collection user has access to
  // 2. Check if that collection's AoT matches user intent
  // 3. If no match, check if ANY collection contains dataset with compatible AoT
  // 4. Check for hard AoT conflicts (dataset.aotMetadata restrictions vs intent)
  // 5. Find similar datasets with better access paths
}
```

---

## Animation Specifications

Using framer-motion:
- **Step transitions**: Horizontal slide with fade (x: 20 → 0, opacity)
- **Card reveals**: Staggered slide-in from left (staggerChildren: 0.1)
- **Count animations**: Spring physics number counter
- **Progress bar**: Smooth easing with gradient shimmer
- **Expandable sections**: Height auto with opacity fade

---

## Key UX Decisions

1. **Single interactive screen**: All refinement happens on ONE screen - no back-and-forth between steps
2. **Real-time feedback**: Changing intent or removing datasets instantly updates all ETAs
3. **Explain complexity**: Every dataset shows WHY it has the ETA it has (intent conflicts, approvals needed, etc.)
4. **Intent-aware warnings**: Prominent warnings when user's intent (AI/ML, publication) affects specific datasets
5. **Inline recommendations**: Similar datasets shown directly under complex datasets with one-click swap
6. **NO split request**: User submits ONE request - DCM team handles all provisioning complexity
7. **Pre-flight hints**: Show access status badges on dataset cards DURING selection (before request flow)

---

## Pre-Flight Hints (Dataset Selection Screen)

Add visual hints to dataset cards in the explorer BEFORE user clicks "Request Access":

```tsx
// On each DatasetCard, show access hint badge
<DatasetCard>
  <div className="absolute top-2 right-2">
    {dataset.accessBreakdown.alreadyOpen >= 80 && (
      <Badge className="bg-emerald-100 text-emerald-700">
        <Zap className="size-3 mr-1" />
        Ready for you
      </Badge>
    )}
    {dataset.accessBreakdown.needsApproval >= 50 && (
      <Badge className="bg-amber-100 text-amber-700">
        <Clock className="size-3 mr-1" />
        ~2 weeks
      </Badge>
    )}
    {hasAoTConflict && (
      <Badge className="bg-red-100 text-red-700">
        <AlertTriangle className="size-3 mr-1" />
        May conflict
      </Badge>
    )}
  </div>
</DatasetCard>
```

This gives users early visibility into access complexity while selecting.

---

## Implementation Phases

### Phase 1: Foundation
- Create file structure under `app/collectoid/requests/new/`
- Add interfaces to `dcm-mock-data.ts` (DataAccessIntent, DatasetMatchResult, etc.)
- Create `request-matching.ts` with smart matching + similarity logic
- Implement `request-context.tsx` for state management

### Phase 2: Step 1 - Intent Capture
- `step-intent.tsx` - Quick intent selection (reference: /collections/[id]/request/page.tsx)
- Animated transition to Step 2

### Phase 3: Step 2 - Interactive Builder (Core)
- `step-builder.tsx` - Main orchestrator component
- `intent-panel.tsx` - Collapsible intent summary with inline editing
- `intent-warnings.tsx` - Contextual warnings about complexity
- `timeline-summary.tsx` - Visual timeline with real-time updates
- `dataset-list.tsx` - Grouped datasets by ETA tier
- `dataset-row.tsx` - Individual row with complexity explanation, swap, remove
- `similar-datasets.tsx` - Recommendations panel
- `swap-modal.tsx` - Dataset comparison/swap modal

### Phase 4: Step 3 - Confirmation + Integration
- `step-confirmation.tsx` - Success screen
- Update `variation-datasets.tsx` with pre-flight hints
- Update `handleRequestAccess` to navigate to new flow

### Phase 5: Polish
- Framer-motion animations (real-time ETA updates, list reordering)
- Edge cases (empty states, all datasets removed, etc.)
- Mobile responsiveness

---

## Reference Files

- `/lib/dcm-mock-data.ts` - Data structures, AoT interfaces
- `/app/collectoid/collections/[id]/request/page.tsx` - Intent capture patterns
- `/app/collectoid/discover/ai/_variations/variation-datasets.tsx` - Integration point
- `/app/collectoid/dcm/create/_variations/variation-1.tsx` - Multi-step UI patterns

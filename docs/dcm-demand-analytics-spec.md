# DCM Data Demand Analytics Dashboard

## Summary

Create a new analytics page for DCM users showing a **heatmap/overview of data demand** across datasets. The page helps DCMs understand which data is most requested, identify gaps between supply (existing collections) and demand (user requests), and provides actionable pathways to create new collections for underserved areas.

---

## Problem

DCM users currently have no visibility into:
- Which datasets are being requested most frequently
- What therapeutic areas or data types have high demand
- Where gaps exist between what users want and what collections exist
- What new collections would have the most impact

---

## Solution: Data Demand Analytics Dashboard

### Core Features

1. **Dataset Demand Heatmap** - Visual representation of request patterns
   - Dataset-centric view showing "hotness" of individual datasets
   - Filterable by dimension: Therapeutic Area, Data Type, Use Intent, Clinical Phase
   - Color intensity = demand level (requests + active users)
   - Clickable cells → navigate to Create Collection with pre-filled filters

2. **Gap Analysis Panel** - Supply vs Demand comparison
   - Shows datasets with high demand but low collection coverage
   - Highlights "opportunity zones" where new collections would have impact
   - Calculates coverage ratio: (datasets in collections) / (datasets requested)

3. **Smart Suggestions Panel** - AI-powered recommendations
   - "Recommended Collections to Create" based on demand patterns
   - Each suggestion is clickable → pre-fills Create Collection wizard
   - Shows projected user impact (how many users would benefit)

4. **Trend Indicators** - Temporal analysis
   - Trending up/down badges on datasets
   - Time period selector (last 30/60/90 days)

---

## UI Design

### Page Layout

```
┌─────────────────────────────────────────────────────────────────────────┐
│  Data Demand Analytics                                    [30d ▼] [⚙️]  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─ Summary Metrics ──────────────────────────────────────────────────┐ │
│  │  [Total Requests]  [Hot Datasets]  [Coverage Gap]  [Trending ↑]   │ │
│  │      1,247             23              34%              12         │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌─ Filters ──────────────────────────────────────────────────────────┐ │
│  │ View by: [Dataset ▼]  Group by: [Therapeutic Area ▼]  [+ Filter]  │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌─ Demand Heatmap (70%) ─────────────┐  ┌─ Suggestions (30%) ────────┐ │
│  │                                     │  │                           │ │
│  │  ┌─────┬─────┬─────┬─────┬─────┐   │  │  💡 Recommended Collections │ │
│  │  │     │ ONC │CARD │NEURO│RESP │   │  │                           │ │
│  │  ├─────┼─────┼─────┼─────┼─────┤   │  │  ┌───────────────────────┐│ │
│  │  │SDTM │ 🔥  │ 🟠  │ 🟡  │ 🟢  │   │  │  │ Oncology + Omics     ││ │
│  │  ├─────┼─────┼─────┼─────┼─────┤   │  │  │ 47 users waiting     ││ │
│  │  │ADaM │ 🔥  │ 🟠  │ 🟢  │ 🟢  │   │  │  │ [Create →]           ││ │
│  │  ├─────┼─────┼─────┼─────┼─────┤   │  │  └───────────────────────┘│ │
│  │  │Omics│ 🟠  │ 🟡  │ 🟡  │ ⚪  │   │  │                           │ │
│  │  ├─────┼─────┼─────┼─────┼─────┤   │  │  ┌───────────────────────┐│ │
│  │  │DICOM│ 🟡  │ 🟢  │ 🟢  │ ⚪  │   │  │  │ Cardio + AI/ML       ││ │
│  │  └─────┴─────┴─────┴─────┴─────┘   │  │  │ 32 users waiting     ││ │
│  │                                     │  │  │ [Create →]           ││ │
│  │  Click any cell to create collection│  │  └───────────────────────┘│ │
│  └─────────────────────────────────────┘  └───────────────────────────┘ │
│                                                                         │
│  ┌─ Top Requested Datasets ───────────────────────────────────────────┐ │
│  │  #  Dataset              TA        Requests  Collections  Gap      │ │
│  │  1  DCODE-156 ctDNA     Oncology      89         2        HIGH    │ │
│  │  2  DCODE-203 PET       Oncology      67         1        MED     │ │
│  │  3  DCODE-401 Echo      Cardio        54         3        LOW     │ │
│  │  ...                                                               │ │
│  └────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Heatmap Interaction

- **Hover**: Tooltip with dataset count, requests, users, and existing collections
- **Click**: Opens a slide-over or navigates to `/dcm/create?ta=oncology&type=sdtm`
- **Filter pills**: Active filters shown above heatmap, clearable

### Color Scale

- 🔥 **Hot** (red/orange): High demand, low supply (opportunity zone)
- 🟠 **Warm** (amber): Moderate demand
- 🟡 **Cool** (yellow): Low demand
- 🟢 **Covered** (green): Good collection coverage
- ⚪ **Cold** (gray): No significant demand

---

## Data Structures

### DemandMetrics (new interface)

```typescript
export interface DatasetDemandMetrics {
  datasetId: string
  datasetCode: string
  datasetName: string
  therapeuticArea: string[]
  dataTypes: string[]  // SDTM, ADaM, Omics, etc.

  // Demand signals
  totalRequests: number       // Total access requests
  activeUsers: number         // Users currently using
  pendingRequests: number     // Awaiting approval
  requestsLast30Days: number
  requestsLast90Days: number
  trendDirection: 'up' | 'down' | 'stable'
  trendPercent: number        // % change vs prior period

  // Supply signals
  collectionsContaining: number  // How many collections include this
  collectionNames: string[]

  // Intent breakdown
  intentBreakdown: {
    aiResearch: number
    softwareDev: number
    publication: number
    internal: number
  }

  // Gap analysis
  coverageScore: number       // 0-100, higher = well covered
  demandScore: number         // 0-100, higher = more demand
  gapScore: number            // demandScore - coverageScore (opportunity)
}

export interface DemandHeatmapCell {
  rowKey: string              // e.g., "SDTM" or "Oncology"
  colKey: string              // e.g., "Oncology" or "AI/ML"
  datasetCount: number
  totalRequests: number
  avgGapScore: number
  datasets: DatasetDemandMetrics[]
}

export interface CollectionSuggestion {
  id: string
  title: string               // e.g., "Oncology Omics for AI Research"
  description: string
  filters: {
    therapeuticAreas?: string[]
    dataTypes?: string[]
    intents?: string[]
  }
  projectedUsers: number      // How many users would benefit
  gapScore: number
  topDatasets: string[]       // Dataset codes to include
}
```

### Helper Functions (lib/analytics-helpers.ts)

```typescript
// Aggregate demand metrics from mock data
export function calculateDemandMetrics(datasets: Dataset[]): DatasetDemandMetrics[]

// Build heatmap data for given dimensions
export function buildHeatmapData(
  metrics: DatasetDemandMetrics[],
  rowDimension: 'dataType' | 'therapeuticArea' | 'intent',
  colDimension: 'dataType' | 'therapeuticArea' | 'intent'
): DemandHeatmapCell[][]

// Generate collection suggestions based on gaps
export function generateCollectionSuggestions(
  metrics: DatasetDemandMetrics[],
  limit?: number
): CollectionSuggestion[]

// Get trending datasets
export function getTrendingDatasets(
  metrics: DatasetDemandMetrics[],
  direction: 'up' | 'down',
  limit?: number
): DatasetDemandMetrics[]
```

---

## Files to Create/Modify

### New Files

| File | Purpose |
|------|---------|
| `app/collectoid/dcm/analytics/page.tsx` | Main analytics dashboard page |
| `app/collectoid/dcm/analytics/_components/demand-heatmap.tsx` | Heatmap visualization component |
| `app/collectoid/dcm/analytics/_components/suggestions-panel.tsx` | Collection recommendations panel |
| `app/collectoid/dcm/analytics/_components/metrics-summary.tsx` | Top-level KPI cards |
| `app/collectoid/dcm/analytics/_components/top-datasets-table.tsx` | Sortable table of hot datasets |
| `lib/analytics-helpers.ts` | Data aggregation and gap analysis logic |

### Modified Files

| File | Changes |
|------|---------|
| `app/collectoid/_components/sidebar.tsx` | Add "Analytics" nav item in DCM section |
| `lib/dcm-mock-data.ts` | Add mock request counts to datasets (or new MOCK_DEMAND_DATA) |
| `app/collectoid/dcm/create/page.tsx` | Accept query params to pre-fill filters |

---

## Implementation Phases

### Phase 1: Data Layer
- [ ] Create `lib/analytics-helpers.ts` with demand calculation functions
- [ ] Add mock demand data to `dcm-mock-data.ts` (request counts, trends)
- [ ] Implement `calculateDemandMetrics()` and `buildHeatmapData()`
- [ ] Implement `generateCollectionSuggestions()` for gap analysis

### Phase 2: Analytics Page Shell
- [ ] Create `app/collectoid/dcm/analytics/page.tsx` with layout
- [ ] Add "Analytics" to sidebar navigation (with chart icon)
- [ ] Implement `MetricsSummary` component (4 KPI cards)
- [ ] Add filter bar with dimension selectors

### Phase 3: Heatmap Visualization
- [ ] Create `DemandHeatmap` component with Recharts
- [ ] Implement color scale based on gap score
- [ ] Add hover tooltips with cell details
- [ ] Add click handler → navigate to create collection with filters

### Phase 4: Suggestions Panel
- [ ] Create `SuggestionsPanel` component
- [ ] Display top 3-5 collection suggestions
- [ ] Each suggestion card has "Create Collection →" button
- [ ] Link to `/dcm/create?ta=X&type=Y&intent=Z`

### Phase 5: Top Datasets Table
- [ ] Create `TopDatasetsTable` component
- [ ] Sortable columns: Requests, Coverage, Gap
- [ ] Row click → show dataset detail or add to collection

### Phase 6: Create Collection Integration
- [ ] Update `app/collectoid/dcm/create/page.tsx` to read query params
- [ ] Pre-fill wizard step based on `?ta=`, `?type=`, `?intent=` params
- [ ] Show "Based on demand analysis" badge when pre-filled

---

## Tech Stack

### Recharts Library

Install Recharts for data visualization:
```bash
npm install recharts
```

Recharts components to use:
- `ScatterChart` or custom `Cell` components for heatmap grid
- `Tooltip` for hover interactions
- `ResponsiveContainer` for responsive sizing
- Custom cell renderer for colored grid squares

### Heatmap Implementation with Recharts

Since Recharts doesn't have a built-in heatmap, we'll use one of these approaches:
1. **ScatterChart with custom cells** - Plot TA×DataType as scatter points with colored circles
2. **ComposedChart with Bar** - Use stacked bars with custom colors
3. **Custom component** - Use Recharts primitives (Cell, Rectangle) with CSS Grid layout

Recommended: Custom heatmap component using Recharts `Rectangle` and `Text` primitives for maximum control while still leveraging Recharts' responsive container and tooltip system.

---

## Styling Guidelines

- Match existing zen aesthetic (font-light, rounded-2xl, subtle shadows)
- Use existing color scheme from `useColorScheme()`
- Heatmap: Recharts with custom cell colors based on gap score
- Color scale: Use scheme gradients, map to recharts fill colors
- Animations: `animate-in fade-in` for panel transitions

---

## Testing Scenarios

1. **Load page**: Shows heatmap with default grouping (TA × Data Type)
2. **Change dimension**: Toggle to "Intent" grouping, heatmap updates
3. **Hover cell**: Tooltip shows dataset count, requests, gap score
4. **Click hot cell**: Navigates to `/dcm/create?ta=oncology&type=omics`
5. **Click suggestion**: Same navigation with appropriate params
6. **Filter by time**: Change to 90 days, metrics recalculate
7. **Sort table**: Click column headers to sort top datasets

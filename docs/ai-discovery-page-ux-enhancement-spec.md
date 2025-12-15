# AI Discovery Page UX Enhancement Specification

## Overview
This specification outlines comprehensive UX improvements for the `/collectoid/discover/ai` page, bringing refined patterns from the filters page (`/collectoid/dcm/create/filters`) to create a polished data discovery and request management experience.

## User Flow Summary
1. User searches with natural language AI query
2. AI extracts keywords and shows matching collections + datasets
3. User views detailed breakdown panel with access statistics
4. User selects multiple collections and/or individual datasets
5. Selections accumulate in floating bottom bar
6. User clicks "Continue" → navigates to AI review page
7. AI generates summary and suggests grouping name
8. User submits request → saved as named group in "My Requests"

---

## Design Decisions (From User Input)
- **Selection Method**: Add button on each card (like datasets in filters page)
- **Selection Display**: Floating bottom bar (expandable)
- **Mixed Selection**: Users can select both collections AND individual datasets
- **Post-Selection Flow**: New review page with AI summary and editable grouping

---

## Phase 1: Smart Search Enhancement

### Goal
Make the AI Smart Filter editable, toggleable, and visually rich like the filters page implementation.

### Reference
Filters page lines 1556-1657, 170-173, 175-180

### Features to Add

#### 1.1 Three Visual States
**Current**: Single state showing keywords
**New**: Three distinct states

1. **Prompt State** (no query yet)
   - Dashed border card invitation
   - Gradient icon with Sparkles
   - "AI Smart Filter" heading with Beta badge
   - "Describe what you're looking for in natural language"
   - Click to activate edit mode

2. **Active State** (query applied and filtering)
   - Pulsing gradient border animation (`animate-pulse`)
   - Colored border matching theme
   - Full opacity
   - Check icon + "Actively filtering X collections, Y datasets"
   - Toggle switch showing "Active"
   - Edit button (Pencil icon)
   - Clear button (X icon, red on hover)

3. **Inactive/Paused State** (query saved but not filtering)
   - Gray border (`border-neutral-200`)
   - 60% opacity
   - X icon + "Filter is paused - toggle to re-enable"
   - Toggle switch showing "Paused"

#### 1.2 Edit Functionality
- Pencil icon button opens textarea with existing query pre-filled
- Textarea with placeholder examples
- Cancel and "Apply AI Filter" buttons
- Loading state during AI processing (1.5-2s simulation)
- Disabled state during processing

#### 1.3 Toggle Switch
- Switch component for Active/Paused
- Backdrop blur container with label
- Smooth transitions between states

#### 1.4 Clear Functionality
- Red X button with red hover states
- Clears query, resets to prompt state
- Confirmation not needed (can undo by re-searching)

### Technical Requirements
```typescript
// New state variables needed
const [showSmartInput, setShowSmartInput] = useState(false)
const [isSearching, setIsSearching] = useState(false) // rename from existing
const [smartFilterActive, setSmartFilterActive] = useState(true) // default active
const [smartFilterQuery, setSmartFilterQuery] = useState("")

// New functions needed
const editSmartFilter = () => {
  setPrompt(smartFilterQuery)
  setShowSmartInput(true)
}

const clearSmartFilter = () => {
  setPrompt("")
  setSmartFilterQuery("")
  setSmartFilterActive(false)
  setShowSmartInput(false)
  setAiResponse(null)
  setHasSearched(false)
}

const toggleSmartFilter = () => {
  setSmartFilterActive(!smartFilterActive)
}
```

---

## Phase 2: Editable Keywords Display

### Goal
Allow users to refine results by removing or adding keywords manually.

### Reference
Filters page active filters summary (lines 1318-1519)

### Features to Add

#### 2.1 Keyword Badges
- Display extracted keywords as Badge components
- Each badge is clickable to remove
- Hover state changes to red (removal hint)
- X icon inline on each badge
- Click removes keyword and re-filters results

#### 2.2 Add Keyword Functionality
- "+ Add Keyword" button after badge list
- Opens small input or popover
- Type keyword and press Enter
- New keyword badge appears
- Results filter to include new keyword

#### 2.3 Active Keywords Summary Section
**Location**: Between smart filter and breakdown panel

```tsx
{aiResponse && aiResponse.keywords.length > 0 && (
  <div className="space-y-2 mb-6">
    <p className="text-xs font-light text-neutral-500 uppercase tracking-wider">
      Active Keywords
    </p>
    <div className="flex flex-wrap gap-2">
      {aiResponse.keywords.map((keyword) => (
        <Badge
          key={keyword}
          variant="outline"
          className="font-light pl-3 pr-2 py-1 cursor-pointer
                     hover:bg-red-50 hover:text-red-700 hover:border-red-200"
          onClick={() => removeKeyword(keyword)}
        >
          {keyword}
          <X className="size-3 ml-1.5 inline" />
        </Badge>
      ))}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAddKeyword(true)}
        className="h-7 px-2 text-xs"
      >
        <Plus className="size-3 mr-1" />
        Add Keyword
      </Button>
    </div>
  </div>
)}
```

---

## Phase 3: Collection & Dataset Selection System

### Goal
Enable multi-select of collections and datasets with visual feedback.

### Reference
Filters page dataset selection (lines 1896-1917, 198-206)

### Features to Add

#### 3.1 Selection State Management
```typescript
const [selectedCollections, setSelectedCollections] = useState<Set<string>>(new Set())
const [selectedDatasets, setSelectedDatasets] = useState<Set<string>>(new Set())

const toggleCollection = (collectionId: string) => {
  const newSelected = new Set(selectedCollections)
  if (newSelected.has(collectionId)) {
    newSelected.delete(collectionId)
  } else {
    newSelected.add(collectionId)
  }
  setSelectedCollections(newSelected)
}

const toggleDataset = (datasetId: string) => {
  const newSelected = new Set(selectedDatasets)
  if (newSelected.has(datasetId)) {
    newSelected.delete(datasetId)
  } else {
    newSelected.add(datasetId)
  }
  setSelectedDatasets(newSelected)
}

// Total selections
const totalSelections = selectedCollections.size + selectedDatasets.size
```

#### 3.2 Collection Card "Add to Request" Button
**Location**: In collection card actions section (currently has "View Collection" and "Request Access")

Replace/modify existing buttons:
```tsx
<div className="flex items-center gap-3 pt-4 border-t border-neutral-100">
  <Button
    variant="outline"
    size="sm"
    className="rounded-xl font-light border-neutral-200"
    onClick={(e) => {
      e.stopPropagation()
      router.push(`/collectoid/collections/${collection.id}`)
    }}
  >
    View Collection
  </Button>
  <Button
    size="sm"
    onClick={(e) => {
      e.stopPropagation()
      toggleCollection(collection.id)
    }}
    className={cn(
      "rounded-xl font-light transition-all flex-1",
      selectedCollections.has(collection.id)
        ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
        : cn("bg-gradient-to-r text-white shadow-md hover:shadow-lg",
             scheme.from, scheme.to)
    )}
  >
    {selectedCollections.has(collection.id) ? (
      <>
        <Check className="size-4 mr-1" />
        Added to Request
      </>
    ) : (
      <>
        <Plus className="size-4 mr-1" />
        Add to Request
      </>
    )}
  </Button>
</div>
```

**Visual States:**
- Unselected: Gradient background, "Add to Request"
- Selected: Gray background, "Added to Request" with checkmark
- Hover: Shadow elevation change

#### 3.3 Dataset Card "Add to Request" Button
Same pattern as collections:
```tsx
<Button
  size="sm"
  onClick={() => toggleDataset(dataset.code)}
  className={cn(
    "rounded-xl font-light transition-all",
    selectedDatasets.has(dataset.code)
      ? "bg-neutral-200 text-neutral-700 hover:bg-neutral-300"
      : cn("bg-gradient-to-r text-white shadow-md hover:shadow-lg",
           scheme.from, scheme.to)
  )}
>
  {selectedDatasets.has(dataset.code) ? (
    <>
      <Check className="size-4 mr-1" />
      Added
    </>
  ) : (
    <>
      <Plus className="size-4 mr-1" />
      Add to Request
    </>
  )}
</Button>
```

---

## Phase 4: Enhanced Collection Cards with Rich Metadata

### Goal
Show more detailed information in collection cards to help decision-making.

### Reference
Filters page dataset cards (lines 1770-1873)

### Features to Add

#### 4.1 Access Breakdown Visualization
**Location**: After description, before actions

```tsx
{/* Access Breakdown */}
<div className="mb-3">
  <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">
    Access Eligibility
  </p>
  <div className="flex items-center gap-2">
    <div className="flex-1 bg-neutral-100 rounded-full h-2 overflow-hidden">
      <div className="flex h-full">
        <div className="bg-green-500"
             style={{ width: `20%` }}
             title="Already Open: 20%" />
        <div className={cn("bg-gradient-to-r", scheme.from, scheme.to)}
             style={{ width: `30%` }}
             title="Awaiting Policy: 30%" />
        <div className="bg-amber-500"
             style={{ width: `40%` }}
             title="Needs Approval: 40%" />
        <div className="bg-neutral-400"
             style={{ width: `10%` }}
             title="Missing Location: 10%" />
      </div>
    </div>
  </div>
  <div className="flex items-center justify-between text-xs font-light text-neutral-600 mt-1">
    <span>50% instant access</span>
    <span>40% needs approval</span>
  </div>
</div>
```

#### 4.2 Dataset Preview
**Location**: After intent badges, before access breakdown

```tsx
{/* Dataset Preview */}
<div className="mb-3 p-2.5 rounded-lg bg-neutral-50">
  <p className="text-xs font-light text-neutral-600 mb-2">
    Includes {collection.datasetCount} datasets:
  </p>
  <div className="flex flex-wrap gap-1">
    {collection.previewDatasets?.slice(0, 5).map((code) => (
      <Badge key={code} variant="outline" className="text-xs font-light">
        {code}
      </Badge>
    ))}
    {collection.datasetCount > 5 && (
      <Badge variant="outline" className="text-xs font-light">
        +{collection.datasetCount - 5} more
      </Badge>
    )}
  </div>
</div>
```

**Mock Data Update Needed:**
Add `previewDatasets: string[]` to collection objects

---

## Phase 5: Enhanced Dataset Cards with Rich Metadata

### Goal
Match filters page dataset card richness.

### Reference
Filters page dataset cards (lines 1726-1921)

### Features to Add

#### 5.1 Collection Crossover Display
**Location**: After phase badge, before action button

```tsx
{/* If dataset is in collections */}
{dataset.collections && dataset.collections.length > 0 && (
  <div className={cn("rounded-xl p-2.5 mb-2.5 mt-2",
                     scheme.bg.replace("500", "50"))}>
    <div className="flex items-start gap-2">
      <Layers className={cn("size-4 shrink-0 mt-0.5",
                           scheme.from.replace("from-", "text-"))} />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-normal text-neutral-900 mb-1">
          In {dataset.collections.length} collection
          {dataset.collections.length !== 1 ? "s" : ""}
        </p>
        <div className="flex flex-wrap gap-1">
          {dataset.collections.slice(0, 2).map((collection, i) => (
            <Badge key={i} variant="outline"
                   className="text-xs font-light border-neutral-200">
              {collection}
            </Badge>
          ))}
          {dataset.collections.length > 2 && (
            <Badge variant="outline" className="text-xs font-light">
              +{dataset.collections.length - 2} more
            </Badge>
          )}
        </div>
      </div>
    </div>
  </div>
)}
```

**Mock Data Update Needed:**
Add `collections: string[]` to dataset objects in `MOCK_AI_RESPONSE.additionalDatasets`

#### 5.2 Access Eligibility Breakdown
Similar 4-segment progress bar as shown in Phase 4.1

#### 5.3 Frequently Bundled With
```tsx
{/* Frequently Bundled With */}
{dataset.frequentlyBundledWith && dataset.frequentlyBundledWith.length > 0 && (
  <div className="mb-2">
    <div className="flex items-center gap-2 mb-1.5">
      <Sparkles className="size-3 text-neutral-400" />
      <p className="text-xs font-light text-neutral-600">
        Frequently bundled with:
      </p>
    </div>
    <div className="flex flex-wrap gap-1.5">
      {dataset.frequentlyBundledWith.map((code) => (
        <Badge key={code} variant="outline" className="text-xs font-light">
          {code}
        </Badge>
      ))}
    </div>
  </div>
)}
```

**Mock Data Update Needed:**
Add `frequentlyBundledWith: string[]` to dataset objects

---

## Phase 6: Floating Bottom Selection Bar

### Goal
Create expandable bottom bar showing selections with aggregate stats.

### Reference
Filters page right sticky panel (lines 2029-2219)

### Component Structure

#### 6.1 Collapsed State (Default)
**Height**: 72px
**Appears when**: `totalSelections > 0`

```tsx
{totalSelections > 0 && (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-200
                  shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] transition-all duration-300"
       style={{ height: isBottomBarExpanded ? '400px' : '72px' }}>
    <div className="max-w-[1600px] mx-auto px-12 py-4">
      {/* Collapsed View */}
      {!isBottomBarExpanded && (
        <div className="flex items-center justify-between">
          {/* Left: Count and Icon */}
          <div className="flex items-center gap-4">
            <div className={cn(
              "flex size-10 items-center justify-center rounded-xl bg-gradient-to-r text-white",
              scheme.from, scheme.to
            )}>
              <Database className="size-5" />
            </div>
            <div>
              <p className="text-sm font-normal text-neutral-900">
                {totalSelections} item{totalSelections !== 1 ? 's' : ''} selected
              </p>
              <p className="text-xs font-light text-neutral-500">
                {selectedCollections.size} collections, {selectedDatasets.size} datasets
              </p>
            </div>
          </div>

          {/* Center: Quick Stats */}
          <div className="flex items-center gap-6 text-xs font-light text-neutral-600">
            <div className="flex items-center gap-2">
              <Database className="size-4 text-neutral-400" />
              <span>~{totalEstimatedDatasets} total datasets</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-green-600" />
              <span>{aggregateAccessPercent}% instant access</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSelectedCollections(new Set())
                setSelectedDatasets(new Set())
              }}
              className="rounded-lg font-light text-neutral-600"
            >
              Clear All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBottomBarExpanded(true)}
              className="rounded-lg font-light text-neutral-600"
            >
              <ChevronUp className="size-4 mr-1" />
              Details
            </Button>
            <Button
              onClick={handleContinue}
              className={cn(
                "h-10 px-6 rounded-xl font-light bg-gradient-to-r text-white
                 shadow-md hover:shadow-lg transition-all",
                scheme.from, scheme.to
              )}
            >
              Continue with Request
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Expanded View */}
      {isBottomBarExpanded && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className={cn(
                "flex size-10 items-center justify-center rounded-xl bg-gradient-to-r text-white",
                scheme.from, scheme.to
              )}>
                <Database className="size-5" />
              </div>
              <div>
                <h3 className="text-base font-normal text-neutral-900">
                  Selected Items
                </h3>
                <p className="text-xs font-light text-neutral-500">
                  Review and manage your selections
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBottomBarExpanded(false)}
              className="rounded-lg font-light"
            >
              <ChevronDown className="size-4 mr-1" />
              Collapse
            </Button>
          </div>

          {/* Aggregate Access Breakdown */}
          {/* ... similar to filters page lines 2050-2093 ... */}

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto space-y-3 mb-4">
            {/* Collections Section */}
            {selectedCollections.size > 0 && (
              <div>
                <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">
                  Collections ({selectedCollections.size})
                </p>
                <div className="space-y-2">
                  {Array.from(selectedCollections).map((collectionId) => {
                    const collection = aiResponse?.collections.find(c => c.id === collectionId)
                    if (!collection) return null
                    return (
                      <div key={collection.id}
                           className="flex items-center justify-between p-3 rounded-xl
                                      bg-neutral-50 group hover:bg-neutral-100">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-normal text-neutral-900 truncate">
                            {collection.name}
                          </p>
                          <p className="text-xs font-light text-neutral-500">
                            {collection.datasetCount} datasets
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleCollection(collection.id)}
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                        >
                          <X className="size-4 text-neutral-500 hover:text-red-600" />
                        </Button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Datasets Section */}
            {selectedDatasets.size > 0 && (
              <div>
                <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">
                  Individual Datasets ({selectedDatasets.size})
                </p>
                <div className="space-y-2">
                  {/* Similar structure as collections */}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCollections(new Set())
                setSelectedDatasets(new Set())
              }}
              className="rounded-xl font-light border-neutral-200"
            >
              Clear All Selections
            </Button>
            <Button
              onClick={handleContinue}
              className={cn(
                "h-12 px-8 rounded-xl font-light bg-gradient-to-r text-white
                 shadow-lg hover:shadow-xl transition-all",
                scheme.from, scheme.to
              )}
            >
              Continue with {totalSelections} Item{totalSelections !== 1 ? 's' : ''}
              <ArrowRight className="size-4 ml-2" />
            </Button>
          </div>
        </div>
      )}
    </div>
  </div>
)}
```

#### 6.2 State Management
```typescript
const [isBottomBarExpanded, setIsBottomBarExpanded] = useState(false)

// Calculate aggregate stats
const totalEstimatedDatasets = useMemo(() => {
  let total = selectedDatasets.size
  selectedCollections.forEach(id => {
    const collection = aiResponse?.collections.find(c => c.id === id)
    if (collection) total += collection.datasetCount
  })
  return total
}, [selectedCollections, selectedDatasets, aiResponse])

const aggregateAccessPercent = useMemo(() => {
  // Calculate weighted average of instant access across all selections
  // ...implementation...
  return 65 // placeholder
}, [selectedCollections, selectedDatasets, aiResponse])
```

#### 6.3 Continue Handler
```typescript
const handleContinue = () => {
  // Save selections to sessionStorage
  if (typeof window !== "undefined") {
    const selections = {
      collections: Array.from(selectedCollections).map(id =>
        aiResponse?.collections.find(c => c.id === id)
      ).filter(Boolean),
      datasets: Array.from(selectedDatasets).map(code =>
        aiResponse?.additionalDatasets.find(d => d.code === code)
      ).filter(Boolean),
      searchQuery: prompt,
      keywords: aiResponse?.keywords || [],
      timestamp: new Date().toISOString()
    }
    sessionStorage.setItem("ai_discovery_selections", JSON.stringify(selections))
  }

  // Navigate to review page
  router.push("/collectoid/discover/ai/review")
}
```

---

## Phase 7: AI Review/Summary Page

### Goal
Create new page that summarizes selections and allows naming the request group.

### New File
`app/collectoid/discover/ai/review/page.tsx`

### Page Structure

```tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useColorScheme } from "@/components/ux12-color-context"
import { cn } from "@/lib/utils"
import {
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Check,
  Loader2,
  Edit,
  Database,
  Layers,
  TrendingUp,
  Lightbulb,
} from "lucide-react"

interface SelectionData {
  collections: any[]
  datasets: any[]
  searchQuery: string
  keywords: string[]
  timestamp: string
}

interface AISummary {
  suggestedName: string
  intent: string
  dataScope: string
  accessSummary: string
  recommendations: string[]
}

export default function AIReviewPage() {
  const { scheme } = useColorScheme()
  const router = useRouter()

  const [selections, setSelections] = useState<SelectionData | null>(null)
  const [aiSummary, setAiSummary] = useState<AISummary | null>(null)
  const [isGenerating, setIsGenerating] = useState(true)
  const [requestName, setRequestName] = useState("")
  const [isEditingName, setIsEditingName] = useState(false)

  useEffect(() => {
    // Load selections from sessionStorage
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("ai_discovery_selections")
      if (!stored) {
        router.push("/collectoid/discover/ai")
        return
      }
      const data = JSON.parse(stored) as SelectionData
      setSelections(data)

      // Simulate AI summary generation
      generateAISummary(data)
    }
  }, [router])

  const generateAISummary = async (data: SelectionData) => {
    setIsGenerating(true)

    // Simulate AI processing 2-3 seconds
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Generate summary based on selections
    const totalDatasets = data.collections.reduce((sum, col) =>
      sum + (col.datasetCount || 0), 0) + data.datasets.length

    const summary: AISummary = {
      suggestedName: generateSmartName(data),
      intent: detectIntent(data),
      dataScope: `${data.collections.length} collections, ${data.datasets.length} individual datasets, ~${totalDatasets} total datasets`,
      accessSummary: calculateAccessSummary(data),
      recommendations: generateRecommendations(data),
    }

    setAiSummary(summary)
    setRequestName(summary.suggestedName)
    setIsGenerating(false)
  }

  const generateSmartName = (data: SelectionData): string => {
    // AI logic to generate name from keywords and selections
    const keywords = data.keywords.slice(0, 3).join(" ")
    return `${keywords} Research Request`
  }

  const detectIntent = (data: SelectionData): string => {
    // Analyze collections for common intents
    return "ML/AI research and external publication"
  }

  const calculateAccessSummary = (data: SelectionData): string => {
    // Calculate access breakdown
    return "Mixed access - 65% instant, 35% requires approval"
  }

  const generateRecommendations = (data: SelectionData): string[] => {
    return [
      "Consider adding DCODE-456 for complete coverage",
      "3 datasets require TALT approval - expect 5-7 day turnaround",
      "All collections include imaging data as requested",
    ]
  }

  const handleSubmit = () => {
    // Save request group to sessionStorage/backend
    const requestGroup = {
      id: `req-${Date.now()}`,
      name: requestName,
      selections,
      summary: aiSummary,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    // In real app, would save to backend
    // For now, save to sessionStorage for "My Requests" page
    const existing = JSON.parse(
      sessionStorage.getItem("my_requests") || "[]"
    )
    existing.unshift(requestGroup)
    sessionStorage.setItem("my_requests", JSON.stringify(existing))

    // Navigate to My Requests
    router.push("/collectoid/requests?new=true")
  }

  if (!selections) {
    return <div>Loading...</div>
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/collectoid/discover/ai")}
          className="rounded-full font-light mb-4"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Discovery
        </Button>

        <div className="flex items-center gap-3 mb-2">
          <div className={cn(
            "flex size-12 items-center justify-center rounded-xl bg-gradient-to-br",
            scheme.from, scheme.to
          )}>
            <Sparkles className="size-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extralight text-neutral-900 tracking-tight">
              Review Your Request
            </h1>
            <p className="text-base font-light text-neutral-600">
              AI has analyzed your selections and generated a summary
            </p>
          </div>
        </div>
      </div>

      {/* AI Summary Card */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden shadow-sm mb-6">
        <CardContent className="p-6">
          {isGenerating ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className={cn(
                  "size-12 mx-auto mb-4 animate-spin",
                  scheme.from.replace("from-", "text-")
                )} />
                <p className="text-sm font-light text-neutral-600">
                  AI is analyzing your selections...
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Suggested Name */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className={cn("size-4",
                    scheme.from.replace("from-", "text-"))} />
                  <p className="text-xs font-light text-neutral-600 uppercase tracking-wider">
                    Suggested Request Name
                  </p>
                </div>
                {isEditingName ? (
                  <div className="flex gap-2">
                    <Input
                      value={requestName}
                      onChange={(e) => setRequestName(e.target.value)}
                      maxLength={100}
                      className="text-lg font-normal"
                    />
                    <Button
                      onClick={() => setIsEditingName(false)}
                      className={cn("rounded-lg", scheme.from.replace("from-", "bg-"))}
                    >
                      <Check className="size-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-normal text-neutral-900 flex-1">
                      {requestName}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingName(true)}
                      className="rounded-lg"
                    >
                      <Edit className="size-4" />
                    </Button>
                  </div>
                )}
                <p className="text-xs font-light text-neutral-500 mt-1">
                  {requestName.length}/100 characters
                </p>
              </div>

              {/* Summary Sections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Data Scope */}
                <div className="p-4 rounded-xl bg-neutral-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Database className="size-4 text-neutral-600" />
                    <p className="text-xs font-normal text-neutral-900">Data Scope</p>
                  </div>
                  <p className="text-sm font-light text-neutral-700">
                    {aiSummary.dataScope}
                  </p>
                </div>

                {/* Intent */}
                <div className="p-4 rounded-xl bg-neutral-50">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="size-4 text-neutral-600" />
                    <p className="text-xs font-normal text-neutral-900">Detected Intent</p>
                  </div>
                  <p className="text-sm font-light text-neutral-700">
                    {aiSummary.intent}
                  </p>
                </div>

                {/* Access Summary */}
                <div className="p-4 rounded-xl bg-neutral-50 md:col-span-2">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="size-4 text-neutral-600" />
                    <p className="text-xs font-normal text-neutral-900">Access Summary</p>
                  </div>
                  <p className="text-sm font-light text-neutral-700">
                    {aiSummary.accessSummary}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              {aiSummary.recommendations.length > 0 && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="size-5 shrink-0 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-normal text-blue-900 mb-2">
                        AI Recommendations
                      </p>
                      <ul className="space-y-1 text-sm font-light text-blue-700">
                        {aiSummary.recommendations.map((rec, i) => (
                          <li key={i}>• {rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Selected Items Review */}
      <Card className="border-neutral-200 rounded-2xl overflow-hidden shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-normal text-neutral-900">
              Selected Items
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/collectoid/discover/ai")}
              className="rounded-lg font-light text-neutral-600"
            >
              <Edit className="size-4 mr-1" />
              Edit Selections
            </Button>
          </div>

          {/* Collections */}
          {selections.collections.length > 0 && (
            <div className="mb-4">
              <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">
                Collections ({selections.collections.length})
              </p>
              <div className="space-y-2">
                {selections.collections.map((collection) => (
                  <div key={collection.id}
                       className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                    <div>
                      <p className="text-sm font-normal text-neutral-900">
                        {collection.name}
                      </p>
                      <p className="text-xs font-light text-neutral-500">
                        {collection.datasetCount} datasets
                      </p>
                    </div>
                    <Badge className={cn("font-light",
                      collection.matchScore >= 90 ? "bg-green-100 text-green-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {collection.matchScore}% match
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Datasets */}
          {selections.datasets.length > 0 && (
            <div>
              <p className="text-xs font-light text-neutral-600 mb-2 uppercase tracking-wider">
                Individual Datasets ({selections.datasets.length})
              </p>
              <div className="space-y-2">
                {selections.datasets.map((dataset) => (
                  <div key={dataset.code}
                       className="flex items-center justify-between p-3 rounded-lg bg-neutral-50">
                    <div>
                      <p className="text-sm font-normal text-neutral-900">
                        {dataset.name}
                      </p>
                      <p className="text-xs font-light text-neutral-500">
                        {dataset.code} • {dataset.phase}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => router.push("/collectoid/discover/ai")}
          className="rounded-xl font-light border-neutral-200"
        >
          <ArrowLeft className="size-4 mr-2" />
          Back to Edit
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!requestName.trim() || isGenerating}
          className={cn(
            "h-12 px-8 rounded-xl font-light shadow-lg hover:shadow-xl transition-all",
            (!requestName.trim() || isGenerating)
              ? "bg-neutral-200 text-neutral-400 cursor-not-allowed"
              : cn("bg-gradient-to-r text-white", scheme.from, scheme.to)
          )}
        >
          Submit Request
          <ArrowRight className="size-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
```

---

## Phase 8: Filter Enhancement

### Goal
Make breakdown panel filters actually filter the results.

### Current State
Filters only affect `filteredDatasets` (individual datasets array).

### Changes Needed

#### 8.1 Update filteredCollections Logic
```typescript
const filteredCollections = useMemo(() => {
  if (!aiResponse) return []

  let filtered = [...aiResponse.collections]

  // Apply My Access filter
  if (showMyAccess) {
    filtered = filtered.filter(col => col.userHasAccess)
  }

  // Apply Open Only filter (instant access = open + ready to grant)
  if (showOpenOnly) {
    // Filter to collections with >50% instant access
    filtered = filtered.filter(col => {
      const instantPercent = (col.accessBreakdown?.alreadyOpen || 0) +
                            (col.accessBreakdown?.readyToGrant || 0)
      return instantPercent > 50
    })
  }

  // Apply Needs Approval filter
  if (showNeedsApproval) {
    filtered = filtered.filter(col => {
      return (col.accessBreakdown?.needsApproval || 0) > 30
    })
  }

  // Apply Smart Filter Active state
  if (!smartFilterActive) {
    // If smart filter is paused, don't apply AI filtering
    // Show all collections regardless of match score
  }

  return filtered
}, [aiResponse, showMyAccess, showOpenOnly, showNeedsApproval, smartFilterActive])
```

#### 8.2 Add Access Breakdown to Mock Collections
Update `MOCK_AI_RESPONSE.collections` to include:
```typescript
accessBreakdown: {
  alreadyOpen: 20,
  readyToGrant: 30,
  needsApproval: 40,
  missingLocation: 10,
}
```

---

## Phase 9: Polish & Enhancements

### 9.1 Empty States
**No Results After Filtering:**
```tsx
{filteredCollections.length === 0 && filteredDatasets.length === 0 && (
  <div className="text-center py-12">
    <Database className="size-12 text-neutral-300 mx-auto mb-3" />
    <p className="text-sm font-normal text-neutral-900 mb-2">
      No items match your filters
    </p>
    <p className="text-xs font-light text-neutral-600 mb-4">
      Try adjusting your filters or clearing them
    </p>
    <Button
      variant="outline"
      onClick={() => {
        setShowOpenOnly(false)
        setShowNeedsApproval(false)
        setShowUncollected(false)
        setShowMyAccess(false)
      }}
      className="rounded-xl font-light"
    >
      Clear All Filters
    </Button>
  </div>
)}
```

### 9.2 Transitions & Animations
```typescript
// Button state transitions
className={cn(
  "transition-all duration-500",
  selected && "bg-neutral-200"
)}

// Bottom bar slide
className="transition-all duration-300 ease-out"
style={{ height: isExpanded ? '400px' : '72px' }}

// Count number animations (using framer-motion or similar)
import { motion } from "framer-motion"

<motion.span
  key={totalSelections}
  initial={{ scale: 1.2, color: scheme.from }}
  animate={{ scale: 1, color: "inherit" }}
  transition={{ duration: 0.3 }}
>
  {totalSelections}
</motion.span>
```

### 9.3 Keyboard Shortcuts
```typescript
useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    // Esc to close bottom bar
    if (e.key === 'Escape' && isBottomBarExpanded) {
      setIsBottomBarExpanded(false)
    }

    // Cmd/Ctrl + K to focus search
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault()
      // Focus search input
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [isBottomBarExpanded])
```

### 9.4 Loading States
```tsx
{isSearching && (
  <div className="grid grid-cols-1 gap-4">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="border-neutral-200 rounded-2xl overflow-hidden">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-neutral-200 rounded w-3/4" />
            <div className="h-3 bg-neutral-200 rounded w-full" />
            <div className="h-3 bg-neutral-200 rounded w-5/6" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)}
```

### 9.5 Click Statistics to Filter
Make breakdown panel statistics interactive:
```typescript
<div
  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
  onClick={() => {
    setShowOpenOnly(!showOpenOnly)
    setShowNeedsApproval(false)
  }}
>
  <Check className="size-4 text-green-600" />
  <div>
    <p className="text-xs font-light text-neutral-500">Instant Access</p>
    <p className="text-lg font-normal text-neutral-900">
      {aiResponse.statistics.alreadyOpen + aiResponse.statistics.readyToGrant}
    </p>
  </div>
</div>
```

---

## Detailed TODO List (Implementation Order)

### Session 1: Smart Discovery (Simplified) ✅ COMPLETED
- [x] 1.1 Rename from "Smart Filter" to "Smart Discovery"
- [x] 1.2 Create always-visible search panel (no collapsing states)
- [x] 1.3 Add textarea with Cmd/Ctrl+Enter shortcut
- [x] 1.4 Show last searched query when different from current input
- [x] 1.5 Add "New Search" and "Clear" buttons
- [x] 1.6 Remove toggle/pause functionality (simplified UX)
- [x] 1.7 Update button text to "Discover Data"

### Session 2: Editable Keywords ✅ COMPLETED
- [x] 2.1 Create keyword badges section below smart filter
- [x] 2.2 Add remove functionality (click badge with X icon)
- [x] 2.3 Add "+ Add Keyword" button
- [x] 2.4 Create keyword input popover/inline
- [x] 2.5 Implement add keyword logic
- [x] 2.6 Update filtering logic to respect keyword changes
- [x] 2.7 Add hover states and transitions

### Session 3: Selection System - Collections ✅ COMPLETED
- [x] 3.1 Add selection state management (selectedCollections Set)
- [x] 3.2 Add toggleCollection function
- [x] 3.3 Update collection card to include "Add to Request" button
- [x] 3.4 Implement button state changes (gradient/gray)
- [x] 3.5 Add icon transitions (Plus → Check)
- [x] 3.6 Test selection/deselection
- [x] 3.7 Add stopPropagation to prevent card click conflicts

### Session 4: Selection System - Datasets ✅ COMPLETED
- [x] 4.1 Add selection state management (selectedDatasets Set)
- [x] 4.2 Add toggleDataset function
- [x] 4.3 Update dataset cards to include "Add to Request" button
- [x] 4.4 Implement same button state pattern as collections
- [x] 4.5 Test selection/deselection
- [x] 4.6 Calculate total selections count

### Session 5: Collection Card Enhancements ✅ COMPLETED
- [x] 5.1 Add access breakdown visualization to mock data
- [x] 5.2 Create access breakdown progress bar component
- [x] 5.3 Add to collection cards
- [x] 5.4 Add dataset preview section with badges
- [x] 5.5 Update mock data with previewDatasets arrays
- [x] 5.6 Style and position new sections
- [x] 5.7 Test responsiveness

### Session 6: Dataset Card Enhancements ✅ COMPLETED
- [x] 6.1 Add collection crossover to mock datasets
- [x] 6.2 Create collection crossover display component
- [x] 6.3 Add to dataset cards
- [x] 6.4 Add access breakdown visualization
- [x] 6.5 Add "Frequently bundled with" section
- [x] 6.6 Update mock data with frequentlyBundledWith arrays
- [x] 6.7 Style themed backgrounds and icons

### Session 7: Floating Bottom Bar - Structure
- [ ] 7.1 Add isBottomBarExpanded state
- [ ] 7.2 Create fixed bottom positioned container
- [ ] 7.3 Implement conditional rendering (only show when totalSelections > 0)
- [ ] 7.4 Add backdrop shadow styling
- [ ] 7.5 Create collapsed state layout (72px height)
- [ ] 7.6 Add expand/collapse button with ChevronUp/Down
- [ ] 7.7 Test show/hide behavior

### Session 8: Floating Bottom Bar - Collapsed State
- [ ] 8.1 Add icon and selection count display (left side)
- [ ] 8.2 Calculate and show quick stats (center)
- [ ] 8.3 Add "Clear All" button
- [ ] 8.4 Add "Details" button (expands bar)
- [ ] 8.5 Add "Continue with Request" button
- [ ] 8.6 Style and align all elements
- [ ] 8.7 Test all button actions

### Session 9: Floating Bottom Bar - Expanded State
- [ ] 9.1 Create expanded state layout (400px height)
- [ ] 9.2 Add header with title and collapse button
- [ ] 9.3 Calculate aggregate access breakdown
- [ ] 9.4 Create aggregate access visualization
- [ ] 9.5 Add scrollable list container
- [ ] 9.6 Create collections section with mini cards
- [ ] 9.7 Create datasets section with mini cards
- [ ] 9.8 Add hover-to-reveal remove buttons
- [ ] 9.9 Add bottom actions section
- [ ] 9.10 Add smooth height transition (300ms)
- [ ] 9.11 Test expand/collapse animations

### Session 10: Continue Handler & Data Flow
- [ ] 10.1 Calculate totalEstimatedDatasets
- [ ] 10.2 Calculate aggregateAccessPercent
- [ ] 10.3 Create handleContinue function
- [ ] 10.4 Structure selections object for sessionStorage
- [ ] 10.5 Save to sessionStorage
- [ ] 10.6 Implement router.push to review page
- [ ] 10.7 Test data persistence

### Session 11: AI Review Page - Setup
- [ ] 11.1 Create new file: app/collectoid/discover/ai/review/page.tsx
- [ ] 11.2 Set up component structure with imports
- [ ] 11.3 Add state variables (selections, aiSummary, requestName, etc.)
- [ ] 11.4 Create SelectionData and AISummary interfaces
- [ ] 11.5 Implement useEffect to load sessionStorage data
- [ ] 11.6 Add redirect if no data found
- [ ] 11.7 Test page load and data retrieval

### Session 12: AI Review Page - AI Summary Generation
- [ ] 12.1 Create generateAISummary async function
- [ ] 12.2 Add 2.5 second simulated delay
- [ ] 12.3 Implement generateSmartName logic
- [ ] 12.4 Implement detectIntent logic
- [ ] 12.5 Implement calculateAccessSummary logic
- [ ] 12.6 Implement generateRecommendations logic
- [ ] 12.7 Test summary generation with different data

### Session 13: AI Review Page - UI Layout
- [ ] 13.1 Create page header with back button
- [ ] 13.2 Add loading state with Loader2 spinner
- [ ] 13.3 Create AI summary card structure
- [ ] 13.4 Add suggested name section (editable)
- [ ] 13.5 Add name edit mode with Input and Check button
- [ ] 13.6 Add character counter (100 max)
- [ ] 13.7 Create summary sections grid (Data Scope, Intent, Access Summary)
- [ ] 13.8 Add recommendations section with Lightbulb icon
- [ ] 13.9 Style all sections with consistent spacing

### Session 14: AI Review Page - Selected Items Review
- [ ] 14.1 Create selected items review card
- [ ] 14.2 Add header with "Edit Selections" button
- [ ] 14.3 Display collections list with mini cards
- [ ] 14.4 Display datasets list with mini cards
- [ ] 14.5 Add match score badges
- [ ] 14.6 Test edit button navigation
- [ ] 14.7 Style and polish

### Session 15: AI Review Page - Submit & Navigation
- [ ] 15.1 Create handleSubmit function
- [ ] 15.2 Structure requestGroup object
- [ ] 15.3 Save to sessionStorage "my_requests"
- [ ] 15.4 Implement navigation to /collectoid/requests
- [ ] 15.5 Add URL param ?new=true for success message
- [ ] 15.6 Add bottom action buttons (Back, Submit)
- [ ] 15.7 Implement disabled states
- [ ] 15.8 Test end-to-end flow

### Session 16: Filter Enhancement
- [ ] 16.1 Update filteredCollections useMemo
- [ ] 16.2 Add showOpenOnly filter logic for collections
- [ ] 16.3 Add showNeedsApproval filter logic for collections
- [ ] 16.4 Add showMyAccess filter logic for collections
- [ ] 16.5 Add smartFilterActive check
- [ ] 16.6 Update mock data with accessBreakdown for collections
- [ ] 16.7 Test all filter combinations
- [ ] 16.8 Update filter count displays

### Session 17: Polish - Empty States
- [ ] 17.1 Create empty state for no results
- [ ] 17.2 Add Database icon and messaging
- [ ] 17.3 Add "Clear All Filters" button
- [ ] 17.4 Test empty state appearance
- [ ] 17.5 Add empty state for no selections

### Session 18: Polish - Animations & Transitions
- [ ] 18.1 Add button state transitions (500ms)
- [ ] 18.2 Add bottom bar slide animation (300ms)
- [ ] 18.3 Install framer-motion (optional, for count animation)
- [ ] 18.4 Add count number animation on change
- [ ] 18.5 Add badge fade transitions (200ms)
- [ ] 18.6 Add card hover shadow transitions
- [ ] 18.7 Test all animations for smoothness

### Session 19: Polish - Interactive Statistics
- [ ] 19.1 Make statistics in breakdown panel clickable
- [ ] 19.2 Add cursor-pointer and hover states
- [ ] 19.3 Wire up click handlers to toggle filters
- [ ] 19.4 Add visual feedback when statistic is active (border/highlight)
- [ ] 19.5 Test clicking each statistic
- [ ] 19.6 Make bar chart segments clickable
- [ ] 19.7 Add tooltips explaining click behavior

### Session 20: Polish - Keyboard Shortcuts
- [ ] 20.1 Add useEffect for keyboard listener
- [ ] 20.2 Implement Esc to close bottom bar
- [ ] 20.3 Implement Cmd/Ctrl+K to focus search
- [ ] 20.4 Add Space bar for selection (optional)
- [ ] 20.5 Add visual hints for shortcuts (tooltips)
- [ ] 20.6 Test all shortcuts
- [ ] 20.7 Ensure no conflicts with browser shortcuts

### Session 21: Polish - Loading States
- [ ] 21.1 Create skeleton card component
- [ ] 21.2 Show skeleton cards during isSearching
- [ ] 21.3 Add shimmer animation
- [ ] 21.4 Add loading state to breakdown panel
- [ ] 21.5 Add loading state to bottom bar stats
- [ ] 21.6 Test loading states
- [ ] 21.7 Ensure smooth transitions from loading to content

### Session 22: Testing & Bug Fixes
- [ ] 22.1 Test full user flow end-to-end
- [ ] 22.2 Test edge cases (0 selections, all filters active, etc.)
- [ ] 22.3 Test mobile responsiveness (if needed)
- [ ] 22.4 Fix any visual bugs
- [ ] 22.5 Fix any state management bugs
- [ ] 22.6 Optimize performance (useMemo, useCallback)
- [ ] 22.7 Test with different color schemes

### Session 23: Final Polish & Documentation
- [ ] 23.1 Review all styling for consistency
- [ ] 23.2 Ensure all icons are correctly sized
- [ ] 23.3 Check all text for typos
- [ ] 23.4 Add any missing hover states
- [ ] 23.5 Test accessibility (keyboard nav, screen reader labels)
- [ ] 23.6 Add code comments for complex logic
- [ ] 23.7 Update this spec with any changes made during implementation

---

## Mock Data Updates Required

### MOCK_AI_RESPONSE.collections
Add to each collection object:
```typescript
{
  // ... existing fields ...
  accessBreakdown: {
    alreadyOpen: 20,
    readyToGrant: 30,
    needsApproval: 40,
    missingLocation: 10,
  },
  previewDatasets: ["DCODE-101", "DCODE-102", "DCODE-103", "DCODE-104", "DCODE-105"],
  userHasAccess: false, // or true for testing
}
```

### MOCK_AI_RESPONSE.additionalDatasets
Add to each dataset object:
```typescript
{
  // ... existing fields ...
  collections: ["Oncology ctDNA Outcomes Collection", "Lung Cancer Biomarker Studies"], // or []
  accessBreakdown: {
    alreadyOpen: 15,
    readyToGrant: 35,
    needsApproval: 45,
    missingLocation: 5,
  },
  frequentlyBundledWith: ["DCODE-299", "DCODE-334"], // or []
}
```

---

## Files to Create/Modify

### Files to Modify:
1. **app/collectoid/discover/ai/page.tsx** (main enhancements)
   - ~800-1000 lines of changes
   - New states, components, and logic

### Files to Create:
1. **app/collectoid/discover/ai/review/page.tsx** (new review page)
   - ~400-500 lines
   - Complete new page component

### Optional Files (for organization):
- **components/discover/SelectionBottomBar.tsx** (extract bottom bar to separate component)
- **components/discover/AIReviewSummary.tsx** (extract summary sections)
- **lib/ai-summary-generator.ts** (extract AI logic to utility functions)

---

## Success Criteria

### Phase Completion Checklist:
- [ ] Smart filter can be edited, toggled, and cleared
- [ ] Keywords can be removed and added
- [ ] Collections can be selected/deselected with visual feedback
- [ ] Datasets can be selected/deselected with visual feedback
- [ ] Collection cards show access breakdown and dataset preview
- [ ] Dataset cards show collection crossover and recommendations
- [ ] Bottom bar appears when selections > 0
- [ ] Bottom bar can expand/collapse smoothly
- [ ] Bottom bar shows accurate aggregate statistics
- [ ] Continue button saves data and navigates correctly
- [ ] Review page loads selections from sessionStorage
- [ ] Review page generates AI summary with 2-3s delay
- [ ] Request name is editable with character limit
- [ ] Submit button saves request and navigates to My Requests
- [ ] All filters work correctly on both collections and datasets
- [ ] Empty states display correctly
- [ ] Animations are smooth (no janky transitions)
- [ ] Keyboard shortcuts work
- [ ] Loading states display correctly

### User Experience Goals:
- [ ] User can easily discover and select data
- [ ] User understands what they're selecting (rich metadata)
- [ ] User can refine their search (keywords, filters)
- [ ] User gets feedback on selections (bottom bar stats)
- [ ] User gets AI assistance (summary, recommendations, naming)
- [ ] User can organize requests (named groupings)
- [ ] Flow feels polished and professional

---

## Notes for Implementation

### State Management Tips:
- Use `Set<string>` for selections (O(1) lookups)
- Use `useMemo` for expensive calculations (aggregate stats)
- Debounce keyword input if needed
- Consider lifting state if components get too complex

### Performance Considerations:
- Mock data is small, no virtualization needed
- Memoize filtered arrays
- Use React.memo for bottom bar if it re-renders too often
- Keep animations under 500ms for responsiveness

### Testing Strategy:
- Test each phase independently
- Test edge cases (0 selections, all filtered out, etc.)
- Test with different mock data variations
- Test keyboard navigation
- Test mobile (if responsive design needed)

### Styling Consistency:
- Follow filters page patterns exactly
- Use same spacing (gap-2, gap-3, gap-4, etc.)
- Use same font weights (font-light, font-normal)
- Use same icon sizes (size-4, size-5)
- Use same border radius (rounded-xl, rounded-2xl)
- Use same color patterns (neutral-50, neutral-200, etc.)

---

## Future Enhancements (Post-Implementation)

### Potential Phase 24+:
- Star/favorite collections (separate from selection)
- Recently viewed history
- Save search queries
- Share request groups with team
- Bulk operations (select all on page, deselect all)
- Advanced filtering (date ranges, data quality scores)
- Export request summary as PDF
- Request templates/presets
- Notification when request is approved
- Real-time collaboration (see what teammates are requesting)

---

**End of Specification**
# Agreement of Terms (AoT) Integration into DCM Collection Creation Flow

**Created:** 2025-11-20
**Status:** Ready for Implementation
**Target:** `/app/poc/2/` DCM creation workflow

---

## Overview

Add a new **Agreement of Terms (AoT) specification step** after Activities selection (becoming Step 5 of 8), where DCMs define data use terms and restrictions. The system will auto-suggest AoT based on selected activities and datasets, detect conflicts between dataset restrictions and defined AoT, and include user scope assignment within the AoT step.

---

## Design Decisions (Confirmed)

Based on user input:

1. **Flow Position:** New step after Activities (Step 5)
   - User has selected datasets and activities → perfect context for AoT
   - Allows highlighting conflicts between dataset metadata and defined AoT
   - Provides ability to go back and modify dataset selection if conflicts arise

2. **AoT Generation:** Auto-suggest based on activities & datasets
   - AI analyzes selected activities and dataset metadata
   - Pre-populates AoT checkboxes intelligently
   - User can refine and override all suggestions

3. **Conflict Detection:** Multi-layered approach
   - Check dataset metadata for AoT restrictions
   - Show warning but allow override (not blocking)
   - Require explicit acknowledgment checkbox to proceed

4. **User Scope:** Merge into AoT step
   - Move user assignment from Details step into AoT
   - User scope becomes part of Agreement of Terms definition
   - Simplifies Details step to just name/description

---

## Current DCM Flow (7 Steps)

**Before AoT Integration:**

1. **Intent** (`/dcm/create/`) - Natural language description
2. **Categories** (`/dcm/create/categories/`) - AI suggests data categories
3. **Filters** (`/dcm/create/filters/`) - Multi-dimensional dataset selection
4. **Activities** (`/dcm/create/activities/`) - Define usage intent (engineering vs. analysis)
5. **Details** (`/dcm/create/details/`) - Name, description, **user assignment**
6. **Review** (`/dcm/create/review/`) - Access provisioning breakdown
7. **Publishing** (`/dcm/create/publishing/`) - Collectoid automation

---

## Updated DCM Flow (8 Steps)

**After AoT Integration:**

1. **Intent** - Natural language description *(unchanged)*
2. **Categories** - AI suggests data categories *(unchanged)*
3. **Filters** - Multi-dimensional dataset selection *(unchanged)*
4. **Activities** - Define usage intent *(unchanged)*
5. **🆕 Agreement of Terms** - Define data use restrictions & user scope *(NEW)*
6. **Details** - Name and description only *(simplified)*
7. **Review** - Access provisioning + AoT summary *(enhanced)*
8. **Publishing** - Collectoid automation *(unchanged)*

---

## Data Model Extensions

### 1. Dataset AoT Metadata

**File:** `/lib/dcm-mock-data.ts`

**Add to `Dataset` interface:**

```typescript
export interface Dataset {
  // ... existing fields ...

  // NEW: AoT metadata (restrictions required by this dataset)
  aotMetadata?: {
    // Restrictions (if true, collection AoT MUST enforce this)
    restrictML?: boolean              // Must restrict AI/ML use
    restrictPublication?: boolean     // Must restrict external publication
    restrictSoftwareDev?: boolean     // Must restrict software development
    requirePrimaryUseOnly?: boolean   // Only IMI-guided primary use allowed
    requireLegalReview?: boolean      // Requires TALT legal review

    // Geographic restrictions
    geographicRestrictions?: string[] // e.g., ["EU only", "No Asia"]

    // Time restrictions
    embargoUntil?: Date               // Data cannot be used until this date

    // Collaboration restrictions
    externalSharingAllowed?: boolean  // Can be shared with 3rd parties

    // Notes
    restrictionReason?: string        // Why these restrictions exist
  }
}
```

### 2. Agreement of Terms Interface

**File:** `/lib/dcm-mock-data.ts`

**Add new interface:**

```typescript
export interface AgreementOfTerms {
  id: string
  version: string

  // Primary use categories (IMI-guided protocol)
  primaryUse: {
    understandDrugMechanism: boolean    // Understand how drugs work in the body
    understandDisease: boolean          // Better understand disease and health problems
    developDiagnosticTests: boolean     // Develop diagnostic tests for disease
    learnFromPastStudies: boolean       // Learn from past studies to plan new studies
    improveAnalysisMethods: boolean     // Improve scientific analysis methods
  }

  // Beyond primary use
  beyondPrimaryUse: {
    aiResearch: boolean                 // AI research / AI model training
    softwareDevelopment: boolean        // Software development and testing
  }

  // Publication
  publication: {
    internalCompanyRestricted: boolean  // Internal 'company restricted' findings
    externalPublication: boolean | "by_exception" // External publication
  }

  // External sharing
  externalSharing: {
    allowed: boolean
    process?: string                    // Description of external sharing process
  }

  // User scope (moved from Details step)
  userScope: {
    byDepartment?: string[]             // Workday org IDs
    byRole?: string[]                   // Job roles (Data Scientist, Engineer, etc.)
    explicitUsers?: string[]            // Individual PRIDs
    totalUserCount: number              // Calculated total
  }

  // AI suggestion metadata
  aiSuggested: boolean                  // Was this auto-suggested?
  userModified: string[]                // Which fields user manually changed

  // Conflict tracking
  acknowledgedConflicts?: {
    datasetId: string
    datasetName: string
    conflictDescription: string
    acknowledgedAt: Date
    acknowledgedBy: string
  }[]

  // Metadata
  createdAt: Date
  createdBy: string
  effectiveDate?: Date
  reviewDate?: Date
}
```

### 3. Collection Interface Update

**File:** `/lib/dcm-mock-data.ts`

**Add to `Collection` interface:**

```typescript
export interface Collection {
  // ... existing fields ...

  // NEW: Agreement of Terms
  agreementOfTerms?: AgreementOfTerms
}
```

---

## New AoT Specification Screen

### Route
`/app/poc/2/dcm/create/agreements/page.tsx`

### Purpose
Allow DCM to define data use terms and restrictions, with AI assistance and conflict detection.

### Screen Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 5 of 8: Agreement of Terms                      [Help ?]  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Define the terms and conditions for data use in this collection│
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 🤖 AI-Suggested Terms                                    │  │
│  │                                                           │  │
│  │ Based on your selected activities and datasets, we       │  │
│  │ recommend the following terms:                           │  │
│  │                                                           │  │
│  │ ✅ Primary use allowed (all categories)                  │  │
│  │ ✅ AI/ML research allowed                                │  │
│  │ ⚠️ Software development restricted (2 datasets require) │  │
│  │ ✅ Internal publication allowed                          │  │
│  │ ⚠️ External publication restricted (5 datasets require) │  │
│  │                                                           │  │
│  │ You can modify any of these below.                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  PRIMARY USE (IMI-Guided Protocol)                              │
│                                                                  │
│  Select all that apply:                                         │
│                                                                  │
│  ☑ Understand how drugs work in the body                       │
│  ☑ Better understand disease and health problems               │
│  ☑ Develop diagnostic tests for disease                        │
│  ☑ Learn from past studies to plan new studies                 │
│  ☑ Improve scientific analysis methods                         │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  BEYOND PRIMARY USE                                             │
│                                                                  │
│  ☑ AI research / AI model training                             │
│  ☐ Software development and testing                            │
│     ⚠️ 2 datasets require this to be restricted                │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  PUBLICATION                                                     │
│                                                                  │
│  ☑ Internal 'company restricted' findings allowed              │
│  ☐ External publication allowed                                │
│     ⚠️ 5 datasets require external publication restriction     │
│                                                                  │
│  Publication approval process:                                  │
│  ( ) Not allowed                                                │
│  (•) By exception only (requires approval)                      │
│  ( ) Allowed with standard process                             │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  EXTERNAL SHARING                                               │
│                                                                  │
│  ☑ External sharing allowed                                    │
│                                                                  │
│  External sharing process:                                      │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Standard External Sharing process applies. Must obtain  │   │
│  │ approval from Alliance Manager and TALT-Legal team.     │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  USER SCOPE                                                     │
│                                                                  │
│  Define who will have access to this collection:               │
│                                                                  │
│  [By Organization] [By Role] [Individual PRIDs]                │
│                                                                  │
│  ┌─ By Organization ────────────────────────────────────────┐  │
│  │                                                            │  │
│  │ Selected Organizations (3):                               │  │
│  │                                                            │  │
│  │ ☑ Oncology Biometrics (45 users)                         │  │
│  │ ☑ Oncology Data Science (60 users)                       │  │
│  │ ☑ Translational Medicine - Oncology (15 users)           │  │
│  │                                                            │  │
│  │ [+ Add Organization]                                       │  │
│  │                                                            │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Total Users: 120                                               │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  ⚠️ DATASET-AOT CONFLICTS DETECTED                             │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ 5 datasets have restrictions that conflict with your     │  │
│  │ defined Agreement of Terms.                               │  │
│  │                                                           │  │
│  │ [View Conflicts ▼]                                        │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Expanded Conflicts Panel]                                     │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ DCODE-042: NSCLC ctDNA Monitoring                        │  │
│  │ Conflict: Dataset requires external publication          │  │
│  │           restriction, but AoT allows external publication│  │
│  │ Required: Restrict external publication                  │  │
│  │ [Remove Dataset] [Adjust AoT]                            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ DCODE-067: Immunotherapy Response                        │  │
│  │ Conflict: Dataset requires software development          │  │
│  │           restriction, but AoT allows software dev        │  │
│  │ Required: Restrict software development                  │  │
│  │ [Remove Dataset] [Adjust AoT]                            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ ... (3 more conflicts)                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ☐ I acknowledge these conflicts and take responsibility for   │
│     proceeding with this Agreement of Terms                    │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  [← Back to Datasets] [Save & Continue →]                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features

#### 1. AI Suggestion Panel (Top)
- Auto-populated based on activities and dataset analysis
- Shows recommended terms with reasoning
- Highlights restrictions suggested due to dataset metadata
- Color-coded:
  - ✅ Green: Recommended to allow
  - ⚠️ Amber: Recommended to restrict (dataset requirements)

#### 2. Editable AoT Checkboxes
- All sections fully editable by user
- Warnings displayed inline if selection conflicts with dataset metadata
- User has full control to override AI suggestions

#### 3. User Scope (Moved from Details)
- Same 3-tab interface (Organization, Role, Individual)
- Shows total user count badge
- Integrated into AoT definition

#### 4. Conflict Detection Panel (Conditional)
- Only appears if conflicts detected
- Collapsible/expandable
- Lists each conflicting dataset:
  - Dataset name and code
  - Description of conflict
  - What restriction is required
  - Quick actions: [Remove Dataset] or [Adjust AoT]
- Mandatory acknowledgment checkbox to proceed
- Option to go back to dataset selection

#### 5. Navigation
- **[← Back to Datasets]** - Returns to Filters step to modify selection
- **[Save & Continue]** - Proceeds to Details step (disabled if conflicts exist and not acknowledged)

---

## AoT Auto-Suggestion Logic

### Function Specification

```typescript
/**
 * Suggests Agreement of Terms based on selected activities and datasets
 *
 * @param activities - Selected activities from Step 4
 * @param datasets - Selected datasets from Step 3
 * @returns Suggested AgreementOfTerms object
 */
function suggestAoT(
  activities: Activity[],
  datasets: Dataset[]
): AgreementOfTerms {

  // Analyze activities for intent
  const hasMLActivity = activities.some(a =>
    a.id.includes('ml') ||
    a.id.includes('ai') ||
    a.name.toLowerCase().includes('classifier')
  )

  const hasSoftwareDevActivity = activities.some(a =>
    a.name.toLowerCase().includes('software') ||
    a.name.toLowerCase().includes('development')
  )

  const hasAnalysisActivity = activities.some(a =>
    a.accessLevel.includes('patient-level')
  )

  // Analyze datasets for restrictions
  const datasetsRestrictML = datasets.filter(d =>
    d.aotMetadata?.restrictML
  )

  const datasetsRestrictPublication = datasets.filter(d =>
    d.aotMetadata?.restrictPublication
  )

  const datasetsRestrictSoftwareDev = datasets.filter(d =>
    d.aotMetadata?.restrictSoftwareDev
  )

  const requiresPrimaryUseOnly = datasets.some(d =>
    d.aotMetadata?.requirePrimaryUseOnly
  )

  // Generate suggestions
  return {
    id: generateId(),
    version: '1.0',

    // Primary use - default to all allowed unless restricted
    primaryUse: {
      understandDrugMechanism: true,
      understandDisease: true,
      developDiagnosticTests: true,
      learnFromPastStudies: true,
      improveAnalysisMethods: true
    },

    // Beyond primary use - conditional on activities and restrictions
    beyondPrimaryUse: {
      aiResearch: hasMLActivity && datasetsRestrictML.length === 0,
      softwareDevelopment: hasSoftwareDevActivity && datasetsRestrictSoftwareDev.length === 0
    },

    // Publication - conservative default, allow if no restrictions
    publication: {
      internalCompanyRestricted: true, // always allow internal
      externalPublication: datasetsRestrictPublication.length === 0 ? true : 'by_exception'
    },

    // External sharing - default to allowed with process
    externalSharing: {
      allowed: true,
      process: 'Standard External Sharing process applies'
    },

    // User scope - empty, user must define
    userScope: {
      totalUserCount: 0
    },

    // Metadata
    aiSuggested: true,
    userModified: [],
    createdAt: new Date(),
    createdBy: 'system'
  }
}
```

### Suggestion Display

When showing AI suggestions, highlight:
- ✅ **Green check** - Recommended to allow (no conflicts)
- ⚠️ **Amber warning** - Recommended to restrict (X datasets require)

Example:
```
✅ AI/ML research allowed
⚠️ Software development restricted (2 datasets require this restriction)
⚠️ External publication restricted (5 datasets require this restriction)
```

---

## Conflict Detection Logic

### Function Specification

```typescript
/**
 * Detects conflicts between defined AoT and dataset restrictions
 *
 * @param aot - User-defined Agreement of Terms
 * @param datasets - Selected datasets
 * @returns Array of conflicts
 */
function detectAoTConflicts(
  aot: AgreementOfTerms,
  datasets: Dataset[]
): AoTConflict[] {

  const conflicts: AoTConflict[] = []

  for (const dataset of datasets) {
    if (!dataset.aotMetadata) continue

    // Check ML restriction
    if (dataset.aotMetadata.restrictML && aot.beyondPrimaryUse.aiResearch) {
      conflicts.push({
        datasetId: dataset.id,
        datasetName: dataset.name,
        datasetCode: dataset.code,
        conflictType: 'ai_research',
        conflictDescription: 'Dataset requires AI/ML restriction, but AoT allows AI research',
        requiredAction: 'Restrict AI/ML research in AoT',
        severity: 'high'
      })
    }

    // Check software dev restriction
    if (dataset.aotMetadata.restrictSoftwareDev && aot.beyondPrimaryUse.softwareDevelopment) {
      conflicts.push({
        datasetId: dataset.id,
        datasetName: dataset.name,
        datasetCode: dataset.code,
        conflictType: 'software_development',
        conflictDescription: 'Dataset requires software development restriction, but AoT allows software dev',
        requiredAction: 'Restrict software development in AoT',
        severity: 'high'
      })
    }

    // Check publication restriction
    if (dataset.aotMetadata.restrictPublication && aot.publication.externalPublication === true) {
      conflicts.push({
        datasetId: dataset.id,
        datasetName: dataset.name,
        datasetCode: dataset.code,
        conflictType: 'external_publication',
        conflictDescription: 'Dataset requires external publication restriction, but AoT allows external publication',
        requiredAction: 'Restrict external publication or set to "by exception"',
        severity: 'high'
      })
    }

    // Check primary use only requirement
    if (dataset.aotMetadata.requirePrimaryUseOnly) {
      if (aot.beyondPrimaryUse.aiResearch || aot.beyondPrimaryUse.softwareDevelopment) {
        conflicts.push({
          datasetId: dataset.id,
          datasetName: dataset.name,
          datasetCode: dataset.code,
          conflictType: 'primary_use_only',
          conflictDescription: 'Dataset allows only primary use, but AoT enables beyond-primary-use activities',
          requiredAction: 'Disable all beyond-primary-use options in AoT',
          severity: 'critical'
        })
      }
    }
  }

  return conflicts
}

interface AoTConflict {
  datasetId: string
  datasetName: string
  datasetCode: string
  conflictType: 'ai_research' | 'software_development' | 'external_publication' | 'primary_use_only'
  conflictDescription: string
  requiredAction: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}
```

### Conflict Display

Show conflicts in expandable panel:

```
⚠️ DATASET-AOT CONFLICTS DETECTED

5 datasets have restrictions that conflict with your defined Agreement of Terms.

[View Conflicts ▼]

┌─────────────────────────────────────────────────────────┐
│ DCODE-042: NSCLC ctDNA Monitoring                      │
│ Conflict: Dataset requires external publication        │
│           restriction, but AoT allows external pub      │
│ Required: Restrict external publication                │
│ [Remove Dataset] [Adjust AoT to Restrict]              │
├─────────────────────────────────────────────────────────┤
│ DCODE-067: Immunotherapy Response                      │
│ ...                                                     │
└─────────────────────────────────────────────────────────┘

☐ I acknowledge these conflicts and take responsibility for
   proceeding with this Agreement of Terms
```

### Conflict Resolution Options

For each conflict, user can:
1. **[Remove Dataset]** - Quick action to remove conflicting dataset from collection
2. **[Adjust AoT]** - Quick action to auto-adjust AoT to match dataset requirement
3. **Acknowledge** - Check box to proceed anyway (takes DCM responsibility)
4. **[← Back to Datasets]** - Return to Filters step to refine selection

---

## Updated Details Step

### File
`/app/poc/2/dcm/create/details/page.tsx`

### Changes

**Remove:**
- User assignment UI (moved to AoT step)
- Tab interface for org/role/individual selection

**Keep:**
- Collection name (required)
- Description (required)
- Target user community (optional)

**Add:**
- AoT summary display (read-only badges)
- Link to edit AoT if needed

### New Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Step 6 of 8: Collection Details                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  Collection Name *                                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Oncology ctDNA Outcomes Collection                         │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Description *                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Curated collection of Phase III lung cancer studies with   │ │
│  │ ctDNA biomarker monitoring and immunotherapy treatment...  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  Target User Community (optional)                               │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Oncology Data Scientists and Biostatisticians studying     │ │
│  │ immunotherapy response and ctDNA dynamics                  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  AGREEMENT OF TERMS SUMMARY                                     │
│                                                                  │
│  Allowed Uses:                                                  │
│  ML/AI ✅ | Software Dev ❌ | Internal Pub ✅ | External Pub ⚠️ │
│                                                                  │
│  User Scope: 120 users (3 organizations)                       │
│                                                                  │
│  [Edit Agreement of Terms]                                      │
│                                                                  │
│  ═══════════════════════════════════════════════════════════════│
│                                                                  │
│  [← Back] [Continue to Review →]                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Updated Review Step

### File
`/app/poc/2/dcm/create/review/page.tsx`

### Changes

**Add new section:** Agreement of Terms summary (full detail)

### New Section Layout

```
═══════════════════════════════════════════════════════════════
AGREEMENT OF TERMS

Primary Use:
✅ Understand how drugs work in the body
✅ Better understand disease and health problems
✅ Develop diagnostic tests for disease
✅ Learn from past studies to plan new studies
✅ Improve scientific analysis methods

Beyond Primary Use:
✅ AI research / AI model training
❌ Software development and testing

Publication:
✅ Internal 'company restricted' findings
⚠️ External publication (by exception only)

External Sharing:
✅ Allowed (standard process applies)

User Scope:
120 users across 3 organizations:
• Oncology Biometrics (45 users)
• Oncology Data Science (60 users)
• Translational Medicine - Oncology (15 users)

⚠️ Acknowledged Conflicts: 5 datasets
[View Conflict Details]

[Edit Agreement of Terms]

═══════════════════════════════════════════════════════════════
```

---

## Mock Data Requirements

### Dataset AoT Metadata

**File:** `/lib/dcm-mock-data.ts`

Create 50-100 datasets with varied `aotMetadata`:

**Examples:**

```typescript
// Dataset requiring ML restriction
{
  id: 'ds-042',
  code: 'DCODE-042',
  name: 'NSCLC ctDNA Monitoring',
  aotMetadata: {
    restrictML: true,
    restrictPublication: true,
    restrictionReason: 'Ongoing trial, competitive sensitivity'
  }
}

// Dataset requiring primary use only
{
  id: 'ds-067',
  code: 'DCODE-067',
  name: 'Immunotherapy Response',
  aotMetadata: {
    requirePrimaryUseOnly: true,
    restrictSoftwareDev: true,
    restrictionReason: 'Alliance partner data, protocol restrictions apply'
  }
}

// Dataset with no restrictions
{
  id: 'ds-001',
  code: 'DCODE-001',
  name: 'NSCLC Genomic Profiling',
  aotMetadata: {
    // No restrictions, can be used for anything
  }
}

// Dataset with geographic restriction
{
  id: 'ds-223',
  code: 'DCODE-223',
  name: 'Multi-Regional Study',
  aotMetadata: {
    geographicRestrictions: ['EU data only - GDPR restricted'],
    requireLegalReview: true,
    restrictionReason: 'GDPR compliance required for EU sites'
  }
}
```

### Distribution Recommendation

- 30% - No restrictions
- 30% - Restrict publication only
- 20% - Restrict ML/AI only
- 10% - Primary use only
- 10% - Multiple restrictions (publication + ML + software dev)

---

## Navigation Flow Updates

### Update All Steps

**Files to modify:**
1. `/app/poc/2/dcm/create/page.tsx` - Step 1
2. `/app/poc/2/dcm/create/categories/page.tsx` - Step 2
3. `/app/poc/2/dcm/create/filters/page.tsx` - Step 3
4. `/app/poc/2/dcm/create/activities/page.tsx` - Step 4
5. `/app/poc/2/dcm/create/agreements/page.tsx` - Step 5 (NEW)
6. `/app/poc/2/dcm/create/details/page.tsx` - Step 6 (updated from 5)
7. `/app/poc/2/dcm/create/review/page.tsx` - Step 7 (updated from 6)
8. `/app/poc/2/dcm/create/publishing/page.tsx` - Step 8 (updated from 7)

### Update Elements

**In each file:**

1. **Progress indicator:** Update "Step X of 7" → "Step X of 8"
2. **Breadcrumb navigation:** Update step labels and links
3. **Next button:** Update route to point to new step sequence
4. **sessionStorage keys:** Add `dcm_agreement_of_terms`

---

## SessionStorage Management

### New Key

Add to sessionStorage:

```typescript
sessionStorage.setItem('dcm_agreement_of_terms', JSON.stringify(agreementOfTerms))
```

### Retrieve on Review

```typescript
const agreementOfTerms = JSON.parse(
  sessionStorage.getItem('dcm_agreement_of_terms') || '{}'
)
```

### Clear on Publish

```typescript
// In publishing step, after success
sessionStorage.removeItem('dcm_agreement_of_terms')
// ... remove other keys
```

---

## Design System Compliance

### Color Coding

**AoT Suggestions:**
- ✅ Green (`text-green-700`) - Recommended to allow
- ⚠️ Amber (`text-amber-700`) - Recommended to restrict

**Conflicts:**
- Orange/Amber warning panel (`bg-amber-50 border-amber-500`)
- Red for critical severity (`bg-red-50 border-red-500`)

**AoT Summary Badges:**
- Allowed: `bg-green-100 text-green-800`
- Restricted: `bg-red-100 text-red-800`
- By Exception: `bg-amber-100 text-amber-800`

### Typography
- Headers: `font-extralight` or `font-light`
- Body text: `font-light`
- Emphasis: `font-normal`
- Never use `font-bold`

### Spacing & Layout
- Cards: `rounded-xl`
- Modals: `rounded-2xl`
- Buttons: `rounded-full`
- Gap between sections: `gap-6`
- Single-pixel borders

### Icons
- Use `strokeWidth={1.5}` for consistency
- Checkbox icon for conflicts: `AlertTriangle` or `AlertCircle`
- Check icon: `Check` or `CheckCircle2`
- Warning icon: `AlertCircle`

---

## Implementation Phases

### Phase 1: Data Models (Day 1)
- [ ] Add `AgreementOfTerms` interface to `/lib/dcm-mock-data.ts`
- [ ] Add `aotMetadata` to `Dataset` interface
- [ ] Add `agreementOfTerms` to `Collection` interface
- [ ] Create 50-100 mock datasets with varied AoT metadata
- [ ] Implement `suggestAoT()` function
- [ ] Implement `detectAoTConflicts()` function

### Phase 2: AoT Screen (Days 2-3)
- [ ] Create `/app/poc/2/dcm/create/agreements/page.tsx`
- [ ] Implement AI suggestion panel
- [ ] Implement Primary Use checkboxes
- [ ] Implement Beyond Primary Use checkboxes
- [ ] Implement Publication section
- [ ] Implement External Sharing section
- [ ] Implement User Scope (moved from Details)
- [ ] Implement conflict detection panel
- [ ] Implement acknowledgment checkbox
- [ ] Add navigation (back to datasets, continue)

### Phase 3: Update Existing Steps (Day 4)
- [ ] Simplify Details step (remove user assignment)
- [ ] Add AoT summary to Details step
- [ ] Add AoT full display to Review step
- [ ] Update all step numbers (1-8)
- [ ] Update breadcrumb navigation
- [ ] Update progress indicators

### Phase 4: Testing & Polish (Day 5)
- [ ] Test AI suggestion logic with various activity combinations
- [ ] Test conflict detection with various dataset combinations
- [ ] Test acknowledgment flow (can't proceed without checking)
- [ ] Test "go back to datasets" navigation
- [ ] Test user scope assignment
- [ ] Verify all sessionStorage handling
- [ ] Polish animations and transitions
- [ ] Add help content and tooltips

---

## Acceptance Criteria

- [ ] DCM sees AI-suggested AoT based on selected activities and datasets
- [ ] All AoT checkboxes are editable by DCM
- [ ] Warnings appear inline when selection conflicts with dataset metadata
- [ ] Conflict panel appears when datasets conflict with defined AoT
- [ ] Each conflict shows dataset name, description, and required action
- [ ] [Remove Dataset] and [Adjust AoT] quick actions work correctly
- [ ] Acknowledgment checkbox is required to proceed when conflicts exist
- [ ] [← Back to Datasets] navigation works correctly
- [ ] User scope assignment moved to AoT step and functions correctly
- [ ] Details step simplified to name/description only
- [ ] AoT summary appears in Details step (read-only badges)
- [ ] Full AoT display appears in Review step
- [ ] All step numbers updated (1-8)
- [ ] All navigation and breadcrumbs updated
- [ ] SessionStorage handles AoT data correctly
- [ ] Design matches zen aesthetic (font-light, rounded-xl, etc.)

---

## Future Enhancements (Out of Scope)

**Noted for later implementation:**

1. **AoT Templates by Use Case**
   - Pre-defined templates: "ML Research", "Publication-Ready", "Primary Analysis"
   - User selects template as starting point
   - Faster setup for common scenarios

2. **Dataset-Level AoT Override**
   - Allow specific datasets to have different terms within same collection
   - More granular control
   - Complex UX, defer for now

3. **AoT Versioning**
   - Track changes to AoT over time
   - Allow amendment requests from users
   - Version history and change log

4. **Automated AoT Compliance Checking**
   - System monitors data usage against AoT
   - Alerts when violations detected
   - Requires integration with data platforms

5. **AoT Approval Workflow**
   - Route certain AoT configurations through legal/governance review
   - Approval gates before collection creation
   - Integration with approval request system

---

## Related Documentation

**Source Material:**
- `/docs/misc/Agreement of Terms - Ongoing Collection.docx` - AoT structure reference
- `/docs/misc/Ongoing Data Collection - Opt in and Out.docx` - Dataset opt-in/out process
- `/docs/end-user-data-discovery-detailed-spec.md` - End user perspective on AoT

**Design System:**
- `/app/ux/13/design-system/` - UI components and patterns

**Current Implementation:**
- `/app/poc/1/dcm/create/` - Existing 7-step flow (reference)
- `/lib/dcm-mock-data.ts` - Data models and mock data

---

**End of Specification**

Ready for implementation in `/app/poc/2/dcm/create/agreements/`

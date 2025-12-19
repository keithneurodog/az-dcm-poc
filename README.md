# Collectoid UI Prototypes

A Next.js project for prototyping and showcasing UI concepts for the Collectoid clinical trial data access platform.

> **Note:** This project contains mocked UIs only - no backend functionality. It's designed for rapid UX exploration and stakeholder demonstrations.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the prototype index.

---

## Strategic Context

### Why This Exists

AstraZeneca is decommissioning the legacy **AZCt iDAP** (AstraZeneca Clinical trials - integrated Data Access Platform) in 2026. This POC demonstrates a next-generation data access solution called **Collectoid**.

### Two User Types

| User Type | Focus | Description |
|-----------|-------|-------------|
| **DCM (Data Collection Manager)** | PRIMARY (60-70% effort) | Data curators who create, manage, and maintain data collections. Complex workflow involving intelligent discovery, metadata exploration, collection curation, and approval orchestration. |
| **End Users (Researchers)** | SECONDARY (30-40% effort) | Researchers who find and access data for analyses. Simplified workflow: discover, request, access. |

### POC Objectives

1. **DCM Data Curation Workbench** - Demonstrate sophisticated collection curation (NOT simple browse/select)
2. **End User Simplicity** - Show streamlined 90/10 instant access flow
3. **Agentic AI Value** - Demonstrate measurable reduction in manual DCM effort
4. **Concept Validation** - Present multiple UX approaches for stakeholder feedback
5. **2026 Resource Justification** - Provide evidence to secure 2+ developers for production

---

## Project Structure

```
/app
├── page.tsx                      # Landing page - index of all workstreams
├── layout.tsx                    # Root layout (includes IterationSwitcher)
├── globals.css                   # Global styles & CSS variables
│
├── ux/                           # WORKSTREAM: UX Theme Explorations
│   ├── _components/              # UX-specific components (layouts, sidebars, etc.)
│   └── [1-14]/                   # 14 different visual styling concepts
│       ├── home/page.tsx
│       ├── management/page.tsx
│       └── search/page.tsx
│
└── collectoid/                   # WORKSTREAM: DCM Proof of Concept (MAIN FOCUS)
    ├── _components/              # POC-specific components (isolated from UX)
    │   ├── color-context.tsx     # Color scheme provider
    │   ├── notification-context.tsx
    │   ├── variation-context.tsx # Page variation state management
    │   ├── sidebar-context.tsx   # Collapsible sidebar state
    │   ├── notes-context.tsx     # Collaborative annotations
    │   ├── sidebar.tsx
    │   ├── top-bar.tsx
    │   ├── notification-panel.tsx
    │   ├── dev-widget.tsx        # Includes variation selector
    │   └── index.ts              # Barrel export
    ├── layout.tsx                # POC layout
    │
    ├── dcm/                      # DCM (Data Collection Manager) flows
    │   ├── create/               # Multi-step collection creation wizard (8 steps)
    │   │   ├── page.tsx          # Step 1: Intent input
    │   │   ├── categories/       # Step 2: AI-suggested categories
    │   │   ├── filters/          # Step 3: Multi-dimensional filtering
    │   │   ├── activities/       # Step 4: Activities/intents selection
    │   │   ├── agreements/       # Step 5: Agreement of Terms
    │   │   ├── details/          # Step 6: Collection name/description
    │   │   ├── review/           # Step 7: Access provisioning breakdown
    │   │   └── publishing/       # Step 8: Collectoid automation
    │   ├── progress/             # Progress tracking & discussion threads
    │   └── propositions/         # User proposition review
    │
    ├── collections/              # Collection browsing & detail views
    │   └── [id]/                 # Collection detail with customize flow
    │       └── customize/        # Customize collection for user request
    │
    ├── discover/                 # End user data discovery
    │   └── ai/                   # AI-assisted discovery
    │
    ├── requests/                 # Access request management
    │   └── [id]/                 # Individual request tracking
    │
    ├── my-requests/              # User's request dashboard
    └── notifications/            # Notification center

/components
├── ui/                           # shadcn/ui primitives - DO NOT MODIFY
└── iteration-switcher.tsx        # Global component (used by root layout)

/lib
├── dcm-mock-data.ts              # All mock data, interfaces & helper functions
├── analytics-helpers.ts          # Demand metrics, heatmap data, collection suggestions
├── notification-helpers.ts       # Notification utilities
└── utils.ts                      # Tailwind cn() utility

/docs                             # Feature specs & requirements (14 files)
├── collectoid-poc-requirements.md    # Main requirements doc (v2.1)
├── dcm-workflow-learnings.md         # Critical DCM workflow insights
├── end-user-data-discovery-detailed-spec.md
├── aot-integration-dcm-flow-spec.md
└── ... (see /docs for full list)

/hooks                            # Custom React hooks
```

---

## Domain Dictionary

> **Only AstraZeneca-specific and pharmaceutical domain terms are included to minimize token usage.**

### Clinical Data Standards (CDISC)

| Term | Definition |
|------|------------|
| **SDTM** | Study Data Tabulation Model - CDISC standard for organizing clinical trial data into domains (DM, AE, EX, etc.) |
| **ADaM** | Analysis Data Model - CDISC standard for analysis-ready datasets derived from SDTM |
| **RECIST/iRECIST** | Response Evaluation Criteria in Solid Tumors - standardized criteria for measuring tumor response |
| **BOR** | Best Overall Response - best clinical response achieved during treatment (CR/PR/SD/PD) |
| **ECOG** | Eastern Cooperative Oncology Group performance status scale (0-5) |

### Biomarkers & Genomics

| Term | Definition |
|------|------------|
| **ctDNA** | Circulating tumor DNA - tumor-derived DNA fragments in bloodstream used as biomarker |
| **VAF** | Variant Allele Frequency - proportion of sequencing reads containing a specific variant |
| **TMB** | Tumor Mutational Burden - total number of mutations per coding area of tumor genome |
| **MSI** | Microsatellite Instability - condition of genetic hypermutability |
| **HRD** | Homologous Recombination Deficiency - score indicating DNA repair defects |
| **CCF** | Cancer Cell Fraction - proportion of cancer cells carrying a mutation |
| **NGS** | Next-Generation Sequencing - high-throughput DNA sequencing technologies |

### AstraZeneca Systems & Platforms

| Term | Definition |
|------|------------|
| **AZCt iDAP** | AstraZeneca Clinical trials - integrated Data Access Platform (legacy system, decommissioning 2026) |
| **Collectoid** | This POC system - agentic component for data collection management |
| **Immuta** | Policy-based access control and enforcement platform |
| **AiBench** | Legacy system for managing AWS data lake access |
| **Domino/SCP** | End data platforms for researcher access |
| **PRID** | Personnel Record ID - AstraZeneca employee/contractor identifier |
| **Workday** | HR information system (for user/org data) |

### Roles & Approval Teams

| Term | Definition |
|------|------------|
| **DCM** | Data Collection Manager - role responsible for creating and curating data collections |
| **GPT** | Governance Project Team - approval authority for specific therapeutic domains (GPT-Oncology, GPT-Cardiovascular, etc.) |
| **TALT** | Legal/approval team for compliance review |
| **GSP** | Global Safety Program |
| **GCL** | Global Compliance Lead |
| **IA** | Internal Affairs |
| **Alliance Manager** | Partnership management for collaborative data |

### Business Concepts

| Term | Definition |
|------|------------|
| **Agreement of Terms (AoT)** | Data use restrictions defined per collection - specifies allowed uses (ML, publication, external sharing) |
| **90/10 Initiative** | Once data is approved for a user profile, similar users matching that profile gain instant access (target: 90% instant, 10% manual approval) |
| **Collection Crossover** | DCM-specific concept - datasets appearing in multiple collections (important for curation decisions) |
| **EPU** | Extended Primary Use - consent type allowing broader use of clinical trial data |

### Access Provisioning Breakdown (20/30/40/10)

| Category | Description |
|----------|-------------|
| **20% Already Open** | No action needed - data accessible to qualifying users |
| **30% Awaiting Policy** | DCM confirms → Collectoid updates Immuta policy → instant access to 90% of users |
| **40% Blocked, Needs Approval** | DCM creates authorization → routed to GPT/TALT → they approve → Immuta policy written |
| **10% Missing** | Data location unknown OR users haven't completed required training |

### Data Category Taxonomy (30+ Categories)

**Therapeutic Areas:**
- ONC (Oncology), IMMUNONC (Immuno-Oncology), CARDIO (Cardiovascular)
- TA-Neuro (Neurology), TA-Endo (Endocrinology), TA-Infect (Infectious Disease), TA-Immuno (Immunology)

**SDTM Domains:**
- Demographics, Exposure, Tumor/Response Assessment, Biomarker/Laboratory Results
- Adverse Events, Concomitant Medications, Specimen/Procedures

**ADaM Datasets:**
- ADSL (Subject-Level), ADRS/ADEFF (Response/Efficacy), ADTTE (Time-to-Event)
- ADBM/ADLB (Biomarker/Labs), ADEXP (Exposure)

**RAW Data:**
- ctDNA Measures, Specimen Metadata, Assay Metadata, Processing/QC Metrics

**DICOM (Medical Imaging):**
- IDs/Timing, Acquisition Parameters, Quantitative Outputs (MTV, TLG, SUVmax)

**Omics/NGS:**
- Variants (SNVs, indels), Global Scores (TMB, MSI, HRD), Copy Number/Structural Variants
- Sample/Provenance, Pipeline Metadata, QC Metrics, Clonal Dynamics

---

## Key Workflows

### 1. DCM Collection Creation Flow (8 Steps)

```
Intent → Categories → Filters → Activities → Agreements → Details → Review → Publishing
```

| Step | Route | Purpose |
|------|-------|---------|
| 1. Intent | `/dcm/create/` | DCM enters natural language description of collection purpose |
| 2. Categories | `/dcm/create/categories/` | AI extracts keywords and suggests data categories from 30+ taxonomy |
| 3. Filters | `/dcm/create/filters/` | Multi-dimensional filtering (categories, study characteristics, collection context, access criteria) |
| 4. Activities | `/dcm/create/activities/` | Select data engineering vs scientific analysis intents (affects access level) |
| 5. Agreements | `/dcm/create/agreements/` | Define Agreement of Terms (AoT) + user scope + conflict detection |
| 6. Details | `/dcm/create/details/` | Collection name and description |
| 7. Review | `/dcm/create/review/` | Access provisioning breakdown (20/30/40/10) with charts |
| 8. Publishing | `/dcm/create/publishing/` | Collectoid automation - policy generation, approval routing |

### 2. End User Discovery Flow

```
Landing → AI-Assisted or Browse → Collection Detail → Request Access → Confirmation → My Requests
```

| Step | Route | Purpose |
|------|-------|---------|
| Landing | `/collectoid/discover` | Choose AI-assisted search or browse collections |
| AI Discovery | `/collectoid/discover/ai` | Natural language search with AI recommendations |
| Browse | `/collectoid/collections` | Filter collections by TA, intent, access level |
| Detail | `/collectoid/collections/[id]` | View collection, datasets, AoT, personalized access status |
| Request | `/collectoid/collections/[id]/request` | Confirm intent, submit access request |
| Customize | `/collectoid/collections/[id]/customize` | Modify datasets/intents to create custom collection |
| Track | `/collectoid/my-requests` | Track request status, view granted access |

### 3. Approval Workflow

```
Request → DCM Review → GPT/TALT Routing → Approval → Immuta Policy → Access Granted
```

- **Auto-Approval (90/10)**: User matches existing approved profile → instant access
- **Manual Approval**: Request routed to GPT-[TherapeuticArea] or TALT-Legal
- **Collectoid Automation**: Generates Immuta policies, monitors progress, sends notifications

---

## Data Models

> **Source of truth:** `/lib/dcm-mock-data.ts` - All interfaces, mock data, and helper functions are defined here.

### Key Interfaces

| Interface | Purpose |
|-----------|---------|
| `Dataset` | Clinical trial dataset with metadata, categories, access breakdown, collection membership, and AoT restrictions |
| `DataCategory` | Category from 30+ taxonomy (id, name, domain, studyCount, keyVariables) |
| `AgreementOfTerms` | Data use restrictions: primary use, beyond primary use (ML, software dev), publication rights, external sharing, user scope |
| `Collection` | Bundle of datasets with AoT, user scope, and provisioning status |
| `DatasetApprovalRequirement` | Approval needed from specific team (GPT, TALT, etc.) with status |
| `DatasetApprovalAction` | Record of approval/rejection action with actor and comment |
| `AoTConflict` | Conflict between dataset restrictions and collection AoT |

### Key Exports

| Export | Purpose |
|--------|---------|
| `MOCK_DATASETS` | Array of 50+ datasets with full metadata |
| `DATA_CATEGORY_TAXONOMY` | Array of 30+ categories with study counts |
| `KEYWORD_TO_CATEGORIES` | Mapping for AI suggestion simulation |
| `extractKeywordsAndSuggestCategories()` | Simulates AI keyword extraction and category suggestion |

---

## Tech Stack

- **Next.js 15** (App Router with Turbopack)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4** + PostCSS
- **shadcn/ui** (Radix UI-based primitives)
- **Lucide React** (icons)
- **Class Variance Authority** + clsx + tailwind-merge

---

## Key Conventions

### Component Organization Rules

1. **DO NOT modify `/components/ui/`** - These are shadcn/ui components from the registry
2. **Each workstream has isolated components** in `_components/` directories
3. **No shared components between workstreams** - Copy if needed for independence
4. **Global components only** in `/components/` (like `iteration-switcher.tsx`)

### Design System (Zen Aesthetic)

```
Typography:
- font-extralight: Large headings
- font-light: Body text (DEFAULT - never use font-bold)
- font-normal: Emphasis only

Borders & Rounding:
- Cards: rounded-xl
- Modals: rounded-2xl
- Buttons: rounded-full
- Single-pixel borders

Colors (7 Dynamic Palettes):
- Coral, Purple, Teal, Blue, Emerald, Amber, AZ Brand
- Access ColorSchemeProvider via useColorScheme() hook

Status Colors:
- Green (✅): Allowed, instant access, success
- Amber (⚠️): Partial match, by exception, warning
- Red (❌): Restricted, blocked, error

Icons:
- Use strokeWidth={1.5} for consistency
- Import from lucide-react
```

### Import Patterns

```tsx
// POC components - relative from _components
import { ColorSchemeProvider, Sidebar, TopBar } from "./_components"
import { useColorScheme } from "@/app/collectoid/_components"

// shadcn/ui - always use @/components/ui path
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Mock data - from lib
import { MOCK_DATASETS, DATA_CATEGORY_TAXONOMY } from "@/lib/dcm-mock-data"
```

### Mock Data

All mock data lives in `/lib/dcm-mock-data.ts`:
- `MOCK_DATASETS` - 50+ datasets with full metadata
- `DATA_CATEGORY_TAXONOMY` - 30+ categories with study counts
- `KEYWORD_TO_CATEGORIES` - Mapping for AI suggestion simulation
- Helper functions for filtering and suggestions

---

## Commands

```bash
npm run dev       # Start dev server (Turbopack)
npm run build     # Production build
npm run start     # Run production server
npm run lint      # Run ESLint
```

---

## Workstreams

### 1. UX Theme Explorations (`/ux/`)

14 different visual styling concepts exploring various aesthetics:

| # | Name | Description |
|---|------|-------------|
| 1 | Professional Portal | Clean sidebar nav, neutral palette |
| 2 | Bold & Geometric | AZ burgundy/gold, brutal shadows |
| 3 | Data-Focused Professional | Table-based, information-dense |
| 4 | AI-Enhanced Data Explorer | Hybrid of 1 & 3 with AI hero |
| 5 | Friendly Teal Explorer | Warm teal/coral variant of 4 |
| 6 | Modern Glassmorphism | Purple gradients, glass effects |
| 7 | Dark Cyber Command | Neon emerald/cyan dark theme |
| 8 | Minimal Zen | White space, light typography |
| 9 | Vibrant Energy | Bold colors, emoji accents |
| 10 | Executive Suite | Gold accents, serif typography |
| 11 | Premium Vibrant | Executive + Vibrant hybrid |
| 12 | Zen Explorer | Zen + AI hero + color picker |
| 13 | Zen Dual Nav | Zen + sidebar + top bar |
| 14 | Garden Zen | Nature-inspired greens/teals |

Use the **IterationSwitcher** (bottom-right floating widget) to quickly switch between themes.

### 2. DCM POC (`/collectoid/`) - MAIN FOCUS

Full proof-of-concept for the Data Collection Manager workflow. Built on a Zen aesthetic with dynamic color schemes.

Key features:
- Multi-step collection creation wizard (8 steps)
- AI-powered category suggestions from 30+ taxonomy
- Multi-dimensional dynamic filtering with live result counts
- Agreement of Terms (AoT) definition with conflict detection
- Dataset filtering with access provisioning breakdown (20/30/40/10)
- Progress tracking with discussion threads and blockers
- End-user discovery and request flows

---

## Adding a New Workstream

1. **Create directory** under `/app/`:
   ```
   /app/my-new-poc/
   ├── _components/         # POC-specific components
   │   ├── sidebar.tsx
   │   ├── layout-wrapper.tsx
   │   └── index.ts         # Barrel export
   ├── layout.tsx           # POC layout
   └── page.tsx             # Entry point
   ```

2. **Add to landing page** (`/app/page.tsx`)

3. **Create POC-specific components** in `_components/` (copy from other workstreams if needed)

4. **Add mock data** to `lib/dcm-mock-data.ts` or create new file

5. **Document** requirements in `/docs/my-poc-*.md`

---

## Guidelines for Claude Sessions

### Starting a New Session

1. **Read this README first** - contains all essential context
2. **Check `/lib/dcm-mock-data.ts`** for data models and mock data
3. **Use landing page** (`/app/page.tsx`) to understand workstreams
4. **Reference `/docs/`** for detailed feature specs if needed

### When Adding Features

- **Never modify `/components/ui/`** - these are shadcn components
- **Keep components in workstream's `_components/`** directory
- **Copy, don't share** components between workstreams
- **Follow existing patterns** in similar files
- **Add mock data** to support new UI elements
- **Use font-light** for body text (never font-bold)
- **Use rounded-xl** for cards, rounded-full for buttons

### Key Files to Know

| File | Purpose |
|------|---------|
| `/lib/dcm-mock-data.ts` | All mock data and TypeScript interfaces |
| `/app/collectoid/_components/` | Main POC components |
| `/app/collectoid/dcm/create/` | DCM creation wizard (8 steps) |
| `/docs/collectoid-poc-requirements.md` | Detailed requirements (2,200+ lines) |
| `/docs/dcm-workflow-learnings.md` | Critical DCM workflow insights |

### Mock Data Quick Reference

```typescript
// Get all datasets
import { MOCK_DATASETS } from "@/lib/dcm-mock-data"

// Get category taxonomy
import { DATA_CATEGORY_TAXONOMY } from "@/lib/dcm-mock-data"

// AI suggestion simulation
import { extractKeywordsAndSuggestCategories } from "@/lib/dcm-mock-data"
const { keywords, suggestedCategories } = extractKeywordsAndSuggestCategories("oncology ctDNA biomarkers")
```

---

## Key Features (Implementation Status)

### Fully Implemented

| Feature | Route | Description |
|---------|-------|-------------|
| **DCM Collection Wizard** | `/dcm/create/*` | 8-step wizard: Intent → Categories → Filters → Activities → Agreements → Details → Review → Publishing |
| **Progress Dashboard** | `/dcm/progress` | Discussion tab with blockers, help panel, email updates, export reports |
| **Demand Analytics** | `/dcm/analytics` | Heatmap (4 styles), collection suggestions, top datasets table |
| **Collections Browser** | `/collections` | Grid/list views, AoT filtering, 2 variations (v1, v2) |
| **AI Discovery** | `/discover/ai` | LLM prompt search, keyword extraction, 2 variations (standard, datasets) |
| **Request Flow** | `/requests/new/*` | 3-step flow: Intent → Review → Confirmation with timeline transparency |
| **Request Dashboard** | `/requests/[id]` | Multi-collection tracking, discussion, timeline, help tabs |
| **Approval Workflow** | `/dcm/progress` | GPT/TALT approvals with mandatory comments |
| **Notes System** | Global | Right-click annotations with XPath persistence, replies, reactions |
| **Variations System** | Various | `_variations/` pattern for A/B testing UX approaches |
| **Responsive Layout** | Global | Collapsible sidebar at xl breakpoint, responsive grids |

### Partially Implemented (Backlog)

| Feature | Status | Missing |
|---------|--------|---------|
| **Collections Browser** | Partial | Fork/Template/Export actions, date range filter |
| **AI Discovery Page** | Partial | Three-state smart filter, floating bottom bar, AI review page |
| **Collection Crossover** | Not started | Visualization of datasets across collections |

---

## Architecture Patterns

### Variations System

Pages can have multiple UI variations for A/B testing:

```
app/collectoid/discover/ai/
├── page.tsx              # Variation loader
└── _variations/
    ├── index.ts          # Variation registry
    ├── variation-1.tsx   # Default: Collection-focused
    └── variation-datasets.tsx  # Dataset-first view
```

Use the **DevWidget** (bottom-right) to switch variations per route.

### Notes System

Collaborative annotations on any DOM element:
- **Trigger**: Right-click any element → context menu
- **Selection**: Navigate up/down DOM tree to refine target
- **Persistence**: XPath + localStorage (DB-ready structure)
- **Features**: Threaded replies, emoji reactions, per-route filtering

### Access Status Grouping

Dataset Explorer variant groups by access status:
- **Open Access** (emerald) - Instant access, no action needed
- **Awaiting Policy** (blue) - Granted once policy configured
- **Needs Approval** (amber) - Requires GPT/TALT review
- **Missing/Blocked** (neutral) - Data location unknown or training required

---

## Documentation

See `/docs/INDEX.md` for the documentation entry point.

```
/docs/
├── INDEX.md                              # Start here - navigation guide
├── BACKLOG.md                            # Prioritized outstanding work
├── collections-browser-spec.md           # Active: Partial implementation
├── ai-discovery-page-ux-enhancement-spec.md  # Active: Partial implementation
└── _archive/                             # Completed specs (16 files)
```

**Active specs** have outstanding work. **Archived specs** are for reference only.

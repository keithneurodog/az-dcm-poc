# End User Data Discovery: Collections-Aware Approach
## Detailed Implementation Specification

**Created:** 2025-11-20
**Status:** Ready for Implementation
**Approach:** Collections-Aware with Intent-Based Access Control
**Target:** `/app/collectoid/` implementation

---

## Table of Contents
1. [Design Decisions Summary](#design-decisions-summary)
2. [Agreement of Terms (AoT) Integration](#agreement-of-terms-aot-integration)
3. [User Journey Overview](#user-journey-overview)
4. [Detailed Screen Specifications](#detailed-screen-specifications)
5. [Future Features (Not in Initial Scope)](#future-features-not-in-initial-scope)
6. [Data Models](#data-models)
7. [Implementation Notes](#implementation-notes)

---

## Design Decisions Summary

Based on stakeholder input, the following decisions have been made:

### ✅ Confirmed Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| **Primary Approach** | Collections-Aware | Users need to understand collections for collaboration during proposition review |
| **Intent Filtering** | Soft filter (show all, highlight mismatches) | Allow users to see what's possible with different intents, encourage collection modification requests |
| **Multi-Collection Datasets** | Allowed | Datasets can exist in multiple collections with different intent restrictions |
| **Intent Display** | Simple badges (Option A) | Start simple, iterate based on user feedback |
| **Entry Point** | Dual: LLM prompt + Quick filters | Support both exploratory users and power users who know what they want |
| **DCM Intent Control** | Smart suggestions + full override | System suggests restrictions based on dataset metadata, DCM has final say |
| **Data Access** | Single click-through to platform | Dummy links in POC, assume best UX |

### 📋 Agreement of Terms Requirements

Every collection includes an **Agreement of Terms (AoT)** defining:

**1. Terms and Conditions of Use:**
- **Primary use categories** (IMI-guided):
  - ✅ Understand how drugs work in the body
  - ✅ Better understand disease and health problems
  - ✅ Develop diagnostic tests for disease
  - ✅ Learn from past studies to plan new studies
  - ✅ Improve scientific analysis methods

- **Beyond primary use:**
  - AI research / AI model training (Yes/No)
  - Software development and testing (Yes/No)

- **Publication:**
  - Internal 'company restricted' findings (Yes/No)
  - External publication (Yes/No/By exception)

- **External sharing:**
  - Sharing with 3rd party or collaborator (process/restrictions)

**2. User Scope:**
- By department/organization
- By role type (Data Scientist, Engineer, Bioinformatician, Research Scientist)

**3. Data Scope:**
- List of included Data Collections

---

## User Journey Overview

### High-Level Flow

```
Entry Point
    ↓
[Option A: LLM Prompt Search] ← → [Option B: Browse Collections]
    ↓                                       ↓
Dataset/Collection Results              Collection Catalog
    ↓                                       ↓
Filter by Intent (soft filter) ← ← ← ← ← ← ↓
    ↓
Collection Detail View
    ↓
Intent Declaration & Access Check
    ↓
[90/10 Match?] → Yes → Instant Access Granted
    ↓ No
Request Access (creates proposition or adds to collection)
    ↓
Proposition Review (DCM side)
    ↓
Access Granted
```

### User Personas

**Primary End User:** Dr. Sarah Chen
- Role: Data Scientist, Oncology Biometrics
- Need: Find lung cancer ctDNA data for ML-based biomarker prediction
- Intent: AI/ML research, secondary use, publication intended

**Secondary End User:** Dr. Mark Williams
- Role: Research Scientist, Early Oncology Development
- Need: Specific 3 datasets he's worked with before (knows exact DCODEs)
- Intent: Primary use, protocol-guided analysis, no publication

---

## Detailed Screen Specifications

---

## Screen 1: Landing Page / Entry Point

**Route:** `/collectoid/discover` (new page)

**Purpose:** Dual entry point - LLM exploration or quick filter search

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│                     Discover Clinical Data                   │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  Find the data you need to power your research              │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ How would you like to start?                         │  │
│  │                                                       │  │
│  │  ╔════════════════════════════════════════════════╗  │  │
│  │  ║  🤖 AI-Assisted Discovery                      ║  │  │
│  │  ║                                                 ║  │  │
│  │  ║  Describe what you're looking for in natural   ║  │  │
│  │  ║  language and let AI help you find relevant    ║  │  │
│  │  ║  collections and datasets.                      ║  │  │
│  │  ║                                                 ║  │  │
│  │  ║  [Start AI-Assisted Search →]                  ║  │  │
│  │  ╚════════════════════════════════════════════════╝  │  │
│  │                                                       │  │
│  │          ─── OR ───                                   │  │
│  │                                                       │  │
│  │  ╔════════════════════════════════════════════════╗  │  │
│  │  ║  🔍 Browse Collections                         ║  │  │
│  │  ║                                                 ║  │  │
│  │  ║  Explore curated data collections organized    ║  │  │
│  │  ║  by therapeutic area, study type, and intent.  ║  │  │
│  │  ║                                                 ║  │  │
│  │  ║  [Browse Collections →]                        ║  │  │
│  │  ╚════════════════════════════════════════════════╝  │  │
│  │                                                       │  │
│  │  ╔════════════════════════════════════════════════╗  │  │
│  │  ║  ⚡ Quick Search (Power Users)                 ║  │  │
│  │  ║                                                 ║  │  │
│  │  ║  Search by dataset code or keyword:            ║  │  │
│  │  ║  ┌─────────────────────────────────────────┐  ║  │  │
│  │  ║  │ DCODE-042, ctDNA, NSCLC...              │  ║  │  │
│  │  ║  └─────────────────────────────────────────┘  ║  │  │
│  │  ║                                                 ║  │  │
│  │  ╚════════════════════════════════════════════════╝  │  │
│  │                                                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  💡 Not sure where to start? Try the AI-Assisted Discovery  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Interactions

- **[Start AI-Assisted Search]** → Navigate to Screen 2A (LLM Prompt Interface)
- **[Browse Collections]** → Navigate to Screen 2B (Collection Catalog)
- **Quick Search input** → Auto-suggest dropdown, on Enter → Screen 3 (Results)

---

## Screen 2A: AI-Assisted Discovery (LLM Prompt)

**Route:** `/collectoid/discover/ai`

**Purpose:** Natural language data discovery using LLM

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Discovery                                         │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  🤖 AI-Assisted Data Discovery                              │
│                                                              │
│  Tell me what you're looking for, and I'll help you find    │
│  the right data collections and datasets.                   │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 💬 Describe your research needs                        │ │
│  │                                                         │ │
│  │ I need lung cancer data with ctDNA biomarker monitoring│ │
│  │ from immunotherapy trials for ML-based outcome         │ │
│  │ prediction. Planning to publish results.               │ │
│  │                                                         │ │
│  │                                                         │ │
│  │                                              [Send →]  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  💡 Example prompts:                                        │
│  • "Show me oncology studies with genomic profiling data"  │
│  • "I need Phase III cardiovascular trials for ML training"│
│  • "Find imaging data for lung cancer research"            │
│                                                              │
└─────────────────────────────────────────────────────────────┘

[After user sends prompt, AI response appears below:]

┌─────────────────────────────────────────────────────────────┐
│  🤖 Based on your description, I found:                     │
│                                                              │
│  Keywords extracted: lung cancer, ctDNA, biomarker,         │
│  immunotherapy, ML, publication                             │
│                                                              │
│  Relevant Collections (3):                                  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ⭐ Oncology ctDNA Outcomes Collection (Best Match)   │  │
│  │ 16 datasets | 120 users | Allows: ML ✅ Publish ✅  │  │
│  │                                                       │  │
│  │ Curated Phase III lung cancer studies with ctDNA...  │  │
│  │                                                       │  │
│  │ [View Collection] [Request Access]                   │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Immunotherapy Response Collection                    │  │
│  │ 22 datasets | 95 users | Allows: ML ✅ Publish ❌   │  │
│  │                                                       │  │
│  │ ⚠️ Publishing not allowed - request modification?   │  │
│  │                                                       │  │
│  │ [View Collection] [Request with Modification]        │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  Individual Datasets (12 not in above collections):         │
│  • DCODE-299: ctDNA Longitudinal Substudy (Phase III)       │
│  • DCODE-334: NSCLC Biomarker Analysis (Phase II)           │
│  ...                                                         │
│                                                              │
│  [View All Datasets] [Create Custom Collection from These]  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

**AI Processing:**
- Extract keywords from user prompt
- Match to therapeutic areas, data types, study phases
- Identify intended use (ML, publication, primary vs secondary)
- Rank collections by relevance
- Flag intent mismatches (e.g., user wants to publish but collection restricts it)

**Smart Suggestions:**
- "This collection restricts ML use, but you mentioned ML - would you like to request a modification?"
- "I found 12 additional datasets not in any collection - create a custom collection?"

---

## Screen 2B: Browse Collections Catalog

**Route:** `/collectoid/collections` (existing page, enhanced)

**Purpose:** Browse existing collections with filters

### Enhanced Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Collections Catalog                              [+ Create] │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ 🔍 Search collections...                  [Filters ▼]  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌─ Filters (expandable) ──────────────────────────────────┐│
│  │                                                          ││
│  │ Therapeutic Area:                                        ││
│  │ [✓ Oncology] [✓ Cardio] [ ] Immunology [ ] All          ││
│  │                                                          ││
│  │ Allowed Uses (Your Intent):                             ││
│  │ [✓ ML/AI Research] [✓ Publication] [ ] Primary Use      ││
│  │                                                          ││
│  │ Study Phase:                                             ││
│  │ [ ] I  [ ] II  [✓ III  [ ] IV                           ││
│  │                                                          ││
│  │ Access Level:                                            ││
│  │ [✓ Instant Access] [✓ Request Required] [ ] Restricted  ││
│  │                                                          ││
│  │ [Clear Filters]                                          ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  Showing 8 collections                         [Grid] [List]│
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Oncology ctDNA Outcomes Collection                   │  │
│  │ Created by: Divya (DCM) | Nov 11, 2025               │  │
│  │                                                       │  │
│  │ 16 datasets | 120 users | ✅ Matches your intent     │  │
│  │                                                       │  │
│  │ Curated Phase III lung cancer studies with ctDNA     │  │
│  │ biomarker monitoring and immunotherapy treatment...  │  │
│  │                                                       │  │
│  │ Allowed Uses:                                         │  │
│  │ ML/AI ✅ | Publish ✅ | Primary Use ❌                │  │
│  │                                                       │  │
│  │ Your Access: ⚡ 8 instant | ⏳ 8 require approval     │  │
│  │                                                       │  │
│  │ [View Details] [Request Access]                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Immunotherapy Response Collection                    │  │
│  │ Created by: Henry (DCM) | Oct 15, 2025               │  │
│  │                                                       │  │
│  │ 22 datasets | 95 users | ⚠️ Partial intent match     │  │
│  │                                                       │  │
│  │ Comprehensive immunotherapy trial data across        │  │
│  │ multiple therapeutic areas...                         │  │
│  │                                                       │  │
│  │ Allowed Uses:                                         │  │
│  │ ML/AI ✅ | Publish ❌ | Primary Use ✅                │  │
│  │                                                       │  │
│  │ ⚠️ Publishing not allowed for your selected intent   │  │
│  │                                                       │  │
│  │ Your Access: ⚡ 12 instant | ⏳ 10 require approval   │  │
│  │                                                       │  │
│  │ [View Details] [Request with Modification]           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  [Load More Collections...]                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

**Intent-Based Highlighting:**
- ✅ **Green "Matches your intent"** - All selected intents allowed
- ⚠️ **Amber "Partial match"** - Some intents allowed, some restricted
- ❌ **Red "Intent not allowed"** - None of user's intents permitted (still show, allow request for modification)

**Soft Filtering:**
- Don't hide collections that don't match intent
- Show them with clear badges explaining the mismatch
- Offer "Request with Modification" option

**Access Preview:**
- Show personalized access status per user
- "⚡ 8 instant | ⏳ 8 require approval" - based on 90/10 logic for THIS user
- Different users see different numbers

---

## Screen 3: Collection Detail View

**Route:** `/collectoid/collections/[collection-id]`

**Purpose:** Deep dive into collection contents, datasets, and terms

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  ← Back to Collections                                       │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  Oncology ctDNA Outcomes Collection                         │
│  Created by Divya (DCM) | Updated Nov 15, 2025              │
│  120 users | 16 datasets | ✅ Matches your intent           │
│                                                              │
│  [Overview] [Datasets] [Agreement of Terms] [Activity]      │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  📋 COLLECTION OVERVIEW                                     │
│                                                              │
│  Purpose:                                                    │
│  Curated collection of Phase III lung cancer studies with   │
│  ctDNA biomarker monitoring and immunotherapy treatment      │
│  arms. Designed for outcomes research, biomarker analysis,  │
│  and multimodal data fusion.                                │
│                                                              │
│  Target Audience:                                            │
│  Oncology Data Scientists and Biostatisticians studying     │
│  immunotherapy response and ctDNA dynamics                  │
│                                                              │
│  ───────────────────────────────────────────────────────────│
│                                                              │
│  ✅ YOUR ACCESS STATUS                                      │
│                                                              │
│  Based on your role and selected intent:                    │
│                                                              │
│  ▓▓▓▓▓▓▓▓░░░░░░░░ 8 datasets: ⚡ Instant Access             │
│  ▓▓▓▓▓▓▓▓░░░░░░░░ 8 datasets: ⏳ Approval Required          │
│                                                              │
│  Estimated time to full access: 2-3 business days           │
│                                                              │
│  [Request Access to Collection]                             │
│  [Request Access + Customize Datasets]                      │
│                                                              │
│  ───────────────────────────────────────────────────────────│
│                                                              │
│  🎯 ALLOWED USES (Agreement of Terms)                       │
│                                                              │
│  Primary Use (Protocol-Guided):                             │
│  ✅ Understand how drugs work in the body                   │
│  ✅ Better understand disease and health problems           │
│  ✅ Develop diagnostic tests for disease                    │
│  ✅ Learn from past studies to plan new studies             │
│  ✅ Improve scientific analysis methods                     │
│                                                              │
│  Beyond Primary Use:                                         │
│  ✅ AI research / AI model training                         │
│  ❌ Software development and testing                        │
│                                                              │
│  Publication:                                                │
│  ✅ Internal 'company restricted' findings                  │
│  ✅ External publication (with standard process)            │
│                                                              │
│  External Sharing:                                           │
│  ⚠️ Standard External Sharing process applies               │
│                                                              │
│  [View Full Agreement of Terms]                             │
│                                                              │
│  ───────────────────────────────────────────────────────────│
│                                                              │
│  📊 DATASETS IN THIS COLLECTION (16)                        │
│                                                              │
│  [Search datasets...]                   [Filter: All ▼]     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ✅ DCODE-001: NSCLC Genomic Profiling               │  │
│  │ Phase III | 890 patients | Closed 2024              │  │
│  │ Access: ⚡ Instant (already accessible to you)       │  │
│  │ [View Dataset] [Access Data →]                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ ⏳ DCODE-042: NSCLC ctDNA Monitoring                │  │
│  │ Phase III | 1,200 patients | Closed 2024            │  │
│  │ Access: ⏳ Approval required (GPT-Oncology)          │  │
│  │ [View Dataset] [Include in Request]                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ... (14 more datasets)                                     │
│                                                              │
│  [View All Datasets]                                        │
│                                                              │
│  ───────────────────────────────────────────────────────────│
│                                                              │
│  👥 WHO'S USING THIS COLLECTION                             │
│                                                              │
│  120 researchers across 5 organizations:                    │
│  • Oncology Biometrics (45 users)                           │
│  • Oncology Data Science (60 users)                         │
│  • Translational Medicine - Oncology (15 users)             │
│                                                              │
│  Most common activities:                                     │
│  • Biomarker outcome analysis                               │
│  • Immunotherapy response prediction                        │
│  • Multimodal data fusion                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

**Personalized Access Preview:**
- Show user-specific access status (not generic)
- Based on user's role, department, and training status
- Instant vs. approval required breakdown

**Agreement of Terms Visibility:**
- Display allowed uses prominently
- Use simple checkmarks/X icons
- Link to full AoT document

**Dataset List:**
- Each dataset shows individual access status
- Instant access datasets have [Access Data →] button (click-through to platform)
- Approval-required datasets have [Include in Request] checkbox

---

## Screen 4A: Request Access (Simple - Accept Collection As-Is)

**Route:** `/collectoid/collections/[collection-id]/request`

**Purpose:** User requests access to entire collection without modifications

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Request Access to Collection                                │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  Collection: Oncology ctDNA Outcomes Collection             │
│  16 datasets | Your access: 8 instant, 8 require approval   │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  CONFIRM YOUR INTENDED USE                                  │
│                                                              │
│  What will you use this data for? (Select all that apply)   │
│                                                              │
│  Primary Use:                                               │
│  ☑ Understand how drugs work in the body                   │
│  ☑ Better understand disease and health problems           │
│  ☐ Develop diagnostic tests for disease                    │
│  ☐ Learn from past studies to plan new studies             │
│  ☑ Improve scientific analysis methods                     │
│                                                              │
│  Beyond Primary Use:                                         │
│  ☑ AI research / AI model training                         │
│  ☐ Software development and testing                        │
│                                                              │
│  Publication Intent:                                         │
│  ☑ I plan to publish findings internally                   │
│  ☑ I plan to publish findings externally                   │
│  ☐ No publication intended                                 │
│                                                              │
│  ───────────────────────────────────────────────────────────│
│                                                              │
│  Describe your research purpose (required):                 │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ I'm developing an ML-based early response classifier   │ │
│  │ using baseline ctDNA levels and multimodal fusion with │ │
│  │ clinical covariates. Results will be published.        │ │
│  │                                                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Expected duration of access:                               │
│  [12 months ▼]                                              │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  ✅ INTENT CHECK                                            │
│                                                              │
│  Your selected intents match this collection's allowed      │
│  uses. Your request will be processed.                      │
│                                                              │
│  What happens next:                                          │
│  ✅ 8 datasets: Instant access granted immediately          │
│  ⏳ 8 datasets: Approval request sent to GPT-Oncology       │
│     (Est. 2-3 business days)                                │
│                                                              │
│  You will be added to the existing "Oncology ctDNA          │
│  Outcomes Collection" and notified when access is granted.  │
│                                                              │
│  ☑ I agree to the Agreement of Terms for this collection   │
│     [View Agreement of Terms]                               │
│                                                              │
│  [Cancel] [Submit Access Request]                           │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Logic

**Intent Validation:**
- System checks user's selected intents against collection's AoT
- If all intents allowed → ✅ Green "Intent matches" message
- If some intents not allowed → ⚠️ Warning message (see Screen 4B)

**90/10 Matching:**
- System checks if user meets instant access criteria
- Shows personalized breakdown (8 instant, 8 approval for this user)

**Outcome:**
- If user already matches existing collection user scope + 90/10 → Add to existing collection (no proposition)
- If user doesn't match → Creates approval request (lightweight, not full proposition)

---

## Screen 4B: Request Access (Intent Mismatch Warning)

**Scenario:** User's selected intents don't match collection's AoT

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Request Access to Collection                                │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  [... same intent selection as Screen 4A ...]               │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  ⚠️ INTENT MISMATCH DETECTED                                │
│                                                              │
│  Your selected intents include uses not currently allowed   │
│  in this collection:                                         │
│                                                              │
│  ❌ Software development and testing - NOT ALLOWED           │
│                                                              │
│  You have two options:                                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Option 1: Remove restricted intents                    │ │
│  │                                                         │ │
│  │ Uncheck "Software development and testing" above and   │ │
│  │ proceed with access request to this collection.        │ │
│  │                                                         │ │
│  │ [Uncheck Restricted Intents]                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Option 2: Request collection modification             │ │
│  │                                                         │ │
│  │ Request that the DCM modify this collection to allow   │ │
│  │ your intended uses. This will create a proposition     │ │
│  │ for DCM review.                                        │ │
│  │                                                         │ │
│  │ [Request Collection Modification]                      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Option 3: Create custom collection                    │ │
│  │                                                         │ │
│  │ Use this collection as a starting point and create     │ │
│  │ a customized version with different terms. This will   │ │
│  │ create a new collection proposition.                   │ │
│  │                                                         │ │
│  │ [Customize & Create New Collection]                    │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  [Cancel]                                                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Options Explained

**Option 1:** User adjusts their intents to match collection (simplest)

**Option 2:** User requests DCM to modify AoT for existing collection
- Creates a "modification request" (not full proposition)
- DCM can approve/deny the modification
- If approved, all users in collection get expanded intents

**Option 3:** User creates customized version (creates proposition)
- Triggers Screen 5 (Customize Collection)

---

## Screen 5: Customize Collection (Advanced)

**Route:** `/collectoid/collections/[collection-id]/customize`

**Purpose:** Modify dataset selection and/or intents to create custom collection

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Customize Collection                                        │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  Starting from: "Oncology ctDNA Outcomes Collection"        │
│  (16 datasets)                                               │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  STEP 1: MODIFY DATASETS                                    │
│                                                              │
│  [Search datasets in collection...]        [+ Add Datasets] │
│                                                              │
│  Datasets from original collection (16):                    │
│                                                              │
│  ☑ DCODE-001: NSCLC Genomic Profiling                      │
│  ☑ DCODE-042: NSCLC ctDNA Monitoring                       │
│  ☑ DCODE-067: Immunotherapy Response                       │
│  ☐ DCODE-088: Lung Cancer Outcomes       ← Unchecked!      │
│  ☑ ... (12 more)                                            │
│                                                              │
│  [Select All] [Deselect All]                                │
│                                                              │
│  ───────────────────────────────────────────────────────────│
│                                                              │
│  Additional datasets added (0):                             │
│  (none yet)                                                  │
│                                                              │
│  [+ Add Datasets from Catalog]                              │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  STEP 2: DEFINE INTENDED USES                               │
│                                                              │
│  (Same intent checkboxes as Screen 4A)                      │
│                                                              │
│  Your selected intents (including restricted ones):         │
│  ☑ AI research / AI model training                         │
│  ☑ Software development and testing ← Not in original!      │
│  ☑ External publication                                     │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  STEP 3: NAME YOUR CUSTOM COLLECTION                        │
│                                                              │
│  Collection name:                                            │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Oncology ctDNA ML Research (Software Dev Enabled)      │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  Description:                                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Customized version of Oncology ctDNA Outcomes          │ │
│  │ Collection, with software development use enabled      │ │
│  │ for ML pipeline testing and validation.                │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  SUMMARY                                                     │
│                                                              │
│  Your customizations:                                        │
│  • Removed: 1 dataset (DCODE-088)                           │
│  • Added: 0 datasets                                         │
│  • Total: 15 datasets                                        │
│  • New intents: Software development (not in original)      │
│                                                              │
│  This will create a NEW collection proposition that a DCM   │
│  will review and approve. Estimated review time: 3-5 days   │
│                                                              │
│  Link to parent: This collection is derived from "Oncology  │
│  ctDNA Outcomes Collection"                                 │
│                                                              │
│  [Cancel] [Preview Access Breakdown] [Submit Proposition]   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

**Dataset Modification:**
- Uncheck datasets to remove
- [+ Add Datasets] opens modal to browse catalog and add more
- Real-time count of selected datasets

**Intent Expansion:**
- User can select intents beyond original collection's AoT
- System flags new intents clearly
- These become part of proposition for DCM to approve

**Naming:**
- User provides collection name (with suggestion based on original)
- Description field to explain customization rationale

**Preview Access Breakdown:**
- Clicking this shows 20/30/40/10 breakdown for selected datasets (same logic as DCM view)
- Helps user understand complexity of approval

---

## Screen 6: Proposition Submitted (Confirmation)

**Route:** `/collectoid/requests/[request-id]`

**Purpose:** Confirmation after user submits access request or proposition

### Layout (Simple Request - Added to Existing Collection)

```
┌─────────────────────────────────────────────────────────────┐
│  ✓ Access Request Submitted                                 │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  Request ID: REQ-2025-1234                                  │
│  Collection: Oncology ctDNA Outcomes Collection             │
│  Submitted: Nov 20, 2025 at 2:45 PM                         │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  CURRENT STATUS                                             │
│                                                              │
│  ✅ 8 datasets: Instant access GRANTED                      │
│     You can start using this data now.                      │
│     [Access Data →]                                         │
│                                                              │
│  ⏳ 8 datasets: Under review                                │
│     Approval request sent to: GPT-Oncology                  │
│     Estimated approval: Nov 22-23, 2025 (2-3 days)          │
│     You'll receive email notification when approved.        │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  WHAT HAPPENS NEXT                                          │
│                                                              │
│  1. ✅ Instant access granted (completed)                   │
│     You've been added to the "Oncology ctDNA Outcomes       │
│     Collection" for 8 datasets that match 90/10 criteria.   │
│                                                              │
│  2. ⏳ Approval review in progress                           │
│     GPT-Oncology team will review your request for the      │
│     remaining 8 datasets requiring governance approval.     │
│                                                              │
│  3. 📧 You'll receive notifications                         │
│     - Approval granted (expected Nov 22-23)                 │
│     - Full collection access ready                          │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  TRACK YOUR REQUEST                                         │
│                                                              │
│  [Go to My Requests Dashboard]                              │
│  [View Collection Details]                                  │
│  [Start Working with Accessible Data →]                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Layout (Custom Collection Proposition)

```
┌─────────────────────────────────────────────────────────────┐
│  ✓ Collection Proposition Submitted                         │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  Proposition ID: PROP-2025-1234                             │
│  Collection: Oncology ctDNA ML Research (Software Dev...)   │
│  Submitted: Nov 20, 2025 at 2:45 PM                         │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  PROPOSITION STATUS: ⏳ Pending DCM Review                   │
│                                                              │
│  Your custom collection proposition has been created and    │
│  is awaiting review by a Data Collection Manager.           │
│                                                              │
│  What you requested:                                         │
│  • 15 datasets (removed 1 from original)                    │
│  • Custom intents: Software development enabled             │
│  • Derived from: "Oncology ctDNA Outcomes Collection"       │
│                                                              │
│  Estimated review time: 3-5 business days                   │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  WHAT HAPPENS NEXT                                          │
│                                                              │
│  1. ⏳ DCM review (current step)                             │
│     A Data Collection Manager will review your proposition  │
│     and may:                                                 │
│     - Approve as-is                                          │
│     - Suggest modifications (add/remove datasets)            │
│     - Request clarification via discussion                  │
│                                                              │
│  2. 💬 Collaboration (if needed)                            │
│     You may be invited to discuss the proposition via the   │
│     collection's discussion tab.                             │
│                                                              │
│  3. ✅ Approval & provisioning                               │
│     Once approved, your collection will be created and      │
│     access provisioning will begin (2-5 days).              │
│                                                              │
│  4. 📧 Notifications                                        │
│     You'll receive email updates at each step.              │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  TRACK YOUR PROPOSITION                                     │
│                                                              │
│  [Go to My Requests Dashboard]                              │
│  [View Proposition Details]                                 │
│  [Contact DCM]                                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Screen 7: My Requests Dashboard (User)

**Route:** `/collectoid/my-requests` (new page)

**Purpose:** User dashboard to track all access requests and propositions

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  My Data Requests                                            │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  [Active (3)] [Completed (12)] [All (15)]                   │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  ACTIVE REQUESTS (3)                                        │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🆕 Collection Proposition: Oncology ctDNA ML Research│  │
│  │ PROP-2025-1234 | Submitted: Nov 20, 2025             │  │
│  │                                                       │  │
│  │ Status: ⏳ Pending DCM Review                         │  │
│  │ Progress: ▓░░░░░░░░░ Review (Step 1 of 4)           │  │
│  │                                                       │  │
│  │ 15 datasets requested | Custom intents                │  │
│  │ Est. completion: Nov 25-27, 2025                      │  │
│  │                                                       │  │
│  │ Latest update: "DCM Divya assigned to review"        │  │
│  │ (2 hours ago)                                         │  │
│  │                                                       │  │
│  │ [View Details] [View Discussion] [Contact DCM]       │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Access Request: Oncology ctDNA Outcomes Collection   │  │
│  │ REQ-2025-1233 | Submitted: Nov 18, 2025              │  │
│  │                                                       │  │
│  │ Status: ⚡ Partially Granted                          │  │
│  │ Progress: ▓▓▓▓▓▓▓░░░ Approval (Step 3 of 4)         │  │
│  │                                                       │  │
│  │ ✅ 8 datasets: Access granted [Use Data →]           │  │
│  │ ⏳ 8 datasets: Awaiting GPT-Oncology approval         │  │
│  │                                                       │  │
│  │ Latest update: "Approval request sent to GPT team"   │  │
│  │ (1 day ago)                                           │  │
│  │                                                       │  │
│  │ [View Details] [Access Granted Data →]               │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Access Request: Cardiovascular Outcomes Collection   │  │
│  │ REQ-2025-1189 | Submitted: Nov 10, 2025              │  │
│  │                                                       │  │
│  │ Status: ⚠️ Action Required                            │  │
│  │ Progress: ▓▓▓░░░░░░░ Clarification Needed           │  │
│  │                                                       │  │
│  │ DCM has requested clarification on your intended     │  │
│  │ use. Please respond in the discussion tab.           │  │
│  │                                                       │  │
│  │ Latest update: "DCM posted question in discussion"   │  │
│  │ (3 days ago) 💬 New message                          │  │
│  │                                                       │  │
│  │ [Respond to DCM →] [View Discussion]                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  [+ New Data Request]                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

**Request Types:**
- Simple access requests (added to existing collection)
- Collection propositions (custom collections)
- Modification requests (request to change AoT of existing collection)

**Status Tracking:**
- Real-time progress bars
- Latest update timestamps
- Action required notifications

**Quick Actions:**
- [Access Granted Data →] - Direct links to platform for instant-access datasets
- [View Discussion] - Jump to collection discussion tab for collaboration
- [Contact DCM] - Email or chat with assigned DCM

---

## Screen 8: DCM Proposition Review (DCM-Side)

**Route:** `/collectoid/dcm/propositions` (new page for DCMs)

**Purpose:** DCM dashboard to review incoming user propositions

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  User Propositions & Requests                       [Divya] │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  [Pending (5)] [Under Review (3)] [Approved (18)] [All]    │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  PENDING REVIEW (5)                                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ 🆕 Custom Collection Proposition                     │  │
│  │ PROP-2025-1234 | Dr. Sarah Chen (Oncology Biometrics│  │
│  │ Submitted: 2 hours ago                                │  │
│  │                                                       │  │
│  │ Collection: "Oncology ctDNA ML Research (Software    │  │
│  │              Dev Enabled)"                            │  │
│  │                                                       │  │
│  │ Derived from: "Oncology ctDNA Outcomes Collection"   │  │
│  │ Modifications:                                        │  │
│  │ • Removed: 1 dataset (DCODE-088)                     │  │
│  │ • Added: 0 datasets                                   │  │
│  │ • Total: 15 datasets                                  │  │
│  │ • New intents: Software development enabled          │  │
│  │                                                       │  │
│  │ User's purpose:                                       │  │
│  │ "I need software development enabled for ML pipeline│  │
│  │  testing and validation framework development."      │  │
│  │                                                       │  │
│  │ 💡 Suggestion: Consider adding user to original      │  │
│  │    collection and separately granting software dev   │  │
│  │    access? Or approve as new variant?                │  │
│  │                                                       │  │
│  │ [Review Proposition] [Auto-Approve] [Reject]         │  │
│  │ [Suggest Modification] [Merge with Original]         │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Simple Access Request                                │  │
│  │ REQ-2025-1235 | Dr. Mark Williams (Early Oncology)   │  │
│  │ Submitted: 5 hours ago                                │  │
│  │                                                       │  │
│  │ Collection: "Oncology ctDNA Outcomes Collection"     │  │
│  │ (requesting full collection, 16 datasets)            │  │
│  │                                                       │  │
│  │ Intent: Primary use, protocol-guided analysis        │  │
│  │ ✅ Intent matches collection AoT                     │  │
│  │                                                       │  │
│  │ Access status:                                        │  │
│  │ ✅ 12 datasets: User matches 90/10 criteria          │  │
│  │ ⏳ 4 datasets: Requires GPT-Oncology approval         │  │
│  │                                                       │  │
│  │ 💡 Recommendation: Auto-approve (low risk)           │  │
│  │                                                       │  │
│  │ [Auto-Approve & Add to Collection]                   │  │
│  │ [Review Manually] [Reject]                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ... (3 more pending)                                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### DCM Actions

**For Simple Requests:**
- Auto-approve (add user to existing collection)
- Manually review (if intent unclear or edge case)
- Reject (with reason)

**For Custom Propositions:**
- Approve as-is (create new collection)
- Suggest modification (reply in discussion)
- Merge with original (add user to original collection instead)
- Reject (provide alternative)

**Smart Suggestions:**
- System flags low-risk requests for auto-approval
- Flags high-risk (large dataset count, sensitive data)
- Suggests consolidation when similar propositions exist

---

## Screen 9: DCM Proposition Refinement

**Route:** `/collectoid/dcm/propositions/[prop-id]/review`

**Purpose:** DCM detailed review and refinement of proposition

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  Review Proposition: PROP-2025-1234                         │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  Requested by: Dr. Sarah Chen (sarah.chen@az.com)           │
│  Department: Oncology Biometrics                            │
│  Submitted: Nov 20, 2025 at 2:45 PM                         │
│                                                              │
│  [Overview] [Datasets] [Intent Review] [Discussion]         │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  PROPOSITION SUMMARY                                        │
│                                                              │
│  Collection Name: "Oncology ctDNA ML Research (Software     │
│                    Dev Enabled)"                             │
│                                                              │
│  Derived from: "Oncology ctDNA Outcomes Collection"         │
│  (View parent collection)                                   │
│                                                              │
│  User's Purpose:                                             │
│  "I'm developing an ML-based early response classifier      │
│   using baseline ctDNA levels and multimodal fusion with    │
│   clinical covariates. I need software development access   │
│   for building and testing the ML pipeline framework."      │
│                                                              │
│  ───────────────────────────────────────────────────────────│
│                                                              │
│  MODIFICATIONS FROM PARENT COLLECTION                       │
│                                                              │
│  Datasets:                                                   │
│  ✅ 15 datasets selected (removed 1)                        │
│  ❌ Removed: DCODE-088 (Lung Cancer Outcomes)               │
│                                                              │
│  Intents:                                                    │
│  🆕 Software development and testing - ADDED                 │
│     (not in parent collection's AoT)                        │
│                                                              │
│  ═══════════════════════════════════════════════════════════│
│                                                              │
│  DCM DECISION OPTIONS                                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Option 1: Approve as Proposed                          │ │
│  │                                                         │ │
│  │ Create new collection with 15 datasets and software    │ │
│  │ development intent enabled.                            │ │
│  │                                                         │ │
│  │ Impact:                                                 │ │
│  │ • Creates new collection variant                       │ │
│  │ • Sarah Chen gets access (subject to 90/10 breakdown)  │ │
│  │ • Collection becomes discoverable to other users       │ │
│  │                                                         │ │
│  │ [Approve & Publish Collection]                         │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Option 2: Modify Proposition                           │ │
│  │                                                         │ │
│  │ Suggest changes to Sarah's request:                    │ │
│  │                                                         │ │
│  │ [+ Add datasets she may have missed]                   │ │
│  │ [− Remove datasets not suitable]                       │ │
│  │ [✎ Adjust intents/restrictions]                        │ │
│  │                                                         │ │
│  │ Changes will be sent to Sarah for approval before      │ │
│  │ creating the collection.                               │ │
│  │                                                         │ │
│  │ [Open Refinement Workspace]                            │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Option 3: Merge with Parent Collection                │ │
│  │                                                         │ │
│  │ Add Sarah to the original "Oncology ctDNA Outcomes"    │ │
│  │ collection instead, and grant software dev access      │ │
│  │ separately (if appropriate).                           │ │
│  │                                                         │ │
│  │ Rationale: Avoid proliferation of near-duplicate       │ │
│  │ collections. Software dev intent may not require       │ │
│  │ separate collection.                                   │ │
│  │                                                         │ │
│  │ [Add to Parent Collection]                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Option 4: Request Clarification                       │ │
│  │                                                         │ │
│  │ Post question in discussion tab to understand Sarah's  │ │
│  │ specific needs before deciding.                        │ │
│  │                                                         │ │
│  │ ┌──────────────────────────────────────────────────┐  │ │
│  │ │ Quick message to Sarah:                          │  │ │
│  │ │                                                   │  │ │
│  │ │ Hi Sarah, can you clarify why you need software  │  │ │
│  │ │ development access specifically?                 │  │ │
│  │ │                                                   │  │ │
│  │ └──────────────────────────────────────────────────┘  │ │
│  │                                                         │ │
│  │ [Post to Discussion & Await Response]                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │ Option 5: Reject Proposition                          │ │
│  │                                                         │ │
│  │ Provide reason for rejection and suggest alternative. │ │
│  │                                                         │ │
│  │ [Reject with Feedback]                                 │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Key Features

**Smart Recommendations:**
- System suggests whether to approve, modify, or merge
- Based on similarity to existing collections
- Flags potential duplication issues

**Refinement Workspace:**
- [Open Refinement Workspace] → Same DCM creation flow (categories, filters, etc.)
- Pre-populated with user's selections
- DCM can add/remove datasets, adjust intents
- Changes sent back to user for approval

**Discussion Integration:**
- DCM can post questions directly from review screen
- User receives notification
- Collaborative refinement before approval

---

## Screen 10: Access Granted (Final User Notification)

**Route:** Email notification + in-app notification

**Purpose:** Notify user when access is fully granted

### Email Template

```
Subject: ✓ Your Data Request is Ready - [Collection Name]

Hi Sarah,

Great news! Your data request has been approved and access is now ready.

Collection: Oncology ctDNA Outcomes Collection
Request ID: REQ-2025-1234
Approved by: Divya (Data Collection Manager)

ACCESS SUMMARY:
✅ 16 datasets now accessible
✅ Allowed uses: ML/AI research, external publication

WHAT'S NEXT:
You can start accessing your data immediately through the platform:

[Access Data Now →]

Your data is available via:
• Domino Data Lab: [Direct Link]
• SCP Platform: [Direct Link]
• AiBench: [Direct Link]

COLLECTION DETAILS:
View full collection information, datasets, and Agreement of Terms:
[View Collection →]

Questions? Contact your Data Collection Manager:
Divya (divya@astrazeneca.com)

---
AstraZeneca Collectoid
Your data, simplified.
```

### In-App Notification

```
┌─────────────────────────────────────────────────────────────┐
│  🔔 New Notification                                        │
│─────────────────────────────────────────────────────────────│
│                                                              │
│  ✓ Data Access Granted: Oncology ctDNA Outcomes Collection │
│                                                              │
│  Your request (REQ-2025-1234) has been approved.            │
│  16 datasets are now accessible.                            │
│                                                              │
│  [Access Data →] [View Collection] [Dismiss]                │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Future Features (Not in Initial Scope)

The following features have been identified but will NOT be implemented in the initial POC:

### 1. Suggest Modifications to Active Collections (Q4 Answer)

**User Story:** As a user already in a collection, I want to suggest adding new intents or datasets via the discussion tab.

**Flow:**
1. User navigates to collection they're already using
2. Posts message in discussion: "Can we enable external publication for this collection?"
3. Agentic parsing detects modification request
4. DCM sees recommendation in new "Suggested Modifications" screen
5. DCM can approve/deny modification
6. If approved, all users in collection get expanded access

**Implementation Notes:**
- Requires NLP/LLM parsing of discussion messages
- New DCM screen: "Suggested Modifications Dashboard"
- Notification system for modification requests

---

### 2. "My Collections" Dashboard for End Users

**User Story:** As a user, I want to see all collections I have access to, my usage, and manage my preferences.

**Features:**
- List of active collections with access status
- Usage analytics (how often I've accessed data)
- Notification preferences per collection
- Request to leave collection
- See other members (if privacy allows)

**Route:** `/collectoid/my-collections`

---

### 3. Data Platform Click-Through

**User Story:** As a user with granted access, I want single-click access to data on the platform (Domino, SCP, AiBench, etc.)

**Current Assumption:** Dummy links in POC

**Future Implementation:**
- Deep links to specific datasets on each platform
- SSO integration
- Platform availability check (is platform up?)
- Track which platform user prefers (auto-redirect)

**Route:** `/collectoid/data/access/[dataset-code]` → Redirects to platform

---

### 4. Collection Collaboration Workspace

**User Story:** As a user requesting data, I want to collaborate with the DCM during proposition review in a shared workspace.

**Features:**
- Real-time chat with DCM
- Shared view of dataset selection
- DCM proposes changes, user approves inline
- Version history of proposition changes

**Route:** `/collectoid/propositions/[prop-id]/collaborate`

---

### 5. Similar Collection Detection

**User Story:** As a user creating a custom proposition, I want to be notified if similar pending propositions exist to avoid duplication.

**Logic:**
- When user submits proposition, system checks for:
  - Similar dataset overlap (>80%)
  - Similar intents
  - Similar requesting departments
- Suggests: "Join Dr. Williams' pending proposition instead?"

---

### 6. Collection Templates

**User Story:** As a DCM, I want to create collection templates for common use cases to speed up proposition approvals.

**Features:**
- Predefined templates: "Oncology ML Research", "Cardio Publication-Ready", etc.
- Template includes default datasets, intents, user scope
- Users can request "Create collection from template"
- DCM only needs to customize, not start from scratch

---

### 7. Advanced Analytics & Insights

**User Story:** As a user, I want to see which datasets are most frequently requested, which collections are trending, etc.

**Features:**
- Collection popularity ranking
- "Hot datasets" trending this month
- "Users who accessed this collection also requested..."
- Personalized recommendations based on role/department

---

## Data Models

### Core Entities

```typescript
// Collection (existing, enhanced with AoT)
interface Collection {
  id: string
  name: string
  description: string
  createdBy: string // DCM PRID
  createdAt: Date
  updatedAt: Date

  datasets: string[] // Dataset codes

  // NEW: Agreement of Terms
  agreementOfTerms: AgreementOfTerms

  // User scope
  userScope: {
    byDepartment?: string[] // Workday org IDs
    byRole?: string[] // Job roles
    explicitUsers?: string[] // Individual PRIDs
  }

  // Metadata
  therapeuticAreas: string[]
  studyPhases: string[]

  // Derived from
  parentCollectionId?: string // If customized from another

  // Stats
  userCount: number
  accessCount: number
}

// NEW: Agreement of Terms
interface AgreementOfTerms {
  id: string
  version: string

  // Primary use allowances
  primaryUse: {
    understandDrugMechanism: boolean
    understandDisease: boolean
    developDiagnosticTests: boolean
    learnFromPastStudies: boolean
    improveAnalysisMethods: boolean
  }

  // Beyond primary use
  beyondPrimaryUse: {
    aiResearch: boolean
    softwareDevelopment: boolean
  }

  // Publication
  publication: {
    internalCompanyRestricted: boolean
    externalPublication: boolean | "by_exception"
  }

  // External sharing
  externalSharing: {
    allowed: boolean
    process?: string // Description of process
  }

  // Effective dates
  effectiveDate: Date
  reviewDate?: Date
}

// NEW: User Request (simple access request)
interface UserRequest {
  id: string // REQ-2025-XXXX
  type: "simple_access" | "modification_request"

  userId: string // PRID
  userName: string
  userEmail: string
  userDepartment: string
  userRole: string

  collectionId: string

  // User's stated intent
  intendedUse: {
    primaryUse: string[]
    beyondPrimaryUse: string[]
    publicationIntent: string[]
  }

  purpose: string // Free text description
  duration: number // Months

  // Status
  status: "pending" | "approved" | "rejected" | "clarification_needed"

  // Access breakdown (personalized for this user)
  accessBreakdown: {
    instantAccess: string[] // Dataset codes
    approvalRequired: string[] // Dataset codes
  }

  // Timestamps
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string // DCM PRID

  // Outcome
  approvalDecision?: {
    decision: "approved" | "rejected"
    reason?: string
    addedToCollection: boolean
  }
}

// NEW: Collection Proposition (custom collection request)
interface CollectionProposition {
  id: string // PROP-2025-XXXX

  // Requester
  requestedBy: string // PRID
  requesterName: string
  requesterEmail: string
  requesterDepartment: string
  requesterRole: string

  // Proposed collection
  proposedName: string
  proposedDescription: string
  proposedDatasets: string[] // Dataset codes

  // Intent
  intendedUse: {
    primaryUse: string[]
    beyondPrimaryUse: string[]
    publicationIntent: string[]
  }

  purpose: string // Free text
  duration: number // Months

  // Derived from
  parentCollectionId?: string
  modificationsFromParent?: {
    datasetsRemoved: string[]
    datasetsAdded: string[]
    intentsAdded: string[]
  }

  // Status
  status: "pending" | "under_review" | "clarification_needed" |
          "approved" | "rejected"

  assignedDCM?: string // PRID of reviewing DCM

  // Timestamps
  submittedAt: Date
  reviewStartedAt?: Date
  resolvedAt?: Date

  // DCM actions
  dcmDecision?: {
    decision: "approve_as_is" | "approve_with_mods" | "merge_with_parent" | "reject"
    modifications?: {
      datasetsChanged: string[]
      intentsChanged: string[]
      reasoning: string
    }
    createdCollectionId?: string // If approved
  }

  // Discussion
  discussionThreadId?: string
}

// Dataset (existing, enhanced with AoT metadata)
interface Dataset {
  id: string
  code: string // DCODE-XXX
  name: string
  description: string

  // Study metadata
  studyCode: string
  studyPhase: string
  therapeuticArea: string[]
  patientCount: number
  status: "active" | "closed"
  databaseLockDate?: Date

  // Data location
  location: {
    platform: "s3" | "solvebio" | "databricks"
    path: string
  }

  // Access metadata (for AoT suggestions)
  recommendedRestrictions?: {
    primaryUseOnly?: boolean
    noAI?: boolean
    noPublication?: boolean
    requiresLegalReview?: boolean
  }

  // Collections containing this dataset
  inCollections: string[] // Collection IDs
}
```

---

## Implementation Notes

### Current Implementation Status (as of Nov 24, 2025)

**Already Implemented in `/app/collectoid/`:**

✅ **DCM Creation Flow** - Full 7-step wizard:
- `/collectoid/dcm/create` - Category selection
- `/collectoid/dcm/create/categories` - Therapeutic areas
- `/collectoid/dcm/create/filters` - Dataset filtering
- `/collectoid/dcm/create/activities` - Activity selection
- `/collectoid/dcm/create/agreements` - Agreement of Terms
- `/collectoid/dcm/create/review` - Review & submit
- `/collectoid/dcm/create/publishing` - Publishing with live status

✅ **Progress Dashboard** - `/collectoid/dcm/progress`:
- Overview tab with collection summary
- Agreement of Terms tab
- Dataset Status tab with pagination
- User Status tab with:
  - Compact stat bar
  - User Groups panel with contacts
  - Paginated user table with expandable details
  - "Request Users Modification" action
- Timeline tab with:
  - ETA Summary Panel (progress ring, countdown)
  - ETA Complexity Breakdown (teams, sensitivity, volume, agreements)
  - Blocker Impact Panel with delay calculations
  - Enhanced milestone timeline with inline blocker warnings
- Discussion tab with comments, blockers, mentions

✅ **Supporting Pages**:
- `/collectoid` - Dashboard with collection overview
- `/collectoid/collections` - Browse existing collections
- `/collectoid/notifications` - Notification center

**Still To Build (End User Discovery):**

---

### Phase 1: Core Discovery (Week 1-2)

**Pages to build in `/app/collectoid/`:**
1. `/discover` - Landing page (Screen 1)
2. `/discover/ai` - LLM prompt interface (Screen 2A)
3. `/collections` - Enhanced collection catalog (Screen 2B)
4. `/collections/[id]` - Collection detail view (Screen 3)

**Mock data needed:**
- 10-15 collections with full AoT definitions
- 50-100 datasets with metadata
- User roles and departments (for access preview)

---

### Phase 2: Request Flow (Week 3-4)

**Pages to build:**
5. `/collections/[id]/request` - Simple access request (Screen 4A/4B)
6. `/collections/[id]/customize` - Customize collection (Screen 5)
7. `/requests/[id]` - Request confirmation (Screen 6)
8. `/my-requests` - User dashboard (Screen 7)

**Logic to implement:**
- Intent validation against AoT
- 90/10 access preview calculation (personalized)
- Proposition creation workflow
- Email notification templates

---

### Phase 3: DCM Review Flow (Week 5-6)

**Pages to build (DCM-side):**
9. `/dcm/propositions` - DCM proposition dashboard (Screen 8)
10. `/dcm/propositions/[id]/review` - Proposition review (Screen 9)

**Integration:**
- Link to existing DCM creation flow for refinement
- Discussion tab integration
- Approval workflow triggers collection creation

---

### Phase 4: Notifications & Polish (Week 7-8)

**Features:**
- Email templates for all notification types
- In-app notification system
- Access granted screen
- Platform click-through (dummy links)
- Polish UI/UX, animations, error states

---

### Mock Data Requirements

**Collections (15 total):**
- 5 Oncology collections (various intents)
- 3 Cardiovascular collections
- 3 Immunology collections
- 2 Multi-TA collections
- 2 Restricted/sensitive collections

**Each collection needs:**
- Full AoT definition (all checkboxes filled)
- 10-20 datasets
- Realistic purpose/description
- User count, created date, DCM name

**Datasets (50-100 total):**
- Mix of instant access vs. approval-required
- Various therapeutic areas, phases
- Some in multiple collections
- Realistic study codes (DCODE-XXX)

**Users (for access preview):**
- 5-10 mock user profiles
- Different departments, roles
- Different training statuses
- Should show different access breakdowns for same collection

---

## Design System Compliance

All screens will follow **@app/ux/13/design-system/** patterns:

**Typography:**
- `font-extralight` for large headings
- `font-light` for body text
- `font-normal` for emphasis

**Colors:**
- Dynamic color scheme from `useColorScheme()`
- Intent badges: Green (✅), Amber (⚠️), Red (❌)
- Access status: Green (instant), Blue (in progress), Amber (approval)

**Components:**
- Gradient buttons for primary actions
- `rounded-xl` cards
- `rounded-2xl` modals
- `rounded-full` buttons
- Single-pixel borders
- `shadow-sm` to `shadow-lg` elevation

**Animations:**
- Smooth transitions (300-500ms)
- Hover effects on cards
- Loading skeletons for async data

---

## Success Metrics

**User Experience:**
- Time from landing to data access < 5 minutes (instant access)
- Time from landing to proposition submission < 15 minutes
- User satisfaction with discovery process (survey)

**System Efficiency:**
- % of requests that leverage existing collections (target: >60%)
- % of requests auto-approved via 90/10 (target: >70%)
- Average DCM time per proposition review (target: <30 min)

**Data Quality:**
- % of propositions with complete intent declarations (target: >90%)
- % of propositions that require clarification (target: <20%)
- Collection reuse rate (users added to existing vs. new created)

---

**End of Detailed Specification**

Ready for stakeholder review and implementation kickoff.

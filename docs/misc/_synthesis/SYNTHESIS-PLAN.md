# Plan: Synthesize DOVS2 Documentation into Unified Vision

## Overview

Parse and summarize all documentation under `docs/misc/` to create a unified understanding of the DOVS2 program, its workstreams, and requirements. The approach is designed to survive context resets by creating persistent artifacts.

## User Goals

- **Primary focus:** WP4 (UI & Agentic AI) - this is what the prototype solves
- **Secondary:** Understand all WPs to see how UI requirements tie into processes
- **Precedence:** 2026 docs supersede 2025 where they conflict
- **Future use:** These summaries become context for UX design sessions and UI reviews

---

## Scope

- **42 files** (31 markdown, 11 PDF)
- **~71,600 lines** of content
- **3 main sections:**
  - `00. Final Documentation - 2025` - Existing 2025 documentation (templates, guides, SOPs)
  - `DOVS2 2026` - New program with 4 workstreams
  - Root files - Agreement templates, opt-in/out docs

---

## Strategy: Context-Resilient Summarization

Since context will need to be cleared multiple times, we'll create **persistent artifacts** that survive resets:

1. **Progress Tracker** (`docs/misc/_synthesis/PROGRESS.md`) - Master task list showing what's done
2. **Individual Summaries** (`docs/misc/_synthesis/summaries/`) - One summary per document
3. **Workstream Syntheses** (`docs/misc/_synthesis/workstreams/`) - Combined summaries by area
4. **Final Vision Doc** (`docs/misc/_synthesis/VISION.md`) - Unified output

---

## Phase 1: Setup & Index (This Session)

Create the synthesis folder structure and document index:

```
docs/misc/_synthesis/
├── PROGRESS.md           # Master tracker (survives context resets)
├── INDEX.md              # Document inventory with metadata
├── summaries/            # Individual doc summaries
├── workstreams/          # WP1-WP4 + 2025 syntheses
└── VISION.md             # Final unified document
```

---

## Phase 2: Document-by-Document Summarization (Multiple Sessions)

For each document, create a structured summary:

```markdown
# Summary: [Document Name]

**Source:** [path]
**Type:** [Guide/Agreement/Presentation/SOP]
**Workstream:** [WP1/WP2/WP3/WP4/2025 Baseline]
**Date:** [if available]

## Key Points
- Point 1 `[ref: section/page]`
- Point 2 `[ref: section/page]`

## Entities/Concepts Defined
- **Term**: Definition `[ref]`

## Requirements/Actions
- Requirement `[ref]`

## Conflicts/Contradictions
- ⚠️ "[Quote A]" vs "[Quote B]" - needs resolution `[ref: docA, docB]`

## Open Questions
- ...

## Cross-References
- Related to: [other doc names]
- Supersedes: [older doc if applicable]
- Superseded by: [newer doc if applicable]
```

**Key principle:** Every claim should have a `[ref]` so we can trace back to source.

### Document Groups (in order of priority):

**Group A: 2026 Program Overview (2 docs)** - Understand the big picture first
1. `DOVS2 2026/General/VS2 Goals & Objectives - 2026.md`
2. `DOVS2 2026/General/Program & Project Mgmt/2026 - VS2 - Program Charter V1.md`

**Group B: WP4 UI & Agentic AI (5 docs)** - PRIMARY FOCUS
1. `DOVS2 2026/WP 4 UI & Agentic AI/12Dec Workshop Output and Proposal.md`
2. `DOVS2 2026/WP 4 UI & Agentic AI/12Dec Workshop Output Summary.md`
3. `DOVS2 2026/WP 4 UI & Agentic AI/WS_Agentification_Priorities_4Dec.md`
4. `DOVS2 2026/WP 4 UI & Agentic AI/12Dec Workshop Output Summary.pdf`
5. `DOVS2 2026/WP 4 UI & Agentic AI/AZ Agentic AI Workshop Writeup.pdf`

**Group C: 2025 Baseline (7 docs)** - Understand current state
1. `00. Final Documentation - 2025/Role-based Open Access Model - Guidance v1.1.md`
2. `00. Final Documentation - 2025/User Guide v2.0.md`
3. `00. Final Documentation - 2025/MASTER Document Index - 9010 Open Access.md`
4. `00. Final Documentation - 2025/9010 Open Access Model - User Journey.md`
5. `00. Final Documentation - 2025/User Guide v1.0.md`
6. `00. Final Documentation - 2025/User Guide - Biopharma Closed Collection - v2.md`
7. `00. Final Documentation - 2025/Templates/` (2 files)

**Group D: WP1 Extended 90-10 (8 docs)**
- BioPharma collection docs (5 md files)
- ODSAI approval PDFs (3 files)

**Group E: WP2 R&D Data Exchange (7 docs)**
- DDTS, vendor transfers, data exchange ecosystem
- LEGALFLY materials

**Group F: WP3 Data Readiness (4 docs)**
- Metadata landscape
- GPSSS mapping
- Data readiness principles

**Group G: Root Agreements & SOPs (7 docs)**
- Agreement templates
- Global Standards PDF
- SOP PDFs

---

## Phase 3: Workstream Synthesis (After Phase 2)

Create one synthesis per area:
- `workstreams/WP1-extended-90-10.md`
- `workstreams/WP2-data-exchange.md`
- `workstreams/WP3-data-readiness.md`
- `workstreams/WP4-ui-agentic-ai.md`
- `workstreams/2025-baseline.md`

---

## Phase 4: Final Vision Document

Combine workstream syntheses into:
- **Problem Statement** - What is DOVS2 solving?
- **Key Concepts** - Data collections, agreements, open access model, roles
- **User Journeys** - DCM, End User, Data Owner
- **WP Summaries** - One-pager per workstream (WP1-WP4)
- **UI/AI Requirements** - What the prototype should address (PRIMARY OUTPUT)
- **Process → UI Mapping** - How UI features solve process problems
- **Gaps & Open Questions** - What's undefined

### Output Files for Future Context

These files can be fed into future sessions for UX design:
- `_synthesis/VISION.md` - Master context document
- `_synthesis/workstreams/WP4-ui-requirements.md` - Detailed UI requirements
- `_synthesis/UI-CHECKLIST.md` - Criteria for reviewing UI against requirements

---

## Session Workflow

Each session should:
1. Read `PROGRESS.md` to see current state
2. Pick next uncompleted group
3. Summarize 3-5 documents (depending on size)
4. Save summaries to `_synthesis/summaries/`
5. Update `PROGRESS.md`
6. Clear context when needed

---

## Files to Create (Phase 1)

1. `docs/misc/_synthesis/PROGRESS.md` - Task tracker
2. `docs/misc/_synthesis/INDEX.md` - Full document inventory

---

## Next Steps

1. Create the `_synthesis` folder structure
2. Generate `INDEX.md` with all 42 documents categorized
3. Create `PROGRESS.md` with checkboxes for each doc
4. Begin Group A summarization

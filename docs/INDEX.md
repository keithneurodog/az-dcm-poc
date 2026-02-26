# Collectoid Documentation Index

> **For Claude:** Read this file first. It tells you what else to read based on your task.

## Quick Navigation

| Task | Read These |
|------|------------|
| **Understand the project** | `/README.md` |
| **V2 collection flow (end-to-end)** | `collectoid-v2-flow-spec.md` |
| **V2 JIRA epics & stories** | `sprint-zero/JIRA/epic-*.md` |
| **V2 user roles & personas** | `collectoid-v2-ux-roles.md`, `collectoid-v2-roles-matrix.md` |
| **Implement collections browser feature** | `collections-browser-spec.md` |
| **Implement AI discovery feature** | `ai-discovery-page-ux-enhancement-spec.md` |
| **See what's left to build (V1)** | `BACKLOG.md` |
| **Understand a completed feature** | `_archive/[relevant-spec].md` |
| **Find mock data/interfaces** | `/lib/dcm-mock-data.ts` |

## Active Specs (3 files)

These have **outstanding work** - read when implementing these features:

1. **collectoid-v2-flow-spec.md** - V2 end-to-end flow: status glossary, todo list (31 items), key files. **Start here for V2 work.**
2. **collections-browser-spec.md** - Missing: Fork, Template, Export actions; date range filter
3. **ai-discovery-page-ux-enhancement-spec.md** - Missing: Three-state filter, floating bar, AI review page

## Archive Index

Specs for **completed features** - only read if you need implementation details:

| Archived Spec | Feature | Route |
|---------------|---------|-------|
| collectoid-poc-requirements.md | Master requirements | Various |
| aot-integration-dcm-flow-spec.md | Agreement of Terms | `/dcm/create/agreements` |
| dataset-approval-workflow-spec.md | GPT/TALT approvals | `/collections/[id]` (was `/dcm/progress`) |
| dcm-progress-dashboard-improvements.md | Help, Discussion tabs | `/collections/[id]` (was `/dcm/progress`) |
| dcm-demand-analytics-spec.md | Heatmap, suggestions | `/dcm/analytics` |
| end-user-discovery-approaches.md | Collections-aware discovery | `/discover` |
| end-user-data-discovery-detailed-spec.md | AoT badges, intent filter | `/discover/ai` |
| end-user-request-dashboard-spec.md | Request tracking | `/requests/[id]` |
| data-access-request-flow-spec.md | 3-step request flow | `/requests/new/*` |
| dataset-explorer-variant-spec.md | Dataset-first variant | `/discover/ai` (datasets) |
| page-variations-system-spec.md | `_variations/` pattern | Various |
| responsive-layout-spec.md | Collapsible sidebar | Global |
| add-notes-functionality.md | Right-click annotations | Global |

**Superseded** (replaced by newer specs):
- collectoid-v2-planning.md - Old V2 task list → superseded by `collectoid-v2-flow-spec.md`
- collectoid-v2-gap-analysis.md - Old gap analysis (11-step linear flow) → superseded by `collectoid-v2-flow-spec.md` + JIRA epics

**Reference only** (not specs):
- dcm-workflow-learnings.md - Screenshot analysis insights
- dcm-user-journey-mockup.md - ASCII mockup walkthrough
- filterable-categories.md - Raw meeting notes

## Update Protocol

When a feature is **fully implemented**:
1. Move its spec to `_archive/`
2. Update this INDEX.md
3. Remove from BACKLOG.md if present

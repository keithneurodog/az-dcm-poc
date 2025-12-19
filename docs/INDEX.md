# Collectoid Documentation Index

> **For Claude:** Read this file first. It tells you what else to read based on your task.

## Quick Navigation

| Task | Read These |
|------|------------|
| **Understand the project** | `/README.md` |
| **Implement collections browser feature** | `collections-browser-spec.md` |
| **Implement AI discovery feature** | `ai-discovery-page-ux-enhancement-spec.md` |
| **See what's left to build** | `BACKLOG.md` |
| **Understand a completed feature** | `_archive/[relevant-spec].md` |
| **Find mock data/interfaces** | `/lib/dcm-mock-data.ts` |

## Active Specs (2 files)

These have **outstanding work** - read when implementing these features:

1. **collections-browser-spec.md** - Missing: Fork, Template, Export actions; date range filter
2. **ai-discovery-page-ux-enhancement-spec.md** - Missing: Three-state filter, floating bar, AI review page

## Archive Index

Specs for **completed features** - only read if you need implementation details:

| Archived Spec | Feature | Route |
|---------------|---------|-------|
| collectoid-poc-requirements.md | Master requirements | Various |
| aot-integration-dcm-flow-spec.md | Agreement of Terms | `/dcm/create/agreements` |
| dataset-approval-workflow-spec.md | GPT/TALT approvals | `/dcm/progress` |
| dcm-progress-dashboard-improvements.md | Help, Discussion tabs | `/dcm/progress` |
| dcm-demand-analytics-spec.md | Heatmap, suggestions | `/dcm/analytics` |
| end-user-discovery-approaches.md | Collections-aware discovery | `/discover` |
| end-user-data-discovery-detailed-spec.md | AoT badges, intent filter | `/discover/ai` |
| end-user-request-dashboard-spec.md | Request tracking | `/requests/[id]` |
| data-access-request-flow-spec.md | 3-step request flow | `/requests/new/*` |
| dataset-explorer-variant-spec.md | Dataset-first variant | `/discover/ai` (datasets) |
| page-variations-system-spec.md | `_variations/` pattern | Various |
| responsive-layout-spec.md | Collapsible sidebar | Global |
| add-notes-functionality.md | Right-click annotations | Global |

**Reference only** (not specs):
- dcm-workflow-learnings.md - Screenshot analysis insights
- dcm-user-journey-mockup.md - ASCII mockup walkthrough
- filterable-categories.md - Raw meeting notes

## Update Protocol

When a feature is **fully implemented**:
1. Move its spec to `_archive/`
2. Update this INDEX.md
3. Remove from BACKLOG.md if present

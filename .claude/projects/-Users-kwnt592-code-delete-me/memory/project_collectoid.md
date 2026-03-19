---
name: Collectoid Project Context
description: AstraZeneca clinical trial data access platform - POC/prototype project with extensive sprint-zero production planning docs
type: project
---

**Collectoid** is AstraZeneca's next-generation clinical trial data access platform, replacing the legacy AZCt iDAP (decommissioning 2026). Part of DOVS2 (Data Office Value Stream 2), WP4 - UI & Agentic AI.

## Current State
- **This repo** is a Next.js 15 mocked UI prototype (no backend) for stakeholder demos and UX exploration
- Two parallel app versions: `collectoid/` (V1 POC) and `collectoid-v2/` (V2, active focus)
- V2 has a workspace-based collection creation flow with hub-and-spoke pattern
- Tech: Next.js 15, React 19, TypeScript 5, Tailwind CSS v4, shadcn/ui, Radix UI
- All data is mocked in `lib/dcm-mock-data.ts` (5,381 lines)

## Key Concepts
- **ROAM**: Role-based Open Access Model - 90% instant access via pre-approved collections, 10% manual approval
- **Collections**: Curated bundles of clinical trial datasets with governance, terms, and user scope
- **Two-dimensional state model**: `governance_stage` (concept→draft→approved) + `operational_state` (provisioning→live→suspended→decommissioned)
- **Propositions**: Git-branch-like change proposals against live collections
- **Data Use Terms (AoT)**: Restrictions per collection - primary use, AI/ML, publication, external sharing
- **20/30/40/10 breakdown**: Access provisioning split (already open / awaiting policy / needs approval / missing)

## Key Roles
- **DCM** (Data Collection Manager) - Primary power user, creates/manages collections
- **Approver** (DDO/TA Lead/GPT/TALT) - Reviews and approves, "all or nothing" multi-TA approval
- **Data Consumer** - Researchers who find and access data
- **Team Lead** (Data Consumer Lead) - Oversees team data access
- **DPO** - Backend only, not a Collectoid UX role

## Team
- Keith Hayes - Lead Software Engineer (0.5 FTE, split with Sherlock)
- Divya - Product Owner (0.4 FTE)
- Marcin - Business Analyst (0.5 FTE)
- Beata - Product Manager
- Jamie MacPherson - WP4 Lead
- Cayetana Vazquez - Project Manager
- Tech Lead and UX Designer positions TBC

## Sprint Zero Docs (10 docs under docs/sprint-zero/)
Comprehensive production architecture planning: architecture overview, BRD, data model (PostgreSQL/Aurora), integration map (7 external systems), security/compliance, risk register, technical decisions (ADRs), sprint-zero backlog, testing strategy, 72 open questions.

## V2 Flow Spec Todo
31 items across 7 phases: promote→draft creation, draft visibility in browser, draft collection detail page, draft inline editing, approve action, active collection view, cross-cutting concerns.

**Why:** Securing 2+ developers for production build in 2026. POC validates UX patterns before real backend development begins.

**How to apply:** When working on this project, understand that the prototype uses mocked data, follow the Zen design aesthetic (font-light, rounded-xl cards, rounded-full buttons), never modify /components/ui/ (shadcn), and keep components isolated per workstream in _components/ directories.

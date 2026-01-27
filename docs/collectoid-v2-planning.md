# Collectoid V2 - Planning & Task List

**Created:** 2026-01-26
**Status:** In Progress

---

## Executive Summary

The v2 flow represents a fundamental shift from "dataset curation" to "role-based access management" aligned with the ROAM (Role-based Open Access Model) requirements. This document tracks the planning, brainstorming, and implementation of the new UI/UX.

---

## Key Focus Areas

### 1. User Role System & Persona Switching

**Status:** Planning

**Concept:**
- Multiple user types interact with the approval workflow
- UI needs to demonstrate each perspective clearly
- Widget for switching user roles at any time
- Introduction screen explaining roles and responsibilities

**User Roles to Define:**
- [ ] DCM (Data Collection Manager)
- [ ] DDO (Delegate Data Owner)
- [ ] Data Consumer Lead
- [ ] Data Consumer (End User)
- [ ] GPT/TALT Approvers
- [ ] R&D Data Office Lead

**UI Components Needed:**
- [ ] Role introduction/landing page (after selecting Collectoid v2)
- [ ] Floating role switcher widget
- [ ] Role-specific navigation/features
- [ ] Visual indicators of current role

**Questions to Answer:**
- What actions can each role perform?
- What data/views are role-specific?
- How do approval workflows differ by role?

---

### 2. Create Collection Flow (Full Rework)

**Status:** Needs Brainstorming & Gap Analysis

**Current State:**
- 8-step wizard: Intent → Categories → Filters → Activities → Agreements → Details → Review → Publishing
- Dataset-centric approach (selecting datasets to bundle)
- Focused on DCM creating collections from scratch

**New Requirements (from ROAM documentation):**
- Collections are pre-defined OACs (Open Access Collections)
- Focus shifts to defining AOTs (Agreements of Terms)
- Quarterly opt-in/opt-out study management
- Approval routing to DDOs, GPTs, TALT

**Gap Analysis Needed:**
- [ ] Map old flow steps to new requirements
- [ ] Identify what's obsolete vs. reusable
- [ ] Define new flow steps
- [ ] Understand approval chain requirements

**Brainstorming Topics:**
- [ ] What triggers collection creation vs. modification?
- [ ] How does the quarterly review process work in UI?
- [ ] What's the relationship between OAC and AOT in the UI?
- [ ] How do inclusion/exclusion criteria translate to UI?

---

### 3. Data Collection Lifecycle Management

**Status:** Needs Brainstorming & Gap Analysis

**Concept:**
Collections are not static - they require ongoing management:
- Adding/removing studies (opt-in/opt-out)
- Adding/removing users
- Updating terms of use
- Handling exceptions and escalations

**Key Workflows to Design:**
- [ ] Collection dashboard/overview
- [ ] Study management (opt-in/opt-out quarterly process)
- [ ] User assignment and management
- [ ] Terms modification workflow
- [ ] Audit trail and change history
- [ ] Compliance monitoring

**Questions to Answer:**
- How do we visualize collection "health"?
- What metrics matter for collection managers?
- How do we surface pending actions/decisions?

---

## Task Breakdown

### Phase 1: Foundation & User Roles

| # | Task | Status | Priority |
|---|------|--------|----------|
| 1.1 | Define all user roles and their permissions | Pending | High |
| 1.2 | Create role introduction landing page | Pending | High |
| 1.3 | Implement role switcher widget | Pending | High |
| 1.4 | Update layout to support role context | Pending | High |
| 1.5 | Document role-specific views and actions | Pending | Medium |

### Phase 2: Create Collection Flow

| # | Task | Status | Priority |
|---|------|--------|----------|
| 2.1 | Brainstorming session - new flow design | Pending | High |
| 2.2 | Gap analysis - old vs new requirements | Pending | High |
| 2.3 | Define new flow steps | Pending | High |
| 2.4 | Design OAC definition UI | Pending | High |
| 2.5 | Design AOT definition UI | Pending | High |
| 2.6 | Design approval routing UI | Pending | Medium |
| 2.7 | Implement new create flow | Pending | Medium |

### Phase 3: Collection Lifecycle

| # | Task | Status | Priority |
|---|------|--------|----------|
| 3.1 | Brainstorming session - lifecycle management | Pending | High |
| 3.2 | Gap analysis - current vs required features | Pending | High |
| 3.3 | Design collection dashboard | Pending | High |
| 3.4 | Design study management UI (opt-in/opt-out) | Pending | High |
| 3.5 | Design user assignment UI | Pending | High |
| 3.6 | Design audit trail/history view | Pending | Medium |
| 3.7 | Implement collection management features | Pending | Medium |

---

## Brainstorming Sessions

### Session 1: User Roles & Personas
**Date:** TBD
**Topics:**
- Role definitions and responsibilities
- Role-specific UI requirements
- Permission matrix
- Demo flow for each role

### Session 2: Create Collection Flow
**Date:** TBD
**Topics:**
- New flow architecture
- OAC vs AOT relationship in UI
- Approval chain visualization
- Step-by-step flow design

### Session 3: Collection Lifecycle
**Date:** TBD
**Topics:**
- Dashboard requirements
- Quarterly review workflow
- Change management
- Compliance and audit

---

## Design Principles (Carried Forward)

From existing Zen theme:
- `font-extralight` for large headings
- `font-light` for body text (never font-bold)
- `rounded-xl` for cards, `rounded-full` for buttons
- Single-pixel borders
- Dynamic color palettes via ColorSchemeProvider
- Status colors: Green (allowed), Amber (partial), Red (restricted)

---

## Open Questions

1. How does the mock data need to change to support the new model?
2. Should we keep the existing dashboard or redesign it?
3. What's the minimum viable demo for each user role?
4. How do we handle the transition from old to new flow conceptually?

---

## Next Steps

1. **Immediate:** Complete brainstorming for User Roles (Area 1)
2. **Then:** Implement role switcher and introduction page
3. **Then:** Brainstorm Create Collection flow (Area 2)
4. **Then:** Brainstorm Collection Lifecycle (Area 3)

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-26 | Initial planning document created | Claude |


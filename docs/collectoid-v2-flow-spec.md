# Collectoid V2 — Full Flow Specification

**Created:** 2026-02-17
**Status:** Planning (prototype in progress)

---

## 1. Collection Status Glossary

Every collection has a **status** that determines its visibility, editability, and available actions. Statuses are grouped into two tiers: **Prototype** (what we're building now) and **Production** (future, requires full governance implementation).

### Prototype Statuses

These are the statuses we're implementing in the current prototype. The simplified lifecycle is:

```
concept → draft → active
```

| Status | Definition | Visibility | Editable | Transitions To |
|--------|-----------|------------|----------|----------------|
| **`concept`** | Private workspace. Only the creator (DCM) can see it. A lightweight starting point created with just a title and optional description. All workspace sections (Datasets, Activities, Terms, Roles) are editable in any order via the hub-and-spoke workspace. | Creator only | All sections via workspace | `draft` |
| **`draft`** | Visible in the collections browser with a prominent "DRAFT" banner. Searchable by all authenticated users. All collection data (datasets, activities, terms, roles) is editable via the collection detail page's edit buttons. The collection has been validated (3 required sections complete) and reviewed via the Access Provisioning Breakdown. Not yet approved. | All authenticated users | All sections via detail page edit buttons | `active` |
| **`active`** | Live collection. Data access is provisioned (mocked in prototype). Appears in the collections browser without a DRAFT badge. In production this becomes "management mode" where studies can be added/removed within approved scope. | All authenticated users | Read-only in prototype | _(terminal in prototype)_ |

### Production Statuses (Future)

These statuses will be implemented when the full governance workflow is built. The production lifecycle is:

```
concept → draft → pending_approval → approved → provisioning → active
                                   ↘ rejected → draft (revision)
active → under_review → active / archived
active → suspended → active / archived
active → archived
```

| Status | Definition | Visibility | Editable | Transitions To |
|--------|-----------|------------|----------|----------------|
| **`pending_approval`** | Submitted for TA Lead approval. Approval requests are routed per therapeutic area. The collection is read-only for the DCM while approvers review. Each TA Lead sees only studies in their therapeutic area. Cross-TA collections follow the "all or nothing" rule. | All authenticated users | Read-only | `approved`, `rejected` |
| **`rejected`** | One or more TA Leads rejected the collection. The DCM is notified with the rejection reason. The collection can be revised and resubmitted, which returns it to `draft` status. | All authenticated users | Editable (to address rejection) | `draft` (after revision) |
| **`approved`** | All required TA Lead approvals have been received. Minimum information gates verified. The collection is ready for automated provisioning. | All authenticated users | Read-only | `provisioning` |
| **`provisioning`** | Immuta policies and Starburst access are being configured automatically via SQS. No manual intervention required. | All authenticated users | Read-only | `active` |
| **`under_review`** | A periodic quarterly review or metadata change investigation is in progress. DDOs are making per-study opt-in/opt-out decisions. | All authenticated users | Limited (review-specific fields only) | `active`, `archived` |
| **`suspended`** | Temporarily halted due to a compliance issue, metadata invalidation, or consent withdrawal. All active access is revoked. Stakeholders are notified. | All authenticated users | Read-only | `active` (after resolution), `archived` |
| **`archived`** | Decommissioned. All access has been revoked. The collection is retained in the system for audit purposes. It appears in search results with an "Archived" badge and is completely read-only. | All authenticated users | Read-only | None (terminal state) |

---

## 2. End-to-End Flow (V2)

### Step 1: Create Concept

The DCM navigates to "Start a New Collection" and enters a title and optional description. This creates a private **concept** — no one else can see it. The concept is not in the collections browser, not searchable, and has no governance implications. It's just a starting point.

A privacy banner confirms: _"This is a private concept — only you can see it."_

### Step 2: Work in Workspace

The DCM lands in the **workspace** — a hub-and-spoke layout with section cards:

- **Datasets** (required) — browse, filter, and select studies from the ROAM-enriched catalog
- **Activities & Purpose** (required) — define permitted activities across 4 categories
- **Agreement of Terms** (required) — configure primary use, beyond primary use, publication rights
- **Roles & Approvers** (optional) — assign DCL, DDO, VT Lead via directory search

Sections can be completed in any order. A sidebar stepper tracks progress. Background AI analysis runs automatically and suggests filters/keywords based on the collection's title and description.

### Step 3: Promote to Draft

When the 3 required sections (Datasets, Activities, Terms) are complete, the "Promote to Draft" button in the sidebar becomes enabled. Clicking it navigates to the Review page.

### Step 4: Review

The **Access Provisioning Breakdown** page shows:

- Collection details (name, description, target community — editable)
- Summary metrics (dataset count, activity count, user count)
- Agreement of Terms summary
- The 20/30/40/10 access breakdown:
  - Already Open (green) — no action needed
  - Awaiting Policy (theme color) — instant approval
  - Needs Approval (amber) — GPT/TALT routing required
  - Missing Data Location (grey) — needs discovery
- Training compliance breakdown

The DCM reviews and clicks **"Confirm Draft"** to create the collection.

### Step 5: Draft in Browser

The collection is now a **draft**. It:

- Appears in the collections browser alongside published collections
- Shows a prominent **"DRAFT"** badge on its card
- Is included in search results
- Appears in the Kanban board's "Draft" column

### Step 6: View / Edit Draft

Clicking a draft collection from the browser opens the **collection detail page** — a tabbed layout:

| Tab | Content | Editable |
|-----|---------|----------|
| Overview | Collection summary, status badge, key metrics | Title, description |
| Datasets | List of selected datasets with metadata | "Edit Datasets" button |
| Activities | Selected activities grouped by category | "Edit Activities" button |
| Terms | Agreement of Terms summary | "Edit Terms" button |
| Roles | Assigned roles with user details | "Edit Roles" button |
| Provisioning | 20/30/40/10 access breakdown | Read-only |
| Timeline | Chronological events (concept created, promoted, edits) | Read-only |
| Discussion | Threaded comments and collaboration | Add comments |

A large, prominent, non-dismissible **"THIS IS A DRAFT"** banner is displayed at the top of the page. Clicking any "Edit" button opens the editing interface for that section. Saving changes updates the collection and returns to the tab. Each edit creates a timeline event.

### Step 7: Approve

An **"Approve Collection"** button is visible on the draft detail page to all users (simplified for prototype — no role restrictions). Clicking it shows a confirmation dialog. On confirmation:

- Status transitions from `draft` → `active`
- DRAFT banner is removed
- "Active" status badge appears
- Timeline event records the approval

### Step 8: Active Collection

The collection is now **active**. It:

- Shows in the browser with a green "Active" badge
- Collection detail page is **read-only** (no edit buttons)
- All tabs remain viewable
- In production, this is where ongoing management happens (quarterly reviews, add/remove studies, metadata monitoring)

---

## 3. Current State (What Exists)

### Built and Working

- [x] Create Concept page (variation-2: simple title + description form)
- [x] Concept privacy banner ("only you can see it")
- [x] Workspace overview hub (section cards with completion status)
- [x] Workspace sidebar navigation (stepper, progress dots, "Promote to Draft" button)
- [x] Background AI analysis engine (auto-runs on load, mock 6-8 second processing)
- [x] AI suggestions panel (modal showing detected TAs, modalities, keywords, confidence)
- [x] Dataset browser & selection (ROAM fields, multi-dimensional filters, search, pagination)
- [x] Dataset refine selection (configurable columns modal, sort, filter, remove)
- [x] Activities & purpose section (10+ activities in 4 categories, permitted/not-permitted flags)
- [x] Agreement of terms section (primary use, beyond primary use, publication, conflict detection)
- [x] Roles & approvers section (DCL, DDO, VT Lead with Azure AD mock search)
- [x] Promote to Draft button (validation gate: 3 required sections)
- [x] Review / Access Provisioning Breakdown page (20/30/40/10 split, AoT summary, training)
- [x] Collections browser (grid, list, kanban views; filtering, search, sorting, favorites)
- [x] Collection detail page (basic structure with discussions, timeline, mock data)

### Not Built

- [ ] Promote → Draft persistence (currently just sets sessionStorage flag)
- [ ] Draft visibility in browser
- [ ] DRAFT banner on collection detail
- [ ] Draft editing via collection detail page
- [ ] Approve action
- [ ] Active collection read-only view
- [ ] Mock data store (beyond sessionStorage)

---

## 4. Todo List

### Phase 1: Promote → Draft Creation

| # | Task | Notes |
|---|------|-------|
| 1.1 | Review page "Confirm Draft" button persists collection to mock data store | Move from sessionStorage to shared React context or mock API |
| 1.2 | After confirm, redirect to the new draft's collection detail page | `/collections/[id]` |
| 1.3 | Generate a collection ID on draft creation for URL routing | UUID or incrementing ID |

### Phase 2: Draft Visibility in Browser

| # | Task | Notes |
|---|------|-------|
| 2.1 | Draft collections appear in collections browser alongside published collections | Merge draft into `getPublishedCollections()` or add `getAllCollections()` |
| 2.2 | Draft collections show a prominent "DRAFT" badge on card/row | Visually distinct from other status badges |
| 2.3 | Draft collections are included in search results | Full-text search includes draft name, description, d-codes |
| 2.4 | Kanban board includes "Draft" column | Currently has Draft column but not connected to real drafts |

### Phase 3: Draft Collection Detail Page

| # | Task | Notes |
|---|------|-------|
| 3.1 | Large "THIS IS A DRAFT" banner at top of page | Visually prominent, non-dismissible, consistent style |
| 3.2 | Overview tab: collection summary, status badge, key metrics | Datasets count, activities count, roles count |
| 3.3 | Datasets tab: list of selected datasets with metadata + "Edit Datasets" button | Reuse dataset table from workspace |
| 3.4 | Activities tab: list of selected activities by category + "Edit Activities" button | Group by 4 categories |
| 3.5 | Terms tab: Agreement of Terms summary + "Edit Terms" button | Reuse AoT display from review page |
| 3.6 | Roles tab: assigned roles with user details + "Edit Roles" button | Show DCL, DDO, VT Lead |
| 3.7 | Access Provisioning tab: 20/30/40/10 breakdown | Reuse review page content |
| 3.8 | Timeline tab: chronological events | Concept created, promoted to draft, edits |
| 3.9 | Discussion tab: threaded comments | Existing mock infrastructure |

### Phase 4: Draft Inline Editing

| # | Task | Notes |
|---|------|-------|
| 4.1 | "Edit Datasets" opens dataset editing interface | Reuse workspace datasets page or build inline editor |
| 4.2 | "Edit Activities" opens activity editing interface | Reuse workspace activities page |
| 4.3 | "Edit Terms" opens terms editing interface | Reuse workspace terms page |
| 4.4 | "Edit Roles" opens roles editing interface | Reuse workspace roles page |
| 4.5 | Saving edits updates the collection and returns to detail tab | Update mock store, refresh detail page |
| 4.6 | Edits create timeline events | "3 datasets added", "Terms updated", etc. |

### Phase 5: Approve Action

| # | Task | Notes |
|---|------|-------|
| 5.1 | "Approve Collection" button on draft detail page | Visible to all users (simplified) |
| 5.2 | Confirmation dialog before approving | "This will make the collection active. Proceed?" |
| 5.3 | On approve: status transitions `draft` → `active` | Update mock store |
| 5.4 | DRAFT banner removed, "Active" status badge shown | Visual transition |
| 5.5 | Timeline event: "Collection approved by [user]" | With timestamp |
| 5.6 | Active collection is read-only | No edit buttons, management mode deferred |

### Phase 6: Active Collection View

| # | Task | Notes |
|---|------|-------|
| 6.1 | Active collection shows in browser with green "Active" badge | Consistent with existing badge system |
| 6.2 | Active collection detail page is read-only | All tabs viewable, no edit buttons |
| 6.3 | All tabs remain viewable | Datasets, activities, terms, roles, provisioning, timeline, discussion |

### Phase 7: Cross-Cutting Concerns

| # | Task | Notes |
|---|------|-------|
| 7.1 | Mock data store: shared React context or mock API | Replace sessionStorage for collection persistence |
| 7.2 | URL routing: `/collections/[id]` loads correct collection | From mock store, supports both published and draft |
| 7.3 | Status badge component: reusable, renders for each status | `concept` (grey), `draft` (amber), `active` (green) |
| 7.4 | DRAFT banner component: reusable, prominent, non-dismissible | Shared across any draft-related pages |
| 7.5 | Clean up stale V1 pages no longer in V2 flow | publishing, categories, old filters — if superseded |

---

## 5. Key Files Reference

| File | Purpose | Todo Phases |
|------|---------|-------------|
| `app/collectoid-v2/(app)/dcm/create/workspace/layout.tsx` | WorkspaceContext, Promote handler, AI analysis | Phase 1 |
| `app/collectoid-v2/(app)/dcm/create/review/page.tsx` | Review page, "Submit for Approval" button | Phase 1 (rewire to "Confirm Draft") |
| `app/collectoid-v2/(app)/collections/[id]/page.tsx` | Collection detail page | Phase 3, 4, 5, 6 |
| `app/collectoid-v2/(app)/collections/_variations/variation-v2.tsx` | Collections browser | Phase 2 |
| `app/collectoid-v2/(app)/dcm/create/workspace/datasets/page.tsx` | Dataset browser/editor | Phase 4 (reuse for editing) |
| `app/collectoid-v2/(app)/dcm/create/workspace/activities/page.tsx` | Activities editor | Phase 4 (reuse for editing) |
| `app/collectoid-v2/(app)/dcm/create/workspace/terms/page.tsx` | Terms editor | Phase 4 (reuse for editing) |
| `app/collectoid-v2/(app)/dcm/create/workspace/roles/page.tsx` | Roles editor | Phase 4 (reuse for editing) |
| `lib/dcm-mock-data.ts` | Mock data, Collection type, MOCK_COLLECTIONS | Phase 1, 2, 7 |

---

## 6. Out of Scope (for this prototype)

These are explicitly deferred to production:

- Role-based approval workflow (TA Lead routing, all-or-nothing cross-TA)
- Provisioning automation (Immuta/Starburst policy creation)
- Ongoing lifecycle management (quarterly reviews, opt-in/opt-out)
- Auto-flag on metadata change
- Versioning and change management
- DPO notifications and delivery tracking
- Consumer-facing features (My Access, request dashboard)
- Email notifications
- Audit trail and compliance logging

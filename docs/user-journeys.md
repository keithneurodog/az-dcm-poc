# User Journeys — Collectoid V2

## High-Level User Journeys

### Roles

| Abbr | Role                        |
|------|-----------------------------|
| DCM  | Data Collection Manager     |
| DC   | Data Consumer               |
| TL   | Team Lead                   |
| APP  | Approver (DDO / GPT / TALT) |

### Journey × Role Matrix

Journeys are ordered by priority (core functionality first).

| #  | Journey                              |    DCM     |    DC    |        TL         |    APP     |
|----|--------------------------------------|:----------:|:--------:|:-----------------:|:----------:|
| 1  | Create a data collection             |  **Own**   |    —     |         —         |     —      |
| 2  | Browse & discover collections        |  View all  | View all |     View all      |  View all  |
| 3  | Submit collection for approval       |  **Own**   |    —     |         —         |     —      |
| 4  | Review & approve a collection        |     —      |    —     |         —         |  **Own**   |
| 5  | Access data in a live collection     |     —      | **Own**  | Request on behalf |     —      |
| 6  | Propose changes to a live collection |  **Own**   |    —     |      Request      |     —      |
| 7  | Review & approve a proposition       |     —      |    —     |         —         |  **Own**   |
| 8  | Manage team access & compliance      |     —      |    —     |      **Own**      |     —      |
| 9  | Monitor collection health & status   |  **Own**   | View own |     View team     | View owned |
| 10 | Suspend a collection                 |     —      |    —     |         —         |  **Own**   |
| 11 | Reinstate a suspended collection     | Coordinate |    —     |         —         |  **Own**   |
| 12 | Decommission a collection            |  **Own**   |    —     |         —         |     —      |
| 13 | Complete onboarding & training       |    View    | **Own**  |      **Own**      |    View    |
| 14 | Receive notifications & act on tasks |    All     |   All    |        All        |    All     |
| 15 | Search datasets                      |  **Own**   |  Browse  |         —         |     —      |
| 16 | Manage quarterly review cycle        | Facilitate |    —     |         —         |  **Own**   |
| 17 | Export compliance & audit reports    |  **Own**   |    —     |         —         |    View    |

### Journey Definitions

**1. Create a data collection**
The end-to-end process of a DCM authoring a new Open Access Collection. Begins with creating a lightweight concept (
title and description), then completing sections in a non-linear workspace: adding datasets from the catalog, defining
permitted activities and research purpose, configuring data use terms (primary use, AI/ML, publication, external
sharing, user scope), and assigning roles and access groups. Concludes when the DCM promotes the concept to a formal
draft via a confirmation modal that summarises access impact and flags conflicts.
—
*Refs: [Epic 1](JIRA/epic-01-collection-concept-workspace.md), [BRD FR-COL-001–017](../sprint-zero/02-business-requirements.md), [Data Model](../sprint-zero/03-data-model.md)*

**2. Browse & discover collections**
Any authenticated user can search, filter, and browse published collections (drafts and above) in grid or list view.
Filters include therapeutic area, status, owner, and dataset count. DCMs additionally see their own private concepts.
Users can navigate to collection detail or start a new collection from the browser.
—
*Refs: [Epic 3](JIRA/epic-03-collections-browser.md), [BRD FR-COL-030–035](../sprint-zero/02-business-requirements.md)*

**3. Submit collection for approval**
The DCM finalises a draft collection — confirming all required sections are complete — and submits it into the
multi-stage governance approval pipeline. The collection transitions from `draft` to `pending_approval` and enters the
approval chain (GPT → TALT → DDO).
—
*Refs: [Epic 2](JIRA/epic-02-collection-lifecycle-management.md), [Epic 10](JIRA/epic-10-approval-workflow.md), [BRD FR-COL-020–024](../sprint-zero/02-business-requirements.md)*

**4. Review & approve a collection**
Approvers (DDO, GPT, TALT) review a pending collection's scope, datasets, data use terms, and user list. For multi-TA
collections, all relevant therapeutic area approvers must sign — approval is all-or-nothing. Approvers can approve,
reject (returning to draft for revision), or request changes. Rejection includes mandatory feedback.
—
*Refs: [Epic 10](JIRA/epic-10-approval-workflow.md), [BRD FR-COL-020–024](../sprint-zero/02-business-requirements.md), [Security & Compliance](../sprint-zero/05-security-compliance.md)*

**5. Access data in a live collection**
Data consumers discover a live collection, review its data use terms and permitted activities, and gain access. Access
is provisioned automatically via Immuta policies that were generated when the collection was approved. Team leads can
request access on behalf of their team members. Access may be gated by mandatory training completion.
—
*Refs: [Epic 4](JIRA/epic-04-collection-detail-view.md), [Epic 7](JIRA/epic-07-dataset-management.md), [Integration Map](../sprint-zero/04-integration-map.md)*

**6. Propose changes to a live collection**
After a collection is approved and live, the DCM creates a proposition to modify datasets, data use terms, users, or
activities. Propositions are separate entities with their own lifecycle. Simple in-scope changes (within the approved
OAC boundaries) auto-merge. Out-of-scope changes (e.g. adding a restricted dataset, expanding AI/ML permissions) require
governance re-approval. Multiple concurrent propositions per collection are supported; conflicts are resolved at merge
time.
—
*Refs: [Epic 5](JIRA/epic-05-versioning-change-management.md), [Data Model — Propositions](../sprint-zero/03-data-model.md)*

**7. Review & approve a proposition**
Approvers review a submitted proposition against the existing approved collection scope. They assess whether the
proposed changes introduce new governance concerns (new datasets, expanded terms, additional users). Approvers can
approve, reject, or request changes. Approved propositions are automatically merged into the collection.
— *Refs: [Epic 5](JIRA/epic-05-versioning-change-management.md), [Epic 10](JIRA/epic-10-approval-workflow.md)*

**8. Manage team access & compliance**
Team leads maintain oversight of their team's data access across collections. This includes monitoring which team
members have active access, tracking mandatory training completion, ensuring data use remains within permitted terms,
and revoking access for team members who no longer require it. Team leads are accountable for their staff's compliance.
—
*Refs: [Epic 6](JIRA/epic-06-role-assignment-team-management.md), [BRD — Team Lead persona](../sprint-zero/02-business-requirements.md)*

**9. Monitor collection health & status**
Stakeholders view a collection's current state across both dimensions: governance stage (concept → draft →
pending_approval → approved) and operational state (provisioning → live → suspended → decommissioned). Includes dataset
provisioning progress, access breakdown (users by role/department), and any open propositions. Each role sees
information relevant to their responsibilities.
— *Refs: [Epic 4](JIRA/epic-04-collection-detail-view.md), [Collection State Model](#collection-state-model)*

**10. Suspend a collection**
A DDO or governance body triggers an emergency suspension on a live collection, immediately revoking all user access via
Immuta policy removal. Suspension is used for safety concerns, compliance violations, or legal holds. The collection
transitions from `live` to `suspended` in its operational state. All affected users are notified.
—
*Refs: [Epic 2](JIRA/epic-02-collection-lifecycle-management.md), [Collection State Model](#collection-state-model), [Integration Map — Immuta](../sprint-zero/04-integration-map.md)*

**11. Reinstate a suspended collection**
Once the issue that triggered suspension is resolved, the DCM coordinates with governance to prepare for reinstatement.
The approver (DDO or governance body) reviews the resolution and reinstates the collection, transitioning it from
`suspended` back to `live`. Immuta policies are re-applied and user access is restored. All affected users are notified.
— *Refs: [Epic 2](JIRA/epic-02-collection-lifecycle-management.md), [Collection State Model](#collection-state-model)*

**12. Decommission a collection**
The DCM retires a collection that is no longer needed or has reached end-of-life. All user access is revoked, Immuta
policies are removed, and the collection is soft-deleted (preserved for audit trail but no longer visible in the
browser). Can be triggered from either `live` or `suspended` operational state.
— *Refs: [Epic 2](JIRA/epic-02-collection-lifecycle-management.md), [Collection State Model](#collection-state-model)*

**13. Complete onboarding & training**
New users are introduced to the platform through a guided onboarding flow (welcome screen, feature tour, key concepts).
Data consumers and team leads must complete mandatory training before accessing data — training completion status may be
sourced from an external LMS. Training status is visible to team leads (compliance view) and may gate collection access
requests.
— *Refs: [Epic 9](JIRA/epic-09-introduction-onboarding.md)*

**14. Receive notifications & act on tasks**
All users receive contextual notifications triggered by system events: approval requests, status changes, access
grants/revocations, proposition updates, training reminders, and quarterly review deadlines. Users can act directly from
notifications (e.g. navigate to an approval queue, review a proposition). Notification preferences are configurable per
user.
— *Refs: [Epic 11](JIRA/epic-11-notification-system.md)*

**15. Search datasets**
DCMs search for relevant datasets to add to a collection. Includes standard catalog browsing with filters (therapeutic
area, study phase, data modality) and AI-assisted discovery where the user describes their research intent in natural
language and receives ranked dataset recommendations with relevance explanations.
— *Refs: [Epic 8](JIRA/epic-08-search-ai-discovery.md), [BRD FR-DSC-001](../sprint-zero/02-business-requirements.md)*

**16. Manage quarterly review cycle**
A periodic governance process where all active (live) collections are reassessed. The DCM facilitates the cycle —
compiling status, chasing responses, flagging overdue reviews. Approvers (DDOs) review each collection under their
ownership to confirm continued business justification, verify user lists are current, and make opt-in/opt-out decisions
on individual studies. Outcomes include confirmation for another quarter, a proposition for changes, or a recommendation
to decommission.
—
*Refs: [Epic 2](JIRA/epic-02-collection-lifecycle-management.md), [BRD FR-COL-020–024](../sprint-zero/02-business-requirements.md), [Security & Compliance](../sprint-zero/05-security-compliance.md)*

**17. Export compliance & audit reports**
DCMs and approvers generate reports on collection access history, data usage, governance decisions, and audit trails.
Reports support regulatory submissions, internal compliance reviews, and quarterly governance reporting. Includes export
of who accessed what data, under which terms, and when.
—
*Refs: [Epic 4](JIRA/epic-04-collection-detail-view.md), [Security & Compliance](../sprint-zero/05-security-compliance.md)*

---

## Detailed User Journeys

### Create Collection

- Start new concept (title & description)
- View & navigate workspace hub
- Edit collection details inline
- Share concept link
- Add datasets (browse, filter, or AI search)
- Review AI-suggested filters & keywords
- Define activities & permitted use
- Configure data use terms & detect conflicts
- Assign access groups & users
- Review access provisioning breakdown
- Promote concept to draft

### Browse & Discover

- Browse public collections (grid/list, search, filter)
- View my private concepts
- Create a new collection from browser

### View Collection

- View overview (health, progress, access breakdown)
- View dataset status & filter by access state
- View data use terms
- View user access status
- View timeline
- View & post discussion comments

### Manage Collection (Draft/Active)

- Edit datasets (add/remove from catalog)
- Edit activities & purpose
- Edit data use terms
- Edit access groups and users
- Submit draft for approval
- Review approval status & pending decisions

## Collection State Model

A collection's state is described by two independent dimensions:

### 1. Governance Stage — where is it in the approval pipeline?

```
concept → draft → pending_approval → approved
                                   ↘ rejected → draft (revision)
```

| Transition                  | Triggered by      | Detail                                                                     |
|-----------------------------|-------------------|----------------------------------------------------------------------------|
| concept → draft             | DCM (manual)      | DCM completes all required sections and promotes via confirmation modal    |
| draft → pending_approval    | DCM (manual)      | DCM submits draft for governance review                                    |
| pending_approval → approved | GPT/TALT (manual) | Governance teams review and approve — all-or-nothing across approval chain |
| pending_approval → rejected | GPT/TALT (manual) | Governance rejects — returns to draft for revision                         |

### 2. Operational State — what's the runtime status? (only applies once approved)

```
provisioning → live → suspended → live (or decommissioned)
                    → decommissioned
```

| Transition                 | Triggered by              | Detail                                                 |
|----------------------------|---------------------------|--------------------------------------------------------|
| → provisioning             | System (auto)             | Immuta policies generated automatically on approval    |
| provisioning → live        | System (auto)             | All policies applied, access granted to users          |
| live → suspended           | DDO / governance (manual) | Emergency stop — access immediately revoked via Immuta |
| suspended → live           | DDO / governance (manual) | Issue resolved, access reinstated                      |
| live → decommissioned      | DCM (manual)              | Collection no longer needed, soft-deleted for audit    |
| suspended → decommissioned | DCM (manual)              | Suspended collection permanently retired               |

### Propositions

Propositions are a separate entity representing proposed changes to a live collection. Whether a collection has open
propositions is derived via query, not stored as state on the collection itself. Multiple propositions per collection
are allowed concurrently; conflicts are resolved at merge time (like git branches).

**Proposition lifecycle:**

```
draft → submitted → approved → merged
                  → rejected
```

Simple changes (within approved OAC scope) may skip approval and go straight from `submitted` to `merged`.

| Transition           | Triggered by      | Detail                                                                        |
|----------------------|-------------------|-------------------------------------------------------------------------------|
| draft → submitted    | DCM (manual)      | DCM submits a proposition to modify datasets, AoT, users, etc.                |
| submitted → approved | GPT/TALT (manual) | Proposition requires and receives re-approval (e.g. restricted dataset added) |
| submitted → merged   | System (auto)     | Proposition auto-merged — no governance impact (within approved scope)        |
| submitted → rejected | GPT/TALT (manual) | Proposition rejected by governance                                            |
| approved → merged    | System (auto)     | Approved proposition merged into collection                                   |

### Example composite states

| Governance | Operational  | Meaning                                        |
|------------|--------------|------------------------------------------------|
| approved   | live         | Normal active collection                       |
| approved   | suspended    | Emergency-stopped                              |
| approved   | provisioning | Just approved, Immuta policies being generated |
| draft      | —            | Still being authored by DCM                    |

# My Requirements

- I'd like an initial agreement meeting on the UI design and approach of implementation.
-
    - Demo the concept of a data collection concept and the approval flow around it :D
-
    - The idea here is that we could initially start by delivering a basic skeleton of the UI, with 'Coming soon' / '
      WIP' elements to display future work.
-
    - We could link to JIRA stories and use summary text to explain unimplemented features so that the application feels
      fully fledged and professional even if it's not yet fully implemented.
- Meeting to agree on tech stack / infrastructure / testing methodology


Create a data collection
DCM builds a collection from scratch: datasets, activities, terms, roles. Starts as private concept, promotes to draft when ready.
Browse & discover collections
Search and filter published collections. DCMs also see their own concepts.
Submit collection for approval
DCM marks a draft as ready and pushes it into the approval chain (GPT, TALT, DDO).
Review & approve a collection
Approvers review scope, terms, users. All relevant TA leads must sign. Reject sends it back to draft.
Access data in a live collection
Consumers find a live collection, check the terms, get access via Immuta. Team leads can request on behalf.
Propose changes to a live collection
DCM raises a proposition to change datasets, terms or users. In scope changes auto merge, out of scope needs reapproval.
Review & approve a proposition
Approvers assess whether proposed changes break existing scope. Approve, reject or request changes.
Manage team access & compliance
Team leads track who has access, training status, and whether usage stays within terms.
Monitor collection health & status
View governance stage, operational state, provisioning progress and access breakdown. Each role sees what matters to them.
Suspend a collection
DDO or governance pulls the emergency brake. Access revoked immediately via Immuta.
Reinstate a suspended collection
Issue resolved, approver flips it back to live. Immuta policies reapplied.
Decommission a collection
DCM retires a collection. Access revoked, soft deleted for audit.
Complete onboarding & training
New users go through platform intro. Training may gate data access.
Receive notifications & act on tasks
System events trigger notifications. Users act directly from them.
Search datasets
Browse the catalog or describe what you need in plain language and let AI rank matches.
Manage quarterly review cycle
Periodic check on all live collections. Still needed? Users still valid? Studies still appropriate?
Export compliance & audit reports
Pull reports on who accessed what, when, under which terms.


after wednesday, merge v2 into v1 create flow ready for rafas feedback meet on friday

# Collectoid V2 - UX Roles & System Design

**Created:** 2026-01-26
**Updated:** 2026-01-26
**Status:** Draft - Active Development
**Related:** `collectoid-v2-roles-matrix.md` (real-world AZ roles reference)
**Sources:** ROAM Guidance v1.1, Emails (Nov 2025, Jan 2026), JIRA VS2-329 to VS2-340

---

## Purpose

This document defines the **Collectoid system roles** - the personas users assume when interacting with the application. These UX roles may map to one or more real-world AZ organizational roles, abstracting complexity while maintaining appropriate separation of concerns.

---

## Design Principles

1. **Simplicity over complexity** - Minimize role count while maintaining necessary separation
2. **Action-based** - Roles defined by what users can DO, not who they ARE
3. **Flexible mapping** - One person may hold multiple UX roles; one UX role may serve multiple AZ roles
4. **Demo-friendly** - Roles should clearly demonstrate different user journeys

---

## Process Flow (from Email Documentation)

Based on the Nov 2025 provisioning handover email, the actual process involves 13 steps:

```
1. Business demand for collection/update/policy change
2. Early notification to DPO with intent, draft criteria, anticipated users
3. Translate criteria to stable metadata attributes
4. Produce definitive asset list (study d-codes)
5. Identify and assign Data Consumer Lead, Data Owner
6. Obtain approved artifacts (OAC, AOT, trainings)
7. Confirm ethical/legal/data-owner approvals
8. DPO configures Ranger/Starburst policies study-by-study
9. Enable access in specified analysis environments
10. Update tracker with per-modality, per-source, per-environment status
11. Cross-check for conflicting requests (duplicates)
12. Version changes and notify impacted teams
13. Maintain audit trail (who approved what, when, where)
```

### Multi-TA Approval Requirement

From January 2026 email (Adobe Sign):
> For cross-TA data collection studies, **ALL relevant TA Leads must sign**. The approval process operates on an "all or nothing" principle. If any single TA Lead fails to provide signature approval, the data collection cannot be enabled for users in ANY of the therapeutic areas involved.

---

## JIRA Story to Role Mapping

| Story | Feature | Primary Role(s) |
|-------|---------|-----------------|
| VS2-329 | Criteria and rules for assets | DPO Officer |
| VS2-330 | User scope (virtual teams) | DDO |
| VS2-331 | Due diligence/compliance output | DPO Officer |
| VS2-332 | Data modalities selection | Data Consumer Lead |
| VS2-333 | Data sources specification | DDO |
| VS2-334 | Consumption environments | DDO |
| VS2-335 | Versioning and change management | DDO + DPO |
| VS2-336 | Operations tracker (full view) | DDO + DPO + Data Consumer Lead |
| VS2-337 | Request tracker (consumer view) | Data Consumer |
| VS2-338 | DPO delivery tracker | DPO Officer |
| VS2-339 | Approval execution | DPO Officer |
| VS2-340 | Cross-checks for duplicates | DDO + DPO + Data Consumer Lead |

---

## Proposed UX Roles

### 1. DCM (Data Collection Manager)

**Description:** The primary "power user" role for managing the lifecycle of data collections.

**Maps to real-world roles:**
- R&D Data Office Lead
- R&D Data Office team members
- Designated collection administrators

**Functional Areas:**

| Area | Capabilities |
|------|-------------|
| **Collection Creation** | Create new collection proposals, Define OAC scope, Define AOT terms, Submit for approval |
| **Collection Modification** | Suggest scope changes, Add/remove studies, Update terms, Request re-approval when needed |
| **Collection Lifecycle** | Archive collections, Reactivate collections, Delete draft collections |
| **User Management** | Add/remove users from collections, Manage user group definitions, Track user compliance |
| **Study Management** | Manage opt-in/opt-out lists, Prepare quarterly review materials, Update study metadata |
| **Collaboration** | Post in discussion boards, Respond to comments, Tag stakeholders, Create tasks |
| **Reporting** | View collection metrics, Export reports, Track approval status |

**Key Screens:**
- Dashboard (collection overview, pending actions)
- Collection Builder (create/edit flow)
- Collection Detail (management view)
- Study Manager
- User Manager
- Quarterly Review Workspace

---

### 2. Approver

**Description:** Users who review and approve/reject collection proposals and changes.

**Maps to real-world roles:**
- DDO (Delegate Data Owner)
- GPT members
- TALT members
- Alliance Managers

**Design Question:** Do we need sub-types of Approver, or can we handle approval routing through the workflow?

**Option A: Single Approver Role**
- All approvers see their relevant queue
- System routes requests to appropriate approvers based on:
  - Therapeutic area (GPT routing)
  - Legal requirements (TALT routing)
  - Data ownership (DDO routing)
  - Partnership status (Alliance routing)
- Pros: Simpler UX, fewer roles to switch between
- Cons: May obscure important distinctions

**Option B: Typed Approver Roles**
- DDO Approver (data ownership decisions)
- Compliance Approver (legal/TALT decisions)
- Domain Approver (GPT therapeutic area decisions)
- Pros: Clear separation of concerns
- Cons: More complex, more roles to manage

**Recommendation:** Start with **Option A** (single Approver role) and let the approval workflow handle routing. This simplifies the demo while the underlying data model can support typed approvals.

**Functional Areas:**

| Area | Capabilities |
|------|-------------|
| **Review Queue** | View pending approvals, Filter by type/urgency/TA, Sort by SLA |
| **Approval Actions** | Approve with comments, Reject with mandatory reason, Request changes, Delegate to another approver |
| **Quarterly Review** | Review opt-in/opt-out proposals, Approve/reject study inclusions, Flag business sensitivity |
| **Audit** | View approval history, Access decision rationale, Export compliance reports |
| **Collaboration** | Participate in discussions, Ask clarifying questions, Tag other approvers |

**Key Screens:**
- Approval Queue (primary view)
- Request Detail (review interface)
- Quarterly Review Dashboard
- Approval History

---

### 3. Data Consumer

**Description:** End users who access data through collections. They discover, request, and use data within approved terms.

**Maps to real-world roles:**
- Data Scientists
- Statisticians
- Bioinformaticians
- Research Scientists
- Programmers
- Clinical Pharmacometricians
- All other data users

**Functional Areas:**

| Area | Capabilities |
|------|-------------|
| **Discovery** | Browse available collections, Search for data, View collection details, Check access eligibility |
| **Access Status** | View current access, See pending requests, Understand terms and restrictions |
| **Request Access** | Request access to collections, Provide justification, Track request status |
| **Compliance** | View training requirements, Confirm terms acceptance, Submit Project Completion Forms |
| **Collaboration** | Comment on collections (limited), Ask questions, Report issues |

**Key Screens:**
- Discovery/Browse Collections
- Collection Detail (consumer view - read-only)
- My Access Dashboard
- Request Status Tracker
- Training & Compliance

---

### 4. Team Lead

**Description:** Managers who oversee their team's data access and usage. Accountable for team compliance.

**Maps to real-world roles:**
- Data Consumer Lead
- Department heads
- Team managers

**Functional Areas:**

| Area | Capabilities |
|------|-------------|
| **Team Oversight** | View team members' access, Monitor compliance status, Track training completion |
| **Access Management** | Request access on behalf of team, Approve team member requests, Revoke access |
| **Compliance** | Review team activity, Ensure terms adherence, Submit team-level forms |
| **Reporting** | Team access reports, Usage metrics, Compliance dashboards |

**Key Screens:**
- Team Dashboard
- Team Member Management
- Compliance Overview
- Access Requests (team view)

---

### 5. DPO Officer (Backend Role - NOT a Collectoid UX Role)

**Status:** DECIDED - Backend only. DPO staff needing Collectoid access will use DCM role.

**Rationale:** DPO operations (compliance verification, policy configuration, provisioning execution) happen outside of Collectoid. DPO staff who need involvement in collection management can use the DCM role - no unique DPO-specific responsibilities within Collectoid at this time.

**What Collectoid Shows (read-only):**
- Status indicators (pending DPO review, approved, blocked, provisioned)
- Tracking information from DPO systems
- Compliance status per study (populated by DPO backend)
- Delivery progress (populated by DPO backend)

**What Collectoid Does NOT Do:**
- No DPO-specific screens or actions
- No compliance data entry (that happens in DPO systems)
- No provisioning triggers (DPO handles externally)

**JIRA Stories Impact:**
The JIRA stories (VS2-329, VS2-331, VS2-338, VS2-339, VS2-340) that mention DPO will be implemented as:
- DCM-visible status/tracking views
- Backend integrations that surface DPO data
- Not as a separate DPO user role

---

### 6. Systems Admin (Future Consideration)

**Description:** Platform-level provisioning role for Ranger/Immuta/Starburst/etc.

**Maps to real-world roles:**
- Systems Teams (Ranger, Immuta, Starburst, PDP, SCP, Domino, AI Bench, IO platform)
- Platform owners

**Status:** Likely out of scope for Collectoid v2 - these are downstream systems that receive instructions from DPO.

**Note from email:** These teams "execute changes as requested, support audit trails" but may not need a Collectoid UI role.

---

## Role Mapping Matrix

| Collectoid UX Role | Real-World AZ Roles | Primary Function | JIRA Stories |
|-------------------|---------------------|------------------|--------------|
| **DCM** | R&D Data Office Lead, Data Office team, DPO staff (if needed) | Create & manage collections | VS2-329, VS2-331, VS2-335, VS2-336, VS2-338, VS2-339, VS2-340 |
| **Approver** | DDO/TA Lead, GPT, TALT, Alliance Manager | Review & approve | VS2-330, VS2-333, VS2-334 |
| **Data Consumer** | Data Scientists, Statisticians, Researchers, etc. | Discover & use data | VS2-337 |
| **Team Lead** | Data Consumer Lead, Dept heads | Oversee team access, propose criteria | VS2-332, VS2-336 |

**Note:** DPO Officer is backend-only. DPO staff use DCM role if Collectoid access needed. DPO-related JIRA stories are surfaced as tracking/status views within DCM.

---

## Functional Areas Overview

### A. Collection Lifecycle

```
DRAFT → SUBMITTED → IN REVIEW → APPROVED → ACTIVE → [ARCHIVED]
                        ↓
                    REJECTED/CHANGES REQUESTED
```

| Stage | DCM | Approver | Team Lead | Consumer |
|-------|-----|----------|-----------|----------|
| Create Draft | **Full** | - | - | - |
| Edit Draft | **Full** | - | - | - |
| Submit | **Full** | - | - | - |
| Review | View | **Full** | - | - |
| Approve/Reject | - | **Full** | - | - |
| Manage Active | **Full** | Limited | - | - |
| Archive | **Full** | Approve | - | - |

### B. User/Access Management

| Action | DCM | Approver | Team Lead | Consumer |
|--------|-----|----------|-----------|----------|
| Add users to collection | **Full** | - | Request | - |
| Remove users | **Full** | - | Own team | - |
| Define user groups | **Full** | Approve | - | - |
| View user list | **Full** | **Full** | Own team | - |
| Request access | - | - | For team | **Self** |

### C. Study/Data Management

| Action | DCM | Approver | Team Lead | Consumer |
|--------|-----|----------|-----------|----------|
| Add studies to collection | **Full** | - | - | - |
| Remove studies | **Full** | Approve | - | - |
| Opt-in/opt-out decisions | Propose | **Approve** | - | - |
| View study list | **Full** | **Full** | Own collections | Own collections |
| Update study metadata | **Full** | - | - | - |

### D. Approval Workflow

| Action | DCM | Approver | Team Lead | Consumer |
|--------|-----|----------|-----------|----------|
| Submit for approval | **Full** | - | - | - |
| View approval status | **Full** | **Full** | Own requests | Own requests |
| Approve/Reject | - | **Full** | - | - |
| Request changes | - | **Full** | - | - |
| Respond to feedback | **Full** | - | Comment | Comment |

### E. Collaboration

| Action | DCM | Approver | Team Lead | Consumer |
|--------|-----|----------|-----------|----------|
| Create discussion thread | **Full** | **Full** | **Full** | Limited |
| Post comments | **Full** | **Full** | **Full** | **Full** |
| @mention users | **Full** | **Full** | **Full** | **Full** |
| Resolve threads | **Full** | **Full** | Own threads | - |

---

## Approval Workflow Design

### Types of Approvals Needed:

1. **Collection Creation Approval**
   - Who approves: DDO (data ownership), potentially TALT (legal)
   - What's reviewed: OAC scope, AOT terms, user scope

2. **Collection Modification Approval**
   - Who approves: Depends on change type
   - Scope change: DDO re-approval
   - Terms change: DDO re-approval
   - Minor updates: May not need approval

3. **Study Opt-in/Opt-out Approval**
   - Who approves: DDO (quarterly review)
   - What's reviewed: Study list, legal restrictions, business sensitivity

4. **Access Request Approval** (the 10%)
   - Who approves: GPT (domain), TALT (legal), DDO (data)
   - Routing: Based on request type and data involved

### Approval Routing Logic:

```
Request submitted
    ↓
System determines approval type
    ↓
Routes to appropriate queue(s):
    - Legal review required? → TALT queue
    - Domain approval required? → GPT queue
    - Data ownership decision? → DDO queue
    - Partnership data? → Alliance queue
    ↓
Sequential or parallel approval (configurable)
    ↓
All approvals complete → Request approved
```

---

## Open Questions

### Questions Requiring AZ Clarification

#### Q1: Data Consumer Lead Role Confusion
**Status:** Awaiting AZ confirmation

**In ROAM Guidance:** Data Consumer Lead oversees team compliance, accountable for staff's work within AOT bounds.

**In Email (Nov 2025):** Data Consumer Lead defines intent, proposes criteria, supplies asset lists, nominates Collection Leader.

**Question:** Are these the same role with dual responsibilities, or different roles with confusing naming?

---

#### Q2: DDO vs TA Lead Terminology
**Status:** Awaiting AZ confirmation

**Observation:** Documents use both "DDO" (Delegate Data Owner) and "TA Lead" for approvers. Context suggests they may be the same (VP Biometrics level), but terminology is inconsistent.

**Question:** Are DDO and TA Lead synonymous or distinct roles?

---

#### Q3: DPO Officer - Should This Be a UX Role?
**Status:** RESOLVED - Backend only

**Decision:** DPO is a backend operation. DPO staff needing Collectoid access will use the DCM role. Collectoid surfaces DPO status/tracking data but does not provide DPO-specific workflows.

**Implementation:**
- JIRA stories mentioning DPO (VS2-329, VS2-331, VS2-338, VS2-339, VS2-340) will be implemented as DCM-visible tracking views
- Compliance and delivery status will be read-only data from DPO backend systems

---

### Internal Design Questions

1. **Should DCM be split?**
   - Collection Creator vs Collection Manager?
   - Or keep unified for simplicity?

2. **Approver sub-types:**
   - Single role with routing (recommended)?
   - Or explicit DDO/GPT/TALT/Alliance roles?

3. **Team Lead necessity:**
   - Is this distinct enough from Data Consumer?
   - Could be a "capability" on Consumer rather than separate role?

4. **Read-only roles:**
   - Do we need a "Viewer" role for stakeholders?
   - Audit/compliance observers?

5. **Delegation:**
   - Can DCM delegate to others?
   - Can Approvers delegate approval authority?

6. **Escalation:**
   - What happens when approval is overdue?
   - Who can escalate?

7. **Bulk operations:**
   - Can DCM bulk-add users?
   - Can Approver bulk-approve?

---

## Demo Personas (Updated)

Based on UX roles, recommended demo personas:

| Persona | UX Role | Demo Focus |
|---------|---------|------------|
| **Sarah Chen** | DCM | Collection creation, management, quarterly review prep |
| **Dr. James Miller** | Approver (DDO type) | Approval queue, opt-in/out decisions |
| **Rachel Thompson** | Approver (GPT type) | Domain-specific approvals |
| **Dr. Maria Santos** | Team Lead | Team access oversight, compliance |
| **Alex Kim** | Data Consumer | Discovery, access requests, terms |

---

## Next Steps

1. [ ] Decide on Approver sub-type approach (Option A vs B)
2. [ ] Decide if Team Lead is separate role or Consumer capability
3. [ ] Define detailed approval workflow for each approval type
4. [ ] Map screens to each role
5. [ ] Design role switcher component
6. [ ] Create role introduction landing page

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-26 | Initial UX roles document created | Claude |
| 2026-01-26 | Added process flow from email docs, JIRA story mappings, DPO Officer role consideration, AZ clarification questions | Claude |


# Collectoid V2 - User Roles & Responsibilities Matrix

**Created:** 2026-01-26
**Updated:** 2026-01-26
**Source Documents:** ROAM Guidance v1.1, AOT Templates, OAC Agreements, Workshop Outputs, Provisioning Handover Email (Nov 2025), Adobe Sign Email (Jan 2026), JIRA VS2-329 to VS2-340
**Status:** Draft - Requires Review

---

## Overview

This document consolidates all user role information from the DOVS2 documentation to inform the Collectoid V2 UI persona system. The goal is to understand:
1. Who are the key actors in the ROAM workflow?
2. What are their responsibilities?
3. What UI actions should each role be able to perform?
4. What data/views are role-specific?

---

## Core Accountability Roles (from ROAM Guidance v1.1)

These are the three roles with formal accountability in the ROAM process:

### 1. Data Owner / Delegate Data Owner (DDO)

**Definition:** Data Owners are accountable for data, including how that data is used and any risks associated. They typically operate through assigned Delegate Data Owners.

**Accountability:**
- Approve creation of new Open Access Collections (OAC Agreement)
- Approve Agreements of Terms (AOT) associated with their data
- Approve who accesses what data and the associated terms
- Can flag and exclude specific studies due to business sensitivity
- Final authority on opt-in/opt-out decisions in quarterly reviews

**Named Examples (from AOT docs):**
- Renee Iacona, SVP Oncology Biometrics (TALT Delegate Data Owner)
- Christopher Miller, VP and Head of Biometrics R&I
- John Adler, VP and Head of Biometrics CVRM
- Ian Hirsch, VP and Head of Biometrics V&I

**UI Actions (Collectoid):**
- [ ] View collections under their ownership
- [ ] Review and approve new OAC Agreements
- [ ] Review and approve AOT requests
- [ ] Opt-in/opt-out studies in quarterly review
- [ ] Flag studies for exclusion (business sensitivity)
- [ ] View audit trail of decisions
- [ ] Delegate approval to others

---

### 2. Data Consumer Lead

**Definition:** Accountable for work done by their staff. Must ensure data use falls within AOT bounds.

**Accountability:**
- Review and abide by the AOT
- Ensure access provides desired business benefit
- Accountable for ensuring all associated data use by their staff falls within permitted terms
- Must identify which specific users will be granted access
- Complete Project Completion Form on behalf of teams

**Named Examples (from AOT docs):**
- Jorge Ries-Filho, VP ODSAI
- Leora Horne, SVP Late Development
- Matt Hellmann, SVP Early Oncology Development

**UI Actions (Collectoid):**
- [ ] View collections their teams have access to
- [ ] View AOT terms and conditions
- [ ] Manage team member access requests
- [ ] View team activity and compliance status
- [ ] Submit/track Project Completion Forms
- [ ] Receive notifications about AOT changes
- [ ] Request new access for team members

---

### 3. R&D Data Office Lead

**Definition:** Owns the creation and definition of both OAC Agreement and AOT. Facilitates processes for open access setup, maintenance, and compliance audit.

**Accountability:**
- Create and define OAC Agreements
- Create and define AOTs
- Facilitate open access setup processes
- Manage subsequent maintenance operations
- Run compliance audits
- Approve AOT (assert it's within R&D policies)
- Commit to delivery, change management, and maintenance
- Own the Collections Manager (Study Manager & People Manager)

**Named Examples:**
- Peder Blomgren, VP R&D Data Office

**UI Actions (Collectoid):**
- [ ] Create new OAC Agreements
- [ ] Create new AOTs
- [ ] Manage collections (add/remove studies)
- [ ] Manage user lists (People Manager)
- [ ] Route approvals to DDOs
- [ ] Run compliance checks
- [ ] View/export audit trails
- [ ] Configure opt-in/opt-out criteria
- [ ] Prepare quarterly review lists
- [ ] Update collection scope within approved boundaries

---

## DPO Officer Role (Backend Only - NOT a Collectoid UX Role)

**Source:** Provisioning Handover Email (Nov 2025), JIRA VS2-329, VS2-331, VS2-338, VS2-339

**Status:** DECIDED - Backend only. DPO staff needing Collectoid access will use DCM role.

**Definition:** Operational role responsible for provisioning operations - validates compliance, configures policies, executes provisioning, tracks delivery. These operations happen OUTSIDE of Collectoid.

**From Email:**
> **Provisioning Operations (DPO)** - A team which validates due diligence completion or executes pending checks, configures policies (Ranger/Starburst), executes provisioning across modalities and environments, updates trackers.

**DPO Accountability (handled externally):**
- Validate criteria map to stable metadata fields
- Document ethical and legal status for each study
- Track delivery progress per study/modality/source
- Confirm no outstanding checks before provisioning
- Cross-check for duplicate requests

**How Collectoid Handles DPO-Related JIRA Stories:**

| Story | Feature | Collectoid Implementation |
|-------|---------|---------------------------|
| VS2-329 | Criteria and rules for assets | DCM sees validation status (read-only from DPO) |
| VS2-331 | Due diligence output | DCM sees compliance status per study (read-only) |
| VS2-338 | DPO delivery tracker | DCM sees delivery progress (read-only) |
| VS2-339 | Approval execution | DCM sees provisioning status (triggered externally) |
| VS2-340 | Cross-checks | DCM sees duplicate alerts (generated by DPO systems) |

**Rationale:** DPO staff who need to interact with Collectoid will do so using the DCM role. There are no unique DPO-specific responsibilities within Collectoid at this stage.

---

## NEW: Systems Teams / Platform Owners (from Email)

**Source:** Provisioning Handover Email (Nov 2025)

**From Email:**
> **Systems Teams (Ranger/Immuta/Starburst/PDP/SCP/Domino/AI Bench/IO platform)** - Groups/Team/Platform Owners who execute changes as requested, support audit trails.

**Accountability:**
- Execute policy changes requested by DPO
- Support audit trail requirements
- Manage platform-specific access controls

**Status:** Likely out of scope for Collectoid v2 UI - these are downstream systems that receive instructions from DPO.

---

## Operational Roles (from AOT Responsibility Matrix)

These roles handle day-to-day operations within the ROAM framework:

### 4. Scientific Data Provisioning Rep

**Responsibility Areas:**
- Process Management
- Contractual Restrictions review
- Legal & Ethical Basis review

**UI Actions (Collectoid):**
- [ ] Review studies for legal restrictions
- [ ] Update study metadata (legal status)
- [ ] Process access requests
- [ ] Track provisioning status

---

### 5. Data Preparation Rep

**Responsibility Areas:**
- Data Availability verification

**UI Actions (Collectoid):**
- [ ] Update data location status
- [ ] Mark studies as "data available" or "location unknown"
- [ ] Track PDP pipeline status

---

### 6. Product Team

**Responsibility Areas:**
- Business Sensitivity assessment

**UI Actions (Collectoid):**
- [ ] Flag studies for business sensitivity review
- [ ] Approve/reject studies based on sensitivity
- [ ] View studies by product

---

## Data Consumer Roles (End Users)

These are the actual users of the data, defined by department and role type:

### User Scope - By Department & Role Type

**From Oncology Closed Collection AOT:**

| Department | Role Types |
|------------|------------|
| Oncology Data Science & AI (ODSAI) | Data Scientist, Data Engineer, Bioinformatician, Computational Pathologist, Data Analyst |
| Early/Late Oncology Development | Research Scientist |
| Oncology Biometrics | Programmer, Statistician |

**From BioPharma Closed Collection AOT:**

| Department | Role Types |
|------------|------------|
| Biometrics (CVRM, R&I, V&I) | Statisticians, Statistical Programmers, Data Scientists, Clinical Information Scientists |
| CPQP | Clinical Pharmacometricians |
| TSEM & Early Development | Data Scientists, Bioinformaticians |

**UI Actions (Collectoid - for Data Consumers):**
- [ ] View collections they have access to
- [ ] Understand access terms (what they can/cannot do)
- [ ] Check training completion status
- [ ] View their access requests and status
- [ ] Submit Project Completion Forms
- [ ] Discover available data (via Sherlock integration)

---

## Approval Chain Roles

These roles appear in approval workflows:

### 7. GPT (Governance Project Team)

**Examples:** GPT-Oncology, GPT-Cardiovascular, etc.

**Responsibility:**
- Domain-specific approval for therapeutic areas
- Review requests outside standard open collections

**UI Actions (Collectoid):**
- [ ] Review access requests for their TA
- [ ] Approve/deny with mandatory comments
- [ ] View pending requests queue

---

### 8. TALT (Legal/Compliance)

**Responsibility:**
- Legal compliance review
- Cross-border data transfer approval
- Alliance agreement verification

**UI Actions (Collectoid):**
- [ ] Review requests requiring legal sign-off
- [ ] Approve/deny with mandatory comments
- [ ] Flag studies with legal restrictions

---

### 9. Alliance Manager

**Responsibility:**
- Partnership data sharing approvals
- Collaborative agreement verification

**UI Actions (Collectoid):**
- [ ] Review collaborative data requests
- [ ] Verify alliance agreements
- [ ] Approve/deny partnership access

---

## Role-Based UI Views Summary

| Collectoid Role | Real-World Roles | Primary View | Key Actions |
|-----------------|------------------|-------------|-------------|
| **DCM** | R&D Data Office Lead, DPO staff (if needed) | Collections Manager | Create/manage collections, Route approvals, View DPO status |
| **Approver** | DDO, GPT/TALT, Alliance Manager | Approval Queue | Approve OAC/AOT, Quarterly Review, Opt-in/out |
| **Team Lead** | Data Consumer Lead | Team Dashboard | Manage team access, Track compliance |
| **Data Consumer** | Data Scientists, Statisticians, etc. | My Access | View access, Check terms, Complete training |

**Note:** DPO-related functionality (compliance status, delivery tracking) is surfaced as read-only views within DCM role.

---

## Process Steps & Role Involvement

### Original ROAM Process (6 Steps)

| Step | Primary Role | Supporting Roles |
|------|--------------|------------------|
| **(A) Agreement in Principle** | R&D Data Office Lead | DDOs, Data Consumer Leads |
| **(B) OAC Agreement** | R&D Data Office Lead | DDOs (approve) |
| **(C) Data Use Terms** | R&D Data Office Lead | DDOs (approve), Data Consumer Leads (review) |
| **(D) Implement Open Access** | R&D Data Office Lead | Data Provisioning Reps, Data Prep Reps |
| **(E) Access Granted** | Data Consumers | Data Consumer Leads (oversight) |
| **(F) Maintain Collections** | R&D Data Office Lead | DDOs (quarterly review), Compliance |

### Detailed Process Flow (from Nov 2025 Email - 13 Steps)

| Step | Description | Roles Involved |
|------|-------------|----------------|
| 1 | Business demand for collection/update/policy change | Data Consumer Lead (initiates) |
| 2 | Early notification to DPO with intent, criteria, users | Data Consumer Lead → DPO |
| 3 | Translate criteria to stable metadata attributes | DPO, R&D Data Office |
| 4 | Produce definitive asset list (study d-codes) | DPO, R&D Data Office |
| 5 | Identify and assign Data Consumer Lead, Data Owner | R&D Data Office |
| 6 | Obtain approved artifacts (OAC, AOT, trainings) | R&D Data Office, DDOs |
| 7 | Confirm ethical/legal/data-owner approvals | DPO (validates) |
| 8 | DPO configures Ranger/Starburst policies | DPO → Systems Teams |
| 9 | Enable access in specified environments | DPO → Systems Teams |
| 10 | Update tracker with statuses | DPO |
| 11 | Cross-check for conflicting requests | DPO |
| 12 | Version changes and notify teams | R&D Data Office, DPO |
| 13 | Maintain audit trail | All roles |

---

## Complete JIRA Story Mapping

| Story | Title | Primary Role | Secondary Roles |
|-------|-------|--------------|-----------------|
| VS2-329 | Criteria and rules for assets | DPO Officer | R&D Data Office |
| VS2-330 | User scope (virtual teams) | DDO | R&D Data Office |
| VS2-331 | Due diligence output | DPO Officer | Compliance |
| VS2-332 | Data modalities selection | Data Consumer Lead | DDO |
| VS2-333 | Data sources specification | DDO | DPO |
| VS2-334 | Consumption environments | DDO | DPO, Systems Teams |
| VS2-335 | Versioning and change management | DDO, DPO | R&D Data Office |
| VS2-336 | Operations tracker (full view) | DDO, DPO, Data Consumer Lead | All |
| VS2-337 | Request tracker (consumer view) | Data Consumer | - |
| VS2-338 | DPO delivery tracker | DPO Officer | Systems Teams |
| VS2-339 | Approval execution | DPO Officer | DDO |
| VS2-340 | Cross-checks for duplicates | DDO, DPO, Data Consumer Lead | All |

---

## Multi-TA Approval Requirement

**Source:** Adobe Sign Email (Jan 2026)

> For cross-TA data collection studies, **ALL relevant TA Leads must sign**. The approval process operates on an "all or nothing" principle. If any single TA Lead fails to provide signature approval, the data collection cannot be enabled for users in ANY of the therapeutic areas involved.

**Implication for UI:**
- Approval workflow must track multiple TA Lead signatures
- Show blocking status when any TA has not approved
- Clear visualization of which TAs have approved/pending/rejected

---

## Outstanding Questions / Gaps

### Questions Requiring AZ Clarification

#### Q1: Data Consumer Lead Role Confusion
**Status:** Awaiting AZ confirmation

- **In ROAM Guidance:** Data Consumer Lead oversees team compliance
- **In Email (Nov 2025):** Data Consumer Lead defines intent, proposes criteria, supplies asset lists

**Question:** Same role with dual responsibilities, or different roles?

#### Q2: DDO vs TA Lead Terminology
**Status:** Awaiting AZ confirmation

- Documents use both "DDO" and "TA Lead" for approvers
- Context suggests they may be the same (VP Biometrics level)

**Question:** Are these synonymous or distinct?

#### Q3: DPO Officer as UX Role
**Status:** RESOLVED - Backend only

**Decision:** DPO is a backend operation. DPO staff needing Collectoid access will use the DCM role. Collectoid surfaces DPO status/tracking data as read-only views within DCM but does not provide DPO-specific workflows or actions.

---

### Other Clarification Needed:

1. **Delegation hierarchy:**
   - Can DDOs delegate approval to others? How is this tracked?

2. **Quarterly review workflow:**
   - Who prepares the review list?
   - Who attends the meeting?
   - How are decisions recorded?

3. **Exception handling:**
   - Who handles requests outside standard collections (the 10%)?
   - What's the escalation path?

4. **Training verification:**
   - Who verifies training completion?
   - How is this surfaced in the UI?

5. **Compliance monitoring:**
   - What metrics are tracked?
   - Who reviews compliance reports?

### Missing Role Information:

1. **System Administrator role** - Who manages Collectoid itself?
2. **Audit/Compliance Officer** - Who runs compliance checks?
3. **Help Desk/Support** - Who handles user issues?

---

## UI Persona Recommendations

Based on this analysis, recommend the following personas for the role switcher:

### Primary Demo Personas (for v2 prototype):

1. **Sarah Chen - R&D Data Office Manager**
   - Role: R&D Data Office Lead
   - View: Collections Manager, full admin capabilities
   - Demo focus: Creating collections, managing approvals, quarterly reviews

2. **Dr. James Miller - Delegate Data Owner (Oncology)**
   - Role: DDO
   - View: Approval queue, collection oversight
   - Demo focus: Approving OAC/AOT, opt-in/opt-out decisions

3. **Dr. Maria Santos - Data Consumer Lead**
   - Role: Data Consumer Lead
   - View: Team dashboard, access management
   - Demo focus: Managing team access, compliance tracking

4. **Alex Kim - Data Scientist**
   - Role: Data Consumer (ODSAI)
   - View: My Access, discovery
   - Demo focus: Finding data, understanding terms, requesting access

5. **Rachel Thompson - GPT Oncology Approver**
   - Role: GPT Approver
   - View: Approval queue
   - Demo focus: Reviewing and approving requests

### Secondary Personas (future consideration):

6. Data Provisioning Rep
7. TALT Legal Reviewer
8. Alliance Manager

---

## Next Steps

1. [ ] Review this matrix with stakeholders for accuracy
2. [ ] Finalize persona list for v2 prototype
3. [ ] Map UI screens to each persona
4. [ ] Design role switcher component
5. [ ] Create introduction page explaining each role

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2026-01-26 | Initial matrix created from documentation synthesis | Claude |
| 2026-01-26 | Added DPO Officer role, Systems Teams, JIRA story mappings, detailed process flow (13 steps), multi-TA approval requirement, AZ clarification questions | Claude |
| 2026-01-26 | DECISION: DPO Officer confirmed as backend-only role. DPO staff use DCM role in Collectoid. Updated all sections accordingly. | Claude |


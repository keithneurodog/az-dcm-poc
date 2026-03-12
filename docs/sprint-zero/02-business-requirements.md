# Business Requirements Document (BRD)
# Collectoid - Clinical Trial Data Access Platform

**Document ID:** COLLECTOID-BRD-001
**Version:** 1.0
**Date:** 2026-02-06
**Author:** WP4 UI & Agentic AI Team
**Status:** Draft - Pending Stakeholder Review
**Program:** DOVS2 (Data Office Value Stream 2)
**Workstream:** WP4 - UI & Agentic AI

---

**Document Control**

| Field | Value |
|-------|-------|
| Sponsor | Jamie MacPherson (WP4 Lead) |
| Product Manager | Beata |
| Product Owner | Divya |
| Lead Software Engineer | Keith |
| R&D Data Office Lead | Peder Blomgren (VP) |
| Project Manager | Cayetana Vazquez |
| Business Analyst | Marcin |

**Related Sprint-Zero Documents**

| Document | Reference |
|----------|-----------|
| Product Vision & Strategy | `docs/sprint-zero/01-product-vision.md` |
| Technical Architecture | `docs/sprint-zero/03-technical-architecture.md` |
| UX Roles & System Design | `docs/collectoid-v2-ux-roles.md` |
| Gap Analysis | `docs/specs/collectoid-v2-gap-analysis.md` |
| Roles Matrix | `docs/collectoid-v2-roles-matrix.md` |
| ROAM Guidance v1.1 | `docs/misc/00. Final Documentation - 2025/Role-based Open Access Model - Guidance v1.1.md` |
| DOVS2 Vision Synthesis | `docs/misc/_synthesis/VISION.md` |

**Revision History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-02-06 | WP4 Team | Initial draft |
| 1.0 | 2026-02-06 | WP4 Team | Complete BRD for stakeholder review |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Scope & Objectives](#2-scope--objectives)
3. [User Personas](#3-user-personas)
4. [Functional Requirements](#4-functional-requirements)
   - 4.1 FR-COL: Collections Management
   - 4.2 FR-REQ: Access Request Management
   - 4.3 FR-APR: Approval Workflow
   - 4.4 FR-DSC: Discovery & Search
   - 4.5 FR-AUD: Audit & Compliance
   - 4.6 FR-NOT: Notifications
   - 4.7 FR-ANL: Analytics & Reporting
   - 4.8 FR-ADM: Administration
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [MVP Definition (Q1 2026)](#6-mvp-definition-q1-2026)
7. [Phase Roadmap](#7-phase-roadmap)
8. [Out of Scope](#8-out-of-scope)
9. [Assumptions & Dependencies](#9-assumptions--dependencies)
10. [JIRA Story Cross-Reference](#10-jira-story-cross-reference)
11. [Open Questions](#11-open-questions)
12. [Glossary](#12-glossary)
13. [Appendices](#13-appendices)

---

## 1. Executive Summary

### 1.1 Business Drivers

AstraZeneca's R&D organization generates vast quantities of clinical trial data across therapeutic areas including Oncology, Cardiovascular/Renal/Metabolic (CVRM), Respiratory & Immunology (R&I), and Vaccines & Immune Therapies (V&I). Today, accessing this data is a fragmented, slow, and opaque process that directly impedes scientific discovery.

**The core problem is quantifiable:**

- Data scientists spend **60% of their time** on data wrangling rather than analysis
- Stakeholders report **"99% of time waiting on data wrangling"** before productive work begins
- Less than **5% of R&D data** is centrally catalogued
- Access requests are processed **use-case-by-use-case**, with delays measured in weeks
- Multiple uncoordinated cataloguing initiatives exist with **no single source of truth**
- Approval processes are **opaque**, with variable responses from data owners

The current primary system, AZCt iDAP (individual Data Access Platform), is scheduled for **decommissioning in 2026**. There is no successor system in place to manage the scale of access required under the ROAM (Role-based Open Access Model) paradigm.

### 1.2 Strategic Context

Collectoid is a deliverable of the **DOVS2 program** (Data Office Value Stream 2), which is transforming how AstraZeneca R&D shares and accesses clinical trial data. DOVS2 operates across four workstreams:

| Workstream | Focus | 2026 Goal |
|------------|-------|-----------|
| **WP1** - Extended 90:10 | Expand ROAM collections to more TAs and users | >1,000 users with >90% data needs via open access |
| **WP2** - R&D Data Exchange | External data sharing infrastructure | Streamline vendor transfers and collaborations |
| **WP3** - Data Readiness | Metadata, data quality, PDP availability | ~1,300 more studies into PDP; >1,700 studies AI-ready |
| **WP4** - UI & Agentic AI | Collectoid + Sherlock tools | Single source of truth for collections management |

Collectoid is WP4's primary governance tool -- the "90 Data Collections Manager" -- responsible for enabling the R&D Data Office, data owners, and data consumers to manage the full lifecycle of open access data collections at scale.

### 1.3 Solution Overview

Collectoid implements the **ROAM (Role-based Open Access Model)** paradigm through a web-based application that:

1. **Replaces manual processes** currently managed through SharePoint lists, PowerBI dashboards, email-based approval chains, and manual signature tracking
2. **Centralizes collection governance** into a single system with full audit trail
3. **Accelerates access provisioning** through pre-approved open collections (the "90" in 90:10)
4. **Streamlines edge-case requests** through guided workflows (the "10" in 90:10)
5. **Provides transparency** into approval status, data availability, and compliance

**The ROAM model targets:**

| Segment | % of Access Needs | Mechanism | Collectoid Role |
|---------|-------------------|-----------|-----------------|
| Already Open | 20% | No action needed | Display status |
| Awaiting Policy | 30% | DCM confirms, Immuta policy created | Trigger and track provisioning |
| Blocked, Needs Approval | 40% | Creates authorization, GPT/TALT review | Manage approval workflow |
| Missing | 10% | Data location unknown or training incomplete | Flag and escalate |

**Target scale:** >1,000 users accessing >1,700 studies across 10+ R&D teams.

### 1.4 North Star Vision

> "Seamlessly delivering trusted, AI-ready data -- governed responsibly and accessed effortlessly -- to empower science, accelerate discovery, and unlock competitive advantage across R&D. By expanding the boundaries of what data can do, we transform every insight into impact."

*Source: AZ Agentic AI Workshop, December 2025*

---

## 2. Scope & Objectives

### 2.1 Business Objectives

| ID | Objective | Success Metric | Target |
|----|-----------|----------------|--------|
| BO-001 | Scale open access to priority R&D teams | Number of users with open access | >1,000 users |
| BO-002 | Reduce time from data need to data access | Median time to access | 2x faster than current |
| BO-003 | Provide single source of truth for collections | Collections managed in Collectoid | 100% of active collections |
| BO-004 | Ensure compliance and auditability | Audit coverage | 100% of access decisions auditable |
| BO-005 | Achieve user adoption | Active Collectoid users | >100 users |
| BO-006 | User satisfaction | Satisfaction survey score | >80% |
| BO-007 | Operational responsiveness | Reaction time to collection changes | <48 hours |

### 2.2 In Scope

**Application Scope:**

- Web-based application for managing data collection governance
- Collection creation, modification, and lifecycle management workflows
- Multi-role access with persona-appropriate views (DCM, Approver, Team Lead, Data Consumer)
- Approval workflows including multi-TA coordination
- Access request creation and tracking
- Audit trail for all governance decisions
- Notification system for status changes and required actions
- Analytics and reporting on collection usage and demand
- Integration points with downstream systems (Immuta, Ranger, PDP)

**Data Scope:**

- Strictly confidential R&D clinical trial data
- All therapeutic areas currently under ROAM (Oncology, BioPharma, and expansion TAs)
- Data types: SDTM, ADaM, ctDNA, Imaging/DICOM, Omics/NGS, RAW, Biomarker/Genomic, Real-World Data
- 30+ data category taxonomy

**User Scope:**

- R&D Data Office staff (DCM role)
- Delegate Data Owners / TA Leads (Approver role)
- Data Consumer Leads (Team Lead role)
- Data Scientists, Statisticians, Bioinformaticians, and other researchers (Data Consumer role)
- System administrators

### 2.3 Success Criteria

| Criterion | Measurement | Acceptance Threshold |
|-----------|-------------|---------------------|
| Data access speed | Time from request to provisioned access | 50% reduction vs. current process |
| Collection coverage | Percentage of 90-route studies managed via Collectoid | 100% by Q4 2026 |
| Audit completeness | Percentage of decisions with full audit trail | 100% |
| User adoption | Monthly active users | >100 by Q3 2026 |
| System availability | Uptime during business hours | 99.5% |
| Data accuracy | Collection status accuracy vs. actual provisioning state | >99% |

---

## 3. User Personas

### 3.1 Data Collection Manager (DCM)

**Effort Allocation:** 60-70% of Collectoid usage

**Real-World Roles:** R&D Data Office Lead, R&D Data Office team members, designated collection administrators, DPO staff (when interacting with Collectoid)

**Demo Persona:** Sarah Chen, R&D Data Office Manager

**Goals:**
- Create and manage Open Access Collections efficiently
- Route approvals to appropriate data owners and TA leads
- Monitor collection health, compliance status, and delivery progress
- Prepare and manage quarterly review cycles
- Maintain complete audit trail for all governance decisions

**Pain Points (Current State):**
- Manual tracking across SharePoint lists, PowerBI dashboards, and email chains
- No single view of collection status across all dimensions (approval, compliance, delivery)
- Version control managed manually with risk of discrepancy
- DPO status updates arrive via email and must be manually reconciled
- Duplicate detection is ad-hoc and error-prone

**Key Tasks in Collectoid:**

| Task | Frequency | Priority |
|------|-----------|----------|
| Create new collection proposals | Weekly | Critical |
| Define OAC scope (inclusion/exclusion criteria) | Weekly | Critical |
| Define AOT terms and user scope | Weekly | Critical |
| Assign datasets (d-codes) to collections | Daily | Critical |
| Assign users/teams to collections | Daily | Critical |
| Submit collections for approval | Weekly | Critical |
| Monitor approval status across TAs | Daily | High |
| View DPO compliance and delivery status (read-only) | Daily | High |
| Manage version history and change tracking | Weekly | High |
| Prepare quarterly review materials | Quarterly | High |
| Run duplicate detection checks | Per submission | Medium |
| Generate compliance and audit reports | Monthly | Medium |

**Screens:**
- Dashboard (collection overview, pending actions, alerts)
- Collection Builder (create/edit wizard flow)
- Collection Detail (management view with all dimensions)
- Study Manager (d-code lists, modality/source mapping)
- User Manager (virtual teams, access assignments)
- Operations Tracker (DPO status, delivery progress)
- Quarterly Review Workspace

---

### 3.2 Data Consumer / Researcher

**Effort Allocation:** 30-40% of Collectoid usage

**Real-World Roles:** Data Scientists, Statisticians, Bioinformaticians, Computational Pathologists, Research Scientists, Clinical Pharmacometricians, Statistical Programmers

**Demo Persona:** Alex Kim, Data Scientist (ODSAI)

**Goals:**
- Discover what data is available and what they can access
- Understand terms of use and permitted activities
- Request access to collections they need
- Track the status of their access requests
- Maintain compliance with training requirements

**Pain Points (Current State):**
- No centralized catalog to browse available data collections
- Unclear which data they already have access to
- No visibility into why access is pending or denied
- Training requirements scattered across multiple systems
- Cannot see which collections are upcoming (leading to redundant individual requests)

**Key Tasks in Collectoid:**

| Task | Frequency | Priority |
|------|-----------|----------|
| Browse/search available collections | Weekly | Critical |
| View collection details (scope, terms, datasets) | Weekly | Critical |
| Check personal access status ("My Access") | Weekly | High |
| Request access to a collection | As needed | High |
| Track access request status | Daily when pending | High |
| Review and accept terms of use | Per collection | High |
| View training completion status | Monthly | Medium |
| Submit Project Completion Forms | Per project | Low |

**Screens:**
- Discovery/Browse Collections (search, filter, browse)
- Collection Detail (consumer read-only view)
- My Access Dashboard (current access, pending requests)
- Request Status Tracker
- Training & Compliance

---

### 3.3 Approver (TA Lead / Delegate Data Owner)

**Real-World Roles:** Delegate Data Owners (DDOs), TA Leads, GPT members, TALT members, Alliance Managers

**Demo Personas:**
- Dr. James Miller, Delegate Data Owner (Oncology)
- Rachel Thompson, GPT Oncology Approver

**Goals:**
- Efficiently review and act on approval requests
- Understand the scope and impact of what they are approving
- Maintain oversight of collections under their ownership
- Participate in quarterly review cycles
- Ensure compliance with organizational policies

**Pain Points (Current State):**
- Approval requests arrive via email with limited context and no audit trail
- No consolidated view of pending approvals across collections
- Multi-TA coordination is manual and error-prone
- No ability to see how their approval decision interacts with other TA leads' decisions
- Version changes require manual re-signing

**Key Tasks in Collectoid:**

| Task | Frequency | Priority |
|------|-----------|----------|
| Review pending approval queue | Daily | Critical |
| Approve or reject OAC/AOT proposals | As needed | Critical |
| Review and decide on opt-in/opt-out proposals | Quarterly | Critical |
| Flag studies for exclusion (business sensitivity) | As needed | High |
| View approval history and decision rationale | Monthly | High |
| Delegate approval authority | As needed | Medium |
| Export compliance reports | Monthly | Medium |

**Screens:**
- Approval Queue (filtered by type, urgency, TA)
- Request Detail (full review interface with context)
- Quarterly Review Dashboard
- Approval History & Audit Log

---

### 3.4 DPO Operations

**Note:** DPO is a **backend-only role** -- DPO operations (compliance verification, policy configuration, provisioning execution) happen outside of Collectoid. DPO staff who need Collectoid access will use the DCM role. Collectoid surfaces DPO status data as read-only views. See `docs/collectoid-v2-ux-roles.md` for full rationale.

**Real-World Roles:** Data Provisioning Officers, Scientific Data Provisioning Representatives, Data Preparation Representatives

**Responsibilities (External to Collectoid):**
- Validate that collection criteria map to stable metadata fields
- Document ethical and legal status per study
- Configure Ranger/Starburst/Immuta policies study-by-study
- Execute provisioning across modalities and environments
- Track delivery progress and update trackers

**Data Surfaced in Collectoid (Read-Only):**
- Compliance/due diligence status per study
- Delivery progress per study/modality/source
- Provisioning status per environment
- Duplicate detection alerts

---

### 3.5 System Administrator

**Real-World Roles:** IT Support, Platform owners, Collectoid administrators

**Goals:**
- Manage system configuration and user accounts
- Monitor system health and performance
- Manage role assignments and permissions
- Review audit logs for security and compliance

**Key Tasks in Collectoid:**

| Task | Frequency | Priority |
|------|-----------|----------|
| Manage user accounts and role assignments | Weekly | Critical |
| Configure system parameters and defaults | Monthly | High |
| Review security audit logs | Weekly | High |
| Manage data source integrations | Monthly | Medium |
| Configure notification templates | As needed | Low |

---

## 4. Functional Requirements

### 4.1 FR-COL: Collections Management

#### 4.1.1 Collection Creation

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-COL-001 | The system shall support creation of new Open Access Collections (OACs) through a guided wizard flow | Critical | -- | Given a DCM user, when they initiate collection creation, then a multi-step wizard guides them through defining scope, terms, users, and submission |
| FR-COL-002 | The system shall capture collection request type (New / Update / Policy Change) at flow initiation | High | -- | Given a DCM creating a collection, when they start the wizard, then they must select a request type; if Update or Policy Change is selected, they must link to an existing collection |
| FR-COL-003 | The system shall support free-text intent definition with AI-assisted keyword extraction | High | -- | Given a DCM entering collection intent, when text is entered, then AI suggests relevant keywords, categories, and related collections |
| FR-COL-004 | The system shall support defining OAC scope using inclusion and exclusion criteria across multiple dimensions (TA, phase, study status, data types, geography) | Critical | VS2-329 | Given a DCM defining criteria, when criteria are specified, then they map to unambiguous, stable metadata attributes and produce a reproducible list of assets |
| FR-COL-005 | The system shall resolve collection criteria to a definitive list of study d-codes | Critical | VS2-329 | Given defined criteria, when the system resolves them, then a concrete list of study d-codes or study IDs is produced and displayed |
| FR-COL-006 | The system shall support three inclusion mechanisms: Included (auto), Included opt-out, and Included opt-in | High | VS2-329 | Given inclusion criteria, when a mechanism is selected, then the appropriate review workflow is triggered (auto-include, quarterly opt-out review, or quarterly opt-in review) |
| FR-COL-007 | The system shall automatically flag assets as "Out of Scope" or "Restricted" when metadata status changes | High | VS2-329 | Given a metadata status change (e.g., "Consented" to "Consent withdrawn"), when detected, then affected assets are automatically flagged and stakeholders notified |
| FR-COL-008 | The system shall capture data modalities per study with include/exclude capability | High | VS2-332 | Given a study in a collection, when modalities are recorded, then selection of particular modalities (Clinical/SDTM/ADaM, Biomarker, Imaging/DICOM, RWD, Omics/NGS) with include/exclude is enabled |
| FR-COL-009 | The system shall require an associated source path when recording data modalities | High | VS2-332 | Given a data modality record, when it is saved, then the associated source path field must not be blank |
| FR-COL-010 | The system shall ensure no study has a blank data modality record | High | VS2-332 | Given studies in a collection, when compliance is checked, then any study without at least one modality record is flagged as incomplete |
| FR-COL-011 | The system shall capture data sources for each modality (entimICE, PDP, CTDS, Medidata Rave, Veeva Vault, external partners) | High | VS2-333 | Given a defined data modality, when source is recorded, then selection from a defined list of data sources is available per modality |
| FR-COL-012 | The system shall validate that no modality is submitted without a data source | High | VS2-333 | Given a collection submitted for execution, when validation runs, then no blank data source for any modality is permitted |
| FR-COL-013 | The system shall capture target consumption environments (SCP, Domino Data Lab, AI Bench, PDP, IO Platform) | High | VS2-334 | Given a collection, when recording where users will access data, then environment selection from a defined list is enabled |
| FR-COL-014 | The system shall apply default provisioning boundaries defined by leadership | High | VS2-334 | Given a data collection, when environment defaults are set by leadership (e.g., "Provision to Domino only"), then these boundaries are automatically applied |
| FR-COL-015 | The system shall allow selection of additional environments beyond defaults when needed | Medium | VS2-334 | Given default boundaries, when additional environments are needed, then additional options are available for selection with appropriate justification |
| FR-COL-016 | The system shall support defining Data Use Terms (AOT) including permitted activities, user scope by department/role, dual AI/ML permission flags (permission to train AI/ML models AND permission to store data in AI/ML models — two separate booleans per Immuta data model), publication rights, and prohibited uses | Critical | -- | Given a DCM configuring an AOT, when terms are defined, then all four AOT elements are captured: base definition, data scope (reference to OAC), terms and conditions of use, and user scope |
| FR-COL-017 | The system shall support one AOT per OAC, with the ability to create multiple AOTs for the same OAC for different user groups | High | -- | Given an OAC, when AOTs are managed, then one or more AOTs can be associated with it, each defining different user scopes and terms |

#### 4.1.2 Collection Modification & Lifecycle

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-COL-020 | The system shall support editing of collections in governance_stage = draft by the DCM | Critical | -- | Given a collection with governance_stage = draft, when the DCM edits it, then all fields are modifiable and changes are tracked |
| FR-COL-021 | The system shall enforce a two-dimensional collection state model: (1) governance_stage: concept > draft > pending_approval > approved (or rejected > draft); (2) operational_state (once approved): provisioning > live > suspended > decommissioned. In-flight modifications are tracked via propositions — a separate entity with lifecycle: draft > submitted > approved > merged (or > rejected) | Critical | -- | Given a collection, when its state changes, then it must follow the defined transitions within each dimension independently, and the system tracks both dimensions concurrently. Propositions are queried separately to determine whether a collection has open change requests |
| FR-COL-022 | The system shall support propositions to add or remove studies from live collections (operational_state = live) within approved OAC scope. Propositions follow their own lifecycle (draft > submitted > approved > merged or > rejected). Multiple concurrent propositions per collection are allowed; conflicts are resolved at merge time. Simple changes within approved scope may skip approval and go straight from submitted to merged | High | -- | Given a live collection with approved OAC scope, when a proposition to add/remove studies within that scope is submitted, then the proposition transitions to merged without governance re-approval. When a proposition falls outside approved scope, it transitions to approved only after governance re-approval, then to merged |
| FR-COL-023 | The system shall require governance re-approval (governance_stage = pending_approval) when propositions fall outside the approved OAC or AOT scope | High | -- | Given a proposition outside approved scope, when submitted, then the system transitions governance_stage to pending_approval and routes the change for re-approval |
| FR-COL-024 | The system shall support collection decommissioning (operational_state = decommissioned) with reason recording | Medium | -- | Given a live or suspended collection, when decommissioned by a DCM, then operational_state transitions to decommissioned, the reason is recorded, and all access is revoked with notification |

#### 4.1.3 Collection Browsing & Viewing

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-COL-030 | The system shall provide a collections browser with grid and list view options | Critical | -- | Given any authenticated user, when they navigate to collections, then they see all collections they are permitted to view in either grid card or list table format |
| FR-COL-031 | The system shall display collection cards with: name, description, owner, status badge, progress bar, user count, dataset count (d-codes with "+X more"), access indicator, and creation date | Critical | -- | Given a collection in grid view, when displayed, then all specified metadata is visible on the card |
| FR-COL-032 | The system shall support full-text search across collection names, descriptions, datasets, and owners | Critical | -- | Given a user entering a search query, when submitted, then results match against name, description, dataset codes, dataset names, and owner fields |
| FR-COL-033 | The system shall provide a multi-faceted filtering system including: status, therapeutic area, owner, access level, date range, user count, and dataset d-code filters | High | -- | Given the filter panel, when filters are selected, then results update in real-time using AND logic across all active filters |
| FR-COL-034 | The system shall support sorting by: recent, alphabetical, most users, and completion percentage | Medium | -- | Given search results, when a sort option is selected, then results reorder accordingly |
| FR-COL-035 | The system shall display access control indicators: Member (green), Request Access (amber), Public (blue), Restricted (red) | High | -- | Given a collection card, when displayed, then the appropriate access indicator is shown based on the current user's permissions |

#### 4.1.4 Role Assignment & Access Scope

> **Note:** Collection access management has three dimensions: (1) *Authorization track* — whether users receive standing access via IDA (the "90" route) or request-based access via AdHoc (the "10" route) — per Immuta's two authorisation tracks; (2) *Access scope* — selecting Immuta User Profiles (criteria-based matching over User_Tags from Manual, NPA, Workday, and Cornerstone sources), individual user overrides by PRID, and study-level partition assignments (Study_ID sets); (3) *Governance roles* — assigning DCL, DDO, and Collection Leader roles for accountability, managed post-draft. **[TBD — METADATA FLOW]:** Confirm User Profile ownership (Collectoid-created vs DPO-maintained) and the partition-to-Starburst mapping path.

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-COL-040 | The system shall support assignment of Data Consumer Lead and Data Owner (DDO) roles to a collection | Critical | VS2-330 | Given a collection, when roles are assigned, then at least one Data Consumer Lead and one Data Owner are identified |
| FR-COL-041 | The system shall support defining access scope via Immuta role groups and individual user overrides linked to collections | Critical | VS2-330 | Given a collection, when access scope is defined, then Immuta role groups can be selected and individual users can be added by PRID |
| FR-COL-042 | The system shall automatically update access when team membership changes in the source system | High | VS2-330 | Given a membership change in the source system (e.g., AD group), when synchronized, then access permissions are automatically updated |
| FR-COL-043 | The system shall support nominating a Collection Leader responsible for day-to-day management | Medium | VS2-330 | Given a collection, when a Collection Leader is nominated, then their responsibilities and permissions are scoped accordingly |

#### 4.1.5 Versioning & Change Management

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-COL-050 | The system shall maintain a version history for all collections | Critical | VS2-335 | Given an existing collection, when any changes are made, then a version history entry is created with version number |
| FR-COL-051 | The system shall create timestamped artifacts for each change recording what changed, who changed it, and when | Critical | VS2-335 | Given a collection change, when saved, then a timestamped artifact records the delta, author, and timestamp |
| FR-COL-052 | The system shall create a new version with new TA Lead signature requirement when a study status changes (e.g., rejected to approved) | High | VS2-335 | Given a decision change on a study, when recorded, then a new collection version is created requiring fresh TA Lead signatures |
| FR-COL-053 | The system shall send automated notifications to impacted users when access is revoked due to metadata changes | High | VS2-335 | Given an automatic access revocation, when executed, then all impacted users receive notification with explanation |
| FR-COL-054 | The system shall support periodic review cycles with outcome documentation | Medium | VS2-335 | Given a quarterly review cycle, when outcomes are recorded, then they are stored as versioned artifacts with all decisions documented |
| FR-COL-055 | The system shall provide a version comparison view showing differences between any two versions | Medium | VS2-335 | Given two collection versions, when compared, then a clear diff view highlights all changes between them |

---

### 4.2 FR-REQ: Access Request Management

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-REQ-001 | The system shall allow Data Consumers to request access to collections they do not currently have access to | Critical | VS2-337 | Given a Data Consumer viewing a restricted collection, when they select "Request Access", then a request form is presented with justification field |
| FR-REQ-002 | The system shall allow Team Leads to request access on behalf of their team members | High | -- | Given a Team Lead, when they submit an access request, then they can specify team members to be granted access |
| FR-REQ-003 | The system shall display a consumer-facing request tracker showing: pending, received, and rejected TA Lead approvals | Critical | VS2-337 | Given a Data Consumer with pending requests, when they view their tracker, then status per request is visible including per-TA approval status |
| FR-REQ-004 | The system shall provide a "My Access" view showing current data access permissions across all collections | High | VS2-341 | Given a logged-in user, when they view "My Access", then all collections they have access to, their terms, and their status are displayed |
| FR-REQ-005 | The system shall guide users to the appropriate request route (90-route via collection vs. 10-route via iDAP) | High | VS2-347 | Given a user seeking data access, when they initiate a request, then a decision tree helps them determine whether their need can be met by an existing collection (90-route) or requires an individual request (10-route) |
| FR-REQ-006 | The system shall display prohibited studies with clear explanation of why they cannot be requested | Medium | VS2-342 | Given a study flagged as prohibited, when viewed by a Data Consumer, then a visual indicator and explanation of the restriction are displayed |
| FR-REQ-007 | The system shall show similar or related access requests to help users find existing collections that may meet their needs | Medium | VS2-343 | Given a user browsing or requesting data, when similar collections/requests exist, then recommendations are surfaced to reduce duplicate requests |
| FR-REQ-008 | The system shall display standardized SLA information for asset status across all views | Medium | VS2-344 | Given any asset or request status, when displayed, then consistent SLA indicators and timeline estimates are shown |
| FR-REQ-009 | The system shall provide a collections visibility tracker showing the pipeline of upcoming collections | Medium | VS2-346 | Given a user considering a new request, when they view the pipeline, then upcoming collections are visible so they can be advised to wait rather than submitting individual requests |
| FR-REQ-010 | The system shall enforce request lifecycle: DRAFT > SUBMITTED > UNDER REVIEW > APPROVED/DENIED > PROVISIONED/CLOSED | High | -- | Given a request, when its status changes, then it follows the defined lifecycle with full audit trail |

---

### 4.3 FR-APR: Approval Workflow

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-APR-001 | The system shall route approval requests to the appropriate approvers based on therapeutic area, legal requirements, data ownership, and partnership status | Critical | VS2-339 | Given a collection submitted for approval, when the system determines routing, then requests are sent to all required approver queues (DDO, GPT, TALT, Alliance as applicable) |
> **[TBD — IMMUTA ALIGNMENT]:** The Immuta data model defines three approval tiers: (1) Data Steward / DPM, (2) Source Owner, and (3) Power User - TALT. The BRD lists DDO, GPT, TALT, and Alliance as approval queues. Confirm the mapping: does DDO = Source Owner? Does GPT = Data Steward/DPM? Is Alliance a fourth tier not in Immuta?

| FR-APR-002 | The system shall enforce "all or nothing" approval for cross-TA collections: if any single TA Lead rejects, the entire collection is blocked for ALL therapeutic areas | Critical | VS2-339, VS2-349 | Given a cross-TA collection, when any TA Lead rejects, then the collection cannot proceed for any TA; this blocking status is clearly displayed to all stakeholders |
| FR-APR-003 | The system shall require all relevant TA Leads to sign for cross-TA collections | Critical | VS2-349 | Given a collection spanning multiple TAs, when submitted for approval, then all relevant TA Leads are identified and must provide signature approval |
| FR-APR-004 | The system shall capture formal signatures with complete audit trail and timestamps | Critical | VS2-339, VS2-350 | Given an approval decision, when recorded, then the approver identity, decision, timestamp, and any comments are captured as an immutable audit record |
| FR-APR-005 | The system shall support approval actions: Approve with comments, Reject with mandatory reason, Request changes, Delegate to another approver | Critical | VS2-339 | Given an approver reviewing a request, when they take action, then they can approve (with optional comments), reject (with mandatory reason), request changes, or delegate |
| FR-APR-006 | The system shall enforce minimum information gates before auto-provisioning | High | VS2-339 | Given all TA Lead signatures collected, when minimum information requirements are verified, then Collectoid triggers auto-provisioning of authorized studies |
| FR-APR-007 | The system shall auto-revoke access and notify stakeholders when metadata changes invalidate previously approved access | High | VS2-339 | Given an approved collection, when metadata changes invalidate access criteria, then access is automatically revoked and all affected stakeholders are notified |
| FR-APR-008 | The system shall require new version and fresh signatures when approval decisions change (e.g., rejected study becomes approved) | High | VS2-335, VS2-339 | Given a decision change, when recorded, then a new collection version is created and fresh TA Lead signatures are required |
| FR-APR-009 | The system shall provide a complete in-app approval workflow with digital acknowledgement, full audit trail, state tracking, and notification capabilities for all approval types (OAC, AoT, Opt-in/Opt-out) | High | VS2-339 | Given an approval request, when submitted, then the approver receives an in-app notification, can review and approve/reject within the application, and all actions are recorded in an immutable audit trail |
| FR-APR-010 | The system shall provide an approver queue view filterable by type (OAC, AOT, Opt-in/Opt-out), urgency, therapeutic area, and SLA status | High | -- | Given an Approver user, when they view their queue, then they see all pending approvals with filtering and sorting capabilities |
| FR-APR-011 | The system shall support quarterly opt-in/opt-out review workflows where DDOs approve study inclusion/exclusion | High | -- | Given a quarterly review cycle, when initiated by DCM, then DDOs receive a structured review interface with proposed study changes and approve/reject per study |
| FR-APR-012 | The system shall visualize cross-TA approval status showing which TAs have approved, pending, or rejected | High | VS2-349 | Given a cross-TA collection, when viewed, then a clear status indicator shows per-TA approval state (approved/pending/rejected) |

---

### 4.4 FR-DSC: Discovery & Search

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-DSC-001 | The system shall provide full-text search across collections, datasets, studies, and owners with real-time results | Critical | -- | Given a search query, when entered, then matching results appear with <500ms latency after debounce |
| FR-DSC-002 | The system shall support AI-assisted search that interprets natural language queries and suggests relevant collections, categories, and filters | High | -- | Given a natural language query (e.g., "oncology biomarker studies from 2024"), when processed, then the system suggests matching collections and pre-populates relevant filters |
| FR-DSC-003 | The system shall provide a data category taxonomy browser with 30+ categories across therapeutic areas, SDTM domains, ADaM datasets, RAW data, DICOM, and Omics/NGS | High | -- | Given the category browser, when a user expands the taxonomy, then all 30+ categories are navigable with collection counts per category |
| FR-DSC-004 | The system shall recommend similar collections based on dataset overlap, user profile, and browsing history | Medium | VS2-343 | Given a user viewing a collection, when "Similar Collections" is shown, then recommendations are based on dataset overlap and usage patterns |
| FR-DSC-005 | The system shall support collection favoriting with starred collections appearing prominently in results | Low | -- | Given a user starring a collection, when they return, then starred collections appear first in default sorted results |
| FR-DSC-006 | The system shall support collection comparison (side-by-side) for analyzing differences between collections | Low | -- | Given two or more selected collections, when compared, then a side-by-side view shows differences in scope, terms, users, and datasets |

---

### 4.5 FR-AUD: Audit & Compliance

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-AUD-001 | The system shall maintain a comprehensive audit trail recording who approved what, when, and where for all governance decisions | Critical | VS2-350 | Given any governance action (approval, rejection, modification, access grant/revoke), when it occurs, then an immutable audit record is created with actor, action, target, timestamp, and justification |
| FR-AUD-002 | The system shall record ethical status confirmation per study within a collection | Critical | VS2-331 | Given a study in a collection, when compliance is verified, then ethical status (confirmed/pending/flagged) is recorded with verifier and timestamp |
| FR-AUD-003 | The system shall record legal status confirmation per study within a collection | Critical | VS2-331 | Given a study in a collection, when compliance is verified, then legal status (confirmed/pending/flagged) is recorded with verifier and timestamp |
| FR-AUD-004 | The system shall support auto-approval when collection criteria match pre-approved criteria | High | VS2-331 | Given a collection with criteria matching an existing pre-approved OAC, when compliance is checked, then auto-approval is triggered and logged |
| FR-AUD-005 | The system shall log reasons for non-accessible studies (data lost, quality incidents, consent withdrawn, contractual restrictions) | High | VS2-331 | Given a study that cannot be provisioned, when documented, then the specific reason is recorded in the audit trail |
| FR-AUD-006 | The system shall support bulk approval with pre-verification of metadata status | High | VS2-331 | Given multiple studies requiring approval, when bulk approval is requested, then metadata status is verified for all studies before approval is applied |
| FR-AUD-007 | The system shall store finalized due diligence records as versioned, timestamped artifacts | High | VS2-331 | Given a completed due diligence process, when signoff is recorded, then timestamp, approver identity, and outcome are captured as a versioned artifact |
| FR-AUD-008 | The system shall support collection artifact management (documents, approvals, training records) | Medium | VS2-345 | Given a collection, when artifacts are managed, then document upload/download, artifact versioning, and status tracking are supported |
| FR-AUD-009 | The system shall provide audit report generation with filtering by date range, collection, user, and decision type | Medium | VS2-350 | Given an audit query, when parameters are specified, then a comprehensive report is generated and exportable |
| FR-AUD-010 | The system shall track training completion status per user and flag non-compliant access | Medium | -- | Given a user granted access, when their training status changes, then compliance status is updated and non-compliance is flagged |

---

### 4.6 FR-NOT: Notifications

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-NOT-001 | The system shall notify approvers when new approval requests are pending in their queue | Critical | VS2-348 | Given a new approval request, when routed to an approver, then they receive both in-app and email notification |
| FR-NOT-002 | The system shall notify requesters when approval decisions are made (approved, rejected, changes requested) | Critical | VS2-348 | Given an approval decision, when recorded, then the requester and relevant stakeholders receive notification with decision details |
| FR-NOT-003 | The system shall notify all impacted users when collection access changes (grants, revocations, scope changes) | High | VS2-348 | Given an access change, when executed, then all affected users receive notification explaining what changed and why |
| FR-NOT-004 | The system shall notify stakeholders when metadata changes automatically flag studies | High | VS2-348 | Given an automatic study flagging due to metadata change, when detected, then DCMs, approvers, and affected consumers are notified |
| FR-NOT-005 | The system shall support configurable notification preferences (in-app, email, digest frequency) | Medium | -- | Given a user's notification settings, when configured, then notifications are delivered according to their preferences |
| FR-NOT-006 | The system shall provide an in-app notification center with unread count, filtering, and action links | Medium | -- | Given notifications, when viewed in-app, then they are organized by type with unread indicators and direct links to relevant items |
| FR-NOT-007 | The system shall send SLA escalation notifications when approvals exceed defined response windows | Medium | -- | Given an approval pending beyond SLA threshold, when threshold is reached, then escalation notification is sent to the approver and their manager |

---

### 4.7 FR-ANL: Analytics & Reporting

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-ANL-001 | The system shall provide a demand heatmap showing which data types, therapeutic areas, and studies are most requested | High | -- | Given analytics data, when the heatmap is viewed, then request frequency is visualized across dimensions (TA, data type, study phase) |
| FR-ANL-002 | The system shall track and display collection usage metrics (active users, access frequency, data volume accessed) | High | -- | Given an active collection, when metrics are viewed, then usage statistics are displayed with trend data |
| FR-ANL-003 | The system shall provide gap analysis reporting showing unmet data needs (requested but not available) | Medium | -- | Given request data, when gap analysis is run, then a report shows requested data not currently covered by any collection |
| FR-ANL-004 | The system shall track approval processing times and display against SLA targets | Medium | -- | Given approval workflow data, when metrics are viewed, then median and percentile processing times are shown against <48h target |
| FR-ANL-005 | The system shall provide collection health dashboards showing completeness, compliance status, and provisioning progress | High | -- | Given a collection, when its health dashboard is viewed, then completeness (modalities, sources, environments), compliance (ethical, legal), and provisioning progress are displayed |
| FR-ANL-006 | The system shall track the access provisioning model breakdown (20% open / 30% awaiting policy / 40% needs approval / 10% missing) per collection | Medium | -- | Given a collection's study list, when provisioning analysis is displayed, then each study is categorized into the 20/30/40/10 model with aggregate percentages |
| FR-ANL-007 | The system shall support report export in CSV and PDF formats | Low | -- | Given any analytics view or report, when export is selected, then data is downloadable in CSV or PDF format |

---

### 4.8 FR-ADM: Administration

| ID | Requirement | Priority | JIRA Ref | Acceptance Criteria |
|----|-------------|----------|----------|---------------------|
| FR-ADM-001 | The system shall support user management including account creation, role assignment, and deactivation | Critical | -- | Given an administrator, when they manage users, then they can create accounts, assign roles (DCM, Approver, Team Lead, Data Consumer, Admin), and deactivate accounts |
| FR-ADM-002 | The system shall support role-based access control where UI views and actions are determined by the user's assigned role(s) | Critical | -- | Given a user with assigned roles, when they access Collectoid, then they see only the screens, data, and actions appropriate to their role(s) |
| FR-ADM-003 | The system shall support a user holding multiple roles simultaneously | High | -- | Given a user with multiple roles (e.g., DCM and Approver), when they use Collectoid, then they can access functionality from all assigned roles [QUESTION: Should there be a role switcher widget, or should all roles be combined in a single view?] |
| FR-ADM-004 | The system shall support configurable system parameters including default provisioning boundaries, SLA thresholds, notification templates, and data source lists | Medium | -- | Given an administrator, when they access system configuration, then they can modify configurable parameters without code changes |
| FR-ADM-005 | The system shall provide security audit logging for all administrative actions | High | -- | Given any administrative action (user creation, role change, configuration change), when performed, then an audit log entry is created |
| FR-ADM-006 | The system shall integrate with AstraZeneca's identity provider for single sign-on (SSO) | Critical | -- | Given a user with valid AZ credentials, when they access Collectoid, then they are authenticated via SSO without separate credentials |
| FR-ADM-007 | The system shall support configurable data category taxonomy management | Low | -- | Given an administrator, when they manage the category taxonomy, then they can add, modify, or deprecate categories |

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement | Priority | Target |
|----|-------------|----------|--------|
| NFR-PERF-001 | Page load time for initial application load | Critical | < 3 seconds on standard corporate network |
| NFR-PERF-002 | Search results response time | Critical | < 500ms after 300ms debounce |
| NFR-PERF-003 | Collection list rendering (up to 500 collections) | High | < 1 second with virtualized scrolling |
| NFR-PERF-004 | Approval action response time | High | < 2 seconds for status update confirmation |
| NFR-PERF-005 | Report generation (standard reports) | Medium | < 10 seconds |
| NFR-PERF-006 | Bulk operations (up to 100 items) | Medium | < 5 seconds with progress indicator |
| NFR-PERF-007 | Study d-code resolution from criteria | High | < 5 seconds for up to 2,000 studies |

### 5.2 Availability & Reliability

| ID | Requirement | Priority | Target |
|----|-------------|----------|--------|
| NFR-AVAIL-001 | System availability during business hours (Mon-Fri 08:00-20:00 GMT) | Critical | 99.5% uptime |
| NFR-AVAIL-002 | Planned maintenance window | High | Weekends only, with 48h advance notice |
| NFR-AVAIL-003 | Recovery Time Objective (RTO) | High | < 4 hours |
| NFR-AVAIL-004 | Recovery Point Objective (RPO) | High | < 1 hour (no audit data loss) |
| NFR-AVAIL-005 | Graceful degradation when downstream systems (Immuta, Ranger, PDP) are unavailable | Medium | Application remains usable with clear status indicators for unavailable integrations |

### 5.3 Scalability

| ID | Requirement | Priority | Target |
|----|-------------|----------|--------|
| NFR-SCAL-001 | Concurrent users | High | Support 200 concurrent users |
| NFR-SCAL-002 | Total registered users | High | Support >1,000 registered users |
| NFR-SCAL-003 | Collections managed | High | Support >500 active collections |
| NFR-SCAL-004 | Studies per collection | High | Support up to 2,000 studies per collection |
| NFR-SCAL-005 | Total studies in system | High | Support >1,700 studies |
| NFR-SCAL-006 | Audit trail records | High | Support >1 million audit entries with efficient querying |

### 5.4 Security

| ID | Requirement | Priority | Target |
|----|-------------|----------|--------|
| NFR-SEC-001 | Authentication via AZ enterprise SSO (Azure AD / Entra ID) | Critical | All users authenticated via corporate identity |
| NFR-SEC-002 | Authorization based on role-based access control (RBAC) | Critical | All actions authorized per role definitions |
| NFR-SEC-003 | Data classification compliance | Critical | System handles strictly confidential metadata; no raw clinical data stored in Collectoid |
| NFR-SEC-004 | Audit trail immutability | Critical | Audit records cannot be modified or deleted by any user including administrators |
| NFR-SEC-005 | Session management | High | Sessions expire after 30 minutes of inactivity; re-authentication required |
| NFR-SEC-006 | Transport encryption | Critical | All data in transit encrypted via TLS 1.2+ |
| NFR-SEC-007 | Data at rest encryption | High | All stored data encrypted at rest |

### 5.5 Accessibility

| ID | Requirement | Priority | Target |
|----|-------------|----------|--------|
| NFR-ACC-001 | WCAG 2.1 Level AA compliance | High | All public-facing pages meet AA criteria |
| NFR-ACC-002 | Keyboard navigation support | High | All functionality accessible via keyboard |
| NFR-ACC-003 | Screen reader compatibility | High | Semantic HTML, ARIA labels, and proper heading hierarchy |
| NFR-ACC-004 | Color contrast ratios | High | Minimum 4.5:1 for normal text, 3:1 for large text |
| NFR-ACC-005 | Responsive design | Medium | Functional on screens 1024px and wider |

### 5.6 Browser Support

| ID | Requirement | Priority | Target |
|----|-------------|----------|--------|
| NFR-BRWS-001 | Primary browser | Critical | Google Chrome (latest 2 versions) |
| NFR-BRWS-002 | Secondary browser | High | Microsoft Edge (latest 2 versions) |
| NFR-BRWS-003 | Tertiary browser | Medium | Mozilla Firefox (latest 2 versions) |
| NFR-BRWS-004 | Safari | Low | Safari 16+ (basic functionality) |

### 5.7 Internationalization

| ID | Requirement | Priority | Target |
|----|-------------|----------|--------|
| NFR-I18N-001 | Primary language | Critical | English (US) |
| NFR-I18N-002 | Date/time display | High | ISO 8601 format with user timezone support |
| NFR-I18N-003 | Future localization | Low | Architecture should support future localization without major refactoring [QUESTION: Are other languages required for the 2026 scope?] |

---

## 6. MVP Definition (Q1 2026)

### 6.1 MVP Scope Statement

The Q1 2026 MVP delivers the foundational capability for users to **explore, discover, and understand** data collections. It establishes the data model, UI patterns, and infrastructure that subsequent phases build upon. The MVP does NOT include collection creation, approval workflows, or access provisioning -- these are deferred to Q2-Q4.

### 6.2 MVP Features

| ID | Feature | Requirements Covered | Acceptance Criteria |
|----|---------|---------------------|---------------------|
| MVP-001 | Collections Browser | FR-COL-030, FR-COL-031, FR-COL-033, FR-COL-034, FR-COL-035 | Users can browse all collections in grid and list views with filtering by status, TA, owner, and access level |
| MVP-002 | Collection Search | FR-DSC-001, FR-COL-032 | Users can perform full-text search across collections with <500ms response time |
| MVP-003 | Collection Detail View | FR-COL-031 | Users can view comprehensive collection detail including scope, terms, datasets, users, and status |
| MVP-004 | Discovery: What Data is Available | FR-DSC-002, FR-DSC-003 | Users can browse the data category taxonomy and understand what data exists across collections |
| MVP-005 | Discovery: What Data is Accessible | FR-REQ-004 | Users can see which collections they have access to and understand their current access status |
| MVP-006 | Basic Collection Creation Flow | FR-COL-001, FR-COL-003 | DCM users can create a draft collection with intent, category selection, and basic criteria definition |
| MVP-007 | Role-Based Views | FR-ADM-002 | Different user roles see appropriate views (DCM sees management controls; Data Consumers see read-only discovery) |
| MVP-008 | Introduction/Landing Page | -- | New users see a role-appropriate introduction explaining Collectoid's purpose and their available actions |

### 6.3 MVP Acceptance Criteria

| Criterion | Target |
|-----------|--------|
| Loads all existing collections from data source | 100% of active BioPharma + Oncology collections |
| Page load time | < 3 seconds |
| Search functionality working across all fields | Full-text search operational |
| Filter combinations working | At least 3 simultaneous filters with AND logic |
| Accessible on primary browser (Chrome) | All MVP features functional |
| WCAG 2.1 AA compliance | All MVP pages |
| Role switching demonstration | At least DCM and Data Consumer views |

### 6.4 MVP Exclusions (Deferred to Later Phases)

- Collection submission for approval
- Approval workflows (multi-TA, signatures)
- Access request creation and tracking
- Versioning and change management
- Notifications
- DPO integration and compliance tracking
- Analytics and reporting dashboards
- User/team assignment
- Study d-code resolution from criteria
- Modality/source/environment configuration

---

## 7. Phase Roadmap

### Q1 2026 - Explore & Discover (MVP)

**Theme:** "See what exists"

| Feature | Priority | Dependencies |
|---------|----------|--------------|
| Collections browser (grid/list, search, filter) | Critical | Data model, UI framework |
| Collection detail views | Critical | Collections browser |
| Basic discovery (available/accessible) | Critical | Collection data |
| Basic collection creation flow (draft only) | High | Data model |
| Role-based view switching | High | Auth/RBAC |
| Introduction/landing page | Medium | None |

**Key Deliverable:** Users can browse, search, and understand the data collection landscape.

---

### Q2 2026 - Manage & Request

**Theme:** "Take action on collections"

| Feature | Priority | Dependencies |
|---------|----------|--------------|
| Full collection creation wizard (all steps) | Critical | MVP collection model |
| Dataset assignment (d-code resolution from criteria) | Critical | Metadata integration (VS2-329) |
| User/team assignment (virtual teams) | Critical | User directory integration (VS2-330) |
| Modality/source/environment configuration | High | VS2-332, VS2-333, VS2-334 |
| Access request creation | High | Request data model |
| Basic request tracking (consumer view) | High | VS2-337 |
| DPO notification trigger (early notification) | Medium | DPO integration |
| Duplicate detection on submission | Medium | VS2-340 |

**Key Deliverable:** DCMs can create complete collections; Data Consumers can request access.

---

### Q3 2026 - Approve & Explain

**Theme:** "Govern and decide"

| Feature | Priority | Dependencies |
|---------|----------|--------------|
| Multi-TA approval workflow ("all or nothing") | Critical | VS2-339, VS2-349 |
| Approver queue and review interface | Critical | Approval data model |
| Due diligence/compliance output | High | VS2-331 |
| In-app approval workflow with digital acknowledgement and audit trail | High | Audit trail (VS2-350) |
| Approval explanation (why approved/denied) | High | Approval workflow |
| Operations tracker (DPO view) | High | VS2-336 |
| DPO delivery tracker | Medium | VS2-338 |
| Notification system (approvals, changes, access) | High | VS2-348 |
| "My Access" view for consumers | Medium | VS2-341 |

**Key Deliverable:** Full approval lifecycle managed in Collectoid with comprehensive audit trail, notification system, and state management.

---

### Q4 2026 - Audit & Optimize

**Theme:** "Track, analyze, and improve"

| Feature | Priority | Dependencies |
|---------|----------|--------------|
| Comprehensive audit trail with reporting | Critical | VS2-350 |
| Versioning system (full history, comparison) | High | VS2-335 |
| Access rules log and history | High | Audit trail |
| Analytics dashboards (demand heatmap, usage metrics) | High | Usage data |
| Gap analysis reporting | Medium | Analytics |
| Collection artifact management | Medium | VS2-345 |
| Collections visibility tracker (pipeline) | Medium | VS2-346 |
| Self-service routing decision support | Medium | VS2-347 |
| Quarterly review workflow automation | Medium | Approval workflow |
| Advanced search and AI recommendations | Low | Usage data |

**Key Deliverable:** Complete governance platform with full audit trail, analytics, and optimization.

---

## 8. Out of Scope

The following items are explicitly **NOT** included in the Collectoid production application scope for 2026:

### 8.1 Functional Exclusions

| Item | Reason | Alternative |
|------|--------|-------------|
| Raw clinical data storage or processing | Collectoid manages metadata and governance, not data itself | Data remains in PDP, entimICE, CTDS, and other source systems |
| Sherlock (AI-enabled Find & Explore) | Separate WP4 deliverable with its own product team | Sherlock is a companion application; see WP4 Sherlock BRD |
| USP (User Support Portal) | Separate WP4 deliverable | Dedicated support portal |
| DPO operational workflows (compliance verification, policy configuration in Ranger/Starburst/Immuta) | DPO operations occur in external systems | Collectoid surfaces DPO status data read-only; see persona 3.4 |
| External data sharing (WP2 scope) | Handled by WP2 - R&D Data Exchange | Separate workstream with different tools |
| Data preparation and metadata remediation | Handled by WP3 - Data Readiness | WP3 ensures data is AI-ready in PDP |
| Platform-level access control execution (Ranger, Immuta, Starburst policy configuration) | Downstream system responsibility | Collectoid sends instructions; systems teams execute |
| Consumer-side data analysis tools | Analysis happens in consumption environments | SCP, Domino, AI Bench, PDP, IO Platform |
| Mobile application | Desktop browser is primary use case | Responsive design down to 1024px only |
| Offline functionality | Corporate network access assumed | No offline mode |
| Multi-language support (2026) | English-only user base in scope | Architecture supports future localization |

### 8.2 Process Exclusions

| Item | Reason |
|------|--------|
| ROAM policy definition and governance design | Defined by R&D Data Office and documented in ROAM Guidance v1.1 |
| Training content creation and delivery | Training managed in existing LMS; Collectoid tracks completion status only |
| Organizational role assignments (who is a DDO, who is a GPT member) | Managed in AZ organizational structures; Collectoid consumes this data |
| Study metadata creation and curation | Managed in source systems (entimICE, PDP metadata services); Collectoid reads metadata |
| Legal/ethical assessment execution | Performed by DPO, legal, and ethics teams; Collectoid records outcomes |

---

## 9. Assumptions & Dependencies

### 9.1 Assumptions

| ID | Assumption | Risk if Invalid | Mitigation |
|----|------------|-----------------|------------|
| A-001 | The ROAM model (v1.1) is stable and will not undergo major revision during 2026 development | Significant rework of business logic | Early engagement with R&D Data Office on any proposed changes; modular architecture |
| A-002 | Study metadata is available via API from existing systems (entimICE, PDP, metadata services) | Cannot resolve d-codes or validate criteria | WP3 Data Readiness is on track to deliver metadata APIs; fallback to manual data import |
| A-003 | User identity and organizational data is available via Azure AD / Entra ID | Cannot implement SSO or role-based access | Standard AZ enterprise integration; verify API access early |
| A-004 | There are no more than 500 active collections and 2,000 studies per collection in the 2026 timeframe | Performance architecture may need revision | Monitor actual data volumes; design for 2x target |
| A-005 | DPO operations will continue to occur in external systems; Collectoid is not required to replace DPO tooling in 2026 | Scope expansion requiring additional functionality | Confirmed as design decision; see `docs/collectoid-v2-ux-roles.md` |
| A-006 | The built-in approval module with full audit trail, notifications, and state management will be a core MVP deliverable for Q1 2026 | Delayed delivery of approval functionality | Prioritize approval workflow as critical path item; design state machine early in sprint zero |
| A-007 | The four Collectoid UX roles (DCM, Approver, Team Lead, Data Consumer) adequately cover all required user interactions | Users may need additional roles or different role boundaries | Role design validated with stakeholders; see `docs/collectoid-v2-ux-roles.md` |
| A-008 | A development team of ~5.3 FTE (shared with Sherlock) is available throughout 2026 | Delayed delivery if team is smaller | Prioritize features ruthlessly; MVP scope is intentionally minimal |
| A-009 | React is the approved frontend framework aligned with AZ enterprise recommendations | Framework change would require re-implementation | Confirmed in WP4 technical approach documentation |
| A-010 | The existing POC prototype codebase can be evolved into the production application rather than requiring a full rewrite | Full rewrite adds 2-3 months to timeline | [QUESTION: Has a formal technical assessment of POC-to-production path been completed?] |

### 9.2 Dependencies

| ID | Dependency | Owner | Impact if Delayed | Required By |
|----|------------|-------|-------------------|-------------|
| D-001 | Study metadata API from WP3 / PDP metadata services | WP3 - Data Readiness | Cannot resolve d-codes from criteria; collection creation blocked | Q2 2026 |
| D-002 | User directory / organizational data API (Azure AD / Entra ID) | AZ IT / Identity Services | Cannot implement role-based access or virtual team management | Q1 2026 |
| D-003 | Immuta/Ranger API for policy status and provisioning triggers | DPO / Platform teams | Cannot surface provisioning status or trigger auto-provisioning | Q3 2026 |
| D-004 | ROAM v1.1 process finalization and stakeholder sign-off | R&D Data Office (Peder Blomgren) | Business rules may change, requiring rework | Q1 2026 |
| D-005 | WP1 ROAM rollout Phase 1 (defines which collections/users are in scope) | WP1 - Extended 90:10 | No production data to manage in Collectoid | Q2 2026 |
| D-006 | Tech Lead assignment for Collectoid | WP4 Leadership | Architecture decisions deferred; development pace reduced | Q1 2026 (TBC) |
| D-007 | UX/UI Designer assignment | WP4 Leadership | Design quality and consistency at risk | Q1 2026 (TBC) |
| D-008 | Hosting infrastructure (Azure) provisioning | AZ Cloud Services | Cannot deploy production application | Q2 2026 |
| D-009 | DPO tooling integration specification (what data DPO systems will expose) | DPO Operations | Read-only status views cannot be built without data contract | Q2 2026 |
| D-010 | AZ enterprise SSO integration approval and configuration | AZ IT Security | Users cannot authenticate in production | Q2 2026 |

---

## 10. JIRA Story Cross-Reference

### 10.1 Stories with Full Specifications (VS2-329 to VS2-340)

| JIRA Story | Title | Primary FR Module | Requirement IDs | Gap Status | Phase |
|------------|-------|-------------------|-----------------|------------|-------|
| **VS2-329** | Criteria and rules for Data Collection assets | FR-COL | FR-COL-004, FR-COL-005, FR-COL-006, FR-COL-007 | CRITICAL GAP | Q2 |
| **VS2-330** | User scope for access model (virtual teams) | FR-COL | FR-COL-040, FR-COL-041, FR-COL-042, FR-COL-043 | CRITICAL GAP | Q2 |
| **VS2-331** | Due diligence/compliance output | FR-AUD | FR-AUD-002, FR-AUD-003, FR-AUD-004, FR-AUD-005, FR-AUD-006, FR-AUD-007 | MAJOR GAP | Q3 |
| **VS2-332** | Collection data modalities | FR-COL | FR-COL-008, FR-COL-009, FR-COL-010 | MAJOR GAP | Q2 |
| **VS2-333** | Data Collection sources | FR-COL | FR-COL-011, FR-COL-012 | MAJOR GAP | Q2 |
| **VS2-334** | Consumption environments | FR-COL | FR-COL-013, FR-COL-014, FR-COL-015 | MAJOR GAP | Q2 |
| **VS2-335** | Versioning and change management | FR-COL | FR-COL-050, FR-COL-051, FR-COL-052, FR-COL-053, FR-COL-054, FR-COL-055 | CRITICAL GAP | Q4 |
| **VS2-336** | Data Collection operations tracker (DPO view) | FR-ANL | FR-ANL-005 | PARTIAL | Q3 |
| **VS2-337** | Data Collection request tracker (consumer view) | FR-REQ | FR-REQ-003 | MISSING | Q2 |
| **VS2-338** | DPO delivery tracker | FR-ANL | FR-ANL-005 | MISSING | Q3 |
| **VS2-339** | Open Access Collection approval execution | FR-APR | FR-APR-001, FR-APR-002, FR-APR-005, FR-APR-006, FR-APR-007, FR-APR-008 | MISSING | Q3 |
| **VS2-340** | Data Collection operations cross checks (duplicates) | FR-COL, FR-REQ | FR-REQ-007 (partial) | MISSING | Q2 |

### 10.2 Stories Referenced in Emails (VS2-341 to VS2-350) - Specifications Pending

| JIRA Story | Title | Primary FR Module | Requirement IDs | Phase |
|------------|-------|-------------------|-----------------|-------|
| **VS2-341** | User "My Access" view | FR-REQ | FR-REQ-004 | Q3 |
| **VS2-342** | Prohibited studies that cannot be requested | FR-REQ | FR-REQ-006 | Q3 |
| **VS2-343** | Similar access demand view | FR-DSC, FR-REQ | FR-DSC-004, FR-REQ-007 | Q4 |
| **VS2-344** | Standardize asset status SLA information | FR-REQ | FR-REQ-008 | Q4 |
| **VS2-345** | Data Collection artifact management | FR-AUD | FR-AUD-008 | Q4 |
| **VS2-346** | Collections visibility tracker | FR-REQ | FR-REQ-009 | Q4 |
| **VS2-347** | Self-service routing decision support | FR-REQ | FR-REQ-005 | Q4 |
| **VS2-348** | User notification for Collection changes | FR-NOT | FR-NOT-001, FR-NOT-002, FR-NOT-003, FR-NOT-004 | Q3 |
| **VS2-349** | Cross-TA Collection approval coordination | FR-APR | FR-APR-002, FR-APR-003, FR-APR-012 | Q3 |
| **VS2-350** | Audit Trail | FR-AUD | FR-AUD-001, FR-AUD-009 | Q4 |

### 10.3 Coverage Summary

| Gap Status | Count | Stories |
|------------|-------|---------|
| CRITICAL GAP | 3 | VS2-329, VS2-330, VS2-335 |
| MAJOR GAP | 3 | VS2-331, VS2-332, VS2-333, VS2-334 |
| PARTIAL | 1 | VS2-336 |
| MISSING | 4 | VS2-337, VS2-338, VS2-339, VS2-340 |
| SPECS PENDING | 10 | VS2-341 through VS2-350 |

**All 22 JIRA stories (VS2-329 through VS2-350) are mapped to functional requirements and assigned to delivery phases.** See `docs/specs/collectoid-v2-gap-analysis.md` for detailed Gherkin acceptance criteria per story.

---

## 11. Open Questions

Items marked with [QUESTION] throughout this document are consolidated here for tracking.

### 11.1 Business Process Questions

| ID | Question | Source | Impact | Status |
|----|----------|--------|--------|--------|
| Q-BIZ-001 | [QUESTION] Are DDO and TA Lead synonymous or distinct roles? Documentation uses both terms inconsistently. | Gap Analysis, UX Roles doc | Affects approval routing logic and role model | Awaiting AZ confirmation |
| Q-BIZ-002 | [QUESTION] Data Consumer Lead has dual descriptions: (1) oversees team compliance per ROAM Guidance, (2) defines intent and proposes criteria per Nov 2025 email. Are these the same role? | UX Roles doc | Affects Team Lead persona scope and permissions | Awaiting AZ confirmation |
| Q-BIZ-003 | [QUESTION] What is the exact quarterly review cadence and who prepares the review list? How are decisions recorded today? | Planning doc | Affects quarterly review workflow design | Awaiting AZ confirmation |
| Q-BIZ-004 | [QUESTION] Can DDOs delegate approval authority? If so, how deep can delegation go and how is it tracked? | UX Roles doc | Affects approval delegation feature design | Awaiting AZ confirmation |
| Q-BIZ-005 | [QUESTION] What happens when approval is overdue? Who can escalate and what is the escalation path? | UX Roles doc | Affects SLA notification and escalation design | Awaiting AZ confirmation |
| Q-BIZ-006 | [QUESTION] What constitutes "minimum information gates" that must be met before auto-provisioning (FR-APR-006)? | VS2-339 acceptance criteria | Affects auto-provisioning trigger logic | Awaiting AZ confirmation |

### 11.2 Technical Questions

| ID | Question | Source | Impact | Status |
|----|----------|--------|--------|--------|
| Q-TECH-001 | [QUESTION] Has a formal technical assessment of POC-to-production path been completed? Can the existing prototype codebase be evolved or is a rewrite required? | Assumption A-010 | 2-3 month timeline impact if rewrite needed | Awaiting Tech Lead assessment |
| Q-TECH-002 | [QUESTION] What metadata APIs are available from WP3/PDP today? What is the expected delivery timeline for missing APIs? | Dependency D-001 | Blocks d-code resolution and criteria validation | Awaiting WP3 confirmation |
| Q-TECH-003 | [QUESTION] What data will DPO systems expose for the read-only compliance and delivery status views? Is there an existing API or does one need to be built? | Dependency D-009 | Affects DPO status integration timeline | Awaiting DPO team confirmation |
| Q-TECH-004 | [QUESTION] What is the data contract between Collectoid and Immuta/Ranger for policy triggers? REST API, event-based, or manual? | FR-APR-006 | Affects auto-provisioning architecture | Awaiting platform team confirmation |
| Q-TECH-005 | [QUESTION] Are other languages required for the 2026 scope, or is English-only confirmed? | NFR-I18N-003 | Affects i18n architecture decisions | Awaiting confirmation |

### 11.3 Organizational Questions

| ID | Question | Source | Impact | Status |
|----|----------|--------|--------|--------|
| Q-ORG-001 | [QUESTION] When will the Tech Lead for Collectoid be confirmed? | Dependency D-006 | Architecture decisions and development pace | TBC |
| Q-ORG-002 | [QUESTION] When will the UX/UI Designer be confirmed? | Dependency D-007 | Design quality, accessibility compliance | TBC |
| Q-ORG-003 | [QUESTION] Should the role switcher be a development-time demo tool or a production feature? Some users (e.g., R&D Data Office staff) legitimately hold multiple roles. | FR-ADM-003 | Affects UI design and RBAC implementation | Requires design decision |
| Q-ORG-004 | [QUESTION] Should DCM be split into "Collection Creator" and "Collection Manager" or remain unified? | UX Roles doc | Affects role granularity and permissions model | Requires design decision |
| Q-ORG-005 | [QUESTION] What are the specific audit trail requirements for in-app approvals to satisfy compliance (GxP, SOX)? Do approvals require digital signatures or is acknowledgement sufficient? | FR-APR-009 | Affects approval UX and compliance architecture | Requires compliance team input |

---

## 12. Glossary

| Term | Definition |
|------|------------|
| **AIP** | Agreement in Principle - Initial sponsorship and endorsement to develop a new OAC or AOT |
| **AOT** | Data Use Terms - Formal document defining who can access what data under what terms |
| **BioPharma** | Collective term for CVRM, R&I, and V&I therapeutic areas |
| **Collectoid** | The "90 Data Collections Manager" application; this product |
| **CVRM** | Cardiovascular, Renal & Metabolic (therapeutic area) |
| **d-code** | Study identifier code (e.g., D7080C00001) used to uniquely identify clinical studies |
| **DCM** | Data Collection Manager - Collectoid UX role for collection administrators |
| **DDO** | Delegate Data Owner - Person delegated authority by Data Owner to make access decisions |
| **DOVS2** | Data Office Value Stream 2 - The parent program |
| **DPO** | Data Provisioning Operations - Team responsible for compliance and provisioning execution |
| **GPT** | Governance Project Team - TA-specific governance group that approves access requests |
| **iDAP** | Individual Data Access Platform (AZCt) - Legacy system being decommissioned in 2026 |
| **Immuta** | Data governance and access control platform |
| **OAC** | Open Access Collection - Defined scope of data users can access under ROAM |
| **ODSAI** | Oncology Data Science & AI |
| **PDP** | Precision Data Platform - AZ's data lakehouse |
| **R&I** | Respiratory & Immunology (therapeutic area) |
| **Ranger** | Apache Ranger - Data security and access control framework |
| **ROAM** | Role-based Open Access Model - The 90:10 access paradigm |
| **SCP** | Scientific Computing Platform |
| **SDTM** | Study Data Tabulation Model - CDISC standard for clinical data |
| **ADaM** | Analysis Data Model - CDISC standard for analysis datasets |
| **Sherlock** | AI-enabled data discovery application; companion to Collectoid |
| **Starburst** | Distributed SQL query engine used for data access |
| **TALT** | TA-level legal/compliance approval group |
| **V&I** | Vaccines & Immune Therapies (therapeutic area) |
| **VS2** | Value Stream 2 (= DOVS2) |
| **WP** | Work Package (numbered 1-4 within DOVS2) |
| **IDA** | Internal Data Agreement — standing authorisation track covering ~90% of access needs under ROAM. Maps to Immuta `Access_Authorisation.Authorisation_Type = 'IDA'` |
| **AdHoc** | Request-based authorisation track covering ~10% of access needs requiring individual approval. Maps to Immuta `Access_Authorisation.Authorisation_Type = 'AdHoc'` |
| **User Profile** | Immuta concept: criteria-based user group defined by boolean expressions matching over User_Tags (from Manual, NPA, Workday, Cornerstone) |
| **Partition** | Immuta concept: study-level row security boundary enforced via `Study_ID IN (...)` WHERE clauses at the Starburst query layer |
| **Data Access Intent** | Immuta concept: structured record of why a user needs data access, with Category and Sub_Category fields. One per permitted activity per collection |
| **User Tags** | Immuta concept: attributes attached to users, sourced from Manual entry, NPA (auto-fetched by Immuta), Workday, and Cornerstone |
| **Column Masking** | Immuta/Starburst concept: query-time redaction or obfuscation of sensitive data columns (e.g., PII, patient identifiers). Distinct from row-level partition security. Flagged as "to be added" in PBAC metadata diagram |

---

## 13. Appendices

### Appendix A: ROAM Process Flow (13 Steps)

The full ROAM process as documented in the Nov 2025 provisioning handover email:

```
Step  Description                                              Collectoid Role
----  -------------------------------------------------------  ----------------
1     Business demand for collection/update/policy change       FR-COL-001, FR-COL-002
2     Early notification to DPO with intent, criteria, users    FR-NOT-001
3     Translate criteria to stable metadata attributes          FR-COL-004
4     Produce definitive asset list (study d-codes)             FR-COL-005
5     Identify and assign Data Consumer Lead, Data Owner        FR-COL-040, FR-COL-041
6     Obtain approved artifacts (OAC, AOT, trainings)           FR-COL-016, FR-AUD-008
7     Confirm ethical/legal/data-owner approvals                FR-AUD-002, FR-AUD-003
8     DPO configures policies (Ranger/Starburst/Immuta)         External (read-only status)
9     Enable access in specified environments                   FR-COL-013
10    Update tracker with per-modality/source/env status        FR-ANL-005
11    Cross-check for conflicting requests (duplicates)         FR-REQ-007, VS2-340
12    Version changes and notify impacted teams                 FR-COL-050, FR-NOT-003
13    Maintain audit trail                                      FR-AUD-001
```

### Appendix B: Access Provisioning Model (20/30/40/10)

When a collection is created, each study's provisioning status falls into one of four categories:

| Category | % | Description | Collectoid Action |
|----------|---|-------------|-------------------|
| Already Open | 20% | Access already provisioned; no action needed | Display "Active" status |
| Awaiting Policy | 30% | DCM confirms criteria; Immuta policy needs creation | DCM confirms; system triggers policy creation; instant 90% access |
| Blocked, Needs Approval | 40% | Requires authorization from GPT/TALT before provisioning | Manage approval workflow; track multi-TA signatures |
| Missing | 10% | Data location unknown or required training incomplete | Flag for investigation; track resolution |

### Appendix C: Current Collections (2025 Baseline)

| Collection | Therapeutic Areas | Studies | In PDP | Status |
|------------|-------------------|---------|--------|--------|
| BioPharma Closed | CVRM, R&I, V&I | 836 | 307 | Active |
| Oncology Closed | ONC, IMMUONC | 411 | 139 | Active |
| Oncology Ongoing | ONC | 25 | 4 | In Review |

### Appendix D: Data Category Taxonomy (30+ Categories)

**Therapeutic Areas:** Oncology, CVRM, Respiratory & Immunology, Vaccines & Immune Therapies, Rare Disease, Neuroscience

**Clinical Data Types:**
- SDTM Domains (DM, AE, CM, LB, VS, EG, MH, PE, etc.)
- ADaM Datasets (ADSL, ADAE, ADLB, ADVS, ADTTE, etc.)
- RAW/Source Data

**Specialized Data Types:**
- ctDNA / Biomarker / Genomic
- Imaging / DICOM
- Omics / NGS
- Real-World Data (RWD)
- eCRF Data
- Consent Data
- Sample Data
- Study Metadata

**Study Categories by Status:**
- Closed (>6 months post-DBL)
- Closing (within 6 months of DBL)
- Ongoing
- Grey Zone (ambiguous status)

### Appendix E: Key Stakeholders

| Role | Name | Involvement |
|------|------|-------------|
| R&D Data Office Lead | Peder Blomgren (VP) | ROAM owner, Collectoid sponsor |
| WP4 Lead | Jamie MacPherson | Program sponsor |
| Product Manager (Collectoid) | Beata | Feature prioritization |
| Product Manager (Sherlock) | Rafa Jimenez | Companion product |
| Product Owner | Divya | Backlog management |
| Lead Software Engineer | Keith | Technical direction, POC author |
| Project Manager | Cayetana Vazquez | Delivery coordination |
| Business Analyst | Marcin | Requirements analysis |
| DDO - Oncology Biometrics | Renee Iacona (SVP) | Key approver stakeholder |
| DDO - Biometrics R&I | Christopher Miller (VP) | Key approver stakeholder |
| DDO - Biometrics CVRM | John Adler (VP) | Key approver stakeholder |
| DDO - Biometrics V&I | Ian Hirsch (VP) | Key approver stakeholder |
| Data Consumer Lead - ODSAI | Jorge Ries-Filho (VP) | Key consumer stakeholder |

---

**End of Document**

*This BRD should be reviewed in conjunction with the Gap Analysis (`docs/specs/collectoid-v2-gap-analysis.md`), UX Roles Design (`docs/collectoid-v2-ux-roles.md`), and Roles Matrix (`docs/collectoid-v2-roles-matrix.md`) for complete context.*

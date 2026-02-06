# Collectoid V2 - Gap Analysis: Current Flow vs ROAM Process

## Executive Summary

This document compares the **current 7-step UI flow** in Collectoid V2 against the **ROAM process** documented in emails, process diagrams, and JIRA stories (VS2-329 through VS2-350). The analysis identifies significant gaps in role-based workflows, data capture requirements, and approval mechanisms that need to be addressed.

**Document Sources:**
- JIRA Stories: VS2-329 to VS2-340 (full Gherkin specs)
- JIRA Stories: VS2-341 to VS2-350 (referenced in emails, specs pending)
- Email: "90:10 Open Access data provisioning handover process" (28 Nov 2025)
- Email: "Data Collection approval process and Adobe Sign implementation" (20 Jan 2026)
- Email: "VS2 - WP4: Agentic requirements" (process flow diagram)
- Process Flow Diagram: `docs/misc/emails/image001.png`

---

## ROAM Process Flow (from Process Diagram)

The official ROAM process involves **4 actors** across swimlanes:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│ USER                                                                            │
│  ○ Data demand → [Submit data demand] → [Document data and User scope] → ... → ○ Consume data │
└─────────────────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│ R&D DATA OFFICE                                                                 │
│  [Validate criteria feasibility] → [Convert criteria to metadata] →            │
│  [Confirm artefacts] → [Confirm intent] → [Create approval documentation] →    │
│  [Notify DPO]                                                                   │
│                                                                                 │
│  (parallel) [Nominate Collection Leader]                                        │
└─────────────────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│ TA LEAD                                                                         │
│  [Approve AoT] → [Validate data constraints]                                    │
└─────────────────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────────────────┐
│ DATA PROVISIONING OPERATIONS (DPO)                                              │
│  [Due diligence] → [Apply boundaries] → [Configure policy] → [Provision data]  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Key Process Principles (from Emails)

1. **Criteria must be unambiguous** - Map to stable metadata fields, produce concrete study d-codes/IDs
2. **Virtual teams over org lists** - Use tagged teams that someone actively manages, not broad org-driven lists
3. **Cross-TA = all-or-nothing** - If collection spans multiple TAs, ALL TA Leads must sign; single rejection blocks entire collection
4. **Version on decision changes** - New version + signature required when decisions change (e.g., rejected → approved)
5. **Adobe Sign is interim** - Collectoid must have comprehensive audit trail before replacing Adobe Sign
6. **Auto-provisioning goal** - Collectoid eventually auto-executes approved decisions to provision data

---

## Current UI Flow (7 Steps)

### Step 1: Collection Purpose/Intent
- **Current:** Text input for collection intent with AI keyword extraction
- **Captures:** Free-text intent, AI-suggested keywords

### Step 2: Select Categories
- **Current:** AI suggests categories based on intent keywords
- **Captures:** Category selections (e.g., Oncology, Biomarkers)

### Step 3: Multi-Dimensional Filtering
- **Current:** Filter datasets by multiple criteria (TA, phase, study status, etc.)
- **Captures:** Dataset selections with rich filtering

### Step 4: Define Activities & Purpose
- **Current:** Select permitted activities, AI suggests based on intent
- **Captures:** Activity types, access levels, conflict detection

### Step 5: Agreement of Terms
- **Current:** Configure AOT (ML/AI, publication rights, user scope)
- **Captures:** Usage permissions, user count by department, conflict acknowledgment

### Step 6: Review & Publish
- **Current:** Editable summary with access provisioning breakdown
- **Captures:** Collection name, description, target community, provisioning preview

### Step 7: Publishing & Execution Status
- **Current:** Shows immediate actions, in-progress items, help resources
- **Outputs:** Immuta policy generation, approval request routing, training reminders

---

## ROAM Process Steps (13 Steps from Documentation)

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

---

## Gap Analysis Matrix

| ROAM Step | Current Coverage | Gap Status | Required Changes |
|-----------|------------------|------------|------------------|
| **1. Business demand** | Partial (Step 1 intent) | MINOR | Add formal request type selection (new/update/policy change) |
| **2. Early DPO notification** | MISSING | CRITICAL | Add DPO notification trigger early in flow |
| **3. Translate to stable metadata** | MISSING | CRITICAL | Add metadata mapping step, validate criteria against catalog |
| **4. Definitive asset list (d-codes)** | Partial (Step 3 filtering) | MAJOR | Must output concrete study d-codes, not just dataset categories |
| **5. Assign Data Consumer Lead, DDO** | MISSING | CRITICAL | Add role assignment step for Data Consumer Lead and Data Owner |
| **6. Approved artifacts (OAC, AOT, trainings)** | Partial (Step 5 AOT) | MAJOR | Need OAC template selection, training requirements mapping |
| **7. Ethical/legal/data-owner approvals** | MISSING | CRITICAL | Add multi-TA approval workflow (Adobe Sign or built-in) |
| **8. DPO policy configuration** | Partial (Step 7 Immuta) | MINOR | Already automated but may need DPO checkpoint |
| **9. Analysis environments** | MISSING | MAJOR | No capture of which environments (SCP, Domino, AI Bench, etc.) |
| **10. Tracker update** | Partial (Step 7 status) | MAJOR | Need per-modality, per-source, per-environment tracking |
| **11. Cross-check duplicates** | MISSING | MAJOR | Add duplicate detection against existing collections (VS2-340) |
| **12. Version changes** | MISSING | CRITICAL | No versioning system for collection changes (VS2-335) |
| **13. Audit trail** | Partial (implicit) | MAJOR | Need explicit audit log (who approved what, when, where) |

---

## JIRA Story Coverage

### Stories with Full Specifications (VS2-329 to VS2-340)

| Story | Feature | Gap Status | UI Implication |
|-------|---------|------------|----------------|
| **VS2-329** | Criteria and rules for assets | CRITICAL GAP | Need metadata mapping validation, d-code resolution, auto-flagging based on metadata status |
| **VS2-330** | User scope (virtual teams) | CRITICAL GAP | Need DDO assignment, virtual team creation/editing, automatic sync with source system |
| **VS2-331** | Due diligence/compliance output | MAJOR GAP | Need per-study ethical/legal status view, auto-approval for pre-approved criteria, bulk approval interface |
| **VS2-332** | Data modalities selection | MAJOR GAP | Need modality include/exclude per study, source path association, validation for completeness |
| **VS2-333** | Data sources specification | MAJOR GAP | Need source selection per modality, no blank source validation |
| **VS2-334** | Consumption environments | MAJOR GAP | Need environment selection, default boundary application, additional environment options |
| **VS2-335** | Versioning and change management | CRITICAL GAP | Need version history, timestamped artifacts, impact analysis, auto-notification on changes, version increment on approval changes |
| **VS2-336** | Operations tracker (DPO view) | PARTIAL | Need comprehensive tracking record with all specified fields, cross-check functionality |
| **VS2-337** | Request tracker (consumer view) | MISSING | Need consumer-facing tracking dashboard with request status, approval status |
| **VS2-338** | DPO delivery tracker | MISSING | Need per-study delivery status, method availability, completion reporting |
| **VS2-339** | Approval execution | MISSING | Need TA Lead signature capture, cross-TA coordination, minimum information gates, auto-provisioning trigger |
| **VS2-340** | Cross-checks for duplicates | MISSING | Need duplicate detection, stakeholder notification, consolidated status display |

### Stories Referenced in Emails (VS2-341 to VS2-350) - Specs Pending

| Story | Feature | Description | UI Implication |
|-------|---------|-------------|----------------|
| **VS2-341** | User "My Access" view | Users view their current data access permissions | Personal access dashboard showing granted collections, pending requests |
| **VS2-342** | Prohibited studies that cannot be requested | Studies excluded from requests due to restrictions | Visual indicators for prohibited studies, explanation of why |
| **VS2-343** | Similar access demand view | View similar/related access requests | Recommendation engine showing related collections/requests |
| **VS2-344** | Standardise asset status SLA information | Consistent SLA display across assets | SLA indicators on study/dataset cards, timeline estimates |
| **VS2-345** | Data Collection artifact management | Manage collection artifacts (documents, approvals) | Document upload/download, artifact versioning, status tracking |
| **VS2-346** | Collections visibility tracker | Coordinate BAU requests vs upcoming collections | Dashboard showing collection pipeline, advise requesters to wait |
| **VS2-347** | Self-service routing decision support | Help users decide request route (90-route vs 10-route) | Decision tree/wizard to guide users to appropriate route |
| **VS2-348** | User notification for Collection changes | Notify users when collection access changes | Notification system, email integration, in-app alerts |
| **VS2-349** | Cross-TA Collection approval coordination | Coordinate approvals across therapeutic areas | Multi-approver workflow, all-or-nothing enforcement, cross-TA status view |
| **VS2-350** | Audit Trail | Complete audit trail for all actions | Comprehensive logging, audit report generation, compliance views |

---

## Critical Missing Features

### 1. Role Assignment Step (VS2-330)

**Current State:** No explicit role assignment in the flow

**Required:**
- Assign Data Consumer Lead (person who defines intent, proposes criteria, supplies asset list)
- Assign Data Owner / DDO (maintains virtual team, validates criteria, monitors changes)
- Link to Virtual Team lists maintained by DDO
- Automatic access updates when team membership changes in source system

**Acceptance Criteria (from VS2-330):**
```gherkin
GIVEN an Open Data Collection WHEN one is created
THEN a "virtual team" list of users is provided

GIVEN an existing "virtual team" WHEN it is being updated
THEN addition/removal of Users from the list is enabled

GIVEN changes to User membership in source system
WHEN team membership is updated
THEN access is automatically updated
```

**UI Implication:** New step between intent and filtering, or integrated into Step 1

---

### 2. Multi-TA Approval Workflow (VS2-339, VS2-349)

**Current State:** No approval step before publishing

**Required:**
- If collection spans multiple TAs, ALL relevant TA Leads must sign
- "All or nothing" principle - if any TA Lead rejects, collection cannot proceed for ANY TA
- Version changes require new signatures
- Capture formal signatures with complete audit trail and timestamps
- Auto-revoke and notify stakeholders when metadata changes invalidate access
- Auto-provision authorized studies upon all signatures collected

**Acceptance Criteria (from VS2-339):**
```gherkin
GIVEN a Cross-TA Collection WHEN submitted for approval
THEN all relevant TA Leads must sign

GIVEN a Cross-TA Collection WHEN any single TA Lead rejects
THEN the entire collection is blocked

GIVEN an approved collection WHEN metadata changes invalidate access
THEN auto-revoke and notify stakeholders

GIVEN all TA Lead signatures collected
WHEN minimum information gates are met
THEN Collectoid auto-provisions authorized studies
```

**UI Implication:** Major new step between Review and Publishing with:
- TA Lead identification based on selected datasets
- Approval request generation
- Status tracking (pending/approved/rejected per TA)
- Decision audit trail with timestamps

---

### 3. Data Modalities Selection (VS2-332)

**Current State:** Not captured

**Required:**
- Specify which data modalities are included per study:
  - Clinical (SDTM/ADaM)
  - Biomarker/Genomic
  - Imaging (DICOM)
  - Real-World Data
  - Omics/NGS
- Associate source path when recording data modality
- Support multiple modalities per study with include/exclude options
- No study can have blank data modality record

**Acceptance Criteria (from VS2-332):**
```gherkin
GIVEN an Open Access Collection WHEN recording data modalities
THEN associated source path is required

GIVEN data modalities for a study
WHEN recording them THEN selection of particular modality include/exclude is enabled

GIVEN data modalities WHEN recorded
THEN no Study has blank data modality record
```

**UI Implication:** Add to filtering step or as separate step with modality checkboxes per study

---

### 4. Data Sources Specification (VS2-333)

**Current State:** Not captured

**Required:**
- Specify data sources for each data modality:
  - entimICE
  - PDP (Precision Data Platform)
  - CTDS
  - Medidata Rave
  - Veeva Vault
  - External partners
- No blank data source for each modality

**Acceptance Criteria (from VS2-333):**
```gherkin
GIVEN defined data modality for a Study
WHEN the source system is recorded
THEN selection of data source for each modality is enabled

GIVEN defined data modality
WHEN submitted for execution
THEN no blank data source for each modality is present
```

**UI Implication:** Source dropdown per modality, validation for completeness

---

### 5. Consumption Environments (VS2-334)

**Current State:** Not captured

**Required:**
- Specify target analysis environments:
  - SCP (Scientific Computing Platform)
  - Domino Data Lab
  - AI Bench
  - PDP (Precision Data Platform)
  - IO Platform
- Default boundaries applied by leadership
- Additional environments selectable beyond defaults

**Acceptance Criteria (from VS2-334):**
```gherkin
GIVEN an Open Access Collection
WHEN recording where User will access the data
THEN target analysis environment selection is enabled

GIVEN a default provisioning boundary defined by Leadership
WHEN a data collection is set
THEN the default boundaries are applied (e.g., "Provision to Domino only")

GIVEN default boundaries
WHEN additional environments are needed
THEN additional ones are available for selection
```

**UI Implication:** New step or addition to Review step with environment checkboxes

---

### 6. Study D-Code List (Concrete Assets) (VS2-329)

**Current State:** Filters produce dataset categories, not specific studies

**Required:**
- Produce definitive list of study d-codes (e.g., "D-12345", "D-67890")
- Criteria must map to stable, explicit metadata attributes
- No ambiguous criteria allowed
- System automatically flags assets as "Out of Scope" or "Restricted" based on metadata status changes

**Acceptance Criteria (from VS2-329):**
```gherkin
GIVEN Open Data Collection access criteria
WHEN defining them using metadata fields
THEN criteria point to unambiguous list of assets AND list is reproducible

GIVEN Open Data Collection assets
WHEN input criteria are provided
THEN list of study d-codes OR Study IDs are listed

GIVEN metadata status changes (e.g., "Consented" → "Consent withdrawn")
WHEN detected
THEN assets are automatically flagged as "Out of Scope" or "Restricted"
```

**UI Implication:**
- Filtering step must resolve to concrete study list
- Add validation that criteria are unambiguous
- Show d-codes in review
- Status indicators for flagged studies

---

### 7. Versioning System (VS2-335)

**Current State:** No versioning

**Required:**
- Track changes to collections over time
- Create timestamped artifacts for each change
- Record what changed, who changed it, when
- Notify impacted teams when changes occur
- Decision changes (rejected → approved) require new version + signature
- Support periodic review cycles with outcome documentation

**Acceptance Criteria (from VS2-335):**
```gherkin
GIVEN an existing Open Access Collection
WHEN any changes are made
THEN a version history is maintained

GIVEN a change to Collection
WHEN saved
THEN timestamped artifact records what/who/when

GIVEN study status change (rejected → approved or vice versa)
WHEN recorded
THEN new version created with new TA Lead signature and timestamp

GIVEN automatic access revocation due to metadata changes
WHEN executed
THEN automated notifications sent to impacted users
```

**UI Implication:**
- Version number display throughout
- Change comparison views
- Notification system for stakeholders
- Version history timeline

---

### 8. Due Diligence/Compliance Output (VS2-331)

**Current State:** Not explicit

**Required:**
- Record ethical status confirmation per study
- Record legal status confirmation per study
- List all outstanding compliance checks
- Auto-approve when pre-approved criteria match
- Log reasons for non-accessible studies (data lost, quality incidents, etc.)
- Enable bulk approval with compliance verification
- Record signoffs with timestamps and approver identities
- Store finalized due diligence as versioned artifacts

**Acceptance Criteria (from VS2-331):**
```gherkin
GIVEN an Open Access Collection
WHEN compliance is verified
THEN ethical AND legal status confirmation records are enabled per study

GIVEN compliance verification
WHEN all checks pass AND matches pre-approved criteria
THEN auto-approve is triggered

GIVEN a study that cannot be provisioned
WHEN reason is documented
THEN log includes reason for non-accessibility

GIVEN multiple collections/studies
WHEN bulk approval is requested
THEN metadata status verification is performed before approval

GIVEN approval completion
WHEN signoff is recorded
THEN timestamp and approver identity are captured as versioned artifact
```

**UI Implication:**
- Compliance summary in Review step
- Per-study status indicators (ethical ✓/✗, legal ✓/✗)
- Bulk approval interface
- DPO verification checkpoint
- Signoff capture forms

---

### 9. Operations & Request Trackers (VS2-336, VS2-337, VS2-338)

**Current State:** Basic tracking exists, needs significant enhancement

**Required (VS2-336 - DPO Operations Tracker):**
- Requested assets (list)
- Approved and rejected assets (separate lists)
- Requested Users or User groups
- Approved and rejected Users or User groups
- Requested asset data modalities
- Approved and rejected asset data modalities
- Requested environment enablement status
- Approved and rejected environment enablement status
- Due diligence status
- Data source availability
- Requested modality-by-source provisioning status
- Relevant dates
- Notes for context
- Routing decision (self-serve via collection, 10-route/iDAP, or pending ROAM escalation)

**Required (VS2-337 - Consumer Request Tracker):**
- Same fields as VS2-336 but consumer-facing subset
- Pending, received, or rejected TA Lead approvals visible

**Required (VS2-338 - DPO Delivery Tracker):**
- Track record of each individual study in approved collection
- Each delivery method availability (e.g., available in PDP)
- Mechanism to submit request for addition of unavailable methods
- Count of studies added vs pending for each availability method
- Report showing completed and uncompleted study deliveries

**UI Implication:**
- Operations dashboard (DPO view)
- Self-service tracking dashboard (Consumer view)
- Delivery tracking dashboard (DPO view)
- Filtering, search, status indicators
- Completion reports

---

### 10. Duplicate Detection (VS2-340)

**Current State:** AOT conflict detection exists, but not cross-collection

**Required:**
- Cross-check against pending and existing collections when new request received
- Flag duplicates for review
- Notify stakeholders of potential duplicates
- Display status across all layers (due diligence, source availability, environment enablement)

**Acceptance Criteria (from VS2-340):**
```gherkin
GIVEN multiple collections being processed
WHEN a new request is received
THEN cross-check against pending and existing collections is performed

GIVEN cross-check output
WHEN duplicate found
THEN flagged for review AND stakeholders notified

GIVEN tracking display
WHEN viewing collection status
THEN status across all layers is shown
```

**UI Implication:**
- Add duplicate check in Review step
- Warning UI if overlaps detected
- Resolution workflow (merge or differentiate)

---

## Data Capture Comparison

### Currently Captured
| Data Point | Where Captured | Notes |
|------------|----------------|-------|
| Intent/Purpose | Step 1 | Free text + AI extraction |
| Categories | Step 2 | AI-suggested |
| Dataset filters | Step 3 | Multi-dimensional |
| Activities | Step 4 | With access levels |
| AOT permissions | Step 5 | ML/AI, publication, etc. |
| User scope | Step 5 | Count by department |
| Collection name | Step 6 | Editable |
| Description | Step 6 | Editable |
| Target community | Step 6 | Optional |

### Not Currently Captured (Required by ROAM)
| Data Point | JIRA Story | Priority |
|------------|------------|----------|
| Data Consumer Lead assignment | VS2-330 | HIGH |
| Data Owner (DDO) assignment | VS2-330 | HIGH |
| Virtual Team membership | VS2-330 | HIGH |
| Data modalities | VS2-332 | HIGH |
| Data sources per modality | VS2-333 | HIGH |
| Consumption environments | VS2-334 | HIGH |
| Study d-codes (concrete list) | VS2-329 | CRITICAL |
| Multi-TA approval status | VS2-339, VS2-349 | CRITICAL |
| Version number | VS2-335 | MEDIUM |
| Audit trail entries | VS2-350 | MEDIUM |
| Cross-collection duplicate check | VS2-340 | MEDIUM |
| Ethical/legal status per study | VS2-331 | MEDIUM |
| Delivery method availability | VS2-338 | MEDIUM |
| User "My Access" data | VS2-341 | MEDIUM |
| Prohibited study indicators | VS2-342 | LOW |
| Similar demand suggestions | VS2-343 | LOW |
| SLA information | VS2-344 | LOW |

---

## Recommended Flow Restructuring

### Proposed 11-Step Flow

```
1. Collection Request Type & Intent
   - New: Request type selector (New / Update / Policy Change)
   - New: If update/change, link to existing collection
   - Existing: Intent input with AI extraction
   - New: Early DPO notification trigger

2. Role Assignment
   - NEW STEP
   - Assign Data Consumer Lead
   - Assign Data Owner (DDO)
   - Link to Virtual Team
   - Nominate Collection Leader

3. Data Selection Criteria
   - Enhanced Step 3
   - Existing filters + must resolve to concrete d-codes
   - Validate criteria against stable metadata
   - New: Modality selection per study (include/exclude)
   - New: Source selection per modality

4. Consumption Environments
   - NEW STEP
   - Select target analysis environments
   - Apply default boundaries
   - Validate against environment-dataset compatibility

5. Activities & Access Levels
   - Existing Step 4
   - No changes needed

6. Agreement of Terms
   - Existing Step 5
   - Add: Training requirements summary
   - Add: OAC template selection (if applicable)

7. Compliance & Due Diligence
   - NEW STEP
   - Per-study ethical/legal status review
   - Auto-approval check for pre-approved criteria
   - Log non-accessible studies with reasons
   - Duplicate collection check

8. Multi-TA Approval
   - NEW STEP
   - Identify required TA Lead approvers based on studies
   - Generate approval requests
   - Track approval status (pending/approved/rejected per TA)
   - Enforce "all or nothing" for cross-TA
   - Capture signatures with timestamps and audit trail

9. Review & Confirm
   - Enhanced Step 6
   - Add: Concrete d-code list display
   - Add: Version number
   - Add: Compliance summary
   - Add: Audit preview

10. Publishing & Execution
    - Existing Step 7
    - Add: Version tracking
    - Add: Stakeholder notification
    - Enhanced: Per-modality/source/environment tracking
    - Trigger: Auto-provision upon all approvals

11. Post-Publishing Management
    - NEW STEP (ongoing)
    - Version history and change tracking
    - Notification center for collection changes
    - Delivery tracking dashboard
    - Periodic review cycle support
```

---

## Design Decisions (Confirmed)

### D1: V2 Role Structure
**Decision:** Focus on the 4 roles defined in Collectoid V2:

| Role | Short Code | Primary Focus | Status |
|------|------------|---------------|--------|
| **Collection Manager** | DCM | Create and manage data collections | Available |
| **Approver** | DDO | Review and approve access requests | Coming soon |
| **Team Lead** | Lead | Oversee team's data access | Coming soon |
| **Data Consumer** | User | View own access status | Coming soon |

These V2 roles map to ROAM process actors as follows:
- **Collection Manager (DCM)** → R&D Data Office staff, Collection administrators
- **Approver (DDO)** → Data Owners, TA Leads, GPT/TALT members
- **Team Lead** → Department heads, Data Consumer Leads
- **Data Consumer** → Researchers, Scientists (covered in original Collectoid)

### D2: Built-in Approval Module
**Decision:** Design for built-in approval module with comprehensive audit trail.

**Implications:**
- UI/UX must accommodate full approval procedures within Collectoid
- Must capture formal signatures with timestamps
- Must support multi-TA approval coordination ("all or nothing")
- Must maintain complete audit trail for compliance
- Adobe Sign is interim only - Collectoid will eventually replace it

### D3: Development Approach
**Decision:** Hybrid approach - creating V2 as a separate concept that may merge back into original.

**Implications:**
- V2 can explore new UX patterns without breaking existing prototype
- Focus on natural-feeling collection creation process
- If V2 gets positive feedback, merge best concepts back
- Maintain compatibility with original Collectoid structure

### D4: V2 Scope
**Decision:** V2 focuses on governance side, not consumer side.

**V2 Focus Areas:**
- Collection creation workflow (natural feeling process)
- Approval procedures and workflows
- Governance requirements
- Audit trail and compliance

**Out of Scope for V2 (covered in original):**
- Consumer data discovery (Sherlock)
- Consumer request tracking (VS2-337)
- "My Access" view (VS2-341)
- Self-service routing (VS2-347)

---

## JIRA Stories Mapped to V2 Roles

### Collection Manager (DCM) - Primary Role

| Story | Feature | V2 Relevance |
|-------|---------|--------------|
| **VS2-329** | Criteria and rules for assets | CORE - Metadata validation in collection creation |
| **VS2-330** | User scope (virtual teams) | CORE - User/team assignment in collection creation |
| **VS2-332** | Data modalities selection | CORE - Part of collection creation wizard |
| **VS2-333** | Data sources specification | CORE - Part of collection creation wizard |
| **VS2-334** | Consumption environments | CORE - Part of collection creation wizard |
| **VS2-335** | Versioning and change management | CORE - Collection lifecycle management |
| **VS2-336** | Operations tracker | CORE - DCM dashboard view |
| **VS2-340** | Cross-checks for duplicates | IMPORTANT - Collection creation validation |
| **VS2-345** | Artifact management | IMPORTANT - Collection document management |
| **VS2-346** | Collections visibility tracker | IMPORTANT - DCM pipeline view |

### Approver (DDO) - Secondary Role

| Story | Feature | V2 Relevance |
|-------|---------|--------------|
| **VS2-331** | Due diligence output | CORE - Compliance review interface |
| **VS2-339** | Approval execution | CORE - Signature capture, approval workflow |
| **VS2-349** | Cross-TA approval coordination | CORE - Multi-approver workflow |
| **VS2-350** | Audit trail | CORE - Decision history and compliance |
| **VS2-335** | Versioning | IMPORTANT - Version approval on changes |

### Team Lead - Future Role

| Story | Feature | V2 Relevance |
|-------|---------|--------------|
| **VS2-330** | Virtual team management | CORE - Team member oversight |
| **VS2-348** | User notifications | IMPORTANT - Team notification management |

### Out of V2 Scope (Original Collectoid)

| Story | Feature | Reason |
|-------|---------|--------|
| VS2-337 | Consumer request tracker | Consumer-facing |
| VS2-341 | User "My Access" view | Consumer-facing |
| VS2-342 | Prohibited studies | Consumer-facing |
| VS2-343 | Similar demand view | Consumer-facing |
| VS2-347 | Self-service routing | Consumer-facing |

---

## V2 Priority Matrix

### Phase 1 - Collection Creation Core

**Goal:** Natural-feeling collection creation process with proper data capture

| Story | Feature | V2 Role | Effort |
|-------|---------|---------|--------|
| VS2-329 | Concrete d-code resolution + metadata validation | DCM | HIGH |
| VS2-330 | Role assignment + virtual team management | DCM | MEDIUM |
| VS2-332 | Data modalities selection | DCM | LOW |
| VS2-333 | Data sources specification | DCM | LOW |
| VS2-334 | Consumption environments | DCM | LOW |

### Phase 2 - Approval Workflow

**Goal:** Built-in approval module with full audit trail

| Story | Feature | V2 Role | Effort |
|-------|---------|---------|--------|
| VS2-331 | Due diligence/compliance review | Approver | MEDIUM |
| VS2-339 | Multi-TA approval execution | Approver | HIGH |
| VS2-349 | Cross-TA approval coordination | Approver | MEDIUM |
| VS2-350 | Audit trail | Approver | MEDIUM |

### Phase 3 - Governance & Lifecycle

**Goal:** Complete collection lifecycle management

| Story | Feature | V2 Role | Effort |
|-------|---------|---------|--------|
| VS2-335 | Versioning system | DCM/Approver | HIGH |
| VS2-336 | Operations tracker | DCM | MEDIUM |
| VS2-340 | Duplicate detection | DCM | MEDIUM |
| VS2-348 | User notifications | All | LOW |

### Phase 4 - Enhanced Features

**Goal:** Improved operational efficiency

| Story | Feature | V2 Role | Effort |
|-------|---------|---------|--------|
| VS2-338 | Delivery tracker | DCM | MEDIUM |
| VS2-344 | SLA information | DCM | LOW |
| VS2-345 | Artifact management | DCM | MEDIUM |
| VS2-346 | Collections visibility tracker | DCM | LOW |

---

## Next Steps

1. ✅ Review gap analysis with user
2. ✅ Confirm V2 role structure (DCM, Approver, Team Lead, Data Consumer)
3. ✅ Confirm built-in approval module approach
4. ✅ Confirm V2 scope (governance/approval focus, not consumer)
5. ⏳ **Brainstorm Collection Creation Flow** - Design natural-feeling 11-step process
6. ⏳ **Design Approver Workflow** - Built-in approval UI with audit trail
7. ⏳ **Implement Phase 1** - Collection creation core (VS2-329, VS2-330, VS2-332-334)
8. ⏳ **Implement Phase 2** - Approval workflow (VS2-331, VS2-339, VS2-349, VS2-350)
9. ⏳ **Review & Merge** - Evaluate V2 concepts for merge back to original

---

## Appendix: JIRA Story Quick Reference

### Full Specifications Available (VS2-329 to VS2-340)

| Story | Title | Primary Actor |
|-------|-------|---------------|
| VS2-329 | Criteria and rules for Data Collection assets | DPO Officer |
| VS2-330 | User scope for access model | Data Owner/DDO |
| VS2-331 | Due diligence output | DPO Officer |
| VS2-332 | Collection data modalities | Data Owner/DDO |
| VS2-333 | Data Collection sources | Data Owner/DDO |
| VS2-334 | Consumption environments | Data Owner/DDO |
| VS2-335 | Versioning and Change Management | Data Owner/DDO, DPO Officer |
| VS2-336 | Data Collection operations tracker | Data Owner/DDO, DPO Officer, Data Consumer Lead |
| VS2-337 | Data Collection request tracker | Data Consumer |
| VS2-338 | DPO delivery tracker | DPO Officer |
| VS2-339 | Open Access Collection approval execution | System/TA Lead |
| VS2-340 | Data Collection operations cross checks | System |

### Referenced in Emails (VS2-341 to VS2-350) - Specs Pending

| Story | Title | Likely Actor |
|-------|-------|--------------|
| VS2-341 | User "My Access" view | Data Consumer |
| VS2-342 | Prohibited studies that cannot be requested | Data Consumer |
| VS2-343 | Similar access demand view | Data Consumer/DCM |
| VS2-344 | Standardise asset status SLA information | All Users |
| VS2-345 | Data Collection artifact management | Data Owner/DDO |
| VS2-346 | Collections visibility tracker | DPO Officer |
| VS2-347 | Self-service routing decision support | Data Consumer |
| VS2-348 | User notification for Collection changes | Data Consumer |
| VS2-349 | Cross-TA Collection approval coordination | TA Lead |
| VS2-350 | Audit Trail | DPO Officer/Compliance |

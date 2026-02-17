# Epic 10: Approval Workflow

**Goal:** Enable multi-TA approval coordination with full audit trail, supporting the "all or nothing" rule for cross-TA collections.

**Personas:** Approver (DDO/TA Lead/GPT/TALT), DCM

**BRD Refs:** FR-APR-001 through FR-APR-012, VS2-339, VS2-349

**Sizing Key:** S = 1-2 days | M = 3-5 days | L = 1-2 weeks | XL = 2+ weeks

---

## 10.1 - Approval Routing Engine `[XL]`

**As the** system, **I want to** automatically route approval requests to the correct approvers based on therapeutic area, legal requirements, data ownership, and partnership status, **so that** the right people review each collection.

**BRD Refs:** FR-APR-001, VS2-339

### Acceptance Criteria

```gherkin
Feature: Approval Routing Engine

  Scenario: Route approval based on therapeutic area
    Given a collection is submitted for approval
    When the system analyzes the studies' therapeutic areas
    Then approval requests are created and routed to the TA Lead for each therapeutic area

  Scenario: Route to multiple approver types
    Given a collection requires DDO, GPT, TALT, and Alliance Manager approval
    When the system routes the approval
    Then separate approval requests are created for each required approver type/queue

  Scenario: Cross-TA collection creates per-TA approval requests
    Given a collection spans Oncology, Respiratory, and CVMD therapeutic areas
    When the system routes the approval
    Then three separate approval_request records are created (one per TA)
    And each is routed to the respective TA Lead

  Scenario: Partnership studies route to Alliance Manager
    Given a collection includes partnered studies
    Then the approval request is additionally routed to the Alliance Manager queue
```

---

## 10.2 - Approver Queue View `[L]`

**As an** Approver, **I want to** see all pending approval requests in my queue with filtering and sorting, **so I can** efficiently manage my workload.

**BRD Refs:** FR-APR-010

### Acceptance Criteria

```gherkin
Feature: Approver Queue View

  Scenario: View pending approvals
    Given I am logged in as an Approver
    When I navigate to my approval queue
    Then all pending approval requests assigned to me are displayed

  Scenario: Filter queue by type
    Given I am viewing my approval queue
    When I filter by type (OAC, AoT, Opt-in/Opt-out)
    Then only requests of that type are displayed
    And count badges show the total per filter

  Scenario: Sort queue by SLA remaining
    Given I am viewing my approval queue
    When I sort by SLA remaining
    Then requests closest to SLA breach appear first

  Scenario: Mark items as reviewed
    Given I am viewing a request in my queue
    When I mark it as reviewed (without a decision)
    Then the item is visually distinguished from un-reviewed items
```

---

## 10.3 - Approval Review Interface `[L]`

**As an** Approver, **I want a** comprehensive review interface showing the collection details filtered to my TA, **so I** have full context for my decision.

### Acceptance Criteria

```gherkin
Feature: Approval Review Interface

  Scenario: Review interface shows TA-relevant details
    Given I am reviewing a cross-TA collection
    When I open the review interface
    Then the collection summary is filtered to show only studies in my therapeutic area

  Scenario: Compliance status visible per study
    Given I am reviewing a collection
    Then each study shows its ethical and legal compliance status

  Scenario: AoT terms summary visible
    Given I am reviewing a collection
    Then the Agreement of Terms summary is displayed

  Scenario: Previous approval decisions visible
    Given other TA Leads have already made decisions on this collection
    Then their decisions are visible for cross-TA context

  Scenario: Discussion thread available
    Given I am reviewing a collection
    Then a discussion thread is available for asking questions or leaving comments
```

---

## 10.4 - Approval Decision Actions `[M]`

**As an** Approver, **I want to** approve, reject, request changes, or delegate, **so I can** take the appropriate action.

**BRD Refs:** FR-APR-005

### Acceptance Criteria

```gherkin
Feature: Approval Decision Actions

  Scenario: Approve a collection
    Given I am reviewing a collection
    When I click "Approve" and optionally add comments
    Then my approval decision is recorded with: identity, decision, timestamp, comments
    And an immutable audit record is created

  Scenario: Reject a collection with mandatory reason
    Given I am reviewing a collection
    When I click "Reject"
    Then I must provide a rejection reason
    And the rejection decision is recorded with all details

  Scenario: Reject without reason is blocked
    Given I am rejecting a collection
    When I attempt to confirm without providing a reason
    Then the rejection is blocked with a validation message

  Scenario: Request changes with feedback
    Given I am reviewing a collection
    When I click "Request Changes" and provide specific feedback
    Then the DCM is notified with my feedback
    And the request status updates to reflect the change request

  Scenario: Delegate to another approver
    Given I am reviewing a collection
    When I click "Delegate" and select another qualified approver
    Then the approval request is reassigned to the delegate
    And an audit record of the delegation is created
```

---

## 10.5 - Digital Signature/Acknowledgement Capture `[M]`

**As the** system, **I want to** capture formal acknowledgement with complete audit trail for each approval decision, **so that** governance is legally defensible.

**BRD Refs:** FR-APR-004, FR-APR-009

### Acceptance Criteria

```gherkin
Feature: Digital Signature/Acknowledgement Capture

  Scenario: In-app digital acknowledgement
    Given an approver makes a decision
    When the decision is submitted
    Then the system captures an in-app digital acknowledgement
    And the acknowledgement includes: approver identity, role, decision, timestamp, comments

  Scenario: Acknowledgement is immutably stored
    Given a digital acknowledgement has been captured
    Then it is stored immutably in the audit_events table
    And it cannot be modified or deleted after creation

  Scenario: No external signing tool required
    Given the approval workflow
    Then all acknowledgements are handled in-app (not via Adobe Sign or similar)
```

---

## 10.6 - Cross-TA "All or Nothing" Enforcement `[L]`

**As the** system, **I want to** enforce that if any single TA Lead rejects a cross-TA collection, the entire collection is blocked for ALL therapeutic areas, **so that** the all-or-nothing rule is respected.

**BRD Refs:** FR-APR-002, VS2-349

### Acceptance Criteria

```gherkin
Feature: Cross-TA All or Nothing Enforcement

  Scenario: Single TA rejection blocks entire collection
    Given a collection spans Oncology, Respiratory, and CVMD
    And Oncology and Respiratory have approved
    When CVMD rejects the collection
    Then the collection status is set to "rejected" for ALL therapeutic areas
    And all stakeholders (DCM, Oncology Lead, Respiratory Lead) are notified of the rejection

  Scenario: Blocking status is clearly displayed
    Given a collection has been rejected due to a single TA rejection
    When any user views the collection
    Then a clear blocking status is displayed indicating which TA rejected
    And the reason for rejection is visible

  Scenario: All TAs must approve for collection to proceed
    Given a collection spans multiple TAs
    Then the collection cannot proceed to "approved" status until ALL TA Leads have approved
```

---

## 10.7 - Cross-TA Approval Status Visualization `[M]`

**As a** user, **I want to** see the per-TA approval status (approved/pending/rejected) for cross-TA collections, **so I** understand where the collection stands.

**BRD Refs:** FR-APR-012, VS2-349

### Acceptance Criteria

```gherkin
Feature: Cross-TA Approval Status Visualization

  Scenario: Per-TA status indicators
    Given a collection spans multiple therapeutic areas
    When I view the collection detail or progress page
    Then each TA shows a visual indicator: approved (green), pending (amber), rejected (red)
    And the approver name is shown per TA
    And the decision date is shown per TA (if decided)

  Scenario: Pending TAs are clearly identifiable
    Given some TAs have approved and some are pending
    Then pending TAs are visually distinguished and easy to identify
```

---

## 10.8 - All-Approved Trigger (Provisioning) `[L]`

**As the** system, when all required TA Leads have approved, **I want to** automatically transition the collection to "provisioning" and trigger downstream policy creation, **so that** access is provisioned without manual intervention.

**BRD Refs:** FR-APR-006

### Acceptance Criteria

```gherkin
Feature: All-Approved Trigger

  Scenario: All TAs approved triggers provisioning
    Given a collection has approval requests for 3 TAs
    When the last TA Lead approves
    Then the system verifies all TAs are approved
    And minimum information gates are verified
    And the collection status transitions to "provisioning"

  Scenario: Downstream policy creation is triggered
    Given the collection has transitioned to "provisioning"
    Then Immuta policy creation is triggered asynchronously via SQS
    And Starburst access configuration is triggered

  Scenario: DCM is notified of provisioning start
    Given all approvals are complete and provisioning begins
    Then the DCM receives a notification confirming all approvals and provisioning start

  Scenario: Partial approvals do not trigger provisioning
    Given a collection has 3 TA approval requests
    And only 2 have approved
    Then provisioning is not triggered
    And the collection remains in "pending_approval" status
```

---

## 10.9 - Auto-Revoke on Metadata Invalidation `[L]`

**As the** system, **I want to** automatically revoke access and notify stakeholders when metadata changes invalidate previously approved access, **so that** compliance is maintained.

**BRD Refs:** FR-APR-007

### Acceptance Criteria

```gherkin
Feature: Auto-Revoke on Metadata Invalidation

  Scenario: Metadata change invalidates access
    Given a collection has active access based on approved metadata
    When a metadata change invalidates the approval criteria
    Then the affected access is automatically revoked
    And all affected stakeholders are notified
    And an audit record is created documenting the revocation reason

  Scenario: Notification includes change details
    Given access has been auto-revoked
    Then the notification to stakeholders includes: which studies were affected, what metadata changed, and what access was revoked
```

---

## 10.10 - Re-Approval on Decision Change `[M]`

**As the** system, when an approval decision changes (e.g., previously rejected study is now approved), **I want to** create a new collection version and require fresh signatures, **so that** governance remains valid.

**BRD Refs:** FR-APR-008

### Acceptance Criteria

```gherkin
Feature: Re-Approval on Decision Change

  Scenario: Decision change creates new version
    Given a study in a collection had a previous approval decision
    When the decision changes
    Then a new collection version is created
    And prior approvals are invalidated

  Scenario: Fresh TA Lead signatures required
    Given prior approvals have been invalidated
    Then new approval requests are routed to all required TA Leads
    And the TA Leads are notified of the re-approval requirement with context
```

---

## 10.11 - Quarterly Opt-In/Opt-Out Review Workflow `[XL]`

**As a** DCM, **I want to** initiate quarterly review workflows where DDOs approve study inclusion or exclusion, **so that** collections stay governed and current.

**BRD Refs:** FR-APR-011

### Acceptance Criteria

```gherkin
Feature: Quarterly Opt-In/Opt-Out Review Workflow

  Scenario: DCM creates a review cycle
    Given an active collection is due for quarterly review
    When the DCM initiates a review cycle with proposed study changes
    Then the review cycle is created
    And DDOs are notified with a structured review interface

  Scenario: DDO makes per-study decisions
    Given a review cycle is active
    When the DDO accesses the review interface
    Then they can approve or reject each study's continued inclusion
    And they can provide comments per decision

  Scenario: Results are aggregated and collection updated
    Given all DDOs have completed their reviews
    Then the results are aggregated
    And the collection is updated to reflect opt-in/opt-out decisions
    And a version snapshot with the review outcomes is created
```

---

## 10.12 - Approval Delegation `[M]`

**As an** Approver, **I want to** delegate my approval authority to another qualified person, **so that** approvals aren't blocked when I'm unavailable.

### Acceptance Criteria

```gherkin
Feature: Approval Delegation

  Scenario: Delegate to a qualified approver
    Given I have a pending approval request
    When I choose to delegate
    Then I can select from qualified approvers in the same TA
    And I must provide a delegation reason and expected duration

  Scenario: Delegation audit trail
    Given I have delegated an approval
    Then an audit trail records: original approver, delegate, reason, duration, timestamp

  Scenario: Original approver notified of delegate's decision
    Given my delegate has made an approval decision
    Then I receive a notification of the decision and its details
```

---

## 10.13 - Bulk Approval with Pre-Verification `[M]`

**As an** Approver, **I want to** approve multiple studies at once after metadata pre-verification, **so I can** efficiently process large collections.

**BRD Refs:** FR-AUD-006

### Acceptance Criteria

```gherkin
Feature: Bulk Approval with Pre-Verification

  Scenario: Select multiple studies for bulk approval
    Given I am reviewing a collection with many studies
    When I select multiple studies using the multi-select interface
    Then the system pre-verifies metadata status for all selected studies

  Scenario: Pre-verification passes
    Given all selected studies pass metadata verification
    When I click "Approve Selected"
    Then a single approval action is recorded covering all selected studies
    And audit records are created for each study

  Scenario: Pre-verification fails for some studies
    Given some selected studies fail metadata verification
    Then failing studies are flagged with reasons
    And I can approve only the passing studies
    And I must individually review the failing studies
```

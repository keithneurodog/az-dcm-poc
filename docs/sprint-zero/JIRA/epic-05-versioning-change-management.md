# Epic 5: Collection Versioning & Change Management

**Goal:** Track all changes to collections with immutable version history and support comparison between versions.

**Personas:** DCM, Approver

**BRD Refs:** FR-COL-050 through FR-COL-055, VS2-335

**Sizing Key:** S = 1-2 days | M = 3-5 days | L = 1-2 weeks | XL = 2+ weeks

---

## 5.1 - Automatic Version Creation on Change `[L]`

**As the** system, **I want to** create a new immutable version snapshot whenever a collection is meaningfully changed, **so that** there is a complete history.

**BRD Refs:** FR-COL-050

### Acceptance Criteria

```gherkin
Feature: Automatic Version Creation on Change

  Scenario Outline: Version created on meaningful change
    Given a collection exists
    When a "<change_type>" change occurs
    Then a new immutable version snapshot is created
    And the version number is auto-incremented
    And the snapshot contains the full JSONB state of the collection
    And a human-readable change summary is generated
    And the change type is classified as "<change_type>"

    Examples:
      | change_type            |
      | dataset_add            |
      | dataset_remove         |
      | aot_change             |
      | user_scope_change      |
      | approval_decision      |
      | metadata_update        |
      | periodic_review_outcome|

  Scenario: Version snapshot is immutable
    Given a version snapshot has been created
    When any attempt is made to modify the snapshot
    Then the modification is rejected
    And the original snapshot remains unchanged
```

---

## 5.2 - Version History Browser `[M]`

**As a** DCM, **I want to** browse the complete version history of a collection, **so I can** see how it evolved.

### Acceptance Criteria

```gherkin
Feature: Version History Browser

  Scenario: View version history
    Given I am on a collection's detail page
    When I navigate to the version history
    Then I see a chronological list of all versions
    And each entry shows: version number, change summary, change type, author, timestamp

  Scenario: Navigate to a specific version
    Given I am viewing the version history
    When I click on a specific version entry
    Then I see the full snapshot of the collection at that version
    And it is displayed in read-only mode
```

---

## 5.3 - Version Comparison (Diff View) `[L]`

**As a** DCM, **I want to** compare any two versions of a collection side-by-side, **so I can** understand exactly what changed.

**BRD Refs:** FR-COL-055

### Acceptance Criteria

```gherkin
Feature: Version Comparison

  Scenario: Select two versions for comparison
    Given I am viewing the version history
    When I select two versions to compare
    Then a side-by-side diff view is displayed

  Scenario: Diff shows all change types
    Given I am viewing a version comparison
    Then I see: added datasets (green), removed datasets (red), changed AoT terms, user scope changes, status changes
    And additions are color-coded green
    And removals are color-coded red

  Scenario: Compare non-adjacent versions
    Given versions 1, 5, and 12 exist
    When I select versions 1 and 12 for comparison
    Then the cumulative differences between the two versions are displayed
```

---

## 5.4 - Change Artifacts (Timestamped Records) `[M]`

**As the** system, **I want to** store timestamped artifacts for every change recording what changed, who changed it, and when, **so that** the audit trail is complete.

**BRD Refs:** FR-COL-051

### Acceptance Criteria

```gherkin
Feature: Change Artifacts

  Scenario: Change artifact is created on every change
    Given a collection is modified
    When the change is saved
    Then a timestamped change artifact is created
    And the artifact records: before state, after state (delta), actor identity, actor role, timestamp
    And the artifact is linked to the audit_events table

  Scenario: Change artifacts are immutable
    Given a change artifact has been created
    Then the artifact cannot be modified or deleted
    And it is available for compliance and audit queries
```

---

## 5.5 - Re-Approval Trigger on Decision Change `[L]`

**As the** system, **I want to** create a new version and require fresh TA Lead signatures when a study's decision status changes, **so that** governance remains valid.

**BRD Refs:** FR-COL-052

### Acceptance Criteria

```gherkin
Feature: Re-Approval Trigger on Decision Change

  Scenario: Decision change triggers new version
    Given a study in a collection had a previous decision of "rejected"
    When the study's decision status changes to "approved"
    Then a new collection version is automatically created
    And the change is recorded with the decision change details

  Scenario: Previous approvals are invalidated
    Given a decision change has triggered a new version
    Then all previous TA Lead approvals for the collection are invalidated
    And the collection is routed for fresh TA Lead signatures

  Scenario: Impacted approvers are notified
    Given fresh signatures are required
    Then all impacted TA Lead approvers are notified
    And the notification includes the reason for re-approval
```

---

## 5.6 - Notify Users on Version Changes `[M]`

**As the** system, **I want to** notify impacted users when a version change affects their access, **so they're** informed promptly.

**BRD Refs:** FR-COL-053

### Acceptance Criteria

```gherkin
Feature: Notify Users on Version Changes

  Scenario: Access-impacting change triggers notification
    Given a new collection version is created
    When the version change impacts user access (e.g., dataset removed, scope changed)
    Then all affected users receive a notification
    And the notification explains what changed and how their access is affected

  Scenario: Non-access-impacting change does not notify users
    Given a new collection version is created
    When the change does not impact user access (e.g., description update)
    Then users are not notified
```

---

## 5.7 - Quarterly Review Cycle Support `[XL]`

**As a** DCM, **I want to** initiate and manage periodic (quarterly) review cycles for active collections, **so that** governance stays current.

**BRD Refs:** FR-COL-054

### Acceptance Criteria

```gherkin
Feature: Quarterly Review Cycle Support

  Scenario: DCM initiates a review cycle
    Given an active collection is due for quarterly review
    When the DCM creates a review cycle
    Then a review cycle record is created for the collection
    And DDOs are notified of the pending review

  Scenario: DDOs provide study-level decisions
    Given a review cycle has been created
    When a DDO accesses the structured review interface
    Then the DDO can approve or reject each study's continued inclusion (opt-in/opt-out)
    And the DDO can provide comments for each decision

  Scenario: Review outcomes are stored as versioned artifacts
    Given all DDOs have completed their reviews
    Then the review outcomes are aggregated
    And a new collection version is created with the review results
    And the version is stored as an immutable artifact

  Scenario: Collection is updated based on review outcomes
    Given all review outcomes are collected
    When opt-out decisions are finalized
    Then opted-out studies are removed from the collection
    And affected users are notified of the changes
```

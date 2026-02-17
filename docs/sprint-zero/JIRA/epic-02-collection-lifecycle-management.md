# Epic 2: Collection Lifecycle Management

**Goal:** Enable DCM users to manage collections through their full lifecycle from concept through draft to active to archived.

**Personas:** Data Collection Manager (DCM)

**BRD Refs:** FR-COL-020 through FR-COL-024

**Sizing Key:** S = 1-2 days | M = 3-5 days | L = 1-2 weeks | XL = 2+ weeks

---

## 2.1 - Edit Draft Collections `[M]`

**As a** DCM, **I want to** edit all fields of a draft collection, **so I can** refine it before submission.

**BRD Refs:** FR-COL-020

### Acceptance Criteria

```gherkin
Feature: Edit Draft Collections

  Scenario: All fields editable for draft collections
    Given a collection exists with status "draft"
    When I open the collection for editing
    Then the collection's workspace opens with all sections editable

  Scenario: Changes are tracked and versioned
    Given I am editing a draft collection
    When I save changes
    Then a new version snapshot is created
    And the change is recorded in the audit trail

  Scenario: Auto-save capability
    Given I am editing a draft collection
    When I make changes without explicitly saving
    Then the system auto-saves my changes periodically
    And a "Last auto-saved" timestamp is displayed
```

---

## 2.2 - Collection Status Lifecycle Engine `[L]`

**As a** DCM, **I want the** system to enforce valid status transitions, **so that** collections follow the governance process.

**BRD Refs:** FR-COL-021

### Acceptance Criteria

```gherkin
Feature: Collection Status Lifecycle Engine

  Scenario Outline: Valid status transitions are allowed
    Given a collection has status "<current_status>"
    When the system attempts to transition to "<new_status>"
    Then the transition succeeds
    And an audit event is created with the status change

    Examples:
      | current_status   | new_status       |
      | concept          | draft            |
      | draft            | pending_approval |
      | pending_approval | approved         |
      | pending_approval | rejected         |
      | approved         | provisioning     |
      | provisioning     | active           |
      | active           | under_review     |
      | active           | suspended        |
      | under_review     | active           |
      | under_review     | archived         |

  Scenario: Invalid status transition is blocked
    Given a collection has status "draft"
    When the system attempts to transition to "active"
    Then the transition is rejected with an error message
    And no audit event is created
```

---

## 2.3 - Submit Collection for Approval `[L]`

**As a** DCM, **I want to** submit a draft collection for approval, **so that** TA Leads can review and approve it.

### Acceptance Criteria

```gherkin
Feature: Submit Collection for Approval

  Scenario: Validation gate before submission
    Given I have a draft collection
    When I click "Submit for Approval"
    Then the system validates all required fields are complete
    And if any required fields are missing, a validation summary is displayed

  Scenario: Successful submission
    Given all required fields are complete for a draft collection
    When I submit the collection for approval
    Then the system identifies required TA Lead approvers based on studies' therapeutic areas
    And an approval_request record is created per TA
    And the collection status transitions to "pending_approval"
    And notifications are sent to all required approvers
    And an early notification is sent to DPO

  Scenario: Submission blocked by incomplete fields
    Given a draft collection is missing required fields
    When I attempt to submit for approval
    Then submission is blocked
    And a list of incomplete fields with links to the relevant workspace sections is displayed
```

---

## 2.4 - Add/Remove Studies within Approved Scope `[M]`

**As a** DCM, **I want to** add or remove studies from an active collection within the approved OAC scope, **so that** the collection stays current without re-approval.

**BRD Refs:** FR-COL-022

### Acceptance Criteria

```gherkin
Feature: Add/Remove Studies within Approved Scope

  Scenario: Add study within approved scope
    Given an active collection with an approved OAC scope
    When I add a study that falls within the approved scope
    Then the study is added without triggering re-approval
    And a new collection version is created
    And affected users are notified of the change

  Scenario: Remove study within approved scope
    Given an active collection with studies
    When I remove a study that doesn't change the overall approved scope
    Then the study is removed without triggering re-approval
    And a new collection version is created
    And affected users are notified of the change
```

---

## 2.5 - Out-of-Scope Modification (Triggers Re-Approval) `[L]`

**As a** DCM, **I want the** system to detect when modifications fall outside approved scope and require re-approval, **so that** governance is maintained.

**BRD Refs:** FR-COL-023

### Acceptance Criteria

```gherkin
Feature: Out-of-Scope Modification Triggers Re-Approval

  Scenario: System detects out-of-scope change
    Given an active collection with approved scope
    When I add a study from a new therapeutic area not in the original approval
    Then the system flags the modification as out-of-scope
    And the modification is routed for re-approval
    And fresh TA Lead signatures are required

  Scenario: AoT term change triggers re-approval
    Given an active collection with approved AoT terms
    When I modify the permitted uses or publication rights
    Then the system flags the change as out-of-scope
    And re-approval is required from all relevant TA Leads

  Scenario: DCM is informed about re-approval requirement
    Given the system has detected an out-of-scope change
    Then the DCM sees a clear message explaining why re-approval is needed
    And the DCM can choose to proceed with re-approval or revert the change
```

---

## 2.6 - Archive Collection `[S]`

**As a** DCM, **I want to** archive a collection that is no longer needed, with a recorded reason, **so that** there's an audit trail for decommissioned collections.

**BRD Refs:** FR-COL-024

### Acceptance Criteria

```gherkin
Feature: Archive Collection

  Scenario: Archive with reason
    Given I have an active collection
    When I choose to archive the collection
    Then I must provide an archive reason (free text or predefined option)
    And all active access is revoked
    And all affected users are notified
    And the collection status transitions to "archived"

  Scenario: Archived collection is retained for audit
    Given a collection has been archived
    Then the collection remains queryable in the system
    And it appears in search results with an "Archived" badge
    And it is read-only

  Scenario: Archive without reason is blocked
    Given I am archiving a collection
    When I attempt to confirm without providing a reason
    Then the archive action is blocked with a validation message
```

---

> **Note:** Non-linear workspace editing (hub-and-spoke) is now the core of Epic 1 (Collection Concept & Workspace). See stories 1.5–1.16 for workspace section details.

---

## 2.7 - Auto-Flag Studies on Metadata Change `[L]`

**As the** system, **I want to** automatically flag studies when their metadata status changes (e.g., consent withdrawn), **so that** collection integrity is maintained.

**BRD Refs:** FR-COL-007

### Acceptance Criteria

```gherkin
Feature: Auto-Flag Studies on Metadata Change

  Scenario: Metadata status change triggers auto-flag
    Given a study is included in an active collection
    When the AZCT sync detects a metadata status change for that study
    Then the study is automatically flagged as "Out of Scope" or "Restricted"
    And the DCM is notified of the flag
    And affected stakeholders are notified

  Scenario: Consent withdrawal flags study
    Given a study is included in an active collection
    When the consent status for the study changes to "withdrawn"
    Then the study is flagged as "Restricted"
    And the flag reason indicates "Consent withdrawn"

  Scenario: Flagged study is visible in collection
    Given a study has been auto-flagged
    When the DCM views the collection
    Then the flagged study is visually highlighted with the flag reason
    And the DCM can take action (remove, investigate, override)
```

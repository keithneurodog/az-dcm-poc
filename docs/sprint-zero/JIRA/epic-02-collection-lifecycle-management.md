# Epic 2: Collection Lifecycle Management

**Goal:** Enable DCM users to manage collections through their full lifecycle using a two-dimensional state model (governance stage and operational state), with in-flight modifications tracked via propositions.

**Personas:** Data Collection Manager (DCM)

**BRD Refs:** FR-COL-020 through FR-COL-024

---

## 2.1 - Edit Draft Collections `[M]`

**As a** DCM, **I want to** edit all fields of a draft collection, **so I can** refine it before submission.

**BRD Refs:** FR-COL-020


### Acceptance Criteria

```gherkin
Feature: Edit Draft Collections

  Scenario: All fields editable for draft collections
    Given a collection exists with governance_stage "draft"
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

**As a** DCM, **I want the** system to enforce valid transitions across both state dimensions, **so that** collections follow the governance process.

**BRD Refs:** FR-COL-021


> **State Model Overview**
>
> Collections are described by two independent dimensions:
>
> | Dimension              | Values                                                                 | Active When            |
> |------------------------|------------------------------------------------------------------------|------------------------|
> | `governance_stage`     | concept → draft → pending_approval → approved (or rejected → draft)    | Always                 |
> | `operational_state`    | provisioning → live → suspended → decommissioned                       | governance_stage = approved |
>
> In-flight modifications are tracked via **propositions** — a separate entity with lifecycle: `draft → submitted → approved → merged` (or `→ rejected`). Multiple propositions per collection are allowed; conflicts are resolved at merge time.

### Acceptance Criteria

```gherkin
Feature: Collection Status Lifecycle Engine

  # --- Dimension 1: Governance Stage ---

  Scenario Outline: Valid governance_stage transitions are allowed
    Given a collection has governance_stage "<current_stage>"
    When the system attempts to transition governance_stage to "<new_stage>"
    Then the transition succeeds
    And an audit event is created with the governance_stage change

    Examples:
      | current_stage    | new_stage        |
      | concept          | draft            |
      | draft            | pending_approval |
      | pending_approval | approved         |
      | pending_approval | rejected         |
      | rejected         | draft            |

  Scenario: Invalid governance_stage transition is blocked
    Given a collection has governance_stage "draft"
    When the system attempts to transition governance_stage to "approved"
    Then the transition is rejected with an error message
    And no audit event is created

  # --- Dimension 2: Operational State ---

  Scenario: Operational state is initialised on approval
    Given a collection has governance_stage "pending_approval"
    When the governance_stage transitions to "approved"
    Then the operational_state is automatically set to "provisioning"

  Scenario Outline: Valid operational_state transitions are allowed
    Given a collection has governance_stage "approved" and operational_state "<current_state>"
    When the system attempts to transition operational_state to "<new_state>"
    Then the transition succeeds
    And an audit event is created with the operational_state change

    Examples:
      | current_state    | new_state        |
      | provisioning     | live             |
      | live             | suspended        |
      | suspended        | live             |
      | suspended        | decommissioned   |

  Scenario: Invalid operational_state transition is blocked
    Given a collection has governance_stage "approved" and operational_state "provisioning"
    When the system attempts to transition operational_state to "suspended"
    Then the transition is rejected with an error message
    And no audit event is created

  Scenario: Operational state transition blocked when not approved
    Given a collection has governance_stage "draft"
    When the system attempts to transition operational_state to "provisioning"
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
    And the collection governance_stage transitions to "pending_approval"
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

**As a** DCM, **I want to** add or remove studies from a live collection within the approved OAC scope, **so that** the collection stays current without re-approval.

**BRD Refs:** FR-COL-022


### Acceptance Criteria

```gherkin
Feature: Add/Remove Studies within Approved Scope

  Scenario: Add study within approved scope via proposition
    Given a collection with operational_state "live"
    And the collection has an approved OAC scope
    When I create a proposition to add a study that falls within the approved scope
    And I submit the proposition
    Then the proposition transitions from "submitted" to "merged" without requiring governance re-approval
    And a new collection version is created
    And affected users are notified of the change

  Scenario: Remove study within approved scope via proposition
    Given a collection with operational_state "live"
    When I create a proposition to remove a study that doesn't change the overall approved scope
    And I submit the proposition
    Then the proposition transitions from "submitted" to "merged" without requiring governance re-approval
    And a new collection version is created
    And affected users are notified of the change
```

---

## 2.5 - Out-of-Scope Modification (Triggers Re-Approval) `[L]`

**As a** DCM, **I want the** system to detect when a proposition's changes fall outside approved scope and require governance re-approval via the proposition's own lifecycle, **so that** governance is maintained.

**BRD Refs:** FR-COL-023


### Acceptance Criteria

```gherkin
Feature: Out-of-Scope Modification Triggers Re-Approval

  Scenario: System detects out-of-scope change in proposition
    Given a collection with operational_state "live"
    When I create a proposition to add a study from a new therapeutic area not in the original approval
    And I submit the proposition
    Then the system flags the proposition as out-of-scope
    And the proposition status remains "submitted" pending governance re-approval
    And fresh TA Lead signatures are required
    And the proposition is routed to the appropriate approvers

  Scenario: AoT term change in proposition triggers re-approval
    Given a collection with operational_state "live"
    And the collection has approved AoT terms
    When I create a proposition to modify the permitted uses or publication rights
    And I submit the proposition
    Then the system flags the proposition as out-of-scope
    And re-approval is required from all relevant TA Leads
    And the proposition transitions to "approved" only after all re-approvals are received, then to "merged"

  Scenario: DCM is informed about re-approval requirement
    Given a proposition has been flagged as requiring governance re-approval
    Then the DCM sees a clear message explaining why re-approval is needed
    And the DCM can choose to proceed with re-approval or withdraw the proposition
    And withdrawing the proposition leaves the collection unchanged
```

---

## 2.6 - Decommission Collection `[S]`

**As a** DCM, **I want to** decommission a collection that is no longer needed, with a recorded reason, **so that** there's an audit trail for decommissioned collections.

**BRD Refs:** FR-COL-024


### Acceptance Criteria

```gherkin
Feature: Decommission Collection

  Scenario: Decommission with reason
    Given I have a collection with operational_state "suspended"
    When I choose to decommission the collection
    Then I must provide a decommission reason (free text or predefined option)
    And all active access is revoked
    And all affected users are notified
    And the operational_state transitions to "decommissioned"

  Scenario: Decommissioned collection is retained for audit
    Given a collection has operational_state "decommissioned"
    Then the collection remains queryable in the system
    And it appears in search results with a "Decommissioned" badge
    And it is read-only

  Scenario: Decommission without reason is blocked
    Given I am decommissioning a collection
    When I attempt to confirm without providing a reason
    Then the decommission action is blocked with a validation message
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
    Given a study is included in a collection with operational_state "live"
    When the AZCT sync detects a metadata status change for that study
    Then the study is automatically flagged as "Out of Scope" or "Restricted"
    And the DCM is notified of the flag
    And affected stakeholders are notified

  Scenario: Consent withdrawal flags study
    Given a study is included in a collection with operational_state "live"
    When the consent status for the study changes to "withdrawn"
    Then the study is flagged as "Restricted"
    And the flag reason indicates "Consent withdrawn"

  Scenario: Flagged study is visible in collection
    Given a study has been auto-flagged
    When the DCM views the collection
    Then the flagged study is visually highlighted with the flag reason
    And the DCM can take action (remove, investigate, override)
```

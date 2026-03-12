# Epic 4: Collection Detail View

**Goal:** Provide a comprehensive detail view for any collection showing all dimensions of its state.

**Personas:** All roles (with role-appropriate content)

**BRD Refs:** FR-COL-031

---

## 4.1 - Collection Detail: Overview Tab `[M]`

**As a** user, **I want to** see a collection's high-level summary including status, description, key metrics, and progress, **so I** understand the collection at a glance.

### Acceptance Criteria

```gherkin
Feature: Collection Detail Overview Tab

  Scenario: Overview displays key information
    Given I am on a collection's detail page
    When I view the Overview tab
    Then I see the collection name, description, and status badge
    And key metrics are displayed: total datasets, total users, progress percentage
    And therapeutic area tags are shown
    And request type indicator (New/Update/Policy Change) is visible

  Scenario: Access provisioning breakdown chart
    Given I am viewing the Overview tab
    Then a chart displays the 20/30/40/10 access provisioning breakdown
    And percentages for Already Open, Awaiting Policy, Needs Approval, and Missing are shown

  Scenario: Metadata is displayed
    Given I am viewing the Overview tab
    Then I see: created by, created date, last updated date
```

---

## 4.2 - Collection Detail: Datasets Tab `[L]`

**As a** user, **I want to** see all datasets (d-codes) in a collection with their metadata, **so I** understand the scope of data.

### Acceptance Criteria

```gherkin
Feature: Collection Detail Datasets Tab

  Scenario: Dataset list with metadata
    Given I am viewing the Datasets tab
    Then each dataset shows: d-code, name, phase, status, patient count
    And access status per dataset is shown (instant, approval required, blocked)
    And modality tags are displayed per dataset

  Scenario: Expandable detail rows
    Given I am viewing the Datasets tab
    When I click to expand a dataset row
    Then I see source information per modality
    And full dataset metadata is displayed

  Scenario: Search within datasets
    Given I am viewing the Datasets tab
    When I enter a search term
    Then the dataset list filters to matching d-codes, names, or metadata

  Scenario: Sort datasets
    Given I am viewing the Datasets tab
    When I click a column header
    Then datasets are sorted by: d-code, name, patients, or status
    And clicking again reverses the sort order
```

---

## 4.3 - Collection Detail: Data Use Terms Tab `[M]`

**As a** user, **I want to** see the AoT for a collection, **so I** understand what I'm permitted to do with the data.

### Acceptance Criteria

```gherkin
Feature: Collection Detail Data Use Terms Tab

  Scenario: AoT terms are displayed
    Given I am viewing the Data Use Terms tab
    Then I see primary use permissions as a checklist
    And beyond primary use options (AI/ML, Software Dev) are shown
    And publication permissions are displayed
    And prohibited uses are listed
    And user scope is shown (organizations, roles, individuals)

  Scenario: AoT version indicator
    Given I am viewing the Data Use Terms tab
    Then the current AoT version number is displayed
    And a link to view version history is available
```

---

## 4.4 - Collection Detail: Users/Team Tab `[M]`

**As a** DCM, **I want to** see all users and team members assigned to a collection with their roles, **so I can** manage access.

### Acceptance Criteria

```gherkin
Feature: Collection Detail Users/Team Tab

  Scenario: User list with details (active collections)
    Given I am viewing the Users/Team tab for an active collection
    Then each user entry shows: name, email, role, department, assigned date
    And a role breakdown summary is shown (DCL, DDO, Collection Leader, Data Consumer)
    And users sourced via Immuta role groups show their group membership

  Scenario: Draft collection users placeholder
    Given I am viewing the Users/Team tab for a draft collection
    Then I see a "Users Not Yet Provisioned" placeholder
    And the target user count from the access scope is displayed
    And a message explains users will be provisioned after approval

  Scenario: Virtual team / role group groupings
    Given there are virtual teams or Immuta role groups assigned to the collection
    Then users are grouped by their team or role group
    And each group shows its member count

  Scenario: Search users within collection
    Given I am viewing the Users/Team tab
    When I enter a search term
    Then the user list filters by name, email, or role

  Scenario: Training compliance status
    Given I am viewing the Users/Team tab
    Then each user shows their training compliance status (complete/pending/overdue)
```

---

## 4.5 - Collection Detail: Timeline/Activity Tab `[M]`

**As a** user, **I want to** see a chronological timeline of all events for a collection, **so I can** understand its history.

### Acceptance Criteria

```gherkin
Feature: Collection Detail Timeline Tab

  Scenario: Timeline displays all events chronologically
    Given I am viewing the Timeline tab
    Then I see events in chronological order including: creation, status changes, dataset additions/removals, AoT changes, approval events, comments
    And each event shows the actor and timestamp

  Scenario: Filter timeline by event type
    Given I am viewing the Timeline tab
    When I select a filter for a specific event type
    Then only events of that type are displayed
```

---

## 4.6 - Collection Detail: Discussion/Comments Tab `[L]`

**As a** user, **I want to** participate in threaded discussions on a collection, **so that** team members can collaborate.

### Acceptance Criteria

```gherkin
Feature: Collection Detail Discussion Tab

  Scenario: Post a comment
    Given I am viewing the Discussion tab
    When I enter a comment and select a type (update, question, blocker, suggestion)
    And I submit the comment
    Then the comment is posted with my identity and timestamp

  Scenario: Threaded replies
    Given a comment exists on the Discussion tab
    When I click "Reply" on a comment
    And I submit my reply
    Then the reply appears nested under the original comment

  Scenario: @mention users
    Given I am composing a comment
    When I type "@" followed by a name
    Then matching users are suggested in a dropdown
    And selecting a user creates a mention notification

  Scenario: Pin important comments
    Given I am a DCM or Collection Leader
    When I pin a comment
    Then the comment is displayed prominently at the top of the discussion

  Scenario: Reactions on comments
    Given a comment exists
    When I click a reaction emoji
    Then my reaction is recorded and displayed on the comment

  Scenario: Mark blocker as resolved
    Given a comment of type "blocker" exists
    When I mark the blocker as resolved with resolution notes
    Then the blocker is visually updated as resolved
    And the resolution notes are displayed

  Scenario: Filter by comment type
    Given I am viewing the Discussion tab
    When I filter by comment type (e.g., "blockers only")
    Then only comments of that type are displayed

  Scenario: Automated bot messages
    Given a system event occurs (e.g., status change, metadata flag)
    Then an automated Collectoid system message is posted in the discussion
```

---

## 4.7 - Collection Detail: Progress & Draft View `[L]`

**As a** DCM, **I want** the collection detail page to show lifecycle progress for active collections and draft-specific controls for draft collections, **so I can** track and manage collections regardless of their status.

> **Design Decision:** The progress dashboard has been merged into the collection detail view at `/collections/[id]`. There is no separate progress page — the detail page adapts its content based on collection status (draft vs active/provisioning).

### Acceptance Criteria

```gherkin
Feature: Collection Detail Progress & Draft View

  Scenario: Active collection shows full progress view
    Given I am viewing a collection with status "active" or "provisioning"
    Then I see the full progress dashboard including: health score card, provisioning status breakdown, 6 tabs (Overview, Datasets, Data Use Terms, Users, Timeline, Discussion)
    And a visual stepper shows the collection's current position in the lifecycle
    And per-dataset provisioning status is displayed
    And approval status per TA is displayed

  Scenario: Draft collection shows simplified view with DRAFT banner
    Given I am viewing a collection with status "draft"
    Then a non-dismissible amber DRAFT banner is displayed at the top
    And the banner explains the collection is visible but pending review
    And a simplified stats card replaces the health score (datasets, target users, selected datasets, TAs)
    And the health score and provisioning cards are hidden

  Scenario: Draft collection shows approve action
    Given I am viewing a draft collection
    Then an "Approve Collection" button is shown in the header
    When I click "Approve Collection" and confirm
    Then the collection status transitions to "active"
    And the DRAFT banner disappears
    And the full progress view becomes visible

  Scenario: Draft collection shows edit grid on Overview tab
    Given I am viewing the Overview tab of a draft collection
    Then I see "Edit Collection" action cards for: Datasets, Activities, Terms, Access & Users
    And each card links back to the relevant workspace sub-page

  Scenario: Draft collection users tab shows placeholder
    Given I am viewing the Users tab of a draft collection
    Then I see a "Users Not Yet Provisioned" placeholder
    And the target user count from the access scope is displayed
    And a message explains that users will be provisioned after approval

  Scenario: Concept collections redirect to workspace
    Given I navigate to /collections/{id} for a collection with status "concept"
    And I am the creator
    Then I am redirected to the workspace at /dcm/create/workspace

  Scenario: DPO delivery tracking (active collections)
    Given DPO has been notified of an active collection
    Then delivery tracking information is displayed (read-only)

  Scenario: Compliance checklist status (active collections)
    Given an active collection has compliance requirements
    Then a checklist shows the status of each compliance item
```

---

## 4.8 - Role-Based Detail View `[M]`

**As the** system, **I want to** show role-appropriate content in the collection detail view, **so that** each persona sees what's relevant to them.

### Acceptance Criteria

```gherkin
Feature: Role-Based Detail View

  Scenario: DCM sees full management controls
    Given I am logged in as a DCM
    When I view a collection detail page
    Then I see edit, submit, and manage users controls

  Scenario: Data Consumer sees read-only with request access
    Given I am logged in as a Data Consumer
    And I am not a member of the collection
    When I view a collection detail page
    Then the view is read-only
    And a "Request Access" button is displayed

  Scenario: Approver sees review interface
    Given I am logged in as an Approver
    And I have a pending approval for this collection
    When I view a collection detail page
    Then I see approve/reject action buttons
    And the review interface with TA-specific details is displayed

  Scenario: Team Lead sees team management controls
    Given I am logged in as a Team Lead
    When I view a collection detail page
    Then I see team management controls
    And I can manage team membership
```

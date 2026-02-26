# Epic 7: Dataset Management within Collections

**Goal:** Enable comprehensive management of datasets (studies/d-codes) within a collection including modalities, sources, and compliance status.

**Personas:** DCM

**BRD Refs:** FR-COL-004 through FR-COL-015, VS2-329, VS2-332, VS2-333, VS2-334

**Sizing Key:** S = 1-2 days | M = 3-5 days | L = 1-2 weeks | XL = 2+ weeks

---

## 7.1 - Browse & Add Datasets (D-Code Search) `[L]`

**As a** DCM, **I want to** search and browse available datasets by d-code, name, or therapeutic area, **so I can** add relevant studies to my collection.

> **Note:** Primary dataset selection during collection creation happens in the workspace Dataset Browser (see Epic 1, stories 1.9–1.10). This story covers the ROAM-enriched dataset catalog and post-draft dataset management.

### Acceptance Criteria

```gherkin
Feature: Browse & Add Datasets

  Scenario: Search dataset catalog by d-code
    Given I am on the dataset browser
    When I enter a d-code in the search field
    Then matching datasets from the ROAM-enriched AZCT catalog are displayed

  Scenario: Search by study name or TA
    Given I am on the dataset browser
    When I enter a study name or therapeutic area
    Then matching datasets are displayed with d-code, name, phase, status

  Scenario: ROAM-enriched fields displayed per dataset
    Given I am viewing dataset search results
    Then each dataset shows ROAM fields: locked status, DPR status, compliance status, data availability platform
    And locked datasets are visually distinguished

  Scenario: Filter datasets
    Given I am on the dataset browser
    When I apply filters for phase, status, geography, sponsor type, locked status, or DPR status
    Then the dataset list narrows to matching results

  Scenario: Preview dataset before adding
    Given search results are displayed
    When I click a dataset to preview
    Then full dataset metadata including ROAM fields is shown in a detail panel
    And I can add it to my collection from the preview

  Scenario: Bulk add datasets
    Given I have search results displayed
    When I select multiple datasets and click "Add Selected"
    Then all selected datasets are added to my collection
```

---

## 7.2 - Dataset Detail Panel `[M]`

**As a** DCM, **I want to** see comprehensive metadata for each dataset, **so I can** make informed inclusion decisions.

### Acceptance Criteria

```gherkin
Feature: Dataset Detail Panel

  Scenario: Core metadata is displayed
    Given I am viewing a dataset detail panel
    Then I see: d-code, name, description, therapeutic area, phase, status, patient count, geography

  Scenario: Clinical metadata is displayed
    Given I am viewing a dataset detail panel
    Then I see: enrollment dates, completion dates, sponsor information

  Scenario: ROAM fields are displayed
    Given I am viewing a dataset detail panel
    Then I see ROAM-enriched fields: locked status, Data Product Rights (DPR) status, data availability platform
    And locked datasets show the lock reason

  Scenario: Compliance status is shown
    Given I am viewing a dataset detail panel
    Then ethical compliance status is displayed (confirmed/pending/flagged)
    And legal compliance status is displayed (confirmed/pending/flagged)
    And DPR status is displayed alongside compliance

  Scenario: Data availability and access breakdown
    Given I am viewing a dataset detail panel
    Then data availability sources are listed (PDP, entimICE, CTDS, etc.)
    And the 20/30/40/10 access breakdown is shown

  Scenario: Frequently bundled datasets
    Given I am viewing a dataset detail panel
    Then datasets frequently bundled with this one are suggested
```

---

## 7.3 - Modality/Source Matrix Editor `[L]`

**As a** DCM, **I want to** configure modalities and sources in a matrix view across all datasets, **so I can** see and edit the full picture at once.

> **Note:** Initial modality/source configuration during creation happens in the workspace (see Epic 1, story 1.12). This story covers the full matrix editor available post-draft and within the workspace context.

### Acceptance Criteria

```gherkin
Feature: Modality/Source Matrix Editor

  Scenario: Matrix view displays datasets vs modalities
    Given I am on the modality/source matrix editor
    Then rows represent datasets and columns represent modalities
    And each cell shows the selected data source (or empty)

  Scenario: Select source in a cell
    Given I am viewing the matrix
    When I click a cell
    Then I can select a data source from the dropdown
    And the cell updates with the selected source

  Scenario: Bulk operation - apply source to all datasets for a modality
    Given I am viewing the matrix
    When I select a modality column header and choose "Apply source to all"
    And I select a data source
    Then the source is applied to all datasets for that modality

  Scenario: Validation highlights missing sources
    Given a modality is enabled for a dataset
    When no source is selected
    Then the cell is highlighted with a validation warning
```

---

## 7.4 - Access Provisioning Breakdown per Dataset `[M]`

**As a** DCM, **I want to** see the 20/30/40/10 access provisioning breakdown per dataset, **so I** understand how much of the collection is immediately accessible.

### Acceptance Criteria

```gherkin
Feature: Access Provisioning Breakdown

  Scenario: Per-dataset breakdown displayed
    Given I am viewing datasets in my collection
    Then each dataset shows its breakdown: Already Open (%), Awaiting Policy (%), Needs Approval (%), Missing (%)
    And each category is color-coded

  Scenario: Aggregate breakdown for collection
    Given I am viewing the collection's dataset list
    Then aggregate percentages across all datasets are displayed at the top

  Scenario: Approval team identification
    Given a dataset has "Needs Approval" status
    Then the approval team responsible is identified and displayed
```

> **Design Decision (Immuta alignment):** The 20/30/40/10 access provisioning breakdown should reflect that "Awaiting Policy" datasets will have Immuta partition filters (Study_ID IN clauses) created during provisioning, and "Needs Approval" datasets require Access_Authorisation records with approval tier routing. The breakdown display should map to Immuta's authorization tracks: IDA (standing access) for the 90% route and AdHoc (request-based) for the 10% route.

---

## 7.5 - Compliance Status Display per Study `[M]`

**As a** DCM, **I want to** see the ethical and legal compliance status per study within my collection, **so I can** identify issues before submission.

**BRD Refs:** FR-AUD-002, FR-AUD-003

### Acceptance Criteria

```gherkin
Feature: Compliance Status per Study

  Scenario: Ethical and legal status displayed
    Given I am viewing studies in my collection
    Then each study shows: ethical status (confirmed/pending/flagged), legal status (confirmed/pending/flagged)

  Scenario: ROAM compliance fields displayed
    Given I am viewing a study's compliance info
    Then the Data Product Rights (DPR) status is shown
    And locked status is shown with lock reason where applicable
    And data availability platform is shown

  Scenario: First Subject In date check
    Given I am viewing a study's compliance info
    When the First Subject In date is before 2013
    Then the study is flagged as not eligible for the 90-route
    And the flag reason is displayed

  Scenario: Flagged studies are highlighted
    Given studies have compliance issues
    Then flagged studies are visually highlighted in the list
    And the flag reason is accessible via tooltip or detail view
```

---

## 7.6 - Environment Configuration per Collection `[S]`

**As a** DCM, **I want to** specify and manage target consumption environments, **so that** provisioning happens to the right places.

### Acceptance Criteria

```gherkin
Feature: Environment Configuration

  Scenario: Environment selection with defaults
    Given I am configuring environments for a collection
    Then a checklist of environments is displayed
    And leadership-defined defaults are pre-selected

  Scenario: Additional environment requires justification
    Given I select an environment beyond the defaults
    When I confirm the selection
    Then a justification text input is required before saving

  Scenario: Per-dataset environment override
    Given I am configuring environments
    When I need a specific dataset provisioned to a different environment
    Then I can override the environment at the dataset level
```

---

## 7.7 - Remove Dataset with Impact Analysis `[M]`

**As a** DCM, **I want to** understand the impact before removing a dataset, **so I can** make an informed decision.

### Acceptance Criteria

```gherkin
Feature: Remove Dataset with Impact Analysis

  Scenario: Impact analysis shown before removal
    Given I want to remove a dataset from my collection
    When I initiate the removal
    Then the system displays: number of users affected, related approval chain impact

  Scenario: Confirm removal with impact summary
    Given the impact analysis is displayed
    When I confirm the removal
    Then the dataset is removed from the collection
    And a new collection version is created with the removal in the audit trail

  Scenario: Cancel removal
    Given the impact analysis is displayed
    When I choose to cancel
    Then the dataset remains in the collection
    And no changes are made
```

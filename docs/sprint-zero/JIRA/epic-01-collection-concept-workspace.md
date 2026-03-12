# Epic 1: Collection Concept & Workspace

**Goal:** Enable DCM users to create new Open Access Collections through a lightweight concept creation on-ramp followed by a non-linear workspace where sections (datasets, activities, terms, roles) can be completed in any order, then promoted to a formal draft.

**Personas:** Data Collection Manager (DCM)

**BRD Refs:** FR-COL-001 through FR-COL-017

---

## Phase 1 — Concept Creation

### 1.1 - Create Concept `[S]`

**As a** DCM, **I want to** create a new collection concept by providing a title and optional description, **so that** I have a lightweight starting point without needing to complete all details upfront.

**BRD Refs:** FR-COL-001, FR-COL-002


### Acceptance Criteria

```gherkin
Feature: Create Concept

  Scenario: DCM creates a concept with title only
    Given I am on the "Start a New Collection" page
    When I enter a collection title
    And I click "Create Concept"
    Then a new concept is created with status "concept"
    And I am navigated to the workspace overview

  Scenario: DCM creates a concept with title and description
    Given I am on the "Start a New Collection" page
    When I enter a collection title and an optional description
    And I click "Create Concept"
    Then a new concept is created with both title and description
    And the description is used for background AI analysis

  Scenario: Title is required
    Given I am on the "Start a New Collection" page
    And the title field is empty
    Then the "Create Concept" button is disabled

  Scenario: Request type selection
    Given I am creating a concept
    When I select a request type (New / Update / Policy Change)
    Then the request type is stored with the concept
    And if "Update" or "Policy Change" is selected, I can link to an existing collection
```

---

### 1.2 - Concept Privacy & Visibility `[S]`

**As a** DCM, **I want** my concept to be private by default (only visible to me), **so that** I can iterate on it without others seeing incomplete work.

### Acceptance Criteria

```gherkin
Feature: Concept Privacy & Visibility

  Scenario: Concept is private by default
    Given I have created a new concept
    Then the concept has visibility "private"
    And it is hidden from the collections browser
    And only I (the creator) can see it

  Scenario: Privacy banner is displayed
    Given I am in my concept workspace
    Then a banner is displayed stating "This is a private concept — only you can see it"
    And indicators show: "Hidden from browse", "Share by link when ready", "Save & return anytime"

  Scenario: Concept is not visible to other users
    Given another user browses or searches collections
    Then my private concept does not appear in their results
```

---

### 1.3 - Share Concept Link `[S]`

**As a** DCM, **I want to** generate a shareable read-only link to my concept, **so that** I can get feedback from colleagues before promoting to draft.

### Acceptance Criteria

```gherkin
Feature: Share Concept Link

  Scenario: Generate a share link
    Given I am in my concept workspace
    When I click "Share Link"
    Then a unique read-only link is generated
    And I can copy it to my clipboard

  Scenario: Shared link provides read-only access
    Given a colleague opens my shared concept link
    Then they can view the concept details (title, description, datasets, terms, etc.)
    And they cannot edit any fields

  Scenario: Share link persists
    Given I have generated a share link
    When I return to the workspace later
    Then the same share link is still available
```

---

### 1.4 - Pre-fill Concept from Demand Analytics `[S]`

**As a** DCM, **I want** the concept creation form to pre-populate when I click "Create Collection" from the demand analytics page, **so I can** act on identified demand quickly.

### Acceptance Criteria

```gherkin
Feature: Pre-fill Concept from Demand Analytics

  Scenario: Concept pre-fills from analytics context
    Given I click "Create Collection" from the demand analytics page
    When the concept creation page loads
    Then the title is pre-filled from the analytics context
    And the description is pre-populated with analytics parameters (TA, type, intent)
    And a "Pre-filled based on demand analysis" indicator is displayed

  Scenario: DCM can modify pre-filled values
    Given the form has been pre-filled from analytics
    When I modify any pre-filled field
    Then the changes are accepted
```

---

## Phase 2 — Workspace Overview

### 1.5 - Workspace Overview Hub `[M]`

**As a** DCM, **I want a** workspace overview showing section cards with completion status, **so I can** see at a glance what's done and what needs attention, and work on sections in any order.

### Acceptance Criteria

```gherkin
Feature: Workspace Overview Hub

  Scenario: Section cards are displayed
    Given I am on the workspace overview
    Then I see section cards for: Datasets, Activities & Purpose, Data Use Terms, Access & Users
    And each card shows: title, description, completion status (empty/complete), and item count where applicable

  Scenario: Required sections are indicated
    Given I am on the workspace overview
    Then the Datasets, Activities, and Data Use Terms cards show a "Required" badge when empty

  Scenario: Navigate to any section
    Given I am on the workspace overview
    When I click on a section card
    Then I am navigated directly to that section's editor

  Scenario: Editable title and description
    Given I am on the workspace overview
    When I click on the collection title or description
    Then I can edit them inline
    And changes are saved immediately

  Scenario: Concept stage banner
    Given the concept has status "concept"
    Then a banner shows "Concept Stage — private workspace, only visible to you"
    When the concept is promoted to draft
    Then the banner updates to "Draft Stage — visible to team members"
```

---

### 1.6 - Workspace Sidebar Navigation `[M]`

**As a** DCM, **I want a** persistent sidebar showing all workspace sections with completion indicators, **so I can** navigate between sections and track overall progress.

### Acceptance Criteria

```gherkin
Feature: Workspace Sidebar Navigation

  Scenario: Sidebar displays all sections
    Given I am in the workspace
    Then a sidebar is visible with navigation items: Overview, Datasets, Activities & Purpose, Data Use Terms, Access & Users

  Scenario: Active section is highlighted
    Given I am viewing the Datasets section
    Then the "Datasets" item in the sidebar is visually highlighted as active

  Scenario: Completion indicators
    Given some sections are complete and some are empty
    Then completed sections show a checkmark icon
    And incomplete required sections show a "Required" label

  Scenario: Progress indicator
    Given I have completed 2 of 3 required sections
    Then the sidebar footer shows "2/3 required" with progress dots

  Scenario: Promote to Draft button
    Given all 3 required sections are complete
    Then the "Promote to Draft" button in the sidebar becomes enabled
    When not all required sections are complete
    Then the button is disabled

  Scenario: Back to overview navigation
    Given I am in a workspace sub-section (e.g., Datasets)
    Then a "Back to Overview" link is visible in the sidebar header
```

---

### 1.7 - Background AI Analysis Engine `[L]`

**As the** system, **I want to** automatically analyze the concept's title and description when the workspace loads, **so that** AI suggestions are available across all workspace sections without blocking the DCM.

### Acceptance Criteria

```gherkin
Feature: Background AI Analysis Engine

  Scenario: AI analysis starts automatically
    Given a concept has a title (and optionally a description)
    When the workspace loads
    Then the AI analysis starts automatically in the background
    And the DCM can continue working on any section without waiting

  Scenario: Analysis status is shown
    Given the AI analysis is running
    Then a banner on the workspace overview shows "AI is analyzing your collection intent..."
    With a shimmer/loading animation
    When the analysis completes
    Then the banner updates to "AI suggestions are ready"

  Scenario: Analysis generates suggestions
    Given the AI analysis completes
    Then the results include: suggested therapeutic area filters, suggested study phases, suggested study statuses, suggested data modalities, extracted keywords, and a confidence score

  Scenario: Analysis results are available across workspace
    Given the AI analysis is complete
    Then the datasets section can use suggested filters as pre-selections
    And the activities section can use keywords for recommendations
```

---

### 1.8 - AI Suggestions Panel `[M]`

**As a** DCM, **I want to** view AI analysis results in a modal panel, **so I can** understand what the AI has inferred and how it will assist me.

### Acceptance Criteria

```gherkin
Feature: AI Suggestions Panel

  Scenario: Open AI suggestions panel
    Given the AI analysis is complete
    When I click the "AI suggestions are ready" banner
    Then a modal panel opens showing the analysis results

  Scenario: Panel displays analysis results
    Given I am viewing the AI suggestions panel
    Then I see: detected therapeutic areas, detected data modalities, extracted keywords, and confidence percentage

  Scenario: Panel shows how AI helps
    Given I am viewing the AI suggestions panel
    Then I see explanations of: Smart Filters (pre-selects relevant filters), Dataset Discovery (powers AI search), Activity Suggestions (recommends activities aligned with objectives)

  Scenario: Panel while analysis is in progress
    Given the AI analysis is still running
    When I open the panel
    Then I see an "Analysis in progress" message
    And a note saying "Feel free to continue working — suggestions will appear when ready"
```

---

## Phase 2 — Workspace Sections

### 1.9 - Workspace: Dataset Browser & Selection `[XL]`

**As a** DCM, **I want to** browse, filter, and select datasets from the ROAM-enriched catalog within my workspace, **so I can** build the dataset scope of my collection.

**BRD Refs:** FR-COL-004, FR-COL-005, VS2-329


### Acceptance Criteria

```gherkin
Feature: Workspace Dataset Browser & Selection

  Scenario: Browse all available datasets
    Given I am on the workspace Datasets section
    Then the full ROAM-enriched dataset catalog is displayed
    And each dataset shows: d-code, name, therapeutic area, phase, status, patient count

  Scenario: ROAM-specific fields are displayed
    Given I am viewing the dataset catalog
    Then each dataset additionally shows: locked status, data product rights (DPR), compliance status (ethical/legal), data availability (platform)

  Scenario: Multi-dimensional filtering
    Given I am on the dataset browser
    When I apply filters across: therapeutic area, phase, status, geography, modality, sponsor type, data sharing, locked status, DPR, compliance
    Then only matching datasets are shown
    And active filter count is displayed

  Scenario: AI-suggested filters are pre-applied
    Given the background AI analysis has completed
    When I open the Datasets section for the first time
    Then AI-suggested filters (TA, phase, status, modalities) are pre-applied
    And I can modify or clear them

  Scenario: Search datasets
    Given I am on the dataset browser
    When I enter a search query (d-code, study name, or keyword)
    Then the dataset list filters to matching results

  Scenario: Select datasets for collection
    Given datasets are displayed
    When I select individual datasets or use "Select All on Page"
    Then selected datasets are added to my workspace's dataset list
    And the workspace sidebar updates the Datasets count

  Scenario: Pagination
    Given there are more datasets than fit on one page
    Then pagination controls are displayed
    And I can navigate between pages
```

---

### 1.10 - Workspace: Dataset Refine Selection `[L]`

**As a** DCM, **I want to** refine my selected datasets in a detailed table view with configurable columns, **so I can** review and manage my selection precisely.

### Acceptance Criteria

```gherkin
Feature: Workspace Dataset Refine Selection

  Scenario: Open refine selection modal
    Given I have selected datasets in my workspace
    When I click "Refine Selection"
    Then a modal opens showing all selected datasets in a table view

  Scenario: Configurable columns
    Given I am in the refine selection modal
    When I click the column configuration button
    Then I can show/hide columns: d-code, name, TA, phase, status, locked, DPR, platform, modalities, patients, geography, sponsor type, compliance, closed date, first subject in, DB lock date, collections count, active users

  Scenario: Sort by any column
    Given I am in the refine selection modal
    When I click a column header
    Then the table sorts by that column
    And clicking again reverses the sort order

  Scenario: Filter within selection
    Given I am in the refine selection modal
    When I enter a filter term
    Then the table filters to matching rows within my selection

  Scenario: Remove individual datasets
    Given I am in the refine selection modal
    When I remove a dataset from the selection
    Then the dataset is removed and counts update
```

---

### 1.11 - Workspace: Configure Inclusion Mechanisms `[S]`

**As a** DCM, **I want to** specify inclusion mechanisms (Auto-included, Opt-out, Opt-in) per study, **so that** the correct quarterly review workflows are triggered.

**BRD Refs:** FR-COL-006


### Acceptance Criteria

```gherkin
Feature: Configure Inclusion Mechanisms

  Scenario: Default inclusion mode
    Given I have datasets in my workspace
    Then all studies default to "Included (auto)" mode

  Scenario: Override per study
    Given a study is set to "Included (auto)"
    When I change the mode to "Included opt-out" or "Included opt-in"
    Then the study's inclusion mode is updated
    And a tooltip explains what the selected mode means for quarterly reviews

  Scenario: TBC — Bulk inclusion mode assignment
    TBC: Ability to set inclusion mode for multiple studies at once
```

---

### 1.12 - Workspace: Configure Data Modalities & Sources `[M]`

**As a** DCM, **I want to** specify which data modalities and sources are included for each study, **so that** DPO knows what to provision and from where.

**BRD Refs:** FR-COL-008 through FR-COL-012, VS2-332, VS2-333


### Acceptance Criteria

```gherkin
Feature: Configure Data Modalities & Sources

  Scenario: Select modalities per study
    Given I am configuring a study's modalities
    When I toggle modalities: Clinical/SDTM, ADaM, ctDNA/Biomarker, Imaging/DICOM, Omics/NGS, RWD, RAW
    Then selected modalities are saved for that study

  Scenario: Assign source per modality
    Given a modality is selected
    When I assign a data source (entimICE, PDP, CTDS, Medidata Rave, Veeva Vault, External Partners)
    Then the source is saved for that modality

  Scenario: Validation - no blank modality or source
    Given a study has no modalities selected, or a modality has no source
    When I attempt to promote the concept
    Then a validation error is displayed

  Scenario: Bulk modality assignment
    Given I have multiple studies
    When I select multiple studies and bulk-assign modalities
    Then the selected modalities are applied to all selected studies

  Scenario: Auto-suggest sources
    Given a study has a modality selected
    When the system detects known source information from study metadata
    Then the source field is auto-suggested
```

---

### 1.13 - Workspace: Select Consumption Environments `[S]`

**As a** DCM, **I want to** select where users will access the data, **so that** provisioning targets the right environments.

**BRD Refs:** FR-COL-013 through FR-COL-015, VS2-334


### Acceptance Criteria

```gherkin
Feature: Select Consumption Environments

  Scenario: Environment selection with defaults
    Given I am configuring environments
    Then options include: SCP, Domino Data Lab, AI Bench, PDP, IO Platform
    And leadership-defined defaults are pre-selected

  Scenario: Additional environment requires justification
    Given I select an environment beyond the defaults
    Then a justification text input is required before saving
```

---

### 1.14 - Workspace: Define Activities & Purpose `[M]`

**As a** DCM, **I want to** define permitted activities organized by category, **so that** the Data Use Terms accurately reflects what users can do with the data.

### Acceptance Criteria

```gherkin
Feature: Define Activities & Purpose

  Scenario: Activities organized by category
    Given I am on the Activities section
    Then activities are grouped into 4 categories: Scientific Research & Publications, Drug Development Support, Safety & Pharmacovigilance, AI & Advanced Analytics

  Scenario: Select permitted activities
    Given I am viewing activities
    When I select an activity
    Then it is added to the collection's permitted activities list
    And its access level is displayed

  Scenario: Permitted vs not-permitted indicators
    Given some activities are flagged as "not permitted under Primary Use"
    Then those activities show a restricted indicator
    And selecting them shows a warning about governance requirements

  Scenario: AI-recommended activities
    Given the background AI analysis has completed
    Then recommended activities are highlighted based on the collection's intent and datasets

  Scenario: Save and return to workspace
    Given I have selected activities
    When I click "Save" or navigate away
    Then my selections are persisted
    And the workspace overview updates the Activities card to "complete"
```

---

### 1.15 - Workspace: Configure Data Use Terms `[L]`

**As a** DCM, **I want to** define the Data Use Terms including permitted uses, ML/AI permissions, publication rights, and restrictions, **so that** governance is clear.

**BRD Refs:** FR-COL-016


### Acceptance Criteria

```gherkin
Feature: Configure Data Use Terms

  Scenario: Primary use permissions
    Given I am on the Terms section
    When I configure primary use checkboxes
    Then options include: understand drug mechanism, understand disease, develop diagnostics, learn from past studies, improve analysis methods

  Scenario: Beyond primary use
    Given I am configuring terms
    When I toggle beyond primary use options
    Then I can enable/disable: "To train AI/ML models" (boolean), "To store data in AI/ML model" (boolean), software development

  Scenario: Publication permissions
    Given I am configuring terms
    When I set publication permissions
    Then options are: internal restricted, external publication

  Scenario: Auto-suggest from datasets and activities
    Given I have selected datasets and activities
    When I open the Terms section
    Then the system auto-suggests AoT configuration based on dataset restrictions and selected activities

  Scenario: AoT conflict detection
    Given I have configured terms
    When a conflict exists between my terms and dataset-level restrictions (e.g., ML restricted on some datasets)
    Then a warning is displayed showing conflicting datasets
    And I can acknowledge or remove conflicting datasets

  Scenario: Save terms
    Given I have configured all required term fields
    When I save
    Then the workspace overview updates the Terms card to "complete"
```

> **Design Decision (Immuta alignment):** The Immuta data model requires two separate AI/ML boolean flags per Data_Access_Intent: "To train AI/ML models" and "To store data in AI/ML model". The AoT configuration UI must capture these as independent toggles rather than a single AI/ML permission. This maps to `agreement_versions.terms.beyond_primary_use.ai_research` and a new `beyond_primary_use.store_in_ai_ml_model` field. See `03-data-model.md`, Section 6.1 for schema implications.

---

### 1.16 - Workspace: Define Access & Users `[M]`

**As a** DCM, **I want to** define who can access this collection by selecting from existing Immuta role groups and adding individual user overrides, **so that** the access scope is clear before promotion.

**BRD Refs:** FR-COL-040, FR-COL-041


> **Design Decision:** The workspace "Access & Users" section focuses on *access scope* — selecting which Immuta/ROAM role groups and individual users should receive access. This is distinct from *governance role assignment* (DCL, DDO, Collection Leader) which is covered in Epic 6 for post-draft management.

### Acceptance Criteria

```gherkin
Feature: Define Access & Users

  Scenario: Browse Immuta role groups
    Given I am on the Access & Users section
    Then I see a searchable list of existing Immuta role groups
    And each group shows: name, source system (ROAM, Immuta, Workday), member count, category
    And groups are organized by category: Therapeutic Area, Function, Study Team, Platform

  Scenario: Filter role groups by category
    Given I am viewing role groups
    When I select a category filter (e.g., "Therapeutic Area")
    Then only groups in that category are displayed
    And an "All" option shows all groups

  Scenario: Search role groups
    Given I am on the Access & Users section
    When I enter a search term
    Then the role group list filters to matching names

  Scenario: Select role groups for collection
    Given I am viewing role groups
    When I toggle a group on
    Then the group is added to the collection's access scope
    And the total user count updates

  Scenario: Add individual users
    Given I am on the Individual Users tab
    When I search by name or PRID
    Then matching users from the directory are displayed
    And I can add them to the collection individually

  Scenario: Add user by PRID directly
    Given I am on the Individual Users tab
    When I enter a PRID in the manual entry field
    Then the user is looked up and added to the collection

  Scenario: View access summary
    Given I have selected role groups and/or individual users
    When I view the Summary tab
    Then I see: total role groups selected, total individual users, estimated total users
    And selected groups are listed with member counts

  Scenario: Save and return to workspace
    Given I have configured access scope
    When I navigate back to the overview
    Then the Access & Users card updates with the count (e.g., "3 groups, 2 users selected")
```

---

## Phase 3 — Promote

### 1.17 - Promote Concept to Draft `[M]`

**As a** DCM, **I want to** promote my concept to a formal draft when all required sections are complete, **so that** it enters the governance pipeline and becomes visible to team members.

**BRD Refs:** FR-COL-020


### Acceptance Criteria

```gherkin
Feature: Promote Concept to Draft

  Scenario: Promote button enabled when all required sections complete
    Given the Datasets, Activities, and Data Use Terms sections are complete
    Then the "Promote to Draft" button is enabled in the sidebar

  Scenario: Promote button disabled when sections incomplete
    Given one or more required sections are incomplete
    Then the "Promote to Draft" button is disabled
    And a message lists which sections still need completion

  Scenario: Promote navigates to review
    Given all required sections are complete
    When I click "Promote to Draft"
    Then I am taken to a review summary page showing all collection details
    And I can confirm promotion or go back to edit

  Scenario: Successful promotion
    Given I confirm the promotion
    Then the concept status changes to "draft"
    And a version_snapshot v1 is created
    And the workspace banner updates to "Draft Stage — visible to team members"
    And a "collection.created" event is published

  Scenario: Post-promotion navigation to collection detail
    Given I have confirmed the promotion
    Then I am navigated to the collection detail page at /collections/{id}
    And the detail page shows a DRAFT banner indicating the collection is visible but pending approval
    And draft-specific controls are available: "Approve Collection" button, edit grid for workspace sections
    And the full progress view (health score, tabs, discussion) becomes available once the collection is approved and active
```

---

### 1.18 - Duplicate Detection on Concept Creation `[L]`

**As a** DCM, **I want to** be warned if a similar collection already exists, **so I** don't create redundant collections.

**BRD Refs:** VS2-340


### Acceptance Criteria

```gherkin
Feature: Duplicate Detection

  Scenario: Similar collection detected
    Given I am creating or editing a concept
    When the system compares my title, description, and dataset selection against existing collections
    And overlap exceeds the similarity threshold
    Then a warning is displayed with similarity scores and matching collections

  Scenario: Proceed despite duplicate warning
    Given a duplicate warning is displayed
    When I choose to proceed
    Then the concept creation continues normally
    And the duplicate warning is logged

  Scenario: Link to existing collection
    Given a duplicate warning is displayed
    When I choose to link to an existing collection
    Then I am navigated to the existing collection's detail page
```

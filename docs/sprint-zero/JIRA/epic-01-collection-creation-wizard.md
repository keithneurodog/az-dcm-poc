# Epic 1: Collection Creation Wizard

**Goal:** Enable DCM users to create new Open Access Collections through a guided multi-step wizard flow.

**Personas:** Data Collection Manager (DCM)

**BRD Refs:** FR-COL-001 through FR-COL-017

**Sizing Key:** S = 1-2 days | M = 3-5 days | L = 1-2 weeks | XL = 2+ weeks

---

## 1.1 - Select Collection Request Type `[S]`

**As a** DCM, **I want to** select whether I'm creating a New collection, Updating an existing collection, or making a Policy Change, **so that** the system tailors the wizard flow accordingly.

**BRD Refs:** FR-COL-002

### Acceptance Criteria

```gherkin
Feature: Select Collection Request Type

  Scenario: DCM selects "New" request type
    Given I am on the collection creation wizard
    When I select "New" as the request type
    Then the wizard proceeds with a blank collection form
    And no existing collection is linked

  Scenario: DCM selects "Update" request type
    Given I am on the collection creation wizard
    When I select "Update" as the request type
    Then I am prompted to search for and link an existing collection
    And the wizard pre-populates all fields from the linked collection

  Scenario: DCM selects "Policy Change" request type
    Given I am on the collection creation wizard
    When I select "Policy Change" as the request type
    Then I am prompted to search for and link an existing collection
    And the wizard pre-populates all fields from the linked collection
    And the wizard highlights policy-related sections for editing

  Scenario: DCM attempts to proceed without selecting a request type
    Given I am on the collection creation wizard
    And I have not selected a request type
    When I attempt to proceed to the next step
    Then I see a validation message requiring a request type selection
```

---

## 1.2 - Define Collection Intent (Free Text with AI Assist) `[M]`

**As a** DCM, **I want to** describe what I'm looking for in natural language, **so that** AI can help extract keywords and suggest relevant categories.

**BRD Refs:** FR-COL-003

### Acceptance Criteria

```gherkin
Feature: Define Collection Intent

  Scenario: DCM enters a free-text intent description
    Given I am on the intent definition step
    When I enter a natural language description of my collection goal
    Then the system displays AI-extracted keywords below the input
    And the keywords are editable (add, remove, modify)

  Scenario: AI keyword extraction on intent submission
    Given I have entered an intent description
    When the AI processes my description
    Then relevant keywords are displayed with visual indicators
    And I can manually add additional keywords
    And I can remove irrelevant keywords

  Scenario: Example intent prompts are displayed
    Given I am on the intent definition step
    And my intent field is empty
    Then the system displays example intent prompts for guidance
    And clicking an example pre-fills the intent field

  Scenario: Pre-fill from demand analytics page
    Given I navigated to the creation wizard from the demand analytics page
    When the wizard loads
    Then the intent field is pre-populated with the analytics context
    And keywords are pre-extracted from the analytics data
```

---

## 1.3 - AI-Assisted Category Selection `[M]`

**As a** DCM, **I want the** system to suggest data categories based on my intent description, **so I can** select the relevant taxonomy categories for my collection.

### Acceptance Criteria

```gherkin
Feature: AI-Assisted Category Selection

  Scenario: AI suggests categories from intent
    Given I have entered an intent description with extracted keywords
    When I navigate to the category selection step
    Then the system displays 30+ categories organized by domain
    And AI-suggested categories are highlighted with confidence scores

  Scenario: Manual category management
    Given I am on the category selection step
    When I want to customize the selection
    Then I can manually add categories not suggested by the AI
    And I can remove AI-suggested categories
    And the category count badge updates in real-time

  Scenario: Re-analyze categories after intent change
    Given I have AI-suggested categories
    When I go back and modify my intent description or keywords
    And I return to the category selection step
    Then the system re-analyzes and updates category suggestions
    And previously manual selections are preserved

  Scenario: Category taxonomy is organized by domain
    Given I am on the category selection step
    Then categories are grouped by domain: TA, SDTM domains, ADaM datasets, specialized types
    And each group is collapsible/expandable
```

---

## 1.4 - Define Collection Criteria & Filters `[L]`

**As a** DCM, **I want to** define inclusion/exclusion criteria across multiple dimensions, **so that** the system can resolve them to a concrete list of studies.

**BRD Refs:** FR-COL-004

### Acceptance Criteria

```gherkin
Feature: Define Collection Criteria & Filters

  Scenario: DCM applies filters across multiple dimensions
    Given I am on the criteria definition step
    When I set filters for Therapeutic Area, Phase, Study Status, Geography, Data Modality, Indications, and Sponsor Type
    Then the system applies all filters with AND logic
    And the real-time dataset count updates as each filter changes

  Scenario: Smart filter via natural language
    Given I am on the criteria definition step
    When I enter a natural language query in the smart filter input
    Then the system interprets the query and applies matching filter values
    And the resolved filters are displayed for review

  Scenario: Include/exclude toggle per dimension
    Given I have set a filter value for a dimension
    When I toggle the include/exclude switch
    Then the dimension switches between inclusion and exclusion mode
    And the dataset count updates accordingly

  Scenario: Real-time dataset count feedback
    Given I am on the criteria definition step
    When I add, modify, or remove any filter
    Then the estimated dataset count updates within 2 seconds
```

---

## 1.5 - D-Code Resolution from Criteria `[L]`

**As a** DCM, **I want** criteria to resolve into a definitive list of study d-codes, **so I can** review exactly which studies are included.

**BRD Refs:** FR-COL-005, VS2-329

### Acceptance Criteria

```gherkin
Feature: D-Code Resolution from Criteria

  Scenario: Criteria resolve to d-code list
    Given I have defined filter criteria
    When I proceed to the d-code resolution step
    Then the system calls the AZCT API to resolve filters to concrete d-codes
    And the d-code list displays: study name, phase, status, patient count per study

  Scenario: Access provisioning breakdown is shown
    Given the d-code list is resolved
    Then each study shows its access provisioning breakdown (20/30/40/10 model)
    And aggregate breakdown percentages are displayed for the full list

  Scenario: Manual add/remove individual d-codes
    Given the resolved d-code list is displayed
    When I manually add a d-code not in the resolved list
    Then the d-code is added with its metadata fetched from AZCT
    When I remove a d-code from the list
    Then the d-code is removed and counts update

  Scenario: Compliance flags are highlighted
    Given the d-code list is resolved
    When any study has ethical or legal compliance flags
    Then the study row is visually highlighted
    And a compliance flag icon with tooltip is displayed
```

---

## 1.6 - Configure Inclusion Mechanisms `[S]`

**As a** DCM, **I want to** specify inclusion mechanisms (Auto-included, Opt-out, Opt-in) per study, **so that** the correct review workflows are triggered.

**BRD Refs:** FR-COL-006

### Acceptance Criteria

```gherkin
Feature: Configure Inclusion Mechanisms

  Scenario: Default inclusion mode is auto-include
    Given I am viewing the d-code list
    Then all studies default to "Included (auto)" mode

  Scenario: DCM overrides inclusion mode per study
    Given a study is set to "Included (auto)"
    When I change the mode to "Included opt-out" or "Included opt-in"
    Then the study's inclusion mode is updated
    And a tooltip explains what the selected mode means for quarterly reviews

  Scenario: Explanation of each mode is available
    Given I am on the inclusion mechanism configuration
    When I hover over or click the info icon for a mode
    Then the system displays an explanation of how that mode affects quarterly reviews
```

---

## 1.7 - Configure Data Modalities per Study `[M]`

**As a** DCM, **I want to** specify which data modalities are included for each study, **so that** the collection scope is precise.

**BRD Refs:** FR-COL-008, FR-COL-009, FR-COL-010, VS2-332

### Acceptance Criteria

```gherkin
Feature: Configure Data Modalities per Study

  Scenario: Select modalities for a study
    Given I am configuring modalities for a study
    When I toggle modalities on/off from the options: Clinical/SDTM, ADaM, ctDNA/Biomarker, Imaging/DICOM, Omics/NGS, RWD, RAW
    Then the selected modalities are saved for that study
    And the modality selection is visually reflected

  Scenario: Validation prevents blank modality records
    Given I have a study in the collection
    When I attempt to proceed without selecting at least one modality for the study
    Then a validation error is displayed indicating the study requires at least one modality

  Scenario: Bulk modality assignment
    Given I have multiple studies in the collection
    When I select multiple studies and choose "Bulk assign modality"
    And I select one or more modalities
    Then the selected modalities are applied to all selected studies
```

---

## 1.8 - Configure Data Sources per Modality `[M]`

**As a** DCM, **I want to** specify the data source for each modality, **so that** DPO knows where to provision from.

**BRD Refs:** FR-COL-011, FR-COL-012, VS2-333

### Acceptance Criteria

```gherkin
Feature: Configure Data Sources per Modality

  Scenario: Assign source to a modality
    Given a study has a modality selected
    When I select a data source from: entimICE, PDP, CTDS, Medidata Rave, Veeva Vault, External Partners
    Then the source is assigned to that modality for that study

  Scenario: Validation prevents modality without source
    Given a modality is selected for a study
    When I attempt to proceed without assigning a source to the modality
    Then a validation error is displayed indicating a source is required

  Scenario: Auto-suggest sources based on study metadata
    Given a study has a modality selected
    When the system detects known source information from study metadata
    Then the source field is auto-suggested with the most likely option
    And the DCM can override the suggestion
```

---

## 1.9 - Select Consumption Environments `[S]`

**As a** DCM, **I want to** select where users will access the data, **so that** provisioning targets the right environments.

**BRD Refs:** FR-COL-013, FR-COL-014, FR-COL-015, VS2-334

### Acceptance Criteria

```gherkin
Feature: Select Consumption Environments

  Scenario: Select environments for the collection
    Given I am on the environment selection step
    Then the options displayed are: SCP, Domino Data Lab, AI Bench, PDP, IO Platform
    And leadership-defined default boundaries are pre-selected

  Scenario: Add additional environments beyond defaults
    Given I have the default environments selected
    When I select an additional environment beyond the defaults
    Then a justification text field is displayed
    And I must provide a justification before proceeding

  Scenario: Default boundaries are displayed
    Given I am on the environment selection step
    Then leadership-defined defaults are visually indicated as "Default"
```

---

## 1.10 - Define Activities & Access Levels `[M]`

**As a** DCM, **I want to** define permitted activities and their required access levels, **so that** the AoT accurately reflects what users can do.

### Acceptance Criteria

```gherkin
Feature: Define Activities & Access Levels

  Scenario: Select activities from predefined categories
    Given I am on the activities definition step
    Then Engineering activities are listed: ETL, Variant Harmonization
    And Analysis activities are listed: Early Response Classifier, Multimodal Fusion, Cohort Builder, etc.

  Scenario: Assign access level per activity
    Given I have selected an activity
    When I assign an access level
    Then the options are: aggregated, processed, patient-level
    And the selected level is saved for that activity

  Scenario: Create a custom activity
    Given I am on the activities definition step
    When I click "Add Custom Activity"
    And I enter a name and select an access level
    Then the custom activity is added to the collection's activity list
```

---

## 1.11 - Configure Agreement of Terms (AoT) `[L]`

**As a** DCM, **I want to** define the Agreement of Terms including permitted uses, ML/AI permissions, publication rights, and user scope, **so that** governance is clear.

**BRD Refs:** FR-COL-016

### Acceptance Criteria

```gherkin
Feature: Configure Agreement of Terms

  Scenario: Define primary use permissions
    Given I am on the AoT configuration step
    When I select primary use checkboxes
    Then the options include: understand drug mechanism, understand disease, develop diagnostics, learn from past studies, improve analysis methods

  Scenario: Define beyond primary use permissions
    Given I am configuring AoT
    When I toggle "Beyond Primary Use" options
    Then I can enable/disable: AI/ML research, software development

  Scenario: Configure publication permissions
    Given I am configuring AoT
    When I select publication permissions
    Then the options are: internal restricted, external publication

  Scenario: Define prohibited uses
    Given I am configuring AoT
    When I enter prohibited uses in the free-text field
    Then the prohibited uses are saved and displayed in the AoT summary

  Scenario: AoT conflict detection
    Given I have configured AoT terms
    When the system detects a conflict with an existing collection's AoT
    Then a warning is displayed showing the conflicting collection and terms
    And I can choose to proceed or modify my terms
```

---

## 1.12 - Assign User Scope to AoT `[M]`

**As a** DCM, **I want to** define who can access this collection by organization, role, or individual, **so that** access is properly scoped.

**BRD Refs:** FR-COL-017

### Acceptance Criteria

```gherkin
Feature: Assign User Scope to AoT

  Scenario: Assign by organization
    Given I am on the user scope step
    When I select "By Organization" mode
    Then I can browse organizations with user counts
    And selecting an organization includes all its members

  Scenario: Assign by role
    Given I am on the user scope step
    When I select "By Role" mode
    Then I can browse available roles with user counts
    And selecting a role includes all users with that role

  Scenario: Assign by individual
    Given I am on the user scope step
    When I select "By Individual" mode
    Then I can search for individual users via Azure AD integration
    And I can add/remove individuals from the scope

  Scenario: Total user count display
    Given I have assigned users via any mode
    Then the total user count is displayed and updated in real-time
```

---

## 1.13 - Review & Name Collection `[M]`

**As a** DCM, **I want to** review all collection details before submission, **so I can** verify everything is correct.

**BRD Refs:** FR-COL-001

### Acceptance Criteria

```gherkin
Feature: Review & Name Collection

  Scenario: Summary view displays all collection details
    Given I am on the review step
    Then I see a summary of: name, description, target community, datasets (with d-codes), activities, AoT terms, user scope, environments

  Scenario: Edit collection name and description
    Given I am on the review step
    When I edit the collection name or description fields
    Then the changes are saved immediately

  Scenario: Navigate back to any wizard step
    Given I am on the review step
    When I click "Edit" on any section
    Then I am navigated to the corresponding wizard step
    And I can make changes and return to the review step

  Scenario: Compliance check summary
    Given I am on the review step
    Then a compliance check summary per study is displayed (ethical/legal status)
    And studies with issues are flagged

  Scenario: Duplicate detection warning
    Given I am on the review step
    When the system detects a similar existing collection
    Then a duplicate warning is displayed with similarity details
    And I can choose to proceed or link to the existing collection
```

---

## 1.14 - Submit Collection (Save as Draft) `[S]`

**As a** DCM, **I want to** save my collection as a draft, **so I can** continue editing later before formal submission.

**BRD Refs:** FR-COL-020

### Acceptance Criteria

```gherkin
Feature: Submit Collection as Draft

  Scenario: Save collection as draft
    Given I am on the review step
    When I click "Save as Draft"
    Then the collection is saved with status "draft"
    And a version_snapshot v1 is created
    And a "collection.created" event is published
    And I am redirected to the collection progress/detail page

  Scenario: Draft is editable later
    Given a collection exists with status "draft"
    When I navigate to the collection's detail page
    Then I can continue editing all fields
```

---

## 1.15 - Duplicate Detection on Collection Creation `[L]`

**As a** DCM, **I want to** be warned if a similar collection already exists, **so I** don't create redundant collections.

**BRD Refs:** VS2-340

### Acceptance Criteria

```gherkin
Feature: Duplicate Detection

  Scenario: Similar collection detected during creation
    Given I am creating a collection
    When the system compares my criteria against existing collections
    And overlap exceeds the similarity threshold
    Then a warning is displayed with similarity scores and matching collections

  Scenario: Proceed despite duplicate warning
    Given a duplicate warning is displayed
    When I choose to proceed
    Then the collection creation continues normally
    And the duplicate warning is logged in the audit trail

  Scenario: Link to existing collection from warning
    Given a duplicate warning is displayed
    When I choose to link to an existing collection
    Then I am navigated to the existing collection's detail page
```

---

## 1.16 - Pre-fill from Demand Analytics `[S]`

**As a** DCM, **I want the** creation wizard to pre-populate when I click "Create Collection" from the demand analytics page, **so I can** act on identified demand quickly.

### Acceptance Criteria

```gherkin
Feature: Pre-fill from Demand Analytics

  Scenario: Wizard pre-fills from analytics context
    Given I click "Create Collection" from the demand analytics page
    When the creation wizard loads
    Then the intent text is pre-filled from the analytics query
    And filter criteria are pre-populated with analytics parameters (TA, type, intent)
    And a "Pre-filled based on demand analysis" indicator is displayed

  Scenario: DCM can modify pre-filled values
    Given the wizard has been pre-filled from analytics
    When I modify any pre-filled field
    Then the changes are accepted and the pre-fill indicator remains visible
```

# Epic 8: Collection Search & AI Discovery

**Goal:** Enable intelligent search and AI-assisted discovery of collections and datasets.

**Personas:** All (primarily Data Consumer)

**BRD Refs:** FR-DSC-001 through FR-DSC-006

**Sizing Key:** S = 1-2 days | M = 3-5 days | L = 1-2 weeks | XL = 2+ weeks

---

## 8.1 - AI-Assisted Natural Language Search `[L]`

**As a** user, **I want to** search using natural language queries (e.g., "oncology biomarker studies from 2024"), **so the** system interprets my intent and suggests relevant collections.

**BRD Refs:** FR-DSC-002

### Acceptance Criteria

```gherkin
Feature: AI-Assisted Natural Language Search

  Scenario: Natural language query returns relevant results
    Given I am on the collections browser or search page
    When I enter a natural language query (e.g., "oncology biomarker studies from 2024")
    Then the AI interprets my intent
    And relevant collections are displayed ranked by relevance

  Scenario: Filters are pre-populated from query
    Given I have entered a natural language query
    When the AI interprets the query
    Then relevant filter facets are pre-populated (e.g., TA = Oncology, Data Type = Biomarker, Year = 2024)
    And I can modify the pre-populated filters

  Scenario: No results found
    Given I enter a natural language query with no matches
    Then a helpful message is displayed
    And alternative search suggestions are provided
```

---

## 8.2 - Data Category Taxonomy Browser `[M]`

**As a** user, **I want to** browse the 30+ category taxonomy tree, **so I can** discover collections organized by domain.

**BRD Refs:** FR-DSC-003

### Acceptance Criteria

```gherkin
Feature: Data Category Taxonomy Browser

  Scenario: Hierarchical taxonomy display
    Given I am on the taxonomy browser
    Then categories are displayed hierarchically: TA > SDTM Domains > ADaM Datasets > Specialized Types
    And the tree is expandable/collapsible

  Scenario: Collection counts per category
    Given I am viewing the taxonomy tree
    Then each category node shows the count of collections in that category

  Scenario: Click category to filter collections
    Given I am viewing the taxonomy tree
    When I click on a category
    Then the collections browser filters to show only collections in that category
```

---

## 8.3 - Similar Collection Recommendations `[L]`

**As a** user, when viewing a collection, **I want to** see similar/related collections, **so I can** discover alternatives.

**BRD Refs:** FR-DSC-004, VS2-343

### Acceptance Criteria

```gherkin
Feature: Similar Collection Recommendations

  Scenario: Recommendations displayed on collection detail
    Given I am viewing a collection detail page
    Then a "Similar Collections" section is displayed
    And recommendations are based on: dataset overlap, TA overlap, user profile, browsing history

  Scenario: Click recommendation navigates to collection
    Given similar collections are displayed
    When I click on a recommended collection
    Then I am navigated to that collection's detail page

  Scenario: No similar collections found
    Given I am viewing a unique collection with no similarities
    Then the "Similar Collections" section shows an appropriate message
```

---

## 8.4 - Collection Comparison (Side-by-Side) `[M]`

**As a** user, **I want to** compare two or more collections side-by-side, **so I can** decide which best meets my needs.

**BRD Refs:** FR-DSC-006

### Acceptance Criteria

```gherkin
Feature: Collection Comparison

  Scenario: Select collections for comparison
    Given I am on the collections browser
    When I select 2-3 collections for comparison
    And I click "Compare"
    Then a side-by-side comparison view is displayed

  Scenario: Comparison shows key dimensions
    Given I am viewing a comparison
    Then the following are compared: scope, AoT terms, users, datasets, access levels, environments

  Scenario: Differences are highlighted
    Given I am viewing a comparison
    Then differences between collections are visually highlighted
    And similarities are de-emphasized
```

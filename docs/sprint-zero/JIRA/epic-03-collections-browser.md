# Epic 3: Collections Browser

**Goal:** Enable all authenticated users to discover and browse data collections with rich search and filtering.

**Personas:** All (DCM, Data Consumer, Approver, Team Lead)

**BRD Refs:** FR-COL-030 through FR-COL-035, FR-DSC-001

**Sizing Key:** S = 1-2 days | M = 3-5 days | L = 1-2 weeks | XL = 2+ weeks

---

## 3.1 - Collections Grid View (Card Layout) `[L]`

**As a** user, **I want to** see collections displayed as cards in a grid, **so I can** quickly scan and compare collections visually.

**BRD Refs:** FR-COL-030, FR-COL-031

### Acceptance Criteria

```gherkin
Feature: Collections Grid View

  Scenario: Collection cards display required information
    Given I am on the collections browser page
    When I view collections in grid mode
    Then each card displays: name, description (truncated), owner, status badge, progress bar, user count, dataset count (d-codes with "+X more"), access indicator, creation date

  Scenario: Responsive grid layout
    Given I am viewing collections in grid mode
    When I resize the browser window
    Then the grid layout adjusts responsively
    And cards maintain readability at all breakpoints

  Scenario: Click card navigates to detail
    Given I am viewing collections in grid mode
    When I click on a collection card
    Then I am navigated to the collection detail page
```

---

## 3.2 - Collections List View (Table Layout) `[M]`

**As a** user, **I want to** toggle to a table/list view of collections, **so I can** see more collections at once with sortable columns.

### Acceptance Criteria

```gherkin
Feature: Collections List View

  Scenario: Toggle to list view
    Given I am on the collections browser page in grid mode
    When I click the list/table view toggle
    Then the display switches to a tabular layout

  Scenario: Sortable columns
    Given I am viewing collections in list mode
    When I click a column header (name, status, TA, owner, datasets, users, progress, created date)
    Then the table sorts by that column
    And clicking again reverses the sort order

  Scenario: Row click navigates to detail
    Given I am viewing collections in list mode
    When I click on a collection row
    Then I am navigated to the collection detail page
```

---

## 3.3 - Collections Kanban View (Status Board) `[M]`

**As a** DCM, **I want to** see collections organized by status in a Kanban board, **so I can** visualize the pipeline at a glance.

### Acceptance Criteria

```gherkin
Feature: Collections Kanban View

  Scenario: Display collections by status columns
    Given I am on the collections browser page
    When I select the Kanban view
    Then collections are organized into columns: Draft, Pending Approval, Approved, Provisioning, Active
    And each column shows a card count

  Scenario: Drag card between valid status transitions
    Given I am viewing the Kanban board
    When I drag a collection card from "Draft" to "Pending Approval"
    Then the system validates the transition is allowed
    And the status is updated if valid

  Scenario: Invalid drag is rejected
    Given I am viewing the Kanban board
    When I drag a collection card to an invalid status column
    Then the card snaps back to its original column
    And an error message explains the invalid transition
```

---

## 3.4 - Full-Text Search Across Collections `[M]`

**As a** user, **I want to** search across collection names, descriptions, dataset d-codes, dataset names, and owner fields, **so I can** find specific collections quickly.

**BRD Refs:** FR-COL-032, FR-DSC-001

### Acceptance Criteria

```gherkin
Feature: Full-Text Search

  Scenario: Search by collection name
    Given I am on the collections browser page
    When I enter a collection name in the search input
    Then matching collections are displayed with the search term highlighted
    And results appear within 500ms

  Scenario: Search by d-code
    Given I am on the collections browser page
    When I enter a d-code (e.g., "D7080C00001") in the search input
    Then collections containing that d-code are displayed

  Scenario: Search with debounce
    Given I am typing in the search input
    When I pause typing for 300ms
    Then the search executes automatically

  Scenario: Clear search
    Given I have an active search query
    When I click the clear search button
    Then the search input is cleared
    And all collections are displayed (subject to active filters)
```

---

## 3.5 - Multi-Faceted Filtering System `[L]`

**As a** user, **I want to** filter collections by multiple criteria simultaneously, **so I can** narrow down to relevant collections.

**BRD Refs:** FR-COL-033

### Acceptance Criteria

```gherkin
Feature: Multi-Faceted Filtering

  Scenario: Apply multiple filters simultaneously
    Given I am on the collections browser page
    When I apply filters for Status, Therapeutic Area, and Data Type
    Then only collections matching ALL active filters are displayed
    And the active filter count indicator shows "3"

  Scenario: Filter dimensions available
    Given I open the filter panel
    Then the following filter dimensions are available: Status, Therapeutic Area, Owner, Access Level, Compliance, Study Phase, Data Type, Region, Quality, Dataset count range, Patient count range, User count range, Created date range, Updated date range, Favorites, Progress range

  Scenario: Clear all filters
    Given I have multiple active filters
    When I click "Clear All Filters"
    Then all filters are removed
    And all collections are displayed
    And the active filter count resets to 0

  Scenario: AND logic across filters
    Given I select Status = "Active" and Therapeutic Area = "Oncology"
    Then only collections that are both Active AND in Oncology are shown
```

---

## 3.6 - Collection Sorting Options `[S]`

**As a** user, **I want to** sort collections by different criteria, **so I can** prioritize what I see.

**BRD Refs:** FR-COL-034

### Acceptance Criteria

```gherkin
Feature: Collection Sorting

  Scenario: Default sort is by recent
    Given I am on the collections browser page
    Then collections are sorted by most recently updated (default)

  Scenario Outline: Sort by different criteria
    Given I am on the collections browser page
    When I select sort by "<sort_option>"
    Then collections are reordered by <sort_option>

    Examples:
      | sort_option            |
      | Recent                 |
      | Alphabetical           |
      | Most Users             |
      | Completion Percentage  |
      | Patient Count          |

  Scenario: Favorites pinned to top regardless of sort
    Given I have favorited some collections
    When I apply any sort option
    Then favorited collections always appear at the top
    And non-favorited collections are sorted below
```

---

## 3.7 - Access Control Indicators `[S]`

**As a** user, **I want to** see access indicators on each collection card, **so I** know at a glance whether I can access the data.

**BRD Refs:** FR-COL-035

### Acceptance Criteria

```gherkin
Feature: Access Control Indicators

  Scenario Outline: Access indicator based on user permissions
    Given I am viewing a collection card
    And my access level for this collection is "<access_level>"
    Then the card displays a "<indicator_color>" indicator with label "<label>"

    Examples:
      | access_level    | indicator_color | label          |
      | member          | green           | Member         |
      | requestable     | amber           | Request Access |
      | public          | blue            | Public         |
      | restricted      | red             | Restricted     |
```

---

## 3.8 - Collection Favoriting `[S]`

**As a** user, **I want to** star/favorite collections, **so they** appear prominently when I return.

**BRD Refs:** FR-DSC-005

### Acceptance Criteria

```gherkin
Feature: Collection Favoriting

  Scenario: Favorite a collection
    Given I am viewing a collection card
    When I click the star/favorite icon
    Then the collection is marked as favorited
    And the star icon changes to a filled state

  Scenario: Unfavorite a collection
    Given I have a favorited collection
    When I click the star icon again
    Then the collection is unfavorited
    And the star icon changes to an unfilled state

  Scenario: Favorites persist across sessions
    Given I have favorited collections
    When I log out and log back in
    Then my favorited collections remain favorited

  Scenario: Favorites sort to top
    Given I have favorited some collections
    When I view the collections browser
    Then favorited collections appear at the top of the list
```

---

## 3.9 - My Access Filter `[S]`

**As a** Data Consumer, **I want to** quickly filter to collections I have access to or don't have access to, **so I can** find what I need.

### Acceptance Criteria

```gherkin
Feature: My Access Filter

  Scenario: Filter to collections I have access to
    Given I am on the collections browser page
    When I select the "Have Access" quick filter
    Then only collections I am a member of are displayed

  Scenario: Filter to collections I don't have access to
    Given I am on the collections browser page
    When I select the "Don't Have Access" quick filter
    Then only collections I am not a member of are displayed

  Scenario: Show all collections
    Given I have an active access filter
    When I select "All"
    Then all collections are displayed regardless of my access status

  Scenario: My access filter combines with other filters
    Given I have selected "Have Access"
    When I also apply a Therapeutic Area filter
    Then only collections I have access to within that TA are shown
```

---

## 3.10 - Intent/Purpose Filter `[S]`

**As a** user, **I want to** filter collections by their permitted intent (AI/ML, Software Dev, Publication), **so I can** find collections that match my use case.

### Acceptance Criteria

```gherkin
Feature: Intent/Purpose Filter

  Scenario: Filter by permitted intent
    Given I am on the collections browser page
    When I select a permitted intent filter (e.g., "AI/ML Research")
    Then only collections whose AoT permits that intent are displayed

  Scenario: Quick-select common intents
    Given I open the intent filter
    Then common intents are displayed as quick-select options
    And selecting one immediately filters the collections
```

---

## 3.11 - Empty State & Getting Started `[S]`

**As a** new user, **I want** helpful guidance when no collections match my search or filters, **so I** know what to do next.

### Acceptance Criteria

```gherkin
Feature: Empty State & Getting Started

  Scenario: No collections match search/filters
    Given I have applied search or filter criteria
    When no collections match
    Then a friendly empty state message is displayed
    And suggestions to broaden search or adjust filters are shown

  Scenario: DCM sees create collection link
    Given I am a DCM user
    And no collections match my search
    Then a link to "Create New Collection" is displayed in the empty state

  Scenario: Non-DCM user sees appropriate guidance
    Given I am a Data Consumer
    And no collections match my search
    Then guidance is shown without the "Create" option
    And a suggestion to contact a DCM is displayed
```

---

## 3.12 - Pagination / Infinite Scroll `[M]`

**As a** user, **I want** collections loaded efficiently when there are hundreds of results, **so the** page remains responsive.

### Acceptance Criteria

```gherkin
Feature: Pagination

  Scenario: Collections are paginated
    Given there are more than 20 collections matching my criteria
    When I view the collections browser
    Then the first page of results is displayed (default 20)
    And pagination controls are shown

  Scenario: Page size selector
    Given I am on the collections browser page
    When I change the page size to 50 or 100
    Then the number of collections per page updates accordingly

  Scenario: Performance with large result sets
    Given there are 500 active collections in the system
    When I load the collections browser
    Then the page loads within 2 seconds
    And scrolling remains smooth
```

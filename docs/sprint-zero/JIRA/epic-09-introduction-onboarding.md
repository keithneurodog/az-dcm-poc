# Epic 9: Collection Introduction & Onboarding

**Goal:** Provide role-appropriate introduction and guidance for new users entering the collections area.

**Personas:** All

**BRD Refs:** MVP-008

---

## 9.1 - Role-Based Landing/Introduction Page `[M]`

**As a** new user, **I want a** role-appropriate introduction explaining what Collectoid does and what I can do, **so I can** orient myself quickly.

### Acceptance Criteria

```gherkin
Feature: Role-Based Landing Page

  Scenario: DCM landing page
    Given I am logged in as a DCM
    When I access the application for the first time
    Then I see a landing page with: create collections shortcut, manage pipeline overview, analytics shortcuts

  Scenario: Data Consumer landing page
    Given I am logged in as a Data Consumer
    When I access the application for the first time
    Then I see a landing page with: discover data guidance, browse collections shortcut, check my access link

  Scenario: Approver landing page
    Given I am logged in as an Approver
    When I access the application for the first time
    Then I see a landing page with: pending approvals queue, recent decisions summary

  Scenario: Team Lead landing page
    Given I am logged in as a Team Lead
    When I access the application for the first time
    Then I see a landing page with: team overview, team access status summary
```

---

## 9.2 - In-App Contextual Help `[M]`

**As a** user, **I want** contextual help available throughout the application, **so I can** understand features without leaving the page.

### Acceptance Criteria

```gherkin
Feature: In-App Contextual Help

  Scenario: Help panel displays context-sensitive content
    Given I am on any page in the application
    When I open the help panel
    Then the help content is specific to the current page/feature

  Scenario: Create workspace shows AI guidance
    Given I am on the collection creation workspace
    When I open the help panel
    Then I see a "New to AI-assisted collection building?" guide

  Scenario: Glossary of terms
    Given I open the help panel
    When I navigate to the glossary section
    Then I see definitions for key terms: OAC, AoT, d-code, DCM, DDO, DCL, ROAM, etc.
```

---

## 9.3 - Role-Based Navigation & Sidebar `[M]`

**As a** user, **I want the** sidebar navigation to show only features relevant to my role, **so the** interface isn't overwhelming.

### Acceptance Criteria

```gherkin
Feature: Role-Based Navigation

  Scenario: DCM navigation
    Given I am logged in as a DCM
    Then the sidebar shows: Dashboard, Create, Collections, Analytics, Propositions

  Scenario: Data Consumer navigation
    Given I am logged in as a Data Consumer
    Then the sidebar shows: Discover, My Access, Browse, Requests

  Scenario: Approver navigation
    Given I am logged in as an Approver
    Then the sidebar shows: Approval Queue, Collections (read-only), History

  Scenario: Team Lead navigation
    Given I am logged in as a Team Lead
    Then the sidebar shows: Team Dashboard, Collections, Requests

  Scenario: Role change updates navigation
    Given my role has been changed in the system
    When I refresh or log in again
    Then the sidebar reflects my updated role's navigation items
```

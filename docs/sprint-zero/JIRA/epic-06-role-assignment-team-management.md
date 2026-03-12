# Epic 6: Role Assignment & Team Management

**Goal:** Enable DCM users to assign governance roles and manage user/team membership for collections.

**Personas:** DCM, Team Lead

**BRD Refs:** FR-COL-040 through FR-COL-043, VS2-330

> **Note:** This epic covers *governance role assignment* (DCL, DDO, Collection Leader) and team management for post-draft collections. *Access scope definition* — selecting which Immuta role groups and individual users should receive data access — is handled during collection creation in the workspace "Access & Users" section (see Epic 1, story 1.16).

---

## 6.1 - Assign Data Consumer Lead & Data Owner `[M]`

**As a** DCM, **I want to** assign at least one Data Consumer Lead and one Data Owner to a collection, **so that** governance responsibility is clear.

**BRD Refs:** FR-COL-040


> **Note:** Initial access scope definition during collection creation happens in the workspace Access & Users section (see Epic 1, story 1.16). This story covers governance role management post-draft.

### Acceptance Criteria

```gherkin
Feature: Assign Data Consumer Lead & Data Owner

  Scenario: Assign DCL to collection
    Given I am editing a collection
    When I search for a user via Azure AD integration
    And I assign the user as Data Consumer Lead (DCL)
    Then the user is assigned the DCL role for this collection

  Scenario: Assign DDO to collection
    Given I am editing a collection
    When I search for a user via Azure AD integration
    And I assign the user as Delegate Data Owner (DDO)
    Then the user is assigned the DDO role for this collection

  Scenario: Minimum role validation
    Given I am submitting a collection for approval
    When the collection has fewer than one DCL or fewer than one DDO
    Then submission is blocked
    And a validation error indicates the missing required role assignments
```

---

## 6.2 - Nominate Collection Leader `[S]`

**As a** DCM, **I want to** nominate a Collection Leader for day-to-day management, **so that** operational responsibility is delegated.

**BRD Refs:** FR-COL-043


> **Note:** Initial access scope definition during collection creation happens in the workspace Access & Users section (see Epic 1, story 1.16). This story covers governance role management post-draft.

### Acceptance Criteria

```gherkin
Feature: Nominate Collection Leader

  Scenario: Nominate from assigned users
    Given I am editing a collection with assigned users
    When I select a user from the assigned users list
    And I nominate them as Collection Leader
    Then the user is assigned the Collection Leader role with scoped permissions

  Scenario: Define scoped permissions
    Given I am nominating a Collection Leader
    When I define their permission scope
    Then the Collection Leader can only perform actions within the defined scope
```

---

## 6.3 - Create & Manage Virtual Teams `[L]`

**As a** DCM, **I want to** create virtual teams (user groups) linked to a collection, **so that** access can be managed at the group level.

**BRD Refs:** FR-COL-041


### Acceptance Criteria

```gherkin
Feature: Create & Manage Virtual Teams

  Scenario: Create a virtual team
    Given I am managing a collection
    When I create a new virtual team with a name
    Then the team is created and linked to the collection
    And the team member count shows 0

  Scenario: Add users to a team
    Given a virtual team exists for a collection
    When I add users to the team
    Then the users become team members
    And the team member count updates

  Scenario: Remove users from a team
    Given a virtual team has members
    When I remove a user from the team
    Then the user is removed from the team
    And their collection access is updated accordingly

  Scenario: Bulk user import
    Given I am managing a virtual team
    When I import a list of users in bulk (e.g., via CSV or AD group)
    Then all valid users are added to the team
    And invalid entries are reported with reasons
```

---

## 6.4 - Azure AD User Search for Assignment `[M]`

**As a** DCM, **I want to** search AstraZeneca's directory to find and assign users, **so I can** identify the right people.

> **Note:** Azure AD search is also available in the workspace Access & Users section during concept creation (see Epic 1, story 1.16). This story covers the full search experience and post-draft management.

### Acceptance Criteria

```gherkin
Feature: Azure AD User Search

  Scenario: Type-ahead search by name
    Given I am searching for users to assign
    When I type a partial name
    Then matching users from Azure AD are displayed as I type
    And each result shows: name, email, department, job title

  Scenario: Type-ahead search by email
    Given I am searching for users to assign
    When I type a partial email address
    Then matching users from Azure AD are displayed as I type

  Scenario: Recent/suggested users
    Given I am on the user search interface
    Then recently assigned and suggested users are shown before I search
```

---

## 6.5 - Auto-Update Access on Team Membership Change `[L]`

**As the** system, **I want to** automatically update collection access when team membership changes in the source system (Azure AD), **so that** permissions stay synchronized.

**BRD Refs:** FR-COL-042


### Acceptance Criteria

```gherkin
Feature: Auto-Update Access on Team Membership Change

  Scenario: AD group membership addition detected
    Given a collection has access tied to an Azure AD group
    When a new user is added to the AD group
    Then the user is automatically added to the collection_members
    And the user is notified of their new access

  Scenario: AD group membership removal detected
    Given a user has access via an Azure AD group
    When the user is removed from the AD group
    Then the user is automatically removed from the collection_members
    And the user is notified of their access revocation

  Scenario: Sync runs periodically
    Given the system monitors Azure AD group memberships
    Then membership changes are detected and applied within the sync interval
```

---

## 6.6 - Bulk User Assignment `[M]`

**As a** DCM, **I want to** assign users in bulk by organization or role, **so I** don't have to add users one at a time for large teams.

### Acceptance Criteria

```gherkin
Feature: Bulk User Assignment

  Scenario: Assign by organization
    Given I am assigning users to a collection
    When I select an organization from the browser
    Then the organization's user count is displayed
    And I can confirm to add all users in the organization

  Scenario: Assign by role
    Given I am assigning users to a collection
    When I select a role from the picker
    Then the user count for that role is displayed
    And I can confirm to add all users with that role

  Scenario: Preview before confirming bulk assignment
    Given I have selected users for bulk assignment
    When I review the preview
    Then the total user impact is displayed
    And I can confirm or cancel the assignment
```

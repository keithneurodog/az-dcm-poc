# Epic 11: Notification System

**Goal:** Keep all stakeholders informed of status changes, required actions, and collection updates through in-app and email notifications.

**Personas:** All

**BRD Refs:** FR-NOT-001 through FR-NOT-007, VS2-348

**Sizing Key:** S = 1-2 days | M = 3-5 days | L = 1-2 weeks | XL = 2+ weeks

---

## 11.1 - In-App Notification Center `[L]`

**As a** user, **I want an** in-app notification center showing all my notifications with unread count, filtering, and action links, **so I** stay informed without leaving the application.

**BRD Refs:** FR-NOT-006

### Acceptance Criteria

```gherkin
Feature: In-App Notification Center

  Scenario: Notification bell with unread count
    Given I am logged in
    Then the notification bell icon is visible in the header
    And it displays the count of unread notifications as a badge

  Scenario: View all notifications
    Given I click the notification bell
    Then a notification panel or page opens
    And all my notifications are listed in reverse chronological order

  Scenario: Filter notifications by type
    Given I am viewing my notifications
    When I filter by type: approvals, access changes, collection updates, system alerts
    Then only notifications of that type are displayed

  Scenario: Mark as read
    Given I have unread notifications
    When I click on a notification
    Then it is marked as read
    And the unread count decreases

  Scenario: Bulk mark as read
    Given I have multiple unread notifications
    When I click "Mark All as Read"
    Then all notifications are marked as read
    And the unread count resets to 0

  Scenario: Action links navigate to relevant items
    Given a notification is about an approval request
    When I click the action link
    Then I am navigated to the approval review interface for that request
```

---

## 11.2 - Approval Request Notifications `[M]`

**As an** Approver, **I want to** be notified (in-app + email) when new approval requests are pending in my queue, **so I can** act promptly.

**BRD Refs:** FR-NOT-001

### Acceptance Criteria

```gherkin
Feature: Approval Request Notifications

  Scenario: In-app notification on new approval request
    Given a new approval request is routed to my queue
    Then I receive an in-app notification
    And the notification includes: collection name, requesting DCM, TA, summary

  Scenario: Email notification on new approval request
    Given a new approval request is routed to my queue
    Then I receive an email notification
    And the email includes key details and a direct link to the review interface

  Scenario: Notification respects user preferences
    Given I have configured my notification preferences to "in-app only" for approvals
    Then I receive only an in-app notification
    And no email is sent
```

---

## 11.3 - Approval Decision Notifications `[M]`

**As a** requester, **I want to** be notified when approval decisions are made, **so I** know the outcome.

**BRD Refs:** FR-NOT-002

### Acceptance Criteria

```gherkin
Feature: Approval Decision Notifications

  Scenario: DCM notified of approval
    Given a TA Lead approves a collection
    Then the requesting DCM receives a notification
    And the notification includes: TA, approver name, decision (approved), comments

  Scenario: DCM notified of rejection
    Given a TA Lead rejects a collection
    Then the requesting DCM receives a notification
    And the notification includes: TA, approver name, decision (rejected), rejection reason

  Scenario: Stakeholders notified of cross-TA decisions
    Given a cross-TA collection receives a decision
    Then relevant stakeholders (other TA Leads, DCM) are notified
    And the notification includes cross-TA context
```

---

## 11.4 - Access Change Notifications `[M]`

**As a** user, **I want to** be notified when my collection access changes (granted, revoked, scope changed), **so I** understand my current permissions.

**BRD Refs:** FR-NOT-003

### Acceptance Criteria

```gherkin
Feature: Access Change Notifications

  Scenario: Access granted notification
    Given I am granted access to a collection
    Then I receive a notification explaining the access grant
    And the notification includes a link to the collection

  Scenario: Access revoked notification
    Given my access to a collection is revoked
    Then I receive a notification explaining the revocation
    And the notification includes the reason for revocation

  Scenario: Scope change notification
    Given the scope of my access changes (e.g., datasets added/removed)
    Then I receive a notification explaining what changed
    And the notification links to the affected collection
```

---

## 11.5 - Metadata Change Alert Notifications `[M]`

**As a** stakeholder, **I want to** be notified when metadata changes automatically flag studies in my collections, **so I can** take action.

**BRD Refs:** FR-NOT-004

### Acceptance Criteria

```gherkin
Feature: Metadata Change Alert Notifications

  Scenario: Auto-flag triggers notification
    Given a study in my collection is automatically flagged due to metadata change
    Then I receive a notification
    And the notification includes: which studies were flagged, the reason for flagging, and the collection affected

  Scenario: Multiple stakeholder notification
    Given a study is auto-flagged
    Then DCMs, approvers, and affected consumers are all notified
    And each receives a role-appropriate notification
```

---

## 11.6 - Configurable Notification Preferences `[M]`

**As a** user, **I want to** configure which notifications I receive and how (in-app, email, digest), **so I'm** not overwhelmed.

**BRD Refs:** FR-NOT-005

### Acceptance Criteria

```gherkin
Feature: Configurable Notification Preferences

  Scenario: Configure delivery channel per notification type
    Given I am on the notification preferences page
    When I set a notification type to "in-app only", "email only", "both", or "none"
    Then future notifications of that type respect my preference

  Scenario: Configure digest frequency
    Given I am on the notification preferences page
    When I set digest frequency to "immediate", "daily", or "weekly"
    Then notifications are batched according to my preference

  Scenario: Default preferences per role
    Given I am a new user
    Then default notification preferences are applied based on my role
    And I can modify them at any time
```

---

## 11.7 - SLA Escalation Notifications `[M]`

**As the** system, **I want to** send escalation notifications when approvals exceed defined response windows, **so that** SLAs are met.

**BRD Refs:** FR-NOT-007

### Acceptance Criteria

```gherkin
Feature: SLA Escalation Notifications

  Scenario: First reminder at SLA threshold
    Given an approval request has been pending for the configured SLA threshold
    Then a reminder notification is sent to the assigned approver

  Scenario: Escalation after extended delay
    Given the SLA threshold has been exceeded by the extended delay period
    Then an escalation notification is sent to the approver's manager

  Scenario: SLA countdown visible in queue
    Given I am viewing my approval queue
    Then each request shows the remaining time until SLA breach
    And requests nearing breach are visually highlighted
```

---

## 11.8 - Email Notification Templates `[M]`

**As the** system, **I want** branded, consistent email templates for all notification types, **so that** communications are professional and clear.

### Acceptance Criteria

```gherkin
Feature: Email Notification Templates

  Scenario: AZ-branded email template
    Given a notification email is sent
    Then it uses an AstraZeneca-branded template
    And the branding is consistent across all notification types

  Scenario: Dynamic content per notification type
    Given a notification email is generated
    Then the content is dynamically populated based on the notification type
    And relevant details (collection name, decision, timestamps) are included

  Scenario: Unsubscribe/preference link
    Given I receive a notification email
    Then it contains a link to manage my notification preferences

  Scenario: Direct action link back to Collectoid
    Given I receive a notification email about an actionable item
    Then the email contains a direct link to the relevant page in Collectoid
```

---

## 11.9 - DPO Early Notification on Collection Submission `[S]`

**As the** system, **I want to** notify DPO when a collection is submitted with intent, criteria, and user details, **so that** DPO can begin preparation early.

### Acceptance Criteria

```gherkin
Feature: DPO Early Notification

  Scenario: DPO notified on collection submission
    Given a collection's status transitions to "pending_approval"
    Then DPO receives an early notification
    And the notification includes: collection intent, criteria summary, user count, estimated scope

  Scenario: Early notification is non-blocking
    Given DPO receives the early notification
    Then the notification is informational only (not a blocking approval request)
    And it allows DPO to begin preparation in parallel with the approval process
```

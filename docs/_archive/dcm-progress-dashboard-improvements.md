# DCM Progress Dashboard Improvements Specification

**Page:** `/poc/1/dcm/progress`
**Status:** Planning Phase
**Created:** 2025-11-13
**Priority:** Medium-High

---

## Overview

This document outlines proposed improvements to the DCM Progress Dashboard page to enhance user experience, provide better visibility into collection status, and align with the zen design aesthetic established across other pages.

**IMPORTANT:** All existing functionality is being preserved and enhanced, including:
- ✅ Send Update email functionality with AD user suggestions
- ✅ Export Report functionality
- ✅ Discussion tab with comments, mentions, reactions, and blocker resolution
- ✅ All existing tabs (Overview, Datasets, Users, Timeline, Discussion)

This spec focuses on additions and enhancements, not replacements.

---

## Proposed Improvements

### 1. Help & Guidance Panel
**Priority:** HIGH | **Effort:** LOW | **Impact:** HIGH

Add a contextual help and support section similar to the publishing page.

#### Features:
- **What Each Status Means**
  - Immediate Access (green)
  - Instant Grant in Progress (blue)
  - Pending Approvals (amber)
  - Data Discovery (neutral)
  - Missing Training (blue)

- **When to Take Action**
  - Clear guidance on when DCM intervention is needed
  - Proactive vs reactive scenarios
  - Escalation paths

- **Contact Information**
  - Quick links to support teams
  - Email contacts for different issues
  - Link to help documentation

- **Common Questions FAQ**
  - "How long do approvals typically take?"
  - "Can I modify the collection after publishing?"
  - "What if a blocker isn't resolved in time?"
  - "How do I check user training status?"

#### Design Notes:
- Place after the Progress Tracking card
- Use same card styling as other pages (border-neutral-200, rounded-2xl)
- Include collapsible sections for each FAQ
- Maintain zen aesthetic with proper spacing

---

### 2. Collection Health Score Widget
**Priority:** HIGH | **Effort:** MEDIUM | **Impact:** HIGH

Add a prominent health indicator showing overall collection provisioning health.

#### Features:
- **Health Indicator Badge**
  - ✅ On Track (green): No blockers, provisioning on schedule
  - ⚠️ At Risk (amber): 1+ blockers or delays detected
  - 🚨 Blocked (red): Critical blockers preventing progress

- **Health Metrics**
  - Completion velocity (faster/slower than expected)
  - Number of active blockers
  - Days until estimated completion
  - Risk factors identified

- **Visual Elements**
  - Large, prominent badge in header
  - Color-coded status ring
  - Mini-chart showing progress trend
  - Quick summary text

- **Smart Logic**
  - Analyze unresolved blocker comments
  - Check if approval requests are overdue
  - Monitor progress velocity
  - Flag unusual delays

#### Design Notes:
- Add to header area, next to collection name
- Use gradient backgrounds matching color scheme
- Animate health changes
- Include tooltip explaining health calculation

#### Mock Data Needed:
```javascript
{
  health: "on_track" | "at_risk" | "blocked",
  score: 85, // 0-100
  trend: "improving" | "stable" | "declining",
  factors: [
    { type: "blocker", severity: "high", description: "..." },
    { type: "delay", severity: "medium", description: "..." }
  ]
}
```

---

### 3. Smart Recommendations Panel
**Priority:** MEDIUM | **Effort:** MEDIUM | **Impact:** HIGH

AI-powered widget suggesting proactive actions based on collection status.

#### Features:
- **Smart Suggestions**
  - Approval delays: "3 requests to GPT-Oncology are overdue - consider follow-up"
  - Training gaps: "12 users pending training - send reminder emails?"
  - Collection optimization: "Dataset DCODE-203 is frequently bundled with this collection"
  - Timeline concerns: "Current velocity suggests 2-day delay - consider expediting approvals"

- **Recommendation Types**
  - 🚨 Action Required (red): Critical issues needing immediate attention
  - ⚠️ Suggested Action (amber): Recommended but not critical
  - 💡 Optimization (blue): Nice-to-have improvements
  - ℹ️ Informational (neutral): FYI, no action needed

- **Interaction**
  - Clickable recommendations
  - Quick action buttons ("Send Reminder", "Follow Up", "Add Dataset")
  - Dismiss/snooze functionality
  - "Why?" tooltips explaining recommendation logic

#### Design Notes:
- Add as floating card in Overview tab, top-right position
- Use Sparkles icon for AI theme
- Gradient accent matching scheme
- Smooth slide-in animation

#### Mock Recommendation Logic:
```javascript
// Analyze collection state and generate recommendations
const recommendations = [
  {
    id: "rec1",
    type: "action_required",
    title: "Approval delays detected",
    description: "3 requests to GPT-Oncology are 2 days overdue",
    action: { label: "Send Follow-Up", onClick: () => {} },
    dismissable: false
  },
  {
    id: "rec2",
    type: "suggested",
    title: "Training reminders",
    description: "12 users still need GCP certification",
    action: { label: "Send Reminder", onClick: () => {} },
    dismissable: true
  }
]
```

---

### 4. Enhanced Timeline Visualization
**Priority:** MEDIUM | **Effort:** MEDIUM | **Impact:** MEDIUM

Upgrade timeline tab with improved visualization and contextual information.

#### Features:
- **Team Contact Information** ✅ Completed
  - Display responsible team contact for in_progress and pending milestones
  - Show team lead name, email, and Microsoft Teams channel
  - Blue info card for in_progress items
  - Amber info card for pending items
  - Only show for non-completed collections
  - Smart detection of team name from milestone text (e.g., "GPT-Oncology approvals")
  - Clickable Teams links that open channel in Microsoft Teams

- **Duration Indicators** ✅ Completed
  - Show elapsed time for completed milestones
  - Show estimated remaining time for in_progress items
  - Display wait time for pending items
  - Format: "Completed in 2 minutes" or "Est. 3 days remaining"

- **Progress Details** ✅ Completed
  - Enhanced descriptions for each milestone status
  - Completion metrics (e.g., "5 of 9 users processed")
  - Color-coded status text (green/blue/amber)
  - Time-based formatting (days/hours/minutes)

- **Interactive Elements** ✅ Completed
  - Hover for detailed timing info
  - Click contact email to open mail client
  - Click Teams channel to open Microsoft Teams
  - Tooltip showing full channel name on hover

#### Design Notes:
- Consider using a lightweight charting library (recharts, chart.js)
- Maintain zen aesthetic - avoid clutter
- Use subtle animations for transitions
- Mobile-responsive design

#### Data Structure:
```javascript
{
  milestones: [
    {
      id: "m1",
      name: "Collection published",
      startTime: Date,
      endTime: Date,
      expectedDuration: number, // minutes
      actualDuration: number,
      status: "completed" | "in_progress" | "pending",
      dependencies: ["m0"], // IDs of prerequisite milestones
      criticalPath: boolean
    }
  ]
}
```

---

### 5. Better At-a-Glance Overview
**Priority:** HIGH | **Effort:** MEDIUM | **Impact:** HIGH

Redesign overview tab with improved visual hierarchy and metrics.

#### Features:
- **Key Metrics Cards**
  - Similar to activities page complexity overview
  - 2x2 or 3-column grid layout
  - Large numbers with context
  - Trend indicators (↑↓) showing changes

- **Metrics to Display**
  - Users with access (current vs target)
  - Completion percentage with progress ring
  - Estimated time remaining
  - Active blockers count
  - Approval requests pending
  - Training completion rate

- **Visual Charts**
  - Pie/donut chart for access breakdown (20/30/40/10)
  - Mini timeline showing key milestones
  - Status distribution bar

- **Quick Actions**
  - Prominent buttons for common tasks
  - "Resolve Blockers", "Send Update", "Follow Up on Approvals"
  - Context-aware based on current status

#### Design Notes:
- Replace or augment current 2-column layout
- Use gradient backgrounds sparingly for emphasis
- Maintain consistent spacing (gap-6)
- Smooth animations on metric updates

---

### 6. Discussion Tab Enhancements
**Priority:** MEDIUM | **Effort:** MEDIUM | **Impact:** MEDIUM

**PRESERVING EXISTING:** All current discussion features remain (comments, comment types, mentions, reactions, pinning, blocker resolution). This adds enhancements on top.

Improve collaboration and usability of the discussion feature.

#### Features:
- **Filter Controls**
  - Dropdown or chip filters: "All", "Blockers", "Questions", "Updates", "Suggestions"
  - Show/hide resolved items toggle
  - Filter by author
  - Filter by date range

- **Collapsed Resolved Items**
  - Resolved blockers collapse to single line
  - "Show X resolved items" expandable section
  - Keep resolved blockers visible but de-emphasized

- **Search Functionality**
  - Search box at top of discussion tab
  - Search by keyword, author, mention, or dataset code
  - Highlight search results

- **Auto-suggest @Mentions**
  - As user types "@", show dropdown of team members
  - Pull from mock AD users list
  - Include avatar and role
  - Insert mention on click

- **Threaded Replies**
  - Allow replies to comments (optional - more complex)
  - Indent nested replies
  - Collapse/expand threads

- **Better Comment Composer**
  - Rich text formatting (optional)
  - Attach files/links
  - Emoji picker for reactions
  - Preview mode

#### Design Notes:
- Add filter bar above comment list
- Use same Sheet component for search if modal needed
- Maintain zen aesthetic - don't over-complicate
- Consider mobile UX for filters

---

### 7. Real-Time Status Indicators
**Priority:** LOW | **Effort:** MEDIUM | **Impact:** LOW

Add live update indicators throughout the dashboard.

#### Features:
- **Last Updated Timestamp**
  - "Last updated: 2 minutes ago" with clock icon
  - Auto-refresh every 30-60 seconds
  - Manual refresh button

- **Live Indicators**
  - Pulsing animation for items in progress
  - "Live" badge with subtle animation
  - Progress bars that update smoothly

- **Notification Badges**
  - Red dot for new blockers
  - Number badges for unread comments
  - Update counts on tab labels

- **Auto-refresh Logic**
  - Poll server/sessionStorage every 60s
  - Smooth transitions when data changes
  - Visual feedback during refresh

#### Design Notes:
- Use subtle animations (not distracting)
- Consider battery/performance impact of polling
- Add loading states during refresh
- Maintain scroll position on refresh

---

### 8. Smooth Animations
**Priority:** LOW | **Effort:** LOW | **Impact:** MEDIUM

Apply consistent animation patterns across the page.

#### Features:
- **Tab Switching**
  - Fade in/out content
  - Slide animations for tab change
  - Maintain scroll position per tab

- **Status Card Animations**
  - Slide-in on load
  - Stagger animations for multiple cards
  - Smooth height transitions

- **Progress Bar Transitions**
  - Animate progress changes over 500ms
  - Use ease-in-out timing
  - Pulse on significant updates

- **Modal/Dialog Animations**
  - Smooth scale + fade for dialogs
  - Backdrop blur animation
  - Sheet slide-in from side

#### Design Notes:
- Use Tailwind animate utilities where possible
- Duration: 300ms for small, 500ms for large transitions
- Timing: ease-in-out for most, ease-out for entrances
- Match animations from other pages (categories, training breakdown)

---

### 9. Export Options Enhancement
**Priority:** LOW | **Effort:** MEDIUM | **Impact:** LOW

**PRESERVING EXISTING:** The current "Export Report" button remains functional. This adds a preview modal and more format options.

Improve the "Export Report" functionality with preview and options.

#### Features:
- **Export Preview Modal**
  - Show what will be included in export
  - Checkboxes to include/exclude sections
  - Real-time preview of formatted output

- **Format Options**
  - PDF: Formatted report with charts
  - Excel: Tabular data with sheets
  - Email-ready: Plain text summary optimized for email
  - JSON: Raw data for integration

- **Customizable Sections**
  - Collection overview (always included)
  - Current status breakdown
  - Timeline and milestones
  - Discussion summary
  - Dataset list with status
  - User access breakdown

- **Branding Options**
  - Include/exclude AZ logo
  - Add custom header/footer text
  - Watermark options

#### Design Notes:
- Use Sheet component for preview modal
- Show realistic preview (not just checkboxes)
- Add "Copy to Clipboard" option for email format
- Consider using library for PDF generation (jsPDF, react-pdf)

---

### 10. Quick Actions Sidebar
**Priority:** LOW | **Effort:** MEDIUM | **Impact:** MEDIUM

Add a sticky sidebar with prioritized actions and shortcuts.

#### Features:
- **Most Important Next Actions**
  - Dynamic list based on current status
  - "Resolve 2 blockers", "Follow up on GPT approval"
  - "Email 12 users pending training"
  - "Follow up on 5 overdue approvals"
  - Prioritized by urgency/impact

- **Quick Links**
  - Jump to specific blockers in discussion
  - Navigate to delayed approvals
  - View users pending training (opens User Status tab with filter)
  - Email users by status/training category
  - Edit collection details

- **Contact Stakeholders**
  - Quick email links to governance teams
  - "Email GPT-Oncology", "Contact Data Steward"
  - Opens existing "Send Update" modal with pre-filled recipients

- **Status Summary**
  - Mini version of key metrics
  - Always visible while scrolling
  - Updates in real-time

#### Design Notes:
- Position on right side, sticky top-8
- Similar to activities page ETA panel
- Width: w-64 or w-72
- Collapse on smaller screens
- Show/hide toggle button

#### Layout:
```
┌─────────────────────┬────────────┐
│                     │  Quick     │
│   Main Content      │  Actions   │
│   (Tabs)            │  Sidebar   │
│                     │  (Sticky)  │
└─────────────────────┴────────────┘
```

---

### 11. User Status Panel Enhancement
**Priority:** HIGH | **Effort:** HIGH | **Impact:** HIGH

Transform the basic 4-block status view into a comprehensive user management interface with search, filtering, training tracking, and communication features.

#### Current State:
- Simple 4-block summary (Immediate Access, Instant Grant, Pending Approval, Missing Training)
- No user-level details or drill-down
- No search or filtering capability
- No direct communication features
- Static display only

#### Features:

**1. Summary Metrics Cards**
- 2x3 grid layout similar to Dataset Status tab
- Total Users (120)
- Immediate Access (60) - Green card
- In Progress (48) - Blue card
- Pending Approval (108) - Amber card
- Training Blocked (12) - Red card
- Average Days Waiting

**2. Searchable & Filterable User Table**
- **Columns:**
  - Name (sortable)
  - Email
  - Role/Department
  - Manager
  - Access Status (badge with RAG colors)
  - Training Progress (progress bar)
  - Days Waiting (sortable)
  - Last Activity

- **Filters:**
  - Access Status dropdown: All, Immediate Access, Instant Grant, Pending Approval, Training Blocked
  - Training Status: Complete, In Progress, Blocked, Overdue
  - Search by name or email (real-time filter)
  - Sort by: Name, Days Waiting, Training Progress

- **Design:**
  - Compact table with hover states (matching Dataset Status tab)
  - Expandable rows for user details (smooth animation)
  - Pagination footer if 50+ users
  - "Showing X of Y users" counter
  - Mobile-responsive (stack on small screens)

**3. Training Status Visualization**
- **Per-User Training Display:**
  - Progress bar showing completion percentage (e.g., "2/3 certifications")
  - Hover tooltip showing required vs. completed courses
  - Color-coded:
    - Green: All complete (100%)
    - Blue: In progress (1-99%)
    - Red: Overdue or blocking access
  - Missing certifications highlighted in tooltip:
    - "Missing: GCP, GDPR Training"
    - "Deadline: Dec 15, 2025"

- **Training Breakdown Badge:**
  - Small badge next to progress bar
  - Shows missing count: "2 missing"
  - Click to expand inline detail

**4. User Detail Drill-Down (Expandable Row)**
When user clicks on a row, expand inline to show:
- **Access Details:**
  - List of datasets accessible (with codes)
  - List of datasets pending approval (with team names)
  - Approval requests status: "Sent to GPT-Oncology 3 days ago"

- **Training Details:**
  - Table of certifications:
    - ✓ GCP Certified (Completed: Nov 1, 2025)
    - ⏳ GDPR Training (In Progress: 60%)
    - ✗ Immuta Basics (Not Started - Deadline: Dec 15)
  - Link to training portal (external)

- **Timeline:**
  - Mini timeline showing key events for this user:
    - Enrolled: Nov 10, 2025
    - Instant grant started: Nov 11, 2025
    - Training reminder sent: Nov 12, 2025

- **Quick Actions:**
  - "Email User" button
  - "Send Training Reminder" button
  - "Escalate Issue" button (opens discussion tab)

**5. Bulk Communication Actions**
Similar to "Send Update" button pattern:

- **"Email Selected Users" Button:**
  - Appears when users select checkboxes in table
  - Opens modal similar to "Send Update" with:
    - To: Selected user emails (chip display)
    - Cc: Optional field with manager suggestions
    - Subject: Pre-filled templates dropdown:
      - "Training Reminder: Complete Required Certifications"
      - "Access Update: Your Collection is Ready"
      - "Approval Status: Action Required"
      - Custom (editable)
    - Message: Template text (editable)
    - "Include Managers" checkbox
      - When checked, auto-adds managers to Cc field
      - Shows "Adding 3 managers" helper text

- **"Send Training Reminder" Quick Action:**
  - Dedicated button for training-blocked users
  - Pre-filtered to users with missing training
  - Modal auto-populates with:
    - To: All training-blocked users
    - Cc: Their managers (optional)
    - Subject: "Action Required: Complete Training to Access [Collection Name]"
    - Message: Template listing missing certifications and deadlines
    - "Track Reminder" - logs when reminder was sent to prevent spam

- **Reminder Tracking:**
  - Show "Last reminder: 2 days ago" in user row
  - Disable "Send Reminder" if sent within 24 hours
  - Toast notification: "Training reminder sent to 12 users"

**6. Manager Integration**
- **Display:**
  - Manager name shown in user row (if available)
  - Tooltip on hover: "Manager: John Smith (john.smith@az.com)"

- **Include in Communications:**
  - Optional "Include Managers" checkbox in email modal
  - When checked:
    - Auto-adds unique manager emails to Cc field
    - Shows count: "Adding 3 managers"
    - Managers receive FYI copy of communication

- **Manager Contact:**
  - "Email Manager" quick action in expanded user detail
  - Pre-fills manager email for escalations

**7. Status Badge Consistency**
- Use RAG (Red-Amber-Green) highlighting matching main dashboard
- Status badges:
  - Immediate Access: `bg-green-50 text-green-700 border-green-200`
  - Instant Grant: `bg-blue-50 text-blue-700 border-blue-200`
  - Pending Approval: `bg-amber-50 text-amber-700 border-amber-200`
  - Training Blocked: `bg-red-50 text-red-700 border-red-200`

#### Mock Data Structure:

```typescript
interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  manager?: {
    name: string
    email: string
  }

  // Access status
  accessStatus: "immediate" | "instant_grant" | "pending_approval" | "blocked_training"
  datasetsAccessible: string[]      // Dataset codes user can access
  datasetsPending: string[]         // Dataset codes awaiting approval

  // Training
  trainingStatus: {
    required: string[]              // ["GCP", "GDPR Training", "Immuta Basics"]
    completed: string[]             // ["GCP"]
    inProgress: Array<{             // [{ cert: "GDPR Training", progress: 60 }]
      cert: string
      progress: number
    }>
    missing: string[]               // ["Immuta Basics"]
    completionPercent: number       // 33 (1 of 3 complete)
    deadline?: Date
    isOverdue: boolean
  }

  // Timeline
  enrollmentDate: Date
  lastActive?: Date
  daysWaiting: number

  // Communication tracking
  lastReminderSent?: Date
  reminderCount: number

  // Approval tracking
  approvalRequests: Array<{
    team: string                    // "GPT-Oncology"
    datasetCodes: string[]
    requestedDate: Date
    status: "pending" | "approved" | "rejected"
  }>
}
```

#### Design Notes:
- Maintain zen aesthetic: single-pixel borders, light shadows, font-light
- Reuse table styling from Dataset Status tab (proven scalable)
- Smooth animations for expand/collapse (duration-300)
- Use same modal component as "Send Update" for consistency
- Mobile: Stack table into card layout
- Empty states: "No users match your filters"
- Loading states: Skeleton rows while fetching data

#### Integration Points:
- **Smart Recommendations:** Link "12 users pending training" recommendation to this tab with filter pre-applied
- **Help & Guidance:** Link FAQ "How do I check user training status?" to this tab
- **Export Report:** Existing top-right button includes user list with status in export
- **Quick Actions Sidebar:** Add "View users pending training" link that opens this tab

#### Success Metrics:
- DCMs can identify specific users in each status category
- DCMs can contact users directly for training reminders
- DCMs can track which users need follow-up
- Panel remains performant with 100+ users
- Communication tracking prevents reminder spam

---

## Implementation Priority

### Phase 1 - Quick Wins (1-2 days)
1. Help & Guidance Panel
2. Smooth Animations
3. Discussion Tab Enhancements (filters only)

### Phase 2 - High Impact (2-3 days)
1. Collection Health Score Widget
2. Better At-a-Glance Overview
3. Smart Recommendations Panel

### Phase 3 - Advanced Features (4-6 days)
1. User Status Panel Enhancement
2. Enhanced Timeline Visualization
3. Real-Time Status Indicators
4. Quick Actions Sidebar

### Phase 4 - Nice-to-Haves (as time permits)
1. Export Options Enhancement
2. Discussion threaded replies
3. Advanced search

---

## Design Consistency Checklist

Ensure all improvements maintain the zen design system:

- [ ] Single-pixel borders (`border` not `border-2`) except for emphasized elements
- [ ] Consistent spacing (gap-6 for cards, gap-4 for content)
- [ ] Font weights: font-extralight for headers, font-light for body, font-normal for emphasis
- [ ] Rounded corners: rounded-xl for cards, rounded-2xl for major containers
- [ ] Color scheme integration throughout
- [ ] Smooth animations (300-500ms duration)
- [ ] Proper hover states on interactive elements
- [ ] Accessible color contrast
- [ ] Mobile-responsive design

---

## Technical Considerations

### Data Structure Updates
May need to extend mock data to support:
- Health score calculation
- Recommendation engine logic
- Milestone dependencies
- Historical trend data

### Performance
- Consider pagination for large discussion threads
- Lazy load timeline charts
- Debounce search inputs
- Optimize re-renders with React.memo

### Accessibility
- ARIA labels for all interactive elements
- Keyboard navigation for filters and tabs
- Screen reader announcements for status changes
- Focus management in modals

---

## Testing Scenarios

1. **Collection with no blockers** - Should show "On Track" health
2. **Collection with critical blockers** - Should highlight in red, show recommendations
3. **Long discussion thread (20+ comments)** - Test filtering and search
4. **Multiple approval delays** - Test smart recommendations
5. **Mobile viewport** - Test responsive design
6. **Tab switching** - Test smooth animations and scroll position
7. **Real-time updates** - Test auto-refresh behavior

---

## Success Metrics

- User spends less time looking for blocker information
- Reduced time to identify and resolve issues
- Higher engagement with discussion features
- Faster approval follow-ups
- Improved DCM satisfaction scores

---

## Notes

- Consider user feedback after Phase 1 before proceeding to Phase 2
- Some features (like real-time updates) may require backend changes
- Keep mobile UX in mind throughout implementation
- Maintain consistency with improvements on other pages (categories, activities, etc.)
- Document any new mock data structures in `lib/dcm-mock-data.ts`

---

## Implementation Progress

### Phase 1 - Quick Wins
- [x] 1.1: Help & Guidance Panel ✅ Completed
- [x] 1.2: Smooth Animations ✅ Completed
- [x] 1.3: Discussion Tab Enhancements (filters only) ✅ Completed

### Phase 2 - High Impact
- [x] 2.1: Collection Health Score Widget ✅ Completed
- [x] 2.2: Better At-a-Glance Overview ✅ Skipped (current design is sufficient)
- [x] 2.3: Smart Recommendations Panel ✅ Completed

### Phase 3 - Advanced Features
- [x] 3.1: User Status Panel Enhancement ✅ Completed (Core Features)
- [x] 3.2: Enhanced Timeline Visualization ✅ Completed
- [ ] 3.3: Real-Time Status Indicators
- [x] 3.4: Quick Actions Sidebar ✅ Completed

**Note:** Phase 3.1 core features completed include:
- Summary metrics cards (2x3 grid with Total, Immediate, In Progress, Pending, Blocked, Avg Days Waiting)
- Searchable user table with real-time filtering
- Filter buttons for all user statuses
- Training progress visualization with color-coded bars
- Expandable user detail rows showing access details, training status, timeline, and quick actions
- Manager display in table
- User icons and chevron indicators

**Pending features for Phase 3.1:**
- Bulk communication actions (Email Selected Users with checkboxes)
- Send Training Reminder functionality
- Include Managers checkbox in email modal
- Integration with Smart Recommendations panel

**Phase 3.2 completed features:**
- Team contact information cards for in_progress and pending milestones
- Clickable email links that open mail client
- Clickable Microsoft Teams channel links (opens Teams in new tab)
- Duration indicators for completed milestones (e.g., "Completed in 1 hour")
- Progress details for in_progress milestones with user counts (e.g., "Processing policies: 5 of 9 users")
- Estimated remaining time for in_progress tasks
- Estimated start time for pending tasks
- Color-coded status messages (green for completed, blue for in_progress, amber for pending)
- Smart team detection from milestone names (GPT-Oncology, TALT-Legal, Immuta Platform, etc.)
- Teams integration with deep links to channels

**Phase 3.4 completed features:**
- Sticky sidebar positioned on right side (width: 288px / w-72)
- Quick Summary card with key metrics (progress %, users with access, datasets, pending approvals)
- Dynamic Next Actions based on collection state:
  - High priority (red): Blockers to resolve
  - Medium priority (amber): Approvals to follow up, training-blocked users to contact
  - Shows "No urgent actions required" when nothing pending
- Contact Teams section (appears when approval requests exist):
  - Quick email links to team leads
  - Microsoft Teams deep links to channels
  - Displays all teams with pending approvals
- Quick Links for navigation:
  - Jump to Dataset Status tab
  - Jump to User Status tab
  - Jump to Timeline tab
  - Open Send Update modal
- Responsive design: Sidebar stays sticky while scrolling
- Zen aesthetic maintained: single-pixel borders, font-light, rounded-2xl cards

### Phase 4 - Nice-to-Haves
- [ ] 4.1: Export Options Enhancement
- [ ] 4.2: Discussion threaded replies
- [ ] 4.3: Advanced search

---

## Related Files

- Implementation: `/app/poc/1/dcm/progress/page.tsx`
- Mock data: `/lib/dcm-mock-data.ts`
- Related docs:
  - `/docs/collectoid-poc-requirements.md`
  - `/docs/dcm-workflow-learnings.md`

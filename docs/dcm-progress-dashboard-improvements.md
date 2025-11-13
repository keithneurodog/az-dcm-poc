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
**Priority:** MEDIUM | **Effort:** HIGH | **Impact:** MEDIUM

Upgrade timeline tab with advanced visualization features.

#### Features:
- **Gantt Chart View**
  - Horizontal bars showing task duration
  - Parallel processes displayed simultaneously
  - Dependencies shown with connecting lines
  - Current time indicator

- **Critical Path Highlighting**
  - Bold/highlighted items on critical path
  - Show which tasks are blocking others
  - Identify bottlenecks visually

- **Expected vs Actual**
  - Dual-bar view: planned duration vs actual
  - Red/green indicators for ahead/behind schedule
  - Variance annotations

- **Interactive Elements**
  - Hover for detailed timing info
  - Click to see task dependencies
  - Drag to adjust estimates (planning mode)

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
  - Prioritized by urgency/impact

- **Quick Links**
  - Jump to specific blockers in discussion
  - Navigate to delayed approvals
  - View users pending training
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

## Implementation Priority

### Phase 1 - Quick Wins (1-2 days)
1. Help & Guidance Panel
2. Smooth Animations
3. Discussion Tab Enhancements (filters only)

### Phase 2 - High Impact (2-3 days)
1. Collection Health Score Widget
2. Better At-a-Glance Overview
3. Smart Recommendations Panel

### Phase 3 - Advanced Features (3-5 days)
1. Enhanced Timeline Visualization
2. Real-Time Status Indicators
3. Quick Actions Sidebar

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

## Related Files

- Implementation: `/app/poc/1/dcm/progress/page.tsx`
- Mock data: `/lib/dcm-mock-data.ts`
- Related docs:
  - `/docs/collectoid-poc-requirements.md`
  - `/docs/dcm-workflow-learnings.md`

# End User Request Dashboard Specification

## Overview

Transform the `/collectoid/requests/[id]` page from a simple confirmation screen into a comprehensive **Request Dashboard** that serves as the end user's central hub for tracking their data access requests.

### Current State Problems
- Current page is just a confirmation/receipt screen
- Only shows a single collection
- No ongoing visibility into request progress
- No way to communicate with DCM
- No help/support options
- No DCM contact information

### Target State
A full-featured dashboard matching the quality of `/collectoid/dcm/progress` but from the **end user's perspective**, supporting:
- Multiple collections and standalone datasets in a single request
- Real-time status tracking
- Two-way communication with DCM
- Self-service help and support
- Clear understanding of what's available now vs pending

---

## Data Model

### Request Structure
```typescript
interface UserRequest {
  id: string                          // e.g., "req-123456"
  status: "submitted" | "in_progress" | "partial_access" | "completed" | "rejected"
  submittedAt: Date
  updatedAt: Date

  // Requested items (can be multiple)
  collections: RequestedCollection[]
  standaloneDatasets: RequestedDataset[]

  // Overall access summary
  accessSummary: {
    totalDatasets: number
    instantAccess: number             // Available now
    pendingApproval: number           // Waiting on DCM/governance
    approved: number                  // Approved, provisioning
    rejected: number                  // Denied
  }

  // DCM assignment
  dcmContact: {
    name: string
    email: string
    role: string
    team: string
    avatar?: string
  }

  // Communication
  discussion: DiscussionMessage[]

  // Timeline
  timeline: TimelineEvent[]
}

interface RequestedCollection {
  id: string
  name: string
  datasetCount: number
  status: "pending_review" | "approved" | "partial" | "rejected" | "provisioning" | "complete"
  approvalStatus?: {
    team: string
    status: "pending" | "approved" | "rejected"
    decidedAt?: Date
    decidedBy?: string
    notes?: string
  }[]
  accessibleDatasets: number          // How many user can access now
  pendingDatasets: number
  rejectedDatasets: number
  intents: string[]                   // ML, Publish, etc.
}

interface RequestedDataset {
  code: string
  name: string
  status: "accessible" | "pending" | "approved" | "rejected"
  accessPlatform?: string             // Where to access it
  approvalTeam?: string
  notes?: string
}

interface DiscussionMessage {
  id: string
  author: { name: string; role: string; isUser: boolean }
  content: string
  timestamp: Date
  type: "message" | "status_update" | "question" | "resolution"
}

interface TimelineEvent {
  id: string
  event: string
  timestamp: Date
  status: "completed" | "in_progress" | "pending"
  details?: string
}
```

---

## Page Layout

### Structure
```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to My Requests                                           │
│                                                                 │
│ [Request Title/Name]                                            │
│ Request ID: REQ-123456 • Submitted 2 hours ago • Status Badge   │
│ Your DCM Contact: Jennifer Martinez (GPT-Oncology)              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ YOUR ACCESS SUMMARY                                         │ │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ │
│ │                                                             │ │
│ │ [Progress Ring]   16 datasets • 2 collections               │ │
│ │     68%          ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │ │
│ │   accessible     [green][blue][amber][grey]                 │ │
│ │                  8 instant • 3 approved • 4 pending • 1 n/a │ │
│ │                                                             │ │
│ │ ⚡ 8 datasets available now    [Access Data →]              │ │
│ │ ⏳ Estimated full access: 2-3 business days                 │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ [Tabs: Collections | Datasets | Discussion | Help]              │
│                                                                 │
│ ┌───────────────────────────────┐ ┌───────────────────────────┐ │
│ │ COLLECTIONS TAB               │ │ SIDEBAR                   │ │
│ │                               │ │                           │ │
│ │ Collection 1 Card             │ │ DCM Contact Card          │ │
│ │ - Status badge                │ │ - Photo/Avatar            │ │
│ │ - Dataset breakdown           │ │ - Name & Role             │ │
│ │ - Approval progress           │ │ - Email button            │ │
│ │ - Access now button           │ │ - Response time           │ │
│ │                               │ │                           │ │
│ │ Collection 2 Card             │ │ Quick Actions             │ │
│ │ - ...                         │ │ - Send message            │ │
│ │                               │ │ - Request call            │ │
│ │ Standalone Datasets           │ │ - Modify request          │ │
│ │ - Table of individual items   │ │                           │ │
│ │                               │ │ Need Help?                │ │
│ │                               │ │ - FAQ link                │ │
│ │                               │ │ - Documentation           │ │
│ │                               │ │ - Support ticket          │ │
│ └───────────────────────────────┘ └───────────────────────────┘ │
│                                                                 │
│ DISCUSSION TAB                                                  │
│ - Thread with DCM                                               │
│ - Status updates auto-posted                                    │
│ - User can ask questions                                        │
│                                                                 │
│ HELP TAB                                                        │
│ - Common questions                                              │
│ - How approvals work                                            │
│ - How to access data                                            │
│ - Contact support                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Specifications

### 1. Header Section

**Elements:**
- Back button → `/collectoid/my-requests`
- Request title (generated from collections/datasets)
- Request ID with copy button
- Submission timestamp (relative: "2 hours ago")
- Status badge: Submitted | In Progress | Partial Access | Complete | Rejected
- DCM contact quick reference

**Styling:**
- `text-3xl font-extralight text-neutral-900 tracking-tight` for title
- Back button: `variant="ghost" rounded-full font-light`
- Zen styling throughout (strokeWidth={1.5} on icons)

### 2. Access Summary Card (Hero)

**Purpose:** Give user immediate understanding of what they can access

**Elements:**
- Circular progress indicator (percentage accessible)
- Total datasets and collections count
- Visual breakdown bar:
  - Green: Instant access (available now)
  - Blue/Theme: Approved (provisioning)
  - Amber: Pending approval
  - Grey: Not available / rejected
- Legend with counts
- Primary CTA: "Access Data" button (opens platform links)
- Estimated time to full access

**Styling:**
- Card with theme border: `border-2 rounded-2xl` with scheme colors
- Progress ring similar to DCM progress page health score
- Gradient CTA button

### 3. Tabs System

**Tabs:**
1. **Collections** (default) - Shows all requested collections
2. **Datasets** - Flat table of all datasets across all collections
3. **Discussion** - Communication thread with DCM
4. **Help** - Self-service support

**Styling:**
- Tab buttons: `rounded-xl border-2 font-light`
- Active state: gradient background with scheme colors
- Badges for unread messages in Discussion tab

### 4. Collections Tab

**For each collection card:**
- Collection name and description
- Status badge (Pending Review | Approved | Partial | Complete)
- Dataset breakdown:
  - X accessible now
  - X approved, provisioning
  - X pending approval
  - X not available
- Visual progress bar
- Approval workflow status (which teams have approved)
- Intents badges (ML, Publish, etc.)
- "Access Available Data" button (if any accessible)
- "View Details" expandable section

**Standalone Datasets Section:**
- Table showing datasets not in any collection
- Columns: Code, Name, Status, Platform, Actions
- Status badges: Accessible | Pending | Approved | Rejected

### 5. Datasets Tab

**Full table of all datasets:**
- Filterable by status
- Searchable by code/name
- Columns:
  - Checkbox (for bulk actions)
  - Code (badge)
  - Name
  - Collection (or "Standalone")
  - Status
  - Platform (if accessible)
  - Actions
- Pagination

### 6. Discussion Tab

**Thread-based communication:**
- Messages from user and DCM
- Auto-posted status updates (system messages)
- Compose new message area
- Mention support for tagging DCM
- Message types: Question | Update | Resolution

**Styling:**
- Chat bubble style, similar to DCM progress discussion
- User messages aligned right
- DCM/system messages aligned left
- Timestamps relative

### 7. Help Tab

**Self-service support:**
- FAQ accordion:
  - "How long do approvals take?"
  - "How do I access my data?"
  - "Can I modify my request?"
  - "What if my request is rejected?"
- Links to documentation
- Contact support button
- Request a call with DCM option

### 8. Sidebar (Right Column)

**DCM Contact Card:**
- Avatar/initials
- Name and role
- Team (e.g., "GPT-Oncology")
- Email button
- "Typical response: within 24 hours"

**Quick Actions:**
- Send Message (opens discussion)
- Request Video Call
- Modify Request (if allowed)
- Cancel Request

**Platform Access:**
- List of platforms with available data
- Direct links to each platform

---

## Mock Data

```typescript
const MOCK_USER_REQUEST = {
  id: "req-123456",
  status: "partial_access",
  submittedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  updatedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago

  collections: [
    {
      id: "col-1",
      name: "Oncology ctDNA Outcomes Collection",
      datasetCount: 12,
      status: "partial",
      accessibleDatasets: 6,
      pendingDatasets: 4,
      rejectedDatasets: 2,
      intents: ["ML/AI Research", "Publication"],
      approvalStatus: [
        { team: "GPT-Oncology", status: "approved", decidedAt: new Date(Date.now() - 1000 * 60 * 60), decidedBy: "Dr. Sarah Martinez" },
        { team: "TALT-Legal", status: "pending" },
      ],
    },
    {
      id: "col-2",
      name: "Immunotherapy Response Studies",
      datasetCount: 4,
      status: "pending_review",
      accessibleDatasets: 2,
      pendingDatasets: 2,
      rejectedDatasets: 0,
      intents: ["ML/AI Research"],
      approvalStatus: [
        { team: "GPT-Oncology", status: "pending" },
      ],
    },
  ],

  standaloneDatasets: [
    { code: "DCODE-299", name: "ctDNA Longitudinal Substudy", status: "accessible", accessPlatform: "Domino Data Lab" },
    { code: "DCODE-334", name: "NSCLC Biomarker Analysis", status: "pending", approvalTeam: "GPT-Oncology" },
  ],

  accessSummary: {
    totalDatasets: 18,
    instantAccess: 8,
    pendingApproval: 6,
    approved: 3,
    rejected: 1,
  },

  dcmContact: {
    name: "Jennifer Martinez",
    email: "jennifer.martinez@astrazeneca.com",
    role: "Data Collection Manager",
    team: "GPT-Oncology",
  },

  discussion: [
    {
      id: "msg-1",
      author: { name: "System", role: "Collectoid", isUser: false },
      content: "Request submitted successfully. Jennifer Martinez has been assigned as your DCM contact.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      type: "status_update",
    },
    {
      id: "msg-2",
      author: { name: "Jennifer Martinez", role: "Data Collection Manager", isUser: false },
      content: "Hi! I've reviewed your request. 8 datasets are now accessible. I'm working on the remaining approvals - GPT-Oncology has approved, waiting on TALT-Legal.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      type: "message",
    },
    {
      id: "msg-3",
      author: { name: "You", role: "Researcher", isUser: true },
      content: "Thanks Jennifer! Is there anything I can do to speed up the TALT-Legal approval?",
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: "question",
    },
  ],

  timeline: [
    { id: "t1", event: "Request submitted", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: "completed" },
    { id: "t2", event: "DCM assigned", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), status: "completed" },
    { id: "t3", event: "8 datasets: Instant access granted", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5), status: "completed" },
    { id: "t4", event: "GPT-Oncology approval received", timestamp: new Date(Date.now() - 1000 * 60 * 60), status: "completed" },
    { id: "t5", event: "TALT-Legal review", timestamp: new Date(), status: "in_progress", details: "Estimated 1-2 business days" },
    { id: "t6", event: "Full access granted", timestamp: new Date(), status: "pending" },
  ],

  platforms: [
    { name: "Domino Data Lab", url: "#", datasetCount: 6 },
    { name: "SCP Platform", url: "#", datasetCount: 2 },
  ],
}
```

---

## Implementation Steps

### Phase 1: Core Structure
1. Create mock data with multi-collection support
2. Build page layout with header and access summary card
3. Implement tab navigation system
4. Add basic Collections tab with collection cards

### Phase 2: Dataset Management
1. Build standalone datasets table
2. Create full Datasets tab with filtering/search
3. Add status badges and platform links
4. Implement "Access Data" actions

### Phase 3: Communication
1. Build Discussion tab with thread view
2. Add message composer
3. Implement system status update messages
4. Add DCM contact sidebar card

### Phase 4: Help & Support
1. Create Help tab with FAQ accordion
2. Add documentation links
3. Build quick actions sidebar
4. Add "Request Call" functionality

### Phase 5: Polish
1. Add loading states
2. Implement animations (fade-in, transitions)
3. Ensure responsive design
4. Match zen styling throughout (strokeWidth={1.5}, font-light, rounded-2xl)

---

## Styling Guidelines

Follow the established zen theme from DCM progress page:

- **Typography:**
  - Headings: `font-extralight` or `font-light`
  - Body: `font-light`
  - Labels: `text-xs font-light text-neutral-500 uppercase tracking-wider`

- **Cards:**
  - `border-neutral-200 rounded-2xl overflow-hidden`
  - Theme-highlighted cards: `border-2` with `scheme.from` color

- **Icons:**
  - Always use `strokeWidth={1.5}` for lighter feel
  - Size: `size-4` for inline, `size-5` for featured

- **Buttons:**
  - Primary: `rounded-full font-light bg-gradient-to-r` with scheme colors
  - Secondary: `rounded-full font-light border-neutral-200`
  - Ghost: `rounded-full font-light`

- **Badges:**
  - Status badges with appropriate colors
  - `font-light text-xs`

- **Color Usage:**
  - Green: Accessible/Complete/Success
  - Blue/Theme: Approved/In Progress
  - Amber: Pending/Warning
  - Red: Rejected/Error
  - Grey: Not available/Disabled

---

## Files to Create/Modify

1. **Modify:** `app/collectoid/requests/[id]/page.tsx` - Complete rewrite
2. **Consider:** May need to update navigation/routing if request list page exists

---

## Success Criteria

1. User can see all collections and datasets in their request at a glance
2. Clear visual indication of what's accessible now vs pending
3. User can communicate with DCM directly from the page
4. User can access self-service help without contacting support
5. User knows who their DCM contact is and how to reach them
6. Page matches the visual quality of DCM progress page
7. Consistent zen styling throughout

# Collections Browser Specification

## Overview
The Collections Browser is a comprehensive, searchable catalog of all data collections in the DCM system. It serves as the central hub for collection discovery, access management, and analytics.

## URL Structure
- `/poc/1/collections` - All collections browser (main page)
- `/poc/1/collections?filter=mine` - My collections only
- `/poc/1/collections?search=oncology` - Pre-filtered search

## Core Responsibilities

### 1. Discovery & Search
- **Full-text search** across collection names, descriptions, datasets, and owners
- **Real-time filtering** as user types
- **Persistent filters** that work together (AND logic)

### 2. Filtering System
Left sidebar filters:
- **Status**: Provisioning, Completed, Pending Approval (multi-select)
- **Therapeutic Area**: Oncology, Cardio, Immunology, etc. (multi-select)
- **Owner**: Filter by creator/owner
- **Access Level**: My Collections, Shared with Me, Public, Restricted
- **Date Range**: Created/Modified date pickers
- **User Count**: Slider or range input
- **Dataset Filter**: Search by DCODE

### 3. View Options
- **Grid View**: Collection cards with rich previews
- **List View**: Compact table rows for bulk scanning
- **Sort Options**: Recent, Alphabetical, Most Users, Completion %

### 4. Collection Cards (Grid View)
Each card displays:
- Collection name (clickable to progress page)
- Description (truncated, 2 lines max)
- Owner name and avatar
- Created date
- Progress bar with percentage
- Status badge (color-coded)
- User count badge
- Dataset count + preview (first 3 DCODEs with "+X more")
- Access indicator: "Member", "Request Access", "Public"
- Discussion badge (comment count if > 0)
- Quick actions menu (3-dot dropdown)

### 5. List View
Compact table with columns:
- Name | Owner | Status | Progress | Users | Datasets | Created | Actions

### 6. Quick Actions (per collection)
- View Details (navigate to progress page)
- Request Access (if not a member)
- Star/Favorite
- Fork Collection
- Use as Template
- Share Link
- Export Metadata

### 7. Global Actions (Header)
- Create New Collection (primary CTA)
- View Toggle (Grid/List)
- Filter Panel Toggle (mobile)
- Export All (CSV/JSON)

### 8. Empty States
- No collections found: Show helpful message with clear filters button
- No search results: Suggest removing filters or different search terms
- First time user: Onboarding message with "Create Your First Collection" CTA

### 9. Access Control Indicators
Visual badges for:
- ✅ **Member** - You have access (green)
- 🔐 **Request Access** - Not a member, can request (amber)
- 🌐 **Public** - Open to all (blue)
- 🔒 **Restricted** - Requires special approval (red)

### 10. Additional Features

#### Favoriting
- Star icon on each card
- Starred collections appear first in results
- "My Favorites" quick filter

#### Collection Intelligence
- "Similar Collections" based on dataset overlap
- "Frequently bundled with" suggestions
- Usage analytics: active users, data access patterns

#### Bulk Operations
- Multi-select checkbox on cards
- Bulk actions: Compare, Request Access, Export

## UI Layout

```
┌─────────────────────────────────────────────────────────────┐
│ Header: Search Bar | View Toggle | Create Collection        │
├─────────┬───────────────────────────────────────────────────┤
│ Filters │ Results Header (X collections)                    │
│ ─────── │ Sort: [Recent ▼]  View: [Grid] [List]            │
│ Status  │ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│ □ Prov. │ │ Card 1  │ │ Card 2  │ │ Card 3  │             │
│ □ Compl.│ │ Name    │ │ Name    │ │ Name    │             │
│         │ │ Owner   │ │ Owner   │ │ Owner   │             │
│ T. Area │ │ Progress│ │ Progress│ │ Progress│             │
│ □ Onc   │ │ Status  │ │ Status  │ │ Status  │             │
│ □ Card  │ └─────────┘ └─────────┘ └─────────┘             │
│         │                                                   │
│ Owner   │ ┌─────────┐ ┌─────────┐ ┌─────────┐             │
│ [All]   │ │ Card 4  │ │ Card 5  │ │ Card 6  │             │
│         │ └─────────┘ └─────────┘ └─────────┘             │
│ Access  │                                                   │
│ ○ All   │                                                   │
│ ○ Mine  │ Pagination: ← 1 2 3 4 5 →                        │
└─────────┴───────────────────────────────────────────────────┘
```

## User Flows

### Flow 1: Discover Collections
1. User navigates to Collections Browser
2. Sees all collections by default
3. Uses search to find "oncology"
4. Applies filter for "My Collections"
5. Clicks on a collection card
6. Navigates to progress/detail page

### Flow 2: Request Access
1. User finds restricted collection
2. Sees "Request Access" badge
3. Clicks quick action menu
4. Selects "Request Access"
5. Modal opens with justification field
6. Submits request
7. Collection card updates to "Access Requested"

### Flow 3: Create from Template
1. User finds relevant collection
2. Opens quick actions menu
3. Selects "Use as Template"
4. Navigates to create flow with pre-populated datasets
5. Modifies and creates new collection

## Technical Implementation

### State Management
```typescript
interface BrowserState {
  collections: Collection[]
  searchQuery: string
  filters: {
    status: string[]
    therapeuticArea: string[]
    owner: string
    accessLevel: "all" | "mine" | "shared" | "public"
  }
  sortBy: "recent" | "name" | "users" | "progress"
  viewMode: "grid" | "list"
  favorites: string[] // collection IDs
}
```

### Filtering Logic
- Search: Filter by name, description, datasets.code, datasets.name, createdBy
- Combine filters with AND logic
- Apply sort after filtering
- Paginate results (20 per page initially)

### Performance Considerations
- Virtualize list for large result sets
- Debounce search input (300ms)
- Lazy load collection details on card hover
- Cache filter combinations

## Analytics & Tracking
Track user behavior:
- Most used filters
- Most viewed collections
- Search terms that return no results
- Collections with high access request rate

## Future Enhancements
- Advanced analytics dashboard
- Collection comparison tool (side-by-side)
- Automated recommendations based on user role
- Integration with data governance workflows
- Real-time collaboration indicators
- Collection versioning and history

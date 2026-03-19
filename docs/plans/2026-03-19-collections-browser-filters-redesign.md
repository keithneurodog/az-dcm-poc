# Collections Browser Sidebar Filters Redesign

## Problem

The current sidebar filters in variation-1 are cluttered, poorly structured, and mix concerns across user types without clear separation. There are 6 filter cards with overlapping concepts, inconsistent styling, and dead workspace-mode code.

## Design

Replace all sidebar filter cards with 6 well-separated panels, organised by user type so panels can be shown/hidden per role later.

### Universal Panels (all users)

**Panel 1: Scope** (radio group)
- All Collections (default)
- My Collections (created by current user)
- Recent (recently viewed/interacted with)

**Panel 2: Status** (checkboxes)
- Concept, Draft, Pending Approval, Provisioning, Active, Suspended, Decommissioned

### Data Panels (all users — aggregated from dataset level)

**Panel 3: Therapeutic Area** (checkboxes, collapsed by default)

**Panel 4: Study Phase** (checkboxes, collapsed by default)

**Panel 5: Data Modality** (checkboxes, collapsed by default)

### End-User Panels (hideable for DCM role later)

**Panel 6: Access** (radio group)
- All (default)
- I Have Access
- I Need to Request

### Sort Options
- Most Recent (default)
- Name (A-Z)
- Most Datasets
- Most Users
- Progress

### What's removed
- "My Intended Use" panel — future scope
- "Access Level" panel — redundant with Scope + Access
- Advanced Access Filters (User Groups, PRIDs) — too granular
- All workspace-mode dead code

## Files to modify
- `app/collectoid-v2/(app)/collections/_variations/variation-1.tsx`

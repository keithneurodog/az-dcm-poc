# End User Data Discovery: Collections-Aware Approach

**Created:** 2025-11-20
**Updated:** 2025-11-20
**Status:** ✅ Approach Confirmed
**Decision:** Collections-Aware (users understand collections from the start)

---

## Executive Summary

This document confirms the selected approach for how researchers (end users) discover and request access to clinical trial data.

**Selected Approach: Collections-Aware**

Users browse existing collections as their primary discovery mechanism, with full transparency into how data is organized and bundled. Collections are visible, understandable, and central to the user experience.

**Rationale:**
- Users who request data will be involved in collection proposition review and collaboration with DCMs
- Understanding collections from the start creates a smoother experience when requests require DCM involvement
- Leverages DCM curation work as a discovery aid (users benefit from expert organization)
- Encourages reuse of existing collections (reduces duplication and DCM workload)
- Provides context for why certain datasets are bundled together
- Makes intent-based access restrictions transparent and understandable

---

## Approach: Collections-Aware Discovery

### Philosophy
*"Show me what others have curated, help me understand how data is organized, then let me request access or customize."*

Users discover data through existing collections as a starting point, with transparency into how data is organized and what restrictions apply.

### User Mental Model
- "What collections exist for oncology research?"
- "This 'Oncology ctDNA Outcomes' collection looks relevant"
- "I can see what intents are allowed - perfect for my ML research"
- "I need access to this collection, maybe with a few modifications"
- Collections are visible organizational units that provide context

---

## User Journey Overview

### High-Level Flow

```
Entry Point
    ↓
[LLM Prompt Search] ← → [Browse Collections]
    ↓                           ↓
AI Recommendations          Collection Catalog
    ↓                           ↓
        Filter by Intent ← ← ← ←
                ↓
        Collection Detail View
                ↓
        Intent Declaration & Access Check
                ↓
        [90/10 Match?] → Yes → Instant Access
                ↓ No
        Request Access or Customize
                ↓
        Proposition Review (DCM)
                ↓
        Access Granted
```

---

## Key Screens Overview

### 1. Entry Point (Dual Discovery)
**Route:** `/collectoid/discover`

**Options:**
- **LLM-Assisted Search**: "Describe what you're looking for in natural language"
- **Browse Collections**: Traditional catalog with filters
- **Quick Search**: Power users who know exact DCODEs

Users can start with either approach based on their preference.

---

### 2A. LLM-Assisted Discovery
**Route:** `/collectoid/discover/ai`

User describes needs in natural language:
> "I need lung cancer data with ctDNA biomarker monitoring from immunotherapy trials for ML-based outcome prediction. Planning to publish results."

AI extracts keywords and suggests:
- Relevant collections (ranked by match)
- Individual datasets not in collections
- Flags intent mismatches (e.g., collection restricts publishing)

---

### 2B. Browse Collections Catalog
**Route:** `/collectoid/collections`

Traditional browsing with filters:
- Therapeutic Area
- Study Phase
- Allowed Uses (Intent filters)
- Access Level

**Intent-Based Highlighting:**
- ✅ "Matches your intent" - All selected intents allowed
- ⚠️ "Partial match" - Some intents restricted
- ❌ "Intent not allowed" - Major mismatch (still shown, can request modification)

**Soft Filtering:** Don't hide collections that don't match - show them with clear explanations.

---

### 3. Collection Detail View
**Route:** `/collectoid/collections/[collection-id]`

Shows:
- **Collection Overview**: Purpose, target audience, created by DCM
- **Agreement of Terms**: Visual display of allowed uses
  - Primary use categories (5 checkboxes)
  - Beyond primary use (AI research, software dev)
  - Publication rights (internal, external)
  - External sharing rules
- **Datasets Included**: List with individual access status
- **Your Access Status**: Personalized preview (8 instant, 8 approval required)
- **Who's Using It**: User count, departments, common activities

---

### 4. Request Access

**Two Paths:**

#### 4A. Simple Request (Accept Collection As-Is)
User requests full collection without modifications.

**Intent Declaration:**
- Select intended uses (checkboxes)
- Describe research purpose (free text)
- Expected duration

**Intent Validation:**
- ✅ If intents match collection's AoT → Proceed
- ⚠️ If intents don't match → Show warning with options:
  1. Adjust intents to match collection
  2. Request collection modification
  3. Create custom collection

**Outcome:**
- If user matches 90/10 criteria → Add to existing collection (instant for some datasets)
- If doesn't match → Create approval request for DCM

---

#### 4B. Customize Collection
**Route:** `/collectoid/collections/[collection-id]/customize`

User modifies:
- **Datasets**: Uncheck to remove, add more from catalog
- **Intents**: Select uses beyond original AoT
- **Name**: Provide custom collection name
- **Description**: Explain customization rationale

**Outcome:**
- Creates new **Collection Proposition** for DCM review
- Links to parent collection as "derived from"
- Estimated review time shown

---

### 5. Request Submitted (Confirmation)
**Route:** `/collectoid/requests/[request-id]`

**For Simple Requests:**
```
✅ 8 datasets: Instant access granted [Access Data →]
⏳ 8 datasets: Under review (Est. 2-3 days)

You've been added to "Oncology ctDNA Outcomes Collection"
```

**For Custom Propositions:**
```
⏳ Proposition PROP-2025-1234 submitted

DCM will review your custom collection request.
Est. review time: 3-5 days

You can track progress and collaborate via discussion.
```

---

### 6. My Requests Dashboard
**Route:** `/collectoid/my-requests`

User tracking center:
- Active requests/propositions
- Status updates with progress bars
- Latest activity notifications
- Quick actions (access granted data, respond to DCM, etc.)

---

### 7-9. DCM Review Flow

**DCM Proposition Dashboard** (`/collectoid/dcm/propositions`):
- List of pending user requests and propositions
- Smart recommendations (auto-approve, merge, review)
- Filter by status, urgency, department

**DCM Proposition Review** (`/collectoid/dcm/propositions/[prop-id]/review`):
- Detailed view of user's request
- Decision options:
  1. Approve as-is
  2. Suggest modifications
  3. Merge with parent collection
  4. Request clarification (via discussion)
  5. Reject with feedback

**Refinement Workspace**:
- Same DCM creation flow (pre-populated)
- Add/remove datasets
- Adjust intents/AoT
- Changes sent back to user for approval

---

### 10. Access Granted (Final Notification)

Email + in-app notification:
```
✓ Your data request is ready

Collection: Oncology ctDNA Outcomes Collection
16 datasets now accessible

[Access Data Now →]
• Domino Data Lab
• SCP Platform
• AiBench
```

---

## Agreement of Terms (AoT) Integration

Every collection includes an **Agreement of Terms** defining:

### Terms and Conditions of Use

**Primary Use (IMI-Guided Protocol):**
- ✅ Understand how drugs work in the body
- ✅ Better understand disease and health problems
- ✅ Develop diagnostic tests for disease
- ✅ Learn from past studies to plan new studies
- ✅ Improve scientific analysis methods

**Beyond Primary Use:**
- AI research / AI model training (Yes/No)
- Software development and testing (Yes/No)

**Publication:**
- Internal 'company restricted' findings (Yes/No)
- External publication (Yes/No/By exception)

**External Sharing:**
- Sharing with 3rd party or collaborator (process description)

### User Scope
- By department/organization (Workday IDs)
- By role type (Data Scientist, Engineer, Bioinformatician, etc.)

### Display in UI
- **Simple badges** (initial implementation):
  - `ML/AI ✅ | Publish ✅ | Primary Use ❌`
- **Expandable detail** on collection detail page
- **Full AoT document** linked for complete terms

---

## Key Features

### 1. Soft Intent Filtering
- Users filter collections by their intended use
- Collections that don't match are **still shown** with warnings
- Encourages modification requests rather than hiding options

### 2. Personalized Access Preview
- Each user sees their own access status
- "8 instant, 8 approval required" based on user's role, department, training
- Different users see different numbers for same collection

### 3. Smart Suggestions
- AI recommends collections based on user's description
- System suggests adding datasets frequently bundled together
- Warns about similar pending propositions (avoid duplication)

### 4. Modification Requests
When user's intent doesn't match collection's AoT:
- **Option 1**: Adjust intents (simplest)
- **Option 2**: Request DCM modify collection's AoT (benefits all users)
- **Option 3**: Create custom collection (new proposition)

### 5. Collection Derivation
- Custom collections link to parent as "derived from"
- DCM can see lineage and consolidate similar variants
- System tracks proliferation and suggests merging

### 6. Collaborative Review
- Users and DCMs can discuss via collection discussion tab
- DCM can request clarification
- User can respond and refine request
- Transparent process from start to finish

---

## Why Collections-Aware Wins

### ✅ Advantages

**1. Natural Collaboration**
- Users already understand collections when DCM needs to collaborate on proposition
- No surprise transition from "dataset search" to "collection management"

**2. Leverage Curation**
- Users benefit from DCM expertise in bundling related datasets
- Discovery aided by expert organization, not just keyword search

**3. Reduce Duplication**
- Encourages reuse of existing collections
- Users can see "120 users already using this" → social proof
- System can suggest joining existing vs. creating new

**4. Transparent Restrictions**
- AoT rules visible upfront
- Users understand why certain uses are restricted
- Can request modifications proactively

**5. Better Intent Matching**
- Users see collections organized by use case
- Can filter by allowed intents before diving deep
- Reduces requests that will be rejected

**6. Community Building**
- Users can see who else is using collections
- Common activities listed
- Potential for future collaboration features

### ⚠️ Considerations

**Potential Challenges:**
- Users may be overwhelmed if too many collections exist
  - **Mitigation**: Smart search, AI recommendations, good filtering
- Users may pick "close enough" collection instead of optimal
  - **Mitigation**: Show match percentage, encourage customization
- Collection metadata must be clear and well-maintained
  - **Mitigation**: DCM training, templates, quality checks

---

## Implementation Priority

### Phase 1: Core Discovery (Weeks 1-2)
✅ **Must Have:**
- Landing page with dual entry (LLM + Browse)
- LLM-assisted search with collection recommendations
- Collection catalog with filters
- Collection detail view with AoT display

### Phase 2: Request Flow (Weeks 3-4)
✅ **Must Have:**
- Simple access request (accept collection as-is)
- Intent validation against AoT
- Customize collection flow
- Request confirmation and tracking

### Phase 3: DCM Review (Weeks 5-6)
✅ **Must Have:**
- DCM proposition dashboard
- Detailed proposition review with decision options
- Integration with existing DCM creation flow

### Phase 4: Polish (Weeks 7-8)
✅ **Must Have:**
- Notifications (email + in-app)
- My Requests dashboard
- Access granted flow
- Error states, animations, UX polish

---

## Success Metrics

**Discovery Efficiency:**
- Time from landing to finding relevant collection: **< 2 minutes**
- % of users who find relevant collection on first search: **> 70%**

**Reuse Rate:**
- % of requests that use existing collections (vs. custom): **> 60%**
- % of requests that are added to existing collection (simple): **> 50%**

**90/10 Effectiveness:**
- % of simple requests with instant access granted: **> 70%**
- Average time from request to full access: **< 3 days**

**User Satisfaction:**
- Users understand what collections are: **> 90%**
- Users find AoT restrictions clear: **> 85%**
- Users satisfied with discovery process: **> 80%**

**DCM Efficiency:**
- Average DCM time to review proposition: **< 30 minutes**
- % of propositions that require clarification: **< 20%**
- % of propositions that are duplicates: **< 10%**

---

## Future Enhancements (Out of Scope)

**Noted for future implementation:**
1. Agentic modification suggestions via discussion parsing
2. "My Collections" user dashboard (collections I'm using)
3. Platform click-through with SSO (currently dummy links)
4. Real-time collaboration workspace during proposition review
5. Similar collection detection and consolidation
6. Collection templates for common use cases
7. Advanced analytics (trending collections, hot datasets)
8. Personalized recommendations based on user history

---

## Related Documentation

**Detailed Implementation Spec:**
- `/docs/end-user-data-discovery-detailed-spec.md` - Full screen specs, data models, implementation plan

**Source Material:**
- `/docs/collectoid-poc-requirements.md` - Original POC requirements
- `/docs/dcm-workflow-learnings.md` - DCM workflow insights
- `/docs/misc/Agreement of Terms - Ongoing Collection.docx` - AoT structure
- `/docs/misc/Ongoing Data Collection - Opt in and Out.docx` - Dataset approval process

**Design System:**
- `/app/ux/13/design-system/` - UI components and patterns to follow

---

## Decision Log

**Nov 20, 2025:**
- ✅ Selected Collections-Aware as primary approach
- ✅ Removed Collections-Agnostic (Approach A) entirely
- ✅ Confirmed dual entry point (LLM + Browse)
- ✅ Confirmed soft intent filtering (show all, warn about mismatches)
- ✅ Confirmed Agreement of Terms integration
- ✅ Confirmed customization creates propositions (not separate collections)
- ✅ Ready to proceed with implementation in `/app/poc/2/`

**Nov 24, 2025:**
- ✅ Consolidated POC 1 and POC 2 into single `/app/collectoid/` route
- ✅ DCM workflow fully implemented under `/collectoid/dcm/`
- ✅ Enhanced Progress page with:
  - ETA Summary Panel with progress ring and countdown
  - ETA Complexity Breakdown (approval teams, data sensitivity, user volume, agreement complexity)
  - Blocker Impact Panel with delay calculations
  - Enhanced Timeline with inline blocker warnings
- ✅ Improved User Status tab with:
  - Compact stat bar (replacing 6 large metric cards)
  - User Groups panel with contact information
  - Pagination for user table
  - "Request Users Modification" action
- ✅ Updated all route references from `/poc/2/` to `/collectoid/`

---

**End of Approach Document**

Next step: Begin implementation of End User Discovery screens (Phase 1: Core Discovery)


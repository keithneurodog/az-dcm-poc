# User Journey / Role Matrix

| # | Feature Area | Sub-Section | Functionality | Role 1 | Role 2 | Role 3 | Role 4 | Role 5 | Role 6 |
|---|---|---|---|---|---|---|---|---|---|
| 1.1.1 | **1. Collection Creation & Workspace** [Concept](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create) · [Workspace](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace) | Concept Creation | Start a new collection by entering a title and optional description. This creates a private "concept", a lightweight starting point that only the creator can see. | | | | | | |
| 1.1.2 | | | Choose request type: New collection, Update to existing, or Policy Change | | | | | | |
| 1.1.3 | | | Link to an existing collection when updating or changing policy | | | | | | |
| 1.1.4 | | | Auto populate concept from demand analytics (title, TA, intent filled in) | | | | | | |
| 1.1.5 | | | Concept is private by default. Nobody else can see it until the creator promotes it to draft. | | | | | | |
| 1.1.6 | | | Generate a shareable read only link so colleagues can preview the concept before it becomes a draft | | | | | | |
| 1.1.7 | | | Warn if a similar collection already exists (shows similarity scores and matching collections) | | | | | | |
| 1.2.1 | | Workspace Overview & Navigation | View workspace hub showing four section cards: Datasets, Activities, Terms, Access & Users. Each card shows completion status. | | | | | | |
| 1.2.2 | | | See completion status per section (empty, in progress, complete) | | | | | | |
| 1.2.3 | | | Work on sections in any order. No forced linear flow. | | | | | | |
| 1.2.4 | | | Edit collection title and description inline on the workspace overview | | | | | | |
| 1.2.5 | | | Persistent sidebar showing section navigation and progress indicators | | | | | | |
| 1.2.6 | | | Banner showing current stage (concept or draft) | | | | | | |
| 1.3.1 | | AI Analysis & Suggestions | Background AI analysis of collection intent runs automatically when the workspace loads | | | | | | |
| 1.3.2 | | | AI status banner shows analysing or ready state | | | | | | |
| 1.3.3 | | | AI suggestions panel shows detected TAs, modalities, keywords, confidence score | | | | | | |
| 1.3.4 | | | AI suggested filters automatically applied to dataset browser | | | | | | |
| 1.3.5 | | | AI recommended activities highlighted based on collection intent | | | | | | |
| 1.3.6 | | | AI suggested Data Use Terms based on dataset restrictions | | | | | | |
| 1.4.1 | | Dataset Selection [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/datasets) | Browse the full ROAM enriched dataset catalog | | | | | | |
| 1.4.2 | | | View dataset metadata: d code, name, TA, phase, status, patient count | | | | | | |
| 1.4.3 | | | View ROAM specific fields: locked status, DPR, compliance status, data availability | | | | | | |
| 1.4.4 | | | Filter, search, sort, and refine datasets (by TA, phase, status, geography, modality, sponsor type, locked status, DPR, compliance, d code, keyword; sortable columns, configurable table view) | | | | | | |
| 1.4.5 | | | Select individual datasets or select all on page | | | | | | |
| 1.4.6 | | | Remove individual datasets from selection | | | | | | |
| 1.4.7 | | | Selected dataset count updates in sidebar | | | | | | |
| 1.5.1 | | Inclusion Mechanisms & Modalities | Set inclusion mechanism per study: auto included, opt out, or opt in | | | | | | |
| 1.5.2 | | | Bulk assign inclusion mode across multiple studies | | | | | | |
| 1.5.3 | | | Toggle data modalities per study (Clinical/SDTM, ADaM, ctDNA/Biomarker, Imaging, Omics, RWD, RAW) | | | | | | |
| 1.5.4 | | | Assign data source per modality (entimICE, PDP, CTDS, Medidata Rave, Veeva Vault, External Partners) | | | | | | |
| 1.5.5 | | | Bulk modality assignment across multiple studies | | | | | | |
| 1.5.6 | | | Auto suggest sources from study metadata | | | | | | |
| 1.5.7 | | | Block promotion if any modality or source is blank | | | | | | |
| 1.6.1 | | Consumption Environments | Select where users will access data (SCP, Domino, AI Bench, PDP, IO Platform) | | | | | | |
| 1.6.2 | | | Leadership defined defaults pre selected | | | | | | |
| 1.6.3 | | | Adding a non default environment requires justification text | | | | | | |
| 1.6.4 | | | Override environment selection per dataset | | | | | | |
| 1.7.1 | | Activities & Purpose [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/activities) | View activities grouped by category: Scientific Research, Drug Development, Safety, AI & Analytics | | | | | | |
| 1.7.2 | | | Select activities to add to the permitted list | | | | | | |
| 1.7.3 | | | View access level per activity | | | | | | |
| 1.7.4 | | | Governance warnings shown on activities not permitted under Primary Use | | | | | | |
| 1.7.5 | | | AI recommended activities highlighted based on collection intent and datasets | | | | | | |
| 1.8.1 | | Data Use Terms Configuration [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/terms) | Configure primary use permissions (understand drug mechanism, disease, diagnostics, past studies, methods) | | | | | | |
| 1.8.2 | | | Configure beyond primary use toggles: train AI/ML, store in AI/ML, software development | | | | | | |
| 1.8.3 | | | Configure publication permissions: internal restricted or external publication | | | | | | |
| 1.8.4 | | | Auto suggest terms from datasets and activities | | | | | | |
| 1.8.5 | | | Real time conflict detection when terms clash with dataset level restrictions | | | | | | |
| 1.8.6 | | | View conflict details: which permission, which datasets, severity level | | | | | | |
| 1.8.7 | | | Resolve conflicts by modifying terms, removing conflicting datasets, or acknowledging | | | | | | |
| 1.9.1 | | Access & Users (Scope Definition) | Browse searchable list of Immuta role groups with name, source system, member count, category | | | | | | |
| 1.9.2 | | | Filter and search role groups by category (TA, Function, Study Team, Platform) or name | | | | | | |
| 1.9.3 | | | Toggle groups on or off to define collection access scope | | | | | | |
| 1.9.4 | | | Add individual users by searching name or PRID | | | | | | |
| 1.9.5 | | | Manual PRID entry with lookup | | | | | | |
| 1.9.6 | | | Summary showing total groups, individual users, estimated total user count | | | | | | |
| 1.10.1 | | Promote to Draft [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/review) | Promote concept to a formal draft. Only enabled when all 3 required sections (Datasets, Activities, Terms) are complete. This makes the collection visible to others. | | | | | | |
| 1.10.2 | | | Validation summary shows which sections are incomplete | | | | | | |
| 1.10.3 | | | Review access provisioning breakdown: Already Open, Awaiting Policy, Needs Approval, Missing | | | | | | |
| 1.10.4 | | | View training compliance breakdown | | | | | | |
| 1.10.5 | | | Edit collection name, description, and target community on review page | | | | | | |
| 1.10.6 | | | Confirm promotion. Creates version snapshot v1 and publishes event. | | | | | | |
| 2.1.1 | **2. Collection Lifecycle Management** [Collection Detail](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1) | Draft Management | Edit all fields of a draft collection (reopens the workspace) | | | | | | |
| 2.1.2 | | | Auto save with "last saved" timestamp | | | | | | |
| 2.1.3 | | | Changes tracked and versioned per edit | | | | | | |
| 2.2.1 | | Submit for Approval | Submit draft for approval. All required fields must be complete or submission is blocked. | | | | | | |
| 2.2.2 | | | Validation summary shown if submission blocked (lists incomplete fields) | | | | | | |
| 2.2.3 | | | System auto identifies required TA Lead approvers based on the studies' TAs | | | | | | |
| 2.2.4 | | | System auto creates one approval request per TA | | | | | | |
| 2.2.5 | | | Early notification sent to DPO on submission | | | | | | |
| 2.3.1 | | Governance Stage Transitions | Concept to Draft transition (promotion) | | | | | | |
| 2.3.2 | | | Draft to Pending Approval transition (submission) | | | | | | |
| 2.3.3 | | | Pending Approval to Approved transition | | | | | | |
| 2.3.4 | | | Pending Approval to Rejected transition | | | | | | |
| 2.3.5 | | | Rejected to Draft transition (revise and resubmit) | | | | | | |
| 2.3.6 | | | Invalid transitions blocked with error message | | | | | | |
| 2.3.7 | | | Audit event created on every valid transition | | | | | | |
| 2.4.1 | | Operational State Transitions | Auto initialise to Provisioning on approval | | | | | | |
| 2.4.2 | | | Provisioning to Live transition | | | | | | |
| 2.4.3 | | | Live to Suspended transition (emergency stop) | | | | | | |
| 2.4.4 | | | Suspended to Live transition (reinstatement after resolution) | | | | | | |
| 2.4.5 | | | Suspended to Decommissioned transition | | | | | | |
| 2.4.6 | | | Invalid transitions blocked | | | | | | |
| 2.5.1 | | In Scope Modifications (No Re Approval) | Add study within the approved OAC scope via proposition | | | | | | |
| 2.5.2 | | | Remove study within approved scope via proposition | | | | | | |
| 2.5.3 | | | In scope propositions auto merge without governance re approval | | | | | | |
| 2.5.4 | | | New version created on merge | | | | | | |
| 2.5.5 | | | Affected users notified | | | | | | |
| 2.6.1 | | Out of Scope Modifications (Re Approval Required) | System detects changes outside approved scope (e.g. new TA not in original approval) | | | | | | |
| 2.6.2 | | | Proposition flagged for re approval | | | | | | |
| 2.6.3 | | | Data Use Term changes trigger re approval | | | | | | |
| 2.6.4 | | | Fresh TA Lead signatures required | | | | | | |
| 2.6.5 | | | DCM informed of re approval requirement and can proceed or withdraw | | | | | | |
| 2.6.6 | | | Withdrawal leaves collection unchanged | | | | | | |
| 2.7.1 | | Suspension | Suspend a live collection (emergency stop) | | | | | | |
| 2.7.2 | | | All access immediately revoked via Immuta policy removal | | | | | | |
| 2.7.3 | | | All affected users notified | | | | | | |
| 2.7.4 | | | Reinstate after resolution (approver reviews and reinstates) | | | | | | |
| 2.7.5 | | | Immuta policies reapplied on reinstatement | | | | | | |
| 2.8.1 | | Decommission | Decommission a collection. Reason is mandatory. | | | | | | |
| 2.8.2 | | | All active access revoked | | | | | | |
| 2.8.3 | | | All affected users notified | | | | | | |
| 2.8.4 | | | Collection retained for audit (read only, shows Decommissioned badge in search) | | | | | | |
| 2.9.1 | | Auto Flag on Metadata Change | AZCT sync detects metadata change and study is auto flagged | | | | | | |
| 2.9.2 | | | Consent withdrawal flags study as Restricted with reason | | | | | | |
| 2.9.3 | | | Flagged study visually highlighted with reason | | | | | | |
| 2.9.4 | | | DCM and stakeholders notified | | | | | | |
| 2.9.5 | | | DCM can remove, investigate, or override flag | | | | | | |
| 3.1.1 | **3. Approval Workflow** [Collection Detail (Approvals)](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1) | Approval Routing | Route approval requests by therapeutic area (one request per TA) | | | | | | |
| 3.1.2 | | | Route to multiple approver types: DDO, GPT, TALT, Alliance Manager | | | | | | |
| 3.1.3 | | | Partnership studies additionally routed to Alliance Manager | | | | | | |
| 3.1.4 | | | Cross TA collections create separate approval request per TA | | | | | | |
| 3.2.1 | | Approver Queue | View all pending approval requests | | | | | | |
| 3.2.2 | | | Filter by request type (with count badges), sort by SLA remaining, mark items as reviewed | | | | | | |
| 3.3.1 | | Approval Review Interface | Review filtered to only the approver's TA studies (for cross TA collections) | | | | | | |
| 3.3.2 | | | View compliance status per study | | | | | | |
| 3.3.3 | | | View Data Use Terms summary | | | | | | |
| 3.3.4 | | | View previous approval decisions for cross TA context | | | | | | |
| 3.3.5 | | | Access discussion thread within review | | | | | | |
| 3.4.1 | | Approval Decision Actions | Approve with optional comments | | | | | | |
| 3.4.2 | | | Reject with mandatory reason (blocked without reason) | | | | | | |
| 3.4.3 | | | Request changes with specific feedback (DCM notified) | | | | | | |
| 3.4.4 | | | Delegate to another qualified approver with reason and expected duration | | | | | | |
| 3.5.1 | | Digital Signature / Acknowledgement | In app digital acknowledgement capturing identity, role, decision, timestamp, comments | | | | | | |
| 3.5.2 | | | Immutably stored in audit events table | | | | | | |
| 3.6.1 | | Cross TA "All or Nothing" Enforcement | Single TA rejection blocks the entire collection for ALL TAs | | | | | | |
| 3.6.2 | | | Blocking status shows which TA rejected and why | | | | | | |
| 3.6.3 | | | All TAs must approve for the collection to proceed to approved | | | | | | |
| 3.6.4 | | | Per TA visual status indicators: approved, pending, rejected | | | | | | |
| 3.6.5 | | | Approver name and decision date shown per TA | | | | | | |
| 3.7.1 | | Post Approval Triggers | All approved triggers provisioning (Immuta policy + Starburst access via SQS) | | | | | | |
| 3.7.2 | | | DCM notified of provisioning start | | | | | | |
| 3.7.3 | | | Partial approvals do not trigger provisioning | | | | | | |
| 3.8.1 | | Auto Revoke & Re Approval | Metadata change invalidates approval and access is auto revoked | | | | | | |
| 3.8.2 | | | Stakeholders notified with affected studies, change details, revoked access | | | | | | |
| 3.8.3 | | | Decision change invalidates prior approvals and new requests are routed | | | | | | |
| 3.9.1 | | Quarterly Opt In/Opt Out Review | DCM creates review cycle with proposed study changes | | | | | | |
| 3.9.2 | | | DDOs notified with structured review interface | | | | | | |
| 3.9.3 | | | DDOs provide per study decisions (approve or reject continued inclusion) with comments | | | | | | |
| 3.9.4 | | | Outcomes aggregated, collection updated, version snapshot created | | | | | | |
| 3.9.5 | | | Opted out studies removed and affected users notified | | | | | | |
| 3.10.1 | | Bulk Approval | Select multiple studies for bulk approval | | | | | | |
| 3.10.2 | | | System pre verifies metadata for all selected | | | | | | |
| 3.10.3 | | | Approve all passing studies in a single action (per study audit records) | | | | | | |
| 3.10.4 | | | Failing studies flagged with reasons and individually reviewable | | | | | | |
| 3.11.1 | | Proposition Review | Review proposed changes to live collections | | | | | | |
| 3.11.2 | | | Assess whether changes introduce new governance concerns | | | | | | |
| 3.11.3 | | | Approve, reject, or request changes on propositions | | | | | | |
| 3.11.4 | | | Approved propositions auto merged | | | | | | |
| 4.1.1 | **4. Collection Detail View** [Example](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1) | Overview Tab | View collection name, description, status badge, TA tags, summary metrics (datasets, users, progress %), access provisioning breakdown chart, metadata (created by, date, last updated), request type indicator | | | | | | |
| 4.2.1 | | Datasets Tab | View all datasets with d code, name, phase, status, patients, access status, modalities | | | | | | |
| 4.2.2 | | | Expand dataset rows for source info per modality and full metadata | | | | | | |
| 4.2.3 | | | Search, sort, and filter datasets within the collection (by d code, name, patients, status, access state) | | | | | | |
| 4.2.4 | | | View per dataset access provisioning breakdown | | | | | | |
| 4.2.5 | | | View per dataset compliance status (ethical, legal, DPR, locked) | | | | | | |
| 4.3.1 | | Data Use Terms Tab | View primary use permissions checklist | | | | | | |
| 4.3.2 | | | View beyond primary use permissions (AI/ML, Software Dev) | | | | | | |
| 4.3.3 | | | View publication permissions | | | | | | |
| 4.3.4 | | | View prohibited uses | | | | | | |
| 4.3.5 | | | View user scope | | | | | | |
| 4.3.6 | | | View Data Use Terms version indicator with version history link | | | | | | |
| 4.4.1 | | Users / Team Tab | View active collection users: name, email, role, department, assigned date | | | | | | |
| 4.4.2 | | | View role breakdown: DCL, DDO, Collection Leader, Data Consumer | | | | | | |
| 4.4.3 | | | View Immuta role group memberships with member counts | | | | | | |
| 4.4.4 | | | Search users by name, email, or role | | | | | | |
| 4.4.5 | | | View training compliance status per user: complete, pending, overdue | | | | | | |
| 4.4.6 | | | Draft collections show "Users Not Yet Provisioned" placeholder with target count | | | | | | |
| 4.5.1 | | Timeline / Activity Tab | View chronological events (creation, status changes, dataset changes, approvals, comments) with actor and timestamp; filter by event type | | | | | | |
| 4.6.1 | | Discussion / Comments Tab | Post comments with type: update, question, blocker, suggestion | | | | | | |
| 4.6.2 | | | Threaded replies nested under original | | | | | | |
| 4.6.3 | | | @mention users with dropdown and notification | | | | | | |
| 4.6.4 | | | Pin important comments | | | | | | |
| 4.6.5 | | | Add reactions to comments | | | | | | |
| 4.6.6 | | | Mark blocker as resolved with resolution notes | | | | | | |
| 4.6.7 | | | Filter comments by type; automated system messages on system events | | | | | | |
| 4.7.1 | | Progress & Provisioning View | Health score card for active and provisioning collections | | | | | | |
| 4.7.2 | | | Provisioning status breakdown | | | | | | |
| 4.7.3 | | | Visual lifecycle stepper | | | | | | |
| 4.7.4 | | | Per dataset provisioning status | | | | | | |
| 4.7.5 | | | Approval status per TA | | | | | | |
| 4.7.6 | | | DPO delivery tracking (read only) | | | | | | |
| 4.7.7 | | | Compliance checklist status | | | | | | |
| 4.8.1 | | Draft Specific Detail View | Non dismissible DRAFT banner at top of page | | | | | | |
| 4.8.2 | | | Simplified stats card showing datasets, target users, TAs | | | | | | |
| 4.8.3 | | | Approve Collection button | | | | | | |
| 4.8.4 | | | Edit action cards linking back to workspace sections | | | | | | |
| 4.9.1 | | Role Based Detail View Adaptation | DCM sees full management controls: edit, submit, manage users | | | | | | |
| 4.9.2 | | | Data Consumer (non member) sees read only view with Request Access button | | | | | | |
| 4.9.3 | | | Approver sees approve/reject buttons and TA specific review | | | | | | |
| 4.9.4 | | | Team Lead sees team management controls and membership management | | | | | | |
| 5.1.1 | **5. Collections Browser** [Browse](https://az-dcm-poc.vercel.app/collectoid-v2/collections) | View Modes & Navigation | Toggle between Grid (cards), List (sortable table), and Kanban (status columns) views | | | | | | |
| 5.2.1 | | Collection Cards (Grid View) | Card shows name, description, owner, status badge, progress, users, datasets, access indicator, date, dataset preview (first 3 d codes plus remaining count), discussion badge; click navigates to detail | | | | | | |
| 5.3.1 | | Search, Filter, Sort & Pagination | Full text search across names, descriptions, d codes, owners with highlighting and debounce | | | | | | |
| 5.3.2 | | | Filter by: Status, Therapeutic Area, Owner, Study Phase, Data Type/Modality, Region, Compliance, Dataset/Patient/User count range, Created/Updated date range, Progress, Quality, Permitted Intent (AI/ML, Software Dev, Publication). AND logic across filters, active count indicator, Clear All. | | | | | | |
| 5.3.3 | | | Filter by Access Level: My Collections, Shared, Public, Restricted | | | | | | |
| 5.3.4 | | | Quick filter: My Access (Have Access, Don't Have Access, All) | | | | | | |
| 5.3.5 | | | Quick filter: Favorites only | | | | | | |
| 5.3.6 | | | Sort by: Recent, Alphabetical, Most Users, Completion %, Patient Count. Favorites always pinned to top. | | | | | | |
| 5.3.7 | | | Pagination: 20 per page default, page size selector (50, 100) | | | | | | |
| 5.4.1 | | Kanban Interactions | Drag card between valid status columns | | | | | | |
| 5.4.2 | | | System validates transition on drag | | | | | | |
| 5.4.3 | | | Invalid drag rejected with card snapping back and error message | | | | | | |
| 5.5.1 | | Access Control Indicators | Member (green), Request Access (amber), Public (blue), Restricted (red) indicators on cards | | | | | | |
| 5.6.1 | | Favoriting | Star or unstar collections; persists across sessions; favorites sort to top | | | | | | |
| 5.7.1 | | Bulk Operations | Multi select collections | | | | | | |
| 5.7.2 | | | Bulk Compare | | | | | | |
| 5.7.3 | | | Bulk Request Access | | | | | | |
| 5.7.4 | | | Bulk Export | | | | | | |
| 5.8.1 | | Quick Actions (per collection) | View Details, Request Access, Star/Favorite, Fork Collection, Use as Template, Share Link, Export Metadata | | | | | | |
| 5.9.1 | | Empty States | No collections found with suggestions to broaden search | | | | | | |
| 5.9.2 | | | First time user onboarding guidance | | | | | | |
| 5.9.3 | | | DCM sees Create New Collection link; others see contact guidance | | | | | | |
| 6.1.1 | **6. Dataset Management** [Workspace Datasets](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/datasets) | Browse & Add Datasets | Search and filter ROAM enriched catalog (by d code, study name, TA, phase, status, geography, sponsor type, locked status, DPR) | | | | | | |
| 6.1.2 | | | View ROAM enriched fields: locked status, DPR, compliance, data availability | | | | | | |
| 6.1.3 | | | Preview dataset with full ROAM metadata | | | | | | |
| 6.1.4 | | | Add individual datasets or bulk add | | | | | | |
| 6.2.1 | | Dataset Detail Panel | View core metadata: d code, name, description, TA, phase, status, patients, geography | | | | | | |
| 6.2.2 | | | View clinical metadata: enrollment dates, completion dates, sponsor info | | | | | | |
| 6.2.3 | | | View ROAM fields: locked status with reason, DPR, data availability | | | | | | |
| 6.2.4 | | | View compliance status: ethical, legal, DPR | | | | | | |
| 6.2.5 | | | View data availability and access breakdown per source | | | | | | |
| 6.2.6 | | | View frequently bundled dataset suggestions | | | | | | |
| 6.3.1 | | Modality / Source Matrix Editor | Matrix view: rows = datasets, columns = modalities, cells = selected source | | | | | | |
| 6.3.2 | | | Click cell to select source from dropdown | | | | | | |
| 6.3.3 | | | Bulk operation: apply source to all datasets for a modality | | | | | | |
| 6.3.4 | | | Missing sources highlighted with warning | | | | | | |
| 6.4.1 | | Compliance Status | View per study ethical and legal status: confirmed, pending, flagged | | | | | | |
| 6.4.2 | | | View ROAM compliance fields: DPR, locked status with reason, data availability | | | | | | |
| 6.4.3 | | | Studies with First Subject In before 2013 flagged as not eligible for 90 route | | | | | | |
| 6.4.4 | | | Flagged studies visually highlighted with reason in tooltip | | | | | | |
| 6.5.1 | | Remove Dataset | Impact analysis before removal showing users affected and approval chain impact | | | | | | |
| 6.5.2 | | | Confirm removal. New version created with audit trail. | | | | | | |
| 7.1.1 | **7. Versioning & Change Management** *(not yet built in POC)* | Automatic Versioning | New immutable version snapshot on every meaningful change with auto incremented number, full JSONB state, human readable summary, classified change type | | | | | | |
| 7.1.2 | | | Snapshots are immutable (modifications rejected) | | | | | | |
| 7.2.1 | | Version History Browser | View chronological list of all versions: number, summary, type, author, timestamp; click to view full snapshot in read only mode | | | | | | |
| 7.3.1 | | Version Comparison (Diff View) | Select two versions for side by side comparison | | | | | | |
| 7.3.2 | | | View added datasets (green) and removed datasets (red) | | | | | | |
| 7.3.3 | | | View changed terms, user scope changes, status changes | | | | | | |
| 7.3.4 | | | Compare non adjacent versions (e.g. v1 vs v12) | | | | | | |
| 7.4.1 | | Change Artifacts | Timestamped artifact on every change: before state, after state, actor, role, timestamp | | | | | | |
| 7.4.2 | | | Linked to audit events table; immutable and available for compliance queries | | | | | | |
| 7.5.1 | | Version Change Notifications | Access impacting changes trigger notifications to affected users; non access impacting changes do not | | | | | | |
| 7.6.1 | | Quarterly Review Cycle | DCM creates review cycle for active collection | | | | | | |
| 7.6.2 | | | DDOs notified and provide per study decisions (approve or reject) with comments | | | | | | |
| 7.6.3 | | | Outcomes aggregated into new immutable version; opted out studies removed and affected users notified | | | | | | |
| 8.1.1 | **8. Role Assignment & Team Management** [Workspace Roles](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/roles) | Governance Role Assignment | Assign Data Consumer Lead (DCL) via Azure AD search | | | | | | |
| 8.1.2 | | | Assign Data Owner (DDO) via Azure AD search | | | | | | |
| 8.1.3 | | | Minimum role validation: at least one DCL and one DDO required for submission | | | | | | |
| 8.1.4 | | | Nominate Collection Leader from assigned users with scoped permissions | | | | | | |
| 8.2.1 | | Azure AD User Search | Type ahead search by partial name or email returning name, email, department, job title; recent and suggested users shown before searching | | | | | | |
| 8.3.1 | | Virtual Teams | Create virtual team with name linked to collection | | | | | | |
| 8.3.2 | | | Add and remove users from team (access updated on removal) | | | | | | |
| 8.3.3 | | | Bulk user import via CSV or AD group with invalid entries reported | | | | | | |
| 8.4.1 | | Bulk User Assignment | Assign by organisation or role with user count displayed, preview before confirming | | | | | | |
| 8.5.1 | | Auto Update on AD Group Changes | AD group membership changes auto detected; users added or removed with notification; periodic sync | | | | | | |
| 9.1.1 | **9. Search & AI Discovery** [Discovery](https://az-dcm-poc.vercel.app/collectoid/discover) · [AI Search](https://az-dcm-poc.vercel.app/collectoid/discover/ai) | Discovery Landing | Choose discovery method: AI assisted or manual browse; feature badges explaining each path | | | | | | |
| 9.2.1 | | AI Natural Language Search | Enter natural language query e.g. "oncology biomarker studies from 2024" | | | | | | |
| 9.2.2 | | | AI interprets intent and ranks results by relevance | | | | | | |
| 9.2.3 | | | Filters auto populated from query (TA, Data Type, Year) and modifiable | | | | | | |
| 9.2.4 | | | No results shows helpful message with alternative suggestions | | | | | | |
| 9.2.5 | | | Smart Filter UI: three visual states (prompt, active, paused), toggle between active and paused, edit query, clear to reset | | | | | | |
| 9.3.1 | | Editable Keywords | Extracted keyword badges displayed; click to remove and re filter; add new keywords via button | | | | | | |
| 9.4.1 | | Collection & Dataset Selection | Add to Request button on collection and dataset cards; mixed selection supported | | | | | | |
| 9.4.2 | | | Access breakdown bar on each card | | | | | | |
| 9.5.1 | | Enhanced Collection Cards (Discovery) | Four segment access breakdown progress bar with dataset preview d code badges | | | | | | |
| 9.6.1 | | Enhanced Dataset Cards (Discovery) | Collection crossover display showing which collections contain this dataset | | | | | | |
| 9.6.2 | | | Access eligibility breakdown bar | | | | | | |
| 9.6.3 | | | Frequently bundled with section | | | | | | |
| 9.7.1 | | Floating Bottom Selection Bar | Collapsed: icon with count, quick stats, Clear All, Continue with Request | | | | | | |
| 9.7.2 | | | Expanded: aggregate access breakdown, scrollable selected items, remove individual | | | | | | |
| 9.7.3 | | | Continue with Request navigates to AI review page | | | | | | |
| 9.8.1 | | AI Review / Summary Page | AI generates summary: suggested name, intent, data scope, access summary, recommendations | | | | | | |
| 9.8.2 | | | Editable request name with character counter | | | | | | |
| 9.8.3 | | | Summary sections: Data Scope, Detected Intent, Access Summary, AI Recommendations | | | | | | |
| 9.8.4 | | | Selected items review with match score badges | | | | | | |
| 9.8.5 | | | Submit request saves as named group in My Requests | | | | | | |
| 9.9.1 | | Taxonomy Browser | Hierarchical taxonomy (TA, SDTM, ADaM, Specialized) with expandable tree and collection counts per node; click to filter browser | | | | | | |
| 9.10.1 | | Similar & Related Collections | Similar Collections on detail page based on dataset/TA overlap, user profile, history; click to navigate | | | | | | |
| 9.11.1 | | Collection Comparison | Select 2 or 3 collections for side by side comparison of scope, terms, users, datasets, access, environments; differences highlighted | | | | | | |
| 10.1.1 | **10. Data Access Request Flow** [Request](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1/request) · [My Requests](https://az-dcm-poc.vercel.app/collectoid/my-requests) | Request Access | Request access to a collection from browser or detail page | | | | | | |
| 10.1.2 | | | Declare intent and justify access need | | | | | | |
| 10.1.3 | | | Review matching and eligibility | | | | | | |
| 10.1.4 | | | Submit request and track status | | | | | | |
| 10.2.1 | | Access Provisioning | Access auto provisioned via Immuta policies on approval | | | | | | |
| 10.2.2 | | | Training gate: mandatory training must be complete before access granted | | | | | | |
| 10.2.3 | | | Access to consumption environments: PDP, Domino, SCP, AI Bench, IO Platform | | | | | | |
| 10.3.1 | | Access Status Management | View current access across all collections, pending requests, terms accepted, training requirements and completion status | | | | | | |
| 10.3.2 | | | Request access on behalf of team members (Team Lead) | | | | | | |
| 11.1.1 | **11. Notification System** [Notifications](https://az-dcm-poc.vercel.app/collectoid-v2/notifications) | In App Notification Centre | Notification bell with unread count badge in header | | | | | | |
| 11.1.2 | | | View notifications chronologically, filter by type (approvals, access changes, collection updates, system alerts), mark read individually or bulk, action links to relevant items | | | | | | |
| 11.2.1 | | Notification Types | Approval request and decision notifications (in app and email) | | | | | | |
| 11.2.2 | | | Access change notifications: granted, revoked, scope change | | | | | | |
| 11.2.3 | | | Metadata change alerts from auto flag triggers | | | | | | |
| 11.2.4 | | | SLA escalation notifications: first reminder then manager escalation | | | | | | |
| 11.2.5 | | | DPO early notification on collection submission | | | | | | |
| 11.2.6 | | | Version change, quarterly review deadline, training, and proposition update notifications | | | | | | |
| 11.3.1 | | Email Notifications | AstraZeneca branded email template with dynamic content, direct action link, unsubscribe and preference link | | | | | | |
| 11.4.1 | | Notification Preferences | Per notification type: in app only, email only, both, none | | | | | | |
| 11.4.2 | | | Digest frequency: immediate, daily, weekly | | | | | | |
| 11.4.3 | | | Default preferences per role with user override | | | | | | |
| 11.5.1 | | SLA Tracking | SLA countdown visible in approval queue; requests nearing breach highlighted | | | | | | |
| 12.1.1 | **12. Introduction & Onboarding** [Intro](https://az-dcm-poc.vercel.app/collectoid-v2) · [Dashboard](https://az-dcm-poc.vercel.app/collectoid-v2/dashboard) | Role Based Landing Page | DCM: create collections shortcut, pipeline overview, analytics shortcuts | | | | | | |
| 12.1.2 | | | Data Consumer: discover data guidance, browse collections shortcut, check my access | | | | | | |
| 12.1.3 | | | Approver: pending approvals queue, recent decisions summary | | | | | | |
| 12.1.4 | | | Team Lead: team overview, team access status summary | | | | | | |
| 12.2.1 | | Contextual Help | Context sensitive help panel per page | | | | | | |
| 12.2.2 | | | Workspace guide for new users | | | | | | |
| 12.2.3 | | | Glossary of terms: OAC, AoT, d code, DCM, DDO, DCL, ROAM, etc. | | | | | | |
| 12.3.1 | | Role Based Navigation & Sidebar | DCM sidebar: Dashboard, Create, Collections, Analytics, Propositions | | | | | | |
| 12.3.2 | | | Data Consumer sidebar: Discover, My Access, Browse, Requests | | | | | | |
| 12.3.3 | | | Approver sidebar: Approval Queue, Collections (read only), History | | | | | | |
| 12.3.4 | | | Team Lead sidebar: Team Dashboard, Collections, Requests | | | | | | |
| 12.3.5 | | | Role change updates navigation dynamically | | | | | | |
| 12.4.1 | | Guided Onboarding | Welcome flow with feature tour, key concepts introduction, mandatory training gate before data access | | | | | | |
| 13.1.1 | **13. Analytics & Reporting** [Analytics](https://az-dcm-poc.vercel.app/collectoid/dcm/analytics) | Demand Analytics | Demand gap analysis heatmap (TA x data type) with gap scores, trend indicators, multiple visualisations (grid, bubble, treemap, radial) | | | | | | |
| 13.2.1 | | Collection Suggestion Engine | Recommended new collections based on demand gaps with gap score and projected user count | | | | | | |
| 13.2.2 | | | Top datasets to include | | | | | | |
| 13.2.3 | | | Create Collection button pre fills the workspace from suggestion | | | | | | |
| 13.2.4 | | | Two strategies: TA gaps and intent based gaps | | | | | | |
| 13.3.1 | | Collection Crossover Visualisation | Show which datasets appear in multiple collections to identify patterns and redundancy | | | | | | |
| 13.4.1 | | Compliance & Audit Reports | Access history reports, governance decision reports, audit trail export, quarterly reporting, regulatory submission support | | | | | | |
| 14.1.1 | **14. Authentication & Session** [Login](https://az-dcm-poc.vercel.app/login) | Authentication | Login via Azure AD / Entra ID (corporate SSO); no local accounts; auto redirect on unauthenticated access; return to app after auth; logout clears session | | | | | | |
| 14.2.1 | | Session Management | Server side session validation, secure cookies (HttpOnly, SameSite Strict, Secure), short lived tokens with refresh | | | | | | |
| 15.1.1 | **15. Audit Trail** *(not yet built in POC)* | Audit Logging | Every state changing operation produces an immutable audit record (action, actor, timestamp, entity, before and after state); records cannot be updated or deleted (DB trigger enforced) | | | | | | |
| 15.2.1 | | Audit Trail Viewing | View audit log for a specific collection; filter by action type, actor, date range; export | | | | | | |
| 16.1.1 | **16. Propositions** [Propositions](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/propositions) | Proposition Creation | Create a proposition to modify datasets, terms, users, or activities on a live collection. Propositions are like change requests that go through their own approval lifecycle. | | | | | | |
| 16.1.2 | | | Multiple concurrent propositions per collection | | | | | | |
| 16.2.1 | | Proposition Lifecycle | Draft, Submitted, Approved, Merged lifecycle | | | | | | |
| 16.2.2 | | | In scope changes may auto merge without approval | | | | | | |
| 16.2.3 | | | Out of scope changes require re approval | | | | | | |
| 16.2.4 | | | Conflicts between propositions resolved at merge time | | | | | | |
| 16.2.5 | | | Rejected propositions are terminal | | | | | | |
| 16.3.1 | | Proposition Triage (AI Assisted) | AI recommendation badges: Auto Approve, Suggest Merge, Needs Review; estimated review time; quick stats on auto approvable count | | | | | | |

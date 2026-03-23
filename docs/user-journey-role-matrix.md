# User Journey / Role Matrix

## MVP Scope (DCM Users)

| # | Feature Area | Sub-Section | Capability                                                                                                   | Role 1 | Role 2 | Role 3 | Role 4 | Role 5 | Role 6 |
|---|---|---|--------------------------------------------------------------------------------------------------------------|---|---|---|---|---|---|
| 1.1.1 | **1. Collections Browser** [Browse](https://az-dcm-poc.vercel.app/collectoid-v2/collections) | Navigation | Click collection card to open its detail page                                                                | | | | | | |
| 1.2.1 | | Filters | Filter by access (only show collections I have access to)                                                    | | | | | | |
| 1.2.2 | | | Other filters: scope, governance status, study phase, data modality, and therapeutic area          | | | | | | |
| 2.1.1 | **2. Collection Detail View** [Example](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1) | Overview | [Visibility] Access provisioning breakdown (Already Open, Awaiting Policy, Needs Approval, Missing)          | | | | | | |
| 2.1.2 | | | [Visibility] Health score and progress indicator                                                             | | | | | | |
| 2.2.1 | | Datasets | [Visibility] Per dataset compliance status (ethical, legal, DPR, locked)                                     | | | | | | |
| 2.2.2 | | | [Visibility] Per dataset access provisioning breakdown                                                       | | | | | | |
| 2.2.3 | | | Approve, reject, or mark-as-aware on datasets (filtered by approver's TA)                                    | | | | | | |
| 2.3.1 | | Data Use Terms | [Visibility] View Data Use Terms including primary use, beyond primary use, publication, and prohibited uses | | | | | | |
| 2.4.1 | | Users / Team | [Visibility] View collection users with roles and training compliance status                                 | | | | | | |
| 2.4.2 | | | Contact user group leads via email or Teams                                                                  | | | | | | |
| 2.5.1 | | Discussion | Post a comment (update, question, blocker, or suggestion)                                                    | | | | | | |
| 2.5.2 | | | Reply to a comment                                                                                           | | | | | | |
| 2.5.3 | | | @mention a user (triggers notification)                                                                      | | | | | | |
| 2.5.4 | | | Pin or unpin a comment                                                                                       | | | | | | |
| 2.5.5 | | | Share a comment                                                                                              | | | | | | |
| 2.5.6 | | | React to a comment                                                                                           | | | | | | |
| 2.5.7 | | | Mark a blocker as resolved with resolution notes                                                             | | | | | | |
| 2.6.1 | | Progress | [Visibility] Approval status per TA                                                                          | | | | | | |
| 2.6.2 | | | [Visibility] Per dataset provisioning status                                                                 | | | | | | |
| 2.6.3 | | | [Visibility] Timeline with milestone completion and blocker impact                                           | | | | | | |
| 2.7.1 | | Actions | Approve a draft collection (transitions draft to active)                                                     | | | | | | |
| 2.7.2 | | | Send progress update email (with AD recipient search and auto-generated summary)                             | | | | | | |
| 2.7.3 | | | Create a derivation (navigates to customize page)                                                            | | | | | | |
| 2.7.4 | | | Request access to collection                                                                                 | | | | | | |
| 2.8.1 | | Role Based Adaptation | DCM sees management controls: edit, submit, manage users                                                     | | | | | | |
| 2.8.2 | | | Data Consumer sees read only view with Request Access button                                                 | | | | | | |
| 2.8.3 | | | Approver sees approve/reject filtered to their TA                                                            | | | | | | |
| 2.8.4 | | | Team Lead sees team management and membership controls                                                       | | | | | | |
| 3.1.1 | **3. Collection Creation & Workspace** [Concept](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create) · [Workspace](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace) | Concept Creation | Create a new collection concept (private to creator until promoted)                                          | | | | | | |
| 3.1.2 | | | Edit collection title and description                                                                        | | | | | | |
| 3.1.3 | | | Generate a shareable read only preview link                                                                  | | | | | | |
| 3.2.1 | | AI Suggestions | Auto-analyse collection intent and suggest filters, activities, and terms                                    | | | | | | |
| 3.3.1 | | Dataset Selection [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/datasets) | Add or remove datasets from the collection                                                                   | | | | | | |
| 3.3.2 | | | [Visibility] ROAM fields per dataset: locked status, DPR, compliance, data availability                      | | | | | | |
| 3.4.1 | | Activities [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/activities) | Add or remove permitted activities from predefined list                                                      | | | | | | |
| 3.4.2 | | | [Visibility] Governance warnings on activities not permitted under Primary Use                               | | | | | | |
| 3.4.3 | | | [Visibility] AI-recommended activities based on selected datasets                                            | | | | | | |
| 3.5.1 | | Data Use Terms [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/terms) | Configure primary use, beyond primary use, and publication permissions                                       | | | | | | |
| 3.5.2 | | | Configure external sharing permissions                                                                       | | | | | | |
| 3.5.3 | | | Acknowledge or remove datasets when terms conflict with dataset restrictions                                 | | | | | | |
| 3.5.4 | | | [Visibility] Real time conflict detection showing affected datasets and severity                             | | | | | | |
| 3.5.5 | | | Define user scope by department, role, or explicit PRID                                                      | | | | | | |
| 3.6.1 | | Access & Users [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/roles) | Add or remove Immuta role groups to define access scope                                                      | | | | | | |
| 3.6.2 | | | Add individual users by name or PRID                                                                         | | | | | | |
| 3.7.1 | | Promote to Draft | Promote concept to draft (requires Datasets, Activities, Terms complete)                                     | | | | | | |
| 3.7.2 | | | [Visibility] Access provisioning breakdown and potential issues before promotion                             | | | | | | |

---

## Future Scope

| # | Feature Area | Sub-Section | Functionality | Role 1 | Role 2 | Role 3 | Role 4 | Role 5 | Role 6 |
|---|---|---|---|---|---|---|---|---|---|
| 4.1.1 | **4. Search & AI Discovery** [Discovery](https://az-dcm-poc.vercel.app/collectoid-v2/discover) · [AI Search](https://az-dcm-poc.vercel.app/collectoid-v2/discover/ai) | Discovery Landing | Choose discovery method: AI assisted or manual browse; feature badges explaining each path | | | | | | |
| 4.2.1 | | AI Natural Language Search | Enter natural language query e.g. "oncology biomarker studies from 2024" | | | | | | |
| 4.2.2 | | | AI interprets intent and ranks results by relevance | | | | | | |
| 4.2.3 | | | Filters auto populated from query (TA, Data Type, Year) and modifiable | | | | | | |
| 4.2.4 | | | No results shows helpful message with alternative suggestions | | | | | | |
| 4.2.5 | | | Smart Filter UI: three visual states (prompt, active, paused), toggle between active and paused, edit query, clear to reset | | | | | | |
| 4.3.1 | | Editable Keywords | Extracted keyword badges displayed; click to remove and re filter; add new keywords via button | | | | | | |
| 4.4.1 | | Collection & Dataset Selection | Add to Request button on collection and dataset cards; mixed selection supported | | | | | | |
| 4.4.2 | | | Access breakdown bar on each card | | | | | | |
| 4.5.1 | | Enhanced Collection Cards (Discovery) | Four segment access breakdown progress bar with dataset preview d code badges | | | | | | |
| 4.6.1 | | Enhanced Dataset Cards (Discovery) | Collection crossover display showing which collections contain this dataset | | | | | | |
| 4.6.2 | | | Access eligibility breakdown bar | | | | | | |
| 4.6.3 | | | Frequently bundled with section | | | | | | |
| 4.7.1 | | Floating Bottom Selection Bar | Collapsed: icon with count, quick stats, Clear All, Continue with Request | | | | | | |
| 4.7.2 | | | Expanded: aggregate access breakdown, scrollable selected items, remove individual | | | | | | |
| 4.7.3 | | | Continue with Request navigates to AI review page | | | | | | |
| 4.8.1 | | AI Review / Summary Page | AI generates summary: suggested name, intent, data scope, access summary, recommendations | | | | | | |
| 4.8.2 | | | Editable request name with character counter | | | | | | |
| 4.8.3 | | | Summary sections: Data Scope, Detected Intent, Access Summary, AI Recommendations | | | | | | |
| 4.8.4 | | | Selected items review with match score badges | | | | | | |
| 4.8.5 | | | Submit request saves as named group in My Requests | | | | | | |
| 4.9.1 | | Taxonomy Browser | Hierarchical taxonomy (TA, SDTM, ADaM, Specialized) with expandable tree and collection counts per node; click to filter browser | | | | | | |
| 4.10.1 | | Similar & Related Collections | Similar Collections on detail page based on dataset/TA overlap, user profile, history; click to navigate | | | | | | |
| 4.11.1 | | Collection Comparison | Select 2 or 3 collections for side by side comparison of scope, terms, users, datasets, access, environments; differences highlighted | | | | | | |
| 5.1.1 | **5. Data Access Request Flow** [Request](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1/request) · [My Requests](https://az-dcm-poc.vercel.app/collectoid-v2/my-requests) | Request Access | Request access to a collection from browser or detail page | | | | | | |
| 5.1.2 | | | Declare intent and justify access need | | | | | | |
| 5.1.3 | | | Review matching and eligibility | | | | | | |
| 5.1.4 | | | Submit request and track status | | | | | | |
| 5.2.1 | | Access Provisioning | Access auto provisioned via Immuta policies on approval | | | | | | |
| 5.2.2 | | | Training gate: mandatory training must be complete before access granted | | | | | | |
| 5.2.3 | | | Access to consumption environments: PDP, Domino, SCP, AI Bench, IO Platform | | | | | | |
| 5.3.1 | | Access Status Management | View current access across all collections, pending requests, terms accepted, training requirements and completion status | | | | | | |
| 5.3.2 | | | Request access on behalf of team members (Team Lead) | | | | | | |
| 6.1.1 | **6. Collection Lifecycle Management** [Collection Detail](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1) | Draft Management | Edit all fields of a draft collection (reopens the workspace) | | | | | | |
| 6.1.2 | | | Auto save with "last saved" timestamp | | | | | | |
| 6.1.3 | | | Changes tracked and versioned per edit | | | | | | |
| 6.2.1 | | Submit for Approval | Submit draft for approval. All required fields must be complete or submission is blocked. | | | | | | |
| 6.2.2 | | | Validation summary shown if submission blocked (lists incomplete fields) | | | | | | |
| 6.2.3 | | | System auto identifies required TA Lead approvers based on the studies' TAs | | | | | | |
| 6.2.4 | | | System auto creates one approval request per TA | | | | | | |
| 6.2.5 | | | Early notification sent to DPO on submission | | | | | | |
| 6.3.1 | | Governance Stage Transitions | Concept to Draft transition (promotion) | | | | | | |
| 6.3.2 | | | Draft to Pending Approval transition (submission) | | | | | | |
| 6.3.3 | | | Pending Approval to Approved transition | | | | | | |
| 6.3.4 | | | Pending Approval to Rejected transition | | | | | | |
| 6.3.5 | | | Rejected to Draft transition (revise and resubmit) | | | | | | |
| 6.3.6 | | | Invalid transitions blocked with error message | | | | | | |
| 6.3.7 | | | Audit event created on every valid transition | | | | | | |
| 6.4.1 | | Operational State Transitions | Auto initialise to Provisioning on approval | | | | | | |
| 6.4.2 | | | Provisioning to Live transition | | | | | | |
| 6.4.3 | | | Live to Suspended transition (emergency stop) | | | | | | |
| 6.4.4 | | | Suspended to Live transition (reinstatement after resolution) | | | | | | |
| 6.4.5 | | | Suspended to Decommissioned transition | | | | | | |
| 6.4.6 | | | Invalid transitions blocked | | | | | | |
| 6.5.1 | | In Scope Modifications (No Re Approval) | Add study within the approved OAC scope via proposition | | | | | | |
| 6.5.2 | | | Remove study within approved scope via proposition | | | | | | |
| 6.5.3 | | | In scope propositions auto merge without governance re approval | | | | | | |
| 6.5.4 | | | New version created on merge | | | | | | |
| 6.5.5 | | | Affected users notified | | | | | | |
| 6.6.1 | | Out of Scope Modifications (Re Approval Required) | System detects changes outside approved scope (e.g. new TA not in original approval) | | | | | | |
| 6.6.2 | | | Proposition flagged for re approval | | | | | | |
| 6.6.3 | | | Data Use Term changes trigger re approval | | | | | | |
| 6.6.4 | | | Fresh TA Lead signatures required | | | | | | |
| 6.6.5 | | | DCM informed of re approval requirement and can proceed or withdraw | | | | | | |
| 6.6.6 | | | Withdrawal leaves collection unchanged | | | | | | |
| 6.7.1 | | Suspension | Suspend a live collection (emergency stop) | | | | | | |
| 6.7.2 | | | All access immediately revoked via Immuta policy removal | | | | | | |
| 6.7.3 | | | All affected users notified | | | | | | |
| 6.7.4 | | | Reinstate after resolution (approver reviews and reinstates) | | | | | | |
| 6.7.5 | | | Immuta policies reapplied on reinstatement | | | | | | |
| 6.8.1 | | Decommission | Decommission a collection. Reason is mandatory. | | | | | | |
| 6.8.2 | | | All active access revoked | | | | | | |
| 6.8.3 | | | All affected users notified | | | | | | |
| 6.8.4 | | | Collection retained for audit (read only, shows Decommissioned badge in search) | | | | | | |
| 6.9.1 | | Auto Flag on Metadata Change | AZCT sync detects metadata change and study is auto flagged | | | | | | |
| 6.9.2 | | | Consent withdrawal flags study as Restricted with reason | | | | | | |
| 6.9.3 | | | Flagged study visually highlighted with reason | | | | | | |
| 6.9.4 | | | DCM and stakeholders notified | | | | | | |
| 6.9.5 | | | DCM can remove, investigate, or override flag | | | | | | |
| 7.1.1 | **7. Dataset Management** [Workspace Datasets](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/datasets) | Browse & Add Datasets | Search and filter ROAM enriched catalog (by d code, study name, TA, phase, status, geography, sponsor type, locked status, DPR) | | | | | | |
| 7.1.2 | | | View ROAM enriched fields: locked status, DPR, compliance, data availability | | | | | | |
| 7.1.3 | | | Preview dataset with full ROAM metadata | | | | | | |
| 7.1.4 | | | Add individual datasets or bulk add | | | | | | |
| 7.2.1 | | Dataset Detail Panel | View core metadata: d code, name, description, TA, phase, status, patients, geography | | | | | | |
| 7.2.2 | | | View clinical metadata: enrollment dates, completion dates, sponsor info | | | | | | |
| 7.2.3 | | | View ROAM fields: locked status with reason, DPR, data availability | | | | | | |
| 7.2.4 | | | View compliance status: ethical, legal, DPR | | | | | | |
| 7.2.5 | | | View data availability and access breakdown per source | | | | | | |
| 7.2.6 | | | View frequently bundled dataset suggestions | | | | | | |
| 7.3.1 | | Modality / Source Matrix Editor | Matrix view: rows = datasets, columns = modalities, cells = selected source | | | | | | |
| 7.3.2 | | | Click cell to select source from dropdown | | | | | | |
| 7.3.3 | | | Bulk operation: apply source to all datasets for a modality | | | | | | |
| 7.3.4 | | | Missing sources highlighted with warning | | | | | | |
| 7.4.1 | | Compliance Status | View per study ethical and legal status: confirmed, pending, flagged | | | | | | |
| 7.4.2 | | | View ROAM compliance fields: DPR, locked status with reason, data availability | | | | | | |
| 7.4.3 | | | Studies with First Subject In before 2013 flagged as not eligible for 90 route | | | | | | |
| 7.4.4 | | | Flagged studies visually highlighted with reason in tooltip | | | | | | |
| 7.5.1 | | Remove Dataset | Impact analysis before removal showing users affected and approval chain impact | | | | | | |
| 7.5.2 | | | Confirm removal. New version created with audit trail. | | | | | | |
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
| 9.1.1 | **9. Propositions** [Propositions](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/propositions) | Proposition Creation | Create a proposition to modify datasets, terms, users, or activities on a live collection. Propositions are like change requests that go through their own approval lifecycle. | | | | | | |
| 9.1.2 | | | Multiple concurrent propositions per collection | | | | | | |
| 9.2.1 | | Proposition Lifecycle | Draft, Submitted, Approved, Merged lifecycle | | | | | | |
| 9.2.2 | | | In scope changes may auto merge without approval | | | | | | |
| 9.2.3 | | | Out of scope changes require re approval | | | | | | |
| 9.2.4 | | | Conflicts between propositions resolved at merge time | | | | | | |
| 9.2.5 | | | Rejected propositions are terminal | | | | | | |
| 9.3.1 | | Proposition Triage (AI Assisted) | AI recommendation badges: Auto Approve, Suggest Merge, Needs Review; estimated review time; quick stats on auto approvable count | | | | | | |
| 10.1.1 | **10. Approval Workflow** [Collection Detail (Approvals)](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1) | Approval Routing | Route approval requests by therapeutic area (one request per TA) | | | | | | |
| 10.1.2 | | | Route to multiple approver types: DDO, GPT, TALT, Alliance Manager | | | | | | |
| 10.1.3 | | | Partnership studies additionally routed to Alliance Manager | | | | | | |
| 10.1.4 | | | Cross TA collections create separate approval request per TA | | | | | | |
| 10.2.1 | | Approver Queue | View all pending approval requests | | | | | | |
| 10.2.2 | | | Filter by request type (with count badges), sort by SLA remaining, mark items as reviewed | | | | | | |
| 10.3.1 | | Approval Review Interface | Review filtered to only the approver's TA studies (for cross TA collections) | | | | | | |
| 10.3.2 | | | View compliance status per study | | | | | | |
| 10.3.3 | | | View Data Use Terms summary | | | | | | |
| 10.3.4 | | | View previous approval decisions for cross TA context | | | | | | |
| 10.3.5 | | | Access discussion thread within review | | | | | | |
| 10.4.1 | | Approval Decision Actions | Approve with optional comments | | | | | | |
| 10.4.2 | | | Reject with mandatory reason (blocked without reason) | | | | | | |
| 10.4.3 | | | Request changes with specific feedback (DCM notified) | | | | | | |
| 10.4.4 | | | Delegate to another qualified approver with reason and expected duration | | | | | | |
| 10.5.1 | | Digital Signature / Acknowledgement | In app digital acknowledgement capturing identity, role, decision, timestamp, comments | | | | | | |
| 10.5.2 | | | Immutably stored in audit events table | | | | | | |
| 10.6.1 | | Cross TA "All or Nothing" Enforcement | Single TA rejection blocks the entire collection for ALL TAs | | | | | | |
| 10.6.2 | | | Blocking status shows which TA rejected and why | | | | | | |
| 10.6.3 | | | All TAs must approve for the collection to proceed to approved | | | | | | |
| 10.6.4 | | | Per TA visual status indicators: approved, pending, rejected | | | | | | |
| 10.6.5 | | | Approver name and decision date shown per TA | | | | | | |
| 10.7.1 | | Post Approval Triggers | All approved triggers provisioning (Immuta policy + Starburst access via SQS) | | | | | | |
| 10.7.2 | | | DCM notified of provisioning start | | | | | | |
| 10.7.3 | | | Partial approvals do not trigger provisioning | | | | | | |
| 10.8.1 | | Auto Revoke & Re Approval | Metadata change invalidates approval and access is auto revoked | | | | | | |
| 10.8.2 | | | Stakeholders notified with affected studies, change details, revoked access | | | | | | |
| 10.8.3 | | | Decision change invalidates prior approvals and new requests are routed | | | | | | |
| 10.9.1 | | Quarterly Opt In/Opt Out Review | DCM creates review cycle with proposed study changes | | | | | | |
| 10.9.2 | | | DDOs notified with structured review interface | | | | | | |
| 10.9.3 | | | DDOs provide per study decisions (approve or reject continued inclusion) with comments | | | | | | |
| 10.9.4 | | | Outcomes aggregated, collection updated, version snapshot created | | | | | | |
| 10.9.5 | | | Opted out studies removed and affected users notified | | | | | | |
| 10.10.1 | | Bulk Approval | Select multiple studies for bulk approval | | | | | | |
| 10.10.2 | | | System pre verifies metadata for all selected | | | | | | |
| 10.10.3 | | | Approve all passing studies in a single action (per study audit records) | | | | | | |
| 10.10.4 | | | Failing studies flagged with reasons and individually reviewable | | | | | | |
| 10.11.1 | | Proposition Review | Review proposed changes to live collections | | | | | | |
| 10.11.2 | | | Assess whether changes introduce new governance concerns | | | | | | |
| 10.11.3 | | | Approve, reject, or request changes on propositions | | | | | | |
| 10.11.4 | | | Approved propositions auto merged | | | | | | |
| 11.1.1 | **11. Versioning & Change Management** *(not yet built in POC)* | Automatic Versioning | New immutable version snapshot on every meaningful change with auto incremented number, full JSONB state, human readable summary, classified change type | | | | | | |
| 11.1.2 | | | Snapshots are immutable (modifications rejected) | | | | | | |
| 11.2.1 | | Version History Browser | View chronological list of all versions: number, summary, type, author, timestamp; click to view full snapshot in read only mode | | | | | | |
| 11.3.1 | | Version Comparison (Diff View) | Select two versions for side by side comparison | | | | | | |
| 11.3.2 | | | View added datasets (green) and removed datasets (red) | | | | | | |
| 11.3.3 | | | View changed terms, user scope changes, status changes | | | | | | |
| 11.3.4 | | | Compare non adjacent versions (e.g. v1 vs v12) | | | | | | |
| 11.4.1 | | Change Artifacts | Timestamped artifact on every change: before state, after state, actor, role, timestamp | | | | | | |
| 11.4.2 | | | Linked to audit events table; immutable and available for compliance queries | | | | | | |
| 11.5.1 | | Version Change Notifications | Access impacting changes trigger notifications to affected users; non access impacting changes do not | | | | | | |
| 11.6.1 | | Quarterly Review Cycle | DCM creates review cycle for active collection | | | | | | |
| 11.6.2 | | | DDOs notified and provide per study decisions (approve or reject) with comments | | | | | | |
| 11.6.3 | | | Outcomes aggregated into new immutable version; opted out studies removed and affected users notified | | | | | | |
| 12.1.1 | **12. Notification System** [Notifications](https://az-dcm-poc.vercel.app/collectoid-v2/notifications) | In App Notification Centre | Notification bell with unread count badge in header | | | | | | |
| 12.1.2 | | | View notifications chronologically, filter by type (approvals, access changes, collection updates, system alerts), mark read individually or bulk, action links to relevant items | | | | | | |
| 12.2.1 | | Notification Types | Approval request and decision notifications (in app and email) | | | | | | |
| 12.2.2 | | | Access change notifications: granted, revoked, scope change | | | | | | |
| 12.2.3 | | | Metadata change alerts from auto flag triggers | | | | | | |
| 12.2.4 | | | SLA escalation notifications: first reminder then manager escalation | | | | | | |
| 12.2.5 | | | DPO early notification on collection submission | | | | | | |
| 12.2.6 | | | Version change, quarterly review deadline, training, and proposition update notifications | | | | | | |
| 12.3.1 | | Email Notifications | AstraZeneca branded email template with dynamic content, direct action link, unsubscribe and preference link | | | | | | |
| 12.4.1 | | Notification Preferences | Per notification type: in app only, email only, both, none | | | | | | |
| 12.4.2 | | | Digest frequency: immediate, daily, weekly | | | | | | |
| 12.4.3 | | | Default preferences per role with user override | | | | | | |
| 12.5.1 | | SLA Tracking | SLA countdown visible in approval queue; requests nearing breach highlighted | | | | | | |
| 13.1.1 | **13. Analytics & Reporting** [Analytics](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/analytics) | Demand Analytics | Demand gap analysis heatmap (TA x data type) with gap scores, trend indicators, multiple visualisations (grid, bubble, treemap, radial) | | | | | | |
| 13.2.1 | | Collection Suggestion Engine | Recommended new collections based on demand gaps with gap score and projected user count | | | | | | |
| 13.2.2 | | | Top datasets to include | | | | | | |
| 13.2.3 | | | Create Collection button pre fills the workspace from suggestion | | | | | | |
| 13.2.4 | | | Two strategies: TA gaps and intent based gaps | | | | | | |
| 13.3.1 | | Collection Crossover Visualisation | Show which datasets appear in multiple collections to identify patterns and redundancy | | | | | | |
| 13.4.1 | | Compliance & Audit Reports | Access history reports, governance decision reports, audit trail export, quarterly reporting, regulatory submission support | | | | | | |
| 14.1.1 | **14. Introduction & Onboarding** [Intro](https://az-dcm-poc.vercel.app/collectoid-v2) · [Dashboard](https://az-dcm-poc.vercel.app/collectoid-v2/dashboard) | Role Based Landing Page | DCM: create collections shortcut, pipeline overview, analytics shortcuts | | | | | | |
| 14.1.2 | | | Data Consumer: discover data guidance, browse collections shortcut, check my access | | | | | | |
| 14.1.3 | | | Approver: pending approvals queue, recent decisions summary | | | | | | |
| 14.1.4 | | | Team Lead: team overview, team access status summary | | | | | | |
| 14.2.1 | | Contextual Help | Context sensitive help panel per page | | | | | | |
| 14.2.2 | | | Workspace guide for new users | | | | | | |
| 14.2.3 | | | Glossary of terms: OAC, AoT, d code, DCM, DDO, DCL, ROAM, etc. | | | | | | |
| 14.3.1 | | Role Based Navigation & Sidebar | DCM sidebar: Dashboard, Create, Collections, Analytics, Propositions | | | | | | |
| 14.3.2 | | | Data Consumer sidebar: Discover, My Access, Browse, Requests | | | | | | |
| 14.3.3 | | | Approver sidebar: Approval Queue, Collections (read only), History | | | | | | |
| 14.3.4 | | | Team Lead sidebar: Team Dashboard, Collections, Requests | | | | | | |
| 14.3.5 | | | Role change updates navigation dynamically | | | | | | |
| 14.4.1 | | Guided Onboarding | Welcome flow with feature tour, key concepts introduction, mandatory training gate before data access | | | | | | |
| 15.1.1 | **15. Authentication & Session** [Login](https://az-dcm-poc.vercel.app/login) | Authentication | Login via Azure AD / Entra ID (corporate SSO); no local accounts; auto redirect on unauthenticated access; return to app after auth; logout clears session | | | | | | |
| 15.2.1 | | Session Management | Server side session validation, secure cookies (HttpOnly, SameSite Strict, Secure), short lived tokens with refresh | | | | | | |
| 16.1.1 | **16. Audit Trail** *(not yet built in POC)* | Audit Logging | Every state changing operation produces an immutable audit record (action, actor, timestamp, entity, before and after state); records cannot be updated or deleted (DB trigger enforced) | | | | | | |
| 16.2.1 | | Audit Trail Viewing | View audit log for a specific collection; filter by action type, actor, date range; export | | | | | | |

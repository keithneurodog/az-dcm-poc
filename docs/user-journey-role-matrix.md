# User Journey / Role Matrix

> **Purpose:** Map platform capabilities to business roles. Each row is a user-facing capability. Mark which roles should have access. System behaviours (auto-notifications, policy enforcement, audit logging) are noted but not role-assigned as they happen automatically.
>
> **Role column guidance:** Define your business roles and name the columns accordingly. One person may appear in multiple columns. Mark each cell with **Y** (yes, has access) or leave blank (no access). Rows that describe view-only capabilities (e.g. "View ...") are inherently read-only. A **Y** means the role can see that information.

## MVP Scope

| # | Feature Area | Sub-Section | Capability | Role 1 | Role 2 | Role 3 | Role 4 | Role 5 | Role 6 |
|---|---|---|---|---|---|---|---|---|---|
| 1.1 | **1. Collections Browser** [Browse](https://az-dcm-poc.vercel.app/collectoid-v2/collections) | Navigation | Browse and open collections | | | | | | |
| 1.2 | | Filters | Filter by access level (show only collections I can access) | | | | | | |
| 1.3 | | | Filters: scope, governance status, study phase, data modality, therapeutic area | | | | | | |
| 2.1 | **2. Collection Detail** [Example](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1) | Overview | View access provisioning breakdown (Already Open, Awaiting Policy, Needs Approval, Missing) | | | | | | |
| 2.2 | | | View health score and progress indicator | | | | | | |
| 2.3 | | Datasets | View per-dataset compliance and access provisioning status | | | | | | |
| 2.4 | | | Approve, reject, or mark-as-aware on datasets (filtered by approver's TA) | | | | | | |
| 2.5 | | Data Use Terms | View Data Use Terms: primary use, beyond primary use, publication, prohibited uses | | | | | | |
| 2.6 | | Users / Team | View collection users with roles and training compliance status | | | | | | |
| 2.7 | | | Contact user group leads via email or Teams | | | | | | |
| 2.8 | | Discussion | Participate in discussion (post, reply, @mention, react, share) | | | | | | |
| 2.9 | | | Pin or unpin a comment | | | | | | |
| 2.10 | | | Mark a blocker as resolved with resolution notes | | | | | | |
| 2.11 | | Progress | View approval status per TA, per-dataset provisioning status, and timeline with milestones | | | | | | |
| 2.12 | | Actions | Approve a draft collection (transitions draft to active) | | | | | | |
| 2.13 | | | Send progress update email (with AD recipient search and auto-generated summary) | | | | | | |
| 2.14 | | | Create a derivation | | | | | | |
| 2.15 | | | Request access to collection | | | | | | |
| 3.1 | **3. Collection Creation & Workspace** [Concept](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create) | Concept Creation | Create a new collection concept (private to creator until promoted) | | | | | | |
| 3.2 | | | Edit collection title and description | | | | | | |
| 3.3 | | | Generate a shareable read-only preview link | | | | | | |
| 3.4 | | AI Suggestions | Auto-analyse collection intent and suggest filters, activities, and terms | | | | | | |
| 3.5 | | Dataset Selection [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/datasets) | Add or remove datasets from the collection | | | | | | |
| 3.6 | | | View ROAM fields per dataset: locked status, DPR, compliance, data availability | | | | | | |
| 3.7 | | Activities [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/activities) | Add or remove permitted activities | | | | | | |
| 3.8 | | | View governance warnings and AI-recommended activities | | | | | | |
| 3.9 | | Data Use Terms [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/terms) | Configure primary use, beyond primary use, publication, and external sharing permissions | | | | | | |
| 3.10 | | | Resolve conflicts when terms conflict with dataset restrictions | | | | | | |
| 3.11 | | | Define user scope by department, role, or explicit PRID | | | | | | |
| 3.12 | | Access & Users [Demo](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/roles) | Add or remove Immuta role groups and individual users | | | | | | |
| 3.13 | | Promote to Draft | Promote concept to draft (requires Datasets, Activities, Terms complete) | | | | | | |
| 3.14 | | | View access provisioning breakdown and potential issues before promotion | | | | | | |

---

## Future Scope

| # | Feature Area | Sub-Section | Capability | Role 1 | Role 2 | Role 3 | Role 4 | Role 5 | Role 6 |
|---|---|---|---|---|---|---|---|---|---|
| 4.1 | **4. Search & AI Discovery** [Discovery](https://az-dcm-poc.vercel.app/collectoid-v2/discover) · [AI Search](https://az-dcm-poc.vercel.app/collectoid-v2/discover/ai) | Discovery | Choose discovery method: AI-assisted or manual browse | | | | | | |
| 4.2 | | AI Search | Search using natural language queries with auto-populated filters and ranked results | | | | | | |
| 4.3 | | | Manage extracted keyword badges (add, remove, re-filter) | | | | | | |
| 4.4 | | Selection | Select collections and datasets to build a request (mixed selection supported) | | | | | | |
| 4.5 | | | View access breakdown and dataset crossover info on collection and dataset cards | | | | | | |
| 4.6 | | AI Review | AI-generated request summary (name, intent, scope, access, recommendations); edit and submit | | | | | | |
| 4.7 | | Taxonomy Browser | Browse hierarchical taxonomy (TA, SDTM, ADaM, Specialized) to filter collections | | | | | | |
| 4.8 | | Comparison | Compare 2-3 collections side by side (scope, terms, users, datasets, access) | | | | | | |
| 5.1 | **5. Data Access Request Flow** [Request](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1/request) · [My Requests](https://az-dcm-poc.vercel.app/collectoid-v2/my-requests) | Request Access | Request access: declare intent, review eligibility, submit and track status | | | | | | |
| 5.2 | | | Request access on behalf of team members | | | | | | |
| 5.3 | | Access Provisioning | *System:* Access auto-provisioned via Immuta on approval; training gate enforced; environments: PDP, Domino, SCP, AI Bench, IO Platform | | | | | | |
| 5.4 | | Access Status | View current access, pending requests, terms accepted, training requirements and completion | | | | | | |
| 6.1 | **6. Collection Lifecycle** [Detail](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1) | Draft Management | Edit all fields of a draft collection (auto-save, change tracking) | | | | | | |
| 6.2 | | Submit for Approval | Submit draft for approval (validation blocks incomplete submissions) | | | | | | |
| 6.3 | | | *System:* Auto-identifies required TA Lead approvers; creates one approval request per TA; notifies DPO | | | | | | |
| 6.4 | | Governance Transitions | Manage governance stages: Concept, Draft, Pending Approval, Approved, Rejected (revise and resubmit) | | | | | | |
| 6.5 | | Operational Transitions | Manage operational stages: Provisioning, Live, Suspended, Decommissioned | | | | | | |
| 6.6 | | In-Scope Modifications | Add or remove studies within approved OAC scope via proposition (auto-merges without re-approval) | | | | | | |
| 6.7 | | Out-of-Scope Modifications | Propose changes outside approved scope; decide whether to proceed with re-approval or withdraw | | | | | | |
| 6.8 | | | *System:* Out-of-scope changes (e.g. new TA, term changes) flagged for re-approval with fresh TA Lead signatures | | | | | | |
| 6.9 | | Suspension | Suspend a live collection as an emergency stop, immediately revoking all access | | | | | | |
| 6.10 | | | Reinstate a suspended collection after resolution | | | | | | |
| 6.11 | | Decommission | Decommission a collection with mandatory reason (access revoked, retained for audit) | | | | | | |
| 6.12 | | Metadata Change Flags | *System:* AZCT sync auto-flags studies on metadata or consent changes; DCM and stakeholders notified | | | | | | |
| 6.13 | | | Investigate, remove, or override a flagged study | | | | | | |
| 7.1 | **7. Dataset Management** [Datasets](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/datasets) | Browse & Add | Search and filter ROAM-enriched dataset catalog | | | | | | |
| 7.2 | | | Add datasets individually or in bulk | | | | | | |
| 7.3 | | Dataset Detail | View full dataset metadata: core, clinical, ROAM fields, compliance, access breakdown, bundled suggestions | | | | | | |
| 7.4 | | Modality / Source Matrix | Configure data sources per dataset per modality (individual or bulk) | | | | | | |
| 7.5 | | Compliance | View per-study ethical and legal status, ROAM compliance fields, and pre-2013 eligibility flags | | | | | | |
| 7.6 | | Remove Dataset | Remove a dataset (impact analysis shown: affected users, approval chain impact) | | | | | | |
| 8.1 | **8. Role Assignment & Teams** [Roles](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/create/workspace/roles) | Governance Roles | Assign DCL and DDO via Azure AD search; nominate Collection Leader | | | | | | |
| 8.2 | | | *System:* Minimum role validation: at least one DCL and one DDO required for submission | | | | | | |
| 8.3 | | Virtual Teams | Create teams, manage members, bulk import via CSV or AD group | | | | | | |
| 8.4 | | Bulk Assignment | Assign users by organisation or role (preview before confirming) | | | | | | |
| 8.5 | | | *System:* AD group membership changes auto-synced with notifications | | | | | | |
| 9.1 | **9. Propositions** [Propositions](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/propositions) | Create & Manage | Create propositions to modify datasets, terms, users, or activities on a live collection | | | | | | |
| 9.2 | | Lifecycle | Manage proposition lifecycle: Draft, Submitted, Approved, Merged (concurrent propositions supported) | | | | | | |
| 9.3 | | | *System:* In-scope changes may auto-merge; out-of-scope requires re-approval; conflicts resolved at merge | | | | | | |
| 9.4 | | AI Triage | View AI recommendation badges (Auto Approve, Suggest Merge, Needs Review) with estimated review time | | | | | | |
| 10.1 | **10. Approval Workflow** [Approvals](https://az-dcm-poc.vercel.app/collectoid-v2/collections/col-1) | Routing | *System:* Requests routed by TA to DDO, GPT, TALT, or Alliance Manager; cross-TA collections get one request per TA | | | | | | |
| 10.2 | | Approver Queue | View pending approvals; filter by type, sort by SLA remaining, mark as reviewed | | | | | | |
| 10.3 | | Review Interface | Review approval request: compliance status, Data Use Terms, prior decisions, discussion thread (filtered to approver's TA) | | | | | | |
| 10.4 | | Decision Actions | Approve (with optional comments) | | | | | | |
| 10.5 | | | Reject (with mandatory reason) | | | | | | |
| 10.6 | | | Request changes with specific feedback | | | | | | |
| 10.7 | | | Delegate to another qualified approver | | | | | | |
| 10.8 | | Digital Signature | In-app digital acknowledgement (identity, role, decision, timestamp, comments), immutably stored | | | | | | |
| 10.9 | | Cross-TA Enforcement | View per-TA approval status indicators (single TA rejection blocks all TAs) | | | | | | |
| 10.10 | | Quarterly Review | Create review cycle with proposed study changes | | | | | | |
| 10.11 | | | Provide per-study opt-in/opt-out decisions with comments | | | | | | |
| 10.12 | | Bulk Approval | Bulk-approve multiple studies in a single action (system pre-verifies, flags failures) | | | | | | |
| 10.13 | | Proposition Review | Review, approve, reject, or request changes on propositions to live collections | | | | | | |
| 10.14 | | | *System:* All-approved triggers provisioning; metadata changes auto-revoke and re-route approvals | | | | | | |
| 11.1 | **11. Versioning & Change Management** *(not yet built)* | Version History | Browse version history with summaries and view any past version snapshot | | | | | | |
| 11.2 | | Version Comparison | Compare any two versions side by side (datasets added/removed, terms changed, scope changes) | | | | | | |
| 11.3 | | | *System:* Immutable version snapshot created on every meaningful change; change artifacts linked to audit trail | | | | | | |
| 11.4 | | Quarterly Review | Create review cycle for active collection; aggregate outcomes into new version | | | | | | |
| 11.5 | | | Provide per-study decisions (approve or reject continued inclusion) with comments | | | | | | |
| 12.1 | **12. Notifications** [Notifications](https://az-dcm-poc.vercel.app/collectoid-v2/notifications) | Notification Centre | View, filter, and manage notifications (approvals, access changes, collection updates, system alerts) | | | | | | |
| 12.2 | | | *System:* Notifications triggered for: approval requests/decisions, access changes, metadata flags, SLA escalations, DPO submission alerts, version changes, training, proposition updates | | | | | | |
| 12.3 | | Preferences | Configure notification preferences per type (in-app, email, both, none) and digest frequency | | | | | | |
| 12.4 | | SLA Tracking | View SLA countdown in approval queue with nearing-breach requests highlighted | | | | | | |
| 13.1 | **13. Analytics & Reporting** [Analytics](https://az-dcm-poc.vercel.app/collectoid-v2/dcm/analytics) | Demand Analytics | Demand gap analysis heatmap (TA x data type) with multiple visualisation modes | | | | | | |
| 13.2 | | Collection Suggestions | AI-recommended new collections based on demand gaps; pre-fill workspace from suggestion | | | | | | |
| 13.3 | | Crossover Analysis | View dataset reuse across collections to identify patterns and redundancy | | | | | | |
| 13.4 | | Compliance Reports | Access history, governance decisions, audit trail export, quarterly and regulatory reporting | | | | | | |
| 14.1 | **14. Onboarding & Navigation** [Intro](https://az-dcm-poc.vercel.app/collectoid-v2) · [Dashboard](https://az-dcm-poc.vercel.app/collectoid-v2/dashboard) | Dashboard | Role-adapted landing page with relevant shortcuts and summaries | | | | | | |
| 14.2 | | Help | Contextual help panels, workspace guide, glossary of terms | | | | | | |
| 14.3 | | Navigation | Role-based sidebar navigation (dynamically updates on role change) | | | | | | |
| 14.4 | | Onboarding | Guided welcome flow with feature tour and mandatory training gate | | | | | | |
| 15.1 | **15. Authentication** [Login](https://az-dcm-poc.vercel.app/login) | Auth & Session | *System:* Azure AD / Entra ID SSO; server-side session validation; secure token management | | | | | | |
| 16.1 | **16. Audit Trail** *(not yet built)* | Audit Logging | *System:* Immutable audit record on every state change (action, actor, timestamp, before/after state) | | | | | | |
| 16.2 | | Audit Viewing | View and filter audit log per collection; export for compliance | | | | | | |

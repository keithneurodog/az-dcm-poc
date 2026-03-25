# High-Level Responsibilities

> Responsibility map for Collectoid. Each entry describes what a role does, not how the UI works.

## Roles

| Abbr | Role |
|------|------|
| DCM | Data Collection Manager |
| DC | Data Consumer |
| TL | Team Lead |
| APP | Approver (DDO / GPT / TALT) |

## Responsibility x Role Matrix

Ordered by priority (core functionality first).

| # | Responsibility | DCM | DC | TL | APP |
|----|--------------------------------------|:----------:|:--------:|:-----------------:|:----------:|
| 1 | Create a data collection | **Own** | | | |
| 2 | Browse and discover collections | View all | View all | View all | View all |
| 3 | Submit collection for approval | **Own** | | | |
| 4 | Review and approve a collection | | | | **Own** |
| 5 | Access data in a live collection | | **Own** | Request on behalf | |
| 6 | Propose changes to a live collection | **Own** | | Request | |
| 7 | Review and approve a proposition | | | | **Own** |
| 8 | Manage team access and compliance | | | **Own** | |
| 9 | Monitor collection health and status | **Own** | View own | View team | View owned |
| 10 | Suspend a collection | | | | **Own** |
| 11 | Reinstate a suspended collection | Coordinate | | | **Own** |
| 12 | Decommission a collection | **Own** | | | |
| 13 | Complete onboarding and training | View | **Own** | **Own** | View |
| 14 | Receive notifications and act | All | All | All | All |
| 15 | Search datasets | **Own** | Browse | | |
| 16 | Manage quarterly review cycle | Facilitate | | | **Own** |
| 17 | Export compliance and audit reports | **Own** | | | View |

## Responsibility Definitions

**1. Create a data collection**
DCM authors a new Open Access Collection. Starts with a lightweight concept (title, description), then completes sections in a non-linear workspace: datasets, activities, data use terms, and access groups. Concludes when the DCM promotes the concept to a formal draft.

**2. Browse and discover collections**
Any authenticated user can search, filter, and browse published collections in grid or list view. Filters include therapeutic area, status, owner, and dataset count. DCMs also see their own private concepts.

**3. Submit collection for approval**
DCM confirms all required sections are complete and submits the draft into the multi-stage governance approval pipeline. The collection transitions from `draft` to `pending_approval` and enters the approval chain.

**4. Review and approve a collection**
Approvers (DDO, GPT, TALT) review a pending collection's scope, datasets, data use terms, and user list. For multi-TA collections, all relevant TA approvers must sign (all-or-nothing). Approvers can approve, reject (mandatory feedback), or request changes.

**5. Access data in a live collection**
Data consumers discover a live collection, review its terms and permitted activities, and gain access. Access is provisioned automatically via Immuta policies generated on approval. Team leads can request on behalf of their team. Access may be gated by mandatory training.

**6. Propose changes to a live collection**
DCM creates a proposition to modify datasets, terms, users, or activities on a live collection. In-scope changes (within approved OAC boundaries) auto-merge. Out-of-scope changes require governance re-approval. Multiple concurrent propositions are supported; conflicts are resolved at merge.

**7. Review and approve a proposition**
Approvers review a submitted proposition against the existing approved scope. They assess whether changes introduce new governance concerns. Approvers can approve, reject, or request changes. Approved propositions are merged into the collection automatically.

**8. Manage team access and compliance**
Team leads monitor which members have active access, track training completion, verify data use stays within permitted terms, and revoke access when no longer required. Team leads are accountable for their staff's compliance.

**9. Monitor collection health and status**
Stakeholders view a collection's governance stage and operational state. Includes provisioning progress, access breakdown, and open propositions. Each role sees information relevant to their responsibilities.

**10. Suspend a collection**
A DDO or governance body triggers an emergency suspension on a live collection, immediately revoking all user access via Immuta. Used for safety concerns, compliance violations, or legal holds. All affected users are notified.

**11. Reinstate a suspended collection**
Once the triggering issue is resolved, the DCM coordinates with governance to prepare for reinstatement. The approver reviews the resolution and reinstates the collection. Immuta policies are re-applied and access is restored.

**12. Decommission a collection**
DCM retires a collection that is no longer needed. All access is revoked, Immuta policies are removed, and the collection is soft-deleted (preserved for audit but hidden from the browser). Can be triggered from `live` or `suspended`.

**13. Complete onboarding and training**
New users are introduced through a guided onboarding flow. Data consumers and team leads must complete mandatory training before accessing data. Training status is visible to team leads and may gate access requests.

**14. Receive notifications and act**
All users receive notifications triggered by system events: approval requests, status changes, access changes, proposition updates, training reminders, and review deadlines. Users can act directly from notifications. Preferences are configurable per user.

**15. Search datasets**
DCMs search for datasets to add to a collection. Includes catalog browsing with filters (TA, phase, modality) and AI-assisted discovery where the user describes their intent in natural language and receives ranked recommendations.

**16. Manage quarterly review cycle**
Periodic governance process where all live collections are reassessed. DCM facilitates the cycle (compiling status, chasing responses, flagging overdue reviews). Approvers review each collection to confirm continued justification and make opt-in/opt-out decisions per study.

**17. Export compliance and audit reports**
DCMs and approvers generate reports on access history, governance decisions, and audit trails. Reports support regulatory submissions, internal compliance reviews, and quarterly governance reporting.

---

## Collection State Model

A collection's state has two independent dimensions.

### Governance Stage

```
concept > draft > pending_approval > approved
                                   > rejected > draft (revision)
```

| Transition | Triggered by | Detail |
|---|---|---|
| concept > draft | DCM | All required sections complete, promoted via confirmation |
| draft > pending_approval | DCM | Submitted for governance review |
| pending_approval > approved | Approvers | All-or-nothing across the approval chain |
| pending_approval > rejected | Approvers | Returns to draft for revision |

### Operational State (applies once approved)

```
provisioning > live > suspended > live (or decommissioned)
                    > decommissioned
```

| Transition | Triggered by | Detail |
|---|---|---|
| > provisioning | System | Immuta policies generated on approval |
| provisioning > live | System | All policies applied, access granted |
| live > suspended | DDO / governance | Emergency stop, access revoked via Immuta |
| suspended > live | DDO / governance | Issue resolved, access reinstated |
| live > decommissioned | DCM | Collection retired, soft-deleted for audit |
| suspended > decommissioned | DCM | Suspended collection permanently retired |

### Propositions

Propositions represent proposed changes to a live collection. Multiple per collection are allowed concurrently. Conflicts are resolved at merge.

```
draft > submitted > approved > merged
                  > rejected
```

In-scope changes may skip approval and go directly from `submitted` to `merged`.

| Transition | Triggered by | Detail |
|---|---|---|
| draft > submitted | DCM | Proposition to modify datasets, terms, users, etc. |
| submitted > approved | Approvers | Re-approval required (e.g. restricted dataset added) |
| submitted > merged | System | No governance impact, auto-merged |
| submitted > rejected | Approvers | Proposition rejected |
| approved > merged | System | Approved proposition merged into collection |

### Example Composite States

| Governance | Operational | Meaning |
|---|---|---|
| approved | live | Normal active collection |
| approved | suspended | Emergency-stopped |
| approved | provisioning | Just approved, policies being generated |
| draft | n/a | Still being authored |

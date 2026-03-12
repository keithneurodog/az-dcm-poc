# Summary: Role-based Open Access Model (ROAM) - Guidance v1.1

**Source:** `00. Final Documentation - 2025/Role-based Open Access Model - Guidance v1.1.md`
**Type:** Procedure/Guidance Document
**Workstream:** 2025 Baseline (foundational for WP1)
**Date:** 13 January 2026 (v1.1)
**Authors:** Henry Constable, Ben Barnard, Jamie MacPherson

---

## Key Points

- **Definition:** ROAM = "Role-based Open Access Model" - access paradigm for scale and speed across R&D `[ref: Section 1.2]`
- **Core concept:** Top-down approval of 'data collections' and 'terms of use' - groups of users granted open access to collections of data `[ref: Section 1.2]`
- **Key difference from request-based access:** Users continuously covered by top-down agreement, removing need for repetitive individual approvals `[ref: Section 1.2]`

---

## Entities/Concepts Defined

### Open Access Collection (OAC) Agreement `[ref: Section 2.1]`
- Specified scope of strictly confidential clinical trial data that consumers can potentially access under ROAM
- Defined using multiple criteria: logical, business-based, scientific, or technical aspects
- **Inclusion mechanisms:**
  - **Included:** Included by default automatically
  - **Included, opt-out:** Included by default with active review for opt-out
  - **Included, opt-in:** Included only after active opt-in review
- **Exclusion Criteria:** Always removed from scope by default

### Data Use Terms (AOT) `[ref: Section 2.2]`
- Formally written, approved document defining terms of use for an Open Access Collection
- **One AOT = One OAC** (but multiple AOTs can exist per OAC for different user groups)
- **Four main elements:**
  1. Base Definition (identifier, descriptive name)
  2. Data Scope (reference to OAC)
  3. Terms and Conditions of Use (permitted uses as rules)
  4. User Scope (people or systems, named or by criteria)

---

## Role Accountabilities `[ref: Section 3]`

| Role | Accountability |
|------|----------------|
| **Data Owner / Delegate Data Owner** | Approve OAC Agreement and AOT; accountable for data and its use |
| **Data Consumer Lead** | Accountable for staff's work; ensure data use within AOT bounds |
| **R&D Data Office Lead** | Own creation of OAC/AOT; facilitate setup, maintenance, compliance audit |

---

## Process Steps (A-F) `[ref: Section 4]`

| Step | Name | Description |
|------|------|-------------|
| **(A)** | Agreement in Principle (AIP) | Seek sponsorship from Data Owners, Consumer Leads, DO Leads |
| **(B)** | OAC Agreement | Define data scope with inclusions/exclusions, get DDO approval |
| **(C)** | Data Use Terms (AOT) | Define who accesses what data under what terms; DDO approval |
| **(D)** | Implement Open Data Access | Translate to study/user lists, training, technical setup |
| **(E)** | Open Access Granted | Users access via Data Product Solution, Golden Ticket, etc. |
| **(F)** | Maintain Open Collections | Periodic review, compliance checks, incremental updates |

### Implementation Details (Step D) `[ref: Section 4]`

**Collection Manager components:**
- **Study Manager:** SharePoint List with PowerBI front-end showing in-scope studies
- **People Manager:** List of in-scope users based on AOT criteria
- **Rollout:** Comms materials, change management

**Training requirements:**
- Users must complete mandatory training before access
- Links to User Guide with training links

### Project Lifecycle (Step E) `[ref: Section 4]`

1. **Ideation:** Define scientific question, identify candidate studies via ROAM Dashboard
2. **Pre-planning:** Validate analysis is appropriate and compliant (self-review)
3. **Execution:** Access data via approved mechanisms (PDP, Golden Ticket)
4. **Close Down:** Complete Project Completion Form

---

## Guardrails/Policies `[ref: Section 1.3]`

ROAM operates under:
- Global Standard: Internal Sharing of Scientific Data (STND-0001498)
- SOP: Internal Sharing of Scientific Data (SOP-0067196)
- Management of Important New Safety Issues

**Does NOT override:**
- Safety signal processes
- Approval to publish process
- Cybersecurity best practices for strictly confidential data

---

## Conflicts/Contradictions

- None within document (this is the authoritative guidance)

---

## Open Questions

- Approval completion date and effective date marked as `<insert date>` - not finalized `[ref: header table]`

---

## Cross-References

- Supersedes: Earlier versions of guidance
- Related to: C2 (User Guide v2.0), C3 (Document Index), C4 (User Journey), C5 (User Guide v1.0)
- This is the foundational document for WP1 (Extended 90-10)
- Implements concepts for Collectoid UI (WP4)

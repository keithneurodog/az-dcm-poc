# User Journey Flows & Role Crossover

## Core Lifecycle — End-to-End Swimlane

This diagram shows the primary collection lifecycle and where roles hand off to each other.

```mermaid
sequenceDiagram
    participant DCM as DCM<br/>(Collection Manager)
    participant SYS as System<br/>(Collectoid)
    participant APP as Approver<br/>(DDO/GPT/TALT)
    participant DC as Data Consumer
    participant TL as Team Lead

    Note over DCM,TL: ── PHASE 1: CREATE (DCM-owned) ──

    DCM->>SYS: Create collection concept
    SYS-->>DCM: Private workspace created
    DCM->>SYS: Add datasets from catalog
    DCM->>SYS: Define activities & terms
    DCM->>SYS: Assign access groups & users
    DCM->>SYS: Promote concept to draft
    SYS-->>DCM: Draft created (v1 snapshot)

    Note over DCM,TL: ── PHASE 2: SUBMIT & APPROVE (DCM → Approver handoff) ──

    DCM->>SYS: Submit draft for approval
    SYS->>APP: Notify: new approval request (per TA)
    SYS->>SYS: Create approval chain (all-or-nothing)

    loop Each TA Lead
        APP->>SYS: Review collection (datasets, terms, users)
        alt Approve
            APP->>SYS: Approve (with comments)
        else Reject
            APP->>SYS: Reject (mandatory reason)
            SYS->>DCM: Notify: rejected, revise and resubmit
            DCM->>SYS: Revise draft
            DCM->>SYS: Resubmit
            SYS->>APP: Notify: resubmitted
            APP->>SYS: Approve
        else Request Changes
            APP->>SYS: Request changes (feedback)
            SYS->>DCM: Notify: changes requested
            DCM->>SYS: Address feedback
        end
    end

    SYS->>SYS: All TAs approved → governance_stage = approved

    Note over DCM,TL: ── PHASE 3: PROVISION & ACCESS (System → Consumer) ──

    SYS->>SYS: operational_state = provisioning
    SYS->>SYS: Create Immuta policies (async via SQS)
    SYS->>SYS: Configure Starburst/Ranger ACLs
    SYS->>SYS: operational_state = live
    SYS->>DCM: Notify: collection is live
    SYS->>DC: Notify: new collection available

    DC->>SYS: Browse collections
    DC->>SYS: View collection detail & terms
    DC->>SYS: Request access
    SYS-->>DC: Access granted (if training complete)

    TL->>SYS: Request access on behalf of team
    SYS-->>TL: Team access granted

    Note over DCM,TL: ── PHASE 4: LIVE OPERATIONS (ongoing) ──

    DCM->>SYS: Create proposition (modify datasets/terms)
    alt In-scope change
        SYS->>SYS: Auto-merge proposition
    else Out-of-scope change
        SYS->>APP: Notify: re-approval needed
        APP->>SYS: Review & approve proposition
        SYS->>SYS: Merge proposition, new version
    end
    SYS->>DC: Notify: collection updated
```

## Role Crossover Map

Shows which journeys involve handoffs between roles.

```mermaid
graph LR
    subgraph "DCM-Only Flows"
        A1[Create concept]
        A2[Build workspace]
        A3[Promote to draft]
        A4[Edit draft]
        A5[Export reports]
        A6[Decommission]
    end

    subgraph "DCM → Approver"
        B1[Submit for approval]
        B2[Create proposition]
        B3[Facilitate quarterly review]
    end

    subgraph "Approver-Only Flows"
        C1[Review approval queue]
        C2[Approve / Reject]
        C3[Delegate approval]
        C4[Bulk approve]
        C5[Suspend collection]
        C6[Reinstate collection]
    end

    subgraph "System → Consumer"
        D1[Provisioning via Immuta]
        D2[Access granted]
        D3[Access revoked]
    end

    subgraph "Consumer Flows"
        E1[Browse collections]
        E2[View detail & terms]
        E3[Request access]
        E4[Complete training]
    end

    subgraph "Team Lead Flows"
        F1[Request on behalf of team]
        F2[Monitor team compliance]
    end

    subgraph "Shared by All Roles"
        G1[Browse collections]
        G2[View collection detail]
        G3[Discussion / comments]
        G4[Receive notifications]
    end

    A3 -->|submit| B1
    B1 -->|routes to| C1
    C2 -->|all approved| D1
    D1 --> D2
    D2 --> E1
    B2 -->|out-of-scope| C1
    B3 -->|DDO reviews| C1
    C5 -->|revokes| D3
    F1 -->|grants| D2

    style B1 fill:#f9d,stroke:#333
    style B2 fill:#f9d,stroke:#333
    style B3 fill:#f9d,stroke:#333
    style D1 fill:#bdf,stroke:#333
    style D2 fill:#bdf,stroke:#333
    style D3 fill:#bdf,stroke:#333
```

## MVP vs Future — Flow Scope

```mermaid
graph TB
    subgraph "MVP (Q1 2026)"
        M1[Browse collections]
        M2[Search & filter]
        M3[View collection detail]
        M4[Create concept]
        M5[Build workspace]
        M6[Promote to draft]
        M7[Discussion & comments]
        M8[Role-based views]
    end

    subgraph "Q2: Manage & Request"
        Q2A[Full creation wizard]
        Q2B[D-code resolution]
        Q2C[Access request flow]
        Q2D[Team management]
    end

    subgraph "Q3: Approve & Explain"
        Q3A[Multi-TA approval]
        Q3B[Propositions]
        Q3C[Notifications]
        Q3D[Suspension / reinstatement]
    end

    subgraph "Q4: Audit & Optimize"
        Q4A[Version comparison]
        Q4B[Quarterly reviews]
        Q4C[Analytics & reporting]
        Q4D[Compliance export]
    end

    M6 -.->|enables| Q2A
    Q2A -.->|enables| Q3A
    Q3A -.->|enables| Q4B
    Q2C -.->|requires| Q3A
    Q3B -.->|requires| Q3A
    Q3C -.->|supports| Q3A
```

## Prioritized Journey List (All Roles Combined)

Frequency: how often this journey is performed across all users.

| Priority | Journey | Primary Role | Crosses To | Frequency |
|----------|---------|-------------|------------|-----------|
| 1 | Browse & discover collections | All | — | Very High (daily) |
| 2 | View collection detail | All | — | Very High (daily) |
| 3 | Create a new collection | DCM | — | High (weekly) |
| 4 | Build workspace (datasets, terms, users) | DCM | — | High (weekly) |
| 5 | Receive notifications & act | All | — | High (daily) |
| 6 | Review approval queue | APP | — | High (daily) |
| 7 | Submit for approval | DCM | APP | Medium (weekly) |
| 8 | Approve / reject collection | APP | DCM, DC | Medium (weekly) |
| 9 | Request access to collection | DC | — | Medium (weekly) |
| 10 | Participate in discussion | All | — | Medium (daily) |
| 11 | Monitor collection health | DCM | — | Medium (weekly) |
| 12 | Propose changes to live collection | DCM | APP | Medium (monthly) |
| 13 | Request access on behalf of team | TL | DC | Medium (monthly) |
| 14 | Monitor team compliance | TL | — | Medium (monthly) |
| 15 | Review & approve proposition | APP | DCM | Low (monthly) |
| 16 | Complete onboarding & training | DC, TL | — | Low (once) |
| 17 | Quarterly review cycle | DCM, APP | — | Low (quarterly) |
| 18 | Delegate approval | APP | APP | Low (as needed) |
| 19 | Suspend collection | APP | DCM, DC | Rare (emergency) |
| 20 | Reinstate collection | APP, DCM | DC | Rare (post-emergency) |
| 21 | Decommission collection | DCM | DC | Rare (end-of-life) |
| 22 | Export compliance reports | DCM | — | Low (quarterly) |

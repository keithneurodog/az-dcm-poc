# DOVS2 Program Vision - Unified Synthesis

**Generated:** January 2026
**Primary Focus:** WP4 (UI & Agentic AI) for Collectoid Prototype
**Source:** 42 documents across 7 groups

---

## Executive Summary

DOVS2 (Data Office Value Stream 2) is transforming how AstraZeneca R&D shares and accesses clinical trial data. The program implements a **Role-based Open Access Model (ROAM)** where 90% of data needs are met through pre-approved open collections, reducing the friction of repetitive individual access requests.

### North Star Vision (from AZ Agentic AI Workshop):

> "Seamlessly delivering trusted, AI-ready data—governed responsibly and accessed effortlessly—to empower science, accelerate discovery, and unlock competitive advantage across R&D. By expanding the boundaries of what data can do, we transform every insight into impact."

---

## The Problem

**Current State:**
- "99% of time waiting on data wrangling"
- "Data scientists spend 60% of their time wrangling data into usable form"
- "We're only about 20% along the journey to making access seamless"
- <5% of R&D data catalogued centrally
- Multiple uncoordinated cataloguing initiatives
- No single point of truth for what data is available

**Root Causes:**
1. Access requests are use-case-by-use-case, slow without pattern utilization
2. Policies not machine-readable, reliant on people to interpret
3. Fragmented tools and duplicated data prep pipelines
4. Competition rather than coordination between teams

---

## The Solution: ROAM (90:10 Model)

### Core Concept

**Top-down agreements** cover groups of users with access to collections of data, removing the need for repetitive individual approvals.

| Component | Description |
|-----------|-------------|
| **Open Access Collection (OAC)** | Defined scope of data (studies, modalities, geographies) |
| **Data Use Terms (AOT)** | Who can access, what they can do, under what terms |
| **90%** | User needs met through open collections |
| **10%** | Streamlined requests for edge cases (iDAP) |

### Process Flow

```
(A) Agreement in Principle
    ↓
(B) OAC Agreement (define data scope) → DDO Approval
    ↓
(C) Data Use Terms (define users/terms) → DDO Approval
    ↓
(D) Implement (study lists, user lists, training)
    ↓
(E) Access Granted (users access via PDP)
    ↓
(F) Maintain (quarterly reviews, compliance)
```

---

## Four Workstreams

| WP | Name | Focus | 2026 Goal |
|----|------|-------|-----------|
| **WP1** | Extended 90-10 | Expand collections to more TAs and users | >1,000 users with >90% data needs via open access |
| **WP2** | R&D Data Exchange | External data sharing infrastructure | Streamline vendor transfers and collaborations |
| **WP3** | Data Readiness | Metadata, data quality, PDP availability | ~1,300 more studies into PDP |
| **WP4** | UI & Agentic AI | Collectoid + Sherlock tools | Single source of truth for collections |

---

## WP4: UI & Agentic AI (PRIMARY FOCUS)

### Two Main Deliverables

#### 1. Collectoid - "90 Data Collections Manager"

**Purpose:** View, manage, and monitor access collections, access rules, and user groups.

**Key Features (by priority):**

| Priority | Feature |
|----------|---------|
| Very High | Explore collections |
| Very High | Assign datasets to collections |
| Very High | Assign users to collections |
| High | View/Manage access requests |
| High | Manage/define/execute access rules |
| High | Keep log of access rules |

**Target Metrics:**
- >1,000 users via open access
- <48h reaction time to collection changes
- >80% user satisfaction

#### 2. Sherlock - "AI-enabled Find & Explore"

**Purpose:** Find and explore data via natural language, single point of access.

**Key Features:**
- Discover what data is available/accessible
- Explore collections
- Recommend internal data

### Design Philosophy: "Agentic ≠ Chat"

> **"AI-assisted, not AI-replaced"**
> - AI suggests → User confirms
> - Intent becomes UI, not a black box
> - Existing UI patterns stay intact

---

## Key Entities Collectoid Must Manage

### Collections

| Field | Description |
|-------|-------------|
| Collection ID | e.g., OAC-001 |
| Collection Name | e.g., "BioPharma Closed Collection" |
| TA Scope | CVRM, R&I, V&I, ONC, etc. |
| Study Status | Closed (>6mo post-DBL), Ongoing, Grey Zone |
| Data Types | eCRF, omics, imaging, SDTM |
| Inclusion Criteria | Rules for auto-inclusion |
| Exclusion Criteria | Rules for auto-exclusion |

### Agreements of Terms

| Field | Description |
|-------|-------------|
| AOT ID | e.g., AOT-001 |
| AOT Name | e.g., "BioPharma Closed Collection - QS Access" |
| Data Scope | Reference to OAC |
| User Scope | By department + role type |
| Permitted Uses | Primary Use categories |
| Prohibited Uses | AI training, external sharing, etc. |

### Users

| Field | Description |
|-------|-------------|
| Department | Biometrics, ODSAI, Clinical Pharmacology |
| Role Type | Data Scientist, Statistician, Programmer |
| Access Level | Based on AOT membership |
| Training Status | Completion of 4 mandatory courses |

### Studies

| Field | Description |
|-------|-------------|
| Study Code | e.g., D7080C00001 |
| Study Name/Acronym | e.g., ALAFOSS-01 |
| Product | Drug name |
| TA | Therapeutic area |
| Status | Closed, Ongoing, Grey Zone |
| Data Location | entimICE, PDP, CTDS |
| Legal Restrictions | Any product restrictions |
| Opt-in/Opt-out Status | Review status for collection |

---

## User Journeys

### Data Consumer Journey

```
AWARENESS → COMPLIANCE → IDEATION → PRE-PLANNING → EXECUTION → CLOSE-DOWN
    ↓            ↓           ↓            ↓              ↓            ↓
  Email      Training    Dashboard   Self-check      Access      Report
  received   completed   search      vs terms        via PDP     completion
```

### Data Collection Manager Journey (Collectoid User)

```
VIEW COLLECTIONS → MANAGE DATASETS → MANAGE USERS → TRACK REQUESTS → AUDIT
       ↓                  ↓               ↓              ↓            ↓
   See scope        Add/remove      Add/remove      Approve/deny   Review
   and status       studies         access          requests       changes
```

---

## Permitted vs Prohibited Uses

### Permitted (Primary Use):
- Drug development activities
- Regulatory compliance
- Safety monitoring
- Cross-study learning
- Scientific publications (with PSO)
- AI analytics

### Prohibited:
- AI development/training
- Software development/testing
- External data sharing (without process)
- Attempting to identify individuals
- Commercial use

---

## Current Collections (2025)

| Collection | TA | Studies | In PDP | Status |
|------------|-----|---------|--------|--------|
| BioPharma Closed | CVRM, R&I, V&I | 836 | 307 | Active |
| Oncology Closed | ONC, IMMUONC | 411 | 139 | Active |
| Oncology Ongoing | ONC | 25 | 4 | In Review |

---

## Agent Personas (Future State)

| Agent | Role | Powers |
|-------|------|--------|
| **Sherlock** | Access Navigator | Find datasets, check permissions, route requests |
| **Maestro** | Data Management | Auto-tag metadata, apply standards |
| **Sherpa** | Policy Partner | Apply governance rules, explainable decisions |
| **PRISM** | Standards | Extract definitions, augment vocabulary |

---

## Key Dates & Timelines

### WP4 2026 Roadmap:
- **Q1:** Explore collections, Discover data available/accessible
- **Q2:** Manage collections, View/Create access requests, Explore data
- **Q3:** Manage access requests, Explain approvals/denials
- **Q4:** Keep log of access rules

### 18-Month Agent Roadmap:
- 0-6 months: Sherlock
- 6 months: Collectoid/Maestro
- 12 months: PRISM
- 18 months: Sherpa

---

## Key Stakeholders

| Role | Name(s) |
|------|---------|
| R&D Data Office Lead | Peder Blomgren (VP) |
| WP4 Lead | Jamie MacPherson |
| Product Manager (Collectoid) | Beata |
| Product Manager (Sherlock) | Rafa Jimenez |
| Product Owner | Divya |
| Lead Software Engineer | Keith |
| Project Manager | Cayetana Vazquez |
| Business Analyst | Marcin |

---

## Open Questions & Gaps

1. **Tech Lead** - TBC for both Collectoid and Sherlock
2. **UX/UI Designer** - TBC
3. **Priorities fine-tuning** - Pending Sponsor (Jamie) sign-off
4. **LSAF access** - Discussions ongoing (Q1 2026 updates expected)
5. **Single source of truth** - Multiple dashboards exist; Collectoid to consolidate

---

## Documents Reference

### Primary WP4 Documents:
- B1: 12Dec Workshop Output and Proposal
- B3: WS_Agentification_Priorities_4Dec (Keith's "Agentic ≠ Chat" proposal)
- B5: AZ Agentic AI Workshop Writeup

### Foundational Documents:
- C1: ROAM Guidance v1.1
- C2: User Guide v2.0
- C7: OAC Agreement Template
- C8: AOT Template

### All Summaries:
See `_synthesis/summaries/` for individual document summaries (A1-G7).

### Workstream Syntheses:
See `_synthesis/workstreams/` for consolidated workstream views.

---

## Using This Document

This VISION.md can be loaded at the start of any future session involving:
- UX design reviews
- UI implementation planning
- Feature prioritization discussions
- Stakeholder demos

Key companion files:
- `workstreams/WP4-ui-agentic-ai.md` - Detailed UI requirements
- `summaries/B3-WS-Agentification-Priorities-4Dec.md` - Keith's design philosophy
- `summaries/B5-AZ-Agentic-AI-Workshop-Writeup.md` - Agent personas and roadmap

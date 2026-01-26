# WP4: UI & Agentic AI - Workstream Synthesis

**PRIMARY FOCUS for Collectoid Prototype**

---

## Overview

WP4 delivers the user-facing tools for the ROAM (Role-based Open Access Model) data sharing transformation. The workstream produces two main applications and supporting AI capabilities.

---

## Key Deliverables

### 1. Collectoid - "90 Data Collections Manager"

**Purpose:** View, manage, and monitor access collections, access rules, and user groups to streamline role-based open access data.

**Feature Set (by priority):**

| Priority | Feature | Description |
|----------|---------|-------------|
| Very High | Explore collections | GUI for users to find/view collection info |
| Very High | Assign datasets to collections | GUI for data managers to manage data |
| Very High | Assign users to collections | GUI for data managers to manage user groups |
| High | View access requests | GUI to see request details and status |
| High | Manage access requests | GUI to approve/deny requests |
| High | Manage/define/execute access rules | Create and execute access policies |
| High | Keep log of access rules | Track rule changes |
| Medium | Track data access for compliance | Compliance monitoring |

**Target Metrics:**
- >1,000 users with >90% of data needs via open access
- <48h reaction time to collection changes
- >100 users in Collectoid
- 2x faster request processing
- >80% user satisfaction

**Timeline:**
- Q1: Explore collections
- Q2: Manage collections, View/Create access requests, Manage access rules
- Q3: Manage access requests, Explain approvals/denials
- Q4: Keep log of access rules

### 2. Sherlock - "AI-enabled Find & Explore"

**Purpose:** Find data, explore data, and enquire about data access via natural language. Single point of access to broad range of information.

**Feature Set:**

| Priority | Feature |
|----------|---------|
| Very High | Discover what data is available |
| Very High | Discover what data is accessible |
| High | Explore collections |
| Medium | Explore data |
| Low | Recommend internal data to access |

**Target Metrics:**
- At least 6 data sources integrated
- >100 user queries across data sources after 3 months
- >1,000 queries and >100 users after 3 months
- >80% user satisfaction

**Timeline:**
- Q1: Explore collections, Discover data available/accessible
- Q2: Explore data (chat with data)
- Q3: Enquiry about access services
- Q4: Explain access approvals/denials

### 3. USP - User Support Portal

**Purpose:** Enquiry about services, tools, processes & requests. Faster response for users to find and access data.

---

## Design Philosophy: "Agentic ≠ Chat"

From Keith's proposal (B3), the key design principle:

> **"AI-assisted, not AI-replaced"**
> - AI suggests → User confirms
> - Intent becomes UI, not a black box
> - Existing UI patterns stay intact

**Problems with pure chat interfaces:**
- Natural language is ambiguous
- AI can be slow and unresponsive
- AI makes mistakes and can be biased

**Solution:** Hybrid UI with AI suggestions embedded in traditional interfaces.

---

## Agent Personas (from AZ Workshop - B5)

| Agent | Role | Powers |
|-------|------|--------|
| **Sherlock** | Access Navigator | Finds/recommends datasets, checks permissions, routes through governance |
| **Maestro** | Data Management | Auto-tags metadata, applies vocabularies, ensures standards |
| **Sherpa** | Policy Partner | Applies governance rules automatically, codifies data rights, explainable decisions |
| **PRISM** | Standards | Extracts definitions, augments with synonyms, proposes vocabulary entries |

**18-Month Roadmap:**
- 0-6 months: Sherlock
- 6 months: Collectoid (as Maestro)
- 12 months: PRISM
- 18 months: Sherpa

---

## Team Allocations

| Role | Collectoid FTE | Sherlock FTE |
|------|---------------|--------------|
| Product Manager | 0.3 (Beata) | 0.3 (Rafa) |
| Product Owner | 0.4 (Divya) | 0.4 (Divya) |
| Tech Lead | 0.5 (TBC) | 0.5 (TBC) |
| Project Manager | 0.2 (Cayetana) | 0.2 (Cayetana) |
| Business Analyst | 0.5 (Marcin) | 0.5 (Marcin) |
| Lead Software Engineer | 0.5 (Keith) | 0.4 (Keith) |
| UX/UI Designer | 0.5 (TBC) | 0.5 (TBC) |
| **Total** | 5.3 FTE | 5.3 FTE |

---

## Technical Approach

- **Frontend:** React following enterprise recommendations
- **Agents:** Build and register using Agent Mesh
- **Q1 Focus:** Deliver what is feasible without extra funding
- **Build on:** Keith's Collectoid design, Catapult PoC for Sherlock

---

## Source Documents

- B1: 12Dec Workshop Output and Proposal
- B2: 12Dec Workshop Output Summary
- B3: WS_Agentification_Priorities_4Dec
- B4: 12Dec Workshop Output Summary (PDF)
- B5: AZ Agentic AI Workshop Writeup

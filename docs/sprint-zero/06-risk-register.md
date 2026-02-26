# Collectoid Production Risk Register

**Document ID:** SPRINT-ZERO-06
**Version:** 1.0
**Created:** 2026-02-06
**Status:** Draft -- Pending Stakeholder Review
**Author:** Engineering Team
**Program:** DOVS2 (Data Office Value Stream 2), WP4 -- UI & Agentic AI
**Risk Owner:** Tech Lead (TBC) / Keith Hayes (interim)

---

## Table of Contents

1. [Risk Management Overview](#1-risk-management-overview)
2. [Risk Summary Dashboard](#2-risk-summary-dashboard)
3. [Technical Risks](#3-technical-risks)
4. [Integration Risks](#4-integration-risks)
5. [Organizational Risks](#5-organizational-risks)
6. [Timeline Risks](#6-timeline-risks)
7. [Security & Compliance Risks](#7-security--compliance-risks)
8. [Operational Risks](#8-operational-risks)
9. [Risk Review Process](#9-risk-review-process)
10. [Open Questions](#10-open-questions)

### Related Documents

| Document | Path | Relevance |
|----------|------|-----------|
| Architecture Overview | `docs/sprint-zero/01-architecture-overview.md` | Technical decisions, deployment topology, open questions |
| Business Requirements | `docs/sprint-zero/02-business-requirements.md` | Scope, dependencies, assumptions, phase roadmap |
| Data Model | `docs/sprint-zero/03-data-model.md` | Database design, audit trail, versioning strategy |
| Gap Analysis | `docs/specs/collectoid-v2-gap-analysis.md` | Current-state gaps, JIRA stories VS2-329 to VS2-350 |
| UX Roles Design | `docs/collectoid-v2-ux-roles.md` | Role model, persona definitions |
| ROAM Guidance v1.1 | `docs/misc/00. Final Documentation - 2025/Role-based Open Access Model - Guidance v1.1.md` | Business process definitions |

---

## 1. Risk Management Overview

### 1.1 Purpose

This risk register identifies, assesses, and tracks risks that could affect the successful delivery of the Collectoid production application. It covers technical, integration, organizational, timeline, security, and operational risks identified during Sprint Zero.

Collectoid is replacing the legacy AZCt iDAP system (decommissioning 2026) as part of the DOVS2 program. The transition from a POC prototype to a production-grade clinical trial data access platform introduces significant risks across all categories. This register provides a structured approach to monitoring and mitigating those risks throughout the 2026 delivery cycle.

### 1.2 Risk Scoring Methodology

Each risk is assessed on two dimensions:

**Likelihood Scale (L)**

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Very Low | Unlikely to occur (<10% probability) |
| 2 | Low | Small chance of occurring (10-25%) |
| 3 | Medium | Reasonable chance of occurring (25-50%) |
| 4 | High | Likely to occur (50-75%) |
| 5 | Very High | Almost certain to occur (>75%) |

**Impact Scale (I)**

| Score | Level | Description |
|-------|-------|-------------|
| 1 | Negligible | Minimal effect on project; absorbed within normal variance |
| 2 | Minor | Small delay (<1 week) or minor feature reduction; workaround available |
| 3 | Moderate | Noticeable delay (1-3 weeks), feature deferral, or quality reduction |
| 4 | Major | Significant delay (>3 weeks), phase deferral, major scope reduction, or compliance gap |
| 5 | Critical | Project failure, regulatory non-compliance, data breach, or iDAP decommission without replacement |

**Risk Score = Likelihood x Impact**

**Risk Levels**

| Score Range | Level | Action Required |
|-------------|-------|-----------------|
| 1-6 | **Low** | Monitor; review quarterly |
| 7-12 | **Medium** | Active mitigation plan required; review monthly |
| 13-19 | **High** | Escalate to WP4 Lead; dedicated mitigation activities; review bi-weekly |
| 20-25 | **Critical** | Escalate to DOVS2 Program Board; immediate action required; review weekly |

### 1.3 Risk Response Strategies

| Strategy | Description | When to Use |
|----------|-------------|-------------|
| **Mitigate** | Take actions to reduce likelihood or impact | Default strategy for High and Critical risks |
| **Accept** | Acknowledge the risk and proceed without active mitigation | Low risks where mitigation cost exceeds potential impact |
| **Transfer** | Shift risk ownership to another party (vendor, team, insurance) | When another party is better positioned to manage the risk |
| **Avoid** | Change plans to eliminate the risk entirely | When the risk is unacceptable and an alternative path exists |

---

## 2. Risk Summary Dashboard

### 2.1 Risk Count by Level

| Risk Level | Count | Percentage |
|------------|-------|------------|
| **Critical** | 4 | 11% |
| **High** | 15 | 42% |
| **Medium** | 12 | 33% |
| **Low** | 5 | 14% |
| **Total** | **36** | 100% |

### 2.2 Top 10 Risks by Score

| Rank | Risk ID | Description | Score | Level |
|------|---------|-------------|-------|-------|
| 1 | RISK-O-001 | Requirements volatility from LT direction changes | 20 | Critical |
| 2 | RISK-O-002 | Team capacity (5.3 FTE split across 3 products) | 20 | Critical |
| 3 | RISK-TL-001 | Q1 MVP feasibility given sprint zero + ramp-up time | 20 | Critical |
| 4 | RISK-O-003 | Tech Lead and UX Designer positions still TBC | 20 | Critical |
| 5 | RISK-I-002 | Collibra 2.0 readiness (may not be available when needed) | 16 | High |
| 6 | RISK-T-007 | POC-to-production code migration (reusable vs rewrite) | 16 | High |
| 7 | RISK-TL-002 | iDAP decommission creating hard deadline | 16 | High |
| 8 | RISK-O-006 | Knowledge concentration (Keith across Collectoid + Sherlock) | 16 | High |
| 9 | RISK-T-008 | Multi-TA "all or nothing" approval workflow complexity | 15 | High |
| 10 | RISK-I-001 | AZCT API stability, availability, and rate limits | 15 | High |

### 2.3 Risk Count by Category

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| Technical | 0 | 4 | 3 | 2 | 9 |
| Integration | 0 | 4 | 2 | 0 | 6 |
| Organizational | 3 | 3 | 1 | 0 | 7 |
| Timeline | 1 | 2 | 1 | 1 | 5 |
| Security & Compliance | 0 | 1 | 2 | 1 | 4 |
| Operational | 0 | 1 | 3 | 1 | 5 |

### 2.4 Risk Heatmap

```
                         I M P A C T
              1            2            3            4            5
          Negligible     Minor       Moderate      Major       Critical
        +------------+------------+------------+------------+------------+
   5    |            |            |            | RISK-O-001 |            |
 Very   |            |            |            | RISK-O-002 |            |
 High   |            |            |            | RISK-TL-001|            |
        |            |            |            | RISK-O-003 |            |
        +------------+------------+------------+------------+------------+
   4    |            |            | RISK-T-003 | RISK-I-002 |            |
 High   |            |            | RISK-T-004 | RISK-T-007 |            |
        |            |            | RISK-OP-03 | RISK-TL-002|            |
        |            |            |            | RISK-O-006 |            |
        +------------+------------+------------+------------+------------+
L  3    |            | RISK-OP-04 | RISK-T-002 | RISK-T-008 |            |
Medium  |            | RISK-TL-04 | RISK-I-004 | RISK-I-001 |            |
        |            |            | RISK-SC-03 | RISK-O-005 |            |
        |            |            | RISK-OP-02 | RISK-SC-02 |            |
        |            |            |            | RISK-I-005 |            |
        +------------+------------+------------+------------+------------+
   2    |            | RISK-T-009 | RISK-T-005 | RISK-SC-01 |            |
 Low    |            | RISK-OP-01 | RISK-O-004 | RISK-TL-003|            |
        |            | RISK-T-001 | RISK-I-003 |            |            |
        +------------+------------+------------+------------+------------+
   1    |            | RISK-I-006 | RISK-SC-04 |            |            |
 Very   |            | RISK-T-006 | RISK-OP-05 |            |            |
 Low    |            |            |            |            |            |
        +------------+------------+------------+------------+------------+
```

---

## 3. Technical Risks

### RISK-T-001: Database Choice and Migration Complexity

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-T-001 |
| **Category** | Technical |
| **Description** | Aurora PostgreSQL is recommended but not yet confirmed as an AZ-approved service (see `01-architecture-overview.md` QUESTION-001). If the Cloud Engineering team mandates a different database (e.g., DocumentDB, DynamoDB), the data model (`03-data-model.md`) and all query patterns would require significant rearchitecting. Additionally, migration from the POC's mocked data model to a production schema carries risk of data integrity issues. |
| **Likelihood** | 2 (Low) -- Aurora PostgreSQL is commonly used at AZ per architecture doc, but approval is unconfirmed |
| **Impact** | 3 (Moderate) -- 2-4 weeks to redesign data model and ORM layer for an alternative database |
| **Risk Score** | **6** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Resolve QUESTION-001 with Cloud Engineering in Sprint Zero Week 1. 2. The data model (`03-data-model.md`) is already designed database-agnostic with schemas for both PostgreSQL and DocumentDB. 3. Validate Aurora PostgreSQL via a Terraform proof-of-concept in the AZ sandbox environment. |
| **Contingency Plan** | If PostgreSQL is not approved, fall back to DocumentDB with the alternative schema defined in `03-data-model.md` Section 9. Accept reduced query performance for complex cross-entity queries and add compensating indexes. |
| **Owner** | Tech Lead (TBC) |
| **Status** | Open |
| **Review Date** | 2026-02-14 |

---

### RISK-T-002: Next.js API Routes Scalability for Complex Workflows

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-T-002 |
| **Category** | Technical |
| **Description** | The architecture uses Next.js API route handlers as the sole API layer (see `01-architecture-overview.md` Section 7). Complex workflows like multi-TA approval coordination, provisioning orchestration, and audit event fan-out may exceed the request-response model's capabilities. Long-running operations (bulk d-code resolution for 2,000 studies, compliance report generation) could hit Fargate task timeout limits or degrade user experience. |
| **Likelihood** | 3 (Medium) -- Complex workflows are confirmed in requirements; API route limitations are known |
| **Impact** | 3 (Moderate) -- May require partial rearchitecture to background job processing mid-stream |
| **Risk Score** | **9** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Implement background job processing via SQS from the start (architecture already includes SQS/SNS, see `01-architecture-overview.md` Section 9). 2. Use async patterns for all operations exceeding 5 seconds: d-code resolution, report generation, provisioning triggers. 3. Implement proper request timeout handling with status polling endpoints. |
| **Contingency Plan** | If API routes prove insufficient for orchestration complexity, extract a lightweight worker service (Node.js process consuming from SQS) deployed as a separate ECS task. This is an incremental change, not a rewrite. |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-03-01 |

---

### RISK-T-003: External API Reliability and Availability

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-T-003 |
| **Category** | Technical |
| **Description** | Collectoid depends on 5+ external APIs (AZCT, Cornerstone, Collibra, Immuta, Starburst/Ranger) for core functionality. Any of these being unavailable, slow, or returning incorrect data would degrade or block Collectoid operations. AZCT is rated CRITICAL dependency (collection creation blocked without it), and Immuta is HIGH (provisioning blocked). Current availability SLAs and rate limits for these systems are unknown. |
| **Likelihood** | 4 (High) -- Multiple external systems increases probability of at least one being unavailable at any time |
| **Impact** | 3 (Moderate) -- Graceful degradation is possible for most integrations except AZCT and Azure AD |
| **Risk Score** | **12** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Implement circuit breaker pattern for all external API clients (see `01-architecture-overview.md` Integration Layer). 2. Cache aggressively -- AZCT metadata (1hr TTL), Collibra taxonomy (6hr TTL), Cornerstone training status (30min TTL). 3. Design fallback UIs that show cached/stale data with clear freshness indicators. 4. Document availability SLAs for each external system during Sprint Zero. |
| **Contingency Plan** | If AZCT becomes persistently unavailable, serve collection/study data from the local Aurora cache (stale but functional). If Immuta is unavailable, queue provisioning tasks in SQS with automatic retry. Publish degradation status on the health endpoint (`/api/health`). |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-02-21 |

---

### RISK-T-004: Authentication/SSO Integration Complexity

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-T-004 |
| **Category** | Technical |
| **Description** | Production authentication requires Azure AD / Entra ID integration via Auth.js (see `01-architecture-overview.md`). The POC uses a simple password-based auth system (`app/api/auth/route.ts`) that must be completely replaced. Azure AD group-to-role mapping, service principal configuration for server-to-server calls, session management across multiple ECS tasks, and MFA requirements for approval actions are all unresolved (see QUESTION-012, QUESTION-013, QUESTION-014 in architecture doc). |
| **Likelihood** | 4 (High) -- Enterprise SSO integrations at AZ routinely involve multi-week approval and configuration cycles |
| **Impact** | 3 (Moderate) -- Blocks all role-based functionality; could delay MVP if not resolved in Sprint Zero |
| **Risk Score** | **12** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Engage AZ Identity Services team in Sprint Zero Week 1. 2. Request sandbox Azure AD tenant for development. 3. Prototype Auth.js + Azure AD integration as the first technical spike. 4. Define role-to-group mapping with stakeholders (QUESTION-012). 5. Confirm whether MFA is required for approval signatures (QUESTION-014). |
| **Contingency Plan** | If Azure AD integration is delayed, implement a role-based session system with configurable identity provider, allowing development to proceed with a stub provider that mimics Azure AD tokens. Switch to real Azure AD before staging deployment. |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-02-14 |

---

### RISK-T-005: Audit Trail Implementation Meeting Regulatory Requirements

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-T-005 |
| **Category** | Technical |
| **Description** | Collectoid manages strictly confidential clinical trial data governance and must maintain a comprehensive, immutable audit trail (see `02-business-requirements.md` NFR-SEC-004, FR-AUD-001). The data model (`03-data-model.md`) defines an append-only audit_events table, but regulatory requirements (GxP, ICH E6(R2)) have not been formally confirmed for Collectoid. If classified as a regulated system, formal validation (IQ/OQ/PQ) may be required, significantly increasing delivery effort. Audit retention period is also unconfirmed (QUESTION-015). |
| **Likelihood** | 2 (Low) -- Collectoid stores metadata, not patient data; likely falls below GxP threshold |
| **Impact** | 4 (Major) -- If regulated, adds 4-8 weeks for validation documentation and testing |
| **Risk Score** | **8** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Resolve QUESTION-017 and QUESTION-018 (data classification, GxP status) with Quality team in Sprint Zero. 2. Design the audit trail to be GxP-compliant by default (append-only, timestamped, immutable, with full actor/action/entity recording) even if formal validation is not required. 3. Document audit trail design in `03-data-model.md` Section 4 as a proactive measure. |
| **Contingency Plan** | If Collectoid is classified as GxP, engage AZ Quality Engineering for a risk-based validation approach (GAMP 5 Category 5). Prioritize audit trail validation in Q3 alongside the approval workflow delivery. |
| **Owner** | Tech Lead (TBC) |
| **Status** | Open |
| **Review Date** | 2026-02-21 |

---

### RISK-T-006: Performance with Large Datasets

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-T-006 |
| **Category** | Technical |
| **Description** | Target scale is >1,000 users, >1,700 studies, >500 active collections, and >1 million audit trail records (see `02-business-requirements.md` NFR-SCAL). The d-code resolution from criteria (FR-COL-005) must resolve up to 2,000 studies within 5 seconds (NFR-PERF-007). Full-text search must respond in <500ms (NFR-PERF-002). Collections browser must render 500 collections in <1 second (NFR-PERF-003). These are achievable with Aurora PostgreSQL and proper indexing, but require deliberate performance engineering. |
| **Likelihood** | 1 (Very Low) -- Target scale is modest for a properly indexed relational database |
| **Impact** | 3 (Moderate) -- Poor performance would undermine user adoption (BO-006 satisfaction target >80%) |
| **Risk Score** | **3** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Implement performance benchmarks as part of CI/CD pipeline (target: key queries <100ms at 2x expected data volume). 2. Use cursor-based pagination for audit logs (already specified in `01-architecture-overview.md` Section 7). 3. Index strategy defined in `03-data-model.md` Section 7. 4. Redis caching for collection list summaries (5min TTL) and d-code resolution (4hr TTL). |
| **Contingency Plan** | If performance issues emerge at scale, add Aurora read replicas (architecture supports 1-3 replicas, see `01-architecture-overview.md` Section 5). Introduce materialized views for the collections browser. Partition the audit_events table by month. |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-04-01 |

---

### RISK-T-007: POC-to-Production Code Migration

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-T-007 |
| **Category** | Technical |
| **Description** | The current codebase is a POC with no backend, no database, no real integrations, and all mocked data (5,381-line `lib/dcm-mock-data.ts`). The POC-to-production assessment (see `01-architecture-overview.md` Appendix B) identifies that most infrastructure code must be rewritten: auth (complete rewrite), data layer (complete rewrite), API routes (complete rewrite), feature flags (replace). Only UI components (`components/ui/`) and TypeScript interfaces are directly reusable. The risk is underestimating the rewrite effort, especially if stakeholders perceive the POC as "almost production-ready." |
| **Likelihood** | 4 (High) -- POC-to-production transitions routinely underestimate effort; confirmed by Appendix B assessment |
| **Impact** | 4 (Major) -- 4-8 weeks of additional work if rewrite scope is underestimated, directly threatening Q1 MVP |
| **Risk Score** | **16** |
| **Risk Level** | **High** |
| **Mitigation Strategy** | 1. Communicate clearly to stakeholders that the POC is a UX validation tool, not a production starting point. 2. Use Appendix B of `01-architecture-overview.md` as the authoritative reuse assessment. 3. Plan the production build as a new project that inherits validated UI patterns, not a "continuation" of the POC. 4. Extract reusable TypeScript interfaces into a shared types package immediately. 5. Prioritize infrastructure foundation (auth, database, API scaffold) in Sprint 1 before feature work. |
| **Contingency Plan** | If stakeholders push for feature velocity over infrastructure, propose a parallel track: one developer on infrastructure foundation while others continue UI refinement using mocked data, converging in Sprint 3-4. This preserves velocity perception while building proper foundations. |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-02-14 |

---

### RISK-T-008: Multi-TA Approval Workflow Complexity

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-T-008 |
| **Category** | Technical |
| **Description** | The ROAM process requires "all or nothing" cross-TA approval (VS2-339, VS2-349): if a collection spans multiple therapeutic areas, ALL relevant TA Leads must approve; a single rejection blocks the entire collection for ALL TAs. This creates a distributed coordination problem with complex state management: partial approvals, rejection cascades, re-signature requirements on version changes (VS2-335), and delegation authority. The gap analysis identifies this as MISSING functionality. The entirely in-app approval workflow -- with built-in approval state machine, notification system, and compliance-grade audit trail -- makes this the most complex business logic in the application. |
| **Likelihood** | 3 (Medium) -- Complexity is inherent in the business process; no simplification path available |
| **Impact** | 5 (Critical) -- Incorrect approval logic could lead to unauthorized data access or blocked legitimate access |
| **Risk Score** | **15** |
| **Risk Level** | **High** |
| **Mitigation Strategy** | 1. Model the approval workflow as a finite state machine with formally defined transitions (see `01-architecture-overview.md` Flow 3). 2. Implement comprehensive unit and integration tests for all approval state transitions before deployment. 3. Use database transactions (ACID) for all approval state changes (the primary reason Aurora PostgreSQL is recommended). 4. Build approval logic in Q3 as specified in the roadmap, not as a rush addition. 5. Engage business stakeholders in approval flow design workshops during Q2 to validate edge cases. |
| **Contingency Plan** | If the built-in approval module cannot achieve the required audit trail quality by target date, implement a simplified approval workflow with manual audit supplementation while the full approval module is hardened. |
| **Owner** | Tech Lead (TBC) |
| **Status** | Open |
| **Review Date** | 2026-05-01 |

---

### RISK-T-009: Technology Stack Currency and Next.js Stability

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-T-009 |
| **Category** | Technical |
| **Description** | The architecture specifies "Next.js (latest)" with App Router (see `01-architecture-overview.md` Appendix A). Next.js has a rapid release cadence with breaking changes between major versions. Server Components, Server Actions, and the App Router are still evolving. A major Next.js update during the development cycle could force migration effort or introduce incompatibilities with Auth.js, Drizzle ORM, or other dependencies. |
| **Likelihood** | 2 (Low) -- Next.js updates are opt-in; team can pin versions |
| **Impact** | 2 (Minor) -- At most a few days of migration work if a minor breaking change occurs |
| **Risk Score** | **4** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Pin Next.js to a specific version at project start (e.g., 15.x). 2. Only upgrade deliberately with a planned migration sprint, not reactively. 3. Use Dependabot for dependency scanning but do not auto-merge major version bumps. 4. Maintain a minimal set of Next.js-specific patterns to limit migration surface area. |
| **Contingency Plan** | If a critical security vulnerability requires an urgent Next.js upgrade, allocate 1-2 sprint days for migration and regression testing. |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-06-01 |

---

## 4. Integration Risks

### RISK-I-001: AZCT API Stability, Availability, and Rate Limits

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-I-001 |
| **Category** | Integration |
| **Description** | AZCT REST API is a CRITICAL dependency (see `01-architecture-overview.md` External System Summary) -- collection creation is blocked without it. The API provides study metadata, dataset catalog, and d-code resolution. Its stability, rate limits, response latency, and data quality are unknown. AZCT is itself a legacy system scheduled for changes as part of the broader data platform evolution. If AZCT introduces breaking changes, deprecates endpoints, or experiences downtime during peak Collectoid usage, core functionality would be disrupted. QUESTION-006 (does AZCT support webhooks?) remains unresolved. |
| **Likelihood** | 3 (Medium) -- Legacy systems under transformation have elevated instability risk |
| **Impact** | 5 (Critical) -- Collection creation (the primary Collectoid workflow) is blocked |
| **Risk Score** | **15** |
| **Risk Level** | **High** |
| **Mitigation Strategy** | 1. Engage AZCT team in Sprint Zero to obtain API documentation, SLA commitments, rate limits, and deprecation roadmap. 2. Implement aggressive caching (1hr TTL for study metadata, 4hr TTL for d-code resolution) to reduce API dependency. 3. Build a local metadata cache in Aurora that can serve stale data during AZCT outages. 4. Implement circuit breaker with automatic fallback to cached data. 5. Resolve QUESTION-006 to determine if event-driven cache invalidation is possible. |
| **Contingency Plan** | If AZCT becomes unreliable, implement a nightly batch sync to populate the local Aurora cache, reducing real-time API dependency to near-zero. New studies would appear with up to 24hr delay, which is acceptable given collections are not created in real-time. |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-02-21 |

---

### RISK-I-002: Collibra 2.0 Readiness

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-I-002 |
| **Category** | Integration |
| **Description** | Collibra 2.0 is the new metadata catalog intended to provide standardized taxonomy, data lineage, and metadata quality scores. It is rated MEDIUM dependency (`01-architecture-overview.md`) with explicit note that it "may not be ready at launch; fallback to AZCT." The WP3 Data Readiness workstream is responsible for Collibra readiness, but metadata landscape discussions are still ongoing (see `docs/misc/DOVS2 2026/WP 3 Data Readiness/Metadata Landscape & Requirements/`). If Collibra 2.0 is unavailable when Collectoid needs taxonomy data (Q2 for collection criteria), the data category system has no authoritative source. |
| **Likelihood** | 4 (High) -- WP3 metadata readiness is a known dependency; landscape discussions are still in early stages |
| **Impact** | 4 (Major) -- Without a metadata taxonomy source, d-code resolution and criteria-to-study mapping may be inaccurate |
| **Risk Score** | **16** |
| **Risk Level** | **High** |
| **Mitigation Strategy** | 1. Design Collibra integration as an optional enhancement, not a hard dependency. 2. Build the taxonomy browser using a local configuration table that can be populated manually initially and synced from Collibra when available. 3. Engage WP3 monthly to track Collibra 2.0 readiness. 4. Define a "Collibra-absent" operating mode where taxonomy data is maintained locally. |
| **Contingency Plan** | If Collibra 2.0 is not ready by Q2, operate entirely on AZCT metadata plus a manually curated local taxonomy table. The 30+ data category taxonomy from the BRD (Appendix D) can be seeded as static configuration. Accept that this creates a data management overhead until Collibra is available. |
| **Owner** | Tech Lead (TBC) |
| **Status** | Open |
| **Review Date** | 2026-03-15 |

---

### RISK-I-003: Cornerstone API Access and Data Quality

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-I-003 |
| **Category** | Integration |
| **Description** | Cornerstone API provides training completion status per user, required for compliance verification before data access is granted (FR-AUD-010). The API authentication mechanism and rate limits are unknown (QUESTION-009). Training data quality may be inconsistent (delayed updates, incomplete records). If Cornerstone reports a user as non-compliant when they have completed training, it blocks legitimate access requests. |
| **Likelihood** | 2 (Low) -- Cornerstone is a mature LMS; API access is likely well-established at AZ |
| **Impact** | 3 (Moderate) -- Graceful degradation is possible (show "training status unknown" instead of blocking) |
| **Risk Score** | **6** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Resolve QUESTION-009 during Sprint Zero. 2. Implement Cornerstone as a non-blocking check: display training status but do not hard-block access requests based solely on Cornerstone data. 3. Cache training status with 30min TTL. 4. Provide a manual override for DCMs to confirm training completion when Cornerstone data is stale. |
| **Contingency Plan** | If Cornerstone API is inaccessible, implement training status as a self-declared checkbox with periodic audit against Cornerstone exports (CSV reconciliation). |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-03-01 |

---

### RISK-I-004: Immuta Policy API Complexity

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-I-004 |
| **Category** | Integration |
| **Description** | Immuta is rated HIGH dependency -- provisioning is blocked without it (`01-architecture-overview.md`). When all TA Leads approve a collection, Collectoid must trigger policy creation in Immuta and access configuration in Starburst/Ranger (see Flow 3 in architecture doc). The Immuta API contract is unknown (QUESTION-008), no sandbox environment is confirmed, and the Immuta data model analysis reveals significantly more complexity than initially estimated: two authorisation tracks (IDA vs AdHoc), criteria-based User Profiles matching over User_Tags from four sources (Manual, NPA, Workday, Cornerstone), partition-based row security via Study_ID WHERE clauses, dual AI/ML boolean flags per intent, intent-based access with category/subcategory taxonomy, and review cycles per intent. Mapping Collectoid's collection/AOT model to this multi-dimensional authorization model is a major design challenge. Incorrect policy creation could grant unauthorized access to clinical trial data. |
| **Likelihood** | 3 (Medium) -- API complexity is inherent in policy engines; sandbox availability is common for enterprise tools |
| **Impact** | 3 (Moderate) -- Provisioning is Q3 scope; there is time to resolve, but incorrect policies are a security concern |
| **Risk Score** | **9** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Resolve QUESTION-008 with Immuta team in Q1. 2. Request sandbox environment for development and testing. 3. Design Immuta integration as a "policy instruction" pattern: Collectoid generates policy instructions, a human reviews before applying (initially). 4. Automate only after the instruction pattern is validated. 5. Implement a policy verification step that confirms policies match intent before marking provisioning as complete. |
| **Contingency Plan** | If Immuta API integration proves too complex for automated provisioning by Q3, implement a "semi-automated" workflow where Collectoid generates policy instructions and sends them to the DPO team for manual execution in Immuta. This is the current process and maintains the status quo while automation is developed. |
| **Owner** | Tech Lead (TBC) |
| **Status** | Open |
| **Review Date** | 2026-04-01 |

---

### RISK-I-005: In-App Approval Module Complexity and Compliance Readiness

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-I-005 |
| **Category** | Integration |
| **Description** | The built-in approval module must handle complex multi-TA approval chains, digital acknowledgements, immutable audit trails, state machine transitions, and notification workflows. Achieving compliance-grade auditability (GxP, SOX) from day one without an established external approval system increases the implementation burden and compliance risk. The module must produce legally defensible records of who approved what, when, and under what conditions -- entirely within the application. |
| **Likelihood** | 3 (Medium) -- Building compliance-grade approval infrastructure from scratch is inherently complex |
| **Impact** | 4 (Major) -- If the audit trail does not meet compliance requirements, approvals may not be legally valid |
| **Risk Score** | **12** |
| **Risk Level** | **High** |
| **Mitigation Strategy** | 1. Design the approval state machine in Sprint Zero with compliance team review. 2. Implement comprehensive audit logging from the first approval feature. 3. Capture digital acknowledgement metadata (timestamp, IP, user agent, session). 4. Build notification system with delivery confirmation tracking. 5. Conduct compliance review of audit trail before go-live. |
| **Contingency Plan** | If compliance requirements cannot be met by MVP, implement a simplified approve/reject workflow with email confirmation as supplementary audit evidence while full compliance features are built out. |
| **Owner** | Tech Lead (TBC) |
| **Status** | Open |
| **Review Date** | 2026-04-01 |

---

### RISK-I-006: Starburst/Ranger Policy Synchronization

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-I-006 |
| **Category** | Integration |
| **Description** | Starburst/Ranger provides query-level access control and is rated HIGH dependency for data consumption (`01-architecture-overview.md`). Policy synchronization between Collectoid, Immuta, and Starburst/Ranger must be consistent -- if a user is approved in Collectoid but Ranger policies are not updated, the user sees a "provisioned" status but cannot actually query data. Conversely, if Ranger policies are created without Collectoid's knowledge, the audit trail is incomplete. |
| **Likelihood** | 1 (Very Low) -- This is a Q3/Q4 concern; significant lead time to resolve |
| **Impact** | 3 (Moderate) -- Inconsistent policy state undermines user trust and audit trail completeness |
| **Risk Score** | **3** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Define a single "provisioning orchestrator" pattern where Collectoid is the source of truth for approved access and pushes instructions to Immuta, which cascades to Ranger. 2. Implement periodic reconciliation job that compares Collectoid's approved policies with actual Ranger/Starburst state. 3. Surface reconciliation discrepancies in the DCM operations tracker (VS2-336). |
| **Contingency Plan** | If automated synchronization proves unreliable, implement a manual reconciliation workflow where DPO staff confirm provisioning status in both Collectoid and Ranger/Starburst. This matches the current manual process. |
| **Owner** | Tech Lead (TBC) |
| **Status** | Open |
| **Review Date** | 2026-06-01 |

---

### RISK-I-007: Immuta Data Model Alignment Complexity

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-I-007 |
| **Category** | Integration |
| **Description** | The Immuta authorization model depends on User_Tags sourced from four systems (Manual, NPA, Workday, Cornerstone) for criteria-based User Profile matching. Stale or missing User_Tags could cause incorrect access grants or denials. Additionally, the complete mapping between Collectoid's collection/AOT model and Immuta's multi-layered concepts (IDA/AdHoc tracks, partitions, intents, dual AI/ML flags, review cycles) has not been designed. **[TBD — METADATA FLOW]:** Pending metadata flow diagram to clarify ownership boundaries. |
| **Likelihood** | 3 (Medium) |
| **Impact** | 4 (Major) — incorrect User Profile matching directly leads to unauthorized data access or blocked legitimate access |
| **Risk Score** | **12** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Document Collectoid-to-Immuta mapping during Q2 (before Q3 provisioning). 2. Implement reconciliation check for User_Tag freshness. 3. Design partition mapping as formal contract with Immuta team. 4. Map dual AI/ML flags explicitly. |
| **Contingency Plan** | If automated mapping proves too complex, implement "policy instruction document" pattern where Collectoid generates specifications that DPO translates to Immuta policies manually. |
| **Owner** | Tech Lead (TBC) |
| **Status** | Open |
| **Review Date** | 2026-04-01 |

### RISK-I-008: Column-Level Masking Not Yet Modelled

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-I-008 |
| **Category** | Integration |
| **Description** | The PBAC metadata requirements diagram flags "Masking to be added" as a pending requirement. Column-level data masking (redacting PII, patient identifiers, sensitive clinical fields) is distinct from row-level partition security and user-level profile access. The Immuta masking mechanism was not present in the `Immuta Tables for R&D.xlsx` analysis, suggesting it is either a future Immuta feature or an existing capability not yet documented. Without masking, users who pass partition and profile checks may still see columns they should not (e.g., unmasked patient names in clinical data). |
| **Likelihood** | 3 (Medium) — masking is flagged as pending in the official PBAC diagram, suggesting it is known but not yet implemented |
| **Impact** | 4 (Major) — exposing unmasked PII in clinical trial data is a significant compliance and privacy risk |
| **Risk Score** | **12** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Engage Immuta team to confirm masking mechanism and timeline. 2. Document masking requirements alongside partition and profile requirements during Q2. 3. If Immuta masking is not available, evaluate Starburst/Ranger native masking as a fallback. |
| **Contingency Plan** | Apply Starburst column-level security policies independently of Immuta until Immuta masking is available. This creates a dual-management burden but prevents PII exposure. |
| **Owner** | Tech Lead (TBC) |
| **Status** | Open |
| **Review Date** | 2026-04-01 |

---

## 5. Organizational Risks

### RISK-O-001: Requirements Volatility from Leadership Team Decisions

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-O-001 |
| **Category** | Organizational |
| **Description** | Chat logs and meeting notes show that Leadership Team meetings produce direction changes on a weekly basis. Direct quote from planning discussions: "We will not know until next week what they all finally agreed." This creates a high-volatility requirements environment where priorities, scope, and business rules may shift between sprints. For a team of 5.3 FTE already stretched across three products, absorbing weekly pivots without schedule impact is not feasible. The ROAM model itself may undergo revisions as WP1 expands to new therapeutic areas. |
| **Likelihood** | 5 (Very High) -- Evidence from current chat logs confirms weekly direction changes are occurring |
| **Impact** | 4 (Major) -- Each significant pivot costs 1-2 sprint days in replanning plus potential rework |
| **Risk Score** | **20** |
| **Risk Level** | **Critical** |
| **Mitigation Strategy** | 1. Establish a formal change request process: all scope changes from LT must go through the Product Owner (Divya) with impact assessment before acceptance. 2. Implement 2-week sprint boundaries as a buffer -- changes accepted at sprint planning, not mid-sprint. 3. Maintain a "decisions log" that records LT decisions with dates, to prevent re-litigating resolved issues. 4. Design modular architecture (see `01-architecture-overview.md` Module Map) so that changes in one area do not cascade. 5. Push for written LT decisions rather than verbal agreements. |
| **Contingency Plan** | If requirements volatility exceeds the team's capacity to absorb, escalate to WP4 Lead (Jamie MacPherson) with a concrete impact assessment: "Accepting change X delays deliverable Y by Z weeks." Request a scope freeze for MVP features 4 weeks before the Q1 deadline. |
| **Owner** | Product Owner (Divya) / WP4 Lead (Jamie MacPherson) |
| **Status** | Open |
| **Review Date** | 2026-02-14 (and every 2 weeks thereafter) |

---

### RISK-O-002: Team Capacity (5.3 FTE Split Across 3 Products)

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-O-002 |
| **Category** | Organizational |
| **Description** | The allocated team capacity is 5.3 FTE, split across Collectoid, Sherlock (AI chatbot), and USP (User Support Portal). Keith Hayes, the Lead Software Engineer, is specifically allocated at 0.5 FTE split between Collectoid and Sherlock. Assuming ~3 FTE for Collectoid after Sherlock and USP allocation, this is insufficient for the scope defined in `02-business-requirements.md`: 7 functional requirement modules, 4 quarterly phases, 22 JIRA stories (VS2-329 to VS2-350), plus infrastructure, testing, deployment, and documentation. A rough estimate suggests 6-8 FTE is needed for the full 2026 scope. |
| **Likelihood** | 5 (Very High) -- Resource allocation is confirmed; gap between capacity and scope is structural |
| **Impact** | 4 (Major) -- Features will be deferred, quality may suffer, or deadlines will slip |
| **Risk Score** | **20** |
| **Risk Level** | **Critical** |
| **Mitigation Strategy** | 1. Ruthless prioritization: the MVP scope (`02-business-requirements.md` Section 6) is deliberately minimal for this reason. 2. Phase the roadmap so that each quarter delivers a complete, usable increment rather than partial features. 3. Automate aggressively: CI/CD, testing, infrastructure-as-code to maximize developer productivity. 4. Request additional FTE allocation if any of the three products (Collectoid, Sherlock, USP) is deprioritized. 5. Use AI-assisted development tools to accelerate coding velocity. |
| **Contingency Plan** | If velocity proves insufficient for the Q1 MVP, propose one of: (a) reduce MVP scope to collections browser only (remove basic collection creation), (b) request temporary contractor support for infrastructure setup, or (c) delay MVP to end of Q1 + 2 weeks with explicit stakeholder agreement. |
| **Owner** | WP4 Lead (Jamie MacPherson) / Project Manager (Cayetana Vazquez) |
| **Status** | Open |
| **Review Date** | 2026-02-14 (and every 2 weeks thereafter) |

---

### RISK-O-003: Tech Lead and UX Designer Positions Still TBC

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-O-003 |
| **Category** | Organizational |
| **Description** | Two critical roles remain unconfirmed: Tech Lead (who would own architecture decisions, code reviews, and technical direction) and UX Designer (who would own design system, accessibility compliance, and user testing). Keith Hayes is acting as interim technical lead at 0.5 FTE, which is insufficient for dedicated technical leadership alongside active development on two products. Without a UX Designer, the production application inherits POC-quality design patterns without user testing, accessibility audit, or design system governance. Both dependencies are flagged in the BRD as D-006 and D-007. |
| **Likelihood** | 5 (Very High) -- Positions are confirmed as TBC with no announced timeline for resolution |
| **Impact** | 4 (Major) -- Architecture decisions are deferred; design quality and accessibility compliance at risk |
| **Risk Score** | **20** |
| **Risk Level** | **Critical** |
| **Mitigation Strategy** | 1. Escalate hiring urgency to WP4 Lead with concrete impact: "Without Tech Lead by Feb 28, architecture decisions X, Y, Z remain unresolved." 2. Keith Hayes to document all interim architecture decisions with clear rationale so a future Tech Lead can validate or revise. 3. Use shadcn/ui component library (already in POC) as a de facto design system that provides built-in accessibility. 4. Schedule WCAG 2.1 AA audit for end of Q1 regardless of UX Designer status. |
| **Contingency Plan** | If Tech Lead is not appointed by end of Q1: (a) Keith Hayes continues as de facto technical lead with explicit acknowledgment that 0.5 FTE limits decision throughput; (b) architecture decisions are documented in sprint-zero docs as "interim" and flagged for review. If UX Designer is not appointed: (a) use POC's validated UI patterns as-is; (b) engage an external accessibility auditor before production launch. |
| **Owner** | WP4 Lead (Jamie MacPherson) |
| **Status** | Open |
| **Review Date** | 2026-02-14 (weekly until resolved) |

---

### RISK-O-004: Stakeholder Alignment Across WP1-WP4

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-O-004 |
| **Category** | Organizational |
| **Description** | DOVS2 operates across four workstreams with interdependencies. WP1 (Extended 90:10) defines which collections and users are in scope, WP2 (Data Exchange) handles external sharing, WP3 (Data Readiness) provides metadata and data quality, and WP4 (UI & Agentic AI) builds Collectoid, Sherlock, and USP. Misalignment between workstreams could result in Collectoid building features for a ROAM process that WP1 has revised, or depending on metadata that WP3 has not yet delivered. Cross-workstream coordination mechanisms are unclear. |
| **Likelihood** | 2 (Low) -- DOVS2 has a Program Charter and regular program-level coordination |
| **Impact** | 3 (Moderate) -- Rework if business process assumptions diverge from WP1/WP3 reality |
| **Risk Score** | **6** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Attend monthly DOVS2 program-level reviews. 2. Maintain explicit dependency tracking between WP4 and WP1 (ROAM process), WP3 (metadata APIs), WP1 (user scope). 3. Document assumptions in `02-business-requirements.md` Section 9.1 so they can be validated by other workstreams. 4. Nominate a single WP4 representative to cross-workstream coordination meetings. |
| **Contingency Plan** | If significant misalignment is discovered, call a joint workstream alignment session to reconcile. Use the BRD assumptions table (A-001 through A-010) as the discussion framework. |
| **Owner** | Project Manager (Cayetana Vazquez) |
| **Status** | Open |
| **Review Date** | 2026-03-01 |

---

### RISK-O-005: Change Fatigue and User Adoption Resistance

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-O-005 |
| **Category** | Organizational |
| **Description** | Major organizational changes are underway: "Metadata, UI, access control and AI will land with Stacy's group." People are nervous about AI tools -- "need to see AI as co-pilot, not job killer." Collectoid replaces manual processes (SharePoint, PowerBI, email) that people are familiar with, and introduces a new in-app approval workflow. The target user base includes senior scientific leaders (DDOs at VP/SVP level) who must adopt this new approval workflow. iDAP decommission forces adoption, which can breed resentment if the replacement is perceived as inferior. BO-005 targets >100 active users and BO-006 targets >80% satisfaction. |
| **Likelihood** | 3 (Medium) -- Change resistance is normal; forced adoption due to iDAP decommission helps but also creates frustration |
| **Impact** | 4 (Major) -- Low adoption undermines the entire DOVS2 program investment |
| **Risk Score** | **12** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Involve key user personas (DCMs, DDOs, Data Consumers) in design validation during each phase. 2. Launch with a "champion" program: 5-10 early adopters who provide feedback and advocate for Collectoid. 3. Position AI features (AI-assisted search, keyword extraction) as productivity enhancers, not replacements. 4. Provide comprehensive training materials and onboarding for each role. 5. Ensure Collectoid is demonstrably better than the current process for at least one high-frequency task before iDAP is decommissioned. |
| **Contingency Plan** | If adoption is below target at Q2 checkpoint, commission a user research study to identify blockers and prioritize usability fixes in Q3. Consider running Collectoid and legacy processes in parallel for an additional quarter. |
| **Owner** | Product Manager (Beata) |
| **Status** | Open |
| **Review Date** | 2026-04-01 |

---

### RISK-O-006: Knowledge Concentration Risk (Single Point of Failure)

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-O-006 |
| **Category** | Organizational |
| **Description** | Keith Hayes is the Lead Software Engineer for both Collectoid and Sherlock, allocated at 0.5 FTE split between both products. He is the POC author, the primary holder of domain knowledge (ROAM process, stakeholder relationships, technical context), and the interim architecture decision-maker. If Keith becomes unavailable (illness, reassignment, departure, or simply overcommitted on Sherlock), Collectoid development effectively stops. No other team member has equivalent context. This is a textbook bus factor of 1. |
| **Likelihood** | 4 (High) -- Not that Keith will leave, but that competing priorities (Sherlock) will reduce his Collectoid availability below effective minimum |
| **Impact** | 4 (Major) -- Development halts; ramp-up time for a replacement would be 4-8 weeks given domain complexity |
| **Risk Score** | **16** |
| **Risk Level** | **High** |
| **Mitigation Strategy** | 1. Document all architecture decisions comprehensively in sprint-zero docs (this is happening). 2. Ensure at least one other developer can execute on Collectoid tasks independently by end of Q1. 3. Pair programming on critical subsystems (auth, approval workflow, audit trail) to distribute knowledge. 4. Maintain up-to-date decision logs, architecture diagrams, and runbooks. 5. Record architecture walkthrough sessions for team reference. |
| **Contingency Plan** | If Keith's availability drops below 0.3 FTE on Collectoid, escalate to WP4 Lead to either: (a) reassign Sherlock work to another developer, or (b) bring in a contractor with Next.js/AWS experience who can be onboarded using sprint-zero documentation. |
| **Owner** | WP4 Lead (Jamie MacPherson) |
| **Status** | Open |
| **Review Date** | 2026-02-21 |

---

### RISK-O-007: Organizational Restructuring Impact

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-O-007 |
| **Category** | Organizational |
| **Description** | Major organizational changes are anticipated: "Metadata, UI, access control and AI will land with Stacy's group." If Collectoid's ownership, reporting lines, or stakeholder landscape changes mid-delivery, it could introduce new decision-makers with different priorities, revised scope, or altered timelines. Team members may be reassigned during restructuring. Budget allocation may be revisited. |
| **Likelihood** | 3 (Medium) -- Organizational restructuring is confirmed as planned; timing and scope are uncertain |
| **Impact** | 4 (Major) -- New leadership could pivot priorities, freeze development, or restructure the team |
| **Risk Score** | **12** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Maintain strong documentation (sprint-zero docs, BRD, architecture decisions) that can onboard new stakeholders quickly. 2. Align Collectoid's roadmap with DOVS2 program-level objectives that are likely to survive restructuring. 3. Deliver visible value each quarter so Collectoid has momentum and demonstrated business impact. 4. Build relationships with stakeholders across both current and anticipated organizational structures. |
| **Contingency Plan** | If restructuring disrupts Collectoid's mandate, present the investment case (POC validated, sprint-zero complete, iDAP decommission deadline) to new leadership. Focus on the "hard deadline" argument: iDAP is decommissioning regardless of organizational changes. |
| **Owner** | WP4 Lead (Jamie MacPherson) |
| **Status** | Open |
| **Review Date** | 2026-03-15 |

---

## 6. Timeline Risks

### RISK-TL-001: Q1 MVP Feasibility Given Sprint Zero + Ramp-Up Time

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-TL-001 |
| **Category** | Timeline |
| **Description** | The Q1 2026 MVP (Explore/Discover) requires: production infrastructure (ECS, Aurora, Redis), Azure AD SSO integration, database schema deployment, collection data loading, collections browser with search/filter, collection detail views, role-based view switching, and an introduction page (see `02-business-requirements.md` Section 6.2). Sprint Zero is consuming February with documentation and architecture decisions. Assuming Sprint Zero ends Feb 14-21, that leaves 5-6 weeks for the Q1 MVP. With a team of ~3 FTE on Collectoid, many of whom need ramp-up time on the domain, delivering infrastructure + 8 MVP features in 5-6 weeks is aggressive. |
| **Likelihood** | 5 (Very High) -- Timeline arithmetic leaves insufficient margin for the defined scope |
| **Impact** | 4 (Major) -- Missing Q1 MVP sets a negative precedent and delays all subsequent phases |
| **Risk Score** | **20** |
| **Risk Level** | **Critical** |
| **Mitigation Strategy** | 1. Reduce MVP scope further: prioritize collections browser + search (MVP-001, MVP-002) as the absolute minimum viable demo. 2. Start infrastructure provisioning (Terraform, ECS, Aurora) in parallel with Sprint Zero documentation. 3. Use seed data (BioPharma, Oncology collections from BRD Appendix C) rather than live AZCT integration for MVP. 4. Accept "demo-quality" auth for MVP (Azure AD with hardcoded role mapping) and refine in Q2. 5. Define "MVP Done" as "usable by 5 champion users" not "production-ready for 1,000 users." |
| **Contingency Plan** | If MVP cannot be delivered by end of Q1, propose a "MVP Lite" by March 31 (collections browser with seeded data, basic auth) and "MVP Full" by April 15 (real auth, live AZCT integration, all 8 features). Communicate revised timeline to stakeholders by Feb 21 if the risk materializes. |
| **Owner** | Keith Hayes / Project Manager (Cayetana Vazquez) |
| **Status** | Open |
| **Review Date** | 2026-02-14 (weekly until MVP delivered) |

---

### RISK-TL-002: iDAP Decommission Creating Hard Deadline

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-TL-002 |
| **Category** | Timeline |
| **Description** | AZCt iDAP is scheduled for decommission in 2026. The exact date is not specified, but the implication is that Collectoid must have sufficient functionality to absorb iDAP's data access management capabilities before iDAP goes offline. This creates a hard deadline that cannot be negotiated -- unlike feature scope, the decommission date is driven by iDAP's own lifecycle, not Collectoid's readiness. If Collectoid's approval workflow (Q3) and audit trail (Q4) are not ready when iDAP decommissions, there is a gap in data access governance with compliance and regulatory implications. |
| **Likelihood** | 4 (High) -- iDAP decommission is a confirmed organizational decision |
| **Impact** | 4 (Major) -- Gap in data access governance could mean researchers lose access or access is ungoverned |
| **Risk Score** | **16** |
| **Risk Level** | **High** |
| **Mitigation Strategy** | 1. [QUESTION] Confirm exact iDAP decommission date and map against Collectoid phase roadmap. 2. Identify the minimum Collectoid feature set required before iDAP can be decommissioned (likely: collections browser, access request, basic approval, audit trail). 3. Negotiate a parallel-running period where both iDAP and Collectoid are active. 4. If iDAP decommission is H2 2026, align Collectoid Q3 delivery (Approve) as the critical gate. |
| **Contingency Plan** | If Collectoid cannot cover iDAP's functionality in time, propose extending iDAP's decommission date by 3-6 months. Present concrete Collectoid delivery timeline showing when parity will be achieved. Alternatively, implement a "bridge" mode where iDAP handles approvals and Collectoid handles discovery/browsing. |
| **Owner** | WP4 Lead (Jamie MacPherson) / Program Manager |
| **Status** | Open |
| **Review Date** | 2026-02-21 |

---

### RISK-TL-003: Dependency on Other Workstreams

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-TL-003 |
| **Category** | Timeline |
| **Description** | Collectoid depends on WP1 for ROAM process finalization and user scope definition, WP3 for metadata readiness and API availability, and WP1 for the rollout schedule that determines which collections Collectoid must manage (see `02-business-requirements.md` Dependencies D-001, D-004, D-005). If WP1 delays ROAM Phase 1 rollout, there are no production collections for Collectoid to manage. If WP3 delays metadata APIs, d-code resolution is blocked. These dependencies are outside WP4's control. |
| **Likelihood** | 2 (Low) -- Cross-workstream dependencies are common but DOVS2 program management is active |
| **Impact** | 4 (Major) -- Blocked features force roadmap reorganization and wasted development effort |
| **Risk Score** | **8** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Track dependencies D-001 through D-010 in the BRD explicitly, with required-by dates. 2. Attend DOVS2 program reviews to get early warning of delays. 3. Design Collectoid to be demonstrable with seed data so that WP1/WP3 delays do not block development. 4. Build mock API clients that can be swapped for real integrations when available. |
| **Contingency Plan** | If WP3 metadata APIs are delayed, use AZCT as the sole metadata source (it is already the primary source). If WP1 ROAM rollout is delayed, demonstrate Collectoid using the existing BioPharma and Oncology collections as seed data. |
| **Owner** | Project Manager (Cayetana Vazquez) |
| **Status** | Open |
| **Review Date** | 2026-03-01 |

---

### RISK-TL-004: Parallel Delivery of Sherlock and USP Competing for Resources

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-TL-004 |
| **Category** | Timeline |
| **Description** | Sherlock (AI chatbot) and USP (User Support Portal) are parallel WP4 deliverables sharing the same team resources. Sherlock in particular shares Keith Hayes as lead engineer (0.5 FTE each). If Sherlock encounters a critical issue or receives a priority escalation, Keith's Collectoid allocation may be reduced below the effective minimum. USP requirements may also compete for developer time if its scope expands. |
| **Likelihood** | 3 (Medium) -- Competing priorities are normal; Sherlock's AI component introduces unpredictable complexity |
| **Impact** | 2 (Minor) -- Short-term delays when priorities shift; recoverable within a sprint |
| **Risk Score** | **6** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Establish clear weekly allocation percentages per product with WP4 Lead approval. 2. Maintain separate backlogs for Collectoid and Sherlock with independent sprint planning. 3. Ensure at least one developer besides Keith is capable of productive Collectoid work. 4. Flag any sprint where Collectoid allocation drops below 3 FTE. |
| **Contingency Plan** | If Sherlock or USP requires temporary team surge, negotiate a formal "loan" period with explicit return date and scope deferral for the lending product. Document the impact on Collectoid's roadmap. |
| **Owner** | WP4 Lead (Jamie MacPherson) |
| **Status** | Open |
| **Review Date** | 2026-02-28 |

---

### RISK-TL-005: Sprint Zero Overrun

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-TL-005 |
| **Category** | Timeline |
| **Description** | Sprint Zero is producing comprehensive documentation (architecture, BRD, data model, API spec, auth design, infrastructure, and this risk register). If open questions (22 identified in architecture doc alone, plus 11 in BRD) are not resolved in a timely manner, Sprint Zero may extend beyond its planned duration, further compressing the development timeline for Q1 MVP. |
| **Likelihood** | 3 (Medium) -- Many open questions depend on external teams (Cloud Engineering, Identity, AZCT, Quality) |
| **Impact** | 2 (Minor) -- Each additional Sprint Zero week reduces Q1 development time by the same amount |
| **Risk Score** | **6** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Set a hard Sprint Zero end date (Feb 21) regardless of unresolved questions. 2. Document unresolved questions as assumptions with planned resolution dates. 3. Begin development on known-good foundations (UI, data model, basic API scaffold) in parallel with question resolution. 4. Prioritize blocking questions (QUESTION-001 database, QUESTION-012 Azure AD groups) over nice-to-know questions. |
| **Contingency Plan** | If Sprint Zero extends to Feb 28, accept it and adjust Q1 MVP scope accordingly. Communicate the trade-off: thorough planning now prevents rework later. |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-02-14 |

---

## 7. Security & Compliance Risks

### RISK-SC-001: Clinical Data Exposure Through Misconfigured Access

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-SC-001 |
| **Category** | Security & Compliance |
| **Description** | Collectoid manages access to strictly confidential clinical trial data (see `02-business-requirements.md` NFR-SEC-003). While Collectoid itself stores metadata rather than raw patient data, incorrect collection configuration, faulty approval logic, or misconfigured Immuta/Ranger policies could grant unauthorized access to clinical data in downstream systems. A single misconfiguration in the multi-TA approval workflow could expose data across therapeutic areas. The "all or nothing" rule (VS2-349) means a logic error could either over-grant or over-restrict access for all TAs simultaneously. |
| **Likelihood** | 2 (Low) -- Multiple safeguards are planned (RBAC, audit trail, policy verification) |
| **Impact** | 5 (Critical) -- Unauthorized access to clinical trial data is a regulatory and reputational catastrophe |
| **Risk Score** | **10** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Implement defense-in-depth: RBAC at API layer, audit trail on all state changes, policy verification before provisioning. 2. Approval workflow requires explicit signatures from all required TA Leads (no silent defaults). 3. Implement a "dry run" provisioning mode that shows what policies would be created without executing them. 4. Security review of approval workflow logic before Q3 deployment. 5. Penetration testing before production launch. |
| **Contingency Plan** | If a misconfiguration is discovered, immediately revoke all affected policies via Immuta and notify impacted stakeholders. The audit trail enables rapid identification of all affected collections and users. Conduct root cause analysis and implement additional safeguards before re-enabling provisioning. |
| **Owner** | Tech Lead (TBC) / InfoSec |
| **Status** | Open |
| **Review Date** | 2026-05-01 |

---

### RISK-SC-002: Audit Trail Gaps Failing Regulatory Requirements

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-SC-002 |
| **Category** | Security & Compliance |
| **Description** | The BRD mandates 100% audit coverage for all access decisions (NFR-SEC-004, BO-004). The audit trail must be immutable, comprehensive, and queryable (FR-AUD-001). If the audit trail implementation has gaps -- missed events, incomplete actor information, timestamp inconsistencies, or corruptible records -- it fails the "who approved what, when, and where" requirement. This is especially critical given that the built-in approval module must provide a compliance-grade audit trail equivalent to a legally binding signature trail, with no external approval system as a fallback. |
| **Likelihood** | 3 (Medium) -- Comprehensive audit trails are technically challenging; edge cases are common |
| **Impact** | 4 (Major) -- Audit gaps could invalidate access decisions and create compliance liability |
| **Risk Score** | **12** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Design audit trail as the first cross-cutting concern, not an afterthought (see `03-data-model.md` Section 4). 2. Implement audit logging in middleware so it applies to ALL API routes automatically. 3. Write integration tests that verify audit events are created for every state-changing operation. 4. Conduct quarterly audit trail completeness reviews. 5. Use append-only table with database-level constraints preventing UPDATE/DELETE. |
| **Contingency Plan** | If audit trail gaps are discovered, conduct a retrospective analysis to identify the scope of missing records. Implement a manual "audit backfill" process using application logs and database change logs to reconstruct missing audit events. Prioritize fixing the gap in the next sprint. |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-04-01 |

---

### RISK-SC-003: SSO Integration Vulnerabilities

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-SC-003 |
| **Category** | Security & Compliance |
| **Description** | Azure AD / Entra ID SSO integration via Auth.js introduces several potential vulnerability vectors: token theft, session fixation, insufficient scope validation, group claim manipulation, and cross-site request forgery. The POC's simple password auth provides no basis for security testing of the production SSO implementation. If the SSO integration has vulnerabilities, an attacker with corporate network access could impersonate privileged users (DCM, Approver) and manipulate collections or approvals. |
| **Likelihood** | 3 (Medium) -- SSO integration is well-documented for Auth.js; standard patterns exist, but misconfigurations are common |
| **Impact** | 3 (Moderate) -- Corporate network access is required (not internet-facing), limiting attack surface |
| **Risk Score** | **9** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Follow Auth.js security best practices for Azure AD provider configuration. 2. Implement CSRF protection (SameSite cookies + Auth.js CSRF tokens, see `01-architecture-overview.md` Section 11). 3. Validate token claims server-side on every request (middleware chain step 2). 4. Restrict session lifetime (30 min inactivity timeout per NFR-SEC-005). 5. Use AZ WAF IP allowlist to restrict access to corporate VPN only (QUESTION-004). |
| **Contingency Plan** | If a vulnerability is discovered, rotate all session tokens immediately (Redis session store enables this). Disable affected functionality until patched. Engage AZ InfoSec for incident response. |
| **Owner** | Keith Hayes / InfoSec |
| **Status** | Open |
| **Review Date** | 2026-03-15 |

---

### RISK-SC-004: Data Residency and Sovereignty Requirements

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-SC-004 |
| **Category** | Security & Compliance |
| **Description** | Collectoid's database stores metadata about clinical trials conducted globally, including study identifiers, user information (names, emails, organizational roles), approval decisions, and compliance records. Data residency requirements (QUESTION-016) and data classification (QUESTION-017) have not been confirmed. If the application is deployed in a US AWS region but EU data residency requirements apply, the deployment may need to be moved or dual-deployed. |
| **Likelihood** | 1 (Very Low) -- Metadata about studies (not patient data) typically has lower residency requirements |
| **Impact** | 3 (Moderate) -- Region migration is a significant but bounded infrastructure change |
| **Risk Score** | **3** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Resolve QUESTION-016 and QUESTION-017 with Legal/DPO during Sprint Zero. 2. Deploy to EU West (Ireland) by default, which satisfies most EU data residency requirements. 3. Confirm with Cloud Engineering which AWS regions AZ operates in. 4. Design the infrastructure (Terraform) to be region-agnostic for easy migration. |
| **Contingency Plan** | If unexpected data residency requirements emerge, re-deploy to the compliant region using the same Terraform modules. Aurora PostgreSQL, ECS, and ElastiCache are available in all major AWS regions. Estimated migration effort: 1-2 weeks. |
| **Owner** | Tech Lead (TBC) / Legal |
| **Status** | Open |
| **Review Date** | 2026-02-21 |

---

## 8. Operational Risks

### RISK-OP-001: No Operational Runbook or Incident Response

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-OP-001 |
| **Category** | Operational |
| **Description** | The production application will launch without established operational procedures: no runbook, no incident response plan, no on-call rotation, no escalation path, and no defined SLAs for different severity levels. The development team (5.3 FTE shared across 3 products) is not structured for production support. When the first production incident occurs, there will be no documented process for triage, communication, or resolution. |
| **Likelihood** | 2 (Low) -- For MVP launch with limited users (~5-10 champions), incident probability is low |
| **Impact** | 3 (Moderate) -- Without a runbook, incident resolution time is extended; user confidence eroded |
| **Risk Score** | **6** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Create a basic operational runbook before production launch covering: health check verification, ECS task restart, database connection pool monitoring, cache flush procedure, and external API circuit breaker reset. 2. Define a simple incident response: Keith Hayes as primary on-call for critical issues during business hours. 3. Implement the health check endpoint (`/api/health`) as specified in `01-architecture-overview.md`. 4. Create a dedicated Slack channel for Collectoid operations. |
| **Contingency Plan** | If an incident occurs before the runbook is ready, follow standard AZ IT incident management process. Escalate to Cloud Engineering for infrastructure issues. The blue/green deployment model (`01-architecture-overview.md` Deployment Pipeline) enables instant rollback. |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-03-15 |

---

### RISK-OP-002: Monitoring and Alerting Gaps at Launch

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-OP-002 |
| **Category** | Operational |
| **Description** | The architecture defines comprehensive monitoring (`01-architecture-overview.md` Section 11): API response time, error rate, ECS health, database connections, cache hit rate, SQS DLQ depth, and external API failures. However, configuring all these alerts, dashboards, and PagerDuty/Slack integrations requires significant effort. If monitoring is incomplete at launch, issues may go undetected until users report them. Sentry (error tracking) is pending approval (QUESTION in architecture doc). |
| **Likelihood** | 3 (Medium) -- Monitoring is typically deprioritized versus feature delivery |
| **Impact** | 3 (Moderate) -- Undetected issues degrade user experience and trust |
| **Risk Score** | **9** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Implement minimum viable monitoring for MVP launch: health check endpoint, CloudWatch basic metrics (CPU, memory, HTTP 5xx rate), and a single Slack alert channel. 2. Expand monitoring incrementally each quarter. 3. Use AWS CloudWatch default dashboards for ECS and Aurora -- no custom setup required. 4. Defer Sentry integration until approved; use CloudWatch Logs for error tracking initially. |
| **Contingency Plan** | If monitoring is completely absent at launch, rely on manual health checks (daily) and user-reported issues. Schedule a dedicated monitoring sprint within 2 weeks of production launch. |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-03-01 |

---

### RISK-OP-003: User Adoption Failure Despite System Availability

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-OP-003 |
| **Category** | Operational |
| **Description** | Even if Collectoid is technically functional, operational success depends on user adoption. The BRD targets >100 monthly active users (BO-005) and >80% satisfaction (BO-006). If the system is unintuitive, training is insufficient, or the transition from manual processes is poorly managed, users may find workarounds (continue using SharePoint, email, manual approval processes) rather than adopting Collectoid. The DCM persona (`02-business-requirements.md` Section 3.1) documents extensive current pain points, but solving those pain points requires users to actually use the new system. |
| **Likelihood** | 4 (High) -- Tool adoption resistance is common, especially for governance tools that add process steps |
| **Impact** | 3 (Moderate) -- Low adoption means manual processes continue, undermining DOVS2 program goals |
| **Risk Score** | **12** |
| **Risk Level** | **Medium** |
| **Mitigation Strategy** | 1. Launch with a phased rollout: champion users first (Q1), DCM team (Q2), approvers (Q3), all users (Q4). 2. Create role-specific onboarding guides. 3. Measure adoption metrics from day one (login frequency, task completion rates). 4. Conduct monthly feedback sessions with active users. 5. Ensure the introduction/landing page (MVP-008) clearly explains value and provides guided tours. |
| **Contingency Plan** | If adoption is below 50 users at Q3 checkpoint, conduct a comprehensive user research study, implement identified improvements, and request WP4 Lead support for organizational change management. |
| **Owner** | Product Manager (Beata) |
| **Status** | Open |
| **Review Date** | 2026-04-01 |

---

### RISK-OP-004: Data Quality from External Sources

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-OP-004 |
| **Category** | Operational |
| **Description** | Collectoid's value proposition depends on accurate data from external systems: study metadata from AZCT, training status from Cornerstone, taxonomy from Collibra, and compliance status from DPO systems. If external data is stale, incomplete, or incorrect, Collectoid surfaces inaccurate information. For example, if AZCT reports a study as "active" when it has been closed, the collection may include an invalid study. If Cornerstone shows a user as non-compliant when they have completed training, access is incorrectly blocked. Collectoid has no ability to fix data quality at the source. |
| **Likelihood** | 3 (Medium) -- Data quality issues are endemic in large organizations with multiple source systems |
| **Impact** | 2 (Minor) -- Stale data is annoying but usually caught during review; Collectoid surfaces freshness timestamps |
| **Risk Score** | **6** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Display `synced_at` timestamps on all externally-sourced data so users can judge freshness (see `03-data-model.md` External Data Caching). 2. Implement "refresh" actions that allow users to trigger a re-sync from the source. 3. Build data quality alerts: flag studies whose metadata has not been synced in >24 hours. 4. Provide a manual override mechanism for DCMs to correct obviously stale data while flagging the discrepancy. |
| **Contingency Plan** | If data quality issues are pervasive, implement a daily data quality report that compares Collectoid's cached data against source systems and flags discrepancies for manual resolution. |
| **Owner** | Keith Hayes |
| **Status** | Open |
| **Review Date** | 2026-04-01 |

---

### RISK-OP-005: Backup and Disaster Recovery Gaps

| Field | Value |
|-------|-------|
| **Risk ID** | RISK-OP-005 |
| **Category** | Operational |
| **Description** | The BRD specifies RPO < 1 hour and RTO < 4 hours (NFR-AVAIL-003, NFR-AVAIL-004). Aurora PostgreSQL provides automated backups and point-in-time recovery, but disaster recovery procedures (cross-region failover, backup verification, restoration testing) have not been established. If the production database is corrupted or the primary AWS region has an outage, recovery depends on untested procedures. |
| **Likelihood** | 1 (Very Low) -- Aurora PostgreSQL has robust built-in backup; AWS region outages are rare |
| **Impact** | 4 (Major) -- Data loss for audit trail records would be a compliance issue; extended downtime impacts users |
| **Risk Score** | **4** |
| **Risk Level** | **Low** |
| **Mitigation Strategy** | 1. Enable Aurora automated backups with 7-day retention (default). 2. Enable point-in-time recovery (default for Aurora). 3. Test backup restoration procedure before production launch. 4. Document restoration procedure in the operational runbook. 5. Consider Aurora Global Database for cross-region disaster recovery if required by compliance. |
| **Contingency Plan** | If data loss occurs, restore from the most recent Aurora backup (within RPO < 1 hour). Use CloudWatch Logs and SQS dead-letter queues to reconstruct any events that occurred between the backup and the failure. |
| **Owner** | Keith Hayes / Cloud Engineering |
| **Status** | Open |
| **Review Date** | 2026-03-15 |

---

## 9. Risk Review Process

### 9.1 Review Cadence

| Activity | Frequency | Participants | Forum |
|----------|-----------|-------------|-------|
| Critical risk check-in | Weekly | Tech Lead (TBC), Keith Hayes, Product Owner (Divya) | Sprint standup |
| Full risk register review | Bi-weekly | All team members, Product Manager (Beata), Product Owner (Divya) | Sprint retrospective |
| Stakeholder risk review | Monthly | WP4 Lead (Jamie MacPherson), Project Manager (Cayetana Vazquez), Product Manager | WP4 Monthly Review |
| Program-level risk escalation | Quarterly | DOVS2 Program Board, WP Leads | Program Review |

### 9.2 Review Activities

Each review should include:

1. **Re-score existing risks** -- Has the likelihood or impact changed based on new information?
2. **Update mitigation status** -- Are mitigation actions on track? Any blockers?
3. **Close resolved risks** -- Change status to "Closed" with resolution notes.
4. **Identify new risks** -- Have new risks emerged from recent work, stakeholder conversations, or external changes?
5. **Escalate as needed** -- Any risk that has moved to a higher level since the last review should be escalated per the matrix below.

### 9.3 New Risk Identification

New risks can be identified by any team member at any time. To add a risk:

1. Assign the next available Risk ID in the appropriate category (RISK-T-xxx, RISK-I-xxx, RISK-O-xxx, RISK-TL-xxx, RISK-SC-xxx, RISK-OP-xxx).
2. Complete all fields in the risk template (description, likelihood, impact, score, level, mitigation, contingency, owner, status, review date).
3. Present the risk at the next risk review meeting for team discussion and scoring validation.
4. Submit via pull request against this document.

### 9.4 Escalation Criteria

| Trigger | Action | Escalate To |
|---------|--------|-------------|
| Any risk moves to **Critical** (20-25) | Immediate notification + weekly tracking | WP4 Lead + DOVS2 Program Board |
| Any risk moves to **High** (13-19) | Add to bi-weekly review + dedicated mitigation plan | WP4 Lead |
| Any **Critical** risk has no mitigation progress for 2 weeks | Emergency review meeting | WP4 Lead + Program Manager |
| 3+ risks in same category move to **High** simultaneously | Category-level root cause analysis | WP4 Lead |
| Any security risk materializes (actual breach or vulnerability exploited) | Immediate incident response | AZ InfoSec + WP4 Lead + Legal |

### 9.5 Risk Status Definitions

| Status | Meaning |
|--------|---------|
| **Open** | Risk identified; mitigation plan defined but not yet started |
| **Mitigating** | Active mitigation work is underway |
| **Accepted** | Risk acknowledged; decision made not to actively mitigate (with documented justification) |
| **Closed** | Risk resolved, no longer applicable, or probability reduced to negligible |

---

## 10. Open Questions

The following questions are directly related to risk assessment and require resolution to refine scores and mitigation strategies. These complement the open questions in `01-architecture-overview.md` (Section 12) and `02-business-requirements.md` (Section 11).

| ID | Question | Related Risk(s) | Impact on Risk Assessment | Owner | Status |
|----|----------|-----------------|--------------------------|-------|--------|
| [QUESTION-RR-001] | What is the exact iDAP decommission date? | RISK-TL-002 | Determines whether the hard deadline falls in H1 or H2 2026, which changes the risk score | Program Manager | Open |
| [QUESTION-RR-002] | Has the team capacity plan (5.3 FTE) been validated against the full 2026 roadmap scope? | RISK-O-002, RISK-TL-001 | If capacity is formally insufficient, RISK-O-002 moves from organizational risk to a constraint requiring scope reduction | WP4 Lead | Open |
| [QUESTION-RR-003] | What is the timeline for Tech Lead and UX Designer appointments? | RISK-O-003 | If confirmed for Q1, risk score drops significantly; if unresolved through 2026, risk becomes a permanent constraint | WP4 Lead | Open |
| [QUESTION-RR-004] | Is there a formal change management process for LT decisions affecting Collectoid scope? | RISK-O-001 | If a change management process exists, RISK-O-001 likelihood drops from 5 to 3 | Product Owner | Open |
| [QUESTION-RR-005] | What is the minimum Collectoid feature set required before iDAP can be decommissioned? | RISK-TL-002 | Determines whether Q3 (Approve) or Q4 (Audit) is the critical gate for iDAP replacement | Program Manager / R&D Data Office | Open |
| [QUESTION-RR-006] | Is Collectoid classified as a GxP/regulated system? | RISK-T-005, RISK-SC-002 | If yes, adds validation requirements and increases impact scores for audit trail risks | Quality Team | Open |
| [QUESTION-RR-007] | What are the specific compliance requirements (GxP, SOX) for in-app approval audit trails? | RISK-I-005 | Determines audit trail implementation scope and whether digital acknowledgement is sufficient vs formal digital signatures | Compliance Team | Open |
| [QUESTION-RR-008] | Will the organizational restructuring ("landing with Stacy's group") affect WP4 team composition or reporting? | RISK-O-007 | If restructuring includes team changes, RISK-O-007 likelihood increases to 4-5 | WP4 Lead | Open |
| [QUESTION-RR-009] | Is there a parallel-running period planned for Collectoid and iDAP? | RISK-TL-002, RISK-OP-003 | Parallel running reduces risk of both hard deadline pressure and adoption failure | Program Manager | Open |
| [QUESTION-RR-010] | What penetration testing and security review processes are required before production launch? | RISK-SC-001, RISK-SC-003 | May add 2-4 weeks to the launch timeline if formal security review is required | InfoSec | Open |

---

## Appendix A: Risk Register Change Log

| Date | Author | Change |
|------|--------|--------|
| 2026-02-06 | Engineering Team | Initial risk register created during Sprint Zero |

---

## Appendix B: Risk Category Definitions

| Category | Scope |
|----------|-------|
| **Technical** (RISK-T-xxx) | Technology choices, architecture, code quality, performance, scalability |
| **Integration** (RISK-I-xxx) | External API dependencies, data exchange, system interoperability |
| **Organizational** (RISK-O-xxx) | Team capacity, stakeholder alignment, requirements stability, change management |
| **Timeline** (RISK-TL-xxx) | Schedule feasibility, deadline pressure, dependency timing, parallel delivery |
| **Security & Compliance** (RISK-SC-xxx) | Data protection, access control, regulatory compliance, audit requirements |
| **Operational** (RISK-OP-xxx) | Production operations, monitoring, user adoption, data quality, disaster recovery |

---

*This document is a living artifact. It should be updated at every bi-weekly sprint retrospective and formally reviewed monthly. All changes should be tracked via pull request with review from the engineering lead. Risk scores should be re-assessed as mitigation actions are completed and new information becomes available.*

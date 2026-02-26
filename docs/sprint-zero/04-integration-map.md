# 04 - Integration Map

**Document:** Collectoid Production Integration Specification
**Document ID:** SPRINT-ZERO-04
**Version:** 0.1 (Draft)
**Date:** 2026-02-06
**Status:** Sprint Zero - For Review
**Authors:** Architecture Team
**Program:** DOVS2 (Data Office Value Stream 2), WP4 - UI & Agentic AI
**Cross-references:**
- `01-architecture-overview.md` - System context, container diagram, deployment topology
- `03-data-model.md` - External cache tables, dataset schema, sync timestamps
- `05-security-compliance.md` - Authentication flows, data classification, encryption

---

## Table of Contents

1. [Overview](#1-overview)
2. [Integration Topology Diagram](#2-integration-topology-diagram)
3. [Integration Summary Table](#3-integration-summary-table)
4. [Detailed Integration Specifications](#4-detailed-integration-specifications)
   - 4.1 Azure AD / Entra ID (Authentication & Identity)
   - 4.2 AZCT REST API (Clinical Trial Metadata)
   - 4.3 Cornerstone API (User Training Data)
   - 4.4 Collibra 2.0 (Standardized Metadata)
   - 4.5 Immuta (Data Access Policy Management)
   - 4.6 Starburst / Ranger (Query-Level Access Control)
   - 4.7 Consumption Environments (PDP, Domino, SCP, AI Bench, IO Platform)
5. [Internal Event Bus (SQS/SNS)](#5-internal-event-bus-sqssns)
6. [Data Sync Patterns](#6-data-sync-patterns)
7. [Error Handling Strategy](#7-error-handling-strategy)
8. [Circuit Breaker Patterns](#8-circuit-breaker-patterns)
9. [Integration Testing Approach](#9-integration-testing-approach)
10. [Sprint Zero Integration Tasks](#10-sprint-zero-integration-tasks)
11. [Dependency Risk Matrix](#11-dependency-risk-matrix)
12. [Open Questions Register](#12-open-questions-register)

---

## 1. Overview

### 1.1 Purpose

Collectoid does not operate in isolation. As the governance layer for AstraZeneca's ROAM (Role-based Open Access Model), it must integrate with seven external systems to authenticate users, resolve study metadata, verify training compliance, enforce data access policies, and link researchers to their consumption environments. Approvals are handled entirely within Collectoid's built-in approval workflow. Each of these integrations carries distinct reliability, latency, and data freshness requirements.

This document specifies every external integration point: what data flows, in which direction, using what protocol, with what authentication, under what failure conditions, and with what fallback behaviour. It serves as the contract between Collectoid's engineering team and the teams that own each external system.

### 1.2 Guiding Principles

| Principle | Description |
|-----------|-------------|
| **Collectoid owns its read path** | External data is cached locally (see `03-data-model.md`, Section 6). The application never makes a synchronous call to an external system on the critical rendering path for end users. |
| **External writes are async** | Policy creation in Immuta, approval notifications, and provisioning triggers are dispatched via SQS and confirmed asynchronously. |
| **Graceful degradation over hard failure** | If an external system is unavailable, Collectoid continues to function with cached data and clearly indicates staleness to the user. Only Azure AD is a hard dependency (no auth = no access). |
| **Circuit breakers protect both sides** | Every external client implements a circuit breaker to protect Collectoid from cascading failures and to protect external systems from retry storms. |
| **Provenance is always recorded** | Every piece of externally-sourced data carries `source_system` and `source_synced_at` fields (see `03-data-model.md`, Section 3.7). |

### 1.3 Integration Layer Architecture

All external API clients live in the `lib/clients/` directory and share a common base class:

```
lib/
  clients/
    base-client.ts            # Shared HTTP client with circuit breaker, retry, logging
    azure-ad-client.ts        # Azure AD / Entra ID (OIDC + Graph API)
    azct-client.ts            # AZCT REST API
    cornerstone-client.ts     # Cornerstone LMS API
    collibra-client.ts        # Collibra 2.0 API
    immuta-client.ts          # Immuta policy API
    starburst-client.ts       # Starburst/Ranger API
    provisioning-client.ts    # Consumption environment provisioning
  services/
    external-sync.ts          # Orchestrates scheduled sync jobs
```

Each client inherits:
- Configurable timeout, retry count, and backoff strategy
- Circuit breaker state management (closed/open/half-open)
- Structured logging with correlation IDs
- Metric emission (latency, error rate, circuit state)
- Token management (acquisition, caching, refresh)

---

## 2. Integration Topology Diagram

```
                                 +--------------------------+
                                 |   Azure AD / Entra ID    |
                                 |   (Corporate SSO)        |
                                 |                          |
                                 |  - OIDC token issuance   |
                                 |  - Graph API (user/group)|
                                 +------------+-------------+
                                              |
                                   OIDC / OAuth 2.0
                                   + Graph API (REST)
                                              |
+-------------------------------+             |             +-------------------------------+
|  AZCT REST API                |   REST/JSON |             |  Cornerstone API              |
|  (Study/Dataset Metadata)     |<---.        |        .--->|  (Training Completion)         |
|                               |    |        |        |    |                               |
|  Direction: INBOUND           |    |        |        |    |  Direction: INBOUND           |
|  Pattern: Scheduled sync      |    |        |        |    |  Pattern: On-demand + cache   |
|  Criticality: HIGH            |    |  +-----+------+ |    |  Criticality: MEDIUM          |
+-------------------------------+    |  |              | |   +-------------------------------+
                                     +--| COLLECTOID   |--+
+-------------------------------+    |  |              |  |
|  Collibra 2.0                 |    |  | Next.js App  |  |
|  (Standardized Metadata)      |<---'  |              |  |
|                               |       | Aurora PG    |  |
|  Direction: INBOUND           |       | Redis Cache  |  |
|  Pattern: Scheduled sync      |       | SQS/SNS     |  |
|  Criticality: MEDIUM          |       +--+---+---+--+  |
+-------------------------------+          |   |   |      |
                                           |   |   |
            +------------------------------+   |   +------------------------------+
            |                                  |                                  |
+-----------+-------------------+   +----------+------------+   +-----------------+-----------+
|  Immuta                       |   |  Starburst / Ranger   |   |  Consumption Environments   |
|  (Policy Management)          |   |  (Query-Level ACL)    |   |                             |
|                               |   |                       |   |  - PDP                      |
|  Direction: OUTBOUND          |   |  Direction: OUTBOUND  |   |  - Domino Data Lab          |
|  Pattern: Event-driven (SQS)  |   |  Pattern: Event-driven|   |  - SCP                      |
|  Criticality: HIGH            |   |  Criticality: HIGH    |   |  - AI Bench                 |
+-------------------------------+   +-----------------------+   |  - IO Platform              |
                                                                |                             |
                                                                |  Direction: OUTBOUND        |
                                                                |  Pattern: Link-out + API    |
                                                                |  Criticality: MEDIUM        |
                                                                +-----------------------------+

                              Internal Event Bus
    +------------------------------------------------------------------+
    |                        SQS / SNS                                  |
    |                                                                   |
    |  SNS Topics:                    SQS Queues:                       |
    |    collectoid-events              approval-notifications          |
    |    request-status-changes         audit-events                    |
    |    collection-events              provisioning-tasks              |
    |                                   external-sync                   |
    |                                   dlq-* (dead-letter queues)      |
    +------------------------------------------------------------------+
```

### Data Flow Legend

| Arrow Direction | Meaning |
|-----------------|---------|
| Collectoid --> External | Collectoid sends data or triggers actions in external system |
| External --> Collectoid | External system provides data to Collectoid (pulled or pushed) |

---

## 3. Integration Summary Table

| # | System | Purpose | Direction | Protocol | Auth Method | Sync Pattern | Data Freshness | Criticality | Phase Required |
|---|--------|---------|-----------|----------|-------------|--------------|----------------|-------------|----------------|
| 1 | **Azure AD / Entra ID** | User authentication, identity, group membership | Bidirectional | OIDC + REST (Graph API) | OAuth 2.0 client credentials + authorization code | Real-time (auth); cached 15 min (profile) | Real-time for auth; 15 min for profile | **CRITICAL** | Q1 (MVP) |
| 2 | **AZCT REST API** | Study metadata, d-code resolution, study lifecycle | Inbound | REST (JSON) | Service principal (OAuth 2.0 client credentials) | Scheduled batch sync (hourly) + on-demand | 1 hour (batch); on-demand for creation wizard | **HIGH** | Q2 |
| 3 | **Cornerstone API** | Training completion status | Inbound | REST (JSON) | API key or OAuth 2.0 | On-demand with 30 min cache | 30 minutes | **MEDIUM** | Q2 |
| 4 | **Collibra 2.0** | Standardized metadata, taxonomy, data lineage | Inbound | REST (JSON) | OAuth 2.0 client credentials | Scheduled batch sync (6 hours) | 6 hours | **MEDIUM** | Q3 (if ready) |
| 5 | **Immuta** | Data access policy creation and updates | Outbound | REST (JSON) | Service principal (OAuth 2.0) | Event-driven via SQS | Near real-time (async) | **HIGH** | Q3 |
| 6 | **Starburst / Ranger** | Query-level access control configuration | Outbound | REST (JSON) | Service principal or Kerberos | Event-driven via SQS | Near real-time (async) | **HIGH** | Q3 |
| 7 | **Consumption Environments** | Environment links, access status | Outbound | REST / Link-out | Varies by platform | On-demand check; mostly link-out | Best-effort | **MEDIUM** | Q3 |
| 8 | **SQS / SNS** (internal) | Event bus for async workflows | Internal | AWS SDK | IAM role | Event-driven | Real-time | **HIGH** | Q1 |

---

### 3.1 Data Source Map

The table below answers the question: **where does each piece of data in Collectoid originate?**

```
 ┌──────────────────────────────────────────────────────────────────────┐
 │                        COLLECTOID DATA MAP                          │
 │                                                                     │
 │  WHO CAN ACCESS?         WHAT DATA EXISTS?         WHO IS TRAINED?  │
 │  ┌─────────────┐         ┌──────────────┐         ┌──────────────┐  │
 │  │  Azure AD   │         │  AZCT API    │         │ Cornerstone  │  │
 │  │  Entra ID   │         │              │         │     LMS      │  │
 │  │             │         │  Studies,    │         │              │  │
 │  │  Users,     │         │  D-codes,    │         │  Training    │  │
 │  │  Groups,    │         │  Metadata,   │         │  Completion, │  │
 │  │  Roles      │         │  Compliance  │         │  Expiry      │  │
 │  └──────┬──────┘         └──────┬───────┘         └──────┬───────┘  │
 │         │                       │                        │          │
 │         ▼                       ▼                        ▼          │
 │  ┌──────────────────────────────────────────────────────────────┐   │
 │  │                    COLLECTOID (Aurora PG + Redis)             │   │
 │  │                                                              │   │
 │  │  Collections, Versions, Agreements, Access Requests,         │   │
 │  │  Approvals, Audit Trail, Discussions, Notifications          │   │
 │  └───────┬──────────────────┬──────────────────┬────────────┘   │
 │          │                  │                  │                │   │
 │          ▼                  ▼                  ▼                │   │
 │  ┌──────────────┐  ┌──────────────┐  ┌─────────────────────┐  │   │
 │  │   Immuta     │  │  Starburst   │  │  Environments       │  │   │
 │  │              │  │  / Ranger    │  │  PDP, Domino, SCP,  │  │   │
 │  │  Policies,   │  │              │  │  AI Bench, IO       │  │   │
 │  │  Role groups │  │  Query ACLs  │  │                     │  │   │
 │  └──────────────┘  └──────────────┘  └─────────────────────┘  │   │
 │  WHO GETS POLICY?   WHO CAN QUERY?    WHERE DO THEY WORK?     │   │
 └──────────────────────────────────────────────────────────────────────┘

 ──▶  INBOUND = External → Collectoid (we consume)
 ──▶  OUTBOUND = Collectoid → External (we trigger)
```

#### What each system provides (INBOUND)

| Source System | What it provides to Collectoid | Key Data Fields | Collectoid stores in |
|---------------|-------------------------------|-----------------|---------------------|
| **Azure AD / Entra ID** | User identity, authentication, org structure, security group membership for role mapping | User ID, email, name, PRID, department, job title, manager, AD group memberships | `users` table, Redis session, role mapping |
| **AZCT REST API** | Clinical trial / study metadata — the core dataset catalog that DCMs browse and select from | D-code, study name, TA, phase, status, patient count, geography, sponsor type, compliance status, modalities, FSI/DBL dates, ML/AI restrictions, publication restrictions | `datasets` table, `azct_cache` table |
| **Cornerstone LMS** | Training completion status per user — compliance gate before data access is granted | Course ID, completion status (completed/in-progress/not-started/expired), completion date, expiry date, score | `cornerstone_cache` table |
| **Collibra 2.0** | Standardized metadata, business glossary, data quality scores, taxonomy, lineage | Asset ID, asset name, asset type, domain, glossary terms, quality score, lineage, tags | `collibra_cache` table |
| **Immuta** (status callback) | Policy creation confirmation — did the access policy get created successfully? | Policy ID, policy status (active/pending/error/revoked), creation timestamp, error details | `collection_members.access_status` |
| **Starburst/Ranger** (status callback) | Query-level ACL confirmation | Policy ID, status (active/inactive/error) | Provisioning status tracking |
| **Consumption Environments** | Environment availability, user workspace status, direct URLs | Availability, user access status, workspace/project URL | Environment status display |

#### What Collectoid sends (OUTBOUND)

| Target System | What Collectoid sends | Trigger | Key Data Fields |
|---------------|----------------------|---------|-----------------|
| **Immuta** | Policy creation / update / revocation requests | Collection approved → provisioning | Policy name, subject users/groups, data sources, dataset IDs, access level, conditions, effective/expiry dates |
| **Starburst / Ranger** | Query-level access rules | Collection approved → provisioning (after Immuta) | Policy name, users/groups, database/schema/table, access type (SELECT), row-level filters, column masking |
| **Consumption Environments** | Provisioning triggers (where API exists) | Post-policy creation | User ID, dataset IDs, access level, environment config |

#### What Collectoid owns natively (not sourced externally)

| Data Domain | Description | Key Entities |
|-------------|-------------|-------------|
| **Collections** | The core domain — collection definitions, lifecycle state, configuration | `collections`, `collection_versions`, `collection_version_datasets` |
| **Agreement of Terms** | Permitted uses, restrictions, publication rights, user scope | `agreements_of_terms`, `agreement_versions` |
| **Access Requests** | Consumer requests for data access with declared intent | `access_requests` |
| **Approval Workflow** | Multi-TA approval chains, decisions, delegation, SLA tracking | `approval_chains`, `approvals` |
| **Audit Trail** | Immutable, append-only record of every action (ICH E6(R2) compliant) | `audit_events` |
| **Discussions** | Threaded comments, @mentions, blockers, reactions on any entity | `discussions`, `comments` |
| **Notifications** | In-app + email notifications with user preferences | `notifications` |
| **Membership** | User-to-collection assignments with collection-level roles and access status | `collection_memberships` |

#### Immuta role groups — special note

Immuta serves a dual role in the Collectoid ecosystem:

1. **Outbound (policy enforcement):** After a collection is approved, Collectoid pushes access policies to Immuta specifying which users/groups get access to which datasets under what conditions.
2. **Inbound (role group catalog):** During collection creation, the workspace "Access & Users" section presents existing Immuta/ROAM role groups (sourced from Immuta, Workday, and ROAM) for DCMs to select as the collection's access scope. These role groups define *who* should receive access once the collection is approved and provisioned.

The role group catalog is currently maintained across three source systems:

| Source | Example Groups | How synced |
|--------|---------------|------------|
| **ROAM** | TA-level groups (e.g., "Oncology Development Data Users") | ROAM governance process → Immuta |
| **Immuta** | Platform-level groups (e.g., "Immuta Data Engineers") | Immuta admin portal |
| **Workday** | Function-level groups (e.g., "Biometrics - Statistical Programming") | Workday HR feed → Immuta |

---

## 4. Detailed Integration Specifications

### 4.1 Azure AD / Entra ID (Authentication & Identity)

#### Overview

Azure AD / Entra ID is the sole authentication provider for Collectoid. Every user session begins with an OIDC authorization code flow via Auth.js (NextAuth.js). Beyond authentication, Collectoid uses the Microsoft Graph API to resolve user profiles, group memberships, department information, and organizational hierarchy for RBAC purposes.

This is the only integration classified as **CRITICAL** -- if Azure AD is unreachable, no user can log in and all application functionality is blocked.

**References:** `01-architecture-overview.md` Section 2 (System Context), Section 11 (Security)

#### Data Exchanged

**Inbound from Azure AD:**

| Data Field | Source | Used For | Cache TTL |
|------------|--------|----------|-----------|
| `sub` (subject ID) | OIDC ID token | Unique user identifier | Session lifetime |
| `email` | OIDC ID token | User display, notifications | Session lifetime |
| `name` / `display_name` | OIDC ID token | UI display | Session lifetime |
| `preferred_username` | OIDC ID token | PRID resolution | Session lifetime |
| `groups` | ID token claims or Graph API | Role mapping (DCM, Approver, Team Lead, Consumer) | 15 minutes |
| `department` | Graph API `/me` | Organizational context, analytics | 15 minutes |
| `jobTitle` | Graph API `/me` | Display, reporting | 15 minutes |
| `officeLocation` | Graph API `/me` | Geography context | 15 minutes |
| `manager` | Graph API `/me/manager` | Escalation routing, delegation | 15 minutes |
| `memberOf` | Graph API `/me/memberOf` | Security group resolution for RBAC | 15 minutes |

**Outbound from Collectoid:**

| Data | Destination | Purpose |
|------|-------------|---------|
| Authorization code | Azure AD `/authorize` | Initiate OIDC flow |
| Refresh token | Azure AD `/token` | Silent token renewal |

#### Integration Pattern

```
User Browser              Collectoid (Auth.js)           Azure AD
     |                          |                           |
     | 1. GET /collectoid       |                           |
     |------------------------->|                           |
     |                          | 2. No session; redirect   |
     |  <-- 302 Redirect -------|                           |
     |                          |                           |
     | 3. GET /authorize        |                           |
     |------------------------------------------------------>|
     |                          |                           |
     |  <-- 302 + auth code --------------------------------|
     |                          |                           |
     | 4. Callback to /api/auth/callback                    |
     |------------------------->|                           |
     |                          | 5. POST /token            |
     |                          |   (exchange code for       |
     |                          |    id_token + access_token)|
     |                          |-------------------------->|
     |                          |  <-- tokens --------------|
     |                          |                           |
     |                          | 6. Extract user claims    |
     |                          | 7. GET /me (Graph API)    |
     |                          |   for groups, department   |
     |                          |-------------------------->|
     |                          |  <-- user profile --------|
     |                          |                           |
     |                          | 8. Map groups to roles    |
     |                          | 9. Create/update local    |
     |                          |    user record             |
     |                          | 10. Create session in     |
     |                          |     Redis                  |
     |                          |                           |
     |  <-- Set session cookie -|                           |
     |  <-- 200 + page content -|                           |
```

#### Authentication Configuration

```typescript
// lib/auth/config.ts (Auth.js configuration)
import AzureADProvider from "next-auth/providers/azure-ad";

export const authConfig = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      authorization: {
        params: {
          scope: "openid profile email User.Read GroupMember.Read.All",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",        // JWT stored in Redis for cross-task sharing
    maxAge: 24 * 60 * 60,   // 24 hours
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Map Azure AD groups to Collectoid roles
      // Store in JWT for fast middleware checks
    },
    async session({ session, token }) {
      // Attach role information to session
    },
  },
};
```

#### Role Mapping from Azure AD Groups

| Azure AD Group (TBC) | Collectoid Role | Permissions Summary |
|----------------------|-----------------|---------------------|
| `SG-Collectoid-DCM` | Data Collection Manager | Create/edit/submit collections, assign roles, manage workflows |
| `SG-Collectoid-Approver` | Approver (DDO/GPT/TALT) | Review and approve/reject collections, sign AoTs |
| `SG-Collectoid-TeamLead` | Team Lead | Manage virtual team access, submit requests on behalf |
| `SG-Collectoid-Consumer` | Data Consumer | Browse, search, request access, view "My Access" |
| `SG-Collectoid-Admin` | System Administrator | User management, system configuration, audit review |

**[QUESTION-INT-001]** What are the actual Azure AD security group names that map to Collectoid roles? Are these existing groups or do they need to be created? Confirm with Identity Services team.

**[QUESTION-INT-002]** Which Azure AD tenant should Collectoid register in? Is there a specific tenant for R&D applications, or does it use the corporate-wide tenant?

#### Sync Strategy

| Aspect | Strategy |
|--------|----------|
| **Authentication** | Real-time -- every login requires Azure AD token exchange |
| **User profile** | Cached in Redis for 15 minutes; refreshed on next request after TTL expiry |
| **Group membership** | Fetched at login and cached; invalidated on explicit role change or after 15 minutes |
| **Token refresh** | Auth.js handles silent refresh using refresh token before access token expiry |

#### Error Handling

| Failure Mode | Detection | Response | User Impact |
|-------------|-----------|----------|-------------|
| Azure AD unreachable | HTTP timeout (5s) or 5xx response | Show "Authentication service unavailable" page with retry button | **Full block** -- cannot authenticate |
| Token exchange failure | Non-200 response on `/token` | Log error; redirect to login with error message | User must retry login |
| Graph API failure | HTTP error on `/me` or `/memberOf` | Use cached profile if available; flag as stale; proceed with last-known roles | Minimal -- stale profile data |
| Invalid/expired session | JWT validation failure | Clear session; redirect to login | User must re-authenticate |
| Group claim missing | Empty `memberOf` response | Assign default "Consumer" role; log warning for admin review | User gets minimum-privilege access |

#### Circuit Breaker Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Failure threshold | 5 failures in 60 seconds | Azure AD is highly available; 5 failures indicates genuine outage |
| Open duration | 30 seconds | Short recovery window; Azure AD outages are typically brief |
| Half-open probe | 1 request | Test with single lightweight request (`/me`) before closing |
| Scope | Graph API calls only | OIDC flow itself cannot be circuit-broken (hard dependency) |

#### SLA Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Login latency (p95) | < 3 seconds (end-to-end including Azure AD round-trip) | CloudWatch + Auth.js timing |
| Token refresh latency | < 1 second | Application metrics |
| Graph API call latency (p95) | < 500ms | Application metrics |
| Availability | 99.99% (Azure AD SLA) | Azure SLA documentation |

---

### 4.2 AZCT REST API (Clinical Trial Metadata)

#### Overview

The AZCT (AstraZeneca Clinical Trials) REST API is the source of truth for study and dataset metadata. Collectoid depends on AZCT to resolve d-codes, retrieve study details (therapeutic area, phase, patient counts, geography, status), and keep its local dataset cache current. This integration is central to the collection creation wizard (Steps 3-4 in the ROAM process: translate criteria to stable metadata, produce definitive asset list).

Without AZCT data, Collectoid cannot resolve collection criteria to concrete study lists, making collection creation impossible. However, existing cached data allows browsing and searching of previously synced collections.

**References:** `01-architecture-overview.md` Section 2 (External System Summary); `03-data-model.md` Section 3.7 (Dataset entity), Section 6 (External Data Caching - `external_cache_azct`)

#### Data Exchanged

**Inbound from AZCT (study metadata):**

| Data Field | Maps to Collectoid Field | Description |
|------------|--------------------------|-------------|
| Study ID | `datasets.azct_study_id` | AZCT-internal study identifier |
| D-code | `datasets.d_code` | AstraZeneca study d-code (e.g., "D7080C00001") |
| Study name | `datasets.name` | Human-readable study name |
| Description | `datasets.description` | Study description |
| Therapeutic area(s) | `datasets.therapeutic_areas` | TA codes (ONC, CVRM, R&I, V&I, etc.) |
| Phase | `datasets.phase` | Trial phase (I, II, III, IV, Observational) |
| Study status | `datasets.status` | Active, closed, archived |
| Closed date | `datasets.closed_date` | Date study was closed |
| Geography | `datasets.geography` | Countries/regions |
| Patient count | `datasets.patient_count` | Number enrolled patients |
| Clinical metadata | `datasets.clinical_metadata` (JSONB) | FSI date, DBL date, PI, NCT number, protocol, endpoints, etc. |
| AoT metadata | `datasets.aot_metadata` (JSONB) | ML/AI restrictions, publication restrictions, embargo dates |
| Sponsor type | `datasets.sponsor_type` | AZ-sponsored, ISMO, external, investigator-run |
| Data availability | `datasets.data_availability` | Where data resides (PDP, entimICE, CTDS, etc.) |
| Compliance status | `datasets.compliance_status` | Ethical/legal review status |
| Modalities | `datasets.modalities` | Available data modalities (SDTM, ADaM, Imaging, etc.) |

**Outbound to AZCT:**

| Data | Purpose |
|------|---------|
| None planned | Collectoid is a read-only consumer of AZCT data. No write-back. |

**[QUESTION-INT-003]** What is the exact AZCT API version and base URL? Is there an OpenAPI/Swagger specification available?

**[QUESTION-INT-004]** What are the AZCT API rate limits? Requests per minute, requests per day, concurrent connections?

**[QUESTION-INT-005]** Does AZCT support pagination? What is the maximum page size? Is cursor-based or offset-based pagination used?

**[QUESTION-INT-006]** Does AZCT expose a `/changes` or delta endpoint that returns only studies modified since a given timestamp? This would significantly optimize the sync process.

#### Integration Pattern

**Scheduled Batch Sync (Primary):**

```
                 ECS Scheduled Task (cron)              AZCT REST API
                         |                                    |
  Every 1 hour:          |                                    |
                         | 1. GET /api/studies                |
                         |    ?modified_since={last_sync}     |
                         |    &page=1&limit=500               |
                         |----------------------------------->|
                         |  <-- 200 + study list -------------|
                         |                                    |
                         | 2. For each study:                 |
                         |    - Upsert into datasets table    |
                         |    - Upsert into external_cache_   |
                         |      azct (raw JSON payload)       |
                         |    - Update source_synced_at       |
                         |                                    |
                         | 3. Continue pagination until       |
                         |    all pages fetched                |
                         |                                    |
                         | 4. Log sync summary:               |
                         |    - Studies added/updated/removed  |
                         |    - Duration, error count          |
                         |                                    |
                         | 5. If any study status changed:     |
                         |    Publish "dataset.status_changed" |
                         |    to SNS                           |
```

**On-Demand Lookup (Collection Creation Wizard):**

```
DCM User                     Collectoid API              Redis Cache         AZCT API
   |                              |                          |                  |
   | POST /api/datasets/search    |                          |                  |
   | { criteria: { ta: "ONC",     |                          |                  |
   |   phase: "III", ... }}       |                          |                  |
   |----------------------------->|                          |                  |
   |                              | 1. Check cache           |                  |
   |                              |    for matching criteria  |                  |
   |                              |------------------------->|                  |
   |                              |                          |                  |
   |                              | [Cache HIT, <1hr old]    |                  |
   |                              |  <-- Cached results -----|                  |
   |                              |                          |                  |
   |                              | [Cache MISS or stale]    |                  |
   |                              | 2. GET /api/studies      |                  |
   |                              |    ?therapeutic_area=ONC  |                  |
   |                              |    &phase=III            |                  |
   |                              |-------------------------------------------->|
   |                              |  <-- Fresh results -------------------------|
   |                              |                          |                  |
   |                              | 3. Store in cache ------>|                  |
   |                              |                          |                  |
   |  <-- Study list + d-codes ---|                          |                  |
```

#### Authentication Method

| Aspect | Value |
|--------|-------|
| Method | OAuth 2.0 Client Credentials Grant |
| Token endpoint | `https://{az-tenant}.login.microsoftonline.com/{tenant-id}/oauth2/v2.0/token` |
| Scope | `api://{azct-app-id}/.default` |
| Token caching | Access token cached in Redis until 5 minutes before expiry |
| Credential storage | Client ID and secret in AWS Secrets Manager |

**[QUESTION-INT-007]** What is the AZCT API authentication method? Is it OAuth 2.0 client credentials, API key, or certificate-based? Is there an existing service principal Collectoid can reuse?

#### Sync Strategy

| Aspect | Strategy |
|--------|----------|
| **Primary sync** | Scheduled batch every 1 hour via ECS Scheduled Task. Pulls delta changes (studies modified since last sync). |
| **On-demand** | Criteria-based search during collection creation wizard. Checks cache first (1-hour TTL), falls back to live API. |
| **Full refresh** | Weekly full sync (overnight, off-peak) to catch any missed deltas and reconcile drift. |
| **Cache location** | Redis (search results, 1 hour TTL) + Aurora PostgreSQL `datasets` table (persistent) + `external_cache_azct` (raw JSON) |
| **Invalidation** | TTL-based for Redis cache. Database records updated by sync job. |
| **Conflict resolution** | AZCT is source of truth. If local record differs from AZCT, AZCT wins. Local-only fields (e.g., `collection_id` assignments) are preserved. |

**[QUESTION-INT-008]** Does AZCT support webhooks or change notifications? If yes, we can switch from scheduled polling to event-driven cache invalidation, reducing latency from 1 hour to near real-time.

#### Error Handling

| Failure Mode | Detection | Response | User Impact |
|-------------|-----------|----------|-------------|
| AZCT API unreachable | HTTP timeout (10s) or connection refused | Serve from local cache + `external_cache_azct`; mark data as stale; show "Last synced: X hours ago" | Minimal if cache is warm; collection creation wizard shows cached data with staleness indicator |
| Rate limit exceeded (429) | HTTP 429 response with `Retry-After` header | Back off per `Retry-After`; SQS retry with exponential delay | Sync delayed; on-demand queries served from cache |
| Partial sync failure | Some studies fail to fetch (4xx on individual records) | Log failed study IDs; continue with remaining; retry failures in next cycle | Missing updates for specific studies; flagged in admin dashboard |
| Schema change | Unexpected JSON fields or missing required fields | Log warning; store raw JSON in `external_cache_azct.raw_payload`; skip mapping for unexpected fields | No immediate impact; requires mapping code update |
| Full outage (>4 hours) | No successful sync in 4+ consecutive cycles | Alert ops team via PagerDuty; admin dashboard shows "AZCT sync critical" | Stale data; new study metadata unavailable; collection creation may reference outdated data |

#### Retry Strategy

| Parameter | Value |
|-----------|-------|
| Max retries | 3 |
| Backoff | Exponential: 2s, 4s, 8s |
| Retry on | 5xx errors, 429 (with Retry-After), network timeouts |
| Do not retry on | 400, 401, 403, 404 (client errors are not transient) |
| Idempotency | GET requests are inherently idempotent; safe to retry |

#### Circuit Breaker Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Failure threshold | 10 failures in 5 minutes | Higher threshold than Azure AD because batch sync tolerates latency |
| Open duration | 60 seconds | Give AZCT time to recover |
| Half-open probe | 1 lightweight request (`GET /api/studies?limit=1`) | Minimal load test |
| Fallback | Serve from `datasets` table and `external_cache_azct` | Cached data is always available |

#### Fallback Behaviour

When AZCT is unavailable:

1. **Collection browsing/searching:** Fully functional from local `datasets` table. UI shows "Data as of: [last sync timestamp]".
2. **Collection creation wizard (criteria resolution):** Shows cached study list with warning: "Study data may be up to [N] hours old. New studies added to AZCT since the last sync will not appear."
3. **D-code resolution:** Works from local cache. Returns `{ source: "cache", synced_at: "..." }` in response metadata.
4. **Study status changes:** Delayed. Automatic flagging of status-changed studies (per VS2-329 acceptance criteria) only triggers after next successful sync.

#### SLA Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Batch sync duration | < 10 minutes for full hourly delta | Application metrics |
| Batch sync success rate | > 99% of scheduled syncs complete successfully | CloudWatch scheduled task metrics |
| On-demand d-code resolution (p95) | < 2 seconds (cache hit) / < 5 seconds (cache miss) | Application metrics |
| Data freshness (worst case) | < 2 hours (1 hour sync + 1 hour margin) | Sync timestamp monitoring |

---

### 4.3 Cornerstone API (User Training Data)

#### Overview

AstraZeneca uses Cornerstone OnDemand as its Learning Management System (LMS). The ROAM process requires that users complete mandatory training before being granted data access. Collectoid must verify training completion status at two points: (1) during collection creation (Step 6: obtain approved artefacts, including training requirements) and (2) during access request processing (Step 10 in Flow 2: check training status before provisioning).

Cornerstone is classified as **MEDIUM** criticality. If unavailable, Collectoid can proceed with access workflows and flag training verification as "pending manual review".

**References:** `01-architecture-overview.md` Section 8 (Caching Strategy: Cornerstone training status - 30 min TTL)

#### Data Exchanged

**Inbound from Cornerstone:**

| Data Field | Description | Used For |
|------------|-------------|----------|
| User ID (Cornerstone) | LMS user identifier | Cross-reference with Azure AD |
| Training course ID | Unique identifier for each required training | Map to ROAM training requirements |
| Course title | Human-readable course name | Display in UI |
| Completion status | `completed`, `in_progress`, `not_started`, `expired` | Compliance gate for access provisioning |
| Completion date | Timestamp of last completion | Audit trail, recertification tracking |
| Expiry date | When certification expires (if applicable) | Proactive expiry notifications |
| Score (if applicable) | Assessment score | Compliance records |

**User ID Mapping:**

| Collectoid Field | Cornerstone Field | Mapping Method |
|-----------------|-------------------|----------------|
| `users.azure_ad_id` | Cornerstone User ID | Lookup table or email-based matching |
| `users.email` | Cornerstone email | Primary fallback for ID mapping |

**[QUESTION-INT-009]** How are Cornerstone user IDs structured? Can they be derived from the Azure AD PRID, or is there a separate mapping table? Is email the reliable cross-reference key?

**[QUESTION-INT-010]** What is the Cornerstone API authentication method? OAuth 2.0, API key, or SAML assertion?

**[QUESTION-INT-011]** Which specific training course IDs are required for ROAM data access? Are these uniform across all TAs or TA-specific?

#### Integration Pattern

**On-Demand Check with Cache:**

```
Collectoid API                Redis Cache           Cornerstone API
     |                            |                       |
     | 1. Check training for      |                       |
     |    user "prid-123"         |                       |
     |    courses: ["ROAM-101",   |                       |
     |              "GxP-200"]    |                       |
     |                            |                       |
     | 2. GET cache               |                       |
     |    key: collectoid:prod:   |                       |
     |    training:prid-123       |                       |
     |--------------------------->|                       |
     |                            |                       |
     | [Cache HIT, <30 min old]   |                       |
     |  <-- Cached status --------|                       |
     |                            |                       |
     | [Cache MISS or stale]      |                       |
     | 3. GET /api/v1/users/      |                       |
     |    {user-id}/transcripts   |                       |
     |    ?courseIds=ROAM-101,     |                       |
     |     GxP-200                |                       |
     |-------------------------------------------------->|
     |  <-- Training records ----------------------------|
     |                            |                       |
     | 4. Store in cache -------->|                       |
     |    (TTL: 30 minutes)       |                       |
     |                            |                       |
     | 5. Map to compliance       |                       |
     |    status per course       |                       |
```

#### Authentication Method

| Aspect | Value |
|--------|-------|
| Method | **[QUESTION-INT-010]** -- likely OAuth 2.0 or API key |
| Credential storage | AWS Secrets Manager |
| Token/key rotation | Per AZ security policy (minimum quarterly) |

#### Sync Strategy

| Aspect | Strategy |
|--------|----------|
| **Primary pattern** | On-demand with 30-minute Redis cache. Training status is checked when needed, not bulk-synced. |
| **Trigger points** | (1) Access request submission; (2) Collection creation training requirements step; (3) Periodic compliance audit |
| **Batch option** | Optional nightly batch for users with active access to flag upcoming expiries. Dispatched via SQS `external-sync` queue. |
| **Cache key** | `collectoid:{env}:training:{azure_ad_id}` |
| **Cache TTL** | 30 minutes (training status changes infrequently; manual completion takes time) |

#### Error Handling

| Failure Mode | Detection | Response | User Impact |
|-------------|-----------|----------|-------------|
| Cornerstone API unreachable | HTTP timeout (8s) or 5xx | Return cached status if available; if no cache, return `{ status: "verification_pending", message: "Training verification temporarily unavailable" }` | Access request proceeds but is flagged for manual training verification by DPO |
| User not found in Cornerstone | 404 response | Log warning; return `{ status: "not_found", message: "Training records not found for this user" }` | User is informed; DCM/DPO must investigate ID mapping |
| Partial data (some courses missing) | Missing course IDs in response | Return available courses; flag missing as `unknown` | Some training requirements show as "Unable to verify" |
| Rate limited | 429 response | Queue request for retry via SQS; serve from cache | Delayed verification; cached status shown if available |

#### Retry Strategy

| Parameter | Value |
|-----------|-------|
| Max retries | 2 |
| Backoff | Linear: 3s, 6s |
| Retry on | 5xx, 429, network timeouts |
| Do not retry on | 400, 401, 403, 404 |

#### Circuit Breaker Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Failure threshold | 5 failures in 3 minutes | Cornerstone is lower priority; fail fast to avoid blocking access workflows |
| Open duration | 120 seconds | Generous recovery window; training checks are not time-critical |
| Half-open probe | 1 request | Single lightweight transcript lookup |
| Fallback | Return `verification_pending` status; flag for manual DPO review | Access workflow continues; compliance verified manually |

#### Fallback Behaviour

When Cornerstone is unavailable:

1. **Access request submission:** Proceeds normally. Training verification status set to `pending_manual_review`. DPO is notified to verify training completion manually.
2. **Collection creation:** Training requirements step shows: "Training verification service temporarily unavailable. Training requirements have been recorded and will be verified before provisioning."
3. **Compliance audit:** Stale cached data is used with clear "Last verified: [timestamp]" indicator.

#### SLA Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Training check latency (p95) | < 2 seconds (cache hit) / < 5 seconds (cache miss) | Application metrics |
| Cache hit rate | > 80% (during active workflows) | Redis metrics |
| API availability | > 99% (Cornerstone SLA) | External SLA |

---

### 4.4 Collibra 2.0 (Standardized Metadata)

#### Overview

Collibra 2.0 is AstraZeneca's new standardized metadata catalog, currently under development. When available, it will provide a governed vocabulary/taxonomy, data lineage information, business glossary definitions, and data quality scores. Collectoid intends to consume Collibra's taxonomy to standardize how collections reference data types, categories, and quality attributes.

Collibra 2.0 is classified as **MEDIUM** criticality with a significant risk: it may not be ready when Collectoid launches. A robust fallback strategy is essential.

**References:** `01-architecture-overview.md` Section 2 (External System Summary: "may not be ready at launch; fallback to AZCT"); `03-data-model.md` Section 6 (External Data Caching - `external_cache_collibra`)

#### Data Exchanged

**Inbound from Collibra 2.0:**

| Data Field | Description | Used For |
|------------|-------------|----------|
| Asset ID | Collibra unique asset identifier | Cross-reference key |
| Asset name | Standardized name for a data asset | Display, search |
| Asset type | Type classification (Dataset, Study, Column, etc.) | Taxonomy browsing |
| Domain | Business domain (Oncology, CVRM, etc.) | Filtering, categorization |
| Business glossary terms | Standardized definitions for data terms | Hover-over definitions, search enrichment |
| Data quality score | Quality rating per asset | Quality indicators in UI |
| Data lineage | Upstream/downstream relationships | Lineage visualization (future) |
| Tags / classifications | Standardized tags | Search facets |
| Last modified | When asset metadata was last updated | Freshness tracking |

**Outbound from Collectoid:**

| Data | Purpose |
|------|---------|
| None planned | Collectoid is a read-only consumer of Collibra metadata |

**[QUESTION-INT-012]** What is the Collibra 2.0 API availability timeline? Is there a sandbox or preview environment available for early integration testing?

**[QUESTION-INT-013]** What is the Collibra 2.0 data model schema? Is the REST API stable or still under active development?

**[QUESTION-INT-014]** How does Collibra 2.0's taxonomy map to the existing 30+ data category taxonomy in Collectoid (see `03-data-model.md`, Section 3.9)? Will Collibra be the authoritative source for categories, or will Collectoid maintain its own taxonomy?

#### Integration Pattern

**Scheduled Batch Sync:**

```
ECS Scheduled Task (cron)            Collibra 2.0 API
         |                                 |
  Every 6 hours:                           |
         | 1. GET /api/v2/assets           |
         |    ?type=Dataset                |
         |    &modified_since={last_sync}  |
         |    &limit=500                   |
         |-------------------------------->|
         |  <-- Asset list ----------------|
         |                                 |
         | 2. GET /api/v2/glossary         |
         |    /terms?domain=Clinical       |
         |-------------------------------->|
         |  <-- Glossary terms ------------|
         |                                 |
         | 3. Upsert into                  |
         |    external_cache_collibra      |
         |    + update data_categories     |
         |    where applicable             |
         |                                 |
         | 4. Refresh Redis taxonomy cache |
         |    key: collectoid:prod:        |
         |    taxonomy:collibra:latest     |
```

#### Authentication Method

| Aspect | Value |
|--------|-------|
| Method | OAuth 2.0 Client Credentials (expected) |
| Credential storage | AWS Secrets Manager |

**[QUESTION-INT-015]** Confirm Collibra 2.0 authentication method. Is it OAuth 2.0, API key, or SAML-based?

#### Sync Strategy

| Aspect | Strategy |
|--------|----------|
| **Primary sync** | Scheduled batch every 6 hours. Taxonomy changes are infrequent. |
| **Cache location** | Redis (taxonomy: 6-hour TTL) + Aurora PostgreSQL `external_cache_collibra` (persistent) |
| **Full refresh** | Weekly full sync overnight to reconcile taxonomy drift |
| **Cache key** | `collectoid:{env}:collibra:taxonomy:latest`, `collectoid:{env}:collibra:asset:{id}` |

#### Error Handling

| Failure Mode | Detection | Response | User Impact |
|-------------|-----------|----------|-------------|
| Collibra API unreachable | HTTP timeout (10s) or 5xx | Serve from local cache; fall back to AZCT-sourced taxonomy | None if cache is warm |
| Schema change | Unexpected fields or missing fields | Log warning; store raw JSON; skip unmappable fields | Graceful -- new fields ignored until mapping updated |
| Collibra 2.0 not yet available | Connection refused or service not found | Activate AZCT fallback taxonomy permanently | None -- AZCT taxonomy is the fallback |

#### Fallback Behaviour (Critical -- Collibra May Not Be Ready)

Collectoid must operate without Collibra 2.0. The fallback strategy is:

| Collibra Status | Taxonomy Source | Data Quality Scores | Business Glossary | Data Lineage |
|----------------|-----------------|---------------------|-------------------|--------------|
| **Available** | Collibra 2.0 (primary), merged with AZCT | Collibra 2.0 | Collibra 2.0 | Collibra 2.0 |
| **Partially available** | Merge: Collibra for available domains, AZCT for gaps | Available domains only | Available terms only | Not available |
| **Not available** | AZCT-sourced taxonomy + Collectoid's internal `data_categories` table | Not available (no UI indicator) | Not available | Not available |

The fallback is implemented as a taxonomy resolver:

```typescript
// lib/services/taxonomy-resolver.ts
async function resolveTaxonomy(): Promise<TaxonomyTree> {
  // 1. Try Collibra 2.0 cache
  const collibra = await collibraCache.getTaxonomy();
  if (collibra && collibra.isComplete) return collibra;

  // 2. Try Collibra partial + AZCT fill
  if (collibra && collibra.isPartial) {
    const azct = await azctCache.getTaxonomy();
    return mergeTaxonomies(collibra, azct);
  }

  // 3. Fall back to AZCT + internal categories
  const azct = await azctCache.getTaxonomy();
  const internal = await db.dataCategories.findAll();
  return mergeTaxonomies(azct, internal);
}
```

#### Circuit Breaker Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Failure threshold | 3 failures in 5 minutes | Low threshold because fallback is well-defined |
| Open duration | 300 seconds (5 minutes) | Generous; Collibra sync is not time-critical |
| Half-open probe | 1 request | Lightweight asset count query |
| Fallback | AZCT taxonomy + internal `data_categories` | Always available |

#### SLA Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Batch sync duration | < 5 minutes | Application metrics |
| Taxonomy cache availability | 100% (local fallback guarantees this) | Redis + PostgreSQL availability |
| Data freshness (Collibra available) | < 7 hours (6 hour sync + margin) | Sync timestamp monitoring |

---

### 4.5 Immuta (Data Access Policy Management)

#### Overview

Immuta is the platform-level data access policy engine. When a collection receives all required approvals, Collectoid must instruct Immuta to create or update data access policies that grant the approved users access to the approved datasets. This is the "auto-provisioning" goal referenced in the ROAM process (Step 8: DPO configures policies, which Collectoid aims to automate).

Immuta is classified as **HIGH** criticality for the provisioning workflow. However, Immuta failures do not block the Collectoid UI -- they only block the provisioning step, which can be retried.

**References:** `01-architecture-overview.md` Section 9 (Event-Driven Patterns: provisioning-tasks queue)

#### Data Exchanged

**Outbound to Immuta — Target Tables and Field Mapping:**

When a collection is approved, Collectoid must create or update records across **four** core Immuta tables. The mapping below reflects the 10-table Immuta data model discovered during sprint zero analysis (source: `Immuta Tables for R&D.xlsx`).

**1. `Data_Access_Intent` — one row per collection activity**

| Immuta Field | Description | Source in Collectoid |
|--------------|-------------|---------------------|
| `Category` | High-level intent category (e.g., "Research", "Operational") | Derived from collection activity categories |
| `Sub_Category` | Granular sub-category (e.g., "Biomarker discovery") | Derived from collection activity sub-categories |
| `Data_Access_Summary` | Human-readable summary of data access and purpose | `collections.name` + `agreement_versions.terms` summary |
| `Purpose` | Formal purpose statement (maps to AoT purpose terms) | `agreement_versions.terms.purpose` |
| `To_train_AI_ML_models` | Whether this intent involves training AI/ML models | `agreement_versions.terms.beyond_primary_use.ai_research` (boolean) |
| `To_store_data_in_AI_ML_model` | Whether data will be stored inside an AI/ML model | **[TBD — separate flag not yet captured in Collectoid AoT; needs new field]** |
| `Next_Review_Date` | Next scheduled review date for this intent | `agreement_versions.review_date` |
| `Effective_Date` | When the intent becomes active | `agreement_versions.effective_date` |

> **[TBD — METADATA FLOW]:** Confirm the full `Category` and `Sub_Category` taxonomy. The Immuta Excel has ~60 intent rows with categories like "Scientific Analysis", "Data Engineering", "HEOR" — these must map to Collectoid's 4 activity categories (Permitted Analysis, Data Sharing, Publication, AI/ML). Mapping document needed.

**2. `Access_Authorisation` — one or more rows per intent, tracking approval chain**

| Immuta Field | Description | Source in Collectoid |
|--------------|-------------|---------------------|
| `Authorisation_Type` | `IDA` (standing access, 90% route) or `AdHoc` (request-based, 10% route) | Derived from collection type / access request type |
| `Approval_Status` | `Pending`, `Approved`, `Rejected` | `approvals.decision` |
| `Approver_Tier` | `Data Steward/DPM`, `Source Owner`, or `Power User - TALT` | `approvals.team` mapped to Immuta tier enum |
| `Approver_Identity` | Identity of the approver | `approvals.approver_id` (resolved via Azure AD) |
| `Approval_Timestamp` | When approval was granted/denied | `approvals.decided_at` |
| `IDA_Reference` | IDA reference number (for standing access) | **[TBD — where does the IDA reference originate?]** |
| `AdHoc_Reference` | AdHoc reference (INT-XXXXXXXX-XXXX format) | **[TBD — reference format and generation logic]** |

> **[TBD — METADATA FLOW]:** Confirm the mapping between Collectoid's approver roles (DDO, GPT, TALT, Alliance) and Immuta's three approval tiers (Data Steward/DPM, Source Owner, Power User - TALT). Is Alliance a fourth tier?

**3. `Partition_Filter_Criteria` — row-level security from selected d-codes**

| Immuta Field | Description | Source in Collectoid |
|--------------|-------------|---------------------|
| `Filter_Expression` | SQL WHERE clause: `Study_ID IN ('D-001', 'D-042', 'D-119')` | Built from `collection_version_datasets.d_code` list |
| `Filter_Type` | Always `ROW_LEVEL` for d-code partitions | Static value |
| `Data_Source` | The Starburst data source the filter applies to | `collection_version_datasets.sources` |

> Each collection's selected d-codes are translated into a `Study_ID IN (...)` clause. A collection with 5 d-codes produces a single IN clause per data source.

**4. `User_Profile` — criteria-based expressions determining which users match**

| Immuta Field | Description | Source in Collectoid |
|--------------|-------------|---------------------|
| `Profile_Expression` | Boolean expression over `User_Tags`, e.g., `tag:department = 'Oncology' AND tag:training_complete = true` | Built from collection role group selections + AoT conditions |
| `Profile_Type` | `CRITERIA_BASED` (expression match) or `EXPLICIT` (named users) | Determined by whether collection uses group-based or named-user access |

> **[TBD — METADATA FLOW]:** Confirm whether Collectoid creates User Profiles in Immuta or references pre-existing profiles. The Immuta Excel shows ~12 profiles with complex boolean expressions — does Collectoid generate these or does DPO maintain them?

**Reference tables (read-only for Collectoid):**

| Immuta Table | Collectoid Interaction | Notes |
|-------------|----------------------|-------|
| `User_Tags` | Read-only (validation) | Tags from Manual, NPA (auto-fetched by Immuta), Workday, Cornerstone. Collectoid must understand the tag taxonomy to build valid User_Profile expressions. |
| `Data_Asset` | Read-only (reference) | Broad Starburst data products (e.g., "Enriched Clinical Data"). A collection is a scoped subset of a Data_Asset. |
| `Internal_Data_Agreement` | Read-only (reference) | IDA records that authorize standing access. Collections operating on the 90% IDA route reference existing IDAs. |
| `Data_Usage_Restrictions` | Read-only (reference) | Usage restrictions per data asset. Collectoid should validate that AoT terms do not conflict with Data_Usage_Restrictions. |
| `Hypothesis` | Not used | Empty in current Immuta data; future use TBD. |
| `Partition_Applicable` | Created via Partition_Filter_Criteria | Junction table linking partitions to users/profiles. |

**Column-Level Masking (Pending — flagged in PBAC metadata diagram):**

The PBAC metadata requirements diagram identifies column-level masking as a pending addition to the Immuta provisioning model. This is distinct from row-level partitions and governs which columns are visible, redacted, or obfuscated per user/intent.

| Aspect | Detail |
|--------|--------|
| **Scope** | Column-level (e.g., mask `patient_name`, `date_of_birth`, `site_id` in clinical trial data) |
| **Mechanism** | Immuta masking policies applied at Starburst query time — columns return `NULL`, hashed values, or redacted strings |
| **Collectoid mapping** | AoT terms may specify data sensitivity tiers; masking rules derive from the intersection of sensitivity tier + user clearance |
| **Immuta table** | **[TBD]** — Masking may be a policy attribute on existing tables or a separate masking configuration table |
| **Write responsibility** | **[TBD]** — Does Collectoid specify masking rules, or does DPO configure them independently in Immuta? |

> **Note:** This was flagged as "Masking to be added" in the PBAC metadata requirements diagram. No Immuta masking table appeared in the `Immuta Tables for R&D.xlsx` analysis, suggesting this is a future addition to Immuta's model or an existing feature not yet documented in the R&D context.

**Inbound from Immuta (status & validation reads):**

| Data Field / Table | Description | Used For |
|--------------------|-------------|----------|
| `Data_Access_Intent` status | Status of the intent row (`Active`, `Pending_Review`, `Expired`) | Provisioning status display |
| `Access_Authorisation` status | Confirmation that Immuta recorded the authorisation | Reconciliation with Collectoid's own approval state |
| `Partition_Filter_Criteria` filter ID | Immuta-assigned identifier for the created filter | Reference tracking for updates/revocation |
| `User_Profile` profile ID | Immuta-assigned profile identifier | Reference tracking |
| `User_Tags` (read) | Current tag values for a user | Pre-flight validation before building `User_Profile` expressions |
| Error details | If any table write failed, structured error response | Error resolution by DPO |
| Masking policy status | Whether masking rules are active for collection's data sources | Pre-flight validation; compliance dashboard |

**[QUESTION-INT-016]** ~~What is the Immuta API contract for policy creation?~~ **Partially Resolved.** The 10-table data model is now understood (see mapping above). Write targets are `Data_Access_Intent`, `Access_Authorisation`, `Partition_Filter_Criteria`, and `User_Profile`. **TBD:** Confirm whether writes are via direct REST API, bulk import, or Immuta's policy-as-code CLI. Need OpenAPI spec or SDK confirmation from Immuta team.

**[QUESTION-INT-017]** ~~How should AoT terms map to Immuta policy conditions?~~ **Partially Resolved.** AoT purpose terms → `Data_Access_Intent.Purpose`; AoT conditions → `Partition_Filter_Criteria` (row-level) and `User_Profile` (user-level); approver tiers → `Access_Authorisation.Approver_Tier` with three values: `Data Steward/DPM`, `Source Owner`, `Power User - TALT`. **TBD:** Confirm full `Authorisation_Type` enum beyond `IDA` and `AdHoc`. Clarify whether AI/ML flags trigger additional Immuta-side restrictions.

**[QUESTION-INT-018]** ~~Does Immuta support policy-as-code?~~ **Partially Resolved.** The multi-table model suggests per-table API writes rather than a single policy document. **TBD:** Confirm batch/bulk endpoint availability; clarify transactional guarantees (can we atomically create Intent + Authorisation + Filter + Profile?).

**[QUESTION-INT-019]** Is there an Immuta sandbox environment for integration testing? **Still Open.**

#### Integration Pattern

**Event-Driven via SQS (provisioning-tasks queue):**

```
ApprovalService               SQS: provisioning-tasks      ImmutaClient
     |                              |                            |
     | 1. All TAs approved          |                            |
     |    collection.status =       |                            |
     |    "provisioning"            |                            |
     |                              |                            |
     | 2. Send message:             |                            |
     |    { type: "create_policy",  |                            |
     |      collection_id: "...",   |                            |
     |      version_id: "...",      |                            |
     |      policies: [...] }       |                            |
     |----------------------------->|                            |
     |                              |                            |
     |                              | 3. Consumer picks up msg   |
     |                              |--------------------------->|
     |                              |                            |
     |                              |    4. POST /api/v2/        |
     |                              |       policies             |
     |                              |       { name, subjects,    |
     |                              |         data_sources,      |
     |                              |         conditions }       |
     |                              |                            |
     |                              |  <-- 201 + policy_id ------|
     |                              |                            |
     |                              |    5. Update collection:   |
     |                              |       provisioning_status  |
     |                              |       = "policy_created"   |
     |                              |                            |
     |                              |    6. Publish              |
     |                              |       "provisioning.       |
     |                              |        policy_created"     |
     |                              |       to SNS               |
```

#### Authentication Method

| Aspect | Value |
|--------|-------|
| Method | OAuth 2.0 Client Credentials or API key (TBC) |
| Credential storage | AWS Secrets Manager |
| Service identity | Dedicated service principal for Collectoid |

**[QUESTION-INT-020]** ~~What is the Immuta API authentication method?~~ **Partially Resolved.** Immuta uses `User_Tags` with NPA (auto-fetched) as one identity source, confirming Immuta integrates with the corporate AD/identity provider. **TBD:** Confirm whether Collectoid authenticates via OAuth 2.0 client credentials, API key, or service principal for write access to the 4 target tables.

**[QUESTION-INT-040]** What Immuta mechanism handles column-level data masking? Is masking configured as a policy attribute on `Data_Access_Intent` rows, a separate masking table, or an Immuta-native feature managed outside the 10-table model? Does Collectoid need to specify masking rules, or is this DPO-managed? **[TBD — METADATA FLOW]**

**[QUESTION-INT-041]** What monitoring and reporting capabilities does Immuta expose for verifying policy enforcement? Is there a status/health API, audit dashboard, or reconciliation endpoint that Collectoid can query to confirm that provisioned policies (intents, authorisations, partitions, profiles, masking) are actively enforced at the Starburst/Ranger layer? **[TBD — METADATA FLOW]**

#### Sync Strategy

| Aspect | Strategy |
|--------|----------|
| **Policy creation** | Event-driven via SQS `provisioning-tasks` queue. Triggered when all approvals are complete. |
| **Policy status check** | Periodic poll every 5 minutes for policies in `pending` state. Or webhook if Immuta supports it. |
| **Policy revocation** | Event-driven: when collection is archived or access is revoked, publish revocation message to SQS. |

#### Error Handling

| Failure Mode | Detection | Response | User Impact |
|-------------|-----------|----------|-------------|
| Immuta API unreachable | HTTP timeout (15s) or 5xx | Message remains in SQS; retried with exponential backoff (3 retries, then DLQ) | Provisioning delayed; collection status remains "provisioning" |
| Policy creation rejected (400) | 4xx response with error details | Send to DLQ; notify DPO via email with error details for manual resolution | DPO must manually create policy and update status |
| Partial policy creation | Some datasets succeed, others fail | Track per-dataset status; retry only failed datasets | Partial provisioning; user sees "X of Y datasets provisioned" |
| Policy conflict | Immuta reports conflicting policy | Log conflict; notify DPO; do not overwrite existing policy | Requires DPO manual resolution |

#### Retry Strategy

| Parameter | Value |
|-----------|-------|
| Max retries | 3 (via SQS) |
| Backoff | Exponential: 30s, 120s, 480s (longer intervals for provisioning) |
| Retry on | 5xx errors, network timeouts |
| Do not retry on | 400 (invalid policy), 403 (insufficient permissions), 409 (conflict) |
| DLQ | `dlq-provisioning-tasks` with 14-day retention |

#### Circuit Breaker Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Failure threshold | 5 failures in 10 minutes | Provisioning is async; moderate threshold |
| Open duration | 180 seconds | Allow Immuta recovery time |
| Half-open probe | 1 request | Lightweight `GET /api/v2/policies?limit=1` |
| Fallback | Messages accumulate in SQS; DPO notified for manual provisioning | Existing manual process is the fallback |

#### Fallback Behaviour

When Immuta is unavailable:

1. **Collection approval:** Completes normally. Collection status transitions to "provisioning".
2. **Policy creation:** Messages queue in SQS. DPO is notified via email that automated provisioning is delayed.
3. **User access:** Users are informed: "Access is approved. Provisioning is in progress and may take longer than usual."
4. **Manual fallback:** DPO creates policies manually in Immuta console (this is the current process, so it is a known fallback).

#### SLA Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Policy creation latency (p95) | < 60 seconds (from SQS message to Immuta confirmation) | Application metrics |
| Provisioning completion (end-to-end) | < 30 minutes from final approval to active policy | Workflow timing metrics |
| DLQ depth | 0 (all messages eventually processed) | SQS CloudWatch metrics |

---

### 4.6 Starburst / Ranger (Query-Level Access Control)

#### Overview

While Immuta manages platform-level data access policies, Starburst (with Apache Ranger) enforces query-level access control at the data layer. When a user runs a query in a consumption environment (SCP, Domino, etc.) against the data lake, Starburst checks Ranger policies to determine if the query is permitted. Collectoid must configure Ranger policies in parallel with Immuta policies when provisioning access.

Starburst/Ranger is classified as **HIGH** criticality for provisioning, sharing the same async pattern as Immuta.

**References:** `01-architecture-overview.md` Section 2 (External System Summary); `03-data-model.md` Section 3.7 (Dataset entity: `data_layers` field)

#### Data Exchanged

**Outbound to Starburst/Ranger:**

| Data Field | Description | Source in Collectoid |
|------------|-------------|---------------------|
| Policy name | Ranger policy name | `collections.name` + version |
| Users/groups | Who gets query access | `collection_members` |
| Database/schema/table | What data objects to grant access to | `datasets.d_code` mapped to Starburst catalog objects |
| Access type | SELECT, INSERT, etc. | Typically SELECT-only for data consumers |
| Row-level filter | Optional row-level security conditions | `agreement_versions.terms` conditions |
| Column masking | Columns to mask/redact | `datasets.aot_metadata` restrictions |

**Inbound from Starburst/Ranger:**

| Data Field | Description | Used For |
|------------|-------------|----------|
| Policy ID | Ranger policy identifier | Reference tracking |
| Policy status | Active, inactive, error | Status display |

**[QUESTION-INT-021]** How does Starburst/Ranger policy relate to Immuta policy? Are they complementary (both required), or does Immuta cascade to Ranger automatically?

**[QUESTION-INT-022]** Who currently configures Starburst/Ranger policies? Is there an API, or is it done through the Ranger Admin UI? If API, what is the contract?

**[QUESTION-INT-023]** Does Starburst have a REST API for policy management, or must policies be configured through Ranger's REST API directly?

#### Integration Pattern

Same event-driven pattern as Immuta, processed from the same `provisioning-tasks` SQS queue:

```
SQS: provisioning-tasks          StarburstClient
         |                             |
         | 1. Message: {               |
         |   type: "configure_access", |
         |   target: "starburst",      |
         |   collection_id: "...",     |
         |   datasets: [...],          |
         |   users: [...],             |
         |   access_type: "SELECT"     |
         | }                           |
         |---------------------------->|
         |                             |
         |    2. POST /ranger/         |
         |       service/policy        |
         |       { policyName,         |
         |         resources,          |
         |         policyItems }       |
         |                             |
         |  <-- 200 + policy_id -------|
         |                             |
         |    3. Update provisioning   |
         |       status:               |
         |       "starburst_configured"|
```

#### Authentication Method

| Aspect | Value |
|--------|-------|
| Method | Service principal or Kerberos (TBC) |
| Credential storage | AWS Secrets Manager |

**[QUESTION-INT-024]** What authentication does the Ranger REST API require? Is it Kerberos, basic auth, or certificate-based?

#### Sync Strategy

| Aspect | Strategy |
|--------|----------|
| **Policy creation** | Event-driven via SQS (same queue as Immuta) |
| **Policy verification** | Periodic check for policies in pending state |
| **Policy revocation** | Event-driven on collection archival or access revocation |

#### Error Handling and Circuit Breaker

Mirrors Immuta configuration (Section 4.5). Same retry strategy, circuit breaker thresholds, and DLQ routing. DPO is the manual fallback for Ranger policy configuration.

#### Fallback Behaviour

When Starburst/Ranger is unavailable:

1. DPO is notified for manual Ranger policy configuration (current operational process).
2. Collection provisioning status shows "Starburst configuration pending".
3. Users cannot query data until Ranger policy is active, but can still see collection status in Collectoid.

#### SLA Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Policy configuration latency (p95) | < 60 seconds | Application metrics |
| End-to-end query access (from approval to first query) | < 1 hour | Workflow timing |

---

### 4.7 Consumption Environments (PDP, Domino, SCP, AI Bench, IO Platform)

#### Overview

Consumption environments are the actual platforms where researchers access and analyse clinical trial data. Collectoid does not provision access directly into most of these environments. Instead, Collectoid: (a) records which environments a collection targets (see `03-data-model.md`, collection version snapshots), (b) displays environment availability status, and (c) provides deep links or launch links for users to access their environment.

For some environments (particularly PDP), there may be a provisioning API that Collectoid can call to trigger environment-level access setup. For others, provisioning is manual (DPO-managed) and Collectoid simply displays the status.

**References:** `02-business-requirements.md` FR-COL-013, FR-COL-014, FR-COL-015 (Consumption environment selection and default boundaries)

#### Environment Inventory

| Environment | Full Name | Primary Use Case | Provisioning Method | Link Type |
|-------------|-----------|------------------|---------------------|-----------|
| **PDP** | Precision Data Platform | Data lakehouse; primary clinical data store | API (likely) | Deep link to PDP portal |
| **Domino** | Domino Data Lab | ML/AI model development, Jupyter notebooks | Manual (DPO) or API | Deep link to Domino workspace |
| **SCP** | Scientific Computing Platform | Statistical analysis (SAS, R, Python) | Manual (DPO) | Deep link to SCP session |
| **AI Bench** | AI Bench | AI/ML experimentation | Manual (DPO) or API | Deep link to AI Bench project |
| **IO Platform** | IO Platform | Immuno-Oncology specific analysis | Manual (DPO) | Deep link to IO Platform |

**[QUESTION-INT-028]** Do any of these consumption environments expose provisioning APIs? Specifically: PDP, Domino, AI Bench?

**[QUESTION-INT-029]** How can Collectoid verify that a specific user has active access to a specific environment? Is there a status API, or is this information only available in Immuta/Starburst?

**[QUESTION-INT-030]** What is the deep link format for each environment? Can Collectoid construct a URL that drops the user directly into a relevant workspace/project?

#### Data Exchanged

**Outbound (provisioning trigger, where API exists):**

| Data Field | Description |
|------------|-------------|
| User identifier | Azure AD ID or PRID of the user |
| Dataset identifiers | D-codes or data paths to provision |
| Access level | Read-only, read-write |
| Environment configuration | Workspace name, project, resources |

**Inbound (status, where API exists):**

| Data Field | Description | Used For |
|------------|-------------|----------|
| Environment availability | Whether the environment is online | Status indicator in UI |
| User access status | Whether user has active session/workspace | Access indicator per environment |
| Workspace/project URL | Direct link to user's workspace | "Open in [Environment]" button |

#### Integration Pattern

**Provisioning (where API exists):**

```
SQS: provisioning-tasks           ProvisioningClient           PDP API / Domino API
         |                              |                            |
         | 1. Message: {                |                            |
         |   type: "provision_env",     |                            |
         |   environment: "pdp",        |                            |
         |   user_id: "...",            |                            |
         |   datasets: [...] }          |                            |
         |----------------------------->|                            |
         |                              | 2. POST /api/provision     |
         |                              |    { userId, datasets,     |
         |                              |      accessLevel }         |
         |                              |--------------------------->|
         |                              |  <-- 200/201 --------------|
         |                              |                            |
         |                              | 3. Update collection       |
         |                              |    provisioning status     |
         |                              |    for this environment    |
```

**Link-Out (where no API exists):**

```
User Browser                  Collectoid UI
     |                            |
     | 1. View collection detail  |
     |    "My Environments"       |
     |--------------------------->|
     |                            |
     |  <-- Environment cards:    |
     |  [PDP] Status: Active      |
     |    [Open in PDP ->]        |
     |  [Domino] Status: Active   |
     |    [Open in Domino ->]     |
     |  [SCP] Status: Pending     |
     |    [Request Access ->]     |
     |                            |
     | 2. Click "Open in PDP"     |
     |--------------------------->|
     |                            |
     |  <-- 302 Redirect to       |
     |  https://pdp.az.com/       |
     |  workspace?study=D-12345   |
```

#### Authentication Method

Varies by environment. Collectoid uses the user's existing Azure AD session (SSO) where possible.

#### Error Handling

| Failure Mode | Detection | Response | User Impact |
|-------------|-----------|----------|-------------|
| Provisioning API unreachable | HTTP timeout or error | Queue for retry; notify DPO | Provisioning delayed |
| Environment status check fails | API error | Show "Status unavailable" with last-known state | Minor -- link-out still works |
| Deep link broken | User reports or automated link check | Show generic environment URL instead of deep link | User must navigate manually within environment |

#### Circuit Breaker Configuration

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Failure threshold | 3 failures in 5 minutes (per environment) | Separate circuit per environment |
| Open duration | 120 seconds | |
| Fallback | Show "Status unavailable"; DPO manual provisioning | |

#### SLA Requirements

| Metric | Target | Measurement |
|--------|--------|-------------|
| Provisioning trigger latency | < 30 seconds from SQS message to API call | Application metrics |
| Environment status freshness | < 5 minutes | Status check interval |
| Link availability | 99.5% | Link validation monitoring |

---

## 5. Internal Event Bus (SQS/SNS)

While not an external integration, the internal event bus is critical infrastructure that orchestrates all integration flows. Full details are in `01-architecture-overview.md`, Section 9. This section summarizes the integration-relevant aspects.

### Event Flow Map

```
Domain Events (producers)          SNS Topics              SQS Queues (consumers)
+----------------------------+     +------------------+    +---------------------------+
| CollectionService          |---->| collectoid-      |--->| audit-events              |
|   collection.created       |     | events           |    |   -> AuditService         |
|   collection.updated       |     |                  |    +---------------------------+
|   collection.submitted     |     |                  |--->| approval-notifications    |
|   collection.approved      |     |                  |    |   -> NotificationService  |
|   collection.provisioning  |     |                  |    +---------------------------+
+----------------------------+     |                  |--->| provisioning-tasks        |
                                   |                  |    |   -> ImmutaClient         |
+----------------------------+     |                  |    |   -> StarburstClient      |
| ApprovalService            |---->|                  |    |   -> ProvisioningClient   |
|   approval.submitted       |     |                  |    +---------------------------+
|   approval.approved        |     +------------------+    +---------------------------+
|   approval.rejected        |                             | external-sync             |
|   approval.all_complete    |     +------------------+    |   -> AZCTClient           |
+----------------------------+     | request-status-  |--->|   -> CollibraClient       |
                                   | changes          |    |   -> CornerstoneClient    |
+----------------------------+     +------------------+    +---------------------------+
| RequestService             |---->|                  |
|   request.created          |     |                  |
|   request.matched          |     +------------------+
+----------------------------+
```

### Queue Configuration

| Queue | Visibility Timeout | Max Receive Count | DLQ | Retention |
|-------|--------------------|-------------------|-----|-----------|
| `audit-events` | 30s | 5 | `dlq-audit-events` | 14 days |
| `approval-notifications` | 60s | 3 | `dlq-approval-notifications` | 14 days |
| `provisioning-tasks` | 300s (5 min) | 3 | `dlq-provisioning-tasks` | 14 days |
| `external-sync` | 600s (10 min) | 3 | `dlq-external-sync` | 14 days |
| All DLQs | N/A | N/A | N/A | 14 days |

### DLQ Monitoring

Any message in a DLQ triggers a PagerDuty alert. DLQ messages represent either:
- A bug in message processing (investigate and fix)
- An external system outage that exceeded retries (re-drive after resolution)
- An invalid message (log and discard)

---

## 6. Data Sync Patterns

Collectoid uses four distinct data synchronization patterns across its integrations. Each pattern is selected based on the data freshness requirement, external system capabilities, and failure tolerance.

### Pattern Summary

| Pattern | Used By | Freshness | Complexity | Failure Impact |
|---------|---------|-----------|------------|----------------|
| **Real-time API call** | Azure AD (auth) | Immediate | Low | Hard failure (auth blocked) |
| **On-demand with cache** | Cornerstone, AZCT (wizard) | 30 min - 1 hour | Medium | Graceful (cached data) |
| **Scheduled batch sync** | AZCT (bulk), Collibra | 1 - 6 hours | Medium | Graceful (stale data) |
| **Event-driven async** | Immuta, Starburst | Near real-time | High | Queued (retried) |

### Pattern 1: Real-Time API Call

```
User Request --> Collectoid --> External API --> Response --> User
                                    |
                              (no caching)
```

- **When:** The data must be fresh for the request to be meaningful (e.g., authentication token)
- **Risk:** External system becomes a hard dependency on the request path
- **Used for:** Azure AD OIDC token exchange only

### Pattern 2: On-Demand with Cache (Cache-Aside)

```
User Request --> Collectoid --> Check Cache
                                  |
                          [HIT]   |   [MISS/STALE]
                            |     |        |
                        Return    |    Call External API
                        cached    |        |
                        data      |    Store in Cache
                                  |        |
                                  +-- Return fresh data
```

- **When:** Data freshness is important but not critical; external API is relatively fast
- **Cache TTL:** Configured per integration (30 min for Cornerstone, 1 hour for AZCT on-demand)
- **Stale-while-revalidate:** Return stale data immediately; refresh asynchronously in background
- **Used for:** Cornerstone training checks, AZCT on-demand d-code resolution

### Pattern 3: Scheduled Batch Sync

```
                   +--------+
Scheduled Task --> | Fetch  | --> Upsert Local DB
(cron)             | Delta  |     + Refresh Cache
                   +--------+
```

- **When:** Large datasets that change infrequently; freshness of 1-6 hours is acceptable
- **Delta sync:** Only fetch records modified since last sync (requires `modified_since` API parameter)
- **Full reconciliation:** Weekly full sync to catch drift
- **Used for:** AZCT bulk study sync (hourly), Collibra taxonomy sync (6-hourly)

### Pattern 4: Event-Driven Async

```
Domain Event --> SNS Topic --> SQS Queue --> Consumer --> External API
                                                |
                                          [Success] --> Update Status
                                          [Failure] --> Retry / DLQ
```

- **When:** Collectoid initiates an action in an external system (policy creation, provisioning trigger)
- **Guarantees:** At-least-once delivery via SQS; idempotent consumers
- **Used for:** Immuta policy creation, Starburst policy configuration, consumption environment provisioning

### Cache Layer Summary

| Data | Cache Layer 1 (Redis) | Cache Layer 2 (Aurora PostgreSQL) | Source of Truth |
|------|-----------------------|-----------------------------------|-----------------|
| User session | 24h sliding TTL | N/A (JWT in Redis only) | Azure AD |
| User profile + roles | 15 min TTL | `users` table (updated at login) | Azure AD |
| AZCT study metadata | 1h TTL (search results) | `datasets` table + `external_cache_azct` | AZCT API |
| Cornerstone training | 30 min TTL | N/A (ephemeral cache only) | Cornerstone API |
| Collibra taxonomy | 6h TTL | `external_cache_collibra` + `data_categories` | Collibra 2.0 (or AZCT fallback) |
| Collection summaries | 5 min TTL | `collections` + `collection_versions` | Local DB (source of truth) |
| Rate limit counters | Per-window TTL (1 min, 15 min) | N/A | Local (Redis is authoritative) |

---

## 7. Error Handling Strategy

### Global Error Handling Principles

All external integration clients share these principles, implemented in `lib/clients/base-client.ts`:

| Principle | Implementation |
|-----------|----------------|
| **Classify errors** | Distinguish between transient (retry) and permanent (fail fast) errors |
| **Log with context** | Every error log includes: correlation ID, target system, endpoint, HTTP status, latency, retry count |
| **Metric emission** | Every error increments a per-system error counter in CloudWatch |
| **Graceful degradation** | Return cached/default data when possible; never crash the application |
| **User communication** | Show clear, actionable messages: "Study data may be up to X hours old" rather than "503 Service Unavailable" |

### Error Classification

| HTTP Status | Classification | Action |
|-------------|---------------|--------|
| 400 Bad Request | **Permanent** | Do not retry; log error with request payload; alert dev team |
| 401 Unauthorized | **Permanent** (credential issue) | Refresh token once; if still 401, alert ops team |
| 403 Forbidden | **Permanent** (permission issue) | Do not retry; alert ops team for permission investigation |
| 404 Not Found | **Permanent** (resource missing) | Do not retry; return appropriate "not found" response |
| 408 Request Timeout | **Transient** | Retry with backoff |
| 429 Too Many Requests | **Transient** (throttled) | Retry after `Retry-After` header value |
| 500 Internal Server Error | **Transient** | Retry with exponential backoff |
| 502 Bad Gateway | **Transient** | Retry with exponential backoff |
| 503 Service Unavailable | **Transient** | Retry with exponential backoff |
| 504 Gateway Timeout | **Transient** | Retry with exponential backoff |
| Network error / DNS failure | **Transient** | Retry with exponential backoff |

### Retry Configuration Summary

| System | Max Retries | Backoff | Timeout |
|--------|-------------|---------|---------|
| Azure AD (Graph API) | 2 | 1s, 2s | 5s |
| AZCT REST API | 3 | 2s, 4s, 8s | 10s |
| Cornerstone API | 2 | 3s, 6s | 8s |
| Collibra 2.0 API | 2 | 5s, 10s | 10s |
| Immuta API | 3 (via SQS) | 30s, 120s, 480s | 15s |
| Starburst/Ranger API | 3 (via SQS) | 30s, 120s, 480s | 15s |
| Consumption Environment APIs | 3 (via SQS) | 10s, 30s, 60s | 10s |

---

## 8. Circuit Breaker Patterns

### Circuit Breaker State Machine

```
                    failure_count < threshold
                   +-------------------------+
                   |                         |
                   v                         |
              +---------+            +-------+-------+
              |         |            |               |
   Start ---->| CLOSED  |--- fail -->|    OPEN       |
              |         |   (count   |               |
              | (normal |   exceeds  | (all requests |
              |  traffic)|  threshold)|  fail fast)   |
              |         |            |               |
              +----+----+            +-------+-------+
                   ^                         |
                   |                         | timeout expires
                   |                         |
                   |                  +------v--------+
                   |                  |               |
                   +--- success <---- | HALF-OPEN     |
                                      |               |
                     failure -------->| (probe with   |
                     (back to OPEN)   |  1 request)   |
                                      |               |
                                      +---------------+
```

### Circuit Breaker Configuration Summary

| System | Failure Threshold | Open Duration | Half-Open Probes | Fallback |
|--------|-------------------|---------------|------------------|----------|
| **Azure AD (Graph)** | 5 in 60s | 30s | 1 | Cached profile; minimum-privilege role |
| **AZCT API** | 10 in 5 min | 60s | 1 | Local `datasets` table + `external_cache_azct` |
| **Cornerstone** | 5 in 3 min | 120s | 1 | `verification_pending` status; DPO manual check |
| **Collibra 2.0** | 3 in 5 min | 300s | 1 | AZCT taxonomy + internal `data_categories` |
| **Immuta** | 5 in 10 min | 180s | 1 | SQS accumulation; DPO manual provisioning |
| **Starburst/Ranger** | 5 in 10 min | 180s | 1 | SQS accumulation; DPO manual provisioning |
| **Consumption Envs** | 3 in 5 min (per env) | 120s | 1 | "Status unavailable"; DPO manual |

### Health Dashboard Integration

Circuit breaker states feed into the `/api/health` endpoint (see `01-architecture-overview.md`, Section 11):

```json
{
  "status": "degraded",
  "checks": {
    "azure_ad": { "status": "healthy", "circuit": "closed" },
    "azct": { "status": "healthy", "circuit": "closed" },
    "cornerstone": { "status": "degraded", "circuit": "open", "openSince": "2026-02-06T10:15:00Z" },
    "collibra": { "status": "healthy", "circuit": "closed" },
    "immuta": { "status": "healthy", "circuit": "closed" },
    "starburst": { "status": "healthy", "circuit": "closed" }
  }
}
```

---

## 9. Integration Testing Approach

### Testing Strategy by Layer

| Layer | Approach | Tools | Environment |
|-------|----------|-------|-------------|
| **Unit tests** | Mock all external clients; test business logic in isolation | Jest + MSW (Mock Service Worker) | Local / CI |
| **Contract tests** | Validate Collectoid's expectations match external API contracts | Pact (consumer-driven contract testing) | CI |
| **Integration tests** | Test against real external APIs in sandbox/dev environments | Jest + real HTTP clients | Dev environment |
| **End-to-end tests** | Full workflow tests including external system interactions | Playwright + real environment | Staging environment |

### Mock Strategy

Each external client has a corresponding mock implementation for local development and unit testing:

```
lib/
  clients/
    azct-client.ts              # Production client
    __mocks__/
      azct-client.ts            # Mock client for unit tests
  test-fixtures/
    azct-studies.json           # Sample AZCT API responses
    cornerstone-training.json   # Sample training records
    collibra-taxonomy.json      # Sample taxonomy data
    immuta-policies.json        # Sample policy responses
```

### Contract Testing

Consumer-driven contract tests validate that Collectoid's expectations of external APIs remain valid:

| Contract | Consumer (Collectoid expects) | Provider (External API) | Validation Frequency |
|----------|------------------------------|------------------------|---------------------|
| AZCT study response | Specific JSON fields, types, enums | AZCT REST API | Every CI build (consumer side); weekly (provider side) |
| Cornerstone transcript | Completion status enum, date format | Cornerstone API | Every CI build |
| Immuta policy creation | Request schema, response schema | Immuta API | Every CI build |

### Sandbox Environments

| System | Sandbox Available? | Access Method | Status |
|--------|--------------------|---------------|--------|
| Azure AD | Yes (AZ test tenant) | App registration in test tenant | **[QUESTION-INT-031]** Confirm test tenant access |
| AZCT API | **[QUESTION-INT-032]** Unknown | Need sandbox URL and credentials | Pending |
| Cornerstone | **[QUESTION-INT-033]** Unknown | Need sandbox tenant | Pending |
| Collibra 2.0 | **[QUESTION-INT-034]** Unknown (may not exist yet) | Need preview/beta access | Pending |
| Immuta | **[QUESTION-INT-035]** Unknown | Need sandbox instance | Pending |
| Starburst/Ranger | **[QUESTION-INT-036]** Unknown | Need dev cluster | Pending |
| Consumption Envs | N/A (link-out only for most) | N/A | N/A |

### Integration Test Scenarios

**Critical Path Tests:**

| # | Scenario | Systems Involved | Pass Criteria |
|---|----------|------------------|---------------|
| 1 | User login end-to-end | Azure AD | User authenticates, session created, profile loaded, roles assigned |
| 2 | AZCT batch sync | AZCT API, Aurora PG | Delta sync completes; datasets table updated; cache refreshed |
| 3 | D-code resolution (cache miss) | AZCT API, Redis | Criteria query returns matching studies; cache populated |
| 4 | D-code resolution (cache hit) | Redis | Same query returns from cache without AZCT call |
| 5 | Training verification | Cornerstone API, Redis | User training status returned; cache populated |
| 6 | Approval triggers policy creation | Immuta API, SQS | Approval completion publishes SQS message; Immuta policy created |
| 7 | Circuit breaker activation | Any (simulated failure) | After N failures, circuit opens; fallback activated; circuit heals after timeout |
| 8 | Collibra unavailable fallback | Collibra (simulated down) | Taxonomy resolver falls back to AZCT + internal categories |
| 9 | Full provisioning workflow | Immuta + Starburst + Environments | Collection approved; all policies created; environment provisioned |

---

## 10. Sprint Zero Integration Tasks

### Task List by System

#### Azure AD / Entra ID

| Task | Priority | Owner | Definition of Done |
|------|----------|-------|-------------------|
| Register Collectoid app in Azure AD (dev tenant) | **P0** | Identity Services + Engineering | App registration complete; client ID and secret available; redirect URIs configured |
| Configure OIDC scopes (`openid`, `profile`, `email`, `User.Read`, `GroupMember.Read.All`) | **P0** | Identity Services | Scopes approved and granted admin consent |
| Identify or create Azure AD security groups for Collectoid roles | **P1** | Identity Services | Group names confirmed; test users assigned to groups |
| Implement Auth.js Azure AD provider in dev environment | **P0** | Engineering | Login flow works end-to-end; user session created in Redis |
| Verify Graph API access for user profile and group membership | **P1** | Engineering | `/me`, `/me/memberOf` return expected data |

#### AZCT REST API

| Task | Priority | Owner | Definition of Done |
|------|----------|-------|-------------------|
| Obtain AZCT API documentation (OpenAPI spec or equivalent) | **P0** | AZCT Team | API spec received and reviewed |
| Obtain sandbox/dev API credentials | **P0** | AZCT Team + Engineering | Service principal or API key provisioned |
| Validate API response schema against `datasets` entity fields | **P1** | Engineering | Field mapping documented; sample responses archived in `test-fixtures/` |
| Implement `AZCTClient` with authentication, pagination, error handling | **P1** | Engineering | Client passes unit tests against mock; integration test against sandbox |
| Implement scheduled batch sync job (ECS Scheduled Task) | **P2** | Engineering | Hourly sync runs in dev; datasets table populated |
| Validate rate limits and plan sync batch size accordingly | **P1** | AZCT Team + Engineering | Rate limits documented; batch size configured below limit |

#### Cornerstone API

| Task | Priority | Owner | Definition of Done |
|------|----------|-------|-------------------|
| Obtain Cornerstone API documentation | **P1** | Cornerstone Admin | API spec received; auth method confirmed |
| Resolve user ID mapping (Azure AD to Cornerstone) | **P1** | Identity Services + Cornerstone Admin | Mapping strategy confirmed (email, PRID, or lookup table) |
| Identify required ROAM training course IDs | **P1** | R&D Data Office | Course IDs documented; confirmed with Cornerstone Admin |
| Obtain sandbox API credentials | **P2** | Cornerstone Admin | Credentials provisioned and tested |

#### Collibra 2.0

| Task | Priority | Owner | Definition of Done |
|------|----------|-------|-------------------|
| Confirm Collibra 2.0 readiness timeline | **P0** | Collibra Team / WP3 | Timeline documented; go/no-go decision for launch dependency |
| If available: obtain API documentation and sandbox access | **P2** | Collibra Team | API spec received; sandbox access confirmed |
| Design and implement taxonomy fallback strategy | **P1** | Engineering | Taxonomy resolver works with AZCT-only data; integration test passes |

#### Immuta

| Task | Priority | Owner | Definition of Done |
|------|----------|-------|-------------------|
| Obtain Immuta API documentation | **P1** | Immuta Team / DPO | API spec received; policy creation contract understood |
| Define AoT-to-Immuta policy mapping | **P1** | Engineering + DPO | Mapping document reviewed and approved by DPO |
| Obtain sandbox instance credentials | **P2** | Immuta Team | Credentials provisioned; test policy creation works |

#### Starburst / Ranger

| Task | Priority | Owner | Definition of Done |
|------|----------|-------|-------------------|
| Confirm Ranger REST API availability and contract | **P1** | Platform Team | API spec received; authentication method confirmed |
| Clarify Immuta-Ranger relationship (complement or cascade?) | **P0** | Platform Team + DPO | Decision documented; integration architecture updated if needed |
| Obtain dev cluster access | **P2** | Platform Team | Credentials provisioned; test policy creation works |

#### Consumption Environments

| Task | Priority | Owner | Definition of Done |
|------|----------|-------|-------------------|
| Inventory all consumption environment APIs | **P1** | DPO Team | Per-environment API availability documented (API vs link-out) |
| Collect deep link URL patterns for each environment | **P2** | DPO Team | URL patterns documented and tested |

### Sprint Zero Timeline (Integration-Focused)

```
Week 1-2: Foundation
  [P0] Azure AD app registration + Auth.js implementation
  [P0] AZCT API documentation and credential procurement
  [P0] Collibra 2.0 timeline confirmation
  [P0] Immuta-Ranger relationship clarification

Week 3-4: Client Implementation
  [P1] AZCTClient implementation + batch sync
  [P1] Azure AD Graph API integration (profile, groups, roles)
  [P1] Cornerstone API documentation + user ID mapping
  [P1] Taxonomy fallback strategy implementation

Week 5-6: Integration Validation
  [P2] Contract tests for AZCT, Cornerstone, Immuta
  [P2] Sandbox access for all available systems
  [P2] End-to-end integration test in dev environment
```

---

## 11. Dependency Risk Matrix

### Risk Assessment

| # | Integration | Risk Level | Risk Description | Likelihood | Impact | Mitigation |
|---|-------------|------------|------------------|------------|--------|------------|
| 1 | **Azure AD / Entra ID** | **LOW** | Well-established service with 99.99% SLA. App registration is routine at AZ. | Low | Critical (auth blocked) | Redundant Azure AD configuration; session persistence in Redis extends tolerance for brief outages |
| 2 | **AZCT REST API** | **HIGH** | API documentation, rate limits, and sandbox access are unconfirmed. Schema may not match Collectoid's needs. | Medium | High (collection creation blocked) | Early API discovery (sprint zero, week 1); local cache ensures browsing works even if API is down |
| 3 | **Cornerstone API** | **MEDIUM** | User ID mapping strategy is unclear. API may not support the specific queries Collectoid needs. | Medium | Medium (training verification degraded) | Design for `verification_pending` fallback from day one; manual DPO verification as backup |
| 4 | **Collibra 2.0** | **VERY HIGH** | May not be ready for Collectoid launch. API may be unstable. | High | Medium (taxonomy quality reduced) | Taxonomy fallback strategy is a P1 sprint zero task; Collectoid can launch without Collibra |
| 5 | **Immuta** | **HIGH** | API contract unknown. Policy mapping from AoT terms is complex and may require iteration. | Medium | High (provisioning blocked) | DPO manual provisioning is the existing fallback; early API discovery is essential |
| 6 | **Starburst / Ranger** | **HIGH** | Unclear whether Immuta cascades to Ranger or both need separate configuration. API availability unconfirmed. | Medium | High (query access blocked) | Clarify Immuta-Ranger relationship in sprint zero (P0); DPO manual fallback |
| 7 | **Consumption Environments** | **MEDIUM** | Multiple environments with varying API maturity. Some may be link-out only. | Medium | Medium (provisioning delayed) | Design for link-out first; add API provisioning as environments mature |

### Risk Heat Map

```
                    IMPACT
              Low    Medium    High    Critical
         +--------+---------+--------+----------+
  High   |        | Collibra|        |          |
         |        |   2.0   |        |          |
L        +--------+---------+--------+----------+
I Medium |        | Corner- | AZCT   |          |
K        |        | stone,  | Immuta |          |
E        |        | Cons.   | Starb. |          |
L        |        | Envs    |        |          |
I        +--------+---------+--------+----------+
H  Low   |        |         |        | Azure AD |
O        |        |         |        | (low risk|
O        |        |         |        |  high    |
D        |        |         |        |  impact) |
         +--------+---------+--------+----------+
```

### Recommended Risk Actions

| Priority | Action | Target |
|----------|--------|--------|
| **Immediate** | Confirm Collibra 2.0 timeline; make go/no-go decision on launch dependency | Week 1 of sprint zero |
| **Immediate** | Obtain AZCT API documentation and sandbox credentials | Week 1 of sprint zero |
| **Immediate** | Clarify Immuta-Ranger relationship (complement vs cascade) | Week 1 of sprint zero |
| **Week 2** | Validate AZCT API response schema against `datasets` entity | Week 2 of sprint zero |
| **Week 2** | Resolve Cornerstone user ID mapping strategy | Week 2 of sprint zero |
| **Week 3** | Obtain Immuta API documentation and sandbox access | Week 3 of sprint zero |
| **Week 3** | Inventory consumption environment APIs | Week 3 of sprint zero |

---

## 12. Open Questions Register

### Azure AD / Entra ID

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **INT-001** | What are the actual Azure AD security group names that map to Collectoid roles? Are these existing groups or do they need to be created? | RBAC implementation; user onboarding | Identity Services | Open |
| **INT-002** | Which Azure AD tenant should Collectoid register in? Is there a specific tenant for R&D applications? | App registration, security scope | Identity Services | Open |
| **INT-031** | Is there a test/dev Azure AD tenant with pre-configured test users for integration testing? | Testing strategy | Identity Services | Open |

### AZCT REST API

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **INT-003** | What is the exact AZCT API version and base URL? Is there an OpenAPI/Swagger specification? | Client implementation | AZCT Team | Open |
| **INT-004** | What are the AZCT API rate limits (requests/min, requests/day, concurrent connections)? | Sync batch sizing; on-demand throttling | AZCT Team | Open |
| **INT-005** | Does AZCT support pagination? What is the max page size? Cursor or offset? | Sync implementation | AZCT Team | Open |
| **INT-006** | Does AZCT expose a delta endpoint (`/changes` or `?modified_since=`) for incremental sync? | Sync efficiency (full scan vs delta) | AZCT Team | Open |
| **INT-007** | What is the AZCT API authentication method? Service principal, API key, or certificate? | Client authentication code | AZCT Team | Open |
| **INT-008** | Does AZCT support webhooks or change notifications for push-based sync? | Cache invalidation strategy (poll vs push) | AZCT Team | Open |
| **INT-032** | Is there an AZCT sandbox/dev API environment? | Integration testing | AZCT Team | Open |

### Cornerstone API

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **INT-009** | How are Cornerstone user IDs structured? Can they be derived from Azure AD PRID or email? | User mapping implementation | Cornerstone Admin | Open |
| **INT-010** | What is the Cornerstone API authentication method (OAuth 2.0, API key, SAML)? | Client authentication code | Cornerstone Admin | Open |
| **INT-011** | Which specific training course IDs are required for ROAM data access? Are they uniform or TA-specific? | Training verification logic | R&D Data Office | Open |
| **INT-033** | Is there a Cornerstone sandbox tenant for integration testing? | Testing strategy | Cornerstone Admin | Open |

### Collibra 2.0

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **INT-012** | What is the Collibra 2.0 API availability timeline? Is there a sandbox or preview? | Integration planning; fallback decision | Collibra Team / WP3 | Open |
| **INT-013** | What is the Collibra 2.0 data model schema? Is the API stable? | Client implementation | Collibra Team | Open |
| **INT-014** | How does Collibra taxonomy map to Collectoid's 30+ category taxonomy? Who is authoritative? | Taxonomy resolver design | Collibra Team + Engineering | Open |
| **INT-015** | What is the Collibra 2.0 authentication method? | Client authentication code | Collibra Team | Open |
| **INT-034** | Is there a Collibra 2.0 sandbox for early testing? | Testing strategy | Collibra Team | Open |

### Immuta

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **INT-016** | ~~Immuta API contract?~~ 10-table data model now mapped. **Remaining:** Confirm REST API endpoints/SDK for writing to `Data_Access_Intent`, `Access_Authorisation`, `Partition_Filter_Criteria`, `User_Profile`. | Client implementation | Immuta Team / DPO | **Partially Resolved** |
| **INT-017** | ~~AoT-to-Immuta mapping?~~ Purpose → Intent, conditions → Partitions + Profiles, approvers → Authorisation tiers. **Remaining:** Confirm full enum values; clarify AI/ML flag behaviour in Immuta. | Policy creation logic | Engineering + DPO | **Partially Resolved** |
| **INT-018** | ~~Policy-as-code?~~ Multi-table model suggests per-table API writes. **Remaining:** Confirm batch endpoint; clarify transactional atomicity across tables. | Implementation complexity | Immuta Team | **Partially Resolved** |
| **INT-019** | Is there an Immuta sandbox for integration testing? | Testing strategy | Immuta Team | Open |
| **INT-020** | ~~Authentication method?~~ NPA integration confirmed via `User_Tags`. **Remaining:** Confirm Collectoid service account auth for write access. | Client authentication | Immuta Team | **Partially Resolved** |
| **INT-035** | Is there an Immuta sandbox instance available? | Testing strategy | Immuta Team | Open |
| **INT-040** | What Immuta mechanism handles column-level masking? Collectoid-specified or DPO-managed? | Masking policy design | Immuta Team / DPO | Open |
| **INT-041** | What monitoring/reporting does Immuta expose for policy enforcement verification? | Compliance monitoring | Immuta Team / Engineering | Open |

### Starburst / Ranger

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **INT-021** | How does Starburst/Ranger policy relate to Immuta? Complementary or cascaded? | Architecture design (one integration vs two) | Platform Team + DPO | Open |
| **INT-022** | Who currently configures Starburst/Ranger policies? API or UI? | Integration approach | Platform Team | Open |
| **INT-023** | Does Starburst have a REST API, or must policies go through Ranger REST? | Client implementation | Platform Team | Open |
| **INT-024** | What authentication does Ranger REST API require (Kerberos, basic, cert)? | Client authentication | Platform Team | Open |
| **INT-036** | Is there a dev Starburst/Ranger cluster for testing? | Testing strategy | Platform Team | Open |

### Consumption Environments

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **INT-028** | Do any consumption environments (PDP, Domino, AI Bench) expose provisioning APIs? | Provisioning automation scope | DPO Team | Open |
| **INT-029** | How can Collectoid verify user access to a specific environment? Status API or Immuta/Starburst? | Access status display | DPO Team | Open |
| **INT-030** | What is the deep link URL format for each environment? | Link-out implementation | DPO Team | Open |

### Cross-Cutting

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **INT-037** | What is the network path from Collectoid's AWS VPC to each external system? VPC peering, PrivateLink, public internet + VPN? | Network architecture, firewall rules | Cloud Engineering | Open |
| **INT-038** | Is there an AZ standard for circuit breaker configuration (e.g., preferred library, standard thresholds)? | Implementation consistency | Cloud Engineering | Open |
| **INT-039** | Are there existing service principals or managed identities available for server-to-server API calls? | Credential management | Identity Services | Open |

---

## Appendix A: Integration Client Base Class

```typescript
// lib/clients/base-client.ts (conceptual)

interface CircuitBreakerConfig {
  failureThreshold: number;      // failures before opening
  failureWindow: number;         // window in ms to count failures
  openDuration: number;          // how long circuit stays open (ms)
  halfOpenProbes: number;        // requests to allow in half-open
}

interface RetryConfig {
  maxRetries: number;
  backoffMs: number[];           // e.g., [2000, 4000, 8000]
  retryableStatuses: number[];   // e.g., [429, 500, 502, 503, 504]
}

interface ClientConfig {
  baseUrl: string;
  timeout: number;               // request timeout in ms
  circuitBreaker: CircuitBreakerConfig;
  retry: RetryConfig;
  name: string;                  // for logging and metrics
}

abstract class BaseExternalClient {
  protected config: ClientConfig;
  protected circuitState: "closed" | "open" | "half-open";
  protected failureCount: number;

  async request<T>(method: string, path: string, options?: RequestOptions): Promise<T> {
    // 1. Check circuit breaker state
    // 2. Acquire auth token (cached or refresh)
    // 3. Make HTTP request with timeout
    // 4. On success: reset failure count; return data
    // 5. On transient failure: increment count; retry with backoff
    // 6. On permanent failure: throw typed error
    // 7. On threshold exceeded: open circuit; throw CircuitOpenError
    // 8. Emit metrics (latency, status, circuit state)
  }

  abstract getAuthToken(): Promise<string>;
  abstract healthCheck(): Promise<boolean>;
}
```

## Appendix B: Glossary of Integration Terms

| Term | Definition |
|------|------------|
| **Circuit breaker** | Pattern that stops making requests to a failing service after a threshold, preventing cascade failures |
| **Cache-aside** | Pattern where the application checks cache first, fetches from source on miss, and populates cache |
| **DLQ (Dead Letter Queue)** | Queue where messages are sent after exceeding retry limits, for manual investigation |
| **Delta sync** | Fetching only records changed since the last sync, rather than all records |
| **Fallback** | Alternative behaviour when a dependency is unavailable |
| **Half-open** | Circuit breaker state that allows a limited number of probe requests to test if a service has recovered |
| **Idempotent** | An operation that produces the same result when called multiple times |
| **SLA** | Service Level Agreement -- the availability and performance target for a service |
| **Stale-while-revalidate** | Pattern where stale cached data is returned immediately while a background refresh occurs |
| **TTL** | Time To Live -- how long cached data is considered fresh |
| **Webhook** | HTTP callback where an external service pushes event notifications to Collectoid |

---

*This document is a living artefact. It will be updated as open questions are resolved, API contracts are validated, and sandbox environments become available during sprint zero. All changes should be tracked via pull request with review from the engineering lead and integration owners.*

# Collectoid Production Architecture Overview

**Document ID:** SPRINT-ZERO-01
**Version:** 1.0
**Created:** 2026-02-06
**Status:** Draft -- Pending Stakeholder Review
**Author:** Engineering Team
**Program:** DOVS2 (Data Office Value Stream 2), WP4 -- UI & Agentic AI
**Supersedes:** Collectoid POC (Next.js 15 prototype with mocked data)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [System Context (C4 Level 1)](#2-system-context-c4-level-1)
3. [Container Diagram (C4 Level 2)](#3-container-diagram-c4-level-2)
4. [Component Diagram (C4 Level 3)](#4-component-diagram-c4-level-3)
5. [Deployment Architecture](#5-deployment-architecture)
6. [Database Recommendation](#6-database-recommendation)
7. [API Architecture](#7-api-architecture)
8. [Caching Strategy](#8-caching-strategy)
9. [Event-Driven Patterns](#9-event-driven-patterns)
10. [Data Flow Diagrams](#10-data-flow-diagrams)
11. [Cross-Cutting Concerns](#11-cross-cutting-concerns)
12. [Open Questions](#12-open-questions)

---

## 1. Executive Summary

Collectoid is AstraZeneca's next-generation clinical trial data access platform, replacing the legacy AZCt iDAP system. It enables the ROAM (Role-based Open Access Model) where approximately 90% of data access needs are met through pre-approved open collections, with the remaining 10% handled through traditional request-based workflows.

This document describes the production architecture for Collectoid, covering:

- **System boundaries** -- how Collectoid fits into AZ's data ecosystem alongside AZCT, Collibra, Immuta, Starburst, and downstream consumption environments
- **Internal architecture** -- Next.js monolith with API routes, database layer, cache, and event bus
- **Deployment topology** -- AWS ECS/Fargate behind CloudFront and ALB within an AZ-managed VPC
- **Data strategy** -- database recommendation, caching, and event-driven patterns
- **Key workflows** -- collection creation, access request, and multi-TA approval chain

### Scope

| In Scope | Out of Scope |
|----------|-------------|
| Collectoid web application architecture | AZCT internal architecture |
| API integration patterns with external systems | Immuta/Starburst policy engine internals |
| Database and caching layer design | Collibra 2.0 migration details |
| Deployment and infrastructure topology | Network/VPN topology between AZ and AWS |
| Monitoring and observability strategy | Data lake/warehouse architecture |

### Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Application framework | Next.js (latest) with App Router | Existing team expertise from POC; SSR + API routes in single deployment |
| Authentication | Azure AD / Entra ID via Auth.js | Corporate SSO mandate; Auth.js has first-class Azure AD provider |
| Hosting | AWS ECS/Fargate | AZ standard for containerized workloads; no cluster management overhead |
| CI/CD | AZ GitHub Actions + AWS CodePipeline | Existing AZ pipeline infrastructure |
| Database | Aurora PostgreSQL with JSONB (recommended) | See [Section 6](#6-database-recommendation) for full trade-off analysis |
| API pattern | Next.js Route Handlers (REST) | Monorepo simplicity; no separate API deployment |

### Related Documents

| Document | Path | Contents |
|----------|------|----------|
| Data Model | `docs/sprint-zero/03-data-model.md` | Detailed schema definitions, entity relationships, migration strategy |
| API Specification | `docs/sprint-zero/04-api-specification.md` | Endpoint catalog, request/response contracts, OpenAPI spec |
| Auth & RBAC Design | `docs/sprint-zero/05-auth-rbac.md` | Role hierarchy, permission matrix, session management |
| Infrastructure as Code | `docs/sprint-zero/06-infrastructure.md` | Terraform modules, environment configuration, secrets management |
| Gap Analysis (V2) | `docs/specs/collectoid-v2-gap-analysis.md` | ROAM process gap analysis, JIRA story mapping (VS2-329 to VS2-350) |

---

## 2. System Context (C4 Level 1)

This diagram shows Collectoid within the broader AstraZeneca data ecosystem, identifying all actors and external systems it interacts with.

### System Context Diagram

```
                                    +--------------------------+
                                    |     Azure AD / Entra ID  |
                                    |     (Corporate SSO)      |
                                    +------------+-------------+
                                                 |
                                                 | OAuth 2.0 / OIDC
                                                 |
+------------------+    HTTPS     +--------------+---------------+    REST API    +------------------+
|                  |  --------->  |                               |  ---------->  |                  |
|  Data Collection |              |                               |               |  AZCT REST API   |
|  Manager (DCM)   |              |                               |  <----------  |  (Study/Dataset  |
|                  |  <---------  |                               |    JSON       |   Metadata)      |
+------------------+              |                               |               +------------------+
                                  |        C O L L E C T O I D   |
+------------------+    HTTPS     |                               |    REST API    +------------------+
|                  |  --------->  |   Next.js Application         |  ---------->  |                  |
|  Data Consumer   |              |   (Web UI + API Routes)       |               |  Cornerstone API |
|  (Researcher)    |              |                               |  <----------  |  (Training       |
|                  |  <---------  |                               |    JSON       |   Completion)    |
+------------------+              |                               |               +------------------+
                                  |                               |
+------------------+    HTTPS     |                               |    REST API    +------------------+
|                  |  --------->  |                               |  ---------->  |                  |
|  Approver        |              |                               |               |  Collibra 2.0    |
|  (DDO/GPT/TALT)  |              |                               |  <----------  |  (Metadata       |
|                  |  <---------  |                               |    JSON       |   Catalog)       |
+------------------+              |                               |               +------------------+
                                  |                               |
+------------------+    HTTPS     |                               |    REST API    +------------------+
|                  |  --------->  |                               |  ---------->  |                  |
|  Team Lead       |              |                               |               |  Immuta           |
|                  |              |                               |  <----------  |  (Policy          |
|                  |  <---------  |                               |    JSON       |   Enforcement)   |
+------------------+              +-----------+---+---+-----------+               +------------------+
                                              |   |   |
                                              |   |   |           Policy Sync     +------------------+
                                              |   |   +------------------------->  |                  |
                                              |   |                               |  Starburst/Ranger|
                                              |   |               REST API        |  (Query ACL)     |
                                              |   |                               +------------------+
                                              |   |
                                              |
                                              |  Provisioning      +------------------+
                                              +------------------>  |  Consumption     |
                                                                   |  Environments:   |
                                                                   |  - PDP           |
                                                                   |  - Domino        |
                                                                   |  - SCP           |
                                                                   |  - AI Bench      |
                                                                   +------------------+
```

### Actor Summary

| Actor | Description | Key Interactions |
|-------|-------------|-----------------|
| **Data Collection Manager (DCM)** | R&D Data Office staff who create, curate, and manage data collections | Collection CRUD, analytics dashboard, operations tracker |
| **Data Consumer (Researcher)** | Scientists who discover data and request access | Browse collections, submit access requests, view "My Access" |
| **Approver (DDO/GPT/TALT)** | Data Owners, Governance Per Therapeutic area, and Legal teams who approve access | Review requests, approve/reject, sign AoTs, compliance verification |
| **Team Lead** | Department heads overseeing their team's data access | Virtual team management, access oversight, delegation |

### External System Summary

| System | Integration Type | Data Exchanged | Availability Dependency |
|--------|-----------------|----------------|------------------------|
| **Azure AD / Entra ID** | OAuth 2.0 / OIDC | User identity, group membership, roles | CRITICAL -- login blocked without it |
| **AZCT REST API** | REST (JSON) | Study metadata, dataset catalog, d-code resolution | HIGH -- collection creation depends on it |
| **Cornerstone API** | REST (JSON) | Training completion status per user | MEDIUM -- graceful degradation possible |
| **Collibra 2.0** | REST (JSON) | Standardized metadata taxonomy, data lineage | MEDIUM -- may not be ready at launch; fallback to AZCT |
| **Immuta** | REST (JSON) | Data access policies, policy creation/update | HIGH -- provisioning depends on it |
| **Starburst/Ranger** | REST / JDBC | Query-level access control, per-study policy | HIGH -- data consumption blocked without it |
| **Consumption Environments** | API / CLI | Provisioning triggers, environment configuration | MEDIUM -- varies by environment |

---

## 3. Container Diagram (C4 Level 2)

This diagram decomposes Collectoid into its internal containers: the application, database, cache, message queue, and their interactions.

### Container Diagram

```
+-----------------------------------------------------------------------------------+
|                              AWS VPC (Collectoid)                                  |
|                                                                                   |
|  +------------------+      +--------------------------------------------------+   |
|  |                  |      |              Private Subnets                      |   |
|  |  CloudFront CDN  |      |                                                  |   |
|  |  (Static Assets, |      |  +--------------------------------------------+ |   |
|  |   Edge Caching)  |      |  |         Application Load Balancer (ALB)     | |   |
|  |                  |      |  |         HTTPS Termination, WAF              | |   |
|  +--------+---------+      |  +-----+----------------------------------+---+ |   |
|           |                |        |                                  |      |   |
|           | Static         |        | /app/*                    /api/* |      |   |
|           | Assets         |        |                                  |      |   |
|           |                |  +-----v----------------------------------v---+  |   |
|           +--------------->|  |                                            |  |   |
|                            |  |          ECS Fargate Service               |  |   |
|                            |  |          (Next.js Application)             |  |   |
|                            |  |                                            |  |   |
|                            |  |  +-------------+    +-------------------+  |  |   |
|                            |  |  | React SSR    |    | API Route        |  |  |   |
|                            |  |  | (App Router) |    | Handlers         |  |  |   |
|                            |  |  | Pages,       |    | /api/collections |  |  |   |
|                            |  |  | Layouts,     |    | /api/requests    |  |  |   |
|                            |  |  | Server       |    | /api/approvals   |  |  |   |
|                            |  |  | Components   |    | /api/audit       |  |  |   |
|                            |  |  +------+------+    +--------+---------+  |  |   |
|                            |  |         |                    |             |  |   |
|                            |  +---------+--------------------+-------------+  |   |
|                            |            |                    |                |   |
|                            |            |                    |                |   |
|                            |  +---------v-------+   +--------v---------+     |   |
|                            |  |                 |   |                  |     |   |
|                            |  |  ElastiCache    |   |  Aurora          |     |   |
|                            |  |  (Redis 7)      |   |  PostgreSQL 15   |     |   |
|                            |  |                 |   |  (+ JSONB)       |     |   |
|                            |  |  - Sessions     |   |                  |     |   |
|                            |  |  - AZCT Cache   |   |  - Collections   |     |   |
|                            |  |  - Taxonomy     |   |  - Requests      |     |   |
|                            |  |  - Rate Limits  |   |  - Approvals     |     |   |
|                            |  |                 |   |  - Audit Log     |     |   |
|                            |  +-----------------+   +------------------+     |   |
|                            |                                                  |   |
|                            |  +--------------------------------------------+ |   |
|                            |  |              SQS / SNS                      | |   |
|                            |  |                                            | |   |
|                            |  |  Queues:                                   | |   |
|                            |  |  - approval-notifications                  | |   |
|                            |  |  - audit-events                            | |   |
|                            |  |  - provisioning-tasks                      | |   |
|                            |  |  - external-sync                           | |   |
|                            |  |                                            | |   |
|                            |  |  Topics:                                   | |   |
|                            |  |  - collection-events                       | |   |
|                            |  |  - request-status-changes                  | |   |
|                            |  +--------------------------------------------+ |   |
|                            |                                                  |   |
|                            +--------------------------------------------------+   |
+-----------------------------------------------------------------------------------+
```

### Container Responsibilities

| Container | Technology | Purpose | Scaling Strategy |
|-----------|-----------|---------|-----------------|
| **CloudFront CDN** | AWS CloudFront | Static asset delivery, edge caching, DDoS protection | AWS-managed; origin failover configured |
| **ALB** | AWS ALB + WAF | HTTPS termination, request routing, rate limiting, WAF rules | AWS-managed; cross-AZ |
| **Next.js Application** | Next.js (latest) on Node.js 20 LTS | Server-side rendering, API route handlers, business logic | Horizontal via ECS desired count (2-6 tasks) |
| **Aurora PostgreSQL** | Aurora PostgreSQL 15 | Primary data store: collections, requests, approvals, audit log | Aurora auto-scaling read replicas; Multi-AZ writer |
| **ElastiCache (Redis)** | Redis 7 on ElastiCache | Session store, AZCT metadata cache, taxonomy cache, rate limiting | Redis Cluster mode; 2-node replica set |
| **SQS / SNS** | AWS SQS + SNS | Async event processing: approval notifications, audit events, provisioning | Auto-scaling; dead-letter queues for failures |

---

## 4. Component Diagram (C4 Level 3)

This diagram breaks down the Next.js application into its internal modules, showing how responsibilities are separated within the monolith.

### Application Module Map

```
+-----------------------------------------------------------------------------------+
|                        Next.js Application (Monolith)                              |
|                                                                                   |
|  FRONTEND LAYER (React Server Components + Client Components)                      |
|  +-------------------------------------------------------------------------+      |
|  |                                                                         |      |
|  |  +------------------+  +------------------+  +-------------------+      |      |
|  |  |  DCM Module       |  |  Discovery       |  |  Request/Approval |      |      |
|  |  |                  |  |  Module           |  |  Module           |      |      |
|  |  |  - Create Wizard |  |                  |  |                   |      |      |
|  |  |    (11 steps)    |  |  - Browse        |  |  - Access Request |      |      |
|  |  |  - Collections   |  |    Collections   |  |    Wizard         |      |      |
|  |  |    Browser       |  |  - AI Discovery  |  |  - Approval Queue |      |      |
|  |  |  - Progress      |  |  - Dataset       |  |  - My Requests    |      |      |
|  |  |    Dashboard     |  |    Explorer      |  |  - Signature      |      |      |
|  |  |  - Analytics     |  |  - Search &      |  |    Capture        |      |      |
|  |  |  - Propositions  |  |    Filters       |  |  - Cross-TA       |      |      |
|  |  |                  |  |                  |  |    Coordination   |      |      |
|  |  +------------------+  +------------------+  +-------------------+      |      |
|  |                                                                         |      |
|  |  +------------------+  +------------------+  +-------------------+      |      |
|  |  |  Admin Module     |  |  Notification    |  |  Audit Module     |      |      |
|  |  |                  |  |  Module           |  |                   |      |      |
|  |  |  - User/Role     |  |                  |  |  - Activity Feed  |      |      |
|  |  |    Management    |  |  - In-App        |  |  - Decision       |      |      |
|  |  |  - System Config |  |    Notifications |  |    History        |      |      |
|  |  |  - Feature Flags |  |  - Email Digest  |  |  - Version        |      |      |
|  |  |  - External Sys  |  |  - Mention       |  |    Comparison     |      |      |
|  |  |    Health        |  |    Routing       |  |  - Compliance     |      |      |
|  |  |  - Ops Tracker   |  |  - SLA Alerts    |  |    Reports        |      |      |
|  |  |                  |  |                  |  |  - Export         |      |      |
|  |  +------------------+  +------------------+  +-------------------+      |      |
|  |                                                                         |      |
|  +-------------------------------------------------------------------------+      |
|                                                                                   |
|  API LAYER (Next.js Route Handlers)                                               |
|  +-------------------------------------------------------------------------+      |
|  |                                                                         |      |
|  |  /api/collections/*    /api/requests/*     /api/approvals/*             |      |
|  |  /api/datasets/*       /api/users/*        /api/audit/*                 |      |
|  |  /api/notifications/*  /api/admin/*        /api/health/*                |      |
|  |  /api/search/*         /api/analytics/*    /api/webhooks/*              |      |
|  |                                                                         |      |
|  +-------------------------------------------------------------------------+      |
|                                                                                   |
|  SERVICE LAYER (Server-side Business Logic)                                       |
|  +-------------------------------------------------------------------------+      |
|  |                                                                         |      |
|  |  +---------------------+  +---------------------+  +----------------+  |      |
|  |  | CollectionService    |  | RequestService       |  | ApprovalService| |      |
|  |  | - CRUD operations   |  | - Submit request     |  | - Route to     | |      |
|  |  | - Version mgmt      |  | - Intent matching    |  |   approvers    | |      |
|  |  | - D-code resolution |  | - Duplicate check    |  | - Cross-TA     | |      |
|  |  | - Metadata mapping  |  | - SLA tracking       |  |   coordination | |      |
|  |  +---------------------+  +---------------------+  | - Sign capture | |      |
|  |                                                     +----------------+ |      |
|  |  +---------------------+  +---------------------+  +----------------+  |      |
|  |  | AuditService         |  | NotificationService  |  | ExternalSync  | |      |
|  |  | - Event logging     |  | - In-app + email     |  | - AZCT sync   | |      |
|  |  | - Version diffing   |  | - SLA monitoring     |  | - Collibra    | |      |
|  |  | - Report generation |  | - Digest batching    |  | - Cornerstone | |      |
|  |  | - Compliance export |  | - Preference mgmt   |  | - Immuta      | |      |
|  |  +---------------------+  +---------------------+  +----------------+ |      |
|  |                                                                         |      |
|  +-------------------------------------------------------------------------+      |
|                                                                                   |
|  INTEGRATION LAYER (External API Clients)                                         |
|  +-------------------------------------------------------------------------+      |
|  |                                                                         |      |
|  |  AZCTClient  CollibraClient  CornerstoneClient  ImmutaClient            |      |
|  |  StarburstClient  ProvisioningClient                                    |      |
|  |                                                                         |      |
|  +-------------------------------------------------------------------------+      |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### Module Responsibilities

| Module | Focus (% of effort) | Primary Actors | Key JIRA Stories |
|--------|---------------------|---------------|-----------------|
| **DCM Module** | 60-70% | Collection Manager | VS2-329, VS2-330, VS2-332-336, VS2-340, VS2-345-346 |
| **Discovery Module** | 20-25% | Data Consumer | VS2-341, VS2-342, VS2-343, VS2-347 |
| **Request/Approval Module** | 10-15% | All actors | VS2-331, VS2-337-339, VS2-349 |
| **Admin Module** | ~5% | System Admin, DPO | VS2-336, VS2-338, VS2-344 |
| **Notification Module** | Cross-cutting | All actors | VS2-348 |
| **Audit Module** | Cross-cutting | All actors, Compliance | VS2-335, VS2-350 |

### Directory Structure (Proposed)

```
app/
  collectoid/
    (dcm)/                         # DCM Module routes
      create/                      # 11-step collection creation wizard
      collections/                 # Collections browser
      progress/                    # Progress dashboard
      analytics/                   # Demand analytics
      propositions/                # AI-suggested propositions
    (discover)/                    # Discovery Module routes
      browse/                      # Browse collections
      search/                      # Full-text + faceted search
      ai/                          # AI-assisted discovery
    (requests)/                    # Request/Approval Module routes
      new/                         # Access request wizard
      [id]/                        # Request detail
      my-requests/                 # User's request dashboard
      approvals/                   # Approver queue
    (admin)/                       # Admin Module routes
      users/                       # User management
      config/                      # System configuration
      ops-tracker/                 # DPO operations tracker
    notifications/                 # Notification center
    audit/                         # Audit trail viewer
  api/
    auth/                          # Auth.js route handler
    collections/                   # Collection CRUD
    requests/                      # Request endpoints
    approvals/                     # Approval workflow
    datasets/                      # Dataset/d-code resolution
    notifications/                 # Notification preferences
    audit/                         # Audit log queries
    search/                        # Search index
    analytics/                     # Analytics aggregations
    webhooks/                      # Incoming webhooks (Collibra, etc.)
    health/                        # Health check endpoints
    admin/                         # Admin operations
lib/
  services/                        # Business logic layer
  clients/                         # External API client wrappers
  db/                              # Database access layer (Drizzle ORM or Prisma)
  cache/                           # Redis cache utilities
  queue/                           # SQS/SNS message utilities
  auth/                            # Auth configuration and helpers
  validation/                      # Zod schemas for request validation
```

---

## 5. Deployment Architecture

### AWS Topology

```
                        +-----------------------+
                        |       Route 53        |
                        |  collectoid.az.com    |
                        +----------+------------+
                                   |
                        +----------v------------+
                        |      CloudFront       |
                        |  (Edge Locations)      |
                        |  - Static assets      |
                        |  - Cache headers      |
                        |  - WAF attached       |
                        +----------+------------+
                                   |
                    +--------------+--------------+
                    |         AWS WAF             |
                    |  - Rate limiting            |
                    |  - IP allowlist (AZ VPN)    |
                    |  - OWASP Core Rule Set     |
                    +--------------+--------------+
                                   |
+----------------------------------+-----------------------------------+
|                              VPC (10.0.0.0/16)                       |
|                                                                      |
|  +----------------------------+  +-----------------------------+     |
|  |    Public Subnets           |  |    Public Subnets           |     |
|  |    AZ-a (10.0.1.0/24)     |  |    AZ-b (10.0.2.0/24)     |     |
|  |                            |  |                             |     |
|  |  +----------------------+  |  |  +----------------------+   |     |
|  |  |       ALB            |  |  |  |       ALB            |   |     |
|  |  |  (Cross-AZ Target   |<-+--+->|  (Cross-AZ Target   |   |     |
|  |  |   Group)             |  |  |  |   Group)             |   |     |
|  |  +----------+-----------+  |  |  +----------+-----------+   |     |
|  +-------------|----------+  +--|-------------|-------------+   |
|                |                               |                     |
|  +-------------v-----------+  +---------------v-----------+         |
|  |    Private Subnets       |  |    Private Subnets       |         |
|  |    AZ-a (10.0.3.0/24)  |  |    AZ-b (10.0.4.0/24)  |         |
|  |                          |  |                          |         |
|  |  +--------------------+  |  |  +--------------------+  |         |
|  |  | ECS Fargate Task   |  |  |  | ECS Fargate Task   |  |         |
|  |  | (Next.js)          |  |  |  | (Next.js)          |  |         |
|  |  | CPU: 1 vCPU        |  |  |  | CPU: 1 vCPU        |  |         |
|  |  | Memory: 2 GB       |  |  |  | Memory: 2 GB       |  |         |
|  |  | Port: 3000         |  |  |  | Port: 3000         |  |         |
|  |  +--------------------+  |  |  +--------------------+  |         |
|  |                          |  |                          |         |
|  +------|------|------------+  +------|------|------------+         |
|         |      |                      |      |                      |
|  +------v------v----------------------v------v-------------------+  |
|  |    Data Subnets (10.0.5.0/24, 10.0.6.0/24)                   |  |
|  |                                                                |  |
|  |  +----------------------+    +------------------------------+  |  |
|  |  |  Aurora PostgreSQL   |    |  ElastiCache Redis           |  |  |
|  |  |  Cluster             |    |  Cluster                     |  |  |
|  |  |                      |    |                              |  |  |
|  |  |  Writer: AZ-a       |    |  Primary: AZ-a              |  |  |
|  |  |  Reader: AZ-b       |    |  Replica: AZ-b              |  |  |
|  |  |  Storage: auto-scale |    |  Node: cache.t3.medium     |  |  |
|  |  +----------------------+    +------------------------------+  |  |
|  |                                                                |  |
|  +----------------------------------------------------------------+  |
|                                                                      |
+----------------------------------------------------------------------+
```

### Environment Strategy

| Environment | Purpose | ECS Tasks | DB Instance | Cache | Cost Profile |
|------------|---------|-----------|-------------|-------|-------------|
| **dev** | Feature development, integration testing | 1 task (0.5 vCPU, 1 GB) | db.t3.medium (single-AZ) | cache.t3.micro (single node) | Low |
| **staging** | UAT, performance testing, pre-prod validation | 2 tasks (1 vCPU, 2 GB) | db.r6g.large (multi-AZ) | cache.t3.small (2 nodes) | Medium |
| **prod** | Production traffic | 2-6 tasks (1 vCPU, 2 GB, auto-scaling) | db.r6g.xlarge (multi-AZ, read replica) | cache.r6g.large (cluster mode) | High |

### Auto-Scaling Configuration (Production)

```
Scaling Target: ECS Service
  Metric: CPU Utilization
  Target Value: 60%
  Scale Out Cooldown: 120s
  Scale In Cooldown: 300s
  Min Capacity: 2
  Max Capacity: 6

Scaling Target: Aurora Read Replicas
  Metric: CPU Utilization
  Target Value: 70%
  Min Capacity: 1
  Max Capacity: 3
```

### Deployment Pipeline

```
Developer Push                 Build                    Deploy
     |                          |                         |
     v                          v                         v
+----------+   +----------+   +----------+   +----------+   +----------+
|  GitHub  |-->|  GitHub   |-->|  Build   |-->|  Deploy  |-->|  Deploy  |
|  Push    |   |  Actions  |   |  Docker  |   |  to DEV  |   |  to STG  |
|  (PR)    |   |  - lint   |   |  Image   |   |  (auto)  |   |  (auto)  |
|          |   |  - test   |   |  Push to |   |          |   |          |
|          |   |  - build  |   |  ECR     |   |          |   |          |
+----------+   +----------+   +----------+   +----------+   +----------+
                                                                  |
                                                     Manual Gate  |
                                                     (Approval)   v
                                                             +----------+
                                                             |  Deploy  |
                                                             |  to PROD |
                                                             |  (blue/  |
                                                             |   green) |
                                                             +----------+
```

**Deployment Strategy:** Blue/green deployment via ECS. New task definition is deployed alongside old tasks. ALB traffic is shifted once new tasks pass health checks. Rollback is instant by reverting the ALB target group.

**[QUESTION]** Does AZ have a standard deployment pipeline template for ECS/Fargate? Need to confirm if CodePipeline or GitHub Actions is the preferred CI/CD tool for production deployments.

---

## 6. Database Recommendation

### Requirements Summary

Based on the Collectoid data model (see `docs/sprint-zero/03-data-model.md` for detailed schema):

| Requirement | Nature | Implication |
|-------------|--------|-------------|
| Collections have complex relationships (collections <-> datasets <-> categories <-> AoT <-> users) | Relational | JOIN-heavy queries, referential integrity |
| Audit trail is append-only, high volume | Time-series / append-only | Write-optimized, immutable rows |
| Discussions/chat are hierarchical (threads, replies, mentions) | Document / tree | Nested structures, flexible depth |
| Metadata from AZCT/Collibra has flexible schema | Semi-structured | Schema evolution without migrations |
| Cross-entity queries: "find all collections that include study D-12345 and are pending approval from TALT" | Relational | Multi-table JOIN, complex WHERE clauses |
| Multi-TA approval coordination requires transactional consistency | ACID | Atomic state transitions |
| Version history requires diffing between snapshots | Temporal | Point-in-time snapshots, comparison queries |

### Options Compared

#### Option A: Amazon DocumentDB (MongoDB-compatible)

| Aspect | Assessment |
|--------|-----------|
| **Schema flexibility** | Excellent -- native JSON documents, no migrations for metadata shape changes |
| **Cross-entity queries** | Poor -- $lookup (JOIN equivalent) is expensive and limited to left-outer-join; no multi-collection transactions before v5.0 |
| **Referential integrity** | None -- application must enforce consistency; orphaned references are a real risk with 6+ entity types |
| **Audit trail** | Good -- append-only inserts are fast; but querying across audit + collections requires denormalization |
| **ACID transactions** | Limited -- single-document atomic by default; multi-document transactions supported but with performance cost |
| **Query complexity** | Aggregation pipeline for complex queries is verbose and hard to optimize compared to SQL |
| **AZ ecosystem fit** | Unknown -- need to confirm DocumentDB is in AZ's approved services list |
| **Operational cost** | ~$0.10/hr for db.r6g.large (similar to Aurora) |

**Verdict:** Schema flexibility is strong, but the relational nature of collections/datasets/approvals makes DocumentDB a poor fit for the core domain. The 20/30/40/10 access provisioning model requires complex cross-entity queries that would be expensive and fragile in a document model.

#### Option B: Aurora PostgreSQL with JSONB (Recommended)

| Aspect | Assessment |
|--------|-----------|
| **Schema flexibility** | Very good -- JSONB columns for metadata, external API responses, and flexible fields; GIN indexes for fast JSON queries |
| **Cross-entity queries** | Excellent -- native SQL JOINs across collections, datasets, approvals, audit |
| **Referential integrity** | Excellent -- foreign keys, cascading deletes, constraints |
| **Audit trail** | Good -- append-only table with partitioning by month; efficient range queries on timestamp |
| **ACID transactions** | Excellent -- full ACID for multi-entity approval workflows |
| **Query complexity** | Excellent -- SQL is well-understood; Drizzle ORM or Prisma for type-safe queries |
| **AZ ecosystem fit** | High -- Aurora PostgreSQL is commonly used at AZ |
| **Operational cost** | ~$0.10/hr for db.r6g.large; Aurora auto-scaling for read replicas |

**Hybrid approach:** Use relational tables for the core domain (collections, datasets, approvals, users, teams) and JSONB columns for:
- External metadata snapshots (AZCT study details, Collibra taxonomy)
- Collection version snapshots (full collection state at point in time)
- Flexible form fields that evolve across releases
- Discussion thread content

```sql
-- Example: Collection with JSONB for flexible metadata
CREATE TABLE collections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    status          VARCHAR(50) NOT NULL,
    version         INTEGER NOT NULL DEFAULT 1,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Relational fields for core queries
    therapeutic_area VARCHAR(100),
    collection_type VARCHAR(50),

    -- JSONB for flexible/evolving fields
    intent          JSONB,          -- AI-extracted keywords, free-text intent
    metadata        JSONB,          -- External metadata snapshot from AZCT
    criteria        JSONB,          -- Filter criteria that produced this collection
    environments    JSONB,          -- Selected consumption environments

    CONSTRAINT valid_status CHECK (status IN (
        'draft', 'pending_approval', 'approved', 'provisioning',
        'completed', 'rejected', 'archived'
    ))
);

-- GIN index for fast JSONB queries
CREATE INDEX idx_collections_metadata ON collections USING GIN (metadata);
CREATE INDEX idx_collections_criteria ON collections USING GIN (criteria);
```

#### Option C: Amazon DynamoDB

| Aspect | Assessment |
|--------|-----------|
| **Schema flexibility** | Excellent -- schemaless by design |
| **Cross-entity queries** | Very poor -- single-table design required; GSIs limited to 20; no JOINs |
| **Referential integrity** | None -- all relationships managed in application code |
| **Audit trail** | Excellent -- write-optimized, infinite scale, TTL for old records |
| **ACID transactions** | Limited -- TransactWriteItems limited to 100 items, 4MB total |
| **Query complexity** | Poor -- requires careful access pattern design upfront; refactoring access patterns is costly |
| **AZ ecosystem fit** | Good -- commonly used at AZ for event-driven workloads |
| **Operational cost** | Pay-per-request pricing is attractive for low/variable traffic |

**Verdict:** DynamoDB excels at specific access patterns but is a poor fit for the ad-hoc, cross-entity queries that Collectoid requires. The collection creation wizard alone needs to query across collections, datasets, categories, studies, users, and approvals in combinations that would require extensive denormalization and multiple GSIs. Better suited as a secondary store for audit events if needed.

### Recommendation: Aurora PostgreSQL with JSONB

```
+-----------------------------------------------------------------------+
|                                                                       |
|    +---------------------+          +---------------------+           |
|    |  Relational Core     |          |  JSONB Flexible     |           |
|    |                     |          |                     |           |
|    |  - collections      |          |  - collection.      |           |
|    |  - datasets         |          |    metadata (JSONB) |           |
|    |  - collection_      |          |  - collection.      |           |
|    |    datasets (M2M)   |          |    criteria (JSONB)  |           |
|    |  - approvals        |          |  - audit_events.    |           |
|    |  - approval_        |          |    payload (JSONB)  |           |
|    |    signatures       |          |  - version_         |           |
|    |  - users            |          |    snapshots.       |           |
|    |  - teams            |          |    snapshot (JSONB)  |           |
|    |  - team_members     |          |  - discussions.     |           |
|    |  - categories       |          |    content (JSONB)  |           |
|    |  - audit_events     |          |                     |           |
|    |  - notifications    |          |                     |           |
|    |  - discussions      |          |                     |           |
|    |  - version_         |          |                     |           |
|    |    snapshots        |          |                     |           |
|    |                     |          |                     |           |
|    +---------------------+          +---------------------+           |
|                                                                       |
|    ORM: Drizzle ORM (type-safe, lightweight, excellent PostgreSQL     |
|         support including JSONB operators)                             |
|                                                                       |
+-----------------------------------------------------------------------+
```

**Why not pure NoSQL given the stated preference?** The ROAM process has inherent relational requirements:

1. **Multi-TA approval is transactional** -- when TA Lead A approves, the system must atomically check if all other TA Leads have also approved, then trigger provisioning. This requires ACID across the `approvals` and `collections` tables.
2. **D-code resolution requires JOINs** -- resolving "all studies matching criteria X in collection Y that are approved for environment Z" is a 4-table JOIN that would require extreme denormalization in a document model.
3. **Audit queries span entities** -- "show me all approval decisions for collections touching study D-12345 in the last 90 days" needs JOINs across `audit_events`, `approvals`, `collection_datasets`, and `datasets`.
4. **JSONB gives you the best of both worlds** -- flexible schema where you need it, relational integrity where you need it.

**[QUESTION]** Is Aurora PostgreSQL in the AZ approved services list? If not, what is the approved relational database alternative? Confirm with the Cloud Engineering team.

---

## 7. API Architecture

### Route Handler Pattern

All API routes follow a consistent pattern using Next.js Route Handlers:

```
app/api/
  collections/
    route.ts                    # GET (list), POST (create)
    [id]/
      route.ts                  # GET (detail), PATCH (update), DELETE
      datasets/
        route.ts                # GET (list datasets in collection)
      versions/
        route.ts                # GET (version history)
        [version]/
          route.ts              # GET (specific version snapshot)
      approvals/
        route.ts                # GET (approval status), POST (submit for approval)
  requests/
    route.ts                    # GET (list), POST (create)
    [id]/
      route.ts                  # GET, PATCH
  approvals/
    route.ts                    # GET (my approval queue)
    [id]/
      route.ts                  # GET (detail)
      decision/
        route.ts                # POST (approve/reject with signature)
  audit/
    route.ts                    # GET (query audit log)
    export/
      route.ts                  # POST (generate compliance report)
  datasets/
    search/
      route.ts                  # GET (full-text search across AZCT)
    [dcode]/
      route.ts                  # GET (resolve d-code to study details)
  health/
    route.ts                    # GET (application + dependency health)
  webhooks/
    collibra/
      route.ts                  # POST (Collibra update notification)
```

### Middleware Chain

Every API request passes through a middleware chain before reaching the route handler:

```
Request
  |
  v
+------------------+
| 1. Rate Limiter  |  Redis-backed; 100 req/min per user for writes, 1000/min for reads
+--------+---------+
         |
+--------v---------+
| 2. Auth Verify   |  Validate Auth.js session token; extract user + roles
+--------+---------+
         |
+--------v---------+
| 3. RBAC Check    |  Verify user has required role/permission for this endpoint
+--------+---------+
         |
+--------v---------+
| 4. Input Valid.  |  Zod schema validation on request body/query params
+--------+---------+
         |
+--------v---------+
| 5. Request Log   |  Log request metadata to audit trail (who, what, when)
+--------+---------+
         |
+--------v---------+
| 6. Route Handler |  Business logic execution
+--------+---------+
         |
+--------v---------+
| 7. Response      |  Consistent envelope: { data, meta, errors }
+------------------+
```

### Request Validation (Zod Schemas)

```typescript
// lib/validation/collections.ts
import { z } from 'zod';

export const CreateCollectionSchema = z.object({
  name: z.string().min(3).max(255),
  intent: z.string().min(10).max(5000),
  therapeuticArea: z.string(),
  collectionType: z.enum(['open', 'closed', 'ongoing']),
  criteria: z.object({
    studyPhases: z.array(z.string()).optional(),
    indications: z.array(z.string()).optional(),
    dataModalities: z.array(z.string()).min(1),
    dataSources: z.array(z.string()).min(1),
  }),
  environments: z.array(z.string()).min(1),
  dataConsumerLeadId: z.string().uuid(),
  dataOwnerId: z.string().uuid(),
});

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});
```

### Response Envelope

All API responses use a consistent structure:

```typescript
// Success response
{
  "data": { ... },                    // Single entity or array
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "totalPages": 8,
    "requestId": "req_abc123",
    "timestamp": "2026-02-06T10:30:00Z"
  }
}

// Error response
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request body validation failed",
    "details": [
      {
        "field": "name",
        "message": "String must contain at least 3 character(s)"
      }
    ],
    "requestId": "req_abc123",
    "timestamp": "2026-02-06T10:30:00Z"
  }
}
```

### Error Handling Strategy

| Error Type | HTTP Status | Error Code | Handling |
|-----------|-------------|------------|---------|
| Validation failure | 400 | `VALIDATION_ERROR` | Return Zod error details |
| Unauthenticated | 401 | `UNAUTHORIZED` | Redirect to login |
| Insufficient permissions | 403 | `FORBIDDEN` | Log attempt, return generic message |
| Resource not found | 404 | `NOT_FOUND` | Return entity type + ID |
| Conflict (duplicate, stale version) | 409 | `CONFLICT` | Return current version |
| Rate limited | 429 | `RATE_LIMITED` | Return retry-after header |
| External service failure | 502 | `UPSTREAM_ERROR` | Circuit breaker; return cached data if available |
| Internal error | 500 | `INTERNAL_ERROR` | Log full stack trace; return sanitized message |

### Pagination Pattern

Cursor-based pagination for large datasets (audit log, notifications), offset-based for browseable lists (collections, requests):

```typescript
// Offset-based (collections, requests)
GET /api/collections?page=2&limit=20&sort=createdAt&order=desc

// Cursor-based (audit events, notifications)
GET /api/audit?cursor=eyJ0cyI6IjIwMjYtMDEtMTUifQ&limit=50
```

---

## 8. Caching Strategy

### Cache Layer Architecture

```
+-------------------+     +-------------------+     +-------------------+
|                   |     |                   |     |                   |
|  Browser Cache    |     |  ElastiCache      |     |  Aurora           |
|  (Cache-Control)  |     |  (Redis 7)        |     |  PostgreSQL       |
|                   |     |                   |     |                   |
|  Static assets:   |     |  Session store    |     |  Source of truth  |
|  1 year           |     |  AZCT metadata    |     |  for all entities |
|                   |     |  Collibra taxonomy|     |                   |
|  API responses:   |     |  User profiles    |     |                   |
|  stale-while-     |     |  Rate limit       |     |                   |
|  revalidate       |     |  counters         |     |                   |
|                   |     |  Collection        |     |                   |
|                   |     |  summaries         |     |                   |
+-------------------+     +-------------------+     +-------------------+
```

### What to Cache

| Data | Cache Location | TTL | Invalidation Strategy | Rationale |
|------|---------------|-----|----------------------|-----------|
| **AZCT study metadata** | Redis | 1 hour | Event-driven (webhook from AZCT if available) or scheduled refresh | Study metadata changes infrequently; AZCT API has rate limits |
| **Collibra taxonomy** | Redis | 6 hours | Scheduled refresh overnight | Taxonomy is stable; changes are batched |
| **User session** | Redis | 24 hours (sliding) | Explicit logout or token expiry | Fast session lookup; shared across ECS tasks |
| **User profile + roles** | Redis | 15 minutes | Invalidate on role change | Role changes are infrequent but must propagate quickly |
| **Collection list summaries** | Redis | 5 minutes | Invalidate on collection write | Dashboard loads are frequent; eventual consistency acceptable |
| **D-code resolution cache** | Redis | 4 hours | LRU eviction | D-codes are immutable identifiers; resolution is expensive |
| **Rate limit counters** | Redis | Per-window (1 min, 15 min) | Auto-expire | Must be centralized across ECS tasks |
| **Cornerstone training status** | Redis | 30 minutes | Invalidate on request creation | Training status changes infrequently; API is slow |
| **Static assets (JS, CSS, images)** | CloudFront + Browser | 1 year | Filename hash invalidation (built into Next.js) | Immutable after build |

### Cache Key Convention

```
collectoid:{env}:{entity}:{id}:{qualifier}

Examples:
  collectoid:prod:session:user_abc123
  collectoid:prod:azct:study:D-12345
  collectoid:prod:collection:list:page1:limit20
  collectoid:prod:taxonomy:collibra:latest
  collectoid:prod:ratelimit:user_abc123:api_write
```

### Cache Invalidation Patterns

1. **Write-through** -- For collection updates: write to DB, then update Redis cache in the same request
2. **Event-driven** -- For approval status changes: publish event to SNS, subscriber invalidates relevant caches
3. **TTL-based** -- For external data (AZCT, Collibra): rely on TTL expiry with stale-while-revalidate
4. **Scheduled** -- For taxonomy refresh: cron job (ECS scheduled task) refreshes Collibra taxonomy every 6 hours

**[QUESTION]** Does AZCT support webhooks or change notifications? If yes, we can switch from TTL-based to event-driven cache invalidation for study metadata.

---

## 9. Event-Driven Patterns

### Event Architecture

```
Producers                    Transport              Consumers
+-----------+                                       +-----------+
| Collection|   collection.created    +--------+    | Audit     |
| Service   |------------------------>| SNS    |--->| Service   |
|           |   collection.updated    | Topic: |    | (writes   |
|           |   collection.published  | events |    |  to audit |
+-----------+                         +---+----+    |  table)   |
                                          |         +-----------+
+-----------+                             |         +-----------+
| Approval  |   approval.submitted        +-------->| Notif.    |
| Service   |   approval.approved                   | Service   |
|           |   approval.rejected                   | (in-app + |
+-----------+                                       |  email)   |
                                                    +-----------+
+-----------+                         +--------+    +-----------+
| Request   |   request.created       | SQS    |    | External  |
| Service   |------------------------>| Queue: |--->| Sync      |
|           |   request.matched       |provision|   | Service   |
+-----------+                         +--------+    | (Immuta,  |
                                                    |  Starburst|
                                                    |  etc.)    |
                                                    +-----------+
```

### Event Schema

```typescript
interface CollectoidEvent {
  eventId: string;               // UUID
  eventType: string;             // e.g., "collection.created"
  timestamp: string;             // ISO 8601
  version: "1.0";
  source: "collectoid";
  actor: {
    userId: string;
    role: string;
    name: string;
  };
  entity: {
    type: string;                // "collection", "request", "approval"
    id: string;
    version?: number;
  };
  payload: Record<string, unknown>;  // Event-specific data
  metadata: {
    correlationId: string;       // For tracing across services
    environment: string;
    requestId?: string;
  };
}
```

### Queue Definitions

| Queue/Topic | Type | Purpose | DLQ Retention | Consumer |
|-------------|------|---------|---------------|----------|
| `collectoid-events` | SNS Topic | Fan-out for all domain events | N/A (topic) | Multiple subscribers |
| `approval-notifications` | SQS Queue (subscribed to SNS) | Process approval email notifications | 14 days | NotificationService |
| `audit-events` | SQS Queue (subscribed to SNS) | Persist audit trail entries | 14 days | AuditService |
| `provisioning-tasks` | SQS Queue | Trigger Immuta/Starburst policy creation | 14 days | ExternalSyncService |
| `external-sync` | SQS Queue | Scheduled sync with AZCT/Collibra | 14 days | ExternalSyncService |
| `dlq-*` | SQS DLQ | Dead-letter queues for each processing queue | 14 days | Alert to ops team |

### Key Event Flows

**Approval Completed (All TAs Approved):**

```
1. ApprovalService.recordDecision()
   |
   2. Check: are all TA Leads for this collection approved?
   |  YES --> 3. Update collection.status = "provisioning"
   |          4. Publish "collection.all_approvals_complete" to SNS
   |               |
   |               +---> SQS:audit-events --> AuditService.log()
   |               +---> SQS:approval-notifications --> Send congratulatory email to DCM
   |               +---> SQS:provisioning-tasks --> ImmutaClient.createPolicies()
   |                                                  StarburstClient.configureAccess()
   |
   |  NO -->  3. Publish "approval.decision_recorded" to SNS
              4. NotificationService sends reminder to remaining approvers
```

**Collection Version Changed:**

```
1. CollectionService.update()
   |
   2. Create version_snapshot (full JSONB snapshot)
   3. Increment collection.version
   4. Publish "collection.version_created" to SNS
        |
        +---> SQS:audit-events --> AuditService.log(diff between versions)
        +---> SQS:approval-notifications --> Notify impacted approvers
        +---> If approval was previously complete:
                  Invalidate approvals, require re-signature (VS2-335)
```

---

## 10. Data Flow Diagrams

### Flow 1: Collection Creation (DCM Workflow)

This is the primary workflow, covering the proposed 11-step creation wizard (see `docs/specs/collectoid-v2-gap-analysis.md` for the gap analysis that informed this flow).

```
DCM User                        Collectoid                       External Systems
   |                               |                                    |
   | 1. Select request type        |                                    |
   |   (new/update/policy change)  |                                    |
   |------------------------------>|                                    |
   |                               | 2. If update: load existing       |
   |                               |    collection + version history    |
   |                               |                                    |
   | 3. Enter intent (free text)   |                                    |
   |------------------------------>|                                    |
   |                               | 4. AI keyword extraction          |
   |   <--- AI-suggested keywords --|                                    |
   |                               |                                    |
   | 5. Assign roles               |                                    |
   |   (DCL, DDO, Collection Lead) |                                    |
   |------------------------------>|                                    |
   |                               | 6. Validate users via Azure AD ---|---> Azure AD
   |                               |                                    |
   | 7. Define data criteria       |                                    |
   |   (TA, phase, indications)    |                                    |
   |------------------------------>|                                    |
   |                               | 8. Resolve to d-codes ------------|---> AZCT API
   |                               |    (concrete study list)           |<--- Study list
   |                               |                                    |
   |   <--- D-code list + status --|                                    |
   |                               |                                    |
   | 9. Select modalities          |                                    |
   |   (SDTM, ADaM, DICOM, etc.)  |                                    |
   |------------------------------>|                                    |
   |                               | 10. Validate modality/source compat|
   |                               |                                    |
   | 11. Select data sources       |                                    |
   |   (entimICE, PDP, CTDS, etc.) |                                    |
   |------------------------------>|                                    |
   |                               |                                    |
   | 12. Select environments       |                                    |
   |   (SCP, Domino, AI Bench)     |                                    |
   |------------------------------>|                                    |
   |                               | 13. Apply default boundaries       |
   |                               |                                    |
   | 14. Define activities         |                                    |
   |   + access levels             |                                    |
   |------------------------------>|                                    |
   |                               |                                    |
   | 15. Configure AoT             |                                    |
   |   (ML/AI, publication, scope) |                                    |
   |------------------------------>|                                    |
   |                               | 16. Check training requirements ---|---> Cornerstone
   |                               |                                    |<--- Training status
   |                               |                                    |
   |                               | 17. Run compliance checks          |
   |                               |   (per-study ethical/legal status)  |
   |   <--- Compliance summary ----|                                    |
   |                               |                                    |
   |                               | 18. Duplicate collection check     |
   |   <--- Duplicate warnings ----|                                    |
   |                               |                                    |
   | 19. Review & confirm          |                                    |
   |------------------------------>|                                    |
   |                               | 20. Save collection (status=draft) |
   |                               | 21. Create version_snapshot v1     |
   |                               | 22. Publish "collection.created"   |
   |                               |     to SNS                         |
   |                               | 23. Trigger DPO notification       |
   |   <--- Collection ID ---------|                                    |
   |                               |                                    |
   | 24. Submit for approval       |                                    |
   |------------------------------>|                                    |
   |                               | 25. Identify required TA Lead      |
   |                               |     approvers based on studies      |
   |                               | 26. Create approval_request        |
   |                               |     records                        |
   |                               | 27. Status = pending_approval      |
   |                               | 28. Publish "collection.submitted" |
   |                               |     --> Notify approvers            |
   |   <--- Approval tracking ----|                                    |
```

### Flow 2: Access Request (End-User Workflow)

```
Data Consumer                   Collectoid                       External Systems
   |                               |                                    |
   | 1. Browse/search collections  |                                    |
   |------------------------------>|                                    |
   |                               | 2. Return collections with         |
   |   <--- Collection list -------|    access provisioning breakdown   |
   |                               |    (20/30/40/10 model)             |
   |                               |                                    |
   | 3. Select collection          |                                    |
   |------------------------------>|                                    |
   |                               | 4. Check user's current access     |
   |                               |    (which datasets already open)   |
   |                               |                                    |
   |   <--- Access status ----------|                                    |
   |   (immediate/soon/extended/   |                                    |
   |    conflict breakdown)        |                                    |
   |                               |                                    |
   | 5. Declare intent             |                                    |
   |   (primary use, AI/ML, pub)   |                                    |
   |------------------------------>|                                    |
   |                               | 6. Smart matching: compare         |
   |                               |    intent vs dataset AoTs          |
   |                               |                                    |
   |   <--- Match results ----------|                                    |
   |   (which datasets conflict,   |                                    |
   |    estimated timelines)       |                                    |
   |                               |                                    |
   | 7. Acknowledge conflicts      |                                    |
   |   (or adjust intent)          |                                    |
   |------------------------------>|                                    |
   |                               |                                    |
   | 8. Review & submit            |                                    |
   |------------------------------>|                                    |
   |                               | 9. Create request record           |
   |                               | 10. Check training status ---------|---> Cornerstone
   |                               |                                    |<--- Status
   |                               | 11. Route request:                 |
   |                               |     - If "immediate": auto-grant   |
   |                               |     - If "soon": queue for DPO     |
   |                               |     - If "extended": route to GPT  |
   |                               |     - If "conflict": route to TALT |
   |                               | 12. Publish "request.created"      |
   |   <--- Request confirmation --|                                    |
```

### Flow 3: Multi-TA Approval Chain

```
Approver                        Collectoid                       DCM User
(TA Lead)                          |                                |
   |                               |                                |
   |   <--- Approval notification --|                                |
   |   (email + in-app)            |                                |
   |                               |                                |
   | 1. View collection details    |                                |
   |------------------------------>|                                |
   |                               | 2. Return collection + studies  |
   |   <--- Collection detail -----|    filtered to this TA          |
   |                               |                                |
   | 3. Review compliance status   |                                |
   |------------------------------>|                                |
   |                               | 4. Return per-study             |
   |   <--- Compliance detail -----|    ethical/legal status          |
   |                               |                                |
   | 5. Submit decision            |                                |
   |   (approve/reject + notes)    |                                |
   |------------------------------>|                                |
   |                               | 6. Record decision atomically:  |
   |                               |    BEGIN TRANSACTION             |
   |                               |    - Insert approval_signature   |
   |                               |    - Update approval_request     |
   |                               |    - Log audit_event             |
   |                               |    COMMIT                        |
   |                               |                                |
   |                               | 7. Check: all TAs approved?     |
   |                               |                                |
   |                               |    YES:                         |
   |                               |    - collection.status =         |
   |                               |      "provisioning"              |
   |                               |    - Trigger Immuta policy ------|---> Immuta
   |                               |    - Trigger Starburst config ---|---> Starburst
   |                               |    - Notify DCM ----------------->  "All approved"
   |                               |                                |
   |                               |    NO (and no rejections):       |
   |                               |    - Notify next TA Lead         |
   |                               |    - Update progress indicator   |
   |                               |                                |
   |                               |    REJECTED (any single TA):     |
   |                               |    - collection.status =         |
   |                               |      "rejected"                  |
   |                               |    - Block entire collection     |
   |                               |      (all-or-nothing rule)       |
   |                               |    - Notify DCM + all other TA --|---> "Rejected by [TA]"
   |                               |      Leads                       |
```

---

## 11. Cross-Cutting Concerns

### Logging

| Concern | Approach | Tool |
|---------|----------|------|
| Application logs | Structured JSON logs via `pino` (or `winston`) | CloudWatch Logs |
| Access logs | ALB access logs | S3 + Athena |
| API request/response | Middleware logs (sanitized -- no PII in logs) | CloudWatch Logs |
| Audit trail | Dedicated `audit_events` table with full event payload | Aurora PostgreSQL |

**Log Format:**

```json
{
  "level": "info",
  "timestamp": "2026-02-06T10:30:00.123Z",
  "requestId": "req_abc123",
  "correlationId": "cor_xyz789",
  "userId": "user_456",
  "method": "POST",
  "path": "/api/collections",
  "statusCode": 201,
  "durationMs": 234,
  "message": "Collection created successfully"
}
```

### Monitoring & Alerting

| Metric | Source | Alert Threshold | Channel |
|--------|--------|----------------|---------|
| API response time (p95) | CloudWatch (ALB) | > 2000ms for 5 min | PagerDuty / Slack |
| API error rate (5xx) | CloudWatch (ALB) | > 1% for 5 min | PagerDuty / Slack |
| ECS task health | ECS health checks | Any task unhealthy | Auto-restart + alert |
| Database connections | Aurora CloudWatch | > 80% pool utilization | Slack |
| Cache hit rate | ElastiCache CloudWatch | < 70% hit rate | Slack |
| SQS DLQ depth | SQS CloudWatch | > 0 messages | PagerDuty |
| External API failures | Application metrics | > 5 failures in 5 min per service | Slack |
| Disk / Memory | ECS CloudWatch | > 85% utilization | Auto-scale + alert |

### Health Check Endpoints

```
GET /api/health
Response:
{
  "status": "healthy" | "degraded" | "unhealthy",
  "timestamp": "2026-02-06T10:30:00Z",
  "version": "1.2.3",
  "uptime": "2d 14h 32m",
  "checks": {
    "database": { "status": "healthy", "latencyMs": 12 },
    "cache": { "status": "healthy", "latencyMs": 2 },
    "azct": { "status": "healthy", "latencyMs": 145 },
    "collibra": { "status": "degraded", "message": "Elevated latency" },
    "immuta": { "status": "healthy", "latencyMs": 89 },
    "cornerstone": { "status": "healthy", "latencyMs": 203 }
  }
}
```

**Health check rules:**
- ALB health check hits `GET /api/health` every 30 seconds
- If database is unhealthy, overall status is `unhealthy` (ECS will restart task)
- If any external service is unhealthy, overall status is `degraded` (task stays running; circuit breaker active)

### Error Tracking

| Concern | Tool | Configuration |
|---------|------|---------------|
| Unhandled exceptions | Sentry (or AWS X-Ray) | All environments; source maps uploaded at build time |
| Performance traces | AWS X-Ray | Sampling: 5% in prod, 100% in dev/staging |
| Client-side errors | Sentry Browser SDK | React error boundaries report to Sentry |

### Security

| Concern | Implementation |
|---------|---------------|
| Authentication | Azure AD / Entra ID via Auth.js; OIDC tokens validated server-side |
| Authorization | RBAC middleware; roles from Azure AD group claims (see `docs/sprint-zero/05-auth-rbac.md`) |
| Input validation | Zod schemas on every API endpoint; reject unexpected fields |
| CSRF | SameSite cookie + Auth.js CSRF token |
| XSS | React's built-in escaping; Content-Security-Policy headers via CloudFront |
| SQL injection | Parameterized queries via Drizzle ORM; no raw SQL |
| Secrets | AWS Secrets Manager; injected as ECS task environment variables |
| Data in transit | TLS 1.3 everywhere (ALB, Aurora, ElastiCache, external APIs) |
| Data at rest | AES-256 encryption (Aurora default, ElastiCache at-rest encryption) |
| Dependency scanning | GitHub Dependabot + `npm audit` in CI pipeline |

**[QUESTION]** Does AZ have a standard for error tracking tooling? Is Sentry approved, or should we use an AZ-internal alternative?

---

## 12. Open Questions

The following items require stakeholder input before finalizing the architecture. Each is tagged for the responsible team.

### Infrastructure & Platform

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| **[QUESTION-001]** | Is Aurora PostgreSQL in the AZ approved AWS services list? If not, what is the approved relational database? | Database selection | Cloud Engineering |
| **[QUESTION-002]** | Does AZ have a standard ECS/Fargate deployment template (Terraform modules, CI/CD pipeline)? | Deployment pipeline design | Cloud Engineering |
| **[QUESTION-003]** | What is the VPC peering / PrivateLink setup for reaching AZCT, Collibra, Immuta, and Starburst from AWS? | Network architecture | Cloud Engineering |
| **[QUESTION-004]** | Is there a WAF rule set or IP allowlist policy for internal-only applications? | Security configuration | InfoSec |
| **[QUESTION-005]** | What is the approved secret management approach? AWS Secrets Manager, HashiCorp Vault, or other? | Secrets management | Cloud Engineering |

### External Integrations

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| **[QUESTION-006]** | Does AZCT REST API support webhooks or change notifications? | Cache invalidation strategy (Section 8) | AZCT Team |
| **[QUESTION-007]** | What is the Collibra 2.0 readiness timeline? Do we need a Collibra-absent fallback for launch? | Metadata taxonomy source | Collibra Team / WP3 |
| **[QUESTION-008]** | What is the Immuta API contract for policy creation? Is there a sandbox environment? | Provisioning integration | Immuta Team |
| **[QUESTION-009]** | What is the Cornerstone API authentication mechanism and rate limits? | Training status checks | Cornerstone Admin |
| **[QUESTION-010]** | ~~Is Adobe Sign integration required for MVP, or can we launch with built-in approval only?~~ **RESOLVED:** Adobe Sign is not needed. All approvals will be handled in-app with built-in approval state, workflow, and notification functionality. | Scope of approval module | Product Owner |
| **[QUESTION-011]** | What provisioning APIs exist for PDP, Domino, SCP, and AI Bench? Are they uniform or environment-specific? | Provisioning automation | DPO Team |

### Authentication & Authorization

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| **[QUESTION-012]** | Which Azure AD groups map to Collectoid roles (DCM, DDO, Team Lead, Consumer)? | RBAC implementation | Identity Team |
| **[QUESTION-013]** | Are there existing service principals / managed identities for server-to-server API calls (Collectoid --> AZCT)? | API authentication | Identity Team |
| **[QUESTION-014]** | Is MFA required for approval actions (signing AoTs), or is Azure AD session sufficient? | Approval workflow UX | InfoSec |

### Data & Compliance

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| **[QUESTION-015]** | What is the audit log retention requirement (1 year? 7 years? indefinite)? | Database sizing and partitioning strategy | Compliance |
| **[QUESTION-016]** | Are there data residency requirements (EU-only, specific AWS region)? | Region selection | Legal / DPO |
| **[QUESTION-017]** | What data classifications apply to Collectoid's database? (It stores metadata about studies, not actual patient data.) | Encryption and access control requirements | InfoSec |
| **[QUESTION-018]** | Is there a GxP or regulated system classification for Collectoid? | Validation requirements | Quality |

### Product & Scope

| ID | Question | Impact | Owner |
|----|----------|--------|-------|
| **[QUESTION-019]** | What is the expected concurrent user count at launch? (Affects ECS scaling and Aurora sizing.) | Infrastructure sizing | Product Owner |
| **[QUESTION-020]** | Is the email notification system in scope for MVP, or is in-app notification sufficient? | Notification module scope | Product Owner |
| **[QUESTION-021]** | What is the target launch date? This affects whether we can wait for Collibra 2.0. | Integration prioritization | Program Manager |
| **[QUESTION-022]** | Should the POC's variation/A-B testing system (`_variations/` pattern) carry forward to production, or was that POC-only? | Code architecture | Product Owner |

---

## Appendix A: Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend framework | Next.js (App Router) | Latest (15.x+) | SSR, routing, API routes |
| UI runtime | React | 19.x | Component rendering |
| Language | TypeScript | 5.x | Type safety |
| Styling | Tailwind CSS | 4.x | Utility-first CSS |
| UI components | Radix UI + shadcn/ui | Latest | Accessible component primitives |
| Animation | Framer Motion | 12.x | Micro-interactions |
| Charts | Recharts | 3.x | Analytics visualizations |
| ORM | Drizzle ORM (recommended) | Latest | Type-safe database queries |
| Validation | Zod | 3.x | Runtime schema validation |
| Auth | Auth.js (NextAuth.js) | 5.x | Azure AD OIDC |
| Logging | Pino | 9.x | Structured JSON logging |
| Database | Aurora PostgreSQL | 15.x | Primary data store |
| Cache | ElastiCache Redis | 7.x | Session, metadata, rate limiting |
| Message queue | AWS SQS + SNS | Managed | Async event processing |
| Container runtime | AWS ECS Fargate | Managed | Serverless containers |
| CDN | AWS CloudFront | Managed | Static asset delivery |
| Load balancer | AWS ALB | Managed | HTTPS termination, routing |
| IaC | Terraform | 1.x | Infrastructure provisioning |
| CI/CD | GitHub Actions + AWS CodePipeline | Managed | Build, test, deploy |
| Monitoring | AWS CloudWatch + X-Ray | Managed | Metrics, logs, traces |
| Error tracking | Sentry (pending approval) | Latest | Exception tracking |

## Appendix B: POC to Production Migration Notes

The existing POC (`/Users/kwnt592/code/delete-me`) provides validated UX patterns but requires significant rework for production:

| POC Artifact | Production Status | Action |
|-------------|-------------------|--------|
| `app/collectoid/` route structure | Reusable with restructuring | Restructure into route groups: `(dcm)`, `(discover)`, `(requests)` |
| `components/ui/` (shadcn/ui components) | Directly reusable | Copy as-is; these are standard Radix/shadcn components |
| `lib/dcm-mock-data.ts` (mock data + interfaces) | Interfaces reusable; mock data discarded | Extract TypeScript interfaces into `lib/types/`; replace mock data with API calls |
| `app/api/auth/route.ts` (simple password auth) | Discard entirely | Replace with Auth.js Azure AD provider |
| `app/collectoid/_components/variation-*` | Evaluate for production | [QUESTION-022]: Decide if variation system carries forward |
| `lib/feature-flags.ts` | Replace with proper system | Use LaunchDarkly, Unleash, or AWS AppConfig for production feature flags |
| `_variations/` pattern | POC-specific | Was used for A/B UX testing during POC; likely not needed in production |
| `app/ux/` directory | Discard | Early UX explorations (iterations 1-8); all learnings incorporated into `collectoid/` |

---

*This document is a living artifact. It will be updated as open questions are resolved and architectural decisions are finalized during Sprint Zero. All changes should be tracked via pull request with review from the engineering lead.*

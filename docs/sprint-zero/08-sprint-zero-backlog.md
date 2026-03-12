# 08 - Sprint Zero Backlog

**Document:** Collectoid Production Sprint Zero Backlog
**Document ID:** SPRINT-ZERO-08
**Version:** 1.0
**Date:** 2026-02-06
**Status:** Draft -- Pending Team Review
**Author:** Engineering Team
**Program:** DOVS2 (Data Office Value Stream 2), WP4 -- UI & Agentic AI
**Sprint Zero Duration:** 6 weeks (estimated)

---

## Related Documents

| Document | Path | Relevance |
|----------|------|-----------|
| Architecture Overview | `docs/sprint-zero/01-architecture-overview.md` | VPC topology, ECS/Fargate deployment, caching, event-driven patterns |
| Business Requirements | `docs/sprint-zero/02-business-requirements.md` | Functional and non-functional requirements, MVP scope, phase roadmap |
| Data Model | `docs/sprint-zero/03-data-model.md` | Entity schemas, audit trail design, versioning strategy, indexes |
| Integration Map | `docs/sprint-zero/04-integration-map.md` | External API specifications, sync patterns, circuit breakers |
| Security & Compliance | `docs/sprint-zero/05-security-compliance.md` | Auth architecture, RBAC model, encryption, audit immutability |
| Risk Register | `docs/sprint-zero/06-risk-register.md` | 36 identified risks across 6 categories |
| Gap Analysis | `docs/specs/collectoid-v2-gap-analysis.md` | JIRA stories VS2-329 to VS2-350, current-state gaps |

---

## Table of Contents

1. [Sprint Zero Overview](#1-sprint-zero-overview)
2. [Task Categories and Detailed Backlog](#2-task-categories-and-detailed-backlog)
   - 2.1 Infrastructure & DevOps
   - 2.2 Authentication & Authorization
   - 2.3 Database & Data Model
   - 2.4 Project Scaffolding
   - 2.5 External API Integration Setup
   - 2.6 Design System & UI
   - 2.7 Monitoring & Observability
   - 2.8 Testing Foundation
   - 2.9 Documentation & Onboarding
3. [Dependency Graph](#3-dependency-graph)
4. [Suggested Timeline](#4-suggested-timeline)
5. [Risks & Blockers](#5-risks--blockers)
6. [Exit Criteria](#6-exit-criteria)

---

## 1. Sprint Zero Overview

### 1.1 Purpose

Sprint Zero establishes the foundational infrastructure, tooling, access, and conventions required before feature development can begin in Sprint 1. The Collectoid POC (Next.js 15 prototype with mocked data) validated UX patterns and business workflows. Sprint Zero bridges the gap between that prototype and a production-grade application by provisioning real infrastructure, connecting to real APIs, and establishing the engineering practices that will govern the entire 2026 delivery cycle.

Sprint Zero is not about building features. It is about ensuring that when Sprint 1 starts, every developer can clone the repo, run the app locally, authenticate via Azure AD, query a real database, and deploy to a real environment through an automated pipeline.

### 1.2 Goals

| # | Goal | Verification |
|---|------|-------------|
| G1 | Infrastructure provisioned and accessible | Dev and staging environments running on ECS/Fargate; Aurora PostgreSQL and ElastiCache Redis reachable from application |
| G2 | Authentication working end-to-end | A developer can log in via Azure AD, see their role, and be redirected appropriately |
| G3 | Database schema deployed with seed data | All core tables from `03-data-model.md` exist; seed data derived from POC mock data is queryable |
| G4 | CI/CD pipeline running builds and tests | Every PR triggers lint, type-check, unit tests, and build; merge to main deploys to dev automatically |
| G5 | External API access confirmed | At minimum, AZCT REST API and Azure AD Graph API are callable from the application with valid credentials |
| G6 | Project scaffolding complete with coding standards | Production Next.js project with TypeScript strict mode, ESLint, Prettier, tRPC, React Query, Zod -- all configured and enforced |
| G7 | Monitoring and logging operational | Structured logs visible in CloudWatch; health check endpoint returning dependency status; basic alerting configured |
| G8 | Design system migrated from POC | shadcn/ui components, design tokens, and layout patterns from the POC are available in the production codebase |
| G9 | Team onboarded with dev environment docs | Any new team member (including TBC Tech Lead and UX Designer) can set up their environment and contribute within one day |

### 1.3 Timeline

Sprint Zero spans **6 weeks**, reflecting the constrained team capacity (Keith at 0.5 FTE, split with Sherlock) and the number of external dependencies that require coordination with other AZ teams.

| Week | Focus | Key Milestones |
|------|-------|---------------|
| Week 1 | AWS account access, project scaffolding, Azure AD app registration | Project repo initialized; local dev environment running |
| Week 2 | VPC/ECS/Fargate provisioning, Auth.js integration, database provisioning | First deployment to dev environment; login flow working |
| Week 3 | Database schema deployment, seed data, CI/CD pipeline | Schema deployed; CI pipeline running on PRs |
| Week 4 | External API access (AZCT, Cornerstone), tRPC setup, Redis integration | AZCT data retrievable; session management via Redis |
| Week 5 | Monitoring, testing foundation, design system migration | Health checks live; test suite running; components migrated |
| Week 6 | Documentation, onboarding materials, exit criteria verification | Sprint Zero complete; Sprint 1 ready |

### 1.4 Definition of Done (Sprint Zero)

Sprint Zero is complete when ALL of the following are true:

- [ ] A developer can clone the repo, run `npm install`, and start the app locally
- [ ] The app authenticates against Azure AD dev tenant and displays the user's name and role
- [ ] The database contains all tables defined in `03-data-model.md` with seed data
- [ ] A PR triggers automated lint, type-check, unit test, and build checks
- [ ] Merging to main automatically deploys to the dev environment
- [ ] The `/api/health` endpoint returns status for database, cache, and at least one external API
- [ ] Structured logs appear in CloudWatch within 60 seconds of a request
- [ ] At least one external API (AZCT or Azure AD Graph) is callable from the running application
- [ ] The README contains setup instructions that a new developer can follow without assistance
- [ ] All P0 tasks in this backlog are marked Complete

### 1.5 Capacity Assumptions

| Role | Person | FTE Allocation | Sprint Zero Availability |
|------|--------|---------------|------------------------|
| Lead Software Engineer | Keith Hayes | 0.5 (split with Sherlock) | ~12 days over 6 weeks |
| Tech Lead | TBC | Unknown | May not be available for Sprint Zero |
| UX/UI Designer | TBC | Unknown | May not be available for Sprint Zero |
| Product Owner | Divya | 0.4 | Available for decisions and prioritization |
| Business Analyst | Marcin | 0.5 | Available for requirements clarification |
| Project Manager | Cayetana | 0.2 | Available for coordination and escalation |

**Implication:** With ~12 engineering days available, Sprint Zero must be ruthlessly prioritized. P0 tasks are blocking and must be completed. P1 tasks are important but can carry into Sprint 1 if needed. P2 tasks are deferred to Sprint 1 unless capacity allows.

---

## 2. Task Categories and Detailed Backlog

### Effort Estimates

| Size | Days | Description |
|------|------|-------------|
| S | 0.5-1 | A few hours to a full day; straightforward, low ambiguity |
| M | 2-3 | Multiple days; may involve coordination or investigation |
| L | 4-5 | Close to a full sprint week; significant complexity or external dependency |
| XL | 5+ | Multi-week effort; likely needs to be broken down further |

### Priority Levels

| Priority | Meaning |
|----------|---------|
| P0 | **Blocking** -- Sprint 1 cannot begin without this |
| P1 | **Important** -- Should be done in Sprint Zero; can overflow to Sprint 1 start |
| P2 | **Nice to have** -- Deferred to Sprint 1 unless capacity allows |

---

### 2.1 Infrastructure & DevOps

#### SZ-INF-001: AWS Account Access and VPC Provisioning

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-001 |
| **Title** | AWS Account Access and VPC Provisioning |
| **Description** | Request access to the AZ AWS account designated for Collectoid. Provision a VPC with public subnets (ALB), private subnets (ECS tasks), and data subnets (Aurora, ElastiCache) across two availability zones, as specified in `01-architecture-overview.md` Section 5. CIDR block: 10.0.0.0/16. Set up Internet Gateway, NAT Gateway, and route tables. Confirm VPC peering or PrivateLink requirements for reaching AZCT, Collibra, Immuta, and Starburst (QUESTION-003 from architecture doc). |
| **Priority** | P0 |
| **Effort** | L (4-5 days) |
| **Dependencies** | None (first task) |
| **Owner** | Lead Engineer + Cloud Engineering team |
| **Definition of Done** | VPC exists with 6 subnets (2 public, 2 private, 2 data) across 2 AZs; security groups created for ALB, ECS, Aurora, and ElastiCache; NAT Gateway operational; team members can access AWS console and CLI |
| **Status** | Not Started |

---

#### SZ-INF-002: ECS Cluster and Fargate Task Definitions

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-002 |
| **Title** | ECS Cluster and Fargate Task Definitions |
| **Description** | Create an ECS cluster for the dev environment. Define a Fargate task definition for the Next.js application: 0.5 vCPU, 1 GB memory, port 3000. Configure ECS service with desired count of 1 (dev). Set up CloudWatch log group for container stdout/stderr. Configure task execution role with permissions for ECR pull, CloudWatch Logs, and Secrets Manager read. Configure task role with permissions for SQS, SNS, and S3 access. Reference: `01-architecture-overview.md` Section 5, Environment Strategy table. |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-INF-001 (VPC must exist) |
| **Owner** | Lead Engineer |
| **Definition of Done** | ECS cluster running in dev; task definition registered; a "hello world" container deploys and is reachable via task public IP or ALB; logs appear in CloudWatch |
| **Status** | Not Started |

---

#### SZ-INF-003: Application Load Balancer and CloudFront Configuration

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-003 |
| **Title** | Application Load Balancer and CloudFront Configuration |
| **Description** | Provision an ALB in the public subnets. Configure HTTPS listener (port 443) with SSL certificate (see SZ-INF-010). Create target group pointing to ECS Fargate tasks on port 3000. Configure health check path as `/api/health`. Set up CloudFront distribution with ALB as origin for dynamic content and S3 for static assets (Next.js `_next/static/`). Attach WAF web ACL with OWASP Core Rule Set and rate limiting (see `01-architecture-overview.md` Section 5, `05-security-compliance.md` Section 9). |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-INF-001, SZ-INF-002, SZ-INF-010 |
| **Owner** | Lead Engineer |
| **Definition of Done** | ALB accepts HTTPS traffic and routes to ECS tasks; CloudFront distribution serves static assets; WAF blocks basic attack patterns; health check passes |
| **Status** | Not Started |

---

#### SZ-INF-004: Aurora PostgreSQL Provisioning (Dev + Staging)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-004 |
| **Title** | Aurora PostgreSQL Provisioning (Dev + Staging) |
| **Description** | Provision Aurora PostgreSQL 15 cluster in the data subnets. Dev instance: db.t3.medium, single-AZ. Create `collectoid_dev` database. Configure security group to allow inbound from ECS private subnets only. Enable encryption at rest (AES-256, AWS-managed key). Configure automated backups (7-day retention for dev). Create application database user with limited privileges (no DROP, no GRANT). Resolve QUESTION-001 from `01-architecture-overview.md`: confirm Aurora PostgreSQL is in the AZ approved services list. If not approved, escalate immediately as this blocks the entire data layer. |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-INF-001 (VPC and data subnets) |
| **Owner** | Lead Engineer + Cloud Engineering team |
| **Definition of Done** | Aurora cluster running; `collectoid_dev` database created; application user can connect from ECS subnet; encryption at rest confirmed; backup policy configured |
| **Status** | Not Started |

---

#### SZ-INF-005: ElastiCache Redis Provisioning

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-005 |
| **Title** | ElastiCache Redis Provisioning |
| **Description** | Provision ElastiCache Redis 7 in the data subnets. Dev instance: cache.t3.micro, single node. Configure security group to allow inbound from ECS private subnets only. Enable encryption at rest and in transit. Set eviction policy to `allkeys-lru`. This will be used for session storage (Auth.js), AZCT metadata cache, taxonomy cache, and rate limiting as specified in `01-architecture-overview.md` Section 8. |
| **Priority** | P0 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-INF-001 (VPC and data subnets) |
| **Owner** | Lead Engineer |
| **Definition of Done** | Redis node running; application can connect and execute GET/SET from ECS subnet; encryption in transit and at rest confirmed |
| **Status** | Not Started |

---

#### SZ-INF-006: SQS/SNS Queue and Topic Creation

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-006 |
| **Title** | SQS/SNS Queue and Topic Creation |
| **Description** | Create the event bus infrastructure as defined in `01-architecture-overview.md` Section 9. SNS topics: `collectoid-events`, `request-status-changes`, `collection-events`. SQS queues: `approval-notifications`, `audit-events`, `provisioning-tasks`, `external-sync`. Create corresponding dead-letter queues (`dlq-*`) with 14-day message retention. Subscribe SQS queues to appropriate SNS topics. Configure IAM policies for the ECS task role to publish to SNS and consume from SQS. |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-INF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | All SNS topics and SQS queues created; subscriptions configured; test message can be published to SNS and received in subscribed SQS queue; DLQs configured; IAM policies attached to ECS task role |
| **Status** | Not Started |

---

#### SZ-INF-007: ECR Repository Setup

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-007 |
| **Title** | ECR Repository Setup |
| **Description** | Create an ECR (Elastic Container Registry) repository named `collectoid`. Configure lifecycle policy to retain the last 30 images and delete untagged images after 7 days. Enable image scanning on push. Configure repository policy to allow the CI/CD pipeline role to push images and the ECS task execution role to pull images. |
| **Priority** | P0 |
| **Effort** | S (0.5 day) |
| **Dependencies** | SZ-INF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | ECR repository exists; a Docker image can be pushed from local or CI; ECS can pull the image; scanning is enabled |
| **Status** | Not Started |

---

#### SZ-INF-008: CI/CD Pipeline (GitHub Actions to ECR to ECS)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-008 |
| **Title** | CI/CD Pipeline (GitHub Actions to ECR to ECS) |
| **Description** | Create GitHub Actions workflows for the Collectoid repository. PR workflow: on every PR, run `npm ci`, lint (`eslint`), type-check (`tsc --noEmit`), unit tests (`vitest run`), and build (`next build`). Fail the PR if any step fails. Deploy workflow: on merge to `main`, build Docker image, push to ECR, update ECS service task definition to use the new image, and wait for deployment to stabilize. Confirm whether AZ uses GitHub Actions directly or requires CodePipeline as a bridge (QUESTION-002 from `01-architecture-overview.md`). Use OIDC federation for GitHub Actions to assume AWS IAM role (no long-lived access keys). |
| **Priority** | P0 |
| **Effort** | L (4-5 days) |
| **Dependencies** | SZ-INF-002, SZ-INF-007, SZ-SCF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | PR workflow runs on every PR and blocks merge on failure; deploy workflow pushes image to ECR and updates ECS on merge to main; deployment completes within 10 minutes; rollback procedure documented |
| **Status** | Not Started |

---

#### SZ-INF-009: Environment Configuration (Dev/Staging/Prod)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-009 |
| **Title** | Environment Configuration (Dev/Staging/Prod) |
| **Description** | Establish environment-specific configuration management. Create AWS Secrets Manager secrets for each environment containing: `DATABASE_URL`, `REDIS_URL`, `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`, `AZCT_API_KEY`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`. Configure the ECS task definition to inject these as environment variables from Secrets Manager. Create a `.env.example` file in the repository documenting all required variables. Set up `.env.local` for local development with non-secret defaults. Validate environment variables at application startup using a Zod schema (fail fast if misconfigured). |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-INF-002, SZ-INF-004, SZ-INF-005 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Secrets Manager contains dev secrets; ECS task injects them; `.env.example` committed; env validation schema catches missing variables at startup; `.env.local` template works for local development |
| **Status** | Not Started |

---

#### SZ-INF-010: Domain/DNS and SSL Certificate

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-010 |
| **Title** | Domain/DNS and SSL Certificate |
| **Description** | Request a subdomain for Collectoid (e.g., `collectoid-dev.az.com`, `collectoid.az.com`) via AZ DNS team. Provision an ACM (AWS Certificate Manager) certificate for the domain. Validate via DNS. Attach the certificate to the ALB HTTPS listener and the CloudFront distribution. Confirm with AZ DNS whether Route 53 is used or if DNS is managed externally. |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | None (can start in parallel; but SZ-INF-003 needs the cert) |
| **Owner** | Lead Engineer + AZ DNS team |
| **Definition of Done** | Domain resolves to ALB/CloudFront; HTTPS works with a valid certificate; no browser security warnings |
| **Status** | Not Started |

---

#### SZ-INF-011: IAM Roles and Policies

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-011 |
| **Title** | IAM Roles and Policies |
| **Description** | Create the following IAM roles with least-privilege policies: (1) ECS Task Execution Role -- permissions for ECR pull, CloudWatch Logs, Secrets Manager read. (2) ECS Task Role -- permissions for SQS send/receive, SNS publish, S3 read/write (for report exports), Secrets Manager read. (3) CI/CD Pipeline Role -- permissions for ECR push, ECS service update, CloudFormation/Terraform state. (4) Developer Role -- read-only access to CloudWatch, ECS, Aurora (for debugging). All policies should follow the principle of least privilege as specified in `05-security-compliance.md`. |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-INF-001 |
| **Owner** | Lead Engineer + Cloud Engineering team |
| **Definition of Done** | All 4 IAM roles created with documented policies; ECS tasks can access all required services; CI/CD can deploy; developers can view logs but not modify infrastructure |
| **Status** | Not Started |

---

#### SZ-INF-012: Terraform / IaC Setup

| Field | Value |
|-------|-------|
| **Task ID** | SZ-INF-012 |
| **Title** | Terraform / Infrastructure as Code Setup |
| **Description** | Establish Terraform (or CloudFormation if AZ mandates) project for all Collectoid infrastructure. Organize into modules: `networking` (VPC, subnets, security groups), `compute` (ECS, ALB, CloudFront), `data` (Aurora, ElastiCache), `messaging` (SQS, SNS), `security` (IAM, WAF, Secrets Manager), `monitoring` (CloudWatch, alarms). Store state in S3 with DynamoDB locking. Tag all resources with `Project=Collectoid`, `Environment=dev|staging|prod`, `CostCenter=WP4`. This codifies all infrastructure created in SZ-INF-001 through SZ-INF-011. |
| **Priority** | P1 |
| **Effort** | XL (5+ days) |
| **Dependencies** | SZ-INF-001 through SZ-INF-011 (can be done iteratively alongside) |
| **Owner** | Lead Engineer |
| **Definition of Done** | All infrastructure is defined in Terraform; `terraform plan` shows no drift from actual state; a new environment can be provisioned by running `terraform apply` with different variables; state stored securely in S3 |
| **Status** | Not Started |

---

### 2.2 Authentication & Authorization

#### SZ-AUTH-001: Azure AD App Registration (Dev Tenant)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-AUTH-001 |
| **Title** | Azure AD App Registration (Dev Tenant) |
| **Description** | Register a new application in Azure AD (Entra ID) for the Collectoid dev environment. Configure as a web application with redirect URI `https://localhost:3000/api/auth/callback/azure-ad` (local dev) and `https://collectoid-dev.az.com/api/auth/callback/azure-ad` (deployed dev). Request the following API permissions: `openid`, `profile`, `email`, `User.Read`, `GroupMember.Read.All`. Generate a client secret. Confirm which Azure AD tenant to use (QUESTION-INT-002 from `04-integration-map.md`). Configure optional claims to include `groups` in the ID token. |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | None (but requires Identity Services team cooperation) |
| **Owner** | Lead Engineer + Identity Services team |
| **Definition of Done** | App registration exists in Azure AD; client ID and secret available; redirect URIs configured for local and dev; `groups` claim included in ID token; permissions granted by Azure AD admin |
| **Status** | Not Started |

---

#### SZ-AUTH-002: Auth.js v5 Integration with Azure AD Provider

| Field | Value |
|-------|-------|
| **Task ID** | SZ-AUTH-002 |
| **Title** | Auth.js v5 Integration with Azure AD Provider |
| **Description** | Install and configure Auth.js (NextAuth.js) v5 in the production Next.js project. Configure the Azure AD provider using the credentials from SZ-AUTH-001. Implement the OIDC authorization code flow with PKCE as specified in `05-security-compliance.md` Section 2. Configure the `jwt` callback to extract user profile (oid, name, email, preferred_username) and groups from the ID token. Configure the `session` callback to attach role information. Set session strategy to JWT with 24-hour sliding expiry. Configure CSRF protection via SameSite cookie. See `04-integration-map.md` Section 4.1 for the detailed authentication flow and code sample. |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-AUTH-001, SZ-SCF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | User can click "Sign In", authenticate via Azure AD, and return to the application with a valid session; user profile (name, email) is displayed; session persists across page reloads; logout clears session |
| **Status** | Not Started |

---

#### SZ-AUTH-003: Server-Side Session Management with Redis

| Field | Value |
|-------|-------|
| **Task ID** | SZ-AUTH-003 |
| **Title** | Server-Side Session Management with Redis |
| **Description** | Configure Auth.js to store sessions in Redis (ElastiCache) rather than client-side JWTs. This enables session sharing across multiple ECS Fargate tasks and supports session revocation. Implement the Redis session adapter. Store session data including user ID, roles, encrypted access token, encrypted refresh token, and expiry. Use cache key convention: `collectoid:{env}:session:{session_id}` as defined in `01-architecture-overview.md` Section 8. Configure 24-hour sliding window expiry. |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-AUTH-002, SZ-INF-005 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Sessions stored in Redis (verified via Redis CLI); session persists when user hits different ECS tasks; session expires after 24 hours of inactivity; logout removes session from Redis |
| **Status** | Not Started |

---

#### SZ-AUTH-004: Role Mapping from Azure AD Groups

| Field | Value |
|-------|-------|
| **Task ID** | SZ-AUTH-004 |
| **Title** | Role Mapping from Azure AD Groups |
| **Description** | Implement the mapping between Azure AD security groups and Collectoid application roles as defined in `04-integration-map.md` Section 4.1 and `05-security-compliance.md` Section 3. Map groups to roles: `SG-Collectoid-DCM` -> DCM, `SG-Collectoid-Approver` -> Approver, `SG-Collectoid-TeamLead` -> Team Lead, `SG-Collectoid-Consumer` -> Data Consumer, `SG-Collectoid-Admin` -> Admin. Handle users with multiple group memberships (multiple roles). Store mapped roles in the local `user_roles` table (see `03-data-model.md` Section 3.2). Fall back to `data_consumer` role if user has no recognized group membership. Resolve QUESTION-INT-001: confirm actual Azure AD group names with Identity Services. |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-AUTH-002, SZ-DB-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | User's Azure AD groups are read at login; roles are mapped and stored in DB; roles are included in session; different group memberships produce different role assignments; fallback role works for unrecognized groups |
| **Status** | Not Started |

---

#### SZ-AUTH-005: Middleware Protection on All Routes

| Field | Value |
|-------|-------|
| **Task ID** | SZ-AUTH-005 |
| **Title** | Middleware Protection on All Routes |
| **Description** | Implement Next.js middleware that intercepts all requests to `/collectoid/*` and `/api/*` (except `/api/health` and `/api/auth/*`). Validate that a valid session exists. If no session, redirect to the Auth.js sign-in page. For API routes, return 401 JSON response instead of redirect. Implement the middleware chain described in `01-architecture-overview.md` Section 7: rate limiter, auth verify, RBAC check, input validation, request log. For Sprint Zero, implement at minimum: auth verify and basic RBAC check (role present in session). |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-AUTH-002 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Unauthenticated requests to `/collectoid/*` redirect to login; unauthenticated API requests return 401; `/api/health` is accessible without auth; authenticated requests pass through; session expiry triggers re-authentication |
| **Status** | Not Started |

---

#### SZ-AUTH-006: Login/Logout Flow End-to-End

| Field | Value |
|-------|-------|
| **Task ID** | SZ-AUTH-006 |
| **Title** | Login/Logout Flow End-to-End |
| **Description** | Implement complete login and logout user flows. Login: user visits any protected page, is redirected to Azure AD, authenticates (with MFA if Azure AD policy requires), returns to the originally requested page. Logout: user clicks "Sign Out", Auth.js session is cleared from Redis, Azure AD session is optionally cleared (front-channel logout), user is redirected to a "signed out" confirmation page. Handle edge cases: expired session (silent re-auth via refresh token), revoked Azure AD account (session invalidated on next request), concurrent sessions (allowed). |
| **Priority** | P0 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-AUTH-002, SZ-AUTH-003, SZ-AUTH-005 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Full login flow works from any protected URL; logout clears session and redirects; expired sessions trigger re-auth transparently; sign-out page renders correctly |
| **Status** | Not Started |

---

#### SZ-AUTH-007: RBAC Permission Matrix Implementation

| Field | Value |
|-------|-------|
| **Task ID** | SZ-AUTH-007 |
| **Title** | RBAC Permission Matrix Implementation |
| **Description** | Implement the role-based access control system defined in `05-security-compliance.md` Section 3 and `03-data-model.md` Section 3.2. Create a `checkPermission(userId, resource, action)` utility that resolves the user's roles and checks against the permission matrix. Implement server-side enforcement in API route handlers. Implement client-side visibility control (hide UI elements the user lacks permission for). Roles and permissions as defined in seed data: DCM (create/edit/submit collections), Approver (review/approve/reject), Team Lead (manage team access), Data Consumer (browse/search/request), Admin (full system access). |
| **Priority** | P1 |
| **Effort** | L (4-5 days) |
| **Dependencies** | SZ-AUTH-004, SZ-DB-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Permission check utility works for all 6 roles; API routes enforce permissions (403 returned for unauthorized actions); UI conditionally renders based on role; comprehensive test coverage for permission matrix |
| **Status** | Not Started |

---

### 2.3 Database & Data Model

#### SZ-DB-001: Aurora PostgreSQL Schema Creation

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DB-001 |
| **Title** | Aurora PostgreSQL Schema Creation |
| **Description** | Create all database tables, indexes, constraints, and triggers as defined in `03-data-model.md`. Core entities: `users`, `roles`, `user_roles`, `collections`, `collection_versions`, `collection_members`, `datasets`, `child_datasets`, `data_categories`, `dataset_categories`, `cv_datasets`, `agreements_of_terms`, `agreement_versions`, `access_requests`, `approval_chains`, `approvals`, `discussions`, `comments`, `notifications`, `audit_events`. External cache tables: `external_cache_azct`, `external_cache_cornerstone`, `external_cache_collibra`. Create all indexes listed in `03-data-model.md` Section 7. Create immutability triggers on `audit_events` to prevent UPDATE and DELETE (see `03-data-model.md` Section 4, `05-security-compliance.md` Section 4). |
| **Priority** | P0 |
| **Effort** | L (4-5 days) |
| **Dependencies** | SZ-INF-004 (Aurora must be provisioned), SZ-SCF-005 (migration tooling) |
| **Owner** | Lead Engineer |
| **Definition of Done** | All tables exist in `collectoid_dev`; all foreign keys, constraints, and indexes are created; audit_events immutability trigger prevents UPDATE/DELETE; schema can be reproduced by running migrations from scratch |
| **Status** | Not Started |

---

#### SZ-DB-002: Database Migration Tooling Setup (Drizzle ORM)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DB-002 |
| **Title** | Database Migration Tooling Setup (Drizzle ORM) |
| **Description** | Install and configure Drizzle ORM as the database query layer and migration tool. Drizzle is recommended in `01-architecture-overview.md` Section 6 for its type-safe PostgreSQL support including JSONB operators. Define the Drizzle schema files matching `03-data-model.md` entities. Generate initial migration from schema. Configure `drizzle.config.ts` with environment-specific database URLs. Create npm scripts: `db:generate` (generate migration from schema changes), `db:migrate` (apply pending migrations), `db:push` (push schema directly for dev), `db:studio` (launch Drizzle Studio for DB inspection). Document the migration workflow in the README. |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-INF-004, SZ-SCF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Drizzle ORM installed and configured; schema files define all entities from `03-data-model.md`; `npm run db:migrate` creates all tables from scratch; `npm run db:studio` opens a visual DB inspector; migration files are committed to the repo |
| **Status** | Not Started |

---

#### SZ-DB-003: Seed Data Scripts

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DB-003 |
| **Title** | Seed Data Scripts |
| **Description** | Create seed data scripts that populate the dev database with realistic data derived from the POC mock data (`lib/dcm-mock-data.ts`, 5,381 lines). Extract and transform: (1) System roles with permission sets. (2) Sample users (at least 10) with role assignments. (3) Sample collections (at least 5) spanning different statuses (draft, pending_approval, approved, active). (4) Sample datasets with d-codes mapping to real AZ study identifiers where possible. (5) Sample data categories from the 30+ taxonomy. (6) At least 1 complete approval chain with decisions. (7) At least 10 audit events demonstrating the audit trail. Create an idempotent `npm run db:seed` script that can be re-run without duplicating data. |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-DB-001, SZ-DB-002 |
| **Owner** | Lead Engineer |
| **Definition of Done** | `npm run db:seed` populates dev database with realistic data; all entity types have at least one representative record; data is internally consistent (foreign keys valid); script is idempotent |
| **Status** | Not Started |

---

#### SZ-DB-004: Audit Trail Immutability Triggers

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DB-004 |
| **Title** | Audit Trail Immutability Triggers |
| **Description** | Create PostgreSQL triggers on the `audit_events` table that prevent any UPDATE or DELETE operations, as required by `03-data-model.md` Section 4 and `05-security-compliance.md` Section 4. The trigger function should raise an exception with a clear error message: "Audit events are immutable and cannot be modified or deleted." Create a separate database role for audit writes that has INSERT-only permission on `audit_events`. Verify that even the database superuser cannot bypass the trigger (or document that this is a PostgreSQL limitation and compensate with CloudWatch alerts on audit table modifications). |
| **Priority** | P0 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-DB-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | UPDATE on `audit_events` raises an error; DELETE on `audit_events` raises an error; INSERT works normally; trigger is tested with automated test; limitation re: superuser is documented |
| **Status** | Not Started |

---

#### SZ-DB-005: Index Creation for Key Query Patterns

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DB-005 |
| **Title** | Index Creation for Key Query Patterns |
| **Description** | Create all database indexes defined in `03-data-model.md` Section 7 to support the key query patterns. Priority indexes include: (1) `idx_users_azure_ad_id` UNIQUE on `users.azure_ad_id` (login lookup). (2) `idx_collections_status` on `collections.status` (dashboard filtering). (3) `idx_collections_metadata` GIN on `collections.metadata` (JSONB queries). (4) `idx_audit_events_entity` on `audit_events(entity_type, entity_id)` (audit trail lookups). (5) `idx_audit_events_occurred_at` on `audit_events.occurred_at` (time-range queries). (6) `idx_datasets_d_code` UNIQUE on `datasets.d_code` (d-code resolution). (7) Partial indexes on `deleted_at IS NULL` for soft-delete filtering. Run EXPLAIN ANALYZE on representative queries to verify index usage. |
| **Priority** | P1 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-DB-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | All indexes from `03-data-model.md` Section 7 exist; EXPLAIN ANALYZE confirms index usage for representative queries; no sequential scans on indexed columns for common query patterns |
| **Status** | Not Started |

---

#### SZ-DB-006: Backup Configuration

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DB-006 |
| **Title** | Aurora PostgreSQL Backup Configuration |
| **Description** | Configure Aurora automated backups: dev (7-day retention, daily snapshot), staging (14-day retention, daily snapshot), prod (30-day retention, continuous backup with point-in-time recovery). Enable cluster-level snapshot export to S3 for long-term retention if required by compliance (QUESTION-015 from `01-architecture-overview.md`: audit log retention requirement). Document the restore procedure and test a restore from snapshot in the dev environment. |
| **Priority** | P1 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-INF-004 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Automated backups running for dev; restore procedure documented; test restore completed successfully; retention periods configured per environment |
| **Status** | Not Started |

---

### 2.4 Project Scaffolding

#### SZ-SCF-001: Production Next.js Project Setup

| Field | Value |
|-------|-------|
| **Task ID** | SZ-SCF-001 |
| **Title** | Production Next.js Project Setup |
| **Description** | Initialize the production Next.js project. Decision required: either migrate the existing POC codebase (stripping mock data and POC-only patterns) or scaffold a fresh project and selectively copy validated patterns. The POC provides validated UX in `app/collectoid/` but includes POC-only artifacts (`_variations/`, `app/ux/`, simple password auth) that must not carry forward (see `01-architecture-overview.md` Appendix B). Whichever approach: ensure Next.js latest with App Router, React 19, TypeScript 5.x, Tailwind CSS 4.x, Node.js 20 LTS. Create `Dockerfile` for production builds (multi-stage: build stage with `next build`, production stage with `next start`). Create `.dockerignore` to exclude `node_modules`, `.next`, `.env*`. Set up `next.config.ts` with output: `standalone` for Docker deployment. |
| **Priority** | P0 |
| **Effort** | L (4-5 days) |
| **Dependencies** | None (first engineering task) |
| **Owner** | Lead Engineer |
| **Definition of Done** | Production repo exists; `npm run dev` starts locally; `npm run build` succeeds; `docker build` produces a runnable image; `docker run` starts the app on port 3000; Tailwind CSS renders correctly; TypeScript strict mode enabled |
| **Status** | Not Started |

---

#### SZ-SCF-002: TypeScript Strict Mode and Build Configuration

| Field | Value |
|-------|-------|
| **Task ID** | SZ-SCF-002 |
| **Title** | TypeScript Strict Mode and Build Configuration |
| **Description** | Configure TypeScript with strict mode enabled in `tsconfig.json`. Enable: `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true`, `noImplicitReturns: true`, `noFallthroughCasesInSwitch: true`. Configure path aliases: `@/` for project root, `@/lib/` for library code, `@/components/` for components. Set `target: "ES2022"`, `moduleResolution: "bundler"`. Ensure `tsc --noEmit` passes as part of the CI pipeline (SZ-INF-008). |
| **Priority** | P0 |
| **Effort** | S (0.5 day) |
| **Dependencies** | SZ-SCF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | `tsconfig.json` has strict mode and all listed flags; `tsc --noEmit` passes with zero errors; path aliases resolve correctly in imports |
| **Status** | Not Started |

---

#### SZ-SCF-003: ESLint and Prettier Configuration

| Field | Value |
|-------|-------|
| **Task ID** | SZ-SCF-003 |
| **Title** | ESLint and Prettier Configuration |
| **Description** | Configure ESLint with the following plugins: `@typescript-eslint`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y` (accessibility), `eslint-plugin-import` (import ordering). Extend from `next/core-web-vitals` and `next/typescript`. Configure Prettier for consistent formatting: `semi: true`, `singleQuote: true`, `trailingComma: "es5"`, `printWidth: 100`, `tabWidth: 2`. Install `eslint-config-prettier` to avoid conflicts. Add npm scripts: `lint` (run ESLint), `lint:fix` (auto-fix), `format` (run Prettier), `format:check` (check formatting). Configure VS Code settings (`.vscode/settings.json`) for format-on-save. |
| **Priority** | P0 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-SCF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | `npm run lint` runs without errors on the codebase; `npm run format:check` passes; VS Code auto-formats on save; ESLint catches accessibility issues via jsx-a11y |
| **Status** | Not Started |

---

#### SZ-SCF-004: tRPC Setup with Router Structure

| Field | Value |
|-------|-------|
| **Task ID** | SZ-SCF-004 |
| **Title** | tRPC Setup with Router Structure |
| **Description** | Install and configure tRPC v11 for type-safe API layer between client and server. Create the tRPC initialization: context factory (extract user session, database client), router factory, procedure builders (public, protected, role-specific). Create the initial router structure matching the API layer in `01-architecture-overview.md` Section 4: `collections`, `requests`, `approvals`, `datasets`, `users`, `audit`, `notifications`, `admin`, `health`. Configure the tRPC HTTP handler in Next.js App Router (`app/api/trpc/[trpc]/route.ts`). Set up the tRPC React client with React Query integration (see SZ-SCF-006). Create at least one working endpoint (`health.check`) as a proof of concept. |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-SCF-001, SZ-AUTH-002 |
| **Owner** | Lead Engineer |
| **Definition of Done** | tRPC router structure exists with all listed sub-routers (stubs); `health.check` endpoint returns a response; client can call `trpc.health.check.useQuery()` with full type safety; protected procedures require valid session |
| **Status** | Not Started |

---

#### SZ-SCF-005: React Query Provider Setup

| Field | Value |
|-------|-------|
| **Task ID** | SZ-SCF-005 |
| **Title** | React Query Provider Setup |
| **Description** | Install and configure TanStack React Query v5 as the client-side server state management layer. This is used in conjunction with tRPC (SZ-SCF-004) for data fetching, caching, and mutation management. Create a `QueryClientProvider` wrapper in the root layout. Configure default options: `staleTime: 5 * 60 * 1000` (5 minutes), `gcTime: 10 * 60 * 1000` (10 minutes), `retry: 1`, `refetchOnWindowFocus: false`. Set up React Query Devtools (dev only). Document the data fetching strategy: React Server Components for initial page data, React Query (via tRPC) for interactive data fetching and mutations, as outlined in the architecture state management approach. |
| **Priority** | P0 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-SCF-001, SZ-SCF-004 |
| **Owner** | Lead Engineer |
| **Definition of Done** | `QueryClientProvider` wraps the app; React Query Devtools available in dev; tRPC queries use React Query under the hood; a test query fetches and caches data correctly |
| **Status** | Not Started |

---

#### SZ-SCF-006: Zod Validation Schemas for API Inputs

| Field | Value |
|-------|-------|
| **Task ID** | SZ-SCF-006 |
| **Title** | Zod Validation Schemas for API Inputs |
| **Description** | Install Zod and create the foundational validation schemas referenced in `01-architecture-overview.md` Section 7. Create schemas in `lib/validation/`: `collections.ts` (CreateCollectionSchema, UpdateCollectionSchema, PaginationSchema), `requests.ts` (CreateRequestSchema), `approvals.ts` (SubmitDecisionSchema), `common.ts` (UUIDSchema, DateRangeSchema, SortOrderSchema). Integrate with tRPC procedures as input validators. Create the environment variable validation schema (`lib/env.ts`) that validates all required env vars at startup using Zod. |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-SCF-001, SZ-SCF-004 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Core Zod schemas defined and exported; tRPC procedures validate inputs via Zod; invalid inputs return structured 400 errors matching the error envelope from `01-architecture-overview.md` Section 7; env validation catches missing variables |
| **Status** | Not Started |

---

#### SZ-SCF-007: Project Directory Structure

| Field | Value |
|-------|-------|
| **Task ID** | SZ-SCF-007 |
| **Title** | Project Directory Structure |
| **Description** | Establish the production directory structure as defined in `01-architecture-overview.md` Section 4. Create all directories with placeholder files (index.ts barrel exports or README.md files explaining the directory purpose). Structure: `app/collectoid/(dcm)/`, `app/collectoid/(discover)/`, `app/collectoid/(requests)/`, `app/collectoid/(admin)/`, `app/api/trpc/`, `app/api/auth/`, `app/api/health/`, `lib/services/`, `lib/clients/` (base-client, azure-ad, azct, cornerstone, collibra, immuta, starburst, provisioning -- as per `04-integration-map.md` Section 1.3), `lib/db/`, `lib/cache/`, `lib/queue/`, `lib/auth/`, `lib/validation/`, `components/ui/`, `components/shared/`. |
| **Priority** | P0 |
| **Effort** | S (0.5 day) |
| **Dependencies** | SZ-SCF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | All directories exist; each directory has an index file or README explaining its purpose; import paths work correctly with TypeScript path aliases |
| **Status** | Not Started |

---

#### SZ-SCF-008: PR Template, Branch Naming, and Commit Conventions

| Field | Value |
|-------|-------|
| **Task ID** | SZ-SCF-008 |
| **Title** | PR Template, Branch Naming, and Commit Conventions |
| **Description** | Create `.github/pull_request_template.md` with sections: Summary, Changes, Testing, Screenshots (if UI), and Checklist (lint passes, tests pass, no secrets committed). Define branch naming convention: `feature/SZ-XXX-short-description`, `fix/SZ-XXX-description`, `chore/SZ-XXX-description`. Define commit message convention: Conventional Commits format (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`). Optionally set up commitlint to enforce the convention. Configure GitHub branch protection on `main`: require PR reviews (1 reviewer minimum), require status checks to pass, disallow direct pushes. |
| **Priority** | P1 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-SCF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | PR template appears when creating a PR; branch protection rules active on main; commit convention documented; at least one PR has been created following the process |
| **Status** | Not Started |

---

#### SZ-SCF-009: Environment Variable Management

| Field | Value |
|-------|-------|
| **Task ID** | SZ-SCF-009 |
| **Title** | Environment Variable Management |
| **Description** | Create `.env.example` listing all required environment variables with descriptions and placeholder values. Create `.env.local.example` with local development defaults. Implement startup validation (SZ-SCF-006) that fails fast with clear error messages for missing required variables. Add `.env*` (except `.env.example` and `.env.local.example`) to `.gitignore`. Document in README which variables are required for local development vs. production. Variables to document: `DATABASE_URL`, `REDIS_URL`, `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `AZCT_API_URL`, `AZCT_API_KEY`, `SENTRY_DSN`, `LOG_LEVEL`. |
| **Priority** | P0 |
| **Effort** | S (0.5 day) |
| **Dependencies** | SZ-SCF-001, SZ-SCF-006 |
| **Owner** | Lead Engineer |
| **Definition of Done** | `.env.example` committed with all variables documented; `.env*` in `.gitignore`; startup fails with descriptive error if required variable is missing; README documents variable purposes |
| **Status** | Not Started |

---

### 2.5 External API Integration Setup

#### SZ-EXT-001: AZCT API -- Obtain Documentation, Credentials, and Sandbox Access

| Field | Value |
|-------|-------|
| **Task ID** | SZ-EXT-001 |
| **Title** | AZCT API -- Obtain Documentation, Credentials, and Sandbox Access |
| **Description** | Contact the AZCT team to obtain: (1) REST API documentation (endpoints, request/response schemas, authentication method, rate limits, pagination patterns). (2) Sandbox/dev environment credentials (service principal or API key). (3) Access to a non-production AZCT instance for testing. (4) Clarification on whether AZCT supports webhooks or change notifications (QUESTION-006 from `01-architecture-overview.md`). (5) Expected latency and rate limit thresholds. This is the most critical external integration after Azure AD, as study metadata and d-code resolution depend on it (see `04-integration-map.md` Section 4.2). Integration criticality: HIGH. Required by Q2 per integration map. |
| **Priority** | P0 |
| **Effort** | M (2-3 days) -- includes coordination time with AZCT team |
| **Dependencies** | None |
| **Owner** | Lead Engineer + Product Owner (for organizational escalation) |
| **Definition of Done** | API documentation received and reviewed; sandbox credentials obtained; at least one successful API call made from local development environment; rate limits and auth method documented |
| **Status** | Not Started |

---

#### SZ-EXT-002: AZCT API -- Implement Client with Auth, Pagination, Error Handling

| Field | Value |
|-------|-------|
| **Task ID** | SZ-EXT-002 |
| **Title** | AZCT API -- Implement Client with Auth, Pagination, Error Handling |
| **Description** | Implement `lib/clients/azct-client.ts` extending the base client class (`lib/clients/base-client.ts`) as specified in `04-integration-map.md` Section 1.3. The base client provides: configurable timeout, retry with exponential backoff, circuit breaker (closed/open/half-open states), structured logging with correlation IDs, metric emission, and token management. The AZCT client should implement: (1) `getStudies(criteria)` -- resolve criteria to study list with d-codes. (2) `getStudyDetail(dCode)` -- get full metadata for a single study. (3) `searchStudies(query)` -- full-text search. Handle pagination (cursor or offset-based, per AZCT API docs). Cache responses in Redis with 1-hour TTL as specified in `01-architecture-overview.md` Section 8. |
| **Priority** | P1 |
| **Effort** | L (4-5 days) |
| **Dependencies** | SZ-EXT-001 (need API docs and credentials), SZ-SCF-001, SZ-INF-005 (Redis for caching) |
| **Owner** | Lead Engineer |
| **Definition of Done** | AZCT client can authenticate and retrieve study data; pagination works for large result sets; circuit breaker triggers after 5 consecutive failures; responses cached in Redis; error handling returns structured errors; at least 3 integration tests pass |
| **Status** | Not Started |

---

#### SZ-EXT-003: AZCT API -- Initial Batch Sync Test

| Field | Value |
|-------|-------|
| **Task ID** | SZ-EXT-003 |
| **Title** | AZCT API -- Initial Batch Sync Test |
| **Description** | Implement the scheduled batch sync job for AZCT study metadata as described in `04-integration-map.md` Section 6. Create `lib/services/external-sync.ts` with a `syncAZCTStudies()` function that: (1) Fetches all studies (or delta since last sync if AZCT supports it). (2) Upserts into the `external_cache_azct` table with `raw_payload` (JSONB), `synced_at`, and `sync_status`. (3) Maps relevant fields into the `datasets` table. (4) Logs sync results (count synced, count failed, duration). Run a test sync against the AZCT sandbox to validate the end-to-end flow. This will be triggered by the `external-sync` SQS queue in production (SZ-INF-006). |
| **Priority** | P2 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-EXT-002, SZ-DB-001, SZ-INF-006 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Batch sync retrieves study data from AZCT and stores in `external_cache_azct`; datasets are created/updated in `datasets` table; sync results logged; test sync completes without errors |
| **Status** | Not Started |

---

#### SZ-EXT-004: Cornerstone API -- Obtain Documentation and Credentials

| Field | Value |
|-------|-------|
| **Task ID** | SZ-EXT-004 |
| **Title** | Cornerstone API -- Obtain Documentation and Credentials |
| **Description** | Contact the Cornerstone LMS team to obtain: (1) API documentation (endpoints for querying training completion by user). (2) Authentication method (API key or OAuth 2.0). (3) Sandbox/test credentials. (4) Rate limit information. (5) Clarification on user ID mapping -- how Cornerstone identifies users (email, PRID, Azure AD OID?) and how to map to Collectoid user records. Integration criticality: MEDIUM (graceful degradation possible). Pattern: on-demand with 30-minute cache per `04-integration-map.md` Section 4.3. |
| **Priority** | P1 |
| **Effort** | S (0.5-1 day) -- coordination time |
| **Dependencies** | None |
| **Owner** | Lead Engineer + Product Owner |
| **Definition of Done** | API documentation received; authentication method understood; user ID mapping strategy documented; sandbox credentials obtained (or timeline for obtaining them established) |
| **Status** | Not Started |

---

#### SZ-EXT-005: Cornerstone API -- Resolve User ID Mapping Strategy

| Field | Value |
|-------|-------|
| **Task ID** | SZ-EXT-005 |
| **Title** | Cornerstone API -- Resolve User ID Mapping Strategy |
| **Description** | Determine how to map between Collectoid user records (identified by `azure_ad_id` or `prid`) and Cornerstone user records. Options: (1) Match on email address. (2) Match on PRID (if Cornerstone stores it). (3) Match on a shared external ID. Document the chosen mapping in the integration specification. This determines how the training status check (`04-integration-map.md` Section 4.3) will work at access request creation time. |
| **Priority** | P1 |
| **Effort** | S (0.5 day) |
| **Dependencies** | SZ-EXT-004 |
| **Owner** | Lead Engineer |
| **Definition of Done** | User ID mapping strategy documented; at least one test lookup confirms the mapping works; strategy recorded in `04-integration-map.md` |
| **Status** | Not Started |

---

#### SZ-EXT-006: Collibra 2.0 -- Confirm Timeline and API Availability

| Field | Value |
|-------|-------|
| **Task ID** | SZ-EXT-006 |
| **Title** | Collibra 2.0 -- Confirm Timeline and API Availability |
| **Description** | Coordinate with the Collibra team and WP3 (Data Readiness) to determine: (1) When Collibra 2.0 APIs will be available for integration (QUESTION-007 from `01-architecture-overview.md`). (2) What standardized metadata taxonomy will be exposed. (3) Whether a sandbox environment exists for testing. (4) The fallback plan if Collibra 2.0 is not ready at Collectoid launch. The fallback is to use AZCT as the sole metadata source and add Collibra as a secondary source when available. Integration criticality: MEDIUM. Not required until Q3 per `04-integration-map.md`. |
| **Priority** | P2 |
| **Effort** | S (0.5 day) -- coordination only |
| **Dependencies** | None |
| **Owner** | Product Owner + Lead Engineer |
| **Definition of Done** | Collibra 2.0 timeline confirmed (or confirmed as unavailable for 2026 H1); fallback strategy documented; decision recorded in `04-integration-map.md` |
| **Status** | Not Started |

---

#### SZ-EXT-007: Immuta -- Obtain API Documentation and Sandbox Access

| Field | Value |
|-------|-------|
| **Task ID** | SZ-EXT-007 |
| **Title** | Immuta -- Obtain API Documentation and Sandbox Access |
| **Description** | Contact the Immuta team to obtain: (1) API documentation for policy creation and updates. (2) The data contract for what Collectoid sends when provisioning access (QUESTION-008 from `01-architecture-overview.md`). (3) Sandbox credentials for testing. (4) Confirmation of whether the integration is REST API, event-driven, or manual handoff. Integration criticality: HIGH. Required by Q3 per `04-integration-map.md` Section 4.5. Sprint Zero goal is to confirm the integration pattern, not to implement it. |
| **Priority** | P2 |
| **Effort** | S (0.5 day) -- coordination only |
| **Dependencies** | None |
| **Owner** | Lead Engineer + DPO team |
| **Definition of Done** | API documentation received or timeline for receipt established; integration pattern confirmed (REST/event/manual); sandbox access requested |
| **Status** | Not Started |

---

#### SZ-EXT-008: Design In-App Approval Workflow and State Machine

| Field | Value |
|-------|-------|
| **Task ID** | SZ-EXT-008 |
| **Title** | Design In-App Approval Workflow and State Machine |
| **Description** | Design the complete in-app approval workflow using the two-dimensional collection state model: (1) **governance_stage** transitions (concept → draft → pending_approval → approved / rejected) with valid transitions, (2) **operational_state** transitions (provisioning → live → suspended → decommissioned) triggered once governance_stage reaches approved, (3) **proposition lifecycle** (draft → submitted → approved → merged, or → rejected) for tracking in-flight changes to live collections — propositions are a separate entity; multiple concurrent propositions per collection are allowed with merge-time conflict resolution, (4) Digital acknowledgement capture requirements (timestamp, IP, user agent, session ID), (5) Notification triggers for each state dimension and proposition status change (in-app + email), (6) Multi-TA "all or nothing" approval chain logic, (7) Audit trail events for every approval action across both state dimensions and proposition lifecycle, (8) SLA tracking and escalation rules. Output: Approval workflow specification document with state diagrams for both collection dimensions and the proposition lifecycle, reviewed by compliance team. |
| **Priority** | P0 |
| **Effort** | M (3 days) -- requires compliance team input |
| **Dependencies** | SZ-DB-001 (database schema) |
| **Owner** | Tech Lead (TBC) |
| **Definition of Done** | Two-dimensional state model (governance_stage, operational_state) plus proposition lifecycle (draft → submitted → approved → merged / rejected) designed and documented with valid transitions; compliance team has reviewed audit trail requirements; notification triggers defined for each state dimension and proposition status change; digital acknowledgement fields specified |
| **Status** | Not Started |

---

#### SZ-EXT-009: Consumption Environments -- Inventory APIs vs Link-Out

| Field | Value |
|-------|-------|
| **Task ID** | SZ-EXT-009 |
| **Title** | Consumption Environments -- Inventory APIs vs Link-Out |
| **Description** | For each consumption environment (PDP, Domino Data Lab, SCP, AI Bench, IO Platform), determine whether Collectoid should: (1) Provide a link-out URL (user clicks to open environment). (2) Call a provisioning API to set up access. (3) Both. Inventory what APIs exist for each environment (QUESTION-011 from `01-architecture-overview.md`). Document the findings in `04-integration-map.md` Section 4.8. For Sprint Zero, link-out is sufficient; API-based provisioning is a Q3 requirement. |
| **Priority** | P2 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | None |
| **Owner** | Lead Engineer + DPO team |
| **Definition of Done** | Each consumption environment documented with: available API (if any), URL pattern for link-out, provisioning mechanism; findings added to `04-integration-map.md` |
| **Status** | Not Started |

---

### 2.6 Design System & UI

#### SZ-UI-001: Migrate shadcn/ui Components from POC

| Field | Value |
|-------|-------|
| **Task ID** | SZ-UI-001 |
| **Title** | Migrate shadcn/ui Components from POC |
| **Description** | Copy all shadcn/ui components from the POC `components/ui/` directory into the production project. These are standard Radix UI primitives wrapped with Tailwind CSS and are directly reusable (see `01-architecture-overview.md` Appendix B). Inventory includes: Button, Card, Dialog, DropdownMenu, Input, Label, Select, Tabs, Badge, Tooltip, Avatar, Table, Sheet, and others used in the POC. Ensure all Radix UI peer dependencies are installed. Verify each component renders correctly with the production Tailwind configuration. Do NOT copy POC-specific patterns (`_variations/`, `app/ux/`). |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-SCF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | All shadcn/ui components from POC are available in `components/ui/`; each component renders without errors; Tailwind classes apply correctly; no POC-specific code included |
| **Status** | Not Started |

---

#### SZ-UI-002: Establish Production Design Tokens

| Field | Value |
|-------|-------|
| **Task ID** | SZ-UI-002 |
| **Title** | Establish Production Design Tokens |
| **Description** | Define the production design token system in `tailwind.config.ts` and CSS custom properties. Tokens to define: color palette (primary, secondary, destructive, muted, accent -- aligned with AZ brand guidelines), typography scale (font family, sizes, weights, line heights), spacing scale, border radius values, shadow values, transition durations. Migrate the POC's existing Tailwind theme configuration as a starting point. Ensure tokens work in both light and dark mode (if dark mode is in scope; confirm with Product Owner). This provides the foundation for consistent UI across all Sprint 1+ features. |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-SCF-001, SZ-UI-001 |
| **Owner** | Lead Engineer (UX Designer when available) |
| **Definition of Done** | Design tokens defined in Tailwind config; all shadcn/ui components use tokens (not hardcoded values); a design token reference page exists (or Storybook stories demonstrate tokens) |
| **Status** | Not Started |

---

#### SZ-UI-003: Component Documentation (Storybook or Similar)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-UI-003 |
| **Title** | Component Documentation (Storybook or Similar) |
| **Description** | Set up Storybook (or a similar component documentation tool) to catalog all UI components. Create stories for each migrated shadcn/ui component showing: default state, variants (size, color), interactive states (hover, focus, disabled), and composition examples. This serves as the design system reference for the UX Designer (TBC) and any additional developers who join. Include accessibility annotations. Configure Storybook to use the same Tailwind configuration as the main app. |
| **Priority** | P2 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-UI-001, SZ-UI-002 |
| **Owner** | Lead Engineer (UX Designer when available) |
| **Definition of Done** | Storybook runs via `npm run storybook`; at least 10 core components have stories; Storybook uses production Tailwind config; accessible via a deployed URL (optional for Sprint Zero) |
| **Status** | Not Started |

---

#### SZ-UI-004: Responsive Layout Foundation

| Field | Value |
|-------|-------|
| **Task ID** | SZ-UI-004 |
| **Title** | Responsive Layout Foundation |
| **Description** | Create the production application shell layout: sidebar navigation (collapsible), top header bar (user profile, notifications, role indicator), main content area. Implement responsive behavior: full sidebar on 1280px+, collapsed sidebar on 1024-1279px. This is the layout that all Collectoid pages will render within. Breakpoint: 1024px minimum as per NFR-ACC-005 from `02-business-requirements.md`. Migrate layout patterns from the POC where validated. |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-UI-001, SZ-UI-002, SZ-AUTH-002 (for user profile display) |
| **Owner** | Lead Engineer |
| **Definition of Done** | Application shell renders with sidebar, header, and content area; sidebar collapses at breakpoint; user name and role displayed in header; navigation links match route structure from `01-architecture-overview.md` Section 4 |
| **Status** | Not Started |

---

#### SZ-UI-005: Accessibility Baseline (axe-core Integration)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-UI-005 |
| **Title** | Accessibility Baseline (axe-core Integration) |
| **Description** | Integrate axe-core for automated accessibility testing. Install `@axe-core/react` for development-time a11y checks (renders violations in browser console). Configure `eslint-plugin-jsx-a11y` (part of SZ-SCF-003) to catch accessibility issues at lint time. Add axe-core checks to the Playwright E2E test suite (SZ-TST-003) to catch regressions. Target: WCAG 2.1 Level AA compliance as per NFR-ACC-001 from `02-business-requirements.md`. Verify all migrated shadcn/ui components pass axe checks. |
| **Priority** | P1 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-UI-001, SZ-SCF-003, SZ-TST-003 |
| **Owner** | Lead Engineer |
| **Definition of Done** | axe-core violations shown in browser console during development; no critical or serious accessibility violations in migrated components; Playwright tests include axe checks; jsx-a11y ESLint rules enforced |
| **Status** | Not Started |

---

#### SZ-UI-006: Loading, Error, and Empty State Patterns

| Field | Value |
|-------|-------|
| **Task ID** | SZ-UI-006 |
| **Title** | Loading, Error, and Empty State Patterns |
| **Description** | Create reusable components for the three universal UI states: (1) Loading: skeleton loaders for cards, tables, and detail pages; spinner for inline loading. (2) Error: error boundary component with retry button; inline error message for form fields; full-page error for API failures. (3) Empty: empty state illustration with call-to-action (e.g., "No collections found. Create your first collection."). These patterns must be consistent across all Collectoid pages. Use React Suspense boundaries for loading states where appropriate. Implement a global error boundary wrapping the application. |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-UI-001, SZ-UI-002 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Loading skeleton component exists and is demonstrated; error boundary catches and displays errors gracefully; empty state component exists with configurable message and action; all three patterns documented (in Storybook if available) |
| **Status** | Not Started |

---

### 2.7 Monitoring & Observability

#### SZ-MON-001: CloudWatch Log Groups and Structured Logging Setup

| Field | Value |
|-------|-------|
| **Task ID** | SZ-MON-001 |
| **Title** | CloudWatch Log Groups and Structured Logging Setup |
| **Description** | Install and configure Pino as the structured JSON logger (recommended in `01-architecture-overview.md` Section 11). Configure log output format matching the architecture doc: `level`, `timestamp`, `requestId`, `correlationId`, `userId`, `method`, `path`, `statusCode`, `durationMs`, `message`. Create CloudWatch log groups: `/collectoid/dev/application`, `/collectoid/dev/access`. Configure log retention (30 days for dev, 90 days for staging, 365 days for prod). Implement request logging middleware that attaches `requestId` and `correlationId` to every request context. Ensure PII (email addresses, user names) is NOT logged in production (sanitize middleware). |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-SCF-001, SZ-INF-002 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Every API request produces a structured JSON log entry; logs appear in CloudWatch within 60 seconds; requestId is consistent across all log entries for a single request; no PII in log output; log levels configurable via environment variable |
| **Status** | Not Started |

---

#### SZ-MON-002: Error Tracking (Sentry) Integration

| Field | Value |
|-------|-------|
| **Task ID** | SZ-MON-002 |
| **Title** | Error Tracking (Sentry) Integration |
| **Description** | Integrate Sentry for error tracking. Confirm with AZ InfoSec whether Sentry is approved (QUESTION from `01-architecture-overview.md` Section 11). If Sentry is approved: install `@sentry/nextjs`, configure for both server-side and client-side error capture, upload source maps at build time, configure environment tagging. If Sentry is not approved: implement basic error tracking via CloudWatch Logs and alarms on error patterns. Regardless: implement React error boundaries that report errors and display user-friendly fallback UI. |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-SCF-001, SZ-INF-008 (for source map upload in CI) |
| **Owner** | Lead Engineer |
| **Definition of Done** | Unhandled exceptions are captured and surfaced (in Sentry or CloudWatch); source maps enable readable stack traces; error boundaries prevent full-page crashes; error tracking works in both server and client contexts |
| **Status** | Not Started |

---

#### SZ-MON-003: Health Check Endpoint

| Field | Value |
|-------|-------|
| **Task ID** | SZ-MON-003 |
| **Title** | Health Check Endpoint (/api/health) |
| **Description** | Implement the health check endpoint as specified in `01-architecture-overview.md` Section 11. `GET /api/health` returns: `status` (healthy/degraded/unhealthy), `timestamp`, `version` (from package.json), `uptime`, and `checks` object with status and latency for each dependency: database (Aurora), cache (Redis), and external APIs (AZCT, Collibra, Immuta, Cornerstone -- degrade gracefully if not yet configured). Rules: if database is unhealthy, overall status is "unhealthy" (ALB will restart task); if any external service is unhealthy, overall status is "degraded" (task stays running). Exclude from authentication middleware (SZ-AUTH-005). Configure ALB health check to hit this endpoint every 30 seconds. |
| **Priority** | P0 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-SCF-001, SZ-INF-004, SZ-INF-005 |
| **Owner** | Lead Engineer |
| **Definition of Done** | `/api/health` returns JSON with dependency status; ALB health check passes; endpoint is publicly accessible (no auth); database connectivity failure changes status to "unhealthy"; response time < 500ms |
| **Status** | Not Started |

---

#### SZ-MON-004: Basic Alerting Configuration

| Field | Value |
|-------|-------|
| **Task ID** | SZ-MON-004 |
| **Title** | Basic Alerting Configuration |
| **Description** | Create CloudWatch alarms for the critical metrics defined in `01-architecture-overview.md` Section 11: (1) API error rate (5xx) > 1% for 5 minutes. (2) API response time (p95) > 2000ms for 5 minutes. (3) ECS task unhealthy (any task fails health check). (4) SQS DLQ depth > 0 messages. (5) Database connections > 80% pool utilization. Configure alarm actions to send notifications via SNS to a team email distribution list (or Slack webhook if available). For Sprint Zero, email alerting is sufficient. PagerDuty integration can be added when prod goes live. |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-INF-002, SZ-INF-004, SZ-INF-005, SZ-INF-006, SZ-MON-003 |
| **Owner** | Lead Engineer |
| **Definition of Done** | All 5 alarms created in CloudWatch; test alarm triggers successfully; notification received via email; alarm dashboard visible in CloudWatch console |
| **Status** | Not Started |

---

#### SZ-MON-005: Performance Baseline (Lighthouse CI)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-MON-005 |
| **Title** | Performance Baseline (Lighthouse CI) |
| **Description** | Set up Lighthouse CI to run on every PR as part of the CI pipeline (SZ-INF-008). Configure performance budgets based on NFR-PERF-001 from `02-business-requirements.md`: page load < 3 seconds, Time to Interactive < 5 seconds. Create Lighthouse configuration targeting the login page, collections browser, and collection detail page. Store baseline scores. Fail PRs that degrade performance below thresholds. This ensures that performance remains acceptable as features are added in Sprint 1+. |
| **Priority** | P2 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-INF-008, SZ-SCF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Lighthouse CI runs on PRs; baseline scores established for at least 2 pages; performance regression fails the PR check; scores visible in PR comments |
| **Status** | Not Started |

---

### 2.8 Testing Foundation

#### SZ-TST-001: Vitest Configuration with Coverage

| Field | Value |
|-------|-------|
| **Task ID** | SZ-TST-001 |
| **Title** | Vitest Configuration with Coverage |
| **Description** | Install and configure Vitest as the unit and integration test runner. Configure: TypeScript support, path alias resolution (matching `tsconfig.json`), coverage via `v8` provider, coverage thresholds (start with 50% for Sprint Zero, increase to 80% as codebase grows). Create npm scripts: `test` (run all tests), `test:watch` (watch mode), `test:coverage` (with coverage report). Configure coverage to exclude: `node_modules`, `.next`, test files, type definitions, configuration files. Create at least one example test demonstrating the testing pattern for: a utility function, a tRPC procedure, and a React component. |
| **Priority** | P0 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-SCF-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | `npm test` runs and passes; `npm run test:coverage` generates a coverage report; example tests exist for utility, tRPC procedure, and React component; coverage thresholds configured |
| **Status** | Not Started |

---

#### SZ-TST-002: React Testing Library Setup

| Field | Value |
|-------|-------|
| **Task ID** | SZ-TST-002 |
| **Title** | React Testing Library Setup |
| **Description** | Install and configure React Testing Library for component testing within Vitest. Install: `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`. Configure `vitest.setup.ts` to extend expect with jest-dom matchers. Configure the testing environment to use `jsdom`. Create test utilities: `renderWithProviders()` that wraps components in necessary providers (QueryClientProvider, SessionProvider, etc.). Create at least one component test demonstrating: rendering, user interaction, and assertion patterns. |
| **Priority** | P0 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | SZ-TST-001, SZ-SCF-005 |
| **Owner** | Lead Engineer |
| **Definition of Done** | React Testing Library installed; `renderWithProviders` utility works; example component test renders a component, simulates user interaction, and asserts on the result; jest-dom matchers available |
| **Status** | Not Started |

---

#### SZ-TST-003: Playwright E2E Setup with Critical Path Tests

| Field | Value |
|-------|-------|
| **Task ID** | SZ-TST-003 |
| **Title** | Playwright E2E Setup with Critical Path Tests |
| **Description** | Install and configure Playwright for end-to-end testing. Configure browsers: Chromium (primary), Firefox (secondary). Set up test fixtures: authenticated user session (bypass Azure AD login for E2E tests using a test session cookie or Auth.js test adapter). Create critical path tests: (1) Login flow (user can sign in and see dashboard). (2) Navigation (sidebar links navigate to correct pages). (3) Health check endpoint returns 200. Configure Playwright to run in CI (SZ-INF-008) in headless mode. Store test results and screenshots as CI artifacts. |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-SCF-001, SZ-AUTH-002, SZ-INF-008 |
| **Owner** | Lead Engineer |
| **Definition of Done** | `npm run test:e2e` runs Playwright tests; at least 3 critical path tests pass; tests run in CI on PRs; authenticated session fixture works; test failure screenshots saved as artifacts |
| **Status** | Not Started |

---

#### SZ-TST-004: Test Data Fixtures and Factories

| Field | Value |
|-------|-------|
| **Task ID** | SZ-TST-004 |
| **Title** | Test Data Fixtures and Factories |
| **Description** | Create test data factories for generating realistic test data for each core entity. Use a factory pattern (e.g., using `fishery` or custom builders): `createUser()`, `createCollection()`, `createDataset()`, `createAccessRequest()`, `createApproval()`, `createAuditEvent()`. Factories should generate valid data that satisfies all database constraints and Zod schemas. Support overrides for specific fields. Create fixtures: `fixtures/users.ts` (sample users with different roles), `fixtures/collections.ts` (sample collections in different statuses). These will be used by both Vitest unit tests and Playwright E2E tests. |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-DB-002, SZ-SCF-006 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Factories exist for all core entities; generated data satisfies Zod schemas; factory output can be inserted into the database without constraint violations; at least one test uses factories |
| **Status** | Not Started |

---

#### SZ-TST-005: CI Integration (Tests Run on Every PR)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-TST-005 |
| **Title** | CI Integration (Tests Run on Every PR) |
| **Description** | Ensure the CI pipeline (SZ-INF-008) runs the full test suite on every PR. Pipeline steps: (1) `npm ci` (install). (2) `npm run lint` (ESLint). (3) `npx tsc --noEmit` (type check). (4) `npm run test:coverage` (Vitest with coverage). (5) `npm run build` (Next.js build). (6) `npm run test:e2e` (Playwright, if feasible in CI without deployed env; otherwise, run against build preview). Fail the PR if any step fails. Display coverage report as a PR comment (optional). Display test results in PR checks. |
| **Priority** | P0 |
| **Effort** | S (0.5-1 day) -- mostly configuration of SZ-INF-008 |
| **Dependencies** | SZ-INF-008, SZ-TST-001, SZ-TST-002, SZ-TST-003, SZ-SCF-003 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Every PR triggers the full pipeline; lint, type-check, tests, and build all run; failures block merge; test results visible in PR checks |
| **Status** | Not Started |

---

#### SZ-TST-006: Mock Server for External APIs (MSW)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-TST-006 |
| **Title** | Mock Server for External APIs (MSW) |
| **Description** | Install and configure MSW (Mock Service Worker) to intercept external API calls during testing and local development. Create mock handlers for: (1) AZCT API -- return sample study data matching the expected response schema. (2) Azure AD Graph API -- return sample user profile and group membership. (3) Cornerstone API -- return sample training status. MSW runs in the browser (for Storybook/component tests) and in Node.js (for Vitest integration tests). This decouples development from external API availability and enables testing of error scenarios (timeout, 500, rate limit). |
| **Priority** | P1 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-SCF-001, SZ-EXT-001 (need to know response schemas) |
| **Owner** | Lead Engineer |
| **Definition of Done** | MSW installed; mock handlers exist for AZCT, Azure AD Graph, and Cornerstone; tests can run without external API access; mock handlers return realistic data matching API schemas; error scenarios (500, timeout) are mockable |
| **Status** | Not Started |

---

### 2.9 Documentation & Onboarding

#### SZ-DOC-001: Developer Setup Guide (README)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DOC-001 |
| **Title** | Developer Setup Guide (README) |
| **Description** | Write a comprehensive README.md covering: (1) Prerequisites (Node.js 20, Docker, AWS CLI, Azure AD access). (2) Clone and install instructions. (3) Environment variable setup (reference `.env.example`). (4) Local database setup (Docker Compose for PostgreSQL and Redis, or connection to dev Aurora/ElastiCache). (5) Running the app (`npm run dev`). (6) Running tests (`npm test`, `npm run test:e2e`). (7) Building and deploying (`npm run build`, Docker build, ECS deployment). (8) Project structure overview (reference directory structure from SZ-SCF-007). (9) Troubleshooting common issues. The goal: a new developer (including the TBC Tech Lead) should be able to set up their environment in under 1 hour. |
| **Priority** | P0 |
| **Effort** | M (2-3 days) |
| **Dependencies** | All SZ-SCF tasks, SZ-AUTH-002, SZ-DB-002 |
| **Owner** | Lead Engineer |
| **Definition of Done** | README exists and is comprehensive; a team member who did not write it can follow it to set up their environment; all commands work as documented; includes Docker Compose file for local PostgreSQL and Redis |
| **Status** | Not Started |

---

#### SZ-DOC-002: Architecture Overview for New Team Members

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DOC-002 |
| **Title** | Architecture Overview for New Team Members |
| **Description** | Create a concise (2-3 page) architecture guide that summarizes the production architecture for onboarding. Reference the full sprint-zero docs but provide a digestible overview: system context (what Collectoid does, who uses it), technology stack, deployment topology (simplified), key architectural decisions (why Next.js, why Aurora PostgreSQL, why tRPC), data flow (how a request flows through the system), and where to find detailed documentation. This is distinct from `01-architecture-overview.md` in that it is written for onboarding, not for architecture review. |
| **Priority** | P2 |
| **Effort** | S (0.5-1 day) |
| **Dependencies** | All sprint-zero docs exist |
| **Owner** | Lead Engineer |
| **Definition of Done** | Architecture onboarding guide exists; covers all listed topics; can be read in under 15 minutes; references sprint-zero docs for deeper detail |
| **Status** | Not Started |

---

#### SZ-DOC-003: Contribution Guidelines

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DOC-003 |
| **Title** | Contribution Guidelines (PR Process, Code Review) |
| **Description** | Create `CONTRIBUTING.md` documenting: (1) Branch naming convention (from SZ-SCF-008). (2) Commit message convention (Conventional Commits). (3) PR process (create branch, make changes, open PR, fill template, request review, address feedback, merge). (4) Code review expectations (all PRs need 1 review; review within 24 hours; focus on correctness, readability, test coverage). (5) Definition of Done for a PR (lint passes, types check, tests pass, no regressions, documentation updated if needed). (6) How to run the full CI checks locally before pushing. |
| **Priority** | P1 |
| **Effort** | S (0.5 day) |
| **Dependencies** | SZ-SCF-008 |
| **Owner** | Lead Engineer |
| **Definition of Done** | CONTRIBUTING.md committed; covers all listed topics; referenced from README |
| **Status** | Not Started |

---

#### SZ-DOC-004: Environment Variable Documentation

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DOC-004 |
| **Title** | Environment Variable Documentation |
| **Description** | Create comprehensive documentation of all environment variables. For each variable, document: name, description, required (yes/no), default value (if any), where to obtain it (e.g., "Azure AD app registration" or "AWS Secrets Manager"), which environments it applies to (local/dev/staging/prod), and example value. This goes beyond `.env.example` by providing operational context. Document the secret rotation procedure for production credentials. |
| **Priority** | P1 |
| **Effort** | S (0.5 day) |
| **Dependencies** | SZ-INF-009, SZ-AUTH-001 |
| **Owner** | Lead Engineer |
| **Definition of Done** | Every environment variable is documented with all listed fields; secret rotation procedure documented; document is findable from README |
| **Status** | Not Started |

---

#### SZ-DOC-005: API Documentation Tooling

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DOC-005 |
| **Title** | API Documentation Tooling |
| **Description** | Set up automated API documentation generation from the tRPC router (SZ-SCF-004). Options: (1) Use `trpc-openapi` to generate OpenAPI spec from tRPC routers, then serve via Swagger UI. (2) Use tRPC Panel for interactive API exploration in dev. (3) Manual OpenAPI spec maintained alongside code. Whichever approach, ensure that API consumers (if any external to the team) can discover available endpoints, input schemas (from Zod), and response shapes without reading source code. |
| **Priority** | P2 |
| **Effort** | M (2-3 days) |
| **Dependencies** | SZ-SCF-004, SZ-SCF-006 |
| **Owner** | Lead Engineer |
| **Definition of Done** | API documentation accessible via a URL (dev only); all tRPC procedures listed with input/output schemas; documentation updates automatically when routers change |
| **Status** | Not Started |

---

#### SZ-DOC-006: Decision Log (Link to Technical Decisions)

| Field | Value |
|-------|-------|
| **Task ID** | SZ-DOC-006 |
| **Title** | Decision Log |
| **Description** | Create a decision log document or section in the README that records all significant technical decisions made during Sprint Zero. For each decision: date, decision, alternatives considered, rationale, and who made it. Key decisions to record: database choice (Aurora PostgreSQL), ORM choice (Drizzle), API pattern (tRPC), auth approach (Auth.js v5), testing framework (Vitest + Playwright), POC migration approach (migrate vs. rewrite). Link to `01-architecture-overview.md` for architectural decisions. This ensures that future team members understand why things were built the way they were. |
| **Priority** | P2 |
| **Effort** | S (0.5 day) |
| **Dependencies** | None |
| **Owner** | Lead Engineer |
| **Definition of Done** | Decision log exists with at least 6 recorded decisions; each decision includes date, choice, alternatives, and rationale; referenced from README |
| **Status** | Not Started |

---

## 3. Dependency Graph

The following diagram shows task dependencies. An arrow from A to B means "A must be completed before B can start." Tasks without incoming arrows can start immediately.

```
LEGEND:  [TASK-ID] -----> [DEPENDENT-TASK-ID]
         (task)            (depends on task)

=== LAYER 0: No Dependencies (Start Immediately) ===

SZ-SCF-001 (Next.js project setup)
SZ-INF-001 (AWS account + VPC)
SZ-AUTH-001 (Azure AD app registration)
SZ-EXT-001 (AZCT API: obtain docs/credentials)
SZ-EXT-004 (Cornerstone API: obtain docs)
SZ-EXT-006 (Collibra 2.0: confirm timeline)
SZ-EXT-007 (Immuta: obtain docs)
SZ-EXT-009 (Consumption envs: inventory)
SZ-INF-010 (Domain/DNS/SSL)
SZ-DOC-006 (Decision log)


=== LAYER 1: Depends on Layer 0 ===

SZ-SCF-001 -----> SZ-SCF-002 (TypeScript config)
SZ-SCF-001 -----> SZ-SCF-003 (ESLint/Prettier)
SZ-SCF-001 -----> SZ-SCF-007 (Directory structure)
SZ-SCF-001 -----> SZ-SCF-008 (PR template/conventions)
SZ-SCF-001 -----> SZ-TST-001 (Vitest config)
SZ-SCF-001 -----> SZ-UI-001 (Migrate shadcn/ui)
SZ-SCF-001 -----> SZ-MON-001 (Structured logging)

SZ-INF-001 -----> SZ-INF-002 (ECS cluster)
SZ-INF-001 -----> SZ-INF-004 (Aurora PostgreSQL)
SZ-INF-001 -----> SZ-INF-005 (ElastiCache Redis)
SZ-INF-001 -----> SZ-INF-006 (SQS/SNS)
SZ-INF-001 -----> SZ-INF-007 (ECR)
SZ-INF-001 -----> SZ-INF-011 (IAM roles)

SZ-AUTH-001 -----> SZ-AUTH-002 (Auth.js integration)

SZ-EXT-001 -----> SZ-EXT-002 (AZCT client implementation)
SZ-EXT-004 -----> SZ-EXT-005 (Cornerstone user ID mapping)


=== LAYER 2: Depends on Layer 1 ===

SZ-INF-002 + SZ-INF-007 + SZ-SCF-001 -----> SZ-INF-008 (CI/CD pipeline)
SZ-INF-002 + SZ-INF-004 + SZ-INF-005 -----> SZ-INF-009 (Env config)
SZ-INF-001 + SZ-INF-010 -----> SZ-INF-003 (ALB + CloudFront)

SZ-SCF-001 + SZ-AUTH-001 -----> SZ-AUTH-002 (Auth.js integration)
SZ-AUTH-002 -----> SZ-AUTH-005 (Middleware protection)
SZ-AUTH-002 -----> SZ-AUTH-006 (Login/logout flow)

SZ-INF-004 + SZ-SCF-001 -----> SZ-DB-002 (Drizzle ORM setup)

SZ-SCF-001 + SZ-SCF-004 -----> SZ-SCF-006 (Zod schemas)
SZ-SCF-001 + SZ-AUTH-002 -----> SZ-SCF-004 (tRPC setup)
SZ-SCF-001 + SZ-SCF-004 -----> SZ-SCF-005 (React Query)

SZ-TST-001 -----> SZ-TST-002 (React Testing Library)

SZ-UI-001 -----> SZ-UI-002 (Design tokens)


=== LAYER 3: Depends on Layer 2 ===

SZ-AUTH-002 + SZ-INF-005 -----> SZ-AUTH-003 (Redis sessions)
SZ-AUTH-003 + SZ-AUTH-005 -----> SZ-AUTH-006 (Login/logout E2E)
SZ-AUTH-002 + SZ-DB-001 -----> SZ-AUTH-004 (Role mapping)
SZ-AUTH-004 + SZ-DB-001 -----> SZ-AUTH-007 (RBAC matrix)

SZ-DB-002 + SZ-INF-004 -----> SZ-DB-001 (Schema creation)
SZ-DB-001 -----> SZ-DB-003 (Seed data)
SZ-DB-001 -----> SZ-DB-004 (Audit immutability)
SZ-DB-001 -----> SZ-DB-005 (Indexes)
SZ-INF-004 -----> SZ-DB-006 (Backup config)

SZ-EXT-002 + SZ-DB-001 + SZ-INF-006 -----> SZ-EXT-003 (AZCT batch sync)
SZ-DB-001 -----> SZ-EXT-008 (Approval workflow: design state machine)

SZ-SCF-001 + SZ-SCF-006 -----> SZ-SCF-009 (.env management)

SZ-INF-008 + SZ-TST-001 + SZ-TST-002 + SZ-TST-003 -----> SZ-TST-005 (CI test integration)
SZ-DB-002 + SZ-SCF-006 -----> SZ-TST-004 (Test fixtures)
SZ-SCF-001 + SZ-AUTH-002 -----> SZ-TST-003 (Playwright E2E)

SZ-UI-001 + SZ-UI-002 -----> SZ-UI-003 (Storybook)
SZ-UI-001 + SZ-UI-002 + SZ-AUTH-002 -----> SZ-UI-004 (Layout foundation)
SZ-UI-001 + SZ-UI-002 -----> SZ-UI-006 (Loading/error/empty states)
SZ-UI-001 + SZ-SCF-003 + SZ-TST-003 -----> SZ-UI-005 (Accessibility)

SZ-INF-002 + SZ-INF-004 + SZ-INF-005 + SZ-MON-003 -----> SZ-MON-004 (Alerting)
SZ-SCF-001 + SZ-INF-008 -----> SZ-MON-005 (Lighthouse CI)
SZ-SCF-001 + SZ-INF-008 -----> SZ-MON-002 (Sentry)

All SZ-SCF + SZ-AUTH-002 + SZ-DB-002 -----> SZ-DOC-001 (README)
SZ-SCF-008 -----> SZ-DOC-003 (Contributing guidelines)
SZ-INF-009 + SZ-AUTH-001 -----> SZ-DOC-004 (Env var docs)
SZ-SCF-004 + SZ-SCF-006 -----> SZ-DOC-005 (API docs)
```

### Critical Path

The longest dependency chain determines Sprint Zero's minimum duration:

```
SZ-INF-001 (VPC) --> SZ-INF-004 (Aurora) --> SZ-DB-002 (Drizzle) --> SZ-DB-001 (Schema)
    --> SZ-DB-003 (Seed Data) --> SZ-AUTH-004 (Role Mapping) --> SZ-AUTH-007 (RBAC)

Parallel critical path:
SZ-SCF-001 (Project) --> SZ-AUTH-002 (Auth.js) --> SZ-AUTH-003 (Redis Sessions)
    --> SZ-AUTH-006 (Login E2E) --> SZ-INF-008 (CI/CD) --> SZ-TST-005 (CI Tests)
```

Both paths are approximately 4-5 weeks at 0.5 FTE, confirming the 6-week timeline estimate with buffer.

---

## 4. Suggested Timeline

### Week 1: Foundation (Days 1-5)

**Theme:** Get the project started and request all external access.

| Day | Tasks | Priority |
|-----|-------|----------|
| 1-2 | SZ-SCF-001: Initialize Next.js project (or migrate from POC) | P0 |
| 1-2 | SZ-INF-001: Request AWS account access, start VPC provisioning | P0 |
| 1 | SZ-AUTH-001: Submit Azure AD app registration request | P0 |
| 1 | SZ-EXT-001: Contact AZCT team for API docs and credentials | P0 |
| 1 | SZ-EXT-004: Contact Cornerstone team for API docs | P1 |
| 1 | SZ-EXT-006: Contact Collibra team for timeline | P2 |
| 1 | SZ-EXT-007: Contact Immuta team for API docs | P2 |
| 3 | SZ-SCF-002: TypeScript strict mode configuration | P0 |
| 3 | SZ-SCF-003: ESLint + Prettier configuration | P0 |
| 3-4 | SZ-SCF-007: Directory structure | P0 |
| 4-5 | SZ-SCF-008: PR template and conventions | P1 |
| 5 | SZ-DOC-006: Start decision log | P2 |

**Week 1 Milestone:** Project repo exists, builds locally, coding standards enforced.

### Week 2: Infrastructure + Auth (Days 6-10)

**Theme:** Get the app running in AWS with authentication.

| Day | Tasks | Priority |
|-----|-------|----------|
| 6-7 | SZ-INF-002: ECS cluster + Fargate task definition | P0 |
| 6-7 | SZ-INF-004: Aurora PostgreSQL provisioning (dev) | P0 |
| 6 | SZ-INF-005: ElastiCache Redis provisioning | P0 |
| 6 | SZ-INF-007: ECR repository | P0 |
| 7-8 | SZ-INF-011: IAM roles and policies | P0 |
| 8-9 | SZ-AUTH-002: Auth.js v5 integration (local dev first) | P0 |
| 9-10 | SZ-AUTH-005: Middleware protection | P0 |
| 10 | SZ-INF-009: Environment configuration + Secrets Manager | P0 |

**Week 2 Milestone:** First deployment to dev; login via Azure AD works locally.

### Week 3: Database + CI/CD (Days 11-15)

**Theme:** Get the data layer and pipeline operational.

| Day | Tasks | Priority |
|-----|-------|----------|
| 11-12 | SZ-DB-002: Drizzle ORM setup with schema definitions | P0 |
| 12-14 | SZ-DB-001: Schema creation (run migrations against Aurora) | P0 |
| 14 | SZ-DB-004: Audit immutability triggers | P0 |
| 14-15 | SZ-DB-005: Index creation | P1 |
| 11-15 | SZ-INF-008: CI/CD pipeline (GitHub Actions) | P0 |
| 15 | SZ-AUTH-003: Redis session management | P0 |

**Week 3 Milestone:** Database schema deployed; CI pipeline running on PRs; sessions in Redis.

### Week 4: API Layer + External APIs (Days 16-20)

**Theme:** Connect the pieces -- tRPC, external APIs, login flow complete.

| Day | Tasks | Priority |
|-----|-------|----------|
| 16-17 | SZ-SCF-004: tRPC setup with router structure | P0 |
| 17 | SZ-SCF-005: React Query provider | P0 |
| 17-18 | SZ-SCF-006: Zod validation schemas | P0 |
| 18-19 | SZ-AUTH-004: Role mapping from Azure AD groups | P1 |
| 19-20 | SZ-AUTH-006: Login/logout flow E2E | P0 |
| 16-18 | SZ-EXT-002: AZCT client implementation (if docs received) | P1 |
| 20 | SZ-MON-003: Health check endpoint | P0 |
| 20 | SZ-SCF-009: .env management finalization | P0 |

**Week 4 Milestone:** tRPC API working; AZCT data retrievable; complete auth flow.

### Week 5: Testing + Monitoring + UI (Days 21-25)

**Theme:** Quality foundations and visual baseline.

| Day | Tasks | Priority |
|-----|-------|----------|
| 21 | SZ-TST-001: Vitest configuration | P0 |
| 21 | SZ-TST-002: React Testing Library setup | P0 |
| 22-23 | SZ-TST-003: Playwright E2E setup | P1 |
| 23-24 | SZ-TST-004: Test data fixtures and factories | P1 |
| 24 | SZ-TST-005: CI test integration | P0 |
| 21-22 | SZ-MON-001: Structured logging (Pino + CloudWatch) | P0 |
| 23 | SZ-MON-004: Basic alerting | P1 |
| 23-25 | SZ-UI-001: Migrate shadcn/ui components | P1 |
| 25 | SZ-UI-002: Design tokens | P1 |

**Week 5 Milestone:** Tests running in CI; logs in CloudWatch; UI components migrated.

### Week 6: Polish + Documentation + Exit (Days 26-30)

**Theme:** Tie up loose ends and verify exit criteria.

| Day | Tasks | Priority |
|-----|-------|----------|
| 26-27 | SZ-UI-004: Responsive layout foundation | P1 |
| 26 | SZ-UI-006: Loading/error/empty state patterns | P1 |
| 26 | SZ-UI-005: Accessibility baseline | P1 |
| 27-28 | SZ-DB-003: Seed data scripts | P1 |
| 28 | SZ-DB-006: Backup configuration | P1 |
| 28 | SZ-AUTH-007: RBAC permission matrix (start) | P1 |
| 28-29 | SZ-DOC-001: Developer setup guide (README) | P0 |
| 29 | SZ-DOC-003: Contribution guidelines | P1 |
| 29 | SZ-DOC-004: Environment variable documentation | P1 |
| 30 | Exit criteria verification | P0 |
| 30 | SZ-INF-003: ALB + CloudFront (if DNS ready) | P1 |
| 30 | SZ-INF-012: Terraform IaC (ongoing, formalize) | P1 |

**Week 6 Milestone:** Sprint Zero complete. Exit criteria met. Sprint 1 begins.

### Overflow to Sprint 1 (Expected)

The following P1/P2 tasks are likely to overflow into the first Sprint 1 iteration:

- SZ-INF-012: Terraform IaC formalization (XL effort)
- SZ-AUTH-007: RBAC permission matrix (L effort, ongoing refinement)
- SZ-EXT-003: AZCT batch sync test
- SZ-INF-006: SQS/SNS (needed for Q2, not Q1 MVP)
- SZ-MON-002: Sentry integration
- SZ-MON-005: Lighthouse CI
- SZ-TST-006: MSW mock server
- SZ-UI-003: Storybook
- SZ-DOC-002: Architecture onboarding guide
- SZ-DOC-005: API documentation tooling
- SZ-DOC-006: Decision log (ongoing)

---

## 5. Risks & Blockers

### 5.1 Blocking Risks (Could Prevent Sprint Zero Completion)

| Risk | Impact | Mitigation | Escalation |
|------|--------|------------|------------|
| **AWS account access delayed** -- AZ cloud provisioning process may take weeks | Blocks ALL infrastructure tasks (SZ-INF-*) | Submit request Day 1; escalate through Cayetana (PM) if no response within 3 business days; use personal AWS sandbox as stopgap | WP4 Lead (Jamie MacPherson) |
| **Azure AD app registration delayed** -- Identity Services may have long queue | Blocks ALL authentication tasks (SZ-AUTH-*) | Submit request Day 1; escalate through Cayetana; use mock auth (simple session cookie) for local development until approved | WP4 Lead |
| **Aurora PostgreSQL not approved** -- Cloud Engineering may mandate a different database (RISK-T-001 from `06-risk-register.md`) | Requires redesign of data layer and ORM configuration | Resolve QUESTION-001 in Week 1; `03-data-model.md` already has DocumentDB alternative schema | Cloud Engineering team |
| **AZCT API access denied or delayed** -- AZCT team may not provide sandbox access in time | Blocks external API integration (SZ-EXT-001, 002, 003); does not block Sprint 1 MVP if mock data suffices | Contact AZCT team Day 1; use MSW mocks as fallback; escalate through Product Owner (Divya) | AZCT team leadership |
| **Team capacity insufficient** -- Keith at 0.5 FTE may not complete all P0 tasks in 6 weeks (RISK-O-002 from `06-risk-register.md`, score 20 = Critical) | Sprint Zero extends beyond 6 weeks; Sprint 1 start delayed | Ruthlessly prioritize P0 tasks; defer P1/P2; request temporary engineering support from WP4 | WP4 Lead |

### 5.2 High Risks (Could Delay Sprint Zero)

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Tech Lead not assigned during Sprint Zero** (RISK-O-003, score 20) | Architecture decisions made by single engineer; review quality reduced | Document all decisions in decision log; request peer review from Sherlock engineering |
| **VPC peering/PrivateLink not configured** | External APIs unreachable from VPC; integration testing blocked | Identify networking requirements in Week 1; work with Cloud Engineering on peering |
| **CI/CD pipeline blocked by AZ GitHub restrictions** | Cannot automate builds; manual deployment only | Confirm GitHub Actions permissions Day 1; fall back to local Docker build + manual ECS deploy |
| **POC-to-production migration harder than expected** (RISK-T-007, score 16) | Project setup takes longer; scaffolding tasks delayed | Assess migration feasibility in Week 1 (SZ-SCF-001); if risky, scaffold fresh and cherry-pick components |
| **External teams unresponsive** (AZCT, Cornerstone, Immuta, Identity Services) | Integration tasks blocked; must proceed with mocks | Send all external requests in Week 1; follow up in Week 2; escalate in Week 3 |

### 5.3 Assumptions That May Prove False

| Assumption | If False | Impact |
|------------|----------|--------|
| GitHub Actions is the approved CI/CD tool | Must use CodePipeline or Jenkins | 2-3 day rework on SZ-INF-008 |
| Drizzle ORM works well with Aurora PostgreSQL JSONB | ORM may need to be swapped to Prisma | 2-3 day rework on SZ-DB-002 |
| Auth.js v5 Azure AD provider is stable | May need custom OIDC implementation | 3-5 day rework on SZ-AUTH-002 |
| AZ allows Sentry for error tracking | Must build custom error tracking | 1-2 day rework on SZ-MON-002 |
| Docker Hub / npm registry accessible from AZ network | Must use internal mirrors | 1-2 day investigation |

---

## 6. Exit Criteria

Sprint Zero is complete and Sprint 1 can begin when ALL of the following criteria are satisfied. Each criterion maps to specific tasks that deliver it.

### 6.1 Infrastructure

- [ ] AWS VPC provisioned with public, private, and data subnets (SZ-INF-001)
- [ ] ECS Fargate service running Next.js application in dev environment (SZ-INF-002)
- [ ] Aurora PostgreSQL accessible from ECS tasks with application user (SZ-INF-004)
- [ ] ElastiCache Redis accessible from ECS tasks (SZ-INF-005)
- [ ] ECR repository exists and accepts Docker image pushes (SZ-INF-007)
- [ ] IAM roles configured with least-privilege policies (SZ-INF-011)
- [ ] Environment secrets stored in Secrets Manager and injected into ECS tasks (SZ-INF-009)

### 6.2 Authentication

- [ ] Azure AD app registration complete with required permissions (SZ-AUTH-001)
- [ ] User can log in via Azure AD and see their profile in the application (SZ-AUTH-002, SZ-AUTH-006)
- [ ] Sessions stored in Redis and shared across ECS tasks (SZ-AUTH-003)
- [ ] All `/collectoid/*` routes are protected; unauthenticated users redirected to login (SZ-AUTH-005)
- [ ] Logout clears session and redirects to confirmation page (SZ-AUTH-006)

### 6.3 Database

- [ ] All tables from `03-data-model.md` exist in Aurora PostgreSQL (SZ-DB-001)
- [ ] Drizzle ORM configured with type-safe schema matching all entities (SZ-DB-002)
- [ ] `audit_events` table has immutability triggers preventing UPDATE/DELETE (SZ-DB-004)
- [ ] Database migrations can be run from scratch to recreate full schema (SZ-DB-002)

### 6.4 CI/CD

- [ ] Every PR triggers automated lint, type-check, and test checks (SZ-INF-008, SZ-TST-005)
- [ ] Merging to `main` automatically deploys to dev environment (SZ-INF-008)
- [ ] Build fails are visible in PR checks and block merge (SZ-INF-008)

### 6.5 External APIs

- [ ] At least one external API (AZCT or Azure AD Graph) is callable from the application (SZ-EXT-001, SZ-EXT-002, or SZ-AUTH-002)
- [ ] API credentials are stored in Secrets Manager, not in code (SZ-INF-009)

### 6.6 Project Scaffolding

- [ ] TypeScript strict mode enabled and enforced (SZ-SCF-002)
- [ ] ESLint and Prettier configured and enforced in CI (SZ-SCF-003)
- [ ] tRPC router structure exists with at least one working endpoint (SZ-SCF-004)
- [ ] Zod validation schemas defined for core API inputs (SZ-SCF-006)
- [ ] Directory structure established per architecture specification (SZ-SCF-007)
- [ ] `.env.example` documents all required environment variables (SZ-SCF-009)

### 6.7 Monitoring

- [ ] Structured JSON logs appear in CloudWatch (SZ-MON-001)
- [ ] `/api/health` endpoint returns dependency status (SZ-MON-003)

### 6.8 Testing

- [ ] Vitest runs unit tests with coverage reporting (SZ-TST-001)
- [ ] React Testing Library configured with `renderWithProviders` utility (SZ-TST-002)
- [ ] At least one test exists for each testing pattern (unit, component, E2E) (SZ-TST-001, SZ-TST-002, SZ-TST-003)

### 6.9 Documentation

- [ ] README enables a new developer to set up their environment in under 1 hour (SZ-DOC-001)
- [ ] All environment variables documented with descriptions and sources (SZ-DOC-004)

### 6.10 Verification Process

On the final day of Sprint Zero (Week 6, Day 30), the Lead Engineer will:

1. Clone the repository into a clean directory
2. Follow the README instructions without deviation
3. Verify local development environment starts
4. Verify Azure AD login flow
5. Verify database connectivity and seed data
6. Open a PR and verify CI pipeline runs
7. Merge PR and verify dev deployment
8. Check CloudWatch for logs and health check
9. Walk through the exit criteria checklist with the Product Owner

If any exit criterion fails, it becomes the first task of Sprint 1 (not a reason to delay Sprint 1 indefinitely).

---

**End of Document**

*This backlog should be reviewed weekly during Sprint Zero stand-ups. Task status should be updated as work progresses. Any blocked tasks should be escalated immediately to the Project Manager (Cayetana) for resolution.*

*Cross-reference: `01-architecture-overview.md` | `02-business-requirements.md` | `03-data-model.md` | `04-integration-map.md` | `05-security-compliance.md` | `06-risk-register.md`*

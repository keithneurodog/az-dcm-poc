# 07 - Technical Decisions (Architecture Decision Records)

**Document:** Collectoid Production Technical Decisions
**Document ID:** SPRINT-ZERO-07
**Version:** 1.0
**Date:** 2026-02-06
**Status:** Accepted
**Authors:** Keith Hayes (Lead Engineer), Architecture Team
**Program:** DOVS2 (Data Office Value Stream 2), WP4 -- UI & Agentic AI

---

**Cross-References**

| Document | Path | Relevance |
|----------|------|-----------|
| Architecture Overview | `docs/sprint-zero/01-architecture-overview.md` | System context, container diagram, deployment topology, technology stack |
| Business Requirements | `docs/sprint-zero/02-business-requirements.md` | NFRs, MVP definition, phase roadmap, team constraints |
| Data Model | `docs/sprint-zero/03-data-model.md` | Entity relationships, audit trail schema, versioning strategy |
| Integration Map | `docs/sprint-zero/04-integration-map.md` | External system contracts, sync patterns, circuit breakers |
| Security & Compliance | `docs/sprint-zero/05-security-compliance.md` | Authentication flows, RBAC model, data classification |
| Risk Register | `docs/sprint-zero/06-risk-register.md` | Technical risks, integration risks, team capacity risks |
| Gap Analysis | `docs/specs/collectoid-v2-gap-analysis.md` | JIRA stories VS2-329 to VS2-350, current-state gaps |
| UX Roles Design | `docs/collectoid-v2-ux-roles.md` | Role definitions, persona model |

**Revision History**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-06 | Keith Hayes | Initial ADR document with 10 architecture decisions |

---

## Table of Contents

1. [ADR-001: Next.js API Routes as Backend](#adr-001-nextjs-api-routes-as-backend)
2. [ADR-002: Aurora PostgreSQL with JSONB Columns](#adr-002-aurora-postgresql-with-jsonb-columns)
3. [ADR-003: Azure AD Authentication via Auth.js](#adr-003-azure-ad-authentication-via-authjs)
4. [ADR-004: Monorepo Structure](#adr-004-monorepo-structure)
5. [ADR-005: State Management Strategy](#adr-005-state-management-strategy)
6. [ADR-006: tRPC for Internal API Communication](#adr-006-trpc-for-internal-api-communication)
7. [ADR-007: Audit Trail Implementation](#adr-007-audit-trail-implementation)
8. [ADR-008: External Metadata Caching Strategy](#adr-008-external-metadata-caching-strategy)
9. [ADR-009: Feature Flag System](#adr-009-feature-flag-system)
10. [ADR-010: Testing Approach](#adr-010-testing-approach)

---

## ADR-001: Next.js API Routes as Backend

**Status:** Accepted
**Date:** 2026-02-06
**Deciders:** Keith Hayes (Lead Engineer), Jamie MacPherson (WP4 Lead)

### Context

Collectoid needs a backend to serve API endpoints for collection CRUD, approval workflows, audit logging, external system integration, and user management. The team transitioning the POC to production is small: 5.3 FTE shared across Collectoid, Sherlock, and USP, with Keith as the lead engineer at 0.5 FTE allocation to Collectoid. The POC is already built on Next.js 15 with the App Router, and the team has deep TypeScript and React expertise but limited experience with alternative backend frameworks.

The architecture must support the 12+ API route groups identified in `01-architecture-overview.md` Section 7 (collections, requests, approvals, audit, datasets, notifications, admin, health, webhooks, search, analytics) while remaining operationally manageable by a team that cannot afford to maintain separate deployment pipelines for frontend and backend services.

### Decision

Use Next.js API Routes (Route Handlers in the App Router) as the sole backend for Collectoid. All business logic executes within the Next.js process, structured as a service layer (`lib/services/`) called by route handlers (`app/api/`). There is no separate API server.

The API layer follows the middleware chain defined in `01-architecture-overview.md` Section 7: Rate Limiter, Auth Verify, RBAC Check, Input Validation (Zod), Request Logging, Route Handler, and Response Envelope. Heavyweight async operations (approval notifications, audit event persistence, external system sync, provisioning triggers) are dispatched to SQS queues rather than executed synchronously within the route handler, as detailed in `01-architecture-overview.md` Section 9.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| **Separate Node.js/Express API** | Clear separation of concerns; independent scaling of API and frontend; established patterns for middleware, routing, and error handling | Two deployment targets (ECS services); two CI/CD pipelines; duplicated type definitions unless shared via package; doubles operational overhead for a 5.3 FTE team | Operational overhead is unjustifiable. The team would spend more time maintaining infrastructure than building features. Independent scaling is unnecessary for the projected 200 concurrent users (see `02-business-requirements.md` NFR-SCAL-001). |
| **Python/FastAPI** | Excellent for data-heavy workloads; strong async support; auto-generated OpenAPI docs; better fit if team had Python experience | Language boundary between frontend (TypeScript) and backend (Python); no shared types without code generation (OpenAPI to TypeScript); hiring/onboarding friction; team has limited Python backend experience | Language boundary eliminates the primary productivity advantage of a monorepo. Code generation adds a synchronisation step that a small team will inevitably neglect, leading to client-server type drift. |
| **Java/Spring Boot** | Enterprise-grade; AZ has Java expertise in other teams; mature ecosystem for workflows and batch processing | Massive overhead for a small team; long startup times impede local development velocity; Java ecosystem is foreign to the existing team; container image size is 3-5x larger | Spring Boot is the right choice for a large team building microservices. It is the wrong choice for a 0.5 FTE lead engineer iterating rapidly on a POC-to-production transition. Boot time alone (10-30s) would destroy the developer experience loop. |

### Consequences

- **Positive:**
  - Single deployment artifact: one Docker image, one ECS service, one CI/CD pipeline. This halves the operational surface area compared to a frontend + API split.
  - Shared TypeScript types: the same `Collection`, `ApprovalRequest`, and `AuditEvent` interfaces are used by React Server Components, API route handlers, and the service layer. Zero code generation, zero type drift.
  - Simplified local development: `next dev` starts everything. No Docker Compose, no service orchestration, no port management.
  - The team can ship faster. With 0.5 FTE lead engineering time, every hour saved on infrastructure is an hour available for business logic.
  - React Server Components can call service-layer functions directly (without an HTTP round-trip) for server-side rendering, which is a significant performance advantage for the collections browser and discovery pages.

- **Negative:**
  - API routes run in the same Node.js process as SSR. A CPU-intensive API operation (e.g., generating a large compliance report for `VS2-350`) could block SSR. Mitigation: offload heavy computation to SQS workers or background API routes.
  - Cannot independently scale the API tier. If API traffic grows disproportionately to page traffic, the only option is scaling the entire ECS service. At projected scale (200 concurrent users), this is acceptable. At 10x scale, this decision should be revisited.
  - Next.js API routes lack first-class support for long-running connections (WebSockets, Server-Sent Events). Real-time notification delivery (`VS2-348`) may require a separate lightweight service (e.g., a Fargate sidecar running a WebSocket server) if polling proves insufficient.
  - Vendor lock-in to Vercel's framework. If Next.js development stalls or pivots in a direction incompatible with our needs, migration to a standalone Express/Fastify server is a non-trivial but bounded effort (extract `lib/services/` and `lib/clients/` into a new server framework).

- **Risks:**
  - **R-TECH-001** (from `06-risk-register.md`): POC-to-production transition complexity. Next.js API routes are production-ready, but the POC's mock data architecture must be fully replaced with real database and service layer calls.
  - If Collectoid's user base grows significantly beyond 1,000 registered users / 200 concurrent, the monolithic API may become a bottleneck. Trigger for revisiting: API p95 latency consistently above 2,000ms under production load.

### Related Decisions

- [ADR-004: Monorepo Structure](#adr-004-monorepo-structure) -- The single Next.js application decision reinforces the monorepo structure and vice versa.
- [ADR-006: tRPC for Internal API Communication](#adr-006-trpc-for-internal-api-communication) -- tRPC provides type-safe communication within this monolithic architecture.

---

## ADR-002: Aurora PostgreSQL with JSONB Columns

**Status:** Accepted
**Date:** 2026-02-06
**Deciders:** Keith Hayes (Lead Engineer), Jamie MacPherson (WP4 Lead)

### Context

Collectoid manages a complex domain with inherently relational data: collections contain datasets, datasets belong to categories, collections have multiple approvers across therapeutic areas, approvals require atomic "all or nothing" cross-TA coordination, access requests link users to collections with versioned terms, and every state change must be recorded in an immutable audit trail. The full entity relationship model is defined in `03-data-model.md` Section 2, spanning 15+ core tables.

The lead engineer's personal preference leans toward NoSQL/document databases for their schema flexibility and developer ergonomics. However, the domain requirements -- particularly the multi-TA approval workflow (`VS2-339`, `VS2-349`), the d-code resolution query pattern (`VS2-329`), and the cross-entity audit trail (`VS2-350`) -- demand capabilities that document databases handle poorly.

A key requirement from `05-security-compliance.md` is audit trail immutability under ICH E6(R2) and STND-0001498. The audit trail must be append-only, tamper-evident, and capable of reconstructing the complete state of any entity at any point in time.

### Decision

Use Amazon Aurora PostgreSQL 15 as the primary data store with a hybrid schema: relational tables with foreign keys for the core domain model, and JSONB columns for semi-structured and externally-sourced data that evolves independently of the relational schema.

The hybrid approach is detailed in `01-architecture-overview.md` Section 6, with schema definitions in `03-data-model.md` Section 3. Drizzle ORM is the recommended ORM layer for type-safe queries with first-class PostgreSQL and JSONB support.

**Relational core** (SQL tables with foreign keys, constraints, and indexes):
- `collections`, `collection_versions`, `collection_members`
- `datasets`, `collection_version_datasets` (junction)
- `categories`, `dataset_categories` (junction)
- `approvals`, `approval_signatures`
- `users`, `user_roles`, `roles`
- `teams`, `team_members`
- `access_requests`
- `notifications`
- `audit_events` (append-only, partitioned by month)

**JSONB columns** (flexible schema within relational tables):
- `collections.metadata` -- External metadata snapshot from AZCT
- `collections.criteria` -- Filter criteria that produced this collection
- `collections.environments` -- Selected consumption environments
- `collection_versions.snapshot` -- Full point-in-time collection state
- `audit_events.payload` -- Event-specific data varying by event type
- `datasets.clinical_metadata` -- AZCT study details (varying structure)
- `discussions.content` -- Threaded discussion content

### Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| **Amazon DynamoDB** | Infinite horizontal scaling; pay-per-request pricing attractive for variable traffic; excellent for event-driven workloads; commonly used at AZ | No JOINs -- requires extensive denormalization for cross-entity queries; GSI limit of 20; TransactWriteItems limited to 100 items/4MB; requires careful upfront access pattern design that is costly to refactor | The collection creation wizard alone requires querying across collections, datasets, categories, studies, users, and approvals in combinations that would require extreme denormalization and multiple GSIs. The multi-TA approval "all or nothing" pattern (`VS2-339`) requires ACID across approvals and collections, which DynamoDB transactions cannot reliably support at the required entity count. See `01-architecture-overview.md` Section 6 Option C analysis. |
| **Amazon DocumentDB (MongoDB-compatible)** | Native JSON documents; schema flexibility; familiar API for teams with MongoDB experience | Poor cross-entity query performance (`$lookup` is expensive); no referential integrity (orphaned references across 15+ entity types is a real risk); multi-document transactions have significant performance overhead; AZ approved status uncertain | The relational nature of collections-to-datasets-to-approvals-to-users makes DocumentDB a poor fit for the core domain. Queries like "find all collections including study D-12345 that are pending approval from TALT" require multi-collection `$lookup` chains that are both slow and fragile. See `01-architecture-overview.md` Section 6 Option A analysis. |
| **Pure PostgreSQL (no JSONB)** | Maximum relational integrity; simplest query patterns; no JSON complexity | Every metadata shape change requires a schema migration; external metadata from AZCT/Collibra/Cornerstone has varying structure; discussion thread content is inherently document-shaped | Too rigid. AZCT study metadata structure varies by study type and evolves over time. Forcing it into fixed columns would require frequent migrations and many nullable columns. JSONB gives schema flexibility where needed while preserving relational integrity where required. |

### Consequences

- **Positive:**
  - ACID transactions for the multi-TA approval workflow. When TA Lead A approves, the system atomically checks all other approvals, updates collection status, and creates audit records -- or rolls back entirely. This directly satisfies `VS2-339` and `VS2-349`.
  - Native SQL JOINs for the complex cross-entity queries that dominate Collectoid's access patterns: "all studies matching criteria X in collection Y approved for environment Z" is a 4-table JOIN that is natural in SQL and would require extreme denormalization in a document store.
  - JSONB with GIN indexes provides sub-millisecond queries on flexible metadata fields. The query `SELECT * FROM collections WHERE metadata @> '{"therapeuticArea": "Oncology"}'` uses the GIN index and performs at document-database speeds.
  - `audit_events` table can be partitioned by month with PostgreSQL declarative partitioning, enabling efficient range queries and archival without affecting write performance. This supports the audit retention requirements from `05-security-compliance.md`.
  - Aurora auto-scaling read replicas handle read-heavy workloads (collections browser, search, audit queries) independently of the writer instance.
  - Drizzle ORM provides type-safe queries including JSONB operators, eliminating an entire class of runtime errors.

- **Negative:**
  - PostgreSQL requires more upfront schema design than a document database. Schema migrations during development add friction (mitigated by Drizzle ORM's migration tooling).
  - JSONB columns can become "schema-less dumping grounds" if not governed. Mitigation: Zod schemas validate JSONB content at the application layer (see `01-architecture-overview.md` Section 7, Request Validation), and a `lib/validation/` directory contains typed schemas for all JSONB structures.
  - Aurora PostgreSQL has a cold-start overhead (~30s for read replica promotion) that could affect failover scenarios. Mitigated by multi-AZ deployment and proactive health monitoring.
  - The team's NoSQL preference means a steeper initial learning curve for complex SQL and PostgreSQL-specific features (partitioning, GIN indexes, JSONB operators). Mitigated by Drizzle ORM abstracting most raw SQL.

- **Risks:**
  - **[QUESTION-001]** from `01-architecture-overview.md`: Aurora PostgreSQL must be confirmed as an AZ-approved AWS service. If not approved, the fallback is standard RDS PostgreSQL with manual multi-AZ configuration, which increases operational overhead but preserves all schema and query patterns.
  - Audit trail storage growth: at an estimated 50-100 events per collection per quarter across 500+ collections, the audit table could grow to millions of rows annually. Monthly partitioning and configurable retention (see `03-data-model.md` Section 4) mitigate this, but storage costs must be monitored.

### Related Decisions

- [ADR-007: Audit Trail Implementation](#adr-007-audit-trail-implementation) -- The audit trail design depends on PostgreSQL's append-only table capabilities and monthly partitioning.
- [ADR-008: External Metadata Caching Strategy](#adr-008-external-metadata-caching-strategy) -- JSONB columns in the datasets table serve as the "warm" cache tier for external metadata.
- [ADR-006: tRPC for Internal API Communication](#adr-006-trpc-for-internal-api-communication) -- Drizzle ORM types flow through tRPC to the client, enabling end-to-end type safety from database to UI.

---

## ADR-003: Azure AD Authentication via Auth.js

**Status:** Accepted
**Date:** 2026-02-06
**Deciders:** Keith Hayes (Lead Engineer), InfoSec Team (advisory)

### Context

Collectoid manages access to strictly confidential clinical trial data metadata and governs who can access datasets across all therapeutic areas. AstraZeneca mandates corporate SSO via Azure AD (Entra ID) for all internal applications -- no local credentials are permitted. The security requirements are defined in `05-security-compliance.md` Section 2.

The POC currently uses a simple password-based authentication mechanism (`app/api/auth/route.ts`) that must be entirely replaced. The production system requires:

1. OIDC-based SSO with Azure AD
2. Access to Azure AD group memberships for RBAC (mapping AD groups to Collectoid roles: DCM, Approver, Team Lead, Data Consumer, Admin)
3. Server-side session validation compatible with React Server Components and the App Router
4. Token refresh handling for long-lived sessions (up to 24 hours with sliding expiry per `05-security-compliance.md`)
5. Integration with Microsoft Graph API for user profile enrichment and group membership resolution

### Decision

Use Auth.js v5 (the production release of NextAuth.js) with the Azure AD OIDC provider for all authentication and session management. Sessions are stored server-side in Redis (ElastiCache) with JWT tokens used only for the OIDC exchange, not as the primary session mechanism.

The Auth.js configuration lives in `lib/auth/` and is integrated with the Next.js middleware for route protection. Azure AD group claims are mapped to Collectoid system roles at login time and cached in the Redis session. The Graph API client (`lib/clients/azure-ad-client.ts` per `04-integration-map.md`) is used for user profile enrichment and group membership queries that exceed what is available in the OIDC token claims.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| **Custom OIDC implementation** (direct `openid-client` library) | Maximum control over the auth flow; no framework abstractions to work around; can optimize for exact AZ requirements | Significant development effort for token management, session handling, CSRF protection, callback routing, error recovery, and logout; must be maintained by the team indefinitely; high risk of security vulnerabilities in custom auth code | Auth is the highest-risk component to get wrong. A vulnerability in custom auth code could expose the entire system. Auth.js has been security-audited and battle-tested across thousands of production deployments. The 0.5 FTE lead engineer allocation cannot absorb the ongoing maintenance burden of custom auth. |
| **MSAL.js (Microsoft Authentication Library) directly** | Official Microsoft library; first-class Azure AD support; well-documented; handles token lifecycle natively | Client-side focused; limited server-side support for App Router and React Server Components; requires significant custom work for session management, middleware integration, and server component compatibility; no built-in Next.js middleware support | MSAL.js is designed for SPAs. Integrating it with Next.js App Router server components requires substantial custom plumbing for session propagation, server-side token validation, and middleware hooks. Auth.js provides this integration out of the box. |
| **Clerk** | Excellent developer experience; pre-built UI components; user management dashboard; first-class Next.js support | External SaaS dependency; stores user data outside AZ infrastructure; per-user pricing ($0.02+/MAU) adds ongoing cost; data residency concerns for clinical trial metadata governance; may not be on AZ approved vendors list | Clerk stores authentication state and user data in its cloud. For a system governing clinical trial data access, routing authentication through a third-party SaaS creates a data residency concern and a dependency that AZ InfoSec is unlikely to approve. The per-user pricing also scales poorly with >1,000 registered users. |
| **Auth0** | Mature enterprise auth platform; extensive Azure AD integration; M2M auth support for service-to-service calls; SOC 2 certified | External SaaS dependency; Okta acquisition has introduced pricing uncertainty; adds latency to every auth check (network round-trip to Auth0); vendor lock-in for session management | Similar concerns to Clerk regarding external dependency. Auth0 adds network latency to every session validation. For a system where every API request must be authenticated (see middleware chain in `01-architecture-overview.md` Section 7), this latency compounds. Auth.js validates sessions locally against Redis, eliminating external auth round-trips on every request. |

### Consequences

- **Positive:**
  - Auth.js v5 has first-class App Router and React Server Component support, including `auth()` server function and middleware-based route protection. This aligns perfectly with the Next.js architecture from ADR-001.
  - Server-side session validation via Redis means session checks are sub-millisecond (local network) rather than requiring external API calls. With the middleware chain running on every API request, this performance characteristic is critical.
  - Azure AD group claims are mapped to Collectoid roles at login time, enabling the RBAC model defined in `05-security-compliance.md` Section 3 without additional runtime queries.
  - No user credentials are ever stored in Collectoid. All authentication is delegated to Azure AD. This simplifies the security audit surface and eliminates an entire category of vulnerabilities (password storage, brute force, credential stuffing).
  - Auth.js handles OIDC token refresh transparently, maintaining long-lived sessions without user disruption.

- **Negative:**
  - Auth.js v5 has undergone significant API changes from v4 (NextAuth.js). Community resources and examples may reference the v4 API. The team must work primarily from official v5 documentation.
  - Auth.js abstracts the OIDC flow, which can make debugging authentication issues harder. Structured logging in the auth callbacks is essential for diagnosing token exchange failures.
  - Azure AD group claims have a size limit in OIDC tokens (~200 groups). If a user belongs to more than 200 groups (possible for senior AZ employees), the token will contain a `_claim_names` reference requiring an additional Graph API call. Auth.js callback must handle this edge case.
  - Session strategy decision: database sessions (stored in Aurora PostgreSQL) would provide maximum auditability but add a database query to every request. Redis sessions provide better performance but are transient. Decision: Redis sessions with session creation/destruction events written to the audit log.

- **Risks:**
  - **[QUESTION-012]** from `01-architecture-overview.md`: The specific Azure AD groups that map to Collectoid roles (DCM, DDO, Team Lead, Consumer) must be confirmed with the Identity Team. Without this mapping, RBAC cannot be implemented.
  - **[QUESTION-013]**: Service principals / managed identities for server-to-server API calls (Collectoid to AZCT, Collectoid to Cornerstone) are separate from user authentication. These must be configured independently.
  - Auth.js dependency: if the Auth.js project becomes unmaintained, the auth layer would need to be replaced. Mitigation: the auth configuration is isolated in `lib/auth/`, and the session interface is abstracted behind a `getCurrentUser()` function used throughout the codebase.

### Related Decisions

- [ADR-001: Next.js API Routes as Backend](#adr-001-nextjs-api-routes-as-backend) -- Auth.js v5 is specifically designed for Next.js App Router; this decision is tightly coupled.
- [ADR-008: External Metadata Caching Strategy](#adr-008-external-metadata-caching-strategy) -- Redis (ElastiCache) serves double duty as both the session store and the metadata cache tier.

---

## ADR-004: Monorepo Structure

**Status:** Accepted
**Date:** 2026-02-06
**Deciders:** Keith Hayes (Lead Engineer), Jamie MacPherson (WP4 Lead)

### Context

Collectoid consists of six frontend modules (DCM, Discovery, Request/Approval, Admin, Notification, Audit -- see `01-architecture-overview.md` Section 4) and a backend API layer. These modules share a design system (Radix UI + shadcn/ui + Tailwind CSS), TypeScript types, validation schemas, authentication context, and business logic. The team must decide how to organize this codebase: as a single application, as multiple packages in a monorepo, or as separately deployed micro-frontends.

The team is small (5.3 FTE across three products) and the Q1-Q4 2026 roadmap (`02-business-requirements.md` Section 7) requires shipping new modules every quarter. Coordination overhead between separate repositories or deployments would directly reduce feature velocity.

### Decision

Build Collectoid as a single Next.js application in a single repository. All six frontend modules, the API layer, the service layer, and shared libraries coexist in one codebase with the directory structure proposed in `01-architecture-overview.md` Section 4. Next.js route groups (`(dcm)`, `(discover)`, `(requests)`, `(admin)`) provide logical separation without deployment isolation.

The existing POC codebase (`/Users/kwnt592/code/delete-me`) evolves into the production application. Reusable artifacts from the POC (shadcn/ui components, Radix UI primitives, Tailwind configuration, layout patterns) are retained; mock data and POC-specific code (password auth, `_variations/` pattern, UX exploration pages) are removed.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| **Micro-frontends (Module Federation)** | Independent deployment per module; teams can ship independently; failure isolation -- a bug in the Audit module does not break the DCM module | Significant infrastructure complexity (Module Federation configuration, shared dependency management, runtime integration); requires 2+ teams to justify the coordination cost; debugging cross-module issues is harder; shared state management becomes an integration challenge | There is one team, not multiple independent teams. Module Federation adds substantial complexity to the build, deployment, and debugging pipeline with zero benefit when the same 5.3 FTE team owns all modules. The complexity tax would consume 15-20% of engineering effort for infrastructure rather than features. |
| **Separate repos per module** | Clear ownership boundaries; independent version control history; modules can use different frameworks if needed | Type sharing requires publishing packages; breaking changes in shared types require coordinated releases across repos; CI/CD pipeline per repo multiplies operational overhead; code review becomes fragmented | Same fundamental problem as micro-frontends: the team is too small. Publishing shared packages, maintaining multiple CI/CD pipelines, and coordinating releases across repos is work that exists solely to manage the consequences of separation. For 5.3 FTE, that cost exceeds the benefit. |
| **Turborepo multi-package monorepo** | Shared repo with package boundaries; incremental builds; cached test runs; enforced dependency graph between packages | Adds Turborepo tooling complexity; package boundaries create import restrictions that slow development when boundaries are wrong; configuration overhead for workspace packages, build ordering, and publish workflows | Turborepo is the right tool when a monorepo contains 5+ packages with distinct build/test/publish lifecycles. Collectoid has one deployable (the Next.js app), one design system (already co-located), and shared utilities. The overhead of Turborepo workspaces and package.json management does not pay off for this project structure. If Sherlock and USP are later co-located in the same repo, Turborepo becomes worth reconsidering. |

### Consequences

- **Positive:**
  - Zero coordination overhead for type changes. Renaming a field on the `Collection` type automatically propagates to every component, API route, service function, and validation schema. TypeScript catches every misuse at compile time.
  - Single `next build` produces the entire application. One Docker image, one ECR repository, one ECS service definition. Deployment is atomic: the entire application is deployed or rolled back as a unit.
  - Shared design system components (120+ shadcn/ui components in `components/ui/`) are directly importable across all modules with no package publishing step.
  - New developers onboard to one repository, one build system, and one test suite. Given the 5.3 FTE team size and 0.5 FTE lead allocation, minimizing onboarding friction is critical.
  - Route groups (`(dcm)`, `(discover)`, etc.) provide logical separation for layouts and navigation without build-time isolation. Developers can reason about module boundaries through directory structure rather than package boundaries.

- **Negative:**
  - All modules are deployed together. A bug introduced in the Audit module (Q4) cannot be deployed independently of a critical fix to the DCM module (Q2). Mitigation: feature flags (see [ADR-009](#adr-009-feature-flag-system)) allow disabling a broken module without redeploying.
  - Build times scale with the entire codebase. As the application grows to 500+ files across all modules, full rebuilds may slow CI/CD. Mitigation: Next.js Turbopack (already configured in `package.json`: `"dev": "next dev --turbopack"`) provides incremental compilation. GitHub Actions caching further reduces CI build times.
  - No enforced module boundaries. A developer in the Audit module can import directly from the DCM module's internal components. Mitigation: ESLint import boundary rules (e.g., `eslint-plugin-import` with path-based restrictions) and code review conventions.
  - If Collectoid grows to require multiple teams (unlikely in 2026), the monolith structure becomes a coordination bottleneck. The trigger for reconsidering is 3+ independent teams working on Collectoid simultaneously.

- **Risks:**
  - **R-TECH-001** from `06-risk-register.md`: POC-to-production evolution may retain technical debt from the POC. A clear migration plan (documented in `01-architecture-overview.md` Appendix B) defines what is kept, what is restructured, and what is discarded.

### Related Decisions

- [ADR-001: Next.js API Routes as Backend](#adr-001-nextjs-api-routes-as-backend) -- The monorepo contains both frontend and backend in a single Next.js application.
- [ADR-005: State Management Strategy](#adr-005-state-management-strategy) -- Shared state architecture assumes a single application boundary.
- [ADR-006: tRPC for Internal API Communication](#adr-006-trpc-for-internal-api-communication) -- tRPC's type inference works because client and server are in the same TypeScript project.

---

## ADR-005: State Management Strategy

**Status:** Accepted
**Date:** 2026-02-06
**Deciders:** Keith Hayes (Lead Engineer)

### Context

The POC currently manages all client-side state through React Context providers and `sessionStorage` persistence. This approach served the prototype's mocked-data architecture but does not scale to production, where:

1. Server Components render the majority of pages and cannot use client-side state hooks
2. Data fetched from the database must be cached, revalidated, and synchronized across tabs/components
3. Optimistic updates are needed for approval actions (the user should see immediate feedback when approving a collection, even before the server confirms)
4. The 11-step collection creation wizard (`01-architecture-overview.md` Section 10, Flow 1) requires multi-step form state that persists across navigation
5. UI state (sidebar open/closed, active filters, selected view mode) is genuinely client-only and should not involve the server

The Next.js App Router is fundamentally RSC-first (React Server Components). The state management strategy must respect this architecture by keeping server data on the server and only hydrating client components with the minimum necessary state.

### Decision

Adopt a three-tier state management strategy:

1. **Server state (data from the database/API):** React Server Components for initial page loads + TanStack Query (React Query) for client-side cache management, background revalidation, optimistic updates, and mutation handling. Server Components fetch data directly from the service layer; client components use TanStack Query hooks to manage the cache lifecycle.

2. **Form state (multi-step wizard, complex forms):** React Hook Form with Zod resolvers for the collection creation wizard and access request wizard. Form state persists in the component tree during the wizard flow and is validated per-step using the same Zod schemas used for API validation (see `01-architecture-overview.md` Section 7, `lib/validation/`).

3. **UI state (client-only preferences):** React Context for cross-component UI state (sidebar state, active filters, view mode, notification panel open/closed). No library needed; `useState` + Context covers all UI state requirements.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| **Redux Toolkit** | Predictable state container; excellent DevTools; large ecosystem; handles complex state transitions well; proven at scale | Significant boilerplate (slices, reducers, actions, selectors, thunks/sagas); overkill for server-state-centric architecture where RSCs handle initial data; poor ergonomics with Server Components; adds ~15KB to bundle | Redux was designed for an era when the client managed all state. With RSCs fetching data server-side and TanStack Query managing the client cache, Redux would manage a small slice of UI state -- paying a large boilerplate cost for minimal benefit. The complexity budget is better spent elsewhere. |
| **Zustand** | Minimal API; small bundle size (~1KB); no boilerplate; works outside React component tree; excellent TypeScript support | Another library to learn and maintain; overlaps with React Context for simple UI state; does not solve server state management (still needs TanStack Query or similar); encourages putting server data in client stores | Zustand is elegant but unnecessary when the state it would manage (UI preferences, filter state) is already well-served by React Context. Adding Zustand would create ambiguity about where state lives: Context vs. Zustand vs. TanStack Query. For a small team, fewer state management paradigms means less cognitive overhead. |
| **Jotai** | Atomic state model; bottom-up approach; excellent for derived state; minimal re-renders | Learning curve for atom-based mental model; less established patterns for complex state machines (approval workflow state); smaller ecosystem than Redux or TanStack Query | Jotai's atomic model is powerful but introduces a paradigm shift that the team would need to learn. The collection creation wizard and approval workflow have sequential, step-based state (not atomic/derived), making Jotai's strengths less relevant. |
| **Pure React Context for everything** (current POC approach) | No additional dependencies; works everywhere; no learning curve | No built-in caching, revalidation, or optimistic updates; Context re-renders all consumers on any state change (performance risk with large collection lists); no background sync; `sessionStorage` persistence is fragile and does not survive across tabs | This is the POC's current approach and it works for mocked data. In production, the collections browser renders 500+ items that need efficient caching and background revalidation. TanStack Query provides this without reinventing it in Context providers. |

### Consequences

- **Positive:**
  - Clear separation of concerns: server data is managed by RSC + TanStack Query, form data by React Hook Form, UI state by Context. Developers know exactly where to put each type of state.
  - TanStack Query's `useMutation` with `onMutate` enables optimistic updates for approval actions. When an approver clicks "Approve," the UI updates immediately while the mutation propagates to the server. If it fails, the cache rolls back. This directly improves the approval UX for `VS2-339`.
  - TanStack Query's stale-while-revalidate strategy ensures the collections browser always renders cached data instantly while fetching fresh data in the background. This makes the initial experience fast even when the database query is slow.
  - Shared Zod schemas between React Hook Form validation and API route validation eliminate duplicate validation logic. The `CreateCollectionSchema` defined once in `lib/validation/collections.ts` validates both the form client-side and the API request server-side.
  - Bundle size is minimized. TanStack Query (~13KB gzipped) and React Hook Form (~9KB gzipped) are far lighter than Redux Toolkit + RTK Query (~33KB gzipped).

- **Negative:**
  - Three state paradigms (TanStack Query, React Hook Form, React Context) means developers must learn three mental models. Mitigated by clear documentation and code conventions: a `CONTRIBUTING.md` guide defines which paradigm to use for each type of state.
  - TanStack Query's cache invalidation requires careful key management. Incorrect cache key structure can lead to stale data after mutations. Mitigated by centralizing query keys in a `lib/query-keys.ts` file and invalidating via entity type after mutations.
  - React Context for UI state can cause unnecessary re-renders if not properly scoped. Mitigated by splitting Context into narrow providers (e.g., `SidebarContext`, `FilterContext`, `ViewModeContext`) rather than a single global provider.

- **Risks:**
  - If the wizard state for the 11-step collection creation flow becomes too complex for React Hook Form alone (e.g., inter-step dependencies, conditional branching, draft persistence across sessions), the team may need to add a dedicated wizard state machine (e.g., XState). This is a bounded enhancement, not a fundamental architecture change.

### Related Decisions

- [ADR-001: Next.js API Routes as Backend](#adr-001-nextjs-api-routes-as-backend) -- RSC + TanStack Query depends on having API routes in the same application for efficient data fetching.
- [ADR-006: tRPC for Internal API Communication](#adr-006-trpc-for-internal-api-communication) -- TanStack Query integrates natively with tRPC via `@trpc/react-query`, providing type-safe hooks with automatic cache management.

---

## ADR-006: tRPC for Internal API Communication

**Status:** Accepted
**Date:** 2026-02-06
**Deciders:** Keith Hayes (Lead Engineer)

### Context

Collectoid's frontend and backend live in the same TypeScript project (see [ADR-001](#adr-001-nextjs-api-routes-as-backend) and [ADR-004](#adr-004-monorepo-structure)). The 12+ API route groups defined in `01-architecture-overview.md` Section 7 serve as the contract between client components and server-side business logic. With both sides in TypeScript, there is an opportunity to eliminate the manual type synchronization that plagues REST APIs (where the client's type for a response can silently drift from the server's actual response shape).

The API must support the middleware chain defined in `01-architecture-overview.md` Section 7 (rate limiting, auth verification, RBAC, input validation, request logging, response envelope), be compatible with TanStack Query for cache management (see [ADR-005](#adr-005-state-management-strategy)), and support both queries (read operations) and mutations (write operations with side effects).

A critical constraint: if Collectoid ever needs to expose APIs to external consumers (other AZ applications, Sherlock, USP), those APIs must be REST-based. The internal API choice must not preclude future REST endpoints.

### Decision

Use tRPC for all internal API communication between Next.js client components and server-side business logic. tRPC provides end-to-end type safety from the database (Drizzle ORM types) through the service layer to the client component, with zero code generation and zero schema duplication.

tRPC is deployed alongside (not instead of) Next.js Route Handlers. tRPC handles the internal client-server contract; any future external-facing APIs are built as standard REST Route Handlers. The two coexist in the same application.

**Architecture:**

```
Client Component
  |
  | @trpc/react-query hooks (type-safe, auto-cached)
  |
tRPC Router (app/api/trpc/[trpc]/route.ts)
  |
  | tRPC middleware (auth, RBAC, logging)
  |
tRPC Procedures (lib/trpc/routers/*.ts)
  |
  | Calls service layer
  |
Service Layer (lib/services/*.ts)
  |
  | Drizzle ORM (type-safe queries)
  |
Aurora PostgreSQL
```

### Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| **REST with OpenAPI + Zod** (manual Route Handlers) | Industry standard; any client can consume the API; OpenAPI spec can generate client SDKs for external consumers; no additional library dependency | Manual type synchronization between API response and client-side types; Zod schemas define the shape but the client must trust the runtime response matches; no automatic cache key management; manual `fetch` wrappers for every endpoint | REST is the right choice for external-facing APIs. For internal communication within the same TypeScript project, it adds unnecessary ceremony. Every new endpoint requires: (1) define Zod request schema, (2) define Zod response schema, (3) create Route Handler, (4) create client-side fetch function with typed return, (5) create TanStack Query hook. tRPC collapses steps 2-5 into a single procedure definition. |
| **GraphQL with Apollo/URQL** | Flexible queries; client controls response shape; excellent developer tooling (GraphQL Playground, schema introspection); strong caching with Apollo Client; good for data-heavy UIs | Schema definition overhead (SDL or code-first); N+1 query problem requires DataLoader pattern; learning curve for resolvers, fragments, and cache normalization; overkill for a single-consumer API; adds significant bundle size (Apollo Client ~40KB gzipped) | GraphQL excels when multiple consumers need different views of the same data (e.g., mobile app vs. web vs. partner API). Collectoid has exactly one consumer: its own frontend. GraphQL's flexible query capabilities add complexity without benefit. The DataLoader pattern for N+1 prevention and Apollo's normalized cache add substantial cognitive overhead for a small team. |
| **Plain `fetch` with manual types** | Zero dependencies; maximum control; no library abstractions to work around; smallest possible bundle | No type safety between client and server; type drift risk on every API change; no automatic cache management; every mutation requires manual cache invalidation; boilerplate-heavy | This is the "no framework" option. It works but creates a maintenance burden that scales linearly with the number of API endpoints. With 12+ route groups and 30+ individual endpoints, the manual type maintenance and cache management become a significant time sink. |

### Consequences

- **Positive:**
  - End-to-end type safety: when a Drizzle ORM query returns a `Collection` with a specific JSONB shape, that type flows through the service layer, through the tRPC procedure, and into the client component's TanStack Query hook. A schema change in the database type is immediately flagged as a compile error in every consuming component. Zero runtime type mismatches.
  - Native TanStack Query integration via `@trpc/react-query`. tRPC automatically generates query keys, handles cache invalidation, and provides `useQuery`/`useMutation` hooks with full type inference. This eliminates the manual query key management risk identified in ADR-005.
  - tRPC middleware chain maps directly to the middleware pattern in `01-architecture-overview.md` Section 7. Auth verification, RBAC checks, input validation, and request logging are implemented as tRPC middleware that runs before every procedure.
  - Zero code generation. Unlike GraphQL (which requires code generation from SDL to TypeScript types) or OpenAPI (which requires code generation from spec to client SDK), tRPC infers types at compile time from the procedure definitions. No build step, no generated files to keep in sync.
  - tRPC procedures are just functions. They are trivially unit-testable without HTTP mocking -- just call the procedure with test inputs.

- **Negative:**
  - tRPC is an internal-only protocol. External consumers (Sherlock, USP, other AZ applications) cannot use tRPC endpoints without a TypeScript client. Mitigation: external-facing endpoints are built as standard REST Route Handlers (which can call the same service layer). This is explicitly documented as a design principle.
  - tRPC adds a dependency (~8KB gzipped for client) and a new paradigm for developers unfamiliar with it. The mental model (procedures, routers, middleware, context) is different from REST. Mitigated by tRPC's small API surface and thorough documentation.
  - tRPC batches requests by default, which can make individual request debugging harder in browser DevTools (multiple procedure calls appear as a single HTTP request). Mitigated by tRPC DevTools and structured server-side logging with correlation IDs.
  - Community size is smaller than REST or GraphQL. While tRPC is widely adopted in the Next.js ecosystem, enterprise adoption patterns and best practices are less documented than for REST.

- **Risks:**
  - If tRPC is abandoned or development stalls, the migration path is to extract procedure definitions into REST Route Handlers. The service layer (`lib/services/`) is framework-agnostic -- it takes parameters and returns results. Only the thin tRPC router layer would need replacement, not the business logic.
  - Over-reliance on type inference can make the codebase harder to understand for developers who join mid-project. Explicit return type annotations on tRPC procedures (rather than pure inference) improve readability at a minor ergonomic cost.

### Related Decisions

- [ADR-001: Next.js API Routes as Backend](#adr-001-nextjs-api-routes-as-backend) -- tRPC is deployed as a Next.js Route Handler (`app/api/trpc/[trpc]/route.ts`).
- [ADR-002: Aurora PostgreSQL with JSONB Columns](#adr-002-aurora-postgresql-with-jsonb-columns) -- Drizzle ORM types flow through tRPC to the client.
- [ADR-005: State Management Strategy](#adr-005-state-management-strategy) -- TanStack Query integrates natively with tRPC.

---

## ADR-007: Audit Trail Implementation

**Status:** Accepted
**Date:** 2026-02-06
**Deciders:** Keith Hayes (Lead Engineer), Compliance Team (advisory)

### Context

Collectoid operates under regulatory requirements that mandate an immutable, comprehensive audit trail for all governance decisions. The governing standards are documented in `05-security-compliance.md`:

- **STND-0001498** (Global Standard: Internal Sharing of Scientific Data): requires traceable records of all data sharing decisions
- **ICH E6(R2)** (Good Clinical Practice): requires clinical data traceability -- who did what, when, and why
- **SOP-0067196** (SOP: Internal Sharing of Scientific Data): operational procedures requiring approval records

The audit trail must support:
1. Immutable append-only records (no UPDATE or DELETE permitted)
2. Complete actor identification (who performed the action)
3. Full entity state at the time of the action (what the entity looked like before and after)
4. Point-in-time state reconstruction ("show me the exact state of collection X on January 15, 2026")
5. Cross-entity querying ("show me all approval decisions for collections containing study D-12345 in the last 90 days")
6. Tamper-evident verification (detectable if records are modified outside the application)

The JIRA stories driving this requirement are VS2-335 (versioning and change management) and VS2-350 (audit trail).

### Decision

Implement audit trail via an append-only `audit_events` table in Aurora PostgreSQL with entity snapshots stored as JSONB. This is a **change log** approach: every state-changing operation creates an immutable event record containing the actor, action type, target entity, and a JSONB payload with both the pre-change and post-change entity snapshots.

The design is specified in `03-data-model.md` Section 4 and follows these principles:

1. **Append-only enforcement:** Database triggers prevent UPDATE and DELETE on the `audit_events` table. The application-layer ORM is configured without update/delete operations for this table. Database credentials used by the application have INSERT-only permissions on `audit_events`.
2. **Monthly partitioning:** The table is partitioned by `created_at` month using PostgreSQL declarative partitioning. This enables efficient range queries and future archival of old partitions.
3. **Entity snapshots in JSONB:** The `payload` column contains the full entity state (or a meaningful diff for large entities) at the time of the event. This allows point-in-time reconstruction without replaying the event stream.
4. **Correlation IDs:** Every audit event carries a `correlation_id` linking related events in a workflow (e.g., all events in a single approval chain share a correlation ID).
5. **Tamper-evident checksums:** Each event contains a SHA-256 hash of the previous event's hash + current event content, creating a hash chain. Periodic verification jobs detect any tampering.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| **Full event sourcing (CQRS)** | Complete event history is the primary data model; perfect audit trail by definition; temporal queries are trivial; supports replay and projection into different read models | Massive architectural complexity; requires separate read and write models; eventual consistency between command and query sides; event schema evolution is difficult; the team has no event sourcing experience; reconstruction latency grows with event count | Event sourcing is architecturally elegant but introduces fundamental complexity that is disproportionate to the team's size and experience. CQRS requires maintaining separate read projections, handling eventual consistency, managing event schema versioning, and building projection rebuild infrastructure. For a 0.5 FTE lead engineer, this is a multi-quarter investment before any business feature can ship. The change log approach provides 90% of the audit value at 20% of the complexity. |
| **Database triggers only** (no application-layer audit logic) | Automatic capture of all changes; cannot be bypassed by application code; simple to implement for basic scenarios | Limited to table-level changes; cannot capture business context (why was this changed? who initiated the workflow?); trigger output is hard to query efficiently; triggers add latency to every write; complex trigger logic is hard to maintain and test | Database triggers capture what changed but not why. An approval decision trigger would record "status changed from pending to approved" but would not capture the approver's comments, the multi-TA coordination context, or the correlation to the original collection creation. The audit trail requires business-level semantics that only the application layer has. However, triggers ARE used as a secondary defense: triggers on `audit_events` prevent UPDATE/DELETE as a tamper-prevention mechanism. |
| **Application-level logging only** (structured logs to CloudWatch) | Simple implementation; leverage existing logging infrastructure; no additional database tables | Logs are not queryable in the same way as database records; cross-entity queries require log analytics tools (Athena, Elasticsearch); log retention is typically shorter than audit requirements; logs can be modified or deleted by infrastructure admins; not compliant with immutability requirements | CloudWatch logs are an operational tool, not a compliance artifact. Audit records under STND-0001498 and ICH E6(R2) must be immutable, queryable, and retained for the regulatory retention period (likely 7+ years per `05-security-compliance.md` [QUESTION-015]). CloudWatch logs lack the immutability guarantees and cross-entity query capabilities required. Structured logs ARE used as a complementary operational monitoring layer, but they are not the audit record of truth. |
| **Third-party audit service** (e.g., AWS CloudTrail, commercial audit SaaS) | Managed service; immutability guaranteed by the provider; purpose-built for compliance | External dependency for a core regulatory requirement; vendor lock-in; limited customization for domain-specific audit events (collection versioning, multi-TA approval chains); data residency concerns; additional cost | A third-party service would satisfy immutability requirements but would not support the domain-specific audit queries that Collectoid requires. Queries like "reconstruct the approval chain for collection X at version 3" require understanding of Collectoid's domain model, which a generic audit service cannot provide. AWS CloudTrail captures API calls, not business events. |

### Consequences

- **Positive:**
  - The audit trail satisfies ICH E6(R2) and STND-0001498 requirements with a straightforward, well-understood implementation pattern. No exotic technology or architectural paradigm is introduced.
  - JSONB entity snapshots enable point-in-time reconstruction without event replay. "Show me collection X as it existed on January 15" is a single indexed query on `entity_type`, `entity_id`, and `created_at`.
  - Cross-entity queries leverage PostgreSQL JOINs. The audit query "all approval decisions for collections containing study D-12345 in the last 90 days" joins `audit_events` with `collection_version_datasets` and `datasets` using standard SQL -- exactly the query pattern that justified the PostgreSQL choice in ADR-002.
  - Monthly partitioning enables efficient archival. Partitions older than the retention period can be detached and moved to cold storage (S3 via `pg_dump`) without affecting query performance on recent data.
  - The hash chain provides a tamper-evidence mechanism that can be verified independently by compliance auditors without requiring application access.

- **Negative:**
  - Storage growth: JSONB entity snapshots are verbose. A collection with 200 datasets produces a snapshot of ~50-100KB per version. At 500 collections with quarterly review cycles, this accumulates to ~100-400MB per quarter in audit data alone. Monthly partitioning and configurable retention manage this, but storage monitoring is essential.
  - Write amplification: every business operation that creates an audit event performs an additional INSERT with a JSONB payload. For bulk operations (e.g., adding 100 studies to a collection), this means 100+ audit INSERTs. Mitigated by batching audit events and dispatching them asynchronously via SQS (see `01-architecture-overview.md` Section 9, `audit-events` queue).
  - The entity snapshot approach captures state at a point in time but does not capture the full causal chain of events that led to that state. For complex workflows (multi-TA approval with delegation), the correlation ID and event type taxonomy must be rich enough to reconstruct the workflow. This requires careful event type design.

- **Risks:**
  - **[QUESTION-015]** from `01-architecture-overview.md`: The audit log retention requirement (1 year, 7 years, indefinite) directly affects database sizing, partitioning strategy, and archival automation. This must be confirmed with the Compliance team before production deployment.
  - If the hash chain verification job is not implemented or is not run regularly, tampering could go undetected. This job must be included in the production operational runbook.

### Related Decisions

- [ADR-002: Aurora PostgreSQL with JSONB Columns](#adr-002-aurora-postgresql-with-jsonb-columns) -- The audit trail depends on PostgreSQL's append-only table capabilities, JSONB storage, monthly partitioning, and GIN indexing.
- [ADR-008: External Metadata Caching Strategy](#adr-008-external-metadata-caching-strategy) -- Audit events for external data sync operations (cache refresh from AZCT/Collibra) are recorded in the same `audit_events` table.

---

## ADR-008: External Metadata Caching Strategy

**Status:** Accepted
**Date:** 2026-02-06
**Deciders:** Keith Hayes (Lead Engineer)

### Context

Collectoid depends on three external systems for metadata that is rendered on nearly every page:

1. **AZCT REST API** -- Study metadata, dataset catalog, d-code resolution. Called during collection creation (d-code resolution per `VS2-329`), collection browsing (study details), and approval review (per-study compliance status).
2. **Cornerstone API** -- Training completion status per user. Called during access request creation and compliance verification.
3. **Collibra 2.0** -- Standardized metadata taxonomy, data lineage. Called during collection browsing (category display) and search (faceted filtering).

These external systems cannot be called on every page load due to rate limits, latency (100-300ms per external call), and availability concerns (see `04-integration-map.md` for availability dependency ratings). The guiding principle from `04-integration-map.md` Section 1.2 states: "Collectoid owns its read path. The application never makes a synchronous call to an external system on the critical rendering path for end users."

The caching strategy must balance data freshness (users should see up-to-date study metadata) against availability (the application must function when external systems are down) and cost (Redis memory is expensive at scale).

### Decision

Implement a multi-tier caching architecture with Redis (ElastiCache) as the hot cache and PostgreSQL JSONB columns as the warm cache:

**Tier 1: Redis (ElastiCache) -- Hot cache for frequently accessed data**
- Session store (24-hour sliding TTL)
- AZCT study metadata (1-hour TTL)
- Collibra taxonomy (6-hour TTL)
- User profiles and roles (15-minute TTL)
- Collection list summaries (5-minute TTL)
- D-code resolution results (4-hour TTL)
- Cornerstone training status (30-minute TTL)
- Rate limit counters (per-window auto-expiry)

**Tier 2: PostgreSQL JSONB -- Warm cache for semi-persistent data**
- `datasets.clinical_metadata` (JSONB) -- Full AZCT study metadata snapshot, updated by sync jobs
- `datasets.collibra_metadata` (JSONB) -- Collibra taxonomy mapping, updated by nightly sync
- `users.training_status` (JSONB) -- Cornerstone training completion snapshot

**Tier 3: External API -- Source of truth (never called on critical rendering path)**
- AZCT, Cornerstone, Collibra APIs called only by background sync jobs and explicit refresh actions

**Cache read path:**
```
Request --> Check Redis (hot) --> If miss, check PostgreSQL JSONB (warm)
                                  --> If miss, return stale indicator to UI
                                      + trigger background refresh via SQS
```

**Cache write path:**
```
Background sync job (ECS scheduled task or SQS consumer)
  --> Call external API
  --> Write to PostgreSQL JSONB (warm tier)
  --> Write to Redis (hot tier)
  --> Log sync event to audit trail
```

Cache key conventions, TTLs, and invalidation patterns follow the specification in `01-architecture-overview.md` Section 8.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| **Redis-only cache** | Simple architecture; single cache layer; fast reads for all data; built-in TTL management | Redis data is volatile (lost on restart or eviction); large metadata payloads (AZCT study details) consume expensive Redis memory; cold start after Redis restart requires re-fetching all external data; no persistence for warm data during extended external outages | Redis is ideal for hot data but expensive for storing hundreds of study metadata documents long-term. If Redis restarts or evicts entries, the application would need to re-fetch all metadata from external systems simultaneously -- which risks overwhelming those systems and creating a thundering herd problem. PostgreSQL JSONB as a warm tier provides persistent storage that survives Redis restarts. |
| **Database-only cache** (PostgreSQL JSONB without Redis) | Persistent storage; survives restarts; data is always available; no additional infrastructure component | Database queries are 10-50x slower than Redis reads for simple key-value lookups; every session validation requires a database round-trip; database connection pool becomes a bottleneck under load; rate limit counters require sub-millisecond reads that PostgreSQL cannot provide | Session validation occurs on every API request (see middleware chain in `01-architecture-overview.md` Section 7). At 200 concurrent users making multiple requests per second, database-backed sessions would require hundreds of session queries per second -- consuming connection pool capacity needed for business queries. Redis provides sub-millisecond session reads without database load. |
| **CDN-level caching** (CloudFront caching of API responses) | Lowest latency; automatic global distribution; no application-level cache management; reduces load on all tiers | API responses contain personalized data (user-specific access status, role-based filtering); cache invalidation at CDN level is coarse-grained (entire path, not per-user); cannot cache POST/mutation responses; RBAC-protected data must not be CDN-cached | Most Collectoid API responses are personalized. The collections browser shows different access indicators per user. The approval queue is role-filtered. CDN caching would require cache partitioning by user/role, which CloudFront does not support efficiently. CDN caching IS used for static assets (JS, CSS, images) with 1-year TTL per `01-architecture-overview.md` Section 8, but not for API responses. |
| **No cache (direct API calls)** | Simplest architecture; always fresh data; no cache invalidation complexity | External API calls add 100-300ms to every page load; external rate limits would be quickly exhausted; application is unavailable when external systems are down; violates the guiding principle that Collectoid owns its read path | This is not viable. The collections browser page alone would make 3-5 external API calls per collection card rendered. With 20 cards per page, that is 60-100 external calls per page load. At AZCT's estimated rate limit and 200ms average latency, page load times would exceed 10 seconds -- far above the 3-second NFR target in `02-business-requirements.md` NFR-PERF-001. |

### Consequences

- **Positive:**
  - The application remains functional during external system outages. If AZCT is down for maintenance, users still see cached study metadata from the PostgreSQL warm tier. The UI displays a "last synced: 2h ago" indicator rather than an error.
  - Page load times are dominated by Redis reads (sub-millisecond) rather than external API calls (100-300ms). This directly satisfies the performance NFRs in `02-business-requirements.md`.
  - Background sync jobs (running as ECS scheduled tasks per `04-integration-map.md` Section 6) update the cache without user-facing latency. Users always see the fastest available data.
  - Redis serves double duty as session store and metadata cache, amortizing the infrastructure cost of ElastiCache across both use cases.
  - Cache provenance tracking (`source_system`, `source_synced_at` fields per `03-data-model.md` Section 1.2) ensures users and auditors always know the freshness and origin of displayed data.

- **Negative:**
  - Two-tier caching adds complexity. Cache invalidation is one of the "two hard things in computer science," and having two tiers doubles the invalidation surface. Mitigated by: (a) TTL-based expiry as the primary invalidation mechanism, (b) write-through updates from sync jobs that update both tiers atomically, and (c) clear cache key conventions.
  - Stale data risk: with a 1-hour TTL on AZCT metadata, a study status change (e.g., consent withdrawn) could be invisible for up to 1 hour. For a system governing clinical trial data access, this staleness window must be understood and accepted by stakeholders. Mitigated by: manual "refresh metadata" action available to DCM users, and event-driven invalidation if AZCT supports webhooks ([QUESTION-006] from `01-architecture-overview.md`).
  - Redis memory costs: caching metadata for 1,700+ studies at ~10-50KB per study requires 17-85MB of Redis memory. With session data, rate limit counters, and collection summaries, total Redis memory could reach 200-500MB. The `cache.r6g.large` instance in production (`01-architecture-overview.md` Section 5) provides 13.07 GB, which is sufficient but should be monitored.

- **Risks:**
  - **[QUESTION-006]** from `01-architecture-overview.md`: If AZCT supports webhooks or change notifications, the caching strategy can shift from TTL-based to event-driven for study metadata, reducing the staleness window from 1 hour to near-real-time. This is a significant improvement worth pursuing.
  - **[QUESTION-007]**: Collibra 2.0 readiness timeline is uncertain. If Collibra is not available at launch, the taxonomy cache must be seeded from an alternative source (manual import or AZCT fallback). The cache architecture supports this -- the data source is opaque to the cache consumer.

### Related Decisions

- [ADR-002: Aurora PostgreSQL with JSONB Columns](#adr-002-aurora-postgresql-with-jsonb-columns) -- PostgreSQL JSONB columns serve as the warm cache tier.
- [ADR-003: Azure AD Authentication via Auth.js](#adr-003-azure-ad-authentication-via-authjs) -- Redis serves as both the session store and the metadata cache.
- [ADR-007: Audit Trail Implementation](#adr-007-audit-trail-implementation) -- Cache sync operations are logged as audit events for data provenance tracking.

---

## ADR-009: Feature Flag System

**Status:** Accepted
**Date:** 2026-02-06
**Deciders:** Keith Hayes (Lead Engineer)

### Context

Collectoid's Q1-Q4 2026 roadmap (`02-business-requirements.md` Section 7) delivers major functionality each quarter: Discovery (Q1), Collection Management (Q2), Approval Workflows (Q3), and Audit/Analytics (Q4). Features must be developed incrementally and released progressively. The POC already has a rudimentary feature flag system (`lib/feature-flags.ts`) with a single `NOTES_ENABLED` flag:

```typescript
export const FEATURE_FLAGS = {
  NOTES_ENABLED: false,
} as const
```

This works for a simple toggle but does not support environment-specific flags (enabled in staging but not production), gradual rollout, or runtime configuration changes.

The team must decide between building a typed internal feature flag system or adopting a third-party feature flag service. The decision is heavily influenced by team size (5.3 FTE), budget constraints, and the fact that feature flags for Collectoid are primarily binary (feature on/off per environment) rather than requiring percentage-based rollouts or user targeting.

### Decision

Implement an environment-variable-based feature flag system with a typed configuration module. Feature flags are defined in a TypeScript module (`lib/feature-flags.ts`) that reads from environment variables with compile-time type safety and runtime defaults. No third-party feature flag service is used.

**Implementation:**

```typescript
// lib/feature-flags.ts
const featureFlags = {
  // Q1: Discovery
  COLLECTIONS_BROWSER: envFlag('FF_COLLECTIONS_BROWSER', true),
  COLLECTION_SEARCH: envFlag('FF_COLLECTION_SEARCH', true),
  AI_DISCOVERY: envFlag('FF_AI_DISCOVERY', false),

  // Q2: Collection Management
  COLLECTION_WIZARD: envFlag('FF_COLLECTION_WIZARD', false),
  DCODE_RESOLUTION: envFlag('FF_DCODE_RESOLUTION', false),
  VIRTUAL_TEAMS: envFlag('FF_VIRTUAL_TEAMS', false),

  // Q3: Approval Workflows
  MULTI_TA_APPROVAL: envFlag('FF_MULTI_TA_APPROVAL', false),
  BUILT_IN_SIGNATURES: envFlag('FF_BUILT_IN_SIGNATURES', false),
  NOTIFICATIONS: envFlag('FF_NOTIFICATIONS', false),

  // Q4: Audit & Analytics
  AUDIT_TRAIL: envFlag('FF_AUDIT_TRAIL', false),
  VERSION_COMPARISON: envFlag('FF_VERSION_COMPARISON', false),
  DEMAND_ANALYTICS: envFlag('FF_DEMAND_ANALYTICS', false),

  // Operational
  MAINTENANCE_MODE: envFlag('FF_MAINTENANCE_MODE', false),
  DEBUG_LOGGING: envFlag('FF_DEBUG_LOGGING', false),
} as const;

function envFlag(name: string, defaultValue: boolean): boolean {
  const value = process.env[name];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
}

export type FeatureFlag = keyof typeof featureFlags;
export function isEnabled(flag: FeatureFlag): boolean {
  return featureFlags[flag];
}
```

Flags are set per environment via ECS task definition environment variables (or `.env.local` for development). Changing a flag in production requires a new ECS task definition deployment, which provides a built-in audit trail (deployment history) and rollback capability (revert to previous task definition).

### Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| **LaunchDarkly** | Industry leader; real-time flag updates without deployment; percentage rollouts; user targeting; A/B testing; audit logging; excellent SDKs | $10/seat/month (minimum $833/month for 1,000 users at the Pro tier); external SaaS dependency; adds network latency to flag evaluation if not using local evaluation mode; requires procurement approval; overkill for binary flags | LaunchDarkly is the right choice for large teams doing sophisticated A/B testing and gradual rollouts with user targeting. Collectoid needs ~15 binary flags evaluated at build/deploy time. The $10,000+/year cost and procurement process cannot be justified against the team's budget for what amounts to a configuration file. |
| **Unleash** (self-hosted or cloud) | Open source option available; self-hosted eliminates SaaS dependency; supports gradual rollouts and user segmentation; feature flag audit trail | Self-hosted requires additional infrastructure (database, server); operational overhead for the team to maintain; cloud version has per-seat pricing similar to LaunchDarkly; learning curve for the admin interface | The self-hosted option adds operational burden (another service to deploy, monitor, and maintain) that the team cannot absorb. The cloud option has similar cost concerns to LaunchDarkly. |
| **Flagsmith** (open source) | Open source; can self-host; simpler than LaunchDarkly/Unleash; REST API for flag evaluation | Same self-hosting operational overhead as Unleash; smaller community; fewer integrations; less mature than alternatives | Same fundamental objection: self-hosting adds operational overhead disproportionate to the simple flag requirements. |
| **AWS AppConfig** | Native AWS integration; managed service; no additional infrastructure; supports gradual deployments; free within AWS usage | Adds AWS SDK dependency; configuration retrieval adds latency; requires IAM configuration; polling interval for configuration changes; less developer-friendly than TypeScript-native solution | AWS AppConfig is a reasonable choice that avoids SaaS costs but introduces SDK complexity and IAM configuration. For binary flags, environment variables are simpler, more transparent, and already supported by the ECS task definition. If flag requirements become more sophisticated (percentage rollouts, user targeting), AppConfig is the recommended upgrade path. |

### Consequences

- **Positive:**
  - Zero cost and zero external dependencies. Feature flags are TypeScript code evaluated at startup. No network calls, no latency, no SaaS vendor to manage.
  - Type safety: `isEnabled('TYPO')` is a compile-time error. The `FeatureFlag` type is derived from the `featureFlags` object keys, so all flag references are checked by TypeScript.
  - Environment-specific configuration: the same flag can be `true` in dev, `true` in staging, and `false` in production, controlled entirely through ECS task definition environment variables.
  - Built-in audit trail: every flag change requires a deployment, which is recorded in the ECS deployment history and CI/CD pipeline logs. There is no way to change a flag without a traceable deployment event.
  - Developers can reason about flag state by reading the code. No external dashboard, no API calls, no sync issues between a remote flag service and the running application.
  - Flag-protected code paths are easily searchable: `grep -r "isEnabled(" lib/ app/` finds all flag usage across the codebase.

- **Negative:**
  - Changing a flag requires a deployment. There is no "runtime toggle" to quickly enable or disable a feature. For emergency situations (disabling a broken feature in production), this means deploying a new ECS task definition. Mitigated by: (a) blue/green deployment means the new task definition is live within 2-3 minutes, and (b) the `MAINTENANCE_MODE` flag can disable the entire application without code changes.
  - No percentage-based rollouts. A flag is either on or off for all users in an environment. Mitigated by: (a) staging environment serves as the "canary" with all flags enabled, and (b) if A/B testing becomes necessary, AppConfig or LaunchDarkly can be introduced for specific flags without changing the overall architecture.
  - No user-level targeting. All users in an environment see the same flag state. If a specific team needs early access to a feature, the only mechanism is a separate environment (e.g., a "beta" ECS service with flags enabled). This is adequate for 2026 but may not scale.
  - Flag cleanup discipline is required. Flags for fully-launched features (e.g., `COLLECTIONS_BROWSER` after Q1 launch) must be removed from the codebase. Left uncleaned, the flag list grows indefinitely and becomes confusing. Mitigated by: adding a `// TODO: Remove after Q1 launch` comment on each flag and reviewing in quarterly retrospectives.

- **Risks:**
  - If requirements evolve to include A/B testing, percentage-based rollouts, or user-level targeting (e.g., for the Agentic AI features referenced in WP4), the environment-variable approach will be insufficient. The recommended upgrade path is AWS AppConfig for simple targeting or LaunchDarkly for sophisticated experimentation. The `isEnabled()` function signature is stable and can be re-implemented to read from any source.

### Related Decisions

- [ADR-004: Monorepo Structure](#adr-004-monorepo-structure) -- Feature flags allow deploying the entire application while selectively enabling modules, mitigating the monorepo's deployment coupling risk.
- [ADR-001: Next.js API Routes as Backend](#adr-001-nextjs-api-routes-as-backend) -- Flags are evaluated server-side at build time, available to both SSR and API routes.

---

## ADR-010: Testing Approach

**Status:** Accepted
**Date:** 2026-02-06
**Deciders:** Keith Hayes (Lead Engineer)

### Context

The POC has minimal automated testing -- only Playwright is configured (in `devDependencies`) and is used for screenshot capture rather than functional E2E testing. The transition to production requires a comprehensive testing strategy that satisfies:

1. **Regulatory auditability:** The audit trail (`VS2-350`), approval workflows (`VS2-339`), and cross-TA coordination (`VS2-349`) involve business-critical logic that must be verified.
2. **Refactoring confidence:** The POC-to-production migration (see `01-architecture-overview.md` Appendix B) involves significant restructuring. Tests must catch regressions during this transition.
3. **CI/CD integration:** Tests must run in GitHub Actions (see `01-architecture-overview.md` Section 5, Deployment Pipeline) within reasonable time budgets.
4. **Developer velocity:** With 0.5 FTE lead engineer allocation, the testing approach must maximise coverage per hour of test-writing effort. Slow test suites or brittle tests are a direct tax on feature delivery.

The testing strategy must cover:
- Unit tests for service-layer business logic (approval routing, d-code resolution, audit event creation)
- Component tests for interactive UI elements (collection wizard steps, approval queue, filter panels)
- Integration tests for tRPC procedures with database interaction
- E2E tests for critical user workflows (collection creation, approval chain, access request)

### Decision

Adopt a three-layer testing strategy:

1. **Vitest** for unit and integration tests (service layer, tRPC procedures, utilities, validation schemas)
2. **React Testing Library** (with Vitest) for component-level tests (React components rendered in isolation with mocked data)
3. **Playwright** for end-to-end tests (full browser automation of critical user workflows)

**Test pyramid allocation:**

| Layer | Tool | Scope | Target Coverage | Run Time Budget |
|-------|------|-------|-----------------|-----------------|
| Unit | Vitest | Service functions, utilities, Zod schemas, pure logic | >90% of `lib/services/`, `lib/validation/` | <30s total |
| Component | Vitest + React Testing Library | React components with user interactions | Key interactive components (wizard steps, approval actions, filter panels) | <60s total |
| Integration | Vitest + Drizzle test helpers | tRPC procedures with test database | All tRPC mutation procedures | <120s total |
| E2E | Playwright | Full browser workflows | 5-10 critical user journeys | <5 min total |

**Test infrastructure:**

- Vitest is configured as the test runner for all non-E2E tests, replacing Jest.
- Integration tests use a test PostgreSQL database (Docker container in CI, local PostgreSQL in development) with Drizzle ORM migrations applied before each test suite and transactions rolled back after each test.
- Playwright tests run against a `next build && next start` instance with a seeded test database. Tests are parallelized across Chromium workers.
- All tests run in GitHub Actions on every pull request. E2E tests run in parallel with a separate job to avoid blocking the faster unit/component tests.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not |
|-------------|------|------|---------|
| **Jest instead of Vitest** | Industry standard; largest ecosystem; extensive documentation; works with TypeScript via ts-jest or SWC | Slower than Vitest (Jest runs tests in separate worker processes; Vitest uses native ESM with Vite's transform pipeline); Jest configuration for ESM/TypeScript is notoriously complex; `jest.config.ts` + `ts-jest` or `@swc/jest` setup is finicky; does not natively support Vite/Turbopack module resolution | Vitest is designed for the Vite/Turbopack ecosystem that Collectoid uses (see `package.json`: `"dev": "next dev --turbopack"`). Vitest runs 2-5x faster than Jest for TypeScript projects because it uses the same transform pipeline as the build tool. The API is Jest-compatible (`describe`, `it`, `expect`), so the team's Jest muscle memory transfers directly. Configuration is a single `vitest.config.ts` that extends the Vite config. |
| **Cypress instead of Playwright** | Excellent developer experience; time-travel debugging; real browser rendering; built-in retry logic; widely adopted | Single-browser focus (Chromium-based with experimental Firefox/WebKit); slower than Playwright for parallel execution; Cypress Dashboard (cloud replay) is paid; iframe/multi-tab testing is limited; does not support server-side testing | Playwright supports Chromium, Firefox, and WebKit natively, which matters for the browser support requirements in `02-business-requirements.md` Section 5.6 (Chrome primary, Edge secondary, Firefox tertiary). Playwright's parallelization is more efficient, running tests across multiple browser contexts simultaneously. Playwright also supports API testing (useful for testing tRPC endpoints directly) and has first-class support for Next.js's server-side rendering. |
| **React Testing Library only** (without Vitest for unit tests) | Fewer tools to learn; test components in isolation; encourage testing from the user's perspective | Not suitable for testing service-layer logic, database interactions, or tRPC procedures; component tests are slower than pure unit tests; cannot test validation schemas or utility functions | React Testing Library is the right tool for component testing but is not a general-purpose test runner. Service-layer functions (approval routing logic, d-code resolution, audit event creation) are pure TypeScript functions that should be tested without DOM rendering overhead. Vitest handles these at sub-millisecond speed. |

### Consequences

- **Positive:**
  - Vitest's speed (2-5x faster than Jest) keeps the test suite fast enough to run on every save during development. A 30-second unit test suite encourages TDD; a 5-minute suite discourages running tests entirely.
  - React Testing Library's "test from the user's perspective" philosophy produces tests that are resilient to refactoring. Testing "click the Approve button and verify the success message appears" rather than "verify the internal state machine transitions" means tests survive component restructuring.
  - Playwright's Chromium, Firefox, and WebKit support satisfies the multi-browser testing requirement from `02-business-requirements.md` NFR-BRWS-001 through NFR-BRWS-003 in a single test suite.
  - Integration tests with a real PostgreSQL database (via Docker in CI) catch database-level issues (constraint violations, transaction isolation, JSONB query behavior) that mocked database tests would miss. This is especially important for the audit trail immutability enforcement (database triggers preventing UPDATE/DELETE on `audit_events`).
  - Playwright's `page.request` API enables testing tRPC endpoints directly, verifying the full middleware chain (auth, RBAC, validation) without browser rendering overhead. This is useful for API-focused regression tests.
  - All three tools have excellent TypeScript support, providing type-safe test authoring that catches test-level type errors at compile time.

- **Negative:**
  - Three testing tools (Vitest, React Testing Library, Playwright) means three configuration files, three sets of utilities, and three mental models. Mitigated by: (a) Vitest + React Testing Library share the same runner and configuration, and (b) clear documentation defines which tool to use for each test type.
  - Integration tests with a real database are slower than mocked tests and require Docker in CI. Mitigated by: running the test database as a GitHub Actions service container (starts in <5s), using transaction rollback for test isolation (no per-test migration overhead), and running integration tests in parallel with unit tests.
  - Playwright E2E tests are inherently slower and more brittle than unit tests. Mitigated by: limiting E2E tests to 5-10 critical workflows, using Playwright's auto-waiting and retry mechanisms, and running E2E tests as a separate CI job that does not block the unit/component test pipeline.
  - Test database seeding and management adds setup complexity. Mitigated by: a `scripts/seed-test-db.ts` script that creates deterministic test data, and Drizzle ORM's migration tooling that applies schema changes automatically before test runs.

- **Risks:**
  - If the team deprioritises test writing under delivery pressure (a significant risk at 0.5 FTE lead engineer allocation), the test suite will lag behind feature development. Mitigated by: (a) CI pipeline requires passing tests before merge, (b) minimum coverage thresholds on `lib/services/` and `lib/validation/`, and (c) quarterly test health review as part of the risk register process (`06-risk-register.md`).
  - E2E test flakiness can erode team trust in the test suite, leading to "retry and ignore" behavior. Mitigated by: Playwright's auto-waiting, deterministic test data seeding, and a flaky-test quarantine process (flaky tests are moved to a non-blocking job and fixed within one sprint).

### Related Decisions

- [ADR-001: Next.js API Routes as Backend](#adr-001-nextjs-api-routes-as-backend) -- tRPC procedures are tested as function calls in Vitest without HTTP mocking.
- [ADR-002: Aurora PostgreSQL with JSONB Columns](#adr-002-aurora-postgresql-with-jsonb-columns) -- Integration tests use a real PostgreSQL database to verify JSONB queries, constraint enforcement, and audit trail triggers.
- [ADR-006: tRPC for Internal API Communication](#adr-006-trpc-for-internal-api-communication) -- tRPC procedures are trivially testable as functions, which was a factor in choosing tRPC over REST.
- [ADR-007: Audit Trail Implementation](#adr-007-audit-trail-implementation) -- Integration tests verify the immutability triggers on the `audit_events` table (attempting UPDATE/DELETE and confirming they fail).

---

## ADR Cross-Reference Matrix

The following matrix shows how the ten architecture decisions relate to each other and to key requirements:

| ADR | Depends On | Depended On By | Key Requirements |
|-----|-----------|----------------|------------------|
| **001: Next.js API Routes** | -- | 003, 004, 005, 006, 009 | NFR-PERF-001 (page load), Team capacity (5.3 FTE) |
| **002: Aurora PostgreSQL** | -- | 007, 008, 010 | NFR-SEC-004 (audit immutability), VS2-339 (ACID approvals), VS2-350 (audit trail) |
| **003: Auth.js Azure AD** | 001 | 008 | NFR-SEC-001 (SSO), NFR-SEC-002 (RBAC), VS2-339 (approval identity) |
| **004: Monorepo** | 001 | 005, 006, 009 | Team capacity (5.3 FTE), Q1-Q4 delivery cadence |
| **005: State Management** | 001, 004 | 006 | NFR-PERF-002 (search latency), VS2-339 (optimistic approval updates) |
| **006: tRPC** | 001, 002, 004, 005 | 010 | End-to-end type safety, developer velocity |
| **007: Audit Trail** | 002 | 008 | VS2-335, VS2-350, STND-0001498, ICH E6(R2) |
| **008: Caching Strategy** | 002, 003, 007 | -- | NFR-PERF-001, NFR-AVAIL-005 (graceful degradation) |
| **009: Feature Flags** | 001, 004 | -- | Q1-Q4 gradual rollout, deployment coupling mitigation |
| **010: Testing** | 001, 002, 006, 007 | -- | Regulatory auditability, refactoring confidence, CI/CD quality gate |

---

## Open Questions

The following open questions from other sprint-zero documents directly affect the technical decisions in this document:

| Question | From Document | Affects ADR(s) | Impact |
|----------|---------------|----------------|--------|
| **[QUESTION-001]** Is Aurora PostgreSQL in the AZ approved AWS services list? | `01-architecture-overview.md` | ADR-002, ADR-007, ADR-008 | If not approved, fallback is RDS PostgreSQL (preserves schema, increases ops overhead) |
| **[QUESTION-006]** Does AZCT support webhooks or change notifications? | `01-architecture-overview.md` | ADR-008 | If yes, cache invalidation shifts from TTL-based to event-driven, reducing staleness from 1 hour to near-real-time |
| **[QUESTION-012]** Which Azure AD groups map to Collectoid roles? | `01-architecture-overview.md` | ADR-003 | Blocks RBAC implementation; must be resolved before Q1 MVP |
| **[QUESTION-015]** Audit log retention requirement? | `01-architecture-overview.md` | ADR-002, ADR-007 | Determines partitioning strategy, archival automation, and storage sizing |
| **[QUESTION-019]** Expected concurrent user count at launch? | `01-architecture-overview.md` | ADR-001, ADR-008 | Validates scaling assumptions (200 concurrent users) for monolithic API and Redis cache sizing |

---

*This document is a living artifact. Each ADR may be updated from "Accepted" to "Superseded" if new information changes the decision landscape. All changes should be tracked via pull request with review from the engineering lead. New ADRs should be appended with sequential numbering (ADR-011, ADR-012, etc.).*

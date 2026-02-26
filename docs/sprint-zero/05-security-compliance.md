# 05 - Security & Compliance

**Document:** Collectoid Production Security & Compliance Specification
**Document ID:** SPRINT-ZERO-05
**Version:** 1.0
**Date:** 2026-02-06
**Status:** Draft -- Pending Security Review
**Authors:** Architecture Team
**Program:** DOVS2 (Data Office Value Stream 2), WP4 -- UI & Agentic AI
**Classification:** AstraZeneca Internal -- Strictly Confidential

---

**Cross-References**

| Document | Path | Relevance |
|----------|------|-----------|
| Architecture Overview | `docs/sprint-zero/01-architecture-overview.md` | VPC topology, deployment architecture, middleware chain, caching strategy |
| Business Requirements | `docs/sprint-zero/02-business-requirements.md` | NFR-SEC-001 through NFR-SEC-007, compliance requirements, persona definitions |
| Data Model | `docs/sprint-zero/03-data-model.md` | Audit trail schema, immutability enforcement, versioning strategy, retention policy |
| Gap Analysis | `docs/specs/collectoid-v2-gap-analysis.md` | JIRA stories VS2-335 (versioning), VS2-339 (approval execution), VS2-350 (audit trail) |
| UX Roles & System Design | `docs/collectoid-v2-ux-roles.md` | Role definitions, permission matrices, approval routing logic |
| Roles Matrix | `docs/collectoid-v2-roles-matrix.md` | Real-world AZ role mappings, multi-TA approval requirement |

**Governing Standards**

| Standard | ID | Applicability |
|----------|----|---------------|
| Global Standard: Internal Sharing of Scientific Data | STND-0001498 | Primary governance framework for all data sharing within Collectoid |
| SOP: Internal Sharing of Scientific Data | SOP-0067196 | Operational procedures for data sharing |
| ROAM Guidance | v1.1 | Role-based Open Access Model -- defines the 90:10 access paradigm |
| ICH E6(R2) | GCP | Clinical data traceability requirements |
| AstraZeneca Cybersecurity Standards | Internal | Baseline security controls for all AZ applications |

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Authentication Architecture](#2-authentication-architecture)
3. [Authorization Model (RBAC)](#3-authorization-model-rbac)
4. [Audit Trail Requirements](#4-audit-trail-requirements)
5. [Data Classification](#5-data-classification)
6. [Encryption](#6-encryption)
7. [API Security](#7-api-security)
8. [Secret Management](#8-secret-management)
9. [Network Security](#9-network-security)
10. [Vulnerability Management](#10-vulnerability-management)
11. [Compliance Frameworks](#11-compliance-frameworks)
12. [Incident Response](#12-incident-response)
13. [Open Questions](#13-open-questions)

---

## 1. Executive Summary

### 1.1 Security Posture Overview

Collectoid is AstraZeneca's clinical trial data access platform, managing governance and access control for **strictly confidential** clinical trial data across all therapeutic areas. While Collectoid itself does not store raw patient data, it manages metadata, access decisions, approval workflows, and audit trails that directly govern who can access clinical trial datasets in downstream systems (PDP, Starburst, Domino, SCP, AI Bench).

The security architecture is designed around three foundational principles:

1. **Defence in depth** -- Multiple independent security layers ensure no single point of failure compromises the system. Authentication at the identity provider, authorization at the application, encryption at the transport and storage layers, and network isolation at the infrastructure layer all operate independently.

2. **Least privilege** -- Every user, service, and component operates with the minimum permissions required. RBAC enforces role-based access to features. Database credentials are scoped per service. Network security groups restrict traffic to only necessary paths.

3. **Auditability by default** -- Every state-changing operation produces an immutable audit record. This is not optional; the audit trail is a regulatory requirement under STND-0001498 and ICH E6(R2). The system is designed so that it is impossible to make a governance decision without leaving a traceable record.

### 1.2 Compliance Commitments

| Commitment | Implementation | Verification |
|------------|---------------|--------------|
| All access decisions are auditable | Append-only `audit_events` table with immutability triggers (see `03-data-model.md`, Section 4) | Quarterly compliance audit report; tamper-evident checksums |
| Authentication via corporate SSO only | Azure AD / Entra ID via Auth.js OIDC; no local credentials | No password storage; no local user database for auth |
| Data classified as strictly confidential is protected at rest and in transit | AES-256 at rest (Aurora, S3, ElastiCache); TLS 1.2+ in transit | Annual penetration test; automated certificate monitoring |
| Role-based access control enforces separation of duties | Seven system roles with explicit permission matrices; middleware enforcement on every API route | Automated RBAC tests in CI; role assignment audit log |
| Training compliance is verified before data access | Cornerstone API integration validates training completion | Training status checked at access request creation and periodically re-validated |
| Multi-TA approval operates with "all or nothing" atomicity | Database transactions ensure atomic state transitions; approval chain cannot partially commit | Transaction isolation tests; approval workflow integration tests |
| Secrets never appear in code, logs, or error messages | AWS Secrets Manager; structured logging with PII scrubbing; sanitised error responses | Automated secret scanning in CI (git-secrets, truffleHog); log review |

### 1.3 Threat Model Summary

| Threat Category | Risk Level | Primary Mitigations |
|-----------------|------------|---------------------|
| Unauthorized access to clinical trial metadata | HIGH | Azure AD SSO, RBAC, session management, VPN/WAF |
| Privilege escalation (user accessing features beyond their role) | HIGH | Server-side RBAC enforcement on every API route, permission matrix validation |
| Audit trail tampering | CRITICAL | Database triggers prevent UPDATE/DELETE; append-only architecture; separate audit DB credentials |
| Session hijacking | MEDIUM | Secure cookies (HttpOnly, SameSite=Strict, Secure), short-lived tokens, server-side session validation |
| Data exfiltration via API abuse | MEDIUM | Rate limiting, request size limits, data classification controls, no bulk export of sensitive fields |
| External API compromise (AZCT, Immuta, Cornerstone) | MEDIUM | Circuit breakers, credential rotation, input validation on external responses |
| Supply chain attack (compromised npm dependency) | MEDIUM | Dependency scanning (Snyk/Dependabot), lockfile enforcement, container image scanning |
| DDoS / availability attack | LOW-MEDIUM | CloudFront, WAF rate limiting, auto-scaling, AZ VPN restriction |

---

## 2. Authentication Architecture

### 2.1 Azure AD OIDC Flow

Collectoid uses Azure AD (Entra ID) as its sole identity provider via the OpenID Connect (OIDC) protocol, implemented through Auth.js (NextAuth.js v5+). There are no local user accounts or passwords.

**Step-by-Step Authentication Flow:**

```
User                    Collectoid (Next.js)         Azure AD / Entra ID
 |                            |                              |
 | 1. GET /collectoid         |                              |
 |--------------------------->|                              |
 |                            | 2. Check session cookie      |
 |                            |    (no valid session found)   |
 |                            |                              |
 | 3. 302 Redirect            |                              |
 |<---------------------------|                              |
 | Location: /api/auth/signin |                              |
 |                            |                              |
 | 4. GET /api/auth/signin    |                              |
 |--------------------------->|                              |
 |                            | 5. Generate PKCE code_verifier + code_challenge
 |                            |    Generate state parameter (CSRF)
 |                            |    Generate nonce
 |                            |    Store in encrypted cookie
 |                            |                              |
 | 6. 302 Redirect to Azure AD                               |
 |<---------------------------|                              |
 | Location: https://login.microsoftonline.com/{tenant}/     |
 |   oauth2/v2.0/authorize?                                  |
 |   client_id={app_id}&                                     |
 |   redirect_uri={callback_url}&                            |
 |   response_type=code&                                     |
 |   scope=openid profile email User.Read GroupMember.Read.All&
 |   state={csrf_state}&                                     |
 |   nonce={nonce}&                                          |
 |   code_challenge={challenge}&                             |
 |   code_challenge_method=S256                              |
 |                            |                              |
 | 7. User authenticates at Azure AD login page              |
 |---------------------------------------------------------->|
 |                            |                              |
 |                            |    (MFA if enforced by       |
 |                            |     Azure AD Conditional     |
 |                            |     Access policy)           |
 |                            |                              |
 | 8. Azure AD redirects with authorization code             |
 |<----------------------------------------------------------|
 | Location: /api/auth/callback/azure-ad?                    |
 |   code={auth_code}&state={csrf_state}                     |
 |                            |                              |
 | 9. GET /api/auth/callback  |                              |
 |--------------------------->|                              |
 |                            | 10. Validate state (CSRF)    |
 |                            |                              |
 |                            | 11. Exchange code for tokens |
 |                            |----------------------------->|
 |                            | POST /oauth2/v2.0/token      |
 |                            |   code={auth_code}           |
 |                            |   code_verifier={verifier}   |
 |                            |   client_id + client_secret  |
 |                            |                              |
 |                            | 12. Receive tokens           |
 |                            |<-----------------------------|
 |                            |   access_token (JWT, 1hr)    |
 |                            |   id_token (JWT)             |
 |                            |   refresh_token (opaque)     |
 |                            |                              |
 |                            | 13. Validate id_token:       |
 |                            |   - Verify JWT signature     |
 |                            |     (Azure AD JWKS endpoint) |
 |                            |   - Verify nonce             |
 |                            |   - Verify aud = client_id   |
 |                            |   - Verify iss = AZ tenant   |
 |                            |   - Verify exp > now()       |
 |                            |                              |
 |                            | 14. Extract user profile:    |
 |                            |   - oid (Azure AD object ID) |
 |                            |   - preferred_username       |
 |                            |   - name                     |
 |                            |   - email                    |
 |                            |   - groups (if configured)   |
 |                            |                              |
 |                            | 15. Upsert user in DB:       |
 |                            |   - Match on azure_ad_id     |
 |                            |   - Update display_name,     |
 |                            |     email, department        |
 |                            |   - Map AD groups to roles   |
 |                            |                              |
 |                            | 16. Create server-side       |
 |                            |     session in Redis:        |
 |                            |   - Session ID (random)      |
 |                            |   - User ID                  |
 |                            |   - Roles                    |
 |                            |   - Access token (encrypted) |
 |                            |   - Refresh token (encrypted)|
 |                            |   - Expiry (24hr sliding)    |
 |                            |                              |
 | 17. Set session cookie     |                              |
 |<---------------------------|                              |
 |   Set-Cookie:              |                              |
 |     __Secure-next-auth.    |                              |
 |     session-token={sid};   |                              |
 |     HttpOnly; Secure;      |                              |
 |     SameSite=Strict;       |                              |
 |     Path=/; Max-Age=86400  |                              |
 |                            |                              |
 | 18. 302 Redirect to        |                              |
 |     original destination   |                              |
 |<---------------------------|                              |
 |                            |                              |
 | 19. GET /collectoid        |                              |
 |--------------------------->|                              |
 |                            | 20. Validate session cookie  |
 |                            |     Lookup session in Redis   |
 |                            |     Session valid -> proceed  |
 |                            |                              |
 | 21. 200 OK (authenticated) |                              |
 |<---------------------------|                              |
```

### 2.2 Auth.js / NextAuth.js Integration Design

**Configuration Outline:**

```typescript
// lib/auth/config.ts
import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const { handlers, auth, signIn, signOut } = NextAuth({
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
    strategy: "database",  // Server-side sessions in Redis/PostgreSQL
    maxAge: 24 * 60 * 60,  // 24 hours absolute expiry
    updateAge: 30 * 60,    // Refresh session on activity every 30 min
  },
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store Azure AD tokens for downstream API calls
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.azureAdId = profile?.oid;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach Collectoid roles to session
      session.user.roles = await getUserRoles(token.azureAdId);
      session.user.azureAdId = token.azureAdId;
      return session;
    },
    async signIn({ user, account, profile }) {
      // Upsert user in Collectoid DB on every sign-in
      await upsertUser(profile);
      // Map Azure AD groups to Collectoid roles
      await syncRolesFromAzureAD(profile.oid, profile.groups);
      return true;
    },
  },
  events: {
    async signIn({ user }) {
      // Audit: user login
      await auditLog("user.signed_in", user.id);
    },
    async signOut({ token }) {
      // Audit: user logout
      await auditLog("user.signed_out", token.sub);
    },
  },
});
```

**Key Design Decisions:**

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Session strategy | Server-side (database/Redis) | Enables session revocation, consistent session state across ECS tasks, no sensitive data in client cookies |
| PKCE | Enabled (S256) | Prevents authorization code interception; required for public clients, recommended for all |
| Token storage | Server-side only (encrypted in Redis) | Access tokens and refresh tokens never reach the browser |
| Group claims | Via Microsoft Graph API on sign-in | Azure AD token size limit (header overhead) makes group claims in ID token unreliable for large group memberships; Graph API is more reliable |

### 2.3 Token Management

| Token | Storage Location | Lifetime | Renewal Strategy |
|-------|-----------------|----------|------------------|
| **Authorization code** | Transient (URL parameter, consumed immediately) | Single use, ~10 minutes | N/A |
| **ID token** | Server-side only (validated and discarded after user info extraction) | ~1 hour | Not renewed; re-authentication if needed |
| **Access token** | Encrypted in Redis session store | 1 hour (Azure AD default) | Automatically refreshed using refresh token when session is active |
| **Refresh token** | Encrypted in Redis session store | 90 days (Azure AD default) | Used to obtain new access tokens; revoked on sign-out |
| **Session token** | Browser cookie (`__Secure-next-auth.session-token`) | 24 hours (absolute), 30 minutes (inactivity sliding window) | Extended on user activity; new session ID on role change |
| **CSRF token** | Browser cookie + hidden form field | Per-request | Generated by Auth.js; validated on all state-changing operations |

**Token Refresh Flow:**

```
User Request                    Collectoid                     Azure AD
     |                              |                              |
     | API request with session     |                              |
     |----------------------------->|                              |
     |                              | Check: is access_token       |
     |                              | expired?                     |
     |                              |                              |
     |                              | YES: use refresh_token       |
     |                              |----------------------------->|
     |                              | POST /oauth2/v2.0/token      |
     |                              |   grant_type=refresh_token   |
     |                              |   refresh_token={rt}         |
     |                              |                              |
     |                              | New access_token + refresh   |
     |                              |<-----------------------------|
     |                              |                              |
     |                              | Update Redis session with    |
     |                              | new tokens                   |
     |                              |                              |
     | Response (transparent)       |                              |
     |<-----------------------------|                              |
```

### 2.4 Session Handling

**Server-Side Session Model (Recommended):**

Sessions are stored in Redis (ElastiCache) as the primary session store, with Aurora PostgreSQL as a fallback for session persistence during Redis failover.

**Session Record Structure:**

```json
{
  "sessionId": "ses_a1b2c3d4e5f6",
  "userId": "uuid-user-123",
  "azureAdId": "azure-oid-456",
  "email": "sarah.chen@astrazeneca.com",
  "displayName": "Sarah Chen",
  "roles": ["dcm", "admin"],
  "collectionRoles": {
    "col-uuid-1": "owner",
    "col-uuid-2": "member"
  },
  "accessToken": "<encrypted>",
  "refreshToken": "<encrypted>",
  "tokenExpiresAt": "2026-02-06T11:30:00Z",
  "createdAt": "2026-02-06T09:00:00Z",
  "lastActivityAt": "2026-02-06T10:45:00Z",
  "expiresAt": "2026-02-07T09:00:00Z",
  "ipAddress": "10.0.1.50",
  "userAgent": "Mozilla/5.0..."
}
```

**Session Lifecycle Rules:**

| Rule | Value | Behaviour |
|------|-------|-----------|
| Absolute expiry | 24 hours | Session expires regardless of activity; user must re-authenticate |
| Inactivity timeout | 30 minutes | Session expires after 30 minutes of no requests (per NFR-SEC-005 in BRD) |
| Sliding window | 30 minutes | Each request resets the inactivity timer |
| Session rotation | On privilege change | New session ID issued when roles change (prevents session fixation) |
| Concurrent sessions | Allowed (max 5 per user) | Users may have multiple active sessions (different browsers/devices) |
| Forced revocation | Admin action | Admin can revoke all sessions for a user (e.g., during incident response) |

### 2.5 Multi-Tab / Multi-Device Session Behaviour

| Scenario | Behaviour |
|----------|-----------|
| User opens Collectoid in a new tab | Same session cookie is shared; same session in Redis; no additional authentication required |
| User opens Collectoid in a different browser | New authentication flow; new session created; both sessions valid simultaneously |
| User's role changes while session is active | Next request detects stale role data (Redis session is invalidated on role change event); re-fetches roles from DB; new session ID issued |
| Admin revokes user's access | All Redis sessions for that user are deleted; next request from any tab/device triggers re-authentication; if Azure AD access is also revoked, re-authentication fails |
| Azure AD password change / MFA reset | Refresh token may be revoked by Azure AD; next token refresh attempt fails; user is redirected to re-authenticate |

### 2.6 SSO Logout / Single Sign-Out

**Sign-Out Flow:**

```
User                    Collectoid                     Azure AD
 |                            |                              |
 | 1. Click "Sign Out"        |                              |
 |--------------------------->|                              |
 |                            | 2. Audit log: user.signed_out|
 |                            | 3. Delete Redis session       |
 |                            | 4. Clear session cookie       |
 |                            |                              |
 | 5. 302 Redirect to Azure AD logout endpoint               |
 |<---------------------------|                              |
 | Location: https://login.microsoftonline.com/{tenant}/     |
 |   oauth2/v2.0/logout?                                     |
 |   post_logout_redirect_uri={collectoid_url}&              |
 |   id_token_hint={id_token}                                |
 |                            |                              |
 | 6. Azure AD terminates SSO session                        |
 |---------------------------------------------------------->|
 |                            |                              |
 | 7. Redirect back to Collectoid landing page               |
 |<----------------------------------------------------------|
```

**[QUESTION-SEC-001]** Does AZ require front-channel logout (where Azure AD notifies all relying parties when a user signs out of any SSO application)? If so, Collectoid must implement a front-channel logout endpoint that Azure AD can call to invalidate the local session. Auth.js supports this via the `logout` event.

---

## 3. Authorization Model (RBAC)

### 3.1 Role Definitions

Collectoid implements a hybrid RBAC model with two layers:

1. **System-level roles** -- Control access to application features and modules
2. **Collection-level roles** -- Control what a user can do within a specific collection

**System-Level Roles:**

| Role ID | Display Name | Description | Assignment Mechanism |
|---------|-------------|-------------|---------------------|
| `dcm` | Data Collection Manager | Creates and manages data collections. Defines OAC scope, AoT terms, and collection criteria. Routes approvals. Manages datasets and users within collections. Primary "power user" role. | Azure AD group: `SG-Collectoid-DCM` |
| `approver` | Approver (TA Lead / DDO) | Reviews and approves/rejects OAC Agreements and AoTs. Participates in quarterly opt-in/opt-out reviews. Can flag studies for exclusion. Approval routing is determined by the workflow, not the role (single Approver role handles DDO, GPT, TALT, and Alliance approval types). **Note (Immuta alignment):** The Immuta data model defines three approval tiers (Data Steward/DPM, Source Owner, Power User - TALT). Collectoid collapses these into a single system role; the tier distinction is captured in `approvals.team` metadata rather than as separate roles. | Azure AD group: `SG-Collectoid-Approver` |
| `data_consumer` | Data Consumer (Researcher) | Discovers available collections. Requests access. Views collection terms and their own access status. Tracks request progress. Completes training requirements. | Azure AD group: `SG-Collectoid-Consumer` |
| `data_consumer_lead` | Data Consumer Lead | Oversees team data access. Accountable for team compliance with AoT terms. Can request access on behalf of team members. Views team-level activity and compliance dashboards. | Azure AD group: `SG-Collectoid-ConsumerLead` |
| `dpo` | DPO Operations | Validates due diligence. Configures Immuta/Ranger/Starburst policies. Tracks delivery progress. Collectoid surfaces DPO-related data as read-only; DPO-specific operations happen in external systems. Staff needing Collectoid write access use the DCM role. | Azure AD group: `SG-Collectoid-DPO` |
| `r_and_d_data_office_lead` | R&D Data Office Lead | Owns OAC and AoT creation. Facilitates compliance audits. Manages the overall ROAM program within Collectoid. Superset of DCM permissions plus compliance audit and reporting functions. | Azure AD group: `SG-Collectoid-DataOfficeLead` |
| `admin` | System Administrator | Full system administration. Manages user accounts, role assignments, system configuration, feature flags. Can view (but not modify or delete) audit logs. | Azure AD group: `SG-Collectoid-Admin` |

### 3.2 Permission Matrix

The following matrix defines which actions each system-level role may perform. Actions are grouped by module.

#### 3.2.1 Collections Module

| Action | DCM | Approver | Consumer | Consumer Lead | DPO | Data Office Lead | Admin |
|--------|-----|----------|----------|---------------|-----|------------------|-------|
| Create collection | **Yes** | No | No | No | No | **Yes** | No |
| Edit draft collection | **Yes** | No | No | No | No | **Yes** | No |
| Delete draft collection | **Yes** | No | No | No | No | **Yes** | No |
| Submit for approval | **Yes** | No | No | No | No | **Yes** | No |
| View all collections | **Yes** | Own TA only | Approved only | Team's only | **Yes** (read-only) | **Yes** | **Yes** |
| View collection detail | **Yes** | Own TA only | Approved only | Team's only | **Yes** (read-only) | **Yes** | **Yes** |
| Manage datasets in collection | **Yes** | No | No | No | No | **Yes** | No |
| Manage users in collection | **Yes** | No | No | Own team | No | **Yes** | No |
| Archive collection | **Yes** | No | No | No | No | **Yes** | No |
| View version history | **Yes** | **Yes** | No | No | **Yes** | **Yes** | **Yes** |
| Compare versions | **Yes** | **Yes** | No | No | **Yes** | **Yes** | **Yes** |

#### 3.2.2 Access Requests Module

| Action | DCM | Approver | Consumer | Consumer Lead | DPO | Data Office Lead | Admin |
|--------|-----|----------|----------|---------------|-----|------------------|-------|
| Create access request | No | No | **Yes** | **Yes** (on behalf of team) | No | No | No |
| View own requests | **Yes** | **Yes** | **Yes** | **Yes** | No | **Yes** | **Yes** |
| View all requests | **Yes** | Own TA only | Own only | Team only | **Yes** (read-only) | **Yes** | **Yes** |
| Withdraw request | No | No | Own only | Own team only | No | No | No |
| View request tracker | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |

#### 3.2.3 Approvals Module

| Action | DCM | Approver | Consumer | Consumer Lead | DPO | Data Office Lead | Admin |
|--------|-----|----------|----------|---------------|-----|------------------|-------|
| View approval queue | No | **Yes** (own queue) | No | No | No | **Yes** | No |
| Approve / reject | No | **Yes** | No | No | No | No | No |
| Delegate approval | No | **Yes** | No | No | No | No | No |
| Request changes | No | **Yes** | No | No | No | No | No |
| View approval status | **Yes** | **Yes** | Own requests | Own team requests | **Yes** (read-only) | **Yes** | **Yes** |
| View cross-TA status | **Yes** | **Yes** (own TA) | No | No | **Yes** | **Yes** | **Yes** |
| Quarterly review decisions | No | **Yes** | No | No | No | **Yes** (initiate) | No |

#### 3.2.4 Discovery Module

| Action | DCM | Approver | Consumer | Consumer Lead | DPO | Data Office Lead | Admin |
|--------|-----|----------|----------|---------------|-----|------------------|-------|
| Browse collections | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| Full-text search | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| AI-assisted search | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| View category taxonomy | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| View "My Access" | **Yes** | **Yes** | **Yes** | **Yes** | No | **Yes** | **Yes** |

#### 3.2.5 Audit Module

| Action | DCM | Approver | Consumer | Consumer Lead | DPO | Data Office Lead | Admin |
|--------|-----|----------|----------|---------------|-----|------------------|-------|
| View audit trail (own actions) | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| View audit trail (all actions) | No | No | No | No | No | **Yes** | **Yes** |
| View audit trail (per collection) | **Yes** (own collections) | **Yes** (own TA) | No | No | **Yes** | **Yes** | **Yes** |
| Export audit reports | No | No | No | No | No | **Yes** | **Yes** |
| Generate compliance reports | No | No | No | No | No | **Yes** | **Yes** |

#### 3.2.6 Admin Module

| Action | DCM | Approver | Consumer | Consumer Lead | DPO | Data Office Lead | Admin |
|--------|-----|----------|----------|---------------|-----|------------------|-------|
| Manage user accounts | No | No | No | No | No | No | **Yes** |
| Assign / revoke roles | No | No | No | No | No | No | **Yes** |
| System configuration | No | No | No | No | No | No | **Yes** |
| Feature flag management | No | No | No | No | No | No | **Yes** |
| External system health monitoring | No | No | No | No | No | No | **Yes** |
| Manage taxonomy | No | No | No | No | No | **Yes** | **Yes** |

#### 3.2.7 Notifications Module

| Action | DCM | Approver | Consumer | Consumer Lead | DPO | Data Office Lead | Admin |
|--------|-----|----------|----------|---------------|-----|------------------|-------|
| Receive notifications | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| Configure notification preferences | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| View notification centre | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** | **Yes** |
| Send broadcast notifications | No | No | No | No | No | **Yes** | **Yes** |

### 3.3 Role Assignment Mechanism

Roles are assigned via Azure AD group membership, synchronised to Collectoid at sign-in and periodically via background sync.

**Mapping Flow:**

```
Azure AD                           Collectoid
+-----------------------+          +-------------------------+
| Azure AD Groups       |          | Collectoid Role Mapping |
|                       |  sync    |                         |
| SG-Collectoid-DCM     | -------> | role: dcm               |
| SG-Collectoid-Approver| -------> | role: approver          |
| SG-Collectoid-Consumer| -------> | role: data_consumer     |
| SG-Collectoid-        |          |                         |
|   ConsumerLead        | -------> | role: data_consumer_lead|
| SG-Collectoid-DPO     | -------> | role: dpo               |
| SG-Collectoid-        |          |                         |
|   DataOfficeLead      | -------> | role: r_and_d_data_     |
|                       |          |   office_lead           |
| SG-Collectoid-Admin   | -------> | role: admin             |
+-----------------------+          +-------------------------+
```

**Sync Behaviour:**

1. **On sign-in:** Auth.js `signIn` callback queries Microsoft Graph API for the user's group memberships. Groups matching the `SG-Collectoid-*` pattern are mapped to Collectoid roles and stored in `user_roles`.
2. **Background sync:** A scheduled ECS task runs every 15 minutes to detect group membership changes for active users. Role changes trigger session invalidation (user must re-authenticate to pick up new roles).
3. **Manual override:** Administrators can assign roles directly in Collectoid (persisted in `user_roles`). Manual assignments take precedence over Azure AD group sync.
4. **Audit:** Every role assignment and revocation is recorded in `audit_events` with `action = 'user.role_assigned'` or `'user.role_revoked'`.

**[QUESTION-SEC-002]** Which Azure AD groups currently exist, and do they follow the `SG-Collectoid-*` naming convention? If not, what is the naming convention and can new groups be created? Confirm with Identity Team.

### 3.4 Role Hierarchy and Inheritance

Collectoid does **not** implement role inheritance. Each role is independent and has its own explicit permission set. A user who holds multiple roles receives the **union** of permissions across all their roles.

**Example:** A user who is both `dcm` and `approver` can:
- Create and manage collections (from `dcm`)
- Approve/reject collections (from `approver`)

This is implemented by checking `user.roles.some(role => hasPermission(role, action))` in the RBAC middleware.

**Rationale:** Explicit non-hierarchical roles are simpler to audit and reason about in a regulated environment. Inheritance hierarchies can create unexpected permission escalation paths.

### 3.5 Collection-Level Roles

In addition to system-level roles, users have per-collection roles that scope their access within a specific collection.

| Collection Role | Description | Assigned By |
|-----------------|-------------|-------------|
| `owner` | Created the collection; full management authority | System (auto-assigned at creation) |
| `dcm_manager` | Can manage datasets, users, and versions within this collection | DCM / Data Office Lead |
| `approver` | Assigned as an approver for this specific collection (TA Lead, DDO, GPT) | System (auto-assigned based on TA routing) |
| `member` | Has been granted access to data within this collection | DCM / Data Office Lead |
| `viewer` | Can view collection details but has no data access | System (for discovery) |

**Data Model Reference:** These roles are stored in the `collection_members` junction table (see `03-data-model.md`, Section 2) with columns `user_id`, `collection_id`, `role`, and `assigned_at`.

### 3.6 API Route Protection Pattern

Every API route is protected by a middleware chain that enforces authentication and authorization before the route handler executes.

**Middleware Implementation Pattern:**

```typescript
// lib/auth/middleware.ts
import { auth } from "@/lib/auth/config";
import { NextResponse } from "next/server";

type Permission = {
  module: string;
  action: string;
};

export function withAuth(
  handler: Function,
  requiredPermissions: Permission[]
) {
  return async function (req: Request, context: any) {
    // Step 1: Authenticate - verify session exists and is valid
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required" } },
        { status: 401 }
      );
    }

    // Step 2: Authorize - check user has required permissions
    const userRoles = session.user.roles;
    const hasPermission = requiredPermissions.every((perm) =>
      userRoles.some((role) =>
        rolePermissions[role]?.[perm.module]?.[perm.action] === true
      )
    );

    if (!hasPermission) {
      // Audit: unauthorized access attempt
      await auditLog("security.unauthorized_access", session.user.id, {
        path: req.url,
        method: req.method,
        requiredPermissions,
        userRoles,
      });

      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "Insufficient permissions" } },
        { status: 403 }
      );
    }

    // Step 3: Proceed to route handler with authenticated context
    return handler(req, { ...context, user: session.user });
  };
}

// Usage in API route:
// app/api/collections/route.ts
export const POST = withAuth(
  async (req, { user }) => {
    // Handler logic -- user is authenticated and authorized
  },
  [{ module: "collections", action: "create" }]
);
```

**Route Protection Matrix (API Routes):**

| Route | Method | Required Permissions | Additional Checks |
|-------|--------|---------------------|-------------------|
| `/api/collections` | POST | `collections.create` | -- |
| `/api/collections` | GET | `collections.read` | Row-level filtering by role |
| `/api/collections/[id]` | PATCH | `collections.update` | Must be collection owner/manager |
| `/api/collections/[id]` | DELETE | `collections.delete` | Draft status only; must be owner |
| `/api/collections/[id]/approvals` | POST | `collections.publish` | Draft or approved status only |
| `/api/approvals/[id]/decision` | POST | `approvals.approve` | Must be assigned approver for this collection |
| `/api/requests` | POST | `requests.create` | Requester must not already have active request |
| `/api/audit` | GET | `audit.read` | Row-level filtering (own actions unless Data Office Lead / Admin) |
| `/api/audit/export` | POST | `audit.export` | Data Office Lead / Admin only |
| `/api/admin/*` | ALL | `admin.*` | Admin only |
| `/api/health` | GET | None (public) | Unauthenticated; returns system status |
| `/api/webhooks/*` | POST | Webhook signature verification | No user session; validated by shared secret + HMAC |

### 3.7 Immuta Authorization Bridge

Collectoid's RBAC governs application-level access (who can create collections, approve requests, etc.). Data-level access (who can query which studies in PDP/Domino/SCP) is governed by Immuta's authorization model:

| Layer | Governed By | Mechanism |
|-------|-----------|-----------|
| **Application access** | Collectoid RBAC (Sections 3.1-3.6) | Azure AD groups → system roles → permission matrix |
| **Data access (90% IDA)** | Immuta User Profiles | Criteria-based matching over User_Tags (Manual, NPA, Workday, Cornerstone) |
| **Data access (10% AdHoc)** | Immuta AdHoc Authorisation | Per-request approval → time-bound access grant with review cycle |
| **Row-level security** | Immuta Partitions | `Study_ID IN (...)` WHERE clauses per collection's d-code set |
| **Column-level masking** | Immuta Masking (pending) | Redaction/obfuscation of sensitive columns (PII, patient identifiers) at query time — **[TBD: mechanism not yet modelled]** |
| **Policy monitoring** | Immuta monitoring API (pending) | Reconciliation between Collectoid-approved policies and Immuta/Starburst enforcement state — **[TBD: API not yet confirmed]** |

When Collectoid approves a collection, it triggers provisioning that creates records in Immuta's `Data_Access_Intent`, `Access_Authorisation`, `Partition_Filter_Criteria`, and `User_Profile` tables (see `04-integration-map.md`, Section 4.5 for field-level mapping).

**[TBD — METADATA FLOW]:** The exact API contract for Collectoid-to-Immuta communication is unresolved. Key open items: User Profile ownership (Collectoid-created vs DPO-maintained), transactional guarantees across Immuta tables, the relationship between Immuta policies and Starburst/Ranger enforcement, column-level masking mechanism (flagged as "to be added" in PBAC diagram), and policy enforcement monitoring/reconciliation capabilities.

---

## 4. Audit Trail Requirements

The audit trail is Collectoid's most critical compliance feature. It must satisfy ICH E6(R2) traceability requirements, STND-0001498 governance mandates, and provide comprehensive audit granularity for the built-in approval workflow, capturing all state transitions, digital acknowledgements, and notification events (per gap analysis D2).

**Data Model Reference:** The complete `audit_events` table schema, immutability triggers, and retention policy are defined in `03-data-model.md`, Section 4. This section specifies the security and compliance requirements that the data model implements.

### 4.1 Auditable Events (Comprehensive List)

Every event below MUST produce an immutable `audit_events` record. No exceptions.

**Collection Lifecycle Events:**

| Event | Action Key | Trigger | Required Context |
|-------|------------|---------|------------------|
| Collection created | `collection.created` | DCM creates new collection | Collection ID, name, request type, creator |
| Collection updated | `collection.updated` | Any field change on collection | Changed fields (before/after), modifier |
| Collection published | `collection.published` | Collection made visible | Target audience |
| Collection status changed | `collection.status_changed` | Status transition | Previous status, new status, trigger (user/system) |
| Collection submitted for approval | `collection.submitted_for_approval` | DCM submits for TA Lead review | Identified approvers, TA list |
| Collection archived | `collection.archived` | DCM archives collection | Archive reason, affected user count |
| Collection version created | `collection.version_created` | Any change producing new version | Version number, change type, change summary, full snapshot reference |
| Dataset added to collection | `collection.dataset_added` | DCM adds study d-code | Dataset ID, d-code, modalities, sources |
| Dataset removed from collection | `collection.dataset_removed` | DCM removes study d-code | Dataset ID, d-code, removal reason |
| Member added to collection | `collection.member_added` | DCM adds user | User ID, collection role, justification |
| Member removed from collection | `collection.member_removed` | DCM removes user or system auto-revokes | User ID, removal reason (manual/compliance/metadata change) |
| Member role changed | `collection.member_role_changed` | DCM changes member's collection role | User ID, old role, new role |
| AI/ML permission changed | `collection.aiml_permission_changed` | DCM modifies AI/ML flags in AOT | AOT ID, flag name (`train_aiml` / `store_in_aiml`), previous value, new value |
| Data access intent modified | `collection.intent_modified` | DCM modifies permitted activities | Activity name, category, previous permitted status, new permitted status |
| Masking policy changed | `collection.masking_changed` | DCM or DPO modifies column masking rules | Collection ID, affected columns, masking type (redact/hash/null), previous rule, new rule |

**Approval Events:**

| Event | Action Key | Trigger | Required Context |
|-------|------------|---------|------------------|
| Approval requested | `approval.requested` | Collection submitted; approvers identified | Approver ID, team (GPT/TALT/DDO/Alliance), TA |
| Approval decided | `approval.decided` | Approver approves or rejects | Decision (approve/reject), comment, approver ID, team, TA |
| Approval delegated | `approval.delegated` | Approver delegates to another | Delegator, delegate, reason |
| Approval expired | `approval.expired` | SLA exceeded without decision | Approver ID, SLA threshold, escalation triggered |
| All TAs approved | `approval.all_approved` | Last required TA Lead approves | All approver decisions, collection status transition |
| Approval chain rejected | `approval.chain_rejected` | Any TA Lead rejects (all-or-nothing) | Rejecting approver, rejection reason, affected TAs |
| Approval chain invalidated | `approval.chain_invalidated` | Collection change requires re-approval | Reason (version change, scope change), previous approvals voided |
| Signature captured | `approval.signature_captured` | TA Lead provides formal signature | Digital acknowledgement method, acknowledgement reference, IP address, user agent |

**Access Request Events:**

| Event | Action Key | Trigger | Required Context |
|-------|------------|---------|------------------|
| Request created | `request.created` | Consumer submits access request | Requester, collection, intent, training status |
| Request submitted | `request.submitted` | Request formally submitted for processing | Request ID, routing decision (90-route vs 10-route) |
| Request approved | `request.approved` | Request granted | Approver chain, conditions |
| Request rejected | `request.rejected` | Request denied | Rejection reason, rejecting authority |
| Request withdrawn | `request.withdrawn` | Requester withdraws | Withdrawal reason |
| Request auto-approved | `request.auto_approved` | System auto-grants (within pre-approved scope) | Pre-approval reference, matched criteria |

**User and Access Events:**

| Event | Action Key | Trigger | Required Context |
|-------|------------|---------|------------------|
| User signed in | `user.signed_in` | Successful authentication | IP address, user agent, session ID |
| User signed out | `user.signed_out` | User or system-initiated logout | Logout trigger (user/timeout/admin) |
| User role assigned | `user.role_assigned` | Admin or sync assigns role | Role, assignment source (Azure AD sync / manual) |
| User role revoked | `user.role_revoked` | Admin or sync revokes role | Role, revocation reason |
| User access granted | `user.access_granted` | User receives data access | Collection, datasets, environments, terms |
| User access revoked | `user.access_revoked` | Access removed | Collection, reason (compliance/metadata/manual/expiry) |
| Training completed | `user.training_completed` | Cornerstone reports completion | Training name, completion date |
| Training expired | `user.training_expired` | Training certification expires | Training name, expiry date, impact on access |

**AoT Events:**

| Event | Action Key | Trigger | Required Context |
|-------|------------|---------|------------------|
| AoT created | `aot.created` | DCM creates Agreement of Terms | AoT ID, collection ID, terms summary |
| AoT version created | `aot.version_created` | Terms changed | Version number, changed fields |
| AoT approved | `aot.approved` | DDO/TA Lead approves AoT | Approver, approval chain |
| AoT revoked | `aot.revoked` | AoT withdrawn or superseded | Revocation reason, affected users |
| AoT accepted by consumer | `aot.accepted` | Data Consumer accepts terms | Consumer ID, AoT version, acceptance timestamp |

**System Events:**

| Event | Action Key | Trigger | Required Context |
|-------|------------|---------|------------------|
| External sync completed | `system.sync_completed` | AZCT/Collibra/Cornerstone sync | Source system, records synced, duration |
| External sync failed | `system.sync_failed` | Sync error | Source system, error details |
| Configuration changed | `system.config_changed` | Admin changes system setting | Setting key, old value, new value |
| Security event: unauthorized access attempt | `security.unauthorized_access` | RBAC middleware denies request | User ID, path, method, required permissions |
| Security event: rate limit exceeded | `security.rate_limit_exceeded` | Rate limiter triggers | User ID, endpoint, request count, window |

### 4.2 Audit Event Schema

Every audit event conforms to the following schema (as defined in `03-data-model.md`, Section 3.14):

```typescript
interface AuditEvent {
  // Identity
  id: string;                    // UUIDv7 (time-ordered)

  // Actor
  actor_id: string;              // FK to users.id (NULL for system events)
  actor_email: string;           // Denormalised for query efficiency
  actor_roles: string[];         // Roles at time of action (snapshot)

  // Action
  action: string;                // Structured action key (e.g., "approval.decided")

  // Target
  entity_type: string;           // "collection", "approval", "access_request", "user", "system"
  entity_id: string;             // PK of affected entity

  // Temporal
  occurred_at: string;           // ISO 8601 timestamp (UTC)

  // Context
  payload: {
    before?: Record<string, unknown>;   // State before change
    after?: Record<string, unknown>;    // State after change
    metadata?: Record<string, unknown>; // Additional context
  };

  // Request context
  ip_address: string;            // Client IP address
  user_agent: string;            // Browser user agent
  session_id: string;            // Session ID (for correlation)
  request_id: string;            // Unique request ID (for correlation)
  correlation_id: string;        // Workflow correlation ID (traces across events)

  // Integrity
  checksum: string;              // SHA-256 hash of (previous_event_checksum + payload)
}
```

### 4.3 Immutability Guarantees

The audit trail is append-only. No audit records may be updated or deleted by any user, including system administrators.

**Enforcement Layers:**

| Layer | Mechanism | Reference |
|-------|-----------|-----------|
| **Database triggers** | `BEFORE UPDATE` and `BEFORE DELETE` triggers on `audit_events` raise an exception, preventing any modification | `03-data-model.md`, Section 4.3 |
| **Application-level ORM** | Drizzle ORM configuration for `audit_events` exposes only `insert` and `select` operations; no `update` or `delete` methods | Application code review |
| **Database credentials** | The application database user has `INSERT` and `SELECT` on `audit_events`; no `UPDATE` or `DELETE` grants | Infrastructure as Code (Terraform) |
| **Chained checksums** | Each audit event includes a SHA-256 checksum computed from `(previous_checksum + event_payload)`, creating a hash chain. Any tampering breaks the chain. | Application integrity verification job |
| **Periodic integrity verification** | A scheduled job (daily) verifies the hash chain integrity. Any break triggers a P1 security alert. | Monitoring and alerting |
| **Separate audit DB user** | Audit writes use a dedicated database user (`collectoid_audit_writer`) with only `INSERT` on `audit_events`. The application's primary DB user has `SELECT` only. | Infrastructure as Code |

**[QUESTION-SEC-003]** Should audit events be replicated to a separate, independently managed audit store (e.g., AWS CloudTrail, Splunk, or a separate Aurora instance managed by the compliance team)? This would provide an independent tamper-proof copy outside the application team's control.

### 4.4 Retention Policy

Aligned with the data model retention tiers (see `03-data-model.md`, Section 4.5):

| Tier | Age | Storage | Access Method | Cost Profile |
|------|-----|---------|---------------|-------------|
| **Hot** | 0 -- 12 months | Aurora PostgreSQL (primary, no partitioning) | Full SQL query via application | Standard DB cost |
| **Warm** | 12 -- 36 months | Aurora PostgreSQL (partitioned by month) | Full SQL query via application (may be slower for range queries) | Standard DB cost |
| **Cold** | 36 -- 84 months | S3 (Parquet format, exported monthly) | Batch query via AWS Athena | Low ($0.023/GB storage + $5/TB scanned) |
| **Frozen** | 84+ months | S3 Glacier Deep Archive | Retrieval on compliance request (12-48 hour restore time) | Very low ($0.00099/GB/month) |

**Partitioning strategy (Aurora PostgreSQL):**

```sql
-- Partition audit_events by month for efficient range queries and tiering
CREATE TABLE audit_events (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ...
) PARTITION BY RANGE (occurred_at);

-- Monthly partitions
CREATE TABLE audit_events_2026_01 PARTITION OF audit_events
    FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');
CREATE TABLE audit_events_2026_02 PARTITION OF audit_events
    FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
-- ... auto-created by maintenance job
```

**[QUESTION-SEC-004]** Confirm the exact regulatory retention requirement with the compliance team. ICH E6(R2) requires 15 years for some clinical data. If audit events must be retained for 15+ years, the Frozen tier must be configured accordingly with Glacier lifecycle policies.

### 4.5 Query Access

| Role | Audit Query Scope | Export Capability |
|------|------------------|-------------------|
| Admin | All events across all entities | Yes -- full export in CSV/JSON |
| R&D Data Office Lead | All events across all entities | Yes -- full export in CSV/JSON |
| DCM | Events related to collections they manage | No |
| Approver | Events related to collections in their TA | No |
| Data Consumer Lead | Events related to their team's access | No |
| Data Consumer | Events related to their own actions only | No |
| DPO | Events related to compliance and provisioning | No |

### 4.6 Compliance Reporting

The system SHALL generate the following periodic audit reports:

| Report | Frequency | Content | Recipients |
|--------|-----------|---------|------------|
| **Access Decision Summary** | Monthly | All approval/rejection decisions with approver, timestamp, and justification | R&D Data Office Lead, Compliance |
| **Collection Change Log** | Monthly | All version changes across all collections with diff summaries | R&D Data Office Lead |
| **User Access Report** | Monthly | Current access state per user across all collections | R&D Data Office Lead, Admin |
| **Training Compliance Report** | Monthly | Users with expired or missing training certifications; impact on access | R&D Data Office Lead, Compliance |
| **Quarterly Review Summary** | Quarterly | Opt-in/opt-out decisions, study exclusions, TA Lead approvals | R&D Data Office Lead, DDOs |
| **Security Incident Report** | On occurrence | Unauthorized access attempts, rate limit violations, integrity check failures | Admin, InfoSec |
| **Audit Trail Integrity Report** | Daily (automated) | Hash chain verification result | Admin (alert on failure) |

---

## 5. Data Classification

### 5.1 Classification Levels

Collectoid handles data across multiple classification levels. The classification determines encryption, access control, logging, and retention requirements.

| Classification | Definition | Examples in Collectoid |
|---------------|------------|----------------------|
| **Strictly Confidential** | Data whose unauthorized disclosure could cause severe harm to AstraZeneca, patients, or partners. Requires maximum protection. | Clinical trial study metadata (study design, endpoints, patient counts), approval decisions, AoT terms, collection scope definitions |
| **Confidential** | Data whose unauthorized disclosure could cause significant harm. Requires strong protection. | User profiles (names, emails, PRIDs), role assignments, team membership, access request justifications |
| **Internal** | Data intended for internal use only. Standard protection. | System configuration, feature flags, notification templates, taxonomy data |
| **Public** | Data that can be shared externally without risk. Minimal protection needed. | Application health status (degraded response), public-facing documentation |

### 5.2 PII Identification

Collectoid stores the following Personally Identifiable Information (PII):

| PII Field | Entity | Classification | Handling Requirements |
|-----------|--------|---------------|----------------------|
| `display_name` | `users` | Confidential | Sourced from Azure AD; cached locally; never logged in application logs |
| `email` | `users` | Confidential | Sourced from Azure AD; used for notifications and audit; never exposed in public APIs |
| `prid` | `users` | Confidential | AstraZeneca Personnel Record ID; used for identity correlation; never exposed to non-admin users |
| `azure_ad_id` | `users` | Confidential | Azure AD Object ID; internal system identifier; never exposed to end users |
| `department` | `users` | Internal | Organisational metadata; used for filtering and routing |
| `job_title` | `users` | Internal | Used for display purposes |
| `ip_address` | `audit_events` | Confidential | Captured in audit trail for forensics; not exposed in standard reports |
| `user_agent` | `audit_events` | Internal | Captured in audit trail for forensics |
| `actor_email` | `audit_events` | Confidential | Denormalised from `users` for audit query efficiency |

**PII Minimisation Rules:**

1. Application logs (CloudWatch) MUST NOT contain PII. User actions are logged with `user_id` only; display names and emails are resolved at display time.
2. Error responses MUST NOT leak user details to other users. Generic error messages only.
3. API responses MUST NOT include PII of other users unless the requesting user has explicit permission (e.g., DCM viewing collection members).
4. Search results MUST NOT expose user emails or PRIDs in autocomplete or faceted filters.

### 5.3 Clinical Data Sensitivity

Collectoid stores **metadata about** clinical trials, not raw patient data. However, this metadata is still classified as strictly confidential because:

| Data Type | Sensitivity Justification | Protection Level |
|-----------|--------------------------|-----------------|
| **Study design and endpoints** | Reveals AZ's R&D strategy; commercially sensitive | Strictly Confidential |
| **Patient counts** | Enrolment numbers can indicate study progress; market-moving for public companies | Strictly Confidential |
| **Therapeutic area assignments** | Reveals AZ's investment focus across disease areas | Strictly Confidential |
| **Study phase and status** | Indicates pipeline progress (recruiting, completed, closed) | Strictly Confidential |
| **Access decisions** | Who has access to what data; compliance-critical | Strictly Confidential |
| **Approval chains and signatures** | Governance decisions with regulatory implications | Strictly Confidential |
| **AoT terms** (permitted activities, ML/AI permissions, publication rights) | Defines legal boundaries of data use | Strictly Confidential |
| **Collection criteria** (inclusion/exclusion rules) | Defines the scope of open access; commercially sensitive | Strictly Confidential |
| **D-code lists** | Study identifiers linking to AZ's clinical portfolio | Confidential |
| **Training completion status** | Per-user compliance status | Confidential |

### 5.4 Data Handling Requirements Per Classification

| Requirement | Strictly Confidential | Confidential | Internal | Public |
|-------------|----------------------|--------------|----------|--------|
| Encryption at rest | Required (AES-256) | Required (AES-256) | Required (AES-256) | Optional |
| Encryption in transit | Required (TLS 1.2+) | Required (TLS 1.2+) | Required (TLS 1.2+) | Required (TLS 1.2+) |
| Access control | RBAC + collection-level roles | RBAC | RBAC | None |
| Audit logging | All access and modifications | All modifications | Configuration changes | Not required |
| Log inclusion | Never in logs | Never in logs (use IDs only) | Permitted in logs | Permitted in logs |
| Retention | Per regulatory requirement (7-15+ years) | Per data retention policy (7 years) | 3 years | 1 year |
| Backup | Multi-AZ, cross-region | Multi-AZ | Multi-AZ | Not required |
| Screen display | Only to authorized roles | Only to authorized roles | All authenticated users | Anyone |

---

## 6. Encryption

### 6.1 Encryption at Rest

| Component | Encryption Method | Key Management | Rotation |
|-----------|------------------|----------------|----------|
| **Aurora PostgreSQL** | AES-256 via AWS-managed encryption | AWS KMS (default Aurora service key, or customer-managed CMK) | Annual automatic rotation (KMS) |
| **ElastiCache Redis** | AES-256 at-rest encryption (enabled at cluster creation) | AWS-managed key | AWS-managed rotation |
| **S3 (audit archive)** | SSE-S3 (AES-256) or SSE-KMS | AWS KMS CMK (`collectoid-audit-archive-key`) | Annual automatic rotation |
| **S3 (static assets via CloudFront)** | SSE-S3 | AWS-managed key | AWS-managed rotation |
| **ECS task environment variables** | Encrypted at rest via AWS Secrets Manager | Secrets Manager encryption key | Per secret rotation policy |
| **SQS messages** | SSE-SQS with KMS CMK | AWS KMS CMK (`collectoid-queue-key`) | Annual automatic rotation |

**Customer-Managed Key (CMK) Strategy:**

```
KMS Key Hierarchy:
  collectoid-prod-master-key (CMK, symmetric, AES-256)
    |
    +-- collectoid-db-key (alias)        --> Aurora encryption
    +-- collectoid-audit-archive-key     --> S3 audit archive
    +-- collectoid-queue-key             --> SQS encryption
    +-- collectoid-secrets-key           --> Secrets Manager
```

**[QUESTION-SEC-005]** Does AZ mandate customer-managed KMS keys (CMK) for all services, or are AWS-managed keys acceptable for non-audit data? CMKs provide more control (key policies, cross-account access, CloudTrail logging of key usage) but add operational overhead.

### 6.2 Encryption in Transit

| Path | Protocol | Minimum Version | Certificate |
|------|----------|----------------|-------------|
| User browser <-> CloudFront | HTTPS | TLS 1.2 | ACM-managed certificate for `collectoid.az.com` |
| CloudFront <-> ALB | HTTPS | TLS 1.2 | ACM-managed internal certificate |
| ALB <-> ECS Fargate tasks | HTTPS or HTTP | TLS 1.2 (if HTTPS) | [QUESTION-SEC-006] |
| ECS <-> Aurora PostgreSQL | TLS | TLS 1.2 | Aurora server certificate (AWS-managed); `sslmode=verify-full` in connection string |
| ECS <-> ElastiCache Redis | TLS | TLS 1.2 | ElastiCache in-transit encryption enabled at cluster creation |
| ECS <-> SQS/SNS | HTTPS | TLS 1.2 | AWS SDK uses HTTPS by default |
| ECS <-> External APIs (AZCT, Collibra, Immuta, Cornerstone) | HTTPS | TLS 1.2 | External service certificates; certificate pinning not required but CA verification enforced |
| ECS <-> AWS Secrets Manager | HTTPS | TLS 1.2 | AWS SDK uses HTTPS by default |

**[QUESTION-SEC-006]** Should the ALB-to-ECS path use end-to-end TLS (HTTPS all the way to the container), or is HTTP acceptable within the VPC private subnet? End-to-end TLS adds latency from TLS termination at the container but ensures encryption even within the VPC.

### 6.3 Key Management

**AWS KMS Configuration:**

| Parameter | Value |
|-----------|-------|
| Key type | Symmetric (AES-256-GCM) |
| Key usage | Encrypt/Decrypt |
| Key policy | Collectoid service role (`ecs-task-role-collectoid-prod`) has `kms:Encrypt`, `kms:Decrypt`, `kms:GenerateDataKey` |
| Key administrators | AZ Cloud Engineering team (not the application team) |
| Automatic rotation | Enabled (annual) |
| Deletion protection | Enabled (30-day pending deletion window) |
| CloudTrail logging | All key usage events logged |

### 6.4 Sensitive Field Encryption

In addition to storage-level encryption, certain fields warrant application-level encryption for defence in depth:

| Field | Reason | Encryption Method |
|-------|--------|-------------------|
| `access_token` (in Redis session) | OAuth token; grants access to Azure AD resources | AES-256-GCM with per-session data key (derived from KMS CMK) |
| `refresh_token` (in Redis session) | Long-lived; can generate new access tokens | AES-256-GCM with per-session data key |
| Webhook shared secrets (in config) | Used to verify incoming webhook signatures | Stored in AWS Secrets Manager (not in application config) |

**Not encrypted at application level** (storage-level encryption is sufficient):

- User profiles (names, emails) -- protected by RBAC, not individually sensitive enough to warrant field-level encryption overhead
- Audit event payloads -- must remain queryable via SQL; storage encryption provides adequate protection
- Collection metadata -- must remain queryable; access controlled by RBAC

---

## 7. API Security

### 7.1 Rate Limiting Strategy

Rate limiting is enforced at two layers: AWS WAF (infrastructure) and application middleware (Redis-backed).

**Infrastructure Layer (AWS WAF):**

| Rule | Scope | Limit | Action |
|------|-------|-------|--------|
| Global rate limit | Per IP address | 2,000 requests / 5 minutes | Block for 5 minutes |
| Login endpoint | Per IP address | 10 requests / minute | Block for 15 minutes |
| Webhook endpoints | Per IP address | 100 requests / minute | Block for 5 minutes |

**Application Layer (Redis-backed, per authenticated user):**

| Endpoint Category | Limit | Window | Burst Allowance |
|-------------------|-------|--------|-----------------|
| Read endpoints (`GET /api/*`) | 1,000 requests | 1 minute | 50 requests/second burst |
| Write endpoints (`POST/PATCH/DELETE /api/*`) | 100 requests | 1 minute | 10 requests/second burst |
| Search endpoints (`GET /api/search/*`) | 60 requests | 1 minute | 5 requests/second burst |
| Audit export (`POST /api/audit/export`) | 5 requests | 15 minutes | No burst |
| Admin endpoints (`/api/admin/*`) | 30 requests | 1 minute | No burst |

**Rate Limit Response:**

```json
HTTP/1.1 429 Too Many Requests
Retry-After: 45
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1707216000

{
  "error": {
    "code": "RATE_LIMITED",
    "message": "Rate limit exceeded. Please retry after 45 seconds.",
    "requestId": "req_abc123"
  }
}
```

### 7.2 CORS Configuration

Collectoid is a monolithic Next.js application where the UI and API are served from the same origin. CORS is restrictive by default.

```typescript
// middleware.ts (Next.js middleware)
const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_APP_URL,  // e.g., https://collectoid.az.com
];

// For webhook endpoints that receive cross-origin requests:
const WEBHOOK_ALLOWED_ORIGINS = [
  // [QUESTION-SEC-007] What are the callback origins for Collibra and other external systems?
];
```

| Header | Value | Scope |
|--------|-------|-------|
| `Access-Control-Allow-Origin` | `https://collectoid.az.com` (same origin) | All API routes |
| `Access-Control-Allow-Methods` | `GET, POST, PATCH, DELETE, OPTIONS` | All API routes |
| `Access-Control-Allow-Headers` | `Content-Type, Authorization, X-Request-ID` | All API routes |
| `Access-Control-Allow-Credentials` | `true` | All API routes |
| `Access-Control-Max-Age` | `86400` (24 hours) | All API routes |

### 7.3 CSRF Protection

Auth.js provides built-in CSRF protection using a double-submit cookie pattern:

1. A CSRF token is generated and stored in an encrypted, HttpOnly cookie
2. The same token is embedded in the page (via server component)
3. On state-changing requests (POST/PATCH/DELETE), the token from the request body/header is compared against the cookie value
4. Mismatches result in a 403 Forbidden response

**Additional CSRF mitigations:**
- `SameSite=Strict` on all session cookies prevents cross-site request attachment
- All state-changing API routes require a valid session cookie (no token-based auth for browser requests)
- Webhook endpoints use HMAC signature verification instead of CSRF tokens

### 7.4 Input Validation

All API input is validated using Zod schemas before processing. Invalid input is rejected with a 400 response containing field-level error details.

**Validation Strategy:**

| Layer | Mechanism | Purpose |
|-------|-----------|---------|
| **Request body** | Zod schema validation (strict mode: rejects unknown fields) | Prevent injection of unexpected fields |
| **URL parameters** | Zod coercion and validation on path/query params | Prevent parameter tampering |
| **Request headers** | Allowlist of expected headers; ignore unknown | Prevent header injection |
| **File uploads** | Not supported in MVP | N/A |
| **HTML content** | Not accepted; all text fields are plain text | Prevent stored XSS |

**Sanitisation Rules:**

1. All string inputs are trimmed of leading/trailing whitespace
2. HTML tags are stripped from all text inputs (no rich text in MVP)
3. SQL special characters are handled by parameterised queries (never concatenated)
4. JSON payloads are parsed with strict mode (no duplicate keys, no trailing commas)
5. Array inputs have maximum length constraints (e.g., max 2,000 dataset IDs per request)

**Example Validation (from `01-architecture-overview.md`, Section 7):**

```typescript
// lib/validation/collections.ts
import { z } from "zod";

export const CreateCollectionSchema = z.object({
  name: z.string().min(3).max(255).trim(),
  intent: z.string().min(10).max(5000).trim(),
  therapeuticArea: z.string().max(100),
  collectionType: z.enum(["open", "closed", "ongoing"]),
  criteria: z.object({
    studyPhases: z.array(z.string().max(50)).max(20).optional(),
    indications: z.array(z.string().max(100)).max(100).optional(),
    dataModalities: z.array(z.string().max(50)).min(1).max(20),
    dataSources: z.array(z.string().max(50)).min(1).max(20),
  }),
  environments: z.array(z.string().max(50)).min(1).max(10),
  dataConsumerLeadId: z.string().uuid(),
  dataOwnerId: z.string().uuid(),
}).strict();  // Reject any fields not defined in the schema
```

### 7.5 Request Size Limits

| Limit | Value | Enforcement Point |
|-------|-------|-------------------|
| Maximum request body | 1 MB | ALB + Next.js config |
| Maximum URL length | 8,192 characters | ALB |
| Maximum header size | 16 KB | ALB |
| Maximum JSON nesting depth | 10 levels | Application middleware |
| Maximum array length in request | 2,000 items | Zod schema validation |
| Maximum file upload size | N/A (no file uploads in MVP) | -- |

### 7.6 SQL Injection Prevention

Collectoid uses Drizzle ORM (recommended in `01-architecture-overview.md`) which generates parameterised queries by default. Raw SQL is prohibited in application code.

**Enforcement:**

| Control | Mechanism |
|---------|-----------|
| ORM-only database access | All queries go through Drizzle ORM; no `pg` client or raw SQL |
| Linting rule | ESLint custom rule flags any usage of raw SQL string construction |
| Code review checklist | SQL injection prevention is a mandatory review item |
| SAST scanning | Snyk Code / Semgrep rules detect SQL concatenation patterns |

**Exception:** Database migrations may use raw SQL. These are reviewed by two engineers and the security champion before merging.

### 7.7 XSS Prevention

| Control | Implementation |
|---------|---------------|
| **React output encoding** | React automatically escapes all rendered values; `dangerouslySetInnerHTML` is prohibited via ESLint rule |
| **Content Security Policy (CSP)** | Strict CSP headers via CloudFront response headers policy |
| **X-Content-Type-Options** | `nosniff` (prevents MIME type sniffing) |
| **X-Frame-Options** | `DENY` (prevents clickjacking via iframe embedding) |
| **Referrer-Policy** | `strict-origin-when-cross-origin` |
| **Permissions-Policy** | Disables unnecessary browser features (camera, microphone, geolocation) |

**Content Security Policy:**

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{random}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https://login.microsoftonline.com;
  font-src 'self';
  connect-src 'self' https://login.microsoftonline.com https://graph.microsoft.com;
  frame-src 'none';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
```

**[QUESTION-SEC-007]** Does AZ have a standard CSP policy for internal applications? The above is a starting point; it may need adjustment for AZ-specific CDN domains, analytics, or monitoring scripts.

---

## 8. Secret Management

### 8.1 AWS Secrets Manager / SSM Parameter Store Usage

All secrets are stored in AWS Secrets Manager. Non-sensitive configuration is stored in SSM Parameter Store.

| Secret | Storage | Rotation | Access Pattern |
|--------|---------|----------|----------------|
| `AZURE_AD_CLIENT_SECRET` | Secrets Manager | 90 days | ECS task role at startup |
| `DATABASE_URL` (Aurora credentials) | Secrets Manager | 30 days (automatic via RDS integration) | ECS task role at startup |
| `REDIS_AUTH_TOKEN` | Secrets Manager | 90 days | ECS task role at startup |
| `NEXTAUTH_SECRET` (session encryption key) | Secrets Manager | 180 days | ECS task role at startup |
| `WEBHOOK_SECRET_COLLIBRA` | Secrets Manager | 180 days | ECS task role at startup |
| `KMS_KEY_ID` (for application-level encryption) | SSM Parameter Store | N/A (reference only) | ECS task role at startup |
| `AZCT_API_KEY` | Secrets Manager | 90 days | ECS task role at startup |
| `CORNERSTONE_API_KEY` | Secrets Manager | 90 days | ECS task role at startup |
| `IMMUTA_API_KEY` | Secrets Manager | 90 days | ECS task role at startup |

**Non-Secret Configuration (SSM Parameter Store):**

| Parameter | Example Value | Description |
|-----------|---------------|-------------|
| `/collectoid/prod/AZURE_AD_TENANT_ID` | `xxxxxxxx-xxxx-...` | Azure AD tenant ID (not secret) |
| `/collectoid/prod/AZURE_AD_CLIENT_ID` | `xxxxxxxx-xxxx-...` | Azure AD app registration ID (not secret) |
| `/collectoid/prod/APP_URL` | `https://collectoid.az.com` | Public application URL |
| `/collectoid/prod/LOG_LEVEL` | `info` | Logging verbosity |
| `/collectoid/prod/RATE_LIMIT_ENABLED` | `true` | Feature flag for rate limiting |

### 8.2 Secret Rotation Policy

| Secret Category | Rotation Period | Rotation Mechanism | Impact of Rotation |
|-----------------|----------------|--------------------|--------------------|
| Azure AD client secret | 90 days | Manual rotation with overlap period (create new secret, update Secrets Manager, delete old after 7 days) | Brief (< 1 second) during ECS task restart |
| Aurora DB credentials | 30 days | Automatic (Secrets Manager + RDS integration; credential rotation happens transparently) | Zero downtime (dual-credential support) |
| Redis auth token | 90 days | Manual rotation with ECS task restart | Brief downtime (~30 seconds) during rolling restart |
| API keys (AZCT, Cornerstone, Immuta) | 90 days | Manual; coordinate with external team | Zero downtime if rotated during maintenance window |
| NEXTAUTH_SECRET | 180 days | Manual rotation; existing sessions remain valid until expiry | No user impact; new sessions use new key |
| Webhook secrets | 180 days | Manual; coordinate with Collibra / external webhook providers | Brief gap possible if external system is updated asynchronously |

### 8.3 Environment Variable Management

Secrets are injected into ECS tasks via the task definition, which references Secrets Manager ARNs. Secrets are never baked into container images or stored in source code.

**ECS Task Definition (Terraform):**

```hcl
resource "aws_ecs_task_definition" "collectoid" {
  container_definitions = jsonencode([{
    name = "collectoid"

    secrets = [
      {
        name      = "DATABASE_URL"
        valueFrom = "arn:aws:secretsmanager:eu-west-1:ACCOUNT:secret:collectoid/prod/database-url"
      },
      {
        name      = "AZURE_AD_CLIENT_SECRET"
        valueFrom = "arn:aws:secretsmanager:eu-west-1:ACCOUNT:secret:collectoid/prod/azure-ad-client-secret"
      },
      # ... additional secrets
    ]

    environment = [
      {
        name  = "AZURE_AD_TENANT_ID"
        value = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
      },
      {
        name  = "NODE_ENV"
        value = "production"
      },
    ]
  }])
}
```

### 8.4 Never in Code / Never in Logs Policy

| Rule | Enforcement |
|------|-------------|
| No secrets in source code | `git-secrets` pre-commit hook; Snyk / truffleHog scanning in CI; `.gitignore` includes all `.env*` files |
| No secrets in container images | Multi-stage Docker build; secrets injected at runtime via ECS task definition; `docker history` verification in CI |
| No secrets in application logs | Structured logging with explicit field allowlist; PII and secret patterns are masked by the logging library (`pino` redaction) |
| No secrets in error responses | All error responses use generic messages; stack traces are logged server-side only, never returned to client |
| No secrets in monitoring / tracing | AWS X-Ray and CloudWatch trace data is sanitised; request bodies are not captured in traces |
| No secrets in audit events | Audit event payloads capture what changed, not the secret values themselves (e.g., "secret rotated" not the secret) |

**Pino Redaction Configuration:**

```typescript
const logger = pino({
  redact: {
    paths: [
      "req.headers.authorization",
      "req.headers.cookie",
      "*.password",
      "*.secret",
      "*.token",
      "*.accessToken",
      "*.refreshToken",
      "*.apiKey",
      "*.connectionString",
    ],
    censor: "[REDACTED]",
  },
});
```

---

## 9. Network Security

### 9.1 VPC Architecture

The Collectoid VPC is designed with three subnet tiers. See `01-architecture-overview.md`, Section 5 for the full deployment diagram.

```
+-----------------------------------------------------------------------------------+
|                              VPC (10.0.0.0/16)                                    |
|                                                                                   |
|  PUBLIC SUBNETS (10.0.1.0/24, 10.0.2.0/24) -- AZ-a, AZ-b                       |
|  +---------------------------------------------------------------------------+   |
|  |  - Application Load Balancer (ALB)                                        |   |
|  |  - NAT Gateway (for outbound internet from private subnets)               |   |
|  |  - No direct compute resources                                            |   |
|  +---------------------------------------------------------------------------+   |
|                                                                                   |
|  PRIVATE SUBNETS (10.0.3.0/24, 10.0.4.0/24) -- AZ-a, AZ-b                     |
|  +---------------------------------------------------------------------------+   |
|  |  - ECS Fargate tasks (Next.js application)                                |   |
|  |  - No public IP addresses                                                 |   |
|  |  - Outbound via NAT Gateway only                                          |   |
|  +---------------------------------------------------------------------------+   |
|                                                                                   |
|  DATA SUBNETS (10.0.5.0/24, 10.0.6.0/24) -- AZ-a, AZ-b                        |
|  +---------------------------------------------------------------------------+   |
|  |  - Aurora PostgreSQL cluster                                              |   |
|  |  - ElastiCache Redis cluster                                              |   |
|  |  - No internet access (no NAT Gateway route)                              |   |
|  |  - Accessible only from private subnets                                   |   |
|  +---------------------------------------------------------------------------+   |
|                                                                                   |
|  VPC Endpoints (PrivateLink):                                                    |
|  - com.amazonaws.eu-west-1.secretsmanager                                        |
|  - com.amazonaws.eu-west-1.sqs                                                   |
|  - com.amazonaws.eu-west-1.sns                                                   |
|  - com.amazonaws.eu-west-1.kms                                                   |
|  - com.amazonaws.eu-west-1.s3 (gateway endpoint)                                |
|  - com.amazonaws.eu-west-1.ecr.dkr                                              |
|  - com.amazonaws.eu-west-1.ecr.api                                              |
|  - com.amazonaws.eu-west-1.logs                                                  |
|                                                                                   |
+-----------------------------------------------------------------------------------+
```

### 9.2 Security Groups

| Security Group | Attached To | Inbound Rules | Outbound Rules |
|---------------|-------------|---------------|----------------|
| `sg-alb` | Application Load Balancer | HTTPS (443) from CloudFront IP ranges; HTTP (80) redirect only | All traffic to `sg-ecs` on port 3000 |
| `sg-ecs` | ECS Fargate tasks | Port 3000 from `sg-alb` only | Port 5432 to `sg-aurora`; Port 6379 to `sg-redis`; HTTPS (443) to VPC endpoints and NAT Gateway |
| `sg-aurora` | Aurora PostgreSQL | Port 5432 from `sg-ecs` only | No outbound (database does not initiate connections) |
| `sg-redis` | ElastiCache Redis | Port 6379 from `sg-ecs` only | No outbound |
| `sg-vpce` | VPC Endpoints | HTTPS (443) from `sg-ecs` only | N/A |

### 9.3 Network Access Control Lists (NACLs)

NACLs provide a secondary layer of network filtering at the subnet level:

| Subnet Tier | Inbound Allow | Inbound Deny | Outbound Allow | Outbound Deny |
|-------------|---------------|--------------|----------------|---------------|
| Public | HTTPS (443) from 0.0.0.0/0; Ephemeral ports from VPC | All other | All traffic to VPC; HTTPS to 0.0.0.0/0 | All other |
| Private | Port 3000 from public subnets; Ephemeral ports from data subnets | All other | Port 5432, 6379 to data subnets; HTTPS to VPC endpoints; HTTPS to NAT Gateway | All other |
| Data | Port 5432, 6379 from private subnets | All other | Ephemeral ports to private subnets | All other |

### 9.4 WAF Rules (AWS WAF on ALB)

AWS WAF is attached to the ALB (and optionally CloudFront) to filter malicious traffic.

| Rule Group | Source | Purpose |
|------------|--------|---------|
| AWS Managed - Core Rule Set (CRS) | AWS | OWASP Top 10 protection (SQL injection, XSS, path traversal, etc.) |
| AWS Managed - Known Bad Inputs | AWS | Block requests with known exploit patterns |
| AWS Managed - IP Reputation | AWS | Block requests from known malicious IP addresses |
| Custom - AZ VPN IP Allowlist | AZ InfoSec | **[QUESTION-SEC-008]** Restrict access to AZ corporate network IP ranges only |
| Custom - Rate Limiting | Application team | Global rate limit: 2,000 requests / 5 minutes per IP |
| Custom - Geographic Restriction | Application team | **[QUESTION-SEC-009]** Should access be restricted to specific countries/regions? |
| Custom - Request Size | Application team | Block requests > 1 MB body size |

### 9.5 DDoS Protection

| Layer | Protection | Mechanism |
|-------|------------|-----------|
| Network (L3/L4) | AWS Shield Standard | Automatic; included with all AWS resources; protects against SYN floods, UDP reflection, etc. |
| Application (L7) | AWS WAF rate limiting + CloudFront | Rate limiting per IP; CloudFront absorbs volumetric attacks at edge |
| Application (L7) | Auto-scaling | ECS auto-scales from 2 to 6 tasks based on CPU utilisation (see `01-architecture-overview.md`, Section 5) |

**[QUESTION-SEC-010]** Does AZ require AWS Shield Advanced ($3,000/month) for enhanced DDoS protection, or is Shield Standard sufficient for an internal application behind VPN?

---

## 10. Vulnerability Management

### 10.1 Dependency Scanning

| Tool | Scope | Integration | Frequency | Blocking |
|------|-------|-------------|-----------|----------|
| **GitHub Dependabot** | npm dependencies | GitHub PR alerts + auto-fix PRs | Continuous (on push) | Critical/High vulnerabilities block merge |
| **Snyk** (or equivalent AZ-approved tool) | npm dependencies + transitive deps | CI pipeline check | On every PR + daily scheduled scan | Critical vulnerabilities block deployment |
| **npm audit** | npm dependencies | CI pipeline step | On every build | High+ vulnerabilities block build |
| **License compliance** | npm dependencies | Snyk license module or FOSSA | On every PR | GPL-licensed dependencies block merge |

**Dependency Update Policy:**

| Severity | SLA | Action |
|----------|-----|--------|
| Critical (CVSS 9.0+) | 24 hours | Hotfix deployment; emergency PR process |
| High (CVSS 7.0-8.9) | 7 days | Scheduled patch in next sprint |
| Medium (CVSS 4.0-6.9) | 30 days | Patch in regular dependency update cycle |
| Low (CVSS 0.1-3.9) | 90 days | Patch at next quarterly dependency refresh |

### 10.2 Container Image Scanning

| Control | Tool | Timing | Blocking |
|---------|------|--------|----------|
| Base image scanning | AWS ECR image scanning (or Snyk Container) | On push to ECR | Critical vulnerabilities block deployment |
| Base image policy | Only approved base images (e.g., `node:20-alpine` from AZ-approved registry) | CI pipeline validation | Non-approved base images block build |
| Image signing | **[QUESTION-SEC-011]** Does AZ require Docker Content Trust or Sigstore? | At build time | Depends on AZ policy |
| Minimal base image | Alpine-based Node.js image; no unnecessary OS packages | Dockerfile review | Enforced via Dockerfile linting |
| Non-root execution | Container runs as non-root user (`node` user) | Dockerfile `USER` directive | Enforced via ECS task definition |

**Dockerfile Security Practices:**

```dockerfile
# Use specific digest for reproducibility
FROM node:20-alpine@sha256:abc123... AS base

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# ... build steps ...

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
```

### 10.3 SAST / DAST Integration in CI/CD

| Type | Tool | Integration Point | Scope |
|------|------|-------------------|-------|
| **SAST** (Static Application Security Testing) | Snyk Code / Semgrep / SonarQube | PR check (GitHub Actions) | TypeScript/JavaScript source code; detects SQL injection, XSS, insecure crypto, hardcoded secrets |
| **SCA** (Software Composition Analysis) | Snyk / Dependabot | PR check + daily scan | Third-party dependency vulnerabilities |
| **Secret Scanning** | git-secrets + truffleHog | Pre-commit hook + PR check | Detect accidentally committed secrets, API keys, tokens |
| **IaC Scanning** | tfsec / Checkov | PR check on Terraform changes | Detect insecure infrastructure configuration (open security groups, unencrypted resources) |
| **DAST** (Dynamic Application Security Testing) | OWASP ZAP (or AZ-approved alternative) | Weekly scheduled scan against staging | Runtime vulnerability detection (authentication bypass, injection, etc.) |

**CI/CD Security Gates:**

```
PR Created
  |
  v
+------------------+     +------------------+     +------------------+
| Lint + Unit Test |---->| SAST Scan        |---->| SCA Scan         |
| (must pass)      |     | (Snyk Code)      |     | (Snyk/Dependabot)|
+------------------+     | Block on High+   |     | Block on High+   |
                          +------------------+     +------------------+
                                                          |
                                                          v
                                              +------------------+
                                              | Secret Scan      |
                                              | (truffleHog)     |
                                              | Block on any     |
                                              | finding          |
                                              +--------+---------+
                                                       |
                                                       v
                                              +------------------+
                                              | Container Build  |
                                              | + Image Scan     |
                                              | Block on Critical|
                                              +--------+---------+
                                                       |
                                                       v
                                              +------------------+
                                              | Deploy to Staging|
                                              +--------+---------+
                                                       |
                                              (Weekly DAST scan)
                                                       |
                                              +--------+---------+
                                              | Manual Approval  |
                                              | Gate (for Prod)  |
                                              +------------------+
```

### 10.4 Penetration Testing Schedule

| Test Type | Frequency | Scope | Performed By |
|-----------|-----------|-------|-------------|
| Automated DAST scan | Weekly (staging) | Full application surface | OWASP ZAP (automated) |
| Internal penetration test | Annually | Full application + infrastructure | AZ InfoSec team or approved vendor |
| External penetration test | Annually | External-facing attack surface | Third-party security firm (AZ-approved) |
| Red team exercise | Bi-annually (if required) | Social engineering + technical | AZ InfoSec team |

**[QUESTION-SEC-012]** What is AZ's standard penetration testing cadence for internal applications? Is there an AZ-approved vendor or internal team that performs these tests?

### 10.5 CVE Response Process

```
CVE Published
     |
     v
+------------------+
| Automated Alert  |  (Snyk / Dependabot / AWS ECR)
| via Slack/Email  |
+--------+---------+
         |
         v
+------------------+
| Triage (within   |  Security Champion assesses:
| 4 hours for      |  - Is this CVE exploitable in our context?
| Critical)        |  - What component is affected?
+--------+---------+  - Is there a patch available?
         |
    +----+----+
    |         |
Not Exploitable  Exploitable
    |              |
    v              v
+----------+  +------------------+
| Document |  | Apply Patch      |
| Risk     |  | (Critical: 24hr  |
| Accept   |  |  High: 7 days)   |
+----------+  +--------+---------+
                        |
                        v
              +------------------+
              | Deploy Patch     |
              | (Blue/Green on   |
              |  ECS; no down-   |
              |  time)           |
              +------------------+
```

---

## 11. Compliance Frameworks

### 11.1 GxP Considerations

**Is Collectoid a GxP system?**

Collectoid manages access governance for clinical trial data but does not itself process, store, or modify clinical trial source data. The determination of whether Collectoid falls under GxP regulation depends on the answer to the following question:

**[QUESTION-SEC-013]** Does Collectoid fall under GxP classification? Specifically:
- Collectoid manages audit trails for access decisions that have regulatory implications (ICH E6(R2) traceability)
- Collectoid does not store raw clinical data (that resides in PDP, entimICE, CTDS)
- Collectoid's approval decisions directly gate access to clinical data

**If GxP applies, the following additional requirements are triggered:**

| Requirement | GxP Control | Collectoid Implementation |
|-------------|-------------|--------------------------|
| Computer System Validation (CSV) | IQ/OQ/PQ qualification | Documented test protocols, traceability matrix, validation summary report |
| 21 CFR Part 11 / EU Annex 11 | Electronic records, electronic signatures | Audit trail immutability (Section 4.3), unique user identification (Azure AD), signature meaning capture |
| Change control | Documented change control process for all system changes | PR-based change management; all changes reviewed and approved before deployment |
| Periodic review | System reviewed periodically to confirm continued compliance | Annual system review documented |
| Data integrity (ALCOA+) | Attributable, Legible, Contemporaneous, Original, Accurate | Audit events are attributable (actor_id), contemporaneous (occurred_at), original (append-only), accurate (chained checksums) |
| Backup and recovery | Documented backup and recovery procedures | Aurora automated backups, cross-AZ replication, documented RTO/RPO |
| User access management | Documented user provisioning and deprovisioning | Azure AD integration, role assignment audit trail |
| Training | Users trained before accessing GxP system | Cornerstone training verification |

**Regardless of GxP classification**, Collectoid adopts GxP-aligned practices as a baseline because the audit trail serves as the system of record for clinical data governance decisions.

### 11.2 SOX Requirements for Audit Trails

As AstraZeneca is a publicly traded company, SOX (Sarbanes-Oxley) compliance requires that systems involved in financial reporting have adequate internal controls. While Collectoid is not a financial system, its audit trail may be subject to SOX scrutiny if clinical trial data access decisions impact financial disclosures (e.g., study success/failure affecting stock price).

**SOX-Relevant Controls in Collectoid:**

| Control | Implementation |
|---------|---------------|
| Separation of duties | RBAC enforces separation between collection creators (DCM), approvers, and administrators |
| Access logging | All access to clinical metadata is logged in audit trail |
| Change management | All system changes go through PR review with approval gate |
| User access review | Quarterly review of user roles and permissions (admin report) |
| Data integrity | Append-only audit trail with chained checksums |

### 11.3 AZ Internal Security Standards

Collectoid must comply with AstraZeneca's internal cybersecurity standards. The following checklist maps Collectoid's controls to expected AZ requirements:

| AZ Standard Area | Collectoid Control | Status |
|------------------|-------------------|--------|
| Identity and access management | Azure AD SSO, RBAC, MFA (via Azure AD Conditional Access) | Designed |
| Data classification | Four-tier classification (Section 5.1); all clinical metadata as Strictly Confidential | Designed |
| Encryption (at rest) | AES-256 on Aurora, ElastiCache, S3, SQS | Designed |
| Encryption (in transit) | TLS 1.2+ on all paths | Designed |
| Vulnerability management | Dependency scanning, container scanning, SAST/DAST, penetration testing | Designed |
| Logging and monitoring | CloudWatch, structured logging, audit trail, alerting | Designed |
| Incident response | Classification, response, escalation, post-incident review (Section 12) | Designed |
| Business continuity | Multi-AZ deployment, RTO < 4hr, RPO < 1hr | Designed |
| Third-party risk | External API integrations assessed (AZCT, Collibra, Immuta, Cornerstone) | **[QUESTION-SEC-014]** Has a third-party risk assessment been completed for each external integration? |
| Secure development lifecycle | SAST, SCA, code review, security champion role | Designed |

### 11.4 Data Governance Alignment with ROAM

The ROAM (Role-based Open Access Model) defines the governance framework that Collectoid implements. Security controls are directly aligned with ROAM principles:

| ROAM Principle | Security Implementation |
|---------------|------------------------|
| **Role-based access** | Collectoid RBAC mirrors ROAM roles (DCM, Approver, Consumer, Team Lead, DPO, Data Office Lead) |
| **Open Access Collections (90-route)** | Pre-approved access via approved OAC; audit trail records auto-approval events |
| **Closed/Request-based access (10-route)** | Multi-stage approval workflow with atomic all-or-nothing TA approval |
| **Agreement of Terms** | AoT versioning with signature capture and audit trail |
| **Training before access** | Cornerstone integration validates training completion before granting access |
| **Quarterly review** | System supports periodic review workflow with documented opt-in/opt-out decisions |
| **Compliance audit** | Comprehensive audit trail with reporting, export, and integrity verification |
| **"All or nothing" cross-TA approval** | Database transactions ensure atomicity; rejection by any TA blocks all TAs |

---

## 12. Incident Response

### 12.1 Security Incident Classification

| Severity | Definition | Examples | Response Time |
|----------|------------|----------|---------------|
| **P1 -- Critical** | Active security breach or data exposure; system integrity compromised | Audit trail tampering detected; unauthorized data access confirmed; credential compromise; active exploitation of vulnerability | Immediate (within 30 minutes) |
| **P2 -- High** | Significant vulnerability or potential breach; requires immediate investigation | Elevated unauthorized access attempts; critical CVE in production dependency; failed integrity check; suspicious admin actions | Within 2 hours |
| **P3 -- Medium** | Security concern requiring prompt attention; no active breach | High-severity CVE in non-critical dependency; unusual traffic patterns; failed penetration test finding; minor policy violation | Within 24 hours |
| **P4 -- Low** | Minor security finding; no immediate risk | Medium/low CVE; informational penetration test finding; policy improvement opportunity | Within 7 days |

### 12.2 Response Procedures

**Phase 1: Detection and Triage (0 -- 30 minutes)**

1. Automated alert received (CloudWatch, Sentry, audit integrity check, WAF)
2. On-call engineer acknowledges alert
3. Classify severity per Section 12.1
4. For P1/P2: notify security champion and engineering lead immediately
5. Create incident ticket in JIRA (or AZ incident management system)

**Phase 2: Containment (30 minutes -- 2 hours)**

| Action | P1 | P2 | P3 | P4 |
|--------|----|----|----|----|
| Revoke compromised credentials | Immediately | Within 2 hours | Within 24 hours | Next rotation |
| Disable compromised user accounts | Immediately | Within 2 hours | N/A | N/A |
| Block attacking IP addresses (WAF) | Immediately | Within 1 hour | N/A | N/A |
| Enable enhanced logging | Immediately | Within 1 hour | Within 24 hours | N/A |
| Notify AZ InfoSec | Immediately | Within 2 hours | Within 24 hours | Monthly report |
| Consider service isolation | If data exposure risk | If data exposure risk | N/A | N/A |

**Phase 3: Investigation (2 -- 48 hours)**

1. Collect evidence: audit logs, CloudWatch logs, ALB access logs, VPC flow logs
2. Determine scope: which users, collections, and data were affected
3. Identify root cause: vulnerability, misconfiguration, insider threat, credential compromise
4. Document timeline of events
5. Assess regulatory notification requirements (if clinical data access was affected)

**Phase 4: Remediation (24 hours -- 7 days)**

1. Apply fix (patch, configuration change, access revocation)
2. Verify fix effectiveness
3. Restore normal operations
4. Update monitoring to detect recurrence

**Phase 5: Post-Incident Review (within 7 days of resolution)**

1. Conduct blameless post-incident review (PIR) meeting
2. Document: timeline, root cause, impact, response effectiveness, lessons learned
3. Identify action items to prevent recurrence
4. Update runbooks and monitoring as needed
5. Communicate summary to stakeholders (redacted as appropriate)

### 12.3 Escalation Paths

```
Alert Triggered
     |
     v
On-Call Engineer (Application Team)
     |
     +-- P4: Handle directly; document in weekly security review
     |
     +-- P3: Handle directly; notify security champion
     |
     +-- P2: Notify security champion + engineering lead
     |         |
     |         +-- If data exposure suspected: notify AZ InfoSec
     |
     +-- P1: Notify all below immediately:
              |
              +-- Security Champion (Application Team)
              +-- Engineering Lead
              +-- AZ InfoSec Team
              +-- WP4 Lead (Jamie MacPherson)
              +-- R&D Data Office Lead (Peder Blomgren) -- if clinical data governance affected
              +-- AZ CISO Office -- if regulatory notification may be required
```

### 12.4 Post-Incident Review Process

| Step | Timing | Output |
|------|--------|--------|
| Schedule PIR meeting | Within 48 hours of incident resolution | Calendar invite to all responders |
| Prepare incident timeline | Before PIR meeting | Chronological event log with evidence |
| Conduct PIR (blameless) | Within 7 days of resolution | Meeting notes, root cause analysis |
| Document PIR report | Within 3 days of meeting | Formal document with timeline, root cause, impact, actions |
| Assign action items | At PIR meeting | JIRA tickets with owners and deadlines |
| Close action items | Per assigned deadlines | Verified completion |
| Update runbooks | Within 14 days | Updated incident response documentation |
| Share lessons learned | Within 14 days | Team retrospective or knowledge base article |

---

## 13. Open Questions

All unknowns are tagged with `[QUESTION-SEC-XXX]` throughout this document. They are consolidated here for tracking, organized by domain.

### 13.1 Authentication & Identity

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **[QUESTION-SEC-001]** | Does AZ require front-channel logout (Azure AD notifies all relying parties on user sign-out)? | Determines whether Collectoid needs a front-channel logout endpoint | Identity Team | Open |
| **[QUESTION-SEC-002]** | Which Azure AD groups exist for Collectoid role mapping? Do they follow `SG-Collectoid-*` naming? Can new groups be created? | Blocks RBAC implementation | Identity Team | Open |

### 13.2 Audit & Compliance

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **[QUESTION-SEC-003]** | Should audit events be replicated to a separate, independently managed audit store (CloudTrail, Splunk, separate Aurora instance)? | Affects audit architecture and cost; provides independent tamper-proof copy | Compliance + InfoSec | Open |
| **[QUESTION-SEC-004]** | What is the exact regulatory retention period for audit events? ICH E6(R2) requires 15 years for some clinical data. | Affects S3 Glacier lifecycle policy; storage cost projections | Compliance | Open |
| **[QUESTION-SEC-013]** | Does Collectoid fall under GxP classification? | Triggers Computer System Validation requirements (IQ/OQ/PQ); significant timeline and documentation impact | Quality + Compliance | Open |

### 13.3 Encryption & Key Management

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **[QUESTION-SEC-005]** | Does AZ mandate customer-managed KMS keys (CMK) for all services, or are AWS-managed keys acceptable for non-audit data? | Affects key management overhead and cost | Cloud Engineering + InfoSec | Open |
| **[QUESTION-SEC-006]** | Should ALB-to-ECS traffic use end-to-end TLS, or is HTTP within the private VPC subnet acceptable? | Affects performance (TLS termination at container) and security posture | InfoSec | Open |

### 13.4 Network & Infrastructure

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **[QUESTION-SEC-007]** | Does AZ have a standard Content Security Policy for internal applications? What domains must be allowlisted (CDN, analytics, monitoring)? | Affects CSP header configuration | InfoSec | Open |
| **[QUESTION-SEC-008]** | Should WAF be configured with an AZ VPN IP allowlist to restrict access to corporate network only? | Determines whether Collectoid is accessible from any network or corporate VPN only | InfoSec | Open |
| **[QUESTION-SEC-009]** | Should geographic restrictions be applied at the WAF/CloudFront level? | Blocks access from non-approved regions | InfoSec + Legal | Open |
| **[QUESTION-SEC-010]** | Does AZ require AWS Shield Advanced, or is Shield Standard sufficient for an internal application? | $3,000/month cost difference | InfoSec + Finance | Open |

### 13.5 Vulnerability Management

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **[QUESTION-SEC-011]** | Does AZ require Docker Content Trust or Sigstore for container image signing? | Affects CI/CD pipeline configuration | InfoSec + Cloud Engineering | Open |
| **[QUESTION-SEC-012]** | What is AZ's standard penetration testing cadence and approved vendor list for internal applications? | Determines pen test scheduling and procurement | InfoSec | Open |

### 13.6 External Integrations

| ID | Question | Impact | Owner | Status |
|----|----------|--------|-------|--------|
| **[QUESTION-SEC-014]** | Has a third-party risk assessment been completed for each external integration (AZCT, Collibra 2.0, Immuta, Cornerstone)? | Required by AZ security standards before production integration | InfoSec + Procurement | Open |

### 13.7 Cross-References to Other Document Questions

The following open questions from other sprint-zero documents directly impact security and compliance:

| Source Document | Question ID | Question | Security Impact |
|-----------------|-------------|----------|-----------------|
| Architecture (`01`) | QUESTION-004 | Is there a WAF rule set or IP allowlist policy for internal-only applications? | WAF configuration (Section 9.4) |
| Architecture (`01`) | QUESTION-005 | What is the approved secret management approach (Secrets Manager, Vault, other)? | Secret management (Section 8) |
| Architecture (`01`) | QUESTION-012 | Which Azure AD groups map to Collectoid roles? | RBAC implementation (Section 3.3) |
| Architecture (`01`) | QUESTION-013 | Are there existing service principals for server-to-server API calls? | External API authentication |
| Architecture (`01`) | QUESTION-014 | Is MFA required for approval actions? | Approval security (Section 2.1) |
| Data Model (`03`) | Section 4.5 | What is the exact regulatory retention period? | Audit retention (Section 4.4) |
| BRD (`02`) | NFR-SEC-005 | Sessions expire after 30 minutes of inactivity | Session management (Section 2.4) |
| BRD (`02`) | QUESTION-017 | What data classifications apply to Collectoid's database? | Data classification (Section 5) |
| BRD (`02`) | QUESTION-018 | Is there a GxP or regulated system classification for Collectoid? | GxP compliance (Section 11.1) |

---

## Appendix A: Security Controls Checklist

This checklist summarises all security controls. It can be used for security review sign-off.

| # | Control | Section | Status |
|---|---------|---------|--------|
| 1 | Azure AD SSO authentication (no local credentials) | 2.1 | Designed |
| 2 | PKCE (S256) for authorization code flow | 2.1 | Designed |
| 3 | Server-side session storage (Redis) | 2.4 | Designed |
| 4 | Session inactivity timeout (30 min) | 2.4 | Designed |
| 5 | Session absolute expiry (24 hr) | 2.4 | Designed |
| 6 | SSO logout / single sign-out | 2.6 | Designed |
| 7 | RBAC with 7 system-level roles | 3.1 | Designed |
| 8 | Permission matrix enforcement on all API routes | 3.6 | Designed |
| 9 | Collection-level access control | 3.5 | Designed |
| 10 | Audit trail for all state-changing operations | 4.1 | Designed |
| 11 | Audit trail immutability (DB triggers + checksums) | 4.3 | Designed |
| 12 | Audit retention policy (7+ years) | 4.4 | Designed |
| 13 | Data classification (four tiers) | 5.1 | Designed |
| 14 | PII identification and handling rules | 5.2 | Designed |
| 15 | Encryption at rest (AES-256) for all storage | 6.1 | Designed |
| 16 | Encryption in transit (TLS 1.2+) for all paths | 6.2 | Designed |
| 17 | Application-level encryption for OAuth tokens | 6.4 | Designed |
| 18 | Rate limiting (WAF + application) | 7.1 | Designed |
| 19 | CORS restriction (same-origin) | 7.2 | Designed |
| 20 | CSRF protection (double-submit cookie) | 7.3 | Designed |
| 21 | Input validation (Zod strict schemas) | 7.4 | Designed |
| 22 | Request size limits | 7.5 | Designed |
| 23 | SQL injection prevention (ORM only) | 7.6 | Designed |
| 24 | XSS prevention (React + CSP) | 7.7 | Designed |
| 25 | Secrets in AWS Secrets Manager (never in code/logs) | 8.1 | Designed |
| 26 | Secret rotation policy | 8.2 | Designed |
| 27 | PII never in logs | 8.4 | Designed |
| 28 | VPC with public/private/data subnet tiers | 9.1 | Designed |
| 29 | Security groups (least-privilege network access) | 9.2 | Designed |
| 30 | WAF with OWASP CRS | 9.4 | Designed |
| 31 | Dependency scanning in CI | 10.1 | Designed |
| 32 | Container image scanning | 10.2 | Designed |
| 33 | SAST/DAST in CI/CD pipeline | 10.3 | Designed |
| 34 | Annual penetration testing | 10.4 | Planned |
| 35 | CVE response process with SLAs | 10.5 | Designed |
| 36 | Incident response procedures | 12 | Designed |
| 37 | Post-incident review process | 12.4 | Designed |

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **ACL** | Access Control List |
| **ALCOA+** | Attributable, Legible, Contemporaneous, Original, Accurate (+ Complete, Consistent, Enduring, Available) -- data integrity framework |
| **AoT** | Agreement of Terms -- formal document defining data access terms |
| **CMK** | Customer-Managed Key (AWS KMS) |
| **CSP** | Content Security Policy -- HTTP header controlling browser resource loading |
| **CSRF** | Cross-Site Request Forgery |
| **CSV** | Computer System Validation (in GxP context) |
| **DAST** | Dynamic Application Security Testing |
| **DDO** | Delegate Data Owner |
| **DDoS** | Distributed Denial of Service |
| **GxP** | Good Practice guidelines (GCP, GLP, GMP, etc.) |
| **HMAC** | Hash-based Message Authentication Code |
| **ICH E6(R2)** | International Council for Harmonisation guideline on Good Clinical Practice |
| **NACL** | Network Access Control List (AWS) |
| **OAC** | Open Access Collection |
| **OIDC** | OpenID Connect -- identity layer on top of OAuth 2.0 |
| **OWASP** | Open Web Application Security Project |
| **PII** | Personally Identifiable Information |
| **PIR** | Post-Incident Review |
| **PKCE** | Proof Key for Code Exchange -- OAuth 2.0 extension preventing authorization code interception |
| **RBAC** | Role-Based Access Control |
| **ROAM** | Role-based Open Access Model |
| **SAST** | Static Application Security Testing |
| **SCA** | Software Composition Analysis |
| **SOX** | Sarbanes-Oxley Act |
| **SSE** | Server-Side Encryption |
| **WAF** | Web Application Firewall |
| **XSS** | Cross-Site Scripting |

---

*This document is a living artifact. It will be updated as open questions are resolved and security decisions are finalized during Sprint Zero. All changes must be tracked via pull request with review from the security champion and engineering lead. This document should be reviewed by AZ InfoSec before production deployment.*

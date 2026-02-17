# 10 - Open Questions Register

**Document ID:** SPRINT-ZERO-10
**Version:** 1.0
**Date:** 2026-02-06
**Author:** Keith Hayes (Lead Software Engineer)
**Status:** Living Document

---

## 1. Purpose & Usage

This document is the **single source of truth** for all outstanding questions that need to be resolved before, during, or after sprint zero. It consolidates questions from all sprint-zero documents plus additional questions identified during planning.

### How to Use

- **Before starting a task**: Check if any P0 questions block that task
- **When a question is answered**: Update the Answer field, set Status to "Answered", add Date Answered
- **When new questions arise**: Add them to the appropriate category with the next available ID
- **Weekly review**: Product Owner and Lead Engineer review all open P0/P1 questions

### Ownership

- **Maintainer**: Lead Engineer (Keith Hayes)
- **Review cadence**: Weekly during sprint zero stand-ups
- **Escalation**: Unanswered P0 questions after 1 week → escalate to WP4 Lead (Jamie MacPherson)

---

## 2. Question Summary Dashboard

### By Priority

| Priority | Description | Count | Open | Answered |
|----------|-------------|-------|------|----------|
| **P0** | Blocks sprint zero | 18 | 18 | 0 |
| **P1** | Blocks sprint 1 | 24 | 24 | 0 |
| **P2** | Needed before MVP (Q1) | 20 | 20 | 0 |
| **P3** | Needed before GA | 10 | 10 | 0 |
| **Total** | | **72** | **72** | **0** |

### By Category

| Category | ID Prefix | Count |
|----------|-----------|-------|
| Data & Integration | Q-DATA | 22 |
| Business Process | Q-BIZ | 14 |
| Security & Compliance | Q-SEC | 12 |
| UX & Design | Q-UX | 6 |
| Infrastructure & DevOps | Q-INFRA | 10 |
| Organizational | Q-ORG | 8 |
| **Total** | | **72** |

---

## 3. Data & Integration Questions

### AZCT REST API

| ID | Question | Priority | Source | Impact | Owner | Status | Answer |
|----|----------|----------|--------|--------|-------|--------|--------|
| Q-DATA-001 | What is the AZCT API base URL and version? Is there an OpenAPI/Swagger specification available? | P0 | 04-integration-map.md | Blocks AZCT client implementation (SZ-EXT-002) | AZCT Team | Open | |
| Q-DATA-002 | What authentication method does the AZCT API use? Service principal, API key, or certificate? | P0 | 04-integration-map.md | Blocks AZCT client auth setup | AZCT Team | Open | |
| Q-DATA-003 | What are the AZCT API rate limits (requests/min, requests/day, concurrent connections)? | P1 | 04-integration-map.md | Determines sync batch sizing (SZ-EXT-003) | AZCT Team | Open | |
| Q-DATA-004 | Does AZCT support pagination? What is the max page size? Cursor-based or offset? | P1 | 04-integration-map.md | Affects sync implementation | AZCT Team | Open | |
| Q-DATA-005 | Does AZCT expose a delta/changes endpoint (e.g., `?modified_since=`) for incremental sync? | P1 | 04-integration-map.md | Determines full-scan vs delta sync strategy | AZCT Team | Open | |
| Q-DATA-006 | Is there an AZCT sandbox/dev API environment for integration testing? | P0 | 04-integration-map.md | Blocks integration testing (SZ-EXT-002) | AZCT Team | Open | |
| Q-DATA-007 | How do AZCT study metadata fields map to Collectoid's Dataset entity? Are all required fields available? | P1 | 03-data-model.md | Determines dataset entity completeness | AZCT Team + Engineering | Open | |

### Cornerstone API

| ID | Question | Priority | Source | Impact | Owner | Status | Answer |
|----|----------|----------|--------|--------|-------|--------|--------|
| Q-DATA-008 | What is the Cornerstone API format and authentication method (OAuth 2.0, API key, SAML)? | P1 | 04-integration-map.md | Blocks client implementation | Cornerstone Admin | Open | |
| Q-DATA-009 | How are Cornerstone user IDs structured? Can they be mapped from Azure AD PRID or email? | P1 | 04-integration-map.md | Blocks user mapping (SZ-EXT-005) | Cornerstone Admin + Identity Services | Open | |
| Q-DATA-010 | Which specific training course IDs are mandatory for ROAM data access? Are they uniform or TA-specific? | P1 | 04-integration-map.md | Affects training verification logic | R&D Data Office | Open | |
| Q-DATA-011 | Is there a Cornerstone sandbox/test tenant for integration testing? | P2 | 04-integration-map.md | Affects integration test approach | Cornerstone Admin | Open | |

### Collibra 2.0

| ID | Question | Priority | Source | Impact | Owner | Status | Answer |
|----|----------|----------|--------|--------|-------|--------|--------|
| Q-DATA-012 | What is the Collibra 2.0 API availability timeline? Will it be ready for Collectoid Q1 launch? | P0 | 04-integration-map.md, 06-risk-register.md (RISK-I-002) | Determines whether to build fallback taxonomy from day one | Collibra Team / WP3 | Open | |
| Q-DATA-013 | What is the Collibra 2.0 API schema? Is it stable or still in flux? | P2 | 04-integration-map.md | Affects client implementation timing | Collibra Team | Open | |
| Q-DATA-014 | How does Collibra's taxonomy map to Collectoid's 30+ category taxonomy? Who is authoritative? | P1 | 03-data-model.md | Determines taxonomy resolver design | Collibra Team + Engineering | Open | |

### Immuta & Starburst/Ranger

| ID | Question | Priority | Source | Impact | Owner | Status | Answer |
|----|----------|----------|--------|--------|-------|--------|--------|
| Q-DATA-015 | What is the Immuta API contract for policy creation? Is there an OpenAPI spec or SDK? | P1 | 04-integration-map.md | Blocks policy provisioning module | Immuta Team / DPO | Open | |
| Q-DATA-016 | How should AoT terms map to Immuta policy conditions? Is there a standard mapping or custom? | P1 | 04-integration-map.md | Affects policy creation logic | Engineering + DPO | Open | |
| Q-DATA-017 | How does Starburst/Ranger policy relate to Immuta? Complementary, cascaded, or independent? | P0 | 04-integration-map.md | Determines whether we need one or two policy integrations | Platform Team + DPO | Open | |
| Q-DATA-018 | Is there an Immuta sandbox instance available for testing? | P2 | 04-integration-map.md | Affects integration testing | Immuta Team | Open | |

### In-App Approvals & Consumption Environments

| ID | Question | Priority | Source | Impact | Owner | Status | Answer |
|----|----------|----------|--------|--------|-------|--------|--------|
| Q-DATA-019 | What are the specific compliance requirements (GxP, SOX) for in-app approval audit trails? Is digital acknowledgement sufficient or are formal digital signatures required? | P0 | 05-security-compliance.md | Affects approval UX, data model, and compliance architecture | Compliance Team | Open | |
| Q-DATA-020 | What approval notification channels are required? (In-app only, in-app + email, in-app + email + Teams?) What are the SLA requirements for approval response times? | P1 | 02-business-requirements.md | Affects notification system design and escalation rules | Product Owner + Stakeholders | Open | |
| Q-DATA-021 | Do any consumption environments (PDP, Domino, SCP, AI Bench) expose provisioning APIs? | P1 | 04-integration-map.md | Determines automated vs link-out provisioning | DPO Team | Open | |
| Q-DATA-022 | What is the deep link URL format for each consumption environment? | P2 | 04-integration-map.md | Affects link-out implementation | DPO Team | Open | |

---

## 4. Business Process Questions

| ID | Question | Priority | Source | Impact | Owner | Status | Answer |
|----|----------|----------|--------|--------|-------|--------|--------|
| Q-BIZ-001 | What does "open access" mean in the end-to-end user journey? Is it truly self-service or does it still require DCM setup? | P0 | F2F Notes.md | Affects fundamental UX flow design | Product Owner (Divya) | Open | |
| Q-BIZ-002 | What is the relationship between "data products" and "data collections"? Are they the same thing or different 90:10 initiatives? | P1 | F2F Notes.md | Determines data model scope | Product Owner | Open | |
| Q-BIZ-003 | Will ~1,000 people requesting access all go through Collectoid, or will some go through Sherlock directly? | P1 | F2F Notes.md | Determines API boundaries between Collectoid and Sherlock | Product Manager (Rafa) | Open | |
| Q-BIZ-004 | How does Immuta's role in individual platforms (PDP, Domino) impact Collectoid's access request flow? | P1 | F2F Notes.md | Affects provisioning architecture | DPO + Platform Teams | Open | |
| Q-BIZ-005 | For "all or nothing" multi-TA approval: what happens if a TA Lead is unavailable for weeks? Is there a delegation or timeout mechanism? | P1 | 02-business-requirements.md, 06-risk-register.md | Affects approval workflow implementation | Product Owner | Open | |
| Q-BIZ-006 | How should amendment conflicts be handled? (Two amendments that contradict each other) | P2 | F2F Notes.md | Affects versioning and conflict detection | Product Owner + BA (Marcin) | Open | |
| Q-BIZ-007 | Is CSV import of datasets still a requirement for Q1 MVP, or is it deferred? | P1 | F2F Notes.md | Affects Q1 scope and backlog | Product Owner | Open | |
| Q-BIZ-008 | What is the multi-user sign-off process? Specifically: who signs in what order (TALT → DPO → Data Owners → TA Leads)? | P1 | F2F Notes.md | Affects approval chain data model and workflow | Product Owner + BA | Open | |
| Q-BIZ-009 | How formal is the Agreement in Principle (AiP) process? Does it need to be captured in Collectoid or is it external? | P2 | F2F Notes.md | Affects collection creation flow scope | Product Owner | Open | |
| Q-BIZ-010 | For Q1 MVP "Explore & Discover" — do users need to see real AZCT data, or is seed/synthetic data acceptable for initial launch? | P0 | 02-business-requirements.md | Determines Q1 data dependency on AZCT API | Product Owner + Product Manager (Beata) | Open | |
| Q-BIZ-011 | What is the exact scope boundary between Collectoid and Sherlock for data discovery? Does Collectoid's browse replace Sherlock's search, or are they complementary? | P1 | 02-business-requirements.md | Affects discovery module design | Product Managers (Beata + Rafa) | Open | |
| Q-BIZ-012 | Should Collectoid support multiple OAC Agreements per collection, or is it always 1:1? | P2 | 03-data-model.md | Affects data model cardinality | BA (Marcin) | Open | |
| Q-BIZ-013 | What approval SLAs should be enforced? (e.g., TA Lead must respond within X days, escalation after Y days) | P2 | 02-business-requirements.md | Affects notification and escalation logic | Product Owner | Open | |
| Q-BIZ-014 | Are there existing collections from the 2025 baseline (BioPharma Closed, Oncology Closed) that need to be migrated into Collectoid at launch? | P1 | VISION.md | Affects data migration plan | R&D Data Office | Open | |

---

## 5. Security & Compliance Questions

| ID | Question | Priority | Source | Impact | Owner | Status | Answer |
|----|----------|----------|--------|--------|-------|--------|--------|
| Q-SEC-001 | Is Collectoid classified as a GxP system? What validation level is required? | P0 | 05-security-compliance.md | Determines testing rigour, change control, documentation requirements | Compliance / QA | Open | |
| Q-SEC-002 | What are the data residency requirements? Which AWS region must data be stored in? | P0 | 05-security-compliance.md, 06-risk-register.md (RISK-SC-004) | Blocks infrastructure provisioning (SZ-INF-001) | Cloud Engineering + Compliance | Open | |
| Q-SEC-003 | What is the minimum audit trail retention period required by regulation or AZ policy? | P1 | 05-security-compliance.md, 03-data-model.md | Affects storage planning and retention policies | Compliance | Open | |
| Q-SEC-004 | Is 21 CFR Part 11 (electronic signatures) applicable to Collectoid's approval workflow? | P1 | 05-security-compliance.md | Affects digital signature implementation | Compliance | Open | |
| Q-SEC-005 | Which AZ internal security standards specifically apply to Collectoid? (Beyond STND-0001498 and SOP-0067196) | P1 | 05-security-compliance.md | Affects security controls implementation | AZ InfoSec | Open | |
| Q-SEC-006 | Does Collectoid handle any data classified as "Strictly Confidential" beyond study metadata? Does patient-level data ever transit through Collectoid? | P0 | 05-security-compliance.md | Determines data protection requirements | Product Owner + Compliance | Open | |
| Q-SEC-007 | What is the Azure AD tenant for Collectoid? Is it the main AZ corporate tenant or a dedicated R&D tenant? | P0 | 05-security-compliance.md | Blocks Azure AD app registration (SZ-AUTH-001) | Identity Services | Open | |
| Q-SEC-008 | Are there existing Azure AD security groups that map to Collectoid roles (DCM, Approver, etc.), or do new groups need to be created? | P1 | 05-security-compliance.md | Affects role mapping implementation (SZ-AUTH-004) | Identity Services | Open | |
| Q-SEC-009 | What penetration testing requirements exist for AZ web applications? Is there an internal security review process? | P2 | 05-security-compliance.md | Affects pre-launch security checklist | AZ InfoSec | Open | |
| Q-SEC-010 | Is there an AZ-approved error tracking service (e.g., Sentry, Datadog)? Or must we use CloudWatch only? | P1 | 09-testing-strategy.md | Affects monitoring setup (SZ-MON-002) | Cloud Engineering | Open | |
| Q-SEC-011 | What is the secret rotation policy at AZ? Automatic rotation required? | P2 | 05-security-compliance.md | Affects Secrets Manager configuration | Cloud Engineering | Open | |
| Q-SEC-012 | Is there an AZ data protection impact assessment (DPIA) template that needs to be completed for Collectoid? | P2 | 05-security-compliance.md | May be a launch requirement | Data Protection Officer | Open | |

---

## 6. UX & Design Questions

| ID | Question | Priority | Source | Impact | Owner | Status | Answer |
|----|----------|----------|--------|--------|-------|--------|--------|
| Q-UX-001 | Which of the 14 POC UX variations (app/ux/1-14) should be carried forward to production? Has stakeholder feedback been collected? | P1 | README.md | Determines production design direction | Product Owner + UX Designer (TBC) | Open | |
| Q-UX-002 | Should Collectoid use the existing shadcn/ui design system from the POC, or is there an AZ internal design system we should adopt? | P0 | 07-technical-decisions.md | Affects entire UI implementation (SZ-UI-001) | Product Owner + Engineering Standards | Open | |
| Q-UX-003 | Are there mobile/tablet support requirements, or is Collectoid desktop-only? | P2 | 02-business-requirements.md | Affects responsive design scope | Product Owner | Open | |
| Q-UX-004 | Is Storybook required for component documentation, or is it a nice-to-have? | P3 | 08-sprint-zero-backlog.md (SZ-UI-003) | Affects sprint zero scope | Product Owner | Open | |
| Q-UX-005 | What accessibility requirements exist beyond WCAG 2.1 AA? Any AZ-specific accessibility standards? | P2 | 02-business-requirements.md | Affects a11y testing scope | Accessibility Team | Open | |
| Q-UX-006 | Should the "Zen" design aesthetic from the POC (font-light default, rounded corners, dynamic colour palettes) continue into production? | P1 | README.md | Affects design token setup (SZ-UI-002) | Product Owner + UX Designer (TBC) | Open | |

---

## 7. Infrastructure & DevOps Questions

| ID | Question | Priority | Source | Impact | Owner | Status | Answer |
|----|----------|----------|--------|--------|-------|--------|--------|
| Q-INFRA-001 | Is there an existing AWS account for Collectoid, or does a new one need to be provisioned? What is the provisioning process and lead time? | P0 | 08-sprint-zero-backlog.md (SZ-INF-001) | Blocks ALL infrastructure setup | Cloud Engineering | Open | |
| Q-INFRA-002 | What domain name will Collectoid use? (e.g., collectoid.az.com, collectoid.astrazeneca.com) | P1 | 08-sprint-zero-backlog.md (SZ-INF-010) | Affects DNS, SSL, CORS configuration | Product Owner + IT | Open | |
| Q-INFRA-003 | What is the SSL certificate provisioning process at AZ? ACM, or internally managed certificates? | P1 | 08-sprint-zero-backlog.md (SZ-INF-010) | Affects HTTPS setup | Cloud Engineering | Open | |
| Q-INFRA-004 | Is GitHub Actions the approved CI/CD platform, or must we use AWS CodePipeline, Jenkins, or another tool? | P0 | 08-sprint-zero-backlog.md (SZ-INF-008), 09-testing-strategy.md | Blocks CI/CD pipeline setup | Cloud Engineering | Open | |
| Q-INFRA-005 | Can Docker Hub and npm registry be accessed from within AZ's network, or must we use internal mirrors? | P0 | 08-sprint-zero-backlog.md | Blocks containerised builds | Cloud Engineering | Open | |
| Q-INFRA-006 | What network path exists between Collectoid's AWS VPC and each external system (AZCT, Cornerstone, Immuta, Collibra)? VPC peering, PrivateLink, or public internet via VPN? | P1 | 04-integration-map.md | Affects network architecture and firewall rules | Cloud Engineering | Open | |
| Q-INFRA-007 | Is Aurora PostgreSQL available and approved in AZ's AWS estate? Or is there a mandated database service? | P0 | 07-technical-decisions.md (ADR-002), 06-risk-register.md (RISK-T-001) | Could require complete database strategy rework | Cloud Engineering | Open | |
| Q-INFRA-008 | Is ElastiCache Redis available and approved? Any restrictions on usage? | P1 | 01-architecture-overview.md | Affects caching and session strategy | Cloud Engineering | Open | |
| Q-INFRA-009 | Is there an existing Terraform / IaC pipeline for AZ AWS infrastructure? Should we use a specific IaC tool? | P1 | 08-sprint-zero-backlog.md (SZ-INF-012) | Affects infrastructure automation approach | Cloud Engineering | Open | |
| Q-INFRA-010 | What are the environment promotion rules? (e.g., dev → staging → prod approval gates, change advisory board?) | P2 | 08-sprint-zero-backlog.md | Affects release process | Cloud Engineering + Change Management | Open | |

---

## 8. Organizational Questions

| ID | Question | Priority | Source | Impact | Owner | Status | Answer |
|----|----------|----------|--------|--------|-------|--------|--------|
| Q-ORG-001 | When will the Tech Lead position be confirmed and filled? | P0 | 06-risk-register.md (RISK-O-003, score 20) | Architecture decisions being made by single engineer; review quality reduced | WP4 Lead (Jamie MacPherson) | Open | |
| Q-ORG-002 | When will the UX/UI Designer position be confirmed and filled? | P1 | 06-risk-register.md (RISK-O-003, score 20) | Design direction being set without UX expertise | WP4 Lead | Open | |
| Q-ORG-003 | What is the stakeholder review cadence? Sprint reviews, demos, or ad-hoc? | P1 | 02-business-requirements.md | Affects sprint planning and demo preparation | Product Owner (Divya) + PM (Cayetana) | Open | |
| Q-ORG-004 | Who has final decision authority on technical choices (database, API design, etc.)? Lead Engineer, Tech Lead (TBC), or committee? | P0 | 07-technical-decisions.md | Affects ability to proceed with ADR implementations | WP4 Lead | Open | |
| Q-ORG-005 | How should we handle requirements volatility from weekly LT direction changes? Is there a formal change request process? | P1 | 06-risk-register.md (RISK-O-001, score 20) | Affects sprint planning stability | Product Owner + PM | Open | |
| Q-ORG-006 | How should Collectoid coordinate with Sherlock and USP teams given shared resources (Keith 0.5 FTE, Divya 0.4 FTE, Marcin 0.5 FTE)? | P1 | 06-risk-register.md (RISK-O-002) | Affects capacity planning and sprint velocity | WP4 Lead | Open | |
| Q-ORG-007 | Is there budget for third-party tools (Sentry, Snyk, Storybook Cloud, etc.)? What is the approval process? | P2 | Multiple docs | Affects tool selection | PM (Cayetana) | Open | |
| Q-ORG-008 | Will there be dedicated QA/testing resources, or is testing the responsibility of the engineering team? | P2 | 09-testing-strategy.md | Affects testing strategy and capacity | WP4 Lead | Open | |

---

## 5. Cross-Reference Matrix

### P0 Questions Blocking Sprint Zero Tasks

| Question ID | Blocked Tasks | Resolution Needed By |
|-------------|---------------|---------------------|
| Q-DATA-001 | SZ-EXT-002 (AZCT client) | Week 1 |
| Q-DATA-002 | SZ-EXT-002 (AZCT client) | Week 1 |
| Q-DATA-006 | SZ-EXT-002, SZ-EXT-003 (AZCT integration) | Week 1 |
| Q-DATA-012 | SZ-EXT-006 (Collibra timeline), taxonomy design | Week 1 |
| Q-DATA-017 | Architecture design (single vs dual policy integration) | Week 1 |
| Q-BIZ-001 | UX flow design, collection creation scope | Week 2 |
| Q-BIZ-010 | Q1 MVP data strategy | Week 2 |
| Q-SEC-001 | Testing rigour, validation documentation | Week 2 |
| Q-SEC-002 | SZ-INF-001 (VPC, region selection) | Week 1 |
| Q-SEC-006 | Data protection controls, encryption scope | Week 2 |
| Q-SEC-007 | SZ-AUTH-001 (Azure AD app registration) | Week 1 |
| Q-UX-002 | SZ-UI-001 (design system migration) | Week 2 |
| Q-INFRA-001 | ALL SZ-INF-* tasks | Week 1 |
| Q-INFRA-004 | SZ-INF-008 (CI/CD pipeline) | Week 1 |
| Q-INFRA-005 | Docker builds, npm install | Week 1 |
| Q-INFRA-007 | SZ-INF-004 (database provisioning), SZ-DB-* | Week 1 |
| Q-ORG-001 | Architecture review, decision authority | Ongoing |
| Q-ORG-004 | Ability to proceed with ADR implementations | Week 1 |

### P1 Questions Blocking Sprint 1

| Question ID | Blocked Feature / Task |
|-------------|----------------------|
| Q-DATA-003, Q-DATA-004, Q-DATA-005 | AZCT batch sync implementation |
| Q-DATA-007 | Dataset entity completeness |
| Q-DATA-008, Q-DATA-009, Q-DATA-010 | Cornerstone training verification |
| Q-DATA-014 | Taxonomy resolver design |
| Q-DATA-015, Q-DATA-016 | Immuta policy provisioning |
| Q-DATA-021 | Provisioning automation scope |
| Q-BIZ-002, Q-BIZ-003, Q-BIZ-004 | Data model and API boundaries |
| Q-BIZ-005 | Approval workflow edge cases |
| Q-BIZ-007 | Q1 MVP scope (CSV import) |
| Q-BIZ-008 | Approval chain implementation |
| Q-BIZ-011 | Discovery module design |
| Q-BIZ-014 | Data migration planning |
| Q-SEC-003, Q-SEC-004, Q-SEC-005 | Audit trail and compliance implementation |
| Q-SEC-008 | Role mapping implementation |
| Q-SEC-010 | Monitoring setup |
| Q-UX-001, Q-UX-006 | Design direction |
| Q-INFRA-002, Q-INFRA-003 | DNS and HTTPS setup |
| Q-INFRA-006 | Network architecture |
| Q-INFRA-008, Q-INFRA-009 | Caching and IaC approach |
| Q-ORG-002, Q-ORG-003 | UX design, sprint cadence |
| Q-ORG-005, Q-ORG-006 | Change management, capacity |

---

## 6. Escalation Process

### Escalation Ladder

| Time Unanswered | Action | Escalation To |
|-----------------|--------|---------------|
| **P0: 3 business days** | Send reminder to owner + CC PM (Cayetana) | PM (Cayetana) |
| **P0: 5 business days** | Escalate to WP4 Lead with impact assessment | Jamie MacPherson |
| **P0: 10 business days** | Escalate to DOVS2 Program Lead with sprint zero delay warning | Peder Blomgren (VP) |
| **P1: 1 week** | Send reminder to owner | PM (Cayetana) |
| **P1: 2 weeks** | Escalate to WP4 Lead | Jamie MacPherson |
| **P2/P3: 2 weeks** | Send reminder to owner | Lead Engineer |
| **P2/P3: 4 weeks** | Escalate to PM | PM (Cayetana) |

### Escalation Email Template

```
Subject: [Collectoid] Unanswered P0 Question Blocking Sprint Zero - [Q-ID]

Hi [Owner],

The following question has been open for [X] business days and is blocking
sprint zero progress:

Question: [Full question text]
Impact: [What is blocked]
Raised: [Date]

Could you please provide an answer or point us to the right person?

If this question cannot be answered within [Y] business days, we will need
to [escalate / proceed with assumption / defer the blocked work].

Thanks,
Keith
```

---

## 7. Question Review Cadence

| Meeting | Frequency | Participants | Focus |
|---------|-----------|-------------|-------|
| **Sprint Zero Stand-up** | Daily (15 min) | Engineering, PM | Review newly blocked tasks, P0 question status |
| **Weekly Question Review** | Weekly (30 min) | Lead Engineer, Product Owner, PM | Review all open questions, update priorities, assign owners |
| **Stakeholder Check-in** | Bi-weekly (30 min) | Lead Engineer, WP4 Lead, Product Owner | Escalated questions, cross-workstream dependencies |

### Question Lifecycle

```
New Question Identified
        │
        ▼
  Add to Register (Status: Open)
        │
        ▼
  Assign Owner + Priority
        │
        ▼
  Owner Investigates ──────────► Answer Found ──► Update Register (Status: Answered)
        │                                              │
        ▼                                              ▼
  No Answer After SLA ──► Escalate               Close Question
        │
        ▼
  Continue Escalation Ladder
        │
        ▼
  Proceed with Documented Assumption
  (mark as "Assumed" with assumption text)
```

---

## Appendix A: Questions by Sprint Zero Week

### Week 1 (Must be answered or escalated)

All P0 questions — particularly:
- Q-INFRA-001 (AWS account)
- Q-INFRA-004 (CI/CD platform)
- Q-INFRA-005 (Registry access)
- Q-INFRA-007 (Database approval)
- Q-SEC-002 (AWS region)
- Q-SEC-007 (Azure AD tenant)
- Q-DATA-001, Q-DATA-002, Q-DATA-006 (AZCT API basics)
- Q-DATA-012 (Collibra timeline)
- Q-DATA-017 (Immuta/Ranger relationship)
- Q-ORG-004 (Decision authority)

### Week 2 (Should be answered)

- Q-BIZ-001 (Open access definition)
- Q-BIZ-010 (Q1 data strategy)
- Q-SEC-001 (GxP classification)
- Q-SEC-006 (Data sensitivity scope)
- Q-UX-002 (Design system choice)

### Weeks 3-4 (Important for sprint 1 readiness)

All P1 questions — particularly data integration questions (Q-DATA-003 through Q-DATA-016) and business process questions (Q-BIZ-002 through Q-BIZ-008).

### Weeks 5-6 (Before sprint 1 starts)

Remaining P1 questions and P2 questions that affect Q1 MVP scope.

---

*This is a living document. Update it as questions are answered and new questions emerge. Last reviewed: 2026-02-06.*

*Cross-references: `01-architecture-overview.md` | `02-business-requirements.md` | `03-data-model.md` | `04-integration-map.md` | `05-security-compliance.md` | `06-risk-register.md` | `07-technical-decisions.md` | `08-sprint-zero-backlog.md` | `09-testing-strategy.md`*

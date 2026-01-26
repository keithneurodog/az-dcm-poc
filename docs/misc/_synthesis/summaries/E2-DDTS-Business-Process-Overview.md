# Summary: Data Exchange - DDTS Business Process Overview

**Source:** `DOVS2 2026/WP 2 R&D Data Exchange/WP2 Material/Nithya - Data Plane - DDTS Business Process Overview.md`
**Type:** Process Overview Presentation
**Workstream:** WP2 R&D Data Exchange
**Date:** 21 January 2026
**Author:** Nithya KA, Business Process Owner

---

## Key Points

- **Topic:** Bi-directional R&D Data transfers at AstraZeneca via DDTS `[ref: slide 3]`
- **Scope:** Inbound and Outbound data transfers, all modalities (clinical, images, omics) `[ref: slide 3]`
- **Goal:** Secured, access-controlled, and compliant data transfers `[ref: slide 3]`

---

## R&D Data Plane Architecture `[ref: slide 2]`

Four foundational pillars:

| Pillar | Description |
|--------|-------------|
| **Data Exchange** | Manages internal/external data movement, secure bi-directional transfers to/from DataStore |
| **Data Storage** | On-demand Workspaces for compliant storage across source systems |
| **Data Access** | PBAC and ABAC for access control within workspaces |
| **Self-Service** | UI and API portal for user/programmatic interaction |

---

## DDTS Service Request Process `[ref: slides 5-6]`

### Milestones:
1. **Consultation:** Data Office clarifies use case, datasets, timelines
2. **Capture Metadata:** Required values for ingestion/cataloguing (FAIR compliance)
3. **Vendor Onboarding:** User accounts and DDTS pipeline setup
4. **DDTS Environment:** Test environment for PoC/UAT before PROD
5. **Data Access:** Data Plane bucket access for analysis or data products

---

## Roles & Responsibilities `[ref: slide 7]`

| Role | Responsibilities |
|------|------------------|
| **Requester** | Raises request; provides mandatory metadata |
| **Data Steward** | Handles ingestion request; coordinates with requester, vendor, IT |
| **IT Support Team** | Performs infrastructure setup for ingestions |

---

## Inbound Data Transfer `[ref: slides 8-12]`

**Trigger:** Need data from external collaborator transferred to AZ

**Workflow:**
1. Create Inbound Data Transfer Request
2. Data Ingestion Activity (vendor → AZ)
3. Data Provisioning Process

**Provisioning Questions:**
- What data modalities needed?
- Who will analyze? (access list)
- How long? (duration)
- Analysis intent and methodology?
- Internal Decision Making or Publication?
- Will AI/ML be used? Building/training a model?
- Which analysis platform?

---

## Outbound Data Transfer `[ref: slides 14-18]`

**Trigger:** Need to expose data to external collaborator from AZ

**Workflow:**
1. Create Outbound Data Transfer Request
2. Data Source to Data Lake Transfer
3. Lake to Vendor Transfer

---

## Conflicts/Contradictions

- None identified

---

## Open Questions

- How does DDTS interact with ROAM? (Internal vs External sharing)

---

## Cross-References

- Related to: E5 (Data exchange ecosystem challenges)
- Related to: E4 (Vendor transfers - legal requirements)
- This is the technical infrastructure that WP2 manages

# Summary: ROAM User Guide v2.0

**Source:** `00. Final Documentation - 2025/User Guide v2.0.md`
**Type:** User Guide
**Workstream:** 2025 Baseline
**Date:** 16 December 2025 (v2.0)
**Authors:** Marcin Feistner, Henry Constable, Ben Barnard, Dominic Smith

---

## Key Points

- **Purpose:** End-user guide for Role-based Open Access Model (ROAM) `[ref: header]`
- **Audience:** Data consumers accessing R&D clinical trial data
- **Key message:** "Much more data, much faster, open by design" `[ref: C4 User Journey]`

---

## User Journey Phases `[ref: Section 1]`

### One-Time Setup Steps

1. **Awareness:** Contact email confirming inclusion + link to Knowledge Hub SharePoint
2. **Compliance:** Complete mandatory training, R&D Data Office sets up access permissions

### Per-Project Steps

1. **Ideation:** Use ROAM Power BI Dashboard to review available collections
2. **Pre-planning:** Self-check intended use aligns with User Guide (Primary Use)
3. **Execution:** Access data via Data Product Solution (PDP)
4. **Close-down:** Submit Project Completion Form

---

## Key Changes in v2.0 `[ref: Section 1.2]`

- **Role-Based Access:** Permissions aligned to job role, not project intent
- **Primary Use reinterpretation:** DGB decision (June 2025) expanded Primary Use interpretation
- **Retiring Extended Primary Use (EPU):** Unlocking more patient data for analysis
- **Access Mechanism:** Data Product Solution (PDP) only (no Golden Ticket in v2.0)

---

## Primary Use vs Secondary Use `[ref: Section 2.2]`

### Primary Use (Permitted)
- R&D activities supporting AZ drug development
- Data use by AZ and third parties under AZ direction
- **Examples:** Drug development, regulatory compliance, safety monitoring, diagnostic tests, cross-study learning, scientific publications
- **AI:** Analytics permitted; development/training NOT permitted

### Secondary Use (Not Permitted under ROAM)
- Future scientific health-related research with country limitations
- External data sharing
- AI development/training

---

## Mandatory Training `[ref: Section 2.1]`

| ID | Course | Description |
|----|--------|-------------|
| A | Global Standard - Internal Sharing | STND-0001498 |
| B | SOP - Internal Sharing | SOP-0067196 |
| C | Safety Training | SOP-0108734 Management of Important New Safety Issues |
| D | User Guide | This document |

---

## Data Provisioning Checks `[ref: Section 2.3]`

Before access is granted, DPO verifies:
- **Drug Product Rights:** M&A, divestments, collaborations
- **Cross Border Data Transfer:** HGR, US Data Security Rule, legal entity arrangements
- **Data Owner Approval:** Studies 6 months post-CDL are open by default

---

## Access Models Available `[ref: Section 2.4]`

| Model | When to Use |
|-------|-------------|
| **Program Team / IEMT** | Data for your specific study/program |
| **ROAM** | Studies in Open Access Collection (Primary Use) |
| **iDAP Process** | Data outside ROAM scope |

---

## Execution - Data Product Solution (PDP) `[ref: Section 3.5]`

- **What:** Study Patient Data Product (SPDP) pipeline - standardized SDTM data in Starburst
- **Environments:** SCP, Domino, AI Bench, entimICE
- **Technical:** Ranger for access control (planned Immuta replacement 2026)
- **No bulk copy needed:** Query on demand

---

## User Responsibilities `[ref: Section 3.4]`

**Required:**
- Maintain confidentiality and data security
- Adhere to permitted uses
- Report breaches immediately to DataOffice-Compliance@astrazeneca.com
- 24-hour notification for medical/safety findings
- Follow Publication Sign-off (PSO) process

**Prohibited:**
- Attempting to identify individuals
- Combining with external datasets without approval
- Sharing with unauthorized parties
- Reverse engineering data sources
- Moving data out of approved environment

---

## Conflicts/Contradictions

- v2.0 removes "Golden Ticket Solution" that was in v1.0 - only PDP remains `[ref: Section 3.5]`
- v2.0 renames model from "90:10 Open Access Model" to "Role-based Open Access Model (ROAM)"

---

## Open Questions

- Approval completion date still marked as `<insert date>` `[ref: header]`

---

## Cross-References

- Supersedes: C5 (User Guide v1.0)
- Related to: C1 (ROAM Guidance), C3 (Document Index), C4 (User Journey)
- Implements user-facing aspects of Collectoid UI requirements (WP4)

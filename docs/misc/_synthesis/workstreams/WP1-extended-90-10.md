# WP1: Extended 90-10 - Workstream Synthesis

---

## Overview

WP1 extends the Role-based Open Access Model (ROAM) beyond the initial BioPharma pilot to additional therapeutic areas and user groups. The "90:10" refers to the target: 90% of data needs met through open access, 10% through streamlined requests.

---

## Current State (2025 Baseline)

### Collections Established:

| Collection | TA | Status | Studies | In PDP |
|------------|-----|--------|---------|--------|
| BioPharma Closed | CVRM, R&I, V&I | Active | 836 | 307 |
| Oncology Closed | ONC, IMMUONC | Active | 411 | 139 |
| Oncology Ongoing | ONC | In Review | 25 | 4 |

### User Groups with Access:

**BioPharma:**
- Statisticians, Statistical Programmers, Data Scientists
- Clinical Information Scientists
- Clinical Pharmacometricians
- Data Scientists & Bioinformaticians

**Oncology:**
- Data Scientists, Data Engineers, Bioinformaticians
- Computational Pathologists, Data Analysts
- Research Scientists (Early/Late Development)
- Programmers, Statisticians (Biometrics)

---

## 2026 Expansion Goals

From Program Charter (A2):
- Expand open collections for ODS&AI, Oncology Biometrics, Clinical Pharmacology, BioPharma
- Target: >1,000 additional users with open access to >90% of their data needs

---

## ROAM Process (A-F)

| Step | Name | Description |
|------|------|-------------|
| (A) | Agreement in Principle | Seek sponsorship from stakeholders |
| (B) | OAC Agreement | Define data scope with DDO approval |
| (C) | Data Use Terms | Define users, terms, permissions |
| (D) | Implement | Study lists, user lists, training, technical setup |
| (E) | Access Granted | Users access via PDP or Entimice |
| (F) | Maintain | Quarterly reviews, compliance checks |

---

## Access Mechanisms

### 1. Data Product Solution (PDP)
- **What:** SPDP pipeline with SDTM standardized data in Starburst
- **How:** Proactive (pre-provisioned after training)
- **Environments:** SCP, Domino, AI Bench, entimICE

### 2. Entimice Access Process (BioPharma-specific)
- **What:** Access to original study assets in native platforms
- **How:** Reactive (granted on demand)
- **Data:** Original SAS files, omics data, imaging data

---

## Quarterly Opt-in/Opt-out Process

From OAC Agreement (C7):
1. Data Office prepares list of candidate studies
2. Meeting with Biometrics rep + DDO + Data Office
3. Decisions on inclusions/exclusions
4. Collection updated

**Business Sensitivity Exception:** GPTs or DDOs may flag and exclude specific studies.

---

## Key Criteria for '90'-able Studies

| Filter | Requirement |
|--------|-------------|
| First Subject In | After 2013-12-31 |
| Product Rights | Not "Research not allowed" |
| Study Run By | RD, ISMO, Externally sponsored (excl. Investigator-run) |
| Study Status | Closed >6 months post-DBL (for Closed collections) |

---

## Permitted vs Prohibited Uses

| Use Type | Permitted? |
|----------|------------|
| Primary Use (IMI-guided drug development) | Yes |
| AI analytics | Yes |
| AI development/training | **No** |
| Software development/testing | **No** |
| External data sharing | Standard process |
| External publication | Standard PSO process |

---

## Relevance to Collectoid

Collectoid UI must support:
1. **Viewing collections** - Show available collections and their scope
2. **Managing datasets** - Add/remove studies from collections (opt-in/out)
3. **Managing users** - Add/remove users from collection access
4. **Tracking requests** - View and manage access requests outside open collections
5. **Audit trail** - Log all changes to collections and rules

---

## Source Documents

- C1: ROAM Guidance v1.1
- C2: User Guide v2.0
- C6: BioPharma User Guide
- C7: OAC Agreement Template
- C8: AOT Template
- D5: Comms & Change Materials
- G1-G5: Oncology Agreements

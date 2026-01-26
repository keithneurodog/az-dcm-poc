# Summary: Data Readiness Workshop 13 Dec 2025

**Source:** `DOVS2 2026/WP 3 Data Readiness/20251213 Data readiness principles and metadata.md`
**Type:** Workshop Presentation
**Workstream:** WP3 Data Readiness
**Date:** 13 December 2025

---

## Key Points

- **Purpose:** Alignment on conceptual model and data readiness principles for ROAM `[ref: slide 2]`
- **Focus:** '90'-able Studies (studies available for ROAM) `[ref: slide 2]`

---

## Workshop Objectives `[ref: slide 2]`

1. **Conceptual Model:** Alignment on Role-based Open Access Model
2. **Principles & Metadata:** Discuss and agree on:
   - '90'-able Studies
   - TA Closed Collections (TA Codes + Closed Status)
   - Data Product Rights (for '90')
   - Data Scope Dashboard (single view of available data)
   - Who answers questions (Peder, ODSAI, data users)
   - Short vs Long-term solutions

---

## Conceptual Model `[ref: slide 3]`

**90:10 leverages top-down agreement of:**
1. **Study Info** - From R&D Processes & Systems of Record
2. **Data Scope** - Data Owner Approvals, Data Product Rights
3. **Terms of Use** - Umbrella Terms, Patient Data Rights, Data Transfer Limitations
4. **User Scope** - All R&D Users → Umbrella Groups → Approved User Lists

**Access Mechanisms:**
- R&D Data Products (PDP)
- R&D Pipeline
- Analytics environments

---

## '90'-able Studies Definition `[ref: slides 4-5]`

### Study Universe:
- Total in AZCT: ~28,000 studies
- '90'-able Studies: 1,763 studies

### Criteria (from slide 8):
| Criteria | Filter |
|----------|--------|
| First Subject In | After 2013-12-31 |
| Product Rights | Not "Research not allowed" |
| Study Run By | RD, ISMO, Externally sponsored (excluding Investigator-run) |

### Breakdown by Collection:

| Collection | Closed Studies | With DPR | In PDP |
|------------|----------------|----------|--------|
| BP Closed | 836 | 591 | 307 |
| ONC Closed | 411 | 343 | 139 |
| ONC Ongoing | 25 | 16 | 4 |

---

## Data Scope Criteria `[ref: slide 4]`

### Study Info (AZCT):
- **Principle:** Most relevant studies with legal rights, R&D funded
- **Metadata:** FSI > 2014, Internal Data Reuse ≠ "Research not allowed", Study super type ≠ "Externally Sponsored"

### Data Owner Approvals:
- **Cross BP:** TA Code = AI, CVRM, GI, INFEC, INFL, RESP, V&I
- **Cross ONC:** TA Code = ONC, IMMUONC
- **Status:** Archived, Closed, Closing, Completed, etc.

### Data Product Rights:
- Internal Research Allowed (using Beata/Corlia logic)
- Internal Data Reuse = "Research Allowed"

---

## Source of Truth Options `[ref: slide 6]`

### Current Sources (Fragmented):
- Patient Universe / PowerBI
- Stacy / DPO Tables
- VS2 Collections SharePoint list
- SPDP Study Overview Report
- ROAM Collections PowerBI Dashboard

### Proposals:
- **Short-term:** Single source of truth consolidation
- **Long-term:** Collectoid Solution

---

## Data Location to PDP Pipeline `[ref: slide 11]`

### Starting Point:
- 1,400+ studies based on FSI > 2014, CDL + 6 months, legal rights, RD/ISMO/externally sponsored

### Current State:
- 825 locations found in entimICE
- 149 studies in CTDS (migration delayed)
- ~400+ studies undocumented

### Risk:
"Risk with just pushing data found for closed studies to PDP as in several cases this will lead to either incorrect location selected or that two or more locations need to be combined. High quality of data needed to not jeopardize integrity."

---

## Conflicts/Contradictions

- Multiple sources of truth for data availability (slide 6)
- CTDS migration is late - studies won't be accessible

---

## Open Questions

- Who determines "Beata/Corlia logic" for Data Product Rights?
- What is timeline for Collectoid as source of truth?

---

## Cross-References

- Related to: C1 (ROAM Guidance - process this implements)
- Related to: F1, F2, F4 (Other WP3 documents)
- Directly informs: WP4 Collectoid UI (single source of truth)

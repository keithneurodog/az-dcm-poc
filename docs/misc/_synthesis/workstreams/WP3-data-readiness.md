# WP3: Data Readiness - Workstream Synthesis

---

## Overview

WP3 ensures data is ready and available for the ROAM model - addressing metadata gaps, study data locations, and data quality to enable the "90" in 90:10.

---

## Core Challenge

From F2 (WP3 Scope):

> Multiple sources of truth for data availability exist, with incomplete metadata coverage making it difficult to determine what data is actually accessible.

**Key Issues:**
- <5% of R&D data catalogued centrally
- Multiple uncoordinated cataloguing initiatives
- Fragmented sources (Patient Universe, DPO Tables, SharePoint, PowerBI dashboards)

---

## Study Universe

From F3 (Data Readiness Workshop):

| Level | Count |
|-------|-------|
| Total studies in AZCT | ~28,000 |
| '90'-able studies | 1,763 |
| With Data Product Rights | ~950 |
| Currently in PDP | ~450 |

**Gap:** ~1,300 studies are '90'-able but not yet in PDP

---

## '90'-able Study Criteria

| Filter | Requirement |
|--------|-------------|
| First Subject In | After 2013-12-31 |
| Product Rights | Internal Data Reuse = "Research Allowed" |
| Study Run By | RD, ISMO, Externally sponsored |
| Study Super Type | Not "Externally Sponsored" |

---

## Metadata Landscape (F1)

### Coverage Analysis:
- 28,255 studies in AZCT
- 3,095 meet criteria for analysis
- Significant gaps in coverage for key attributes

### Key Attributes Needed:
- Data location
- VCV (Verified Clinical Values)
- Ethical review status
- Legal review status
- DAF status

### Ongoing Initiatives:
| Initiative | Status |
|------------|--------|
| Data location | In tracking |
| VCV | In tracking |
| Ethical review | In tracking |
| Legal review | Under development, not yet in AZCT |
| DAF | Not tracked |

---

## GPSSS Integration (F4)

WP3 shares work packages with GPSSS (Global Patient Safety Strategic Solution):

### Shared:
- Study metadata standards & capture
- PDP data pool 2014+ (integration to PDR)
- Historic metadata remediation

### GPSSS-specific:
- Data Visualisation (PowerBI for safety)
- Ways of Working (safety processes)

---

## Data Flow Architecture

From F4:
```
Sources → Collection/Aggregation → Visualization

Sources:
- Rave DELTA (RCDF)
- PDLZ Raw Data
- PDR

Aggregation:
- Raw Data Store
- Patient Data Product (PDP)

Output:
- PowerBI dashboards
- Analysis environments
```

---

## Single Source of Truth Proposal

From F3 (Data Readiness Workshop):

**Short-term:** Consolidate existing sources into single dashboard

**Long-term:** **Collectoid** as the single source of truth for:
- What collections exist
- What studies are in each collection
- Who has access
- What data is available in PDP

---

## Patient 360

From F2 (WP3 Scope):

**Goal:** Identify, collect and connect data for a patient across modalities (consent, clinical patient, IO, samples)

**Outstanding Question:** Can PDP be the source with PBAC controlling access?

---

## Study Status Definitions

**Closed Studies:**
- CSR + 6 months (standard definition)
- Treatment extensions (may not have CSR date)
- Closed arms for ongoing trials

**Grey Zone:**
- Studies with DBL <6 months
- Active studies with closed arms

---

## Relevance to Collectoid

Collectoid must address the "fragmented sources" problem by:

1. **Unified view** - Single dashboard for all collections
2. **Study status** - Clear indication of what's available vs pending
3. **Metadata visibility** - Show key attributes affecting access
4. **Data location** - Surface where data actually lives (PDP, entimICE, etc.)

---

## Source Documents

- F1: Metadata Landscape Workshop
- F2: WP3 Scope Understanding & Questions
- F3: Data Readiness Principles Workshop
- F4: GPSSS Mapping

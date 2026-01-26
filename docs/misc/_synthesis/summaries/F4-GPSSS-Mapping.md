# Summary: GPSSS and DOVS2 Mapping

**Source:** `DOVS2 2026/WP 3 Data Readiness/DOVS2_GPSSS mapping.md`
**Type:** Project Alignment Deck
**Workstream:** WP3 Data Readiness
**Author:** Jamie MacPherson

---

## Key Points

- **GPSSS:** Global Patient Safety Strategic Solution `[ref: slide 3]`
- **Purpose:** Build solution to support patient safety monitoring from AZ-sponsored clinical trials `[ref: slide 3]`
- **Connection:** DOVS2 WP3 and GPSSS have shared work packages `[ref: slide 5]`

---

## Data Office Value Streams `[ref: slide 2]`

All R&D Data Office work is organized by Value Streams:
- **DOVS2:** Transforming Data Sharing & Access
- **DOVS3:** Delivering Targeted Data Solutions

GPSSS project work is mapped to DOVS2 and DOVS3.

---

## GPSSS Workstreams `[ref: slide 3]`

| WS | Name | Description |
|----|------|-------------|
| 1 | Ways of Working | Patient safety processes (NOT mapped to DOVS) |
| 2 | Data Pipeline | Providing patient safety data from historic/ongoing studies → **MAPS TO DOVS2** |
| 3 | Data Visualisation | PowerBI visual analytics service → MAPS TO DOVS3 |

---

## DOVS2 / GPSSS Overlap `[ref: slides 4-5]`

### DOVS2 Unique:
- Role-based open access
- AI & Tech for data sharing processes

### GPSSS Unique:
- Ways of Working (Workstream 1)
- Data Visualisation (Workstream 3)

### Shared Work Packages:
| Package | Description |
|---------|-------------|
| Patient 360 | Patient data across modalities |
| Study metadata standards & capture | Define standards, devise capture process |
| PDP data pool 2014+ | Integration to PDR |
| Multi-modal data | Multiple data formats including ADaM |
| Historic metadata remediation | Remediate historical studies |

---

## Data Pipeline Scope `[ref: slide 8]`

### Processes Supported:
- NGS submissions (study data + historic background for ISS)
- Safety Surveillance, TMG, TPP (ongoing + historic data)
- Trial design & planning (additional use)

### Data Scope:
**In Scope:**
- AZ sponsored studies (AZ-Rave Delta or CRO Landing Zone)
- Labs data
- Historic data from 2014+ by default, older by request
- Current studies for submission and surveillance
- Milestone and protocol event metadata

**Out of Scope:**
- Non-AZ sponsored/owned
- China & Japan submissions (TBD)
- Argus (already accessible)

---

## Data Flow Architecture `[ref: slide 9]`

```
Sources → Collection/Aggregation → Visualization/Output

Sources:
- Rave DELTA (RCDF)
- PDLZ Raw Data (RCDF)
- PDLZ Outsourced Study (RCDF)
- PDR (RCDF)
- AZCT/Other for study-dataset mapping
- RYZE (Study Instance Metadata)

Aggregation:
- Raw Data Store (New)
- Patient Data Product (Enhanced)

Output:
- PowerBI (Templates for NGS, SST)
```

---

## Governance & Roles `[ref: slides 6-7]`

### DOVS2:
- **Lead:** Jamie MacPherson
- **Project Manager:** Cayetana Vazquez
- **Data/Metadata:** Maria Benjegard, Magda Wlodarczak
- **Data Standards:** Bijay Jassal
- **Architecture:** Cristoffer Stedt

### GPSSS:
- **Project Managers:** Camilla Eliasson (overarching), Irene Fourie (Study Patient)
- **Programme Manager:** Louise Fincham

### Alignment Mechanism:
"Risk, issues, resourcing, priorities & plan" - alignment required between project teams

---

## Conflicts/Contradictions

- "Requirements are truly shared (not by chance), with potentially differing priorities" - potential for conflict `[ref: slide 5]`

---

## Open Questions

- How are shared priorities resolved?
- What is the governance mechanism for shared work packages?

---

## Cross-References

- Related to: F1-F3 (Other WP3 documents)
- Related to: A2 (Program Charter - mentions GPSSS alignment)
- Shared teams between DOVS2 and GPSSS

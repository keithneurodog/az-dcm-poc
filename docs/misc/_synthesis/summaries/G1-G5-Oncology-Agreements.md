# Summary: Oncology Open Access Agreements (G1-G5)

**Source:** Root level `docs/misc/` files
**Type:** Agreement Documents
**Workstream:** WP1 Extended 90-10 (Oncology)

---

## Documents Covered

| ID | Document | Collection | Status |
|----|----------|------------|--------|
| G1 | (B) OAC Agreement - Oncology Closed Collection.pdf | Oncology Closed | PDF - not readable |
| G2 | ODS&AI Open access Data Collection - Agreement of Terms.pdf | ODSAI Closed | PDF - not readable |
| G3 | Ongoing Data Collection - Opt in and Out.md | Oncology Ongoing | Template v0.9 |
| G4 | Agreement of Terms - Closed Collection.md | Oncology Closed | v1.0, 02-Oct-2025 |
| G5 | Agreement of Terms - Ongoing Collection.md | Oncology Ongoing | v1.0, 26-Sep-2025 |

---

## Oncology Closed Collection AOT (G4) `[ref: Agreement of Terms - Closed Collection.md]`

### Base Definition:
- **AOT ID:** AoT-2.00
- **Name:** Oncology R&D AZ Sponsored Closed Studies Open Access
- **Description:** Open access to closed studies collection for ODSAI Data Scientists, Bioinformaticians, and Late/Early Oncology Research Scientists

### Data Scope:
- **Collection ID:** OaC-2.00
- **Collection:** Oncology R&D AZ Sponsored Closed, Primary-use Clinical Study Collection

### User Scope:
| Department | Role Types |
|------------|------------|
| ODSAI | Data Scientist, Data Engineer, Bioinformatician, Computational Pathologist, Data Analyst |
| Early/Late Oncology Development | Research Scientist |
| Oncology Biometrics | Programmer, Statistician |

### Terms of Use:
| Category | Permitted? |
|----------|------------|
| Primary Use (IMI-guided) | Yes |
| AI research/training | **No** |
| Software development | **No** |
| Internal publication | Yes |
| External publication | Standard PSO process |
| External sharing | Standard External Sharing process |

---

## Oncology Ongoing Collection AOT (G5) `[ref: Agreement of Terms - Ongoing Collection.md]`

### Base Definition:
- **AOT ID:** AoT-2.00
- **Name:** Oncology R&D AZ Sponsored Ongoing Studies Open Access
- **Description:** Open access to ongoing studies collection for ODSAI Data Scientists, Bioinformaticians, and Late/Early Oncology Research Scientists

### Data Scope:
- **Collection ID:** OaC-1.00
- **Collection:** Oncology R&D AZ Sponsored Ongoing, Primary-use Clinical Study Collection

### User Scope:
| Department | Role Types |
|------------|------------|
| ODSAI | Data Scientist, Data Engineer, Bioinformatician |
| Early/Late Oncology Development | Research Scientist |

### Terms of Use:
Same as Closed Collection (G4)

---

## Oncology Ongoing Opt-in/Opt-out (G3) `[ref: Ongoing Data Collection - Opt in and Out.md]`

### Purpose:
Document to support DDO review for including/excluding datasets in an Open Data Collection

### Collection Description:
"A collection of AZ sponsored Oncology clinical study datasets, designed for primary use (i.e., full, non-subsetted data), from:
- (i) locked arms of ongoing clinical studies
- (ii) those with a DBL date <6 month ago
- (iii) phase 1-2 studies from open-label studies"

### Inclusion Criteria:
| Code | Criteria |
|------|----------|
| C1 | Closed studies with DBL <6 months ago |
| C2 | Ongoing studies stopped recruiting, in follow-up, DBL <6 months |
| C3 | Closed arms of active studies, DBL <6 months |
| C4 | Closed arms of active studies, DBL >6 months |
| C5 | Open-label Phase 1-2 studies with FSI |

### Sample Studies Requiring Review:
- 54 studies listed across multiple products
- Products include: AZD0022, Datroway, Enhertu, Imfinzi, Lynparza, Tagrisso, Truqap, etc.
- Many marked "Please Review" pending DDO decision
- Some require further legal review by Data Office

---

## Key Differences: Closed vs Ongoing

| Aspect | Closed Collection | Ongoing Collection |
|--------|-------------------|---------------------|
| Study Status | DBL >6 months ago | DBL <6 months, active studies |
| Sensitivity | Lower (historical) | Higher (active studies) |
| User Scope | Broader (includes Biometrics) | Narrower |
| Opt-in/Opt-out | Automatic (closed by default) | Active review required |

---

## Conflicts/Contradictions

- Both Closed and Ongoing AOTs use same AoT-2.00 ID - should be different

---

## Open Questions

- What is the approval status of these documents? (All show "Insert date")
- How many of the 54 "Please Review" studies have been approved?

---

## Cross-References

- Related to: C7/C8 (BioPharma templates - same structure)
- Related to: D6-D8 (ODSAI Quarterly Approval PDFs)
- This is what Collectoid UI (WP4) will manage

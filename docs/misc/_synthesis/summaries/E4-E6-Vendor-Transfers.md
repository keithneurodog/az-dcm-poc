# Summary: Vendor Transfers - Legal Compliance Requirements

**Source:** `DOVS2 2026/WP 2 R&D Data Exchange/WP2 Material/Vendor transfers - Copy.md` (and identical `Corlia Van Der Walt - Vendor transfers.md`)
**Type:** Legal Guidance
**Workstream:** WP2 R&D Data Exchange
**Author:** Corlia Van Der Walt

---

## Key Points

- **Topic:** Legal compliance requirements for vendor data transfers (inbound and outbound)
- **Scope:** iDAP and data ingestion processes
- **Note:** Documents E4 and E6 are **identical**

---

## Transfer Scenarios `[ref: slides 2-4]`

### Scenario 1: AZ → Vendor (iDAP) `[ref: slide 2]`
AZ (Controller) transfers to Vendor (Processor) in USA for services

**Required Documents:**
- Master Service Agreement (MSA) with DPA and SCCs
- Statement of Work (SoW)
- Controller-to-Processor (C2P) DPA
- C2P Standard Contractual Clauses (or EU/US Privacy Framework certification)

### Scenario 2: Vendor → AZ (AZ Data) `[ref: slide 3]`
Vendor (Processor) acting on AZ's behalf transfers data back to AZ

**Required Documents:**
- Same as Scenario 1 (MSA + SoW + C2P DPA + SCCs)

### Scenario 3: Vendor → AZ (Vendor's Data) `[ref: slide 4]`
Vendor (Controller) transfers their own data to AZ

**Required Documents:**
- MSA with DPA
- Controller-to-Controller (C2C) DPA
- SCCs only if direct transfer to AZ US/Alexion

---

## When SCCs Are Required `[ref: slides 5-6]`

**Scenario 1:** Physical transfer or remote access from EU/EEA to non-adequate country (USA, China, Brazil)

**Scenario 2:** AZ (EEA controller) instructs vendor outside EEA to process data on AZ's behalf
- GDPR treats this as "international transfer" even if data never leaves collection country
- Trigger is where **controller** is located (EEA/UK)
- AZ = "exporter", Vendor = "importer"

**Alternative to SCCs:** EU/US Data Privacy Framework certification (check at [dataprivacyframework.gov](https://dataprivacyframework.gov))

---

## Completing SCCs `[ref: slide 7]`

**Non-negotiable:** SCC text is standard EU Commission document, cannot be changed

**Required Annexes:**
| Annex | Content |
|-------|---------|
| Annex I (A) | List of Parties - must be signed by all parties |
| Annex I (B) | Description of transfer - data subjects, categories, purpose, period |
| Annex I (C) | Competent Supervisory Authority |
| Annex II | Technical & Organizational Measures (TOMs) - from IT Security Assessment |
| Exhibit Y | Supplementing SCCs - only if TIA indicates |

**Additional:**
- UK SCCs: Only if UK data in scope
- Swiss SCCs: Only if Swiss data in scope

---

## Key Terms

| Term | Definition |
|------|------------|
| **DPA** | Data Protection Appendix |
| **SCC** | Standard Contractual Clauses |
| **C2P** | Controller to Processor |
| **C2C** | Controller to Controller |
| **TOM** | Technical & Organizational Measures |
| **TIA** | Transfer Impact Assessment |
| **BCR** | Binding Corporate Rules (covers AZ inter-company transfers) |

---

## Conflicts/Contradictions

- None identified

---

## Open Questions

- Are templates for all these documents accessible?
- Who is responsible for IT Security Assessments for TOMs?

---

## Cross-References

- Related to: E2 (DDTS process - where these requirements apply)
- Related to: E5 (Challenges - missing DPAs/SCCs identified as problem)
- Related to: C2 (User Guide - cross-border data transfer checks)

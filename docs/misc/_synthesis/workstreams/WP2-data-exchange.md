# WP2: R&D Data Exchange - Workstream Synthesis

---

## Overview

WP2 manages the External Data Sharing Ecosystem (EDSE) - the infrastructure, processes, and governance for transferring data between AstraZeneca and external partners, vendors, and collaborators.

---

## Core Challenge

From E5 (Data Exchange Ecosystem):

> "AstraZeneca is experiencing recurring delays in vendor data transfers and partner collaborations due to gaps in contracting and consent reviews"

**Impact:**
- Prolonged timelines
- Legal/regulatory risk
- Reduced efficiency
- Eroded collaborator experience

---

## Key Problems

### Vendor Transfers - Incoming AZ Data
- Correct contracts not in place or hard to find
- Missing DPAs (Data Protection Appendixes) and SCCs (Standard Contractual Clauses)
- CROs struggling with site/trial agreements
- SCCs not completed correctly

### Vendor Transfers - Outgoing AZ Data
- Contracts lack correct DPAs/SCCs
- Struggling to find principal agreements
- Statements of Work incomplete

### Collaborations
- ICFs not reviewed prior to contracting
- DPAs not aligned with ICFs
- Country of origin unclear (US data access restrictions)

---

## DDTS Platform (E2)

**DDTS:** Data Distribution and Transfer Service - the technical infrastructure for bi-directional R&D data transfers.

### Architecture:
```
Data Exchange → Data Storage → Data Access → Self-Service
```

### Transfer Types:
- **Inbound:** External collaborator → AZ
- **Outbound:** AZ → External collaborator

### Process Steps:
1. Consultation (clarify use case, datasets, timelines)
2. Capture Metadata (FAIR compliance)
3. Vendor Onboarding (accounts, pipeline setup)
4. DDTS Environment (test → production)
5. Data Access (provisioned for analysis)

---

## Legal Requirements (E4)

### Scenario 1: AZ → Vendor (iDAP)
Required: MSA + SoW + C2P DPA + SCCs

### Scenario 2: Vendor → AZ (AZ Data)
Required: Same as Scenario 1

### Scenario 3: Vendor → AZ (Vendor's Data)
Required: MSA + C2C DPA + SCCs (if direct transfer to AZ US)

### When SCCs Required:
- Physical transfer to non-adequate country (USA, China, Brazil)
- AZ (EEA controller) instructs non-EEA vendor to process data

---

## Proposed Solutions (E5)

1. **Identify at-risk teams** - Proactive guidance
2. **Pre-approved vendor list** - Vetted contracts
3. **Upgrade contract templates** - Include correct DPAs/SCCs
4. **Contract/privacy toolkits** - Checklists, playbooks, training
5. **AI-legal tools** - LEGALFLY for consent/contract automation

---

## LEGALFLY (E1)

AI-native workspace for legal/compliance teams:

| Agent Type | Function |
|------------|----------|
| Contracting | Draft, Compare, Review contracts |
| Compliance | Multi-Review, Legal Radar |
| Research | Custom Agents, Discovery |
| Anonymization | Data protection pre-processing |

**Differentiators:**
- Legally-trained (not generic LLM)
- Full anonymization before processing
- ISO, SOC 2 Type II certified

---

## Strategic Planning (E3)

### Two Horizons:

**Horizon A (Short-term):**
- Identify biggest bottlenecks and risks
- Map ongoing work to bottlenecks
- Alleviate pressing needs

**Horizon B (Long-term):**
- Agree vision and DO/EDSE mission
- Identify EDSE patterns and target states
- Prioritize and design solutions

---

## Relevance to WP4/Collectoid

While WP2 is primarily backend/process-focused, some UI implications:

1. **Data provisioning status** - Users may want visibility into transfer status
2. **Compliance checks** - UI could surface which checks are blocking access
3. **Integration** - Future Sherlock could query DDTS for data availability

---

## Source Documents

- E1: LEGALFLY Slide Deck
- E2: DDTS Business Process Overview
- E3: EDSE Planning Approach
- E4/E6: Vendor Transfers Legal Requirements
- E5: Data Exchange Ecosystem Challenges

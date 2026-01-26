# Summary: AZ Agentic AI Workshop Writeup

**Source:** `DOVS2 2026/WP 4 UI & Agentic AI/AZ Agentic AI Workshop Writeup.pdf`
**Type:** Comprehensive Workshop Documentation
**Workstream:** WP4 (UI & Agentic AI)
**Date:** 2025 (Workshop with Accenture)

---

## Key Points

- **Title:** "ACCELERATING THE USE OF AGENTIC AI" - Envisioning the future of Agentic in R&D Data and AI Governance at AstraZeneca `[ref: p1]`
- **Workshop purpose:** Shape the R&D Data Office's Agentic AI journey `[ref: p2]`
- **North Star Vision:** "Seamlessly delivering trusted, AI-ready data—governed responsibly and accessed effortlessly—to empower science, accelerate discovery, and unlock competitive advantage across R&D. By expanding the boundaries of what data can do, we transform every insight into impact." `[ref: p34]`

---

## Document Structure `[ref: p5]`

1. **Mirror:** Current state analysis from interviews
2. **Art of the Possible:** SME presentations and demos
3. **North Star:** Shared vision created by workshop participants
4. **Ideation:** Ideas from 3 groups
5. **Prioritisation and Roadmap:** Top voted ideas with 18-month timeline

---

## Mirror: Current State Analysis

### Theme 1: Data Access & Approvals Latency `[ref: p7]`

**Where we are today:**
- "99% of time waiting on data wrangling"
- Variable responses from data owners to risk
- Processes like iDap have many steps, difficult to automate
- Access requests are use case by use case, slow without pattern utilization
- Data access slowed by governance & reviews; approvals inconsistent

**Key quotes:**
- "We're only about 20% along the journey to making access seamless"
- "Culturally, AstraZeneca struggles with data access. There are a lot of feelings and few facts guiding how decisions are made"

**Where we want to get to:**
- 90-10 access model: 90% accessible by default, 10% requiring special approval
- "Access should be mins away (or a reason if not)"
- "Access by default with easy to understand guardrails enabled by agents"

### Theme 2: Metadata, Standards & Data Readiness `[ref: p8]`

**Where we are today:**
- Metadata & standards inconsistent; FAIR principles applied unevenly
- 'F' of FAIR already a blocker
- Limited interest/commitment from data owners to making data FAIR
- "Our data scientists spend 60% of their time wrangling data into usable form"

**Where we want to get to:**
- Every dataset AI-ready: standardized metadata, consistent ontologies
- FAIR and AI ready by design data generation
- Fully machine-actionable datasets

### Theme 3: Pipeline Reliability & Automation `[ref: p9]`

**Where we are today:**
- Data prep pipelines duplicated across teams
- Manual reconciliation and fragmented tools
- Pipeline reliability and SLA management need improvement

**Where we want to get to:**
- Self-optimising, observable pipelines that adapt without manual intervention
- Agents on pipelines to fix and automate

### Theme 4: Trust, Skills & Change Fatigue `[ref: p10]`

**Where we are today:**
- Change fatigue is high, skills gaps persist
- Trust in AI agents is uneven
- "People are nervous - they need to see AI as a co-pilot, not a job killer"

**Where we want to get to:**
- Trusted, human-in-the-loop AI with transparent outputs
- Standardised processes and upskilled teams

### Theme 5: Governance & Policy Ambiguity `[ref: p11]`

**Where we are today:**
- Reliant on people to interpret policies to execute business rules
- Rules not yet conceptually logical, let alone machine readable
- Governance is slow, inconsistent, and seen as a blocker

**Where we want to get to:**
- Rules-based, automated governance embedded in systems
- Clear consent/data rights codified with minimal human exceptions

### Theme 6: Cross-R&D Alignment & Early Wins `[ref: p12]`

**Where we are today:**
- Competition rather than coordination
- Transformation fatigue
- Duplication and siloed solutions waste effort

**Where we want to get to:**
- Seamless cross-R&D alignment with shared visibility
- Quick early wins to build momentum

---

## Art of the Possible: Expert Sessions `[ref: p14]`

| Topic | Presenter |
|-------|-----------|
| The Evolution of Data and AI Governance | Andrea Sulzenbacher |
| Accenture MiDAS Agentic AI Suite | Anna Marek |
| Automating Data Access Control | Girishwaran Kalidass |
| Accenture AlexandrIA | Julio Sanchez |
| Enabling AI Powered Decision Intelligence in R&D | William Henley |
| Agentic AI Risks and Mitigation | Valerie Morignat |
| Enabling R&D Data Office with Agentic AI | Dinesh Agaram |

### Key Concept: Evolution of Governance `[ref: p17]`

| Legacy | Today | Future |
|--------|-------|--------|
| Policies on paper | Steward-driven enforcement | Automated enforcement |
| Reactive compliance | Proactive monitoring | Continuous monitoring |
| Fragmented metadata | Manual lineage & tagging | Self-maintaining metadata |
| Access barriers | User request & approval | Frictionless access |

### Agentic AI Architecture `[ref: p18]`

Three-tier agent structure:
1. **Orchestrator Agents (Team Leads):** Oversee overall workflows and inter-agent coordination
2. **Super Agents (SMEs):** Understand user intention and mobilize necessary Utility agents
3. **Utility Agents (Specialists):** Perform specialized, autonomous tasks

Example agents: Governance Orchestrator, Compliance Aggregator, Data Curator, Data Quality Agent, Metadata Agent, Policy Validation Agent

### Human Role Spectrum `[ref: p31]`

| Level | Scenarios | Agent Role | Human Role |
|-------|-----------|------------|------------|
| Oversight First | Governance approvals, consent checks | Advisory - surfaces options | Final arbiter |
| Human Copilot | Access requests under rules, pipeline reconciliation | Executes within boundaries | Supervises exceptions |
| Delegated Assurance | Routine monitoring, audit trail generation | Fully autonomous | Consumes evidence |

---

## Ideation: Agent Concepts from 3 Groups

### Group 1: Data & AI Governance and Policy `[ref: p36-39]`

**1. Policy Partner Agent (DataSherpa)** `[ref: p37]`
- Problem: Governance slow, inconsistent, blocker
- Concept: Applies governance rules automatically, codifies data rights/consent, explainable decisions
- Success: Reduction in time-to-approval, % policies codified, user satisfaction

**2. Data Maestro** `[ref: p38]`
- Problem: Fragmented data management, inconsistent metadata/standards
- Concept: Orchestrates data management E2E, auto-tags metadata, applies shared vocabularies
- Success: % datasets AI-ready, reduction in manual curation, reuse of datasets

**3. Access Navigator Agent (Sherlock)** `[ref: p39]`
- Problem: Finding/accessing right data is slow, fragmented
- Concept: Connects through MCP server to find, recommend, provision access
- Success: Time saved, reduction in manual requests, audit compliance

### Group 2: Access - 90/10 `[ref: p40-48]`

**1. AGENT 10** `[ref: p41]`
- Problem: The 10% still has access controls - how to make less painful
- Concept: Streamlines access request process for humans and AI agents
- Success: >70% self-serve rate, <1 week decision time

**2. DISCO² (Discovery of Discovery Data)** `[ref: p42]`
- Problem: Faster access to pre-clinical data
- Concept: Virtualised data product with inventory of AZ data
- Success: >90% coverage

**3. AI Assisted Data Collections Manager (COLLECTOID)** `[ref: p43]`
- Problem: Data owners/stewards lack controls for 90/10 stewardship at scale
- Concept: Agent uses agreed rules to advise, recommend data for collections, warn of metadata issues
- Success: Time to administer, correctly assigned data

**4. DELTA MIND** `[ref: p44]`
- Problem: Data gaps - what do I have, how to fill, what value
- Concept: Agent hypothesises from problem/study question, identifies accessible academic/industry data
- Success: ROI

**5. AI Assisted Access Policies Execution** `[ref: p45]`
- Problem: Access policies need creation/management for right data in right collection
- Concept: AI creates access policies, suggests relevant policies, manages right users
- Success: Right data open for defined user groups without waiting

**6. AI Assisted Metadata Management** `[ref: p46]`
- Problem: Elicit right metadata early for decision-making
- Concept: AI harvests business/operational/technical metadata for human verification
- Success: Completeness/quality of metadata, access policies productionised

**7. One Center Store of Patient Data** `[ref: p47]`
- Problem: One location for all data access, remove duplicates
- Concept: One store for provisioning, auto-generation of anonymised/synthetic data
- Success: Time to access, data availability, no copies

**8. Data Planner (Plan-o-matic/Sherlock)** `[ref: p48]`
- Problem: Data scientists don't know what data available, where, when
- Concept: Agentic system for data requirements planning, describes availability, suggests enhancements
- Success: 20% reduction in project design time, 100% data enhancement suggestions

### Group 3: Standards & Interoperability `[ref: p49-52]`

**1. PRISM (Agentic Augmentation of Standards)** `[ref: p50]`
- Problem: Manual curation for standardisation, lack of definition
- Concept: Extract definition from unstructured context, augment metadata with synonyms
- Success: Faster CV definition, increased adoption, AI-readiness

**2. FANDA (Flag Agentic for Non-standard Data)** `[ref: p51]`
- Problem: Non-standard data
- Concept: Agent trawls data, matches against standard, flags non-standard
- Success: Coverage, speed of identifying non-standard data

**3. Standards for Agents (by AI)** `[ref: p52]`
- Problem: Agents need their own standards for adherence
- Concept: Framework to structure development/evolution of agent standards
- Success: Maintainability, adoption, human utility

---

## Prioritisation Results `[ref: p54]`

| Idea | Votes | Impact | Ease |
|------|-------|--------|------|
| Access Navigator Agent (Sherlock) | 15 | High | High |
| Policy Partner Agent (DataSherpa) | 7 | High | Medium |
| PRISM | 7 | High | Medium |
| Data Maestro / Collectoid | 6 | High | High |
| One center store of patient data | 3 | High | Low |
| DISCO² | 3 | Medium | Low |
| AI Assisted Metadata Manager | 3 | Medium | High |
| Agent 10 | 2 | Medium | High |
| Delta Mind | 1 | High | High |
| Standards for agents | 0 | High | Low |
| FANDA | 0 | Medium | Medium |
| Access Policy Execution | 0 | Medium | High |

---

## 18-Month Roadmap `[ref: p55]`

| Timeline | Agent | Owner |
|----------|-------|-------|
| Today (0-6 months) | Access Navigator Agent (Sherlock + Planomatic) | Scott / Jamie |
| 6 months | Data Maestro / Collectoid | Jamie |
| 12 months | PRISM agentic augmentation of standards | Matthew |
| 18 months | Policy Partner Agent (DataSherpa) | Darcey |

---

## Agent Personas `[ref: p56-59]`

### Sherpa (Policy Partner) `[ref: p56]`
- Synopsis: Governance slow, inconsistent, blocker
- Powers: Applies rules automatically, codifies data rights, explainable decisions

### Maestro (Data) `[ref: p57]`
- Synopsis: Fragmented data management, inconsistent metadata
- Powers: Auto-tags metadata, applies vocabularies, ensures standards, curates continuously

### Sherlock (Access Navigator) `[ref: p58]`
- Synopsis: Finding/accessing data is slow, fragmented
- Powers: Finds/recommends datasets, checks permissions, routes through governance

### PRISM (Standards) `[ref: p59]`
- Synopsis: Data standards under-defined and manual
- Powers: Extracts definitions, augments with synonyms, proposes vocabulary entries

---

## Accenture Additional Recommendations `[ref: p61-62]`

Suggested sequence:
1. Start with making data **findable and accessible**: Access Navigator, Agent 10, Access Policy Execution
2. Enable data **reusability and standardisation**: Data Maestro/Collectoid, DISCO², PRISM, FANDA
3. Embed and scale **compliance and trust**: Policy Partner, AI-assisted metadata, Standards for Agents
4. Unlock **decision intelligence**: Delta Mind

Additional MVP agents proposed:
- Access Pass (time-boxed, purpose-bound access)
- Geo Guard (country/site/partner rules - GDPR/PIPL)
- Auto Audit Log (machine-readable audit receipt)
- Data Health Watcher (quality/freshness checks)
- Schema Guard (detects schema drift)
- Partner Data Bridge (safe CRO/partner sharing)

---

## Key Participants `[ref: p3]`

Workshop participants: Cassie Gregson, Catrinel Zlota, Daniel Parker, Darcey Carey, Erik Leijon, James Holman, Jamie Macpherson, Jessica Jolly, Justin Johnson, Liz Nevin, Magdalena Wienken-Nöhren, Maria Benjegard, Mathew Woodwark, Naveed Shaikh, Nils Svangard, Nina Mian, Peder Blomgren, Philip Teare, Scott McCrimmon, Stacey Mather, Tom Diethe

---

## Requirements/Actions

- Refine North Star with wider stakeholder input `[ref: p64]`
- Finalise roadmap with milestones, owners, interdependencies, resources `[ref: p64]`
- Create commitment cards for personal commitments `[ref: p64]`

---

## Conflicts/Contradictions

- Some overlap between Maestro and Collectoid concepts - needs consolidation
- "Data Maestro / Collectoid" appears as combined item in prioritisation

---

## Open Questions

- How do the 4 top agents interrelate in practice?
- Specific technical implementation details not defined
- Integration with existing systems (Collibra, etc.) unclear

---

## Cross-References

- Related to: B1-B4 (WP4 workshop outputs)
- Related to: A1 (Goals mention Sherlock and Collectoid)
- Agent names: Sherlock, Maestro, Sherpa, PRISM - match VS2 deliverables

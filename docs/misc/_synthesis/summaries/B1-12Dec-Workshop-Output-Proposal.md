# Summary: 12Dec Workshop Output and Proposal

**Source:** `DOVS2 2026/WP 4 UI & Agentic AI/12Dec Workshop Output and Proposal.md`
**Type:** Workshop Output / Proposal
**Workstream:** WP4 (UI & Agentic AI)
**Date:** December 2025

---

## Key Points

- **Workshop purpose:** Define scope for DOVS2 2026 WP4 deliverables based on VS2 agentic AI and UI workshops `[ref: slide 2]`
- **Status:** Consensus outputs, NOT comprehensive/final scope - inputs for proposal refinement `[ref: slide 2]`
- **Authors:** Rafa Jimenez & Cayetana Vazquez `[ref: slide 1]`

---

## Priority Matrix

### Very High Priority (1) `[ref: slide 3]`
| Theme | Item | Description |
|-------|------|-------------|
| Collections | Explore collections | GUI for users to find/view collection info, understand data, access, restrictions |
| Collections | Assign datasets to collections | Functionality/GUI for data managers to manage data in collections |
| Collections | Assign users to collections | Functionality/GUI for data managers to manage user groups with access |
| Data | Discover what data is available | GUI for users to search, discover, view R&D data available |
| Data | Discover what data is accessible | GUI for users to search, discover, view R&D data accessible to them |

### High Priority (2) `[ref: slide 3]`
| Theme | Item | Description |
|-------|------|-------------|
| Requests | View access requests | GUI to find/see access request details and status (outside open collections) |
| Requests | Manage access requests | GUI for data managers to manage/approve/deny access requests |
| Access Rules | Explain access approval/denials | GUI to help users understand why they can/cannot access data |
| Access Rules | Manage, define & execute access rules | Functionality/GUI for data managers to create/change/execute access rules |
| Access Rules | Keep log of access rules | Functionality to track changes in access rules |
| Service | Discover access/analysis platforms | GUI to find available platforms in AZ |

### Medium Priority (3) `[ref: slide 3]`
| Theme | Item |
|-------|------|
| Access Rules | Explain user steps to get access |
| Usage | Insights about user access |
| Usage | Track data access for compliance |
| Service | Find about DO services |

### Low Priority (4) `[ref: slide 3]`
| Theme | Item |
|-------|------|
| Data | Explore data |
| Data | Planning data requirements |
| Data | Recommend internal data to access |

---

## Entities/Concepts Defined

### Three Main Deliverables `[ref: slides 11-15, 17]`

- **Collectoid:** "90 Data Collections Manager" - View, manage and monitor access collections, access rules and user groups with goal to streamline role open access data `[ref: slide 17]`
- **Sherlock:** "AI-driven chatbot" - Find data, explore data and enquiry about data access; single point of access to broad range of information `[ref: slide 17]`
- **USP (User Support Portal):** Enquiry about services, tools, processes & requests; faster response for users to find and access data `[ref: slide 17]`

### Feature Allocation `[ref: slide 4 visual]`
**Collectoid features:**
- Assign datasets to collections
- Assign users to collections
- View access requests
- Manage access requests
- Manage define & execute access rules
- Keep log of access rules
- Define access rules
- Execute access rules
- Planning data requirements
- Track data access for compliance

**Sherlock features:**
- Explore collections
- Discover what data is available
- Discover what data is accessible
- Explore data
- Recommend internal data to access

**Landing page features:**
- Find out about DO services
- Find out about DO service requests
- Discover Access/Analysis platforms

---

## Collectoid Metrics & Objectives `[ref: slide 18]`

- **User target:** >1,000 users with ≥90% of user data needs via open access
- **Reaction time:** <48h to react to changes in data collections
- **Adoption:** >100 users in Collectoid
- **Request processing:** 2-fold faster
- **User satisfaction:** Above 80%

### Collectoid Timeline `[ref: slide 18]`
| Objective | Due Date |
|-----------|----------|
| Explore collections | Q1 |
| Manage collections | Q2 |
| View access requests | Q2 |
| Create access requests | Q2 |
| Manage access requests | Q3 |
| Explain access approval/denials | Q3 |
| Manage, define & execute access rules | Q2 |
| Keep log of access rules | Q4 |

---

## Sherlock Metrics & Objectives `[ref: slide 19]`

- **Data source integration:** At least 6 data sources
- **Query volume:** >100 user queries across data sources after 3 months
- **Adoption:** >1000 queries and >100 users after 3 months
- **User satisfaction:** Above 80%

### Sherlock Timeline `[ref: slide 19]`
| Objective | Due Date |
|-----------|----------|
| Explore data (chat with the data) | Q2 |
| Explore collections and access requests | Q1 |
| Explain access approval/denials | Q4 |
| Discover what data is available and accessible | Q1 |
| Enquiry about access services | Q3 |

---

## Team Allocations `[ref: slides 22-24]`

### Collectoid Team (5.3 FTE total)
Key roles: Product Manager (Beata 0.3), Product Owner (Divya 0.4), Tech lead (TBC 0.5), Project manager (Cayetana 0.2), Business analyst (Marcin 0.5), Lead Software engineer (Keith 0.5), UX/UI designer (TBC 0.5)

### Sherlock Team (5.3 FTE total)
Key roles: Product Manager (Rafa 0.3), Product Owner (Divya 0.4), Tech lead (TBC 0.5), Project manager (Cayetana 0.2), Business analyst (Marcin 0.5), Lead Software engineer (Keith 0.4), UX/UI designer (TBC 0.5)

### USP Team (3.9 FTE total)
Key roles: Product Manager (DPO team member 0.3), Product Owner (Divya 0.2), Domain expert (DPO team member 1.0)

---

## Approach `[ref: slide 21]`

- **Collectoid:** Leverage and build on Keith's design
- **Sherlock:** Leverage and build on Catapult design
- **USP:** Agents built by domain experts as demonstrated by DPO
- **General:** Develop interfaces with React following enterprise recommendations; Build and register agents using Agent Mesh; Q1 focus on delivering what is feasible without extra funding

---

## Challenges Identified `[ref: slide 16]`

1. **Data Collections:** Users and provisioning teams struggle to explore/manage data access collections; no tool to assist; manual creation/management
2. **Virtual Assistant:** Users have difficulty finding/exploring data; complex information; platforms not interlinked; no single point for all information
3. **Metadata Coverage:** <5% of R&D data catalogued centrally; multiple uncoordinated cataloguing initiatives; no clear view of all R&D data
4. **User Portal:** Users struggle to understand available access tools, processes, services

---

## Requirements/Actions

- Confirm scope and approach with sponsor, WP lead, WP team `[ref: slide 7]`
- Align with Sponsor (Jamie) on VS2 deliverables `[ref: slide 7]`
- Feb VS2 F2F quarterly planning session to decide execution activities `[ref: slide 7]`
- WP activities to be defined during Feb F2F quarterly planning session `[ref: slide 25]`

---

## Open Questions

- Descriptions for all items still to be written by Rafa `[ref: slide 30]`
- Exact scope of V1 vs V2 for Collectoid and Sherlock needs definition `[ref: slides 27-29]`
- Team allocations marked as "Draft: to be summarized in single table" `[ref: slides 22-24]`
- Several team roles marked "TBC" (To Be Confirmed)

---

## Cross-References

- Related to: B2 (summary version), B3 (workshop agenda), B4 (visual summary), B5 (full workshop writeup)
- Related to: A1 (VS2 Goals), A2 (Program Charter)
- Keith's design mentioned - see B3 for "Agentic ≠ Chat" proposal
- Catapult PoC mentioned - see B3 for details

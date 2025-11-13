# Collectoid POC Requirements Document
## Next-Generation Clinical Trial Data Access Platform

**Document Version:** 2.0
**Target Delivery:** December 2025
**Owner:** Keith Hayes
**Stakeholders:** Divya Dayanidhi, Stacy, Rafa, Leadership Team

---

## Executive Summary

### Strategic Context

AstraZeneca is decommissioning the legacy **AZCt iDAP** (AstraZeneca Clinical trials - integrated Data Access Platform) in 2026. This creates a critical need for a next-generation data access solution that addresses current limitations while leveraging modern agentic AI capabilities to dramatically improve efficiency and user experience.

The **Collectoid** system represents a paradigm shift in how clinical trial data is discovered, requested, and accessed. It combines:
- **Intelligent data discovery** - Multiple UX modalities (browse, chat, hybrid) to suit different user preferences
- **Agentic orchestration** - AI agents automate approval workflows, metadata discovery, and access provisioning
- **90/10 initiative** - 90% of data instantly accessible once approved for similar user profiles
- **Transparent progress tracking** - Real-time visibility into access requests and approval status

### Value Proposition

- **Universal access with governance**: Open metadata browsing for all users, with Immuta-enforced access control for data
- **Flexible discovery modes**: Support both power users (browse/search) and novice users (AI-guided chat)
- **Instant access at scale**: Once a data collection is approved, similar users gain instant access (90/10 principle)
- **Intelligent suggestions**: RAG-based recommendations for related datasets users may not have considered
- **Reduced approval time**: From weeks to days (or instant for pre-approved collections) through agentic automation
- **Multi-modal data access**: Seamlessly combine clinical, genomics, and imaging data across distributed platforms

### Success Criteria

This POC must demonstrate:

1. **Persona-driven UX**: Show how different user types (novice researcher, power user, DCM admin) each have optimized experiences
2. **Discovery concept validation**: Present multiple UX concepts for data discovery and gather stakeholder feedback
3. **Agentic AI value**: Demonstrate measurable reduction in manual effort and time-to-access through automation
4. **90/10 initiative proof**: Show instant access for subsequent users once collections are approved
5. **2026 Resource justification**: Provide compelling evidence to secure 2+ additional developers for production

### Approach: Breadth-First, Persona-Driven

This POC takes a **breadth-first approach** covering the entire ecosystem rather than deep-diving into any single component:

- **Persona-driven development**: Build from simplest to most complex persona as developmental building blocks
- **Multiple concept exploration**: Present 2-3 different UX concepts for data discovery to validate approaches
- **Mock integrations**: Backend data and responses mocked to create interactive, flowable experiences
- **High-level initially**: Focus on user journeys and value demonstration, not implementation details
- **Iterative refinement**: Outstanding questions documented for future clarification as concepts solidify

### Deliverable

An **interactive Next.js prototype** with multiple user personas, allowing stakeholders to experience different user journeys and UX concepts for discovering, requesting, and accessing clinical trial data.

---

## Background & Problem Statement

### Current State Challenges

The existing AZCt iDAP platform faces several critical limitations:

1. **Manual bottlenecks**: Data access requests require extensive manual coordination, taking weeks
2. **Fragmented systems**: Clinical data (S3), genomics (SolveBio/QuartzBio), and imaging (DICOM) exist in silos
3. **Metadata gaps**: Unknown data locations and incomplete cataloging create delays
4. **One-size-fits-all UX**: No accommodation for different user skill levels (power users vs novices)
5. **Opaque approval process**: Users lack visibility into request status, timelines, and blockers
6. **Redundant approvals**: Each user requests same data individually, no reuse of previous approvals
7. **Limited scalability**: Manual processes cannot scale to support growing data volumes and user base

### Organizational Context

- **Timeline pressure**: iDAP decommission scheduled for 2026
- **Strategic alignment**: Part of broader agentic AI initiative (Sherpa, Sherlock, Prism, Project Catapult)
- **Resource constraints**: Must demonstrate value to secure 2026 staffing (2+ developers)
- **Metadata initiative**: Ongoing effort to extract and standardize metadata across all datasets
- **Immuta deployment**: Policy-based access control infrastructure already in place
- **Stakeholder uncertainty**: Multiple leadership discussions ongoing with evolving requirements

### Key Opportunity: The 90/10 Initiative

Once a data collection is approved for a specific user profile, **similar users should gain instant access** without re-approval. Current state requires every user to go through the same approval process individually.

**Example**: If a Data Scientist in Oncology Biometrics requests and is approved for ctDNA datasets, other Data Scientists in the same organization with matching training/clearance should get instant access to those same datasets.

**Target**: 90% of data should be instantly accessible to appropriately qualified users.

### Agentic AI Opportunity

Modern agentic AI capabilities enable a fundamentally different approach where intelligent agents:
- **Collectoid** orchestrates approval workflows, monitors progress, provides guidance
- **Discovery agents** help users find relevant data through chat or intelligent suggestions
- **Approval routers** determine appropriate approval authorities and auto-route requests
- **Access provisioners** generate Immuta policies and grant access automatically when criteria are met
- **Progress monitors** provide real-time status updates and identify bottlenecks

---

## Core Concepts

### What is a "Data Collection"?

> **⚠️ OUTSTANDING TASK**: Comprehensive definition of data collections needed from stakeholders. Current understanding documented below as working hypothesis.

A **data collection** is a user-defined grouping of datasets for a specific research purpose. Collections serve both user and administrative functions:

**From User Perspective**:
- Logical grouping of related datasets (e.g., "Oncology ctDNA Biomarker Research")
- Single request entity instead of requesting datasets individually
- Tracking unit for access requests ("My Collections" dashboard)
- Reusable entity for future similar needs

**From Admin/DCM Perspective**:
- Approval unit with defined scope and purpose
- Tracking mechanism for access provisioning progress
- Reusable template for 90/10 instant access (subsequent similar users)

**Key Point**: Access is determined **per-dataset per-user** by Immuta policies. Collections are a UX convenience layer and administrative tracking mechanism, not the actual access control boundary.

### Metadata vs Data Access

**Metadata is open**: All users can browse the full catalog of datasets, view descriptions, categories, schemas, and understand what data exists.

**Data access is controlled**: Viewing actual data (download, query, preview) is enforced by Immuta policies. Users who lack access see datasets but cannot view/download data without requesting access.

**UI Implication**: Dataset cards/listings should clearly indicate:
- ✅ **Accessible Now**: User has active access, can view data immediately
- ⏳ **Pending Approval**: User has requested access, approval in progress
- 🔒 **Requires Request**: User can see metadata but must request access to view data

### The 90/10 Instant Access Principle

Once a data collection is approved for a user with specific attributes (organization, role, training, etc.), **similar users matching those attributes should gain instant access** without re-approval.

**Mechanism** (working hypothesis, pending clarification):
- User matching likely based on SSO `memberOf` groups or complex attribute ruleset
- First approval for a user profile creates a "template" for instant access
- Subsequent users are automatically matched and granted access if they qualify
- Target: 90% of users should experience instant access, only 10% require new approvals

> **⚠️ OUTSTANDING TASK**: Define exact user matching criteria and 90/10 implementation approach.

### System Architecture Concept

**Collectoid** is the agentic orchestration system responsible for approval workflows, progress monitoring, and user guidance. It sits alongside other agentic systems:

- **Collectoid**: Approval orchestration, progress tracking, request management
- **Discovery/Chat Agent** (e.g., Project Catapult): Data discovery assistance via natural language
- **Sherpa, Sherlock, Prism**: Other agentic systems in the broader ecosystem (details TBD)

**Data Infrastructure**:
- **Immuta**: Policy-based access control (physical enforcement layer)
- **S3**: Clinical trial data storage (SDTM, ADaM datasets)
- **SolveBio / QuartzBio**: Genomics/omics data platforms
- **DICOM Archives**: Medical imaging data
- **Metadata Repository**: Centralized catalog of dataset descriptions (ongoing extraction effort)

**Key Principle**: Users interact with a unified interface; agentic systems abstract away the complexity of which data lives where.

### Key Differentiators from iDAP

| Capability | AZCt iDAP (Legacy) | Proposed System |
|------------|-------------------|-----------------|
| Discovery UX | One-size-fits-all catalog | Persona-adapted (browse, chat, hybrid) |
| Metadata access | Limited browsing without access | Full metadata open to all |
| Request flow | Per-dataset individual requests | Collection-based grouping |
| Approval reuse | None - every user re-approves | 90/10 instant access for similar users |
| Progress visibility | Email status updates | Real-time dashboard + agentic assistant |
| Approval routing | Manual email chains | Intelligent agentic routing |
| Intelligent suggestions | None | RAG-based recommendations |

---

## Core Feature: Data Collection Management Workflow

### Use Case Context

**Example Scenario**: An Oncology data scientist needs to create a comprehensive ctDNA (circulating tumor DNA) data collection for biomarker research, combining clinical trial data, genomic sequencing results, and specimen metadata across multiple closed studies.

### Workflow Steps

#### Step 1: Define Collection Intent

**User Action**: Researcher describes the broad access intent in natural language or selects from templates.

**Example Intent**:
> "ctDNA application building for Oncology - proactive collection and curation of molecular and clinical data under Extended Primary Use (EPU) for comprehensive ctDNA-based research and insights including performance evaluation, diagnostic insights, treatment response, correlation analysis, and AI modeling."

**System Behavior**:
- Parse intent using NLP to extract key criteria
- Identify relevant therapeutic area (Oncology)
- Understand data type requirements (molecular + clinical)
- Recognize consent requirements (EPU)
- Flag privacy constraints (aggregated vs patient-level access)

#### Step 2: Study Matching & Selection

**User Action**: System presents studies matching the intent criteria.

**Matching Logic** (Agentic Processing):
- Query clinical trials database for studies matching:
  - Therapeutic area: Oncology
  - Available data types: ctDNA biomarker data
  - Consent basis: EPU or appropriate Primary Use consent
  - Study status: Typically closed studies with sufficient data maturity

**User Interface**:
- List of matched studies with metadata (Study ID/DCode, therapeutic area, phase, status, data availability)
- Filter/refine options
- Multi-select to add studies to collection

**Example Output**:
```
Matched Studies (15):
- DCODE-001: Phase III NSCLC ctDNA biomarker study [Closed, DB Lock: 2024-03-15]
- DCODE-002: Phase II DLBCL ctDNA monitoring [Closed, DB Lock: 2024-01-20]
- DCODE-003: Phase III Breast cancer ctDNA dynamics [Active, DB Lock: TBD]
...
```

#### Step 3: Data Category Selection

**User Action**: Select specific data domains and categories needed.

**Available Categories** (Organized by Standard):

**SDTM (Standard Data Tabulation Model) Domains**:
- **Demographics (DM)**: AGE, SEX, RACE, ETHNIC, COUNTRY
  - *Use case*: Subgroup analyses, bias checks, privacy-approved age bands
- **Exposure (EX/SE)**: EXTRT (treatment), EXDOSE/EXDOSU (dose/unit), EXROUTE (route), EXSTDTC/EXENDTC (start/end dates), EXDUR (duration)
  - *Use case*: Treatment context, dose intensity, time windows

**ADaM (Analysis Data Model)**:
- **Exposure (ADEXP)**: DOSE, DOSEDUR, Relative Dose Intensity
  - *Use case*: Dose-response modeling features

**RAW - Specimen Metadata**:
- Patient/Specimen ID, Collection/Receive times, Tube type, Volume, Time-to-processing
  - *Use case*: Pre-analytical factors affecting cfDNA (cell-free DNA) quality

**Omics/NGS - Variant Data**:
- CHROM (chromosome), POS (position), REF/ALT (reference/alternate alleles), AF/VAF (allele frequency/variant allele frequency), DP/UMIDP (depth/UMI depth), FILTER, Annotations (consequence, COSMIC database IDs)
  - *Use case*: Variant-level ctDNA tracking and analysis

**User Interface**:
- Hierarchical category tree with checkboxes
- Contextual help explaining each category's purpose
- Estimated data volume per category

#### Step 4: Define Activities & Intents

**User Action**: Specify planned activities with the data to ensure appropriate access levels.

**Activity Categories**:

**A. Data Engineering** (Select all that apply):
- ETL/Standardization:
  - Date unification to relative study day
  - Unit harmonization (VAF %, copies/mL)
  - HGVS (Human Genome Variation Society) normalization
  - Panel coverage mapping
  - LoD/LoQ (Limit of Detection/Quantitation) capture
  - QC flag propagation

- Variant Harmonization:
  - Left-align/normalize variants
  - Canonical transcript selection
  - COSMIC/ClinVar annotation
  - Deduplication across runs/panels

**B. Scientific Analysis** (Secondary use of patient-level data):
- **Early response classifier**: Features = baseline ctDNA, % drop by Week 4, max VAF, number of variants > LoD, QC depth; Label = BOR (Best Overall Response: CR/PR vs SD/PD) using AI/ML
- **Multimodal fusion**: Late-fusion model combining ctDNA features + PET MTV/TLG (Metabolic Tumor Volume/Total Lesion Glycolysis) + clinical covariates (ECOG, line of therapy, stage)
- **Cohort builder**: Filters for cancer type/subtype, stage, line of therapy, regimen class, panel version, baseline ctDNA bands, imaging windows

**Access Level Implications**:
- Data engineering activities: Typically require patient-level access
- AI/ML model building: Require patient-level for training, aggregated for inference
- Cohort building: May use aggregated data if cohorts ≥10 patients per privacy rules

#### Step 5: User & Team Assignment

**User Action**: Define who should have access to this collection.

**Assignment Methods**:

**A. Organization-Based**:
- Select organization from Workday (e.g., "All Oncology Biometrics" from Renee's organization)
- System auto-populates all PRIDs (Personnel Record IDs) in that org

**B. Role-Based**:
- Data Scientists
- Data Engineers
- Biostatisticians
- Clinical Scientists
- Power Users (patient-level data access)

**C. Individual**:
- Add specific PRIDs or email addresses

**User Interface**:
- Search/select organizations from Workday integration
- Multi-select role checkboxes
- Manual PRID/email addition
- Preview list of users who will be granted access
- Distinction between "Standard Users" (aggregated data only) vs "Power Users" (patient-level access)

**Example**:
```
Access Recipients (estimated 47 users):
- Organization: Oncology Biometrics (42 users)
- Role: Data Scientists (all)
- Role: Data Engineers (all)
- Individual: John.Doe@astrazeneca.com (Power User)
```

#### Step 6: Collection Creation & Access Analysis

**System Action**: Create data collection and analyze current access status via Immuta policies.

**Collection Summary**:
- **Collection ID**: DC-2025-1042
- **Name**: "Oncology ctDNA Biomarker Research Collection"
- **Studies**: 15 studies (D-Codes)
- **Users**: 47 PRIDs
- **Data Categories**: SDTM (DM, EX), ADaM (ADEXP), Specimen Metadata, NGS Variants

**Current Access Analysis** (via Immuta Policy Query):

Example output showing existing access:
```
Current Access Status:
┌─────────────┬──────────┬──────────┬──────────────┬──────────┐
│ User        │ Study A  │ Study B  │ Study C      │ Genomics │
├─────────────┼──────────┼──────────┼──────────────┼──────────┤
│ Divya       │ ✓        │ ✓        │ ✓            │ ✓        │
│ Keith       │ ✓        │ ✓        │ ✓            │ ✗        │
│ Sarah       │ ✗        │ ✓        │ Partial (DM) │ ✗        │
...
```

**Gap Summary**:
- 20% of users already have full access to 50% of requested data
- 30% of users have partial access requiring extension
- 50% of users have no access and require full provisioning

#### Step 7: Agentic Access Provisioning Workflow

This is where Collectoid's agentic capabilities provide maximum value.

**Phase A: Automated Immediate Access** (30% of data in example)

**Criteria for Auto-Approval**:
- Study status = Closed
- Database lock date ≥ 6 months in past
- No legal restrictions flagged
- User has completed required training
- Data type permitted under existing governance

**Agent Actions**:
1. Validate all auto-approval criteria
2. Generate Immuta policy updates (metadata-only changes)
3. Apply policies → instant access granted
4. Send notifications to users

**User Experience**:
- DCM (Data Collection Manager) receives summary: "30% of requested data is ready for immediate access - approve?"
- Single click approval
- Real-time progress indicator: "Access granted to 15 users for Studies A, B, C (Clinical SDTM)"

**Phase B: Automated Approval Routing** (40% of data in example)

**Criteria for Approval Required**:
- Study closed but < 6 months since DB lock
- Legal review required for specific data types
- Cross-geography data requiring additional consent verification

**Agent Actions**:
1. Identify appropriate approval authority (GPT governance group, TALT legal team)
2. Auto-generate approval request with context:
   - Requester information
   - Data collection purpose and activities
   - Privacy impact assessment
   - Compliance checklist
3. Route to approval queue
4. Monitor approval status
5. Upon approval, auto-generate Immuta policies
6. Apply policies and notify users

**User Experience** (DCM perspective):
- "40% of data requires approval - requests have been automatically submitted to GPT-Oncology and TALT-Legal"
- Dashboard shows approval request status in real-time
- Notification when approvals received
- One-click policy application

**User Experience** (Approver perspective - GPT/TALT):
- Receive structured approval request with all context
- Clear recommendation from agent (approve/reject with reasoning)
- One-click approval in their workflow system

**Phase C: Data Discovery & Cataloging** (10% of data in example)

**Scenario**: Data location unknown or metadata incomplete

**Agent Actions**:
1. Detect missing data assets (e.g., "Study D genomics data - location unknown")
2. Initiate automated discovery process:
   - Scan S3 buckets matching study patterns
   - Query SolveBio/QuartzBio APIs for study IDs
   - Check DICOM archives for imaging data
   - Parse file metadata and naming conventions
3. Propose data asset matches with confidence scores
4. Flag for manual verification if confidence < threshold
5. Update catalog with discovered assets
6. Trigger access provisioning workflow once cataloged

**User Experience**:
- "10% of requested data requires cataloging - automated discovery initiated"
- Progress updates: "Scanning S3 buckets... Found potential match in bucket/oncology-genomics/... (confidence: 85%)"
- Manual review queue: "Agent found 3 potential matches - please verify"
- Once verified, automatically flows to appropriate provisioning phase

**Phase D: Training Compliance** (10% of users in example)

**Scenario**: Users missing required training for requested data types

**Agent Actions**:
1. Cross-reference user PRIDs with training database
2. Identify missing required courses (e.g., "Good Clinical Practice", "Data Privacy Level 2")
3. Send automated training reminders with links
4. Monitor training completion
5. Auto-grant access once training completed

**User Experience**:
- "10% of users cannot receive access until training completed"
- Users receive: "You're assigned to Oncology ctDNA Collection, but need to complete [Training X] first - [Complete Now]"
- DCM dashboard shows: "5 users pending training completion - reminders sent"
- Automatic access grant upon training completion

#### Step 8: Progress Visualization & Management

**Real-Time Dashboard** (for DCM and requesters):

**Access Provisioning Status**:
```
Overall Progress: 60% Complete

┌────────────────────────────────────────────┐
│ Immediate Access      ██████████ 100% (30%)│
│ Pending Approvals     ████░░░░░░  45% (40%)│
│ Cataloging Required   ██░░░░░░░░  20% (10%)│
│ Training Pending      ████████░░  80% (10%)│
└────────────────────────────────────────────┘

Detailed Status:
- 15 users: Full access granted ✓
- 20 users: Approval pending (GPT-Oncology)
- 3 users: Approval pending (TALT-Legal)
- 5 users: Training required
- 4 users: Partial access, pending cataloging
```

**Timeline View**:
- Visual timeline showing projected completion
- Blocked items highlighted with actions needed
- Historical view of provisioning steps completed

**Notification Center**:
- Real-time updates on status changes
- Action items requiring manual intervention
- Approval received notifications

---

## Agentic AI Components (Collectoid Agents)

### Agent 1: Intent Parser

**Function**: Translate natural language collection requests into structured queries

**Capabilities**:
- NLP-based intent extraction
- Therapeutic area classification
- Data type identification
- Consent requirement detection
- Privacy constraint recognition

**Example**:
```
Input: "I need ctDNA data from lung cancer studies for AI model training"

Output:
{
  "therapeutic_area": "Oncology - NSCLC",
  "data_types": ["molecular", "clinical"],
  "biomarker": "ctDNA",
  "use_case": "AI/ML model development",
  "access_level_required": "patient-level",
  "consent_requirements": ["EPU", "primary_use_with_AI_clause"]
}
```

### Agent 2: Study Matcher

**Function**: Identify relevant studies based on intent and data availability

**Capabilities**:
- Cross-reference clinical trials database
- Filter by therapeutic area, phase, status, consent basis
- Assess data completeness and quality
- Rank results by relevance

**Data Sources**:
- Clinical trials management system
- Study metadata repository
- Consent documentation database

### Agent 3: Metadata Discovery Agent

**Function**: Autonomously discover and catalog data across distributed systems

**Capabilities**:
- S3 bucket scanning with pattern matching
- SolveBio/QuartzBio API integration for genomics data
- DICOM archive queries for imaging data
- Filename and metadata parsing
- Confidence scoring for matches
- Automated catalog updates

**Example Workflow**:
```
1. Receive request: "Find genomics data for Study DCODE-042"
2. Search SolveBio: Query API with study ID → Found 15 datasets
3. Search S3: Scan bucket pattern *oncology*/*042* → Found 3 buckets with potential matches
4. Analyze metadata: Parse file headers, check date ranges, validate checksums
5. Confidence scoring: SolveBio = 98%, S3-bucket-1 = 85%, S3-bucket-2 = 40%
6. Report findings: High confidence matches auto-cataloged, low confidence flagged for review
```

### Agent 4: Policy Generator

**Function**: Automatically create and update Immuta data access policies

**Capabilities**:
- Template-based policy generation
- Multi-user, multi-study policy consolidation
- Privacy constraint application (row-level filtering, column masking)
- Training requirement enforcement
- Temporal access controls (expiration dates)

**Integration**: Immuta API

**Example Policy**:
```json
{
  "policy_name": "DC-2025-1042_Oncology_ctDNA_Collection",
  "data_sources": ["s3://clinical-sdtm/DCODE-001", "solvebio://oncology/ctdna-variants"],
  "principals": ["PRID-12345", "PRID-67890", "..."],
  "permissions": ["read"],
  "row_filter": "study_id IN ('DCODE-001', 'DCODE-002', ...) AND consent_type = 'EPU'",
  "column_masking": {
    "patient_id": "hash_sha256",
    "date_of_birth": "age_band"
  },
  "conditions": [
    "training_completed('GCP-2024') = true",
    "training_completed('DataPrivacy-L2') = true"
  ],
  "expiration": "2026-12-31"
}
```

### Agent 5: Approval Router

**Function**: Intelligently route approval requests to appropriate governance bodies

**Capabilities**:
- Decision tree logic for approval authority determination
- Context-rich approval request generation
- Integration with approval workflow systems
- Status monitoring and escalation
- Automated retry/resubmission logic

**Routing Logic**:
```
IF study_lock_date < 6_months_ago AND no_legal_restrictions:
    → Auto-approve
ELIF cross_geography_data:
    → Route to TALT (legal team)
ELIF oncology_data AND requires_biomarker_access:
    → Route to GPT-Oncology
ELIF multi_therapeutic_area:
    → Route to multiple GPTs in parallel
ELSE:
    → Route to default DCM approval
```

### Agent 6: Training Compliance Monitor

**Function**: Validate and monitor user training requirements

**Capabilities**:
- Cross-reference PRIDs with training database
- Identify required courses based on data types
- Send automated reminders
- Monitor completion status
- Trigger access grants upon completion

**Integration**: Learning Management System (LMS) API, Workday

### Agent 7: Progress Orchestrator

**Function**: Coordinate all agents and provide unified status reporting

**Capabilities**:
- Workflow state management
- Agent task assignment and monitoring
- Dependency resolution (e.g., don't route approval until data is cataloged)
- Progress aggregation and reporting
- Bottleneck identification and alerting

---

## Supporting Feature: Bulk User Lookup

### Purpose

Enable DCM and administrators to quickly look up user details (country, organization, role) for bulk user assignment and verification.

### Use Cases

1. **Collection planning**: Verify that a list of PRIDs are valid and active
2. **Country compliance**: Check user locations for data residency requirements
3. **Organization validation**: Confirm users belong to expected organizations
4. **Bulk operations**: Upload CSV of PRIDs/emails and get enriched data back

### Workflow

**Input Methods**:
- Paste PRIDs (comma or newline separated)
- Paste email addresses
- Upload CSV file
- Type names with wildcard support (e.g., "*Hayes*")

**Processing**:
- Call AstraZeneca SSO API (adhoc.rd.astrazeneca.net/api/people)
- Retrieve: displayName, email, PRID, country, organization, job title, status
- Handle errors: invalid PRIDs, inactive users, no permissions to view

**Output**:
- Table view with all retrieved data
- Export to CSV
- Quick filter/sort by country, organization
- Warning indicators for inactive users

**API Integration**:
```
GET https://adhoc.rd.astrazeneca.net/api/people
  ?appid=<collectoid_app_id>
  &mail=keith.hayes3@astrazeneca.com
  &attrs=displayName,mail,country,organization,employeeType,status

Response:
{
  "displayName": "Hayes, Keith (20/15 Visioneers)",
  "mail": "keith.hayes3@astrazeneca.com",
  "PRID": "P123456",
  "country": "GB",
  "organization": "R&D IT - Data Science",
  "employeeType": "Contractor",
  "status": "Active"
}
```

**Wildcard Search Support**:
```
GET .../api/people?displayName=*Hayes*&attrs=...

Returns all users with "Hayes" in display name
```

### UI Design Considerations

- Prominent location in DCM portal (e.g., utility in header or tools menu)
- Fast, responsive searching (debounced input)
- Clear error messages for failed lookups
- Bulk operation progress indicator for large lists (100+ users)
- Integration with user assignment workflow in main collection creation

---

## Integration Points

### 1. Immuta (Data Access Control Platform)

**Purpose**: Policy-based data access control and enforcement

**Integration Type**: REST API

**Key Operations**:
- Query existing policies (check current user access)
- Create new policies
- Update policies (add users, extend data sources)
- Delete policies (when collections expire)
- Audit log retrieval (compliance reporting)

**Mock Strategy for POC**:
- Simulated Immuta API responses
- Pre-defined policy templates
- Fake access matrix showing current vs desired state

### 2. Workday (HR System)

**Purpose**: Organization hierarchy, user roles, reporting structure

**Integration Type**: REST API or SOAP

**Key Operations**:
- Get organization members (e.g., all users in "Oncology Biometrics")
- Get user details by PRID
- Get reporting hierarchy

**Mock Strategy for POC**:
- Sample organization data (Oncology Biometrics, Data Science, etc.)
- Mock user records with realistic PRIDs

### 3. Clinical Trials Management System

**Purpose**: Study metadata, status, consent documentation

**Integration Type**: Database query or REST API

**Key Operations**:
- Search studies by therapeutic area, phase, status
- Get study metadata (D-Code, title, indication, PI, dates)
- Get consent types and restrictions
- Check database lock status

**Mock Strategy for POC**:
- Sample study dataset (15-20 oncology studies)
- Realistic metadata matching Divya's examples

### 4. Data Platforms

**4a. AWS S3 (Clinical Data Storage)**

**Purpose**: Store SDTM, ADaM clinical trial datasets

**Integration Type**: AWS SDK (boto3)

**Key Operations**:
- List buckets and objects
- Get object metadata (tags, last modified)
- Prefix-based searches (e.g., all objects matching */oncology/DCODE-*)

**Mock Strategy for POC**:
- Simulated S3 bucket structure
- Mock file listings with realistic paths

**4b. SolveBio / QuartzBio (Genomics Data Platforms)**

**Purpose**: Store and query genomics/omics data

**Integration Type**: REST API

**Key Operations**:
- Search datasets by study ID
- Get dataset schema and field descriptions
- Query variant data

**Mock Strategy for POC**:
- Simulated dataset catalog
- Mock variant records for ctDNA examples

**4c. DICOM Archive (Medical Imaging)**

**Purpose**: Store and retrieve medical imaging (PET, CT, MRI)

**Integration Type**: DICOM protocol or REST API wrapper

**Key Operations**:
- Query studies by patient ID or study ID
- Get imaging metadata (modality, date, series count)

**Mock Strategy for POC**:
- Simulated imaging study list
- Mock metadata responses

### 5. SSO / People API

**Purpose**: User authentication and directory lookup

**Integration Type**: REST API (adhoc.rd.astrazeneca.net/api/people)

**Key Operations**:
- User lookup by PRID, email, name
- Get user attributes (country, org, job title, status)
- Wildcard search

**Mock Strategy for POC**:
- Real API may be usable with proper app ID
- Fallback to mock responses if authentication issues

### 6. Training Database / LMS

**Purpose**: Validate user training compliance

**Integration Type**: REST API or database query

**Key Operations**:
- Get user training records by PRID
- Check completion status for specific courses
- Get course metadata (title, expiration, required for data types)

**Mock Strategy for POC**:
- Sample training records (GCP, Data Privacy, etc.)
- Mock completion statuses for demo users

### 7. Approval / Workflow System

**Purpose**: Route and track approval requests (GPT, TALT workflows)

**Integration Type**: REST API or email-based integration

**Key Operations**:
- Create approval request
- Get approval status
- Receive approval notifications

**Mock Strategy for POC**:
- Simulated approval queue
- Manual "approve/reject" controls in prototype for demo purposes

---

## Technical Approach: Next.js Interactive Prototype

### Technology Stack

**Frontend**:
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS (responsive, modern aesthetic)
- **Component Library**: shadcn/ui or AstraZeneca design system if available
- **State Management**: React Context + hooks (or Zustand for complex state)
- **Data Visualization**: Recharts or D3.js for dashboards

**Backend** (Prototype Simulation):
- **API Routes**: Next.js API routes for mock integrations
- **Data Storage**: In-memory or simple JSON files for demo data
- **Authentication**: Mock auth or simple session for demo users (Divya, Keith)

**Development Approach**:
- Component-driven development (reusable UI components)
- Responsive design (desktop primary, mobile considerations)
- Accessibility considerations (WCAG 2.1 AA)
- Mock API delays (simulate real-world latency)

### Key UI/UX Principles

1. **Progressive Disclosure**: Don't overwhelm users - reveal complexity gradually
2. **Guided Workflow**: Clear step-by-step process with progress indicators
3. **Intelligent Defaults**: Pre-populate based on intent where possible
4. **Real-time Feedback**: Show agentic processing in action (loading states, progress bars)
5. **Contextual Help**: Inline explanations for complex concepts (SDTM domains, consent types)
6. **Visual Hierarchy**: Clear distinction between automated vs manual actions
7. **Error Prevention**: Validation and warnings before irreversible actions

### Prototype Pages/Views

1. **Dashboard / Home**
   - Overview of existing collections
   - Quick actions (create new collection, bulk user lookup)
   - Recent activity feed

2. **Create Collection Wizard** (Multi-step)
   - Step 1: Define Intent
   - Step 2: Select Studies
   - Step 3: Choose Data Categories
   - Step 4: Specify Activities
   - Step 5: Assign Users
   - Step 6: Review & Submit

3. **Collection Detail / Progress View**
   - Real-time provisioning status
   - Agent activity log
   - Access matrix (users x studies)
   - Action items requiring attention

4. **Bulk User Lookup Tool**
   - Search/paste interface
   - Results table
   - Export functionality

5. **DCM Approval Queue**
   - Pending approvals
   - Agent recommendations
   - One-click approve/reject
   - Approval history

6. **Admin / Settings**
   - Configure agent behaviors
   - View system logs
   - Manage approval authorities

### Demo Flow for Stakeholders

**Scenario**: Create a ctDNA Oncology collection

1. **Login as Researcher (Keith)**
   - Navigate to "Create New Collection"
   - Enter intent: "ctDNA biomarker data for AI modeling in lung cancer"
   - System shows loading: "Agent analyzing intent..."
   - Shows matched studies (15 NSCLC studies)

2. **Select Studies**
   - Choose 5 closed studies + 2 active studies
   - System shows data availability indicators

3. **Choose Data Categories**
   - Expand SDTM tree, select Demographics + Exposure
   - Expand Omics/NGS, select Variant data
   - See estimated data volume update in real-time

4. **Define Activities**
   - Check "ETL/Standardization" + "AI/ML Model Development"
   - System alerts: "Patient-level access required for selected activities"

5. **Assign Users**
   - Select "Oncology Biometrics" organization (42 users auto-populated)
   - Add individual: Keith as Power User
   - Preview access list

6. **Submit Collection**
   - System creates collection DC-2025-1042
   - Agent analyzes current access: "20% already accessible..."
   - Shows progress dashboard

7. **View Progress (DCM perspective - Divya)**
   - Real-time updates: "30% ready for immediate access - approve?"
   - Click approve → instant access granted
   - "40% routed to GPT-Oncology for approval"
   - Agent discovers missing genomics data: "Scanning SolveBio..."
   - Match found: "Study DCODE-003 genomics located (confidence: 92%)"

8. **Final State**
   - Dashboard shows 85% complete
   - 3 users pending training
   - 1 approval pending from TALT
   - Estimated completion: 3 days (vs weeks in legacy process)

### Deployment for POC

- **Hosting**: Vercel (free tier sufficient for prototype)
- **Access**: Share URL with stakeholders, no complex deployment needed
- **Demo Mode**: "Auto-play" option to walk through workflow automatically
- **Reset Functionality**: Reset demo data between stakeholder sessions

---

## Success Metrics & KPIs

### Quantitative Metrics

1. **Time to Access Reduction**
   - **Current State** (iDAP): 2-4 weeks average for multi-study collections
   - **Target State** (Collectoid): <3 days for 80% of requests

2. **Manual Effort Reduction**
   - **Current State**: ~8 hours DCM time per collection (coordination, policy creation, approvals)
   - **Target State**: <1 hour DCM time per collection (primarily review/approval clicks)

3. **Automation Rate**
   - **Target**: 60% of access grants fully automated (no human intervention)
   - **Target**: 30% automated with single approval click
   - **Target**: <10% requiring manual troubleshooting

4. **User Satisfaction**
   - **Current State**: [Baseline TBD - establish via survey]
   - **Target**: >4.0/5.0 satisfaction score on post-POC demo survey

5. **Metadata Coverage**
   - **Current State**: ~70% of data assets properly cataloged (estimated)
   - **Target**: >90% coverage through automated discovery

### Qualitative Success Indicators

1. **Stakeholder Engagement**
   - Positive feedback from leadership (Stacy, Rafa, LT members)
   - Expressions of confidence in 2026 resource allocation
   - Requests for expanded scope or additional use cases

2. **Paradigm Shift Understanding**
   - Stakeholders articulate the agentic AI value proposition
   - Recognition that this is fundamentally different from iDAP, not just a UI refresh

3. **Cross-functional Alignment**
   - Data governance teams (GPT, TALT) express confidence in compliance
   - IT infrastructure teams understand integration requirements
   - End-users (researchers) express excitement about simplified workflow

4. **Resource Commitment**
   - Approval for 2+ developer FTEs for 2026 production development
   - Budget allocation for production infrastructure
   - Timeline commitment for iDAP migration

---

## Timeline & Milestones

### Target Completion: December 2025

**Phase 1: Design & Requirements (2 weeks)**
- [x] Extract and document requirements from stakeholder discussions
- [ ] Create user personas and journey maps
- [ ] Define UI component library and design patterns
- [ ] Finalize mock data structures

**Phase 2: Core Workflow Implementation (4 weeks)**
- [ ] Week 1-2: Collection creation wizard (Steps 1-5)
- [ ] Week 3: Collection detail and progress dashboard
- [ ] Week 4: Agentic simulation logic (background processing, state transitions)

**Phase 3: Supporting Features (2 weeks)**
- [ ] Week 5: Bulk user lookup tool
- [ ] Week 6: DCM approval queue and admin views

**Phase 4: Integration & Polish (2 weeks)**
- [ ] Week 7: Connect all views, end-to-end flow testing
- [ ] Week 8: Visual polish, responsive design, demo mode

**Phase 5: Stakeholder Demo & Feedback (1-2 weeks)**
- [ ] Week 9: Internal demo with Divya and immediate team
- [ ] Week 10: Stakeholder demo with Stacy, Rafa, LT
- [ ] Week 10-11: Incorporate feedback and iterate

**Buffer: 1-2 weeks for holidays, unexpected delays**

### Key Milestones

| Date | Milestone | Deliverable |
|------|-----------|-------------|
| Week 2 | Requirements Complete | This document + design specs |
| Week 4 | Core Workflow Demo | Interactive wizard (Steps 1-5) |
| Week 6 | Feature Complete | All views functional |
| Week 8 | POC Ready | Polished prototype ready for stakeholders |
| Week 10 | Stakeholder Demo | Presentation + live demo session |
| Week 11 | Final POC Delivery | Refined prototype + documentation |

---

## Dependencies, Assumptions & Risks

### Dependencies

1. **Design Assets**
   - **Need**: AstraZeneca brand guidelines, design system components (if available)
   - **Mitigation**: Use generic professional styling if not available, can be reskinned later

2. **Sample Data**
   - **Need**: Realistic study metadata, user lists, data categories
   - **Mitigation**: Work with Divya to extract sanitized samples from real systems

3. **Stakeholder Availability**
   - **Need**: Timely feedback, demo scheduling with busy leadership calendars
   - **Mitigation**: Build in buffer time, async demo option (recorded walkthrough)

4. **Technical Access**
   - **Need**: May need VPN, internal network access for SSO API testing
   - **Mitigation**: Work fully with mocks if access unavailable, document real integration approach

### Assumptions

1. **Scope Stability**
   - **Assumption**: Requirements will not dramatically change during development
   - **Risk**: Leadership discussions ongoing, scope may shift
   - **Mitigation**: Modular design allowing feature additions without major rework

2. **Immuta as Access Control Platform**
   - **Assumption**: Immuta will remain the chosen solution for policy enforcement
   - **Risk**: Platform change would affect integration design
   - **Mitigation**: Abstract policy management behind generic interface

3. **Agentic AI Feasibility**
   - **Assumption**: Proposed agent capabilities are technically achievable with current AI/ML
   - **Risk**: Some capabilities (e.g., perfect metadata discovery) may be aspirational
   - **Mitigation**: Prototype focuses on workflow/UX; detailed technical feasibility can be separately validated

4. **User Adoption**
   - **Assumption**: End-users will embrace new workflow vs legacy process familiarity
   - **Risk**: Change resistance, training burden
   - **Mitigation**: Emphasize simplification, gather user feedback in POC phase

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Scope creep from evolving LT discussions | High | Medium | Lock POC scope, track new requests as "Phase 2" enhancements |
| Accenture engagement delays/conflicts | Medium | Medium | Ensure Collectoid POC is independent, can proceed in parallel |
| Competing priorities (BAU, hackathon prep) | Medium | Medium | Block dedicated time for POC work, communicate priorities with Divya |
| Technical integration challenges | Low | Low | Fully mocked prototype, integration details deferred to production phase |
| Stakeholder unavailability for demo | Medium | High | Pre-record demo video, schedule early, multiple demo slots |
| Resource approval denial despite successful POC | Low | High | Ensure POC clearly ties to business value and 2026 strategic priorities |

---

## Open Questions & Clarifications Needed

### Pending Clarifications

1. **Sherpa, Sherlock, Prism Details**
   - What specific functions do these companion agentic systems provide?
   - How does Collectoid integrate/coordinate with them?
   - Should POC reference these or focus solely on Collectoid?

2. **Approval Authority Details**
   - What are the exact roles/membership of GPT and TALT groups?
   - Are there other approval bodies for different therapeutic areas or data types?
   - What's the typical approval SLA (hours, days, weeks)?

3. **Training Requirements Matrix**
   - What courses are required for which data types/access levels?
   - Where is training completion data stored and how is it accessed?
   - Is there a published mapping of data type → required courses?

4. **Data Privacy Rules**
   - What exactly are the rules for aggregated vs patient-level access?
   - What constitutes "de-identified" or "aggregated" in AstraZeneca's governance?
   - Are there different rules for different geographies?

5. **Metrics Baseline**
   - Can we get actual data on current iDAP performance (time to access, effort, user satisfaction)?
   - What's the current volume of data access requests (per month, per year)?
   - What percentage of requests are currently denied or delayed?

6. **Production Technology Decisions**
   - If POC is approved, what's the intended production tech stack?
   - Are there infrastructure constraints (AWS only, specific services, on-prem requirements)?
   - What's the integration strategy with existing systems (APIs available, direct DB access, file drops)?

7. **Organizational Changes**
   - Divya mentioned "major org level changes" - how might these impact this project?
   - Is team structure stable for 2026 planning purposes?

---

## Next Steps

### Immediate Actions (This Week)

1. **Review this document with Divya**
   - Validate understanding of requirements
   - Answer open questions
   - Prioritize features if scope needs trimming

2. **Share with Rafa and Accenture team**
   - Ensure alignment with their parallel workstreams
   - Identify any conflicts or dependencies

3. **Obtain sample data**
   - Study metadata (sanitized)
   - User lists (anonymized if needed)
   - Example SDTM/ADaM data categories

4. **Set up development environment**
   - Initialize Next.js project
   - Configure Tailwind + component library
   - Create mock data structures

### Short-term Actions (Next 2 Weeks)

1. **Design iteration**
   - Create wireframes for key views
   - Review with Divya for feedback
   - Refine workflow based on feedback

2. **Begin core implementation**
   - Collection creation wizard skeleton
   - Mock data services
   - State management setup

3. **Stakeholder communication**
   - Brief status updates to Stacy and leadership
   - Demo scheduling for Week 10

---

## Appendix: Terminology & Acronyms

### Clinical Trial & Data Standards

- **SDTM (Standard Data Tabulation Model)**: CDISC standard for organizing clinical trial data into domains (DM, AE, EX, etc.)
- **ADaM (Analysis Data Model)**: CDISC standard for analysis-ready datasets derived from SDTM
- **DM (Demographics)**: SDTM domain containing patient demographic information
- **EX (Exposure)**: SDTM domain containing treatment exposure information
- **ctDNA (circulating tumor DNA)**: Tumor-derived DNA fragments in bloodstream, used as biomarker in oncology
- **cfDNA (cell-free DNA)**: DNA fragments circulating in blood, includes ctDNA plus normal DNA
- **NGS (Next-Generation Sequencing)**: High-throughput DNA sequencing technologies
- **VAF (Variant Allele Frequency)**: Proportion of sequencing reads containing a specific variant
- **COSMIC**: Catalogue of Somatic Mutations in Cancer database
- **LoD/LoQ (Limit of Detection/Quantitation)**: Minimum detectable/quantifiable analyte levels
- **BOR (Best Overall Response)**: Best clinical response achieved during treatment (CR/PR/SD/PD)
  - **CR**: Complete Response
  - **PR**: Partial Response
  - **SD**: Stable Disease
  - **PD**: Progressive Disease
- **ECOG**: Eastern Cooperative Oncology Group performance status scale
- **PET (Positron Emission Tomography)**: Medical imaging technique
- **MTV/TLG (Metabolic Tumor Volume / Total Lesion Glycolysis)**: PET imaging metrics

### Organizational & System Terms

- **AZCt iDAP**: AstraZeneca Clinical trials - integrated Data Access Platform (legacy system)
- **Collectoid**: Agentic component for data collection management (this POC)
- **DCM (Data Collection Manager/Management)**: Role and system for managing data collections
- **GPT**: Governance Project Team (approval authority for specific domains)
- **TALT**: [Appears to be legal/approval team - exact expansion TBD]
- **PRID (Personnel Record ID)**: AstraZeneca employee/contractor identifier
- **Immuta**: Data access control and policy enforcement platform
- **EPU (Extended Primary Use)**: Type of consent allowing broader use of clinical trial data
- **Workday**: HR information system
- **SolveBio / QuartzBio**: Genomics data management platforms
- **DICOM**: Digital Imaging and Communications in Medicine (medical imaging standard)
- **LT (Leadership Team)**: Executive leadership
- **BAU (Business As Usual)**: Ongoing operational work

### Technical Terms

- **Agentic AI**: Autonomous AI systems that can take actions and make decisions toward goals
- **Next.js**: React-based web application framework
- **Immuta Policy**: Rule-based access control configuration
- **S3**: Amazon Simple Storage Service (cloud object storage)

---

## Document Control

**Version History**:

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | [Current Date] | Keith Hayes | Initial POC requirements document based on stakeholder discussions |

**Review & Approval**:

| Reviewer | Role | Status | Date |
|----------|------|--------|------|
| Divya Dayanidhi | Manager / Product Owner | Pending | |
| Rafa | [Role TBD] | Pending | |
| Stacy | [Role TBD] | Pending | |

---

## Contact & Feedback

**Document Owner**: Keith Hayes (keith.hayes3@astrazeneca.com)

For questions, clarifications, or feedback on this POC document, please reach out via Teams or email.

---

*This document is a living artifact and will be updated as requirements are clarified and stakeholder feedback is incorporated.*

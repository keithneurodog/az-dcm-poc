# Collectoid POC Requirements Document
## Next-Generation Clinical Trial Data Access Platform

**Document Version:** 2.1
**Last Updated:** November 11, 2025
**Target Delivery:** December 2025
**Owner:** Keith Hayes
**Stakeholders:** Jennifer Martinez, Stacy, Rafa, Leadership Team

> **Version 2.1 Updates**: Integrated critical learnings from screenshot analysis (see `dcm-workflow-learnings.md`). Enhanced DCM Data Curation Workbench requirements including: 30+ data category taxonomy, AI-assisted category suggestion workflow, multi-dimensional search, Activities/Intents selection, detailed 20/30/40/10 access provisioning breakdown, and progressive refinement flow. Emphasized that DCM workflow is a **sophisticated data curation workbench**, not simple browse/select.

---

## Executive Summary

### Strategic Context

AstraZeneca is decommissioning the legacy **AZCt iDAP** (AstraZeneca Clinical trials - integrated Data Access Platform) in 2026. This creates a critical need for a next-generation data access solution.

The **Collectoid** system represents a paradigm shift in how clinical trial data is curated and accessed, serving **two distinct user types with fundamentally different workflows**:

#### Primary Focus: Data Collection Managers (DCMs)
DCMs are data curators responsible for creating, managing, and maintaining data collections. Their complex workflow involves:
- **Intelligent data discovery** - Browse/search with DCM-specific views (collection crossover, usage analytics)
- **Deep metadata exploration** - Drill into dataset details, quality metrics, usage patterns
- **Collection curation** - Select datasets, amend/append metadata, bundle into thematic collections
- **Collection management** - Track cross-collection dataset usage, identify gaps, maintain quality
- **Approval orchestration** - Work with Collectoid agent to process access requests and manage policies

> **Note**: DCM requirements will be explored in greater depth through upcoming workshops. This POC will establish the foundation with the expectation of significant refinement.

#### Secondary Focus: End Users (Researchers)
Researchers need to find and access data for their analyses. Their **simplified workflow** involves:
- **Data discovery** - Browse/search for relevant datasets or pre-curated collections
- **Instant access** - 90% of data instantly accessible via single click-through to end platform
- **Access requests** - For non-instant data, simple request flows with progress tracking
- **Platform integration** - Direct links to data platforms (Immuta-enforced) or guides for platform access (e.g., AiBench for AWS lakes)

### Value Proposition

**For DCMs (Data Collection Managers)**:
- **Collection Curation Tools**: Purpose-built interface for discovering, selecting, and bundling datasets into collections
- **Collection Crossover Visibility**: See which datasets appear in multiple collections, identify patterns
- **Metadata Management**: Deep-dive into dataset details, amend/append metadata as data steward
- **Usage Analytics**: Understand which datasets/collections are most requested, identify gaps
- **Streamlined Approval**: Agentic automation reduces manual effort from hours to minutes per request

**For End Users (Researchers)**:
- **Instant Access**: 90% of data accessible with single click-through (90/10 initiative)
- **Simplified Discovery**: Browse pre-curated collections or search datasets with intelligent recommendations
- **Platform Integration**: Direct links to end platforms (Immuta-enforced) or access request guides
- **Transparent Status**: Clear visibility into what's accessible now vs. pending

**Universal Benefits**:
- **Open metadata browsing**: All users can explore dataset descriptions without access restrictions
- **Reduced approval time**: From weeks to days (or instant) through agentic automation
- **Multi-modal data**: Seamlessly combine clinical, genomics, and imaging data across distributed platforms

### Success Criteria

This POC must demonstrate:

1. **DCM Data Curation Workbench** (PRIMARY - 60-70% of effort): Show sophisticated collection curation workflow including:
   - **AI-Assisted Category Suggestion**: Intent text → keyword extraction → category recommendations from 30+ taxonomy
   - **Multi-Dimensional Dynamic Search**: Filter by data categories, study characteristics, collection context, access criteria with live result counts
   - **Collection Crossover Analysis**: Show which datasets appear in multiple collections, identify patterns
   - **Progressive Refinement**: Iterative selection with real-time access matrix updates
   - **Activities/Intents Selection**: Data engineering vs scientific analysis affecting access levels
   - **Access Provisioning Breakdown**: 20/30/40/10 visualization with charts and progress tracking
   - **Smart Suggestions**: "Frequently bundled with," category completion, gap identification
   - **Metadata Management**: Deep-dive into dataset details, amend/append capabilities
   - **Approval Orchestration**: Collectoid automation for instant grants and approval routing

2. **End User Simplicity** (SECONDARY - 30-40% of effort): Show streamlined access flow:
   - Browse/discover pre-curated collections
   - Instant access for 90% of data (90/10 proof)
   - Simple request flow for non-instant data
   - Platform integration click-through (Domino, SCP, AiBench)

3. **Agentic AI Value**: Demonstrate measurable reduction in manual DCM effort through automation:
   - Auto-approval for 30% instant grant scenarios
   - Intelligent routing for 40% blocked scenarios
   - Progress monitoring and user guidance
   - AI-powered category suggestions and smart bundling

4. **Concept Validation**: Present multiple UX approaches for data discovery (chat vs browse vs hybrid)

5. **2026 Resource Justification**: Provide compelling evidence to secure 2+ developers for production

### Approach: DCM-First with End User Context

This POC prioritizes **DCM (Data Collection Manager) workflows** while providing enough end user context to demonstrate the complete ecosystem:

**Primary Development Focus**:
- **DCM Data Curation Workbench** (60-70% of effort): A sophisticated multi-dimensional interface for collection curation, NOT simple browse/select
  - AI-assisted intent-based discovery with keyword extraction and category suggestions
  - 30+ data category taxonomy with study counts
  - Multi-dimensional dynamic filtering (categories, study characteristics, collection context, access criteria)
  - Progressive refinement with live result counts and access matrix updates
  - Collection crossover analysis and smart bundling suggestions
  - Activities/Intents selection affecting access levels
  - Access provisioning breakdown visualization (20/30/40/10)
  - Metadata deep-dive and amendment tools
  - Collectoid automation demonstration
- **DCM-specific UI components**: Collection crossover views, usage analytics, access matrix, category taxonomy tree, intent input, filters panel
- **Workshop-informed iteration**: Foundation built now, refined based on upcoming DCM requirements workshop

**Secondary Development Focus**:
- **End user access workflow** (30-40% of effort): Simplified discovery and access flow
- **Instant access demonstration**: Show 90/10 principle in action with single-click access
- **Platform integration mocks**: Click-through to end platforms or access request guides

**Shared Across Both**:
- **Multiple concept exploration**: Present 2-3 UX concepts for data discovery (chat vs browse vs hybrid)
- **Mock integrations**: Backend data and responses mocked to create interactive, flowable experiences
- **Iterative refinement**: Outstanding questions documented, expecting workshop clarification on DCM details

### Deliverable

An **interactive Next.js prototype** with two distinct user experiences:
1. **DCM Portal** (primary): Comprehensive collection curation and management workflow
2. **Researcher Portal** (secondary): Simplified data discovery and access workflow

Both share common discovery components but diverge significantly after dataset selection.

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

> **⚠️ OUTSTANDING TASK**: Comprehensive definition will be refined through upcoming DCM requirements workshop. Current understanding documented below as working hypothesis.

A **data collection** is a **DCM-curated grouping** of datasets bundled together for a specific theme, purpose, or user community. Collections are created and managed by DCMs, not end users.

### Data Category Taxonomy (30+ Categories)

DCMs work with a **comprehensive data category taxonomy** spanning multiple data domains. This taxonomy helps DCMs discover and bundle datasets with specific data types:

**SDTM (Clinical Trial Standard Data)**:
- Study/Subject Identification (STUDYID, SUBJID, SITEID)
- Timing Variables (RFSTDTC, RFENDTC, study milestones)
- Demographics (AGE, SEX, RACE, ETHNIC)
- Exposure (Treatment arms, dosing, duration)
- Tumor/Response Assessment (RECIST, iRECIST, BOR)
- Biomarker/Laboratory Results (Chemistry, hematology, coagulation)
- Concomitant Medications (Prior/concurrent therapies)
- Adverse Events (AESI, grade, causality)
- Specimen/Procedures (Collection dates, sample types)

**ADaM (Analysis-Ready Data)**:
- ADSL (Subject-Level Analysis Dataset - baseline characteristics)
- ADRS/ADEFF (Response/Efficacy outcomes)
- ADTTE (Time-to-Event analysis - OS, PFS)
- ADBM/ADLB (Biomarker/Laboratory analysis datasets)
- ADEXP (Exposure analysis)

**RAW Data (Pre-Standardization)**:
- Specimen Metadata (Aliquot IDs, volume, QC flags)
- Processing/QC Metrics (Extraction yield, integrity scores)
- Assay Metadata (Platform, kit version, protocol)
- ctDNA Measures (VAF, copies/mL, tumor fraction)

**DICOM (Medical Imaging)**:
- IDs/Timing (PatientID, StudyDate, SeriesDate)
- Acquisition Parameters (Modality, slice thickness, contrast)
- Quantitative Outputs (MTV, TLG, SUVmax from PET)

**Omics/NGS (Genomics)**:
- Sample/Provenance (PRID, timepoint, tissue type)
- Pipeline Metadata (Reference genome, tool versions, BED files)
- Variants (SNVs, indels in HGVS/VCF format)
- Copy Number/Structural Variants (CN gains/losses, fusions)
- Global Scores (TMB, MSI status, HRD score)
- Clonal Dynamics (ccf, clonal evolution tracking)
- QC Metrics (Coverage depth, contamination %)

**Privacy-Preserving Aggregation**:
- Cohort-level statistics (no patient-level data)
- Stratified summaries by biomarker/response

**Model-Ready Features**:
- Engineered features for ML/AI workflows
- Harmonized multi-modal feature sets

> **Key DCM Feature**: Each category shows **how many studies contain that data type**, helping DCMs understand data availability and make informed bundling decisions.

**Key Distinction**:
- **DCMs CREATE collections**: Data Collection Managers discover, select, and bundle datasets into thematic collections
- **Researchers ACCESS collections**: End users discover and request access to pre-curated collections

**DCM Curation Process**:
- Discover datasets using DCM-specific tools (collection crossover views, usage analytics)
- Select one or more datasets for bundling
- Dig deep into metadata, amend/append information as needed
- Define collection purpose, target user community, access criteria
- Publish collection for researcher discovery

**Researcher Access Process**:
- Browse available collections (e.g., "Oncology ctDNA Biomarker Collection")
- Request access to entire collection (or individual datasets within it)
- Once approved, gain instant access (90/10 principle for similar users)
- Track access status in "My Data Access" dashboard

**Key Point**: Access is determined **per-dataset per-user** by Immuta policies. Collections are organizational units that simplify discovery and bundling, not the actual access control boundary.

### Collection Crossover (DCM-Specific Concept)

**Definition**: Collection crossover refers to datasets that appear in multiple collections. This is a critical DCM concern when curating new collections.

**Why It Matters**:
- **Avoid duplication**: DCMs need to see if a dataset is already heavily used in other collections
- **Understand patterns**: Which datasets are commonly bundled together?
- **Identify gaps**: Are there popular datasets that should be in more collections?
- **Usage analytics**: High crossover might indicate "core" datasets for a therapeutic area

**DCM Interface Implications**:
```
Dataset: DCODE-042 NSCLC Biomarker Study

Collection Crossover:
├ ✓ Oncology ctDNA Biomarker Collection (120 users)
├ ✓ Lung Cancer Phase III Studies (85 users)
├ ✓ Immunotherapy Response Collection (62 users)
└ ✓ Multi-Modal Oncology Data (45 users)

Total: In 4 collections, 312 total user access grants
Most frequently bundled with: DCODE-001, DCODE-088, DCODE-102
```

**Use Case**: When DCM Divya is creating a new "Oncology Outcomes" collection, she can see that DCODE-042 is already in 4 other collections with heavy usage. This helps her decide:
- Include it (popular, clearly valuable)
- Skip it (already well-covered)
- Check what datasets are commonly paired with it (DCODE-001, 088, 102) for suggestions

> **⚠️ OUTSTANDING TASK**: Refine collection crossover requirements and UI presentation in DCM workshop.

### Metadata vs Data Access

**Metadata is open**: All users (DCMs and researchers) can browse the full catalog of datasets, view descriptions, categories, schemas, and understand what data exists.

**Data access is controlled**: Viewing actual data (download, query, preview) is enforced by Immuta policies. Users who lack access see datasets but cannot view/download data without requesting access.

**UI Implications for Researchers**: Dataset cards/listings should clearly indicate:
- ✅ **Accessible Now**: User has active access, can view data immediately
- ⏳ **Pending Approval**: User has requested access, approval in progress
- 🔒 **Requires Request**: User can see metadata but must request access to view data

**UI Implications for DCMs**: Dataset cards should additionally show:
- Collection crossover count (e.g., "In 4 collections")
- Usage metrics (e.g., "120 active users")
- Data quality indicators

### The 90/10 Instant Access Principle (Researcher Benefit from DCM Curation)

Once a **DCM-curated collection** is approved for a user with specific attributes (organization, role, training, etc.), **similar users matching those attributes should gain instant access** without re-approval.

**How It Works**:
1. DCM Divya creates "Oncology ctDNA Biomarker Collection"
2. First researcher (Dr. Chen) from Oncology Biometrics requests access
3. Request goes through approval, Dr. Chen gains access
4. Collectoid recognizes: "Data Scientist in Oncology Biometrics with required training"
5. Next researcher (Marcus) with same profile requests access
6. **Instant access granted** - no manual approval needed

**Mechanism** (working hypothesis, pending clarification):
- User matching likely based on SSO `memberOf` groups or complex attribute ruleset
- First approval for a user profile creates a "template" for instant access
- Subsequent users are automatically matched and granted access if they qualify
- Target: 90% of users should experience instant access, only 10% require new approvals

**DCM Benefit**: Reduces repeat approval workload. Create collection once, many researchers benefit.

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

## User Personas

This POC serves **two fundamentally different user types** with distinct workflows:

### User Type Classification

**👥 Researchers (End Users) - SECONDARY FOCUS**
- **Goal**: FIND and ACCESS data for analysis
- **Actions**: Browse/search datasets or collections → Request access → Get instant access (90/10) or await approval
- **Simplified Workflow**: Discovery → Request → Access
- **Personas**: Sarah (novice), Marcus (power user), Dr. Chen (hybrid)

**🔧 Data Collection Managers (DCMs) - PRIMARY FOCUS**
- **Goal**: CURATE and MANAGE data collections
- **Actions**: Discover datasets → Select for bundling → Dig into metadata → Amend/curate → Create collection → Manage approvals
- **Complex Workflow**: Curation → Management → Approval Processing
- **Persona**: Divya (DCM)

> **Development Priority**: Build DCM workflows first (60-70% effort), then researcher workflows (30-40% effort) to demonstrate end-to-end value.

---

## Researcher Personas (Simplified Workflows)

### Persona 1: Sarah - Novice Researcher

**Role**: Junior Data Scientist, 6 months at AstraZeneca
**Therapeutic Area**: Oncology
**Technical Proficiency**: Basic (familiar with analysis tools, unfamiliar with data infrastructure)
**Data Experience**: First time requesting clinical trial data

**Needs**:
- **Guidance**: Needs hand-holding through the data discovery and request process
- **Simplicity**: Prefers conversational interface over complex forms
- **Clarity**: Needs clear explanations of terminology (SDTM, consent types, etc.)
- **Confidence**: Wants assurance that she's requesting the right data for her research question

**Preferred Interaction**: **AI Chat Assistant**
- Asks questions in natural language: "I need lung cancer patient data with genomic markers"
- Assistant guides her through refining her request
- Suggests related datasets she might not have considered
- Explains approval process and timelines in simple terms

**User Journey**:
1. Opens platform, greeted by chat interface: "Hi Sarah! How can I help you find data today?"
2. Describes research goal in plain language
3. Assistant asks clarifying questions, suggests relevant datasets
4. Reviews suggested datasets with explanations
5. Confirms selection, submits request
6. Receives progress updates and can ask questions about status

**Success Metrics**:
- Time from landing page to submitted request: <10 minutes
- Zero need to contact support for clarification
- High confidence rating in post-request survey

---

### Persona 2: Marcus - Power User Researcher

**Role**: Senior Biostatistician, 8 years at AstraZeneca
**Therapeutic Area**: Multiple (primarily Cardiovascular, some Oncology)
**Technical Proficiency**: High (deeply familiar with SDTM, data standards, internal systems)
**Data Experience**: Makes 10-15 data requests per year

**Needs**:
- **Efficiency**: Wants fastest path to data without unnecessary guidance
- **Precision**: Prefers structured browse/filter interfaces over chat
- **Breadth**: Often explores broadly before narrowing down
- **Control**: Wants full control over selection criteria

**Preferred Interaction**: **Traditional Browse/Search Interface**
- Goes directly to catalog with category filters
- Uses advanced search with multiple criteria
- Quickly scans results, multi-selects datasets
- Reviews cart, submits bulk request

**User Journey**:
1. Opens platform, navigates directly to "Browse Data" (skips chat)
2. Applies filters: Therapeutic Area = Cardiovascular, Phase = III, Status = Closed
3. Uses keyword search within results: "ejection fraction"
4. Adds 12 datasets to collection in 2 minutes
5. Names collection, submits request
6. Monitors progress via dashboard (no need for chat assistance)

**Success Metrics**:
- Time from landing page to submitted request: <3 minutes for experienced users
- Number of clicks to complete task: minimized
- Ability to work efficiently without AI interruptions

---

### Persona 3: Dr. Chen - Hybrid User (Subject Matter Expert)

**Role**: Clinical Scientist / Medical Lead, 12 years at AstraZeneca
**Therapeutic Area**: Oncology (ctDNA biomarkers specialist)
**Technical Proficiency**: Medium-High (strong clinical knowledge, moderate data infrastructure knowledge)
**Data Experience**: Occasional requests (3-4 per year), often complex multi-modal needs

**Needs**:
- **Flexibility**: Sometimes wants to browse, sometimes wants AI suggestions
- **Context**: Needs to understand clinical context of datasets, not just technical metadata
- **Discovery**: Values intelligent suggestions for related data she might not know exists
- **Comprehensive**: Often needs multi-modal data (clinical + genomic + imaging)

**Preferred Interaction**: **Hybrid - Browse with AI Assistance**
- Starts by browsing familiar datasets
- Activates AI assistant for suggestions on related genomic datasets
- Uses chat to ask "What imaging data is available for these studies?"
- Reviews AI suggestions alongside her manual selections

**User Journey**:
1. Opens platform, begins browsing Oncology datasets
2. Selects 3 familiar clinical trial datasets
3. Clicks "Get AI Recommendations" button
4. Reviews suggested genomic datasets: "Users who accessed these clinical datasets also used..."
5. Asks chat: "Do any of these studies have PET imaging?"
6. Assistant highlights 2 studies with imaging, adds to collection
7. Submits comprehensive multi-modal request

**Success Metrics**:
- Discovery of relevant datasets she wouldn't have found manually
- Satisfaction with AI suggestion relevance
- Successful multi-modal data collection assembly

---

---

## DCM Persona (PRIMARY FOCUS - Complex Curation Workflow)

### Persona: Divya - Data Collection Manager (DCM)

**Role**: Data Collection Manager / Data Curator
**Team**: Data Science & AI, R&D IT
**Responsibility**: **PRIMARY**: Create and curate data collections | **SECONDARY**: Process access approvals

> **Note**: This persona represents the PRIMARY focus of the POC. DCM requirements will be explored in depth through upcoming workshops. Expect significant refinement based on workshop outcomes.

> **Critical Insight**: The DCM workflow is **NOT** simple "browse and select datasets." It's a **sophisticated data curation workbench** with AI-assisted category selection, multi-dimensional dynamic search, collection crossover analysis, real-time access matrix, smart bundling suggestions, and iterative refinement. The POC must demonstrate this complexity to resonate with stakeholders.

**Primary Needs (Collection Curation)**:
- **AI-Assisted Discovery**: Intent-based search with keyword extraction and category suggestions (e.g., "Oncology" → suggests TA=ONC and IMMUNONC categories)
- **Multi-Dimensional Search**: Filter by data categories (30+ taxonomy), study characteristics, collection context, and access criteria
- **Deep Metadata Exploration**: Drill into dataset details beyond what researchers see
- **Collection Crossover Visibility**: See which datasets appear in multiple collections, identify patterns, understand usage
- **Dynamic Refinement**: Progressive filtering with live result counts and access matrix updates
- **Curation Tools**: Select datasets, amend/append metadata, bundle into thematic collections
- **Smart Suggestions**: "Frequently bundled with," category completion, gap identification
- **Quality Management**: Maintain metadata accuracy, handle error reports from users

**Secondary Needs (Approval Processing)**:
- **Efficiency**: Process access requests quickly with Collectoid assistance
- **Visibility**: See approval queue status and bottlenecks
- **Automation**: Let Collectoid handle 90/10 instant access, only review exceptions

**Preferred Interaction**: **DCM Data Curation Workbench**
- AI-assisted intent/keyword input with category suggestions
- Multi-dimensional filtering interface with live result counts
- DCM-specific dataset views showing collection crossover, usage analytics, access status
- Progressive refinement workflow (add/remove, see updated access matrix)
- Curation workspace for building/editing collections
- Activities/Intents selection affecting access levels
- Metadata editor for amendments
- Access matrix visualization and provisioning breakdown
- Approval queue (handled mostly by Collectoid)

**Primary User Journey: Collection Curation (Progressive Refinement Flow)**
1. **Identify Need & Express Intent**: Oncology researchers frequently requesting same datasets
   - DCM enters intent text: "I need to create a collection for oncology researchers studying ctDNA biomarkers and immunotherapy response"

2. **AI-Assisted Keyword Extraction & Category Suggestion**:
   - System extracts keywords: "Oncology," "ctDNA," "biomarkers," "immunotherapy"
   - AI suggests relevant data categories from 30+ taxonomy:
     - TA = ONC and IMMUNONC (therapeutic areas)
     - SDTM: Demographics, Exposure, Tumor/Response, Biomarker/Labs, Adverse Events
     - RAW: ctDNA Measures, Specimen Metadata, Assay Metadata
     - ADaM: ADSL, ADRS/ADEFF, ADTTE, ADBM/ADLB
     - Omics/NGS: Variants, Global Scores (TMB, MSI)
   - DCM reviews and selects/modifies suggested categories
   - **Each category shows study count** (e.g., "ctDNA Measures - 23 studies")

3. **Multi-Dimensional Dynamic Filtering**:
   - **Dimension 1**: Data categories (selected from AI suggestions)
   - **Dimension 2**: Study characteristics (TA, phase, status, geography)
   - **Dimension 3**: Collection context (crossover count, usage patterns, data availability)
   - **Dimension 4**: Access criteria (current policies, training requirements, legal restrictions)
   - **Live result count updates** as filters applied (e.g., "42 datasets match your criteria")

4. **Refined Results with DCM Context**:
   - Dataset cards show:
     - ✅ Which specific categories available (SDTM Demographics ✓, ctDNA ✓, NGS Variants ✓)
     - 📊 Collection crossover: "In 3 collections" with details
     - 👥 Usage stats: "87 active users across 5 organizations"
     - ⚡ Access eligibility: "20% instant, 30% ready to grant, 40% needs approval, 10% missing"
     - 🏷️ Study metadata

5. **Iterative Selection & Access Matrix Review**:
   - Multi-select datasets for new "Oncology ctDNA Outcomes" collection
   - **Real-time access matrix** shows current user access status per dataset
   - **Provisioning breakdown updates** as datasets added/removed:
     - 20% already open (for 50% of users)
     - 30% ready to grant (instant)
     - 40% needs approval (GPT/TALT)
     - 10% missing data location
     - 10% users missing training
   - DCM can **go back and refine** filters to adjust access breakdown
   - Smart suggestions: "Frequently bundled with DCODE-001, DCODE-088"

6. **Activities/Intents Selection** (Affects Access Level):
   - **Data Engineering** (check all that apply):
     - ETL/standardization (date unification, unit harmonization, HGVS normalization, panel coverage mapping, LoD/LoQ capture, QC flag propagation)
     - Variant harmonization (left-align/normalize, canonical transcript selection, COSMIC/ClinVar annotation, deduplication)
   - **Scientific Analysis - Secondary use of patient level data**:
     - Early response classifier (baseline ctDNA, % drop by Week 4, max VAF, using AI/ML)
     - Multimodal fusion (ctDNA + PET MTV/TLG + clinical covariates)
     - Cohort builder (filters for cancer type/subtype, stage, line, regimen class, panel version)

7. **Deep Dive into Selected Datasets**:
   - Click into each dataset to review:
     - Detailed metadata (beyond what researchers see)
     - Data quality indicators
     - Usage metrics (how many users, which organizations)
     - Current collection memberships
   - **Metadata Curation**: Review for accuracy, amend descriptions if needed (as data steward), add tags/categories, flag quality issues

8. **Collection Definition & User Assignment**:
   - Define collection purpose and target user community
   - **User Assignment**:
     - Org-based (Workday integration)
     - Role-based (Data Scientists, Engineers)
     - Individual PRIDs
   - Set access criteria based on Activities/Intents selected

9. **Collectoid Automation & Provisioning**:
   - Review final access matrix and provisioning breakdown
   - Charts and progress bars show:
     - 30% instant grant → Collectoid updates Immuta policy (metadata updates) → instant access to 90% of users
     - 40% blocked → DCM auto-creates authorization → sent to GPTs or TALT → they approve → write Immuta policy
     - 10% missing location → Initiate find/catalogue action
     - 10% users missing training → As soon as completed, qualify for unlocked data
   - Collectoid handles automated routing and policy generation

10. **Publish & Monitor**:
    - Collection becomes available for researcher discovery
    - Track collection usage, handle access requests, refine over time
    - Charts and bar diagrams to track progress

**Secondary User Journey: Approval Processing**
1. Review approval queue (mostly handled by Collectoid agent)
2. Address flagged exceptions requiring manual review
3. Monitor metrics and identify process improvements

**Success Metrics**:
- **Curation**: Time to create new collection <2 hours (from idea to published)
- **Quality**: Collection usage rate >70% of target audience
- **Efficiency**: <15 minutes per week on approval queue (rest automated)
- **Impact**: 90% instant access rate achieved for curated collections

---

## Core User Journeys

###  Journey 1: Data Discovery & Request (Researcher Perspective)

This journey applies to all researcher personas with UI adaptations based on preference.

#### Step 1: Landing & Mode Selection

**UI Concept A - Explicit Mode Selection**:
```
┌─────────────────────────────────────────┐
│  Welcome to Clinical Data Platform      │
│                                          │
│  How would you like to find data?       │
│                                          │
│  [💬 Chat with AI Assistant]            │
│  Guide me through finding the right data│
│                                          │
│  [🔍 Browse Data Catalog]               │
│  I know what I'm looking for            │
│                                          │
│  [Recent Collections] [Quick Access]    │
└─────────────────────────────────────────┘
```

**UI Concept B - Unified Interface**:
```
┌──────────────────────────────────────────────────┐
│ 🔍 Search datasets or ask a question...         │
│ e.g., "lung cancer phase III" or "Show me       │
│ ctDNA biomarker studies"                         │
└──────────────────────────────────────────────────┘
│                                                  │
│ 📂 Browse by Category    🏷️ Browse by Tag      │
│ ├ Oncology (230)         ├ ctDNA (45)           │
│ ├ Cardiovascular (180)   ├ Phase III (120)      │
│ ├ Immunology (95)        └ Closed Studies (340) │
│                                                  │
│ 💡 Suggested for you: [3 datasets]             │
│ 📊 Trending: [Immunotherapy studies]            │
└──────────────────────────────────────────────────┘
```

**UI Concept C - Persona-Adaptive**:
```
System detects user history:
- New user → defaults to chat interface
- Returning power user → defaults to browse
- Option to switch modes always visible
```

> **POC Approach**: Implement multiple concepts for user testing and stakeholder feedback

#### Step 2: Data Discovery

**Browse Mode (Marcus - Power User)**:
```
Filters Panel:
├ Therapeutic Area: [Cardiovascular ▼]
├ Study Phase: [I] [II] [III] [IV]
├ Study Status: [Active] [✓ Closed]
├ Data Types: [✓ Clinical] [Genomic] [Imaging]
├ Consent Type: [EPU] [Primary Use]
└ Access Status: [✓ Available Now] [Pending] [Requires Request]

Results (120 datasets):
┌──────────────────────────────────────┐
│ ✅ DCODE-042: Cardiovascular Outcomes│
│ Phase III, Closed 2024-03           │
│ Clinical (SDTM), 1,250 patients     │
│ 🔓 You have access                  │
└──────────────────────────────────────┘
│ 🔒 DCODE-081: Heart Failure Study   │
│ Phase III, Closed 2023-11           │
│ Clinical (SDTM + ADaM), 2,100 pts   │
│ 🔒 Request access                    │
└──────────────────────────────────────┘
```

**Chat Mode (Sarah - Novice Researcher)**:
```
💬 Sarah: I need lung cancer patient data with genomic markers

🤖 Assistant: I can help you find that! Let me ask a few questions:

1. What phase clinical trials are you interested in?
   [Phase I] [Phase II] [Phase III] [All phases]

2. Do you need active or completed studies?
   [Active studies] [Completed studies] [Both]

3. What specific genomic markers are you looking for?
   [Type your answer or select common ones: EGFR, ALK, KRAS...]

💬 Sarah: Phase III, completed studies, EGFR and ALK

🤖 Assistant: Great! I found 8 datasets matching your criteria:

[View Results] or would you like me to narrow this down further?

💡 Suggestion: I also found 3 related ctDNA monitoring datasets
from the same studies that users often request together.
[Show me these]
```

**Intelligent Suggestions** (All Modes):
- RAG-based semantic search on dataset descriptions
- "Users who accessed X also requested Y" patterns
- Related studies in same trial series
- Multi-modal data completion: "This study also has imaging data available"

#### Step 3: Dataset Selection & Collection Creation

**Interface (works in both browse and chat modes)**:
```
Your Selection (5 datasets):
┌────────────────────────────────────────────────┐
│ ✅ DCODE-001: NSCLC Phase III (Clinical)      │ [Remove]
│ 🔒 DCODE-001: NSCLC Phase III (Genomics)      │ [Remove]
│ 🔒 DCODE-042: NSCLC Biomarker (Clinical)      │ [Remove]
│ ✅ DCODE-088: Lung Cancer Outcomes (Clinical) │ [Remove]
│ 🔒 DCODE-088: Lung Cancer Outcomes (Imaging)  │ [Remove]
└────────────────────────────────────────────────┘

Access Summary:
├ 2 datasets: ✅ You already have access (view now)
└ 3 datasets: 🔒 Require access request

Collection Details:
├ Name: [Lung Cancer EGFR Analysis Collection]
├ Purpose: [Research use - biomarker analysis]
└ Expected Duration: [6 months ▼]

💡 Good news! 2 similar users recently gained access to these
datasets. Your request will likely be approved quickly.

[Submit Access Request] [Save as Draft]
```

#### Step 4: Access Request Submission & Confirmation

**Immediate Feedback**:
```
✓ Collection Created: "Lung Cancer EGFR Analysis"

Access Status:
├ ✅ 2 datasets: Instant access (already had permissions)
├ ⏳ 2 datasets: Auto-approved, access granted in ~1 hour
└ ⏳ 1 dataset: Pending GPT-Oncology approval (~2-3 days)

Next Steps:
├ You can start working with 2 datasets immediately [View Data]
├ You'll receive an email when additional access is granted
└ Track progress on your Collections dashboard

[Go to My Collections] [Discover More Data]
```

---

### Journey 2: Collection Approval & Management (DCM Perspective)

DCM persona (Divya) manages incoming requests and monitors the approval pipeline, with emphasis on the **Access Provisioning Breakdown** visualization.

#### Step 1: DCM Dashboard Overview with Access Provisioning Breakdown

```
Data Collection Manager Portal

═══════════════════════════════════════════════════════════════
ACCESS PROVISIONING BREAKDOWN (Current Collection: "Oncology ctDNA Outcomes")
Collection Created: 15 datasets, 120 target users
═══════════════════════════════════════════════════════════════

┌──────────────────────────────────────────────────────────────┐
│ 20% ALREADY OPEN (for 50% of users)                          │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                               │
│ Status: ✅ No action needed                                   │
│ Impact: 60 users have immediate access                       │
│ Details: Study closed, DB lock >6 months, no restrictions    │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 30% READY TO GRANT (instant approval)                        │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                               │
│ Status: ⚡ DCM confirmation → instant access to 90% of users │
│ Impact: 108 additional users                                 │
│ Action: [Click to Confirm Instant Grant]                     │
│ Details: Study closed, DB lock >6 months, no legal blocks    │
│ Mechanism: Collectoid updates Immuta policy (metadata only)  │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 40% BLOCKED - NEEDS APPROVAL (GPT/TALT routing)              │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░ │
│                                                               │
│ Status: 🟡 Requires external approval                        │
│ Impact: 108 users (after approvals)                          │
│ Action: [Auto-Create Authorization Request]                  │
│ Routing:                                                      │
│   ├ 25% → GPT-Oncology (active study data)                   │
│   └ 15% → TALT-Legal (cross-geography/GDPR)                  │
│ Timeline: Approval → Collectoid writes Immuta policy → 90%   │
│           of users gain access                                │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 10% MISSING DATA LOCATION (requires data discovery)          │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                               │
│ Status: ❓ Data not catalogued                                │
│ Impact: Access delayed until data located                    │
│ Action: [Initiate Find/Catalogue Workflow]                   │
│ Details: 2 datasets with incomplete location metadata        │
│ Next Steps: Manual search or escalate to data stewards       │
└──────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────┐
│ 10% USERS HAVEN'T COMPLETED TRAINING                         │
│ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
│                                                               │
│ Status: ⏳ Pending user training completion                   │
│ Impact: 12 users currently blocked                           │
│ Action: ✉️ Notification sent to users with training links    │
│ Details: Missing GCP or Data Privacy L2 certification        │
│ Auto-Grant: As soon as training completed, qualify for all   │
│             unlocked data above                               │
└──────────────────────────────────────────────────────────────┘

Charts and Progress Tracking:
[View Detailed Breakdown] [Export Report] [Track Progress Over Time]

═══════════════════════════════════════════════════════════════

Approval Queue (12 pending):
┌─────────────────────────────────────────────────────┐
│ 🟢 8 Auto-Approved by Collectoid                    │
│    ├ 90/10 instant access (matched existing users)  │
│    └ No action needed, access already granted       │
│                                                      │
│ 🟡 3 Routed for External Approval                   │
│    ├ 2 at GPT-Oncology (awaiting response)          │
│    └ 1 at TALT-Legal (cross-geography data)         │
│                                                      │
│ 🔴 1 Requires Your Review                           │
│    └ Edge case: Sensitive data + incomplete docs    │
└─────────────────────────────────────────────────────┘

System Metrics (Last 30 Days):
├ Requests processed: 247
├ Auto-approval rate: 68% (↑ from 45% last month)
├ Average approval time: 2.1 days (↓ from 12.5 days)
└ User satisfaction: 4.3/5.0

[View All Requests] [Reports] [Settings]
```

#### Step 2: Review Flagged Request

```
Request Details: Collection "Lung Cancer Multi-Site Study"
Requested by: Sarah Thompson (PRID: P123456)
Requested date: 2025-11-15 14:30

Datasets Requested (5):
├ DCODE-001: NSCLC Clinical (5 datasets across US, EU, Asia sites)
└ DCODE-042: NSCLC Genomics (SolveBio)

🚨 Collectoid flagged for review:
├ ⚠️ Cross-geography data (US + EU + Asia)
├ ⚠️ Legal review recommended for EU sites (GDPR considerations)
└ ℹ️ User training verified: ✓ GCP, ✓ Data Privacy L2

Collectoid Recommendation:
"Approve US and Asia data immediately. Route EU data to TALT-Legal
for GDPR review given cross-border transfer implications."

Your Options:
[✓ Approve with Collectoid Recommendation]
[Approve All Immediately]
[Request More Information from Requester]
[Reject with Reason]
```

#### Step 3: Collectoid Agent Actions

When DCM clicks "Approve with Collectoid Recommendation":
```
✓ Approved: Lung Cancer Multi-Site Study

Collectoid is now executing:
├ ✓ Generating Immuta policy for US & Asia data (complete)
├ ✓ Granting access to Sarah Thompson (complete)
├ ✓ Sending notification to user (complete)
├ ⏳ Routing EU datasets to TALT-Legal for review (in progress)
└ ⏳ Monitoring approval status, will auto-grant upon TALT approval

Sarah will receive:
"Good news! You now have access to 3 of 5 requested datasets.
The remaining 2 are under legal review and will be available
in ~3-5 business days. Track progress on your dashboard."

[View Full Audit Log] [Back to Queue]
```

#### Step 4: Ongoing Monitoring

```
Collection: "Lung Cancer Multi-Site Study"
Status: Partially Approved (60% accessible)

Progress Timeline:
├ ✓ 2025-11-15 14:30 - Request submitted
├ ✓ 2025-11-15 14:45 - Auto-review complete (Collectoid)
├ ✓ 2025-11-15 15:00 - DCM approval (Divya)
├ ✓ 2025-11-15 15:01 - US & Asia access granted
├ ⏳ 2025-11-15 15:02 - EU legal review requested
└ ⏳ 2025-11-18 (est.) - EU access grant (pending TALT)

Access Breakdown:
├ ✅ DCODE-001 (US site): Accessible
├ ✅ DCODE-001 (Asia site): Accessible
├ ⏳ DCODE-001 (EU sites): Pending TALT approval
├ ✅ DCODE-042 (Genomics): Accessible
└ Status: 3/5 datasets accessible (60%)

[Send Update to Requester] [Escalate to TALT] [View Details]
```

---

### Journey 3: Progress Monitoring & Communication (Researcher Perspective)

After submitting a request, researchers need visibility into approval status.

#### Step 1: My Collections Dashboard

```
My Collections

Active Requests (2):
┌──────────────────────────────────────────────────────┐
│ Lung Cancer EGFR Analysis ⏳ 60% Accessible          │
│ Requested: Nov 15, 2025                              │
│                                                       │
│ Progress: ▓▓▓▓▓▓▓░░░ 60%                            │
│                                                       │
│ ├ ✅ 3 datasets: Accessible now [View Data]          │
│ └ ⏳ 2 datasets: Pending approval (est. 2-3 days)    │
│                                                       │
│ [View Details] [Ask Collectoid]                      │
└──────────────────────────────────────────────────────┘

│ Cardiovascular Outcomes Study ✅ 100% Accessible     │
│ Approved: Nov 10, 2025                               │
│ All 8 datasets ready [View Data]                     │
└──────────────────────────────────────────────────────┘

Completed Collections (5): [Show All]
```

#### Step 2: Detailed Progress View

```
Collection: Lung Cancer EGFR Analysis
Overall Status: Partially Approved (3 of 5 datasets accessible)

┌─────────────────────────────────────────────────┐
│ Dataset-Level Status:                            │
│                                                  │
│ ✅ DCODE-001: NSCLC Clinical                    │
│    Access granted Nov 15, 15:00                 │
│    [View Data] [Download]                       │
│                                                  │
│ ⏳ DCODE-001: NSCLC Genomics                    │
│    Status: Pending GPT-Oncology approval        │
│    Estimated: Nov 18 (2 days)                   │
│    Reason: Cross-geography genomic data requires│
│    additional governance review                 │
│    Contact: Dr. Martinez (GPT-Oncology lead)    │
│                                                  │
│ ✅ DCODE-042: NSCLC Biomarker                   │
│    Access granted Nov 15, 15:00                 │
│    [View Data] [Download]                       │
└─────────────────────────────────────────────────┘

💬 Ask Collectoid:
[Why is DCODE-001 Genomics taking longer?]
[Can I expedite this approval?]
[Who do I contact about this request?]
[When will this likely be approved?]
```

#### Step 3: Collectoid Assistance

```
💬 You: Why is DCODE-001 Genomics taking longer?

🤖 Collectoid: The DCODE-001 genomic dataset includes samples from
multiple geographic regions (US, EU, Asia). EU samples require
additional legal review under GDPR regulations for cross-border data
transfer.

Your request has been automatically routed to the TALT-Legal team.
Based on historical data, GDPR reviews typically complete within
2-3 business days.

The US and Asia genomic data has already been approved and is
accessible to you now.

💬 You: Can I expedite this approval?

🤖 Collectoid: I can help escalate if there's an urgent business need.
The current reviewer is Jane Smith (TALT-Legal). Would you like me to:
├ [Send escalation request with justification]
├ [Connect you directly with Jane Smith]
└ [Wait for standard review process]

I should note: The estimated approval date is Nov 18, which is only
2 days away. Escalations are typically reserved for urgent timelines
(e.g., regulatory submissions, time-sensitive analyses).
```

---

### Journey 4: Error Reporting & Metadata Amendment (Quality Feedback Loop)

A critical real-world scenario: users discover incorrect metadata, misleading descriptions, or encounter access errors. They need a clear path to report issues, communicate with data stewards, and track resolution.

#### Scenario Types

**Type A: Incorrect Metadata**
- Dataset description doesn't match actual data content
- Patient counts are wrong
- Study status outdated (shows "Active" but actually closed)
- Missing therapeutic area or data type tags

**Type B: Misleading Information**
- Dataset title suggests different scope than actual content
- Consent type unclear or potentially incorrect
- Missing warnings about data quality issues

**Type C: Access Errors**
- User has access but download fails
- Data appears corrupted or incomplete
- Permissions seem wrong (can view but not download, etc.)

**Type D: Missing Information**
- No contact information for data steward
- Missing documentation or data dictionary
- Unknown collection/processing methodology

---

#### Step 1: User Discovers Issue

**Example: Dr. Chen (Hybrid User) discovers metadata mismatch**

```
Dataset View: DCODE-042 NSCLC Biomarker Study

Metadata:
├ Title: "NSCLC ctDNA Monitoring - Phase III"
├ Description: "Longitudinal ctDNA monitoring in non-small cell
│             lung cancer patients receiving immunotherapy"
├ Patient Count: 1,250 patients
├ Therapeutic Area: Oncology - NSCLC
├ Data Types: Clinical (SDTM), Genomics (NGS variants)
└ Collection Dates: 2021-01-15 to 2023-06-30

[View Data] [Download] [Add to Collection] [⚠️ Report Issue]
```

**Dr. Chen clicks "View Data" and notices**:
- Actual data only contains 890 patients (not 1,250)
- Includes both immunotherapy AND chemotherapy arms (description says immunotherapy only)
- Data extends to 2024-03-15 (metadata says 2023-06-30)

**This could lead to analysis errors if not corrected!**

---

#### Step 2: Initiating Issue Report

**Multiple Entry Points** (user can report from anywhere they encounter the issue):

**Option 1: From Dataset Detail Page**
```
[⚠️ Report Issue] button → dropdown:
├ 🔢 Incorrect metadata
├ 📝 Misleading description
├ 🔒 Access/permission problem
├ 📊 Data quality concern
├ 📖 Missing documentation
└ 💬 Other (describe issue)
```

**Option 2: Via Collectoid Chat**
```
💬 Dr. Chen: "I think the metadata for DCODE-042 is wrong"

🤖 Collectoid: I can help you report that issue. What specific
problem did you notice with DCODE-042: NSCLC Biomarker Study?

[Open Issue Report Form] or describe it here and I'll help you
file a detailed report.
```

---

#### Step 3: Issue Report Form

**Smart Form** (pre-populated where possible):

```
┌────────────────────────────────────────────────────┐
│ Report Issue: DCODE-042 NSCLC Biomarker Study     │
│                                                    │
│ Issue Type: [Incorrect metadata ▼]                │
│                                                    │
│ What's incorrect?                                  │
│ ☑ Patient count (shows 1,250, actually ~890)     │
│ ☑ Date range (shows ends 2023-06, extends to 2024)│
│ ☑ Description (missing chemotherapy arm mention)  │
│ ☐ Study status                                     │
│ ☐ Therapeutic area                                │
│ ☐ Data types available                            │
│ ☑ Other (specify below)                           │
│                                                    │
│ Detailed Description:                              │
│ ┌────────────────────────────────────────────┐   │
│ │ The dataset description states this is      │   │
│ │ "immunotherapy only" but the actual data    │   │
│ │ includes both treatment arms. Also patient  │   │
│ │ counts and collection end date don't match. │   │
│ │                                              │   │
│ │ This could lead to analysis errors if       │   │
│ │ researchers assume immunotherapy-only cohort│   │
│ └────────────────────────────────────────────┘   │
│                                                    │
│ Impact on your work:                               │
│ ( ) Blocking - can't proceed                      │
│ (•) High - affects analysis accuracy               │
│ ( ) Medium - needs clarification                  │
│ ( ) Low - minor documentation issue               │
│                                                    │
│ Attachments: (optional)                           │
│ [📎 Upload screenshot or data sample]            │
│                                                    │
│ ✓ Notify me via email when updated                │
│ ✓ Allow data steward to contact me for details   │
│                                                    │
│ [Submit Issue Report] [Ask Collectoid for Help]  │
└────────────────────────────────────────────────────┘
```

**AI-Assisted Form Completion**:
```
🤖 Collectoid: I noticed you've selected "Incorrect metadata."
Would you like me to automatically run a quick validation check
on this dataset's metadata against the actual data content?

This might help provide specific details for the data steward.

[Yes, run validation] [No, I'll describe it manually]
```

---

#### Step 4: ServiceNow Ticket Creation & Routing

**After submission**:

```
✓ Issue Report Submitted

Your report has been created:
├ Issue ID: SNOW-INC-47821
├ Dataset: DCODE-042 NSCLC Biomarker Study
├ Type: Metadata Accuracy
├ Priority: High (affects analysis accuracy)
└ Status: Assigned to Data Steward

What happens next:
1. Your report has been routed to the dataset's Data Steward:
   Dr. Sarah Johnson (PRID: P789012)

2. A ServiceNow ticket (INC-47821) has been created for tracking

3. Collectoid will monitor this issue and keep you updated

4. Expected response time: 2-3 business days for High priority

Track this issue:
[View in ServiceNow] [View in My Issues Dashboard] [Ask Collectoid]

You'll receive email notifications when:
├ Data steward responds or requests more information
├ Metadata is updated
└ Issue is resolved
```

**Behind the Scenes** (Collectoid Agent Actions):
1. ✓ Creates ServiceNow incident with detailed context
2. ✓ Identifies dataset owner from metadata registry
3. ✓ Routes to appropriate data steward based on therapeutic area
4. ✓ Attaches system-generated validation report (if user opted in)
5. ✓ Sets priority based on user's impact selection
6. ✓ Subscribes user to ticket notifications
7. ✓ Adds ticket to user's issues dashboard

---

#### Step 5: Data Steward Notification

**Email to Dr. Sarah Johnson (Data Steward)**:

```
Subject: [URGENT] Metadata Accuracy Issue Reported - DCODE-042

A researcher has reported metadata inconsistencies in your dataset:

Dataset: DCODE-042 NSCLC Biomarker Study
Reported by: Dr. Amy Chen (PRID: P456789)
Issue Type: Incorrect Metadata
Priority: High - Affects Analysis Accuracy

Key Issues Reported:
- Patient count mismatch (1,250 listed vs ~890 actual)
- Date range incorrect (ends 2023-06 vs actual 2024-03)
- Description missing chemotherapy arm information

View full report and respond: [View in ServiceNow: INC-47821]
Or respond via Data Stewardship Portal: [Respond Now]

This issue requires your attention within 2-3 business days.
```

---

#### Step 6: My Issues Dashboard (User Perspective)

**New Dashboard Section**:

```
My Collections Dashboard

[My Collections] [My Issues] [Activity History]

═══════════════════════════════════════════════════
My Reported Issues (1 Active, 3 Resolved)

Active Issues:
┌──────────────────────────────────────────────────┐
│ ⚠️ DCODE-042: Metadata Accuracy                 │
│ SNOW-INC-47821 | Reported: Nov 16, 2025          │
│                                                   │
│ Status: 🟡 Awaiting Steward Response             │
│                                                   │
│ Progress: ▓▓░░░░░░░░ 20%                        │
│                                                   │
│ Timeline:                                         │
│ ├ ✓ Nov 16, 10:30 - Report submitted             │
│ ├ ✓ Nov 16, 10:31 - Routed to Data Steward       │
│ ├ ✓ Nov 16, 10:35 - Steward acknowledged (email) │
│ └ ⏳ Nov 18 (est.) - Metadata correction planned │
│                                                   │
│ Data Steward: Dr. Sarah Johnson                  │
│ Expected Resolution: Nov 19, 2025                │
│                                                   │
│ [View Details] [Add Comment] [Ask Collectoid]    │
└──────────────────────────────────────────────────┘

Recently Resolved (Last 30 Days):
┌──────────────────────────────────────────────────┐
│ ✅ DCODE-088: Missing Data Dictionary            │
│ SNOW-INC-47102 | Resolved: Nov 12, 2025          │
│ Resolution: Data dictionary uploaded to S3       │
│ [View Resolution]                                 │
└──────────────────────────────────────────────────┘
```

---

#### Step 7: Steward Response & User Communication

**In-App Notification**:

```
🔔 New Update on Your Issue: DCODE-042 Metadata Accuracy

Dr. Sarah Johnson (Data Steward) responded:

"Thank you for reporting this! You're absolutely right - the
metadata hasn't been updated since the study was extended in
2023. The study now includes both treatment arms and additional
patients.

I'm updating the metadata today and will have it reflected in
the system by EOD Nov 17. I've also flagged this for our data
quality audit process.

Would you be willing to review the updated metadata once it's
live to confirm accuracy?"

[View Full Response] [Reply to Steward] [Mark as Resolved]
```

**Via Collectoid Chat** (proactive notification):

```
🤖 Collectoid: Good news! The data steward for DCODE-042 has
responded to your metadata issue report.

She's confirmed the metadata is outdated and will update it by
end of day tomorrow (Nov 17). She's also asked if you'd be willing
to review the corrections.

Would you like to:
├ [View her full response]
├ [Reply to confirm you'll review]
├ [Set a reminder to check on Nov 17]
└ [See issue details]
```

---

#### Step 8: Issue Resolution & Verification

**After Steward Updates Metadata**:

```
🔔 Issue Resolved: DCODE-042 Metadata Updated

Your reported issue has been resolved!

Changes Made:
✓ Patient count updated: 890 patients (was 1,250)
✓ Collection end date: 2024-03-15 (was 2023-06-30)
✓ Description updated to include both treatment arms
✓ Added note about study extension in 2023

View updated metadata: [View Dataset]

The data steward requested your review. Can you confirm these
corrections are accurate?

[✓ Looks Good] [Still Issues] [Add Comment]

ServiceNow Ticket: INC-47821 [View in ServiceNow]
Resolved by: Dr. Sarah Johnson
Resolution Date: Nov 17, 2025, 16:45
```

**User Confirmation Flow**:

```
💬 Dr. Chen clicks [✓ Looks Good]

┌────────────────────────────────────────────────┐
│ Confirm Issue Resolution                       │
│                                                 │
│ Thank you for verifying the corrections!       │
│                                                 │
│ This will:                                      │
│ ├ Close ServiceNow ticket INC-47821            │
│ ├ Notify the data steward                      │
│ └ Move to your "Resolved Issues" archive       │
│                                                 │
│ Optional: Rate this resolution                 │
│ How satisfied are you with how this issue was  │
│ handled?                                        │
│                                                 │
│ ⭐⭐⭐⭐⭐ Very Satisfied                        │
│                                                 │
│ Additional feedback (optional):                │
│ ┌─────────────────────────────────────────┐   │
│ │ Fast response and clear communication.   │   │
│ │ Appreciate the data steward's diligence. │   │
│ └─────────────────────────────────────────┘   │
│                                                 │
│ [Submit & Close Issue] [Cancel]                │
└────────────────────────────────────────────────┘
```

---

#### Step 9: Escalation Path (If Issue Not Resolved)

**If user indicates "Still Issues" or no response after expected resolution time**:

```
🤖 Collectoid: I see the expected resolution date has passed
(Nov 19) and the issue hasn't been resolved yet.

Would you like me to:
├ [Escalate to Data Governance Team]
│  → Routes to data quality escalation queue
│
├ [Contact Data Steward's Manager]
│  → Escalates to Dr. Johnson's reporting manager
│
├ [Request Alternative Dataset]
│  → I'll help you find similar datasets with accurate metadata
│
└ [Extend Expected Resolution Date]
   → Give the steward more time (please specify reason)

Your issue priority can be elevated from "High" to "Critical"
if this is blocking your work.
```

---

#### Alternative Scenarios

**Scenario B: Quick Question (Not a Formal Issue)**

```
Dataset: DCODE-042

💬 Dr. Chen: "Why does this show 1,250 patients but the data
              dictionary says 890?"

🤖 Collectoid: Good question! Let me check the metadata history
for this dataset...

I found that the metadata shows 1,250 patients, but looking at
the actual data and recent updates, it appears this metadata
may be outdated.

Would you like to:
├ [Contact Data Steward Directly]
│  → Quick question to Dr. Sarah Johnson
│
├ [Report as Metadata Error]
│  → Creates formal ServiceNow ticket
│
└ [Check Data Dictionary]
   → The data dictionary might have the correct count

For informal questions, I recommend contacting the data steward
directly. For issues affecting data quality or analysis, please
file a formal report.
```

**Scenario C: Access Error**

```
Error: Unable to download DCODE-042 Clinical Data

📛 Access Denied: Immuta policy check failed

Your user profile (PRID: P456789) has read access to this dataset
but the download operation was blocked by Immuta policy:
"Export-Clinical-Data-Restricted"

💬 User clicks [Report Issue]

🤖 Collectoid: This looks like a permissions configuration issue
rather than a metadata problem. Let me help:

I can see you have "View" access but not "Export" permissions for
this dataset. This is typically due to data residency or export
control policies.

Would you like to:
├ [Request Export Permission]
│  → Creates approval request (may need additional justification)
│
├ [Work with Data In-Platform]
│  → I can show you how to analyze without downloading
│
└ [Report as Technical Issue]
   → If you believe this is an error, file ServiceNow ticket

Which would you prefer?
```

---

#### DCM View: Issue Management Dashboard

**For Divya (Data Collection Manager)**

```
DCM Portal: Issue Management

[Approval Queue] [Issue Reports] [System Health] [Analytics]

═══════════════════════════════════════════════════
Open Data Issues (12 Active)

By Priority:
├ 🔴 Critical (2): Blocking user work
├ 🟡 High (5): Affects analysis accuracy
├ 🟢 Medium (3): Needs clarification
└ ⚪ Low (2): Minor documentation

By Type:
├ Incorrect Metadata (5)
├ Misleading Description (2)
├ Access Errors (3)
├ Missing Documentation (2)

Aging Report:
├ ⚠️ 3 issues past expected resolution date
├ 5 issues within expected timeframe
└ 4 issues recently opened (<24hrs)

[View All Issues] [Export Report] [Escalate Aged Issues]

═══════════════════════════════════════════════════
Issue Trends (Last 30 Days)

Issues Opened: 47
Issues Resolved: 43
Average Resolution Time: 3.2 days (target: 3 days)
User Satisfaction: 4.2/5.0

Most Common Issues:
1. Outdated patient counts (12 reports)
2. Missing data dictionaries (8 reports)
3. Incorrect collection dates (7 reports)

[View Detailed Analytics] [Generate Report]
```

---

## Integration Specification: ServiceNow

> **⚠️ OUTSTANDING TASK**: Confirm ServiceNow integration approach and ticket routing logic.

**Integration Points**:

1. **Ticket Creation**:
   - API: ServiceNow Incident Management API
   - Required Fields: Short Description, Description, Caller (PRID), Category, Priority, Assignment Group
   - Auto-populated: Dataset ID, Issue Type, User Contact Info

2. **Ticket Routing Logic**:
```
IF issue_type == "Metadata Error" OR "Misleading Description":
    assignment_group = "Data Stewards - [Therapeutic Area]"
    contact_person = dataset.owner OR dataset.steward
ELIF issue_type == "Access Error":
    assignment_group = "Data Governance - Access Control"
    contact_person = DCM assigned to therapeutic area
ELIF issue_type == "Technical Error" (download/platform issues):
    assignment_group = "R&D IT - Data Platform Support"
    priority = "High" (if blocking)
ELSE:
    assignment_group = "Data Quality Team"
```

3. **Status Synchronization**:
   - ServiceNow → Platform: Poll ServiceNow API every 15 minutes for ticket updates
   - Platform → ServiceNow: Push user comments/replies to ticket
   - Real-time notifications: ServiceNow webhook integration for status changes

4. **User Experience Bridging**:
   - Users can view/interact with issues in-platform (preferred)
   - "View in ServiceNow" link opens external ticket for power users
   - Email notifications include both platform and ServiceNow links

---

## UX Considerations for Issue Reporting

### Lowering the Barrier to Report

**Key Principle**: Make it trivially easy to report issues, or users won't bother.

**Implementation**:
- "Report Issue" button visible on every dataset card and detail page
- Keyboard shortcut: User selects text on screen + presses Ctrl+Shift+R = auto-populates issue with selected text
- Chat-based reporting: "Hey Collectoid, something's wrong with DCODE-042" triggers guided report
- Screenshot attachment supported: Users can paste screenshots directly into form

### Transparency & Communication

**Users Need to Know**:
- Who is responsible for fixing this?
- When can I expect a resolution?
- What's the current status?
- Can I help expedite this?

**Implementation**:
- Show data steward name/contact on every issue
- Clear expected resolution timeline based on priority
- Real-time status updates (not just email after the fact)
- Ability to add comments/provide additional context

### Feedback Loop Closure

**Critical**: Tell users what happened after they report issues!

**Implementation**:
- Require steward to explain what was fixed (not just "resolved")
- Ask user to verify the fix before auto-closing
- Show impact: "Your report improved data quality for 47 other users who access this dataset"
- Reward reporting: Track user's contributions to data quality in their profile

---

## POC Implementation for Issue Reporting

**Mock Data Needed**:
- 5-10 sample datasets with intentional metadata "errors" for demo
- Pre-created issue tickets at various stages (new, in-progress, resolved)
- Sample steward responses and resolutions
- ServiceNow ticket IDs and status mock data

**User Flows to Demonstrate**:
1. Sarah (novice) discovers confusing metadata, reports via chat
2. Marcus (power user) finds access error, reports via quick form, tracks in dashboard
3. Dr. Chen discovers data quality issue, reports, steward responds, verifies fix
4. Divya (DCM) reviews issue trends and escalates aged items

**Simulated Integrations**:
- Mock ServiceNow ticket creation (show ticket ID, simulate status changes over time)
- Mock email notifications (show in UI notification center)
- Mock data steward responses (timed delays to simulate real interaction)

---

## UX Concept Exploration

> **POC Approach**: Develop 2-3 distinct UX concepts for data discovery and request flows. Present to stakeholders for feedback and preference validation.

### Concept A: Chat-First with Browse Fallback

**Primary Interface**: Conversational AI assistant
**Secondary Interface**: Browse mode accessible via sidebar toggle

**Philosophy**: Default to guided experience, allow power users to "escape" to browse

**Pros**:
- Lowers barrier to entry for novice users
- Showcases agentic AI capabilities prominently
- Natural language reduces need to understand terminology

**Cons**:
- May frustrate power users who want immediate control
- Chat interactions slower than direct filtering
- Requires robust NLP and context management

**Best For**: Organizations prioritizing ease of use and broad adoption

---

### Concept B: Browse-First with AI Augmentation

**Primary Interface**: Traditional catalog with filters/search
**Secondary Interface**: AI assistant available as sidebar/panel

**Philosophy**: Give users control, offer AI help when needed

**Pros**:
- Familiar paradigm for experienced users
- Fast, efficient for users who know what they want
- AI assistance available without forcing it

**Cons**:
- May overwhelm novice users with options
- AI capabilities less discoverable
- Requires well-structured metadata and faceted search

**Best For**: Organizations with experienced user base

---

### Concept C: Adaptive / Unified

**Primary Interface**: Unified search bar + smart categorization
**Adaptation Logic**: Learns from user behavior

**Philosophy**: One interface that adapts to user skill level

**Example Behavior**:
- New user types "lung cancer data" → triggers guided chat flow
- Power user types "therapeutic_area:oncology AND phase:III" → instant filtered results
- System learns: user frequently uses advanced search → stops triggering chat

**Pros**:
- No forced mode selection
- Graceful accommodation of all skill levels
- Modern, Google-like paradigm

**Cons**:
- Complex to implement well
- Adaptation logic may feel unpredictable
- Requires significant instrumentation and tuning

**Best For**: Forward-thinking organizations willing to invest in sophisticated UX

---

### Concept D: Persona-Explicit Selection

**Landing Experience**: Explicitly ask user to select persona
**Persistent Choice**: Remember preference, allow switching

**Example**:
```
Welcome! Which best describes you?

├ 🎓 I'm new to requesting clinical data
│   (Guide me through the process step-by-step)
│
├ 🔬 I'm an experienced researcher
│   (I want fast, direct access to the catalog)
│
└ 👥 I manage data collections (DCM)
    (Take me to the admin portal)
```

**Pros**:
- Tailored experience from the start
- Clear communication of available modes
- Easy to implement distinct flows

**Cons**:
- Adds friction at entry
- Users may not self-identify accurately
- Harder to support "in-between" users

**Best For**: POC/prototype phase to clearly demonstrate different experiences

---

> **POC Deliverable**: Implement Concept D (Persona-Explicit) with working prototypes of novice (chat) and power user (browse) flows. Use this to gather stakeholder feedback on interaction preferences and inform production design direction.

---

## Technical Implementation: Next.js Prototype

### Technology Stack

**Frontend**:
- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/ui or custom AZ design system
- **State Management**: React Context + hooks / Zustand
- **Data Visualization**: Recharts for dashboards
- **Chat UI**: Custom or react-chatbot-kit

**Backend** (Mock/Simulation):
- **API Routes**: Next.js API routes for mock integrations
- **Data Storage**: JSON files or in-memory for demo data
- **Auth Simulation**: Simple session-based mock auth with persona switching
- **Agent Simulation**: Timed delays + state transitions to simulate agentic processing

### Development Approach: Persona-Driven Building Blocks

**Phase 1: Novice Researcher (Sarah) - Simplest Persona**
- Chat interface
- Basic dataset cards
- Simple request flow
- Status dashboard

**Phase 2: Power User (Marcus) - Add Browse Capability**
- Reuse dataset cards from Phase 1
- Add filters/search interface
- Add multi-select and bulk actions
- Demonstrate faster workflow

**Phase 3: Hybrid User (Dr. Chen) - Combine Modes**
- Add AI suggestion panel to browse interface
- Cross-link between chat and browse
- Demonstrate intelligent recommendations

**Phase 4: DCM (Divya) - Data Curation Workbench** (PRIMARY FOCUS)
- **AI-Assisted Category Suggestion**:
  - Intent text input field
  - Keyword extraction simulation
  - 30+ data category taxonomy display with study counts
  - Category selection interface (multi-select from suggestions)
- **Multi-Dimensional Dynamic Filtering**:
  - Data categories filter (from 30+ taxonomy)
  - Study characteristics filter (TA, phase, status, geography)
  - Collection context filter (crossover count, usage patterns)
  - Access criteria filter (policies, training, legal restrictions)
  - Live result count updates as filters applied
- **DCM-Specific Dataset Views**:
  - Collection crossover indicators ("In 3 collections")
  - Usage analytics per dataset ("87 active users")
  - Access eligibility breakdown per dataset
  - Data category availability indicators
- **Progressive Refinement Workspace**:
  - Dataset multi-select with cart
  - Real-time access matrix visualization
  - Smart bundling suggestions ("Frequently bundled with...")
  - Iterative add/remove with updated access matrix
- **Activities/Intents Selection Interface**:
  - Data Engineering checkboxes (ETL/standardization, variant harmonization)
  - Scientific Analysis options (early response classifier, multimodal fusion, cohort builder)
- **Access Provisioning Breakdown Visualization**:
  - 20/30/40/10 breakdown with progress bars
  - Charts and detailed explanations per category
  - Collectoid automation actions display
- **User Assignment Interface**:
  - Org-based selection (Workday mock)
  - Role-based selection
  - Individual PRID input
- **Admin Dashboard**:
  - Approval queue
  - Collectoid agent activity log
  - Issue management dashboard
- Use dataset/collection models from Phases 1-3

### Mock Data Requirements

**Sample Datasets** (~30-50 mock datasets):
- Therapeutic areas: Oncology, Cardiovascular, Immunology
- Data types: Clinical (SDTM, ADaM), Genomics, Imaging
- Studies: Mix of active/closed, different phases
- Realistic metadata: titles, descriptions, patient counts, dates
- Access status indicators for demo users
- **NEW - Data Category Tags**: Each dataset tagged with specific categories from 30+ taxonomy
  - Example: DCODE-042 has [SDTM: Demographics, Exposure, Tumor/Response, Biomarker/Labs] + [RAW: ctDNA Measures, Specimen Metadata] + [Omics/NGS: Variants, Global Scores]
- **NEW - Collection Crossover Data**: Track which datasets appear in which collections
  - Example: DCODE-042 in ["Oncology ctDNA Biomarker Collection", "Lung Cancer Phase III Studies", "Immunotherapy Response Collection"]
- **NEW - Usage Analytics**: User count and organization data per dataset
  - Example: DCODE-042 accessed by 87 users across 5 organizations
- **NEW - Access Provisioning Metadata**: Per dataset, track:
  - Study status (active/closed), DB lock date
  - Legal restrictions (GDPR, cross-geography)
  - Required training (GCP, Data Privacy L2)
  - Data location status (catalogued/missing)

**Sample Users** (4-5 personas + variations):
- Sarah (novice), Marcus (power), Dr. Chen (hybrid), Divya (DCM)
- Different access permissions per user
- Training/clearance status
- **NEW - Organization membership** (for 90/10 matching simulation)
- **NEW - Training completion status** with specific courses

**Sample Collections**:
- Pre-created collections at various stages (pending, approved, rejected)
- Mix of single-user and multi-user collections
- **NEW - Collection metadata**: Purpose, target user community, creation date, creator
- **NEW - Access provisioning breakdown** per collection (20/30/40/10 percentages)

**Data Category Taxonomy Master List** (for DCM interface):
- All 30+ categories with:
  - Category name and description
  - Parent domain (SDTM, ADaM, RAW, DICOM, Omics/NGS, etc.)
  - Study count (how many studies have this category)
  - Key variables list
- Used for AI-assisted category suggestion and filtering

**Keyword → Category Mapping** (for AI simulation):
- "Oncology" → [TA: ONC, IMMUNONC]
- "ctDNA" → [RAW: ctDNA Measures, Omics/NGS: Variants]
- "biomarkers" → [SDTM: Biomarker/Labs, ADaM: ADBM]
- "immunotherapy" → [SDTM: Exposure, ADaM: ADEFF]
- etc.

### Managing Multiple UI Concepts

**Approach**: URL-based concept switching

```
/app/concept-a/...  (Chat-first concept)
/app/concept-b/...  (Browse-first concept)
/app/concept-c/...  (Adaptive concept)
/app/concept-d/...  (Persona-explicit concept - PRIMARY for POC)
```

**Shared Components**:
```
/components/
  ├ DatasetCard.tsx (reused across concepts)
  ├ CollectionSummary.tsx
  ├ AccessStatusBadge.tsx
  ├ FilterPanel.tsx
  ├ ChatInterface.tsx
  └ ...
```

**Demo Control Panel**:
```
Floating widget in POC:
├ Switch User: [Sarah ▼] [Marcus] [Dr. Chen] [Divya]
├ Switch Concept: [A] [B] [C] [D]
├ Reset Demo Data
└ Auto-Play Demo
```

### Deployment

- **Hosting**: Vercel (free tier, instant deployments)
- **Access**: Share URL with stakeholders
- **Demo Mode**: "Guided tour" option for stakeholders unfamiliar with interface
- **Feedback Collection**: Embedded form for stakeholder comments

---

## Success Metrics & KPIs

### Quantitative Goals

1. **Concept Validation**:
   - Stakeholder preference voting (which concept resonated most)
   - Task completion time comparison (novice vs power user flows)

2. **Agentic Value Demonstration**:
   - Simulated approval time: <3 days (vs 14 days baseline)
   - Auto-approval rate: >60% of requests
   - Manual DCM effort: <5 min per request (vs 30+ min baseline)

3. **90/10 Instant Access**:
   - Demonstrate 90% of subsequent users gaining instant access
   - Time to access for "instant access" users: <1 hour

4. **User Satisfaction** (Post-demo surveys):
   - Ease of use: >4.0/5.0
   - Confidence in requesting correct data: >4.0/5.0
   - Preference over iDAP: >80% of respondents

### Qualitative Success Indicators

1. **Stakeholder Engagement**:
   - Positive feedback from leadership (Stacy, Rafa)
   - Enthusiasm for different persona experiences
   - Requests to expand scope or add features

2. **Paradigm Shift Recognition**:
   - Stakeholders articulate the value of persona-driven UX
   - Recognition that agentic AI enables new interaction models
   - Understanding of 90/10 instant access potential

3. **Resource Commitment**:
   - Approval for 2+ developer FTEs in 2026
   - Budget allocation for production infrastructure
   - Timeline commitment for iDAP migration

---

## Timeline & Milestones

### Target Completion: December 2025

**Phase 1: Design & Foundation (Weeks 1-2)**
- ✅ Requirements documentation (this document)
- [ ] UI mockups for key screens (novice, power, DCM views)
- [ ] Mock data structure design and creation
- [ ] Next.js project setup with component library

**Phase 2: Persona 1 - Novice Researcher (Weeks 3-4)**
- [ ] Chat interface implementation
- [ ] Dataset browsing cards
- [ ] Simple request flow (chat-guided)
- [ ] My Collections dashboard (basic)

**Phase 3: Persona 2 - Power User (Weeks 5-6)**
- [ ] Browse interface with filters
- [ ] Advanced search
- [ ] Bulk selection and cart
- [ ] Fast-path request flow

**Phase 4: Persona 3 - Hybrid User (Week 7)**
- [ ] AI recommendation panel in browse interface
- [ ] Cross-mode navigation (browse ↔ chat)
- [ ] Intelligent suggestions (RAG-simulated)

**Phase 5: Persona 4 - DCM Data Curation Workbench (PRIMARY - Weeks 8-9)**
- [ ] **Intent-Based Discovery Interface**
  - Intent text input field
  - Keyword extraction simulation
  - AI-powered category suggestions from 30+ taxonomy
- [ ] **Data Category Taxonomy Display**
  - Expandable tree structure (SDTM, ADaM, RAW, DICOM, Omics/NGS)
  - Study count per category
  - Multi-select category interface
- [ ] **Multi-Dimensional Filtering**
  - Data categories filter panel
  - Study characteristics filters (TA, phase, status, geography)
  - Collection context filters (crossover, usage patterns)
  - Access criteria filters
  - Live result count updates
- [ ] **DCM-Specific Dataset Views**
  - Collection crossover indicators
  - Usage analytics display
  - Access eligibility breakdown per dataset
  - Data category availability tags
- [ ] **Progressive Refinement Workspace**
  - Multi-select with cart
  - Real-time access matrix visualization
  - Smart bundling suggestions
  - Iterative add/remove with matrix updates
- [ ] **Activities/Intents Selection Interface**
  - Data Engineering checkboxes
  - Scientific Analysis options
- [ ] **Access Provisioning Breakdown Visualization**
  - 20/30/40/10 breakdown with progress bars
  - Charts and detailed explanations
  - Collectoid automation display
- [ ] **User Assignment Interface**
  - Org-based, role-based, individual PRID
- [ ] **Admin Dashboard**
  - Approval queue
  - Collectoid agent activity simulation
  - Issue management dashboard
  - Metrics and reporting

**Phase 6: Cross-Cutting Features & Polish (Week 10)**
- [ ] Error reporting & issue tracking (Journey 4)
  - Report Issue button/flow
  - My Issues dashboard
  - Mock ServiceNow integration
  - Collectoid assistance for issue queries
- [ ] Refine all flows
- [ ] Add concept variations (if time permits)
- [ ] Demo mode and guided tour
- [ ] Responsive design pass

**Phase 7: Stakeholder Demo & Feedback (Weeks 11-12)**
- [ ] Internal demo with Divya and team
- [ ] Stakeholder demo with leadership
- [ ] Gather feedback and iterate
- [ ] Prepare final documentation

### Key Milestones

| Week | Milestone | Deliverable |
|------|-----------|-------------|
| 2 | Foundation Complete | Designs + mock data + project scaffold |
| 4 | Novice Flow Complete | Working chat-guided request flow |
| 6 | Power User Flow Complete | Working browse-based request flow |
| 7 | Hybrid Flow Complete | AI-augmented browse experience |
| 9 | DCM Workbench Complete | Full DCM Data Curation Workbench (PRIMARY) |
| 10 | POC Ready | Polished, demo-ready prototype with all personas |
| 12 | Final Delivery | Stakeholder feedback incorporated |

---

## Outstanding Tasks & Questions

> The following items require additional information from stakeholders to be fully specified. These are documented for future clarification and will be addressed iteratively.

### 1. Comprehensive Data Collection Definition

**Status**: Working hypothesis documented in "Core Concepts" section
**Needed**: Formal definition from stakeholders covering:
- Exact purpose and lifecycle of collections
- Relationship to Immuta policies (implementation details)
- Approval workflow specifics (who approves what, when)
- Collection expiration/renewal policies
- Multi-user collection scenarios

**Impact**: Currently designing with logical assumptions; may need UX adjustments once formalized

---

### 2. 90/10 Instant Access Implementation

**Status**: High-level concept understood
**Needed**: Technical implementation details:
- User attribute matching criteria (SSO groups, attributes, complex rules?)
- Who defines matching templates (DCM, system, hybrid?)
- How to handle edge cases (partial matches, evolving criteria)
- Immuta policy generation approach for instant access
- Audit and compliance considerations

**Impact**: Currently simulated; production approach will inform backend architecture

---

### 3. Approval Process Workflows

**Status**: General understanding from Divya's chat
**Needed**: Formal documentation of:
- All approval authorities (GPT, TALT, others?) and their decision criteria
- Approval routing decision tree/logic
- SLAs for each approval type
- Escalation paths
- Manual override capabilities for DCMs

**Impact**: Currently using simplified approval flow; may need additional states/transitions

---

### 4. Training & Compliance Requirements

**Status**: Mentioned in stakeholder discussions
**Needed**: Formal mapping of:
- Required training courses per data type / therapeutic area
- Training database integration approach
- How to handle expired training
- Grace periods or grandfathering policies

**Impact**: Currently showing as binary "training complete" flag; may need more nuanced handling

---

### 5. Metadata Extraction & Quality

**Status**: Ongoing organizational effort mentioned
**Needed**: Understanding of:
- Current metadata coverage percentage
- Expected timeline for full extraction
- Metadata schema/standards used
- How to handle incomplete/missing metadata in UI

**Impact**: Currently assuming full metadata availability; may need "partial metadata" states

---

### 6. Integration Specifications

**Status**: High-level understanding of systems (Immuta, S3, SolveBio, etc.)
**Needed**: For production phase:
- API documentation for each system
- Authentication/authorization approaches
- Data residency and compliance constraints
- Rate limits, quotas, performance considerations

**Impact**: POC uses mocked integrations; production architecture decisions deferred

---

### 7. Project Catapult & Other Agentic Systems

**Status**: Mentioned as related initiatives
**Needed**: Clarification on:
- Catapult's exact scope and capabilities
- Whether to integrate with Catapult or build separate chat interface
- Sherpa, Sherlock, Prism roles and integration points
- Governance of agentic system interactions

**Impact**: Currently agnostic to chat provider; may affect UI/integration approach

---

## Dependencies, Assumptions & Risks

### Dependencies

1. **Stakeholder Availability**
   - **Need**: Timely feedback, demo scheduling with busy leadership
   - **Mitigation**: Build in buffer, async demo options, pre-recorded walkthrough

2. **Mock Data**
   - **Need**: Realistic sample datasets, user attributes, study metadata
   - **Mitigation**: Work with Divya to extract sanitized samples from production systems

3. **Outstanding Questions** (see above section)
   - **Need**: Answers to outstanding tasks for high-fidelity prototyping
   - **Mitigation**: Design with assumptions, document for iteration, build flexibility into prototype

### Assumptions

1. **Immuta as Access Control Platform**: Assumed to be the production solution
2. **Metadata Availability**: Assuming sufficient metadata extraction by POC demo time
3. **SSO/User Attributes**: Assuming Workday + SSO provide needed user attributes
4. **Agentic AI Feasibility**: Assuming proposed agent capabilities are technically achievable (validation deferred to production phase)
5. **Stakeholder Alignment**: Assuming multiple concepts approach will be well-received

### Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Scope creep from evolving requirements | High | Medium | Lock POC scope, track new requests as Phase 2 |
| Competing priorities (BAU, hackathon) | Medium | Medium | Block dedicated time, communicate priorities |
| Stakeholder concept preference uncertainty | Medium | Low | Present multiple concepts, gather feedback, iterate |
| Outstanding questions block progress | Medium | Medium | Design with assumptions, document for later refinement |
| Demo scheduling challenges | Medium | High | Schedule early, offer multiple slots, have pre-recorded backup |
| Resource approval denial despite success | Low | High | Ensure clear business value articulation, tie to strategic priorities |

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
- **ServiceNow**: IT service management platform used for ticketing, incident tracking, and issue resolution
- **Data Steward**: Individual responsible for maintaining quality and accuracy of specific datasets
- **AiBench**: Legacy system for managing AWS data lake access (researchers may need to request AiBench access for certain datasets)
- **Collection Crossover**: Datasets that appear in multiple collections (DCM-specific concern for curation)

### Technical Terms

- **Agentic AI**: Autonomous AI systems that can take actions and make decisions toward goals
- **Next.js**: React-based web application framework
- **Immuta Policy**: Rule-based access control configuration
- **S3**: Amazon Simple Storage Service (cloud object storage)

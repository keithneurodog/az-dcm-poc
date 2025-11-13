# DCM Workflow Critical Learnings
## From Screenshot Analysis - Nov 11, 2025

## CRITICAL: What Was Missing from Chat Export

### 1. Complete Data Category Taxonomy (30+ categories)

Divya shared a detailed **crosswalk table** with 3 columns:
- **Source/Domain** (SDTM, ADaM, RAW, DICOM, Omics/NGS, Privacy-Preserving, Model-Ready)
- **Key Variables** (specific fields like AGE, SEX, CHROM, POS, etc.)
- **Purpose/Use** (what each category is used for)

**Key categories include**:
- SDTM: Study/Subject, Timing, Demographics, Exposure, Tumor/Response, Biomarker/Labs, Con-Meds, Adverse Events, Specimen/Procedures
- ADaM: ADSL, ADRS/ADEFF, ADTTE, ADBM/ADLB, ADEXP
- RAW: Specimen Metadata, Processing/QC, Assay Metadata, ctDNA Measures
- DICOM: IDs/Timing, Acquisition Params, Quantitative Outputs
- Omics/NGS: Sample/Provenance, Pipeline Meta, Variants, CN/SVs, Global Scores, Clonal Dynamics, QC
- Privacy-Preserving Aggregation, Model-Ready Features

**Divya's note**: "each category could link it to no of studies that qualify each category -- and I can add it to 'my collection'"

### 2. AI-Assisted Category Suggestion

**Divya explicitly said**: "So from that text (imaging it's being typed in a chatbot) -- we fetch keywords. Oncology --> TA = ONC and IMMUNONC and suggestion could be like this (I used chatGPT 😊)"

**Workflow**:
1. DCM enters/pastes intent text
2. System extracts keywords (e.g., "Oncology" → TA = ONC and IMMUNONC)
3. System **suggests relevant data categories**
4. DCM accepts/modifies suggestions

### 3. Activities/Intents Selection (After Category Selection)

"Then I add them to my collection and next I will be asked to confirm the 'activities' or 'intents'"

**Data engineering** (check all that apply):
- ETL/standardization: date unification, unit harmonization (VAF %, copies/mL), HGVS normalization, panel coverage mapping, LoD/LoQ capture, QC flag propagation
- Variant harmonization: left-align/normalize, canonical transcript selection, COSMIC/ClinVar annotation, deduplication

**Scientific Analysis - Secondary use of patient level data**:
- Early response classifier (baseline ctDNA, % drop by Week 4, max VAF, using AI/ML)
- Multimodal fusion (ctDNA + PET MTV/TLG + clinical covariates)
- Cohort builder (filters for cancer type/subtype, stage, line, regimen class, panel version)

### 4. Access Provisioning Breakdown (Better Formatted)

After collection created with datasets + users:

**20% Already Open** (for 50% of users)
- No action needed

**30% Ready to Grant**
- Study closed, DB lock >6 months, no legal restrictions
- DCM clicks confirmation → updates Immuta policy (metadata updates) → instant access to 90% of users

**40% Blocked, Needs Approval**
- DCM auto-creates authorization → sent to GPTs or TALT → they approve → write Immuta policy → to 90% of users

**10% Missing Data Location**
- Initiate find matching data assets, catalogue action / manual work

**10% of Users Haven't Completed Training**
- As soon as they complete trainings they qualify for anything unlocked above

**"charts and bar diagrams to track progress"**

---

## DCM Workflow = Data Curation Workbench

### NOT Just Simple Browse/Select

DCMs need **multi-dimensional dynamic search & refinement**:

### Dimension 1: Data Categories (30+ from taxonomy)
- Expandable tree structure
- Each shows: variables, purpose, **# studies that have it**
- Multi-select

### Dimension 2: Study Characteristics
- Therapeutic area, phase, status, geography

### Dimension 3: Collection Context (DCM-specific)
- Collection crossover (in how many collections?)
- Usage patterns (how many users?)
- Data availability

### Dimension 4: Access Criteria
- Current access (Immuta policies)
- Training requirements
- Legal restrictions

### Progressive Refinement Flow

```
1. Intent/Keywords → AI extracts keywords
2. Suggested Categories → AI recommends based on keywords
3. Dynamic Filtering → Apply multi-dimensional filters, see live count
4. Refined Results → Show datasets with DCM context (crossover, usage, access status)
5. Iterative Selection → Add/remove, see updated access matrix
6. Access Analysis → Show 20/30/40/10 breakdown
7. Activities/Intents → Select data engineering + scientific analysis
8. User Assignment → Org-based + role-based
9. Provision → Execute with Collectoid automation
```

### Key Features Needed

**Smart Suggestions**:
- "Frequently bundled with" (based on other collections)
- "Category completion" (you have Demographics, these studies also have NGS)
- "Gap identification" (missing therapeutic areas)

**Real-Time Feedback**:
- Result count updates as filters applied
- Access matrix shows current state
- Provisioning breakdown updates as datasets change

**Bulk Operations**:
- Multi-select datasets
- Apply filter rules ("auto-select all closed studies with NGS + low crossover")
- Bulk add/remove

**Contextual Display**:
- ✅ Which specific categories available per dataset
- 📊 Collection crossover + which collections
- 👥 Usage stats
- ⚡ Access eligibility (instant vs approval)
- 🏷️ Study metadata

**Iterative Building**:
- Start with few datasets
- Review access matrix
- **Go back and refine**
- See updated breakdown
- Iterate until satisfied

---

## Updated POC Priorities

### PRIMARY (60-70% effort): DCM Curation Workbench

1. **Data Category Taxonomy Interface**
   - 30+ categories in expandable tree
   - Show study count per category
   - Multi-select with cart

2. **AI-Assisted Search**
   - Intent text input
   - Keyword extraction
   - Category suggestions

3. **Dynamic Multi-Dimensional Filtering**
   - Filter by categories, study characteristics, collection context, access criteria
   - Live result count
   - Progressive refinement

4. **Collection Crossover Visualization**
   - Show which collections include each dataset
   - Flag low/high crossover
   - Smart bundling suggestions

5. **Access Matrix & Provisioning Breakdown**
   - Show current access per user per dataset
   - 20/30/40/10 breakdown visualization
   - Charts and progress bars

6. **Activities/Intents Selection**
   - Data engineering checkboxes
   - Scientific analysis options
   - Affects access level

7. **User Assignment**
   - Org-based (Workday integration)
   - Role-based (Data Scientists, Engineers)
   - Individual PRIDs

8. **Collectoid Automation Demo**
   - Show 30% instant grant
   - Show 40% approval routing
   - Show 10% data discovery
   - Show 10% training hold

### SECONDARY (30-40% effort): Researcher Access

1. **Browse Pre-Curated Collections**
   - Simple catalog
   - Filter by therapeutic area

2. **Instant Access (90/10)**
   - Single click-through to Domino/SCP/AiBench
   - "Access granted" confirmation

3. **Simple Request Flow**
   - For non-instant data
   - Progress tracking

---

## Key Terminology

- **Collection Crossover**: Datasets in multiple collections (DCM curation concern)
- **Data Categories**: SDTM/ADaM/RAW/DICOM/Omics domains and their variables
- **Activities/Intents**: What data will be used for (affects access level)
- **20/30/40/10 Breakdown**: Access provisioning states
- **AiBench**: Legacy AWS data lake access system
- **Domino/SCP**: End platform options for data access

---

## Workshop Participants Mentioned

**Data collections side**:
- Henry Constable
- Marcin
- Ben Bernett

**BAU side (PBAC / metadata)**:
- Divya
- Rafa
- Beata

**Additional requirements**:
- "we need collaboration built in. discussion chat"
- "data exploration has multiple users - finders and DCM"
- "one click through to data platform - probably Domino (or SCP / aiBench / etc...)"

---

## Bottom Line

DCM workflow is NOT "browse and select datasets". It's a **sophisticated data curation workbench** with:
- AI-assisted category selection (30+ categories)
- Multi-dimensional dynamic search
- Collection crossover analysis
- Real-time access matrix
- Smart bundling suggestions
- Iterative refinement
- Automated provisioning breakdown

The POC must demonstrate this complexity or it won't resonate with stakeholders.

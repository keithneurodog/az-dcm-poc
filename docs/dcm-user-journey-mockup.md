# DCM User Journey: Complete UX Flow for POC
## Creating the "Oncology ctDNA Outcomes" Collection

**Date:** November 11, 2025
**Persona:** Divya (Data Collection Manager)
**Scenario:** Creating a curated collection for oncology researchers studying ctDNA biomarkers and immunotherapy
**Estimated Time:** 30-45 minutes for experienced DCM

---

## Phase 1: Identify Need & Express Intent

**Entry Point:** Divya opens DCM Portal → Clicks **"Create New Collection"**

### UI Screen: Intent Input

```
┌─────────────────────────────────────────────────────────────────┐
│                     Create New Collection                        │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│  Tell us what you're looking for:                               │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ I need to create a collection for oncology researchers     ││
│  │ studying ctDNA biomarkers and immunotherapy response in    ││
│  │ lung cancer patients                                       ││
│  │                                                             ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  💡 Tip: Describe your collection's purpose, target therapeutic │
│     area, data types, or research focus. Our AI will suggest   │
│     relevant data categories to help you get started.          │
│                                                                  │
│  [Cancel]                          [Get AI Suggestions →]       │
└─────────────────────────────────────────────────────────────────┘
```

**User Action:** Types intent text → Clicks **[Get AI Suggestions]**

---

## Phase 2: AI-Assisted Category Suggestion

### UI Screen: Category Suggestions

```
┌─────────────────────────────────────────────────────────────────┐
│                AI-Suggested Data Categories                      │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│  Based on your intent, we identified these keywords:            │
│  🏷️ oncology  🏷️ ctDNA  🏷️ biomarkers  🏷️ immunotherapy      │
│  🏷️ lung cancer  🏷️ response                                   │
│                                                                  │
│  ───────────────────────────────────────────────────────────── │
│                                                                  │
│  Recommended Data Categories:                                   │
│                                                                  │
│  THERAPEUTIC AREAS                                              │
│  ☑ ONC (Oncology) - 245 studies available                      │
│  ☑ IMMUNONC (Immuno-Oncology) - 87 studies available           │
│                                                                  │
│  SDTM (Clinical Trial Standard Data)                            │
│  ☑ Demographics (AGE, SEX, RACE) - 412 studies                 │
│  ☑ Exposure (Treatment arms, dosing, duration) - 398 studies   │
│  ☑ Tumor/Response Assessment (RECIST, iRECIST, BOR) - 156      │
│  ☑ Biomarker/Laboratory Results - 287 studies                  │
│  ☑ Adverse Events (AESI, grade, causality) - 402 studies       │
│                                                                  │
│  RAW DATA (Pre-Standardization)                                 │
│  ☑ ctDNA Measures (VAF, copies/mL, tumor fraction) - 23 ⭐     │
│  ☑ Specimen Metadata (Aliquot IDs, volume, QC) - 45 studies    │
│  ☑ Assay Metadata (Platform, kit version) - 38 studies         │
│                                                                  │
│  ADaM (Analysis-Ready Data)                                     │
│  ☑ ADSL (Subject-Level baseline characteristics) - 389         │
│  ☑ ADRS/ADEFF (Response/Efficacy outcomes) - 234 studies       │
│  ☑ ADTTE (Time-to-Event: OS, PFS) - 198 studies                │
│  ☑ ADBM/ADLB (Biomarker/Laboratory analysis) - 67 studies      │
│                                                                  │
│  OMICS/NGS (Genomics)                                           │
│  ☑ Variants (SNVs, indels in HGVS/VCF) - 34 studies            │
│  ☑ Global Scores (TMB, MSI status, HRD) - 28 studies           │
│  ☑ QC Metrics (Coverage depth, contamination %) - 31 studies   │
│                                                                  │
│  [+ Add More Categories]  [View Full Taxonomy (30+)]            │
│                                                                  │
│  ───────────────────────────────────────────────────────────── │
│                                                                  │
│  [← Back]  [Select All Suggested]  [Continue with Selection →] │
└─────────────────────────────────────────────────────────────────┘
```

**User Action:** Reviews suggestions → Clicks **[Continue with Selection]**

---

## Phase 3: Multi-Dimensional Dynamic Filtering

### UI Screen: Advanced Filters with Live Results

```
┌─────────────────────────────────────────────────────────────────┐
│  Refine Your Dataset Selection                                  │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│  ┌──────────────────────┐  ┌─────────────────────────────────┐ │
│  │ FILTERS              │  │ RESULTS: 42 datasets            │ │
│  │──────────────────────│  │─────────────────────────────────│ │
│  │                      │  │                                 │ │
│  │ 🎯 DATA CATEGORIES   │  │ [Sort: Relevance ▼] [View: ⊞] │ │
│  │ ✓ 15 selected        │  │                                 │ │
│  │ [Modify Selection]   │  │ ┌─────────────────────────────┐ │ │
│  │                      │  │ │ DCODE-042: NSCLC ctDNA     │ │ │
│  │ 🏥 STUDY CHARS       │  │ │ Monitoring - Phase III     │ │ │
│  │ TA: ONC, IMMUNONC ✓  │  │ │                             │ │ │
│  │ Phase:               │  │ │ 890 patients | Closed 2024 │ │ │
│  │  [ ] I  [ ] II       │  │ │                             │ │ │
│  │  [✓] III [ ] IV      │  │ │ Categories: SDTM (5), RAW  │ │ │
│  │ Status:              │  │ │ (2), Omics (2), ADaM (4)   │ │ │
│  │  [ ] Active          │  │ │                             │ │ │
│  │  [✓] Closed          │  │ │ 📊 In 3 collections         │ │ │
│  │ Geography:           │  │ │ 👥 87 users, 5 orgs         │ │ │
│  │  [✓] All regions     │  │ │                             │ │ │
│  │                      │  │ │ ⚡ 20% open | 30% ready     │ │ │
│  │ 📊 COLLECTION        │  │ │    40% needs approval       │ │ │
│  │    CONTEXT           │  │ │                             │ │ │
│  │ Crossover:           │  │ │ 💡 Bundled with: DCODE-001 │ │ │
│  │  [ ] New (0 colls)   │  │ │    DCODE-088, DCODE-102    │ │ │
│  │  [✓] Moderate (1-3)  │  │ │                             │ │ │
│  │  [ ] High (4+)       │  │ │ [☑ Select] [View Details]  │ │ │
│  │ Usage:               │  │ └─────────────────────────────┘ │ │
│  │  [✓] High (50+ usr)  │  │                                 │ │
│  │  [✓] Med (10-50)     │  │ ┌─────────────────────────────┐ │ │
│  │  [ ] Low (<10)       │  │ │ DCODE-067: Immunotherapy   │ │ │
│  │                      │  │ │ Response - Phase III        │ │ │
│  │ 🔐 ACCESS            │  │ │ ...                         │ │ │
│  │ Status:              │  │ └─────────────────────────────┘ │ │
│  │  [✓] Some open       │  │                                 │ │
│  │  [✓] Some restricted │  │ [Load More Results]             │ │
│  │  [ ] All restricted  │  │                                 │ │
│  │ Training:            │  │                                 │ │
│  │  [✓] GCP required    │  │                                 │ │
│  │  [✓] Data Privacy L2 │  │                                 │ │
│  │ Legal:               │  │                                 │ │
│  │  [ ] GDPR only       │  │                                 │ │
│  │  [✓] None/Mixed      │  │                                 │ │
│  │                      │  │                                 │ │
│  │ [Reset Filters]      │  │                                 │ │
│  └──────────────────────┘  └─────────────────────────────────┘ │
│                                                                  │
│  [← Back to Categories]                 [Continue with 0 →]     │
└─────────────────────────────────────────────────────────────────┘
```

**User Action:**
- Adjusts Phase filter (only Phase III checked)
- Result count updates: 42 → 28 datasets
- Selects datasets by checking boxes

---

## Phase 4: Dataset Card Detail View

### UI Component: Expanded Dataset Card

```
┌────────────────────────────────────────────────────────────────┐
│ DCODE-042: NSCLC ctDNA Monitoring - Phase III                 │
│────────────────────────────────────────────────────────────────│
│                                                                 │
│ 📋 STUDY OVERVIEW                                              │
│ Patients: 890 | Status: Closed 2024-03-15                     │
│ Therapeutic Area: Oncology - NSCLC (Non-Small Cell Lung)      │
│ Treatment Arms: Pembrolizumab + Chemotherapy vs Chemo alone   │
│                                                                 │
│ 📦 DATA CATEGORIES AVAILABLE                                   │
│ ✓ SDTM: Demographics, Exposure, Tumor/Response Assessment,    │
│         Biomarker/Laboratory Results, Adverse Events           │
│ ✓ RAW: ctDNA Measures (VAF, copies/mL), Specimen Metadata     │
│ ✓ Omics/NGS: Variants (SNVs, indels), Global Scores (TMB/MSI) │
│ ✓ ADaM: ADSL, ADRS, ADTTE, ADBM                               │
│                                                                 │
│ 📊 COLLECTION CROSSOVER (DCM-Specific)                         │
│ This dataset appears in 3 collections:                         │
│  • Lung Cancer Phase III Studies (85 users)                   │
│  • Immunotherapy Response Collection (62 users)                │
│  • Multi-Modal Oncology Data (45 users)                        │
│                                                                 │
│ 👥 USAGE ANALYTICS                                             │
│ Active Users: 87 across 5 organizations                        │
│ Most Common Use: Biomarker outcome analysis, immunotherapy     │
│                  response prediction                            │
│                                                                 │
│ ⚡ ACCESS ELIGIBILITY (for your 120 target users)              │
│ ▓▓░░░░░░░░ 20% Already Open (no action needed)                │
│ ▓▓▓░░░░░░░ 30% Ready to Grant (instant after your confirm)    │
│ ▓▓▓▓░░░░░░ 40% Needs Approval (GPT-Oncology, 2-3 days)        │
│ ▓░░░░░░░░░ 10% Missing Location (data discovery needed)       │
│                                                                 │
│ 💡 SMART SUGGESTIONS                                           │
│ Frequently bundled with:                                       │
│  → DCODE-001: NSCLC Genomic Profiling (in 8 collections)      │
│  → DCODE-088: Lung Cancer Outcomes (in 6 collections)          │
│  → DCODE-102: PET Imaging Substudy (in 4 collections)          │
│                                                                 │
│ 🏷️ METADATA                                                     │
│ Data Location: S3 (Clinical), SolveBio (Genomics)             │
│ Last Updated: 2024-09-12                                       │
│ Data Steward: Dr. Sarah Johnson (PRID: P789012)               │
│ Quality Score: 8.5/10 (92% complete metadata)                  │
│                                                                 │
│ [✓ Selected] [View Full Metadata] [Report Issue] [Remove]     │
└────────────────────────────────────────────────────────────────┘
```

---

## Phase 5: Selection Cart with Real-Time Access Matrix

### UI Component: Floating Selection Cart (always visible)

```
┌────────────────────────────────────────────────────────────────┐
│ YOUR COLLECTION                                          [—][×] │
│────────────────────────────────────────────────────────────────│
│ 15 datasets selected                              [View List ▼]│
│                                                                 │
│ REAL-TIME ACCESS MATRIX (120 target users)                     │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │                                                             │ │
│ │ ✅ 60 users (50%): Immediate access to some datasets       │ │
│ │ ⚡ 108 users (90%): Instant access after your confirmation │ │
│ │ 🟡 108 users (90%): Access after GPT/TALT approval         │ │
│ │ ❓ Varies: 2 datasets have location issues                 │ │
│ │ ⏳ 12 users (10%): Need training completion                │ │
│ │                                                             │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ACCESS PROVISIONING BREAKDOWN                                  │
│ ▓▓▓▓░░░░░░ 20% Already Open (3 datasets)                      │
│ ▓▓▓▓▓▓▓░░░ 30% Ready to Grant (5 datasets)                    │
│ ▓▓▓▓▓▓▓▓░░ 40% Needs Approval (6 datasets)                    │
│ ▓░░░░░░░░░ 10% Missing Location (1 dataset)                   │
│                                                                 │
│ 💡 SMART SUGGESTION                                            │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Studies DCODE-001 and DCODE-088 are frequently bundled    │ │
│ │ with your selected datasets. Add them?                     │ │
│ │                                                             │ │
│ │ [Add Both] [View DCODE-001] [View DCODE-088] [Dismiss]    │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ [View Detailed Breakdown] [Clear All] [Continue to Setup →]   │
└────────────────────────────────────────────────────────────────┘
```

**User Actions:**
- Clicks **[View DCODE-088]** → Reviews it → Clicks **[Add Both]**
- Cart updates: 15 → 17 datasets
- Access matrix recalculates automatically
- Notices one dataset (DCODE-299) is in 5 collections (high crossover)
- Clicks dataset in list → Removes it
- Cart updates: 17 → 16 datasets
- Access matrix recalculates again

**Final Selection:** 16 datasets

---

## Phase 6: Activities/Intents Selection

### UI Screen: Define Collection Purpose

```
┌─────────────────────────────────────────────────────────────────┐
│ Define Collection Purpose & Activities                          │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ What will this data be used for?                                │
│ (This affects the access level users will receive)              │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ DATA ENGINEERING                                                │
│ Select all that apply:                                          │
│                                                                  │
│ ☐ ETL/Standardization                                          │
│   └ Activities: Date unification, unit harmonization (VAF %),  │
│     HGVS normalization, panel coverage mapping, LoD/LoQ         │
│     capture, QC flag propagation                                │
│   └ Access Level: Processed/aggregated data                    │
│                                                                  │
│ ☐ Variant Harmonization                                        │
│   └ Activities: Left-align/normalize, canonical transcript     │
│     selection, COSMIC/ClinVar annotation, deduplication         │
│   └ Access Level: Genomic data preprocessing                   │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ SCIENTIFIC ANALYSIS - Secondary use of patient level data      │
│ Select all that apply:                                          │
│                                                                  │
│ ☑ Early Response Classifier                                    │
│   └ Analysis: Baseline ctDNA, % drop by Week 4, max VAF        │
│     using AI/ML models                                          │
│   └ Access Level: Patient-level clinical + ctDNA data          │
│                                                                  │
│ ☑ Multimodal Fusion                                            │
│   └ Analysis: ctDNA + PET MTV/TLG + clinical covariates        │
│     for integrated response prediction                          │
│   └ Access Level: Patient-level multi-modal data               │
│                                                                  │
│ ☑ Cohort Builder                                               │
│   └ Analysis: Filters for cancer type/subtype, stage, line,    │
│     regimen class, panel version                                │
│   └ Access Level: Patient-level data for cohort creation       │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ ℹ️  Note: Scientific Analysis selections require patient-level │
│    data access and may require additional approvals.            │
│                                                                  │
│ [← Back to Selection]              [Continue to User Setup →]  │
└─────────────────────────────────────────────────────────────────┘
```

**User Action:** Selects 3 Scientific Analysis options → Clicks **[Continue to User Setup]**

---

## Phase 7: Collection Definition & User Assignment

### UI Screen: Collection Details

```
┌─────────────────────────────────────────────────────────────────┐
│ Collection Details & User Assignment                            │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ COLLECTION INFORMATION                                          │
│                                                                  │
│ Collection Name *                                               │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Oncology ctDNA Outcomes Collection                         │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Description *                                                   │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Curated collection of Phase III lung cancer studies with   │ │
│ │ ctDNA biomarker monitoring and immunotherapy treatment     │ │
│ │ arms. Suitable for outcomes research, biomarker analysis,  │ │
│ │ and multimodal data fusion.                                │ │
│ │                                                             │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ Target User Community                                           │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Oncology Data Scientists and Biostatisticians studying     │ │
│ │ immunotherapy response and ctDNA dynamics                  │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ USER ASSIGNMENT                                                 │
│                                                                  │
│ [Organization-based ▼] [Role-based] [Individual PRIDs]         │
│                                                                  │
│ ┌─ Organization-based (Workday) ──────────────────────────────┐ │
│ │                                                              │ │
│ │ Search organizations...  [Oncology_______________] [Search] │ │
│ │                                                              │ │
│ │ Selected Organizations:                                      │ │
│ │                                                              │ │
│ │ ☑ Oncology Biometrics (45 users)                           │ │
│ │   └ Data Scientists (28), Biostatisticians (17)            │ │
│ │                                                              │ │
│ │ ☑ Oncology Data Science (60 users)                         │ │
│ │   └ Data Scientists (42), Engineers (18)                   │ │
│ │                                                              │ │
│ │ ☑ Translational Medicine - Oncology (15 users)             │ │
│ │   └ Scientists (12), Data Analysts (3)                     │ │
│ │                                                              │ │
│ │ [+ Add Organization]                                         │ │
│ │                                                              │ │
│ └──────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ TOTAL TARGET USERS: 120 users                                  │
│                                                                  │
│ Filters (optional):                                             │
│ Role: [✓ Data Scientist] [✓ Biostatistician] [ ] Engineer     │
│ Training: Auto-filtered based on data requirements             │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ [← Back to Activities]          [Review Access Provisioning →] │
└─────────────────────────────────────────────────────────────────┘
```

**User Action:** Fills out form → Clicks **[Review Access Provisioning]**

---

## Phase 8: Detailed Access Provisioning Breakdown

### UI Screen: Final Review Before Publishing

```
┌─────────────────────────────────────────────────────────────────┐
│ Access Provisioning Breakdown                            [Print]│
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ Collection: "Oncology ctDNA Outcomes"                           │
│ 16 datasets | 120 target users | 3 scientific analysis intents │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ 20% ALREADY OPEN (for 50% of users)                         ││
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│ │                                                              ││
│ │ Status: ✅ No action needed                                  ││
│ │ Impact: 60 users (50%) have immediate access                ││
│ │ Details: Study closed, DB lock >6 months, no restrictions   ││
│ │                                                              ││
│ │ Datasets (3):                                                ││
│ │  • DCODE-001: NSCLC Genomic Profiling                       ││
│ │  • DCODE-023: Lung Cancer Survival Outcomes                 ││
│ │  • DCODE-045: Immunotherapy Response Study                  ││
│ │                                                              ││
│ │ [View Users with Access]                                     ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ 30% READY TO GRANT (instant approval)                       ││
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│ │                                                              ││
│ │ Status: ⚡ One-click confirmation → instant access to 90%   ││
│ │ Impact: 108 users (90%) will gain access                    ││
│ │ Timeline: ~1 hour after your confirmation                   ││
│ │ Details: Study closed, DB lock >6 months, no legal blocks   ││
│ │                                                              ││
│ │ Mechanism:                                                   ││
│ │  1. You click [Confirm Instant Grant] below                 ││
│ │  2. Collectoid updates Immuta policies (metadata only)      ││
│ │  3. Users automatically gain access within 1 hour           ││
│ │  4. Email notifications sent to users                       ││
│ │                                                              ││
│ │ Datasets (5):                                                ││
│ │  • DCODE-042: NSCLC ctDNA Monitoring                        ││
│ │  • DCODE-067: Immunotherapy Response Phase III              ││
│ │  • DCODE-088: Lung Cancer Clinical Outcomes                 ││
│ │  • DCODE-102: PET Imaging Substudy                          ││
│ │  • DCODE-134: Biomarker Validation Study                    ││
│ │                                                              ││
│ │ [View Affected Users] [View Immuta Policy Preview]          ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ 40% BLOCKED - NEEDS APPROVAL (GPT/TALT)                     ││
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░ ││
│ │                                                              ││
│ │ Status: 🟡 Requires external approval from governance teams ││
│ │ Impact: 108 users (90%) after approvals complete            ││
│ │ Timeline: 2-5 business days depending on approval authority ││
│ │                                                              ││
│ │ Routing Details:                                             ││
│ │                                                              ││
│ │ → GPT-Oncology (4 datasets) - Est. 2-3 days                ││
│ │   Reason: Active study data requires therapeutic area review││
│ │   • DCODE-156: Active NSCLC Trial                           ││
│ │   • DCODE-178: Ongoing Immunotherapy Study                  ││
│ │   • DCODE-189: Multi-Site Biomarker Trial                   ││
│ │   • DCODE-201: Phase III Active Study                       ││
│ │   Contact: Dr. Martinez (GPT-Oncology Lead)                 ││
│ │                                                              ││
│ │ → TALT-Legal (2 datasets) - Est. 3-5 days                  ││
│ │   Reason: Cross-geography data (EU sites), GDPR review      ││
│ │   • DCODE-223: Multi-Regional Study (US + EU + Asia)        ││
│ │   • DCODE-267: European Consortium Study                    ││
│ │   Contact: Jane Smith (TALT-Legal)                          ││
│ │                                                              ││
│ │ What happens next:                                           ││
│ │  1. You click [Auto-Create Authorization Requests] below    ││
│ │  2. Collectoid creates formal approval requests             ││
│ │  3. Requests routed to GPT-Oncology and TALT-Legal          ││
│ │  4. Collectoid monitors approval status                     ││
│ │  5. Upon approval, Collectoid writes Immuta policies        ││
│ │  6. Users gain access automatically, notifications sent     ││
│ │                                                              ││
│ │ [View Approval Templates] [View Historical Approval Times]  ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ 10% MISSING DATA LOCATION                                   ││
│ │ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│ │                                                              ││
│ │ Status: ❓ Data not catalogued                               ││
│ │ Impact: Access delayed until data located and catalogued    ││
│ │ Timeline: Varies (depends on data discovery effort)         ││
│ │                                                              ││
│ │ Datasets (1):                                                ││
│ │  • DCODE-299: ctDNA Longitudinal Substudy                   ││
│ │    Issue: Metadata indicates study exists but S3 location   ││
│ │           not in current data catalog                       ││
│ │                                                              ││
│ │ What happens next:                                           ││
│ │  1. You click [Initiate Find/Catalogue Workflow] below      ││
│ │  2. Collectoid notifies data steward (Dr. Johnson)          ││
│ │  3. Manual search or data location verification begins      ││
│ │  4. Once located, standard provisioning workflow resumes    ││
│ │  5. You'll be notified when data is catalogued              ││
│ │                                                              ││
│ │ [Contact Data Steward] [View Similar Datasets]              ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ 10% USERS HAVEN'T COMPLETED TRAINING                        ││
│ │ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ ││
│ │                                                              ││
│ │ Status: ⏳ Pending user training completion                  ││
│ │ Impact: 12 users (10%) currently blocked                    ││
│ │ Timeline: Depends on user completing required courses       ││
│ │                                                              ││
│ │ Training Requirements:                                       ││
│ │  • 8 users missing: GCP (Good Clinical Practice)            ││
│ │  • 4 users missing: Data Privacy Level 2 certification      ││
│ │                                                              ││
│ │ What happens next:                                           ││
│ │  1. You click [Send Training Reminders] below               ││
│ │  2. Collectoid sends email with training links to users     ││
│ │  3. System monitors training database for completion        ││
│ │  4. As soon as training completed, users automatically      ││
│ │     qualify for all unlocked data above                     ││
│ │  5. No additional DCM action needed                         ││
│ │                                                              ││
│ │ [View User List] [Send Training Reminders]                  ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ ACTIONS                                                         │
│                                                                  │
│ ┌────────────────────────────────────────────────────────────┐ │
│ │ Review your actions:                                        │ │
│ │                                                             │ │
│ │ ☑ Confirm instant grant for 30% (5 datasets, 108 users)   │ │
│ │ ☑ Create approval requests for 40% (6 datasets)           │ │
│ │ ☑ Initiate data discovery for 10% (1 dataset)             │ │
│ │ ☑ Send training reminders to users (12 users)             │ │
│ │                                                             │ │
│ └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│ [← Back to Setup] [Export Report] [Publish Collection & Execute]│
└─────────────────────────────────────────────────────────────────┘
```

**User Action:** Reviews breakdown → Clicks **[Publish Collection & Execute]**

---

## Phase 9: Collectoid Automation in Progress

### UI Screen: Publishing Progress

```
┌─────────────────────────────────────────────────────────────────┐
│ Publishing Collection...                                        │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ ✓ Collection "Oncology ctDNA Outcomes" Published               │
│                                                                  │
│ Collectoid is now executing your provisioning plan:             │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ IMMEDIATE ACTIONS (Complete)                                    │
│ ✓ Collection metadata saved to catalog                         │
│ ✓ 60 users granted immediate access (20% - 3 datasets)         │
│ ✓ Email notifications sent to users with immediate access      │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ IN PROGRESS                                                     │
│                                                                  │
│ ⏳ Generating Immuta policies for instant grant                 │
│    • 5 datasets (30% category)                                  │
│    • 108 users will gain access                                 │
│    • Estimated completion: ~1 hour                              │
│    • Progress: ▓▓▓▓▓▓▓░░░ 70% complete                         │
│                                                                  │
│ ⏳ Creating authorization requests for external approval        │
│    • 4 requests → GPT-Oncology                                  │
│      └ Est. approval: Nov 13-14 (2-3 business days)            │
│    • 2 requests → TALT-Legal                                    │
│      └ Est. approval: Nov 14-16 (3-5 business days)            │
│    • Collectoid will auto-grant upon approval                   │
│                                                                  │
│ ⏳ Initiating data discovery workflow                           │
│    • Dataset: DCODE-299                                         │
│    • Data steward notification sent to Dr. Johnson             │
│    • Manual search workflow started                             │
│    • You'll be notified when data is located                    │
│                                                                  │
│ ⏳ Training reminder emails sent                                │
│    • 12 users notified with training links                      │
│    • Auto-grant will trigger upon training completion           │
│    • No further DCM action needed                               │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ PROGRESS TRACKING                                               │
│                                                                  │
│ Current Status: 60 of 120 users (50%) have some access         │
│ Expected: 108 users (90%) within 1 hour (instant grant)        │
│ Expected: 108 users (90%) within 3-5 days (after approvals)    │
│                                                                  │
│ [View Live Status Dashboard]                                    │
│ [Download Provisioning Report]                                  │
│ [Notify Users of Collection Availability]                       │
│ [Go to DCM Dashboard]                                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**User Action:** Clicks **[Go to DCM Dashboard]**

---

## Phase 10: DCM Dashboard - Monitor Progress

### UI Screen: Collection Management Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ Data Collection Manager Dashboard                       [Divya] │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ [My Collections] [Approval Queue] [Issue Reports] [Analytics]  │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ MY COLLECTIONS (8 active)                                       │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ 🆕 Oncology ctDNA Outcomes Collection                       ││
│ │ Created: Nov 11, 2025, 14:30 | Status: ⚡ Provisioning     ││
│ │                                                              ││
│ │ Progress: ▓▓▓▓▓▓░░░░ 60% Complete                          ││
│ │                                                              ││
│ │ TIMELINE                                                     ││
│ │ ✓ Nov 11, 14:30 - Collection published                     ││
│ │ ✓ Nov 11, 14:31 - 60 users granted immediate access (20%)  ││
│ │ ⏳ Nov 11, 15:30 - 108 users instant grant expected (30%)   ││
│ │ ⏳ Nov 13-14 - GPT-Oncology approvals expected (25%)        ││
│ │ ⏳ Nov 14-16 - TALT-Legal approvals expected (15%)          ││
│ │ ⏳ Pending - Data location discovery (10%)                  ││
│ │                                                              ││
│ │ CURRENT ACCESS                                               ││
│ │ 60 of 120 users (50%) have access to some/all datasets     ││
│ │ Target: 120 users (100%) with full collection access       ││
│ │                                                              ││
│ │ RECENT ACTIVITY                                              ││
│ │ • 2 min ago: Immuta policy generation in progress           ││
│ │ • 5 min ago: Authorization requests sent to GPT/TALT        ││
│ │ • 8 min ago: Training reminders sent to 12 users            ││
│ │                                                              ││
│ │ [View Detailed Status] [View Access Matrix] [Export Report] ││
│ │ [Send Update to Users] [Edit Collection]                    ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ Cardiovascular Outcomes Collection                          ││
│ │ Created: Oct 28, 2025 | Status: ✅ Fully Provisioned       ││
│ │ 180 of 180 users (100%) have full access                   ││
│ │ [View Details] [View Analytics]                             ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ [+ Create New Collection] [View All Collections]               │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ APPROVAL QUEUE (12 pending)                                     │
│                                                                  │
│ 🟢 8 Auto-Approved by Collectoid (90/10 instant access)        │
│ 🟡 3 Routed for External Approval (GPT/TALT reviewing)         │
│ 🔴 1 Requires Your Review (edge case flagged)                  │
│                                                                  │
│ [View Approval Queue]                                           │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ SYSTEM METRICS (Last 30 Days)                                   │
│                                                                  │
│ Requests Processed: 247                                         │
│ Auto-Approval Rate: 68% (↑ from 45% last month)                │
│ Average Approval Time: 2.1 days (↓ from 12.5 days)             │
│ User Satisfaction: 4.3/5.0                                      │
│                                                                  │
│ [View Full Analytics] [Generate Report]                         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 11: Detailed Status View (Optional Deep Dive)

### UI Screen: Collection Progress Detail

```
┌─────────────────────────────────────────────────────────────────┐
│ Oncology ctDNA Outcomes Collection - Detailed Status           │
│─────────────────────────────────────────────────────────────────│
│                                                                  │
│ [Overview] [Access Matrix] [Timeline] [Activity Log] [Users]   │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ DATASET-LEVEL STATUS (16 datasets)                              │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ ✅ DCODE-001: NSCLC Genomic Profiling                       ││
│ │    Status: Accessible                                        ││
│ │    Users: 60 users have immediate access                    ││
│ │    Provisioned: Nov 11, 14:31                                ││
│ │    [View Users] [View Data]                                  ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ ⏳ DCODE-042: NSCLC ctDNA Monitoring                        ││
│ │    Status: Provisioning (30% instant grant)                 ││
│ │    Timeline: Access available ~15:30 (1 hour from publish)  ││
│ │    Users: 108 users will gain access                        ││
│ │    Mechanism: Collectoid updating Immuta policy (70% done)  ││
│ │    [View Policy] [View Users]                                ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ 🟡 DCODE-156: Active NSCLC Trial                            ││
│ │    Status: Pending GPT-Oncology Approval                    ││
│ │    Timeline: Est. Nov 13-14 (2-3 business days)             ││
│ │    Reason: Active study data requires TA governance review  ││
│ │    Contact: Dr. Martinez (GPT-Oncology Lead)                ││
│ │    Users: 108 users pending approval                        ││
│ │    Next Steps: Collectoid monitoring approval status,       ││
│ │                will auto-grant upon approval                 ││
│ │    [View Authorization Request] [Contact Approver]           ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ 🟡 DCODE-223: Multi-Regional Study                          ││
│ │    Status: Pending TALT-Legal Approval                      ││
│ │    Timeline: Est. Nov 14-16 (3-5 business days)             ││
│ │    Reason: Cross-geography data (US+EU+Asia), GDPR review   ││
│ │    Contact: Jane Smith (TALT-Legal)                         ││
│ │    Users: 108 users pending approval (EU data only)         ││
│ │    Note: US and Asia data portions already accessible       ││
│ │    [View Authorization Request] [Contact Approver]           ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ ❓ DCODE-299: ctDNA Longitudinal Substudy                   ││
│ │    Status: Data Location Discovery in Progress              ││
│ │    Timeline: Unknown (depends on discovery effort)          ││
│ │    Issue: Metadata exists but S3 location not catalogued    ││
│ │    Activity:                                                 ││
│ │    • Data steward (Dr. Johnson) notified: Nov 11, 14:35     ││
│ │    • Manual search workflow initiated                        ││
│ │    • You'll be notified when data is located                 ││
│ │    [Contact Data Steward] [View Discovery Log]               ││
│ └──────────────────────────────────────────────────────────────┘│
│                                                                  │
│ [Load More Datasets (11 more)]                                  │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ USER-LEVEL STATUS (120 users)                                   │
│                                                                  │
│ ✅ 60 users (50%): Have immediate access to 3 datasets         │
│ ⏳ 48 users (40%): Will gain access to 5 more datasets in ~1hr │
│ ⏳ 108 users (90%): Pending GPT/TALT approval for 6 datasets   │
│ ⏳ 12 users (10%): Blocked by missing training                  │
│                                                                  │
│ [View User Access Matrix] [Export User List] [Notify Users]    │
│                                                                  │
│ ═══════════════════════════════════════════════════════════════ │
│                                                                  │
│ [← Back to Dashboard] [Download Full Report] [Share Status]    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Summary: Key Features Demonstrated

### 1. **AI-Assisted Discovery**
- Intent text input → Keyword extraction
- Smart category suggestions from 30+ taxonomy
- Study count per category

### 2. **Multi-Dimensional Filtering**
- 4 filter dimensions (categories, study, collection, access)
- Live result count updates
- DCM-specific collection context filters

### 3. **Collection Crossover Analysis**
- Shows which collections contain each dataset
- Usage analytics (user counts, organizations)
- Smart bundling suggestions

### 4. **Progressive Refinement**
- Real-time access matrix updates
- Iterative selection (add/remove/adjust)
- Visual feedback on provisioning impact

### 5. **Activities/Intents Selection**
- Data engineering vs scientific analysis
- Affects access level granted
- Clear descriptions of each activity type

### 6. **Access Provisioning Breakdown (20/30/40/10)**
- Detailed visualization with progress bars
- Clear actions for each category
- Estimated timelines and contact information

### 7. **Collectoid Automation**
- Instant grant automation (30%)
- Authorization request creation and routing (40%)
- Progress monitoring and notifications
- Auto-grant upon approval

### 8. **Progress Tracking**
- Timeline view with estimated completion
- Dataset-level and user-level status
- Charts and analytics
- Export reports

---

## Estimated Build Time

**Phase Implementation Priority:**
1. Phase 2 (Category Suggestion) - 1 week
2. Phase 3 (Multi-Dimensional Filtering) - 1.5 weeks
3. Phase 5 (Selection Cart + Access Matrix) - 1 week
4. Phase 8 (Detailed Breakdown Viz) - 1 week
5. Phase 6 (Activities/Intents) - 0.5 weeks
6. Phase 7 (User Assignment) - 0.5 weeks
7. Phase 1, 9, 10 (Wrappers + Dashboard) - 1 week

**Total:** ~6.5 weeks for full DCM workbench

---

**End of DCM User Journey Mockup**

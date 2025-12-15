// DCM POC Mock Data

// =============================================================================
// DATA ACCESS REQUEST INTERFACES
// =============================================================================

// User's declared intent for data access (simplified AoT preferences)
export interface DataAccessIntent {
  primaryUse: {
    understandDrugMechanism: boolean
    understandDisease: boolean
    developDiagnosticTests: boolean
    learnFromPastStudies: boolean
    improveAnalysisMethods: boolean
  }
  beyondPrimaryUse: {
    aiResearch: boolean
    softwareDevelopment: boolean
  }
  publication: {
    internalOnly: boolean
    externalPublication: boolean
  }
  researchPurpose?: string
  expectedDuration?: "3-months" | "6-months" | "1-year" | "2-years" | "indefinite"
}

// Access category for a dataset based on user intent
export type AccessCategory = "immediate" | "soon" | "extended" | "conflict"

// Individual conflict between user intent and dataset restrictions
export interface IntentConflict {
  intentField: "aiResearch" | "softwareDevelopment" | "externalPublication"
  intentLabel: string
  datasetRestriction: string
  addedWeeks: number
}

// Result of matching a single dataset against user intent
export interface DatasetMatchResult {
  datasetId: string
  dataset: Dataset
  accessCategory: AccessCategory
  estimatedDays: number
  estimatedWeeks: number
  categoryReason: string
  intentConflicts: IntentConflict[]
  matchingCollectionId?: string
  matchingCollectionName?: string
  similarDatasets: SimilarDataset[]
}

// Similar dataset recommendation
export interface SimilarDataset {
  dataset: Dataset
  similarityScore: number // 0-100
  reason: string
  accessCategory: AccessCategory
  estimatedWeeks: number
}

// Complete result of smart matching all selected datasets
export interface RequestMatchingResult {
  immediate: DatasetMatchResult[]   // Green - ready now (0 days)
  soon: DatasetMatchResult[]        // Blue - ~1-2 weeks
  extended: DatasetMatchResult[]    // Amber - ~6-8 weeks
  conflicts: DatasetMatchResult[]   // Red - has blocking conflicts

  summary: {
    totalDatasets: number
    immediateCount: number
    soonCount: number
    extendedCount: number
    conflictCount: number
    maxEstimatedWeeks: number
    estimatedFullAccessWeeks: number
  }

  intentWarnings: IntentWarning[]
}

// Warning about how an intent affects multiple datasets
export interface IntentWarning {
  intentField: "aiResearch" | "softwareDevelopment" | "externalPublication"
  intentLabel: string
  affectedDatasetIds: string[]
  affectedDatasetCodes: string[]
  addedWeeks: number
  message: string
}

// Final submitted data access request
export interface DataAccessRequest {
  id: string
  status: "submitted" | "in_review" | "approved" | "rejected"
  requesterId: string
  requesterName: string
  requesterEmail: string
  intent: DataAccessIntent
  datasetIds: string[]
  matchingResult: RequestMatchingResult
  createdAt: Date
  submittedAt: Date
  notes?: string
}

// =============================================================================
// EXISTING INTERFACES
// =============================================================================

export interface DataCategory {
  id: string
  name: string
  domain: string
  description: string
  studyCount: number
  keyVariables: string[]
  isHighlighted?: boolean
}

export const DATA_CATEGORY_TAXONOMY: DataCategory[] = [
  // Therapeutic Areas
  {
    id: "ta-onc",
    name: "ONC (Oncology)",
    domain: "Therapeutic Areas",
    description: "Oncology and cancer-related studies",
    studyCount: 245,
    keyVariables: ["STUDYID", "DOMAIN"],
  },
  {
    id: "ta-immunonc",
    name: "IMMUNONC (Immuno-Oncology)",
    domain: "Therapeutic Areas",
    description: "Immunotherapy and immuno-oncology studies",
    studyCount: 87,
    keyVariables: ["STUDYID", "DOMAIN"],
  },
  {
    id: "ta-cardio",
    name: "CARDIO (Cardiovascular)",
    domain: "Therapeutic Areas",
    description: "Cardiovascular disease studies",
    studyCount: 198,
    keyVariables: ["STUDYID", "DOMAIN"],
  },

  // SDTM
  {
    id: "sdtm-demographics",
    name: "Demographics",
    domain: "SDTM",
    description: "Patient demographic information",
    studyCount: 412,
    keyVariables: ["AGE", "SEX", "RACE", "ETHNIC"],
  },
  {
    id: "sdtm-exposure",
    name: "Exposure",
    domain: "SDTM",
    description: "Treatment arms, dosing, duration",
    studyCount: 398,
    keyVariables: ["EXDOSE", "EXDOSU", "EXSTDTC", "EXENDTC"],
  },
  {
    id: "sdtm-tumor-response",
    name: "Tumor/Response Assessment",
    domain: "SDTM",
    description: "RECIST, iRECIST, BOR assessments",
    studyCount: 156,
    keyVariables: ["RECIST", "iRECIST", "BOR", "TRGRESP"],
  },
  {
    id: "sdtm-biomarker-labs",
    name: "Biomarker/Laboratory Results",
    domain: "SDTM",
    description: "Chemistry, hematology, coagulation",
    studyCount: 287,
    keyVariables: ["LBTESTCD", "LBTEST", "LBORRES", "LBORRESU"],
  },
  {
    id: "sdtm-adverse-events",
    name: "Adverse Events",
    domain: "SDTM",
    description: "AESI, grade, causality assessments",
    studyCount: 402,
    keyVariables: ["AETERM", "AESEV", "AESER", "AEREL"],
  },
  {
    id: "sdtm-conmeds",
    name: "Concomitant Medications",
    domain: "SDTM",
    description: "Prior and concurrent therapies",
    studyCount: 356,
    keyVariables: ["CMTRT", "CMSTDTC", "CMENDTC"],
  },
  {
    id: "sdtm-specimens",
    name: "Specimen/Procedures",
    domain: "SDTM",
    description: "Collection dates, sample types",
    studyCount: 189,
    keyVariables: ["SPDEVID", "SPREFID", "SPDTC"],
  },

  // RAW Data
  {
    id: "raw-ctdna",
    name: "ctDNA Measures",
    domain: "RAW Data",
    description: "VAF, copies/mL, tumor fraction",
    studyCount: 23,
    keyVariables: ["VAF", "COPIES_ML", "TUMOR_FRACTION"],
    isHighlighted: true,
  },
  {
    id: "raw-specimen-meta",
    name: "Specimen Metadata",
    domain: "RAW Data",
    description: "Aliquot IDs, volume, QC flags",
    studyCount: 45,
    keyVariables: ["ALIQUOT_ID", "VOLUME", "QC_FLAG"],
  },
  {
    id: "raw-assay-meta",
    name: "Assay Metadata",
    domain: "RAW Data",
    description: "Platform, kit version, protocol",
    studyCount: 38,
    keyVariables: ["PLATFORM", "KIT_VERSION", "PROTOCOL"],
  },
  {
    id: "raw-processing-qc",
    name: "Processing/QC Metrics",
    domain: "RAW Data",
    description: "Extraction yield, integrity scores",
    studyCount: 34,
    keyVariables: ["YIELD", "INTEGRITY", "QC_SCORE"],
  },

  // ADaM
  {
    id: "adam-adsl",
    name: "ADSL (Subject-Level)",
    domain: "ADaM",
    description: "Subject-level baseline characteristics",
    studyCount: 389,
    keyVariables: ["USUBJID", "TRTA", "SAFFL", "ITTFL"],
  },
  {
    id: "adam-adrs",
    name: "ADRS/ADEFF (Response/Efficacy)",
    domain: "ADaM",
    description: "Response and efficacy outcomes",
    studyCount: 234,
    keyVariables: ["PARAMCD", "AVAL", "AVALC", "CHG"],
  },
  {
    id: "adam-adtte",
    name: "ADTTE (Time-to-Event)",
    domain: "ADaM",
    description: "Time-to-Event analysis: OS, PFS",
    studyCount: 198,
    keyVariables: ["AVAL", "CNSR", "PARAM", "EVNTDESC"],
  },
  {
    id: "adam-adbm",
    name: "ADBM/ADLB (Biomarker/Labs)",
    domain: "ADaM",
    description: "Biomarker and laboratory analysis",
    studyCount: 67,
    keyVariables: ["PARAM", "AVAL", "CHG", "PCHG"],
  },
  {
    id: "adam-adexp",
    name: "ADEXP (Exposure)",
    domain: "ADaM",
    description: "Exposure analysis datasets",
    studyCount: 156,
    keyVariables: ["EXPDUR", "DOSE", "DOSEA"],
  },

  // DICOM
  {
    id: "dicom-ids-timing",
    name: "IDs/Timing",
    domain: "DICOM",
    description: "PatientID, StudyDate, SeriesDate",
    studyCount: 78,
    keyVariables: ["PATIENT_ID", "STUDY_DATE", "SERIES_DATE"],
  },
  {
    id: "dicom-acquisition",
    name: "Acquisition Parameters",
    domain: "DICOM",
    description: "Modality, slice thickness, contrast",
    studyCount: 76,
    keyVariables: ["MODALITY", "SLICE_THICKNESS", "CONTRAST"],
  },
  {
    id: "dicom-quantitative",
    name: "Quantitative Outputs",
    domain: "DICOM",
    description: "MTV, TLG, SUVmax from PET",
    studyCount: 45,
    keyVariables: ["MTV", "TLG", "SUVMAX"],
  },

  // Omics/NGS
  {
    id: "omics-variants",
    name: "Variants (SNVs, indels)",
    domain: "Omics/NGS",
    description: "Single nucleotide variants and indels in HGVS/VCF format",
    studyCount: 34,
    keyVariables: ["CHROM", "POS", "REF", "ALT", "HGVS"],
  },
  {
    id: "omics-global-scores",
    name: "Global Scores",
    domain: "Omics/NGS",
    description: "TMB, MSI status, HRD score",
    studyCount: 28,
    keyVariables: ["TMB", "MSI", "HRD_SCORE"],
  },
  {
    id: "omics-cn-sv",
    name: "Copy Number/Structural Variants",
    domain: "Omics/NGS",
    description: "CN gains/losses, fusions",
    studyCount: 31,
    keyVariables: ["CN", "SV_TYPE", "FUSION"],
  },
  {
    id: "omics-sample-provenance",
    name: "Sample/Provenance",
    domain: "Omics/NGS",
    description: "PRID, timepoint, tissue type",
    studyCount: 42,
    keyVariables: ["PRID", "TIMEPOINT", "TISSUE_TYPE"],
  },
  {
    id: "omics-pipeline-meta",
    name: "Pipeline Metadata",
    domain: "Omics/NGS",
    description: "Reference genome, tool versions, BED files",
    studyCount: 38,
    keyVariables: ["REF_GENOME", "TOOL_VERSION", "BED_FILE"],
  },
  {
    id: "omics-qc",
    name: "QC Metrics",
    domain: "Omics/NGS",
    description: "Coverage depth, contamination %",
    studyCount: 31,
    keyVariables: ["COVERAGE", "CONTAMINATION", "QC_PASS"],
  },
  {
    id: "omics-clonal",
    name: "Clonal Dynamics",
    domain: "Omics/NGS",
    description: "CCF, clonal evolution tracking",
    studyCount: 18,
    keyVariables: ["CCF", "CLONE_ID", "EVOLUTION"],
  },
]

// Keyword to category mapping for AI simulation
export const KEYWORD_TO_CATEGORIES: Record<string, string[]> = {
  oncology: ["ta-onc", "ta-immunonc"],
  cancer: ["ta-onc", "ta-immunonc"],
  lung: ["ta-onc"],
  ctdna: ["raw-ctdna", "omics-variants", "omics-global-scores"],
  "cell-free": ["raw-ctdna"],
  biomarker: ["sdtm-biomarker-labs", "adam-adbm", "raw-ctdna"],
  biomarkers: ["sdtm-biomarker-labs", "adam-adbm"],
  immunotherapy: ["ta-immunonc", "sdtm-exposure", "adam-adeff"],
  response: ["sdtm-tumor-response", "adam-adrs"],
  imaging: ["dicom-ids-timing", "dicom-acquisition", "dicom-quantitative"],
  pet: ["dicom-quantitative"],
  genomic: ["omics-variants", "omics-global-scores", "omics-sample-provenance"],
  genomics: ["omics-variants", "omics-global-scores", "omics-sample-provenance"],
  ngs: ["omics-variants", "omics-pipeline-meta", "omics-qc"],
  cardiovascular: ["ta-cardio"],
  clinical: ["sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events"],
  outcomes: ["adam-adrs", "adam-adtte"],
  survival: ["adam-adtte"],
  demographics: ["sdtm-demographics"],
  adverse: ["sdtm-adverse-events"],
  lab: ["sdtm-biomarker-labs", "adam-adbm"],
  laboratory: ["sdtm-biomarker-labs", "adam-adbm"],
}

// Extract keywords and suggest categories
export function extractKeywordsAndSuggestCategories(intent: string): {
  keywords: string[]
  suggestedCategories: DataCategory[]
} {
  const intentLower = intent.toLowerCase()
  const foundKeywords: string[] = []
  const categoryIds = new Set<string>()

  // Find keywords
  Object.keys(KEYWORD_TO_CATEGORIES).forEach((keyword) => {
    if (intentLower.includes(keyword)) {
      foundKeywords.push(keyword)
      KEYWORD_TO_CATEGORIES[keyword].forEach((catId) => categoryIds.add(catId))
    }
  })

  // Always include core categories
  const coreCategories = [
    "sdtm-demographics",
    "sdtm-exposure",
    "sdtm-adverse-events",
    "adam-adsl",
  ]
  coreCategories.forEach((id) => categoryIds.add(id))

  // Get category objects
  const suggestedCategories = DATA_CATEGORY_TAXONOMY.filter((cat) =>
    categoryIds.has(cat.id)
  )

  return {
    keywords: foundKeywords,
    suggestedCategories,
  }
}

// Dataset interfaces
// Approval workflow interfaces
export interface DatasetApprovalRequirement {
  id: string
  team: "GPT-Oncology" | "TALT-Legal" | "Publication Lead" | "GSP" | "Alliance Manager" | "GCL" | "IA" | "GPT-Cardiovascular" | "GPT-Respiratory" | "GPT-Metabolic"
  reason: string // Why this approval is needed
  status: "pending" | "approved" | "rejected" | "aware"
  requestedDate: Date
  dueDate?: Date
}

export interface DatasetApprovalAction {
  id: string
  requirementId: string // Links to which requirement this addresses
  action: "approved" | "rejected" | "aware"
  actorName: string
  actorEmail: string
  comment: string // Mandatory
  timestamp: Date
}

// Agreement of Terms (AoT) interface
export interface AgreementOfTerms {
  id: string
  version: string

  // Primary use categories (IMI-guided protocol)
  primaryUse: {
    understandDrugMechanism: boolean    // Understand how drugs work in the body
    understandDisease: boolean          // Better understand disease and health problems
    developDiagnosticTests: boolean     // Develop diagnostic tests for disease
    learnFromPastStudies: boolean       // Learn from past studies to plan new studies
    improveAnalysisMethods: boolean     // Improve scientific analysis methods
  }

  // Beyond primary use
  beyondPrimaryUse: {
    aiResearch: boolean                 // AI research / AI model training
    softwareDevelopment: boolean        // Software development and testing
  }

  // Publication
  publication: {
    internalCompanyRestricted: boolean  // Internal 'company restricted' findings
    externalPublication: boolean | "by_exception" // External publication
  }

  // External sharing
  externalSharing: {
    allowed: boolean
    process?: string                    // Description of external sharing process
  }

  // User scope (moved from Details step)
  userScope: {
    byDepartment?: string[]             // Workday org IDs
    byRole?: string[]                   // Job roles (Data Scientist, Engineer, etc.)
    explicitUsers?: string[]            // Individual PRIDs
    totalUserCount: number              // Calculated total
  }

  // AI suggestion metadata
  aiSuggested: boolean                  // Was this auto-suggested?
  userModified: string[]                // Which fields user manually changed

  // Conflict tracking
  acknowledgedConflicts?: {
    datasetId: string
    datasetName: string
    conflictDescription: string
    acknowledgedAt: Date
    acknowledgedBy: string
  }[]

  // Metadata
  createdAt: Date
  createdBy: string
  effectiveDate?: Date
  reviewDate?: Date
}

// Child dataset for parent/child hierarchy
export interface ChildDataset {
  id: string
  code: string                          // "DCODE-123-CLIN", "DCODE-123-GEN"
  name: string                          // "Clinical Outcomes", "Genomics Data"
  accessStatus: "open" | "ready" | "approval" | "missing"
  dataType?: string                     // "Clinical", "Genomics", "Imaging", "Biomarker", "PRO", "Safety"
  recordCount?: number                  // Number of records/samples
  lastUpdated?: string                  // ISO date
}

// Clinical metadata for dataset preview
export interface ClinicalMetadata {
  // Timeline
  enrollmentStartDate?: string        // ISO date, e.g., "2021-03-15"
  primaryCompletionDate?: string      // Primary endpoint reached
  studyLockDate?: string              // Database lock date

  // Personnel
  principalInvestigator?: string      // "Dr. Jane Smith, MD, PhD"
  sponsor?: string                    // "AstraZeneca"

  // Registry
  nctNumber?: string                  // "NCT04123456"

  // Study Design
  studyDesign?: string                // "Randomized, double-blind, placebo-controlled"
  primaryEndpoint?: string            // "Overall Survival (OS)"
  secondaryEndpoints?: string[]       // ["PFS", "ORR", "DoR"]

  // Status
  enrollmentStatus?: "Completed" | "Ongoing" | "Recruiting" | "Terminated"
  dataLockStatus?: "Locked" | "Unlocked" | "Interim"

  // Protocol
  protocolVersion?: string            // "v3.2"
  protocolAmendments?: number

  // Enrollment
  targetEnrollment?: number
  actualEnrollment?: number
  numberOfSites?: number
  treatmentArms?: string[]            // ["Pembrolizumab + Chemo", "Placebo + Chemo"]
  blindingType?: "Open-label" | "Single-blind" | "Double-blind"
  randomizationRatio?: string         // "1:1"
}

export interface Dataset {
  id: string
  code: string
  name: string
  therapeuticArea: string[]
  phase: string
  status: "Active" | "Closed"
  closedDate?: string
  geography: string[]
  patientCount: number
  description: string
  categories: string[] // Category IDs

  // Clinical study metadata for preview
  clinicalMetadata?: ClinicalMetadata

  // Collection context (DCM-specific)
  collections: string[] // Collection names this dataset appears in
  activeUsers: number
  organizations: number

  // Access provisioning
  accessBreakdown: {
    alreadyOpen: number // % already open
    readyToGrant: number // % ready to grant
    needsApproval: number // % needs approval
    missingLocation: number // % missing location
  }

  // Data access platform (where users access the data)
  accessPlatform: "Domino" | "SCP" | "AIBench"

  // Data layer (where data is stored)
  dataLayer: ("Starburst" | "S3" | "Snowflake" | "Domino")[]

  // Data location
  dataLocation: {
    clinical?: string
    genomics?: string
    imaging?: string
  }

  // Frequently bundled with
  frequentlyBundledWith: string[] // Dataset codes

  // Approval workflow (optional)
  approvalRequirements?: DatasetApprovalRequirement[]
  approvalActions?: DatasetApprovalAction[]

  // AoT metadata (restrictions required by this dataset)
  aotMetadata?: {
    // Restrictions (if true, collection AoT MUST enforce this)
    restrictML?: boolean              // Must restrict AI/ML use
    restrictPublication?: boolean     // Must restrict external publication
    restrictSoftwareDev?: boolean     // Must restrict software development
    requirePrimaryUseOnly?: boolean   // Only IMI-guided primary use allowed
    requireLegalReview?: boolean      // Requires TALT legal review

    // Geographic restrictions
    geographicRestrictions?: string[] // e.g., ["EU only", "No Asia"]

    // Time restrictions
    embargoUntil?: Date               // Data cannot be used until this date

    // Collaboration restrictions
    externalSharingAllowed?: boolean  // Can be shared with 3rd parties

    // Notes
    restrictionReason?: string        // Why these restrictions exist
  }

  // Child datasets (optional - if absent, this is a simple study)
  childDatasets?: ChildDataset[]
}

export const MOCK_DATASETS: Dataset[] = [
  {
    id: "dcode-042",
    code: "DCODE-042",
    name: "NSCLC ctDNA Monitoring - Phase III",
    therapeuticArea: ["ONC", "IMMUNONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-03-15",
    geography: ["US", "EU", "Asia"],
    patientCount: 890,
    description: "Longitudinal ctDNA monitoring in non-small cell lung cancer patients receiving immunotherapy. Includes pembrolizumab + chemotherapy vs chemotherapy alone arms.",
    clinicalMetadata: {
      enrollmentStartDate: "2021-03-15",
      primaryCompletionDate: "2023-09-20",
      studyLockDate: "2024-03-15",
      principalInvestigator: "Dr. Elena Vasquez, MD, PhD",
      sponsor: "Meridian Therapeutics",
      nctNumber: "NCT04892537",
      studyDesign: "Randomized, double-blind, placebo-controlled, multicenter Phase III",
      primaryEndpoint: "Overall Survival (OS)",
      secondaryEndpoints: ["Progression-Free Survival (PFS)", "ctDNA Clearance Rate", "Objective Response Rate (ORR)"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.3",
      protocolAmendments: 2,
      targetEnrollment: 900,
      actualEnrollment: 890,
      numberOfSites: 45,
      treatmentArms: ["Pembrolizumab + Carboplatin/Pemetrexed", "Placebo + Carboplatin/Pemetrexed"],
      blindingType: "Double-blind",
      randomizationRatio: "1:1",
    },
    categories: [
      "ta-onc",
      "ta-immunonc",
      "sdtm-demographics",
      "sdtm-exposure",
      "sdtm-tumor-response",
      "sdtm-biomarker-labs",
      "sdtm-adverse-events",
      "raw-ctdna",
      "raw-specimen-meta",
      "omics-variants",
      "omics-global-scores",
      "adam-adsl",
      "adam-adrs",
      "adam-adtte",
      "adam-adbm",
    ],
    collections: [
      "Oncology ctDNA Biomarker Collection",
      "Lung Cancer Phase III Studies",
      "Immunotherapy Response Collection",
    ],
    activeUsers: 87,
    organizations: 5,
    accessBreakdown: {
      alreadyOpen: 20,
      readyToGrant: 30,
      needsApproval: 40,
      missingLocation: 10,
    },
    accessPlatform: "Domino",
    dataLayer: ["Starburst", "S3"],
    dataLocation: {
      clinical: "S3",
      genomics: "SolveBio",
    },
    frequentlyBundledWith: ["DCODE-001", "DCODE-088", "DCODE-102"],
    aotMetadata: {
      restrictML: true,
      restrictPublication: true,
      restrictionReason: "Ongoing trial with immunotherapy data; competitive sensitivity requires ML and external publication restrictions"
    },
    approvalRequirements: [
      {
        id: "req-042-1",
        team: "GPT-Oncology",
        reason: "Active study data requires therapeutic area governance review for immunotherapy protocols",
        status: "pending",
        requestedDate: new Date("2025-11-15T10:30:00"),
        dueDate: new Date("2025-11-20T17:00:00"),
      },
      {
        id: "req-042-2",
        team: "TALT-Legal",
        reason: "Cross-geography data (US + EU + Asia) requires GDPR compliance review",
        status: "pending",
        requestedDate: new Date("2025-11-15T10:30:00"),
        dueDate: new Date("2025-11-22T17:00:00"),
      },
    ],
    approvalActions: [],
    childDatasets: [
      { id: "dcode-042-clin", code: "DCODE-042-CLIN", name: "Clinical Outcomes", accessStatus: "open", dataType: "Clinical", recordCount: 890 },
      { id: "dcode-042-bio", code: "DCODE-042-BIO", name: "Biomarker Samples", accessStatus: "ready", dataType: "Biomarker", recordCount: 12400 },
      { id: "dcode-042-ctdna", code: "DCODE-042-CTDNA", name: "ctDNA Sequencing", accessStatus: "ready", dataType: "Genomics", recordCount: 8900 },
      { id: "dcode-042-ae", code: "DCODE-042-AE", name: "Adverse Events", accessStatus: "approval", dataType: "Safety", recordCount: 2340 },
      { id: "dcode-042-img", code: "DCODE-042-IMG", name: "Tumor Imaging", accessStatus: "approval", dataType: "Imaging", recordCount: 4500 },
      { id: "dcode-042-pro", code: "DCODE-042-PRO", name: "Patient Reported Outcomes", accessStatus: "approval", dataType: "PRO", recordCount: 5200 },
      { id: "dcode-042-spec", code: "DCODE-042-SPEC", name: "Specimen Metadata", accessStatus: "approval", dataType: "Biomarker", recordCount: 15600 },
      { id: "dcode-042-raw", code: "DCODE-042-RAW", name: "Raw Sequencing Files", accessStatus: "missing", dataType: "Genomics", recordCount: 890 },
    ],
  },
  {
    id: "dcode-001",
    code: "DCODE-001",
    name: "NSCLC Genomic Profiling Study",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-11-20",
    geography: ["US", "EU"],
    patientCount: 1250,
    description: "Comprehensive genomic profiling of NSCLC tumors with matched normal samples. Focus on targetable mutations and resistance mechanisms.",
    clinicalMetadata: {
      enrollmentStartDate: "2019-06-01",
      primaryCompletionDate: "2023-05-15",
      studyLockDate: "2023-11-20",
      principalInvestigator: "Dr. Michael Chen, MD",
      sponsor: "Helios BioPharma",
      nctNumber: "NCT03845621",
      studyDesign: "Prospective, observational, multicenter genomic profiling study",
      primaryEndpoint: "Tumor Mutational Burden (TMB) Assessment",
      secondaryEndpoints: ["Actionable Mutation Detection Rate", "NGS Success Rate", "Treatment Correlation Analysis"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.4",
      protocolAmendments: 1,
      targetEnrollment: 1300,
      actualEnrollment: 1250,
      numberOfSites: 32,
      treatmentArms: ["Genomic Profiling Arm (single arm)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: [
      "ta-onc",
      "sdtm-demographics",
      "sdtm-exposure",
      "sdtm-tumor-response",
      "sdtm-specimens",
      "omics-variants",
      "omics-global-scores",
      "omics-cn-sv",
      "omics-sample-provenance",
      "omics-pipeline-meta",
      "adam-adsl",
    ],
    collections: [
      "Oncology ctDNA Biomarker Collection",
      "Lung Cancer Phase III Studies",
      "Genomic Profiling Collection",
      "NSCLC Targeted Therapy Studies",
      "Multi-Modal Oncology Data",
      "Oncology Outcomes Archive",
      "Phase III Closed Studies",
      "Biomarker Discovery Collection",
    ],
    activeUsers: 142,
    organizations: 8,
    accessBreakdown: {
      alreadyOpen: 40,
      readyToGrant: 40,
      needsApproval: 20,
      missingLocation: 0,
    },
    accessPlatform: "SCP",
    dataLayer: ["S3"],
    dataLocation: {
      clinical: "S3",
      genomics: "SolveBio",
    },
    frequentlyBundledWith: ["DCODE-042", "DCODE-067", "DCODE-088"],
    aotMetadata: {
      // No restrictions - study is closed, >6 months post-DBL, all clear for open access
    },
    approvalRequirements: [
      {
        id: "req-001-1",
        team: "GPT-Oncology",
        reason: "Genomic data access requires domain review",
        status: "approved",
        requestedDate: new Date("2025-11-10T09:00:00"),
        dueDate: new Date("2025-11-17T17:00:00"),
      },
    ],
    approvalActions: [
      {
        id: "act-001-1",
        requirementId: "req-001-1",
        action: "approved",
        actorName: "Dr. Sarah Martinez",
        actorEmail: "sarah.martinez@astrazeneca.com",
        comment: "All governance criteria met. Clinical data review complete. Study is closed and all documentation is in order for researcher access.",
        timestamp: new Date("2025-11-12T14:23:00"),
      },
    ],
    childDatasets: [
      { id: "dcode-001-clin", code: "DCODE-001-CLIN", name: "Clinical Demographics", accessStatus: "open", dataType: "Clinical", recordCount: 1250 },
      { id: "dcode-001-gen", code: "DCODE-001-GEN", name: "Tumor Genomics", accessStatus: "open", dataType: "Genomics", recordCount: 3200 },
      { id: "dcode-001-wes", code: "DCODE-001-WES", name: "Whole Exome Sequencing", accessStatus: "ready", dataType: "Genomics", recordCount: 2500 },
      { id: "dcode-001-tmb", code: "DCODE-001-TMB", name: "TMB Calculations", accessStatus: "ready", dataType: "Biomarker", recordCount: 1250 },
      { id: "dcode-001-trt", code: "DCODE-001-TRT", name: "Treatment Response", accessStatus: "approval", dataType: "Clinical", recordCount: 1250 },
    ],
  },
  {
    id: "dcode-067",
    code: "DCODE-067",
    name: "Immunotherapy Response - Phase III",
    therapeuticArea: ["IMMUNONC", "ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-01-10",
    geography: ["US", "EU", "Asia"],
    patientCount: 756,
    description: "Multi-center study of immunotherapy response biomarkers in various solid tumors. Includes ctDNA, PET imaging, and clinical outcomes.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-09-01",
      primaryCompletionDate: "2023-06-30",
      studyLockDate: "2024-01-10",
      principalInvestigator: "Dr. Sarah Martinez, MD, PhD",
      sponsor: "Vertex Oncology",
      nctNumber: "NCT04567891",
      studyDesign: "Prospective, multicenter, biomarker-driven observational study",
      primaryEndpoint: "Correlation of Biomarker Levels with Objective Response Rate",
      secondaryEndpoints: ["ctDNA Dynamics Correlation", "PET Response Assessment", "Time to Treatment Failure"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v3.1",
      protocolAmendments: 3,
      targetEnrollment: 800,
      actualEnrollment: 756,
      numberOfSites: 28,
      treatmentArms: ["Pembrolizumab Monotherapy", "Nivolumab Monotherapy", "Ipilimumab + Nivolumab"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: [
      "ta-onc",
      "ta-immunonc",
      "sdtm-demographics",
      "sdtm-exposure",
      "sdtm-tumor-response",
      "sdtm-biomarker-labs",
      "raw-ctdna",
      "dicom-quantitative",
      "adam-adsl",
      "adam-adrs",
      "adam-adtte",
    ],
    collections: [
      "Immunotherapy Response Collection",
      "Multi-Modal Oncology Data",
    ],
    activeUsers: 62,
    organizations: 4,
    accessBreakdown: {
      alreadyOpen: 30,
      readyToGrant: 30,
      needsApproval: 30,
      missingLocation: 10,
    },
    accessPlatform: "AIBench",
    dataLayer: ["Snowflake"],
    dataLocation: {
      clinical: "S3",
      imaging: "DICOM Archives",
    },
    frequentlyBundledWith: ["DCODE-042", "DCODE-102"],
    aotMetadata: {
      restrictPublication: true,
      restrictSoftwareDev: true,
      restrictionReason: "Data intended for upcoming publication; external publication and software dev restricted until manuscript published"
    },
    approvalRequirements: [
      {
        id: "req-067-1",
        team: "Publication Lead",
        reason: "Dataset includes data intended for publication in upcoming manuscript",
        status: "pending",
        requestedDate: new Date("2025-11-16T11:15:00"),
        dueDate: new Date("2025-11-23T17:00:00"),
      },
    ],
    approvalActions: [],
    childDatasets: [
      { id: "dcode-067-clin", code: "DCODE-067-CLIN", name: "Clinical Response Data", accessStatus: "open", dataType: "Clinical", recordCount: 756 },
      { id: "dcode-067-bio", code: "DCODE-067-BIO", name: "Biomarker Panel Results", accessStatus: "open", dataType: "Biomarker", recordCount: 4500 },
      { id: "dcode-067-pet", code: "DCODE-067-PET", name: "PET Imaging", accessStatus: "ready", dataType: "Imaging", recordCount: 2268 },
      { id: "dcode-067-ctdna", code: "DCODE-067-CTDNA", name: "ctDNA Dynamics", accessStatus: "ready", dataType: "Genomics", recordCount: 5600 },
      { id: "dcode-067-ae", code: "DCODE-067-AE", name: "Adverse Events", accessStatus: "approval", dataType: "Safety", recordCount: 1890 },
      { id: "dcode-067-surv", code: "DCODE-067-SURV", name: "Survival Outcomes", accessStatus: "approval", dataType: "Clinical", recordCount: 756 },
    ],
  },
  {
    id: "dcode-088",
    code: "DCODE-088",
    name: "Lung Cancer Clinical Outcomes",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-09-05",
    geography: ["US"],
    patientCount: 1120,
    description: "Long-term follow-up study of lung cancer patients across multiple treatment modalities. Rich clinical outcomes data with OS and PFS endpoints.",
    clinicalMetadata: {
      enrollmentStartDate: "2018-01-15",
      primaryCompletionDate: "2022-12-20",
      studyLockDate: "2023-09-05",
      principalInvestigator: "Dr. James Wilson, MD",
      sponsor: "Axiom Pharmaceuticals",
      nctNumber: "NCT03123456",
      studyDesign: "Randomized, open-label, multicenter Phase III",
      primaryEndpoint: "Overall Survival (OS)",
      secondaryEndpoints: ["Progression-Free Survival (PFS)", "Duration of Response", "Quality of Life (EORTC QLQ-C30)"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v4.0",
      protocolAmendments: 4,
      targetEnrollment: 1100,
      actualEnrollment: 1120,
      numberOfSites: 52,
      treatmentArms: ["Osimertinib 80mg QD", "Standard of Care Chemotherapy"],
      blindingType: "Open-label",
      randomizationRatio: "2:1",
    },
    categories: [
      "ta-onc",
      "sdtm-demographics",
      "sdtm-exposure",
      "sdtm-tumor-response",
      "sdtm-adverse-events",
      "sdtm-conmeds",
      "adam-adsl",
      "adam-adrs",
      "adam-adtte",
    ],
    collections: [
      "Lung Cancer Phase III Studies",
      "Oncology Outcomes Archive",
    ],
    activeUsers: 95,
    organizations: 6,
    accessBreakdown: {
      alreadyOpen: 50,
      readyToGrant: 50,
      needsApproval: 0,
      missingLocation: 0,
    },
    accessPlatform: "Domino",
    dataLayer: ["Starburst"],
    dataLocation: {
      clinical: "S3",
    },
    frequentlyBundledWith: ["DCODE-001", "DCODE-042"],
    aotMetadata: {
      // No restrictions - study is closed, published, all clear for open access
    },
    approvalRequirements: [
      {
        id: "req-088-1",
        team: "GPT-Oncology",
        reason: "Standard review for historical study data access",
        status: "aware",
        requestedDate: new Date("2025-11-13T08:00:00"),
      },
    ],
    approvalActions: [
      {
        id: "act-088-1",
        requirementId: "req-088-1",
        action: "aware",
        actorName: "Dr. Michael Chen",
        actorEmail: "michael.chen@astrazeneca.com",
        comment: "Acknowledged. Study is closed and published. No restrictions on access for routine research activities.",
        timestamp: new Date("2025-11-13T15:45:00"),
      },
    ],
    childDatasets: [
      { id: "dcode-088-clin", code: "DCODE-088-CLIN", name: "Clinical Endpoints", accessStatus: "open", dataType: "Clinical", recordCount: 567 },
      { id: "dcode-088-surv", code: "DCODE-088-SURV", name: "Survival Data", accessStatus: "open", dataType: "Clinical", recordCount: 567 },
      { id: "dcode-088-trt", code: "DCODE-088-TRT", name: "Treatment History", accessStatus: "ready", dataType: "Clinical", recordCount: 2100 },
      { id: "dcode-088-qol", code: "DCODE-088-QOL", name: "Quality of Life", accessStatus: "ready", dataType: "PRO", recordCount: 1890 },
    ],
  },
  {
    id: "dcode-102",
    code: "DCODE-102",
    name: "PET Imaging Substudy",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-02-28",
    geography: ["US", "EU"],
    patientCount: 234,
    description: "PET imaging substudy with quantitative tumor burden assessments (MTV, TLG, SUVmax) correlated with clinical outcomes.",
    clinicalMetadata: {
      enrollmentStartDate: "2021-04-01",
      primaryCompletionDate: "2023-10-15",
      studyLockDate: "2024-02-28",
      principalInvestigator: "Dr. Robert Kim, MD, PhD",
      sponsor: "NovaCure Sciences",
      nctNumber: "NCT04789012",
      studyDesign: "Prospective imaging substudy, single-arm",
      primaryEndpoint: "Metabolic Tumor Volume (MTV) Change at Week 8",
      secondaryEndpoints: ["Total Lesion Glycolysis (TLG)", "SUVmax Correlation with PFS", "Imaging-Based Response Rate"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.2",
      protocolAmendments: 1,
      targetEnrollment: 250,
      actualEnrollment: 234,
      numberOfSites: 15,
      treatmentArms: ["PET Imaging Arm (single arm substudy)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: [
      "ta-onc",
      "sdtm-demographics",
      "dicom-ids-timing",
      "dicom-acquisition",
      "dicom-quantitative",
      "adam-adsl",
      "adam-adrs",
    ],
    collections: [
      "Multi-Modal Oncology Data",
      "Imaging Biomarker Studies",
    ],
    activeUsers: 45,
    organizations: 3,
    accessBreakdown: {
      alreadyOpen: 20,
      readyToGrant: 40,
      needsApproval: 40,
      missingLocation: 0,
    },
    accessPlatform: "SCP",
    dataLayer: ["S3", "Snowflake"],
    dataLocation: {
      clinical: "S3",
      imaging: "DICOM Archives",
    },
    frequentlyBundledWith: ["DCODE-042", "DCODE-067"],
    approvalRequirements: [
      {
        id: "req-102-1",
        team: "GPT-Oncology",
        reason: "PET imaging data requires oncology domain review",
        status: "approved",
        requestedDate: new Date("2025-11-14T09:30:00"),
        dueDate: new Date("2025-11-21T17:00:00"),
      },
      {
        id: "req-102-2",
        team: "TALT-Legal",
        reason: "Cross-border imaging data transfer requires legal review",
        status: "pending",
        requestedDate: new Date("2025-11-14T09:30:00"),
        dueDate: new Date("2025-11-25T17:00:00"),
      },
    ],
    approvalActions: [
      {
        id: "act-102-1",
        requirementId: "req-102-1",
        action: "approved",
        actorName: "Dr. Sarah Martinez",
        actorEmail: "sarah.martinez@astrazeneca.com",
        comment: "Imaging protocols reviewed. Quality metrics are acceptable for research use. Approved for access.",
        timestamp: new Date("2025-11-15T10:15:00"),
      },
    ],
    childDatasets: [
      { id: "dcode-102-pet", code: "DCODE-102-PET", name: "PET Scans", accessStatus: "open", dataType: "Imaging", recordCount: 702 },
      { id: "dcode-102-mtv", code: "DCODE-102-MTV", name: "MTV Calculations", accessStatus: "ready", dataType: "Imaging", recordCount: 234 },
      { id: "dcode-102-tlg", code: "DCODE-102-TLG", name: "TLG Analysis", accessStatus: "ready", dataType: "Imaging", recordCount: 234 },
      { id: "dcode-102-clin", code: "DCODE-102-CLIN", name: "Clinical Correlation", accessStatus: "approval", dataType: "Clinical", recordCount: 234 },
      { id: "dcode-102-resp", code: "DCODE-102-RESP", name: "Response Assessment", accessStatus: "approval", dataType: "Clinical", recordCount: 234 },
    ],
  },
  {
    id: "dcode-134",
    code: "DCODE-134",
    name: "Biomarker Validation Study",
    therapeuticArea: ["ONC"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-12-15",
    geography: ["US"],
    patientCount: 345,
    description: "Prospective validation of ctDNA biomarkers for early response prediction in NSCLC.",
    clinicalMetadata: {
      enrollmentStartDate: "2021-02-01",
      primaryCompletionDate: "2023-08-15",
      studyLockDate: "2023-12-15",
      principalInvestigator: "Dr. Laura Thompson, MD",
      sponsor: "Tempest BioSciences",
      nctNumber: "NCT04234567",
      studyDesign: "Prospective, single-arm biomarker validation study",
      primaryEndpoint: "ctDNA Clearance Rate Correlation with Response",
      secondaryEndpoints: ["Sensitivity and Specificity of ctDNA", "Lead Time vs Radiographic Response", "Minimal Residual Disease Detection"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.0",
      protocolAmendments: 1,
      targetEnrollment: 350,
      actualEnrollment: 345,
      numberOfSites: 18,
      treatmentArms: ["Biomarker Validation Arm (single arm)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: [
      "ta-onc",
      "sdtm-demographics",
      "sdtm-exposure",
      "sdtm-biomarker-labs",
      "raw-ctdna",
      "raw-specimen-meta",
      "raw-assay-meta",
      "adam-adsl",
      "adam-adbm",
    ],
    collections: ["Oncology ctDNA Biomarker Collection"],
    activeUsers: 28,
    organizations: 2,
    accessBreakdown: {
      alreadyOpen: 30,
      readyToGrant: 40,
      needsApproval: 30,
      missingLocation: 0,
    },
    accessPlatform: "AIBench",
    dataLayer: ["Starburst", "S3", "Snowflake"],
    dataLocation: {
      clinical: "S3",
    },
    frequentlyBundledWith: ["DCODE-042"],
    approvalRequirements: [
      {
        id: "req-134-1",
        team: "GSP",
        reason: "Biomarker data requires safety representative review",
        status: "rejected",
        requestedDate: new Date("2025-11-11T14:00:00"),
        dueDate: new Date("2025-11-18T17:00:00"),
      },
    ],
    approvalActions: [
      {
        id: "act-134-1",
        requirementId: "req-134-1",
        action: "rejected",
        actorName: "Dr. James Wilson",
        actorEmail: "james.wilson@astrazeneca.com",
        comment: "Rejected due to incomplete safety documentation. Requestor needs to provide updated AE coding dictionary and safety monitoring plan before data can be released.",
        timestamp: new Date("2025-11-14T16:30:00"),
      },
    ],
    childDatasets: [
      { id: "dcode-134-clin", code: "DCODE-134-CLIN", name: "Clinical Demographics", accessStatus: "open", dataType: "Clinical", recordCount: 345 },
      { id: "dcode-134-ctdna", code: "DCODE-134-CTDNA", name: "ctDNA Samples", accessStatus: "ready", dataType: "Biomarker", recordCount: 2760 },
      { id: "dcode-134-resp", code: "DCODE-134-RESP", name: "Response Correlation", accessStatus: "ready", dataType: "Clinical", recordCount: 345 },
      { id: "dcode-134-mrd", code: "DCODE-134-MRD", name: "MRD Analysis", accessStatus: "approval", dataType: "Genomics", recordCount: 1200 },
    ],
  },
  {
    id: "dcode-156",
    code: "DCODE-156",
    name: "Active NSCLC Trial",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Active",
    geography: ["US", "EU", "Asia"],
    patientCount: 450,
    description: "Ongoing phase III study of novel targeted therapy in NSCLC. Data access requires GPT-Oncology approval.",
    clinicalMetadata: {
      enrollmentStartDate: "2023-06-01",
      primaryCompletionDate: "2026-12-31",
      principalInvestigator: "Dr. David Park, MD, PhD",
      sponsor: "Pinnacle Therapeutics",
      nctNumber: "NCT05678901",
      studyDesign: "Randomized, double-blind, placebo-controlled, multicenter Phase III",
      primaryEndpoint: "Progression-Free Survival (PFS)",
      secondaryEndpoints: ["Overall Survival (OS)", "Objective Response Rate (ORR)", "Duration of Response (DoR)"],
      enrollmentStatus: "Ongoing",
      dataLockStatus: "Unlocked",
      protocolVersion: "v1.1",
      protocolAmendments: 0,
      targetEnrollment: 600,
      actualEnrollment: 450,
      numberOfSites: 42,
      treatmentArms: ["Novel EGFR TKI 150mg QD", "Placebo QD"],
      blindingType: "Double-blind",
      randomizationRatio: "1:1",
    },
    categories: [
      "ta-onc",
      "sdtm-demographics",
      "sdtm-exposure",
      "sdtm-tumor-response",
      "sdtm-adverse-events",
      "adam-adsl",
    ],
    collections: [],
    activeUsers: 12,
    organizations: 2,
    accessBreakdown: {
      alreadyOpen: 0,
      readyToGrant: 0,
      needsApproval: 100,
      missingLocation: 0,
    },
    accessPlatform: "Domino",
    dataLayer: ["Starburst", "S3"],
    dataLocation: {
      clinical: "S3",
    },
    frequentlyBundledWith: [],
    approvalRequirements: [
      {
        id: "req-156-1",
        team: "GPT-Oncology",
        reason: "Active study requires formal GPT review before data release",
        status: "pending",
        requestedDate: new Date("2025-11-12T10:00:00"),
        dueDate: new Date("2025-11-19T17:00:00"),
      },
      {
        id: "req-156-2",
        team: "Alliance Manager",
        reason: "Study involves product collaboration partner, requires partner approval",
        status: "aware",
        requestedDate: new Date("2025-11-12T10:00:00"),
      },
    ],
    approvalActions: [
      {
        id: "act-156-1",
        requirementId: "req-156-2",
        action: "aware",
        actorName: "Jennifer Brooks",
        actorEmail: "jennifer.brooks@astrazeneca.com",
        comment: "Alliance manager notified. Partner has been contacted for formal approval. Expect response within 5 business days.",
        timestamp: new Date("2025-11-13T09:15:00"),
      },
      {
        id: "act-156-2",
        requirementId: "req-156-2",
        action: "aware",
        actorName: "Dr. Michael Chen",
        actorEmail: "michael.chen@astrazeneca.com",
        comment: "Also made aware. Coordinating with alliance team on partnership agreement terms.",
        timestamp: new Date("2025-11-14T11:30:00"),
      },
    ],
    childDatasets: [
      { id: "dcode-156-clin", code: "DCODE-156-CLIN", name: "Clinical Data", accessStatus: "approval", dataType: "Clinical", recordCount: 450 },
      { id: "dcode-156-trt", code: "DCODE-156-TRT", name: "Treatment Exposure", accessStatus: "approval", dataType: "Clinical", recordCount: 1350 },
      { id: "dcode-156-ae", code: "DCODE-156-AE", name: "Adverse Events", accessStatus: "approval", dataType: "Safety", recordCount: 890 },
      { id: "dcode-156-resp", code: "DCODE-156-RESP", name: "Tumor Response", accessStatus: "approval", dataType: "Clinical", recordCount: 450 },
      { id: "dcode-156-lab", code: "DCODE-156-LAB", name: "Laboratory Results", accessStatus: "approval", dataType: "Clinical", recordCount: 5400 },
    ],
  },
  {
    id: "dcode-178",
    code: "DCODE-178",
    name: "Ongoing Immunotherapy Study",
    therapeuticArea: ["IMMUNONC", "ONC"],
    phase: "II",
    status: "Active",
    geography: ["US"],
    patientCount: 180,
    description: "Active immunotherapy study with interim data available for qualified researchers.",
    clinicalMetadata: {
      enrollmentStartDate: "2024-01-15",
      primaryCompletionDate: "2026-06-30",
      principalInvestigator: "Dr. Jennifer Brooks, MD",
      sponsor: "Atlas Oncology",
      nctNumber: "NCT05890123",
      studyDesign: "Open-label, single-arm, multicenter Phase II",
      primaryEndpoint: "Objective Response Rate (ORR) by RECIST 1.1",
      secondaryEndpoints: ["Disease Control Rate (DCR)", "Duration of Response (DoR)", "Safety Profile"],
      enrollmentStatus: "Recruiting",
      dataLockStatus: "Interim",
      protocolVersion: "v1.0",
      protocolAmendments: 0,
      targetEnrollment: 200,
      actualEnrollment: 180,
      numberOfSites: 12,
      treatmentArms: ["Durvalumab 1500mg Q4W + Tremelimumab 75mg Q4W"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: [
      "ta-immunonc",
      "sdtm-demographics",
      "sdtm-exposure",
      "sdtm-biomarker-labs",
      "adam-adsl",
    ],
    collections: [],
    activeUsers: 8,
    organizations: 1,
    accessBreakdown: {
      alreadyOpen: 0,
      readyToGrant: 0,
      needsApproval: 100,
      missingLocation: 0,
    },
    accessPlatform: "SCP",
    dataLayer: ["S3"],
    dataLocation: {
      clinical: "S3",
    },
    frequentlyBundledWith: [],
    approvalRequirements: [
      {
        id: "req-178-1",
        team: "GPT-Oncology",
        reason: "Active immunotherapy study requires ongoing review",
        status: "pending",
        requestedDate: new Date("2025-11-17T08:45:00"),
        dueDate: new Date("2025-11-24T17:00:00"),
      },
    ],
    approvalActions: [],
  },
  {
    id: "dcode-203",
    code: "DCODE-203",
    name: "Cardiovascular Outcomes Study - Phase IV",
    therapeuticArea: ["CARDIO"],
    phase: "IV",
    status: "Closed",
    closedDate: "2023-08-20",
    geography: ["US", "EU"],
    patientCount: 2340,
    description: "Post-marketing surveillance study of cardiovascular outcomes in patients receiving novel anticoagulant therapy.",
    clinicalMetadata: {
      enrollmentStartDate: "2017-03-01",
      primaryCompletionDate: "2023-02-28",
      studyLockDate: "2023-08-20",
      principalInvestigator: "Dr. Richard Anderson, MD, FACC",
      sponsor: "CardioVenture Labs",
      nctNumber: "NCT02987654",
      studyDesign: "Prospective, observational, multicenter Phase IV registry",
      primaryEndpoint: "Major Adverse Cardiovascular Events (MACE)",
      secondaryEndpoints: ["All-cause Mortality", "Stroke/TIA Rate", "Major Bleeding Events"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.1",
      protocolAmendments: 2,
      targetEnrollment: 2500,
      actualEnrollment: 2340,
      numberOfSites: 85,
      treatmentArms: ["Apixaban 5mg BID", "Apixaban 2.5mg BID (dose-reduced)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-cardio", "sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Cardiovascular Outcomes Archive", "Phase IV Studies"],
    activeUsers: 156,
    organizations: 12,
    accessBreakdown: { alreadyOpen: 60, readyToGrant: 30, needsApproval: 10, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-215", "DCODE-289"],
    approvalRequirements: [
      {
        id: "req-203-1",
        team: "GPT-Cardiovascular",
        reason: "Cardiovascular outcomes data requires domain governance review",
        status: "pending",
        requestedDate: new Date("2025-11-16T13:20:00"),
        dueDate: new Date("2025-11-23T17:00:00"),
      },
    ],
    approvalActions: [],
    childDatasets: [
      { id: "dcode-203-clin", code: "DCODE-203-CLIN", name: "Clinical Outcomes", accessStatus: "open", dataType: "Clinical", recordCount: 2340 },
      { id: "dcode-203-mace", code: "DCODE-203-MACE", name: "MACE Events", accessStatus: "open", dataType: "Clinical", recordCount: 234 },
      { id: "dcode-203-bleed", code: "DCODE-203-BLEED", name: "Bleeding Events", accessStatus: "ready", dataType: "Safety", recordCount: 156 },
      { id: "dcode-203-trt", code: "DCODE-203-TRT", name: "Treatment Exposure", accessStatus: "ready", dataType: "Clinical", recordCount: 8900 },
      { id: "dcode-203-ecg", code: "DCODE-203-ECG", name: "ECG Recordings", accessStatus: "approval", dataType: "Clinical", recordCount: 12400 },
    ],
  },
  {
    id: "dcode-215",
    code: "DCODE-215",
    name: "Heart Failure Biomarker Study",
    therapeuticArea: ["CARDIO"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-01-15",
    geography: ["US", "EU", "Asia"],
    patientCount: 890,
    description: "Prospective evaluation of novel biomarkers for heart failure progression and treatment response.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-07-01",
      primaryCompletionDate: "2023-09-30",
      studyLockDate: "2024-01-15",
      principalInvestigator: "Dr. Maria Santos, MD, PhD",
      sponsor: "Horizon Heart Sciences",
      nctNumber: "NCT04345678",
      studyDesign: "Prospective, multicenter, observational biomarker study",
      primaryEndpoint: "NT-proBNP Level Correlation with Heart Failure Hospitalization",
      secondaryEndpoints: ["Troponin T Dynamics", "GDF-15 Prognostic Value", "Biomarker Panel Performance"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.3",
      protocolAmendments: 1,
      targetEnrollment: 900,
      actualEnrollment: 890,
      numberOfSites: 38,
      treatmentArms: ["Biomarker Assessment Cohort (single arm)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-cardio", "sdtm-demographics", "sdtm-biomarker-labs", "sdtm-exposure", "adam-adsl"],
    collections: ["Cardiovascular Biomarker Collection"],
    activeUsers: 73,
    organizations: 5,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-203"],
    approvalRequirements: [
      {
        id: "req-215-1",
        team: "GPT-Cardiovascular",
        reason: "Biomarker data requires cardiovascular domain review",
        status: "pending",
        requestedDate: new Date("2025-11-17T10:00:00"),
        dueDate: new Date("2025-11-24T17:00:00"),
      },
      {
        id: "req-215-2",
        team: "TALT-Legal",
        reason: "Multi-region study with GDPR considerations",
        status: "pending",
        requestedDate: new Date("2025-11-17T10:00:00"),
        dueDate: new Date("2025-11-26T17:00:00"),
      },
    ],
    approvalActions: [],
    childDatasets: [
      { id: "dcode-215-clin", code: "DCODE-215-CLIN", name: "Clinical Data", accessStatus: "open", dataType: "Clinical", recordCount: 890 },
      { id: "dcode-215-bnp", code: "DCODE-215-BNP", name: "NT-proBNP Levels", accessStatus: "open", dataType: "Biomarker", recordCount: 4450 },
      { id: "dcode-215-trop", code: "DCODE-215-TROP", name: "Troponin Dynamics", accessStatus: "ready", dataType: "Biomarker", recordCount: 3560 },
      { id: "dcode-215-gdf", code: "DCODE-215-GDF", name: "GDF-15 Analysis", accessStatus: "ready", dataType: "Biomarker", recordCount: 2670 },
      { id: "dcode-215-hosp", code: "DCODE-215-HOSP", name: "Hospitalization Events", accessStatus: "approval", dataType: "Clinical", recordCount: 345 },
    ],
  },
  {
    id: "dcode-227",
    code: "DCODE-227",
    name: "Alzheimer's Disease Imaging Study",
    therapeuticArea: ["NEURO"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-11-30",
    geography: ["US", "EU"],
    patientCount: 567,
    description: "Longitudinal MRI and PET imaging study in early Alzheimer's disease with amyloid and tau imaging.",
    clinicalMetadata: {
      enrollmentStartDate: "2019-09-01",
      primaryCompletionDate: "2023-06-30",
      studyLockDate: "2023-11-30",
      principalInvestigator: "Dr. Patricia Williams, MD, PhD",
      sponsor: "NeuroPath Innovations",
      nctNumber: "NCT03789012",
      studyDesign: "Prospective, longitudinal, multicenter imaging study",
      primaryEndpoint: "Amyloid PET SUVR Change from Baseline",
      secondaryEndpoints: ["Tau PET Accumulation Rate", "Hippocampal Volume Change", "Cognitive Decline Correlation (MMSE/ADAS-Cog)"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.2",
      protocolAmendments: 2,
      targetEnrollment: 600,
      actualEnrollment: 567,
      numberOfSites: 25,
      treatmentArms: ["Imaging Follow-up Cohort (single arm)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-neuro", "sdtm-demographics", "dicom-ids-timing", "dicom-acquisition", "dicom-quantitative", "adam-adsl"],
    collections: ["Neurology Imaging Archive", "Alzheimer's Research Collection"],
    activeUsers: 91,
    organizations: 7,
    accessBreakdown: { alreadyOpen: 30, readyToGrant: 30, needsApproval: 30, missingLocation: 10 },
    accessPlatform: "SCP",
    dataLayer: ["S3", "Snowflake"],
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-239", "DCODE-251"],
    approvalRequirements: [
      {
        id: "req-227-1",
        team: "GCL",
        reason: "Neuroimaging data requires clinical lead review for research use",
        status: "pending",
        requestedDate: new Date("2025-11-16T14:30:00"),
        dueDate: new Date("2025-11-23T17:00:00"),
      },
    ],
    approvalActions: [],
    childDatasets: [
      { id: "dcode-227-mri", code: "DCODE-227-MRI", name: "Structural MRI", accessStatus: "open", dataType: "Imaging", recordCount: 1700 },
      { id: "dcode-227-amypet", code: "DCODE-227-AMYPET", name: "Amyloid PET", accessStatus: "ready", dataType: "Imaging", recordCount: 1134 },
      { id: "dcode-227-taupet", code: "DCODE-227-TAUPET", name: "Tau PET", accessStatus: "ready", dataType: "Imaging", recordCount: 850 },
      { id: "dcode-227-cog", code: "DCODE-227-COG", name: "Cognitive Assessments", accessStatus: "approval", dataType: "Clinical", recordCount: 4500 },
      { id: "dcode-227-csf", code: "DCODE-227-CSF", name: "CSF Biomarkers", accessStatus: "approval", dataType: "Biomarker", recordCount: 567 },
    ],
  },
  {
    id: "dcode-239",
    code: "DCODE-239",
    name: "Parkinson's Disease Progression Study",
    therapeuticArea: ["NEURO"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-10-10",
    geography: ["US"],
    patientCount: 423,
    description: "Multi-year observational study tracking Parkinson's disease progression with clinical and imaging endpoints.",
    clinicalMetadata: {
      enrollmentStartDate: "2018-05-01",
      primaryCompletionDate: "2023-04-30",
      studyLockDate: "2023-10-10",
      principalInvestigator: "Dr. Alexander Reed, MD",
      sponsor: "NeuroPath Innovations",
      nctNumber: "NCT03456789",
      studyDesign: "Prospective, longitudinal, multicenter observational study",
      primaryEndpoint: "MDS-UPDRS Total Score Change from Baseline",
      secondaryEndpoints: ["Dopamine Transporter SPECT Decline", "Non-Motor Symptom Scale", "Quality of Life (PDQ-39)"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.5",
      protocolAmendments: 2,
      targetEnrollment: 450,
      actualEnrollment: 423,
      numberOfSites: 22,
      treatmentArms: ["Observational Cohort (single arm)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-neuro", "sdtm-demographics", "sdtm-exposure", "dicom-quantitative", "adam-adsl"],
    collections: ["Neurology Imaging Archive", "Movement Disorders Collection"],
    activeUsers: 54,
    organizations: 4,
    accessBreakdown: { alreadyOpen: 50, readyToGrant: 30, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Starburst", "S3", "Snowflake"],
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-227"],
    approvalRequirements: [
      {
        id: "req-239-1",
        team: "IA",
        reason: "Observational study data requires information advocate review",
        status: "pending",
        requestedDate: new Date("2025-11-18T09:00:00"),
        dueDate: new Date("2025-11-25T17:00:00"),
      },
    ],
    approvalActions: [],
    childDatasets: [
      { id: "dcode-239-clin", code: "DCODE-239-CLIN", name: "Clinical Assessments", accessStatus: "open", dataType: "Clinical", recordCount: 890 },
      { id: "dcode-239-updrs", code: "DCODE-239-UPDRS", name: "UPDRS Scores", accessStatus: "open", dataType: "Clinical", recordCount: 4450 },
      { id: "dcode-239-datscan", code: "DCODE-239-DAT", name: "DaTscan Imaging", accessStatus: "ready", dataType: "Imaging", recordCount: 1780 },
      { id: "dcode-239-gait", code: "DCODE-239-GAIT", name: "Gait Analysis", accessStatus: "approval", dataType: "Clinical", recordCount: 890 },
    ],
  },
  {
    id: "dcode-251",
    code: "DCODE-251",
    name: "Multiple Sclerosis Treatment Trial",
    therapeuticArea: ["NEURO"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-02-05",
    geography: ["US", "EU", "Asia"],
    patientCount: 1234,
    description: "Phase III study of novel disease-modifying therapy in relapsing-remitting multiple sclerosis.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-01-15",
      primaryCompletionDate: "2023-07-31",
      studyLockDate: "2024-02-05",
      principalInvestigator: "Dr. Catherine Hayes, MD, PhD",
      sponsor: "Cerebral Dynamics",
      nctNumber: "NCT04012345",
      studyDesign: "Randomized, double-blind, active-controlled, multicenter Phase III",
      primaryEndpoint: "Annualized Relapse Rate (ARR)",
      secondaryEndpoints: ["Confirmed Disability Progression (CDP)", "T2 Lesion Volume Change", "Brain Volume Loss"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.0",
      protocolAmendments: 1,
      targetEnrollment: 1250,
      actualEnrollment: 1234,
      numberOfSites: 65,
      treatmentArms: ["Novel BTKi 300mg QD", "Dimethyl Fumarate 240mg BID"],
      blindingType: "Double-blind",
      randomizationRatio: "1:1",
    },
    categories: ["ta-neuro", "sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events", "dicom-quantitative", "adam-adsl", "adam-adtte"],
    collections: ["Neurology Imaging Archive", "Autoimmune Disease Studies"],
    activeUsers: 102,
    organizations: 8,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 35, needsApproval: 30, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst", "S3"],
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-227", "DCODE-239"],
    childDatasets: [
      { id: "dcode-251-clin", code: "DCODE-251-CLIN", name: "Clinical Outcomes", accessStatus: "open", dataType: "Clinical", recordCount: 1234 },
      { id: "dcode-251-mri", code: "DCODE-251-MRI", name: "Brain MRI", accessStatus: "open", dataType: "Imaging", recordCount: 6170 },
      { id: "dcode-251-relapse", code: "DCODE-251-REL", name: "Relapse Data", accessStatus: "ready", dataType: "Clinical", recordCount: 456 },
      { id: "dcode-251-edss", code: "DCODE-251-EDSS", name: "EDSS Scores", accessStatus: "ready", dataType: "Clinical", recordCount: 4900 },
      { id: "dcode-251-ae", code: "DCODE-251-AE", name: "Adverse Events", accessStatus: "approval", dataType: "Safety", recordCount: 890 },
      { id: "dcode-251-trt", code: "DCODE-251-TRT", name: "Treatment Exposure", accessStatus: "approval", dataType: "Clinical", recordCount: 3700 },
    ],
  },
  {
    id: "dcode-263",
    code: "DCODE-263",
    name: "Type 2 Diabetes Cardiovascular Safety Study",
    therapeuticArea: ["ENDO", "CARDIO"],
    phase: "IV",
    status: "Closed",
    closedDate: "2023-07-15",
    geography: ["Global"],
    patientCount: 8956,
    description: "Large cardiovascular outcomes trial in type 2 diabetes patients receiving GLP-1 receptor agonist.",
    clinicalMetadata: {
      enrollmentStartDate: "2016-04-01",
      primaryCompletionDate: "2023-01-31",
      studyLockDate: "2023-07-15",
      principalInvestigator: "Dr. Thomas Wright, MD, FACE",
      sponsor: "Endocrine Horizons",
      nctNumber: "NCT02654321",
      studyDesign: "Randomized, double-blind, placebo-controlled, event-driven Phase IV CVOT",
      primaryEndpoint: "Time to First MACE (3-point: CV death, non-fatal MI, non-fatal stroke)",
      secondaryEndpoints: ["HbA1c Change from Baseline", "Body Weight Change", "All-cause Mortality"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v3.0",
      protocolAmendments: 3,
      targetEnrollment: 9000,
      actualEnrollment: 8956,
      numberOfSites: 410,
      treatmentArms: ["GLP-1 RA 1.8mg SC QD", "Placebo SC QD"],
      blindingType: "Double-blind",
      randomizationRatio: "1:1",
    },
    categories: ["ta-endo", "ta-cardio", "sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Endocrinology Archive", "Cardiovascular Outcomes Archive", "Phase IV Studies"],
    activeUsers: 287,
    organizations: 18,
    accessBreakdown: { alreadyOpen: 70, readyToGrant: 20, needsApproval: 10, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-275", "DCODE-203"],
    childDatasets: [
      { id: "dcode-263-clin", code: "DCODE-263-CLIN", name: "Clinical Demographics", accessStatus: "open", dataType: "Clinical", recordCount: 4567 },
      { id: "dcode-263-mace", code: "DCODE-263-MACE", name: "MACE Outcomes", accessStatus: "open", dataType: "Clinical", recordCount: 890 },
      { id: "dcode-263-hba1c", code: "DCODE-263-HBA1C", name: "HbA1c Measurements", accessStatus: "open", dataType: "Biomarker", recordCount: 27000 },
      { id: "dcode-263-ae", code: "DCODE-263-AE", name: "Adverse Events", accessStatus: "ready", dataType: "Safety", recordCount: 3400 },
      { id: "dcode-263-hypo", code: "DCODE-263-HYPO", name: "Hypoglycemia Events", accessStatus: "approval", dataType: "Safety", recordCount: 456 },
    ],
  },
  {
    id: "dcode-275",
    code: "DCODE-275",
    name: "Diabetic Retinopathy Imaging Study",
    therapeuticArea: ["ENDO"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-03-20",
    geography: ["US", "Asia"],
    patientCount: 678,
    description: "Retinal imaging study assessing progression of diabetic retinopathy with novel treatment.",
    clinicalMetadata: {
      enrollmentStartDate: "2021-01-15",
      primaryCompletionDate: "2023-10-30",
      studyLockDate: "2024-03-20",
      principalInvestigator: "Dr. Susan Lee, MD, FACS",
      sponsor: "Retina Therapeutics Inc",
      nctNumber: "NCT04567123",
      studyDesign: "Randomized, double-masked, sham-controlled, multicenter Phase III",
      primaryEndpoint: "Change in ETDRS Best Corrected Visual Acuity (BCVA) at Month 12",
      secondaryEndpoints: ["Central Subfield Thickness (CST) Reduction", "DR Severity Score Change", "Time to Rescue Treatment"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.2",
      protocolAmendments: 1,
      targetEnrollment: 700,
      actualEnrollment: 678,
      numberOfSites: 35,
      treatmentArms: ["Anti-VEGF 6mg IVT Q8W", "Sham Procedure Q8W"],
      blindingType: "Double-blind",
      randomizationRatio: "2:1",
    },
    categories: ["ta-endo", "sdtm-demographics", "sdtm-exposure", "dicom-acquisition", "dicom-quantitative", "adam-adsl"],
    collections: ["Endocrinology Archive", "Ophthalmology Imaging Collection"],
    activeUsers: 45,
    organizations: 3,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-263"],
    childDatasets: [
      { id: "dcode-275-clin", code: "DCODE-275-CLIN", name: "Clinical Data", accessStatus: "open", dataType: "Clinical", recordCount: 456 },
      { id: "dcode-275-fundus", code: "DCODE-275-FUNDUS", name: "Fundus Photography", accessStatus: "open", dataType: "Imaging", recordCount: 2280 },
      { id: "dcode-275-oct", code: "DCODE-275-OCT", name: "OCT Imaging", accessStatus: "ready", dataType: "Imaging", recordCount: 1824 },
      { id: "dcode-275-va", code: "DCODE-275-VA", name: "Visual Acuity", accessStatus: "ready", dataType: "Clinical", recordCount: 2736 },
      { id: "dcode-275-ae", code: "DCODE-275-AE", name: "Ocular Adverse Events", accessStatus: "approval", dataType: "Safety", recordCount: 123 },
    ],
  },
  {
    id: "dcode-289",
    code: "DCODE-289",
    name: "Atrial Fibrillation Registry",
    therapeuticArea: ["CARDIO"],
    phase: "IV",
    status: "Closed",
    closedDate: "2023-09-30",
    geography: ["US", "EU"],
    patientCount: 5234,
    description: "Real-world registry of atrial fibrillation patients with long-term follow-up data.",
    clinicalMetadata: {
      enrollmentStartDate: "2017-06-01",
      primaryCompletionDate: "2023-03-31",
      studyLockDate: "2023-09-30",
      principalInvestigator: "Dr. Harold Mitchell, MD, FACC",
      sponsor: "Rhythm Sciences LLC",
      nctNumber: "NCT03234567",
      studyDesign: "Prospective, observational, multicenter real-world registry",
      primaryEndpoint: "Stroke/Systemic Embolism Rate at 2 Years",
      secondaryEndpoints: ["Major Bleeding Rate", "All-cause Hospitalization", "Treatment Persistence"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.2",
      protocolAmendments: 2,
      targetEnrollment: 5500,
      actualEnrollment: 5234,
      numberOfSites: 125,
      treatmentArms: ["Registry Cohort (observational)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-cardio", "sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Cardiovascular Outcomes Archive", "Real-World Evidence Collection"],
    activeUsers: 198,
    organizations: 15,
    accessBreakdown: { alreadyOpen: 65, readyToGrant: 25, needsApproval: 10, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-203", "DCODE-215"],
    childDatasets: [
      { id: "dcode-289-clin", code: "DCODE-289-CLIN", name: "Clinical Registry Data", accessStatus: "open", dataType: "Clinical", recordCount: 3210 },
      { id: "dcode-289-ecg", code: "DCODE-289-ECG", name: "ECG Recordings", accessStatus: "open", dataType: "Clinical", recordCount: 19260 },
      { id: "dcode-289-stroke", code: "DCODE-289-STROKE", name: "Stroke Events", accessStatus: "ready", dataType: "Clinical", recordCount: 234 },
      { id: "dcode-289-bleed", code: "DCODE-289-BLEED", name: "Bleeding Events", accessStatus: "ready", dataType: "Safety", recordCount: 178 },
    ],
  },
  {
    id: "dcode-301",
    code: "DCODE-301",
    name: "Rheumatoid Arthritis Biologic Study",
    therapeuticArea: ["IMMUNO"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-01-25",
    geography: ["US", "EU", "Asia"],
    patientCount: 1456,
    description: "Phase III trial of novel biologic therapy in moderate to severe rheumatoid arthritis.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-03-01",
      primaryCompletionDate: "2023-09-30",
      studyLockDate: "2024-01-25",
      principalInvestigator: "Dr. Rebecca Stone, MD, PhD",
      sponsor: "ImmunoGen Therapeutics",
      nctNumber: "NCT04123789",
      studyDesign: "Randomized, double-blind, placebo-controlled, multicenter Phase III",
      primaryEndpoint: "ACR50 Response at Week 24",
      secondaryEndpoints: ["DAS28-CRP Change", "HAQ-DI Improvement", "Radiographic Progression (mTSS)"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.1",
      protocolAmendments: 2,
      targetEnrollment: 1500,
      actualEnrollment: 1456,
      numberOfSites: 78,
      treatmentArms: ["Novel JAKi 15mg QD", "Adalimumab 40mg Q2W", "Placebo"],
      blindingType: "Double-blind",
      randomizationRatio: "2:2:1",
    },
    categories: ["ta-immuno", "sdtm-demographics", "sdtm-exposure", "sdtm-biomarker-labs", "adam-adsl", "adam-adrs"],
    collections: ["Autoimmune Disease Studies", "Rheumatology Collection"],
    activeUsers: 89,
    organizations: 6,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 35, needsApproval: 30, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3", "Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-313", "DCODE-325"],
    childDatasets: [
      { id: "dcode-301-clin", code: "DCODE-301-CLIN", name: "Clinical Demographics", accessStatus: "open", dataType: "Clinical", recordCount: 1456 },
      { id: "dcode-301-das", code: "DCODE-301-DAS", name: "DAS28 Scores", accessStatus: "open", dataType: "Clinical", recordCount: 8736 },
      { id: "dcode-301-xray", code: "DCODE-301-XRAY", name: "Joint X-rays", accessStatus: "ready", dataType: "Imaging", recordCount: 5824 },
      { id: "dcode-301-bio", code: "DCODE-301-BIO", name: "Biomarker Panel", accessStatus: "ready", dataType: "Biomarker", recordCount: 4368 },
      { id: "dcode-301-ae", code: "DCODE-301-AE", name: "Adverse Events", accessStatus: "approval", dataType: "Safety", recordCount: 2100 },
      { id: "dcode-301-pro", code: "DCODE-301-PRO", name: "Patient Reported Outcomes", accessStatus: "approval", dataType: "PRO", recordCount: 5824 },
    ],
  },
  {
    id: "dcode-313",
    code: "DCODE-313",
    name: "Psoriasis Treatment Comparison",
    therapeuticArea: ["IMMUNO"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-12-10",
    geography: ["US", "EU"],
    patientCount: 892,
    description: "Head-to-head comparison of two biologic therapies for moderate to severe plaque psoriasis.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-06-15",
      primaryCompletionDate: "2023-06-30",
      studyLockDate: "2023-12-10",
      principalInvestigator: "Dr. Kevin O'Brien, MD",
      sponsor: "DermaClear Biologics",
      nctNumber: "NCT04345012",
      studyDesign: "Randomized, assessor-blinded, active-controlled, multicenter Phase III",
      primaryEndpoint: "PASI 90 Response at Week 16",
      secondaryEndpoints: ["IGA 0/1 Response", "DLQI Improvement", "Time to PASI 75"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.3",
      protocolAmendments: 1,
      targetEnrollment: 900,
      actualEnrollment: 892,
      numberOfSites: 48,
      treatmentArms: ["IL-23 Inhibitor 150mg Q12W", "IL-17A Inhibitor 300mg Q4W"],
      blindingType: "Single-blind",
      randomizationRatio: "1:1",
    },
    categories: ["ta-immuno", "sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events", "adam-adsl", "adam-adrs"],
    collections: ["Autoimmune Disease Studies", "Dermatology Collection"],
    activeUsers: 67,
    organizations: 5,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Starburst", "S3", "Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-301"],
    childDatasets: [
      { id: "dcode-313-clin", code: "DCODE-313-CLIN", name: "Clinical Data", accessStatus: "open", dataType: "Clinical", recordCount: 892 },
      { id: "dcode-313-pasi", code: "DCODE-313-PASI", name: "PASI Scores", accessStatus: "open", dataType: "Clinical", recordCount: 5352 },
      { id: "dcode-313-photo", code: "DCODE-313-PHOTO", name: "Lesion Photography", accessStatus: "ready", dataType: "Imaging", recordCount: 4460 },
      { id: "dcode-313-ae", code: "DCODE-313-AE", name: "Adverse Events", accessStatus: "approval", dataType: "Safety", recordCount: 1230 },
    ],
  },
  {
    id: "dcode-325",
    code: "DCODE-325",
    name: "Inflammatory Bowel Disease Genomics",
    therapeuticArea: ["IMMUNO", "GASTRO"],
    phase: "II",
    status: "Closed",
    closedDate: "2024-02-15",
    geography: ["US", "EU"],
    patientCount: 534,
    description: "Genomic profiling study in Crohn's disease and ulcerative colitis patients.",
    clinicalMetadata: {
      enrollmentStartDate: "2021-03-01",
      primaryCompletionDate: "2023-11-15",
      studyLockDate: "2024-02-15",
      principalInvestigator: "Dr. Amanda Foster, MD, PhD",
      sponsor: "GutGenome Research",
      nctNumber: "NCT04567890",
      studyDesign: "Prospective, observational, multicenter genomic profiling study",
      primaryEndpoint: "Genetic Risk Score Correlation with Disease Severity",
      secondaryEndpoints: ["Polygenic Risk Score Validation", "Treatment Response Prediction", "Microbiome-Host Interaction Analysis"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.1",
      protocolAmendments: 0,
      targetEnrollment: 550,
      actualEnrollment: 534,
      numberOfSites: 24,
      treatmentArms: ["Genomic Profiling Cohort (observational)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-immuno", "sdtm-demographics", "omics-variants", "omics-global-scores", "adam-adsl"],
    collections: ["Autoimmune Disease Studies", "Genomic Profiling Collection"],
    activeUsers: 52,
    organizations: 4,
    accessBreakdown: { alreadyOpen: 30, readyToGrant: 40, needsApproval: 30, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst", "S3"],
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-301", "DCODE-313"],
  },
  {
    id: "dcode-337",
    code: "DCODE-337",
    name: "Breast Cancer Adjuvant Therapy Study",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-06-30",
    geography: ["US", "EU", "Asia"],
    patientCount: 3456,
    description: "Large adjuvant therapy trial in early-stage breast cancer with 10-year follow-up.",
    clinicalMetadata: {
      enrollmentStartDate: "2013-04-01",
      primaryCompletionDate: "2022-12-31",
      studyLockDate: "2023-06-30",
      principalInvestigator: "Dr. Lisa Morgan, MD, PhD",
      sponsor: "Oncology Alliance Partners",
      nctNumber: "NCT01876543",
      studyDesign: "Randomized, double-blind, placebo-controlled, multicenter Phase III",
      primaryEndpoint: "Disease-Free Survival (DFS) at 10 Years",
      secondaryEndpoints: ["Overall Survival (OS)", "Distant Recurrence-Free Interval (DRFI)", "Time to Distant Recurrence"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v4.2",
      protocolAmendments: 5,
      targetEnrollment: 3500,
      actualEnrollment: 3456,
      numberOfSites: 145,
      treatmentArms: ["Extended Adjuvant Endocrine Therapy", "Placebo"],
      blindingType: "Double-blind",
      randomizationRatio: "1:1",
    },
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Oncology Outcomes Archive", "Breast Cancer Studies", "Phase III Closed Studies"],
    activeUsers: 234,
    organizations: 16,
    accessBreakdown: { alreadyOpen: 55, readyToGrant: 30, needsApproval: 15, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-349", "DCODE-361"],
    childDatasets: [
      { id: "dcode-337-clin", code: "DCODE-337-CLIN", name: "Clinical Demographics", accessStatus: "open", dataType: "Clinical", recordCount: 3456 },
      { id: "dcode-337-surv", code: "DCODE-337-SURV", name: "Survival Outcomes", accessStatus: "open", dataType: "Clinical", recordCount: 3456 },
      { id: "dcode-337-trt", code: "DCODE-337-TRT", name: "Treatment Exposure", accessStatus: "ready", dataType: "Clinical", recordCount: 10368 },
      { id: "dcode-337-ae", code: "DCODE-337-AE", name: "Adverse Events", accessStatus: "ready", dataType: "Safety", recordCount: 8900 },
      { id: "dcode-337-path", code: "DCODE-337-PATH", name: "Pathology Data", accessStatus: "approval", dataType: "Clinical", recordCount: 3456 },
      { id: "dcode-337-bio", code: "DCODE-337-BIO", name: "Biomarker Panel", accessStatus: "approval", dataType: "Biomarker", recordCount: 6912 },
    ],
  },
  {
    id: "dcode-349",
    code: "DCODE-349",
    name: "Metastatic Breast Cancer Genomic Analysis",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-01-10",
    geography: ["US", "EU"],
    patientCount: 1234,
    description: "Comprehensive genomic profiling of metastatic breast cancer with matched treatment outcomes.",
    clinicalMetadata: {
      enrollmentStartDate: "2019-09-01",
      primaryCompletionDate: "2023-06-30",
      studyLockDate: "2024-01-10",
      principalInvestigator: "Dr. Nicole Parker, MD",
      sponsor: "Precision Oncology Labs",
      nctNumber: "NCT04012389",
      studyDesign: "Prospective, observational, multicenter genomic profiling study",
      primaryEndpoint: "Actionable Mutation Detection Rate in MBC",
      secondaryEndpoints: ["Treatment Selection Guidance Rate", "Clinical Benefit Correlation", "Resistance Mechanism Identification"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.4",
      protocolAmendments: 1,
      targetEnrollment: 1250,
      actualEnrollment: 1234,
      numberOfSites: 55,
      treatmentArms: ["Genomic Profiling Cohort (observational)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "omics-variants", "omics-cn-sv", "adam-adsl"],
    collections: ["Oncology Outcomes Archive", "Breast Cancer Studies", "Genomic Profiling Collection"],
    activeUsers: 145,
    organizations: 9,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-337", "DCODE-361"],
  },
  {
    id: "dcode-361",
    code: "DCODE-361",
    name: "HER2+ Breast Cancer Imaging Study",
    therapeuticArea: ["ONC"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-11-15",
    geography: ["US"],
    patientCount: 456,
    description: "PET imaging study assessing HER2 expression and treatment response in metastatic breast cancer.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-08-01",
      primaryCompletionDate: "2023-05-31",
      studyLockDate: "2023-11-15",
      principalInvestigator: "Dr. Rachel Green, MD, PhD",
      sponsor: "Molecular Imaging Partners",
      nctNumber: "NCT04234890",
      studyDesign: "Prospective, single-arm, multicenter imaging study",
      primaryEndpoint: "HER2 PET Imaging Concordance with Tissue Biopsy",
      secondaryEndpoints: ["SUVmax Change with Treatment", "Imaging Response vs Clinical Response", "Safety of Tracer"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.1",
      protocolAmendments: 0,
      targetEnrollment: 480,
      actualEnrollment: 456,
      numberOfSites: 18,
      treatmentArms: ["HER2 PET Imaging Cohort (single arm)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "sdtm-demographics", "dicom-ids-timing", "dicom-quantitative", "adam-adsl"],
    collections: ["Breast Cancer Studies", "Imaging Biomarker Studies"],
    activeUsers: 38,
    organizations: 3,
    accessBreakdown: { alreadyOpen: 30, readyToGrant: 40, needsApproval: 30, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst"],
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-337", "DCODE-349"],
  },
  {
    id: "dcode-373",
    code: "DCODE-373",
    name: "Colorectal Cancer Screening Study",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-08-20",
    geography: ["US", "EU"],
    patientCount: 2890,
    description: "Large screening study comparing colonoscopy vs. non-invasive methods for colorectal cancer detection.",
    clinicalMetadata: {
      enrollmentStartDate: "2017-01-15",
      primaryCompletionDate: "2023-03-31",
      studyLockDate: "2023-08-20",
      principalInvestigator: "Dr. Mark Johnson, MD",
      sponsor: "GI Prevention Research",
      nctNumber: "NCT02876543",
      studyDesign: "Randomized, parallel-group, multicenter screening comparison study",
      primaryEndpoint: "Colorectal Cancer Detection Rate",
      secondaryEndpoints: ["Advanced Adenoma Detection Rate", "Screening Adherence", "Cost-Effectiveness Analysis"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.3",
      protocolAmendments: 3,
      targetEnrollment: 3000,
      actualEnrollment: 2890,
      numberOfSites: 95,
      treatmentArms: ["Colonoscopy Screening", "FIT + Cologuard Screening"],
      blindingType: "Open-label",
      randomizationRatio: "1:1",
    },
    categories: ["ta-onc", "sdtm-demographics", "sdtm-tumor-response", "sdtm-biomarker-labs", "adam-adsl"],
    collections: ["Oncology Outcomes Archive", "Gastrointestinal Cancer Studies"],
    activeUsers: 167,
    organizations: 11,
    accessBreakdown: { alreadyOpen: 60, readyToGrant: 30, needsApproval: 10, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3", "Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-385", "DCODE-397"],
    childDatasets: [
      { id: "dcode-373-clin", code: "DCODE-373-CLIN", name: "Clinical Demographics", accessStatus: "open", dataType: "Clinical", recordCount: 2890 },
      { id: "dcode-373-screen", code: "DCODE-373-SCREEN", name: "Screening Results", accessStatus: "open", dataType: "Clinical", recordCount: 5780 },
      { id: "dcode-373-path", code: "DCODE-373-PATH", name: "Pathology Findings", accessStatus: "ready", dataType: "Clinical", recordCount: 1234 },
      { id: "dcode-373-fit", code: "DCODE-373-FIT", name: "FIT Test Results", accessStatus: "ready", dataType: "Biomarker", recordCount: 2890 },
      { id: "dcode-373-follow", code: "DCODE-373-FOLLOW", name: "Follow-up Outcomes", accessStatus: "approval", dataType: "Clinical", recordCount: 2890 },
    ],
  },
  {
    id: "dcode-385",
    code: "DCODE-385",
    name: "Advanced Colorectal Cancer Immunotherapy",
    therapeuticArea: ["ONC", "IMMUNONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-02-28",
    geography: ["Global"],
    patientCount: 1678,
    description: "Phase III study of checkpoint inhibitor therapy in MSI-high metastatic colorectal cancer.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-04-01",
      primaryCompletionDate: "2023-09-30",
      studyLockDate: "2024-02-28",
      principalInvestigator: "Dr. Steven Chang, MD, PhD",
      sponsor: "Immunocheck Therapeutics",
      nctNumber: "NCT04098765",
      studyDesign: "Randomized, open-label, active-controlled, multicenter Phase III",
      primaryEndpoint: "Overall Survival (OS)",
      secondaryEndpoints: ["Progression-Free Survival (PFS)", "Objective Response Rate (ORR)", "Duration of Response (DoR)"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.0",
      protocolAmendments: 1,
      targetEnrollment: 1700,
      actualEnrollment: 1678,
      numberOfSites: 92,
      treatmentArms: ["Pembrolizumab 200mg Q3W", "FOLFOX6 + Bevacizumab"],
      blindingType: "Open-label",
      randomizationRatio: "1:1",
    },
    categories: ["ta-onc", "ta-immunonc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-biomarker-labs", "adam-adsl", "adam-adtte"],
    collections: ["Immunotherapy Response Collection", "Gastrointestinal Cancer Studies"],
    activeUsers: 189,
    organizations: 13,
    accessBreakdown: { alreadyOpen: 50, readyToGrant: 30, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Starburst", "S3", "Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-373", "DCODE-397"],
    childDatasets: [
      { id: "dcode-385-clin", code: "DCODE-385-CLIN", name: "Clinical Outcomes", accessStatus: "open", dataType: "Clinical", recordCount: 1678 },
      { id: "dcode-385-resp", code: "DCODE-385-RESP", name: "Response Assessment", accessStatus: "open", dataType: "Clinical", recordCount: 1678 },
      { id: "dcode-385-bio", code: "DCODE-385-BIO", name: "MSI/MMR Status", accessStatus: "ready", dataType: "Biomarker", recordCount: 1678 },
      { id: "dcode-385-ae", code: "DCODE-385-AE", name: "Adverse Events", accessStatus: "ready", dataType: "Safety", recordCount: 4500 },
      { id: "dcode-385-surv", code: "DCODE-385-SURV", name: "Survival Data", accessStatus: "approval", dataType: "Clinical", recordCount: 1678 },
    ],
  },
  {
    id: "dcode-397",
    code: "DCODE-397",
    name: "Pancreatic Cancer Biomarker Discovery",
    therapeuticArea: ["ONC"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-10-30",
    geography: ["US", "EU"],
    patientCount: 345,
    description: "Multi-omic biomarker discovery study in resectable pancreatic cancer.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-01-15",
      primaryCompletionDate: "2023-06-30",
      studyLockDate: "2023-10-30",
      principalInvestigator: "Dr. Anthony Ross, MD",
      sponsor: "Pancreas Research Consortium",
      nctNumber: "NCT04123901",
      studyDesign: "Prospective, observational, multicenter biomarker discovery study",
      primaryEndpoint: "Recurrence Prediction Biomarker Panel Development",
      secondaryEndpoints: ["ctDNA Detection Rate Pre/Post Surgery", "Multi-Omic Signature Validation", "Treatment Response Correlation"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.2",
      protocolAmendments: 1,
      targetEnrollment: 360,
      actualEnrollment: 345,
      numberOfSites: 16,
      treatmentArms: ["Biomarker Discovery Cohort (observational)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "sdtm-demographics", "omics-variants", "omics-global-scores", "raw-ctdna", "adam-adsl"],
    collections: ["Gastrointestinal Cancer Studies", "Biomarker Discovery Collection"],
    activeUsers: 56,
    organizations: 4,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 40, needsApproval: 25, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst", "S3"],
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-373", "DCODE-385"],
  },
  {
    id: "dcode-409",
    code: "DCODE-409",
    name: "Prostate Cancer Active Surveillance",
    therapeuticArea: ["ONC"],
    phase: "IV",
    status: "Closed",
    closedDate: "2023-12-31",
    geography: ["US", "EU"],
    patientCount: 2134,
    description: "Long-term outcomes study of active surveillance vs. immediate treatment in low-risk prostate cancer.",
    clinicalMetadata: {
      enrollmentStartDate: "2014-06-01",
      primaryCompletionDate: "2023-06-30",
      studyLockDate: "2023-12-31",
      principalInvestigator: "Dr. William Carter, MD",
      sponsor: "Urology Research Network",
      nctNumber: "NCT02234567",
      studyDesign: "Randomized, open-label, multicenter Phase IV outcomes study",
      primaryEndpoint: "Metastasis-Free Survival at 10 Years",
      secondaryEndpoints: ["Prostate Cancer-Specific Mortality", "Time to Radical Treatment", "Quality of Life (EPIC-26)"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v3.1",
      protocolAmendments: 4,
      targetEnrollment: 2200,
      actualEnrollment: 2134,
      numberOfSites: 78,
      treatmentArms: ["Active Surveillance", "Radical Prostatectomy", "Radiation Therapy"],
      blindingType: "Open-label",
      randomizationRatio: "1:1:1",
    },
    categories: ["ta-onc", "sdtm-demographics", "sdtm-tumor-response", "sdtm-biomarker-labs", "adam-adsl", "adam-adtte"],
    collections: ["Oncology Outcomes Archive", "Prostate Cancer Studies"],
    activeUsers: 143,
    organizations: 10,
    accessBreakdown: { alreadyOpen: 60, readyToGrant: 30, needsApproval: 10, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-421", "DCODE-433"],
    childDatasets: [
      { id: "dcode-409-clin", code: "DCODE-409-CLIN", name: "Clinical Demographics", accessStatus: "open", dataType: "Clinical", recordCount: 2134 },
      { id: "dcode-409-surv", code: "DCODE-409-SURV", name: "Survival Outcomes", accessStatus: "open", dataType: "Clinical", recordCount: 2134 },
      { id: "dcode-409-psa", code: "DCODE-409-PSA", name: "PSA Monitoring", accessStatus: "open", dataType: "Biomarker", recordCount: 12800 },
      { id: "dcode-409-biopsy", code: "DCODE-409-BIOP", name: "Biopsy Results", accessStatus: "ready", dataType: "Clinical", recordCount: 4268 },
      { id: "dcode-409-qol", code: "DCODE-409-QOL", name: "Quality of Life", accessStatus: "ready", dataType: "PRO", recordCount: 8536 },
      { id: "dcode-409-trt", code: "DCODE-409-TRT", name: "Treatment Decisions", accessStatus: "approval", dataType: "Clinical", recordCount: 2134 },
    ],
  },
  {
    id: "dcode-421",
    code: "DCODE-421",
    name: "Metastatic Prostate Cancer Genomics",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-01-20",
    geography: ["US", "EU", "Asia"],
    patientCount: 967,
    description: "Genomic characterization of metastatic castration-resistant prostate cancer.",
    clinicalMetadata: {
      enrollmentStartDate: "2019-11-01",
      primaryCompletionDate: "2023-07-31",
      studyLockDate: "2024-01-20",
      principalInvestigator: "Dr. Daniel Harris, MD, PhD",
      sponsor: "Prostate Genomics Institute",
      nctNumber: "NCT04012456",
      studyDesign: "Prospective, observational, multicenter genomic profiling study",
      primaryEndpoint: "Homologous Recombination Deficiency (HRD) Prevalence in mCRPC",
      secondaryEndpoints: ["BRCA1/2 Mutation Rate", "AR Pathway Alterations", "PARP Inhibitor Sensitivity Prediction"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.3",
      protocolAmendments: 1,
      targetEnrollment: 1000,
      actualEnrollment: 967,
      numberOfSites: 42,
      treatmentArms: ["Genomic Profiling Cohort (observational)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "omics-variants", "omics-cn-sv", "adam-adsl"],
    collections: ["Prostate Cancer Studies", "Genomic Profiling Collection"],
    activeUsers: 112,
    organizations: 8,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-409", "DCODE-433"],
  },
  {
    id: "dcode-433",
    code: "DCODE-433",
    name: "Prostate Cancer PSMA Imaging Study",
    therapeuticArea: ["ONC"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-09-15",
    geography: ["US", "EU"],
    patientCount: 289,
    description: "PSMA PET imaging for detection and staging of prostate cancer recurrence.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-03-01",
      primaryCompletionDate: "2023-04-30",
      studyLockDate: "2023-09-15",
      principalInvestigator: "Dr. Christopher Evans, MD",
      sponsor: "Nuclear Medicine Innovations",
      nctNumber: "NCT04234012",
      studyDesign: "Prospective, single-arm, multicenter imaging study",
      primaryEndpoint: "PSMA PET Detection Rate for Biochemical Recurrence",
      secondaryEndpoints: ["Change in Clinical Management", "Histopathological Confirmation Rate", "Per-Patient Sensitivity/Specificity"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.0",
      protocolAmendments: 0,
      targetEnrollment: 300,
      actualEnrollment: 289,
      numberOfSites: 14,
      treatmentArms: ["PSMA PET Imaging Cohort (single arm)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "sdtm-demographics", "dicom-ids-timing", "dicom-acquisition", "dicom-quantitative", "adam-adsl"],
    collections: ["Prostate Cancer Studies", "Imaging Biomarker Studies"],
    activeUsers: 47,
    organizations: 3,
    accessBreakdown: { alreadyOpen: 30, readyToGrant: 40, needsApproval: 30, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst"],
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-409", "DCODE-421"],
  },
  {
    id: "dcode-445",
    code: "DCODE-445",
    name: "Melanoma Immunotherapy Combination Study",
    therapeuticArea: ["ONC", "IMMUNONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-03-10",
    geography: ["Global"],
    patientCount: 1890,
    description: "Phase III study of dual checkpoint inhibitor therapy in advanced melanoma.",
    clinicalMetadata: {
      enrollmentStartDate: "2019-08-01",
      primaryCompletionDate: "2023-08-31",
      studyLockDate: "2024-03-10",
      principalInvestigator: "Dr. Katherine Moore, MD, PhD",
      sponsor: "Derma-Immuno Research",
      nctNumber: "NCT04056789",
      studyDesign: "Randomized, open-label, multicenter Phase III",
      primaryEndpoint: "Overall Survival (OS)",
      secondaryEndpoints: ["Progression-Free Survival (PFS)", "Objective Response Rate (ORR)", "Safety and Tolerability"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.1",
      protocolAmendments: 2,
      targetEnrollment: 1900,
      actualEnrollment: 1890,
      numberOfSites: 105,
      treatmentArms: ["Nivolumab + Ipilimumab", "Nivolumab Monotherapy", "Ipilimumab Monotherapy"],
      blindingType: "Open-label",
      randomizationRatio: "1:1:1",
    },
    categories: ["ta-onc", "ta-immunonc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Immunotherapy Response Collection", "Melanoma Studies"],
    activeUsers: 201,
    organizations: 14,
    accessBreakdown: { alreadyOpen: 50, readyToGrant: 30, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3", "Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-457", "DCODE-469"],
    childDatasets: [
      { id: "dcode-445-clin", code: "DCODE-445-CLIN", name: "Clinical Outcomes", accessStatus: "open", dataType: "Clinical", recordCount: 1890 },
      { id: "dcode-445-surv", code: "DCODE-445-SURV", name: "Survival Data", accessStatus: "open", dataType: "Clinical", recordCount: 1890 },
      { id: "dcode-445-resp", code: "DCODE-445-RESP", name: "Response Assessment", accessStatus: "ready", dataType: "Clinical", recordCount: 1890 },
      { id: "dcode-445-ae", code: "DCODE-445-AE", name: "Adverse Events", accessStatus: "ready", dataType: "Safety", recordCount: 6200 },
      { id: "dcode-445-irae", code: "DCODE-445-IRAE", name: "Immune-Related AEs", accessStatus: "approval", dataType: "Safety", recordCount: 1200 },
      { id: "dcode-445-bio", code: "DCODE-445-BIO", name: "Biomarker Panel", accessStatus: "approval", dataType: "Biomarker", recordCount: 3780 },
    ],
  },
  {
    id: "dcode-457",
    code: "DCODE-457",
    name: "Melanoma Biomarker Substudy",
    therapeuticArea: ["ONC", "IMMUNONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-03-15",
    geography: ["US", "EU"],
    patientCount: 456,
    description: "Biomarker substudy evaluating predictive markers for immunotherapy response in melanoma.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-02-01",
      primaryCompletionDate: "2023-10-31",
      studyLockDate: "2024-03-15",
      principalInvestigator: "Dr. Benjamin Taylor, MD, PhD",
      sponsor: "Biomarker Sciences Ltd",
      nctNumber: "NCT04178901",
      studyDesign: "Prospective, observational, multicenter biomarker substudy",
      primaryEndpoint: "Predictive Biomarker Panel Development for IO Response",
      secondaryEndpoints: ["ctDNA Dynamics Correlation", "TMB/MSI Status Predictive Value", "PD-L1 Expression Correlation"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.2",
      protocolAmendments: 1,
      targetEnrollment: 480,
      actualEnrollment: 456,
      numberOfSites: 22,
      treatmentArms: ["Biomarker Substudy Cohort (observational)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "ta-immunonc", "sdtm-demographics", "sdtm-biomarker-labs", "raw-ctdna", "omics-variants", "adam-adsl"],
    collections: ["Immunotherapy Response Collection", "Melanoma Studies", "Biomarker Discovery Collection"],
    activeUsers: 67,
    organizations: 5,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Starburst", "S3", "Snowflake"],
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-445", "DCODE-469"],
  },
  {
    id: "dcode-469",
    code: "DCODE-469",
    name: "Cutaneous Melanoma Imaging Study",
    therapeuticArea: ["ONC"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-11-20",
    geography: ["US"],
    patientCount: 234,
    description: "Advanced imaging study assessing tumor burden and response in metastatic melanoma.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-06-01",
      primaryCompletionDate: "2023-06-30",
      studyLockDate: "2023-11-20",
      principalInvestigator: "Dr. Andrew Blake, MD",
      sponsor: "Advanced Imaging Diagnostics",
      nctNumber: "NCT04289012",
      studyDesign: "Prospective, single-arm, multicenter imaging study",
      primaryEndpoint: "Correlation of Imaging Tumor Burden with Clinical Response",
      secondaryEndpoints: ["MTV/TLG Predictive Value", "Early Response Assessment Accuracy", "Inter-Reader Agreement"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.1",
      protocolAmendments: 0,
      targetEnrollment: 250,
      actualEnrollment: 234,
      numberOfSites: 12,
      treatmentArms: ["Imaging Assessment Cohort (single arm)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "sdtm-demographics", "dicom-quantitative", "adam-adsl"],
    collections: ["Melanoma Studies", "Imaging Biomarker Studies"],
    activeUsers: 34,
    organizations: 2,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 40, needsApproval: 25, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst", "S3"],
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-445", "DCODE-457"],
  },
  {
    id: "dcode-481",
    code: "DCODE-481",
    name: "Renal Cell Carcinoma Targeted Therapy",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-02-20",
    geography: ["US", "EU", "Asia"],
    patientCount: 1234,
    description: "Phase III trial of novel VEGF inhibitor in advanced renal cell carcinoma.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-05-01",
      primaryCompletionDate: "2023-10-31",
      studyLockDate: "2024-02-20",
      principalInvestigator: "Dr. Joseph Martinez, MD",
      sponsor: "Renal Oncology Alliance",
      nctNumber: "NCT04167890",
      studyDesign: "Randomized, double-blind, placebo-controlled, multicenter Phase III",
      primaryEndpoint: "Progression-Free Survival (PFS)",
      secondaryEndpoints: ["Overall Survival (OS)", "Objective Response Rate (ORR)", "Duration of Response (DoR)"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.4",
      protocolAmendments: 2,
      targetEnrollment: 1250,
      actualEnrollment: 1234,
      numberOfSites: 68,
      treatmentArms: ["Novel VEGF TKI 60mg QD", "Sunitinib 50mg QD (4wk on/2wk off)"],
      blindingType: "Double-blind",
      randomizationRatio: "1:1",
    },
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Oncology Outcomes Archive", "Genitourinary Cancer Studies"],
    activeUsers: 134,
    organizations: 9,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-493", "DCODE-505"],
    childDatasets: [
      { id: "dcode-481-clin", code: "DCODE-481-CLIN", name: "Clinical Outcomes", accessStatus: "open", dataType: "Clinical", recordCount: 1234 },
      { id: "dcode-481-resp", code: "DCODE-481-RESP", name: "Response Assessment", accessStatus: "open", dataType: "Clinical", recordCount: 1234 },
      { id: "dcode-481-ae", code: "DCODE-481-AE", name: "Adverse Events", accessStatus: "ready", dataType: "Safety", recordCount: 3500 },
      { id: "dcode-481-pk", code: "DCODE-481-PK", name: "Pharmacokinetics", accessStatus: "ready", dataType: "Clinical", recordCount: 2468 },
      { id: "dcode-481-surv", code: "DCODE-481-SURV", name: "Survival Outcomes", accessStatus: "approval", dataType: "Clinical", recordCount: 1234 },
    ],
  },
  {
    id: "dcode-493",
    code: "DCODE-493",
    name: "Bladder Cancer Immunotherapy Study",
    therapeuticArea: ["ONC", "IMMUNONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-10-25",
    geography: ["US", "EU"],
    patientCount: 789,
    description: "Checkpoint inhibitor therapy in platinum-refractory metastatic bladder cancer.",
    clinicalMetadata: {
      enrollmentStartDate: "2019-12-01",
      primaryCompletionDate: "2023-05-31",
      studyLockDate: "2023-10-25",
      principalInvestigator: "Dr. Peter Collins, MD, PhD",
      sponsor: "Bladder Cancer Research Group",
      nctNumber: "NCT04023456",
      studyDesign: "Single-arm, open-label, multicenter Phase III",
      primaryEndpoint: "Objective Response Rate (ORR) by RECIST 1.1",
      secondaryEndpoints: ["Duration of Response (DoR)", "Progression-Free Survival (PFS)", "Overall Survival (OS)"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.0",
      protocolAmendments: 1,
      targetEnrollment: 800,
      actualEnrollment: 789,
      numberOfSites: 45,
      treatmentArms: ["Atezolizumab 1200mg IV Q3W"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "ta-immunonc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "adam-adsl", "adam-adtte"],
    collections: ["Immunotherapy Response Collection", "Genitourinary Cancer Studies"],
    activeUsers: 98,
    organizations: 7,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-481", "DCODE-505"],
  },
  {
    id: "dcode-505",
    code: "DCODE-505",
    name: "Advanced Kidney Cancer Genomics",
    therapeuticArea: ["ONC"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-12-05",
    geography: ["US", "EU"],
    patientCount: 345,
    description: "Comprehensive genomic profiling of advanced renal cell carcinoma subtypes.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-08-01",
      primaryCompletionDate: "2023-07-31",
      studyLockDate: "2023-12-05",
      principalInvestigator: "Dr. Emily Watson, MD, PhD",
      sponsor: "Kidney Cancer Genomics Consortium",
      nctNumber: "NCT04234789",
      studyDesign: "Prospective, observational, multicenter genomic profiling study",
      primaryEndpoint: "Molecular Subtype Classification Rate",
      secondaryEndpoints: ["Actionable Mutation Detection Rate", "Treatment Selection Correlation", "Prognostic Signature Validation"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.1",
      protocolAmendments: 0,
      targetEnrollment: 360,
      actualEnrollment: 345,
      numberOfSites: 18,
      treatmentArms: ["Genomic Profiling Cohort (observational)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "sdtm-demographics", "omics-variants", "omics-cn-sv", "adam-adsl"],
    collections: ["Genitourinary Cancer Studies", "Genomic Profiling Collection"],
    activeUsers: 54,
    organizations: 4,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 40, needsApproval: 25, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst"],
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-481", "DCODE-493"],
  },
  {
    id: "dcode-517",
    code: "DCODE-517",
    name: "Glioblastoma Treatment Study",
    therapeuticArea: ["ONC", "NEURO"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-01-30",
    geography: ["US", "EU"],
    patientCount: 567,
    description: "Novel treatment approach in newly diagnosed glioblastoma with MRI monitoring.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-02-01",
      primaryCompletionDate: "2023-08-31",
      studyLockDate: "2024-01-30",
      principalInvestigator: "Dr. Gregory Adams, MD, PhD",
      sponsor: "Neuro-Oncology Research Institute",
      nctNumber: "NCT04056123",
      studyDesign: "Randomized, open-label, multicenter Phase III",
      primaryEndpoint: "Overall Survival (OS)",
      secondaryEndpoints: ["Progression-Free Survival (PFS)", "Volumetric MRI Response", "Neurocognitive Function (MMSE)"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.3",
      protocolAmendments: 1,
      targetEnrollment: 580,
      actualEnrollment: 567,
      numberOfSites: 32,
      treatmentArms: ["Temozolomide + Tumor Treating Fields", "Temozolomide Alone"],
      blindingType: "Open-label",
      randomizationRatio: "1:1",
    },
    categories: ["ta-onc", "ta-neuro", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "dicom-quantitative", "adam-adsl", "adam-adtte"],
    collections: ["Oncology Outcomes Archive", "Neurology Imaging Archive", "Brain Tumor Studies"],
    activeUsers: 89,
    organizations: 6,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 35, needsApproval: 25, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3", "Snowflake"],
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-529", "DCODE-541"],
    childDatasets: [
      { id: "dcode-517-clin", code: "DCODE-517-CLIN", name: "Clinical Demographics", accessStatus: "open", dataType: "Clinical", recordCount: 567 },
      { id: "dcode-517-surv", code: "DCODE-517-SURV", name: "Survival Outcomes", accessStatus: "open", dataType: "Clinical", recordCount: 567 },
      { id: "dcode-517-mri", code: "DCODE-517-MRI", name: "Brain MRI Imaging", accessStatus: "ready", dataType: "Imaging", recordCount: 2835 },
      { id: "dcode-517-neuro", code: "DCODE-517-NEURO", name: "Neurocognitive Tests", accessStatus: "ready", dataType: "Clinical", recordCount: 2268 },
      { id: "dcode-517-ae", code: "DCODE-517-AE", name: "Adverse Events", accessStatus: "approval", dataType: "Safety", recordCount: 1500 },
    ],
  },
  {
    id: "dcode-529",
    code: "DCODE-529",
    name: "Brain Metastases Radiation Study",
    therapeuticArea: ["ONC", "NEURO"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-09-10",
    geography: ["US"],
    patientCount: 289,
    description: "Stereotactic radiosurgery outcomes in patients with brain metastases from various primaries.",
    clinicalMetadata: {
      enrollmentStartDate: "2019-10-01",
      primaryCompletionDate: "2023-04-30",
      studyLockDate: "2023-09-10",
      principalInvestigator: "Dr. Sandra Miller, MD",
      sponsor: "Radiosurgery Outcomes Collaborative",
      nctNumber: "NCT04012567",
      studyDesign: "Prospective, observational, single-arm, multicenter outcomes study",
      primaryEndpoint: "Local Tumor Control Rate at 12 Months",
      secondaryEndpoints: ["Distant Brain Failure Rate", "Overall Survival (OS)", "Radiation Necrosis Incidence"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.2",
      protocolAmendments: 1,
      targetEnrollment: 300,
      actualEnrollment: 289,
      numberOfSites: 14,
      treatmentArms: ["Stereotactic Radiosurgery Cohort (single arm)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "ta-neuro", "sdtm-demographics", "sdtm-exposure", "dicom-quantitative", "adam-adsl"],
    collections: ["Brain Tumor Studies", "Radiation Oncology Archive"],
    activeUsers: 45,
    organizations: 3,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 40, needsApproval: 25, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Starburst", "S3", "Snowflake"],
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-517", "DCODE-541"],
  },
  {
    id: "dcode-541",
    code: "DCODE-541",
    name: "Pediatric Brain Tumor Genomics",
    therapeuticArea: ["ONC", "NEURO"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-11-25",
    geography: ["US", "EU"],
    patientCount: 178,
    description: "Comprehensive molecular profiling of pediatric high-grade gliomas and medulloblastomas.",
    clinicalMetadata: {
      enrollmentStartDate: "2019-04-01",
      primaryCompletionDate: "2023-06-30",
      studyLockDate: "2023-11-25",
      principalInvestigator: "Dr. Michelle Torres, MD, PhD",
      sponsor: "Pediatric Brain Tumor Consortium",
      nctNumber: "NCT03987654",
      studyDesign: "Prospective, observational, multicenter molecular profiling study",
      primaryEndpoint: "Molecular Subgroup Classification Rate",
      secondaryEndpoints: ["Targetable Alteration Detection Rate", "Survival by Molecular Subtype", "Treatment Outcome Correlation"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.1",
      protocolAmendments: 0,
      targetEnrollment: 190,
      actualEnrollment: 178,
      numberOfSites: 12,
      treatmentArms: ["Molecular Profiling Cohort (observational)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "ta-neuro", "sdtm-demographics", "omics-variants", "omics-cn-sv", "adam-adsl"],
    collections: ["Brain Tumor Studies", "Pediatric Oncology Collection", "Genomic Profiling Collection"],
    activeUsers: 42,
    organizations: 3,
    accessBreakdown: { alreadyOpen: 30, readyToGrant: 40, needsApproval: 30, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst", "S3"],
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-517", "DCODE-529"],
  },
  {
    id: "dcode-553",
    code: "DCODE-553",
    name: "Acute Myeloid Leukemia Genomics",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-02-10",
    geography: ["US", "EU", "Asia"],
    patientCount: 892,
    description: "Genomic profiling and treatment outcomes in newly diagnosed AML patients.",
    clinicalMetadata: {
      enrollmentStartDate: "2019-08-01",
      primaryCompletionDate: "2023-09-30",
      studyLockDate: "2024-02-10",
      principalInvestigator: "Dr. Robert Zhang, MD, PhD",
      sponsor: "Leukemia Genomics Alliance",
      nctNumber: "NCT04067890",
      studyDesign: "Prospective, observational, multicenter genomic-guided treatment study",
      primaryEndpoint: "Complete Remission Rate by Molecular Risk Group",
      secondaryEndpoints: ["Event-Free Survival (EFS)", "Overall Survival (OS)", "MRD Negativity Rate"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.0",
      protocolAmendments: 2,
      targetEnrollment: 900,
      actualEnrollment: 892,
      numberOfSites: 48,
      treatmentArms: ["Standard Induction", "Targeted Therapy by Mutation Profile"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "omics-variants", "omics-global-scores", "adam-adsl", "adam-adtte"],
    collections: ["Hematologic Malignancies Collection", "Genomic Profiling Collection"],
    activeUsers: 123,
    organizations: 8,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3"],
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-565", "DCODE-577"],
    childDatasets: [
      { id: "dcode-553-clin", code: "DCODE-553-CLIN", name: "Clinical Demographics", accessStatus: "open", dataType: "Clinical", recordCount: 892 },
      { id: "dcode-553-gen", code: "DCODE-553-GEN", name: "Genomic Profiling", accessStatus: "open", dataType: "Genomics", recordCount: 892 },
      { id: "dcode-553-resp", code: "DCODE-553-RESP", name: "Response Assessment", accessStatus: "ready", dataType: "Clinical", recordCount: 892 },
      { id: "dcode-553-mrd", code: "DCODE-553-MRD", name: "MRD Analysis", accessStatus: "ready", dataType: "Biomarker", recordCount: 2676 },
      { id: "dcode-553-surv", code: "DCODE-553-SURV", name: "Survival Outcomes", accessStatus: "approval", dataType: "Clinical", recordCount: 892 },
    ],
  },
  {
    id: "dcode-565",
    code: "DCODE-565",
    name: "Chronic Lymphocytic Leukemia Study",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-08-15",
    geography: ["US", "EU"],
    patientCount: 1234,
    description: "Phase III study of novel BTK inhibitor in treatment-naive and relapsed CLL.",
    clinicalMetadata: {
      enrollmentStartDate: "2018-06-01",
      primaryCompletionDate: "2023-03-31",
      studyLockDate: "2023-08-15",
      principalInvestigator: "Dr. Thomas Brown, MD",
      sponsor: "Lymphoma Therapeutics Inc",
      nctNumber: "NCT03567890",
      studyDesign: "Randomized, double-blind, active-controlled, multicenter Phase III",
      primaryEndpoint: "Progression-Free Survival (PFS)",
      secondaryEndpoints: ["Overall Survival (OS)", "Complete Response Rate (CR)", "Minimal Residual Disease (MRD) Negativity"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v3.0",
      protocolAmendments: 3,
      targetEnrollment: 1250,
      actualEnrollment: 1234,
      numberOfSites: 72,
      treatmentArms: ["Novel BTKi 420mg QD", "Ibrutinib 420mg QD"],
      blindingType: "Double-blind",
      randomizationRatio: "1:1",
    },
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-biomarker-labs", "adam-adsl", "adam-adtte"],
    collections: ["Hematologic Malignancies Collection", "Oncology Outcomes Archive"],
    activeUsers: 156,
    organizations: 10,
    accessBreakdown: { alreadyOpen: 50, readyToGrant: 30, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-553", "DCODE-577"],
    childDatasets: [
      { id: "dcode-565-clin", code: "DCODE-565-CLIN", name: "Clinical Outcomes", accessStatus: "open", dataType: "Clinical", recordCount: 1234 },
      { id: "dcode-565-resp", code: "DCODE-565-RESP", name: "Response Data", accessStatus: "open", dataType: "Clinical", recordCount: 1234 },
      { id: "dcode-565-ae", code: "DCODE-565-AE", name: "Adverse Events", accessStatus: "ready", dataType: "Safety", recordCount: 3400 },
      { id: "dcode-565-mrd", code: "DCODE-565-MRD", name: "MRD Monitoring", accessStatus: "ready", dataType: "Biomarker", recordCount: 4936 },
      { id: "dcode-565-surv", code: "DCODE-565-SURV", name: "Survival Analysis", accessStatus: "approval", dataType: "Clinical", recordCount: 1234 },
    ],
  },
  {
    id: "dcode-577",
    code: "DCODE-577",
    name: "Multiple Myeloma Treatment Trial",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-03-05",
    geography: ["Global"],
    patientCount: 1678,
    description: "Novel triplet therapy regimen in newly diagnosed multiple myeloma patients.",
    clinicalMetadata: {
      enrollmentStartDate: "2019-09-01",
      primaryCompletionDate: "2023-10-31",
      studyLockDate: "2024-03-05",
      principalInvestigator: "Dr. Charles Martin, MD, PhD",
      sponsor: "Myeloma Research Foundation",
      nctNumber: "NCT04078901",
      studyDesign: "Randomized, open-label, multicenter Phase III",
      primaryEndpoint: "Progression-Free Survival (PFS)",
      secondaryEndpoints: ["Overall Survival (OS)", "Very Good Partial Response or Better (≥VGPR)", "MRD Negativity Rate"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.2",
      protocolAmendments: 2,
      targetEnrollment: 1700,
      actualEnrollment: 1678,
      numberOfSites: 95,
      treatmentArms: ["DRd (Daratumumab + Lenalidomide + dexamethasone)", "Rd (Lenalidomide + dexamethasone)"],
      blindingType: "Open-label",
      randomizationRatio: "1:1",
    },
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Hematologic Malignancies Collection", "Oncology Outcomes Archive"],
    activeUsers: 189,
    organizations: 12,
    accessBreakdown: { alreadyOpen: 50, readyToGrant: 30, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-553", "DCODE-565"],
    childDatasets: [
      { id: "dcode-577-clin", code: "DCODE-577-CLIN", name: "Clinical Demographics", accessStatus: "open", dataType: "Clinical", recordCount: 1678 },
      { id: "dcode-577-resp", code: "DCODE-577-RESP", name: "Response Assessment", accessStatus: "open", dataType: "Clinical", recordCount: 1678 },
      { id: "dcode-577-ae", code: "DCODE-577-AE", name: "Adverse Events", accessStatus: "ready", dataType: "Safety", recordCount: 4500 },
      { id: "dcode-577-mrd", code: "DCODE-577-MRD", name: "MRD Analysis", accessStatus: "ready", dataType: "Biomarker", recordCount: 3356 },
      { id: "dcode-577-surv", code: "DCODE-577-SURV", name: "Survival Outcomes", accessStatus: "approval", dataType: "Clinical", recordCount: 1678 },
    ],
  },
  {
    id: "dcode-589",
    code: "DCODE-589",
    name: "Ovarian Cancer PARP Inhibitor Study",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-10-20",
    geography: ["US", "EU", "Asia"],
    patientCount: 1345,
    description: "PARP inhibitor maintenance therapy in BRCA-mutated ovarian cancer.",
    clinicalMetadata: {
      enrollmentStartDate: "2018-11-01",
      primaryCompletionDate: "2023-05-31",
      studyLockDate: "2023-10-20",
      principalInvestigator: "Dr. Nancy Phillips, MD",
      sponsor: "Gynecologic Oncology Research Group",
      nctNumber: "NCT03678901",
      studyDesign: "Randomized, double-blind, placebo-controlled, multicenter Phase III",
      primaryEndpoint: "Progression-Free Survival (PFS) in BRCA-mutated Population",
      secondaryEndpoints: ["Overall Survival (OS)", "Time to Second Progression (PFS2)", "Patient-Reported Outcomes (FOSI)"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.1",
      protocolAmendments: 2,
      targetEnrollment: 1400,
      actualEnrollment: 1345,
      numberOfSites: 78,
      treatmentArms: ["Olaparib 300mg BID Maintenance", "Placebo BID"],
      blindingType: "Double-blind",
      randomizationRatio: "2:1",
    },
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-adverse-events", "omics-variants", "adam-adsl", "adam-adtte"],
    collections: ["Oncology Outcomes Archive", "Gynecologic Cancer Studies", "Genomic Profiling Collection"],
    activeUsers: 167,
    organizations: 11,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3", "Snowflake"],
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-601", "DCODE-613"],
    childDatasets: [
      { id: "dcode-589-clin", code: "DCODE-589-CLIN", name: "Clinical Demographics", accessStatus: "open", dataType: "Clinical", recordCount: 1345 },
      { id: "dcode-589-brca", code: "DCODE-589-BRCA", name: "BRCA Mutation Status", accessStatus: "open", dataType: "Genomics", recordCount: 1345 },
      { id: "dcode-589-resp", code: "DCODE-589-RESP", name: "Response Assessment", accessStatus: "ready", dataType: "Clinical", recordCount: 1345 },
      { id: "dcode-589-ae", code: "DCODE-589-AE", name: "Adverse Events", accessStatus: "ready", dataType: "Safety", recordCount: 4000 },
      { id: "dcode-589-surv", code: "DCODE-589-SURV", name: "Survival Outcomes", accessStatus: "approval", dataType: "Clinical", recordCount: 1345 },
      { id: "dcode-589-pro", code: "DCODE-589-PRO", name: "Patient Reported Outcomes", accessStatus: "approval", dataType: "PRO", recordCount: 5380 },
    ],
  },
  {
    id: "dcode-601",
    code: "DCODE-601",
    name: "Endometrial Cancer Genomics Study",
    therapeuticArea: ["ONC"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-12-20",
    geography: ["US", "EU"],
    patientCount: 567,
    description: "Molecular characterization of endometrial cancer subtypes with treatment correlation.",
    clinicalMetadata: {
      enrollmentStartDate: "2020-05-01",
      primaryCompletionDate: "2023-08-31",
      studyLockDate: "2023-12-20",
      principalInvestigator: "Dr. Diana Cruz, MD, PhD",
      sponsor: "Uterine Cancer Genomics Consortium",
      nctNumber: "NCT04189012",
      studyDesign: "Prospective, observational, multicenter molecular profiling study",
      primaryEndpoint: "TCGA Molecular Subtype Classification Rate",
      secondaryEndpoints: ["Prognostic Signature Validation", "Treatment Selection Correlation", "Outcome by Molecular Class"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.2",
      protocolAmendments: 1,
      targetEnrollment: 580,
      actualEnrollment: 567,
      numberOfSites: 28,
      treatmentArms: ["Molecular Profiling Cohort (observational)"],
      blindingType: "Open-label",
      randomizationRatio: "N/A",
    },
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "omics-variants", "omics-cn-sv", "adam-adsl"],
    collections: ["Gynecologic Cancer Studies", "Genomic Profiling Collection"],
    activeUsers: 78,
    organizations: 5,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Starburst", "S3", "Snowflake"],
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-589", "DCODE-613"],
  },
  {
    id: "dcode-613",
    code: "DCODE-613",
    name: "Cervical Cancer Screening Registry",
    therapeuticArea: ["ONC"],
    phase: "IV",
    status: "Closed",
    closedDate: "2023-07-30",
    geography: ["US", "Asia"],
    patientCount: 8934,
    description: "Large population-based cervical cancer screening registry with HPV testing outcomes.",
    categories: ["ta-onc", "sdtm-demographics", "sdtm-biomarker-labs", "adam-adsl"],
    collections: ["Gynecologic Cancer Studies", "Real-World Evidence Collection"],
    activeUsers: 234,
    organizations: 15,
    accessBreakdown: { alreadyOpen: 70, readyToGrant: 20, needsApproval: 10, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst", "S3"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-589", "DCODE-601"],
    clinicalMetadata: {
      enrollmentStartDate: "2018-09-10",
      primaryCompletionDate: "2023-06-15",
      studyLockDate: "2023-07-30",
      principalInvestigator: "Dr. Sophia Martinez-Vega, MD, MPH",
      sponsor: "CervixScreen Initiatives",
      nctNumber: "NCT03456789",
      studyDesign: "Prospective population-based screening registry",
      primaryEndpoint: "HPV positivity rate and CIN 2+ detection",
      secondaryEndpoints: ["Screening adherence", "Colposcopy referral rate", "Treatment outcomes"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.0",
      protocolAmendments: 1,
      targetEnrollment: 9000,
      actualEnrollment: 8934,
      numberOfSites: 42,
      treatmentArms: ["Primary HPV screening", "Co-testing (HPV + cytology)", "Cytology alone"],
      blindingType: "Open-label",
    },
  },
  {
    id: "dcode-625",
    code: "DCODE-625",
    name: "Head and Neck Cancer Radiotherapy Study",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-01-05",
    geography: ["US", "EU"],
    patientCount: 678,
    description: "Concurrent chemoradiotherapy vs. immunotherapy combinations in locally advanced HNSCC.",
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Oncology Outcomes Archive", "Head and Neck Cancer Studies"],
    activeUsers: 89,
    organizations: 6,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-637", "DCODE-649"],
    clinicalMetadata: {
      enrollmentStartDate: "2019-11-05",
      primaryCompletionDate: "2023-10-20",
      studyLockDate: "2024-01-05",
      principalInvestigator: "Dr. Marcus O'Sullivan, MD, PhD",
      sponsor: "RadOnc Research Partners",
      nctNumber: "NCT04012345",
      studyDesign: "Randomized, open-label, Phase III",
      primaryEndpoint: "2-year locoregional control",
      secondaryEndpoints: ["Overall Survival", "Progression-Free Survival", "Acute/late toxicity rates"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v3.1",
      protocolAmendments: 2,
      targetEnrollment: 700,
      actualEnrollment: 678,
      numberOfSites: 28,
      treatmentArms: ["Cisplatin + Radiotherapy", "Pembrolizumab + Radiotherapy"],
      blindingType: "Open-label",
      randomizationRatio: "1:1",
    },
  },
  {
    id: "dcode-637",
    code: "DCODE-637",
    name: "HPV-Positive Head and Neck Cancer Study",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-11-10",
    geography: ["US", "EU", "Asia"],
    patientCount: 1234,
    description: "De-escalation therapy trial in HPV-positive oropharyngeal cancer.",
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-biomarker-labs", "adam-adsl", "adam-adtte"],
    collections: ["Head and Neck Cancer Studies", "Oncology Outcomes Archive"],
    activeUsers: 145,
    organizations: 9,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-625", "DCODE-649"],
    clinicalMetadata: {
      enrollmentStartDate: "2019-03-18",
      primaryCompletionDate: "2023-08-30",
      studyLockDate: "2023-11-10",
      principalInvestigator: "Dr. Elena Petrova-Chang, MD",
      sponsor: "Oropharynx Cancer Consortium",
      nctNumber: "NCT03789456",
      studyDesign: "Randomized, open-label, non-inferiority Phase III",
      primaryEndpoint: "3-year Overall Survival",
      secondaryEndpoints: ["Quality of Life (FACT-H&N)", "Swallowing function", "HPV clearance rate"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.4",
      protocolAmendments: 3,
      targetEnrollment: 1250,
      actualEnrollment: 1234,
      numberOfSites: 45,
      treatmentArms: ["Standard chemoradiation", "De-intensified radiotherapy alone"],
      blindingType: "Open-label",
      randomizationRatio: "1:1",
    },
  },
  {
    id: "dcode-649",
    code: "DCODE-649",
    name: "Thyroid Cancer Molecular Profiling",
    therapeuticArea: ["ONC", "ENDO"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-09-25",
    geography: ["US"],
    patientCount: 345,
    description: "Molecular profiling of differentiated thyroid cancer with BRAF and RAS mutation analysis.",
    categories: ["ta-onc", "ta-endo", "sdtm-demographics", "omics-variants", "adam-adsl"],
    collections: ["Head and Neck Cancer Studies", "Endocrinology Archive", "Genomic Profiling Collection"],
    activeUsers: 52,
    organizations: 4,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 40, needsApproval: 25, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst"],
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-625", "DCODE-637"],
    clinicalMetadata: {
      enrollmentStartDate: "2020-05-12",
      primaryCompletionDate: "2023-07-28",
      studyLockDate: "2023-09-25",
      principalInvestigator: "Dr. Hiroshi Tanaka, MD, PhD",
      sponsor: "Endocrine Oncology Foundation",
      nctNumber: "NCT04234567",
      studyDesign: "Single-arm, molecular profiling study",
      primaryEndpoint: "BRAF/RAS mutation prevalence",
      secondaryEndpoints: ["Response to targeted therapy by genotype", "Recurrence-free survival"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.3",
      protocolAmendments: 1,
      targetEnrollment: 350,
      actualEnrollment: 345,
      numberOfSites: 12,
      treatmentArms: ["Molecular profiling cohort"],
      blindingType: "Open-label",
    },
  },
  {
    id: "dcode-661",
    code: "DCODE-661",
    name: "Hepatocellular Carcinoma Targeted Therapy",
    therapeuticArea: ["ONC"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-02-15",
    geography: ["Asia", "US", "EU"],
    patientCount: 1456,
    description: "Systemic therapy trial in advanced hepatocellular carcinoma with imaging endpoints.",
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "dicom-quantitative", "adam-adsl", "adam-adtte"],
    collections: ["Gastrointestinal Cancer Studies", "Hepatology Collection"],
    activeUsers: 178,
    organizations: 12,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3", "Snowflake"],
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-673", "DCODE-685"],
    clinicalMetadata: {
      enrollmentStartDate: "2019-08-20",
      primaryCompletionDate: "2023-11-30",
      studyLockDate: "2024-02-15",
      principalInvestigator: "Dr. Wei-Lin Huang, MD, PhD",
      sponsor: "HepatoOncology Alliance",
      nctNumber: "NCT04345678",
      studyDesign: "Randomized, double-blind, placebo-controlled Phase III",
      primaryEndpoint: "Overall Survival",
      secondaryEndpoints: ["Progression-Free Survival", "mRECIST response rate", "Time to progression"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v2.5",
      protocolAmendments: 2,
      targetEnrollment: 1500,
      actualEnrollment: 1456,
      numberOfSites: 68,
      treatmentArms: ["Lenvatinib + Pembrolizumab", "Lenvatinib + Placebo"],
      blindingType: "Double-blind",
      randomizationRatio: "1:1",
    },
  },
  {
    id: "dcode-673",
    code: "DCODE-673",
    name: "Chronic Hepatitis C Treatment Registry",
    therapeuticArea: ["INFECT"],
    phase: "IV",
    status: "Closed",
    closedDate: "2023-06-15",
    geography: ["Global"],
    patientCount: 5678,
    description: "Real-world effectiveness of direct-acting antiviral therapy in chronic HCV infection.",
    categories: ["ta-infect", "sdtm-demographics", "sdtm-exposure", "sdtm-biomarker-labs", "adam-adsl"],
    collections: ["Hepatology Collection", "Real-World Evidence Collection", "Infectious Disease Studies"],
    activeUsers: 234,
    organizations: 16,
    accessBreakdown: { alreadyOpen: 65, readyToGrant: 25, needsApproval: 10, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Starburst", "S3", "Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-661", "DCODE-685"],
    clinicalMetadata: {
      enrollmentStartDate: "2016-04-01",
      primaryCompletionDate: "2023-03-15",
      studyLockDate: "2023-06-15",
      principalInvestigator: "Dr. Fatima Al-Rashid, MD, FAASLD",
      sponsor: "Global HCV Elimination Network",
      nctNumber: "NCT02567890",
      studyDesign: "Prospective, observational registry",
      primaryEndpoint: "Sustained Virologic Response (SVR12)",
      secondaryEndpoints: ["Treatment adherence", "Retreatment outcomes", "Fibrosis regression"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v4.0",
      protocolAmendments: 5,
      targetEnrollment: 6000,
      actualEnrollment: 5678,
      numberOfSites: 156,
      treatmentArms: ["Sofosbuvir/Velpatasvir", "Glecaprevir/Pibrentasvir", "Other DAA regimens"],
      blindingType: "Open-label",
    },
  },
  {
    id: "dcode-685",
    code: "DCODE-685",
    name: "Liver Fibrosis Imaging Study",
    therapeuticArea: ["GASTRO"],
    phase: "II",
    status: "Closed",
    closedDate: "2023-10-05",
    geography: ["US", "EU"],
    patientCount: 456,
    description: "Non-invasive imaging assessment of liver fibrosis using MRI elastography.",
    categories: ["ta-gastro", "sdtm-demographics", "dicom-acquisition", "dicom-quantitative", "adam-adsl"],
    collections: ["Hepatology Collection", "Imaging Biomarker Studies"],
    activeUsers: 67,
    organizations: 5,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst", "S3"],
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-661", "DCODE-673"],
    clinicalMetadata: {
      enrollmentStartDate: "2020-09-01",
      primaryCompletionDate: "2023-08-15",
      studyLockDate: "2023-10-05",
      principalInvestigator: "Dr. Johann Müller-Weber, MD",
      sponsor: "FibroImaging Collaborative",
      nctNumber: "NCT04456789",
      studyDesign: "Prospective, cross-sectional diagnostic study",
      primaryEndpoint: "MR elastography correlation with liver biopsy Metavir score",
      secondaryEndpoints: ["Inter-reader variability", "Shear wave stiffness measurements", "Composite biomarker accuracy"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v1.5",
      protocolAmendments: 1,
      targetEnrollment: 500,
      actualEnrollment: 456,
      numberOfSites: 18,
      treatmentArms: ["MRE imaging cohort"],
      blindingType: "Single-blind",
    },
  },
  {
    id: "dcode-697",
    code: "DCODE-697",
    name: "COVID-19 Hospitalized Patients Study",
    therapeuticArea: ["INFECT"],
    phase: "III",
    status: "Closed",
    closedDate: "2023-05-30",
    geography: ["Global"],
    patientCount: 3456,
    description: "Randomized trial of antiviral therapy in hospitalized COVID-19 patients.",
    categories: ["ta-infect", "sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events", "sdtm-biomarker-labs", "adam-adsl", "adam-adtte"],
    collections: ["Infectious Disease Studies", "Real-World Evidence Collection"],
    activeUsers: 289,
    organizations: 20,
    accessBreakdown: { alreadyOpen: 70, readyToGrant: 20, needsApproval: 10, missingLocation: 0 },
    accessPlatform: "SCP",
    dataLayer: ["S3"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-709", "DCODE-721"],
    clinicalMetadata: {
      enrollmentStartDate: "2020-03-25",
      primaryCompletionDate: "2023-02-28",
      studyLockDate: "2023-05-30",
      principalInvestigator: "Dr. Anika Patel-Johansson, MD, PhD",
      sponsor: "Pandemic Response Therapeutics",
      nctNumber: "NCT04378901",
      studyDesign: "Randomized, double-blind, placebo-controlled, adaptive Phase III",
      primaryEndpoint: "Time to sustained clinical recovery",
      secondaryEndpoints: ["28-day mortality", "Duration of supplemental oxygen", "ICU-free days"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v5.2",
      protocolAmendments: 6,
      targetEnrollment: 3500,
      actualEnrollment: 3456,
      numberOfSites: 185,
      treatmentArms: ["Remdesivir", "Baricitinib + Remdesivir", "Placebo"],
      blindingType: "Double-blind",
      randomizationRatio: "1:1:1",
    },
  },
  {
    id: "dcode-709",
    code: "DCODE-709",
    name: "COVID-19 Long-Term Sequelae Study",
    therapeuticArea: ["INFECT"],
    phase: "IV",
    status: "Active",
    geography: ["US", "EU"],
    patientCount: 2134,
    description: "Longitudinal outcomes study of post-acute sequelae of COVID-19 (long COVID).",
    categories: ["ta-infect", "sdtm-demographics", "sdtm-biomarker-labs", "adam-adsl"],
    collections: ["Infectious Disease Studies"],
    activeUsers: 167,
    organizations: 12,
    accessBreakdown: { alreadyOpen: 20, readyToGrant: 30, needsApproval: 50, missingLocation: 0 },
    accessPlatform: "AIBench",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-697"],
    clinicalMetadata: {
      enrollmentStartDate: "2021-06-01",
      principalInvestigator: "Dr. Carlos Mendez-Rivera, MD, MPH",
      sponsor: "Long COVID Research Initiative",
      nctNumber: "NCT04890123",
      studyDesign: "Prospective, longitudinal observational cohort",
      primaryEndpoint: "Incidence of post-acute sequelae at 12 months",
      secondaryEndpoints: ["Symptom cluster characterization", "Functional status", "Quality of life (SF-36)"],
      enrollmentStatus: "Ongoing",
      dataLockStatus: "Interim",
      protocolVersion: "v2.1",
      protocolAmendments: 2,
      targetEnrollment: 2500,
      actualEnrollment: 2134,
      numberOfSites: 45,
      treatmentArms: ["Observational cohort"],
      blindingType: "Open-label",
    },
  },
  {
    id: "dcode-721",
    code: "DCODE-721",
    name: "HIV Treatment Outcomes Registry",
    therapeuticArea: ["INFECT"],
    phase: "IV",
    status: "Closed",
    closedDate: "2023-08-10",
    geography: ["Global"],
    patientCount: 6789,
    description: "Long-term outcomes of antiretroviral therapy regimens in treatment-experienced patients.",
    categories: ["ta-infect", "sdtm-demographics", "sdtm-exposure", "sdtm-biomarker-labs", "adam-adsl", "adam-adtte"],
    collections: ["Infectious Disease Studies", "Real-World Evidence Collection"],
    activeUsers: 312,
    organizations: 22,
    accessBreakdown: { alreadyOpen: 75, readyToGrant: 20, needsApproval: 5, missingLocation: 0 },
    accessPlatform: "Domino",
    dataLayer: ["Starburst"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-697", "DCODE-673"],
    clinicalMetadata: {
      enrollmentStartDate: "2015-01-15",
      primaryCompletionDate: "2023-06-30",
      studyLockDate: "2023-08-10",
      principalInvestigator: "Dr. Nkechi Okonkwo, MD, PhD",
      sponsor: "Antiretroviral Outcomes Consortium",
      nctNumber: "NCT02345678",
      studyDesign: "Prospective, multicenter, observational registry",
      primaryEndpoint: "Long-term virologic suppression (HIV-1 RNA <50 copies/mL)",
      secondaryEndpoints: ["CD4+ T-cell recovery", "Drug resistance emergence", "Treatment durability"],
      enrollmentStatus: "Completed",
      dataLockStatus: "Locked",
      protocolVersion: "v6.0",
      protocolAmendments: 8,
      targetEnrollment: 7000,
      actualEnrollment: 6789,
      numberOfSites: 210,
      treatmentArms: ["Integrase inhibitor-based", "NNRTI-based", "PI-based", "Other regimens"],
      blindingType: "Open-label",
    },
  },
  // Complex/Blocked datasets - require extended processing time
  {
    id: "dcode-501",
    code: "DCODE-501",
    name: "Rare Pediatric Neurodegenerative Disorders Registry",
    therapeuticArea: ["CNS", "RARE"],
    phase: "N/A",
    status: "Active",
    geography: ["US", "EU", "UK", "Canada"],
    patientCount: 156,
    description: "Multi-center registry tracking rare pediatric neurodegenerative conditions with sensitive genetic and clinical data requiring extended governance review.",
    categories: ["ta-cns", "sdtm-demographics"],
    collections: ["Rare Disease Initiative"],
    activeUsers: 12,
    organizations: 4,
    accessBreakdown: { alreadyOpen: 5, readyToGrant: 10, needsApproval: 25, missingLocation: 60 },
    accessPlatform: "Domino",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-502"],
    approvalRequirements: [],
    approvalActions: [],
  },
  {
    id: "dcode-502",
    code: "DCODE-502",
    name: "Cross-Border Genomic Biobank Alliance",
    therapeuticArea: ["ONCO", "IMM"],
    phase: "IV",
    status: "Active",
    geography: ["US", "EU", "Japan", "China", "Brazil"],
    patientCount: 45000,
    description: "International genomic biobank with complex cross-border data transfer requirements and third-party data sharing restrictions.",
    categories: ["ta-onco", "sdtm-demographics", "biomarker"],
    collections: ["Global Biobank Network"],
    activeUsers: 89,
    organizations: 23,
    accessBreakdown: { alreadyOpen: 10, readyToGrant: 15, needsApproval: 20, missingLocation: 55 },
    accessPlatform: "SCP",
    dataLayer: ["Snowflake", "Domino"],
    dataLocation: { clinical: "S3", genomics: "Domino" },
    frequentlyBundledWith: ["DCODE-501", "DCODE-503"],
    approvalRequirements: [],
    approvalActions: [],
  },
  {
    id: "dcode-503",
    code: "DCODE-503",
    name: "Proprietary AI Drug Discovery Partnership Data",
    therapeuticArea: ["ONCO", "IMM", "CNS"],
    phase: "I",
    status: "Active",
    geography: ["US"],
    patientCount: 2300,
    description: "Highly sensitive partnership data with extensive legal review requirements and AI/ML use restrictions.",
    categories: ["ta-onco", "sdtm-demographics", "adam-adsl"],
    collections: ["Strategic Partnerships"],
    activeUsers: 5,
    organizations: 2,
    accessBreakdown: { alreadyOpen: 0, readyToGrant: 5, needsApproval: 15, missingLocation: 80 },
    accessPlatform: "AIBench",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: [],
    approvalRequirements: [],
    approvalActions: [],
  },
  {
    id: "dcode-504",
    code: "DCODE-504",
    name: "Long-term Safety Surveillance Database",
    therapeuticArea: ["CARDIO", "METAB"],
    phase: "IV",
    status: "Active",
    geography: ["US", "EU", "UK"],
    patientCount: 125000,
    description: "Post-marketing surveillance data with complex data governance requirements due to identifiable patient information.",
    categories: ["ta-cardio", "sdtm-adverse-events", "safety"],
    collections: ["Pharmacovigilance"],
    activeUsers: 34,
    organizations: 8,
    accessBreakdown: { alreadyOpen: 15, readyToGrant: 20, needsApproval: 25, missingLocation: 40 },
    accessPlatform: "Domino",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-203"],
    approvalRequirements: [],
    approvalActions: [],
  },
  {
    id: "dcode-506",
    code: "DCODE-506",
    name: "Pediatric Oncology Longitudinal Outcomes",
    therapeuticArea: ["ONCO", "RARE"],
    phase: "III",
    status: "Closed",
    closedDate: "2024-06-30",
    geography: ["US", "Canada"],
    patientCount: 890,
    description: "Sensitive pediatric cancer outcomes data with extended IRB and ethics committee review requirements.",
    categories: ["ta-onco", "sdtm-demographics", "sdtm-adverse-events"],
    collections: ["Pediatric Research Network"],
    activeUsers: 18,
    organizations: 6,
    accessBreakdown: { alreadyOpen: 8, readyToGrant: 12, needsApproval: 20, missingLocation: 60 },
    accessPlatform: "SCP",
    dataLayer: ["Snowflake"],
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-501"],
    approvalRequirements: [],
    approvalActions: [],
  },
]

// Filter datasets by criteria
export function filterDatasets(
  datasets: Dataset[],
  filters: {
    categories?: string[]
    phase?: string[]
    status?: string[]
    geography?: string[]
    crossover?: string // "none" | "moderate" | "high"
    usage?: string // "low" | "medium" | "high"
  }
): Dataset[] {
  return datasets.filter((dataset) => {
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      const hasCategory = filters.categories.some((catId) =>
        dataset.categories.includes(catId)
      )
      if (!hasCategory) return false
    }

    // Phase filter
    if (filters.phase && filters.phase.length > 0) {
      if (!filters.phase.includes(dataset.phase)) return false
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(dataset.status)) return false
    }

    // Geography filter
    if (filters.geography && filters.geography.length > 0) {
      const hasGeography = filters.geography.some((geo) =>
        dataset.geography.includes(geo)
      )
      if (!hasGeography) return false
    }

    // Crossover filter
    if (filters.crossover) {
      const collectionCount = dataset.collections.length
      if (filters.crossover === "none" && collectionCount > 0) return false
      if (filters.crossover === "moderate" && (collectionCount === 0 || collectionCount > 3))
        return false
      if (filters.crossover === "high" && collectionCount < 4) return false
    }

    // Usage filter
    if (filters.usage) {
      const users = dataset.activeUsers
      if (filters.usage === "low" && users >= 10) return false
      if (filters.usage === "medium" && (users < 10 || users > 50)) return false
      if (filters.usage === "high" && users < 50) return false
    }

    return true
  })
}

// Collection Progress Data
export interface Collection {
  id: string
  name: string
  description: string
  status: "provisioning" | "completed" | "pending_approval"
  progress: number
  totalUsers: number
  usersWithAccess: number
  totalDatasets: number
  createdAt: Date
  createdBy: string
  therapeuticAreas: string[] // For filtering
  tags: string[] // Additional metadata
  accessLevel: "member" | "public" | "restricted" | "request" // User's access status
  isFavorite?: boolean // Starred by current user
  commentCount: number // Number of discussion comments
  selectedDatasets: Dataset[]
  accessBreakdown: {
    immediate: number // Already have access (20%)
    instantGrant: number // In progress (30%)
    pendingApproval: number // Awaiting approval (40%)
    dataDiscovery: number // Missing location (10%)
  }
  instantGrantProgress: number // 0-100
  approvalRequests: {
    team: string
    count: number
    estimatedDays: string
  }[]
  milestones: {
    name: string
    status: "completed" | "in_progress" | "pending"
    timestamp?: Date
    estimatedTime?: Date
  }[]

  // Agreement of Terms
  agreementOfTerms?: AgreementOfTerms
}

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: "col-1",
    name: "Oncology ctDNA Outcomes Collection",
    description:
      "Curated collection of Phase III lung cancer studies with ctDNA biomarker monitoring and immunotherapy treatment arms. Suitable for outcomes research, biomarker analysis, and multimodal data fusion.",
    status: "provisioning",
    progress: 60,
    totalUsers: 35,
    usersWithAccess: 10,
    totalDatasets: 6,
    createdAt: new Date("2025-11-11T10:30:00"),
    createdBy: "Jennifer Martinez",
    therapeuticAreas: ["Oncology", "Immunology"],
    tags: ["ctDNA", "biomarkers", "Phase III", "lung cancer"],
    accessLevel: "member",
    commentCount: 6,
    isFavorite: true,
    selectedDatasets: MOCK_DATASETS.slice(0, 6),
    accessBreakdown: {
      immediate: 30,  // 30% ~10 users
      instantGrant: 25, // 25% ~9 users
      pendingApproval: 25, // 25% ~9 users
      dataDiscovery: 20, // 20% ~7 users (training blocked)
    },
    instantGrantProgress: 70,
    approvalRequests: [
      { team: "GPT-Oncology", count: 4, estimatedDays: "2-3 days" },
      { team: "TALT-Legal", count: 2, estimatedDays: "3-5 days" },
    ],
    milestones: [
      {
        name: "Collection published",
        status: "completed",
        timestamp: new Date("2025-11-11T10:30:00"),
      },
      {
        name: "10 users granted immediate access",
        status: "completed",
        timestamp: new Date("2025-11-11T10:31:00"),
      },
      {
        name: "Instant grant (9 users expected)",
        status: "in_progress",
        estimatedTime: new Date(Date.now() + 3600000),
      },
      {
        name: "GPT-Oncology approvals",
        status: "pending",
        estimatedTime: new Date(Date.now() + 259200000),
      },
      {
        name: "TALT-Legal approvals",
        status: "pending",
        estimatedTime: new Date(Date.now() + 432000000),
      },
    ],
    agreementOfTerms: {
      id: "aot-1",
      version: "1.0",
      primaryUse: {
        understandDrugMechanism: true,
        understandDisease: true,
        developDiagnosticTests: false,
        learnFromPastStudies: true,
        improveAnalysisMethods: true,
      },
      beyondPrimaryUse: {
        aiResearch: true,
        softwareDevelopment: true,
      },
      publication: {
        internalCompanyRestricted: true,
        externalPublication: "by_exception",
      },
      externalSharing: {
        allowed: false,
      },
      userScope: {
        byDepartment: ["Oncology Biometrics", "Oncology Data Science"],
        byRole: ["Data Scientist", "Biostatistician"],
        totalUserCount: 35,
      },
      aiSuggested: true,
      userModified: ["beyondPrimaryUse.softwareDevelopment"],
      acknowledgedConflicts: [
        {
          datasetId: "ds-3",
          datasetName: "DCODE-156",
          conflictDescription: "Dataset restricts AI/ML use; AoT allows AI research",
          acknowledgedAt: new Date("2025-11-11T10:25:00"),
          acknowledgedBy: "Jennifer Martinez",
        },
      ],
      createdAt: new Date("2025-11-11T10:25:00"),
      createdBy: "Jennifer Martinez",
      effectiveDate: new Date("2025-11-11"),
      reviewDate: new Date("2026-11-11"),
    },
  },
  {
    id: "col-2",
    name: "Cardiovascular Outcomes Collection",
    description:
      "Comprehensive cardiovascular outcomes data from Phase II-IV trials. Includes primary endpoints, safety data, and long-term follow-up across multiple indications.",
    status: "completed",
    progress: 100,
    totalUsers: 22,
    usersWithAccess: 22,
    totalDatasets: 8,
    createdAt: new Date("2025-10-28T14:15:00"),
    createdBy: "Dr. Sarah Martinez",
    therapeuticAreas: ["Cardiovascular"],
    tags: ["outcomes", "Phase II", "Phase III", "Phase IV", "safety"],
    accessLevel: "member",
    commentCount: 0,
    isFavorite: false,
    selectedDatasets: MOCK_DATASETS.slice(2, 8),
    accessBreakdown: {
      immediate: 60,  // 60% ~13 users
      instantGrant: 30, // 30% ~7 users
      pendingApproval: 10, // 10% ~2 users
      dataDiscovery: 0, // 0% no training blocked
    },
    instantGrantProgress: 100,
    approvalRequests: [],
    milestones: [
      {
        name: "Collection published",
        status: "completed",
        timestamp: new Date("2025-10-28T14:15:00"),
      },
      {
        name: "13 users granted immediate access",
        status: "completed",
        timestamp: new Date("2025-10-28T14:16:00"),
      },
      {
        name: "Instant grant completed (7 users)",
        status: "completed",
        timestamp: new Date("2025-10-28T15:20:00"),
      },
      {
        name: "All approvals completed",
        status: "completed",
        timestamp: new Date("2025-10-31T09:00:00"),
      },
    ],
  },
  {
    id: "col-3",
    name: "Immunotherapy Response Data",
    description:
      "Multi-indication immunotherapy response datasets with detailed biomarker, imaging, and clinical outcome data. Focused on checkpoint inhibitor therapies across multiple tumor types.",
    status: "completed",
    progress: 100,
    totalUsers: 18,
    usersWithAccess: 18,
    totalDatasets: 5,
    createdAt: new Date("2025-10-15T09:45:00"),
    createdBy: "Dr. Michael Chen",
    therapeuticAreas: ["Oncology", "Immunology"],
    tags: ["immunotherapy", "checkpoint inhibitors", "biomarkers", "imaging"],
    accessLevel: "member",
    commentCount: 2,
    isFavorite: true,
    selectedDatasets: MOCK_DATASETS.slice(1, 6),
    accessBreakdown: {
      immediate: 40,  // 40% ~7 users
      instantGrant: 20, // 20% ~4 users
      pendingApproval: 30, // 30% ~5 users
      dataDiscovery: 10, // 10% ~2 users (training blocked)
    },
    instantGrantProgress: 100,
    approvalRequests: [],
    milestones: [
      {
        name: "Collection published",
        status: "completed",
        timestamp: new Date("2025-10-15T09:45:00"),
      },
      {
        name: "7 users granted immediate access",
        status: "completed",
        timestamp: new Date("2025-10-15T09:46:00"),
      },
      {
        name: "Instant grant completed (4 users)",
        status: "completed",
        timestamp: new Date("2025-10-15T10:50:00"),
      },
      {
        name: "All approvals completed",
        status: "completed",
        timestamp: new Date("2025-10-18T11:30:00"),
      },
    ],
  },
  {
    id: "col-4",
    name: "Diabetes Management Real World Evidence",
    description:
      "Real-world evidence from diabetes management programs across multiple geographies. Includes patient-reported outcomes, adherence data, and clinical biomarkers.",
    status: "completed",
    progress: 100,
    totalUsers: 65,
    usersWithAccess: 65,
    totalDatasets: 4,
    createdAt: new Date("2025-09-20T08:30:00"),
    createdBy: "Emily Rodriguez",
    therapeuticAreas: ["Metabolic", "Endocrinology"],
    tags: ["diabetes", "real world evidence", "patient outcomes", "adherence"],
    accessLevel: "public",
    commentCount: 8,
    isFavorite: false,
    selectedDatasets: MOCK_DATASETS.slice(0, 4),
    accessBreakdown: {
      immediate: 65,
      instantGrant: 0,
      pendingApproval: 0,
      dataDiscovery: 0,
    },
    instantGrantProgress: 100,
    approvalRequests: [],
    milestones: [
      {
        name: "Collection published",
        status: "completed",
        timestamp: new Date("2025-09-20T08:30:00"),
      },
      {
        name: "All users granted access",
        status: "completed",
        timestamp: new Date("2025-09-20T08:35:00"),
      },
    ],
  },
  {
    id: "col-5",
    name: "Rare Disease Natural History Studies",
    description:
      "Natural history studies for rare genetic disorders including longitudinal clinical data, genetic sequencing, and family history information.",
    status: "pending_approval",
    progress: 25,
    totalUsers: 40,
    usersWithAccess: 0,
    totalDatasets: 7,
    createdAt: new Date("2025-11-10T14:00:00"),
    createdBy: "Dr. David Kumar",
    therapeuticAreas: ["Rare Diseases", "Genetics"],
    tags: ["natural history", "genetic disorders", "longitudinal", "sequencing"],
    accessLevel: "restricted",
    commentCount: 12,
    isFavorite: false,
    selectedDatasets: MOCK_DATASETS.slice(0, 7),
    accessBreakdown: {
      immediate: 0,
      instantGrant: 0,
      pendingApproval: 40,
      dataDiscovery: 0,
    },
    instantGrantProgress: 0,
    approvalRequests: [
      { team: "GPT-Rare-Disease", count: 6, estimatedDays: "5-7 days" },
      { team: "TALT-Legal", count: 1, estimatedDays: "3-5 days" },
    ],
    milestones: [
      {
        name: "Collection published",
        status: "completed",
        timestamp: new Date("2025-11-10T14:00:00"),
      },
      {
        name: "Awaiting GPT-Rare-Disease approval",
        status: "in_progress",
        estimatedTime: new Date(Date.now() + 432000000),
      },
    ],
  },
  {
    id: "col-6",
    name: "COVID-19 Vaccine Safety Monitoring",
    description:
      "Post-market surveillance data for COVID-19 vaccines including adverse events, efficacy metrics, and demographic breakdowns across global populations.",
    status: "completed",
    progress: 100,
    totalUsers: 220,
    usersWithAccess: 220,
    totalDatasets: 12,
    createdAt: new Date("2025-08-15T11:20:00"),
    createdBy: "Dr. Sarah Martinez",
    therapeuticAreas: ["Infectious Disease", "Vaccines"],
    tags: ["COVID-19", "vaccines", "safety", "post-market surveillance"],
    accessLevel: "public",
    commentCount: 34,
    isFavorite: true,
    selectedDatasets: MOCK_DATASETS.slice(0, 8),
    accessBreakdown: {
      immediate: 220,
      instantGrant: 0,
      pendingApproval: 0,
      dataDiscovery: 0,
    },
    instantGrantProgress: 100,
    approvalRequests: [],
    milestones: [
      {
        name: "Collection published",
        status: "completed",
        timestamp: new Date("2025-08-15T11:20:00"),
      },
      {
        name: "All users granted access",
        status: "completed",
        timestamp: new Date("2025-08-15T11:25:00"),
      },
    ],
  },
  {
    id: "col-7",
    name: "Neurodegenerative Disease Biomarkers",
    description:
      "Biomarker data from Alzheimer's and Parkinson's disease studies including CSF analysis, PET imaging, and cognitive assessments.",
    status: "provisioning",
    progress: 45,
    totalUsers: 78,
    usersWithAccess: 35,
    totalDatasets: 6,
    createdAt: new Date("2025-11-08T09:15:00"),
    createdBy: "Dr. Michael Chen",
    therapeuticAreas: ["Neurology", "Neuroscience"],
    tags: ["Alzheimer's", "Parkinson's", "biomarkers", "CSF", "PET imaging"],
    accessLevel: "request",
    commentCount: 5,
    isFavorite: false,
    selectedDatasets: MOCK_DATASETS.slice(1, 7),
    accessBreakdown: {
      immediate: 35,
      instantGrant: 30,
      pendingApproval: 13,
      dataDiscovery: 0,
    },
    instantGrantProgress: 55,
    approvalRequests: [
      { team: "GPT-Neurology", count: 2, estimatedDays: "2-3 days" },
    ],
    milestones: [
      {
        name: "Collection published",
        status: "completed",
        timestamp: new Date("2025-11-08T09:15:00"),
      },
      {
        name: "35 users granted immediate access",
        status: "completed",
        timestamp: new Date("2025-11-08T09:20:00"),
      },
      {
        name: "Instant grant in progress",
        status: "in_progress",
        estimatedTime: new Date(Date.now() + 7200000),
      },
    ],
  },
  {
    id: "col-8",
    name: "Pediatric Oncology Clinical Trials",
    description:
      "Phase II/III clinical trials for pediatric cancer indications including neuroblastoma, leukemia, and solid tumors with safety and efficacy data.",
    status: "completed",
    progress: 100,
    totalUsers: 52,
    usersWithAccess: 52,
    totalDatasets: 9,
    createdAt: new Date("2025-07-22T16:45:00"),
    createdBy: "Lisa Thompson",
    therapeuticAreas: ["Oncology", "Pediatrics"],
    tags: ["pediatric", "clinical trials", "neuroblastoma", "leukemia"],
    accessLevel: "member",
    commentCount: 18,
    isFavorite: false,
    selectedDatasets: MOCK_DATASETS.slice(0, 8),
    accessBreakdown: {
      immediate: 52,
      instantGrant: 0,
      pendingApproval: 0,
      dataDiscovery: 0,
    },
    instantGrantProgress: 100,
    approvalRequests: [],
    milestones: [
      {
        name: "Collection published",
        status: "completed",
        timestamp: new Date("2025-07-22T16:45:00"),
      },
      {
        name: "All users granted access",
        status: "completed",
        timestamp: new Date("2025-07-23T08:00:00"),
      },
    ],
  },
  {
    id: "col-9",
    name: "Respiratory Disease Epidemiology",
    description:
      "Epidemiological data for respiratory diseases including COPD, asthma, and pulmonary fibrosis with environmental exposure data.",
    status: "provisioning",
    progress: 30,
    totalUsers: 88,
    usersWithAccess: 25,
    totalDatasets: 5,
    createdAt: new Date("2025-11-09T13:30:00"),
    createdBy: "Emily Rodriguez",
    therapeuticAreas: ["Respiratory", "Epidemiology"],
    tags: ["COPD", "asthma", "epidemiology", "environmental", "pulmonary"],
    accessLevel: "request",
    commentCount: 3,
    isFavorite: false,
    selectedDatasets: MOCK_DATASETS.slice(2, 7),
    accessBreakdown: {
      immediate: 25,
      instantGrant: 40,
      pendingApproval: 23,
      dataDiscovery: 0,
    },
    instantGrantProgress: 40,
    approvalRequests: [
      { team: "GPT-Respiratory", count: 3, estimatedDays: "3-4 days" },
    ],
    milestones: [
      {
        name: "Collection published",
        status: "completed",
        timestamp: new Date("2025-11-09T13:30:00"),
      },
      {
        name: "25 users granted immediate access",
        status: "completed",
        timestamp: new Date("2025-11-09T13:35:00"),
      },
      {
        name: "Instant grant in progress",
        status: "in_progress",
        estimatedTime: new Date(Date.now() + 10800000),
      },
    ],
  },
  {
    id: "col-10",
    name: "Inflammatory Bowel Disease Outcomes",
    description:
      "Long-term outcomes data for IBD patients including treatment responses, quality of life measures, and endoscopic assessments.",
    status: "completed",
    progress: 100,
    totalUsers: 43,
    usersWithAccess: 43,
    totalDatasets: 3,
    createdAt: new Date("2025-06-10T10:00:00"),
    createdBy: "Dr. David Kumar",
    therapeuticAreas: ["Gastroenterology", "Immunology"],
    tags: ["IBD", "Crohn's disease", "ulcerative colitis", "outcomes", "QoL"],
    accessLevel: "public",
    commentCount: 7,
    isFavorite: false,
    selectedDatasets: MOCK_DATASETS.slice(3, 6),
    accessBreakdown: {
      immediate: 43,
      instantGrant: 0,
      pendingApproval: 0,
      dataDiscovery: 0,
    },
    instantGrantProgress: 100,
    approvalRequests: [],
    milestones: [
      {
        name: "Collection published",
        status: "completed",
        timestamp: new Date("2025-06-10T10:00:00"),
      },
      {
        name: "All users granted access",
        status: "completed",
        timestamp: new Date("2025-06-10T10:10:00"),
      },
    ],
  },
]

export function getCollectionById(id: string): Collection | undefined {
  return MOCK_COLLECTIONS.find((col) => col.id === id)
}

// Filter and search collections
export function filterCollections(
  collections: Collection[],
  filters: {
    search?: string
    status?: string[]
    therapeuticAreas?: string[]
    accessLevel?: "all" | "mine" | "public" | "restricted"
    owner?: string
  }
): Collection[] {
  return collections.filter((collection) => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        collection.name.toLowerCase().includes(searchLower) ||
        collection.description.toLowerCase().includes(searchLower) ||
        collection.createdBy.toLowerCase().includes(searchLower) ||
        collection.tags.some((tag) => tag.toLowerCase().includes(searchLower)) ||
        collection.selectedDatasets.some(
          (ds) =>
            ds.name.toLowerCase().includes(searchLower) ||
            ds.code.toLowerCase().includes(searchLower)
        )
      if (!matchesSearch) return false
    }

    // Status filter
    if (filters.status && filters.status.length > 0) {
      if (!filters.status.includes(collection.status)) return false
    }

    // Therapeutic Area filter
    if (filters.therapeuticAreas && filters.therapeuticAreas.length > 0) {
      const hasArea = filters.therapeuticAreas.some((area) =>
        collection.therapeuticAreas.includes(area)
      )
      if (!hasArea) return false
    }

    // Access Level filter
    if (filters.accessLevel && filters.accessLevel !== "all") {
      if (filters.accessLevel === "mine" && collection.accessLevel !== "member") return false
      if (filters.accessLevel === "public" && collection.accessLevel !== "public") return false
      if (filters.accessLevel === "restricted" && collection.accessLevel !== "restricted")
        return false
    }

    // Owner filter
    if (filters.owner) {
      if (!collection.createdBy.toLowerCase().includes(filters.owner.toLowerCase())) return false
    }

    return true
  })
}

// Get all unique therapeutic areas
export function getAllTherapeuticAreas(): string[] {
  const areas = new Set<string>()
  MOCK_COLLECTIONS.forEach((col) => {
    col.therapeuticAreas.forEach((area) => areas.add(area))
  })
  return Array.from(areas).sort()
}

// Get all unique owners
export function getAllOwners(): string[] {
  const owners = new Set(MOCK_COLLECTIONS.map((col) => col.createdBy))
  return Array.from(owners).sort()
}

// Notification System
export interface Notification {
  id: string
  type: "blocker" | "mention" | "approval" | "update" | "completion"
  priority: "critical" | "high" | "medium" | "low"
  collectionId: string
  collectionName: string
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  isArchived: boolean
  actionUrl?: string // Link to specific page
  actors: { name: string; role: string }[] // Who triggered it
}

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "notif-1",
    type: "blocker",
    priority: "critical",
    collectionId: "col-1",
    collectionName: "Oncology ctDNA Outcomes Collection",
    title: "Blocker: DCODE-156 Approval Delayed",
    message:
      "Dr. Sarah Martinez flagged DCODE-156 approval as blocked. TALT review required before proceeding with instant grant.",
    timestamp: new Date(Date.now() - 7200000), // 2 hours ago
    isRead: false,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "Dr. Sarah Martinez", role: "GPT-Oncology Lead" }],
  },
  {
    id: "notif-2",
    type: "blocker",
    priority: "critical",
    collectionId: "col-5",
    collectionName: "Rare Disease Natural History Studies",
    title: "Critical: Data Location Missing",
    message:
      "3 datasets in Rare Disease collection are missing data location information. Provisioning blocked until resolved.",
    timestamp: new Date(Date.now() - 14400000), // 4 hours ago
    isRead: false,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "Dr. David Kumar", role: "Collection Owner" }],
  },
  {
    id: "notif-3",
    type: "mention",
    priority: "high",
    collectionId: "col-4",
    collectionName: "Diabetes Management Real World Evidence",
    title: "You were mentioned in a discussion",
    message:
      '@Jennifer Martinez - "Can you review the patient cohort definition for the diabetes study?" asked by Emily Rodriguez.',
    timestamp: new Date(Date.now() - 3600000), // 1 hour ago
    isRead: false,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "Emily Rodriguez", role: "Data Scientist" }],
  },
  {
    id: "notif-4",
    type: "approval",
    priority: "high",
    collectionId: "col-1",
    collectionName: "Oncology ctDNA Outcomes Collection",
    title: "4 Approval Requests Pending",
    message:
      "GPT-Oncology team has 4 pending approval requests for DCODE-156. Estimated completion: 2-3 days.",
    timestamp: new Date(Date.now() - 10800000), // 3 hours ago
    isRead: false,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "GPT-Oncology Team", role: "Approval Team" }],
  },
  {
    id: "notif-5",
    type: "completion",
    priority: "low",
    collectionId: "col-6",
    collectionName: "COVID-19 Vaccine Safety Monitoring",
    title: "Collection Provisioning Complete",
    message: "All 220 users have been granted access to COVID-19 Vaccine Safety Monitoring collection.",
    timestamp: new Date(Date.now() - 172800000), // 2 days ago
    isRead: true,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "System", role: "Automated" }],
  },
  {
    id: "notif-6",
    type: "update",
    priority: "medium",
    collectionId: "col-1",
    collectionName: "Oncology ctDNA Outcomes Collection",
    title: "Instant Grant Progress Update",
    message: "70% complete - 84 of 120 users granted access. Estimated completion: 1 hour.",
    timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
    isRead: false,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "System", role: "Automated" }],
  },
  {
    id: "notif-7",
    type: "mention",
    priority: "high",
    collectionId: "col-8",
    collectionName: "Pediatric Oncology Clinical Trials",
    title: "New suggestion in Pediatric Oncology",
    message:
      '@Jennifer Martinez tagged you in a suggestion: "Consider adding DCODE-245 for additional neuroblastoma data"',
    timestamp: new Date(Date.now() - 21600000), // 6 hours ago
    isRead: true,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "Lisa Thompson", role: "Collection Owner" }],
  },
  {
    id: "notif-8",
    type: "completion",
    priority: "low",
    collectionId: "col-2",
    collectionName: "Cardiovascular Outcomes Collection",
    title: "All Approvals Completed",
    message: "All 180 users now have full access to Cardiovascular Outcomes Collection.",
    timestamp: new Date(Date.now() - 432000000), // 5 days ago
    isRead: true,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "System", role: "Automated" }],
  },
  {
    id: "notif-9",
    type: "update",
    priority: "medium",
    collectionId: "col-7",
    collectionName: "Neurodegenerative Disease Biomarkers",
    title: "New Comment: Dataset Recommendation",
    message:
      "Dr. Michael Chen posted an update with recommendations for additional PET imaging datasets.",
    timestamp: new Date(Date.now() - 28800000), // 8 hours ago
    isRead: false,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "Dr. Michael Chen", role: "Collection Owner" }],
  },
  {
    id: "notif-10",
    type: "approval",
    priority: "high",
    collectionId: "col-5",
    collectionName: "Rare Disease Natural History Studies",
    title: "6 Requests Awaiting GPT-Rare-Disease Review",
    message: "Rare Disease collection has 6 pending requests. Estimated review time: 5-7 days.",
    timestamp: new Date(Date.now() - 43200000), // 12 hours ago
    isRead: false,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "GPT-Rare-Disease Team", role: "Approval Team" }],
  },
  // Additional notifications for full-screen view
  {
    id: "notif-11",
    type: "completion",
    priority: "low",
    collectionId: "col-3",
    collectionName: "Immunotherapy Response Data",
    title: "Data Transfer Complete",
    message: "All genomic data files successfully transferred to SolveBio. Collection ready for analysis.",
    timestamp: new Date(Date.now() - 86400000), // 1 day ago
    isRead: true,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "System", role: "Automated" }],
  },
  {
    id: "notif-12",
    type: "update",
    priority: "medium",
    collectionId: "col-9",
    collectionName: "Respiratory Disease Epidemiology",
    title: "Collection Shared with 3 Teams",
    message: "GPT-Respiratory, Epidemiology Research, and Environmental Health teams have been granted access.",
    timestamp: new Date(Date.now() - 54000000), // 15 hours ago
    isRead: false,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "Emily Rodriguez", role: "Collection Owner" }],
  },
  {
    id: "notif-13",
    type: "mention",
    priority: "high",
    collectionId: "col-10",
    collectionName: "Inflammatory Bowel Disease Outcomes",
    title: "Question about dataset inclusion",
    message:
      '@Jennifer Martinez - "Should we include the endoscopy imaging from DCODE-378 or just the clinical scores?" - Dr. David Kumar',
    timestamp: new Date(Date.now() - 79200000), // 22 hours ago
    isRead: false,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "Dr. David Kumar", role: "Collection Owner" }],
  },
  {
    id: "notif-14",
    type: "approval",
    priority: "medium",
    collectionId: "col-7",
    collectionName: "Neurodegenerative Disease Biomarkers",
    title: "2 Approval Requests Approved",
    message: "GPT-Neurology approved access for 2 research teams. 35 additional users will receive access within 24 hours.",
    timestamp: new Date(Date.now() - 129600000), // 1.5 days ago
    isRead: true,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "GPT-Neurology Team", role: "Approval Team" }],
  },
  {
    id: "notif-15",
    type: "update",
    priority: "low",
    collectionId: "col-4",
    collectionName: "Diabetes Management Real World Evidence",
    title: "Usage Milestone Reached",
    message: "This collection has now served 100+ unique users. Great adoption across the organization!",
    timestamp: new Date(Date.now() - 259200000), // 3 days ago
    isRead: true,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "System", role: "Automated" }],
  },
  {
    id: "notif-16",
    type: "blocker",
    priority: "critical",
    collectionId: "col-9",
    collectionName: "Respiratory Disease Epidemiology",
    title: "GDPR Compliance Review Required",
    message: "DCODE-442 contains EU patient data. TALT-Legal review required before granting access to 23 pending users.",
    timestamp: new Date(Date.now() - 18000000), // 5 hours ago
    isRead: false,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "TALT-Legal Team", role: "Compliance" }],
  },
  {
    id: "notif-17",
    type: "completion",
    priority: "low",
    collectionId: "col-8",
    collectionName: "Pediatric Oncology Clinical Trials",
    title: "Quality Control Passed",
    message: "All datasets passed automated QC checks. No data integrity issues detected.",
    timestamp: new Date(Date.now() - 345600000), // 4 days ago
    isRead: true,
    isArchived: true,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "System", role: "Automated" }],
  },
  {
    id: "notif-18",
    type: "mention",
    priority: "medium",
    collectionId: "col-2",
    collectionName: "Cardiovascular Outcomes Collection",
    title: "Dataset recommendation",
    message:
      '@Jennifer Martinez - "The ASCEND trial data (DCODE-567) would complement this collection nicely" - Dr. Sarah Martinez',
    timestamp: new Date(Date.now() - 194400000), // 2.25 days ago
    isRead: true,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "Dr. Sarah Martinez", role: "GPT-Cardiology" }],
  },
  {
    id: "notif-19",
    type: "update",
    priority: "medium",
    collectionId: "col-6",
    collectionName: "COVID-19 Vaccine Safety Monitoring",
    title: "New Analysis Published",
    message: "Research team published findings using this collection. 12 citations in peer-reviewed journals.",
    timestamp: new Date(Date.now() - 604800000), // 7 days ago
    isRead: true,
    isArchived: true,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "Dr. Sarah Martinez", role: "Principal Investigator" }],
  },
  {
    id: "notif-20",
    type: "approval",
    priority: "high",
    collectionId: "col-3",
    collectionName: "Immunotherapy Response Data",
    title: "Expedited Approval Needed",
    message: "GPT-Immunology flagged 3 urgent requests for ongoing clinical trial. Please prioritize review.",
    timestamp: new Date(Date.now() - 25200000), // 7 hours ago
    isRead: false,
    isArchived: false,
    actionUrl: "/collectoid/dcm/progress",
    actors: [{ name: "GPT-Immunology Team", role: "Clinical Trial Lead" }],
  },
]

// Notification helper functions
export function getUnreadNotifications(): Notification[] {
  return MOCK_NOTIFICATIONS.filter((n) => !n.isRead && !n.isArchived)
}

export function getCriticalNotifications(): Notification[] {
  return MOCK_NOTIFICATIONS.filter((n) => n.priority === "critical" && !n.isRead && !n.isArchived)
}

export function getNotificationsByCollection(collectionId: string): Notification[] {
  return MOCK_NOTIFICATIONS.filter((n) => n.collectionId === collectionId && !n.isArchived)
}

export function getUnreadCount(): number {
  return MOCK_NOTIFICATIONS.filter((n) => !n.isRead && !n.isArchived).length
}

export function getCriticalCount(): number {
  return MOCK_NOTIFICATIONS.filter((n) => n.priority === "critical" && !n.isRead && !n.isArchived).length
}

export function getArchivedNotifications(): Notification[] {
  return MOCK_NOTIFICATIONS.filter((n) => n.isArchived)
}

export function getActiveNotifications(): Notification[] {
  return MOCK_NOTIFICATIONS.filter((n) => !n.isArchived)
}

export function getMentionNotifications(): Notification[] {
  return MOCK_NOTIFICATIONS.filter((n) => n.type === "mention" && !n.isRead && !n.isArchived)
}

export function getApprovalNotifications(): Notification[] {
  return MOCK_NOTIFICATIONS.filter((n) => n.type === "approval" && !n.isRead && !n.isArchived)
}

// User Management Types and Data
export interface User {
  id: string
  name: string
  email: string
  role: string
  department: string
  manager?: {
    name: string
    email: string
  }

  // Access status
  accessStatus: "immediate" | "instant_grant" | "pending_approval" | "blocked_training"
  datasetsAccessible: string[]      // Dataset codes user can access
  datasetsPending: string[]         // Dataset codes awaiting approval

  // Training
  trainingStatus: {
    required: string[]              // ["GCP", "GDPR Training", "Immuta Basics"]
    completed: string[]             // ["GCP"]
    inProgress: Array<{             // [{ cert: "GDPR Training", progress: 60 }]
      cert: string
      progress: number
    }>
    missing: string[]               // ["Immuta Basics"]
    completionPercent: number       // 33 (1 of 3 complete)
    deadline?: Date
    isOverdue: boolean
  }

  // Timeline
  enrollmentDate: Date
  lastActive?: Date
  daysWaiting: number

  // Communication tracking
  lastReminderSent?: Date
  reminderCount: number

  // Approval tracking
  approvalRequests: Array<{
    team: string                    // "GPT-Oncology"
    datasetCodes: string[]
    requestedDate: Date
    status: "pending" | "approved" | "rejected"
  }>
}

// Helper function to generate users for a collection
function generateUsersForCollection(
  collectionId: string,
  totalUsers: number,
  breakdown: { immediate: number; instant_grant: number; pending_approval: number; blocked_training: number }
): User[] {
  const users: User[] = []

  const firstNames = ["Sarah", "Marcus", "Priya", "David", "Emily", "James", "Amanda", "Robert", "Michelle", "Christopher",
                      "Jennifer", "Michael", "Lisa", "John", "Maria", "Daniel", "Laura", "Kevin", "Rebecca", "Thomas"]
  const lastNames = ["Chen", "Johnson", "Sharma", "Kim", "Rodriguez", "Patterson", "Foster", "Lee", "Torres", "Wang",
                    "Williams", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson"]
  const roles = ["Senior Data Scientist", "Clinical Data Analyst", "Bioinformatics Scientist", "Statistical Programmer",
                 "Clinical Research Scientist", "Data Engineer", "Research Associate", "Junior Data Scientist",
                 "Clinical Data Manager", "Biostatistician"]
  const departments = ["Oncology Research", "Clinical Operations", "Genomics", "Biostatistics", "Data Platform", "Analytics"]
  const managers = [
    { name: "Dr. Michael Roberts", email: "michael.roberts@astrazeneca.com" },
    { name: "Jennifer Williams", email: "jennifer.williams@astrazeneca.com" },
    { name: "Dr. Lisa Thompson", email: "lisa.thompson@astrazeneca.com" },
  ]

  let userCounter = 1

  // Generate immediate access users
  const immediateTrainingOptions = [
    { completed: ["GCP", "GDPR Training", "Immuta Basics"], inProgress: [], missing: [], percent: 100 },
    { completed: ["GCP", "GDPR Training", "Immuta Basics"], inProgress: [], missing: [], percent: 100 },
    { completed: ["GCP", "GDPR Training"], inProgress: [{ cert: "Immuta Basics", progress: 85 }], missing: [], percent: 67 },
    { completed: ["GCP", "GDPR Training", "Immuta Basics"], inProgress: [], missing: [], percent: 100 },
  ]

  for (let i = 0; i < breakdown.immediate; i++) {
    const firstName = firstNames[i % firstNames.length]
    const lastName = lastNames[Math.floor(i / firstNames.length) % lastNames.length]
    const trainingScenario = immediateTrainingOptions[i % immediateTrainingOptions.length]

    users.push({
      id: `${collectionId}-u${userCounter++}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i > 19 ? i : ""}@astrazeneca.com`,
      role: roles[i % roles.length],
      department: departments[i % departments.length],
      manager: managers[i % managers.length],
      accessStatus: "immediate",
      datasetsAccessible: ["DCODE-101", "DCODE-102"],
      datasetsPending: [],
      trainingStatus: {
        required: ["GCP", "GDPR Training", "Immuta Basics"],
        completed: trainingScenario.completed,
        inProgress: trainingScenario.inProgress,
        missing: trainingScenario.missing,
        completionPercent: trainingScenario.percent,
        isOverdue: false
      },
      enrollmentDate: new Date(2025, 10, 10, 10, 30 + i),
      lastActive: new Date(2025, 10, 13, 9, i % 60),
      daysWaiting: 0,
      reminderCount: 0,
      approvalRequests: []
    })
  }

  // Generate instant grant users
  const instantGrantTrainingOptions = [
    { completed: ["GCP", "GDPR Training", "Immuta Basics"], inProgress: [], missing: [], percent: 100 },
    { completed: ["GCP", "GDPR Training"], inProgress: [{ cert: "Immuta Basics", progress: 75 }], missing: [], percent: 67 },
    { completed: ["GCP"], inProgress: [{ cert: "GDPR Training", progress: 90 }], missing: ["Immuta Basics"], percent: 33 },
    { completed: ["GCP", "GDPR Training", "Immuta Basics"], inProgress: [], missing: [], percent: 100 },
    { completed: ["GCP", "GDPR Training"], inProgress: [{ cert: "Immuta Basics", progress: 50 }], missing: [], percent: 67 },
  ]

  for (let i = 0; i < breakdown.instant_grant; i++) {
    const firstName = firstNames[(i + 5) % firstNames.length]
    const lastName = lastNames[(Math.floor(i / firstNames.length) + 2) % lastNames.length]
    const trainingScenario = instantGrantTrainingOptions[i % instantGrantTrainingOptions.length]

    users.push({
      id: `${collectionId}-u${userCounter++}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 100}@astrazeneca.com`,
      role: roles[(i + 2) % roles.length],
      department: departments[(i + 1) % departments.length],
      manager: managers[i % managers.length],
      accessStatus: "instant_grant",
      datasetsAccessible: ["DCODE-101"],
      datasetsPending: ["DCODE-102", "DCODE-103", "DCODE-104"],
      trainingStatus: {
        required: ["GCP", "GDPR Training", "Immuta Basics"],
        completed: trainingScenario.completed,
        inProgress: trainingScenario.inProgress,
        missing: trainingScenario.missing,
        completionPercent: trainingScenario.percent,
        isOverdue: false
      },
      enrollmentDate: new Date(2025, 10, 10, 11, i % 60),
      lastActive: new Date(2025, 10, 13, 8, i % 60),
      daysWaiting: 3,
      reminderCount: 0,
      approvalRequests: []
    })
  }

  // Generate pending approval users
  const pendingApprovalTrainingOptions = [
    { completed: ["GCP", "GDPR Training", "Immuta Basics"], inProgress: [], missing: [], percent: 100 },
    { completed: ["GCP", "GDPR Training", "Immuta Basics"], inProgress: [], missing: [], percent: 100 },
    { completed: ["GCP"], inProgress: [{ cert: "GDPR Training", progress: 65 }, { cert: "Immuta Basics", progress: 40 }], missing: [], percent: 33 },
    { completed: ["GCP", "GDPR Training"], inProgress: [{ cert: "Immuta Basics", progress: 30 }], missing: [], percent: 67 },
    { completed: ["GCP", "GDPR Training", "Immuta Basics"], inProgress: [], missing: [], percent: 100 },
    { completed: ["GCP"], inProgress: [{ cert: "GDPR Training", progress: 55 }], missing: ["Immuta Basics"], percent: 33 },
  ]

  for (let i = 0; i < breakdown.pending_approval; i++) {
    const firstName = firstNames[(i + 10) % firstNames.length]
    const lastName = lastNames[(Math.floor(i / firstNames.length) + 4) % lastNames.length]
    const trainingScenario = pendingApprovalTrainingOptions[i % pendingApprovalTrainingOptions.length]

    users.push({
      id: `${collectionId}-u${userCounter++}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 200}@astrazeneca.com`,
      role: roles[(i + 4) % roles.length],
      department: departments[(i + 2) % departments.length],
      manager: managers[i % managers.length],
      accessStatus: "pending_approval",
      datasetsAccessible: [],
      datasetsPending: ["DCODE-299", "DCODE-105"],
      trainingStatus: {
        required: ["GCP", "GDPR Training", "Immuta Basics"],
        completed: trainingScenario.completed,
        inProgress: trainingScenario.inProgress,
        missing: trainingScenario.missing,
        completionPercent: trainingScenario.percent,
        isOverdue: false
      },
      enrollmentDate: new Date(2025, 10, 10, 12, i % 60),
      lastActive: new Date(2025, 10, 13, 10, i % 60),
      daysWaiting: 3,
      reminderCount: 0,
      approvalRequests: [
        {
          team: i % 2 === 0 ? "GPT-Oncology" : "TALT-Legal",
          datasetCodes: ["DCODE-299", "DCODE-105"],
          requestedDate: new Date(2025, 10, 10, 12, 5 + i % 60),
          status: "pending"
        }
      ]
    })
  }

  // Generate training blocked users
  const trainingScenarios = [
    { completed: ["GCP"], inProgress: [{ cert: "GDPR Training", progress: 60 }], missing: ["Immuta Basics"], percent: 33 },
    { completed: [], inProgress: [{ cert: "GCP", progress: 45 }], missing: ["GDPR Training", "Immuta Basics"], percent: 0 },
    { completed: ["GCP", "GDPR Training"], inProgress: [], missing: ["Immuta Basics"], percent: 67 },
    { completed: [], inProgress: [{ cert: "GCP", progress: 80 }, { cert: "GDPR Training", progress: 25 }], missing: ["Immuta Basics"], percent: 0 },
  ]

  for (let i = 0; i < breakdown.blocked_training; i++) {
    const firstName = firstNames[(i + 15) % firstNames.length]
    const lastName = lastNames[(Math.floor(i / firstNames.length) + 6) % lastNames.length]
    const scenario = trainingScenarios[i % trainingScenarios.length]
    const hasReminder = i % 2 === 0

    users.push({
      id: `${collectionId}-u${userCounter++}`,
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i + 300}@astrazeneca.com`,
      role: roles[(i + 6) % roles.length],
      department: departments[(i + 3) % departments.length],
      manager: managers[i % managers.length],
      accessStatus: "blocked_training",
      datasetsAccessible: [],
      datasetsPending: ["DCODE-101", "DCODE-102"],
      trainingStatus: {
        required: ["GCP", "GDPR Training", "Immuta Basics"],
        completed: scenario.completed,
        inProgress: scenario.inProgress,
        missing: scenario.missing,
        completionPercent: scenario.percent,
        deadline: new Date(2025, 11, 15 - (i * 5)),
        isOverdue: false
      },
      enrollmentDate: new Date(2025, 10, 10, 13, i % 60),
      lastActive: new Date(2025, 10, 12 + (i % 2), 11, 20 + i),
      daysWaiting: 3,
      lastReminderSent: hasReminder ? new Date(2025, 10, 11 + (i % 2), 9, 0) : undefined,
      reminderCount: hasReminder ? 1 + (i % 2) : 0,
      approvalRequests: []
    })
  }

  return users
}

// Helper function to get users by collection
export function getUsersByCollection(collectionId: string): User[] {
  const collection = MOCK_COLLECTIONS.find(c => c.id === collectionId)
  if (!collection) return []

  // Calculate the breakdown based on accessBreakdown percentages
  const breakdown = {
    immediate: Math.floor(collection.totalUsers * (collection.accessBreakdown.immediate / 100)),
    instant_grant: Math.floor(collection.totalUsers * (collection.accessBreakdown.instantGrant / 100)),
    pending_approval: Math.floor(collection.totalUsers * (collection.accessBreakdown.pendingApproval / 100)),
    blocked_training: Math.floor(collection.totalUsers * (collection.accessBreakdown.dataDiscovery / 100))
  }

  return generateUsersForCollection(collectionId, collection.totalUsers, breakdown)
}

// Helper function to get users by status
export function getUsersByStatus(collectionId: string, status: User["accessStatus"]): User[] {
  return getUsersByCollection(collectionId).filter(u => u.accessStatus === status)
}

// Helper function to get training-blocked users
export function getTrainingBlockedUsers(collectionId: string): User[] {
  return getUsersByStatus(collectionId, "blocked_training")
}

// Team contact information
export interface TeamContact {
  team: string
  lead: string
  email: string
  teamsChannel?: string
}

export const TEAM_CONTACTS: TeamContact[] = [
  {
    team: "GPT-Oncology",
    lead: "Dr. Sarah Chen",
    email: "sarah.chen@astrazeneca.com",
    teamsChannel: "GPT Oncology Approvals"
  },
  {
    team: "GPT-Rare-Disease",
    lead: "Dr. Michael Torres",
    email: "michael.torres@astrazeneca.com",
    teamsChannel: "GPT Rare Disease"
  },
  {
    team: "GPT-Neurology",
    lead: "Dr. Emily Watson",
    email: "emily.watson@astrazeneca.com",
    teamsChannel: "GPT Neurology"
  },
  {
    team: "GPT-Respiratory",
    lead: "Dr. James Park",
    email: "james.park@astrazeneca.com",
    teamsChannel: "GPT Respiratory"
  },
  {
    team: "TALT-Legal",
    lead: "Rebecca Martinez",
    email: "rebecca.martinez@astrazeneca.com",
    teamsChannel: "TALT Legal Requests"
  },
  {
    team: "Immuta Platform",
    lead: "Alex Johnson",
    email: "alex.johnson@astrazeneca.com",
    teamsChannel: "Immuta Support"
  }
]

export function getTeamContact(teamName: string): TeamContact | undefined {
  return TEAM_CONTACTS.find(tc => tc.team === teamName)
}

// ============================================================================
// Agreement of Terms (AoT) Helper Functions
// ============================================================================

export interface Activity {
  id: string
  name: string
  accessLevel?: string
}

export interface AoTConflict {
  datasetId: string
  datasetName: string
  datasetCode: string
  conflictType: 'ai_research' | 'software_development' | 'external_publication' | 'primary_use_only'
  conflictDescription: string
  requiredAction: string
  severity: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Suggests Agreement of Terms based on selected activities and datasets
 */
export function suggestAoT(
  activities: Activity[],
  datasets: Dataset[]
): AgreementOfTerms {
  // Analyze activities for intent
  const hasMLActivity = activities.some(a =>
    a.id?.includes('ml') ||
    a.id?.includes('ai') ||
    a.name?.toLowerCase().includes('classifier') ||
    a.name?.toLowerCase().includes('machine learning')
  )

  const hasSoftwareDevActivity = activities.some(a =>
    a.name?.toLowerCase().includes('software') ||
    a.name?.toLowerCase().includes('development')
  )

  const hasAnalysisActivity = activities.some(a =>
    a.accessLevel?.includes('patient-level')
  )

  // Analyze datasets for restrictions
  const datasetsRestrictML = datasets.filter(d =>
    d.aotMetadata?.restrictML
  )

  const datasetsRestrictPublication = datasets.filter(d =>
    d.aotMetadata?.restrictPublication
  )

  const datasetsRestrictSoftwareDev = datasets.filter(d =>
    d.aotMetadata?.restrictSoftwareDev
  )

  const requiresPrimaryUseOnly = datasets.some(d =>
    d.aotMetadata?.requirePrimaryUseOnly
  )

  // Generate suggestions
  return {
    id: `aot-${Date.now()}`,
    version: '1.0',

    // Primary use - default to all allowed unless restricted
    primaryUse: {
      understandDrugMechanism: true,
      understandDisease: true,
      developDiagnosticTests: true,
      learnFromPastStudies: true,
      improveAnalysisMethods: true
    },

    // Beyond primary use - conditional on activities and restrictions
    beyondPrimaryUse: {
      aiResearch: hasMLActivity && datasetsRestrictML.length === 0,
      softwareDevelopment: hasSoftwareDevActivity && datasetsRestrictSoftwareDev.length === 0
    },

    // Publication - conservative default, allow if no restrictions
    publication: {
      internalCompanyRestricted: true, // always allow internal
      externalPublication: datasetsRestrictPublication.length === 0 ? true : 'by_exception'
    },

    // External sharing - default to allowed with process
    externalSharing: {
      allowed: true,
      process: 'Standard External Sharing process applies. Must obtain approval from Alliance Manager and TALT-Legal team.'
    },

    // User scope - empty, user must define
    userScope: {
      totalUserCount: 0
    },

    // Metadata
    aiSuggested: true,
    userModified: [],
    createdAt: new Date(),
    createdBy: 'system'
  }
}

/**
 * Detects conflicts between defined AoT and dataset restrictions
 */
export function detectAoTConflicts(
  aot: AgreementOfTerms,
  datasets: Dataset[]
): AoTConflict[] {
  const conflicts: AoTConflict[] = []

  for (const dataset of datasets) {
    if (!dataset.aotMetadata) continue

    // Check ML restriction
    if (dataset.aotMetadata.restrictML && aot.beyondPrimaryUse.aiResearch) {
      conflicts.push({
        datasetId: dataset.id,
        datasetName: dataset.name,
        datasetCode: dataset.code,
        conflictType: 'ai_research',
        conflictDescription: `Dataset ${dataset.code} requires AI/ML restriction, but AoT allows AI research`,
        requiredAction: 'Restrict AI/ML research in AoT or remove this dataset',
        severity: 'high'
      })
    }

    // Check software dev restriction
    if (dataset.aotMetadata.restrictSoftwareDev && aot.beyondPrimaryUse.softwareDevelopment) {
      conflicts.push({
        datasetId: dataset.id,
        datasetName: dataset.name,
        datasetCode: dataset.code,
        conflictType: 'software_development',
        conflictDescription: `Dataset ${dataset.code} requires software development restriction, but AoT allows software dev`,
        requiredAction: 'Restrict software development in AoT or remove this dataset',
        severity: 'high'
      })
    }

    // Check publication restriction
    if (dataset.aotMetadata.restrictPublication && aot.publication.externalPublication === true) {
      conflicts.push({
        datasetId: dataset.id,
        datasetName: dataset.name,
        datasetCode: dataset.code,
        conflictType: 'external_publication',
        conflictDescription: `Dataset ${dataset.code} requires external publication restriction, but AoT allows external publication`,
        requiredAction: 'Restrict external publication or set to "by exception", or remove this dataset',
        severity: 'high'
      })
    }

    // Check primary use only requirement
    if (dataset.aotMetadata.requirePrimaryUseOnly) {
      if (aot.beyondPrimaryUse.aiResearch || aot.beyondPrimaryUse.softwareDevelopment) {
        conflicts.push({
          datasetId: dataset.id,
          datasetName: dataset.name,
          datasetCode: dataset.code,
          conflictType: 'primary_use_only',
          conflictDescription: `Dataset ${dataset.code} allows only primary use, but AoT enables beyond-primary-use activities`,
          requiredAction: 'Disable all beyond-primary-use options in AoT or remove this dataset',
          severity: 'critical'
        })
      }
    }
  }

  return conflicts
}

// ============================================================================
// NOTES SYSTEM
// ============================================================================

export interface NoteAuthor {
  name: string
  avatarInitials: string
}

export interface EmojiReaction {
  emoji: string
  users: string[] // usernames who reacted
}

export interface NoteReply {
  id: string
  noteId: string
  content: string
  author: NoteAuthor
  createdAt: string // ISO timestamp
  updatedAt?: string
}

export interface Note {
  id: string
  xpath: string // Element identifier
  route: string // Page route where note was created
  content: string
  author: NoteAuthor
  createdAt: string
  updatedAt?: string
  reactions: EmojiReaction[]
  replies: NoteReply[]
}

export const REACTION_EMOJIS = [
  '👍', '👎', '❤️', '😊', '🎉', '✅'
]

// Helper function to generate XPath for an element
export function getXPath(element: Element): string {
  if (element.id) return `//*[@id="${element.id}"]`

  const parts: string[] = []
  let current: Element | null = element

  while (current && current.nodeType === Node.ELEMENT_NODE) {
    let index = 1
    let sibling = current.previousElementSibling
    while (sibling) {
      if (sibling.nodeName === current.nodeName) index++
      sibling = sibling.previousElementSibling
    }
    parts.unshift(`${current.nodeName.toLowerCase()}[${index}]`)
    current = current.parentElement
  }

  return '/' + parts.join('/')
}

// Helper function to get element from XPath
export function getElementFromXPath(xpath: string): Element | null {
  try {
    const result = document.evaluate(
      xpath,
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null
    )
    return result.singleNodeValue as Element | null
  } catch {
    return null
  }
}

// Initial mock notes for demonstration
export const MOCK_NOTES: Note[] = [
  {
    id: 'note-1',
    xpath: '//*[@id="dashboard-header"]',
    route: '/collectoid',
    content: 'This header could use more contrast for accessibility',
    author: { name: 'Alice Chen', avatarInitials: 'AC' },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: [
      { emoji: '👍', users: ['Bob Smith', 'Carol White'] },
      { emoji: '💡', users: ['Dan Brown'] }
    ],
    replies: [
      {
        id: 'reply-1',
        noteId: 'note-1',
        content: 'Agreed! Maybe we can use the brand primary color here.',
        author: { name: 'Bob Smith', avatarInitials: 'BS' },
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
]

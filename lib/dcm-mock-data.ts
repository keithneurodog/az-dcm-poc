// DCM POC Mock Data

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
    categories: ["ta-cardio", "sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Cardiovascular Outcomes Archive", "Phase IV Studies"],
    activeUsers: 156,
    organizations: 12,
    accessBreakdown: { alreadyOpen: 60, readyToGrant: 30, needsApproval: 10, missingLocation: 0 },
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
    categories: ["ta-cardio", "sdtm-demographics", "sdtm-biomarker-labs", "sdtm-exposure", "adam-adsl"],
    collections: ["Cardiovascular Biomarker Collection"],
    activeUsers: 73,
    organizations: 5,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
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
    categories: ["ta-neuro", "sdtm-demographics", "dicom-ids-timing", "dicom-acquisition", "dicom-quantitative", "adam-adsl"],
    collections: ["Neurology Imaging Archive", "Alzheimer's Research Collection"],
    activeUsers: 91,
    organizations: 7,
    accessBreakdown: { alreadyOpen: 30, readyToGrant: 30, needsApproval: 30, missingLocation: 10 },
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
    categories: ["ta-neuro", "sdtm-demographics", "sdtm-exposure", "dicom-quantitative", "adam-adsl"],
    collections: ["Neurology Imaging Archive", "Movement Disorders Collection"],
    activeUsers: 54,
    organizations: 4,
    accessBreakdown: { alreadyOpen: 50, readyToGrant: 30, needsApproval: 20, missingLocation: 0 },
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
    categories: ["ta-neuro", "sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events", "dicom-quantitative", "adam-adsl", "adam-adtte"],
    collections: ["Neurology Imaging Archive", "Autoimmune Disease Studies"],
    activeUsers: 102,
    organizations: 8,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 35, needsApproval: 30, missingLocation: 0 },
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-227", "DCODE-239"],
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
    categories: ["ta-endo", "ta-cardio", "sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Endocrinology Archive", "Cardiovascular Outcomes Archive", "Phase IV Studies"],
    activeUsers: 287,
    organizations: 18,
    accessBreakdown: { alreadyOpen: 70, readyToGrant: 20, needsApproval: 10, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-275", "DCODE-203"],
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
    categories: ["ta-endo", "sdtm-demographics", "sdtm-exposure", "dicom-acquisition", "dicom-quantitative", "adam-adsl"],
    collections: ["Endocrinology Archive", "Ophthalmology Imaging Collection"],
    activeUsers: 45,
    organizations: 3,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-263"],
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
    categories: ["ta-cardio", "sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Cardiovascular Outcomes Archive", "Real-World Evidence Collection"],
    activeUsers: 198,
    organizations: 15,
    accessBreakdown: { alreadyOpen: 65, readyToGrant: 25, needsApproval: 10, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-203", "DCODE-215"],
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
    categories: ["ta-immuno", "sdtm-demographics", "sdtm-exposure", "sdtm-biomarker-labs", "adam-adsl", "adam-adrs"],
    collections: ["Autoimmune Disease Studies", "Rheumatology Collection"],
    activeUsers: 89,
    organizations: 6,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 35, needsApproval: 30, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-313", "DCODE-325"],
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
    categories: ["ta-immuno", "sdtm-demographics", "sdtm-exposure", "sdtm-adverse-events", "adam-adsl", "adam-adrs"],
    collections: ["Autoimmune Disease Studies", "Dermatology Collection"],
    activeUsers: 67,
    organizations: 5,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-301"],
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
    categories: ["ta-immuno", "sdtm-demographics", "omics-variants", "omics-global-scores", "adam-adsl"],
    collections: ["Autoimmune Disease Studies", "Genomic Profiling Collection"],
    activeUsers: 52,
    organizations: 4,
    accessBreakdown: { alreadyOpen: 30, readyToGrant: 40, needsApproval: 30, missingLocation: 0 },
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
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Oncology Outcomes Archive", "Breast Cancer Studies", "Phase III Closed Studies"],
    activeUsers: 234,
    organizations: 16,
    accessBreakdown: { alreadyOpen: 55, readyToGrant: 30, needsApproval: 15, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-349", "DCODE-361"],
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
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "omics-variants", "omics-cn-sv", "adam-adsl"],
    collections: ["Oncology Outcomes Archive", "Breast Cancer Studies", "Genomic Profiling Collection"],
    activeUsers: 145,
    organizations: 9,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
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
    categories: ["ta-onc", "sdtm-demographics", "dicom-ids-timing", "dicom-quantitative", "adam-adsl"],
    collections: ["Breast Cancer Studies", "Imaging Biomarker Studies"],
    activeUsers: 38,
    organizations: 3,
    accessBreakdown: { alreadyOpen: 30, readyToGrant: 40, needsApproval: 30, missingLocation: 0 },
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
    categories: ["ta-onc", "sdtm-demographics", "sdtm-tumor-response", "sdtm-biomarker-labs", "adam-adsl"],
    collections: ["Oncology Outcomes Archive", "Gastrointestinal Cancer Studies"],
    activeUsers: 167,
    organizations: 11,
    accessBreakdown: { alreadyOpen: 60, readyToGrant: 30, needsApproval: 10, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-385", "DCODE-397"],
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
    categories: ["ta-onc", "ta-immunonc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-biomarker-labs", "adam-adsl", "adam-adtte"],
    collections: ["Immunotherapy Response Collection", "Gastrointestinal Cancer Studies"],
    activeUsers: 189,
    organizations: 13,
    accessBreakdown: { alreadyOpen: 50, readyToGrant: 30, needsApproval: 20, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-373", "DCODE-397"],
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
    categories: ["ta-onc", "sdtm-demographics", "omics-variants", "omics-global-scores", "raw-ctdna", "adam-adsl"],
    collections: ["Gastrointestinal Cancer Studies", "Biomarker Discovery Collection"],
    activeUsers: 56,
    organizations: 4,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 40, needsApproval: 25, missingLocation: 0 },
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
    categories: ["ta-onc", "sdtm-demographics", "sdtm-tumor-response", "sdtm-biomarker-labs", "adam-adsl", "adam-adtte"],
    collections: ["Oncology Outcomes Archive", "Prostate Cancer Studies"],
    activeUsers: 143,
    organizations: 10,
    accessBreakdown: { alreadyOpen: 60, readyToGrant: 30, needsApproval: 10, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-421", "DCODE-433"],
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
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "omics-variants", "omics-cn-sv", "adam-adsl"],
    collections: ["Prostate Cancer Studies", "Genomic Profiling Collection"],
    activeUsers: 112,
    organizations: 8,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
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
    categories: ["ta-onc", "sdtm-demographics", "dicom-ids-timing", "dicom-acquisition", "dicom-quantitative", "adam-adsl"],
    collections: ["Prostate Cancer Studies", "Imaging Biomarker Studies"],
    activeUsers: 47,
    organizations: 3,
    accessBreakdown: { alreadyOpen: 30, readyToGrant: 40, needsApproval: 30, missingLocation: 0 },
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
    categories: ["ta-onc", "ta-immunonc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Immunotherapy Response Collection", "Melanoma Studies"],
    activeUsers: 201,
    organizations: 14,
    accessBreakdown: { alreadyOpen: 50, readyToGrant: 30, needsApproval: 20, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-457", "DCODE-469"],
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
    categories: ["ta-onc", "ta-immunonc", "sdtm-demographics", "sdtm-biomarker-labs", "raw-ctdna", "omics-variants", "adam-adsl"],
    collections: ["Immunotherapy Response Collection", "Melanoma Studies", "Biomarker Discovery Collection"],
    activeUsers: 67,
    organizations: 5,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
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
    categories: ["ta-onc", "sdtm-demographics", "dicom-quantitative", "adam-adsl"],
    collections: ["Melanoma Studies", "Imaging Biomarker Studies"],
    activeUsers: 34,
    organizations: 2,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 40, needsApproval: 25, missingLocation: 0 },
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
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Oncology Outcomes Archive", "Genitourinary Cancer Studies"],
    activeUsers: 134,
    organizations: 9,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-493", "DCODE-505"],
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
    categories: ["ta-onc", "ta-immunonc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "adam-adsl", "adam-adtte"],
    collections: ["Immunotherapy Response Collection", "Genitourinary Cancer Studies"],
    activeUsers: 98,
    organizations: 7,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
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
    categories: ["ta-onc", "sdtm-demographics", "omics-variants", "omics-cn-sv", "adam-adsl"],
    collections: ["Genitourinary Cancer Studies", "Genomic Profiling Collection"],
    activeUsers: 54,
    organizations: 4,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 40, needsApproval: 25, missingLocation: 0 },
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
    categories: ["ta-onc", "ta-neuro", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "dicom-quantitative", "adam-adsl", "adam-adtte"],
    collections: ["Oncology Outcomes Archive", "Neurology Imaging Archive", "Brain Tumor Studies"],
    activeUsers: 89,
    organizations: 6,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 35, needsApproval: 25, missingLocation: 0 },
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-529", "DCODE-541"],
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
    categories: ["ta-onc", "ta-neuro", "sdtm-demographics", "sdtm-exposure", "dicom-quantitative", "adam-adsl"],
    collections: ["Brain Tumor Studies", "Radiation Oncology Archive"],
    activeUsers: 45,
    organizations: 3,
    accessBreakdown: { alreadyOpen: 35, readyToGrant: 40, needsApproval: 25, missingLocation: 0 },
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
    categories: ["ta-onc", "ta-neuro", "sdtm-demographics", "omics-variants", "omics-cn-sv", "adam-adsl"],
    collections: ["Brain Tumor Studies", "Pediatric Oncology Collection", "Genomic Profiling Collection"],
    activeUsers: 42,
    organizations: 3,
    accessBreakdown: { alreadyOpen: 30, readyToGrant: 40, needsApproval: 30, missingLocation: 0 },
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
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "omics-variants", "omics-global-scores", "adam-adsl", "adam-adtte"],
    collections: ["Hematologic Malignancies Collection", "Genomic Profiling Collection"],
    activeUsers: 123,
    organizations: 8,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-565", "DCODE-577"],
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
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-biomarker-labs", "adam-adsl", "adam-adtte"],
    collections: ["Hematologic Malignancies Collection", "Oncology Outcomes Archive"],
    activeUsers: 156,
    organizations: 10,
    accessBreakdown: { alreadyOpen: 50, readyToGrant: 30, needsApproval: 20, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-553", "DCODE-577"],
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
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-adverse-events", "adam-adsl", "adam-adtte"],
    collections: ["Hematologic Malignancies Collection", "Oncology Outcomes Archive"],
    activeUsers: 189,
    organizations: 12,
    accessBreakdown: { alreadyOpen: 50, readyToGrant: 30, needsApproval: 20, missingLocation: 0 },
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-553", "DCODE-565"],
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
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "sdtm-tumor-response", "sdtm-adverse-events", "omics-variants", "adam-adsl", "adam-adtte"],
    collections: ["Oncology Outcomes Archive", "Gynecologic Cancer Studies", "Genomic Profiling Collection"],
    activeUsers: 167,
    organizations: 11,
    accessBreakdown: { alreadyOpen: 45, readyToGrant: 35, needsApproval: 20, missingLocation: 0 },
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-601", "DCODE-613"],
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
    categories: ["ta-onc", "sdtm-demographics", "sdtm-exposure", "omics-variants", "omics-cn-sv", "adam-adsl"],
    collections: ["Gynecologic Cancer Studies", "Genomic Profiling Collection"],
    activeUsers: 78,
    organizations: 5,
    accessBreakdown: { alreadyOpen: 40, readyToGrant: 40, needsApproval: 20, missingLocation: 0 },
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
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-589", "DCODE-601"],
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
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-637", "DCODE-649"],
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
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-625", "DCODE-649"],
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
    dataLocation: { clinical: "S3", genomics: "SolveBio" },
    frequentlyBundledWith: ["DCODE-625", "DCODE-637"],
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
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-673", "DCODE-685"],
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
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-661", "DCODE-685"],
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
    dataLocation: { clinical: "S3", imaging: "DICOM Archives" },
    frequentlyBundledWith: ["DCODE-661", "DCODE-673"],
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
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-709", "DCODE-721"],
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
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-697"],
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
    dataLocation: { clinical: "S3" },
    frequentlyBundledWith: ["DCODE-697", "DCODE-673"],
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
  '👍', '👎', '❤️', '😊', '😂', '🎉',
  '🔥', '👀', '💯', '✅', '❌', '⚠️',
  '💡', '🤔', '👏', '🙌', '💪', '🚀',
  '📝', '🔍', '💬', '⭐', '🎯', '✨'
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

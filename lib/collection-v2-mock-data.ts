// lib/collection-v2-mock-data.ts

/**
 * Collection V2 Mock Data
 *
 * IMPORTANT: This file uses GENERIC terminology only.
 * No company-specific or proprietary terms.
 * Represents a hypothetical clinical research data platform.
 */

// ============ ENUMS & TYPES ============

export type CollectionState =
  | "draft"           // Private sandbox
  | "public"          // Visible, collaborative
  | "aip_submitted"   // Awaiting lightweight sign-off
  | "aot_drafting"    // Formal terms being developed
  | "aot_review"      // Multi-party sign-off in progress
  | "aot_approved"    // Ready for implementation
  | "implementing"    // Technical provisioning
  | "access_granted"  // Users can access data
  | "maintaining"     // Ongoing, subject to changes

export type DatasetStatus =
  | "available"       // Ready to include
  | "pending_review"  // Needs compliance check
  | "restricted"      // Has access limitations
  | "unavailable"     // Missing or blocked

export type UserRole =
  | "data_scientist"
  | "researcher"
  | "analyst"
  | "engineer"
  | "lead"

// ============ INTERFACES ============

export interface MockUser {
  id: string
  name: string
  email: string
  role: UserRole
  department: string
  trainingComplete: boolean
  agreementSigned: boolean
}

export interface MockDataset {
  id: string
  name: string
  description: string
  category: string
  recordCount: number
  status: DatasetStatus
  lastUpdated: string
  tags: string[]
  issues?: string[]
}

export interface MockComment {
  id: string
  authorId: string
  authorName: string
  content: string
  timestamp: string
  type: "comment" | "system" | "suggestion"
}

export interface MockTimelineEvent {
  id: string
  type: "created" | "updated" | "state_change" | "user_added" | "dataset_added" | "comment"
  description: string
  timestamp: string
  actorName?: string
}

export interface CollectionV2 {
  id: string
  name: string
  description: string
  state: CollectionState
  createdAt: string
  updatedAt: string
  createdBy: string

  // Readiness checklist
  hasIntent: boolean
  hasDatasets: boolean
  hasUsers: boolean
  hasTerms: boolean

  // Counts
  datasetCount: number
  userCount: number

  // Related data (populated separately)
  datasets?: MockDataset[]
  users?: MockUser[]
  comments?: MockComment[]
  timeline?: MockTimelineEvent[]
}

// ============ MOCK DATA ============

export const MOCK_USERS: MockUser[] = [
  { id: "u1", name: "Sarah Chen", email: "sarah.chen@example.com", role: "data_scientist", department: "Research Analytics", trainingComplete: true, agreementSigned: true },
  { id: "u2", name: "James Wilson", email: "james.wilson@example.com", role: "researcher", department: "Clinical Studies", trainingComplete: true, agreementSigned: false },
  { id: "u3", name: "Maria Garcia", email: "maria.garcia@example.com", role: "analyst", department: "Biostatistics", trainingComplete: false, agreementSigned: false },
  { id: "u4", name: "David Kim", email: "david.kim@example.com", role: "engineer", department: "Data Engineering", trainingComplete: true, agreementSigned: true },
  { id: "u5", name: "Emily Brown", email: "emily.brown@example.com", role: "lead", department: "Research Analytics", trainingComplete: true, agreementSigned: true },
]

export const MOCK_DATASETS: MockDataset[] = [
  { id: "d1", name: "Patient Demographics Q4", description: "Demographic data from Q4 clinical trials", category: "Demographics", recordCount: 12500, status: "available", lastUpdated: "2025-12-15", tags: ["demographics", "clinical"] },
  { id: "d2", name: "Biomarker Panel Results", description: "Laboratory biomarker measurements", category: "Laboratory", recordCount: 8200, status: "available", lastUpdated: "2025-12-10", tags: ["biomarkers", "lab"] },
  { id: "d3", name: "Treatment Response Data", description: "Patient treatment response outcomes", category: "Outcomes", recordCount: 5600, status: "pending_review", lastUpdated: "2025-12-08", tags: ["treatment", "outcomes"], issues: ["Pending compliance review"] },
  { id: "d4", name: "Adverse Events Log", description: "Recorded adverse events during trials", category: "Safety", recordCount: 3200, status: "available", lastUpdated: "2025-12-12", tags: ["safety", "adverse-events"] },
  { id: "d5", name: "Genomic Sequencing Batch A", description: "Next-generation sequencing results", category: "Genomics", recordCount: 2100, status: "restricted", lastUpdated: "2025-11-28", tags: ["genomics", "sequencing"], issues: ["Requires additional approval"] },
  { id: "d6", name: "Imaging Metadata", description: "Medical imaging scan metadata", category: "Imaging", recordCount: 4500, status: "available", lastUpdated: "2025-12-14", tags: ["imaging", "metadata"] },
  { id: "d7", name: "Longitudinal Follow-up", description: "Long-term patient follow-up records", category: "Follow-up", recordCount: 9800, status: "available", lastUpdated: "2025-12-11", tags: ["longitudinal", "follow-up"] },
  { id: "d8", name: "Specimen Tracking", description: "Biological specimen tracking data", category: "Specimens", recordCount: 15000, status: "unavailable", lastUpdated: "2025-10-20", tags: ["specimens", "tracking"], issues: ["Data location unknown"] },
]

export const MOCK_COMMENTS: MockComment[] = [
  { id: "c1", authorId: "u1", authorName: "Sarah Chen", content: "I've reviewed the initial dataset selection. Looks good for our research objectives.", timestamp: "2025-12-14T10:30:00Z", type: "comment" },
  { id: "c2", authorId: "system", authorName: "System", content: "Collection created and moved to Draft state.", timestamp: "2025-12-13T09:00:00Z", type: "system" },
  { id: "c3", authorId: "u5", authorName: "Emily Brown", content: "Consider adding the longitudinal follow-up dataset for completeness.", timestamp: "2025-12-14T14:15:00Z", type: "suggestion" },
]

export const MOCK_TIMELINE: MockTimelineEvent[] = [
  { id: "t1", type: "created", description: "Collection created", timestamp: "2025-12-13T09:00:00Z", actorName: "Sarah Chen" },
  { id: "t2", type: "updated", description: "Description updated", timestamp: "2025-12-13T09:15:00Z", actorName: "Sarah Chen" },
  { id: "t3", type: "dataset_added", description: "Added 5 datasets to collection", timestamp: "2025-12-13T10:30:00Z", actorName: "Sarah Chen" },
  { id: "t4", type: "user_added", description: "Added James Wilson as collaborator", timestamp: "2025-12-14T08:00:00Z", actorName: "Sarah Chen" },
  { id: "t5", type: "comment", description: "New comment from Emily Brown", timestamp: "2025-12-14T14:15:00Z", actorName: "Emily Brown" },
]

// A sample collection in draft state
export const MOCK_COLLECTION_DRAFT: CollectionV2 = {
  id: "col-001",
  name: "Biomarker Research Initiative",
  description: "A collection of clinical trial datasets focused on biomarker analysis for treatment response prediction.",
  state: "draft",
  createdAt: "2025-12-13T09:00:00Z",
  updatedAt: "2025-12-14T14:15:00Z",
  createdBy: "Sarah Chen",
  hasIntent: true,
  hasDatasets: true,
  hasUsers: false,
  hasTerms: false,
  datasetCount: 5,
  userCount: 0,
}

// A sample collection further along in the process
export const MOCK_COLLECTION_PUBLIC: CollectionV2 = {
  id: "col-002",
  name: "Treatment Outcomes Analysis",
  description: "Comprehensive dataset collection for analyzing treatment outcomes across multiple therapeutic areas.",
  state: "public",
  createdAt: "2025-11-20T10:00:00Z",
  updatedAt: "2025-12-12T16:30:00Z",
  createdBy: "Emily Brown",
  hasIntent: true,
  hasDatasets: true,
  hasUsers: true,
  hasTerms: true,
  datasetCount: 12,
  userCount: 8,
}

// ============ HELPER FUNCTIONS ============

export function getCollectionV2ById(id: string): CollectionV2 | null {
  if (id === "col-001") return { ...MOCK_COLLECTION_DRAFT, datasets: MOCK_DATASETS.slice(0, 5), users: [], comments: MOCK_COMMENTS, timeline: MOCK_TIMELINE }
  if (id === "col-002") return { ...MOCK_COLLECTION_PUBLIC, datasets: MOCK_DATASETS, users: MOCK_USERS, comments: MOCK_COMMENTS, timeline: MOCK_TIMELINE }
  // Default: return draft collection for any ID (for demo purposes)
  return { ...MOCK_COLLECTION_DRAFT, id, datasets: MOCK_DATASETS.slice(0, 5), users: [], comments: MOCK_COMMENTS, timeline: MOCK_TIMELINE }
}

export function getStateDisplayInfo(state: CollectionState): { label: string; description: string; color: string } {
  const states: Record<CollectionState, { label: string; description: string; color: string }> = {
    draft: { label: "Draft (Private)", description: "Safe sandbox, not discoverable", color: "neutral" },
    public: { label: "Draft (Shared)", description: "Visible to relevant roles, collaborative", color: "blue" },
    aip_submitted: { label: "AiP Pending", description: "Awaiting lightweight sign-off", color: "amber" },
    aot_drafting: { label: "Defining Terms", description: "Formal terms being developed", color: "purple" },
    aot_review: { label: "Terms Under Review", description: "Multi-party sign-off in progress", color: "orange" },
    aot_approved: { label: "Approved", description: "Ready for implementation", color: "green" },
    implementing: { label: "Setting Up Access", description: "Technical provisioning", color: "cyan" },
    access_granted: { label: "Active", description: "Users can access data", color: "emerald" },
    maintaining: { label: "Active", description: "Ongoing, subject to changes", color: "emerald" },
  }
  return states[state]
}

export function getReadinessItems(collection: CollectionV2): { label: string; complete: boolean; link: string }[] {
  return [
    { label: "Intent & Description", complete: collection.hasIntent, link: "overview" },
    { label: "At least one dataset", complete: collection.hasDatasets, link: "datasets" },
    { label: "User scope defined", complete: collection.hasUsers, link: "users" },
    { label: "Data use terms selected", complete: collection.hasTerms, link: "terms" },
  ]
}

export function isReadyForAip(collection: CollectionV2): boolean {
  return collection.hasIntent && collection.hasDatasets && collection.hasUsers && collection.hasTerms
}

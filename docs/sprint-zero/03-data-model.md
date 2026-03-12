# 03 - Data Model Specification

**Document:** Collectoid Production Data Model
**Version:** 0.1 (Draft)
**Date:** 2026-02-06
**Status:** Sprint Zero - For Review
**Authors:** Architecture Team
**Cross-references:** `04-integration-map.md` (external API sync), `02-architecture.md` (infrastructure), `05-security.md` (access control)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Entity Relationship Diagram](#2-entity-relationship-diagram)
3. [Core Entities](#3-core-entities)
4. [Audit Trail Design](#4-audit-trail-design)
5. [Versioning Strategy](#5-versioning-strategy)
6. [External Data Caching](#6-external-data-caching)
7. [Indexes and Query Patterns](#7-indexes-and-query-patterns)
8. [Data Migration Plan](#8-data-migration-plan)
9. [Schema for Both Database Options](#9-schema-for-both-database-options)
10. [Open Questions](#10-open-questions)

---

## 1. Overview

### 1.1 Purpose

This document defines the production data model for Collectoid, AstraZeneca's clinical trial data access platform. The model replaces the 5,381-line mock data file (`lib/dcm-mock-data.ts`) used in the POC with a normalised, auditable, versioned schema suitable for regulated clinical data governance.

### 1.2 Design Principles

| Principle | Rationale |
|-----------|-----------|
| **Database-agnostic core** | Schema is designed to work with both Aurora PostgreSQL (with JSONB columns for flexible metadata) and DocumentDB/MongoDB. All entity definitions use logical types that map to either. |
| **Append-only audit** | Every state-changing operation produces an immutable `AuditEvent` record. No audit records are ever updated or deleted. This satisfies GxP and ICH E6(R2) regulatory requirements. |
| **Snapshot versioning** | Collections and AoTs use a snapshot versioning model: each change creates a new immutable version record. The parent entity points to the `current_version_id`. |
| **External data as cache** | Dataset metadata from AZCT, training status from Cornerstone, and standardised metadata from Collibra 2.0 are cached locally with explicit `synced_at` timestamps and `source_system` provenance. The cache is the read path; sync jobs are the write path. |
| **Soft deletes** | No hard deletes on core entities. All deletions set a `deleted_at` timestamp. Audit events are never soft-deleted. |
| **UTC timestamps** | All timestamps are stored in UTC. Display-layer formatting is a frontend concern. |
| **UUIDs for primary keys** | All primary keys are UUIDv7 (time-ordered) to support both relational and document databases efficiently. |

### 1.3 Naming Conventions

- Table/collection names: `snake_case`, plural (e.g., `collections`, `audit_events`)
- Column/field names: `snake_case` (e.g., `created_at`, `therapeutic_areas`)
- Foreign keys: `<entity>_id` (e.g., `collection_id`, `user_id`)
- Version foreign keys: `<entity>_version_id` (e.g., `collection_version_id`)
- JSON/JSONB columns: used for semi-structured or externally-sourced metadata that may evolve
- Enum values: `snake_case` (e.g., `pending_approval`, `in_review`)

---

## 2. Entity Relationship Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              COLLECTOID DATA MODEL                                  │
└─────────────────────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐         ┌──────────────────────┐         ┌──────────────────┐
  │    users     │────────>│ collection_members   │<────────│   collections    │
  │              │ 1    M  │                      │ M    1  │                  │
  │  id (PK)     │         │  user_id (FK)        │         │  id (PK)         │
  │  azure_ad_id │         │  collection_id (FK)  │         │  current_ver_id  │
  │  email       │         │  role                │         │  governance_stage│
  │  display_name│         │  assigned_at         │         │  operational_    │
  │              │         │                      │         │   state          │
  │              │         │                      │         │  created_by (FK) │
  └──────┬───────┘         └──────────────────────┘         └────────┬─────────┘
         │                                                           │
         │ 1                                                         │ 1
         │                                                           │
         │ M                                                         │ M
  ┌──────┴───────┐                                          ┌────────┴──────────┐
  │ user_roles   │                                          │collection_versions│
  │              │                                          │                   │
  │  user_id(FK) │                                          │  id (PK)          │
  │  role_id(FK) │                                          │  collection_id    │
  └──────────────┘                                          │  version_number   │
                                                            │  snapshot (JSON)  │
  ┌──────────────┐                                          │  created_by (FK)  │
  │    roles     │                                          └────────┬──────────┘
  │              │                                                   │
  │  id (PK)     │                                                   │ contains
  │  name        │                                                   │
  │  permissions │                                          ┌────────┴─────────┐
  └──────────────┘                                          │  cv_datasets     │
                                                            │  (junction)      │
                                                            │                  │
  ┌──────────────┐         ┌─────────────────────┐          │  cv_id (FK)      │
  │  datasets    │<────────│  dataset_categories │          │  dataset_id (FK) │
  │              │ 1    M  │  (junction)         │          └──────────────────┘
  │  id (PK)     │         │                     │
  │  d_code      │         │  dataset_id (FK)    │
  │  azct_id     │         │  category_id (FK)   │
  │  name        │         └──────────┬──────────┘
  │  status      │                    │ M
  │  clinical_   │                    │
  │   metadata   │              ┌─────┴───────────┐
  │   (JSON)     │              │ data_categories │
  │  aot_metadata│              │                 │
  │   (JSON)     │              │  id (PK)        │
  └──────┬───────┘              │  name           │
         │                      │  domain         │
         │ 1                    └─────────────────┘
         │
         │ M
  ┌──────┴───────────┐
  │ child_datasets   │
  │                  │
  │  id (PK)         │
  │  parent_id (FK)  │
  │  d_code          │
  │  data_type       │
  │  access_status   │
  └──────────────────┘


  ┌──────────────┐         ┌──────────────────────┐
  │ agreements   │────────>│ agreement_versions   │
  │ _of_terms    │ 1    M  │                      │
  │              │         │  id (PK)             │
  │  id (PK)     │         │  aot_id (FK)         │
  │  current_    │         │  version_number      │
  │   ver_id     │         │  terms (JSON)        │
  │  collection_ │         │  user_scope (JSON)   │
  │   id (FK)    │         │  created_by (FK)     │
  └──────────────┘         └──────────────────────┘


  ┌──────────────┐         ┌──────────────────────┐         ┌──────────────────┐
  │   access_    │────────>│  approval_chains     │────────>│   approvals      │
  │   requests   │ 1    1  │                      │ 1    M  │                  │
  │              │         │  id (PK)             │         │  id (PK)         │
  │  id (PK)     │         │  request_id (FK)     │         │  chain_id (FK)   │
  │  requester_  │         │  status              │         │  approver_id(FK) │
  │   id (FK)    │         │  all_or_nothing      │         │  team            │
  │  intent(JSON)│         │                      │         │  decision        │
  │  status      │         └──────────────────────┘         │  comment         │
  └──────────────┘                                          └──────────────────┘


  ┌──────────────┐         ┌──────────────────────┐
  │ discussions  │────────>│     comments         │
  │              │ 1    M  │                      │
  │  id (PK)     │         │  id (PK)             │
  │  entity_type │         │  discussion_id (FK)  │
  │  entity_id   │         │  author_id (FK)      │
  │              │         │  parent_comment_id   │
  └──────────────┘         │  body                │
                           └──────────────────────┘


  ┌──────────────┐         ┌──────────────────────┐
  │ notifications│         │   audit_events       │
  │              │         │   (APPEND-ONLY)      │
  │  id (PK)     │         │                      │
  │  user_id(FK) │         │  id (PK)             │
  │  type        │         │  actor_id (FK)       │
  │  entity_type │         │  action              │
  │  entity_id   │         │  entity_type         │
  │  read_at     │         │  entity_id           │
  └──────────────┘         │  payload (JSON)      │
                           │  occurred_at         │
                           └──────────────────────┘


  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐
  │  external_cache_azct │  │ external_cache_      │  │ external_cache_      │
  │                      │  │  cornerstone         │  │  collibra            │
  │  azct_study_id (PK)  │  │                      │  │                      │
  │  raw_payload (JSON)  │  │  user_id (FK)        │  │  asset_id (PK)       │
  │  synced_at           │  │  training_data(JSON) │  │  raw_payload (JSON)  │
  │  sync_status         │  │  synced_at           │  │  synced_at           │
  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘
```

### 2.1 Relationship Summary

| Relationship | Type | Description |
|---|---|---|
| `users` <-> `collections` | M:M via `collection_members` | Users belong to collections with specific roles |
| `users` <-> `roles` | M:M via `user_roles` | Users can hold multiple system-level roles |
| `collections` -> `collection_versions` | 1:M | Each collection has many immutable version snapshots |
| `collection_versions` <-> `datasets` | M:M via `cv_datasets` | Each version snapshot references specific datasets |
| `datasets` <-> `data_categories` | M:M via `dataset_categories` | Datasets tagged with taxonomy categories |
| `datasets` -> `child_datasets` | 1:M | Parent/child dataset hierarchy |
| `collections` -> `agreements_of_terms` | 1:1 | Each collection has one active AoT |
| `agreements_of_terms` -> `agreement_versions` | 1:M | AoTs are versioned with immutable snapshots |
| `access_requests` -> `approval_chains` | 1:1 | Each request has one approval chain |
| `approval_chains` -> `approvals` | 1:M | Chain tracks individual TA lead decisions |
| `discussions` -> `comments` | 1:M | Threaded discussions with nested comments |
| `comments` -> `comments` | self-referential | Reply threading via `parent_comment_id` |

---

## 3. Core Entities

### 3.1 User

Represents a platform user. Profile data is sourced from Azure AD and cached locally. Training status is sourced from Cornerstone.

**Source mapping from POC:** `User` interface in `dcm-mock-data.ts` (line 4785)

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key (UUIDv7) | PK |
| `azure_ad_id` | string | Yes | Azure AD object ID (external identity) | UNIQUE, NOT NULL |
| `email` | string | Yes | Corporate email address | UNIQUE, NOT NULL, max 255 |
| `display_name` | string | Yes | Full display name from Azure AD | NOT NULL, max 255 |
| `department` | string | No | Organisational department | max 255 |
| `job_title` | string | No | Job title/role description | max 255 |
| `manager_id` | UUID | No | FK to `users` table (manager) | FK -> users.id |
| `prid` | string | No | AstraZeneca PRID (personnel record ID) | UNIQUE |
| `is_active` | boolean | Yes | Whether the account is active | DEFAULT true |
| `profile_synced_at` | timestamp | No | Last sync from Azure AD | |
| `training_status` | JSONB | No | Cached training data from Cornerstone | See schema below |
| `training_synced_at` | timestamp | No | Last sync from Cornerstone | |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL, DEFAULT now() |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL, DEFAULT now() |
| `deleted_at` | timestamp | No | Soft delete timestamp | |

**`training_status` JSONB schema:**

```json
{
  "required": ["GCP", "GDPR Training", "Immuta Basics"],
  "completed": ["GCP"],
  "in_progress": [
    { "cert": "GDPR Training", "progress": 60 }
  ],
  "missing": ["Immuta Basics"],
  "completion_percent": 33,
  "deadline": "2026-03-01T00:00:00Z",
  "is_overdue": false
}
```

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_users_azure_ad_id` | `azure_ad_id` | UNIQUE | Azure AD lookup |
| `idx_users_email` | `email` | UNIQUE | Email lookup |
| `idx_users_prid` | `prid` | UNIQUE (partial, non-null) | PRID lookup |
| `idx_users_department` | `department` | B-tree | Department filtering |
| `idx_users_deleted_at` | `deleted_at` | B-tree (partial, IS NULL) | Active user queries |

---

### 3.2 Role

System-level roles controlling feature access and permissions.

**Source mapping from POC:** Derived from gap analysis roles (DCM, Approver, Team Lead, Data Consumer) plus Admin and DPO from ROAM process.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `name` | string | Yes | Role identifier | UNIQUE, NOT NULL |
| `display_name` | string | Yes | Human-readable role name | NOT NULL, max 100 |
| `description` | string | No | Role description | max 1000 |
| `permissions` | JSONB | Yes | Permission set (see below) | NOT NULL |
| `is_system_role` | boolean | Yes | Whether this is a built-in role | DEFAULT false |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |

**Seed data - system roles:**

| name | display_name | Description |
|------|-------------|-------------|
| `dcm` | Data Collection Manager | Creates and manages data collections, defines criteria, manages datasets |
| `approver` | Approver (DDO/TA Lead) | Reviews and approves OAC Agreements and AoTs |
| `data_consumer_lead` | Data Consumer Lead | Manages team access, ensures AoT compliance |
| `data_consumer` | Data Consumer | End user who consumes data within granted collections |
| `dpo` | Data Provisioning Officer | Configures policies, provisions data, manages delivery |
| `admin` | Administrator | Full system administration access |

**`permissions` JSONB schema:**

```json
{
  "collections": {
    "create": true,
    "read": true,
    "update": true,
    "delete": false,
    "publish": true,
    "approve": false
  },
  "datasets": {
    "read": true,
    "manage_metadata": false
  },
  "users": {
    "read": true,
    "manage": false
  },
  "audit": {
    "read": true,
    "export": false
  },
  "admin": {
    "manage_roles": false,
    "manage_system": false
  }
}
```

---

### 3.3 UserRole (Junction)

Links users to their system-level roles. A user may have multiple roles.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `user_id` | UUID | Yes | FK to users | FK -> users.id, NOT NULL |
| `role_id` | UUID | Yes | FK to roles | FK -> roles.id, NOT NULL |
| `assigned_at` | timestamp | Yes | When the role was assigned | NOT NULL |
| `assigned_by` | UUID | Yes | Who assigned the role | FK -> users.id |
| `revoked_at` | timestamp | No | When the role was revoked (soft revoke) | |

**Constraints:** UNIQUE(`user_id`, `role_id`) WHERE `revoked_at` IS NULL (only one active assignment per user-role pair)

---

### 3.4 Collection

The central entity. Represents a curated data collection governed by an OAC Agreement and AoT. The collection record itself is lightweight; its full state is captured in `collection_versions`.

**Source mapping from POC:** `Collection` interface in `dcm-mock-data.ts` (line 3716)

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `current_version_id` | UUID | No | FK to current active version | FK -> collection_versions.id |
| `governance_stage` | enum | Yes | Where the collection is in the approval pipeline | NOT NULL |
| `operational_state` | enum | No | Runtime status of an approved collection (nullable; only applies once governance_stage = approved) | |
| `name` | string | Yes | Collection display name | NOT NULL, max 500 |
| `description` | text | No | Collection description | |
| `request_type` | enum | Yes | `new`, `update`, `policy_change` | NOT NULL |
| `therapeutic_areas` | text[] | No | TA tags for filtering | |
| `tags` | text[] | No | Free-form tags | |
| `is_draft` | boolean | Yes | Draft visibility flag | DEFAULT true |
| `created_by` | UUID | Yes | FK to creating user | FK -> users.id, NOT NULL |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |
| `published_at` | timestamp | No | When first published | |
| `archived_at` | timestamp | No | When archived | |
| `deleted_at` | timestamp | No | Soft delete timestamp | |

**`governance_stage` enum values:**

| Value | Description |
|-------|-------------|
| `concept` | Initial idea, no formal definition yet |
| `draft` | Being defined, private to creator and assigned members |
| `pending_approval` | Submitted for TA Lead approval |
| `approved` | All required approvals obtained |
| `rejected` | Approval request was rejected |

**`operational_state` enum values (nullable — only applies once `governance_stage` = `approved`):**

| Value | Description |
|-------|-------------|
| `provisioning` | DPO is configuring policies and provisioning data |
| `live` | Fully provisioned and accessible |
| `suspended` | Temporarily suspended (e.g., compliance issue) |
| `decommissioned` | No longer active, retained for audit |

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_collections_governance_stage` | `governance_stage` | B-tree | Governance stage filtering |
| `idx_collections_operational_state` | `operational_state` | B-tree (partial, IS NOT NULL) | Operational state filtering |
| `idx_collections_created_by` | `created_by` | B-tree | "My collections" queries |
| `idx_collections_therapeutic_areas` | `therapeutic_areas` | GIN | TA-based filtering |
| `idx_collections_tags` | `tags` | GIN | Tag-based search |
| `idx_collections_deleted_at` | `deleted_at` | B-tree (partial, IS NULL) | Active collection queries |
| `idx_collections_name_trgm` | `name` | GIN (pg_trgm) | Fuzzy name search |

---

### 3.5 Proposition

Represents a proposed set of changes to a live collection. Propositions are a separate entity with their own lifecycle; whether a collection has open propositions is derived via query, not stored as state on the collection. Multiple propositions per collection are allowed concurrently; conflicts are resolved at merge time (like git branches).

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key (UUIDv7) | PK |
| `collection_id` | UUID | Yes | FK to parent collection | FK -> collections.id, NOT NULL |
| `title` | string | Yes | Short description of the proposed change | NOT NULL, max 500 |
| `description` | text | No | Detailed description of what is being changed and why | |
| `type` | enum | Yes | `dataset_change`, `aot_change`, `user_change`, `mixed` | NOT NULL |
| `status` | enum | Yes | Proposition lifecycle status | NOT NULL, DEFAULT 'draft' |
| `changes` | JSONB | Yes | Snapshot of proposed changes (datasets added/removed, AoT diffs, user changes) | NOT NULL |
| `created_by` | UUID | Yes | FK to user who created the proposition | FK -> users.id, NOT NULL |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |
| `submitted_at` | timestamp | No | When the proposition was submitted for review | |
| `merged_at` | timestamp | No | When the proposition was merged into the collection | |
| `decided_at` | timestamp | No | When the approval/rejection decision was made | |
| `decision_reason` | text | No | Reason for approval or rejection | |

**`type` enum values:**

| Value | Description |
|-------|-------------|
| `dataset_change` | Adding or removing datasets from the collection |
| `aot_change` | Modifying Data Use Terms |
| `user_change` | Modifying user access or roles |
| `mixed` | Multiple types of changes in a single proposition |

**`status` enum values:**

| Value | Description |
|-------|-------------|
| `draft` | Being prepared by the DCM, not yet submitted |
| `submitted` | Submitted for review; system evaluates whether governance re-approval is required |
| `approved` | Governance re-approval obtained, ready to merge |
| `merged` | Applied to the collection |
| `rejected` | Rejected by governance |

**`changes` JSONB schema:**

```json
{
  "datasets_added": ["uuid-1", "uuid-2"],
  "datasets_removed": ["uuid-3"],
  "aot_changes": {
    "primary_use": { "ai_research": true }
  },
  "users_added": [
    { "user_id": "uuid-user-1", "collection_role": "consumer" }
  ],
  "users_removed": ["uuid-user-2"]
}
```

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_propositions_collection_id` | `collection_id` | B-tree | List propositions for a collection |
| `idx_propositions_status` | `status` | B-tree | Filter by lifecycle status |
| `idx_propositions_created_by` | `created_by` | B-tree | "My propositions" queries |
| `idx_propositions_collection_status` | `collection_id`, `status` | B-tree | Open propositions for a collection |

---

### 3.6 CollectionVersion

Immutable snapshot of a collection's full state at a point in time. Every meaningful change to a collection creates a new version. This supports VS2-335 (Versioning and Change Management).

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `collection_id` | UUID | Yes | FK to parent collection | FK -> collections.id, NOT NULL |
| `version_number` | integer | Yes | Monotonically increasing version | NOT NULL |
| `change_summary` | text | Yes | Human-readable description of what changed | NOT NULL |
| `change_type` | enum | Yes | `initial`, `datasets_changed`, `aot_changed`, `users_changed`, `approval_decision`, `metadata_update`, `periodic_review`, `state_transition` | NOT NULL |
| `snapshot` | JSONB | Yes | Full state snapshot (see schema below) | NOT NULL |
| `created_by` | UUID | Yes | Who created this version | FK -> users.id, NOT NULL |
| `created_at` | timestamp | Yes | Version creation time | NOT NULL |

**Constraints:** UNIQUE(`collection_id`, `version_number`)

**`snapshot` JSONB schema:**

```json
{
  "name": "Oncology ctDNA Outcomes Collection",
  "description": "...",
  "governance_stage": "approved",
  "operational_state": "provisioning",
  "therapeutic_areas": ["ONC", "IMMUNONC"],
  "dataset_ids": ["uuid-1", "uuid-2"],
  "aot_version_id": "uuid-aot-v3",
  "intent": "Research on ctDNA biomarker dynamics...",
  "activities": [
    { "id": "act-1", "name": "Biomarker Analysis", "access_level": "patient-level" }
  ],
  "consumption_environments": ["Domino", "SCP"],
  "data_modalities": {
    "dataset-uuid-1": ["Clinical", "Genomic", "Biomarkers"],
    "dataset-uuid-2": ["Clinical"]
  },
  "data_sources": {
    "dataset-uuid-1": { "Clinical": "entimICE", "Genomic": "PDP" }
  },
  "member_count": 35,
  "approval_status": {
    "GPT-Oncology": "approved",
    "TALT-Legal": "pending"
  }
}
```

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_cv_collection_id` | `collection_id` | B-tree | Version history queries |
| `idx_cv_collection_version` | `collection_id`, `version_number` | UNIQUE | Version lookup |
| `idx_cv_created_at` | `created_at` | B-tree | Chronological queries |

---

### 3.7 CollectionVersionDataset (Junction)

Links a specific collection version to the datasets it contains. This is the normalised alternative to embedding `dataset_ids` only in the snapshot JSON; both representations exist for query flexibility.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `collection_version_id` | UUID | Yes | FK to collection version | FK -> collection_versions.id, NOT NULL |
| `dataset_id` | UUID | Yes | FK to dataset | FK -> datasets.id, NOT NULL |
| `modalities` | text[] | No | Included data modalities for this dataset in this version | |
| `sources` | JSONB | No | Data source per modality | |
| `included_at` | timestamp | Yes | When dataset was added to this version | NOT NULL |

**Constraints:** UNIQUE(`collection_version_id`, `dataset_id`)

---

### 3.8 Dataset

Study dataset metadata. In production, most fields are sourced from the AZCT REST API and cached locally. See `04-integration-map.md` for AZCT sync details.

**Source mapping from POC:** `Dataset` interface in `dcm-mock-data.ts` (line 559)

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Internal primary key | PK |
| `d_code` | string | Yes | AstraZeneca D-code (e.g., "DCODE-042") | UNIQUE, NOT NULL, max 50 |
| `azct_study_id` | string | No | AZCT external study ID | UNIQUE |
| `name` | string | Yes | Study name | NOT NULL, max 500 |
| `description` | text | No | Study description | |
| `therapeutic_areas` | text[] | Yes | TA codes (e.g., ["ONC", "IMMUNONC"]) | NOT NULL |
| `phase` | string | No | Trial phase (e.g., "III", "II", "Observational") | max 50 |
| `status` | enum | Yes | `active`, `closed`, `grey_zone`, `archived` | NOT NULL |
| `closed_date` | date | No | Date study was closed | |
| `geography` | text[] | No | Country/region codes | |
| `patient_count` | integer | No | Number of patients enrolled | CHECK >= 0 |
| `clinical_metadata` | JSONB | No | Rich clinical study metadata (from AZCT) | See schema below |
| `aot_metadata` | JSONB | No | Restriction metadata for AoT matching | See schema below |
| `access_breakdown` | JSONB | No | Access provisioning percentages | |
| `access_platform` | string | No | Primary access platform | |
| `data_layers` | text[] | No | Storage layers (Starburst, S3, Snowflake, Domino) | |
| `data_location` | JSONB | No | Location per data type | |
| `frequently_bundled_with` | text[] | No | D-codes of commonly bundled datasets | |
| `first_subject_in` | date | No | FSI date - must be after 2013-12-31 for 90-route eligibility | |
| `database_lock_date` | date | No | DBL date | |
| `is_locked` | boolean | No | Whether DBL > 6 months ago | |
| `data_product_rights` | enum | No | `research_allowed`, `research_not_allowed`, `under_review` | |
| `data_availability` | enum | No | `in_pdp`, `in_entimice`, `in_ctds`, `location_unknown` | |
| `sponsor_type` | enum | No | `az_sponsored`, `ismo`, `externally_sponsored`, `investigator_run` | |
| `compliance_status` | enum | No | `fully_compliant`, `ethical_review_pending`, `legal_review_pending`, `dpr_under_review` | |
| `modalities` | text[] | No | Data modality tags | |
| `source_system` | string | Yes | Origin system identifier (e.g., "azct", "manual") | NOT NULL, DEFAULT 'manual' |
| `source_synced_at` | timestamp | No | Last sync from source system | |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |
| `deleted_at` | timestamp | No | Soft delete timestamp | |

**`clinical_metadata` JSONB schema** (mirrors `ClinicalMetadata` from POC, line 524):

```json
{
  "enrollment_start_date": "2021-03-15",
  "primary_completion_date": "2023-09-20",
  "study_lock_date": "2024-03-15",
  "principal_investigator": "Dr. Elena Vasquez, MD, PhD",
  "sponsor": "AstraZeneca",
  "nct_number": "NCT04892537",
  "study_design": "Randomized, double-blind, placebo-controlled, multicenter Phase III",
  "primary_endpoint": "Overall Survival (OS)",
  "secondary_endpoints": ["PFS", "ctDNA Clearance Rate", "ORR"],
  "enrollment_status": "Completed",
  "data_lock_status": "Locked",
  "protocol_version": "v2.3",
  "protocol_amendments": 2,
  "target_enrollment": 900,
  "actual_enrollment": 890,
  "number_of_sites": 45,
  "treatment_arms": ["Pembrolizumab + Chemo", "Placebo + Chemo"],
  "blinding_type": "Double-blind",
  "randomization_ratio": "1:1"
}
```

**`aot_metadata` JSONB schema** (mirrors `aotMetadata` from POC):

```json
{
  "restrict_ml": true,
  "restrict_publication": true,
  "restrict_software_dev": false,
  "require_primary_use_only": false,
  "require_legal_review": false,
  "geographic_restrictions": ["EU only"],
  "embargo_until": "2026-06-01T00:00:00Z",
  "external_sharing_allowed": false,
  "restriction_reason": "Ongoing trial with competitive sensitivity"
}
```

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_datasets_d_code` | `d_code` | UNIQUE | D-code lookup |
| `idx_datasets_azct_id` | `azct_study_id` | UNIQUE (partial, non-null) | AZCT sync reconciliation |
| `idx_datasets_status` | `status` | B-tree | Status filtering |
| `idx_datasets_therapeutic_areas` | `therapeutic_areas` | GIN | TA filtering |
| `idx_datasets_phase` | `phase` | B-tree | Phase filtering |
| `idx_datasets_geography` | `geography` | GIN | Geography filtering |
| `idx_datasets_name_trgm` | `name` | GIN (pg_trgm) | Fuzzy name search |
| `idx_datasets_clinical_metadata` | `clinical_metadata` | GIN | JSON field queries |
| `idx_datasets_deleted_at` | `deleted_at` | B-tree (partial, IS NULL) | Active dataset queries |

---

### 3.9 ChildDataset

Sub-datasets within a parent study (e.g., "DCODE-042-CLIN", "DCODE-042-BIO"). Supports the parent/child hierarchy from the POC.

**Source mapping from POC:** `ChildDataset` interface (line 513)

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `parent_dataset_id` | UUID | Yes | FK to parent dataset | FK -> datasets.id, NOT NULL |
| `d_code` | string | Yes | Child D-code (e.g., "DCODE-042-CLIN") | UNIQUE, NOT NULL |
| `name` | string | Yes | Display name (e.g., "Clinical Outcomes") | NOT NULL, max 255 |
| `data_type` | string | No | Data category (Clinical, Genomics, Imaging, Biomarker, PRO, Safety) | max 50 |
| `access_status` | enum | Yes | `open`, `ready`, `approval`, `missing` | NOT NULL |
| `record_count` | integer | No | Number of records/samples | CHECK >= 0 |
| `last_updated` | timestamp | No | Last data refresh | |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_child_datasets_parent` | `parent_dataset_id` | B-tree | Parent lookup |
| `idx_child_datasets_d_code` | `d_code` | UNIQUE | D-code lookup |
| `idx_child_datasets_access_status` | `access_status` | B-tree | Status filtering |

---

### 3.10 DataCategory

Taxonomy of data categories. This is a controlled vocabulary with 30+ entries across multiple domains (Therapeutic Areas, SDTM, ADaM, RAW Data, DICOM, Omics/NGS).

**Source mapping from POC:** `DataCategory` interface (line 111) and `DATA_CATEGORY_TAXONOMY` constant (line 121)

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `code` | string | Yes | Stable code (e.g., "ta-onc", "sdtm-demographics") | UNIQUE, NOT NULL, max 50 |
| `name` | string | Yes | Display name (e.g., "ONC (Oncology)") | NOT NULL, max 255 |
| `domain` | string | Yes | Domain grouping (e.g., "Therapeutic Areas", "SDTM", "ADaM") | NOT NULL, max 100 |
| `description` | text | No | Category description | |
| `key_variables` | text[] | No | Key data variables (e.g., ["AGE", "SEX", "RACE"]) | |
| `is_highlighted` | boolean | Yes | Whether to highlight in UI | DEFAULT false |
| `display_order` | integer | No | Ordering within domain | |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_data_categories_code` | `code` | UNIQUE | Code lookup |
| `idx_data_categories_domain` | `domain` | B-tree | Domain grouping |

---

### 3.11 DatasetCategory (Junction)

Links datasets to their taxonomy categories.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `dataset_id` | UUID | Yes | FK to dataset | FK -> datasets.id, NOT NULL |
| `category_id` | UUID | Yes | FK to data category | FK -> data_categories.id, NOT NULL |

**Constraints:** UNIQUE(`dataset_id`, `category_id`)

---

### 3.12 AgreementOfTerms

The AoT defines the terms under which data in a collection can be accessed. Each collection has one AoT (1:1). The AoT itself is versioned; changing terms creates a new `AgreementVersion`.

**Source mapping from POC:** `AgreementOfTerms` interface (line 453)

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `collection_id` | UUID | Yes | FK to collection | FK -> collections.id, UNIQUE, NOT NULL |
| `current_version_id` | UUID | No | FK to current active version | FK -> agreement_versions.id |
| `status` | enum | Yes | `draft`, `pending_approval`, `approved`, `superseded`, `revoked` | NOT NULL |
| `created_by` | UUID | Yes | Who created the AoT | FK -> users.id, NOT NULL |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |

---

### 3.13 AgreementVersion

Immutable snapshot of AoT terms at a point in time. Each modification to terms creates a new version. Decision changes (e.g., rejected to approved) require a new version with a new TA Lead signature (per VS2-335).

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `aot_id` | UUID | Yes | FK to parent AoT | FK -> agreements_of_terms.id, NOT NULL |
| `version_number` | integer | Yes | Monotonically increasing | NOT NULL |
| `terms` | JSONB | Yes | Full terms snapshot (see schema below) | NOT NULL |
| `user_scope` | JSONB | Yes | Who is covered by this AoT version | NOT NULL |
| `change_summary` | text | Yes | What changed in this version | NOT NULL |
| `ai_suggested` | boolean | Yes | Whether terms were AI-suggested | DEFAULT false |
| `user_modified_fields` | text[] | No | Which fields user manually changed from AI suggestion | |
| `acknowledged_conflicts` | JSONB | No | Conflicts acknowledged by the creator | |
| `effective_date` | date | No | When these terms take effect | |
| `review_date` | date | No | When these terms should be reviewed | |
| `created_by` | UUID | Yes | Who created this version | FK -> users.id, NOT NULL |
| `created_at` | timestamp | Yes | Version creation time | NOT NULL |

**Constraints:** UNIQUE(`aot_id`, `version_number`)

**`terms` JSONB schema:**

```json
{
  "primary_use": {
    "understand_drug_mechanism": true,
    "understand_disease": true,
    "develop_diagnostic_tests": true,
    "learn_from_past_studies": true,
    "improve_analysis_methods": true
  },
  "beyond_primary_use": {
    "ai_research": false,
    "software_development": false
  },
  "publication": {
    "internal_company_restricted": true,
    "external_publication": "by_exception"
  },
  "external_sharing": {
    "allowed": true,
    "process": "Standard External Sharing process applies."
  }
}
```

**`user_scope` JSONB schema:**

```json
{
  "by_department": ["Oncology Research", "Bioinformatics"],
  "by_role": ["Data Scientist", "Biostatistician"],
  "explicit_users": ["prid-001", "prid-002"],
  "total_user_count": 35
}
```

**`acknowledged_conflicts` JSONB schema:**

```json
[
  {
    "dataset_id": "uuid-dataset-042",
    "dataset_name": "NSCLC ctDNA Monitoring",
    "conflict_type": "ai_research",
    "conflict_description": "Dataset restricts AI/ML use",
    "acknowledged_at": "2026-01-15T10:30:00Z",
    "acknowledged_by": "user-uuid"
  }
]
```

---

### 3.14 CollectionMembership

Tracks users assigned to specific collections with their collection-level role. This is distinct from the system-level `user_roles` table.

**Source mapping from POC:** Derived from `User.accessStatus` and the collection user generation logic (line 4833)

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `collection_id` | UUID | Yes | FK to collection | FK -> collections.id, NOT NULL |
| `user_id` | UUID | Yes | FK to user | FK -> users.id, NOT NULL |
| `collection_role` | enum | Yes | Role within this collection | NOT NULL |
| `access_status` | enum | Yes | Current provisioning status | NOT NULL |
| `datasets_accessible` | text[] | No | D-codes the user can currently access | |
| `datasets_pending` | text[] | No | D-codes awaiting provisioning | |
| `assigned_at` | timestamp | Yes | When membership was created | NOT NULL |
| `assigned_by` | UUID | Yes | Who assigned the membership | FK -> users.id, NOT NULL |
| `provisioned_at` | timestamp | No | When access was fully provisioned | |
| `revoked_at` | timestamp | No | When membership was revoked | |
| `revoke_reason` | text | No | Reason for revocation | |

**`collection_role` enum values:**

| Value | Description |
|-------|-------------|
| `owner` | Collection owner (DCM who created it) |
| `data_owner` | Data Owner / DDO for this collection |
| `consumer_lead` | Data Consumer Lead for their team |
| `consumer` | Data Consumer (end user) |
| `approver` | TA Lead or other approver for this collection |
| `observer` | Read-only access to collection metadata |

**`access_status` enum values:**

| Value | Description |
|-------|-------------|
| `immediate` | Already has full access |
| `instant_grant` | In process of being granted (automated) |
| `pending_approval` | Waiting for manual approval |
| `blocked_training` | Blocked until training completed |
| `provisioning` | Approved, being provisioned by DPO |
| `revoked` | Access revoked |

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_cm_collection_id` | `collection_id` | B-tree | List collection members |
| `idx_cm_user_id` | `user_id` | B-tree | List user's collections ("My Access") |
| `idx_cm_collection_role` | `collection_id`, `collection_role` | B-tree | Find owners/approvers of a collection |
| `idx_cm_access_status` | `access_status` | B-tree | Filter by provisioning status |
| `idx_cm_active` | `collection_id`, `user_id` | UNIQUE (partial, WHERE revoked_at IS NULL) | Prevent duplicate active memberships |

---

### 3.15 AccessRequest

A user's formal request for access to data. Contains the declared intent, selected datasets, and the smart matching result.

**Source mapping from POC:** `DataAccessRequest` interface (line 93)

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `requester_id` | UUID | Yes | FK to requesting user | FK -> users.id, NOT NULL |
| `collection_id` | UUID | No | FK to target collection (if requesting into existing) | FK -> collections.id |
| `status` | enum | Yes | Request lifecycle status | NOT NULL |
| `intent` | JSONB | Yes | Declared usage intent (see DataAccessIntent) | NOT NULL |
| `dataset_ids` | UUID[] | Yes | Requested dataset IDs | NOT NULL |
| `matching_result` | JSONB | No | Smart matching result (categorised access) | |
| `notes` | text | No | Free-text notes from requester | |
| `expected_duration` | string | No | Expected access duration | max 50 |
| `submitted_at` | timestamp | No | When formally submitted | |
| `decided_at` | timestamp | No | When final decision was made | |
| `decision_reason` | text | No | Reason for approval/rejection | |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |

**Status enum values:**

| Value | Description |
|-------|-------------|
| `draft` | Being composed by requester |
| `submitted` | Formally submitted for review |
| `in_review` | Under active review by approvers |
| `approved` | Fully approved |
| `partially_approved` | Some datasets approved, some not |
| `rejected` | Rejected by an approver |
| `withdrawn` | Withdrawn by requester |
| `expired` | Expired without decision |

**`intent` JSONB schema** (mirrors `DataAccessIntent` from POC, line 8):

```json
{
  "primary_use": {
    "understand_drug_mechanism": true,
    "understand_disease": true,
    "develop_diagnostic_tests": false,
    "learn_from_past_studies": true,
    "improve_analysis_methods": false
  },
  "beyond_primary_use": {
    "ai_research": true,
    "software_development": false
  },
  "publication": {
    "internal_only": true,
    "external_publication": false
  },
  "research_purpose": "Investigating ctDNA dynamics as early response biomarker...",
  "expected_duration": "1-year"
}
```

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_ar_requester_id` | `requester_id` | B-tree | User's requests |
| `idx_ar_collection_id` | `collection_id` | B-tree | Collection's requests |
| `idx_ar_status` | `status` | B-tree | Status filtering |
| `idx_ar_submitted_at` | `submitted_at` | B-tree | Chronological ordering |

---

### 3.16 ApprovalChain

Tracks the multi-TA approval workflow for an access request or collection publication. Implements the "all or nothing" semantics: if the collection spans multiple TAs, ALL TA Leads must approve; a single rejection blocks the entire collection (per VS2-339, VS2-349).

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `entity_type` | enum | Yes | `access_request`, `collection` | NOT NULL |
| `entity_id` | UUID | Yes | FK to access_requests.id or collections.id | NOT NULL |
| `status` | enum | Yes | Chain-level status | NOT NULL |
| `all_or_nothing` | boolean | Yes | Whether all approvals are required | DEFAULT true |
| `required_approvals` | integer | Yes | Total number of approvals needed | NOT NULL, CHECK > 0 |
| `received_approvals` | integer | Yes | Approvals received so far | NOT NULL, DEFAULT 0 |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |
| `completed_at` | timestamp | No | When chain was fully resolved | |

**Status enum values:**

| Value | Description |
|-------|-------------|
| `pending` | Waiting for approvals |
| `in_progress` | At least one approval received |
| `approved` | All required approvals obtained |
| `rejected` | At least one rejection (if all_or_nothing) |
| `expired` | Timed out without completion |

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_ac_entity` | `entity_type`, `entity_id` | B-tree | Lookup chain for entity |
| `idx_ac_status` | `status` | B-tree | Pending chains dashboard |

---

### 3.17 Approval

Individual approval decision by a specific approver (TA Lead, DDO, etc.) within an approval chain.

**Source mapping from POC:** `DatasetApprovalRequirement` (line 433) and `DatasetApprovalAction` (line 442)

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `chain_id` | UUID | Yes | FK to approval chain | FK -> approval_chains.id, NOT NULL |
| `approver_id` | UUID | Yes | FK to approving user | FK -> users.id, NOT NULL |
| `team` | string | Yes | Approval team (e.g., "GPT-Oncology", "TALT-Legal") | NOT NULL, max 100 |
| `reason` | text | Yes | Why this approval is required | NOT NULL |
| `decision` | enum | No | Approval decision (null = pending) | |
| `comment` | text | No | Decision comment (mandatory on decision) | |
| `requested_at` | timestamp | Yes | When approval was requested | NOT NULL |
| `due_date` | timestamp | No | Deadline for decision | |
| `decided_at` | timestamp | No | When decision was made | |
| `signature_ref` | string | No | Reference to in-app digital acknowledgement record | max 255 |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |

**`decision` enum values:**

| Value | Description |
|-------|-------------|
| `approved` | Approver grants approval |
| `rejected` | Approver rejects |
| `aware` | Approver acknowledges (no formal approval needed) |
| `delegated` | Approver delegated to another person |

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_approvals_chain_id` | `chain_id` | B-tree | List approvals in chain |
| `idx_approvals_approver_id` | `approver_id` | B-tree | Approver's pending decisions |
| `idx_approvals_decision` | `decision` | B-tree (partial, IS NULL) | Pending approvals |
| `idx_approvals_team` | `team` | B-tree | Team-based queries |

---

### 3.18 AuditEvent

Append-only, immutable audit log. This is the most critical table for regulatory compliance. See Section 4 for detailed design.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key (UUIDv7, time-ordered) | PK |
| `actor_id` | UUID | No | FK to user who performed the action (null = system) | FK -> users.id |
| `actor_email` | string | No | Denormalised actor email (for long-term readability) | max 255 |
| `actor_display_name` | string | No | Denormalised actor name | max 255 |
| `action` | string | Yes | Action performed (see action taxonomy below) | NOT NULL, max 100 |
| `entity_type` | string | Yes | Type of entity affected | NOT NULL, max 100 |
| `entity_id` | UUID | Yes | ID of the affected entity | NOT NULL |
| `entity_name` | string | No | Denormalised entity name for readability | max 500 |
| `payload` | JSONB | No | Action-specific details (before/after, metadata) | |
| `ip_address` | string | No | Client IP address | max 45 |
| `user_agent` | string | No | Client user agent | max 500 |
| `session_id` | string | No | Session identifier for correlation | max 100 |
| `occurred_at` | timestamp | Yes | When the event occurred | NOT NULL |
| `ingested_at` | timestamp | Yes | When the event was written to the store | NOT NULL, DEFAULT now() |

**Constraints:**
- This table is **append-only**: no UPDATE or DELETE operations are permitted. This must be enforced at the database level (see Section 4.3).
- No soft deletes. No `updated_at`.

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_audit_entity` | `entity_type`, `entity_id` | B-tree | Entity history |
| `idx_audit_actor` | `actor_id` | B-tree | User activity history |
| `idx_audit_action` | `action` | B-tree | Action-type queries |
| `idx_audit_occurred_at` | `occurred_at` | B-tree | Chronological queries, retention |
| `idx_audit_entity_time` | `entity_type`, `entity_id`, `occurred_at` | B-tree | Entity timeline |

---

### 3.19 Discussion

A discussion thread attached to a collection, access request, or other entity. Supports the threaded comment system from the POC.

**Source mapping from POC:** `Note` interface (line 5305), adapted for production use

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `entity_type` | enum | Yes | `collection`, `access_request`, `dataset`, `approval` | NOT NULL |
| `entity_id` | UUID | Yes | ID of the entity this discussion is attached to | NOT NULL |
| `title` | string | No | Discussion title/topic | max 500 |
| `is_resolved` | boolean | Yes | Whether the discussion is resolved | DEFAULT false |
| `resolved_by` | UUID | No | Who resolved it | FK -> users.id |
| `resolved_at` | timestamp | No | When it was resolved | |
| `created_by` | UUID | Yes | Discussion creator | FK -> users.id, NOT NULL |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |
| `deleted_at` | timestamp | No | Soft delete timestamp | |

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_discussions_entity` | `entity_type`, `entity_id` | B-tree | List discussions for an entity |
| `idx_discussions_created_by` | `created_by` | B-tree | User's discussions |

---

### 3.20 Comment

Individual comment within a discussion. Supports threading via `parent_comment_id`.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `discussion_id` | UUID | Yes | FK to discussion | FK -> discussions.id, NOT NULL |
| `parent_comment_id` | UUID | No | FK to parent comment (for threading) | FK -> comments.id |
| `author_id` | UUID | Yes | FK to comment author | FK -> users.id, NOT NULL |
| `body` | text | Yes | Comment content (Markdown supported) | NOT NULL |
| `mentions` | UUID[] | No | User IDs mentioned in this comment | |
| `reactions` | JSONB | No | Emoji reactions (see schema below) | |
| `is_edited` | boolean | Yes | Whether the comment has been edited | DEFAULT false |
| `created_at` | timestamp | Yes | Record creation time | NOT NULL |
| `updated_at` | timestamp | Yes | Last modification time | NOT NULL |
| `deleted_at` | timestamp | No | Soft delete timestamp | |

**`reactions` JSONB schema:**

```json
{
  "thumbs_up": ["user-uuid-1", "user-uuid-2"],
  "check": ["user-uuid-3"]
}
```

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_comments_discussion_id` | `discussion_id` | B-tree | List comments in discussion |
| `idx_comments_parent` | `parent_comment_id` | B-tree | Thread reconstruction |
| `idx_comments_author` | `author_id` | B-tree | User's comments |
| `idx_comments_mentions` | `mentions` | GIN | Find comments mentioning a user |

---

### 3.21 Notification

User-targeted notifications for events requiring attention.

**Source mapping from POC:** `Notification` interface (line 4440)

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `user_id` | UUID | Yes | FK to target user | FK -> users.id, NOT NULL |
| `type` | enum | Yes | Notification category | NOT NULL |
| `priority` | enum | Yes | `critical`, `high`, `medium`, `low` | NOT NULL |
| `entity_type` | string | Yes | Type of related entity | NOT NULL, max 100 |
| `entity_id` | UUID | Yes | ID of related entity | NOT NULL |
| `title` | string | Yes | Notification title | NOT NULL, max 500 |
| `message` | text | Yes | Notification body | NOT NULL |
| `action_url` | string | No | Deep link to relevant page | max 1000 |
| `actors` | JSONB | No | Who triggered the notification | |
| `read_at` | timestamp | No | When user read the notification | |
| `archived_at` | timestamp | No | When user archived it | |
| `created_at` | timestamp | Yes | When notification was created | NOT NULL |
| `expires_at` | timestamp | No | Auto-expire date | |

**`type` enum values:**

| Value | Description |
|-------|-------------|
| `blocker` | Blocking issue requiring immediate action |
| `mention` | User was mentioned in a discussion |
| `approval` | Approval action required |
| `update` | Status update on a tracked entity |
| `completion` | Task/process completed |
| `training` | Training requirement reminder |
| `version_change` | Collection or AoT version changed |
| `access_granted` | Access provisioned |
| `access_revoked` | Access revoked |

**Indexes:**

| Index | Columns | Type | Purpose |
|-------|---------|------|---------|
| `idx_notifications_user_id` | `user_id` | B-tree | User's notifications |
| `idx_notifications_unread` | `user_id`, `read_at` | B-tree (partial, WHERE read_at IS NULL) | Unread count |
| `idx_notifications_entity` | `entity_type`, `entity_id` | B-tree | Entity-related notifications |
| `idx_notifications_priority` | `user_id`, `priority` | B-tree | Priority filtering |
| `idx_notifications_created_at` | `created_at` | B-tree | Chronological ordering |

---

## 4. Audit Trail Design

### 4.1 Philosophy

The audit trail is the most critical non-functional requirement. It must satisfy:

- **ICH E6(R2)** requirements for clinical data traceability
- **GxP** requirements for computerised system validation
- **Internal AstraZeneca compliance** requirements for data governance
- **In-app approval** requirement: Collectoid's audit trail must comprehensively capture all approval decisions, state transitions, digital acknowledgements, and notification events to satisfy compliance requirements (per gap analysis D2). The approval workflow is entirely in-app with no external approval system dependencies.

### 4.2 Action Taxonomy

Every auditable action has a structured identifier:

| Action | Entity Type | Description |
|--------|-------------|-------------|
| `collection.created` | collection | New collection created |
| `collection.updated` | collection | Collection metadata changed |
| `collection.published` | collection | Collection published (made visible) |
| `collection.governance_stage_changed` | collection | Governance stage transition |
| `collection.operational_state_changed` | collection | Operational state transition |
| `proposition.status_changed` | proposition | Proposition status transition |
| `collection.archived` | collection | Collection archived |
| `collection.version_created` | collection_version | New version snapshot created |
| `collection.dataset_added` | collection | Dataset added to collection |
| `collection.dataset_removed` | collection | Dataset removed from collection |
| `collection.member_added` | collection_membership | User added to collection |
| `collection.member_removed` | collection_membership | User removed from collection |
| `collection.member_role_changed` | collection_membership | Member's role changed |
| `aot.created` | agreement_of_terms | New AoT created |
| `aot.version_created` | agreement_version | AoT terms changed (new version) |
| `aot.approved` | agreement_of_terms | AoT approved |
| `aot.revoked` | agreement_of_terms | AoT revoked |
| `approval.requested` | approval | Approval request sent |
| `approval.decided` | approval | Approval decision made |
| `approval.delegated` | approval | Approval delegated |
| `approval.expired` | approval | Approval expired without decision |
| `request.created` | access_request | Access request created |
| `request.submitted` | access_request | Access request submitted |
| `request.approved` | access_request | Access request approved |
| `request.rejected` | access_request | Access request rejected |
| `request.withdrawn` | access_request | Access request withdrawn |
| `user.access_granted` | collection_membership | User granted data access |
| `user.access_revoked` | collection_membership | User data access revoked |
| `user.training_completed` | user | User completed required training |
| `dataset.metadata_changed` | dataset | Dataset metadata updated (sync or manual) |
| `dataset.status_changed` | dataset | Dataset status changed |
| `dataset.flagged` | dataset | Dataset flagged as out-of-scope or restricted |
| `system.sync_completed` | external_cache | External data sync completed |
| `system.sync_failed` | external_cache | External data sync failed |

### 4.3 Immutability Enforcement

**PostgreSQL:**

```sql
-- Prevent UPDATE on audit_events
CREATE OR REPLACE FUNCTION prevent_audit_update()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'UPDATE operations are not permitted on audit_events';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_audit_update
  BEFORE UPDATE ON audit_events
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_update();

-- Prevent DELETE on audit_events
CREATE OR REPLACE FUNCTION prevent_audit_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'DELETE operations are not permitted on audit_events';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_audit_delete
  BEFORE DELETE ON audit_events
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_delete();
```

**DocumentDB/MongoDB:**

Enforce via application-layer middleware and IAM policies. The application database user should have only `insert` and `find` permissions on the `audit_events` collection. No `update` or `delete` permissions.

### 4.4 Payload Structure

The `payload` JSONB field captures action-specific context. Examples:

**Collection state change:**
```json
{
  "dimension": "governance_stage",
  "before": { "governance_stage": "draft" },
  "after": { "governance_stage": "pending_approval" },
  "trigger": "user_action"
}
```

**Approval decision:**
```json
{
  "chain_id": "uuid-chain",
  "team": "GPT-Oncology",
  "decision": "approved",
  "comment": "All governance criteria met.",
  "datasets_affected": ["DCODE-042", "DCODE-001"]
}
```

**Dataset metadata sync:**
```json
{
  "source_system": "azct",
  "fields_changed": ["patient_count", "enrollment_status"],
  "before": { "patient_count": 800, "enrollment_status": "Recruiting" },
  "after": { "patient_count": 890, "enrollment_status": "Completed" }
}
```

### 4.5 Retention Policy

| Tier | Age | Storage | Access |
|------|-----|---------|--------|
| Hot | 0-12 months | Primary database | Full query support |
| Warm | 12-36 months | Primary database (partitioned) | Full query support |
| Cold | 36-84 months (7 years) | S3 / archive storage | Batch query via Athena |
| Frozen | 84+ months | Glacier Deep Archive | Retrieval on request (compliance) |

[QUESTION] What is the exact regulatory retention period? ICH E6(R2) requires 15 years for some clinical data. Confirm with compliance team whether audit events need 7-year or 15-year retention.

### 4.6 Querying Patterns

| Query | Pattern | Index Used |
|-------|---------|------------|
| "Show me all changes to collection X" | `WHERE entity_type='collection' AND entity_id=X ORDER BY occurred_at` | `idx_audit_entity_time` |
| "What did user Y do in the last 30 days?" | `WHERE actor_id=Y AND occurred_at > now()-30d ORDER BY occurred_at DESC` | `idx_audit_actor` + `idx_audit_occurred_at` |
| "Show all approval decisions this week" | `WHERE action LIKE 'approval.%' AND occurred_at > now()-7d` | `idx_audit_action` + `idx_audit_occurred_at` |
| "Full audit trail for access request Z" | `WHERE entity_id=Z ORDER BY occurred_at` | `idx_audit_entity_time` |

---

## 5. Versioning Strategy

### 5.1 Approach: Snapshot Versioning

Collectoid uses **snapshot versioning** rather than diff-based versioning. Each version record contains the complete state at that point in time.

**Rationale:**
- Simplifies reconstruction of historical state (no need to replay diffs)
- More reliable for regulatory audit (each version is self-contained)
- Slightly higher storage cost, but acceptable given the data volumes
- Easier to implement in both PostgreSQL and DocumentDB

### 5.2 Collection Versioning

```
Collection (id: col-1)
  |
  +-- Version 1 (initial): { datasets: [A, B], governance_stage: draft, operational_state: null }
  |     created_at: 2026-01-15T10:00:00Z
  |     created_by: jennifer.martinez
  |
  +-- Version 2 (datasets_changed): { datasets: [A, B, C], governance_stage: draft, operational_state: null }
  |     created_at: 2026-01-16T14:00:00Z
  |     change_summary: "Added dataset DCODE-134"
  |
  +-- Version 3 (aot_changed): { datasets: [A, B, C], aot_version: 2, governance_stage: pending_approval, operational_state: null }
  |     created_at: 2026-01-17T09:00:00Z
  |     change_summary: "Updated AoT to allow AI research; submitted for approval"
  |
  +-- Version 4 (approval_decision): { datasets: [A, B, C], governance_stage: approved, operational_state: provisioning }
        created_at: 2026-01-20T15:30:00Z
        change_summary: "All TA Lead approvals obtained"
```

### 5.3 AoT Versioning

AoT versions follow the same pattern. When an approval decision changes (rejected to approved), a new AoT version is required with a new TA Lead signature (per VS2-335).

```
AgreementOfTerms (id: aot-1, collection_id: col-1)
  |
  +-- Version 1: { ai_research: false, publication: "internal_only" }
  |     created_at: 2026-01-15
  |
  +-- Version 2: { ai_research: true, publication: "by_exception" }
  |     created_at: 2026-01-17
  |     change_summary: "Enabled AI research; requires new TA approval"
  |
  +-- Version 3: { ai_research: true, publication: "external_publication" }
        created_at: 2026-02-01
        change_summary: "Enabled external publication after legal review"
```

### 5.4 Version Creation Triggers

A new version MUST be created when:

| Trigger | Entity | Notes |
|---------|--------|-------|
| Datasets added or removed | Collection | Captures new dataset list |
| AoT terms changed | AoT + Collection | Both get new versions |
| Users added or removed | Collection | [QUESTION] Or track only via membership table? |
| Approval decision changes (rejected to approved) | Collection + AoT | Requires new TA Lead signature (VS2-335) |
| State transition (governance_stage or operational_state) | Collection | Records state change |
| Metadata sync changes compliance status | Dataset | Auto-flag and version if in a collection |
| Periodic review completed | Collection | Documents review outcome |

### 5.5 Version Comparison API

The API must support comparing any two versions of a collection or AoT. The comparison is computed at query time by diffing the two snapshot JSONs, not stored separately.

---

## 6. External Data Caching

### 6.1 Architecture

External data is never queried in real time from source systems during user requests. Instead, sync jobs populate local cache tables on a schedule. The application reads exclusively from the cache.

```
 ┌──────────┐    sync jobs     ┌──────────────────────┐    reads     ┌──────────┐
 │  AZCT    │ ───────────────> │ external_cache_azct  │ <─────────── │  App     │
 │  API     │  (hourly/daily)  │                      │              │  Layer   │
 └──────────┘                  └──────────────────────┘              └──────────┘

 ┌──────────┐    sync jobs     ┌──────────────────────┐    reads     ┌──────────┐
 │Cornerstone│ ──────────────> │ external_cache_       │ <─────────── │  App     │
 │  API     │  (daily)         │  cornerstone          │              │  Layer   │
 └──────────┘                  └──────────────────────┘              └──────────┘

 ┌──────────┐    sync jobs     ┌──────────────────────┐    reads     ┌──────────┐
 │Collibra  │ ───────────────> │ external_cache_       │ <─────────── │  App     │
 │ 2.0 API  │  (daily)         │  collibra             │              │  Layer   │
 └──────────┘                  └──────────────────────┘              └──────────┘
```

See `04-integration-map.md` for full API specifications, authentication, rate limits, and error handling.

### 6.2 AZCT Cache Table

Stores study metadata from the AZCT REST API.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `azct_study_id` | string | Yes | AZCT-side study identifier | UNIQUE, NOT NULL |
| `d_code` | string | No | Resolved D-code | |
| `raw_payload` | JSONB | Yes | Full API response payload | NOT NULL |
| `normalised_fields` | JSONB | No | Extracted/normalised fields for faster querying | |
| `sync_status` | enum | Yes | `synced`, `stale`, `error`, `pending` | NOT NULL |
| `sync_error` | text | No | Error details if sync failed | |
| `first_synced_at` | timestamp | Yes | When first retrieved | NOT NULL |
| `synced_at` | timestamp | Yes | Last successful sync | NOT NULL |
| `next_sync_at` | timestamp | No | Scheduled next sync | |
| `sync_checksum` | string | No | Hash of raw_payload for change detection | max 64 |

### 6.3 Cornerstone Cache Table

Stores user training status from Cornerstone.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `user_id` | UUID | Yes | FK to local user | FK -> users.id, NOT NULL |
| `cornerstone_user_id` | string | No | Cornerstone-side user ID | |
| `training_data` | JSONB | Yes | Full training status payload | NOT NULL |
| `sync_status` | enum | Yes | `synced`, `stale`, `error`, `pending` | NOT NULL |
| `sync_error` | text | No | Error details | |
| `synced_at` | timestamp | Yes | Last successful sync | NOT NULL |
| `sync_checksum` | string | No | Change detection hash | max 64 |

### 6.4 Collibra Cache Table

Stores standardised metadata from Collibra 2.0.

| Field | Type | Required | Description | Constraints |
|-------|------|----------|-------------|-------------|
| `id` | UUID | Yes | Primary key | PK |
| `collibra_asset_id` | string | Yes | Collibra asset identifier | UNIQUE, NOT NULL |
| `asset_type` | string | Yes | Collibra asset type | NOT NULL, max 100 |
| `raw_payload` | JSONB | Yes | Full Collibra response | NOT NULL |
| `linked_dataset_id` | UUID | No | FK to local dataset if matched | FK -> datasets.id |
| `sync_status` | enum | Yes | `synced`, `stale`, `error`, `pending` | NOT NULL |
| `sync_error` | text | No | Error details | |
| `synced_at` | timestamp | Yes | Last successful sync | NOT NULL |
| `sync_checksum` | string | No | Change detection hash | max 64 |

### 6.5 Sync Strategy

| Source | Frequency | Trigger | Change Detection | Conflict Resolution |
|--------|-----------|---------|------------------|---------------------|
| AZCT | Hourly (full) + on-demand | Scheduled + manual trigger | Checksum comparison on raw payload | Source wins for metadata; local enrichments preserved in separate columns |
| Cornerstone | Daily | Scheduled | Checksum comparison | Source wins |
| Collibra 2.0 | Daily | Scheduled | Checksum comparison | Source wins for standard metadata |

### 6.6 Stale Data Handling

When a cache entry is older than the configured threshold:

1. The entry's `sync_status` is set to `stale`
2. The UI displays a "Data may be stale" indicator
3. A background job is triggered to refresh
4. The stale data is still served to avoid blocking user operations

[QUESTION] What are the acceptable staleness thresholds for each source? Proposed: AZCT = 2 hours, Cornerstone = 24 hours, Collibra = 24 hours.

### 6.1 Immuta Data Model Mapping (Provisioning Target)

When a collection is approved and transitions to the provisioning phase, Collectoid must create or update records in Immuta's data model. This section documents how Collectoid's internal entities map to Immuta's 10-table model (source: `Immuta Tables for R&D.xlsx` analysis).

#### Collectoid → Immuta Entity Mapping

| Collectoid Entity | Immuta Table | Relationship | Notes |
|-------------------|-------------|-------------|-------|
| Collection activities (from `agreement_versions.terms`) | `Data_Access_Intent` | 1 activity → 1 intent row | Each permitted activity creates an intent with `Category`, `Sub_Category`, `Purpose` |
| Approval decisions (from `approvals`) | `Access_Authorisation` | 1 approval → 1+ authorisation rows | Tracks IDA (standing) vs AdHoc (request-based) track; includes 3 approval tiers |
| Selected datasets (from `collection_version_datasets`) | `Partition_Filter_Criteria` | N d-codes → 1 partition filter per data source | `Study_ID IN ('D-001', 'D-042', ...)` WHERE clause |
| Role group selections (from `collection_members`) | `User_Profile` | Collection access scope → profile expression | Criteria-based matching over `User_Tags` |
| — (read-only) | `User_Tags` | Reference data | Tags sourced from Manual, NPA, Workday, Cornerstone |
| — (read-only) | `Data_Asset` | Reference data | Broad data products; collections are scoped subsets |
| — (read-only) | `Internal_Data_Agreement` | Reference data | IDA records for standing access (90% route) |
| AoT restrictions | `Data_Usage_Restrictions` | Validation target | Collectoid validates AoT terms don't conflict |
| — | `Hypothesis` | Not used | Empty in current Immuta data |
| Partition → User assignments | `Partition_Applicable` | Junction | Links partitions to users/profiles |

#### Key Design Implications

**1. Intent-per-activity granularity:** The `agreement_versions.terms` JSONB (Section 3.12) stores activities as boolean flags (`primary_use.understand_drug_mechanism: true`). Each `true` activity must map to a `Data_Access_Intent` row with the correct Immuta `Category` and `Sub_Category`. A category/subcategory mapping table is needed — either as a new `intent_category_mappings` table or as application-level configuration.

**2. Dual AI/ML flags:** The Immuta model has two separate boolean columns per intent: `To_train_AI_ML_models` and `To_store_data_in_AI_ML_model`. The current `terms` JSONB schema (Section 3.12) has a single `beyond_primary_use.ai_research` flag. **[TBD]:** Add a second AI/ML flag to the `terms` JSONB schema: `beyond_primary_use.store_in_ai_ml_model`. This is a schema change needed before Q3 provisioning.

**3. Two authorisation tracks:** The `approvals` table (Section 3.17) uses `team` to identify the approver type (GPT, TALT, DDO, Alliance). Immuta uses `Authorisation_Type` with values `IDA` (Internal Data Agreement = standing access) or `AdHoc` (request-based). **[TBD]:** The `access_requests` table or `agreement_versions` should carry an `authorisation_track` field (`ida` | `adhoc`) to distinguish which Immuta track applies.

**4. Three approval tiers:** Immuta defines three tiers: `Data Steward/DPM`, `Source Owner`, `Power User - TALT`. The `approvals.team` field currently uses `GPT`, `TALT`, `DDO`, `Alliance`. **[TBD]:** Confirm the mapping between Collectoid's team values and Immuta's tier enum. Consider adding an `immuta_tier` column to `approvals` or maintaining a mapping table.

**5. Partition-based row security:** When Collectoid provisions a collection, the selected d-codes become a `Study_ID IN (...)` SQL WHERE clause in Immuta. This is derived from `collection_version_datasets` → `datasets.d_code`. No schema change needed — the data is already available.

**6. User Profile criteria expressions:** Immuta User Profiles are boolean expressions over `User_Tags` (e.g., `tag:department = 'Oncology' AND tag:training_complete = true`). Collectoid must either generate these expressions from collection role group selections or reference pre-existing Immuta profiles. **[TBD]:** Determine ownership — does Collectoid create profiles or reference existing ones?

**7. Review cycles:** Each `Data_Access_Intent` has `Next_Review_Date` and `Review_Status`. The existing `agreement_versions.review_date` maps to intent-level review, but a single AoT review date may need to fan out to multiple intent review dates. **[TBD]:** Consider whether `review_date` should be per-intent (requiring a new `collection_intents` table) or per-collection (current design).

**8. Column-level masking (identified gap):** The PBAC metadata diagram flags "Masking to be added" as a pending requirement. Beyond row-level partitions (`Partition_Filter_Criteria`) and user-level profiles (`User_Profile`), Immuta also supports column-level data masking — redacting or obfuscating sensitive columns (e.g., PII, dates of birth, patient identifiers) at query time. This may require an additional Immuta table or policy configuration not yet mapped. Collectoid's AoT terms may need to specify which columns require masking per collection. **[TBD — METADATA FLOW]:** Confirm Immuta's masking table/mechanism and whether Collectoid needs to write masking rules or if DPO manages them independently.

**9. Policy monitoring and reconciliation (identified gap):** The PBAC diagram indicates a monitoring and reporting layer for verifying that provisioned policies are actually enforced at the Starburst/Ranger query layer. Collectoid should implement periodic reconciliation between its approved collection state and Immuta's actual policy state. **[TBD — METADATA FLOW]:** Confirm whether Immuta exposes a status/health API for policy enforcement verification, and what monitoring dashboard requirements exist.

> **Pending:** A full metadata flow diagram is expected to clarify the remaining TBD items above, particularly the Category/Sub_Category taxonomy mapping and User Profile ownership.

---

## 7. Indexes and Query Patterns

### 7.1 Primary Query Patterns

| # | Query | Frequency | Tables | Key Indexes |
|---|-------|-----------|--------|-------------|
| Q1 | List my collections (by creator) | Very High | `collections` | `idx_collections_created_by` |
| Q2 | List collections I am a member of | Very High | `collection_members` | `idx_cm_user_id` |
| Q3 | Search collections by name/tag/TA | High | `collections` | `idx_collections_name_trgm`, GIN on `tags`, `therapeutic_areas` |
| Q4 | Get collection with current version | Very High | `collections` + `collection_versions` | PK lookups |
| Q5 | List datasets in a collection version | High | `cv_datasets` + `datasets` | `idx_cvd_cv_id` |
| Q6 | Search datasets by D-code/name/TA/phase | High | `datasets` | `idx_datasets_d_code`, `idx_datasets_name_trgm`, GIN on `therapeutic_areas` |
| Q7 | Get pending approvals for a user | High | `approvals` | `idx_approvals_approver_id` + `idx_approvals_decision` (partial, IS NULL) |
| Q8 | Get unread notifications for a user | Very High | `notifications` | `idx_notifications_unread` |
| Q9 | Get audit trail for an entity | Medium | `audit_events` | `idx_audit_entity_time` |
| Q10 | Get version history for a collection | Medium | `collection_versions` | `idx_cv_collection_id` |
| Q11 | List members of a collection | High | `collection_members` + `users` | `idx_cm_collection_id` |
| Q12 | Duplicate detection across collections | Medium | `cv_datasets` | Composite query joining cv_datasets to find overlapping dataset sets |
| Q13 | Dashboard: collections by state | Medium | `collections` | `idx_collections_governance_stage`, `idx_collections_operational_state` |
| Q14 | Training compliance: users with incomplete training | Medium | `users` (training_status JSONB) | GIN on `training_status` |
| Q15 | Access requests by status | Medium | `access_requests` | `idx_ar_status` |

### 7.2 Composite Indexes for Common Joins

```sql
-- Collection members with user details (Q11)
CREATE INDEX idx_cm_collection_user ON collection_members(collection_id, user_id)
  WHERE revoked_at IS NULL;

-- Active datasets in active collections (Q5 optimised)
CREATE INDEX idx_cvd_cv_id ON collection_version_datasets(collection_version_id);

-- Pending approvals for dashboard (Q7 optimised)
CREATE INDEX idx_approvals_pending ON approvals(approver_id, requested_at)
  WHERE decision IS NULL;
```

### 7.3 Full-Text Search

For dataset and collection search (Q3, Q6), enable PostgreSQL full-text search:

```sql
-- Dataset search vector
ALTER TABLE datasets ADD COLUMN search_vector tsvector;

CREATE INDEX idx_datasets_fts ON datasets USING gin(search_vector);

CREATE OR REPLACE FUNCTION datasets_search_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.d_code, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.therapeutic_areas, ' '), '')), 'B');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER datasets_search_trigger
  BEFORE INSERT OR UPDATE ON datasets
  FOR EACH ROW EXECUTE FUNCTION datasets_search_update();
```

For DocumentDB: use Atlas Search or application-layer search indexing.

---

## 8. Data Migration Plan

### 8.1 Migration Phases

```
Phase 1: Schema creation
  |
  +-- Create all tables/collections
  +-- Create indexes
  +-- Seed reference data (roles, data_categories)
  |
Phase 2: External data seeding
  |
  +-- Run initial AZCT sync (populate datasets from production AZCT)
  +-- Run initial Cornerstone sync (populate training status)
  +-- Run initial Collibra sync (populate metadata)
  |
Phase 3: Mock data mapping (POC transition)
  |
  +-- Map MOCK_DATASETS (9 datasets) to production dataset records
  +-- Map DATA_CATEGORY_TAXONOMY (30+ categories) to data_categories
  +-- Map MOCK_COLLECTIONS (multiple collections) to collections + versions
  +-- Map MOCK_NOTIFICATIONS to notifications
  +-- Map mock users to users (linked to Azure AD)
  |
Phase 4: Validation
  |
  +-- Verify all foreign key relationships
  +-- Verify audit trail captures
  +-- Run integrity checks
  +-- Smoke test key query patterns (Q1-Q15)
```

### 8.2 POC Interface to Production Entity Mapping

| POC Interface (dcm-mock-data.ts) | Production Entity | Notes |
|---|---|---|
| `Dataset` (line 559) | `datasets` + `child_datasets` | Split child datasets into separate table; JSONB for clinical/aot metadata |
| `DataCategory` (line 111) | `data_categories` | Direct mapping; add `code` field |
| `Collection` (line 3716) | `collections` + `collection_versions` | Decompose into versioned structure; extract members |
| `AgreementOfTerms` (line 453) | `agreements_of_terms` + `agreement_versions` | Decompose into versioned structure |
| `User` (line 4785) | `users` + `collection_members` | Separate system user from collection membership |
| `Notification` (line 4440) | `notifications` | Direct mapping; add entity references |
| `DataAccessRequest` (line 93) | `access_requests` + `approval_chains` + `approvals` | Decompose into normalised approval workflow |
| `DatasetApprovalRequirement` (line 433) | `approvals` | Mapped to individual approval records |
| `DatasetApprovalAction` (line 442) | `approvals` (decision fields) | Merged into approval record |
| `Activity` (line 5110) | Embedded in `collection_versions.snapshot` | Activities are part of collection state |
| `AoTConflict` (line 5116) | Embedded in `agreement_versions.acknowledged_conflicts` | Stored as JSONB in version |
| `Note` / `NoteReply` (line 5305) | `discussions` + `comments` | Adapted from XPath-based notes to entity-attached discussions |
| `TeamContact` (line 5056) | `users` + `user_roles` | Team contacts become users with approver roles |

### 8.3 Reference Data Seeding

The 30+ `DataCategory` records from `DATA_CATEGORY_TAXONOMY` (line 121 of dcm-mock-data.ts) should be seeded as initial data:

| Domain | Count | Examples |
|--------|-------|---------|
| Therapeutic Areas | 3+ | ONC, IMMUNONC, CARDIO |
| SDTM | 7 | Demographics, Exposure, Tumor/Response, Biomarker/Labs, AE, ConMeds, Specimens |
| RAW Data | 4 | ctDNA, Specimen Meta, Assay Meta, Processing/QC |
| ADaM | 5 | ADSL, ADRS/ADEFF, ADTTE, ADBM/ADLB, ADEXP |
| DICOM | 3 | IDs/Timing, Acquisition, Quantitative |
| Omics/NGS | 7 | Variants, Global Scores, CN/SV, Sample/Provenance, Pipeline Meta, QC, Clonal Dynamics |

---

## 9. Schema for Both Database Options

### 9.1 Aurora PostgreSQL Schema

PostgreSQL is the recommended option for its JSONB support, transactional integrity, full-text search, and GIN indexes.

```sql
-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE governance_stage AS ENUM (
  'concept', 'draft', 'pending_approval', 'approved', 'rejected'
);

CREATE TYPE operational_state AS ENUM (
  'provisioning', 'live', 'suspended', 'decommissioned'
);

CREATE TYPE proposition_status AS ENUM (
  'draft', 'submitted', 'approved', 'merged', 'rejected'
);

CREATE TYPE collection_request_type AS ENUM (
  'new', 'update', 'policy_change'
);

CREATE TYPE dataset_status AS ENUM (
  'active', 'closed', 'grey_zone', 'archived'
);

CREATE TYPE access_request_status AS ENUM (
  'draft', 'submitted', 'in_review', 'approved',
  'partially_approved', 'rejected', 'withdrawn', 'expired'
);

CREATE TYPE approval_chain_status AS ENUM (
  'pending', 'in_progress', 'approved', 'rejected', 'expired'
);

CREATE TYPE approval_decision AS ENUM (
  'approved', 'rejected', 'aware', 'delegated'
);

CREATE TYPE aot_status AS ENUM (
  'draft', 'pending_approval', 'approved', 'superseded', 'revoked'
);

CREATE TYPE collection_role AS ENUM (
  'owner', 'data_owner', 'consumer_lead', 'consumer', 'approver', 'observer'
);

CREATE TYPE member_access_status AS ENUM (
  'immediate', 'instant_grant', 'pending_approval',
  'blocked_training', 'provisioning', 'revoked'
);

CREATE TYPE child_access_status AS ENUM (
  'open', 'ready', 'approval', 'missing'
);

CREATE TYPE sync_status AS ENUM (
  'synced', 'stale', 'error', 'pending'
);

CREATE TYPE notification_type AS ENUM (
  'blocker', 'mention', 'approval', 'update', 'completion',
  'training', 'version_change', 'access_granted', 'access_revoked'
);

CREATE TYPE notification_priority AS ENUM (
  'critical', 'high', 'medium', 'low'
);

CREATE TYPE discussion_entity_type AS ENUM (
  'collection', 'access_request', 'dataset', 'approval'
);

CREATE TYPE data_product_rights AS ENUM (
  'research_allowed', 'research_not_allowed', 'under_review'
);

CREATE TYPE data_availability AS ENUM (
  'in_pdp', 'in_entimice', 'in_ctds', 'location_unknown'
);

CREATE TYPE sponsor_type AS ENUM (
  'az_sponsored', 'ismo', 'externally_sponsored', 'investigator_run'
);

CREATE TYPE compliance_status AS ENUM (
  'fully_compliant', 'ethical_review_pending',
  'legal_review_pending', 'dpr_under_review'
);

CREATE TYPE collection_version_change_type AS ENUM (
  'initial', 'datasets_changed', 'aot_changed', 'users_changed',
  'approval_decision', 'metadata_update', 'periodic_review', 'state_transition'
);

-- ============================================================
-- TABLES
-- ============================================================

CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  azure_ad_id     VARCHAR(255) NOT NULL UNIQUE,
  email           VARCHAR(255) NOT NULL UNIQUE,
  display_name    VARCHAR(255) NOT NULL,
  department      VARCHAR(255),
  job_title       VARCHAR(255),
  manager_id      UUID REFERENCES users(id),
  prid            VARCHAR(50) UNIQUE,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  profile_synced_at TIMESTAMPTZ,
  training_status JSONB,
  training_synced_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);

CREATE TABLE roles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            VARCHAR(50) NOT NULL UNIQUE,
  display_name    VARCHAR(100) NOT NULL,
  description     VARCHAR(1000),
  permissions     JSONB NOT NULL,
  is_system_role  BOOLEAN NOT NULL DEFAULT false,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  role_id         UUID NOT NULL REFERENCES roles(id),
  assigned_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by     UUID NOT NULL REFERENCES users(id),
  revoked_at      TIMESTAMPTZ,
  UNIQUE (user_id, role_id) -- enforced at app level for active-only
);

CREATE TABLE data_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            VARCHAR(50) NOT NULL UNIQUE,
  name            VARCHAR(255) NOT NULL,
  domain          VARCHAR(100) NOT NULL,
  description     TEXT,
  key_variables   TEXT[],
  is_highlighted  BOOLEAN NOT NULL DEFAULT false,
  display_order   INTEGER,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE datasets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  d_code          VARCHAR(50) NOT NULL UNIQUE,
  azct_study_id   VARCHAR(255) UNIQUE,
  name            VARCHAR(500) NOT NULL,
  description     TEXT,
  therapeutic_areas TEXT[] NOT NULL DEFAULT '{}',
  phase           VARCHAR(50),
  status          dataset_status NOT NULL,
  closed_date     DATE,
  geography       TEXT[],
  patient_count   INTEGER CHECK (patient_count >= 0),
  clinical_metadata JSONB,
  aot_metadata    JSONB,
  access_breakdown JSONB,
  access_platform VARCHAR(50),
  data_layers     TEXT[],
  data_location   JSONB,
  frequently_bundled_with TEXT[],
  first_subject_in DATE,
  database_lock_date DATE,
  is_locked       BOOLEAN,
  data_product_rights data_product_rights,
  data_availability data_availability,
  sponsor_type    sponsor_type,
  compliance_status compliance_status,
  modalities      TEXT[],
  source_system   VARCHAR(50) NOT NULL DEFAULT 'manual',
  source_synced_at TIMESTAMPTZ,
  search_vector   TSVECTOR,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);

CREATE TABLE child_datasets (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_dataset_id UUID NOT NULL REFERENCES datasets(id),
  d_code            VARCHAR(50) NOT NULL UNIQUE,
  name              VARCHAR(255) NOT NULL,
  data_type         VARCHAR(50),
  access_status     child_access_status NOT NULL,
  record_count      INTEGER CHECK (record_count >= 0),
  last_updated      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE dataset_categories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_id      UUID NOT NULL REFERENCES datasets(id),
  category_id     UUID NOT NULL REFERENCES data_categories(id),
  UNIQUE (dataset_id, category_id)
);

CREATE TABLE collections (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  current_version_id UUID,  -- FK added after collection_versions created
  governance_stage  governance_stage NOT NULL DEFAULT 'concept',
  operational_state operational_state,
  name              VARCHAR(500) NOT NULL,
  description       TEXT,
  request_type      collection_request_type NOT NULL DEFAULT 'new',
  therapeutic_areas TEXT[],
  tags              TEXT[],
  is_draft          BOOLEAN NOT NULL DEFAULT true,
  created_by        UUID NOT NULL REFERENCES users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  published_at      TIMESTAMPTZ,
  archived_at       TIMESTAMPTZ,
  deleted_at        TIMESTAMPTZ
);

CREATE TABLE propositions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id   UUID NOT NULL REFERENCES collections(id),
  title           VARCHAR(500) NOT NULL,
  description     TEXT,
  type            VARCHAR(50) NOT NULL CHECK (type IN ('dataset_change', 'aot_change', 'user_change', 'mixed')),
  status          proposition_status NOT NULL DEFAULT 'draft',
  changes         JSONB NOT NULL,
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at    TIMESTAMPTZ,
  merged_at       TIMESTAMPTZ,
  decided_at      TIMESTAMPTZ,
  decision_reason TEXT
);

CREATE TABLE collection_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id   UUID NOT NULL REFERENCES collections(id),
  version_number  INTEGER NOT NULL,
  change_summary  TEXT NOT NULL,
  change_type     collection_version_change_type NOT NULL,
  snapshot        JSONB NOT NULL,
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (collection_id, version_number)
);

-- Add FK from collections to collection_versions
ALTER TABLE collections
  ADD CONSTRAINT fk_collections_current_version
  FOREIGN KEY (current_version_id) REFERENCES collection_versions(id);

CREATE TABLE collection_version_datasets (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_version_id UUID NOT NULL REFERENCES collection_versions(id),
  dataset_id            UUID NOT NULL REFERENCES datasets(id),
  modalities            TEXT[],
  sources               JSONB,
  included_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (collection_version_id, dataset_id)
);

CREATE TABLE agreements_of_terms (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id     UUID NOT NULL UNIQUE REFERENCES collections(id),
  current_version_id UUID,  -- FK added after agreement_versions created
  status            aot_status NOT NULL DEFAULT 'draft',
  created_by        UUID NOT NULL REFERENCES users(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE agreement_versions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  aot_id          UUID NOT NULL REFERENCES agreements_of_terms(id),
  version_number  INTEGER NOT NULL,
  terms           JSONB NOT NULL,
  user_scope      JSONB NOT NULL,
  change_summary  TEXT NOT NULL,
  ai_suggested    BOOLEAN NOT NULL DEFAULT false,
  user_modified_fields TEXT[],
  acknowledged_conflicts JSONB,
  effective_date  DATE,
  review_date     DATE,
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (aot_id, version_number)
);

ALTER TABLE agreements_of_terms
  ADD CONSTRAINT fk_aot_current_version
  FOREIGN KEY (current_version_id) REFERENCES agreement_versions(id);

CREATE TABLE collection_members (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id   UUID NOT NULL REFERENCES collections(id),
  user_id         UUID NOT NULL REFERENCES users(id),
  collection_role collection_role NOT NULL,
  access_status   member_access_status NOT NULL DEFAULT 'pending_approval',
  datasets_accessible TEXT[],
  datasets_pending TEXT[],
  assigned_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  assigned_by     UUID NOT NULL REFERENCES users(id),
  provisioned_at  TIMESTAMPTZ,
  revoked_at      TIMESTAMPTZ,
  revoke_reason   TEXT
);

CREATE TABLE access_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id    UUID NOT NULL REFERENCES users(id),
  collection_id   UUID REFERENCES collections(id),
  status          access_request_status NOT NULL DEFAULT 'draft',
  intent          JSONB NOT NULL,
  dataset_ids     UUID[] NOT NULL,
  matching_result JSONB,
  notes           TEXT,
  expected_duration VARCHAR(50),
  submitted_at    TIMESTAMPTZ,
  decided_at      TIMESTAMPTZ,
  decision_reason TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE approval_chains (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type         VARCHAR(50) NOT NULL,
  entity_id           UUID NOT NULL,
  status              approval_chain_status NOT NULL DEFAULT 'pending',
  all_or_nothing      BOOLEAN NOT NULL DEFAULT true,
  required_approvals  INTEGER NOT NULL CHECK (required_approvals > 0),
  received_approvals  INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at        TIMESTAMPTZ
);

CREATE TABLE approvals (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chain_id        UUID NOT NULL REFERENCES approval_chains(id),
  approver_id     UUID NOT NULL REFERENCES users(id),
  team            VARCHAR(100) NOT NULL,
  reason          TEXT NOT NULL,
  decision        approval_decision,
  comment         TEXT,
  requested_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  due_date        TIMESTAMPTZ,
  decided_at      TIMESTAMPTZ,
  signature_ref   VARCHAR(255),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE audit_events (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id          UUID REFERENCES users(id),
  actor_email       VARCHAR(255),
  actor_display_name VARCHAR(255),
  action            VARCHAR(100) NOT NULL,
  entity_type       VARCHAR(100) NOT NULL,
  entity_id         UUID NOT NULL,
  entity_name       VARCHAR(500),
  payload           JSONB,
  ip_address        VARCHAR(45),
  user_agent        VARCHAR(500),
  session_id        VARCHAR(100),
  occurred_at       TIMESTAMPTZ NOT NULL,
  ingested_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE discussions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type     discussion_entity_type NOT NULL,
  entity_id       UUID NOT NULL,
  title           VARCHAR(500),
  is_resolved     BOOLEAN NOT NULL DEFAULT false,
  resolved_by     UUID REFERENCES users(id),
  resolved_at     TIMESTAMPTZ,
  created_by      UUID NOT NULL REFERENCES users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at      TIMESTAMPTZ
);

CREATE TABLE comments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  discussion_id     UUID NOT NULL REFERENCES discussions(id),
  parent_comment_id UUID REFERENCES comments(id),
  author_id         UUID NOT NULL REFERENCES users(id),
  body              TEXT NOT NULL,
  mentions          UUID[],
  reactions         JSONB,
  is_edited         BOOLEAN NOT NULL DEFAULT false,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at        TIMESTAMPTZ
);

CREATE TABLE notifications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id),
  type            notification_type NOT NULL,
  priority        notification_priority NOT NULL,
  entity_type     VARCHAR(100) NOT NULL,
  entity_id       UUID NOT NULL,
  title           VARCHAR(500) NOT NULL,
  message         TEXT NOT NULL,
  action_url      VARCHAR(1000),
  actors          JSONB,
  read_at         TIMESTAMPTZ,
  archived_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at      TIMESTAMPTZ
);

-- ============================================================
-- EXTERNAL CACHE TABLES
-- ============================================================

CREATE TABLE external_cache_azct (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  azct_study_id   VARCHAR(255) NOT NULL UNIQUE,
  d_code          VARCHAR(50),
  raw_payload     JSONB NOT NULL,
  normalised_fields JSONB,
  sync_status     sync_status NOT NULL DEFAULT 'pending',
  sync_error      TEXT,
  first_synced_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  synced_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  next_sync_at    TIMESTAMPTZ,
  sync_checksum   VARCHAR(64)
);

CREATE TABLE external_cache_cornerstone (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id),
  cornerstone_user_id VARCHAR(255),
  training_data       JSONB NOT NULL,
  sync_status         sync_status NOT NULL DEFAULT 'pending',
  sync_error          TEXT,
  synced_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_checksum       VARCHAR(64)
);

CREATE TABLE external_cache_collibra (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collibra_asset_id VARCHAR(255) NOT NULL UNIQUE,
  asset_type        VARCHAR(100) NOT NULL,
  raw_payload       JSONB NOT NULL,
  linked_dataset_id UUID REFERENCES datasets(id),
  sync_status       sync_status NOT NULL DEFAULT 'pending',
  sync_error        TEXT,
  synced_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  sync_checksum     VARCHAR(64)
);

-- ============================================================
-- INDEXES (see Sections 3 and 7 for full list)
-- ============================================================

-- Users
CREATE INDEX idx_users_department ON users(department);
CREATE INDEX idx_users_active ON users(id) WHERE deleted_at IS NULL;

-- Datasets
CREATE INDEX idx_datasets_status ON datasets(status);
CREATE INDEX idx_datasets_therapeutic_areas ON datasets USING gin(therapeutic_areas);
CREATE INDEX idx_datasets_phase ON datasets(phase);
CREATE INDEX idx_datasets_geography ON datasets USING gin(geography);
CREATE INDEX idx_datasets_fts ON datasets USING gin(search_vector);
CREATE INDEX idx_datasets_clinical_metadata ON datasets USING gin(clinical_metadata);
CREATE INDEX idx_datasets_active ON datasets(id) WHERE deleted_at IS NULL;

-- Child Datasets
CREATE INDEX idx_child_datasets_parent ON child_datasets(parent_dataset_id);
CREATE INDEX idx_child_datasets_status ON child_datasets(access_status);

-- Data Categories
CREATE INDEX idx_data_categories_domain ON data_categories(domain);

-- Collections
CREATE INDEX idx_collections_governance_stage ON collections(governance_stage);
CREATE INDEX idx_collections_operational_state ON collections(operational_state) WHERE operational_state IS NOT NULL;
CREATE INDEX idx_collections_created_by ON collections(created_by);
CREATE INDEX idx_collections_therapeutic_areas ON collections USING gin(therapeutic_areas);
CREATE INDEX idx_collections_tags ON collections USING gin(tags);
CREATE INDEX idx_collections_active ON collections(id) WHERE deleted_at IS NULL;

-- Propositions
CREATE INDEX idx_propositions_collection_id ON propositions(collection_id);
CREATE INDEX idx_propositions_status ON propositions(status);
CREATE INDEX idx_propositions_created_by ON propositions(created_by);
CREATE INDEX idx_propositions_collection_status ON propositions(collection_id, status);

-- Collection Versions
CREATE INDEX idx_cv_collection_id ON collection_versions(collection_id);
CREATE INDEX idx_cv_created_at ON collection_versions(created_at);

-- Collection Version Datasets
CREATE INDEX idx_cvd_cv_id ON collection_version_datasets(collection_version_id);
CREATE INDEX idx_cvd_dataset_id ON collection_version_datasets(dataset_id);

-- Collection Members
CREATE INDEX idx_cm_collection_id ON collection_members(collection_id);
CREATE INDEX idx_cm_user_id ON collection_members(user_id);
CREATE INDEX idx_cm_collection_role ON collection_members(collection_id, collection_role);
CREATE INDEX idx_cm_access_status ON collection_members(access_status);
CREATE UNIQUE INDEX idx_cm_active_member ON collection_members(collection_id, user_id)
  WHERE revoked_at IS NULL;

-- Access Requests
CREATE INDEX idx_ar_requester_id ON access_requests(requester_id);
CREATE INDEX idx_ar_collection_id ON access_requests(collection_id);
CREATE INDEX idx_ar_status ON access_requests(status);
CREATE INDEX idx_ar_submitted_at ON access_requests(submitted_at);

-- Approval Chains
CREATE INDEX idx_ac_entity ON approval_chains(entity_type, entity_id);
CREATE INDEX idx_ac_status ON approval_chains(status);

-- Approvals
CREATE INDEX idx_approvals_chain_id ON approvals(chain_id);
CREATE INDEX idx_approvals_approver_id ON approvals(approver_id);
CREATE INDEX idx_approvals_pending ON approvals(approver_id, requested_at) WHERE decision IS NULL;
CREATE INDEX idx_approvals_team ON approvals(team);

-- Audit Events
CREATE INDEX idx_audit_entity ON audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_actor ON audit_events(actor_id);
CREATE INDEX idx_audit_action ON audit_events(action);
CREATE INDEX idx_audit_occurred_at ON audit_events(occurred_at);
CREATE INDEX idx_audit_entity_time ON audit_events(entity_type, entity_id, occurred_at);

-- Discussions
CREATE INDEX idx_discussions_entity ON discussions(entity_type, entity_id);
CREATE INDEX idx_discussions_created_by ON discussions(created_by);

-- Comments
CREATE INDEX idx_comments_discussion_id ON comments(discussion_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_mentions ON comments USING gin(mentions);

-- Notifications
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id) WHERE read_at IS NULL;
CREATE INDEX idx_notifications_entity ON notifications(entity_type, entity_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- External Caches
CREATE INDEX idx_ec_azct_sync ON external_cache_azct(sync_status, next_sync_at);
CREATE INDEX idx_ec_cornerstone_user ON external_cache_cornerstone(user_id);
CREATE INDEX idx_ec_collibra_linked ON external_cache_collibra(linked_dataset_id);

-- ============================================================
-- AUDIT IMMUTABILITY TRIGGERS
-- ============================================================

CREATE OR REPLACE FUNCTION prevent_audit_update() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'UPDATE operations are not permitted on audit_events';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_audit_update
  BEFORE UPDATE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_update();

CREATE OR REPLACE FUNCTION prevent_audit_delete() RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'DELETE operations are not permitted on audit_events';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER no_audit_delete
  BEFORE DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION prevent_audit_delete();

-- ============================================================
-- UPDATED_AT AUTO-UPDATE TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON datasets FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON collections FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON agreements_of_terms FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON collection_members FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON access_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON approval_chains FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON approvals FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON discussions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON comments FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

### 9.2 DocumentDB (MongoDB) Schema

For DocumentDB, the model is adapted to a document-oriented approach. Key differences:

- Embedded documents replace some junction tables
- JSONB columns become native sub-documents
- Versioned entities use embedded version arrays or separate version collections
- Indexes use MongoDB syntax

**Collections (MongoDB sense):**

```javascript
// ─── users ───
{
  _id: ObjectId,
  azure_ad_id: String,        // unique index
  email: String,              // unique index
  display_name: String,
  department: String,
  job_title: String,
  manager_id: ObjectId,       // ref: users
  prid: String,               // unique sparse index
  is_active: Boolean,
  profile_synced_at: Date,
  training_status: {          // embedded document
    required: [String],
    completed: [String],
    in_progress: [{ cert: String, progress: Number }],
    missing: [String],
    completion_percent: Number,
    deadline: Date,
    is_overdue: Boolean
  },
  training_synced_at: Date,
  roles: [{                   // embedded (replaces user_roles junction)
    role_name: String,
    assigned_at: Date,
    assigned_by: ObjectId,
    revoked_at: Date
  }],
  created_at: Date,
  updated_at: Date,
  deleted_at: Date
}

// ─── datasets ───
{
  _id: ObjectId,
  d_code: String,             // unique index
  azct_study_id: String,      // unique sparse index
  name: String,
  description: String,
  therapeutic_areas: [String],
  phase: String,
  status: String,             // enum: active, closed, grey_zone, archived
  closed_date: Date,
  geography: [String],
  patient_count: Number,
  clinical_metadata: { /* embedded - same as PostgreSQL JSONB */ },
  aot_metadata: { /* embedded */ },
  access_breakdown: { /* embedded */ },
  access_platform: String,
  data_layers: [String],
  data_location: { /* embedded */ },
  frequently_bundled_with: [String],
  category_codes: [String],   // denormalised from data_categories
  child_datasets: [{          // embedded (replaces child_datasets table)
    _id: ObjectId,
    d_code: String,
    name: String,
    data_type: String,
    access_status: String,
    record_count: Number,
    last_updated: Date
  }],
  // ROAM fields
  first_subject_in: Date,
  database_lock_date: Date,
  is_locked: Boolean,
  data_product_rights: String,
  data_availability: String,
  sponsor_type: String,
  compliance_status: String,
  modalities: [String],
  source_system: String,
  source_synced_at: Date,
  created_at: Date,
  updated_at: Date,
  deleted_at: Date
}

// ─── collections ───
{
  _id: ObjectId,
  current_version_number: Number,
  governance_stage: String,         // enum: concept, draft, pending_approval, approved, rejected
  operational_state: String | null, // enum: provisioning, live, suspended, decommissioned (null until approved)
  name: String,
  description: String,
  request_type: String,
  therapeutic_areas: [String],
  tags: [String],
  is_draft: Boolean,
  created_by: ObjectId,
  created_at: Date,
  updated_at: Date,
  published_at: Date,
  archived_at: Date,
  deleted_at: Date,
  // AoT embedded (or reference)
  agreement_of_terms: {
    _id: ObjectId,
    current_version_number: Number,
    status: String,
    created_by: ObjectId
  }
}

// ─── propositions ───
{
  _id: ObjectId,
  collection_id: ObjectId,    // ref: collections
  title: String,
  description: String,
  type: String,               // enum: dataset_change, aot_change, user_change, mixed
  status: String,             // enum: draft, submitted, approved, merged, rejected
  changes: {                  // BSON document with proposed changes
    datasets_added: [ObjectId],
    datasets_removed: [ObjectId],
    aot_changes: Object,
    users_added: [{ user_id: ObjectId, collection_role: String }],
    users_removed: [ObjectId]
  },
  created_by: ObjectId,
  created_at: Date,
  updated_at: Date,
  submitted_at: Date,
  merged_at: Date,
  decided_at: Date,
  decision_reason: String
}

// ─── collection_versions (separate collection for query efficiency) ───
{
  _id: ObjectId,
  collection_id: ObjectId,    // ref: collections
  version_number: Number,
  change_summary: String,
  change_type: String,
  snapshot: { /* full state snapshot */ },
  dataset_ids: [ObjectId],    // denormalised for fast lookup
  created_by: ObjectId,
  created_at: Date
}
// compound unique index: { collection_id: 1, version_number: 1 }

// ─── agreement_versions (separate collection) ───
{
  _id: ObjectId,
  aot_id: ObjectId,
  collection_id: ObjectId,    // denormalised
  version_number: Number,
  terms: { /* same structure as PostgreSQL */ },
  user_scope: { /* same structure */ },
  change_summary: String,
  ai_suggested: Boolean,
  user_modified_fields: [String],
  acknowledged_conflicts: [{ /* same structure */ }],
  effective_date: Date,
  review_date: Date,
  created_by: ObjectId,
  created_at: Date
}

// ─── collection_members ───
{
  _id: ObjectId,
  collection_id: ObjectId,
  user_id: ObjectId,
  collection_role: String,
  access_status: String,
  datasets_accessible: [String],
  datasets_pending: [String],
  assigned_at: Date,
  assigned_by: ObjectId,
  provisioned_at: Date,
  revoked_at: Date,
  revoke_reason: String
}
// compound unique index: { collection_id: 1, user_id: 1 } (partial: revoked_at null)

// ─── access_requests ───
{
  _id: ObjectId,
  requester_id: ObjectId,
  collection_id: ObjectId,
  status: String,
  intent: { /* same structure */ },
  dataset_ids: [ObjectId],
  matching_result: { /* same structure */ },
  notes: String,
  expected_duration: String,
  submitted_at: Date,
  decided_at: Date,
  decision_reason: String,
  // Embedded approval chain (simpler in document model)
  approval_chain: {
    status: String,
    all_or_nothing: Boolean,
    required_approvals: Number,
    received_approvals: Number,
    completed_at: Date,
    approvals: [{
      _id: ObjectId,
      approver_id: ObjectId,
      team: String,
      reason: String,
      decision: String,
      comment: String,
      requested_at: Date,
      due_date: Date,
      decided_at: Date,
      signature_ref: String
    }]
  },
  created_at: Date,
  updated_at: Date
}

// ─── audit_events (APPEND-ONLY) ───
{
  _id: ObjectId,
  actor_id: ObjectId,
  actor_email: String,
  actor_display_name: String,
  action: String,
  entity_type: String,
  entity_id: ObjectId,
  entity_name: String,
  payload: { /* action-specific */ },
  ip_address: String,
  user_agent: String,
  session_id: String,
  occurred_at: Date,
  ingested_at: Date
}
// indexes: { entity_type: 1, entity_id: 1, occurred_at: 1 }
// indexes: { actor_id: 1, occurred_at: 1 }
// indexes: { action: 1, occurred_at: 1 }
// TTL index on occurred_at for warm->cold tier transition (optional)

// ─── discussions ───
{
  _id: ObjectId,
  entity_type: String,
  entity_id: ObjectId,
  title: String,
  is_resolved: Boolean,
  resolved_by: ObjectId,
  resolved_at: Date,
  created_by: ObjectId,
  comments: [{               // embedded for small discussions
    _id: ObjectId,
    parent_comment_id: ObjectId,
    author_id: ObjectId,
    body: String,
    mentions: [ObjectId],
    reactions: { /* same structure */ },
    is_edited: Boolean,
    created_at: Date,
    updated_at: Date,
    deleted_at: Date
  }],
  created_at: Date,
  updated_at: Date,
  deleted_at: Date
}
// NOTE: If discussions grow beyond 16MB document limit, comments
// should be moved to a separate collection. Start embedded, migrate if needed.

// ─── notifications ───
{
  _id: ObjectId,
  user_id: ObjectId,
  type: String,
  priority: String,
  entity_type: String,
  entity_id: ObjectId,
  title: String,
  message: String,
  action_url: String,
  actors: [{ name: String, role: String }],
  read_at: Date,
  archived_at: Date,
  created_at: Date,
  expires_at: Date
}
// indexes: { user_id: 1, read_at: 1 }
// TTL index on expires_at (auto-cleanup)

// ─── External cache collections follow same pattern as PostgreSQL ───
```

### 9.3 Key Differences Between Options

| Aspect | PostgreSQL | DocumentDB |
|--------|-----------|------------|
| Junction tables | Explicit tables (`dataset_categories`, `cv_datasets`) | Often embedded arrays or denormalised |
| JSONB queries | Native JSONB operators (`->`, `->>`, `@>`) with GIN indexes | Native sub-document queries with dot notation |
| Full-text search | Built-in `tsvector`/`tsquery` with GIN indexes | Atlas Search (or application layer) |
| Transactions | Full ACID across all tables | Single-document atomic; multi-document transactions available but with caveats |
| Audit immutability | Database triggers prevent UPDATE/DELETE | Application + IAM enforcement |
| Array operations | PostgreSQL array operators (`&&`, `@>`) | Native array queries (`$in`, `$elemMatch`) |
| Enum types | Native ENUM types | String validation at application layer |
| Partial indexes | Native support | Sparse/partial filter indexes |

---

## 10. Open Questions

| # | Question | Impact | Proposed Resolution |
|---|----------|--------|---------------------|
| [Q1] | What is the exact regulatory retention period for audit events? ICH E6(R2) may require up to 15 years. | Audit trail storage architecture, cost | Confirm with Compliance team. Design for 15 years to be safe. |
| [Q2] | What are the acceptable cache staleness thresholds for each external source? | User experience, data accuracy | Proposed: AZCT = 2 hours, Cornerstone = 24 hours, Collibra = 24 hours. Validate with product team. |
| [Q3] | Should collection member changes (add/remove user) create a new collection version? | Version history granularity, storage | Proposed: Yes for bulk changes, no for individual user provisioning events (tracked via audit instead). |
| [Q4] | What is the maximum expected number of datasets per collection? | JSONB snapshot size, query performance | POC has up to 9. If production could have 100+, may need to revisit snapshot strategy. |
| [Q5] | What is the maximum expected number of members per collection? | Collection member table size, query patterns | POC generates up to 35 users. If production could have 1000+, ensure pagination is designed from day one. |
| [Q6] | Final database choice: Aurora PostgreSQL or DocumentDB? | Schema design, deployment, operations | Recommend PostgreSQL for stronger ACID guarantees, JSONB flexibility, and audit trigger support. See `02-architecture.md` for full comparison. |
| [Q7] | How should the keyword-to-category mapping (AI suggestions) be stored? | Application logic vs data model | Currently hardcoded in `KEYWORD_TO_CATEGORIES` constant. Could remain in application code, or move to a `keyword_mappings` table for dynamic updates. |
| [Q8] | What specific fields are needed for in-app digital acknowledgement to satisfy GxP/SOX audit requirements? (e.g., timestamp, IP address, user agent, session ID) | Approval data model design, compliance | Design acknowledgement capture to be comprehensive from day one. See `05-security-compliance.md` for compliance requirements. |
| [Q9] | Should the `matching_result` JSONB in access_requests store the full `RequestMatchingResult` structure including similar dataset recommendations? | Storage size, query needs | Proposed: Store full result for audit/reproducibility. Similar datasets can be large; consider storing only IDs with scores. |
| [Q10] | What AZCT API fields map to which dataset columns? | Integration accuracy | Requires AZCT API specification review. See `04-integration-map.md` for detailed field mapping. |
| [Q11] | Are there additional data modalities beyond Clinical, Genomic, Imaging, Biomarkers, Digital Devices, and Real-World Data? | Data category taxonomy completeness | Validate with domain experts. The taxonomy in the POC has 30+ categories across 6 domains. |
| [Q12] | How should duplicate detection (VS2-340) work at the data model level? | Cross-collection dataset overlap queries | Proposed: Query `collection_version_datasets` to find shared `dataset_id` values across active collections. No separate table needed. |
| [Q13] | Should the `terms` JSONB schema add a second AI/ML flag (`store_in_ai_ml_model`) separate from `ai_research`? | Immuta requires two independent booleans: "To train AI/ML models" and "To store data in AI/ML model". Current schema has only one flag. | Proposed: Add `beyond_primary_use.store_in_ai_ml_model` boolean to `terms` JSONB. This is a non-breaking addition. |
| [Q14] | Should `access_requests` or `agreement_versions` carry an `authorisation_track` field (`ida` / `adhoc`)? | Immuta distinguishes IDA (standing) from AdHoc (request-based) authorisation. Collectoid needs to know which track to use when creating Immuta records. | Proposed: Add `authorisation_track` enum to `agreement_versions` (IDA for open collections, AdHoc for request-based). |
| [Q15] | Should a `collection_intents` table be created to track per-intent review dates, or should `review_date` remain per-AoT? | Immuta tracks `Next_Review_Date` per `Data_Access_Intent`. If a collection has 5 activities, each maps to a separate intent with potentially different review dates. | Proposed: Start with per-AoT review date (current design). If review date granularity is required per-intent, introduce `collection_intents` table in a future sprint. |
| [Q16] | Does Collectoid create Immuta User Profiles or reference pre-existing profiles maintained by DPO/Immuta admin? | Affects whether Collectoid needs to generate criteria-based profile expressions or simply pass profile IDs to Immuta during provisioning. | Pending DPO team input. |

---

## Appendix A: Entity Count Estimates

| Entity | Estimated Count (Year 1) | Growth Rate | Notes |
|--------|--------------------------|-------------|-------|
| Users | 500-2,000 | Moderate | Azure AD sourced |
| Datasets | 500-5,000 | Moderate | AZCT sourced |
| Child Datasets | 2,000-25,000 | Moderate | ~5 children per parent avg |
| Data Categories | 30-50 | Low | Controlled taxonomy |
| Collections | 50-200 | Moderate | |
| Collection Versions | 500-2,000 | Moderate | ~10 versions per collection avg |
| Collection Members | 5,000-50,000 | High | Many users per collection |
| AoT Versions | 100-500 | Low | ~3 versions per AoT avg |
| Access Requests | 200-1,000 | Moderate | |
| Approval Chains | 200-1,000 | Moderate | 1:1 with requests |
| Approvals | 500-3,000 | Moderate | ~3 approvers per chain avg |
| Audit Events | 50,000-500,000 | High | Append-only, high write volume |
| Notifications | 10,000-100,000 | High | Multiple per user per day |
| Discussions | 200-1,000 | Low | |
| Comments | 1,000-5,000 | Moderate | |

---

## Appendix B: Relationship to JIRA Stories

| JIRA Story | Data Model Impact |
|------------|-------------------|
| VS2-329 (Criteria and rules) | `datasets.d_code`, `collection_version_datasets`, metadata validation via `datasets.clinical_metadata` |
| VS2-330 (User scope) | `collection_members`, `agreement_versions.user_scope` |
| VS2-331 (Due diligence) | `datasets.compliance_status`, `approvals`, `audit_events` |
| VS2-332 (Data modalities) | `collection_version_datasets.modalities`, `datasets.modalities` |
| VS2-333 (Data sources) | `collection_version_datasets.sources`, `datasets.data_location` |
| VS2-334 (Consumption environments) | `collection_versions.snapshot.consumption_environments` |
| VS2-335 (Versioning) | `collection_versions`, `agreement_versions`, snapshot versioning design |
| VS2-336 (Operations tracker) | `approval_chains`, `collection_members.access_status`, `audit_events` |
| VS2-337 (Request tracker) | `access_requests`, `approval_chains`, `approvals` |
| VS2-338 (Delivery tracker) | `collection_members.access_status`, `child_datasets.access_status` |
| VS2-339 (Approval execution) | `approval_chains`, `approvals`, `approval_chain.all_or_nothing` |
| VS2-340 (Duplicate detection) | Cross-query on `collection_version_datasets` |
| VS2-348 (Notifications) | `notifications` table |
| VS2-349 (Cross-TA coordination) | `approval_chains.all_or_nothing`, multi-row `approvals` |
| VS2-350 (Audit trail) | `audit_events` (entire Section 4) |

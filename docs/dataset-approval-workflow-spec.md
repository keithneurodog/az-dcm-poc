# Dataset Approval Workflow Implementation Specification

**Feature:** Dataset Approval & Awareness Workflow
**Page:** `/poc/1/dcm/progress` - Dataset Status Tab
**Created:** 2025-11-18
**Status:** Planning Phase

---

## Overview
Add a comprehensive approval workflow to the Dataset Status tab allowing governance team members (GPT, TALT, Publication Lead, GSP, Alliance Manager, etc.) to approve/reject/mark-as-aware dataset access requests with mandatory comments.

---

## 1. Data Structure Extensions

### Extend Dataset Interface in `/lib/dcm-mock-data.ts`

Add new approval tracking to the `Dataset` interface:

```typescript
export interface DatasetApprovalRequirement {
  id: string
  team: "GPT-Oncology" | "TALT-Legal" | "Publication Lead" | "GSP" | "Alliance Manager" | "GCL" | "IA"
  reason: string  // Why this approval is needed
  status: "pending" | "approved" | "rejected" | "aware"
  requestedDate: Date
  dueDate?: Date
}

export interface DatasetApprovalAction {
  id: string
  requirementId: string  // Links to which requirement this addresses
  action: "approved" | "rejected" | "aware"
  actorName: string
  actorEmail: string
  comment: string  // Mandatory
  timestamp: Date
}

// Add to Dataset interface:
approvalRequirements?: DatasetApprovalRequirement[]
approvalActions?: DatasetApprovalAction[]
```

**Mock data additions:**
- Create 15-20 datasets with various approval scenarios
- Some requiring single approval (GPT only)
- Some requiring multiple approvals (GPT + TALT)
- Some already approved, some pending, some with mixed status
- Realistic comments and actor information

---

## 2. Dataset Status Tab UI Modifications

### A. Eye-Catching Alert Panel (TOP of tab, before summary cards)

**Design:**
```tsx
{/* Only show if datasets have pending approvals */}
{datasetsRequiringApproval.length > 0 && (
  <Card className="border-amber-500 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-md mb-6">
    <CardContent className="p-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-100 rounded-xl">
            <AlertCircle className="size-8 text-amber-700" />
          </div>
          <div>
            <h3 className="text-xl font-normal text-amber-900 mb-1">
              {pendingApprovalCount} Approval{pendingApprovalCount !== 1 ? 's' : ''} Awaiting Decision
            </h3>
            <p className="text-sm font-light text-amber-700 mb-3">
              {datasetsRequiringApproval.length} dataset{datasetsRequiringApproval.length !== 1 ? 's' : ''} requiring approval from governance teams (GPT, TALT, etc.)
            </p>
            {/* Breakdown by team */}
            <div className="flex gap-4 text-xs font-light text-amber-800">
              {teamBreakdown.map(team => (
                <span key={team.name}>
                  {team.name}: {team.count}
                </span>
              ))}
            </div>
          </div>
        </div>
        <Button
          onClick={() => setApprovalModalOpen(true)}
          className="bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-700 hover:to-orange-700 rounded-full px-6"
        >
          <CheckCircle2 className="size-4 mr-2" />
          Review Approvals
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

**Logic:**
- Only displays when `datasets.some(d => d.approvalRequirements?.some(r => r.status === 'pending'))`
- Shows total pending count
- Breakdown by team (GPT: 3, TALT: 2, etc.)
- Primary action button opens approval modal

### B. Tab Badge

Add pending approval count badge to Dataset Status tab button:

```tsx
{
  id: "datasets",
  label: "Dataset Status",
  icon: FileText,
  badge: pendingApprovalCount, // New: count of pending approvals
  badgeColor: "amber" // Amber color scheme
}
```

### C. Expandable Dataset Rows (like User Status table)

**Dataset table modifications:**

1. Add chevron icon to each row to indicate expandability
2. Add `expandedDatasets` state to track which datasets are expanded
3. On click, expand row to show approval details

**Expanded content shows:**
```tsx
{/* Approval Requirements & History */}
{dataset.approvalRequirements && dataset.approvalRequirements.length > 0 && (
  <div className="bg-neutral-50 p-4 space-y-3">
    <h4 className="text-sm font-normal text-neutral-900">
      Approval Requirements ({dataset.approvalRequirements.length})
    </h4>

    {dataset.approvalRequirements.map(req => (
      <div key={req.id} className="border border-neutral-200 rounded-lg p-3 bg-white">
        <div className="flex items-start justify-between mb-2">
          <div>
            <Badge className={getApprovalStatusColor(req.status)}>
              {req.status.toUpperCase()}
            </Badge>
            <span className="ml-2 text-sm font-normal">{req.team}</span>
          </div>
          <span className="text-xs text-neutral-500">
            Requested: {formatDate(req.requestedDate)}
          </span>
        </div>

        <p className="text-xs font-light text-neutral-600 mb-2">
          Reason: {req.reason}
        </p>

        {/* Show approval actions for this requirement */}
        {dataset.approvalActions?.filter(a => a.requirementId === req.id).map(action => (
          <div key={action.id} className="mt-2 pl-4 border-l-2 border-neutral-300">
            <div className="flex items-center gap-2 text-xs">
              <Badge variant="outline" className="capitalize">
                {action.action}
              </Badge>
              <span className="font-normal">{action.actorName}</span>
              <span className="text-neutral-500">({action.actorEmail})</span>
              <span className="text-neutral-400">•</span>
              <span className="text-neutral-500">{formatDate(action.timestamp)}</span>
            </div>
            <p className="text-xs font-light text-neutral-600 mt-1 italic">
              "{action.comment}"
            </p>
          </div>
        ))}
      </div>
    ))}
  </div>
)}
```

**Color scheme for approval statuses:**
- Pending: `bg-amber-100 text-amber-800 border-amber-200`
- Approved: `bg-green-100 text-green-800 border-green-200`
- Rejected: `bg-red-100 text-red-800 border-red-200`
- Aware: `bg-blue-100 text-blue-800 border-blue-200`

### D. Dataset Row Indicators

Add approval status indicator column to dataset table:

```tsx
{/* Approval Status Column */}
<div className="flex flex-col gap-1">
  {dataset.approvalRequirements?.map(req => (
    <Badge key={req.id} className={cn("text-xs", getApprovalStatusColor(req.status))}>
      {req.team}: {req.status}
    </Badge>
  ))}
</div>
```

---

## 3. Approval Modal Implementation

### Modal Structure

**File:** Create reusable component or add to page component

```tsx
<Dialog open={approvalModalOpen} onOpenChange={setApprovalModalOpen}>
  <DialogContent className="!max-w-7xl rounded-2xl max-h-[90vh] flex flex-col">
    <DialogHeader>
      <DialogTitle className="text-2xl font-extralight tracking-tight">
        Review Dataset Approvals
      </DialogTitle>
      <DialogDescription className="text-sm font-light text-neutral-600">
        Select datasets to approve, reject, or mark as aware. Comments are required for all actions.
      </DialogDescription>
    </DialogHeader>

    {/* Main content area - scrollable */}
    <div className="flex-1 overflow-hidden flex flex-col">

      {/* Filters & Selection Controls */}
      <div className="border-b border-neutral-200 pb-4 mb-4 space-y-3">
        {/* Quick Filters */}
        <div className="flex gap-2 flex-wrap">
          <Select value={filterTeam} onValueChange={setFilterTeam}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Teams</SelectItem>
              <SelectItem value="GPT-Oncology">GPT-Oncology</SelectItem>
              <SelectItem value="TALT-Legal">TALT-Legal</SelectItem>
              <SelectItem value="Publication Lead">Publication Lead</SelectItem>
              {/* etc */}
            </SelectContent>
          </Select>

          <Select value={filterTA} onValueChange={setFilterTA}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Therapeutic area" />
            </SelectTrigger>
            {/* Therapeutic area options */}
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">Pending Only</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bulk Selection Controls */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllOnPage}
              className="rounded-full"
            >
              Select All on Page ({datasetsOnPage.length})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={selectAllFiltered}
              className="rounded-full"
            >
              Select All Filtered ({filteredDatasets.length})
            </Button>
            {selectedDatasets.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSelection}
                className="rounded-full"
              >
                Clear Selection
              </Button>
            )}
          </div>

          <span className="text-sm font-light text-neutral-600">
            {selectedDatasets.length} selected
          </span>
        </div>
      </div>

      {/* Scrollable Dataset List */}
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-2">
          {paginatedDatasets.map(dataset => (
            <div
              key={dataset.id}
              className={cn(
                "border rounded-xl p-4 cursor-pointer transition-all",
                selectedDatasets.includes(dataset.id)
                  ? "border-amber-400 bg-amber-50"
                  : "border-neutral-200 hover:border-neutral-300"
              )}
              onClick={() => toggleDatasetSelection(dataset.id)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={selectedDatasets.includes(dataset.id)}
                  onCheckedChange={() => toggleDatasetSelection(dataset.id)}
                  className="mt-1"
                />

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="outline" className="font-mono text-xs">
                        {dataset.code}
                      </Badge>
                      <h4 className="font-normal text-neutral-900 mt-1">
                        {dataset.name}
                      </h4>
                    </div>
                    <div className="text-right text-xs text-neutral-500">
                      {dataset.therapeuticArea.join(", ")}
                    </div>
                  </div>

                  {/* Approval requirements for this dataset */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {dataset.approvalRequirements
                      ?.filter(r => r.status === 'pending')
                      .map(req => (
                        <Badge
                          key={req.id}
                          className="bg-amber-100 text-amber-800 border-amber-200"
                        >
                          {req.team} approval needed
                        </Badge>
                      ))}
                  </div>

                  <p className="text-xs font-light text-neutral-600 mt-2">
                    {dataset.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="border-t border-neutral-200 pt-4 mt-4 flex items-center justify-between">
        <span className="text-sm font-light text-neutral-600">
          Showing {pageStart}-{pageEnd} of {filteredDatasets.length}
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousPage}
            disabled={currentPage === 1}
            className="rounded-full"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <span className="px-3 py-1 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="rounded-full"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>

    {/* Action Footer */}
    <div className="border-t border-neutral-200 pt-6 space-y-4">
      {/* Comment Input - MANDATORY */}
      <div>
        <Label htmlFor="approval-comment" className="text-sm font-normal mb-2 block">
          Comment <span className="text-red-600">*</span>
        </Label>
        <Textarea
          id="approval-comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Enter your comment (required for all actions)..."
          className="min-h-24 rounded-xl font-light"
          required
        />
        {!comment && attemptedSubmit && (
          <p className="text-xs text-red-600 mt-1">Comment is required</p>
        )}
      </div>

      {/* Action Buttons */}
      <DialogFooter className="flex gap-2">
        <Button
          variant="outline"
          onClick={() => setApprovalModalOpen(false)}
          disabled={processing}
          className="rounded-full"
        >
          Cancel
        </Button>

        <Button
          variant="outline"
          onClick={() => handleApprovalAction('aware')}
          disabled={selectedDatasets.length === 0 || processing}
          className="rounded-full border-blue-300 text-blue-700 hover:bg-blue-50"
        >
          <Bell className="size-4 mr-2" />
          Mark as Aware
        </Button>

        <Button
          variant="outline"
          onClick={() => handleApprovalAction('rejected')}
          disabled={selectedDatasets.length === 0 || processing}
          className="rounded-full border-red-300 text-red-700 hover:bg-red-50"
        >
          <XCircle className="size-4 mr-2" />
          Reject
        </Button>

        <Button
          onClick={() => handleApprovalAction('approved')}
          disabled={selectedDatasets.length === 0 || processing}
          className={cn(
            "rounded-full text-white",
            processing ? "bg-neutral-400" : "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          )}
        >
          {processing ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <CheckCircle2 className="size-4 mr-2" />
              Approve
            </>
          )}
        </Button>
      </DialogFooter>
    </div>
  </DialogContent>
</Dialog>
```

### Modal Logic

```typescript
const [approvalModalOpen, setApprovalModalOpen] = useState(false)
const [selectedDatasets, setSelectedDatasets] = useState<string[]>([])
const [comment, setComment] = useState("")
const [processing, setProcessing] = useState(false)
const [attemptedSubmit, setAttemptedSubmit] = useState(false)

// Filters
const [filterTeam, setFilterTeam] = useState("all")
const [filterTA, setFilterTA] = useState("all")
const [filterStatus, setFilterStatus] = useState("pending")

// Pagination
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 10

const handleApprovalAction = async (action: 'approved' | 'rejected' | 'aware') => {
  setAttemptedSubmit(true)

  if (!comment.trim()) {
    // Show error - comment required
    return
  }

  if (selectedDatasets.length === 0) {
    return
  }

  setProcessing(true)

  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1500))

  // Update datasets with approval actions
  // In real implementation: API call to backend
  // For POC: Update mock data in sessionStorage or state

  const actionData: DatasetApprovalAction = {
    id: generateId(),
    requirementId: '', // Would be set per requirement
    action: action,
    actorName: "Current User Name", // From auth context
    actorEmail: "user@astrazeneca.com", // From auth context
    comment: comment,
    timestamp: new Date()
  }

  // Apply to all selected datasets
  // Update their approval requirements status and add approval action

  setProcessing(false)
  setComment("")
  setSelectedDatasets([])
  setApprovalModalOpen(false)

  // Show success toast/notification
  // Update UI to reflect changes
}
```

---

## 4. Notification System Integration

### A. Smart Recommendations Panel (Overview Tab)

Add high-priority recommendation when approvals are pending:

```typescript
const recommendations = [
  // Only if there are pending approvals
  ...(pendingApprovalCount > 0 ? [{
    id: "pending-approvals",
    type: "action_required" as const,
    title: `${pendingApprovalCount} dataset approval${pendingApprovalCount !== 1 ? 's' : ''} awaiting decision`,
    description: `${datasetsRequiringApproval.length} dataset${datasetsRequiringApproval.length !== 1 ? 's' : ''} require approval from governance teams`,
    action: {
      label: "Review Approvals",
      onClick: () => {
        setActiveTab("datasets") // Switch to Dataset Status tab
        setTimeout(() => {
          // Scroll to approval panel or open modal
          setApprovalModalOpen(true)
        }, 300)
      }
    },
    dismissable: false
  }] : []),

  // ... other recommendations
]
```

### B. Global Notification (if exists)

If there's a global notification system in the app header:

```typescript
// Add to notifications array when approvals pending
{
  id: "dataset-approvals-pending",
  type: "warning",
  title: "Approvals Required",
  message: `${pendingApprovalCount} dataset approval${pendingApprovalCount !== 1 ? 's' : ''} awaiting your decision`,
  link: "/poc/1/dcm/progress?tab=datasets",
  priority: "high",
  timestamp: new Date()
}
```

---

## 5. State Management

### Key State Variables

```typescript
// Approval modal
const [approvalModalOpen, setApprovalModalOpen] = useState(false)
const [selectedDatasets, setSelectedDatasets] = useState<string[]>([])
const [comment, setComment] = useState("")
const [processing, setProcessing] = useState(false)
const [attemptedSubmit, setAttemptedSubmit] = useState(false)

// Filters in modal
const [filterTeam, setFilterTeam] = useState<string>("all")
const [filterTA, setFilterTA] = useState<string>("all")
const [filterStatus, setFilterStatus] = useState<string>("pending")

// Pagination
const [currentPage, setCurrentPage] = useState(1)
const itemsPerPage = 10

// Dataset expansion (like user table)
const [expandedDatasets, setExpandedDatasets] = useState<Set<string>>(new Set())

// Computed values
const datasetsRequiringApproval = datasets.filter(d =>
  d.approvalRequirements?.some(r => r.status === 'pending')
)

const pendingApprovalCount = datasetsRequiringApproval.reduce(
  (sum, d) => sum + (d.approvalRequirements?.filter(r => r.status === 'pending').length || 0),
  0
)

const teamBreakdown = calculateTeamBreakdown(datasetsRequiringApproval)
```

---

## 6. Design Consistency

### Follow Existing Patterns

**Colors:**
- Approval panel: Amber gradient (`from-amber-50 to-orange-50`, border `border-amber-500`)
- Pending badges: `bg-amber-100 text-amber-800 border-amber-200`
- Approved: `bg-green-100 text-green-800 border-green-200`
- Rejected: `bg-red-100 text-red-800 border-red-200`
- Aware: `bg-blue-100 text-blue-800 border-blue-200`

**Typography:**
- Headers: `font-extralight` or `font-light`
- Body: `font-light`
- Emphasis: `font-normal`
- Never `font-bold`

**Spacing:**
- Cards: `gap-6` between sections
- Rounded corners: `rounded-xl` for cards, `rounded-2xl` for modals, `rounded-full` for buttons

**Icons:**
- Use `strokeWidth={1.5}` for consistency
- Icon size: `size-4` for buttons, `size-5` for badges, `size-8` for large alerts

---

## 7. Files to Modify

### Primary Changes

1. **`/app/poc/1/dcm/progress/page.tsx`**
   - Add approval panel before summary cards
   - Add tab badge for pending approvals
   - Make dataset rows expandable to show approval history
   - Add approval modal component
   - Add state management for approval workflow
   - Add recommendation for pending approvals

2. **`/lib/dcm-mock-data.ts`**
   - Extend `Dataset` interface with approval fields
   - Add `DatasetApprovalRequirement` interface
   - Add `DatasetApprovalAction` interface
   - Create mock data for 15-20 datasets with various approval scenarios

### Optional/Future

3. **Create separate component:** `/components/dataset-approval-modal.tsx` (if modal becomes complex)

---

## 8. Testing Scenarios

### Mock Data Scenarios to Create

1. **Dataset with single pending approval** (GPT-Oncology)
2. **Dataset with multiple pending approvals** (GPT + TALT)
3. **Dataset with mixed status** (GPT approved, TALT pending)
4. **Dataset fully approved** (all requirements approved)
5. **Dataset with rejection** (at least one requirement rejected)
6. **Dataset with awareness** (marked as aware by someone)
7. **Dataset with multiple actions on same requirement** (approved by multiple people)
8. **Large dataset list** (100+ datasets for pagination testing)

### User Flows to Test

1. Open Dataset Status tab → See alert panel → Click "Review Approvals"
2. Filter by team → Select datasets → Add comment → Approve
3. Select All (filtered) with 50+ datasets → Approve
4. Attempt to approve without comment → See validation error
5. Expand dataset row → See approval history with comments
6. Mark dataset as "Aware" → See "Awareness: user@email" in history
7. Navigate from Overview recommendation → Opens modal

---

## 9. Implementation Order

### Phase 1: Data & Structure (Day 1)
1. Extend data interfaces in `dcm-mock-data.ts`
2. Create mock approval data for 15-20 datasets
3. Add computed values for pending counts

### Phase 2: Dataset Tab Enhancements (Day 2)
1. Add alert panel at top of Dataset Status tab
2. Add tab badge showing pending count
3. Make dataset rows expandable (like user table)
4. Show approval requirements and history in expanded view

### Phase 3: Approval Modal (Day 3-4)
1. Create modal structure with pagination
2. Add quick filters (team, TA, status)
3. Implement checkbox selection (individual + bulk)
4. Add comment input with validation
5. Add three action buttons (Approve/Reject/Aware)
6. Implement action handler logic

### Phase 4: Integration & Polish (Day 5)
1. Add recommendation to Overview tab
2. Wire up all click handlers and navigation
3. Test all scenarios
4. Polish animations and transitions
5. Ensure design consistency

---

## 10. Success Criteria

✅ Approval panel visible when datasets have pending approvals
✅ Tab badge shows accurate pending count
✅ Modal loads with paginated dataset list (handles 100+ datasets)
✅ Filters work correctly (team, TA, status)
✅ Bulk selection works (page, filtered)
✅ Comment validation prevents submission without comment
✅ All three actions work (Approve/Reject/Aware)
✅ Dataset rows expand to show approval history
✅ History displays: action type, actor name/email, comment, timestamp
✅ Multiple approvals per dataset tracked separately
✅ UI updates after approval action
✅ Notification/recommendation links to Dataset Status tab
✅ Design matches existing zen aesthetic

---

## 11. Approval Business Rules (from approval-tables docs)

### Roles & Teams

**Approval Authorities:**
- **GPT (Governance Project Team)** - Domain-specific approvals (e.g., GPT-Oncology, GPT-Cardiovascular)
- **TALT (Legal Team)** - Cross-geography data, GDPR compliance
- **GCL (Global Clinical Lead)** - Clinical domain approvals
- **IA (Information Advocate)** - Certain data categories
- **Publication Lead** - When publication is intended
- **GSP (Safety Representative)** - Safety-related data
- **Alliance Manager** - Product collaboration datasets

### Approval vs Awareness Logic

**APPROVAL required when:**
- Study status = Ongoing (active studies)
- Legal status has restrictions
- Cross-geography data (GDPR considerations)
- Product collaboration involved
- Active study data requiring governance review

**AWARENESS only (no formal approval) when:**
- Study status = Closed
- Legal status = Allowed with no restrictions
- No cross-geography concerns
- Published/historical datasets
- Routine research requests meeting all "ready to grant" criteria

### Multi-Approval Scenarios

A single dataset can require multiple approvals:
- **Example 1:** Active study + Product collaboration → GPT + Alliance Manager both must approve
- **Example 2:** Cross-geography data → GPT + TALT both must approve
- **Each approval is tracked separately** as its own requirement
- Dataset access granted only when ALL required approvals are received

### 20/30/40/10 Access Provisioning Model

- **20% Already Open** - For 50% of users, no action needed
- **30% Ready to Grant** - DCM confirms → Collectoid updates Immuta → instant access
- **40% Needs Approval** - Routed to GPT/TALT → formal approval → policy update
- **10% Missing Location** - Data discovery workflow
- **10% Training Blocked** - Automatic grant after training completion

---

## 12. Terminology & Display

### Action Verbs
- **Button labels:**
  - "Approve" → for approval action
  - "Reject" → for rejection action
  - "Mark as Aware" → for awareness action

### History Display
When showing who took action:
- **Approved by:** [Name] ([email])
- **Rejected by:** [Name] ([email])
- **Awareness:** [Name] ([email])

**Example:**
```
GPT-Oncology Approval
Status: APPROVED
Approved by: Dr. Sarah Martinez (sarah.martinez@astrazeneca.com)
Comment: "All governance criteria met. Clinical data review complete."
Date: Nov 15, 2025, 14:23
```

---

## Notes

- **Actor tracking**: Record full name and email from mock user session (for POC, can hardcode or use simple user context)
- **Multi-approval**: Each dataset can have multiple requirements; each requirement can have multiple actions (for audit trail)
- **Pagination**: Default 10 items per page, adjustable if needed
- **Real-time updates**: For POC, immediate state update; in production would poll API or use WebSocket
- **Comment requirement**: Enforced on all three actions (Approve/Reject/Aware) - prevents submission without comment
- **No role-based filtering for POC**: All users see all pending approvals, system tracks who took action
- **Expandable rows pattern**: Follows existing User Status tab implementation for consistency

---

## Related Documentation

- `/docs/dcm-progress-dashboard-improvements.md` - Overall progress dashboard spec
- `/docs/approval-tables/` - Screenshots showing approval rules and roles
- `/docs/collectoid-poc-requirements.md` - Complete POC requirements
- `/docs/dcm-workflow-learnings.md` - DCM workflow analysis

---

**End of Specification**
